import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield, BarChart2, Bell, Users, Activity, LogOut, Menu, X,
  TrendingUp, Award, Zap, Target, AlertTriangle, CheckCircle,
  Eye, Lock, Settings, Download, RefreshCw, Clock, Wifi, Radio,
  Database, Layers, Globe, Cpu, Server, Heart, AlertCircle,
  ChevronRight, DollarSign, Flame, Trophy, GraduationCap, Gamepad2,
  Edit2, Trash2, Search, Filter, MoreVertical, ArrowUp, ArrowDown
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from "recharts";

// ── ADMIN CREDENTIALS (Fixed) ─────────────────────────────────
const ADMIN_CREDENTIALS = {
  email: "admin@cybershield.com",
  password: "Admin@2024",
};

// ── THEME COLORS (LIGHT THEME - FLASHY) ──────────────────────
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
const fmtPct = (n) => n ? `${Math.round(n)}%` : "0%";

// ── ANIMATED COUNTER ──────────────────────────────────────────
const Counter = ({ value, duration = 1.5 }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = (value || 0) / (duration * 60);
    const interval = setInterval(() => {
      start += increment;
      if (start >= (value || 0)) {
        setCount(value || 0);
        clearInterval(interval);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(interval);
  }, [value, duration]);
  return fmtNum(count);
};

// ── STAT CARD WITH GRADIENT (ENHANCED & FLASHY) ───────────────
const StatCard = ({ icon: Icon, label, value, change, color = "brand", subtext }) => {
  const colorGlow = `${THEME[color]}Glow` in THEME ? THEME[`${color}Glow`] : `${THEME[color]}40`;
  
  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${THEME.card} 0%, ${THEME.surfaceHov} 100%)`,
        border: `2px solid ${THEME.border}`,
        borderRadius: "20px",
        padding: "24px",
        boxShadow: `${THEME.shMd}, 0 0 30px ${colorGlow}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = `linear-gradient(135deg, ${THEME.surfaceHov} 0%, ${THEME.card} 100%)`;
        e.currentTarget.style.borderColor = THEME[color];
        e.currentTarget.style.boxShadow = `0 0 50px ${THEME[color]}, ${THEME.shLg}`;
        e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = `linear-gradient(135deg, ${THEME.card} 0%, ${THEME.surfaceHov} 100%)`;
        e.currentTarget.style.borderColor = THEME.border;
        e.currentTarget.style.boxShadow = `${THEME.shMd}, 0 0 30px ${colorGlow}`;
        e.currentTarget.style.transform = "translateY(0) scale(1)";
      }}
    >
      {/* Animated Background Gradient */}
      <div
        style={{
          position: "absolute",
          top: "-50%",
          right: "-10%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${THEME[color]}15 0%, transparent 70%)`,
          pointerEvents: "none",
          animation: "float 6s ease-in-out infinite",
        }}
      />
      
      <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
        <p style={{ 
          color: THEME.textDim, 
          fontSize: "11px", 
          fontWeight: "700", 
          marginBottom: "10px", 
          textTransform: "uppercase", 
          letterSpacing: "1.2px",
          background: `linear-gradient(90deg, ${THEME.textDim}, ${THEME[color]})`,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          {label}
        </p>
        <div style={{ 
          fontSize: "36px", 
          fontWeight: "800", 
          color: THEME.text, 
          marginBottom: "8px",
          background: `linear-gradient(135deg, ${THEME.text}, ${THEME[color]})`,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          {typeof value === "number" ? <Counter value={value} /> : value}
        </div>
        {subtext && <p style={{ color: THEME.textDim, fontSize: "12px" }}>{subtext}</p>}
        {change && (
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "6px", 
            marginTop: "10px", 
            color: change > 0 ? THEME.green : THEME.red, 
            fontSize: "13px", 
            fontWeight: "700",
            background: change > 0 ? `${THEME.green}15` : `${THEME.red}15`,
            padding: "6px 12px",
            borderRadius: "8px",
            width: "fit-content",
          }}>
            {change > 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
            <span>{Math.abs(change)}% vs last week</span>
          </div>
        )}
      </div>
      
      <div
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "16px",
          background: `linear-gradient(135deg, ${THEME[color]}30, ${THEME[color]}10)`,
          border: `2px solid ${THEME[color]}40`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: THEME[color],
          position: "relative",
          boxShadow: `0 0 30px ${THEME[color]}30`,
        }}
      >
        <Icon size={40} style={{ animation: "pulse 2s ease-in-out infinite" }} />
      </div>
    </div>
  );
};

