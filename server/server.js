import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';
import Contact from './models/Contact.js';
import Subscriber from './models/Subscriber.js';

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
  resetPasswordToken:   { type: String },
  resetPasswordExpires: { type: Date },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

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

// ── Email Templates ──────────────────────────────────────────

const welcomeEmailHTML = (email) => `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#060c17;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#060c17;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:linear-gradient(145deg,#0d1a2e,#0a1120);border:1px solid rgba(59,130,246,0.25);border-radius:16px;overflow:hidden;max-width:560px;width:100%;">
        <tr>
          <td style="background:linear-gradient(135deg,#1d4ed8,#0ea5e9);padding:30px 40px;text-align:center;">
            <div style="font-size:28px;margin-bottom:6px;">🛡️</div>
            <h1 style="margin:0;color:#fff;font-size:20px;font-weight:800;">CyberShield</h1>
            <p style="color:rgba(255,255,255,0.75);margin:4px 0 0;font-size:12px;">India's Trusted Cyber Safety Platform</p>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px 28px;">
            <h2 style="color:#f1f5f9;font-size:22px;margin:0 0 12px;font-weight:800;">Welcome Aboard! 🎉</h2>
            <p style="color:#94a3b8;font-size:14px;line-height:1.75;margin:0 0 24px;">
              Thank you for subscribing to <strong style="color:#38bdf8;">CyberShield</strong>.
              You are now part of a community dedicated to digital safety and cyber awareness.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(59,130,246,0.07);border:1px solid rgba(59,130,246,0.18);border-radius:12px;margin-bottom:28px;">
              <tr><td style="padding:20px 22px;">
                <p style="margin:0 0 12px;color:#e2e8f0;font-weight:600;font-size:13px;">What you will receive:</p>
                <p style="margin:6px 0;color:#94a3b8;font-size:13px;"><span style="color:#3b82f6;margin-right:8px;">→</span>Weekly cybersecurity tips and best practices</p>
                <p style="margin:6px 0;color:#94a3b8;font-size:13px;"><span style="color:#3b82f6;margin-right:8px;">→</span>Early access to new courses and features</p>
                <p style="margin:6px 0;color:#94a3b8;font-size:13px;"><span style="color:#3b82f6;margin-right:8px;">→</span>Platform updates and community news</p>
                <p style="margin:6px 0;color:#94a3b8;font-size:13px;"><span style="color:#3b82f6;margin-right:8px;">→</span>Exclusive cyber threat alerts</p>
              </td></tr>
            </table>
            <div style="text-align:center;margin-bottom:28px;">
              <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}"
                style="display:inline-block;background:linear-gradient(135deg,#1d4ed8,#0ea5e9);color:#fff;text-decoration:none;padding:13px 32px;border-radius:10px;font-weight:700;font-size:14px;box-shadow:0 4px 14px rgba(37,99,235,0.4);">
                Explore CyberShield →
              </a>
            </div>
            <p style="color:#475569;font-size:12px;margin:0;">
              If you did not subscribe, safely ignore this email.<br/>— The CyberShield Team
            </p>
          </td>
        </tr>
        <tr>
          <td style="border-top:1px solid rgba(59,130,246,0.12);padding:18px 40px;text-align:center;">
            <p style="margin:0;color:#334155;font-size:12px;">© 2026 CyberShield · Mumbai, Maharashtra, India</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

const updateEmailHTML = ({ title, body, ctaText, ctaLink }) => `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#060c17;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#060c17;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:linear-gradient(145deg,#0d1a2e,#0a1120);border:1px solid rgba(59,130,246,0.25);border-radius:16px;overflow:hidden;max-width:560px;width:100%;">
        <tr>
          <td style="background:linear-gradient(135deg,#1d4ed8,#0ea5e9);padding:26px 40px;">
            <h1 style="margin:0;color:#fff;font-size:18px;font-weight:800;">🛡️ CyberShield Update</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:34px 40px 28px;">
            <h2 style="color:#f1f5f9;font-size:20px;margin:0 0 14px;font-weight:800;">${title}</h2>
            <div style="color:#94a3b8;font-size:14px;line-height:1.75;">${body}</div>
            ${ctaText && ctaLink ? `
            <div style="text-align:center;margin-top:28px;">
              <a href="${ctaLink}" style="display:inline-block;background:linear-gradient(135deg,#1d4ed8,#0ea5e9);color:#fff;text-decoration:none;padding:13px 32px;border-radius:10px;font-weight:700;font-size:14px;box-shadow:0 4px 14px rgba(37,99,235,0.4);">
                ${ctaText} →
              </a>
            </div>` : ''}
          </td>
        </tr>
        <tr>
          <td style="border-top:1px solid rgba(59,130,246,0.12);padding:16px 40px;text-align:center;">
            <p style="margin:0;color:#334155;font-size:12px;">© 2026 CyberShield · Mumbai, Maharashtra, India</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

