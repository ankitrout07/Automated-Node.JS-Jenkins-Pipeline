# Stage 1: Build & Dependencies
FROM node:24-alpine AS build

WORKDIR /app

# Copy package files
COPY src/package*.json ./

# Install ALL dependencies (including devDependencies for tests)
RUN npm install

# Copy source code
COPY src/ .

# Stage 2: Production Image
FROM node:24-alpine AS production

# Set Environment Variables
ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

# Copy package files first for caching
COPY src/package*.json ./

# Install ONLY production dependencies
RUN npm ci --only=production

# Copy ONLY necessary source files from build stage (avoiding node_modules)
COPY --from=build /app/index.js ./
# If there are other source files, copy them here too. 
# We avoid COPY --from=build /app/ . to prevent bringing in dev dependencies.

# Security: Run as non-root user
USER node

# Health check for Docker engine
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/healthz', (res) => { if (res.statusCode === 200) process.exit(0); else process.exit(1); })"

EXPOSE 3000

CMD ["node", "index.js"]
