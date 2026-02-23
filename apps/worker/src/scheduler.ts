/**
 * Worker Scheduler
 * 
 * Orchestrates periodic execution of sync jobs using node-cron.
 */

import cron from 'node-cron';
import { logger } from './logger';
import { syncFixturesWindow } from './jobs/syncDailyFixtures';
import { syncOdds } from './jobs/syncOdds';
import { syncPredictions } from './jobs/syncPredictions';
import { cleanupOldData } from './jobs/cleanup';

export function startScheduler() {
    logger.info('Starting worker scheduler...');

    // Sync Fixtures: Every hour at minute 0
    cron.schedule('0 * * * *', async () => {
        logger.info('Running scheduled job: sync:daily_fixtures (window)');
        try {
            await syncFixturesWindow(10, 14);
        } catch (error) {
            logger.error('Scheduled job sync:daily_fixtures failed', error);
        }
    }, { timezone: 'UTC' });

    // Sync Odds: Every hour at minute 30
    cron.schedule('30 * * * *', async () => {
        logger.info('Running scheduled job: sync:odds');
        try {
            await syncOdds();
        } catch (error) {
            logger.error('Scheduled job sync:odds failed', error);
        }
    }, { timezone: 'UTC' });

    // Sync Predictions: Every hour at minute 45
    cron.schedule('45 * * * *', async () => {
        logger.info('Running scheduled job: sync:predictions');
        try {
            await syncPredictions();
        } catch (error) {
            logger.error('Scheduled job sync:predictions failed', error);
        }
    }, { timezone: 'UTC' });

    // Cleanup: Every day at 03:00 AM
    cron.schedule('0 3 * * *', async () => {
        logger.info('Running scheduled job: cleanup:old_data');
        try {
            await cleanupOldData(10);
        } catch (error) {
            logger.error('Scheduled job cleanup:old_data failed', error);
        }
    }, { timezone: 'UTC' });

    logger.info('Scheduler started. Jobs configured (UTC):');
    logger.info('- sync:daily_fixtures (Every hour at :00 UTC)');
    logger.info('- sync:odds (Every hour at :30 UTC)');
    logger.info('- sync:predictions (Every hour at :45 UTC)');
    logger.info('- cleanup:old_data (Daily at 03:00 UTC)');
}
