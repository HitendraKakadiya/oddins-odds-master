/**
 * Job: Sync Players from API-Football
 * 
 * Fetches player data for teams in featured leagues.
 */

import { getPool } from '../db/pool';
import { logger } from '../logger';
import { apiFootballClient } from '../provider/apiFootballClient';
import { withLock } from '../orchestration/locks';
import { ensureProviderSource, updateSyncState } from '../db/queries';
import { FEATURED_LEAGUES } from '../config/featured-leagues';
import { PoolClient } from 'pg';

interface PlayerResponse {
  player: {
    id: number;
    name: string;
    firstname: string | null;
    lastname: string | null;
    age: number | null;
    birth: {
      date: string | null;
      place: string | null;
      country: string | null;
    };
    nationality: string | null;
    height: string | null; // e.g., "183 cm"
    weight: string | null; // e.g., "75 kg"
    injured: boolean;
    photo: string | null;
  };
  statistics: Array<{
    team: {
      id: number;
      name: string;
      logo: string | null;
    };
    league: {
      id: number;
      name: string;
      country: string;
      logo: string | null;
      flag: string | null;
      season: number;
    };
    games: {
      appearences: number | null;
      lineups: number | null;
      minutes: number | null;
      number: number | null;
      position: string | null;
      rating: string | null;
      captain: boolean;
    };
  }>;
}

interface PlayersAPIResponse {
  response: PlayerResponse[];
  results: number;
}

// Parse height from "183 cm" to 183
function parseHeight(height: string | null): number | null {
  if (!height) return null;
  const match = height.match(/(\d+)/);
  return match ? parseInt(match[1]) : null;
}

// Parse weight from "75 kg" to 75
function parseWeight(weight: string | null): number | null {
  if (!weight) return null;
  const match = weight.match(/(\d+)/);
  return match ? parseInt(match[1]) : null;
}

// Upsert player
async function upsertPlayer(
  client: PoolClient,
  providerPlayerId: number,
  name: string,
  position: string | null,
  nationality: string | null,
  dateOfBirth: string | null,
  height: number | null,
  weight: number | null,
  photoUrl: string | null
): Promise<number> {
  const result = await client.query(
    `INSERT INTO players (provider_player_id, name, position, nationality, date_of_birth, height, weight, photo_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (provider_player_id) DO UPDATE SET
       name = $2,
       position = $3,
       nationality = $4,
       date_of_birth = $5,
       height = $6,
       weight = $7,
       photo_url = $8,
       updated_at = NOW()
     RETURNING id`,
    [providerPlayerId, name, position, nationality, dateOfBirth, height, weight, photoUrl]
  );
  return result.rows[0].id;
}


// Link player to team
async function linkPlayerToTeam(
  client: PoolClient,
  playerId: number,
  teamId: number,
  seasonYear: number,
  jerseyNumber: number | null
): Promise<void> {
  await client.query(
    `INSERT INTO team_players (team_id, player_id, season_year, jersey_number)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (team_id, player_id, season_year) DO UPDATE SET
       jersey_number = $4`,
    [teamId, playerId, seasonYear, jerseyNumber]
  );
}

