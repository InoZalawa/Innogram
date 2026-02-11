import { PrismaClient } from './generated';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString =
  process.env.AUTH_DATABASE_URL ||
  process.env.DATABASE_URL ||
  process.env.DB_URL ||
  '';

if (!connectionString) {
  throw new Error(
    'AUTH_DATABASE_URL, DATABASE_URL or DB_URL environment variable is not set'
  );
}

const pool = new Pool({ connectionString });

// Extract schema from connectionString and set search_path on each connection
const schemaMatch = (connectionString || '').match(/[?&]schema=([^&]+)/);
const targetSchema = schemaMatch?.[1]
  ? decodeURIComponent(schemaMatch[1])
  : 'public';

// Ensure search_path is set when connection is created
(pool as any).on('connect', (client: any) => {
  try {
    client.query(`SET search_path TO ${targetSchema}, public`);
  } catch (e) {
    console.warn(`Failed to set search_path to ${targetSchema}:`, e);
  }
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;
