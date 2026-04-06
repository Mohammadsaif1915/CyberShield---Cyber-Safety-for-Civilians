import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  excerpt: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    required: true,
    enum: ['Threats', 'Best Practices', 'Tutorials'],
  },
  author: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: '/blog-default.jpg',
  },
  tags: {
    type: [String],
    default: [],
  },
  readTime: {
    type: String,
    default: '5 min read',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  notificationSent: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model('Blog', blogSchema);