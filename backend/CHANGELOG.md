# Changelog - Auth Microservice Improvements

This document summarizes all the improvements and fixes made to the auth microservice.

## Major Changes

### 1. Prisma 7 Compatibility

**Issue:** Project was using Prisma 7 which has breaking changes from Prisma 6.

**Changes:**
- Created `prisma.config.ts` at backend root for database connection configuration
- Removed `url` property from `schema.prisma` (Prisma 7 requirement)
- Updated `prismaClient.ts` to use `@prisma/adapter-pg` adapter pattern
- Added `DATABASE_URL` environment variable support

**Files Modified:**
- `prisma.config.ts` (new file)
- `apps/auth_microservice/db/schema.prisma`
- `apps/auth_microservice/db/prismaClient.ts`
- `package.json` (added `@prisma/adapter-pg`)

### 2. Security Enhancements

**Added:**
- CORS configuration with configurable origins
- Rate limiting for auth endpoints (5 requests per 15 minutes)
- General rate limiting (100 requests per 15 minutes)
- Input validation using `express-validator`
- Token blacklisting via Redis on logout
- Comprehensive error handling to prevent information leakage

**Files Modified:**
- `apps/auth_microservice/app.ts`
- `apps/auth_microservice/middleware/rateLimiter.ts` (new)
- `apps/auth_microservice/middleware/errorHandler.ts` (new)
- `apps/auth_microservice/utils/validation.ts` (new)
- `apps/auth_microservice/services/AuthService.ts`
- `apps/auth_microservice/middleware/auth.ts`

### 3. Logging System

**Added:**
- Winston logger with structured logging
- Console output for Docker/terminal visibility
- Request/response logging with timing
- Color-coded log levels
- Configurable log levels via environment variable

**Files Modified:**
- `apps/auth_microservice/utils/logger.ts` (new)
- `apps/auth_microservice/app.ts`
- `apps/auth_microservice/services/AuthService.ts`
- `apps/auth_microservice/middleware/auth.ts`

### 4. Token Management

**Added:**
- Refresh token functionality
- Token refresh endpoint (`POST /internal/auth/refresh`)
- Automatic cleanup of expired refresh tokens (hourly)
- Token blacklisting in Redis
- Configurable token expiry times via environment variables

**Files Modified:**
- `apps/auth_microservice/services/AuthService.ts`
- `apps/auth_microservice/controllers/AuthController.ts`
- `apps/auth_microservice/DTO/RedisRepository.ts`
- `apps/auth_microservice/middleware/auth.ts`

### 5. Docker Support

**Added:**
- Multi-stage Dockerfile for optimized builds
- Docker Compose configuration for full stack
- Startup script (`start.sh`) for container initialization
- Health checks for PostgreSQL and Redis
- Proper volume management for data persistence
- Non-root user execution for security

**Files Created:**
- `Dockerfile`
- `docker-compose.yml`
- `start.sh`
- `.dockerignore`
- `README.Docker.md`

**Files Modified:**
- `package.json` (added Docker scripts)

### 6. API Endpoints

**Added:**
- `POST /internal/auth/refresh` - Refresh access token
- `POST /internal/auth/logout` - Logout with token blacklisting
- `GET /internal/auth/me` - Get current user info

**Improved:**
- `POST /internal/auth/register` - Added validation and rate limiting
- `POST /internal/auth/login` - Added rate limiting and proper error handling

**Files Modified:**
- `apps/auth_microservice/controllers/AuthController.ts`

### 7. Database Schema

**Added:**
- `createdAt` and `updatedAt` timestamps on User model
- `createdAt` and `expiresAt` timestamps on RefreshToken model
- Cascade delete for refresh tokens

**Files Modified:**
- `apps/auth_microservice/db/schema.prisma`

### 8. TypeScript Fixes

**Fixed:**
- Missing return statements in middleware functions
- Missing type definitions (`@types/cors`)
- Proper return types for Express middleware

**Files Modified:**
- `apps/auth_microservice/middleware/errorHandler.ts`
- `apps/auth_microservice/middleware/auth.ts`
- `package.json` (added `@types/cors`)

### 9. Configuration Management

**Added:**
- Centralized configuration in `config/index.ts`
- Environment variable validation
- Default values for optional variables

**Files Created:**
- `apps/auth_microservice/config/index.ts`

### 10. Documentation

**Created/Updated:**
- `README.md` - Main project documentation
- `apps/auth_microservice/README.md` - Complete auth service guide
- `README.Docker.md` - Comprehensive Docker guide
- `POSTMAN_TESTING_GUIDE.md` - API testing instructions
- `CHANGELOG.md` - This file
- `.env.example` - Environment variable template

## Bug Fixes

