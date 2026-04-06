import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const blogData = {
  1: {
    title: 'Understanding Phishing Attacks in 2024',
    category: 'Threats',
    author: 'Mohammad Saif Rakhangi',
    date: 'March 10, 2024',
    readTime: '5 min read',
    image: '/blog1.jpg',
    tags: ['Phishing', 'Security', 'Awareness'],
    content: [
      {
        type: 'intro',
        text: 'Phishing attacks have evolved dramatically in 2024. Attackers now use AI-generated messages, deepfake voices, and hyper-personalized lures to trick even the most security-aware individuals. Understanding how these attacks work is your first line of defense.'
      },
      {
        type: 'heading',
        text: 'What Is a Phishing Attack?'
      },
      {
        type: 'paragraph',
        text: 'Phishing is a type of social engineering attack where criminals impersonate trusted entities — banks, employers, government agencies, or even your friends — to steal sensitive information like passwords, credit card numbers, or personal data. The name comes from "fishing," because attackers cast a wide net hoping someone will take the bait.'
      },
      {
        type: 'heading',
        text: 'Types of Phishing in 2024'
      },
      {
        type: 'cards',
        items: [
          { icon: '📧', title: 'Email Phishing', desc: 'Mass emails mimicking banks, Netflix, Amazon, or government agencies with urgent calls to action.' },
          { icon: '📱', title: 'Smishing (SMS)', desc: 'Fake text messages claiming your package is delayed or your account is locked.' },
          { icon: '🎙️', title: 'Vishing (Voice)', desc: 'Phone calls using AI voice cloning to impersonate family members or bank officials.' },
          { icon: '🎣', title: 'Spear Phishing', desc: 'Highly targeted attacks using your personal info from social media to seem legitimate.' },
        ]
      },
      {
        type: 'heading',
        text: 'Red Flags to Watch For'
      },
      {
        type: 'checklist',
        items: [
          'Urgent language: "Act now or your account will be closed"',
          'Mismatched email domains (support@amaz0n.com instead of amazon.com)',
          'Generic greetings like "Dear Customer" instead of your name',
          'Requests for passwords, OTPs, or payment info via email or SMS',
          'Suspicious links that show different URL on hover',
          'Unexpected attachments, especially .exe, .zip, or .docx files',
        ]
      },
      {
        type: 'heading',
        text: 'How to Protect Yourself'
      },
      {
        type: 'paragraph',
        text: 'The best protection is a combination of awareness and technology. Always verify the sender\'s email address carefully. Never click links in unsolicited emails — instead, go directly to the website by typing the URL. Enable two-factor authentication on all accounts. Use a password manager so you never reuse passwords. And when in doubt, call the organization directly using a number from their official website.'
      },
      {
        type: 'highlight',
        text: '💡 Pro Tip: Legitimate organizations will NEVER ask for your password, OTP, or full card number via email or SMS. If they do, it\'s a scam.'
      },
      {
        type: 'heading',
        text: 'What to Do If You\'ve Been Phished'
      },
      {
        type: 'paragraph',
        text: 'If you accidentally clicked a phishing link or shared credentials, act immediately: change your passwords starting with email and banking accounts, enable 2FA everywhere, contact your bank if financial info was shared, report the phishing attempt to your email provider, and monitor your accounts for suspicious activity over the next few weeks.'
      },
    ]
  },
  2: {
    title: 'Password Security Best Practices',
    category: 'Best Practices',
    author: 'Shahim Shaikh',
    date: 'March 8, 2024',
    readTime: '4 min read',
    image: '/blog2.jpg',
    tags: ['Passwords', 'Security', 'Best Practices'],
    content: [
      {
        type: 'intro',
        text: 'Your password is the lock on your digital life. Yet most people use "password123" or their pet\'s name across a dozen sites. In 2024, with data breaches exposing billions of credentials, strong password hygiene isn\'t optional — it\'s essential.'
      },
      {
        type: 'heading',
        text: 'Why Weak Passwords Are Dangerous'
      },
      {
        type: 'paragraph',
        text: 'Hackers use automated tools that can try billions of password combinations per second. A simple 6-character password can be cracked in under a second. Password reuse means one breached site exposes all your accounts. And common passwords like "123456" or "qwerty" are the first ones attackers try.'
      },
      {
        type: 'heading',
        text: 'The Anatomy of a Strong Password'
      },
      {
        type: 'cards',
        items: [
          { icon: '📏', title: 'Length Matters', desc: 'Minimum 12 characters. Every extra character multiplies crack time exponentially.' },
          { icon: '🔀', title: 'Mix Characters', desc: 'Use uppercase, lowercase, numbers, and symbols. Avoid predictable substitutions like @ for a.' },
          { icon: '🎲', title: 'Be Random', desc: 'Avoid dictionary words, names, or dates. Random passphrases like "Purple$Tree!Moon7" work great.' },
          { icon: '🔒', title: 'Be Unique', desc: 'Every account needs its own password. One breach shouldn\'t unlock everything.' },
        ]
      },
      {
        type: 'highlight',
        text: '🔐 A 16-character random password would take over 1 trillion years to crack with current technology. Length is your best friend.'
      },
      {
        type: 'heading',
        text: 'Password Managers: Your Best Tool'
      },
      {
        type: 'paragraph',
        text: 'You can\'t memorize 100 unique strong passwords — and you shouldn\'t have to. Password managers like Bitwarden, 1Password, or Dashlane generate and store complex passwords securely. You only need to remember one master password. They also warn you about reused or compromised passwords and auto-fill on trusted sites.'
      },
      {
        type: 'checklist',
        items: [
          'Use a reputable password manager (Bitwarden is free and open-source)',
          'Set a strong master password you can actually remember',
          'Enable biometric unlock on your phone for convenience',
          'Enable breach monitoring to get alerts if your credentials are exposed',
          'Never store passwords in plain text files or browser notes',
          'Change passwords immediately after any suspected breach',
        ]
      },
      {
        type: 'heading',
        text: 'Passphrases: The Human-Friendly Alternative'
      },
      {
        type: 'paragraph',
        text: 'A passphrase is a sequence of random words like "correct-horse-battery-staple" — it\'s long, memorable, and extremely hard to crack. For accounts where you need to type the password manually (like your computer login), a passphrase is ideal. Add some numbers and symbols between words for extra security.'
      },
    ]
  },
  3: {
    title: 'Ransomware Prevention Guide',
    category: 'Threats',
    author: 'Mohammad Maniyar',
    date: 'March 5, 2024',
    readTime: '7 min read',
    image: '/blog3.jpg',
    tags: ['Ransomware', 'Prevention', 'Security'],
    content: [
      {
        type: 'intro',
        text: 'Ransomware is one of the most devastating cyber threats today. It encrypts your files and demands payment — often in cryptocurrency — to restore access. In 2023, ransomware attacks cost organizations over $1 billion in ransom payments alone. This guide shows you how to never become a victim.'
      },
      {
        type: 'heading',
        text: 'How Ransomware Works'
      },
      {
        type: 'paragraph',
        text: 'Ransomware typically enters your system through phishing emails with malicious attachments, infected downloads, vulnerable software, or compromised Remote Desktop Protocol (RDP) connections. Once inside, it silently encrypts your files — documents, photos, databases — and then displays a ransom note demanding payment, usually within 72 hours, or the decryption key gets destroyed.'
      },
      {
        type: 'cards',
        items: [
          { icon: '📎', title: 'Phishing Emails', desc: 'Malicious attachments disguised as invoices, resumes, or shipping notifications.' },
          { icon: '🌐', title: 'Drive-by Downloads', desc: 'Visiting compromised websites that silently install malware.' },
          { icon: '🔌', title: 'Vulnerable Software', desc: 'Unpatched operating systems and software with known security flaws.' },
          { icon: '🖥️', title: 'RDP Attacks', desc: 'Brute-forcing Remote Desktop connections with weak passwords.' },
        ]
      },
      {
        type: 'heading',
        text: 'The 3-2-1 Backup Rule: Your Best Defense'
      },
      {
        type: 'highlight',
        text: '💾 Keep 3 copies of your data, on 2 different media types, with 1 copy stored offline or offsite. Backups are the only guaranteed recovery from ransomware.'
      },
      {
        type: 'paragraph',
        text: 'If your backups are connected to your network, ransomware can encrypt those too. Your offline or cloud backup is your lifeline. Test your backups regularly — a backup you\'ve never tested is a backup you can\'t trust.'
      },
      {
        type: 'heading',
        text: 'Prevention Checklist'
      },
      {
        type: 'checklist',
        items: [
          'Keep Windows, macOS, and all software updated — patches close the doors ransomware uses',
          'Never open email attachments from unknown senders',
          'Disable macros in Microsoft Office by default',
          'Use reputable antivirus software with real-time protection',
          'Implement the principle of least privilege — users should only access what they need',
          'Disable RDP if not needed; use VPN if required',
          'Maintain regular offline or cloud backups and test them',
          'Train employees to recognize phishing — most attacks start with human error',
        ]
      },
      {
        type: 'heading',
        text: 'Should You Pay the Ransom?'
      },
      {
        type: 'paragraph',
        text: 'Law enforcement agencies including the FBI advise against paying ransoms. Payment funds criminal operations, marks you as a willing target for future attacks, and provides no guarantee of file recovery. Studies show that 20% of organizations that paid ransom still didn\'t get all their files back. The only reliable recovery path is clean backups.'
      },
    ]
  },
  4: {
    title: 'Two-Factor Authentication Explained',
    category: 'Best Practices',
    author: 'Rehan Shaikh',
    date: 'March 3, 2024',
    readTime: '6 min read',
    image: '/blog4.jpg',
    tags: ['2FA', 'Authentication', 'Security'],
    content: [
      {
        type: 'intro',
        text: 'Even if a hacker knows your password, two-factor authentication (2FA) stops them cold. It\'s the single most effective security upgrade you can make — Google found that 2FA blocks 100% of automated bot attacks and 96% of bulk phishing attacks. Here\'s everything you need to know.'
      },
      {
        type: 'heading',
        text: 'What Is Two-Factor Authentication?'
      },
      {
        type: 'paragraph',
        text: '2FA adds a second verification step beyond your password. Even if someone steals your password, they still need the second factor — something they almost certainly don\'t have. It\'s based on the principle of "something you know" (password) + "something you have" (your phone) or "something you are" (your fingerprint).'
      },
      {
        type: 'heading',
        text: 'Types of 2FA: From Weakest to Strongest'
      },
      {
        type: 'cards',
        items: [
          { icon: '📱', title: 'SMS Codes (Weakest)', desc: 'OTPs sent via SMS. Vulnerable to SIM swapping and interception. Better than nothing, but use alternatives when possible.' },
          { icon: '🔑', title: 'Authenticator Apps', desc: 'Apps like Google Authenticator or Authy generate time-based codes. Much safer than SMS.' },
          { icon: '🛡️', title: 'Push Notifications', desc: 'Apps like Duo send an approval request to your phone. Convenient and secure.' },
          { icon: '🔐', title: 'Hardware Keys (Strongest)', desc: 'Physical keys like YubiKey plug into USB. Nearly impossible to phish remotely.' },
        ]
      },
      {
        type: 'heading',
        text: 'Setting Up 2FA: Step by Step'
      },
      {
        type: 'checklist',
        items: [
          'Download an authenticator app: Google Authenticator, Authy, or Microsoft Authenticator',
          'Go to your account\'s security settings (look for "Two-Factor Authentication" or "Login Verification")',
          'Choose "Authenticator App" as your 2FA method',
          'Scan the QR code with your authenticator app',
          'Save your backup codes in a secure place (not your phone notes!)',
          'Test the setup by logging out and logging back in',
          'Repeat for every important account: email, banking, social media',
        ]
      },
      {
        type: 'highlight',
        text: '⚠️ Never share your 2FA codes with anyone — not even someone claiming to be from your bank or tech support. Legitimate organizations never ask for these codes.'
      },
      {
        type: 'heading',
        text: 'What About Backup Codes?'
      },
      {
        type: 'paragraph',
        text: 'When you set up 2FA, most services give you one-time backup codes for when you lose access to your phone. Print these out and store them securely — in a safe or locked drawer. Never store them digitally on the same device. If you do lose your phone without backup codes, account recovery can take days and requires identity verification.'
      },
    ]
  },
  5: {
    title: 'Social Engineering: The Human Threat',
    category: 'Threats',
    author: 'Mohammad Saif Rakhangi',
    date: 'February 28, 2024',
    readTime: '8 min read',
    image: '/blog5.jpg',
    tags: ['Social Engineering', 'Psychology', 'Awareness'],
    content: [
      {
        type: 'intro',
        text: 'No firewall can protect against the most powerful attack vector in cybersecurity: human psychology. Social engineering exploits trust, fear, urgency, and authority to manipulate people into revealing information or taking actions that compromise security. It\'s behind 98% of all cyberattacks.'
      },
      {
        type: 'heading',
        text: 'The Psychology Behind Social Engineering'
      },
      {
        type: 'paragraph',
        text: 'Attackers study psychological principles to craft compelling manipulations. They exploit our tendency to trust authority figures, our desire to be helpful, our fear of negative consequences, and the pressure to act quickly. Understanding these triggers is essential to resisting them.'
      },
      {
        type: 'cards',
        items: [
          { icon: '👔', title: 'Authority', desc: 'Impersonating IT support, executives, or government officials to demand compliance.' },
          { icon: '⏰', title: 'Urgency', desc: '"Your account will be deleted in 24 hours" — artificial time pressure clouds judgment.' },
          { icon: '🤝', title: 'Reciprocity', desc: 'Offering something (free gift, help) to create a sense of obligation to comply.' },
          { icon: '😨', title: 'Fear & Intimidation', desc: 'Threatening legal action, account suspension, or embarrassing data exposure.' },
        ]
      },
      {
        type: 'heading',
        text: 'Common Social Engineering Attacks'
      },
      {
        type: 'paragraph',
        text: 'Pretexting involves creating a fabricated scenario — "I\'m from IT, we\'re updating systems and need your credentials." Baiting leaves infected USB drives in parking lots, relying on curiosity. Tailgating involves following someone through a secure door by appearing to belong. Quid pro quo offers fake IT help in exchange for temporary access credentials.'
      },
      {
        type: 'highlight',
        text: '🎭 The most dangerous social engineer isn\'t a hacker — it\'s a skilled actor. In 2020, attackers called Twitter employees and convinced them to hand over admin credentials, leading to the biggest celebrity account hack in history.'
      },
      {
        type: 'heading',
        text: 'How to Build Resistance'
      },
      {
        type: 'checklist',
        items: [
          'Slow down — urgency is a manipulation tactic. Real emergencies allow for verification.',
          'Verify identity independently: hang up and call the official number yourself',
          'Follow the "need to know" principle — only share information that\'s necessary',
          'Trust your instincts — if something feels wrong, it probably is',
          'Never let anyone pressure you into bypassing security protocols',
          'Report suspicious contact to your security team immediately',
          'Practice with simulated phishing tests to build real-world awareness',
        ]
      },
      {
        type: 'heading',
        text: 'Creating a Security-First Culture'
      },
      {
        type: 'paragraph',
        text: 'The most effective defense is a culture where people feel safe to question and verify requests without fear of seeming rude or unhelpful. Organizations should celebrate employees who catch and report social engineering attempts, not penalize them for being cautious. Regular training with realistic scenarios is far more effective than annual compliance videos.'
      },
    ]
  },
  6: {
    title: 'Secure Your Home Network',
    category: 'Tutorials',
    author: 'Shahim Shaikh',
    date: 'February 25, 2024',
    readTime: '10 min read',
    image: '/blog6.jpg',
    tags: ['Network', 'WiFi', 'Home Security'],
    content: [
      {
        type: 'intro',
        text: 'Your home router is the gateway to every device in your house — laptops, phones, smart TVs, security cameras, and even your fridge. Yet most people set it up once and never touch it again. A poorly secured home network is an open invitation. This guide walks you through every step to lock it down.'
      },
      {
        type: 'heading',
        text: 'Step 1: Change Default Router Credentials'
      },
      {
        type: 'paragraph',
        text: 'Every router comes with a default username and password — usually "admin/admin" or "admin/password." These are publicly listed online. The very first thing you should do is log into your router\'s admin panel (usually at 192.168.1.1 or 192.168.0.1) and change both the username and password to something strong and unique.'
      },
      {
        type: 'heading',
        text: 'Step 2: Update Router Firmware'
      },
      {
        type: 'paragraph',
        text: 'Router manufacturers regularly release firmware updates to patch security vulnerabilities. Log into your router admin panel, find the firmware update section, and check for updates. Many modern routers support automatic updates — enable this feature. Running outdated firmware is like leaving a known security hole open indefinitely.'
      },
      {
        type: 'heading',
        text: 'Step 3: Optimize Your WiFi Security'
      },
      {
        type: 'cards',
        items: [
          { icon: '🔒', title: 'Use WPA3 Encryption', desc: 'Or WPA2 at minimum. Never use WEP or open networks. WPA3 is significantly stronger.' },
          { icon: '📡', title: 'Strong WiFi Password', desc: 'At least 16 characters, random, nothing related to your name or address.' },
          { icon: '📶', title: 'Hide Your SSID', desc: 'Disabling network broadcast doesn\'t stop determined attackers but reduces casual visibility.' },
          { icon: '🏠', title: 'Guest Network', desc: 'Create a separate guest network for visitors and IoT devices to isolate them from your main network.' },
        ]
      },
      {
        type: 'heading',
        text: 'Security Hardening Checklist'
      },
      {
        type: 'checklist',
        items: [
          'Change default router admin username and password',
          'Update router firmware to the latest version',
          'Set WiFi encryption to WPA3 (or WPA2 minimum)',
          'Use a strong, unique WiFi password (16+ characters)',
          'Disable WPS (WiFi Protected Setup) — it has known vulnerabilities',
          'Disable remote management unless absolutely necessary',
          'Create a separate guest network for IoT devices and visitors',
          'Enable router firewall if it\'s not already on',
          'Regularly check connected devices list for unknown devices',
          'Consider using a VPN on your router for all traffic encryption',
        ]
      },
      {
        type: 'highlight',
        text: '📡 IoT devices (smart bulbs, cameras, thermostats) are notoriously insecure. Always put them on a guest/IoT network, isolated from your computers and phones.'
      },
      {
        type: 'heading',
        text: 'Monitoring Your Network'
      },
      {
        type: 'paragraph',
        text: 'Once secured, maintain vigilance. Check your router\'s connected devices list monthly. Unfamiliar devices could indicate unauthorized access. Apps like Fing can scan your network and identify every connected device. If you find something suspicious, change your WiFi password immediately and investigate which devices were compromised.'
      },
    ]
  }
};

