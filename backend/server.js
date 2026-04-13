import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import progressRoutes from './routes/progressRoutes.js';
import levelRoutes from './routes/levelRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import errorHandler from './middleware/errorMiddleware.js';

// ── Load environment variables ──────────────────────────────
dotenv.config();

// ── Connect to MongoDB ──────────────────────────────────────
connectDB();

// ── Express app ─────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5001;

// ── Middleware ───────────────────────────────────────────────
app.use(
  cors({
    origin(origin, cb) {
      // Allow requests with no origin (Postman, curl, mobile apps)
      if (!origin || /^http:\/\/localhost:\d+$/.test(origin)) {
        cb(null, true);
      } else {
        cb(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

// ── Health check ────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'CyberShield Game Backend', uptime: process.uptime() });
});

// ── Route mounting ──────────────────────────────────────────
app.use('/api/progress', progressRoutes);
app.use('/api/level', levelRoutes);
app.use('/api/game', gameRoutes);

// ── 404 handler ─────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// ── Global error handler (must be last) ─────────────────────
app.use(errorHandler);

// ── Start server ────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 CyberShield Game Backend → http://localhost:${PORT}`);
  console.log(`   POST /api/progress/save`);
  console.log(`   GET  /api/progress/:userId`);
  console.log(`   GET  /api/level/:levelId`);
  console.log(`   POST /api/level/update`);
  console.log(`   POST /api/game/save`);
  console.log(`   GET  /api/game/stats/:username`);
});
