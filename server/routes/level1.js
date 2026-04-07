/**
 * routes/level1.js (ESM)
 * Level 1 specific routes — save, progress, leaderboard
 * Mounted at /api/level1 in server.js
 */

import express from 'express';
import Level1Progress from '../models/Level1Progress.js';

const router = express.Router();

// POST /api/level1/save
router.post('/save', async (req, res) => {
  try {
    const { username, levelCompleted, score } = req.body;

    if (!username) {
      return res.status(400).json({ success: false, error: 'username is required' });
    }
    if (score !== undefined && (typeof score !== 'number' || score < 0 || score > 60)) {
      return res.status(400).json({ success: false, error: 'score must be 0–60' });
    }

    const entry = new Level1Progress({
      username,
      levelCompleted: levelCompleted ?? false,
      score: score ?? 0,
      environmentFile: process.env.ENVIRONMENT || 'development',
      timestamp: new Date(),
    });

    const saved = await entry.save();
    console.log(`✅ Level 1 saved: ${username} | Score ${score}`);
    return res.status(201).json({ success: true, message: 'Level 1 progress saved!', data: saved });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const msgs = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, error: msgs.join(', ') });
    }
    console.error('Level1 save error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to save progress' });
  }
});

// GET /api/level1/progress
router.get('/progress', async (req, res) => {
  try {
    const { username } = req.query;
    const query = username ? { username: new RegExp(`^${username}$`, 'i') } : {};
    const entries = await Level1Progress.find(query).sort({ timestamp: -1 });
    return res.status(200).json({ success: true, count: entries.length, data: entries });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch progress' });
  }
});

// GET /api/level1/leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await Level1Progress.aggregate([
      { $group: { _id: '$username', bestScore: { $max: '$score' }, completed: { $max: '$levelCompleted' } } },
      { $sort: { bestScore: -1 } },
      { $limit: 10 },
      { $project: { _id: 0, username: '$_id', bestScore: 1, completed: 1 } },
    ]);
    return res.status(200).json({ success: true, leaderboard });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch leaderboard' });
  }
});

export default router;
