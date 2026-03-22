import { useState, useCallback, useEffect } from "react";
import { Trophy, RefreshCw, TrendingUp, Flame, Zap, Star, Crown, Medal, Users } from "lucide-react";

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
  text: "#F1F5F9",
  textMd: "#94A3B8",
  textDim: "#475569",
};

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

const dName = u => u?.fullName || u?.name || u?.username || (u?.email ? u.email.split("@")[0] : "User");
const initials = n => (n || "??").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

function Avatar({ name, size = 36, fontSize = 13 }) {
  const grads = [
    "linear-gradient(135deg,#4338CA,#6366F1)",
    "linear-gradient(135deg,#6D28D9,#8B5CF6)",
    "linear-gradient(135deg,#0369A1,#0EA5E9)",
    "linear-gradient(135deg,#047857,#10B981)",
    "linear-gradient(135deg,#B91C1C,#EF4444)",
    "linear-gradient(135deg,#BE185D,#EC4899)",
  ];
  const idx = Math.abs((name || "U").charCodeAt(0) + ((name || "U").charCodeAt(1) || 0)) % 6;
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: grads[idx], display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#fff", fontWeight: 700, fontSize, letterSpacing: "0.02em" }}>
      {initials(name)}
    </div>
  );
}

function useLeaderboard(stats, user) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const build = useCallback(() => {
    const me = { _id: user?._id || "me", name: dName(user), score: stats?.score || 0, level: stats?.level || 1, streak: stats?.streak || 0, dept: stats?.dept || "InfoSec", isMe: true };
    const peers = [
      { _id: "u1", name: "Priya Sharma", dept: "Network Sec", score: 2840, level: 6, streak: 14 },
      { _id: "u2", name: "Arjun Mehta", dept: "SOC Team", score: 2650, level: 5, streak: 9 },
      { _id: "u3", name: "Sneha Kulkarni", dept: "AppSec", score: 2210, level: 5, streak: 7 },
      { _id: "u4", name: "Ravi Gupta", dept: "Cloud Sec", score: 1980, level: 4, streak: 5 },
      { _id: "u5", name: "Anjali Patil", dept: "Compliance", score: 1740, level: 4, streak: 3 },
      { _id: "u6", name: "Vikram Singh", dept: "Red Team", score: 1580, level: 3, streak: 11 },
      { _id: "u7", name: "Pooja Nair", dept: "InfoSec", score: 1320, level: 3, streak: 2 },
    ];
    return [...peers, me].sort((a, b) => (b.score || 0) - (a.score || 0)).map((u, i) => ({ ...u, rank: i + 1 }));
  }, [stats?.score, stats?.level, stats?.streak, user]);

  const load = useCallback(() => {
    setLoading(true);
    apiFetch("/api/leaderboard")
      .then(d => { const a = d.leaderboard || d.data || d || []; setData(a.length > 0 ? a : build()); })
      .catch(() => setData(build()))
      .finally(() => setLoading(false));
  }, [build]);

  useEffect(() => { load(); }, [stats?.score]);
  return { data, loading, reload: load };
}

const RANK_MEDALS = {
  1: { icon: "🥇", glow: "rgba(251,191,36,0.3)", border: "rgba(251,191,36,0.4)", bg: "rgba(251,191,36,0.06)", label: "#FFD700" },
  2: { icon: "🥈", glow: "rgba(156,163,175,0.25)", border: "rgba(156,163,175,0.35)", bg: "rgba(156,163,175,0.05)", label: "#C0C0C0" },
  3: { icon: "🥉", glow: "rgba(180,119,75,0.25)", border: "rgba(180,119,75,0.3)", bg: "rgba(180,119,75,0.05)", label: "#CD7F32" },
};

