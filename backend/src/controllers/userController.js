import { StatusCodes } from 'http-status-codes';

import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../middleware/errorHandler.js';

export const getUsers = asyncHandler(async (req, res) => {
  const { role, status } = req.query;
  const query = {};

  if (role) query.role = role;
  if (status) query.status = status;

  const users = await User.find(query).sort({ createdAt: -1 });

  res.status(StatusCodes.OK).json({
    success: true,
    data: users,
  });
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError('User not found', StatusCodes.NOT_FOUND);
  }

  if (user._id.toString() === req.user._id.toString() && req.body.status === 'inactive') {
    throw new AppError('You cannot mark your own account as inactive', StatusCodes.BAD_REQUEST);
  }

  user.status = req.body.status;
  await user.save();

  res.status(StatusCodes.OK).json({
    success: true,
    message: `User marked as ${user.status} successfully`,
    data: user,
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError('User not found', StatusCodes.NOT_FOUND);
  }

  if (user._id.toString() === req.user._id.toString()) {
    throw new AppError('You cannot delete your own account', StatusCodes.BAD_REQUEST);
  }

  await user.deleteOne();

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'User deleted successfully',
    data: user,
  });
});
