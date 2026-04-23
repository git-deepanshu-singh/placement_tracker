import { Router } from 'express';
import Joi from 'joi';

import {
  applyToDrive,
  createDrive,
  deleteDrive,
  exportDriveApplications,
  getDriveApplications,
  getDriveById,
  getDrives,
  toggleRegistration,
  updateDrive,
  updateApplicationStatus,
} from '../controllers/driveController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { applyDriveSchema, createDriveSchema } from '../validators/driveValidators.js';

const router = Router();

router.use(protect);
router.get('/', getDrives);
router.get('/:id', getDriveById);
router.post('/', authorize('admin', 'faculty'), validate(createDriveSchema), createDrive);
router.patch('/:id', authorize('admin', 'faculty'), validate(createDriveSchema), updateDrive);
router.delete('/:id', authorize('admin', 'faculty'), deleteDrive);
router.post('/:id/apply', authorize('student'), validate(applyDriveSchema), applyToDrive);
router.get('/:id/applications', authorize('admin', 'faculty'), getDriveApplications);
router.get('/:id/applications/export', authorize('admin', 'faculty'), exportDriveApplications);
router.patch(
  '/:id/toggle-registration',
  authorize('admin', 'faculty'),
  validate(
    Joi.object({
      registrationEnabled: Joi.boolean().required(),
    }),
  ),
  toggleRegistration,
);
router.patch(
  '/applications/:applicationId/status',
  authorize('admin', 'faculty'),
  validate(
    Joi.object({
      status: Joi.string().valid('applied', 'shortlisted', 'selected', 'rejected').required(),
    }),
  ),
  updateApplicationStatus,
);

export default router;
