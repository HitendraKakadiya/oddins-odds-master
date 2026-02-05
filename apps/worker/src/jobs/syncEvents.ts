/**
 * Job: Sync Match Events from API-Football
 * 
 * Fetches match events (goals, cards, substitutions, VAR) for completed matches.
 */

import { getPool } from '../db/pool';
import { logger } from '../logger';
import { apiFootballClient } from '../provider/apiFootballClient';
import { withLock } from '../orchestration/locks';
import { ensureProviderSource, updateSyncState } from '../db/queries';
import { PoolClient } from 'pg';

interface EventResponse {
  time: {
    elapsed: number;
    extra: number | null;
  };
  team: {
    id: number;
    name: string;
    logo: string | null;
  };
  player: {
    id: number | null;
    name: string | null;
  };
  assist: {
    id: number | null;
    name: string | null;
  };
  type: string; // 'Goal', 'Card', 'subst', 'Var'
  detail: string; // 'Yellow Card', 'Red Card', 'Normal Goal', 'Penalty', etc.
  comments: string | null;
}

interface EventsAPIResponse {
  response: EventResponse[];
  results: number;
}

// Get player ID by provider_player_id
async function getPlayerId(
  client: PoolClient,
  providerPlayerId: number | null
): Promise<number | null> {
  if (!providerPlayerId) return null;

  const result = await client.query(
    `SELECT id FROM players WHERE provider_player_id = $1`,
    [providerPlayerId]
  );
  return result.rows.length > 0 ? result.rows[0].id : null;
}

// Get team ID by provider_team_id
async function getTeamId(
  client: PoolClient,
  providerTeamId: number
): Promise<number | null> {
  const result = await client.query(
    `SELECT id FROM teams WHERE provider_team_id = $1`,
    [providerTeamId]
  );
  return result.rows.length > 0 ? result.rows[0].id : null;
}

// Insert match event
async function insertMatchEvent(
  client: PoolClient,
  matchId: number,
  teamId: number,
  playerId: number | null,
  assistPlayerId: number | null,
  timeElapsed: number,
  timeExtra: number | null,
  eventType: string,
  detail: string,
  comments: string | null
): Promise<void> {
  await client.query(
    `INSERT INTO match_events (match_id, team_id, player_id, assist_player_id, time_elapsed, time_extra, event_type, detail, comments)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     ON CONFLICT DO NOTHING`,
    [matchId, teamId, playerId, assistPlayerId, timeElapsed, timeExtra, eventType, detail, comments]
  );
}

// Get completed matches without events
async function getCompletedMatches(client: PoolClient, limit: number = 1000): Promise<Array<{ matchId: number, providerFixtureId: number }>> {
  const result = await client.query(
    `SELECT m.id as match_id, m.provider_fixture_id
     FROM matches m
     WHERE m.status = 'FT'
       AND m.kickoff_at < NOW()
       AND NOT EXISTS (
         SELECT 1 FROM match_events me WHERE me.match_id = m.id
       )
     ORDER BY m.kickoff_at DESC
     LIMIT $1`,
    [limit]
  );
  return result.rows.map((row: any) => ({
    matchId: row.match_id,
    providerFixtureId: row.provider_fixture_id
  }));
}

export async function syncEvents(): Promise<void> {
  const JOB_NAME = 'sync:events';
  const ENTITY_NAME = 'match_events';

  logger.setContext({ job: JOB_NAME });
  logger.info('Starting match events sync job');

  const pool = getPool();
  const lockClient = await pool.connect();

  try {
    const result = await withLock(lockClient, JOB_NAME, async () => {
      const client = await pool.connect();

      try {
        await client.query('BEGIN');

        const sourceId = await ensureProviderSource(client);
        logger.info('Provider source ensured', { sourceId });

        let eventsInserted = 0;
        let apiCallsMade = 0;
        let matchesProcessed = 0;
        let matchesSkipped = 0;

        // Get completed matches without events (limit to first 1000 to avoid excessive API usage)
        const matches = await getCompletedMatches(client, 1000);
        logger.info(`Found ${matches.length} completed matches to fetch events for`);

        // Process each match
        for (const match of matches) {
          try {
            logger.info(`Fetching events for match ${match.providerFixtureId}`, {
              matchId: match.matchId,
            });

            // Fetch events from API
            const rawResponse: EventsAPIResponse = await apiFootballClient.getFixtureEvents({
              fixture: match.providerFixtureId,
            });
            apiCallsMade++;

            const events = rawResponse.response || [];

            if (events.length === 0) {
              logger.info(`No events for match ${match.providerFixtureId}`);
              matchesSkipped++;
              continue;
            }

            logger.info(`Received ${events.length} events for match ${match.providerFixtureId}`);

            // Process each event
            for (const event of events) {
              try {
                // Get team ID
                const teamId = await getTeamId(client, event.team.id);
                if (!teamId) {
                  logger.warn('Team not found', { teamProviderId: event.team.id });
                  continue;
                }

                // Get player IDs (if applicable)
                const playerId = await getPlayerId(client, event.player.id);
                const assistPlayerId = await getPlayerId(client, event.assist.id);

                // Insert event
                await insertMatchEvent(
                  client,
                  match.matchId,
                  teamId,
                  playerId,
                  assistPlayerId,
                  event.time.elapsed,
                  event.time.extra,
                  event.type,
                  event.detail,
                  event.comments
                );
                eventsInserted++;

              } catch (eventError: any) {
                logger.warn('Failed to process event', {
                  matchId: match.matchId,
                  eventType: event.type,
                  error: eventError.message,
                });
                // Continue with next event
              }
            }

            matchesProcessed++;

            // Rate limiting: wait 100ms between requests
            await new Promise(resolve => setTimeout(resolve, 100));

          } catch (matchError: any) {
            logger.warn('Failed to process match', {
              matchId: match.matchId,
              error: matchError.message,
            });
            matchesSkipped++;
            // Continue with next match
          }
        }

        // Update sync state
        await updateSyncState(client, sourceId, ENTITY_NAME, {
          eventsInserted,
          apiCallsMade,
          matchesProcessed,
          matchesSkipped,
        });

        await client.query('COMMIT');

        logger.info('Sync completed successfully', {
          eventsInserted,
          apiCallsMade,
          matchesProcessed,
          matchesSkipped,
        });

        return {
          eventsInserted,
          apiCallsMade,
          matchesProcessed,
          matchesSkipped,
        };
      } catch (error: any) {
        await client.query('ROLLBACK');
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
  } catch (error: any) {
    logger.error('Job failed', error);
    process.exit(1);
  } finally {
    lockClient.release();
  }
}

