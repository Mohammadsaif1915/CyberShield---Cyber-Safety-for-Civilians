import { useNavigate } from "react-router-dom";
import { ArrowLeft, Brain } from "lucide-react";
import QuizApp from "./Quiz/App";
import "./Quiz/App.css";
import "./Quiz/index.css";

export default function QuizPage() {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#0a0a1a" }}>
      {/* Back bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "10px 20px", flexShrink: 0,
        background: "rgba(10,10,26,0.95)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
        zIndex: 100,
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
            transition: "all .15s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.13)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <Brain size={16} style={{ color: "#7C3AED" }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0", letterSpacing: "-0.01em" }}>
            CyberShield Quiz
          </span>
        </div>
      </div>

      {/* Quiz App */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <QuizApp />
      </div>
    </div>
  );
}
