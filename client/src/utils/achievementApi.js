// ═══════════════════════════════════════════════════════════════════════════════
// 🎉 ACHIEVEMENT SYSTEM API - FRONTEND UTILITY
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Check for new achievements and get them
 */
export const checkAchievements = async (token) => {
  try {
    const res = await fetch('/api/achievements/check', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error checking achievements:', error);
    return { success: false, newAchievements: [] };
  }
};

/**
 * Get all user achievements
 */
export const getAchievements = async (token) => {
  try {
    const res = await fetch('/api/achievements', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return { success: false, achievements: [] };
  }
};

/**
 * Get achievement statistics
 */
export const getAchievementStats = async (token) => {
  try {
    const res = await fetch('/api/achievements/stats', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching achievement stats:', error);
    return { success: false, stats: null };
  }
};

/**
 * Get next achievements to unlock (helpful hints)
 */
export const getAchievementProgress = async (token) => {
  try {
    const res = await fetch('/api/achievements/progress', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching achievement progress:', error);
    return { success: false, nextAchievements: [] };
  }
};

/**
 * Trigger manual achievement check (for testing or post-action)
 */
export const triggerAchievementCheck = async (token) => {
  try {
    const res = await fetch('/api/achievements/trigger-check', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error triggering achievement check:', error);
    return { success: false, newAchievements: [] };
  }
};

export default {
  checkAchievements,
  getAchievements,
  getAchievementStats,
  getAchievementProgress,
  triggerAchievementCheck
};
