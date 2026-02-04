/**
 * PostgreSQL connection pool
 */

import { Pool } from 'pg';
import { config } from '../config';
import { logger } from '../logger';

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: config.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      ssl: config.APP_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });

    pool.on('error', (err) => {
      logger.error('Unexpected error on idle PostgreSQL client', err);
    });

    logger.info('PostgreSQL pool initialized', { database: config.DATABASE_URL.split('@')[1] });
  }

  return pool;
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    logger.info('PostgreSQL pool closed');
  }
}

