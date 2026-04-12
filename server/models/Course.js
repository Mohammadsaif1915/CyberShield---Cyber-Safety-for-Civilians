// models/Course.js
import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  url:      { type: String, required: true },   // YouTube embed or direct URL
  duration: { type: Number, default: 300 },     // seconds
  order:    { type: Number, required: true }
});

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options:  [{ type: String, required: true }], // 4 options
  answer:   { type: Number, required: true }    // index 0-3 of correct option
});

const courseSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  level:       { type: String, enum: ['Beginner','Intermediate','Advanced'], required: true },
  category:    { type: String, default: 'Cybersecurity' },
  thumbnail:   { type: String, default: '' },
  icon:        { type: String, default: '🔐' },
  color:       { type: String, default: '#0ea5e9' },  // accent color for card
  videos:      [videoSchema],
  quiz:        [questionSchema],
  totalVideos: { type: Number, default: 0 },
  enrolledCount: { type: Number, default: 0 }
}, { timestamps: true });

// Auto-set totalVideos
courseSchema.pre('save', function (next) {
  this.totalVideos = this.videos.length;
  next();
});

export default mongoose.model('Course', courseSchema);
