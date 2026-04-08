import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    badgeId: {
      type: String,
      required: true,
    },
    badgeName: {
      type: String,
      required: true,
    },
    badgeDescription: String,
    icon: String,
    category: {
      type: String,
      enum: ['quiz', 'course', 'game', 'tool', 'activity'],
    },
    unlockedAt: {
      type: Date,
      default: Date.now,
    },
    rarity: {
      type: String,
      enum: ['common', 'uncommon', 'rare', 'legendary'],
      default: 'common',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Achievement', achievementSchema);
