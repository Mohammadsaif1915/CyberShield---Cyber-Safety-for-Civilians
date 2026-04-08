import express from 'express';
import { getAllThreats, getThreatById, getThreatStats } from '../controllers/threatController.js';

const router = express.Router();

// Get all threats with optional filtering
router.get('/', getAllThreats);

// Get threat statistics
router.get('/stats', getThreatStats);

// Get single threat by ID
router.get('/:id', getThreatById);

export default router;
