import { Router } from 'express';
import {
  getActiveCV,
  getAllReleases,
  recordDownload,
  getTelemetry,
  createRelease,
  setActiveRelease,
  deleteRelease,
} from '../controllers/cvController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// Public routes
router.get('/active', getActiveCV);
router.get('/releases', getAllReleases);
router.post('/download', recordDownload);

// Protected admin routes
router.get('/telemetry', protect, getTelemetry);
router.post('/releases', protect, createRelease);
router.patch('/releases/:id/activate', protect, setActiveRelease);
router.delete('/releases/:id', protect, deleteRelease);

export default router;
