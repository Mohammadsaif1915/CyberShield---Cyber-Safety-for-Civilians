import { useState, useEffect, useCallback, useRef } from "react";
import {
  Shield, LayoutDashboard, BookOpen, AlertTriangle, Mail, Brain,
  BarChart2, Trophy, Settings, Bell, Search, ChevronLeft, ChevronRight,
  User, LogOut, TrendingUp, Clock, CheckCircle, XCircle,
  Zap, Eye, EyeOff, X, Award, Target, Activity,
  AlertCircle, Edit, Save, Trash2, ChevronDown, ChevronUp,
  Gamepad2, GraduationCap, ShieldAlert, ArrowRight, Flame,
  Loader2, Rocket, RefreshCw, Camera, ImagePlus, Star,
  Sparkles, TrendingDown, Users, ArrowUpRight, MoreHorizontal,
  Play, BookMarked, Cpu, CheckSquare, Filter,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis,
  Radar, PieChart, Pie, Cell, Legend,
} from "recharts";
import { useNavigate } from "react-router-dom";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const API_URL = (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) || "http://localhost:5000";
const getToken = () => localStorage.getItem("token");
const apiFetch = async (path, opts = {}) => {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...opts,
    headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }), ...opts.headers },
  });
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
  return res.json();
};
const handleLogout = async () => {
  try { await apiFetch("/api/logout", { method: "POST" }); } catch {}
  finally { localStorage.removeItem("token"); localStorage.removeItem("user"); localStorage.removeItem("cybershield_stats"); window.location.href = "/login"; }
};

// ─── STATS HELPERS ────────────────────────────────────────────────────────────
const STATS_KEY = "cybershield_stats";
const getStats = () => { try { const r = localStorage.getItem(STATS_KEY); return r ? JSON.parse(r) : null; } catch { return null; } };
const saveStats = (s) => { try { localStorage.setItem(STATS_KEY, JSON.stringify(s)); } catch {} };
const defaultStats = () => ({
  score:0, xp:0, level:1, streak:0, lastActiveDate:null, quizzesDone:0,
  avgScore:0, totalQuizScore:0, phishingDone:0, phishingCorrect:0,
  threatsViewed:[], modulesCompleted:0, recentActivity:[], badges:[],
  phishingScore:0, malwareScore:0, networkScore:0, privacyScore:0, rank:"—", dept:"InfoSec",
});
const initStats = (user) => {
  const stored = getStats();
  if (stored) return stored;
  const base = { ...defaultStats(), score:user?.score??0, xp:user?.xp??0, level:user?.level??1, streak:user?.streak??0, quizzesDone:user?.quizzesDone??0, avgScore:user?.avgScore??0, dept:user?.department||"InfoSec" };
  saveStats(base); return base;
};
const updateStreakOnLogin = (stats) => {
  const today = new Date().toDateString();
  if (stats.lastLoginDate === today) return stats;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const newStreak = stats.lastLoginDate === yesterday ? stats.streak + 1 : 1;
  return { ...stats, streak: newStreak, lastLoginDate: today };
};

// ─── DESIGN TOKENS — Premium Light Theme ──────────────────────────────────────
const C = {
  // Backgrounds
  bg:        "#F5F7FF",
  bgPage:    "#EEF2FF",
  card:      "#FFFFFF",
  cardHov:   "#FAFBFF",
  sidebar:   "#0F172A",
  // Text
  ink:       "#0F172A",
  inkMd:     "#475569",
  inkLt:     "#94A3B8",
  inkXlt:    "#CBD5E1",
  // Brand palette
  brand:     "#4F46E5",       // Indigo
  brandLt:   "#EEF2FF",
  brandMd:   "#C7D2FE",
  teal:      "#0D9488",
  tealLt:    "#CCFBF1",
  violet:    "#7C3AED",
  violetLt:  "#EDE9FE",
  sky:       "#0284C7",
  skyLt:     "#E0F2FE",
  amber:     "#D97706",
  amberLt:   "#FEF3C7",
  red:       "#DC2626",
  redLt:     "#FEE2E2",
  green:     "#059669",
  greenLt:   "#D1FAE5",
  pink:      "#DB2777",
  pinkLt:    "#FCE7F3",
  // Borders & shadows
  border:    "#E2E8F0",
  borderMd:  "#CBD5E1",
  shadow:    "0 1px 3px rgba(15,23,42,0.06), 0 4px 12px rgba(15,23,42,0.05)",
  shadowMd:  "0 4px 20px rgba(15,23,42,0.10)",
  shadowLg:  "0 12px 40px rgba(15,23,42,0.14)",
  // Gradients
  gradBrand: "linear-gradient(135deg, #4338CA 0%, #6366F1 100%)",
  gradTeal:  "linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)",
  gradViolet:"linear-gradient(135deg, #6D28D9 0%, #8B5CF6 100%)",
  gradAmber: "linear-gradient(135deg, #B45309 0%, #F59E0B 100%)",
  gradGreen: "linear-gradient(135deg, #047857 0%, #10B981 100%)",
  gradRed:   "linear-gradient(135deg, #B91C1C 0%, #EF4444 100%)",
  gradPink:  "linear-gradient(135deg, #BE185D 0%, #EC4899 100%)",
  gradHero:  "linear-gradient(135deg, #1E1B4B 0%, #312E81 40%, #4338CA 100%)",
  gradSide:  "linear-gradient(180deg, #0F172A 0%, #1E293B 100%)",
};