const BlogPost = ({ postId }) => {
  const navigate = useNavigate();
  const id = parseInt(postId);
  const post = blogData[id];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!post) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e3f2fd' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#0d47a1', fontSize: '2rem' }}>Article not found</h2>
          <button onClick={() => navigate('/blog')} style={styles.backBtn}>← Back to Blog</button>
        </div>
      </div>
    );
  }

  const renderContent = (block, index) => {
    switch (block.type) {
      case 'intro':
        return (
          <p key={index} style={styles.intro}>{block.text}</p>
        );
      case 'heading':
        return (
          <h2 key={index} style={styles.sectionHeading}>{block.text}</h2>
        );
      case 'paragraph':
        return (
          <p key={index} style={styles.paragraph}>{block.text}</p>
        );
      case 'highlight':
        return (
          <div key={index} style={styles.highlight}>{block.text}</div>
        );
      case 'cards':
        return (
          <div key={index} style={styles.cardsGrid}>
            {block.items.map((item, i) => (
              <div key={i} style={styles.infoCard}>
                <div style={styles.cardIcon}>{item.icon}</div>
                <h4 style={styles.cardTitle}>{item.title}</h4>
                <p style={styles.cardDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        );
      case 'checklist':
        return (
          <ul key={index} style={styles.checklist}>
            {block.items.map((item, i) => (
              <li key={i} style={styles.checkItem}>
                <span style={styles.checkMark}>✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,400&display=swap');
        
        .back-btn-hover:hover {
          background: #1565c0 !important;
          transform: translateX(-3px) !important;
        }
        .tag-pill:hover {
          background: #1976d2 !important;
          color: white !important;
        }
        .info-card-hover:hover {
          transform: translateY(-6px) !important;
          box-shadow: 0 16px 40px rgba(13,71,161,0.18) !important;
        }
        .related-hover:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 12px 30px rgba(13,71,161,0.15) !important;
        }
        @media (max-width: 768px) {
          .hero-img { height: 280px !important; }
          .post-title { font-size: 2rem !important; }
          .cards-grid { grid-template-columns: 1fr 1fr !important; }
          .article-body { padding: 30px 20px !important; }
        }
        @media (max-width: 500px) {
          .cards-grid { grid-template-columns: 1fr !important; }
          .post-title { font-size: 1.6rem !important; }
        }
      `}</style>

      <div style={styles.page}>
        {/* Back Button */}
        <div style={styles.topBar}>
          <button
            onClick={() => navigate('/blog')}
            style={styles.backBtn}
            className="back-btn-hover"
          >
            ← Back to Blog
          </button>
        </div>

        {/* Hero Image */}
        <div style={styles.heroImageWrap} className="hero-img">
          <img
            src={post.image}
            alt={post.title}
            style={styles.heroImage}
            onError={e => { e.target.style.display = 'none'; e.target.parentNode.style.background = 'linear-gradient(135deg, #1565c0 0%, #42a5f5 100%)'; }}
          />
          <div style={styles.heroOverlay} />
          <div style={styles.heroCategoryBadge}>{post.category}</div>
        </div>

        {/* Article Container */}
        <div style={styles.articleOuter}>
          <article style={styles.articleCard}>
            {/* Header */}
            <div style={styles.articleHeader}>
              <h1 style={styles.postTitle} className="post-title">{post.title}</h1>

              <div style={styles.metaRow}>
                <div style={styles.authorChip}>
                  <div style={styles.avatar}>{post.author.charAt(0)}</div>
                  <div>
                    <div style={styles.authorName}>{post.author}</div>
                    <div style={styles.metaSmall}>{post.date} · {post.readTime}</div>
                  </div>
                </div>
                <div style={styles.tagRow}>
                  {post.tags.map((tag, i) => (
                    <span key={i} style={styles.tagPill} className="tag-pill">#{tag}</span>
                  ))}
                </div>
              </div>

              <div style={styles.divider} />
            </div>

            {/* Body */}
            <div style={styles.articleBody} className="article-body">
              {post.content.map((block, i) => renderContent(block, i))}
            </div>

            {/* Footer */}
            <div style={styles.articleFooter}>
              <div style={styles.footerAuthor}>
                <div style={styles.avatarLg}>{post.author.charAt(0)}</div>
                <div>
                  <div style={styles.footerAuthorLabel}>Written by</div>
                  <div style={styles.footerAuthorName}>{post.author}</div>
                  <div style={styles.footerAuthorRole}>CyberShield Security Researcher</div>
                </div>
              </div>
              <button onClick={() => navigate('/blog')} style={styles.backBtnFooter} className="back-btn-hover">
                ← All Articles
              </button>
            </div>
          </article>

          {/* Related Posts */}
          <div style={styles.relatedSection}>
            <h3 style={styles.relatedTitle}>More Articles</h3>
            <div style={styles.relatedGrid}>
              {Object.entries(blogData)
                .filter(([key]) => parseInt(key) !== id)
                .slice(0, 3)
                .map(([key, related]) => (
                  <div
                    key={key}
                    style={styles.relatedCard}
                    className="related-hover"
                    onClick={() => navigate(`/blog/${key}`)}
                  >
                    <div style={styles.relatedImgWrap}>
                      <img
                        src={related.image}
                        alt={related.title}
                        style={styles.relatedImg}
                        onError={e => { e.target.style.display = 'none'; e.target.parentNode.style.background = 'linear-gradient(135deg,#1565c0,#42a5f5)'; }}
                      />
                    </div>
                    <div style={styles.relatedContent}>
                      <span style={styles.relatedCategory}>{related.category}</span>
                      <h4 style={styles.relatedCardTitle}>{related.title}</h4>
                      <span style={styles.relatedReadTime}>{related.readTime}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #e3f2fd 0%, #bbdefb 60%, #e8f5e9 100%)',
    fontFamily: "'Source Serif 4', Georgia, serif",
  },
  topBar: {
    padding: '20px 40px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'rgba(227,242,253,0.85)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(66,165,245,0.2)',
  },
  backBtn: {
    background: '#1976d2',
    color: 'white',
    border: 'none',
    padding: '10px 22px',
    borderRadius: '25px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    fontFamily: "'Source Serif 4', serif",
  },
  heroImageWrap: {
    position: 'relative',
    width: '100%',
    height: '420px',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #1565c0 0%, #42a5f5 100%)',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  heroOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom, rgba(13,71,161,0.2) 0%, rgba(13,71,161,0.5) 100%)',
  },
  heroCategoryBadge: {
    position: 'absolute',
    bottom: '30px',
    left: '40px',
    background: 'rgba(255,255,255,0.95)',
    color: '#1565c0',
    padding: '8px 20px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '700',
    letterSpacing: '0.05em',
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
  },
  articleOuter: {
    maxWidth: '860px',
    margin: '0 auto',
    padding: '0 20px 80px',
  },
  articleCard: {
    background: 'white',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(13,71,161,0.12)',
    marginTop: '-40px',
    position: 'relative',
    zIndex: 10,
  },
  articleHeader: {
    padding: '48px 52px 32px',
    borderBottom: '2px solid #e3f2fd',
  },
  postTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '2.6rem',
    fontWeight: '800',
    color: '#0d47a1',
    lineHeight: '1.25',
    marginBottom: '28px',
    letterSpacing: '-0.01em',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '28px',
  },
  authorChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  avatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #42a5f5, #1565c0)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
    fontSize: '1.2rem',
    fontFamily: "'Playfair Display', serif",
  },
  authorName: {
    color: '#0d47a1',
    fontWeight: '700',
    fontSize: '1rem',
  },
  metaSmall: {
    color: '#64b5f6',
    fontSize: '0.85rem',
    marginTop: '2px',
  },
  tagRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  tagPill: {
    background: '#e3f2fd',
    color: '#1976d2',
    padding: '5px 14px',
    borderRadius: '14px',
    fontSize: '0.82rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: "'Source Serif 4', serif",
  },
  divider: {
    height: '3px',
    background: 'linear-gradient(90deg, #42a5f5, #e3f2fd)',
    borderRadius: '3px',
  },
  articleBody: {
    padding: '44px 52px',
  },
  intro: {
    fontSize: '1.2rem',
    color: '#1a237e',
    lineHeight: '1.85',
    fontStyle: 'italic',
    fontWeight: '400',
    marginBottom: '36px',
    paddingLeft: '20px',
    borderLeft: '4px solid #42a5f5',
    background: '#f0f8ff',
    padding: '20px 24px',
    borderRadius: '0 12px 12px 0',
  },
  sectionHeading: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.65rem',
    fontWeight: '700',
    color: '#0d47a1',
    marginTop: '44px',
    marginBottom: '18px',
    letterSpacing: '-0.01em',
  },
  paragraph: {
    fontSize: '1.05rem',
    color: '#2c3e50',
    lineHeight: '1.9',
    marginBottom: '22px',
  },
  highlight: {
    background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
    border: '2px solid #42a5f5',
    borderRadius: '14px',
    padding: '20px 24px',
    fontSize: '1.05rem',
    color: '#0d47a1',
    fontWeight: '600',
    lineHeight: '1.6',
    margin: '28px 0',
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '18px',
    margin: '24px 0 32px',
  },
  infoCard: {
    background: '#f0f8ff',
    border: '2px solid #bbdefb',
    borderRadius: '16px',
    padding: '22px 20px',
    transition: 'all 0.3s ease',
    cursor: 'default',
  },
  cardIcon: {
    fontSize: '2rem',
    marginBottom: '10px',
  },
  cardTitle: {
    fontFamily: "'Playfair Display', serif",
    color: '#0d47a1',
    fontSize: '1.05rem',
    fontWeight: '700',
    marginBottom: '8px',
  },
  cardDesc: {
    color: '#455a64',
    fontSize: '0.92rem',
    lineHeight: '1.6',
  },
  checklist: {
    listStyle: 'none',
    padding: 0,
    margin: '20px 0 32px',
  },
  checkItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    padding: '12px 0',
    borderBottom: '1px solid #e3f2fd',
    fontSize: '1rem',
    color: '#2c3e50',
    lineHeight: '1.55',
  },
  checkMark: {
    flexShrink: 0,
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #42a5f5, #1565c0)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
    fontWeight: '700',
    marginTop: '1px',
  },
  articleFooter: {
    padding: '32px 52px',
    background: '#f0f8ff',
    borderTop: '2px solid #e3f2fd',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '20px',
  },
  footerAuthor: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  avatarLg: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #42a5f5, #1565c0)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
    fontSize: '1.4rem',
    fontFamily: "'Playfair Display', serif",
  },
  footerAuthorLabel: {
    fontSize: '0.8rem',
    color: '#64b5f6',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontWeight: '600',
  },
  footerAuthorName: {
    color: '#0d47a1',
    fontWeight: '700',
    fontSize: '1rem',
    fontFamily: "'Playfair Display', serif",
  },
  footerAuthorRole: {
    color: '#1976d2',
    fontSize: '0.88rem',
    marginTop: '2px',
  },
  backBtnFooter: {
    background: 'white',
    color: '#1976d2',
    border: '2px solid #42a5f5',
    padding: '11px 24px',
    borderRadius: '25px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    fontFamily: "'Source Serif 4', serif",
  },
  relatedSection: {
    marginTop: '56px',
  },
  relatedTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.8rem',
    color: '#0d47a1',
    fontWeight: '700',
    marginBottom: '24px',
  },
  relatedGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
  },
  relatedCard: {
    background: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 6px 20px rgba(13,71,161,0.09)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  relatedImgWrap: {
    height: '130px',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #1565c0, #42a5f5)',
  },
  relatedImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  relatedContent: {
    padding: '16px',
  },
  relatedCategory: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#1976d2',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  relatedCardTitle: {
    color: '#0d47a1',
    fontSize: '0.95rem',
    fontWeight: '700',
    marginTop: '6px',
    marginBottom: '8px',
    lineHeight: '1.4',
    fontFamily: "'Playfair Display', serif",
  },
  relatedReadTime: {
    color: '#64b5f6',
    fontSize: '0.82rem',
  },
};

export default BlogPost;
export { blogData };