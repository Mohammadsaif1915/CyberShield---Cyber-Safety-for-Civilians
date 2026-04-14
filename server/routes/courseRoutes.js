import express                                   from 'express'
import { protect }                               from '../middleware/auth.js'
import { getCourses, getCourse, videoWatched, completeCourse } from '../controllers/courseController.js'

const router = express.Router()

router.get('/',              protect, getCourses)
router.get('/:id',           protect, getCourse)
router.post('/:id/video-watched', protect, videoWatched)
router.post('/:id/complete',      protect, completeCourse)

export default router