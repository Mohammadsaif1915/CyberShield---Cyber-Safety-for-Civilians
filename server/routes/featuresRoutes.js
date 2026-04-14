import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getDashboardOverview,
  getSecurityScore,
  getUserStatistics,
  generateTestData,
} from '../controllers/dashboardController.js';
import {
  createIncidentReport,
  getIncidentReports,
  updateIncidentStatus,
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
router.post('/generate-test-data', protect, generateTestData); // For testing only

// ── Incident Report Routes ─────────────────────────────────
router.post('/incidents/report', protect, createIncidentReport);
router.get('/incidents', protect, getIncidentReports);
router.put('/incidents/:reportId/status', protect, updateIncidentStatus);
router.get('/threats', getRecentThreats); // Public endpoint

// ── Achievement Routes ─────────────────────────────────────
router.get('/achievements', protect, getAchievements);
router.post('/achievements/unlock', protect, unlockAchievement);

// ── Alert Routes ───────────────────────────────────────────
router.get('/alerts', protect, getAlerts);
router.post('/alerts/create', protect, createAlert);
router.put('/alerts/:alertId/read', protect, markAlertAsRead);

// ── Community Routes (Mock) ────────────────────────────────
router.get('/community/posts', protect, (req, res) => {
  res.json({
    success: true,
    data: [
      {
        _id: 'post1',
        title: 'Watch out for fake Amazon refund emails',
        content: 'I received an email today claiming I got a $500 refund, but the link went to a sketchy site.',
        category: 'scam_report',
        author: { _id: 'user1', fullName: 'Alice Security' },
        createdAt: new Date().toISOString(),
        likes: ['user2', 'user3'],
        comments: [
          { text: 'Thanks for the heads up!', author: { fullName: 'Bob' }, createdAt: new Date().toISOString() }
        ],
        views: 142
      },
      {
        _id: 'post2',
        title: 'How to enable 2FA on Google?',
        content: 'Can someone guide me through the steps to enable Two-Factor Authentication on my Google account?',
        category: 'question',
        author: { _id: 'user4', fullName: 'John Doe' },
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        likes: [],
        comments: [],
        views: 34
      }
    ]
  });
});

export default router;
