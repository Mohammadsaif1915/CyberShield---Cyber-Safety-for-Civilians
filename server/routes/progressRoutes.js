import express                                              from 'express'
import { protect }                                          from '../middleware/auth.js'
import { getProgress, updateVideoProgress, getAllProgress } from '../controllers/progressController.js'

const router = express.Router()

router.get('/all',              protect, getAllProgress)
router.get('/:courseId',        protect, getProgress)
router.post('/:courseId/video', protect, updateVideoProgress)

export default router