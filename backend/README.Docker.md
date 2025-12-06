# Docker Setup for Innogram Backend

This guide explains how to run the backend using Docker and Docker Compose.

## Prerequisites

- Docker Desktop (or Docker Engine + Docker Compose)
- Docker Compose v2 (usually included with Docker Desktop)
- At least 2GB of free disk space

## Quick Start

### 1. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and update the values, especially:
- `DB_PASSWORD` - Choose a secure password
- `JWT_KEY` - Generate a secure random key (32+ characters recommended)

### 2. Start All Services

**Option A: With Logs in Terminal (Recommended for Development)**
```bash
npm run docker:up
```

This will:
- Build the backend image
- Start PostgreSQL, Redis, and Backend containers
- Show all logs in real-time in your terminal
- Keep running until you press `Ctrl+C`

**Option B: Detached Mode (Background)**
```bash
npm run docker:up:detached
```

Then view logs separately:
```bash
npm run docker:logs:backend
```

### 3. Verify Services Are Running

```bash
npm run docker:ps
```

You should see:
- `innogram-postgres` - Healthy
- `innogram-redis` - Healthy  
- `innogram-backend` - Running

### 4. Test the API

```bash
curl http://localhost:3001/
```

Expected response:
```json
{
  "success": true,
  "message": "Auth microservice is running",
  "timestamp": "2025-12-06T21:00:00.000Z"
}
```

## Available NPM Scripts

### Starting/Stopping
- `npm run docker:up` - Start all services with logs visible
- `npm run docker:up:detached` - Start all services in background
- `npm run docker:down` - Stop and remove all containers
- `npm run docker:stop` - Stop containers (keeps them)
- `npm run docker:start` - Start stopped containers
- `npm run docker:restart` - Restart all containers

### Logs
- `npm run docker:logs` - View all logs (follow mode)
- `npm run docker:logs:backend` - View only backend logs
- `npm run docker:logs:postgres` - View only PostgreSQL logs
- `npm run docker:logs:redis` - View only Redis logs

### Management
- `npm run docker:ps` - List running containers
- `npm run docker:rebuild` - Rebuild backend image and restart
- `npm run docker:clean` - Stop containers and remove volumes (⚠️ deletes data)

## Docker Compose Services

### Backend Service
- **Image**: Built from `Dockerfile`
- **Port**: `3001:3001`
- **Environment**: Configured via `.env` file
- **Depends on**: PostgreSQL and Redis (waits for health checks)

### PostgreSQL Service
- **Image**: `postgres:16-alpine`
- **Port**: `5432:5432`
- **Database**: `Innogram` (configurable)
- **Volume**: `postgres_data` (persistent storage)
- **Health Check**: Checks every 10 seconds

### Redis Service
- **Image**: `redis:7-alpine`
- **Port**: `6379:6379`
- **Volume**: `redis_data` (persistent storage)
- **Health Check**: Checks every 10 seconds

## Environment Variables

The following environment variables are used in Docker:

### Database
- `DB_USER` - PostgreSQL username (default: `postgres`)
- `DB_PASSWORD` - PostgreSQL password (⚠️ required)
- `DB_DATABASE` - Database name (default: `Innogram`)
- `DB_PORT` - PostgreSQL port (default: `5432`)

### Backend
- `JWT_KEY` - Secret key for JWT tokens (⚠️ required)
- `PORT` - Backend server port (default: `3001`)
- `NODE_ENV` - Environment (set to `production` in Docker)
- `CORS_ORIGIN` - CORS allowed origin (default: `*`)
- `LOG_LEVEL` - Logging level (default: `info`)

### Redis
- `REDIS_HOST` - Redis hostname (default: `redis` in Docker)
- `REDIS_PORT` - Redis port (default: `6379`)

### Token Expiry
- `ACCESS_TOKEN_EXPIRY` - Access token expiry in seconds (default: `180`)
- `REFRESH_TOKEN_EXPIRY` - Refresh token expiry in seconds (default: `600`)

## Dockerfile Details

The Dockerfile uses a multi-stage build:

1. **deps**: Installs npm dependencies
2. **prisma**: Generates Prisma Client
3. **builder**: Copies all application files
4. **runner**: Final production image with non-root user

