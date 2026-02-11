#!/bin/sh
set -e

# Wyciszenie ostrzeżeń Node
export NODE_OPTIONS="--no-warnings"

# 1. Funkcja oczekiwania na port (pomocnicza)
wait_for_tcp() {
  HOST="$1"
  PORT="$2"
  TIMEOUT=${3:-60}
  echo "Waiting for $HOST:$PORT (timeout ${TIMEOUT}s)..." >&2
  SECONDS=0
  while true; do
    node -e "const net=require('net'); const s=new net.Socket(); s.setTimeout(1000); s.on('connect',()=>{process.exit(0)}); s.on('error',()=>{process.exit(1)}); s.on('timeout',()=>{process.exit(1)}); s.connect($PORT,'$HOST');" >/dev/null 2>&1 && break
    if [ "$SECONDS" -ge "$TIMEOUT" ]; then
      echo "Timed out waiting for $HOST:$PORT" >&2
      return 1
    fi
    sleep 1
  done
  echo "$HOST:$PORT is available" >&2
}

# 2. Czekamy na Postgres i Redis ZANIM cokolwiek zrobimy z Prismą
POSTGRES_HOST="${DB_HOST:-postgres}"
POSTGRES_PORT="${DB_PORT:-5432}"
if ! wait_for_tcp "$POSTGRES_HOST" "$POSTGRES_PORT" 60; then
  echo "Postgres did not become available, aborting." >&2
  exit 1
fi

REDIS_HOST_ENV="${REDIS_HOST:-redis}"
REDIS_PORT_ENV="${REDIS_PORT:-6379}"
if ! wait_for_tcp "$REDIS_HOST_ENV" "$REDIS_PORT_ENV" 30; then
  echo "Redis did not become available, aborting." >&2
  exit 1
fi

# 3. Generowanie klientów Prisma (lokalnie w kontenerze)
echo "Generating Prisma Clients..." >&2
npx prisma generate --schema=./apps/auth_microservice/db/schema.prisma
npx prisma generate --schema=./apps/posts_microservice/src/prisma/schema.prisma

# 4. Synchronizacja bazy danych (używamy dedykowanych zmiennych ze schematami)
echo "Updating database schemas..." >&2

# Synchronizacja Auth - jawnie przekaż schema i ustaw DATABASE_URL
echo "Pushing Auth schema to schema 'auth'..." >&2
DATABASE_URL=${AUTH_DATABASE_URL} npx prisma db push --schema=./apps/auth_microservice/db/schema.prisma --accept-data-loss

# Synchronizacja Posts - jawnie przekaż schema i ustaw DATABASE_URL dla posts
echo "Pushing Posts schema to schema 'posts'..." >&2
DATABASE_URL=${POSTS_DATABASE_URL} npx prisma db push --schema=./apps/posts_microservice/src/prisma/schema.prisma --accept-data-loss

# 5. Odpalenie aplikacji
echo "Starting application..." >&2
exec npm start