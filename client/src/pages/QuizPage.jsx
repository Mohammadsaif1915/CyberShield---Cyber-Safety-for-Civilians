import { useNavigate } from "react-router-dom";
import { ArrowLeft, Brain, Award, Clock, CheckCircle } from "lucide-react";
import QuizApp from "./Quiz/App";
import "./Quiz/App.css";
import "./Quiz/index.css";
import { useState, useEffect } from "react";

export default function QuizPage() {
  const navigate = useNavigate();
  const [attemptedModules, setAttemptedModules] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // ── Page load hote hi user ka quiz history fetch karo ──
  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');
      if (!token) { setLoadingHistory(false); return; }

      try {
        const res = await fetch('http://localhost:5000/api/quiz/results', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setAttemptedModules(data.results);
      } catch (err) {
        console.error('History fetch error:', err);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();
  }, []);

  const getGradeColor = (grade) => ({
    'A+': '#00ff88', 'A': '#00ddff', 'B': '#0099ff',
    'C': '#ffd700',  'D': '#ff6b6b',
  }[grade] || '#94a3b8');

  const formatTime = (s) => `${Math.floor(s / 60)}m ${s % 60}s`;

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#0a0a1a" }}>

      {/* ── Top Navigation Bar ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "10px 20px", flexShrink: 0,
        background: "rgba(10,10,26,0.95)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)", zIndex: 100,
      }}>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "7px 14px", borderRadius: 9,
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#e2e8f0", fontSize: 13, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit",
            transition: "background 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.13)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <Brain size={16} style={{ color: "#7C3AED" }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>
            CyberShield Quiz
          </span>
        </div>

        {/* History button — sirf tab dikhao jab koi attempt ho */}
        {!loadingHistory && attemptedModules.length > 0 && (
          <button
            onClick={() => setShowHistory(!showHistory)}
            style={{
              marginLeft: 'auto',
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 9,
              background: showHistory ? "rgba(124,58,237,0.25)" : "rgba(124,58,237,0.08)",
              border: "1px solid rgba(124,58,237,0.35)",
              color: "#a78bfa", fontSize: 13, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(124,58,237,0.2)"}
            onMouseLeave={e => e.currentTarget.style.background = showHistory ? "rgba(124,58,237,0.25)" : "rgba(124,58,237,0.08)"}
          >
            <Award size={14} />
            Meri History ({attemptedModules.length})
          </button>
        )}
      </div>

      {/* ── History Panel ── */}
      {showHistory && (
        <div style={{
          padding: "16px 20px 14px",
          background: "rgba(124,58,237,0.04)",
          borderBottom: "1px solid rgba(124,58,237,0.12)",
          maxHeight: 260, overflowY: 'auto',
        }}>
          <p style={{ color: "#a78bfa", fontSize: 13, fontWeight: 700, margin: "0 0 12px" }}>
            📊 Attempted Modules
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {attemptedModules.map((r) => (
              <div key={r.moduleId} style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 10, padding: "12px 16px",
                flex: "1 1 220px", maxWidth: 300,
              }}>
                <div style={{ fontSize: 11, color: "#64748b", marginBottom: 3 }}>
                  Module {r.moduleId}
                </div>
                <div style={{
                  fontSize: 13, fontWeight: 600, color: "#e2e8f0",
                  marginBottom: 10, lineHeight: 1.4,
                }}>
                  {r.moduleTitle}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {/* Grade */}
                  <span style={{
                    fontSize: 22, fontWeight: 900,
                    color: getGradeColor(r.grade),
                    textShadow: `0 0 12px ${getGradeColor(r.grade)}55`,
                  }}>
                    {r.grade}
                  </span>
                  <div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 2, display: "flex", alignItems: "center", gap: 4 }}>
                      <CheckCircle size={10} style={{ color: '#00ff88' }} />
                      {r.percentage}% · {r.totalCorrect}/{r.totalQuestions} correct
                    </div>
                    <div style={{ fontSize: 11, color: "#64748b", display: "flex", gap: 8 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                        <Clock size={9} /> {formatTime(r.timeSpent)}
                      </span>
                      <span>{formatDate(r.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Quiz App (main content) ── */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <QuizApp />
      </div>
    </div>
  );
}