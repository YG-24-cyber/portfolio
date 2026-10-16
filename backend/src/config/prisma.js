import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import env from './env.js';

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * Tests live connectivity to PostgreSQL and measures ping latency.
 * @returns {Promise<{ isConnected: boolean, latencyMs: number, error?: string }>}
 */
export async function testDatabaseConnection() {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return {
      isConnected: true,
      latencyMs: Date.now() - start,
    };
  } catch (error) {
    return {
      isConnected: false,
      latencyMs: Date.now() - start,
      error: error.message,
    };
  }
}

export default prisma;
