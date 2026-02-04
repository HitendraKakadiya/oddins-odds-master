# Worker Service

This worker service handles background jobs for syncing data from external providers into our PostgreSQL database.

## Structure

```
src/
├── index.ts                      # Entry point and job orchestration
├── config.ts                     # Environment configuration
├── logger.ts                     # Structured logging
├── db/
│   ├── pool.ts                  # PostgreSQL connection pool
│   └── queries.ts               # Database upsert queries
├── provider/
│   ├── apiFootballClient.ts     # HTTP client with retry logic
│   └── schemas.ts               # Zod validation schemas
├── jobs/
│   └── syncLeaguesSeasons.ts    # Sync leagues & seasons job
└── orchestration/
    └── locks.ts                 # PostgreSQL advisory locks
```

## Available Jobs

### sync:leagues

Syncs all leagues and seasons from API-Football into PostgreSQL.

**What it does:**
- Fetches all leagues from `/leagues` endpoint
- Validates response with Zod schemas
- Upserts data into: `countries`, `leagues`, `seasons`, `season_coverage`
- Updates `provider_sync_state` with progress
- Uses advisory locks to prevent concurrent runs
- Retries on rate limits (429) and server errors (5xx)

**Tables affected:**
- `countries` - Country information
- `leagues` - League details with slugs
- `seasons` - Season years and dates
- `season_coverage` - Available data coverage per season
- `provider_sources` - Provider metadata
- `provider_sync_state` - Sync status and errors

## Running Jobs

### Local Development

```bash
# Set required environment variables
export DATABASE_URL=postgresql://oddins:oddins_dev@localhost:5433/oddins_odds
export SPORTS_PROVIDER_API_KEY=your_api_key_here
export APP_ENV=local

# Run the sync job
pnpm --filter @oddins/worker sync:leagues

# Or from repo root
pnpm worker:sync:leagues
```

### Docker Compose

The worker can run inside Docker Compose with the Postgres network:

```bash
# Ensure .env file has SPORTS_PROVIDER_API_KEY set
docker compose run --rm worker sync:leagues
```

## Environment Variables

Required:
- `DATABASE_URL` - PostgreSQL connection string
- `SPORTS_PROVIDER_API_KEY` - API-Football API key

Optional:
- `APP_ENV` - Environment name (default: "development")
- `API_FOOTBALL_BASE_URL` - API base URL (default: "https://v3.football.api-sports.io")

## Verification

After running `sync:leagues`, verify the data:

```sql
-- Check counts
SELECT COUNT(*) FROM countries;
SELECT COUNT(*) FROM leagues;
SELECT COUNT(*) FROM seasons;
SELECT COUNT(*) FROM season_coverage;

-- Check sync state
SELECT * FROM provider_sync_state WHERE entity = 'leagues_seasons';

-- View sample data
SELECT l.name, c.name as country, COUNT(s.id) as seasons
FROM leagues l
JOIN countries c ON l.country_id = c.id
LEFT JOIN seasons s ON l.id = s.league_id
GROUP BY l.id, l.name, c.name
ORDER BY seasons DESC
LIMIT 10;
```

## Features

- **Idempotent**: Safe to run multiple times
- **Transactional**: All-or-nothing database updates
- **Lock-based**: Prevents concurrent job runs
- **Resilient**: Automatic retries with exponential backoff
- **Validated**: Zod schemas ensure data quality
- **Observable**: Structured JSON logging
- **Safe**: Never logs API keys

## Error Handling

Errors are logged and recorded in `provider_sync_state`:
- Network failures: Automatic retry with exponential backoff
- Rate limits (429): Respects retry-after header
- Validation errors: Logged and skipped (job continues)
- Database errors: Transaction rollback
- Lock conflicts: Job exits gracefully

## Adding New Jobs

1. Create job file in `src/jobs/yourJob.ts`
2. Implement job logic with `withLock()` wrapper
3. Add command handler in `src/index.ts`
4. Add script to `package.json`
5. Update this README

## Development

```bash
# Install dependencies
pnpm install

# Build TypeScript
pnpm --filter @oddins/worker build

# Run in development mode
pnpm --filter @oddins/worker dev sync:leagues

# Lint code
pnpm --filter @oddins/worker lint
```

