# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install all deps
RUN pnpm install --frozen-lockfile

# Copy app source
COPY . .

# Build typescript
RUN pnpm build


# Runtime stage
FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

# Copy only needed files
COPY package.json pnpm-lock.yaml ./

# Copy node_modules hasil build (lebih aman daripada install ulang)
COPY --from=builder /app/node_modules ./node_modules

# Copy prisma client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy built dist
COPY --from=builder /app/dist ./dist

# Copy prisma schema for migrations if needed
COPY prisma ./prisma

# Add non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

EXPOSE 3150

CMD ["node", "dist/index.js", "--service=rest"]
