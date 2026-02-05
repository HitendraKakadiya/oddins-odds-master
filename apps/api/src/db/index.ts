import { Pool, PoolClient } from 'pg';

// Support both DATABASE_URL (for local dev) and individual components (for production)
const DATABASE_URL = process.env.DATABASE_URL ||
  (process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD
    ? `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'oddins_odds'}`
    : undefined);

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL or DB_* environment variables are required');
}

export const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await pool.end();
  process.exit(0);
});

// Helper to get a client from the pool
export async function getClient(): Promise<PoolClient> {
  return await pool.connect();
}

// Helper for simple queries
export async function query(text: string, params?: any[]) {
  return await pool.query(text, params);
}

