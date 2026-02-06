/**
 * Zod schemas for API-Football responses
 */

import { z } from 'zod';

// Coverage schema
const CoverageSchema = z.object({
  fixtures: z.object({
    events: z.boolean().optional().default(false),
    lineups: z.boolean().optional().default(false),
    statistics_fixtures: z.boolean().optional().default(false),
    statistics_players: z.boolean().optional().default(false),
  }).optional().default({}),
  standings: z.boolean().optional().default(false),
  players: z.boolean().optional().default(false),
  top_scorers: z.boolean().optional().default(false),
  top_assists: z.boolean().optional().default(false),
  top_cards: z.boolean().optional().default(false),
  injuries: z.boolean().optional().default(false),
  predictions: z.boolean().optional().default(false),
  odds: z.boolean().optional().default(false),
}).passthrough();

// Season schema
const SeasonSchema = z.object({
  year: z.number(),
  start: z.string().nullable().optional(),
  end: z.string().nullable().optional(),
  current: z.boolean(),
  coverage: CoverageSchema.optional(),
}).passthrough();

// Country schema
const CountrySchema = z.object({
  name: z.string(),
  code: z.string().nullable().optional(),
  flag: z.string().nullable().optional(),
}).passthrough();

// League schema
const LeagueSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.string().nullable().optional(),
  logo: z.string().nullable().optional(),
}).passthrough();

// Response item
const LeagueResponseItemSchema = z.object({
  league: LeagueSchema,
  country: CountrySchema,
  seasons: z.array(SeasonSchema),
}).passthrough();

// API response envelope
export const LeaguesResponseSchema = z.object({
  get: z.string().optional(),
  parameters: z.unknown().optional(),
  errors: z.unknown().optional(),
  results: z.number().optional(),
  paging: z.unknown().optional(),
  response: z.array(LeagueResponseItemSchema),
}).passthrough();

export type LeaguesResponse = z.infer<typeof LeaguesResponseSchema>;
export type LeagueResponseItem = z.infer<typeof LeagueResponseItemSchema>;

// Helper to normalize coverage flags
export function normalizeCoverage(coverage: unknown) {
  const c = coverage as Record<string, unknown> || {};
  const fixtures = (c.fixtures as Record<string, unknown>) || {};

  return {
    fixtures: true, // Always assume we can fetch fixtures
    events: (fixtures.events as boolean) || false,
    lineups: (fixtures.lineups as boolean) || false,
    stats_fixtures: (fixtures.statistics_fixtures as boolean) || false,
    stats_players: (fixtures.statistics_players as boolean) || false,
    standings: (c.standings as boolean) || false,
    injuries: c.injuries || false,
    predictions: c.predictions || false,
    odds: c.odds || false,
  };
}

