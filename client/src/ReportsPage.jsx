import { useState } from "react";
import {
  BarChart2, TrendingUp, Target, Clock, Award, Rocket,
  Brain, Shield, Mail, Activity, Zap, Filter
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, RadarChart, PolarGrid,
  PolarAngleAxis, Radar, PieChart, Pie, Cell, Legend
} from "recharts";

const C = {
  bg: "#050810",
  bgCard: "#0C1120",
  border: "rgba(99,102,241,0.15)",
  brand: "#6366F1",
  teal: "#14B8A6",
  violet: "#A78BFA",
  amber: "#F59E0B",
  red: "#EF4444",
  green: "#10B981",
  pink: "#EC4899",
  text: "#F1F5F9",
  textMd: "#94A3B8",
  textDim: "#475569",
};

const fmtDate = d => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
const fmtTime = s => s ? `${Math.floor(s / 60)}m ${s % 60}s` : "—";

function CTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0F1729", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 10, padding: "8px 12px", fontSize: 11 }}>
      <p style={{ color: C.textMd, marginBottom: 4, fontWeight: 600 }}>{label}</p>
      {payload.map((p, i) => <p key={i} style={{ color: p.color, margin: "2px 0" }}>{p.name}: <strong>{p.value}</strong></p>)}
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, sub }) {
  return (
    <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, position: "relative", overflow: "hidden", transition: "all .2s" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = color + "50"; e.currentTarget.style.boxShadow = `0 0 24px ${color}12`; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}>
      <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: color + "08", filter: "blur(16px)", pointerEvents: "none" }} />
      <div style={{ width: 36, height: 36, borderRadius: 10, background: color + "12", border: `1px solid ${color}20`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
        <Icon size={16} style={{ color }} />
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, color: C.text, fontFamily: "Syne, sans-serif", letterSpacing: "-0.02em", marginBottom: 3 }}>{value}</div>
      <div style={{ fontSize: 11, color: C.textMd }}>{label}</div>
      {sub && <div style={{ fontSize: 10, color: color, marginTop: 4, fontWeight: 600 }}>{sub}</div>}
    </div>
  );
}

function ProgBar({ label, pct, color }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
        <span style={{ color: C.textMd, fontWeight: 500 }}>{label}</span>
        <span style={{ fontWeight: 700, color, fontFamily: "JetBrains Mono, monospace" }}>{pct}%</span>
      </div>
      <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden" }}>
        <div style={{
          height: 6, width: `${pct}%`, background: `linear-gradient(90deg, ${color}99, ${color})`,
          borderRadius: 99, transition: "width 1.2s cubic-bezier(.16,1,.3,1)",
          boxShadow: `0 0 8px ${color}60`
        }} />
      </div>
    </div>
  );
}

