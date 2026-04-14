import { useState } from "react";

/* ─── DATA ─────────────────────────────────────────────────────── */
const KNOWN_BRANDS = ["paypal","amazon","google","facebook","apple","netflix","microsoft","bank","wellsfargo","citibank","chase","github","twitter","instagram","linkedin","dropbox","spotify","yahoo","ebay","coinbase"];
const LEGIT_EMAIL_DOMAINS = ["gmail.com","outlook.com","yahoo.com","aol.com","hotmail.com","icloud.com","mail.com","protonmail.com","zoho.com"];
const COMMON_PASSES = ["password","123456","qwerty","letmein","iloveyou","admin","welcome","monkey","dragon","master","sunshine","shadow","password1","abc123","111111","123123","12345678","qwertyuiop","baseball","football","passw0rd","Password1","login","1q2w3e","zxcvbnm"];

function getDomain(url){try{return new URL(url).hostname.replace(/^www\./,"")}catch{return""}}
function isTyposquat(domain){
  const d=domain.toLowerCase();
  // Check for exact matches or close typos of known brands
  for(const b of KNOWN_BRANDS){
    if(d.includes(b)){ 
      const exact=[b+".com",b+".org",b+".net","www."+b+".com"];
      if(!exact.includes(d)) return b;
    }
    // Also check for common character substitutions (0->o, 1->i, etc)
    const fuzzy = b.replace(/o/g,'[o0]').replace(/i/g,'[i1l]').replace(/a/g,'[a@]').replace(/e/g,'[e3]').replace(/s/g,'[s5$]');
    if(new RegExp(fuzzy).test(d)) {
      const exact=[b+".com",b+".org",b+".net","www."+b+".com"];
      if(!exact.includes(d)) return b;
    }
  }
  return null;
}
function hasBadTLD(domain){return/\.(xyz|tk|ml|ga|cf|pw|top|click|loan|work|gq|cc|buzz|icu|ru|cn|comm|ney|nett|og|ccom|con)$/.test(domain);}
function passStrength(p){let s=0;if(p.length>=8)s+=10;if(p.length>=12)s+=15;if(p.length>=16)s+=10;if(/[A-Z]/.test(p))s+=15;if(/[a-z]/.test(p))s+=10;if(/[0-9]/.test(p))s+=15;if(/[^A-Za-z0-9]/.test(p))s+=20;if(COMMON_PASSES.includes(p.toLowerCase()))s=5;if(/(.)\1{2,}/.test(p))s=Math.max(0,s-20);if(/^(123|abc|qwe|asd|zxc)/i.test(p))s=Math.max(0,s-15);return Math.min(100,s);}

