# Following/Followers Microservice

This microservice should be implemented using **NestJS**.

## Folder Structure

The following folder structure is provided. Implement all functionality using NestJS patterns:

```
following_microservice/
├── src/
│   ├── following/          # Following module
│   │   ├── following.controller.ts
│   │   ├── following.service.ts
│   │   ├── following.module.ts
│   │   ├── dto/            # Data Transfer Objects
│   │   └── entities/       # Prisma models/types
│   ├── followers/          # Followers module (optional, can be part of following)
│   ├── prisma/             # Prisma service and schema
│   │   ├── prisma.service.ts
│   │   └── schema.prisma
│   ├── common/             # Shared modules
│   │   ├── guards/         # Auth guards
│   │   ├── interceptors/   # Logging, error handling
│   │   ├── filters/        # Exception filters
│   │   └── decorators/     # Custom decorators
│   ├── config/             # Configuration
│   └── main.ts            # Application entry point
└── README.md
```

## Requirements

- Use **NestJS** framework
- Use **Prisma** for database access (same database as auth_microservice)
- Implement authentication using JWT (reuse auth_microservice tokens)
- Follow NestJS best practices (modules, services, controllers, DTOs)
- Add proper error handling and validation
- Add logging
- Add rate limiting
- Use the same port pattern: **3003** (or configure via env)

## API Endpoints to Implement

- `POST /internal/following/:userId` - Follow a user (authenticated)
- `DELETE /internal/following/:userId` - Unfollow a user (authenticated)
- `GET /internal/following/:userId` - Check if following a user
- `GET /internal/following` - Get users that current user is following (authenticated)
- `GET /internal/followers` - Get users following current user (authenticated)
- `GET /internal/following/:userId/followers` - Get followers of a user
- `GET /internal/following/:userId/following` - Get users that a user is following
- `GET /internal/following/:userId/count` - Get follow/follower counts for a user

## Database Schema

You'll need to create Prisma models for:
- `Follow` - Follow relationships table (followerId, followingId)

Reference the `User` model from `auth_microservice/db/schema.prisma` for relations.

## Notes

- This microservice should authenticate requests using JWT tokens from auth_microservice
- Use the same Redis instance for caching if needed
- Follow the same logging and error handling patterns as auth_microservice
- Port: **3003** (default)
- Prevent users from following themselves
- Consider adding blocking functionality in the future
