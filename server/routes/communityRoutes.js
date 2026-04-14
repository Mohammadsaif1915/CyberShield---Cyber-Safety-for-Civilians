import express from 'express';
import {
  createPost,
  getPosts,
  getPostById,
  addComment,
  likePost,
  trackView,
  deletePost,
  deleteComment,
  getStats,
} from '../controllers/communityController.js';

const router = express.Router();

// ── Public endpoints (no auth required) ──────────
router.get('/posts', getPosts); // Get all posts
router.get('/posts/:postId', getPostById); // Get single post
router.get('/stats', getStats); // Get community stats

// ── Protected endpoints (require userId/token) ──
router.post('/posts', createPost); // Create post
router.post('/posts/:postId/view', trackView); // Track view (1 per user)
router.post('/posts/:postId/comment', addComment); // Add comment
router.post('/posts/:postId/like', likePost); // Like post
router.delete('/posts/:postId', deletePost); // Delete own post
router.delete('/posts/:postId/comments/:commentId', deleteComment); // Delete comment

export default router;
