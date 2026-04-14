import express from 'express';
import { QuizProgress, ModuleProgress } from '../models/Quizprogress.js';
import QuizResult from '../models/QuizResult.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Save or update section progress (works with or without auth)
router.post('/progress/section', async (req, res) => {
  try {
    const { userId, moduleId, sectionId, answers, score, timeSpent, completed } = req.body;

    if (!userId || !moduleId || !sectionId) {
      return res.status(400).json({
        success: false,
        message: 'userId, moduleId, and sectionId are required'
      });
    }

    const progress = await QuizProgress.findOneAndUpdate(
      { userId, moduleId, sectionId },
      {
        answers: answers || {},
        score: score || 0,
        totalQuestions: 10,
        completed: completed || false,
        timeSpent: timeSpent || 0,
        completedAt: completed ? new Date() : null
      },
      { upsert: true, new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Section progress saved successfully',
      data: progress
    });
  } catch (error) {
    console.error('Error saving section progress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save section progress',
      error: error.message
    });
  }
});

// Get section progress (works with or without auth)
router.get('/progress/section/:userId/:moduleId/:sectionId', async (req, res) => {
  try {
    const { userId, moduleId, sectionId } = req.params;

    const progress = await QuizProgress.findOne({
      userId,
      moduleId: parseInt(moduleId),
      sectionId: parseInt(sectionId)
    });

    if (!progress) {
      return res.json({
        success: true,
        data: null,
        message: 'No progress found for this section'
      });
    }

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Error fetching section progress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch section progress',
      error: error.message
    });
  }
});

// Get all sections progress for a module (works with or without auth)
router.get('/progress/module/:userId/:moduleId', async (req, res) => {
  try {
    const { userId, moduleId } = req.params;

    const sections = await QuizProgress.find({
      userId,
      moduleId: parseInt(moduleId)
    }).sort({ sectionId: 1 });

    res.json({
      success: true,
      data: sections
    });
  } catch (error) {
    console.error('Error fetching module progress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch module progress',
      error: error.message
    });
  }
});

// Save module completion - tries to link to authenticated user for dashboard
router.post('/progress/module', async (req, res) => {
  try {
    const { userId, moduleId, completedSections, totalScore, timeSpent, completed } = req.body;
    // Try to get authenticated user if available
    const authenticatedUserId = req.user?._id;

    if (!userId || !moduleId) {
      return res.status(400).json({
        success: false,
        message: 'userId and moduleId are required'
      });
    }

    const moduleProgress = await ModuleProgress.findOneAndUpdate(
      { userId, moduleId },
      {
        completedSections: completedSections || [],
        totalScore: totalScore || 0,
        totalQuestions: 40,
        completed: completed || false,
        timeSpent: timeSpent || 0,
        completedAt: completed ? new Date() : null
      },
      { upsert: true, new: true, runValidators: true }
    );

    // ALSO SAVE TO QUIZRESULT FOR DASHBOARD AGGREGATION (if authenticated)
    if (completed && moduleProgress && authenticatedUserId) {
      const percentage = Math.round((totalScore / 40) * 100);
      await QuizResult.create({
        user: authenticatedUserId,
        moduleId: moduleId,
        moduleTitle: `Module ${moduleId}`,
        totalCorrect: totalScore,
        totalQuestions: 40,
        percentage,
        grade: percentage >= 80 ? 'A' : percentage >= 70 ? 'B' : percentage >= 60 ? 'C' : 'F',
        timeSpent: Math.round(timeSpent / 1000) || 0,
      }).catch(err => console.error('[Quiz] Failed to save QuizResult:', err.message));

      console.log('[Quiz] Module completed. QuizProgress User:', userId, '| Authenticated User:', authenticatedUserId, '| Module:', moduleId, '| Score:', totalScore, '| QuizResult saved');
    } else {
      console.log('[Quiz] Module progress saved. User:', userId, '| Completed:', completed, '| Authenticated:', !!authenticatedUserId);
    }

    res.json({
      success: true,
      message: 'Module progress saved successfully',
      data: moduleProgress
    });
  } catch (error) {
    console.error('Error saving module progress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save module progress',
      error: error.message
    });
  }
});

// Get all user progress (all modules) - works with or without auth
router.get('/progress/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const [moduleProgress, sectionProgress] = await Promise.all([
      ModuleProgress.find({ userId }).sort({ moduleId: 1 }),
      QuizProgress.find({ userId }).sort({ moduleId: 1, sectionId: 1 })
    ]);

    res.json({
      success: true,
      data: {
        modules: moduleProgress,
        sections: sectionProgress
      }
    });
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user progress',
      error: error.message
    });
  }
});

// Get user statistics - works with or without auth
router.get('/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const [completedModules, completedSections, totalSections] = await Promise.all([
      ModuleProgress.countDocuments({ userId, completed: true }),
      QuizProgress.countDocuments({ userId, completed: true }),
      QuizProgress.countDocuments({ userId })
    ]);

    const moduleProgress = await ModuleProgress.find({ userId });
    const totalScore = moduleProgress.reduce((sum, mod) => sum + (mod.totalScore || 0), 0);
    const totalQuestions = moduleProgress.reduce((sum, mod) => sum + (mod.totalQuestions || 0), 0);
    const averageScore = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;

    res.json({
      success: true,
      data: {
        completedModules,
        completedSections,
        totalSections,
        totalScore,
        totalQuestions,
        averageScore
      }
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user statistics',
      error: error.message
    });
  }
});

// Delete section progress (for retry)
router.delete('/progress/section/:userId/:moduleId/:sectionId', async (req, res) => {
  try {
    const { userId, moduleId, sectionId } = req.params;

    await QuizProgress.findOneAndDelete({
      userId,
      moduleId: parseInt(moduleId),
      sectionId: parseInt(sectionId)
    });

    res.json({
      success: true,
      message: 'Section progress deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting section progress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete section progress',
      error: error.message
    });
  }
});

// Reset all user progress
router.delete('/progress/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    await Promise.all([
      QuizProgress.deleteMany({ userId }),
      ModuleProgress.deleteMany({ userId })
    ]);

    res.json({
      success: true,
      message: 'All user progress deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user progress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user progress',
      error: error.message
    });
  }
});

export default router;