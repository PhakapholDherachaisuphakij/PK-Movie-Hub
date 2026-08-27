import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Parse CLI arguments (e.g. node script.js TARGET_KEY=... or node script.js "eyJhb...")
let cliKey = null;
let cliUrl = null;

for (const arg of process.argv.slice(2)) {
  if (arg.includes('=')) {
    const [k, ...vParts] = arg.split('=');
    const val = vParts.join('=').trim();
    if (k.toLowerCase().includes('url')) cliUrl = val;
    if (k.toLowerCase().includes('key') || k.toLowerCase().includes('role') || k.toLowerCase().includes('secret')) cliKey = val;
  } else if (arg.startsWith('ey') || arg.length > 30) {
    cliKey = arg.trim();
  }
}

// Target Self-Hosted Supabase configuration
const TARGET_URL =
  cliUrl ||
  process.env.TARGET_SUPABASE_URL ||
  'https://homelab.tail7d4c51.ts.net';

const TARGET_KEY =
  cliKey ||
  process.env.TARGET_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.TARGET_SUPABASE_ANON_KEY;

if (!TARGET_KEY || !/^[\x20-\x7E]+$/.test(TARGET_KEY) || TARGET_KEY.includes('your_') || TARGET_KEY.includes('ใส่') || TARGET_KEY.includes('ค่า')) {
  console.error('\n❌ ข้อผิดพลาด: ไม่พบค่า Supabase Key ที่ถูกต้อง');
  console.error('กรุณานำค่า SERVICE_ROLE_KEY หรือ ANON_KEY จริงๆ ที่เป็นรหัสยาวๆ เช่น:');
  console.error('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\n');
  console.error('ตัวอย่างการรัน:');
  console.error('node scripts/migrate_to_selfhost.js TARGET_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."\n');
  console.error('หรือนำไปวางในไฟล์ .env ที่บรรทัด:');
  console.error('SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\n');
  process.exit(1);
}

console.log('🚀 Target Supabase:', TARGET_URL);
const targetSupabase = createClient(TARGET_URL, TARGET_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

function getMimeType(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  switch (ext) {
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.webp': return 'image/webp';
    case '.gif': return 'image/gif';
    case '.svg': return 'image/svg+xml';
    default: return 'application/octet-stream';
  }
}

function extractFilename(url) {
  if (!url || typeof url !== 'string') return null;
  const parts = url.split('/');
  let filename = parts[parts.length - 1];
  filename = filename.split('?')[0];
  return decodeURIComponent(filename);
}

function buildNewUrl(filename, bucket = 'image') {
  if (!filename) return null;
  return `${TARGET_URL.replace(/\/+$/, '')}/storage/v1/object/public/${bucket}/${filename}`;
}

async function runFullMigration() {
  console.log('\n======================================================');
  console.log('📦 Step 1: Uploading Storage Assets (Bucket: "image")');
  console.log('======================================================');

  const storageDir = path.resolve(__dirname, 'storage_backup/image');
  if (fs.existsSync(storageDir)) {
    const files = fs.readdirSync(storageDir);
    console.log(`Found ${files.length} images to upload.`);
    let success = 0;
    let failed = 0;

    for (const fileName of files) {
      const filePath = path.join(storageDir, fileName);
      const fileBuffer = fs.readFileSync(filePath);
      const mimeType = getMimeType(fileName);

      const { error } = await targetSupabase.storage
        .from('image')
        .upload(fileName, fileBuffer, {
          contentType: mimeType,
          upsert: true,
        });

      if (error) {
        console.warn(`⚠️  Upload failed for ${fileName}:`, error.message);
        failed++;
      } else {
        console.log(`✅ Uploaded: ${fileName}`);
        success++;
      }
    }
    console.log(`Storage upload finished: ${success} uploaded, ${failed} failed.`);
  }

  console.log('\n======================================================');
  console.log('🗄️ Step 2: Migrating All Database Tables');
  console.log('======================================================');

  const dumpDir = path.resolve(__dirname, 'full_database_dump');
  const tables = ['Store', 'profiles', 'projects', 'skills', 'user_identity', 'life_logs', 'todos'];

  for (const table of tables) {
    const filePath = path.join(dumpDir, `${table}.json`);
    if (!fs.existsSync(filePath)) {
      console.log(`ℹ️  Table dump not found for [${table}], skipping.`);
      continue;
    }

    let records = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    if (!Array.isArray(records) || records.length === 0) {
      console.log(`ℹ️  Table [${table}] is empty.`);
      continue;
    }

    console.log(`\nMigrating Table [${table}] (${records.length} records)...`);

    // Rewrite URLs if needed
    if (table === 'Store') {
      records = records.map((m) => {
        const fn = extractFilename(m.src);
        return { ...m, src: fn ? buildNewUrl(fn, 'image') : m.src };
      });
    } else if (table === 'profiles') {
      records = records.map((p) => {
        const fn = extractFilename(p.avatar_url);
        return { ...p, avatar_url: fn ? buildNewUrl(fn, 'image') : p.avatar_url };
      });
    }

    const { error: upsertError } = await targetSupabase
      .from(table)
      .upsert(records, { onConflict: 'id' });

    if (upsertError) {
      console.error(`❌ Error migrating [${table}]:`, upsertError.message);
    } else {
      console.log(`✅ Successfully migrated ${records.length} records into [${table}]!`);
    }
  }

  console.log('\n======================================================');
  console.log('🎉 ALL DATA & ASSETS MIGRATED SUCCESSFULLY TO SELF-HOST!');
  console.log('======================================================\n');
}

runFullMigration().catch((err) => {
  console.error('Fatal migration error:', err);
  process.exit(1);
});
