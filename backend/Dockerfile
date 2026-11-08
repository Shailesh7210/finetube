# ==========================================
# FineTube Backend Dockerfile (Multi-stage)
# ==========================================

# Stage 1: Build TypeScript source
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

# Stage 2: Production runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist

# Non-root user for security (Blueprint §15.2)
USER node

EXPOSE 5000

CMD ["node", "dist/server.js"]
