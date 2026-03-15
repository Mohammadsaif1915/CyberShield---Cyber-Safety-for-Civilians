import React, { useState } from 'react';
import { Shield, Target, Users, Award, Heart, Lightbulb, TrendingUp, Eye, Lock, Brain } from 'lucide-react';

const AboutUs = () => {
  const [activeTab, setActiveTab] = useState('mission');

  const milestones = [
    { year: '2022', title: 'Foundation', description: 'CyberShield was founded with a mission to democratize cyber safety education for students across India.' },
    { year: '2023', title: 'Growth', description: 'Reached 10,000+ students across 50+ educational institutions nationwide.' },
    { year: '2024', title: 'Expansion', description: 'Launched enterprise solutions and partnered with major universities and colleges.' },
    { year: '2025', title: 'Innovation', description: 'Introduced AI-powered threat simulations and personalized learning paths for users.' },
    { year: '2026', title: 'Impact', description: 'Successfully protecting 50,000+ users and preventing millions in potential cyber fraud losses.' }
  ];

  const values = [
    { icon: Shield, title: 'Security First', description: 'We prioritize the safety and privacy of our users in everything we do. Your security is our top priority.' },
    { icon: Users, title: 'Accessibility', description: 'Cyber safety education should be available to everyone, everywhere, regardless of background or technical knowledge.' },
    { icon: Lightbulb, title: 'Innovation', description: 'We continuously evolve our platform to address emerging threats and provide cutting-edge security awareness.' },
    { icon: Heart, title: 'Empowerment', description: 'Knowledge is power. We empower users to take control of their digital safety and make informed decisions online.' }
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
                <Shield size={64} color="#0066cc" strokeWidth={1.5} />
              </div>
            </div>
            <h1 style={styles.heroTitle}>About CyberShield</h1>
            <p style={styles.heroSubtitle}>
              Building a Safer Digital World, One User at a Time
            </p>
            <p style={styles.heroDescription}>
              CyberShield is a comprehensive cyber awareness platform dedicated to making digital safety 
              education accessible, engaging, and effective for students, professionals, and everyone 
              navigating the complex online landscape.
            </p>
          </div>

          <div style={styles.statsRow}>
            <div style={styles.statBox} className="fade-in-up delay-1 stat-hover">
              <div style={styles.statValue}>50,000+</div>
              <div style={styles.statLabel}>Protected Users</div>
            </div>
            <div style={styles.statBox} className="fade-in-up delay-2 stat-hover">
              <div style={styles.statValue}>100+</div>
              <div style={styles.statLabel}>Partner Institutions</div>
            </div>
            <div style={styles.statBox} className="fade-in-up delay-3 stat-hover">
              <div style={styles.statValue}>98%</div>
              <div style={styles.statLabel}>Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Story Tabs */}
      <section style={styles.tabSection}>
        <div style={styles.container}>
          <div style={styles.tabNav}>
            <button 
              onClick={() => setActiveTab('mission')}
              style={activeTab === 'mission' ? {...styles.tabButton, ...styles.tabButtonActive} : styles.tabButton}
              className="tab-btn"
            >
              <Target size={20} />
              <span>Our Mission</span>
            </button>
            <button 
              onClick={() => setActiveTab('vision')}
              style={activeTab === 'vision' ? {...styles.tabButton, ...styles.tabButtonActive} : styles.tabButton}
              className="tab-btn"
            >
              <TrendingUp size={20} />
              <span>Our Vision</span>
            </button>
            <button 
              onClick={() => setActiveTab('story')}
              style={activeTab === 'story' ? {...styles.tabButton, ...styles.tabButtonActive} : styles.tabButton}
              className="tab-btn"
            >
              <Award size={20} />
              <span>Our Story</span>
            </button>
          </div>

          <div style={styles.tabContent}>
            {activeTab === 'mission' && (
              <div className="fade-in">
                <h2 style={styles.contentTitle}>Our Mission</h2>
                <p style={styles.contentText}>
                  We believe that everyone deserves to feel safe and confident in the digital world. 
                  Our mission is to democratize cyber safety education by providing accessible, 
                  engaging, and practical training that empowers individuals to recognize, understand, 
                  and prevent cyber threats before they become victims.
                </p>
                <p style={styles.contentText}>
                  Through innovative learning experiences, real-world simulations, and continuous 
                  support, we're building a community of digitally aware citizens who can navigate 
                  the online world with confidence and security. We aim to make cyber awareness as 
                  fundamental as basic literacy in today's digital age.
                </p>
              </div>
            )}
            {activeTab === 'vision' && (
              <div className="fade-in">
                <h2 style={styles.contentTitle}>Our Vision</h2>
                <p style={styles.contentText}>
                  We envision a world where cyber safety is as fundamental as road safety—where 
                  every student, professional, and senior citizen has the knowledge and skills to 
                  protect themselves online. A world where cyber attacks fail because people are 
                  too smart to fall for them.
                </p>
              </div>
            )}
            {activeTab === 'story' && (
              <div className="fade-in">
                <h2 style={styles.contentTitle}>Our Story</h2>
                <p style={styles.contentText}>
                  CyberShield was born from a deeply personal experience. Our founder, Dr. Amit Verma, 
                  witnessed his own mother lose her life savings to a sophisticated phishing scam. 
                  Despite his extensive expertise in cybersecurity, he realized that traditional security 
                  measures and technical solutions weren't enough—people needed practical education and awareness.
                </p>
                <p style={styles.contentText}>
                  In 2022, we launched CyberShield with a simple yet powerful goal: make cyber safety 
                  education so engaging, accessible, and practical that everyone—from college students 
                  to working professionals to retirees—would want to learn and stay informed. Today, 
                  we're proud to have protected thousands of users, prevented millions in potential 
                  fraud, and built a thriving community of cyber-aware individuals.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section style={styles.whatWeDoSection}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>What We Do</h2>
          <p style={styles.sectionSubtitle}>
            Comprehensive cyber awareness training for the modern digital world
          </p>

          <div style={styles.featuresGrid}>
            <div style={styles.featureCard} className="fade-in-up delay-1 feature-hover">
              <div style={styles.featureIcon}>
                <Eye size={40} color="#0066cc" strokeWidth={1.5} />
              </div>
              <h3 style={styles.featureTitle}>Threat Awareness</h3>
              <p style={styles.featureDesc}>
                Learn to identify and understand phishing attacks, malware, social engineering, 
                and other common cyber threats before they can harm you.
              </p>
            </div>

            <div style={styles.featureCard} className="fade-in-up delay-2 feature-hover">
              <div style={styles.featureIcon}>
                <Lock size={40} color="#0066cc" strokeWidth={1.5} />
              </div>
              <h3 style={styles.featureTitle}>Safe Practices</h3>
              <p style={styles.featureDesc}>
                Master essential security practices including password management, two-factor 
                authentication, and privacy protection techniques.
              </p>
            </div>

            <div style={styles.featureCard} className="fade-in-up delay-3 feature-hover">
              <div style={styles.featureIcon}>
                <Brain size={40} color="#0066cc" strokeWidth={1.5} />
              </div>
              <h3 style={styles.featureTitle}>Interactive Learning</h3>
              <p style={styles.featureDesc}>
                Test your knowledge with scenario-based quizzes, simulations, and real-world 
                challenges that make learning engaging and practical.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section style={styles.valuesSection}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Our Core Values</h2>
          <p style={styles.sectionSubtitle}>
            The principles that guide everything we do
          </p>

          <div style={styles.valuesGrid}>
            {values.map((value, index) => (
              <div key={index} style={styles.valueCard} className="fade-in-up value-hover">
                <div style={styles.valueIconBox}>
                  <value.icon size={36} color="#0066cc" strokeWidth={1.5} />
                </div>
                <h3 style={styles.valueTitle}>{value.title}</h3>
                <p style={styles.valueDescription}>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section style={styles.timelineSection}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Our Journey</h2>
          <p style={styles.sectionSubtitle}>
            Key milestones in our mission to make the digital world safer
          </p>

          <div style={styles.timeline}>
            {milestones.map((milestone, index) => (
              <div key={index} style={styles.timelineItem} className="fade-in-up timeline-hover">
                <div style={styles.timelineYear}>{milestone.year}</div>
                <div style={styles.timelineContent}>
                  <div style={styles.timelineDot}></div>
                  <div style={styles.timelineCard}>
                    <h3 style={styles.timelineTitle}>{milestone.title}</h3>
                    <p style={styles.timelineDescription}>{milestone.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section style={styles.whySection}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Why Choose CyberShield?</h2>
          
          <div style={styles.whyGrid}>
            <div style={styles.whyCard} className="fade-in-up delay-1 why-hover">
              <div style={styles.whyNumber}>01</div>
              <h3 style={styles.whyTitle}>Practical & Actionable</h3>
              <p style={styles.whyText}>
                Our training focuses on real-world scenarios and practical skills you can apply 
                immediately to protect yourself and your data online.
              </p>
            </div>

            <div style={styles.whyCard} className="fade-in-up delay-2 why-hover">
              <div style={styles.whyNumber}>02</div>
              <h3 style={styles.whyTitle}>Easy to Understand</h3>
              <p style={styles.whyText}>
                Complex security concepts explained in simple, jargon-free language that anyone 
                can understand, regardless of technical background.
              </p>
            </div>

            <div style={styles.whyCard} className="fade-in-up delay-3 why-hover">
              <div style={styles.whyNumber}>03</div>
              <h3 style={styles.whyTitle}>Always Up-to-Date</h3>
              <p style={styles.whyText}>
                We continuously update our content to address the latest threats, scams, and 
                security trends in the ever-evolving cyber landscape.
              </p>
            </div>

            <div style={styles.whyCard} className="fade-in-up delay-4 why-hover">
              <div style={styles.whyNumber}>04</div>
              <h3 style={styles.whyTitle}>Community Support</h3>
              <p style={styles.whyText}>
                Join a thriving community of cyber-aware individuals who share knowledge, 
                experiences, and support each other in staying safe online.
              </p>
            </div>
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

  .fade-in {
    animation: fadeIn 0.6s ease-out forwards;
    opacity: 0;
  }

  .delay-1 { animation-delay: 0.1s; }
  .delay-2 { animation-delay: 0.2s; }
  .delay-3 { animation-delay: 0.3s; }
  .delay-4 { animation-delay: 0.4s; }

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

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .stat-hover {
    transition: all 0.3s ease;
  }

  .stat-hover:hover {
    transform: translateY(-8px);
    box-shadow: 0 10px 30px rgba(0, 102, 204, 0.15);
  }

  .tab-btn {
    transition: all 0.3s ease;
  }

  .tab-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 102, 204, 0.1);
  }

  .feature-hover {
    transition: all 0.3s ease;
  }

  .feature-hover:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 35px rgba(0, 102, 204, 0.12);
    border-color: #0066cc;
  }

  .value-hover {
    transition: all 0.3s ease;
  }

  .value-hover:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 40px rgba(0, 102, 204, 0.15);
  }

  .timeline-hover {
    transition: all 0.3s ease;
  }

  .timeline-hover:hover .timeline-card {
    transform: translateX(5px);
    box-shadow: 0 10px 30px rgba(0, 102, 204, 0.12);
  }

  .why-hover {
    transition: all 0.3s ease;
  }

  .why-hover:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 35px rgba(0, 102, 204, 0.15);
    border-color: #0066cc;
  }

  @media (max-width: 768px) {
    .stats-row { flex-direction: column; }
    .features-grid, .values-grid, .team-grid, .why-grid { 
      grid-template-columns: 1fr !important; 
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
    fontSize: '1.5rem',
    color: '#0066cc',
    fontWeight: '600',
    marginBottom: '25px',
  },
  heroDescription: {
    fontSize: '1.2rem',
    color: '#374151',
    lineHeight: '1.8',
    maxWidth: '900px',
    margin: '0 auto 50px',
  },
  statsRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '40px',
    flexWrap: 'wrap',
    marginTop: '50px',
  },
  statBox: {
    textAlign: 'center',
    padding: '35px 45px',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    border: 'none',
    boxShadow: '0 8px 25px rgba(0, 102, 204, 0.1)',
  },
  statValue: {
    fontSize: '3rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #0066cc 0%, #0052a3 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '10px',
  },
  statLabel: {
    fontSize: '0.95rem',
    color: '#64748b',
    fontWeight: '600',
  },

  // Tab Section
  tabSection: {
    padding: '60px 0',
    backgroundColor: 'transparent',
    margin: '60px 0',
  },
  tabNav: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    marginBottom: '40px',
    flexWrap: 'wrap',
  },
  tabButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 28px',
    backgroundColor: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#6b7280',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(0, 102, 204, 0.08)',
  },
  tabButtonActive: {
    background: 'linear-gradient(135deg, #0066cc 0%, #0052a3 100%)',
    color: '#ffffff',
    boxShadow: '0 6px 20px rgba(0, 102, 204, 0.25)',
  },
  tabContent: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '45px',
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    boxShadow: '0 10px 40px rgba(0, 102, 204, 0.12)',
  },
  contentTitle: {
    fontSize: '2.2rem',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '25px',
  },
  contentText: {
    fontSize: '1.1rem',
    color: '#4b5563',
    marginBottom: '20px',
    lineHeight: '1.8',
  },

  // What We Do Section
  whatWeDoSection: {
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
    marginTop: '50px',
  },
  featureCard: {
    padding: '45px 35px',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    textAlign: 'center',
    border: '2px solid rgba(0, 102, 204, 0.1)',
    boxShadow: '0 8px 25px rgba(0, 102, 204, 0.08)',
  },
  featureIcon: {
    marginBottom: '25px',
    display: 'flex',
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '15px',
  },
  featureDesc: {
    fontSize: '1rem',
    color: '#64748b',
    lineHeight: '1.7',
  },

  // Values Section
  valuesSection: {
    padding: '80px 0',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    margin: '0 -20px',
  },
  valuesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '30px',
    marginTop: '50px',
  },
  valueCard: {
    padding: '45px 35px',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(0, 102, 204, 0.1)',
  },
  valueIconBox: {
    width: '90px',
    height: '90px',
    margin: '0 auto 25px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #e0f2fe 0%, #bfdbfe 100%)',
    borderRadius: '50%',
  },
  valueTitle: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '15px',
  },
  valueDescription: {
    fontSize: '1rem',
    color: '#64748b',
    lineHeight: '1.7',
  },

  // Timeline Section
  timelineSection: {
    padding: '80px 0',
  },
  timeline: {
    position: 'relative',
    maxWidth: '900px',
    margin: '50px auto 0',
  },
  timelineItem: {
    display: 'flex',
    gap: '40px',
    marginBottom: '40px',
    position: 'relative',
  },
  timelineYear: {
    fontSize: '1.8rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #0066cc 0%, #0052a3 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    minWidth: '100px',
    textAlign: 'right',
    paddingTop: '5px',
  },
  timelineContent: {
    flex: 1,
    position: 'relative',
    paddingLeft: '40px',
  },
  timelineDot: {
    position: 'absolute',
    left: '0',
    top: '12px',
    width: '20px',
    height: '20px',
    background: 'linear-gradient(135deg, #0066cc 0%, #0052a3 100%)',
    borderRadius: '50%',
    border: '4px solid #ffffff',
    boxShadow: '0 0 0 4px rgba(0, 102, 204, 0.1)',
    zIndex: 2,
  },
  timelineCard: {
    backgroundColor: '#ffffff',
    padding: '25px',
    borderRadius: '16px',
    boxShadow: '0 6px 20px rgba(0, 102, 204, 0.08)',
    transition: 'all 0.3s ease',
  },
  timelineTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '10px',
  },
  timelineDescription: {
    fontSize: '1rem',
    color: '#64748b',
    lineHeight: '1.7',
  },

  // Why Choose Us Section
  whySection: {
    padding: '80px 0',
  },
  whyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '30px',
    marginTop: '50px',
  },
  whyCard: {
    padding: '40px 35px',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    border: '2px solid rgba(0, 102, 204, 0.1)',
    boxShadow: '0 8px 25px rgba(0, 102, 204, 0.08)',
  },
  whyNumber: {
    fontSize: '2.8rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #0066cc 0%, #0052a3 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '20px',
    opacity: 0.4,
  },
  whyTitle: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '15px',
  },
  whyText: {
    fontSize: '1rem',
    color: '#64748b',
    lineHeight: '1.7',
  },
};

export default AboutUs;