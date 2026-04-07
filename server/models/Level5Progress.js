/**
 * models/Level5Progress.js (ESM)
 * Mongoose schema for Level 5 (Cyber City Defense) game data.
 */

import mongoose from 'mongoose';

const level5Schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      minlength: [2, 'Username must be at least 2 characters'],
      maxlength: [30, 'Username must be at most 30 characters'],
    },
    levelCompleted: { type: Boolean, default: false },
    score: { type: Number, default: 0, min: [0, 'Score cannot be negative'] },
    maxScore: { type: Number, default: 0 },
    timeSpent: { type: Number, default: 0 },
    timeRemaining: { type: Number, default: 0 },
    healthRemaining: { type: Number, default: null },
    zonesCompleted: { type: [String], default: [] },
    totalZones: { type: Number, default: 5 },
    bossDefeated: { type: Boolean, default: false },
    stats: { type: mongoose.Schema.Types.Mixed, default: {} },
    playedAt: { type: Date, default: Date.now },
  },
  { timestamps: true, collection: 'level5progresses' }
);

export default mongoose.model('Level5Progress', level5Schema);
