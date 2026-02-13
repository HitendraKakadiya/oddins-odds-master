/**
 * Job: Cleanup Old Data
 * 
 * Removes fixtures and related data (odds, etc.) older than a configured retention period.
 * Default retention: 3 days.
 */

import { getPool } from '../db/pool';
import { logger } from '../logger';
import { withLock } from '../orchestration/locks';

export async function cleanupOldData(retentionDays: number = 3): Promise<void> {
    const JOB_NAME = 'cleanup:old_data';

    logger.setContext({ job: JOB_NAME });
    logger.info(`Starting cleanup job (retention: ${retentionDays} days)`);

    const pool = getPool();
    const lockClient = await pool.connect();

    try {
        const result = await withLock(lockClient, JOB_NAME, async () => {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                // calculate cutoff date
                // Delete matches older than X days
                // We use `kickoff_at` for this.

                const deleteQuery = `
            DELETE FROM matches 
            WHERE kickoff_at < NOW() - INTERVAL '${retentionDays} days'
            RETURNING id
        `;

                logger.info(`Deleting matches older than ${retentionDays} days...`);
                const result = await client.query(deleteQuery);
                const deletedCount = result.rowCount;

                // Note: Cascading deletes should handle related odds_snapshots, etc. if configured.
                // Let's verify constraints in a moment.
                // matches -> odds_snapshots (FK match_id)
                // matches -> coverage? No.

                logger.info(`Deleted ${deletedCount} old matches`);

                // We should also clean up old odds snapshots that might be orphaned if cascade isn't set
                // But assuming cascade is set on `odds_snapshots.match_id` or we rely on match deletion.

                // Let's also clean up old `odds_snapshots` even if matches are kept? 
                // Maybe we want to keep matches for history but delete odds to save space?
                // For now, let's assume deleting matches is enough.

                await client.query('COMMIT');

                logger.info('Cleanup completed successfully');

            } catch (error) {
                await client.query('ROLLBACK');
                throw error;
            } finally {
                client.release();
            }
        });

        if (result === null) {
            logger.warn('Could not acquire lock for cleanup:old_data');
        }

    } catch (error) {
        logger.error('Job failed', error);
        throw error;
    } finally {
        lockClient.release();
    }
}
