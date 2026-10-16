import { Router } from 'express';
import {
  submitMessage,
  getMessages,
  getMessageById,
  updateMessageStatus,
  deleteMessage,
  getMessageStats,
} from '../controllers/contactController.js';
import { protect } from '../middleware/authMiddleware.js';
import { contactRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Public route with strict rate limiting (5 submissions / 15m)
router.post('/', contactRateLimiter, submitMessage);

// Protected admin routes
router.get('/stats', protect, getMessageStats);
router.get('/messages', protect, getMessages);
router.get('/messages/:id', protect, getMessageById);
router.patch('/messages/:id/status', protect, updateMessageStatus);
router.delete('/messages/:id', protect, deleteMessage);

export default router;
