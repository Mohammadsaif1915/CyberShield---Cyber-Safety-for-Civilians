// routes/dashboardRoutes.js
// Handles: /api/auth/me, /api/auth/profile, /api/auth/password,
//          /api/game/score, /api/phishing/result, /api/leaderboard

import express    from 'express';
import jwt        from 'jsonwebtoken';
import bcrypt     from 'bcryptjs';
import mongoose   from 'mongoose';
import multer     from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import User       from '../models/User.js';
import QuizResult from '../models/QuizResult.js';
import { getDashboardOverview } from '../controllers/dashboardController.js';

const router = express.Router();

// ── Auth middleware (same as protect in server.js) ────────────
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Not authorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// ── Multer configuration for avatar uploads ──────────────────
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// ── Helper: compute level from score ─────────────────────────
const computeLevel = (score = 0) => Math.floor(score / 500) + 1;

// ── Helper: build safe user object for frontend ───────────────
const safeUser = (u) => ({
  _id:      u._id,
  id:       u._id,
  fullName: u.fullName || u.name || u.email.split('@')[0],
  name:     u.fullName || u.name || u.email.split('@')[0],
  email:    u.email,
  avatar:   u.avatar  || '',
  phone:    u.phone   || '',
  city:     u.city    || '',
  location: u.location || u.city || '',
  bio:      u.bio     || '',
  role:     u.role    || 'student',
  department: u.department || '',
  twoFaEnabled: u.twoFaEnabled || false,
  notifPrefs:   u.notifPrefs  || {},

  // stats
  score:       u.score       || 0,
  xp:          u.xp          || u.score || 0,
  level:       computeLevel(u.score),
  loginStreak: u.loginStreak || 0,
  lastLoginDate: u.lastLoginDate || null,
  quizzesDone:   u.quizzesDone  || 0,
  avgScore:      u.avgScore     || 0,
  phishingSimCorrect: u.phishingSimCorrect || 0,
  phishingSimTotal:   u.phishingSimTotal   || 0,
  gameScore:     u.gameScore     || 0,
  gamesPlayed:   u.gamesPlayed   || 0,
  gameHighScore: u.gameHighScore || 0,

  coursesCompleted: u.coursesCompleted || 0,
  phishingScore: u.phishingScore || 0,
  malwareScore:  u.malwareScore  || 0,
  networkScore:  u.networkScore  || 0,
  privacyScore:  u.privacyScore  || 0,
  cloudScore:    u.cloudScore    || 0,
  badges:        u.badges        || [],
  weeklyActivity:u.weeklyActivity|| [],
  recentActivity:u.recentActivity|| [],
  createdAt:     u.createdAt,
});

