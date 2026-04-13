import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboardUser } from './hooks/useDashboardUser';
import { saveGameScore } from '../utils/saveGameScore';
import SecurityScorePage from './SecurityScorePage';
import FraudDetectionPage from './FraudDetectionPage';
import IncidentReportPage from './IncidentReportPage';
import AchievementsPage from './AchievementsPage';
import CommunityPage from './CommunityPage';
import ThreatsPage from '../ThreatsPage';
import {
  Shield, Brain, Mail, BarChart2, Bell, Search, Menu,
  Zap, X, Award, Activity, CheckCircle,
  Gamepad2, GraduationCap, ShieldAlert, Flame,
  Loader2, RefreshCw, Star, TrendingUp,
  AlertTriangle, Eye, Lock, Unlock,
  FileText, User, Camera, Key,
  Phone, MapPin, Save,
  CheckCircle2, AlertCircle, Home,
  Settings, LogOut, ChevronRight, ChevronLeft, Plus,
  Rocket, Trophy, Medal, Crown,
  FileDown, Send, EyeOff, Edit3,
  Clock, ArrowUpRight, MessageSquare, Bot,
  Wifi, WifiOff, Target,
  TrendingDown, Radio
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar, LineChart, Line,
} from "recharts";
import LogoIcon from '../components/common/LogoIcon';

// ─── THEME ────────────────────────────────────────────────────────────────────
const T = {
  bg: "#F0F2F8",
  surface: "#FFFFFF",
  surfaceHov: "#F5F7FF",
  card: "#FFFFFF",
  border: "rgba(99,102,241,0.14)",
  borderHov: "rgba(99,102,241,0.32)",
  brand: "#4F46E5",
  brandDark: "#3730A3",
  brandGlow: "rgba(79,70,229,0.18)",
  teal: "#0D9488",
  tealDim: "rgba(13,148,136,0.10)",
  violet: "#7C3AED",
  amber: "#D97706",
  amberDim: "rgba(217,119,6,0.10)",
  red: "#DC2626",
  redDim: "rgba(220,38,38,0.08)",
  green: "#059669",
  greenDim: "rgba(5,150,105,0.10)",
  pink: "#DB2777",
  pinkDim: "rgba(219,39,119,0.10)",
  text: "#111827",
  textMd: "#4B5563",
  textDim: "#9CA3AF",
  sh: "0 1px 4px rgba(0,0,0,0.07)",
  shMd: "0 4px 20px rgba(0,0,0,0.10)",
};

// ─── API BASE ─────────────────────────────────────────────────────────────────
const API = {
  headers: () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  }),
  get: (url) => fetch(url, { headers: API.headers() }).then(r => r.ok ? r.json() : Promise.reject(r)),
  post: (url, body) => fetch(url, { method: "POST", headers: API.headers(), body: JSON.stringify(body) }).then(r => r.json()),
  put: (url, body) => fetch(url, { method: "PUT", headers: API.headers(), body: JSON.stringify(body) }).then(r => r.json()),
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmtDate = d => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "";
const fmtTime = d => d ? new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "";

const getFullName = (u) => {
  if (!u) return "";
  if (u.fullName?.trim()) return u.fullName.trim();
  if (u.name?.trim()) return u.name.trim();
  if (u.username?.trim()) return u.username.trim();
  if (u.firstName || u.lastName) return `${u.firstName || ""} ${u.lastName || ""}`.trim();
  if (u.email) return u.email.split("@")[0];
  return "User";
};

const firstName = (u) => getFullName(u).split(" ")[0] || "User";

const computeStreak = (user) => {
  // Streak calculation is now handled on backend (getMe endpoint)
  // Just return the values from server
  return {
    streak: user?.loginStreak || 1,
    updated: false,
    lastDate: user?.lastLoginDate || new Date().toISOString()
  };
};

const computeLevel = (score) => {
  const xp = score || 0;
  const level = Math.floor(xp / 500) + 1;
  return { level, xp, xpInLevel: xp % 500, xpPct: Math.min(100, Math.round(((xp % 500) / 500) * 100)) };
};

const SEV = {
  critical: { color: "#DC2626", bg: "rgba(220,38,38,0.08)", label: "Critical" },
  high: { color: "#EA580C", bg: "rgba(234,88,12,0.08)", label: "High" },
  medium: { color: "#D97706", bg: "rgba(217,119,6,0.08)", label: "Medium" },
  low: { color: "#059669", bg: "rgba(5,150,105,0.08)", label: "Low" },
};