export default function LeaderboardPage({ user, stats }) {
  const { data: lbData, loading, reload } = useLeaderboard(stats, user);
  const [hovered, setHovered] = useState(null);
  const top3 = lbData.slice(0, 3);
  const rest = lbData.slice(3);

  const myRank = lbData.find(u => u.isMe)?.rank;

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes riseUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
        @keyframes glowPulse{0%,100%{opacity:.6}50%{opacity:1}}
        @keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
        .lb-enter{animation:fadeUp .35s ease both}
        .podium-1{animation:riseUp .5s cubic-bezier(.16,1,.3,1) .1s both}
        .podium-2{animation:riseUp .5s cubic-bezier(.16,1,.3,1) .2s both}
        .podium-3{animation:riseUp .5s cubic-bezier(.16,1,.3,1) .3s both}
      `}</style>

      {/* ── HEADER ── */}
      <div className="lb-enter" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Trophy size={20} style={{ color: C.amber }} />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: 0, fontFamily: "Syne, sans-serif", letterSpacing: "-0.02em" }}>Leaderboard</h1>
            <p style={{ fontSize: 12, color: C.textMd, margin: 0 }}>Top cybersecurity defenders — live rankings</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {myRank && (
            <div style={{ padding: "7px 14px", borderRadius: 10, background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", gap: 7 }}>
              <Star size={12} style={{ color: C.brand }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: C.brand }}>Your rank: #{myRank}</span>
            </div>
          )}
          <button onClick={reload} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: `1px solid ${C.border}`, background: "transparent", color: C.textMd, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all .15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.brand + "50"; e.currentTarget.style.color = C.brand; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMd; }}>
            <RefreshCw size={13} className={loading ? "spin" : ""} /> Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{ height: 64, borderRadius: 14, background: "linear-gradient(90deg,#0C1120 0%,#1a2035 50%,#0C1120 100%)", backgroundSize: "400px 100%", animation: "shimmer 1.5s infinite" }} />
          ))}
        </div>
      ) : (
        <>
          {/* ── PODIUM ── */}
          {top3.length >= 2 && (
            <div className="lb-enter" style={{
              background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 20, padding: "32px 24px 0",
              marginBottom: 20, position: "relative", overflow: "hidden"
            }}>
              {/* Background glow */}
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 400, height: 200, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(245,158,11,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
              {/* Grid */}
              <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)", backgroundSize: "30px 30px", pointerEvents: "none" }} />

              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 16, position: "relative" }}>
                {/* 2nd place */}
                {top3[1] && (
                  <div className="podium-2" style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, maxWidth: 160 }}>
                    <div style={{ position: "relative", marginBottom: 10 }}>
                      <Avatar name={dName(top3[1])} size={52} fontSize={18} />
                      {top3[1].isMe && <div style={{ position: "absolute", top: -4, right: -4, width: 16, height: 16, borderRadius: "50%", background: C.brand, border: "2px solid #050810", fontSize: 8, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>★</div>}
                    </div>
                    <span style={{ fontSize: 24 }}>🥈</span>
                    <p style={{ fontSize: 13, fontWeight: 700, color: C.text, margin: "4px 0 2px" }}>{dName(top3[1]).split(" ")[0]}{top3[1].isMe ? " (You)" : ""}</p>
                    <p style={{ fontSize: 11, color: C.textDim, margin: "0 0 2px" }}>{top3[1].dept || "InfoSec"}</p>
                    <p style={{ fontSize: 15, fontWeight: 800, color: "#C0C0C0", margin: "0 0 12px", fontFamily: "Syne, sans-serif" }}>{(top3[1].score || 0).toLocaleString()}</p>
                    <div style={{ width: "100%", height: 80, background: "linear-gradient(180deg, rgba(156,163,175,0.15) 0%, rgba(156,163,175,0.06) 100%)", borderRadius: "12px 12px 0 0", border: "1px solid rgba(156,163,175,0.2)", borderBottom: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 28, fontWeight: 900, color: "rgba(192,192,192,0.3)", fontFamily: "Syne, sans-serif" }}>2</span>
                    </div>
                  </div>
                )}
                {/* 1st place */}
                {top3[0] && (
                  <div className="podium-1" style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, maxWidth: 180 }}>
                    <div style={{ padding: "4px 12px", background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.25)", borderRadius: 8, fontSize: 10, fontWeight: 700, color: "#FCD34D", marginBottom: 8, fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.08em" }}>
                      👑 CHAMPION
                    </div>
                    <div style={{ position: "relative", marginBottom: 10 }}>
                      <div style={{ position: "absolute", inset: -4, borderRadius: "50%", background: "linear-gradient(135deg,#F59E0B,#FCD34D)", animation: "glowPulse 2s infinite", opacity: 0.3, filter: "blur(6px)" }} />
                      <Avatar name={dName(top3[0])} size={64} fontSize={22} />
                      {top3[0].isMe && <div style={{ position: "absolute", top: -4, right: -4, width: 18, height: 18, borderRadius: "50%", background: C.brand, border: "2px solid #050810", fontSize: 9, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>★</div>}
                    </div>
                    <span style={{ fontSize: 28 }}>🥇</span>
                    <p style={{ fontSize: 14, fontWeight: 800, color: C.text, margin: "4px 0 2px" }}>{dName(top3[0]).split(" ")[0]}{top3[0].isMe ? " (You)" : ""}</p>
                    <p style={{ fontSize: 11, color: C.textDim, margin: "0 0 2px" }}>{top3[0].dept || "InfoSec"}</p>
                    <p style={{ fontSize: 18, fontWeight: 800, color: "#FCD34D", margin: "0 0 12px", fontFamily: "Syne, sans-serif" }}>{(top3[0].score || 0).toLocaleString()}</p>
                    <div style={{ width: "100%", height: 110, background: "linear-gradient(180deg, rgba(251,191,36,0.12) 0%, rgba(251,191,36,0.04) 100%)", borderRadius: "12px 12px 0 0", border: "1px solid rgba(251,191,36,0.25)", borderBottom: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 36, fontWeight: 900, color: "rgba(252,211,77,0.2)", fontFamily: "Syne, sans-serif" }}>1</span>
                    </div>
                  </div>
                )}
                {/* 3rd place */}
                {top3[2] && (
                  <div className="podium-3" style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, maxWidth: 160 }}>
                    <div style={{ position: "relative", marginBottom: 10 }}>
                      <Avatar name={dName(top3[2])} size={48} fontSize={16} />
                      {top3[2].isMe && <div style={{ position: "absolute", top: -4, right: -4, width: 15, height: 15, borderRadius: "50%", background: C.brand, border: "2px solid #050810", fontSize: 8, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>★</div>}
                    </div>
                    <span style={{ fontSize: 22 }}>🥉</span>
                    <p style={{ fontSize: 12, fontWeight: 700, color: C.text, margin: "4px 0 2px" }}>{dName(top3[2]).split(" ")[0]}{top3[2].isMe ? " (You)" : ""}</p>
                    <p style={{ fontSize: 11, color: C.textDim, margin: "0 0 2px" }}>{top3[2].dept || "InfoSec"}</p>
                    <p style={{ fontSize: 13, fontWeight: 800, color: "#CD7F32", margin: "0 0 12px", fontFamily: "Syne, sans-serif" }}>{(top3[2].score || 0).toLocaleString()}</p>
                    <div style={{ width: "100%", height: 60, background: "linear-gradient(180deg, rgba(180,119,75,0.12) 0%, rgba(180,119,75,0.04) 100%)", borderRadius: "12px 12px 0 0", border: "1px solid rgba(180,119,75,0.2)", borderBottom: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 22, fontWeight: 900, color: "rgba(205,127,50,0.3)", fontFamily: "Syne, sans-serif" }}>3</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── FULL RANKINGS TABLE ── */}
          <div className="lb-enter" style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 20, overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 8 }}>
              <Users size={14} style={{ color: C.textMd }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Full Rankings</span>
              <span style={{ marginLeft: "auto", fontSize: 11, color: C.textDim, fontFamily: "JetBrains Mono, monospace" }}>{lbData.length} participants</span>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.02)" }}>
                  {["Rank", "Defender", "Score", "Level", "Streak", "Dept"].map(h => (
                    <th key={h} style={{ textAlign: "left", fontSize: 9, fontWeight: 700, color: C.textDim, padding: "10px 16px", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "JetBrains Mono, monospace", borderBottom: `1px solid ${C.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lbData.map(u => {
                  const medal = RANK_MEDALS[u.rank];
                  const isHov = hovered === u._id;
                  return (
                    <tr key={u._id || u.name}
                      onMouseEnter={() => setHovered(u._id)}
                      onMouseLeave={() => setHovered(null)}
                      style={{
                        borderTop: `1px solid rgba(255,255,255,0.03)`,
                        background: u.isMe ? "rgba(99,102,241,0.06)" : isHov ? "rgba(255,255,255,0.02)" : "transparent",
                        transition: "background .15s"
                      }}>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center",
                          background: medal ? medal.bg : "rgba(255,255,255,0.03)",
                          border: `1px solid ${medal ? medal.border : "rgba(255,255,255,0.06)"}`,
                          fontSize: medal ? 14 : 11, fontWeight: 700,
                          color: medal ? medal.label : C.textDim,
                          fontFamily: "JetBrains Mono, monospace"
                        }}>
                          {medal ? medal.icon : u.rank}
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                          <Avatar name={dName(u)} size={32} fontSize={11} />
                          <div>
                            <p style={{ fontSize: 12, fontWeight: 600, color: C.text, margin: 0 }}>
                              {dName(u)}
                              {u.isMe && <span style={{ fontSize: 9, color: C.brand, marginLeft: 6, fontWeight: 700, background: "rgba(99,102,241,0.12)", padding: "1px 6px", borderRadius: 4, border: "1px solid rgba(99,102,241,0.2)" }}>YOU</span>}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ fontSize: 14, fontWeight: 800, color: u.isMe ? C.brand : C.text, fontFamily: "Syne, sans-serif" }}>{(u.score || 0).toLocaleString()}</span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: C.violet, fontFamily: "JetBrains Mono, monospace", background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.15)", padding: "2px 7px", borderRadius: 5 }}>Lv.{u.level || 1}</span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: (u.streak || 0) >= 7 ? C.red : C.textMd, fontFamily: "JetBrains Mono, monospace" }}>
                          {(u.streak || 0) >= 3 ? "🔥" : ""}{u.streak || 0}d
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ fontSize: 11, color: C.textMd }}>{u.dept || "InfoSec"}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}