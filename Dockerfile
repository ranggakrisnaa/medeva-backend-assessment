# -------------------
# Build stage
# -------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (dev + prod)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN pnpm build

# -------------------
# Runtime stage
# -------------------
FROM node:20-alpine

WORKDIR /app

# Install pnpm for runtime scripts (optional)
RUN npm install -g pnpm

# Copy package files (needed for npm scripts)
COPY package.json pnpm-lock.yaml ./

# Copy built node_modules from builder (all deps included)
COPY --from=builder /app/node_modules ./node_modules

# Copy built dist
COPY --from=builder /app/dist ./dist

# Copy prisma schema (optional, jika runtime butuh migration)
COPY prisma ./prisma

# Add non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

EXPOSE 3150

CMD ["node", "dist/index.js", "--service=rest"]
