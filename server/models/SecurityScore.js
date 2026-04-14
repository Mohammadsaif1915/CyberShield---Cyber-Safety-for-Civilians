import mongoose from 'mongoose';

const securityScoreSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    overallScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    quizScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    courseProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    reportScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    toolUsage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    streak: {
      type: Number,
      default: 0,
      min: 0,
    },
    activityLevel: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    suggestions: [
      {
        title: String,
        description: String,
        priority: {
          type: String,
          enum: ['high', 'medium', 'low'],
          default: 'medium',
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('SecurityScore', securityScoreSchema);
