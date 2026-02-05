/**
 * Job: Sync Leagues & Seasons from API-Football
 * 
 * Fetches all leagues and their seasons from API-Football and upserts them
 * into Postgres (countries, leagues, seasons, season_coverage tables).
 */

import { getPool } from '../db/pool';
import { logger } from '../logger';
import { apiFootballClient } from '../provider/apiFootballClient';
import { LeaguesResponseSchema, normalizeCoverage } from '../provider/schemas';
import { withLock } from '../orchestration/locks';
import {
  ensureProviderSource,
  upsertCountry,
  upsertLeague,
  upsertSeason,
  upsertSeasonCoverage,
  updateSyncState,
  recordSyncError,
} from '../db/queries';

export async function syncLeaguesSeasons(): Promise<void> {
  const JOB_NAME = 'sync:leagues_seasons';

  logger.setContext({ job: JOB_NAME });
  logger.info('Starting leagues and seasons sync job');

  const pool = getPool();
  const lockClient = await pool.connect();

  try {
    const result = await withLock(lockClient, JOB_NAME, async () => {
      // Fetch data from API-Football
      logger.info('Fetching leagues from API-Football');
      const rawResponse = await apiFootballClient.getLeagues();

      // Validate response with Zod
      logger.info('Validating API response');
      const validatedResponse = LeaguesResponseSchema.parse(rawResponse);

      const leagues = validatedResponse.response;
      logger.info(`Received ${leagues.length} leagues from provider`);

      // Get a transactional client
      const client = await pool.connect();

      try {
        await client.query('BEGIN');

        // Ensure provider source exists
        const sourceId = await ensureProviderSource(client);
        logger.info('Provider source ensured', { sourceId });

        // Counters
        let countriesUpserted = 0;
        let leaguesUpserted = 0;
        let seasonsUpserted = 0;
        let coveragesUpserted = 0;

        // Process each league
        for (const item of leagues) {
          try {
            // Upsert country
            const countryId = await upsertCountry(
              client,
              item.country.name,
              item.country.code || null,
              item.country.flag || null
            );
            countriesUpserted++;

            // Upsert league
            const leagueId = await upsertLeague(
              client,
              item.league.id,
              countryId,
              item.league.name,
              item.league.type || null,
              item.league.logo || null
            );
            leaguesUpserted++;

            // Process seasons
            for (const season of item.seasons) {
              const seasonId = await upsertSeason(
                client,
                leagueId,
                season.year,
                season.start || null,
                season.end || null,
                season.current
              );
              seasonsUpserted++;

              // Upsert season coverage
              const coverage = normalizeCoverage(season.coverage);
              await upsertSeasonCoverage(client, seasonId, coverage);
              coveragesUpserted++;
            }
          } catch (itemError: unknown) {
            const error = itemError as Error;
            logger.warn('Failed to process league item', {
              leagueId: item.league.id,
              leagueName: item.league.name,
              error: error.message,
            });
            // Continue with next item
          }
        }

        // Update sync state with success
        await updateSyncState(client, sourceId, 'leagues_seasons', {
          fetchedAt: new Date().toISOString(),
          totalLeagues: leagues.length,
          countriesUpserted,
          leaguesUpserted,
          seasonsUpserted,
          coveragesUpserted,
        });

        await client.query('COMMIT');

        logger.info('Sync completed successfully', {
          countriesUpserted,
          leaguesUpserted,
          seasonsUpserted,
          coveragesUpserted,
        });

        return {
          countriesUpserted,
          leaguesUpserted,
          seasonsUpserted,
          coveragesUpserted,
        };
      } catch (error: unknown) {
        const err = error as Error;
        await client.query('ROLLBACK');

        // Record error in sync state
        try {
          const errorClient = await pool.connect();
          const sourceId = await ensureProviderSource(errorClient);
          await recordSyncError(errorClient, sourceId, 'leagues_seasons', err.message);
          errorClient.release();
        } catch (recordError) {
          logger.error('Failed to record sync error', recordError);
        }

        throw error;
      } finally {
        client.release();
      }
    });

    if (result === null) {
      logger.info('Job skipped - could not acquire lock');
      process.exit(0);
    }

    logger.info('Job completed successfully');
    process.exit(0);
  } catch (error: unknown) {
    logger.error('Job failed', error);
    process.exit(1);
  } finally {
    lockClient.release();
  }
}

