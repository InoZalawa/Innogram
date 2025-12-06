# Innogram Backend

Backend services for the Innogram project, built with Node.js, TypeScript, Express, Prisma, PostgreSQL, and Redis.

## Project Structure

This is an Nx monorepo containing:

```
backend/
├── apps/
│   └── auth_microservice/    # Authentication microservice
├── packages/                  # Shared packages (if any)
├── docker-compose.yml         # Docker Compose configuration
├── Dockerfile                 # Backend Docker image
├── prisma.config.ts           # Prisma 7 configuration
└── package.json              # Root package.json
```

## Quick Start

### Prerequisites

- Node.js 20+ (LTS recommended)
- Docker Desktop (for Docker setup)
- PostgreSQL 16+ (if running locally)
- Redis 7+ (if running locally)

### Option 1: Docker (Recommended)

1. **Clone and navigate:**
   ```bash
   cd backend
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env and set DB_PASSWORD and JWT_KEY
   ```

3. **Start all services:**
   ```bash
   npm run docker:up
   ```

4. **Verify it's working:**
   ```bash
   curl http://localhost:3001/
   ```

See [README.Docker.md](./README.Docker.md) for detailed Docker instructions.

### Option 2: Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your local database credentials
   ```

3. **Start PostgreSQL and Redis** (locally or via Docker)

4. **Set up database:**
   ```bash
   npx prisma generate --schema=./apps/auth_microservice/db/schema.prisma
   npx prisma migrate dev --schema=./apps/auth_microservice/db/schema.prisma
   ```

5. **Start the server:**
   ```bash
   npm start
   ```

## Services

### Auth Microservice

A secure authentication service with JWT tokens, refresh tokens, and token blacklisting.

**Documentation:** [apps/auth_microservice/README.md](./apps/auth_microservice/README.md)

**Features:**
- User registration and login
- JWT access and refresh tokens
- Token blacklisting via Redis
- Rate limiting
- Input validation
- Comprehensive logging

**API Base URL:** `http://localhost:3001`

**Testing Guide:** [POSTMAN_TESTING_GUIDE.md](./POSTMAN_TESTING_GUIDE.md)

## Available Scripts

### Development
- `npm start` - Start the auth microservice
- `npm run format` - Format code with Prettier
- `npm run check-format` - Check code formatting

### Docker
- `npm run docker:up` - Start all services (logs visible)
- `npm run docker:up:detached` - Start all services in background
- `npm run docker:down` - Stop all services
- `npm run docker:logs` - View all logs
- `npm run docker:logs:backend` - View backend logs only
- `npm run docker:ps` - List running containers
- `npm run docker:restart` - Restart all services
- `npm run docker:rebuild` - Rebuild and restart backend
- `npm run docker:clean` - Stop and remove volumes (⚠️ deletes data)

## Environment Variables

See `.env.example` for all required variables. Key variables:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_KEY` - Secret key for JWT tokens
- `REDIS_HOST` - Redis hostname
- `PORT` - Server port (default: 3001)

## Technology Stack

- **Runtime:** Node.js 20
- **Framework:** Express 5
- **Language:** TypeScript
- **ORM:** Prisma 7
- **Database:** PostgreSQL 16
- **Cache:** Redis 7
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** express-validator
- **Logging:** Winston
- **Containerization:** Docker & Docker Compose

## Prisma 7 Notes

This project uses Prisma 7, which has some differences from Prisma 6:

1. **Configuration File**: Uses `prisma.config.ts` at the root (not just `schema.prisma`)
2. **Adapter Pattern**: Uses `@prisma/adapter-pg` for database connections
3. **No URL in Schema**: The `url` property is removed from `schema.prisma`

The `prisma.config.ts` file is already configured. See [apps/auth_microservice/README.md](./apps/auth_microservice/README.md) for details.

## Documentation

- **[Auth Microservice README](./apps/auth_microservice/README.md)** - Complete auth service documentation
- **[Docker Guide](./README.Docker.md)** - Docker setup and troubleshooting
- **[Postman Testing Guide](./POSTMAN_TESTING_GUIDE.md)** - API testing instructions

## Development Workflow

### Making Changes

1. **Code changes** - Edit files in `apps/auth_microservice/`
2. **Database changes** - Update `apps/auth_microservice/db/schema.prisma`
3. **Generate Prisma Client:**
   ```bash
   npx prisma generate --schema=./apps/auth_microservice/db/schema.prisma
   ```
4. **Create migration:**
   ```bash
   npx prisma migrate dev --schema=./apps/auth_microservice/db/schema.prisma --name <migration-name>
   ```
5. **Test locally:**
   ```bash
   npm start
   ```
6. **Or test with Docker:**
   ```bash
   npm run docker:rebuild
   ```

### Code Style

- Use TypeScript strict mode
- Follow existing code structure
- Add proper error handling
- Include input validation
- Add logging for important operations
- Format code with Prettier: `npm run format`

## Testing

See [POSTMAN_TESTING_GUIDE.md](./POSTMAN_TESTING_GUIDE.md) for comprehensive API testing instructions.

Quick test:
```bash
# Health check
curl http://localhost:3001/

# Register
curl -X POST http://localhost:3001/internal/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"Test1234","repeatPassword":"Test1234"}'
```

## Troubleshooting

### Common Issues

**Port already in use:**
- Change port in `docker-compose.yml` or stop conflicting service
- See [README.Docker.md](./README.Docker.md) for details

**Database connection errors:**
- Verify PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- See [README.Docker.md](./README.Docker.md) troubleshooting section

**Prisma errors:**
- Ensure `prisma.config.ts` exists
- Run `npx prisma generate`
- See [apps/auth_microservice/README.md](./apps/auth_microservice/README.md)

**Docker issues:**
- See [README.Docker.md](./README.Docker.md) troubleshooting section

## Contributing

1. Follow the existing code structure
2. Add proper TypeScript types
3. Include input validation
4. Add error handling
5. Update relevant documentation
6. Format code: `npm run format`

## License

MIT
