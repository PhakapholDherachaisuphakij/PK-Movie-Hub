import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env file.');
  process.exit(1);
}

console.log('Connecting to Supabase at:', supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to download file with retries
async function downloadFile(url: string, retries = 5, delayMs = 5000): Promise<{ buffer: ArrayBuffer; contentType: string }> {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Downloading ${url} (Attempt ${i + 1}/${retries})...`);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const contentType = response.headers.get('content-type') || 'image/jpeg';
      const buffer = await response.arrayBuffer();
      return { buffer, contentType };
    } catch (err: any) {
      console.warn(`Failed to download (Attempt ${i + 1}/${retries}): ${err.message}`);
      if (i < retries - 1) {
        console.log(`Waiting ${delayMs / 1000}s before next attempt (the Supabase instance might be waking up)...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      } else {
        throw err;
      }
    }
  }
  throw new Error('Failed to download file after maximum retries');
}

// Helper to clean and extract filename from Supabase URL
function getFilenameFromUrl(url: string): string {
  // Example: https://isewznoytpettlrsdrtc.supabase.co/storage/v1/object/public/image//twinkling-watermelon.png
  // Or: https://isewznoytpettlrsdrtc.supabase.co/storage/v1/object/public/avatars/pk.png
  const parts = url.split('/');
  let filename = parts[parts.length - 1];
  // Remove any query params
  filename = filename.split('?')[0];
  return decodeURIComponent(filename);
}

async function migrateMovies() {
  console.log('\n--- MIGRATING MOVIES ---');
  // Fetch all movies
  const { data: movies, error } = await supabase.from('Store').select('*');
  if (error) {
    console.error('Error fetching Store table:', error.message);
    return [];
  }

  console.log(`Found ${movies.length} movies in Store table.`);
  const migratedMovies: any[] = [];

  for (const movie of movies) {
    const oldUrl = movie.src;
    if (oldUrl && oldUrl.includes('isewznoytpettlrsdrtc.supabase.co')) {
      console.log(`\nMigrating movie: "${movie.title}"`);
      const filename = getFilenameFromUrl(oldUrl);
      console.log(`Filename: ${filename}`);

      try {
        // Download image
        const { buffer, contentType } = await downloadFile(oldUrl);

        // Upload to new Supabase
        console.log(`Uploading ${filename} to "image" bucket...`);
        const { error: uploadError } = await supabase.storage
          .from('image')
          .upload(filename, buffer, {
            contentType,
            upsert: true,
          });

        if (uploadError) {
          console.error(`Upload failed for ${filename}:`, uploadError.message);
          continue;
        }

        // Get new public URL
        const { data: publicUrlData } = supabase.storage
          .from('image')
          .getPublicUrl(filename);

        const newUrl = publicUrlData.publicUrl;
        console.log(`New URL: ${newUrl}`);

        // Update database
        console.log(`Updating DB record for movie "${movie.title}"...`);
        const { error: updateError } = await supabase
          .from('Store')
          .update({ src: newUrl })
          .eq('id', movie.id);

        if (updateError) {
          console.error(`DB update failed for "${movie.title}":`, updateError.message);
          continue;
        }

        console.log(`Successfully migrated "${movie.title}"!`);
        migratedMovies.push({ ...movie, src: newUrl });
      } catch (err: any) {
        console.error(`Failed to migrate movie "${movie.title}":`, err.message);
      }
    } else {
      console.log(`Skipping movie "${movie.title}" (already on new Supabase or local: ${oldUrl})`);
      migratedMovies.push(movie);
    }
  }

  return migratedMovies;
}

