// routes/leaderboard.js
import express                from 'express'
import { getLeaderboard }     from '../controllers/leaderboardController.js'
import { protect }            from '../middleware/auth.js'   // your existing JWT middleware

const router = express.Router()

// GET /api/leaderboard?sort=score|xp|quiz|streak
router.get('/', protect, getLeaderboard)

export default router