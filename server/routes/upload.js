import express       from 'express'
import multer        from 'multer'
import cloudinary    from 'cloudinary'
import User          from '../models/User.js'
import authMiddleware from '../middleware/auth.js'

const router = express.Router()
const { v2: cloudinaryV2 } = cloudinary

cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = multer.memoryStorage()
const upload  = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Sirf JPEG, PNG, WebP, GIF images allowed hain'), false)
    }
  },
})

const uploadToCloudinary = (buffer, folder, publicId) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinaryV2.uploader.upload_stream(
      {
        folder,
        public_id:      publicId,
        overwrite:      true,
        transformation: folder === 'cybershield/avatars'
          ? [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }]
          : [{ width: 1200, height: 300, crop: 'fill' }],
        format: 'webp',
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    )
    stream.end(buffer)
  })
}

router.post(
  '/upload-profile-image',
  authMiddleware,
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file)
        return res.status(400).json({ success: false, message: 'Koi image nahi mili' })

      const type = req.body.type
      if (!['avatar', 'cover'].includes(type))
        return res.status(400).json({ success: false, message: "type 'avatar' ya 'cover' hona chahiye" })

      const userId   = req.user._id || req.user.id
      const folder   = type === 'avatar' ? 'cybershield/avatars' : 'cybershield/covers'
      const publicId = `${userId}_${type}`

      const result   = await uploadToCloudinary(req.file.buffer, folder, publicId)
      const imageUrl = result.secure_url

      const updateField = type === 'avatar' ? { avatar: imageUrl } : { coverImage: imageUrl }
      await User.findByIdAndUpdate(userId, updateField, { new: true })

      return res.status(200).json({
        success: true,
        url:     imageUrl,
        type,
        message: `${type === 'avatar' ? 'Profile photo' : 'Cover image'} update ho gaya!`,
      })
    } catch (error) {
      console.error('Image upload error:', error)
      return res.status(500).json({ success: false, message: 'Image upload failed', error: error.message })
    }
  }
)

router.delete('/upload-profile-image', authMiddleware, async (req, res) => {
  try {
    const { type } = req.query
    if (!['avatar', 'cover'].includes(type))
      return res.status(400).json({ success: false, message: "type 'avatar' ya 'cover' hona chahiye" })

    const userId   = req.user._id || req.user.id
    const publicId = `cybershield/${type === 'avatar' ? 'avatars' : 'covers'}/${userId}_${type}`

    await cloudinaryV2.uploader.destroy(publicId).catch(() => {})

    const clearField = type === 'avatar' ? { avatar: null } : { coverImage: null }
    await User.findByIdAndUpdate(userId, clearField)

    return res.status(200).json({ success: true, message: `${type} image hata diya gaya` })
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
})

export default router