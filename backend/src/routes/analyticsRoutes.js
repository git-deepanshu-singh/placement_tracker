import { Router } from 'express';

import {
  getHistoricalAnalytics,
  getOverviewAnalytics,
  getStudentAnalytics,
} from '../controllers/analyticsController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);
router.get('/overview', authorize('admin', 'faculty'), getOverviewAnalytics);
router.get('/student', authorize('student'), getStudentAnalytics);
router.get('/historical', authorize('admin', 'faculty'), getHistoricalAnalytics);

export default router;
