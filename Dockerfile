# KwikShot Development Dockerfile
# Multi-stage build for development and production

# Development stage
FROM node:18-alpine as development

# Set working directory
WORKDIR /app

# Install system dependencies for Electron
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    xvfb \
    dbus \
    gtk+3.0 \
    libxss \
    gconf \
    alsa-lib

# Set environment variables for Electron
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    DISPLAY=:99

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S kwikshot -u 1001

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=development

# Copy source code
COPY . .

# Change ownership to app user
RUN chown -R kwikshot:nodejs /app
USER kwikshot

# Expose configurable port (default 3000)
ARG DEV_PORT=3000
ENV DEV_PORT=${DEV_PORT}
ENV DEV_HOST=0.0.0.0
EXPOSE ${DEV_PORT}

# Start development server
CMD ["npm", "run", "dev"]

# Production build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine as production

WORKDIR /app

# Install system dependencies for Electron
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Set environment variables
ENV NODE_ENV=production \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S kwikshot -u 1001

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production && npm cache clean --force

# Copy built application from build stage
COPY --from=build --chown=kwikshot:nodejs /app/dist ./dist

# Copy necessary files
COPY --chown=kwikshot:nodejs src/main ./src/main
COPY --chown=kwikshot:nodejs src/preload ./src/preload
COPY --chown=kwikshot:nodejs src/shared ./src/shared

# Switch to app user
USER kwikshot

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
