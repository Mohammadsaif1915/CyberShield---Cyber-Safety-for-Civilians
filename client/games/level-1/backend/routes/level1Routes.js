/**
 * routes/level1Routes.js
 * ─────────────────────────────────────────────────
 * Defines the HTTP routes for Level-1 game data.
 * All routes are prefixed with /api/level1 (set in server.js).
 *
 * Available endpoints:
 *  POST  /api/level1/save          — Save a player's level progress
 *  GET   /api/level1/progress      — Fetch all progress (filter by ?username=)
 *  GET   /api/level1/leaderboard   — Top 10 players by best score
 */

const express    = require('express');
const router     = express.Router();

// Import controller functions
const {
  saveLevel1,
  getProgress,
  getLeaderboard
} = require('../controllers/level1Controller');

// ── POST /api/level1/save ──────────────────────────
// Called by the frontend when the player completes (or exits) the level
router.post('/save', saveLevel1);

// ── GET /api/level1/progress ───────────────────────
// Optional: ?username=AgentZero to filter results
router.get('/progress', getProgress);

// ── GET /api/level1/leaderboard ───────────────────
// Top 10 players by highest score
router.get('/leaderboard', getLeaderboard);

module.exports = router;
