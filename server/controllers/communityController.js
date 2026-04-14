import CommunityPost from '../models/CommunityPost.js';
import User from '../models/User.js';

// ─────────────────────────────────────────────
// POST /api/community/posts
// Create a new community post
// ─────────────────────────────────────────────
export const createPost = async (req, res) => {
  try {
    const { title, content, category, isAnonymous, tags } = req.body;
    const userId = req.body.userId || req.user?.id;

    if (!title || !content || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, content, and category are required',
      });
    }

    // Get user info for display name
    let displayName = 'Anonymous User';
    if (!isAnonymous && userId) {
      const user = await User.findById(userId);
      displayName = user?.name || 'Community Member';
    }

    const post = new CommunityPost({
      userId: isAnonymous ? null : userId,
      title: title.trim(),
      content: content.trim(),
      category,
      isAnonymous: isAnonymous || false,
      displayName,
      tags: tags || [],
      status: 'approved', // Auto-approve for real-time experience
    });

    await post.save();

    // Populate user info for response
    await post.populate('userId', 'name');

    return res.status(201).json({
      success: true,
      message: 'Post created successfully!',
      data: post,
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create post',
    });
  }
};

// ─────────────────────────────────────────────
// GET /api/community/posts
// Get all community posts with pagination
// ─────────────────────────────────────────────
export const getPosts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category = null,
      sort = 'newest',
      search = '',
    } = req.query;

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter = { status: 'approved' };

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Build sort
    let sortObj = { createdAt: -1 }; // Default: newest first
    if (sort === 'popular') {
      sortObj = { likes: -1, createdAt: -1 };
    } else if (sort === 'mostViewed') {
      sortObj = { views: -1, createdAt: -1 };
    } else if (sort === 'oldest') {
      sortObj = { createdAt: 1 };
    }

    // Get total count for pagination
    const total = await CommunityPost.countDocuments(filter);

    // Fetch posts
    const posts = await CommunityPost.find(filter)
      .populate('userId', 'name')
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .lean();

    return res.json({
      success: true,
      data: posts,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalPosts: total,
        limit: limitNum,
      },
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch posts',
    });
  }
};

// ─────────────────────────────────────────────
// GET /api/community/posts/:postId
// Get single post with all comments
// ─────────────────────────────────────────────
export const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await CommunityPost.findById(postId).populate('userId', 'name');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    return res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch post',
    });
  }
};

// ─────────────────────────────────────────────
// POST /api/community/posts/:postId/view
// Track a view - 1 view per user account
// ─────────────────────────────────────────────
export const trackView = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.body.userId || req.user?.id;

    const post = await CommunityPost.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if user has already viewed this post
    const alreadyViewed = post.viewedBy?.some(
      (view) => view.userId?.toString() === userId?.toString()
    );

    if (!alreadyViewed && userId) {
      // Add view only if user hasn't viewed before
      if (!post.viewedBy) post.viewedBy = [];
      post.viewedBy.push({ userId, viewedAt: new Date() });
      post.views = (post.views || 0) + 1;
      await post.save();
    }

    return res.json({
      success: true,
      message: alreadyViewed ? 'Already viewed by this user' : 'View tracked',
      data: post,
      isNewView: !alreadyViewed,
    });
  } catch (error) {
    console.error('Error tracking view:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to track view',
    });
  }
};

// ─────────────────────────────────────────────
// POST /api/community/posts/:postId/comment
// Add a comment to a post
// ─────────────────────────────────────────────
export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, isAnonymous } = req.body;
    const userId = req.body.userId || req.user?.id;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required',
      });
    }

    // Get display name
    let displayName = 'Anonymous User';
    if (!isAnonymous && userId) {
      const user = await User.findById(userId);
      displayName = user?.name || 'Community Member';
    }

    const post = await CommunityPost.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const comment = {
      userId: isAnonymous ? null : userId,
      displayName,
      content: content.trim(),
      isAnonymous: isAnonymous || false,
      createdAt: new Date(),
    };

    post.comments.push(comment);
    await post.save();
    await post.populate('userId', 'name');

    return res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: post,
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add comment',
    });
  }
};

// ─────────────────────────────────────────────
// POST /api/community/posts/:postId/like
// Like/Unlike a post
// ─────────────────────────────────────────────
export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.body.userId || req.user?.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID required to like',
      });
    }

    const post = await CommunityPost.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if user already liked this post
    const alreadyLiked = post.likedBy?.some(
      (like) => like.userId?.toString() === userId?.toString()
    );

    if (alreadyLiked) {
      // Unlike: remove the user's like
      post.likedBy = post.likedBy.filter(
        (like) => like.userId?.toString() !== userId?.toString()
      );
      post.likes = Math.max(0, post.likes - 1);
    } else {
      // Like: add user's like
      if (!post.likedBy) post.likedBy = [];
      post.likedBy.push({ userId, createdAt: new Date() });
      post.likes = (post.likes || 0) + 1;
    }

    await post.save();

    return res.json({
      success: true,
      message: alreadyLiked ? 'Post unliked' : 'Post liked',
      data: post,
      liked: !alreadyLiked,
    });
  } catch (error) {
    console.error('Error liking post:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to like post',
    });
  }
};

// ─────────────────────────────────────────────
// DELETE /api/community/posts/:postId
// Delete own post
// ─────────────────────────────────────────────
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.body.userId || req.user?.id;

    const post = await CommunityPost.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if user owns the post
    if (post.userId?.toString() !== userId?.toString() && !req.user?.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own posts',
      });
    }

    await CommunityPost.findByIdAndDelete(postId);

    return res.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete post',
    });
  }
};

// ─────────────────────────────────────────────
// DELETE /api/community/posts/:postId/comments/:commentId
// Delete a comment
// ─────────────────────────────────────────────
export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.body.userId || req.user?.id;

    const post = await CommunityPost.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Check ownership
    if (comment.userId?.toString() !== userId?.toString() && !req.user?.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own comments',
      });
    }

    post.comments.id(commentId).deleteOne();
    await post.save();

    return res.json({
      success: true,
      message: 'Comment deleted successfully',
      data: post,
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete comment',
    });
  }
};

// ─────────────────────────────────────────────
// GET /api/community/stats
// Get community statistics
// ─────────────────────────────────────────────
export const getStats = async (req, res) => {
  try {
    const totalPosts = await CommunityPost.countDocuments({ status: 'approved' });
    const totalComments = await CommunityPost.aggregate([
      { $match: { status: 'approved' } },
      { $project: { commentCount: { $size: '$comments' } } },
      { $group: { _id: null, total: { $sum: '$commentCount' } } },
    ]);

    const categoryCounts = await CommunityPost.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    return res.json({
      success: true,
      data: {
        totalPosts,
        totalComments: totalComments[0]?.total || 0,
        categories: categoryCounts,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
    });
  }
};
