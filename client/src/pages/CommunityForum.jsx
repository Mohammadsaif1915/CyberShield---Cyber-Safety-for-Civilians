import { useState, useEffect } from 'react'
import { Heart, MessageCircle, Share2, Trash2, Send, Loader, X } from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'
import './CommunityForum.css'

export default function CommunityForum() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [showNewPost, setShowNewPost] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const [newComment, setNewComment] = useState('')
  const [isCommentAnonymous, setIsCommentAnonymous] = useState(false)
  const [submittingComment, setSubmittingComment] = useState(false)
  const [userLikes, setUserLikes] = useState({})

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'question',
    isAnonymous: false,
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState(null)

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  // Fetch posts with background loading
  const fetchPosts = async (page = 1) => {
    try {
      if (page === 1) setLoading(false) // Don't show loader for first load, use background
      
      const params = new URLSearchParams({
        page,
        limit: 10,
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(searchQuery && { search: searchQuery }),
        sort: sortBy,
      })

      const res = await api.get(`/community/posts?${params}`)

      if (res.data.success) {
        setPosts(res.data.data)
        setPagination(res.data.pagination)
        setCurrentPage(page)

        // Track which posts user has liked
        const likes = {}
        res.data.data.forEach((post) => {
          const userLiked = post.likedBy?.some(
            (like) => like.userId === user?._id || like.userId === user?.id
          )
          likes[post._id] = userLiked || false
        })
        setUserLikes(likes)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
      if (page === 1) toast.error('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  // Refresh posts every 3 seconds for real-time effect (background)
  useEffect(() => {
    fetchPosts(1)
    const interval = setInterval(() => {
      fetchPosts(currentPage)
    }, 3000)
    return () => clearInterval(interval)
  }, [selectedCategory, searchQuery, sortBy])

  const handleCreatePost = async (e) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      setSubmitting(true)
      const res = await api.post('/community/posts', {
        ...formData,
        userId: user?._id,
      })

      if (res.data.success) {
        toast.success('✨ Post created successfully!')
        setFormData({ title: '', content: '', category: 'question', isAnonymous: false })
        setShowNewPost(false)
        fetchPosts(1)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create post')
    } finally {
      setSubmitting(false)
    }
  }

  const handleLikePost = async (postId) => {
    try {
      const res = await api.post(`/community/posts/${postId}/like`, {
        userId: user?._id,
      })
      if (res.data.success) {
        // Update user likes state
        setUserLikes((prev) => ({
          ...prev,
          [postId]: res.data.liked,
        }))
        // Refresh posts to get updated like counts
        fetchPosts(currentPage)
        toast.success(res.data.liked ? '❤️ Liked!' : '💔 Unliked')
      }
    } catch (error) {
      toast.error('Failed to like post')
    }
  }

  const handleAddComment = async (postId) => {
    if (!newComment.trim()) {
      toast.error('Please write a comment')
      return
    }

    try {
      setSubmittingComment(true)
      const res = await api.post(`/community/posts/${postId}/comment`, {
        content: newComment,
        isAnonymous: isCommentAnonymous,
        userId: user?._id,
      })

      if (res.data.success) {
        toast.success('💬 Comment added!')
        setNewComment('')
        setIsCommentAnonymous(false)
        setSelectedPost(res.data.data)
        fetchPosts(currentPage)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add comment')
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleOpenPost = async (post) => {
    setSelectedPost(post)
    
    // Track view - 1 per user account
    if (user?._id) {
      try {
        await api.post(`/community/posts/${post._id}/view`, {
          userId: user?._id,
        })
      } catch (error) {
        console.error('Error tracking view:', error)
      }
    }
  }

  const handleSharePost = (post) => {
    const shareText = `Check out this post on CyberShield Community: "${post.title}"\n\n${post.content.substring(0, 100)}...`
    const shareUrl = window.location.origin + '/community-forum'

    // Copy to clipboard
    navigator.clipboard.writeText(`${shareText}\n${shareUrl}`).then(() => {
      toast.success('✅ Copied to clipboard!')
    }).catch(() => {
      toast.error('Failed to copy')
    })

    // WhatsApp
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`
    
    // Show share options
    toast.success('Opening share options...')
    setTimeout(() => {
      window.open(whatsappUrl, '_blank', 'width=500,height=500')
    }, 500)
  }

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return

    try {
      await api.delete(`/community/posts/${postId}`, {
        data: { userId: user?._id },
      })
      toast.success('Post deleted')
      fetchPosts(currentPage)
    } catch (error) {
      toast.error('Failed to delete post')
    }
  }

  const handleDeleteComment = async (postId, commentId) => {
    if (!window.confirm('Delete this comment?')) return

    try {
      const res = await api.delete(`/community/posts/${postId}/comments/${commentId}`, {
        data: { userId: user?._id },
      })
      if (res.data.success) {
        toast.success('💬 Comment deleted!')
        setSelectedPost(res.data.data)
        fetchPosts(currentPage)
      }
    } catch (error) {
      toast.error('Failed to delete comment')
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      scam_report: 'rgba(239, 68, 68, 0.1)',
      question: 'rgba(59, 130, 246, 0.1)',
      tip: 'rgba(34, 197, 94, 0.1)',
      experience: 'rgba(168, 85, 247, 0.1)',
      warning: 'rgba(249, 115, 22, 0.1)',
    }
    return colors[category] || 'rgba(148, 163, 184, 0.1)'
  }

  const getCategoryBadgeColor = (category) => {
    const colors = {
      scam_report: '#ef4444',
      question: '#3b82f6',
      tip: '#22c55e',
      experience: '#a855f7',
      warning: '#f97316',
    }
    return colors[category] || '#64748b'
  }

  const categories = [
    { id: 'all', label: '📌 All Posts', count: '∞' },
    { id: 'question', label: '❓ Questions' },
    { id: 'scam_report', label: '🚨 Scam Reports' },
    { id: 'tip', label: '💡 Tips' },
    { id: 'experience', label: '📝 Experiences' },
    { id: 'warning', label: '⚠️ Warnings' },
  ]

  return (
    <div className="community-forum">
      {/* Header */}
      <div className="forum-header">
        <div className="header-content">
          <h1>🌍 Community Forum</h1>
          <p>Share experiences, ask questions, and help others stay safe online</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowNewPost(!showNewPost)}
        >
          ✍️ New Post
        </button>
      </div>

      {/* New Post Form */}
      {showNewPost && (
        <div className="new-post-section">
          <form onSubmit={handleCreatePost} className="post-form">
            <input
              type="text"
              placeholder="Post title (max 200 characters)"
              maxLength={200}
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />

            <textarea
              placeholder="Share your thoughts, question, or experience..."
              rows={6}
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              required
            />

            <div className="form-controls">
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="question">❓ Question</option>
                <option value="scam_report">🚨 Scam Report</option>
                <option value="tip">💡 Tip</option>
                <option value="experience">📝 Experience</option>
                <option value="warning">⚠️ Warning</option>
              </select>

              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={formData.isAnonymous}
                  onChange={(e) =>
                    setFormData({ ...formData, isAnonymous: e.target.checked })
                  }
                />
                <span>Post anonymously 🕵️</span>
              </label>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
              >
                {submitting ? <Loader className="spinner" /> : <Send size={18} />}
                {submitting ? 'Posting...' : 'Post'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowNewPost(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters & Search */}
      <div className="filters-section">
        <input
          type="text"
          placeholder="🔍 Search posts..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setCurrentPage(1)
          }}
          className="search-input"
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-select"
        >
          <option value="newest">⏰ Newest First</option>
          <option value="popular">❤️ Most Liked</option>
          <option value="mostViewed">👁️ Most Viewed</option>
          <option value="oldest">🏛️ Oldest First</option>
        </select>
      </div>

      {/* Categories */}
      <div className="categories-section">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => {
              setSelectedCategory(cat.id)
              setCurrentPage(1)
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Posts List */}
      <div className="posts-container">
        {loading && currentPage === 1 && <div className="loading">⏳ Loading posts...</div>}

        {!loading && posts.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>No posts yet. Be the first to share! ✨</p>
          </div>
        )}

        {posts.map((post) => (
          <div
            key={post._id}
            className="post-card"
            style={{ borderLeft: `4px solid ${getCategoryBadgeColor(post.category)}` }}
          >
            {/* Post Header */}
            <div className="post-header">
              <div>
                <h3 className="post-title">{post.title}</h3>
                <div className="post-meta">
                  <span
                    className="category-badge"
                    style={{ backgroundColor: getCategoryBadgeColor(post.category) }}
                  >
                    {post.category.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="author">
                    👤 {post.isAnonymous ? 'Anonymous' : post.displayName}
                  </span>
                  <span className="time">
                    🕐 {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {(user?._id === post.userId || user?._id === post.userId?._id) && (
                <button
                  className="delete-btn"
                  onClick={() => handleDeletePost(post._id)}
                  title="Delete this post"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              )}
            </div>

            {/* Post Content */}
            <p className="post-content">{post.content}</p>

            {/* Post Stats */}
            <div className="post-stats">
              <span>👁️ {post.views || 0} views</span>
              <span>💬 {post.comments?.length || 0} comments</span>
            </div>

            {/* Post Actions */}
            <div className="post-actions">
              <button
                className={`action-btn like-btn ${userLikes[post._id] ? 'liked' : ''}`}
                onClick={() => handleLikePost(post._id)}
                title={userLikes[post._id] ? 'Unlike' : 'Like'}
              >
                <Heart size={18} fill={userLikes[post._id] ? 'currentColor' : 'none'} />
                <span>{post.likes || 0} Likes</span>
              </button>
              <button
                className="action-btn comment-btn"
                onClick={() => handleOpenPost(post)}
              >
                <MessageCircle size={18} />
                <span>Comment</span>
              </button>
              <button
                className="action-btn share-btn"
                onClick={() => handleSharePost(post)}
              >
                <Share2 size={18} />
                <span>Share</span>
              </button>
            </div>

            {/* Recent Comments Preview */}
            {post.comments && post.comments.length > 0 && (
              <div className="comments-preview">
                <div className="comments-header">Top Comments:</div>
                {post.comments.slice(0, 2).map((comment, idx) => (
                  <div key={idx} className="comment-preview">
                    <strong>
                      {comment.isAnonymous ? 'Anonymous' : comment.displayName}
                    </strong>
                    <p>{comment.content.substring(0, 100)}...</p>
                  </div>
                ))}
                {post.comments.length > 2 && (
                  <div 
                    className="more-comments"
                    onClick={() => handleOpenPost(post)}
                  >
                    +{post.comments.length - 2} more comments
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => fetchPosts(currentPage - 1)}
            className="btn btn-secondary"
          >
            ← Previous
          </button>
          <span className="page-info">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            disabled={currentPage === pagination.totalPages}
            onClick={() => fetchPosts(currentPage + 1)}
            className="btn btn-secondary"
          >
            Next →
          </button>
        </div>
      )}

      {/* Comments Modal */}
      {selectedPost && (
        <div className="modal-overlay" onClick={() => setSelectedPost(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="modal-header">
              <div>
                <h2>💬 Comments on: {selectedPost.title}</h2>
                <p className="modal-category">
                  {selectedPost.category.replace('_', ' ').toUpperCase()}
                </p>
              </div>
              <div className="modal-actions">
                {(user?._id === selectedPost.userId || user?._id === selectedPost.userId?._id) && (
                  <button
                    className="delete-post-btn"
                    onClick={() => {
                      if (window.confirm('Delete this post? All comments will be removed.')) {
                        handleDeletePost(selectedPost._id)
                        setSelectedPost(null)
                      }
                    }}
                    title="Delete post"
                  >
                    🗑️ Delete
                  </button>
                )}
                <button
                  className="close-btn"
                  onClick={() => setSelectedPost(null)}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Comments List */}
            <div className="comments-list">
              {selectedPost.comments && selectedPost.comments.length > 0 ? (
                selectedPost.comments.map((comment, idx) => (
                  <div key={idx} className="comment-item">
                    <div className="comment-header">
                      <div>
                        <strong>
                          👤 {comment.isAnonymous ? 'Anonymous' : comment.displayName}
                        </strong>
                        <span className="comment-date">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {(user?._id === comment.userId || user?._id === comment.userId?._id) && (
                        <button
                          className="delete-comment-btn"
                          onClick={() => handleDeleteComment(selectedPost._id, comment._id)}
                          title="Delete comment"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <p className="comment-text">{comment.content}</p>
                  </div>
                ))
              ) : (
                <div className="no-comments">No comments yet. Be the first! 👇</div>
              )}
            </div>

            {/* Add Comment Form */}
            {user && (
              <div className="add-comment-form">
                <textarea
                  placeholder="Add your comment... (be respectful and helpful)"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows="3"
                />
                <div className="form-actions">
                  <label className="anonymous-checkbox">
                    <input
                      type="checkbox"
                      checked={isCommentAnonymous}
                      onChange={(e) => setIsCommentAnonymous(e.target.checked)}
                    />
                    <span>Post as Anonymous</span>
                  </label>
                  <button
                    className="submit-comment-btn"
                    onClick={() => handleAddComment(selectedPost._id)}
                    disabled={submittingComment}
                  >
                    {submittingComment ? '⏳ Posting...' : '📤 Post Comment'}
                  </button>
                </div>
              </div>
            )}

            {!user && (
              <div className="login-prompt">
                <p>👤 Please log in to comment on posts</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
