/**
 * models/Level2Progress.js (ESM)
 * Mongoose schema for Level 2 (Social Media Scam Room) game data.
 */

import mongoose from 'mongoose';

const level2Schema = new mongoose.Schema(
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
    phasesCompleted: { type: [String], default: [] },
    totalPhases: { type: Number, default: 5 },
    stats: { type: mongoose.Schema.Types.Mixed, default: {} },
    playedAt: { type: Date, default: Date.now },
  },
  { timestamps: true, collection: 'level2progresses' }
);

export default mongoose.model('Level2Progress', level2Schema);
