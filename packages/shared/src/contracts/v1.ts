/*
  packages/shared/src/contracts/v1.ts

  Shared API response/request schemas for our Stage-1 API.
  - Runtime validation via Zod
  - Static typing via z.infer

  Usage (API):
    import { V1 } from "@oddins/shared/contracts";
    const payload = V1.LeaguesResponse.parse(data);

  Usage (Frontend):
    import { V1 } from "@oddins/shared/contracts";
    type LeaguesResponse = V1.LeaguesResponseT;
*/

import { z } from "zod";

// -----------------------------
// Helpers
// -----------------------------
const ISODate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/i, "Expected YYYY-MM-DD");

const ISODateTime = z
  .string()
  .datetime({ offset: true })
  .or(z.string().datetime({ offset: false }));

const Slug = z
  .string()
  .min(1)
  .max(200)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/i, "Expected slug-like string");

const IdInt = z.number().int().positive();

// -----------------------------
// Core entities
// -----------------------------
export const Country = z.object({
  name: z.string().min(1),
  code: z.string().min(1).nullable().optional(),
  slug: Slug.optional(),
  flagUrl: z.string().url().nullable().optional(),
});
export type CountryT = z.infer<typeof Country>;

export const LeagueRef = z.object({
  id: IdInt,
  name: z.string().min(1),
  slug: Slug,
  type: z.string().nullable().optional(),
  logoUrl: z.string().url().nullable().optional(),
  country: Country,
});
export type LeagueRefT = z.infer<typeof LeagueRef>;

export const TeamRef = z.object({
  id: IdInt,
  name: z.string().min(1),
  slug: Slug,
  logoUrl: z.string().url().nullable().optional(),
});
export type TeamRefT = z.infer<typeof TeamRef>;

export const Score = z.object({
  home: z.number().int().nullable(),
  away: z.number().int().nullable(),
});
export type ScoreT = z.infer<typeof Score>;

export const FeaturedTipRef = z
  .object({
    id: IdInt,
    title: z.string().min(1),
    isPremium: z.boolean(),
    confidence: z.number().int().min(0).max(100).nullable().optional(),
  })
  .nullable();
export type FeaturedTipRefT = z.infer<typeof FeaturedTipRef>;

export const MatchCard = z.object({
  matchId: IdInt,
  providerFixtureId: z.number().int().positive().nullable().optional(),
  kickoffAt: ISODateTime,
  status: z.string().min(1),
  elapsed: z.number().int().min(0).max(130).nullable().optional(),
  league: LeagueRef,
  homeTeam: TeamRef,
  awayTeam: TeamRef,
  score: Score,
  featuredTip: FeaturedTipRef.optional(),
});
export type MatchCardT = z.infer<typeof MatchCard>;

// -----------------------------
// META
// -----------------------------
export const HealthResponse = z.object({ ok: z.literal(true) });
export type HealthResponseT = z.infer<typeof HealthResponse>;

export const MetaResponse = z.object({
  version: z.string().min(1),
  env: z.string().min(1),
  now: ISODateTime,
});
export type MetaResponseT = z.infer<typeof MetaResponse>;

// -----------------------------
// HOME
// -----------------------------
export const MatchesTodayRequest = z.object({
  date: ISODate,
  tz: z.string().min(1).optional(),
});
export type MatchesTodayRequestT = z.infer<typeof MatchesTodayRequest>;

export const MatchesTodayResponse = z.object({
  date: ISODate,
  matches: z.array(MatchCard),
});
export type MatchesTodayResponseT = z.infer<typeof MatchesTodayResponse>;

export const FeaturedTipsResponse = z.object({
  date: ISODate,
  tips: z.array(
    z.object({
      id: IdInt,
      matchId: IdInt,
      title: z.string().min(1),
      shortReason: z.string().nullable().optional(),
      isPremium: z.boolean(),
      confidence: z.number().int().min(0).max(100).nullable().optional(),
      publishedAt: ISODateTime.nullable().optional(),
    })
  ),
});
export type FeaturedTipsResponseT = z.infer<typeof FeaturedTipsResponse>;

// -----------------------------
// PREDICTIONS
// -----------------------------
export const MarketKey = z.enum([
  "FT_1X2",
  "OU_GOALS",
  "BTTS",
  "OU_CORNERS",
  "OU_CARDS",
]);
export type MarketKeyT = z.infer<typeof MarketKey>;

