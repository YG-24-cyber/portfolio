import jwt from 'jsonwebtoken';
import env from '../config/env.js';

/**
 * Signs a payload and returns a signed JWT token string.
 * @param {object} payload - The data to encode in the token (e.g. { id, username, role })
 * @param {string|number} [expiresIn] - Optional custom expiration override
 * @returns {string} Signed JWT
 */
export const signToken = (payload, expiresIn = env.JWT_EXPIRES_IN) => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn,
  });
};

/**
 * Verifies a JWT token string against the application secret.
 * @param {string} token - The raw JWT token string
 * @returns {object} Decoded token payload
 * @throws {jwt.JsonWebTokenError|jwt.TokenExpiredError}
 */
export const verifyToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};

export default {
  signToken,
  verifyToken,
};
