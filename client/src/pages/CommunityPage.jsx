import { useState, useEffect } from "react";
import { MessageSquare, Heart, Eye, Send, Flag, Search, Plus, User } from "lucide-react";

const T = {
  bg: "#F0F2F8", surface: "#FFFFFF", card: "#FFFFFF", border: "rgba(99,102,241,0.14)",
  brand: "#4F46E5", brandDark: "#3730A3", brandGlow: "rgba(79,70,229,0.18)",
  teal: "#0D9488", tealDim: "rgba(13,148,136,0.10)",
  amber: "#D97706", amberDim: "rgba(217,119,6,0.10)",
  red: "#DC2626", redDim: "rgba(220,38,38,0.08)",
  green: "#059669", greenDim: "rgba(5,150,105,0.10)",
  text: "#111827", textMd: "#4B5563", textDim: "#9CA3AF",
  sh: "0 1px 4px rgba(0,0,0,0.07)", shMd: "0 4px 20px rgba(0,0,0,0.10)",
};

const API = {
  headers: () => ({ "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` }),
  get: (url) => fetch(url, { headers: API.headers() }).then(r => r.ok ? r.json() : Promise.reject(r)),
  post: (url, body) => fetch(url, { method: "POST", headers: API.headers(), body: JSON.stringify(body) }).then(r => r.json()),
  put: (url, body) => fetch(url, { method: "PUT", headers: API.headers(), body: JSON.stringify(body) }).then(r => r.json()),
};

const CATEGORIES = [
  { value: "scam_report", label: "🚨 Scam Report", color: T.red },
  { value: "question", label: "❓ Question", color: T.brand },
  { value: "tip", label: "💡 Tip", color: T.teal },
  { value: "experience", label: "📖 Experience", color: T.amber },
  { value: "warning", label: "⚠️ Warning", color: "#EA580C" },
];

function PostCard({ post, currentUser, onLike, onReply }) {
  const [showComments, setShowComments] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);

  const category = CATEGORIES.find(c => c.value === post.category);
  const isAuthor = currentUser?._id === post.author?._id;
  const liked = post.likes?.includes(currentUser?._id);

  const handleReply = async () => {
    if (!replyText.trim()) return;
    setReplying(true);

    try {
      const res = await API.post(`/api/features/community/posts/${post._id}/comments`, {
        text: replyText,
      });
      if (res?.success) {
        setReplyText("");
        // Refresh post data
        onReply?.();
      }
    } catch (err) {
      console.error("Reply Error:", err);
    } finally {
      setReplying(false);
    }
  };

  const handleLike = async () => {
    try {
      await API.put(`/api/features/community/posts/${post._id}/like`, {});
      onLike?.();
    } catch (err) {
      console.error("Like Error:", err);
    }
  };

  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: "20px", marginBottom: 16, boxShadow: T.sh }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
          <div style={{ width: 40, height: 40, borderRadius: 50, background: T.brandGlow, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {post.anonymous ? "?" : post.author?.avatar ? "👤" : <User size={20} style={{ color: T.brand }} />}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: T.text }}>
              {post.anonymous ? "Anonymous User" : post.author?.fullName || "Unknown"}
            </p>
            <p style={{ fontSize: 11, color: T.textDim, marginTop: 2 }}>
              {new Date(post.createdAt).toLocaleDateString()} at{" "}
              {new Date(post.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>

        {category && (
          <div style={{ padding: "4px 10px", borderRadius: 6, background: `${category.color}15`, fontSize: 10, fontWeight: 600, color: category.color }}>
            {category.label}
          </div>
        )}
      </div>

      {/* Content */}
      <h4 style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 8 }}>{post.title}</h4>
      <p style={{ fontSize: 13, color: T.textMd, lineHeight: 1.6, marginBottom: 12 }}>{post.content}</p>

      {/* Stats */}
      <div style={{ display: "flex", alignItems: "center", gap: 20, paddingTop: 12, borderTop: `1px solid ${T.border}`, marginBottom: 12 }}>
        <button
          onClick={handleLike}
          style={{
            display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: liked ? T.brand : T.textMd,
            background: "none", border: "none", cursor: "pointer", fontWeight: 500, transition: "color 0.2s",
          }}
        >
          <Heart size={14} style={{ fill: liked ? T.brand : "none" }} />
          {post.likes?.length || 0} Likes
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          style={{
            display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: T.textMd,
            background: "none", border: "none", cursor: "pointer", fontWeight: 500,
          }}
        >
          <MessageSquare size={14} />
          {post.comments?.length || 0} Comments
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: T.textDim }}>
          <Eye size={14} />
          {post.views || 0} Views
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div style={{ background: T.bg, borderRadius: 10, padding: "16px", marginBottom: 12 }}>
          {/* Existing Comments */}
          {post.comments && post.comments.length > 0 ? (
            <div style={{ marginBottom: 14 }}>
              {post.comments.map((comment, i) => (
                <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < post.comments.length - 1 ? `1px solid ${T.border}` : "none" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 50, background: T.brandGlow, flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 600, color: T.text }}>
                        {comment.anonymous ? "Anonymous" : comment.author?.fullName || "User"}
                      </p>
                      <p style={{ fontSize: 11, color: T.textMd, marginTop: 3 }}>{comment.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: 12, color: T.textDim, marginBottom: 14 }}>No comments yet. Be the first to reply!</p>
          )}

          {/* Reply Input */}
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Add a comment..."
              style={{
                flex: 1, padding: "8px 12px", border: `1px solid ${T.border}`, borderRadius: 8,
                fontSize: 12, fontFamily: "'Nunito',sans-serif", outline: "none",
              }}
            />
            <button
              onClick={handleReply}
              disabled={replying || !replyText.trim()}
              style={{
                padding: "8px 14px", borderRadius: 8, border: "none", background: T.brand, color: "#fff",
                fontSize: 12, fontWeight: 600, cursor: "pointer", opacity: replying || !replyText.trim() ? 0.5 : 1,
              }}
            >
              <Send size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CommunityPage({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostData, setNewPostData] = useState({ category: "question", title: "", content: "", anonymous: false });
  const [posting, setPosting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const url = selectedCategory === "all" 
          ? "/api/features/community/posts"
          : `/api/features/community/posts?category=${selectedCategory}`;
        const res = await API.get(url);
        if (res?.success) {
          setPosts(res.data || []);
        }
      } catch (err) {
        console.error("Posts Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [selectedCategory]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostData.title.trim() || !newPostData.content.trim()) return;

    setPosting(true);
    try {
      const res = await API.post("/api/features/community/posts", newPostData);
      if (res?.success) {
        setNewPostData({ category: "question", title: "", content: "", anonymous: false });
        setShowNewPost(false);
        // Refresh posts
        const updated = await API.get("/api/features/community/posts");
        if (updated?.success) setPosts(updated.data || []);
      }
    } catch (err) {
      console.error("Post Creation Error:", err);
    } finally {
      setPosting(false);
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: T.text, marginBottom: 6, fontFamily: "'Syne',sans-serif" }}>Community</h1>
        <p style={{ fontSize: 14, color: T.textMd }}>Share experiences, ask questions, and help protect others from cyber threats</p>
      </div>

      {/* Create Post Button + Search */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: T.textDim }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search posts..."
            style={{
              width: "100%", paddingLeft: 40, paddingRight: 16, paddingTop: 12, paddingBottom: 12,
              border: `1px solid ${T.border}`, borderRadius: 10, fontSize: 13, fontFamily: "'Nunito',sans-serif", outline: "none",
            }}
          />
        </div>
        <button
          onClick={() => setShowNewPost(true)}
          style={{
            padding: "12px 20px", borderRadius: 10, border: "none", background: T.brand, color: "#fff",
            fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
            fontFamily: "'Nunito',sans-serif",
          }}
        >
          <Plus size={16} />
          New Post
        </button>
      </div>

      {/* New Post Form */}
      {showNewPost && (
        <form onSubmit={handleCreatePost} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: "20px", marginBottom: 24, boxShadow: T.sh }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 16, fontFamily: "'Syne',sans-serif" }}>Create a New Post</h3>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.text, marginBottom: 8 }}>Category</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
              {CATEGORIES.map((cat) => (
                <label key={cat.value} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "8px 12px", borderRadius: 8, border: newPostData.category === cat.value ? `2px solid ${cat.color}` : `1px solid ${T.border}`, background: newPostData.category === cat.value ? `${cat.color}15` : T.bg }}>
                  <input type="radio" value={cat.value} checked={newPostData.category === cat.value} onChange={(e) => setNewPostData({ ...newPostData, category: e.target.value })} style={{ cursor: "pointer" }} />
                  <span style={{ fontSize: 11, fontWeight: 600 }}>{cat.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.text, marginBottom: 8 }}>Title</label>
            <input type="text" value={newPostData.title} onChange={(e) => setNewPostData({ ...newPostData, title: e.target.value })} placeholder="Post title..." style={{ width: "100%", padding: "10px 14px", border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 12, fontFamily: "'Nunito',sans-serif", outline: "none" }} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.text, marginBottom: 8 }}>Content</label>
            <textarea value={newPostData.content} onChange={(e) => setNewPostData({ ...newPostData, content: e.target.value })} placeholder="Share your experience, question, or warning..." rows={4} style={{ width: "100%", padding: "10px 14px", border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 12, fontFamily: "'Nunito',sans-serif", outline: "none", resize: "vertical" }} />
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, cursor: "pointer" }}>
            <input type="checkbox" checked={newPostData.anonymous} onChange={(e) => setNewPostData({ ...newPostData, anonymous: e.target.checked })} style={{ cursor: "pointer" }} />
            <span style={{ fontSize: 12, color: T.text }}>Post anonymously</span>
          </label>

          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit" disabled={posting} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "none", background: T.brand, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", opacity: posting ? 0.7 : 1 }}>
              {posting ? "Posting..." : "Post"}
            </button>
            <button type="button" onClick={() => setShowNewPost(false)} style={{ padding: "10px 20px", borderRadius: 8, border: `1px solid ${T.border}`, background: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, color: T.text }}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Category Filter */}
      <div style={{ display: "flex", gap: 10, marginBottom: 24, overflowX: "auto", paddingBottom: 8 }}>
        <button
          onClick={() => setSelectedCategory("all")}
          style={{
            padding: "8px 16px", borderRadius: 20, border: selectedCategory === "all" ? "none" : `1px solid ${T.border}`,
            background: selectedCategory === "all" ? T.brand : "none", color: selectedCategory === "all" ? "#fff" : T.text,
            fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s",
          }}
        >
          All Posts
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            style={{
              padding: "8px 16px", borderRadius: 20, border: selectedCategory === cat.value ? "none" : `1px solid ${T.border}`,
              background: selectedCategory === cat.value ? cat.color : "none", color: selectedCategory === cat.value ? "#fff" : T.text,
              fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s",
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Posts List */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <div style={{ fontSize: 14, color: T.textDim }}>Loading posts...</div>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div style={{ background: T.bg, border: `1px dashed ${T.border}`, borderRadius: 14, padding: "40px 24px", textAlign: "center" }}>
          <MessageSquare size={40} style={{ color: T.textDim, margin: "0 auto 12px" }} />
          <p style={{ fontSize: 14, fontWeight: 600, color: T.text }}>No posts found</p>
          <p style={{ fontSize: 12, color: T.textMd, marginTop: 4 }}>Be the first to start a discussion!</p>
        </div>
      ) : (
        <div>
          {filteredPosts.map((post) => (
            <PostCard key={post._id} post={post} currentUser={user} />
          ))}
        </div>
      )}
    </div>
  );
}
