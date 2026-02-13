import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import Device from '../models/Device';
import EnrollmentToken from '../models/EnrollmentToken';
import AuditLog from '../models/AuditLog';
import { generateQRCode } from '../utils/qrGenerator';
import { generateEnrollmentToken, generateDeviceApiKey } from '../utils/tokenGenerator';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth.middleware';

export const generateQR = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.admin) {
      throw new AppError('Not authenticated', 401);
    }
    
    const { expiresIn } = req.body;
    const token = generateEnrollmentToken();
    
    const expirationHours = expiresIn === '24h' ? 24 : 1;
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expirationHours);
    
    const qrCodeData = await generateQRCode({
      enrollmentToken: token
    });
    
    await EnrollmentToken.create({
      token,
      qrCodeData,
      expiresAt,
      createdBy: req.admin.adminId
    });
    
    await AuditLog.create({
      action: 'qr_generated',
      adminId: req.admin.adminId,
      details: { token, expiresAt }
    });
    
    res.json({
      success: true,
      qrCode: qrCodeData,
      enrollmentToken: token,
      expiresAt: expiresAt.toISOString()
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to generate QR code', 500);
  }
};

export const enrollDevice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { enrollmentToken, deviceInfo } = req.body;
    
    if (!enrollmentToken || !deviceInfo) {
      throw new AppError('Enrollment token and device info are required', 400);
    }
    
    const tokenDoc = await EnrollmentToken.findOne({ token: enrollmentToken });
    
    if (!tokenDoc) {
      throw new AppError('Invalid enrollment token', 400);
    }
    
    if (tokenDoc.used) {
      throw new AppError('Enrollment token already used', 400);
    }
    
    if (new Date() > tokenDoc.expiresAt) {
      throw new AppError('Enrollment token expired', 400);
    }
    
    const deviceId = `dev_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    const apiKey = generateDeviceApiKey();
    const hashedApiKey = await bcrypt.hash(apiKey, 10);
    
    const device = await Device.create({
      deviceId,
      model: deviceInfo.model,
      brand: deviceInfo.brand,
      os: deviceInfo.os,
      osVersion: deviceInfo.osVersion,
      imei: deviceInfo.imei,
      serialNumber: deviceInfo.serialNumber,
      apiKey: hashedApiKey,
      status: 'active'
    });
    
    tokenDoc.used = true;
    tokenDoc.usedAt = new Date();
    tokenDoc.usedByDevice = device._id;
    await tokenDoc.save();
    
    await AuditLog.create({
      action: 'device_enrolled',
      deviceId: device._id,
      adminId: tokenDoc.createdBy,
      details: {
        deviceId: device.deviceId,
        model: deviceInfo.model,
        brand: deviceInfo.brand
      }
    });
    
    res.status(201).json({
      success: true,
      deviceId: device.deviceId,
      apiKey,
      message: 'Device enrolled successfully'
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Device enrollment failed', 500);
  }
};

export const getDevices = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.admin) {
      throw new AppError('Not authenticated', 401);
    }
    
    const { status, page = '1', limit = '10', search } = req.query;
    
    const filter: any = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { model: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { deviceId: { $regex: search, $options: 'i' } }
      ];
    }
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;
    
    const devices = await Device.find(filter)
      .select('-apiKey')
      .skip(skip)
      .limit(limitNum)
      .sort({ enrolledAt: -1 });
    
    const total = await Device.countDocuments(filter);
    
    res.json({
      success: true,
      devices: devices.map(device => ({
        id: device.deviceId,
        model: device.model,
        brand: device.brand,
        os: device.os,
        status: device.status,
        enrolledAt: device.enrolledAt,
        lastActivity: device.lastActivity
      })),
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to fetch devices', 500);
  }
};

export const getDeviceById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.admin) {
      throw new AppError('Not authenticated', 401);
    }
    
    const { deviceId } = req.params;
    const device = await Device.findOne({ deviceId }).select('-apiKey').populate('blockHistory.adminId', 'email name');
    
    if (!device) {
      throw new AppError('Device not found', 404);
    }
    
    res.json({
      success: true,
      device: {
        id: device.deviceId,
        model: device.model,
        brand: device.brand,
        os: device.os,
        osVersion: device.osVersion,
        status: device.status,
        enrolledAt: device.enrolledAt,
        lastActivity: device.lastActivity,
        imei: device.imei,
        serialNumber: device.serialNumber,
        blockHistory: device.blockHistory,
        blockedAt: device.blockedAt
      }
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to fetch device', 500);
  }
};

export const blockDevice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.admin) {
      throw new AppError('Not authenticated', 401);
    }
    
    const { deviceId } = req.params;
    const { reason } = req.body;
    
    const device = await Device.findOne({ deviceId });
    
    if (!device) {
      throw new AppError('Device not found', 404);
    }
    
    if (device.status === 'blocked') {
      throw new AppError('Device is already blocked', 400);
    }
    
    device.status = 'blocked';
    device.blockedAt = new Date();
    device.blockHistory.push({
      action: 'blocked',
      timestamp: new Date(),
      reason: reason || 'No reason provided',
      adminId: req.admin.adminId as any
    });
    
    await device.save();
    
    await AuditLog.create({
      action: 'device_blocked',
      deviceId: device._id,
      adminId: req.admin.adminId,
      details: { reason, deviceId: device.deviceId }
    });
    
    res.json({
      success: true,
      message: 'Device blocked successfully',
      device: {
        id: device.deviceId,
        status: device.status,
        blockedAt: device.blockedAt
      }
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to block device', 500);
  }
};

export const unblockDevice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.admin) {
      throw new AppError('Not authenticated', 401);
    }
    
    const { deviceId } = req.params;
    const { reason } = req.body;
    
    const device = await Device.findOne({ deviceId });
    
    if (!device) {
      throw new AppError('Device not found', 404);
    }
    
    if (device.status === 'active') {
      throw new AppError('Device is not blocked', 400);
    }
    
    device.status = 'active';
    device.blockedAt = undefined;
    device.blockHistory.push({
      action: 'unblocked',
      timestamp: new Date(),
      reason: reason || 'No reason provided',
      adminId: req.admin.adminId as any
    });
    
    await device.save();
    
    await AuditLog.create({
      action: 'device_unblocked',
      deviceId: device._id,
      adminId: req.admin.adminId,
      details: { reason, deviceId: device.deviceId }
    });
    
    res.json({
      success: true,
      message: 'Device unblocked successfully',
      device: {
        id: device.deviceId,
        status: device.status,
        unblockedAt: new Date()
      }
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to unblock device', 500);
  }
};

export const getDeviceStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { deviceId } = req.params;
    const apiKey = req.headers['x-device-api-key'] as string;
    
    if (!apiKey) {
      throw new AppError('API key required', 401);
    }
    
    const device = await Device.findOne({ deviceId });
    
    if (!device) {
      throw new AppError('Device not found', 404);
    }
    
    const isValidKey = await bcrypt.compare(apiKey, device.apiKey);
    if (!isValidKey) {
      throw new AppError('Invalid API key', 401);
    }
    
    device.lastActivity = new Date();
    await device.save();
    
    const response: any = {
      success: true,
      status: device.status,
      message: device.status === 'blocked' ? 'Device is currently blocked' : 'Device is active'
    };
    
    if (device.status === 'blocked' && device.blockedAt) {
      response.blockedAt = device.blockedAt;
      if (device.blockHistory.length > 0) {
        const lastBlock = device.blockHistory[device.blockHistory.length - 1];
        response.reason = lastBlock.reason;
      }
    }
    
    res.json(response);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to check device status', 500);
  }
};

export const deleteDevice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.admin) {
      throw new AppError('Not authenticated', 401);
    }
    
    const { deviceId } = req.params;
    const device = await Device.findOne({ deviceId });
    
    if (!device) {
      throw new AppError('Device not found', 404);
    }
    
    await AuditLog.create({
      action: 'device_deleted',
      deviceId: device._id,
      adminId: req.admin.adminId,
      details: { deviceId: device.deviceId, model: device.model }
    });
    
    await Device.deleteOne({ deviceId });
    
    res.json({
      success: true,
      message: 'Device deleted successfully'
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to delete device', 500);
  }
};
