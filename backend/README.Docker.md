# Docker Setup for Innogram Backend

This guide explains how to run the backend using Docker.

## Prerequisites

- Docker Desktop (or Docker Engine + Docker Compose)
- Docker Compose v2 (usually included with Docker Desktop)

## Quick Start

### Option 1: Full Stack (Backend + Database + Redis)

1. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and update the values, especially:
   - `DB_PASSWORD` - Choose a secure password
   - `JWT_KEY` - Generate a secure random key

2. **Start all services:**
   ```bash
   docker-compose up -d
   ```

3. **View logs:**
   ```bash
   docker-compose logs -f backend
   ```

4. **Stop services:**
   ```bash
   docker-compose down
   ```

## Docker Commands

### Build the backend image:
```bash
docker-compose build backend
```

### Rebuild from scratch:
```bash
docker-compose build --no-cache backend
```

### View running containers:
```bash
docker-compose ps
```

### Access PostgreSQL:
```bash
docker-compose exec postgres psql -U postgres -d Innogram
```

### Access Redis CLI:
```bash
docker-compose exec redis redis-cli
```

### View database logs:
```bash
docker-compose logs postgres
```

### Clean up (removes containers and volumes):
```bash
docker-compose down -v
```

## Environment Variables

The following environment variables are used:

- `DB_USER` - PostgreSQL username (default: postgres)
- `DB_PASSWORD` - PostgreSQL password
- `DB_DATABASE` - Database name (default: Innogram)
- `DB_PORT` - PostgreSQL port (default: 5432)
- `JWT_KEY` - Secret key for JWT tokens
- `PORT` - Backend server port (default: 3001)
- `REDIS_HOST` - Redis hostname (default: redis in Docker)
- `REDIS_PORT` - Redis port (default: 6379)

## Troubleshooting

### Backend can't connect to database:
- Make sure PostgreSQL container is healthy: `docker-compose ps`
- Check database logs: `docker-compose logs postgres`
- Verify environment variables in `.env` file

### Prisma migration errors:
- The container will automatically run `prisma db push` if migrations fail
- To manually reset: `docker-compose exec backend npx prisma db push --schema=./apps/auth_microservice/db/schema.prisma`

### Port already in use:
- Change the port in `docker-compose.yml` or stop the conflicting service
- For PostgreSQL: Change `"${DB_PORT:-5432}:5432"` to use a different host port
- For backend: Change `"3001:3001"` to use a different host port

### Rebuild after code changes:
```bash
docker-compose up -d --build backend
```

## Production Considerations

For production deployment:
1. Use strong passwords and secrets
2. Don't commit `.env` file to version control
3. Use Docker secrets or environment variables from your hosting platform
4. Consider using `docker-compose.prod.yml` with additional security settings
5. Set up proper backup strategies for PostgreSQL volumes