// ── Routes ───────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.post('/api/register', async (req, res) => {
  try {
    const { fullName, email, password, city, role } = req.body;

    const errors = validateRegistration(req.body);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, errors: { email: 'This email is already registered' } });
    }

    const user = await User.create({ fullName, email, password, city, role });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, city: user.city, role: user.role },
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, errors: { submit: 'Something went wrong. Please try again.' } });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

    return res.status(200).json({
      success: true,
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, city: user.city, role: user.role },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/auth/google', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ success: false, message: 'No credential provided' });

    const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      user = await User.create({
        fullName: name, email: email.toLowerCase(),
        password: googleId + process.env.JWT_SECRET,
        city: 'Not specified', role: 'student', googleId,
      });
      console.log(`✅ New Google user created: ${email}`);
    } else {
      if (!user.googleId) { user.googleId = googleId; await user.save({ validateBeforeSave: false }); }
      console.log(`✅ Existing Google user logged in: ${email}`);
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    return res.status(200).json({
      success: true, token,
      user: { id: user._id, fullName: user.fullName, email: user.email, city: user.city, role: user.role },
    });
  } catch (err) {
    console.error('Google auth error:', err);
    return res.status(401).json({ success: false, message: 'Google authentication failed.' });
  }
});

app.get('/api/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.status(200).json({ success: true, user });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(200).json({ success: true, message: 'If this email is registered, a reset link has been sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordToken   = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const resetURL = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: `"CyberShield 🛡️" <${process.env.GMAIL_USER}>`,
      to: user.email,
      subject: 'Password Reset Request — CyberShield',
      html: `
        <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:520px;margin:0 auto;background:#f8fafc;border-radius:16px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#1d4ed8,#2563eb,#38bdf8);padding:32px 40px;text-align:center;">
            <div style="font-size:32px;margin-bottom:8px;">🛡️</div>
            <h1 style="color:white;margin:0;font-size:22px;font-weight:800;">CyberShield</h1>
            <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:13px;">India's Trusted Cyber Safety Platform</p>
          </div>
          <div style="padding:36px 40px;background:white;">
            <h2 style="color:#0f172a;font-size:20px;margin:0 0 12px;">Password Reset Request</h2>
            <p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 24px;">
              Hi <strong>${user.fullName}</strong>,<br><br>
              We received a request to reset your CyberShield password. Click the button below to create a new password.
            </p>
            <div style="text-align:center;margin:28px 0;">
              <a href="${resetURL}" style="display:inline-block;background:linear-gradient(135deg,#1d4ed8,#2563eb);color:white;text-decoration:none;padding:14px 36px;border-radius:12px;font-size:15px;font-weight:700;box-shadow:0 4px 14px rgba(37,99,235,0.4);">
                Reset My Password →
              </a>
            </div>
            <p style="color:#94a3b8;font-size:12px;line-height:1.6;margin:20px 0 0;padding-top:20px;border-top:1px solid #f1f5f9;">
              ⏱️ This link expires in <strong>15 minutes</strong>.<br>
              🔒 If you did not request this, ignore this email.<br><br>
              Having trouble? Copy this link:<br>
              <span style="color:#2563eb;word-break:break-all;">${resetURL}</span>
            </p>
          </div>
          <div style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="color:#94a3b8;font-size:12px;margin:0;">© 2026 CyberShield · India's Cyber Awareness Platform</p>
          </div>
        </div>
      `,
    });

    console.log(`✅ Reset email sent to ${user.email}`);
    return res.status(200).json({ success: true, message: 'Password reset link sent to your email.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ success: false, message: 'Failed to send email. Try again.' });
  }
});

