import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  try {
    const backupFilePath = path.resolve(__dirname, '../movies_backup.json');
    if (!fs.existsSync(backupFilePath)) {
      console.error(`Backup file not found at: ${backupFilePath}`);
      process.exit(1);
    }

    const fileContent = fs.readFileSync(backupFilePath, 'utf-8');
    const records = JSON.parse(fileContent);

    console.log(`Found ${records.length} records in movies_backup.json. Starting upload to 'Store' table...`);

    // We can insert records in batches or all at once. 
    // Supabase supports bulk insert.
    const { data, error } = await supabase
      .from('Store')
      .insert(records);

    if (error) {
      console.error('Error inserting records:', error);
      process.exit(1);
    }

    console.log('Successfully inserted all records into the Store table!');
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

main();