// ═══════════════════════════════════════════════════════════════
// GET /api/auth/me  — fetch current user + fresh quiz stats
// ═══════════════════════════════════════════════════════════════
router.get('/auth/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Pull quiz history from QuizResult collection
    const quizResults = await QuizResult.find({ user: req.userId })
      .sort({ updatedAt: -1 })
      .select('moduleId moduleTitle percentage grade timeSpent totalCorrect totalQuestions updatedAt');

    // Recompute quiz stats from source-of-truth QuizResult records
    if (quizResults.length > 0) {
      const totalPct = quizResults.reduce((sum, r) => sum + (r.percentage || 0), 0);
      const newAvg   = Math.round(totalPct / quizResults.length);
      const newDone  = quizResults.length;

      let changed = false;
      if (user.quizzesDone !== newDone || user.avgScore !== newAvg) {
        user.quizzesDone = newDone;
        user.avgScore    = newAvg;
        changed = true;
      }
      
      const quizXP     = Math.round(user.avgScore * user.quizzesDone * 10);
      const gameXP     = user.gameScore  || 0;
      const phishingXP = user.phishingSimCorrect ? user.phishingSimCorrect * 50 : 0;
      const totalXP    = quizXP + gameXP + phishingXP;
      
      if (user.score !== totalXP || changed) {
         user.score = totalXP;
         user.xp    = user.score;
         user.level = computeLevel(user.score);
         await user.save({ validateBeforeSave: false });
      }
    } else {
      // Even if no quizzes are done, user might have game points
      const gameXP     = user.gameScore  || 0;
      const phishingXP = user.phishingSimCorrect ? user.phishingSimCorrect * 50 : 0;
      const totalXP    = gameXP + phishingXP;
      
      if (user.score !== totalXP) {
         user.score = totalXP;
         user.xp    = user.score;
         user.level = computeLevel(user.score);
         await user.save({ validateBeforeSave: false });
      }
    }

    return res.json({
      success: true,
      user: {
        ...safeUser(user),
        quizHistory: quizResults.map(r => ({
          quiz:           r.moduleTitle,
          moduleTitle:    r.moduleTitle,
          moduleId:       r.moduleId,
          score:          r.percentage,
          percentage:     r.percentage,
          grade:          r.grade,
          totalCorrect:   r.totalCorrect,
          totalQuestions: r.totalQuestions,
          timeSpent:      r.timeSpent,
          date:           r.updatedAt,
          updatedAt:      r.updatedAt,
        })),
      },
    });
  } catch (err) {
    console.error('GET /api/auth/me error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ═══════════════════════════════════════════════════════════════
// PUT /api/auth/profile — update profile fields + avatar upload
// ═══════════════════════════════════════════════════════════════
router.put('/auth/profile', auth, upload.single('avatar'), async (req, res) => {
  try {
    const allowed = [
      'fullName','name','phone','city','location','bio','role','department',
      'avatar','twoFaEnabled','notifPrefs','weeklyActivity',
      // stat fields that phishing sim / game push directly
      'loginStreak','lastLoginDate',
      'phishingSimCorrect','phishingSimTotal',
      'gameScore','gamesPlayed','gameHighScore',
      'coursesCompleted',
      'phishingScore','malwareScore','networkScore','privacyScore','cloudScore',
      'badges','recentActivity',
    ];

    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    // Handle avatar file upload to Cloudinary
    if (req.file) {
      try {
        const transformation = [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }];

        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'cybershield/avatars',
              public_id: `${req.userId}_avatar`,
              overwrite: true,
              transformation,
              format: 'webp',
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });

        updates.avatar = result.secure_url;
        console.log(`✅ Avatar uploaded for user ${req.userId}: ${result.secure_url}`);
      } catch (uploadErr) {
        console.error('Cloudinary upload error:', uploadErr);
        return res.status(500).json({ success: false, message: 'Avatar upload failed', error: uploadErr.message });
      }
    }

    // Keep fullName / name in sync
    if (updates.fullName && !updates.name)     updates.name     = updates.fullName;
    if (updates.name     && !updates.fullName) updates.fullName = updates.name;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updates },
      { new: true, runValidators: false }
    ).select('-password');

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    return res.json({ success: true, user: safeUser(user), message: 'Profile updated successfully' });
  } catch (err) {
    console.error('PUT /api/auth/profile error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// PUT /api/auth/password — change password
// ═══════════════════════════════════════════════════════════════
router.put('/auth/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ success: false, message: 'Both passwords required' });
    if (newPassword.length < 8)
      return res.status(400).json({ success: false, message: 'Minimum 8 characters' });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Current password is incorrect' });

    user.password = newPassword;  // pre-save hook will hash it
    await user.save();

    return res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error('PUT /api/auth/password error:', err);
    return res.status(500).json({ success: false, message: 'Password update failed' });
  }
});

