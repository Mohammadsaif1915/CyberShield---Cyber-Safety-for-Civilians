import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const css = `
  @keyframes pulse-fc { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }
  @keyframes fadeUp-fc { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }

  .fc-fade-in { animation: fadeUp-fc 0.6s ease both; }

  .fc-navbar { background: rgba(247,248,252,0.92); backdrop-filter: blur(14px); border-bottom: 1px solid #EAECF4; position: sticky; top: 0; z-index: 100; padding: 16px 0; }
  .fc-nav-inner { max-width: 1160px; margin: 0 auto; padding: 0 32px; display: flex; align-items: center; justify-content: space-between; }
  .fc-logo { display: flex; align-items: center; gap: 10px; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 20px; color: #0A0A1A; cursor: pointer; }
  .fc-nav-links { display: flex; gap: 28px; font-size: 14px; font-weight: 500; color: #545878; }
  .fc-nav-links span { cursor: pointer; transition: color 0.2s; }
  .fc-nav-links span:hover { color: #0057FF; }
  .fc-nav-links .fc-active { color: #0057FF; }
  .fc-cta-btn { background: #0057FF; color: #fff; border: none; padding: 10px 22px; border-radius: 100px; font-size: 13px; font-weight: 600; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.25s; }
  .fc-cta-btn:hover { background: #0045CC; transform: scale(1.04); box-shadow: 0 8px 28px rgba(0,87,255,0.4); }

  .fc-hero-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(0,87,255,0.08); border: 1px solid rgba(0,87,255,0.18); color: #0057FF; padding: 7px 16px; border-radius: 100px; font-size: 12.5px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 28px; }
  .fc-pulse-dot { width: 7px; height: 7px; background: #0057FF; border-radius: 50%; animation: pulse-fc 1.8s ease-in-out infinite; }
  .fc-heading { font-family: 'Syne', sans-serif; font-size: clamp(36px, 5.5vw, 64px); font-weight: 800; line-height: 1.06; letter-spacing: -0.03em; color: #0A0A1A; }
  .fc-heading-accent { background: linear-gradient(135deg, #0057FF, #6C5CE7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .fc-divider { width: 48px; height: 3px; background: linear-gradient(90deg,#0057FF,#6C5CE7); border-radius: 4px; margin: 20px 0 32px; }

  .fc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px,1fr)); gap: 24px; }

  .fc-card { background: #fff; border: 1px solid #EAECF4; border-radius: 20px; padding: 36px 32px; cursor: pointer; transition: all 0.35s cubic-bezier(0.22,1,0.36,1); position: relative; overflow: hidden; }
  .fc-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--cc); transform: scaleX(0); transition: transform 0.35s ease; transform-origin: left; }
  .fc-card:hover::before, .fc-card.fc-active-card::before { transform: scaleX(1); }
  .fc-card:hover, .fc-card.fc-active-card { border-color: transparent; box-shadow: 0 20px 56px rgba(0,0,0,0.10); transform: translateY(-5px); }
  .fc-card.fc-active-card { background: linear-gradient(135deg,#fff 0%,#f5f7ff 100%); }
  .fc-icon-wrap { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 22px; transition: transform 0.3s ease; }
  .fc-card:hover .fc-icon-wrap { transform: scale(1.1) rotate(-3deg); }
  .fc-card-num { font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.15em; color: #B0B5CC; margin-bottom: 14px; }
  .fc-card-title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700; margin-bottom: 6px; color: #0A0A1A; }
  .fc-card-tagline { font-size: 12.5px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 14px; opacity: 0.75; }
  .fc-card-desc { font-size: 14.5px; line-height: 1.72; color: #545878; }
  .fc-card-stat { margin-top: 22px; display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; padding: 6px 14px; border-radius: 100px; }

  .fc-cta-strip { background: linear-gradient(135deg,#0A0A1A 0%,#1a1a3a 100%); border-radius: 24px; padding: 60px 56px; display: flex; align-items: center; justify-content: space-between; gap: 32px; flex-wrap: wrap; margin-top: 80px; }
  .fc-cta-outline { background: transparent; border: 1px solid rgba(255,255,255,0.25); color: rgba(255,255,255,0.8); padding: 16px 32px; border-radius: 100px; font-size: 15px; font-weight: 500; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.25s ease; }
  .fc-cta-outline:hover { background: rgba(255,255,255,0.1); }
  .fc-footer-note { text-align: center; margin-top: 56px; color: #A0A5BC; font-size: 13.5px; display: flex; align-items: center; justify-content: center; gap: 8px; }

  @media(max-width:640px){ .fc-cta-strip{padding:36px 24px;} .fc-nav-links{display:none;} .fc-grid{grid-template-columns:1fr;} }
`;

const ShieldIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#0057FF">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const features = [
  { id:"01", title:"Learning Hub", tagline:"Structured Cyber Education", description:"Master cybersecurity concepts through curated modules — from phishing awareness to advanced threat detection. Progress at your own pace.", stat:"50+ Modules", color:"#0057FF",
    icon:<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
  { id:"02", title:"Smart Quizzes", tagline:"Test & Reinforce Knowledge", description:"Adaptive quizzes that challenge your understanding after every module. Get instant feedback and detailed explanations for each answer.", stat:"200+ Questions", color:"#00B894",
    icon:<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/></svg> },
  { id:"03", title:"Cyber Game", tagline:"Learn by Playing", description:"Experience real-world attack scenarios in a safe, gamified environment. Defend virtual systems, catch hackers, and earn security badges.", stat:"10+ Scenarios", color:"#E84393",
    icon:<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="5 3 19 12 5 21 5 3"/></svg> },
  { id:"04", title:"Community", tagline:"Learn Together, Grow Together", description:"Join a growing network of security learners. Share insights, discuss threats, and collaborate with peers and mentors worldwide.", stat:"5K+ Members", color:"#FD7B00",
    icon:<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { id:"05", title:"Secure Auth", tagline:"Your Data, Protected", description:"Built-in secure login and registration with best-practice encryption. We practice what we teach — your account stays safe with us.", stat:"256-bit Secure", color:"#6C5CE7",
    icon:<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> },
  { id:"06", title:"Progress Tracking", tagline:"Measure Your Growth", description:"Visual dashboards show your learning streaks, quiz scores, and game achievements. Know exactly where you stand and what's next.", stat:"Real-time Stats", color:"#00CEC9",
    icon:<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
];

function FeaturesCyber() {
  const [active, setActive] = useState(null);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'fc-styles';
    style.textContent = css;
    document.head.appendChild(style);
    setTimeout(() => setMounted(true), 50);
    return () => { const s = document.getElementById('fc-styles'); if (s) s.remove(); };
  }, []);

  return (
    <div style={{ background: '#F7F8FC', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", color: '#0A0A1A' }}>
      <nav className="fc-navbar">
        <div className="fc-nav-inner">
          <div className="fc-logo"><ShieldIcon /> CyberShield</div>
          <div className="fc-nav-links">
            <span className="fc-active">Features</span>
            <span onClick={() => navigate('/help')}>Help</span>
            <span onClick={() => navigate('/contact')}>Contact</span>
          </div>
          <button className="fc-cta-btn">Get Started</button>
        </div>
      </nav>

      <main style={{ maxWidth: 1160, margin: '0 auto', padding: '80px 32px 100px' }}>
        <div style={{ maxWidth: 680, marginBottom: 72 }} className={mounted ? 'fc-fade-in' : ''}>
          <div className="fc-hero-badge"><div className="fc-pulse-dot" />Platform Features</div>
          <h1 className="fc-heading">Everything you need<br />to stay <span className="fc-heading-accent">cyber safe</span></h1>
          <div className="fc-divider" />
          <p style={{ fontSize: 17, lineHeight: 1.78, color: '#545878', maxWidth: 520 }}>
            CyberShield combines structured learning, hands-on games, and smart assessments — all in one place.
          </p>
        </div>

        <div className="fc-fade-in" style={{ display: 'flex', gap: 40, flexWrap: 'wrap', marginBottom: 60, animationDelay: '0.15s' }}>
          {[['10K+','Learners'],['50+','Modules'],['98%','Satisfaction'],['24/7','Available']].map(([n,l]) => (
            <div key={l}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 32, fontWeight: 800, color: '#0057FF', lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: 13, color: '#9099B8', marginTop: 5, fontWeight: 500 }}>{l}</div>
            </div>
          ))}
        </div>

        <div className="fc-grid">
          {features.map((f, i) => (
            <div key={f.id}
              className={`fc-card ${active === f.id ? 'fc-active-card' : ''} ${mounted ? 'fc-fade-in' : ''}`}
              style={{ '--cc': f.color, animationDelay: `${i * 0.08 + 0.2}s` }}
              onClick={() => setActive(active === f.id ? null : f.id)}>
              <div className="fc-card-num">{f.id}</div>
              <div className="fc-icon-wrap" style={{ background: `${f.color}14`, color: f.color }}>{f.icon}</div>
              <div className="fc-card-title">{f.title}</div>
              <div className="fc-card-tagline" style={{ color: f.color }}>{f.tagline}</div>
              <p className="fc-card-desc">{f.description}</p>
              <div className="fc-card-stat" style={{ background: `${f.color}10`, color: f.color }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                {f.stat}
              </div>
            </div>
          ))}
        </div>

        <div className={`fc-cta-strip ${mounted ? 'fc-fade-in' : ''}`} style={{ animationDelay: '0.55s' }}>
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6C5CE7', marginBottom: 12 }}>Ready to Start?</div>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 800, color: '#fff', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              Your security journey<br />begins here.
            </h2>
          </div>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
            <button className="fc-cta-btn" style={{ padding: '16px 36px', fontSize: 15 }}>Start Learning Free →</button>
            <button className="fc-cta-outline">View Demo</button>
          </div>
        </div>

        <div className="fc-footer-note"><ShieldIcon />CyberShield · Educating the next generation of cyber-aware citizens</div>
      </main>
    </div>
  );
}

export default FeaturesCyber;
