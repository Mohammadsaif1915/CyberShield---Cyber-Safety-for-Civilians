import React, { useState, useEffect } from 'react';

const Help_Center = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [filteredArticles, setFilteredArticles] = useState([]);

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

  const allArticles = [
    {
      id: 1,
      title: 'How to Enable Two-Factor Authentication',
      category: 'Account & Security',
      views: '2.5K',
      readTime: '3 min',
      content: `
        <h2>Two-Factor Authentication (2FA) Setup Guide</h2>
        <p>Two-factor authentication adds an extra layer of security to your account by requiring two forms of identification.</p>
        
        <h3>Step 1: Access Security Settings</h3>
        <p>Navigate to your account settings by clicking on your profile icon in the top right corner, then select "Security Settings".</p>
        
        <h3>Step 2: Enable 2FA</h3>
        <p>Click on the "Enable Two-Factor Authentication" button. You'll be presented with several authentication methods:</p>
        <ul>
          <li>Authenticator App (Recommended)</li>
          <li>SMS Text Message</li>
          <li>Email Verification</li>
        </ul>
        
        <h3>Step 3: Scan QR Code</h3>
        <p>If using an authenticator app, scan the QR code with apps like Google Authenticator, Authy, or Microsoft Authenticator.</p>
        
        <h3>Step 4: Verify Setup</h3>
        <p>Enter the 6-digit code from your authenticator app to verify the setup.</p>
        
        <h3>Step 5: Save Backup Codes</h3>
        <p>Download and securely store your backup codes. These can be used if you lose access to your 2FA device.</p>
        
        <div style="background: #e3f2fd; padding: 20px; border-radius: 10px; margin-top: 20px;">
          <strong>Pro Tip:</strong> Keep your backup codes in a secure location like a password manager or safe.
        </div>
      `
    },
    {
      id: 2,
      title: 'Understanding Phishing Email Indicators',
      category: 'Threat Detection',
      views: '1.8K',
      readTime: '5 min',
      content: `
        <h2>Identifying Phishing Emails</h2>
        <p>Phishing emails are fraudulent messages designed to steal your personal information. Learn to spot the warning signs.</p>
        
        <h3>Common Phishing Indicators</h3>
        <ul>
          <li><strong>Suspicious sender address:</strong> Check if the email domain matches the official company domain</li>
          <li><strong>Generic greetings:</strong> "Dear Customer" instead of your name</li>
          <li><strong>Urgent language:</strong> Claims of account suspension or security threats</li>
          <li><strong>Spelling and grammar errors:</strong> Professional companies proofread their emails</li>
          <li><strong>Suspicious links:</strong> Hover over links to see the actual URL before clicking</li>
          <li><strong>Unexpected attachments:</strong> Don't open attachments from unknown senders</li>
        </ul>
        
        <h3>What to Do If You Suspect Phishing</h3>
        <ol>
          <li>Don't click any links or download attachments</li>
          <li>Don't reply to the email</li>
          <li>Report it to your IT security team</li>
          <li>Delete the email</li>
          <li>If you clicked a link, change your passwords immediately</li>
        </ol>
        
        <div style="background: #fff3e0; padding: 20px; border-radius: 10px; margin-top: 20px;">
          <strong>Warning:</strong> Always verify unexpected requests for sensitive information through official channels.
        </div>
      `
    },
    {
      id: 3,
      title: 'Creating Strong Passwords: Complete Guide',
      category: 'Best Practices',
      views: '3.2K',
      readTime: '4 min',
      content: `
        <h2>Password Security Best Practices</h2>
        <p>Strong passwords are your first line of defense against unauthorized access.</p>
        
        <h3>Password Requirements</h3>
        <ul>
          <li>Minimum 12 characters (longer is better)</li>
          <li>Mix of uppercase and lowercase letters</li>
          <li>Include numbers and special characters</li>
          <li>Avoid dictionary words and personal information</li>
          <li>Don't reuse passwords across different accounts</li>
        </ul>
        
        <h3>Password Creation Strategies</h3>
        <p><strong>Method 1: Passphrase</strong><br>
        Use a memorable phrase: "I love coffee in the morning!" → ILc!itm2024</p>
        
        <p><strong>Method 2: Password Manager</strong><br>
        Let a password manager generate and store complex passwords for you.</p>
        
        <h3>What to Avoid</h3>
        <ul>
          <li>Personal information (birthdays, names, addresses)</li>
          <li>Common words or patterns (password123, qwerty)</li>
          <li>Sequential numbers or letters</li>
          <li>Same password for multiple accounts</li>
        </ul>
        
        <div style="background: #e8f5e9; padding: 20px; border-radius: 10px; margin-top: 20px;">
          <strong>Recommended:</strong> Use a reputable password manager like 1Password, LastPass, or Bitwarden.
        </div>
      `
    },
    {
      id: 4,
      title: 'Setting Up Your Security Dashboard',
      category: 'Getting Started',
      views: '1.5K',
      readTime: '6 min',
      content: `
        <h2>Security Dashboard Setup</h2>
        <p>Your security dashboard provides a comprehensive view of your security posture.</p>
        
        <h3>Initial Setup</h3>
        <ol>
          <li>Log into your account</li>
          <li>Navigate to the Dashboard tab</li>
          <li>Click "Customize Dashboard"</li>
          <li>Select the widgets you want to display</li>
        </ol>
        
        <h3>Available Widgets</h3>
        <ul>
          <li><strong>Threat Overview:</strong> Real-time threat monitoring</li>
          <li><strong>Security Score:</strong> Overall security health metric</li>
          <li><strong>Recent Activity:</strong> Latest security events</li>
          <li><strong>Alerts:</strong> Critical notifications</li>
          <li><strong>Compliance Status:</strong> Regulatory compliance tracking</li>
        </ul>
        
        <h3>Customization Tips</h3>
        <p>Drag and drop widgets to rearrange them. Resize widgets by dragging the corner handles. Set up automated reports to receive regular security summaries.</p>
        
        <div style="background: #e3f2fd; padding: 20px; border-radius: 10px; margin-top: 20px;">
          <strong>Tip:</strong> Start with the essential widgets and add more as you become familiar with the platform.
        </div>
      `
    },
    {
      id: 5,
      title: 'Using the Threat Scanner Tool',
      category: 'Tools & Features',
      views: '2.1K',
      readTime: '7 min',
      content: `
        <h2>Threat Scanner Guide</h2>
        <p>The Threat Scanner helps you identify potential security vulnerabilities in your system.</p>
        
        <h3>Running a Scan</h3>
        <ol>
          <li>Navigate to Tools → Threat Scanner</li>
          <li>Select scan type (Quick, Full, or Custom)</li>
          <li>Choose target systems or networks</li>
          <li>Click "Start Scan"</li>
        </ol>
        
        <h3>Scan Types</h3>
        <p><strong>Quick Scan:</strong> Fast scan of critical areas (5-10 minutes)<br>
        <strong>Full Scan:</strong> Comprehensive system analysis (30-60 minutes)<br>
        <strong>Custom Scan:</strong> Target specific areas or file types</p>
        
        <h3>Understanding Results</h3>
        <ul>
          <li><span style="color: #d32f2f;">🔴 Critical:</span> Immediate action required</li>
          <li><span style="color: #f57c00;">🟠 High:</span> Address within 24 hours</li>
          <li><span style="color: #fbc02d;">🟡 Medium:</span> Address within 7 days</li>
          <li><span style="color: #388e3c;">🟢 Low:</span> Monitor and address when possible</li>
        </ul>
        
        <h3>Scheduled Scans</h3>
        <p>Set up automatic scans to run daily, weekly, or monthly. Receive email notifications when scans complete.</p>
      `
    },
    {
      id: 6,
      title: 'Why Am I Locked Out of My Account?',
      category: 'Troubleshooting',
      views: '1.2K',
      readTime: '3 min',
      content: `
        <h2>Account Lockout Troubleshooting</h2>
        <p>Account lockouts are a security measure to protect your account from unauthorized access.</p>
        
        <h3>Common Causes</h3>
        <ul>
          <li>Too many failed login attempts (usually 5-10)</li>
          <li>Suspicious activity detected</li>
          <li>Password expired</li>
          <li>Account flagged for security review</li>
        </ul>
        
        <h3>How to Unlock Your Account</h3>
        <ol>
          <li>Wait 15-30 minutes for automatic unlock</li>
          <li>Use the "Forgot Password" link to reset</li>
          <li>Contact support if issue persists</li>
          <li>Verify your identity with backup email or phone</li>
        </ol>
        
        <h3>Prevention Tips</h3>
        <ul>
          <li>Use a password manager to avoid typos</li>
          <li>Enable 2FA for additional security</li>
          <li>Keep your contact information up to date</li>
          <li>Don't share your account credentials</li>
        </ul>
        
        <div style="background: #ffebee; padding: 20px; border-radius: 10px; margin-top: 20px;">
          <strong>Need Help?</strong> Contact our support team 24/7 at support@cybersecurity.com
        </div>
      `
    }
  ];

  // Filter articles whenever search query or category changes
  useEffect(() => {
    let filtered = [...allArticles];

    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    setFilteredArticles(filtered);

    // Auto-scroll to results if searching
    if (searchQuery.trim() !== '') {
      setTimeout(() => {
        const articlesSection = document.getElementById('articles-section');
        if (articlesSection) {
          articlesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }, [searchQuery, selectedCategory]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setSelectedCategory('All');
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      // Scroll to articles section when Enter is pressed
      setTimeout(() => {
        const articlesSection = document.getElementById('articles-section');
        if (articlesSection) {
          articlesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const handleCategoryClick = (categoryTitle) => {
    setSelectedCategory(categoryTitle);
    setSearchQuery('');
    setTimeout(() => {
      const articlesSection = document.getElementById('articles-section');
      if (articlesSection) {
        articlesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    setCurrentView('article');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedArticle(null);
    setSearchQuery('');
    setSelectedCategory('All');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickLink = (view) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilter = () => {
    setSearchQuery('');
    setSelectedCategory('All');
  };

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
      zIndex: 10,
      opacity: 0.7,
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
      position: 'relative',
      zIndex: 1,
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
    noResults: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#616161',
      fontSize: '1.2rem',
    },
    filterInfo: {
      textAlign: 'center',
      marginBottom: '30px',
      color: '#1976d2',
      fontSize: '1.1rem',
      fontWeight: '600',
    },
    clearButton: {
      background: '#42a5f5',
      color: 'white',
      border: 'none',
      padding: '10px 25px',
      borderRadius: '20px',
      cursor: 'pointer',
      marginLeft: '15px',
      fontSize: '0.95rem',
      fontWeight: '600',
      transition: 'all 0.3s ease',
    },
    articleView: {
      maxWidth: '900px',
      margin: '0 auto',
      padding: '40px 20px',
    },
    backButton: {
      background: '#42a5f5',
      color: 'white',
      border: 'none',
      padding: '12px 30px',
      borderRadius: '25px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '600',
      marginBottom: '30px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      transition: 'all 0.3s ease',
    },
    articleContent: {
      background: 'white',
      borderRadius: '20px',
      padding: '50px',
      boxShadow: '0 10px 40px rgba(13, 71, 161, 0.1)',
    },
    articleContentTitle: {
      fontSize: '2.5rem',
      color: '#0d47a1',
      marginBottom: '20px',
      fontWeight: '700',
    },
    articleContentMeta: {
      display: 'flex',
      gap: '30px',
      paddingBottom: '30px',
      borderBottom: '2px solid #e3f2fd',
      marginBottom: '30px',
      flexWrap: 'wrap',
    },
    contentBody: {
      fontSize: '1.1rem',
      lineHeight: '1.8',
      color: '#424242',
    },
    pageView: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
    },
    pageContent: {
      background: 'white',
      borderRadius: '20px',
      padding: '50px',
      boxShadow: '0 10px 40px rgba(13, 71, 161, 0.1)',
      minHeight: '60vh',
    },
    pageTitle: {
      fontSize: '2.5rem',
      color: '#0d47a1',
      marginBottom: '30px',
      fontWeight: '700',
    },
    pageText: {
      fontSize: '1.1rem',
      lineHeight: '1.8',
      color: '#616161',
    },
  };

  // Article View
  if (currentView === 'article' && selectedArticle) {
    return (
      <>
        <style>
          {`
            @keyframes fadeInDown {
              from { opacity: 0; transform: translateY(-30px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(30px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .back-button:hover {
              background: #1976d2;
              transform: translateX(-5px);
            }
            .content-body h2 {
              color: #0d47a1;
              font-size: 1.8rem;
              margin-top: 30px;
              margin-bottom: 15px;
              font-weight: 600;
            }
            .content-body h3 {
              color: #1565c0;
              font-size: 1.4rem;
              margin-top: 25px;
              margin-bottom: 12px;
              font-weight: 600;
            }
            .content-body ul, .content-body ol {
              margin: 15px 0;
              padding-left: 30px;
            }
            .content-body li {
              margin: 10px 0;
            }
            .content-body p {
              margin: 15px 0;
            }
          `}
        </style>
        <div style={styles.container}>
          <div style={styles.articleView}>
            <button style={styles.backButton} className="back-button" onClick={handleBackToHome}>
              ← Back to Help Center
            </button>
            <div style={styles.articleContent}>
              <h1 style={styles.articleContentTitle}>{selectedArticle.title}</h1>
              <div style={styles.articleContentMeta}>
                <div style={styles.metaItem}>
                  <span style={styles.articleBadge}>{selectedArticle.category}</span>
                </div>
                <div style={styles.metaItem}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#64b5f6" width="20" height="20" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <span style={{ color: '#64b5f6', marginLeft: '8px' }}>{selectedArticle.views} views</span>
                </div>
                <div style={styles.metaItem}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#64b5f6" width="20" height="20" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span style={{ color: '#64b5f6', marginLeft: '8px' }}>{selectedArticle.readTime} read</span>
                </div>
              </div>
              <div 
                style={styles.contentBody} 
                className="content-body"
                dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  // Quick Link Pages
  if (currentView === 'documentation') {
    return (
      <div style={styles.container}>
        <div style={styles.pageView}>
          <button style={styles.backButton} className="back-button" onClick={handleBackToHome}>
            ← Back to Help Center
          </button>
          <div style={styles.pageContent}>
            <h1 style={styles.pageTitle}>📚 Documentation</h1>
            <div style={styles.pageText}>
              <h3 style={{ color: '#1565c0', fontSize: '1.5rem', marginBottom: '20px' }}>Complete Platform Documentation</h3>
              <p>Welcome to our comprehensive documentation center. Here you'll find detailed guides, API references, and technical specifications for all platform features.</p>
              
              <h3 style={{ color: '#1565c0', fontSize: '1.3rem', marginTop: '30px', marginBottom: '15px' }}>Documentation Sections:</h3>
              <ul style={{ lineHeight: '2' }}>
                <li><strong>Getting Started Guide</strong> - New user onboarding and setup</li>
                <li><strong>API Reference</strong> - Complete API documentation and endpoints</li>
                <li><strong>Security Features</strong> - In-depth security tools and configurations</li>
                <li><strong>Integration Guides</strong> - Third-party integrations and plugins</li>
                <li><strong>Advanced Features</strong> - Expert-level features and customization</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'tutorials') {
    return (
      <div style={styles.container}>
        <div style={styles.pageView}>
          <button style={styles.backButton} className="back-button" onClick={handleBackToHome}>
            ← Back to Help Center
          </button>
          <div style={styles.pageContent}>
            <h1 style={styles.pageTitle}>🎓 Video Tutorials</h1>
            <div style={styles.pageText}>
              <h3 style={{ color: '#1565c0', fontSize: '1.5rem', marginBottom: '20px' }}>Learn with Step-by-Step Videos</h3>
              <p>Our video library contains hours of tutorial content to help you master every aspect of cybersecurity.</p>
              
              <h3 style={{ color: '#1565c0', fontSize: '1.3rem', marginTop: '30px', marginBottom: '15px' }}>Featured Tutorial Series:</h3>
              <ul style={{ lineHeight: '2' }}>
                <li><strong>Beginner Series</strong> - Introduction to cybersecurity basics (15 videos)</li>
                <li><strong>Account Security</strong> - Protect your account and data (8 videos)</li>
                <li><strong>Threat Detection</strong> - Identify and respond to threats (12 videos)</li>
                <li><strong>Tool Walkthroughs</strong> - Master platform features (20 videos)</li>
                <li><strong>Advanced Topics</strong> - Expert-level security techniques (10 videos)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'forum') {
    return (
      <div style={styles.container}>
        <div style={styles.pageView}>
          <button style={styles.backButton} className="back-button" onClick={handleBackToHome}>
            ← Back to Help Center
          </button>
          <div style={styles.pageContent}>
            <h1 style={styles.pageTitle}>💬 Community Forum</h1>
            <div style={styles.pageText}>
              <h3 style={{ color: '#1565c0', fontSize: '1.5rem', marginBottom: '20px' }}>Connect with Other Users</h3>
              <p>Join our vibrant community of cybersecurity professionals and enthusiasts. Share knowledge, ask questions, and learn from others.</p>
              
              <h3 style={{ color: '#1565c0', fontSize: '1.3rem', marginTop: '30px', marginBottom: '15px' }}>Popular Forum Categories:</h3>
              <ul style={{ lineHeight: '2' }}>
                <li><strong>General Discussion</strong> - Talk about anything security-related</li>
                <li><strong>Questions & Answers</strong> - Get help from the community</li>
                <li><strong>Feature Requests</strong> - Suggest new features and improvements</li>
                <li><strong>Bug Reports</strong> - Report issues and track fixes</li>
                <li><strong>Best Practices</strong> - Share your security tips and tricks</li>
              </ul>
              
              <div style={{ background: '#e3f2fd', padding: '20px', borderRadius: '10px', marginTop: '30px' }}>
                <strong>Community Stats:</strong> 50,000+ members • 10,000+ discussions • 95% response rate
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'releases') {
    return (
      <div style={styles.container}>
        <div style={styles.pageView}>
          <button style={styles.backButton} className="back-button" onClick={handleBackToHome}>
            ← Back to Help Center
          </button>
          <div style={styles.pageContent}>
            <h1 style={styles.pageTitle}>📖 Release Notes</h1>
            <div style={styles.pageText}>
              <h3 style={{ color: '#1565c0', fontSize: '1.5rem', marginBottom: '20px' }}>Stay Updated with New Features</h3>
              <p>Track all platform updates, new features, improvements, and bug fixes.</p>
              
              <h3 style={{ color: '#1565c0', fontSize: '1.3rem', marginTop: '30px', marginBottom: '15px' }}>Latest Release - v3.5.0 (March 2026)</h3>
              <ul style={{ lineHeight: '2' }}>
                <li><strong>New:</strong> Enhanced threat detection algorithms</li>
                <li><strong>New:</strong> Real-time collaborative security monitoring</li>
                <li><strong>Improved:</strong> Dashboard performance (50% faster)</li>
                <li><strong>Improved:</strong> Mobile app UI/UX redesign</li>
                <li><strong>Fixed:</strong> Various bug fixes and stability improvements</li>
              </ul>
              
              <h3 style={{ color: '#1565c0', fontSize: '1.3rem', marginTop: '30px', marginBottom: '15px' }}>Previous Releases:</h3>
              <ul style={{ lineHeight: '2' }}>
                <li><strong>v3.4.0</strong> - Advanced reporting features</li>
                <li><strong>v3.3.0</strong> - API rate limit improvements</li>
                <li><strong>v3.2.0</strong> - Multi-factor authentication enhancements</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Home View
  return (
    <>
      <style>
        {`
          @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
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
          .clear-button:hover {
            background: #1976d2;
            transform: translateY(-2px);
          }
          .back-button:hover {
            background: #1976d2;
            transform: translateX(-5px);
          }
          @media (max-width: 768px) {
            .hero-title { font-size: 2.5rem !important; }
            .hero-subtitle { font-size: 1.1rem !important; }
            .section-title { font-size: 2rem !important; }
            .categories-grid { grid-template-columns: 1fr !important; }
            .articles-grid { grid-template-columns: 1fr !important; }
            .cta-card { padding: 40px 25px !important; }
          }
          @media (max-width: 480px) {
            .hero-title { font-size: 2rem !important; }
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
              onChange={handleSearch}
              onKeyPress={handleSearchKeyPress}
            />
          </div>
        </div>

        {/* Categories Section */}
        <div style={styles.categoriesSection}>
          <h2 style={styles.sectionTitle} className="section-title">Browse by Category</h2>
          <div style={styles.categoriesGrid} className="categories-grid">
            {helpCategories.map((category) => (
              <div 
                key={category.id} 
                style={styles.categoryCard} 
                className="category-card"
                onClick={() => handleCategoryClick(category.title)}
              >
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
        <div style={styles.popularSection} id="articles-section">
          <h2 style={styles.sectionTitle} className="section-title">
            {searchQuery.trim() !== '' ? 'Search Results' : selectedCategory !== 'All' ? `${selectedCategory} Articles` : 'Popular Articles'}
          </h2>
          
          {(searchQuery.trim() !== '' || selectedCategory !== 'All') && (
            <div style={styles.filterInfo}>
              {searchQuery.trim() !== '' ? `Showing results for "${searchQuery}"` : `Showing articles in: ${selectedCategory}`}
              <button 
                style={styles.clearButton}
                className="clear-button"
                onClick={handleClearFilter}
              >
                Clear Filter
              </button>
            </div>
          )}

          {filteredArticles.length === 0 ? (
            <div style={styles.noResults}>
              No articles found. Try a different search term or category.
            </div>
          ) : (
            <div style={styles.articlesGrid} className="articles-grid">
              {filteredArticles.map((article) => (
                <div 
                  key={article.id} 
                  style={styles.articleCard} 
                  className="article-card"
                  onClick={() => handleArticleClick(article)}
                >
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
          )}
        </div>

        {/* Quick Links */}
        <div style={styles.quickLinksSection}>
          <h2 style={styles.sectionTitle} className="section-title">Quick Links</h2>
          <div style={styles.quickLinksGrid}>
            <div style={styles.quickLinkCard} className="quick-link-card" onClick={() => handleQuickLink('documentation')}>
              <div style={styles.quickLinkIcon}>📚</div>
              <h3 style={styles.quickLinkTitle}>Documentation</h3>
              <p style={styles.quickLinkText}>Complete platform documentation</p>
            </div>
            <div style={styles.quickLinkCard} className="quick-link-card" onClick={() => handleQuickLink('tutorials')}>
              <div style={styles.quickLinkIcon}>🎓</div>
              <h3 style={styles.quickLinkTitle}>Video Tutorials</h3>
              <p style={styles.quickLinkText}>Learn with step-by-step videos</p>
            </div>
            <div style={styles.quickLinkCard} className="quick-link-card" onClick={() => handleQuickLink('forum')}>
              <div style={styles.quickLinkIcon}>💬</div>
              <h3 style={styles.quickLinkTitle}>Community Forum</h3>
              <p style={styles.quickLinkText}>Connect with other users</p>
            </div>
            <div style={styles.quickLinkCard} className="quick-link-card" onClick={() => handleQuickLink('releases')}>
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
            <button style={styles.ctaButton} className="cta-button" onClick={() => window.open('mailto:support@cybersecurity.com', '_blank')}>
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Help_Center;