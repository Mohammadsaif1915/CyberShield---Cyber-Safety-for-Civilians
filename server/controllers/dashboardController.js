import User from '../models/User.js';
import SecurityScore from '../models/SecurityScore.js';
import QuizResult from '../models/QuizResult.js';
import Progress from '../models/Progress.js';
import Achievement from '../models/Achievement.js';
import Alert from '../models/Alert.js';
import IncidentReport from '../models/IncidentReport.js';
import Level1Progress from '../models/Level1Progress.js';
import Level2Progress from '../models/Level2Progress.js';
import Level3Progress from '../models/Level3Progress.js';
import Level4Progress from '../models/Level4Progress.js';
import Level5Progress from '../models/Level5Progress.js';
import GameProgress from '../models/GameProgress.js';
import { checkAndAwardAchievements, getAchievementStats } from '../services/achievementService.js';

// ── Get Dashboard Overview ──────────────────────────────────
export const getDashboardOverview = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log('[Dashboard] Fetching overview for userId:', userId);

    // Get user data
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    console.log('[Dashboard] User found:', user.email);

    // Get or create security score
    let securityScore = await SecurityScore.findOne({ userId });
    if (!securityScore) {
      securityScore = await SecurityScore.create({ userId });
      console.log('[Dashboard] Created new SecurityScore');
    }

    // Get quiz statistics
    const quizResults = await QuizResult.find({ user: userId });
    console.log('[Dashboard] Quiz results found:', quizResults.length);
    const quizAvg = quizResults.length > 0
      ? Math.round((quizResults.reduce((sum, r) => sum + (r.percentage || 0), 0)) / quizResults.length)
      : 0;

    // Get course progress
    const courseProgress = await Progress.find({ user: userId });
    const completedCourses = courseProgress.filter(cp => cp.quizPassed || cp.completedAt);
    const coursesCompleted = completedCourses.length;
    console.log('[Dashboard] Courses completed:', coursesCompleted, 'Total courses:', courseProgress.length);

    // Get game progress - count unique levels completed by this user
    const gameProgressRecords = await GameProgress.find({ userId, levelCompleted: true });
    console.log('[Dashboard] Game progress records:', gameProgressRecords.length);
    
    const completedLevels = new Set(gameProgressRecords.map(g => g.level));
    const gameProgress = Math.min(completedLevels.size * 20, 100);
    console.log('[Dashboard] Completed levels:', completedLevels.size, 'Game progress score:', gameProgress);

    // Get achievements
    const achievements = await Achievement.find({ userId }).limit(5);
    console.log('[Dashboard] Achievements:', achievements.length);

    // Get recent alerts
    const alerts = await Alert.find({ userId }).sort({ createdAt: -1 }).limit(5);

    // Get recent incidents reported
    const incidents = await IncidentReport.find({ userId }).sort({ createdAt: -1 }).limit(3);

    // Calculate streak (consecutive days of activity)
    const userActivity = [
      ...quizResults.map(q => q.createdAt || q.updatedAt),
      ...completedCourses.map(c => c.completedAt),
      ...incidents.map(i => i.createdAt),
    ].filter(Boolean).sort((a, b) => new Date(b) - new Date(a));

    let streak = 0;
    if (userActivity.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let currentDate = new Date(today);
      
      for (const date of userActivity) {
        const actDate = new Date(date);
        actDate.setHours(0, 0, 0, 0);
        
        if (actDate.getTime() === currentDate.getTime()) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else if (actDate.getTime() < currentDate.getTime()) {
          break;
        }
      }
    }

    // Calculate report/threat submissions score based on incidents
    const reportsSubmitted = incidents.length;
    const reportScore = Math.min(reportsSubmitted * 15, 100);

    // Calculate tool usage score based on activity
    const toolUsage = Math.min(
      Math.floor((quizResults.length * 10 + coursesCompleted * 10 + reportsSubmitted * 10) / 3),
      100
    );

    const updatedScore = {
      quizScore: quizAvg,
      courseProgress: coursesCompleted > 0 ? Math.min(coursesCompleted * 20, 100) : 0,
      reportScore: reportScore,
      toolUsage: toolUsage,
    };

    // Calculate overall score (weighted average) - without games
    const overall = Math.round(
      (updatedScore.quizScore * 0.35 +
        updatedScore.courseProgress * 0.30 +
        updatedScore.reportScore * 0.20 +
        updatedScore.toolUsage * 0.15)
    );

    // Update user stats
    await User.updateOne(
      { _id: userId },
      {
        quizzesDone: quizResults.length,
        avgScore: quizAvg,
        coursesCompleted: coursesCompleted,
        gameLevel: Math.max(...completedLevels, user.gameLevel || 0),
      }
    );

    // Update security score
    await SecurityScore.updateOne(
      { userId },
      {
        quizScore: updatedScore.quizScore,
        courseProgress: updatedScore.courseProgress,
        reportScore: updatedScore.reportScore,
        toolUsage: updatedScore.toolUsage,
        overallScore: overall,
        streak: streak,
        lastUpdated: new Date(),
      },
      { upsert: true }
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
    if (reportsSubmitted < 3) {
      suggestions.push({
        title: 'Submit Security Reports',
        description: `Report suspicious activities to increase your threat awareness score. You've submitted ${reportsSubmitted} report(s).`,
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

    console.log('[Dashboard] Final scores - Overall:', overall, 'Quiz:', updatedScore.quizScore, 'Courses:', updatedScore.courseProgress, 'Reports:', updatedScore.reportScore, 'Tools:', updatedScore.toolUsage, 'Streak:', streak);
    
    // Check and award achievements
    const newAchievements = await checkAndAwardAchievements(userId);
    const achievementStats = await getAchievementStats(userId);
    
    console.log('[Dashboard] New achievements:', newAchievements.length, 'Achievement stats:', achievementStats);
    
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
        reportScore: updatedScore.reportScore,
        toolUsage: updatedScore.toolUsage,
        streak,
        suggestions,
      },
      statistics: {
        quizzesAttempted: quizResults.length,
        averageScore: quizAvg,
        coursesCompleted,
        reportsSubmitted: incidents.length,
        achievementsUnlocked: achievements.length,
        currentStreak: streak,
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
      achievements: {
        newAchievements: newAchievements.map(a => ({
          id: a.badgeId,
          name: a.badgeName,
          description: a.badgeDescription,
          icon: a.icon,
          rarity: a.rarity,
          unlockedAt: a.unlockedAt,
          isNew: true
        })),
        stats: achievementStats
      },
      unreadAlerts: alerts.length,
      totalIncidents: incidents.length,
    });
  } catch (err) {
    console.error('[Dashboard Error]:', err.message);
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
    const userId = req.user._id;
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

    const quizResults = await QuizResult.find({ user: userId });
    const courseProgress = await Progress.findOne({ user: userId });
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

// ── TEST ONLY: Generate fake user activity data ────────────────────
export const generateTestData = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('[GenerateTestData] Starting for userId:', userId);

    // Delete existing quiz results for this user first
    await QuizResult.deleteMany({ user: userId });
    console.log('[GenerateTestData] Cleared old quiz results');

    // Create test quiz results
    const quizData = [
      { user: userId, moduleId: 1, moduleTitle: "Phishing 101", totalCorrect: 8, totalQuestions: 10, percentage: 80, grade: "A", createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      { user: userId, moduleId: 2, moduleTitle: "Malware Basics", totalCorrect: 7, totalQuestions: 10, percentage: 70, grade: "B", createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
      { user: userId, moduleId: 3, moduleTitle: "Password Security", totalCorrect: 9, totalQuestions: 10, percentage: 90, grade: "A", createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
      { user: userId, moduleId: 4, moduleTitle: "Social Engineering", totalCorrect: 6, totalQuestions: 10, percentage: 60, grade: "C", createdAt: new Date() },
    ];

    const createdQuizzes = await QuizResult.insertMany(quizData);
    console.log('[GenerateTestData] Created', createdQuizzes.length, 'quiz results');

    // Delete existing game progress for this user
    await GameProgress.deleteOne({ userId });
    console.log('[GenerateTestData] Cleared old game progress');

    // Create test game progress
    const gameProgressData = await GameProgress.create({
      userId,
      level1Completed: true,
      level2Completed: true,
      level3Completed: true,
      level1Score: 85,
      level2Score: 90,
      level3Score: 75,
      totalScore: 250,
    });
    console.log('[GenerateTestData] Created game progress:', gameProgressData._id);

    // Update user stats
    const updatedUser = await User.updateOne(
      { _id: userId },
      {
        quizzesDone: 4,
        avgScore: 75,
        coursesCompleted: 3,
        level: 4,
        gamesPlayed: 3,
      }
    );
    console.log('[GenerateTestData] Updated user stats');

    // Regenerate security score
    const quizResults = await QuizResult.find({ user: userId });
    const quizAvg = quizResults.length > 0
      ? Math.round((quizResults.reduce((sum, r) => sum + (r.percentage || 0), 0)) / quizResults.length)
      : 0;

    const updatedScore = {
      quizScore: quizAvg,
      courseProgress: Math.min(3 * 20, 100),
      gameProgress: Math.min(3 * 20, 100),
      toolUsage: Math.min(Math.floor((4 * 10 + 3 * 5) / 2), 100),
    };

    const overall = Math.round(
      (updatedScore.quizScore * 0.3 +
        updatedScore.courseProgress * 0.25 +
        updatedScore.gameProgress * 0.2 +
        updatedScore.toolUsage * 0.25) / 1
    );

    await SecurityScore.updateOne(
      { userId },
      {
        ...updatedScore,
        overallScore: overall,
        lastUpdated: new Date(),
      },
      { upsert: true }
    );
    console.log('[GenerateTestData] Updated security score - Overall:', overall);

    res.json({
      success: true,
      message: "Test data generated successfully!",
      details: {
        quizzesCreated: 4,
        quizScore: quizAvg,
        courseProgress: updatedScore.courseProgress,
        gameProgress: updatedScore.gameProgress,
        toolUsage: updatedScore.toolUsage,
        overallScore: overall,
      },
    });
  } catch (err) {
    console.error('[GenerateTestData] Error:', err.message);
    res.status(500).json({
      success: false,
      message: "Error generating test data",
      error: err.message,
    });
  }
};
