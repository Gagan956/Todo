import express from 'express';
import {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getCurrentUser,
} from '../controllers/authController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', authenticate, logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/me', authenticate, getCurrentUser);
// router.put('/profile', authenticate, updateProfile);
// router.put('/change-password', authenticate, changePassword);

export default router;