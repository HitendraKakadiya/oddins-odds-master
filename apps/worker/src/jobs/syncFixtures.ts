/**
 * Job: Sync Fixtures (Matches) from API-Football
 * 
 * Fetches fixtures for featured leagues (24 months / 3 seasons) and upserts them into Postgres.
 * This is the CORE job that populates the matches table.
 */

import { getPool } from '../db/pool';
import { logger } from '../logger';
import { apiFootballClient } from '../provider/apiFootballClient';
import { withLock } from '../orchestration/locks';
import { ensureProviderSource, updateSyncState } from '../db/queries';
import { FEATURED_LEAGUES, SEASONS_TO_SYNC } from '../config/featured-leagues';
import { PoolClient } from 'pg';

interface FixtureResponse {
  fixture: {
    id: number;
    referee: string | null;
    timezone: string;
    date: string;
    timestamp: number;
    periods: {
      first: number | null;
      second: number | null;
    };
    venue: {
      id: number | null;
      name: string | null;
      city: string | null;
    };
    status: {
      long: string;
      short: string;
      elapsed: number | null;
      extra: number | null;
    };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string | null;
    flag: string | null;
    season: number;
    round: string | null;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string | null;
      winner: boolean | null;
    };
    away: {
      id: number;
      name: string;
      logo: string | null;
      winner: boolean | null;
    };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    halftime: {
      home: number | null;
      away: number | null;
    };
    fulltime: {
      home: number | null;
      away: number | null;
    };
    extratime: {
      home: number | null;
      away: number | null;
    };
    penalty: {
      home: number | null;
      away: number | null;
    };
  };
}

interface FixturesAPIResponse {
  response: FixtureResponse[];
  results: number;
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

// Get venue ID by provider_venue_id
async function getVenueId(
  client: PoolClient,
  providerVenueId: number
): Promise<number | null> {
  const result = await client.query(
    `SELECT id FROM venues WHERE provider_venue_id = $1`,
    [providerVenueId]
  );
  return result.rows.length > 0 ? result.rows[0].id : null;
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

// Get league ID
async function getLeagueId(
  client: PoolClient,
  providerLeagueId: number
): Promise<number | null> {
  const result = await client.query(
    `SELECT id FROM leagues WHERE provider_league_id = $1`,
    [providerLeagueId]
  );
  return result.rows.length > 0 ? result.rows[0].id : null;
}

// Upsert match
async function upsertMatch(
  client: PoolClient,
  providerFixtureId: number,
  seasonId: number,
  leagueId: number,
  homeTeamId: number,
  awayTeamId: number,
  venueId: number | null,
  kickoffAt: string,
  timezone: string,
  status: string,
  elapsed: number | null,
  homeGoals: number | null,
  awayGoals: number | null,
  htHomeGoals: number | null,
  htAwayGoals: number | null
): Promise<number> {
  const result = await client.query(
    `INSERT INTO matches (
      provider_fixture_id, season_id, league_id, home_team_id, away_team_id, venue_id,
      kickoff_at, timezone, status, elapsed, home_goals, away_goals, ht_home_goals, ht_away_goals,
      last_provider_update_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW())
    ON CONFLICT (provider_fixture_id) DO UPDATE SET
      status = $9,
      elapsed = $10,
      home_goals = $11,
      away_goals = $12,
      ht_home_goals = $13,
      ht_away_goals = $14,
      last_provider_update_at = NOW()
    RETURNING id`,
    [
      providerFixtureId, seasonId, leagueId, homeTeamId, awayTeamId, venueId,
      kickoffAt, timezone, status, elapsed, homeGoals, awayGoals, htHomeGoals, htAwayGoals
    ]
  );
  return result.rows[0].id;
}

export async function syncFixtures(): Promise<void> {
  const JOB_NAME = 'sync:fixtures';
  const ENTITY_NAME = 'fixtures';

  logger.setContext({ job: JOB_NAME });
  logger.info('Starting fixtures sync job (24 months strategy)');

  const pool = getPool();
  const lockClient = await pool.connect();

  try {
    const result = await withLock(lockClient, JOB_NAME, async () => {
      const client = await pool.connect();

      try {
        await client.query('BEGIN');

        const sourceId = await ensureProviderSource(client);
        logger.info('Provider source ensured', { sourceId });

        let fixturesUpserted = 0;
        let fixturesSkipped = 0;
        let apiCallsMade = 0;

        // Process each featured league × season combination
        for (const league of FEATURED_LEAGUES) {
          for (const season of SEASONS_TO_SYNC) {
            try {
              logger.info(`Fetching fixtures for ${league.name} (${season})`, {
                leagueId: league.id,
                season,
              });

              // Fetch fixtures from API
              const rawResponse: FixturesAPIResponse = await apiFootballClient.getFixtures({
                league: league.id,
                season,
              });
              apiCallsMade++;

              const fixtures = rawResponse.response || [];
              logger.info(`Received ${fixtures.length} fixtures for ${league.name} (${season})`);

              // Get season ID and league ID
              const seasonId = await getSeasonId(client, league.id, season);
              const leagueId = await getLeagueId(client, league.id);

              if (!seasonId || !leagueId) {
                logger.warn(`Season or league not found for ${league.id} year ${season}, skipping`);
                continue;
              }

              // Process each fixture
              for (const item of fixtures) {
                try {
                  // Get team IDs
                  const homeTeamId = await getTeamId(client, item.teams.home.id);
                  const awayTeamId = await getTeamId(client, item.teams.away.id);

                  if (!homeTeamId || !awayTeamId) {
                    logger.warn('Teams not found for fixture, skipping', {
                      fixtureId: item.fixture.id,
                      homeTeamProviderId: item.teams.home.id,
                      awayTeamProviderId: item.teams.away.id,
                    });
                    fixturesSkipped++;
                    continue;
                  }

                  // Get venue ID (optional)
                  let venueId: number | null = null;
                  if (item.fixture.venue?.id) {
                    venueId = await getVenueId(client, item.fixture.venue.id);
                  }

                  // Upsert match
                  await upsertMatch(
                    client,
                    item.fixture.id,
                    seasonId,
                    leagueId,
                    homeTeamId,
                    awayTeamId,
                    venueId,
                    item.fixture.date,
                    item.fixture.timezone,
                    item.fixture.status.short,
                    item.fixture.status.elapsed,
                    item.goals.home,
                    item.goals.away,
                    item.score.halftime.home,
                    item.score.halftime.away
                  );
                  fixturesUpserted++;

                } catch (itemError: any) {
                  logger.warn('Failed to process fixture item', {
                    fixtureId: item.fixture.id,
                    error: itemError.message,
                  });
                  fixturesSkipped++;
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
          fixturesUpserted,
          fixturesSkipped,
          apiCallsMade,
          leaguesProcessed: FEATURED_LEAGUES.length,
          seasonsProcessed: SEASONS_TO_SYNC.length,
          strategy: '24_months',
        });

        await client.query('COMMIT');

        logger.info('Sync completed successfully', {
          fixturesUpserted,
          fixturesSkipped,
          apiCallsMade,
        });

        return {
          fixturesUpserted,
          fixturesSkipped,
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

