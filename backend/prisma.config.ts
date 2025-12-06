import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: './apps/auth_microservice/db/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
});

