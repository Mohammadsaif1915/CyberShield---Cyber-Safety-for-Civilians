import React, { useState } from 'react';

const Our_Team = () => {
  const [hoveredMember, setHoveredMember] = useState(null);

  const teamMembers = [
    {
      id: 1,
      name: 'Mohammad Saif Rakhangi',
      role: 'Leader & Founder',
      description: 'Visionary leader driving the platform forward and managing all aspects of development',
      image: '/saif.jpg',
      skills: ['Leadership', 'Full Stack', 'Strategy'],
      linkedin: '#',
      github: '#'
    },
    {
      id: 2,
      name: 'Shahim Shaikh',
      role: 'Frontend Designer',
      description: 'Crafting beautiful and intuitive user interfaces for enhanced user experience',
      image: '/shahim.jpg',
      skills: ['UI/UX', 'React', 'Design'],
      linkedin: '#',
      github: '#'
    },
    {
      id: 3,
      name: 'Mohammad Maniyar',
      role: 'Backend Developer',
      description: 'Building robust server architecture and ensuring data security',
      image: '/maniyar.jpg',
      skills: ['Node.js', 'Database', 'API'],
      linkedin: '#',
      github: '#'
    },
    {
      id: 4,
      name: 'Rehan Shaikh',
      role: 'Documentation Specialist',
      description: 'Creating comprehensive documentation and technical content',
      image: '/rehan.jpg',
      skills: ['Technical Writing', 'Content', 'Research'],
      linkedin: '#',
      github: '#'
    }
  ];

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)',
      padding: '20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    hero: {
      textAlign: 'center',
      padding: '60px 20px',
      position: 'relative',
      overflow: 'hidden',
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
      maxWidth: '600px',
      margin: '0 auto',
      animation: 'fadeInUp 1s ease-out 0.2s both',
    },
    teamGrid: {
      maxWidth: '1400px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '40px',
      padding: '40px 20px',
    },
    teamCard: {
      background: 'white',
      borderRadius: '20px',
      padding: '40px 30px',
      boxShadow: '0 10px 30px rgba(13, 71, 161, 0.1)',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
    },
    teamCardHovered: {
      transform: 'translateY(-15px)',
      boxShadow: '0 20px 50px rgba(13, 71, 161, 0.25)',
    },
    cardFront: {
      textAlign: 'center',
      transition: 'opacity 0.3s ease',
    },
    cardFrontHidden: {
      opacity: 0,
    },
    imageContainer: {
      position: 'relative',
      width: '180px',
      height: '180px',
      margin: '0 auto 25px',
    },
    memberImage: {
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '5px solid #42a5f5',
      position: 'relative',
      zIndex: 2,
      transition: 'all 0.4s ease',
    },
    memberImageHovered: {
      borderColor: '#1976d2',
      transform: 'scale(1.05)',
    },
    imageRing: {
      position: 'absolute',
      top: '-10px',
      left: '-10px',
      right: '-10px',
      bottom: '-10px',
      borderRadius: '50%',
      border: '3px solid rgba(66, 165, 245, 0.3)',
      animation: 'pulse 2s ease-in-out infinite',
    },
    memberName: {
      fontSize: '1.5rem',
      color: '#0d47a1',
      marginBottom: '8px',
      fontWeight: '600',
    },
    memberRole: {
      fontSize: '1.1rem',
      color: '#1976d2',
      marginBottom: '20px',
      fontWeight: '500',
    },
    skillsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      justifyContent: 'center',
      marginTop: '20px',
    },
    skillBadge: {
      background: 'linear-gradient(135deg, #64b5f6 0%, #42a5f5 100%)',
      color: 'white',
      padding: '6px 16px',
      borderRadius: '20px',
      fontSize: '0.85rem',
      fontWeight: '500',
      transition: 'all 0.3s ease',
    },
    cardOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
      color: 'white',
      padding: '40px 30px',
      borderRadius: '20px',
      opacity: 0,
      transition: 'opacity 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
    },
    cardOverlayVisible: {
      opacity: 1,
    },
    memberDescription: {
      fontSize: '1.05rem',
      lineHeight: '1.6',
      marginBottom: '30px',
    },
    socialLinks: {
      display: 'flex',
      gap: '20px',
    },
    socialLink: {
      width: '45px',
      height: '45px',
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease',
      color: 'white',
      textDecoration: 'none',
    },
    statsSection: {
      maxWidth: '1200px',
      margin: '60px auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '30px',
      padding: '0 20px',
    },
    statItem: {
      background: 'white',
      padding: '40px 20px',
      borderRadius: '15px',
      textAlign: 'center',
      boxShadow: '0 5px 20px rgba(13, 71, 161, 0.1)',
      transition: 'all 0.3s ease',
    },
    statNumber: {
      fontSize: '3rem',
      fontWeight: '700',
      color: '#1976d2',
      marginBottom: '10px',
    },
    statLabel: {
      fontSize: '1.1rem',
      color: '#0d47a1',
      fontWeight: '500',
    },
    ctaSection: {
      maxWidth: '800px',
      margin: '60px auto',
      textAlign: 'center',
      background: 'white',
      padding: '60px 40px',
      borderRadius: '25px',
      boxShadow: '0 15px 40px rgba(13, 71, 161, 0.15)',
    },
    ctaTitle: {
      fontSize: '2.5rem',
      color: '#0d47a1',
      marginBottom: '20px',
      fontWeight: '700',
    },
    ctaText: {
      fontSize: '1.2rem',
      color: '#1565c0',
      marginBottom: '30px',
    },
    ctaButton: {
      background: 'linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)',
      color: 'white',
      border: 'none',
      padding: '16px 50px',
      fontSize: '1.1rem',
      fontWeight: '600',
      borderRadius: '30px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 5px 20px rgba(25, 118, 210, 0.3)',
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

          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
              opacity: 0.3;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.6;
            }
          }

          .skill-badge:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(66, 165, 245, 0.4);
          }

          .stat-item:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 40px rgba(13, 71, 161, 0.2);
          }

          .social-link:hover {
            background: white !important;
            color: #1976d2 !important;
            transform: translateY(-3px);
          }

          .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(25, 118, 210, 0.5);
          }

          .cta-button:active {
            transform: translateY(-1px);
          }

          @media (max-width: 768px) {
            .hero-title {
              font-size: 2.5rem !important;
            }
            .hero-subtitle {
              font-size: 1.1rem !important;
            }
            .cta-title {
              font-size: 2rem !important;
            }
            .cta-section {
              padding: 40px 20px !important;
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
          <div>
            <h1 style={styles.heroTitle} className="hero-title">Meet Our Team</h1>
            <p style={styles.heroSubtitle} className="hero-subtitle">
              Dedicated professionals working together to build a safer digital world
            </p>
          </div>
        </div>

        {/* Team Grid */}
        <div style={styles.teamGrid}>
          {teamMembers.map((member) => (
            <div
              key={member.id}
              style={{
                ...styles.teamCard,
                ...(hoveredMember === member.id ? styles.teamCardHovered : {})
              }}
              onMouseEnter={() => setHoveredMember(member.id)}
              onMouseLeave={() => setHoveredMember(null)}
            >
              {/* Front of card */}
              <div style={{
                ...styles.cardFront,
                ...(hoveredMember === member.id ? styles.cardFrontHidden : {})
              }}>
                <div style={styles.imageContainer}>
                  <img
                    src={member.image}
                    alt={member.name}
                    style={{
                      ...styles.memberImage,
                      ...(hoveredMember === member.id ? styles.memberImageHovered : {})
                    }}
                  />
                  <div style={styles.imageRing}></div>
                </div>
                <h3 style={styles.memberName}>{member.name}</h3>
                <p style={styles.memberRole}>{member.role}</p>
                <div style={styles.skillsContainer}>
                  {member.skills.map((skill, index) => (
                    <span key={index} style={styles.skillBadge} className="skill-badge">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hover overlay */}
              <div style={{
                ...styles.cardOverlay,
                ...(hoveredMember === member.id ? styles.cardOverlayVisible : {})
              }}>
                <p style={styles.memberDescription}>{member.description}</p>
                <div style={styles.socialLinks}>
                  <a href={member.linkedin} style={styles.socialLink} className="social-link">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                  <a href={member.github} style={styles.socialLink} className="social-link">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div style={styles.statsSection}>
          <div style={styles.statItem} className="stat-item">
            <div style={styles.statNumber}>4</div>
            <div style={styles.statLabel}>Team Members</div>
          </div>
          <div style={styles.statItem} className="stat-item">
            <div style={styles.statNumber}>100%</div>
            <div style={styles.statLabel}>Dedication</div>
          </div>
          <div style={styles.statItem} className="stat-item">
            <div style={styles.statNumber}>24/7</div>
            <div style={styles.statLabel}>Support</div>
          </div>
          <div style={styles.statItem} className="stat-item">
            <div style={styles.statNumber}>1</div>
            <div style={styles.statLabel}>Mission</div>
          </div>
        </div>

        {/* CTA Section */}
        <div style={styles.ctaSection} className="cta-section">
          <h2 style={styles.ctaTitle} className="cta-title">Want to Join Our Team?</h2>
          <p style={styles.ctaText}>
            We're always looking for talented individuals passionate about cybersecurity
          </p>
          <button style={styles.ctaButton} className="cta-button">Get In Touch</button>
        </div>
      </div>
    </>
  );
};

export default Our_Team;