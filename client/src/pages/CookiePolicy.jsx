import { PageLayout } from '../components/PageLayout';
import { useState, useEffect } from 'react';

const toc = [
  { id: 'what',       label: '1. What Are Cookies' },
  { id: 'why',        label: '2. Why We Use Cookies' },
  { id: 'types',      label: '3. Types of Cookies We Use' },
  { id: 'third',      label: '4. Third-Party Cookies' },
  { id: 'manage',     label: '5. Managing Cookies' },
  { id: 'impact',     label: '6. Impact of Disabling Cookies' },
  { id: 'storage',    label: '7. Local Storage & Session' },
  { id: 'updates',    label: '8. Policy Updates' },
  { id: 'contact',    label: '9. Contact' },
];

const cookieBannerCss = `
  .ck-banner { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); width: calc(100% - 48px); max-width: 680px; background: #0A0A1A; border: 1px solid rgba(255,255,255,.1); border-radius: 16px; padding: 20px 24px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; z-index: 9999; box-shadow: 0 8px 40px rgba(0,0,0,.3); animation: slideUpBanner .4s ease both; }
  @keyframes slideUpBanner { from{opacity:0;transform:translateX(-50%) translateY(20px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
  .ck-banner-text { flex: 1; min-width: 200px; font-size: 13.5px; color: rgba(255,255,255,.8); line-height: 1.55; }
  .ck-banner-text a { color: #60A5FA; text-decoration: none; }
  .ck-banner-btns { display: flex; gap: 10px; flex-shrink: 0; }
  .ck-accept { background: #0057FF; color: #fff; border: none; padding: 9px 20px; border-radius: 100px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .2s; }
  .ck-accept:hover { background: #0045CC; transform: scale(1.03); }
  .ck-decline { background: transparent; color: rgba(255,255,255,.6); border: 1px solid rgba(255,255,255,.2); padding: 9px 20px; border-radius: 100px; font-size: 13px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .2s; }
  .ck-decline:hover { border-color: rgba(255,255,255,.5); color: #fff; }
`;

function Section({ id, num, title, accent, children }) {
  return (
    <section id={id} className="pg-section">
      <div className="pg-section-num">{num}</div>
      <h2 className="pg-section-title">{title}{accent && <span> {accent}</span>}</h2>
      {children}
    </section>
  );
}

function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const s = document.createElement('style');
    s.id = 'ck-banner-styles';
    s.textContent = cookieBannerCss;
    document.head.appendChild(s);
    const accepted = localStorage.getItem('cs_cookies_accepted');
    if (!accepted) setTimeout(() => setVisible(true), 1200);
    return () => { const el = document.getElementById('ck-banner-styles'); if (el) el.remove(); };
  }, []);

  if (!visible) return null;

  return (
    <div className="ck-banner">
      <div className="ck-banner-text">
        🍪 CyberShield uses cookies to keep you logged in, remember your progress, and improve your learning experience. <a href="/cookie-policy">Learn more</a>
      </div>
      <div className="ck-banner-btns">
        <button className="ck-decline" onClick={() => { localStorage.setItem('cs_cookies_accepted', 'essential'); setVisible(false); }}>Essential Only</button>
        <button className="ck-accept" onClick={() => { localStorage.setItem('cs_cookies_accepted', 'all'); setVisible(false); }}>Accept All</button>
      </div>
    </div>
  );
}

