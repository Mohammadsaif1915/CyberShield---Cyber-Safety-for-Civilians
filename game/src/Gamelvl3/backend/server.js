// ============================================================
// server.js — Main entry point for the Express backend
// Run with:  node server.js   OR   npm run dev  (with nodemon)
// ============================================================

// Load environment variables from .env into process.env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import the Level 3 routes
const level3Routes = require('./routes/level3Routes');

// Create the Express app
const app = express();

// ============================================================
// MIDDLEWARE
// ============================================================

// CORS — allows the frontend (different origin/port) to call this API
// In production, replace the wildcard with your actual frontend URL
app.use(cors({
  origin: '*',              // Allow all origins (change in production)
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// Parse incoming JSON request bodies
// Without this, req.body would be undefined
app.use(express.json());

// ============================================================
// ROUTES
// ============================================================

// Health-check route — visit http://localhost:5000/api/health
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Ransomware Level 3 API is running!',
    gameMode: process.env.GAME_MODE || 'unknown',
    timestamp: new Date().toISOString(),
  });
});

// Mount Level 3 routes under /api/level3
app.use('/api/level3', level3Routes);

// 404 fallback for any unknown route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ============================================================
// DATABASE CONNECTION + SERVER START
// ============================================================

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ransomware_game';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    // Only start the server after DB is connected
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🎮 Game Mode: ${process.env.GAME_MODE || 'not set'}`);
      console.log(`📡 API base: http://localhost:${PORT}/api`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); // Exit if we can't connect to the database
  });
