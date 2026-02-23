/**
 * Database queries for syncing data
 */

import { PoolClient } from 'pg';

// Utility: slugify
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Ensure provider_sources has "api-football"
export async function ensureProviderSource(client: PoolClient): Promise<number> {
  const result = await client.query(
    `INSERT INTO provider_sources (name, base_url)
     VALUES ($1, $2)
     ON CONFLICT (name) DO UPDATE SET base_url = $2
     RETURNING id`,
    ['api-football', 'https://v3.football.api-sports.io']
  );
  return result.rows[0].id;
}

// Upsert country
export async function upsertCountry(
  client: PoolClient,
  name: string,
  code: string | null,
  flagUrl: string | null
): Promise<number> {
  const result = await client.query(
    `INSERT INTO countries (name, code, flag_url)
     VALUES ($1, $2, $3)
     ON CONFLICT (name) DO UPDATE SET 
       code = COALESCE($2, countries.code),
       flag_url = COALESCE($3, countries.flag_url)
     RETURNING id`,
    [name, code, flagUrl]
  );
  return result.rows[0].id;
}

// Upsert league
export async function upsertLeague(
  client: PoolClient,
  providerLeagueId: number,
  countryId: number,
  name: string,
  type: string | null,
  logoUrl: string | null
): Promise<number> {
  const slug = slugify(name);

  const result = await client.query(
    `INSERT INTO leagues (provider_league_id, country_id, name, type, logo_url, slug)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (provider_league_id) DO UPDATE SET
       name = $3,
       type = $4,
       logo_url = $5,
       slug = $6,
       country_id = $2
     RETURNING id`,
    [providerLeagueId, countryId, name, type, logoUrl, slug]
  );
  return result.rows[0].id;
}

// Upsert season
export async function upsertSeason(
  client: PoolClient,
  leagueId: number,
  year: number,
  startDate: string | null,
  endDate: string | null,
  isCurrent: boolean
): Promise<number> {
  const result = await client.query(
    `INSERT INTO seasons (league_id, year, start_date, end_date, is_current)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (league_id, year) DO UPDATE SET
       start_date = $3,
       end_date = $4,
       is_current = $5
     RETURNING id`,
    [leagueId, year, startDate, endDate, isCurrent]
  );
  return result.rows[0].id;
}

// Upsert season_coverage
export async function upsertSeasonCoverage(
  client: PoolClient,
  seasonId: number,
  coverage: {
    fixtures: boolean;
    events: boolean;
    lineups: boolean;
    stats_fixtures: boolean;
    stats_players: boolean;
    standings: boolean;
    injuries: boolean;
    predictions: boolean;
    odds: boolean;
  }
): Promise<void> {
  await client.query(
    `INSERT INTO season_coverage (
       season_id, fixtures, events, lineups, 
       stats_fixtures, stats_players, standings, 
       injuries, predictions, odds
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     ON CONFLICT (season_id) DO UPDATE SET
       fixtures = $2,
       events = $3,
       lineups = $4,
       stats_fixtures = $5,
       stats_players = $6,
       standings = $7,
       injuries = $8,
       predictions = $9,
       odds = $10`,
    [
      seasonId,
      coverage.fixtures,
      coverage.events,
      coverage.lineups,
      coverage.stats_fixtures,
      coverage.stats_players,
      coverage.standings,
      coverage.injuries,
      coverage.predictions,
      coverage.odds,
    ]
  );
}

// Update provider_sync_state on success
export async function updateSyncState(
  client: PoolClient,
  sourceId: number,
  entity: string,
  cursor: unknown
): Promise<void> {
  await client.query(
    `INSERT INTO provider_sync_state (source_id, entity, last_synced_at, cursor)
     VALUES ($1, $2, NOW(), $3)
     ON CONFLICT (source_id, entity) DO UPDATE SET
       last_synced_at = NOW(),
       cursor = $3,
       last_error_at = NULL,
       last_error = NULL`,
    [sourceId, entity, JSON.stringify(cursor)]
  );
}

// Update provider_sync_state on error
export async function recordSyncError(
  client: PoolClient,
  sourceId: number,
  entity: string,
  error: string
): Promise<void> {
  const truncatedError = error.substring(0, 2000);

  await client.query(
    `INSERT INTO provider_sync_state (source_id, entity, last_error_at, last_error)
     VALUES ($1, $2, NOW(), $3)
     ON CONFLICT (source_id, entity) DO UPDATE SET
       last_error_at = NOW(),
       last_error = $3`,
    [sourceId, entity, truncatedError]
  );
}

// Upsert Prediction Model
export async function upsertPredictionModel(
  client: PoolClient,
  name: string,
  version: string,
  source: string,
  isActive: boolean
): Promise<number> {
  const result = await client.query(
    `INSERT INTO prediction_models (name, version, source, is_active)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (name, version, source) DO UPDATE SET is_active = $4
     RETURNING id`,
    [name, version, source, isActive]
  );
  return result.rows[0].id;
}

// Upsert Market
export async function upsertMarket(
  client: PoolClient,
  providerMarketId: number,
  name: string,
  key: string,
  isLineMarket: boolean
): Promise<number> {
  const result = await client.query(
    `INSERT INTO markets (provider_market_id, name, key, is_line_market)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (provider_market_id) DO UPDATE SET 
       name = EXCLUDED.name, 
       key = EXCLUDED.key, 
       is_line_market = EXCLUDED.is_line_market
     RETURNING id`,
    [providerMarketId, name, key, isLineMarket]
  );
  return result.rows[0].id;
}

// Upsert Match Prediction
export async function upsertMatchPrediction(
  client: PoolClient,
  matchId: number,
  modelId: number,
  marketId: number,
  line: number | null,
  selection: string,
  payload: Record<string, unknown>,
  probability: number | null,
  confidence: number | null
): Promise<void> {
  // We use a DELETE then INSERT approach to be safe about the unique constraint 
  // on match_predictions which may or may exclude the 'line' column in its unique index.
  await client.query(
    `DELETE FROM match_predictions 
     WHERE match_id = $1 AND model_id = $2 AND market_id = $3 AND selection = $4`,
    [matchId, modelId, marketId, selection]
  );

  await client.query(
    `INSERT INTO match_predictions (
      match_id, model_id, market_id, line, selection, payload, probability, confidence, generated_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
    [matchId, modelId, marketId, line, selection, JSON.stringify(payload), probability, confidence]
  );
}

