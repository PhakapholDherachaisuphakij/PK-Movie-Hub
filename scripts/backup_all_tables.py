import os
import json
from supabase import create_client
from dotenv import load_dotenv

# Load .env from parent directory
current_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(current_dir, '..', '.env')
load_dotenv(dotenv_path=env_path)

url = os.getenv('VITE_SUPABASE_URL')
key = os.getenv('VITE_SUPABASE_ANON_KEY')

if not url or not key:
    raise EnvironmentError('Supabase URL or ANON KEY not found in environment variables')

supabase = create_client(url, key)

# We know 'movies' exists from the code. We can also try other common names.
tables_to_try = ['movies', 'users', 'profiles', 'genres', 'favorites', 'reviews']

def backup():
    for table in tables_to_try:
        try:
            print(f"Attempting to backup table: {table}")
            response = supabase.table(table).select('*').execute()
            
            # If successful, save to file
            data = response.data
            if data is not None:
                output_file = os.path.join(current_dir, f'{table}_backup.json')
                with open(output_file, 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=4)
                print(f"Backup {table} success! Saved to {output_file}")
            else:
                print(f"Table {table} returned no data or does not exist.")
        except Exception as e:
            # Check if it's a "relation does not exist" error
            error_str = str(e)
            if 'does not exist' in error_str or '42P01' in error_str:
                print(f"Table {table} does not exist (Relation not found).")
            else:
                print(f"Error with table {table}: {e}")

if __name__ == '__main__':
    backup()
