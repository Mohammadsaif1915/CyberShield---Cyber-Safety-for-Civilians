import { useNavigate } from "react-router-dom";
import { ArrowLeft, Gamepad2 } from "lucide-react";

export default function GamePage() {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#090912" }}>
      {/* Back bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "10px 20px", flexShrink: 0,
        background: "rgba(9,9,18,0.97)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
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
          <Gamepad2 size={16} style={{ color: "#0D9488" }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0", letterSpacing: "-0.01em" }}>
            Cyber Defense Game
          </span>
        </div>
      </div>

      {/* Game iframe — served from /public/game-app/ */}
      <iframe
        src="/game-app/index.html"
        title="Cyber Defense Game"
        style={{
          flex: 1,
          border: "none",
          width: "100%",
          height: "100%",
          display: "block",
        }}
        allow="autoplay"
      />
    </div>
  );
}
