/**
 * server.js
 * ─────────────────────────────────────────────────
 * Entry point for the CyberShield Game backend.
 * Loads environment variables, connects to MongoDB,
 * registers middleware and routes, then starts listening.
 */

// Load .env variables FIRST — before any other imports
require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const mongoose   = require('mongoose');

// Import our Level 1 route file
const level1Routes = require('./routes/level1Routes');

// ── Create Express app ──
const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────
// Allow requests from the frontend (running on a different port / origin)
app.use(cors());

// Parse incoming JSON bodies (replaces body-parser in modern Express)
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Simple request logger (beginner-friendly visibility)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ── Routes ──────────────────────────────────────
// Mount all level-1 routes under /api/level1
app.use('/api/level1', level1Routes);

// Root health-check endpoint
app.get('/', (req, res) => {
  res.json({ message: '⬡ CyberShield API is running!' });
});

// ── 404 Handler ─────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// ── Global Error Handler ─────────────────────────
// Catches any errors passed via next(err)
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// ── Connect to MongoDB, then start server ────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅  MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`🚀  Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌  MongoDB connection failed:', err.message);
    process.exit(1); // Stop the process if DB can't connect
  });
