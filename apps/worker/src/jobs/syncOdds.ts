/**
 * Job: Sync Odds from API-Football
 * 
 * Fetches betting odds for upcoming fixtures and stores them with bookmakers and markets.
 */

import { getPool } from '../db/pool';
import { logger } from '../logger';
import { apiFootballClient } from '../provider/apiFootballClient';
import { withLock } from '../orchestration/locks';
import { ensureProviderSource, updateSyncState } from '../db/queries';
import { PoolClient } from 'pg';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

interface OddsResponse {
  fixture: {
    id: number;
    timezone: string;
    date: string;
    timestamp: number;
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string | null;
    flag: string | null;
    season: number;
  };
  bookmakers: Array<{
    id: number;
    name: string;
    bets: Array<{
      id: number;
      name: string;
      values: Array<{
        value: string;
        odd: string;
      }>;
    }>;
  }>;
}

interface OddsAPIResponse {
  response: OddsResponse[];
  results: number;
}

// Utility: slugify
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Upsert bookmaker
async function upsertBookmaker(
  client: PoolClient,
  providerBookmakerId: number,
  name: string
): Promise<number> {
  const slug = slugify(name);

  const result = await client.query(
    `INSERT INTO bookmakers (provider_bookmaker_id, name, slug)
     VALUES ($1, $2, $3)
     ON CONFLICT (provider_bookmaker_id) DO UPDATE SET
       name = $2,
       slug = $3
     RETURNING id`,
    [providerBookmakerId, name, slug]
  );
  return result.rows[0].id;
}

const MARKET_KEY_MAP: Record<number, string> = {
  1: 'FT_1X2',
  5: 'OU_GOALS',
  8: 'BTTS',
  12: 'DC',
  10: 'CS',
  11: 'DNB',
  20: 'HT_FT',
  4: 'HANDICAP',
  16: 'ASIAN_HANDICAP',
  13: 'OU_CORNERS',
  14: 'OU_CARDS',
  2: 'HOME_AWAY',
};

// Upsert market
async function upsertMarket(
  client: PoolClient,
  providerMarketId: number,
  name: string,
  isLineMarket: boolean = false
): Promise<number> {
  // Use mapped key if available, otherwise slugify the name
  const key = MARKET_KEY_MAP[providerMarketId] || slugify(name);

  const result = await client.query(
    `INSERT INTO markets (provider_market_id, name, key, is_line_market)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (provider_market_id) DO UPDATE SET
       name = $2,
       key = $3,
       is_line_market = $4
     RETURNING id`,
    [providerMarketId, name, key, isLineMarket]
  );
  return result.rows[0].id;
}

// Get match ID by provider_fixture_id
async function getMatchId(
  client: PoolClient,
  providerFixtureId: number
): Promise<number | null> {
  const result = await client.query(
    `SELECT id FROM matches WHERE provider_fixture_id = $1`,
    [providerFixtureId]
  );
  return result.rows.length > 0 ? result.rows[0].id : null;
}

// Create odds snapshot
async function createOddsSnapshot(
  client: PoolClient,
  matchId: number,
  bookmakerId: number,
  capturedAt: Date,
  isLive: boolean = false
): Promise<number> {
  const result = await client.query(
    `INSERT INTO odds_snapshots (match_id, bookmaker_id, captured_at, source, is_live)
     VALUES ($1, $2, $3, 'api-football', $4)
     RETURNING id`,
    [matchId, bookmakerId, capturedAt, isLive]
  );
  return result.rows[0].id;
}

