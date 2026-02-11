import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  // Ścieżka musi być relatywna do miejsca, z którego uruchamiasz komendę (root projektu)
  schema: './apps/posts_microservice/src/prisma/schema.prisma',
  datasource: {
    // Używamy zmiennej DATABASE_URL, którą start.sh ustawia dynamicznie
    url: env('DATABASE_URL'),
  },
});
