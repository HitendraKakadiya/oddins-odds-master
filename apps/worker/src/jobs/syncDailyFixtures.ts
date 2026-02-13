/**
 * Job: Sync Daily Fixtures
 * 
 * Fetches all fixtures for a specific date (default: today) and upserts them.
 * This is efficient because it captures ALL leagues in 1-2 API calls per day.
 */

import { getPool } from '../db/pool';
import { logger } from '../logger';
import { apiFootballClient } from '../provider/apiFootballClient';
import { withLock } from '../orchestration/locks';
import { ensureProviderSource, updateSyncState, upsertCountry, upsertLeague, upsertSeason, upsertSeasonCoverage } from '../db/queries';
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

// Utility: slugify
function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// --- Specific Upsert Helpers (copied/adapted to be self-contained or moved to queries.ts later) ---

async function upsertTeam(
    client: PoolClient,
    providerTeamId: number,
    countryId: number,
    venueId: number | null,
    name: string,
    logoUrl: string | null
): Promise<number> {
    const slug = slugify(name);
    const result = await client.query(
        `INSERT INTO teams (provider_team_id, country_id, venue_id, name, logo_url, slug)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (provider_team_id) DO UPDATE SET
       name = $4,
       logo_url = $5,
       country_id = $2
     RETURNING id`,
        [providerTeamId, countryId, venueId, name, logoUrl, slug]
    );
    return result.rows[0].id;
}

async function upsertVenue(
    client: PoolClient,
    providerVenueId: number,
    name: string,
    city: string | null
): Promise<number> {
    const result = await client.query(
        `INSERT INTO venues (provider_venue_id, name, city)
     VALUES ($1, $2, $3)
     ON CONFLICT (provider_venue_id) DO UPDATE SET
       name = $2,
       city = $3
     RETURNING id`,
        [providerVenueId, name, city]
    );
    return result.rows[0].id;
}

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

