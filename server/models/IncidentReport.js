import mongoose from 'mongoose';

const incidentReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reportType: {
      type: String,
      enum: ['phishing', 'malware', 'scam_call', 'fraud_link', 'suspicious_email', 'other'],
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    phoneNumber: {
      type: String,
      default: null,
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'verified', 'resolved'],
      default: 'pending',
    },
    attachments: [String],
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedCount: {
      type: Number,
      default: 0,
    },
    anonymous: {
      type: Boolean,
      default: false,
    },
    sendEmailUpdates: {
      type: Boolean,
      default: true,
    },
    notes: {
      type: String,
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    lastStatusUpdate: {
      type: Date,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for faster queries
incidentReportSchema.index({ userId: 1, createdAt: -1 });
incidentReportSchema.index({ status: 1, severity: 1 });

export default mongoose.model('IncidentReport', incidentReportSchema);
