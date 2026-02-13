import mongoose, { Document, Schema } from 'mongoose';

export interface IEnrollmentToken extends Document {
  token: string;
  qrCodeData: string;
  expiresAt: Date;
  used: boolean;
  usedAt?: Date;
  usedByDevice?: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const EnrollmentTokenSchema = new Schema({
  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  qrCodeData: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true
  },
  used: {
    type: Boolean,
    default: false
  },
  usedAt: {
    type: Date
  },
  usedByDevice: {
    type: Schema.Types.ObjectId,
    ref: 'Device'
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model<IEnrollmentToken>('EnrollmentToken', EnrollmentTokenSchema);