/* ─── STYLES ────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&family=Orbitron:wght@400;700;900&display=swap');

:root {
  --bg: #040810;
  --bg2: #080f1a;
  --bg3: #0c1525;
  --panel: rgba(8,20,40,0.9);
  --border: rgba(0,200,255,0.15);
  --border-bright: rgba(0,200,255,0.5);
  --cyan: #00c8ff;
  --cyan-dim: rgba(0,200,255,0.6);
  --cyan-glow: rgba(0,200,255,0.15);
  --red: #ff3b5c;
  --red-dim: rgba(255,59,92,0.15);
  --amber: #ffb83b;
  --amber-dim: rgba(255,184,59,0.15);
  --yellow: #f0e040;
  --green: #39ff88;
  --green-dim: rgba(57,255,136,0.15);
  --text: #c8e0f0;
  --text-dim: #6a8aaa;
  --text-bright: #e8f4ff;
  --mono: 'Share Tech Mono', monospace;
  --display: 'Orbitron', sans-serif;
  --body: 'Rajdhani', sans-serif;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.fdp-root {
  background: var(--bg);
  min-height: 100vh;
  font-family: var(--body);
  color: var(--text);
  overflow-x: hidden;
  position: relative;
}

.fdp-root::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(rgba(0,200,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,200,255,0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
  z-index: 0;
}

.fdp-root::after {
  content: '';
  position: fixed;
  top: -40%; left: -20%;
  width: 60%; height: 60%;
  background: radial-gradient(ellipse, rgba(0,100,200,0.08) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

.fdp-wrap {
  position: relative;
  z-index: 1;
  max-width: 780px;
  margin: 0 auto;
  padding: 2rem 1.25rem 4rem;
}

.fdp-hero {
  text-align: center;
  padding: 3rem 1rem 2.5rem;
  margin-bottom: 2rem;
  position: relative;
}

.fdp-hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: var(--mono);
  font-size: 11px;
  color: var(--cyan);
  border: 1px solid var(--border-bright);
  border-radius: 99px;
  padding: 5px 14px;
  margin-bottom: 1.5rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  background: var(--cyan-glow);
}

.fdp-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--green);
  box-shadow: 0 0 8px var(--green);
  animation: blink 1.4s infinite;
}
@keyframes blink {0%,100%{opacity:1}50%{opacity:.3}}

.fdp-title {
  font-family: var(--display);
  font-size: clamp(22px, 5vw, 38px);
  font-weight: 900;
  letter-spacing: 0.06em;
  color: var(--text-bright);
  line-height: 1.1;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
}

.fdp-title span {
  color: var(--cyan);
  text-shadow: 0 0 20px rgba(0,200,255,0.4), 0 0 40px rgba(0,200,255,0.2);
}

.fdp-subtitle {
  font-size: 15px;
  color: var(--text-dim);
  font-weight: 400;
  letter-spacing: 0.04em;
}

.fdp-scanline {
  position: absolute;
  bottom: 0; left: 50%;
  transform: translateX(-50%);
  width: 200px; height: 1px;
  background: linear-gradient(90deg, transparent, var(--cyan), transparent);
}

.fdp-tabs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  margin-bottom: 1.5rem;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 5px;
}

.fdp-tab {
  padding: 10px 8px;
  border-radius: 7px;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  border: 1px solid transparent;
  background: transparent;
  color: var(--text-dim);
  transition: all 0.2s;
  text-align: center;
}

.fdp-tab:hover { color: var(--cyan); border-color: var(--border); background: var(--cyan-glow); }

.fdp-tab.active {
  color: var(--bg);
  background: var(--cyan);
  border-color: var(--cyan);
  font-weight: 700;
  box-shadow: 0 0 16px rgba(0,200,255,0.4), 0 0 30px rgba(0,200,255,0.2);
}

.fdp-panel {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  animation: panelIn 0.25s ease;
  backdrop-filter: blur(12px);
}

@keyframes panelIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.fdp-panel::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--cyan-dim), transparent);
}

.fdp-panel-label {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text-dim);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.fdp-panel-label::before { content: '//'; color: var(--cyan); font-weight: 700; }

.fdp-input-row { display: flex; gap: 8px; margin-bottom: 10px; }

.fdp-input {
  flex: 1;
  padding: 11px 14px;
  background: rgba(0,200,255,0.04);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-family: var(--mono);
  font-size: 13px;
  color: var(--text-bright);
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
}
.fdp-input::placeholder { color: var(--text-dim); }
.fdp-input:focus { border-color: var(--cyan-dim); box-shadow: 0 0 0 3px rgba(0,200,255,0.07); }

.fdp-textarea {
  width: 100%;
  padding: 11px 14px;
  background: rgba(0,200,255,0.04);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text-bright);
  outline: none;
  resize: none;
  margin-bottom: 10px;
  transition: border 0.2s;
}
.fdp-textarea:focus { border-color: var(--cyan-dim); }
.fdp-textarea::placeholder { color: var(--text-dim); }

.fdp-btn {
  padding: 11px 20px;
  border-radius: 8px;
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  border: 1px solid var(--border-bright);
  background: transparent;
  color: var(--cyan);
  transition: all 0.18s;
  white-space: nowrap;
}
.fdp-btn:hover { border-color: var(--cyan); color: var(--bg); background: var(--cyan); box-shadow: 0 0 16px rgba(0,200,255,0.4); }
.fdp-btn:active { transform: scale(0.97); }
.fdp-btn-primary { background: var(--cyan); color: var(--bg); font-weight: 700; box-shadow: 0 0 12px rgba(0,200,255,0.3); }
.fdp-btn-primary:hover { box-shadow: 0 0 24px rgba(0,200,255,0.5), 0 0 40px rgba(0,200,255,0.3); transform: translateY(-1px); color: var(--bg); }

.fdp-demos { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }

.fdp-demo-btn {
  padding: 5px 12px;
  border-radius: 6px;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  cursor: pointer;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-dim);
  transition: all 0.15s;
  text-transform: uppercase;
}
.fdp-demo-btn:hover { border-color: var(--cyan); color: var(--cyan); background: var(--cyan-glow); }

.fdp-result {
  margin-top: 16px;
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 1.25rem;
  background: rgba(4,12,24,0.8);
  animation: resultIn 0.3s ease;
  position: relative;
  overflow: hidden;
}

@keyframes resultIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.fdp-result-critical { border-color: rgba(255,59,92,0.5); }
.fdp-result-critical::before { content:''; position:absolute; top:0;left:0;right:0;height:1px; background:linear-gradient(90deg,transparent,var(--red),transparent); }
.fdp-result-high { border-color: rgba(255,184,59,0.4); }
.fdp-result-high::before { content:''; position:absolute; top:0;left:0;right:0;height:1px; background:linear-gradient(90deg,transparent,var(--amber),transparent); }
.fdp-result-medium { border-color: rgba(240,224,64,0.4); }
.fdp-result-medium::before { content:''; position:absolute; top:0;left:0;right:0;height:1px; background:linear-gradient(90deg,transparent,var(--yellow),transparent); }
.fdp-result-low { border-color: rgba(57,255,136,0.4); }
.fdp-result-low::before { content:''; position:absolute; top:0;left:0;right:0;height:1px; background:linear-gradient(90deg,transparent,var(--green),transparent); }

.fdp-risk-row { display: flex; align-items: center; gap: 12px; margin-bottom: 6px; }

.fdp-risk-label {
  font-family: var(--display);
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.fdp-risk-score {
  font-family: var(--mono);
  font-size: 13px;
  padding: 3px 10px;
  border-radius: 4px;
  border: 1px solid;
  letter-spacing: 0.05em;
}

.fdp-domain {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text-dim);
  margin-bottom: 12px;
  word-break: break-all;
}

.fdp-bar-wrap {
  background: rgba(255,255,255,0.04);
  border-radius: 99px;
  height: 6px;
  margin: 10px 0 14px;
  overflow: hidden;
}

.fdp-bar {
  height: 6px;
  border-radius: 99px;
  transition: width 0.9s cubic-bezier(0.4,0,0.2,1);
}

.fdp-badges { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 12px; }

.fdp-badge {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 3px 9px;
  border-radius: 4px;
  border: 1px solid;
}

.fdp-badge-red { background: var(--red-dim); color: var(--red); border-color: rgba(255,59,92,0.3); }
.fdp-badge-amber { background: var(--amber-dim); color: var(--amber); border-color: rgba(255,184,59,0.3); }
.fdp-badge-yellow { background: rgba(240,224,64,0.1); color: var(--yellow); border-color: rgba(240,224,64,0.3); }
.fdp-badge-green { background: var(--green-dim); color: var(--green); border-color: rgba(57,255,136,0.3); }

.fdp-checks { margin-top: 4px; }

.fdp-check {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.02em;
  animation: checkIn 0.2s ease both;
}
.fdp-check:last-child { border-bottom: none; }

@keyframes checkIn {
  from { opacity: 0; transform: translateX(-8px); }
  to { opacity: 1; transform: translateX(0); }
}

.fdp-ci {
  width: 20px; height: 20px;
  border-radius: 4px;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--mono);
  font-size: 9px;
  font-weight: 700;
  flex-shrink: 0;
  margin-top: 1px;
}
.fdp-ci-ok { background: var(--green-dim); color: var(--green); border: 1px solid rgba(57,255,136,0.3); }
.fdp-ci-bad { background: var(--red-dim); color: var(--red); border: 1px solid rgba(255,59,92,0.3); }
.fdp-ci-warn { background: var(--amber-dim); color: var(--amber); border: 1px solid rgba(255,184,59,0.3); }
.fdp-ci-info { background: rgba(0,200,255,0.1); color: var(--cyan); border: 1px solid rgba(0,200,255,0.2); }

.fdp-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin: 14px 0;
}

.fdp-stat {
  background: rgba(0,200,255,0.04);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px 10px;
  text-align: center;
}

.fdp-stat-val {
  font-family: var(--display);
  font-size: 20px;
  font-weight: 700;
  color: var(--text-bright);
  line-height: 1;
}

.fdp-stat-lab {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--text-dim);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-top: 5px;
}

.fdp-shimmer {
  border-radius: 10px;
  height: 100px;
  margin-top: 16px;
  background: linear-gradient(90deg, var(--bg2) 25%, rgba(0,200,255,0.05) 50%, var(--bg2) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.fdp-history { margin-top: 16px; }
.fdp-hist-label {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--text-dim);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.fdp-hist-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 0;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  font-family: var(--mono);
  font-size: 12px;
}
.fdp-hist-item:last-child { border-bottom: none; }
.fdp-hist-url { color: var(--text-dim); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 70%; }

.fdp-live { margin: 6px 0 10px; }

.fdp-tip {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text-dim);
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255,255,255,0.04);
}

.fdp-corner { position: absolute; width: 10px; height: 10px; border-color: var(--cyan-dim); border-style: solid; }
.fdp-corner-tl { top: 8px; left: 8px; border-width: 1px 0 0 1px; }
.fdp-corner-tr { top: 8px; right: 8px; border-width: 1px 1px 0 0; }
.fdp-corner-bl { bottom: 8px; left: 8px; border-width: 0 0 1px 1px; }
.fdp-corner-br { bottom: 8px; right: 8px; border-width: 0 1px 1px 0; }

@media (max-width: 520px) {
  .fdp-tabs { grid-template-columns: repeat(2, 1fr); }
  .fdp-title { font-size: 22px; }
}
`;

/* ─── HELPERS ────────────────────────────────────────────────────── */
function riskMeta(score) {
  if (score >= 75) return { label: "Critical", color: "var(--red)", cls: "critical", badgeCls: "red" };
  if (score >= 50) return { label: "High Risk", color: "var(--amber)", cls: "high", badgeCls: "amber" };
  if (score >= 25) return { label: "Medium", color: "var(--yellow)", cls: "medium", badgeCls: "yellow" };
  return { label: "Low Risk", color: "var(--green)", cls: "low", badgeCls: "green" };
}

