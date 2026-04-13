import express from 'express';
import {
  saveProgress,
  getProgressByUser,
} from '../controllers/progressController.js';

const router = express.Router();

// POST /api/progress/save — Save or update level progress (upsert)
router.post('/save', saveProgress);

// GET  /api/progress/:userId — Get all progress for a user (sorted by level)
router.get('/:userId', getProgressByUser);

export default router;
