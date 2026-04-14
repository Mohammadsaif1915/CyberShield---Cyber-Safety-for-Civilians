import {
  checkAndAwardAchievements,
  getUserAchievements,
  getAchievementStats,
  getNextAchievements
} from '../services/achievementService.js';

/**
 * Check and award achievements for current user
 */
export const checkAchievements = async (req, res) => {
  try {
    const userId = req.user._id;
    const newlyUnlocked = await checkAndAwardAchievements(userId);

    res.status(200).json({
      success: true,
      newAchievements: newlyUnlocked,
      message: newlyUnlocked.length > 0 
        ? `🎉 ${newlyUnlocked.length} new ${newlyUnlocked.length === 1 ? 'achievement' : 'achievements'} unlocked!`
        : 'No new achievements yet. Keep learning!'
    });
  } catch (error) {
    console.error('[Achievement] Check error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error checking achievements',
      error: error.message
    });
  }
};

/**
 * Get all achievements for current user
 */
export const getAchievements = async (req, res) => {
  try {
    const userId = req.user._id;
    const achievements = await getUserAchievements(userId);

    res.status(200).json({
      success: true,
      achievements,
      count: achievements.length
    });
  } catch (error) {
    console.error('[Achievement] Fetch error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching achievements',
      error: error.message
    });
  }
};

/**
 * Get achievement statistics for current user
 */
export const getStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const stats = await getAchievementStats(userId);

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('[Achievement] Stats error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching achievement stats',
      error: error.message
    });
  }
};

/**
 * Get next achievements to unlock (progress hints)
 */
export const getProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const nextAchievements = await getNextAchievements(userId);

    res.status(200).json({
      success: true,
      nextAchievements,
      message: 'Here are your next achievements to unlock!'
    });
  } catch (error) {
    console.error('[Achievement] Progress error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching achievement progress',
      error: error.message
    });
  }
};

/**
 * Manually check achievements (for testing or post-activity checks)
 */
export const triggerAchievementCheck = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(`[Achievement] Manual check triggered for user: ${userId}`);
    
    const newlyUnlocked = await checkAndAwardAchievements(userId);

    if (newlyUnlocked.length > 0) {
      res.status(200).json({
        success: true,
        newAchievements: newlyUnlocked,
        celebrateMessage: `🎉 Congratulations! You unlocked ${newlyUnlocked.length} achievement${newlyUnlocked.length === 1 ? '' : 's'}!`,
        badges: newlyUnlocked.map(a => ({
          emoji: a.icon,
          name: a.badgeName,
          description: a.badgeDescription,
          rarity: a.rarity
        }))
      });
    } else {
      res.status(200).json({
        success: true,
        newAchievements: [],
        message: 'Keep up the great work!'
      });
    }
  } catch (error) {
    console.error('[Achievement] Trigger error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error triggering achievement check',
      error: error.message
    });
  }
};

export default {
  checkAchievements,
  getAchievements,
  getStats,
  getProgress,
  triggerAchievementCheck
};
