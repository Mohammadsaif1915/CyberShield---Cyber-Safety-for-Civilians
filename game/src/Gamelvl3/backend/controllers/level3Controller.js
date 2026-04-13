// ============================================================
// controllers/level3Controller.js
// Contains the actual logic for each API endpoint.
// Controllers keep route files clean — routes just call these.
// ============================================================

const Level3 = require('../models/Level3');

// ------------------------------------------------------------
// SAVE PROGRESS  →  POST /api/level3/save
// ------------------------------------------------------------
const saveProgress = async (req, res) => {
  try {
    // Destructure the fields sent from the frontend
    const {
      username,
      levelCompleted,
      ransomwareChoice,
      attempts,
      timeTaken,
      score,
      difficulty,
    } = req.body;

    // Basic manual check before hitting the database
    if (!username || username.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Username is required to save progress.',
      });
    }

    // Read GAME_MODE from .env so it gets stored in the database
    const environmentFile = process.env.GAME_MODE || 'unknown';

    // Create a new document using the Level3 model
    const newRecord = new Level3({
      username: username.trim(),
      levelCompleted: levelCompleted ?? false,
      ransomwareChoice: ransomwareChoice || 'incomplete',
      attempts: attempts || 1,
      timeTaken: timeTaken || 0,
      environmentFile,
      score: score || 0,
      difficulty: difficulty || 'normal',
    });

    // Save the document to MongoDB
    const saved = await newRecord.save();

    // Send a success response back to the frontend
    return res.status(201).json({
      success: true,
      message: 'Level 3 progress saved successfully!',
      data: saved,
    });

  } catch (error) {
    // If Mongoose validation fails, extract readable messages
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: messages,
      });
    }

    // Generic server error
    console.error('Error saving Level 3 progress:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error — could not save progress.',
    });
  }
};

// ------------------------------------------------------------
// GET USER PROGRESS  →  GET /api/level3/:username
// ------------------------------------------------------------
const getUserProgress = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username || username.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Username parameter is required.',
      });
    }

    // Find all records for this username, newest first
    const records = await Level3.find({ username: username.trim() })
      .sort({ createdAt: -1 })  // -1 = descending (newest first)
      .lean();                   // .lean() returns plain JS objects (faster)

    if (records.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No progress found for username: ${username}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Found ${records.length} record(s) for ${username}`,
      count: records.length,
      data: records,
    });

  } catch (error) {
    console.error('Error fetching user progress:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error — could not fetch progress.',
    });
  }
};

// ------------------------------------------------------------
// LEADERBOARD  →  GET /api/level3/leaderboard/top
// Returns the fastest completions sorted by timeTaken (asc)
// ------------------------------------------------------------
const getLeaderboard = async (req, res) => {
  try {
    // Only show players who actually completed the level
    // Sort by timeTaken ascending (fastest first)
    const topPlayers = await Level3.find({ levelCompleted: true })
      .sort({ timeTaken: 1 })   // 1 = ascending (fastest first)
      .limit(10)                 // top 10 only
      .select('username timeTaken score difficulty attempts createdAt') // only needed fields
      .lean();

    return res.status(200).json({
      success: true,
      message: 'Top 10 fastest completions',
      count: topPlayers.length,
      data: topPlayers,
    });

  } catch (error) {
    console.error('Error fetching leaderboard:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error — could not fetch leaderboard.',
    });
  }
};

// Export all three so the router can use them
module.exports = { saveProgress, getUserProgress, getLeaderboard };
