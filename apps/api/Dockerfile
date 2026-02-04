# Multi-stage build for API
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages/shared/package.json ./packages/shared/package.json
COPY apps/api/package.json ./apps/api/package.json
RUN pnpm install --frozen-lockfile --prod=false

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps ./apps
COPY --from=deps /app/packages ./packages  
COPY . .
RUN pnpm --filter @oddins/shared build
RUN pnpm --filter @oddins/api build

FROM base AS runner
RUN apk add --no-cache wget
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 apiuser
RUN adduser --system --uid 1001 apiuser

COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules

USER apiuser
EXPOSE 3001

CMD ["node", "apps/api/dist/index.js"]

