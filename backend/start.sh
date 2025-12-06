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
npx prisma migrate deploy --schema=./apps/auth_microservice/db/schema.prisma 2>/dev/null || npx prisma db push --schema=./apps/auth_microservice/db/schema.prisma --accept-data-loss

echo "Starting application..." >&2
exec npm start
