import IncidentReport from '../models/IncidentReport.js';
import Achievement from '../models/Achievement.js';
import Alert from '../models/Alert.js';
import User from '../models/User.js';
import { sendIncidentReportConfirmation, sendIncidentStatusUpdate } from '../services/emailService.js';

// ── Create Incident Report ──────────────────────────────────
export const createIncidentReport = async (req, res) => {
  try {
    const userId = req.user.id;
    // Map frontend field names to backend schema
    const { 
      type: reportType,           // frontend sends 'type'
      subject: title,             // frontend sends 'subject'
      description, 
      evidenceUrl: url,           // frontend sends 'evidenceUrl'
      reporterEmail: email,       // frontend sends 'reporterEmail'
      severity,
      anonymous 
    } = req.body;

    if (!reportType || !title || !description) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Get user data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const report = await IncidentReport.create({
      userId,
      reportType,
      title,
      description,
      url,
      email: anonymous ? null : email,
      severity: severity || 'medium',
      anonymous,
      sendEmailUpdates: !anonymous, // Send updates if not anonymous
    });

    console.log(`[IncidentReport] Created report #${report._id} by user ${userId}`);

    // Send confirmation email if not anonymous
    if (!anonymous && email) {
      try {
        await sendIncidentReportConfirmation(email, user.fullName || user.name || 'User', report);
        console.log(`[IncidentReport] Confirmation email sent to ${email}`);
      } catch (emailErr) {
        console.error(`[IncidentReport] Failed to send email: ${emailErr.message}`);
        // Continue despite email failure
      }
    }

    res.status(201).json({ 
      success: true, 
      message: 'Report submitted successfully', 
      report: {
        _id: report._id,
        reportType: report.reportType,
        title: report.title,
        description: report.description,
        severity: report.severity,
        status: report.status,
        createdAt: report.createdAt,
      } 
    });
  } catch (err) {
    console.error('[IncidentReport] Error creating report:', err.message);
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

// ── Update Incident Report Status ──────────────────────────
export const updateIncidentStatus = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status, notes } = req.body;

    // Validate status
    const validStatuses = ['pending', 'reviewed', 'verified', 'resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    // Get the report
    const report = await IncidentReport.findById(reportId);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    const oldStatus = report.status;

    // Update report
    report.status = status;
    if (notes) report.notes = notes;
    report.lastStatusUpdate = new Date();

    if (status === 'verified') {
      report.isVerified = true;
      report.verifiedAt = new Date();
    } else if (status === 'resolved') {
      report.resolvedAt = new Date();
    }

    await report.save();

    // Send email notification if not anonymous and sendEmailUpdates is true
    if (!report.anonymous && report.sendEmailUpdates && report.email) {
      try {
        const user = await User.findById(report.userId);
        await sendIncidentStatusUpdate(report.email, user?.fullName || user?.name || 'User', report, oldStatus, status);
        console.log(`[IncidentReport] Status update email sent to ${report.email}`);
      } catch (emailErr) {
        console.error(`[IncidentReport] Failed to send status update email: ${emailErr.message}`);
        // Continue despite email failure
      }
    }

    console.log(`[IncidentReport] Report #${reportId} status updated: ${oldStatus} → ${status}`);

    res.json({ 
      success: true, 
      message: 'Report status updated successfully',
      report
    });
  } catch (err) {
    console.error('[IncidentReport] Error updating status:', err.message);
    res.status(500).json({
      success: false,
      message: 'Error updating report status',
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
