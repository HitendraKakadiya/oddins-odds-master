/**
 * Job: Sync Match Lineups from API-Football
 * 
 * Fetches match lineups (starting XI and substitutes) for completed matches.
 */

import { getPool } from '../db/pool';
import { logger } from '../logger';
import { apiFootballClient } from '../provider/apiFootballClient';
import { withLock } from '../orchestration/locks';
import { ensureProviderSource, updateSyncState } from '../db/queries';
import { PoolClient } from 'pg';

interface LineupPlayer {
  player: {
    id: number;
    name: string;
    number: number;
    pos: string; // 'G', 'D', 'M', 'F'
    grid: string | null; // e.g., '4:2' for formation position
  };
}

interface TeamLineup {
  team: {
    id: number;
    name: string;
    logo: string | null;
  };
  formation: string; // e.g., '4-4-2'
  startXI: LineupPlayer[];
  substitutes: LineupPlayer[];
}

interface LineupsAPIResponse {
  response: TeamLineup[];
  results: number;
}

// Get player ID by provider_player_id, create if not exists
async function getOrCreatePlayerId(
  client: PoolClient,
  providerPlayerId: number,
  playerName: string,
  position: string
): Promise<{ id: number, wasCreated: boolean }> {
  // Try to find existing player
  let result = await client.query(
    `SELECT id FROM players WHERE provider_player_id = $1`,
    [providerPlayerId]
  );

  if (result.rows.length > 0) {
    return { id: result.rows[0].id, wasCreated: false };
  }

  // Player doesn't exist, create it with ON CONFLICT
  logger.info('Creating new player from lineup data', {
    providerPlayerId,
    playerName,
    position
  });

  result = await client.query(
    `INSERT INTO players (provider_player_id, name, position)
     VALUES ($1, $2, $3)
     ON CONFLICT (provider_player_id) DO UPDATE SET
       name = $2,
       position = $3
     RETURNING id`,
    [providerPlayerId, playerName, position]
  );

  return { id: result.rows[0].id, wasCreated: true };
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

// Insert match lineup
async function insertMatchLineup(
  client: PoolClient,
  matchId: number,
  teamId: number,
  playerId: number,
  position: string,
  gridPosition: string | null,
  isStarter: boolean,
  jerseyNumber: number
): Promise<void> {
  await client.query(
    `INSERT INTO match_lineups (match_id, team_id, player_id, position, grid_position, is_starter, jersey_number)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (match_id, team_id, player_id) DO UPDATE SET
       position = $4,
       grid_position = $5,
       is_starter = $6,
       jersey_number = $7`,
    [matchId, teamId, playerId, position, gridPosition, isStarter, jerseyNumber]
  );
}

// Get completed matches without lineups
async function getCompletedMatches(client: PoolClient, limit: number = 1000): Promise<Array<{ matchId: number, providerFixtureId: number }>> {
  const result = await client.query(
    `SELECT m.id as match_id, m.provider_fixture_id
     FROM matches m
     WHERE m.status = 'FT'
       AND m.kickoff_at < NOW()
       AND NOT EXISTS (
         SELECT 1 FROM match_lineups ml WHERE ml.match_id = m.id
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

export async function syncLineups(): Promise<void> {
  const JOB_NAME = 'sync:lineups';
  const ENTITY_NAME = 'match_lineups';

  logger.setContext({ job: JOB_NAME });
  logger.info('Starting match lineups sync job');

  const pool = getPool();
  const lockClient = await pool.connect();

  try {
    const result = await withLock(lockClient, JOB_NAME, async () => {
      const client = await pool.connect();

      try {
        const sourceId = await ensureProviderSource(client);
        logger.info('Provider source ensured', { sourceId });

        let lineupsInserted = 0;
        let playersCreated = 0;
        let apiCallsMade = 0;
        let matchesProcessed = 0;
        let matchesSkipped = 0;

        // Get completed matches without lineups (limit to first 1000)
        const matches = await getCompletedMatches(client, 1000);
        logger.info(`Found ${matches.length} completed matches to fetch lineups for`);

        // Process each match with its own transaction
        for (const match of matches) {
          try {
            // Start transaction for this match
            await client.query('BEGIN');

            logger.info(`Fetching lineups for match ${match.providerFixtureId}`, {
              matchId: match.matchId,
            });

            // Fetch lineups from API
            const rawResponse: LineupsAPIResponse = await apiFootballClient.getFixtureLineups({
              fixture: match.providerFixtureId,
            });
            apiCallsMade++;

            const teamLineups = rawResponse.response || [];

            if (teamLineups.length === 0) {
              logger.info(`No lineups for match ${match.providerFixtureId}`);
              matchesSkipped++;
              continue;
            }

            logger.info(`Received lineups for ${teamLineups.length} teams in match ${match.providerFixtureId}`);

            // Process each team's lineup
            for (const teamLineup of teamLineups) {
              try {
                // Get team ID
                const teamId = await getTeamId(client, teamLineup.team.id);
                if (!teamId) {
                  logger.warn('Team not found', { teamProviderId: teamLineup.team.id });
                  continue;
                }

                // Process starting XI
                for (const lineupPlayer of teamLineup.startXI) {
                  const playerResult = await getOrCreatePlayerId(
                    client,
                    lineupPlayer.player.id,
                    lineupPlayer.player.name,
                    lineupPlayer.player.pos
                  );

                  if (playerResult.wasCreated) {
                    playersCreated++;
                  }

                  await insertMatchLineup(
                    client,
                    match.matchId,
                    teamId,
                    playerResult.id,
                    lineupPlayer.player.pos,
                    lineupPlayer.player.grid,
                    true, // is starter
                    lineupPlayer.player.number
                  );
                  lineupsInserted++;
                }

                // Process substitutes
                for (const lineupPlayer of teamLineup.substitutes) {
                  const playerResult = await getOrCreatePlayerId(
                    client,
                    lineupPlayer.player.id,
                    lineupPlayer.player.name,
                    lineupPlayer.player.pos
                  );

                  if (playerResult.wasCreated) {
                    playersCreated++;
                  }

                  await insertMatchLineup(
                    client,
                    match.matchId,
                    teamId,
                    playerResult.id,
                    lineupPlayer.player.pos,
                    lineupPlayer.player.grid,
                    false, // not a starter
                    lineupPlayer.player.number
                  );
                  lineupsInserted++;
                }
              } catch (teamError: any) {
                logger.warn('Failed to process team lineup', {
                  teamId: teamLineup.team.id,
                  error: teamError.message,
                });
              }
            }

            // Commit this match's transaction
            await client.query('COMMIT');
            matchesProcessed++;

            // Rate limiting: wait 100ms between requests
            await new Promise(resolve => setTimeout(resolve, 100));

          } catch (matchError: any) {
            // Rollback this match's transaction
            await client.query('ROLLBACK');
            logger.warn('Failed to process match', {
              matchId: match.matchId,
              error: matchError.message,
            });
            matchesSkipped++;
            // Continue with next match
          }
        }

        // Update sync state in its own transaction
        await client.query('BEGIN');
        await updateSyncState(client, sourceId, ENTITY_NAME, {
          lineupsInserted,
          playersCreated,
          apiCallsMade,
          matchesProcessed,
          matchesSkipped,
        });
        await client.query('COMMIT');

        logger.info('Sync completed successfully', {
          lineupsInserted,
          playersCreated,
          apiCallsMade,
          matchesProcessed,
          matchesSkipped,
        });

        return {
          lineupsInserted,
          playersCreated,
          apiCallsMade,
          matchesProcessed,
          matchesSkipped,
        };
      } catch (error: any) {
        // Try to rollback if there's an open transaction
        try {
          await client.query('ROLLBACK');
        } catch (rollbackError) {
          // Ignore rollback errors
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
  } catch (error: any) {
    logger.error('Job failed', error);
    process.exit(1);
  } finally {
    lockClient.release();
  }
}

