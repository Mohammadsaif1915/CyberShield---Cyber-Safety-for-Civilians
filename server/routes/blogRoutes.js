import express from 'express';
const router = express.Router();

import Subscriber from '../models/Subscriber.js';
import Blog from '../models/Blog.js';
import { sendWelcomeEmail, sendBlogNotification } from '../services/emailService.js';

// ─────────────────────────────────────────────
// POST /api/subscribe
// ─────────────────────────────────────────────
router.post('/subscribe', async (req, res) => {
  const { email } = req.body;

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
  }

  try {
    const existing = await Subscriber.findOne({ email: email.toLowerCase() });

    if (existing) {
      if (!existing.isActive) {
        existing.isActive = true;
        await existing.save();
        return res.status(200).json({ success: true, message: 'You have been re-subscribed successfully!' });
      }
      return res.status(409).json({ success: false, message: 'This email is already subscribed.' });
    }

    const subscriber = new Subscriber({ email: email.toLowerCase() });
    await subscriber.save();

    // Send email (non-blocking)
    sendWelcomeEmail(email.toLowerCase()).catch(err => {
      console.error('Welcome email error:', err.message);
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you for subscribing! A welcome email has been sent.',
    });

  } catch (err) {
    console.error('Subscribe error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─────────────────────────────────────────────
// POST /api/unsubscribe
// ─────────────────────────────────────────────
router.post('/unsubscribe', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required.' });
  }

  try {
    await Subscriber.findOneAndUpdate(
      { email: email.toLowerCase() },
      { isActive: false }
    );

    return res.status(200).json({ success: true, message: 'You have been unsubscribed.' });

  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─────────────────────────────────────────────
// GET /api/blogs
// ─────────────────────────────────────────────
router.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: blogs });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─────────────────────────────────────────────
// GET /api/blogs/:id
// ─────────────────────────────────────────────
router.get('/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found.' });
    }

    return res.status(200).json({ success: true, data: blog });

  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─────────────────────────────────────────────
// POST /api/blogs
// ─────────────────────────────────────────────
router.post('/blogs', async (req, res) => {
  const { title, excerpt, content, category, author, image, tags, readTime } = req.body;

  if (!title || !excerpt || !category || !author) {
    return res.status(400).json({
      success: false,
      message: 'title, excerpt, category, and author are required.',
    });
  }

  try {
    const blog = new Blog({ title, excerpt, content, category, author, image, tags, readTime });
    await blog.save();

    // Notify subscribers (non-blocking)
    Subscriber.find({ isActive: true })
      .then(subscribers => {
        if (subscribers.length > 0) {
          return sendBlogNotification(subscribers, blog);
        }
      })
      .then(() => {
        Blog.findByIdAndUpdate(blog._id, { notificationSent: true }).exec();
      })
      .catch(err => {
        console.error('Notification error:', err.message);
      });

    return res.status(201).json({
      success: true,
      message: 'Blog created & notifications triggered!',
      data: blog,
    });

  } catch (err) {
    console.error('Create blog error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─────────────────────────────────────────────
// GET /api/subscribers
// ─────────────────────────────────────────────
router.get('/subscribers', async (req, res) => {
  try {
    const subscribers = await Subscriber.find({ isActive: true })
      .select('email subscribedAt');

    return res.status(200).json({
      success: true,
      count: subscribers.length,
      data: subscribers,
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

export default router;