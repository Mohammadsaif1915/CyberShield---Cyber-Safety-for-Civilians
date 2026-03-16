import { useState, useEffect } from "react";
import {
  Shield, LayoutDashboard, BookOpen, AlertTriangle, Mail, Brain,
  BarChart2, Trophy, Settings, Bell, Search, ChevronLeft, ChevronRight,
  User, LogOut, Moon, Sun, Camera, TrendingUp, TrendingDown, Clock,
  CheckCircle, XCircle, Play, Lock, Zap, Eye, EyeOff,
  Download, ChevronDown, X, Award, Target,
  Activity, Monitor, Star, AlertCircle,
  Calendar, Flag, MessageSquare, FileText, PieChart, Info, Edit, Save, Trash2
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from "recharts";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const MOCK_USER = {
  name: "Arjun Sharma", role: "Security Analyst", email: "arjun.sharma@cybershield.io",
  phone: "+91 98765 43210", department: "InfoSec", joinDate: "March 2022",
  score: 847, rank: "Gold Shield", avatar: null,
  coursesCompleted: 24, threatsDetected: 138, quizScore: 91, phishingPassed: 17
};

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "courses", label: "Courses", icon: BookOpen },
  { id: "threats", label: "Threat Intel", icon: AlertTriangle },
  { id: "phishing", label: "Phishing Sim", icon: Mail },
  { id: "quiz", label: "Quiz", icon: Brain },
  { id: "reports", label: "Reports", icon: BarChart2 },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "profile", label: "Profile", icon: User },
];

const WEEKLY_SCORES = [
  { day: "Mon", score: 62, threats: 3 }, { day: "Tue", score: 71, threats: 5 },
  { day: "Wed", score: 68, threats: 2 }, { day: "Thu", score: 85, threats: 7 },
  { day: "Fri", score: 79, threats: 4 }, { day: "Sat", score: 88, threats: 6 },
  { day: "Sun", score: 91, threats: 8 },
];

const TRAINING_DATA = [
  { name: "Phishing", value: 35, color: "#00bcd4" },
  { name: "Malware", value: 25, color: "#5c6bc0" },
  { name: "Network", value: 20, color: "#7c4dff" },
  { name: "Social Eng.", value: 12, color: "#ff6f00" },
  { name: "Data Privacy", value: 8, color: "#00897b" },
];

const MONTHLY_QUIZ = [
  { month: "Sep", score: 72 }, { month: "Oct", score: 78 },
  { month: "Nov", score: 65 }, { month: "Dec", score: 83 },
  { month: "Jan", score: 88 }, { month: "Feb", score: 91 },
];

const COURSES = [
  { id: 1, title: "Phishing Attack Recognition", category: "Phishing", difficulty: "Beginner", duration: "2h 30m", progress: 100, enrolled: true, color: "#00bcd4" },
  { id: 2, title: "Advanced Malware Analysis", category: "Malware", difficulty: "Advanced", duration: "5h 15m", progress: 65, enrolled: true, color: "#5c6bc0" },
  { id: 3, title: "Network Security Fundamentals", category: "Network Security", difficulty: "Intermediate", duration: "3h 45m", progress: 40, enrolled: true, color: "#7c4dff" },
  { id: 4, title: "Social Engineering Tactics", category: "Social Engineering", difficulty: "Intermediate", duration: "2h 00m", progress: 0, enrolled: false, color: "#ff6f00" },
  { id: 5, title: "GDPR & Data Privacy", category: "Data Privacy", difficulty: "Beginner", duration: "1h 30m", progress: 80, enrolled: true, color: "#00897b" },
  { id: 6, title: "Ransomware Defense", category: "Malware", difficulty: "Advanced", duration: "4h 00m", progress: 0, enrolled: false, color: "#c62828" },
  { id: 7, title: "Zero Trust Architecture", category: "Network Security", difficulty: "Advanced", duration: "6h 00m", progress: 20, enrolled: true, color: "#283593" },
  { id: 8, title: "Incident Response Playbook", category: "Network Security", difficulty: "Intermediate", duration: "3h 00m", progress: 0, enrolled: false, color: "#558b2f" },
];

const THREATS = [
  { id: 1, name: "APT-29 Cozy Bear", type: "APT", severity: "Critical", systems: "Windows, Linux", date: "2025-01-14", desc: "State-sponsored group targeting government and energy sector via spear-phishing." },
  { id: 2, name: "LockBit 3.0 Ransomware", type: "Ransomware", severity: "Critical", systems: "Windows", date: "2025-01-13", desc: "Latest variant with improved encryption, targeting healthcare and finance." },
  { id: 3, name: "Log4Shell Exploitation", type: "Vulnerability", severity: "High", systems: "Java Apps", date: "2025-01-12", desc: "Active exploitation of CVE-2021-44228 in unpatched systems detected." },
  { id: 4, name: "Emotet Banking Trojan", type: "Trojan", severity: "High", systems: "Windows", date: "2025-01-11", desc: "Resurgence in email campaigns with macro-enabled documents." },
  { id: 5, name: "DNS Cache Poisoning", type: "Network Attack", severity: "Medium", systems: "DNS Servers", date: "2025-01-10", desc: "Coordinated DNS poisoning attempts targeting enterprise resolvers." },
  { id: 6, name: "BEC Phishing Wave", type: "Phishing", severity: "Medium", systems: "Email", date: "2025-01-09", desc: "Business email compromise campaigns impersonating C-level executives." },
  { id: 7, name: "Outdated SSL/TLS Config", type: "Misconfiguration", severity: "Low", systems: "Web Servers", date: "2025-01-08", desc: "Deprecated TLS 1.0/1.1 still active on several public-facing servers." },
  { id: 8, name: "Brute Force SSH", type: "Network Attack", severity: "Low", systems: "Linux Servers", date: "2025-01-07", desc: "Automated credential stuffing against SSH endpoints from known bot networks." },
];

const PHISHING_EMAILS = [
  { id: 1, sender: "security@paypa1.com", from: "PayPal Security", subject: "Urgent: Verify your account immediately", time: "10:23 AM", isPhishing: true, read: false,
    body: "Dear Customer,\n\nWe have detected suspicious activity on your PayPal account. Your account has been temporarily limited.\n\nPlease verify your identity by clicking the link below within 24 hours or your account will be permanently suspended.\n\n[VERIFY NOW] → http://paypa1-secure.xyz/login\n\nThank you,\nPayPal Security Team",
    redFlags: ["Misspelled domain (paypa1.com)", "Urgent threatening language", "Suspicious link to non-PayPal domain", "Generic greeting 'Dear Customer'"] },
  { id: 2, sender: "newsletter@medium.com", from: "Medium Daily Digest", subject: "Your top stories for today", time: "9:45 AM", isPhishing: false, read: true,
    body: "Good morning,\n\nHere are your personalized stories for today based on your reading history:\n\n• The Future of Cybersecurity in 2025\n• Zero Trust Architecture Explained\n• Top 10 Ransomware Prevention Tips\n\nHappy reading!\nThe Medium Team", redFlags: [] },
  { id: 3, sender: "hr-noreply@comp4ny-hr.net", from: "HR Department", subject: "Action Required: Update your W-2 form", time: "Yesterday", isPhishing: true, read: false,
    body: "Dear Employee,\n\nAs part of our annual tax filing process, all employees must update their W-2 information.\n\nClick here to update your personal and banking details: http://comp4ny-hr.net/w2-update\n\nDeadline: End of today.\n\nHR Department", redFlags: ["Unofficial domain (comp4ny-hr.net)", "Requests banking details", "Artificial urgency", "No company name mentioned"] },
  { id: 4, sender: "noreply@github.com", from: "GitHub", subject: "Your pull request was merged", time: "Yesterday", isPhishing: false, read: true,
    body: "Hi arjun-sharma,\n\nYour pull request #247 'Fix authentication middleware' was successfully merged into main by reviewer jsmith.\n\nView the changes at github.com/cybershield/platform\n\nThanks,\nThe GitHub Team", redFlags: [] },
  { id: 5, sender: "microsoft-support@outlook-help.co", from: "Microsoft Support", subject: "Your Microsoft 365 subscription expires in 2 hours", time: "2 days ago", isPhishing: true, read: true,
    body: "URGENT NOTICE\n\nYour Microsoft 365 Business license will expire in 2 hours. To avoid losing access to all Office applications, please renew immediately.\n\nClick to Renew: http://ms-365-renew.co/urgent\n\nIf you fail to renew, all your files and emails will be permanently deleted.\n\nMicrosoft Corporation", redFlags: ["Fake domain (outlook-help.co)", "Extreme urgency (2 hours)", "Threatening data deletion", "Abnormal renewal link"] },
];

