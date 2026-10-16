import bcrypt from 'bcryptjs';
import prisma from '../config/prisma.js';
import { signToken } from '../utils/token.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

/**
 * Administrator Login
 * @route POST /api/auth/login
 * @access Public
 */
export const login = async (req, res, next) => {
  try {
    const { identifier, username, email, usernameOrEmail, password } = req.body;
    const loginIdentifier = (identifier || username || email || usernameOrEmail || '').trim();

    if (!loginIdentifier || !password) {
      return sendError(res, 400, 'Username or email and password are required.');
    }

    // Lookup administrator by username or email
    const admin = await prisma.admin.findFirst({
      where: {
        OR: [
          { username: loginIdentifier },
          { email: loginIdentifier.toLowerCase() },
        ],
      },
    });

    if (!admin) {
      return sendError(res, 401, 'Invalid credentials.');
    }

    // Verify bcrypt password hash
    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isPasswordValid) {
      return sendError(res, 401, 'Invalid credentials.');
    }

    // Issue signed JWT access token
    const token = signToken({
      id: admin.id,
      username: admin.username,
      role: admin.role,
    });

    const userProfile = {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      displayName: admin.displayName,
      role: admin.role,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    };

    return sendSuccess(res, 200, 'Authentication successful.', {
      token,
      admin: userProfile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Authenticated Administrator Profile
 * @route GET /api/auth/me
 * @access Protected
 */
export const getMe = async (req, res, next) => {
  try {
    return sendSuccess(res, 200, 'Administrator session verified.', {
      admin: req.admin,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Administrator Master Credentials & Preferences
 * @route PUT /api/auth/update-credentials
 * @access Protected
 */
export const updateCredentials = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, displayName, email } = req.body;

    if (!currentPassword) {
      return sendError(res, 400, 'Current master password is required to verify changes.');
    }

    // Retrieve full admin record to check current password
    const admin = await prisma.admin.findUnique({
      where: { id: req.admin.id },
    });

    if (!admin) {
      return sendError(res, 404, 'Administrator record not found.');
    }

    // Validate current password
    const isCurrentValid = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!isCurrentValid) {
      return sendError(res, 400, 'Current password verification failed.');
    }

    const updatePayload = {};

    // Update display name if provided
    if (displayName && displayName.trim()) {
      updatePayload.displayName = displayName.trim();
    }

    // Update email if provided & distinct
    if (email && email.trim()) {
      const normalizedEmail = email.trim().toLowerCase();
      if (normalizedEmail !== admin.email) {
        const existingEmail = await prisma.admin.findUnique({
          where: { email: normalizedEmail },
        });

        if (existingEmail && existingEmail.id !== admin.id) {
          return sendError(res, 409, 'The specified email address is already registered.');
        }

        updatePayload.email = normalizedEmail;
      }
    }

    // Update password if new password specified
    if (newPassword) {
      if (typeof newPassword !== 'string' || newPassword.length < 6) {
        return sendError(res, 400, 'New password must be at least 6 characters long.');
      }
      updatePayload.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    if (Object.keys(updatePayload).length === 0) {
      return sendError(res, 400, 'No modification fields were provided.');
    }

    const updatedAdmin = await prisma.admin.update({
      where: { id: admin.id },
      data: updatePayload,
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

    return sendSuccess(res, 200, 'Administrator credentials successfully updated.', {
      admin: updatedAdmin,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  login,
  getMe,
  updateCredentials,
};
