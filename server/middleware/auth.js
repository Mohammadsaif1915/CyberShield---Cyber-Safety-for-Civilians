// middleware/auth.js  — unified, use this everywhere
import jwt    from 'jsonwebtoken'
import User   from '../models/User.js'
import dotenv from 'dotenv'
dotenv.config()

export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token)
    return res.status(401).json({ success: false, message: 'Not authorized — login required' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Set BOTH so every controller works regardless of which one it uses
    req.userId = decoded.id
    req.user   = await User.findById(decoded.id).select('-password')

    if (!req.user)
      return res.status(401).json({ success: false, message: 'User not found' })

    next()
  } catch {
    return res.status(401).json({ success: false, message: 'Token invalid or expired' })
  }
}