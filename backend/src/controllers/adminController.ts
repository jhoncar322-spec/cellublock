import { Response } from 'express';
import AuditLog from '../models/AuditLog';
import Device from '../models/Device';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth.middleware';

export const getLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.admin) {
      throw new AppError('Not authenticated', 401);
    }
    
    const { deviceId, action, page = '1', limit = '20' } = req.query;
    
    const filter: any = {};
    if (action) filter.action = action;
    if (deviceId) {
      const device = await Device.findOne({ deviceId: deviceId as string });
      if (device) {
        filter.deviceId = device._id;
      }
    }
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;
    
    const logs = await AuditLog.find(filter)
      .populate('adminId', 'email name')
      .populate('deviceId', 'deviceId model')
      .skip(skip)
      .limit(limitNum)
      .sort({ timestamp: -1 });
    
    const total = await AuditLog.countDocuments(filter);
    
    res.json({
      success: true,
      logs: logs.map(log => ({
        id: log._id,
        action: log.action,
        deviceId: log.deviceId ? (log.deviceId as any).deviceId : null,
        adminId: log.adminId ? (log.adminId as any)._id : null,
        adminEmail: log.adminId ? (log.adminId as any).email : null,
        timestamp: log.timestamp,
        details: log.details
      })),
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to fetch logs', 500);
  }
};

export const getStatistics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.admin) {
      throw new AppError('Not authenticated', 401);
    }
    
    const totalDevices = await Device.countDocuments();
    const activeDevices = await Device.countDocuments({ status: 'active' });
    const blockedDevices = await Device.countDocuments({ status: 'blocked' });
    
    const recentActivity = await AuditLog.find()
      .populate('adminId', 'email name')
      .populate('deviceId', 'deviceId model')
      .sort({ timestamp: -1 })
      .limit(10);
    
    res.json({
      success: true,
      statistics: {
        totalDevices,
        activeDevices,
        blockedDevices,
        recentActivity: recentActivity.map(log => ({
          action: log.action,
          timestamp: log.timestamp,
          adminEmail: log.adminId ? (log.adminId as any).email : null,
          deviceId: log.deviceId ? (log.deviceId as any).deviceId : null
        }))
      }
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to fetch statistics', 500);
  }
};
