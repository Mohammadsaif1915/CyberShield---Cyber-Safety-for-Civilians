// routes/quizSyncRoute.js
// Drop-in replacement for the quiz result POST in server.js
// This version also syncs stats back to the User document immediately.

import express    from 'express';
import jwt        from 'jsonwebtoken';
import QuizResult from '../models/QuizResult.js';
import User       from '../models/User.js';

const router = express.Router();

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Not authorized' });
  try {
    req.userId = jwt.verify(token, process.env.JWT_SECRET).id;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

const computeLevel = (score = 0) => Math.floor(score / 500) + 1;

// POST /api/quiz/result  (replaces the one in server.js)
router.post('/result', auth, async (req, res) => {
  try {
    const {
      moduleId, moduleTitle, totalCorrect, totalQuestions,
      percentage, grade, timeSpent, sectionResults,
    } = req.body;

    if (!moduleId || !moduleTitle)
      return res.status(400).json({ success: false, message: 'moduleId and moduleTitle required' });

    // 1. Save / update quiz result record
    const result = await QuizResult.findOneAndUpdate(
      { user: req.userId, moduleId },
      { user: req.userId, moduleId, moduleTitle, totalCorrect, totalQuestions, percentage, grade, timeSpent, sectionResults },
      { upsert: true, new: true, runValidators: true }
    );

    // 2. Recompute user stats from all quiz results
    const allResults = await QuizResult.find({ user: req.userId });
    const totalPct   = allResults.reduce((sum, r) => sum + (r.percentage || 0), 0);
    const newAvg     = allResults.length > 0 ? Math.round(totalPct / allResults.length) : 0;

    // 3. Compute domain score for phishing-related modules (moduleId 1 = phishing)
    const phishingModules = allResults.filter(r => r.moduleId === 1);
    const phishingScore   = phishingModules.length > 0
      ? Math.round(phishingModules.reduce((s,r)=>s+r.percentage,0) / phishingModules.length)
      : undefined;

    const user = await User.findById(req.userId);
    if (user) {
      user.quizzesDone = allResults.length;
      user.avgScore    = newAvg;
      if (phishingScore !== undefined) user.phishingScore = phishingScore;

      // Recalculate total score
      const quizXP     = Math.round(newAvg * allResults.length * 10);
      const phishingXP = (user.phishingSimCorrect || 0) * 50;
      user.score = quizXP + (user.gameScore || 0) + phishingXP;
      user.xp    = user.score;
      user.level = computeLevel(user.score);

      // Add to recent activity
      const actEntry = {
        msg:  `🧠 Quiz: "${moduleTitle}" — ${percentage}% (${grade})`,
        time: 'Just now',
      };
      user.recentActivity = [actEntry, ...(user.recentActivity || []).slice(0, 9)];

      await user.save({ validateBeforeSave: false });
    }

    console.log(`✅ Quiz result saved & user stats synced — user: ${req.userId}, module: ${moduleId}, grade: ${grade}`);
    return res.status(200).json({ success: true, result });
  } catch (err) {
    console.error('Quiz result save error:', err);
    return res.status(500).json({ success: false, message: 'Result save failed' });
  }
});

// GET /api/quiz/results
router.get('/results', auth, async (req, res) => {
  try {
    const results = await QuizResult.find({ user: req.userId })
      .sort({ updatedAt: -1 })
      .select('moduleId moduleTitle percentage grade timeSpent totalCorrect totalQuestions updatedAt');
    return res.status(200).json({ success: true, results });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Results fetch failed' });
  }
});

// GET /api/quiz/result/:moduleId
router.get('/result/:moduleId', auth, async (req, res) => {
  try {
    const result = await QuizResult.findOne({ user: req.userId, moduleId: parseInt(req.params.moduleId) });
    if (!result) return res.status(404).json({ success: false, message: 'No result for this module' });
    return res.status(200).json({ success: true, result });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;