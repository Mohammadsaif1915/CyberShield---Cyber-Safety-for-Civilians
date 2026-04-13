import Progress from '../models/Progress.js';

/**
 * POST /api/progress/save
 * Save or update progress for a specific level.
 * Uses upsert — if a record with the same userId + level
 * already exists it is updated; otherwise a new one is created.
 */
export const saveProgress = async (req, res, next) => {
  try {
    const {
      userId,
      level,
      score,
      status,
      timeTaken,
      trustLevel,
      riskLevel,
      zonesCompleted,
    } = req.body;

    // ── Basic validation ────────────────────────────────────
    if (!userId || typeof userId !== 'string' || !userId.trim()) {
      return res.status(400).json({
        success: false,
        error: 'userId is required and must be a non-empty string',
      });
    }

    const levelNum = Number(level);
    if (!level || isNaN(levelNum) || levelNum < 1 || levelNum > 5) {
      return res.status(400).json({
        success: false,
        error: 'level is required and must be a number between 1 and 5',
      });
    }

    if (status && !['in-progress', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'status must be "in-progress" or "completed"',
      });
    }

    // ── Upsert logic ────────────────────────────────────────
    const filter = { userId: userId.trim(), level: levelNum };

    const update = {
      $set: {
        score: score ?? 0,
        status: status || 'in-progress',
        timeTaken: timeTaken ?? 0,
        trustLevel: trustLevel ?? 0,
        riskLevel: riskLevel ?? 0,
        zonesCompleted: zonesCompleted ?? 0,
      },
    };

    const options = {
      upsert: true,
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    };

    const progress = await Progress.findOneAndUpdate(filter, update, options);

    console.log(
      `✅ Progress saved: ${userId} | Level ${levelNum} | Score ${score ?? 0} | ${status || 'in-progress'}`
    );

    return res.status(200).json({
      success: true,
      message: `Level ${levelNum} progress saved`,
      data: progress,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/progress/:userId
 * Return all progress records for a user, sorted by level ascending.
 */
export const getProgressByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId || !userId.trim()) {
      return res.status(400).json({
        success: false,
        error: 'userId parameter is required',
      });
    }

    const records = await Progress.find({ userId: userId.trim() }).sort({
      level: 1,
    });

    return res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (err) {
    next(err);
  }
};
