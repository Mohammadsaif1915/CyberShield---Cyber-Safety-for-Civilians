/**
 * models/Level1Progress.js (ESM)
 * Mongoose schema for Level 1 game data.
 * Ported from game/Gamelvl1/backend/models/Level1.js
 */

import mongoose from 'mongoose';

const level1Schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      minlength: [2, 'Username must be at least 2 characters'],
      maxlength: [30, 'Username must be at most 30 characters'],
    },
    levelCompleted: { type: Boolean, default: false },
    environmentFile: { type: String, default: 'development', trim: true },
    score: {
      type: Number,
      default: 0,
      min: [0, 'Score cannot be negative'],
      max: [60, 'Score cannot exceed 60'],
    },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true, collection: 'level1progresses' }
);

export default mongoose.model('Level1Progress', level1Schema);