// Get all teams from featured leagues
async function getFeaturedTeams(client: PoolClient): Promise<Array<{ teamId: number, providerTeamId: number }>> {
  const result = await client.query(
    `SELECT DISTINCT t.id as team_id, t.provider_team_id
     FROM teams t
     JOIN season_teams st ON t.id = st.team_id
     JOIN seasons s ON st.season_id = s.id
     JOIN leagues l ON s.league_id = l.id
     WHERE l.provider_league_id = ANY($1)
     ORDER BY t.id`,
    [FEATURED_LEAGUES.map(l => l.id)]
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return result.rows.map((row: any) => ({
    teamId: row.team_id,
    providerTeamId: row.provider_team_id
  }));
}

export async function syncPlayers(): Promise<void> {
  const JOB_NAME = 'sync:players';
  const ENTITY_NAME = 'players';

  logger.setContext({ job: JOB_NAME });
  logger.info('Starting players sync job');

  const pool = getPool();
  const lockClient = await pool.connect();

  try {
    const result = await withLock(lockClient, JOB_NAME, async () => {
      const client = await pool.connect();

      try {
        await client.query('BEGIN');

        const sourceId = await ensureProviderSource(client);
        logger.info('Provider source ensured', { sourceId });

        let playersUpserted = 0;
        let teamLinksCreated = 0;
        let apiCallsMade = 0;
        let teamsProcessed = 0;
        let teamsSkipped = 0;

        // Get all teams from featured leagues
        const teams = await getFeaturedTeams(client);
        logger.info(`Found ${teams.length} teams to process`);

        // Process each team (using 2024 season)
        const currentSeason = 2024;

        for (const team of teams) {
          try {
            logger.info(`Fetching players for team ${team.providerTeamId}`, {
              teamId: team.teamId,
            });

            // Fetch players from API
            const rawResponse = (await apiFootballClient.getPlayers({
              team: team.providerTeamId,
              season: currentSeason,
            })) as PlayersAPIResponse;
            apiCallsMade++;

            const playerResponses = rawResponse.response || [];

            if (playerResponses.length === 0) {
              logger.warn(`No players found for team ${team.providerTeamId}`);
              teamsSkipped++;
              continue;
            }

            logger.info(`Received ${playerResponses.length} players for team ${team.providerTeamId}`);

            // Process each player
            for (const item of playerResponses) {
              try {
                // Get position from statistics if available
                let position: string | null = null;
                let jerseyNumber: number | null = null;

                if (item.statistics && item.statistics.length > 0) {
                  // Find stats for current season
                  const seasonStats = item.statistics.find(s => s.league.season === currentSeason);
                  if (seasonStats) {
                    position = seasonStats.games?.position || null;
                    jerseyNumber = seasonStats.games?.number || null;
                  }
                }

                // Parse height and weight
                const height = parseHeight(item.player.height);
                const weight = parseWeight(item.player.weight);

                // Upsert player
                const playerId = await upsertPlayer(
                  client,
                  item.player.id,
                  item.player.name,
                  position,
                  item.player.nationality,
                  item.player.birth?.date || null,
                  height,
                  weight,
                  item.player.photo
                );
                playersUpserted++;

                // Link player to team
                await linkPlayerToTeam(client, playerId, team.teamId, currentSeason, jerseyNumber);
                teamLinksCreated++;

              } catch (itemError: unknown) {
                const error = itemError as Error;
                logger.warn('Failed to process player item', {
                  playerId: item.player.id,
                  playerName: item.player.name,
                  error: error.message,
                });
                // Continue with next item
              }
            }

            teamsProcessed++;

            // Rate limiting: wait 100ms between requests
            await new Promise(resolve => setTimeout(resolve, 100));

          } catch (teamError: unknown) {
            const error = teamError as Error;
            logger.warn('Failed to process team', {
              teamId: team.teamId,
              error: error.message,
            });
            teamsSkipped++;
            // Continue with next team
          }
        }

        // Update sync state
        await updateSyncState(client, sourceId, ENTITY_NAME, {
          playersUpserted,
          teamLinksCreated,
          apiCallsMade,
          teamsProcessed,
          teamsSkipped,
          season: currentSeason,
        });

        await client.query('COMMIT');

        logger.info('Sync completed successfully', {
          playersUpserted,
          teamLinksCreated,
          apiCallsMade,
          teamsProcessed,
          teamsSkipped,
        });

        return {
          playersUpserted,
          teamLinksCreated,
          apiCallsMade,
          teamsProcessed,
          teamsSkipped,
        };
      } catch (error: unknown) {
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
  } catch (error: unknown) {
    logger.error('Job failed', error);
    process.exit(1);
  } finally {
    lockClient.release();
  }
}

