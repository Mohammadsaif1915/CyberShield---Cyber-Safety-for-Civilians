import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── Google OAuth Client ──────────────────────────────────────
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || /^http:\/\/localhost:\d+$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());

// ── MongoDB Connection ───────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

// ── User Schema ──────────────────────────────────────────────
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true, minlength: 2 },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8 },
  city:     { type: String, required: true, trim: true },
  role: {
    type: String,
    required: true,
    enum: ['student', 'working_professional', 'senior_citizen'],
  },
  googleId: { type: String },
  // ── Password Reset Fields ──
  resetPasswordToken:   { type: String },
  resetPasswordExpires: { type: Date },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare passwords
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

const User = mongoose.model('User', userSchema);

// ── Nodemailer Setup (Gmail) ─────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// ── Validation ───────────────────────────────────────────────
const validateRegistration = ({ fullName, email, password, city, role }) => {
  const errors = {};

  if (!fullName?.trim())                               errors.fullName = 'Full name is required';
  else if (fullName.trim().length < 2)                 errors.fullName = 'At least 2 characters';
  else if (!/^[a-zA-Z\s]+$/.test(fullName))            errors.fullName = 'Letters only';

  if (!email)                                          errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Invalid email format';

  if (!password)                                       errors.password = 'Password is required';
  else if (password.length < 8)                        errors.password = 'Minimum 8 characters';
  else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password))  errors.password = 'Upper & lowercase required';
  else if (!/(?=.*\d)/.test(password))                 errors.password = 'At least one number';

  if (!city?.trim())                                   errors.city = 'City is required';
  else if (city.trim().length < 2)                     errors.city = 'Enter a valid city';

  const validRoles = ['student', 'working_professional', 'senior_citizen'];
  if (!role)                                           errors.role = 'Please select a role';
  else if (!validRoles.includes(role))                 errors.role = 'Invalid role';

  return errors;
};

// ── Auth Middleware ──────────────────────────────────────────
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Not authorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// ── Routes ───────────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// POST /api/register
app.post('/api/register', async (req, res) => {
  try {
    const { fullName, email, password, city, role } = req.body;

    const errors = validateRegistration(req.body);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({
        success: false,
        errors: { email: 'This email is already registered' },
      });
    }

    const user = await User.create({ fullName, email, password, city, role });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        city: user.city,
        role: user.role,
      },
    });

  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({
      success: false,
      errors: { submit: 'Something went wrong. Please try again.' },
    });
  }
});

// POST /api/login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        city: user.city,
        role: user.role,
      },
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── POST /api/auth/google ────────────────────────────────────
app.post('/api/auth/google', async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ success: false, message: 'No credential provided' });
    }

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    // Check if user already exists
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // New user — create with Google data
      user = await User.create({
        fullName: name,
        email: email.toLowerCase(),
        password: googleId + process.env.JWT_SECRET, // non-usable random password
        city: 'Not specified',
        role: 'student', // default role
        googleId: googleId,
      });
      console.log(`✅ New Google user created: ${email}`);
    } else {
      // Existing user — update googleId if not set
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save({ validateBeforeSave: false });
      }
      console.log(`✅ Existing Google user logged in: ${email}`);
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        city: user.city,
        role: user.role,
      },
    });

  } catch (err) {
    console.error('Google auth error:', err);
    return res.status(401).json({ success: false, message: 'Google authentication failed.' });
  }
});

// GET /api/profile (protected)
app.get('/api/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.status(200).json({ success: true, user });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── POST /api/forgot-password ────────────────────────────────
app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return success (security — don't reveal if email exists)
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If this email is registered, a reset link has been sent.',
      });
    }

    // Generate secure random token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Save hashed token + expiry (15 minutes) to DB
    user.resetPasswordToken   = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save({ validateBeforeSave: false });

    // Reset link for frontend
    const resetURL = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

    // Email HTML template
    const mailOptions = {
      from: `"CyberShield 🛡️" <${process.env.GMAIL_USER}>`,
      to: user.email,
      subject: 'Password Reset Request — CyberShield',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #f8fafc; border-radius: 16px; overflow: hidden;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1d4ed8, #2563eb, #38bdf8); padding: 32px 40px; text-align: center;">
            <div style="font-size: 32px; margin-bottom: 8px;">🛡️</div>
            <h1 style="color: white; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">CyberShield</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0; font-size: 13px;">India's Trusted Cyber Safety Platform</p>
          </div>

          <!-- Body -->
          <div style="padding: 36px 40px; background: white;">
            <h2 style="color: #0f172a; font-size: 20px; margin: 0 0 12px;">Password Reset Request</h2>
            <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
              Hi <strong>${user.fullName}</strong>,<br><br>
              We received a request to reset your CyberShield password. Click the button below to create a new password.
            </p>

            <!-- Button -->
            <div style="text-align: center; margin: 28px 0;">
              <a href="${resetURL}" 
                style="display: inline-block; background: linear-gradient(135deg, #1d4ed8, #2563eb); color: white; text-decoration: none; padding: 14px 36px; border-radius: 12px; font-size: 15px; font-weight: 700; letter-spacing: 0.3px; box-shadow: 0 4px 14px rgba(37,99,235,0.4);">
                Reset My Password →
              </a>
            </div>

            <p style="color: #94a3b8; font-size: 12px; line-height: 1.6; margin: 20px 0 0; padding-top: 20px; border-top: 1px solid #f1f5f9;">
              ⏱️ This link expires in <strong>15 minutes</strong>.<br>
              🔒 If you didn't request this, ignore this email — your password won't change.<br><br>
              Having trouble? Copy this link:<br>
              <span style="color: #2563eb; word-break: break-all;">${resetURL}</span>
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #f8fafc; padding: 20px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
              © 2024 CyberShield · India's Cyber Awareness Platform
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Reset email sent to ${user.email}`);

    return res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email.',
    });

  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ success: false, message: 'Failed to send email. Try again.' });
  }
});

// ── POST /api/reset-password/:token ─────────────────────────
app.post('/api/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
      return res.status(400).json({ success: false, message: 'Password must contain upper and lowercase letters' });
    }
    if (!/(?=.*\d)/.test(password)) {
      return res.status(400).json({ success: false, message: 'Password must contain at least one number' });
    }

    // Hash the incoming token to compare with DB
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid token that hasn't expired
    const user = await User.findOne({
      resetPasswordToken:   tokenHash,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Reset link is invalid or has expired. Please request a new one.',
      });
    }

    // Update password (pre-save hook will hash it)
    user.password             = password;
    user.resetPasswordToken   = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log(`✅ Password reset successful for ${user.email}`);

    return res.status(200).json({
      success: true,
      message: 'Password reset successful! You can now login.',
    });

  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// ── Start server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 CyberShield server → http://localhost:${PORT}`);
});