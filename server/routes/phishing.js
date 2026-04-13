import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

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

// GET /api/phishing/emails — return phishing simulation emails
router.get('/emails', protect, async (req, res) => {
  try {
    // Static emails — replace with DB model if you have one
    const emails = [
      {
        _id: 'ph1',
        from: 'PayPal Security',
        email: 'security@paypa1.com',
        subject: 'Your account has been limited!',
        body: 'Dear Customer,\n\nWe have detected unusual activity in your account.\nClick below immediately to verify your identity or your account will be suspended.\n\nhttp://paypa1-secure-login.com/verify?token=abc123\n\nPayPal Security Team',
        isPhishing: true,
        clues: [
          'Sender domain is "paypa1.com" (number 1 instead of letter l)',
          'Creates urgency with threat of account suspension',
          'Link goes to suspicious third-party domain',
          'Generic greeting "Dear Customer" instead of your name',
        ],
      },
      {
        _id: 'ph2',
        from: 'Google',
        email: 'no-reply@google.com',
        subject: 'Your Google Account: new sign-in on Windows',
        body: 'Hi,\n\nA new sign-in to your Google Account was detected.\n\nIf this was you, no action needed.\nIf not, visit myaccount.google.com to secure your account.\n\nThe Google Team',
        isPhishing: false,
        clues: [
          'Sender domain is the real google.com',
          'No urgent threats or suspicious links',
          'Directs you to official myaccount.google.com',
          'Does not ask for password or personal info',
        ],
      },
      {
        _id: 'ph3',
        from: 'SBI Bank Alert',
        email: 'alerts@sbi-secure-verify.net',
        subject: 'URGENT: Your SBI account will be blocked in 24 hours',
        body: 'Dear Valued Customer,\n\nYour SBI account has been flagged for suspicious activity.\nYou MUST verify your details within 24 hours to avoid permanent block.\n\nClick here: http://sbi-secure-verify.net/login\n\nEnter your: Account number, ATM PIN, OTP\n\nSBI Customer Care',
        isPhishing: true,
        clues: [
          'Real banks NEVER ask for ATM PIN or OTP via email',
          'Domain "sbi-secure-verify.net" is not the official sbi.co.in',
          'Extreme urgency — "24 hours" pressure tactic',
          'Asks for highly sensitive information',
        ],
      },
      {
        _id: 'ph4',
        from: 'GitHub',
        email: 'noreply@github.com',
        subject: '[GitHub] Please verify your email address',
        body: 'Hey there,\n\nPlease verify your email address by visiting:\nhttps://github.com/users/email_verifications/abc123\n\nThis link will expire in 24 hours.\n\nIf you did not create a GitHub account, please ignore this email.\n\nThanks,\nThe GitHub Team',
        isPhishing: false,
        clues: [
          'Sender is the real noreply@github.com',
          'Link goes directly to github.com — the official domain',
          'No pressure tactics or threats',
          'Tells you to ignore if unexpected — normal behaviour',
        ],
      },
      {
        _id: 'ph5',
        from: 'Amazon',
        email: 'order-update@amazon-india-support.com',
        subject: 'Your order has been cancelled — Action required',
        body: 'Dear Amazon Customer,\n\nYour recent order #402-8821934 has been cancelled due to a payment issue.\nTo reinstate your order and avoid losing your items, update your payment info now:\n\nhttp://amazon-india-support.com/payment/update\n\nAmazon Customer Service',
        isPhishing: true,
        clues: [
          'Domain is "amazon-india-support.com" — not amazon.in or amazon.com',
          'Creates false urgency about losing your order',
          'Link goes to non-Amazon domain',
          'Real Amazon emails come from @amazon.com or @amazon.in',
        ],
      },
    ];
    res.json(emails);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/phishing/result — save phishing sim result
router.post('/result', protect, async (req, res) => {
  try {
    const { correct } = req.body;
    await User.findByIdAndUpdate(req.userId, {
      $inc: {
        phishingSimTotal: 1,
        phishingSimCorrect: correct ? 1 : 0,
      },
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;