import React, { useState } from 'react';

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const blogPosts = [
    {
      id: 1,
      title: 'Understanding Phishing Attacks in 2024',
      excerpt: 'Learn how to identify and protect yourself from sophisticated phishing attempts that target individuals and organizations.',
      category: 'Threats',
      author: 'Mohammad Saif Rakhangi',
      date: 'March 10, 2024',
      readTime: '5 min read',
      image: '/blog1.jpg',
      tags: ['Phishing', 'Security', 'Awareness']
    },
    {
      id: 2,
      title: 'Password Security Best Practices',
      excerpt: 'Discover the latest strategies for creating and managing strong passwords to keep your accounts secure.',
      category: 'Best Practices',
      author: 'Shahim Shaikh',
      date: 'March 8, 2024',
      readTime: '4 min read',
      image: '/blog2.jpg',
      tags: ['Passwords', 'Security', 'Best Practices']
    },
    {
      id: 3,
      title: 'Ransomware Prevention Guide',
      excerpt: 'Essential steps to protect your data and systems from ransomware attacks before they happen.',
      category: 'Threats',
      author: 'Mohammad Maniyar',
      date: 'March 5, 2024',
      readTime: '7 min read',
      image: '/blog3.jpg',
      tags: ['Ransomware', 'Prevention', 'Security']
    },
    {
      id: 4,
      title: 'Two-Factor Authentication Explained',
      excerpt: 'Why 2FA is crucial for your online security and how to implement it across all your accounts.',
      category: 'Best Practices',
      author: 'Rehan Shaikh',
      date: 'March 3, 2024',
      readTime: '6 min read',
      image: '/blog4.jpg',
      tags: ['2FA', 'Authentication', 'Security']
    },
    {
      id: 5,
      title: 'Social Engineering: The Human Threat',
      excerpt: 'Understanding how attackers manipulate human psychology to breach security systems.',
      category: 'Threats',
      author: 'Mohammad Saif Rakhangi',
      date: 'February 28, 2024',
      readTime: '8 min read',
      image: '/blog5.jpg',
      tags: ['Social Engineering', 'Psychology', 'Awareness']
    },
    {
      id: 6,
      title: 'Secure Your Home Network',
      excerpt: 'Step-by-step guide to fortifying your home WiFi network against potential threats.',
      category: 'Tutorials',
      author: 'Shahim Shaikh',
      date: 'February 25, 2024',
      readTime: '10 min read',
      image: '/blog6.jpg',
      tags: ['Network', 'WiFi', 'Home Security']
    }
  ];

  const categories = ['All', 'Threats', 'Best Practices', 'Tutorials'];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    hero: {
      textAlign: 'center',
      padding: '80px 20px 60px',
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
      backdropFilter: 'blur(10px)',
    },
    heroContent: {
      maxWidth: '800px',
      margin: '0 auto',
    },
    heroTitle: {
      fontSize: '3.5rem',
      color: '#0d47a1',
      marginBottom: '20px',
      fontWeight: '700',
      animation: 'fadeInDown 1s ease-out',
    },
    heroSubtitle: {
      fontSize: '1.3rem',
      color: '#1565c0',
      marginBottom: '40px',
      animation: 'fadeInUp 1s ease-out 0.2s both',
    },
    searchContainer: {
      position: 'relative',
      maxWidth: '600px',
      margin: '0 auto',
      animation: 'fadeInUp 1s ease-out 0.4s both',
    },
    searchIcon: {
      position: 'absolute',
      left: '20px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '22px',
      height: '22px',
      color: '#1976d2',
      pointerEvents: 'none',
      strokeWidth: '2',
    },
    searchInput: {
      width: '100%',
      padding: '18px 20px 18px 55px',
      border: '3px solid #42a5f5',
      borderRadius: '50px',
      fontSize: '1.05rem',
      outline: 'none',
      transition: 'all 0.3s ease',
      background: 'white',
      boxSizing: 'border-box',
    },
    categoryFilter: {
      maxWidth: '1400px',
      margin: '40px auto',
      padding: '0 20px',
      display: 'flex',
      justifyContent: 'center',
      gap: '15px',
      flexWrap: 'wrap',
    },
    categoryBtn: {
      padding: '12px 30px',
      border: '2px solid #42a5f5',
      background: 'white',
      color: '#1976d2',
      borderRadius: '25px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    categoryBtnActive: {
      background: 'linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)',
      color: 'white',
      borderColor: '#1976d2',
    },
    blogGrid: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '40px 20px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
      gap: '35px',
    },
    blogCard: {
      background: 'white',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(13, 71, 161, 0.1)',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
    },
    blogImageContainer: {
      position: 'relative',
      width: '100%',
      height: '240px',
      overflow: 'hidden',
    },
    blogImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.5s ease',
    },
    categoryBadge: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      background: 'linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)',
      color: 'white',
      padding: '8px 18px',
      borderRadius: '20px',
      fontSize: '0.85rem',
      fontWeight: '600',
      boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
    },
    blogContent: {
      padding: '30px',
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
    },
    blogMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '15px',
      color: '#64b5f6',
      fontSize: '0.9rem',
      fontWeight: '500',
    },
    blogDivider: {
      color: '#90caf9',
    },
    blogTitle: {
      fontSize: '1.5rem',
      color: '#0d47a1',
      marginBottom: '15px',
      fontWeight: '700',
      lineHeight: '1.4',
      transition: 'color 0.3s ease',
    },
    blogExcerpt: {
      color: '#424242',
      fontSize: '1rem',
      lineHeight: '1.6',
      marginBottom: '20px',
      flexGrow: 1,
    },
    blogTags: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      marginBottom: '20px',
    },
    blogTag: {
      background: '#e3f2fd',
      color: '#1976d2',
      padding: '5px 14px',
      borderRadius: '15px',
      fontSize: '0.85rem',
      fontWeight: '500',
      transition: 'all 0.3s ease',
    },
    blogFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: '20px',
      borderTop: '2px solid #e3f2fd',
    },
    blogAuthor: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    authorAvatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #64b5f6 0%, #42a5f5 100%)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '700',
      fontSize: '1.1rem',
    },
    authorName: {
      color: '#1565c0',
      fontWeight: '600',
      fontSize: '0.95rem',
    },
    readMoreBtn: {
      background: 'transparent',
      border: '2px solid #42a5f5',
      color: '#1976d2',
      padding: '10px 20px',
      borderRadius: '25px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.3s ease',
    },
    arrowIcon: {
      width: '18px',
      height: '18px',
      strokeWidth: '2.5',
      transition: 'transform 0.3s ease',
    },
    newsletterSection: {
      maxWidth: '900px',
      margin: '80px auto 60px',
      padding: '0 20px',
    },
    newsletterContent: {
      background: 'white',
      padding: '60px 50px',
      borderRadius: '25px',
      textAlign: 'center',
      boxShadow: '0 15px 40px rgba(13, 71, 161, 0.15)',
    },
    newsletterTitle: {
      fontSize: '2.5rem',
      color: '#0d47a1',
      marginBottom: '15px',
      fontWeight: '700',
    },
    newsletterText: {
      fontSize: '1.15rem',
      color: '#1565c0',
      marginBottom: '35px',
    },
    newsletterForm: {
      display: 'flex',
      gap: '15px',
      maxWidth: '600px',
      margin: '0 auto 20px',
    },
    newsletterInput: {
      flex: 1,
      padding: '16px 25px',
      border: '3px solid #42a5f5',
      borderRadius: '30px',
      fontSize: '1rem',
      outline: 'none',
      transition: 'all 0.3s ease',
    },
    newsletterBtn: {
      background: 'linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)',
      color: 'white',
      border: 'none',
      padding: '16px 40px',
      borderRadius: '30px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 5px 20px rgba(25, 118, 210, 0.3)',
      whiteSpace: 'nowrap',
    },
    newsletterPrivacy: {
      fontSize: '0.9rem',
      color: '#64b5f6',
    },
    featuredTopics: {
      maxWidth: '1400px',
      margin: '0 auto 80px',
      padding: '0 20px',
    },
    featuredTitle: {
      fontSize: '2.5rem',
      color: '#0d47a1',
      textAlign: 'center',
      marginBottom: '40px',
      fontWeight: '700',
    },
    topicsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '25px',
    },
    topicCard: {
      background: 'white',
      padding: '40px 30px',
      borderRadius: '20px',
      textAlign: 'center',
      boxShadow: '0 8px 25px rgba(13, 71, 161, 0.1)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    },
    topicIcon: {
      fontSize: '3rem',
      marginBottom: '20px',
    },
    topicTitle: {
      fontSize: '1.4rem',
      color: '#0d47a1',
      marginBottom: '10px',
      fontWeight: '600',
    },
    topicCount: {
      color: '#1976d2',
      fontSize: '1rem',
      fontWeight: '500',
    },
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .search-input:focus {
            border-color: #1976d2;
            box-shadow: 0 8px 25px rgba(25, 118, 210, 0.2);
            transform: translateY(-2px);
          }

          .search-input::placeholder {
            color: #64b5f6;
          }

          .category-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(66, 165, 245, 0.3);
          }

          .blog-card:hover {
            transform: translateY(-12px);
            box-shadow: 0 20px 50px rgba(13, 71, 161, 0.25);
          }

          .blog-card:hover .blog-image {
            transform: scale(1.1);
          }

          .blog-card:hover .blog-title {
            color: #1976d2;
          }

          .blog-tag:hover {
            background: #42a5f5;
            color: white;
            transform: translateY(-2px);
          }

          .read-more-btn:hover {
            background: linear-gradient(135deg, #42a5f5 0%, #1976d2 100%);
            color: white;
            transform: translateX(5px);
          }

          .read-more-btn:hover .arrow-icon {
            transform: translateX(3px);
          }

          .newsletter-input:focus {
            border-color: #1976d2;
            box-shadow: 0 5px 20px rgba(25, 118, 210, 0.2);
          }

          .newsletter-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(25, 118, 210, 0.5);
          }

          .topic-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 40px rgba(13, 71, 161, 0.2);
          }

          @media (max-width: 768px) {
            .hero-title {
              font-size: 2.5rem !important;
            }
            .hero-subtitle {
              font-size: 1.1rem !important;
            }
            .blog-grid {
              grid-template-columns: 1fr !important;
            }
            .newsletter-form {
              flex-direction: column !important;
            }
            .newsletter-content {
              padding: 40px 30px !important;
            }
            .newsletter-title {
              font-size: 2rem !important;
            }
          }

          @media (max-width: 480px) {
            .hero-title {
              font-size: 2rem !important;
            }
            .featured-title {
              font-size: 2rem !important;
            }
          }
        `}
      </style>

      <div style={styles.container}>
        {/* Hero Section */}
        <div style={styles.hero}>
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle} className="hero-title">Cybersecurity Blog</h1>
            <p style={styles.heroSubtitle} className="hero-subtitle">
              Stay informed with the latest insights, tips, and news in cybersecurity
            </p>
            
            {/* Search Bar */}
            <div style={styles.searchContainer}>
              <svg style={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder="Search articles, topics, or tags..."
                style={styles.searchInput}
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div style={styles.categoryFilter}>
          {categories.map((category) => (
            <button
              key={category}
              style={{
                ...styles.categoryBtn,
                ...(selectedCategory === category ? styles.categoryBtnActive : {})
              }}
              className="category-btn"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div style={styles.blogGrid} className="blog-grid">
          {filteredPosts.map((post) => (
            <article key={post.id} style={styles.blogCard} className="blog-card">
              <div style={styles.blogImageContainer}>
                <img src={post.image} alt={post.title} style={styles.blogImage} className="blog-image" />
                <div style={styles.categoryBadge}>{post.category}</div>
              </div>
              
              <div style={styles.blogContent}>
                <div style={styles.blogMeta}>
                  <span>{post.date}</span>
                  <span style={styles.blogDivider}>•</span>
                  <span>{post.readTime}</span>
                </div>
                
                <h2 style={styles.blogTitle} className="blog-title">{post.title}</h2>
                <p style={styles.blogExcerpt}>{post.excerpt}</p>
                
                <div style={styles.blogTags}>
                  {post.tags.map((tag, index) => (
                    <span key={index} style={styles.blogTag} className="blog-tag">#{tag}</span>
                  ))}
                </div>
                
                <div style={styles.blogFooter}>
                  <div style={styles.blogAuthor}>
                    <div style={styles.authorAvatar}>
                      {post.author.charAt(0)}
                    </div>
                    <span style={styles.authorName}>{post.author}</span>
                  </div>
                  <button style={styles.readMoreBtn} className="read-more-btn">
                    Read More
                    <svg style={styles.arrowIcon} className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Section */}
        <div style={styles.newsletterSection}>
          <div style={styles.newsletterContent} className="newsletter-content">
            <h2 style={styles.newsletterTitle} className="newsletter-title">Stay Updated</h2>
            <p style={styles.newsletterText}>
              Subscribe to our newsletter for the latest cybersecurity insights delivered to your inbox
            </p>
            <div style={styles.newsletterForm} className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email address"
                style={styles.newsletterInput}
                className="newsletter-input"
              />
              <button style={styles.newsletterBtn} className="newsletter-btn">Subscribe</button>
            </div>
            <p style={styles.newsletterPrivacy}>
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>

        {/* Featured Topics */}
        <div style={styles.featuredTopics}>
          <h2 style={styles.featuredTitle} className="featured-title">Popular Topics</h2>
          <div style={styles.topicsGrid}>
            <div style={styles.topicCard} className="topic-card">
              <div style={styles.topicIcon}>🔒</div>
              <h3 style={styles.topicTitle}>Password Security</h3>
              <p style={styles.topicCount}>12 Articles</p>
            </div>
            <div style={styles.topicCard} className="topic-card">
              <div style={styles.topicIcon}>🎣</div>
              <h3 style={styles.topicTitle}>Phishing Attacks</h3>
              <p style={styles.topicCount}>8 Articles</p>
            </div>
            <div style={styles.topicCard} className="topic-card">
              <div style={styles.topicIcon}>🛡️</div>
              <h3 style={styles.topicTitle}>Network Security</h3>
              <p style={styles.topicCount}>15 Articles</p>
            </div>
            <div style={styles.topicCard} className="topic-card">
              <div style={styles.topicIcon}>📱</div>
              <h3 style={styles.topicTitle}>Mobile Security</h3>
              <p style={styles.topicCount}>10 Articles</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;