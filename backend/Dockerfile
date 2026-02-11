# 1. Base image
FROM node:20-alpine AS base
# Prisma na Alpine potrzebuje openssl i libc6-compat
RUN apk add --no-cache openssl libc6-compat

# 2. Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# Kopiujemy schemat już teraz, żeby Prisma mogła wygenerować klienta
COPY apps/auth_microservice/db/schema.prisma ./apps/auth_microservice/db/schema.prisma
RUN npm ci

# GENERUJEMY KLIENTA TUTAJ (to stworzy pliki .wasm dla Linuxa)
RUN npx prisma generate --schema=apps/auth_microservice/db/schema.prisma

# 3. Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=development

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Kopiujemy node_modules z wygenerowanym już klientem Prismy
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs . .

# Naprawa start.sh (Windows CRLF -> Linux LF)
RUN sed -i 's/\r$//' /app/start.sh && chmod +x /app/start.sh

USER nodejs
EXPOSE 3001 3002 3003

CMD ["/bin/sh", "/app/start.sh"]