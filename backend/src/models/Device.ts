import mongoose, { Document, Schema } from 'mongoose';

export interface IBlockHistory {
  action: 'blocked' | 'unblocked';
  timestamp: Date;
  reason: string;
  adminId: mongoose.Types.ObjectId;
}

export interface IDevice {
  deviceId: string;
  model: string;
  brand: string;
  os: string;
  osVersion: string;
  imei?: string;
  serialNumber?: string;
  status: 'active' | 'blocked';
  apiKey: string;
  enrolledAt: Date;
  lastActivity: Date;
  blockedAt?: Date;
  blockHistory: IBlockHistory[];
  metadata?: Record<string, any>;
}

const BlockHistorySchema = new Schema({
  action: {
    type: String,
    enum: ['blocked', 'unblocked'],
    required: true
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  reason: {
    type: String,
    required: true
  },
  adminId: {
    type: Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  }
});

const DeviceSchema = new Schema({
  deviceId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  model: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  os: {
    type: String,
    required: true
  },
  osVersion: {
    type: String,
    required: true
  },
  imei: {
    type: String,
    sparse: true
  },
  serialNumber: {
    type: String,
    sparse: true
  },
  status: {
    type: String,
    enum: ['active', 'blocked'],
    default: 'active'
  },
  apiKey: {
    type: String,
    required: true
  },
  enrolledAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  lastActivity: {
    type: Date,
    required: true,
    default: Date.now
  },
  blockedAt: {
    type: Date
  },
  blockHistory: [BlockHistorySchema],
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

export default mongoose.model<IDevice & Document>('Device', DeviceSchema);