export default function CookiePolicy() {
  return (
    <>
      <CookieBanner />
      <PageLayout
        badge="Cookie Policy"
        title="Cookie Policy"
        subtitle="CyberShield uses cookies and similar technologies to deliver a secure, personalised, and seamless learning experience. Here's exactly what we use and why."
        updated="March 15, 2025"
        readTime="5 min"
        tocItems={toc}
        activePath="/cookie-policy"
      >
        <Section id="what" num="Section 01" title="What Are" accent="Cookies?">
          <p className="pg-p">
            Cookies are small text files that are placed on your device (computer, tablet, or phone) when you visit a website. They help websites remember information about your visit, making your next visit easier and the site more useful to you.
          </p>
          <p className="pg-p">
            Cookies are widely used across the internet to make websites work efficiently. CyberShield uses cookies in a privacy-conscious way — only what is necessary to provide you with the best possible learning experience.
          </p>
          <div className="pg-highlight">
            <div className="pg-highlight-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0057FF" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              CyberShield Never Sells Cookie Data
            </div>
            <p className="pg-highlight-text">Data collected via cookies is used solely to improve your experience on CyberShield. We never sell or share this data with advertisers or data brokers.</p>
          </div>
        </Section>

        <Section id="why" num="Section 02" title="Why We Use" accent="Cookies">
          <p className="pg-p">We use cookies to:</p>
          <ul className="pg-ul">
            <li>Keep you logged in securely during your session and across visits</li>
            <li>Remember your quiz progress if you close the browser mid-quiz</li>
            <li>Save your learning preferences (dark mode, language, notification settings)</li>
            <li>Track your game progress in the Cyber Defense Game</li>
            <li>Understand which learning modules are most popular to improve our content</li>
            <li>Detect unusual login attempts to protect your account</li>
          </ul>
        </Section>

        <Section id="types" num="Section 03" title="Types of Cookies" accent="We Use">
          <table className="pg-table">
            <thead>
              <tr>
                <th>Cookie Type</th>
                <th>Purpose</th>
                <th>Duration</th>
                <th>Can Disable?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="pg-tag pg-tag-blue">Essential</span></td>
                <td>Authentication, session management, CSRF protection</td>
                <td>Session / 30 days</td>
                <td><span className="pg-tag pg-tag-red">No — Required</span></td>
              </tr>
              <tr>
                <td><span className="pg-tag pg-tag-green">Functional</span></td>
                <td>Remember preferences, language, theme settings</td>
                <td>1 year</td>
                <td><span className="pg-tag pg-tag-orange">Optional</span></td>
              </tr>
              <tr>
                <td><span className="pg-tag pg-tag-orange">Analytics</span></td>
                <td>Understand usage patterns, popular modules, time spent</td>
                <td>6 months</td>
                <td><span className="pg-tag pg-tag-orange">Optional</span></td>
              </tr>
              <tr>
                <td><span className="pg-tag pg-tag-blue">Security</span></td>
                <td>Detect suspicious logins and fraud prevention</td>
                <td>30 days</td>
                <td><span className="pg-tag pg-tag-red">No — Required</span></td>
              </tr>
            </tbody>
          </table>

          <p className="pg-p" style={{marginTop:16}}><strong>Essential Cookies — Always Active</strong></p>
          <ul className="pg-ul">
            <li><strong>cs_session:</strong> Keeps you logged in during your session. Expires when you close the browser or after 24 hours of inactivity.</li>
            <li><strong>cs_auth_token:</strong> Secure authentication token. Valid for 30 days (extended with "Remember Me").</li>
            <li><strong>cs_csrf:</strong> Protects against cross-site request forgery attacks. Session-based.</li>
          </ul>

          <p className="pg-p"><strong>Functional Cookies — Optional</strong></p>
          <ul className="pg-ul">
            <li><strong>cs_preferences:</strong> Stores your UI preferences (theme, notification settings). Valid for 1 year.</li>
            <li><strong>cs_lang:</strong> Remembers your language selection. Valid for 1 year.</li>
          </ul>

          <p className="pg-p"><strong>Analytics Cookies — Optional</strong></p>
          <ul className="pg-ul">
            <li><strong>cs_analytics:</strong> Anonymous data about which modules you visit and how long you spend on each. Used to improve content quality. Valid for 6 months.</li>
          </ul>
        </Section>

        <Section id="third" num="Section 04" title="Third-Party" accent="Cookies">
          <p className="pg-p">
            CyberShield uses a small number of carefully selected third-party services that may set their own cookies:
          </p>
          <table className="pg-table">
            <thead>
              <tr><th>Service</th><th>Purpose</th><th>Their Policy</th></tr>
            </thead>
            <tbody>
              <tr><td>Google Fonts</td><td>Serve the DM Sans and Syne typefaces</td><td><a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" style={{color:'#0057FF'}}>Google Privacy Policy</a></td></tr>
              <tr><td>Cloudflare</td><td>DDoS protection and security scanning</td><td><a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noreferrer" style={{color:'#0057FF'}}>Cloudflare Privacy Policy</a></td></tr>
            </tbody>
          </table>
          <p className="pg-p">We do not use advertising networks, Facebook Pixel, Google Ads tracking, or any other third-party advertising cookies. CyberShield is ad-free.</p>
        </Section>

        <Section id="manage" num="Section 05" title="Managing" accent="Cookies">
          <p className="pg-p"><strong>On CyberShield:</strong> You can manage your cookie preferences anytime from <strong>Account Settings → Privacy → Cookie Preferences</strong>. You can disable optional (functional and analytics) cookies while keeping essential cookies active.</p>
          <p className="pg-p"><strong>In Your Browser:</strong> You can also control cookies directly in your browser settings:</p>
          <ul className="pg-ul">
            <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
            <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
            <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
            <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
          </ul>
        </Section>

        <Section id="impact" num="Section 06" title="Impact of Disabling" accent="Cookies">
          <p className="pg-p">
            Disabling essential cookies will significantly impact your CyberShield experience:
          </p>
          <ul className="pg-ul">
            <li>You will be logged out after every page refresh</li>
            <li>Quiz progress will not be saved if you close the browser</li>
            <li>Game progress may not persist between sessions</li>
            <li>The "Remember Me" login feature will not work</li>
          </ul>
          <p className="pg-p">
            Disabling optional cookies (functional and analytics) will not affect core functionality — you can still complete quizzes, play the Cyber Defense Game, and earn certificates.
          </p>
        </Section>

        <Section id="storage" num="Section 07" title="Local Storage &" accent="Session Storage">
          <p className="pg-p">
            In addition to cookies, CyberShield uses <strong>localStorage</strong> and <strong>sessionStorage</strong> (browser storage technologies) to store:
          </p>
          <ul className="pg-ul">
            <li>Your current quiz attempt state (prevents loss of progress on accidental refresh)</li>
            <li>Cyber Defense Game state during an active session</li>
            <li>UI preferences like sidebar open/closed state</li>
          </ul>
          <p className="pg-p">
            This data is stored only in your browser and is never transmitted to our servers except when you explicitly submit a quiz or save progress. You can clear it by clearing your browser's site data for cybershield.app.
          </p>
        </Section>

        <Section id="updates" num="Section 08" title="Policy" accent="Updates">
          <p className="pg-p">
            We may update this Cookie Policy to reflect changes in the cookies we use or for other operational, legal, or regulatory reasons. We will notify you of significant changes via email or a banner notification on the platform.
          </p>
        </Section>

        <Section id="contact" num="Section 09" title="Contact" accent="Us">
          <p className="pg-p">For cookie-related questions or to exercise your cookie preferences:</p>
          <div className="pg-contact-card">
            <div className="pg-contact-title">CyberShield Privacy Team</div>
            <div className="pg-contact-sub">For cookie consent, data preferences, or questions about how we use tracking technologies.</div>
            <div className="pg-contact-row">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.6)" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <a href="mailto:privacy@cybershield.app">privacy@cybershield.app</a>
            </div>
          </div>
        </Section>
      </PageLayout>
    </>
  );
}
