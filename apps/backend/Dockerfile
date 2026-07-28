# Dockerfile.backend
FROM node:24-alpine AS builder
WORKDIR /app

# Copy root manifest + lockfile first (for layer caching)
COPY package*.json ./

# Copy every workspace's package.json individually — folder structure matters
COPY apps/backend/package.json ./apps/backend/package.json
COPY packages/shared/package.json ./packages/shared/package.json

# Now npm ci can see the full workspace tree
RUN npm ci

# Bring in actual source now
COPY apps/backend ./apps/backend
COPY packages/shared ./packages/shared

# Build only the backend workspace
RUN npm run build -w apps/backend

# ---- Production stage ----
FROM node:24-alpine
WORKDIR /app

COPY package*.json ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY packages/shared/package.json ./packages/shared/package.json
RUN npm ci --omit=dev

COPY --from=builder /app/apps/backend/dist ./apps/backend/dist

WORKDIR /app/apps/backend
EXPOSE 3000
CMD ["node", "dist/index.js"]