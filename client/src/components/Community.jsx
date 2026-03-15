import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Users, Shield, Eye, Lock, Heart, Zap, Award, CheckCircle, ArrowRight } from 'lucide-react';

const CommunityPage = () => {
  const navigate = useNavigate();

  const handleJoinCommunity = () => {
    navigate('/register');
  };

  const communityFeatures = [
    {
      icon: Shield,
      title: 'Complete Anonymity',
      description: 'Your real identity is never revealed. Chat freely without any privacy concerns or fear of judgment.',
      color: '#0066cc'
    },
    {
      icon: Users,
      title: 'Real-Time Discussions',
      description: 'Connect with learners worldwide and discuss cybersecurity topics in real-time with instant messaging.',
      color: '#7c3aed'
    },
    {
      icon: Eye,
      title: 'Safe Environment',
      description: 'AI-moderated community ensuring respectful and helpful conversations. Zero tolerance for harassment.',
      color: '#059669'
    },
    {
      icon: MessageCircle,
      title: 'Ask Anything',
      description: 'No question is too basic or too advanced. Our community welcomes learners at all levels.',
      color: '#dc2626'
    },
    {
      icon: Lock,
      title: 'Zero Data Collection',
      description: 'We don\'t store personal information. Your conversations are private and secure.',
      color: '#ea580c'
    },
    {
      icon: Heart,
      title: 'Supportive Community',
      description: 'Friendly, helpful members who genuinely care about helping others learn and stay safe online.',
      color: '#0891b2'
    }
  ];

  const communityBenefits = [
    {
      icon: Zap,
      title: 'Instant Help',
      description: 'Get answers to your cybersecurity questions within minutes from experienced community members.',
      stats: 'Avg. response time: 5 mins'
    },
    {
      icon: Users,
      title: 'Global Network',
      description: 'Connect with 50,000+ cybersecurity enthusiasts from around the world, 24/7.',
      stats: '500+ online anytime'
    },
    {
      icon: Award,
      title: 'Learn from Experts',
      description: 'Industry professionals and security experts actively participate and share their knowledge.',
      stats: '100+ verified experts'
    }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Join Anonymously',
      description: 'No registration needed. Just enter and you\'ll get a random anonymous username automatically.'
    },
    {
      step: '2',
      title: 'Choose Your Topic',
      description: 'Select from various topic channels like Phishing, Passwords, Network Security, and more.'
    },
    {
      step: '3',
      title: 'Start Chatting',
      description: 'Ask questions, share experiences, help others, and learn together in real-time.'
    },
    {
      step: '4',
      title: 'Stay Safe & Learn',
      description: 'Enjoy respectful discussions while maintaining complete anonymity and privacy.'
    }
  ];

  const topicChannels = [
    { emoji: '🔒', name: 'Password Security', members: '8.5K', active: true },
    { emoji: '📧', name: 'Phishing Detection', members: '12.3K', active: true },
    { emoji: '📱', name: 'Mobile Security', members: '6.7K', active: true },
    { emoji: '🌐', name: 'Network Safety', members: '9.2K', active: true },
    { emoji: '💻', name: 'Malware Prevention', members: '7.8K', active: true },
    { emoji: '🎓', name: 'Learning Tips', members: '15.6K', active: true },
    { emoji: '⚠️', name: 'Scam Alerts', members: '11.4K', active: true },
    { emoji: '🛡️', name: 'Privacy Tools', members: '5.9K', active: true }
  ];

  const communityRules = [
    'Be respectful and kind to all community members',
    'No sharing of personal information (names, emails, phone numbers)',
    'Stay on topic - focus on cybersecurity discussions',
    'No spam, promotional content, or advertising',
    'Report inappropriate behavior to moderators immediately',
    'Help others learn - share knowledge freely and patiently',
    'Use appropriate language - keep conversations professional',
    'No misinformation - verify facts before sharing'
  ];

  const testimonials = [
    {
      user: 'Anonymous User',
      message: 'Best community for learning cybersecurity! Everyone is so helpful and the anonymity makes me comfortable asking any question.',
      color: '#0066cc'
    },
    {
      user: 'Anonymous User',
      message: 'I learned more here in 2 weeks than I did in months of reading articles. Real-time discussions are game-changing!',
      color: '#7c3aed'
    },
    {
      user: 'Anonymous User',
      message: 'The anonymity feature is brilliant. I can ask "stupid" questions without feeling embarrassed. Everyone is super supportive!',
      color: '#059669'
    }
  ];

  return (
    <div style={styles.pageContainer}>
      <style>{internalCSS}</style>

      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.container}>
          <div className="fade-in-up">
            <div style={styles.heroIcon}>
              <div style={styles.iconCircle}>
                <MessageCircle size={64} color="#0066cc" strokeWidth={1.5} />
              </div>
            </div>
            <h1 style={styles.heroTitle}>Anonymous Community</h1>
            <p style={styles.heroSubtitle}>
              Learn Together • Share Knowledge • Stay Anonymous
            </p>
            <p style={styles.heroDescription}>
              Join our thriving anonymous community to discuss cybersecurity topics, ask questions, 
              share experiences, and learn from peers worldwide - all while maintaining complete privacy.
            </p>
            
            {/* CTA Button — redirects to /register */}
            <button style={styles.ctaButton} className="cta-btn" onClick={handleJoinCommunity}>
              Join Community Now
              <ArrowRight size={20} style={{marginLeft: '10px'}} />
            </button>

            {/* Live Stats */}
            <div style={styles.liveStats}>
              <div style={styles.statItem}>
                <div style={styles.statValue}>50,000+</div>
                <div style={styles.statLabel}>Active Members</div>
              </div>
              <div style={styles.statItem}>
                <div style={styles.onlineBadge}>
                  <div style={styles.pulseDot}></div>
                  <span>500+ Online Now</span>
                </div>
              </div>
              <div style={styles.statItem}>
                <div style={styles.statValue}>100%</div>
                <div style={styles.statLabel}>Anonymous</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Features */}
      <section style={styles.featuresSection}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Why Join Our Community?</h2>
          <p style={styles.sectionSubtitle}>
            A safe, anonymous space for everyone to learn and grow together
          </p>

          <div style={styles.featuresGrid}>
            {communityFeatures.map((feature, index) => (
              <div key={index} style={styles.featureCard} className="fade-in-up feature-hover">
                <div style={{...styles.featureIconBox, backgroundColor: `${feature.color}15`}}>
                  <feature.icon size={36} color={feature.color} strokeWidth={1.5} />
                </div>
                <h3 style={styles.featureTitle}>{feature.title}</h3>
                <p style={styles.featureDesc}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Benefits */}
      <section style={styles.benefitsSection}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>What You Get</h2>
          <div style={styles.benefitsGrid}>
            {communityBenefits.map((benefit, index) => (
              <div key={index} style={styles.benefitCard} className="fade-in-up benefit-hover">
                <div style={styles.benefitIcon}>
                  <benefit.icon size={40} color="#0066cc" strokeWidth={1.5} />
                </div>
                <h3 style={styles.benefitTitle}>{benefit.title}</h3>
                <p style={styles.benefitDesc}>{benefit.description}</p>
                <div style={styles.benefitStats}>{benefit.stats}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={styles.howItWorksSection}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>How It Works</h2>
          <p style={styles.sectionSubtitle}>
            Get started in 4 simple steps - no registration required
          </p>

          <div style={styles.stepsGrid}>
            {howItWorks.map((item, index) => (
              <div key={index} style={styles.stepCard} className="fade-in-up step-hover">
                <div style={styles.stepNumber}>{item.step}</div>
                <h3 style={styles.stepTitle}>{item.title}</h3>
                <p style={styles.stepDesc}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Topic Channels */}
      <section style={styles.topicsSection}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Discussion Channels</h2>
          <p style={styles.sectionSubtitle}>
            Join topic-specific channels to discuss what matters to you
          </p>

          <div style={styles.channelsGrid}>
            {topicChannels.map((channel, index) => (
              <div key={index} style={styles.channelCard} className="fade-in-up channel-hover">
                <div style={styles.channelEmoji}>{channel.emoji}</div>
                <h3 style={styles.channelName}>{channel.name}</h3>
                <div style={styles.channelMeta}>
                  <span style={styles.channelMembers}>{channel.members} members</span>
                  {channel.active && (
                    <span style={styles.activeIndicator}>
                      <div style={styles.activeDot}></div>
                      Active
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={styles.testimonialsSection}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>What Members Say</h2>
          <p style={styles.sectionSubtitle}>
            Real feedback from our anonymous community members
          </p>

          <div style={styles.testimonialsGrid}>
            {testimonials.map((testimonial, index) => (
              <div key={index} style={styles.testimonialCard} className="fade-in-up testimonial-hover">
                <div style={styles.quoteIcon}>"</div>
                <p style={styles.testimonialText}>{testimonial.message}</p>
                <div style={styles.testimonialAuthor}>
                  <div style={{...styles.authorAvatar, backgroundColor: testimonial.color}}>
                    <Users size={20} color="#ffffff" />
                  </div>
                  <span style={styles.authorName}>{testimonial.user}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Guidelines */}
      <section style={styles.guidelinesSection}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Community Guidelines</h2>
          <p style={styles.sectionSubtitle}>
            Please follow these rules to maintain a safe and helpful environment for everyone
          </p>

          <div style={styles.rulesContainer}>
            {communityRules.map((rule, index) => (
              <div key={index} style={styles.ruleCard} className="fade-in-up rule-hover">
                <div style={styles.ruleNumber}>{index + 1}</div>
                <p style={styles.ruleText}>{rule}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Guarantee */}
      <section style={styles.privacySection}>
        <div style={styles.container}>
          <div style={styles.privacyCard}>
            <div style={styles.privacyIcon}>
              <Shield size={64} color="#0066cc" strokeWidth={1.5} />
            </div>
            <h2 style={styles.privacyTitle}>Your Privacy is Our Priority</h2>
            <p style={styles.privacyText}>
              We take your privacy seriously. When you join our community, you are assigned a random 
              anonymous username automatically. We don't ask for your name, email, or any personal information. 
              Your real identity remains completely private and secure. All conversations are monitored by 
              AI moderators to ensure a safe, respectful environment for everyone.
            </p>

            <div style={styles.privacyFeatures}>
              <div style={styles.privacyFeature}>
                <CheckCircle size={24} color="#059669" />
                <div>
                  <div style={styles.privacyFeatureTitle}>No Registration</div>
                  <div style={styles.privacyFeatureDesc}>Jump in instantly, no signup required</div>
                </div>
              </div>
              <div style={styles.privacyFeature}>
                <CheckCircle size={24} color="#059669" />
                <div>
                  <div style={styles.privacyFeatureTitle}>Zero Data Collection</div>
                  <div style={styles.privacyFeatureDesc}>We don't store any personal information</div>
                </div>
              </div>
              <div style={styles.privacyFeature}>
                <CheckCircle size={24} color="#059669" />
                <div>
                  <div style={styles.privacyFeatureTitle}>AI Moderation</div>
                  <div style={styles.privacyFeatureDesc}>24/7 automated safety monitoring</div>
                </div>
              </div>
              <div style={styles.privacyFeature}>
                <CheckCircle size={24} color="#059669" />
                <div>
                  <div style={styles.privacyFeatureTitle}>Anonymous Forever</div>
                  <div style={styles.privacyFeatureDesc}>Your identity stays hidden always</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={styles.finalCtaSection}>
        <div style={styles.container}>
          <div style={styles.finalCtaCard}>
            <h2 style={styles.finalCtaTitle}>Ready to Join the Community?</h2>
            <p style={styles.finalCtaText}>
              Join 50,000+ members learning cybersecurity together in a safe, anonymous environment
            </p>
            {/* Final CTA Button — also redirects to /register */}
            <button style={styles.finalCtaButton} className="cta-btn" onClick={handleJoinCommunity}>
              Enter Community Chat
              <ArrowRight size={22} style={{marginLeft: '10px'}} />
            </button>
            <p style={styles.finalCtaNote}>
              No registration • Completely anonymous • 100% free forever
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

// Internal CSS
const internalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .fade-in-up {
    animation: fadeInUp 0.8s ease-out forwards;
    opacity: 0;
  }

  .delay-1 { animation-delay: 0.1s; }
  .delay-2 { animation-delay: 0.2s; }
  .delay-3 { animation-delay: 0.3s; }

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

  @keyframes pulse {
    0%, 100% { 
      transform: scale(1);
      opacity: 1;
    }
    50% { 
      transform: scale(1.1);
      opacity: 0.8;
    }
  }

  .cta-btn {
    transition: all 0.3s ease;
  }

  .cta-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(0, 102, 204, 0.3);
  }

  .feature-hover {
    transition: all 0.3s ease;
  }

  .feature-hover:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 35px rgba(0, 102, 204, 0.15);
  }

  .benefit-hover {
    transition: all 0.3s ease;
  }

  .benefit-hover:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 40px rgba(0, 102, 204, 0.2);
  }

  .step-hover {
    transition: all 0.3s ease;
  }

  .step-hover:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 35px rgba(0, 102, 204, 0.15);
  }

  .channel-hover {
    transition: all 0.3s ease;
  }

  .channel-hover:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 102, 204, 0.15);
    border-color: #0066cc;
  }

  .testimonial-hover {
    transition: all 0.3s ease;
  }

  .testimonial-hover:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 40px rgba(0, 102, 204, 0.18);
  }

  .rule-hover {
    transition: all 0.3s ease;
  }

  .rule-hover:hover {
    transform: translateX(10px);
    box-shadow: 0 8px 25px rgba(0, 102, 204, 0.12);
  }

  @media (max-width: 768px) {
    .features-grid, .benefits-grid, .steps-grid, .channels-grid, .testimonials-grid {
      grid-template-columns: 1fr !important;
    }
    
    .live-stats {
      flex-direction: column !important;
    }
  }
`;

// Styles
const styles = {
  pageContainer: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    background: 'linear-gradient(135deg, #e3f2fd 0%, #f0f7ff 50%, #e8f4f8 100%)',
    color: '#1a1a1a',
    minHeight: '100vh',
    lineHeight: 1.6,
    padding: '40px 20px',
  },

  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },

  // Hero Section
  heroSection: {
    paddingBottom: '60px',
    textAlign: 'center',
  },
  heroIcon: {
    marginBottom: '30px',
    display: 'flex',
    justifyContent: 'center',
  },
  iconCircle: {
    width: '140px',
    height: '140px',
    backgroundColor: '#ffffff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 40px rgba(0, 102, 204, 0.15)',
  },
  heroTitle: {
    fontSize: '3.5rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #0066cc 0%, #0052a3 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '20px',
    letterSpacing: '-0.02em',
  },
  heroSubtitle: {
    fontSize: '1.4rem',
    color: '#0066cc',
    fontWeight: '600',
    marginBottom: '25px',
  },
  heroDescription: {
    fontSize: '1.2rem',
    color: '#374151',
    lineHeight: '1.8',
    maxWidth: '900px',
    margin: '0 auto 40px',
  },
  ctaButton: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '18px 40px',
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#ffffff',
    background: 'linear-gradient(135deg, #0066cc 0%, #0052a3 100%)',
    border: 'none',
    borderRadius: '16px',
    cursor: 'pointer',
    boxShadow: '0 10px 30px rgba(0, 102, 204, 0.2)',
    marginBottom: '50px',
  },
  liveStats: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '50px',
    flexWrap: 'wrap',
  },
  statItem: {
    textAlign: 'center',
  },
  statValue: {
    fontSize: '2.5rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #0066cc 0%, #0052a3 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '5px',
  },
  statLabel: {
    fontSize: '0.95rem',
    color: '#64748b',
    fontWeight: '600',
  },
  onlineBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 24px',
    backgroundColor: '#ffffff',
    borderRadius: '30px',
    boxShadow: '0 4px 15px rgba(0, 102, 204, 0.1)',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1a1a1a',
  },
  pulseDot: {
    width: '12px',
    height: '12px',
    backgroundColor: '#059669',
    borderRadius: '50%',
    animation: 'pulse 2s infinite',
  },

  // Features Section
  featuresSection: {
    padding: '80px 0',
  },
  sectionTitle: {
    fontSize: '2.8rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #0066cc 0%, #0052a3 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textAlign: 'center',
    marginBottom: '15px',
  },
  sectionSubtitle: {
    fontSize: '1.15rem',
    color: '#64748b',
    textAlign: 'center',
    marginBottom: '50px',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '30px',
  },
  featureCard: {
    padding: '40px 35px',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(0, 102, 204, 0.1)',
  },
  featureIconBox: {
    width: '80px',
    height: '80px',
    margin: '0 auto 25px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '15px',
  },
  featureDesc: {
    fontSize: '1rem',
    color: '#64748b',
    lineHeight: '1.7',
  },

  // Benefits Section
  benefitsSection: {
    padding: '80px 0',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    margin: '0 -20px',
  },
  benefitsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '30px',
  },
  benefitCard: {
    padding: '45px 40px',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(0, 102, 204, 0.12)',
  },
  benefitIcon: {
    marginBottom: '25px',
  },
  benefitTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '15px',
  },
  benefitDesc: {
    fontSize: '1rem',
    color: '#64748b',
    lineHeight: '1.7',
    marginBottom: '20px',
  },
  benefitStats: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#0066cc',
    padding: '10px 20px',
    backgroundColor: '#e0f2fe',
    borderRadius: '20px',
    display: 'inline-block',
  },

  // How It Works Section
  howItWorksSection: {
    padding: '80px 0',
  },
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '30px',
  },
  stepCard: {
    padding: '40px 30px',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    textAlign: 'center',
    boxShadow: '0 8px 25px rgba(0, 102, 204, 0.08)',
    border: '2px solid rgba(0, 102, 204, 0.1)',
  },
  stepNumber: {
    width: '70px',
    height: '70px',
    margin: '0 auto 25px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.5rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #0066cc 0%, #0052a3 100%)',
    color: '#ffffff',
    borderRadius: '50%',
  },
  stepTitle: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '15px',
  },
  stepDesc: {
    fontSize: '1rem',
    color: '#64748b',
    lineHeight: '1.7',
  },

  // Topics Section
  topicsSection: {
    padding: '80px 0',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    margin: '0 -20px',
  },
  channelsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '25px',
  },
  channelCard: {
    padding: '30px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    textAlign: 'center',
    boxShadow: '0 4px 15px rgba(0, 102, 204, 0.08)',
    border: '2px solid rgba(0, 102, 204, 0.1)',
  },
  channelEmoji: {
    fontSize: '3rem',
    marginBottom: '15px',
  },
  channelName: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '15px',
  },
  channelMeta: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap',
  },
  channelMembers: {
    fontSize: '0.9rem',
    color: '#64748b',
    fontWeight: '600',
  },
  activeIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.85rem',
    color: '#059669',
    fontWeight: '700',
  },
  activeDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#059669',
    borderRadius: '50%',
    animation: 'pulse 2s infinite',
  },

  // Testimonials Section
  testimonialsSection: {
    padding: '80px 0',
  },
  testimonialsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '30px',
  },
  testimonialCard: {
    padding: '40px 35px',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0, 102, 204, 0.1)',
    position: 'relative',
  },
  quoteIcon: {
    fontSize: '4rem',
    fontWeight: '800',
    color: '#e0f2fe',
    lineHeight: '1',
    marginBottom: '15px',
  },
  testimonialText: {
    fontSize: '1.05rem',
    color: '#1a1a1a',
    lineHeight: '1.7',
    marginBottom: '25px',
    fontStyle: 'italic',
  },
  testimonialAuthor: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  authorAvatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorName: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#64748b',
  },

  // Guidelines Section
  guidelinesSection: {
    padding: '80px 0',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    margin: '0 -20px',
  },
  rulesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '900px',
    margin: '0 auto',
  },
  ruleCard: {
    display: 'flex',
    gap: '25px',
    padding: '25px 30px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 15px rgba(0, 102, 204, 0.08)',
    alignItems: 'center',
  },
  ruleNumber: {
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #0066cc 0%, #0052a3 100%)',
    color: '#ffffff',
    borderRadius: '50%',
    flexShrink: 0,
  },
  ruleText: {
    fontSize: '1.05rem',
    color: '#1a1a1a',
    lineHeight: '1.6',
  },

  // Privacy Section
  privacySection: {
    padding: '80px 0',
  },
  privacyCard: {
    padding: '60px 50px',
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    boxShadow: '0 10px 40px rgba(0, 102, 204, 0.12)',
    textAlign: 'center',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  privacyIcon: {
    marginBottom: '30px',
  },
  privacyTitle: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: '25px',
  },
  privacyText: {
    fontSize: '1.15rem',
    color: '#64748b',
    lineHeight: '1.8',
    marginBottom: '40px',
    maxWidth: '800px',
    margin: '0 auto 40px',
  },
  privacyFeatures: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
    textAlign: 'left',
  },
  privacyFeature: {
    display: 'flex',
    gap: '15px',
    alignItems: 'flex-start',
  },
  privacyFeatureTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '5px',
  },
  privacyFeatureDesc: {
    fontSize: '0.95rem',
    color: '#64748b',
  },

  // Final CTA Section
  finalCtaSection: {
    padding: '80px 0',
  },
  finalCtaCard: {
    padding: '60px 40px',
    background: 'linear-gradient(135deg, #0066cc 0%, #0052a3 100%)',
    borderRadius: '24px',
    textAlign: 'center',
    boxShadow: '0 15px 50px rgba(0, 102, 204, 0.3)',
  },
  finalCtaTitle: {
    fontSize: '2.8rem',
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: '20px',
  },
  finalCtaText: {
    fontSize: '1.2rem',
    color: '#e0f2fe',
    marginBottom: '35px',
    maxWidth: '700px',
    margin: '0 auto 35px',
  },
  finalCtaButton: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '18px 45px',
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#0066cc',
    backgroundColor: '#ffffff',
    border: 'none',
    borderRadius: '16px',
    cursor: 'pointer',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
    marginBottom: '20px',
  },
  finalCtaNote: {
    fontSize: '0.95rem',
    color: '#bfdbfe',
    fontWeight: '500',
  },
};

export default CommunityPage;