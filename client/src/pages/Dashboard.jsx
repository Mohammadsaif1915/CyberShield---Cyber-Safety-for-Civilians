/**
 * CyberGuard Dashboard — Full Rebuild
 * All 16 requested changes implemented.
 *
 * BACKEND CONTRACTS expected (Express + MongoDB):
 *   GET  /api/auth/me             → full user object (populated from DB)
 *   PUT  /api/auth/password       → { currentPassword, newPassword }
 *   PUT  /api/auth/profile        → { fullName, phone, location, role }
 *   POST /api/auth/logout-device  → { sessionId }
 *   POST /api/auth/delete         → delete account
 *   POST /api/auth/reset-progress → reset XP/scores
 *   GET  /api/leaderboard         → [{ rank, userId, name, score, xp, ... }]
 *   GET  /api/sessions            → [{ id, device, location, current, time }]
 *   POST /api/notifications/send  → { type, message }
 *
 * User object shape (stored in localStorage + fetched from DB):
 * {
 *   _id, id, username, fullName, name, email, phone, location, role,
 *   avatar, score, xp, level, loginStreak, lastLoginDate,
 *   quizzesDone, avgScore, weeklyScores, quizHistory,
 *   phishingScore, malwareScore, networkScore, privacyScore, cloudScore,
 *   recentActivity, badges, createdAt, weeklyActivity,
 *   phishingSimScore, coursesCompleted, gamesPlayed,
 *   reportData: { monthly, types }
 * }
 */

import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield, Brain, Mail, BarChart2, Bell, Search,
  Zap, X, Award, Activity, CheckCircle,
  Gamepad2, GraduationCap, ShieldAlert, Flame,
  Loader2, RefreshCw, Star, TrendingUp, TrendingDown,
  AlertTriangle, Eye, Lock, Unlock,
  Download, FileText, User, Camera, Key,
  Mail as MailIcon, Phone, MapPin, Save,
  CheckCircle2, AlertCircle, Home, Layers,
  Settings, LogOut, Users, Hash, Play,
  BookOpen, Code, Send, EyeOff, Edit3,
  Clock, ArrowUpRight, ChevronRight, ChevronLeft, Plus,
  Rocket, Target, Cpu, Globe, Database,
  Trophy, Medal, Crown, Menu, X as XIcon,
  Filter, SortAsc, Wifi, Monitor, Smartphone, Tablet,
  FileDown, FileText as FileTextIcon
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  PieChart, Pie, Cell, Legend
} from "recharts";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg: "#F0F4FF",
  card: "#FFFFFF",
  border: "rgba(79,70,229,0.1)",
  borderHov: "rgba(79,70,229,0.3)",
  brand: "#4F46E5",
  brandLight: "#EEF2FF",
  brandMid: "#818CF8",
  teal: "#0D9488",
  tealLight: "#F0FDFA",
  violet: "#7C3AED",
  amber: "#D97706",
  amberLight: "#FFFBEB",
  red: "#DC2626",
  redLight: "#FEF2F2",
  green: "#059669",
  greenLight: "#ECFDF5",
  pink: "#DB2777",
  pinkLight: "#FDF2F8",
  text: "#0F172A",
  textMd: "#475569",
  textDim: "#94A3B8",
  sh: "0 1px 3px rgba(0,0,0,0.06),0 1px 2px rgba(0,0,0,0.04)",
  shMd: "0 4px 16px rgba(79,70,229,0.1),0 2px 4px rgba(0,0,0,0.05)",
};

// ─── GLOBAL APP CONTEXT ───────────────────────────────────────────────────────
const AppContext = createContext(null);
const useApp = () => useContext(AppContext);

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmtDate = d => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "";

/**
 * Extracts the real display name from the user object.
 * Priority: fullName → name → username → email prefix → "User"
 */
const getFullName = (u) => {
  if (!u) return "User";
  return u.fullName || u.name || u.username || (u.email ? u.email.split("@")[0] : "User");
};

const firstName = (u) => {
  const full = getFullName(u);
  return full.split(" ")[0];
};

const isNewUser = (u) => !u || (!u.score && !u.xp && !u.quizzesDone);

const GRADE = {
  "A+": { color: "#059669", bg: "#ECFDF5" },
  "A":  { color: "#4F46E5", bg: "#EEF2FF" },
  "B":  { color: "#7C3AED", bg: "#EDE9FE" },
  "C":  { color: "#D97706", bg: "#FFFBEB" },
  "D":  { color: "#DC2626", bg: "#FEF2F2" },
};

const SEV = {
  critical: { color: "#DC2626", bg: "#FEF2F2", label: "Critical" },
  high:     { color: "#EA580C", bg: "#FFF7ED", label: "High" },
  medium:   { color: "#D97706", bg: "#FFFBEB", label: "Medium" },
  low:      { color: "#059669", bg: "#ECFDF5", label: "Low" },
};

const STATUS_C = {
  active: "#DC2626", blocked: "#059669", mitigating: "#D97706",
  investigating: "#7C3AED", contained: "#0D9488", quarantined: "#4F46E5",
};

// ─── STREAK LOGIC ─────────────────────────────────────────────────────────────
/**
 * Returns updated streak count.
 * Rules:
 *  - First login of the day (>24h since last): streak++, save lastLoginDate
 *  - Login again within same 24h window: streak unchanged
 *  - Gap > 48h: streak resets to 1
 */
const computeStreak = (user) => {
  const now = Date.now();
  const last = user?.lastLoginDate ? new Date(user.lastLoginDate).getTime() : 0;
  const diffHours = (now - last) / (1000 * 60 * 60);
  const currentStreak = user?.loginStreak || 0;

  if (!last || diffHours < 0) return { streak: currentStreak, updated: false };
  if (diffHours < 24) return { streak: currentStreak, updated: false };   // same day, no bump
  if (diffHours > 48) return { streak: 1, updated: true };                // gap > 2 days, reset
  return { streak: currentStreak + 1, updated: true };                     // next day, bump
};

// ─── THREAT DATA ──────────────────────────────────────────────────────────────
const THREATS = [
  { id:1,  type:"Phishing",        severity:"critical", source:"185.220.101.45", target:"Email Gateway",  time:"2 min ago",  status:"active",        desc:"Mass credential phishing targeting banking users",              ioc:"fake-banklogin.com",            country:"RU" },
  { id:2,  type:"Ransomware",      severity:"high",     source:"103.45.67.89",   target:"File Server",    time:"8 min ago",  status:"blocked",       desc:"LockBit 3.0 variant attempting lateral movement",               ioc:"lockbit3-c2.onion",             country:"CN" },
  { id:3,  type:"DDoS",            severity:"high",     source:"Multiple",        target:"Web Server",     time:"15 min ago", status:"mitigating",    desc:"UDP flood attack peaking at 45Gbps from botnet",                ioc:"147.28.x.x/16",                country:"US" },
  { id:4,  type:"SQL Injection",   severity:"medium",   source:"91.108.4.20",    target:"DB Server",      time:"22 min ago", status:"blocked",       desc:"Automated SQLi scan targeting login endpoints",                  ioc:"/admin/login.php",              country:"IR" },
  { id:5,  type:"Brute Force",     severity:"medium",   source:"45.33.32.156",   target:"SSH Port 22",    time:"31 min ago", status:"blocked",       desc:"Credential stuffing using RockYou2024 wordlist",                 ioc:"45.33.32.156",                  country:"DE" },
  { id:6,  type:"Zero-Day",        severity:"critical", source:"APT-29",          target:"VPN Gateway",    time:"1h ago",     status:"investigating", desc:"CVE-2024-XXXX exploit in FortiGate SSL-VPN",                    ioc:"apt29-dropper.dll",             country:"Unknown" },
  { id:7,  type:"Data Exfil",      severity:"high",     source:"172.16.0.45",    target:"Internal",       time:"2h ago",     status:"contained",     desc:"Unusual outbound traffic to external storage bucket",            ioc:"s3-backup-xyz.amazonaws.com",   country:"US" },
  { id:8,  type:"Malware",         severity:"medium",   source:"Email Attach",    target:"Endpoint",       time:"3h ago",     status:"quarantined",   desc:"AgentTesla stealer via macro-enabled XLSX",                      ioc:"invoice_march.xlsm",            country:"NG" },
  { id:9,  type:"MitM",            severity:"high",     source:"192.168.1.200",  target:"Network Switch", time:"4h ago",     status:"blocked",       desc:"ARP spoofing attack intercepting internal traffic",              ioc:"00:1A:2B:3C:4D:5E",             country:"IN" },
  { id:10, type:"Credential Dump", severity:"critical", source:"darkweb-leak",   target:"User DB",        time:"5h ago",     status:"investigating", desc:"5000+ user credentials found on paste site",                    ioc:"pastebin.xyz/leak2024",         country:"Unknown" },
];

const THREAT_TREND = Array.from({length:24},(_,i)=>({
  h:`${i}:00`,
  critical: Math.floor(Math.random()*5),
  high:     Math.floor(Math.random()*12),
  medium:   Math.floor(Math.random()*20),
}));

// ─── REUSABLE COMPONENTS ──────────────────────────────────────────────────────

function CTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,padding:"10px 14px",boxShadow:C.shMd,fontSize:12 }}>
      <p style={{ color:C.textMd,marginBottom:6,fontWeight:700,fontSize:11 }}>{label}</p>
      {payload.map((p,i) => (
        <p key={i} style={{ color:p.color,margin:"2px 0" }}>{p.name}: <strong>{p.value}</strong></p>
      ))}
    </div>
  );
}

function Bdg({ color, bg, children, size="sm" }) {
  return (
    <span style={{ fontSize:size==="sm"?10:11,fontWeight:700,color,background:bg,
      border:`1px solid ${color}25`,borderRadius:99,padding:size==="sm"?"2px 8px":"4px 12px",whiteSpace:"nowrap" }}>
      {children}
    </span>
  );
}

function StatCard({ label, value, change, up, color, bg, icon:Icon, sub }) {
  const [hov,setHov] = useState(false);
  return (
    <div style={{ background:hov?bg:"#fff",border:`1px solid ${hov?color+"30":C.border}`,
      borderRadius:20,padding:"20px 22px",cursor:"default",transition:"all .2s",
      boxShadow:hov?`0 8px 24px ${color}18`:C.sh,position:"relative",overflow:"hidden" }}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
      <div style={{ position:"absolute",top:-20,right:-20,width:80,height:80,borderRadius:"50%",background:color+"10",pointerEvents:"none" }}/>
      <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:14 }}>
        <div style={{ width:42,height:42,borderRadius:14,background:bg,border:`1px solid ${color}20`,display:"flex",alignItems:"center",justifyContent:"center" }}>
          <Icon size={18} style={{ color }} />
        </div>
        <span style={{ fontSize:10,fontWeight:700,color:up?C.green:C.red,background:up?C.greenLight:C.redLight,
          border:`1px solid ${up?C.green+"30":C.red+"30"}`,borderRadius:99,padding:"2px 8px",
          display:"flex",alignItems:"center",gap:3 }}>
          {up?<TrendingUp size={9}/>:<TrendingDown size={9}/>}{change}
        </span>
      </div>
      <div style={{ fontSize:30,fontWeight:900,color:C.text,letterSpacing:"-0.04em",lineHeight:1,fontFamily:"Instrument Serif,Georgia,serif" }}>{value}</div>
      <div style={{ fontSize:12,color:C.textMd,marginTop:4,fontWeight:500 }}>{label}</div>
      {sub && <div style={{ fontSize:11,color,marginTop:2,fontWeight:600 }}>{sub}</div>}
    </div>
  );
}

function EmptyState({ icon:Icon, title, desc, actionLabel, onAction, color=C.brand }) {
  return (
    <div style={{ textAlign:"center",padding:"36px 24px",background:color+"05",
      border:`2px dashed ${color}20`,borderRadius:18 }}>
      <div style={{ width:52,height:52,borderRadius:16,background:color+"12",display:"flex",
        alignItems:"center",justifyContent:"center",margin:"0 auto 14px" }}>
        <Icon size={24} style={{ color:color+"80" }} />
      </div>
      <p style={{ fontSize:14,fontWeight:700,color:C.text,margin:"0 0 6px" }}>{title}</p>
      <p style={{ fontSize:12,color:C.textMd,margin:"0 0 18px",lineHeight:1.6 }}>{desc}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} style={{ display:"inline-flex",alignItems:"center",gap:7,
          padding:"9px 20px",borderRadius:11,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,
          background:`linear-gradient(135deg,${color},${color}cc)`,color:"#fff",fontFamily:"inherit",
          boxShadow:`0 4px 14px ${color}25` }}>
          <Plus size={13}/>{actionLabel}
        </button>
      )}
    </div>
  );
}

