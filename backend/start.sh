#!/bin/sh
set -e

# Ensure unbuffered output
export NODE_OPTIONS="--no-warnings"

echo "Generating Prisma Client..." >&2
npx prisma generate --schema=./apps/auth_microservice/db/schema.prisma

echo "Running database migrations..." >&2
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL environment variable is not set" >&2
  exit 1
fi

MIGRATIONS_DIR="./apps/auth_microservice/db/migrations"
if [ -d "$MIGRATIONS_DIR" ] && [ "$(ls -A "$MIGRATIONS_DIR" 2>/dev/null)" ]; then
  echo "Applying Prisma migrations..." >&2
  npx prisma migrate deploy --schema=./apps/auth_microservice/db/schema.prisma
else
  echo "No migrations found; pushing schema to database..." >&2
  npx prisma db push --schema=./apps/auth_microservice/db/schema.prisma --accept-data-loss
fi

echo "Starting application..." >&2
exec npm start
