import React, { useState } from 'react';

const Help_Center = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const helpCategories = [
    {
      id: 1,
      title: 'Getting Started',
      icon: '🚀',
      description: 'Learn the basics of cybersecurity and platform navigation',
      articles: 12,
      color: '#42a5f5'
    },
    {
      id: 2,
      title: 'Account & Security',
      icon: '🔐',
      description: 'Manage your account settings and security preferences',
      articles: 8,
      color: '#1976d2'
    },
    {
      id: 3,
      title: 'Threat Detection',
      icon: '⚠️',
      description: 'Understand how to identify and respond to threats',
      articles: 15,
      color: '#1565c0'
    },
    {
      id: 4,
      title: 'Best Practices',
      icon: '✅',
      description: 'Follow recommended security practices and guidelines',
      articles: 10,
      color: '#0d47a1'
    },
    {
      id: 5,
      title: 'Tools & Features',
      icon: '🛠️',
      description: 'Explore platform features and security tools',
      articles: 14,
      color: '#42a5f5'
    },
    {
      id: 6,
      title: 'Troubleshooting',
      icon: '🔧',
      description: 'Solve common issues and technical problems',
      articles: 9,
      color: '#1976d2'
    }
  ];

  const popularArticles = [
    {
      id: 1,
      title: 'How to Enable Two-Factor Authentication',
      category: 'Account & Security',
      views: '2.5K',
      readTime: '3 min'
    },
    {
      id: 2,
      title: 'Understanding Phishing Email Indicators',
      category: 'Threat Detection',
      views: '1.8K',
      readTime: '5 min'
    },
    {
      id: 3,
      title: 'Creating Strong Passwords: Complete Guide',
      category: 'Best Practices',
      views: '3.2K',
      readTime: '4 min'
    },
    {
      id: 4,
      title: 'Setting Up Your Security Dashboard',
      category: 'Getting Started',
      views: '1.5K',
      readTime: '6 min'
    },
    {
      id: 5,
      title: 'Using the Threat Scanner Tool',
      category: 'Tools & Features',
      views: '2.1K',
      readTime: '7 min'
    },
    {
      id: 6,
      title: 'Why Am I Locked Out of My Account?',
      category: 'Troubleshooting',
      views: '1.2K',
      readTime: '3 min'
    }
  ];

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      paddingBottom: '60px',
    },
    hero: {
      textAlign: 'center',
      padding: '80px 20px 60px',
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
      backdropFilter: 'blur(10px)',
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
      maxWidth: '700px',
      margin: '0 auto 40px',
      animation: 'fadeInUp 1s ease-out 0.2s both',
    },
    searchContainer: {
      position: 'relative',
      maxWidth: '700px',
      margin: '0 auto',
      animation: 'fadeInUp 1s ease-out 0.4s both',
    },
    searchIcon: {
      position: 'absolute',
      left: '25px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '24px',
      height: '24px',
      color: '#1976d2',
      pointerEvents: 'none',
      strokeWidth: '2.5',
    },
    searchInput: {
      width: '100%',
      padding: '20px 25px 20px 65px',
      border: '3px solid #42a5f5',
      borderRadius: '50px',
      fontSize: '1.1rem',
      outline: 'none',
      transition: 'all 0.3s ease',
      background: 'white',
      boxSizing: 'border-box',
    },
    categoriesSection: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '60px 20px 40px',
    },
    sectionTitle: {
      fontSize: '2.5rem',
      color: '#0d47a1',
      textAlign: 'center',
      marginBottom: '50px',
      fontWeight: '700',
    },
    categoriesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '30px',
    },
    categoryCard: {
      background: 'white',
      borderRadius: '20px',
      padding: '40px 30px',
      boxShadow: '0 10px 30px rgba(13, 71, 161, 0.1)',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
    },
    categoryIcon: {
      fontSize: '3.5rem',
      marginBottom: '20px',
      display: 'block',
    },
    categoryTitle: {
      fontSize: '1.6rem',
      color: '#0d47a1',
      marginBottom: '12px',
      fontWeight: '700',
    },
    categoryDescription: {
      fontSize: '1rem',
      color: '#616161',
      lineHeight: '1.6',
      marginBottom: '20px',
    },
    categoryArticles: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#1976d2',
      fontWeight: '600',
      fontSize: '0.95rem',
    },
    categoryAccent: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '5px',
      transition: 'height 0.3s ease',
    },
    popularSection: {
      maxWidth: '1200px',
      margin: '60px auto 0',
      padding: '0 20px',
    },
    articlesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '25px',
    },
    articleCard: {
      background: 'white',
      borderRadius: '15px',
      padding: '25px',
      boxShadow: '0 8px 25px rgba(13, 71, 161, 0.1)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    articleHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: '15px',
    },
    articleTitle: {
      fontSize: '1.2rem',
      color: '#0d47a1',
      fontWeight: '600',
      lineHeight: '1.4',
      flex: 1,
    },
    articleBadge: {
      background: '#e3f2fd',
      color: '#1976d2',
      padding: '6px 14px',
      borderRadius: '15px',
      fontSize: '0.8rem',
      fontWeight: '600',
      whiteSpace: 'nowrap',
    },
    articleMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      fontSize: '0.9rem',
      color: '#64b5f6',
      fontWeight: '500',
    },
    metaItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    quickLinksSection: {
      maxWidth: '1400px',
      margin: '60px auto 0',
      padding: '0 20px',
    },
    quickLinksGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '25px',
    },
    quickLinkCard: {
      background: 'white',
      borderRadius: '15px',
      padding: '30px',
      textAlign: 'center',
      boxShadow: '0 8px 25px rgba(13, 71, 161, 0.1)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    },
    quickLinkIcon: {
      fontSize: '2.5rem',
      marginBottom: '15px',
    },
    quickLinkTitle: {
      fontSize: '1.3rem',
      color: '#0d47a1',
      fontWeight: '600',
      marginBottom: '8px',
    },
    quickLinkText: {
      fontSize: '0.95rem',
      color: '#616161',
    },
    ctaSection: {
      maxWidth: '900px',
      margin: '80px auto 0',
      padding: '0 20px',
    },
    ctaCard: {
      background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
      borderRadius: '25px',
      padding: '60px 40px',
      textAlign: 'center',
      boxShadow: '0 15px 40px rgba(13, 71, 161, 0.2)',
      color: 'white',
    },
    ctaTitle: {
      fontSize: '2.2rem',
      fontWeight: '700',
      marginBottom: '15px',
    },
    ctaText: {
      fontSize: '1.15rem',
      marginBottom: '30px',
      opacity: 0.95,
    },
    ctaButton: {
      background: 'white',
      color: '#1976d2',
      border: 'none',
      padding: '16px 45px',
      fontSize: '1.1rem',
      fontWeight: '600',
      borderRadius: '30px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.2)',
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
            box-shadow: 0 10px 30px rgba(25, 118, 210, 0.25);
            transform: translateY(-3px);
          }

          .search-input::placeholder {
            color: #90caf9;
          }

          .category-card:hover {
            transform: translateY(-12px);
            box-shadow: 0 20px 50px rgba(13, 71, 161, 0.2);
          }

          .category-card:hover .category-accent {
            height: 15px;
          }

          .article-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 15px 40px rgba(13, 71, 161, 0.2);
          }

          .article-card:hover .article-title {
            color: #1976d2;
          }

          .quick-link-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 15px 40px rgba(13, 71, 161, 0.2);
          }

          .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          }

          @media (max-width: 768px) {
            .hero-title {
              font-size: 2.5rem !important;
            }
            .hero-subtitle {
              font-size: 1.1rem !important;
            }
            .section-title {
              font-size: 2rem !important;
            }
            .categories-grid {
              grid-template-columns: 1fr !important;
            }
            .articles-grid {
              grid-template-columns: 1fr !important;
            }
            .cta-card {
              padding: 40px 25px !important;
            }
          }

          @media (max-width: 480px) {
            .hero-title {
              font-size: 2rem !important;
            }
          }
        `}
      </style>

      <div style={styles.container}>
        {/* Hero Section */}
        <div style={styles.hero}>
          <h1 style={styles.heroTitle} className="hero-title">Help Center</h1>
          <p style={styles.heroSubtitle} className="hero-subtitle">
            Find answers, learn best practices, and get the support you need
          </p>
          
          {/* Search Bar */}
          <div style={styles.searchContainer}>
            <svg style={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              placeholder="Search for help articles, guides, and tutorials..."
              style={styles.searchInput}
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Categories Section */}
        <div style={styles.categoriesSection}>
          <h2 style={styles.sectionTitle} className="section-title">Browse by Category</h2>
          <div style={styles.categoriesGrid} className="categories-grid">
            {helpCategories.map((category) => (
              <div key={category.id} style={styles.categoryCard} className="category-card">
                <span style={styles.categoryIcon}>{category.icon}</span>
                <h3 style={styles.categoryTitle}>{category.title}</h3>
                <p style={styles.categoryDescription}>{category.description}</p>
                <div style={styles.categoryArticles}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="18" height="18" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                  <span>{category.articles} Articles</span>
                </div>
                <div style={{...styles.categoryAccent, background: category.color}} className="category-accent"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Articles */}
        <div style={styles.popularSection}>
          <h2 style={styles.sectionTitle} className="section-title">Popular Articles</h2>
          <div style={styles.articlesGrid} className="articles-grid">
            {popularArticles.map((article) => (
              <div key={article.id} style={styles.articleCard} className="article-card">
                <div style={styles.articleHeader}>
                  <h3 style={styles.articleTitle} className="article-title">{article.title}</h3>
                  <span style={styles.articleBadge}>{article.category}</span>
                </div>
                <div style={styles.articleMeta}>
                  <div style={styles.metaItem}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <span>{article.views} views</span>
                  </div>
                  <div style={styles.metaItem}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div style={styles.quickLinksSection}>
          <h2 style={styles.sectionTitle} className="section-title">Quick Links</h2>
          <div style={styles.quickLinksGrid}>
            <div style={styles.quickLinkCard} className="quick-link-card">
              <div style={styles.quickLinkIcon}>📚</div>
              <h3 style={styles.quickLinkTitle}>Documentation</h3>
              <p style={styles.quickLinkText}>Complete platform documentation</p>
            </div>
            <div style={styles.quickLinkCard} className="quick-link-card">
              <div style={styles.quickLinkIcon}>🎓</div>
              <h3 style={styles.quickLinkTitle}>Video Tutorials</h3>
              <p style={styles.quickLinkText}>Learn with step-by-step videos</p>
            </div>
            <div style={styles.quickLinkCard} className="quick-link-card">
              <div style={styles.quickLinkIcon}>💬</div>
              <h3 style={styles.quickLinkTitle}>Community Forum</h3>
              <p style={styles.quickLinkText}>Connect with other users</p>
            </div>
            <div style={styles.quickLinkCard} className="quick-link-card">
              <div style={styles.quickLinkIcon}>📖</div>
              <h3 style={styles.quickLinkTitle}>Release Notes</h3>
              <p style={styles.quickLinkText}>Stay updated with new features</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div style={styles.ctaSection}>
          <div style={styles.ctaCard}>
            <h2 style={styles.ctaTitle}>Can't Find What You're Looking For?</h2>
            <p style={styles.ctaText}>
              Our support team is here to help you 24/7
            </p>
            <button style={styles.ctaButton} className="cta-button">Contact Support</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Help_Center;