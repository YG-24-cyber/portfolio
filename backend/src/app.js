import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import apiRouter from './routes/index.js';
import { notFoundHandler } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiResponse } from './utils/apiResponse.js';

const app = express();

// Trust reverse proxies (Nginx, Cloudflare, Render, Railway, AWS ALB)
app.set('trust proxy', 1);

// Security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Dynamic Cross-Origin Resource Sharing (CORS)
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_ORIGIN,
  process.env.CLIENT_URL,
  ...(Array.isArray(env.ALLOWED_ORIGINS) ? env.ALLOWED_ORIGINS : []),
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.startsWith('http://localhost:') ||
        origin.startsWith('http://127.0.0.1:')
      ) {
        return callback(null, true);
      }
      return callback(new Error('Blocked by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  })
);

// HTTP request logger
if (env.isProduction) {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Body parsing with bounded payload limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Root welcome & API descriptor route
app.get('/', (req, res) => {
  return apiResponse.success(
    res,
    {
      name: 'Tamrat G/her Portfolio API Gateway',
      version: '1.0.0',
      documentation: '/api/health',
      environment: env.NODE_ENV,
    },
    'Tamrat G/her Portfolio REST API Gateway is running.'
  );
});

// Central API Router
app.use('/api', apiRouter);

// Standardized 404 Handler for Unmatched Endpoints
app.use(notFoundHandler);

// Centralized Global Error Handler
app.use(errorHandler);

// Export application instance
export default app;
