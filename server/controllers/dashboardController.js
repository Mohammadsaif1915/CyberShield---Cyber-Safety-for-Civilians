import User from '../models/User.js';
import SecurityScore from '../models/SecurityScore.js';
import QuizResult from '../models/QuizResult.js';
import Progress from '../models/Progress.js';
import Achievement from '../models/Achievement.js';
import Alert from '../models/Alert.js';
import IncidentReport from '../models/IncidentReport.js';

// ── Get Dashboard Overview ──────────────────────────────────
export const getDashboardOverview = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user data
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get or create security score
    let securityScore = await SecurityScore.findOne({ userId });
    if (!securityScore) {
      securityScore = await SecurityScore.create({ userId });
    }

    // Get quiz statistics
    const quizResults = await QuizResult.find({ userId });
    const quizAvg = quizResults.length > 0
      ? Math.round((quizResults.reduce((sum, r) => sum + (r.percentage || 0), 0)) / quizResults.length)
      : 0;

    // Get course progress
    const courseProgress = await Progress.findOne({ userId });
    const coursesCompleted = courseProgress ? (courseProgress.completedCourses || []).length : 0;

    // Get achievements
    const achievements = await Achievement.find({ userId }).limit(5);

    // Get recent alerts
    const alerts = await Alert.find({ userId, isRead: false }).sort({ createdAt: -1 }).limit(5);

    // Get recent incidents reported
    const incidents = await IncidentReport.find({ userId }).sort({ createdAt: -1 }).limit(3);

    // Calculate dynamic security score
    const updatedScore = {
      quizScore: quizAvg,
      courseProgress: coursesCompleted > 0 ? Math.min(coursesCompleted * 20, 100) : 0,
      gameProgress: user.level ? Math.min(user.level * 10, 100) : 0,
      activityLevel: Math.min(Math.floor((quizResults.length * 10 + coursesCompleted * 5) / 2), 100),
    };

    // Calculate overall score (weighted average)
    const overall = Math.round(
      (updatedScore.quizScore * 0.3 +
        updatedScore.courseProgress * 0.25 +
        updatedScore.gameProgress * 0.2 +
        updatedScore.activityLevel * 0.25) / 1
    );

    // Update security score
    await SecurityScore.updateOne(
      { userId },
      {
        ...updatedScore,
        overallScore: overall,
        lastUpdated: new Date(),
      }
    );

    // Generate suggestions based on score
    const suggestions = [];
    if (quizAvg < 60) {
      suggestions.push({
        title: 'Improve Quiz Performance',
        description: 'Complete more quizzes to boost your security knowledge',
        priority: 'high',
      });
    }
    if (coursesCompleted < 3) {
      suggestions.push({
        title: 'Complete Security Courses',
        description: 'Take more security courses to improve your overall score',
        priority: 'medium',
      });
    }
    if (quizResults.length < 5) {
      suggestions.push({
        title: 'Increase Activity',
        description: 'Take more quizzes and complete games to stay engaged',
        priority: 'medium',
      });
    }

    res.json({
      success: true,
      user: {
        name: user.fullName,
        email: user.email,
        avatar: user.avatar,
      },
      securityScore: {
        overall,
        quizScore: updatedScore.quizScore,
        courseProgress: updatedScore.courseProgress,
        gameProgress: updatedScore.gameProgress,
        activityLevel: updatedScore.activityLevel,
        suggestions,
      },
      statistics: {
        quizzesAttempted: quizResults.length,
        averageScore: quizAvg,
        coursesCompleted,
        achievementsUnlocked: achievements.length,
        reportsSubmitted: incidents.length,
      },
      recentActivity: {
        achievements: achievements.map(a => ({
          name: a.badgeName,
          icon: a.icon,
          unlockedAt: a.unlockedAt,
        })),
        alerts: alerts.map(a => ({
          title: a.title,
          message: a.message,
          type: a.type,
          severity: a.severity,
          createdAt: a.createdAt,
        })),
      },
      unreadAlerts: alerts.length,
      totalIncidents: incidents.length,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: err.message,
    });
  }
};

// ── Get Security Score ────────────────────────────────────
export const getSecurityScore = async (req, res) => {
  try {
    const userId = req.user.id;
    const score = await SecurityScore.findOne({ userId });

    if (!score) {
      return res.status(404).json({ success: false, message: 'Security score not found' });
    }

    res.json({ success: true, score });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching security score',
      error: err.message,
    });
  }
};

// ── Get User Statistics ────────────────────────────────────
export const getUserStatistics = async (req, res) => {
  try {
    const userId = req.user.id;

    const quizResults = await QuizResult.find({ userId });
    const courseProgress = await Progress.findOne({ userId });
    const achievements = await Achievement.find({ userId });
    const incidents = await IncidentReport.find({ userId });

    res.json({
      success: true,
      statistics: {
        totalQuizzes: quizResults.length,
        averageScore: quizResults.length > 0
          ? Math.round(quizResults.reduce((sum, r) => sum + (r.percentage || 0), 0) / quizResults.length)
          : 0,
        coursesCompleted: courseProgress ? (courseProgress.completedCourses || []).length : 0,
        achievementsUnlocked: achievements.length,
        incidentsReported: incidents.length,
        lastActivityDate: quizResults[quizResults.length - 1]?.createdAt || null,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: err.message,
    });
  }
};
