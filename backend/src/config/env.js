import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

export const env = {
  PORT: parseInt(process.env.PORT, 10) || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
    : [
        process.env.CLIENT_URL || 'http://localhost:5173',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'https://tamrat.dev',
        'https://www.tamrat.dev',
        'https://api.tamrat.dev',
      ],
  JWT_SECRET: process.env.JWT_SECRET || 'tamrat_portfolio_jwt_secret_fallback_key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '8h',
  isDevelopment: (process.env.NODE_ENV || 'development') === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

export default env;
