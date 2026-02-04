/**
 * Database queries for syncing data
 */

import { Pool, PoolClient } from 'pg';
import { logger } from '../logger';

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
  cursor: any
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

