import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

import User from '../models/User.js';
import { AppError } from './errorHandler.js';

export const protect = async (req, _res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return next(new AppError('Authentication required', StatusCodes.UNAUTHORIZED));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || ['blocked', 'inactive'].includes(user.status)) {
      return next(new AppError('Access denied', StatusCodes.FORBIDDEN));
    }

    req.user = user;
    next();
  } catch {
    next(new AppError('Invalid token', StatusCodes.UNAUTHORIZED));
  }
};

export const authorize = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError('Insufficient permissions', StatusCodes.FORBIDDEN));
  }

  next();
};