export async function syncDailyFixtures(date?: string): Promise<void> {
    const JOB_NAME = 'sync:daily_fixtures';
    const ENTITY_NAME = 'daily_fixtures';

    // Default to today if not provided
    const targetDate = date || new Date().toISOString().split('T')[0];

    logger.setContext({ job: JOB_NAME, date: targetDate });
    logger.info(`Starting daily fixtures sync for ${targetDate}`);

    const pool = getPool();
    // We need a separate client for the lock to ensure it persists across the transaction
    const lockClient = await pool.connect();

    try {
        // Lock key needs to be unique per date to allow parallel syncs of different dates if needed
        // But for simplicity, let's just lock the whole job type
        const result = await withLock(lockClient, JOB_NAME, async () => {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const sourceId = await ensureProviderSource(client);

                // Cache maps to reduce DB queries
                const countryCache = new Map<string, number>();
                const leagueCache = new Map<number, number>();
                const seasonCache = new Map<string, number>(); // format: "leagueId-year"
                const teamCache = new Map<number, number>();
                const venueCache = new Map<number, number>();

                let fixturesUpserted = 0;
                let fixturesSkipped = 0;
                let apiCallsMade = 0;

                // Fetch from API
                logger.info(`Fetching fixtures for date ${targetDate}`);
                const rawResponse = await apiFootballClient.getFixturesByDate(targetDate) as FixturesAPIResponse;
                apiCallsMade++;

                const fixtures = rawResponse.response || [];
                logger.info(`Received ${fixtures.length} fixtures`);

                if (fixtures.length === 0) {
                    logger.info('No fixtures found for this date');
                    await updateSyncState(client, sourceId, ENTITY_NAME, {
                        date: targetDate,
                        fixturesUpserted: 0,
                        fixturesSkipped: 0,
                        apiCallsMade
                    });
                    await client.query('COMMIT');
                    return;
                }

                // Process fixtures
                for (const item of fixtures) {
                    try {
                        await client.query('SAVEPOINT fixture_process');

                        // 1. Country & League & Season
                        let countryId = countryCache.get(item.league.country);
                        if (!countryId) {
                            // Ensure country exists (using upsertCountry from queries.ts)
                            countryId = await upsertCountry(client, item.league.country, null, null);
                            countryCache.set(item.league.country, countryId);
                        }

                        let leagueId = leagueCache.get(item.league.id);
                        if (!leagueId) {
                            // Upsert league
                            leagueId = await upsertLeague(
                                client,
                                item.league.id,
                                countryId,
                                item.league.name,
                                null, // type not in fixture response
                                item.league.logo
                            );
                            leagueCache.set(item.league.id, leagueId);
                        }

                        const seasonYear = item.league.season;
                        const seasonKey = `${leagueId}-${seasonYear}`;
                        let seasonId = seasonCache.get(seasonKey);
                        if (!seasonId) {
                            // Upsert season
                            seasonId = await upsertSeason(client, leagueId, seasonYear, null, null, false);
                            seasonCache.set(seasonKey, seasonId);
                        }

                        // 2. Teams
                        // Home Team
                        let homeTeamId = teamCache.get(item.teams.home.id);
                        if (!homeTeamId) {
                            homeTeamId = await upsertTeam(
                                client,
                                item.teams.home.id,
                                countryId, // Use league country for team? Not reliable but acceptable fallback.
                                null,
                                item.teams.home.name,
                                item.teams.home.logo
                            );
                            teamCache.set(item.teams.home.id, homeTeamId);
                        }

                        // Away Team
                        let awayTeamId = teamCache.get(item.teams.away.id);
                        if (!awayTeamId) {
                            awayTeamId = await upsertTeam(
                                client,
                                item.teams.away.id,
                                countryId,
                                null,
                                item.teams.away.name,
                                item.teams.away.logo
                            );
                            teamCache.set(item.teams.away.id, awayTeamId);
                        }

                        // 3. Venue
                        let venueId: number | null = null;
                        if (item.fixture.venue?.id) {
                            venueId = venueCache.get(item.fixture.venue.id) ?? null;
                            if (!venueId) {
                                venueId = await upsertVenue(
                                    client,
                                    item.fixture.venue.id,
                                    item.fixture.venue.name || 'Unknown Venue',
                                    item.fixture.venue.city
                                );
                                venueCache.set(item.fixture.venue.id, venueId!);
                            }
                        }

                        // 4. Match
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

                        await client.query('RELEASE SAVEPOINT fixture_process');

                    } catch (error) {
                        await client.query('ROLLBACK TO SAVEPOINT fixture_process');
                        logger.warn('Failed to process fixture', {
                            fixtureId: item.fixture.id,
                            error: error instanceof Error ? error.message : String(error)
                        });
                        fixturesSkipped++;
                    }
                }

                await updateSyncState(client, sourceId, ENTITY_NAME, {
                    date: targetDate,
                    fixturesUpserted,
                    fixturesSkipped,
                    apiCallsMade
                });

                await client.query('COMMIT');
                logger.info(`Sync completed for ${targetDate}`, { fixturesUpserted, fixturesSkipped });

            } catch (error) {
                await client.query('ROLLBACK');
                throw error;
            } finally {
                client.release();
            }
        });

        if (result === null) {
            logger.warn('Could not acquire lock for sync:daily_fixtures');
        }

    } catch (error) {
        logger.error('Job failed', error);
        throw error;
    } finally {
        lockClient.release();
    }
}


export async function syncFixturesWindow(daysBack: number = 10, daysForward: number = 14): Promise<void> {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - daysBack);
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + daysForward);

    logger.info(`Starting sync window from ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`);

    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        const dateString = currentDate.toISOString().split('T')[0];
        try {
            await syncDailyFixtures(dateString);
        } catch (error) {
            logger.error(`Failed to sync fixtures for ${dateString}: ${error}`);
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    logger.info('Sync window completed');
}
