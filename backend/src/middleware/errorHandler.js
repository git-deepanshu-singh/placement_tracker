import { StatusCodes } from 'http-status-codes';

export class AppError extends Error {
  constructor(message, statusCode = StatusCodes.BAD_REQUEST) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const notFoundHandler = (_req, _res, next) => {
  next(new AppError('Route not found', StatusCodes.NOT_FOUND));
};

export const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

  res.status(statusCode).json({
    success: false,
    message: error.message || 'Something went wrong',
    stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
  });
};
