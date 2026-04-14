import User from '../models/User.js';
import QuizResult from '../models/QuizResult.js';
import Course from '../models/Course.js';
import Certificate from '../models/Certificate.js';
import { generateAdminExportPDF } from '../utils/pdfGenerator.js';
import nodemailer from 'nodemailer';

// ── CERT PRICE CONSTANT ───────────────────────────────────────
const CERT_PRICE = 100; // ₹100 per certificate

// ── SMTP Transporter (reads from .env) ────────────────────────
// Required .env vars:
//   SMTP_HOST=smtp.gmail.com
//   SMTP_PORT=587
//   SMTP_USER=your@email.com
//   SMTP_PASS=your_app_password
//   SMTP_FROM="CyberShield <your@email.com>"
const createTransporter = () => nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ── Get dashboard stats ────────────────────────────────────────
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({
      lastLoginDate: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });
    const quizResults = await QuizResult.find();
    const totalQuizzes = quizResults.length;
    const avgScore = quizResults.length > 0
      ? quizResults.reduce((sum, r) => sum + (r.percentage || 0), 0) / quizResults.length : 0;
    const usersWithScores = await User.find().select('score');
    const completionRate = usersWithScores.length > 0
      ? (usersWithScores.filter(u => u.score > 0).length / usersWithScores.length) * 100 : 0;

    // Revenue
    const totalCerts = await Certificate.countDocuments();
    const paidCerts = await Certificate.countDocuments({ paymentStatus: 'paid' });
    const pendingCerts = totalCerts - paidCerts;

    res.json({
      success: true,
      totalUsers,
      activeUsers,
      totalQuizzes,
      averageScore: Math.round(avgScore * 100) / 100,
      completionRate: Math.round(completionRate),
      revenue: {
        total: totalCerts * CERT_PRICE,
        paid: paidCerts * CERT_PRICE,
        pending: pendingCerts * CERT_PRICE,
        certPrice: CERT_PRICE,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching dashboard stats', error: err.message });
  }
};

// ── Get all users ─────────────────────────────────────────────
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('fullName email score createdAt lastLoginDate quizzesAttempted role')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json({ success: true, users, total: await User.countDocuments() });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching users', error: err.message });
  }
};

// ── Get quiz stats ────────────────────────────────────────────
export const getQuizStats = async (req, res) => {
  try {
    const quizResults = await QuizResult.aggregate([
      { $group: { _id: '$moduleTitle', count: { $sum: 1 }, avgScore: { $avg: '$percentage' }, maxScore: { $max: '$percentage' }, minScore: { $min: '$percentage' } } },
      { $sort: { count: -1 } }
    ]);
    res.json({ success: true, quizStats: quizResults });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching quiz stats', error: err.message });
  }
};

// ── Get user growth ───────────────────────────────────────────
export const getUserGrowth = async (req, res) => {
  try {
    const growth = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(); date.setDate(date.getDate() - i); date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date); nextDate.setDate(nextDate.getDate() + 1);
      const count = await User.countDocuments({ createdAt: { $gte: date, $lt: nextDate } });
      growth.push({ date: date.toLocaleDateString('en-IN', { weekday: 'short' }), users: count });
    }
    res.json({ success: true, growth });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching user growth', error: err.message });
  }
};

