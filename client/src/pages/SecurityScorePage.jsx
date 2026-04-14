import { useState, useEffect } from "react";
import {
  TrendingUp, ShieldAlert, BookOpen, Zap, Target, CheckCircle2,
  AlertCircle, Lightbulb, Clock, Lock, Eye, Brain, Award
} from "lucide-react";

const T = {
  bg: "#F0F2F8", surface: "#FFFFFF", card: "#FFFFFF", border: "rgba(99,102,241,0.14)",
  brand: "#4F46E5", brandDark: "#3730A3", brandGlow: "rgba(79,70,229,0.18)",
  teal: "#0D9488", tealDim: "rgba(13,148,136,0.10)", tealLight: "rgba(13,148,136,0.20)",
  violet: "#7C3AED", amber: "#D97706", amberDim: "rgba(217,119,6,0.10)",
  red: "#DC2626", redDim: "rgba(220,38,38,0.08)", green: "#059669", greenDim: "rgba(5,150,105,0.10)",
  pink: "#DB2777", text: "#111827", textMd: "#4B5563", textDim: "#9CA3AF",
  sh: "0 1px 4px rgba(0,0,0,0.07)", shMd: "0 4px 20px rgba(0,0,0,0.10)",
};

const API = {
  headers: () => ({ "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` }),
  get: (url) => fetch(url, { headers: API.headers() }).then(r => r.ok ? r.json() : Promise.reject(r)),
  post: (url, body) => fetch(url, { method: "POST", headers: API.headers(), body: JSON.stringify(body) }).then(r => r.json()),
};

function ProgressRing({ score, size = 200, strokeWidth = 8 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 80) return T.green;
    if (score >= 60) return T.teal;
    if (score >= 40) return T.amber;
    return T.red;
  };

  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", width: size, height: size }}>
      {/* FIX 1: Merged both style props into one on the <svg> element */}
      <svg
        width={size}
        height={size}
        style={{ transform: "rotate(-90deg)", position: "absolute" }}
      >
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={T.border} strokeWidth={strokeWidth} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={getColor()} strokeWidth={strokeWidth} fill="none" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.6s ease" }} />
      </svg>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 44, fontWeight: 800, color: getColor(), fontFamily: "'Syne',sans-serif" }}>{score}</div>
        <div style={{ fontSize: 10, color: T.textMd, fontWeight: 600, letterSpacing: "0.05em", marginTop: 4 }}>SECURITY SCORE</div>
      </div>
    </div>
  );
}

function Scorebar({ label, score, max = 100, color = T.brand }) {
  const pct = (score / max) * 100;
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: color }}>{Math.round(score)}/{max}</span>
      </div>
      <div style={{ width: "100%", height: 6, background: T.border, borderRadius: 99, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 99, transition: "width 0.5s ease" }} />
      </div>
    </div>
  );
}

export default function SecurityScorePage({ user }) {
  const [securityData, setSecurityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSecurityScore = async () => {
    try {
      const res = await API.get("/api/features/overview");
      if (res?.success) {
        setSecurityData({
          overallScore: res.securityScore?.overall || 0,
          quizScore: res.securityScore?.quizScore || 0,
          courseProgress: res.securityScore?.courseProgress || 0,
          reportScore: res.securityScore?.reportScore || 0,
          toolUsage: res.securityScore?.toolUsage || 0,
          streak: res.securityScore?.streak || 0,
          suggestions: res.securityScore?.suggestions || []
        });
        setError(null);
      } else {
        throw new Error(res?.message || "Failed to fetch security score");
      }
    } catch (err) {
      console.error("Security Score Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityScore();
  }, []);

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: T.text, marginBottom: 6, fontFamily: "'Syne',sans-serif" }}>Your Security Score</h1>
        <p style={{ fontSize: 14, color: T.textMd }}>Track your cybersecurity awareness and knowledge growth</p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 24px" }}>
          <div style={{ fontSize: 14, color: T.textDim }}>Loading your security profile...</div>
        </div>
      ) : error ? (
        <div style={{ background: T.redDim, border: `1px solid ${T.red}`, color: T.red, padding: "16px 20px", borderRadius: 12, fontSize: 13 }}>
          ❌ {error}
        </div>
      ) : (
        <>
          {/* Main Score Ring + Quick Stats */}
          <div className="dg2" style={{ gap: 24, marginBottom: 32 }}>
            {/* Left: Score Ring */}
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "32px", textAlign: "center", boxShadow: T.sh }}>
              <ProgressRing score={securityData?.overallScore || 0} size={180} />
              <p style={{ fontSize: 12, color: T.textMd, marginTop: 24, lineHeight: 1.6 }}>
                Your overall security score is based on your achievements across courses, quizzes, games, and tool usage.
              </p>
            </div>

            {/* Right: Score Breakdown */}
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "32px", boxShadow: T.sh }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 20, fontFamily: "'Syne',sans-serif" }}>Score Breakdown</h3>
              <Scorebar label="Quiz Performance" score={securityData?.quizScore || 0} color={T.brand} />
              <Scorebar label="Course Progress" score={securityData?.courseProgress || 0} color={T.teal} />
              <Scorebar label="Threat Reports" score={securityData?.reportScore || 0} color={T.violet} />
              <Scorebar label="Tool Usage" score={securityData?.toolUsage || 0} color={T.amber} />
              <div style={{ marginTop: 20, padding: "16px", background: `${T.brandDim}33`, border: `1px solid ${T.brand}`, borderRadius: 8, textAlign: "center" }}>
                <div style={{ fontSize: 12, color: T.textMd }}>🔥 Current Streak</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: T.brand, marginTop: 6 }}>{securityData?.streak || 0} days</div>
              </div>
            </div>
          </div>

          {/* Suggestions */}
          {securityData?.suggestions && securityData.suggestions.length > 0 && (
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "24px", marginBottom: 32, boxShadow: T.sh }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: T.brandGlow, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Lightbulb size={18} style={{ color: T.brand }} />
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: T.text, fontFamily: "'Syne',sans-serif" }}>Personalized Suggestions</h3>
              </div>
              <div style={{ display: "grid", gap: 12 }}>
                {securityData.suggestions.map((sugg, i) => (
                  <div key={i} style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 12, padding: "16px", display: "flex", gap: 12 }}>
                    <div style={{ width: 4, background: sugg.priority === "high" ? T.red : sugg.priority === "medium" ? T.amber : T.teal, borderRadius: 2 }} />
                    {/* FIX 2: Removed stray >, before this div */}
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 4 }}>{sugg.title}</p>
                      <p style={{ fontSize: 12, color: T.textMd, lineHeight: 1.5 }}>{sugg.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "24px", boxShadow: T.sh }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 16, fontFamily: "'Syne',sans-serif", display: "flex", alignItems: "center", gap: 8 }}>
              <Target size={18} style={{ color: T.brand }} />
              Ways to Improve
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
              {[
                { icon: BookOpen, title: "Complete Courses", desc: "Unlock new learning paths" },
                { icon: Brain, title: "Take Quizzes", desc: "Test your knowledge" },
                { icon: Zap, title: "Play Games", desc: "Learn through gamified challenges" },
                { icon: Lock, title: "Use Tools", desc: "Try scanner and analyzers" },
              ].map((item, i) => (
                <div key={i} style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 12, padding: "16px", textAlign: "center" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: T.brandGlow, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                    <item.icon size={20} style={{ color: T.brand }} />
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 4 }}>{item.title}</p>
                  <p style={{ fontSize: 11, color: T.textMd }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}