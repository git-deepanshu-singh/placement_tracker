import { Router } from 'express';

import { getFormResponses } from '../controllers/formController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect, authorize('admin', 'faculty'));
router.get('/drive/:driveId', getFormResponses);

export default router;
