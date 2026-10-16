import { verifyToken } from '../utils/token.js';
import prisma from '../config/prisma.js';
import { sendError } from '../utils/apiResponse.js';

/**
 * Authentication Guard Middleware
 * Protects endpoints by verifying incoming Bearer JWT tokens and validating the administrator in PostgreSQL.
 */
export const protect = async (req, res, next) => {
  try {
    let token = null;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1]?.trim();
    }

    if (!token) {
      return sendError(res, 401, 'Unauthorized: Access token is required');
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return sendError(res, 401, 'Unauthorized: Access token has expired. Please sign in again.');
      }
      return sendError(res, 401, 'Unauthorized: Invalid access token signature.');
    }

    if (!decoded || !decoded.id) {
      return sendError(res, 401, 'Unauthorized: Malformed token payload.');
    }

    // Fetch active administrator record from database
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!admin) {
      return sendError(res, 401, 'Unauthorized: Administrator account no longer exists.');
    }

    // Attach validated admin identity to request object
    req.admin = admin;
    next();
  } catch (error) {
    next(error);
  }
};

export default protect;
