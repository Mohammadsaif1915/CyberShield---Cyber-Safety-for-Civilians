import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield, BarChart2, Bell, Users, Activity, LogOut, Menu, X,
  TrendingUp, Award, Zap, Target, AlertTriangle, CheckCircle,
  Eye, Lock, Settings, Download, RefreshCw, Clock, Wifi, Radio,
  Database, Layers, Globe, Cpu, Server, Heart, AlertCircle,
  ChevronRight, DollarSign, Flame, Trophy, GraduationCap, Gamepad2,
  Edit2, Trash2, Search, Filter, MoreVertical, ArrowUp, ArrowDown, Plus,
  IndianRupee, Video, HelpCircle, BookOpen, Mail, Send, CheckSquare
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from "recharts";

// ── THEME ─────────────────────────────────────────────────────
const THEME = {
  bg: "#F8FAFC",
  surface: "#FFFFFF",
  surfaceHov: "#F1F5F9",
  card: "#FFFFFF",
  border: "rgba(79,70,229,0.15)",
  brand: "#4F46E5",
  brandDark: "#3730A3",
  brandGlow: "rgba(79,70,229,0.15)",
  teal: "#06B6D4",
  tealGlow: "rgba(6,182,212,0.15)",
  violet: "#7C3AED",
  violetGlow: "rgba(124,58,237,0.15)",
  amber: "#F59E0B",
  amberGlow: "rgba(245,158,11,0.15)",
  red: "#EF4444",
  redGlow: "rgba(239,68,68,0.15)",
  green: "#10B981",
  greenGlow: "rgba(16,185,129,0.15)",
  pink: "#EC4899",
  pinkGlow: "rgba(236,72,153,0.15)",
  cyan: "#06B6D4",
  cyanGlow: "rgba(6,182,212,0.15)",
  orange: "#F97316",
  orangeGlow: "rgba(249,115,22,0.15)",
  text: "#1E293B",
  textMd: "#475569",
  textDim: "#64748B",
  sh: "0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05)",
  shMd: "0 20px 25px rgba(0,0,0,0.08), 0 10px 10px rgba(0,0,0,0.04)",
  shLg: "0 25px 50px rgba(0,0,0,0.1)",
};

// ── API CONFIG ────────────────────────────────────────────────
const API_URL = (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL)
  ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')
  : "http://localhost:5000";

const CERT_PRICE = 100; // ₹100 per certificate

const apiFetch = async (path, opts = {}) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...opts.headers,
    },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
};

// ── HELPERS ───────────────────────────────────────────────────
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" }) : "-";
const fmtTime = (d) => d ? new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "-";
const fmtNum = (n) => new Intl.NumberFormat("en-IN").format(n || 0);
const fmtRupee = (n) => `₹${new Intl.NumberFormat("en-IN").format(n || 0)}`;

// ── ANIMATED COUNTER ──────────────────────────────────────────
const Counter = ({ value, duration = 1.5 }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = (value || 0) / (duration * 60);
    const interval = setInterval(() => {
      start += increment;
      if (start >= (value || 0)) { setCount(value || 0); clearInterval(interval); }
      else setCount(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(interval);
  }, [value, duration]);
  return fmtNum(count);
};

// ── STAT CARD ─────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, change, color = "brand", subtext }) => {
  const c = THEME[color] || THEME.brand;
  return (
    <div style={{
      background: `linear-gradient(135deg, ${THEME.card} 0%, ${THEME.surfaceHov} 100%)`,
      border: `2px solid ${THEME.border}`, borderRadius: "20px", padding: "24px",
      boxShadow: `${THEME.shMd}, 0 0 30px ${c}20`,
      display: "flex", justifyContent: "space-between", alignItems: "flex-start",
      position: "relative", overflow: "hidden",
      transition: "all 0.3s ease", cursor: "pointer",
    }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = c; e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = `0 0 40px ${c}40, ${THEME.shLg}`; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = THEME.border; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `${THEME.shMd}, 0 0 30px ${c}20`; }}>
      <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
        <p style={{ color: THEME.textDim, fontSize: "11px", fontWeight: "700", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "1.2px" }}>{label}</p>
        <div style={{ fontSize: "34px", fontWeight: "800", color: THEME.text, marginBottom: "8px" }}>
          {typeof value === "number" ? <Counter value={value} /> : value}
        </div>
        {subtext && <p style={{ color: THEME.textDim, fontSize: "12px" }}>{subtext}</p>}
        {change !== undefined && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "10px", color: change >= 0 ? THEME.green : THEME.red, fontSize: "12px", fontWeight: "700", background: change >= 0 ? `${THEME.green}15` : `${THEME.red}15`, padding: "4px 10px", borderRadius: "6px", width: "fit-content" }}>
            {change >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            <span>{Math.abs(change)}% vs last week</span>
          </div>
        )}
      </div>
      <div style={{ width: "72px", height: "72px", borderRadius: "16px", background: `linear-gradient(135deg, ${c}30, ${c}10)`, border: `2px solid ${c}40`, display: "flex", alignItems: "center", justifyContent: "center", color: c }}>
        <Icon size={36} />
      </div>
    </div>
  );
};

// ── CHART CARD ───────────────────────────────────────────────
const ChartCard = ({ title, children, subtitle, action }) => (
  <div style={{ background: THEME.card, border: `2px solid ${THEME.border}`, borderRadius: "20px", padding: "24px", boxShadow: THEME.shMd, transition: "all 0.3s ease" }}
    onMouseEnter={(e) => { e.currentTarget.style.borderColor = THEME.brand; e.currentTarget.style.transform = "translateY(-3px)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.borderColor = THEME.border; e.currentTarget.style.transform = "translateY(0)"; }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
      <div>
        <h3 style={{ color: THEME.text, fontSize: "16px", fontWeight: "800", marginBottom: "3px" }}>{title}</h3>
        {subtitle && <p style={{ color: THEME.textDim, fontSize: "12px" }}>{subtitle}</p>}
      </div>
      {action || <RefreshCw size={16} color={THEME.brand} style={{ opacity: 0.6 }} />}
    </div>
    {children}
  </div>
);

// ── CIRCULAR PROGRESS ─────────────────────────────────────────
const CircularProgress = ({ percentage, label, color = "brand", size = 100 }) => {
  const c = THEME[color] || THEME.brand;
  const radius = (size - 8) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.min(percentage, 100) / 100) * circumference;
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={THEME.border} strokeWidth="3" />
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={c} strokeWidth="3"
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease-in-out", filter: `drop-shadow(0 0 6px ${c}80)` }} />
        </svg>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
          <div style={{ fontSize: "20px", fontWeight: "800", color: c }}>{percentage}%</div>
        </div>
      </div>
      <p style={{ marginTop: "10px", color: THEME.textMd, fontSize: "12px", fontWeight: "600" }}>{label}</p>
    </div>
  );
};

