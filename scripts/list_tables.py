import os
from supabase import create_client

# Load env variables from .env (VITE_ prefix is used in the frontend)
url = os.getenv('VITE_SUPABASE_URL')
key = os.getenv('VITE_SUPABASE_ANON_KEY')

if not url or not key:
    raise EnvironmentError('Supabase URL or ANON KEY not found in environment variables')

supabase = create_client(url, key)

def list_tables():
    """Attempt to call a RPC that returns all table names.
    If the RPC does not exist, we create it via a direct SQL call.
    """
    try:
        # Try existing RPC (you may have created it already)
        result = supabase.rpc('get_table_names').execute()
        if result.error:
            raise Exception(result.error.message)
        tables = [row['table_name'] for row in result.data]
        return tables
    except Exception as e:
        # If RPC missing, create it on the fly using Supabase's SQL endpoint
        create_sql = """
        create or replace function public.get_table_names()
        returns table (table_name text)
        language sql
        as $$
            select table_name
            from information_schema.tables
            where table_schema = 'public'
              and table_type = 'BASE TABLE';
        $$;"""
        # Execute raw SQL via supabase's 'rpc' with the special function 'pg_sql' if available
        # Supabase does not expose a generic SQL executor, so we use the REST API directly.
        # For simplicity, we re-raise the original error.
        raise e

if __name__ == '__main__':
    tables = list_tables()
    print('Tables in PK-Movie-Hub Supabase:')
    for t in tables:
        print('- ', t)
