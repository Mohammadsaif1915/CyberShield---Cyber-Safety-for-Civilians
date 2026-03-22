import express from 'express'
import { getCourses, getCourse } from '../controllers/courseController.js'

const router = express.Router()

router.get('/',    getCourses)
router.get('/:id', getCourse)

export default router