import { Router } from 'express';
import { login, getMe, updateCredentials } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// Public routes
router.post('/login', login);

// Protected routes (Requires Bearer JWT token)
router.get('/me', protect, getMe);
router.put('/update-credentials', protect, updateCredentials);

export default router;
