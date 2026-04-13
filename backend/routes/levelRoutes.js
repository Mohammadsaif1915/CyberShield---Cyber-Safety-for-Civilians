import express from 'express';
import {
  getLevelMetadata,
  updateGameState,
} from '../controllers/levelController.js';

const router = express.Router();

// GET  /api/level/:levelId — Get level metadata
router.get('/:levelId', getLevelMetadata);

// POST /api/level/update — Update game state (trust, risk, zones)
router.post('/update', updateGameState);

export default router;