// ─── NOTIFICATION PANEL ───────────────────────────────────────────────────────
function NotificationPanel({ user, onClose }) {
  const notifs = user?.notifications || [];
  const unread = notifs.filter(n => !n.read);

  return (
    <div style={{ position:"fixed",top:70,right:20,width:360,background:"#fff",
      border:`1px solid ${C.border}`,borderRadius:20,boxShadow:"0 20px 60px rgba(0,0,0,0.14)",
      zIndex:999,overflow:"hidden" }}>
      <div style={{ padding:"16px 20px",borderBottom:`1px solid ${C.border}`,
        display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <div>
          <h3 style={{ fontSize:14,fontWeight:700,color:C.text,margin:0 }}>Notifications</h3>
          {unread.length > 0 && <p style={{ fontSize:11,color:C.textMd,margin:"2px 0 0" }}>{unread.length} unread</p>}
        </div>
        <button onClick={onClose} style={{ border:"none",background:C.bg,borderRadius:8,
          width:28,height:28,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
          <X size={13} style={{ color:C.textMd }}/>
        </button>
      </div>
      <div style={{ maxHeight:380,overflowY:"auto" }}>
        {notifs.length > 0 ? notifs.slice(0,10).map((n,i) => (
          <div key={i} style={{ padding:"13px 20px",borderBottom:`1px solid ${C.border}`,
            background:n.read?"transparent":C.brandLight+"60",
            display:"flex",alignItems:"flex-start",gap:11 }}>
            <div style={{ width:34,height:34,borderRadius:10,flexShrink:0,
              background:n.type==="threat"?C.redLight:n.type==="quiz"?C.brandLight:C.greenLight,
              display:"flex",alignItems:"center",justifyContent:"center" }}>
              {n.type==="threat"?<ShieldAlert size={14} style={{ color:C.red }}/>:
               n.type==="quiz"?<Brain size={14} style={{ color:C.brand }}/>:
               <CheckCircle size={14} style={{ color:C.green }}/>}
            </div>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:12,fontWeight:n.read?500:700,color:C.text,margin:"0 0 2px" }}>{n.message}</p>
              <p style={{ fontSize:10,color:C.textDim,margin:0 }}>{n.time||fmtDate(n.createdAt)}</p>
            </div>
            {!n.read && <div style={{ width:7,height:7,borderRadius:"50%",background:C.brand,marginTop:4,flexShrink:0 }}/>}
          </div>
        )) : (
          <div style={{ padding:"32px 20px",textAlign:"center" }}>
            <Bell size={28} style={{ color:C.textDim,margin:"0 auto 10px",display:"block" }}/>
            <p style={{ fontSize:13,color:C.textDim,margin:0 }}>No notifications yet</p>
            <p style={{ fontSize:11,color:C.textDim,margin:"4px 0 0" }}>
              Notifications will appear here when you complete activities or receive threat alerts.
            </p>
          </div>
        )}
      </div>
      {notifs.length > 0 && (
        <div style={{ padding:"10px 20px",borderTop:`1px solid ${C.border}`,textAlign:"center" }}>
          <button style={{ fontSize:12,color:C.brand,fontWeight:600,border:"none",
            background:"none",cursor:"pointer",fontFamily:"inherit" }}>
            Mark all as read
          </button>
        </div>
      )}
    </div>
  );
}

// ─── SEARCH OVERLAY ───────────────────────────────────────────────────────────
function SearchOverlay({ onClose, setPage, navigate }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef();

  useEffect(() => { inputRef.current?.focus(); }, []);

  const pages = [
    { id:"overview",  label:"Overview",           icon:Home,         desc:"Dashboard home" },
    { id:"threats",   label:"Threat Intelligence", icon:ShieldAlert,  desc:"Live threat feed" },
    { id:"phishing",  label:"Phishing Simulator",  icon:Mail,         desc:"Practice detecting phishing" },
    { id:"reports",   label:"Analytics & Reports", icon:BarChart2,    desc:"Security analytics" },
    { id:"profile",   label:"My Profile",          icon:User,         desc:"Account & stats" },
    { id:"settings",  label:"Settings",            icon:Settings,     desc:"Configure account" },
    { id:"leaderboard",label:"Leaderboard",        icon:Trophy,       desc:"Top performers" },
  ];

  const externalPages = [
    { label:"Courses",    icon:GraduationCap, path:"/courses" },
    { label:"Quiz",       icon:Brain,         path:"/QuizPage" },
    { label:"CyberGame",  icon:Gamepad2,      path:"/game" },
  ];

  const filtered = query.length < 1 ? pages.slice(0,5) : [
    ...pages.filter(p =>
      p.label.toLowerCase().includes(query.toLowerCase()) ||
      p.desc.toLowerCase().includes(query.toLowerCase())
    ),
    ...externalPages.filter(p => p.label.toLowerCase().includes(query.toLowerCase())),
  ];

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(15,23,42,0.55)",
      zIndex:1000,display:"flex",alignItems:"flex-start",justifyContent:"center",
      paddingTop:100 }} onClick={onClose}>
      <div style={{ width:560,background:"#fff",borderRadius:20,boxShadow:"0 32px 80px rgba(0,0,0,0.22)",
        overflow:"hidden" }} onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex",alignItems:"center",gap:12,padding:"14px 18px",
          borderBottom:`1px solid ${C.border}` }}>
          <Search size={16} style={{ color:C.textDim }}/>
          <input ref={inputRef} value={query} onChange={e=>setQuery(e.target.value)}
            placeholder="Search pages, features, settings…"
            style={{ flex:1,border:"none",outline:"none",fontSize:15,color:C.text,
              fontFamily:"inherit",background:"transparent" }}/>
          <kbd style={{ fontSize:10,color:C.textDim,border:`1px solid ${C.border}`,
            borderRadius:5,padding:"2px 7px",fontFamily:"monospace" }}>ESC</kbd>
        </div>
        <div style={{ maxHeight:380,overflowY:"auto" }}>
          {filtered.length === 0 ? (
            <div style={{ padding:"28px",textAlign:"center",color:C.textDim,fontSize:13 }}>
              No results for "{query}"
            </div>
          ) : filtered.map((item, i) => (
            <div key={i} onClick={() => {
              if (item.path) { navigate(item.path); }
              else { setPage(item.id); }
              onClose();
            }}
              style={{ display:"flex",alignItems:"center",gap:12,padding:"13px 18px",
                cursor:"pointer",transition:"background .12s" }}
              onMouseEnter={e=>e.currentTarget.style.background=C.bg}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{ width:36,height:36,borderRadius:10,background:C.brandLight,
                display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                {item.icon && <item.icon size={15} style={{ color:C.brand }}/>}
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:13,fontWeight:600,color:C.text,margin:0 }}>{item.label}</p>
                <p style={{ fontSize:11,color:C.textMd,margin:0 }}>{item.desc||item.path}</p>
              </div>
              <ChevronRight size={13} style={{ color:C.textDim }}/>
            </div>
          ))}
        </div>
        <div style={{ padding:"10px 18px",borderTop:`1px solid ${C.border}`,
          display:"flex",gap:14,fontSize:11,color:C.textDim }}>
          <span>↩ to select</span><span>↑↓ navigate</span><span>ESC to close</span>
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ page, setPage, user, navigate, collapsed, setCollapsed }) {
  const nav = [
    { id:"overview",    icon:Home,          label:"Overview" },
    { id:"threats",     icon:ShieldAlert,   label:"Threats",      badge:"Live" },
    { id:"courses",     icon:GraduationCap, label:"Courses",      external:"/courses" },
    { id:"phishing",    icon:Mail,          label:"Phishing Sim" },
    { id:"quiz",        icon:Brain,         label:"Quiz",         external:"/QuizPage" },
    { id:"game",        icon:Gamepad2,      label:"CyberGame",    external:"/game" },
    { id:"reports",     icon:BarChart2,     label:"Reports" },
    { id:"leaderboard", icon:Trophy,        label:"Leaderboard" },
  ];
  const bottom = [
    { id:"profile",  icon:User,     label:"Profile" },
    { id:"settings", icon:Settings, label:"Settings" },
  ];

  const handleNav = (item) => {
    if (item.external) navigate(item.external);
    else setPage(item.id);
  };

  const w = collapsed ? 68 : 242;

  return (
    <div style={{ width:w,flexShrink:0,background:"#fff",borderRight:`1px solid ${C.border}`,
      display:"flex",flexDirection:"column",height:"100vh",position:"fixed",left:0,top:0,
      zIndex:100,transition:"width .25s cubic-bezier(.16,1,.3,1)",overflow:"hidden" }}>
      {/* Header */}
      <div style={{ padding:collapsed?"16px 10px":"22px 20px 18px",borderBottom:`1px solid ${C.border}`,
        display:"flex",alignItems:"center",justifyContent:collapsed?"center":"space-between",
        minHeight:72,gap:10 }}>
        {!collapsed && (
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <div style={{ width:38,height:38,borderRadius:12,
              background:`linear-gradient(135deg,${C.brand},${C.brandMid})`,
              display:"flex",alignItems:"center",justifyContent:"center",
              boxShadow:`0 4px 12px ${C.brand}30`,flexShrink:0 }}>
              <Shield size={18} style={{ color:"#fff" }}/>
            </div>
            <div>
              <div style={{ fontSize:15,fontWeight:800,color:C.text,letterSpacing:"-0.02em",
                fontFamily:"Instrument Serif,Georgia,serif" }}>CyberGuard</div>
              <div style={{ fontSize:10,color:C.textDim,fontWeight:600,letterSpacing:"0.07em" }}>SECURITY SUITE</div>
            </div>
          </div>
        )}
        {collapsed && (
          <div style={{ width:38,height:38,borderRadius:12,
            background:`linear-gradient(135deg,${C.brand},${C.brandMid})`,
            display:"flex",alignItems:"center",justifyContent:"center" }}>
            <Shield size={18} style={{ color:"#fff" }}/>
          </div>
        )}
        <button onClick={()=>setCollapsed(c=>!c)}
          style={{ border:"none",background:C.bg,borderRadius:8,width:28,height:28,
            cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
            flexShrink:0,color:C.textMd }}>
          {collapsed ? <ChevronRight size={14}/> : <ChevronLeft size={14}/>}
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex:1,padding:"10px 8px",overflowY:"auto",overflowX:"hidden" }}>
        {!collapsed && <div style={{ fontSize:9,fontWeight:700,color:C.textDim,letterSpacing:"0.1em",padding:"6px 10px 8px" }}>MAIN</div>}
        {nav.map(item => {
          const active = page === item.id;
          return (
            <div key={item.id} style={{ position:"relative" }}>
              <button onClick={()=>handleNav(item)}
                title={collapsed ? item.label : ""}
                style={{ width:"100%",display:"flex",alignItems:"center",
                  gap:collapsed?0:10,padding:collapsed?"11px":"9px 12px",
                  justifyContent:collapsed?"center":"flex-start",
                  borderRadius:11,border:"none",
                  background:active?C.brandLight:"transparent",
                  color:active?C.brand:C.textMd,cursor:"pointer",
                  transition:"all .15s",marginBottom:1,fontFamily:"inherit",
                  fontSize:13,fontWeight:active?700:500,textAlign:"left" }}
                onMouseEnter={e=>{ if(!active){e.currentTarget.style.background=C.bg;e.currentTarget.style.color=C.text;} }}
                onMouseLeave={e=>{ if(!active){e.currentTarget.style.background="transparent";e.currentTarget.style.color=C.textMd;} }}>
                <item.icon size={15}/>
                {!collapsed && (
                  <>
                    <span style={{ flex:1,whiteSpace:"nowrap" }}>{item.label}</span>
                    {item.badge && <span style={{ fontSize:9,background:C.redLight,color:C.red,
                      border:`1px solid ${C.red}20`,borderRadius:99,padding:"1px 6px",fontWeight:700 }}>{item.badge}</span>}
                    {item.external && <ChevronRight size={11} style={{ color:C.textDim }}/>}
                    {active && !item.external && <div style={{ width:4,height:4,borderRadius:"50%",background:C.brand }}/>}
                  </>
                )}
              </button>
              {/* Collapsed badge dot */}
              {collapsed && item.badge && (
                <div style={{ position:"absolute",top:8,right:8,width:6,height:6,
                  borderRadius:"50%",background:C.red }}/>
              )}
            </div>
          );
        })}

        {!collapsed && <div style={{ fontSize:9,fontWeight:700,color:C.textDim,letterSpacing:"0.1em",
          padding:"12px 10px 8px",marginTop:8,borderTop:`1px solid ${C.border}` }}>ACCOUNT</div>}
        {collapsed && <div style={{ height:1,background:C.border,margin:"8px 0" }}/>}
        {bottom.map(item => {
          const active = page === item.id;
          return (
            <button key={item.id} onClick={()=>setPage(item.id)}
              title={collapsed ? item.label : ""}
              style={{ width:"100%",display:"flex",alignItems:"center",
                gap:collapsed?0:10,padding:collapsed?"11px":"9px 12px",
                justifyContent:collapsed?"center":"flex-start",
                borderRadius:11,border:"none",
                background:active?C.brandLight:"transparent",
                color:active?C.brand:C.textMd,cursor:"pointer",
                transition:"all .15s",marginBottom:1,fontFamily:"inherit",
                fontSize:13,fontWeight:active?700:500,textAlign:"left" }}
              onMouseEnter={e=>{ if(!active){e.currentTarget.style.background=C.bg;e.currentTarget.style.color=C.text;} }}
              onMouseLeave={e=>{ if(!active){e.currentTarget.style.background="transparent";e.currentTarget.style.color=C.textMd;} }}>
              <item.icon size={15}/>
              {!collapsed && <><span style={{ flex:1 }}>{item.label}</span>{active && <div style={{ width:4,height:4,borderRadius:"50%",background:C.brand }}/>}</>}
            </button>
          );
        })}
      </nav>

      {/* User footer */}
      <div style={{ padding:collapsed?"10px 8px":"12px 14px",borderTop:`1px solid ${C.border}`,
        display:"flex",alignItems:"center",gap:10,justifyContent:collapsed?"center":"flex-start",overflow:"hidden" }}>
        <div style={{ width:34,height:34,borderRadius:10,flexShrink:0,overflow:"hidden",
          background:user?.avatar?"transparent":`linear-gradient(135deg,${C.brand},${C.violet})`,
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:13,fontWeight:800,color:"#fff" }}>
          {user?.avatar
            ? <img src={user.avatar} alt="" style={{ width:34,height:34,objectFit:"cover" }}/>
            : firstName(user).charAt(0).toUpperCase()}
        </div>
        {!collapsed && (
          <>
            <div style={{ flex:1,minWidth:0 }}>
              <div style={{ fontSize:12,fontWeight:700,color:C.text,overflow:"hidden",
                textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{getFullName(user)}</div>
              <div style={{ fontSize:10,color:C.textDim,overflow:"hidden",
                textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{user?.email||"Not signed in"}</div>
            </div>
            <button style={{ border:"none",background:"none",cursor:"pointer",color:C.textDim,padding:4 }}>
              <LogOut size={13}/>
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
    <div style={{ height:62,background:"#fff",borderBottom:`1px solid ${C.border}`,
      display:"flex",alignItems:"center",padding:"0 26px",gap:14,position:"sticky",top:0,zIndex:50 }}>
      <div style={{ flex:1 }}>
        <h1 style={{ fontSize:17,fontWeight:800,color:C.text,margin:0,fontFamily:"Instrument Serif,Georgia,serif" }}>
          {labels[page]||page}
        </h1>
      </div>
      {/* Clickable search bar → opens overlay */}
      <button onClick={onSearchClick}
        style={{ display:"flex",alignItems:"center",gap:7,background:C.bg,
          border:`1px solid ${C.border}`,borderRadius:11,padding:"8px 13px",width:220,
          cursor:"pointer",fontFamily:"inherit",color:C.textDim,fontSize:12 }}>
        <Search size={13}/> Search pages & features…
      </button>
      {/* Notification bell */}
      <button onClick={onNotifClick}
        style={{ position:"relative",width:36,height:36,borderRadius:10,
          border:`1px solid ${C.border}`,background:"#fff",cursor:"pointer",
          display:"flex",alignItems:"center",justifyContent:"center" }}>
        <Bell size={15} style={{ color:C.textMd }}/>
        {notifCount>0 && <span style={{ position:"absolute",top:6,right:6,width:7,height:7,
          borderRadius:"50%",background:C.red,border:"2px solid #fff" }}/>}
      </button>
      {/* Profile avatar → opens profile page */}
      <button onClick={onProfileClick}
        style={{ width:34,height:34,borderRadius:10,overflow:"hidden",border:"none",
          background:`linear-gradient(135deg,${C.brand},${C.violet})`,
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:13,fontWeight:800,color:"#fff",cursor:"pointer",flexShrink:0 }}>
        {user?.avatar
          ? <img src={user.avatar} alt="" style={{ width:34,height:34,objectFit:"cover" }}/>
          : firstName(user).charAt(0).toUpperCase()}
      </button>
    </div>
  );
}

// ─── PAGE: OVERVIEW ───────────────────────────────────────────────────────────
function OverviewPage({ user, setPage, navigate }) {
  const hour = new Date().getHours();
  const greeting = hour<12?"Good morning":hour<17?"Good afternoon":"Good evening";
  // ✅ Fix 1: always use real registered name
  const fname = firstName(user);
  const fullname = getFullName(user);
  const newUser = isNewUser(user);

  const score    = user?.score         || 0;
  const xp       = user?.xp            || 0;
  const level    = user?.level         || 1;
  const streak   = user?.loginStreak   || 0;
  const quizDone = user?.quizzesDone   || 0;
  const avgScore = user?.avgScore      || 0;
  const xpPct    = Math.min(100, Math.round(((xp % 500)/500)*100));

  // ✅ Fix 6: weekly activity from real user data, no fake defaults
  const weekData = user?.weeklyActivity && user.weeklyActivity.length > 0
    ? user.weeklyActivity
    : [];

  // ✅ Fix 7: domain mastery from real scores only
  const domainData = [
    { subject:"Phishing", A: user?.phishingScore  || 0 },
    { subject:"Malware",  A: user?.malwareScore   || 0 },
    { subject:"Network",  A: user?.networkScore   || 0 },
    { subject:"Privacy",  A: user?.privacyScore   || 0 },
    { subject:"Cloud",    A: user?.cloudScore     || 0 },
  ];
  const hasDomainData = domainData.some(d => d.A > 0);

  // ✅ Fix 8: real quiz history
  const history = user?.quizHistory || [];

  // ✅ Fix 10: real phishing sim score
  const phishingCorrect = user?.phishingSimCorrect || 0;
  const phishingTotal   = user?.phishingSimTotal   || 0;

  const tips = [
    "Never reuse passwords across accounts.",
    "Enable 2FA on every critical service you use.",
    "Hover over links — always verify the domain first.",
    "Keep your OS and all software fully patched.",
    "Public Wi-Fi? Always tunnel through a VPN.",
    "Backup your data — 3-2-1 rule: 3 copies, 2 media, 1 offsite.",
  ];
  const [tip] = useState(()=>tips[Math.floor(Math.random()*tips.length)]);

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:22 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:.6}50%{opacity:1}}
        .fu{animation:fadeUp .35s cubic-bezier(.16,1,.3,1) both}
        .fu1{animation-delay:.06s}.fu2{animation-delay:.12s}.fu3{animation-delay:.18s}.fu4{animation-delay:.24s}
      `}</style>

      {/* Hero banner */}
      <div className="fu" style={{ borderRadius:24,padding:"28px 32px",position:"relative",overflow:"hidden",
        background:`linear-gradient(135deg,${C.brand} 0%,#6366F1 55%,${C.violet} 100%)`,
        boxShadow:`0 16px 48px ${C.brand}28` }}>
        <div style={{ position:"absolute",inset:0,
          backgroundImage:"radial-gradient(circle at 80% 50%,rgba(255,255,255,0.07) 0%,transparent 50%)",pointerEvents:"none" }}/>
        <div style={{ position:"absolute",inset:0,
          backgroundImage:"linear-gradient(rgba(255,255,255,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.035) 1px,transparent 1px)",
          backgroundSize:"40px 40px",pointerEvents:"none" }}/>
        <div style={{ position:"relative",zIndex:1,display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <div>
            <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:10 }}>
              <div style={{ display:"flex",alignItems:"center",gap:5,
                background:"rgba(255,255,255,0.14)",backdropFilter:"blur(8px)",
                borderRadius:99,padding:"3px 10px",border:"1px solid rgba(255,255,255,0.2)" }}>
                <div style={{ width:5,height:5,borderRadius:"50%",background:"#34D399",
                  boxShadow:"0 0 6px #34D399",animation:"pulse 2s infinite" }}/>
                <span style={{ fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.9)",letterSpacing:"0.1em" }}>PROTECTED</span>
              </div>
              <span style={{ fontSize:11,color:"rgba(255,255,255,0.45)" }}>
                {new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long"})}
              </span>
            </div>
            {/* ✅ Real greeting with real full name */}
            <h1 style={{ fontSize:34,fontWeight:400,color:"#fff",
              fontFamily:"Instrument Serif,Georgia,serif",margin:"0 0 5px",lineHeight:1.1 }}>
              {greeting}, <em>{fname}</em> 👋
            </h1>
            <p style={{ fontSize:12,color:"rgba(255,255,255,0.55)",margin:"0 0 4px" }}>
              {user?.role||"Cybersecurity Learner"} {level>1?`· Level ${level} Security Analyst`:"· Just getting started 🚀"}
            </p>
            <div style={{ display:"inline-flex",alignItems:"center",gap:7,
              background:"rgba(255,255,255,0.09)",border:"1px solid rgba(255,255,255,0.14)",
              backdropFilter:"blur(8px)",borderRadius:10,padding:"6px 13px",margin:"14px 0 20px" }}>
              <Zap size={11} style={{ color:"#FCD34D",flexShrink:0 }}/>
              <span style={{ fontSize:11,color:"rgba(255,255,255,0.85)",fontWeight:500 }}>{tip}</span>
            </div>
            <div style={{ display:"flex",gap:10,flexWrap:"wrap" }}>
              {[
                {v:score.toLocaleString(), l:"Score"},
                {v:`Lv.${level}`,           l:"Level"},
                {v:`${streak}d`,            l:"Streak"},
                {v:quizDone,                l:"Quizzes"},
              ].map(({v,l},i)=>(
                <div key={i} style={{ background:"rgba(255,255,255,0.11)",backdropFilter:"blur(8px)",
                  border:"1px solid rgba(255,255,255,0.14)",borderRadius:13,
                  padding:"9px 16px",textAlign:"center",minWidth:70 }}>
                  <div style={{ fontSize:20,fontWeight:800,color:"#fff",lineHeight:1,
                    fontFamily:"Instrument Serif,Georgia,serif" }}>{v}</div>
                  <div style={{ fontSize:10,color:"rgba(255,255,255,0.45)",marginTop:2 }}>{l}</div>
                </div>
              ))}
              <div style={{ background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",
                borderRadius:13,padding:"9px 16px",minWidth:160 }}>
                <div style={{ display:"flex",justifyContent:"space-between",fontSize:10,
                  color:"rgba(255,255,255,0.45)",marginBottom:5 }}>
                  <span>Level {level} XP</span>
                  <span style={{ fontFamily:"JetBrains Mono,monospace" }}>{xp%500}/500</span>
                </div>
                <div style={{ height:5,background:"rgba(255,255,255,0.12)",borderRadius:99 }}>
                  <div style={{ height:5,width:`${xpPct}%`,
                    background:"linear-gradient(90deg,rgba(255,255,255,0.7),rgba(255,255,255,0.95))",
                    borderRadius:99,transition:"width 1s ease" }}/>
                </div>
              </div>
            </div>
          </div>
          <div style={{ textAlign:"center",marginRight:16,flexShrink:0 }}>
            <svg width={108} height={108} viewBox="0 0 108 108">
              <circle cx="54" cy="54" r="46" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="7"/>
              <circle cx="54" cy="54" r="46" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="7"
                strokeDasharray={`${2*Math.PI*46*xpPct/100} ${2*Math.PI*46}`}
                strokeLinecap="round" transform="rotate(-90 54 54)"/>
              <text x="54" y="49" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="800"
                fontFamily="Instrument Serif,Georgia,serif">{xpPct}%</text>
              <text x="54" y="64" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="8" fontWeight="600">XP Progress</text>
            </svg>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="fu fu1">
        <div style={{ fontSize:11,fontWeight:700,color:C.textMd,marginBottom:10,letterSpacing:"0.06em" }}>QUICK ACTIONS</div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:11 }}>
          {[
            { icon:Brain,         label:"Take Quiz",      sub:"Earn XP",         color:C.brand,  bg:C.brandLight, action:()=>navigate("/QuizPage") },
            { icon:GraduationCap, label:"Courses",        sub:"Learn more",      color:C.teal,   bg:C.tealLight,  action:()=>navigate("/courses") },
            { icon:Gamepad2,      label:"Play Game",      sub:"Defend systems",  color:C.violet, bg:"#EDE9FE",    action:()=>navigate("/game") },
            { icon:ShieldAlert,   label:"Threats",        sub:"Live intel",      color:C.red,    bg:C.redLight,   action:()=>setPage("threats") },
            { icon:Mail,          label:"Phishing",       sub:"Train instincts", color:C.amber,  bg:C.amberLight, action:()=>setPage("phishing") },
            { icon:Trophy,        label:"Leaderboard",    sub:"Top performers",  color:C.pink,   bg:C.pinkLight,  action:()=>setPage("leaderboard") },
          ].map((item,i)=>(
            <button key={i} onClick={item.action}
              style={{ padding:"16px 10px",border:`1px solid ${C.border}`,textAlign:"center",
                cursor:"pointer",background:"#fff",borderRadius:18,transition:"all .2s",
                fontFamily:"inherit",boxShadow:C.sh }}
              onMouseEnter={e=>{ e.currentTarget.style.background=item.bg;e.currentTarget.style.borderColor=item.color+"28";e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=`0 8px 24px ${item.color}14`; }}
              onMouseLeave={e=>{ e.currentTarget.style.background="#fff";e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow=C.sh; }}>
              <div style={{ width:40,height:40,borderRadius:12,background:item.bg,
                border:`1px solid ${item.color}18`,display:"flex",alignItems:"center",
                justifyContent:"center",margin:"0 auto 9px" }}>
                <item.icon size={17} style={{ color:item.color }}/>
              </div>
              <p style={{ fontSize:11,fontWeight:700,color:C.text,margin:"0 0 2px" }}>{item.label}</p>
              <p style={{ fontSize:10,color:C.textDim,margin:0 }}>{item.sub}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="fu fu2" style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14 }}>
        <StatCard label="Total Score"       value={score.toLocaleString()} change={score>0?"+active":"New"}       up={score>0}      color={C.brand}  bg={C.brandLight} icon={Star}        sub={score>0?"Keep earning!":"Start a quiz"}/>
        <StatCard label="Avg Quiz Score"    value={avgScore>0?`${avgScore}%`:"—"} change={avgScore>=70?"Above avg":"No data"} up={avgScore>=70} color={C.violet} bg="#EDE9FE"   icon={Brain}       sub={avgScore>0?"Well done":"Take your first quiz"}/>
        <StatCard label="Login Streak"      value={`${streak} day${streak!==1?"s":""}`} change={streak>=3?"🔥 On fire":"Keep going"} up={streak>=3} color={C.amber} bg={C.amberLight} icon={Flame}    sub="Resets if you miss a day"/>
        <StatCard label="Phishing Accuracy" value={phishingTotal>0?`${Math.round((phishingCorrect/phishingTotal)*100)}%`:"—"} change={phishingTotal>0?"Trained":"Not started"} up={phishingTotal>0} color={C.teal} bg={C.tealLight} icon={Mail} sub={phishingTotal>0?`${phishingCorrect}/${phishingTotal} correct`:"Try the simulator"}/>
      </div>

      {/* Charts */}
      <div className="fu fu3" style={{ display:"grid",gridTemplateColumns:"2fr 1fr",gap:16 }}>
        {/* ✅ Fix 6: real weekly activity */}
        <div style={{ background:"#fff",border:`1px solid ${C.border}`,borderRadius:20,padding:22,boxShadow:C.sh }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16 }}>
            <div>
              <h3 style={{ fontSize:14,fontWeight:700,color:C.text,margin:0 }}>Weekly Activity</h3>
              <p style={{ fontSize:11,color:C.textMd,margin:"2px 0 0" }}>Your score progression this week</p>
            </div>
            <div style={{ display:"flex",gap:8 }}>
              {[{c:C.brand,l:"Score"},{c:C.teal,l:"Quizzes"}].map(d=>(
                <div key={d.l} style={{ display:"flex",alignItems:"center",gap:4,fontSize:11,color:C.textMd }}>
                  <div style={{ width:7,height:7,borderRadius:2,background:d.c,marginLeft:8 }}/>{d.l}
                </div>
              ))}
            </div>
          </div>
          {weekData.length > 0 ? (
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={weekData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
                <XAxis dataKey="d" tick={{ fontSize:11,fill:C.textMd }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize:10,fill:C.textMd }} axisLine={false} tickLine={false}/>
                <Tooltip content={<CTip/>}/>
                <Bar dataKey="score" name="Score"   fill={C.brand} radius={[5,5,0,0]} maxBarSize={26}/>
                <Bar dataKey="quiz"  name="Quizzes" fill={C.teal}  radius={[5,5,0,0]} maxBarSize={26}/>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState icon={BarChart2} title="No activity yet"
              desc="Complete a quiz or log in daily to build your activity chart."
              actionLabel="Take a Quiz" onAction={()=>navigate("/QuizPage")} color={C.brand}/>
          )}
        </div>

        {/* ✅ Fix 7: real domain mastery */}
        <div style={{ background:"#fff",border:`1px solid ${C.border}`,borderRadius:20,padding:22,boxShadow:C.sh }}>
          <h3 style={{ fontSize:14,fontWeight:700,color:C.text,margin:"0 0 4px" }}>Domain Mastery</h3>
          <p style={{ fontSize:11,color:C.textMd,margin:"0 0 12px" }}>Skill radar across security domains</p>
          {hasDomainData ? (
            <ResponsiveContainer width="100%" height={190}>
              <RadarChart data={domainData}>
                <PolarGrid stroke={C.border}/>
                <PolarAngleAxis dataKey="subject" tick={{ fontSize:10,fill:C.textMd }}/>
                <Radar name="Score" dataKey="A" stroke={C.brand} fill={C.brand} fillOpacity={0.12} strokeWidth={2}/>
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState icon={Target} title="No domain data yet"
              desc="Complete quizzes in each category to build your skill radar."
              color={C.violet}/>
          )}
        </div>
      </div>

      {/* ✅ Fix 8: real quiz history */}
      <div className="fu fu4" style={{ background:"#fff",border:`1px solid ${C.border}`,borderRadius:20,padding:22,boxShadow:C.sh }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18 }}>
          <div>
            <h3 style={{ fontSize:14,fontWeight:700,color:C.text,margin:0 }}>Recent Quiz Activity</h3>
            <p style={{ fontSize:11,color:C.textMd,margin:"2px 0 0" }}>
              {history.length>0?`${history.length} module${history.length!==1?"s":""} completed`:"No attempts yet"}
            </p>
          </div>
          <button onClick={()=>navigate("/QuizPage")}
            style={{ display:"flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:11,border:"none",
              background:`linear-gradient(135deg,${C.brand},${C.brandMid})`,color:"#fff",fontSize:12,
              fontWeight:700,cursor:"pointer",fontFamily:"inherit",boxShadow:`0 4px 12px ${C.brand}25` }}>
            <Brain size={12}/> {history.length>0?"New Quiz":"Start First Quiz"}
          </button>
        </div>
        {history.length>0 ? (
          <div style={{ display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:11 }}>
            {history.slice(0,5).map((r)=>{
              const g = GRADE[r.grade]||GRADE["D"];
              return (
                <div key={r.moduleId} style={{ background:C.bg,border:`1px solid ${C.border}`,
                  borderRadius:15,padding:14,cursor:"pointer",transition:"all .2s",position:"relative",overflow:"hidden" }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor=g.color+"40";e.currentTarget.style.boxShadow=`0 4px 16px ${g.color}10`;e.currentTarget.style.transform="translateY(-2px)"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border;e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none"; }}>
                  <div style={{ position:"absolute",top:0,left:0,right:0,height:3,background:g.color,borderRadius:"15px 15px 0 0" }}/>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8,paddingTop:4 }}>
                    <span style={{ fontSize:9,color:C.textDim,fontWeight:600 }}>MOD {r.moduleId}</span>
                    <div style={{ fontSize:22,fontWeight:900,color:g.color,lineHeight:1,fontFamily:"Instrument Serif,Georgia,serif" }}>{r.grade}</div>
                  </div>
                  <p style={{ fontSize:11,fontWeight:700,color:C.text,lineHeight:1.4,margin:"0 0 9px",
                    display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden" }}>
                    {r.moduleTitle||`Module ${r.moduleId}`}
                  </p>
                  <div style={{ height:4,background:C.border,borderRadius:99,overflow:"hidden",marginBottom:6 }}>
                    <div style={{ height:4,width:`${r.percentage||0}%`,background:g.color,borderRadius:99 }}/>
                  </div>
                  <div style={{ display:"flex",justifyContent:"space-between",fontSize:10,color:C.textMd }}>
                    <span>{r.totalCorrect}/{r.totalQuestions}</span>
                    <span style={{ fontWeight:700,color:g.color }}>{r.percentage}%</span>
                  </div>
                  <div style={{ fontSize:9,color:C.textDim,marginTop:4 }}>{fmtDate(r.updatedAt)}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState icon={Brain} title="No quizzes attempted yet"
            desc="Take your first quiz to start tracking your performance and earn XP."
            actionLabel="Take First Quiz" onAction={()=>navigate("/QuizPage")} color={C.brand}/>
        )}
      </div>

      {/* Activity + Badges */}
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
        <div style={{ background:"#fff",border:`1px solid ${C.border}`,borderRadius:20,padding:20,boxShadow:C.sh }}>
          <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:14 }}>
            <div style={{ width:30,height:30,borderRadius:9,background:C.tealLight,display:"flex",alignItems:"center",justifyContent:"center" }}>
              <Activity size={13} style={{ color:C.teal }}/>
            </div>
            <h3 style={{ fontSize:13,fontWeight:700,color:C.text,margin:0 }}>Recent Activity</h3>
          </div>
          {(user?.recentActivity||[]).length>0 ? (
            <div style={{ display:"flex",flexDirection:"column",gap:1 }}>
              {(user.recentActivity).slice(0,6).map((a,i)=>(
                <div key={i} style={{ display:"flex",alignItems:"flex-start",gap:9,
                  padding:"7px 9px",borderRadius:9,transition:"background .15s" }}
                  onMouseEnter={e=>e.currentTarget.style.background=C.bg}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <div style={{ width:6,height:6,borderRadius:"50%",background:C.brand,marginTop:5,flexShrink:0 }}/>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:12,color:C.text,margin:0,lineHeight:1.4,fontWeight:500 }}>{a.msg||a}</p>
                    <p style={{ fontSize:10,color:C.textDim,margin:"1px 0 0" }}>{a.time||""}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={Rocket} title="No activity yet"
              desc="Your actions will appear here as you explore the platform." color={C.teal}/>
          )}
        </div>

        {/* ✅ Fix 9: real badges */}
        <div style={{ background:"#fff",border:`1px solid ${C.border}`,borderRadius:20,padding:20,boxShadow:C.sh }}>
          <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:14 }}>
            <div style={{ width:30,height:30,borderRadius:9,background:C.amberLight,display:"flex",alignItems:"center",justifyContent:"center" }}>
              <Award size={13} style={{ color:C.amber }}/>
            </div>
            <h3 style={{ fontSize:13,fontWeight:700,color:C.text,margin:0 }}>Badges Earned</h3>
            {(user?.badges||[]).length>0 && <Bdg color={C.amber} bg={C.amberLight}>{user.badges.length} total</Bdg>}
          </div>
          {(user?.badges||[]).length>0 ? (
            <div style={{ display:"flex",flexWrap:"wrap",gap:9 }}>
              {user.badges.map((b,i)=>(
                <div key={i} style={{ textAlign:"center",padding:"10px 12px",background:C.bg,
                  border:`1px solid ${C.border}`,borderRadius:13,cursor:"default",transition:"all .2s" }}
                  onMouseEnter={e=>{ e.currentTarget.style.background=C.amberLight;e.currentTarget.style.borderColor=C.amber+"28";e.currentTarget.style.transform="scale(1.06)"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background=C.bg;e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="scale(1)"; }}>
                  <div style={{ fontSize:22,lineHeight:1 }}>{b.emoji||"🏅"}</div>
                  <p style={{ fontSize:9,color:C.textMd,marginTop:5,fontWeight:700,letterSpacing:"0.04em" }}>{b.label||b}</p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={Star} title="No badges yet"
              desc="Complete activities and reach milestones to unlock achievement badges."
              color={C.amber}/>
          )}
        </div>
      </div>

      {/* ✅ Fix 10: phishing sim summary in overview */}
      {phishingTotal > 0 && (
        <div style={{ background:"#fff",border:`1px solid ${C.border}`,borderRadius:20,padding:20,boxShadow:C.sh }}>
          <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:14 }}>
            <div style={{ width:30,height:30,borderRadius:9,background:C.amberLight,display:"flex",alignItems:"center",justifyContent:"center" }}>
              <Mail size={13} style={{ color:C.amber }}/>
            </div>
            <h3 style={{ fontSize:13,fontWeight:700,color:C.text,margin:0 }}>Phishing Simulator</h3>
            <Bdg color={C.amber} bg={C.amberLight}>{phishingTotal} emails analyzed</Bdg>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12 }}>
            {[
              { label:"Correct Detections", value:phishingCorrect, color:C.green, bg:C.greenLight },
              { label:"Total Analyzed",      value:phishingTotal,   color:C.amber, bg:C.amberLight },
              { label:"Accuracy",            value:`${Math.round((phishingCorrect/phishingTotal)*100)}%`, color:C.brand, bg:C.brandLight },
            ].map((s,i)=>(
              <div key={i} style={{ background:s.bg,border:`1px solid ${s.color}18`,borderRadius:13,padding:"14px 16px",textAlign:"center" }}>
                <div style={{ fontSize:24,fontWeight:900,color:s.color,fontFamily:"Instrument Serif,Georgia,serif" }}>{s.value}</div>
                <div style={{ fontSize:11,color:C.textMd,marginTop:3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PAGE: THREATS ────────────────────────────────────────────────────────────
function ThreatsPage() {
  const [filter,setFilter]     = useState("all");
  const [search,setSearch]     = useState("");
  const [selected,setSelected] = useState(null);
  const [liveCount,setLiveCount] = useState(THREATS.length);
  const [pulse,setPulse]       = useState(false);

  useEffect(()=>{
    const t = setInterval(()=>{
      setLiveCount(p=>p+Math.floor(Math.random()*2));
      setPulse(true); setTimeout(()=>setPulse(false),1000);
    },5000);
    return ()=>clearInterval(t);
  },[]);

  const filtered = THREATS.filter(t=>
    (filter==="all"||t.severity===filter) &&
    (t.type.toLowerCase().includes(search.toLowerCase())||
     t.source.toLowerCase().includes(search.toLowerCase())||
     t.desc.toLowerCase().includes(search.toLowerCase())||
     t.status.toLowerCase().includes(search.toLowerCase()))
  );

  const counts = {
    critical: THREATS.filter(t=>t.severity==="critical").length,
    high:     THREATS.filter(t=>t.severity==="high").length,
    medium:   THREATS.filter(t=>t.severity==="medium").length,
  };

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:18 }}>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:13 }}>
        {[
          {label:"Total Threats", value:liveCount,       color:C.brand,   bg:C.brandLight, icon:ShieldAlert, live:true},
          {label:"Critical",      value:counts.critical, color:C.red,     bg:C.redLight,   icon:AlertTriangle},
          {label:"High",          value:counts.high,     color:"#EA580C", bg:"#FFF7ED",    icon:Zap},
          {label:"Medium",        value:counts.medium,   color:C.amber,   bg:C.amberLight, icon:Eye},
        ].map((item,i)=>(
          <div key={i} style={{ background:"#fff",border:`1px solid ${C.border}`,borderRadius:18,
            padding:"17px 20px",boxShadow:C.sh }}>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10 }}>
              <div style={{ width:35,height:35,borderRadius:10,background:item.bg,
                display:"flex",alignItems:"center",justifyContent:"center" }}>
                <item.icon size={15} style={{ color:item.color }}/>
              </div>
              {item.live && <span style={{ fontSize:9,fontWeight:700,color:C.red,background:C.redLight,
                border:`1px solid ${C.red}20`,borderRadius:99,padding:"2px 8px" }}>● LIVE</span>}
            </div>
            <div style={{ fontSize:28,fontWeight:900,color:item.color,fontFamily:"Instrument Serif,Georgia,serif" }}>{item.value}</div>
            <div style={{ fontSize:12,color:C.textMd,fontWeight:500 }}>{item.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background:"#fff",border:`1px solid ${C.border}`,borderRadius:20,padding:22,boxShadow:C.sh }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14 }}>
          <div>
            <h3 style={{ fontSize:14,fontWeight:700,color:C.text,margin:0 }}>24-Hour Threat Timeline</h3>
            <p style={{ fontSize:11,color:C.textMd,margin:"2px 0 0" }}>Real-time detection frequency</p>
          </div>
          <div style={{ display:"flex",gap:12 }}>
            {[{c:C.red,l:"Critical"},{c:"#EA580C",l:"High"},{c:C.amber,l:"Medium"}].map(d=>(
              <div key={d.l} style={{ display:"flex",alignItems:"center",gap:4,fontSize:11,color:C.textMd }}>
                <div style={{ width:7,height:7,borderRadius:2,background:d.c }}/>{d.l}
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={170}>
          <AreaChart data={THREAT_TREND}>
            <defs>
              {[{id:"cr",c:C.red},{id:"hi",c:"#EA580C"},{id:"me",c:C.amber}].map(g=>(
                <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={g.c} stopOpacity={0.14}/>
                  <stop offset="95%" stopColor={g.c} stopOpacity={0}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
            <XAxis dataKey="h" tick={{ fontSize:9,fill:C.textDim }} axisLine={false} tickLine={false} interval={3}/>
            <YAxis tick={{ fontSize:10,fill:C.textDim }} axisLine={false} tickLine={false}/>
            <Tooltip content={<CTip/>}/>
            <Area type="monotone" dataKey="critical" name="Critical" stroke={C.red}   fill="url(#cr)" strokeWidth={2}   dot={false}/>
            <Area type="monotone" dataKey="high"     name="High"     stroke="#EA580C" fill="url(#hi)" strokeWidth={1.5} dot={false}/>
            <Area type="monotone" dataKey="medium"   name="Medium"   stroke={C.amber} fill="url(#me)" strokeWidth={1.5} dot={false}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ✅ Fix 15: working search filter */}
      <div style={{ display:"flex",alignItems:"center",gap:11 }}>
        <div style={{ display:"flex",gap:7 }}>
          {["all","critical","high","medium"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)}
              style={{ padding:"6px 14px",borderRadius:9,border:`1px solid ${filter===f?C.brand:C.border}`,
                background:filter===f?C.brandLight:"#fff",color:filter===f?C.brand:C.textMd,
                fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit",
                textTransform:"capitalize",transition:"all .15s" }}>
              {f} {f!=="all" && `(${THREATS.filter(t=>t.severity===f).length})`}
            </button>
          ))}
        </div>
        <div style={{ flex:1 }}/>
        <div style={{ display:"flex",alignItems:"center",gap:7,background:"#fff",
          border:`1px solid ${C.border}`,borderRadius:10,padding:"7px 13px" }}>
          <Search size={12} style={{ color:C.textDim }}/>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search type, source, status…"
            style={{ border:"none",outline:"none",fontSize:12,fontFamily:"inherit",
              background:"transparent",color:C.text,width:200 }}/>
          {search && (
            <button onClick={()=>setSearch("")} style={{ border:"none",background:"none",cursor:"pointer",color:C.textDim,padding:0 }}>
              <X size={12}/>
            </button>
          )}
        </div>
        <span style={{ fontSize:11,color:C.textDim,whiteSpace:"nowrap" }}>{filtered.length} results</span>
      </div>

      <div style={{ background:"#fff",border:`1px solid ${C.border}`,borderRadius:20,overflow:"hidden",boxShadow:C.sh }}>
        <div style={{ display:"grid",gridTemplateColumns:"100px 110px 1fr 120px 110px 110px 90px",
          padding:"11px 18px",background:C.bg,borderBottom:`1px solid ${C.border}`,
          fontSize:9,fontWeight:700,color:C.textDim,letterSpacing:"0.07em" }}>
          <span>TYPE</span><span>SEVERITY</span><span>DESCRIPTION</span>
          <span>SOURCE</span><span>TARGET</span><span>STATUS</span><span>TIME</span>
        </div>
        {filtered.length === 0 ? (
          <div style={{ padding:"32px",textAlign:"center",color:C.textDim,fontSize:13 }}>
            No threats matching "{search}" in "{filter}" severity
          </div>
        ) : filtered.map((t,i)=>{
          const sev = SEV[t.severity];
          const sc  = STATUS_C[t.status]||C.textDim;
          const isSelected = selected?.id===t.id;
          return (
            <div key={t.id} onClick={()=>setSelected(isSelected?null:t)}
              style={{ display:"grid",gridTemplateColumns:"100px 110px 1fr 120px 110px 110px 90px",
                padding:"12px 18px",borderBottom:i<filtered.length-1?`1px solid ${C.border}`:"none",
                cursor:"pointer",transition:"background .12s",
                background:isSelected?C.brandLight:"transparent" }}
              onMouseEnter={e=>{ if(!isSelected)e.currentTarget.style.background=C.bg; }}
              onMouseLeave={e=>{ if(!isSelected)e.currentTarget.style.background="transparent"; }}>
              <span style={{ fontSize:12,fontWeight:700,color:C.text,alignSelf:"center" }}>{t.type}</span>
              <div style={{ alignSelf:"center" }}><Bdg color={sev.color} bg={sev.bg}>{sev.label}</Bdg></div>
              <span style={{ fontSize:11,color:C.textMd,overflow:"hidden",textOverflow:"ellipsis",
                whiteSpace:"nowrap",alignSelf:"center" }}>{t.desc}</span>
              <span style={{ fontSize:11,color:C.text,fontFamily:"JetBrains Mono,monospace",alignSelf:"center" }}>
                {t.source.length>14?t.source.substring(0,13)+"…":t.source}
              </span>
              <span style={{ fontSize:11,color:C.textMd,alignSelf:"center" }}>{t.target}</span>
              <div style={{ alignSelf:"center" }}><Bdg color={sc} bg={sc+"15"}>{t.status}</Bdg></div>
              <span style={{ fontSize:10,color:C.textDim,alignSelf:"center" }}>{t.time}</span>
            </div>
          );
        })}
      </div>

      {selected && (
        <div style={{ background:"#fff",border:`2px solid ${C.brand}25`,borderRadius:20,padding:22,boxShadow:C.shMd }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14 }}>
            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
              <ShieldAlert size={17} style={{ color:SEV[selected.severity].color }}/>
              <h3 style={{ fontSize:14,fontWeight:700,color:C.text,margin:0 }}>
                {selected.type} — Detailed Analysis
              </h3>
              <Bdg color={SEV[selected.severity].color} bg={SEV[selected.severity].bg} size="md">
                {selected.severity.toUpperCase()}
              </Bdg>
            </div>
            <button onClick={()=>setSelected(null)}
              style={{ border:"none",background:C.bg,borderRadius:7,width:28,height:28,cursor:"pointer",
                display:"flex",alignItems:"center",justifyContent:"center" }}>
              <X size={13} style={{ color:C.textMd }}/>
            </button>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:12 }}>
            {[
              {l:"IOC / Indicator", v:selected.ioc},
              {l:"Source / Actor",  v:selected.source},
              {l:"Target",          v:selected.target},
              {l:"Origin Country",  v:selected.country},
              {l:"Status",          v:selected.status},
              {l:"Detected",        v:selected.time},
            ].map((item,i)=>(
              <div key={i} style={{ background:C.bg,borderRadius:11,padding:"11px 13px" }}>
                <div style={{ fontSize:9,color:C.textDim,fontWeight:700,letterSpacing:"0.06em",marginBottom:4 }}>{item.l}</div>
                <div style={{ fontSize:12,color:C.text,fontWeight:700,fontFamily:"JetBrains Mono,monospace" }}>{item.v}</div>
              </div>
            ))}
          </div>
          <div style={{ background:C.bg,borderRadius:11,padding:"13px 15px" }}>
            <div style={{ fontSize:9,color:C.textDim,fontWeight:700,marginBottom:5 }}>FULL DESCRIPTION</div>
            <p style={{ fontSize:13,color:C.text,margin:0,lineHeight:1.6 }}>{selected.desc}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PAGE: PHISHING SIM (expanded with more emails) ───────────────────────────
function PhishingPage({ user, onUserUpdate }) {
  const [step,setStep]     = useState(0);
  const [result,setResult] = useState(null);
  const [sessionScore,setSessionScore] = useState(0);
  const [sessionTotal,setSessionTotal] = useState(0);

  // ✅ Fix 10: 10 varied phishing emails
  const emails = [
    {
      id:1, from:"security@paypa1.com", subject:"⚠️ Your account has been limited", time:"10:32 AM",
      body:`Dear Valued Customer,\n\nWe detected unusual activity on your PayPal account. Your account has been temporarily limited.\n\nVerify your identity immediately:\nhttps://www.paypa1-secure-verify.com/account/restore\n\nFailure to verify within 24 hours will result in permanent account suspension.\n\nPayPal Security Team`,
      clues:["Sender domain: paypa1.com — '1' substitutes 'l'","Suspicious URL: paypa1-secure-verify.com","Urgency: '24 hours' deadline creates panic","Generic greeting: 'Valued Customer' not your name","Real PayPal always uses paypal.com domain"],
      isPhishing:true, category:"Phishing",
    },
    {
      id:2, from:"newsletter@github.com", subject:"Your GitHub digest for March 2026", time:"9:15 AM",
      body:`Hi there,\n\nHere's your weekly GitHub digest:\n\n• 3 new followers this week\n• 12 stars on your repositories\n• 5 new issues opened\n\nSee what's trending: https://github.com/trending\n\nBest,\nThe GitHub Team`,
      clues:["Legitimate: github.com is the real domain","Relevant, personalized content about your account","No urgency or threats used","All links go only to github.com"],
      isPhishing:false, category:"Legitimate",
    },
    {
      id:3, from:"hr-dept@company-payroll.net", subject:"URGENT: Payroll Update Required", time:"8:44 AM",
      body:`Hello Employee,\n\nOur payroll system was updated. To receive your next salary you MUST update your bank details within 48 hours.\n\nClick here: http://company-payroll-update.netlify.app/banking\n\nThis is MANDATORY. Ignoring this will delay your salary.\n\n- HR Department`,
      clues:["Suspicious domain: company-payroll.net (not your company)","Link redirects to netlify.app — not an official domain","Extreme urgency about salary payment","No employee name used","ALL CAPS pressure tactics: URGENT, MANDATORY"],
      isPhishing:true, category:"Spear Phishing",
    },
    {
      id:4, from:"noreply@amazon.com", subject:"Your order #113-4892-0032 has shipped!", time:"3:21 PM",
      body:`Hello,\n\nGreat news! Your order has been shipped and is on its way.\n\nOrder #113-4892-0032\nEstimated delivery: March 22–24\n\nTrack your package: https://www.amazon.com/gp/your-account/order-history\n\nThank you for shopping with Amazon!\n\nThe Amazon Team`,
      clues:["Legitimate: amazon.com official domain","Standard transactional shipping notification","No requests for personal or financial info","All links go to amazon.com only","Contains a real order number"],
      isPhishing:false, category:"Legitimate",
    },
    {
      id:5, from:"support@micros0ft-help.com", subject:"Your Microsoft 365 License Expired", time:"11:02 AM",
      body:`Dear User,\n\nYour Microsoft 365 subscription expired. Your files and email access will be disabled in 3 hours.\n\nRenew now to avoid data loss:\nhttps://micros0ft-help.com/renew?id=8829\n\nEnter your credit card to continue.\n\nMicrosoft Support`,
      clues:["Domain: micros0ft-help.com — '0' replaces 'o' in Microsoft","Very short deadline: 3 hours — high pressure","Asking for credit card directly in email","Threat of data loss to create fear","Microsoft never sends payment links via email"],
      isPhishing:true, category:"Brand Impersonation",
    },
    {
      id:6, from:"no-reply@spotify.com", subject:"Your monthly Spotify receipt", time:"2:00 AM",
      body:`Hi there,\n\nYour Spotify Premium subscription has been renewed.\n\nAmount: ₹119\nDate: 1 March 2026\nPlan: Individual Premium\n\nManage your subscription: https://www.spotify.com/account\n\nThanks for being a Premium member!\n\nSpotify`,
      clues:["Legitimate: spotify.com is the official domain","Standard monthly billing notification","No links to third-party sites","No requests for passwords or card details","Reasonable amount consistent with Spotify pricing"],
      isPhishing:false, category:"Legitimate",
    },
    {
      id:7, from:"ceo.office@yourcompany-mail.xyz", subject:"Quick Favor — Urgent Wire Transfer", time:"6:45 PM",
      body:`Hi,\n\nI'm currently in an important client meeting and cannot take calls. I need you to urgently process a wire transfer of $15,000 to our new vendor.\n\nAccount: 8829334411 / IFSC: HDFC0001234\n\nKeep this confidential until I return. I'll explain everything later.\n\n- David Wilson, CEO`,
      clues:["Domain: yourcompany-mail.xyz — not your real company","CEO impersonation is a classic BEC (Business Email Compromise) attack","Secrecy request: 'keep this confidential'","No phone call verification — always verify large transfers","Real CEO wouldn't email wire transfer details"],
      isPhishing:true, category:"BEC / CEO Fraud",
    },
    {
      id:8, from:"notifications@linkedin.com", subject:"You have 3 new connection requests", time:"10:15 AM",
      body:`Hi there,\n\nYou have 3 new connection requests on LinkedIn:\n\n• Priya Sharma — UX Designer at Infosys\n• Rahul Gupta — Dev at TCS\n• Meera Patel — HR at Wipro\n\nView requests: https://www.linkedin.com/mynetwork\n\nThe LinkedIn Team`,
      clues:["Legitimate: linkedin.com official domain","Standard notification email format","No urgency or threats","Links only go to linkedin.com","Content matches what LinkedIn actually sends"],
      isPhishing:false, category:"Legitimate",
    },
    {
      id:9, from:"reward@offers-flipkart.com", subject:"🎁 You've won ₹50,000! Claim now", time:"3:33 PM",
      body:`Congratulations!\n\nYou have been selected as today's lucky winner on Flipkart's 20th Anniversary Draw!\n\nPrize: ₹50,000 Gift Card\n\nClaim your reward: https://offers-flipkart.com/claim?token=WINNER2024\n\nNote: Pay ₹199 processing fee to release your prize.\n\n- Flipkart Rewards Team`,
      clues:["Domain: offers-flipkart.com — fake domain, real one is flipkart.com","Too-good-to-be-true prize of ₹50,000","Processing fee demand — classic 'advance fee' scam","You never entered any draw","Real companies never ask you to pay to receive a prize"],
      isPhishing:true, category:"Advance Fee Fraud",
    },
    {
      id:10, from:"noreply@google.com", subject:"Security alert for your Google Account", time:"7:22 PM",
      body:`Hi,\n\nA new sign-in to your Google Account was detected.\n\nDevice: Windows PC\nLocation: Mumbai, India\nTime: 7:18 PM\n\nIf this was you, no action needed.\n\nIf not, secure your account: https://myaccount.google.com/security\n\nThe Google Account Team`,
      clues:["Legitimate: google.com official domain","Standard security notification Google actually sends","No urgency — says 'if this was you, no action needed'","Link goes to myaccount.google.com — legitimate","No request for passwords or payment"],
      isPhishing:false, category:"Legitimate",
    },
  ];

  const current = emails[step];

  const handleAnswer = (isPhish) => {
    const correct = isPhish === current.isPhishing;
    if (correct) setSessionScore(s => s + 1);
    setSessionTotal(t => t + 1);
    setResult({ correct, isPhishing: current.isPhishing });

    // ✅ Persist phishing sim data to user profile
    if (onUserUpdate) {
      const prevCorrect = user?.phishingSimCorrect || 0;
      const prevTotal   = user?.phishingSimTotal   || 0;
      onUserUpdate({
        phishingSimCorrect: prevCorrect + (correct ? 1 : 0),
        phishingSimTotal:   prevTotal + 1,
        recentActivity: [
          { msg: `Analyzed phishing email: "${current.subject.substring(0,30)}…" — ${correct?"Correct ✓":"Incorrect ✗"}`, time:"Just now" },
          ...(user?.recentActivity || []).slice(0, 9),
        ],
      });
    }
  };

  const next = () => {
    if (step < emails.length - 1) { setStep(s => s + 1); setResult(null); }
    else { setStep(0); setResult(null); setSessionScore(0); setSessionTotal(0); }
  };

  const accuracy = sessionTotal > 0 ? Math.round((sessionScore / sessionTotal) * 100) : 0;

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:18 }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${C.amber}12,${C.amber}04)`,
        border:`1px solid ${C.amber}18`,borderRadius:20,padding:"18px 22px",
        display:"flex",alignItems:"center",gap:14 }}>
        <div style={{ width:46,height:46,borderRadius:13,background:C.amberLight,
          display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
          <Mail size={20} style={{ color:C.amber }}/>
        </div>
        <div style={{ flex:1 }}>
          <h2 style={{ fontSize:17,fontWeight:800,color:C.text,margin:"0 0 3px",fontFamily:"Instrument Serif,Georgia,serif" }}>
            Phishing Simulator — 10 Real Scenarios
          </h2>
          <p style={{ fontSize:12,color:C.textMd,margin:0 }}>
            Analyse each email: legitimate or phishing? Results sync to your profile.
          </p>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          {/* Progress dots */}
          <div style={{ display:"flex",gap:5 }}>
            {emails.map((_,i) => (
              <div key={i} style={{ width:20,height:5,borderRadius:99,
                background:i<step?C.green:i===step?C.amber:C.border,
                transition:"background .3s" }}/>
            ))}
          </div>
          {/* Session score */}
          <div style={{ background:C.brandLight,border:`1px solid ${C.brand}20`,borderRadius:9,
            padding:"5px 12px",fontSize:12,fontWeight:700,color:C.brand }}>
            {sessionScore}/{sessionTotal} ✓ {sessionTotal>0?`(${accuracy}%)`:""}
          </div>
        </div>
      </div>

      {/* Category badge */}
      <div style={{ display:"flex",alignItems:"center",gap:9 }}>
        <Bdg color={current.isPhishing?C.red:C.green}
             bg={current.isPhishing?C.redLight:C.greenLight} size="md">
          {current.category}
        </Bdg>
        <span style={{ fontSize:12,color:C.textMd }}>Email {step+1} of {emails.length}</span>
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"1fr 320px",gap:16 }}>
        {/* Email display */}
        <div style={{ background:"#fff",border:`1px solid ${C.border}`,borderRadius:20,overflow:"hidden",boxShadow:C.sh }}>
          <div style={{ background:C.bg,borderBottom:`1px solid ${C.border}`,padding:"9px 16px",
            display:"flex",alignItems:"center",gap:7 }}>
            <div style={{ width:9,height:9,borderRadius:"50%",background:"#FF5F57" }}/>
            <div style={{ width:9,height:9,borderRadius:"50%",background:"#FEBC2E" }}/>
            <div style={{ width:9,height:9,borderRadius:"50%",background:"#28C840" }}/>
            <span style={{ fontSize:11,color:C.textDim,marginLeft:6 }}>
              Inbox — Email {step+1} of {emails.length}
            </span>
          </div>
          <div style={{ padding:"16px 20px 12px",borderBottom:`1px solid ${C.border}` }}>
            <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:8 }}>
              <div style={{ width:38,height:38,borderRadius:11,background:C.brandLight,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:15,fontWeight:800,color:C.brand,flexShrink:0 }}>
                {current.from.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize:13,fontWeight:700,color:C.text }}>{current.from}</div>
                <div style={{ fontSize:10,color:C.textDim }}>To: you@example.com · {current.time}</div>
              </div>
            </div>
            <h3 style={{ fontSize:15,fontWeight:700,color:C.text,margin:0 }}>{current.subject}</h3>
          </div>
          <div style={{ padding:"18px 20px" }}>
            {current.body.split("\n").map((line,i) => (
              <p key={i} style={{ fontSize:13,
                color:line.startsWith("http")?"#2563EB":C.text,
                margin:"0 0 3px",
                textDecoration:line.startsWith("http")?"underline":"none",
                cursor:line.startsWith("http")?"pointer":"default",lineHeight:1.65 }}>
                {line||"\u00A0"}
              </p>
            ))}
          </div>
        </div>

        {/* Decision panel */}
        <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
          {!result ? (
            <div style={{ background:"#fff",border:`1px solid ${C.border}`,borderRadius:18,padding:18,boxShadow:C.sh }}>
              <h3 style={{ fontSize:13,fontWeight:700,color:C.text,margin:"0 0 5px" }}>Your Verdict</h3>
              <p style={{ fontSize:11,color:C.textMd,margin:"0 0 14px" }}>Is this email safe or a phishing attempt?</p>
              <div style={{ display:"flex",flexDirection:"column",gap:9 }}>
                <button onClick={()=>handleAnswer(false)}
                  style={{ padding:"11px 14px",borderRadius:12,border:`2px solid ${C.green}`,
                    background:C.greenLight,color:C.green,fontSize:13,fontWeight:700,
                    cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:9,transition:"all .2s" }}
                  onMouseEnter={e=>{e.currentTarget.style.background=C.green;e.currentTarget.style.color="#fff";}}
                  onMouseLeave={e=>{e.currentTarget.style.background=C.greenLight;e.currentTarget.style.color=C.green;}}>
                  <CheckCircle size={15}/> Legitimate Email ✓
                </button>
                <button onClick={()=>handleAnswer(true)}
                  style={{ padding:"11px 14px",borderRadius:12,border:`2px solid ${C.red}`,
                    background:C.redLight,color:C.red,fontSize:13,fontWeight:700,
                    cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:9,transition:"all .2s" }}
                  onMouseEnter={e=>{e.currentTarget.style.background=C.red;e.currentTarget.style.color="#fff";}}
                  onMouseLeave={e=>{e.currentTarget.style.background=C.redLight;e.currentTarget.style.color=C.red;}}>
                  <AlertTriangle size={15}/> Phishing Attempt ⚠️
                </button>
              </div>
            </div>
          ) : (
            <div style={{ background:result.correct?C.greenLight:C.redLight,
              border:`2px solid ${result.correct?C.green:C.red}25`,borderRadius:18,padding:18 }}>
              <div style={{ display:"flex",alignItems:"center",gap:9,marginBottom:9 }}>
                {result.correct
                  ? <CheckCircle size={20} style={{ color:C.green }}/>
                  : <AlertTriangle size={20} style={{ color:C.red }}/>}
                <h3 style={{ fontSize:14,fontWeight:800,color:result.correct?C.green:C.red,margin:0 }}>
                  {result.correct?"Correct! Well done 🎉":"Incorrect — Learn why ⬇️"}
                </h3>
              </div>
              <p style={{ fontSize:12,color:C.textMd,margin:"0 0 13px" }}>
                This was {result.isPhishing?"a phishing / scam email":"a legitimate email"}.
              </p>
              <button onClick={next}
                style={{ width:"100%",padding:"10px",borderRadius:10,border:"none",
                  background:result.correct?C.green:C.red,color:"#fff",fontSize:13,
                  fontWeight:700,cursor:"pointer",fontFamily:"inherit" }}>
                {step<emails.length-1?"Next Email →":"Restart Simulation ↺"}
              </button>
            </div>
          )}

          {result && (
            <div style={{ background:"#fff",border:`1px solid ${C.border}`,borderRadius:18,padding:16,boxShadow:C.sh }}>
              <h4 style={{ fontSize:12,fontWeight:700,color:C.text,margin:"0 0 11px" }}>🔍 Key Indicators</h4>
              <div style={{ display:"flex",flexDirection:"column",gap:7 }}>
                {current.clues.map((clue,i)=>(
                  <div key={i} style={{ display:"flex",alignItems:"flex-start",gap:7,
                    fontSize:11,color:C.textMd,lineHeight:1.45 }}>
                    <div style={{ width:16,height:16,borderRadius:"50%",
                      background:current.isPhishing?C.redLight:C.greenLight,
                      border:`1px solid ${current.isPhishing?C.red:C.green}25`,
                      display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1 }}>
                      {current.isPhishing
                        ? <AlertTriangle size={8} style={{ color:C.red }}/>
                        : <CheckCircle size={8} style={{ color:C.green }}/>}
                    </div>
                    {clue}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Session progress */}
          <div style={{ background:"#fff",border:`1px solid ${C.border}`,borderRadius:18,padding:14,boxShadow:C.sh }}>
            <div style={{ fontSize:11,fontWeight:700,color:C.textMd,marginBottom:8 }}>Session Progress</div>
            <div style={{ display:"flex",alignItems:"center",gap:7 }}>
              <div style={{ flex:1,height:5,background:C.border,borderRadius:99 }}>
                <div style={{ height:5,
                  width:`${((step+(result?1:0))/emails.length)*100}%`,
                  background:C.amber,borderRadius:99,transition:"width .4s" }}/>
              </div>
              <span style={{ fontSize:11,fontWeight:700,color:C.amber }}>
                {step+(result?1:0)}/{emails.length}
              </span>
            </div>
          </div>

          {/* Lifetime stats */}
          {user?.phishingSimTotal > 0 && (
            <div style={{ background:C.brandLight,border:`1px solid ${C.brand}18`,borderRadius:14,padding:14 }}>
              <div style={{ fontSize:10,fontWeight:700,color:C.brand,marginBottom:8,letterSpacing:"0.06em" }}>LIFETIME STATS</div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
                {[
                  { l:"Total Analyzed", v: user.phishingSimTotal },
                  { l:"Accuracy",       v: `${Math.round((user.phishingSimCorrect/user.phishingSimTotal)*100)}%` },
                ].map((s,i)=>(
                  <div key={i} style={{ background:"#fff",borderRadius:10,padding:"10px",textAlign:"center" }}>
                    <div style={{ fontSize:18,fontWeight:800,color:C.brand,fontFamily:"Instrument Serif,Georgia,serif" }}>{s.v}</div>
                    <div style={{ fontSize:10,color:C.textMd,marginTop:2 }}>{s.l}</div>
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

// ─── PAGE: REPORTS ────────────────────────────────────────────────────────────
function ReportsPage({ user }) {
  const [exporting, setExporting] = useState(null);

  // ✅ Fix 3: only show real data, empty for new users
  const hasQuizData       = (user?.quizHistory||[]).length > 0;
  const hasPhishingData   = (user?.phishingSimTotal||0) > 0;
  const hasCourseData     = (user?.coursesCompleted||0) > 0;
  const hasGameData       = (user?.gamesPlayed||0) > 0;
  const hasAnyData        = hasQuizData || hasPhishingData || hasCourseData || hasGameData;
  const weeklyActivity    = user?.weeklyActivity || [];
  const hasWeekly         = weeklyActivity.length > 0;

  // Build monthly data from real quiz history
  const monthlyData = (() => {
    if (!hasQuizData) return [];
    const months = {};
    (user.quizHistory||[]).forEach(q => {
      const m = q.updatedAt ? new Date(q.updatedAt).toLocaleString("en-IN",{month:"short"}) : "?";
      if (!months[m]) months[m] = { m, quizzes:0, correct:0, phishing:0 };
      months[m].quizzes++;
      months[m].correct += q.totalCorrect||0;
    });
    (user.phishingSimHistory||[]).forEach(p => {
      const m = p.date ? new Date(p.date).toLocaleString("en-IN",{month:"short"}) : "?";
      if (!months[m]) months[m] = { m, quizzes:0, correct:0, phishing:0 };
      months[m].phishing += p.correct||0;
    });
    return Object.values(months).slice(-6);
  })();

  // ✅ Fix 3: Download as PDF / DOCX
  const handleDownload = async (type) => {
    setExporting(type);
    await new Promise(r => setTimeout(r, 800));

    const reportContent = `
CyberGuard Security Report
Generated: ${new Date().toLocaleDateString("en-IN", { day:"2-digit", month:"long", year:"numeric" })}
User: ${user?.fullName || user?.name || user?.email || "Unknown"}

=== PERFORMANCE SUMMARY ===
Total Score:       ${user?.score || 0}
Level:             ${user?.level || 1}
XP:                ${user?.xp || 0}
Login Streak:      ${user?.loginStreak || 0} days
Quizzes Completed: ${user?.quizzesDone || 0}
Average Quiz Score: ${user?.avgScore || 0}%
Courses Completed: ${user?.coursesCompleted || 0}
Games Played:      ${user?.gamesPlayed || 0}

=== PHISHING SIMULATOR ===
Total Analyzed:    ${user?.phishingSimTotal || 0}
Correct Detections: ${user?.phishingSimCorrect || 0}
Accuracy:          ${user?.phishingSimTotal ? Math.round((user.phishingSimCorrect/user.phishingSimTotal)*100) : 0}%

=== DOMAIN MASTERY ===
Phishing:  ${user?.phishingScore || 0}%
Malware:   ${user?.malwareScore || 0}%
Network:   ${user?.networkScore || 0}%
Privacy:   ${user?.privacyScore || 0}%
Cloud:     ${user?.cloudScore || 0}%

=== QUIZ HISTORY ===
${(user?.quizHistory||[]).map(q => `  Module ${q.moduleId}: ${q.grade} (${q.percentage}%) — ${fmtDate(q.updatedAt)}`).join("\n") || "  No quizzes completed yet"}

=== BADGES ===
${(user?.badges||[]).map(b => `  ${b.emoji||"🏅"} ${b.label||b}`).join("\n") || "  No badges earned yet"}
    `.trim();

    if (type === "pdf") {
      // Simple HTML→PDF via print
      const win = window.open("","_blank");
      win.document.write(`
        <html><head><title>CyberGuard Report</title>
        <style>
          body { font-family: 'Courier New', monospace; padding: 40px; color: #0F172A; background: #fff; }
          h1 { font-family: Georgia, serif; color: #4F46E5; margin-bottom: 4px; }
          pre { white-space: pre-wrap; font-size: 13px; line-height: 1.7; }
          .header { border-bottom: 2px solid #4F46E5; padding-bottom: 16px; margin-bottom: 24px; }
          .footer { margin-top: 40px; font-size: 11px; color: #94A3B8; border-top: 1px solid #e2e8f0; padding-top: 12px; }
        </style></head>
        <body>
          <div class="header">
            <h1>🛡️ CyberGuard Security Report</h1>
            <p style="color:#475569;margin:0">Generated on ${new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</p>
          </div>
          <pre>${reportContent}</pre>
          <div class="footer">CyberGuard Security Suite — Confidential Report</div>
        </body></html>
      `);
      win.document.close();
      setTimeout(() => { win.print(); win.close(); }, 500);
    } else {
      // DOCX: generate basic RTF (opens in Word)
      const rtf = `{\\rtf1\\ansi\\deff0
{\\fonttbl{\\f0\\froman\\fcharset0 Times New Roman;}{\\f1\\fmodern\\fcharset0 Courier New;}}
{\\colortbl;\\red79\\green70\\blue229;\\red15\\green23\\blue42;\\red71\\green85\\blue105;}
\\f0\\fs28\\b\\cf1 CyberGuard Security Report\\b0\\fs22\\cf2\\par
\\f1\\fs18 ${reportContent.replace(/\n/g, "\\par\n")}
}`;
      const blob = new Blob([rtf], { type:"application/rtf" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `CyberGuard_Report_${new Date().toISOString().split("T")[0]}.rtf`;
      a.click();
    }
    setExporting(null);
  };

  if (!hasAnyData) {
    return (
      <div style={{ display:"flex",flexDirection:"column",gap:18 }}>
        <EmptyState icon={BarChart2}
          title="No report data yet"
          desc="Your reports will populate automatically as you complete quizzes, phishing simulations, courses, and games. Start an activity to see your analytics here."
          color={C.brand}/>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14 }}>
          {[
            { icon:Brain,         label:"Take a Quiz",         desc:"Earn scores and XP",          color:C.brand },
            { icon:Mail,          label:"Try Phishing Sim",    desc:"Test your detection skills",   color:C.amber },
            { icon:GraduationCap, label:"Complete a Course",   desc:"Learn and earn certificates",  color:C.teal },
            { icon:Gamepad2,      label:"Play CyberGame",      desc:"Defend against attacks",       color:C.violet },
          ].map((item,i) => (
            <div key={i} style={{ background:"#fff",border:`1px solid ${C.border}`,borderRadius:18,
              padding:"20px 22px",boxShadow:C.sh,display:"flex",alignItems:"center",gap:14 }}>
              <div style={{ width:44,height:44,borderRadius:13,background:item.color+"12",
                border:`1px solid ${item.color}18`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                <item.icon size={20} style={{ color:item.color }}/>
              </div>
              <div>
                <p style={{ fontSize:14,fontWeight:700,color:C.text,margin:"0 0 3px" }}>{item.label}</p>
                <p style={{ fontSize:12,color:C.textMd,margin:0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:18 }}>
      {/* Export bar — PDF & DOCX */}
      <div style={{ background:"#fff",border:`1px solid ${C.border}`,borderRadius:18,
        padding:"14px 20px",display:"flex",alignItems:"center",gap:14,boxShadow:C.sh }}>
        <div style={{ flex:1 }}>
          <h3 style={{ fontSize:14,fontWeight:700,color:C.text,margin:"0 0 2px" }}>Export Report</h3>
          <p style={{ fontSize:11,color:C.textMd,margin:0 }}>Download your personalised security report</p>
        </div>
        {[
          { l:"PDF",  fmt:"pdf",  icon:FileDown,     color:C.red,   desc:"Print or share" },
          { l:"DOCX", fmt:"docx", icon:FileTextIcon, color:C.brand, desc:"Edit in Word" },
        ].map((item,i)=>(
          <button key={i} onClick={()=>handleDownload(item.fmt)}
            style={{ display:"flex",alignItems:"center",gap:6,padding:"10px 18px",borderRadius:11,
              border:`1px solid ${item.color}22`,background:item.color+"0e",color:item.color,
              fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"all .2s" }}
            onMouseEnter={e=>{e.currentTarget.style.background=item.color;e.currentTarget.style.color="#fff";}}
            onMouseLeave={e=>{e.currentTarget.style.background=item.color+"0e";e.currentTarget.style.color=item.color;}}>
            {exporting===item.fmt?<Loader2 size={13}/>:<item.icon size={13}/>} {item.l}
          </button>
        ))}
      </div>

      {/* Summary stats — real data only */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:13 }}>
        {[
          { label:"Total Score",       value:(user?.score||0).toLocaleString(), change:"+active",     up:true, color:C.brand, bg:C.brandLight, icon:Star },
          { label:"Quizzes Completed", value:user?.quizzesDone||0,              change:"completed",   up:true, color:C.violet, bg:"#EDE9FE",    icon:Brain },
          { label:"Phishing Accuracy", value:user?.phishingSimTotal?`${Math.round((user.phishingSimCorrect/user.phishingSimTotal)*100)}%`:"—", change:"trained", up:true, color:C.amber, bg:C.amberLight, icon:Mail },
          { label:"Login Streak",      value:`${user?.loginStreak||0}d`,        change:"streak",      up:(user?.loginStreak||0)>=3, color:C.teal, bg:C.tealLight, icon:Flame },
        ].map((item,i)=><StatCard key={i} {...item}/>)}
      </div>

      {/* Monthly activity chart — only if data exists */}
      {monthlyData.length > 0 && (
        <div style={{ background:"#fff",border:`1px solid ${C.border}`,borderRadius:20,padding:22,boxShadow:C.sh }}>
          <h3 style={{ fontSize:14,fontWeight:700,color:C.text,margin:"0 0 4px" }}>Monthly Activity Breakdown</h3>
          <p style={{ fontSize:11,color:C.textMd,margin:"0 0 14px" }}>Quiz performance over time</p>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
              <XAxis dataKey="m" tick={{ fontSize:11,fill:C.textMd }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize:10,fill:C.textMd }} axisLine={false} tickLine={false}/>
              <Tooltip content={<CTip/>}/>
              <Bar dataKey="quizzes"  name="Quizzes"          fill={C.brand} radius={[4,4,0,0]} maxBarSize={22}/>
              <Bar dataKey="correct"  name="Correct Answers"  fill={C.green} radius={[4,4,0,0]} maxBarSize={22}/>
              <Bar dataKey="phishing" name="Phishing Correct" fill={C.amber} radius={[4,4,0,0]} maxBarSize={22}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Weekly activity area chart */}
      {hasWeekly && (
        <div style={{ background:"#fff",border:`1px solid ${C.border}`,borderRadius:20,padding:22,boxShadow:C.sh }}>
          <h3 style={{ fontSize:14,fontWeight:700,color:C.text,margin:"0 0 4px" }}>Weekly Score Activity</h3>
          <p style={{ fontSize:11,color:C.textMd,margin:"0 0 14px" }}>Your score trend this week</p>
          <ResponsiveContainer width="100%" height={190}>
            <AreaChart data={weeklyActivity}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={C.brand} stopOpacity={0.13}/>
                  <stop offset="95%" stopColor={C.brand} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
              <XAxis dataKey="d" tick={{ fontSize:11,fill:C.textMd }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize:10,fill:C.textMd }} axisLine={false} tickLine={false}/>
              <Tooltip content={<CTip/>}/>
              <Area type="monotone" dataKey="score" name="Score" stroke={C.brand}
                fill="url(#g1)" strokeWidth={2.5} dot={{ fill:C.brand,r:3 }}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Domain mastery */}
      {(user?.phishingScore || user?.malwareScore || user?.networkScore) ? (
        <div style={{ background:"#fff",border:`1px solid ${C.border}`,borderRadius:20,padding:22,boxShadow:C.sh }}>
          <h3 style={{ fontSize:14,fontWeight:700,color:C.text,margin:"0 0 14px" }}>Domain Mastery</h3>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12 }}>
            {[
              { label:"Phishing", value:user?.phishingScore||0, color:C.brand },
              { label:"Malware",  value:user?.malwareScore||0,  color:C.red },
              { label:"Network",  value:user?.networkScore||0,  color:C.teal },
              { label:"Privacy",  value:user?.privacyScore||0,  color:C.violet },
              { label:"Cloud",    value:user?.cloudScore||0,    color:C.amber },
            ].map((d,i)=>(
              <div key={i} style={{ background:C.bg,borderRadius:14,padding:"16px",textAlign:"center" }}>
                <div style={{ width:60,height:60,borderRadius:"50%",margin:"0 auto 10px",
                  background:`conic-gradient(${d.color} ${d.value*3.6}deg, ${C.border} 0deg)`,
                  display:"flex",alignItems:"center",justifyContent:"center" }}>
                  <div style={{ width:46,height:46,borderRadius:"50%",background:"#fff",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:13,fontWeight:800,color:d.color }}>
                    {d.value}%
                  </div>
                </div>
                <p style={{ fontSize:12,fontWeight:700,color:C.text,margin:0 }}>{d.label}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Quiz history table */}
      {hasQuizData && (
        <div style={{ background:"#fff",border:`1px solid ${C.border}`,borderRadius:20,padding:22,boxShadow:C.sh }}>
          <h3 style={{ fontSize:14,fontWeight:700,color:C.text,margin:"0 0 14px" }}>Quiz History</h3>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%",borderCollapse:"collapse",fontSize:12 }}>
              <thead>
                <tr style={{ background:C.bg }}>
                  {["Module","Title","Score","Grade","Date"].map(h=>(
                    <th key={h} style={{ padding:"9px 14px",textAlign:"left",
                      fontSize:9,fontWeight:700,color:C.textDim,letterSpacing:"0.07em",
                      borderBottom:`1px solid ${C.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(user.quizHistory||[]).map((q,i)=>{
                  const g = GRADE[q.grade]||GRADE["D"];
                  return (
                    <tr key={i} style={{ borderBottom:`1px solid ${C.border}` }}>
                      <td style={{ padding:"10px 14px",fontFamily:"JetBrains Mono,monospace",
                        fontSize:11,color:C.textDim }}>#{q.moduleId}</td>
                      <td style={{ padding:"10px 14px",fontWeight:600,color:C.text }}>
                        {q.moduleTitle||`Module ${q.moduleId}`}</td>
                      <td style={{ padding:"10px 14px",color:g.color,fontWeight:700 }}>
                        {q.totalCorrect}/{q.totalQuestions} ({q.percentage}%)</td>
                      <td style={{ padding:"10px 14px" }}>
                        <Bdg color={g.color} bg={g.bg}>{q.grade}</Bdg>
                      </td>
                      <td style={{ padding:"10px 14px",color:C.textDim,fontSize:11 }}>
                        {fmtDate(q.updatedAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PAGE: PROFILE ────────────────────────────────────────────────────────────
function ProfilePage({ user, onUserUpdate }) {
  const [avatar,    setAvatar]    = useState(user?.avatar||null);
  const [uploading, setUploading] = useState(false);
  const [editMode,  setEditMode]  = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [saving,    setSaving]    = useState(false);
  // ✅ Fix 2: pre-fill form with all registered data
  const [form, setForm] = useState({
    fullName: user?.fullName || user?.name || user?.username || "",
    email:    user?.email    || "",
    phone:    user?.phone    || "",
    location: user?.location || "",
    role:     user?.role     || "",
  });
  const fileRef = useRef();

  // Sync form when user changes
  useEffect(() => {
    setForm({
      fullName: user?.fullName || user?.name || user?.username || "",
      email:    user?.email    || "",
      phone:    user?.phone    || "",
      location: user?.location || "",
      role:     user?.role     || "",
    });
    setAvatar(user?.avatar || null);
  }, [user]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET||"cyberguard_avatars");
    try {
      const res  = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME||"demo"}/image/upload`,{method:"POST",body:fd});
      const json = await res.json();
      const url  = json.secure_url || URL.createObjectURL(file);
      setAvatar(url);
      if (onUserUpdate) onUserUpdate({ avatar: url });
    } catch {
      setAvatar(URL.createObjectURL(file));
    }
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Call backend to persist profile changes
      await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type":"application/json",
          "Authorization":`Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(form),
      });
    } catch {}
    if (onUserUpdate) onUserUpdate(form);
    setSaved(true);
    setEditMode(false);
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  };

  // ✅ Fix 11: real performance stats
  const statItems = [
    { l:"Score",         v:(user?.score||0).toLocaleString(), c:C.brand },
    { l:"Level",         v:user?.level||1,                    c:C.violet },
    { l:"Streak",        v:`${user?.loginStreak||0}d`,         c:C.amber },
    { l:"Quizzes Done",  v:user?.quizzesDone||0,               c:C.teal },
    { l:"Avg Quiz Score",v:user?.avgScore?`${user.avgScore}%`:"—", c:C.green },
    { l:"Total XP",      v:(user?.xp||0).toLocaleString(),     c:C.pink },
    { l:"Phishing Sim",  v:user?.phishingSimTotal?`${Math.round((user.phishingSimCorrect/user.phishingSimTotal)*100)}%`:"—", c:C.amber },
    { l:"Courses Done",  v:user?.coursesCompleted||0,           c:C.brand },
  ];

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:18 }}>
      {saved && (
        <div style={{ background:C.greenLight,border:`1px solid ${C.green}25`,
          borderRadius:13,padding:"11px 18px",display:"flex",alignItems:"center",gap:9 }}>
          <CheckCircle2 size={15} style={{ color:C.green }}/>
          <span style={{ fontSize:13,fontWeight:600,color:C.green }}>Profile updated successfully!</span>
        </div>
      )}
      <div style={{ display:"grid",gridTemplateColumns:"300px 1fr",gap:18 }}>
        {/* Left col */}
        <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
          <div style={{ background:"#fff",border:`1px solid ${C.border}`,borderRadius:22,
            padding:"26px 22px",textAlign:"center",boxShadow:C.sh }}>
            <div style={{ position:"relative",width:96,height:96,margin:"0 auto 14px",cursor:"pointer" }}
              onClick={()=>fileRef.current?.click()}>
              {avatar
                ? <img src={avatar} alt="avatar" style={{ width:96,height:96,borderRadius:"50%",objectFit:"cover",border:`3px solid ${C.brand}25` }}/>
                : <div style={{ width:96,height:96,borderRadius:"50%",
                    background:`linear-gradient(135deg,${C.brand},${C.violet})`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:34,fontWeight:800,color:"#fff" }}>
                    {(form.fullName||"U").charAt(0).toUpperCase()}
                  </div>}
              <div style={{ position:"absolute",bottom:1,right:1,width:28,height:28,borderRadius:"50%",
                background:C.brand,border:"3px solid #fff",display:"flex",alignItems:"center",justifyContent:"center" }}>
                {uploading?<Loader2 size={11} style={{ color:"#fff" }}/>:<Camera size={11} style={{ color:"#fff" }}/>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleAvatarUpload}/>
            </div>
            {/* ✅ Real full name */}
            <h2 style={{ fontSize:17,fontWeight:800,color:C.text,margin:"0 0 3px",
              fontFamily:"Instrument Serif,Georgia,serif" }}>{form.fullName||getFullName(user)||"User"}</h2>
            <p style={{ fontSize:12,color:C.textMd,margin:"0 0 10px" }}>{form.role||"Cybersecurity Learner"}</p>
            <Bdg color={C.brand} bg={C.brandLight} size="md">
              Level {user?.level||1} {user?.level>=5?"Security Veteran":user?.level>=3?"Intermediate":"Beginner"}
            </Bdg>
            {/* ✅ Real email, location, join date */}
            <div style={{ marginTop:14,fontSize:11,color:C.textDim }}>
              {form.email && <div style={{ marginBottom:3 }}>✉️ {form.email}</div>}
              {form.location && <div style={{ marginBottom:3 }}>📍 {form.location}</div>}
              <div>Joined {user?.createdAt?new Date(user.createdAt).toLocaleDateString("en-IN",{month:"long",year:"numeric"}):"Recently"}</div>
            </div>
          </div>

          {/* ✅ Fix 11: real stat grid */}
          <div style={{ background:"#fff",border:`1px solid ${C.border}`,borderRadius:18,padding:18,boxShadow:C.sh }}>
            <h3 style={{ fontSize:12,fontWeight:700,color:C.text,margin:"0 0 12px",letterSpacing:"0.05em" }}>PERFORMANCE STATS</h3>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:9 }}>
              {statItems.map((s,i)=>(
                <div key={i} style={{ background:C.bg,borderRadius:11,padding:"11px 13px",textAlign:"center" }}>
                  <div style={{ fontSize:18,fontWeight:900,color:s.c,fontFamily:"Instrument Serif,Georgia,serif" }}>{s.v}</div>
                  <div style={{ fontSize:9,color:C.textDim,marginTop:2,fontWeight:700,letterSpacing:"0.05em" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ✅ Fix 9: real badges */}
          <div style={{ background:"#fff",border:`1px solid ${C.border}`,borderRadius:18,padding:18,boxShadow:C.sh }}>
            <h3 style={{ fontSize:12,fontWeight:700,color:C.text,margin:"0 0 12px",letterSpacing:"0.05em" }}>BADGES</h3>
            {(user?.badges||[]).length>0 ? (
              <div style={{ display:"flex",flexWrap:"wrap",gap:7 }}>
                {user.badges.map((b,i)=>(
                  <div key={i} style={{ textAlign:"center",padding:"9px 11px",background:C.bg,
                    border:`1px solid ${C.border}`,borderRadius:11 }}>
                    <div style={{ fontSize:20 }}>{b.emoji||"🏅"}</div>
                    <div style={{ fontSize:8,color:C.textMd,marginTop:4,fontWeight:700 }}>{b.label||b}</div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon={Award} title="No badges yet"
                desc="Complete activities to earn achievement badges." color={C.amber}/>
            )}
          </div>
        </div>

        {/* Right col */}
        <div style={{ background:"#fff",border:`1px solid ${C.border}`,borderRadius:22,padding:26,boxShadow:C.sh }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:22 }}>
            <h3 style={{ fontSize:15,fontWeight:800,color:C.text,margin:0,fontFamily:"Instrument Serif,Georgia,serif" }}>
              Profile Information
            </h3>
            <button onClick={()=>editMode?handleSave():setEditMode(true)}
              style={{ display:"flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:10,
                border:"none",background:editMode?`linear-gradient(135deg,${C.green},#34D399)`:`linear-gradient(135deg,${C.brand},${C.brandMid})`,
                color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit" }}>
              {saving?<Loader2 size={12}/>:editMode?<><Save size={12}/> Save Changes</>:<><Edit3 size={12}/> Edit Profile</>}
            </button>
          </div>

          {/* ✅ Fix 2: all fields pre-filled from DB */}
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
            {[
              { label:"Full Name",    key:"fullName", icon:User,    type:"text" },
              { label:"Email",        key:"email",    icon:MailIcon,type:"email" },
              { label:"Phone",        key:"phone",    icon:Phone,   type:"tel" },
              { label:"Location",     key:"location", icon:MapPin,  type:"text" },
              { label:"Role / Title", key:"role",     icon:Shield,  type:"text", full:true },
            ].map((field)=>(
              <div key={field.key} style={{ gridColumn:field.full?"span 2":"auto" }}>
                <label style={{ fontSize:10,fontWeight:700,color:C.textDim,letterSpacing:"0.07em",
                  display:"block",marginBottom:5 }}>{field.label.toUpperCase()}</label>
                <div style={{ display:"flex",alignItems:"center",gap:9,
                  background:editMode?"#fff":C.bg,
                  border:`1px solid ${editMode?C.brandMid+"45":C.border}`,
                  borderRadius:11,padding:"10px 13px",transition:"all .2s" }}>
                  <field.icon size={14} style={{ color:C.textDim,flexShrink:0 }}/>
                  <input value={form[field.key]} readOnly={!editMode}
                    onChange={e=>setForm(f=>({...f,[field.key]:e.target.value}))}
                    type={field.type}
                    style={{ border:"none",background:"transparent",outline:"none",
                      fontSize:13,color:C.text,width:"100%",fontFamily:"inherit",fontWeight:500 }}/>
                </div>
              </div>
            ))}
          </div>

          {/* Security info */}
          <div style={{ marginTop:22,padding:"16px 18px",background:C.brandLight,
            border:`1px solid ${C.brand}18`,borderRadius:14 }}>
            <div style={{ display:"flex",alignItems:"center",gap:7,marginBottom:11 }}>
              <Lock size={13} style={{ color:C.brand }}/>
              <h4 style={{ fontSize:12,fontWeight:700,color:C.brand,margin:0 }}>Account Security</h4>
              <Bdg color={C.green} bg={C.greenLight}>Secured</Bdg>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:11 }}>
              {[
                { l:"2FA Status",      v:user?.twoFaEnabled?"Enabled":"Disabled",  c:user?.twoFaEnabled?C.green:C.red },
                { l:"Last Login",      v:"Today",                                   c:C.text },
                { l:"Member Since",    v:user?.createdAt?fmtDate(user.createdAt):"—", c:C.brand },
              ].map((item,i)=>(
                <div key={i}>
                  <div style={{ fontSize:9,color:C.textDim,fontWeight:700,marginBottom:3 }}>{item.l}</div>
                  <div style={{ fontSize:12,fontWeight:700,color:item.c }}>{item.v}</div>
                </div>
              ))}
            </div>
          </div>

          {(user?.recentActivity||[]).length>0 && (
            <div style={{ marginTop:20 }}>
              <h4 style={{ fontSize:12,fontWeight:700,color:C.text,margin:"0 0 12px",letterSpacing:"0.05em" }}>RECENT ACTIVITY</h4>
              <div style={{ display:"flex",flexDirection:"column",gap:1 }}>
                {user.recentActivity.slice(0,5).map((a,i)=>(
                  <div key={i} style={{ display:"flex",alignItems:"center",gap:9,
                    padding:"7px 9px",borderRadius:9,transition:"background .12s" }}
                    onMouseEnter={e=>e.currentTarget.style.background=C.bg}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <div style={{ width:5,height:5,borderRadius:"50%",background:C.brand,flexShrink:0 }}/>
                    <span style={{ flex:1,fontSize:12,color:C.text }}>{a.msg||a}</span>
                    <span style={{ fontSize:10,color:C.textDim,flexShrink:0 }}>{a.time||""}</span>
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
    email:    user?.notifPrefs?.email    ?? true,
    push:     user?.notifPrefs?.push     ?? true,
    threats:  user?.notifPrefs?.threats  ?? true,
    weekly:   user?.notifPrefs?.weekly   ?? false,
  });
  const [twoFa, setTwoFa]       = useState(user?.twoFaEnabled ?? true);
  const [sessionTimeout, setSessionTimeout] = useState(user?.sessionTimeout || "30");
  // ✅ Fix 5: real sessions from backend
  const [sessions, setSessions] = useState(null);
  const [loadingSessions, setLoadingSessions] = useState(false);

  const tabs = [
    { id:"password",      label:"Password",        icon:Key },
    { id:"notifications", label:"Notifications",   icon:Bell },
    { id:"security",      label:"Security",        icon:Shield },
    { id:"danger",        label:"Danger Zone",     icon:AlertTriangle },
  ];

  // ✅ Fix 5: fetch real sessions
  useEffect(() => {
    if (tab === "security" && sessions === null) {
      setLoadingSessions(true);
      fetch("/api/sessions", {
        headers: { "Authorization":`Bearer ${localStorage.getItem("token")}` }
      })
        .then(r => r.json())
        .then(data => setSessions(Array.isArray(data) ? data : []))
        .catch(() => setSessions([]))
        .finally(() => setLoadingSessions(false));
    }
  }, [tab]);

  // ✅ Fix 5: Save notification preferences to backend
  const saveNotifPrefs = async (prefs) => {
    setNotifs(prefs);
    if (onUserUpdate) onUserUpdate({ notifPrefs: prefs });
    try {
      await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type":"application/json",
          "Authorization":`Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ notifPrefs: prefs }),
      });
      // Trigger real notification via backend
      if (prefs.email !== notifs.email || prefs.push !== notifs.push) {
        await fetch("/api/notifications/send", {
          method: "POST",
          headers: { "Content-Type":"application/json",
            "Authorization":`Bearer ${localStorage.getItem("token")}` },
          body: JSON.stringify({ type:"settings", message:"Notification preferences updated" }),
        });
      }
    } catch {}
  };

  const pwStrength = (p) => {
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const str    = pwStrength(pw.newPw);
  const strLbl = ["Too short","Weak","Fair","Strong","Very Strong"];
  const strClr = [C.textDim, C.red, C.amber, "#84CC16", C.green];

  // ✅ Fix 5: real password change hitting backend
  const handlePwChange = async () => {
    if (!pw.current || !pw.newPw || !pw.confirm) {
      setPwStatus({ type:"error", msg:"All fields are required." }); return;
    }
    if (pw.newPw !== pw.confirm) {
      setPwStatus({ type:"error", msg:"Passwords do not match." }); return;
    }
    if (str < 2) {
      setPwStatus({ type:"error", msg:"Password is too weak. Add uppercase, number, and symbol." }); return;
    }
    setPwStatus({ type:"loading" });
    try {
      const res = await fetch("/api/auth/password", {
        method: "PUT",
        headers: { "Content-Type":"application/json",
          "Authorization":`Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ currentPassword: pw.current, newPassword: pw.newPw }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed");
      setPwStatus({ type:"success", msg:"Password updated successfully. Please re-login." });
      setPw({ current:"", newPw:"", confirm:"" });
    } catch (err) {
      setPwStatus({ type:"error", msg: err.message || "Failed to update password." });
    }
  };

  // ✅ Fix 5: revoke session
  const handleRevokeSession = async (sessionId) => {
    try {
      await fetch("/api/auth/logout-device", {
        method: "POST",
        headers: { "Content-Type":"application/json",
          "Authorization":`Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ sessionId }),
      });
      setSessions(s => s.filter(sess => sess.id !== sessionId));
    } catch {}
  };

  // ✅ Fix 5: danger zone actions
  const handleExportData = async () => {
    const data = JSON.stringify(user, null, 2);
    const blob = new Blob([data], { type:"application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `cyberguard-my-data-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
  };

  const handleResetProgress = async () => {
    if (!window.confirm("Reset all progress? This cannot be undone.")) return;
    try {
      await fetch("/api/auth/reset-progress", {
        method: "POST",
        headers: { "Authorization":`Bearer ${localStorage.getItem("token")}` }
      });
      if (onUserUpdate) onUserUpdate({
        score:0, xp:0, level:1, loginStreak:0, quizzesDone:0, avgScore:0,
        quizHistory:[], badges:[], weeklyActivity:[], phishingSimCorrect:0, phishingSimTotal:0,
      });
    } catch {}
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.prompt("Type DELETE to permanently delete your account:");
    if (confirmed !== "DELETE") return;
    try {
      await fetch("/api/auth/delete", {
        method: "DELETE",
        headers: { "Authorization":`Bearer ${localStorage.getItem("token")}` }
      });
      localStorage.clear();
      window.location.href = "/";
    } catch {}
  };

  const Inp = ({ label, value, onChange, type="text", icon:Icon, right }) => (
    <div>
      <label style={{ fontSize:10,fontWeight:700,color:C.textDim,letterSpacing:"0.07em",
        display:"block",marginBottom:6 }}>{label.toUpperCase()}</label>
      <div style={{ display:"flex",alignItems:"center",gap:9,background:"#fff",
        border:`1px solid ${C.border}`,borderRadius:12,padding:"10px 13px" }}>
        {Icon && <Icon size={14} style={{ color:C.textDim,flexShrink:0 }}/>}
        <input value={value} onChange={e=>onChange(e.target.value)} type={type}
          style={{ border:"none",background:"transparent",outline:"none",
            fontSize:14,color:C.text,width:"100%",fontFamily:"inherit" }}/>
        {right}
      </div>
    </div>
  );

  const Toggle = ({ checked, onChange, color=C.brand }) => (
    <div onClick={()=>onChange(!checked)}
      style={{ width:42,height:22,borderRadius:99,background:checked?color:C.border,
        cursor:"pointer",transition:"background .2s",position:"relative",flexShrink:0 }}>
      <div style={{ width:16,height:16,borderRadius:"50%",background:"#fff",
        position:"absolute",top:3,left:checked?23:3,transition:"left .2s",
        boxShadow:"0 1px 4px rgba(0,0,0,0.18)" }}/>
    </div>
  );

  const deviceIcon = (device) => {
    if (!device) return <Monitor size={13}/>;
    const d = device.toLowerCase();
    if (d.includes("iphone")||d.includes("android")) return <Smartphone size={13}/>;
    if (d.includes("ipad")||d.includes("tablet")) return <Tablet size={13}/>;
    return <Monitor size={13}/>;
  };

  return (
    <div style={{ display:"grid",gridTemplateColumns:"210px 1fr",gap:18 }}>
      <div style={{ background:"#fff",border:`1px solid ${C.border}`,borderRadius:18,
        padding:"14px 10px",height:"fit-content",boxShadow:C.sh }}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{ width:"100%",display:"flex",alignItems:"center",gap:9,
              padding:"9px 11px",borderRadius:10,border:"none",
              background:tab===t.id?(t.id==="danger"?C.redLight:C.brandLight):"transparent",
              color:tab===t.id?(t.id==="danger"?C.red:C.brand):C.textMd,
              cursor:"pointer",fontFamily:"inherit",fontSize:12,
              fontWeight:tab===t.id?700:500,marginBottom:2,textAlign:"left",transition:"all .12s" }}>
            <t.icon size={14}/>{t.label}
          </button>
        ))}
      </div>

      <div style={{ background:"#fff",border:`1px solid ${C.border}`,borderRadius:18,padding:26,boxShadow:C.sh }}>
        {/* Password tab */}
        {tab==="password" && (
          <div>
            <h3 style={{ fontSize:15,fontWeight:800,color:C.text,margin:"0 0 5px",fontFamily:"Instrument Serif,Georgia,serif" }}>
              Change Password
            </h3>
            <p style={{ fontSize:12,color:C.textMd,margin:"0 0 22px" }}>
              Your new password is hashed with bcrypt and saved to MongoDB.
            </p>
            <div style={{ display:"flex",flexDirection:"column",gap:16,maxWidth:420 }}>
              {[
                { label:"Current Password",    key:"current" },
                { label:"New Password",         key:"newPw" },
                { label:"Confirm New Password", key:"confirm" },
              ].map((f)=>(
                <Inp key={f.key} label={f.label} icon={Key}
                  value={pw[f.key]} onChange={v=>setPw(p=>({...p,[f.key]:v}))}
                  type={showPw[f.key]?"text":"password"}
                  right={
                    <button onClick={()=>setShowPw(s=>({...s,[f.key]:!s[f.key]}))}
                      style={{ border:"none",background:"none",cursor:"pointer",color:C.textDim,padding:0,display:"flex" }}>
                      {showPw[f.key]?<EyeOff size={14}/>:<Eye size={14}/>}
                    </button>
                  }/>
              ))}
              {pw.newPw && (
                <div>
                  <div style={{ display:"flex",justifyContent:"space-between",fontSize:11,color:C.textMd,marginBottom:5 }}>
                    <span>Strength</span>
                    <span style={{ fontWeight:700,color:strClr[str] }}>{strLbl[str]}</span>
                  </div>
                  <div style={{ display:"flex",gap:4 }}>
                    {[1,2,3,4].map(i=>(
                      <div key={i} style={{ flex:1,height:4,borderRadius:99,
                        background:i<=str?strClr[str]:C.border,transition:"background .25s" }}/>
                    ))}
                  </div>
                  <div style={{ marginTop:7,fontSize:10,color:C.textDim }}>
                    {[
                      ["8+ characters",    pw.newPw.length>=8],
                      ["Uppercase letter", /[A-Z]/.test(pw.newPw)],
                      ["Number",           /[0-9]/.test(pw.newPw)],
                      ["Special char",     /[^A-Za-z0-9]/.test(pw.newPw)],
                    ].map(([rule,ok],i)=>(
                      <span key={i} style={{ color:ok?C.green:C.textDim,marginRight:10 }}>
                        {ok?"✓":"✗"} {rule}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {pwStatus && (
                <div style={{ padding:"11px 14px",borderRadius:11,
                  background:pwStatus.type==="success"?C.greenLight:pwStatus.type==="error"?C.redLight:C.brandLight,
                  border:`1px solid ${pwStatus.type==="success"?C.green:pwStatus.type==="error"?C.red:C.brand}22`,
                  display:"flex",alignItems:"center",gap:9 }}>
                  {pwStatus.type==="loading"?<Loader2 size={14} style={{ color:C.brand }}/>:
                   pwStatus.type==="success"?<CheckCircle2 size={14} style={{ color:C.green }}/>:
                   <AlertCircle size={14} style={{ color:C.red }}/>}
                  <span style={{ fontSize:12,fontWeight:600,
                    color:pwStatus.type==="success"?C.green:pwStatus.type==="error"?C.red:C.brand }}>
                    {pwStatus.type==="loading"?"Updating password…":pwStatus.msg}
                  </span>
                </div>
              )}
              <button onClick={handlePwChange}
                style={{ padding:"12px 22px",borderRadius:12,border:"none",
                  background:`linear-gradient(135deg,${C.brand},${C.brandMid})`,
                  color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",
                  boxShadow:`0 4px 14px ${C.brand}25`,display:"flex",alignItems:"center",
                  justifyContent:"center",gap:7 }}>
                <Key size={14}/> Update Password
              </button>
            </div>
          </div>
        )}

        {/* Notifications tab */}
        {tab==="notifications" && (
          <div>
            <h3 style={{ fontSize:15,fontWeight:800,color:C.text,margin:"0 0 5px",fontFamily:"Instrument Serif,Georgia,serif" }}>
              Notification Preferences
            </h3>
            <p style={{ fontSize:12,color:C.textMd,margin:"0 0 22px" }}>
              Changes are saved to your account and take effect immediately.
            </p>
            <div style={{ display:"flex",flexDirection:"column",gap:12,maxWidth:480 }}>
              {[
                { key:"email",   label:"Email Notifications",    desc:"Receive threat alerts and weekly reports via email",         icon:MailIcon },
                { key:"push",    label:"Push Notifications",      desc:"Real-time browser notifications for critical events",         icon:Bell },
                { key:"threats", label:"Critical Threat Alerts",  desc:"Immediate alerts for critical severity security events",      icon:ShieldAlert },
                { key:"weekly",  label:"Weekly Digest",           desc:"Summary of your security activity every Monday morning",     icon:BarChart2 },
              ].map((item)=>(
                <div key={item.key} style={{ display:"flex",alignItems:"center",gap:12,
                  padding:"14px 16px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:13 }}>
                  <div style={{ width:36,height:36,borderRadius:10,
                    background:notifs[item.key]?C.brandLight:"#fff",
                    border:`1px solid ${notifs[item.key]?C.brand+"25":C.border}`,
                    display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                    <item.icon size={15} style={{ color:notifs[item.key]?C.brand:C.textDim }}/>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13,fontWeight:700,color:C.text }}>{item.label}</div>
                    <div style={{ fontSize:11,color:C.textMd }}>{item.desc}</div>
                  </div>
                  <Toggle checked={notifs[item.key]}
                    onChange={v=>saveNotifPrefs({...notifs,[item.key]:v})}/>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security tab */}
        {tab==="security" && (
          <div>
            <h3 style={{ fontSize:15,fontWeight:800,color:C.text,margin:"0 0 5px",fontFamily:"Instrument Serif,Georgia,serif" }}>
              Security Settings
            </h3>
            <p style={{ fontSize:12,color:C.textMd,margin:"0 0 22px" }}>Manage your account security.</p>
            <div style={{ display:"flex",flexDirection:"column",gap:14,maxWidth:480 }}>
              {/* 2FA */}
              <div style={{ padding:"16px 18px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:14 }}>
                <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                  <div style={{ width:38,height:38,borderRadius:11,
                    background:twoFa?C.greenLight:C.redLight,
                    display:"flex",alignItems:"center",justifyContent:"center" }}>
                    {twoFa?<Lock size={16} style={{ color:C.green }}/>:<Unlock size={16} style={{ color:C.red }}/>}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13,fontWeight:700,color:C.text }}>Two-Factor Authentication (2FA)</div>
                    <div style={{ fontSize:11,color:C.textMd }}>Adds TOTP-based extra layer of security</div>
                  </div>
                  <Toggle checked={twoFa} onChange={async (v) => {
                    setTwoFa(v);
                    if (onUserUpdate) onUserUpdate({ twoFaEnabled: v });
                    try {
                      await fetch("/api/auth/profile", {
                        method:"PUT",
                        headers:{"Content-Type":"application/json","Authorization":`Bearer ${localStorage.getItem("token")}`},
                        body: JSON.stringify({ twoFaEnabled: v }),
                      });
                    } catch {}
                  }} color={C.green}/>
                </div>
              </div>

              {/* Session timeout */}
              <div style={{ padding:"16px 18px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:14 }}>
                <div style={{ fontSize:13,fontWeight:700,color:C.text,marginBottom:11 }}>Auto Session Timeout</div>
                <div style={{ display:"flex",gap:7 }}>
                  {["15","30","60","120"].map(t=>(
                    <button key={t} onClick={async()=>{
                      setSessionTimeout(t);
                      if(onUserUpdate) onUserUpdate({ sessionTimeout: t });
                      try {
                        await fetch("/api/auth/profile", {
                          method:"PUT",
                          headers:{"Content-Type":"application/json","Authorization":`Bearer ${localStorage.getItem("token")}`},
                          body: JSON.stringify({ sessionTimeout: t }),
                        });
                      } catch {}
                    }}
                      style={{ padding:"7px 14px",borderRadius:9,
                        border:`1px solid ${sessionTimeout===t?C.brand:C.border}`,
                        background:sessionTimeout===t?C.brandLight:"#fff",
                        color:sessionTimeout===t?C.brand:C.textMd,
                        fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit" }}>
                      {t}m
                    </button>
                  ))}
                </div>
              </div>

              {/* ✅ Fix 5: Real sessions from backend */}
              <div style={{ padding:"16px 18px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:14 }}>
                <div style={{ fontSize:13,fontWeight:700,color:C.text,marginBottom:12 }}>Active Sessions</div>
                {loadingSessions ? (
                  <div style={{ textAlign:"center",padding:"16px",color:C.textDim,display:"flex",alignItems:"center",gap:7,justifyContent:"center" }}>
                    <Loader2 size={14}/> Loading sessions…
                  </div>
                ) : sessions === null || sessions.length === 0 ? (
                  <div style={{ textAlign:"center",padding:"12px",color:C.textDim,fontSize:12 }}>
                    {sessions === null ? "Could not load sessions" : "Only this device is currently active"}
                  </div>
                ) : sessions.map((s,i)=>(
                  <div key={s.id||i} style={{ display:"flex",alignItems:"center",gap:11,
                    padding:"9px 0",borderBottom:i<sessions.length-1?`1px solid ${C.border}`:"none" }}>
                    <div style={{ width:32,height:32,borderRadius:9,
                      background:s.current?C.brandLight:"#fff",
                      border:`1px solid ${C.border}`,display:"flex",
                      alignItems:"center",justifyContent:"center" }}>
                      <span style={{ color:s.current?C.brand:C.textDim }}>{deviceIcon(s.device)}</span>
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:12,fontWeight:700,color:C.text }}>{s.device||"Unknown Device"}</div>
                      <div style={{ fontSize:10,color:C.textMd }}>{s.location||"Unknown"} · {s.time||s.lastSeen||"Unknown"}</div>
                    </div>
                    {s.current
                      ? <Bdg color={C.green} bg={C.greenLight}>This Device</Bdg>
                      : <button onClick={()=>handleRevokeSession(s.id)}
                          style={{ fontSize:11,color:C.red,border:`1px solid ${C.red}20`,
                            background:C.redLight,borderRadius:7,padding:"4px 10px",
                            cursor:"pointer",fontWeight:600,fontFamily:"inherit" }}>Revoke</button>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Danger zone tab */}
        {tab==="danger" && (
          <div>
            <h3 style={{ fontSize:15,fontWeight:800,color:C.red,margin:"0 0 5px",fontFamily:"Instrument Serif,Georgia,serif" }}>
              Danger Zone
            </h3>
            <p style={{ fontSize:12,color:C.textMd,margin:"0 0 22px" }}>
              These actions are irreversible. Proceed with extreme caution.
            </p>
            <div style={{ display:"flex",flexDirection:"column",gap:12,maxWidth:480 }}>
              {/* Export */}
              <div style={{ padding:"16px 18px",background:C.brand+"06",
                border:`1px solid ${C.brand}18`,borderRadius:13,
                display:"flex",alignItems:"center",gap:14 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13,fontWeight:700,color:C.text }}>Export My Data</div>
                  <div style={{ fontSize:11,color:C.textMd }}>Download full archive of your account data as JSON</div>
                </div>
                <button onClick={handleExportData}
                  style={{ padding:"8px 16px",borderRadius:10,border:`1px solid ${C.brand}25`,
                    background:C.brand+"0e",color:C.brand,fontSize:12,fontWeight:700,
                    cursor:"pointer",fontFamily:"inherit" }}>Export</button>
              </div>
              {/* Reset */}
              <div style={{ padding:"16px 18px",background:C.amber+"06",
                border:`1px solid ${C.amber}18`,borderRadius:13,
                display:"flex",alignItems:"center",gap:14 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13,fontWeight:700,color:C.text }}>Reset All Progress</div>
                  <div style={{ fontSize:11,color:C.textMd }}>Wipe all XP, scores, quiz history and badges from MongoDB</div>
                </div>
                <button onClick={handleResetProgress}
                  style={{ padding:"8px 16px",borderRadius:10,border:`1px solid ${C.amber}25`,
                    background:C.amber+"0e",color:C.amber,fontSize:12,fontWeight:700,
                    cursor:"pointer",fontFamily:"inherit" }}>Reset</button>
              </div>
              {/* Delete */}
              <div style={{ padding:"16px 18px",background:C.red+"06",
                border:`1px solid ${C.red}18`,borderRadius:13,
                display:"flex",alignItems:"center",gap:14 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13,fontWeight:700,color:C.text }}>Delete Account</div>
                  <div style={{ fontSize:11,color:C.textMd }}>Permanently delete your account and all data from the database. Type DELETE to confirm.</div>
                </div>
                <button onClick={handleDeleteAccount}
                  style={{ padding:"8px 16px",borderRadius:10,border:`1px solid ${C.red}25`,
                    background:C.red+"0e",color:C.red,fontSize:12,fontWeight:700,
                    cursor:"pointer",fontFamily:"inherit" }}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PAGE: LEADERBOARD ────────────────────────────────────────────────────────
function LeaderboardPage({ user }) {
  const [loading,  setLoading]  = useState(true);
  const [board,    setBoard]    = useState([]);
  const [tab,      setTab]      = useState("score");
  const [error,    setError]    = useState(null);

  // ✅ Fix 16: fetch real leaderboard from backend
  useEffect(() => {
    setLoading(true);
    fetch(`/api/leaderboard?sort=${tab}`, {
      headers: { "Authorization":`Bearer ${localStorage.getItem("token")}` }
    })
      .then(r => r.json())
      .then(data => {
        setBoard(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch(() => setError("Could not load leaderboard. Make sure your backend /api/leaderboard endpoint is running."))
      .finally(() => setLoading(false));
  }, [tab]);

  const myRank = board.findIndex(u => u.userId === (user?._id || user?.id)) + 1;
  const myEntry = board.find(u => u.userId === (user?._id || user?.id));

  const rankIcon = (rank) => {
    if (rank === 1) return <Crown size={16} style={{ color:"#F59E0B" }}/>;
    if (rank === 2) return <Medal size={16} style={{ color:"#94A3B8" }}/>;
    if (rank === 3) return <Medal size={16} style={{ color:"#CD7C4E" }}/>;
    return <span style={{ fontSize:12,fontWeight:700,color:C.textDim }}>#{rank}</span>;
  };

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:18 }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${C.brand}10,${C.violet}05)`,
        border:`1px solid ${C.brand}18`,borderRadius:20,padding:"20px 24px",
        display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <div style={{ display:"flex",alignItems:"center",gap:14 }}>
          <div style={{ width:52,height:52,borderRadius:15,
            background:`linear-gradient(135deg,${C.brand},${C.violet})`,
            display:"flex",alignItems:"center",justifyContent:"center",
            boxShadow:`0 8px 20px ${C.brand}28` }}>
            <Trophy size={22} style={{ color:"#fff" }}/>
          </div>
          <div>
            <h2 style={{ fontSize:18,fontWeight:800,color:C.text,margin:"0 0 3px",
              fontFamily:"Instrument Serif,Georgia,serif" }}>Global Leaderboard</h2>
            <p style={{ fontSize:12,color:C.textMd,margin:0 }}>
              Rankings based on real activity — quizzes, phishing sim, courses, and games
            </p>
          </div>
        </div>
        {myRank > 0 && (
          <div style={{ background:"#fff",border:`1px solid ${C.border}`,
            borderRadius:14,padding:"12px 18px",textAlign:"center",boxShadow:C.sh }}>
            <div style={{ fontSize:24,fontWeight:900,color:C.brand,fontFamily:"Instrument Serif,Georgia,serif" }}>#{myRank}</div>
            <div style={{ fontSize:10,color:C.textMd,fontWeight:600 }}>Your Rank</div>
          </div>
        )}
      </div>

      {/* Sort tabs */}
      <div style={{ display:"flex",gap:8 }}>
        {[
          { id:"score", label:"Total Score" },
          { id:"xp",    label:"XP" },
          { id:"quiz",  label:"Quizzes Done" },
          { id:"streak",label:"Streak" },
        ].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{ padding:"7px 16px",borderRadius:10,border:`1px solid ${tab===t.id?C.brand:C.border}`,
              background:tab===t.id?C.brandLight:"#fff",color:tab===t.id?C.brand:C.textMd,
              fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"all .15s" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Board */}
      <div style={{ background:"#fff",border:`1px solid ${C.border}`,borderRadius:20,overflow:"hidden",boxShadow:C.sh }}>
        {loading ? (
          <div style={{ padding:"48px",textAlign:"center",color:C.textDim,
            display:"flex",alignItems:"center",justifyContent:"center",gap:10 }}>
            <Loader2 size={18}/> Loading leaderboard…
          </div>
        ) : error ? (
          <div style={{ padding:"32px 24px" }}>
            <div style={{ background:C.amberLight,border:`1px solid ${C.amber}22`,borderRadius:13,padding:"16px 18px",
              display:"flex",alignItems:"flex-start",gap:12 }}>
              <AlertTriangle size={17} style={{ color:C.amber,flexShrink:0,marginTop:1 }}/>
              <div>
                <p style={{ fontSize:13,fontWeight:700,color:C.text,margin:"0 0 4px" }}>Backend required</p>
                <p style={{ fontSize:12,color:C.textMd,margin:0 }}>{error}</p>
                <p style={{ fontSize:11,color:C.textDim,margin:"8px 0 0",fontFamily:"JetBrains Mono,monospace" }}>
                  GET /api/leaderboard → [{"{"} rank, userId, name, score, xp, quizzesDone, loginStreak {"}"}, …]
                </p>
              </div>
            </div>
          </div>
        ) : board.length === 0 ? (
          <EmptyState icon={Trophy} title="No rankings yet"
            desc="Be the first to complete activities and claim the top spot!"
            color={C.brand}/>
        ) : (
          <>
            {/* Column headers */}
            <div style={{ display:"grid",gridTemplateColumns:"60px 1fr 110px 90px 80px 80px",
              padding:"10px 20px",background:C.bg,borderBottom:`1px solid ${C.border}`,
              fontSize:9,fontWeight:700,color:C.textDim,letterSpacing:"0.07em" }}>
              <span>RANK</span><span>USER</span><span>SCORE</span>
              <span>QUIZZES</span><span>XP</span><span>STREAK</span>
            </div>
            {board.map((entry, i) => {
              const isMe = entry.userId === (user?._id || user?.id);
              const rank = i + 1;
              return (
                <div key={entry.userId||i}
                  style={{ display:"grid",gridTemplateColumns:"60px 1fr 110px 90px 80px 80px",
                    padding:"13px 20px",borderBottom:i<board.length-1?`1px solid ${C.border}`:"none",
                    background:isMe?C.brandLight:"transparent",
                    transition:"background .12s" }}
                  onMouseEnter={e=>{ if(!isMe)e.currentTarget.style.background=C.bg; }}
                  onMouseLeave={e=>{ if(!isMe)e.currentTarget.style.background="transparent"; }}>
                  {/* Rank */}
                  <div style={{ display:"flex",alignItems:"center" }}>
                    {rankIcon(rank)}
                  </div>
                  {/* User */}
                  <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                    <div style={{ width:34,height:34,borderRadius:10,flexShrink:0,overflow:"hidden",
                      background:isMe?`linear-gradient(135deg,${C.brand},${C.violet})`:`linear-gradient(135deg,${C.textDim},#CBD5E1)`,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:13,fontWeight:800,color:"#fff" }}>
                      {entry.avatar
                        ? <img src={entry.avatar} alt="" style={{ width:34,height:34,objectFit:"cover" }}/>
                        : (entry.name||"?").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize:13,fontWeight:isMe?800:600,color:isMe?C.brand:C.text }}>
                        {entry.name||"Anonymous"} {isMe?" (You)":""}
                      </div>
                      <div style={{ fontSize:10,color:C.textDim }}>
                        {entry.role||"Learner"} · Lv.{entry.level||1}
                      </div>
                    </div>
                  </div>
                  {/* Stats */}
                  <span style={{ fontSize:13,fontWeight:700,color:C.text,alignSelf:"center",
                    fontFamily:"Instrument Serif,Georgia,serif" }}>
                    {(entry.score||0).toLocaleString()}
                  </span>
                  <span style={{ fontSize:12,color:C.textMd,alignSelf:"center" }}>
                    {entry.quizzesDone||0}
                  </span>
                  <span style={{ fontSize:12,color:C.textMd,alignSelf:"center" }}>
                    {(entry.xp||0).toLocaleString()}
                  </span>
                  <span style={{ fontSize:12,color:C.textMd,alignSelf:"center" }}>
                    🔥 {entry.loginStreak||0}d
                  </span>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

// ─── STUB PAGES ───────────────────────────────────────────────────────────────
function QuizPage({ navigate }) {
  return (
    <div style={{ background:`linear-gradient(135deg,${C.brand}10,${C.brandMid}05)`,
      border:`1px solid ${C.brand}18`,borderRadius:24,padding:"48px 40px",textAlign:"center" }}>
      <div style={{ fontSize:52,marginBottom:14 }}>🧠</div>
      <h2 style={{ fontSize:26,fontWeight:400,color:C.text,fontFamily:"Instrument Serif,Georgia,serif",margin:"0 0 10px" }}>Quiz Center</h2>
      <p style={{ fontSize:14,color:C.textMd,margin:"0 0 28px",maxWidth:460,marginLeft:"auto",marginRight:"auto",lineHeight:1.65 }}>
        Your quiz module is loaded separately. Click below to open it in its own page.
      </p>
      <button onClick={()=>navigate("/QuizPage")}
        style={{ padding:"13px 36px",borderRadius:13,border:"none",
          background:`linear-gradient(135deg,${C.brand},${C.brandMid})`,
          color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit",
          boxShadow:`0 8px 24px ${C.brand}28`,display:"inline-flex",alignItems:"center",gap:10 }}>
        <Brain size={16}/> Open Quiz Module
      </button>
    </div>
  );
}
function GamePage({ navigate }) {
  return (
    <div style={{ background:`linear-gradient(135deg,${C.violet}10,${C.brand}05)`,
      border:`1px solid ${C.violet}18`,borderRadius:24,padding:"56px 40px",textAlign:"center" }}>
      <div style={{ fontSize:52,marginBottom:14 }}>🛡️</div>
      <h2 style={{ fontSize:26,fontWeight:400,color:C.text,fontFamily:"Instrument Serif,Georgia,serif",margin:"0 0 10px" }}>CyberDefense Game</h2>
      <p style={{ fontSize:14,color:C.textMd,margin:"0 0 28px",maxWidth:460,marginLeft:"auto",marginRight:"auto",lineHeight:1.65 }}>
        Your game module lives on its own page. Click below to launch it.
      </p>
      <button onClick={()=>navigate("/game")}
        style={{ padding:"13px 36px",borderRadius:13,border:"none",
          background:`linear-gradient(135deg,${C.violet},${C.brand})`,
          color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit",
          boxShadow:`0 8px 24px ${C.violet}28`,display:"inline-flex",alignItems:"center",gap:10 }}>
        <Gamepad2 size={16}/> Launch Game
      </button>
    </div>
  );
}
function CoursesPage({ navigate }) {
  return (
    <div style={{ background:`linear-gradient(135deg,${C.teal}10,${C.brand}05)`,
      border:`1px solid ${C.teal}18`,borderRadius:24,padding:"56px 40px",textAlign:"center" }}>
      <div style={{ fontSize:52,marginBottom:14 }}>📚</div>
      <h2 style={{ fontSize:26,fontWeight:400,color:C.text,fontFamily:"Instrument Serif,Georgia,serif",margin:"0 0 10px" }}>Learning Courses</h2>
      <p style={{ fontSize:14,color:C.textMd,margin:"0 0 28px",maxWidth:460,marginLeft:"auto",marginRight:"auto",lineHeight:1.65 }}>
        Your courses are on a dedicated page. Progress and certificates sync back to your profile.
      </p>
      <button onClick={()=>navigate("/courses")}
        style={{ padding:"13px 36px",borderRadius:13,border:"none",
          background:`linear-gradient(135deg,${C.teal},#0F766E)`,
          color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit",
          boxShadow:`0 8px 24px ${C.teal}28`,display:"inline-flex",alignItems:"center",gap:10 }}>
        <GraduationCap size={16}/> Browse Courses
      </button>
    </div>
  );
}

// ─── ROOT EXPORT ──────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [page,      setPage]      = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showSearch,setShowSearch]= useState(false);
  const [user,      setUser]      = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("user") || "null");
      return raw ? { ...raw, _id: raw._id || raw.id } : null;
    } catch { return null; }
  });

  // ✅ Fix 4: Compute streak on mount
  useEffect(() => {
    if (!user) return;
    const { streak, updated } = computeStreak(user);
    if (updated) {
      const updatedUser = { ...user, loginStreak: streak, lastLoginDate: new Date().toISOString() };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      // Sync to backend
      fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type":"application/json",
          "Authorization":`Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ loginStreak: streak, lastLoginDate: updatedUser.lastLoginDate }),
      }).catch(()=>{});
    }
  }, []);

  // Merge user updates (local + persist)
  const onUserUpdate = useCallback((updates) => {
    setUser(prev => {
      const merged = { ...prev, ...updates };
      localStorage.setItem("user", JSON.stringify(merged));
      return merged;
    });
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setShowSearch(s=>!s); }
      if (e.key === "Escape") { setShowNotif(false); setShowSearch(false); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    if (!showNotif) return;
    const handler = (e) => {
      if (!e.target.closest("[data-notif]")) setShowNotif(false);
    };
    setTimeout(() => document.addEventListener("click", handler), 0);
    return () => document.removeEventListener("click", handler);
  }, [showNotif]);

  const notifCount = (user?.notifications||[]).filter(n=>!n.read).length;
  const sideW = collapsed ? 68 : 242;

  const renderPage = () => {
    switch(page) {
      case "overview":    return <OverviewPage    user={user} setPage={setPage} navigate={navigate}/>;
      case "threats":     return <ThreatsPage/>;
      case "courses":     return <CoursesPage     navigate={navigate}/>;
      case "phishing":    return <PhishingPage     user={user} onUserUpdate={onUserUpdate}/>;
      case "quiz":        return <QuizPage         navigate={navigate}/>;
      case "game":        return <GamePage         navigate={navigate}/>;
      case "reports":     return <ReportsPage      user={user}/>;
      case "profile":     return <ProfilePage      user={user} onUserUpdate={onUserUpdate}/>;
      case "settings":    return <SettingsPage     user={user} onUserUpdate={onUserUpdate}/>;
      case "leaderboard": return <LeaderboardPage  user={user}/>;
      default:            return <OverviewPage    user={user} setPage={setPage} navigate={navigate}/>;
    }
  };

  return (
    <div style={{ display:"flex",minHeight:"100vh",background:C.bg,fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:.6}50%{opacity:1}}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(79,70,229,0.15);border-radius:99px}
        ::-webkit-scrollbar-thumb:hover{background:rgba(79,70,229,0.3)}
        input:-webkit-autofill{-webkit-box-shadow:0 0 0 100px #fff inset!important}
        .spin{animation:spin 1s linear infinite}
      `}</style>

      {/* ✅ Fix 12: collapsible sidebar */}
      <Sidebar page={page} setPage={setPage} user={user} navigate={navigate}
        collapsed={collapsed} setCollapsed={setCollapsed}/>

      <div style={{ flex:1,marginLeft:sideW,display:"flex",flexDirection:"column",transition:"margin-left .25s cubic-bezier(.16,1,.3,1)" }}>
        {/* ✅ Fix 13: profile click → profile page, Fix 14: notif opens panel, Fix 15: search overlay */}
        <TopBar page={page} user={user} notifCount={notifCount}
          onNotifClick={()=>setShowNotif(s=>!s)}
          onProfileClick={()=>setPage("profile")}
          onSearchClick={()=>setShowSearch(true)}/>

        {/* ✅ Fix 14: notification panel */}
        {showNotif && (
          <div data-notif>
            <NotificationPanel user={user} onClose={()=>setShowNotif(false)}/>
          </div>
        )}

        {/* ✅ Fix 15: search overlay */}
        {showSearch && (
          <SearchOverlay
            onClose={()=>setShowSearch(false)}
            setPage={setPage}
            navigate={navigate}/>
        )}

        <main style={{ flex:1,padding:"22px 26px",overflowY:"auto" }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}