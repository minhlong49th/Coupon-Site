import { Pool } from 'pg';

let pool: Pool | null = null;

if (typeof window === 'undefined' && process.env.DATABASE_URL) {
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
    pool.on('error', (err) => {
      console.error('Unexpected error on idle pg client', err);
    });
  } catch (e) {
    console.error('Failed to create pg Pool:', e);
  }
}

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  if (!pool) {
    throw new Error('Database is not initialized (DATABASE_URL not set)');
  }
  const res = await pool.query(text, params);
  return res.rows;
}

export function isDatabaseConnected(): boolean {
  return !!pool;
}