// ── CIRCULAR PROGRESS COMPONENT ───────────────────────────────
const CircularProgress = ({ percentage, label, color = "brand", size = 100 }) => {
  const radius = (size - 8) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={THEME.border}
            strokeWidth="3"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={THEME[color]}
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 1s ease-in-out",
              filter: `drop-shadow(0 0 8px ${THEME[color]}80)`,
            }}
          />
        </svg>
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}>
          <div style={{
            fontSize: "24px",
            fontWeight: "800",
            color: THEME[color],
            background: `linear-gradient(135deg, ${THEME[color]}, ${THEME.text})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            {percentage}%
          </div>
        </div>
      </div>
      <p style={{ marginTop: "12px", color: THEME.textMd, fontSize: "13px", fontWeight: "600" }}>
        {label}
      </p>
    </div>
  );
};

// ── MINI STAT CARD ────────────────────────────────────────────
const MiniStat = ({ icon: Icon, label, value, color = "brand" }) => (
  <div style={{
    padding: "16px",
    background: `linear-gradient(135deg, ${THEME[color]}10, ${THEME[color]}05)`,
    border: `1.5px solid ${THEME[color]}30`,
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    transition: "all 0.3s ease",
    cursor: "pointer",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = `linear-gradient(135deg, ${THEME[color]}20, ${THEME[color]}10)`;
    e.currentTarget.style.borderColor = `${THEME[color]}60`;
    e.currentTarget.style.boxShadow = `0 0 20px ${THEME[color]}30`;
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = `linear-gradient(135deg, ${THEME[color]}10, ${THEME[color]}05)`;
    e.currentTarget.style.borderColor = `${THEME[color]}30`;
  }}>
    <div style={{
      width: "44px",
      height: "44px",
      borderRadius: "10px",
      background: `linear-gradient(135deg, ${THEME[color]}40, ${THEME[color]}20)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: THEME[color],
      boxShadow: `0 0 15px ${THEME[color]}40`,
      flexShrink: 0,
    }}>
      <Icon size={22} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ color: THEME.textDim, fontSize: "11px", fontWeight: "600", margin: "0 0 2px", textTransform: "uppercase" }}>
        {label}
      </p>
      <p style={{ color: THEME.text, fontSize: "14px", fontWeight: "800", margin: 0 }}>
        {value}
      </p>
    </div>
  </div>
);

