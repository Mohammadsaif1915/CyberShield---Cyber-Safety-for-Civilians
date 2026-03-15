import React, { useState } from 'react';
import { Shield, Target, Gamepad2, Trophy, Brain, Lock, Eye, AlertTriangle, Users, Zap, BarChart, Award } from 'lucide-react';

const FeaturesPage = () => {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const mainFeatures = [
    {
      icon: Gamepad2,
      title: 'Gamified Learning',
      description: 'Learn cybersecurity through interactive games, challenges, and missions. Earn points, unlock achievements, and level up your skills.',
      color: '#0066cc',
      benefits: ['Interactive Challenges', 'Real-time Scoring', 'Achievement System', 'Leaderboards']
    },
    {
      icon: Target,
      title: 'Threat Simulations',
      description: 'Experience realistic cyber threat scenarios in a safe environment. Practice identifying phishing, malware, and social engineering attacks.',
      color: '#7c3aed',
      benefits: ['Real-world Scenarios', 'Safe Environment', 'Instant Feedback', 'Progress Tracking']
    },
    {
      icon: Brain,
      title: 'AI-Powered Learning',
      description: 'Personalized learning paths adapted to your skill level and progress. AI analyzes your performance and recommends targeted content.',
      color: '#059669',
      benefits: ['Personalized Paths', 'Adaptive Difficulty', 'Smart Recommendations', 'Performance Analytics']
    },
    {
      icon: Trophy,
      title: 'Rewards & Badges',
      description: 'Collect badges, earn rewards, and showcase your achievements. Compete with peers and climb the global leaderboard.',
      color: '#dc2626',
      benefits: ['Digital Badges', 'Point System', 'Global Rankings', 'Special Rewards']
    },
    {
      icon: Eye,
      title: 'Phishing Detection',
      description: 'Master the art of spotting phishing emails, fake websites, and suspicious links through hands-on training modules.',
      color: '#ea580c',
      benefits: ['Email Analysis', 'URL Scanning', 'Pattern Recognition', 'Real Examples']
    },
    {
      icon: Lock,
      title: 'Security Best Practices',
      description: 'Learn password management, two-factor authentication, encryption, and other essential security practices.',
      color: '#0891b2',
      benefits: ['Password Security', '2FA Setup', 'Encryption Basics', 'Privacy Tools']
    }
  ];

  const gamificationFeatures = [
    {
      icon: Zap,
      title: 'Daily Challenges',
      description: 'Complete new security challenges every day to earn bonus points and maintain your streak.'
    },
    {
      icon: BarChart,
      title: 'Progress Tracking',
      description: 'Visualize your learning journey with detailed analytics and performance metrics.'
    },
    {
      icon: Users,
      title: 'Team Competitions',
      description: 'Form teams with other learners and compete in group challenges and tournaments.'
    },
    {
      icon: Award,
      title: 'Certification',
      description: 'Earn certificates upon completing courses and achieving mastery in specific topics.'
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
                <Shield size={64} color="#0066cc" strokeWidth={1.5} />
              </div>
            </div>
            <h1 style={styles.heroTitle}>Platform Features</h1>
            <p style={styles.heroSubtitle}>
              Gamified Cybersecurity Learning Experience
            </p>
            <p style={styles.heroDescription}>
              Master cybersecurity through interactive games, real-world simulations, and AI-powered 
              personalized learning. Make learning fun, engaging, and effective.
            </p>
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section style={styles.featuresSection}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Core Features</h2>
          <p style={styles.sectionSubtitle}>
            Everything you need to become a cybersecurity expert
          </p>

          <div style={styles.featuresGrid}>
            {mainFeatures.map((feature, index) => (
              <div
                key={index}
                style={{
                  ...styles.featureCard,
                  borderColor: hoveredFeature === index ? feature.color : 'rgba(0, 102, 204, 0.1)'
                }}
                className="fade-in-up feature-hover"
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div style={{...styles.featureIconBox, backgroundColor: `${feature.color}15`}}>
                  <feature.icon size={36} color={feature.color} strokeWidth={1.5} />
                </div>
                <h3 style={styles.featureTitle}>{feature.title}</h3>
                <p style={styles.featureDesc}>{feature.description}</p>
                <div style={styles.benefitsList}>
                  {feature.benefits.map((benefit, idx) => (
                    <div key={idx} style={styles.benefitItem}>
                      <div style={{...styles.benefitDot, backgroundColor: feature.color}}></div>
                      <span style={styles.benefitText}>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gamification Features */}
      <section style={styles.gamificationSection}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Gamification Elements</h2>
          <p style={styles.sectionSubtitle}>
            Learn faster and have fun while doing it
          </p>

          <div style={styles.gamificationGrid}>
            {gamificationFeatures.map((item, index) => (
              <div key={index} style={styles.gamificationCard} className="fade-in-up game-hover">
                <div style={styles.gameIcon}>
                  <item.icon size={32} color="#0066cc" strokeWidth={1.5} />
                </div>
                <h3 style={styles.gameTitle}>{item.title}</h3>
                <p style={styles.gameDesc}>{item.description}</p>
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
            Your journey to cybersecurity mastery in 4 simple steps
          </p>

          <div style={styles.stepsContainer}>
            <div style={styles.stepCard} className="fade-in-up delay-1">
              <div style={styles.stepNumber}>1</div>
              <h3 style={styles.stepTitle}>Choose Your Path</h3>
              <p style={styles.stepDesc}>
                Select from beginner, intermediate, or advanced learning tracks based on your current skill level.
              </p>
            </div>

            <div style={styles.stepCard} className="fade-in-up delay-2">
              <div style={styles.stepNumber}>2</div>
              <h3 style={styles.stepTitle}>Complete Challenges</h3>
              <p style={styles.stepDesc}>
                Work through interactive lessons, simulations, and real-world security scenarios.
              </p>
            </div>

            <div style={styles.stepCard} className="fade-in-up delay-3">
              <div style={styles.stepNumber}>3</div>
              <h3 style={styles.stepTitle}>Earn Rewards</h3>
              <p style={styles.stepDesc}>
                Collect points, unlock badges, and climb the leaderboard as you master new skills.
              </p>
            </div>

            <div style={styles.stepCard} className="fade-in-up delay-4">
              <div style={styles.stepNumber}>4</div>
              <h3 style={styles.stepTitle}>Get Certified</h3>
              <p style={styles.stepDesc}>
                Earn certificates and showcase your cybersecurity knowledge to employers and peers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={styles.statsSection}>
        <div style={styles.container}>
          <div style={styles.statsGrid}>
            <div style={styles.statCard} className="fade-in-up delay-1">
              <div style={styles.statValue}>500+</div>
              <div style={styles.statLabel}>Interactive Challenges</div>
            </div>
            <div style={styles.statCard} className="fade-in-up delay-2">
              <div style={styles.statValue}>50+</div>
              <div style={styles.statLabel}>Achievement Badges</div>
            </div>
            <div style={styles.statCard} className="fade-in-up delay-3">
              <div style={styles.statValue}>24/7</div>
              <div style={styles.statLabel}>Learning Access</div>
            </div>
            <div style={styles.statCard} className="fade-in-up delay-4">
              <div style={styles.statValue}>100%</div>
              <div style={styles.statLabel}>Free to Use</div>
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

  .feature-hover {
    transition: all 0.3s ease;
  }

  .feature-hover:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 45px rgba(0, 102, 204, 0.2);
  }

  .game-hover {
    transition: all 0.3s ease;
  }

  .game-hover:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 35px rgba(0, 102, 204, 0.15);
  }

  @media (max-width: 768px) {
    .features-grid, .gamification-grid, .steps-container, .stats-grid {
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
    margin: '0 auto',
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '30px',
    marginTop: '50px',
  },
  featureCard: {
    padding: '40px 35px',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    border: '2px solid rgba(0, 102, 204, 0.1)',
    boxShadow: '0 8px 25px rgba(0, 102, 204, 0.08)',
  },
  featureIconBox: {
    width: '80px',
    height: '80px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '25px',
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
    marginBottom: '25px',
  },
  benefitsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  benefitItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  benefitDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  benefitText: {
    fontSize: '0.95rem',
    color: '#4b5563',
    fontWeight: '500',
  },

  // Gamification Section
  gamificationSection: {
    padding: '80px 0',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    margin: '0 -20px',
  },
  gamificationGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '30px',
    marginTop: '50px',
  },
  gamificationCard: {
    padding: '40px 35px',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(0, 102, 204, 0.1)',
  },
  gameIcon: {
    width: '80px',
    height: '80px',
    margin: '0 auto 25px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #e0f2fe 0%, #bfdbfe 100%)',
    borderRadius: '50%',
  },
  gameTitle: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '15px',
  },
  gameDesc: {
    fontSize: '1rem',
    color: '#64748b',
    lineHeight: '1.7',
  },

  // How It Works Section
  howItWorksSection: {
    padding: '80px 0',
  },
  stepsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
    marginTop: '50px',
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
    width: '60px',
    height: '60px',
    margin: '0 auto 25px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
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

  // Stats Section
  statsSection: {
    padding: '80px 0',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
  },
  statCard: {
    padding: '40px 30px',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(0, 102, 204, 0.12)',
  },
  statValue: {
    fontSize: '3.5rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #0066cc 0%, #0052a3 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '10px',
  },
  statLabel: {
    fontSize: '1rem',
    color: '#64748b',
    fontWeight: '600',
  },
};

export default FeaturesPage;