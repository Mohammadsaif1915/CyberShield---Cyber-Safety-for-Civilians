import express from 'express'
import {
  getProgress,
  updateVideoProgress,
  getAllProgress
} from '../controllers/progressController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// ✅ Sab routes protected — JWT token required
router.get('/all',              protect, getAllProgress)        // user ke saare courses ka progress
router.get('/:courseId',        protect, getProgress)          // ek course ka progress
router.post('/:courseId/video', protect, updateVideoProgress)  // video watch update

export default router