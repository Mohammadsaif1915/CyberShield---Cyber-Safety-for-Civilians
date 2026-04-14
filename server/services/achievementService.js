import Achievement from '../models/Achievement.js';
import User from '../models/User.js';
import QuizResult from '../models/QuizResult.js';
import Progress from '../models/Progress.js';
import GameProgress from '../models/GameProgress.js';
import IncidentReport from '../models/IncidentReport.js';

/**
 * 🏆 ACHIEVEMENT DEFINITIONS
 * All possible badges users can earn
 */
const BADGE_DEFINITIONS = {
  // ─── QUIZ MASTER SERIES ───────────────────────────────────────
  quiz_first_attempt: {
    id: 'quiz_first_attempt',
    name: '🎯 Quiz Starter',
    description: 'Completed your first quiz',
    category: 'quiz',
    rarity: 'common',
    icon: '🎯',
    condition: async (userId) => {
      const count = await QuizResult.countDocuments({ user: userId });
      return count >= 1;
    }
  },

  quiz_five_completed: {
    id: 'quiz_five_completed',
    name: '📚 Quiz Enthusiast',
    description: 'Completed 5 quizzes',
    category: 'quiz',
    rarity: 'uncommon',
    icon: '📚',
    condition: async (userId) => {
      const count = await QuizResult.countDocuments({ user: userId });
      return count >= 5;
    }
  },

  quiz_perfect_score: {
    id: 'quiz_perfect_score',
    name: '⭐ Perfect Scorer',
    description: 'Achieved 100% on a quiz',
    category: 'quiz',
    rarity: 'rare',
    icon: '⭐',
    condition: async (userId) => {
      const score = await QuizResult.findOne({ user: userId, percentage: 100 });
      return !!score;
    }
  },

  quiz_high_average: {
    id: 'quiz_high_average',
    name: '🚀 Quiz Master',
    description: 'Maintained 85%+ average on quizzes',
    category: 'quiz',
    rarity: 'rare',
    icon: '🚀',
    condition: async (userId) => {
      const results = await QuizResult.find({ user: userId });
      if (results.length < 3) return false;
      const avg = results.reduce((sum, r) => sum + (r.percentage || 0), 0) / results.length;
      return avg >= 85;
    }
  },

  quiz_legend: {
    id: 'quiz_legend',
    name: '👑 Quiz Legend',
    description: 'Completed 20 quizzes with 80%+ average',
    category: 'quiz',
    rarity: 'legendary',
    icon: '👑',
    condition: async (userId) => {
      const results = await QuizResult.find({ user: userId });
      if (results.length < 20) return false;
      const avg = results.reduce((sum, r) => sum + (r.percentage || 0), 0) / results.length;
      return avg >= 80;
    }
  },

  // ─── COURSE WARRIOR SERIES ───────────────────────────────────
  course_starter: {
    id: 'course_starter',
    name: '🏫 Course Starter',
    description: 'Started your first course',
    category: 'course',
    rarity: 'common',
    icon: '🏫',
    condition: async (userId) => {
      const count = await Progress.countDocuments({ user: userId });
      return count >= 1;
    }
  },

  course_finisher: {
    id: 'course_finisher',
    name: '🎓 Course Graduate',
    description: 'Completed your first course',
    category: 'course',
    rarity: 'uncommon',
    icon: '🎓',
    condition: async (userId) => {
      const count = await Progress.countDocuments({ user: userId, quizPassed: true });
      return count >= 1;
    }
  },

  course_five_completed: {
    id: 'course_five_completed',
    name: '📖 Scholar',
    description: 'Completed 5 courses',
    category: 'course',
    rarity: 'rare',
    icon: '📖',
    condition: async (userId) => {
      const count = await Progress.countDocuments({ user: userId, quizPassed: true });
      return count >= 5;
    }
  },

  course_master: {
    id: 'course_master',
    name: '🏆 Course Master',
    description: 'Completed 10 courses with mastery',
    category: 'course',
    rarity: 'legendary',
    icon: '🏆',
    condition: async (userId) => {
      const count = await Progress.countDocuments({ user: userId, quizPassed: true });
      return count >= 10;
    }
  },

  // ─── GAME HERO SERIES ──────────────────────────────────────────
  game_first_level: {
    id: 'game_first_level',
    name: '🎮 Game Starter',
    description: 'Completed your first game level',
    category: 'game',
    rarity: 'common',
    icon: '🎮',
    condition: async (userId) => {
      const count = await GameProgress.countDocuments({ userId, levelCompleted: true });
      return count >= 1;
    }
  },

  game_all_levels: {
    id: 'game_all_levels',
    name: '🏅 Level Master',
    description: 'Completed all 5 game levels',
    category: 'game',
    rarity: 'rare',
    icon: '🏅',
    condition: async (userId) => {
      const records = await GameProgress.find({ userId, levelCompleted: true });
      const levelSet = new Set(records.map(r => r.level));
      return levelSet.size >= 5;
    }
  },

  game_perfect_run: {
    id: 'game_perfect_run',
    name: '⚡ Perfect Run',
    description: 'Completed a level without mistakes',
    category: 'game',
    rarity: 'legendary',
    icon: '⚡',
    condition: async (userId) => {
      const record = await GameProgress.findOne({ 
        userId, 
        levelCompleted: true,
        $expr: { $eq: ['$score', '$maxScore'] }
      });
      return !!record;
    }
  },

  game_speedrun: {
    id: 'game_speedrun',
    name: '🚄 Speed Runner',
    description: 'Completed a level in under 2 minutes',
    category: 'game',
    rarity: 'rare',
    icon: '🚄',
    condition: async (userId) => {
      const record = await GameProgress.findOne({
        userId,
        levelCompleted: true,
        timeSpent: { $lt: 120 }
      });
      return !!record;
    }
  },

  // ─── SECURITY HERO SERIES ─────────────────────────────────────
  threat_reporter: {
    id: 'threat_reporter',
    name: '🚨 Threat Reporter',
    description: 'Submitted your first threat report',
    category: 'activity',
    rarity: 'common',
    icon: '🚨',
    condition: async (userId) => {
      const count = await IncidentReport.countDocuments({ userId });
      return count >= 1;
    }
  },

  threat_five_reported: {
    id: 'threat_five_reported',
    name: '🔍 Cyber Guardian',
    description: 'Reported 5 threats to the community',
    category: 'activity',
    rarity: 'uncommon',
    icon: '🔍',
    condition: async (userId) => {
      const count = await IncidentReport.countDocuments({ userId });
      return count >= 5;
    }
  },

  threat_sentinel: {
    id: 'threat_sentinel',
    name: '🛡️ Threat Sentinel',
    description: 'Reported 10 verified threats',
    category: 'activity',
    rarity: 'legendary',
    icon: '🛡️',
    condition: async (userId) => {
      const count = await IncidentReport.countDocuments({ userId, isVerified: true });
      return count >= 10;
    }
  },

  // ─── ALL-AROUNDER SERIES ──────────────────────────────────────
  diversified_learner: {
    id: 'diversified_learner',
    name: '🌟 Well-Rounded',
    description: 'Completed at least 1 quiz, 1 course, and 1 game',
    category: 'activity',
    rarity: 'uncommon',
    icon: '🌟',
    condition: async (userId) => {
      const quizzes = await QuizResult.countDocuments({ user: userId });
      const courses = await Progress.countDocuments({ user: userId });
      const games = await GameProgress.countDocuments({ userId, levelCompleted: true });
      return quizzes >= 1 && courses >= 1 && games >= 1;
    }
  },

  security_expert: {
    id: 'security_expert',
    name: '🎯 Security Expert',
    description: 'Master of all learning paths',
    category: 'activity',
    rarity: 'legendary',
    icon: '🎯',
    condition: async (userId) => {
      const quizzes = await QuizResult.countDocuments({ user: userId });
      const courses = await Progress.countDocuments({ user: userId, quizPassed: true });
      const games = await GameProgress.countDocuments({ userId, levelCompleted: true });
      const reports = await IncidentReport.countDocuments({ userId });
      return quizzes >= 10 && courses >= 5 && games >= 3 && reports >= 3;
    }
  },

  // ─── CONSISTENCY SERIES ────────────────────────────────────────
  daily_warrior: {
    id: 'daily_warrior',
    name: '🔥 Daily Warrior',
    description: 'Maintained a 7-day activity streak',
    category: 'activity',
    rarity: 'rare',
    icon: '🔥',
    condition: async (userId) => {
      return false; // Would need to calculate from activity log
    }
  },

  unstoppable: {
    id: 'unstoppable',
    name: '💪 Unstoppable',
    description: 'Completed 30 learning activities',
    category: 'activity',
    rarity: 'legendary',
    icon: '💪',
    condition: async (userId) => {
      const quizzes = await QuizResult.countDocuments({ user: userId });
      const courses = await Progress.countDocuments({ user: userId });
      const games = await GameProgress.countDocuments({ userId });
      return (quizzes + courses + games) >= 30;
    }
  },

  // ─── ADVANCED LEARNER SERIES ──────────────────────────────
  speed_learner: {
    id: 'speed_learner',
    name: '⚡ Speed Learner',
    description: 'Complete 3 quizzes in one day',
    category: 'quiz',
    rarity: 'uncommon',
    icon: '⚡',
    condition: async (userId) => {
      return false; // Would need activity log per day
    }
  },

  quiz_warrior: {
    id: 'quiz_warrior',
    name: '🗡️ Quiz Warrior',
    description: 'Complete 15 quizzes with 70%+ average',
    category: 'quiz',
    rarity: 'rare',
    icon: '🗡️',
    condition: async (userId) => {
      const results = await QuizResult.find({ user: userId });
      if (results.length < 15) return false;
      const avg = results.reduce((sum, r) => sum + (r.percentage || 0), 0) / results.length;
      return avg >= 70;
    }
  },

  // ─── PHISHING MASTER SERIES ──────────────────────────────
  phishing_detector: {
    id: 'phishing_detector',
    name: '🎣 Phishing Detector',
    description: 'Report 3 phishing emails',
    category: 'activity',
    rarity: 'uncommon',
    icon: '🎣',
    condition: async (userId) => {
      const count = await IncidentReport.countDocuments({ 
        userId,
        reportType: 'phishing'
      });
      return count >= 3;
    }
  },

  malware_fighter: {
    id: 'malware_fighter',
    name: '🦠 Malware Fighter',
    description: 'Report 3 malware threats',
    category: 'activity',
    rarity: 'uncommon',
    icon: '🦠',
    condition: async (userId) => {
      const count = await IncidentReport.countDocuments({ 
        userId,
        reportType: 'malware'
      });
      return count >= 3;
    }
  },

  fraud_fighter: {
    id: 'fraud_fighter',
    name: '🔗 Fraud Fighter',
    description: 'Report 3 fraud-related threats',
    category: 'activity',
    rarity: 'uncommon',
    icon: '🔗',
    condition: async (userId) => {
      const count = await IncidentReport.countDocuments({ 
        userId,
        $or: [
          { reportType: 'fraud_link' },
          { reportType: 'scam_call' }
        ]
      });
      return count >= 3;
    }
  },

  // ─── KNOWLEDGE MASTER SERIES ─────────────────────────────
  security_scholar: {
    id: 'security_scholar',
    name: '📜 Security Scholar',
    description: 'Complete 8 security courses',
    category: 'course',
    rarity: 'rare',
    icon: '📜',
    condition: async (userId) => {
      const count = await Progress.countDocuments({ 
        user: userId, 
        quizPassed: true 
      });
      return count >= 8;
    }
  },

  knowledge_seeker: {
    id: 'knowledge_seeker',
    name: '🧠 Knowledge Seeker',
    description: 'Attempt 25 quizzes across all topics',
    category: 'quiz',
    rarity: 'rare',
    icon: '🧠',
    condition: async (userId) => {
      const count = await QuizResult.countDocuments({ user: userId });
      return count >= 25;
    }
  },

  // ─── GAME MASTER SERIES ──────────────────────────────────
  level_conqueror: {
    id: 'level_conqueror',
    name: '👑 Level Conqueror',
    description: 'Complete all 5 levels with 80%+ score',
    category: 'game',
    rarity: 'legendary',
    icon: '👑',
    condition: async (userId) => {
      const records = await GameProgress.find({ userId, levelCompleted: true });
      if (records.length < 5) return false;
      const allHighScore = records.every(r => {
        const percent = (r.score / r.maxScore) * 100;
        return percent >= 80;
      });
      return allHighScore;
    }
  },

  gamer_elite: {
    id: 'gamer_elite',
    name: '🎯 Gamer Elite',
    description: 'Score 50,000+ points across all games',
    category: 'game',
    rarity: 'rare',
    icon: '🎯',
    condition: async (userId) => {
      const records = await GameProgress.find({ userId });
      const totalScore = records.reduce((sum, r) => sum + (r.score || 0), 0);
      return totalScore >= 50000;
    }
  },

  // ─── COMMUNITY HERO SERIES ───────────────────────────────
  community_champion: {
    id: 'community_champion',
    name: '🌟 Community Champion',
    description: 'Report 20 verified threats to help community',
    category: 'activity',
    rarity: 'legendary',
    icon: '🌟',
    condition: async (userId) => {
      const count = await IncidentReport.countDocuments({ 
        userId,
        isVerified: true 
      });
      return count >= 20;
    }
  },

  watchdog: {
    id: 'watchdog',
    name: '🐕 Watchdog',
    description: 'Stay active and report threats consistently',
    category: 'activity',
    rarity: 'rare',
    icon: '🐕',
    condition: async (userId) => {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      const count = await IncidentReport.countDocuments({ 
        userId,
        createdAt: { $gte: monthAgo }
      });
      return count >= 5;
    }
  },

  // ─── SPECIAL ACHIEVEMENT SERIES ──────────────────────────
  renaissance_learner: {
    id: 'renaissance_learner',
    name: '🎨 Renaissance Learner',
    description: 'Master all categories (Quiz, Course, Game)',
    category: 'activity',
    rarity: 'legendary',
    icon: '🎨',
    condition: async (userId) => {
      const quizzes = await QuizResult.countDocuments({ user: userId });
      const courses = await Progress.countDocuments({ user: userId, quizPassed: true });
      const games = await GameProgress.countDocuments({ userId, levelCompleted: true });
      return quizzes >= 5 && courses >= 3 && games >= 3;
    }
  },

  rising_star: {
    id: 'rising_star',
    name: '⭐ Rising Star',
    description: 'Earn 5 badges in first week of joining',
    category: 'activity',
    rarity: 'rare',
    icon: '⭐',
    condition: async (userId) => {
      const user = await User.findById(userId);
      if (!user || !user.createdAt) return false;
      
      const weekInMs = 7 * 24 * 60 * 60 * 1000;
      const isNewUser = (Date.now() - new Date(user.createdAt).getTime()) < weekInMs;
      
      if (!isNewUser) return false;
      
      const badges = await Achievement.countDocuments({ userId });
      return badges >= 5;
    }
  },

  defender: {
    id: 'defender',
    name: '🛡️ Defender',
    description: 'Report and help verify 15+ threat reports',
    category: 'activity',
    rarity: 'rare',
    icon: '🛡️',
    condition: async (userId) => {
      const count = await IncidentReport.countDocuments({ userId });
      const verified = await IncidentReport.countDocuments({ 
        userId,
        verifiedCount: { $gt: 0 }
      });
      return count >= 15 && verified >= 5;
    }
  }
};

