/**
 * CyberShield Dashboard — Light Theme
 * Fixes: real leaderboard from API, dismissible notifs,
 *        better avatar, light theme, no department field
 */

import { useState, useEffect } from "react";
import {
  Shield, LayoutDashboard, BookOpen, AlertTriangle, Mail, Brain,
  BarChart2, Trophy, Settings, Bell, Search, ChevronLeft, ChevronRight,
  User, LogOut, TrendingUp, Clock, CheckCircle, XCircle, Play,
  Zap, Eye, EyeOff, X, Award, Target, Activity,
  AlertCircle, Edit, Save, Trash2, ChevronDown, ChevronUp,
  Gamepad2, GraduationCap, ShieldAlert, ArrowRight, Flame,
  Loader2, Rocket, RefreshCw, Camera, ImagePlus,
} from "lucide-react";
import {
  BarChart, Bar as ReBar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const API_URL = (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) || "http://localhost:5000";
const getToken = () => localStorage.getItem("token");

const apiFetch = async (path, opts = {}) => {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...opts.headers,
    },
  });
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
  return res.json();
};

const handleLogout = async () => {
  try { await apiFetch("/api/logout", { method: "POST" }); } catch {}
  finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }
};

// ─── LIGHT THEME TOKENS ───────────────────────────────────────────────────────
const C = {
  // Backgrounds
  bg:       "#F0F4FA",
  bgPage:   "#E8EDF5",
  card:     "#FFFFFF",
  card2:    "#F7F9FC",
  sidebar:  "#FFFFFF",

  // Borders
  border:   "#E2E8F0",
  borderMd: "#CBD5E1",

  // Text
  ink:    "#0F172A",
  inkMd:  "#475569",
  inkLt:  "#94A3B8",
  inkXlt: "#CBD5E1",

  // Brand
  brand:    "#2563EB",
  brandLt:  "#EFF6FF",
  brandMd:  "#DBEAFE",

  // Accents
  teal:     "#0D9488",
  tealLt:   "#F0FDFA",
  violet:   "#7C3AED",
  violetLt: "#F5F3FF",
  amber:    "#D97706",
  amberLt:  "#FFFBEB",
  red:      "#DC2626",
  redLt:    "#FEF2F2",
  green:    "#059669",
  greenLt:  "#ECFDF5",

  // Gradients
  gradBrand:  "linear-gradient(135deg, #2563EB 0%, #0D9488 100%)",
  gradViolet: "linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)",
  gradAmber:  "linear-gradient(135deg, #D97706 0%, #DC2626 100%)",
  gradGreen:  "linear-gradient(135deg, #059669 0%, #0D9488 100%)",

  // Shadows
  shadow:   "0 1px 3px rgba(15,23,42,0.06), 0 4px 16px rgba(15,23,42,0.06)",
  shadowMd: "0 4px 24px rgba(15,23,42,0.10)",
  shadowLg: "0 12px 48px rgba(15,23,42,0.14)",
};

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fira+Code:wght@400;500;600&display=swap');

    *,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
    html,body,#root {
      height:100%;
      font-family:'Plus Jakarta Sans',sans-serif;
      background:${C.bg};
      color:${C.ink};
      -webkit-font-smoothing:antialiased;
    }
    ::-webkit-scrollbar { width:4px; height:4px; }
    ::-webkit-scrollbar-track { background:transparent; }
    ::-webkit-scrollbar-thumb { background:${C.borderMd}; border-radius:99px; }
    button,input,select,textarea { font-family:inherit; }
    button:focus,input:focus { outline:none; }

    .mono { font-family:'Fira Code',monospace; }

    @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
    @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.3} }
    @keyframes ping    { 0%{transform:scale(1);opacity:.8} 100%{transform:scale(2.2);opacity:0} }
    @keyframes spin    { to{transform:rotate(360deg)} }
    @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }

    .page-enter { animation: fadeUp .25s cubic-bezier(.4,0,.2,1); }
    .spin       { animation: spin .9s linear infinite; }

    /* Cards */
    .card {
      background: ${C.card};
      border: 1px solid ${C.border};
      border-radius: 16px;
      box-shadow: ${C.shadow};
      transition: box-shadow .18s, border-color .18s, transform .18s;
    }
    .card:hover { box-shadow: ${C.shadowMd}; border-color: ${C.borderMd}; }
    .card-click { cursor:pointer; }
    .card-click:hover { transform: translateY(-2px); }

    /* Nav */
    .nav-btn {
      width:100%; display:flex; align-items:center; gap:10px;
      padding:9px 12px; border-radius:10px; border:none; cursor:pointer;
      background:transparent; color:${C.inkMd};
      font-size:13px; font-weight:500;
      font-family:'Plus Jakarta Sans',sans-serif;
      transition:all .15s; position:relative;
    }
    .nav-btn:hover { background:${C.bgPage}; color:${C.ink}; }
    .nav-btn.active { background:${C.brandMd}; color:${C.brand}; font-weight:600; }

    /* Buttons */
    .btn {
      display:inline-flex; align-items:center; gap:7px;
      padding:9px 18px; border-radius:10px; border:none; cursor:pointer;
      font-size:13px; font-weight:600;
      font-family:'Plus Jakarta Sans',sans-serif;
      transition:all .15s;
    }
    .btn-primary {
      background:${C.gradBrand}; color:#fff;
      box-shadow:0 4px 14px rgba(37,99,235,0.25);
    }
    .btn-primary:hover { opacity:.9; transform:translateY(-1px); }
    .btn-primary:disabled { opacity:.5; cursor:not-allowed; transform:none; }
    .btn-ghost {
      background:transparent; color:${C.inkMd};
      border:1px solid ${C.border};
    }
    .btn-ghost:hover { border-color:${C.borderMd}; color:${C.ink}; background:${C.bgPage}; }

    /* Tag */
    .tag {
      display:inline-flex; align-items:center; gap:4px;
      padding:2px 8px; border-radius:6px;
      font-size:10px; font-weight:600;
      font-family:'Fira Code',monospace;
      letter-spacing:.04em;
    }

    /* Stat card */
    .stat-card {
      background:${C.card}; border:1px solid ${C.border}; border-radius:16px;
      padding:20px; box-shadow:${C.shadow};
      transition:box-shadow .18s, transform .18s, border-color .18s;
    }
    .stat-card:hover { box-shadow:${C.shadowMd}; transform:translateY(-2px); border-color:${C.borderMd}; }

    /* Progress bar */
    .prog-wrap { width:100%; background:${C.bgPage}; border-radius:99px; overflow:hidden; }
    .prog-bar  { height:100%; border-radius:99px; transition:width .7s ease; }

    /* Dot grid */
    .dotgrid {
      background-image: radial-gradient(circle, ${C.borderMd} 1px, transparent 1px);
      background-size: 22px 22px;
    }

    /* Table stripe */
    .stripe-row:nth-child(even) { background:${C.bgPage}; }

    /* Notif dismiss button */
    .notif-dismiss {
      width:22px; height:22px; border-radius:6px; border:none; cursor:pointer;
      background:transparent; color:${C.inkLt};
      display:flex; align-items:center; justify-content:center;
      flex-shrink:0; transition:all .15s;
    }
    .notif-dismiss:hover { background:${C.redLt}; color:${C.red}; }

    /* Skeleton loader */
    .skeleton {
      background: linear-gradient(90deg, ${C.bgPage} 0%, ${C.border} 50%, ${C.bgPage} 100%);
      background-size: 400px 100%;
      animation: shimmer 1.4s infinite;
      border-radius: 8px;
    }

    /* Avatar gradient variants */
    .av-0 { background: linear-gradient(135deg,#2563EB,#0D9488); }
    .av-1 { background: linear-gradient(135deg,#7C3AED,#2563EB); }
    .av-2 { background: linear-gradient(135deg,#D97706,#DC2626); }
    .av-3 { background: linear-gradient(135deg,#059669,#0D9488); }
    .av-4 { background: linear-gradient(135deg,#DB2777,#7C3AED); }
    .av-5 { background: linear-gradient(135deg,#EA580C,#D97706); }
  `}</style>
);

// ─── HOOKS ────────────────────────────────────────────────────────────────────
function useUser() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) { setLoading(false); window.location.href = "/login"; return; }

    apiFetch("/api/me")
      .then(data => {
        const u = data.user || data;
        setUser(u);
        localStorage.setItem("user", JSON.stringify(u));
      })
      .catch(err => {
        if (err.message.includes("401")) {
          localStorage.removeItem("token"); localStorage.removeItem("user");
          window.location.href = "/login";
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
}

// Real leaderboard from API — falls back to empty
function useLeaderboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    apiFetch("/api/leaderboard")
      .then(d => setData(d.leaderboard || d.data || d || []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);
  return { data, loading, reload: load };
}

// ─── UTILS ────────────────────────────────────────────────────────────────────
const dName  = u => u?.fullName || u?.name || u?.username || (u?.email ? u.email.split("@")[0] : "User");
const initials = n => (n || "??").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
const avClass  = n => `av-${Math.abs((n||"U").charCodeAt(0) + ((n||"U").charCodeAt(1)||0)) % 6}`;

// ─── ATOMS ────────────────────────────────────────────────────────────────────
const Tag = ({ label, color, bg }) => (
  <span className="tag" style={{ background: bg || color + "15", color, border: `1px solid ${color}25` }}>{label}</span>
);

// Avatar: gradient circle with initials — looks polished
const Avatar = ({ name, size = 36, fontSize = 13 }) => {
  const av = initials(name);
  const cls = avClass(name);
  return (
    <div className={cls} style={{
      width: size, height: size, borderRadius: "50%",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, color: "#fff", fontWeight: 700,
      fontSize, letterSpacing: "0.02em",
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    }}>{av}</div>
  );
};

const LiveDot = () => (
  <div style={{ display:"flex", alignItems:"center", gap:5, padding:"3px 9px", borderRadius:99, background:C.redLt, border:`1px solid rgba(220,38,38,0.2)` }}>
    <div style={{ position:"relative", width:6, height:6 }}>
      <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:C.red, animation:"ping 1.5s infinite" }}/>
      <div style={{ width:6, height:6, borderRadius:"50%", background:C.red }}/>
    </div>
    <span className="mono" style={{ fontSize:9, fontWeight:600, color:C.red, letterSpacing:"0.1em" }}>LIVE</span>
  </div>
);

const Prog = ({ pct, color = C.brand, h = 6 }) => (
  <div className="prog-wrap" style={{ height: h }}>
    <div className="prog-bar" style={{ width: `${pct}%`, background: color, height: h }} />
  </div>
);

const TT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px", fontSize:11, boxShadow:C.shadowMd }}>
      <p style={{ color:C.inkMd, marginBottom:4, fontWeight:600 }}>{label}</p>
      {payload.map((p,i) => <p key={i} style={{ color:p.color }}>{p.name}: <strong>{p.value}</strong></p>)}
    </div>
  );
};

const EmptyState = ({ icon: Icon, title, desc, action, color = C.brand }) => (
  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:10, padding:"36px 20px", textAlign:"center" }}>
    <div style={{ width:52, height:52, borderRadius:14, background:color+"12", border:`1px solid ${color}20`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:4 }}>
      <Icon size={22} style={{ color }}/>
    </div>
    <p style={{ fontSize:14, fontWeight:700, color:C.ink }}>{title}</p>
    <p style={{ fontSize:12, color:C.inkMd, lineHeight:1.6, maxWidth:220 }}>{desc}</p>
    {action}
  </div>
);

const SectionHead = ({ title, sub }) => (
  <div style={{ marginBottom:24 }}>
    <h2 style={{ fontSize:22, fontWeight:800, color:C.ink, marginBottom:4, letterSpacing:"-0.02em" }}>{title}</h2>
    {sub && <p style={{ fontSize:12, color:C.inkMd }}>{sub}</p>}
  </div>
);

// Dismissible notifications — global state
const INITIAL_NOTIFS = [
  { id:1, icon:AlertTriangle, msg:"NEW CRITICAL: LockBit 3.0 variant active in your region", time:"2 min ago",  unread:true,  color:C.red   },
  { id:2, icon:Brain,         msg:"New quiz unlocked: Advanced Network Security",             time:"3 hrs ago",  unread:true,  color:C.violet },
  { id:3, icon:Shield,        msg:"Security score improved +12 points this week",             time:"2 days ago", unread:false, color:C.green  },
];

// ─── STATIC DATA ──────────────────────────────────────────────────────────────
const THREATS = [
  { id:1, name:"LockBit 3.0 Ransomware",  type:"Ransomware",    sev:"Critical", date:"2025-01-13", desc:"Most prolific RaaS. Self-propagation via SMB, data exfiltration before encryption. Avg ransom: $85k USD." },
  { id:2, name:"APT-29 Cozy Bear",        type:"APT",           sev:"Critical", date:"2025-01-14", desc:"State-sponsored Russian group. Spear-phishing + supply chain. Uses SUNBURST, TEARDROP malware." },
  { id:3, name:"Log4Shell CVE-2021-44228",type:"Vulnerability", sev:"High",     date:"2025-01-12", desc:"Still exploited in unpatched systems. RCE via JNDI injection in Apache Log4j2." },
  { id:4, name:"BEC — CEO Impersonation", type:"Phishing",      sev:"Medium",   date:"2025-01-09", desc:"Wave targeting Indian fintech CFOs. AI voice follow-ups. Avg loss: ₹28 lakh." },
  { id:5, name:"SSH Brute-Force Campaign",type:"Network",       sev:"Low",      date:"2025-01-07", desc:"45,000+ attempts from 312 Tor exit nodes. Block via fail2ban + IP reputation feeds." },
];
const SEV_C = {
  Critical:{ c:C.red,    bg:C.redLt    },
  High:    { c:"#EA580C", bg:"#FFF7ED" },
  Medium:  { c:C.amber,  bg:C.amberLt  },
  Low:     { c:C.green,  bg:C.greenLt  },
};
const PHISHING_EMAILS = [
  { id:1, from:"PayPal Security",     sender:"security@paypa1.com",       subject:"Urgent: Verify your account",         time:"10:23 AM",  fish:true,  read:false,
    body:"Dear Customer,\n\nSuspicious activity detected on your PayPal account. It has been temporarily limited.\n\nVerify within 24 hours:\n→ http://paypa1-secure.xyz/login\n\nPayPal Security Team",
    flags:["Misspelled domain — paypa1.com not paypal.com","Urgent threatening language","Link goes to non-PayPal domain","Generic 'Dear Customer' greeting","Artificial 24-hour deadline"] },
  { id:2, from:"GitHub",              sender:"noreply@github.com",         subject:"Your pull request #247 was merged",   time:"9:45 AM",   fish:false, read:true,
    body:"Hi there,\n\nYour pull request #247 'Fix authentication middleware' was merged into main by jsmith.\n\nView: github.com/cybershield/platform\n\nThe GitHub Team", flags:[] },
  { id:3, from:"HR Department",       sender:"hr-noreply@comp4ny-hr.net",  subject:"Action Required: W-2 Form Update",    time:"Yesterday", fish:true,  read:false,
    body:"Dear Employee,\n\nAnnual tax filing requires you to update your W-2 information and banking details immediately.\n\nUpdate: http://comp4ny-hr.net/w2-update\n\nDeadline: End of today.",
    flags:["Unofficial lookalike domain","Requests sensitive banking details","Same-day deadline","No company name mentioned"] },
  { id:4, from:"State Bank of India", sender:"alerts@sbi-bank-secure.in", subject:"URGENT: KYC Update — Account Blocked", time:"2 days ago",fish:true,  read:false,
    body:"Dear Valued Customer,\n\nYour SBI account has been blocked due to incomplete KYC.\n\nTo unblock: http://sbi-kyc-update.in/verify\n\nProvide: Account No., Debit Card No., PIN, OTP",
    flags:["Fake domain — not sbi.co.in","Requests card + PIN + OTP simultaneously","SBI never asks for PIN via email"] },
  { id:5, from:"Medium Daily Digest", sender:"newsletter@medium.com",      subject:"Your top stories for today",           time:"3 days ago",fish:false, read:true,
    body:"Good morning,\n\nHere are your personalized stories:\n• The Future of Cybersecurity in 2025\n• Zero Trust Architecture Explained\n• Top 10 Ransomware Prevention Tips\n\nThe Medium Team", flags:[] },
];
const NAV = [
  { id:"dashboard",   label:"Overview",     icon:LayoutDashboard },
  { id:"threats",     label:"Threats",      icon:ShieldAlert     },
  { id:"learn",       label:"Learn",        icon:GraduationCap   },
  { id:"phishing",    label:"Phishing Sim", icon:Mail            },
  { id:"quiz",        label:"Quiz",         icon:Brain           },
  { id:"game",        label:"Game",         icon:Gamepad2, badge:"NEW" },
  { id:"reports",     label:"Reports",      icon:BarChart2       },
  { id:"leaderboard", label:"Leaderboard",  icon:Trophy          },
  { id:"profile",     label:"Profile",      icon:User            },
  { id:"settings",    label:"Settings",     icon:Settings        },
];

// ══════════════════════════════════════════════════════════════════
// DASHBOARD PAGE
// ══════════════════════════════════════════════════════════════════
function DashboardPage({ user, setPage, notifs, setNotifs }) {
  const fname    = dName(user).split(" ")[0];
  const today    = new Date().toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long", year:"numeric" });
  const xp       = user?.xp    ?? 0;
  const level    = user?.level ?? 1;
  const score    = user?.score ?? 0;
  const streak   = user?.streak ?? 0;
  const rank     = user?.rank  ?? "—";
  const xpNext   = level * 500;
  const xpPct    = Math.min(100, Math.round((xp / xpNext) * 100));
  const isNew    = xp === 0 && score === 0;

  const tips = [
    "Never reuse passwords across accounts.",
    "Enable 2FA on every critical service.",
    "Hover over links before clicking — verify the domain.",
    "Keep your OS and software fully patched.",
    "Public Wi-Fi? Always use a VPN.",
  ];
  const [tip] = useState(() => tips[Math.floor(Math.random() * tips.length)]);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:22 }} className="page-enter">

      {/* ── HERO ── */}
      <div style={{ borderRadius:20, padding:"28px 32px", position:"relative", overflow:"hidden", background:C.gradBrand, boxShadow:"0 8px 40px rgba(37,99,235,0.22)" }}>
        <div className="dotgrid" style={{ position:"absolute", inset:0, opacity:.1 }}/>
        <div style={{ position:"absolute", right:-20, top:-20, opacity:.06 }}><Shield size={180}/></div>

        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
            <span className="mono" style={{ fontSize:10, color:"rgba(255,255,255,0.7)", letterSpacing:"0.14em" }}>// SECURE SESSION</span>
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#86EFAC", animation:"pulse 2s infinite" }}/>
          </div>
          <p className="mono" style={{ fontSize:11, color:"rgba(255,255,255,0.6)", marginBottom:6 }}>{today}</p>
          <h1 style={{ fontSize:28, fontWeight:800, color:"#fff", letterSpacing:"-0.02em", marginBottom:10 }}>
            Welcome back, <span style={{ color:"#BAE6FD" }}>{fname}</span> 👋
          </h1>

          {/* Tip */}
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.14)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:10, padding:"7px 14px", marginBottom:16 }}>
            <Zap size={13} style={{ color:"#FDE68A", flexShrink:0 }}/>
            <span style={{ fontSize:12, color:"rgba(255,255,255,0.75)" }}>Tip: </span>
            <span style={{ fontSize:12, color:"#fff", fontWeight:500 }}>{tip}</span>
          </div>

          {isNew ? (
            <div style={{ background:"rgba(255,255,255,0.12)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:12, padding:"14px 18px", maxWidth:480 }}>
              <p style={{ fontSize:13, color:"#fff", fontWeight:600, marginBottom:4 }}>🚀 Your cybersecurity journey starts now!</p>
              <p style={{ fontSize:12, color:"rgba(255,255,255,0.75)", lineHeight:1.6, margin:0 }}>Complete a quiz to earn your first XP, or try the phishing simulator to sharpen your instincts.</p>
              <div style={{ display:"flex", gap:10, marginTop:12 }}>
                <button className="btn" onClick={() => setPage("quiz")} style={{ background:"rgba(255,255,255,0.9)", color:C.brand, fontSize:12, padding:"8px 16px", borderRadius:9, border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:7, fontWeight:700 }}><Brain size={13}/> Take Quiz</button>
                <button className="btn btn-ghost" onClick={() => setPage("learn")} style={{ color:"rgba(255,255,255,0.85)", borderColor:"rgba(255,255,255,0.3)", fontSize:12, padding:"8px 16px" }}><BookOpen size={13}/> Browse Courses</button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                {[["⚡ Score",score,"#BAE6FD"],["🏆 Rank",rank,"#FDE68A"],["🎮 Lv."+level,"Level","#DDD6FE"],["🔥 "+streak+"d","Streak","#FCA5A5"]].map(([v,l,c],i)=>(
                  <div key={i} style={{ background:"rgba(255,255,255,0.14)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:12, padding:"11px 18px", textAlign:"center" }}>
                    <div style={{ fontSize:18, fontWeight:800, color:c }}>{v}</div>
                    <div style={{ fontSize:10, color:"rgba(255,255,255,0.6)", marginTop:2 }}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:14, maxWidth:320 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"rgba(255,255,255,0.65)", marginBottom:4 }}>
                  <span>Level {level} XP</span>
                  <span className="mono" style={{ color:"#BAE6FD" }}>{xp} / {xpNext}</span>
                </div>
                <div style={{ width:"100%", background:"rgba(255,255,255,0.2)", borderRadius:99, height:6 }}>
                  <div style={{ width:`${xpPct}%`, height:6, background:"linear-gradient(90deg,#fff,#BAE6FD)", borderRadius:99 }}/>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
        {[
          { icon:Brain,         label:"Take a Quiz",        sub:"Test your cybersecurity knowledge",  color:C.violet, page:"quiz"    },
          { icon:GraduationCap, label:"Browse Courses",     sub:"Structured learning with labs",      color:C.brand,  page:"learn"   },
          { icon:Gamepad2,      label:"Play CyberDefense",  sub:"Defeat real-world cyber threats",    color:C.teal,   page:"game"    },
        ].map(item => (
          <button key={item.label} onClick={() => setPage(item.page)}
            className="card card-click"
            style={{ padding:20, border:`1px solid ${C.border}`, textAlign:"left", cursor:"pointer" }}>
            <div style={{ width:44, height:44, borderRadius:12, background:item.color+"12", border:`1px solid ${item.color}20`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:12 }}>
              <item.icon size={22} style={{ color:item.color }}/>
            </div>
            <p style={{ fontSize:14, fontWeight:700, color:C.ink, margin:"0 0 4px" }}>{item.label}</p>
            <p style={{ fontSize:11, color:C.inkMd, margin:0 }}>{item.sub}</p>
          </button>
        ))}
      </div>

      {/* ── STAT CARDS ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
        {[
          { icon:Zap,        label:"Security Score",  value:score||"—", color:C.brand,  sub:score?"Keep it up!":"Complete a quiz"        },
          { icon:ShieldAlert,label:"Threats Learned", value:user?.threatsRead??0, color:C.red, sub:"From threat intel"                   },
          { icon:Brain,      label:"Quizzes Taken",   value:user?.quizzesDone??0, color:C.violet, sub:user?.avgScore?`Avg ${user.avgScore}%`:"None yet" },
          { icon:Flame,      label:"Day Streak",      value:(streak||0)+"d", color:C.amber, sub:streak>=3?"🔥 On fire!":"Login daily"    },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ width:40, height:40, borderRadius:11, background:s.color+"12", border:`1px solid ${s.color}20`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14 }}>
              <s.icon size={18} style={{ color:s.color }}/>
            </div>
            <div style={{ fontSize:26, fontWeight:800, color:C.ink, letterSpacing:"-0.02em" }}>{s.value}</div>
            <div style={{ fontSize:11, color:C.inkMd, marginTop:3 }}>{s.label}</div>
            <div className="mono" style={{ fontSize:9, color:s.color, marginTop:4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── THREATS + ACTIVITY ── */}
      <div style={{ display:"grid", gridTemplateColumns:"3fr 2fr", gap:20 }}>
        <div className="card" style={{ padding:20 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <ShieldAlert size={15} style={{ color:C.red }}/>
              <span style={{ fontSize:13, fontWeight:700, color:C.ink }}>Live Threat Feed</span>
            </div>
            <LiveDot/>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {THREATS.slice(0,4).map(t => {
              const sc = SEV_C[t.sev];
              return (
                <div key={t.id} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"10px 13px", borderRadius:10, background:C.bgPage, border:`1px solid ${C.border}`, borderLeft:`3px solid ${sc.c}` }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:3 }}>
                      <span style={{ fontSize:12, fontWeight:600, color:C.ink }}>{t.name}</span>
                      <Tag label={t.sev} color={sc.c} bg={sc.bg}/>
                    </div>
                    <p style={{ fontSize:11, color:C.inkMd, margin:0, lineHeight:1.5 }}>{t.desc.slice(0,80)}…</p>
                  </div>
                  <span className="mono" style={{ fontSize:9, color:C.inkLt, flexShrink:0 }}>{t.date}</span>
                </div>
              );
            })}
          </div>
          <button className="btn btn-ghost" onClick={() => setPage("threats")} style={{ marginTop:12, width:"100%", justifyContent:"center", fontSize:12 }}>
            View All Threats <ArrowRight size={12}/>
          </button>
        </div>

        <div className="card" style={{ padding:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
            <Activity size={15} style={{ color:C.teal }}/>
            <span style={{ fontSize:13, fontWeight:700, color:C.ink }}>Your Activity</span>
          </div>
          {isNew ? (
            <EmptyState icon={Rocket} title="No activity yet" desc="Complete a quiz or course to see your progress here." color={C.teal}
              action={
                <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center" }}>
                  <button className="btn btn-primary" onClick={() => setPage("quiz")} style={{ fontSize:11, padding:"7px 14px" }}><Brain size={12}/> Quiz</button>
                  <button className="btn btn-ghost" onClick={() => setPage("phishing")} style={{ fontSize:11, padding:"7px 14px" }}><Mail size={12}/> Phishing Sim</button>
                </div>
              }
            />
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {(user?.recentActivity||[]).slice(0,5).map((a,i) => (
                <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                  <div style={{ width:28, height:28, borderRadius:8, background:C.brandMd, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <CheckCircle size={13} style={{ color:C.brand }}/>
                  </div>
                  <div>
                    <p style={{ fontSize:11, color:C.inkMd, margin:0 }}>{a.msg || a}</p>
                    <p className="mono" style={{ fontSize:9, color:C.inkLt, margin:"2px 0 0" }}>{a.time || ""}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── NOTIFICATIONS (dismissible) ── */}
      {notifs.length > 0 && (
        <div className="card" style={{ padding:20 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <Bell size={15} style={{ color:C.amber }}/>
              <span style={{ fontSize:13, fontWeight:700, color:C.ink }}>Notifications</span>
              {notifs.filter(n => n.unread).length > 0 && (
                <Tag label={`${notifs.filter(n => n.unread).length} new`} color={C.amber} bg={C.amberLt}/>
              )}
            </div>
            <button onClick={() => setNotifs([])} style={{ fontSize:11, fontWeight:600, color:C.inkLt, background:"none", border:"none", cursor:"pointer" }}>Clear all</button>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {notifs.map(n => (
              <div key={n.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 13px", borderRadius:10, background:n.unread?n.color+"08":C.bgPage, border:`1px solid ${n.unread?n.color+"20":C.border}` }}>
                <div style={{ width:30, height:30, borderRadius:8, background:n.color+"14", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <n.icon size={13} style={{ color:n.color }}/>
                </div>
                <p style={{ fontSize:12, color:n.unread?C.ink:C.inkMd, flex:1, margin:0, fontWeight:n.unread?600:400 }}>{n.msg}</p>
                <span className="mono" style={{ fontSize:9, color:C.inkLt, flexShrink:0 }}>{n.time}</span>
                {n.unread && <div style={{ width:7, height:7, borderRadius:"50%", background:n.color, flexShrink:0 }}/>}
                {/* ← DISMISS BUTTON */}
                <button className="notif-dismiss" onClick={() => setNotifs(prev => prev.filter(x => x.id !== n.id))} title="Dismiss">
                  <X size={11}/>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// THREATS PAGE
// ══════════════════════════════════════════════════════════════════
function ThreatsPage() {
  const [filter, setFilter] = useState("All");
  const [exp, setExp] = useState(null);
  const list = THREATS.filter(t => filter === "All" || t.sev === filter);

  return (
    <div className="page-enter">
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
        <SectionHead title="Threat Intelligence" sub="Real-time IOCs, MITRE ATT&CK mapping, and security advisories"/>
        <LiveDot/>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
        {[["Critical",C.red,C.redLt,"2"],["High","#EA580C","#FFF7ED","5"],["Medium",C.amber,C.amberLt,"1"],["Low",C.green,C.greenLt,"0"]].map(([s,c,bg,n]) => (
          <div key={s} onClick={() => setFilter(filter === s ? "All" : s)}
            className="card card-click"
            style={{ padding:16, textAlign:"center", background:filter===s?bg:C.card, borderColor:filter===s?c+"40":C.border }}>
            <div style={{ fontSize:26, fontWeight:800, color:c }}>{n}</div>
            <div style={{ fontSize:11, color:C.inkMd, marginTop:3 }}>{s}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:7, marginBottom:18 }}>
        {["All","Critical","High","Medium","Low"].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            style={{ padding:"6px 14px", borderRadius:8, fontSize:11, fontWeight:600, cursor:"pointer", border:`1px solid ${filter===s?C.brand+"50":C.border}`, background:filter===s?C.brandMd:"transparent", color:filter===s?C.brand:C.inkMd, transition:"all .15s" }}>
            {s}
          </button>
        ))}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {list.map(t => {
          const sc = SEV_C[t.sev]; const open = exp === t.id;
          return (
            <div key={t.id} className="card" style={{ overflow:"hidden", borderLeft:`3px solid ${sc.c}` }}>
              <div style={{ padding:"13px 20px", cursor:"pointer", display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:16 }} onClick={() => setExp(open ? null : t.id)}>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5, flexWrap:"wrap" }}>
                    <span style={{ fontSize:13, fontWeight:600, color:C.ink }}>{t.name}</span>
                    <Tag label={t.sev} color={sc.c} bg={sc.bg}/>
                    <Tag label={t.type} color={C.inkMd} bg={C.bgPage}/>
                  </div>
                  <p style={{ fontSize:12, color:C.inkMd, margin:0 }}>{open ? t.desc : t.desc.slice(0,90)+"…"}</p>
                </div>
                <div style={{ display:"flex", gap:8, alignItems:"center", flexShrink:0 }}>
                  <span className="mono" style={{ fontSize:9, color:C.inkLt }}>{t.date}</span>
                  <div style={{ width:24, height:24, borderRadius:7, background:sc.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {open ? <ChevronUp size={12} style={{color:sc.c}}/> : <ChevronDown size={12} style={{color:sc.c}}/>}
                  </div>
                </div>
              </div>
              {open && (
                <div style={{ padding:"0 20px 16px", borderTop:`1px solid ${C.border}` }}>
                  <p style={{ fontSize:12, color:C.inkMd, lineHeight:1.75, margin:"14px 0" }}>{t.desc}</p>
                  <div style={{ display:"flex", gap:8 }}>
                    {["📋 Full Report","🔗 MITRE ATT&CK","⬇ IOCs"].map(b => (
                      <button key={b} className="btn btn-ghost" style={{ fontSize:11 }}>{b}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// LEARN PAGE
// ══════════════════════════════════════════════════════════════════
function LearnPage() {
  const courses = [
    { title:"Phishing Attack Recognition",   cat:"Phishing",    diff:"Beginner",     dur:"2h 30m", color:C.brand  },
    { title:"Advanced Malware Analysis",     cat:"Malware",     diff:"Advanced",     dur:"5h 15m", color:C.violet },
    { title:"Network Security Fundamentals", cat:"Network",     diff:"Intermediate", dur:"3h 45m", color:C.teal   },
    { title:"Social Engineering Defense",    cat:"Social Eng.", diff:"Intermediate", dur:"2h 00m", color:C.amber  },
    { title:"GDPR & India DPDP Act 2023",    cat:"Privacy",     diff:"Beginner",     dur:"1h 30m", color:C.green  },
    { title:"Zero Trust Architecture",       cat:"Network",     diff:"Advanced",     dur:"6h 00m", color:C.violet },
  ];
  const dc = { Advanced:[C.red,C.redLt], Intermediate:[C.amber,C.amberLt], Beginner:[C.green,C.greenLt] };

  return (
    <div className="page-enter">
      <SectionHead title="Learn" sub="Structured cybersecurity courses with real content, labs, and certification"/>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
        {courses.map((c,i) => (
          <div key={i} className="card card-click" style={{ overflow:"hidden" }}>
            <div style={{ height:80, background:`linear-gradient(135deg,${c.color}18,${c.color}08)`, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
              <div className="dotgrid" style={{ position:"absolute", inset:0, opacity:.4 }}/>
              <Shield size={32} style={{ color:c.color, opacity:.35 }}/>
              <div style={{ position:"absolute", top:10, right:10 }}>
                <Tag label={c.diff} color={dc[c.diff][0]} bg={dc[c.diff][1]}/>
              </div>
            </div>
            <div style={{ padding:16 }}>
              <span className="mono" style={{ fontSize:9, color:C.inkLt }}>{c.cat}</span>
              <p style={{ fontSize:13, fontWeight:700, color:C.ink, margin:"4px 0 8px", lineHeight:1.4 }}>{c.title}</p>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span className="mono" style={{ fontSize:10, color:C.inkMd }}><Clock size={9} style={{ display:"inline", marginRight:3 }}/>{c.dur}</span>
                <button className="btn btn-primary" style={{ fontSize:11, padding:"6px 14px" }}><Play size={10}/> Start</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// QUIZ PAGE
// ══════════════════════════════════════════════════════════════════
function QuizPage() {
  const quizzes = [
    { title:"Cybersecurity Fundamentals",    qs:10, time:"10 min", diff:"Intermediate", color:C.brand,  desc:"Core concepts, threat landscape, basic defense"   },
    { title:"Phishing & Social Engineering", qs:8,  time:"8 min",  diff:"Beginner",     color:C.teal,   desc:"Email analysis, red flags, manipulation tactics"  },
    { title:"Network Security Deep Dive",    qs:10, time:"12 min", diff:"Advanced",     color:C.violet, desc:"Firewalls, IDS/IPS, protocols, network attacks"   },
    { title:"Malware Analysis",              qs:7,  time:"10 min", diff:"Advanced",     color:C.red,    desc:"Static/dynamic analysis, reverse engineering"     },
    { title:"Incident Response",             qs:6,  time:"8 min",  diff:"Intermediate", color:"#EA580C",desc:"NIST framework, containment, eradication"         },
    { title:"Data Privacy & DPDP Act",       qs:5,  time:"6 min",  diff:"Beginner",     color:C.green,  desc:"GDPR, DPDP 2023, data classification, rights"     },
  ];
  const dc = { Advanced:[C.red,C.redLt], Intermediate:[C.amber,C.amberLt], Beginner:[C.green,C.greenLt] };

  return (
    <div className="page-enter">
      <SectionHead title="Quiz & Assessments" sub="Test your knowledge across all cybersecurity domains"/>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
        {quizzes.map((q,i) => (
          <div key={i} className="card" style={{ padding:20 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
              <div style={{ width:44, height:44, borderRadius:12, background:q.color+"12", border:`1px solid ${q.color}20`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Brain size={22} style={{ color:q.color }}/>
              </div>
              <Tag label={q.diff} color={dc[q.diff][0]} bg={dc[q.diff][1]}/>
            </div>
            <p style={{ fontSize:13, fontWeight:700, color:C.ink, margin:"0 0 5px" }}>{q.title}</p>
            <p style={{ fontSize:11, color:C.inkMd, margin:"0 0 10px", lineHeight:1.5 }}>{q.desc}</p>
            <div className="mono" style={{ display:"flex", gap:8, fontSize:9, color:C.inkLt, marginBottom:14 }}>
              <span>📝 {q.qs} questions</span><span>•</span><span>⏱ {q.time}</span>
            </div>
            <button className="btn btn-primary" style={{ width:"100%", justifyContent:"center", background:`linear-gradient(135deg,${q.color},${q.color}CC)`, boxShadow:`0 4px 14px ${q.color}30` }}>
              <Play size={12}/> Start Quiz
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// GAME PAGE
// ══════════════════════════════════════════════════════════════════
function GamePage() {
  return (
    <div className="page-enter" style={{ maxWidth:680, margin:"0 auto" }}>
      <div className="card" style={{ padding:"44px 40px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div className="dotgrid" style={{ position:"absolute", inset:0, opacity:.5 }}/>
        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ fontSize:60, marginBottom:14 }}>🛡️</div>
          <h2 style={{ fontSize:26, fontWeight:800, color:C.ink, marginBottom:8 }}>CyberDefense Game</h2>
          <p style={{ fontSize:13, color:C.inkMd, lineHeight:1.7, maxWidth:380, margin:"0 auto 24px" }}>
            Defend your network across 5 waves of escalating cyber attacks.<br/>Use real security tools — Firewall, Antivirus, Patches, MFA & more!
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, maxWidth:400, margin:"0 auto 24px" }}>
            {[["5 Waves","Escalating difficulty"],["5 Weapons","Real security tools"],["Score","Combo multipliers"]].map(([t,d]) => (
              <div key={t} style={{ background:C.bgPage, borderRadius:10, padding:12, border:`1px solid ${C.border}` }}>
                <p style={{ fontSize:12, fontWeight:700, color:C.ink, margin:"0 0 3px" }}>{t}</p>
                <p style={{ fontSize:10, color:C.inkMd, margin:0 }}>{d}</p>
              </div>
            ))}
          </div>
          <button className="btn btn-primary" style={{ fontSize:15, padding:"13px 36px", boxShadow:"0 8px 24px rgba(37,99,235,0.3)" }}>
            <Play size={16}/> Launch Game
          </button>
        </div>
      </div>
      <div className="card" style={{ padding:18, marginTop:14 }}>
        <p style={{ fontSize:11, fontWeight:700, color:C.inkMd, marginBottom:12, letterSpacing:"0.06em", textTransform:"uppercase" }}>Weapons Guide</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10 }}>
          {[["🛡️","Firewall","-25 HP",C.brand],["🦠","Antivirus","-40 HP",C.green],["🔧","Patch","-60 HP",C.amber],["🔑","MFA Block","-80 HP",C.violet],["⚡","Shutdown","-150 HP",C.red]].map(([icon,name,dmg,col]) => (
            <div key={name} style={{ textAlign:"center", background:C.bgPage, borderRadius:10, padding:"12px 8px", border:`1px solid ${col}15` }}>
              <div style={{ fontSize:22, marginBottom:5 }}>{icon}</div>
              <p style={{ fontSize:10, fontWeight:700, color:C.ink, margin:"0 0 2px" }}>{name}</p>
              <p className="mono" style={{ fontSize:9, color:col }}>{dmg}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// PHISHING SIM
// ══════════════════════════════════════════════════════════════════
function PhishingPage() {
  const [sel, setSel] = useState(null);
  const [ans, setAns] = useState({});
  const done = Object.keys(ans).length;
  const ok   = Object.values(ans).filter(a => a.ok).length;

  return (
    <div className="page-enter">
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
        <SectionHead title="Phishing Simulator" sub="Identify phishing attacks in real-world email samples"/>
        <div style={{ display:"flex", gap:10 }}>
          {[["Analyzed",`${done}/${PHISHING_EMAILS.length}`,C.brand],["Correct",ok,C.green],["Accuracy",done?Math.round(ok/done*100)+"%":"—",C.violet]].map(([l,v,c]) => (
            <div key={l} style={{ textAlign:"center", background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"10px 16px", boxShadow:C.shadow }}>
              <div style={{ fontSize:18, fontWeight:800, color:c }}>{v}</div>
              <div style={{ fontSize:10, color:C.inkMd }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"280px 1fr", gap:16 }}>
        <div className="card" style={{ overflow:"hidden" }}>
          <div style={{ padding:"12px 16px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ fontSize:12, fontWeight:700, color:C.ink }}>Inbox</span>
            <Tag label={`${PHISHING_EMAILS.filter(e=>!e.read).length} unread`} color={C.brand} bg={C.brandMd}/>
          </div>
          {PHISHING_EMAILS.map(email => {
            const a = ans[email.id];
            return (
              <div key={email.id} onClick={() => setSel(email)}
                style={{ padding:"12px 16px", borderBottom:`1px solid ${C.border}30`, cursor:"pointer", background:sel?.id===email.id?C.brandLt:"transparent", borderLeft:`3px solid ${sel?.id===email.id?C.brand:"transparent"}`, transition:"all .12s" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
                  <span style={{ fontSize:12, fontWeight:email.read?400:700, color:C.ink }}>{email.from}</span>
                  <span className="mono" style={{ fontSize:9, color:C.inkLt }}>{email.time}</span>
                </div>
                <p style={{ fontSize:11, color:C.inkMd, margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{email.subject}</p>
                {a && <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:4, fontSize:10, fontWeight:700, color:a.ok?C.green:C.red }}>
                  {a.ok?<CheckCircle size={10}/>:<XCircle size={10}/>} {a.ok?"Correct":"Incorrect"}
                </div>}
              </div>
            );
          })}
        </div>
        {sel ? (
          <div className="card" style={{ overflow:"hidden" }}>
            <div style={{ padding:"14px 20px", borderBottom:`1px solid ${C.border}`, background:sel.fish?C.redLt+"80":C.greenLt+"80" }}>
              <h4 style={{ fontSize:13, fontWeight:700, color:C.ink, margin:"0 0 5px" }}>{sel.subject}</h4>
              <div className="mono" style={{ display:"flex", gap:14, fontSize:10, color:C.inkMd }}>
                <span><strong style={{ color:C.inkMd }}>From:</strong> {sel.sender}</span><span>{sel.time}</span>
              </div>
            </div>
            <div style={{ padding:"18px 20px" }}>
              <pre style={{ fontSize:13, color:C.inkMd, whiteSpace:"pre-wrap", fontFamily:"Plus Jakarta Sans,sans-serif", lineHeight:1.75 }}>{sel.body}</pre>
            </div>
            {!ans[sel.id] ? (
              <div style={{ padding:"14px 20px", borderTop:`1px solid ${C.border}` }}>
                <p style={{ fontSize:12, fontWeight:700, color:C.ink, margin:"0 0 10px" }}>🔍 Is this email legitimate or phishing?</p>
                <div style={{ display:"flex", gap:10 }}>
                  <button className="btn" onClick={() => setAns(p => ({ ...p, [sel.id]:{ ok:sel.fish, pick:true } }))}
                    style={{ flex:1, justifyContent:"center", background:C.redLt, color:C.red, border:`1px solid ${C.red}30`, borderRadius:10 }}>🎣 Phishing</button>
                  <button className="btn" onClick={() => setAns(p => ({ ...p, [sel.id]:{ ok:!sel.fish, pick:false } }))}
                    style={{ flex:1, justifyContent:"center", background:C.greenLt, color:C.green, border:`1px solid ${C.green}30`, borderRadius:10 }}>✅ Legitimate</button>
                </div>
              </div>
            ) : (
              <div style={{ padding:"14px 20px", borderTop:`1px solid ${C.border}` }}>
                <div style={{ borderRadius:12, padding:"14px 16px", background:ans[sel.id].ok?C.greenLt:C.redLt, border:`1px solid ${ans[sel.id].ok?C.green+"30":C.red+"30"}` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, fontWeight:700, fontSize:13, marginBottom:10, color:ans[sel.id].ok?C.green:C.red }}>
                    {ans[sel.id].ok?<CheckCircle size={16}/>:<XCircle size={16}/>}
                    {ans[sel.id].ok?"🎯 Correct!":`❌ Incorrect — This was ${sel.fish?"PHISHING":"LEGITIMATE"}`}
                  </div>
                  {sel.fish && sel.flags.map((f,i) => (
                    <div key={i} style={{ display:"flex", gap:7, fontSize:11, color:C.inkMd, marginBottom:5 }}>
                      <AlertCircle size={12} style={{ color:C.red, flexShrink:0, marginTop:1 }}/>{f}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="card" style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
            <EmptyState icon={Mail} title="Select an email" desc="Click on any email to analyse it." color={C.brand}/>
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// REPORTS PAGE
// ══════════════════════════════════════════════════════════════════
function ReportsPage({ user, setPage }) {
  const hasData = (user?.quizzesDone ?? 0) > 0;

  if (!hasData) return (
    <div className="page-enter">
      <SectionHead title="Reports & Analytics" sub="Your performance insights will appear here as you progress"/>
      <div className="card" style={{ padding:60 }}>
        <EmptyState icon={BarChart2} title="No data yet" desc="Complete quizzes, courses and simulations to unlock your analytics." color={C.brand}
          action={<button className="btn btn-primary" style={{ marginTop:8 }} onClick={() => setPage("quiz")}><Rocket size={13}/> Start with a Quiz</button>}/>
      </div>
    </div>
  );

  const monthly = [
    {m:"Aug",s:65},{m:"Sep",s:72},{m:"Oct",s:78},{m:"Nov",s:68},{m:"Dec",s:83},{m:"Jan",s:user?.avgScore??91},
  ];
  return (
    <div className="page-enter">
      <SectionHead title="Reports & Analytics" sub="Your performance insights and security metrics"/>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        <div className="card" style={{ padding:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
            <BarChart2 size={15} style={{ color:C.brand }}/><span style={{ fontSize:13, fontWeight:700, color:C.ink }}>Quiz Performance</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
              <XAxis dataKey="m" tick={{ fontSize:10, fill:C.inkMd }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize:10, fill:C.inkMd }} axisLine={false} tickLine={false} domain={[0,100]}/>
              <Tooltip content={<TT/>}/>
              <ReBar dataKey="s" name="Score" fill={C.brand} radius={[6,6,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card" style={{ padding:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
            <Target size={15} style={{ color:C.teal }}/><span style={{ fontSize:13, fontWeight:700, color:C.ink }}>Domain Mastery</span>
          </div>
          {[
            {label:"Phishing",  pct:user?.phishingScore??0, color:C.brand },
            {label:"Malware",   pct:user?.malwareScore ??0, color:C.violet},
            {label:"Network",   pct:user?.networkScore ??0, color:C.teal  },
            {label:"Privacy",   pct:user?.privacyScore ??0, color:C.green },
          ].map((d,i) => (
            <div key={i} style={{ marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:5 }}>
                <span style={{ color:C.inkMd }}>{d.label}</span>
                <span className="mono" style={{ fontWeight:600, color:d.color }}>{d.pct}%</span>
              </div>
              <Prog pct={d.pct} color={d.color} h={6}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// LEADERBOARD — Real API data, user's real points
// ══════════════════════════════════════════════════════════════════
function LeaderboardPage({ user }) {
  const { data: lbData, loading, reload } = useLeaderboard();
  const myId   = user?._id || user?.id;
  const myName = dName(user);

  // Inject current user if not already present
  const fullData = (() => {
    if (!lbData.length) return [];
    const hasMe = lbData.some(u => (u._id || u.id) === myId || dName(u) === myName);
    const base   = lbData.slice(0, 10);
    if (!hasMe && user) {
      const entry = {
        _id: myId, name: myName, department: user?.department || user?.dept || "InfoSec",
        score: user?.score ?? 0, level: user?.level ?? 1, streak: user?.streak ?? 0, isMe: true,
      };
      return [...base, entry].sort((a,b) => (b.score||0) - (a.score||0)).map((u,i) => ({ ...u, rank: i+1 }));
    }
    return base.map((u,i) => ({ ...u, rank:i+1, isMe:(u._id||u.id)===myId || dName(u)===myName }));
  })();

  const top3 = fullData.slice(0, 3);

  return (
    <div className="page-enter">
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
        <SectionHead title="Leaderboard" sub="Top cybersecurity defenders — real scores, updated live"/>
        <button className="btn btn-ghost" onClick={reload} style={{ fontSize:12, gap:6 }}>
          <RefreshCw size={13} className={loading?"spin":""}/> Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height:60 }}/>)}
        </div>
      ) : fullData.length === 0 ? (
        <div className="card" style={{ padding:60 }}>
          <EmptyState icon={Trophy} title="No data yet" desc="Leaderboard will populate as users complete activities." color={C.amber}
            action={<button className="btn btn-ghost" onClick={reload} style={{ marginTop:4 }}><RefreshCw size={13}/> Try Again</button>}/>
        </div>
      ) : (
        <>
          {/* Podium — top 3 */}
          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"center", gap:20, marginBottom:28 }}>
            {[top3[1], top3[0], top3[2]].filter(Boolean).map((u,i) => {
              const h = [130,170,110][i];
              const medals = ["🥈","🥇","🥉"];
              const cols   = [C.inkLt, C.amber, "#B45309"];
              const pIdx   = i; // podium index
              return (
                <div key={u.rank||i} style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                  {i===1 && <Tag label="👑 RANK 1" color={C.amber} bg={C.amberLt}/>}
                  <div style={{ marginTop:8, marginBottom:8 }}>
                    <Avatar name={dName(u)} size={50} fontSize={16}/>
                  </div>
                  <p style={{ fontSize:12, fontWeight:700, color:C.ink, marginBottom:2 }}>{dName(u).split(" ")[0]}</p>
                  <p className="mono" style={{ fontSize:10, color:C.inkMd, marginBottom:8 }}>{(u.score||0).toLocaleString()} pts</p>
                  <div style={{ background:cols[pIdx]+"18", border:`2px solid ${cols[pIdx]}30`, borderRadius:"10px 10px 0 0", width:76, height:h, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>{medals[i]}</div>
                </div>
              );
            })}
          </div>

          {/* Full table */}
          <div className="card" style={{ overflow:"hidden" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ background:C.bgPage }}>
                  {["#","User","Score","Level","Streak"].map(h => (
                    <th key={h} style={{ textAlign:"left", fontSize:9, fontWeight:700, color:C.inkLt, padding:"10px 16px", letterSpacing:"0.08em", textTransform:"uppercase", fontFamily:"Fira Code" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fullData.map(u => (
                  <tr key={u._id||u.id||u.name} className={u.isMe?"":"stripe-row"} style={{ borderTop:`1px solid ${C.border}30`, background:u.isMe?C.brandMd:"" }}>
                    <td style={{ padding:"12px 16px" }}>
                      <div style={{ width:26, height:26, borderRadius:7, background:u.rank<=3?C.amberLt:C.bgPage, border:`1px solid ${u.rank<=3?C.amber+"40":C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:u.rank<=3?C.amber:C.inkMd, fontFamily:"Fira Code" }}>{u.rank}</div>
                    </td>
                    <td style={{ padding:"12px 16px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                        <Avatar name={dName(u)} size={32} fontSize={11}/>
                        <div>
                          <p style={{ fontSize:12, fontWeight:600, color:C.ink, margin:0 }}>
                            {dName(u)}{u.isMe && <span style={{ fontSize:9, color:C.brand, marginLeft:5, fontWeight:700 }}>(You)</span>}
                          </p>
                          <p style={{ fontSize:10, color:C.inkMd, margin:"1px 0 0" }}>{u.dept || u.department || "InfoSec"}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding:"12px 16px" }}>
                      <span style={{ fontSize:14, fontWeight:800, color:u.isMe?C.brand:C.ink }}>{(u.score||0).toLocaleString()}</span>
                    </td>
                    <td style={{ padding:"12px 16px" }}>
                      <span className="mono" style={{ fontSize:10, fontWeight:600, color:C.violet }}>Lv.{u.level||1}</span>
                    </td>
                    <td style={{ padding:"12px 16px" }}>
                      <span className="mono" style={{ fontSize:10, color:(u.streak||0)>=14?C.red:C.inkMd }}>{(u.streak||0)>=3?"🔥":""}{u.streak||0}d</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// PROFILE PAGE — No department field, better avatar
// ══════════════════════════════════════════════════════════════════
function ProfilePage({ user }) {
  const [editing, setEditing]     = useState(false);
  const [saving, setSaving]       = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || null);
  const [coverUrl, setCoverUrl]   = useState(user?.coverImage || null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover]   = useState(false);
  const [form, setForm] = useState({
    name:  dName(user),
    email: user?.email || "",
    phone: user?.phone || "",
    city:  user?.city  || "",
    role:  user?.role  || "",
  });

  const save = async () => {
    setSaving(true);
    try { await apiFetch("/api/me", { method:"PUT", body:JSON.stringify(form) }); setEditing(false); }
    catch(e) { alert("Could not save: "+e.message); }
    finally  { setSaving(false); }
  };

  // Upload image to backend as base64 or multipart
  const uploadImage = async (file, type) => {
    const isAvatar = type === "avatar";
    if (isAvatar) setUploadingAvatar(true); else setUploadingCover(true);
    try {
      // Preview immediately (local)
      const reader = new FileReader();
      reader.onload = e => {
        if (isAvatar) setAvatarUrl(e.target.result);
        else setCoverUrl(e.target.result);
      };
      reader.readAsDataURL(file);

      // Upload to backend
      const fd = new FormData();
      fd.append("image", file);
      fd.append("type", type);
      const token = getToken();
      const res = await fetch(`${API_URL}/api/upload-profile-image`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
      if (res.ok) {
        const data = await res.json();
        const url = data.url || data.imageUrl || data.avatar;
        if (url) { if (isAvatar) setAvatarUrl(url); else setCoverUrl(url); }
      }
    } catch { /* keep local preview even if upload fails */ }
    finally { if (isAvatar) setUploadingAvatar(false); else setUploadingCover(false); }
  };

  const pickFile = (type) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png,image/jpeg,image/webp";
    input.onchange = e => { if (e.target.files[0]) uploadImage(e.target.files[0], type); };
    input.click();
  };

  const name     = dName(user);
  const hasStats = (user?.quizzesDone ?? 0) > 0;

  return (
    <div className="page-enter" style={{ maxWidth:820 }}>
      <SectionHead title="My Profile" sub="Your account information and achievements"/>

      {/* ── BANNER + AVATAR — overflow:visible so avatar is NOT clipped ── */}
      <div className="card" style={{ marginBottom:20, overflow:"visible", position:"relative" }}>

        {/* Cover image */}
        <div style={{ height:110, borderRadius:"16px 16px 0 0", position:"relative", overflow:"hidden",
          background: coverUrl ? "transparent" : C.gradBrand }}>
          {coverUrl
            ? <img src={coverUrl} alt="cover" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
            : <div className="dotgrid" style={{ position:"absolute", inset:0, opacity:.15 }}/>
          }
          {/* Cover upload button */}
          <button onClick={() => pickFile("cover")} disabled={uploadingCover}
            style={{ position:"absolute", bottom:10, right:12, display:"flex", alignItems:"center", gap:6,
              padding:"5px 11px", borderRadius:8, fontSize:11, fontWeight:600, cursor:"pointer",
              background:"rgba(255,255,255,0.85)", backdropFilter:"blur(6px)",
              border:"1px solid rgba(255,255,255,0.6)", color:C.inkMd, boxShadow:C.shadow }}>
            {uploadingCover
              ? <><Loader2 size={11} className="spin"/> Uploading…</>
              : <><ImagePlus size={11}/> Change Cover</>
            }
          </button>
        </div>

        {/* Avatar — positioned over the border, NOT inside overflow:hidden */}
        <div style={{ position:"absolute", left:24, top:110, transform:"translateY(-50%)", zIndex:10 }}>
          <div style={{ position:"relative", display:"inline-block" }}>
            {/* Avatar circle */}
            <div style={{ width:80, height:80, borderRadius:"50%",
              border:`4px solid ${C.card}`, boxShadow:C.shadowMd,
              overflow:"hidden", background:C.card,
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              {avatarUrl
                ? <img src={avatarUrl} alt="avatar" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                : <Avatar name={name} size={80} fontSize={26}/>
              }
            </div>
            {/* Camera icon overlay */}
            <button onClick={() => pickFile("avatar")} disabled={uploadingAvatar}
              style={{ position:"absolute", bottom:2, right:2, width:26, height:26, borderRadius:"50%",
                background:C.brand, border:`2px solid ${C.card}`, cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:"0 2px 8px rgba(37,99,235,0.4)" }}>
              {uploadingAvatar
                ? <Loader2 size={12} style={{ color:"#fff" }} className="spin"/>
                : <Camera size={11} style={{ color:"#fff" }}/>
              }
            </button>
          </div>
        </div>

        {/* Content below banner — extra top padding to clear the avatar */}
        <div style={{ padding:"50px 24px 24px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"flex-end", marginBottom:10 }}>
            <button onClick={() => editing ? save() : setEditing(true)} disabled={saving}
              style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 16px", borderRadius:10, fontSize:12, fontWeight:600,
                border:`1px solid ${editing?C.teal+"40":C.border}`, background:editing?C.tealLt:C.bgPage,
                color:editing?C.teal:C.inkMd, cursor:"pointer" }}>
              {saving?<><Loader2 size={12} className="spin"/> Saving…</>:editing?<><Save size={12}/> Save</>:<><Edit size={12}/> Edit Profile</>}
            </button>
          </div>
          <h2 style={{ fontSize:18, fontWeight:800, color:C.ink, margin:"0 0 3px" }}>{name}</h2>
          <p style={{ fontSize:12, color:C.inkMd, margin:"0 0 10px" }}>{user?.role || "Security Analyst"}</p>
          <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
            <Tag label={`Lv.${user?.level??1}`}  color={C.violet} bg={C.violetLt}/>
            <Tag label={`${user?.xp??0} XP`}     color={C.amber}  bg={C.amberLt}/>
            {(user?.streak??0)>0 && <Tag label={`🔥 ${user.streak}d streak`} color={C.red} bg={C.redLt}/>}
          </div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        {/* Personal info — NO department */}
        <div className="card" style={{ padding:22 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <User size={14} style={{ color:C.brand }}/><span style={{ fontSize:13, fontWeight:700, color:C.ink }}>Personal Info</span>
            </div>
            {editing && <button onClick={() => setEditing(false)} style={{ background:"none", border:"none", cursor:"pointer", color:C.inkLt }}><X size={14}/></button>}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {[["Full Name","name"],["Email","email"],["Phone","phone"],["City","city"],["Role","role"]].map(([label,field]) => (
              <div key={field}>
                <label className="mono" style={{ fontSize:9, color:C.inkLt, display:"block", marginBottom:4, letterSpacing:"0.07em", textTransform:"uppercase" }}>{label}</label>
                {editing ? (
                  <input value={form[field]||""} onChange={e => setForm(p => ({ ...p, [field]:e.target.value }))}
                    style={{ width:"100%", padding:"8px 11px", borderRadius:9, border:`1.5px solid ${C.border}`, fontSize:12, background:C.bgPage, color:C.ink, boxSizing:"border-box" }}
                    onFocus={e => e.target.style.borderColor = C.brand+"60"}
                    onBlur={e => e.target.style.borderColor = C.border}/>
                ) : (
                  <p style={{ fontSize:13, fontWeight:500, color:form[field]?C.inkMd:C.inkLt, margin:0, fontStyle:form[field]?"normal":"italic" }}>
                    {form[field] || "Not set"}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {/* Stats */}
          <div className="card" style={{ padding:20 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
              <Activity size={14} style={{ color:C.amber }}/><span style={{ fontSize:13, fontWeight:700, color:C.ink }}>Stats</span>
            </div>
            {hasStats ? (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                {[["Score",user?.score??0,C.brand],["Quizzes",user?.quizzesDone??0,C.violet],["Avg Score",user?.avgScore?user.avgScore+"%":"—",C.teal],["Streak",`${user?.streak??0}d`,C.amber]].map(([l,v,c]) => (
                  <div key={l} style={{ background:c+"10", border:`1px solid ${c}18`, borderRadius:10, padding:12, textAlign:"center" }}>
                    <div style={{ fontSize:20, fontWeight:800, color:c }}>{v}</div>
                    <div style={{ fontSize:10, color:C.inkMd, marginTop:3 }}>{l}</div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon={TrendingUp} title="No stats yet" desc="Complete activities to see your stats." color={C.amber}/>
            )}
          </div>

          {/* Badges */}
          <div className="card" style={{ padding:20, flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
              <Award size={14} style={{ color:C.teal }}/><span style={{ fontSize:13, fontWeight:700, color:C.ink }}>Badges</span>
            </div>
            {hasStats && (user?.badges||[]).length > 0 ? (
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {(user.badges||[]).map((b,i) => (
                  <div key={i} style={{ textAlign:"center", padding:"10px 12px", background:C.amberLt, border:`1px solid ${C.amber}20`, borderRadius:10 }}>
                    <div style={{ fontSize:20 }}>{b.emoji||"🏅"}</div>
                    <p style={{ fontSize:9, color:C.inkMd, marginTop:4 }}>{b.label||b}</p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon={Award} title="No badges yet" desc="Complete challenges to earn badges." color={C.teal}/>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// SETTINGS
// ══════════════════════════════════════════════════════════════════
function SettingsPage({ user }) {
  const [showPass, setShowPass] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [delModal, setDelModal] = useState(false);
  const [notifs, setNotifs]     = useState({ email:true, push:true, threats:true });
  const [form, setForm] = useState({ name:dName(user), email:user?.email||"", phone:user?.phone||"" });

  const Toggle = ({ on, onChange, color=C.brand }) => (
    <button onClick={() => onChange(!on)} style={{ position:"relative", width:42, height:22, borderRadius:99, border:"none", cursor:"pointer", padding:0, background:on?color:C.borderMd, transition:"background .2s", flexShrink:0 }}>
      <span style={{ position:"absolute", top:3, left:on?22:3, width:16, height:16, borderRadius:"50%", background:"#fff", boxShadow:"0 1px 4px rgba(0,0,0,.2)", transition:"left .2s" }}/>
    </button>
  );

  return (
    <div className="page-enter" style={{ maxWidth:640 }}>
      <SectionHead title="Settings" sub="Manage your account and preferences"/>

      <div className="card" style={{ padding:22, marginBottom:14 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:18 }}><User size={14} style={{ color:C.brand }}/><span style={{ fontSize:13, fontWeight:700, color:C.ink }}>Account</span></div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
          {[["Full Name","name"],["Email","email"],["Phone","phone"]].map(([l,f]) => (
            <div key={f}>
              <label className="mono" style={{ fontSize:9, color:C.inkLt, display:"block", marginBottom:4, letterSpacing:"0.07em", textTransform:"uppercase" }}>{l}</label>
              <input value={form[f]||""} onChange={e => setForm(p => ({ ...p, [f]:e.target.value }))}
                style={{ width:"100%", padding:"8px 11px", borderRadius:9, border:`1.5px solid ${C.border}`, fontSize:12, background:C.bgPage, color:C.ink, boxSizing:"border-box" }}
                onFocus={e => e.target.style.borderColor = C.brand+"60"}
                onBlur={e => e.target.style.borderColor = C.border}/>
            </div>
          ))}
        </div>
        <div style={{ marginBottom:16 }}>
          <label className="mono" style={{ fontSize:9, color:C.inkLt, display:"block", marginBottom:4, letterSpacing:"0.07em", textTransform:"uppercase" }}>New Password</label>
          <div style={{ position:"relative" }}>
            <input type={showPass?"text":"password"} placeholder="••••••••" style={{ width:"100%", padding:"8px 38px 8px 11px", borderRadius:9, border:`1.5px solid ${C.border}`, fontSize:12, background:C.bgPage, color:C.ink, boxSizing:"border-box" }}/>
            <button onClick={() => setShowPass(!showPass)} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:C.inkLt }}>
              {showPass?<EyeOff size={13}/>:<Eye size={13}/>}
            </button>
          </div>
        </div>
        <button className="btn btn-primary" disabled={saving}
          onClick={async () => { setSaving(true); try { await apiFetch("/api/me",{method:"PUT",body:JSON.stringify(form)}); } catch(e){alert(e.message);} finally{setSaving(false);} }}>
          {saving?<><Loader2 size={12} className="spin"/> Saving…</>:<><Save size={12}/> Save Changes</>}
        </button>
      </div>

      <div className="card" style={{ padding:22, marginBottom:14 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:18 }}><Bell size={14} style={{ color:C.amber }}/><span style={{ fontSize:13, fontWeight:700, color:C.ink }}>Notifications</span></div>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {[{k:"email",l:"Email Alerts",d:"Security alerts via email"},{k:"push",l:"Push Notifications",d:"Browser & mobile"},{k:"threats",l:"Threat Alerts",d:"Critical threat intel"}].map(it => (
            <div key={it.k} style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div><p style={{ fontSize:12, fontWeight:500, color:C.ink, margin:0 }}>{it.l}</p><p style={{ fontSize:11, color:C.inkMd, margin:"1px 0 0" }}>{it.d}</p></div>
              <Toggle on={notifs[it.k]} onChange={v => setNotifs(n => ({ ...n, [it.k]:v }))}/>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding:22, border:`1px solid ${C.red}25` }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}><AlertTriangle size={14} style={{ color:C.red }}/><span style={{ fontSize:13, fontWeight:700, color:C.red }}>Danger Zone</span></div>
        <p style={{ fontSize:12, color:C.inkMd, marginBottom:14 }}>Deleting your account is permanent and cannot be undone.</p>
        <button onClick={() => setDelModal(true)} style={{ display:"flex", alignItems:"center", gap:7, padding:"9px 16px", borderRadius:9, fontSize:12, fontWeight:600, border:`1px solid ${C.red}25`, cursor:"pointer", background:C.redLt, color:C.red }}>
          <Trash2 size={12}/> Delete Account
        </button>
      </div>

      {delModal && (
        <div style={{ position:"fixed", inset:0, zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(15,23,42,0.4)", backdropFilter:"blur(4px)" }}>
          <div className="card" style={{ padding:28, maxWidth:340, width:"100%" }}>
            <AlertTriangle size={28} style={{ color:C.red, marginBottom:14 }}/>
            <h3 style={{ fontSize:16, fontWeight:800, color:C.ink, margin:"0 0 8px" }}>Delete Account?</h3>
            <p style={{ fontSize:12, color:C.inkMd, margin:"0 0 22px" }}>All data, XP, and certificates will be permanently deleted.</p>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setDelModal(false)} className="btn btn-ghost" style={{ flex:1, justifyContent:"center" }}>Cancel</button>
              <button style={{ flex:1, padding:11, borderRadius:10, fontSize:12, fontWeight:700, border:"none", cursor:"pointer", background:C.red, color:"#fff" }}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// NOTIFICATIONS DRAWER
// ══════════════════════════════════════════════════════════════════
function NotifsDrawer({ open, onClose, notifs, setNotifs }) {
  return (
    <>
      {open && <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:40, background:"rgba(15,23,42,0.25)", backdropFilter:"blur(2px)" }}/>}
      <div style={{ position:"fixed", top:0, right:0, height:"100%", zIndex:50, width:350, background:C.card, boxShadow:C.shadowLg, border:`1px solid ${C.border}`, transform:open?"translateX(0)":"translateX(100%)", transition:"transform .28s cubic-bezier(.4,0,.2,1)", display:"flex", flexDirection:"column" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", borderBottom:`1px solid ${C.border}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:9 }}>
            <span style={{ fontSize:14, fontWeight:700, color:C.ink }}>Notifications</span>
            {notifs.filter(n=>n.unread).length>0 && <Tag label={`${notifs.filter(n=>n.unread).length}`} color={C.red} bg={C.redLt}/>}
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:C.inkMd }}><X size={17}/></button>
        </div>
        <div style={{ padding:"8px 20px", borderBottom:`1px solid ${C.border}`, display:"flex", gap:12 }}>
          <button onClick={() => setNotifs(l => l.map(x=>({...x,unread:false})))} style={{ fontSize:11, fontWeight:600, color:C.brand, background:"none", border:"none", cursor:"pointer" }}>Mark all read</button>
          <button onClick={() => setNotifs([])} style={{ fontSize:11, fontWeight:600, color:C.red, background:"none", border:"none", cursor:"pointer" }}>Clear all</button>
        </div>
        <div style={{ flex:1, overflowY:"auto" }}>
          {notifs.length === 0 ? (
            <EmptyState icon={Bell} title="No notifications" desc="You're all caught up!" color={C.inkLt}/>
          ) : notifs.map(n => (
            <div key={n.id} style={{ display:"flex", alignItems:"flex-start", gap:11, padding:"13px 20px", borderBottom:`1px solid ${C.border}20`, background:n.unread?n.color+"06":"transparent" }}>
              <div style={{ width:30, height:30, borderRadius:8, background:n.color+"14", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <n.icon size={13} style={{ color:n.color }}/>
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:12, fontWeight:n.unread?600:400, color:n.unread?C.ink:C.inkMd, margin:"0 0 2px", lineHeight:1.4 }}>{n.msg}</p>
                <p className="mono" style={{ fontSize:9, color:C.inkLt }}>{n.time}</p>
              </div>
              {n.unread && <div style={{ width:7, height:7, borderRadius:"50%", background:n.color, flexShrink:0, marginTop:5 }}/>}
              {/* DISMISS X */}
              <button className="notif-dismiss" onClick={() => setNotifs(prev => prev.filter(x => x.id !== n.id))} title="Dismiss">
                <X size={11}/>
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════
// LOADER
// ══════════════════════════════════════════════════════════════════
function Loader() {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:C.bg, flexDirection:"column", gap:16 }}>
      <div style={{ width:52, height:52, borderRadius:14, background:C.gradBrand, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 8px 24px rgba(37,99,235,0.3)" }}>
        <Shield size={26} style={{ color:"#fff" }}/>
      </div>
      <div style={{ display:"flex", gap:5 }}>
        {[0,1,2].map(i => <div key={i} style={{ width:6, height:6, borderRadius:"50%", background:C.brand, opacity:.35, animation:`pulse 1.2s ease ${i*.2}s infinite` }}/>)}
      </div>
      <p className="mono" style={{ fontSize:11, color:C.inkMd, letterSpacing:"0.08em" }}>Loading your dashboard…</p>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// ROOT APP
// ══════════════════════════════════════════════════════════════════
export default function App() {
  const { user, loading } = useUser();
  const [page, setPage]   = useState("dashboard");
  const [sideOpen, setSideOpen]   = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [notifs, setNotifs]       = useState(INITIAL_NOTIFS);

  const unread = notifs.filter(n => n.unread).length;
  const name   = dName(user);
  const fname  = name.split(" ")[0];

  const PAGES = {
    dashboard:   <DashboardPage   user={user} setPage={setPage} notifs={notifs} setNotifs={setNotifs}/>,
    threats:     <ThreatsPage/>,
    learn:       <LearnPage/>,
    phishing:    <PhishingPage/>,
    quiz:        <QuizPage/>,
    game:        <GamePage/>,
    reports:     <ReportsPage     user={user} setPage={setPage}/>,
    leaderboard: <LeaderboardPage user={user}/>,
    profile:     <ProfilePage     user={user}/>,
    settings:    <SettingsPage    user={user}/>,
  };

  if (loading) return <><G/><Loader/></>;

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", background:C.bg }}>
      <G/>

      {/* ── SIDEBAR ── */}
      <aside style={{ display:"flex", flexDirection:"column", height:"100%", flexShrink:0, width:sideOpen?224:58, transition:"width .28s cubic-bezier(.4,0,.2,1)", background:C.sidebar, borderRight:`1px solid ${C.border}`, boxShadow:"2px 0 8px rgba(15,23,42,0.04)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"15px 14px", borderBottom:`1px solid ${C.border}`, height:60 }}>
          <div style={{ width:32, height:32, borderRadius:9, background:C.gradBrand, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 4px 12px rgba(37,99,235,0.28)" }}>
            <Shield size={16} style={{ color:"#fff" }}/>
          </div>
          {sideOpen && <span style={{ fontWeight:800, fontSize:15, color:C.ink, letterSpacing:"-0.02em", whiteSpace:"nowrap" }}>CyberShield</span>}
        </div>

        <nav style={{ flex:1, overflowY:"auto", padding:"10px 7px" }}>
          {[NAV.slice(0,6), NAV.slice(6)].map((group,gi) => (
            <div key={gi}>
              {gi > 0 && <div style={{ height:1, background:C.border, margin:"6px 4px" }}/>}
              {group.map(item => {
                const active = page === item.id;
                return (
                  <button key={item.id} onClick={() => setPage(item.id)} title={!sideOpen ? item.label : ""}
                    className={`nav-btn ${active ? "active" : ""}`}
                    style={{ justifyContent:sideOpen?"flex-start":"center", marginBottom:2 }}>
                    {active && <div style={{ position:"absolute", left:0, top:"50%", transform:"translateY(-50%)", width:3, height:20, background:C.brand, borderRadius:"0 3px 3px 0" }}/>}
                    <item.icon size={16} style={{ flexShrink:0 }}/>
                    {sideOpen && <span style={{ whiteSpace:"nowrap" }}>{item.label}</span>}
                    {item.badge && sideOpen && <span className="mono" style={{ marginLeft:"auto", background:C.tealLt, color:C.teal, fontSize:8, fontWeight:700, padding:"1px 5px", borderRadius:4 }}>{item.badge}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div style={{ padding:"8px 7px", borderTop:`1px solid ${C.border}` }}>
          <button onClick={() => setSideOpen(!sideOpen)} className="nav-btn" style={{ justifyContent:sideOpen?"flex-start":"center" }}>
            {sideOpen ? <><ChevronLeft size={14}/><span>Collapse</span></> : <ChevronRight size={14}/>}
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div style={{ display:"flex", flexDirection:"column", flex:1, overflow:"hidden" }}>
        <header style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 20px", height:60, flexShrink:0, background:C.card, borderBottom:`1px solid ${C.border}`, boxShadow:"0 1px 6px rgba(15,23,42,0.05)" }}>
          <div style={{ position:"relative", width:260 }}>
            <Search size={13} style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:C.inkLt }}/>
            <input placeholder="Search threats, courses…" style={{ width:"100%", paddingLeft:32, paddingRight:12, paddingTop:8, paddingBottom:8, borderRadius:9, border:`1px solid ${C.border}`, fontSize:12, background:C.bgPage, color:C.ink, boxSizing:"border-box" }}/>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:8, background:C.greenLt, border:`1px solid ${C.green}20` }}>
              <div style={{ width:5, height:5, borderRadius:"50%", background:C.green, animation:"pulse 2s infinite" }}/>
              <span className="mono" style={{ fontSize:9, fontWeight:700, color:C.green, letterSpacing:"0.08em" }}>SECURE</span>
            </div>

            <button onClick={() => setNotifOpen(!notifOpen)}
              style={{ position:"relative", padding:7, borderRadius:9, border:`1px solid ${C.border}`, cursor:"pointer", background:C.bgPage, transition:"all .15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.borderMd}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
              <Bell size={15} style={{ color:C.inkMd }}/>
              {unread > 0 && <span style={{ position:"absolute", top:2, right:2, width:16, height:16, borderRadius:"50%", background:C.red, color:"#fff", fontSize:8, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Fira Code" }}>{unread}</span>}
            </button>

            <div style={{ position:"relative" }}>
              <button onClick={() => setMenuOpen(!menuOpen)}
                style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 9px", borderRadius:9, border:`1px solid ${C.border}`, cursor:"pointer", background:C.bgPage, transition:"all .15s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.borderMd}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                <Avatar name={name} size={28} fontSize={10}/>
                <span style={{ fontSize:12, fontWeight:600, color:C.inkMd }}>{fname}</span>
                <ChevronDown size={11} style={{ color:C.inkLt }}/>
              </button>

              {menuOpen && (
                <div style={{ position:"absolute", right:0, top:"calc(100% + 8px)", width:195, background:C.card, borderRadius:13, boxShadow:C.shadowLg, border:`1px solid ${C.border}`, zIndex:50, overflow:"hidden", animation:"fadeIn .15s ease" }}>
                  <div style={{ padding:"11px 14px", borderBottom:`1px solid ${C.border}` }}>
                    <p style={{ fontSize:12, fontWeight:700, color:C.ink, margin:0 }}>{name}</p>
                    <p className="mono" style={{ fontSize:10, color:C.inkMd, margin:"1px 0 0" }}>{user?.email||""}</p>
                  </div>
                  {[{l:"Profile",I:User,p:"profile"},{l:"Settings",I:Settings,p:"settings"}].map(it => (
                    <button key={it.l} onClick={() => { setPage(it.p); setMenuOpen(false); }}
                      style={{ width:"100%", display:"flex", alignItems:"center", gap:9, padding:"9px 14px", fontSize:12, color:C.inkMd, border:"none", cursor:"pointer", background:"transparent", textAlign:"left", fontFamily:"Plus Jakarta Sans", transition:"background .12s" }}
                      onMouseEnter={e => e.currentTarget.style.background = C.bgPage}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <it.I size={12}/>{it.l}
                    </button>
                  ))}
                  <div style={{ borderTop:`1px solid ${C.border}` }}>
                    <button onClick={handleLogout}
                      style={{ width:"100%", display:"flex", alignItems:"center", gap:9, padding:"9px 14px", fontSize:12, color:C.red, border:"none", cursor:"pointer", background:"transparent", textAlign:"left", fontFamily:"Plus Jakarta Sans" }}
                      onMouseEnter={e => e.currentTarget.style.background = C.redLt}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <LogOut size={12}/> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main style={{ flex:1, overflowY:"auto", padding:22, background:C.bg }}>
          <div key={page} className="page-enter">{PAGES[page]}</div>
        </main>
      </div>

      <NotifsDrawer open={notifOpen} onClose={() => setNotifOpen(false)} notifs={notifs} setNotifs={setNotifs}/>
      {menuOpen && <div onClick={() => setMenuOpen(false)} style={{ position:"fixed", inset:0, zIndex:40 }}/>}
    </div>
  );
}