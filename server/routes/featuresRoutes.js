import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getDashboardOverview,
  getSecurityScore,
  getUserStatistics,
} from '../controllers/dashboardController.js';
import {
  createIncidentReport,
  getIncidentReports,
  getRecentThreats,
  getAchievements,
  unlockAchievement,
  getAlerts,
  markAlertAsRead,
  createAlert,
} from '../controllers/featuresController.js';

const router = express.Router();

// ── Dashboard Routes ────────────────────────────────────────
router.get('/overview', protect, getDashboardOverview);
router.get('/security-score', protect, getSecurityScore);
router.get('/statistics', protect, getUserStatistics);

// ── Incident Report Routes ─────────────────────────────────
router.post('/incidents/report', protect, createIncidentReport);
router.get('/incidents', protect, getIncidentReports);
router.get('/threats', getRecentThreats); // Public endpoint

// ── Achievement Routes ─────────────────────────────────────
router.get('/achievements', protect, getAchievements);
router.post('/achievements/unlock', protect, unlockAchievement);

// ── Alert Routes ───────────────────────────────────────────
router.get('/alerts', protect, getAlerts);
router.post('/alerts/create', protect, createAlert);
router.put('/alerts/:alertId/read', protect, markAlertAsRead);

export default router;
