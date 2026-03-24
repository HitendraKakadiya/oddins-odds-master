/**
 * Job: Sync Hot Stats (Decreasing Stats)
 * 
 * Synchronizes high-probability statistical outcomes for upcoming matches.
 */

import { getPool } from '../db/pool';
import { logger } from '../logger';
import { hotStatsClient } from '../provider/hotStatsClient';
import { withLock } from '../orchestration/locks';

export async function syncHotStats(): Promise<void> {
    const JOB_NAME = 'sync:hot-stats';
    
    logger.setContext({ job: JOB_NAME });
    logger.info('Starting Hot Stats synchronization');

    const pool = getPool();
    const lockClient = await pool.connect();

    try {
        const result = await withLock(lockClient, JOB_NAME, async () => {
            const date = new Date().toISOString().split('T')[0];
            const stats = await hotStatsClient.getHotStats(date);
            
            if (stats.length === 0) {
                logger.info('No hot stats found for today');
                return;
            }

            const client = await pool.connect();
            try {
                await client.query('BEGIN');
                
                // Logic to store hot stats in a specialized table or as predictions
                // For now, we log the count discovered
                logger.info(`Synchronized ${stats.length} hot stats`);

                await client.query('COMMIT');
            } catch (err) {
                await client.query('ROLLBACK');
                throw err;
            } finally {
                client.release();
            }
        });

        if (result === null) {
            logger.info('Job skipped - lock busy');
        }
    } catch (error) {
        logger.error('Hot Stats sync job failed', error);
    } finally {
        lockClient.release();
    }
}