**Key Features:**
- Uses Node.js 20 Alpine (smaller image size)
- Runs as non-root user (`nodejs`)
- Automatically runs Prisma migrations on startup
- Includes startup script (`start.sh`)

## Startup Process

When the backend container starts, it runs `start.sh` which:

1. Generates Prisma Client
2. Runs database migrations (`prisma migrate deploy`)
3. Falls back to `prisma db push` if no migrations exist
4. Starts the Node.js application

You'll see logs like:
```
Generating Prisma Client...
✔ Generated Prisma Client (v7.1.0)
Running database migrations...
No pending migrations to apply.
Starting application...
Server is running on http://localhost:3001
```

## Viewing Logs

### Real-time Logs (Follow Mode)

**All services:**
```bash
npm run docker:logs
```

**Backend only:**
```bash
npm run docker:logs:backend
```

**Last 50 lines:**
```bash
docker-compose logs --tail=50 backend
```

### Log Format

Backend logs include:
- Timestamp
- Log level (info, warn, error)
- Message
- Request/response details (method, path, status, duration)

Example:
```
2025-12-06 21:10:15 [info]: POST /internal/auth/login
2025-12-06 21:10:15 [info]: POST /internal/auth/login 200 {"statusCode":200,"duration":"45ms"}
```

## Accessing Services

### PostgreSQL

**Connect via psql:**
```bash
docker-compose exec postgres psql -U postgres -d Innogram
```

**Or from host:**
```bash
psql -h localhost -p 5432 -U postgres -d Innogram
```

### Redis

**Connect via redis-cli:**
```bash
docker-compose exec redis redis-cli
```

**Or from host:**
```bash
redis-cli -h localhost -p 6379
```

**Check blacklisted tokens:**
```bash
docker-compose exec redis redis-cli
> KEYS blacklist:*
> GET blacklist:<token>
```

### Backend Container

**Execute commands in container:**
```bash
docker-compose exec backend sh
```

**Run Prisma commands:**
```bash
docker-compose exec backend npx prisma studio --schema=./apps/auth_microservice/db/schema.prisma
```

## Troubleshooting

### Backend Can't Connect to Database

**Symptoms:**
- Backend logs show connection errors
- Health check fails

**Solutions:**
1. Check PostgreSQL is healthy:
   ```bash
   docker-compose ps
   ```
   Should show `(healthy)` for postgres

2. Check database logs:
   ```bash
   docker-compose logs postgres
   ```

3. Verify environment variables:
   ```bash
   docker-compose exec backend env | grep DB_
   ```

4. Test connection manually:
   ```bash
   docker-compose exec backend sh -c "echo \$DATABASE_URL"
   ```

### Prisma Migration Errors

**Symptoms:**
- "No migration found" errors
- Schema sync issues

**Solutions:**
1. The container automatically runs `prisma db push` if migrations fail
2. To manually reset:
   ```bash
   docker-compose exec backend npx prisma db push --schema=./apps/auth_microservice/db/schema.prisma --accept-data-loss
   ```

3. To create a new migration:
   ```bash
   docker-compose exec backend npx prisma migrate dev --schema=./apps/auth_microservice/db/schema.prisma --name init
   ```

### Port Already in Use

**Symptoms:**
- `bind: address already in use` error

**Solutions:**

**For PostgreSQL (5432):**
- Change port in `docker-compose.yml`:
  ```yaml
  ports:
    - "5433:5432"  # Use 5433 on host
  ```
- Or stop the conflicting service:
  ```bash
  # Find process
  netstat -ano | findstr :5432
  # Kill process (Windows)
  taskkill /PID <pid> /F
  ```

**For Backend (3001):**
- Change port in `docker-compose.yml`:
  ```yaml
  ports:
    - "3002:3001"  # Use 3002 on host
  ```
- Update `.env`:
  ```
  PORT=3001  # Keep 3001 in container
  ```

**For Redis (6379):**
- Change port in `docker-compose.yml`:
  ```yaml
  ports:
    - "6380:6379"  # Use 6380 on host
  ```

### Container Keeps Restarting

**Symptoms:**
- Container status shows "Restarting"
- Logs show errors

