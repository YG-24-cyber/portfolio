import { apiResponse } from '../utils/apiResponse.js';

/**
 * Middleware to catch 404 Not Found routes
 */
export const notFoundHandler = (req, res, next) => {
  return apiResponse.error(
    res,
    `Route not found: ${req.method} ${req.originalUrl}`,
    404
  );
};
