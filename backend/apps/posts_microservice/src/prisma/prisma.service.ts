import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from './generated';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || process.env.DB_URL || '';

if (!connectionString) {
  throw new Error('DATABASE_URL or DB_URL environment variable is not set');
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({ datasources: { db: { url: connectionString } } });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: any) {
    process.on('beforeExit', async () => {
      await this.$disconnect();
      await app.close();
    });
  }
}
