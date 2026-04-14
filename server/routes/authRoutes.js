import express from 'express'
import multer from 'multer'
import { register, login, getMe, updateProfile } from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// Multer memory storage for avatar uploads
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'), false)
    }
  }
})

router.post('/register', register)
router.post('/login',    login)
router.get('/me',        protect, getMe)
router.put('/profile',   protect, upload.single('avatar'), updateProfile)

export default router