// models/Certificate.js
import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  user:          { type: mongoose.Schema.Types.ObjectId, ref: 'User',   required: true },
  course:        { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  recipientName: { type: String, required: true },
  courseTitle:   { type: String, required: true },
  issuedAt:      { type: Date, default: Date.now },
  certificateId: { type: String, unique: true },
  paymentId:     { type: String, default: null },
  paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  orderId:       { type: String, default: null },
}, { timestamps: true });

export default mongoose.model('Certificate', certificateSchema);