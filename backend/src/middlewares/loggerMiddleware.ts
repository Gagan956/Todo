import type { Request, Response, NextFunction } from 'express';
import Log from '../models/Log.js';

export const requestLogger = async (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', async () => {
    const duration = Date.now() - start;
    
    if (res.statusCode >= 400) {
      await Log.create({
        level: res.statusCode >= 500 ? 'error' : 'warn',
        message: `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`,
        userId: req.user?.userId
      });
    }
  }); 
  
  next();
};