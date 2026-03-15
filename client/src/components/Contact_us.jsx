import React, { useState } from 'react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'General Inquiry',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for contacting us! We will get back to you soon.');
  };

  const contactMethods = [
    {
      id: 1,
      icon: '📧',
      title: 'Email Us',
      value: 'support@cyberaware.com',
      description: 'We\'ll respond within 24 hours',
      link: 'mailto:support@cyberaware.com'
    },
    {
      id: 2,
      icon: '📞',
      title: 'Call Us',
      value: '+1 (555) 123-4567',
      description: 'Mon-Fri, 9 AM - 6 PM IST',
      link: 'tel:+15551234567'
    },
    {
      id: 3,
      icon: '💬',
      title: 'Live Chat',
      value: 'Chat with us',
      description: 'Average response time: 2 min',
      link: '#'
    },
    {
      id: 4,
      icon: '📍',
      title: 'Visit Us',
      value: 'Aurangabad, Maharashtra',
      description: 'By appointment only',
      link: '#'
    }
  ];

  const teamMembers = [
    {
      name: 'Mohammad Saif Rakhangi',
      role: 'Founder & CEO',
      email: 'saif@cyberaware.com'
    },
    {
      name: 'Shahim Shaikh',
      role: 'Frontend Lead',
      email: 'shahim@cyberaware.com'
    },
    {
      name: 'Mohammad Maniyar',
      role: 'Backend Lead',
      email: 'maniyar@cyberaware.com'
    },
    {
      name: 'Rehan Shaikh',
      role: 'Documentation Head',
      email: 'rehan@cyberaware.com'
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
      maxWidth: '700px',
      margin: '0 auto',
      animation: 'fadeInUp 1s ease-out 0.2s both',
    },
    mainContent: {
      maxWidth: '1400px',
      margin: '60px auto 0',
      padding: '0 20px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '40px',
    },
    formSection: {
      background: 'white',
      borderRadius: '25px',
      padding: '50px',
      boxShadow: '0 15px 40px rgba(13, 71, 161, 0.15)',
    },
    formTitle: {
      fontSize: '2rem',
      color: '#0d47a1',
      marginBottom: '30px',
      fontWeight: '700',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '25px',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    label: {
      fontSize: '1rem',
      color: '#0d47a1',
      fontWeight: '600',
    },
    input: {
      padding: '14px 20px',
      border: '2px solid #bbdefb',
      borderRadius: '12px',
      fontSize: '1rem',
      outline: 'none',
      transition: 'all 0.3s ease',
    },
    select: {
      padding: '14px 20px',
      border: '2px solid #bbdefb',
      borderRadius: '12px',
      fontSize: '1rem',
      outline: 'none',
      transition: 'all 0.3s ease',
      background: 'white',
      cursor: 'pointer',
    },
    textarea: {
      padding: '14px 20px',
      border: '2px solid #bbdefb',
      borderRadius: '12px',
      fontSize: '1rem',
      outline: 'none',
      transition: 'all 0.3s ease',
      minHeight: '150px',
      resize: 'vertical',
      fontFamily: 'inherit',
    },
    submitButton: {
      background: 'linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)',
      color: 'white',
      border: 'none',
      padding: '16px 40px',
      fontSize: '1.1rem',
      fontWeight: '600',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 5px 20px rgba(25, 118, 210, 0.3)',
      marginTop: '10px',
    },
    infoSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '30px',
    },
    contactMethodsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '20px',
    },
    methodCard: {
      background: 'white',
      borderRadius: '20px',
      padding: '30px',
      boxShadow: '0 8px 25px rgba(13, 71, 161, 0.1)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      textDecoration: 'none',
      color: 'inherit',
      display: 'block',
    },
    methodHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      marginBottom: '15px',
    },
    methodIcon: {
      fontSize: '2.5rem',
      width: '60px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
      borderRadius: '15px',
    },
    methodContent: {
      flex: 1,
    },
    methodTitle: {
      fontSize: '1.3rem',
      color: '#0d47a1',
      fontWeight: '700',
      marginBottom: '5px',
    },
    methodValue: {
      fontSize: '1.1rem',
      color: '#1976d2',
      fontWeight: '600',
    },
    methodDescription: {
      fontSize: '0.95rem',
      color: '#616161',
      marginTop: '10px',
    },
    teamSection: {
      background: 'white',
      borderRadius: '20px',
      padding: '35px',
      boxShadow: '0 8px 25px rgba(13, 71, 161, 0.1)',
    },
    teamTitle: {
      fontSize: '1.6rem',
      color: '#0d47a1',
      fontWeight: '700',
      marginBottom: '25px',
    },
    teamList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    teamMember: {
      padding: '15px',
      borderRadius: '12px',
      background: '#f5f5f5',
      transition: 'all 0.3s ease',
    },
    memberName: {
      fontSize: '1.1rem',
      color: '#0d47a1',
      fontWeight: '600',
      marginBottom: '4px',
    },
    memberRole: {
      fontSize: '0.95rem',
      color: '#1976d2',
      marginBottom: '6px',
    },
    memberEmail: {
      fontSize: '0.9rem',
      color: '#64b5f6',
      textDecoration: 'none',
    },
    mapSection: {
      maxWidth: '1400px',
      margin: '60px auto 0',
      padding: '0 20px',
    },
    mapCard: {
      background: 'white',
      borderRadius: '25px',
      overflow: 'hidden',
      boxShadow: '0 15px 40px rgba(13, 71, 161, 0.15)',
    },
    mapPlaceholder: {
      width: '100%',
      height: '400px',
      background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem',
      color: '#1976d2',
      fontWeight: '600',
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

          .input:focus, .select:focus, .textarea:focus {
            border-color: #42a5f5;
            box-shadow: 0 5px 20px rgba(66, 165, 245, 0.2);
          }

          .input::placeholder, .textarea::placeholder {
            color: #90caf9;
          }

          .submit-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(25, 118, 210, 0.5);
          }

          .method-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 15px 40px rgba(13, 71, 161, 0.2);
          }

          .team-member:hover {
            background: #e3f2fd;
            transform: translateX(5px);
          }

          @media (max-width: 1024px) {
            .main-content {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 768px) {
            .hero-title {
              font-size: 2.5rem !important;
            }
            .hero-subtitle {
              font-size: 1.1rem !important;
            }
            .form-section {
              padding: 35px 25px !important;
            }
          }

          @media (max-width: 480px) {
            .hero-title {
              font-size: 2rem !important;
            }
            .form-section {
              padding: 25px 20px !important;
            }
          }
        `}
      </style>

      <div style={styles.container}>
        {/* Hero Section */}
        <div style={styles.hero}>
          <h1 style={styles.heroTitle} className="hero-title">Contact Us</h1>
          <p style={styles.heroSubtitle} className="hero-subtitle">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        {/* Main Content */}
        <div style={styles.mainContent} className="main-content">
          {/* Contact Form */}
          <div style={styles.formSection} className="form-section">
            <h2 style={styles.formTitle}>Send us a Message</h2>
            <form style={styles.form} onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  style={styles.input}
                  className="input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="your.email@example.com"
                  style={styles.input}
                  className="input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Category *</label>
                <select
                  name="category"
                  style={styles.select}
                  className="select"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Security Issue">Security Issue</option>
                  <option value="Feature Request">Feature Request</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Subject *</label>
                <input
                  type="text"
                  name="subject"
                  placeholder="Brief subject of your message"
                  style={styles.input}
                  className="input"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Message *</label>
                <textarea
                  name="message"
                  placeholder="Tell us more about your inquiry..."
                  style={styles.textarea}
                  className="textarea"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button type="submit" style={styles.submitButton} className="submit-button">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div style={styles.infoSection}>
            <div style={styles.contactMethodsGrid}>
              {contactMethods.map((method) => (
                <a
                  key={method.id}
                  href={method.link}
                  style={styles.methodCard}
                  className="method-card"
                >
                  <div style={styles.methodHeader}>
                    <div style={styles.methodIcon}>{method.icon}</div>
                    <div style={styles.methodContent}>
                      <h3 style={styles.methodTitle}>{method.title}</h3>
                      <p style={styles.methodValue}>{method.value}</p>
                    </div>
                  </div>
                  <p style={styles.methodDescription}>{method.description}</p>
                </a>
              ))}
            </div>

            {/* Team Section */}
            <div style={styles.teamSection}>
              <h3 style={styles.teamTitle}>Direct Contact</h3>
              <div style={styles.teamList}>
                {teamMembers.map((member, index) => (
                  <div key={index} style={styles.teamMember} className="team-member">
                    <div style={styles.memberName}>{member.name}</div>
                    <div style={styles.memberRole}>{member.role}</div>
                    <a href={`mailto:${member.email}`} style={styles.memberEmail}>
                      {member.email}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div style={styles.mapSection}>
          <div style={styles.mapCard}>
            <div style={styles.mapPlaceholder}>
              📍 Aurangabad, Maharashtra, India
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;