# -------------------
# Build stage
# -------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy app source
COPY . .

# Generate Prisma client (WAJIB agar TS mengenal PrismaClient dan model)
RUN npx prisma generate

# Build TypeScript
RUN pnpm build

# -------------------
# Runtime stage
# -------------------
FROM node:20-alpine

WORKDIR /app

# Install pnpm (untuk runtime scripts jika perlu)
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Copy node_modules hasil build
COPY --from=builder /app/node_modules ./node_modules

# Copy generated Prisma client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy built dist
COPY --from=builder /app/dist ./dist

# Copy prisma schema (hanya jika runtime membutuhkan migration / introspection)
COPY prisma ./prisma

# Add non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

# Expose port
EXPOSE 3150

# Command
CMD ["node", "dist/index.js", "--service=rest"]
