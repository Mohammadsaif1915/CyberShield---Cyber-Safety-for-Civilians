import jwt  from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import User from '../models/User.js'

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'All fields required' })

    if (await User.findOne({ email }))
      return res.status(400).json({ success: false, message: 'Email already registered' })

    const user  = await User.create({ name, email, password })
    const token = signToken(user._id)

    res.status(201).json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required' })

    const user = await User.findOne({ email })
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid credentials' })

    const token = signToken(user._id)
    res.json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    // Calculate streak on backend (date-based, not hour-based)
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastLogin = user.lastLoginDate ? new Date(user.lastLoginDate) : null;
    const lastLoginDate = lastLogin ? new Date(lastLogin.getFullYear(), lastLogin.getMonth(), lastLogin.getDate()) : null;
    
    // Calculate days difference
    const daysDiff = lastLoginDate ? Math.floor((today - lastLoginDate) / (1000 * 60 * 60 * 24)) : 999;
    
    if (daysDiff === 1) {
      // Increment streak (logged in next day)
      user.loginStreak = (user.loginStreak || 0) + 1;
      user.lastLoginDate = now;
      await user.save();
    } else if (daysDiff > 1) {
      // Reset streak (missed a day)
      user.loginStreak = 1;
      user.lastLoginDate = now;
      await user.save();
    }
    // If daysDiff === 0, don't change anything (already logged in today)
    
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { fullName, email, phone, location, role, bio } = req.body
    const userId = req.user._id

    // Build update object
    const updateData = {}
    if (fullName) {
      updateData.fullName = fullName
      updateData.name = fullName // Keep name field in sync
    }
    if (email) updateData.email = email
    if (phone) updateData.phone = phone
    if (location) updateData.location = location
    if (role) updateData.role = role
    if (bio) updateData.bio = bio

    // Handle avatar file upload to Cloudinary
    if (req.file) {
      try {
        const transformation = [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }]
        
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'cybershield/avatars',
              public_id: `${userId}_avatar`,
              overwrite: true,
              transformation,
              format: 'webp'
            },
            (error, result) => {
              if (error) reject(error)
              else resolve(result)
            }
          )
          stream.end(req.file.buffer)
        })

        updateData.avatar = result.secure_url
        console.log(`✅ Avatar uploaded for user ${userId}: ${result.secure_url}`)
      } catch (uploadErr) {
        console.error('Cloudinary upload error:', uploadErr)
        return res.status(500).json({ success: false, message: 'Avatar upload failed', error: uploadErr.message })
      }
    }

    // Update user in database
    const user = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: false })

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    res.json({ success: true, user, message: 'Profile updated successfully' })
  } catch (err) {
    console.error('Profile update error:', err)
    res.status(500).json({ success: false, message: err.message })
  }
}