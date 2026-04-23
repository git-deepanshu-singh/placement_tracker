import { Router } from 'express';

import {
  createNotification,
  getNotifications,
  markNotificationRead,
} from '../controllers/notificationController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { notificationSchema } from '../validators/driveValidators.js';

const router = Router();

router.use(protect);
router.get('/', getNotifications);
router.post('/', authorize('admin', 'faculty'), validate(notificationSchema), createNotification);
router.patch('/:id/read', markNotificationRead);

export default router;
