// ============================================================
// routes/level3Routes.js
// Defines which URL paths map to which controller functions.
// The router is then mounted in server.js under /api/level3
// ============================================================

const express = require('express');
const router = express.Router();

// Import the controller functions
const {
  saveProgress,
  getUserProgress,
  getLeaderboard,
} = require('../controllers/level3Controller');

// ------------------------------------------------------------
// POST /api/level3/save
// Frontend calls this when a game session ends
// ------------------------------------------------------------
router.post('/save', saveProgress);

// ------------------------------------------------------------
// GET /api/level3/leaderboard/top
// NOTE: this route MUST be declared before /:username
// otherwise Express would treat "leaderboard" as a username
// ------------------------------------------------------------
router.get('/leaderboard/top', getLeaderboard);

// ------------------------------------------------------------
// GET /api/level3/:username
// Fetch all saved records for a specific player
// ------------------------------------------------------------
router.get('/:username', getUserProgress);

module.exports = router;
