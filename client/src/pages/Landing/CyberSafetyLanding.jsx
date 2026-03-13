import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import { Shield, Eye, Brain, TrendingUp, Lock, Menu, X, ArrowRight, Twitter, Linkedin, Github, Mail, Phone, MapPin, CheckCircle2, Zap, Users, Award } from 'lucide-react';
import './CyberSafetyLanding.css';

const CyberSafetyLanding = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subStatus, setSubStatus] = useState('');
  const [subMessage, setSubMessage] = useState('');
  const [subLoading, setSubLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const statsRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);

    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );

    if (statsRef.current) observer.observe(statsRef.current);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      if (statsRef.current) observer.unobserve(statsRef.current);
    };
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!subscribeEmail.trim()) return;
    setSubLoading(true);
    setSubStatus('');
    setSubMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: subscribeEmail }),
      });
      const data = await res.json();

      if (res.ok) {
        setSubStatus('success');
        setSubMessage(data.message || 'You are now subscribed!');
        setSubscribeEmail('');
        setTimeout(() => setSubStatus(''), 6000);
      } else {
        setSubStatus('error');
        setSubMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setSubStatus('error');
      setSubMessage('Could not connect to server. Please try again later.');
    } finally {
      setSubLoading(false);
    }
  };

  const AnimatedCounter = ({ end, duration = 2000, suffix = '' }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!statsVisible) return;
      let startTime;
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, [statsVisible, end, duration]);

    return <span>{count}{suffix}</span>;
  };

  const features = [
    { icon: Shield, title: 'Cyber Threat Awareness', description: 'Learn to identify phishing, malware, and social engineering attacks before they happen.', colorClass: 'feature-blue' },
    { icon: Lock, title: 'Safe Digital Practices', description: 'Master password security, two-factor authentication, and privacy protection techniques.', colorClass: 'feature-cyan' },
    { icon: Brain, title: 'Smart Awareness Quizzes', description: 'Test your knowledge with scenario-based assessments and get instant feedback.', colorClass: 'feature-blue-cyan' },
    { icon: TrendingUp, title: 'Risk Understanding', description: 'Understand digital risk factors and make informed decisions about online behavior.', colorClass: 'feature-cyan-blue' },
  ];

  const stats = [
    { value: 68, suffix: '%', label: 'Of students encounter phishing attempts', sublabel: 'Source: Cybersecurity Education Studies' },
    { value: 43, suffix: '%', label: 'Experience identity-related incidents', sublabel: 'In their academic career' },
    { value: 92, suffix: '%', label: 'Feel more confident after training', sublabel: 'Based on student surveys' },
  ];

  return (
    <div className="landing-page-3d">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`navbar-3d ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-container">
          <div className="navbar-content">
            <div className="logo-container-3d">
              <div className="logo-wrapper-3d">
                <div className="logo-icon-3d">
                  <Shield className="icon" size={24} />
                  <div className="icon-glow"></div>
                </div>
              </div>
              <span className="logo-text-3d">CyberShield</span>
            </div>

            <div className="nav-links">
              <a href="/about_us" className="nav-link-3d">About</a>
              <a href="#contact" className="nav-link-3d">Contact</a>
              <Link to="/login" className="nav-signin-3d">Sign In</Link>
              <Link to="/register" className="btn-primary-3d">
                <span>Sign Up</span>
                <div className="btn-shine"></div>
              </Link>
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="mobile-menu-btn">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-menu-3d">
            <a href="/about_us" className="mobile-link">About</a>
            <a href="#contact" className="mobile-link">Contact</a>
            <Link to="/login" className="nav-signin-3d">Sign In</Link>
            <Link to="/register" className="btn-primary-3d">Sign Up</Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="hero-section-3d">
        <div className="hero-3d-bg" style={{
          transform: `translate(${mousePosition.x / 50}px, ${mousePosition.y / 50}px)`
        }}></div>
        
        <div className="hero-container-3d">
          <div className="hero-grid-3d">
            <div className="hero-content-3d fade-in-up">
              <div className="hero-badge-3d">
                <div className="badge-pulse"></div>
                <Zap size={16} />
                <span>Trusted by 10,000+ Students</span>
              </div>
              
              <h1 className="hero-title-3d">
                Cyber Safety Is a Skill.
                <span className="hero-title-gradient-3d"> Learn It Before You Need It.</span>
              </h1>
              
              <p className="hero-description-3d">
                A modern cyber awareness platform designed to help students recognize, understand, and prevent real-world digital threats.
              </p>
              
              <div className="hero-buttons-3d">
                <Link to="/Register" className="btn-hero-primary-3d">
                  <span>Sign Up Free</span>
                  <ArrowRight className="btn-icon" size={20} />
                  <div className="btn-particles">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </Link>
                <button className="btn-hero-secondary-3d">
                  <span>Learn More</span>
                  <div className="btn-border-animate"></div>
                </button>
              </div>
              
              <div className="trust-indicators-3d">
                <div className="trust-item-3d">
                  <div className="trust-icon"><Award size={20} /></div>
                  <div className="trust-value">98%</div>
                  <div className="trust-label">Safety Score</div>
                </div>
                <div className="trust-item-3d">
                  <div className="trust-icon"><Users size={20} /></div>
                  <div className="trust-value">50K+</div>
                  <div className="trust-label">Threats Identified</div>
                </div>
                <div className="trust-item-3d">
                  <div className="trust-icon"><Zap size={20} /></div>
                  <div className="trust-value">24/7</div>
                  <div className="trust-label">Learning Access</div>
                </div>
              </div>
            </div>

            <div className="hero-illustration-3d fade-in-up delay-2">
              <div className="illustration-3d-container">
                <div className="central-shield-3d">
                  <div className="shield-core">
                    <Shield className="shield-icon" size={96} strokeWidth={1.5} />
                    <div className="shield-rings">
                      <div className="ring ring-1"></div>
                      <div className="ring ring-2"></div>
                      <div className="ring ring-3"></div>
                    </div>
                  </div>
                </div>
                
                <div className="floating-orbs">
                  <div className="orb orb-1">
                    <Lock size={28} />
                    <div className="orb-glow"></div>
                  </div>
                  <div className="orb orb-2">
                    <Eye size={28} />
                    <div className="orb-glow"></div>
                  </div>
                  <div className="orb orb-3">
                    <Brain size={28} />
                    <div className="orb-glow"></div>
                  </div>
                </div>
                
                <div className="connection-lines">
                  <svg viewBox="0 0 500 500">
                    <circle cx="250" cy="250" r="120" className="connect-circle c1" />
                    <circle cx="250" cy="250" r="160" className="connect-circle c2" />
                    <circle cx="250" cy="250" r="200" className="connect-circle c3" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section-3d">
        <div className="features-container">
          <div className="section-header-3d">
            <h2 className="section-title-3d">Comprehensive Cyber Awareness</h2>
            <p className="section-description-3d">Build essential digital safety skills through interactive learning and real-world scenarios</p>
          </div>
          
          <div className="features-grid-3d">
            {features.map((feature, index) => (
              <div key={index} className={`feature-card-3d fade-in-up delay-${index + 1}`}>
                <div className="card-3d-inner">
                  <div className="card-3d-front">
                    <div className={`feature-icon-3d ${feature.colorClass}`}>
                      <feature.icon size={28} strokeWidth={2} />
                      <div className="icon-orbit"></div>
                    </div>
                    <h3 className="feature-title-3d">{feature.title}</h3>
                    <p className="feature-description-3d">{feature.description}</p>
                    <div className="card-3d-shine"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Protect Section */}
      <section className="protect-section-3d">
        <div className="protect-container">
          <div className="section-header-3d">
            <h2 className="section-title-3d">Protecting Everyone, Everywhere</h2>
            <p className="section-description-3d">Tailored cyber safety solutions for every stage of your digital life</p>
          </div>
          
          <div className="protect-grid-3d">
            {[
              { icon: Brain, cls: 'protect-icon-student', title: 'Students', desc: 'Navigate campus life safely with protection against academic scams, fake job offers, and social media threats.', items: ['Recognize phishing emails targeting students', 'Identify fake internship & scholarship scams', 'Protect personal data on social platforms', 'Safe online banking & payment practices'], stat: '3 in 5', statLabel: 'students fall for online scams during college' },
              { icon: Shield, cls: 'protect-icon-employee', title: 'Professionals', desc: 'Safeguard your career and company data from corporate espionage, business email compromise, and ransomware.', items: ['Defend against CEO fraud & wire transfer scams', 'Secure remote work environments', 'Protect confidential business information', 'Recognize social engineering attacks'], stat: '₹41,750 Cr', statLabel: 'lost to business email compromise in 2023' },
              { icon: Lock, cls: 'protect-icon-senior', title: 'Seniors', desc: 'Stay safe from scammers targeting retirement savings, healthcare fraud, and tech support scams.', items: ['Spot IRS, Medicare & Social Security scams', 'Avoid romance & lottery fraud schemes', 'Protect retirement & investment accounts', 'Easy-to-understand security guidelines'], stat: '₹28,350 Cr', statLabel: 'stolen from seniors by scammers annually' },
            ].map((card, i) => (
              <div key={i} className={`protect-card-3d fade-in-up delay-${i + 1}`}>
                <div className="protect-card-inner">
                  <div className="protect-card-header-3d">
                    <div className={`protect-icon-3d ${card.cls}`}>
                      <card.icon size={32} strokeWidth={2} />
                    </div>
                    <h3 className="protect-title-3d">{card.title}</h3>
                  </div>
                  <p className="protect-description-3d">{card.desc}</p>
                  <ul className="protect-features-3d">
                    {card.items.map((item, j) => (
                      <li key={j} className="protect-feature-item-3d">
                        <div className="feature-check-3d">✓</div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="protect-stat-3d">
                    <div className="protect-stat-value-3d">{card.stat}</div>
                    <div className="protect-stat-label-3d">{card.statLabel}</div>
                  </div>
                  <div className="card-3d-depth"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Threats Section */}
      <section className="threats-section-3d">
        <div className="threats-container">
          <div className="section-header-3d">
            <h2 className="section-title-3d">Real Threats. Real Protection.</h2>
            <p className="section-description-3d">Learn to identify and defend against the most common cyber attacks</p>
          </div>
          
          <div className="threats-grid-3d">
            {[
              { icon: '⚠️', title: 'Phishing Attacks', desc: 'Fake emails, texts, and websites designed to steal your passwords and personal information.', example: '"Your account has been locked. Click here to verify..."' },
              { icon: '💳', title: 'Financial Fraud', desc: 'Scammers impersonating banks, payment services, or government agencies to access your money.', example: '"Urgent: Suspicious activity detected. Confirm your details..."' },
              { icon: '🔒', title: 'Identity Theft', desc: 'Criminals using your personal data to open accounts, file taxes, or commit crimes in your name.', example: '"Complete this quick survey to claim your prize..."' },
              { icon: '💻', title: 'Ransomware', desc: 'Malicious software that locks your files and demands payment for their release.', example: '"Your files are encrypted. Pay ₹41,500 to recover..."' },
            ].map((t, i) => (
              <div key={i} className={`threat-card-3d fade-in-up delay-${i + 1}`}>
                <div className="threat-card-inner">
                  <div className="threat-icon-3d">{t.icon}</div>
                  <h3 className="threat-title-3d">{t.title}</h3>
                  <p className="threat-description-3d">{t.desc}</p>
                  <div className="threat-example-3d">{t.example}</div>
                  <div className="threat-card-glow"></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="threats-cta-3d">
            <p className="threats-cta-text">Don't wait until it's too late. <strong>Prevention is always easier than recovery.</strong></p>
            <Link to="/Register" className="btn-threats-3d">
              <span>Learn How to Stay Protected</span>
              <ArrowRight className="btn-icon" size={20} />
              <div className="btn-glow-effect"></div>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section-3d">
        <div className="testimonials-container">
          <div className="section-header-3d">
            <h2 className="section-title-3d">Trusted by Thousands</h2>
            <p className="section-description-3d">Real stories from people who avoided cyber attacks with our training</p>
          </div>
          
          <div className="testimonials-grid-3d">
            {[
              { quote: '"I almost fell for a fake scholarship email until I remembered the phishing patterns from CyberShield. Saved me from losing ₹1,65,000 and my personal data!"', avatar: 'S', name: 'Priya Sharma', title: 'Engineering Student, Delhi' },
              { quote: '"Our company avoided a ₹41.5 lakh wire transfer scam because our team completed the CyberShield training. The ROI was instant and invaluable."', avatar: 'R', name: 'Rajesh Kumar', title: 'Finance Manager, Mumbai' },
              { quote: '"As a senior citizen, I was targeted by tech support scammers. Thanks to this program, I recognized the red flags and reported them instead of falling victim."', avatar: 'M', name: 'Mrs. Meena Patel', title: 'Retired Teacher, Pune' },
            ].map((t, i) => (
              <div key={i} className={`testimonial-card-3d fade-in-up delay-${i + 1}`}>
                <div className="testimonial-inner">
                  <div className="quote-mark">"</div>
                  <div className="testimonial-quote-3d">{t.quote}</div>
                  <div className="testimonial-author-3d">
                    <div className="author-avatar-3d">{t.avatar}</div>
                    <div className="author-info-3d">
                      <div className="author-name-3d">{t.name}</div>
                      <div className="author-title-3d">{t.title}</div>
                    </div>
                  </div>
                  <div className="testimonial-card-shine"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="stats-section-3d">
        <div className="stats-3d-bg"></div>
        <div className="stats-container">
          <div className="section-header-3d">
            <h2 className="section-title-3d">Real Impact, Real Protection</h2>
            <p className="section-description-3d">Understanding digital threats is the first step toward staying safe online</p>
          </div>
          
          <div className="stats-grid-3d">
            {stats.map((stat, index) => (
              <div key={index} className={`stat-card-3d fade-in-up delay-${index + 1}`}>
                <div className="stat-card-inner">
                  <div className="stat-value-3d">
                    {statsVisible && <AnimatedCounter end={stat.value} suffix={stat.suffix} />}
                  </div>
                  <div className="stat-label-3d">{stat.label}</div>
                  <div className="stat-sublabel-3d">{stat.sublabel}</div>
                  <div className="stat-card-glow"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section-3d">
        <div className="cta-container">
          <div className="cta-card-3d">
            <div className="cta-3d-pattern"></div>
            <div className="cta-content-3d">
              <h2 className="cta-title-3d">Start Your Cyber Safety Journey Today</h2>
              <p className="cta-description-3d">Join thousands of students building essential digital safety skills. Free to start, always accessible.</p>
              <Link to="/Register" className="btn-cta-3d">
                <span>Get Started Free</span>
                <ArrowRight className="btn-icon" size={20} />
                <div className="btn-ripple"></div>
              </Link>
            </div>
            <div className="cta-3d-glow"></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-3d">
        <div className="footer-container">
          <div className="footer-main">
            <div className="footer-column footer-brand">
              <div className="footer-logo-3d">
                <div className="footer-logo-icon">
                  <Shield size={24} />
                </div>
                <span className="footer-logo-text">CyberShield</span>
              </div>
              <p className="footer-tagline">Empowering the next generation with essential digital safety knowledge and cyber awareness skills.</p>
              <div className="footer-contact">
                <a href="mailto:info@cybershield.edu" className="contact-item"><Mail size={16} /><span>info@cybershield.edu</span></a>
                <a href="tel:+1234567890" className="contact-item"><Phone size={16} /><span>+1 (234) 567-890</span></a>
                <div className="contact-item"><MapPin size={16} /><span>Mumbai, Maharashtra, India</span></div>
              </div>
            </div>

            <div className="footer-column">
              <h4 className="footer-heading">Platform</h4>
              <ul className="footer-links-list">
                {['Features', 'Courses', 'Resources', 'Community'].map(l => (
                  <li key={l}><a href={`#${l.toLowerCase()}`} className="footer-link-item">{l}</a></li>
                ))}
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-heading">Company</h4>
              <ul className="footer-links-list">
                {[
                  ['About Us', '/about_us'],
                  ['Our Team', '/team'],
                  ['Blog', '/blog'],
                ].map(([label, path]) => (
                  <li key={path}>
                    <a href={path} className="footer-link-item">{label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-heading">Support</h4>
              <ul className="footer-links-list">
                {[['Help Center', 'help'], ['Contact Us', 'contact'], ['FAQ', 'faq'], ['Feedback', 'feedback']].map(([label, hash]) => (
                  <li key={hash}><a href={`#${hash}`} className="footer-link-item">{label}</a></li>
                ))}
              </ul>
            </div>

            <div className="footer-column footer-newsletter">
              <h4 className="footer-heading">Stay Updated</h4>
              <p className="newsletter-description">Get the latest security tips and platform updates delivered to your inbox.</p>

              <form className="newsletter-form-3d" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="newsletter-input-3d"
                  value={subscribeEmail}
                  onChange={(e) => { setSubscribeEmail(e.target.value); setSubStatus(''); }}
                  disabled={subLoading}
                  required
                />
                <button type="submit" className="newsletter-btn-3d" disabled={subLoading}>
                  {subLoading ? 'Sending…' : 'Subscribe'}
                  {!subLoading && <ArrowRight size={16} />}
                </button>
              </form>

              {subStatus === 'success' && (
                <div className="success-popup">
                  <div className="success-header">
                    <CheckCircle2 size={18} color="#34d399" />
                    <span>You're in! 🎉</span>
                  </div>
                  <p>Welcome to the CyberShield community! You'll now receive the latest cyber safety tips, platform updates, and security alerts straight to your inbox. Stay safe out there!</p>
                </div>
              )}

              {subStatus === 'error' && (
                <div className="error-popup">
                  <p>⚠️ {subMessage}</p>
                </div>
              )}

              <div className="footer-social">
                <span className="social-label">Follow Us:</span>
                <div className="social-icons-3d">
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon-3d"><Twitter size={18} /></a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon-3d"><Linkedin size={18} /></a>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon-3d"><Github size={18} /></a>
                  <a href="mailto:info@cybershield.edu" className="social-icon-3d"><Mail size={18} /></a>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p className="footer-copyright">© 2026 CyberShield. All rights reserved.</p>
              <div className="footer-legal">
                {[['Privacy Policy', 'privacy'], ['Terms of Service', 'terms'], ['Cookie Policy', 'cookies'], ['Accessibility', 'accessibility']].map(([label, hash], i, arr) => (
                  <React.Fragment key={hash}>
                    <a href={`#${hash}`} className="legal-link">{label}</a>
                    {i < arr.length - 1 && <span className="legal-divider">•</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CyberSafetyLanding;