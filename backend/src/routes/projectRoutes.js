import { Router } from 'express';
import {
  getProjects,
  getProjectBySlugOrId,
  createProject,
  updateProject,
  toggleFeatured,
  reorderProjects,
  deleteProject,
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// Public routes
router.get('/', getProjects);
// Must place /reorder before parameterized /:slugOrId and /:id routes
router.put('/reorder', protect, reorderProjects);
router.get('/:slugOrId', getProjectBySlugOrId);

// Protected admin routes
router.post('/', protect, createProject);
router.put('/:id', protect, updateProject);
router.patch('/:id/featured', protect, toggleFeatured);
router.delete('/:id', protect, deleteProject);

export default router;
