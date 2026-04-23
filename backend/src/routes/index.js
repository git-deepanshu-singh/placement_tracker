import { Router } from 'express';

import analyticsRoutes from './analyticsRoutes.js';
import authRoutes from './authRoutes.js';
import driveRoutes from './driveRoutes.js';
import formRoutes from './formRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import userRoutes from './userRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/drives', driveRoutes);
router.use('/notifications', notificationRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/forms', formRoutes);

export default router;