// ── CHART CARD (ENHANCED) ────────────────────────────────────
const ChartCard = ({ title, children, subtitle }) => (
  <div
    style={{
      background: `linear-gradient(135deg, ${THEME.card} 0%, ${THEME.surfaceHov} 100%)`,
      border: `2px solid ${THEME.border}`,
      borderRadius: "20px",
      padding: "24px",
      boxShadow: THEME.shMd,
      transition: "all 0.4s ease",
      cursor: "pointer",
      position: "relative",
      overflow: "hidden",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = THEME.brand;
      e.currentTarget.style.boxShadow = `${THEME.shLg}, 0 0 40px ${THEME.brand}30`;
      e.currentTarget.style.transform = "translateY(-4px)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = THEME.border;
      e.currentTarget.style.boxShadow = THEME.shMd;
      e.currentTarget.style.transform = "translateY(0)";
    }}
  >
    <div style={{
      position: "absolute",
      top: "-30%",
      right: "-10%",
      width: "150px",
      height: "150px",
      borderRadius: "50%",
      background: `radial-gradient(circle, ${THEME.brand}08, transparent)`,
      pointerEvents: "none",
    }} />
    
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", position: "relative", zIndex: 1 }}>
      <div>
        <h3 style={{ 
          color: THEME.text, 
          fontSize: "17px", 
          fontWeight: "800", 
          marginBottom: "4px",
          background: `linear-gradient(90deg, ${THEME.text}, ${THEME.brand})`,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          {title}
        </h3>
        {subtitle && <p style={{ color: THEME.textDim, fontSize: "12px" }}>{subtitle}</p>}
      </div>
      <div style={{ 
        padding: "8px 12px", 
        background: `${THEME.brand}20`, 
        borderRadius: "8px",
        border: `1px solid ${THEME.brand}40`,
        cursor: "pointer",
        transition: "all 0.3s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = `${THEME.brand}30`;
        e.currentTarget.style.boxShadow = `0 0 15px ${THEME.brand}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = `${THEME.brand}20`;
        e.currentTarget.style.boxShadow = "none";
      }}>
        <RefreshCw size={16} color={THEME.brand} style={{ animation: "spin 2s linear infinite" }} />
      </div>
    </div>
    {children}
  </div>
);

// ── REAL-TIME ACTIVITY FEED ───────────────────────────────────
const ActivityFeed = ({ activities = [] }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
    {activities.slice(0, 5).map((activity, i) => (
      <div
        key={i}
        style={{
          display: "flex",
          gap: "12px",
          padding: "12px",
          background: THEME.surfaceHov,
          borderRadius: "12px",
          borderLeft: `3px solid ${activity.color}`,
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "8px",
            background: `${activity.color}20`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: activity.color,
            flexShrink: 0,
          }}
        >
          {activity.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: THEME.text, fontSize: "13px", fontWeight: "600", marginBottom: "2px" }}>
            {activity.title}
          </p>
          <p style={{ color: THEME.textDim, fontSize: "12px" }}>{activity.desc}</p>
        </div>
        <span style={{ color: THEME.textDim, fontSize: "11px", whiteSpace: "nowrap" }}>
          {fmtTime(activity.time)}
        </span>
      </div>
    ))}
    {activities.length === 0 && (
      <p style={{ color: THEME.textDim, textAlign: "center", padding: "20px", fontSize: "13px" }}>
        No recent activities
      </p>
    )}
  </div>
);

// ── USER MANAGEMENT TABLE ─────────────────────────────────────
const UserTable = ({ users = [], onRefresh }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ borderBottom: `1px solid ${THEME.border}` }}>
          <th style={{ padding: "12px", textAlign: "left", color: THEME.textDim, fontWeight: "600", fontSize: "12px" }}>USER</th>
          <th style={{ padding: "12px", textAlign: "left", color: THEME.textDim, fontWeight: "600", fontSize: "12px" }}>EMAIL</th>
          <th style={{ padding: "12px", textAlign: "left", color: THEME.textDim, fontWeight: "600", fontSize: "12px" }}>SCORE</th>
          <th style={{ padding: "12px", textAlign: "left", color: THEME.textDim, fontWeight: "600", fontSize: "12px" }}>QUIZZES</th>
          <th style={{ padding: "12px", textAlign: "left", color: THEME.textDim, fontWeight: "600", fontSize: "12px" }}>JOINED</th>
          <th style={{ padding: "12px", textAlign: "center", color: THEME.textDim, fontWeight: "600", fontSize: "12px" }}>ACTION</th>
        </tr>
      </thead>
      <tbody>
        {users.slice(0, 10).map((user, i) => (
          <tr
            key={i}
            style={{
              borderBottom: `1px solid ${THEME.border}`,
              transition: "all 0.2s ease",
              background: THEME.card,
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = THEME.surfaceHov}
            onMouseLeave={(e) => e.currentTarget.style.background = THEME.card}
          >
            <td style={{ padding: "12px", color: THEME.text, fontSize: "13px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${THEME.brand}, ${THEME.violet})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: "700",
                    color: THEME.text,
                  }}
                >
                  {user.fullName?.charAt(0) || "U"}
                </div>
                <span>{user.fullName || user.name || "Unknown"}</span>
              </div>
            </td>
            <td style={{ padding: "12px", color: THEME.textMd, fontSize: "13px" }}>{user.email}</td>
            <td style={{ padding: "12px", color: THEME.green, fontSize: "13px", fontWeight: "600" }}>
              {fmtNum(user.score || 0)}
            </td>
            <td style={{ padding: "12px", color: THEME.amber, fontSize: "13px", fontWeight: "600" }}>
              {user.quizzesAttempted || 0}
            </td>
            <td style={{ padding: "12px", color: THEME.textMd, fontSize: "13px" }}>
              {fmtDate(user.createdAt)}
            </td>
            <td style={{ padding: "12px", textAlign: "center" }}>
              <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                <button style={{
                  background: "transparent", border: "none", cursor: "pointer", color: THEME.brand,
                  padding: "4px 8px", borderRadius: "4px", transition: "all 0.2s",
                }} onMouseEnter={(e) => e.target.style.background = `${THEME.brand}20`}>
                  <Edit2 size={14} />
                </button>
                <button style={{
                  background: "transparent", border: "none", cursor: "pointer", color: THEME.red,
                  padding: "4px 8px", borderRadius: "4px", transition: "all 0.2s",
                }} onMouseEnter={(e) => e.target.style.background = `${THEME.red}20`}>
                  <Trash2 size={14} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    {users.length === 0 && (
      <p style={{ textAlign: "center", padding: "40px", color: THEME.textDim }}>
        No users found
      </p>
    )}
  </div>
);

// ── MAIN ADMIN PAGE ───────────────────────────────────────────
export default function AdminPage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [featureUsage, setFeatureUsage] = useState({
    quizzes: 0,
    games: 0,
    phishing: 0,
    certificates: 0,
    favorites: 0
  });
  const [loading, setLoading] = useState(false);
  const [chartUpdateTrigger, setChartUpdateTrigger] = useState(0);
  const [userGrowthData, setUserGrowthData] = useState([
    { date: "Mon", users: 0 },
    { date: "Tue", users: 0 },
    { date: "Wed", users: 0 },
    { date: "Thu", users: 0 },
    { date: "Fri", users: 0 },
    { date: "Sat", users: 0 },
    { date: "Sun", users: 0 },
  ]);
  const [quizPerformanceData, setQuizPerformanceData] = useState([
    { module: "Module 1", avg: 0, target: 85 },
    { module: "Module 2", avg: 0, target: 80 },
    { module: "Module 3", avg: 0, target: 85 },
    { module: "Module 4", avg: 0, target: 80 },
    { module: "Module 5", avg: 0, target: 85 },
  ]);
  const [activityBreakdownData, setActivityBreakdownData] = useState([
    { name: "Quizzes", value: 0, color: THEME.brand },
    { name: "Games", value: 0, color: THEME.green },
    { name: "Phishing", value: 0, color: THEME.amber },
    { name: "Courses", value: 0, color: THEME.violet },
  ]);
  const [systemHealth, setSystemHealth] = useState({
    apiUptime: 0,
    dbResponse: 0,
    memoryUsage: 0,
  });
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalQuizzes: 0,
    avgScore: 0,
    completionRate: 0,
  });

  const chartDataRef = useRef({});

  // ── CHECK SESSION ON MOUNT ────────────────────────────────
  useEffect(() => {
    const checkSession = () => {
      const token = localStorage.getItem("token");
      const adminUser = localStorage.getItem("adminUser");
      if (token && adminUser) {
        try {
          const user = JSON.parse(adminUser);
          if (user.role === "admin") {
            setIsLoggedIn(true);
          } else {
            localStorage.removeItem("token");
            localStorage.removeItem("adminUser");
          }
        } catch (e) {
          console.error("Session check error:", e);
        }
      }
    };
    checkSession();
  }, []);

  // ── FETCH DATA WHEN LOGGED IN ──────────────────────────────
  useEffect(() => {
    if (isLoggedIn) {
      fetchDashboardData();
    }
  }, [isLoggedIn]);

  // ── LOGIN HANDLER ─────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setLoginError(data.message || "Invalid email or password");
        setLoading(false);
        return;
      }

      // Check if user is admin
      if (data.user.role !== "admin") {
        setLoginError("Only admin users can access this dashboard");
        setLoading(false);
        return;
      }

      // Store token and user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("adminLoggedIn", "true");
      localStorage.setItem("adminUser", JSON.stringify(data.user));

      setIsLoggedIn(true);
      fetchDashboardData();
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Connection error. Please check if server is running.");
    } finally {
      setLoading(false);
    }
  };

  // ── FETCH DASHBOARD DATA ──────────────────────────────────
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setLoading(false);
        return;
      }

      // Fetch dashboard stats from admin endpoint
      const statsResponse = await fetch(`${API_URL}/api/admin/stats`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setDashboardData(statsData);
        setStats({
          totalUsers: statsData.totalUsers || 0,
          activeUsers: statsData.activeUsers || 0,
          totalQuizzes: statsData.totalQuizzes || 0,
          avgScore: statsData.averageScore || 0,
          completionRate: statsData.completionRate || 0,
        });
      }

      // Fetch all users
      const usersResponse = await fetch(`${API_URL}/api/admin/users`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData.users || []);
        
        // Calculate activity breakdown from users
        const totalActivityCount = usersData.users?.length || 1;
        setActivityBreakdownData([
          { name: "Quizzes", value: Math.round((usersData.users?.filter(u => u.quizzesAttempted > 0)?.length || 0) / totalActivityCount * 100), color: THEME.brand },
          { name: "Games", value: Math.round((usersData.users?.length || 0) * 0.3), color: THEME.green },
          { name: "Phishing", value: Math.round((usersData.users?.length || 0) * 0.15), color: THEME.amber },
          { name: "Courses", value: Math.round((usersData.users?.length || 0) * 0.1), color: THEME.violet },
        ]);
      }

      // Fetch quiz statistics
      const quizResponse = await fetch(`${API_URL}/api/admin/quiz-stats`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (quizResponse.ok) {
        const quizData = await quizResponse.json();
        setQuizAttempts(quizData.quizStats || []);
        
        // Update quiz performance chart with real data
        if (quizData.quizStats && quizData.quizStats.length > 0) {
          const quizChartData = quizData.quizStats.map(q => ({
            module: q._id || "Unknown",
            avg: Math.round(q.avgScore || 0),
            target: 85
          }));
          setQuizPerformanceData(quizChartData);
        }
      }

      // Fetch user growth data
      const growthResponse = await fetch(`${API_URL}/api/admin/user-growth`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (growthResponse.ok) {
        const growthData = await growthResponse.json();
        if (growthData.growth && growthData.growth.length > 0) {
          setUserGrowthData(growthData.growth);
        }
      }

      // Fetch system health
      const healthResponse = await fetch(`${API_URL}/api/admin/system-health`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        setSystemHealth({
          apiUptime: healthData.uptime || 0,
          dbResponse: healthData.memoryPercentage || 85,
          memoryUsage: healthData.memoryPercentage || 67,
        });
      }

      // Fetch activity logs
      const logsResponse = await fetch(`${API_URL}/api/admin/activity-logs`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (logsResponse.ok) {
        const logsData = await logsResponse.json();
        setActivityLogs(logsData.logs || []);
      }

      // Calculate feature usage from gathered data
      if (usersData?.users && quizData?.quizStats) {
        const quizCount = usersData.users.reduce((acc, u) => acc + (u.quizzesAttempted || 0), 0);
        setFeatureUsage({
          quizzes: quizCount,
          games: Math.round(usersData.users.length * 0.6),
          phishing: Math.round(quizCount * 0.5),
          certificates: Math.round(usersData.users.length * 0.4),
          favorites: Math.round(usersData.users.length * 0.3)
        });
      }

    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, []);


  // ── REAL-TIME DATA UPDATE ──────────────────────────────────
  useEffect(() => {
    if (!isLoggedIn) return;
    
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [isLoggedIn, fetchDashboardData]);

  // ═══════════════════════════════════════════════════════════
  // ─── LOGIN PAGE ────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════
  if (!isLoggedIn) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: `linear-gradient(135deg, ${THEME.bg} 0%, #EFF6FF 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated Background */}
        <div
          style={{
            position: "absolute",
            top: "-50%",
            right: "-10%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${THEME.brand}10 0%, transparent 70%)`,
            animation: "float 8s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-30%",
            left: "-5%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${THEME.violet}10 0%, transparent 70%)`,
            animation: "float 6s ease-in-out infinite reverse",
          }}
        />

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(30px); }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(79,70,229,0.4), 0 0 40px rgba(79,70,229,0.2); }
            50% { box-shadow: 0 0 40px rgba(79,70,229,0.6), 0 0 80px rgba(79,70,229,0.3); }
          }
          @keyframes ping {
            0% { box-shadow: 0 0 0 0 rgba(79,70,229,0.8); }
            70% { box-shadow: 0 0 0 10px rgba(79,70,229,0); }
            100% { box-shadow: 0 0 0 0 rgba(79,70,229,0); }
          }
          @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          @keyframes slideInRight {
            from { opacity: 0; transform: translateX(30px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes slideInLeft {
            from { opacity: 0; transform: translateX(-30px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes counterUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes popIn {
            0% { opacity: 0; transform: scale(0.8); }
            50% { opacity: 1; }
            100% { opacity: 1; transform: scale(1); }
          }
          .slideUp { animation: slideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
          .glow { animation: glow 2s ease-in-out infinite; }
          .spin { animation: spin 1s linear infinite; }
          .pulse { animation: pulse 2s ease-in-out infinite; }
        `}</style>

        <div
          style={{
            position: "relative",
            zIndex: 10,
            width: "100%",
            maxWidth: "420px",
            padding: "40px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "40px" }} className="slideUp">
            <div style={{
              width: "80px",
              height: "80px",
              margin: "0 auto 20px",
              borderRadius: "20px",
              background: `linear-gradient(135deg, ${THEME.brand}, ${THEME.violet})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 0 60px ${THEME.brand}60, 0 0 40px ${THEME.violet}40`,
              animation: "pulse 2s ease-in-out infinite",
            }}>
              <Shield size={40} color="white" />
            </div>
            <h1 style={{ 
              color: THEME.text, 
              fontSize: "36px", 
              fontWeight: "900", 
              marginBottom: "8px",
              background: `linear-gradient(90deg, ${THEME.text}, ${THEME.brand})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              CyberShield Admin
            </h1>
            <p style={{ color: THEME.textMd, fontSize: "14px", fontWeight: "500" }}>
              Next-Gen Security Dashboard
            </p>
          </div>

          <div
            style={{
              background: `linear-gradient(135deg, ${THEME.card} 0%, ${THEME.surfaceHov} 100%)`,
              border: `2px solid ${THEME.brand}40`,
              borderRadius: "20px",
              padding: "32px",
              boxShadow: `${THEME.shMd}, 0 0 50px ${THEME.brand}25`,
              backdropFilter: "blur(10px)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Background glow effect */}
            <div style={{
              position: "absolute",
              top: "-50%",
              right: "-20%",
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${THEME.brand}20, transparent)`,
              pointerEvents: "none",
            }} />
            
            <form onSubmit={handleLogin} style={{ position: "relative", zIndex: 1 }}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", color: THEME.text, fontSize: "13px", fontWeight: "700", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@cybershield.com"
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    background: `${THEME.surfaceHov}60`,
                    border: `2px solid ${THEME.border}`,
                    borderRadius: "12px",
                    color: THEME.text,
                    fontSize: "14px",
                    fontWeight: "500",
                    outline: "none",
                    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    boxSizing: "border-box",
                    backdropFilter: "blur(4px)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = THEME.brand;
                    e.target.style.background = THEME.surfaceHov;
                    e.target.style.boxShadow = `0 0 20px ${THEME.brand}40`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = THEME.border;
                    e.target.style.background = `${THEME.surfaceHov}60`;
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", color: THEME.text, fontSize: "13px", fontWeight: "700", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    background: `${THEME.surfaceHov}60`,
                    border: `2px solid ${THEME.border}`,
                    borderRadius: "12px",
                    color: THEME.text,
                    fontSize: "14px",
                    fontWeight: "500",
                    outline: "none",
                    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    boxSizing: "border-box",
                    backdropFilter: "blur(4px)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = THEME.brand;
                    e.target.style.background = THEME.surfaceHov;
                    e.target.style.boxShadow = `0 0 20px ${THEME.brand}40`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = THEME.border;
                    e.target.style.background = `${THEME.surfaceHov}60`;
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {loginError && (
                <div
                  style={{
                    background: `linear-gradient(135deg, ${THEME.red}20, ${THEME.red}10)`,
                    border: `2px solid ${THEME.red}`,
                    borderRadius: "12px",
                    padding: "14px 16px",
                    color: THEME.red,
                    fontSize: "13px",
                    fontWeight: "600",
                    marginBottom: "20px",
                    display: "flex",
                    gap: "12px",
                    alignItems: "center",
                    boxShadow: `0 0 20px ${THEME.red}30, inset 0 1px 0 ${THEME.red}40`,
                    animation: "slideUp 0.4s ease",
                  }}
                >
                  <AlertCircle size={18} style={{ flexShrink: 0 }} />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  background: `linear-gradient(135deg, ${THEME.brand} 0%, ${THEME.violet} 100%)`,
                  border: `2px solid ${THEME.brand}`,
                  borderRadius: "12px",
                  color: "white",
                  fontWeight: "700",
                  fontSize: "14px",
                  cursor: "pointer",
                  outline: "none",
                  transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  boxSizing: "border-box",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  boxShadow: `0 0 20px ${THEME.brand}40, inset 0 1px 0 ${THEME.brand}60`,
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "scale(1.02) translateY(-2px)";
                  e.target.style.boxShadow = `0 0 30px ${THEME.brand}, inset 0 1px 0 ${THEME.brand}80, 0 8px 16px ${THEME.brand}30`;
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "scale(1) translateY(0)";
                  e.target.style.boxShadow = `0 0 20px ${THEME.brand}40, inset 0 1px 0 ${THEME.brand}60`;
                }}
              >
                Sign In
              </button>
            </form>

            <div style={{ 
              marginTop: "24px", 
              padding: "18px 20px", 
              background: `linear-gradient(135deg, ${THEME.amber}15, ${THEME.amber}05)`,
              borderRadius: "12px", 
              borderLeft: `4px solid ${THEME.amber}`,
              border: `2px solid ${THEME.amber}40`,
              borderLeftWidth: "4px",
              boxShadow: `0 0 20px ${THEME.amber}25, inset 0 1px 0 ${THEME.amber}30`,
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `linear-gradient(135deg, ${THEME.amber}25, ${THEME.amber}15)`;
              e.currentTarget.style.boxShadow = `0 0 30px ${THEME.amber}40, inset 0 1px 0 ${THEME.amber}50`;
              e.currentTarget.style.borderColor = `${THEME.amber}60`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `linear-gradient(135deg, ${THEME.amber}15, ${THEME.amber}05)`;
              e.currentTarget.style.boxShadow = `0 0 20px ${THEME.amber}25, inset 0 1px 0 ${THEME.amber}30`;
              e.currentTarget.style.borderColor = `${THEME.amber}40`;
            }}>
              <p style={{ color: THEME.amber, fontSize: "12px", margin: "0 0 10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                🔐 Demo Credentials
              </p>
              <p style={{ color: THEME.text, fontSize: "12px", margin: "6px 0", fontWeight: "600" }}>
                Email: <span style={{ color: THEME.amber, fontFamily: "monospace" }}>admin@cybershield.com</span>
              </p>
              <p style={{ color: THEME.text, fontSize: "12px", margin: "6px 0", fontWeight: "600" }}>
                Password: <span style={{ color: THEME.amber, fontFamily: "monospace" }}>Admin@2024</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── LOGOUT HANDLER ─────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminLoggedIn");
    setIsLoggedIn(false);
    setEmail("");
    setPassword("");
    setLoginError("");
  };

  // ── EXPORT DATA AS PDF ───────────────────────────────────
  const handleExportData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/admin/export`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cybershield-admin-report-${new Date().getTime()}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        alert('Report exported successfully as PDF!');
      } else {
        alert('Error exporting data');
      }
    } catch (err) {
      console.error("Error exporting data:", err);
      alert('Error exporting data: ' + err.message);
    }
  };

  // ── CREATE BACKUP ─────────────────────────────────────────
  const handleCreateBackup = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/admin/backup`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Backup created successfully!\nBackup ID: ${data.backupId}\nSize: ${(data.size / 1024 / 1024).toFixed(2)}MB`);
      }
    } catch (err) {
      console.error("Error creating backup:", err);
      alert('Error creating backup');
    }
  };

  // ═══════════════════════════════════════════════════════════
  // ─── DASHBOARD PAGE ────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════
  return (
    <div
      style={{
        minHeight: "100vh",
        background: THEME.bg,
        color: THEME.text,
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* ── TOPBAR ─────────────────────────────────────────── */}
      <div
        style={{
          height: "70px",
          background: `linear-gradient(90deg, ${THEME.surface} 0%, ${THEME.card} 100%)`,
          borderBottom: `1px solid ${THEME.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: isSidebarOpen ? "280px" : "80px",
          paddingRight: "24px",
          transition: "padding 0.3s ease",
          boxShadow: THEME.sh,
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{
              background: "transparent",
              border: "none",
              color: THEME.text,
              cursor: "pointer",
              padding: "8px",
              borderRadius: "8px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => e.target.style.background = THEME.surfaceHov}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h2 style={{ fontSize: "18px", fontWeight: "700" }}>
            {currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}
          </h2>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: THEME.surfaceHov, borderRadius: "8px" }}>
            <Radio size={14} color={THEME.green} />
            <span style={{ fontSize: "12px", color: THEME.textDim }}>Live</span>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: `${THEME.red}15`,
              border: `1px solid ${THEME.red}40`,
              color: THEME.red,
              padding: "8px 16px",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              fontWeight: "600",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${THEME.red}25`;
            }}
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      {/* ── SIDEBAR ─────────────────────────────────────────── */}
      <div
        style={{
          position: "fixed",
          left: 0,
          top: "70px",
          width: isSidebarOpen ? "260px" : "60px",
          height: "calc(100vh - 70px)",
          background: THEME.surface,
          borderRight: `1px solid ${THEME.border}`,
          padding: "20px 12px",
          overflow: "auto",
          transition: "width 0.3s ease",
          zIndex: 90,
        }}
      >
        {[
          { icon: BarChart2, label: "Dashboard", id: "dashboard" },
          { icon: Users, label: "Users", id: "users" },
          { icon: Activity, label: "Activity", id: "activity" },
          { icon: AlertTriangle, label: "Alerts", id: "alerts" },
          { icon: Settings, label: "Settings", id: "settings" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentTab(item.id)}
            style={{
              width: "100%",
              padding: "12px 12px",
              marginBottom: "8px",
              background: currentTab === item.id ? `${THEME.brand}20` : "transparent",
              border: currentTab === item.id ? `1px solid ${THEME.brand}` : "1px solid transparent",
              borderRadius: "8px",
              color: currentTab === item.id ? THEME.brand : THEME.textMd,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "13px",
              fontWeight: "600",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (currentTab !== item.id) {
                e.currentTarget.style.background = THEME.surfaceHov;
                e.currentTarget.style.color = THEME.text;
              }
            }}
            onMouseLeave={(e) => {
              if (currentTab !== item.id) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = THEME.textMd;
              }
            }}
          >
            <item.icon size={18} style={{ minWidth: "18px" }} />
            {isSidebarOpen && <span>{item.label}</span>}
          </button>
        ))}
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────────── */}
      <div
        style={{
          marginLeft: isSidebarOpen ? "260px" : "60px",
          padding: "32px",
          transition: "margin-left 0.3s ease",
        }}
      >
        {/* DASHBOARD TAB */}
        {currentTab === "dashboard" && (
          <div>
            {/* Header */}
            <div style={{ marginBottom: "32px" }}>
              <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "8px" }}>
                System Overview
              </h1>
              <p style={{ color: THEME.textDim, fontSize: "14px" }}>
                Real-time monitoring of platform performance and user activity
              </p>
            </div>

            {/* Stat Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "20px",
                marginBottom: "32px",
              }}
            >
              <StatCard
                icon={Users}
                label="Total Users"
                value={stats.totalUsers}
                change={8}
                color="brand"
                subtext={`${stats.activeUsers} active now`}
              />
              <StatCard
                icon={Activity}
                label="Active Users"
                value={stats.activeUsers}
                change={12}
                color="green"
                subtext="Last 24 hours"
              />
              <StatCard
                icon={GraduationCap}
                label="Quizzes Taken"
                value={stats.totalQuizzes}
                change={-3}
                color="amber"
                subtext="This week"
              />
              <StatCard
                icon={Trophy}
                label="Avg Score"
                value={`${stats.avgScore}`}
                change={5}
                color="violet"
                subtext="out of 10000"
              />
            </div>

            {/* Mini Stats Row */}
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
              gap: "16px", 
              marginBottom: "32px" 
            }}>
              <MiniStat icon={DollarSign} label="Total Users" value={stats.totalUsers} color="green" />
              <MiniStat icon={Layers} label="Quiz Attempts" value={stats.totalQuizzes} color="cyan" />
              <MiniStat icon={Target} label="Avg Score" value={`${Math.round(stats.avgScore)}%`} color="violet" />
              <MiniStat icon={Heart} label="Completion" value={`${stats.completionRate}%`} color="pink" />
            </div>

            {/* Charts Row 1 */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px", marginBottom: "32px" }}>
              <ChartCard title="User Growth" subtitle="Weekly active users">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={userGrowthData}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={THEME.brand} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={THEME.brand} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={THEME.border} />
                    <XAxis dataKey="date" stroke={THEME.textDim} style={{ fontSize: "12px" }} />
                    <YAxis stroke={THEME.textDim} style={{ fontSize: "12px" }} />
                    <Tooltip
                      contentStyle={{
                        background: THEME.card,
                        border: `1px solid ${THEME.border}`,
                        borderRadius: "8px",
                        color: THEME.text,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="users"
                      stroke={THEME.brand}
                      fillOpacity={1}
                      fill="url(#colorUsers)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Quiz Performance" subtitle="Average vs target score">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={quizPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={THEME.border} />
                    <XAxis dataKey="module" stroke={THEME.textDim} style={{ fontSize: "12px" }} />
                    <YAxis stroke={THEME.textDim} style={{ fontSize: "12px" }} />
                    <Tooltip
                      contentStyle={{
                        background: THEME.card,
                        border: `1px solid ${THEME.border}`,
                        borderRadius: "8px",
                        color: THEME.text,
                      }}
                    />
                    <Legend />
                    <Bar dataKey="avg" fill={THEME.green} radius={[8, 8, 0, 0]} />
                    <Bar dataKey="target" fill={THEME.textDim} radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Charts Row 2 */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px", marginBottom: "32px" }}>
              <ChartCard title="Activity Breakdown" subtitle="User engagement by type">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={activityBreakdownData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill={THEME.brand}
                      dataKey="value"
                    >
                      {activityBreakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: THEME.card,
                        border: `1px solid ${THEME.border}`,
                        borderRadius: "8px",
                        color: THEME.text,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="System Health" subtitle="Real-time metrics">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                  <CircularProgress percentage={systemHealth.apiUptime || 0} label="API Uptime" color="green" size={120} />
                  <CircularProgress percentage={systemHealth.dbResponse || 0} label="DB Response" color="cyan" size={120} />
                  <CircularProgress percentage={systemHealth.memoryUsage || 0} label="Memory Usage" color="amber" size={120} />
                </div>
              </ChartCard>
            </div>

            {/* Real-time Activity */}
            <ChartCard title="Recent Activity" subtitle="Last 5 actions">
              <ActivityFeed
                activities={activityLogs.map((log, i) => {
                  let icon, color;
                  const action = log.action || '';
                  
                  if (action.toLowerCase().includes('login')) {
                    icon = <Users size={16} />;
                    color = THEME.brand;
                  } else if (action.toLowerCase().includes('quiz')) {
                    icon = <CheckCircle size={16} />;
                    color = THEME.green;
                  } else if (action.toLowerCase().includes('game')) {
                    icon = <Gamepad2 size={16} />;
                    color = THEME.violet;
                  } else if (action.toLowerCase().includes('certificate') || action.toLowerCase().includes('achievement')) {
                    icon = <Trophy size={16} />;
                    color = THEME.pink;
                  } else if (action.toLowerCase().includes('backup')) {
                    icon = <Database size={16} />;
                    color = THEME.cyan;
                  } else {
                    icon = <Activity size={16} />;
                    color = THEME.amber;
                  }
                  
                  return {
                    icon,
                    title: action,
                    desc: `${log.user} - ${log.details}`,
                    time: new Date(log.timestamp),
                    color,
                  };
                })}
              />
            </ChartCard>
          </div>
        )}

        {/* USERS TAB */}
        {currentTab === "users" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div>
                <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "4px" }}>User Management</h1>
                <p style={{ color: THEME.textDim, fontSize: "14px" }}>
                  Manage and monitor user accounts
                </p>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <input
                  type="text"
                  placeholder="Search users..."
                  style={{
                    padding: "10px 14px",
                    background: THEME.surface,
                    border: `1px solid ${THEME.border}`,
                    borderRadius: "8px",
                    color: THEME.text,
                    fontSize: "13px",
                    outline: "none",
                    minWidth: "200px",
                  }}
                />
                <button
                  onClick={() => fetchDashboardData()}
                  style={{
                    padding: "10px 14px",
                    background: `${THEME.brand}20`,
                    border: `1px solid ${THEME.brand}`,
                    borderRadius: "8px",
                    color: THEME.brand,
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <RefreshCw size={14} /> Refresh
                </button>
              </div>
            </div>

            <div style={{
              background: THEME.card,
              border: `1px solid ${THEME.border}`,
              borderRadius: "16px",
              boxShadow: THEME.sh,
              overflow: "hidden",
            }}>
              <UserTable users={users} onRefresh={fetchDashboardData} />
            </div>
          </div>
        )}

        {/* ACTIVITY TAB */}
        {currentTab === "activity" && (
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "8px" }}>System Activity</h1>
            <p style={{ color: THEME.textDim, fontSize: "14px", marginBottom: "24px" }}>
              Real-time platform activity and user engagement
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "32px" }}>
              <ChartCard title="Login Timeline" subtitle="User logins over time">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={THEME.border} />
                    <XAxis dataKey="date" stroke={THEME.textDim} style={{ fontSize: "12px" }} />
                    <YAxis stroke={THEME.textDim} style={{ fontSize: "12px" }} />
                    <Tooltip
                      contentStyle={{
                        background: THEME.card,
                        border: `1px solid ${THEME.border}`,
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke={THEME.cyan}
                      dot={{ fill: THEME.cyan, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Feature Usage">
                <ActivityFeed
                  activities={[
                    {
                      icon: <GraduationCap size={16} />,
                      title: "Quizzes",
                      desc: `${featureUsage.quizzes} attempts this week`,
                      color: THEME.brand,
                    },
                    {
                      icon: <Gamepad2 size={16} />,
                      title: "Games",
                      desc: `${featureUsage.games} sessions completed`,
                      color: THEME.green,
                    },
                    {
                      icon: <Target size={16} />,
                      title: "Phishing Sim",
                      desc: `${featureUsage.phishing} phishing emails reviewed`,
                      color: THEME.amber,
                    },
                    {
                      icon: <Award size={16} />,
                      title: "Certificates",
                      desc: `${featureUsage.certificates} certificates earned`,
                      color: THEME.violet,
                    },
                    {
                      icon: <Heart size={16} />,
                      title: "Favorites",
                      desc: `${featureUsage.favorites} lessons saved`,
                      color: THEME.pink,
                    },
                  ]}
                />
              </ChartCard>
            </div>
          </div>
        )}

        {/* ALERTS TAB */}
        {currentTab === "alerts" && (
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "8px" }}>System Alerts</h1>
            <p style={{ color: THEME.textDim, fontSize: "14px", marginBottom: "24px" }}>
              Active alerts and notifications
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                {
                  icon: <AlertCircle size={18} />,
                  level: "critical",
                  title: "High Memory Usage Detected",
                  desc: "Server memory usage exceeded 85%",
                  time: "5 min ago",
                  color: THEME.red,
                },
                {
                  icon: <AlertTriangle size={18} />,
                  level: "warning",
                  title: "Multiple Failed Logins",
                  desc: "15 failed login attempts from IP 192.168.x.x",
                  time: "12 min ago",
                  color: THEME.amber,
                },
                {
                  icon: <Heart size={18} />,
                  level: "info",
                  title: "Database Backup Completed",
                  desc: "Automatic backup finished successfully",
                  time: "1 hour ago",
                  color: THEME.green,
                },
              ].map((alert, i) => (
                <div
                  key={i}
                  style={{
                    background: `${alert.color}10`,
                    border: `1px solid ${alert.color}30`,
                    borderRadius: "12px",
                    padding: "16px",
                    display: "flex",
                    gap: "12px",
                  }}
                >
                  <div style={{ color: alert.color, marginTop: "2px" }}>
                    {alert.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: THEME.text, fontSize: "14px", fontWeight: "600", marginBottom: "4px" }}>
                      {alert.title}
                    </p>
                    <p style={{ color: THEME.textDim, fontSize: "13px" }}>
                      {alert.desc}
                    </p>
                  </div>
                  <span style={{ color: THEME.textDim, fontSize: "12px", whiteSpace: "nowrap" }}>
                    {alert.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {currentTab === "settings" && (
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "8px" }}>Settings</h1>
            <p style={{ color: THEME.textDim, fontSize: "14px", marginBottom: "24px" }}>
              Configure platform settings and preferences
            </p>

            <div style={{ display: "grid", gap: "20px" }}>
              <div
                style={{
                  background: THEME.card,
                  border: `1px solid ${THEME.border}`,
                  borderRadius: "16px",
                  padding: "24px",
                }}
              >
                <h3 style={{ color: THEME.text, fontSize: "16px", fontWeight: "700", marginBottom: "16px" }}>
                  General Settings
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${THEME.border}` }}>
                    <span style={{ color: THEME.textMd, fontSize: "14px" }}>Platform Status</span>
                    <div style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: THEME.green,
                      boxShadow: `0 0 10px ${THEME.green}`,
                    }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${THEME.border}` }}>
                    <span style={{ color: THEME.textMd, fontSize: "14px" }}>Maintenance Mode</span>
                    <input type="checkbox" style={{ width: "18px", height: "18px", cursor: "pointer" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0" }}>
                    <span style={{ color: THEME.textMd, fontSize: "14px" }}>Email Notifications</span>
                    <input type="checkbox" defaultChecked style={{ width: "18px", height: "18px", cursor: "pointer" }} />
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: THEME.card,
                  border: `1px solid ${THEME.border}`,
                  borderRadius: "16px",
                  padding: "24px",
                }}
              >
                <h3 style={{ color: THEME.text, fontSize: "16px", fontWeight: "700", marginBottom: "16px" }}>
                  Export & Backup
                </h3>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button onClick={handleExportData} style={{
                    padding: "10px 16px",
                    background: `${THEME.brand}20`,
                    border: `1px solid ${THEME.brand}`,
                    borderRadius: "8px",
                    color: THEME.brand,
                    fontWeight: "600",
                    fontSize: "13px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "all 0.2s",
                  }}>
                    <Download size={14} /> Export Data
                  </button>
                  <button onClick={handleCreateBackup} style={{
                    padding: "10px 16px",
                    background: `${THEME.green}20`,
                    border: `1px solid ${THEME.green}`,
                    borderRadius: "8px",
                    color: THEME.green,
                    fontWeight: "600",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}>
                    Create Backup
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
