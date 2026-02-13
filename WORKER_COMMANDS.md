# Worker Sync Commands

This document explains the available worker commands for syncing data from the API-Football API to your local database.

## Available Commands

### `pnpm worker:sync:window`
**Purpose**: Sync fixtures for a comprehensive date range (24 days total)
- **What it does**: Fetches and stores match fixtures for:
  - Past 10 days (historical data)
  - Future 14 days (upcoming fixtures)
- **When to use**: 
  - First-time database population
  - After database reset
  - When you need to refresh all data
- **Duration**: ~3-5 minutes (depends on API response time)
- **API Calls**: ~24 calls (one per date)

**Example**:
```bash
pnpm worker:sync:window
```

### `pnpm worker:sync:leagues`
**Purpose**: Sync league and season metadata
- **What it does**: Fetches league information, country data, and season details
- **When to use**: 
  - Initial setup
  - When adding new leagues to track
- **Duration**: ~1-2 minutes

**Example**:
```bash
pnpm worker:sync:leagues
```

### `pnpm worker:scheduler`
**Purpose**: Start the automatic sync scheduler
- **What it does**: Runs background jobs on a schedule:
  - **Every hour (at :00)**: Runs `sync:window` to keep data fresh
  - **Every hour (at :30)**: Syncs betting odds
  - **Daily (at 3:00 AM)**: Cleans up data older than 10 days
- **When to use**: 
  - Production environment
  - When you want automatic data updates
- **Duration**: Runs indefinitely until stopped (Ctrl+C)

**Example**:
```bash
pnpm worker:scheduler
```

## Typical Workflow

### First Time Setup
```bash
# 1. Initialize database schema
pnpm db:init

# 2. Sync league metadata
pnpm worker:sync:leagues

# 3. Populate fixtures for 24-day window
pnpm worker:sync:window

# 4. Start the app
pnpm dev
```

### Production
```bash
# Run scheduler in background to keep data fresh
pnpm worker:scheduler
```

## Troubleshooting

### No data after sync
- **Check API Key**: Ensure `.env` has valid `API_FOOTBALL_KEY`
- **Check Rate Limits**: Free tier = 100 requests/day
- **Check Logs**: Look for error messages in worker output

### Sync taking too long
- The window sync makes ~24 API calls, which can take 3-5 minutes
- This is normal behavior due to API rate limiting

### Database errors
- Ensure PostgreSQL is running
- Verify `DATABASE_URL` in `.env` is correct
- Run `pnpm db:init` to create/update schema
