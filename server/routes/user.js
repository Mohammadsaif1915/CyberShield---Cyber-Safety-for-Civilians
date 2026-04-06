import express from 'express'
import User    from '../models/User.js'
import jwt     from 'jsonwebtoken'

const router = express.Router()

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1]

  if (!token)
    return res.status(401).json({ message: 'Login karo pehle' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    if (!user)
      return res.status(404).json({ message: 'User nahi mila' })
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

router.put('/me', authMiddleware, async (req, res) => {
  try {
    const { name, email, phone, city, department } = req.body
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, phone, city, department },
      { new: true }
    ).select('-password')
    res.json(updatedUser)
  } catch (err) {
    res.status(500).json({ message: 'Update nahi hua', error: err.message })
  }
})

router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  })
  res.json({ message: 'Logout successful' })
})

export default router