const STATUS_C = {
  active: "#DC2626", blocked: "#059669", mitigating: "#D97706",
  investigating: "#7C3AED", contained: "#0D9488", quarantined: "#4F46E5",
};

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Nunito:wght@400;500;600;700;800&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    @keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
    @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
    @keyframes countUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
    @keyframes ping{0%{transform:scale(1);opacity:0.8}80%,100%{transform:scale(2.4);opacity:0}}
    @keyframes radar{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
    .fu{animation:fadeUp .35s cubic-bezier(.16,1,.3,1) both}
    .fu1{animation-delay:.05s}.fu2{animation-delay:.1s}.fu3{animation-delay:.15s}.fu4{animation-delay:.2s}.fu5{animation-delay:.25s}
    .spin{animation:spin 1s linear infinite}
    ::-webkit-scrollbar{width:4px;height:4px}
    ::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:rgba(79,70,229,0.18);border-radius:4px}
    ::-webkit-scrollbar-thumb:hover{background:rgba(79,70,229,0.35)}
    input:-webkit-autofill{-webkit-box-shadow:0 0 0 100px #fff inset!important;-webkit-text-fill-color:#111827!important}
    button:focus-visible{outline:2px solid #4F46E5;outline-offset:2px}
    input:focus{outline:none}
    .ping{animation:ping 1.4s ease-out infinite}
    .radar-sweep{animation:radar 3s linear infinite;transform-origin:center}

    /* ═══ RESPONSIVE GRID CLASSES ═══ */
    .dg6{display:grid;grid-template-columns:repeat(6,1fr);gap:10px}
    .dg4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
    .dg3{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
    .dg2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
    .dg21{display:grid;grid-template-columns:2fr 1fr;gap:14px}
    .dg12{display:grid;grid-template-columns:1fr 300px;gap:14px}
    .dg1a{display:grid;grid-template-columns:1fr 240px;gap:14px}
    .dg22{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
    .dth{display:grid;grid-template-columns:100px 100px 1fr 130px 110px 110px 80px}
    .dqh{display:grid;grid-template-columns:1fr 100px 100px 100px}

    /* ═══ SIDEBAR RESPONSIVE ═══ */
    .dsidebar-overlay{display:none}
    .dmobile-menu-btn{display:none!important}
    .dsearch-desk{display:flex}
    .dsearch-mob{display:none}
    .dhero-circle{display:block}
    .dtopbar-title{font-size:16px}

    /* ═══ TABLET (max 1024px) ═══ */
    @media(max-width:1024px){
      .dg6{grid-template-columns:repeat(3,1fr)}
      .dg4{grid-template-columns:repeat(2,1fr)}
      .dg21{grid-template-columns:1fr}
      .dg12{grid-template-columns:1fr}
      .dg1a{grid-template-columns:1fr}
      .dg3{grid-template-columns:repeat(2,1fr)}
      .dth{grid-template-columns:90px 80px 1fr 100px 90px;}
      .dth>span:nth-child(6),.dth>span:nth-child(7),.dth>div:nth-child(6),.dth>div:nth-child(7){display:none}
      .dqh{grid-template-columns:1fr 80px 80px 80px}
    }

    /* ═══ MOBILE (max 768px) ═══ */
    @media(max-width:768px){
      .dg6{grid-template-columns:repeat(3,1fr);gap:8px}
      .dg4{grid-template-columns:repeat(2,1fr);gap:8px}
      .dg2{grid-template-columns:1fr}
      .dg22{grid-template-columns:1fr}
      .dg3{grid-template-columns:1fr}
      .dg12{grid-template-columns:1fr}
      .dg1a{grid-template-columns:1fr}
      .dmobile-menu-btn{display:flex!important}
      .dsearch-desk{display:none!important}
      .dsearch-mob{display:flex!important}
      .dhero-circle{display:none!important}
      .dtopbar-title{font-size:13px}
      .dth{grid-template-columns:70px 70px 1fr}
      .dth>span:nth-child(n+4),.dth>div:nth-child(n+4){display:none}
      .dqh{grid-template-columns:1fr 70px 70px}
      .dqh>span:nth-child(4),.dqh>div:nth-child(4){display:none}
    }

    /* ═══ SMALL MOBILE (max 480px) ═══ */
    @media(max-width:480px){
      .dg6{grid-template-columns:repeat(2,1fr);gap:6px}
      .dg4{grid-template-columns:1fr;gap:8px}
      .dth{grid-template-columns:1fr}
      .dth>span:nth-child(n+2),.dth>div:nth-child(n+2){display:none}
    }

    /* ═══ SIDEBAR MOBILE OVERLAY ═══ */
    @media(max-width:768px){
      .dsidebar{position:fixed!important;left:-280px!important;width:260px!important;z-index:200!important;transition:left .3s cubic-bezier(.16,1,.3,1)!important;box-shadow:none!important}
      .dsidebar.dsidebar-open{left:0!important;box-shadow:8px 0 30px rgba(0,0,0,0.15)!important}
      .dsidebar-overlay{display:block;position:fixed;inset:0;background:rgba(0,0,0,0.35);z-index:199;backdrop-filter:blur(2px)}
      .dmain-content{margin-left:0!important}
    }

    /* ═══ NOTIFICATION PANEL RESPONSIVE ═══ */
    @media(max-width:768px){
      .dnotif-panel{width:calc(100vw - 20px)!important;right:10px!important;left:10px!important;max-width:100%!important}
    }

    /* ═══ SEARCH OVERLAY RESPONSIVE ═══ */
    @media(max-width:768px){
      .dsearch-overlay-card{width:calc(100vw - 24px)!important;max-width:100%!important;margin:0 12px}
    }

    /* ═══ HERO SECTION RESPONSIVE ═══ */
    @media(max-width:768px){
      .dhero-wrap{padding:16px 14px!important}
      .dhero-inner{flex-direction:column!important}
      .dhero-title{font-size:22px!important}
      .dhero-stats{flex-wrap:wrap!important}
      .dhero-stats>div{min-width:calc(50% - 4px)!important;flex:1 1 calc(50% - 4px)!important}
    }
    @media(max-width:480px){
      .dhero-title{font-size:18px!important}
    }

    /* ═══ TOPBAR RESPONSIVE ═══ */
    @media(max-width:768px){
      .dtopbar{padding:0 12px!important;gap:8px!important}
      .dtopbar-time{display:none!important}
    }

    /* ═══ MAIN CONTENT PADDING ═══ */
    @media(max-width:768px){
      .dmain-area{padding:12px 10px!important}
    }
    @media(max-width:480px){
      .dmain-area{padding:8px 6px!important}
    }

    /* ═══ AI CHAT RESPONSIVE ═══ */
    @media(max-width:1024px){
      .dai-chat-grid{grid-template-columns:1fr!important;gap:12px!important}
      .dai-quick-prompts{grid-column:auto!important}
    }
    @media(max-width:768px){
      .dai-chat-grid{grid-template-columns:1fr!important;gap:10px!important}
      .dai-chat-box{height:calc(100vh - 300px)!important;max-height:450px!important;min-height:300px!important}
      .dai-quick-prompts{width:100%!important;display:grid!important;grid-template-columns:1fr 1fr!important;gap:8px!important;margin-top:0!important}
      .dai-quick-prompts>div:nth-child(2){grid-column:1/-1!important}
    }
    @media(max-width:640px){
      .dai-chat-box{height:calc(100vh - 280px)!important;max-height:350px!important}
      .dai-quick-prompts{grid-template-columns:1fr!important;gap:6px!important}
      .dai-quick-prompts>div:nth-child(2){grid-column:auto!important}
    }
    @media(max-width:480px){
      .dai-chat-box{height:calc(100vh - 240px)!important;max-height:320px!important}
      .dmain-area{padding:8px 6px!important}
    }
    
    /* ═══ AI CHAT MESSAGE BUBBLES ═══ */
    .dai-chat-box div[style*="maxWidth"] {
      max-width: 75% !important;
    }
    @media(max-width:768px) {
      .dai-chat-box div[style*="maxWidth"] {
        max-width: 85% !important;
      }
    }
    @media(max-width:480px) {
      .dai-chat-box div[style*="maxWidth"] {
        max-width: 90% !important;
      }
    }

    /* ═══ PROFILE & SETTINGS LAYOUT ═══ */
    .dprofile-grid{display:grid;grid-template-columns:280px 1fr;gap:16px}
    .dsettings-grid{display:grid;grid-template-columns:200px 1fr;gap:16px}
    .dform-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
    @media(max-width:768px){
      .dprofile-grid{grid-template-columns:1fr}
      .dsettings-grid{grid-template-columns:1fr}
      .dform-grid{grid-template-columns:1fr}
      .dform-grid>[style*="span 2"]{grid-column:auto!important}
    }

    /* ═══ PHISHING SIM RESPONSIVE ═══ */
    @media(max-width:768px){
      .dphish-grid{grid-template-columns:1fr!important}
      .dphish-sidebar{order:-1}
    }
  `}</style>
);

// ─── REUSABLES ────────────────────────────────────────────────────────────────
function Bdg({ color, bg, children, size = "sm" }) {
  return (
    <span style={{ fontSize: size === "sm" ? 9 : 11, fontWeight: 700, color, background: bg, border: `1px solid ${color}30`, borderRadius: 99, padding: size === "sm" ? "2px 7px" : "4px 12px", whiteSpace: "nowrap", fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.02em" }}>
      {children}
    </span>
  );
}

function CTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "10px 14px", boxShadow: T.shMd, fontSize: 11, fontFamily: "'Nunito',sans-serif" }}>
      <p style={{ color: T.textMd, marginBottom: 6, fontWeight: 700, fontSize: 10, letterSpacing: "0.06em" }}>{label}</p>
      {payload.map((p, i) => <p key={i} style={{ color: p.color, margin: "2px 0" }}>{p.name}: <strong>{p.value}</strong></p>)}
    </div>
  );
}

function EmptyState({ icon: Icon, title, desc, actionLabel, onAction, color = T.brand }) {
  return (
    <div style={{ textAlign: "center", padding: "36px 24px", background: `${color}06`, border: `1px dashed ${color}30`, borderRadius: 16 }}>
      <div style={{ width: 48, height: 48, borderRadius: 14, background: `${color}10`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
        <Icon size={20} style={{ color: `${color}90` }} />
      </div>
      <p style={{ fontSize: 13, fontWeight: 700, color: T.text, margin: "0 0 5px", fontFamily: "'Syne',sans-serif" }}>{title}</p>
      <p style={{ fontSize: 11, color: T.textMd, margin: "0 0 16px", lineHeight: 1.6 }}>{desc}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, background: `linear-gradient(135deg,${color},${color}cc)`, color: "#fff", fontFamily: "'Nunito',sans-serif" }}>
          <Plus size={12} />{actionLabel}
        </button>
      )}
    </div>
  );
}

// ─── LIVE CLOCK ───────────────────────────────────────────────────────────────
function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: T.textMd, fontFamily: "'JetBrains Mono',monospace" }}>
      <Clock size={11} style={{ color: T.brand }} />
      {time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
    </div>
  );
}

// ─── REAL-TIME XP COUNTER ─────────────────────────────────────────────────────
function AnimatedNumber({ value, color = T.brand, size = 28 }) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);
  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = value;
    if (prev === value) return;
    const diff = value - prev;
    const steps = Math.min(Math.abs(diff), 30);
    let step = 0;
    const t = setInterval(() => {
      step++;
      setDisplay(Math.round(prev + (diff * step) / steps));
      if (step >= steps) clearInterval(t);
    }, 20);
    return () => clearInterval(t);
  }, [value]);
  return (
    <span style={{ fontSize: size, fontWeight: 800, color, fontFamily: "'Syne',sans-serif", letterSpacing: "-0.03em", transition: "color 0.3s" }}>
      {display.toLocaleString()}
    </span>
  );
}

// ─── CONNECTION STATUS ────────────────────────────────────────────────────────
function ConnectionStatus({ online }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", fontFamily: "'JetBrains Mono',monospace", color: online ? T.green : T.red }}>
      {online ? <Wifi size={10} /> : <WifiOff size={10} />}
      {online ? "ONLINE" : "OFFLINE"}
    </div>
  );
}

// ─── NOTIFICATION ENGINE ──────────────────────────────────────────────────────
const generateNotifications = (user) => {
  const notifs = [];
  const now = Date.now();
  if ((user?.loginStreak || 0) >= 3)
    notifs.push({ id: "streak", type: "streak", read: false, message: `🔥 ${user.loginStreak}-day streak! Keep it up!`, time: "Just now", createdAt: now });
  if ((user?.quizzesDone || 0) > 0)
    notifs.push({ id: "quiz", type: "quiz", read: false, message: `You've completed ${user.quizzesDone} quiz${user.quizzesDone !== 1 ? "zes" : ""}. Earn more XP!`, time: "Today", createdAt: now - 3600000 });
  if ((user?.phishingSimTotal || 0) > 0) {
    const acc = Math.round((user.phishingSimCorrect / user.phishingSimTotal) * 100);
    notifs.push({ id: "phishing", type: "phishing", read: false, message: `Phishing sim accuracy: ${acc}% — ${acc >= 80 ? "Outstanding!" : acc >= 60 ? "Keep practicing" : "Needs work"}`, time: "Today", createdAt: now - 7200000 });
  }
  if ((user?.level || 1) > 1)
    notifs.push({ id: "level", type: "achievement", read: true, message: `Level up! You've reached Level ${user.level}`, time: "Yesterday", createdAt: now - 86400000 });
  if ((user?.score || 0) === 0)
    notifs.push({ id: "welcome", type: "info", read: false, message: "Welcome to CyberShield! Complete your first quiz to earn XP.", time: "Today", createdAt: now - 1800000 });
  return notifs.sort((a, b) => b.createdAt - a.createdAt);
};

// ─── NOTIFICATION PANEL ───────────────────────────────────────────────────────
function NotificationPanel({ user, onClose, onMarkRead }) {
  const notifs = generateNotifications(user);
  const unread = notifs.filter(n => !n.read).length;
  const typeIcon = (type) => {
    switch (type) {
      case "threat": return <ShieldAlert size={13} style={{ color: T.red }} />;
      case "quiz": return <Brain size={13} style={{ color: T.brand }} />;
      case "achievement": return <Award size={13} style={{ color: T.amber }} />;
      case "streak": return <Flame size={13} style={{ color: T.amber }} />;
      case "phishing": return <Mail size={13} style={{ color: T.teal }} />;
      default: return <Bell size={13} style={{ color: T.brand }} />;
    }
  };
  const typeBg = (type) => {
    switch (type) {
      case "threat": return T.redDim;
      case "quiz": return `${T.brand}12`;
      case "achievement": return T.amberDim;
      case "streak": return T.amberDim;
      case "phishing": return T.tealDim;
      default: return `${T.brand}12`;
    }
  };
  return (
    <div className="dnotif-panel" style={{ position: "fixed", top: 62, right: 16, width: 360, background: T.card, border: `1px solid ${T.border}`, borderRadius: 18, boxShadow: "0 12px 40px rgba(0,0,0,0.12)", zIndex: 999, overflow: "hidden", animation: "slideIn .2s ease" }}>
      <div style={{ padding: "14px 18px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: T.text, margin: 0, fontFamily: "'Syne',sans-serif" }}>Notifications</h3>
          {unread > 0 && <p style={{ fontSize: 10, color: T.brand, margin: "2px 0 0", fontWeight: 600 }}>{unread} unread</p>}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {unread > 0 && <button onClick={onMarkRead} style={{ fontSize: 10, color: T.brand, fontWeight: 700, border: "none", background: "none", cursor: "pointer", fontFamily: "inherit" }}>Mark all read</button>}
          <button onClick={onClose} style={{ border: "none", background: T.bg, borderRadius: 8, width: 26, height: 26, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={12} style={{ color: T.textMd }} />
          </button>
        </div>
      </div>
      <div style={{ maxHeight: 400, overflowY: "auto" }}>
        {notifs.length === 0 ? (
          <div style={{ padding: "28px", textAlign: "center", color: T.textDim, fontSize: 12 }}>No notifications yet</div>
        ) : notifs.map(n => (
          <div key={n.id} style={{ padding: "12px 18px", borderBottom: `1px solid ${T.border}`, background: n.read ? "transparent" : `${T.brand}04`, display: "flex", alignItems: "flex-start", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, flexShrink: 0, background: typeBg(n.type), display: "flex", alignItems: "center", justifyContent: "center" }}>
              {typeIcon(n.type)}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 11, fontWeight: n.read ? 400 : 700, color: T.text, margin: "0 0 3px", lineHeight: 1.4 }}>{n.message}</p>
              <p style={{ fontSize: 9, color: T.textDim, margin: 0 }}>{n.time}</p>
            </div>
            {!n.read && <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.brand, marginTop: 4, flexShrink: 0 }} />}
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
    { id: "overview", label: "Overview", icon: Home, desc: "Dashboard home" },
    { id: "threats", label: "Threat Intelligence", icon: ShieldAlert, desc: "Live threat feed" },
    { id: "phishing", label: "Phishing Simulator", icon: Mail, desc: "Practice detecting phishing" },
    { id: "reports", label: "Analytics & Reports", icon: BarChart2, desc: "Security analytics" },
    { id: "profile", label: "My Profile", icon: User, desc: "Account & stats" },
    { id: "settings", label: "Settings", icon: Settings, desc: "Configure account" },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy, desc: "Top performers" },
    { id: "aichat", label: "AI Security Assistant", icon: Bot, desc: "Chat with AI assistant" },
  ];
  const external = [
    { label: "Courses", icon: GraduationCap, path: "/courses" },
    { label: "Quiz", icon: Brain, path: "/quiz" },
    { label: "CyberGame", icon: Gamepad2, path: "/game" },
  ];
  const all = [...pages, ...external];
  const filtered = query.length < 1 ? pages.slice(0, 6) :
    all.filter(p => (p.label + (p.desc || "") + (p.path || "")).toLowerCase().includes(query.toLowerCase()));

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.25)", backdropFilter: "blur(4px)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 80 }} onClick={onClose}>
      <div className="dsearch-overlay-card" style={{ width: 560, background: T.card, borderRadius: 18, boxShadow: "0 20px 60px rgba(0,0,0,0.15)", overflow: "hidden", border: `1px solid ${T.border}`, animation: "fadeUp .2s ease" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 16px", borderBottom: `1px solid ${T.border}` }}>
          <Search size={14} style={{ color: T.textDim }} />
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)} placeholder="Search pages, features…" style={{ flex: 1, border: "none", outline: "none", fontSize: 14, color: T.text, fontFamily: "'Nunito',sans-serif", background: "transparent" }} />
          <kbd style={{ fontSize: 9, color: T.textDim, border: `1px solid ${T.border}`, borderRadius: 5, padding: "2px 7px", fontFamily: "monospace" }}>ESC</kbd>
        </div>
        <div style={{ maxHeight: 360, overflowY: "auto" }}>
          {filtered.length === 0 ? (
            <div style={{ padding: "28px", textAlign: "center", color: T.textDim, fontSize: 12 }}>No results for "{query}"</div>
          ) : filtered.map((item, i) => (
            <div key={i} onClick={() => { item.path ? navigate(item.path) : setPage(item.id); onClose(); }} style={{ display: "flex", alignItems: "center", gap: 11, padding: "11px 16px", cursor: "pointer", transition: "background .1s", borderBottom: `1px solid ${T.border}` }}
              onMouseEnter={e => e.currentTarget.style.background = T.surfaceHov}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: `${T.brand}10`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {item.icon && <item.icon size={14} style={{ color: T.brand }} />}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: T.text, margin: 0, fontFamily: "'Syne',sans-serif" }}>{item.label}</p>
                <p style={{ fontSize: 10, color: T.textMd, margin: 0 }}>{item.desc || item.path}</p>
              </div>
              <ChevronRight size={12} style={{ color: T.textDim }} />
            </div>
          ))}
        </div>
        <div style={{ padding: "9px 16px", borderTop: `1px solid ${T.border}`, display: "flex", gap: 12, fontSize: 10, color: T.textDim }}>
          <span>↩ select</span><span>↑↓ navigate</span><span>ESC close</span>
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ page, setPage, user, navigate, collapsed, setCollapsed, mobileMenuOpen }) {
  const nav = [
    { id: "overview", icon: Home, label: "Overview" },
    { id: "threats", icon: ShieldAlert, label: "Threats" },
    { id: "aichat", icon: Bot, label: "AI Assistant", badge: "New" },
    { id: "courses", icon: GraduationCap, label: "Courses", external: "/courses" },
    { id: "phishing", icon: Mail, label: "Phishing Sim" },
    { id: "quiz", icon: Brain, label: "Quiz", external: "/quiz" },
    { id: "game", icon: Gamepad2, label: "CyberGame", external: "/game" },
    { id: "security-score", icon: TrendingUp, label: "Security Score" },
    { id: "fraud-detection", icon: Target, label: "Fraud Tools" },
    { id: "incident-report", icon: AlertTriangle, label: "Report Threat" },
    { id: "achievements", icon: Medal, label: "Achievements" },
    { id: "community", icon: MessageSquare, label: "Community" },
    { id: "reports", icon: BarChart2, label: "Reports" },
    { id: "leaderboard", icon: Trophy, label: "Leaderboard" },
  ];
  const bottom = [
    { id: "profile", icon: User, label: "Profile" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];
  const handleNav = item => item.external ? navigate(item.external) : setPage(item.id);
  const w = collapsed ? 64 : 236;

  const NavBtn = ({ item, active }) => (
    <div style={{ position: "relative" }}>
      <button onClick={() => handleNav(item)} title={collapsed ? item.label : ""}
        style={{ width: "100%", display: "flex", alignItems: "center", gap: collapsed ? 0 : 9, padding: collapsed ? "10px" : "8px 11px", justifyContent: collapsed ? "center" : "flex-start", borderRadius: 10, border: "none", background: active ? `${T.brand}10` : "transparent", color: active ? T.brand : T.textMd, cursor: "pointer", transition: "all .15s", marginBottom: 1, fontFamily: "'Nunito',sans-serif", fontSize: 12, fontWeight: active ? 700 : 500, textAlign: "left" }}
        onMouseEnter={e => { if (!active) { e.currentTarget.style.background = T.surfaceHov; e.currentTarget.style.color = T.text; } }}
        onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.textMd; } }}>
        <item.icon size={14} style={{ flexShrink: 0 }} />
        {!collapsed && (
          <>
            <span style={{ flex: 1, whiteSpace: "nowrap" }}>{item.label}</span>
            {item.badge && (
              <span style={{ fontSize: 8, background: item.badge === "New" ? `${T.teal}15` : T.redDim, color: item.badge === "New" ? T.teal : T.red, border: `1px solid ${item.badge === "New" ? T.teal : T.red}25`, borderRadius: 99, padding: "1px 5px", fontWeight: 800, letterSpacing: "0.05em" }}>{item.badge}</span>
            )}
            {item.external && <ChevronRight size={10} style={{ color: T.textDim }} />}
            {active && !item.external && <div style={{ width: 4, height: 4, borderRadius: "50%", background: T.brand }} />}
          </>
        )}
      </button>
      {collapsed && item.badge && (
        <div style={{ position: "absolute", top: 7, right: 7, width: 5, height: 5, borderRadius: "50%", background: item.badge === "New" ? T.teal : T.red }} />
      )}
    </div>
  );

  return (
    <div className={`dsidebar ${mobileMenuOpen ? 'dsidebar-open' : ''}`} style={{ width: w, flexShrink: 0, background: T.surface, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", height: "100vh", position: "fixed", left: 0, top: 0, zIndex: 100, transition: "width .25s cubic-bezier(.16,1,.3,1)", overflow: "hidden", visibility: window.location.pathname.startsWith('/courses') ? 'hidden' : 'visible' }}>
      <div style={{ padding: collapsed ? "14px 8px" : "18px 16px 14px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", minHeight: 62, gap: 8 }}>
        {!collapsed && (
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <LogoIcon size={34} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: T.text, letterSpacing: "-0.01em", fontFamily: "'Syne',sans-serif" }}>CyberShield</div>
              <div style={{ fontSize: 9, color: T.textDim, fontWeight: 600, letterSpacing: "0.1em", fontFamily: "'JetBrains Mono',monospace" }}>SECURITY SUITE</div>
            </div>
          </div>
        )}
        {collapsed && (
          <div style={{ width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LogoIcon size={34} />
          </div>
        )}
        <button onClick={() => setCollapsed(c => !c)} style={{ border: "none", background: T.bg, borderRadius: 7, width: 24, height: 24, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: T.textMd }}>
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </div>
      <nav style={{ flex: 1, padding: "8px 6px", overflowY: "auto", overflowX: "hidden" }}>
        {!collapsed && <div style={{ fontSize: 8, fontWeight: 700, color: T.textDim, letterSpacing: "0.12em", padding: "5px 9px 7px", fontFamily: "'JetBrains Mono',monospace" }}>MAIN</div>}
        {nav.map(item => <NavBtn key={item.id} item={item} active={page === item.id} />)}
        {!collapsed ? (
          <div style={{ fontSize: 8, fontWeight: 700, color: T.textDim, letterSpacing: "0.12em", padding: "11px 9px 7px", marginTop: 8, borderTop: `1px solid ${T.border}`, fontFamily: "'JetBrains Mono',monospace" }}>ACCOUNT</div>
        ) : <div style={{ height: 1, background: T.border, margin: "8px 4px" }} />}
        {bottom.map(item => <NavBtn key={item.id} item={item} active={page === item.id} />)}
      </nav>
      <div style={{ padding: collapsed ? "9px 6px" : "10px 12px", borderTop: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 8, justifyContent: collapsed ? "center" : "flex-start" }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, flexShrink: 0, overflow: "hidden", background: `linear-gradient(135deg,${T.brand},${T.violet})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff" }}>
          {user?.avatar ? <img src={user.avatar} alt="" style={{ width: 32, height: 32, objectFit: "cover" }} /> : firstName(user).charAt(0).toUpperCase()}
        </div>
        {!collapsed && (
          <>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Syne',sans-serif" }}>{getFullName(user)}</div>
              <div style={{ fontSize: 9, color: T.textDim, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'JetBrains Mono',monospace" }}>{user?.email || "Not signed in"}</div>
            </div>
            <button onClick={() => { localStorage.clear(); window.location.href = "/"; }} style={{ border: "none", background: "none", cursor: "pointer", color: T.textDim, padding: 4 }} title="Sign out">
              <LogOut size={12} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── TOPBAR ───────────────────────────────────────────────────────────────────
function TopBar({ page, user, notifCount, onNotifClick, onProfileClick, onSearchClick, online, onMenuClick }) {
  const labels = {
    overview: "Overview", threats: "Threat Intelligence", courses: "Learning Courses",
    phishing: "Phishing Simulator", quiz: "Quiz Center", game: "CyberDefense Game",
    reports: "Analytics & Reports", profile: "My Profile", settings: "Settings",
    leaderboard: "Leaderboard", aichat: "AI Security Assistant",
  };
  return (
    <div className="dtopbar" style={{ height: 62, background: T.surface, borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", padding: "0 22px", gap: 12, position: "sticky", top: 0, zIndex: 50 }}>
      <button className="dmobile-menu-btn" onClick={onMenuClick} style={{ display: "none", width: 34, height: 34, borderRadius: 9, border: `1px solid ${T.border}`, background: T.bg, cursor: "pointer", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Menu size={16} style={{ color: T.textMd }} />
      </button>
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
        <h1 className="dtopbar-title" style={{ fontSize: 16, fontWeight: 800, color: T.text, margin: 0, fontFamily: "'Syne',sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{labels[page] || page}</h1>
        <ConnectionStatus online={online} />
      </div>
      <div className="dtopbar-time"><LiveClock /></div>
      <button className="dsearch-desk" onClick={onSearchClick} style={{ display: "flex", alignItems: "center", gap: 7, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 10, padding: "7px 12px", width: 200, cursor: "pointer", fontFamily: "'Nunito',sans-serif", color: T.textDim, fontSize: 11, flexShrink: 0 }}>
        <Search size={11} /> Search… <kbd style={{ marginLeft: "auto", fontSize: 9, border: `1px solid ${T.border}`, borderRadius: 4, padding: "1px 5px", fontFamily: "monospace", color: T.textDim }}>⌘K</kbd>
      </button>
      <button className="dsearch-mob" onClick={onSearchClick} style={{ display: "none", width: 34, height: 34, borderRadius: 9, border: `1px solid ${T.border}`, background: T.bg, cursor: "pointer", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Search size={14} style={{ color: T.textMd }} />
      </button>
      <button onClick={onNotifClick} style={{ position: "relative", width: 34, height: 34, borderRadius: 9, border: `1px solid ${T.border}`, background: T.bg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Bell size={14} style={{ color: T.textMd }} />
        {notifCount > 0 && <span style={{ position: "absolute", top: -3, right: -3, background: T.red, color: "#fff", borderRadius: "50%", width: 16, height: 16, fontSize: 8, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${T.surface}`, fontFamily: "monospace" }}>{notifCount > 9 ? "9+" : notifCount}</span>}
      </button>
      <button onClick={onProfileClick} style={{ width: 32, height: 32, borderRadius: 9, overflow: "hidden", border: "none", background: `linear-gradient(135deg,${T.brand},${T.violet})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff", cursor: "pointer", flexShrink: 0 }}>
        {user?.avatar ? <img src={user.avatar} alt="" style={{ width: 32, height: 32, objectFit: "cover" }} /> : firstName(user).charAt(0).toUpperCase()}
      </button>
    </div>
  );
}

// ─── REAL-TIME THREAT TICKER ──────────────────────────────────────────────────
function ThreatTicker({ threats }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!threats?.length) return;
    const t = setInterval(() => setIdx(i => (i + 1) % threats.length), 3500);
    return () => clearInterval(t);
  }, [threats]);
  if (!threats?.length) return null;
  const t = threats[idx];
  const sev = SEV[t.severity] || SEV.medium;
  return (
    <div style={{ background: `${sev.color}08`, border: `1px solid ${sev.color}20`, borderRadius: 10, padding: "7px 14px", display: "flex", alignItems: "center", gap: 8, overflow: "hidden" }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: sev.color, flexShrink: 0, animation: "pulse 1.5s infinite" }} />
      <span style={{ fontSize: 9, fontWeight: 700, color: sev.color, letterSpacing: "0.08em", fontFamily: "'JetBrains Mono',monospace", flexShrink: 0 }}>{t.severity?.toUpperCase()}</span>
      <span style={{ fontSize: 10, color: T.textMd, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.type}: {t.desc}</span>
      <span style={{ fontSize: 9, color: T.textDim, flexShrink: 0, fontFamily: "'JetBrains Mono',monospace" }}>{t.time || fmtTime(t.createdAt)}</span>
    </div>
  );
}

// ─── LIVE ACTIVITY FEED ───────────────────────────────────────────────────────
function LiveActivityFeed({ activities, loading }) {
  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 18, padding: 18, boxShadow: T.sh }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 13 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: T.tealDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Radio size={12} style={{ color: T.teal }} />
        </div>
        <h3 style={{ fontSize: 12, fontWeight: 700, color: T.text, margin: 0, fontFamily: "'Syne',sans-serif" }}>Live Activity Feed</h3>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, fontSize: 9, color: T.teal, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: T.teal, animation: "pulse 1.5s infinite" }} />
          LIVE
        </div>
      </div>
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "20px", color: T.textDim }}>
          <Loader2 size={16} className="spin" />
        </div>
      ) : activities?.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 1, maxHeight: 260, overflowY: "auto" }}>
          {activities.map((a, i) => {
            const isRecent = i < 2;
            return (
              <div key={a._id || i} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "8px 9px", borderRadius: 9, transition: "background .15s", background: isRecent ? `${T.brand}04` : "transparent", animation: isRecent ? "fadeUp 0.3s ease" : "none" }}
                onMouseEnter={e => e.currentTarget.style.background = T.bg}
                onMouseLeave={e => e.currentTarget.style.background = isRecent ? `${T.brand}04` : "transparent"}>
                <div style={{ width: 24, height: 24, borderRadius: 7, background: a.type === "quiz" ? `${T.brand}10` : a.type === "game" ? `${T.violet}10` : a.type === "phishing" ? `${T.amber}10` : `${T.teal}10`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {a.type === "quiz" ? <Brain size={10} style={{ color: T.brand }} /> : a.type === "game" ? <Gamepad2 size={10} style={{ color: T.violet }} /> : a.type === "phishing" ? <Mail size={10} style={{ color: T.amber }} /> : <Activity size={10} style={{ color: T.teal }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 11, color: T.text, margin: 0, lineHeight: 1.4, fontWeight: isRecent ? 600 : 400 }}>
                    {a.type === "quiz" ? `Quiz: ${a.score || 0} pts — ${a.result === "pass" ? "✓ Passed" : "✗ Failed"}` :
                      a.type === "game" ? `Game: Wave ${a.score || 0} completed` :
                        a.type === "phishing" ? `Phishing sim: ${a.result === "pass" ? "Correct ✓" : "Incorrect ✗"}` :
                          a.msg || `${a.type} activity`}
                  </p>
                  <p style={{ fontSize: 9, color: T.textDim, margin: "1px 0 0", fontFamily: "'JetBrains Mono',monospace" }}>{a.time || fmtDate(a.createdAt) + " " + fmtTime(a.createdAt)}</p>
                </div>
                {isRecent && <span style={{ fontSize: 8, background: T.greenDim, color: T.green, border: `1px solid ${T.green}20`, borderRadius: 99, padding: "1px 6px", fontWeight: 700, flexShrink: 0 }}>NEW</span>}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState icon={Activity} title="No activity yet" desc="Your actions appear here as you explore the platform." color={T.teal} />
      )}
    </div>
  );
}

// ─── AI CHAT ASSISTANT PAGE ───────────────────────────────────────────────────
function AIChatPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "👋 Hi! I'm your CyberShield AI assistant. Ask me anything about cybersecurity.", ts: new Date() }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef();

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim(), ts: new Date() };
    const latestMessages = [...messages, userMsg];
    setMessages(latestMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        // send the full array, except system prompt which backend handles
        body: JSON.stringify({
          messages: latestMessages.map(m => ({
            role: m.role,
            content: m.content,
            reasoning_details: m.reasoning_details
          }))
        }),
      });
      const data = await res.json();
      setMessages(m => [...m, {
        role: "assistant",
        content: data.reply || data.message || "Sorry, I couldn't process that.",
        reasoning_details: data.reasoning_details,
        ts: new Date()
      }]);
    } catch {
      setMessages(m => [...m, { role: "assistant", content: "⚠️ Couldn't connect to the AI service. Please try again.", ts: new Date() }]);
    }
    setLoading(false);
  };

  const quickPrompts = [
    "What is a zero-day exploit?",
    "How do I identify a phishing email?",
    "What's the safest way to use public WiFi?",
    "Explain SQL injection in simple terms",
    "How does ransomware work?",
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
      <div className="dai-chat-grid" style={{ display: "grid", gridTemplateColumns: "1fr 240px", gap: 14, width: "100%" }}>
        <div className="dai-chat-box" style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, overflow: "hidden", boxShadow: T.sh, display: "flex", flexDirection: "column", height: 560, minHeight: 400, width: "100%" }}>
          <div style={{ padding: "14px 18px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: `linear-gradient(135deg,${T.brand},${T.violet})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Bot size={16} style={{ color: "#fff" }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <h3 style={{ fontSize: 13, fontWeight: 800, color: T.text, margin: 0, fontFamily: "'Syne',sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>CyberShield AI</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9, color: T.green, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: T.green, animation: "pulse 2s infinite" }} />Online
              </div>
            </div>
          </div>
          <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: "16px 12px", display: "flex", flexDirection: "column", gap: 12, minHeight: 0 }}>
            {messages.map((msg, i) => {
              const isUser = msg.role === "user";
              return (
                <div key={i} style={{ display: "flex", gap: 8, justifyContent: isUser ? "flex-end" : "flex-start", animation: "fadeUp .25s ease" }}>
                  {msg.role === "assistant" && (
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg,${T.brand},${T.violet})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                      <Bot size={12} style={{ color: "#fff" }} />
                    </div>
                  )}
                  <div style={{ background: isUser ? `linear-gradient(135deg,${T.brand},${T.violet})` : T.bg, color: isUser ? "#fff" : T.text, borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px", padding: "10px 14px", fontSize: 12, lineHeight: 1.6, fontFamily: "'Nunito',sans-serif", wordBreak: "break-word", maxWidth: "90%", overflow: "hidden" }}>
                    {msg.content}
                    <div style={{ fontSize: 9, opacity: 0.6, marginTop: 4, textAlign: "right", fontFamily: "'JetBrains Mono',monospace" }}>
                      {msg.ts ? fmtTime(msg.ts) : ""}
                    </div>
                  </div>
                </div>
              );
            })}
            {loading && (
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg,${T.brand},${T.violet})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Bot size={12} style={{ color: "#fff" }} />
                </div>
                <div style={{ background: T.bg, borderRadius: "18px 18px 18px 4px", padding: "14px 18px", display: "flex", gap: 5, alignItems: "center" }}>
                  {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: T.textDim, animation: `pulse 1.2s ease ${i * 0.2}s infinite` }} />)}
                </div>
              </div>
            )}
          </div>
          <div style={{ padding: "12px 14px", borderTop: `1px solid ${T.border}`, display: "flex", gap: 8, flexShrink: 0 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} placeholder="Ask about cybersecurity…" style={{ flex: 1, border: `1px solid ${T.border}`, borderRadius: 12, padding: "10px 12px", fontSize: 12, fontFamily: "'Nunito',sans-serif", color: T.text, background: T.bg, outline: "none", minWidth: 0 }} />
            <button onClick={sendMessage} disabled={loading || !input.trim()} style={{ width: 40, height: 40, borderRadius: 12, border: "none", background: input.trim() ? `linear-gradient(135deg,${T.brand},${T.violet})` : T.bg, color: input.trim() ? "#fff" : T.textDim, cursor: input.trim() ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Send size={14} />
            </button>
          </div>
        </div>
        <div className="dai-quick-prompts" style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", minWidth: 0 }}>
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 16, boxShadow: T.sh, width: "100%" }}>
            <h4 style={{ fontSize: 11, fontWeight: 700, color: T.text, margin: "0 0 11px", fontFamily: "'Syne',sans-serif" }}>Quick Questions</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {quickPrompts.map((q, i) => (
                <button key={i} onClick={() => { setInput(q); }} style={{ padding: "8px 11px", borderRadius: 9, border: `1px solid ${T.border}`, background: T.bg, color: T.textMd, fontSize: 11, cursor: "pointer", fontFamily: "'Nunito',sans-serif", textAlign: "left", transition: "all .15s", width: "100%" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${T.brand}25`; e.currentTarget.style.color = T.brand; e.currentTarget.style.background = `${T.brand}05`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMd; e.currentTarget.style.background = T.bg; }}>
                  {q}
                </button>
              ))}
            </div>
          </div>
          <div style={{ background: `${T.brand}06`, border: `1px solid ${T.brand}20`, borderRadius: 14, padding: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: T.brand, marginBottom: 6, fontFamily: "'Syne',sans-serif" }}>💡 Pro Tip</div>
            <p style={{ fontSize: 11, color: T.textMd, margin: 0, lineHeight: 1.6 }}>Ask about your specific security situation — the AI tailors advice to cybersecurity scenarios.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE: OVERVIEW (REAL DATA) ───────────────────────────────────────────────
function OverviewPage({ user, setPage, navigate, dashData, dashLoading, liveActivities }) {
  const hour = new Date().getHours();
  const greeting = hour < 5 ? "Working late" : hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const fname = firstName(user);

  const score = user?.score || 0;
  const streak = user?.loginStreak || 0;
  const quizDone = user?.quizzesDone || 0;
  const avgScore = user?.avgScore || 0;
  const gameScore = user?.gameScore || 0;
  const gameHighScore = user?.gameHighScore || 0;
  const gamesPlayed = user?.gamesPlayed || 0;
  const phCorrect = user?.phishingSimCorrect || 0;
  const phTotal = user?.phishingSimTotal || 0;
  const phishingAccuracy = phTotal > 0 ? Math.round((phCorrect / phTotal) * 100) : 0;
  const { level, xp, xpInLevel, xpPct } = computeLevel(score);

  const weekData = dashData?.weeklyProgress?.length > 0 ? dashData.weeklyProgress : (user?.weeklyActivity?.length > 0 ? user.weeklyActivity : []);
  const domainData = dashData?.domainScores || [
    { subject: "Phishing", A: user?.phishingScore || (phTotal > 0 ? Math.round((phCorrect / phTotal) * 100) : 0) },
    { subject: "Malware", A: user?.malwareScore || 0 },
    { subject: "Network", A: user?.networkScore || 0 },
    { subject: "Privacy", A: user?.privacyScore || 0 },
    { subject: "Cloud", A: user?.cloudScore || 0 },
  ];

  const insights = dashData?.insights || [];

  const tips = [
    "Never reuse passwords across accounts — use a password manager.",
    "Enable 2FA on every critical service you use today.",
    "Hover links before clicking — always verify the domain.",
    "Keep your OS and all software fully patched.",
    "Public Wi-Fi? Always tunnel through a VPN.",
    "3-2-1 backup rule: 3 copies, 2 media types, 1 offsite.",
    "Zero-trust mindset: verify every request, trust nothing by default.",
  ];
  const [tip] = useState(() => tips[new Date().getDay() % tips.length]);

  const quickActions = [
    { icon: Brain, label: "Quiz", sub: "Earn XP", color: T.brand, action: () => navigate("/quiz") },
    { icon: GraduationCap, label: "Courses", sub: "Learn", color: T.teal, action: () => navigate("/courses") },
    { icon: Gamepad2, label: "Game", sub: "Defend", color: T.violet, action: () => navigate("/game") },
    { icon: ShieldAlert, label: "Threats", sub: "Live intel", color: T.red, action: () => setPage("threats") },
    { icon: Mail, label: "Phishing", sub: "Train", color: T.amber, action: () => setPage("phishing") },
    { icon: Bot, label: "AI Chat", sub: "Ask AI", color: T.pink, action: () => setPage("aichat") },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Hero */}
      <div className="fu dhero-wrap" style={{ borderRadius: 22, padding: "26px 30px", position: "relative", overflow: "hidden", background: `linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 50%, #EDE9FE 100%)`, border: `1px solid ${T.brand}20`, boxShadow: T.sh }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: `linear-gradient(rgba(79,70,229,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(79,70,229,0.04) 1px,transparent 1px)`, backgroundSize: "40px 40px" }} />
        <div style={{ position: "absolute", top: -60, right: -40, width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle,${T.brand}12,transparent 70%)`, pointerEvents: "none" }} />
        <div className="dhero-inner" style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(5,150,105,0.10)", borderRadius: 99, padding: "3px 10px", border: "1px solid rgba(5,150,105,0.25)" }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: T.green, animation: "pulse 2s infinite" }} />
                <span style={{ fontSize: 9, fontWeight: 700, color: T.green, letterSpacing: "0.12em", fontFamily: "'JetBrains Mono',monospace" }}>PROTECTED</span>
              </div>
              <LiveClock />
            </div>
            <h1 className="dhero-title" style={{ fontSize: 32, fontWeight: 800, color: T.text, fontFamily: "'Syne',sans-serif", margin: "0 0 4px", lineHeight: 1.1 }}>{greeting}, {fname} 👋</h1>
            <p style={{ fontSize: 12, color: T.textMd, margin: "0 0 14px" }}>
              {user?.role || "Cybersecurity Learner"}{level > 1 ? ` · Level ${level} Security Analyst` : " · Building foundations 🚀"}
            </p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(79,70,229,0.06)", border: "1px solid rgba(79,70,229,0.18)", borderRadius: 10, padding: "6px 12px", marginBottom: 18 }}>
              <Zap size={11} style={{ color: T.amber, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: T.textMd, fontStyle: "italic" }}>{tip}</span>
            </div>
            <div className="dhero-stats" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                { v: score, l: "Score", c: T.brand, animated: true },
                { v: `Lv.${level}`, l: "Level", c: T.violet },
                { v: streak > 0 ? `${streak}d 🔥` : "0d", l: "Streak", c: T.amber },
                { v: quizDone, l: "Quizzes", c: T.teal },
              ].map(({ v, l, c, animated }, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(79,70,229,0.12)", borderRadius: 11, padding: "8px 14px", textAlign: "center", minWidth: 70, backdropFilter: "blur(4px)" }}>
                  {animated && typeof v === "number" ? (
                    <AnimatedNumber value={v} color={c} size={18} />
                  ) : (
                    <div style={{ fontSize: 18, fontWeight: 800, color: c, lineHeight: 1, fontFamily: "'Syne',sans-serif" }}>{v || "—"}</div>
                  )}
                  <div style={{ fontSize: 9, color: T.textDim, marginTop: 2, letterSpacing: "0.06em" }}>{l}</div>
                </div>
              ))}
              <div style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(79,70,229,0.12)", borderRadius: 11, padding: "8px 14px", minWidth: 160, backdropFilter: "blur(4px)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: T.textDim, marginBottom: 6 }}>
                  <span>Level {level} Progress</span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", color: T.brand }}>{xpInLevel}/500 XP</span>
                </div>
                <div style={{ height: 4, background: "rgba(79,70,229,0.12)", borderRadius: 99 }}>
                  <div style={{ height: 4, width: `${xpPct}%`, background: `linear-gradient(90deg,${T.brand},${T.violet})`, borderRadius: 99, transition: "width 1s ease" }} />
                </div>
              </div>
            </div>
          </div>
          <div className="dhero-circle" style={{ textAlign: "center", flexShrink: 0 }}>
            <svg width={100} height={100} viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(79,70,229,0.12)" strokeWidth="6" />
              <circle cx="50" cy="50" r="42" fill="none" stroke={T.brand} strokeWidth="6" strokeDasharray={`${2 * Math.PI * 42 * xpPct / 100} ${2 * Math.PI * 42}`} strokeLinecap="round" transform="rotate(-90 50 50)" style={{ transition: "stroke-dasharray 1s ease" }} />
              <text x="50" y="45" textAnchor="middle" fill={T.text} fontSize="18" fontWeight="800" fontFamily="'Syne',sans-serif">{xpPct}%</text>
              <text x="50" y="59" textAnchor="middle" fill={T.textDim} fontSize="8" fontFamily="'JetBrains Mono',monospace">XP</text>
            </svg>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="fu fu1">
        <div style={{ fontSize: 9, fontWeight: 700, color: T.textDim, marginBottom: 9, letterSpacing: "0.12em", fontFamily: "'JetBrains Mono',monospace" }}>QUICK ACTIONS</div>
        <div className="dg6">
          {quickActions.map((item, i) => (
            <button key={i} onClick={item.action} style={{ padding: "14px 8px", border: `1px solid ${T.border}`, textAlign: "center", cursor: "pointer", background: T.card, borderRadius: 16, transition: "all .2s", fontFamily: "inherit", boxShadow: T.sh }}
              onMouseEnter={e => { e.currentTarget.style.background = `${item.color}08`; e.currentTarget.style.borderColor = `${item.color}25`; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 20px ${item.color}15`; }}
              onMouseLeave={e => { e.currentTarget.style.background = T.card; e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = T.sh; }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: `${item.color}10`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                <item.icon size={16} style={{ color: item.color }} />
              </div>
              <p style={{ fontSize: 11, fontWeight: 700, color: T.text, margin: "0 0 2px", fontFamily: "'Syne',sans-serif" }}>{item.label}</p>
              <p style={{ fontSize: 9, color: T.textDim, margin: 0 }}>{item.sub}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="fu fu2 dg4">
        {[
          { label: "Total Score", value: score, icon: Star, color: T.brand, sub: score > 0 ? `${Math.floor(score)} XP` : "Start earning!", animated: true },
          { label: "Avg Quiz Score", value: avgScore > 0 ? `${avgScore}%` : "—", icon: Brain, color: T.violet, sub: quizDone > 0 ? `${quizDone} quiz${quizDone !== 1 ? "zes" : ""} attempted` : "No quizzes yet" },
          { label: "Game Score", value: gameScore, icon: Gamepad2, color: T.pink, sub: gamesPlayed > 0 ? `Played ${gamesPlayed}x, Best: ${gameHighScore}` : "No games yet", animated: true },
          { label: "Phishing Accuracy", value: phTotal > 0 ? `${phishingAccuracy}%` : "—", icon: Mail, color: T.teal, sub: phTotal > 0 ? `${phCorrect}/${phTotal} correct` : "Try the simulator" },
        ].map((s, i) => {
          const [hov, setHov] = useState(false);
          return (
            <div key={i} style={{ background: hov ? `${s.color}06` : T.card, border: `1px solid ${hov ? s.color + "20" : T.border}`, borderRadius: 18, padding: "18px 20px", cursor: "default", transition: "all .2s", boxShadow: T.sh }}
              onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: `${s.color}10`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <s.icon size={16} style={{ color: s.color }} />
                </div>
                {dashLoading && <Loader2 size={12} className="spin" style={{ color: T.textDim }} />}
              </div>
              {s.animated && typeof s.value === "number" ? (
                <AnimatedNumber value={s.value} color={s.color} size={28} />
              ) : (
                <div style={{ fontSize: 28, fontWeight: 800, color: s.color, letterSpacing: "-0.03em", lineHeight: 1, fontFamily: "'Syne',sans-serif" }}>{s.value}</div>
              )}
              <div style={{ fontSize: 11, color: T.textMd, marginTop: 4, fontWeight: 500 }}>{s.label}</div>
              {s.sub && <div style={{ fontSize: 10, color: s.color, marginTop: 2, fontWeight: 600 }}>{s.sub}</div>}
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="fu fu3 dg21">
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 18, padding: 20, boxShadow: T.sh }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: T.text, margin: "0 0 3px", fontFamily: "'Syne',sans-serif" }}>Weekly Progress</h3>
          <p style={{ fontSize: 10, color: T.textMd, margin: "0 0 16px" }}>Score progression this week — live data</p>
          {weekData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={weekData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: T.textMd }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: T.textDim }} axisLine={false} tickLine={false} />
                <Tooltip content={<CTip />} />
                <Bar dataKey="score" name="Score" fill={T.brand} radius={[5, 5, 0, 0]} maxBarSize={24} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8, color: T.textDim }}>
              {dashLoading ? <Loader2 size={20} className="spin" style={{ color: T.brand }} /> : <><BarChart2 size={24} style={{ opacity: 0.3 }} /><span style={{ fontSize: 11 }}>Complete activities to see your progress</span></>}
            </div>
          )}
        </div>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 18, padding: 20, boxShadow: T.sh }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: T.text, margin: "0 0 3px", fontFamily: "'Syne',sans-serif" }}>Domain Mastery</h3>
          <p style={{ fontSize: 10, color: T.textMd, margin: "0 0 12px" }}>Skill radar</p>
          <ResponsiveContainer width="100%" height={180}>
            <RadarChart data={domainData}>
              <PolarGrid stroke={T.border} />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: T.textMd }} />
              <Radar name="Score" dataKey="A" stroke={T.brand} fill={T.brand} fillOpacity={0.12} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insights */}
      {insights.length > 0 && (
        <div className="fu fu3" style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 18, padding: 20, boxShadow: T.sh }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: `${T.violet}10`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Cpu size={12} style={{ color: T.violet }} />
            </div>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: T.text, margin: 0, fontFamily: "'Syne',sans-serif" }}>AI Insights</h3>
            <span style={{ fontSize: 9, background: `${T.violet}10`, color: T.violet, border: `1px solid ${T.violet}20`, borderRadius: 99, padding: "1px 7px", fontWeight: 700 }}>LIVE</span>
          </div>
          <div className="dg22">
            {insights.slice(0, 4).map((ins, i) => (
              <div key={i} style={{ padding: "12px 14px", background: ins.type === "warning" ? T.amberDim : ins.type === "success" ? T.greenDim : `${T.brand}06`, border: `1px solid ${ins.type === "warning" ? T.amber : ins.type === "success" ? T.green : T.brand}20`, borderRadius: 12 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: ins.type === "warning" ? T.amber : ins.type === "success" ? T.green : T.brand, margin: "0 0 4px" }}>{ins.title}</p>
                <p style={{ fontSize: 10, color: T.textMd, margin: 0, lineHeight: 1.5 }}>{ins.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Activity + Badges */}
      <div className="fu fu5 dg2">
        <LiveActivityFeed activities={liveActivities} loading={dashLoading} />
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 18, padding: 18, boxShadow: T.sh }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 13 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: T.amberDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Award size={12} style={{ color: T.amber }} />
            </div>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: T.text, margin: 0, fontFamily: "'Syne',sans-serif" }}>Badges Earned</h3>
          </div>
          {(user?.badges || []).length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {user.badges.map((b, i) => (
                <div key={i} style={{ textAlign: "center", padding: "10px 11px", background: T.bg, border: `1px solid ${T.border}`, borderRadius: 12, cursor: "default", transition: "all .2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = T.amberDim; e.currentTarget.style.transform = "scale(1.06)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = T.bg; e.currentTarget.style.transform = "scale(1)"; }}>
                  <div style={{ fontSize: 20, lineHeight: 1 }}>{b.emoji || "🏅"}</div>
                  <p style={{ fontSize: 9, color: T.textMd, marginTop: 5, fontWeight: 700 }}>{b.label || b.badgeName || b}</p>
                  {b.earnedAt && <p style={{ fontSize: 8, color: T.textDim, margin: "2px 0 0", fontFamily: "'JetBrains Mono',monospace" }}>{fmtDate(b.earnedAt)}</p>}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={Star} title="No badges yet" desc="Complete activities and reach milestones to unlock badges." color={T.amber} />
          )}
        </div>
      </div>
    </div>
  );
}
const _phishStyle = document.getElementById("phish-style");
if (!_phishStyle) {
  const s = document.createElement("style");
  s.id = "phish-style";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
    @keyframes phFadeUp { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
    @keyframes phSlideIn { from { opacity:0; transform:translateX(-6px) } to { opacity:1; transform:translateX(0) } }
    @keyframes phSpin { to { transform:rotate(360deg) } }
    .ph-up   { animation: phFadeUp .3s cubic-bezier(.22,1,.36,1) both }
    .ph-in   { animation: phSlideIn .25s cubic-bezier(.22,1,.36,1) both }
    .ph-spin { animation: phSpin 1s linear infinite }
    .ph-vbtn { transition: transform .15s ease, opacity .15s ease }
    .ph-vbtn:hover  { transform: translateY(-2px) }
    .ph-vbtn:active { transform: scale(0.97) }
    .ph-nbtn { transition: opacity .15s, transform .1s }
    .ph-nbtn:hover  { opacity: .88; transform: translateY(-1px) }
    .ph-nbtn:active { transform: scale(0.98) }
    .ph-prog { transition: width .5s cubic-bezier(.22,1,.36,1) }
  `;
  document.head.appendChild(s);
}
 
const PH = {
  serif: "'Instrument Serif', Georgia, serif",
  sans:  "'DM Sans', system-ui, sans-serif",
  mono:  "'JetBrains Mono', monospace",
};
 
function PhishingPage({ user, onUserUpdate }) {
  const [emails, setEmails]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [step, setStep]                 = useState(0);
  const [result, setResult]             = useState(null);
  const [results, setResults]           = useState([]);
  const [showFinal, setShowFinal]       = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [animating, setAnimating]       = useState(false);
 
  useEffect(() => {
    API.get("/api/phishing/emails")
      .then(data => setEmails(Array.isArray(data) ? data : data.emails || []))
      .catch(() => setEmails([]))
      .finally(() => setLoading(false));
  }, []);
 
  const current    = emails[step];
  const accuracy   = sessionTotal > 0 ? Math.round((sessionScore / sessionTotal) * 100) : 0;
  const overallAcc = user?.phishingSimTotal
    ? Math.round((user.phishingSimCorrect / user.phishingSimTotal) * 100) : null;
 
  const handleAnswer = async (isPhish) => {
    if (animating || !current || result) return;
    const correct = isPhish === current.isPhishing;
    if (correct) setSessionScore(s => s + 1);
    setSessionTotal(t => t + 1);
    setResult({ correct, isPhishing: current.isPhishing });
    setResults(prev => { const n = [...prev]; n[step] = correct; return n; });
 
    try {
      await API.post("/api/phishing/result", { correct, emailSubject: current?.subject });
      await API.post("/api/activity", { type: "phishing", result: correct ? "pass" : "fail", score: correct ? 1 : 0, emailId: current._id });
    } catch (err) { console.error("Error saving phishing result:", err); }
 
    if (onUserUpdate) {
      const prevCorrect = user?.phishingSimCorrect || 0;
      const prevTotal   = user?.phishingSimTotal   || 0;
      onUserUpdate({ phishingSimCorrect: prevCorrect + (correct ? 1 : 0), phishingSimTotal: prevTotal + 1 });
    }
  };
 
  const next = () => {
    if (step < emails.length - 1) {
      setAnimating(true);
      setTimeout(() => { setStep(s => s + 1); setResult(null); setAnimating(false); }, 180);
    } else {
      setShowFinal(true);
    }
  };
 
  const restart = () => {
    setStep(0); setResult(null); setResults([]);
    setSessionScore(0); setSessionTotal(0); setShowFinal(false);
  };
 
  // ── Loading / Empty ────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ display:"flex", justifyContent:"center", padding:60, color:T.textDim, gap:10, alignItems:"center", fontFamily:PH.sans }}>
      <Loader2 size={18} className="ph-spin" /> Loading simulations…
    </div>
  );
 
  if (emails.length === 0) return (
    <EmptyState icon={Mail} title="No phishing emails available"
      desc="Check back later — the admin will add phishing simulation emails." color={T.amber} />
  );
 
  // ── Final results screen ───────────────────────────────────────────────────
  if (showFinal) {
    const correct = results.filter(Boolean).length;
    const pct     = Math.round((correct / emails.length) * 100);
    const { msg, col } =
      pct === 100 ? { msg: "Flawless — you caught every single one.",           col: T.green } :
      pct >= 80   ? { msg: "Sharp eye. A couple slipped through.",              col: T.teal || T.green } :
      pct >= 60   ? { msg: "Decent instincts — phishers would catch you eventually.", col: T.amber } :
                    { msg: "High risk. Review the indicators and try again.",   col: T.red };
 
    return (
      <div className="ph-up" style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:20, padding:"52px 32px", textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center", gap:18, boxShadow:T.sh }}>
        <div style={{ fontSize:60, fontFamily:PH.serif, fontStyle:"italic", fontWeight:400, color:col, lineHeight:1 }}>
          {pct}<span style={{ fontSize:30, opacity:.6 }}>%</span>
        </div>
        <div>
          <div style={{ fontSize:13, color:T.textMd, fontFamily:PH.sans }}>{correct} of {emails.length} correct</div>
          <div style={{ fontSize:16, fontFamily:PH.serif, fontStyle:"italic", color:T.text, marginTop:6, lineHeight:1.4 }}>{msg}</div>
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", justifyContent:"center" }}>
          {results.map((r, i) => (
            <div key={i} style={{
              width:32, height:32, borderRadius:"50%",
              background: r ? `${T.green}15` : `${T.red}15`,
              border:`1px solid ${r ? T.green : T.red}40`,
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              {r ? <CheckCircle size={13} style={{ color:T.green }} /> : <AlertTriangle size={13} style={{ color:T.red }} />}
            </div>
          ))}
        </div>
        <button className="ph-nbtn" onClick={restart} style={{
          marginTop:4, padding:"11px 28px", borderRadius:99,
          border:`1px solid ${T.border}`, background:T.text,
          color:"#fff", fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:PH.sans,
        }}>
          ↺ Try again
        </button>
      </div>
    );
  }
 
  // ── Main simulator ─────────────────────────────────────────────────────────
  const bodyLines = (current?.body || "").split("\n");
 
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
 
      {/* ── Header bar ── */}
      <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:18, padding:"14px 20px", display:"flex", alignItems:"center", gap:14, boxShadow:T.sh }}>
        <div style={{ width:44, height:44, borderRadius:13, background:`${T.brand}12`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <Mail size={18} style={{ color:T.brand }} />
        </div>
        <div style={{ flex:1 }}>
          <h2 style={{ fontSize:17, fontWeight:400, fontFamily:PH.serif, fontStyle:"italic", color:T.text, margin:"0 0 2px" }}>Phishing Simulator</h2>
          <p style={{ fontSize:11, color:T.textMd, margin:0, fontFamily:PH.sans }}>Read each email carefully. Real or fake?</p>
        </div>
        <div style={{ display:"flex", gap:8, flexShrink:0 }}>
          <div style={{ background:`${T.brand}08`, border:`1px solid ${T.brand}20`, borderRadius:10, padding:"6px 13px", textAlign:"center" }}>
            <div style={{ fontSize:13, fontWeight:600, color:T.brand, fontFamily:PH.mono, lineHeight:1 }}>{sessionScore}/{sessionTotal}</div>
            <div style={{ fontSize:9, color:T.textDim, fontFamily:PH.sans, marginTop:2, textTransform:"uppercase", letterSpacing:"0.05em" }}>Session</div>
          </div>
          {overallAcc !== null && (
            <div style={{ background:`${T.teal || T.brand}08`, border:`1px solid ${T.teal || T.brand}20`, borderRadius:10, padding:"6px 13px", textAlign:"center" }}>
              <div style={{ fontSize:13, fontWeight:600, color:T.teal || T.brand, fontFamily:PH.mono, lineHeight:1 }}>{overallAcc}%</div>
              <div style={{ fontSize:9, color:T.textDim, fontFamily:PH.sans, marginTop:2, textTransform:"uppercase", letterSpacing:"0.05em" }}>All-time</div>
            </div>
          )}
        </div>
      </div>
 
      {/* ── Progress dots + bar ── */}
      <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:12, padding:"9px 16px", display:"flex", alignItems:"center", gap:12, boxShadow:T.sh }}>
        <div style={{ display:"flex", gap:5, alignItems:"center" }}>
          {emails.map((_, i) => {
            const done   = results[i] !== undefined;
            const active = i === step && !done;
            const pass   = results[i] === true;
            return (
              <div key={i} style={{
                width: active ? 18 : 7, height:7, borderRadius:99,
                background: done ? (pass ? T.green : T.red) : active ? T.brand : T.bg,
                transition:"all .3s cubic-bezier(.22,1,.36,1)", opacity: done || active ? 1 : 0.4,
              }} />
            );
          })}
        </div>
        <div style={{ flex:1, height:3, background:T.bg, borderRadius:99, overflow:"hidden" }}>
          <div className="ph-prog" style={{ height:3, borderRadius:99, background:T.brand, width:`${((step+1)/emails.length)*100}%` }} />
        </div>
        <span style={{ fontSize:10, color:T.brand, fontWeight:700, fontFamily:PH.mono, flexShrink:0 }}>
          {step+1}/{emails.length}
        </span>
      </div>
 
      {/* ── Email card ── */}
      <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:18, overflow:"hidden", boxShadow:T.sh, opacity:animating ? 0.5 : 1, transition:"opacity .18s ease" }}>
 
        {/* macOS chrome */}
        <div style={{ background:T.bg, borderBottom:`1px solid ${T.border}`, padding:"9px 14px", display:"flex", alignItems:"center", gap:6 }}>
          {["#FF5F57","#FEBC2E","#28C840"].map(c => <div key={c} style={{ width:9, height:9, borderRadius:"50%", background:c }} />)}
          <span style={{ marginLeft:8, fontSize:10, color:T.textDim, fontFamily:PH.mono }}>Inbox — {emails.length} messages</span>
        </div>
 
        {/* Sender row */}
        <div style={{ padding:"16px 20px 12px", borderBottom:`1px solid ${T.border}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:11, marginBottom:10 }}>
            <div style={{ width:38, height:38, borderRadius:"50%", background:`${T.brand}12`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:600, color:T.brand, flexShrink:0, fontFamily:PH.sans }}>
              {(current?.from || "?").charAt(0).toUpperCase()}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:600, color:T.text, fontFamily:PH.sans }}>{current?.from}</div>
              <div style={{ fontSize:10, color:T.textDim, fontFamily:PH.mono, marginTop:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {current?.email || current?.fromAddress || `${(current?.from||"sender").toLowerCase().replace(/\s/g,"")}@mail.com`}
              </div>
            </div>
            <div style={{ fontSize:10, color:T.textDim, fontFamily:PH.mono, flexShrink:0 }}>
              {current?.time || fmtTime?.(current?.createdAt) || ""}
            </div>
          </div>
          <div style={{ fontSize:17, fontWeight:400, fontFamily:PH.serif, fontStyle:"italic", color:T.text, lineHeight:1.3 }}>
            {current?.subject}
          </div>
        </div>
 
        {/* Body */}
        <div style={{ padding:"16px 20px", minHeight:120 }}>
          {bodyLines.map((line, i) => {
            const isLink = line.startsWith("http");
            return (
              <p key={i} style={{ fontSize: isLink ? 11 : 13, lineHeight:1.75, margin:"0 0 2px", color: isLink ? T.brand : T.textMd, fontFamily: isLink ? PH.mono : PH.sans, textDecoration: isLink ? "underline" : "none", wordBreak: isLink ? "break-all" : "normal" }}>
                {line || "\u00A0"}
              </p>
            );
          })}
        </div>
 
        {/* ── Verdict buttons ── */}
        {!result ? (
          <div style={{ borderTop:`1px solid ${T.border}`, padding:"14px 20px", display:"flex", gap:10, background:T.card }}>
            <button className="ph-vbtn" onClick={() => handleAnswer(false)} style={{
              flex:1, padding:"13px 12px", borderRadius:13,
              border:`1px solid ${T.green}30`, background:`${T.green}10`,
              cursor:"pointer", fontFamily:PH.sans,
              display:"flex", flexDirection:"column", alignItems:"center", gap:5,
            }}>
              <CheckCircle size={20} style={{ color:T.green }} />
              <span style={{ fontSize:12, fontWeight:600, color:T.green }}>Looks legit</span>
              <span style={{ fontSize:10, color:T.green, opacity:0.7 }}>Mark as safe</span>
            </button>
            <button className="ph-vbtn" onClick={() => handleAnswer(true)} style={{
              flex:1, padding:"13px 12px", borderRadius:13,
              border:`1px solid ${T.red}30`, background:`${T.red}10`,
              cursor:"pointer", fontFamily:PH.sans,
              display:"flex", flexDirection:"column", alignItems:"center", gap:5,
            }}>
              <AlertTriangle size={20} style={{ color:T.red }} />
              <span style={{ fontSize:12, fontWeight:600, color:T.red }}>It's a phish</span>
              <span style={{ fontSize:10, color:T.red, opacity:0.7 }}>Flag suspicious</span>
            </button>
          </div>
 
        ) : (
          // ── Result reveal ──
          <div className="ph-up" style={{ borderTop:`1px solid ${T.border}`, padding:"14px 20px", background:T.card }}>
 
            {/* Banner */}
            <div style={{
              display:"flex", alignItems:"center", gap:9, padding:"11px 14px", borderRadius:12, marginBottom:12,
              background: result.correct ? `${T.green}12` : `${T.red}12`,
              border:`1px solid ${result.correct ? T.green : T.red}30`,
            }}>
              {result.correct
                ? <CheckCircle size={17} style={{ color:T.green }} />
                : <AlertTriangle size={17} style={{ color:T.red }} />}
              <div>
                <div style={{ fontSize:13, fontWeight:600, color: result.correct ? T.green : T.red, fontFamily:PH.sans }}>
                  {result.correct ? "Correct!" : "Missed it."}
                </div>
                <div style={{ fontSize:11, color: result.correct ? T.green : T.red, opacity:0.75, fontFamily:PH.sans, marginTop:1 }}>
                  This was {result.isPhishing ? "a phishing email" : "a legitimate email"}.
                </div>
              </div>
            </div>
 
            {/* Clues */}
            {current?.clues?.length > 0 && (
              <div style={{ marginBottom:12 }}>
                <div style={{ fontSize:10, fontWeight:600, color:T.textDim, letterSpacing:"0.06em", textTransform:"uppercase", fontFamily:PH.sans, marginBottom:7 }}>
                  Key indicators
                </div>
                {current.clues.map((clue, i) => (
                  <div key={i} className="ph-in" style={{ display:"flex", alignItems:"flex-start", gap:8, padding:"5px 0", borderBottom: i < current.clues.length-1 ? `1px solid ${T.border}` : "none", animationDelay:`${i*0.05}s` }}>
                    <div style={{ width:15, height:15, borderRadius:"50%", background: current.isPhishing ? `${T.red}15` : `${T.green}15`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                      {current.isPhishing
                        ? <AlertTriangle size={7} style={{ color:T.red }} />
                        : <CheckCircle size={7} style={{ color:T.green }} />}
                    </div>
                    <span style={{ fontSize:11, color:T.textMd, lineHeight:1.55, fontFamily:PH.sans }}>{clue}</span>
                  </div>
                ))}
              </div>
            )}
 
            {/* Next button */}
            <button className="ph-nbtn" onClick={next} style={{
              width:"100%", padding:"11px", borderRadius:11,
              border:"none", background:T.text, color:"#fff",
              fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:PH.sans,
              display:"flex", alignItems:"center", justifyContent:"center", gap:6,
            }}>
              {step < emails.length - 1 ? "Next email →" : "See results"}
            </button>
          </div>
        )}
      </div>
 
    </div>
  );
}
 
// ─── PAGE: REPORTS ────────────────────────────────────────────────────────────
function ReportsPage({ user, navigate, setPage }) {
  const [exporting, setExporting] = useState(null);
  const hasData = (user?.quizHistory?.length || 0) > 0 || (user?.phishingSimTotal || 0) > 0 || (user?.score || 0) > 0;
  const phAcc = user?.phishingSimTotal ? Math.round((user.phishingSimCorrect / user.phishingSimTotal) * 100) : null;

  const handleDownload = async (type) => {
    setExporting(type);
    await new Promise(r => setTimeout(r, 700));
    const name = getFullName(user) || "Unknown";
    const { level, xp } = computeLevel(user?.score || 0);
    const report = `CyberShield Security Report\n${"=".repeat(50)}\nUser: ${name}\nDate: ${new Date().toLocaleDateString()}\nScore: ${user?.score || 0}\nLevel: ${level}\nXP: ${xp}\nStreak: ${user?.loginStreak || 0} days\nQuizzes: ${user?.quizzesDone || 0}\nPhishing Accuracy: ${phAcc !== null ? phAcc + "%" : "Not attempted"}\n`;
    const blob = new Blob([report], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `CyberShield_${name.replace(/\s/g, "_")}_${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    setExporting(null);
  };

  if (!hasData) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <EmptyState icon={BarChart2} title="No report data yet" desc="Your reports populate automatically as you complete quizzes, phishing simulations, courses, and games." color={T.brand} />
        <div className="dg22">
          {[
            { icon: Brain, label: "Take a Quiz", desc: "Earn scores and XP", color: T.brand, action: () => navigate("/quiz") },
            { icon: Mail, label: "Try Phishing Sim", desc: "Test your detection skills", color: T.amber, action: () => setPage("phishing") },
            { icon: GraduationCap, label: "Complete a Course", desc: "Learn and earn certificates", color: T.teal, action: () => navigate("/courses") },
            { icon: Gamepad2, label: "Play CyberGame", desc: "Defend against attacks", color: T.violet, action: () => navigate("/game") },
          ].map((item, i) => (
            <div key={i} onClick={item.action} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: "18px 20px", boxShadow: T.sh, display: "flex", alignItems: "center", gap: 13, cursor: "pointer", transition: "all .18s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${item.color}25`; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = "none"; }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: `${item.color}10`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <item.icon size={18} style={{ color: item.color }} />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: T.text, margin: "0 0 2px", fontFamily: "'Syne',sans-serif" }}>{item.label}</p>
                <p style={{ fontSize: 11, color: T.textMd, margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const { level } = computeLevel(user?.score || 0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, boxShadow: T.sh }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: T.text, margin: "0 0 2px", fontFamily: "'Syne',sans-serif" }}>Export Your Report</h3>
          <p style={{ fontSize: 10, color: T.textMd, margin: 0 }}>Download a personalised security report with your real data</p>
        </div>
        {[{ l: "TXT Export", fmt: "txt", icon: FileText, color: T.brand }].map((item, i) => (
          <button key={i} onClick={() => handleDownload(item.fmt)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 10, border: `1px solid ${item.color}20`, background: `${item.color}08`, color: item.color, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Nunito',sans-serif", transition: "all .2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = item.color; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = `${item.color}08`; e.currentTarget.style.color = item.color; }}>
            {exporting === item.fmt ? <Loader2 size={12} className="spin" /> : <item.icon size={12} />} {item.l}
          </button>
        ))}
      </div>
      <div className="dg4">
        {[
          { l: "Total Score", v: (user?.score || 0).toLocaleString(), c: T.brand, icon: Star },
          { l: "Level", v: `Level ${level}`, c: T.violet, icon: Trophy },
          { l: "Phishing Accuracy", v: phAcc !== null ? `${phAcc}%` : "—", c: T.amber, icon: Mail },
          { l: "Login Streak", v: `${user?.loginStreak || 0}d`, c: T.teal, icon: Flame },
        ].map((s, i) => (
          <div key={i} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: "16px 18px", boxShadow: T.sh }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: `${s.c}10`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
              <s.icon size={14} style={{ color: s.c }} />
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.c, fontFamily: "'Syne',sans-serif" }}>{s.v}</div>
            <div style={{ fontSize: 11, color: T.textMd, marginTop: 3 }}>{s.l}</div>
          </div>
        ))}
      </div>
      {(user?.quizHistory || []).length > 0 && (
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 18, overflow: "hidden", boxShadow: T.sh }}>
          <div style={{ padding: "13px 18px", borderBottom: `1px solid ${T.border}` }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: T.text, margin: 0, fontFamily: "'Syne',sans-serif" }}>Quiz History</h3>
          </div>
          <div className="dqh" style={{ padding: "9px 18px", background: T.bg, borderBottom: `1px solid ${T.border}`, fontSize: 8, fontWeight: 700, color: T.textDim, letterSpacing: "0.1em", fontFamily: "'JetBrains Mono',monospace" }}>
            <span>MODULE</span><span>SCORE</span><span>GRADE</span><span>DATE</span>
          </div>
          {user.quizHistory.slice(0, 8).map((r, i) => {
            const pct = r.score || r.percentage || 0;
            const col = pct >= 80 ? T.green : pct >= 60 ? T.brand : T.amber;
            return (
              <div key={i} className="dqh" style={{ padding: "10px 18px", borderBottom: i < Math.min(user.quizHistory.length, 8) - 1 ? `1px solid ${T.border}` : "none" }}>
                <span style={{ fontSize: 11, color: T.text, fontWeight: 500 }}>{r.quiz || r.moduleTitle || `Module ${i + 1}`}</span>
                <span style={{ fontSize: 11, fontWeight: 800, color: col, fontFamily: "'Syne',sans-serif" }}>{pct}%</span>
                <div><Bdg color={col} bg={`${col}12`}>{pct >= 90 ? "A+" : pct >= 80 ? "A" : pct >= 70 ? "B" : pct >= 60 ? "C" : "D"}</Bdg></div>
                <span style={{ fontSize: 9, color: T.textDim, fontFamily: "'JetBrains Mono',monospace" }}>{fmtDate(r.date || r.updatedAt)}</span>
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
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [uploading, setUploading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ fullName: getFullName(user), email: user?.email || "", phone: user?.phone || "", location: user?.location || "", role: user?.role || "", bio: user?.bio || "" });
  const fileRef = useRef();

  useEffect(() => {
    setForm({ fullName: getFullName(user), email: user?.email || "", phone: user?.phone || "", location: user?.location || "", role: user?.role || "", bio: user?.bio || "" });
    setAvatar(user?.avatar || null);
  }, [user]);

  const handleAvatarUpload = (e) => {
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
    try { await API.put("/api/auth/profile", form); } catch { }
    if (onUserUpdate) onUserUpdate({ ...form, name: form.fullName });
    setSaved(true); setEditMode(false); setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const { level, xp, xpInLevel, xpPct } = computeLevel(user?.score || 0);
  const statItems = [
    { l: "Score", v: (user?.score || 0).toLocaleString(), c: T.brand },
    { l: "Level", v: level, c: T.violet },
    { l: "Streak", v: `${user?.loginStreak || 0}d`, c: T.amber },
    { l: "Quizzes", v: user?.quizzesDone || 0, c: T.teal },
    { l: "Avg Score", v: user?.avgScore ? `${user.avgScore}%` : "—", c: T.green },
    { l: "Total XP", v: xp.toLocaleString(), c: T.pink },
    { l: "Phishing Acc", v: user?.phishingSimTotal ? `${Math.round((user.phishingSimCorrect / user.phishingSimTotal) * 100)}%` : "—", c: T.amber },
    { l: "Courses", v: user?.coursesCompleted || 0, c: T.brand },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {saved && (
        <div style={{ background: T.greenDim, border: `1px solid ${T.green}20`, borderRadius: 12, padding: "10px 16px", display: "flex", alignItems: "center", gap: 8, animation: "slideIn .2s ease" }}>
          <CheckCircle2 size={14} style={{ color: T.green }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: T.green }}>Profile updated successfully!</span>
        </div>
      )}
      <div className="dprofile-grid">
        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, padding: "24px 20px", textAlign: "center", boxShadow: T.sh }}>
            <div style={{ position: "relative", width: 88, height: 88, margin: "0 auto 13px", cursor: "pointer" }} onClick={() => fileRef.current?.click()}>
              {avatar ? <img src={avatar} alt="avatar" style={{ width: 88, height: 88, borderRadius: "50%", objectFit: "cover", border: `3px solid ${T.brand}20` }} /> :
                <div style={{ width: 88, height: 88, borderRadius: "50%", background: `linear-gradient(135deg,${T.brand},${T.violet})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 800, color: "#fff" }}>
                  {(form.fullName || "U").charAt(0).toUpperCase()}
                </div>}
              <div style={{ position: "absolute", bottom: 0, right: 0, width: 26, height: 26, borderRadius: "50%", background: T.brand, border: `3px solid ${T.card}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {uploading ? <Loader2 size={10} style={{ color: "#fff" }} className="spin" /> : <Camera size={10} style={{ color: "#fff" }} />}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarUpload} />
            </div>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: T.text, margin: "0 0 3px", fontFamily: "'Syne',sans-serif" }}>{form.fullName || getFullName(user)}</h2>
            <p style={{ fontSize: 11, color: T.textMd, margin: "0 0 10px" }}>{form.role || "Cybersecurity Learner"}</p>
            <div style={{ display: "inline-flex" }}><Bdg color={T.brand} bg={`${T.brand}10`} size="md">Level {level} Analyst</Bdg></div>
            <div style={{ marginTop: 14, padding: "10px 12px", background: T.bg, borderRadius: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: T.textDim, marginBottom: 6 }}>
                <span>Level Progress</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", color: T.brand }}>{xpInLevel}/500 XP</span>
              </div>
              <div style={{ height: 4, background: "rgba(79,70,229,0.1)", borderRadius: 99 }}>
                <div style={{ height: 4, width: `${xpPct}%`, background: `linear-gradient(90deg,${T.brand},${T.violet})`, borderRadius: 99 }} />
              </div>
            </div>
          </div>
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 18, padding: 16, boxShadow: T.sh }}>
            <h3 style={{ fontSize: 10, fontWeight: 700, color: T.textDim, margin: "0 0 11px", letterSpacing: "0.1em", fontFamily: "'JetBrains Mono',monospace" }}>PERFORMANCE STATS</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {statItems.map((s, i) => (
                <div key={i} style={{ background: T.bg, borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: s.c, fontFamily: "'Syne',sans-serif" }}>{s.v}</div>
                  <div style={{ fontSize: 8, color: T.textDim, marginTop: 2, fontWeight: 700, letterSpacing: "0.06em" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, padding: 24, boxShadow: T.sh }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: T.text, margin: 0, fontFamily: "'Syne',sans-serif" }}>Profile Information</h3>
            <button onClick={() => editMode ? handleSave() : setEditMode(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 9, border: "none", background: editMode ? `linear-gradient(135deg,${T.green},#34D399)` : `linear-gradient(135deg,${T.brand},${T.violet})`, color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Nunito',sans-serif" }}>
              {saving ? <Loader2 size={11} className="spin" /> : editMode ? <><Save size={11} /> Save Changes</> : <><Edit3 size={11} /> Edit Profile</>}
            </button>
          </div>
          <div className="dform-grid">
            {[
              { label: "Full Name", key: "fullName", icon: User, type: "text" },
              { label: "Email", key: "email", icon: Mail, type: "email" },
              { label: "Phone", key: "phone", icon: Phone, type: "tel" },
              { label: "Location", key: "location", icon: MapPin, type: "text" },
              { label: "Role / Title", key: "role", icon: Shield, type: "text", full: true },
              { label: "Bio", key: "bio", icon: FileText, type: "text", full: true },
            ].map((field) => (
              <div key={field.key} style={{ gridColumn: field.full ? "span 2" : "auto" }}>
                <label style={{ fontSize: 9, fontWeight: 700, color: T.textDim, letterSpacing: "0.08em", display: "block", marginBottom: 5, fontFamily: "'JetBrains Mono',monospace" }}>{field.label.toUpperCase()}</label>
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: T.bg, border: `1px solid ${editMode ? `${T.brand}25` : T.border}`, borderRadius: 10, padding: "9px 12px" }}>
                  <field.icon size={13} style={{ color: T.textDim, flexShrink: 0 }} />
                  <input value={form[field.key]} readOnly={!editMode} onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))} type={field.type} placeholder={editMode ? `Enter ${field.label.toLowerCase()}` : "—"} style={{ border: "none", background: "transparent", outline: "none", fontSize: 12, color: T.text, width: "100%", fontFamily: "'Nunito',sans-serif", fontWeight: 500 }} />
                </div>
              </div>
            ))}
          </div>
          {(user?.badges || []).length > 0 && (
            <div style={{ marginTop: 20, paddingTop: 18, borderTop: `1px solid ${T.border}` }}>
              <h4 style={{ fontSize: 10, fontWeight: 700, color: T.textDim, margin: "0 0 11px", letterSpacing: "0.1em", fontFamily: "'JetBrains Mono',monospace" }}>ACHIEVEMENTS</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {user.badges.map((b, i) => (
                  <div key={i} style={{ textAlign: "center", padding: "8px 12px", background: T.bg, border: `1px solid ${T.border}`, borderRadius: 10 }}>
                    <div style={{ fontSize: 18, lineHeight: 1 }}>{b.emoji || "🏅"}</div>
                    <p style={{ fontSize: 9, color: T.textMd, marginTop: 4, fontWeight: 700 }}>{b.label || b.badgeName || b}</p>
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
  const [tab, setTab] = useState("password");
  const [pw, setPw] = useState({ current: "", newPw: "", confirm: "" });
  const [showPw, setShowPw] = useState({ current: false, newPw: false, confirm: false });
  const [pwStatus, setPwStatus] = useState(null);
  const [twoFa, setTwoFa] = useState(user?.twoFaEnabled ?? true);

  const tabs = [
    { id: "password", label: "Password", icon: Key },
    { id: "security", label: "Security", icon: Shield },
    { id: "danger", label: "Danger Zone", icon: AlertTriangle },
  ];

  const pwStr = (p) => {
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const str = pwStr(pw.newPw);
  const strLbl = ["Too short", "Weak", "Fair", "Strong", "Very Strong"];
  const strClr = [T.textDim, T.red, T.amber, "#65A30D", T.green];

  const handlePwChange = async () => {
    if (!pw.current || !pw.newPw || !pw.confirm) { setPwStatus({ type: "error", msg: "All fields are required." }); return; }
    if (pw.newPw !== pw.confirm) { setPwStatus({ type: "error", msg: "Passwords do not match." }); return; }
    if (str < 2) { setPwStatus({ type: "error", msg: "Password is too weak." }); return; }
    setPwStatus({ type: "loading" });
    try {
      const res = await API.put("/api/auth/password", { currentPassword: pw.current, newPassword: pw.newPw });
      if (res.error) throw new Error(res.message || "Failed");
      setPwStatus({ type: "success", msg: "Password updated successfully." });
      setPw({ current: "", newPw: "", confirm: "" });
    } catch (err) {
      setPwStatus({ type: "error", msg: err.message || "Failed to update password." });
    }
  };

  const Toggle = ({ checked, onChange, color = T.brand }) => (
    <div onClick={() => onChange(!checked)} style={{ width: 40, height: 20, borderRadius: 99, background: checked ? color : "#D1D5DB", cursor: "pointer", transition: "background .2s", position: "relative", flexShrink: 0 }}>
      <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: checked ? 23 : 3, transition: "left .2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
    </div>
  );

  return (
    <div className="dsettings-grid">
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: "12px 8px", height: "fit-content", boxShadow: T.sh }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 9, border: "none", background: tab === t.id ? (t.id === "danger" ? T.redDim : `${T.brand}10`) : "transparent", color: tab === t.id ? (t.id === "danger" ? T.red : T.brand) : T.textMd, cursor: "pointer", fontFamily: "'Nunito',sans-serif", fontSize: 12, fontWeight: tab === t.id ? 700 : 500, marginBottom: 2, textAlign: "left" }}>
            <t.icon size={13} />{t.label}
          </button>
        ))}
      </div>
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24, boxShadow: T.sh }}>
        {tab === "password" && (
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: T.text, margin: "0 0 20px", fontFamily: "'Syne',sans-serif" }}>Change Password</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 420 }}>
              {[{ label: "Current Password", key: "current" }, { label: "New Password", key: "newPw" }, { label: "Confirm New Password", key: "confirm" }].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 9, fontWeight: 700, color: T.textDim, letterSpacing: "0.08em", display: "block", marginBottom: 5, fontFamily: "'JetBrains Mono',monospace" }}>{f.label.toUpperCase()}</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 10, padding: "9px 12px" }}>
                    <Key size={13} style={{ color: T.textDim, flexShrink: 0 }} />
                    <input value={pw[f.key]} onChange={e => setPw(p => ({ ...p, [f.key]: e.target.value }))} type={showPw[f.key] ? "text" : "password"} style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, color: T.text, width: "100%", fontFamily: "'Nunito',sans-serif" }} />
                    <button onClick={() => setShowPw(s => ({ ...s, [f.key]: !s[f.key] }))} style={{ border: "none", background: "none", cursor: "pointer", color: T.textDim, padding: 0, display: "flex" }}>
                      {showPw[f.key] ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>
                </div>
              ))}
              {pw.newPw && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: T.textMd, marginBottom: 5 }}>
                    <span>Strength</span><span style={{ fontWeight: 700, color: strClr[str] }}>{strLbl[str]}</span>
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[1, 2, 3, 4].map(i => <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i <= str ? strClr[str] : "#E5E7EB", transition: "background .3s" }} />)}
                  </div>
                </div>
              )}
              {pwStatus && (
                <div style={{ padding: "10px 13px", borderRadius: 10, background: pwStatus.type === "success" ? T.greenDim : pwStatus.type === "error" ? T.redDim : `${T.brand}08`, display: "flex", alignItems: "center", gap: 8 }}>
                  {pwStatus.type === "loading" ? <Loader2 size={13} style={{ color: T.brand }} className="spin" /> : pwStatus.type === "success" ? <CheckCircle2 size={13} style={{ color: T.green }} /> : <AlertCircle size={13} style={{ color: T.red }} />}
                  <span style={{ fontSize: 11, fontWeight: 600, color: pwStatus.type === "success" ? T.green : pwStatus.type === "error" ? T.red : T.brand }}>
                    {pwStatus.type === "loading" ? "Updating…" : pwStatus.msg}
                  </span>
                </div>
              )}
              <button onClick={handlePwChange} style={{ padding: "11px 20px", borderRadius: 11, border: "none", background: `linear-gradient(135deg,${T.brand},${T.violet})`, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Nunito',sans-serif" }}>Update Password</button>
            </div>
          </div>
        )}
        {tab === "security" && (
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: T.text, margin: "0 0 20px", fontFamily: "'Syne',sans-serif" }}>Security Settings</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 480 }}>
              <div style={{ padding: "14px 16px", background: T.bg, border: `1px solid ${T.border}`, borderRadius: 12, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: twoFa ? T.greenDim : T.redDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {twoFa ? <Lock size={15} style={{ color: T.green }} /> : <Unlock size={15} style={{ color: T.red }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Two-Factor Authentication</div>
                  <div style={{ fontSize: 10, color: T.textMd }}>Adds extra layer of security to your account</div>
                </div>
                <Toggle checked={twoFa} color={T.green} onChange={v => { setTwoFa(v); onUserUpdate?.({ twoFaEnabled: v }); }} />
              </div>
              <div style={{ padding: "14px 16px", background: T.bg, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: T.textDim, marginBottom: 8, fontFamily: "'JetBrains Mono',monospace" }}>SESSION INFO</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[
                    { l: "Last Login", v: user?.lastLoginDate ? new Date(user.lastLoginDate).toLocaleString("en-IN") : "Today" },
                    { l: "Streak", v: `${user?.loginStreak || 0} days` },
                    { l: "Level", v: `Level ${computeLevel(user?.score || 0).level}` },
                    { l: "Account", v: user?.createdAt ? fmtDate(user.createdAt) : "Recent" },
                  ].map((s, i) => (
                    <div key={i} style={{ background: T.surface, borderRadius: 8, padding: "8px 10px", border: `1px solid ${T.border}` }}>
                      <div style={{ fontSize: 8, color: T.textDim, marginBottom: 3, fontFamily: "'JetBrains Mono',monospace" }}>{s.l}</div>
                      <div style={{ fontSize: 11, color: T.text, fontWeight: 700 }}>{s.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {tab === "danger" && (
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: T.red, margin: "0 0 20px", fontFamily: "'Syne',sans-serif" }}>Danger Zone</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 480 }}>
              {[
                { title: "Export My Data", desc: "Download your account data as JSON", color: T.brand, btn: "Export", action: () => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(user, null, 2)], { type: "application/json" })); a.download = "cybershield-data.json"; a.click(); } },
                { title: "Delete Account", desc: "Permanently delete your account and all data", color: T.red, btn: "Delete", action: () => { if (window.prompt("Type DELETE to confirm:") === "DELETE") { localStorage.clear(); window.location.href = "/"; } } },
              ].map((item, i) => (
                <div key={i} style={{ padding: "14px 16px", background: `${item.color}04`, border: `1px solid ${item.color}18`, borderRadius: 12, display: "flex", alignItems: "center", gap: 13 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{item.title}</div>
                    <div style={{ fontSize: 10, color: T.textMd }}>{item.desc}</div>
                  </div>
                  <button onClick={item.action} style={{ padding: "7px 14px", borderRadius: 9, border: `1px solid ${item.color}20`, background: `${item.color}08`, color: item.color, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Nunito',sans-serif" }}>{item.btn}</button>
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
  const [loading, setLoading] = useState(true);
  const [board, setBoard] = useState([]);
  const [tab, setTab] = useState("score");
  const [empty, setEmpty] = useState(false);

  const fetchBoard = useCallback(async () => {
    setLoading(true);
    try {
      const data = await API.get(`/api/leaderboard?sort=${tab}`);
      const rows = Array.isArray(data) ? data : data.leaderboard || [];
      if (rows.length === 0) { setEmpty(true); setBoard([]); }
      else {
        const myId = user?._id || user?.id;
        const marked = rows.map(e => ({ ...e, isSelf: e.userId === myId || e._id === myId }));
        setBoard(marked);
        setEmpty(false);
      }
    } catch {
      setEmpty(true); setBoard([]);
    } finally {
      setLoading(false);
    }
  }, [tab, user]);

  useEffect(() => { fetchBoard(); }, [fetchBoard]);

  const myRank = board.findIndex(e => e.isSelf) + 1;
  const rankIcon = (rank) => {
    if (rank === 1) return <Crown size={15} style={{ color: "#D97706" }} />;
    if (rank === 2) return <Medal size={15} style={{ color: "#6B7280" }} />;
    if (rank === 3) return <Medal size={15} style={{ color: "#92400E" }} />;
    return <span style={{ fontSize: 11, fontWeight: 700, color: T.textDim, fontFamily: "'JetBrains Mono',monospace" }}>#{rank}</span>;
  };
  const sortVal = e => {
    if (tab === "xp") return `${(e.xp || 0).toLocaleString()} XP`;
    if (tab === "quiz") return `${e.quizzesDone || 0} done`;
    if (tab === "streak") return `🔥 ${e.loginStreak || 0}d`;
    return (e.score || 0).toLocaleString();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: T.card, border: `1px solid ${T.brand}18`, borderRadius: 20, padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: `linear-gradient(135deg,${T.brand},${T.violet})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Trophy size={20} style={{ color: "#fff" }} />
          </div>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: T.text, margin: "0 0 2px", fontFamily: "'Syne',sans-serif" }}>Global Leaderboard</h2>
            <p style={{ fontSize: 11, color: T.textMd, margin: 0 }}>Live rankings based on real activity</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {myRank > 0 && (
            <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 12, padding: "11px 16px", textAlign: "center", boxShadow: T.sh }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: T.brand, fontFamily: "'Syne',sans-serif" }}>#{myRank}</div>
              <div style={{ fontSize: 9, color: T.textMd, fontWeight: 600 }}>Your Rank</div>
            </div>
          )}
          <button onClick={fetchBoard} style={{ width: 34, height: 34, borderRadius: 9, border: `1px solid ${T.border}`, background: T.bg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <RefreshCw size={13} style={{ color: T.textMd }} />
          </button>
        </div>
      </div>
      <div style={{ display: "flex", gap: 7 }}>
        {[{ id: "score", l: "Score" }, { id: "xp", l: "XP" }, { id: "quiz", l: "Quizzes" }, { id: "streak", l: "Streak" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "6px 15px", borderRadius: 8, border: `1px solid ${tab === t.id ? T.brand : T.border}`, background: tab === t.id ? `${T.brand}10` : T.card, color: tab === t.id ? T.brand : T.textMd, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Nunito',sans-serif", transition: "all .15s" }}>
            {t.l}
          </button>
        ))}
      </div>
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 18, overflow: "hidden", boxShadow: T.sh }}>
        {loading ? (
          <div style={{ padding: "48px", textAlign: "center", color: T.textDim, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <Loader2 size={16} className="spin" /> Loading leaderboard…
          </div>
        ) : empty ? (
          <div style={{ padding: "40px" }}>
            <EmptyState icon={Trophy} title="Leaderboard is empty" desc="Be the first to complete activities and claim the top spot!" color={T.brand} />
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "56px 1fr 130px 80px 80px 80px", padding: "9px 18px", background: T.bg, borderBottom: `1px solid ${T.border}`, fontSize: 8, fontWeight: 700, color: T.textDim, letterSpacing: "0.1em", fontFamily: "'JetBrains Mono',monospace" }}>
              <span>RANK</span><span>USER</span>
              <span>{tab === "score" ? "SCORE" : tab === "xp" ? "XP" : tab === "quiz" ? "QUIZZES" : "STREAK"}</span>
              <span>QUIZZES</span><span>XP</span><span>STREAK</span>
            </div>
            {board.map((entry, i) => {
              const isMe = !!entry.isSelf;
              const rank = i + 1;
              const top3 = rank <= 3;
              const bLeft = isMe ? T.brand : rank === 1 ? "#D97706" : rank === 2 ? "#6B7280" : rank === 3 ? "#92400E" : "transparent";
              return (
                <div key={entry.userId || entry._id || i} style={{ display: "grid", gridTemplateColumns: "56px 1fr 130px 80px 80px 80px", padding: "12px 18px", borderBottom: i < board.length - 1 ? `1px solid ${T.border}` : "none", background: isMe ? `${T.brand}06` : top3 ? `${T.brand}02` : "transparent", transition: "background .12s", borderLeft: `3px solid ${bLeft}` }}
                  onMouseEnter={e => { if (!isMe) e.currentTarget.style.background = T.surfaceHov; }}
                  onMouseLeave={e => { if (!isMe) e.currentTarget.style.background = top3 ? `${T.brand}02` : "transparent"; }}>
                  <div style={{ display: "flex", alignItems: "center" }}>{rankIcon(rank)}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, overflow: "hidden", background: isMe ? `linear-gradient(135deg,${T.brand},${T.violet})` : "#E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: isMe ? "#fff" : T.textMd }}>
                      {entry.avatar ? <img src={entry.avatar} alt="" style={{ width: 34, height: 34, objectFit: "cover" }} /> : (entry.name || entry.fullName || "?").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: isMe ? 800 : 600, color: isMe ? T.brand : T.text, display: "flex", alignItems: "center", gap: 5, fontFamily: "'Syne',sans-serif" }}>
                        {entry.name || entry.fullName || "Anonymous"}
                        {isMe && <span style={{ fontSize: 8, background: T.brand, color: "#fff", borderRadius: 99, padding: "1px 6px", fontWeight: 700 }}>YOU</span>}
                        {rank === 1 && !isMe && <span style={{ fontSize: 8, background: T.amberDim, color: T.amber, borderRadius: 99, padding: "1px 6px", fontWeight: 700, border: `1px solid ${T.amber}20` }}>👑 TOP</span>}
                      </div>
                      <div style={{ fontSize: 9, color: T.textDim, fontFamily: "'JetBrains Mono',monospace" }}>{entry.role || "Member"} · Lv.{computeLevel(entry.score || 0).level}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: isMe ? T.brand : top3 ? T.text : T.textMd, fontFamily: "'Syne',sans-serif" }}>{sortVal(entry)}</span>
                  </div>
                  <span style={{ fontSize: 11, color: T.textMd, alignSelf: "center" }}>{entry.quizzesDone || 0}</span>
                  <span style={{ fontSize: 11, color: T.textMd, alignSelf: "center" }}>{(entry.xp || entry.score || 0).toLocaleString()}</span>
                  <span style={{ fontSize: 11, alignSelf: "center", color: isMe && (entry.loginStreak || 0) > 0 ? T.amber : T.textMd, fontWeight: isMe ? 700 : 400 }}>🔥 {entry.loginStreak || 0}d</span>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

// ─── STUB PAGE ────────────────────────────────────────────────────────────────
const StubPage = ({ emoji, title, desc, btnLabel, btnColor, onAction }) => (
  <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 24, padding: "52px 40px", textAlign: "center", boxShadow: T.sh }}>
    <div style={{ fontSize: 52, marginBottom: 16 }}>{emoji}</div>
    <h2 style={{ fontSize: 24, fontWeight: 800, color: T.text, fontFamily: "'Syne',sans-serif", margin: "0 0 10px" }}>{title}</h2>
    <p style={{ fontSize: 13, color: T.textMd, margin: "0 0 28px", maxWidth: 440, marginInline: "auto", lineHeight: 1.7 }}>{desc}</p>
    <button onClick={onAction} style={{ padding: "12px 32px", borderRadius: 12, border: "none", background: `linear-gradient(135deg,${btnColor},${btnColor}cc)`, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Nunito',sans-serif" }}>{btnLabel}</button>
  </div>
);

// ─── ROOT DASHBOARD ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const { user: dashUser } = useDashboardUser();

  const [page, setPage] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [notifRead, setNotifRead] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);
  const [threatsViewed, setThreatsViewed] = useState([]);

  const [dashData, setDashData] = useState(null);
  const [dashLoading, setDashLoading] = useState(true);
  const [liveActivities, setLiveActivities] = useState([]);
  const [liveThreats, setLiveThreats] = useState([]);

  const [user, setUser] = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("user") || "null");
      if (!raw) return null;
      const resolved = { ...raw, _id: raw._id || raw.id };
      if (!resolved.fullName) {
        if (raw.name) resolved.fullName = raw.name;
        else if (raw.username) resolved.fullName = raw.username;
        else if (raw.firstName || raw.lastName) resolved.fullName = `${raw.firstName || ""} ${raw.lastName || ""}`.trim();
      }
      return resolved;
    } catch { return null; }
  });

  // Refresh user data from backend (to pick up game/quiz score updates)
  // ✅ DECLARE FIRST before any useEffect that references it
  const refreshUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("[Dashboard] No token, skipping refreshUserData");
        return;
      }

      console.log("[Dashboard] Fetching fresh user data from /api/auth/me");
      const data = await API.get("/api/auth/me");
      if (data?.user) {
        const raw = data.user;
        const fresh = { ...raw, _id: raw._id || raw.id };
        if (!fresh.fullName) {
          if (raw.name) fresh.fullName = raw.name;
          else if (raw.username) fresh.fullName = raw.username;
        }
        console.log("[Dashboard] ✅ User refreshed:", { score: fresh.score, gameScore: fresh.gameScore });
        setUser(fresh);
        localStorage.setItem("user", JSON.stringify(fresh));
      }
    } catch (err) {
      console.error("[Dashboard] ❌ Error refreshing user:", err.message);
    }
  }, []);

  useEffect(() => {
    // Listen for game/quiz completion signals from localStorage & refresh user data
    const handleStorageChange = (e) => {
      if (e.key === 'cybershield_just_completed' || e.key === 'user' || e.key === 'cybershield_phishing_just_answered' || e.key === 'cybershield_level_completed') {
        console.log("📢 Score update detected (game/quiz/phishing), refreshing user data...");
        refreshUserData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshUserData]);

  // Merge dashUser data with local user state
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

  // Initial load and polling setup
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    console.log("[Dashboard] Initializing - fetching user data and dashboard stats...");
    
    // Initial fetch
    refreshUserData();

    const fetchDashboard = () => {
      API.get("/api/dashboard")
        .then(data => { 
          console.log("[Dashboard] Dashboard data loaded:", data); 
          setDashData(data); 
          setDashLoading(false); 
        })
        .catch(err => {
          console.error("[Dashboard] Error loading dashboard:", err.message);
          setDashLoading(false);
        });
    };
    fetchDashboard();

    const fetchActivities = () => {
      API.get("/api/activity?limit=10")
        .then(data => setLiveActivities(Array.isArray(data) ? data : data.activities || []))
        .catch(err => console.error("[Dashboard] Error loading activities:", err.message));
    };
    fetchActivities();

    API.get("/api/threats?limit=5")
      .then(data => setLiveThreats(Array.isArray(data) ? data : data.threats || []))
      .catch(err => console.error("[Dashboard] Error loading threats:", err.message));

    // Polling intervals — refresh user data every 5 seconds to pick up game/quiz updates
    const pollDash = setInterval(fetchDashboard, 30000);
    const pollActs = setInterval(fetchActivities, 15000);
    const pollUser = setInterval(refreshUserData, 5000);  // ← Refresh user data frequently
    
    return () => { clearInterval(pollDash); clearInterval(pollActs); clearInterval(pollUser); };
  }, [refreshUserData]);

  const onUserUpdate = useCallback((updates) => {
    console.log("🔄 onUserUpdate called with:", updates);
    setUser(prev => {
      const merged = { ...prev, ...updates };
      if (updates.score !== undefined) {
        const { level, xp } = computeLevel(updates.score);
        merged.level = level;
        merged.xp = xp;
      }
      console.log("💾 Saving to localStorage:", { gameScore: merged.gameScore, phishingSimCorrect: merged.phishingSimCorrect, phishingSimTotal: merged.phishingSimTotal });
      localStorage.setItem("user", JSON.stringify(merged));
      return merged;
    });

    const token = localStorage.getItem("token");
    if (token) {
      setTimeout(() => {
        console.log("🌐 Refetching fresh user data from /api/auth/me");
        API.get("/api/auth/me")
          .then(data => {
            console.log("✅ Fresh data received:", { gameScore: data?.user?.gameScore, phishingSimCorrect: data?.user?.phishingSimCorrect, phishingSimTotal: data?.user?.phishingSimTotal });
            if (data?.user) {
              const raw = data.user;
              const fresh = { ...raw, _id: raw._id || raw.id };
              setUser(prev => {
                const merged = {
                  ...fresh,
                  fullName: prev?.fullName || fresh.fullName,
                  score: Math.max(fresh.score || 0, prev?.score || 0),
                  xp: Math.max(fresh.xp || 0, prev?.xp || 0),
                  level: Math.max(fresh.level || 1, prev?.level || 1),
                  quizzesDone: Math.max(fresh.quizzesDone || 0, prev?.quizzesDone || 0),
                  loginStreak: Math.max(fresh.loginStreak || 0, prev?.loginStreak || 0),
                  phishingSimCorrect: Math.max(fresh.phishingSimCorrect || 0, prev?.phishingSimCorrect || 0),
                  phishingSimTotal: Math.max(fresh.phishingSimTotal || 0, prev?.phishingSimTotal || 0),
                  quizHistory: (prev?.quizHistory?.length || 0) > (fresh.quizHistory?.length || 0) ? prev.quizHistory : fresh.quizHistory,
                  badges: (prev?.badges?.length || 0) > (fresh.badges?.length || 0) ? prev.badges : fresh.badges,
                  avatar: prev?.avatar || fresh.avatar,
                };
                console.log("📊 Final merged state:", { gameScore: merged.gameScore, phishingSimCorrect: merged.phishingSimCorrect, phishingSimTotal: merged.phishingSimTotal });
                localStorage.setItem("user", JSON.stringify(merged));
                return merged;
              });
            }
          })
          .catch((err) => { 
            console.error("❌ Failed to refetch user data:", err);
          });
      }, 2000);
    }
  }, []);

  useEffect(() => {
    const handler = e => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setShowSearch(s => !s); }
      if (e.key === "Escape") { setShowNotif(false); setShowSearch(false); }
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

  const notifList = generateNotifications(user);
  const notifCount = notifRead ? 0 : notifList.filter(n => !n.read).length;
  const sideW = collapsed ? 64 : 236;

  const handleThreatView = (threatId, threatName) => {
    if (!threatsViewed.includes(threatId)) {
      setThreatsViewed(prev => [...prev, threatId]);
    }
  };

  const renderPage = () => {
    switch (page) {
      case "overview": return <OverviewPage user={user} setPage={setPage} navigate={navigate} dashData={dashData} dashLoading={dashLoading} liveActivities={liveActivities} />;
      case "threats": return <ThreatsPage stats={{ threatsViewed }} onThreatView={handleThreatView} />;
      case "phishing": return <PhishingPage user={user} onUserUpdate={onUserUpdate} />;
      case "reports": return <ReportsPage user={user} navigate={navigate} setPage={setPage} />;
      case "security-score": return <SecurityScorePage user={user} />;
      case "fraud-detection": return <FraudDetectionPage />;
      case "incident-report": return <IncidentReportPage />;
      case "achievements": return <AchievementsPage user={user} />;
      case "community": return <CommunityPage user={user} />;
      case "profile": return <ProfilePage user={user} onUserUpdate={onUserUpdate} />;
      case "settings": return <SettingsPage user={user} onUserUpdate={onUserUpdate} />;
      case "leaderboard": return <LeaderboardPage user={user} />;
      case "aichat": return <AIChatPage />;
      case "courses": return <StubPage emoji="📚" title="Learning Courses" desc="Your courses live on a dedicated page. Progress and certificates sync back to your profile automatically." btnLabel="Browse Courses" btnColor={T.teal} onAction={() => navigate("/courses")} />;
      case "quiz": return <StubPage emoji="🧠" title="Quiz Center" desc="Quizzes are linked to individual courses. Pick a course to unlock its quiz and earn XP." btnLabel="Go to Courses" btnColor={T.brand} onAction={() => navigate("/courses")} />;
      case "game": return <StubPage emoji="🛡️" title="CyberDefense Game" desc="Your game module runs on its own page. Defend systems from attacks and earn massive XP." btnLabel="Launch Game" btnColor={T.violet} onAction={() => navigate("/game")} />;
      default: return <OverviewPage user={user} setPage={setPage} navigate={navigate} dashData={dashData} dashLoading={dashLoading} liveActivities={liveActivities} />;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: T.bg, fontFamily: "'Nunito',sans-serif", color: T.text }}>
      <G />
      {mobileMenuOpen && <div className="dsidebar-overlay" onClick={() => setMobileMenuOpen(false)} />}
      <Sidebar page={page} setPage={(p) => { setPage(p); setMobileMenuOpen(false); }} user={user} navigate={(path) => { navigate(path); setMobileMenuOpen(false); }} collapsed={collapsed} setCollapsed={setCollapsed} mobileMenuOpen={mobileMenuOpen} />
      <div className="dmain-content" style={{ flex: 1, marginLeft: sideW, display: "flex", flexDirection: "column", transition: "margin-left .25s cubic-bezier(.16,1,.3,1)" }}>
        <TopBar page={page} user={user} notifCount={notifCount} online={online}
          onNotifClick={() => setShowNotif(s => !s)}
          onProfileClick={() => setPage("profile")}
          onSearchClick={() => setShowSearch(true)}
          onMenuClick={() => setMobileMenuOpen(m => !m)} />

        {showNotif && (
          <div data-notif>
            <NotificationPanel user={user} onClose={() => setShowNotif(false)} onMarkRead={() => { setNotifRead(true); setShowNotif(false); }} />
          </div>
        )}
        {showSearch && <SearchOverlay onClose={() => setShowSearch(false)} setPage={setPage} navigate={navigate} />}

        {liveThreats.length > 0 && (
          <div style={{ padding: "6px 24px", borderBottom: `1px solid ${T.border}`, background: T.surface }}>
            <ThreatTicker threats={liveThreats} />
          </div>
        )}

        <main className="dmain-area" style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}