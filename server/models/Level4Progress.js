/**
 * models/Level4Progress.js (ESM)
 * Mongoose schema for Level 4 (Dark Web Identity Theft) game data.
 */

import mongoose from 'mongoose';

const level4Schema = new mongoose.Schema(
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
    healthRemaining: { type: Number, default: null },
    phasesCompleted: { type: [String], default: [] },
    totalPhases: { type: Number, default: 3 },
    stats: { type: mongoose.Schema.Types.Mixed, default: {} },
    playedAt: { type: Date, default: Date.now },
  },
  { timestamps: true, collection: 'level4progresses' }
);

export default mongoose.model('Level4Progress', level4Schema);
