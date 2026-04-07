/**
 * routes/game.js
 * ─────────────────────────────────────────────────
 * REST API routes for CyberShield game progress.
 * Handles save, leaderboard, progress, stats,
 * and sequential unlock checks for all 5 levels.
 *
 * Mounted at /api/game in server.js
 */

import express from 'express';
import GameProgress from '../models/GameProgress.js';

const router = express.Router();

// ══════════════════════════════════════════════════════════════
// POST /api/game/save
// Save a game session to MongoDB
// ══════════════════════════════════════════════════════════════
router.post('/save', async (req, res) => {
  try {
    const {
      userId,
      username,
      level,
      score,
      maxScore,
      levelCompleted,
      timeSpent,
      timeRemaining,
      healthRemaining,
      phasesCompleted,
      totalPhases,
      stats,
    } = req.body;

    // ── Validation ──
    if (!username || typeof username !== 'string' || username.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Username is required (min 2 characters)',
      });
    }

    const validLevels = [1, 2, 3, 4, 5];
    if (!level || !validLevels.includes(level)) {
      return res.status(400).json({
        success: false,
        error: 'Level must be 1, 2, 4, or 5',
      });
    }

    if (score !== undefined && (typeof score !== 'number' || score < 0)) {
      return res.status(400).json({
        success: false,
        error: 'Score must be a non-negative number',
      });
    }

    // ── Build and save document ──
    const entry = new GameProgress({
      userId: userId || null,
      username: username.trim(),
      level,
      score: score ?? 0,
      maxScore: maxScore ?? 0,
      levelCompleted: levelCompleted ?? false,
      timeSpent: timeSpent ?? 0,
      timeRemaining: timeRemaining ?? 0,
      healthRemaining: healthRemaining ?? null,
      phasesCompleted: phasesCompleted ?? [],
      totalPhases: totalPhases ?? 0,
      stats: stats ?? {},
      playedAt: new Date(),
    });

    const saved = await entry.save();

    console.log(`✅ Game progress saved: ${username} | Level ${level} | Score ${score}`);

    return res.status(201).json({
      success: true,
      message: `Level ${level} progress saved successfully!`,
      data: saved,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, error: messages.join(', ') });
    }
    console.error('Game save error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to save game progress' });
  }
});

// ══════════════════════════════════════════════════════════════
// GET /api/game/leaderboard/:level
// Top 10 unique players by best score for a specific level
// ══════════════════════════════════════════════════════════════
router.get('/leaderboard/:level', async (req, res) => {
  try {
    const level = parseInt(req.params.level);
    const validLevels = [1, 2, 3, 4, 5];
    if (!validLevels.includes(level)) {
      return res.status(400).json({ success: false, error: 'Invalid level' });
    }

    const leaderboard = await GameProgress.aggregate([
      { $match: { level } },
      {
        $group: {
          _id: '$username',
          bestScore: { $max: '$score' },
          completed: { $max: '$levelCompleted' },
          plays: { $sum: 1 },
          lastPlayed: { $max: '$playedAt' },
        },
      },
      { $sort: { bestScore: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          username: '$_id',
          bestScore: 1,
          completed: 1,
          plays: 1,
          lastPlayed: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      level,
      leaderboard,
    });
  } catch (err) {
    console.error('Leaderboard error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to fetch leaderboard' });
  }
});

// ══════════════════════════════════════════════════════════════
// GET /api/game/leaderboard
// Global leaderboard — top 10 by total score across all levels
// ══════════════════════════════════════════════════════════════
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await GameProgress.aggregate([
      {
        $group: {
          _id: { username: '$username', level: '$level' },
          bestScore: { $max: '$score' },
        },
      },
      {
        $group: {
          _id: '$_id.username',
          totalScore: { $sum: '$bestScore' },
          levelsPlayed: { $sum: 1 },
        },
      },
      { $sort: { totalScore: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          username: '$_id',
          totalScore: 1,
          levelsPlayed: 1,
        },
      },
    ]);

    return res.status(200).json({ success: true, leaderboard });
  } catch (err) {
    console.error('Global leaderboard error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to fetch global leaderboard' });
  }
});

