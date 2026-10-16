import { testDatabaseConnection } from '../config/prisma.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getHealth = async (req, res, next) => {
  try {
    const dbTest = await testDatabaseConnection();

    const healthData = {
      status: dbTest.isConnected ? 'UP' : 'DEGRADED',
      environment: process.env.NODE_ENV || 'development',
      uptime: {
        seconds: Math.floor(process.uptime()),
        formatted: `${Math.floor(process.uptime() / 60)}m ${Math.floor(process.uptime() % 60)}s`,
      },
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      database: {
        status: dbTest.isConnected ? 'CONNECTED' : 'DISCONNECTED',
        provider: 'PostgreSQL',
        latencyMs: dbTest.latencyMs,
        ...(dbTest.error && { error: dbTest.error }),
      },
    };

    return sendSuccess(res, 200, 'System and database telemetry verified', healthData);
  } catch (error) {
    next(error);
  }
};

export const getSystemHealth = getHealth;
