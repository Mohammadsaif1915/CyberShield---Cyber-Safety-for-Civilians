/**
 * models/GameProgress.js
 * ─────────────────────────────────────────────────
 * Unified Mongoose model for storing game progress
 * across all CyberShield levels (1, 2, 4, 5).
 *
 * Each document represents one play session / attempt.
 * Leaderboards aggregate by username + level, picking best score.
 */

import mongoose from 'mongoose';

const gameProgressSchema = new mongoose.Schema(
  {
    // Player identification
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

    // Level identification (1–5)
    level: {
      type: Number,
      required: [true, 'Level is required'],
      enum: {
        values: [1, 2, 3, 4, 5],
        message: 'Level must be 1, 2, 3, 4, or 5',
      },
    },

    // Core score data
    score: {
      type: Number,
      default: 0,
      min: [0, 'Score cannot be negative'],
    },
    maxScore: {
      type: Number,
      default: 0,
    },

    // Completion status
    levelCompleted: {
      type: Boolean,
      default: false,
    },

    // Time data
    timeSpent: {
      type: Number,
      default: 0,
    },
    timeRemaining: {
      type: Number,
      default: 0,
    },

    // Health data (levels 4 & 5)
    healthRemaining: {
      type: Number,
      default: null,
    },

    // Phase/zone tracking
    phasesCompleted: {
      type: [String],
      default: [],
    },
    totalPhases: {
      type: Number,
      default: 0,
    },

    // Level-specific stats stored as flexible object
    stats: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Timestamp of this play session
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

// Compound index for efficient leaderboard queries
gameProgressSchema.index({ level: 1, score: -1 });
gameProgressSchema.index({ username: 1, level: 1 });
gameProgressSchema.index({ userId: 1, level: 1 });

const GameProgress = mongoose.model('GameProgress', gameProgressSchema);

export default GameProgress;