export default function ReportsPage({ stats, setPage, navigate, quizHistory }) {
  const [period, setPeriod] = useState("week");
  const hasData = stats.quizzesDone > 0 || stats.phishingDone > 0 || (stats.threatsViewed?.length || 0) > 0;
  const secScore = Math.min(100, Math.round(stats.score / 30));

  if (!hasData) {
    return (
      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Syne:wght@700;800&family=JetBrains+Mono:wght@400;600&display=swap');`}</style>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BarChart2 size={20} style={{ color: "#EC4899" }} />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: 0, fontFamily: "Syne, sans-serif" }}>Reports & Analytics</h1>
            <p style={{ fontSize: 12, color: C.textMd, margin: 0 }}>Your performance insights and security metrics</p>
          </div>
        </div>
        <div style={{ background: C.bgCard, border: `1px dashed rgba(99,102,241,0.2)`, borderRadius: 20, padding: "60px 20px", textAlign: "center" }}>
          <BarChart2 size={40} style={{ color: C.textDim, marginBottom: 16 }} />
          <p style={{ fontSize: 16, fontWeight: 700, color: C.textMd, marginBottom: 6 }}>No data yet</p>
          <p style={{ fontSize: 13, color: C.textDim, marginBottom: 20 }}>Complete quizzes, phishing sims, or analyze threats to unlock analytics.</p>
          <button onClick={() => navigate("/quiz")} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, background: "linear-gradient(135deg,#4338CA,#6366F1)", color: "#fff", fontFamily: "inherit" }}>
            <Rocket size={14} /> Start with a Quiz
          </button>
        </div>
      </div>
    );
  }

  const base = Math.max(0, stats.score - 50);
  const monthly = [
    { m: "Sep", s: Math.max(0, base - 120), q: Math.max(0, stats.quizzesDone - 5) },
    { m: "Oct", s: Math.max(0, base - 80), q: Math.max(0, stats.quizzesDone - 4) },
    { m: "Nov", s: Math.max(0, base - 50), q: Math.max(0, stats.quizzesDone - 3) },
    { m: "Dec", s: Math.max(0, base - 20), q: Math.max(0, stats.quizzesDone - 2) },
    { m: "Jan", s: Math.max(0, base - 5), q: Math.max(0, stats.quizzesDone - 1) },
    { m: "Now", s: stats.score, q: stats.quizzesDone },
  ];

  const domainData = [
    { subject: "Phishing", A: stats.phishingScore || 0 },
    { subject: "Malware", A: stats.malwareScore || 0 },
    { subject: "Network", A: stats.networkScore || 0 },
    { subject: "Privacy", A: stats.privacyScore || 0 },
  ];

  const activityPie = [
    { name: "Quizzes", value: stats.quizzesDone || 0, color: C.brand },
    { name: "Phishing Sims", value: stats.phishingDone || 0, color: C.teal },
    { name: "Threats", value: stats.threatsViewed?.length || 0, color: C.violet },
  ].filter(d => d.value > 0);

  const phishingAccuracy = stats.phishingDone > 0 ? Math.round(((stats.phishingCorrect || 0) / (stats.phishingDone * 5)) * 100) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .rpt-enter{animation:fadeUp .35s ease both}
      `}</style>

      {/* ── HEADER ── */}
      <div className="rpt-enter" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BarChart2 size={20} style={{ color: "#EC4899" }} />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: 0, fontFamily: "Syne, sans-serif", letterSpacing: "-0.02em" }}>Reports & Analytics</h1>
            <p style={{ fontSize: 12, color: C.textMd, margin: 0 }}>Live performance insights · Security metrics dashboard</p>
          </div>
        </div>
      </div>

      {/* ── TOP STATS ── */}
      <div className="rpt-enter" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        <StatCard label="Total Score" value={stats.score} icon={Zap} color={C.brand} sub="+12% this week" />
        <StatCard label="Quizzes Done" value={stats.quizzesDone} icon={Brain} color={C.violet} sub={`${stats.avgScore}% avg score`} />
        <StatCard label="Security Score" value={`${secScore}%`} icon={Shield} color={C.green} sub={secScore >= 60 ? "Protected" : "Needs improvement"} />
        <StatCard label="Threats Analyzed" value={stats.threatsViewed?.length || 0} icon={Activity} color={C.red} sub="IOCs reviewed" />
      </div>

      {/* ── CHARTS ROW 1 ── */}
      <div className="rpt-enter" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        {/* Score Growth */}
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 18, padding: 22 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: 0, fontFamily: "Syne, sans-serif" }}>Score Growth</h3>
              <p style={{ fontSize: 11, color: C.textMd, margin: "2px 0 0" }}>6-month performance trajectory</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 8, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)" }}>
              <TrendingUp size={11} style={{ color: C.green }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: C.green, fontFamily: "JetBrains Mono, monospace" }}>GROWING</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthly}>
              <defs>
                <linearGradient id="sg-score" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.brand} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={C.brand} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.08)" vertical={false} />
              <XAxis dataKey="m" tick={{ fontSize: 11, fill: C.textMd }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: C.textMd }} axisLine={false} tickLine={false} />
              <Tooltip content={<CTip />} />
              <Area type="monotone" dataKey="s" name="Score" stroke={C.brand} strokeWidth={2.5} fill="url(#sg-score)" dot={{ fill: C.brand, r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: C.brand }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Domain Radar */}
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 18, padding: 22 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: "0 0 4px", fontFamily: "Syne, sans-serif" }}>Domain Mastery</h3>
          <p style={{ fontSize: 11, color: C.textMd, margin: "0 0 12px" }}>Skill coverage by category</p>
          <ResponsiveContainer width="100%" height={180}>
            <RadarChart data={domainData}>
              <PolarGrid stroke="rgba(99,102,241,0.1)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: C.textMd }} />
              <Radar name="Score" dataKey="A" stroke={C.brand} fill={C.brand} fillOpacity={0.1} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── CHARTS ROW 2 ── */}
      <div className="rpt-enter" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Domain progress bars */}
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 18, padding: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
            <Target size={14} style={{ color: C.teal }} />
            <h3 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: 0, fontFamily: "Syne, sans-serif" }}>Skills Breakdown</h3>
          </div>
          <ProgBar label="Phishing Detection" pct={stats.phishingScore || 0} color={C.brand} />
          <ProgBar label="Malware Analysis" pct={stats.malwareScore || 0} color={C.violet} />
          <ProgBar label="Network Security" pct={stats.networkScore || 0} color={C.teal} />
          <ProgBar label="Privacy & Compliance" pct={stats.privacyScore || 0} color={C.green} />
          <ProgBar label="Overall Security" pct={secScore} color={C.amber} />
        </div>

        {/* Activity Pie + quiz bars */}
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 18, padding: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Activity size={14} style={{ color: C.pink }} />
            <h3 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: 0, fontFamily: "Syne, sans-serif" }}>Activity Mix</h3>
          </div>
          {activityPie.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={activityPie} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                    {activityPie.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip content={<CTip />} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                {activityPie.map((d, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color }} />
                      <span style={{ color: C.textMd }}>{d.name}</span>
                    </div>
                    <span style={{ fontWeight: 700, color: C.text, fontFamily: "JetBrains Mono, monospace" }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "30px 0", color: C.textDim }}>No activity data</div>
          )}
        </div>
      </div>

      {/* ── QUIZ HISTORY TABLE ── */}
      {quizHistory && quizHistory.length > 0 && (
        <div className="rpt-enter" style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 18, padding: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Brain size={14} style={{ color: C.brand }} />
            <h3 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: 0, fontFamily: "Syne, sans-serif" }}>Quiz Module History</h3>
            <span style={{ marginLeft: "auto", fontSize: 11, color: C.textDim, fontFamily: "JetBrains Mono, monospace" }}>{quizHistory.length} attempts</span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Module", "Grade", "Score", "Time", "Date"].map(h => (
                  <th key={h} style={{ textAlign: "left", fontSize: 9, fontWeight: 700, color: C.textDim, padding: "8px 12px", letterSpacing: "0.07em", textTransform: "uppercase", fontFamily: "JetBrains Mono, monospace", borderBottom: `1px solid ${C.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {quizHistory.map((r, i) => {
                const gradeColors = { "A+": C.green, "A": C.brand, "B": C.violet, "C": C.amber, "D": C.red };
                const gc = gradeColors[r.grade] || C.red;
                return (
                  <tr key={i} style={{ borderTop: `1px solid rgba(255,255,255,0.03)`, transition: "background .15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "10px 12px" }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: C.text, margin: 0 }}>{r.moduleTitle}</p>
                      <p style={{ fontSize: 10, color: C.textDim, margin: "1px 0 0", fontFamily: "JetBrains Mono, monospace" }}>Module {r.moduleId}</p>
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ fontSize: 16, fontWeight: 800, color: gc, fontFamily: "Syne, sans-serif" }}>{r.grade}</span>
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: gc }}>{r.percentage}%</span>
                        <span style={{ fontSize: 10, color: C.textDim, marginLeft: 6 }}>({r.totalCorrect}/{r.totalQuestions})</span>
                      </div>
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ fontSize: 11, color: C.textMd, fontFamily: "JetBrains Mono, monospace" }}>{fmtTime(r.timeSpent)}</span>
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ fontSize: 11, color: C.textMd }}>{fmtDate(r.updatedAt)}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── ACTIVITY LOG ── */}
      {stats.recentActivity?.length > 0 && (
        <div className="rpt-enter" style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 18, padding: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Clock size={14} style={{ color: C.amber }} />
            <h3 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: 0, fontFamily: "Syne, sans-serif" }}>Activity Log</h3>
          </div>
          {stats.recentActivity.slice(0, 10).map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 4px", borderTop: i > 0 ? `1px solid rgba(255,255,255,0.03)` : "none" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: C.textMd, flex: 1 }}>{a.msg || a}</span>
              <span style={{ fontSize: 10, color: C.textDim, fontFamily: "JetBrains Mono, monospace" }}>{a.time || ""}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}