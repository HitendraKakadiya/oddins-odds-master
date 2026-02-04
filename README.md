# Oddins Odds

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

## Development

- Frontend runs on port 3000
- API runs on port 3001
- PostgreSQL (in Docker) runs on port 5432

## License

MIT

