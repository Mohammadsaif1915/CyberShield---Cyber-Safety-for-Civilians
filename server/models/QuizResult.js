// server/models/QuizResult.js
import mongoose from 'mongoose';

const sectionResultSchema = new mongoose.Schema({
  sectionId:  { type: Number, required: true },
  title:      { type: String, required: true },
  correct:    { type: Number, required: true },
  incorrect:  { type: Number, required: true },
  total:      { type: Number, required: true },
  percentage: { type: Number, required: true },
});

const quizResultSchema = new mongoose.Schema({
  user:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  moduleId:       { type: Number, required: true },
  moduleTitle:    { type: String, required: true },
  totalCorrect:   { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  percentage:     { type: Number, required: true },
  grade:          { type: String, required: true },
  timeSpent:      { type: Number, required: true }, // seconds mein
  sectionResults: [sectionResultSchema],
}, { timestamps: true });

// Ek user + ek module = sirf ek result record (upsert karega)
quizResultSchema.index({ user: 1, moduleId: 1 });

const QuizResult = mongoose.model('QuizResult', quizResultSchema);
export default QuizResult;