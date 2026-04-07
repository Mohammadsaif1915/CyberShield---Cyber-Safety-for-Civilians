import { PageLayout } from '../components/PageLayout';

const toc = [
  { id: 'commitment',  label: '1. Our Commitment' },
  { id: 'standards',   label: '2. Accessibility Standards' },
  { id: 'features',    label: '3. Accessibility Features' },
  { id: 'keyboard',    label: '4. Keyboard Navigation' },
  { id: 'screen',      label: '5. Screen Reader Support' },
  { id: 'visual',      label: '6. Visual Accessibility' },
  { id: 'game',        label: '7. Game Accessibility' },
  { id: 'mobile',      label: '8. Mobile Accessibility' },
  { id: 'known',       label: '9. Known Issues' },
  { id: 'feedback',    label: '10. Feedback & Support' },
  { id: 'contact',     label: '11. Contact' },
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

export default function Accessibility() {
  return (
    <PageLayout
      badge="Accessibility"
      title="Accessibility Statement"
      subtitle="CyberShield is committed to making cybersecurity education accessible to everyone — regardless of ability, disability, or how you interact with technology."
      updated="March 15, 2025"
      readTime="6 min"
      tocItems={toc}
      activePath="/accessibility"
    >
      <Section id="commitment" num="Section 01" title="Our" accent="Commitment">
        <p className="pg-p">
          At CyberShield, we believe that cybersecurity education should be for <strong>everyone</strong>. We are committed to ensuring that our platform — including all learning modules, quizzes, the Cyber Defense Game, and user account features — is accessible to people with a wide range of abilities and disabilities.
        </p>
        <p className="pg-p">
          We continuously work to improve the accessibility of our platform and welcome feedback from all users. If you encounter any barriers, please tell us — we take every report seriously and act on them.
        </p>
        <div className="pg-success">
          <div className="pg-success-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#065F46" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            WCAG 2.1 Level AA Target
          </div>
          <p className="pg-success-text">CyberShield targets conformance with the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA — the internationally recognised standard for web accessibility.</p>
        </div>
      </Section>

      <Section id="standards" num="Section 02" title="Accessibility" accent="Standards">
        <p className="pg-p">We follow these guidelines and standards to ensure accessibility:</p>
        <ul className="pg-ul">
          <li><strong>WCAG 2.1 Level AA:</strong> Web Content Accessibility Guidelines published by the W3C — the gold standard for web accessibility.</li>
          <li><strong>ARIA (Accessible Rich Internet Applications):</strong> We use ARIA roles and attributes to make dynamic content (quizzes, game UI, progress dashboards) accessible to assistive technologies.</li>
          <li><strong>Section 508:</strong> Our platform aligns with U.S. Section 508 requirements for electronic accessibility where applicable.</li>
        </ul>
        <p className="pg-p">
          We conduct regular accessibility audits using a combination of automated tools (Axe, Lighthouse) and manual testing with screen readers (NVDA, JAWS, VoiceOver).
        </p>
      </Section>

      <Section id="features" num="Section 03" title="Accessibility" accent="Features">
        <p className="pg-p">CyberShield includes the following built-in accessibility features:</p>
        <table className="pg-table">
          <thead><tr><th>Feature</th><th>Description</th><th>Where</th></tr></thead>
          <tbody>
            <tr>
              <td><span className="pg-tag pg-tag-blue">High Contrast</span></td>
              <td>Toggle high-contrast mode for improved readability</td>
              <td>Account Settings → Accessibility</td>
            </tr>
            <tr>
              <td><span className="pg-tag pg-tag-blue">Text Size</span></td>
              <td>Increase or decrease base font size (3 levels)</td>
              <td>Account Settings → Accessibility</td>
            </tr>
            <tr>
              <td><span className="pg-tag pg-tag-blue">Reduced Motion</span></td>
              <td>Disable animations and transitions across the platform</td>
              <td>Account Settings → Accessibility</td>
            </tr>
            <tr>
              <td><span className="pg-tag pg-tag-green">Keyboard Nav</span></td>
              <td>Full keyboard navigation support across all pages</td>
              <td>Platform-wide</td>
            </tr>
            <tr>
              <td><span className="pg-tag pg-tag-green">Screen Reader</span></td>
              <td>ARIA labels and semantic HTML throughout</td>
              <td>Platform-wide</td>
            </tr>
            <tr>
              <td><span className="pg-tag pg-tag-green">Captions</span></td>
              <td>Text captions for all video content</td>
              <td>Learning modules</td>
            </tr>
            <tr>
              <td><span className="pg-tag pg-tag-orange">Colour-Blind</span></td>
              <td>Colour-blind friendly palette — information not conveyed by colour alone</td>
              <td>Platform-wide</td>
            </tr>
            <tr>
              <td><span className="pg-tag pg-tag-orange">Focus Indicators</span></td>
              <td>Visible focus rings on all interactive elements</td>
              <td>Platform-wide</td>
            </tr>
          </tbody>
        </table>
      </Section>

      <Section id="keyboard" num="Section 04" title="Keyboard" accent="Navigation">
        <p className="pg-p">CyberShield is fully navigable using a keyboard. Key shortcuts:</p>
        <table className="pg-table">
          <thead><tr><th>Key / Shortcut</th><th>Action</th></tr></thead>
          <tbody>
            <tr><td><span className="pg-tag pg-tag-blue">Tab</span></td><td>Move to next interactive element</td></tr>
            <tr><td><span className="pg-tag pg-tag-blue">Shift + Tab</span></td><td>Move to previous interactive element</td></tr>
            <tr><td><span className="pg-tag pg-tag-blue">Enter / Space</span></td><td>Activate buttons, links, and checkboxes</td></tr>
            <tr><td><span className="pg-tag pg-tag-blue">Escape</span></td><td>Close modals, dropdowns, and popups</td></tr>
            <tr><td><span className="pg-tag pg-tag-blue">Arrow Keys</span></td><td>Navigate quiz options, game menus, and dropdowns</td></tr>
            <tr><td><span className="pg-tag pg-tag-blue">Alt + 1</span></td><td>Skip to main content (skip navigation)</td></tr>
            <tr><td><span className="pg-tag pg-tag-blue">Alt + 2</span></td><td>Jump to primary navigation</td></tr>
            <tr><td><span className="pg-tag pg-tag-blue">Alt + 3</span></td><td>Jump to current page's sidebar</td></tr>
          </tbody>
        </table>
        <p className="pg-p">
          A "Skip to main content" link is available at the top of every page, allowing keyboard users to bypass navigation and jump directly to the page content.
        </p>
      </Section>

      <Section id="screen" num="Section 05" title="Screen Reader" accent="Support">
        <p className="pg-p">CyberShield has been tested with the following screen readers:</p>
        <ul className="pg-ul">
          <li><strong>NVDA</strong> (Windows) — Full support</li>
          <li><strong>JAWS</strong> (Windows) — Full support</li>
          <li><strong>VoiceOver</strong> (macOS and iOS) — Full support</li>
          <li><strong>TalkBack</strong> (Android) — Full support</li>
        </ul>
        <p className="pg-p">Our implementation includes:</p>
        <ul className="pg-ul">
          <li>Semantic HTML5 elements (<code>nav</code>, <code>main</code>, <code>article</code>, <code>section</code>, <code>aside</code>) throughout the platform</li>
          <li>Descriptive <code>aria-label</code> attributes on all interactive elements</li>
          <li>Live region announcements (<code>aria-live</code>) for quiz results, game notifications, and dynamic content</li>
          <li>Proper heading hierarchy (H1 → H2 → H3) on every page</li>
          <li>Alt text on all images, icons, and game graphics</li>
          <li>Form labels associated with all input fields</li>
        </ul>
      </Section>

      <Section id="visual" num="Section 06" title="Visual" accent="Accessibility">
        <p className="pg-p"><strong>Colour Contrast</strong></p>
        <p className="pg-p">All text on CyberShield meets or exceeds WCAG 2.1 AA contrast ratios:</p>
        <ul className="pg-ul">
          <li>Normal text: minimum 4.5:1 contrast ratio</li>
          <li>Large text (18px+ bold or 24px+ regular): minimum 3:1 contrast ratio</li>
          <li>UI components and graphical objects: minimum 3:1 contrast ratio</li>
        </ul>
        <p className="pg-p"><strong>Typography</strong></p>
        <ul className="pg-ul">
          <li>Text can be resized up to 200% without loss of content or functionality</li>
          <li>No text is rendered as images — all text is real, selectable HTML</li>
          <li>Line spacing is at least 1.5× font size throughout the platform</li>
        </ul>
        <p className="pg-p"><strong>Colour Independence</strong></p>
        <ul className="pg-ul">
          <li>Quiz correct/incorrect indicators use both colour AND icons (never colour alone)</li>
          <li>Game status indicators include text labels alongside colour coding</li>
          <li>Error messages include descriptive text, not just red highlighting</li>
        </ul>
      </Section>

      <Section id="game" num="Section 07" title="Game" accent="Accessibility">
        <p className="pg-p">
          The Cyber Defense Game has been designed with accessibility in mind:
        </p>
        <ul className="pg-ul">
          <li><strong>Keyboard Playable:</strong> The entire game can be played using only a keyboard — no mouse required.</li>
          <li><strong>Adjustable Game Speed:</strong> You can slow down time-based game elements in Accessibility Settings.</li>
          <li><strong>Reduced Motion Mode:</strong> Disables all particle effects, screen shakes, and rapid animations in the game.</li>
          <li><strong>Audio Descriptions:</strong> Game events include text-based notifications alongside any audio/visual feedback.</li>
          <li><strong>Pause Anytime:</strong> The game can be paused at any moment using the <span className="pg-tag pg-tag-blue">P</span> key or Escape key.</li>
          <li><strong>Colour-Blind Palettes:</strong> Choose from Deuteranopia, Protanopia, or Tritanopia colour palettes in Accessibility Settings → Game Display.</li>
        </ul>
        <div className="pg-highlight">
          <div className="pg-highlight-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0057FF" strokeWidth="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Accessibility Accommodations for Quizzes
          </div>
          <p className="pg-highlight-text">If you need extra time for quizzes due to a disability, contact us at accessibility@cybershield.app and we will configure extended time limits for your account within 2 business days.</p>
        </div>
      </Section>

      <Section id="mobile" num="Section 08" title="Mobile" accent="Accessibility">
        <p className="pg-p">CyberShield is fully responsive and accessible on mobile devices:</p>
        <ul className="pg-ul">
          <li>All interactive elements are at least 44×44px (Apple's recommended minimum touch target)</li>
          <li>Pinch-to-zoom is supported and never blocked</li>
          <li>The platform works in both portrait and landscape orientation</li>
          <li>Compatible with iOS VoiceOver and Android TalkBack screen readers</li>
          <li>Content is accessible with browser zoom up to 200% without horizontal scrolling</li>
        </ul>
      </Section>

      <Section id="known" num="Section 09" title="Known" accent="Issues">
        <p className="pg-p">We are transparent about accessibility issues we are currently working to fix:</p>
        <table className="pg-table">
          <thead><tr><th>Issue</th><th>Affected Area</th><th>Status</th></tr></thead>
          <tbody>
            <tr>
              <td>Game scoreboard auto-refresh announcements may be verbose on some screen readers</td>
              <td>Cyber Defense Game leaderboard</td>
              <td><span className="pg-tag pg-tag-orange">In Progress</span></td>
            </tr>
            <tr>
              <td>Drag-and-drop quiz questions not keyboard accessible</td>
              <td>Specific quiz modules</td>
              <td><span className="pg-tag pg-tag-orange">In Progress — Q2 2025</span></td>
            </tr>
            <tr>
              <td>PDF certificate download not screen-reader friendly</td>
              <td>Certificate generation</td>
              <td><span className="pg-tag pg-tag-green">Fixed in v2.3</span></td>
            </tr>
          </tbody>
        </table>
        <p className="pg-p">We aim to resolve all identified accessibility issues within 60 days of discovery.</p>
      </Section>

      <Section id="feedback" num="Section 10" title="Feedback &" accent="Support">
        <p className="pg-p">
          Your feedback helps us improve. If you encounter an accessibility barrier on CyberShield, please tell us:
        </p>
        <ul className="pg-ul">
          <li>What page or feature you were trying to use</li>
          <li>What assistive technology you use (if any)</li>
          <li>What happened and what you expected to happen</li>
        </ul>
        <p className="pg-p">
          We aim to respond to all accessibility reports within <strong>2 business days</strong> and resolve confirmed issues within <strong>30 days</strong>.
        </p>
        <div className="pg-success">
          <div className="pg-success-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#065F46" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Request Alternative Formats
          </div>
          <p className="pg-success-text">If you need any CyberShield content (course materials, certificates, policies) in an alternative accessible format (large print, plain text, audio description), contact us at accessibility@cybershield.app and we will provide it within 5 business days.</p>
        </div>
      </Section>

      <Section id="contact" num="Section 11" title="Contact" accent="Us">
        <p className="pg-p">For accessibility support, to report barriers, or to request accommodations:</p>
        <div className="pg-contact-card">
          <div className="pg-contact-title">CyberShield Accessibility Team</div>
          <div className="pg-contact-sub">Dedicated accessibility support team. We respond within 2 business days for all accessibility-related requests.</div>
          <div className="pg-contact-row">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.6)" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <a href="mailto:accessibility@cybershield.app">accessibility@cybershield.app</a>
          </div>
          <div className="pg-contact-row">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.6)" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1 19.79 19.79 0 0 1 1.61 4.5 2 2 0 0 1 3.58 2.32h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.06 6.06l1.77-1.77a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            +91 98765 43210 (Mon–Fri, 10AM–6PM IST)
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
