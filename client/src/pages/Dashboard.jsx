import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboardUser } from './hooks/useDashboardUser';
import { saveGameScore } from '../utils/saveGameScore';
import {
  Shield, Brain, Mail, BarChart2, Bell, Search,
  Zap, X, Award, Activity, CheckCircle,
  Gamepad2, GraduationCap, ShieldAlert, Flame,
  Loader2, RefreshCw, Star, TrendingUp, TrendingDown,
  AlertTriangle, Eye, Lock, Unlock,
  FileText, User, Camera, Key,
  Phone, MapPin, Save,
  CheckCircle2, AlertCircle, Home,
  Settings, LogOut, ChevronRight, ChevronLeft, Plus,
  Rocket, Trophy, Medal, Crown,
  Filter, FileDown, Send, EyeOff, Edit3,
  Clock, ArrowUpRight
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from "recharts";

// ─── THEME (LIGHT) ────────────────────────────────────────────────────────────
const T = {
  bg:          "#F0F2F8",
  surface:     "#FFFFFF",
  surfaceHov:  "#F5F7FF",
  card:        "#FFFFFF",
  border:      "rgba(99,102,241,0.14)",
  borderHov:   "rgba(99,102,241,0.32)",
  brand:       "#4F46E5",
  brandDark:   "#3730A3",
  brandGlow:   "rgba(79,70,229,0.18)",
  teal:        "#0D9488",
  tealDim:     "rgba(13,148,136,0.10)",
  violet:      "#7C3AED",
  amber:       "#D97706",
  amberDim:    "rgba(217,119,6,0.10)",
  red:         "#DC2626",
  redDim:      "rgba(220,38,38,0.08)",
  green:       "#059669",
  greenDim:    "rgba(5,150,105,0.10)",
  pink:        "#DB2777",
  pinkDim:     "rgba(219,39,119,0.10)",
  text:        "#111827",
  textMd:      "#4B5563",
  textDim:     "#9CA3AF",
  sh:          "0 1px 4px rgba(0,0,0,0.07)",
  shMd:        "0 4px 20px rgba(0,0,0,0.10)",
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_LEADERBOARD = [
  { userId:"m1", name:"Arjun Sharma",   role:"Security Analyst", level:5, score:4820, xp:9640, quizzesDone:38, loginStreak:14 },
  { userId:"m2", name:"Priya Mehta",    role:"SOC Engineer",     level:4, score:3950, xp:7900, quizzesDone:31, loginStreak:9  },
  { userId:"m3", name:"Rohan Gupta",    role:"Pen Tester",       level:4, score:3410, xp:6820, quizzesDone:27, loginStreak:7  },
  { userId:"m4", name:"Sneha Patil",    role:"Student",          level:3, score:2780, xp:5560, quizzesDone:22, loginStreak:5  },
  { userId:"m5", name:"Vikram Das",     role:"IT Admin",         level:3, score:2140, xp:4280, quizzesDone:17, loginStreak:4  },
  { userId:"m6", name:"Ananya Reddy",   role:"Student",          level:2, score:1590, xp:3180, quizzesDone:13, loginStreak:3  },
  { userId:"m7", name:"Karan Joshi",    role:"Learner",          level:2, score:1020, xp:2040, quizzesDone:9,  loginStreak:2  },
  { userId:"m8", name:"Meera Iyer",     role:"Student",          level:1, score:650,  xp:1300, quizzesDone:5,  loginStreak:1  },
];

const THREATS = [
  { id:1,  type:"Phishing",        severity:"critical", source:"185.220.101.45", target:"Email Gateway",  time:"2 min ago",  status:"active",        desc:"Mass credential phishing targeting banking users",              ioc:"fake-banklogin.com",      country:"RU" },
  { id:2,  type:"Ransomware",      severity:"high",     source:"103.45.67.89",   target:"File Server",    time:"8 min ago",  status:"blocked",       desc:"LockBit 3.0 variant attempting lateral movement",               ioc:"lockbit3-c2.onion",       country:"CN" },
  { id:3,  type:"DDoS",            severity:"high",     source:"Multiple",        target:"Web Server",     time:"15 min ago", status:"mitigating",    desc:"UDP flood attack peaking at 45Gbps from botnet",                ioc:"147.28.x.x/16",          country:"US" },
  { id:4,  type:"SQL Injection",   severity:"medium",   source:"91.108.4.20",    target:"DB Server",      time:"22 min ago", status:"blocked",       desc:"Automated SQLi scan targeting login endpoints",                  ioc:"/admin/login.php",        country:"IR" },
  { id:5,  type:"Brute Force",     severity:"medium",   source:"45.33.32.156",   target:"SSH Port 22",    time:"31 min ago", status:"blocked",       desc:"Credential stuffing using RockYou2024 wordlist",                 ioc:"45.33.32.156",            country:"DE" },
  { id:6,  type:"Zero-Day",        severity:"critical", source:"APT-29",          target:"VPN Gateway",    time:"1h ago",     status:"investigating", desc:"CVE-2024-XXXX exploit in FortiGate SSL-VPN",                    ioc:"apt29-dropper.dll",       country:"Unknown" },
  { id:7,  type:"Data Exfil",      severity:"high",     source:"172.16.0.45",    target:"Internal",       time:"2h ago",     status:"contained",     desc:"Unusual outbound traffic to external storage bucket",            ioc:"s3-backup.amazonaws.com", country:"US" },
  { id:8,  type:"Malware",         severity:"medium",   source:"Email Attach",    target:"Endpoint",       time:"3h ago",     status:"quarantined",   desc:"AgentTesla stealer via macro-enabled XLSX",                      ioc:"invoice_march.xlsm",      country:"NG" },
  { id:9,  type:"MitM",            severity:"high",     source:"192.168.1.200",  target:"Network Switch", time:"4h ago",     status:"blocked",       desc:"ARP spoofing attack intercepting internal traffic",              ioc:"00:1A:2B:3C:4D:5E",       country:"IN" },
  { id:10, type:"Credential Dump", severity:"critical", source:"darkweb-leak",   target:"User DB",        time:"5h ago",     status:"investigating", desc:"5000+ user credentials found on paste site",                    ioc:"pastebin.xyz/leak2024",   country:"Unknown" },
];

const THREAT_TREND = Array.from({length:24},(_,i)=>({
  h:`${i}:00`,
  critical: Math.floor(Math.random()*5+1),
  high:     Math.floor(Math.random()*10+2),
  medium:   Math.floor(Math.random()*18+3),
}));

const PHISHING_EMAILS = [
  { id:1, from:"security@paypa1.com", subject:"⚠️ Account Limited — Verify Now", time:"10:32 AM",
    body:`Dear Valued Customer,\n\nWe detected unusual activity on your PayPal account. Your account has been temporarily limited.\n\nVerify your identity immediately:\nhttps://www.paypa1-secure-verify.com/account/restore\n\nFailure to verify within 24 hours will result in permanent account suspension.\n\nPayPal Security Team`,
    clues:["Sender domain: paypa1.com — '1' substitutes 'l'","Suspicious URL: paypa1-secure-verify.com","Urgency: '24 hours' deadline creates panic","Generic greeting: 'Valued Customer' not your name"],
    isPhishing:true, category:"Phishing" },
  { id:2, from:"newsletter@github.com", subject:"Your GitHub digest for March 2026", time:"9:15 AM",
    body:`Hi there,\n\nHere's your weekly GitHub digest:\n\n• 3 new followers this week\n• 12 stars on your repositories\n• 5 new issues opened\n\nSee what's trending: https://github.com/trending\n\nBest,\nThe GitHub Team`,
    clues:["Legitimate: github.com is the real domain","Relevant, personalized content about your account","No urgency or threats used","All links go only to github.com"],
    isPhishing:false, category:"Legitimate" },
  { id:3, from:"hr-dept@company-payroll.net", subject:"URGENT: Payroll Update Required", time:"8:44 AM",
    body:`Hello Employee,\n\nOur payroll system was updated. To receive your next salary you MUST update your bank details within 48 hours.\n\nClick here: http://company-payroll-update.netlify.app/banking\n\nThis is MANDATORY. Ignoring this will delay your salary.\n\n- HR Department`,
    clues:["Suspicious domain: company-payroll.net (not your company)","Link redirects to netlify.app — not official","Extreme urgency about salary payment","No employee name used"],
    isPhishing:true, category:"Spear Phishing" },
  { id:4, from:"noreply@amazon.com", subject:"Your order #113-4892-0032 has shipped!", time:"3:21 PM",
    body:`Hello,\n\nGreat news! Your order has been shipped and is on its way.\n\nOrder #113-4892-0032\nEstimated delivery: March 22–24\n\nTrack your package: https://www.amazon.com/gp/your-account/order-history\n\nThank you for shopping with Amazon!\n\nThe Amazon Team`,
    clues:["Legitimate: amazon.com official domain","Standard transactional shipping notification","No requests for personal or financial info","All links go to amazon.com only"],
    isPhishing:false, category:"Legitimate" },
  { id:5, from:"support@micros0ft-help.com", subject:"Your Microsoft 365 License Expired", time:"11:02 AM",
    body:`Dear User,\n\nYour Microsoft 365 subscription expired. Your files and email access will be disabled in 3 hours.\n\nRenew now to avoid data loss:\nhttps://micros0ft-help.com/renew?id=8829\n\nEnter your credit card to continue.\n\nMicrosoft Support`,
    clues:["Domain: micros0ft-help.com — '0' replaces 'o' in Microsoft","Very short deadline: 3 hours — high pressure","Asking for credit card directly in email","Microsoft never sends payment links via email"],
    isPhishing:true, category:"Brand Impersonation" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmtDate = d => d ? new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short" }) : "";

const getFullName = (u) => {
  if (!u) return "";
  if (u.fullName && u.fullName.trim()) return u.fullName.trim();
  if (u.name && u.name.trim()) return u.name.trim();
  if (u.username && u.username.trim()) return u.username.trim();
  if (u.firstName || u.lastName) return `${u.firstName||""} ${u.lastName||""}`.trim();
  if (u.email) return u.email.split("@")[0];
  return "User";
};

const firstName = (u) => {
  const full = getFullName(u);
  return full.split(" ")[0] || "User";
};

// ─── STREAK LOGIC ─────────────────────────────────────────────────────────────
const computeStreak = (user) => {
  if (!user) return { streak: 1, updated: true, lastDate: new Date().toISOString() };
  const now = Date.now();
  const last = user.lastLoginDate ? new Date(user.lastLoginDate).getTime() : 0;
  const diffHours = last ? (now - last) / (1000 * 60 * 60) : 999;
  const currentStreak = user.loginStreak || 0;
  if (diffHours < 12) return { streak: currentStreak, updated: false, lastDate: user.lastLoginDate };
  if (diffHours <= 48) return { streak: currentStreak + 1, updated: true, lastDate: new Date().toISOString() };
  return { streak: 1, updated: true, lastDate: new Date().toISOString() };
};

// ─── XP / LEVEL COMPUTATION ───────────────────────────────────────────────────
const computeLevel = (score) => {
  const xp = score || 0;
  const level = Math.floor(xp / 500) + 1;
  return { level, xp, xpInLevel: xp % 500, xpPct: Math.min(100, Math.round(((xp % 500) / 500) * 100)) };
};

const SEV = {
  critical: { color:"#DC2626", bg:"rgba(220,38,38,0.08)",  label:"Critical" },
  high:     { color:"#EA580C", bg:"rgba(234,88,12,0.08)",  label:"High" },
  medium:   { color:"#D97706", bg:"rgba(217,119,6,0.08)",  label:"Medium" },
  low:      { color:"#059669", bg:"rgba(5,150,105,0.08)",  label:"Low" },
};

const STATUS_C = {
  active:"#DC2626", blocked:"#059669", mitigating:"#D97706",
  investigating:"#7C3AED", contained:"#0D9488", quarantined:"#4F46E5",
};

// ─── REUSABLES ────────────────────────────────────────────────────────────────
const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Nunito:wght@400;500;600;700;800&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    @keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}
    @keyframes glow{0%,100%{box-shadow:0 0 10px rgba(79,70,229,0.2)}50%{box-shadow:0 0 20px rgba(79,70,229,0.4)}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
    @keyframes flash{0%{opacity:1}50%{opacity:0.3}100%{opacity:1}}
    .fu{animation:fadeUp .35s cubic-bezier(.16,1,.3,1) both}
    .fu1{animation-delay:.05s}.fu2{animation-delay:.1s}.fu3{animation-delay:.15s}.fu4{animation-delay:.2s}.fu5{animation-delay:.25s}
    .spin{animation:spin 1s linear infinite}
    .flash{animation:flash .6s ease}
    ::-webkit-scrollbar{width:4px;height:4px}
    ::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:rgba(79,70,229,0.18);border-radius:4px}
    ::-webkit-scrollbar-thumb:hover{background:rgba(79,70,229,0.35)}
    input:-webkit-autofill{-webkit-box-shadow:0 0 0 100px #FFFFFF inset!important;-webkit-text-fill-color:#111827!important}
    button:focus-visible{outline:2px solid #4F46E5;outline-offset:2px}
    input:focus{outline:none}
  `}</style>
);

function Bdg({ color, bg, children, size="sm" }) {
  return (
    <span style={{ fontSize:size==="sm"?9:11, fontWeight:700, color, background:bg,
      border:`1px solid ${color}30`, borderRadius:99,
      padding:size==="sm"?"2px 7px":"4px 12px", whiteSpace:"nowrap",
      fontFamily:"'JetBrains Mono',monospace", letterSpacing:"0.02em" }}>
      {children}
    </span>
  );
}

function CTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:10,
      padding:"10px 14px", boxShadow:T.shMd, fontSize:11,
      fontFamily:"'Nunito',sans-serif" }}>
      <p style={{ color:T.textMd, marginBottom:6, fontWeight:700, fontSize:10, letterSpacing:"0.06em" }}>{label}</p>
      {payload.map((p,i) => (
        <p key={i} style={{ color:p.color, margin:"2px 0" }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
}

function EmptyState({ icon:Icon, title, desc, actionLabel, onAction, color=T.brand }) {
  return (
    <div style={{ textAlign:"center", padding:"36px 24px",
      background:`${color}06`, border:`1px dashed ${color}30`,
      borderRadius:16 }}>
      <div style={{ width:48, height:48, borderRadius:14, background:`${color}10`,
        display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px" }}>
        <Icon size={20} style={{ color:`${color}90` }} />
      </div>
      <p style={{ fontSize:13, fontWeight:700, color:T.text, margin:"0 0 5px",
        fontFamily:"'Syne',sans-serif" }}>{title}</p>
      <p style={{ fontSize:11, color:T.textMd, margin:"0 0 16px", lineHeight:1.6 }}>{desc}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} style={{ display:"inline-flex", alignItems:"center", gap:6,
          padding:"8px 18px", borderRadius:10, border:"none", cursor:"pointer",
          fontSize:12, fontWeight:700, background:`linear-gradient(135deg,${color},${color}cc)`,
          color:"#fff", fontFamily:"'Nunito',sans-serif" }}>
          <Plus size={12}/>{actionLabel}
        </button>
      )}
    </div>
  );
}

// ─── NOTIFICATION ENGINE ──────────────────────────────────────────────────────
const generateNotifications = (user) => {
  const notifs = [];
  const now = Date.now();
  if ((user?.loginStreak || 0) >= 3)
    notifs.push({ id:"streak", type:"streak", read:false, message:`🔥 ${user.loginStreak}-day streak! Keep it up!`, time:"Just now", createdAt: now });
  if ((user?.quizzesDone || 0) > 0)
    notifs.push({ id:"quiz", type:"quiz", read:false, message:`You've completed ${user.quizzesDone} quiz${user.quizzesDone!==1?"zes":""}. Earn more XP!`, time:"Today", createdAt: now - 3600000 });
  if ((user?.phishingSimTotal || 0) > 0) {
    const acc = Math.round((user.phishingSimCorrect/user.phishingSimTotal)*100);
    notifs.push({ id:"phishing", type:"phishing", read:false, message:`Phishing sim accuracy: ${acc}% — ${acc>=80?"Outstanding!":acc>=60?"Keep practicing":"Needs work"}`, time:"Today", createdAt: now - 7200000 });
  }
  if ((user?.level || 1) > 1)
    notifs.push({ id:"level", type:"achievement", read:true, message:`Level up! You've reached Level ${user.level}`, time:"Yesterday", createdAt: now - 86400000 });
  notifs.push({ id:"threat1", type:"threat", read:true, message:"Critical: New phishing campaign targeting Indian banks detected", time:"2h ago", createdAt: now - 7200000 });
  notifs.push({ id:"threat2", type:"threat", read:true, message:"High: Ransomware variant LockBit 3.0 spreading via phishing emails", time:"5h ago", createdAt: now - 18000000 });
  if ((user?.score || 0) === 0)
    notifs.push({ id:"welcome", type:"info", read:false, message:"Welcome to CyberShield! Complete your first quiz to earn XP.", time:"Today", createdAt: now - 1800000 });
  return notifs.sort((a,b) => b.createdAt - a.createdAt);
};

// ─── NOTIFICATION PANEL ───────────────────────────────────────────────────────
function NotificationPanel({ user, onClose, onMarkRead }) {
  const notifs = generateNotifications(user);
  const unread = notifs.filter(n => !n.read).length;
  const typeIcon = (type) => {
    switch(type) {
      case "threat":      return <ShieldAlert size={13} style={{ color:T.red }}/>;
      case "quiz":        return <Brain size={13} style={{ color:T.brand }}/>;
      case "achievement": return <Award size={13} style={{ color:T.amber }}/>;
      case "streak":      return <Flame size={13} style={{ color:T.amber }}/>;
      case "phishing":    return <Mail size={13} style={{ color:T.teal }}/>;
      default:            return <Bell size={13} style={{ color:T.brand }}/>;
    }
  };
  const typeBg = (type) => {
    switch(type) {
      case "threat":      return T.redDim;
      case "quiz":        return `${T.brand}12`;
      case "achievement": return T.amberDim;
      case "streak":      return T.amberDim;
      case "phishing":    return T.tealDim;
      default:            return `${T.brand}12`;
    }
  };
  return (
    <div style={{ position:"fixed", top:62, right:16, width:360,
      background:T.card, border:`1px solid ${T.border}`,
      borderRadius:18, boxShadow:"0 12px 40px rgba(0,0,0,0.12)",
      zIndex:999, overflow:"hidden", animation:"slideIn .2s ease" }}>
      <div style={{ padding:"14px 18px", borderBottom:`1px solid ${T.border}`,
        display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <h3 style={{ fontSize:13, fontWeight:700, color:T.text, margin:0, fontFamily:"'Syne',sans-serif" }}>Notifications</h3>
          {unread > 0 && <p style={{ fontSize:10, color:T.brand, margin:"2px 0 0", fontWeight:600 }}>{unread} unread</p>}
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          {unread > 0 && (
            <button onClick={onMarkRead} style={{ fontSize:10, color:T.brand, fontWeight:700, border:"none", background:"none", cursor:"pointer", fontFamily:"inherit" }}>Mark all read</button>
          )}
          <button onClick={onClose} style={{ border:"none", background:T.bg, borderRadius:8, width:26, height:26, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <X size={12} style={{ color:T.textMd }}/>
          </button>
        </div>
      </div>
      <div style={{ maxHeight:400, overflowY:"auto" }}>
        {notifs.map((n) => (
          <div key={n.id} style={{ padding:"12px 18px", borderBottom:`1px solid ${T.border}`, background:n.read?"transparent":`${T.brand}04`, display:"flex", alignItems:"flex-start", gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:9, flexShrink:0, background:typeBg(n.type), display:"flex", alignItems:"center", justifyContent:"center" }}>
              {typeIcon(n.type)}
            </div>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:11, fontWeight:n.read?400:700, color:T.text, margin:"0 0 3px", lineHeight:1.4 }}>{n.message}</p>
              <p style={{ fontSize:9, color:T.textDim, margin:0 }}>{n.time}</p>
            </div>
            {!n.read && <div style={{ width:6, height:6, borderRadius:"50%", background:T.brand, marginTop:4, flexShrink:0 }}/>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SEARCH OVERLAY ───────────────────────────────────────────────────────────
function SearchOverlay({ onClose, setPage, navigate }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef();
  useEffect(() => { inputRef.current?.focus(); }, []);

  const pages = [
    { id:"overview",    label:"Overview",            icon:Home,        desc:"Dashboard home" },
    { id:"threats",     label:"Threat Intelligence", icon:ShieldAlert, desc:"Live threat feed" },
    { id:"phishing",    label:"Phishing Simulator",  icon:Mail,        desc:"Practice detecting phishing" },
    { id:"reports",     label:"Analytics & Reports", icon:BarChart2,   desc:"Security analytics" },
    { id:"profile",     label:"My Profile",          icon:User,        desc:"Account & stats" },
    { id:"settings",    label:"Settings",            icon:Settings,    desc:"Configure account" },
    { id:"leaderboard", label:"Leaderboard",         icon:Trophy,      desc:"Top performers" },
  ];
  const external = [
    { label:"Courses",   icon:GraduationCap, path:"/courses" },
    { label:"Quiz",      icon:Brain,         path:"/quiz" },
    { label:"CyberGame", icon:Gamepad2,      path:"/game" },
  ];

  const all = [...pages, ...external];
  const filtered = query.length < 1 ? pages.slice(0,5) :
    all.filter(p => (p.label+(p.desc||"")+(p.path||"")).toLowerCase().includes(query.toLowerCase()));

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.25)", backdropFilter:"blur(4px)", zIndex:1000, display:"flex", alignItems:"flex-start", justifyContent:"center", paddingTop:80 }} onClick={onClose}>
      <div style={{ width:560, background:T.card, borderRadius:18, boxShadow:"0 20px 60px rgba(0,0,0,0.15)", overflow:"hidden", border:`1px solid ${T.border}`, animation:"fadeUp .2s ease" }} onClick={e => e.stopPropagation()}>
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"13px 16px", borderBottom:`1px solid ${T.border}` }}>
          <Search size={14} style={{ color:T.textDim }}/>
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)} placeholder="Search pages, features…"
            style={{ flex:1, border:"none", outline:"none", fontSize:14, color:T.text, fontFamily:"'Nunito',sans-serif", background:"transparent" }}/>
          <kbd style={{ fontSize:9, color:T.textDim, border:`1px solid ${T.border}`, borderRadius:5, padding:"2px 7px", fontFamily:"monospace" }}>ESC</kbd>
        </div>
        <div style={{ maxHeight:360, overflowY:"auto" }}>
          {filtered.length === 0 ? (
            <div style={{ padding:"28px", textAlign:"center", color:T.textDim, fontSize:12 }}>No results for "{query}"</div>
          ) : filtered.map((item, i) => (
            <div key={i} onClick={() => { item.path ? navigate(item.path) : setPage(item.id); onClose(); }}
              style={{ display:"flex", alignItems:"center", gap:11, padding:"11px 16px", cursor:"pointer", transition:"background .1s", borderBottom:`1px solid ${T.border}` }}
              onMouseEnter={e => e.currentTarget.style.background=T.surfaceHov}
              onMouseLeave={e => e.currentTarget.style.background="transparent"}>
              <div style={{ width:34, height:34, borderRadius:9, background:`${T.brand}10`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                {item.icon && <item.icon size={14} style={{ color:T.brand }}/>}
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:12, fontWeight:700, color:T.text, margin:0, fontFamily:"'Syne',sans-serif" }}>{item.label}</p>
                <p style={{ fontSize:10, color:T.textMd, margin:0 }}>{item.desc || item.path}</p>
              </div>
              <ChevronRight size={12} style={{ color:T.textDim }}/>
            </div>
          ))}
        </div>
        <div style={{ padding:"9px 16px", borderTop:`1px solid ${T.border}`, display:"flex", gap:12, fontSize:10, color:T.textDim }}>
          <span>↩ select</span><span>↑↓ navigate</span><span>ESC close</span>
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ page, setPage, user, navigate, collapsed, setCollapsed }) {
  const nav = [
    { id:"overview",    icon:Home,          label:"Overview" },
    { id:"threats",     icon:ShieldAlert,   label:"Threats", badge:"Live" },
    { id:"courses",     icon:GraduationCap, label:"Courses", external:"/courses" },
    { id:"phishing",    icon:Mail,          label:"Phishing Sim" },
    { id:"quiz",        icon:Brain,         label:"Quiz", external:"/quiz" },
    { id:"game",        icon:Gamepad2,      label:"CyberGame", external:"/game" },
    { id:"reports",     icon:BarChart2,     label:"Reports" },
    { id:"leaderboard", icon:Trophy,        label:"Leaderboard" },
  ];
  const bottom = [
    { id:"profile",  icon:User,     label:"Profile" },
    { id:"settings", icon:Settings, label:"Settings" },
  ];

  const handleNav = item => item.external ? navigate(item.external) : setPage(item.id);
  const w = collapsed ? 64 : 236;

  const NavBtn = ({ item, active }) => (
    <div style={{ position:"relative" }}>
      <button onClick={() => handleNav(item)} title={collapsed ? item.label : ""}
        style={{ width:"100%", display:"flex", alignItems:"center", gap:collapsed?0:9, padding:collapsed?"10px":"8px 11px", justifyContent:collapsed?"center":"flex-start", borderRadius:10, border:"none", background:active?`${T.brand}10`:"transparent", color:active?T.brand:T.textMd, cursor:"pointer", transition:"all .15s", marginBottom:1, fontFamily:"'Nunito',sans-serif", fontSize:12, fontWeight:active?700:500, textAlign:"left" }}
        onMouseEnter={e => { if(!active){e.currentTarget.style.background=T.surfaceHov;e.currentTarget.style.color=T.text;} }}
        onMouseLeave={e => { if(!active){e.currentTarget.style.background="transparent";e.currentTarget.style.color=T.textMd;} }}>
        <item.icon size={14} style={{ flexShrink:0 }}/>
        {!collapsed && (
          <>
            <span style={{ flex:1, whiteSpace:"nowrap" }}>{item.label}</span>
            {item.badge && (
              <span style={{ fontSize:8, background:T.redDim, color:T.red, border:`1px solid ${T.red}25`, borderRadius:99, padding:"1px 5px", fontWeight:800, letterSpacing:"0.05em" }}>{item.badge}</span>
            )}
            {item.external && <ChevronRight size={10} style={{ color:T.textDim }}/>}
            {active && !item.external && <div style={{ width:4, height:4, borderRadius:"50%", background:T.brand }}/>}
          </>
        )}
      </button>
      {collapsed && item.badge && (
        <div style={{ position:"absolute", top:7, right:7, width:5, height:5, borderRadius:"50%", background:T.red }}/>
      )}
    </div>
  );

  return (
    <div style={{ width:w, flexShrink:0, background:T.surface, borderRight:`1px solid ${T.border}`, display:"flex", flexDirection:"column", height:"100vh", position:"fixed", left:0, top:0, zIndex:100, transition:"width .25s cubic-bezier(.16,1,.3,1)", overflow:"hidden" }}>
      <div style={{ padding:collapsed?"14px 8px":"18px 16px 14px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:collapsed?"center":"space-between", minHeight:62, gap:8 }}>
        {!collapsed && (
          <div style={{ display:"flex", alignItems:"center", gap:9 }}>
            <div style={{ width:34, height:34, borderRadius:10, background:`linear-gradient(135deg,${T.brand},${T.violet})`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Shield size={16} style={{ color:"#fff" }}/>
            </div>
            <div>
              <div style={{ fontSize:14, fontWeight:800, color:T.text, letterSpacing:"-0.01em", fontFamily:"'Syne',sans-serif" }}>CyberShield</div>
              <div style={{ fontSize:9, color:T.textDim, fontWeight:600, letterSpacing:"0.1em", fontFamily:"'JetBrains Mono',monospace" }}>SECURITY SUITE</div>
            </div>
          </div>
        )}
        {collapsed && (
          <div style={{ width:34, height:34, borderRadius:10, background:`linear-gradient(135deg,${T.brand},${T.violet})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Shield size={16} style={{ color:"#fff" }}/>
          </div>
        )}
        <button onClick={() => setCollapsed(c => !c)} style={{ border:"none", background:T.bg, borderRadius:7, width:24, height:24, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:T.textMd }}>
          {collapsed ? <ChevronRight size={12}/> : <ChevronLeft size={12}/>}
        </button>
      </div>

      <nav style={{ flex:1, padding:"8px 6px", overflowY:"auto", overflowX:"hidden" }}>
        {!collapsed && <div style={{ fontSize:8, fontWeight:700, color:T.textDim, letterSpacing:"0.12em", padding:"5px 9px 7px", fontFamily:"'JetBrains Mono',monospace" }}>MAIN</div>}
        {nav.map(item => <NavBtn key={item.id} item={item} active={page===item.id}/>)}
        {!collapsed ? (
          <div style={{ fontSize:8, fontWeight:700, color:T.textDim, letterSpacing:"0.12em", padding:"11px 9px 7px", marginTop:8, borderTop:`1px solid ${T.border}`, fontFamily:"'JetBrains Mono',monospace" }}>ACCOUNT</div>
        ) : (
          <div style={{ height:1, background:T.border, margin:"8px 4px" }}/>
        )}
        {bottom.map(item => <NavBtn key={item.id} item={item} active={page===item.id}/>)}
      </nav>

      <div style={{ padding:collapsed?"9px 6px":"10px 12px", borderTop:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:8, justifyContent:collapsed?"center":"flex-start" }}>
        <div style={{ width:32, height:32, borderRadius:9, flexShrink:0, overflow:"hidden", background:`linear-gradient(135deg,${T.brand},${T.violet})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, color:"#fff" }}>
          {user?.avatar ? <img src={user.avatar} alt="" style={{ width:32,height:32,objectFit:"cover" }}/> : firstName(user).charAt(0).toUpperCase()}
        </div>
        {!collapsed && (
          <>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:11, fontWeight:700, color:T.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontFamily:"'Syne',sans-serif" }}>{getFullName(user)}</div>
              <div style={{ fontSize:9, color:T.textDim, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontFamily:"'JetBrains Mono',monospace" }}>{user?.email || "Not signed in"}</div>
            </div>
            <button onClick={() => { localStorage.clear(); window.location.href="/"; }} style={{ border:"none", background:"none", cursor:"pointer", color:T.textDim, padding:4 }} title="Sign out">
              <LogOut size={12}/>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── TOPBAR ───────────────────────────────────────────────────────────────────
function TopBar({ page, user, notifCount, onNotifClick, onProfileClick, onSearchClick }) {
  const labels = {
    overview:"Overview", threats:"Threat Intelligence", courses:"Learning Courses",
    phishing:"Phishing Simulator", quiz:"Quiz Center", game:"CyberDefense Game",
    reports:"Analytics & Reports", profile:"My Profile", settings:"Settings",
    leaderboard:"Leaderboard",
  };
  return (
    <div style={{ height:62, background:T.surface, borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", padding:"0 22px", gap:12, position:"sticky", top:0, zIndex:50 }}>
      <div style={{ flex:1 }}>
        <h1 style={{ fontSize:16, fontWeight:800, color:T.text, margin:0, fontFamily:"'Syne',sans-serif" }}>{labels[page] || page}</h1>
      </div>
      <button onClick={onSearchClick} style={{ display:"flex", alignItems:"center", gap:7, background:T.bg, border:`1px solid ${T.border}`, borderRadius:10, padding:"7px 12px", width:200, cursor:"pointer", fontFamily:"'Nunito',sans-serif", color:T.textDim, fontSize:11 }}>
        <Search size={11}/> Search pages… <kbd style={{ marginLeft:"auto", fontSize:9, border:`1px solid ${T.border}`, borderRadius:4, padding:"1px 5px", fontFamily:"monospace", color:T.textDim }}>⌘K</kbd>
      </button>
      <button onClick={onNotifClick} style={{ position:"relative", width:34, height:34, borderRadius:9, border:`1px solid ${T.border}`, background:T.bg, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <Bell size={14} style={{ color:T.textMd }}/>
        {notifCount > 0 && (
          <span style={{ position:"absolute", top:-3, right:-3, background:T.red, color:"#fff", borderRadius:"50%", width:16, height:16, fontSize:8, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", border:`2px solid ${T.surface}`, fontFamily:"monospace" }}>
            {notifCount > 9 ? "9+" : notifCount}
          </span>
        )}
      </button>
      <button onClick={onProfileClick} style={{ width:32, height:32, borderRadius:9, overflow:"hidden", border:"none", background:`linear-gradient(135deg,${T.brand},${T.violet})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, color:"#fff", cursor:"pointer", flexShrink:0 }}>
        {user?.avatar ? <img src={user.avatar} alt="" style={{ width:32,height:32,objectFit:"cover" }}/> : firstName(user).charAt(0).toUpperCase()}
      </button>
    </div>
  );
}

// ─── PAGE: OVERVIEW ───────────────────────────────────────────────────────────
function OverviewPage({ user, setPage, navigate }) {
  const hour = new Date().getHours();
  const greeting = hour < 5 ? "Working late" : hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const fname = firstName(user);

  const score    = user?.score       || 0;
  const streak   = user?.loginStreak || 0;
  const quizDone = user?.quizzesDone || 0;
  const avgScore = user?.avgScore    || 0;
  const phCorrect = user?.phishingSimCorrect || 0;
  const phTotal   = user?.phishingSimTotal   || 0;

  const { level, xp, xpInLevel, xpPct } = computeLevel(score);

  const weekData = user?.weeklyActivity?.length > 0 ? user.weeklyActivity : [
    { day:"Mon", score:0 }, { day:"Tue", score:0 }, { day:"Wed", score:0 },
    { day:"Thu", score:0 }, { day:"Fri", score:0 }, { day:"Sat", score:0 }, { day:"Sun", score:score },
  ];

  const domainData = [
    { subject:"Phishing", A: user?.phishingScore || (phTotal>0?Math.round((phCorrect/phTotal)*100):0) },
    { subject:"Malware",  A: user?.malwareScore  || 0 },
    { subject:"Network",  A: user?.networkScore  || 0 },
    { subject:"Privacy",  A: user?.privacyScore  || 0 },
    { subject:"Cloud",    A: user?.cloudScore    || 0 },
  ];

  const history = user?.quizHistory || [];

  const tips = [
    "Never reuse passwords across accounts — use a password manager.",
    "Enable 2FA on every critical service you use today.",
    "Hover links before clicking — always verify the domain.",
    "Keep your OS and all software fully patched.",
    "Public Wi-Fi? Always tunnel through a VPN.",
    "3-2-1 backup rule: 3 copies, 2 media types, 1 offsite.",
    "Zero-trust mindset: verify every request, trust nothing by default.",
  ];
  const [tip] = useState(() => tips[Math.floor(Math.random() * tips.length)]);

  const quickActions = [
    { icon:Brain,         label:"Quiz",        sub:"Earn XP",    color:T.brand,   action:() => navigate("/quiz") },
    { icon:GraduationCap, label:"Courses",     sub:"Learn",      color:T.teal,    action:() => navigate("/courses") },
    { icon:Gamepad2,      label:"Game",        sub:"Defend",     color:T.violet,  action:() => navigate("/game") },
    { icon:ShieldAlert,   label:"Threats",     sub:"Live intel", color:T.red,     action:() => setPage("threats") },
    { icon:Mail,          label:"Phishing",    sub:"Train",      color:T.amber,   action:() => setPage("phishing") },
    { icon:Trophy,        label:"Leaderboard", sub:"Rankings",   color:T.pink,    action:() => setPage("leaderboard") },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {/* Hero */}
      <div className="fu" style={{ borderRadius:22, padding:"26px 30px", position:"relative", overflow:"hidden",
        background:`linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 50%, #EDE9FE 100%)`,
        border:`1px solid ${T.brand}20`, boxShadow:T.sh }}>
        <div style={{ position:"absolute", inset:0, pointerEvents:"none", backgroundImage:`linear-gradient(rgba(79,70,229,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(79,70,229,0.04) 1px,transparent 1px)`, backgroundSize:"40px 40px" }}/>
        <div style={{ position:"absolute", top:-60, right:-40, width:200, height:200, borderRadius:"50%", background:`radial-gradient(circle,${T.brand}12,transparent 70%)`, pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:-40, left:60, width:140, height:140, borderRadius:"50%", background:`radial-gradient(circle,${T.violet}08,transparent 70%)`, pointerEvents:"none" }}/>

        <div style={{ position:"relative", zIndex:1, display:"flex", alignItems:"center", justifyContent:"space-between", gap:20 }}>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:5, background:"rgba(5,150,105,0.10)", borderRadius:99, padding:"3px 10px", border:"1px solid rgba(5,150,105,0.25)" }}>
                <div style={{ width:5, height:5, borderRadius:"50%", background:T.green, animation:"pulse 2s infinite" }}/>
                <span style={{ fontSize:9, fontWeight:700, color:T.green, letterSpacing:"0.12em", fontFamily:"'JetBrains Mono',monospace" }}>PROTECTED</span>
              </div>
              <span style={{ fontSize:10, color:T.textMd }}>
                {new Date().toLocaleDateString("en-IN", {weekday:"long", day:"numeric", month:"long"})}
              </span>
            </div>

            <h1 style={{ fontSize:32, fontWeight:800, color:T.text, fontFamily:"'Syne',sans-serif", margin:"0 0 4px", lineHeight:1.1 }}>
              {greeting}, {fname} 👋
            </h1>
            <p style={{ fontSize:12, color:T.textMd, margin:"0 0 4px" }}>
              {getFullName(user) !== user?.email?.split("@")[0] ? (user?.role || "Cybersecurity Learner") : "Cybersecurity Learner"}
              {level > 1 ? ` · Level ${level} Security Analyst` : " · Building foundations 🚀"}
            </p>

            <div style={{ display:"inline-flex", alignItems:"center", gap:7, background:"rgba(79,70,229,0.06)", border:"1px solid rgba(79,70,229,0.18)", borderRadius:10, padding:"6px 12px", margin:"14px 0 18px" }}>
              <Zap size={11} style={{ color:T.amber, flexShrink:0 }}/>
              <span style={{ fontSize:11, color:T.textMd, fontStyle:"italic" }}>{tip}</span>
            </div>

            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {[
                { v:score > 0 ? score.toLocaleString() : "—", l:"Score",   c:T.brand },
                { v:`Lv.${level}`,                             l:"Level",   c:T.violet },
                { v:streak > 0 ? `${streak}d 🔥` : "0d",      l:"Streak",  c:T.amber },
                { v:quizDone > 0 ? quizDone : "—",             l:"Quizzes", c:T.teal },
              ].map(({ v, l, c }, i) => (
                <div key={i} style={{ background:"rgba(255,255,255,0.7)", border:"1px solid rgba(79,70,229,0.12)", borderRadius:11, padding:"8px 14px", textAlign:"center", minWidth:70, backdropFilter:"blur(4px)" }}>
                  <div style={{ fontSize:18, fontWeight:800, color:c, lineHeight:1, fontFamily:"'Syne',sans-serif" }}>{v}</div>
                  <div style={{ fontSize:9, color:T.textDim, marginTop:2, letterSpacing:"0.06em" }}>{l}</div>
                </div>
              ))}
              <div style={{ background:"rgba(255,255,255,0.7)", border:"1px solid rgba(79,70,229,0.12)", borderRadius:11, padding:"8px 14px", minWidth:160, backdropFilter:"blur(4px)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:9, color:T.textDim, marginBottom:6 }}>
                  <span>Level {level} Progress</span>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", color:T.brand }}>{xpInLevel}/500 XP</span>
                </div>
                <div style={{ height:4, background:"rgba(79,70,229,0.12)", borderRadius:99 }}>
                  <div style={{ height:4, width:`${xpPct}%`, background:`linear-gradient(90deg,${T.brand},${T.violet})`, borderRadius:99, transition:"width 1s ease" }}/>
                </div>
              </div>
            </div>
          </div>

          {/* XP Donut */}
          <div style={{ textAlign:"center", flexShrink:0 }}>
            <svg width={100} height={100} viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(79,70,229,0.12)" strokeWidth="6"/>
              <circle cx="50" cy="50" r="42" fill="none" stroke={T.brand} strokeWidth="6"
                strokeDasharray={`${2*Math.PI*42*xpPct/100} ${2*Math.PI*42}`}
                strokeLinecap="round" transform="rotate(-90 50 50)"/>
              <text x="50" y="45" textAnchor="middle" fill={T.text} fontSize="18" fontWeight="800" fontFamily="'Syne',sans-serif">{xpPct}%</text>
              <text x="50" y="59" textAnchor="middle" fill={T.textDim} fontSize="8" fontFamily="'JetBrains Mono',monospace">XP</text>
            </svg>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="fu fu1">
        <div style={{ fontSize:9, fontWeight:700, color:T.textDim, marginBottom:9, letterSpacing:"0.12em", fontFamily:"'JetBrains Mono',monospace" }}>QUICK ACTIONS</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:10 }}>
          {quickActions.map((item, i) => (
            <button key={i} onClick={item.action}
              style={{ padding:"14px 8px", border:`1px solid ${T.border}`, textAlign:"center", cursor:"pointer", background:T.card, borderRadius:16, transition:"all .2s", fontFamily:"inherit", boxShadow:T.sh }}
              onMouseEnter={e => { e.currentTarget.style.background=`${item.color}08`; e.currentTarget.style.borderColor=`${item.color}25`; e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow=`0 8px 20px ${item.color}15`; }}
              onMouseLeave={e => { e.currentTarget.style.background=T.card; e.currentTarget.style.borderColor=T.border; e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow=T.sh; }}>
              <div style={{ width:38, height:38, borderRadius:11, background:`${item.color}10`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 8px" }}>
                <item.icon size={16} style={{ color:item.color }}/>
              </div>
              <p style={{ fontSize:11, fontWeight:700, color:T.text, margin:"0 0 2px", fontFamily:"'Syne',sans-serif" }}>{item.label}</p>
              <p style={{ fontSize:9, color:T.textDim, margin:0 }}>{item.sub}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="fu fu2" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
        {[
          { label:"Total Score",       value:score>0?score.toLocaleString():"—", icon:Star,    color:T.brand,  sub:score>0?"Keep earning!":"Start a quiz" },
          { label:"Avg Quiz Score",    value:avgScore>0?`${avgScore}%`:"—",      icon:Brain,   color:T.violet, sub:avgScore>0?"Well done":"Take your first quiz" },
          { label:"Login Streak",      value:`${streak} day${streak!==1?"s":""}`, icon:Flame,  color:T.amber,  sub:streak>=3?"🔥 On fire":"Login daily to grow" },
          { label:"Phishing Accuracy", value:phTotal>0?`${Math.round((phCorrect/phTotal)*100)}%`:"—", icon:Mail, color:T.teal, sub:phTotal>0?`${phCorrect}/${phTotal} correct`:"Try the simulator" },
        ].map((s, i) => {
          const [hov, setHov] = useState(false);
          return (
            <div key={i}
              style={{ background:hov?`${s.color}06`:T.card, border:`1px solid ${hov?s.color+"20":T.border}`, borderRadius:18, padding:"18px 20px", cursor:"default", transition:"all .2s", boxShadow:T.sh }}
              onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                <div style={{ width:38, height:38, borderRadius:12, background:`${s.color}10`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <s.icon size={16} style={{ color:s.color }}/>
                </div>
              </div>
              <div style={{ fontSize:28, fontWeight:800, color:s.color, letterSpacing:"-0.03em", lineHeight:1, fontFamily:"'Syne',sans-serif" }}>{s.value}</div>
              <div style={{ fontSize:11, color:T.textMd, marginTop:4, fontWeight:500 }}>{s.label}</div>
              {s.sub && <div style={{ fontSize:10, color:s.color, marginTop:2, fontWeight:600 }}>{s.sub}</div>}
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="fu fu3" style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:14 }}>
        <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:18, padding:20, boxShadow:T.sh }}>
          <h3 style={{ fontSize:13, fontWeight:700, color:T.text, margin:"0 0 3px", fontFamily:"'Syne',sans-serif" }}>Weekly Activity</h3>
          <p style={{ fontSize:10, color:T.textMd, margin:"0 0 16px" }}>Score progression this week</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weekData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false}/>
              <XAxis dataKey="day" tick={{ fontSize:10, fill:T.textMd }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize:9, fill:T.textDim }} axisLine={false} tickLine={false}/>
              <Tooltip content={<CTip/>}/>
              <Bar dataKey="score" name="Score" fill={T.brand} radius={[5,5,0,0]} maxBarSize={24}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:18, padding:20, boxShadow:T.sh }}>
          <h3 style={{ fontSize:13, fontWeight:700, color:T.text, margin:"0 0 3px", fontFamily:"'Syne',sans-serif" }}>Domain Mastery</h3>
          <p style={{ fontSize:10, color:T.textMd, margin:"0 0 12px" }}>Skill radar</p>
          <ResponsiveContainer width="100%" height={180}>
            <RadarChart data={domainData}>
              <PolarGrid stroke={T.border}/>
              <PolarAngleAxis dataKey="subject" tick={{ fontSize:9, fill:T.textMd }}/>
              <Radar name="Score" dataKey="A" stroke={T.brand} fill={T.brand} fillOpacity={0.12} strokeWidth={2}/>
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quiz history */}
      <div className="fu fu4" style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:18, padding:20, boxShadow:T.sh }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
          <div>
            <h3 style={{ fontSize:13, fontWeight:700, color:T.text, margin:0, fontFamily:"'Syne',sans-serif" }}>Recent Quiz Activity</h3>
            <p style={{ fontSize:10, color:T.textMd, margin:"2px 0 0" }}>
              {history.length > 0 ? `${history.length} module${history.length!==1?"s":""} completed` : "No attempts yet"}
            </p>
          </div>
          <button onClick={() => navigate("/quiz")}
            style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 14px", borderRadius:10, border:"none", background:`linear-gradient(135deg,${T.brand},${T.violet})`, color:"#fff", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
            <Brain size={11}/>{history.length > 0 ? "New Quiz" : "Start First Quiz"}
          </button>
        </div>
        {history.length > 0 ? (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
            {history.slice(0,4).map((r, idx) => {
              const pct = r.score || r.percentage || 0;
              const col = pct >= 80 ? T.green : pct >= 60 ? T.brand : T.amber;
              return (
                <div key={idx} style={{ background:T.bg, border:`1px solid ${T.border}`, borderRadius:13, padding:13, cursor:"pointer", transition:"all .2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor=`${col}25`; e.currentTarget.style.transform="translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor=T.border; e.currentTarget.style.transform="none"; }}>
                  <p style={{ fontSize:11, fontWeight:700, color:T.text, margin:"0 0 4px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {r.quiz || r.moduleTitle || `Module ${idx+1}`}
                  </p>
                  <p style={{ fontSize:24, fontWeight:800, color:col, margin:"0 0 6px", fontFamily:"'Syne',sans-serif" }}>{pct}%</p>
                  <p style={{ fontSize:9, color:T.textDim, margin:0, fontFamily:"'JetBrains Mono',monospace" }}>{fmtDate(r.date || r.updatedAt)}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState icon={Brain} title="No quizzes attempted yet"
            desc="Take your first quiz to start tracking your performance and earn XP."
            actionLabel="Browse Courses" onAction={() => navigate("/courses")} color={T.brand}/>
        )}
      </div>

      {/* Activity + Badges */}
      <div className="fu fu5" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:18, padding:18, boxShadow:T.sh }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:13 }}>
            <div style={{ width:28, height:28, borderRadius:8, background:T.tealDim, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Activity size={12} style={{ color:T.teal }}/>
            </div>
            <h3 style={{ fontSize:12, fontWeight:700, color:T.text, margin:0, fontFamily:"'Syne',sans-serif" }}>Recent Activity</h3>
          </div>
          {(user?.recentActivity || []).length > 0 ? (
            <div style={{ display:"flex", flexDirection:"column", gap:1 }}>
              {user.recentActivity.slice(0,6).map((a, i) => (
                <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:8, padding:"7px 8px", borderRadius:9, transition:"background .15s" }}
                  onMouseEnter={e => e.currentTarget.style.background=T.bg}
                  onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                  <div style={{ width:5, height:5, borderRadius:"50%", background:T.brand, marginTop:5, flexShrink:0 }}/>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:11, color:T.text, margin:0, lineHeight:1.4, fontWeight:500 }}>{a.msg || a}</p>
                    <p style={{ fontSize:9, color:T.textDim, margin:"1px 0 0" }}>{a.time || ""}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={Rocket} title="No activity yet" desc="Your actions appear here as you explore the platform." color={T.teal}/>
          )}
        </div>

        <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:18, padding:18, boxShadow:T.sh }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:13 }}>
            <div style={{ width:28, height:28, borderRadius:8, background:T.amberDim, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Award size={12} style={{ color:T.amber }}/>
            </div>
            <h3 style={{ fontSize:12, fontWeight:700, color:T.text, margin:0, fontFamily:"'Syne',sans-serif" }}>Badges Earned</h3>
          </div>
          {(user?.badges || []).length > 0 ? (
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {user.badges.map((b, i) => (
                <div key={i} style={{ textAlign:"center", padding:"10px 11px", background:T.bg, border:`1px solid ${T.border}`, borderRadius:12, cursor:"default", transition:"all .2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background=T.amberDim; e.currentTarget.style.transform="scale(1.06)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background=T.bg; e.currentTarget.style.transform="scale(1)"; }}>
                  <div style={{ fontSize:20, lineHeight:1 }}>{b.emoji || "🏅"}</div>
                  <p style={{ fontSize:9, color:T.textMd, marginTop:5, fontWeight:700 }}>{b.label || b}</p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={Star} title="No badges yet" desc="Complete activities and reach milestones to unlock badges." color={T.amber}/>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PAGE: THREATS ────────────────────────────────────────────────────────────
function ThreatsPage() {
  const [filter, setFilter]     = useState("all");
  const [search, setSearch]     = useState("");
  const [selected, setSelected] = useState(null);
  const [liveCount, setLiveCount] = useState(THREATS.length);

  useEffect(() => {
    const t = setInterval(() => { setLiveCount(p => p + Math.floor(Math.random() * 2)); }, 5000);
    return () => clearInterval(t);
  }, []);

  const filtered = THREATS.filter(t =>
    (filter === "all" || t.severity === filter) &&
    (t.type + t.source + t.desc + t.status).toLowerCase().includes(search.toLowerCase())
  );

  const counts = {
    critical: THREATS.filter(t => t.severity==="critical").length,
    high:     THREATS.filter(t => t.severity==="high").length,
    medium:   THREATS.filter(t => t.severity==="medium").length,
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
        {[
          { label:"Total Detected", value:liveCount, color:T.brand,    icon:ShieldAlert, live:true },
          { label:"Critical",       value:counts.critical, color:T.red,    icon:AlertTriangle },
          { label:"High",           value:counts.high,     color:"#EA580C", icon:Zap },
          { label:"Medium",         value:counts.medium,   color:T.amber,   icon:Eye },
        ].map((item, i) => (
          <div key={i} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:16, padding:"16px 18px", boxShadow:T.sh }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
              <div style={{ width:34, height:34, borderRadius:10, background:`${item.color}10`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <item.icon size={14} style={{ color:item.color }}/>
              </div>
              {item.live && <span style={{ fontSize:8, fontWeight:700, color:T.red, background:T.redDim, border:`1px solid ${T.red}20`, borderRadius:99, padding:"2px 7px", letterSpacing:"0.08em", fontFamily:"'JetBrains Mono',monospace" }}>● LIVE</span>}
            </div>
            <div style={{ fontSize:26, fontWeight:800, color:item.color, fontFamily:"'Syne',sans-serif" }}>{item.value}</div>
            <div style={{ fontSize:11, color:T.textMd, fontWeight:500 }}>{item.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:18, padding:20, boxShadow:T.sh }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
          <div>
            <h3 style={{ fontSize:13, fontWeight:700, color:T.text, margin:0, fontFamily:"'Syne',sans-serif" }}>24-Hour Threat Timeline</h3>
            <p style={{ fontSize:10, color:T.textMd, margin:"2px 0 0" }}>Real-time detection frequency</p>
          </div>
          <div style={{ display:"flex", gap:12 }}>
            {[{c:T.red,l:"Critical"},{c:"#EA580C",l:"High"},{c:T.amber,l:"Medium"}].map(d => (
              <div key={d.l} style={{ display:"flex", alignItems:"center", gap:4, fontSize:10, color:T.textMd }}>
                <div style={{ width:6, height:6, borderRadius:2, background:d.c }}/>{d.l}
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={THREAT_TREND}>
            <defs>
              {[{id:"cr",c:T.red},{id:"hi",c:"#EA580C"},{id:"me",c:T.amber}].map(g => (
                <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={g.c} stopOpacity={0.15}/>
                  <stop offset="95%" stopColor={g.c} stopOpacity={0}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false}/>
            <XAxis dataKey="h" tick={{ fontSize:9, fill:T.textDim }} axisLine={false} tickLine={false} interval={3}/>
            <YAxis tick={{ fontSize:9, fill:T.textDim }} axisLine={false} tickLine={false}/>
            <Tooltip content={<CTip/>}/>
            <Area type="monotone" dataKey="critical" name="Critical" stroke={T.red} fill="url(#cr)" strokeWidth={2} dot={false}/>
            <Area type="monotone" dataKey="high" name="High" stroke="#EA580C" fill="url(#hi)" strokeWidth={1.5} dot={false}/>
            <Area type="monotone" dataKey="medium" name="Medium" stroke={T.amber} fill="url(#me)" strokeWidth={1.5} dot={false}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ display:"flex", gap:6 }}>
          {["all","critical","high","medium"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding:"6px 13px", borderRadius:8, border:`1px solid ${filter===f?T.brand:T.border}`, background:filter===f?`${T.brand}10`:T.card, color:filter===f?T.brand:T.textMd, fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"'Nunito',sans-serif", textTransform:"capitalize", transition:"all .15s" }}>
              {f} {f!=="all" && `(${THREATS.filter(t=>t.severity===f).length})`}
            </button>
          ))}
        </div>
        <div style={{ flex:1 }}/>
        <div style={{ display:"flex", alignItems:"center", gap:6, background:T.card, border:`1px solid ${T.border}`, borderRadius:9, padding:"6px 12px" }}>
          <Search size={11} style={{ color:T.textDim }}/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search threats…"
            style={{ border:"none", outline:"none", fontSize:11, fontFamily:"'Nunito',sans-serif", background:"transparent", color:T.text, width:180 }}/>
          {search && <button onClick={() => setSearch("")} style={{ border:"none", background:"none", cursor:"pointer", color:T.textDim, padding:0, display:"flex" }}><X size={11}/></button>}
        </div>
        <span style={{ fontSize:10, color:T.textDim }}>{filtered.length} results</span>
      </div>

      <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:18, overflow:"hidden", boxShadow:T.sh }}>
        <div style={{ display:"grid", gridTemplateColumns:"100px 100px 1fr 130px 110px 110px 80px", padding:"10px 18px", background:T.bg, borderBottom:`1px solid ${T.border}`, fontSize:8, fontWeight:700, color:T.textDim, letterSpacing:"0.1em", fontFamily:"'JetBrains Mono',monospace" }}>
          <span>TYPE</span><span>SEVERITY</span><span>DESCRIPTION</span><span>SOURCE</span><span>TARGET</span><span>STATUS</span><span>TIME</span>
        </div>
        {filtered.map((t, i) => {
          const sev = SEV[t.severity];
          const sc  = STATUS_C[t.status] || T.textDim;
          const isSel = selected?.id === t.id;
          return (
            <div key={t.id} onClick={() => setSelected(isSel ? null : t)}
              style={{ display:"grid", gridTemplateColumns:"100px 100px 1fr 130px 110px 110px 80px", padding:"11px 18px", borderBottom:i<filtered.length-1?`1px solid ${T.border}`:"none", cursor:"pointer", transition:"background .12s", background:isSel?`${T.brand}06`:"transparent" }}
              onMouseEnter={e => { if(!isSel) e.currentTarget.style.background=T.surfaceHov; }}
              onMouseLeave={e => { if(!isSel) e.currentTarget.style.background="transparent"; }}>
              <span style={{ fontSize:11, fontWeight:700, color:T.text, alignSelf:"center" }}>{t.type}</span>
              <div style={{ alignSelf:"center" }}><Bdg color={sev.color} bg={sev.bg}>{sev.label}</Bdg></div>
              <span style={{ fontSize:10, color:T.textMd, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", alignSelf:"center" }}>{t.desc}</span>
              <span style={{ fontSize:10, color:T.text, fontFamily:"'JetBrains Mono',monospace", alignSelf:"center" }}>{t.source.length>15?t.source.substring(0,14)+"…":t.source}</span>
              <span style={{ fontSize:10, color:T.textMd, alignSelf:"center" }}>{t.target}</span>
              <div style={{ alignSelf:"center" }}><Bdg color={sc} bg={`${sc}12`}>{t.status}</Bdg></div>
              <span style={{ fontSize:9, color:T.textDim, alignSelf:"center", fontFamily:"'JetBrains Mono',monospace" }}>{t.time}</span>
            </div>
          );
        })}
      </div>

      {selected && (
        <div style={{ background:T.card, border:`1px solid ${T.brand}20`, borderRadius:18, padding:20, boxShadow:T.shMd, animation:"slideIn .2s ease" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
            <div style={{ display:"flex", alignItems:"center", gap:9 }}>
              <ShieldAlert size={15} style={{ color:SEV[selected.severity].color }}/>
              <h3 style={{ fontSize:13, fontWeight:700, color:T.text, margin:0, fontFamily:"'Syne',sans-serif" }}>{selected.type} — Detailed Analysis</h3>
              <Bdg color={SEV[selected.severity].color} bg={SEV[selected.severity].bg} size="md">{selected.severity.toUpperCase()}</Bdg>
            </div>
            <button onClick={() => setSelected(null)} style={{ border:"none", background:T.bg, borderRadius:7, width:26, height:26, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <X size={11} style={{ color:T.textMd }}/>
            </button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:12 }}>
            {[
              { l:"IOC / Indicator", v:selected.ioc },
              { l:"Source / Actor",  v:selected.source },
              { l:"Target",          v:selected.target },
              { l:"Origin Country",  v:selected.country },
              { l:"Status",          v:selected.status },
              { l:"Detected",        v:selected.time },
            ].map((item, i) => (
              <div key={i} style={{ background:T.bg, borderRadius:10, padding:"10px 12px" }}>
                <div style={{ fontSize:8, color:T.textDim, fontWeight:700, letterSpacing:"0.1em", marginBottom:4, fontFamily:"'JetBrains Mono',monospace" }}>{item.l}</div>
                <div style={{ fontSize:11, color:T.text, fontWeight:700, fontFamily:"'JetBrains Mono',monospace" }}>{item.v}</div>
              </div>
            ))}
          </div>
          <div style={{ background:T.bg, borderRadius:10, padding:"12px 14px" }}>
            <div style={{ fontSize:8, color:T.textDim, fontWeight:700, marginBottom:5, fontFamily:"'JetBrains Mono',monospace" }}>FULL DESCRIPTION</div>
            <p style={{ fontSize:12, color:T.text, margin:0, lineHeight:1.6 }}>{selected.desc}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PAGE: PHISHING SIM ───────────────────────────────────────────────────────
function PhishingPage({ user, onUserUpdate }) {
  const [step, setStep]                 = useState(0);
  const [result, setResult]             = useState(null);
  const [sessionScore, setSessionScore] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [animating, setAnimating]       = useState(false);

  const current = PHISHING_EMAILS[step];
  const accuracy = sessionTotal > 0 ? Math.round((sessionScore / sessionTotal) * 100) : 0;

  const handleAnswer = (isPhish) => {
    if (animating) return;
    const correct = isPhish === current.isPhishing;
    if (correct) setSessionScore(s => s + 1);
    setSessionTotal(t => t + 1);
    setResult({ correct, isPhishing: current.isPhishing });
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);

    if (onUserUpdate) {
      const prevCorrect = user?.phishingSimCorrect || 0;
      const prevTotal   = user?.phishingSimTotal   || 0;
      onUserUpdate({
        phishingSimCorrect: prevCorrect + (correct ? 1 : 0),
        phishingSimTotal:   prevTotal + 1,
        recentActivity: [
          { msg:`Phishing sim: "${current.subject.substring(0,28)}…" — ${correct?"Correct ✓":"Incorrect ✗"}`, time:"Just now" },
          ...(user?.recentActivity || []).slice(0, 9),
        ],
      });
    }
  };

  const next = () => {
    setAnimating(true);
    setTimeout(() => {
      if (step < PHISHING_EMAILS.length - 1) { setStep(s => s + 1); }
      else { setStep(0); setSessionScore(0); setSessionTotal(0); }
      setResult(null);
      setAnimating(false);
    }, 200);
  };

  const overallAcc = user?.phishingSimTotal
    ? Math.round((user.phishingSimCorrect / user.phishingSimTotal) * 100)
    : null;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ background:T.card, border:`1px solid ${T.amber}25`, borderRadius:18, padding:"16px 20px", display:"flex", alignItems:"center", gap:14 }}>
        <div style={{ width:44, height:44, borderRadius:13, background:T.amberDim, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <Mail size={18} style={{ color:T.amber }}/>
        </div>
        <div style={{ flex:1 }}>
          <h2 style={{ fontSize:16, fontWeight:800, color:T.text, margin:"0 0 2px", fontFamily:"'Syne',sans-serif" }}>Phishing Simulator</h2>
          <p style={{ fontSize:11, color:T.textMd, margin:0 }}>Analyse each email: legitimate or phishing? Results sync to your profile instantly.</p>
        </div>
        <div style={{ display:"flex", gap:8, flexShrink:0 }}>
          <div style={{ background:`${T.brand}08`, border:`1px solid ${T.brand}20`, borderRadius:9, padding:"5px 12px", fontSize:11, fontWeight:700, color:T.brand, fontFamily:"'JetBrains Mono',monospace" }}>
            Session: {sessionScore}/{sessionTotal}{sessionTotal > 0 && ` (${accuracy}%)`}
          </div>
          {overallAcc !== null && (
            <div style={{ background:`${T.teal}08`, border:`1px solid ${T.teal}20`, borderRadius:9, padding:"5px 12px", fontSize:11, fontWeight:700, color:T.teal, fontFamily:"'JetBrains Mono',monospace" }}>
              All-time: {overallAcc}%
            </div>
          )}
        </div>
      </div>

      <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:10, padding:"10px 16px", display:"flex", alignItems:"center", gap:12 }}>
        <span style={{ fontSize:10, color:T.textDim, whiteSpace:"nowrap", fontFamily:"'JetBrains Mono',monospace" }}>Email {step+1} of {PHISHING_EMAILS.length}</span>
        <div style={{ flex:1, height:4, background:T.bg, borderRadius:99 }}>
          <div style={{ height:4, borderRadius:99, width:`${((step+1)/PHISHING_EMAILS.length)*100}%`, background:`linear-gradient(90deg,${T.amber},${T.brand})`, transition:"width .4s ease" }}/>
        </div>
        <span style={{ fontSize:10, color:T.brand, fontWeight:700, fontFamily:"'JetBrains Mono',monospace" }}>{Math.round(((step+1)/PHISHING_EMAILS.length)*100)}%</span>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:14 }}>
        <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:18, overflow:"hidden", boxShadow:T.sh, opacity:animating?0.6:1, transition:"opacity .2s" }}>
          <div style={{ background:T.bg, borderBottom:`1px solid ${T.border}`, padding:"8px 14px", display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:"#FF5F57" }}/>
            <div style={{ width:8, height:8, borderRadius:"50%", background:"#FEBC2E" }}/>
            <div style={{ width:8, height:8, borderRadius:"50%", background:"#28C840" }}/>
            <span style={{ fontSize:10, color:T.textDim, marginLeft:6, fontFamily:"'JetBrains Mono',monospace" }}>Inbox — {PHISHING_EMAILS.length} unread</span>
          </div>
          <div style={{ padding:"14px 18px 12px", borderBottom:`1px solid ${T.border}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:8 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:`${T.brand}10`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:800, color:T.brand, flexShrink:0 }}>
                {current.from.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:T.text, fontFamily:"'JetBrains Mono',monospace" }}>{current.from}</div>
                <div style={{ fontSize:9, color:T.textDim }}>To: you@company.com · {current.time}</div>
              </div>
            </div>
            <h3 style={{ fontSize:14, fontWeight:700, color:T.text, margin:0, fontFamily:"'Syne',sans-serif" }}>{current.subject}</h3>
          </div>
          <div style={{ padding:"16px 18px" }}>
            {current.body.split("\n").map((line, i) => (
              <p key={i} style={{ fontSize:12, color:line.startsWith("http")||line.startsWith("https") ? T.brand : T.textMd, margin:"0 0 3px", lineHeight:1.7, fontFamily:line.startsWith("http")?"'JetBrains Mono',monospace":"inherit", textDecoration:line.startsWith("http")?"underline":"none" }}>
                {line || "\u00A0"}
              </p>
            ))}
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:11 }}>
          {!result ? (
            <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:16, padding:16, boxShadow:T.sh }}>
              <h3 style={{ fontSize:12, fontWeight:700, color:T.text, margin:"0 0 4px", fontFamily:"'Syne',sans-serif" }}>Your Verdict</h3>
              <p style={{ fontSize:10, color:T.textMd, margin:"0 0 13px" }}>Is this email safe or a phishing attempt?</p>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                <button onClick={() => handleAnswer(false)}
                  style={{ padding:"11px 13px", borderRadius:11, border:`1px solid ${T.green}25`, background:T.greenDim, color:T.green, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'Nunito',sans-serif", display:"flex", alignItems:"center", gap:8, transition:"all .2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background=T.green; e.currentTarget.style.color="#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background=T.greenDim; e.currentTarget.style.color=T.green; }}>
                  <CheckCircle size={14}/> Legitimate Email ✓
                </button>
                <button onClick={() => handleAnswer(true)}
                  style={{ padding:"11px 13px", borderRadius:11, border:`1px solid ${T.red}20`, background:T.redDim, color:T.red, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'Nunito',sans-serif", display:"flex", alignItems:"center", gap:8, transition:"all .2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background=T.red; e.currentTarget.style.color="#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background=T.redDim; e.currentTarget.style.color=T.red; }}>
                  <AlertTriangle size={14}/> Phishing Attempt ⚠️
                </button>
              </div>
            </div>
          ) : (
            <div style={{ background:result.correct?T.greenDim:T.redDim, border:`1px solid ${result.correct?T.green:T.red}20`, borderRadius:16, padding:16, animation:"fadeUp .3s ease" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                {result.correct ? <CheckCircle size={18} style={{ color:T.green }}/> : <AlertTriangle size={18} style={{ color:T.red }}/>}
                <h3 style={{ fontSize:13, fontWeight:800, color:result.correct?T.green:T.red, margin:0, fontFamily:"'Syne',sans-serif" }}>
                  {result.correct ? "Correct! 🎉" : "Incorrect ⬇️"}
                </h3>
              </div>
              <p style={{ fontSize:11, color:T.textMd, margin:"0 0 12px" }}>
                This was {result.isPhishing ? "a phishing / scam email" : "a legitimate email"}.
              </p>
              <button onClick={next} style={{ width:"100%", padding:"10px", borderRadius:10, border:"none", background:result.correct?T.green:T.red, color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
                {step < PHISHING_EMAILS.length-1 ? "Next Email →" : "Restart ↺"}
              </button>
            </div>
          )}

          {result && (
            <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:16, padding:14, boxShadow:T.sh }}>
              <h4 style={{ fontSize:11, fontWeight:700, color:T.text, margin:"0 0 10px", fontFamily:"'Syne',sans-serif" }}>🔍 Key Indicators</h4>
              <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                {current.clues.map((clue, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:6, fontSize:10, color:T.textMd, lineHeight:1.5 }}>
                    <div style={{ width:14, height:14, borderRadius:"50%", background:current.isPhishing?T.redDim:T.greenDim, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                      {current.isPhishing ? <AlertTriangle size={7} style={{ color:T.red }}/> : <CheckCircle size={7} style={{ color:T.green }}/>}
                    </div>
                    {clue}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, padding:13 }}>
            <div style={{ fontSize:10, color:T.textDim, marginBottom:8, fontFamily:"'JetBrains Mono',monospace" }}>SESSION PROGRESS</div>
            <div style={{ display:"flex", gap:4 }}>
              {PHISHING_EMAILS.map((_, i) => (
                <div key={i} style={{ flex:1, height:4, borderRadius:99, background:i<step?T.brand:i===step?T.amber:T.bg }}/>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE: REPORTS ────────────────────────────────────────────────────────────
function ReportsPage({ user, navigate, setPage }) {
  const [exporting, setExporting] = useState(null);

  const hasData = (user?.quizHistory?.length || 0) > 0 ||
                  (user?.phishingSimTotal || 0) > 0 ||
                  (user?.score || 0) > 0;

  const phAcc = user?.phishingSimTotal
    ? Math.round((user.phishingSimCorrect/user.phishingSimTotal)*100)
    : null;

  const handleDownload = async (type) => {
    setExporting(type);
    await new Promise(r => setTimeout(r, 700));

    const name = getFullName(user) || "Unknown";
    const { level, xp } = computeLevel(user?.score || 0);

    const quizRows = (user?.quizHistory || []).slice(0,10).map((r, i) =>
      `  ${String(i+1).padStart(2,"0")}. ${(r.quiz || r.moduleTitle || `Module ${i+1}`).padEnd(30," ")} ${String(r.score || r.percentage || 0).padStart(3," ")}%  [${fmtDate(r.date || r.updatedAt)}]`
    ).join("\n");

    const actRows = (user?.recentActivity || []).slice(0,5).map(a =>
      `  • ${a.msg || a}`
    ).join("\n");

    const report = `
╔══════════════════════════════════════════════════════╗
║          CYBERSHIELD SECURITY PERFORMANCE REPORT      ║
╚══════════════════════════════════════════════════════╝

  Report Date : ${new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"long",year:"numeric"})}
  User        : ${name}
  Email       : ${user?.email || "—"}
  Role        : ${user?.role || "Student"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PERFORMANCE SUMMARY
  Total Score            : ${(user?.score || 0).toLocaleString()}
  Level                  : ${level}
  Total XP               : ${xp.toLocaleString()} XP
  Login Streak           : ${user?.loginStreak || 0} days
  Quizzes Completed      : ${user?.quizzesDone || 0}
  Average Quiz Score     : ${user?.avgScore || 0}%
  Courses Completed      : ${user?.coursesCompleted || 0}

PHISHING SIMULATOR
  Total Emails Analyzed  : ${user?.phishingSimTotal || 0}
  Correct Detections     : ${user?.phishingSimCorrect || 0}
  Missed / Incorrect     : ${(user?.phishingSimTotal||0) - (user?.phishingSimCorrect||0)}
  Detection Accuracy     : ${phAcc !== null ? phAcc+"%" : "Not attempted"}
  Rating                 : ${phAcc === null ? "—" : phAcc >= 90 ? "🏆 Excellent" : phAcc >= 75 ? "✅ Good" : phAcc >= 60 ? "⚠️ Needs Practice" : "❌ Requires Training"}

SECURITY DOMAIN SCORES
  Phishing Awareness     : ${user?.phishingScore || (phAcc || "—")}%
  Malware Detection      : ${user?.malwareScore || "—"}%
  Network Security       : ${user?.networkScore || "—"}%
  Data Privacy           : ${user?.privacyScore || "—"}%
  Cloud Security         : ${user?.cloudScore || "—"}%

BADGES EARNED
  ${(user?.badges || []).length > 0 ? (user.badges.map(b => `${b.emoji||"🏅"} ${b.label||b}`).join("  ")) : "No badges yet — complete activities to earn badges"}

${quizRows ? `QUIZ HISTORY (Last 10)\n${quizRows}\n` : ""}
${actRows ? `RECENT ACTIVITY\n${actRows}\n` : ""}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  RECOMMENDATIONS
${phAcc === null ? "  • Try the Phishing Simulator to test your detection skills." : phAcc < 75 ? "  • Practice phishing detection — aim for 80%+ accuracy." : "  • Excellent phishing awareness! Move to advanced modules."}
${(user?.quizzesDone || 0) === 0 ? "  • Complete your first quiz to start earning XP and scores." : "  • Keep up your quiz momentum for maximum XP gain."}
${(user?.loginStreak || 0) < 3 ? "  • Log in daily to build your streak and unlock bonus XP." : `  • 🔥 Great ${user.loginStreak}-day streak — keep it going!`}
  • Complete all security domain modules for a full skill profile.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Confidential — Generated by CyberShield Security Suite
`.trim();

    if (type === "pdf") {
      const win = window.open("","_blank");
      win.document.write(`<html><head><title>CyberShield Report — ${name}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Syne:wght@700;800&display=swap');
          body{font-family:'JetBrains Mono',monospace;padding:40px;color:#111827;background:#F9FAFB;font-size:12px}
          .header{background:linear-gradient(135deg,#4F46E5,#7C3AED);color:#fff;padding:32px;border-radius:12px;margin-bottom:28px}
          .header h1{font-family:'Syne',sans-serif;font-size:22px;margin:0 0 6px}
          .header p{margin:3px 0;opacity:0.9;font-size:11px}
          .section{background:#fff;border:1px solid #E5E7EB;border-radius:10px;padding:20px 24px;margin-bottom:16px}
          .section h2{font-family:'Syne',sans-serif;font-size:14px;color:#4F46E5;margin:0 0 14px;padding-bottom:8px;border-bottom:1px solid #E5E7EB}
          .row{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #F3F4F6}
          .row:last-child{border-bottom:none}
          .label{color:#6B7280;font-size:11px}
          .value{font-weight:600;color:#111827;font-size:11px}
          .badge{display:inline-block;background:#EEF2FF;color:#3730A3;border-radius:6px;padding:3px 10px;font-size:10px;font-weight:600;margin:3px}
          .rec{background:#F0FDF4;border-left:3px solid #059669;padding:8px 12px;margin:5px 0;border-radius:0 6px 6px 0;font-size:11px;color:#065F46}
          .footer{text-align:center;color:#9CA3AF;font-size:10px;margin-top:24px}
          .accuracy-bar{height:8px;background:#E5E7EB;border-radius:99px;margin-top:6px}
          .accuracy-fill{height:8px;border-radius:99px;background:linear-gradient(90deg,#4F46E5,#7C3AED)}
        </style></head>
        <body>
          <div class="header">
            <h1>🛡️ CyberShield Security Report</h1>
            <p><strong>${name}</strong> &nbsp;·&nbsp; ${user?.email || ""} &nbsp;·&nbsp; ${user?.role || "Student"}</p>
            <p>Generated: ${new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</p>
          </div>
          <div class="section">
            <h2>📊 Performance Summary</h2>
            ${[
              ["Total Score", (user?.score||0).toLocaleString()],
              ["Level", `Level ${level}`],
              ["Total XP", `${xp.toLocaleString()} XP`],
              ["Login Streak", `${user?.loginStreak||0} days`],
              ["Quizzes Completed", user?.quizzesDone||0],
              ["Average Quiz Score", user?.avgScore?`${user.avgScore}%`:"Not attempted"],
              ["Courses Completed", user?.coursesCompleted||0],
            ].map(([l,v]) => `<div class="row"><span class="label">${l}</span><span class="value">${v}</span></div>`).join("")}
          </div>
          <div class="section">
            <h2>🎣 Phishing Simulator</h2>
            ${[
              ["Emails Analyzed", user?.phishingSimTotal||0],
              ["Correct Detections", user?.phishingSimCorrect||0],
              ["Detection Accuracy", phAcc!==null?`${phAcc}%`:"Not attempted"],
              ["Rating", phAcc===null?"—":phAcc>=90?"🏆 Excellent":phAcc>=75?"✅ Good":phAcc>=60?"⚠️ Needs Practice":"❌ Requires Training"],
            ].map(([l,v]) => `<div class="row"><span class="label">${l}</span><span class="value">${v}</span></div>`).join("")}
            ${phAcc !== null ? `<div class="accuracy-bar"><div class="accuracy-fill" style="width:${phAcc}%"></div></div>` : ""}
          </div>
          ${(user?.quizHistory||[]).length > 0 ? `
          <div class="section">
            <h2>🧠 Quiz History</h2>
            ${user.quizHistory.slice(0,8).map(r => {
              const pct = r.score||r.percentage||0;
              const col = pct>=80?"#059669":pct>=60?"#4F46E5":"#D97706";
              return `<div class="row"><span class="label">${r.quiz||r.moduleTitle||"Module"}</span><span class="value" style="color:${col}">${pct}% &nbsp; [${fmtDate(r.date||r.updatedAt)}]</span></div>`;
            }).join("")}
          </div>` : ""}
          ${(user?.badges||[]).length > 0 ? `
          <div class="section">
            <h2>🏅 Achievements</h2>
            ${user.badges.map(b => `<span class="badge">${b.emoji||"🏅"} ${b.label||b}</span>`).join("")}
          </div>` : ""}
          <div class="section">
            <h2>💡 Recommendations</h2>
            ${[
              phAcc===null ? "Try the Phishing Simulator to test your detection skills." : phAcc<75 ? "Practice phishing detection — aim for 80%+ accuracy." : "Excellent phishing awareness! Move to advanced modules.",
              (user?.quizzesDone||0)===0 ? "Complete your first quiz to start earning XP and scores." : "Keep up your quiz momentum for maximum XP gain.",
              (user?.loginStreak||0)<3 ? "Log in daily to build your streak and unlock bonus XP." : `Great ${user.loginStreak}-day streak — keep it going!`,
              "Complete all security domain modules for a full skill profile.",
            ].map(r => `<div class="rec">→ ${r}</div>`).join("")}
          </div>
          <div class="footer">Confidential — CyberShield Security Suite — ${new Date().getFullYear()}</div>
        </body></html>`);
      win.document.close();
      setTimeout(() => { win.print(); win.close(); }, 600);
    } else {
      const blob = new Blob([report], { type:"text/plain" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `CyberShield_${name.replace(/\s/g,"_")}_${new Date().toISOString().split("T")[0]}.txt`;
      a.click();
    }
    setExporting(null);
  };

  if (!hasData) {
    return (
      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
        <EmptyState icon={BarChart2} title="No report data yet"
          desc="Your reports populate automatically as you complete quizzes, phishing simulations, courses, and games."
          color={T.brand}/>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12 }}>
          {[
            { icon:Brain,         label:"Take a Quiz",       desc:"Earn scores and XP",         color:T.brand,  action:() => navigate("/quiz") },
            { icon:Mail,          label:"Try Phishing Sim",  desc:"Test your detection skills",  color:T.amber,  action:() => setPage("phishing") },
            { icon:GraduationCap, label:"Complete a Course", desc:"Learn and earn certificates", color:T.teal,   action:() => navigate("/courses") },
            { icon:Gamepad2,      label:"Play CyberGame",    desc:"Defend against attacks",      color:T.violet, action:() => navigate("/game") },
          ].map((item, i) => (
            <div key={i} onClick={item.action}
              style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:16, padding:"18px 20px", boxShadow:T.sh, display:"flex", alignItems:"center", gap:13, cursor:"pointer", transition:"all .18s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=`${item.color}25`; e.currentTarget.style.transform="translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=T.border; e.currentTarget.style.transform="none"; }}>
              <div style={{ width:42, height:42, borderRadius:12, background:`${item.color}10`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <item.icon size={18} style={{ color:item.color }}/>
              </div>
              <div>
                <p style={{ fontSize:13, fontWeight:700, color:T.text, margin:"0 0 2px", fontFamily:"'Syne',sans-serif" }}>{item.label}</p>
                <p style={{ fontSize:11, color:T.textMd, margin:0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const { level } = computeLevel(user?.score || 0);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:16, padding:"14px 18px", display:"flex", alignItems:"center", gap:14, boxShadow:T.sh }}>
        <div style={{ flex:1 }}>
          <h3 style={{ fontSize:13, fontWeight:700, color:T.text, margin:"0 0 2px", fontFamily:"'Syne',sans-serif" }}>Export Your Report</h3>
          <p style={{ fontSize:10, color:T.textMd, margin:0 }}>Download a personalised security report with all your real data</p>
        </div>
        {[
          { l:"PDF Report", fmt:"pdf", icon:FileDown, color:T.red },
          { l:"TXT Export", fmt:"txt", icon:FileText,  color:T.brand },
        ].map((item, i) => (
          <button key={i} onClick={() => handleDownload(item.fmt)}
            style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 16px", borderRadius:10, border:`1px solid ${item.color}20`, background:`${item.color}08`, color:item.color, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'Nunito',sans-serif", transition:"all .2s" }}
            onMouseEnter={e => { e.currentTarget.style.background=item.color; e.currentTarget.style.color="#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background=`${item.color}08`; e.currentTarget.style.color=item.color; }}>
            {exporting===item.fmt ? <Loader2 size={12} className="spin"/> : <item.icon size={12}/>} {item.l}
          </button>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
        {[
          { l:"Total Score",       v:(user?.score||0).toLocaleString(), c:T.brand,  icon:Star },
          { l:"Level",             v:`Level ${level}`,                   c:T.violet, icon:Trophy },
          { l:"Phishing Accuracy", v:phAcc!==null?`${phAcc}%`:"—",      c:T.amber,  icon:Mail },
          { l:"Login Streak",      v:`${user?.loginStreak||0}d`,          c:T.teal,   icon:Flame },
        ].map((s, i) => (
          <div key={i} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:16, padding:"16px 18px", boxShadow:T.sh }}>
            <div style={{ width:34, height:34, borderRadius:10, background:`${s.c}10`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:10 }}>
              <s.icon size={14} style={{ color:s.c }}/>
            </div>
            <div style={{ fontSize:26, fontWeight:800, color:s.c, fontFamily:"'Syne',sans-serif" }}>{s.v}</div>
            <div style={{ fontSize:11, color:T.textMd, marginTop:3 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {phAcc !== null && (
        <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:16, padding:"16px 18px", boxShadow:T.sh }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
            <h3 style={{ fontSize:12, fontWeight:700, color:T.text, margin:0, fontFamily:"'Syne',sans-serif" }}>Phishing Detection Accuracy</h3>
            <span style={{ fontSize:16, fontWeight:800, color:phAcc>=80?T.green:phAcc>=60?T.amber:T.red, fontFamily:"'Syne',sans-serif" }}>{phAcc}%</span>
          </div>
          <div style={{ height:8, background:T.bg, borderRadius:99, overflow:"hidden" }}>
            <div style={{ height:8, width:`${phAcc}%`, background:`linear-gradient(90deg,${phAcc>=80?T.green:phAcc>=60?T.amber:T.red},${T.brand})`, borderRadius:99, transition:"width 1s ease" }}/>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:6, fontSize:9, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>
            <span>{user?.phishingSimCorrect||0} correct of {user?.phishingSimTotal||0}</span>
            <span>{phAcc>=80?"🏆 Excellent":phAcc>=75?"✅ Good":phAcc>=60?"⚠️ Needs Practice":"❌ Requires Training"}</span>
          </div>
        </div>
      )}

      {(user?.quizHistory||[]).length > 0 && (
        <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:18, overflow:"hidden", boxShadow:T.sh }}>
          <div style={{ padding:"13px 18px", borderBottom:`1px solid ${T.border}` }}>
            <h3 style={{ fontSize:12, fontWeight:700, color:T.text, margin:0, fontFamily:"'Syne',sans-serif" }}>Quiz History</h3>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 100px 100px 100px", padding:"9px 18px", background:T.bg, borderBottom:`1px solid ${T.border}`, fontSize:8, fontWeight:700, color:T.textDim, letterSpacing:"0.1em", fontFamily:"'JetBrains Mono',monospace" }}>
            <span>MODULE</span><span>SCORE</span><span>GRADE</span><span>DATE</span>
          </div>
          {user.quizHistory.slice(0,8).map((r, i) => {
            const pct = r.score || r.percentage || 0;
            const col = pct >= 80 ? T.green : pct >= 60 ? T.brand : T.amber;
            return (
              <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 100px 100px 100px", padding:"10px 18px", borderBottom:i<Math.min(user.quizHistory.length,8)-1?`1px solid ${T.border}`:"none" }}>
                <span style={{ fontSize:11, color:T.text, fontWeight:500 }}>{r.quiz || r.moduleTitle || `Module ${i+1}`}</span>
                <span style={{ fontSize:11, fontWeight:800, color:col, fontFamily:"'Syne',sans-serif" }}>{pct}%</span>
                <div><Bdg color={col} bg={`${col}12`}>{pct>=90?"A+":pct>=80?"A":pct>=70?"B":pct>=60?"C":"D"}</Bdg></div>
                <span style={{ fontSize:9, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>{fmtDate(r.date || r.updatedAt)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── PAGE: PROFILE ────────────────────────────────────────────────────────────
function ProfilePage({ user, onUserUpdate }) {
  const [avatar,    setAvatar]    = useState(user?.avatar || null);
  const [uploading, setUploading] = useState(false);
  const [editMode,  setEditMode]  = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [form, setForm] = useState({
    fullName: getFullName(user),
    email:    user?.email    || "",
    phone:    user?.phone    || "",
    location: user?.location || "",
    role:     user?.role     || "",
    bio:      user?.bio      || "",
  });
  const fileRef = useRef();

  useEffect(() => {
    setForm({
      fullName: getFullName(user),
      email:    user?.email    || "",
      phone:    user?.phone    || "",
      location: user?.location || "",
      role:     user?.role     || "",
      bio:      user?.bio      || "",
    });
    setAvatar(user?.avatar || null);
  }, [user]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const url = URL.createObjectURL(file);
    setAvatar(url);
    if (onUserUpdate) onUserUpdate({ avatar: url });
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/auth/profile", {
        method:"PUT",
        headers:{ "Content-Type":"application/json", "Authorization":`Bearer ${localStorage.getItem("token")}` },
        body:JSON.stringify(form),
      });
    } catch {}
    if (onUserUpdate) onUserUpdate({ ...form, name: form.fullName });
    setSaved(true); setEditMode(false); setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const { level, xp, xpInLevel, xpPct } = computeLevel(user?.score || 0);

  const statItems = [
    { l:"Score",        v:(user?.score||0).toLocaleString(), c:T.brand },
    { l:"Level",        v:level,                             c:T.violet },
    { l:"Streak",       v:`${user?.loginStreak||0}d`,         c:T.amber },
    { l:"Quizzes",      v:user?.quizzesDone||0,               c:T.teal },
    { l:"Avg Score",    v:user?.avgScore?`${user.avgScore}%`:"—", c:T.green },
    { l:"Total XP",     v:xp.toLocaleString(),                c:T.pink },
    { l:"Phishing Acc", v:user?.phishingSimTotal?`${Math.round((user.phishingSimCorrect/user.phishingSimTotal)*100)}%`:"—", c:T.amber },
    { l:"Courses",      v:user?.coursesCompleted||0,           c:T.brand },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      {saved && (
        <div style={{ background:T.greenDim, border:`1px solid ${T.green}20`, borderRadius:12, padding:"10px 16px", display:"flex", alignItems:"center", gap:8, animation:"slideIn .2s ease" }}>
          <CheckCircle2 size={14} style={{ color:T.green }}/>
          <span style={{ fontSize:12, fontWeight:600, color:T.green }}>Profile updated successfully!</span>
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"280px 1fr", gap:16 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
          <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:20, padding:"24px 20px", textAlign:"center", boxShadow:T.sh }}>
            <div style={{ position:"relative", width:88, height:88, margin:"0 auto 13px", cursor:"pointer" }} onClick={() => fileRef.current?.click()}>
              {avatar
                ? <img src={avatar} alt="avatar" style={{ width:88, height:88, borderRadius:"50%", objectFit:"cover", border:`3px solid ${T.brand}20` }}/>
                : <div style={{ width:88, height:88, borderRadius:"50%", background:`linear-gradient(135deg,${T.brand},${T.violet})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, fontWeight:800, color:"#fff" }}>
                    {(form.fullName||"U").charAt(0).toUpperCase()}
                  </div>}
              <div style={{ position:"absolute", bottom:0, right:0, width:26, height:26, borderRadius:"50%", background:T.brand, border:`3px solid ${T.card}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                {uploading ? <Loader2 size={10} style={{ color:"#fff" }} className="spin"/> : <Camera size={10} style={{ color:"#fff" }}/>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleAvatarUpload}/>
            </div>
            <h2 style={{ fontSize:16, fontWeight:800, color:T.text, margin:"0 0 3px", fontFamily:"'Syne',sans-serif" }}>{form.fullName || getFullName(user)}</h2>
            <p style={{ fontSize:11, color:T.textMd, margin:"0 0 10px" }}>{form.role || "Cybersecurity Learner"}</p>
            <div style={{ display:"inline-flex" }}>
              <Bdg color={T.brand} bg={`${T.brand}10`} size="md">Level {level} Analyst</Bdg>
            </div>

            <div style={{ marginTop:14, padding:"10px 12px", background:T.bg, borderRadius:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:9, color:T.textDim, marginBottom:6 }}>
                <span>Level Progress</span>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", color:T.brand }}>{xpInLevel}/500 XP</span>
              </div>
              <div style={{ height:4, background:"rgba(79,70,229,0.1)", borderRadius:99 }}>
                <div style={{ height:4, width:`${xpPct}%`, background:`linear-gradient(90deg,${T.brand},${T.violet})`, borderRadius:99 }}/>
              </div>
            </div>
          </div>

          <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:18, padding:16, boxShadow:T.sh }}>
            <h3 style={{ fontSize:10, fontWeight:700, color:T.textDim, margin:"0 0 11px", letterSpacing:"0.1em", fontFamily:"'JetBrains Mono',monospace" }}>PERFORMANCE STATS</h3>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {statItems.map((s, i) => (
                <div key={i} style={{ background:T.bg, borderRadius:10, padding:"10px 12px", textAlign:"center" }}>
                  <div style={{ fontSize:16, fontWeight:800, color:s.c, fontFamily:"'Syne',sans-serif" }}>{s.v}</div>
                  <div style={{ fontSize:8, color:T.textDim, marginTop:2, fontWeight:700, letterSpacing:"0.06em" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:20, padding:24, boxShadow:T.sh }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
            <h3 style={{ fontSize:14, fontWeight:800, color:T.text, margin:0, fontFamily:"'Syne',sans-serif" }}>Profile Information</h3>
            <button onClick={() => editMode ? handleSave() : setEditMode(true)}
              style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 14px", borderRadius:9, border:"none", background:editMode?`linear-gradient(135deg,${T.green},#34D399)`:`linear-gradient(135deg,${T.brand},${T.violet})`, color:"#fff", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
              {saving ? <Loader2 size={11} className="spin"/> : editMode ? <><Save size={11}/> Save Changes</> : <><Edit3 size={11}/> Edit Profile</>}
            </button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            {[
              { label:"Full Name",    key:"fullName", icon:User,    type:"text" },
              { label:"Email",        key:"email",    icon:Mail,    type:"email" },
              { label:"Phone",        key:"phone",    icon:Phone,   type:"tel" },
              { label:"Location",     key:"location", icon:MapPin,  type:"text" },
              { label:"Role / Title", key:"role",     icon:Shield,  type:"text", full:true },
              { label:"Bio",          key:"bio",      icon:FileText,type:"text", full:true },
            ].map((field) => (
              <div key={field.key} style={{ gridColumn:field.full?"span 2":"auto" }}>
                <label style={{ fontSize:9, fontWeight:700, color:T.textDim, letterSpacing:"0.08em", display:"block", marginBottom:5, fontFamily:"'JetBrains Mono',monospace" }}>
                  {field.label.toUpperCase()}
                </label>
                <div style={{ display:"flex", alignItems:"center", gap:8, background:editMode?T.bg:T.bg, border:`1px solid ${editMode?`${T.brand}25`:T.border}`, borderRadius:10, padding:"9px 12px" }}>
                  <field.icon size={13} style={{ color:T.textDim, flexShrink:0 }}/>
                  <input value={form[field.key]} readOnly={!editMode}
                    onChange={e => setForm(f => ({...f,[field.key]:e.target.value}))}
                    type={field.type}
                    placeholder={editMode ? `Enter ${field.label.toLowerCase()}` : "—"}
                    style={{ border:"none", background:"transparent", outline:"none", fontSize:12, color:T.text, width:"100%", fontFamily:"'Nunito',sans-serif", fontWeight:500 }}/>
                </div>
              </div>
            ))}
          </div>

          {(user?.badges||[]).length > 0 && (
            <div style={{ marginTop:20, paddingTop:18, borderTop:`1px solid ${T.border}` }}>
              <h4 style={{ fontSize:10, fontWeight:700, color:T.textDim, margin:"0 0 11px", letterSpacing:"0.1em", fontFamily:"'JetBrains Mono',monospace" }}>ACHIEVEMENTS</h4>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {user.badges.map((b, i) => (
                  <div key={i} style={{ textAlign:"center", padding:"8px 12px", background:T.bg, border:`1px solid ${T.border}`, borderRadius:10 }}>
                    <div style={{ fontSize:18, lineHeight:1 }}>{b.emoji||"🏅"}</div>
                    <p style={{ fontSize:9, color:T.textMd, marginTop:4, fontWeight:700 }}>{b.label||b}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PAGE: SETTINGS ───────────────────────────────────────────────────────────
function SettingsPage({ user, onUserUpdate }) {
  const [tab, setTab]           = useState("password");
  const [pw, setPw]             = useState({ current:"", newPw:"", confirm:"" });
  const [showPw, setShowPw]     = useState({ current:false, newPw:false, confirm:false });
  const [pwStatus, setPwStatus] = useState(null);
  const [notifs, setNotifs]     = useState({
    email:   user?.notifPrefs?.email   ?? true,
    push:    user?.notifPrefs?.push    ?? true,
    threats: user?.notifPrefs?.threats ?? true,
    weekly:  user?.notifPrefs?.weekly  ?? false,
  });
  const [twoFa, setTwoFa] = useState(user?.twoFaEnabled ?? true);

  const tabs = [
    { id:"password",      label:"Password",      icon:Key },
    { id:"notifications", label:"Notifications", icon:Bell },
    { id:"security",      label:"Security",      icon:Shield },
    { id:"danger",        label:"Danger Zone",   icon:AlertTriangle },
  ];

  const pwStr = (p) => {
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const str    = pwStr(pw.newPw);
  const strLbl = ["Too short","Weak","Fair","Strong","Very Strong"];
  const strClr = [T.textDim, T.red, T.amber, "#65A30D", T.green];

  const handlePwChange = async () => {
    if (!pw.current || !pw.newPw || !pw.confirm) { setPwStatus({ type:"error", msg:"All fields are required." }); return; }
    if (pw.newPw !== pw.confirm) { setPwStatus({ type:"error", msg:"Passwords do not match." }); return; }
    if (str < 2) { setPwStatus({ type:"error", msg:"Password is too weak." }); return; }
    setPwStatus({ type:"loading" });
    try {
      const res = await fetch("/api/auth/password", {
        method:"PUT",
        headers:{ "Content-Type":"application/json", "Authorization":`Bearer ${localStorage.getItem("token")}` },
        body:JSON.stringify({ currentPassword:pw.current, newPassword:pw.newPw }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed");
      setPwStatus({ type:"success", msg:"Password updated successfully." });
      setPw({ current:"", newPw:"", confirm:"" });
    } catch (err) {
      setPwStatus({ type:"error", msg: err.message || "Failed to update password." });
    }
  };

  const Toggle = ({ checked, onChange, color=T.brand }) => (
    <div onClick={() => onChange(!checked)} style={{ width:40, height:20, borderRadius:99, background:checked?color:"#D1D5DB", cursor:"pointer", transition:"background .2s", position:"relative", flexShrink:0 }}>
      <div style={{ width:14, height:14, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left:checked?23:3, transition:"left .2s", boxShadow:"0 1px 4px rgba(0,0,0,0.2)" }}/>
    </div>
  );

  return (
    <div style={{ display:"grid", gridTemplateColumns:"200px 1fr", gap:16 }}>
      <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:16, padding:"12px 8px", height:"fit-content", boxShadow:T.sh }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ width:"100%", display:"flex", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:9, border:"none", background:tab===t.id?(t.id==="danger"?T.redDim:`${T.brand}10`):"transparent", color:tab===t.id?(t.id==="danger"?T.red:T.brand):T.textMd, cursor:"pointer", fontFamily:"'Nunito',sans-serif", fontSize:12, fontWeight:tab===t.id?700:500, marginBottom:2, textAlign:"left" }}>
            <t.icon size={13}/>{t.label}
          </button>
        ))}
      </div>

      <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:16, padding:24, boxShadow:T.sh }}>
        {tab==="password" && (
          <div>
            <h3 style={{ fontSize:14, fontWeight:800, color:T.text, margin:"0 0 20px", fontFamily:"'Syne',sans-serif" }}>Change Password</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:14, maxWidth:420 }}>
              {[
                { label:"Current Password",    key:"current" },
                { label:"New Password",         key:"newPw" },
                { label:"Confirm New Password", key:"confirm" },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize:9, fontWeight:700, color:T.textDim, letterSpacing:"0.08em", display:"block", marginBottom:5, fontFamily:"'JetBrains Mono',monospace" }}>{f.label.toUpperCase()}</label>
                  <div style={{ display:"flex", alignItems:"center", gap:8, background:T.bg, border:`1px solid ${T.border}`, borderRadius:10, padding:"9px 12px" }}>
                    <Key size={13} style={{ color:T.textDim, flexShrink:0 }}/>
                    <input value={pw[f.key]} onChange={e => setPw(p => ({...p,[f.key]:e.target.value}))} type={showPw[f.key]?"text":"password"}
                      style={{ border:"none", background:"transparent", outline:"none", fontSize:13, color:T.text, width:"100%", fontFamily:"'Nunito',sans-serif" }}/>
                    <button onClick={() => setShowPw(s => ({...s,[f.key]:!s[f.key]}))} style={{ border:"none", background:"none", cursor:"pointer", color:T.textDim, padding:0, display:"flex" }}>
                      {showPw[f.key] ? <EyeOff size={13}/> : <Eye size={13}/>}
                    </button>
                  </div>
                </div>
              ))}
              {pw.newPw && (
                <div>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:T.textMd, marginBottom:5 }}>
                    <span>Strength</span>
                    <span style={{ fontWeight:700, color:strClr[str] }}>{strLbl[str]}</span>
                  </div>
                  <div style={{ display:"flex", gap:4 }}>
                    {[1,2,3,4].map(i => (
                      <div key={i} style={{ flex:1, height:3, borderRadius:99, background:i<=str?strClr[str]:"#E5E7EB", transition:"background .3s" }}/>
                    ))}
                  </div>
                </div>
              )}
              {pwStatus && (
                <div style={{ padding:"10px 13px", borderRadius:10, background:pwStatus.type==="success"?T.greenDim:pwStatus.type==="error"?T.redDim:`${T.brand}08`, display:"flex", alignItems:"center", gap:8 }}>
                  {pwStatus.type==="loading" ? <Loader2 size={13} style={{ color:T.brand }} className="spin"/> : pwStatus.type==="success" ? <CheckCircle2 size={13} style={{ color:T.green }}/> : <AlertCircle size={13} style={{ color:T.red }}/>}
                  <span style={{ fontSize:11, fontWeight:600, color:pwStatus.type==="success"?T.green:pwStatus.type==="error"?T.red:T.brand }}>
                    {pwStatus.type==="loading" ? "Updating…" : pwStatus.msg}
                  </span>
                </div>
              )}
              <button onClick={handlePwChange} style={{ padding:"11px 20px", borderRadius:11, border:"none", background:`linear-gradient(135deg,${T.brand},${T.violet})`, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
                Update Password
              </button>
            </div>
          </div>
        )}

        {tab==="notifications" && (
          <div>
            <h3 style={{ fontSize:14, fontWeight:800, color:T.text, margin:"0 0 20px", fontFamily:"'Syne',sans-serif" }}>Notification Preferences</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:10, maxWidth:480 }}>
              {[
                { key:"email",   label:"Email Notifications",   desc:"Threat alerts via email",             icon:Mail },
                { key:"push",    label:"Push Notifications",     desc:"Real-time browser notifications",     icon:Bell },
                { key:"threats", label:"Critical Threat Alerts", desc:"Alerts for critical security events",  icon:ShieldAlert },
                { key:"weekly",  label:"Weekly Digest",          desc:"Summary every Monday",                icon:BarChart2 },
              ].map(item => (
                <div key={item.key} style={{ display:"flex", alignItems:"center", gap:11, padding:"13px 15px", background:T.bg, border:`1px solid ${T.border}`, borderRadius:12 }}>
                  <div style={{ width:34, height:34, borderRadius:9, background:notifs[item.key]?`${T.brand}10`:"#F3F4F6", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <item.icon size={14} style={{ color:notifs[item.key]?T.brand:T.textDim }}/>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:T.text }}>{item.label}</div>
                    <div style={{ fontSize:10, color:T.textMd }}>{item.desc}</div>
                  </div>
                  <Toggle checked={notifs[item.key]} onChange={v => setNotifs(n => ({...n,[item.key]:v}))}/>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==="security" && (
          <div>
            <h3 style={{ fontSize:14, fontWeight:800, color:T.text, margin:"0 0 20px", fontFamily:"'Syne',sans-serif" }}>Security Settings</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:10, maxWidth:480 }}>
              <div style={{ padding:"14px 16px", background:T.bg, border:`1px solid ${T.border}`, borderRadius:12, display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:twoFa?T.greenDim:T.redDim, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {twoFa ? <Lock size={15} style={{ color:T.green }}/> : <Unlock size={15} style={{ color:T.red }}/>}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:T.text }}>Two-Factor Authentication</div>
                  <div style={{ fontSize:10, color:T.textMd }}>Adds extra layer of security to your account</div>
                </div>
                <Toggle checked={twoFa} color={T.green} onChange={v => { setTwoFa(v); onUserUpdate?.({ twoFaEnabled:v }); }}/>
              </div>

              <div style={{ padding:"14px 16px", background:T.bg, border:`1px solid ${T.border}`, borderRadius:12 }}>
                <div style={{ fontSize:10, fontWeight:700, color:T.textDim, marginBottom:8, fontFamily:"'JetBrains Mono',monospace" }}>SESSION INFO</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  {[
                    { l:"Last Login",  v:user?.lastLoginDate ? new Date(user.lastLoginDate).toLocaleString("en-IN") : "Today" },
                    { l:"Streak",      v:`${user?.loginStreak||0} days` },
                    { l:"Level",       v:`Level ${computeLevel(user?.score||0).level}` },
                    { l:"Account",     v:user?.createdAt ? fmtDate(user.createdAt) : "Recent" },
                  ].map((s, i) => (
                    <div key={i} style={{ background:T.surface, borderRadius:8, padding:"8px 10px", border:`1px solid ${T.border}` }}>
                      <div style={{ fontSize:8, color:T.textDim, marginBottom:3, fontFamily:"'JetBrains Mono',monospace" }}>{s.l}</div>
                      <div style={{ fontSize:11, color:T.text, fontWeight:700 }}>{s.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab==="danger" && (
          <div>
            <h3 style={{ fontSize:14, fontWeight:800, color:T.red, margin:"0 0 20px", fontFamily:"'Syne',sans-serif" }}>Danger Zone</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:10, maxWidth:480 }}>
              {[
                { title:"Export My Data",     desc:"Download your account data as JSON", color:T.brand, btn:"Export",
                  action:() => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(user,null,2)],{type:"application/json"})); a.download = "cybershield-data.json"; a.click(); }},
                { title:"Reset All Progress", desc:"Wipe all XP, scores, quiz history and badges", color:T.amber, btn:"Reset",
                  action:() => { if(window.confirm("Reset all progress? This cannot be undone.") && onUserUpdate) onUserUpdate({score:0,xp:0,level:1,loginStreak:0,quizzesDone:0,quizHistory:[],badges:[],phishingSimCorrect:0,phishingSimTotal:0}); }},
                { title:"Delete Account",     desc:"Permanently delete your account and all data", color:T.red, btn:"Delete",
                  action:() => { if(window.prompt("Type DELETE to confirm:") === "DELETE") { localStorage.clear(); window.location.href="/"; } }},
              ].map((item, i) => (
                <div key={i} style={{ padding:"14px 16px", background:`${item.color}04`, border:`1px solid ${item.color}18`, borderRadius:12, display:"flex", alignItems:"center", gap:13 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:T.text }}>{item.title}</div>
                    <div style={{ fontSize:10, color:T.textMd }}>{item.desc}</div>
                  </div>
                  <button onClick={item.action} style={{ padding:"7px 14px", borderRadius:9, border:`1px solid ${item.color}20`, background:`${item.color}08`, color:item.color, fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
                    {item.btn}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PAGE: LEADERBOARD ────────────────────────────────────────────────────────
function LeaderboardPage({ user }) {
  const [loading,   setLoading]   = useState(true);
  const [board,     setBoard]     = useState([]);
  const [tab,       setTab]       = useState("score");
  const [usingMock, setUsingMock] = useState(false);

  const buildUserEntry = useCallback(u => ({
    userId:      u?._id || u?.id || "current",
    name:        getFullName(u),
    role:        u?.role || "Student",
    level:       computeLevel(u?.score||0).level,
    score:       u?.score || 0,
    xp:          u?.xp || u?.score || 0,
    quizzesDone: u?.quizzesDone || 0,
    loginStreak: u?.loginStreak || 0,
    avatar:      u?.avatar || null,
    isSelf:      true,
  }), []);

  const buildBoard = useCallback((backendRows, useMock) => {
    const me   = buildUserEntry(user);
    const myId = me.userId;
    const base = (useMock ? [...MOCK_LEADERBOARD] : [...backendRows])
      .filter(e => e.userId !== myId && !e.isSelf);
    const merged = [...base, me];
    merged.sort((a,b) => {
      if (tab==="xp")     return b.xp - a.xp;
      if (tab==="quiz")   return b.quizzesDone - a.quizzesDone;
      if (tab==="streak") return b.loginStreak - a.loginStreak;
      return b.score - a.score;
    });
    setBoard(merged);
  }, [tab, user, buildUserEntry]);

  const fetchBoard = useCallback(() => {
    setLoading(true);
    fetch(`/api/leaderboard?sort=${tab}`, {
      headers:{ Authorization:`Bearer ${localStorage.getItem("token")}` },
    })
      .then(r => { if(!r.ok) throw new Error(); return r.json(); })
      .then(data => {
        const myId   = user?._id || user?.id;
        const others = Array.isArray(data) ? data.filter(e => e.userId!==myId && !e.isSelf) : [];
        if (others.length >= 3) { buildBoard(others, false); setUsingMock(false); }
        else { buildBoard([], true); setUsingMock(true); }
      })
      .catch(() => { buildBoard([], true); setUsingMock(true); })
      .finally(() => setLoading(false));
  }, [tab, user, buildBoard]);

  useEffect(() => { fetchBoard(); }, [fetchBoard]);

  const myRank = board.findIndex(e => e.isSelf) + 1;

  const rankIcon = (rank) => {
    if (rank===1) return <Crown size={15} style={{ color:"#D97706" }}/>;
    if (rank===2) return <Medal size={15} style={{ color:"#6B7280" }}/>;
    if (rank===3) return <Medal size={15} style={{ color:"#92400E" }}/>;
    return <span style={{ fontSize:11, fontWeight:700, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>#{rank}</span>;
  };

  const sortVal = e => {
    if (tab==="xp")     return `${(e.xp||0).toLocaleString()} XP`;
    if (tab==="quiz")   return `${e.quizzesDone||0} done`;
    if (tab==="streak") return `🔥 ${e.loginStreak||0}d`;
    return (e.score||0).toLocaleString();
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ background:T.card, border:`1px solid ${T.brand}18`, borderRadius:20, padding:"18px 22px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:13 }}>
          <div style={{ width:48, height:48, borderRadius:14, background:`linear-gradient(135deg,${T.brand},${T.violet})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Trophy size={20} style={{ color:"#fff" }}/>
          </div>
          <div>
            <h2 style={{ fontSize:17, fontWeight:800, color:T.text, margin:"0 0 2px", fontFamily:"'Syne',sans-serif" }}>Global Leaderboard</h2>
            <p style={{ fontSize:11, color:T.textMd, margin:0 }}>
              Rankings based on real activity
              {usingMock && <span style={{ marginLeft:8, fontSize:9, color:T.amber, fontWeight:700, background:T.amberDim, border:`1px solid ${T.amber}20`, borderRadius:99, padding:"1px 7px" }}>Demo Data</span>}
            </p>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          {myRank > 0 && (
            <div style={{ background:T.bg, border:`1px solid ${T.border}`, borderRadius:12, padding:"11px 16px", textAlign:"center", boxShadow:T.sh }}>
              <div style={{ fontSize:22, fontWeight:800, color:T.brand, fontFamily:"'Syne',sans-serif" }}>#{myRank}</div>
              <div style={{ fontSize:9, color:T.textMd, fontWeight:600 }}>Your Rank</div>
            </div>
          )}
          <button onClick={fetchBoard} style={{ width:34, height:34, borderRadius:9, border:`1px solid ${T.border}`, background:T.bg, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <RefreshCw size={13} style={{ color:T.textMd }}/>
          </button>
        </div>
      </div>

      <div style={{ display:"flex", gap:7 }}>
        {[{id:"score",l:"Score"},{id:"xp",l:"XP"},{id:"quiz",l:"Quizzes"},{id:"streak",l:"Streak"}].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding:"6px 15px", borderRadius:8, border:`1px solid ${tab===t.id?T.brand:T.border}`, background:tab===t.id?`${T.brand}10`:T.card, color:tab===t.id?T.brand:T.textMd, fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"'Nunito',sans-serif", transition:"all .15s" }}>
            {t.l}
          </button>
        ))}
      </div>

      {usingMock && (
        <div style={{ background:T.amberDim, border:`1px solid ${T.amber}20`, borderRadius:12, padding:"11px 16px", display:"flex", alignItems:"center", gap:9 }}>
          <AlertTriangle size={13} style={{ color:T.amber, flexShrink:0 }}/>
          <span style={{ fontSize:11, color:T.textMd }}>
            Demo mode — showing sample leaderboard. Your real stats (score: {user?.score||0}, streak: {user?.loginStreak||0}d) are in your highlighted row.
          </span>
        </div>
      )}

      <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:18, overflow:"hidden", boxShadow:T.sh }}>
        {loading ? (
          <div style={{ padding:"48px", textAlign:"center", color:T.textDim, display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
            <Loader2 size={16} className="spin"/> Loading leaderboard…
          </div>
        ) : (
          <>
            <div style={{ display:"grid", gridTemplateColumns:"56px 1fr 130px 80px 80px 80px", padding:"9px 18px", background:T.bg, borderBottom:`1px solid ${T.border}`, fontSize:8, fontWeight:700, color:T.textDim, letterSpacing:"0.1em", fontFamily:"'JetBrains Mono',monospace" }}>
              <span>RANK</span><span>USER</span>
              <span>{tab==="score"?"SCORE":tab==="xp"?"XP":tab==="quiz"?"QUIZZES":"STREAK"}</span>
              <span>QUIZZES</span><span>XP</span><span>STREAK</span>
            </div>
            {board.map((entry, i) => {
              const isMe  = !!entry.isSelf;
              const rank  = i + 1;
              const top3  = rank <= 3;
              const bLeft = isMe?T.brand:rank===1?"#D97706":rank===2?"#6B7280":rank===3?"#92400E":"transparent";
              return (
                <div key={entry.userId||i}
                  style={{ display:"grid", gridTemplateColumns:"56px 1fr 130px 80px 80px 80px", padding:"12px 18px", borderBottom:i<board.length-1?`1px solid ${T.border}`:"none", background:isMe?`${T.brand}06`:top3?`${T.brand}02`:"transparent", transition:"background .12s", borderLeft:`3px solid ${bLeft}` }}
                  onMouseEnter={e => { if(!isMe) e.currentTarget.style.background=T.surfaceHov; }}
                  onMouseLeave={e => { if(!isMe) e.currentTarget.style.background=top3?`${T.brand}02`:"transparent"; }}>
                  <div style={{ display:"flex", alignItems:"center" }}>{rankIcon(rank)}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                    <div style={{ width:34, height:34, borderRadius:9, flexShrink:0, overflow:"hidden", background:isMe?`linear-gradient(135deg,${T.brand},${T.violet})`:"#E5E7EB", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, color:isMe?"#fff":T.textMd }}>
                      {entry.avatar ? <img src={entry.avatar} alt="" style={{ width:34,height:34,objectFit:"cover" }}/> : (entry.name||"?").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize:12, fontWeight:isMe?800:600, color:isMe?T.brand:T.text, display:"flex", alignItems:"center", gap:5, fontFamily:"'Syne',sans-serif" }}>
                        {entry.name || "Anonymous"}
                        {isMe && <span style={{ fontSize:8, background:T.brand, color:"#fff", borderRadius:99, padding:"1px 6px", fontWeight:700 }}>YOU</span>}
                        {rank===1 && !isMe && <span style={{ fontSize:8, background:T.amberDim, color:T.amber, borderRadius:99, padding:"1px 6px", fontWeight:700, border:`1px solid ${T.amber}20` }}>👑 TOP</span>}
                      </div>
                      <div style={{ fontSize:9, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>{entry.role} · Lv.{entry.level||1}</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center" }}>
                    <span style={{ fontSize:13, fontWeight:800, color:isMe?T.brand:top3?T.text:T.textMd, fontFamily:"'Syne',sans-serif" }}>{sortVal(entry)}</span>
                  </div>
                  <span style={{ fontSize:11, color:T.textMd, alignSelf:"center" }}>{entry.quizzesDone||0}</span>
                  <span style={{ fontSize:11, color:T.textMd, alignSelf:"center" }}>{(entry.xp||0).toLocaleString()}</span>
                  <span style={{ fontSize:11, alignSelf:"center", color:isMe&&(entry.loginStreak||0)>0?T.amber:T.textMd, fontWeight:isMe?700:400 }}>🔥 {entry.loginStreak||0}d</span>
                </div>
              );
            })}
          </>
        )}
      </div>

      <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:16, padding:"14px 18px", boxShadow:T.sh }}>
        <div style={{ fontSize:9, fontWeight:700, color:T.textDim, marginBottom:11, letterSpacing:"0.1em", fontFamily:"'JetBrains Mono',monospace" }}>YOUR CURRENT STATS</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:11 }}>
          {[
            { l:"Score",   v:(user?.score||0).toLocaleString(), c:T.brand,  e:"⭐" },
            { l:"XP",      v:(user?.score||0).toLocaleString(), c:T.violet, e:"⚡" },
            { l:"Quizzes", v:user?.quizzesDone||0,               c:T.teal,   e:"🧠" },
            { l:"Streak",  v:`${user?.loginStreak||0} days`,     c:T.amber,  e:"🔥" },
          ].map((s, i) => (
            <div key={i} style={{ background:T.bg, borderRadius:12, padding:"12px 14px", textAlign:"center", border:`1px solid ${s.c}12` }}>
              <div style={{ fontSize:18, marginBottom:4 }}>{s.e}</div>
              <div style={{ fontSize:18, fontWeight:800, color:s.c, fontFamily:"'Syne',sans-serif" }}>{s.v}</div>
              <div style={{ fontSize:10, color:T.textMd, marginTop:2 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── STUB PAGES ───────────────────────────────────────────────────────────────
const StubPage = ({ emoji, title, desc, btnLabel, btnColor, onAction }) => (
  <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:24, padding:"52px 40px", textAlign:"center", boxShadow:T.sh }}>
    <div style={{ fontSize:52, marginBottom:16 }}>{emoji}</div>
    <h2 style={{ fontSize:24, fontWeight:800, color:T.text, fontFamily:"'Syne',sans-serif", margin:"0 0 10px" }}>{title}</h2>
    <p style={{ fontSize:13, color:T.textMd, margin:"0 0 28px", maxWidth:440, marginInline:"auto", lineHeight:1.7 }}>{desc}</p>
    <button onClick={onAction} style={{ padding:"12px 32px", borderRadius:12, border:"none", background:`linear-gradient(135deg,${btnColor},${btnColor}cc)`, color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
      {btnLabel}
    </button>
  </div>
);

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();

  const { user: dashUser } = useDashboardUser();

  const [page,       setPage]      = useState("overview");
  const [collapsed,  setCollapsed] = useState(false);
  const [showNotif,  setShowNotif] = useState(false);
  const [showSearch, setShowSearch]= useState(false);
  const [notifRead,  setNotifRead] = useState(false);

  const [user, setUser] = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("user") || "null");
      if (!raw) return null;
      const resolved = { ...raw, _id: raw._id || raw.id };
      if (!resolved.fullName) {
        if (raw.name) resolved.fullName = raw.name;
        else if (raw.username) resolved.fullName = raw.username;
        else if (raw.firstName || raw.lastName) resolved.fullName = `${raw.firstName||""} ${raw.lastName||""}`.trim();
      }
      return resolved;
    } catch { return null; }
  });

  useEffect(() => {
    if (dashUser) {
      setUser(prev => {
        const merged = { ...prev, ...dashUser, _id: dashUser._id || dashUser.id || prev?._id };
        if (!merged.fullName) {
          if (dashUser.name) merged.fullName = dashUser.name;
          else if (dashUser.username) merged.fullName = dashUser.username;
        }
        return merged;
      });
    }
  }, [dashUser]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("/api/auth/me", { headers:{ Authorization:`Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        if (data?.user) {
          const raw   = data.user;
          const fresh = { ...raw, _id: raw._id || raw.id };
          if (!fresh.fullName) {
            if (raw.name) fresh.fullName = raw.name;
            else if (raw.username) fresh.fullName = raw.username;
            else if (raw.firstName || raw.lastName) fresh.fullName = `${raw.firstName||""} ${raw.lastName||""}`.trim();
          }
          const { streak, updated, lastDate } = computeStreak(fresh);
          if (updated) {
            fresh.loginStreak   = streak;
            fresh.lastLoginDate = lastDate;
            fetch("/api/auth/profile", {
              method:"PUT",
              headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token}` },
              body:JSON.stringify({ loginStreak:streak, lastLoginDate:lastDate }),
            }).catch(() => {});
          }
          setUser(fresh);
          localStorage.setItem("user", JSON.stringify(fresh));
        }
      })
      .catch(() => {
        try {
          const raw = localStorage.getItem("user");
          if (raw) {
            const cached = JSON.parse(raw);
            const { streak, updated, lastDate } = computeStreak(cached);
            if (updated) {
              const u2 = { ...cached, loginStreak:streak, lastLoginDate:lastDate };
              setUser(u2);
              localStorage.setItem("user", JSON.stringify(u2));
            }
          }
        } catch {}
      });
  }, []);

  const onUserUpdate = useCallback((updates) => {
    setUser(prev => {
      const merged = { ...prev, ...updates };
      if (updates.score !== undefined) {
        const { level, xp } = computeLevel(updates.score);
        merged.level = level;
        merged.xp    = xp;
      }
      localStorage.setItem("user", JSON.stringify(merged));
      return merged;
    });

    const token = localStorage.getItem("token");
    if (token) {
      setTimeout(() => {
        fetch("/api/auth/me", { headers:{ Authorization:`Bearer ${token}` } })
          .then(r => r.json())
          .then(data => {
            if (data?.user) {
              const raw   = data.user;
              const fresh = { ...raw, _id:raw._id||raw.id };
              if (!fresh.fullName && (raw.name || raw.username)) {
                fresh.fullName = raw.name || raw.username;
              }
              setUser(prev => {
                const merged = {
                  ...fresh,
                  fullName:           prev?.fullName || fresh.fullName,
                  score:              Math.max(fresh.score||0, prev?.score||0),
                  xp:                 Math.max(fresh.xp||0,    prev?.xp||0),
                  level:              Math.max(fresh.level||1, prev?.level||1),
                  quizzesDone:        Math.max(fresh.quizzesDone||0, prev?.quizzesDone||0),
                  loginStreak:        Math.max(fresh.loginStreak||0, prev?.loginStreak||0),
                  phishingSimCorrect: Math.max(fresh.phishingSimCorrect||0, prev?.phishingSimCorrect||0),
                  phishingSimTotal:   Math.max(fresh.phishingSimTotal||0,   prev?.phishingSimTotal||0),
                  quizHistory: (prev?.quizHistory?.length||0) > (fresh.quizHistory?.length||0) ? prev.quizHistory : fresh.quizHistory,
                  badges:      (prev?.badges?.length||0) > (fresh.badges?.length||0) ? prev.badges : fresh.badges,
                  avatar:      prev?.avatar || fresh.avatar,
                  recentActivity: prev?.recentActivity || fresh.recentActivity || [],
                };
                localStorage.setItem("user", JSON.stringify(merged));
                return merged;
              });
            }
          })
          .catch(() => {});
      }, 800);
    }
  }, []);

  const handleSaveGameScore = useCallback(async (finalScore, wave) => {
    await saveGameScore({ score: finalScore, wavesCompleted: wave });
  }, []);

  useEffect(() => {
    const handler = e => {
      if ((e.metaKey || e.ctrlKey) && e.key==="k") { e.preventDefault(); setShowSearch(s => !s); }
      if (e.key==="Escape") { setShowNotif(false); setShowSearch(false); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (!showNotif) return;
    const handler = e => { if (!e.target.closest("[data-notif]")) setShowNotif(false); };
    setTimeout(() => document.addEventListener("click", handler), 0);
    return () => document.removeEventListener("click", handler);
  }, [showNotif]);

  const notifList  = generateNotifications(user);
  const notifCount = notifRead ? 0 : notifList.filter(n => !n.read).length;
  const sideW      = collapsed ? 64 : 236;

  const renderPage = () => {
    switch(page) {
      case "overview":    return <OverviewPage    user={user} setPage={setPage} navigate={navigate}/>;
      case "threats":     return <ThreatsPage/>;
      case "phishing":    return <PhishingPage    user={user} onUserUpdate={onUserUpdate}/>;
      case "reports":     return <ReportsPage     user={user} navigate={navigate} setPage={setPage}/>;
      case "profile":     return <ProfilePage     user={user} onUserUpdate={onUserUpdate}/>;
      case "settings":    return <SettingsPage    user={user} onUserUpdate={onUserUpdate}/>;
      case "leaderboard": return <LeaderboardPage user={user}/>;
      case "courses":     return <StubPage emoji="📚" title="Learning Courses" desc="Your courses live on a dedicated page. Progress and certificates sync back to your profile automatically." btnLabel="Browse Courses" btnColor={T.teal} onAction={() => navigate("/courses")}/>;
      case "quiz":        return <StubPage emoji="🧠" title="Quiz Center" desc="Quizzes are linked to individual courses. Pick a course to unlock its quiz and earn XP." btnLabel="Go to Courses" btnColor={T.brand} onAction={() => navigate("/courses")}/>;
      case "game":        return <StubPage emoji="🛡️" title="CyberDefense Game" desc="Your game module runs on its own page. Defend systems from attacks and earn massive XP." btnLabel="Launch Game" btnColor={T.violet} onAction={() => navigate("/game")}/>;
      default:            return <OverviewPage    user={user} setPage={setPage} navigate={navigate}/>;
    }
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:T.bg, fontFamily:"'Nunito',sans-serif", color:T.text }}>
      <G/>
      <Sidebar page={page} setPage={setPage} user={user} navigate={navigate} collapsed={collapsed} setCollapsed={setCollapsed}/>
      <div style={{ flex:1, marginLeft:sideW, display:"flex", flexDirection:"column", transition:"margin-left .25s cubic-bezier(.16,1,.3,1)" }}>
        <TopBar page={page} user={user} notifCount={notifCount}
          onNotifClick={() => setShowNotif(s => !s)}
          onProfileClick={() => setPage("profile")}
          onSearchClick={() => setShowSearch(true)}/>
        {showNotif && (
          <div data-notif>
            <NotificationPanel user={user} onClose={() => setShowNotif(false)} onMarkRead={() => { setNotifRead(true); setShowNotif(false); }}/>
          </div>
        )}
        {showSearch && <SearchOverlay onClose={() => setShowSearch(false)} setPage={setPage} navigate={navigate}/>}
        <main style={{ flex:1, padding:"20px 24px", overflowY:"auto" }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}