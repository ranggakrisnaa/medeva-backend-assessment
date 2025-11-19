# -------------------
# Build stage
# -------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install deps
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build TS
RUN pnpm build

# -------------------
# Runtime stage
# -------------------
FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install only production deps
RUN pnpm install --frozen-lockfile --prod

# Copy built dist
COPY --from=builder /app/dist ./dist

# Copy prisma schema
COPY prisma ./prisma

# Generate Prisma client in runtime
RUN npx prisma generate

# Add non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

EXPOSE 3150

CMD ["node", "dist/index.js", "--service=rest"]
