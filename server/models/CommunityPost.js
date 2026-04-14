import mongoose from 'mongoose';

const communityPostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['scam_report', 'question', 'tip', 'experience', 'warning'],
      required: true,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    displayName: {
      type: String,
      default: 'Anonymous User',
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    viewedBy: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        viewedAt: { type: Date, default: Date.now },
      },
    ],
    comments: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        displayName: String,
        content: String,
        isAnonymous: Boolean,
        likes: { type: Number, default: 0 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    tags: [String],
    views: {
      type: Number,
      default: 0,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('CommunityPost', communityPostSchema);