app.post('/api/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 8)
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password))
      return res.status(400).json({ success: false, message: 'Password must contain upper and lowercase letters' });
    if (!/(?=.*\d)/.test(password))
      return res.status(400).json({ success: false, message: 'Password must contain at least one number' });

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({ resetPasswordToken: tokenHash, resetPasswordExpires: { $gt: Date.now() } });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Reset link is invalid or has expired. Please request a new one.' });
    }

    user.password             = password;
    user.resetPasswordToken   = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log(`✅ Password reset successful for ${user.email}`);
    return res.status(200).json({ success: true, message: 'Password reset successful! You can now login.' });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// ══════════════════════════════════════════════════════════════
// ── CONTACT FORM ROUTES ───────────────────────────────────────
// ══════════════════════════════════════════════════════════════

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, category, message } = req.body;
    if (!name || !email || !subject || !category || !message) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }
    const contact = await Contact.create({ name, email, subject, category, message });
    console.log(`✅ New contact form submission from ${email}`);
    res.status(201).json({ success: true, message: 'Your message has been sent successfully!', data: contact });
  } catch (error) {
    console.error('Contact Form Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error. Please try again later.' });
  }
});

app.get('/api/contact', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: contacts.length, data: contacts });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/contact/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
    res.status(200).json({ success: true, data: contact });
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.patch('/api/contact/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const contact = await Contact.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
    res.status(200).json({ success: true, message: 'Status updated successfully', data: contact });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.delete('/api/contact/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
    res.status(200).json({ success: true, message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ══════════════════════════════════════════════════════════════
// ── NEWSLETTER ROUTES ─────────────────────────────────────────
// ══════════════════════════════════════════════════════════════

// POST /api/subscribe — Footer se email subscribe karo
app.post('/api/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email address.' });
    }

    const existing = await Subscriber.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'This email is already subscribed.' });
    }

    await Subscriber.create({ email });

    await transporter.sendMail({
      from: `"CyberShield 🛡️" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "🎉 Welcome to CyberShield — You're In!",
      html: welcomeEmailHTML(email),
    });

    console.log(`✅ New subscriber: ${email}`);
    return res.status(200).json({ message: 'Subscribed successfully!' });

  } catch (err) {
    console.error('Subscribe error:', err);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// POST /api/notify — Sabko update email bhejo (admin use)
// Body: { subject, title, body, ctaText?, ctaLink? }
app.post('/api/notify', async (req, res) => {
  try {
    const { subject, title, body, ctaText, ctaLink } = req.body;

    if (!subject || !title || !body) {
      return res.status(400).json({ message: 'subject, title, and body are required.' });
    }

    const subscribers = await Subscriber.find({ isActive: true });
    if (subscribers.length === 0) {
      return res.json({ message: 'No active subscribers found.' });
    }

    const html = updateEmailHTML({ title, body, ctaText, ctaLink });

    for (const sub of subscribers) {
      await transporter.sendMail({
        from: `"CyberShield 🛡️" <${process.env.GMAIL_USER}>`,
        to: sub.email,
        subject,
        html,
      });
    }

    console.log(`📧 Update sent to ${subscribers.length} subscribers.`);
    return res.json({ message: `Update sent to ${subscribers.length} subscribers.` });

  } catch (err) {
    console.error('Notify error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/subscribers — Saare active subscribers (admin use)
app.get('/api/subscribers', async (req, res) => {
  try {
    const subscribers = await Subscriber.find({ isActive: true }).select('email subscribedAt');
    res.json({ count: subscribers.length, subscribers });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ── Start server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 CyberShield server → http://localhost:${PORT}`);
});