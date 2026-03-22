import express from 'express'
import { getQuiz, submitQuiz } from '../controllers/quizController.js'

const router = express.Router()

router.get('/:courseId',         getQuiz)
router.post('/:courseId/submit', submitQuiz)

export default router