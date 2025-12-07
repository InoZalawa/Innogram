# Database Migrations (Prisma)

## Why
- Keep schema changes explicit, reviewable, and reproducible.
- `prisma migrate deploy` applies checked-in migrations in any environment.
- Fallback `prisma db push` is for local/bootstrap only and should not be relied on long term.

## Current Startup Behavior
- `start.sh` runs:
  - `prisma migrate deploy` when migrations exist.
  - `prisma db push` only if **no** migrations are present (bootstrap safety).
- With the new `init` migration, deploys should use migrations.

## Typical Workflow
1) Edit `apps/auth_microservice/db/schema.prisma`.
2) Create a migration (updates DB in dev and writes SQL):
   - `npx prisma migrate dev --name <change> --schema=./apps/auth_microservice/db/schema.prisma`
3) Commit the generated folder under `apps/auth_microservice/db/migrations/`.
4) Other environments apply with:
   - `npx prisma migrate deploy --schema=./apps/auth_microservice/db/schema.prisma`

## Resetting Local DB (destructive)
- `npx prisma migrate reset --force --schema=./apps/auth_microservice/db/schema.prisma`
- Use when schema drift occurs or you need a clean dev DB.

## When Containers/Volumes Are New
- `start.sh` will run `migrate deploy` (uses committed migrations).
- If migrations are missing, it will fall back to `db push` to create tables so the service still boots, but add a proper migration ASAP.
