import { Response } from 'express';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin';
import AuditLog from '../models/AuditLog';
import { generateToken } from '../utils/tokenGenerator';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth.middleware';

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password, name, role } = req.body;
    
    if (!email || !password || !name) {
      throw new AppError('Email, password, and name are required', 400);
    }
    
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      throw new AppError('Admin with this email already exists', 400);
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const admin = await Admin.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role: role || 'admin'
    });
    
    const token = generateToken({
      adminId: admin._id.toString(),
      email: admin.email,
      role: admin.role
    });
    
    await AuditLog.create({
      action: 'admin_registered',
      adminId: admin._id,
      details: { email: admin.email, name: admin.name }
    });
    
    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Registration failed', 500);
  }
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }
    
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      throw new AppError('Invalid credentials', 401);
    }
    
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }
    
    admin.lastLogin = new Date();
    await admin.save();
    
    const token = generateToken({
      adminId: admin._id.toString(),
      email: admin.email,
      role: admin.role
    });
    
    await AuditLog.create({
      action: 'admin_login',
      adminId: admin._id,
      ipAddress: req.ip,
      details: { email: admin.email }
    });
    
    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Login failed', 500);
  }
};

export const verifyAuth = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.admin) {
      throw new AppError('Not authenticated', 401);
    }
    
    const admin = await Admin.findById(req.admin.adminId).select('-password');
    if (!admin) {
      throw new AppError('Admin not found', 404);
    }
    
    res.json({
      success: true,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Verification failed', 500);
  }
};