// ═══════════════════════════════════════════════════════════════
// PUT /api/auth/2fa — toggle two-factor authentication
// ═══════════════════════════════════════════════════════════════
router.put('/auth/2fa', auth, async (req, res) => {
  try {
    const { enabled } = req.body;
    if (typeof enabled !== 'boolean') {
      return res.status(400).json({ success: false, message: '2FA enabled flag is required and must be boolean' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.twoFaEnabled = enabled;
    await user.save();

    return res.json({ 
      success: true, 
      message: `Two-factor authentication ${enabled ? 'enabled' : 'disabled'} successfully`,
      user: {
        _id: user._id,
        twoFaEnabled: user.twoFaEnabled
      }
    });
  } catch (err) {
    console.error('PUT /api/auth/2fa error:', err);
    return res.status(500).json({ success: false, message: '2FA update failed' });
  }
});

// ═══════════════════════════════════════════════════════════════
// POST /api/game/score — save game result
// ═══════════════════════════════════════════════════════════════
router.post('/game/score', auth, async (req, res) => {
  try {
    const { score, level, wavesCompleted, enemiesDefeated, timeSpent } = req.body;
    if (score === undefined)
      return res.status(400).json({ success: false, message: 'score is required' });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.gamesPlayed  = (user.gamesPlayed  || 0) + 1;
    user.gameScore    = (user.gameScore    || 0) + score;
    user.gameHighScore = Math.max(user.gameHighScore || 0, score);

    // Recalculate total score
    const quizXP     = Math.round((user.avgScore || 0) * (user.quizzesDone || 0) * 10);
    const phishingXP = (user.phishingSimCorrect || 0) * 50;
    user.score = quizXP + user.gameScore + phishingXP;
    user.xp    = user.score;
    user.level = computeLevel(user.score);

    // Add to recent activity
    const activityEntry = {
      msg:  `🎮 Game played — Score: ${score}${wavesCompleted ? `, Wave ${wavesCompleted}` : ''}`,
      time: 'Just now',
    };
    user.recentActivity = [activityEntry, ...(user.recentActivity || []).slice(0, 9)];

    await user.save({ validateBeforeSave: false });

    console.log(`✅ Game score saved — user: ${req.userId}, score: ${score}`);
    return res.json({
      success: true,
      gameScore:    user.gameScore,
      gameHighScore:user.gameHighScore,
      totalScore:   user.score,
      level:        user.level,
    });
  } catch (err) {
    console.error('POST /api/game/score error:', err);
    return res.status(500).json({ success: false, message: 'Game score save failed' });
  }
});

// ═══════════════════════════════════════════════════════════════
// POST /api/phishing/result — save phishing sim answer
// ═══════════════════════════════════════════════════════════════
router.post('/phishing/result', auth, async (req, res) => {
  try {
    const { correct, emailSubject } = req.body;

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.phishingSimTotal   = (user.phishingSimTotal   || 0) + 1;
    user.phishingSimCorrect = (user.phishingSimCorrect || 0) + (correct ? 1 : 0);

    const acc = Math.round((user.phishingSimCorrect / user.phishingSimTotal) * 100);
    user.phishingScore = acc;

    // Recalculate total score
    const quizXP     = Math.round((user.avgScore || 0) * (user.quizzesDone || 0) * 10);
    const phishingXP = user.phishingSimCorrect * 50;
    user.score = quizXP + (user.gameScore || 0) + phishingXP;
    user.xp    = user.score;
    user.level = computeLevel(user.score);

    // Add to recent activity
    const activityEntry = {
      msg:  `📧 Phishing sim: "${(emailSubject || 'Email').substring(0, 30)}" — ${correct ? 'Correct ✓' : 'Incorrect ✗'}`,
      time: 'Just now',
    };
    user.recentActivity = [activityEntry, ...(user.recentActivity || []).slice(0, 9)];

    await user.save({ validateBeforeSave: false });

    return res.json({
      success: true,
      phishingSimCorrect: user.phishingSimCorrect,
      phishingSimTotal:   user.phishingSimTotal,
      accuracy:           acc,
      totalScore:         user.score,
    });
  } catch (err) {
    console.error('POST /api/phishing/result error:', err);
    return res.status(500).json({ success: false, message: 'Phishing result save failed' });
  }
});

// ═══════════════════════════════════════════════════════════════
// GET /api/leaderboard — real users sorted by score
// ═══════════════════════════════════════════════════════════════
router.get('/leaderboard', auth, async (req, res) => {
  try {
    const sortField = req.query.sort || 'score';
    const validSorts = { score: 'score', xp: 'xp', quiz: 'quizzesDone', streak: 'loginStreak' };
    const mongoSort  = validSorts[sortField] || 'score';

    const users = await User.find({})
      .select('fullName name email avatar role score xp level loginStreak quizzesDone')
      .sort({ [mongoSort]: -1 })
      .limit(50);

    const board = users.map((u) => ({
      userId:      u._id.toString(),
      name:        u.fullName || u.name || u.email.split('@')[0],
      role:        u.role || 'Student',
      level:       computeLevel(u.score),
      score:       u.score       || 0,
      xp:          u.xp          || u.score || 0,
      quizzesDone: u.quizzesDone || 0,
      loginStreak: u.loginStreak || 0,
      avatar:      u.avatar      || '',
    }));

    return res.json(board);
  } catch (err) {
    console.error('GET /api/leaderboard error:', err);
    return res.status(500).json({ success: false, message: 'Leaderboard fetch failed' });
  }
});

// ═══════════════════════════════════════════════════════════════
// GET /api/dashboard — get dashboard overview with real data
// ═══════════════════════════════════════════════════════════════
router.get('/dashboard', auth, async (req, res) => {
  // Convert auth middleware userId to user._id format for getDashboardOverview
  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  req.user = { _id: req.userId, id: req.userId };
  return getDashboardOverview(req, res);
});

// ═══════════════════════════════════════════════════════════════
// GET /api/activity — get recent mock activities
// ═══════════════════════════════════════════════════════════════
router.get('/activity', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const activities = [
       { id: 1, action: "Logged in from new device", time: "2 hours ago", type: "auth" },
       { id: 2, action: "Completed Phishing Simulator", time: "5 hours ago", type: "course" },
       { id: 3, action: "Unlocked Security Badge", time: "1 day ago", type: "achievement" }
    ].slice(0, limit);

    return res.json({
      success: true,
      activities
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ═══════════════════════════════════════════════════════════════
// GET /api/phishing/emails — get default phishing sim emails
// ═══════════════════════════════════════════════════════════════
router.get('/phishing/emails', auth, async (req, res) => {
  try {
    const emails = [
      { id: 1, subject: "Action Required: Verify Account", sender: "support@accounts-security.com", isPhishing: true },
      { id: 2, subject: "Your Weekly Newsletter", sender: "newsletter@company.com", isPhishing: false },
      { id: 3, subject: "Invoice #10492 Attached", sender: "billing@paypal-update.net", isPhishing: true }
    ];
    return res.json({
      success: true,
      emails
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;