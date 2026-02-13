import { Router } from 'express';
import { getLogs, getStatistics } from '../controllers/adminController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/logs', authMiddleware, getLogs);
router.get('/statistics', authMiddleware, getStatistics);

export default router;