/**
 * Check all achievements and award new ones
 * Returns newly unlocked achievements
 */
export const checkAndAwardAchievements = async (userId) => {
  try {
    const newlyUnlocked = [];

    for (const [key, badgeDefinition] of Object.entries(BADGE_DEFINITIONS)) {
      // Check if user already has this badge
      const existing = await Achievement.findOne({
        userId,
        badgeId: badgeDefinition.id
      });

      if (existing) {
        continue; // Already unlocked
      }

      // Check if condition is met
      const conditionMet = await badgeDefinition.condition(userId);

      if (conditionMet) {
        // Award the badge!
        const achievement = await Achievement.create({
          userId,
          badgeId: badgeDefinition.id,
          badgeName: badgeDefinition.name,
          badgeDescription: badgeDefinition.description,
          icon: badgeDefinition.icon,
          category: badgeDefinition.category,
          rarity: badgeDefinition.rarity,
          unlockedAt: new Date()
        });

        newlyUnlocked.push({
          ...achievement._doc,
          isNew: true
        });

        console.log(`[Achievement] User ${userId} unlocked: ${badgeDefinition.name}`);

        // Update user's badges array
        await User.findByIdAndUpdate(
          userId,
          {
            $push: {
              badges: {
                emoji: badgeDefinition.icon,
                name: badgeDefinition.name,
                description: badgeDefinition.description,
                rareName: badgeDefinition.rarity.toUpperCase(),
                earnedAt: new Date(),
                _id: achievement._id
              }
            }
          },
          { new: true }
        );
      }
    }

    return newlyUnlocked;
  } catch (error) {
    console.error('[Achievement] Error checking achievements:', error.message);
    return [];
  }
};

