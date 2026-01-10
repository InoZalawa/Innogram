import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient } from './generated';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || process.env.DB_URL || '';

if (!connectionString) {
  throw new Error('DATABASE_URL or DB_URL environment variable is not set');
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
    await this.seedTestUser();
  }
  private async seedTestUser() {
    const testUserId = 'user456';

    await this.user.upsert({
      where: { id: testUserId },
      update: {}, // Jeśli użytkownik istnieje, nie zmieniaj nic
      create: {
        id: testUserId,
        username: 'testuser',
        email: 'test@test.test',
        password: 'testTEST123!@#', 
      },
    });
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await this.$disconnect();
      await app.close();
    });
  }
}

