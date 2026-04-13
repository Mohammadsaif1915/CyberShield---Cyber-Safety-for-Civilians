import Progress from '../models/Progress.js';

/**
 * Level metadata — static for now, can be migrated to DB later.
 */
const LEVEL_METADATA = {
  1: {
    id: 1,
    name: 'Phishing Awareness',
    description: 'Learn to identify phishing emails, suspicious links, and social engineering tactics.',
    maxScore: 100,
    timeLimit: 300,
    zones: 4,
    difficulty: 'Easy',
    theme: 'Email & Messaging Security',
  },
  2: {
    id: 2,
    name: 'Social Media Scam Room',
    description: 'Navigate social media threats including giveaway scams, DM clones, deepfakes, and malicious QR codes.',
    maxScore: 150,
    timeLimit: 360,
    zones: 4,
    difficulty: 'Medium',
    theme: 'Social Media Safety',
  },
  3: {
    id: 3,
    name: 'Password Fortress',
    description: 'Build strong passwords and defend against brute-force attacks, credential stuffing, and keyloggers.',
    maxScore: 120,
    timeLimit: 300,
    zones: 3,
    difficulty: 'Medium',
    theme: 'Password & Authentication Security',
  },
  4: {
    id: 4,
    name: 'Network Defender',
    description: 'Protect a network from man-in-the-middle attacks, rogue access points, and SIM-swap fraud.',
    maxScore: 200,
    timeLimit: 420,
    zones: 5,
    difficulty: 'Hard',
    theme: 'Network & Device Security',
  },
  5: {
    id: 5,
    name: 'Dark Web Infiltration',
    description: 'Infiltrate a simulated dark-web marketplace to identify data breaches and neutralise cyber threats.',
    maxScore: 250,
    timeLimit: 480,
    zones: 6,
    difficulty: 'Expert',
    theme: 'Advanced Threat Intelligence',
  },
};

/**
 * GET /api/level/:levelId
 * Return metadata for a specific level.
 */
export const getLevelMetadata = async (req, res, next) => {
  try {
    const levelId = parseInt(req.params.levelId);

    if (isNaN(levelId) || levelId < 1 || levelId > 5) {
      return res.status(400).json({
        success: false,
        error: 'levelId must be a number between 1 and 5',
      });
    }

    const metadata = LEVEL_METADATA[levelId];

    return res.status(200).json({
      success: true,
      data: metadata,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/level/update
 * Update in-game state (trust, risk, zonesCompleted) for a specific
 * userId + level combination. Creates a new record via upsert if
 * none exists yet.
 */
export const updateGameState = async (req, res, next) => {
  try {
    const { userId, level, trustLevel, riskLevel, zonesCompleted } = req.body;

    // ── Validation ──────────────────────────────────────────
    if (!userId || typeof userId !== 'string' || !userId.trim()) {
      return res.status(400).json({
        success: false,
        error: 'userId is required and must be a non-empty string',
      });
    }

    const levelNum = Number(level);
    if (!level || isNaN(levelNum) || levelNum < 1 || levelNum > 5) {
      return res.status(400).json({
        success: false,
        error: 'level is required and must be a number between 1 and 5',
      });
    }

    if (trustLevel !== undefined && (trustLevel < 0 || trustLevel > 100)) {
      return res.status(400).json({
        success: false,
        error: 'trustLevel must be between 0 and 100',
      });
    }

    if (riskLevel !== undefined && (riskLevel < 0 || riskLevel > 100)) {
      return res.status(400).json({
        success: false,
        error: 'riskLevel must be between 0 and 100',
      });
    }

    // ── Build dynamic $set ──────────────────────────────────
    const setFields = {};
    if (trustLevel !== undefined) setFields.trustLevel = trustLevel;
    if (riskLevel !== undefined) setFields.riskLevel = riskLevel;
    if (zonesCompleted !== undefined) setFields.zonesCompleted = zonesCompleted;

    if (Object.keys(setFields).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one of trustLevel, riskLevel, or zonesCompleted must be provided',
      });
    }

    const filter = { userId: userId.trim(), level: levelNum };
    const options = {
      upsert: true,
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    };

    const updated = await Progress.findOneAndUpdate(
      filter,
      { $set: setFields },
      options
    );

    console.log(
      `✅ Game state updated: ${userId} | Level ${levelNum} | trust=${trustLevel} risk=${riskLevel} zones=${zonesCompleted}`
    );

    return res.status(200).json({
      success: true,
      message: `Level ${levelNum} game state updated`,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};
