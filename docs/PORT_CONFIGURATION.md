# Port Configuration Guide

This guide explains how to configure custom ports for KwikShot development server to avoid conflicts with other applications.

## Overview

KwikShot uses port 3000 by default for the webpack development server. You can override this using environment variables, Make commands, or Docker configuration.

## Configuration Methods

### 1. Environment Variables

The following environment variables control the development server:

| Variable | Default | Description |
|----------|---------|-------------|
| `DEV_PORT` | `3000` | Port for the webpack development server |
| `DEV_HOST` | `localhost` | Host for the development server |
| `NODE_ENV` | `development` | Node environment mode |

#### Using .env File

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file:
   ```bash
   DEV_PORT=8080
   DEV_HOST=localhost
   NODE_ENV=development
   ```

3. Start development:
   ```bash
   npm run dev
   ```

#### Inline Environment Variables

```bash
# Single command
DEV_PORT=8080 npm run dev

# Export and use
export DEV_PORT=8080
export DEV_HOST=0.0.0.0
npm run dev
```

### 2. Make Commands

The Makefile provides convenient commands for development:

```bash
# Default port (3000)
make dev

# Custom port
make dev DEV_PORT=8080

# Custom port and host
make dev DEV_PORT=4000 DEV_HOST=0.0.0.0

# Interactive port selection
make dev-custom

# View current configuration
make status
```

### 3. Docker Configuration

#### Using docker-compose

```bash
# Default port (3000)
docker-compose up kwikshot-dev

# Custom port
DEV_PORT=8080 docker-compose up kwikshot-dev

# Using .env file
echo "DEV_PORT=5000" > .env
docker-compose up kwikshot-dev
```

#### Using Docker directly

```bash
# Build image
docker build -t kwikshot:latest .

# Run with custom port
docker run -it --rm \
  -p 8080:8080 \
  -e DEV_PORT=8080 \
  -e DEV_HOST=0.0.0.0 \
  kwikshot:latest
```

## Common Use Cases

### Avoiding Port Conflicts

If port 3000 is already in use:

```bash
# Check what's using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Use alternative port
make dev DEV_PORT=8080
```

### Development on Multiple Projects

```bash
# Project 1 on port 3000
cd project1 && make dev

# Project 2 on port 4000
cd project2 && make dev DEV_PORT=4000

# Project 3 on port 5000
cd project3 && DEV_PORT=5000 npm run dev
```

### Network Development

To access the development server from other devices on your network:

```bash
# Allow external connections
make dev DEV_PORT=3000 DEV_HOST=0.0.0.0

# Then access from other devices using your IP
# http://192.168.1.100:3000
```

## Troubleshooting

### Port Already in Use

```bash
# Error: EADDRINUSE: address already in use :::3000

# Solution 1: Use different port
make dev DEV_PORT=8080

# Solution 2: Kill process using the port
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Electron Not Connecting

If Electron can't connect to the development server:

1. Check if the port matches in both webpack config and Electron main process
2. Ensure the development server is running before Electron starts
3. Check firewall settings if using custom host

## Best Practices

1. **Use .env files** for consistent development environments
2. **Document port usage** in your team's development guide
3. **Use Make commands** for simplified development workflow
4. **Test with different ports** to ensure flexibility
5. **Use Docker** for consistent environments across team members
