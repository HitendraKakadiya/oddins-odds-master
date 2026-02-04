# OddinsOdds

A sports betting odds aggregator built with a modern TypeScript monorepo architecture.

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm (install via `npm install -g pnpm`)

### Installation

```bash
# Install dependencies
pnpm install

# Run development servers
pnpm dev

# Or run individual services
pnpm dev:frontend  # Frontend on http://localhost:3000
pnpm dev:api       # API on http://localhost:3001
pnpm dev:worker    # Worker process
```

### Build

```bash
# Build all packages and apps
pnpm build
```

### Lint

```bash
# Lint all packages and apps
pnpm lint
```

## Repository Structure

```
oddins-odds/
├── apps/
│   ├── frontend/     # Next.js frontend (App Router)
│   ├── api/          # Fastify API server
│   └── worker/       # Background ingestion worker
├── packages/
│   └── shared/       # Shared types and constants
├── tests/
│   ├── unit/         # Unit tests
│   ├── integration/  # Integration tests
│   ├── contract/     # Contract tests
│   └── smoke/        # Smoke tests
├── docker/
│   ├── docker-compose.yml
│   └── env.example
├── infra/            # Infrastructure as code
└── .github/
    └── workflows/    # CI/CD workflows
```

## Architecture

- **Monorepo**: pnpm workspaces for dependency management
- **Frontend**: Next.js 14 with App Router
- **API**: Fastify server with TypeScript
- **Worker**: Background data ingestion service
- **Shared**: Common types and constants used across all apps

## Docker

Build and run with Docker Compose:

```bash
cd docker
cp env.example .env
docker-compose up --build
```

All Docker images are built for `linux/arm64` (AWS Graviton compatible).

## Database Setup

Follow these steps to set up the database locally:

1. **Start PostgreSQL**:
   ```bash
   cd docker
   docker-compose up -d postgres
   ```
2. **Initialize Schema**:
   ```bash
   pnpm db:init
   ```
3. **Seed Sample Data**:
   ```bash
   pnpm db:seed
   ```

> [!NOTE]  
> The following scripts in `package.json` have been updated to use the Node.js `--env-file=../../.env` flag for loading environment variables from the root:
> - **@oddins/shared**: `db:init`, `db:reset`
> - **@oddins/api**: `db:seed`
>
> Example: `"db:init": "tsx --env-file=../../.env init-scripts/api-football/run_init.ts"`
>   in Shared package.json:
>   "db:init": "tsx --env-file=../../.env init-scripts/api-football/run_init.ts",
>   "db:reset": "tsx --env-file=../../.env init-scripts/api-football/run_reset.ts"
>
>   in API package.json:
>   "db:seed": "tsx --env-file=../../.env src/db/seed.ts"
> This ensures that your root `.env` file is loaded correctly regardless of which directory you run the command from. (Requires Node.js v20.6.0+).

## Development

- Frontend runs on port 3000
- API runs on port 3001
- PostgreSQL (in Docker) runs on port 5433 (mapped from 5432)

## License

MIT