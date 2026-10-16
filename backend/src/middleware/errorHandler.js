import { env } from '../config/env.js';
import { apiResponse } from '../utils/apiResponse.js';

/**
 * Global Centralized Error Handling Middleware
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  const message = err.message || 'Internal Server Error';

  if (env.isDevelopment) {
    console.error(' [Error]', err);
  }

  const errors = env.isDevelopment
    ? {
        stack: err.stack,
        details: err.details || null,
      }
    : null;

  return apiResponse.error(res, message, statusCode, errors);
};