function CheckRow({ type, message, delay = 0 }) {
  const cls = type === "ok" ? "fdp-ci-ok" : type === "bad" ? "fdp-ci-bad" : type === "warn" ? "fdp-ci-warn" : "fdp-ci-info";
  const icon = type === "ok" ? "OK" : type === "bad" ? "!!" : type === "warn" ? "WN" : "//";
  const textColor = type === "bad" ? "var(--red)" : type === "ok" ? "var(--text)" : type === "warn" ? "var(--amber)" : "var(--cyan-dim)";
  return (
    <div className="fdp-check" style={{ animationDelay: `${delay * 0.06}s`, color: textColor }}>
      <div className={`fdp-ci ${cls}`}>{icon}</div>
      <span>{message}</span>
    </div>
  );
}

function ScoreResult({ score, domain, checks, badges }) {
  const meta = riskMeta(score);
  return (
    <div className={`fdp-result fdp-result-${meta.cls}`}>
      <div className="fdp-corner fdp-corner-tl" /><div className="fdp-corner fdp-corner-tr" />
      <div className="fdp-corner fdp-corner-bl" /><div className="fdp-corner fdp-corner-br" />
      <div className="fdp-risk-row">
        <div className="fdp-risk-label" style={{ color: meta.color }}>{meta.label}</div>
        <div className="fdp-risk-score" style={{ color: meta.color, borderColor: meta.color, background: `rgba(0,0,0,0.3)` }}>{score} / 100</div>
      </div>
      <div className="fdp-bar-wrap">
        <div className="fdp-bar" style={{ width: `${score}%`, background: meta.color }} />
      </div>
      {domain && <div className="fdp-domain">&gt; {domain}</div>}
      {badges && badges.length > 0 && (
        <div className="fdp-badges">
          {badges.map((b, i) => <span key={i} className={`fdp-badge fdp-badge-${meta.badgeCls}`}>{b}</span>)}
        </div>
      )}
      <div className="fdp-checks">
        {checks.map((c, i) => <CheckRow key={i} type={c.t} message={c.m} delay={i} />)}
      </div>
    </div>
  );
}

