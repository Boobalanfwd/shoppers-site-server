import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
    register,
    login,
    getUsers,
    getUser,
    getProfile,
    updateUserById,
    updateProfile,
    changeUserPassword,
    deleteUserById,
    deleteProfile
} from './users.controller.js';

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', register);
router.post('/login', login);

// Protected routes (authentication required)
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);
router.put('/profile/password', verifyToken, changeUserPassword);
router.delete('/profile', verifyToken, deleteProfile);

// Admin routes (for managing users)
router.get('/', verifyToken, getUsers);
router.get('/:userId', verifyToken, getUser);
router.put('/:userId', verifyToken, updateUserById);
router.delete('/:userId', verifyToken, deleteUserById);

export default router;