async function migrateProfiles() {
  console.log('\n--- MIGRATING PROFILES ---');
  // Load profiles backup to see what should be migrated
  const profilesBackupPath = path.resolve(__dirname, 'profiles_backup.json');
  if (!fs.existsSync(profilesBackupPath)) {
    console.warn(`profiles_backup.json not found at ${profilesBackupPath}. Skipping profiles migration.`);
    return;
  }

  const profilesData = JSON.parse(fs.readFileSync(profilesBackupPath, 'utf-8'));
  console.log(`Found ${profilesData.length} profiles in backup.`);

  // Check if we can write to profiles table
  // Let's first try to see if table exists by doing a select limit 1
  const { data: testData, error: testError } = await supabase.from('profiles').select('*').limit(1);
  const tableExists = !testError;
  if (!tableExists) {
    console.warn('profiles table does not exist in new database or is not queryable:', testError?.message);
    console.log('We will still migrate the files and update the local backup.');
  }

  // Ensure avatars bucket exists in new Supabase, or upload to image bucket
  // We can try uploading to 'avatars' first.
  let bucketName = 'avatars';
  const testFile = new Uint8Array([1, 2, 3]);
  const { error: testUploadError } = await supabase.storage.from('avatars').upload('.test-temp', testFile, { upsert: true });
  
  if (testUploadError && testUploadError.message.includes('not found')) {
    console.log('avatars bucket not found. Using "image" bucket for avatars instead.');
    bucketName = 'image';
  } else {
    // clean up test file
    await supabase.storage.from('avatars').remove(['.test-temp']);
  }

  const migratedProfiles: any[] = [];

  for (const profile of profilesData) {
    const oldUrl = profile.avatar_url;
    let newUrl = oldUrl;

    if (oldUrl && oldUrl.includes('isewznoytpettlrsdrtc.supabase.co')) {
      console.log(`\nMigrating avatar for user: "${profile.display_name}"`);
      const filename = getFilenameFromUrl(oldUrl);

      try {
        const { buffer, contentType } = await downloadFile(oldUrl);

        console.log(`Uploading ${filename} to "${bucketName}" bucket...`);
        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filename, buffer, {
            contentType,
            upsert: true,
          });

        if (uploadError) {
          console.error(`Upload failed for avatar ${filename}:`, uploadError.message);
          continue;
        }

        const { data: publicUrlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filename);

        newUrl = publicUrlData.publicUrl;
        console.log(`New avatar URL: ${newUrl}`);
      } catch (err: any) {
        console.error(`Failed to migrate avatar for user "${profile.display_name}":`, err.message);
      }
    }

    const updatedProfile = { ...profile, avatar_url: newUrl };
    migratedProfiles.push(updatedProfile);

    // If table exists, upsert to profiles table
    if (tableExists) {
      console.log(`Upserting profile record for "${profile.display_name}" to DB...`);
      // columns in new table: id, name, nickname, level, role, description, streak, total_xp, quote, avatar_url, created_at
      const { error: upsertError } = await supabase.from('profiles').upsert({
        id: profile.id,
        name: profile.display_name,
        nickname: profile.display_name,
        avatar_url: newUrl,
        // Keep defaults or empty for others
      });

      if (upsertError) {
        console.error(`Failed to upsert profile for "${profile.display_name}" to DB:`, upsertError.message);
      } else {
        console.log(`Successfully upserted profile for "${profile.display_name}"!`);
      }
    }
  }

  // Update profiles_backup.json
  console.log(`Updating profiles_backup.json...`);
  fs.writeFileSync(profilesBackupPath, JSON.stringify(migratedProfiles, null, 4), 'utf-8');
  console.log('profiles_backup.json updated!');
}

async function updateLocalMovieBackups(migratedMovies: any[]) {
  console.log('\n--- UPDATING LOCAL BACKUPS ---');
  if (migratedMovies.length === 0) {
    console.log('No movie backups to update.');
    return;
  }

  // 1. root movies_backup.json
  const rootBackupPath = path.resolve(__dirname, '../movies_backup.json');
  if (fs.existsSync(rootBackupPath)) {
    console.log(`Updating root movies_backup.json at ${rootBackupPath}...`);
    // Format backups similar to how they were (id, src, title, description, category, genre, ratings, created_at, hot)
    // Map movies back to exactly the structure in the backup
    const formattedBackup = migratedMovies.map(m => ({
      id: m.id,
      src: m.src,
      title: m.title,
      description: m.description,
      category: m.category,
      genre: m.genre,
      ratings: m.ratings,
      created_at: m.created_at,
      hot: m.hot === 'true' || m.hot === true // write standard boolean or keep it
    }));
    fs.writeFileSync(rootBackupPath, JSON.stringify(formattedBackup, null, 4), 'utf-8');
    console.log('Root movies_backup.json updated!');
  }

  // 2. scripts/movies_backup.json
  const scriptsBackupPath = path.resolve(__dirname, 'movies_backup.json');
  if (fs.existsSync(scriptsBackupPath)) {
    console.log(`Updating scripts/movies_backup.json at ${scriptsBackupPath}...`);
    const formattedBackup = migratedMovies.map(m => ({
      id: m.id,
      src: m.src,
      title: m.title,
      description: m.description,
      category: m.category,
      genre: m.genre,
      ratings: m.ratings,
      created_at: m.created_at,
      hot: m.hot === 'true' || m.hot === true
    }));
    fs.writeFileSync(scriptsBackupPath, JSON.stringify(formattedBackup, null, 4), 'utf-8');
    console.log('scripts/movies_backup.json updated!');
  }
}

async function main() {
  console.log('Starting Supabase Asset Migration...\n');
  try {
    const migratedMovies = await migrateMovies();
    await updateLocalMovieBackups(migratedMovies);
    await migrateProfiles();
    console.log('\nMigration process completed successfully!');
  } catch (err: any) {
    console.error('Fatal error during migration:', err.message);
  }
}

main();
