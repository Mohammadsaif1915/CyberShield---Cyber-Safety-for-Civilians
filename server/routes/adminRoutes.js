import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  getQuizStats,
  getUserGrowth,
  getSystemHealth,
  getActivityLogs,
  exportData,
  createBackup
} from '../controllers/adminController.js';

const router = express.Router();

// ── Admin Dashboard Routes ───────────────────────────────────
// NOTE: In production, add authentication middleware to protect these routes
// For now, these are public for testing purposes

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/quiz-stats', getQuizStats);
router.get('/user-growth', getUserGrowth);
router.get('/system-health', getSystemHealth);
router.get('/activity-logs', getActivityLogs);
router.get('/export', exportData);
router.post('/backup', createBackup);

export default router;
