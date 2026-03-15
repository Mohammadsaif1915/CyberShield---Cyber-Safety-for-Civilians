import React, { useState } from 'react';

const Faq = () => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Getting Started', 'Security', 'Account', 'Billing', 'Technical'];

  const faqs = [
    {
      id: 1,
      category: 'Getting Started',
      question: 'What is the Cyber Security Awareness Platform?',
      answer: 'Our platform is a comprehensive cybersecurity education and awareness solution designed to help individuals and organizations protect themselves against digital threats. We provide training, resources, threat detection tools, and real-time security updates to keep you informed and protected.'
    },
    {
      id: 2,
      category: 'Getting Started',
      question: 'How do I get started with the platform?',
      answer: 'Getting started is easy! Simply create an account, complete your profile, and take our initial security assessment. Based on your results, we\'ll recommend personalized learning paths and security tools to help you improve your cybersecurity posture.'
    },
    {
      id: 3,
      category: 'Security',
      question: 'How does two-factor authentication work?',
      answer: 'Two-factor authentication (2FA) adds an extra layer of security to your account. After entering your password, you\'ll need to provide a second verification method - either a code sent to your phone, an authenticator app code, or a biometric verification. This ensures that even if someone has your password, they can\'t access your account without the second factor.'
    },
    {
      id: 4,
      category: 'Security',
      question: 'What should I do if I suspect a phishing attempt?',
      answer: 'If you receive a suspicious email or message: 1) Don\'t click any links or download attachments, 2) Check the sender\'s email address carefully, 3) Look for spelling errors and urgent language, 4) Verify the request through official channels, 5) Report it to our security team immediately using the Report Phishing button in your dashboard.'
    },
    {
      id: 5,
      category: 'Security',
      question: 'How often should I update my passwords?',
      answer: 'We recommend updating your passwords every 90 days for critical accounts. However, you should change them immediately if: you suspect your account has been compromised, you\'ve used the same password on a breached service, or you\'ve shared your password with someone. Always use unique, strong passwords for each account.'
    },
    {
      id: 6,
      category: 'Account',
      question: 'How do I reset my password?',
      answer: 'Click on "Forgot Password" on the login page, enter your registered email address, and we\'ll send you a secure reset link. The link expires in 24 hours. If you don\'t receive the email, check your spam folder or contact our support team.'
    },
    {
      id: 7,
      category: 'Account',
      question: 'Can I use the same account on multiple devices?',
      answer: 'Yes! Your account can be accessed from any device with an internet connection. We recommend enabling 2FA for added security when accessing from new devices. You can manage all your active sessions from the Security Settings page.'
    },
    {
      id: 8,
      category: 'Account',
      question: 'How do I delete my account?',
      answer: 'We\'re sorry to see you go! To delete your account, go to Settings > Account > Delete Account. You\'ll need to confirm your password and the deletion. Note: This action is permanent and will delete all your data, progress, and certificates. You have 30 days to cancel the deletion before it becomes final.'
    },
    {
      id: 9,
      category: 'Billing',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), debit cards, PayPal, and bank transfers for enterprise accounts. All payments are processed securely through encrypted channels. We never store your complete credit card information.'
    },
    {
      id: 10,
      category: 'Billing',
      question: 'Can I upgrade or downgrade my plan?',
      answer: 'Absolutely! You can change your plan at any time from the Billing section in your account settings. Upgrades take effect immediately, while downgrades will take effect at the end of your current billing cycle. Any prorated amounts will be credited to your account.'
    },
    {
      id: 11,
      category: 'Billing',
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee for all new subscriptions. If you\'re not satisfied within the first 30 days, contact our support team for a full refund. After 30 days, refunds are handled on a case-by-case basis depending on the circumstances.'
    },
    {
      id: 12,
      category: 'Technical',
      question: 'Which browsers are supported?',
      answer: 'Our platform works best on the latest versions of Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience and security. Mobile users can access the platform through their mobile browsers or our dedicated iOS and Android apps.'
    },
    {
      id: 13,
      category: 'Technical',
      question: 'Why am I experiencing slow loading times?',
      answer: 'Slow loading can be caused by several factors: slow internet connection, browser cache issues, or high server traffic. Try clearing your browser cache, checking your internet speed, or accessing during off-peak hours. If the problem persists, contact our technical support team.'
    },
    {
      id: 14,
      category: 'Technical',
      question: 'Is my data encrypted?',
      answer: 'Yes! We use industry-standard AES-256 encryption for data at rest and TLS 1.3 for data in transit. All sensitive information is encrypted before storage, and we never share your data with third parties without explicit consent. Our security practices are regularly audited by independent security firms.'
    },
    {
      id: 15,
      category: 'Getting Started',
      question: 'Do you offer certification programs?',
      answer: 'Yes! We offer several certification programs covering various cybersecurity topics. Upon completing a course and passing the exam, you\'ll receive a digital certificate that you can share on LinkedIn and include in your professional portfolio. Enterprise accounts can also access custom certification programs.'
    }
  ];

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
    categoryFilter: {
      maxWidth: '1200px',
      margin: '40px auto',
      padding: '0 20px',
      display: 'flex',
      justifyContent: 'center',
      gap: '15px',
      flexWrap: 'wrap',
    },
    categoryBtn: {
      padding: '12px 28px',
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
    faqSection: {
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '0 20px',
    },
    faqList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    faqItem: {
      background: 'white',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 8px 25px rgba(13, 71, 161, 0.1)',
      transition: 'all 0.3s ease',
    },
    faqHeader: {
      padding: '25px 30px',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '20px',
      transition: 'all 0.3s ease',
    },
    faqQuestion: {
      fontSize: '1.2rem',
      color: '#0d47a1',
      fontWeight: '600',
      flex: 1,
      lineHeight: '1.5',
    },
    faqIcon: {
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.4rem',
      fontWeight: 'bold',
      transition: 'all 0.3s ease',
      flexShrink: 0,
    },
    faqIconOpen: {
      transform: 'rotate(45deg)',
    },
    faqContent: {
      maxHeight: 0,
      overflow: 'hidden',
      transition: 'max-height 0.4s ease, padding 0.4s ease',
    },
    faqContentOpen: {
      maxHeight: '500px',
      padding: '0 30px 25px 30px',
    },
    faqAnswer: {
      fontSize: '1.05rem',
      color: '#424242',
      lineHeight: '1.7',
      paddingTop: '10px',
      borderTop: '2px solid #e3f2fd',
    },
    faqCategory: {
      display: 'inline-block',
      padding: '6px 16px',
      background: '#e3f2fd',
      color: '#1976d2',
      borderRadius: '20px',
      fontSize: '0.85rem',
      fontWeight: '600',
      marginBottom: '12px',
    },
    statsSection: {
      maxWidth: '1200px',
      margin: '80px auto 0',
      padding: '0 20px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '30px',
    },
    statCard: {
      background: 'white',
      borderRadius: '20px',
      padding: '40px 30px',
      textAlign: 'center',
      boxShadow: '0 8px 25px rgba(13, 71, 161, 0.1)',
      transition: 'all 0.3s ease',
    },
    statIcon: {
      fontSize: '3rem',
      marginBottom: '15px',
    },
    statNumber: {
      fontSize: '2.5rem',
      color: '#1976d2',
      fontWeight: '700',
      marginBottom: '8px',
    },
    statLabel: {
      fontSize: '1.1rem',
      color: '#0d47a1',
      fontWeight: '600',
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
    ctaButtons: {
      display: 'flex',
      gap: '20px',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    ctaButton: {
      background: 'white',
      color: '#1976d2',
      border: 'none',
      padding: '16px 40px',
      fontSize: '1.05rem',
      fontWeight: '600',
      borderRadius: '30px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.2)',
    },
    ctaButtonOutline: {
      background: 'transparent',
      color: 'white',
      border: '2px solid white',
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

          .category-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(66, 165, 245, 0.3);
          }

          .faq-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(13, 71, 161, 0.2);
          }

          .faq-header:hover {
            background: #f5f5f5;
          }

          .stat-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 40px rgba(13, 71, 161, 0.2);
          }

          .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          }

          .cta-button-outline:hover {
            background: white;
            color: #1976d2;
          }

          @media (max-width: 768px) {
            .hero-title {
              font-size: 2.5rem !important;
            }
            .hero-subtitle {
              font-size: 1.1rem !important;
            }
            .faq-header {
              padding: 20px !important;
            }
            .faq-content-open {
              padding: 0 20px 20px 20px !important;
            }
            .cta-card {
              padding: 40px 25px !important;
            }
          }

          @media (max-width: 480px) {
            .hero-title {
              font-size: 2rem !important;
            }
            .category-filter {
              gap: 10px !important;
            }
          }
        `}
      </style>

      <div style={styles.container}>
        {/* Hero Section */}
        <div style={styles.hero}>
          <h1 style={styles.heroTitle} className="hero-title">Frequently Asked Questions</h1>
          <p style={styles.heroSubtitle} className="hero-subtitle">
            Find quick answers to common questions about our cybersecurity platform
          </p>
          
          {/* Search Bar */}
          <div style={styles.searchContainer}>
            <svg style={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              placeholder="Search for questions..."
              style={styles.searchInput}
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div style={styles.categoryFilter} className="category-filter">
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

        {/* FAQ List */}
        <div style={styles.faqSection}>
          <div style={styles.faqList}>
            {filteredFAQs.map((faq) => (
              <div key={faq.id} style={styles.faqItem} className="faq-item">
                <div
                  style={styles.faqHeader}
                  className="faq-header"
                  onClick={() => toggleFAQ(faq.id)}
                >
                  <div>
                    <span style={styles.faqCategory}>{faq.category}</span>
                    <div style={styles.faqQuestion}>{faq.question}</div>
                  </div>
                  <div style={{
                    ...styles.faqIcon,
                    ...(openFAQ === faq.id ? styles.faqIconOpen : {})
                  }}>
                    +
                  </div>
                </div>
                <div style={{
                  ...styles.faqContent,
                  ...(openFAQ === faq.id ? styles.faqContentOpen : {})
                }} className={openFAQ === faq.id ? 'faq-content-open' : ''}>
                  <p style={styles.faqAnswer}>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div style={styles.statsSection}>
          <div style={styles.statCard} className="stat-card">
            <div style={styles.statIcon}>📚</div>
            <div style={styles.statNumber}>500+</div>
            <div style={styles.statLabel}>Help Articles</div>
          </div>
          <div style={styles.statCard} className="stat-card">
            <div style={styles.statIcon}>⏱️</div>
            <div style={styles.statNumber}> 2 min</div>
            <div style={styles.statLabel}>Avg Response Time</div>
          </div>
          <div style={styles.statCard} className="stat-card">
            <div style={styles.statIcon}>🌟</div>
            <div style={styles.statNumber}>98%</div>
            <div style={styles.statLabel}>Satisfaction Rate</div>
          </div>
        </div>

        {/* CTA Section */}
        <div style={styles.ctaSection}>
          <div style={styles.ctaCard}>
            <h2 style={styles.ctaTitle}>Still Have Questions?</h2>
            <p style={styles.ctaText}>
              Our support team is always ready to help you
            </p>
            <div style={styles.ctaButtons}>
              <button style={styles.ctaButton} className="cta-button">
                Contact Support
              </button>
              <button
                style={{...styles.ctaButton, ...styles.ctaButtonOutline}}
                className="cta-button cta-button-outline"
              >
                Live Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Faq;