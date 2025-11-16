import type { Request, Response, NextFunction } from 'express';
import Log from '../models/Log.js';

export const errorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log error to MongoDB
  await Log.create({
    level: 'error',
    message: message,
    stack: err.stack,
    userId: req.user?.userId
  });

  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};