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

// ─── MOCK LEADERBOARD DATA (shown when backend is unavailable or too sparse) ──
const MOCK_LEADERBOARD = [
  { userId:"mock1", name:"Arjun Sharma",   role:"Security Analyst", level:5, score:4820, xp:9640, quizzesDone:38, loginStreak:14, avatar:null },
  { userId:"mock2", name:"Priya Mehta",    role:"SOC Engineer",     level:4, score:3950, xp:7900, quizzesDone:31, loginStreak:9,  avatar:null },
  { userId:"mock3", name:"Rohan Gupta",    role:"Pen Tester",       level:4, score:3410, xp:6820, quizzesDone:27, loginStreak:7,  avatar:null },
  { userId:"mock4", name:"Sneha Patil",    role:"Student",          level:3, score:2780, xp:5560, quizzesDone:22, loginStreak:5,  avatar:null },
  { userId:"mock5", name:"Vikram Das",     role:"IT Admin",         level:3, score:2140, xp:4280, quizzesDone:17, loginStreak:4,  avatar:null },
  { userId:"mock6", name:"Ananya Reddy",   role:"Student",          level:2, score:1590, xp:3180, quizzesDone:13, loginStreak:3,  avatar:null },
  { userId:"mock7", name:"Karan Joshi",    role:"Learner",          level:2, score:1020, xp:2040, quizzesDone:9,  loginStreak:2,  avatar:null },
  { userId:"mock8", name:"Meera Iyer",     role:"Student",          level:1, score:650,  xp:1300, quizzesDone:5,  loginStreak:1,  avatar:null },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmtDate = d => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "";

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
const computeStreak = (user) => {
  const now = Date.now();
  const last = user?.lastLoginDate ? new Date(user.lastLoginDate).getTime() : 0;
  const diffHours = (now - last) / (1000 * 60 * 60);
  const currentStreak = user?.loginStreak || 0;

  if (!last || diffHours < 0) return { streak: currentStreak, updated: false };
  if (diffHours < 24) return { streak: currentStreak, updated: false };
  if (diffHours > 48) return { streak: 1, updated: true };
  return { streak: currentStreak + 1, updated: true };
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
    { id:"overview",   label:"Overview",            icon:Home,        desc:"Dashboard home" },
    { id:"threats",    label:"Threat Intelligence", icon:ShieldAlert, desc:"Live threat feed" },
    { id:"phishing",   label:"Phishing Simulator",  icon:Mail,        desc:"Practice detecting phishing" },
    { id:"reports",    label:"Analytics & Reports", icon:BarChart2,   desc:"Security analytics" },
    { id:"profile",    label:"My Profile",          icon:User,        desc:"Account & stats" },
    { id:"settings",   label:"Settings",            icon:Settings,    desc:"Configure account" },
    { id:"leaderboard",label:"Leaderboard",         icon:Trophy,      desc:"Top performers" },
  ];
  const externalPages = [
    { label:"Courses",   icon:GraduationCap, path:"/courses" },
    { label:"Quiz",      icon:Brain,         path:"/quiz" },
    { label:"CyberGame", icon:Gamepad2,      path:"/game" },
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
    { id:"quiz",        icon:Brain,         label:"Quiz",         external:"/quiz" },
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
                fontFamily:"Instrument Serif,Georgia,serif" }}>CyberShield</div>
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
      <button onClick={onSearchClick}
        style={{ display:"flex",alignItems:"center",gap:7,background:C.bg,
          border:`1px solid ${C.border}`,borderRadius:11,padding:"8px 13px",width:220,
          cursor:"pointer",fontFamily:"inherit",color:C.textDim,fontSize:12 }}>
        <Search size={13}/> Search pages & features…
      </button>
      <button onClick={onNotifClick}
        style={{ position:"relative",width:36,height:36,borderRadius:10,
          border:`1px solid ${C.border}`,background:"#fff",cursor:"pointer",
          display:"flex",alignItems:"center",justifyContent:"center" }}>
        <Bell size={15} style={{ color:C.textMd }}/>
        {notifCount>0 && <span style={{ position:"absolute",top:6,right:6,width:7,height:7,
          borderRadius:"50%",background:C.red,border:"2px solid #fff" }}/>}
      </button>
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
  const fname = firstName(user);

  const score    = user?.score       || 120;
  const xp       = user?.xp          || 260;
  const level    = user?.level       || 1;
  const streak   = user?.loginStreak || 2;
  const quizDone = user?.quizzesDone || 3;
  const avgScore = user?.avgScore    || 60;
  const xpPct    = Math.min(100, Math.round(((xp % 500)/500)*100));

  const weekData = user?.weeklyActivity && user.weeklyActivity.length > 0
    ? user.weeklyActivity
    : [
        { day:"Mon", score:40 },{ day:"Tue", score:65 },{ day:"Wed", score:50 },
        { day:"Thu", score:80 },{ day:"Fri", score:70 },{ day:"Sat", score:90 },{ day:"Sun", score:75 },
      ];

  const domainData = [
    { subject:"Phishing", A: user?.phishingScore || 78 },
    { subject:"Malware",  A: user?.malwareScore  || 65 },
    { subject:"Network",  A: user?.networkScore  || 72 },
    { subject:"Privacy",  A: user?.privacyScore  || 80 },
    { subject:"Cloud",    A: user?.cloudScore    || 60 },
  ];

  const history = user?.quizHistory || [
    { quiz:"Phishing Basics", score:80, date:"2026-03-25" },
    { quiz:"Malware Attack",  score:70, date:"2026-03-27" },
    { quiz:"Network Security",score:85, date:"2026-03-29" },
    { quiz:"Privacy & Data",  score:75, date:"2026-04-01" },
  ];

  const phishingCorrect = user?.phishingSimCorrect || 8;
  const phishingTotal   = user?.phishingSimTotal   || 10;

  const tips = [
    "Never reuse passwords across accounts.",
    "Enable 2FA on every critical service you use.",
    "Hover over links — always verify the domain first.",
    "Keep your OS and all software fully patched.",
    "Public Wi-Fi? Always tunnel through a VPN.",
    "Backup your data — 3-2-1 rule: 3 copies, 2 media, 1 offsite.",
  ];
  const [tip] = useState(() => tips[Math.floor(Math.random() * tips.length)]);

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
                {v:`Lv.${level}`,          l:"Level"},
                {v:`${streak}d`,           l:"Streak"},
                {v:quizDone,               l:"Quizzes"},
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
            { icon:Brain,         label:"Take Quiz",   sub:"Earn XP",        color:C.brand,  bg:C.brandLight, action:()=>navigate("/quiz") },
            { icon:GraduationCap, label:"Courses",     sub:"Learn more",     color:C.teal,   bg:C.tealLight,  action:()=>navigate("/courses") },
            { icon:Gamepad2,      label:"Play Game",   sub:"Defend systems", color:C.violet, bg:"#EDE9FE",    action:()=>navigate("/game") },
            { icon:ShieldAlert,   label:"Threats",     sub:"Live intel",     color:C.red,    bg:C.redLight,   action:()=>setPage("threats") },
            { icon:Mail,          label:"Phishing",    sub:"Train instincts",color:C.amber,  bg:C.amberLight, action:()=>setPage("phishing") },
            { icon:Trophy,        label:"Leaderboard", sub:"Top performers", color:C.pink,   bg:C.pinkLight,  action:()=>setPage("leaderboard") },
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
        <StatCard label="Total Score"       value={score.toLocaleString()} change={score>0?"+active":"New"}           up={score>0}         color={C.brand}  bg={C.brandLight} icon={Star}   sub={score>0?"Keep earning!":"Start a quiz"}/>
        <StatCard label="Avg Quiz Score"    value={avgScore>0?`${avgScore}%`:"—"} change={avgScore>=70?"Above avg":"No data"} up={avgScore>=70} color={C.violet} bg="#EDE9FE"   icon={Brain}  sub={avgScore>0?"Well done":"Take your first quiz"}/>
        <StatCard label="Login Streak"      value={`${streak} day${streak!==1?"s":""}`} change={streak>=3?"🔥 On fire":"Keep going"} up={streak>=3} color={C.amber} bg={C.amberLight} icon={Flame} sub="Resets if you miss a day"/>
        <StatCard label="Phishing Accuracy" value={phishingTotal>0?`${Math.round((phishingCorrect/phishingTotal)*100)}%`:"—"} change={phishingTotal>0?"Trained":"Not started"} up={phishingTotal>0} color={C.teal} bg={C.tealLight} icon={Mail} sub={phishingTotal>0?`${phishingCorrect}/${phishingTotal} correct`:"Try the simulator"}/>
      </div>

      {/* Charts */}
      <div className="fu fu3" style={{ display:"grid",gridTemplateColumns:"2fr 1fr",gap:16 }}>
        <div style={{ background:"#fff",border:`1px solid ${C.border}`,borderRadius:20,padding:22,boxShadow:C.sh }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16 }}>
            <div>
              <h3 style={{ fontSize:14,fontWeight:700,color:C.text,margin:0 }}>Weekly Activity</h3>
              <p style={{ fontSize:11,color:C.textMd,margin:"2px 0 0" }}>Your score progression this week</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={weekData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
              <XAxis dataKey="day" tick={{ fontSize:11,fill:C.textMd }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize:10,fill:C.textMd }} axisLine={false} tickLine={false}/>
              <Tooltip content={<CTip/>}/>
              <Bar dataKey="score" name="Score" fill={C.brand} radius={[5,5,0,0]} maxBarSize={26}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background:"#fff",border:`1px solid ${C.border}`,borderRadius:20,padding:22,boxShadow:C.sh }}>
          <h3 style={{ fontSize:14,fontWeight:700,color:C.text,margin:"0 0 4px" }}>Domain Mastery</h3>
          <p style={{ fontSize:11,color:C.textMd,margin:"0 0 12px" }}>Skill radar across security domains</p>
          <ResponsiveContainer width="100%" height={190}>
            <RadarChart data={domainData}>
              <PolarGrid stroke={C.border}/>
              <PolarAngleAxis dataKey="subject" tick={{ fontSize:10,fill:C.textMd }}/>
              <Radar name="Score" dataKey="A" stroke={C.brand} fill={C.brand} fillOpacity={0.12} strokeWidth={2}/>
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quiz history */}
      <div className="fu fu4" style={{ background:"#fff",border:`1px solid ${C.border}`,borderRadius:20,padding:22,boxShadow:C.sh }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18 }}>
          <div>
            <h3 style={{ fontSize:14,fontWeight:700,color:C.text,margin:0 }}>Recent Quiz Activity</h3>
            <p style={{ fontSize:11,color:C.textMd,margin:"2px 0 0" }}>
              {history.length>0?`${history.length} module${history.length!==1?"s":""} completed`:"No attempts yet"}
            </p>
          </div>
          <button onClick={()=>navigate("/courses")}
            style={{ display:"flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:11,border:"none",
              background:`linear-gradient(135deg,${C.brand},${C.brandMid})`,color:"#fff",fontSize:12,
              fontWeight:700,cursor:"pointer",fontFamily:"inherit",boxShadow:`0 4px 12px ${C.brand}25` }}>
            <Brain size={12}/> {history.length>0?"New Quiz":"Start First Quiz"}
          </button>
        </div>
        {history.length>0 ? (
          <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:11 }}>
            {history.slice(0,4).map((r,idx)=>{
              const g = GRADE[r.grade]||GRADE["B"];
              return (
                <div key={idx} style={{ background:C.bg,border:`1px solid ${C.border}`,
                  borderRadius:15,padding:14,cursor:"pointer",transition:"all .2s",position:"relative",overflow:"hidden" }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.brand+"40";e.currentTarget.style.transform="translateY(-2px)"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="none"; }}>
                  <p style={{ fontSize:12,fontWeight:700,color:C.text,margin:"0 0 4px" }}>{r.quiz||r.moduleTitle||`Module ${idx+1}`}</p>
                  <p style={{ fontSize:22,fontWeight:900,color:g.color,margin:"0 0 6px",fontFamily:"Instrument Serif,Georgia,serif" }}>{r.score||r.percentage||0}%</p>
                  <p style={{ fontSize:10,color:C.textDim,margin:0 }}>{fmtDate(r.date||r.updatedAt)}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState icon={Brain} title="No quizzes attempted yet"
            desc="Take your first quiz to start tracking your performance and earn XP."
            actionLabel="Browse Courses" onAction={()=>navigate("/courses")} color={C.brand}/>
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
              {user.recentActivity.slice(0,6).map((a,i)=>(
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

        <div style={{ background:"#fff",border:`1px solid ${C.border}`,borderRadius:20,padding:20,boxShadow:C.sh }}>
          <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:14 }}>
            <div style={{ width:30,height:30,borderRadius:9,background:C.amberLight,display:"flex",alignItems:"center",justifyContent:"center" }}>
              <Award size={13} style={{ color:C.amber }}/>
            </div>
            <h3 style={{ fontSize:13,fontWeight:700,color:C.text,margin:0 }}>Badges Earned</h3>
          </div>
          {(user?.badges||[]).length>0 ? (
            <div style={{ display:"flex",flexWrap:"wrap",gap:9 }}>
              {user.badges.map((b,i)=>(
                <div key={i} style={{ textAlign:"center",padding:"10px 12px",background:C.bg,
                  border:`1px solid ${C.border}`,borderRadius:13,cursor:"default",transition:"all .2s" }}
                  onMouseEnter={e=>{ e.currentTarget.style.background=C.amberLight;e.currentTarget.style.transform="scale(1.06)"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background=C.bg;e.currentTarget.style.transform="scale(1)"; }}>
                  <div style={{ fontSize:22,lineHeight:1 }}>{b.emoji||"🏅"}</div>
                  <p style={{ fontSize:9,color:C.textMd,marginTop:5,fontWeight:700 }}>{b.label||b}</p>
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
    </div>
  );
}

// ─── PAGE: THREATS ────────────────────────────────────────────────────────────
function ThreatsPage() {
  const [filter,setFilter]       = useState("all");
  const [search,setSearch]       = useState("");
  const [selected,setSelected]   = useState(null);
  const [liveCount,setLiveCount] = useState(THREATS.length);
  const [pulse,setPulse]         = useState(false);

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
        {filtered.map((t,i)=>{
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

// ─── PAGE: PHISHING SIM ───────────────────────────────────────────────────────
function PhishingPage({ user, onUserUpdate }) {
  const [step,setStep]               = useState(0);
  const [result,setResult]           = useState(null);
  const [sessionScore,setSessionScore] = useState(0);
  const [sessionTotal,setSessionTotal] = useState(0);

  const emails = [
    { id:1, from:"security@paypa1.com", subject:"⚠️ Your account has been limited", time:"10:32 AM",
      body:`Dear Valued Customer,\n\nWe detected unusual activity on your PayPal account. Your account has been temporarily limited.\n\nVerify your identity immediately:\nhttps://www.paypa1-secure-verify.com/account/restore\n\nFailure to verify within 24 hours will result in permanent account suspension.\n\nPayPal Security Team`,
      clues:["Sender domain: paypa1.com — '1' substitutes 'l'","Suspicious URL: paypa1-secure-verify.com","Urgency: '24 hours' deadline creates panic","Generic greeting: 'Valued Customer' not your name","Real PayPal always uses paypal.com domain"],
      isPhishing:true, category:"Phishing" },
    { id:2, from:"newsletter@github.com", subject:"Your GitHub digest for March 2026", time:"9:15 AM",
      body:`Hi there,\n\nHere's your weekly GitHub digest:\n\n• 3 new followers this week\n• 12 stars on your repositories\n• 5 new issues opened\n\nSee what's trending: https://github.com/trending\n\nBest,\nThe GitHub Team`,
      clues:["Legitimate: github.com is the real domain","Relevant, personalized content about your account","No urgency or threats used","All links go only to github.com"],
      isPhishing:false, category:"Legitimate" },
    { id:3, from:"hr-dept@company-payroll.net", subject:"URGENT: Payroll Update Required", time:"8:44 AM",
      body:`Hello Employee,\n\nOur payroll system was updated. To receive your next salary you MUST update your bank details within 48 hours.\n\nClick here: http://company-payroll-update.netlify.app/banking\n\nThis is MANDATORY. Ignoring this will delay your salary.\n\n- HR Department`,
      clues:["Suspicious domain: company-payroll.net (not your company)","Link redirects to netlify.app — not an official domain","Extreme urgency about salary payment","No employee name used","ALL CAPS pressure tactics: URGENT, MANDATORY"],
      isPhishing:true, category:"Spear Phishing" },
    { id:4, from:"noreply@amazon.com", subject:"Your order #113-4892-0032 has shipped!", time:"3:21 PM",
      body:`Hello,\n\nGreat news! Your order has been shipped and is on its way.\n\nOrder #113-4892-0032\nEstimated delivery: March 22–24\n\nTrack your package: https://www.amazon.com/gp/your-account/order-history\n\nThank you for shopping with Amazon!\n\nThe Amazon Team`,
      clues:["Legitimate: amazon.com official domain","Standard transactional shipping notification","No requests for personal or financial info","All links go to amazon.com only","Contains a real order number"],
      isPhishing:false, category:"Legitimate" },
    { id:5, from:"support@micros0ft-help.com", subject:"Your Microsoft 365 License Expired", time:"11:02 AM",
      body:`Dear User,\n\nYour Microsoft 365 subscription expired. Your files and email access will be disabled in 3 hours.\n\nRenew now to avoid data loss:\nhttps://micros0ft-help.com/renew?id=8829\n\nEnter your credit card to continue.\n\nMicrosoft Support`,
      clues:["Domain: micros0ft-help.com — '0' replaces 'o' in Microsoft","Very short deadline: 3 hours — high pressure","Asking for credit card directly in email","Threat of data loss to create fear","Microsoft never sends payment links via email"],
      isPhishing:true, category:"Brand Impersonation" },
  ];

  const current = emails[step];
  const accuracy = sessionTotal > 0 ? Math.round((sessionScore / sessionTotal) * 100) : 0;

  const handleAnswer = (isPhish) => {
    const correct = isPhish === current.isPhishing;
    if (correct) setSessionScore(s => s + 1);
    setSessionTotal(t => t + 1);
    setResult({ correct, isPhishing: current.isPhishing });
    if (onUserUpdate) {
      const prevCorrect = user?.phishingSimCorrect || 0;
      const prevTotal   = user?.phishingSimTotal   || 0;
      onUserUpdate({
        phishingSimCorrect: prevCorrect + (correct ? 1 : 0),
        phishingSimTotal:   prevTotal + 1,
        recentActivity: [
          { msg:`Analyzed phishing email: "${current.subject.substring(0,30)}…" — ${correct?"Correct ✓":"Incorrect ✗"}`, time:"Just now" },
          ...(user?.recentActivity || []).slice(0, 9),
        ],
      });
    }
  };

  const next = () => {
    if (step < emails.length - 1) { setStep(s => s + 1); setResult(null); }
    else { setStep(0); setResult(null); setSessionScore(0); setSessionTotal(0); }
  };

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:18 }}>
      <div style={{ background:`linear-gradient(135deg,${C.amber}12,${C.amber}04)`,
        border:`1px solid ${C.amber}18`,borderRadius:20,padding:"18px 22px",
        display:"flex",alignItems:"center",gap:14 }}>
        <div style={{ width:46,height:46,borderRadius:13,background:C.amberLight,
          display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
          <Mail size={20} style={{ color:C.amber }}/>
        </div>
        <div style={{ flex:1 }}>
          <h2 style={{ fontSize:17,fontWeight:800,color:C.text,margin:"0 0 3px",fontFamily:"Instrument Serif,Georgia,serif" }}>
            Phishing Simulator
          </h2>
          <p style={{ fontSize:12,color:C.textMd,margin:0 }}>
            Analyse each email: legitimate or phishing? Results sync to your profile.
          </p>
        </div>
        <div style={{ background:C.brandLight,border:`1px solid ${C.brand}20`,borderRadius:9,
          padding:"5px 12px",fontSize:12,fontWeight:700,color:C.brand }}>
          {sessionScore}/{sessionTotal} ✓ {sessionTotal>0?`(${accuracy}%)`:""}
        </div>
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"1fr 320px",gap:16 }}>
        <div style={{ background:"#fff",border:`1px solid ${C.border}`,borderRadius:20,overflow:"hidden",boxShadow:C.sh }}>
          <div style={{ background:C.bg,borderBottom:`1px solid ${C.border}`,padding:"9px 16px",
            display:"flex",alignItems:"center",gap:7 }}>
            <div style={{ width:9,height:9,borderRadius:"50%",background:"#FF5F57" }}/>
            <div style={{ width:9,height:9,borderRadius:"50%",background:"#FEBC2E" }}/>
            <div style={{ width:9,height:9,borderRadius:"50%",background:"#28C840" }}/>
            <span style={{ fontSize:11,color:C.textDim,marginLeft:6 }}>Inbox — Email {step+1} of {emails.length}</span>
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
                margin:"0 0 3px",lineHeight:1.65 }}>
                {line||"\u00A0"}
              </p>
            ))}
          </div>
        </div>

        <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
          {!result ? (
            <div style={{ background:"#fff",border:`1px solid ${C.border}`,borderRadius:18,padding:18,boxShadow:C.sh }}>
              <h3 style={{ fontSize:13,fontWeight:700,color:C.text,margin:"0 0 5px" }}>Your Verdict</h3>
              <p style={{ fontSize:11,color:C.textMd,margin:"0 0 14px" }}>Is this email safe or a phishing attempt?</p>
              <div style={{ display:"flex",flexDirection:"column",gap:9 }}>
                <button onClick={()=>handleAnswer(false)}
                  style={{ padding:"11px 14px",borderRadius:12,border:`2px solid ${C.green}`,
                    background:C.greenLight,color:C.green,fontSize:13,fontWeight:700,
                    cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:9 }}
                  onMouseEnter={e=>{e.currentTarget.style.background=C.green;e.currentTarget.style.color="#fff";}}
                  onMouseLeave={e=>{e.currentTarget.style.background=C.greenLight;e.currentTarget.style.color=C.green;}}>
                  <CheckCircle size={15}/> Legitimate Email ✓
                </button>
                <button onClick={()=>handleAnswer(true)}
                  style={{ padding:"11px 14px",borderRadius:12,border:`2px solid ${C.red}`,
                    background:C.redLight,color:C.red,fontSize:13,fontWeight:700,
                    cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:9 }}
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
                  <div key={i} style={{ display:"flex",alignItems:"flex-start",gap:7,fontSize:11,color:C.textMd,lineHeight:1.45 }}>
                    <div style={{ width:16,height:16,borderRadius:"50%",
                      background:current.isPhishing?C.redLight:C.greenLight,
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
        </div>
      </div>
    </div>
  );
}

// ─── PAGE: REPORTS ────────────────────────────────────────────────────────────
function ReportsPage({ user, navigate }) {
  const [exporting, setExporting] = useState(null);

  const hasQuizData     = (user?.quizHistory||[]).length > 0;
  const hasPhishingData = (user?.phishingSimTotal||0) > 0;
  const hasAnyData      = hasQuizData || hasPhishingData;

  const handleDownload = async (type) => {
    setExporting(type);
    await new Promise(r => setTimeout(r, 800));
    const reportContent = `
CyberShield Security Report
Generated: ${new Date().toLocaleDateString("en-IN", { day:"2-digit", month:"long", year:"numeric" })}
User: ${user?.fullName || user?.name || user?.email || "Unknown"}

=== PERFORMANCE SUMMARY ===
Total Score:        ${user?.score || 0}
Level:              ${user?.level || 1}
XP:                 ${user?.xp || 0}
Login Streak:       ${user?.loginStreak || 0} days
Quizzes Completed:  ${user?.quizzesDone || 0}
Average Quiz Score: ${user?.avgScore || 0}%

=== PHISHING SIMULATOR ===
Total Analyzed:     ${user?.phishingSimTotal || 0}
Correct Detections: ${user?.phishingSimCorrect || 0}
Accuracy:           ${user?.phishingSimTotal ? Math.round((user.phishingSimCorrect/user.phishingSimTotal)*100) : 0}%
    `.trim();

    if (type === "pdf") {
      const win = window.open("","_blank");
      win.document.write(`<html><head><title>CyberShield Report</title>
        <style>body{font-family:'Courier New',monospace;padding:40px;color:#0F172A}h1{font-family:Georgia,serif;color:#4F46E5}pre{white-space:pre-wrap;font-size:13px;line-height:1.7}</style></head>
        <body><h1>🛡️ CyberShield Security Report</h1><pre>${reportContent}</pre></body></html>`);
      win.document.close();
      setTimeout(() => { win.print(); win.close(); }, 500);
    } else {
      const blob = new Blob([reportContent], { type:"text/plain" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `CyberShield_Report_${new Date().toISOString().split("T")[0]}.txt`;
      a.click();
    }
    setExporting(null);
  };

  if (!hasAnyData) {
    return (
      <div style={{ display:"flex",flexDirection:"column",gap:18 }}>
        <EmptyState icon={BarChart2}
          title="No report data yet"
          desc="Your reports will populate automatically as you complete quizzes, phishing simulations, courses, and games."
          color={C.brand}/>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14 }}>
          {[
            { icon:Brain,         label:"Take a Quiz",       desc:"Earn scores and XP",         color:C.brand,  path:"/quiz" },
            { icon:Mail,          label:"Try Phishing Sim",  desc:"Test your detection skills",  color:C.amber,  page:"phishing" },
            { icon:GraduationCap, label:"Complete a Course", desc:"Learn and earn certificates", color:C.teal,   path:"/courses" },
            { icon:Gamepad2,      label:"Play CyberGame",    desc:"Defend against attacks",      color:C.violet, path:"/game" },
          ].map((item,i) => (
            <div key={i}
              onClick={()=> item.path ? navigate(item.path) : null}
              style={{ background:"#fff",border:`1px solid ${C.border}`,borderRadius:18,
                padding:"20px 22px",boxShadow:C.sh,display:"flex",alignItems:"center",gap:14,
                cursor:"pointer",transition:"all .18s" }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor=item.color+"40";e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 8px 20px ${item.color}12`; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow=C.sh; }}>
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
      <div style={{ background:"#fff",border:`1px solid ${C.border}`,borderRadius:18,
        padding:"14px 20px",display:"flex",alignItems:"center",gap:14,boxShadow:C.sh }}>
        <div style={{ flex:1 }}>
          <h3 style={{ fontSize:14,fontWeight:700,color:C.text,margin:"0 0 2px" }}>Export Report</h3>
          <p style={{ fontSize:11,color:C.textMd,margin:0 }}>Download your personalised security report</p>
        </div>
        {[
          { l:"PDF",  fmt:"pdf",  icon:FileDown,     color:C.red },
          { l:"TXT",  fmt:"txt",  icon:FileTextIcon, color:C.brand },
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

      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:13 }}>
        <StatCard label="Total Score"       value={(user?.score||0).toLocaleString()} change="+active" up={true} color={C.brand}  bg={C.brandLight} icon={Star}/>
        <StatCard label="Quizzes Completed" value={user?.quizzesDone||0}              change="done"    up={true} color={C.violet} bg="#EDE9FE"       icon={Brain}/>
        <StatCard label="Phishing Accuracy" value={user?.phishingSimTotal?`${Math.round((user.phishingSimCorrect/user.phishingSimTotal)*100)}%`:"—"} change="trained" up={true} color={C.amber} bg={C.amberLight} icon={Mail}/>
        <StatCard label="Login Streak"      value={`${user?.loginStreak||0}d`}        change="streak"  up={(user?.loginStreak||0)>=3} color={C.teal} bg={C.tealLight} icon={Flame}/>
      </div>
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
  const [form, setForm] = useState({
    fullName: user?.fullName || user?.name || user?.username || "",
    email:    user?.email    || "",
    phone:    user?.phone    || "",
    location: user?.location || "",
    role:     user?.role     || "",
  });
  const fileRef = useRef();

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
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res  = await fetch(`https://api.cloudinary.com/v1_1/demo/image/upload`,{method:"POST",body:fd});
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
      await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type":"application/json","Authorization":`Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(form),
      });
    } catch {}
    if (onUserUpdate) onUserUpdate(form);
    setSaved(true); setEditMode(false); setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  };

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
        <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
          <div style={{ background:"#fff",border:`1px solid ${C.border}`,borderRadius:22,padding:"26px 22px",textAlign:"center",boxShadow:C.sh }}>
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
            <h2 style={{ fontSize:17,fontWeight:800,color:C.text,margin:"0 0 3px",fontFamily:"Instrument Serif,Georgia,serif" }}>{form.fullName||"User"}</h2>
            <p style={{ fontSize:12,color:C.textMd,margin:"0 0 10px" }}>{form.role||"Cybersecurity Learner"}</p>
            <Bdg color={C.brand} bg={C.brandLight} size="md">Level {user?.level||1} Beginner</Bdg>
          </div>

          <div style={{ background:"#fff",border:`1px solid ${C.border}`,borderRadius:18,padding:18,boxShadow:C.sh }}>
            <h3 style={{ fontSize:12,fontWeight:700,color:C.text,margin:"0 0 12px" }}>PERFORMANCE STATS</h3>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:9 }}>
              {statItems.map((s,i)=>(
                <div key={i} style={{ background:C.bg,borderRadius:11,padding:"11px 13px",textAlign:"center" }}>
                  <div style={{ fontSize:18,fontWeight:900,color:s.c,fontFamily:"Instrument Serif,Georgia,serif" }}>{s.v}</div>
                  <div style={{ fontSize:9,color:C.textDim,marginTop:2,fontWeight:700 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ background:"#fff",border:`1px solid ${C.border}`,borderRadius:22,padding:26,boxShadow:C.sh }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:22 }}>
            <h3 style={{ fontSize:15,fontWeight:800,color:C.text,margin:0,fontFamily:"Instrument Serif,Georgia,serif" }}>Profile Information</h3>
            <button onClick={()=>editMode?handleSave():setEditMode(true)}
              style={{ display:"flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:10,
                border:"none",background:editMode?`linear-gradient(135deg,${C.green},#34D399)`:`linear-gradient(135deg,${C.brand},${C.brandMid})`,
                color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit" }}>
              {saving?<Loader2 size={12}/>:editMode?<><Save size={12}/> Save Changes</>:<><Edit3 size={12}/> Edit Profile</>}
            </button>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
            {[
              { label:"Full Name",    key:"fullName", icon:User,    type:"text" },
              { label:"Email",        key:"email",    icon:MailIcon,type:"email" },
              { label:"Phone",        key:"phone",    icon:Phone,   type:"tel" },
              { label:"Location",     key:"location", icon:MapPin,  type:"text" },
              { label:"Role / Title", key:"role",     icon:Shield,  type:"text", full:true },
            ].map((field)=>(
              <div key={field.key} style={{ gridColumn:field.full?"span 2":"auto" }}>
                <label style={{ fontSize:10,fontWeight:700,color:C.textDim,letterSpacing:"0.07em",display:"block",marginBottom:5 }}>
                  {field.label.toUpperCase()}
                </label>
                <div style={{ display:"flex",alignItems:"center",gap:9,
                  background:editMode?"#fff":C.bg,
                  border:`1px solid ${editMode?C.brandMid+"45":C.border}`,
                  borderRadius:11,padding:"10px 13px" }}>
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

  const handlePwChange = async () => {
    if (!pw.current || !pw.newPw || !pw.confirm) { setPwStatus({ type:"error", msg:"All fields are required." }); return; }
    if (pw.newPw !== pw.confirm) { setPwStatus({ type:"error", msg:"Passwords do not match." }); return; }
    if (str < 2) { setPwStatus({ type:"error", msg:"Password is too weak." }); return; }
    setPwStatus({ type:"loading" });
    try {
      const res = await fetch("/api/auth/password", {
        method:"PUT",
        headers:{"Content-Type":"application/json","Authorization":`Bearer ${localStorage.getItem("token")}`},
        body: JSON.stringify({ currentPassword: pw.current, newPassword: pw.newPw }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed");
      setPwStatus({ type:"success", msg:"Password updated successfully." });
      setPw({ current:"", newPw:"", confirm:"" });
    } catch (err) {
      setPwStatus({ type:"error", msg: err.message || "Failed to update password." });
    }
  };

  const Toggle = ({ checked, onChange, color=C.brand }) => (
    <div onClick={()=>onChange(!checked)}
      style={{ width:42,height:22,borderRadius:99,background:checked?color:C.border,
        cursor:"pointer",transition:"background .2s",position:"relative",flexShrink:0 }}>
      <div style={{ width:16,height:16,borderRadius:"50%",background:"#fff",
        position:"absolute",top:3,left:checked?23:3,transition:"left .2s",
        boxShadow:"0 1px 4px rgba(0,0,0,0.18)" }}/>
    </div>
  );

  const Inp = ({ label, value, onChange, type="text", icon:Icon, right }) => (
    <div>
      <label style={{ fontSize:10,fontWeight:700,color:C.textDim,letterSpacing:"0.07em",display:"block",marginBottom:6 }}>{label.toUpperCase()}</label>
      <div style={{ display:"flex",alignItems:"center",gap:9,background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,padding:"10px 13px" }}>
        {Icon && <Icon size={14} style={{ color:C.textDim,flexShrink:0 }}/>}
        <input value={value} onChange={e=>onChange(e.target.value)} type={type}
          style={{ border:"none",background:"transparent",outline:"none",fontSize:14,color:C.text,width:"100%",fontFamily:"inherit" }}/>
        {right}
      </div>
    </div>
  );

  return (
    <div style={{ display:"grid",gridTemplateColumns:"210px 1fr",gap:18 }}>
      <div style={{ background:"#fff",border:`1px solid ${C.border}`,borderRadius:18,padding:"14px 10px",height:"fit-content",boxShadow:C.sh }}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{ width:"100%",display:"flex",alignItems:"center",gap:9,padding:"9px 11px",borderRadius:10,border:"none",
              background:tab===t.id?(t.id==="danger"?C.redLight:C.brandLight):"transparent",
              color:tab===t.id?(t.id==="danger"?C.red:C.brand):C.textMd,
              cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:tab===t.id?700:500,
              marginBottom:2,textAlign:"left" }}>
            <t.icon size={14}/>{t.label}
          </button>
        ))}
      </div>

      <div style={{ background:"#fff",border:`1px solid ${C.border}`,borderRadius:18,padding:26,boxShadow:C.sh }}>
        {tab==="password" && (
          <div>
            <h3 style={{ fontSize:15,fontWeight:800,color:C.text,margin:"0 0 22px",fontFamily:"Instrument Serif,Georgia,serif" }}>Change Password</h3>
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
                    <span>Strength</span><span style={{ fontWeight:700,color:strClr[str] }}>{strLbl[str]}</span>
                  </div>
                  <div style={{ display:"flex",gap:4 }}>
                    {[1,2,3,4].map(i=>(
                      <div key={i} style={{ flex:1,height:4,borderRadius:99,background:i<=str?strClr[str]:C.border }}/>
                    ))}
                  </div>
                </div>
              )}
              {pwStatus && (
                <div style={{ padding:"11px 14px",borderRadius:11,
                  background:pwStatus.type==="success"?C.greenLight:pwStatus.type==="error"?C.redLight:C.brandLight,
                  display:"flex",alignItems:"center",gap:9 }}>
                  {pwStatus.type==="loading"?<Loader2 size={14} style={{ color:C.brand }}/>:
                   pwStatus.type==="success"?<CheckCircle2 size={14} style={{ color:C.green }}/>:
                   <AlertCircle size={14} style={{ color:C.red }}/>}
                  <span style={{ fontSize:12,fontWeight:600,color:pwStatus.type==="success"?C.green:pwStatus.type==="error"?C.red:C.brand }}>
                    {pwStatus.type==="loading"?"Updating…":pwStatus.msg}
                  </span>
                </div>
              )}
              <button onClick={handlePwChange}
                style={{ padding:"12px 22px",borderRadius:12,border:"none",
                  background:`linear-gradient(135deg,${C.brand},${C.brandMid})`,
                  color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit" }}>
                Update Password
              </button>
            </div>
          </div>
        )}

        {tab==="notifications" && (
          <div>
            <h3 style={{ fontSize:15,fontWeight:800,color:C.text,margin:"0 0 22px",fontFamily:"Instrument Serif,Georgia,serif" }}>Notification Preferences</h3>
            <div style={{ display:"flex",flexDirection:"column",gap:12,maxWidth:480 }}>
              {[
                { key:"email",   label:"Email Notifications",   desc:"Receive threat alerts via email",            icon:MailIcon },
                { key:"push",    label:"Push Notifications",     desc:"Real-time browser notifications",            icon:Bell },
                { key:"threats", label:"Critical Threat Alerts", desc:"Alerts for critical security events",        icon:ShieldAlert },
                { key:"weekly",  label:"Weekly Digest",          desc:"Summary of your activity every Monday",      icon:BarChart2 },
              ].map((item)=>(
                <div key={item.key} style={{ display:"flex",alignItems:"center",gap:12,padding:"14px 16px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:13 }}>
                  <div style={{ width:36,height:36,borderRadius:10,background:notifs[item.key]?C.brandLight:"#fff",border:`1px solid ${notifs[item.key]?C.brand+"25":C.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                    <item.icon size={15} style={{ color:notifs[item.key]?C.brand:C.textDim }}/>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13,fontWeight:700,color:C.text }}>{item.label}</div>
                    <div style={{ fontSize:11,color:C.textMd }}>{item.desc}</div>
                  </div>
                  <Toggle checked={notifs[item.key]} onChange={v=>setNotifs(n=>({...n,[item.key]:v}))}/>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==="security" && (
          <div>
            <h3 style={{ fontSize:15,fontWeight:800,color:C.text,margin:"0 0 22px",fontFamily:"Instrument Serif,Georgia,serif" }}>Security Settings</h3>
            <div style={{ padding:"16px 18px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:14,maxWidth:480 }}>
              <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                <div style={{ width:38,height:38,borderRadius:11,background:twoFa?C.greenLight:C.redLight,display:"flex",alignItems:"center",justifyContent:"center" }}>
                  {twoFa?<Lock size={16} style={{ color:C.green }}/>:<Unlock size={16} style={{ color:C.red }}/>}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13,fontWeight:700,color:C.text }}>Two-Factor Authentication</div>
                  <div style={{ fontSize:11,color:C.textMd }}>Adds extra layer of security to your account</div>
                </div>
                <Toggle checked={twoFa} onChange={v=>{ setTwoFa(v); if(onUserUpdate) onUserUpdate({ twoFaEnabled:v }); }} color={C.green}/>
              </div>
            </div>
          </div>
        )}

        {tab==="danger" && (
          <div>
            <h3 style={{ fontSize:15,fontWeight:800,color:C.red,margin:"0 0 22px",fontFamily:"Instrument Serif,Georgia,serif" }}>Danger Zone</h3>
            <div style={{ display:"flex",flexDirection:"column",gap:12,maxWidth:480 }}>
              {[
                { title:"Export My Data",     desc:"Download your account data as JSON",                 color:C.brand, action:()=>{ const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(user,null,2)],{type:"application/json"}));a.download="cybershield-data.json";a.click(); }, btn:"Export" },
                { title:"Reset All Progress", desc:"Wipe all XP, scores, quiz history and badges",       color:C.amber, action:()=>{ if(window.confirm("Reset all progress?")&&onUserUpdate) onUserUpdate({score:0,xp:0,level:1,loginStreak:0,quizzesDone:0}); }, btn:"Reset" },
                { title:"Delete Account",     desc:"Permanently delete your account and all data",        color:C.red,   action:()=>{ if(window.prompt("Type DELETE to confirm:")!=="DELETE")return;localStorage.clear();window.location.href="/"; }, btn:"Delete" },
              ].map((item,i)=>(
                <div key={i} style={{ padding:"16px 18px",background:item.color+"06",border:`1px solid ${item.color}18`,borderRadius:13,display:"flex",alignItems:"center",gap:14 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13,fontWeight:700,color:C.text }}>{item.title}</div>
                    <div style={{ fontSize:11,color:C.textMd }}>{item.desc}</div>
                  </div>
                  <button onClick={item.action}
                    style={{ padding:"8px 16px",borderRadius:10,border:`1px solid ${item.color}25`,background:item.color+"0e",color:item.color,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit" }}>
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

// ─── PAGE: LEADERBOARD (FIXED v3) ────────────────────────────────────────────
function LeaderboardPage({ user }) {
  const [loading,   setLoading]   = useState(true);
  const [board,     setBoard]     = useState([]);
  const [tab,       setTab]       = useState("score");
  const [usingMock, setUsingMock] = useState(false);

  // Always build a fresh entry from live user prop — never use stale DB zeros
  const buildUserEntry = useCallback((u) => ({
    userId:      u?._id || u?.id || "current-user",
    name:        getFullName(u),
    role:        u?.role || "Student",
    level:       u?.level || 1,
    score:       u?.score || 0,
    xp:          u?.xp || 0,
    quizzesDone: u?.quizzesDone || 0,
    loginStreak: u?.loginStreak || 0,
    avatar:      u?.avatar || null,
    isSelf:      true,
  }), []);

  const buildBoard = useCallback((backendRows, useMock) => {
    const meEntry = buildUserEntry(user);
    const myId    = meEntry.userId;

    // Base list: mock or real backend others
    const base      = useMock ? [...MOCK_LEADERBOARD] : [...backendRows];
    // Strip any stale "me" from the list
    const withoutMe = base.filter(e => e.userId !== myId && !e.isSelf);
    // Inject fresh user entry
    const merged    = [...withoutMe, meEntry];

    // Sort by selected tab
    merged.sort((a, b) => {
      if (tab === "xp")     return b.xp          - a.xp;
      if (tab === "quiz")   return b.quizzesDone  - a.quizzesDone;
      if (tab === "streak") return b.loginStreak  - a.loginStreak;
      return b.score - a.score;
    });

    setBoard(merged);
  }, [tab, user, buildUserEntry]);

  const fetchBoard = useCallback(() => {
    setLoading(true);
    fetch(`/api/leaderboard?sort=${tab}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(r => { if (!r.ok) throw new Error("not ok"); return r.json(); })
      .then(data => {
        // Only trust backend if it has ≥ 3 entries OTHER than the current user
        const myId  = user?._id || user?.id;
        const others = Array.isArray(data)
          ? data.filter(e => e.userId !== myId && !e.isSelf)
          : [];

        if (others.length >= 3) {
          buildBoard(others, false);
          setUsingMock(false);
        } else {
          // Too sparse — use mock + inject real user
          buildBoard([], true);
          setUsingMock(true);
        }
      })
      .catch(() => {
        buildBoard([], true);
        setUsingMock(true);
      })
      .finally(() => setLoading(false));
  }, [tab, user, buildBoard]);

  useEffect(() => { fetchBoard(); }, [fetchBoard]);

  const myRank = board.findIndex(e => e.isSelf) + 1;

  const rankIcon = (rank) => {
    if (rank === 1) return <Crown size={16} style={{ color: "#F59E0B" }} />;
    if (rank === 2) return <Medal size={16} style={{ color: "#94A3B8" }} />;
    if (rank === 3) return <Medal size={16} style={{ color: "#CD7C4E" }} />;
    return <span style={{ fontSize: 12, fontWeight: 700, color: C.textDim }}>#{rank}</span>;
  };

  const sortVal = (entry) => {
    if (tab === "xp")     return `${(entry.xp || 0).toLocaleString()} XP`;
    if (tab === "quiz")   return `${entry.quizzesDone || 0} done`;
    if (tab === "streak") return `🔥 ${entry.loginStreak || 0}d`;
    return (entry.score || 0).toLocaleString();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg,${C.brand}10,${C.violet}05)`,
        border: `1px solid ${C.brand}18`, borderRadius: 20, padding: "20px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 15,
            background: `linear-gradient(135deg,${C.brand},${C.violet})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 8px 20px ${C.brand}28`,
          }}>
            <Trophy size={22} style={{ color: "#fff" }} />
          </div>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: C.text, margin: "0 0 3px", fontFamily: "Instrument Serif,Georgia,serif" }}>
              Global Leaderboard
            </h2>
            <p style={{ fontSize: 12, color: C.textMd, margin: 0 }}>
              Rankings based on real activity — quizzes, phishing sim, courses, and games
              {usingMock && (
                <span style={{
                  marginLeft: 8, fontSize: 10, color: C.amber, fontWeight: 700,
                  background: C.amberLight, border: `1px solid ${C.amber}20`,
                  borderRadius: 99, padding: "1px 8px",
                }}>Demo Data</span>
              )}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {myRank > 0 && (
            <div style={{
              background: "#fff", border: `1px solid ${C.border}`,
              borderRadius: 14, padding: "12px 18px", textAlign: "center", boxShadow: C.sh,
            }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: C.brand, fontFamily: "Instrument Serif,Georgia,serif" }}>
                #{myRank}
              </div>
              <div style={{ fontSize: 10, color: C.textMd, fontWeight: 600 }}>Your Rank</div>
            </div>
          )}
          <button onClick={fetchBoard} style={{
            width: 36, height: 36, borderRadius: 10,
            border: `1px solid ${C.border}`, background: "#fff",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <RefreshCw size={14} style={{ color: C.textMd }} />
          </button>
        </div>
      </div>

      {/* Sort tabs */}
      <div style={{ display: "flex", gap: 8 }}>
        {[
          { id: "score",  label: "Total Score" },
          { id: "xp",     label: "XP" },
          { id: "quiz",   label: "Quizzes Done" },
          { id: "streak", label: "Streak" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "7px 16px", borderRadius: 10,
            border: `1px solid ${tab === t.id ? C.brand : C.border}`,
            background: tab === t.id ? C.brandLight : "#fff",
            color: tab === t.id ? C.brand : C.textMd,
            fontSize: 12, fontWeight: 700, cursor: "pointer",
            fontFamily: "inherit", transition: "all .15s",
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Demo notice */}
      {usingMock && (
        <div style={{
          background: C.amberLight, border: `1px solid ${C.amber}22`,
          borderRadius: 13, padding: "12px 18px",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <AlertTriangle size={15} style={{ color: C.amber, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>Demo mode — </span>
            <span style={{ fontSize: 12, color: C.textMd }}>
              Showing sample leaderboard. Your real stats (score: {user?.score || 0}, streak: {user?.loginStreak || 0}d) are shown in your highlighted row.
            </span>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{
        background: "#fff", border: `1px solid ${C.border}`,
        borderRadius: 20, overflow: "hidden", boxShadow: C.sh,
      }}>
        {loading ? (
          <div style={{
            padding: "48px", textAlign: "center", color: C.textDim,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          }}>
            <Loader2 size={18} /> Loading leaderboard…
          </div>
        ) : (
          <>
            <div style={{
              display: "grid", gridTemplateColumns: "60px 1fr 140px 90px 80px 80px",
              padding: "10px 20px", background: C.bg, borderBottom: `1px solid ${C.border}`,
              fontSize: 9, fontWeight: 700, color: C.textDim, letterSpacing: "0.07em",
            }}>
              <span>RANK</span>
              <span>USER</span>
              <span style={{ textTransform: "uppercase" }}>
                {tab === "score" ? "SCORE" : tab === "xp" ? "XP" : tab === "quiz" ? "QUIZZES" : "STREAK"}
              </span>
              <span>QUIZZES</span>
              <span>XP</span>
              <span>STREAK</span>
            </div>

            {board.length === 0 ? (
              <div style={{ padding: "48px", textAlign: "center", color: C.textDim }}>No data available</div>
            ) : board.map((entry, i) => {
              const isMe     = !!entry.isSelf;
              const rank     = i + 1;
              const topThree = rank <= 3;
              const borderColor = isMe ? C.brand
                : rank === 1 ? "#F59E0B"
                : rank === 2 ? "#94A3B8"
                : rank === 3 ? "#CD7C4E"
                : "transparent";

              return (
                <div key={entry.userId || i} style={{
                  display: "grid", gridTemplateColumns: "60px 1fr 140px 90px 80px 80px",
                  padding: "13px 20px",
                  borderBottom: i < board.length - 1 ? `1px solid ${C.border}` : "none",
                  background: isMe ? C.brandLight : topThree ? `${C.brand}04` : "transparent",
                  transition: "background .12s",
                  borderLeft: `3px solid ${borderColor}`,
                }}
                  onMouseEnter={e => { if (!isMe) e.currentTarget.style.background = C.bg; }}
                  onMouseLeave={e => { if (!isMe) e.currentTarget.style.background = topThree ? `${C.brand}04` : "transparent"; }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>{rankIcon(rank)}</div>

                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, flexShrink: 0, overflow: "hidden",
                      background: isMe
                        ? `linear-gradient(135deg,${C.brand},${C.violet})`
                        : `linear-gradient(135deg,${C.textDim},#CBD5E1)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, fontWeight: 800, color: "#fff",
                    }}>
                      {entry.avatar
                        ? <img src={entry.avatar} alt="" style={{ width: 36, height: 36, objectFit: "cover" }} />
                        : (entry.name || "?").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{
                        fontSize: 13, fontWeight: isMe ? 800 : 600,
                        color: isMe ? C.brand : C.text,
                        display: "flex", alignItems: "center", gap: 6,
                      }}>
                        {entry.name || "Anonymous"}
                        {isMe && (
                          <span style={{
                            fontSize: 9, background: C.brand, color: "#fff",
                            borderRadius: 99, padding: "1px 7px", fontWeight: 700,
                          }}>YOU</span>
                        )}
                        {rank === 1 && !isMe && (
                          <span style={{
                            fontSize: 9, background: "#FFFBEB", color: "#D97706",
                            borderRadius: 99, padding: "1px 7px", fontWeight: 700,
                            border: "1px solid #FDE68A",
                          }}>👑 TOP</span>
                        )}
                      </div>
                      <div style={{ fontSize: 10, color: C.textDim }}>
                        {entry.role || "Learner"} · Lv.{entry.level || 1}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{
                      fontSize: 14, fontWeight: 800,
                      color: isMe ? C.brand : topThree ? C.text : C.textMd,
                      fontFamily: "Instrument Serif,Georgia,serif",
                    }}>
                      {sortVal(entry)}
                    </span>
                  </div>

                  <span style={{ fontSize: 12, color: C.textMd, alignSelf: "center" }}>
                    {entry.quizzesDone || 0}
                  </span>

                  <span style={{ fontSize: 12, color: C.textMd, alignSelf: "center" }}>
                    {(entry.xp || 0).toLocaleString()}
                  </span>

                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{
                      fontSize: 12, alignSelf: "center",
                      color: isMe && (entry.loginStreak || 0) > 0 ? C.amber : C.textMd,
                      fontWeight: isMe ? 700 : 400,
                    }}>
                      🔥 {entry.loginStreak || 0}d
                    </span>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Your current stats */}
      <div style={{
        background: "#fff", border: `1px solid ${C.border}`,
        borderRadius: 18, padding: "16px 20px", boxShadow: C.sh,
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.textDim, marginBottom: 12, letterSpacing: "0.06em" }}>
          YOUR CURRENT STATS
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
          {[
            { l: "Score",   v: (user?.score || 0).toLocaleString(), c: C.brand,  icon: "⭐" },
            { l: "XP",      v: (user?.xp || 0).toLocaleString(),    c: C.violet, icon: "⚡" },
            { l: "Quizzes", v: user?.quizzesDone || 0,               c: C.teal,   icon: "🧠" },
            { l: "Streak",  v: `${user?.loginStreak || 0} days`,     c: C.amber,  icon: "🔥" },
          ].map((s, i) => (
            <div key={i} style={{
              background: C.bg, borderRadius: 13, padding: "14px 16px",
              textAlign: "center", border: `1px solid ${s.c}15`,
            }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: s.c, fontFamily: "Instrument Serif,Georgia,serif" }}>
                {s.v}
              </div>
              <div style={{ fontSize: 11, color: C.textMd, marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── STUB PAGES ───────────────────────────────────────────────────────────────
function QuizStubPage({ navigate }) {
  return (
    <div style={{ background:`linear-gradient(135deg,${C.brand}10,${C.brandMid}05)`,border:`1px solid ${C.brand}18`,borderRadius:24,padding:"48px 40px",textAlign:"center" }}>
      <div style={{ fontSize:52,marginBottom:14 }}>🧠</div>
      <h2 style={{ fontSize:26,fontWeight:400,color:C.text,fontFamily:"Instrument Serif,Georgia,serif",margin:"0 0 10px" }}>Quiz Center</h2>
      <p style={{ fontSize:14,color:C.textMd,margin:"0 0 28px",maxWidth:460,marginInline:"auto",lineHeight:1.65 }}>
        Quizzes are linked to individual courses. Pick a course below to unlock its quiz.
      </p>
      <button onClick={()=>navigate("/courses")}
        style={{ padding:"13px 36px",borderRadius:13,border:"none",background:`linear-gradient(135deg,${C.brand},${C.brandMid})`,color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit",boxShadow:`0 8px 24px ${C.brand}28`,display:"inline-flex",alignItems:"center",gap:10 }}>
        <GraduationCap size={16}/> Browse Courses
      </button>
    </div>
  );
}

function GameStubPage({ navigate }) {
  return (
    <div style={{ background:`linear-gradient(135deg,${C.violet}10,${C.brand}05)`,border:`1px solid ${C.violet}18`,borderRadius:24,padding:"56px 40px",textAlign:"center" }}>
      <div style={{ fontSize:52,marginBottom:14 }}>🛡️</div>
      <h2 style={{ fontSize:26,fontWeight:400,color:C.text,fontFamily:"Instrument Serif,Georgia,serif",margin:"0 0 10px" }}>CyberDefense Game</h2>
      <p style={{ fontSize:14,color:C.textMd,margin:"0 0 28px",maxWidth:460,marginInline:"auto",lineHeight:1.65 }}>Your game module lives on its own page. Click below to launch it.</p>
      <button onClick={()=>navigate("/game")}
        style={{ padding:"13px 36px",borderRadius:13,border:"none",background:`linear-gradient(135deg,${C.violet},${C.brand})`,color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit",boxShadow:`0 8px 24px ${C.violet}28`,display:"inline-flex",alignItems:"center",gap:10 }}>
        <Gamepad2 size={16}/> Launch Game
      </button>
    </div>
  );
}

function CoursesStubPage({ navigate }) {
  return (
    <div style={{ background:`linear-gradient(135deg,${C.teal}10,${C.brand}05)`,border:`1px solid ${C.teal}18`,borderRadius:24,padding:"56px 40px",textAlign:"center" }}>
      <div style={{ fontSize:52,marginBottom:14 }}>📚</div>
      <h2 style={{ fontSize:26,fontWeight:400,color:C.text,fontFamily:"Instrument Serif,Georgia,serif",margin:"0 0 10px" }}>Learning Courses</h2>
      <p style={{ fontSize:14,color:C.textMd,margin:"0 0 28px",maxWidth:460,marginInline:"auto",lineHeight:1.65 }}>Your courses are on a dedicated page. Progress and certificates sync back to your profile.</p>
      <button onClick={()=>navigate("/courses")}
        style={{ padding:"13px 36px",borderRadius:13,border:"none",background:`linear-gradient(135deg,${C.teal},#0F766E)`,color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit",boxShadow:`0 8px 24px ${C.teal}28`,display:"inline-flex",alignItems:"center",gap:10 }}>
        <GraduationCap size={16}/> Browse Courses
      </button>
    </div>
  );
}

// ─── ROOT EXPORT ──────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [page,       setPage]      = useState("overview");
  const [collapsed,  setCollapsed] = useState(false);
  const [showNotif,  setShowNotif] = useState(false);
  const [showSearch, setShowSearch]= useState(false);
  const [user, setUser] = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("user") || "null");
      return raw ? { ...raw, _id: raw._id || raw.id } : null;
    } catch { return null; }
  });

  // Fetch fresh user + compute streak on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data?.user) {
          const fresh = { ...data.user, _id: data.user._id || data.user.id };
          const { streak, updated } = computeStreak(fresh);
          if (updated) {
            fresh.loginStreak   = streak;
            fresh.lastLoginDate = new Date().toISOString();
            fetch("/api/auth/profile", {
              method: "PUT",
              headers: { "Content-Type":"application/json", Authorization:`Bearer ${token}` },
              body: JSON.stringify({ loginStreak:streak, lastLoginDate:fresh.lastLoginDate }),
            }).catch(() => {});
          }
          setUser(fresh);
          localStorage.setItem("user", JSON.stringify(fresh));
        }
      })
      .catch(() => {
        const raw = localStorage.getItem("user");
        if (raw) {
          try {
            const cached = JSON.parse(raw);
            const { streak, updated } = computeStreak(cached);
            if (updated) {
              const u2 = { ...cached, loginStreak:streak, lastLoginDate:new Date().toISOString() };
              setUser(u2);
              localStorage.setItem("user", JSON.stringify(u2));
            }
          } catch {}
        }
      });
  }, []);

  const onUserUpdate = useCallback((updates) => {
    setUser(prev => {
      const merged = { ...prev, ...updates };
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
              const fresh = { ...data.user, _id: data.user._id || data.user.id };
              setUser(prev => {
                const merged = {
                  ...fresh,
                  score:              Math.max(fresh.score||0,              prev?.score||0),
                  xp:                 Math.max(fresh.xp||0,                 prev?.xp||0),
                  quizzesDone:        Math.max(fresh.quizzesDone||0,        prev?.quizzesDone||0),
                  loginStreak:        Math.max(fresh.loginStreak||0,        prev?.loginStreak||0),
                  phishingSimCorrect: Math.max(fresh.phishingSimCorrect||0, prev?.phishingSimCorrect||0),
                  phishingSimTotal:   Math.max(fresh.phishingSimTotal||0,   prev?.phishingSimTotal||0),
                  quizHistory:        (prev?.quizHistory?.length||0) > (fresh.quizHistory?.length||0) ? prev.quizHistory : fresh.quizHistory,
                  badges:             (prev?.badges?.length||0) > (fresh.badges?.length||0) ? prev.badges : fresh.badges,
                };
                localStorage.setItem("user", JSON.stringify(merged));
                return merged;
              });
            }
          })
          .catch(() => {});
      }, 1000);
    }
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setShowSearch(s=>!s); }
      if (e.key === "Escape") { setShowNotif(false); setShowSearch(false); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (!showNotif) return;
    const handler = (e) => { if (!e.target.closest("[data-notif]")) setShowNotif(false); };
    setTimeout(() => document.addEventListener("click", handler), 0);
    return () => document.removeEventListener("click", handler);
  }, [showNotif]);

  const notifCount = (user?.notifications||[]).filter(n=>!n.read).length;
  const sideW = collapsed ? 68 : 242;

  const renderPage = () => {
    switch(page) {
      case "overview":    return <OverviewPage    user={user} setPage={setPage} navigate={navigate}/>;
      case "threats":     return <ThreatsPage/>;
      case "courses":     return <CoursesStubPage navigate={navigate}/>;
      case "phishing":    return <PhishingPage    user={user} onUserUpdate={onUserUpdate}/>;
      case "quiz":        return <QuizStubPage    navigate={navigate}/>;
      case "game":        return <GameStubPage    navigate={navigate}/>;
      case "reports":     return <ReportsPage     user={user} navigate={navigate}/>;
      case "profile":     return <ProfilePage     user={user} onUserUpdate={onUserUpdate}/>;
      case "settings":    return <SettingsPage    user={user} onUserUpdate={onUserUpdate}/>;
      case "leaderboard": return <LeaderboardPage user={user}/>;
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

      <Sidebar page={page} setPage={setPage} user={user} navigate={navigate}
        collapsed={collapsed} setCollapsed={setCollapsed}/>

      <div style={{ flex:1,marginLeft:sideW,display:"flex",flexDirection:"column",transition:"margin-left .25s cubic-bezier(.16,1,.3,1)" }}>
        <TopBar page={page} user={user} notifCount={notifCount}
          onNotifClick={()=>setShowNotif(s=>!s)}
          onProfileClick={()=>setPage("profile")}
          onSearchClick={()=>setShowSearch(true)}/>

        {showNotif && (
          <div data-notif>
            <NotificationPanel user={user} onClose={()=>setShowNotif(false)}/>
          </div>
        )}

        {showSearch && (
          <SearchOverlay onClose={()=>setShowSearch(false)} setPage={setPage} navigate={navigate}/>
        )}

        <main style={{ flex:1,padding:"22px 26px",overflowY:"auto" }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}