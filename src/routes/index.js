import { Router } from 'express';
import healthRoutes from './health.js';
import authRoutes from './auth.js';

const router = Router();

// Debug log
console.log('🔧 Setting up routes...');

// /api/health
router.use('/health', healthRoutes);
console.log('✅ Health routes registered');

// /api/auth
router.use('/auth', authRoutes);
console.log('✅ Auth routes registered');

export default router;