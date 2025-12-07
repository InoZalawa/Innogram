# Posts Microservice

This microservice should be implemented using **NestJS**.

## Folder Structure

The following folder structure is provided. Implement all functionality using NestJS patterns:

```
posts_microservice/
├── src/
│   ├── posts/              # Posts module
│   │   ├── posts.controller.ts
│   │   ├── posts.service.ts
│   │   ├── posts.module.ts
│   │   ├── dto/            # Data Transfer Objects
│   │   └── entities/       # Prisma models/types
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
- Use the same port pattern: **3002** (or configure via env)

## API Endpoints to Implement

- `GET /internal/posts` - Get all posts (with pagination)
- `GET /internal/posts/:id` - Get post by ID
- `POST /internal/posts` - Create new post (authenticated)
- `PUT /internal/posts/:id` - Update post (authenticated, owner only)
- `DELETE /internal/posts/:id` - Delete post (authenticated, owner only)
- `GET /internal/posts/user/:userId` - Get posts by user

## Database Schema

You'll need to create Prisma models for:
- `Post` - Posts table

Reference the `User` model from `auth_microservice/db/schema.prisma` for relations.

## Notes

- This microservice should authenticate requests using JWT tokens from auth_microservice
- Use the same Redis instance for caching if needed
- Follow the same logging and error handling patterns as auth_microservice
- Port: **3002** (default)
