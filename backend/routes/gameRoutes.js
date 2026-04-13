import express from 'express';
import GameProgress from '../models/GameProgress.js';

const router = express.Router();
const VALID_LEVELS = [1, 2, 3, 4, 5];

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function usernameQuery(username) {
  return new RegExp(`^${escapeRegExp(username)}$`, 'i');
}

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

    const cleanUsername = typeof username === 'string' ? username.trim() : '';
    const levelNum = Number(level);
    const scoreNum = Number(score ?? 0);

    if (cleanUsername.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Username is required and must be at least 2 characters',
      });
    }

    if (!VALID_LEVELS.includes(levelNum)) {
      return res.status(400).json({
        success: false,
        error: 'Level must be 1, 2, 3, 4, or 5',
      });
    }

    if (Number.isNaN(scoreNum) || scoreNum < 0) {
      return res.status(400).json({
        success: false,
        error: 'Score must be a non-negative number',
      });
    }

    const entry = await GameProgress.create({
      userId: userId || null,
      username: cleanUsername,
      level: levelNum,
      score: scoreNum,
      maxScore: Number(maxScore ?? 0),
      levelCompleted: Boolean(levelCompleted),
      timeSpent: Number(timeSpent ?? 0),
      timeRemaining: Number(timeRemaining ?? 0),
      healthRemaining: healthRemaining ?? null,
      phasesCompleted: Array.isArray(phasesCompleted) ? phasesCompleted : [],
      totalPhases: Number(totalPhases ?? 0),
      stats: stats ?? {},
      playedAt: new Date(),
    });

    console.log(`Game progress saved: ${cleanUsername} | Level ${levelNum} | Score ${scoreNum}`);

    return res.status(201).json({
      success: true,
      message: `Level ${levelNum} progress saved`,
      data: entry,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((error) => error.message);
      return res.status(400).json({ success: false, error: messages.join(', ') });
    }
    console.error('Game save error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to save game progress' });
  }
});

router.get('/leaderboard/:level', async (req, res) => {
  try {
    const level = Number(req.params.level);
    if (!VALID_LEVELS.includes(level)) {
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
      { $sort: { bestScore: -1, lastPlayed: 1 } },
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

    return res.status(200).json({ success: true, level, leaderboard });
  } catch (err) {
    console.error('Leaderboard error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to fetch leaderboard' });
  }
});

router.get('/leaderboard', async (_req, res) => {
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

router.get('/progress/:level', async (req, res) => {
  try {
    const level = Number(req.params.level);
    if (!VALID_LEVELS.includes(level)) {
      return res.status(400).json({ success: false, error: 'Invalid level' });
    }

    const query = { level };
    if (req.query.username) query.username = usernameQuery(req.query.username);

    const entries = await GameProgress.find(query).sort({ playedAt: -1 }).limit(50);

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

router.get('/progress/:level/:username', async (req, res) => {
  try {
    const level = Number(req.params.level);
    if (!VALID_LEVELS.includes(level)) {
      return res.status(400).json({ success: false, error: 'Invalid level' });
    }

    const entries = await GameProgress.find({
      level,
      username: usernameQuery(req.params.username),
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

router.get('/stats/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const levels = await GameProgress.aggregate([
      { $match: { username: usernameQuery(username) } },
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

    const totalScore = levels.reduce((sum, item) => sum + item.bestScore, 0);
    const levelsCompleted = levels.filter((item) => item.completed).length;
    const totalPlays = levels.reduce((sum, item) => sum + item.plays, 0);

    return res.status(200).json({
      success: true,
      data: {
        username,
        totalScore,
        levelsCompleted,
        totalPlays,
        levels,
      },
    });
  } catch (err) {
    console.error('Stats error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to fetch stats' });
  }
});

router.get('/check-unlock/:username/:level', async (req, res) => {
  try {
    const level = Number(req.params.level);
    if (!VALID_LEVELS.includes(level)) {
      return res.status(400).json({ success: false, error: 'Invalid level' });
    }

    if (level === 1) {
      return res.status(200).json({ success: true, unlocked: true });
    }

    const previousLevel = level - 1;
    const completed = await GameProgress.findOne({
      username: usernameQuery(req.params.username),
      level: previousLevel,
      levelCompleted: true,
    });

    return res.status(200).json({
      success: true,
      unlocked: Boolean(completed),
      previousLevel,
      previousCompleted: Boolean(completed),
    });
  } catch (err) {
    console.error('Check unlock error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to check unlock status' });
  }
});

router.get('/completed-levels/:username', async (req, res) => {
  try {
    const completedLevels = await GameProgress.find({
      username: usernameQuery(req.params.username),
      levelCompleted: true,
    }).distinct('level');

    return res.status(200).json({
      success: true,
      completedLevels: completedLevels.sort((a, b) => a - b),
    });
  } catch (err) {
    console.error('Completed levels error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to fetch completed levels' });
  }
});

export default router;
