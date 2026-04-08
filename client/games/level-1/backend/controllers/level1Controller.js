/**
 * controllers/level1Controller.js
 * ─────────────────────────────────────────────────
 * Contains the actual logic for each Level-1 API endpoint.
 * Routes call these functions; they interact with the DB model.
 */

const Level1 = require('../models/Level1');

// ────────────────────────────────────────────────
// POST /api/level1/save
// ────────────────────────────────────────────────
/**
 * saveLevel1
 * Receives level data from the frontend and saves it to MongoDB.
 *
 * Expected request body:
 * {
 *   username       : "AgentZero",
 *   levelCompleted : true,
 *   score          : 60
 * }
 *
 * environmentFile is pulled from process.env (not the client),
 * and timestamp is auto-generated.
 */
const saveLevel1 = async (req, res) => {
  try {
    const { username, levelCompleted, score } = req.body;

    // ── Basic Validation ──────────────────────────
    // Check required fields
    if (!username) {
      return res.status(400).json({
        success: false,
        error  : 'username is required'
      });
    }

    // Score must be a number between 0 and 60
    if (score !== undefined && (typeof score !== 'number' || score < 0 || score > 60)) {
      return res.status(400).json({
        success: false,
        error  : 'score must be a number between 0 and 60'
      });
    }

    // levelCompleted must be boolean
    if (levelCompleted !== undefined && typeof levelCompleted !== 'boolean') {
      return res.status(400).json({
        success: false,
        error  : 'levelCompleted must be true or false'
      });
    }

    // ── Build the document ────────────────────────
    const newEntry = new Level1({
      username,
      levelCompleted  : levelCompleted ?? false,
      score           : score ?? 0,
      // Pull environment label directly from server — never trust the client
      environmentFile : process.env.ENVIRONMENT || 'development',
      timestamp       : new Date()
    });

    // ── Save to MongoDB ───────────────────────────
    const saved = await newEntry.save();

    // ── Respond with success ──────────────────────
    return res.status(201).json({
      success: true,
      message: 'Level 1 progress saved successfully!',
      data   : saved
    });

  } catch (err) {
    // Mongoose validation errors (e.g. minlength, maxlength)
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, error: messages.join(', ') });
    }

    console.error('saveLevel1 error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to save progress' });
  }
};

// ────────────────────────────────────────────────
// GET /api/level1/progress
// ────────────────────────────────────────────────
/**
 * getProgress
 * Fetches all saved progress entries, newest first.
 * Optional query param: ?username=AgentZero  (filter by user)
 */
const getProgress = async (req, res) => {
  try {
    const { username } = req.query;

    // Build query object (filter by username if provided)
    const query = username ? { username: new RegExp(`^${username}$`, 'i') } : {};

    // Fetch from DB, sorted by newest first
    const entries = await Level1.find(query).sort({ timestamp: -1 });

    return res.status(200).json({
      success: true,
      count  : entries.length,
      data   : entries
    });

  } catch (err) {
    console.error('getProgress error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to fetch progress' });
  }
};

// ────────────────────────────────────────────────
// GET /api/level1/leaderboard
// ────────────────────────────────────────────────
/**
 * getLeaderboard
 * Returns top 10 unique players sorted by highest score.
 */
const getLeaderboard = async (req, res) => {
  try {
    // Aggregate: group by username, pick highest score per user
    const leaderboard = await Level1.aggregate([
      {
        $group: {
          _id      : '$username',
          bestScore: { $max: '$score' },
          completed: { $max: '$levelCompleted' }
        }
      },
      { $sort : { bestScore: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id      : 0,
          username : '$_id',
          bestScore: 1,
          completed: 1
        }
      }
    ]);

    return res.status(200).json({
      success    : true,
      leaderboard: leaderboard
    });

  } catch (err) {
    console.error('getLeaderboard error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to fetch leaderboard' });
  }
};

module.exports = { saveLevel1, getProgress, getLeaderboard };
