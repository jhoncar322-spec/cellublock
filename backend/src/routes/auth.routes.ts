import { Router } from 'express';
import { register, login, verifyAuth } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify', authMiddleware, verifyAuth);

export default router;
