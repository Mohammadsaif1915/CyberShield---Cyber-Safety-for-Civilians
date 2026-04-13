import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const router = express.Router();

// Simple Activity schema inline (or move to models/Activity.js)
const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:   { type: String, required: true }, // quiz | game | phishing
  result: { type: String },                 // pass | fail
  score:  { type: Number, default: 0 },
  msg:    { type: String },
}, { timestamps: true });

const Activity = mongoose.models.Activity || mongoose.model('Activity', activitySchema);

const protect = (req, res, next) => {
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

// POST /api/activity
router.post('/', protect, async (req, res) => {
  try {
    const { type, result, score, msg } = req.body;
    await Activity.create({ userId: req.userId, type, result, score: score || 0, msg });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/activity
router.get('/', protect, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const activities = await Activity.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json(activities);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;