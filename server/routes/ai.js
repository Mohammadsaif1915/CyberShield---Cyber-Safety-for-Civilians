import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

const auth = (req, res, next) => {
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

import { getAIResponse } from '../cybersecurityDataset.js';

router.post('/chat', auth, async (req, res) => {
  try {
    const { message, messages } = req.body;
    let userMessage = "";

    // Determine the user's latest query
    if (messages && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'user') {
        userMessage = lastMessage.content;
      }
    } else if (message) {
      userMessage = message;
    }

    if (!userMessage) {
      return res.status(400).json({ success: false, message: 'Messages are required' });
    }

    // Instantly simulate response using our local dataset logic
    const replyText = getAIResponse(userMessage);

    // Minor simulated delay for UI smoothness (500ms)
    setTimeout(() => {
      return res.json({ 
        reply: replyText,
        reasoning_details: null
      });
    }, 500);

  } catch (err) {
    console.error('AI Local Chat Error:', err);
    return res.status(500).json({ reply: "An error occurred while connecting to the local AI system." });
  }
});

export default router;