// Create odds line
async function createOddsLine(
  client: PoolClient,
  snapshotId: number,
  marketId: number,
  selection: string,
  oddValue: number,
  line: number | null = null
): Promise<void> {
  // Calculate implied probability
  const impliedProb = 1 / oddValue;

  await client.query(
    `INSERT INTO odds_snapshot_lines (snapshot_id, market_id, line, selection, odd_value, implied_prob)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [snapshotId, marketId, line, selection, oddValue, impliedProb]
  );
}

// Get upcoming fixture IDs (next 14 days)
async function getUpcomingFixtures(client: PoolClient): Promise<number[]> {
  const result = await client.query(
    `SELECT provider_fixture_id
     FROM matches
     WHERE kickoff_at > NOW() 
       AND kickoff_at < NOW() + INTERVAL '14 days'
       AND status IN ('NS', 'TBD')
     ORDER BY kickoff_at
     LIMIT 1000`,
    []
  );
  return result.rows.map((row: { provider_fixture_id: number }) => row.provider_fixture_id);
}

export async function syncOdds(): Promise<void> {
  const JOB_NAME = 'sync:odds';
  const ENTITY_NAME = 'odds';

  logger.setContext({ job: JOB_NAME });
  logger.info('Starting odds sync job');

  const pool = getPool();
  const lockClient = await pool.connect();

  try {
    const result = await withLock(lockClient, JOB_NAME, async () => {
      const client = await pool.connect();

      try {
        await client.query('BEGIN');

        const sourceId = await ensureProviderSource(client);
        logger.info('Provider source ensured', { sourceId });

        let bookmakersUpserted = 0;
        let marketsUpserted = 0;
        let snapshotsCreated = 0;
        let linesCreated = 0;
        let apiCallsMade = 0;
        let fixturesProcessed = 0;
        let fixturesSkipped = 0;

        // Get upcoming fixtures
        const upcomingFixtures = await getUpcomingFixtures(client);
        logger.info(`Found ${upcomingFixtures.length} upcoming fixtures to fetch odds for`);

        const capturedAt = dayjs().utc().toDate();
        const bookmakersCache = new Map<number, number>();
        const marketsCache = new Map<number, number>();

        // Process each fixture (limit to first 100 to avoid excessive API usage)
        const fixturesLimit = Math.min(upcomingFixtures.length, 100);

        for (let i = 0; i < fixturesLimit; i++) {
          const providerFixtureId = upcomingFixtures[i];

          try {
            logger.info(`Fetching odds for fixture ${providerFixtureId} (${i + 1}/${fixturesLimit})`);

            // Fetch odds from API
            const rawResponse = await apiFootballClient.getOdds({
              fixture: providerFixtureId,
            }) as OddsAPIResponse;
            apiCallsMade++;

            if (!rawResponse.response || rawResponse.response.length === 0) {
              logger.warn(`No odds available for fixture ${providerFixtureId}`);
              fixturesSkipped++;
              continue;
            }

            const oddsData = rawResponse.response[0];

            // Get match ID
            const matchId = await getMatchId(client, providerFixtureId);
            if (!matchId) {
              logger.warn(`Match not found for fixture ${providerFixtureId}`);
              fixturesSkipped++;
              continue;
            }

            // Process each bookmaker
            for (const bookmaker of oddsData.bookmakers) {
              // Upsert bookmaker (with cache)
              let bookmakerId = bookmakersCache.get(bookmaker.id);
              if (!bookmakerId) {
                bookmakerId = await upsertBookmaker(client, bookmaker.id, bookmaker.name);
                bookmakersCache.set(bookmaker.id, bookmakerId);
                bookmakersUpserted++;
              }

              // Create snapshot
              const snapshotId = await createOddsSnapshot(client, matchId, bookmakerId, capturedAt);
              snapshotsCreated++;

              // Process each bet/market
              for (const bet of bookmaker.bets) {
                // Upsert market (with cache)
                let marketId = marketsCache.get(bet.id);
                if (!marketId) {
                  const isLineMarket = bet.name.includes('Over/Under') || bet.name.includes('Handicap');
                  marketId = await upsertMarket(client, bet.id, bet.name, isLineMarket);
                  marketsCache.set(bet.id, marketId);
                  marketsUpserted++;
                }

                // Create odds lines for each value
                for (const value of bet.values) {
                  const oddValue = parseFloat(value.odd);
                  if (!isNaN(oddValue) && oddValue > 0) {
                    await createOddsLine(client, snapshotId, marketId, value.value, oddValue);
                    linesCreated++;
                  }
                }
              }
            }

            fixturesProcessed++;

            // Rate limiting: wait 200ms between requests
            await new Promise(resolve => setTimeout(resolve, 200));

          } catch (fixtureError: unknown) {
            logger.warn('Failed to process fixture odds', {
              fixtureId: providerFixtureId,
              error: fixtureError instanceof Error ? fixtureError.message : String(fixtureError),
            });
            fixturesSkipped++;
            // Continue with next fixture
          }
        }

        // Update sync state
        await updateSyncState(client, sourceId, ENTITY_NAME, {
          bookmakersUpserted,
          marketsUpserted,
          snapshotsCreated,
          linesCreated,
          apiCallsMade,
          fixturesProcessed,
          fixturesSkipped,
          fixturesLimit,
          capturedAt: capturedAt.toISOString(),
        });

        await client.query('COMMIT');

        logger.info('Sync completed successfully', {
          bookmakersUpserted,
          marketsUpserted,
          snapshotsCreated,
          linesCreated,
          apiCallsMade,
          fixturesProcessed,
          fixturesSkipped,
        });

        return {
          bookmakersUpserted,
          marketsUpserted,
          snapshotsCreated,
          linesCreated,
          apiCallsMade,
          fixturesProcessed,
          fixturesSkipped,
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


