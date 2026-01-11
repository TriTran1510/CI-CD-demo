import { Router } from 'express';
import { register, login, logout, refreshAccessToken, checkToken } from '../controllers/authController.js';

const router = Router();

// POST http://localhost:3000/api/auth/register
router.post('/register', register);

// POST http://localhost:3000/api/auth/login
router.post('/login', login);

// POST http://localhost:3000/api/auth/logout
router.post('/logout', logout);

// POST http://localhost:3000/api/auth/refresh
router.post('/refresh', refreshAccessToken);

// GET http://localhost:3000/api/auth/check-token
// Header: Authorization: Bearer <token>
router.get('/check-token', checkToken);

export default router;