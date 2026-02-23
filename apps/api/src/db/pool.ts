import { Pool, PoolConfig } from 'pg';

let pool: Pool;

export function getPool(): Pool {
    if (!pool) {
        const config: PoolConfig = {
            connectionString: process.env.DATABASE_URL,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        };

        pool = new Pool(config);

        pool.on('error', (err: Error) => {
            console.error('Unexpected error on idle client', err);
            process.exit(-1);
        });
    }

    return pool;
}