**Solutions:**
1. Check logs:
   ```bash
   docker-compose logs backend
   ```

2. Check if it's a dependency issue:
   ```bash
   docker-compose ps
   ```
   Ensure postgres and redis are healthy

3. Rebuild the container:
   ```bash
   npm run docker:rebuild
   ```

### Logs Not Showing in Terminal

**Symptoms:**
- Running `npm run docker:up` but only seeing postgres/redis logs

**Solutions:**
1. Ensure you're using the updated script (without `-d` flag)
2. Check backend is running:
   ```bash
   docker-compose ps
   ```

3. View backend logs separately:
   ```bash
   npm run docker:logs:backend
   ```

4. Check if backend started successfully:
   ```bash
   docker-compose logs --tail=50 backend
   ```

### Prisma 7 Configuration Issues

**Symptoms:**
- "The datasource property is required" error
- "The datasource property `url` is no longer supported" error

**Solutions:**
1. Ensure `prisma.config.ts` exists at backend root
2. Verify `DATABASE_URL` is set in environment
3. Check Prisma version:
   ```bash
   docker-compose exec backend npx prisma --version
   ```
   Should be 7.x

4. Regenerate Prisma Client:
   ```bash
   docker-compose exec backend npx prisma generate --schema=./apps/auth_microservice/db/schema.prisma
   ```

## Rebuilding After Code Changes

### Quick Rebuild (Recommended)
```bash
npm run docker:rebuild
```

This will:
1. Rebuild the backend image from scratch
2. Restart all containers

### Manual Rebuild
```bash
# Rebuild backend
docker-compose build --no-cache backend

# Restart
docker-compose up -d backend
```

### Development Workflow

For active development, you can:

1. **Mount code as volume** (add to `docker-compose.yml`):
   ```yaml
   backend:
     volumes:
       - ./apps:/app/apps
       - ./package.json:/app/package.json
   ```
   Then restart: `docker-compose restart backend`

2. **Use local development** (without Docker):
   ```bash
   npm start
   ```

## Data Persistence

### Volumes

Data is persisted in Docker volumes:
- `postgres_data` - PostgreSQL database files
- `redis_data` - Redis persistence files

### Backup Database

```bash
# Create backup
docker-compose exec postgres pg_dump -U postgres Innogram > backup.sql

# Restore backup
docker-compose exec -T postgres psql -U postgres Innogram < backup.sql
```

### Remove All Data

⚠️ **Warning**: This deletes all data!

```bash
npm run docker:clean
```

Or manually:
```bash
docker-compose down -v
```

## Production Deployment

### Considerations

1. **Environment Variables**: Use secrets management (Docker secrets, AWS Secrets Manager, etc.)
2. **Database**: Use managed PostgreSQL service or configure backups
3. **Redis**: Consider Redis Cluster for high availability
4. **Logging**: Use centralized logging (ELK stack, CloudWatch, etc.)
5. **Monitoring**: Add health checks, metrics, and alerting
6. **Security**:
   - Use strong passwords
   - Enable HTTPS
   - Set proper CORS origins
   - Use Docker secrets for sensitive data
   - Run containers as non-root (already configured)

### Docker Compose Override

Create `docker-compose.prod.yml` for production:

```yaml
version: '3.8'
services:
  backend:
    environment:
      NODE_ENV: production
      LOG_LEVEL: warn
    restart: always
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "5"
```

Then use:
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Useful Commands Reference

```bash
# Start services
npm run docker:up

# Stop services
npm run docker:down

# View logs
npm run docker:logs:backend

# Rebuild
npm run docker:rebuild

# Check status
npm run docker:ps

# Access PostgreSQL
docker-compose exec postgres psql -U postgres -d Innogram

# Access Redis
docker-compose exec redis redis-cli

# Execute command in backend
docker-compose exec backend <command>

# View container resource usage
docker stats

# Clean up everything
npm run docker:clean
```

## Getting Help

If you encounter issues:

1. Check the logs: `npm run docker:logs:backend`
2. Verify containers are running: `npm run docker:ps`
3. Check environment variables: `docker-compose config`
4. Review this troubleshooting section
5. Check [POSTMAN_TESTING_GUIDE.md](./POSTMAN_TESTING_GUIDE.md) for API issues
