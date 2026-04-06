import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const sharedCss = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #F7F8FC; font-family: 'DM Sans', sans-serif; color: #0A0A1A; }

  @keyframes fadeUp-pg { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse-pg  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }

  .pg-anim { animation: fadeUp-pg .5s ease both; }

  /* NAV */
  .pg-nav { background: rgba(255,255,255,0.95); backdrop-filter: blur(14px); border-bottom: 1px solid #EAECF4; position: sticky; top: 0; z-index: 100; }
  .pg-nav-inner { max-width: 1100px; margin: 0 auto; padding: 0 32px; height: 64px; display: flex; align-items: center; justify-content: space-between; }
  .pg-logo { display: flex; align-items: center; gap: 9px; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 19px; color: #0A0A1A; cursor: pointer; text-decoration: none; }
  .pg-nav-links { display: flex; gap: 24px; }
  .pg-nav-link { font-size: 13px; font-weight: 500; color: #6B7280; cursor: pointer; padding: 6px 12px; border-radius: 8px; transition: all .2s; text-decoration: none; border: none; background: none; font-family: 'DM Sans', sans-serif; }
  .pg-nav-link:hover { background: #F0F4FF; color: #0057FF; }
  .pg-nav-link.pg-active { background: #EEF3FF; color: #0057FF; font-weight: 600; }
  .pg-back-btn { display: flex; align-items: center; gap: 6px; background: #0057FF; color: #fff; border: none; padding: 9px 18px; border-radius: 100px; font-size: 13px; font-weight: 600; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all .2s; }
  .pg-back-btn:hover { background: #0045CC; transform: scale(1.03); }

  /* HERO BAND */
  .pg-hero { background: linear-gradient(135deg, #EEF3FF 0%, #F7F8FC 100%); border-bottom: 1px solid #E5E9F5; padding: 56px 32px 48px; }
  .pg-hero-inner { max-width: 1100px; margin: 0 auto; }
  .pg-badge { display: inline-flex; align-items: center; gap: 7px; background: rgba(0,87,255,.08); border: 1px solid rgba(0,87,255,.16); color: #0057FF; padding: 5px 14px; border-radius: 100px; font-size: 11.5px; font-weight: 600; letter-spacing: .07em; text-transform: uppercase; margin-bottom: 18px; }
  .pg-pulse { width: 6px; height: 6px; background: #0057FF; border-radius: 50%; animation: pulse-pg 1.8s infinite; }
  .pg-hero-title { font-family: 'Syne', sans-serif; font-size: clamp(28px,4vw,46px); font-weight: 800; line-height: 1.1; letter-spacing: -.03em; color: #0A0A1A; margin-bottom: 12px; }
  .pg-hero-sub { font-size: 15.5px; color: #545878; line-height: 1.7; max-width: 580px; }
  .pg-meta { display: flex; align-items: center; gap: 20px; margin-top: 20px; flex-wrap: wrap; }
  .pg-meta-item { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #9099B8; font-weight: 500; }

  /* LAYOUT */
  .pg-body { max-width: 1100px; margin: 0 auto; padding: 48px 32px 80px; display: grid; grid-template-columns: 240px 1fr; gap: 48px; align-items: start; }

  /* SIDEBAR TOC */
  .pg-toc { position: sticky; top: 88px; background: #fff; border: 1px solid #EAECF4; border-radius: 18px; padding: 24px 20px; }
  .pg-toc-title { font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #9099B8; margin-bottom: 14px; }
  .pg-toc-item { display: block; font-size: 13.5px; color: #545878; padding: 8px 12px; border-radius: 8px; cursor: pointer; transition: all .2s; margin-bottom: 2px; text-decoration: none; border: none; background: none; width: 100%; text-align: left; font-family: 'DM Sans', sans-serif; }
  .pg-toc-item:hover { background: #F0F4FF; color: #0057FF; }
  .pg-toc-item.pg-toc-active { background: #EEF3FF; color: #0057FF; font-weight: 600; }
  .pg-toc-divider { height: 1px; background: #F0F2F8; margin: 12px 0; }

  /* CONTENT */
  .pg-content { min-width: 0; }
  .pg-section { margin-bottom: 48px; scroll-margin-top: 96px; }
  .pg-section-num { font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #0057FF; margin-bottom: 8px; }
  .pg-section-title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: #0A0A1A; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 2px solid #EEF3FF; }
  .pg-section-title span { color: #0057FF; }
  .pg-p { font-size: 15px; line-height: 1.78; color: #374151; margin-bottom: 14px; }
  .pg-p:last-child { margin-bottom: 0; }
  .pg-ul { margin: 12px 0 14px 0; padding: 0; list-style: none; }
  .pg-ul li { font-size: 15px; line-height: 1.7; color: #374151; padding: 6px 0 6px 24px; position: relative; }
  .pg-ul li::before { content: ''; position: absolute; left: 6px; top: 14px; width: 6px; height: 6px; border-radius: 50%; background: #0057FF; }
  .pg-highlight { background: linear-gradient(135deg, #EEF3FF, #F0F9FF); border: 1px solid #CCD7FF; border-radius: 14px; padding: 20px 22px; margin: 18px 0; }
  .pg-highlight-title { font-size: 13px; font-weight: 700; color: #0057FF; margin-bottom: 6px; display: flex; align-items: center; gap: 7px; }
  .pg-highlight-text { font-size: 14px; line-height: 1.68; color: #374151; }
  .pg-warn { background: linear-gradient(135deg, #FFF7ED, #FFFBF5); border: 1px solid #FED7AA; border-radius: 14px; padding: 20px 22px; margin: 18px 0; }
  .pg-warn-title { font-size: 13px; font-weight: 700; color: #C05621; margin-bottom: 6px; display: flex; align-items: center; gap: 7px; }
  .pg-warn-text { font-size: 14px; line-height: 1.68; color: #374151; }
  .pg-success { background: linear-gradient(135deg, #F0FDF4, #ECFDF5); border: 1px solid #A7F3D0; border-radius: 14px; padding: 20px 22px; margin: 18px 0; }
  .pg-success-title { font-size: 13px; font-weight: 700; color: #065F46; margin-bottom: 6px; display: flex; align-items: center; gap: 7px; }
  .pg-success-text { font-size: 14px; line-height: 1.68; color: #374151; }
  .pg-table { width: 100%; border-collapse: collapse; margin: 18px 0; border-radius: 12px; overflow: hidden; border: 1px solid #EAECF4; }
  .pg-table th { background: #F7F8FC; padding: 12px 16px; text-align: left; font-size: 12.5px; font-weight: 700; color: #374151; letter-spacing: .04em; text-transform: uppercase; border-bottom: 1px solid #EAECF4; }
  .pg-table td { padding: 12px 16px; font-size: 14px; color: #374151; border-bottom: 1px solid #F0F2F8; line-height: 1.5; }
  .pg-table tr:last-child td { border-bottom: none; }
  .pg-table tr:hover td { background: #FAFBFF; }
  .pg-tag { display: inline-block; padding: 3px 10px; border-radius: 100px; font-size: 12px; font-weight: 600; margin: 2px; }
  .pg-tag-blue { background: #EEF3FF; color: #0057FF; }
  .pg-tag-green { background: #ECFDF5; color: #065F46; }
  .pg-tag-orange { background: #FFF7ED; color: #C05621; }
  .pg-tag-red { background: #FEF2F2; color: #B91C1C; }

  /* CONTACT CARD */
  .pg-contact-card { background: linear-gradient(135deg, #0A0A1A, #1a1a3a); border-radius: 20px; padding: 32px; margin-top: 16px; }
  .pg-contact-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; color: #fff; margin-bottom: 8px; }
  .pg-contact-sub { font-size: 14px; color: rgba(255,255,255,.6); margin-bottom: 20px; line-height: 1.6; }
  .pg-contact-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; font-size: 14px; color: rgba(255,255,255,.8); }
  .pg-contact-row a { color: #60A5FA; text-decoration: none; }
  .pg-contact-row a:hover { text-decoration: underline; }

  /* FOOTER */
  .pg-footer { background: #0A0A1A; padding: 32px; }
  .pg-footer-inner { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
  .pg-footer-logo { display: flex; align-items: center; gap: 8px; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 17px; color: #fff; }
  .pg-footer-links { display: flex; gap: 6px; flex-wrap: wrap; }
  .pg-footer-link { font-size: 13px; color: rgba(255,255,255,.5); cursor: pointer; padding: 4px 10px; border-radius: 6px; transition: all .2s; text-decoration: none; }
  .pg-footer-link:hover { color: #fff; background: rgba(255,255,255,.08); }
  .pg-footer-link.pg-footer-active { color: #60A5FA; }
  .pg-footer-copy { font-size: 12.5px; color: rgba(255,255,255,.35); }
  .pg-dot { color: rgba(255,255,255,.2); margin: 0 4px; }

  @media(max-width: 768px) {
    .pg-body { grid-template-columns: 1fr; }
    .pg-toc { position: static; }
    .pg-nav-links { display: none; }
  }
`;

const navLinks = [
  { label: 'Privacy Policy',   path: '/privacy-policy' },
  { label: 'Terms of Service', path: '/terms-of-service' },
  { label: 'Cookie Policy',    path: '/cookie-policy' },
  { label: 'Accessibility',    path: '/accessibility' },
];

const ShieldIcon = ({ size = 22, color = '#0057FF' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

export function PageLayout({ badge, title, subtitle, updated, readTime, tocItems, children, activePath }) {
  const navigate = useNavigate();
  const location = useLocation();
  const current = activePath || location.pathname;

  useEffect(() => {
    const existing = document.getElementById('pg-shared-styles');
    if (!existing) {
      const s = document.createElement('style');
      s.id = 'pg-shared-styles';
      s.textContent = sharedCss;
      document.head.appendChild(s);
    }
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ background: '#F7F8FC', minHeight: '100vh' }}>
      {/* NAV */}
      <nav className="pg-nav">
        <div className="pg-nav-inner">
          <div className="pg-logo" onClick={() => navigate('/')}>
            <ShieldIcon /> CyberShield
          </div>
          <div className="pg-nav-links">
            {navLinks.map(l => (
              <button key={l.path} className={`pg-nav-link ${current === l.path ? 'pg-active' : ''}`} onClick={() => navigate(l.path)}>
                {l.label}
              </button>
            ))}
          </div>
          <button className="pg-back-btn" onClick={() => navigate(-1)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Go Back
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div className="pg-hero">
        <div className="pg-hero-inner pg-anim">
          <div className="pg-badge"><div className="pg-pulse" />{badge}</div>
          <h1 className="pg-hero-title">{title}</h1>
          <p className="pg-hero-sub">{subtitle}</p>
          <div className="pg-meta">
            <span className="pg-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Last updated: {updated}
            </span>
            <span className="pg-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {readTime} read
            </span>
            <span className="pg-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00B894" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              CyberShield Inc.
            </span>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="pg-body pg-anim" style={{ animationDelay: '.1s' }}>
        {/* TOC */}
        <aside className="pg-toc">
          <div className="pg-toc-title">On this page</div>
          {tocItems.map((item, i) => (
            item.divider
              ? <div key={i} className="pg-toc-divider" />
              : <button key={item.id} className="pg-toc-item" onClick={() => scrollTo(item.id)}>{item.label}</button>
          ))}
          <div className="pg-toc-divider" />
          <div style={{ fontSize: 12, color: '#9099B8', padding: '4px 12px', lineHeight: 1.5 }}>
            Questions? <br />
            <a href="mailto:support@cybershield.app" style={{ color: '#0057FF', textDecoration: 'none' }}>support@cybershield.app</a>
          </div>
        </aside>

        {/* CONTENT */}
        <main className="pg-content">{children}</main>
      </div>

      {/* FOOTER */}
      <footer className="pg-footer">
        <div className="pg-footer-inner">
          <div className="pg-footer-logo"><ShieldIcon color="#fff" size={18} /> CyberShield</div>
          <div className="pg-footer-links">
            {navLinks.map(l => (
              <a key={l.path} className={`pg-footer-link ${current === l.path ? 'pg-footer-active' : ''}`} onClick={() => navigate(l.path)} style={{ cursor: 'pointer' }}>
                {l.label}
              </a>
            ))}
          </div>
          <div className="pg-footer-copy">© 2025 CyberShield Inc. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}

export default PageLayout;
