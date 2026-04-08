import IncidentReport from '../models/IncidentReport.js';
import Achievement from '../models/Achievement.js';
import Alert from '../models/Alert.js';

// ── Create Incident Report ──────────────────────────────────
export const createIncidentReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { reportType, title, description, url, email, phoneNumber, severity } = req.body;

    if (!reportType || !title || !description) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const report = await IncidentReport.create({
      userId,
      reportType,
      title,
      description,
      url,
      email,
      phoneNumber,
      severity: severity || 'medium',
    });

    res.status(201).json({ success: true, message: 'Report submitted successfully', report });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error creating incident report',
      error: err.message,
    });
  }
};

// ── Get User's Incident Reports ────────────────────────────
export const getIncidentReports = async (req, res) => {
  try {
    const userId = req.user.id;
    const reports = await IncidentReport.find({ userId }).sort({ createdAt: -1 });

    res.json({ success: true, reports, total: reports.length });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching incident reports',
      error: err.message,
    });
  }
};

// ── Get Recent Threats (for community awareness) ──────────────
export const getRecentThreats = async (req, res) => {
  try {
    const reports = await IncidentReport.find({ isVerified: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('reportType title severity verifiedCount createdAt');

    res.json({ success: true, threats: reports });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching threats',
      error: err.message,
    });
  }
};

// ── Get User Achievements ──────────────────────────────────
export const getAchievements = async (req, res) => {
  try {
    const userId = req.user.id;
    const achievements = await Achievement.find({ userId }).sort({ unlockedAt: -1 });

    res.json({ success: true, achievements, total: achievements.length });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching achievements',
      error: err.message,
    });
  }
};

// ── Unlock Achievement (internal use) ──────────────────────
export const unlockAchievement = async (req, res) => {
  try {
    const userId = req.user.id;
    const { badgeId, badgeName, badgeDescription, icon, category, rarity } = req.body;

    // Check if already unlocked
    const existing = await Achievement.findOne({ userId, badgeId });
    if (existing) {
      return res.status(200).json({ success: false, message: 'Achievement already unlocked' });
    }

    const achievement = await Achievement.create({
      userId,
      badgeId,
      badgeName,
      badgeDescription,
      icon,
      category,
      rarity: rarity || 'common',
    });

    res.status(201).json({ success: true, achievement });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error unlocking achievement',
      error: err.message,
    });
  }
};

// ── Get Alerts ────────────────────────────────────────────
export const getAlerts = async (req, res) => {
  try {
    const userId = req.user.id;
    const alerts = await Alert.find({ userId, expiresAt: { $gt: new Date() } })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      alerts,
      unreadCount: alerts.filter(a => !a.isRead).length,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching alerts',
      error: err.message,
    });
  }
};

// ── Mark Alert as Read ────────────────────────────────────
export const markAlertAsRead = async (req, res) => {
  try {
    const { alertId } = req.params;
    await Alert.updateOne({ _id: alertId }, { isRead: true });

    res.json({ success: true, message: 'Alert marked as read' });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error updating alert',
      error: err.message,
    });
  }
};

// ── Create Alert (internal use) ────────────────────────────
export const createAlert = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, message, type, severity, icon, color } = req.body;

    const alert = await Alert.create({
      userId,
      title,
      message,
      type: type || 'security',
      severity: severity || 'medium',
      icon,
      color,
    });

    res.status(201).json({ success: true, alert });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error creating alert',
      error: err.message,
    });
  }
};
