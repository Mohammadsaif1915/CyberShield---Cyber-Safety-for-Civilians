import mongoose from 'mongoose';

const quizProgressSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  moduleId: {
    type: Number,
    required: true
  },
  sectionId: {
    type: Number,
    required: true
  },
  answers: {
    type: Map,
    of: Number,
    default: {}
  },
  score: {
    type: Number,
    default: 0
  },
  totalQuestions: {
    type: Number,
    default: 10
  },
  completed: {
    type: Boolean,
    default: false
  },
  timeSpent: {
    type: Number,
    default: 0
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

quizProgressSchema.index({ userId: 1, moduleId: 1, sectionId: 1 }, { unique: true });

const moduleProgressSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  moduleId: {
    type: Number,
    required: true
  },
  completedSections: {
    type: [Number],
    default: []
  },
  totalScore: {
    type: Number,
    default: 0
  },
  totalQuestions: {
    type: Number,
    default: 40
  },
  completed: {
    type: Boolean,
    default: false
  },
  timeSpent: {
    type: Number,
    default: 0
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

moduleProgressSchema.index({ userId: 1, moduleId: 1 }, { unique: true });

export const QuizProgress = mongoose.model('QuizProgress', quizProgressSchema);
export const ModuleProgress = mongoose.model('ModuleProgress', moduleProgressSchema);