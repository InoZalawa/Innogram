#!/bin/sh
set -e

echo "Generating Prisma Client..."
npx prisma generate --schema=./apps/auth_microservice/db/schema.prisma

echo "Running database migrations..."
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL environment variable is not set"
  exit 1
fi
npx prisma migrate deploy --schema=./apps/auth_microservice/db/schema.prisma 2>/dev/null || npx prisma db push --schema=./apps/auth_microservice/db/schema.prisma --accept-data-loss

echo "Starting application..."
exec npm start
