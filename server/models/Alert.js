import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['threat', 'tip', 'achievement', 'update', 'security'],
      default: 'security',
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    icon: String,
    color: String,
    isRead: {
      type: Boolean,
      default: false,
    },
    actionUrl: String,
    actionText: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  },
  { timestamps: true }
);

export default mongoose.model('Alert', alertSchema);