export const PredictionsQuery = z.object({
  date: ISODate.optional(),
  region: z.string().min(1).optional(),
  leagueSlug: Slug.optional(),
  marketKey: MarketKey.optional(),
  page: z.coerce.number().int().min(1).default(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(200).default(50).optional(),
});
export type PredictionsQueryT = z.infer<typeof PredictionsQuery>;

export const PredictionItem = z.object({
  matchId: IdInt,
  kickoffAt: ISODateTime,
  league: z.object({
    name: z.string().min(1),
    slug: Slug,
    countryName: z.string().min(1),
  }),
  homeTeam: TeamRef,
  awayTeam: TeamRef,
  marketKey: MarketKey,
  line: z.number().nullable().optional(),
  selection: z.string().nullable().optional(),
  probability: z.number().min(0).max(1).nullable().optional(),
  confidence: z.number().int().min(0).max(100).nullable().optional(),
  shortExplanation: z.string().nullable().optional(),
  isPremium: z.boolean().optional().default(false),
});
export type PredictionItemT = z.infer<typeof PredictionItem>;

export const PredictionsResponse = z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  items: z.array(PredictionItem),
});
export type PredictionsResponseT = z.infer<typeof PredictionsResponse>;

// -----------------------------
// LEAGUES
// -----------------------------
export const LeaguesResponse = z.array(
  z.object({
    country: Country,
    leagues: z.array(
      z.object({
        id: IdInt,
        name: z.string().min(1),
        slug: Slug,
        logoUrl: z.string().url().nullable().optional(),
        type: z.string().nullable().optional(),
      })
    ),
  })
);
export type LeaguesResponseT = z.infer<typeof LeaguesResponse>;

export const StandingsRow = z.object({
  rank: z.number().int().min(1),
  team: TeamRef,
  played: z.number().int().min(0),
  wins: z.number().int().min(0),
  draws: z.number().int().min(0),
  losses: z.number().int().min(0),
  gf: z.number().int().min(0),
  ga: z.number().int().min(0),
  points: z.number().int().min(0),
});
export type StandingsRowT = z.infer<typeof StandingsRow>;

export const LeagueDetailResponse = z.object({
  league: LeagueRef,
  season: z.object({
    year: z.number().int().min(1900),
    isCurrent: z.boolean(),
  }),
  standings: z.array(StandingsRow),
  fixtures: z.array(MatchCard),
  results: z.array(MatchCard),
  statsSummary: z
    .object({
      goalsAvg: z.number().nullable().optional(),
      cornersAvg: z.number().nullable().optional(),
      cardsAvg: z.number().nullable().optional(),
    })
    .optional(),
  faq: z
    .array(
      z.object({
        q: z.string().min(1),
        a: z.string().min(1),
      })
    )
    .optional(),
});
export type LeagueDetailResponseT = z.infer<typeof LeagueDetailResponse>;

// -----------------------------
// TEAMS
// -----------------------------
export const TeamsQuery = z.object({
  query: z.string().min(1).optional(),
  leagueSlug: Slug.optional(),
});
export type TeamsQueryT = z.infer<typeof TeamsQuery>;

export const TeamsResponse = z.array(TeamRef);
export type TeamsResponseT = z.infer<typeof TeamsResponse>;

export const TeamDetailResponse = z.object({
  team: TeamRef,
  nextMatch: MatchCard.nullable().optional(),
  recentMatches: z.array(MatchCard).optional(),
  statsSummary: z
    .record(z.string(), z.any())
    .optional(), // keep flexible for stage 1
});
export type TeamDetailResponseT = z.infer<typeof TeamDetailResponse>;

export const TeamTab = z.enum([
  "overview",
  "fixtures",
  "results",
  "stats",
  "corners",
  "cards",
]);
export type TeamTabT = z.infer<typeof TeamTab>;

export const TeamTabResponse = z.object({
  team: TeamRef,
  tab: TeamTab,
  items: z.array(z.any()), // stage 1: flexible; refine later
});
export type TeamTabResponseT = z.infer<typeof TeamTabResponse>;

// -----------------------------
// STREAMS (placeholder)
// -----------------------------
export const StreamsQuery = z.object({
  region: z.string().min(1).optional(),
  date: ISODate.optional(),
});
export type StreamsQueryT = z.infer<typeof StreamsQuery>;

