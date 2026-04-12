import express                   from 'express'
import { protect }               from '../middleware/auth.js'
import { getCourses, getCourse } from '../controllers/courseController.js'

const router = express.Router()

router.get('/',    protect, getCourses)
router.get('/:id', protect, getCourse)

export default router