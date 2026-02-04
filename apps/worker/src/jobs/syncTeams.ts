/**
 * Job: Sync Teams from API-Football
 * 
 * Fetches teams for featured leagues and upserts them into Postgres.
 * Also syncs venues and links teams to seasons.
 */

import { getPool } from '../db/pool';
import { logger } from '../logger';
import { apiFootballClient } from '../provider/apiFootballClient';
import { withLock } from '../orchestration/locks';
import { ensureProviderSource, updateSyncState } from '../db/queries';
import { FEATURED_LEAGUES, SEASONS_TO_SYNC } from '../config/featured-leagues';
import { PoolClient } from 'pg';

interface TeamResponse {
  team: {
    id: number;
    name: string;
    code: string | null;
    country: string;
    founded: number | null;
    national: boolean;
    logo: string | null;
  };
  venue: {
    id: number | null;
    name: string | null;
    address: string | null;
    city: string | null;
    capacity: number | null;
    surface: string | null;
    image: string | null;
  };
}

interface TeamsAPIResponse {
  response: TeamResponse[];
  results: number;
}

// Utility: slugify
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Upsert venue
async function upsertVenue(
  client: PoolClient,
  providerVenueId: number,
  name: string,
  city: string | null,
  capacity: number | null,
  surface: string | null
): Promise<number> {
  const result = await client.query(
    `INSERT INTO venues (provider_venue_id, name, city, capacity, surface)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (provider_venue_id) DO UPDATE SET
       name = $2,
       city = $3,
       capacity = $4,
       surface = $5
     RETURNING id`,
    [providerVenueId, name, city, capacity, surface]
  );
  return result.rows[0].id;
}

// Upsert team
async function upsertTeam(
  client: PoolClient,
  providerTeamId: number,
  countryId: number,
  venueId: number | null,
  name: string,
  shortName: string | null,
  logoUrl: string | null
): Promise<number> {
  const slug = slugify(name);
  
  const result = await client.query(
    `INSERT INTO teams (provider_team_id, country_id, venue_id, name, short_name, logo_url, slug)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (provider_team_id) DO UPDATE SET
       name = $4,
       short_name = $5,
       logo_url = $6,
       slug = $7,
       venue_id = $3,
       country_id = $2
     RETURNING id`,
    [providerTeamId, countryId, venueId, name, shortName, logoUrl, slug]
  );
  return result.rows[0].id;
}

// Get or create country by name
async function getOrCreateCountry(
  client: PoolClient,
  countryName: string
): Promise<number> {
  // Try to find existing country
  const findResult = await client.query(
    `SELECT id FROM countries WHERE name = $1`,
    [countryName]
  );
  
  if (findResult.rows.length > 0) {
    return findResult.rows[0].id;
  }
  
  // Create new country
  const insertResult = await client.query(
    `INSERT INTO countries (name, code, flag_url)
     VALUES ($1, NULL, NULL)
     RETURNING id`,
    [countryName]
  );
  
  return insertResult.rows[0].id;
}

// Link team to season
async function linkTeamToSeason(
  client: PoolClient,
  seasonId: number,
  teamId: number
): Promise<void> {
  await client.query(
    `INSERT INTO season_teams (season_id, team_id)
     VALUES ($1, $2)
     ON CONFLICT (season_id, team_id) DO NOTHING`,
    [seasonId, teamId]
  );
}

// Get season ID
async function getSeasonId(
  client: PoolClient,
  leagueId: number,
  year: number
): Promise<number | null> {
  const result = await client.query(
    `SELECT s.id 
     FROM seasons s
     JOIN leagues l ON s.league_id = l.id
     WHERE l.provider_league_id = $1 AND s.year = $2`,
    [leagueId, year]
  );
  
  return result.rows.length > 0 ? result.rows[0].id : null;
}

export async function syncTeams(): Promise<void> {
  const JOB_NAME = 'sync:teams';
  const ENTITY_NAME = 'teams';

  logger.setContext({ job: JOB_NAME });
  logger.info('Starting teams sync job');

  const pool = getPool();
  const lockClient = await pool.connect();

  try {
    const result = await withLock(lockClient, JOB_NAME, async () => {
      const client = await pool.connect();

      try {
        await client.query('BEGIN');

        const sourceId = await ensureProviderSource(client);
        logger.info('Provider source ensured', { sourceId });

        let teamsUpserted = 0;
        let venuesUpserted = 0;
        let seasonLinksCreated = 0;
        let apiCallsMade = 0;

        // Process each featured league × season combination
        for (const league of FEATURED_LEAGUES) {
          for (const season of SEASONS_TO_SYNC) {
            try {
              logger.info(`Fetching teams for ${league.name} (${season})`, {
                leagueId: league.id,
                season,
              });

              // Fetch teams from API
              const rawResponse: TeamsAPIResponse = await apiFootballClient.getTeams({
                league: league.id,
                season,
              });
              apiCallsMade++;

              const teams = rawResponse.response || [];
              logger.info(`Received ${teams.length} teams for ${league.name} (${season})`);

              // Get season ID for linking
              const seasonId = await getSeasonId(client, league.id, season);
              
              if (!seasonId) {
                logger.warn(`Season not found for league ${league.id} year ${season}, skipping`);
                continue;
              }

              // Process each team
              for (const item of teams) {
                try {
                  // Get or create country
                  const countryId = await getOrCreateCountry(client, item.team.country);

                  // Upsert venue (if provided)
                  let venueId: number | null = null;
                  if (item.venue?.id && item.venue?.name) {
                    venueId = await upsertVenue(
                      client,
                      item.venue.id,
                      item.venue.name,
                      item.venue.city || null,
                      item.venue.capacity || null,
                      item.venue.surface || null
                    );
                    venuesUpserted++;
                  }

                  // Upsert team
                  const teamId = await upsertTeam(
                    client,
                    item.team.id,
                    countryId,
                    venueId,
                    item.team.name,
                    item.team.code || null,
                    item.team.logo || null
                  );
                  teamsUpserted++;

                  // Link team to season
                  await linkTeamToSeason(client, seasonId, teamId);
                  seasonLinksCreated++;

                } catch (itemError: any) {
                  logger.warn('Failed to process team item', {
                    teamId: item.team.id,
                    teamName: item.team.name,
                    error: itemError.message,
                  });
                  // Continue with next item
                }
              }
            } catch (leagueError: any) {
              logger.warn('Failed to process league/season', {
                leagueId: league.id,
                leagueName: league.name,
                season,
                error: leagueError.message,
              });
              // Continue with next league/season
            }
          }
        }

        // Update sync state using helper function
        await updateSyncState(client, sourceId, ENTITY_NAME, {
          teamsUpserted,
          venuesUpserted,
          seasonLinksCreated,
          apiCallsMade,
          leaguesProcessed: FEATURED_LEAGUES.length,
          seasonsProcessed: SEASONS_TO_SYNC.length,
        });

        await client.query('COMMIT');

        logger.info('Sync completed successfully', {
          teamsUpserted,
          venuesUpserted,
          seasonLinksCreated,
          apiCallsMade,
        });

        return {
          teamsUpserted,
          venuesUpserted,
          seasonLinksCreated,
          apiCallsMade,
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

