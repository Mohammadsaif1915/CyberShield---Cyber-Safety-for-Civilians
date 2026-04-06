import Certificate from '../models/Certificate.js';
import Progress    from '../models/Progress.js';
import Course      from '../models/Course.js';
import mongoose    from 'mongoose';

const TEMP_USER_ID = '000000000000000000000001';
const getTempUser  = () => new mongoose.Types.ObjectId(TEMP_USER_ID);

// Unique Certificate ID — CL-202503-XXXXXX-NNNN
const generateCertId = () => {
  const now     = new Date();
  const year    = now.getFullYear();
  const month   = String(now.getMonth() + 1).padStart(2, '0');
  const day     = String(now.getDate()).padStart(2, '0');
  const hour    = String(now.getHours()).padStart(2, '0');
  const min     = String(now.getMinutes()).padStart(2, '0');
  const random  = Math.random().toString(36).substr(2, 6).toUpperCase();
  const counter = Math.floor(Math.random() * 9000 + 1000);
  return `CL-${year}${month}${day}-${random}-${counter}`;
};

// POST /api/certificate/:courseId
export const issueCertificate = async (req, res) => {
  try {
    const userId = getTempUser();
    const { recipientName } = req.body;
    if (!recipientName?.trim())
      return res.status(400).json({ success: false, message: 'Recipient name is required' });

    const progress = await Progress.findOne({ user: userId, course: req.params.courseId });
    if (!progress?.quizPassed)
      return res.status(403).json({ success: false, message: 'Pass the quiz first' });

    let cert = await Certificate.findOne({ user: userId, course: req.params.courseId });
    if (!cert) {
      const course = await Course.findById(req.params.courseId);
      cert = await Certificate.create({
        user:          userId,
        course:        req.params.courseId,
        recipientName: recipientName.trim(),
        courseTitle:   course.title,
        certificateId: generateCertId()
      });
      progress.certificateIssued = true;
      progress.certificateName   = recipientName.trim();
      await progress.save();
    }

    res.json({ success: true, certificate: cert });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/certificate/:courseId
export const getCertificate = async (req, res) => {
  try {
    const userId = getTempUser();
    const cert   = await Certificate.findOne({ user: userId, course: req.params.courseId });
    if (!cert)
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    res.json({ success: true, certificate: cert });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/certificate/my
export const getMyCertificates = async (req, res) => {
  try {
    const userId = getTempUser();
    const certs  = await Certificate.find({ user: userId })
      .populate('course', 'title icon color');
    res.json({ success: true, certificates: certs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};