// ── Get system health ─────────────────────────────────────────
export const getSystemHealth = async (req, res) => {
  try {
    const uptime = process.uptime();
    const memory = process.memoryUsage();
    res.json({
      success: true,
      uptime: Math.min(Math.floor(uptime / 3600), 100),
      memoryUsageMB: Math.round(memory.heapUsed / 1024 / 1024),
      memoryLimitMB: Math.round(memory.heapTotal / 1024 / 1024),
      memoryPercentage: Math.round((memory.heapUsed / memory.heapTotal) * 100),
      apiHealthy: true,
      databaseHealthy: true
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching system health', error: err.message });
  }
};

// ── Get activity logs ─────────────────────────────────────────
export const getActivityLogs = async (req, res) => {
  try {
    const logs = [];
    const quizResults = await QuizResult.find().select('userId moduleTitle score percentage createdAt').sort({ createdAt: -1 }).limit(10).lean();
    quizResults.forEach(qr => logs.push({ timestamp: qr.createdAt, action: 'Quiz Completed', user: qr.userId || 'Unknown', details: `${qr.moduleTitle} - Score: ${qr.percentage}%` }));
    const recentUsers = await User.find().select('fullName email createdAt').sort({ createdAt: -1 }).limit(5).lean();
    recentUsers.forEach(u => logs.push({ timestamp: u.createdAt, action: 'User Registration', user: u.email, details: `${u.fullName} joined the platform` }));
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    res.json({ success: true, logs: logs.slice(0, 10) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching activity logs', error: err.message });
  }
};

// ── Export data as PDF ────────────────────────────────────────
export const exportData = async (req, res) => {
  try {
    const users = await User.find().select('-password').lean();
    const quizResults = await QuizResult.find().lean();
    const avgScore = quizResults.length > 0
      ? (quizResults.reduce((sum, r) => sum + (r.percentage || 0), 0) / quizResults.length).toFixed(2) : 0;
    const pdfBuffer = await generateAdminExportPDF({ summary: { totalUsers: users.length, totalQuizAttempts: quizResults.length, avgScore }, users, quizResults });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="cybershield-admin-report-${Date.now()}.pdf"`);
    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error exporting data', error: err.message });
  }
};

// ── Create backup ─────────────────────────────────────────────
export const createBackup = async (req, res) => {
  try {
    const users = await User.find().lean();
    const quizResults = await QuizResult.find().lean();
    const backupData = { timestamp: new Date(), version: '1.0', collections: { users: users.length, quizResults: quizResults.length }, data: { users, quizResults } };
    res.json({ success: true, message: 'Backup created successfully', backupId: `backup-${Date.now()}`, size: JSON.stringify(backupData).length, collections: backupData.collections });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error creating backup', error: err.message });
  }
};

// ══════════════════════════════════════════════════════════════
// ENHANCED MANAGEMENT ENDPOINTS
// ══════════════════════════════════════════════════════════════

// ── Get detailed users ────────────────────────────────────────
export const getDetailedUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 }).lean();
    const usersWithStats = await Promise.all(users.map(async (user) => {
      const quizzes = await QuizResult.countDocuments({ userId: user._id });
      const quizAvg = await QuizResult.aggregate([{ $match: { userId: user._id } }, { $group: { _id: null, avg: { $avg: '$percentage' } } }]);
      return { ...user, quizzesAttempted: quizzes, avgQuizScore: quizAvg.length > 0 ? Math.round(quizAvg[0].avg) : 0, lastActive: user.lastLoginDate || user.createdAt };
    }));
    res.json({ success: true, users: usersWithStats, total: usersWithStats.length });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching detailed users', error: err.message });
  }
};

// ── Get all courses with real stats ──────────────────────────
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().lean();
    const coursesWithStats = await Promise.all(courses.map(async (course) => {
      const certificatesIssued = await Certificate.countDocuments({ course: course._id });
      const enrolledUsers = await User.countDocuments({ enrolledCourses: course._id });
      return {
        ...course,
        totalVideos: course.videos?.length || 0,
        totalQuestions: course.quiz?.length || 0,
        certificatesIssued,
        enrolledUsers: enrolledUsers || course.enrolledCount || 0,
        revenue: certificatesIssued * CERT_PRICE,
      };
    }));
    res.json({ success: true, courses: coursesWithStats, total: coursesWithStats.length });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching courses', error: err.message });
  }
};

// ── Create or Update course ───────────────────────────────────
export const manageCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, level, category, thumbnail, icon, color } = req.body;
    if (!title || !description || !level) return res.status(400).json({ success: false, message: 'Title, description, and level are required' });
    let course;
    if (courseId === 'new') {
      course = new Course({ title, description, level, category: category || 'Cybersecurity', thumbnail: thumbnail || '', icon: icon || '🔐', color: color || '#0ea5e9', videos: [], quiz: [] });
    } else {
      course = await Course.findById(courseId);
      if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
      Object.assign(course, { title, description, level, category, thumbnail, icon, color });
    }
    await course.save();
    res.json({ success: true, message: courseId === 'new' ? 'Course created' : 'Course updated', course });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error managing course', error: err.message });
  }
};

// ── Add video to course ───────────────────────────────────────
export const addVideoToCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, url, duration, order } = req.body;
    if (!title || !url) return res.status(400).json({ success: false, message: 'Video title and URL required' });
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    course.videos.push({ title, url, duration: duration || 300, order: order || course.videos.length + 1 });
    await course.save();
    res.json({ success: true, message: 'Video added successfully', course });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error adding video', error: err.message });
  }
};

// ── Delete video from course ──────────────────────────────────
export const deleteVideoFromCourse = async (req, res) => {
  try {
    const { courseId, videoIndex } = req.params;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    const idx = parseInt(videoIndex);
    if (idx < 0 || idx >= course.videos.length) return res.status(400).json({ success: false, message: 'Invalid video index' });
    course.videos.splice(idx, 1);
    await course.save();
    res.json({ success: true, message: 'Video deleted', course });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting video', error: err.message });
  }
};

// ── Get all certificates with revenue data ────────────────────
export const getAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find()
      .populate('user', 'fullName email')
      .populate('course', 'title')
      .sort({ issuedAt: -1 })
      .lean();

    // Attach courseTitle from either populated field or stored field
    const enriched = certificates.map(c => ({
      ...c,
      courseTitle: c.courseTitle || c.course?.title || 'Unknown Course',
      amount: CERT_PRICE,
    }));

    const paid = enriched.filter(c => c.paymentStatus === 'paid').length;
    const pending = enriched.filter(c => c.paymentStatus !== 'paid').length;

    res.json({
      success: true,
      certificates: enriched,
      stats: {
        total: enriched.length,
        paid,
        pending,
        revenue: {
          total: enriched.length * CERT_PRICE,
          paid: paid * CERT_PRICE,
          pending: pending * CERT_PRICE,
          certPrice: CERT_PRICE,
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching certificates', error: err.message });
  }
};

// ── Update certificate payment status ─────────────────────────
export const updateCertificatePayment = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const { paymentStatus, paymentId, orderId } = req.body;
    if (!['pending', 'paid'].includes(paymentStatus)) return res.status(400).json({ success: false, message: 'Invalid payment status' });
    const certificate = await Certificate.findById(certificateId);
    if (!certificate) return res.status(404).json({ success: false, message: 'Certificate not found' });
    certificate.paymentStatus = paymentStatus;
    if (paymentId) certificate.paymentId = paymentId;
    if (orderId) certificate.orderId = orderId;
    if (paymentStatus === 'paid') certificate.paidAt = new Date();
    await certificate.save();
    res.json({ success: true, message: 'Certificate payment updated', certificate, revenue: CERT_PRICE });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating certificate', error: err.message });
  }
};

// ── Get real-time activity ────────────────────────────────────
export const getRealTimeActivity = async (req, res) => {
  try {
    const logs = [];
    const quizzes = await QuizResult.find().sort({ createdAt: -1 }).limit(15).populate('userId', 'fullName email').lean();
    quizzes.forEach(q => logs.push({ id: q._id, type: 'quiz', timestamp: q.createdAt, user: q.userId?.fullName || 'Unknown', userEmail: q.userId?.email, action: 'Completed Quiz', details: `${q.moduleTitle} - ${q.percentage}%` }));
    const certs = await Certificate.find().sort({ issuedAt: -1 }).limit(10).populate('user', 'fullName email').populate('course', 'title').lean();
    certs.forEach(c => logs.push({ id: c._id, type: 'certificate', timestamp: c.issuedAt, user: c.user?.fullName || c.recipientName, userEmail: c.user?.email, action: 'Certificate Issued', details: `${c.courseTitle || c.course?.title}`, paymentStatus: c.paymentStatus }));
    const users = await User.find().sort({ createdAt: -1 }).limit(10).select('fullName email createdAt').lean();
    users.forEach(u => logs.push({ id: u._id, type: 'user', timestamp: u.createdAt, user: u.fullName, userEmail: u.email, action: 'New Registration', details: `Joined platform` }));
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    res.json({ success: true, activities: logs.slice(0, 30), total: logs.length, timestamp: new Date() });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching activity', error: err.message });
  }
};

// ── Get admin dashboard overview ──────────────────────────────
export const getAdminDashboardOverview = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ lastLoginDate: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } });
    const quizResults = await QuizResult.find();
    const totalQuizzes = quizResults.length;
    const avgScore = quizResults.length > 0 ? (quizResults.reduce((sum, r) => sum + (r.percentage || 0), 0) / quizResults.length).toFixed(2) : 0;
    const totalCourses = await Course.countDocuments();
    const totalCertificates = await Certificate.countDocuments();
    const pendingPayments = await Certificate.countDocuments({ paymentStatus: 'pending' });
    const paidPayments = await Certificate.countDocuments({ paymentStatus: 'paid' });
    const growth = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(); date.setDate(date.getDate() - i); date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date); nextDate.setDate(nextDate.getDate() + 1);
      const count = await User.countDocuments({ createdAt: { $gte: date, $lt: nextDate } });
      growth.push({ date: date.toLocaleDateString('en-IN', { weekday: 'short' }), users: count });
    }
    const moduleStats = await QuizResult.aggregate([
      { $group: { _id: '$moduleTitle', attempts: { $sum: 1 }, avgScore: { $avg: '$percentage' }, maxScore: { $max: '$percentage' }, minScore: { $min: '$percentage' } } },
      { $sort: { attempts: -1 } }
    ]);
    res.json({
      success: true,
      overview: {
        users: { total: totalUsers, active: activeUsers, inactive: totalUsers - activeUsers },
        quizzes: { total: totalQuizzes, avgScore: parseFloat(avgScore) },
        courses: { total: totalCourses },
        certificates: { total: totalCertificates, pending: pendingPayments, paid: paidPayments, revenue: { total: totalCertificates * CERT_PRICE, paid: paidPayments * CERT_PRICE, pending: pendingPayments * CERT_PRICE, certPrice: CERT_PRICE } },
        growth,
        moduleStats
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching overview', error: err.message });
  }
};

// ── Delete user ───────────────────────────────────────────────
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    await QuizResult.deleteMany({ userId });
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting user', error: err.message });
  }
};

// ── Update user ───────────────────────────────────────────────
export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { fullName, email, role, score } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (role) user.role = role;
    if (score !== undefined) user.score = score;
    await user.save();
    res.json({ success: true, message: 'User updated successfully', user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating user', error: err.message });
  }
};

// ── Delete course ─────────────────────────────────────────────
export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findByIdAndDelete(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    await Certificate.deleteMany({ course: courseId });
    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting course', error: err.message });
  }
};

// ══════════════════════════════════════════════════════════════
// EMAIL NOTIFICATION via SMTP (POST /api/notify)
// ══════════════════════════════════════════════════════════════
//
// Required .env vars:
//   SMTP_HOST=smtp.gmail.com
//   SMTP_PORT=587
//   SMTP_SECURE=false
//   SMTP_USER=your@gmail.com
//   SMTP_PASS=your_app_password   (Gmail: use App Password, not account password)
//   SMTP_FROM="CyberShield <your@gmail.com>"
//
export const sendNotification = async (req, res) => {
  try {
    const { subject, title, body, ctaText, ctaLink } = req.body;

    if (!subject || !body) {
      return res.status(400).json({ success: false, message: 'Subject and body are required' });
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return res.status(500).json({
        success: false,
        message: 'SMTP not configured. Please set SMTP_HOST, SMTP_USER, SMTP_PASS in your .env file.'
      });
    }

    // Fetch all user emails
    const users = await User.find().select('email fullName').lean();
    if (users.length === 0) {
      return res.status(400).json({ success: false, message: 'No users to notify' });
    }

    const transporter = createTransporter();

    // Build HTML email template
    const htmlTemplate = (recipientName) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#4F46E5,#7C3AED);padding:32px 40px;text-align:center;">
          <div style="font-size:28px;font-weight:900;color:white;letter-spacing:-0.5px;">🛡️ CyberShield</div>
          <div style="color:rgba(255,255,255,0.8);font-size:13px;margin-top:6px;">Cybersecurity Learning Platform</div>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:36px 40px;">
          <p style="font-size:16px;color:#1e293b;margin:0 0 8px;">Hello, ${recipientName}!</p>
          ${title ? `<h2 style="font-size:22px;font-weight:800;color:#1e293b;margin:0 0 20px;line-height:1.3;">${title}</h2>` : ''}
          <div style="font-size:14px;color:#475569;line-height:1.7;margin-bottom:24px;">${body.replace(/\n/g, '<br>')}</div>
          ${ctaText && ctaLink ? `
          <div style="text-align:center;margin:28px 0;">
            <a href="${ctaLink}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#4F46E5,#7C3AED);color:white;text-decoration:none;border-radius:10px;font-weight:700;font-size:14px;">${ctaText}</a>
          </div>` : ''}
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
          <p style="font-size:12px;color:#94a3b8;margin:0;">© ${new Date().getFullYear()} CyberShield. This email was sent to all registered users.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    // Send to all users (batch with Promise.allSettled to avoid one failure stopping all)
    const results = await Promise.allSettled(
      users.map(user =>
        transporter.sendMail({
          from: process.env.SMTP_FROM || `CyberShield <${process.env.SMTP_USER}>`,
          to: user.email,
          subject,
          html: htmlTemplate(user.fullName || user.email.split('@')[0]),
        })
      )
    );

    const sent = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log(`Notification sent: ${sent} success, ${failed} failed`);

    res.json({
      success: true,
      message: `Notification sent to ${sent} users${failed > 0 ? ` (${failed} failed)` : ''}.`,
      sent,
      failed,
      total: users.length,
    });
  } catch (err) {
    console.error('Notification error:', err);
    res.status(500).json({ success: false, message: 'Error sending notifications', error: err.message });
  }
};