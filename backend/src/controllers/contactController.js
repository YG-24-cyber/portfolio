import prisma from '../config/prisma.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_STATUSES = ['UNREAD', 'REVIEWED', 'ARCHIVED'];

/**
 * Submit an inbound public contact inquiry
 * @route POST /api/contact
 * @access Public
 */
export const submitMessage = async (req, res, next) => {
  try {
    const { name, email, topic, message } = req.body;

    // Validate name
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return sendError(res, 400, 'A valid name (minimum 2 characters) is required.');
    }

    // Validate email
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return sendError(res, 400, 'A valid email address is required.');
    }

    // Validate topic
    if (!topic || typeof topic !== 'string' || topic.trim().length < 2) {
      return sendError(res, 400, 'A valid topic or subject (minimum 2 characters) is required.');
    }

    // Validate message content
    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return sendError(res, 400, 'Inquiry message must be at least 10 characters long.');
    }
    if (message.trim().length > 5000) {
      return sendError(res, 400, 'Inquiry message cannot exceed 5,000 characters.');
    }

    const newMessage = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        topic: topic.trim(),
        message: message.trim(),
        status: 'UNREAD',
      },
    });

    return sendSuccess(
      res,
      201,
      'Your message has been delivered securely. Thank you for reaching out!',
      {
        id: newMessage.id,
        createdAt: newMessage.createdAt,
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get all contact messages with search, filter, and pagination
 * @route GET /api/contact/messages
 * @access Protected (Admin)
 */
export const getMessages = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;

    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const limitNumber = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNumber - 1) * limitNumber;

    const where = {};

    // Filter by triage status (ignore ALL or empty)
    if (status && typeof status === 'string') {
      const normalizedStatus = status.trim().toUpperCase();
      if (normalizedStatus !== 'ALL' && VALID_STATUSES.includes(normalizedStatus)) {
        where.status = normalizedStatus;
      }
    }

    // Fuzzy search across sender name, email, or message body
    if (search && search.trim()) {
      const term = search.trim();
      where.OR = [
        { name: { contains: term, mode: 'insensitive' } },
        { email: { contains: term, mode: 'insensitive' } },
        { message: { contains: term, mode: 'insensitive' } },
      ];
    }

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        skip,
        take: limitNumber,
        orderBy: [{ createdAt: 'desc' }],
      }),
      prisma.contactMessage.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limitNumber) || 1;

    return sendSuccess(res, 200, 'Inbound messages retrieved successfully.', {
      messages,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single message details & automatically transition status to REVIEWED if UNREAD
 * @route GET /api/contact/messages/:id
 * @access Protected (Admin)
 */
export const getMessageById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const message = await prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!message) {
      return sendError(res, 404, 'Message not found.');
    }

    // Automatically transition UNREAD -> REVIEWED upon viewing
    let returnedMessage = message;
    if (message.status === 'UNREAD') {
      returnedMessage = await prisma.contactMessage.update({
        where: { id },
        data: { status: 'REVIEWED' },
      });
    }

    return sendSuccess(res, 200, 'Message retrieved successfully.', {
      message: returnedMessage,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update message triage status
 * @route PATCH /api/contact/messages/:id/status
 * @access Protected (Admin)
 */
export const updateMessageStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || typeof status !== 'string') {
      return sendError(res, 400, 'Target status string is required.');
    }

    const normalizedStatus = status.trim().toUpperCase();
    if (!VALID_STATUSES.includes(normalizedStatus)) {
      return sendError(
        res,
        400,
        `Invalid status '${status}'. Must be one of: ${VALID_STATUSES.join(', ')}`
      );
    }

    const existing = await prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!existing) {
      return sendError(res, 404, 'Message not found.');
    }

    const updatedMessage = await prisma.contactMessage.update({
      where: { id },
      data: { status: normalizedStatus },
    });

    return sendSuccess(res, 200, 'Message status successfully updated.', {
      message: updatedMessage,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Permanently delete a contact message record
 * @route DELETE /api/contact/messages/:id
 * @access Protected (Admin)
 */
export const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!existing) {
      return sendError(res, 404, 'Message not found.');
    }

    await prisma.contactMessage.delete({
      where: { id },
    });

    return sendSuccess(res, 200, 'Message successfully deleted.', {
      id,
      name: existing.name,
      email: existing.email,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get aggregated message telemetry metrics
 * @route GET /api/contact/stats
 * @access Protected (Admin)
 */
export const getMessageStats = async (req, res, next) => {
  try {
    const [total, unread, reviewed, archived] = await Promise.all([
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { status: 'UNREAD' } }),
      prisma.contactMessage.count({ where: { status: 'REVIEWED' } }),
      prisma.contactMessage.count({ where: { status: 'ARCHIVED' } }),
    ]);

    return sendSuccess(res, 200, 'Contact messaging telemetry retrieved.', {
      stats: {
        total,
        unread,
        reviewed,
        archived,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  submitMessage,
  getMessages,
  getMessageById,
  updateMessageStatus,
  deleteMessage,
  getMessageStats,
};
