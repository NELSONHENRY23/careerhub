import express from 'express';
import {register, login, getMe, updateProfile, changePassword } from '../controllers/authControllers.js';
import { authMiddleware } from '../middleware/authmiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/me', authMiddleware, getMe);
router.put('/profile', authMiddleware, updateProfile);
router.put('/change-password', authMiddleware, changePassword);

export default router;