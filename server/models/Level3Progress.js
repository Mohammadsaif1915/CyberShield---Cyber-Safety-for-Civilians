/**
 * models/Level3Progress.js (ESM)
 * Mongoose schema for Level 3 (Ransomware) game data.
 * Ported from game/Gamelvl3/backend/models/Level3.js
 */

import mongoose from 'mongoose';

const level3Schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      minlength: [1, 'Username cannot be empty'],
      maxlength: [50, 'Username cannot exceed 50 characters'],
    },
    levelCompleted: {
      type: Boolean,
      required: [true, 'levelCompleted flag is required'],
      default: false,
    },
    ransomwareChoice: {
      type: String,
      enum: ['paid', 'ignored', 'reported', 'incomplete'],
      default: 'incomplete',
    },
    attempts: { type: Number, min: 1, default: 1 },
    timeTaken: { type: Number, min: 0, default: 0 },
    environmentFile: { type: String, default: 'unknown' },
    score: { type: Number, default: 0 },
    difficulty: {
      type: String,
      enum: ['normal', 'hard', 'nightmare'],
      default: 'normal',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Level3', level3Schema);