const QUIZ_QUESTIONS = [
  { q: "What is a 'zero-day' vulnerability?", options: ["A vulnerability with no known patch", "A vulnerability discovered on day zero of a software release", "A bug that causes system crashes", "An exploit targeting mobile devices"], correct: 0, explanation: "A zero-day vulnerability is one that has been discovered but not yet patched by the vendor, giving defenders 'zero days' to protect themselves." },
  { q: "Which of the following is the BEST indicator of a phishing email?", options: ["The email uses HTML formatting", "The sender's domain doesn't match the purported company", "The email was sent after business hours", "The email contains images"], correct: 1, explanation: "Mismatched sender domains (e.g., paypa1.com instead of paypal.com) are a classic phishing indicator." },
  { q: "What does 'MFA' stand for in cybersecurity?", options: ["Malware File Analysis", "Multi-Factor Authentication", "Managed Firewall Application", "Mobile Fraud Alert"], correct: 1, explanation: "Multi-Factor Authentication requires two or more verification methods, significantly reducing account compromise risk." },
  { q: "Which encryption standard is currently considered MOST secure for storing passwords?", options: ["MD5", "SHA-1", "bcrypt", "Base64"], correct: 2, explanation: "bcrypt uses salted hashing and work factors making brute-force attacks computationally expensive." },
  { q: "What is a 'man-in-the-middle' (MitM) attack?", options: ["Attacking a server through its middleware layer", "Intercepting communication between two parties", "A social engineering technique", "Installing malware on a server"], correct: 1, explanation: "In a MitM attack, an attacker secretly intercepts and potentially alters communications between two parties who believe they're communicating directly." },
];

const LEADERBOARD = [
  { rank: 1, name: "Priya Nair", dept: "DevSecOps", score: 1240, badges: 12, avatar: "PN" },
  { rank: 2, name: "Rahul Mehta", dept: "Cloud Ops", score: 1185, badges: 10, avatar: "RM" },
  { rank: 3, name: "Sarah Chen", dept: "AppSec", score: 1102, badges: 9, avatar: "SC" },
  { rank: 4, name: "Vikram Patel", dept: "NetSec", score: 989, badges: 8, avatar: "VP" },
  { rank: 5, name: "Arjun Sharma", dept: "InfoSec", score: 847, badges: 7, avatar: "AS", isCurrentUser: true },
  { rank: 6, name: "Li Wei", dept: "SOC", score: 801, badges: 6, avatar: "LW" },
  { rank: 7, name: "Ana Rodrigues", dept: "GRC", score: 754, badges: 6, avatar: "AR" },
  { rank: 8, name: "James Kim", dept: "Incident Response", score: 698, badges: 5, avatar: "JK" },
  { rank: 9, name: "Fatima Al-Hassan", dept: "Threat Intel", score: 643, badges: 5, avatar: "FA" },
  { rank: 10, name: "David Okonkwo", dept: "Pentest", score: 598, badges: 4, avatar: "DO" },
];

const NOTIFICATIONS = [
  { id: 1, type: "alert", icon: AlertTriangle, msg: "New critical threat: LockBit 3.0 variant detected", time: "5 min ago", unread: true, color: "#ef4444" },
  { id: 2, type: "course", icon: BookOpen, msg: "You've completed 'Phishing Attack Recognition'!", time: "2 hrs ago", unread: true, color: "#00bcd4" },
  { id: 3, type: "quiz", icon: Brain, msg: "New quiz available: Advanced Network Security", time: "1 day ago", unread: true, color: "#7c4dff" },
  { id: 4, type: "system", icon: Shield, msg: "Your security score improved by 12 points", time: "2 days ago", unread: false, color: "#00897b" },
  { id: 5, type: "alert", icon: Flag, msg: "Phishing simulation scheduled for Friday", time: "3 days ago", unread: false, color: "#ff6f00" },
];

const ACTIVITY_FEED = [
  { icon: CheckCircle, msg: "Completed 'Network Security Fundamentals' — Module 3", time: "Today, 11:30 AM", color: "#00897b" },
  { icon: Target, msg: "Phishing simulation passed (Email #5)", time: "Today, 10:15 AM", color: "#00bcd4" },
  { icon: Brain, msg: "Quiz: Social Engineering — Score 88/100", time: "Yesterday, 3:45 PM", color: "#7c4dff" },
  { icon: AlertTriangle, msg: "Threat report viewed: APT-29 Analysis", time: "Yesterday, 2:00 PM", color: "#ff6f00" },
  { icon: BookOpen, msg: "Started 'Zero Trust Architecture' course", time: "Jan 12, 9:00 AM", color: "#5c6bc0" },
];

const THREAT_MAP_POINTS = [
  { x: 18, y: 38, size: 8, intensity: "critical" }, { x: 51, y: 25, size: 6, intensity: "high" },
  { x: 75, y: 35, size: 10, intensity: "critical" }, { x: 30, y: 55, size: 5, intensity: "medium" },
  { x: 85, y: 60, size: 7, intensity: "high" }, { x: 22, y: 20, size: 4, intensity: "low" },
  { x: 60, y: 65, size: 6, intensity: "medium" }, { x: 90, y: 30, size: 9, intensity: "critical" },
  { x: 45, y: 42, size: 5, intensity: "medium" }, { x: 65, y: 20, size: 4, intensity: "low" },
];

const DOMAIN_PROGRESS = [
  { domain: "Phishing Awareness", pct: 92, color: "#00bcd4" },
  { domain: "Malware Defense", pct: 74, color: "#5c6bc0" },
  { domain: "Network Security", pct: 61, color: "#7c4dff" },
  { domain: "Social Engineering", pct: 45, color: "#ff6f00" },
  { domain: "Data Privacy & Compliance", pct: 88, color: "#00897b" },
];

const severityConfig = {
  Critical: { color: "#ef4444", bg: "#fef2f2" },
  High: { color: "#f97316", bg: "#fff7ed" },
  Medium: { color: "#eab308", bg: "#fefce8" },
  Low: { color: "#22c55e", bg: "#f0fdf4" }
};

const difficultyConfig = {
  Beginner: { color: "#22c55e", bg: "#f0fdf4" },
  Intermediate: { color: "#f97316", bg: "#fff7ed" },
  Advanced: { color: "#ef4444", bg: "#fef2f2" }
};

// ─── HELPER COMPONENTS ───────────────────────────────────────────────────────

const Badge = ({ label, color, bg }) => (
  <span style={{
    background: bg || color + "20",
    color: color,
    border: `1px solid ${color}40`,
    fontSize: 11,
    fontWeight: 600,
    padding: "2px 8px",
    borderRadius: 999,
    display: "inline-block",
    letterSpacing: "0.02em"
  }}>{label}</span>
);

const ProgressBar = ({ pct, color = "#00bcd4", height = 6 }) => (
  <div style={{ width: "100%", background: "#e8edf5", borderRadius: 999, height, overflow: "hidden" }}>
    <div style={{
      width: `${pct}%`, height, background: color, borderRadius: 999,
      transition: "width 0.7s cubic-bezier(0.4,0,0.2,1)"
    }} />
  </div>
);

