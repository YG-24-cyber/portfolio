import { Router } from 'express';
import {
  getBlogs,
  getBlogBySlugOrId,
  createBlog,
  updateBlog,
  toggleFeatured,
  deleteBlog,
} from '../controllers/blogController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// Public routes
router.get('/', getBlogs);
router.get('/:slugOrId', getBlogBySlugOrId);

// Protected admin routes
router.post('/', protect, createBlog);
router.put('/:id', protect, updateBlog);
router.patch('/:id/featured', protect, toggleFeatured);
router.delete('/:id', protect, deleteBlog);

export default router;
