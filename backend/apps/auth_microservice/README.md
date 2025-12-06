# Auth Microservice

A secure authentication microservice built with Express, TypeScript, Prisma, and PostgreSQL.

## Features

- ✅ User registration with validation
- ✅ User login with JWT tokens
- ✅ Access token and refresh token support
- ✅ Token refresh endpoint
- ✅ Logout with token blacklisting
- ✅ Protected routes with authentication middleware
- ✅ Rate limiting for auth endpoints
- ✅ Input validation (email, password strength, username)
- ✅ CORS configuration
- ✅ Comprehensive error handling
- ✅ Structured logging with Winston
- ✅ Automatic cleanup of expired tokens
- ✅ Redis integration for token blacklisting

## API Endpoints

### Public Endpoints

- `POST /internal/auth/register` - Register a new user
  - Body: `{ username, email, password, repeatPassword }`
  - Rate limited: 5 requests per 15 minutes

- `POST /internal/auth/login` - Login user
  - Body: `{ login, password }`
  - Returns: `{ accessToken, refreshToken }`
  - Rate limited: 5 requests per 15 minutes

- `POST /internal/auth/refresh` - Refresh access token
  - Body: `{ refreshToken }`
  - Returns: `{ accessToken }`

### Protected Endpoints (Require Authentication)

- `POST /internal/auth/logout` - Logout user
  - Headers: `Authorization: Bearer <accessToken>`
  - Body: `{ refreshToken }`

- `GET /internal/auth/me` - Get current user info
  - Headers: `Authorization: Bearer <accessToken>`
  - Returns: `{ userId, email }`

## Project Structure

```
auth_microservice/
├── app.ts                 # Main application entry point
├── config/               # Configuration management
│   └── index.ts
├── controllers/          # Route handlers
│   └── AuthController.ts
├── db/                   # Database configuration
│   ├── prismaClient.ts
│   └── schema.prisma
├── DTO/                  # Data Transfer Objects
│   ├── LogInDTO.ts
│   ├── RedisRepository.ts
│   └── SignUpDTO.ts
├── middleware/           # Express middleware
│   ├── auth.ts          # Authentication middleware
│   ├── errorHandler.ts  # Error handling
│   └── rateLimiter.ts   # Rate limiting
├── services/            # Business logic
│   └── AuthService.ts
└── utils/              # Utility functions
    ├── logger.ts       # Winston logger
    ├── redisClient.ts  # Redis connection
    └── validation.ts   # Input validation
```

## Environment Variables

See `.env.example` for all required environment variables.

## Security Features

1. **Password Hashing**: Uses bcrypt with 12 salt rounds
2. **JWT Tokens**: Secure token-based authentication
3. **Rate Limiting**: Prevents brute force attacks
4. **Input Validation**: Validates all user inputs
5. **Token Blacklisting**: Revokes tokens on logout
6. **CORS**: Configurable cross-origin resource sharing
7. **Error Handling**: Prevents information leakage

## Running the Service

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate --schema=./apps/auth_microservice/db/schema.prisma

# Run migrations
npx prisma migrate dev --schema=./apps/auth_microservice/db/schema.prisma

# Start the server
npm start
```

## Docker

```bash
# Start all services
npm run docker:up

# View logs
npm run docker:logs:backend
```
