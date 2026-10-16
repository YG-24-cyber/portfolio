import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import authRoutes from './authRoutes.js';
import projectRoutes from './projectRoutes.js';
import blogRoutes from './blogRoutes.js';
import cvRoutes from './cvRoutes.js';
import contactRoutes from './contactRoutes.js';

const apiRouter = Router();

// Mount sub-routes
apiRouter.use('/health', healthRoutes);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/projects', projectRoutes);
apiRouter.use('/blogs', blogRoutes);
apiRouter.use('/cv', cvRoutes);
apiRouter.use('/contact', contactRoutes);

export default apiRouter;