/* ─── TOOL 1: URL ANALYZER ──────────────────────────────────────── */
function URLAnalyzer() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const run = (val) => {
    const raw = (val || url).trim();
    if (!raw) return;
    setLoading(true); setResult(null);
    setTimeout(() => {
      const u = raw.toLowerCase();
      let score = 0; const factors = []; const checks = [];
      const domain = getDomain(raw) || raw;

      const squat = isTyposquat(domain);
      if (squat) { score += 55; factors.push("Typosquatting: mimics " + squat); checks.push({ t: "bad", m: `Domain impersonates "${squat}" — classic phishing tactic` }); }
      else checks.push({ t: "ok", m: "No known brand impersonation detected" });

      if (/\.(comm?|og|ney|nett?|ccom|con)(\b|\/|$)/.test(u)) { score += 40; factors.push("Fake TLD (.comm / .con)"); checks.push({ t: "bad", m: "Misspelled TLD engineered to fool the eye" }); }

      if (!u.startsWith("https://")) { score += 25; factors.push("No HTTPS"); checks.push({ t: "warn", m: "Unencrypted connection — data sent in plaintext" }); }
      else checks.push({ t: "ok", m: "HTTPS encryption is present" });

      if (/bit\.ly|tinyurl|t\.co|goo\.gl|ow\.ly|rb\.gy|is\.gd|cutt\.ly/.test(u)) { score += 20; factors.push("Shortened URL"); checks.push({ t: "warn", m: "URL shortener hides the true destination" }); }

      if (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(u)) { score += 35; factors.push("Raw IP address"); checks.push({ t: "bad", m: "IP-based URL — legitimate services use domain names" }); }

      const phishWords = ["login","verify","update","urgent","suspend","confirm","validate","secure","banking","winner","prize","claim","expire","reset","locked"];
      const found = phishWords.filter(w => u.includes(w));
      if (found.length > 1) { score += 25; factors.push("Phishing keywords (" + found.slice(0, 3).join(", ") + ")"); checks.push({ t: "warn", m: `High-alarm vocabulary: ${found.join(", ")}` }); }
      else if (found.length === 1) checks.push({ t: "info", m: `Keyword "${found[0]}" detected — not conclusive alone` });
      else checks.push({ t: "ok", m: "No phishing keywords found in URL" });

      if (hasBadTLD(domain)) { score += 30; factors.push("High-risk TLD"); checks.push({ t: "bad", m: "TLD heavily associated with scam/phishing infrastructure" }); }

      const dots = (domain.match(/\./g) || []).length;
      if (dots >= 3) { score += 15; factors.push("Excessive subdomains (" + dots + " levels)"); checks.push({ t: "warn", m: "Deep subdomain nesting used to obscure the real domain" }); }

      if (/[а-яёА-ЯЁ\u0370-\u03FF\u0400-\u04FF]/.test(raw)) { score += 45; factors.push("Homograph attack (Unicode)"); checks.push({ t: "bad", m: "Non-Latin lookalike characters detected — visual spoofing" }); }

      const paramCount = (u.match(/[?&]/g) || []).length;
      if (paramCount > 4) { score += 10; checks.push({ t: "info", m: `${paramCount} URL parameters — unusually high` }); }

      score = Math.min(100, score);
      setResult({ score, domain, checks, badges: factors });
      setHistory(h => [{ url: raw.length > 42 ? raw.slice(0, 42) + "…" : raw, score }, ...h].slice(0, 4));
      setLoading(false);
    }, 900);
  };

  const demos = [
    { label: "Phishing", val: "https://paypa1.com/login?verify=urgent&account=suspend" },
    { label: "Typosquat", val: "https://githubb.com/download/release" },
    { label: "Fake TLD", val: "http://amazon.comm/order/confirm" },
    { label: "Short URL", val: "http://bit.ly/3xFakeBank" },
    { label: "Safe", val: "https://github.com/anthropics/claude" },
  ];

  return (
    <div className="fdp-panel">
      <div className="fdp-panel-label">URL Threat Scanner — paste any URL below</div>
      <div className="fdp-input-row">
        <input className="fdp-input" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://suspicious-site.com/login?verify=urgent" onKeyDown={e => e.key === "Enter" && run()} />
        <button className="fdp-btn fdp-btn-primary" onClick={() => run()}>SCAN</button>
      </div>
      <div className="fdp-demos">
        {demos.map(d => (
          <button key={d.label} className="fdp-demo-btn" onClick={() => { setUrl(d.val); run(d.val); }}>[{d.label}]</button>
        ))}
      </div>
      {loading && <div className="fdp-shimmer" />}
      {result && !loading && <ScoreResult {...result} />}
      {history.length > 1 && (
        <div className="fdp-history">
          <div className="fdp-hist-label">// recent scans</div>
          {history.slice(1).map((h, i) => {
            const m = riskMeta(h.score);
            return (
              <div key={i} className="fdp-hist-item">
                <span className="fdp-hist-url">{h.url}</span>
                <span className="fdp-badge" style={{ color: m.color, borderColor: m.color, background: "rgba(0,0,0,0.3)", fontSize: 10 }}>{m.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── TOOL 2: EMAIL ANALYZER ────────────────────────────────────── */
function EmailAnalyzer() {
  const [addr, setAddr] = useState("");
  const [body, setBody] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const run = (a, b) => {
    const ra = (a || addr).trim();
    const rb = b !== undefined ? b : body;
    if (!ra) return;
    setLoading(true); setResult(null);
    setTimeout(() => {
      let score = 0; const checks = [];
      const parts = ra.split("@"); const user = parts[0] || ""; const domain = parts[1] || "";

      if (!domain || !ra.includes("@")) { score += 60; checks.push({ t: "bad", m: "Invalid email format — not a proper address" }); }
      else {
        // Check for legitimate email providers first
        const isLegitEmailDomain = LEGIT_EMAIL_DOMAINS.includes(domain);
        if (isLegitEmailDomain) {
          checks.push({ t: "ok", m: `Using legitimate email provider: ${domain}` });
        } else {
          // Check if it's a typosquat of a legitimate email provider
          let emailTyposquat = null;
          for (const legit of LEGIT_EMAIL_DOMAINS) {
            const legitDomain = legit.split(".")[0]; // e.g., "gmail" from "gmail.com"
            if (domain.toLowerCase().includes(legitDomain)) {
              if (!LEGIT_EMAIL_DOMAINS.includes(domain)) {
                emailTyposquat = legit;
                break;
              }
            }
          }
          if (emailTyposquat) { score += 50; checks.push({ t: "bad", m: `Spoofs legitimate email provider "${emailTyposquat}" — likely phishing` }); }
          
          // Regular brand typosquat check
          const squat = isTyposquat(domain);
          if (squat) { score += 50; checks.push({ t: "bad", m: `Domain spoofs "${squat}" — typosquatting detected` }); }
          else if (!emailTyposquat) checks.push({ t: "ok", m: "Sender domain has no brand impersonation" });
          
          if (hasBadTLD(domain)) { score += 30; checks.push({ t: "bad", m: "Sender uses high-risk free/abused TLD" }); }
          else if (!isLegitEmailDomain) checks.push({ t: "ok", m: "Sender domain TLD appears normal" });
        }
        
        if (domain.length > 25) { score += 10; checks.push({ t: "warn", m: `Long domain name (${domain.length} chars) — atypical for legitimate senders` }); }
        if (/noreply|no-reply|donotreply/.test(user)) checks.push({ t: "info", m: "No-reply address — could be legit bulk mail or spoofed" });
      }

      if (rb) {
        const bl = rb.toLowerCase();
        const urgWords = ["urgent","immediate","suspend","expire","within 24","limited time","act now","verify now","account locked","unusual activity","confirm immediately","your account will"];
        const uw = urgWords.filter(w => bl.includes(w));
        if (uw.length >= 2) { score += 30; checks.push({ t: "bad", m: `Extreme urgency language — ${uw.length} pressure triggers found` }); }
        else if (uw.length === 1) { score += 10; checks.push({ t: "warn", m: `Urgency trigger: "${uw[0]}"` }); }
        else checks.push({ t: "ok", m: "No high-pressure urgency language detected" });

        if (/http:\/\/|bit\.ly|tinyurl/.test(bl)) { score += 20; checks.push({ t: "bad", m: "Unencrypted or shortened links in email body" }); }
        if (/\bgift\b|\bwinner\b|\bcongratulations\b|\bprize\b|\$\d+|\bfree\b.{0,20}\bclaim\b/.test(bl)) { score += 25; checks.push({ t: "bad", m: "Prize/reward language — classic advance-fee scam pattern" }); }
        if (/dear (customer|user|member|valued|friend|sir|ma'am)/i.test(rb)) { score += 15; checks.push({ t: "warn", m: "Generic greeting — real companies use your actual name" }); }
        else if (rb.length > 30) checks.push({ t: "ok", m: "Greeting appears personalized" });
        if (/click (here|below|the link|this link)/i.test(rb)) { score += 15; checks.push({ t: "warn", m: '"Click here" phrasing — common in phishing lures' }); }
        if (/password|credentials|ssn|social security|credit card|cvv/i.test(rb)) { score += 30; checks.push({ t: "bad", m: "Requests sensitive credentials — NEVER share via email" }); }
      } else {
        checks.push({ t: "ok", m: "No email body provided — domain-only analysis complete" });
      }

      if (checks.length === 0) {
        checks.push({ t: "ok", m: "All checks passed — email appears safe" });
      }

      score = Math.min(100, score);
      setResult({ score, domain: ra, checks });
      setLoading(false);
    }, 750);
  };

  return (
    <div className="fdp-panel">
      <div className="fdp-panel-label">Email Threat Analyzer — address + optional body</div>
      <div className="fdp-input-row">
        <input className="fdp-input" value={addr} onChange={e => setAddr(e.target.value)} placeholder="support@amaz0n-secure.net" onKeyDown={e => e.key === "Enter" && run()} />
        <button className="fdp-btn fdp-btn-primary" onClick={() => run()}>SCAN</button>
      </div>
      <textarea className="fdp-textarea" rows={3} value={body} onChange={e => setBody(e.target.value)} placeholder="Paste the email body here for deeper analysis (optional)..." />
      <div className="fdp-demos">
        <button className="fdp-demo-btn" onClick={() => {
          const a = "no-reply@amaz0n-secure.net";
          const b = "Dear Customer, Your account has been SUSPENDED! Verify immediately or lose access. Click here: http://bit.ly/verify — Act now!";
          setAddr(a); setBody(b); run(a, b);
        }}>[Scam Email]</button>
        <button className="fdp-demo-btn" onClick={() => {
          const a = "hello@github.com";
          const b = "Hi there, thank you for joining. Your account is ready.";
          setAddr(a); setBody(b); run(a, b);
        }}>[Legit Email]</button>
        <button className="fdp-demo-btn" onClick={() => {
          const a = "support@paypa1-verify.xyz";
          const b = "Urgent: Confirm your PayPal password and credit card CVV within 24 hours or your account will be locked permanently.";
          setAddr(a); setBody(b); run(a, b);
        }}>[Credential Theft]</button>
      </div>
      {loading && <div className="fdp-shimmer" />}
      {result && !loading && <ScoreResult {...result} />}
    </div>
  );
}

/* ─── TOOL 3: PHONE CHECKER ─────────────────────────────────────── */
function PhoneChecker() {
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const run = (val) => {
    const raw = (val || phone).trim();
    if (!raw) return;
    setLoading(true); setResult(null);
    setTimeout(() => {
      let score = 0; const checks = [];
      const digits = raw.replace(/\D/g, "");

      if (digits.length < 7 || digits.length > 15) { score += 40; checks.push({ t: "bad", m: `Digit count (${digits.length}) outside valid range 7–15` }); }
      else checks.push({ t: "ok", m: `Digit count (${digits.length}) is within normal range` });

      if (/^1?900/.test(digits)) { score += 60; checks.push({ t: "bad", m: "900 prefix — premium-rate number used in callback fraud" }); }
      if (/^1?976/.test(digits)) { score += 55; checks.push({ t: "bad", m: "976 prefix — historically linked to pay-per-call scams" }); }
      if (/^(1?(809|284|876|473|649|664|721|758|767|784|868|869))/.test(digits)) { score += 45; checks.push({ t: "warn", m: "Caribbean area code — associated with one-ring scam calls" }); }
      if (raw.includes("+44") && /07700/.test(digits)) { score += 35; checks.push({ t: "warn", m: "+44 7700 is Ofcom-reserved — used in spoofed numbers" }); }
      if (/(\d)\1{5,}/.test(digits)) { score += 30; checks.push({ t: "bad", m: "Repeated digit sequence — not a real phone number" }); }
      if (/555(0[01]\d\d)/.test(digits.replace(/^1/, ""))) { score += 20; checks.push({ t: "info", m: "555 series — reserved/fictional number" }); }
      if (digits.length > 0 && digits.split("").every(d => d === digits[0])) { score += 50; checks.push({ t: "bad", m: "All identical digits — clearly fabricated number" }); }
      if (/^(1?(800|888|877|866|855|844|833))/.test(digits)) checks.push({ t: "info", m: "Toll-free prefix — could be legitimate or spoofed" });
      if (score === 0) { checks.push({ t: "ok", m: "No known suspicious patterns detected" }); checks.push({ t: "info", m: "Always verify via official channels before calling back" }); }

      score = Math.min(100, score);
      setResult({ score, domain: raw, checks });
      setLoading(false);
    }, 650);
  };

  return (
    <div className="fdp-panel">
      <div className="fdp-panel-label">Phone Number Vishing Detector</div>
      <div className="fdp-input-row">
        <input className="fdp-input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 900 555 0199" onKeyDown={e => e.key === "Enter" && run()} />
        <button className="fdp-btn fdp-btn-primary" onClick={() => run()}>CHECK</button>
      </div>
      <div className="fdp-demos">
        <button className="fdp-demo-btn" onClick={() => { setPhone("+1-900-555-0199"); run("+1-900-555-0199"); }}>[Premium Rate]</button>
        <button className="fdp-demo-btn" onClick={() => { setPhone("+44 7700 900077"); run("+44 7700 900077"); }}>[Spoofed UK]</button>
        <button className="fdp-demo-btn" onClick={() => { setPhone("+1 876 555 0044"); run("+1 876 555 0044"); }}>[Caribbean]</button>
        <button className="fdp-demo-btn" onClick={() => { setPhone("+1 212 456 7890"); run("+1 212 456 7890"); }}>[Normal]</button>
      </div>
      {loading && <div className="fdp-shimmer" />}
      {result && !loading && <ScoreResult {...result} />}
    </div>
  );
}

/* ─── TOOL 4: PASSWORD SAFETY ───────────────────────────────────── */
function PasswordSafety() {
  const [pass, setPass] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [live, setLive] = useState(null);

  const handleChange = (val) => {
    setPass(val);
    setLive(val ? passStrength(val) : null);
  };

  const run = () => {
    if (!pass.trim()) return;
    setLoading(true); setResult(null);
    setTimeout(() => {
      const score = passStrength(pass);
      const checks = [];
      const isCommon = COMMON_PASSES.includes(pass.toLowerCase());

      if (isCommon) checks.push({ t: "bad", m: "TOP BREACH LIST: This password appears in major data leaks" });
      if (pass.length < 8) checks.push({ t: "bad", m: `Too short (${pass.length} chars) — minimum is 8, recommended 14+` });
      else if (pass.length < 12) checks.push({ t: "warn", m: `Acceptable length (${pass.length}) — 14+ recommended` });
      else checks.push({ t: "ok", m: `Good length — ${pass.length} characters` });
      if (/[A-Z]/.test(pass)) checks.push({ t: "ok", m: "Contains uppercase letters" });
      else checks.push({ t: "warn", m: "No uppercase letters — add A–Z for entropy" });
      if (/[0-9]/.test(pass)) checks.push({ t: "ok", m: "Contains digits" });
      else checks.push({ t: "warn", m: "No digits — add 0–9 for strength" });
      if (/[^A-Za-z0-9]/.test(pass)) checks.push({ t: "ok", m: "Special characters present — excellent!" });
      else checks.push({ t: "warn", m: "No special characters (!@#$%^&*) — highly recommended" });
      if (/(.)\1{2,}/.test(pass)) checks.push({ t: "warn", m: "Repeated character sequences — weakens entropy" });
      if (/^(123|abc|qwe|password|admin|letme|iloveyou)/i.test(pass)) checks.push({ t: "bad", m: "Starts with a predictable dictionary pattern" });
      if (!isCommon && score >= 70) checks.push({ t: "ok", m: "Not matched in common breach pattern database" });

      const invScore = 100 - score;
      const strengthLabel = invScore >= 75 ? "Very Weak" : invScore >= 50 ? "Weak" : invScore >= 25 ? "Fair" : "Strong";
      const symCount = (pass.match(/[^A-Za-z0-9]/g) || []).length;
      const charSpace = (/[a-z]/.test(pass) ? 26 : 0) + (/[A-Z]/.test(pass) ? 26 : 0) + (/[0-9]/.test(pass) ? 10 : 0) + (/[^A-Za-z0-9]/.test(pass) ? 32 : 0) || 1;
      const entropy = Math.round(pass.length * Math.log2(charSpace));

      setResult({ score, invScore, strengthLabel, symCount, entropy, checks });
      setLoading(false);
    }, 700);
  };

  const liveColor = live !== null ? riskMeta(100 - live).color : "var(--cyan)";

  return (
    <div className="fdp-panel">
      <div className="fdp-panel-label">Password Strength Analyzer — all checks run locally</div>
      <div className="fdp-input-row">
        <input type="password" className="fdp-input" value={pass} onChange={e => handleChange(e.target.value)} placeholder="Enter password to evaluate..." onKeyDown={e => e.key === "Enter" && run()} />
        <button className="fdp-btn fdp-btn-primary" onClick={run}>EVAL</button>
      </div>
      {live !== null && (
        <div className="fdp-live">
          <div className="fdp-bar-wrap">
            <div className="fdp-bar" style={{ width: `${live}%`, background: liveColor }} />
          </div>
        </div>
      )}
      {loading && <div className="fdp-shimmer" />}
      {result && !loading && (() => {
        const meta = riskMeta(result.invScore);
        return (
          <div className={`fdp-result fdp-result-${meta.cls}`}>
            <div className="fdp-corner fdp-corner-tl" /><div className="fdp-corner fdp-corner-tr" />
            <div className="fdp-corner fdp-corner-bl" /><div className="fdp-corner fdp-corner-br" />
            <div className="fdp-risk-row">
              <div className="fdp-risk-label" style={{ color: meta.color }}>Password {result.strengthLabel}</div>
              <div className="fdp-risk-score" style={{ color: meta.color, borderColor: meta.color, background: "rgba(0,0,0,0.3)" }}>{result.score} / 100</div>
            </div>
            <div className="fdp-bar-wrap">
              <div className="fdp-bar" style={{ width: `${result.score}%`, background: meta.color }} />
            </div>
            <div className="fdp-stats">
              <div className="fdp-stat">
                <div className="fdp-stat-val" style={{ color: meta.color }}>{pass.length}</div>
                <div className="fdp-stat-lab">Length</div>
              </div>
              <div className="fdp-stat">
                <div className="fdp-stat-val">{result.symCount}</div>
                <div className="fdp-stat-lab">Symbols</div>
              </div>
              <div className="fdp-stat">
                <div className="fdp-stat-val" style={{ color: result.entropy >= 60 ? "var(--green)" : result.entropy >= 40 ? "var(--amber)" : "var(--red)" }}>{result.entropy}</div>
                <div className="fdp-stat-lab">Entropy bits</div>
              </div>
            </div>
            <div className="fdp-checks">
              {result.checks.map((c, i) => <CheckRow key={i} type={c.t} message={c.m} delay={i} />)}
            </div>
            <div className="fdp-tip">// password never transmitted — all evaluation runs in your browser</div>
          </div>
        );
      })()}
    </div>
  );
}

/* ─── ROOT ───────────────────────────────────────────────────────── */
const TABS = [
  { id: "url", label: "URL Scanner" },
  { id: "email", label: "Email Scan" },
  { id: "phone", label: "Phone Check" },
  { id: "pass", label: "Password" },
];

export default function FraudDetectionPage() {
  const [active, setActive] = useState("url");
  return (
    <>
      <style>{CSS}</style>
      <div className="fdp-root">
        <div className="fdp-wrap">
          <header className="fdp-hero">
            <div className="fdp-hero-badge">
              <span className="fdp-dot" />
              All systems operational — 4 tools active
            </div>
            <h1 className="fdp-title">Fraud <span>Detection</span> Toolkit</h1>
            <p className="fdp-subtitle">Real-time threat analysis · Phishing · Typosquatting · Vishing · Credential safety</p>
            <div className="fdp-scanline" />
          </header>
          <nav className="fdp-tabs">
            {TABS.map(t => (
              <button key={t.id} className={`fdp-tab${active === t.id ? " active" : ""}`} onClick={() => setActive(t.id)}>
                {t.label}
              </button>
            ))}
          </nav>
          {active === "url" && <URLAnalyzer />}
          {active === "email" && <EmailAnalyzer />}
          {active === "phone" && <PhoneChecker />}
          {active === "pass" && <PasswordSafety />}
        </div>
      </div>
    </>
  );
}