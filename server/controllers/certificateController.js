import Certificate from '../models/Certificate.js';
import Progress from '../models/Progress.js';
import Course from '../models/Course.js';
import mongoose from 'mongoose';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const razorpay = process.env.RAZORPAY_KEY_ID ? new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
}) : null;

const getUserId = (req) => req.user._id;

// ✅ Generate unique certificate ID
const generateCertId = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const counter = Math.floor(Math.random() * 9000 + 1000);

  return `CL-${year}${month}${day}-${random}-${counter}`;
};

// ✅ POST /api/certificate/:courseId
export const issueCertificate = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { recipientName } = req.body;

    if (!recipientName?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Recipient name is required'
      });
    }

    const progress = await Progress.findOne({
      user: userId,
      course: req.params.courseId
    });

    if (!progress || !progress.quizPassed) {
      return res.status(403).json({
        success: false,
        message: 'Pass the quiz first'
      });
    }

    let cert = await Certificate.findOne({
      user: userId,
      course: req.params.courseId
    });

    if (!cert) {
      const course = await Course.findById(req.params.courseId);

      cert = await Certificate.create({
        user: userId,
        course: req.params.courseId,
        recipientName: recipientName.trim(),
        courseTitle: course.title,
        certificateId: generateCertId()
      });

      progress.certificateIssued = true;
      progress.certificateName = recipientName.trim();
      await progress.save();
    }

    res.json({ success: true, certificate: cert });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ✅ GET /api/certificate/:courseId
export const getCertificate = async (req, res) => {
  try {
    const userId = getUserId(req);
    const cert = await Certificate.findOne({
      user: userId,
      course: req.params.courseId
    });

    if (!cert) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    res.json({ success: true, certificate: cert });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ✅ GET /api/certificate/my
export const getMyCertificates = async (req, res) => {
  try {
    const userId = getUserId(req);
    const certs = await Certificate.find({ user: userId })
      .populate('course', 'title icon color');

    res.json({ success: true, certificates: certs });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ✅ POST /api/certificate/:courseId/create-order
export const createPaymentOrder = async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(500).json({
        success: false,
        message: 'Razorpay is not configured on the server. Check RAZORPAY_KEY_ID.'
      });
    }
    const userId = getUserId(req);
    const { courseId } = req.params;

    const progress = await Progress.findOne({ user: userId, course: courseId });
    if (!progress || !progress.quizPassed) {
      return res.status(403).json({
        success: false,
        message: 'Pass the quiz first'
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const options = {
      amount: 100 * 100, // ₹100 in paise
      currency: 'INR',
      receipt: `rcpt_${userId.toString().slice(-8)}${courseId.toString().slice(-8)}`.slice(0, 40),
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (err) {
    console.error('Razorpay Order Error:', err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ✅ POST /api/certificate/:courseId/verify-payment
export const verifyPaymentAndIssue = async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(500).json({
        success: false,
        message: 'Razorpay is not configured on the server.'
      });
    }
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, recipientName } = req.body;
    const { courseId } = req.params;
    const userId = getUserId(req);

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment details are missing'
      });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Signature matched, verify quiz and issue certificate
    const progress = await Progress.findOne({ user: userId, course: courseId });
    if (!progress || !progress.quizPassed) {
      return res.status(403).json({
        success: false,
        message: 'Pass the quiz first'
      });
    }

    let cert = await Certificate.findOne({
      user: userId,
      course: courseId
    });

    if (!cert) {
      const course = await Course.findById(courseId);
      cert = await Certificate.create({
        user: userId,
        course: courseId,
        recipientName: recipientName.trim(),
        courseTitle: course.title,
        certificateId: generateCertId(),
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        paymentStatus: 'paid'
      });

      progress.certificateIssued = true;
      progress.certificateName = recipientName.trim();
      await progress.save();
    } else {
      cert.paymentStatus = 'paid';
      cert.paymentId = razorpay_payment_id;
      cert.orderId = razorpay_order_id;
      if (recipientName) cert.recipientName = recipientName.trim();
      await cert.save();
    }

    res.json({ success: true, certificate: cert });
  } catch (err) {
    console.error('Razorpay Verify Error:', err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
