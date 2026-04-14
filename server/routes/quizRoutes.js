import express                 from 'express'
import { protect }             from '../middleware/auth.js'
import { getQuiz, submitQuiz } from '../controllers/quizController.js'

const router = express.Router()

router.get('/:courseId',         protect, getQuiz)
router.post('/:courseId/submit', protect, submitQuiz)

export default router