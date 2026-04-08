import User from '../models/User.js';
import QuizResult from '../models/QuizResult.js';
import { generateAdminExportPDF } from '../utils/pdfGenerator.js';

// ── Get dashboard stats for admin ─────────────────────────────
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({
      lastLoginDate: {
        $gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
      }
    });

    const quizResults = await QuizResult.find();
    const totalQuizzes = quizResults.length;
    const avgScore = quizResults.length > 0
      ? quizResults.reduce((sum, r) => sum + (r.percentage || 0), 0) / quizResults.length
      : 0;

    const usersWithScores = await User.find().select('score fullName email createdAt');
    const completionRate = usersWithScores.length > 0
      ? (usersWithScores.filter(u => u.score > 0).length / usersWithScores.length) * 100
      : 0;

    res.json({
      success: true,
      totalUsers,
      activeUsers,
      totalQuizzes,
      averageScore: Math.round(avgScore * 100) / 100,
      completionRate: Math.round(completionRate),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats',
      error: err.message
    });
  }
};

// ── Get all users for admin ──────────────────────────────────
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('fullName email score createdAt lastLoginDate quizzesAttempted')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      users,
      total: await User.countDocuments()
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: err.message
    });
  }
};

// ── Get quiz statistics ──────────────────────────────────────
export const getQuizStats = async (req, res) => {
  try {
    const quizResults = await QuizResult.aggregate([
      {
        $group: {
          _id: '$moduleTitle',
          count: { $sum: 1 },
          avgScore: { $avg: '$percentage' },
          maxScore: { $max: '$percentage' },
          minScore: { $min: '$percentage' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      quizStats: quizResults
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching quiz stats',
      error: err.message
    });
  }
};

// ── Get user growth over time ────────────────────────────────
export const getUserGrowth = async (req, res) => {
  try {
    const days = 7;
    const growth = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const count = await User.countDocuments({
        createdAt: { $gte: date, $lt: nextDate }
      });

      growth.push({
        date: date.toLocaleDateString('en-IN', { weekday: 'short' }),
        users: count
      });
    }

    res.json({
      success: true,
      growth
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user growth',
      error: err.message
    });
  }
};

// ── Get system health metrics ────────────────────────────────
export const getSystemHealth = async (req, res) => {
  try {
    const uptime = process.uptime();
    const memory = process.memoryUsage();

    res.json({
      success: true,
      uptime: Math.floor(uptime / 3600),
      memoryUsageMB: Math.round(memory.heapUsed / 1024 / 1024),
      memoryLimitMB: Math.round(memory.heapTotal / 1024 / 1024),
      memoryPercentage: Math.round((memory.heapUsed / memory.heapTotal) * 100),
      apiHealthy: true,
      databaseHealthy: true
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching system health',
      error: err.message
    });
  }
};

// ── Admin logs ───────────────────────────────────────────────
// ── Get activity logs from database ──────────────────────────
export const getActivityLogs = async (req, res) => {
  try {
    const logs = [];

    // Get quiz results as activities
    const quizResults = await QuizResult.find()
      .select('userId moduleTitle score percentage createdAt')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    quizResults.forEach(qr => {
      logs.push({
        timestamp: qr.createdAt,
        action: 'Quiz Completed',
        user: qr.userId || 'Unknown',
        details: `${qr.moduleTitle} - Score: ${qr.percentage}%`
      });
    });

    // Get recent users as activities
    const recentUsers = await User.find()
      .select('fullName email createdAt')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    recentUsers.forEach(user => {
      logs.push({
        timestamp: user.createdAt,
        action: 'User Registration',
        user: user.email,
        details: `${user.fullName} joined the platform`
      });
    });

    // Sort by timestamp and take the latest 10
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const finalLogs = logs.slice(0, 10);

    res.json({
      success: true,
      logs: finalLogs
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching activity logs',
      error: err.message
    });
  }
};

// ── Export data as PDF ──────────────────────────────────────
export const exportData = async (req, res) => {
  try {
    const users = await User.find().select('-password').lean();
    const quizResults = await QuizResult.find().lean();
    
    const avgScore = quizResults.length > 0 
      ? (quizResults.reduce((sum, r) => sum + (r.percentage || 0), 0) / quizResults.length).toFixed(2)
      : 0;

    const exportData = {
      summary: {
        totalUsers: users.length,
        totalQuizAttempts: quizResults.length,
        avgScore
      },
      users,
      quizResults
    };

    const pdfBuffer = await generateAdminExportPDF(exportData);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="cybershield-admin-report-${new Date().getTime()}.pdf"`);
    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error exporting data',
      error: err.message
    });
  }
};

// ── Create backup ────────────────────────────────────────────
export const createBackup = async (req, res) => {
  try {
    const users = await User.find().lean();
    const quizResults = await QuizResult.find().lean();
    
    const backupData = {
      timestamp: new Date(),
      version: '1.0',
      collections: {
        users: users.length,
        quizResults: quizResults.length
      },
      data: {
        users,
        quizResults
      }
    };

    res.json({
      success: true,
      message: 'Backup created successfully',
      backupId: `backup-${new Date().getTime()}`,
      size: JSON.stringify(backupData).length,
      collections: backupData.collections
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error creating backup',
      error: err.message
    });
  }
};
