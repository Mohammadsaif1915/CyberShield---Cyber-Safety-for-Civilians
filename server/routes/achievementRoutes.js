import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  checkAchievements,
  getAchievements,
  getStats,
  getProgress,
  triggerAchievementCheck
} from '../controllers/achievementController.js';

const router = express.Router();

/**
 * @route   POST /api/achievements/check
 * @desc    Check for new achievements and award them
 * @access  Private
 */
router.post('/check', protect, checkAchievements);

/**
 * @route   GET /api/achievements
 * @desc    Get all achievements for current user
 * @access  Private
 */
router.get('/', protect, getAchievements);

/**
 * @route   GET /api/achievements/stats
 * @desc    Get achievement statistics
 * @access  Private
 */
router.get('/stats', protect, getStats);

/**
 * @route   GET /api/achievements/progress
 * @desc    Get next achievements to unlock
 * @access  Private
 */
router.get('/progress', protect, getProgress);

/**
 * @route   POST /api/achievements/trigger-check
 * @desc    Manually trigger achievement check (for testing)
 * @access  Private
 */
router.post('/trigger-check', protect, triggerAchievementCheck);

export default router;