1. **User Registration Logic**
   - Fixed: Incorrect check for existing users
   - Changed from `if (!isUserUnique)` to `if (existingUser)`

2. **Prisma Client Generation**
   - Fixed: Prisma client not generated before use
   - Added generation step in Docker startup script

3. **Database Connection**
   - Fixed: Prisma 7 adapter pattern implementation
   - Properly configured `@prisma/adapter-pg` with pg Pool

4. **Redis Client Type**
   - Fixed: Type compatibility issues with Redis client
   - Updated to use `ReturnType<typeof createClient>`

5. **Docker Line Endings**
   - Fixed: `start.sh` not executable in Docker (CRLF vs LF)
   - Added line ending conversion in Dockerfile

6. **Port Conflicts**
   - Fixed: Port 3001 already in use errors
   - Added instructions for killing processes

## New Dependencies

```json
{
  "dependencies": {
    "@prisma/adapter-pg": "^7.1.0",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express-rate-limit": "^7.4.1",
    "express-validator": "^7.2.0",
    "winston": "^3.15.0"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17"
  }
}
```

## Environment Variables Added

- `ACCESS_TOKEN_EXPIRY` - Access token expiry in seconds (default: 180)
- `REFRESH_TOKEN_EXPIRY` - Refresh token expiry in seconds (default: 600)
- `CORS_ORIGIN` - CORS allowed origin (default: *)
- `LOG_LEVEL` - Logging level (default: info)
- `DATABASE_URL` - Prisma 7 database connection string

## NPM Scripts Added

```json
{
  "docker:up": "docker-compose up --build",
  "docker:up:detached": "docker-compose up -d --build",
  "docker:down": "docker-compose down",
  "docker:logs": "docker-compose logs -f",
  "docker:logs:backend": "docker-compose logs -f backend",
  "docker:logs:postgres": "docker-compose logs -f postgres",
  "docker:logs:redis": "docker-compose logs -f redis",
  "docker:ps": "docker-compose ps",
  "docker:restart": "docker-compose restart",
  "docker:stop": "docker-compose stop",
  "docker:start": "docker-compose start",
  "docker:clean": "docker-compose down -v",
  "docker:rebuild": "docker-compose build --no-cache backend && docker-compose up -d"
}
```

## Project Structure Changes

**New Directories:**
- `apps/auth_microservice/config/`
- `apps/auth_microservice/middleware/`
- `apps/auth_microservice/utils/`

**New Files:**
- `prisma.config.ts` (backend root)
- `Dockerfile`
- `docker-compose.yml`
- `start.sh`
- `.dockerignore`
- `README.Docker.md`
- `CHANGELOG.md`

## Testing Improvements

- Comprehensive Postman testing guide
- Example requests for all endpoints
- Error scenario testing
- Rate limiting testing
- Token expiration testing

## Security Improvements Summary

1. ✅ Password hashing with bcrypt (12 rounds)
2. ✅ JWT token authentication
3. ✅ Rate limiting (auth endpoints + general)
4. ✅ Input validation
5. ✅ Token blacklisting
6. ✅ CORS configuration
7. ✅ Error handling (no information leakage)
8. ✅ Request logging
9. ✅ Non-root Docker user
10. ✅ Environment variable validation

## Performance Improvements

1. Redis for fast token blacklist checks
2. Database indexes on unique fields (username, email)
3. Efficient token cleanup (hourly batch)
4. Connection pooling via Prisma adapter
5. Multi-stage Docker builds (smaller images)

## Migration Guide

If upgrading from the old version:

1. **Update dependencies:**
   ```bash
   npm install
   ```

2. **Add new environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env and add new variables
   ```

3. **Update Prisma:**
   ```bash
   npx prisma generate --schema=./apps/auth_microservice/db/schema.prisma
   npx prisma migrate dev --schema=./apps/auth_microservice/db/schema.prisma
   ```

4. **For Docker users:**
   ```bash
   npm run docker:rebuild
   ```

## Breaking Changes

1. **Prisma 7**: Requires `prisma.config.ts` file
2. **Environment Variables**: New required variables (`ACCESS_TOKEN_EXPIRY`, `REFRESH_TOKEN_EXPIRY`)
3. **API Responses**: Some error responses may have changed format
4. **Docker**: New Docker setup required (old setup won't work)

## Next Steps (Future Improvements)

- [ ] Add unit tests
- [ ] Add integration tests
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Add email verification
- [ ] Add password reset functionality
- [ ] Add two-factor authentication
- [ ] Add user roles and permissions
- [ ] Add audit logging
- [ ] Add metrics and monitoring
- [ ] Add health check endpoints for dependencies

## Notes

- All changes maintain backward compatibility where possible
- Docker setup is optional but recommended
- All security improvements are production-ready
- Documentation is comprehensive and up-to-date
