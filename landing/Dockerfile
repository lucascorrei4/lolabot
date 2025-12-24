# Dockerfile for Landing Page (Standalone)
# This Dockerfile is designed to be run from the /landing directory context
# or with Build Path set to /landing in PaaS platforms like EasyPanel.

# 1. Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Copy package files from the current directory (landing/)
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --no-audit --no-fund


# 2. Build the application
FROM node:20-alpine AS builder
WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy the rest of the application code from the current directory
COPY . .

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Build-time environment variable for the blog API URL
# This gets baked into the Next.js build for client-side fetching
ARG NEXT_PUBLIC_LOLABOT_API_URL=http://localhost:3000
ENV NEXT_PUBLIC_LOLABOT_API_URL=$NEXT_PUBLIC_LOLABOT_API_URL

# Build the Next.js app
RUN npm run build


# 3. Production runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Runtime environment variable for blog API
# Override this when running the container: -e NEXT_PUBLIC_LOLABOT_API_URL=https://your-api.com
ENV NEXT_PUBLIC_LOLABOT_API_URL=http://localhost:3000

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Copy necessary files for standalone runner
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Clean up cache and telemetry files that trigger false positive malware alerts
RUN rm -rf .next/cache 2>/dev/null || true && \
    rm -rf /home/nextjs/.local 2>/dev/null || true && \
    rm -rf /root/.local 2>/dev/null || true

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
