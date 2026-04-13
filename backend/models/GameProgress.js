import mongoose from 'mongoose';

const gameProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: null,
      index: true,
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      minlength: [2, 'Username must be at least 2 characters'],
      maxlength: [30, 'Username must be at most 30 characters'],
    },
    level: {
      type: Number,
      required: [true, 'Level is required'],
      enum: {
        values: [1, 2, 3, 4, 5],
        message: 'Level must be 1, 2, 3, 4, or 5',
      },
    },
    score: {
      type: Number,
      default: 0,
      min: [0, 'Score cannot be negative'],
    },
    maxScore: {
      type: Number,
      default: 0,
    },
    levelCompleted: {
      type: Boolean,
      default: false,
    },
    timeSpent: {
      type: Number,
      default: 0,
    },
    timeRemaining: {
      type: Number,
      default: 0,
    },
    healthRemaining: {
      type: Number,
      default: null,
    },
    phasesCompleted: {
      type: [String],
      default: [],
    },
    totalPhases: {
      type: Number,
      default: 0,
    },
    stats: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    playedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: 'gameprogresses',
  }
);

gameProgressSchema.index({ level: 1, score: -1 });
gameProgressSchema.index({ username: 1, level: 1 });
gameProgressSchema.index({ userId: 1, level: 1 });

const GameProgress = mongoose.model('GameProgress', gameProgressSchema);

export default GameProgress;
