import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog {
  action: string;
  deviceId?: mongoose.Types.ObjectId;
  adminId: mongoose.Types.ObjectId;
  timestamp: Date;
  ipAddress?: string;
  details: Record<string, any>;
}

const AuditLogSchema = new Schema({
  action: {
    type: String,
    required: true,
    index: true
  },
  deviceId: {
    type: Schema.Types.ObjectId,
    ref: 'Device'
  },
  adminId: {
    type: Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  ipAddress: {
    type: String
  },
  details: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

export default mongoose.model<IAuditLog & Document>('AuditLog', AuditLogSchema);