const StatCard = ({ icon: Icon, label, value, trend, trendVal, color }) => (
  <div style={{
    background: "#fff",
    borderRadius: 16,
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    boxShadow: "0 1px 4px rgba(15,23,42,0.06), 0 4px 16px rgba(15,23,42,0.04)",
    border: "1px solid #e8edf5",
    transition: "box-shadow 0.2s, transform 0.2s",
    cursor: "default"
  }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(15,23,42,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(15,23,42,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
  >
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={22} style={{ color }} />
      </div>
      <span style={{
        display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600,
        color: trend === "up" ? "#22c55e" : "#ef4444"
      }}>
        {trend === "up" ? <TrendingUp size={13} /> : <TrendingDown size={13} />} {trendVal}
      </span>
    </div>
    <div>
      <div style={{ fontSize: 24, fontWeight: 700, color: "#0f172a" }}>{value}</div>
      <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{label}</div>
    </div>
  </div>
);

const Card = ({ children, style = {} }) => (
  <div style={{
    background: "#fff",
    borderRadius: 16,
    padding: 20,
    boxShadow: "0 1px 4px rgba(15,23,42,0.06), 0 4px 16px rgba(15,23,42,0.04)",
    border: "1px solid #e8edf5",
    ...style
  }}>{children}</div>
);

const CardTitle = ({ children }) => (
  <div style={{ fontSize: 14, fontWeight: 600, color: "#334155", marginBottom: 16 }}>{children}</div>
);

const SectionHeader = ({ title, subtitle }) => (
  <div style={{ marginBottom: 24 }}>
    <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", margin: 0 }}>{title}</h2>
    {subtitle && <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 4, marginBottom: 0 }}>{subtitle}</p>}
  </div>
);

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────

const DashboardPage = () => {
  const tips = ["Never reuse passwords across multiple services.", "Enable 2FA on all critical accounts.", "Verify sender identity before clicking links.", "Keep software and OS updated at all times."];
  const [tip] = useState(tips[Math.floor(Math.random() * tips.length)]);
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Welcome Banner */}
      <div style={{
        borderRadius: 20,
        padding: "28px 32px",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #1a237e 0%, #1565c0 55%, #006979 100%)",
        boxShadow: "0 8px 32px rgba(26,35,126,0.28)"
      }}>
        <div style={{ position: "absolute", right: -30, top: -30, opacity: 0.07 }}>
          <Shield size={200} />
        </div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ color: "#93c5fd", fontSize: 12, margin: 0 }}>{today}</p>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: "6px 0 0" }}>Welcome back, {MOCK_USER.name.split(" ")[0]}! 👋</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, fontSize: 13 }}>
            <Zap size={14} style={{ color: "#fde68a" }} />
            <span style={{ color: "#bfdbfe", fontStyle: "italic" }}>Tip: <span style={{ color: "#fff", fontStyle: "normal", fontWeight: 500 }}>{tip}</span></span>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
            {[["Cyber Score", MOCK_USER.score], ["Rank", "#5"], ["Badge", MOCK_USER.rank]].map(([label, val]) => (
              <div key={label} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "10px 18px", textAlign: "center", backdropFilter: "blur(8px)" }}>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{val}</div>
                <div style={{ fontSize: 11, color: "#bfdbfe" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <StatCard icon={BookOpen} label="Courses Completed" value={MOCK_USER.coursesCompleted} trend="up" trendVal="+3 this month" color="#1a237e" />
        <StatCard icon={AlertTriangle} label="Threats Detected" value={MOCK_USER.threatsDetected} trend="up" trendVal="+12 this week" color="#ef4444" />
        <StatCard icon={Brain} label="Avg Quiz Score" value={`${MOCK_USER.quizScore}%`} trend="up" trendVal="+5% vs last month" color="#7c4dff" />
        <StatCard icon={Mail} label="Phishing Tests Passed" value={MOCK_USER.phishingPassed} trend="down" trendVal="-1 this week" color="#00bcd4" />
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        <Card>
          <CardTitle>Weekly Awareness Score</CardTitle>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={WEEKLY_SCORES}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1a237e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#1a237e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e8edf5", fontSize: 12 }} />
              <Area type="monotone" dataKey="score" stroke="#1a237e" fill="url(#scoreGrad)" strokeWidth={2.5} dot={{ fill: "#1a237e", r: 4 }} />
              <Line type="monotone" dataKey="threats" stroke="#00bcd4" strokeWidth={2} dot={{ fill: "#00bcd4", r: 3 }} strokeDasharray="4 2" />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            {[["#1a237e", "Awareness Score"], ["#00bcd4", "Threats Flagged"]].map(([c, l]) => (
              <span key={l} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#94a3b8" }}>
                <span style={{ width: 14, height: 3, background: c, borderRadius: 2, display: "inline-block" }} />{l}
              </span>
            ))}
          </div>
        </Card>
        <Card>
          <CardTitle>Training by Category</CardTitle>
          <ResponsiveContainer width="100%" height={170}>
            <RePieChart>
              <Pie data={TRAINING_DATA} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="value">
                {TRAINING_DATA.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
            </RePieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
            {TRAINING_DATA.map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b" }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: d.color, display: "inline-block" }} />{d.name}
                </span>
                <span style={{ fontWeight: 600, color: "#334155" }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Threat Map */}
      <Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <CardTitle style={{ margin: 0 }}>Live Threat Map</CardTitle>
          <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#ef4444" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", display: "inline-block", animation: "pulse 1.5s infinite" }} /> LIVE
          </span>
        </div>
        <div style={{
          borderRadius: 14, overflow: "hidden", position: "relative",
          background: "linear-gradient(135deg, #0d1b4b 0%, #0a2744 100%)", height: 200
        }}>
          <svg viewBox="0 0 100 60" style={{ width: "100%", height: "100%", opacity: 0.18 }} preserveAspectRatio="xMidYMid meet">
            <path d="M10,25 C15,22 20,20 25,21 C28,18 32,17 36,19 C40,20 43,18 46,17 C50,16 54,18 58,17 C62,16 65,19 68,20 C72,18 75,17 78,19 C82,20 85,22 88,24 C85,28 82,30 78,31 C75,33 70,34 65,33 C60,35 55,36 50,35 C45,37 40,36 35,35 C30,37 25,36 20,34 C15,32 10,29 10,25 Z" fill="#1565c0" />
            <path d="M72,20 C75,18 80,17 85,18 C88,20 90,23 89,26 C88,28 85,30 82,31 C79,30 76,28 74,26 C72,24 71,22 72,20 Z" fill="#1565c0" />
            <rect x="2" y="30" width="12" height="8" rx="1" fill="#1565c0" />
          </svg>
          {THREAT_MAP_POINTS.map((p, i) => {
            const colors = { critical: "#ef4444", high: "#f97316", medium: "#eab308", low: "#22c55e" };
            const c = colors[p.intensity];
            return (
              <div key={i} style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%,-50%)" }}>
                <div style={{ position: "absolute", borderRadius: "50%", background: c + "30", width: p.size * 3, height: p.size * 3, transform: "translate(-50%,-50%)", animation: "ping 2s infinite" }} />
                <div style={{ borderRadius: "50%", width: p.size, height: p.size, background: c, boxShadow: `0 0 8px ${c}` }} />
              </div>
            );
          })}
          <div style={{ position: "absolute", bottom: 12, left: 12, display: "flex", gap: 14 }}>
            {Object.entries({ critical: "#ef4444", high: "#f97316", medium: "#eab308" }).map(([k, c]) => (
              <span key={k} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "rgba(255,255,255,0.8)" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: c, display: "inline-block" }} />
                {k.charAt(0).toUpperCase() + k.slice(1)}
              </span>
            ))}
          </div>
        </div>
      </Card>

      {/* Activity + Tasks */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <Card>
          <CardTitle>Recent Activity</CardTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {ACTIVITY_FEED.map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: a.color + "15", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <a.icon size={15} style={{ color: a.color }} />
                </div>
                <div>
                  <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.4 }}>{a.msg}</p>
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: "3px 0 0" }}>{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardTitle>Upcoming Tasks</CardTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {COURSES.filter(c => c.progress > 0 && c.progress < 100).slice(0, 4).map(c => (
              <div key={c.id} style={{ padding: "12px 14px", borderRadius: 12, background: "#f8fafc" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "75%" }}>{c.title}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: c.color, marginLeft: 8, flexShrink: 0 }}>{c.progress}%</span>
                </div>
                <ProgressBar pct={c.progress} color={c.color} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "#94a3b8" }}>
                  <span>{c.category}</span><span>{c.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// ─── COURSES PAGE ─────────────────────────────────────────────────────────────

const CoursesPage = () => {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const categories = ["All", "Phishing", "Malware", "Network Security", "Social Engineering", "Data Privacy"];
  const filtered = COURSES.filter(c =>
    (activeFilter === "All" || c.category === activeFilter) &&
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <SectionHeader title="Courses" subtitle="Expand your cybersecurity knowledge with curated modules" />
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses..."
            style={{ width: "100%", paddingLeft: 36, paddingRight: 16, paddingTop: 10, paddingBottom: 10, borderRadius: 12, border: "1px solid #e8edf5", fontSize: 13, outline: "none", background: "#f8fafc", boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveFilter(cat)} style={{
              padding: "8px 14px", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none",
              background: activeFilter === cat ? "#1a237e" : "#f1f5f9",
              color: activeFilter === cat ? "#fff" : "#64748b",
              transition: "all 0.15s"
            }}>{cat}</button>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {filtered.map(c => (
          <div key={c.id} onClick={() => setSelectedCourse(c)} style={{
            background: "#fff", borderRadius: 16, overflow: "hidden",
            boxShadow: "0 1px 4px rgba(15,23,42,0.06)", border: "1px solid #e8edf5",
            cursor: "pointer", transition: "box-shadow 0.2s, transform 0.2s"
          }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(15,23,42,0.1)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(15,23,42,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{ height: 110, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", background: `linear-gradient(135deg, ${c.color}dd, ${c.color}88)` }}>
              <Shield size={38} style={{ color: "rgba(255,255,255,0.55)" }} />
              <div style={{ position: "absolute", top: 10, right: 10 }}>
                <Badge label={c.difficulty} color={difficultyConfig[c.difficulty].color} bg={difficultyConfig[c.difficulty].bg} />
              </div>
            </div>
            <div style={{ padding: 16 }}>
              <p style={{ fontSize: 11, color: "#94a3b8", margin: "0 0 4px" }}>{c.category}</p>
              <h4 style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", margin: "0 0 10px", lineHeight: 1.4 }}>{c.title}</h4>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#94a3b8", marginBottom: 10 }}>
                <Clock size={11} /> {c.duration}
              </div>
              {c.enrolled && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8", marginBottom: 4 }}>
                    <span>Progress</span><span style={{ fontWeight: 600, color: c.color }}>{c.progress}%</span>
                  </div>
                  <ProgressBar pct={c.progress} color={c.color} />
                </div>
              )}
              <button style={{
                width: "100%", padding: "8px 0", borderRadius: 10, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer",
                background: c.enrolled ? c.color + "18" : c.color,
                color: c.enrolled ? c.color : "#fff",
                transition: "opacity 0.15s"
              }}>
                {c.progress === 100 ? "Review" : c.enrolled ? "Continue" : "Enroll"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedCourse && (
        <div onClick={() => setSelectedCourse(null)} style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 460, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.18)" }}>
            <div style={{ height: 130, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", background: `linear-gradient(135deg, ${selectedCourse.color}, ${selectedCourse.color}88)` }}>
              <Shield size={48} style={{ color: "rgba(255,255,255,0.45)" }} />
              <button onClick={() => setSelectedCourse(null)} style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", color: "rgba(255,255,255,0.8)", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <div style={{ padding: 24 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                <Badge label={selectedCourse.category} color={selectedCourse.color} />
                <Badge label={selectedCourse.difficulty} color={difficultyConfig[selectedCourse.difficulty].color} bg={difficultyConfig[selectedCourse.difficulty].bg} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: "0 0 8px" }}>{selectedCourse.title}</h3>
              <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 16px", lineHeight: 1.6 }}>A comprehensive module covering key concepts, real-world scenarios, and hands-on exercises to build your defensive skills.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                {["Introduction & Threat Overview", "Identification Techniques", "Practical Lab Exercises", "Assessment & Certification"].map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#374151" }}>
                    <CheckCircle size={14} style={{ color: selectedCourse.color, flexShrink: 0 }} /> {s}
                  </div>
                ))}
              </div>
              <button style={{
                width: "100%", padding: "13px 0", borderRadius: 12, fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer",
                background: `linear-gradient(135deg, ${selectedCourse.color}, ${selectedCourse.color}cc)`,
                color: "#fff", transition: "opacity 0.15s"
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                {selectedCourse.progress === 100 ? "Review Course" : selectedCourse.enrolled ? "Continue Learning" : "Start Course"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── THREATS PAGE ─────────────────────────────────────────────────────────────

const ThreatsPage = () => {
  const [severityFilter, setSeverityFilter] = useState("All");
  const filtered = THREATS.filter(t => severityFilter === "All" || t.severity === severityFilter);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <SectionHeader title="Threat Intelligence Feed" subtitle="Real-time cyber threat monitoring and analysis" />
        <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#ef4444", flexShrink: 0 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", display: "inline-block", animation: "pulse 1.5s infinite" }} /> LIVE
        </span>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {["All", "Critical", "High", "Medium", "Low"].map(s => (
          <button key={s} onClick={() => setSeverityFilter(s)} style={{
            padding: "8px 16px", borderRadius: 10, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer", transition: "all 0.15s",
            background: severityFilter === s ? (s === "All" ? "#1a237e" : severityConfig[s]?.color || "#1a237e") : "#f1f5f9",
            color: severityFilter === s ? "#fff" : "#64748b"
          }}>{s}</button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {filtered.map(t => {
          const sc = severityConfig[t.severity];
          return (
            <div key={t.id} style={{
              background: "#fff", borderRadius: 14, padding: "18px 20px",
              boxShadow: "0 1px 4px rgba(15,23,42,0.06)", border: "1px solid #e8edf5",
              borderLeft: `4px solid ${sc.color}`,
              transition: "box-shadow 0.2s"
            }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(15,23,42,0.09)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 4px rgba(15,23,42,0.06)"}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", margin: 0 }}>{t.name}</h4>
                    <Badge label={t.severity} color={sc.color} bg={sc.bg} />
                    <Badge label={t.type} color="#64748b" bg="#f1f5f9" />
                  </div>
                  <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 8px", lineHeight: 1.5 }}>{t.desc}</p>
                  <div style={{ display: "flex", gap: 18, fontSize: 12, color: "#94a3b8" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Monitor size={12} /> {t.systems}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Calendar size={12} /> {t.date}</span>
                  </div>
                </div>
                <button style={{
                  padding: "8px 16px", borderRadius: 10, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer",
                  background: sc.color + "18", color: sc.color, display: "flex", alignItems: "center", gap: 6, flexShrink: 0, transition: "opacity 0.15s"
                }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >
                  <Eye size={13} /> Details
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── PHISHING PAGE ────────────────────────────────────────────────────────────

const PhishingPage = () => {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [answered, setAnswered] = useState({});
  const [showResult, setShowResult] = useState(null);

  const handleAnswer = (isPhishing) => {
    const correct = isPhishing === selectedEmail.isPhishing;
    setAnswered(prev => ({ ...prev, [selectedEmail.id]: { correct, answered: isPhishing } }));
    setShowResult({ correct, email: selectedEmail });
  };

  return (
    <div>
      <SectionHeader title="Phishing Simulator" subtitle="Train your instincts to identify phishing attacks" />
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20 }}>
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8edf5", overflow: "hidden", boxShadow: "0 1px 4px rgba(15,23,42,0.06)" }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>Inbox</span>
            <span style={{ background: "#dbeafe", color: "#1d4ed8", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999 }}>
              {PHISHING_EMAILS.filter(e => !e.read).length} new
            </span>
          </div>
          {PHISHING_EMAILS.map(email => {
            const ans = answered[email.id];
            return (
              <div key={email.id} onClick={() => { setSelectedEmail(email); setShowResult(null); }} style={{
                padding: "14px 16px", borderBottom: "1px solid #f8fafc", cursor: "pointer",
                background: selectedEmail?.id === email.id ? "#eff6ff" : "transparent",
                transition: "background 0.15s"
              }}
                onMouseEnter={e => { if (selectedEmail?.id !== email.id) e.currentTarget.style.background = "#f8fafc"; }}
                onMouseLeave={e => { if (selectedEmail?.id !== email.id) e.currentTarget.style.background = "transparent"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 13, fontWeight: email.read ? 400 : 600, color: email.read ? "#64748b" : "#0f172a" }}>{email.from}</span>
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>{email.time}</span>
                </div>
                <p style={{ fontSize: 12, color: email.read ? "#94a3b8" : "#374151", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: email.read ? 400 : 500 }}>{email.subject}</p>
                {ans && (
                  <div style={{ marginTop: 4, fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 4, color: ans.correct ? "#22c55e" : "#ef4444" }}>
                    {ans.correct ? <CheckCircle size={11} /> : <XCircle size={11} />} {ans.correct ? "Correct!" : "Incorrect"}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div>
          {selectedEmail ? (
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8edf5", overflow: "hidden", boxShadow: "0 1px 4px rgba(15,23,42,0.06)" }}>
              <div style={{ padding: "18px 20px", borderBottom: "1px solid #f1f5f9" }}>
                <h4 style={{ fontSize: 15, fontWeight: 600, color: "#0f172a", margin: "0 0 6px" }}>{selectedEmail.subject}</h4>
                <div style={{ display: "flex", gap: 14, fontSize: 12, color: "#94a3b8" }}>
                  <span><strong style={{ color: "#64748b" }}>From:</strong> {selectedEmail.sender}</span>
                  <span>{selectedEmail.time}</span>
                </div>
              </div>
              <div style={{ padding: "18px 20px" }}>
                <pre style={{ fontSize: 13, color: "#374151", whiteSpace: "pre-wrap", fontFamily: "inherit", lineHeight: 1.7, margin: 0 }}>{selectedEmail.body}</pre>
              </div>
              {!answered[selectedEmail.id] && (
                <div style={{ padding: "16px 20px", borderTop: "1px solid #f1f5f9" }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#334155", margin: "0 0 12px" }}>Is this email legitimate or phishing?</p>
                  <div style={{ display: "flex", gap: 12 }}>
                    <button onClick={() => handleAnswer(true)} style={{
                      flex: 1, padding: "11px 0", borderRadius: 12, fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer",
                      background: "#ef4444", color: "#fff", transition: "opacity 0.15s"
                    }}>🎣 Phishing</button>
                    <button onClick={() => handleAnswer(false)} style={{
                      flex: 1, padding: "11px 0", borderRadius: 12, fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer",
                      background: "#22c55e", color: "#fff", transition: "opacity 0.15s"
                    }}>✅ Legitimate</button>
                  </div>
                </div>
              )}
              {answered[selectedEmail.id] && (() => {
                const ans = answered[selectedEmail.id];
                return (
                  <div style={{ padding: "16px 20px", borderTop: "1px solid #f1f5f9" }}>
                    <div style={{
                      borderRadius: 12, padding: 16,
                      background: ans.correct ? "#f0fdf4" : "#fef2f2",
                      border: `1px solid ${ans.correct ? "#bbf7d0" : "#fecaca"}`
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600, fontSize: 13, marginBottom: 8, color: ans.correct ? "#15803d" : "#b91c1c" }}>
                        {ans.correct ? <CheckCircle size={17} /> : <XCircle size={17} />}
                        {ans.correct ? "Correct! Well spotted." : `Incorrect. This was ${selectedEmail.isPhishing ? "PHISHING" : "LEGITIMATE"}.`}
                      </div>
                      {selectedEmail.isPhishing && selectedEmail.redFlags.map((f, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#374151", marginBottom: 4 }}>
                          <AlertCircle size={13} style={{ color: "#ef4444", flexShrink: 0, marginTop: 2 }} /> {f}
                        </div>
                      ))}
                      {!selectedEmail.isPhishing && <p style={{ fontSize: 13, color: "#15803d", margin: 0 }}>This email shows no phishing indicators and originates from a legitimate source.</p>}
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8edf5", height: 320, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: "#94a3b8", gap: 10 }}>
              <Mail size={38} style={{ opacity: 0.35 }} />
              <p style={{ fontSize: 14, margin: 0 }}>Select an email to analyze</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── QUIZ PAGE ────────────────────────────────────────────────────────────────

const QuizPage = () => {
  const [mode, setMode] = useState("list");
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState({});
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    if (mode !== "quiz") return;
    const timer = setInterval(() => setTimeLeft(t => t > 0 ? t - 1 : 0), 1000);
    return () => clearInterval(timer);
  }, [mode]);

  const startQuiz = () => { setMode("quiz"); setCurrentQ(0); setSelected({}); setTimeLeft(300); };
  const submitAnswer = (idx) => {
    const ns = { ...selected, [currentQ]: idx };
    setSelected(ns);
    if (currentQ < QUIZ_QUESTIONS.length - 1) setTimeout(() => setCurrentQ(q => q + 1), 400);
    else setTimeout(() => setMode("result"), 400);
  };
  const score = Object.entries(selected).filter(([qi, ans]) => QUIZ_QUESTIONS[parseInt(qi)].correct === ans).length;
  const pct = Math.round((score / QUIZ_QUESTIONS.length) * 100);

  if (mode === "result") return (
    <div>
      <SectionHeader title="Quiz Results" />
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <Card>
          <div style={{ textAlign: "center", padding: "8px 0 24px" }}>
            <div style={{
              width: 120, height: 120, borderRadius: "50%", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center",
              background: pct >= 80 ? "#f0fdf4" : pct >= 60 ? "#fefce8" : "#fef2f2",
              border: `6px solid ${pct >= 80 ? "#22c55e" : pct >= 60 ? "#eab308" : "#ef4444"}`
            }}>
              <div>
                <div style={{ fontSize: 30, fontWeight: 700, color: pct >= 80 ? "#22c55e" : pct >= 60 ? "#eab308" : "#ef4444" }}>{pct}%</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>{score}/{QUIZ_QUESTIONS.length}</div>
              </div>
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: "0 0 6px" }}>{pct >= 80 ? "Excellent Work! 🏆" : pct >= 60 ? "Good Effort! 👍" : "Keep Practicing! 💪"}</h3>
            <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 24px" }}>{pct >= 80 ? "Outstanding performance! Strong grasp of cybersecurity principles." : "You're on the right track. Review missed questions to improve."}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, textAlign: "left", marginBottom: 24 }}>
              {QUIZ_QUESTIONS.map((q, i) => {
                const ans = selected[i];
                const correct = ans === q.correct;
                return (
                  <div key={i} style={{ borderRadius: 10, padding: "10px 12px", background: correct ? "#f0fdf4" : "#fef2f2" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, fontWeight: 500, color: correct ? "#15803d" : "#b91c1c" }}>
                      {correct ? <CheckCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} /> : <XCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />}
                      Q{i + 1}: {q.q}
                    </div>
                    {!correct && <p style={{ fontSize: 12, color: "#64748b", margin: "4px 0 0 23px" }}>✓ {q.options[q.correct]}</p>}
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={startQuiz} style={{ flex: 1, padding: "12px 0", borderRadius: 12, fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer", background: "#1a237e", color: "#fff" }}>Retry Quiz</button>
              <button onClick={() => setMode("list")} style={{ flex: 1, padding: "12px 0", borderRadius: 12, fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer", background: "#f1f5f9", color: "#64748b" }}>Back</button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  if (mode === "quiz") {
    const q = QUIZ_QUESTIONS[currentQ];
    const mins = Math.floor(timeLeft / 60).toString().padStart(2, "0");
    const secs = (timeLeft % 60).toString().padStart(2, "0");
    return (
      <div>
        <SectionHeader title="Cybersecurity Assessment" subtitle="Cybersecurity Fundamentals — 5 Questions" />
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <Card>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>Question {currentQ + 1} of {QUIZ_QUESTIONS.length}</span>
              <span style={{
                display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600,
                padding: "5px 12px", borderRadius: 10,
                background: timeLeft < 60 ? "#fef2f2" : "#dbeafe",
                color: timeLeft < 60 ? "#dc2626" : "#1d4ed8"
              }}>
                <Clock size={13} /> {mins}:{secs}
              </span>
            </div>
            <ProgressBar pct={((currentQ + 1) / QUIZ_QUESTIONS.length) * 100} color="#1a237e" height={7} />
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#0f172a", margin: "20px 0 20px", lineHeight: 1.5 }}>{q.q}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {q.options.map((opt, i) => {
                const chosen = selected[currentQ];
                const isSelected = chosen === i;
                const isCorrect = q.correct === i;
                let bg = "#f8fafc", border = "#e2e8f0", color = "#374151";
                if (chosen !== undefined) {
                  if (isCorrect) { bg = "#f0fdf4"; border = "#22c55e"; color = "#15803d"; }
                  else if (isSelected) { bg = "#fef2f2"; border = "#ef4444"; color = "#b91c1c"; }
                }
                return (
                  <button key={i} onClick={() => chosen === undefined && submitAnswer(i)} style={{
                    width: "100%", textAlign: "left", padding: "13px 16px", borderRadius: 12,
                    border: `2px solid ${border}`, background: bg, color, fontSize: 13, fontWeight: 500,
                    cursor: chosen === undefined ? "pointer" : "default", transition: "all 0.15s",
                    display: "flex", alignItems: "center", gap: 10
                  }}>
                    <span style={{ width: 24, height: 24, borderRadius: "50%", background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const quizList = [
    { title: "Cybersecurity Fundamentals", questions: 5, time: "5 min", difficulty: "Intermediate", color: "#1a237e", score: 91 },
    { title: "Phishing Recognition", questions: 8, time: "8 min", difficulty: "Beginner", color: "#00bcd4", score: 88 },
    { title: "Network Security Deep Dive", questions: 10, time: "12 min", difficulty: "Advanced", color: "#7c4dff", score: null },
    { title: "Social Engineering Defense", questions: 6, time: "6 min", difficulty: "Intermediate", color: "#ff6f00", score: 75 },
    { title: "Incident Response", questions: 7, time: "10 min", difficulty: "Advanced", color: "#ef4444", score: null },
    { title: "Data Privacy & Compliance", questions: 5, time: "5 min", difficulty: "Beginner", color: "#00897b", score: 95 },
  ];

  return (
    <div>
      <SectionHeader title="Quiz & Assessments" subtitle="Test your cybersecurity knowledge across various domains" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {quizList.map((quiz, i) => (
          <div key={i} style={{
            background: "#fff", borderRadius: 16, padding: 20,
            boxShadow: "0 1px 4px rgba(15,23,42,0.06)", border: "1px solid #e8edf5",
            transition: "box-shadow 0.2s, transform 0.2s"
          }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(15,23,42,0.09)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(15,23,42,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 12, background: quiz.color + "18", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <Brain size={24} style={{ color: quiz.color }} />
            </div>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", margin: "0 0 6px" }}>{quiz.title}</h4>
            <div style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 12, color: "#94a3b8", marginBottom: 12 }}>
              <span>{quiz.questions} Questions</span><span>•</span><span>{quiz.time}</span>
            </div>
            <Badge label={quiz.difficulty} color={difficultyConfig[quiz.difficulty].color} bg={difficultyConfig[quiz.difficulty].bg} />
            {quiz.score && (
              <div style={{ marginTop: 10, fontSize: 12, color: "#64748b" }}>Last score: <strong style={{ color: quiz.color }}>{quiz.score}%</strong></div>
            )}
            <button onClick={i === 0 ? startQuiz : undefined} style={{
              width: "100%", marginTop: 16, padding: "10px 0", borderRadius: 12, fontWeight: 600, fontSize: 13, border: "none",
              cursor: "pointer", background: quiz.color, color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 7, transition: "opacity 0.15s"
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              <Play size={13} /> {quiz.score ? "Retry" : "Start Quiz"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── LEADERBOARD PAGE ─────────────────────────────────────────────────────────

const LeaderboardPage = () => {
  const [tab, setTab] = useState("all");
  return (
    <div>
      <SectionHeader title="Leaderboard" subtitle="Top performers in cybersecurity awareness" />
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {["weekly", "monthly", "all"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "8px 16px", borderRadius: 10, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer", textTransform: "capitalize", transition: "all 0.15s",
            background: tab === t ? "#1a237e" : "#f1f5f9",
            color: tab === t ? "#fff" : "#64748b"
          }}>{t === "all" ? "All Time" : t}</button>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 20, marginBottom: 32 }}>
        {[LEADERBOARD[1], LEADERBOARD[0], LEADERBOARD[2]].map((u, i) => {
          const heights = [110, 145, 95];
          const medals = ["🥈", "🥇", "🥉"];
          const colors = ["#94a3b8", "#f59e0b", "#cd7f32"];
          return (
            <div key={u.rank} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: colors[i], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 8, boxShadow: `0 4px 14px ${colors[i]}60` }}>{u.avatar}</div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#334155", margin: "0 0 2px", textAlign: "center" }}>{u.name.split(" ")[0]}</p>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 10px" }}>{u.score} pts</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "14px 14px 0 0", width: 76, fontSize: 28, background: colors[i] + "22", border: `2px solid ${colors[i]}44`, height: heights[i] }}>
                {medals[i]}
              </div>
            </div>
          );
        })}
      </div>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {["Rank", "User", "Department", "Score", "Badges"].map(h => (
                <th key={h} style={{ textAlign: "left", fontSize: 11, fontWeight: 600, color: "#94a3b8", padding: "12px 20px", letterSpacing: "0.05em", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {LEADERBOARD.map(u => (
              <tr key={u.rank} style={{ borderTop: "1px solid #f1f5f9", background: u.isCurrentUser ? "#eff6ff" : "transparent", transition: "background 0.15s" }}
                onMouseEnter={e => { if (!u.isCurrentUser) e.currentTarget.style.background = "#f8fafc"; }}
                onMouseLeave={e => { if (!u.isCurrentUser) e.currentTarget.style.background = "transparent"; }}
              >
                <td style={{ padding: "14px 20px" }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700,
                    background: u.rank === 1 ? "#f59e0b" : u.rank === 2 ? "#94a3b8" : u.rank === 3 ? "#cd7f32" : "#f1f5f9",
                    color: u.rank <= 3 ? "#fff" : "#64748b"
                  }}>{u.rank}</div>
                </td>
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#1a237e", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{u.avatar}</div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{u.name} {u.isCurrentUser && <span style={{ fontSize: 11, color: "#3b82f6" }}>(You)</span>}</span>
                  </div>
                </td>
                <td style={{ padding: "14px 20px", fontSize: 13, color: "#64748b" }}>{u.dept}</td>
                <td style={{ padding: "14px 20px", fontSize: 13, fontWeight: 700, color: "#1a237e" }}>{u.score.toLocaleString()}</td>
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
                    {Array.from({ length: Math.min(u.badges, 5) }).map((_, i) => <Star key={i} size={13} fill="#f59e0b" style={{ color: "#f59e0b" }} />)}
                    {u.badges > 5 && <span style={{ fontSize: 11, color: "#94a3b8" }}>+{u.badges - 5}</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

// ─── REPORTS PAGE ─────────────────────────────────────────────────────────────

const ReportsPage = () => (
  <div>
    <SectionHeader title="Reports & Analytics" subtitle="Detailed performance insights and compliance tracking" />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
      {[
        { label: "Monthly Report", desc: "Jan 2025", icon: FileText, color: "#1a237e" },
        { label: "Security Audit", desc: "Q4 2024", icon: Shield, color: "#7c4dff" },
        { label: "Training Summary", desc: "Annual 2024", icon: BookOpen, color: "#00bcd4" },
      ].map((r, i) => (
        <Card key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: r.color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <r.icon size={22} style={{ color: r.color }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 600, color: "#334155", fontSize: 14, margin: 0 }}>{r.label}</p>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: "2px 0 0" }}>{r.desc}</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {["PDF", "CSV"].map(fmt => (
              <button key={fmt} style={{ padding: "6px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600, border: "none", cursor: "pointer", background: "#f1f5f9", color: "#64748b", display: "flex", alignItems: "center", gap: 4 }}>
                <Download size={11} /> {fmt}
              </button>
            ))}
          </div>
        </Card>
      ))}
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
      <Card>
        <CardTitle>Monthly Quiz Performance</CardTitle>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={MONTHLY_QUIZ}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={[0, 100]} />
            <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e8edf5", fontSize: 12 }} />
            <Bar dataKey="score" fill="#1a237e" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <Card>
        <CardTitle>Domain Completion Progress</CardTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {DOMAIN_PROGRESS.map((d, i) => (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                <span style={{ color: "#374151" }}>{d.domain}</span>
                <span style={{ fontWeight: 600, color: d.color }}>{d.pct}%</span>
              </div>
              <ProgressBar pct={d.pct} color={d.color} height={8} />
            </div>
          ))}
        </div>
      </Card>
    </div>
    <Card style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#334155" }}>Module Completion History</span>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {["Module", "Category", "Completed", "Score", "Status"].map(h => (
                <th key={h} style={{ textAlign: "left", fontSize: 11, fontWeight: 600, color: "#94a3b8", padding: "10px 20px", letterSpacing: "0.05em", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COURSES.filter(c => c.enrolled && c.progress > 0).map(c => (
              <tr key={c.id} style={{ borderTop: "1px solid #f1f5f9" }}
                onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <td style={{ padding: "12px 20px", fontSize: 13, fontWeight: 500, color: "#334155" }}>{c.title}</td>
                <td style={{ padding: "12px 20px" }}><Badge label={c.category} color={c.color} /></td>
                <td style={{ padding: "12px 20px", fontSize: 13, color: "#64748b" }}>Jan {c.id + 5}, 2025</td>
                <td style={{ padding: "12px 20px", fontSize: 13, fontWeight: 700, color: c.color }}>{c.progress >= 100 ? `${70 + c.id * 3}%` : "In Progress"}</td>
                <td style={{ padding: "12px 20px" }}><Badge label={c.progress >= 100 ? "Completed" : "In Progress"} color={c.progress >= 100 ? "#22c55e" : "#f97316"} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);

// ─── SETTINGS PAGE ────────────────────────────────────────────────────────────

const SettingsPage = () => {
  const [twoFA, setTwoFA] = useState(false);
  const [notifications, setNotifications] = useState({ email: true, push: true, digest: false, threats: true });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [fontSize, setFontSize] = useState(14);

  const Toggle = ({ on, onChange }) => (
    <button onClick={() => onChange(!on)} style={{
      position: "relative", width: 48, height: 26, borderRadius: 999, border: "none", cursor: "pointer", padding: 0,
      background: on ? "#3b82f6" : "#cbd5e1", transition: "background 0.2s"
    }}>
      <span style={{
        position: "absolute", top: 3, left: on ? 24 : 3,
        width: 20, height: 20, borderRadius: "50%", background: "#fff",
        boxShadow: "0 1px 4px rgba(0,0,0,0.15)", transition: "left 0.2s"
      }} />
    </button>
  );

  return (
    <div style={{ maxWidth: 680 }}>
      <SectionHeader title="Settings" subtitle="Manage your account, security, and preferences" />
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, fontSize: 14, fontWeight: 600, color: "#334155" }}>
          <User size={15} style={{ color: "#3b82f6" }} /> Account Settings
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          {[["Full Name", MOCK_USER.name], ["Email", MOCK_USER.email], ["Department", MOCK_USER.department], ["Phone", MOCK_USER.phone]].map(([label, val]) => (
            <div key={label}>
              <label style={{ fontSize: 11, fontWeight: 500, color: "#94a3b8", display: "block", marginBottom: 5 }}>{label}</label>
              <input defaultValue={val} style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #e8edf5", fontSize: 13, outline: "none", boxSizing: "border-box", transition: "border-color 0.15s" }}
                onFocus={e => e.target.style.borderColor = "#3b82f6"}
                onBlur={e => e.target.style.borderColor = "#e8edf5"} />
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 500, color: "#94a3b8", display: "block", marginBottom: 5 }}>New Password</label>
          <div style={{ position: "relative" }}>
            <input type={showPass ? "text" : "password"} placeholder="••••••••" style={{ width: "100%", padding: "10px 40px 10px 12px", borderRadius: 10, border: "1px solid #e8edf5", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
            <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>
        <button style={{ padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", background: "#1a237e", color: "#fff", display: "flex", alignItems: "center", gap: 8 }}>
          <Save size={14} /> Save Changes
        </button>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, fontSize: 14, fontWeight: 600, color: "#334155" }}>
          <Lock size={15} style={{ color: "#7c4dff" }} /> Security Settings
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderRadius: 12, background: "#f8fafc", marginBottom: 14 }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#334155", margin: 0 }}>Two-Factor Authentication</p>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: "3px 0 0" }}>Secure your account with 2FA</p>
          </div>
          <Toggle on={twoFA} onChange={setTwoFA} />
        </div>
        {twoFA && (
          <div style={{ padding: 14, borderRadius: 12, background: "#f0fdf4", border: "1px solid #bbf7d0", display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
            <div style={{ width: 80, height: 80, borderRadius: 10, background: "#1a237e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 12px)", gap: 2, opacity: 0.5 }}>
                {Array.from({ length: 25 }).map((_, i) => <div key={i} style={{ width: 12, height: 12, borderRadius: 2, background: Math.random() > 0.5 ? "#fff" : "transparent" }} />)}
              </div>
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#15803d", margin: "0 0 4px" }}>2FA Enabled</p>
              <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>Scan this QR code with your authenticator app</p>
            </div>
          </div>
        )}
        <p style={{ fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 10 }}>Active Sessions</p>
        {[{ device: "Chrome — Windows 11", loc: "Mumbai, India", time: "Active now", current: true }, { device: "Firefox — macOS", loc: "Pune, India", time: "2 days ago", current: false }].map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: 10, background: "#f8fafc", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Monitor size={15} style={{ color: "#94a3b8" }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, color: "#334155", margin: 0 }}>{s.device}</p>
                <p style={{ fontSize: 11, color: "#94a3b8", margin: "2px 0 0" }}>{s.loc} · {s.time}</p>
              </div>
            </div>
            {s.current ? <span style={{ fontSize: 11, fontWeight: 600, color: "#22c55e" }}>Current</span>
              : <button style={{ fontSize: 12, fontWeight: 600, color: "#ef4444", border: "none", background: "none", cursor: "pointer" }}>Revoke</button>}
          </div>
        ))}
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, fontSize: 14, fontWeight: 600, color: "#334155" }}>
          <Bell size={15} style={{ color: "#f59e0b" }} /> Notification Preferences
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { key: "email", label: "Email Alerts", desc: "Receive security alerts via email" },
            { key: "push", label: "Push Notifications", desc: "Browser and mobile push notifications" },
            { key: "digest", label: "Weekly Digest", desc: "Summary of your weekly progress" },
            { key: "threats", label: "Threat Alerts", desc: "Critical threat intelligence notifications" },
          ].map(item => (
            <div key={item.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, color: "#334155", margin: 0 }}>{item.label}</p>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: "2px 0 0" }}>{item.desc}</p>
              </div>
              <Toggle on={notifications[item.key]} onChange={v => setNotifications(n => ({ ...n, [item.key]: v }))} />
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ border: "1px solid #fecaca" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, fontSize: 14, fontWeight: 600, color: "#ef4444" }}>
          <AlertTriangle size={15} /> Danger Zone
        </div>
        <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16, marginTop: 0 }}>Once you delete your account, there is no going back. Please be certain.</p>
        <button onClick={() => setShowDeleteModal(true)} style={{ padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", background: "#ef4444", color: "#fff", display: "flex", alignItems: "center", gap: 8 }}>
          <Trash2 size={14} /> Delete My Account
        </button>
      </Card>

      {showDeleteModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.45)" }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: 28, width: "100%", maxWidth: 360, boxShadow: "0 24px 64px rgba(0,0,0,0.18)" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <AlertTriangle size={24} style={{ color: "#ef4444" }} />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", margin: "0 0 8px" }}>Delete Account?</h3>
            <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 24px", lineHeight: 1.6 }}>This action is permanent and cannot be undone. All your data, progress, and certifications will be lost.</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setShowDeleteModal(false)} style={{ flex: 1, padding: "11px 0", borderRadius: 10, fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", background: "#f1f5f9", color: "#64748b" }}>Cancel</button>
              <button style={{ flex: 1, padding: "11px 0", borderRadius: 10, fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", background: "#ef4444", color: "#fff" }}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── PROFILE PAGE ─────────────────────────────────────────────────────────────

const ProfilePage = () => {
  const [editing, setEditing] = useState(false);
  return (
    <div style={{ maxWidth: 680 }}>
      <SectionHeader title="My Profile" subtitle="Manage your personal information and security credentials" />
      <Card style={{ padding: 0, overflow: "hidden", marginBottom: 16 }}>
        <div style={{ height: 130, background: "linear-gradient(135deg, #1a237e, #0097a7)", position: "relative", cursor: "pointer" }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0 }} className="coverHover">
            <div style={{ background: "rgba(255,255,255,0.9)", borderRadius: 10, padding: "7px 14px", display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: "#374151" }}>
              <Camera size={13} /> Change Cover
            </div>
          </div>
        </div>
        <div style={{ padding: "0 24px 24px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 16, marginTop: -30 }}>
            <div style={{ width: 76, height: 76, borderRadius: "50%", border: "4px solid #fff", background: "#1a237e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: "#fff", boxShadow: "0 4px 16px rgba(26,35,126,0.28)" }}>AS</div>
            <button onClick={() => setEditing(!editing)} style={{
              padding: "8px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer",
              background: editing ? "#f1f5f9" : "#1a237e",
              color: editing ? "#64748b" : "#fff",
              display: "flex", alignItems: "center", gap: 7
            }}>
              {editing ? <><X size={13} /> Cancel</> : <><Edit size={13} /> Edit Profile</>}
            </button>
          </div>
          <h2 style={{ fontSize: 19, fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>{MOCK_USER.name}</h2>
          <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 10px" }}>{MOCK_USER.role} · {MOCK_USER.department}</p>
          <div style={{ display: "flex", gap: 8 }}>
            <Badge label={MOCK_USER.rank} color="#f59e0b" bg="#fffbeb" />
            <Badge label={`Score: ${MOCK_USER.score}`} color="#1a237e" bg="#e8eaf6" />
          </div>
        </div>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <CardTitle>Personal Information</CardTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[["Full Name", MOCK_USER.name], ["Email", MOCK_USER.email], ["Phone", MOCK_USER.phone], ["Department", MOCK_USER.department], ["Joined", MOCK_USER.joinDate]].map(([k, v]) => (
              <div key={k}>
                <label style={{ fontSize: 11, color: "#94a3b8", display: "block", marginBottom: 4 }}>{k}</label>
                {editing
                  ? <input defaultValue={v} style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #e8edf5", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                  : <p style={{ fontSize: 13, fontWeight: 500, color: "#334155", margin: 0 }}>{v}</p>
                }
              </div>
            ))}
            {editing && <button style={{ padding: "10px 0", borderRadius: 10, fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", background: "#1a237e", color: "#fff" }}>Save Changes</button>}
          </div>
        </Card>
        <Card>
          <CardTitle>Performance Stats</CardTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
            {[
              { label: "Courses Done", val: MOCK_USER.coursesCompleted, color: "#1a237e" },
              { label: "Threats Detected", val: MOCK_USER.threatsDetected, color: "#ef4444" },
              { label: "Quiz Score", val: MOCK_USER.quizScore + "%", color: "#7c4dff" },
              { label: "Phishing Passed", val: MOCK_USER.phishingPassed, color: "#00bcd4" },
            ].map(s => (
              <div key={s.label} style={{ borderRadius: 12, padding: "12px 14px", background: s.color + "10", textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <CardTitle>Activity Timeline</CardTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 180, overflowY: "auto" }}>
            {ACTIVITY_FEED.map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <a.icon size={13} style={{ color: a.color, flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p style={{ fontSize: 12, color: "#374151", margin: 0 }}>{a.msg}</p>
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: "2px 0 0" }}>{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// ─── NOTIFICATIONS DRAWER ─────────────────────────────────────────────────────

const NotificationsDrawer = ({ open, onClose }) => {
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const markAll = () => setNotifs(n => n.map(x => ({ ...x, unread: false })));
  const clearAll = () => setNotifs([]);
  const unreadCount = notifs.filter(n => n.unread).length;

  return (
    <>
      {open && <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 40 }} />}
      <div style={{
        position: "fixed", top: 0, right: 0, height: "100%", zIndex: 50,
        width: 350, background: "#fff", boxShadow: "-4px 0 30px rgba(15,23,42,0.1)",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
        display: "flex", flexDirection: "column"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#0f172a" }}>Notifications</span>
            {unreadCount > 0 && <span style={{ background: "#ef4444", color: "#fff", fontSize: 10, padding: "2px 7px", borderRadius: 999, fontWeight: 700 }}>{unreadCount}</span>}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><X size={19} /></button>
        </div>
        <div style={{ display: "flex", gap: 12, padding: "12px 20px", borderBottom: "1px solid #f1f5f9" }}>
          <button onClick={markAll} style={{ fontSize: 12, fontWeight: 600, color: "#3b82f6", background: "none", border: "none", cursor: "pointer" }}>Mark all as read</button>
          <span style={{ color: "#e2e8f0" }}>|</span>
          <button onClick={clearAll} style={{ fontSize: 12, fontWeight: 600, color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}>Clear all</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {notifs.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 160, color: "#94a3b8", gap: 10 }}>
              <Bell size={30} style={{ opacity: 0.3 }} />
              <p style={{ fontSize: 14, margin: 0 }}>No notifications</p>
            </div>
          ) : notifs.map(n => (
            <div key={n.id} style={{
              display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 20px",
              borderBottom: "1px solid #f8fafc", cursor: "pointer",
              background: n.unread ? n.color + "07" : "transparent",
              transition: "background 0.15s"
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: n.color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <n.icon size={15} style={{ color: n.color }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: n.unread ? 600 : 400, color: n.unread ? "#0f172a" : "#64748b", margin: "0 0 3px", lineHeight: 1.4 }}>{n.msg}</p>
                <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{n.time}</p>
              </div>
              {n.unread && <span style={{ width: 8, height: 8, borderRadius: "50%", background: n.color, flexShrink: 0, marginTop: 6 }} />}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length;

  const pages = {
    dashboard: <DashboardPage />,
    courses: <CoursesPage />,
    threats: <ThreatsPage />,
    phishing: <PhishingPage />,
    quiz: <QuizPage />,
    reports: <ReportsPage />,
    leaderboard: <LeaderboardPage />,
    settings: <SettingsPage />,
    profile: <ProfilePage />,
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: "'DM Sans', 'Outfit', system-ui, sans-serif", background: "#f1f5f9" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes ping {
          0% { transform: translate(-50%,-50%) scale(0.8); opacity: 0.8; }
          100% { transform: translate(-50%,-50%) scale(2.5); opacity: 0; }
        }
        .page-content { animation: fadeSlideUp 0.25s cubic-bezier(0.4,0,0.2,1); }
        button:focus { outline: none; }
        input:focus { outline: none; }
        select:focus { outline: none; }
        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .charts-grid { grid-template-columns: 1fr !important; }
          .courses-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .quiz-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {/* Sidebar */}
      <aside style={{
        display: "flex", flexDirection: "column", height: "100%", flexShrink: 0,
        width: sidebarCollapsed ? 68 : 228, transition: "width 0.28s cubic-bezier(0.4,0,0.2,1)",
        background: "#fff", borderRight: "1px solid #e8edf5"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "18px 16px", borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #1a237e, #0097a7)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Shield size={18} style={{ color: "#fff" }} />
          </div>
          {!sidebarCollapsed && <span style={{ fontWeight: 700, fontSize: 15, color: "#0f172a", letterSpacing: "-0.01em" }}>CyberShield</span>}
        </div>

        <nav style={{ flex: 1, overflowY: "auto", padding: "12px 10px" }}>
          {NAV_ITEMS.map(item => {
            const active = activePage === item.id;
            return (
              <button key={item.id} onClick={() => setActivePage(item.id)} title={sidebarCollapsed ? item.label : ""}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10,
                  padding: sidebarCollapsed ? "10px 0" : "10px 12px",
                  justifyContent: sidebarCollapsed ? "center" : "flex-start",
                  borderRadius: 10, marginBottom: 2, border: "none", cursor: "pointer", textAlign: "left",
                  background: active ? "#1a237e" : "transparent",
                  color: active ? "#fff" : "#64748b",
                  transition: "all 0.15s"
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = "#f1f5f9"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                <item.icon size={17} style={{ color: active ? "#fff" : "#94a3b8", flexShrink: 0 }} />
                {!sidebarCollapsed && <span style={{ fontSize: 13, fontWeight: 500 }}>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: "10px", borderTop: "1px solid #f1f5f9" }}>
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "8px 0", borderRadius: 8, border: "none", cursor: "pointer",
            background: "transparent", color: "#94a3b8", fontSize: 12, transition: "background 0.15s"
          }}
            onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            {sidebarCollapsed ? <ChevronRight size={15} /> : <><ChevronLeft size={15} /><span>Collapse</span></>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
        {/* Header */}
        <header style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 24px", height: 60, flexShrink: 0,
          background: "#fff", borderBottom: "1px solid #e8edf5"
        }}>
          <div style={{ position: "relative", width: 280 }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input value={searchVal} onChange={e => setSearchVal(e.target.value)} placeholder="Search anything..."
              style={{ width: "100%", paddingLeft: 34, paddingRight: 14, paddingTop: 8, paddingBottom: 8, borderRadius: 10, border: "1px solid #e8edf5", fontSize: 13, background: "#f8fafc", boxSizing: "border-box" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => setNotifOpen(!notifOpen)} style={{ position: "relative", padding: 8, borderRadius: 10, border: "none", cursor: "pointer", background: "transparent", transition: "background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <Bell size={18} style={{ color: "#64748b" }} />
              {unreadCount > 0 && (
                <span style={{ position: "absolute", top: 5, right: 5, width: 16, height: 16, borderRadius: "50%", background: "#ef4444", color: "#fff", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{unreadCount}</span>
              )}
            </button>
            <div style={{ position: "relative" }}>
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} style={{
                display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 10,
                border: "none", cursor: "pointer", background: "transparent", transition: "background 0.15s"
              }}
                onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#1a237e", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>AS</div>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#334155" }}>{MOCK_USER.name.split(" ")[0]}</span>
                <ChevronDown size={13} style={{ color: "#94a3b8" }} />
              </button>
              {userMenuOpen && (
                <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", width: 200, background: "#fff", borderRadius: 14, boxShadow: "0 8px 30px rgba(15,23,42,0.12)", border: "1px solid #e8edf5", zIndex: 50, overflow: "hidden" }}>
                  <div style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", margin: 0 }}>{MOCK_USER.name}</p>
                    <p style={{ fontSize: 11, color: "#94a3b8", margin: "2px 0 0" }}>{MOCK_USER.role}</p>
                  </div>
                  {[{ label: "Profile", icon: User, page: "profile" }, { label: "Settings", icon: Settings, page: "settings" }].map(item => (
                    <button key={item.label} onClick={() => { setActivePage(item.page); setUserMenuOpen(false); }}
                      style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", fontSize: 13, color: "#374151", border: "none", cursor: "pointer", background: "transparent", textAlign: "left", transition: "background 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <item.icon size={14} style={{ color: "#94a3b8" }} /> {item.label}
                    </button>
                  ))}
                  <div style={{ borderTop: "1px solid #f1f5f9" }}>
                    <button style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", fontSize: 13, color: "#ef4444", border: "none", cursor: "pointer", background: "transparent", textAlign: "left" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page */}
        <main style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          <div key={activePage} className="page-content">
            {pages[activePage]}
          </div>
        </main>
      </div>

      <NotificationsDrawer open={notifOpen} onClose={() => setNotifOpen(false)} />
      {userMenuOpen && <div onClick={() => setUserMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />}
    </div>
  );
}