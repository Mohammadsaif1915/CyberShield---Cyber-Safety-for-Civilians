/**
 * models/Level1.js
 * ─────────────────────────────────────────────────
 * Mongoose schema that defines the shape of documents
 * stored in the "level1progresses" collection in MongoDB.
 *
 * Fields:
 *  username        – player's name from the UI
 *  levelCompleted  – true if the player finished the level
 *  environmentFile – the ENVIRONMENT value from .env
 *  score           – XP score earned (0–60)
 *  timestamp       – auto-generated date/time of submission
 */

const mongoose = require('mongoose');

// Define the schema
const level1Schema = new mongoose.Schema(
  {
    // Player's username (required, trimmed of whitespace)
    username: {
      type    : String,
      required: [true, 'Username is required'],
      trim    : true,
      minlength: [2, 'Username must be at least 2 characters'],
      maxlength: [30, 'Username must be at most 30 characters']
    },

    // Whether the player completed the level
    levelCompleted: {
      type   : Boolean,
      default: false
    },

    // Reference to the environment label from .env
    environmentFile: {
      type   : String,
      default: 'development',
      trim   : true
    },

    // XP score earned this session
    score: {
      type   : Number,
      default: 0,
      min    : [0,  'Score cannot be negative'],
      max    : [60, 'Score cannot exceed 60']
    },

    // Auto-generated timestamp — Mongoose will handle this via timestamps option
    // but we also expose it as a plain field for explicit access
    timestamp: {
      type   : Date,
      default: Date.now
    }
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,

    // Collection name in MongoDB
    collection: 'level1progresses'
  }
);

// Export the model — Mongoose will use 'Level1Progress' as the model name
module.exports = mongoose.model('Level1Progress', level1Schema);
