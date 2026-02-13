import { Router } from 'express';
import {
  generateQR,
  enrollDevice,
  getDevices,
  getDeviceById,
  blockDevice,
  unblockDevice,
  getDeviceStatus,
  deleteDevice
} from '../controllers/deviceController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/generate-qr', authMiddleware, generateQR);
router.post('/enroll', enrollDevice);
router.get('/', authMiddleware, getDevices);
router.get('/:deviceId', authMiddleware, getDeviceById);
router.post('/:deviceId/block', authMiddleware, blockDevice);
router.post('/:deviceId/unblock', authMiddleware, unblockDevice);
router.get('/:deviceId/status', getDeviceStatus);
router.delete('/:deviceId', authMiddleware, deleteDevice);

export default router;
