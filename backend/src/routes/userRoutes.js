import { Router } from 'express';
import Joi from 'joi';

import { deleteUser, getUsers, updateUserStatus } from '../controllers/userController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.use(protect, authorize('admin', 'faculty'));
router.get('/', getUsers);
router.patch(
  '/:id/status',
  authorize('admin'),
  validate(
    Joi.object({
      status: Joi.string().valid('active', 'inactive').required(),
    }),
  ),
  updateUserStatus,
);
router.delete('/:id', authorize('admin'), deleteUser);

export default router;
