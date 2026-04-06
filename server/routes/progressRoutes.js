import express from 'express'
import { getProgress, updateVideoProgress, getAllProgress } from '../controllers/progressController.js'

const router = express.Router()

// ── Guard middleware: reject "null" / invalid IDs immediately ──
const validateCourseId = (req, res, next) => {
  const { courseId } = req.params
  if (!courseId || courseId === 'null' || courseId === 'undefined') {
    return res.status(400).json({ success: false, message: 'Invalid course ID' })
  }
  next()
}

router.get('/all',              getAllProgress)
router.get('/:courseId',        validateCourseId, getProgress)
router.post('/:courseId/video', validateCourseId, updateVideoProgress)

export default router