// ── MINI STAT ────────────────────────────────────────────────
const MiniStat = ({ icon: Icon, label, value, color = "brand" }) => {
  const c = THEME[color] || THEME.brand;
  return (
    <div style={{ padding: "14px", background: `${c}10`, border: `1.5px solid ${c}30`, borderRadius: "12px", display: "flex", alignItems: "center", gap: "12px", transition: "all 0.2s" }}
      onMouseEnter={(e) => { e.currentTarget.style.background = `${c}20`; e.currentTarget.style.borderColor = `${c}60`; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = `${c}10`; e.currentTarget.style.borderColor = `${c}30`; }}>
      <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${c}30`, display: "flex", alignItems: "center", justifyContent: "center", color: c, flexShrink: 0 }}>
        <Icon size={20} />
      </div>
      <div>
        <p style={{ color: THEME.textDim, fontSize: "10px", fontWeight: "600", margin: "0 0 2px", textTransform: "uppercase" }}>{label}</p>
        <p style={{ color: THEME.text, fontSize: "14px", fontWeight: "800", margin: 0 }}>{value}</p>
      </div>
    </div>
  );
};

// ── ACTIVITY FEED ─────────────────────────────────────────────
const ActivityFeed = ({ activities = [] }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
    {activities.slice(0, 8).map((a, i) => (
      <div key={i} style={{ display: "flex", gap: "10px", padding: "10px 12px", background: THEME.surfaceHov, borderRadius: "10px", borderLeft: `3px solid ${a.color}`, alignItems: "center" }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: `${a.color}20`, display: "flex", alignItems: "center", justifyContent: "center", color: a.color, flexShrink: 0 }}>{a.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: THEME.text, fontSize: "13px", fontWeight: "600", marginBottom: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.title}</p>
          <p style={{ color: THEME.textDim, fontSize: "11px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.desc}</p>
        </div>
        <span style={{ color: THEME.textDim, fontSize: "10px", whiteSpace: "nowrap", flexShrink: 0 }}>{a.time ? fmtTime(a.time) : ""}</span>
      </div>
    ))}
    {activities.length === 0 && <p style={{ color: THEME.textDim, textAlign: "center", padding: "20px", fontSize: "13px" }}>No recent activities</p>}
  </div>
);

// ── USER TABLE ────────────────────────────────────────────────
const UserTable = ({ users = [], onDeleteUser, onEditUser }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ borderBottom: `1px solid ${THEME.border}` }}>
          {["USER", "EMAIL", "ROLE", "SCORE", "QUIZZES", "JOINED", "ACTION"].map(h => (
            <th key={h} style={{ padding: "12px", textAlign: "left", color: THEME.textDim, fontWeight: "700", fontSize: "11px", textTransform: "uppercase" }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {users.slice(0, 20).map((user, i) => (
          <tr key={i} style={{ borderBottom: `1px solid ${THEME.border}`, transition: "background 0.15s" }}
            onMouseEnter={(e) => e.currentTarget.style.background = THEME.surfaceHov}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
            <td style={{ padding: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: `linear-gradient(135deg, ${THEME.brand}, ${THEME.violet})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700", color: "white", flexShrink: 0 }}>
                  {(user.fullName || user.name || "U").charAt(0)}
                </div>
                <span style={{ color: THEME.text, fontSize: "13px", fontWeight: "600" }}>{user.fullName || user.name || "Unknown"}</span>
              </div>
            </td>
            <td style={{ padding: "12px", color: THEME.textMd, fontSize: "13px" }}>{user.email}</td>
            <td style={{ padding: "12px" }}>
              <span style={{ padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", background: user.role === "admin" ? `${THEME.violet}20` : `${THEME.brand}15`, color: user.role === "admin" ? THEME.violet : THEME.brand }}>
                {user.role || "student"}
              </span>
            </td>
            <td style={{ padding: "12px", color: THEME.green, fontSize: "13px", fontWeight: "700" }}>{fmtNum(user.score || 0)}</td>
            <td style={{ padding: "12px", color: THEME.amber, fontSize: "13px", fontWeight: "600" }}>{user.quizzesAttempted || 0}</td>
            <td style={{ padding: "12px", color: THEME.textMd, fontSize: "12px" }}>{fmtDate(user.createdAt)}</td>
            <td style={{ padding: "12px" }}>
              <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                <button onClick={() => onEditUser(user)} style={{ background: "transparent", border: "none", cursor: "pointer", color: THEME.brand, padding: "4px 8px", borderRadius: "4px" }}><Edit2 size={14} /></button>
                <button onClick={() => onDeleteUser(user._id)} style={{ background: "transparent", border: "none", cursor: "pointer", color: THEME.red, padding: "4px 8px", borderRadius: "4px" }}><Trash2 size={14} /></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    {users.length === 0 && <p style={{ textAlign: "center", padding: "40px", color: THEME.textDim }}>No users found</p>}
  </div>
);

// ══════════════════════════════════════════════════════════════
// MAIN ADMIN PAGE
// ══════════════════════════════════════════════════════════════
export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);

  // Data states
  const [stats, setStats] = useState({ totalUsers: 0, activeUsers: 0, totalQuizzes: 0, avgScore: 0, completionRate: 0 });
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [realtimeActivities, setRealtimeActivities] = useState([]);
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [quizPerformanceData, setQuizPerformanceData] = useState([]);
  const [activityBreakdownData, setActivityBreakdownData] = useState([]);
  const [systemHealth, setSystemHealth] = useState({ apiUptime: 0, dbResponse: 0, memoryUsage: 0 });
  const [featureUsage, setFeatureUsage] = useState({ quizzes: 0, games: 0, phishing: 0, certificates: 0, favorites: 0 });
  const [revenue, setRevenue] = useState({ total: 0, paid: 0, pending: 0 });

  // Form states
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseForm, setCourseForm] = useState({ title: "", description: "", level: "Beginner", category: "Cybersecurity" });
  const [showVideoForm, setShowVideoForm] = useState(null); // courseId
  const [videoForm, setVideoForm] = useState({ title: "", url: "", duration: "" });
  const [notifForm, setNotifForm] = useState({ subject: "", title: "", body: "", ctaText: "", ctaLink: "" });
  const [notifStatus, setNotifStatus] = useState("");
  const [notifLoading, setNotifLoading] = useState(false);
  const [searchUser, setSearchUser] = useState("");

  // ── SESSION CHECK ────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    const adminUser = localStorage.getItem("adminUser");
    if (token && adminUser) {
      try {
        const u = JSON.parse(adminUser);
        if (u.role === "admin") setIsLoggedIn(true);
      } catch (e) { }
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) fetchAll();
  }, [isLoggedIn]);

  // Auto-refresh every 30s
  useEffect(() => {
    if (!isLoggedIn) return;
    const t = setInterval(fetchAll, 30000);
    return () => clearInterval(t);
  }, [isLoggedIn]);

  // ── FETCH ALL DATA ────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); return; }

    try {
      // Stats
      const statsRes = await fetch(`${API_URL}/api/admin/stats`, { headers: { Authorization: `Bearer ${token}` } });
      if (statsRes.ok) {
        const d = await statsRes.json();
        setStats({ totalUsers: d.totalUsers || 0, activeUsers: d.activeUsers || 0, totalQuizzes: d.totalQuizzes || 0, avgScore: d.averageScore || 0, completionRate: d.completionRate || 0 });
      }

      // Users (detailed)
      const usersRes = await fetch(`${API_URL}/api/admin/details/users`, { headers: { Authorization: `Bearer ${token}` } });
      if (usersRes.ok) { const d = await usersRes.json(); setUsers(d.users || []); }
      else {
        const usersRes2 = await fetch(`${API_URL}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } });
        if (usersRes2.ok) { const d = await usersRes2.json(); setUsers(d.users || []); }
      }

      // Courses
      const coursesRes = await fetch(`${API_URL}/api/admin/courses/all`, { headers: { Authorization: `Bearer ${token}` } });
      if (coursesRes.ok) { const d = await coursesRes.json(); setCourses(d.courses || []); }

      // Certificates
      const certsRes = await fetch(`${API_URL}/api/admin/certificates/all`, { headers: { Authorization: `Bearer ${token}` } });
      if (certsRes.ok) {
        const d = await certsRes.json();
        const certs = d.certificates || [];
        setCertificates(certs);
        const paid = certs.filter(c => c.paymentStatus === "paid").length;
        const pending = certs.filter(c => c.paymentStatus !== "paid").length;
        setRevenue({ total: certs.length * CERT_PRICE, paid: paid * CERT_PRICE, pending: pending * CERT_PRICE });
      }

      // Activity logs
      const logsRes = await fetch(`${API_URL}/api/admin/activity-logs`, { headers: { Authorization: `Bearer ${token}` } });
      if (logsRes.ok) { const d = await logsRes.json(); setActivityLogs(d.logs || []); }

      // Real-time activity
      const rtRes = await fetch(`${API_URL}/api/admin/activity/realtime`, { headers: { Authorization: `Bearer ${token}` } });
      if (rtRes.ok) { const d = await rtRes.json(); setRealtimeActivities(d.activities || []); }

      // User growth
      const growthRes = await fetch(`${API_URL}/api/admin/user-growth`, { headers: { Authorization: `Bearer ${token}` } });
      if (growthRes.ok) { const d = await growthRes.json(); if (d.growth?.length) setUserGrowthData(d.growth); }

      // Quiz stats
      const quizRes = await fetch(`${API_URL}/api/admin/quiz-stats`, { headers: { Authorization: `Bearer ${token}` } });
      if (quizRes.ok) {
        const d = await quizRes.json();
        if (d.quizStats?.length) {
          setQuizPerformanceData(d.quizStats.map(q => ({ module: (q._id || "Unknown").substring(0, 12), avg: Math.round(q.avgScore || 0), target: 85 })));
        }
      }

      // System health
      const healthRes = await fetch(`${API_URL}/api/admin/system-health`, { headers: { Authorization: `Bearer ${token}` } });
      if (healthRes.ok) {
        const d = await healthRes.json();
        setSystemHealth({ apiUptime: Math.min(d.uptime || 0, 100), dbResponse: d.memoryPercentage || 0, memoryUsage: d.memoryPercentage || 0 });
      }

    } catch (err) { console.error("Fetch error:", err); }
    finally { setLoading(false); }
  }, []);

  // ── LOGIN ────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(""); setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password: password.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) { setLoginError(data.message || "Invalid credentials"); return; }
      if (data.user.role !== "admin") { setLoginError("Only admin users can access this dashboard"); return; }
      localStorage.setItem("token", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.user));
      setIsLoggedIn(true);
    } catch { setLoginError("Connection error. Please check if server is running."); }
    finally { setLoading(false); }
  };

  // ── LOGOUT ───────────────────────────────────────────────
  const handleLogout = () => {
    ["token", "adminUser", "adminLoggedIn"].forEach(k => localStorage.removeItem(k));
    setIsLoggedIn(false); setEmail(""); setPassword("");
  };

  // ── USER ACTIONS ─────────────────────────────────────────
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Delete this user permanently?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/admin/users/${userId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { alert("User deleted."); fetchAll(); }
      else alert("Failed to delete user.");
    } catch { alert("Error deleting user."); }
  };

  const handleEditUser = async (user) => {
    const newRole = window.prompt(`Change role for ${user.fullName || user.email}:`, user.role || "student");
    if (!newRole || newRole === (user.role || "student")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/admin/users/${user._id}`, {
        method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) fetchAll();
      else alert("Failed to update user.");
    } catch { alert("Error updating user."); }
  };

  // ── COURSE ACTIONS ────────────────────────────────────────
  const handleSaveCourse = async () => {
    if (!courseForm.title.trim()) { alert("Title is required"); return; }
    try {
      const token = localStorage.getItem("token");
      const courseId = editingCourse ? editingCourse._id : "new";
      const res = await fetch(`${API_URL}/api/admin/courses/${courseId}`, {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(courseForm),
      });
      if (res.ok) {
        alert(editingCourse ? "Course updated!" : "Course created!");
        setShowCourseForm(false); setEditingCourse(null);
        setCourseForm({ title: "", description: "", level: "Beginner", category: "Cybersecurity" });
        fetchAll();
      } else alert("Failed to save course.");
    } catch { alert("Error saving course."); }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Delete this course? All related certificates will also be deleted.")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/admin/courses/${courseId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { alert("Course deleted."); fetchAll(); }
      else alert("Failed to delete course.");
    } catch { alert("Error deleting course."); }
  };

  const handleAddVideo = async (courseId) => {
    if (!videoForm.title.trim() || !videoForm.url.trim()) { alert("Title and URL required"); return; }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/admin/courses/${courseId}/videos`, {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...videoForm, duration: parseInt(videoForm.duration) || 300 }),
      });
      if (res.ok) { alert("Video added!"); setShowVideoForm(null); setVideoForm({ title: "", url: "", duration: "" }); fetchAll(); }
      else alert("Failed to add video.");
    } catch { alert("Error adding video."); }
  };

  const handleDeleteVideo = async (courseId, videoIndex) => {
    if (!window.confirm("Delete this video?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/admin/courses/${courseId}/videos/${videoIndex}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) fetchAll();
      else alert("Failed to delete video.");
    } catch { alert("Error deleting video."); }
  };

  // ── CERTIFICATE ACTIONS ───────────────────────────────────
  const handleMarkPaid = async (certId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/admin/certificates/${certId}/payment`, {
        method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ paymentStatus: "paid" }),
      });
      if (res.ok) { fetchAll(); }
      else alert("Failed to update payment.");
    } catch { alert("Error updating certificate."); }
  };

  // ── EMAIL NOTIFICATION ────────────────────────────────────
  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!notifForm.subject.trim() || !notifForm.body.trim()) { setNotifStatus("Subject and body are required."); return; }
    setNotifLoading(true); setNotifStatus("");
    try {
      const res = await fetch(`${API_URL}/api/notify`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notifForm),
      });
      if (res.ok) {
        setNotifStatus("✅ Notification sent successfully to all users!");
        setNotifForm({ subject: "", title: "", body: "", ctaText: "", ctaLink: "" });
      } else {
        const d = await res.json();
        setNotifStatus(`❌ Failed: ${d.message || "Unknown error"}`);
      }
    } catch (err) { setNotifStatus(`❌ Error: ${err.message}`); }
    finally { setNotifLoading(false); }
  };

  // ── EXPORT & BACKUP ───────────────────────────────────────
  const handleExportData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/admin/export`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url;
        a.download = `cybershield-report-${Date.now()}.pdf`;
        document.body.appendChild(a); a.click();
        window.URL.revokeObjectURL(url); document.body.removeChild(a);
      } else alert("Export failed.");
    } catch { alert("Export error."); }
  };

  const handleCreateBackup = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/admin/backup`, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } });
      if (res.ok) { const d = await res.json(); alert(`Backup created!\nID: ${d.backupId}\nSize: ${(d.size / 1024).toFixed(1)}KB`); }
      else alert("Backup failed.");
    } catch { alert("Backup error."); }
  };

  // ── COMPUTED ACTIVITY ─────────────────────────────────────
  const buildActivityFeed = () => {
    const source = realtimeActivities.length > 0 ? realtimeActivities : activityLogs;
    return source.slice(0, 8).map((a, i) => {
      const action = (a.action || "").toLowerCase();
      let icon, color;
      if (action.includes("quiz") || action.includes("completed")) { icon = <CheckCircle size={15} />; color = THEME.green; }
      else if (action.includes("certif") || action.includes("award")) { icon = <Award size={15} />; color = THEME.amber; }
      else if (action.includes("registr") || action.includes("user") || action.includes("login")) { icon = <Users size={15} />; color = THEME.brand; }
      else if (action.includes("course")) { icon = <BookOpen size={15} />; color = THEME.violet; }
      else { icon = <Activity size={15} />; color = THEME.cyan; }
      return { icon, title: a.action || a.type || "Activity", desc: a.details || `${a.user || a.userEmail || ""}`, time: a.timestamp || a.createdAt, color };
    });
  };

  const filteredUsers = users.filter(u =>
    !searchUser || (u.fullName || u.email || "").toLowerCase().includes(searchUser.toLowerCase())
  );

  // ═══════════════════════════════════════════════════════════
  // ── LOGIN PAGE ─────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════
  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${THEME.bg} 0%, #EFF6FF 100%)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        <style>{`
          @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(20px)} }
          @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
          .slideUp { animation: slideUp 0.5s ease forwards; }
        `}</style>
        <div style={{ position: "absolute", top: "-20%", right: "-10%", width: "400px", height: "400px", borderRadius: "50%", background: `radial-gradient(circle, ${THEME.brand}10, transparent 70%)`, animation: "float 8s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "-20%", left: "-5%", width: "350px", height: "350px", borderRadius: "50%", background: `radial-gradient(circle, ${THEME.violet}10, transparent 70%)`, animation: "float 6s ease-in-out infinite reverse" }} />

        <div className="slideUp" style={{ width: "100%", maxWidth: "420px", padding: "24px", position: "relative", zIndex: 10 }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ width: "72px", height: "72px", margin: "0 auto 16px", borderRadius: "18px", background: `linear-gradient(135deg, ${THEME.brand}, ${THEME.violet})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 40px ${THEME.brand}50` }}>
              <Shield size={36} color="white" />
            </div>
            <h1 style={{ color: THEME.text, fontSize: "30px", fontWeight: "900", marginBottom: "6px" }}>CyberShield Admin</h1>
            <p style={{ color: THEME.textDim, fontSize: "14px" }}>Security Dashboard — Admin Access Only</p>
          </div>

          <div style={{ background: THEME.card, border: `2px solid ${THEME.brand}30`, borderRadius: "20px", padding: "28px", boxShadow: `${THEME.shMd}, 0 0 40px ${THEME.brand}15` }}>
            <form onSubmit={handleLogin}>
              {["Email", "Password"].map((label, i) => (
                <div key={label} style={{ marginBottom: i === 0 ? "16px" : "20px" }}>
                  <label style={{ display: "block", color: THEME.text, fontSize: "12px", fontWeight: "700", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</label>
                  <input type={i === 0 ? "email" : "password"} value={i === 0 ? email : password}
                    onChange={(e) => i === 0 ? setEmail(e.target.value) : setPassword(e.target.value)}
                    placeholder={i === 0 ? "admin@cybershield.com" : "••••••••"}
                    style={{ width: "100%", padding: "12px 14px", background: THEME.surfaceHov, border: `2px solid ${THEME.border}`, borderRadius: "10px", color: THEME.text, fontSize: "14px", outline: "none", boxSizing: "border-box", transition: "all 0.2s" }}
                    onFocus={(e) => { e.target.style.borderColor = THEME.brand; e.target.style.boxShadow = `0 0 15px ${THEME.brand}30`; }}
                    onBlur={(e) => { e.target.style.borderColor = THEME.border; e.target.style.boxShadow = "none"; }} />
                </div>
              ))}
              {loginError && (
                <div style={{ background: `${THEME.red}15`, border: `1px solid ${THEME.red}40`, borderRadius: "10px", padding: "12px 14px", color: THEME.red, fontSize: "13px", fontWeight: "600", marginBottom: "16px", display: "flex", gap: "8px", alignItems: "center" }}>
                  <AlertCircle size={16} />{loginError}
                </div>
              )}
              <button type="submit" disabled={loading} style={{ width: "100%", padding: "13px", background: `linear-gradient(135deg, ${THEME.brand}, ${THEME.violet})`, border: "none", borderRadius: "10px", color: "white", fontWeight: "700", fontSize: "14px", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, letterSpacing: "0.5px", transition: "all 0.2s" }}
                onMouseEnter={(e) => { if (!loading) e.target.style.transform = "scale(1.01)"; }}
                onMouseLeave={(e) => { e.target.style.transform = "scale(1)"; }}>
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // ── MAIN DASHBOARD ─────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════
  const sidebarItems = [
    { icon: BarChart2, label: "Dashboard", id: "dashboard" },
    { icon: Users, label: "Users", id: "users" },
    { icon: GraduationCap, label: "Courses", id: "courses" },
    { icon: Award, label: "Certificates", id: "certificates" },
    { icon: IndianRupee, label: "Revenue", id: "revenue" },
    { icon: Activity, label: "Activity", id: "activity" },
    { icon: AlertTriangle, label: "Alerts", id: "alerts" },
    { icon: Settings, label: "Settings", id: "settings" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: THEME.bg, color: THEME.text, fontFamily: "'Nunito', sans-serif" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>

      {/* TOPBAR */}
      <div style={{ height: "64px", background: THEME.surface, borderBottom: `1px solid ${THEME.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", paddingLeft: isSidebarOpen ? "276px" : "76px", paddingRight: "24px", transition: "padding 0.3s ease", boxShadow: THEME.sh, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ background: "transparent", border: "none", color: THEME.text, cursor: "pointer", padding: "7px", borderRadius: "8px", transition: "background 0.2s" }}
            onMouseEnter={(e) => e.currentTarget.style.background = THEME.surfaceHov}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h2 style={{ fontSize: "17px", fontWeight: "700" }}>{sidebarItems.find(s => s.id === currentTab)?.label || "Dashboard"}</h2>
          {loading && <div style={{ width: "16px", height: "16px", border: `2px solid ${THEME.brand}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px", background: `${THEME.green}15`, border: `1px solid ${THEME.green}30`, borderRadius: "8px" }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: THEME.green, animation: "pulse 2s ease-in-out infinite" }} />
            <span style={{ fontSize: "12px", color: THEME.green, fontWeight: "600" }}>Live</span>
          </div>
          <button onClick={fetchAll} style={{ background: `${THEME.brand}15`, border: `1px solid ${THEME.brand}30`, color: THEME.brand, padding: "6px 12px", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", gap: "5px" }}>
            <RefreshCw size={13} /> Refresh
          </button>
          <button onClick={handleLogout} style={{ background: `${THEME.red}15`, border: `1px solid ${THEME.red}30`, color: THEME.red, padding: "6px 12px", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", gap: "5px" }}>
            <LogOut size={13} /> Logout
          </button>
        </div>
      </div>

      {/* SIDEBAR */}
      <div style={{ position: "fixed", left: 0, top: "64px", width: isSidebarOpen ? "256px" : "56px", height: "calc(100vh - 64px)", background: THEME.surface, borderRight: `1px solid ${THEME.border}`, padding: "16px 10px", overflow: "auto", transition: "width 0.3s ease", zIndex: 90 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 8px", marginBottom: "16px", borderBottom: `1px solid ${THEME.border}`, paddingBottom: "16px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: `linear-gradient(135deg, ${THEME.brand}, ${THEME.violet})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Shield size={18} color="white" />
          </div>
          {isSidebarOpen && <div><p style={{ fontSize: "13px", fontWeight: "800", color: THEME.text, margin: 0 }}>CyberShield</p><p style={{ fontSize: "10px", color: THEME.textDim, margin: 0 }}>Admin Panel</p></div>}
        </div>
        {sidebarItems.map((item) => (
          <button key={item.id} onClick={() => setCurrentTab(item.id)} style={{ width: "100%", padding: "10px 10px", marginBottom: "4px", background: currentTab === item.id ? `${THEME.brand}15` : "transparent", border: currentTab === item.id ? `1px solid ${THEME.brand}40` : "1px solid transparent", borderRadius: "8px", color: currentTab === item.id ? THEME.brand : THEME.textMd, cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", fontWeight: "600", transition: "all 0.15s", textAlign: "left" }}
            onMouseEnter={(e) => { if (currentTab !== item.id) { e.currentTarget.style.background = THEME.surfaceHov; e.currentTarget.style.color = THEME.text; } }}
            onMouseLeave={(e) => { if (currentTab !== item.id) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = THEME.textMd; } }}>
            <item.icon size={17} style={{ minWidth: "17px" }} />
            {isSidebarOpen && <span>{item.label}</span>}
          </button>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div style={{ marginLeft: isSidebarOpen ? "256px" : "56px", padding: "28px", transition: "margin-left 0.3s ease" }}>

        {/* ═══ DASHBOARD TAB ═══ */}
        {currentTab === "dashboard" && (
          <div>
            <div style={{ marginBottom: "28px" }}>
              <h1 style={{ fontSize: "26px", fontWeight: "900", marginBottom: "6px" }}>System Overview</h1>
              <p style={{ color: THEME.textDim, fontSize: "13px" }}>Real-time platform performance and user activity</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "24px" }}>
              <StatCard icon={Users} label="Total Users" value={stats.totalUsers} change={8} color="brand" subtext={`${stats.activeUsers} active today`} />
              <StatCard icon={Activity} label="Active Users" value={stats.activeUsers} change={12} color="green" subtext="Last 24 hours" />
              <StatCard icon={GraduationCap} label="Quiz Attempts" value={stats.totalQuizzes} change={-3} color="amber" subtext="All time" />
              <StatCard icon={Trophy} label="Avg Score" value={`${Math.round(stats.avgScore)}%`} change={5} color="violet" subtext="Platform average" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "24px" }}>
              <MiniStat icon={BookOpen} label="Courses" value={courses.length} color="cyan" />
              <MiniStat icon={Award} label="Certificates" value={certificates.length} color="amber" />
              <MiniStat icon={IndianRupee} label="Revenue" value={fmtRupee(revenue.paid)} color="green" />
              <MiniStat icon={Target} label="Completion" value={`${stats.completionRate}%`} color="pink" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
              <ChartCard title="User Growth" subtitle="Daily registrations (last 7 days)">
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={userGrowthData.length ? userGrowthData : [{ date: "No data", users: 0 }]}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={THEME.brand} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={THEME.brand} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={THEME.border} />
                    <XAxis dataKey="date" stroke={THEME.textDim} style={{ fontSize: "11px" }} />
                    <YAxis stroke={THEME.textDim} style={{ fontSize: "11px" }} />
                    <Tooltip contentStyle={{ background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: "8px", color: THEME.text }} />
                    <Area type="monotone" dataKey="users" stroke={THEME.brand} fillOpacity={1} fill="url(#colorUsers)" />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Quiz Performance by Module" subtitle="Avg score vs 85% target">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={quizPerformanceData.length ? quizPerformanceData : [{ module: "No data", avg: 0, target: 85 }]}>
                    <CartesianGrid strokeDasharray="3 3" stroke={THEME.border} />
                    <XAxis dataKey="module" stroke={THEME.textDim} style={{ fontSize: "10px" }} />
                    <YAxis stroke={THEME.textDim} style={{ fontSize: "11px" }} />
                    <Tooltip contentStyle={{ background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: "8px", color: THEME.text }} />
                    <Legend />
                    <Bar dataKey="avg" name="Avg Score" fill={THEME.green} radius={[6, 6, 0, 0]} />
                    <Bar dataKey="target" name="Target" fill={`${THEME.textDim}60`} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
              <ChartCard title="Activity Breakdown" subtitle="User engagement distribution">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={[
                      { name: "Quiz Takers", value: users.filter(u => (u.quizzesAttempted || 0) > 0).length || 1, color: THEME.brand },
                      { name: "Certified", value: certificates.length || 1, color: THEME.amber },
                      { name: "Active Today", value: stats.activeUsers || 1, color: THEME.green },
                      { name: "Enrolled", value: courses.reduce((a, c) => a + (c.enrolledUsers || 0), 0) || 1, color: THEME.violet },
                    ]} cx="50%" cy="50%" outerRadius={80} dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {[THEME.brand, THEME.amber, THEME.green, THEME.violet].map((color, i) => <Cell key={i} fill={color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: "8px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="System Health" subtitle="Live server metrics">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", paddingTop: "12px" }}>
                  <CircularProgress percentage={Math.min(systemHealth.apiUptime || 0, 100)} label="Uptime (hrs)" color="green" size={110} />
                  <CircularProgress percentage={Math.min(systemHealth.dbResponse || 0, 100)} label="Memory %" color="cyan" size={110} />
                  <CircularProgress percentage={Math.min(systemHealth.memoryUsage || 0, 100)} label="Heap Used" color="amber" size={110} />
                </div>
              </ChartCard>
            </div>

            <ChartCard title="Recent Platform Activity" subtitle="Latest user actions across the platform">
              <ActivityFeed activities={buildActivityFeed()} />
            </ChartCard>
          </div>
        )}

        {/* ═══ USERS TAB ═══ */}
        {currentTab === "users" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div>
                <h1 style={{ fontSize: "26px", fontWeight: "900", marginBottom: "4px" }}>User Management</h1>
                <p style={{ color: THEME.textDim, fontSize: "13px" }}>{users.length} total users registered</p>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ position: "relative" }}>
                  <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: THEME.textDim }} />
                  <input type="text" placeholder="Search users..." value={searchUser} onChange={e => setSearchUser(e.target.value)}
                    style={{ padding: "9px 12px 9px 32px", background: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: "8px", color: THEME.text, fontSize: "13px", outline: "none", minWidth: "220px" }} />
                </div>
                <button onClick={fetchAll} style={{ padding: "9px 14px", background: `${THEME.brand}15`, border: `1px solid ${THEME.brand}40`, borderRadius: "8px", color: THEME.brand, fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}>
                  <RefreshCw size={13} /> Refresh
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "20px" }}>
              {[
                { label: "Total", value: users.length, color: THEME.brand },
                { label: "Active Today", value: stats.activeUsers, color: THEME.green },
                { label: "Admins", value: users.filter(u => u.role === "admin").length, color: THEME.violet },
                { label: "With Quizzes", value: users.filter(u => (u.quizzesAttempted || 0) > 0).length, color: THEME.amber },
              ].map((s, i) => (
                <div key={i} style={{ background: THEME.surface, border: `2px solid ${s.color}20`, borderRadius: "12px", padding: "14px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: "24px", fontWeight: "800", color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: "11px", color: THEME.textDim, marginTop: "4px", fontWeight: "600" }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: "16px", overflow: "hidden", boxShadow: THEME.sh }}>
              <UserTable users={filteredUsers} onDeleteUser={handleDeleteUser} onEditUser={handleEditUser} />
            </div>
          </div>
        )}

        {/* ═══ COURSES TAB ═══ */}
        {currentTab === "courses" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div>
                <h1 style={{ fontSize: "26px", fontWeight: "900", marginBottom: "4px" }}>Course Management</h1>
                <p style={{ color: THEME.textDim, fontSize: "13px" }}>{courses.length} courses in the database</p>
              </div>
              <button onClick={() => { setShowCourseForm(!showCourseForm); setEditingCourse(null); setCourseForm({ title: "", description: "", level: "Beginner", category: "Cybersecurity" }); }}
                style={{ padding: "9px 16px", background: THEME.brand, border: "none", borderRadius: "8px", color: "white", fontSize: "13px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                <Plus size={15} /> {showCourseForm ? "Cancel" : "New Course"}
              </button>
            </div>

            {/* Course Form */}
            {(showCourseForm || editingCourse) && (
              <div style={{ background: THEME.surface, border: `2px solid ${THEME.brand}40`, borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: "800", marginBottom: "16px", color: THEME.text }}>{editingCourse ? "Edit Course" : "Create New Course"}</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                  <input placeholder="Course Title *" value={courseForm.title} onChange={e => setCourseForm({ ...courseForm, title: e.target.value })}
                    style={{ padding: "10px 12px", border: `1px solid ${THEME.border}`, borderRadius: "8px", fontSize: "13px", color: THEME.text, outline: "none", background: THEME.bg }} />
                  <select value={courseForm.level} onChange={e => setCourseForm({ ...courseForm, level: e.target.value })}
                    style={{ padding: "10px 12px", border: `1px solid ${THEME.border}`, borderRadius: "8px", fontSize: "13px", color: THEME.text, outline: "none", background: THEME.bg }}>
                    <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                  </select>
                  <input placeholder="Category" value={courseForm.category} onChange={e => setCourseForm({ ...courseForm, category: e.target.value })}
                    style={{ padding: "10px 12px", border: `1px solid ${THEME.border}`, borderRadius: "8px", fontSize: "13px", color: THEME.text, outline: "none", background: THEME.bg }} />
                </div>
                <textarea placeholder="Course Description" value={courseForm.description} onChange={e => setCourseForm({ ...courseForm, description: e.target.value })} rows={3}
                  style={{ width: "100%", padding: "10px 12px", border: `1px solid ${THEME.border}`, borderRadius: "8px", fontSize: "13px", color: THEME.text, outline: "none", resize: "vertical", background: THEME.bg, boxSizing: "border-box", marginBottom: "14px" }} />
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={handleSaveCourse} style={{ padding: "10px 20px", background: THEME.green, border: "none", borderRadius: "8px", color: "white", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
                    {editingCourse ? "Save Changes" : "Create Course"}
                  </button>
                  <button onClick={() => { setShowCourseForm(false); setEditingCourse(null); }} style={{ padding: "10px 20px", background: THEME.surfaceHov, border: `1px solid ${THEME.border}`, borderRadius: "8px", color: THEME.textMd, fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>Cancel</button>
                </div>
              </div>
            )}

            {/* Course List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {courses.map((course) => (
                <div key={course._id} style={{ background: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: "14px", overflow: "hidden" }}>
                  <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                        <h4 style={{ fontSize: "15px", fontWeight: "800", color: THEME.text, margin: 0 }}>{course.title}</h4>
                        <span style={{ padding: "2px 8px", borderRadius: "6px", fontSize: "10px", fontWeight: "700", background: course.level === "Beginner" ? `${THEME.green}20` : course.level === "Intermediate" ? `${THEME.amber}20` : `${THEME.red}20`, color: course.level === "Beginner" ? THEME.green : course.level === "Intermediate" ? THEME.amber : THEME.red }}>
                          {course.level}
                        </span>
                        <span style={{ padding: "2px 8px", borderRadius: "6px", fontSize: "10px", fontWeight: "700", background: `${THEME.brand}15`, color: THEME.brand }}>{course.category}</span>
                      </div>
                      {course.description && <p style={{ fontSize: "12px", color: THEME.textDim, margin: "0 0 10px", lineHeight: "1.5" }}>{course.description}</p>}
                      <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: THEME.textMd, flexWrap: "wrap" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Video size={13} color={THEME.cyan} /> {course.totalVideos || course.videos?.length || 0} videos</span>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><HelpCircle size={13} color={THEME.violet} /> {course.totalQuestions || course.quiz?.length || 0} questions</span>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Award size={13} color={THEME.amber} /> {course.certificatesIssued || 0} certificates</span>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Users size={13} color={THEME.green} /> {course.enrolledUsers || course.enrolledCount || 0} enrolled</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexShrink: 0, marginLeft: "12px" }}>
                      <button onClick={() => { setEditingCourse(course); setShowCourseForm(true); setCourseForm({ title: course.title, description: course.description || "", level: course.level || "Beginner", category: course.category || "Cybersecurity" }); }}
                        style={{ padding: "6px 12px", background: `${THEME.brand}15`, border: `1px solid ${THEME.brand}40`, borderRadius: "6px", color: THEME.brand, fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>Edit</button>
                      <button onClick={() => setShowVideoForm(showVideoForm === course._id ? null : course._id)}
                        style={{ padding: "6px 12px", background: `${THEME.cyan}15`, border: `1px solid ${THEME.cyan}40`, borderRadius: "6px", color: THEME.cyan, fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>+ Video</button>
                      <button onClick={() => handleDeleteCourse(course._id)}
                        style={{ padding: "6px 12px", background: `${THEME.red}15`, border: `1px solid ${THEME.red}40`, borderRadius: "6px", color: THEME.red, fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>Delete</button>
                    </div>
                  </div>

                  {/* Video Form */}
                  {showVideoForm === course._id && (
                    <div style={{ borderTop: `1px solid ${THEME.border}`, padding: "14px 20px", background: THEME.bg }}>
                      <p style={{ fontSize: "13px", fontWeight: "700", marginBottom: "10px", color: THEME.text }}>Add Video to "{course.title}"</p>
                      <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr", gap: "10px", marginBottom: "10px" }}>
                        <input placeholder="Video Title *" value={videoForm.title} onChange={e => setVideoForm({ ...videoForm, title: e.target.value })}
                          style={{ padding: "8px 10px", border: `1px solid ${THEME.border}`, borderRadius: "6px", fontSize: "12px", color: THEME.text, outline: "none", background: THEME.surface }} />
                        <input placeholder="Video URL *" value={videoForm.url} onChange={e => setVideoForm({ ...videoForm, url: e.target.value })}
                          style={{ padding: "8px 10px", border: `1px solid ${THEME.border}`, borderRadius: "6px", fontSize: "12px", color: THEME.text, outline: "none", background: THEME.surface }} />
                        <input placeholder="Duration (sec)" value={videoForm.duration} onChange={e => setVideoForm({ ...videoForm, duration: e.target.value })} type="number"
                          style={{ padding: "8px 10px", border: `1px solid ${THEME.border}`, borderRadius: "6px", fontSize: "12px", color: THEME.text, outline: "none", background: THEME.surface }} />
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={() => handleAddVideo(course._id)} style={{ padding: "7px 14px", background: THEME.green, border: "none", borderRadius: "6px", color: "white", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>Add Video</button>
                        <button onClick={() => setShowVideoForm(null)} style={{ padding: "7px 14px", background: THEME.surfaceHov, border: `1px solid ${THEME.border}`, borderRadius: "6px", color: THEME.textMd, fontSize: "12px", cursor: "pointer" }}>Cancel</button>
                      </div>
                    </div>
                  )}

                  {/* Video list */}
                  {course.videos && course.videos.length > 0 && (
                    <div style={{ borderTop: `1px solid ${THEME.border}` }}>
                      {course.videos.map((v, vi) => (
                        <div key={vi} style={{ padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: vi < course.videos.length - 1 ? `1px solid ${THEME.border}` : "none", background: vi % 2 === 0 ? THEME.bg : THEME.surface }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{ width: "26px", height: "26px", borderRadius: "6px", background: `${THEME.cyan}20`, display: "flex", alignItems: "center", justifyContent: "center" }}><Video size={13} color={THEME.cyan} /></div>
                            <span style={{ fontSize: "12px", fontWeight: "600", color: THEME.text }}>{v.title}</span>
                            {v.duration && <span style={{ fontSize: "10px", color: THEME.textDim }}>{Math.floor(v.duration / 60)}m {v.duration % 60}s</span>}
                          </div>
                          <button onClick={() => handleDeleteVideo(course._id, vi)} style={{ background: "transparent", border: "none", cursor: "pointer", color: THEME.red, padding: "3px 6px" }}><Trash2 size={13} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {courses.length === 0 && (
                <div style={{ textAlign: "center", padding: "60px", color: THEME.textDim, background: THEME.surface, borderRadius: "14px", border: `1px solid ${THEME.border}` }}>
                  <BookOpen size={40} style={{ opacity: 0.3, marginBottom: "12px" }} />
                  <p style={{ fontSize: "14px", fontWeight: "600" }}>No courses found</p>
                  <p style={{ fontSize: "12px" }}>Create your first course using the button above.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══ CERTIFICATES TAB ═══ */}
        {currentTab === "certificates" && (
          <div>
            <div style={{ marginBottom: "24px" }}>
              <h1 style={{ fontSize: "26px", fontWeight: "900", marginBottom: "4px" }}>Certificate Management</h1>
              <p style={{ color: THEME.textDim, fontSize: "13px" }}>Monitor issued certificates — each certificate costs ₹100</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", marginBottom: "24px" }}>
              {[
                { label: "Total Issued", value: certificates.length, color: THEME.brand, suffix: "" },
                { label: "Paid", value: certificates.filter(c => c.paymentStatus === "paid").length, color: THEME.green, suffix: "" },
                { label: "Pending Payment", value: certificates.filter(c => c.paymentStatus !== "paid").length, color: THEME.amber, suffix: "" },
                { label: "Revenue Collected", value: fmtRupee(revenue.paid), color: THEME.green, suffix: "" },
                { label: "Revenue Pending", value: fmtRupee(revenue.pending), color: THEME.amber, suffix: "" },
              ].map((s, i) => (
                <div key={i} style={{ background: THEME.surface, border: `2px solid ${s.color}25`, borderRadius: "12px", padding: "14px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: "22px", fontWeight: "800", color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: "11px", color: THEME.textDim, marginTop: "5px", fontWeight: "600" }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ background: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: "14px", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: THEME.bg, borderBottom: `1px solid ${THEME.border}` }}>
                    {["User", "Course", "Issue Date", "Amount", "Payment Status", "Action"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "11px", fontWeight: "700", color: THEME.textDim, textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {certificates.map((cert, i) => (
                    <tr key={cert._id || i} style={{ borderBottom: `1px solid ${THEME.border}`, transition: "background 0.15s" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = THEME.surfaceHov}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                      <td style={{ padding: "12px 16px" }}>
                        <div>
                          <p style={{ fontSize: "13px", fontWeight: "600", color: THEME.text, margin: "0 0 2px" }}>{cert.user?.fullName || cert.recipientName || "—"}</p>
                          <p style={{ fontSize: "11px", color: THEME.textDim, margin: 0 }}>{cert.user?.email || "—"}</p>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: "13px", color: THEME.textMd }}>{cert.courseTitle || cert.course?.title || "—"}</td>
                      <td style={{ padding: "12px 16px", fontSize: "12px", color: THEME.textDim }}>{fmtDate(cert.issuedAt)}</td>
                      <td style={{ padding: "12px 16px", fontSize: "13px", fontWeight: "700", color: THEME.green }}>₹{CERT_PRICE}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", background: cert.paymentStatus === "paid" ? `${THEME.green}20` : `${THEME.amber}20`, color: cert.paymentStatus === "paid" ? THEME.green : THEME.amber }}>
                          {cert.paymentStatus === "paid" ? "✓ Paid" : "⏳ Pending"}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        {cert.paymentStatus !== "paid" && (
                          <button onClick={() => handleMarkPaid(cert._id)} style={{ padding: "5px 12px", background: `${THEME.green}15`, border: `1px solid ${THEME.green}40`, borderRadius: "6px", color: THEME.green, fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>
                            Mark Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {certificates.length === 0 && (
                <div style={{ textAlign: "center", padding: "48px", color: THEME.textDim }}>
                  <Award size={36} style={{ opacity: 0.3, marginBottom: "10px" }} />
                  <p style={{ fontWeight: "600" }}>No certificates issued yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══ REVENUE TAB ═══ */}
        {currentTab === "revenue" && (
          <div>
            <div style={{ marginBottom: "24px" }}>
              <h1 style={{ fontSize: "26px", fontWeight: "900", marginBottom: "4px" }}>Revenue Dashboard</h1>
              <p style={{ color: THEME.textDim, fontSize: "13px" }}>Certificate revenue at ₹{CERT_PRICE} per certificate</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "28px" }}>
              <StatCard icon={IndianRupee} label="Total Revenue" value={fmtRupee(revenue.total)} color="brand" subtext={`${certificates.length} certificates`} />
              <StatCard icon={CheckSquare} label="Collected Revenue" value={fmtRupee(revenue.paid)} color="green" subtext={`${certificates.filter(c => c.paymentStatus === "paid").length} paid`} />
              <StatCard icon={Clock} label="Pending Revenue" value={fmtRupee(revenue.pending)} color="amber" subtext={`${certificates.filter(c => c.paymentStatus !== "paid").length} pending`} />
              <StatCard icon={Award} label="Certificates Sold" value={certificates.filter(c => c.paymentStatus === "paid").length} color="violet" subtext="Paid certificates" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
              <ChartCard title="Revenue by Course" subtitle="Certificates per course">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={courses.map(c => ({
                    name: (c.title || "").substring(0, 14),
                    revenue: (c.certificatesIssued || 0) * CERT_PRICE,
                    certificates: c.certificatesIssued || 0,
                  })).filter(d => d.certificates > 0)}>
                    <CartesianGrid strokeDasharray="3 3" stroke={THEME.border} />
                    <XAxis dataKey="name" stroke={THEME.textDim} style={{ fontSize: "10px" }} />
                    <YAxis stroke={THEME.textDim} style={{ fontSize: "11px" }} tickFormatter={v => `₹${v}`} />
                    <Tooltip formatter={(v) => fmtRupee(v)} contentStyle={{ background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: "8px" }} />
                    <Bar dataKey="revenue" name="Revenue" fill={THEME.green} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Payment Status Distribution" subtitle="Paid vs pending">
                <div style={{ padding: "20px 0" }}>
                  {[
                    { label: "Paid Certificates", count: certificates.filter(c => c.paymentStatus === "paid").length, color: THEME.green },
                    { label: "Pending Certificates", count: certificates.filter(c => c.paymentStatus !== "paid").length, color: THEME.amber },
                  ].map((s, i) => (
                    <div key={i} style={{ marginBottom: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ fontSize: "13px", fontWeight: "600", color: THEME.text }}>{s.label}</span>
                        <span style={{ fontSize: "13px", fontWeight: "700", color: s.color }}>{s.count} × ₹{CERT_PRICE} = {fmtRupee(s.count * CERT_PRICE)}</span>
                      </div>
                      <div style={{ height: "8px", background: THEME.surfaceHov, borderRadius: "4px", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${certificates.length > 0 ? (s.count / certificates.length * 100) : 0}%`, background: s.color, borderRadius: "4px", transition: "width 1s ease" }} />
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop: "24px", padding: "16px", background: `${THEME.green}10`, border: `1px solid ${THEME.green}30`, borderRadius: "10px" }}>
                    <p style={{ fontSize: "12px", color: THEME.textDim, marginBottom: "4px" }}>Collection Rate</p>
                    <p style={{ fontSize: "28px", fontWeight: "900", color: THEME.green, margin: 0 }}>
                      {certificates.length > 0 ? Math.round(certificates.filter(c => c.paymentStatus === "paid").length / certificates.length * 100) : 0}%
                    </p>
                  </div>
                </div>
              </ChartCard>
            </div>
          </div>
        )}

        {/* ═══ ACTIVITY TAB ═══ */}
        {currentTab === "activity" && (
          <div>
            <div style={{ marginBottom: "24px" }}>
              <h1 style={{ fontSize: "26px", fontWeight: "900", marginBottom: "4px" }}>System Activity</h1>
              <p style={{ color: THEME.textDim, fontSize: "13px" }}>Real-time user activity from the platform</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
              <ChartCard title="Login Timeline" subtitle="Registrations over last 7 days">
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={userGrowthData.length ? userGrowthData : [{ date: "No data", users: 0 }]}>
                    <CartesianGrid strokeDasharray="3 3" stroke={THEME.border} />
                    <XAxis dataKey="date" stroke={THEME.textDim} style={{ fontSize: "11px" }} />
                    <YAxis stroke={THEME.textDim} style={{ fontSize: "11px" }} />
                    <Tooltip contentStyle={{ background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: "8px" }} />
                    <Line type="monotone" dataKey="users" stroke={THEME.cyan} dot={{ fill: THEME.cyan, r: 4 }} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Feature Usage" subtitle="Platform engagement metrics">
                <div style={{ paddingTop: "8px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[
                    { label: "Quiz Attempts", value: stats.totalQuizzes, icon: <GraduationCap size={14} />, color: THEME.brand },
                    { label: "Certificates Issued", value: certificates.length, icon: <Award size={14} />, color: THEME.amber },
                    { label: "Courses Available", value: courses.length, icon: <BookOpen size={14} />, color: THEME.violet },
                    { label: "Active Users Today", value: stats.activeUsers, icon: <Users size={14} />, color: THEME.green },
                    { label: "Revenue Collected", value: fmtRupee(revenue.paid), icon: <IndianRupee size={14} />, color: THEME.green },
                  ].map((f, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: THEME.surfaceHov, borderRadius: "8px", borderLeft: `3px solid ${f.color}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", color: f.color }}>{f.icon}<span style={{ fontSize: "13px", fontWeight: "600", color: THEME.text }}>{f.label}</span></div>
                      <span style={{ fontSize: "14px", fontWeight: "800", color: f.color }}>{f.value}</span>
                    </div>
                  ))}
                </div>
              </ChartCard>
            </div>

            <ChartCard title="Live Activity Feed" subtitle={`${realtimeActivities.length} recent events from the database`}>
              <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                {(realtimeActivities.length > 0 ? realtimeActivities : activityLogs).slice(0, 20).map((a, i) => {
                  const action = (a.action || a.type || "").toLowerCase();
                  let icon, color;
                  if (action.includes("quiz") || action.includes("completed")) { icon = <CheckCircle size={14} />; color = THEME.green; }
                  else if (action.includes("certif")) { icon = <Award size={14} />; color = THEME.amber; }
                  else if (action.includes("registr") || action.includes("user")) { icon = <Users size={14} />; color = THEME.brand; }
                  else if (action.includes("course")) { icon = <BookOpen size={14} />; color = THEME.violet; }
                  else { icon = <Activity size={14} />; color = THEME.cyan; }
                  return (
                    <div key={i} style={{ display: "flex", gap: "12px", padding: "10px 0", borderBottom: i < 19 ? `1px solid ${THEME.border}` : "none", alignItems: "center" }}>
                      <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", color, flexShrink: 0 }}>{icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: "13px", fontWeight: "600", color: THEME.text, margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.action || a.type || "Activity"}</p>
                        <p style={{ fontSize: "11px", color: THEME.textDim, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.details || `${a.user || a.userEmail || ""}`}</p>
                      </div>
                      <span style={{ fontSize: "10px", color: THEME.textDim, whiteSpace: "nowrap", flexShrink: 0 }}>{fmtDate(a.timestamp || a.createdAt)} {fmtTime(a.timestamp || a.createdAt)}</span>
                    </div>
                  );
                })}
                {realtimeActivities.length === 0 && activityLogs.length === 0 && (
                  <p style={{ textAlign: "center", padding: "40px", color: THEME.textDim }}>No activity data yet.</p>
                )}
              </div>
            </ChartCard>
          </div>
        )}

        {/* ═══ ALERTS TAB ═══ */}
        {currentTab === "alerts" && (
          <div>
            <h1 style={{ fontSize: "26px", fontWeight: "900", marginBottom: "6px" }}>System Alerts</h1>
            <p style={{ color: THEME.textDim, fontSize: "13px", marginBottom: "24px" }}>Active alerts and system notifications</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {systemHealth.memoryUsage > 80 && (
                <div style={{ background: `${THEME.red}10`, border: `1px solid ${THEME.red}30`, borderRadius: "12px", padding: "16px", display: "flex", gap: "12px" }}>
                  <AlertCircle size={18} color={THEME.red} style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ color: THEME.text, fontSize: "14px", fontWeight: "700", marginBottom: "4px" }}>High Memory Usage</p>
                    <p style={{ color: THEME.textDim, fontSize: "13px" }}>Server memory at {systemHealth.memoryUsage}% — consider scaling up.</p>
                  </div>
                  <span style={{ color: THEME.textDim, fontSize: "11px" }}>Now</span>
                </div>
              )}
              {certificates.filter(c => c.paymentStatus !== "paid").length > 0 && (
                <div style={{ background: `${THEME.amber}10`, border: `1px solid ${THEME.amber}30`, borderRadius: "12px", padding: "16px", display: "flex", gap: "12px" }}>
                  <AlertTriangle size={18} color={THEME.amber} style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ color: THEME.text, fontSize: "14px", fontWeight: "700", marginBottom: "4px" }}>Pending Certificate Payments</p>
                    <p style={{ color: THEME.textDim, fontSize: "13px" }}>{certificates.filter(c => c.paymentStatus !== "paid").length} certificates with pending payments totalling {fmtRupee(revenue.pending)}.</p>
                  </div>
                  <button onClick={() => setCurrentTab("certificates")} style={{ padding: "5px 12px", background: `${THEME.amber}20`, border: `1px solid ${THEME.amber}`, borderRadius: "6px", color: THEME.amber, fontSize: "12px", fontWeight: "600", cursor: "pointer", flexShrink: 0 }}>View</button>
                </div>
              )}
              {[
                { level: "info", title: "Auto-refresh Active", desc: "Dashboard data refreshes every 30 seconds.", color: THEME.brand, icon: <RefreshCw size={18} /> },
                { level: "success", title: "Database Connected", desc: "MongoDB connection is healthy and responding normally.", color: THEME.green, icon: <CheckCircle size={18} /> },
                { level: "info", title: "Certificate Pricing Active", desc: `Each certificate is priced at ₹${CERT_PRICE}. Total potential revenue: ${fmtRupee(certificates.length * CERT_PRICE)}`, color: THEME.violet, icon: <IndianRupee size={18} /> },
              ].map((alert, i) => (
                <div key={i} style={{ background: `${alert.color}08`, border: `1px solid ${alert.color}25`, borderRadius: "12px", padding: "16px", display: "flex", gap: "12px" }}>
                  <div style={{ color: alert.color, flexShrink: 0 }}>{alert.icon}</div>
                  <div>
                    <p style={{ color: THEME.text, fontSize: "14px", fontWeight: "700", marginBottom: "4px" }}>{alert.title}</p>
                    <p style={{ color: THEME.textDim, fontSize: "13px" }}>{alert.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ SETTINGS TAB ═══ */}
        {currentTab === "settings" && (
          <div>
            <h1 style={{ fontSize: "26px", fontWeight: "900", marginBottom: "6px" }}>Settings</h1>
            <p style={{ color: THEME.textDim, fontSize: "13px", marginBottom: "28px" }}>Configure platform, SMTP, and notification settings</p>

            <div style={{ display: "grid", gap: "20px" }}>
              {/* General Settings */}
              <div style={{ background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: "16px", padding: "24px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: "800", marginBottom: "16px", color: THEME.text }}>General Settings</h3>
                {[
                  { label: "Platform Status", right: <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: THEME.green, boxShadow: `0 0 8px ${THEME.green}` }} /> },
                  { label: "Certificate Price (₹)", right: <span style={{ fontSize: "16px", fontWeight: "800", color: THEME.green }}>₹{CERT_PRICE}</span> },
                  { label: "Auto Refresh (30s)", right: <div style={{ width: "40px", height: "22px", background: THEME.green, borderRadius: "11px", position: "relative" }}><div style={{ position: "absolute", right: "3px", top: "3px", width: "16px", height: "16px", background: "white", borderRadius: "50%" }} /></div> },
                  { label: "Maintenance Mode", right: <input type="checkbox" style={{ width: "16px", height: "16px", cursor: "pointer" }} /> },
                ].map((row, i, arr) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < arr.length - 1 ? `1px solid ${THEME.border}` : "none" }}>
                    <span style={{ color: THEME.textMd, fontSize: "13px" }}>{row.label}</span>
                    {row.right}
                  </div>
                ))}
              </div>

              {/* Email Notification (SMTP) */}
              <div style={{ background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: "16px", padding: "24px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: "800", marginBottom: "6px", color: THEME.text, display: "flex", alignItems: "center", gap: "8px" }}>
                  <Mail size={16} color={THEME.brand} /> Email Notifications (SMTP)
                </h3>
                <p style={{ fontSize: "12px", color: THEME.textDim, marginBottom: "20px" }}>Send email notifications to all registered users. Ensure your backend has SMTP configured via <code style={{ background: THEME.surfaceHov, padding: "1px 5px", borderRadius: "4px" }}>SMTP_HOST</code>, <code style={{ background: THEME.surfaceHov, padding: "1px 5px", borderRadius: "4px" }}>SMTP_USER</code>, <code style={{ background: THEME.surfaceHov, padding: "1px 5px", borderRadius: "4px" }}>SMTP_PASS</code> in your <code style={{ background: THEME.surfaceHov, padding: "1px 5px", borderRadius: "4px" }}>.env</code>.</p>
                <form onSubmit={handleSendNotification}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: THEME.textDim, marginBottom: "5px", textTransform: "uppercase" }}>Email Subject *</label>
                      <input value={notifForm.subject} onChange={e => setNotifForm({ ...notifForm, subject: e.target.value })} placeholder="e.g. New Course Available!"
                        style={{ width: "100%", padding: "10px 12px", border: `1px solid ${THEME.border}`, borderRadius: "8px", fontSize: "13px", color: THEME.text, outline: "none", background: THEME.bg, boxSizing: "border-box" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: THEME.textDim, marginBottom: "5px", textTransform: "uppercase" }}>Notification Title</label>
                      <input value={notifForm.title} onChange={e => setNotifForm({ ...notifForm, title: e.target.value })} placeholder="Headline shown in email"
                        style={{ width: "100%", padding: "10px 12px", border: `1px solid ${THEME.border}`, borderRadius: "8px", fontSize: "13px", color: THEME.text, outline: "none", background: THEME.bg, boxSizing: "border-box" }} />
                    </div>
                  </div>
                  <div style={{ marginBottom: "12px" }}>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: THEME.textDim, marginBottom: "5px", textTransform: "uppercase" }}>Message Body *</label>
                    <textarea value={notifForm.body} onChange={e => setNotifForm({ ...notifForm, body: e.target.value })} placeholder="Write your notification message here..." rows={4}
                      style={{ width: "100%", padding: "10px 12px", border: `1px solid ${THEME.border}`, borderRadius: "8px", fontSize: "13px", color: THEME.text, outline: "none", background: THEME.bg, resize: "vertical", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: THEME.textDim, marginBottom: "5px", textTransform: "uppercase" }}>CTA Button Text</label>
                      <input value={notifForm.ctaText} onChange={e => setNotifForm({ ...notifForm, ctaText: e.target.value })} placeholder="e.g. View Course"
                        style={{ width: "100%", padding: "10px 12px", border: `1px solid ${THEME.border}`, borderRadius: "8px", fontSize: "13px", color: THEME.text, outline: "none", background: THEME.bg, boxSizing: "border-box" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: THEME.textDim, marginBottom: "5px", textTransform: "uppercase" }}>CTA Link URL</label>
                      <input value={notifForm.ctaLink} onChange={e => setNotifForm({ ...notifForm, ctaLink: e.target.value })} placeholder="https://..."
                        style={{ width: "100%", padding: "10px 12px", border: `1px solid ${THEME.border}`, borderRadius: "8px", fontSize: "13px", color: THEME.text, outline: "none", background: THEME.bg, boxSizing: "border-box" }} />
                    </div>
                  </div>
                  {notifStatus && (
                    <div style={{ padding: "10px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", marginBottom: "12px", background: notifStatus.startsWith("✅") ? `${THEME.green}15` : `${THEME.red}15`, color: notifStatus.startsWith("✅") ? THEME.green : THEME.red, border: `1px solid ${notifStatus.startsWith("✅") ? THEME.green : THEME.red}30` }}>
                      {notifStatus}
                    </div>
                  )}
                  <button type="submit" disabled={notifLoading} style={{ padding: "11px 24px", background: notifLoading ? THEME.textDim : THEME.brand, border: "none", borderRadius: "8px", color: "white", fontSize: "13px", fontWeight: "700", cursor: notifLoading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Send size={14} /> {notifLoading ? "Sending..." : `Send to All ${stats.totalUsers} Users`}
                  </button>
                </form>
              </div>

              {/* Export & Backup */}
              <div style={{ background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: "16px", padding: "24px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: "800", marginBottom: "6px", color: THEME.text }}>Export & Backup</h3>
                <p style={{ fontSize: "12px", color: THEME.textDim, marginBottom: "16px" }}>Export platform data as PDF or create a full database backup.</p>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button onClick={handleExportData} style={{ padding: "10px 18px", background: `${THEME.brand}15`, border: `1px solid ${THEME.brand}40`, borderRadius: "8px", color: THEME.brand, fontWeight: "700", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Download size={14} /> Export PDF Report
                  </button>
                  <button onClick={handleCreateBackup} style={{ padding: "10px 18px", background: `${THEME.green}15`, border: `1px solid ${THEME.green}40`, borderRadius: "8px", color: THEME.green, fontWeight: "700", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Database size={14} /> Create Backup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}