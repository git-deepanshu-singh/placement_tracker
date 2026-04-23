import { StatusCodes } from 'http-status-codes';

import Notification from '../models/Notification.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createAndDispatchNotification } from '../utils/notificationService.js';

export const createNotification = asyncHandler(async (req, res) => {
  const notification = await createAndDispatchNotification({
    ...req.body,
    createdBy: req.user._id,
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    data: notification,
  });
});

export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({
    $or: [
      { audience: 'all' },
      { audience: req.user.role },
      { audience: 'custom', recipientIds: req.user._id },
    ],
  }).sort({ createdAt: -1 });

  res.status(StatusCodes.OK).json({
    success: true,
    data: notifications,
  });
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification.readBy.some((entry) => entry.toString() === req.user._id.toString())) {
    notification.readBy.push(req.user._id);
    await notification.save();
  }

  res.status(StatusCodes.OK).json({
    success: true,
    data: notification,
  });
});
