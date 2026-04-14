// ============================================================
// models/Level3.js
// Mongoose schema that defines the shape of Level 3 game data
// stored in MongoDB.
// ============================================================

const mongoose = require('mongoose');

// Define the schema (blueprint for each document)
const level3Schema = new mongoose.Schema(
  {
    // Player's username — required so we can look up their record
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,           // removes accidental leading/trailing spaces
      minlength: [1, 'Username cannot be empty'],
      maxlength: [50, 'Username cannot exceed 50 characters'],
    },

    // Did the player successfully complete the level?
    levelCompleted: {
      type: Boolean,
      required: [true, 'levelCompleted flag is required'],
      default: false,
    },

    // What did the player choose to do with the ransomware?
    // "paid"     → paid the ransom demand
    // "ignored"  → ignored the threat
    // "reported" → reported and neutralized the threat (correct action)
    ransomwareChoice: {
      type: String,
      required: [true, 'ransomwareChoice is required'],
      enum: {
        values: ['paid', 'ignored', 'reported', 'incomplete'],
        message: 'ransomwareChoice must be: paid, ignored, reported, or incomplete',
      },
      default: 'incomplete',
    },

    // How many attempts the player made before finishing (or failing)
    attempts: {
      type: Number,
      required: [true, 'attempts is required'],
      min: [1, 'attempts must be at least 1'],
      default: 1,
    },

    // Total seconds the player took from start to end
    timeTaken: {
      type: Number,
      required: [true, 'timeTaken is required'],
      min: [0, 'timeTaken cannot be negative'],
    },

    // Value read from the .env file's GAME_MODE variable
    environmentFile: {
      type: String,
      required: [true, 'environmentFile is required'],
      default: 'unknown',
    },

    // Final score the player achieved
    score: {
      type: Number,
      default: 0,
    },

    // Which difficulty was selected (normal / hard / nightmare)
    difficulty: {
      type: String,
      enum: ['normal', 'hard', 'nightmare'],
      default: 'normal',
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// Export the model so routes/controllers can use it
module.exports = mongoose.model('Level3', level3Schema);
