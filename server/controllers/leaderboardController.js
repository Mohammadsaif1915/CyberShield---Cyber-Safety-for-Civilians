// controllers/leaderboardController.js
import User from '../models/User.js'

/**
 * GET /api/leaderboard?sort=score|xp|quiz|streak
 * Returns top 50 users sorted by the requested field.
 * Excludes the calling user's password and sensitive fields.
 */
export const getLeaderboard = async (req, res) => {
  try {
    const sortParam = req.query.sort || 'score'

    // Map frontend tab id → MongoDB field name
    const sortFieldMap = {
      score:  'score',
      xp:     'xp',
      quiz:   'quizzesDone',
      streak: 'loginStreak',
    }
    const sortField = sortFieldMap[sortParam] || 'score'

    const users = await User.find({})
      .select(
        '_id fullName name username email avatar score xp level quizzesDone loginStreak role'
      )
      .sort({ [sortField]: -1 })
      .limit(50)
      .lean()

    const board = users.map((u, i) => ({
      rank:        i + 1,
      userId:      u._id.toString(),
      name:        u.fullName || u.name || u.username || u.email?.split('@')[0] || 'Anonymous',
      email:       u.email,
      avatar:      u.avatar || null,
      role:        u.role || 'Learner',
      level:       u.level ?? 1,
      score:       u.score ?? 0,
      xp:          u.xp ?? 0,
      quizzesDone: u.quizzesDone ?? 0,
      loginStreak: u.loginStreak ?? 0,
    }))

    res.json(board)
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
  
}