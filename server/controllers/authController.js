import jwt  from 'jsonwebtoken'
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
    const { loginStreak, lastLoginDate, ...otherUpdates } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, otherUpdates, { new: true, runValidators: false });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}