import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.cookies?.token;
    
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    req.user = decoded;
    
    next();
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

//   try {
//     let token = req.cookies?.token;
    
//     if (!token && req.headers.authorization) {
//       const authHeader = req.headers.authorization;
//       if (authHeader.startsWith('Bearer ')) {
//         token = authHeader.substring(7);
//       }
//     }

//     if (token) {
//       const decoded = verifyToken(token);
//       req.user = decoded;
//     }
    
//     next();
//   } catch (error) {
//     // For optional auth, we just continue without user
//     next();
//   }
// };