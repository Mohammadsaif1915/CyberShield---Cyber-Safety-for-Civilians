import { PageLayout } from '../components/PageLayout';

const toc = [
  { id: 'overview',     label: '1. Overview' },
  { id: 'collect',      label: '2. Data We Collect' },
  { id: 'how-use',      label: '3. How We Use Your Data' },
  { id: 'game-data',    label: '4. Game & Learning Data' },
  { id: 'sharing',      label: '5. Data Sharing' },
  { id: 'security',     label: '6. Data Security' },
  { id: 'retention',    label: '7. Data Retention' },
  { id: 'rights',       label: '8. Your Rights' },
  { id: 'children',     label: '9. Children\'s Privacy' },
  { id: 'cookies',      label: '10. Cookies' },
  { id: 'changes',      label: '11. Policy Changes' },
  { id: 'contact',      label: '12. Contact Us' },
];

function Section({ id, num, title, accent, children }) {
  return (
    <section id={id} className="pg-section">
      <div className="pg-section-num">{num}</div>
      <h2 className="pg-section-title">{title}{accent && <span> {accent}</span>}</h2>
      {children}
    </section>
  );
}

export default function PrivacyPolicy() {
  return (
    <PageLayout
      badge="Privacy Policy"
      title="Your Privacy Matters to Us"
      subtitle="At CyberShield, we teach cybersecurity — and we practice it. This policy explains exactly what data we collect, why we collect it, and how we protect it."
      updated="March 15, 2025"
      readTime="8 min"
      tocItems={toc}
      activePath="/privacy-policy"
    >
      <Section id="overview" num="Section 01" title="Overview">
        <p className="pg-p">
          CyberShield Inc. ("CyberShield", "we", "us", or "our") operates the CyberShield cybersecurity education platform — including our web application, gamified learning modules, quizzes, and the Cyber Defense Game. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our services.
        </p>
        <p className="pg-p">
          By creating an account or using CyberShield, you agree to the practices described in this policy. If you do not agree, please do not use our platform.
        </p>
        <div className="pg-highlight">
          <div className="pg-highlight-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0057FF" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            We Practice What We Preach
          </div>
          <p className="pg-highlight-text">As a cybersecurity education platform, we hold ourselves to the highest standard of data protection. Your data is encrypted, never sold, and handled with industry-best security practices.</p>
        </div>
      </Section>

      <Section id="collect" num="Section 02" title="Data We" accent="Collect">
        <p className="pg-p">We collect the following categories of information:</p>
        <p className="pg-p"><strong>Account Information</strong></p>
        <ul className="pg-ul">
          <li>Full name and email address (required for registration)</li>
          <li>Password (stored as a bcrypt hash — we never store plain text passwords)</li>
          <li>Profile photo (optional)</li>
          <li>Date of account creation</li>
        </ul>
        <p className="pg-p"><strong>Learning & Game Activity</strong></p>
        <ul className="pg-ul">
          <li>Quiz scores, attempts, and completion timestamps</li>
          <li>Learning module progress and time spent per module</li>
          <li>Cyber Defense Game scores, levels completed, and badges earned</li>
          <li>Streaks, leaderboard rankings, and achievement data</li>
        </ul>
        <p className="pg-p"><strong>Technical & Device Data</strong></p>
        <ul className="pg-ul">
          <li>IP address and approximate geographic location (country/city level)</li>
          <li>Browser type, version, and device type</li>
          <li>Pages visited and features used within the platform</li>
          <li>Session duration and login/logout times</li>
        </ul>
        <p className="pg-p"><strong>Communication Data</strong></p>
        <ul className="pg-ul">
          <li>Support tickets and emails sent to our team</li>
          <li>Community forum posts and messages (if applicable)</li>
          <li>Feedback and survey responses</li>
        </ul>
      </Section>

      <Section id="how-use" num="Section 03" title="How We Use" accent="Your Data">
        <table className="pg-table">
          <thead>
            <tr>
              <th>Purpose</th>
              <th>Data Used</th>
              <th>Legal Basis</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Create and manage your account</td><td>Name, email, password</td><td>Contract</td></tr>
            <tr><td>Track your learning progress</td><td>Quiz scores, module completion</td><td>Contract</td></tr>
            <tr><td>Run the Cyber Defense Game</td><td>Game scores, badges, levels</td><td>Contract</td></tr>
            <tr><td>Send important account emails</td><td>Email address</td><td>Contract</td></tr>
            <tr><td>Improve platform features</td><td>Usage analytics</td><td>Legitimate interest</td></tr>
            <tr><td>Prevent fraud and abuse</td><td>IP address, login logs</td><td>Legitimate interest</td></tr>
            <tr><td>Send optional newsletters</td><td>Email address</td><td>Consent</td></tr>
          </tbody>
        </table>
      </Section>

      <Section id="game-data" num="Section 04" title="Game & Learning" accent="Data">
        <p className="pg-p">
          CyberShield's core mission is gamified cybersecurity education. The data generated through your learning activities is central to your experience and is treated with special care.
        </p>
        <ul className="pg-ul">
          <li><strong>Quiz Results:</strong> Stored to show your progress history and generate personalized recommendations for future learning modules.</li>
          <li><strong>Game Scores:</strong> Used for leaderboards (only your username is public — never your email or personal details).</li>
          <li><strong>Learning Streaks:</strong> Tracked to send helpful reminders and motivational notifications (which you can disable anytime).</li>
          <li><strong>Certificates & Badges:</strong> Stored permanently so you can access your earned credentials at any time.</li>
        </ul>
        <div className="pg-success">
          <div className="pg-success-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#065F46" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Your Progress Is Yours
          </div>
          <p className="pg-success-text">You can export all your learning data, game scores, and earned certificates at any time from your Account Settings → Privacy → Download My Data.</p>
        </div>
      </Section>

      <Section id="sharing" num="Section 05" title="Data" accent="Sharing">
        <p className="pg-p">We do <strong>not sell your personal data</strong> to any third party. Ever. We may share limited data only in these circumstances:</p>
        <ul className="pg-ul">
          <li><strong>Service Providers:</strong> Trusted vendors who help us operate the platform (e.g., cloud hosting, email delivery, analytics). They are contractually bound to protect your data and cannot use it for their own purposes.</li>
          <li><strong>Legal Requirements:</strong> If required by law, court order, or government authority, we may disclose data to comply with legal obligations.</li>
          <li><strong>Business Transfers:</strong> If CyberShield is acquired or merges with another company, your data may be transferred. We will notify you before this happens.</li>
          <li><strong>With Your Consent:</strong> Any other sharing only happens with your explicit written consent.</li>
        </ul>
        <div className="pg-warn">
          <div className="pg-warn-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C05621" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            We Never Sell Your Data
          </div>
          <p className="pg-warn-text">CyberShield does not and will never sell, rent, or trade your personal information to advertisers, data brokers, or any other third parties for commercial purposes.</p>
        </div>
      </Section>

      <Section id="security" num="Section 06" title="Data" accent="Security">
        <p className="pg-p">We implement multiple layers of security to protect your information:</p>
        <ul className="pg-ul">
          <li><strong>Encryption in Transit:</strong> All data transmitted between your browser and our servers is encrypted using TLS 1.3.</li>
          <li><strong>Encryption at Rest:</strong> Sensitive data stored in our databases is encrypted using AES-256.</li>
          <li><strong>Password Hashing:</strong> Passwords are hashed using bcrypt with a unique salt — we cannot see your password.</li>
          <li><strong>Two-Factor Authentication (2FA):</strong> Available and recommended for all accounts.</li>
          <li><strong>Regular Security Audits:</strong> We conduct periodic security assessments and penetration testing.</li>
          <li><strong>Access Controls:</strong> Only authorised CyberShield personnel can access user data, and only when necessary.</li>
        </ul>
        <div className="pg-highlight">
          <div className="pg-highlight-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0057FF" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Breach Notification
          </div>
          <p className="pg-highlight-text">In the unlikely event of a data breach affecting your information, we will notify you within 72 hours via email and post a notice on our platform.</p>
        </div>
      </Section>

      <Section id="retention" num="Section 07" title="Data" accent="Retention">
        <p className="pg-p">We keep your data only as long as necessary:</p>
        <table className="pg-table">
          <thead><tr><th>Data Type</th><th>Retention Period</th></tr></thead>
          <tbody>
            <tr><td>Account information</td><td>Until account deletion + 30 days</td></tr>
            <tr><td>Quiz and game scores</td><td>Duration of account</td></tr>
            <tr><td>Earned certificates & badges</td><td>Indefinitely (even after deletion, on request)</td></tr>
            <tr><td>Support communications</td><td>2 years</td></tr>
            <tr><td>Login logs & security data</td><td>90 days</td></tr>
            <tr><td>Analytics data</td><td>12 months (anonymised)</td></tr>
          </tbody>
        </table>
      </Section>

      <Section id="rights" num="Section 08" title="Your" accent="Rights">
        <p className="pg-p">Depending on your location, you may have the following rights regarding your personal data:</p>
        <ul className="pg-ul">
          <li><strong>Access:</strong> Request a copy of all personal data we hold about you.</li>
          <li><strong>Rectification:</strong> Correct inaccurate or incomplete information in your account.</li>
          <li><strong>Erasure ("Right to be Forgotten"):</strong> Request deletion of your account and all associated data.</li>
          <li><strong>Portability:</strong> Download your data in a machine-readable format (JSON/CSV).</li>
          <li><strong>Restriction:</strong> Ask us to stop processing your data in certain circumstances.</li>
          <li><strong>Objection:</strong> Object to processing based on legitimate interests.</li>
          <li><strong>Withdraw Consent:</strong> Unsubscribe from marketing emails or disable optional data collection at any time.</li>
        </ul>
        <p className="pg-p">To exercise any of these rights, go to <strong>Account Settings → Privacy</strong> or contact us at <a href="mailto:privacy@cybershield.app" style={{color:'#0057FF'}}>privacy@cybershield.app</a>. We will respond within 30 days.</p>
      </Section>

      <Section id="children" num="Section 09" title="Children's" accent="Privacy">
        <p className="pg-p">
          CyberShield is designed for users aged <strong>13 and above</strong>. We do not knowingly collect personal data from children under 13. If you are a parent or guardian and believe your child has created an account, please contact us immediately at <a href="mailto:privacy@cybershield.app" style={{color:'#0057FF'}}>privacy@cybershield.app</a> and we will delete their account within 48 hours.
        </p>
        <p className="pg-p">
          For users between 13–17, we recommend parental supervision and encourage reviewing this policy together. No behavioural advertising is shown to any CyberShield user.
        </p>
      </Section>

      <Section id="cookies" num="Section 10" title="Cookies">
        <p className="pg-p">
          We use cookies and similar technologies to keep you logged in, remember your preferences, and understand how the platform is used. Please review our full <a href="/cookie-policy" style={{color:'#0057FF'}}>Cookie Policy</a> for details on what cookies we use and how to manage them.
        </p>
      </Section>

      <Section id="changes" num="Section 11" title="Policy" accent="Changes">
        <p className="pg-p">
          We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. When we make significant changes, we will:
        </p>
        <ul className="pg-ul">
          <li>Send an email notification to your registered address</li>
          <li>Display a prominent banner on the CyberShield platform</li>
          <li>Update the "Last updated" date at the top of this page</li>
        </ul>
        <p className="pg-p">Your continued use of CyberShield after changes take effect constitutes acceptance of the revised policy.</p>
      </Section>

      <Section id="contact" num="Section 12" title="Contact" accent="Us">
        <p className="pg-p">For any privacy-related questions, data requests, or concerns, please reach out:</p>
        <div className="pg-contact-card">
          <div className="pg-contact-title">CyberShield Privacy Team</div>
          <div className="pg-contact-sub">We typically respond within 2 business days. For urgent data concerns, mark your email "URGENT: Privacy".</div>
          <div className="pg-contact-row">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.6)" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <a href="mailto:privacy@cybershield.app">privacy@cybershield.app</a>
          </div>
          <div className="pg-contact-row">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.6)" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            CyberShield Inc., Mumbai, Maharashtra, India — 400001
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
