import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  getQuizStats,
  getUserGrowth,
  getSystemHealth,
  getActivityLogs,
  exportData,
  createBackup,
  getDetailedUsers,
  getAllCourses,
  manageCourse,
  addVideoToCourse,
  deleteVideoFromCourse,
  getAllCertificates,
  updateCertificatePayment,
  getRealTimeActivity,
  getAdminDashboardOverview,
  deleteUser,
  updateUser,
  deleteCourse,
  sendNotification,
} from '../controllers/adminController.js';

const router = express.Router();

// ── Core Dashboard Routes ────────────────────────────────────
router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/quiz-stats', getQuizStats);
router.get('/user-growth', getUserGrowth);
router.get('/system-health', getSystemHealth);
router.get('/activity-logs', getActivityLogs);
router.get('/export', exportData);
router.post('/backup', createBackup);

// ── Overview ─────────────────────────────────────────────────
router.get('/overview', getAdminDashboardOverview);

// ── User Management ──────────────────────────────────────────
router.get('/details/users', getDetailedUsers);
router.delete('/users/:userId', deleteUser);
router.put('/users/:userId', updateUser);

// ── Course Management ─────────────────────────────────────────
router.get('/courses/all', getAllCourses);
router.post('/courses/:courseId', manageCourse);          // courseId = 'new' to create
router.delete('/courses/:courseId', deleteCourse);
router.post('/courses/:courseId/videos', addVideoToCourse);
router.delete('/courses/:courseId/videos/:videoIndex', deleteVideoFromCourse);

// ── Certificate Management ────────────────────────────────────
router.get('/certificates/all', getAllCertificates);
router.put('/certificates/:certificateId/payment', updateCertificatePayment);

// ── Real-time Activity ────────────────────────────────────────
router.get('/activity/realtime', getRealTimeActivity);

// ── Email Notifications (SMTP) ────────────────────────────────
// Mount this on /api/notify in your main app.js
// OR add it here and mount adminRouter on /api/admin
router.post('/notify', sendNotification);

export default router;
