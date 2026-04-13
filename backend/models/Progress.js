import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'userId is required'],
      trim: true,
      index: true,
    },
    level: {
      type: Number,
      required: [true, 'Level is required'],
      min: [1, 'Level must be between 1 and 5'],
      max: [5, 'Level must be between 1 and 5'],
    },
    score: {
      type: Number,
      default: 0,
      min: [0, 'Score cannot be negative'],
    },
    status: {
      type: String,
      enum: {
        values: ['in-progress', 'completed'],
        message: 'Status must be "in-progress" or "completed"',
      },
      default: 'in-progress',
    },
    timeTaken: {
      type: Number,
      default: 0,
      min: [0, 'Time taken cannot be negative'],
    },
    trustLevel: {
      type: Number,
      default: 0,
      min: [0, 'Trust level cannot be negative'],
      max: [100, 'Trust level cannot exceed 100'],
    },
    riskLevel: {
      type: Number,
      default: 0,
      min: [0, 'Risk level cannot be negative'],
      max: [100, 'Risk level cannot exceed 100'],
    },
    zonesCompleted: {
      type: Number,
      default: 0,
      min: [0, 'Zones completed cannot be negative'],
    },
  },
  {
    timestamps: true,
    collection: 'gamelevelprogress',
  }
);

// Compound index — ensures one record per userId + level for upsert
progressSchema.index({ userId: 1, level: 1 }, { unique: true });

// Index for leaderboard-style queries
progressSchema.index({ level: 1, score: -1 });

const Progress = mongoose.model('Progress', progressSchema);

export default Progress;