// ══════════════════════════════════════════════════════════════
// GET /api/game/progress/:level
// Get all progress entries for a level (optional ?username= filter)
// ══════════════════════════════════════════════════════════════
router.get('/progress/:level', async (req, res) => {
  try {
    const level = parseInt(req.params.level);
    const { username } = req.query;

    const query = { level };
    if (username) {
      query.username = new RegExp(`^${username}$`, 'i');
    }

    const entries = await GameProgress.find(query)
      .sort({ playedAt: -1 })
      .limit(50);

    return res.status(200).json({
      success: true,
      count: entries.length,
      data: entries,
    });
  } catch (err) {
    console.error('Progress fetch error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to fetch progress' });
  }
});

// ══════════════════════════════════════════════════════════════
// GET /api/game/progress/:level/:username
// Get a specific user's progress for a level
// ══════════════════════════════════════════════════════════════
router.get('/progress/:level/:username', async (req, res) => {
  try {
    const level = parseInt(req.params.level);
    const { username } = req.params;

    const entries = await GameProgress.find({
      level,
      username: new RegExp(`^${username}$`, 'i'),
    }).sort({ playedAt: -1 });

    return res.status(200).json({
      success: true,
      count: entries.length,
      data: entries,
    });
  } catch (err) {
    console.error('User progress error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to fetch user progress' });
  }
});

// ══════════════════════════════════════════════════════════════
// GET /api/game/stats/:username
// Overall stats for a player across all levels
// ══════════════════════════════════════════════════════════════
router.get('/stats/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const stats = await GameProgress.aggregate([
      { $match: { username: new RegExp(`^${username}$`, 'i') } },
      {
        $group: {
          _id: '$level',
          bestScore: { $max: '$score' },
          plays: { $sum: 1 },
          completed: { $max: '$levelCompleted' },
          lastPlayed: { $max: '$playedAt' },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          level: '$_id',
          bestScore: 1,
          plays: 1,
          completed: 1,
          lastPlayed: 1,
        },
      },
    ]);

    const totalScore = stats.reduce((sum, s) => sum + s.bestScore, 0);
    const levelsCompleted = stats.filter((s) => s.completed).length;
    const totalPlays = stats.reduce((sum, s) => sum + s.plays, 0);

    return res.status(200).json({
      success: true,
      data: {
        username,
        totalScore,
        levelsCompleted,
        totalPlays,
        levels: stats,
      },
    });
  } catch (err) {
    console.error('Stats error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to fetch stats' });
  }
});

// ══════════════════════════════════════════════════════════════
// GET /api/game/check-unlock/:username/:level
// Check if a user has completed the previous level
// Used by game hub for sequential unlock logic
// ══════════════════════════════════════════════════════════════
router.get('/check-unlock/:username/:level', async (req, res) => {
  try {
    const { username } = req.params;
    const level = parseInt(req.params.level);

    // Level 1 is always unlocked
    if (level === 1) {
      return res.status(200).json({ success: true, unlocked: true });
    }

    const validLevels = [1, 2, 3, 4, 5];
    if (!validLevels.includes(level)) {
      return res.status(400).json({ success: false, error: 'Invalid level' });
    }

    // Check if the previous level was completed
    const prevLevel = level - 1;
    const completed = await GameProgress.findOne({
      username: new RegExp(`^${username}$`, 'i'),
      level: prevLevel,
      levelCompleted: true,
    });

    return res.status(200).json({
      success: true,
      unlocked: !!completed,
      previousLevel: prevLevel,
      previousCompleted: !!completed,
    });
  } catch (err) {
    console.error('Check unlock error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to check unlock status' });
  }
});

// ══════════════════════════════════════════════════════════════
// GET /api/game/completed-levels/:username
// Get all completed levels for a user (for hub sync)
// ══════════════════════════════════════════════════════════════
router.get('/completed-levels/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const completedEntries = await GameProgress.find({
      username: new RegExp(`^${username}$`, 'i'),
      levelCompleted: true,
    }).distinct('level');

    return res.status(200).json({
      success: true,
      completedLevels: completedEntries.sort((a, b) => a - b),
    });
  } catch (err) {
    console.error('Completed levels error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to fetch completed levels' });
  }
});

export default router;