// ─── GRADE CONFIG ─────────────────────────────────────────────────────────────
const GRADE = {
  "A+": { color:C.green,  bg:C.greenLt,  grad:C.gradGreen,  label:"Outstanding" },
  "A":  { color:C.brand,  bg:C.brandLt,  grad:C.gradBrand,  label:"Excellent"   },
  "B":  { color:C.violet, bg:C.violetLt, grad:C.gradViolet, label:"Well Done"   },
  "C":  { color:C.amber,  bg:C.amberLt,  grad:C.gradAmber,  label:"Good Effort" },
  "D":  { color:C.red,    bg:C.redLt,    grad:C.gradRed,    label:"Keep Going"  },
};

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Syne:wght@600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html,body,#root{height:100%;font-family:'Plus Jakarta Sans',sans-serif;background:${C.bg};color:${C.ink};-webkit-font-smoothing:antialiased}
    ::-webkit-scrollbar{width:4px;height:4px}
    ::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:${C.borderMd};border-radius:99px}
    button,input,select,textarea{font-family:inherit}
    button:focus,input:focus{outline:none}
    .mono{font-family:'JetBrains Mono',monospace}
    .display{font-family:'Syne',sans-serif}

    @keyframes fadeUp  {from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn  {from{opacity:0}to{opacity:1}}
    @keyframes slideIn {from{transform:translateX(20px);opacity:0}to{transform:translateX(0);opacity:1}}
    @keyframes pulse   {0%,100%{opacity:1}50%{opacity:.3}}
    @keyframes ping    {0%{transform:scale(1);opacity:.8}100%{transform:scale(2.4);opacity:0}}
    @keyframes spin    {to{transform:rotate(360deg)}}
    @keyframes shimmer {0%{background-position:-400px 0}100%{background-position:400px 0}}
    @keyframes countUp {from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    @keyframes barGrow {from{width:0}to{width:var(--w)}}
    @keyframes float   {0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
    @keyframes gradMove{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}

    .page-enter{animation:fadeUp .38s cubic-bezier(.16,1,.3,1)}
    .slide-in  {animation:slideIn .28s cubic-bezier(.16,1,.3,1)}
    .spin      {animation:spin .9s linear infinite}
    .float     {animation:float 3s ease-in-out infinite}

    .card{
      background:${C.card};border:1px solid ${C.border};border-radius:18px;
      box-shadow:${C.shadow};
      transition:box-shadow .2s,border-color .2s,transform .2s;
    }
    .card:hover{box-shadow:${C.shadowMd};border-color:${C.borderMd}}
    .card-click{cursor:pointer}
    .card-click:hover{transform:translateY(-3px);box-shadow:${C.shadowMd}}

    .btn{
      display:inline-flex;align-items:center;gap:7px;
      padding:9px 18px;border-radius:10px;border:none;cursor:pointer;
      font-size:13px;font-weight:600;font-family:'Plus Jakarta Sans',sans-serif;
      transition:all .16s;
    }
    .btn-primary{background:${C.gradBrand};color:#fff;box-shadow:0 4px 14px rgba(79,70,229,.3)}
    .btn-primary:hover{opacity:.9;transform:translateY(-1px);box-shadow:0 6px 20px rgba(79,70,229,.4)}
    .btn-primary:disabled{opacity:.5;cursor:not-allowed;transform:none}
    .btn-ghost{background:transparent;color:${C.inkMd};border:1px solid ${C.border}}
    .btn-ghost:hover{border-color:${C.brand};color:${C.brand};background:${C.brandLt}}

    .tag{
      display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:5px;
      font-size:10px;font-weight:700;font-family:'JetBrains Mono',monospace;letter-spacing:.04em;
    }

    .nav-btn{
      width:100%;display:flex;align-items:center;gap:10px;
      padding:9px 12px;border-radius:10px;border:none;cursor:pointer;
      background:transparent;color:rgba(255,255,255,0.5);
      font-size:12.5px;font-weight:500;font-family:'Plus Jakarta Sans',sans-serif;
      transition:all .14s;position:relative;
    }
    .nav-btn:hover{background:rgba(255,255,255,0.07);color:rgba(255,255,255,0.85)}
    .nav-btn.active{background:rgba(99,102,241,0.25);color:#fff;font-weight:700;border:1px solid rgba(99,102,241,0.35)}
    .nav-btn.active::before{content:'';position:absolute;left:0;top:50%;transform:translateY(-50%);width:3px;height:18px;background:#818CF8;border-radius:0 3px 3px 0}

    .stat-card{
      background:${C.card};border:1px solid ${C.border};border-radius:18px;
      padding:22px;box-shadow:${C.shadow};
      transition:all .2s;
    }
    .stat-card:hover{box-shadow:${C.shadowMd};transform:translateY(-3px);border-color:${C.borderMd}}

    .prog-wrap{width:100%;background:${C.bgPage};border-radius:99px;overflow:hidden}
    .prog-bar{height:100%;border-radius:99px;transition:width 1s cubic-bezier(.16,1,.3,1)}

    .skeleton{
      background:linear-gradient(90deg,${C.bgPage} 0%,${C.border} 50%,${C.bgPage} 100%);
      background-size:400px 100%;animation:shimmer 1.5s infinite;border-radius:8px;
    }
    .score-val{animation:countUp .45s cubic-bezier(.16,1,.3,1)}
    .activity-dot{width:7px;height:7px;border-radius:50%;background:${C.green};animation:pulse 2s ease infinite}
    .stripe-row:nth-child(even){background:${C.bgPage}}

    .notif-dismiss{width:22px;height:22px;border-radius:6px;border:none;cursor:pointer;background:transparent;color:${C.inkLt};display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s}
    .notif-dismiss:hover{background:${C.redLt};color:${C.red}}

    /* Gradient hero mesh */
    .hero-mesh{
      background:
        radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.15) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 20%, rgba(167,139,250,0.12) 0%, transparent 40%),
        radial-gradient(ellipse at 60% 80%, rgba(14,165,233,0.1) 0%, transparent 40%);
    }
    /* Dot pattern */
    .dot-pattern{
      background-image:radial-gradient(circle, rgba(99,102,241,0.15) 1.5px, transparent 1.5px);
      background-size:24px 24px;
    }

    /* Quiz history card hover */
    .qhist-card{transition:all .22s}
    .qhist-card:hover{transform:translateY(-4px);box-shadow:${C.shadowMd};border-color:${C.borderMd}}

    /* Custom tooltip */
    .ct-tooltip{background:#fff;border:1px solid ${C.border};border-radius:10px;padding:10px 14px;font-size:11px;box-shadow:${C.shadowMd}}
  `}</style>
);

// ─── STATIC DATA ──────────────────────────────────────────────────────────────
const THREATS = [
  { id:1, name:"LockBit 3.0 Ransomware",  type:"Ransomware",    sev:"Critical", date:"Jan 13", desc:"Most prolific RaaS. Self-propagation via SMB, data exfiltration before encryption. Avg ransom: $85k USD." },
  { id:2, name:"APT-29 Cozy Bear",         type:"APT",           sev:"Critical", date:"Jan 14", desc:"State-sponsored Russian group. Spear-phishing + supply chain attacks. Uses SUNBURST malware." },
  { id:3, name:"Log4Shell CVE-2021-44228", type:"Vulnerability", sev:"High",     date:"Jan 12", desc:"Still exploited in unpatched systems. RCE via JNDI injection in Apache Log4j2." },
  { id:4, name:"BEC — CEO Impersonation",  type:"Phishing",      sev:"Medium",   date:"Jan 09", desc:"Targeting Indian fintech CFOs. AI voice follow-ups. Avg loss: Rs 28 lakh." },
  { id:5, name:"SSH Brute-Force Campaign", type:"Network",       sev:"Low",      date:"Jan 07", desc:"45,000+ attempts from 312 Tor exit nodes. Block via fail2ban + IP reputation feeds." },
];
const SEV_C = {
  Critical:{ c:C.red,    bg:C.redLt    },
  High:    { c:"#EA580C",bg:"#FFF7ED"  },
  Medium:  { c:C.amber,  bg:C.amberLt  },
  Low:     { c:C.green,  bg:C.greenLt  },
};
const PHISHING_EMAILS = [
  { id:1, from:"PayPal Security",     sender:"security@paypa1.com",       subject:"Urgent: Verify your account",         time:"10:23 AM",  fish:true,  read:false, body:"Dear Customer,\n\nSuspicious activity detected on your PayPal account. It has been temporarily limited.\n\nVerify within 24 hours:\n-> http://paypa1-secure.xyz/login\n\nPayPal Security Team", flags:["Misspelled domain - paypa1.com not paypal.com","Urgent threatening language","Link goes to non-PayPal domain","Generic greeting","Artificial 24-hour deadline"] },
  { id:2, from:"GitHub",              sender:"noreply@github.com",         subject:"Your pull request #247 was merged",   time:"9:45 AM",   fish:false, read:true,  body:"Hi there,\n\nYour pull request #247 'Fix authentication middleware' was merged into main by jsmith.\n\nView: github.com/cybershield/platform\n\nThe GitHub Team", flags:[] },
  { id:3, from:"HR Department",       sender:"hr-noreply@comp4ny-hr.net",  subject:"Action Required: W-2 Form Update",    time:"Yesterday", fish:true,  read:false, body:"Dear Employee,\n\nAnnual tax filing requires you to update your W-2 information and banking details immediately.\n\nUpdate: http://comp4ny-hr.net/w2-update\n\nDeadline: End of today.", flags:["Unofficial lookalike domain","Requests sensitive banking details","Same-day deadline"] },
  { id:4, from:"State Bank of India", sender:"alerts@sbi-bank-secure.in", subject:"URGENT: KYC Update - Account Blocked", time:"2 days ago",fish:true,  read:false, body:"Dear Valued Customer,\n\nYour SBI account has been blocked due to incomplete KYC.\n\nTo unblock: http://sbi-kyc-update.in/verify\n\nProvide: Account No., Debit Card No., PIN, OTP", flags:["Fake domain - not sbi.co.in","Requests card + PIN + OTP","SBI never asks for PIN via email"] },
  { id:5, from:"Medium Daily Digest", sender:"newsletter@medium.com",      subject:"Your top stories for today",           time:"3 days ago",fish:false, read:true,  body:"Good morning,\n\nHere are your personalized stories:\n* The Future of Cybersecurity in 2025\n* Zero Trust Architecture Explained\n\nThe Medium Team", flags:[] },
];
const NAV = [
  { id:"dashboard",   label:"Overview",     icon:LayoutDashboard },
  { id:"threats",     label:"Threats",      icon:ShieldAlert     },
  { id:"learn",       label:"Learn",        icon:BookOpen,       route:"/learn" },
  { id:"phishing",    label:"Phishing Sim", icon:Mail            },
  { id:"quiz",        label:"Quiz",         icon:Brain,          route:"/quiz"  },
  { id:"game",        label:"Game",         icon:Gamepad2,       badge:"NEW",   route:"/game" },
  { id:"reports",     label:"Reports",      icon:BarChart2       },
  { id:"leaderboard", label:"Leaderboard",  icon:Trophy          },
  { id:"profile",     label:"Profile",      icon:User            },
  { id:"settings",    label:"Settings",     icon:Settings        },
];

// ─── HOOKS ────────────────────────────────────────────────────────────────────
function useUser() {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; } });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = getToken();
    if (!token) { setLoading(false); window.location.href = "/login"; return; }
    apiFetch("/api/me").then(data => { const u = data.user||data; setUser(u); localStorage.setItem("user", JSON.stringify(u)); })
      .catch(err => { if (err.message.includes("401")) { localStorage.removeItem("token"); localStorage.removeItem("user"); window.location.href = "/login"; } })
      .finally(() => setLoading(false));
  }, []);
  return { user, loading };
}

function useStats(user) {
  const [stats, setStatsRaw] = useState(() => user ? initStats(user) : defaultStats());
  const setStats = useCallback((updater) => {
    setStatsRaw(prev => { const next = typeof updater === "function" ? updater(prev) : updater; saveStats(next); return next; });
  }, []);
  useEffect(() => {
    if (user) setStatsRaw(prev => { const stored = getStats(); const base = stored || initStats(user); const ws = updateStreakOnLogin(base); saveStats(ws); return ws; });
  }, [user?._id]);
  const onQuizComplete = useCallback((score, total) => {
    const pct = Math.round((score / total) * 100); const pts = Math.round(pct * 2); const xp = Math.round(pct * 1.5);
    setStats(prev => {
      const newDone = prev.quizzesDone + 1; const newTS = prev.totalQuizScore + pct; const newAvg = Math.round(newTS / newDone);
      const newScore = prev.score + pts; const newXP = prev.xp + xp; const newLevel = Math.floor(newXP / 500) + 1;
      const newActivity = [{ msg:`Quiz completed — ${pct}% (${score}/${total})`, time:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}) }, ...prev.recentActivity].slice(0,20);
      const badges = [...(prev.badges||[])];
      if (newDone===1 && !badges.find(b=>b.label==="First Quiz")) badges.push({emoji:"🧠",label:"First Quiz"});
      if (pct>=90 && !badges.find(b=>b.label==="Quiz Ace")) badges.push({emoji:"⭐",label:"Quiz Ace"});
      if (newDone>=5 && !badges.find(b=>b.label==="Quizmaster")) badges.push({emoji:"🏆",label:"Quizmaster"});
      const updated = updateStreakOnLogin({...prev,score:newScore,xp:newXP,level:newLevel,quizzesDone:newDone,totalQuizScore:newTS,avgScore:newAvg,recentActivity:newActivity,phishingScore:Math.min(100,(prev.phishingScore||0)+Math.round(pct*0.3)),malwareScore:Math.min(100,(prev.malwareScore||0)+Math.round(pct*0.25)),privacyScore:Math.min(100,(prev.privacyScore||0)+Math.round(pct*0.2)),badges});
      saveStats(updated); return updated;
    });
  }, [setStats]);
  const onPhishingComplete = useCallback((correct, total) => {
    const pct = Math.round((correct/total)*100);
    setStats(prev => {
      const pts = Math.round(pct*1.5); const xp = Math.round(pct);
      const updated = {...prev,score:prev.score+pts,xp:prev.xp+xp,level:Math.floor((prev.xp+xp)/500)+1,phishingDone:prev.phishingDone+1,phishingCorrect:(prev.phishingCorrect||0)+correct,phishingScore:Math.min(100,(prev.phishingScore||0)+Math.round(pct*0.4)),recentActivity:[{msg:`Phishing sim — ${correct}/${total} correct`,time:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})},...prev.recentActivity].slice(0,20)};
      saveStats(updated); return updated;
    });
  }, [setStats]);
  const onThreatView = useCallback((threatId, threatName) => {
    setStats(prev => {
      if (prev.threatsViewed?.includes(threatId)) return prev;
      const updated = {...prev,threatsViewed:[...(prev.threatsViewed||[]),threatId],xp:prev.xp+10,score:prev.score+5,networkScore:Math.min(100,(prev.networkScore||0)+8),recentActivity:[{msg:`Threat analyzed: ${threatName}`,time:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})},...prev.recentActivity].slice(0,20)};
      saveStats(updated); return updated;
    });
  }, [setStats]);
  return { stats, setStats, onQuizComplete, onPhishingComplete, onThreatView };
}

function useLeaderboard(stats, user) {
  const [data, setData] = useState([]); const [loading, setLoading] = useState(true);
  const build = useCallback(() => {
    const me = { _id:user?._id||"me", name:dName(user), dept:stats?.dept||user?.department||"InfoSec", score:stats?.score||0, level:stats?.level||1, streak:stats?.streak||0, isMe:true };
    const peers = [{_id:"u1",name:"Priya Sharma",dept:"Network Sec",score:2840,level:6,streak:14},{_id:"u2",name:"Arjun Mehta",dept:"SOC Team",score:2650,level:5,streak:9},{_id:"u3",name:"Sneha Kulkarni",dept:"AppSec",score:2210,level:5,streak:7},{_id:"u4",name:"Ravi Gupta",dept:"Cloud Sec",score:1980,level:4,streak:5},{_id:"u5",name:"Anjali Patil",dept:"Compliance",score:1740,level:4,streak:3},{_id:"u6",name:"Vikram Singh",dept:"Red Team",score:1580,level:3,streak:11},{_id:"u7",name:"Pooja Nair",dept:"InfoSec",score:1320,level:3,streak:2}];
    return [...peers,me].sort((a,b)=>(b.score||0)-(a.score||0)).map((u,i)=>({...u,rank:i+1}));
  }, [stats?.score,stats?.level,stats?.streak,user]);
  const load = useCallback(() => {
    setLoading(true);
    apiFetch("/api/leaderboard").then(d=>{const a=d.leaderboard||d.data||d||[];setData(a.length>0?a:build());}).catch(()=>setData(build())).finally(()=>setLoading(false));
  }, [build]);
  useEffect(()=>{load();},[stats?.score]);
  return {data,loading,reload:load};
}

// ✅ Quiz history from MongoDB
function useQuizHistory() {
  const [history, setHistory] = useState([]); const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    const token = getToken();
    console.log("Quiz History fetch - token:", token ? "found" : "NULL - not logged in!");
    if (!token) { setLoading(false); return; }
    setLoading(true);
    try {
      const data = await apiFetch("/api/quiz/results");
      console.log("Quiz History API response:", data);
      if (data.success) {
        setHistory(data.results || []);
        console.log("Quiz History loaded:", data.results?.length, "records");
      } else {
        console.error("Quiz History API error:", data);
      }
    } catch(err) {
      console.error("Quiz History fetch failed:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
    // Re-fetch when user switches back to this tab
    window.addEventListener("focus", fetchHistory);
    return () => window.removeEventListener("focus", fetchHistory);
  }, [fetchHistory]);

  return { history, loading, refetch: fetchHistory };
}

// Notifications
const STATIC_NOTIFS = [
  { id:"sn1", icon:AlertTriangle, msg:"NEW CRITICAL: LockBit 3.0 variant active in your region", time:"2 min ago", unread:true, color:C.red },
  { id:"sn2", icon:Brain,         msg:"New quiz unlocked: Advanced Network Security",             time:"3 hrs ago", unread:true, color:C.violet },
  { id:"sn3", icon:Shield,        msg:"Security score improved this week — keep going!",          time:"2 days ago",unread:false,color:C.green },
];
const NOTIF_KEY = "cybershield_notifs";
function useNotifications() {
  const [notifs, setNotifsRaw] = useState(() => { try { const s=localStorage.getItem(NOTIF_KEY); return s?JSON.parse(s):STATIC_NOTIFS; } catch { return STATIC_NOTIFS; } });
  const shownMsgs = useRef(new Set(notifs.map(n=>n.msg))); const lastTime = useRef({});
  const setNotifs = useCallback((updater) => {
    setNotifsRaw(prev => { const next=typeof updater==="function"?updater(prev):updater; try{localStorage.setItem(NOTIF_KEY,JSON.stringify(next.slice(0,15)));}catch{} return next; });
  }, []);
  const addActivityNotif = useCallback((msg, color=C.green) => {
    if (shownMsgs.current.has(msg)) return;
    const prefix=msg.slice(0,20); const now=Date.now();
    if (lastTime.current[prefix] && now-lastTime.current[prefix]<30000) return;
    shownMsgs.current.add(msg); lastTime.current[prefix]=now;
    const id="act_"+now;
    setNotifs(prev=>{if(prev.some(n=>n.msg===msg))return prev;return [{id,icon:CheckCircle,msg,time:"Just now",unread:true,color},...prev].slice(0,15);});
  }, [setNotifs]);
  return { notifs, setNotifs, addActivityNotif };
}

// ─── UTILS ────────────────────────────────────────────────────────────────────
const dName    = u => u?.fullName||u?.name||u?.username||(u?.email?u.email.split("@")[0]:"User");
const initials = n => (n||"??").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
const fmtTime  = s => `${Math.floor(s/60)}m ${s%60}s`;
const fmtDate  = d => new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short"});

// ─── ATOMS ────────────────────────────────────────────────────────────────────
const Tag = ({label,color,bg}) => (
  <span className="tag" style={{background:bg||color+"14",color,border:`1px solid ${color}25`}}>{label}</span>
);

const Avatar = ({name,size=36,fontSize=13}) => {
  const grads = ["linear-gradient(135deg,#4338CA,#6366F1)","linear-gradient(135deg,#6D28D9,#8B5CF6)","linear-gradient(135deg,#0369A1,#0EA5E9)","linear-gradient(135deg,#047857,#10B981)","linear-gradient(135deg,#B91C1C,#EF4444)","linear-gradient(135deg,#BE185D,#EC4899)"];
  const idx = Math.abs((name||"U").charCodeAt(0)+((name||"U").charCodeAt(1)||0))%6;
  return <div style={{width:size,height:size,borderRadius:"50%",background:grads[idx],display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:"#fff",fontWeight:700,fontSize,letterSpacing:"0.02em"}}>{initials(name)}</div>;
};

const Prog = ({pct,color=C.brand,h=6}) => (
  <div className="prog-wrap" style={{height:h}}>
    <div className="prog-bar" style={{width:`${pct}%`,background:color,height:h}}/>
  </div>
);

const CTip = ({active,payload,label}) => {
  if (!active||!payload?.length) return null;
  return (
    <div className="ct-tooltip">
      <p style={{color:C.inkMd,marginBottom:4,fontWeight:600}}>{label}</p>
      {payload.map((p,i)=><p key={i} style={{color:p.color}}>{p.name}: <strong>{p.value}</strong></p>)}
    </div>
  );
};

const EmptyState = ({icon:Icon,title,desc,action,color=C.brand}) => (
  <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,padding:"36px 20px",textAlign:"center"}}>
    <div style={{width:52,height:52,borderRadius:14,background:color+"12",border:`1px solid ${color}20`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:4}}>
      <Icon size={22} style={{color}}/>
    </div>
    <p style={{fontSize:14,fontWeight:700,color:C.ink}}>{title}</p>
    <p style={{fontSize:12,color:C.inkMd,lineHeight:1.6,maxWidth:220}}>{desc}</p>
    {action}
  </div>
);

const SectionHead = ({title,sub,action}) => (
  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:22}}>
    <div>
      <h2 className="display" style={{fontSize:20,fontWeight:800,color:C.ink,marginBottom:3,letterSpacing:"-0.01em"}}>{title}</h2>
      {sub&&<p style={{fontSize:12,color:C.inkMd}}>{sub}</p>}
    </div>
    {action}
  </div>
);

const LiveDot = () => (
  <div style={{display:"flex",alignItems:"center",gap:5,padding:"3px 9px",borderRadius:99,background:C.redLt,border:`1px solid rgba(220,38,38,0.2)`}}>
    <div style={{position:"relative",width:6,height:6}}>
      <div style={{position:"absolute",inset:0,borderRadius:"50%",background:C.red,animation:"ping 1.5s infinite"}}/>
      <div style={{width:6,height:6,borderRadius:"50%",background:C.red}}/>
    </div>
    <span className="mono" style={{fontSize:9,fontWeight:600,color:C.red,letterSpacing:"0.1em"}}>LIVE</span>
  </div>
);

// ─── MINI CHART SPARKLINE ─────────────────────────────────────────────────────
const Sparkline = ({data,color}) => (
  <ResponsiveContainer width="100%" height={40}>
    <AreaChart data={data} margin={{top:2,right:0,left:0,bottom:0}}>
      <defs>
        <linearGradient id={`sg${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={color} stopOpacity={0.18}/>
          <stop offset="95%" stopColor={color} stopOpacity={0}/>
        </linearGradient>
      </defs>
      <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#sg${color.replace("#","")})`} dot={false}/>
    </AreaChart>
  </ResponsiveContainer>
);

// ══════════════════════════════════════════════════════════════════
// ✅ QUIZ HISTORY SECTION
// ══════════════════════════════════════════════════════════════════
function QuizHistorySection({history,loading,navigate,refetch}) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? history : history.slice(0,3);

  if (loading) return (
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
      {[1,2,3].map(i=><div key={i} className="skeleton" style={{height:130,borderRadius:16}}/>)}
    </div>
  );

  if (!history.length) return (
    <div style={{textAlign:"center",padding:"32px",background:C.bgPage,border:`2px dashed ${C.borderMd}`,borderRadius:16}}>
      <Brain size={32} style={{color:C.inkLt,marginBottom:12}}/>
      <p style={{fontSize:14,fontWeight:700,color:C.inkMd,marginBottom:4}}>No modules attempted yet</p>
      <p style={{fontSize:12,color:C.inkLt,marginBottom:16}}>Complete a quiz module to see your performance here</p>
      <button className="btn btn-primary" onClick={()=>navigate("/quiz")} style={{fontSize:12}}>
        <Brain size={13}/> Start First Quiz
      </button>
    </div>
  );

  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:history.length>3?12:0}}>
        {shown.map((r,i)=>{
          const g = GRADE[r.grade]||GRADE["D"];
          const sparkData = Array.from({length:7},(_,j)=>({v:Math.round(r.percentage*(0.5+j*0.08))}));
          return (
            <div key={r.moduleId} className="card qhist-card" style={{padding:18,animationDelay:`${i*0.06}s`,cursor:"pointer",position:"relative",overflow:"hidden"}}
              onClick={()=>navigate("/quiz")}>
              {/* Grade color strip top */}
              <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:g.grad}}/>

              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:10}}>
                <div style={{flex:1,minWidth:0}}>
                  <span className="mono" style={{fontSize:9,color:C.inkLt,letterSpacing:"0.07em"}}>MODULE {r.moduleId}</span>
                  <p style={{fontSize:12,fontWeight:700,color:C.ink,lineHeight:1.35,marginTop:2,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{r.moduleTitle}</p>
                </div>
                <div style={{marginLeft:10,flexShrink:0,textAlign:"right"}}>
                  <div style={{fontSize:24,fontWeight:800,color:g.color,lineHeight:1,fontFamily:"Syne"}}>{r.grade}</div>
                  <div style={{fontSize:9,color:g.color,fontWeight:600,marginTop:1}}>{g.label}</div>
                </div>
              </div>

              {/* Score bar */}
              <div style={{marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:C.inkMd,marginBottom:4}}>
                  <span>{r.totalCorrect}/{r.totalQuestions} correct</span>
                  <span style={{fontWeight:700,color:g.color}}>{r.percentage}%</span>
                </div>
                <div style={{height:5,background:C.bgPage,borderRadius:99,overflow:"hidden"}}>
                  <div style={{height:5,width:`${r.percentage}%`,background:g.grad,borderRadius:99,transition:"width 1s ease"}}/>
                </div>
              </div>

              {/* Sparkline */}
              <Sparkline data={sparkData} color={g.color}/>

              {/* Footer */}
              <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4}}>
                <Clock size={9} style={{color:C.inkLt}}/>
                <span style={{fontSize:10,color:C.inkLt}}>{fmtTime(r.timeSpent)}</span>
                <span style={{fontSize:10,color:C.inkXlt}}>·</span>
                <span style={{fontSize:10,color:C.inkLt}}>{fmtDate(r.updatedAt)}</span>
                <ArrowUpRight size={11} style={{color:C.brand,marginLeft:"auto"}}/>
              </div>
            </div>
          );
        })}
      </div>
      {history.length > 3 && (
        <button onClick={()=>setExpanded(!expanded)} className="btn btn-ghost" style={{width:"100%",justifyContent:"center",fontSize:12}}>
          {expanded?<><ChevronUp size={13}/> Show less</>:<><ChevronDown size={13}/> View all {history.length} attempts</>}
        </button>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// ✅ DASHBOARD PAGE — Premium Light Theme with Full Charts
// ══════════════════════════════════════════════════════════════════
function DashboardPage({user,stats,setPage,navigate,notifs,setNotifs,addActivityNotif}) {
  const fname  = dName(user).split(" ")[0];
  const today  = new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
  const score  = stats.score; const xp=stats.xp; const level=stats.level; const streak=stats.streak;
  const xpNext = level*500; const xpPct=Math.min(100,Math.round((xp/xpNext)*100));
  const isNew  = score===0&&xp===0;
  const secScore = Math.min(100,Math.round(score/30));
  const { history:quizHistory, loading:quizLoading, refetch:refetchQuiz } = useQuizHistory();

  const tips = ["Never reuse passwords across accounts.","Enable 2FA on every critical service.","Hover over links before clicking — verify the domain.","Keep your OS and software fully patched.","Public Wi-Fi? Always use a VPN."];
  const [tip] = useState(()=>tips[Math.floor(Math.random()*tips.length)]);

  const goTo = pageId => {
    if (pageId==="quiz") {navigate("/quiz");return;}
    if (pageId==="learn"){navigate("/learn");return;}
    if (pageId==="game") {navigate("/game");return;}
    setPage(pageId);
  };

  // ── Chart data ────────────────────────────────────────────────
  const weekData = [
    {d:"Mon",score:Math.max(0,score-120),quiz:Math.max(0,stats.quizzesDone-4)},
    {d:"Tue",score:Math.max(0,score-90), quiz:Math.max(0,stats.quizzesDone-3)},
    {d:"Wed",score:Math.max(0,score-60), quiz:Math.max(0,stats.quizzesDone-2)},
    {d:"Thu",score:Math.max(0,score-30), quiz:Math.max(0,stats.quizzesDone-1)},
    {d:"Fri",score:Math.max(0,score-10), quiz:stats.quizzesDone},
    {d:"Sat",score:Math.max(0,score-5),  quiz:stats.quizzesDone},
    {d:"Today",score,                    quiz:stats.quizzesDone},
  ];

  const domainData = [
    {subject:"Phishing",A:stats.phishingScore||0},
    {subject:"Malware",A:stats.malwareScore||0},
    {subject:"Network",A:stats.networkScore||0},
    {subject:"Privacy",A:stats.privacyScore||0},
  ];

  const pieData = [
    {name:"Quizzes",value:stats.quizzesDone||0,color:C.brand},
    {name:"Phishing Sims",value:stats.phishingDone||0,color:C.teal},
    {name:"Threats Viewed",value:stats.threatsViewed?.length||0,color:C.violet},
  ].filter(d=>d.value>0);

  const hasActivity = stats.quizzesDone>0||stats.phishingDone>0||(stats.threatsViewed?.length||0)>0;

  // Stat cards sparkline data
  const spark = (base,n=7)=>Array.from({length:n},(_,i)=>({v:Math.max(0,base-Math.round((n-1-i)*(base/n)*0.4)+Math.random()*5)}));

  return (
    <div style={{display:"flex",flexDirection:"column",gap:22}} className="page-enter">

      {/* ── HERO BANNER ── */}
      <div style={{borderRadius:22,padding:"30px 36px",position:"relative",overflow:"hidden",background:C.gradHero,boxShadow:"0 16px 48px rgba(67,56,202,0.35)"}}>
        <div className="dot-pattern" style={{position:"absolute",inset:0,opacity:.4}}/>
        <div className="hero-mesh" style={{position:"absolute",inset:0}}/>
        <div style={{position:"absolute",right:-60,top:-60,width:300,height:300,borderRadius:"50%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)"}}/>
        <div style={{position:"absolute",right:80,bottom:-80,width:200,height:200,borderRadius:"50%",background:"rgba(255,255,255,0.03)"}}/>
        <div style={{position:"absolute",right:0,top:0,opacity:.05}}><Shield size={280}/></div>

        <div style={{position:"relative",zIndex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
            <div style={{display:"flex",alignItems:"center",gap:6,background:"rgba(16,185,129,0.15)",border:"1px solid rgba(16,185,129,0.3)",borderRadius:99,padding:"3px 10px"}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:"#34D399",animation:"pulse 2s infinite"}}/>
              <span className="mono" style={{fontSize:9,fontWeight:600,color:"#34D399",letterSpacing:"0.12em"}}>SECURE SESSION</span>
            </div>
            <span style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>{today}</span>
          </div>

          <h1 style={{fontSize:32,fontWeight:800,color:"#fff",letterSpacing:"-0.02em",marginBottom:10,fontFamily:"Syne"}}>
            Good {new Date().getHours()<12?"morning":new Date().getHours()<17?"afternoon":"evening"},{" "}
            <span style={{background:"linear-gradient(90deg,#A5B4FC,#818CF8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{fname}</span> 👋
          </h1>

          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.15)",backdropFilter:"blur(8px)",borderRadius:10,padding:"7px 14px",marginBottom:20}}>
            <Zap size={12} style={{color:"#FCD34D",flexShrink:0}}/>
            <span style={{fontSize:12,color:"rgba(255,255,255,0.6)"}}>Security tip: </span>
            <span style={{fontSize:12,color:"rgba(255,255,255,0.9)",fontWeight:500}}>{tip}</span>
          </div>

          {isNew ? (
            <div style={{background:"rgba(255,255,255,0.1)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.18)",borderRadius:16,padding:"18px 24px",maxWidth:520}}>
              <p style={{fontSize:14,color:"#fff",fontWeight:700,marginBottom:6}}>🚀 Your cybersecurity journey starts here!</p>
              <p style={{fontSize:12,color:"rgba(255,255,255,0.7)",lineHeight:1.7,margin:0}}>Complete a quiz to earn XP and build your security score. Try the phishing simulator to sharpen your instincts.</p>
              <div style={{display:"flex",gap:10,marginTop:14}}>
                <button onClick={()=>goTo("quiz")} style={{background:"rgba(255,255,255,0.95)",color:C.brand,fontSize:12,padding:"9px 18px",borderRadius:10,border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:7,fontWeight:700}}>
                  <Brain size={14}/> Take Quiz
                </button>
                <button onClick={()=>setPage("phishing")} style={{background:"rgba(255,255,255,0.12)",color:"rgba(255,255,255,0.9)",fontSize:12,padding:"9px 18px",borderRadius:10,border:"1px solid rgba(255,255,255,0.2)",cursor:"pointer",display:"flex",alignItems:"center",gap:7,fontWeight:600}}>
                  <Mail size={14}/> Phishing Sim
                </button>
              </div>
            </div>
          ) : (
            <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
              {[
                {v:score,l:"Total Score",c:"#A5B4FC"},
                {v:`Lv.${level}`,l:"Level",c:"#C4B5FD"},
                {v:`${streak}d`,l:"Streak",c:"#FDA4AF"},
                {v:stats.quizzesDone,l:"Quizzes",c:"#6EE7B7"},
                {v:`${secScore}%`,l:"Security",c:"#7DD3FC"},
              ].map(({v,l,c},i)=>(
                <div key={i} style={{background:"rgba(255,255,255,0.12)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:12,padding:"10px 18px",textAlign:"center",minWidth:72}}>
                  <div className="score-val" style={{fontSize:20,fontWeight:800,color:c,fontFamily:"Syne"}}>{v}</div>
                  <div style={{fontSize:10,color:"rgba(255,255,255,0.5)",marginTop:2}}>{l}</div>
                </div>
              ))}
              <div style={{flex:1,minWidth:200,background:"rgba(255,255,255,0.08)",borderRadius:12,padding:"10px 16px"}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"rgba(255,255,255,0.5)",marginBottom:6}}>
                  <span>Level {level} progress</span>
                  <span className="mono" style={{color:"#A5B4FC"}}>{xp%500}/500 XP</span>
                </div>
                <div style={{height:6,background:"rgba(255,255,255,0.15)",borderRadius:99}}>
                  <div style={{width:`${xpPct}%`,height:6,background:"linear-gradient(90deg,#818CF8,#A78BFA)",borderRadius:99,transition:"width 1s ease"}}/>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
        {[
          {icon:Brain,         label:"Take a Quiz",        sub:"Test knowledge · Earn XP",       color:C.brand,  page:"quiz",  grad:C.gradBrand, shadowC:"rgba(79,70,229,0.25)"},
          {icon:GraduationCap, label:"Browse Courses",     sub:"Structured learning with labs",  color:C.sky,    page:"learn", grad:"linear-gradient(135deg,#0369A1,#0EA5E9)", shadowC:"rgba(3,105,161,0.25)"},
          {icon:Gamepad2,      label:"Play CyberDefense",  sub:"Defeat real-world threats",      color:C.teal,   page:"game",  grad:C.gradTeal, shadowC:"rgba(13,148,136,0.25)"},
        ].map(item=>(
          <button key={item.label} onClick={()=>goTo(item.page)}
            style={{padding:20,border:`1px solid ${C.border}`,textAlign:"left",cursor:"pointer",background:C.card,borderRadius:18,boxShadow:C.shadow,transition:"all .22s",position:"relative",overflow:"hidden"}}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=`${C.shadowMd},0 0 0 1px ${item.color}20`;e.currentTarget.style.borderColor=`${item.color}30`;}}
            onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow=C.shadow;e.currentTarget.style.borderColor=C.border;}}>
            <div style={{position:"absolute",top:-30,right:-30,width:100,height:100,borderRadius:"50%",background:item.color,opacity:.05,filter:"blur(16px)"}}/>
            <div style={{width:46,height:46,borderRadius:13,background:item.grad,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14,boxShadow:`0 4px 16px ${item.shadowC}`}}>
              <item.icon size={21} style={{color:"#fff"}}/>
            </div>
            <p style={{fontSize:14,fontWeight:700,color:C.ink,margin:"0 0 4px"}}>{item.label}</p>
            <p style={{fontSize:11,color:C.inkMd,margin:0}}>{item.sub}</p>
            <ArrowRight size={13} style={{position:"absolute",bottom:18,right:18,color:C.inkLt,opacity:.6}}/>
          </button>
        ))}
      </div>

      {/* ── STAT CARDS with sparklines ── */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}}>
        {[
          {label:"Total Score",     value:score,              change:"+12%",  up:true,  color:C.brand,  icon:Star,    spark:spark(score)},
          {label:"Avg Quiz Score",  value:stats.avgScore>0?`${stats.avgScore}%`:"—", change:stats.avgScore>=70?"+Good":"New", up:stats.avgScore>=70, color:C.violet, icon:Brain, spark:spark(stats.avgScore)},
          {label:"Login Streak",    value:`${streak} days`,   change:streak>=3?"🔥 Hot":"Keep going", up:streak>=3, color:C.amber, icon:Flame, spark:spark(streak*10)},
          {label:"Security Score",  value:`${secScore}%`,     change:secScore>=60?"Protected":"Needs work", up:secScore>=60, color:C.green, icon:Shield, spark:spark(secScore)},
        ].map((s,i)=>(
          <div key={i} className="stat-card" style={{position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:-20,right:-20,width:80,height:80,borderRadius:"50%",background:s.color+"08",filter:"blur(16px)"}}/>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
              <div style={{width:38,height:38,borderRadius:10,background:s.color+"12",border:`1px solid ${s.color}18`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <s.icon size={16} style={{color:s.color}}/>
              </div>
              <span style={{fontSize:10,fontWeight:600,color:s.up?C.green:C.inkLt,display:"flex",alignItems:"center",gap:3}}>
                {s.up?<TrendingUp size={10}/>:<TrendingDown size={10}/>}{s.change}
              </span>
            </div>
            <div className="score-val" style={{fontSize:24,fontWeight:800,color:C.ink,letterSpacing:"-0.02em",marginBottom:2,fontFamily:"Syne"}}>{s.value}</div>
            <div style={{fontSize:11,color:C.inkMd,marginBottom:10}}>{s.label}</div>
            <Sparkline data={s.spark} color={s.color}/>
          </div>
        ))}
      </div>

      {/* ── CHARTS ROW ── */}
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:18}}>

        {/* Weekly Activity Bar Chart */}
        <div className="card" style={{padding:22}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
            <div>
              <h3 className="display" style={{fontSize:15,fontWeight:700,color:C.ink,margin:0}}>Weekly Activity</h3>
              <p style={{fontSize:11,color:C.inkMd,margin:"2px 0 0"}}>Score progression this week</p>
            </div>
            <div style={{display:"flex",gap:14}}>
              {[{c:C.brand,l:"Score"},{c:C.teal,l:"Quizzes"}].map(d=>(
                <div key={d.l} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:C.inkMd}}>
                  <div style={{width:8,height:8,borderRadius:2,background:d.c}}/>
                  {d.l}
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weekData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
              <XAxis dataKey="d" tick={{fontSize:11,fill:C.inkMd}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10,fill:C.inkMd}} axisLine={false} tickLine={false}/>
              <Tooltip content={<CTip/>}/>
              <Bar dataKey="score" name="Score" fill={C.brand} radius={[6,6,0,0]} maxBarSize={32}/>
              <Bar dataKey="quiz" name="Quizzes" fill={C.teal} radius={[6,6,0,0]} maxBarSize={32}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Domain Radar */}
        <div className="card" style={{padding:22}}>
          <div style={{marginBottom:16}}>
            <h3 className="display" style={{fontSize:15,fontWeight:700,color:C.ink,margin:0}}>Domain Mastery</h3>
            <p style={{fontSize:11,color:C.inkMd,margin:"2px 0 0"}}>Skill coverage across domains</p>
          </div>
          {hasActivity ? (
            <ResponsiveContainer width="100%" height={180}>
              <RadarChart data={domainData}>
                <PolarGrid stroke={C.border}/>
                <PolarAngleAxis dataKey="subject" tick={{fontSize:10,fill:C.inkMd}}/>
                <Radar name="Score" dataKey="A" stroke={C.brand} fill={C.brand} fillOpacity={0.15} strokeWidth={2}/>
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState icon={Target} title="No data yet" desc="Complete activities to unlock domain mastery radar." color={C.brand}/>
          )}
        </div>
      </div>

      {/* ── ACTIVITY PIE + SCORE TREND ── */}
      {hasActivity && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:18}}>

          {/* Activity Breakdown Pie */}
          <div className="card" style={{padding:22}}>
            <div style={{marginBottom:16}}>
              <h3 className="display" style={{fontSize:15,fontWeight:700,color:C.ink,margin:0}}>Activity Mix</h3>
              <p style={{fontSize:11,color:C.inkMd,margin:"2px 0 0"}}>What you've been doing</p>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {pieData.map((entry,i)=><Cell key={i} fill={entry.color}/>)}
                </Pie>
                <Tooltip content={<CTip/>}/>
              </PieChart>
            </ResponsiveContainer>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {pieData.map((d,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:11}}>
                  <div style={{display:"flex",alignItems:"center",gap:7}}><div style={{width:8,height:8,borderRadius:2,background:d.color}}/><span style={{color:C.inkMd}}>{d.name}</span></div>
                  <span style={{fontWeight:700,color:C.ink}}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Score Trend Line */}
          <div className="card" style={{padding:22}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
              <div>
                <h3 className="display" style={{fontSize:15,fontWeight:700,color:C.ink,margin:0}}>Score Trend</h3>
                <p style={{fontSize:11,color:C.inkMd,margin:"2px 0 0"}}>7-day performance trajectory</p>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:20,fontWeight:800,color:C.brand,fontFamily:"Syne"}}>{score}</div>
                <div style={{fontSize:10,color:C.green,display:"flex",alignItems:"center",gap:3,justifyContent:"flex-end"}}><TrendingUp size={10}/> Total pts</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={weekData}>
                <defs>
                  <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.brand} stopOpacity={0.15}/>
                    <stop offset="95%" stopColor={C.brand} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
                <XAxis dataKey="d" tick={{fontSize:11,fill:C.inkMd}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:10,fill:C.inkMd}} axisLine={false} tickLine={false}/>
                <Tooltip content={<CTip/>}/>
                <Area type="monotone" dataKey="score" name="Score" stroke={C.brand} strokeWidth={2.5} fill="url(#sg)" dot={{fill:C.brand,r:3}} activeDot={{r:5}}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── QUIZ HISTORY FROM MONGODB ✅ ── */}
      <div className="card" style={{padding:22}}>
        <SectionHead
          title="Quiz History"
          sub="Your attempted modules — synced from MongoDB"
          action={
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              {!quizLoading && quizHistory.length>0 && (
                <div style={{display:"flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:8,background:C.brandLt,border:`1px solid ${C.brandMd}`}}>
                  <CheckSquare size={11} style={{color:C.brand}}/>
                  <span style={{fontSize:11,fontWeight:600,color:C.brand}}>{quizHistory.length} completed</span>
                </div>
              )}
              <button onClick={refetchQuiz} className="btn btn-ghost" style={{fontSize:12,padding:"7px 14px"}}>
                <RefreshCw size={12}/> Refresh
              </button>
              <button className="btn btn-primary" onClick={()=>navigate("/quiz")} style={{fontSize:12,padding:"7px 14px"}}>
                <Brain size={12}/> New Quiz
              </button>
            </div>
          }
        />
        <QuizHistorySection history={quizHistory} loading={quizLoading} navigate={navigate} refetch={refetchQuiz}/>
      </div>

      {/* ── LOWER: Threat Feed + Activity ── */}
      <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:18}}>

        {/* Threats */}
        <div className="card" style={{padding:22}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <ShieldAlert size={15} style={{color:C.red}}/>
              <h3 className="display" style={{fontSize:14,fontWeight:700,color:C.ink,margin:0}}>Live Threat Feed</h3>
            </div>
            <LiveDot/>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:9}}>
            {THREATS.slice(0,4).map(t=>{
              const sc=SEV_C[t.sev];
              return (
                <div key={t.id} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"11px 14px",borderRadius:12,background:C.bgPage,border:`1px solid ${C.border}`,borderLeft:`3px solid ${sc.c}`,transition:"all .15s",cursor:"pointer"}}
                  onMouseEnter={e=>{e.currentTarget.style.background=sc.bg;e.currentTarget.style.borderColor=sc.c+"40";}}
                  onMouseLeave={e=>{e.currentTarget.style.background=C.bgPage;e.currentTarget.style.borderColor=C.border;}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:4}}>
                      <span style={{fontSize:12,fontWeight:700,color:C.ink}}>{t.name}</span>
                      <Tag label={t.sev} color={sc.c} bg={sc.bg}/>
                    </div>
                    <p style={{fontSize:11,color:C.inkMd,margin:0,lineHeight:1.5}}>{t.desc.slice(0,80)}...</p>
                  </div>
                  <span className="mono" style={{fontSize:9,color:C.inkLt,flexShrink:0}}>{t.date}</span>
                </div>
              );
            })}
          </div>
          <button className="btn btn-ghost" onClick={()=>setPage("threats")} style={{marginTop:12,width:"100%",justifyContent:"center",fontSize:12}}>
            View All Threats <ArrowRight size={12}/>
          </button>
        </div>

        {/* Right col: Activity + Badges */}
        <div style={{display:"flex",flexDirection:"column",gap:14}}>

          {/* Recent Activity */}
          <div className="card" style={{padding:20,flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
              <Activity size={14} style={{color:C.teal}}/>
              <h3 className="display" style={{fontSize:14,fontWeight:700,color:C.ink,margin:0}}>Recent Activity</h3>
              {stats.recentActivity?.length>0&&<div className="activity-dot"/>}
            </div>
            {!stats.recentActivity?.length ? (
              <EmptyState icon={Rocket} title="No activity yet" desc="Complete a quiz or phishing sim." color={C.teal}
                action={<button className="btn btn-primary" onClick={()=>goTo("quiz")} style={{fontSize:11,padding:"7px 14px"}}><Brain size={12}/> Quiz</button>}
              />
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:9}}>
                {stats.recentActivity.slice(0,5).map((a,i)=>(
                  <div key={i} className="slide-in" style={{display:"flex",alignItems:"flex-start",gap:9}}>
                    <div style={{width:28,height:28,borderRadius:8,background:C.brandLt,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <CheckCircle size={12} style={{color:C.brand}}/>
                    </div>
                    <div style={{flex:1}}>
                      <p style={{fontSize:11,color:C.inkMd,margin:0,lineHeight:1.45}}>{a.msg||a}</p>
                      <p className="mono" style={{fontSize:9,color:C.inkLt,margin:"1px 0 0"}}>{a.time||""}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Badges */}
          {stats.badges?.length>0 && (
            <div className="card" style={{padding:18}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                <Award size={14} style={{color:C.amber}}/>
                <h3 className="display" style={{fontSize:13,fontWeight:700,color:C.ink,margin:0}}>Badges Earned</h3>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {stats.badges.map((b,i)=>(
                  <div key={i} style={{textAlign:"center",padding:"8px 10px",background:C.amberLt,border:`1px solid rgba(217,119,6,0.15)`,borderRadius:10}}>
                    <div style={{fontSize:18}}>{b.emoji||"🏅"}</div>
                    <p style={{fontSize:9,color:C.inkMd,marginTop:3,fontWeight:600}}>{b.label||b}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── NOTIFICATIONS ── */}
      {notifs.length>0&&(
        <div className="card" style={{padding:20}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <Bell size={14} style={{color:C.amber}}/>
              <h3 className="display" style={{fontSize:14,fontWeight:700,color:C.ink,margin:0}}>Notifications</h3>
              {notifs.filter(n=>n.unread).length>0&&<Tag label={`${notifs.filter(n=>n.unread).length} new`} color={C.amber} bg={C.amberLt}/>}
            </div>
            <button onClick={()=>setNotifs([])} style={{fontSize:11,fontWeight:600,color:C.inkLt,background:"none",border:"none",cursor:"pointer"}}>Clear all</button>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {notifs.map(n=>(
              <div key={n.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderRadius:11,background:n.unread?n.color+"08":C.bgPage,border:`1px solid ${n.unread?n.color+"20":C.border}`}}>
                <div style={{width:30,height:30,borderRadius:8,background:n.color+"12",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <n.icon size={13} style={{color:n.color}}/>
                </div>
                <p style={{fontSize:12,color:n.unread?C.ink:C.inkMd,flex:1,margin:0,fontWeight:n.unread?600:400}}>{n.msg}</p>
                <span className="mono" style={{fontSize:9,color:C.inkLt,flexShrink:0}}>{n.time}</span>
                {n.unread&&<div style={{width:7,height:7,borderRadius:"50%",background:n.color,flexShrink:0}}/>}
                <button className="notif-dismiss" onClick={()=>setNotifs(prev=>prev.filter(x=>x.id!==n.id))}><X size={11}/></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// OTHER PAGES (same logic, light theme styling)
// ══════════════════════════════════════════════════════════════════
function ThreatsPage({stats,onThreatView}) {
  const [filter,setFilter]=useState("All");const [exp,setExp]=useState(null);
  const list=THREATS.filter(t=>filter==="All"||t.sev===filter);
  const handleExpand=(t)=>{const o=exp!==t.id;setExp(o?t.id:null);if(o)onThreatView(t.id,t.name);};
  return (
    <div className="page-enter">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:22}}>
        <div><SectionHead title="Threat Intelligence" sub="Real-time IOCs, MITRE ATT&CK mapping, and security advisories"/><Tag label={`${stats.threatsViewed?.length||0} analyzed`} color={C.teal} bg={C.tealLt}/></div>
        <LiveDot/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        {[["Critical",C.red,C.redLt,"2"],["High","#EA580C","#FFF7ED","5"],["Medium",C.amber,C.amberLt,"1"],["Low",C.green,C.greenLt,"0"]].map(([s,c,bg,n])=>(
          <div key={s} onClick={()=>setFilter(filter===s?"All":s)} className="card card-click" style={{padding:16,textAlign:"center",background:filter===s?bg:C.card,borderColor:filter===s?`${c}40`:C.border}}>
            <div style={{fontSize:26,fontWeight:800,color:c,fontFamily:"Syne"}}>{n}</div><div style={{fontSize:11,color:C.inkMd,marginTop:3}}>{s}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:7,marginBottom:18}}>
        {["All","Critical","High","Medium","Low"].map(s=>(
          <button key={s} onClick={()=>setFilter(s)} style={{padding:"6px 14px",borderRadius:8,fontSize:11,fontWeight:600,cursor:"pointer",border:`1px solid ${filter===s?C.brand+"50":C.border}`,background:filter===s?C.brandLt:"transparent",color:filter===s?C.brand:C.inkMd,transition:"all .15s"}}>{s}</button>
        ))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {list.map(t=>{
          const sc=SEV_C[t.sev];const open=exp===t.id;const viewed=stats.threatsViewed?.includes(t.id);
          return (
            <div key={t.id} className="card" style={{overflow:"hidden",borderLeft:`3px solid ${sc.c}`}}>
              <div style={{padding:"13px 20px",cursor:"pointer",display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:16}} onClick={()=>handleExpand(t)}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5,flexWrap:"wrap"}}>
                    <span style={{fontSize:13,fontWeight:700,color:C.ink}}>{t.name}</span>
                    <Tag label={t.sev} color={sc.c} bg={sc.bg}/><Tag label={t.type} color={C.inkMd} bg={C.bgPage}/>
                    {viewed&&<Tag label="✓ Analyzed" color={C.green} bg={C.greenLt}/>}
                  </div>
                  <p style={{fontSize:12,color:C.inkMd,margin:0}}>{open?t.desc:t.desc.slice(0,90)+"..."}</p>
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0}}>
                  <span className="mono" style={{fontSize:9,color:C.inkLt}}>{t.date}</span>
                  <div style={{width:24,height:24,borderRadius:7,background:sc.bg,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    {open?<ChevronUp size={12} style={{color:sc.c}}/>:<ChevronDown size={12} style={{color:sc.c}}/>}
                  </div>
                </div>
              </div>
              {open&&(
                <div style={{padding:"0 20px 16px",borderTop:`1px solid ${C.border}`}}>
                  <p style={{fontSize:12,color:C.inkMd,lineHeight:1.75,margin:"14px 0"}}>{t.desc}</p>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    {["Full Report","MITRE ATT&CK","IOCs"].map(b=><button key={b} className="btn btn-ghost" style={{fontSize:11}}>{b}</button>)}
                    <span className="mono" style={{fontSize:10,color:C.green,marginLeft:"auto"}}>+10 XP earned</span>
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

function PhishingPage({onPhishingComplete,addActivityNotif}) {
  const [sel,setSel]=useState(null);const [ans,setAns]=useState({});
  const completedRef=useRef(false);
  const done=Object.keys(ans).length;const ok=Object.values(ans).filter(a=>a.ok).length;
  const handleAnswer=(emailId,isPhishGuess,emailIsFish)=>{
    const correct=isPhishGuess===emailIsFish;const newAns={...ans,[emailId]:{ok:correct,pick:isPhishGuess}};setAns(newAns);
    if(Object.keys(newAns).length===PHISHING_EMAILS.length&&!completedRef.current){
      completedRef.current=true;const cc=Object.values(newAns).filter(a=>a.ok).length;
      onPhishingComplete(cc,PHISHING_EMAILS.length);addActivityNotif(`Phishing sim — ${cc}/${PHISHING_EMAILS.length} correct`,C.green);
    }
  };
  return (
    <div className="page-enter">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:22}}>
        <SectionHead title="Phishing Simulator" sub="Identify phishing attacks in real-world email samples"/>
        <div style={{display:"flex",gap:10}}>
          {[["Analyzed",`${done}/${PHISHING_EMAILS.length}`,C.brand],["Correct",ok,C.green],["Accuracy",done?Math.round(ok/done*100)+"%":"—",C.violet]].map(([l,v,c])=>(
            <div key={l} style={{textAlign:"center",background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"10px 16px",boxShadow:C.shadow}}>
              <div style={{fontSize:18,fontWeight:800,color:c,fontFamily:"Syne"}}>{v}</div><div style={{fontSize:10,color:C.inkMd}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"280px 1fr",gap:16}}>
        <div className="card" style={{overflow:"hidden"}}>
          <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span style={{fontSize:12,fontWeight:700,color:C.ink}}>Inbox</span>
            <Tag label={`${PHISHING_EMAILS.filter(e=>!ans[e.id]).length} pending`} color={C.brand} bg={C.brandLt}/>
          </div>
          {PHISHING_EMAILS.map(email=>{
            const a=ans[email.id];
            return (
              <div key={email.id} onClick={()=>setSel(email)} style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}30`,cursor:"pointer",background:sel?.id===email.id?C.brandLt:"transparent",borderLeft:`3px solid ${sel?.id===email.id?C.brand:"transparent"}`,transition:"all .12s"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                  <span style={{fontSize:12,fontWeight:!a?700:400,color:C.ink}}>{email.from}</span>
                  <span className="mono" style={{fontSize:9,color:C.inkLt}}>{email.time}</span>
                </div>
                <p style={{fontSize:11,color:C.inkMd,margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{email.subject}</p>
                {a&&<div style={{display:"flex",alignItems:"center",gap:4,marginTop:4,fontSize:10,fontWeight:700,color:a.ok?C.green:C.red}}>{a.ok?<CheckCircle size={10}/>:<XCircle size={10}/>}{a.ok?"Correct":"Incorrect"}</div>}
              </div>
            );
          })}
        </div>
        {sel?(
          <div className="card" style={{overflow:"hidden"}}>
            <div style={{padding:"14px 20px",borderBottom:`1px solid ${C.border}`,background:sel.fish?C.redLt+"60":C.greenLt+"60"}}>
              <h4 style={{fontSize:13,fontWeight:700,color:C.ink,margin:"0 0 5px"}}>{sel.subject}</h4>
              <div className="mono" style={{display:"flex",gap:14,fontSize:10,color:C.inkMd}}><span><strong>From:</strong> {sel.sender}</span><span>{sel.time}</span></div>
            </div>
            <div style={{padding:"18px 20px"}}><pre style={{fontSize:13,color:C.inkMd,whiteSpace:"pre-wrap",fontFamily:"Plus Jakarta Sans,sans-serif",lineHeight:1.75}}>{sel.body}</pre></div>
            {!ans[sel.id]?(
              <div style={{padding:"14px 20px",borderTop:`1px solid ${C.border}`}}>
                <p style={{fontSize:12,fontWeight:700,color:C.ink,margin:"0 0 10px"}}>Is this email legitimate or phishing?</p>
                <div style={{display:"flex",gap:10}}>
                  <button className="btn" onClick={()=>handleAnswer(sel.id,true,sel.fish)} style={{flex:1,justifyContent:"center",background:C.redLt,color:C.red,border:`1px solid rgba(220,38,38,0.2)`,borderRadius:10}}><AlertTriangle size={13}/> Phishing</button>
                  <button className="btn" onClick={()=>handleAnswer(sel.id,false,sel.fish)} style={{flex:1,justifyContent:"center",background:C.greenLt,color:C.green,border:`1px solid rgba(5,150,105,0.2)`,borderRadius:10}}><CheckCircle size={13}/> Legitimate</button>
                </div>
              </div>
            ):(
              <div style={{padding:"14px 20px",borderTop:`1px solid ${C.border}`}}>
                <div style={{borderRadius:12,padding:"14px 16px",background:ans[sel.id].ok?C.greenLt:C.redLt,border:`1px solid ${ans[sel.id].ok?"rgba(5,150,105,0.2)":"rgba(220,38,38,0.2)"}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,fontWeight:700,fontSize:13,marginBottom:10,color:ans[sel.id].ok?C.green:C.red}}>{ans[sel.id].ok?<CheckCircle size={16}/>:<XCircle size={16}/>}{ans[sel.id].ok?"Correct!":` Incorrect — This was ${sel.fish?"PHISHING":"LEGITIMATE"}`}</div>
                  {sel.fish&&sel.flags.map((f,i)=><div key={i} style={{display:"flex",gap:7,fontSize:11,color:C.inkMd,marginBottom:5}}><AlertCircle size={12} style={{color:C.red,flexShrink:0,marginTop:1}}/>{f}</div>)}
                </div>
              </div>
            )}
          </div>
        ):(
          <div className="card" style={{display:"flex",alignItems:"center",justifyContent:"center"}}><EmptyState icon={Mail} title="Select an email" desc="Click any email to begin analysis. Each correct answer earns XP!" color={C.brand}/></div>
        )}
      </div>
      {completedRef.current&&(
        <div style={{marginTop:16,padding:"18px 24px",background:C.greenLt,border:`1px solid rgba(5,150,105,0.2)`,borderRadius:16,display:"flex",alignItems:"center",gap:16}}>
          <CheckCircle size={28} style={{color:C.green,flexShrink:0}}/>
          <div><p style={{fontSize:14,fontWeight:700,color:C.green,margin:"0 0 4px"}}>Simulation Complete! 🎉</p><p style={{fontSize:12,color:C.inkMd,margin:0}}>You scored {ok}/{PHISHING_EMAILS.length} — XP and score have been updated!</p></div>
        </div>
      )}
    </div>
  );
}

function ReportsPage({stats,setPage}) {
  const hasData=stats.quizzesDone>0||stats.phishingDone>0||(stats.threatsViewed?.length||0)>0;
  if(!hasData) return(<div className="page-enter"><SectionHead title="Reports & Analytics" sub="Your performance insights will appear here as you progress"/><div className="card" style={{padding:60}}><EmptyState icon={BarChart2} title="No data yet" desc="Complete quizzes, phishing sims, or analyze threats to unlock your analytics." color={C.brand} action={<button className="btn btn-primary" style={{marginTop:8}} onClick={()=>setPage("quiz")}><Rocket size={13}/> Start with a Quiz</button>}/></div></div>);
  const base=Math.max(0,stats.score-50);
  const monthly=[{m:"Sep",s:Math.max(0,base-120)},{m:"Oct",s:Math.max(0,base-80)},{m:"Nov",s:Math.max(0,base-50)},{m:"Dec",s:Math.max(0,base-20)},{m:"Jan",s:Math.max(0,base-5)},{m:"Now",s:stats.score}];
  return (
    <div className="page-enter">
      <SectionHead title="Reports & Analytics" sub="Your live performance insights and security metrics"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        {[{l:"Total Score",v:stats.score,c:C.brand},{l:"Quizzes Done",v:stats.quizzesDone,c:C.violet},{l:"Avg Score",v:`${stats.avgScore}%`,c:C.teal},{l:"Threats Viewed",v:stats.threatsViewed?.length||0,c:C.red}].map(s=>(
          <div key={s.l} className="stat-card" style={{textAlign:"center"}}>
            <div className="score-val" style={{fontSize:24,fontWeight:800,color:s.c,fontFamily:"Syne"}}>{s.v}</div>
            <div style={{fontSize:11,color:C.inkMd,marginTop:4}}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:18}}>
        <div className="card" style={{padding:22}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}><BarChart2 size={14} style={{color:C.brand}}/><span className="display" style={{fontSize:14,fontWeight:700,color:C.ink}}>Score Growth</span></div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthly}>
              <defs><linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.brand} stopOpacity={0.2}/><stop offset="95%" stopColor={C.brand} stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/><XAxis dataKey="m" tick={{fontSize:10,fill:C.inkMd}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:10,fill:C.inkMd}} axisLine={false} tickLine={false}/>
              <Tooltip content={<CTip/>}/><Area type="monotone" dataKey="s" name="Score" stroke={C.brand} strokeWidth={2.5} fill="url(#rg)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card" style={{padding:22}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}><Target size={14} style={{color:C.teal}}/><span className="display" style={{fontSize:14,fontWeight:700,color:C.ink}}>Domain Mastery</span></div>
          {[{label:"Phishing",pct:stats.phishingScore||0,color:C.brand},{label:"Malware",pct:stats.malwareScore||0,color:C.violet},{label:"Network",pct:stats.networkScore||0,color:C.teal},{label:"Privacy",pct:stats.privacyScore||0,color:C.green}].map((d,i)=>(
            <div key={i} style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:5}}><span style={{color:C.inkMd}}>{d.label}</span><span className="mono" style={{fontWeight:600,color:d.color}}>{d.pct}%</span></div>
              <Prog pct={d.pct} color={d.color} h={7}/>
            </div>
          ))}
        </div>
      </div>
      {stats.recentActivity?.length>0&&(
        <div className="card" style={{padding:22}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}><Clock size={14} style={{color:C.amber}}/><span className="display" style={{fontSize:14,fontWeight:700,color:C.ink}}>Activity Log</span></div>
          {stats.recentActivity.slice(0,10).map((a,i)=>(
            <div key={i} className="stripe-row" style={{display:"flex",alignItems:"center",gap:12,padding:"10px 4px"}}>
              <CheckCircle size={13} style={{color:C.brand,flexShrink:0}}/><span style={{fontSize:12,color:C.inkMd,flex:1}}>{a.msg||a}</span><span className="mono" style={{fontSize:10,color:C.inkLt}}>{a.time||""}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LeaderboardPage({user,stats}) {
  const {data:lbData,loading,reload}=useLeaderboard(stats,user);const top3=lbData.slice(0,3);
  return (
    <div className="page-enter">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:22}}>
        <SectionHead title="Leaderboard" sub="Top cybersecurity defenders — live scores updated on activity"/>
        <button className="btn btn-ghost" onClick={reload} style={{fontSize:12,gap:6}}><RefreshCw size={13} className={loading?"spin":""}/> Refresh</button>
      </div>
      {loading?<div style={{display:"flex",flexDirection:"column",gap:10}}>{[1,2,3].map(i=><div key={i} className="skeleton" style={{height:64,borderRadius:14}}/>)}</div>:(
        <>
          {top3.length>=2&&(
            <div style={{display:"flex",alignItems:"flex-end",justifyContent:"center",gap:20,marginBottom:32}}>
              {[top3[1],top3[0],top3[2]].filter(Boolean).map((u,i)=>{
                const heights=[130,175,110];const medals=["🥈","🥇","🥉"];
                const podGrad=["linear-gradient(135deg,#94A3B8,#64748B)","linear-gradient(135deg,#F59E0B,#FCD34D)","linear-gradient(135deg,#B45309,#D97706)"];
                return (
                  <div key={u.rank||i} style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                    {i===1&&<div style={{background:C.amberLt,border:`1px solid rgba(217,119,6,0.25)`,borderRadius:8,padding:"3px 10px",fontSize:10,fontWeight:700,color:C.amber,marginBottom:6}}>👑 RANK 1</div>}
                    <div style={{marginTop:8,marginBottom:8,position:"relative"}}>
                      <Avatar name={dName(u)} size={i===1?56:46} fontSize={i===1?18:14}/>
                      {u.isMe&&<div style={{position:"absolute",top:-4,right:-4,width:16,height:16,borderRadius:"50%",background:C.brand,border:"2px solid white",fontSize:8,color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>★</div>}
                    </div>
                    <p style={{fontSize:12,fontWeight:700,color:C.ink,marginBottom:2}}>{dName(u).split(" ")[0]}{u.isMe?" (You)":""}</p>
                    <p className="mono" style={{fontSize:10,color:C.inkMd,marginBottom:8}}>{(u.score||0).toLocaleString()} pts</p>
                    <div style={{background:podGrad[i],borderRadius:"10px 10px 0 0",width:76,height:heights[i],display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{medals[i]}</div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="card" style={{overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr style={{background:C.bgPage}}>
                {["#","User","Score","Level","Streak"].map(h=><th key={h} style={{textAlign:"left",fontSize:9,fontWeight:700,color:C.inkLt,padding:"10px 16px",letterSpacing:"0.08em",textTransform:"uppercase",fontFamily:"JetBrains Mono"}}>{h}</th>)}
              </tr></thead>
              <tbody>{lbData.map(u=>(
                <tr key={u._id||u.name} className={u.isMe?"":"stripe-row"} style={{borderTop:`1px solid ${C.border}30`,background:u.isMe?C.brandLt:""}}>
                  <td style={{padding:"12px 16px"}}><div style={{width:26,height:26,borderRadius:7,background:u.rank<=3?C.amberLt:C.bgPage,border:`1px solid ${u.rank<=3?"rgba(217,119,6,0.25)":C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:u.rank<=3?C.amber:C.inkMd,fontFamily:"JetBrains Mono"}}>{u.rank}</div></td>
                  <td style={{padding:"12px 16px"}}><div style={{display:"flex",alignItems:"center",gap:9}}><Avatar name={dName(u)} size={32} fontSize={11}/><div><p style={{fontSize:12,fontWeight:600,color:C.ink,margin:0}}>{dName(u)}{u.isMe&&<span style={{fontSize:9,color:C.brand,marginLeft:5,fontWeight:700,background:C.brandMd,padding:"1px 5px",borderRadius:4}}>YOU</span>}</p><p style={{fontSize:10,color:C.inkMd,margin:"1px 0 0"}}>{u.dept||"InfoSec"}</p></div></div></td>
                  <td style={{padding:"12px 16px"}}><span className="score-val" style={{fontSize:14,fontWeight:800,color:u.isMe?C.brand:C.ink,fontFamily:"Syne"}}>{(u.score||0).toLocaleString()}</span></td>
                  <td style={{padding:"12px 16px"}}><span className="mono" style={{fontSize:10,fontWeight:600,color:C.violet}}>Lv.{u.level||1}</span></td>
                  <td style={{padding:"12px 16px"}}><span className="mono" style={{fontSize:10,color:(u.streak||0)>=7?C.red:C.inkMd}}>{(u.streak||0)>=3?"🔥":""}{u.streak||0}d</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function ProfilePage({user,stats,avatarUrl,setAvatarUrl}) {
  const [editing,setEditing]=useState(false);const [saving,setSaving]=useState(false);
  const [coverUrl,setCoverUrl]=useState(user?.coverImage||null);
  const [uploadingAvatar,setUploadingAvatar]=useState(false);const [uploadingCover,setUploadingCover]=useState(false);
  const [form,setForm]=useState({name:dName(user),email:user?.email||"",phone:user?.phone||"",city:user?.city||"",role:user?.role||""});
  const save=async()=>{setSaving(true);try{await apiFetch("/api/me",{method:"PUT",body:JSON.stringify(form)});setEditing(false);}catch(e){alert("Could not save: "+e.message);}finally{setSaving(false);}};
  const uploadImage=async(file,type)=>{
    const isAvatar=type==="avatar";if(isAvatar)setUploadingAvatar(true);else setUploadingCover(true);
    try{const reader=new FileReader();reader.onload=e=>{if(isAvatar){setAvatarUrl(e.target.result);try{const s=JSON.parse(localStorage.getItem("user")||"{}");localStorage.setItem("user",JSON.stringify({...s,avatar:e.target.result}));}catch{}}else{setCoverUrl(e.target.result);}};reader.readAsDataURL(file);
      const fd=new FormData();fd.append("image",file);fd.append("type",type);const token=getToken();
      const res=await fetch(`${API_URL}/api/upload-profile-image`,{method:"POST",headers:token?{Authorization:`Bearer ${token}`}:{},body:fd});
      if(res.ok){const data=await res.json();const url=data.url||data.imageUrl||data.avatar;if(url&&isAvatar){setAvatarUrl(url);try{const s=JSON.parse(localStorage.getItem("user")||"{}");localStorage.setItem("user",JSON.stringify({...s,avatar:url}));}catch{}}}
    }catch{}finally{if(isAvatar)setUploadingAvatar(false);else setUploadingCover(false);}
  };
  const pickFile=(type)=>{const i=document.createElement("input");i.type="file";i.accept="image/png,image/jpeg,image/webp";i.onchange=e=>{if(e.target.files[0])uploadImage(e.target.files[0],type)};i.click();};
  const name=dName(user);const secScore=Math.min(100,Math.round(stats.score/30));
  return (
    <div className="page-enter" style={{maxWidth:820}}>
      <SectionHead title="My Profile" sub="Your account information and achievements"/>
      <div className="card" style={{marginBottom:20,overflow:"visible",position:"relative"}}>
        <div style={{height:120,borderRadius:"18px 18px 0 0",position:"relative",overflow:"hidden",background:coverUrl?"transparent":C.gradHero}}>
          {coverUrl?<img src={coverUrl} alt="cover" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<><div className="dot-pattern" style={{position:"absolute",inset:0,opacity:.4}}/><div style={{position:"absolute",right:-20,top:-20,opacity:.06}}><Shield size={200}/></div></>}
          <button onClick={()=>pickFile("cover")} disabled={uploadingCover} style={{position:"absolute",bottom:10,right:12,display:"flex",alignItems:"center",gap:6,padding:"5px 11px",borderRadius:8,fontSize:11,fontWeight:600,cursor:"pointer",background:"rgba(255,255,255,0.9)",backdropFilter:"blur(6px)",border:"1px solid rgba(255,255,255,0.5)",color:C.inkMd}}>
            {uploadingCover?<><Loader2 size={11} className="spin"/>Uploading...</>:<><ImagePlus size={11}/>Change Cover</>}
          </button>
        </div>
        <div style={{position:"absolute",left:24,top:120,transform:"translateY(-50%)",zIndex:10}}>
          <div style={{position:"relative",display:"inline-block"}}>
            <div style={{width:84,height:84,borderRadius:"50%",border:`4px solid ${C.card}`,boxShadow:C.shadowMd,overflow:"hidden",background:C.card,display:"flex",alignItems:"center",justifyContent:"center"}}>
              {avatarUrl?<img src={avatarUrl} alt="avatar" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<Avatar name={name} size={84} fontSize={28}/>}
            </div>
            <button onClick={()=>pickFile("avatar")} disabled={uploadingAvatar} style={{position:"absolute",bottom:2,right:2,width:26,height:26,borderRadius:"50%",background:C.brand,border:`2px solid ${C.card}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 2px 8px rgba(79,70,229,0.4)`}}>
              {uploadingAvatar?<Loader2 size={12} style={{color:"#fff"}} className="spin"/>:<Camera size={11} style={{color:"#fff"}}/>}
            </button>
          </div>
        </div>
        <div style={{padding:"54px 24px 24px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end",marginBottom:10}}>
            <button onClick={()=>editing?save():setEditing(true)} disabled={saving} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:10,fontSize:12,fontWeight:600,border:`1px solid ${editing?C.teal+"40":C.border}`,background:editing?C.tealLt:C.bgPage,color:editing?C.teal:C.inkMd,cursor:"pointer"}}>
              {saving?<><Loader2 size={12} className="spin"/>Saving...</>:editing?<><Save size={12}/>Save</>:<><Edit size={12}/>Edit Profile</>}
            </button>
          </div>
          <h2 className="display" style={{fontSize:20,fontWeight:800,color:C.ink,margin:"0 0 3px"}}>{name}</h2>
          <p style={{fontSize:12,color:C.inkMd,margin:"0 0 10px"}}>{form.role||"Security Analyst"}</p>
          <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
            <Tag label={`Lv.${stats.level}`} color={C.violet} bg={C.violetLt}/>
            <Tag label={`${stats.xp} XP`} color={C.amber} bg={C.amberLt}/>
            <Tag label={`${stats.score} pts`} color={C.brand} bg={C.brandLt}/>
            {stats.streak>0&&<Tag label={`${stats.streak}d streak`} color={C.red} bg={C.redLt}/>}
          </div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <div className="card" style={{padding:22}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}><User size={14} style={{color:C.brand}}/><span className="display" style={{fontSize:13,fontWeight:700,color:C.ink}}>Personal Info</span></div>
            {editing&&<button onClick={()=>setEditing(false)} style={{background:"none",border:"none",cursor:"pointer",color:C.inkLt}}><X size={14}/></button>}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {[["Full Name","name"],["Email","email"],["Phone","phone"],["City","city"],["Role","role"]].map(([label,field])=>(
              <div key={field}>
                <label className="mono" style={{fontSize:9,color:C.inkLt,display:"block",marginBottom:4,letterSpacing:"0.07em",textTransform:"uppercase"}}>{label}</label>
                {editing?<input value={form[field]||""} onChange={e=>setForm(p=>({...p,[field]:e.target.value}))} style={{width:"100%",padding:"8px 11px",borderRadius:9,border:`1.5px solid ${C.border}`,fontSize:12,background:C.bgPage,color:C.ink,boxSizing:"border-box"}}/>:<p style={{fontSize:13,fontWeight:500,color:form[field]?C.inkMd:C.inkLt,margin:0,fontStyle:form[field]?"normal":"italic"}}>{form[field]||"Not set"}</p>}
              </div>
            ))}
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div className="card" style={{padding:20}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><Activity size={14} style={{color:C.amber}}/><span className="display" style={{fontSize:13,fontWeight:700,color:C.ink}}>Live Stats</span></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {[["Score",stats.score,C.brand],["Quizzes",stats.quizzesDone,C.violet],["Avg Score",stats.avgScore?stats.avgScore+"%":"—",C.teal],["Streak",`${stats.streak}d`,C.amber],["Security",`${secScore}%`,C.green],["Threats",stats.threatsViewed?.length||0,C.red]].map(([l,v,c])=>(
                <div key={l} style={{background:c+"08",border:`1px solid ${c}15`,borderRadius:10,padding:12,textAlign:"center"}}>
                  <div className="score-val" style={{fontSize:18,fontWeight:800,color:c,fontFamily:"Syne"}}>{v}</div>
                  <div style={{fontSize:10,color:C.inkMd,marginTop:3}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{padding:20,flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><Award size={14} style={{color:C.teal}}/><span className="display" style={{fontSize:13,fontWeight:700,color:C.ink}}>Badges</span></div>
            {stats.badges?.length>0?(
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {stats.badges.map((b,i)=>(
                  <div key={i} style={{textAlign:"center",padding:"10px 12px",background:C.amberLt,border:`1px solid rgba(217,119,6,0.15)`,borderRadius:10}}>
                    <div style={{fontSize:20}}>{b.emoji||"🏅"}</div><p style={{fontSize:9,color:C.inkMd,marginTop:4}}>{b.label||b}</p>
                  </div>
                ))}
              </div>
            ):<EmptyState icon={Award} title="No badges yet" desc="Complete quizzes and challenges to earn badges." color={C.teal}/>}
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsPage({user}) {
  const [showPass,setShowPass]=useState(false);const [saving,setSaving]=useState(false);const [delModal,setDelModal]=useState(false);
  const [notifPref,setNotifPref]=useState({email:true,push:true,threats:true});
  const [form,setForm]=useState({name:dName(user),email:user?.email||"",phone:user?.phone||""});
  const Toggle=({on,onChange,color=C.brand})=>(
    <button onClick={()=>onChange(!on)} style={{position:"relative",width:42,height:22,borderRadius:99,border:"none",cursor:"pointer",padding:0,background:on?color:C.borderMd,transition:"background .2s",flexShrink:0}}>
      <span style={{position:"absolute",top:3,left:on?22:3,width:16,height:16,borderRadius:"50%",background:"#fff",boxShadow:"0 1px 4px rgba(0,0,0,.15)",transition:"left .2s"}}/>
    </button>
  );
  return (
    <div className="page-enter" style={{maxWidth:640}}>
      <SectionHead title="Settings" sub="Manage your account and preferences"/>
      <div className="card" style={{padding:22,marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:18}}><User size={14} style={{color:C.brand}}/><span className="display" style={{fontSize:13,fontWeight:700,color:C.ink}}>Account</span></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
          {[["Full Name","name"],["Email","email"],["Phone","phone"]].map(([l,f])=>(
            <div key={f}><label className="mono" style={{fontSize:9,color:C.inkLt,display:"block",marginBottom:4,letterSpacing:"0.07em",textTransform:"uppercase"}}>{l}</label>
              <input value={form[f]||""} onChange={e=>setForm(p=>({...p,[f]:e.target.value}))} style={{width:"100%",padding:"8px 11px",borderRadius:9,border:`1.5px solid ${C.border}`,fontSize:12,background:C.bgPage,color:C.ink,boxSizing:"border-box"}}/>
            </div>
          ))}
        </div>
        <div style={{marginBottom:16}}>
          <label className="mono" style={{fontSize:9,color:C.inkLt,display:"block",marginBottom:4,letterSpacing:"0.07em",textTransform:"uppercase"}}>New Password</label>
          <div style={{position:"relative"}}>
            <input type={showPass?"text":"password"} placeholder="Enter new password..." style={{width:"100%",padding:"8px 38px 8px 11px",borderRadius:9,border:`1.5px solid ${C.border}`,fontSize:12,background:C.bgPage,color:C.ink,boxSizing:"border-box"}}/>
            <button onClick={()=>setShowPass(!showPass)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:C.inkLt}}>{showPass?<EyeOff size={13}/>:<Eye size={13}/>}</button>
          </div>
        </div>
        <button className="btn btn-primary" disabled={saving} onClick={async()=>{setSaving(true);try{await apiFetch("/api/me",{method:"PUT",body:JSON.stringify(form)});}catch(e){alert(e.message);}finally{setSaving(false);}}}>
          {saving?<><Loader2 size={12} className="spin"/>Saving...</>:<><Save size={12}/>Save Changes</>}
        </button>
      </div>
      <div className="card" style={{padding:22,marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:18}}><Bell size={14} style={{color:C.amber}}/><span className="display" style={{fontSize:13,fontWeight:700,color:C.ink}}>Notifications</span></div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {[{k:"email",l:"Email Alerts",d:"Security alerts via email"},{k:"push",l:"Push Notifications",d:"Browser & mobile"},{k:"threats",l:"Threat Alerts",d:"Critical threat intel"}].map(it=>(
            <div key={it.k} style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div><p style={{fontSize:12,fontWeight:500,color:C.ink,margin:0}}>{it.l}</p><p style={{fontSize:11,color:C.inkMd,margin:"1px 0 0"}}>{it.d}</p></div>
              <Toggle on={notifPref[it.k]} onChange={v=>setNotifPref(n=>({...n,[it.k]:v}))}/>
            </div>
          ))}
        </div>
      </div>
      <div className="card" style={{padding:22,border:`1px solid rgba(220,38,38,0.2)`}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><AlertTriangle size={14} style={{color:C.red}}/><span className="display" style={{fontSize:13,fontWeight:700,color:C.red}}>Danger Zone</span></div>
        <p style={{fontSize:12,color:C.inkMd,marginBottom:14}}>Deleting your account is permanent and cannot be undone.</p>
        <button onClick={()=>setDelModal(true)} style={{display:"flex",alignItems:"center",gap:7,padding:"9px 16px",borderRadius:9,fontSize:12,fontWeight:600,border:`1px solid rgba(220,38,38,0.2)`,cursor:"pointer",background:C.redLt,color:C.red}}><Trash2 size={12}/> Delete Account</button>
      </div>
      {delModal&&(
        <div style={{position:"fixed",inset:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(15,23,42,0.4)",backdropFilter:"blur(4px)"}}>
          <div className="card" style={{padding:28,maxWidth:340,width:"100%"}}>
            <AlertTriangle size={28} style={{color:C.red,marginBottom:14}}/>
            <h3 className="display" style={{fontSize:16,fontWeight:800,color:C.ink,margin:"0 0 8px"}}>Delete Account?</h3>
            <p style={{fontSize:12,color:C.inkMd,margin:"0 0 22px"}}>All data, XP, scores and certificates will be permanently deleted.</p>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setDelModal(false)} className="btn btn-ghost" style={{flex:1,justifyContent:"center"}}>Cancel</button>
              <button style={{flex:1,padding:11,borderRadius:10,fontSize:12,fontWeight:700,border:"none",cursor:"pointer",background:C.gradRed,color:"#fff"}}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NotifsDrawer({open,onClose,notifs,setNotifs}) {
  return (
    <>
      {open&&<div onClick={onClose} style={{position:"fixed",inset:0,zIndex:40,background:"rgba(15,23,42,0.25)",backdropFilter:"blur(2px)"}}/>}
      <div style={{position:"fixed",top:0,right:0,height:"100%",zIndex:50,width:350,background:C.card,boxShadow:C.shadowLg,border:`1px solid ${C.border}`,transform:open?"translateX(0)":"translateX(100%)",transition:"transform .28s cubic-bezier(.16,1,.3,1)",display:"flex",flexDirection:"column"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 20px",borderBottom:`1px solid ${C.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:9}}><span className="display" style={{fontSize:14,fontWeight:700,color:C.ink}}>Notifications</span>{notifs.filter(n=>n.unread).length>0&&<Tag label={`${notifs.filter(n=>n.unread).length}`} color={C.red} bg={C.redLt}/>}</div>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:C.inkMd}}><X size={17}/></button>
        </div>
        <div style={{padding:"8px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",gap:12}}>
          <button onClick={()=>setNotifs(l=>l.map(x=>({...x,unread:false})))} style={{fontSize:11,fontWeight:600,color:C.brand,background:"none",border:"none",cursor:"pointer"}}>Mark all read</button>
          <button onClick={()=>setNotifs([])} style={{fontSize:11,fontWeight:600,color:C.red,background:"none",border:"none",cursor:"pointer"}}>Clear all</button>
        </div>
        <div style={{flex:1,overflowY:"auto"}}>
          {notifs.length===0?<EmptyState icon={Bell} title="All caught up!" desc="No new notifications." color={C.inkLt}/>:notifs.map(n=>(
            <div key={n.id} style={{display:"flex",alignItems:"flex-start",gap:11,padding:"13px 20px",borderBottom:`1px solid ${C.border}20`,background:n.unread?n.color+"06":"transparent"}}>
              <div style={{width:30,height:30,borderRadius:8,background:n.color+"14",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><n.icon size={13} style={{color:n.color}}/></div>
              <div style={{flex:1}}><p style={{fontSize:12,fontWeight:n.unread?600:400,color:n.unread?C.ink:C.inkMd,margin:"0 0 2px",lineHeight:1.4}}>{n.msg}</p><p className="mono" style={{fontSize:9,color:C.inkLt}}>{n.time}</p></div>
              {n.unread&&<div style={{width:7,height:7,borderRadius:"50%",background:n.color,flexShrink:0,marginTop:5}}/>}
              <button className="notif-dismiss" onClick={()=>setNotifs(prev=>prev.filter(x=>x.id!==n.id))}><X size={11}/></button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Loader() {
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:C.bg,flexDirection:"column",gap:16}}>
      <div style={{width:60,height:60,borderRadius:18,background:C.gradBrand,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 8px 28px rgba(79,70,229,0.4)",animation:"float 2s ease-in-out infinite"}}>
        <Shield size={28} style={{color:"#fff"}}/>
      </div>
      <div style={{display:"flex",gap:5}}>
        {[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:C.brand,opacity:.3,animation:`pulse 1.2s ease ${i*.2}s infinite`}}/>)}
      </div>
      <p className="mono" style={{fontSize:11,color:C.inkMd,letterSpacing:"0.08em"}}>Loading CyberShield...</p>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// ROOT APP
// ══════════════════════════════════════════════════════════════════
export default function App() {
  const {user,loading}=useUser();
  const navigate=useNavigate();
  const [page,setPage]=useState("dashboard");
  const [sideOpen,setSideOpen]=useState(true);
  const [notifOpen,setNotifOpen]=useState(false);
  const [menuOpen,setMenuOpen]=useState(false);
  const {stats,onQuizComplete,onPhishingComplete,onThreatView}=useStats(user);
  const {notifs,setNotifs,addActivityNotif}=useNotifications();
  const [avatarUrl,setAvatarUrl]=useState(()=>{try{return JSON.parse(localStorage.getItem("user")||"null")?.avatar||null;}catch{return null;}});
  useEffect(()=>{if(user?.avatar&&!avatarUrl)setAvatarUrl(user.avatar);},[user]);
  const unread=notifs.filter(n=>n.unread).length;
  const name=dName(user);const fname=name.split(" ")[0];
  const PAGES={
    dashboard:   <DashboardPage   user={user} stats={stats} setPage={setPage} navigate={navigate} notifs={notifs} setNotifs={setNotifs} addActivityNotif={addActivityNotif}/>,
    threats:     <ThreatsPage     stats={stats} onThreatView={onThreatView}/>,
    phishing:    <PhishingPage    onPhishingComplete={onPhishingComplete} addActivityNotif={addActivityNotif}/>,
    reports:     <ReportsPage     stats={stats} setPage={setPage}/>,
    leaderboard: <LeaderboardPage user={user} stats={stats}/>,
    profile:     <ProfilePage     user={user} stats={stats} avatarUrl={avatarUrl} setAvatarUrl={setAvatarUrl}/>,
    settings:    <SettingsPage    user={user}/>,
  };
  const quizCompleteRef=useRef(null);
  quizCompleteRef.current={onQuizComplete,addActivityNotif};
  useEffect(()=>{
    window.__onQuizComplete=(score,total)=>{
      quizCompleteRef.current.onQuizComplete(score,total);
      const pct=Math.round((score/total)*100);
      quizCompleteRef.current.addActivityNotif(`Quiz completed — ${pct}% (${score}/${total})`,pct>=70?C.green:C.amber);
    };
    return()=>{delete window.__onQuizComplete;};
  },[]);
  const handleNav=(item)=>{if(item.route){navigate(item.route);return;}setPage(item.id);};
  if(loading)return<><G/><Loader/></>;
  return (
    <div style={{display:"flex",height:"100vh",overflow:"hidden",background:C.bg}}>
      <G/>
      {/* ── SIDEBAR ── */}
      <aside style={{display:"flex",flexDirection:"column",height:"100%",flexShrink:0,width:sideOpen?228:62,transition:"width .28s cubic-bezier(.16,1,.3,1)",background:C.gradSide,boxShadow:"4px 0 20px rgba(15,23,42,0.15)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"14px 12px",borderBottom:"1px solid rgba(255,255,255,0.06)",height:60}}>
          <div style={{width:32,height:32,borderRadius:9,background:C.gradBrand,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 4px 14px rgba(79,70,229,0.45)"}}><Shield size={16} style={{color:"#fff"}}/></div>
          {sideOpen&&<span className="display" style={{fontWeight:800,fontSize:14,color:"#fff",letterSpacing:"0.02em",whiteSpace:"nowrap"}}>CyberShield</span>}
        </div>
        {sideOpen&&(
          <div style={{padding:"10px 12px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              {avatarUrl?<img src={avatarUrl} alt="av" style={{width:30,height:30,borderRadius:"50%",objectFit:"cover",flexShrink:0}}/>:<Avatar name={name} size={30} fontSize={10}/>}
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontSize:11,fontWeight:600,color:"#fff",margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{fname}</p>
                <div className="mono" style={{fontSize:9,color:"rgba(255,255,255,0.4)"}}>Lv.{stats.level} · {stats.score} pts</div>
              </div>
              <div style={{width:7,height:7,borderRadius:"50%",background:"#34D399",flexShrink:0,boxShadow:"0 0 6px rgba(52,211,153,0.6)"}}/>
            </div>
            <div style={{marginTop:7,width:"100%",background:"rgba(255,255,255,0.1)",borderRadius:99,height:3}}>
              <div style={{width:`${Math.min(100,(stats.xp%500)/5)}%`,height:3,background:"linear-gradient(90deg,#818CF8,#A5B4FC)",borderRadius:99,transition:"width .8s ease"}}/>
            </div>
          </div>
        )}
        <nav style={{flex:1,overflowY:"auto",padding:"8px 6px"}}>
          {[NAV.slice(0,6),NAV.slice(6)].map((group,gi)=>(
            <div key={gi}>
              {gi>0&&<div style={{height:1,background:"rgba(255,255,255,0.06)",margin:"5px 3px"}}/>}
              {sideOpen&&<p className="mono" style={{fontSize:8,color:"rgba(255,255,255,0.25)",padding:"4px 8px 2px",letterSpacing:"0.1em"}}>{gi===0?"MAIN":"ACCOUNT"}</p>}
              {group.map(item=>{
                const active=!item.route&&page===item.id;
                return (
                  <button key={item.id} onClick={()=>handleNav(item)} title={!sideOpen?item.label:""} className={`nav-btn ${active?"active":""}`} style={{justifyContent:sideOpen?"flex-start":"center",marginBottom:2}}>
                    <item.icon size={15} style={{flexShrink:0}}/>
                    {sideOpen&&<span style={{whiteSpace:"nowrap"}}>{item.label}</span>}
                    {item.badge&&sideOpen&&<span className="mono" style={{marginLeft:"auto",background:"rgba(20,184,166,0.2)",color:"#2DD4BF",fontSize:8,fontWeight:700,padding:"1px 5px",borderRadius:4,border:"1px solid rgba(20,184,166,0.3)"}}>{item.badge}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
        <div style={{padding:"6px 6px",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
          <button onClick={()=>setSideOpen(!sideOpen)} className="nav-btn" style={{justifyContent:sideOpen?"flex-start":"center"}}>
            {sideOpen?<><ChevronLeft size={13}/><span>Collapse</span></>:<ChevronRight size={13}/>}
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div style={{display:"flex",flexDirection:"column",flex:1,overflow:"hidden"}}>
        <header style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 22px",height:60,flexShrink:0,background:C.card,borderBottom:`1px solid ${C.border}`,boxShadow:"0 1px 6px rgba(15,23,42,0.06)"}}>
          <div style={{position:"relative",width:260}}>
            <Search size={13} style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",color:C.inkLt}}/>
            <input placeholder="Search threats, courses..." style={{width:"100%",paddingLeft:32,paddingRight:12,paddingTop:8,paddingBottom:8,borderRadius:10,border:`1px solid ${C.border}`,fontSize:12,background:C.bgPage,color:C.ink,boxSizing:"border-box"}}/>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{display:"flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:8,background:C.greenLt,border:`1px solid rgba(5,150,105,0.2)`}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:C.green,animation:"pulse 2s infinite"}}/>
              <span className="mono" style={{fontSize:9,fontWeight:700,color:C.green,letterSpacing:"0.08em"}}>SECURE</span>
            </div>
            {stats.score>0&&<div style={{display:"flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:8,background:C.brandLt,border:`1px solid ${C.brandMd}`}}>
              <Zap size={11} style={{color:C.brand}}/><span className="mono" style={{fontSize:9,fontWeight:700,color:C.brand}}>{stats.score} pts</span>
            </div>}
            <button onClick={()=>setNotifOpen(!notifOpen)} style={{position:"relative",padding:7,borderRadius:9,border:`1px solid ${C.border}`,cursor:"pointer",background:C.bgPage}}>
              <Bell size={15} style={{color:C.inkMd}}/>
              {unread>0&&<span style={{position:"absolute",top:2,right:2,width:16,height:16,borderRadius:"50%",background:C.red,color:"#fff",fontSize:8,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"JetBrains Mono"}}>{unread}</span>}
            </button>
            <div style={{position:"relative"}}>
              <button onClick={()=>setMenuOpen(!menuOpen)} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 9px",borderRadius:9,border:`1px solid ${C.border}`,cursor:"pointer",background:C.bgPage}}>
                {avatarUrl?<img src={avatarUrl} alt="avatar" style={{width:28,height:28,borderRadius:"50%",objectFit:"cover",flexShrink:0}}/>:<Avatar name={name} size={28} fontSize={10}/>}
                <span style={{fontSize:12,fontWeight:600,color:C.inkMd}}>{fname}</span>
                <ChevronDown size={11} style={{color:C.inkLt}}/>
              </button>
              {menuOpen&&(
                <div style={{position:"absolute",right:0,top:"calc(100% + 8px)",width:200,background:C.card,borderRadius:14,boxShadow:C.shadowLg,border:`1px solid ${C.border}`,zIndex:50,overflow:"hidden",animation:"fadeIn .15s ease"}}>
                  <div style={{padding:"12px 14px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:9}}>
                    {avatarUrl?<img src={avatarUrl} alt="avatar" style={{width:32,height:32,borderRadius:"50%",objectFit:"cover",flexShrink:0}}/>:<Avatar name={name} size={32} fontSize={11}/>}
                    <div><p style={{fontSize:12,fontWeight:700,color:C.ink,margin:0}}>{name}</p><p className="mono" style={{fontSize:10,color:C.inkMd,margin:"1px 0 0"}}>{user?.email||""}</p></div>
                  </div>
                  {[{l:"Profile",I:User,p:"profile"},{l:"Settings",I:Settings,p:"settings"}].map(it=>(
                    <button key={it.l} onClick={()=>{setPage(it.p);setMenuOpen(false);}} style={{width:"100%",display:"flex",alignItems:"center",gap:9,padding:"9px 14px",fontSize:12,color:C.inkMd,border:"none",cursor:"pointer",background:"transparent",textAlign:"left",fontFamily:"Plus Jakarta Sans",transition:"background .12s"}} onMouseEnter={e=>e.currentTarget.style.background=C.bgPage} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <it.I size={12}/>{it.l}
                    </button>
                  ))}
                  <div style={{borderTop:`1px solid ${C.border}`}}>
                    <button onClick={handleLogout} style={{width:"100%",display:"flex",alignItems:"center",gap:9,padding:"9px 14px",fontSize:12,color:C.red,border:"none",cursor:"pointer",background:"transparent",textAlign:"left",fontFamily:"Plus Jakarta Sans",transition:"background .12s"}} onMouseEnter={e=>e.currentTarget.style.background=C.redLt} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <LogOut size={12}/>Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        <main style={{flex:1,overflowY:"auto",padding:22,background:C.bg}}>
          <div key={page} className="page-enter">{PAGES[page]}</div>
        </main>
      </div>
      <NotifsDrawer open={notifOpen} onClose={()=>setNotifOpen(false)} notifs={notifs} setNotifs={setNotifs}/>
      {menuOpen&&<div onClick={()=>setMenuOpen(false)} style={{position:"fixed",inset:0,zIndex:40}}/>}
    </div>
  );
}