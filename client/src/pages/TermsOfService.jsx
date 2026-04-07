import { PageLayout } from '../components/PageLayout';

const toc = [
  { id: 'acceptance',   label: '1. Acceptance of Terms' },
  { id: 'eligibility',  label: '2. Eligibility' },
  { id: 'account',      label: '3. Account Registration' },
  { id: 'platform-use', label: '4. Platform Use Rules' },
  { id: 'learning',     label: '5. Learning & Quizzes' },
  { id: 'game',         label: '6. Cyber Defense Game' },
  { id: 'ip',           label: '7. Intellectual Property' },
  { id: 'ugc',          label: '8. User Content' },
  { id: 'termination',  label: '9. Account Termination' },
  { id: 'disclaimer',   label: '10. Disclaimers' },
  { id: 'liability',    label: '11. Limitation of Liability' },
  { id: 'governing',    label: '12. Governing Law' },
  { id: 'contact',      label: '13. Contact' },
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

export default function TermsOfService() {
  return (
    <PageLayout
      badge="Terms of Service"
      title="Terms of Service"
      subtitle="Please read these terms carefully before using CyberShield. By registering or using our platform, you agree to be bound by these terms."
      updated="March 15, 2025"
      readTime="10 min"
      tocItems={toc}
      activePath="/terms-of-service"
    >
      <Section id="acceptance" num="Section 01" title="Acceptance of" accent="Terms">
        <p className="pg-p">
          These Terms of Service ("Terms") constitute a legally binding agreement between you ("User", "you") and CyberShield Inc. ("CyberShield", "we", "us") governing your access to and use of the CyberShield cybersecurity education platform, including all features, modules, quizzes, games, and related services (collectively, the "Platform").
        </p>
        <p className="pg-p">
          By clicking "I Agree", creating an account, or accessing any part of the Platform, you confirm that you have read, understood, and agree to these Terms. If you are using CyberShield on behalf of an organisation, you represent that you have authority to bind that organisation to these Terms.
        </p>
        <div className="pg-highlight">
          <div className="pg-highlight-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0057FF" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            These Terms Apply to All Users
          </div>
          <p className="pg-highlight-text">These Terms apply to all visitors, registered users, learners, and any other person who accesses the CyberShield platform — including the web application, quizzes, Cyber Defense Game, and all learning modules.</p>
        </div>
      </Section>

      <Section id="eligibility" num="Section 02" title="Eligibility">
        <p className="pg-p">To use CyberShield, you must:</p>
        <ul className="pg-ul">
          <li>Be at least <strong>13 years of age</strong></li>
          <li>Have the legal capacity to enter into a binding agreement</li>
          <li>Not be barred from using the Platform under applicable law</li>
          <li>Not have had a previous CyberShield account terminated for violations</li>
        </ul>
        <p className="pg-p">
          Users aged 13–17 ("Minors") may use the Platform only with verified parental or guardian consent. If you are a Minor, a parent or guardian must review and agree to these Terms on your behalf.
        </p>
      </Section>

      <Section id="account" num="Section 03" title="Account" accent="Registration">
        <p className="pg-p">When you create a CyberShield account, you agree to:</p>
        <ul className="pg-ul">
          <li>Provide accurate, current, and complete information during registration</li>
          <li>Maintain and update your account information to keep it accurate</li>
          <li>Keep your password confidential and not share it with others</li>
          <li>Notify us immediately at <a href="mailto:support@cybershield.app" style={{color:'#0057FF'}}>support@cybershield.app</a> if you suspect unauthorised access to your account</li>
          <li>Accept responsibility for all activity that occurs under your account</li>
        </ul>
        <p className="pg-p">
          You may only create one account per person. Creating multiple accounts to gain unfair advantages in quizzes, leaderboards, or the Cyber Defense Game is prohibited and will result in account termination.
        </p>
        <div className="pg-warn">
          <div className="pg-warn-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C05621" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            Account Security is Your Responsibility
          </div>
          <p className="pg-warn-text">CyberShield will not be liable for any loss or damage resulting from unauthorised access to your account due to your failure to secure your credentials. Enable 2FA for maximum protection.</p>
        </div>
      </Section>

      <Section id="platform-use" num="Section 04" title="Platform Use" accent="Rules">
        <p className="pg-p">When using CyberShield, you agree <strong>NOT</strong> to:</p>
        <ul className="pg-ul">
          <li>Cheat, use bots, scripts, or automated tools to manipulate quiz scores or game results</li>
          <li>Attempt to hack, reverse-engineer, or exploit any part of the CyberShield platform</li>
          <li>Share quiz answers, game exploits, or cheat codes with other users</li>
          <li>Impersonate any person, CyberShield employee, or other user</li>
          <li>Upload or transmit malware, viruses, or harmful code</li>
          <li>Harass, abuse, or intimidate other users</li>
          <li>Use the Platform for any unlawful purpose</li>
          <li>Reproduce, distribute, or resell CyberShield content without written permission</li>
          <li>Scrape or extract data from the Platform using automated means</li>
        </ul>
        <p className="pg-p">
          Violations of these rules may result in immediate account suspension or permanent termination, at CyberShield's sole discretion.
        </p>
      </Section>

      <Section id="learning" num="Section 05" title="Learning &" accent="Quizzes">
        <p className="pg-p">CyberShield provides educational content, quizzes, and learning modules designed to teach cybersecurity concepts. Please note:</p>
        <ul className="pg-ul">
          <li>All educational content is for informational purposes only and should not be considered professional cybersecurity consulting advice</li>
          <li>Quiz scores, progress, and certificates are for educational recognition and are not formal certifications unless explicitly stated</li>
          <li>We make reasonable efforts to keep content accurate and up-to-date, but cybersecurity is a rapidly evolving field — some information may become outdated</li>
          <li>Module completion certificates are issued by CyberShield and represent completion of our specific curriculum, not industry-recognised certifications</li>
        </ul>
      </Section>

      <Section id="game" num="Section 06" title="Cyber Defense" accent="Game">
        <p className="pg-p">The Cyber Defense Game ("Game") is a gamified simulation environment designed to teach cybersecurity concepts through interactive scenarios. Important terms for Game use:</p>
        <ul className="pg-ul">
          <li>All attack and defense scenarios in the Game are <strong>entirely simulated</strong> in a fictional environment — skills learned should only be used ethically and legally in real life</li>
          <li>Leaderboard rankings are public (username only). You may opt out of public leaderboards in Account Settings</li>
          <li>CyberShield reserves the right to reset scores, modify game mechanics, or retire game features at any time</li>
          <li>Using real hacking tools, exploits, or techniques against CyberShield's own infrastructure is strictly prohibited and may result in legal action</li>
        </ul>
        <div className="pg-warn">
          <div className="pg-warn-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C05621" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            Educational Use Only
          </div>
          <p className="pg-warn-text">Cybersecurity skills learned on CyberShield must only be used for ethical, legal, and authorised purposes. Applying these skills to attack real systems without permission is illegal and violates these Terms.</p>
        </div>
      </Section>

      <Section id="ip" num="Section 07" title="Intellectual" accent="Property">
        <p className="pg-p">
          All content on the CyberShield Platform — including but not limited to learning modules, quiz questions, game scenarios, graphics, code, branding, and the CyberShield logo — is the intellectual property of CyberShield Inc. and is protected by applicable copyright, trademark, and intellectual property laws.
        </p>
        <p className="pg-p">You are granted a limited, non-exclusive, non-transferable licence to access and use the Platform for personal, non-commercial educational purposes only. This licence does not permit you to:</p>
        <ul className="pg-ul">
          <li>Copy, reproduce, or republish any course content</li>
          <li>Sell or sublicense access to CyberShield content</li>
          <li>Create derivative works based on CyberShield materials</li>
          <li>Use CyberShield's name, logo, or branding without written permission</li>
        </ul>
      </Section>

      <Section id="ugc" num="Section 08" title="User" accent="Content">
        <p className="pg-p">
          If you post content on CyberShield (e.g., community forum posts, feedback, or profile information), you retain ownership of your content but grant CyberShield a worldwide, royalty-free licence to use, display, and distribute it for platform purposes.
        </p>
        <p className="pg-p">You are solely responsible for any content you post. You agree not to post content that is:</p>
        <ul className="pg-ul">
          <li>Illegal, harmful, threatening, or abusive</li>
          <li>Defamatory or invades another's privacy</li>
          <li>Actual malware, exploits, or malicious code</li>
          <li>Spam or unsolicited promotional material</li>
        </ul>
      </Section>

      <Section id="termination" num="Section 09" title="Account" accent="Termination">
        <p className="pg-p"><strong>By You:</strong> You may delete your account at any time via Account Settings → Delete Account. Your data will be removed within 30 days as described in our Privacy Policy.</p>
        <p className="pg-p"><strong>By CyberShield:</strong> We reserve the right to suspend or permanently terminate your account with or without notice if you:</p>
        <ul className="pg-ul">
          <li>Violate any provision of these Terms</li>
          <li>Engage in cheating, fraud, or abuse</li>
          <li>Use the Platform to cause harm to others</li>
          <li>Attempt to compromise platform security</li>
        </ul>
        <p className="pg-p">Upon termination, your right to access the Platform ceases immediately. Earned certificates may be re-issued on request if termination was not due to misconduct.</p>
      </Section>

      <Section id="disclaimer" num="Section 10" title="Disclaimers">
        <p className="pg-p">
          CyberShield is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that the Platform will be error-free, uninterrupted, or free of harmful components.
        </p>
        <p className="pg-p">
          While we strive to provide accurate cybersecurity education, CyberShield does not guarantee that completing our modules will prevent all cybersecurity threats in real-world environments.
        </p>
      </Section>

      <Section id="liability" num="Section 11" title="Limitation of" accent="Liability">
        <p className="pg-p">
          To the maximum extent permitted by applicable law, CyberShield shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform, including but not limited to loss of data, loss of profits, or any other losses.
        </p>
        <p className="pg-p">
          Our total liability to you for any claim arising from these Terms or the Platform shall not exceed the amount you paid CyberShield in the 12 months preceding the claim.
        </p>
      </Section>

      <Section id="governing" num="Section 12" title="Governing" accent="Law">
        <p className="pg-p">
          These Terms are governed by the laws of India, without regard to its conflict of law provisions. Any disputes arising from these Terms will be subject to the exclusive jurisdiction of the courts located in Mumbai, Maharashtra, India.
        </p>
        <p className="pg-p">
          If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.
        </p>
      </Section>

      <Section id="contact" num="Section 13" title="Contact" accent="Us">
        <p className="pg-p">For questions about these Terms, please contact our legal team:</p>
        <div className="pg-contact-card">
          <div className="pg-contact-title">CyberShield Legal Team</div>
          <div className="pg-contact-sub">For Terms of Service inquiries, partnership proposals, or DMCA notices. Response within 3 business days.</div>
          <div className="pg-contact-row">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.6)" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <a href="mailto:legal@cybershield.app">legal@cybershield.app</a>
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
