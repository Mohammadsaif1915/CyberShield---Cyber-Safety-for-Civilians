/**
 * routes/level5.js (ESM)
 * Level 5 (Cyber City Defense) specific routes
 * Mounted at /api/level5 in server.js
 */

import express from 'express';
import Level5Progress from '../models/Level5Progress.js';

const router = express.Router();

// POST /api/level5/save
router.post('/save', async (req, res) => {
  try {
    const {
      username, levelCompleted, score, maxScore,
      timeSpent, timeRemaining, healthRemaining,
      zonesCompleted, totalZones, bossDefeated, stats
    } = req.body;

    if (!username || username.trim() === '') {
      return res.status(400).json({ success: false, error: 'Username is required' });
    }

    const entry = new Level5Progress({
      username: username.trim(),
      levelCompleted: levelCompleted ?? false,
      score: score || 0,
      maxScore: maxScore || 0,
      timeSpent: timeSpent || 0,
      timeRemaining: timeRemaining || 0,
      healthRemaining: healthRemaining ?? null,
      zonesCompleted: zonesCompleted || [],
      totalZones: totalZones || 5,
      bossDefeated: bossDefeated ?? false,
      stats: stats || {},
      playedAt: new Date(),
    });

    const saved = await entry.save();
    console.log(`✅ Level 5 saved: ${username} | Score ${score} | Completed: ${levelCompleted}`);
    return res.status(201).json({ success: true, message: 'Level 5 progress saved!', data: saved });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const msgs = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, error: msgs.join(', ') });
    }
    console.error('Level5 save error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to save progress' });
  }
});

// GET /api/level5/progress?username=X
router.get('/progress', async (req, res) => {
  try {
    const { username } = req.query;
    const query = username ? { username: new RegExp(`^${username}$`, 'i') } : {};
    const entries = await Level5Progress.find(query).sort({ playedAt: -1 });
    return res.status(200).json({ success: true, count: entries.length, data: entries });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch progress' });
  }
});

// GET /api/level5/leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await Level5Progress.aggregate([
      { $match: { levelCompleted: true } },
      { $group: { _id: '$username', bestScore: { $max: '$score' }, bestTime: { $min: '$timeSpent' } } },
      { $sort: { bestScore: -1 } },
      { $limit: 10 },
      { $project: { _id: 0, username: '$_id', bestScore: 1, bestTime: 1 } },
    ]);
    return res.status(200).json({ success: true, leaderboard });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch leaderboard' });
  }
});

export default router;