/**
 * Get all achievements for a user
 */
export const getUserAchievements = async (userId) => {
  try {
    const achievements = await Achievement.find({ userId })
      .sort({ rarity: -1, unlockedAt: -1 });
    return achievements;
  } catch (error) {
    console.error('[Achievement] Error fetching achievements:', error.message);
    return [];
  }
};

/**
 * Get achievement stats/progress
 */
export const getAchievementStats = async (userId) => {
  try {
    const achievements = await Achievement.find({ userId });
    
    const stats = {
      totalUnlocked: achievements.length,
      totalAvailable: Object.keys(BADGE_DEFINITIONS).length,
      byRarity: {
        common: achievements.filter(a => a.rarity === 'common').length,
        uncommon: achievements.filter(a => a.rarity === 'uncommon').length,
        rare: achievements.filter(a => a.rarity === 'rare').length,
        legendary: achievements.filter(a => a.rarity === 'legendary').length
      },
      byCategory: {
        quiz: achievements.filter(a => a.category === 'quiz').length,
        course: achievements.filter(a => a.category === 'course').length,
        game: achievements.filter(a => a.category === 'game').length,
        activity: achievements.filter(a => a.category === 'activity').length
      },
      completionPercent: Math.round((achievements.length / Object.keys(BADGE_DEFINITIONS).length) * 100)
    };

    return stats;
  } catch (error) {
    console.error('[Achievement] Error getting stats:', error.message);
    return null;
  }
};

/**
 * Get next achievements to unlock (progress hints)
 */
export const getNextAchievements = async (userId) => {
  try {
    const unlocked = await Achievement.find({ userId });
    const unlockedIds = new Set(unlocked.map(a => a.badgeId));

    const nextAchievements = [];
    
    for (const [key, badge] of Object.entries(BADGE_DEFINITIONS)) {
      if (!unlockedIds.has(badge.id)) {
        nextAchievements.push({
          id: badge.id,
          name: badge.name,
          description: badge.description,
          icon: badge.icon,
          rarity: badge.rarity,
          category: badge.category
        });
      }
    }

    return nextAchievements.slice(0, 5); // Return next 5 to unlock
  } catch (error) {
    console.error('[Achievement] Error getting next achievements:', error.message);
    return [];
  }
};

export default {
  checkAndAwardAchievements,
  getUserAchievements,
  getAchievementStats,
  getNextAchievements,
  BADGE_DEFINITIONS
};
