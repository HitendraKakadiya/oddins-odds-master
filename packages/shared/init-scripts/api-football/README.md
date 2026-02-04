# API-Football Database Schema Initializer

Safe, idempotent PostgreSQL schema initialization system for Oddins Odds.

## Features

✅ **26 Tables** - Complete schema for API-Football data + product features
✅ **Idempotent** - Safe to run multiple times, skips unchanged tables
✅ **Smart Updates** - Detects schema changes via SHA-256 fingerprinting
✅ **Safety Checks** - Prevents accidental drops in production
✅ **Proper Ordering** - Respects foreign key dependencies

## Quick Start

```bash
# From repo root
cd /home/elad/odds/oddins-odds

# Initialize schema (first time)
APP_ENV=local DATABASE_URL=postgresql://oddins:oddins_dev@localhost:5433/oddins_odds pnpm db:init

# Or use root scripts
pnpm db:init

# Reset database (drop all tables then init)
pnpm db:reset
```

## Safety Rules

The system will **BLOCK** drop+recreate operations unless ALL conditions are met:

1. ✅ `APP_ENV` == `"local"`
2. ✅ `DATABASE_URL` host is one of: `localhost`, `127.0.0.1`, `postgres`
3. ✅ `DATABASE_URL` database is NOT: `prod`, `production`, `stage`, `staging`

If any condition fails, the script will abort with a loud error.

## How It Works

### 1. Fingerprinting

Each SQL file is normalized and hashed with SHA-256:
- Comments removed
- Whitespace normalized
- Converted to lowercase

The fingerprint is stored in `oddins_schema.schema_fingerprints`.

### 2. Idempotent Execution

For each table:
- **If doesn't exist** → Create + store fingerprint
- **If exists + fingerprint matches** → Skip (no changes)
- **If exists + fingerprint differs** → Drop CASCADE + recreate + update fingerprint

### 3. Transaction Safety

Each table operation runs in its own transaction:
- Success → COMMIT
- Error → ROLLBACK

## Schema Overview

26 tables organized by category:

### Core Data (API-Football)
- `countries`, `leagues`, `seasons`, `season_coverage`
- `venues`, `teams`, `season_teams`
- `matches`, `team_match_stats`

### Odds & Betting
- `bookmakers`, `markets`
- `odds_snapshots`, `odds_snapshot_lines`

### Predictions & Tips
- `prediction_models`, `match_predictions`
- `tips`

### Content
- `articles`

### Users & Auth
- `users`, `user_preferences`
- `subscriptions`, `user_favourites`
- `alerts`, `notification_outbox`

### System
- `provider_sources`, `provider_sync_state`
- `idempotency_keys`

## File Structure

```
packages/shared/init-scripts/api-football/
├── README.md
├── run_init.ts          # Main initializer
├── run_reset.ts         # Drop all tables
└── tables/
    ├── 001_countries.sql
    ├── 002_leagues.sql
    ├── 003_seasons.sql
    ... (26 files total)
    └── 026_idempotency_keys.sql
```

## Testing Schema Changes

To test the drop+recreate logic:

1. Modify a SQL file (e.g., add a column)
2. Run `pnpm db:init`
3. The affected table will be dropped and recreated
4. All dependent tables (CASCADE) will also be recreated

## Example Output

```
🚀 Oddins Odds - Database Schema Initializer

📊 APP_ENV: local
🔗 DATABASE_URL: postgresql://oddins:oddins_dev@localhost:5433/oddins_odds

✅ Safety Check: Passed (drop+recreate enabled)
✅ Connected to database
✅ Metadata schema ready

📁 Found 26 table definition files

Processing: 001_countries.sql
  ✅ Created table: countries
... (24 more tables)

============================================================
📊 SUMMARY
============================================================
✅ Created:   26
♻️  Recreated: 0
⏭️  Skipped:   0
❌ Errors:    0
============================================================

✅ Database initialization completed successfully!
```

## Environment Variables

```bash
# Required
DATABASE_URL=postgresql://user:pass@host:port/database

# Optional (defaults to "development")
APP_ENV=local  # Must be "local" for drop+recreate
```

## Troubleshooting

### "Cannot drop+recreate: APP_ENV is not local"
Set `APP_ENV=local` when running the script.

### "Database host is not localhost"
The safety check prevents remote database modifications. Use tunneling or adjust safety rules.

### "Table already exists" error on first run
The init system should handle this. If you see this error, there may be a bug in the fingerprint logic.

### Foreign key violations
Tables are created in dependency order. If you see FK errors, check the numeric prefixes in filenames.

## Adding New Tables

1. Create `XXX_tablename.sql` in `tables/` (use next number)
2. Include `CREATE TABLE` + indexes/constraints
3. Run `pnpm db:init`

The table will be created automatically.

## Production Deployment

**DO NOT** use this init system directly in production. Instead:

1. Generate migration files from the SQL definitions
2. Use a proper migration tool (e.g., Flyway, Liquibase, or custom)
3. Apply migrations through CI/CD
4. Keep fingerprints for local dev only

This system is designed for **LOCAL DEVELOPMENT** only.

