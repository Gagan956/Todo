import mongoose, { Schema } from 'mongoose';
import type { ILog } from '../types.js';

const logSchema = new Schema<ILog>({
  level: {
    type: String,
    enum: ['error', 'warn', 'info'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  stack: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

export default mongoose.model<ILog>('Log', logSchema);