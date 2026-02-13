export interface Device {
  id: string;
  model: string;
  brand: string;
  os: string;
  osVersion?: string;
  status: 'active' | 'blocked';
  enrolledAt: string;
  lastActivity: string;
  imei?: string;
  serialNumber?: string;
  blockedAt?: string;
  blockHistory?: BlockHistoryItem[];
}

export interface BlockHistoryItem {
  action: 'blocked' | 'unblocked';
  timestamp: string;
  reason: string;
  adminId: string;
}

export interface Admin {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  admin: Admin;
}

export interface Statistics {
  totalDevices: number;
  activeDevices: number;
  blockedDevices: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  action: string;
  timestamp: string;
  adminEmail?: string;
  deviceId?: string;
}

export interface QRCodeResponse {
  success: boolean;
  qrCode: string;
  enrollmentToken: string;
  expiresAt: string;
}

export interface DeviceInfo {
  model: string;
  brand: string;
  os: string;
  osVersion: string;
  imei?: string;
  serialNumber?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  deviceId?: string;
  adminId?: string;
  adminEmail?: string;
  timestamp: string;
  details: Record<string, any>;
}