export const StreamsResponse = z.object({
  date: ISODate.optional(),
  region: z.string().min(1).optional(),
  items: z.array(
    z.object({
      league: z.object({ name: z.string().min(1), slug: Slug }),
      matchId: IdInt,
      kickoffAt: ISODateTime,
      homeTeam: TeamRef,
      awayTeam: TeamRef,
      whereToWatch: z.array(
        z.object({
          name: z.string().min(1),
          url: z.string().url().nullable().optional(),
        })
      ),
    })
  ),
});
export type StreamsResponseT = z.infer<typeof StreamsResponse>;

// -----------------------------
// MATCH DETAIL
// -----------------------------
export const OddsMarketLine = z.object({
  marketKey: MarketKey,
  line: z.number().nullable().optional(),
  selection: z.string().min(1),
  oddValue: z.number(),
  impliedProb: z.number().min(0).max(1).nullable().optional(),
});
export type OddsMarketLineT = z.infer<typeof OddsMarketLine>;

export const OddsLatest = z
  .object({
    bookmaker: z.object({ name: z.string().min(1), slug: Slug.optional() }),
    capturedAt: ISODateTime,
    markets: z.array(OddsMarketLine),
  })
  .nullable();
export type OddsLatestT = z.infer<typeof OddsLatest>;

export const MatchDetailResponse = z.object({
  match: MatchCard,
  oddsLatest: OddsLatest.optional(),
  predictions: z.array(PredictionItem).optional(),
  h2h: z.array(MatchCard).optional(),
  whereToWatch: z
    .array(
      z.object({
        name: z.string().min(1),
        url: z.string().url().nullable().optional(),
      })
    )
    .optional(),
});
export type MatchDetailResponseT = z.infer<typeof MatchDetailResponse>;

// -----------------------------
// CONTENT
// -----------------------------
export const ArticleType = z.enum(["academy", "blog"]);
export type ArticleTypeT = z.infer<typeof ArticleType>;

export const ArticlesQuery = z.object({
  type: ArticleType,
  category: z.string().min(1).optional(),
  page: z.coerce.number().int().min(1).default(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(200).default(20).optional(),
});
export type ArticlesQueryT = z.infer<typeof ArticlesQuery>;

export const ArticleListItem = z.object({
  id: IdInt,
  type: ArticleType,
  slug: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  publishedAt: ISODateTime.nullable().optional(),
  updatedAt: ISODateTime.nullable().optional(),
});
export type ArticleListItemT = z.infer<typeof ArticleListItem>;

export const ArticlesResponse = z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  items: z.array(ArticleListItem),
});
export type ArticlesResponseT = z.infer<typeof ArticlesResponse>;

export const ArticleDetailResponse = z.object({
  id: IdInt,
  type: ArticleType,
  slug: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  bodyMd: z.string().min(1),
  publishedAt: ISODateTime.nullable().optional(),
  updatedAt: ISODateTime.nullable().optional(),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
});
export type ArticleDetailResponseT = z.infer<typeof ArticleDetailResponse>;

// -----------------------------
// SEARCH
// -----------------------------
export const SearchQuery = z.object({
  q: z.string().min(1),
});
export type SearchQueryT = z.infer<typeof SearchQuery>;

export const SearchResponse = z.object({
  q: z.string().min(1),
  leagues: z.array(z.object({ id: IdInt, name: z.string(), slug: Slug })),
  teams: z.array(TeamRef),
  matches: z.array(MatchCard),
  articles: z.array(ArticleListItem),
});
export type SearchResponseT = z.infer<typeof SearchResponse>;

// -----------------------------
// Namespace export
// -----------------------------
export const V1 = {
  // meta
  HealthResponse,
  MetaResponse,

  // home
  MatchesTodayRequest,
  MatchesTodayResponse,
  FeaturedTipsResponse,

  // predictions
  MarketKey,
  PredictionsQuery,
  PredictionsResponse,

  // leagues
  LeaguesResponse,
  LeagueDetailResponse,

  // teams
  TeamsQuery,
  TeamsResponse,
  TeamTab,
  TeamTabResponse,
  TeamDetailResponse,

  // streams
  StreamsQuery,
  StreamsResponse,

  // match detail
  MatchDetailResponse,

  // content
  ArticleType,
  ArticlesQuery,
  ArticlesResponse,
  ArticleDetailResponse,

  // search
  SearchQuery,
  SearchResponse,
} as const;

