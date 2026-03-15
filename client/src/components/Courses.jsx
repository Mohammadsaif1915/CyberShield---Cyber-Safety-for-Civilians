import React, { useState } from 'react';
import { BookOpen, Shield, Lock, Mail, Globe, Smartphone, Code, Users, Clock, Award, CheckCircle, Star } from 'lucide-react';

const CoursesPage = () => {
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const courses = [
    {
      id: 1,
      title: 'Cybersecurity Fundamentals',
      description: 'Learn the basics of cybersecurity, common threats, and how to protect yourself online.',
      level: 'beginner',
      category: 'fundamentals',
      duration: '4 weeks',
      modules: 12,
      students: 15420,
      rating: 4.8,
      icon: Shield,
      color: '#0066cc',
      topics: ['Basic Security Concepts', 'Threat Landscape', 'Password Security', 'Safe Browsing']
    },
    {
      id: 2,
      title: 'Phishing Detection Mastery',
      description: 'Master the art of identifying phishing emails, fake websites, and social engineering attacks.',
      level: 'beginner',
      category: 'phishing',
      duration: '3 weeks',
      modules: 10,
      students: 12350,
      rating: 4.9,
      icon: Mail,
      color: '#7c3aed',
      topics: ['Email Analysis', 'URL Inspection', 'Fake Websites', 'Social Engineering']
    },
    {
      id: 3,
      title: 'Network Security Essentials',
      description: 'Understand network protocols, firewalls, VPNs, and how to secure your network.',
      level: 'intermediate',
      category: 'network',
      duration: '6 weeks',
      modules: 15,
      students: 8900,
      rating: 4.7,
      icon: Globe,
      color: '#059669',
      topics: ['Network Protocols', 'Firewalls', 'VPN Setup', 'Wi-Fi Security']
    },
    {
      id: 4,
      title: 'Mobile Security & Privacy',
      description: 'Secure your smartphone and protect your personal data on mobile devices.',
      level: 'beginner',
      category: 'mobile',
      duration: '2 weeks',
      modules: 8,
      students: 10200,
      rating: 4.6,
      icon: Smartphone,
      color: '#dc2626',
      topics: ['App Permissions', 'Mobile Malware', 'Privacy Settings', 'Secure Messaging']
    },
    {
      id: 5,
      title: 'Secure Coding Practices',
      description: 'Learn how to write secure code and protect applications from vulnerabilities.',
      level: 'advanced',
      category: 'development',
      duration: '8 weeks',
      modules: 20,
      students: 6500,
      rating: 4.9,
      icon: Code,
      color: '#ea580c',
      topics: ['Input Validation', 'SQL Injection', 'XSS Prevention', 'Authentication']
    },
    {
      id: 6,
      title: 'Password Management & 2FA',
      description: 'Create strong passwords, use password managers, and set up two-factor authentication.',
      level: 'beginner',
      category: 'fundamentals',
      duration: '2 weeks',
      modules: 6,
      students: 18700,
      rating: 4.8,
      icon: Lock,
      color: '#0891b2',
      topics: ['Password Strength', 'Password Managers', '2FA Setup', 'Backup Codes']
    },
    {
      id: 7,
      title: 'Social Engineering Defense',
      description: 'Recognize and defend against social engineering tactics and manipulation techniques.',
      level: 'intermediate',
      category: 'social',
      duration: '4 weeks',
      modules: 12,
      students: 7800,
      rating: 4.7,
      icon: Users,
      color: '#8b5cf6',
      topics: ['Manipulation Tactics', 'Pretexting', 'Baiting', 'Defense Strategies']
    },
    {
      id: 8,
      title: 'Advanced Threat Detection',
      description: 'Learn advanced techniques to detect malware, ransomware, and advanced persistent threats.',
      level: 'advanced',
      category: 'threats',
      duration: '10 weeks',
      modules: 25,
      students: 4200,
      rating: 4.9,
      icon: Award,
      color: '#f59e0b',
      topics: ['Malware Analysis', 'Ransomware', 'APT Detection', 'Incident Response']
    }
  ];

  const levels = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' }
  ];

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'fundamentals', name: 'Fundamentals' },
    { id: 'phishing', name: 'Phishing' },
    { id: 'network', name: 'Network Security' },
    { id: 'mobile', name: 'Mobile Security' },
    { id: 'development', name: 'Secure Development' },
    { id: 'social', name: 'Social Engineering' },
    { id: 'threats', name: 'Threat Detection' }
  ];

  const filteredCourses = courses.filter(course => {
    const levelMatch = selectedLevel === 'all' || course.level === selectedLevel;
    const categoryMatch = selectedCategory === 'all' || course.category === selectedCategory;
    return levelMatch && categoryMatch;
  });

  return (
    <div style={styles.pageContainer}>
      <style>{internalCSS}</style>

      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.container}>
          <div className="fade-in-up">
            <div style={styles.heroIcon}>
              <div style={styles.iconCircle}>
                <BookOpen size={64} color="#0066cc" strokeWidth={1.5} />
              </div>
            </div>
            <h1 style={styles.heroTitle}>Free Cybersecurity Courses</h1>
            <p style={styles.heroSubtitle}>
              100% Free • Self-Paced • Certificate Included
            </p>
            <p style={styles.heroDescription}>
              Learn cybersecurity at your own pace with our comprehensive, gamified courses. 
              All courses are completely free and include certificates upon completion.
            </p>
          </div>

          {/* Stats */}
          <div style={styles.statsRow}>
            <div style={styles.statBox} className="fade-in-up delay-1">
              <div style={styles.statValue}>50+</div>
              <div style={styles.statLabel}>Free Courses</div>
            </div>
            <div style={styles.statBox} className="fade-in-up delay-2">
              <div style={styles.statValue}>50,000+</div>
              <div style={styles.statLabel}>Active Learners</div>
            </div>
            <div style={styles.statBox} className="fade-in-up delay-3">
              <div style={styles.statValue}>100%</div>
              <div style={styles.statLabel}>Free Forever</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section style={styles.filtersSection}>
        <div style={styles.container}>
          <div style={styles.filtersContainer}>
            {/* Level Filter */}
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Difficulty Level</label>
              <div style={styles.filterButtons}>
                {levels.map(level => (
                  <button
                    key={level.id}
                    onClick={() => setSelectedLevel(level.id)}
                    style={selectedLevel === level.id ? {...styles.filterButton, ...styles.filterButtonActive} : styles.filterButton}
                    className="filter-btn"
                  >
                    {level.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Category</label>
              <div style={styles.filterButtons}>
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    style={selectedCategory === category.id ? {...styles.filterButton, ...styles.filterButtonActive} : styles.filterButton}
                    className="filter-btn"
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section style={styles.coursesSection}>
        <div style={styles.container}>
          <div style={styles.resultsHeader}>
            <h2 style={styles.resultsTitle}>
              {filteredCourses.length} Course{filteredCourses.length !== 1 ? 's' : ''} Available
            </h2>
          </div>

          <div style={styles.coursesGrid}>
            {filteredCourses.map((course, index) => (
              <div
                key={course.id}
                style={styles.courseCard}
                className="fade-in-up course-hover"
              >
                {/* Free Badge */}
                <div style={styles.freeBadge}>100% FREE</div>

                {/* Course Icon */}
                <div style={{...styles.courseIcon, backgroundColor: `${course.color}15`}}>
                  <course.icon size={40} color={course.color} strokeWidth={1.5} />
                </div>

                {/* Level Badge */}
                <div style={{...styles.levelBadge, backgroundColor: course.level === 'beginner' ? '#059669' : course.level === 'intermediate' ? '#ea580c' : '#dc2626'}}>
                  {course.level.toUpperCase()}
                </div>

                {/* Course Info */}
                <h3 style={styles.courseTitle}>{course.title}</h3>
                <p style={styles.courseDesc}>{course.description}</p>

                {/* Course Meta */}
                <div style={styles.courseMeta}>
                  <div style={styles.metaItem}>
                    <Clock size={16} color="#64748b" />
                    <span>{course.duration}</span>
                  </div>
                  <div style={styles.metaItem}>
                    <BookOpen size={16} color="#64748b" />
                    <span>{course.modules} modules</span>
                  </div>
                  <div style={styles.metaItem}>
                    <Users size={16} color="#64748b" />
                    <span>{course.students.toLocaleString()}</span>
                  </div>
                </div>

                {/* Rating */}
                <div style={styles.ratingContainer}>
                  <Star size={18} color="#f59e0b" fill="#f59e0b" />
                  <span style={styles.ratingText}>{course.rating}</span>
                </div>

                {/* Topics */}
                <div style={styles.topicsList}>
                  {course.topics.map((topic, idx) => (
                    <div key={idx} style={styles.topicItem}>
                      <CheckCircle size={14} color={course.color} />
                      <span style={styles.topicText}>{topic}</span>
                    </div>
                  ))}
                </div>

                {/* Enroll Button */}
                <button style={{...styles.enrollButton, backgroundColor: course.color}} className="enroll-btn">
                  Start Learning Free
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Free Section */}
      <section style={styles.whyFreeSection}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Why Are All Courses Free?</h2>
          <p style={styles.sectionSubtitle}>
            Our mission is to make cybersecurity education accessible to everyone
          </p>

          <div style={styles.whyGrid}>
            <div style={styles.whyCard} className="fade-in-up delay-1">
              <div style={styles.whyNumber}>01</div>
              <h3 style={styles.whyTitle}>Educational Mission</h3>
              <p style={styles.whyText}>
                We believe cybersecurity knowledge should be accessible to all students and professionals, 
                regardless of financial background.
              </p>
            </div>

            <div style={styles.whyCard} className="fade-in-up delay-2">
              <div style={styles.whyNumber}>02</div>
              <h3 style={styles.whyTitle}>Safer Digital World</h3>
              <p style={styles.whyText}>
                The more people understand cybersecurity, the safer everyone becomes. Free education 
                creates a more secure internet for all.
              </p>
            </div>

            <div style={styles.whyCard} className="fade-in-up delay-3">
              <div style={styles.whyNumber}>03</div>
              <h3 style={styles.whyTitle}>Final Year Project</h3>
              <p style={styles.whyText}>
                This platform was created as a final year project with the goal of making real impact 
                through accessible education.
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

  .filter-btn {
    transition: all 0.3s ease;
  }

  .filter-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 102, 204, 0.15);
  }

  .course-hover {
    transition: all 0.3s ease;
  }

  .course-hover:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 45px rgba(0, 102, 204, 0.2);
  }

  .enroll-btn {
    transition: all 0.3s ease;
  }

  .enroll-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    .stats-row, .courses-grid, .why-grid, .filter-buttons {
      grid-template-columns: 1fr !important;
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
    fontSize: '1.3rem',
    color: '#059669',
    fontWeight: '700',
    marginBottom: '25px',
  },
  heroDescription: {
    fontSize: '1.2rem',
    color: '#374151',
    lineHeight: '1.8',
    maxWidth: '900px',
    margin: '0 auto',
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

  // Filters Section
  filtersSection: {
    padding: '40px 0',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    margin: '0 -20px 60px',
  },
  filtersContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  filterLabel: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#1a1a1a',
  },
  filterButtons: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  filterButton: {
    padding: '12px 24px',
    backgroundColor: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#6b7280',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(0, 102, 204, 0.08)',
  },
  filterButtonActive: {
    background: 'linear-gradient(135deg, #0066cc 0%, #0052a3 100%)',
    color: '#ffffff',
    boxShadow: '0 6px 20px rgba(0, 102, 204, 0.25)',
  },

  // Courses Section
  coursesSection: {
    padding: '40px 0 80px',
  },
  resultsHeader: {
    marginBottom: '40px',
  },
  resultsTitle: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#1a1a1a',
  },
  coursesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '30px',
  },
  courseCard: {
    padding: '35px',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    border: '2px solid rgba(0, 102, 204, 0.1)',
    boxShadow: '0 8px 25px rgba(0, 102, 204, 0.08)',
    position: 'relative',
  },
  freeBadge: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    padding: '6px 16px',
    backgroundColor: '#059669',
    color: '#ffffff',
    fontSize: '0.75rem',
    fontWeight: '800',
    borderRadius: '20px',
    letterSpacing: '0.5px',
  },
  courseIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  levelBadge: {
    display: 'inline-block',
    padding: '6px 14px',
    color: '#ffffff',
    fontSize: '0.75rem',
    fontWeight: '700',
    borderRadius: '8px',
    marginBottom: '15px',
    letterSpacing: '0.5px',
  },
  courseTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '12px',
  },
  courseDesc: {
    fontSize: '1rem',
    color: '#64748b',
    lineHeight: '1.7',
    marginBottom: '20px',
  },
  courseMeta: {
    display: 'flex',
    gap: '20px',
    marginBottom: '15px',
    flexWrap: 'wrap',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.9rem',
    color: '#64748b',
  },
  ratingContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '20px',
  },
  ratingText: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1a1a1a',
  },
  topicsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '25px',
  },
  topicItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  topicText: {
    fontSize: '0.9rem',
    color: '#4b5563',
  },
  enrollButton: {
    width: '100%',
    padding: '14px 28px',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '700',
    color: '#ffffff',
    cursor: 'pointer',
  },

  // Why Free Section
  whyFreeSection: {
    padding: '80px 0',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    margin: '0 -20px',
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
  whyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    marginTop: '50px',
  },
  whyCard: {
    padding: '40px 35px',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
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

export default CoursesPage;