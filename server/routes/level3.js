/**
 * routes/level3.js (ESM)
 * Level 3 (Ransomware) specific routes — save, progress, leaderboard
 * Mounted at /api/level3 in server.js
 */

import express from 'express';
import Level3Progress from '../models/Level3Progress.js';

const router = express.Router();

// POST /api/level3/save
router.post('/save', async (req, res) => {
  try {
    const { username, levelCompleted, ransomwareChoice, attempts, timeTaken, score, difficulty } = req.body;

    if (!username || username.trim() === '') {
      return res.status(400).json({ success: false, message: 'Username is required.' });
    }

    const entry = new Level3Progress({
      username: username.trim(),
      levelCompleted: levelCompleted ?? false,
      ransomwareChoice: ransomwareChoice || 'incomplete',
      attempts: attempts || 1,
      timeTaken: timeTaken || 0,
      environmentFile: process.env.GAME_MODE || 'unknown',
      score: score || 0,
      difficulty: difficulty || 'normal',
    });

    const saved = await entry.save();
    console.log(`✅ Level 3 saved: ${username} | Score ${score}`);
    return res.status(201).json({ success: true, message: 'Level 3 progress saved!', data: saved });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const msgs = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: 'Validation failed.', errors: msgs });
    }
    console.error('Level3 save error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error — could not save.' });
  }
});

// GET /api/level3/leaderboard/top — MUST be before /:username
router.get('/leaderboard/top', async (req, res) => {
  try {
    const topPlayers = await Level3Progress.find({ levelCompleted: true })
      .sort({ timeTaken: 1 })
      .limit(10)
      .select('username timeTaken score difficulty attempts createdAt')
      .lean();

    return res.status(200).json({ success: true, message: 'Top 10', count: topPlayers.length, data: topPlayers });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Could not fetch leaderboard.' });
  }
});

// GET /api/level3/:username
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    if (!username || username.trim() === '') {
      return res.status(400).json({ success: false, message: 'Username required.' });
    }

    const records = await Level3Progress.find({ username: username.trim() }).sort({ createdAt: -1 }).lean();

    if (records.length === 0) {
      return res.status(404).json({ success: false, message: `No progress for ${username}` });
    }

    return res.status(200).json({ success: true, count: records.length, data: records });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Could not fetch progress.' });
  }
});

export default router;
