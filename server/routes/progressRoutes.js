import express                                              from 'express'
import { protect }                                          from '../middleware/auth.js'
import { getProgress, updateVideoProgress, getAllProgress } from '../controllers/progressController.js'
import Progress                                             from '../models/Progress.js'

const router = express.Router()

router.get('/all',              protect, getAllProgress)
router.get('/:courseId',        protect, getProgress)
router.post('/:courseId/video', protect, updateVideoProgress)

router.delete('/cleanup-orphans', protect, async (req, res) => {
  const allProgress = await Progress.find({ user: req.user._id }).lean()
  const ids = allProgress.map(p => p._id)
  
  // Populate karke check karo
  const populated = await Progress.find({ user: req.user._id })
    .populate('course')
    .lean()
  
  // Jin ka course null hai unke IDs nikalo
  const orphanIds = populated
    .filter(p => p.course === null)
    .map(p => p._id)
  
  const result = await Progress.deleteMany({ _id: { $in: orphanIds } })
  res.json({ deleted: result.deletedCount, orphanIds })
})

export default router