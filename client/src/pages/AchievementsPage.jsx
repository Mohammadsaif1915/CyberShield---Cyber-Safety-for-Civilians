import { useState, useEffect } from "react";
import { Award, Star, Zap, Trophy, Lock, Unlock } from "lucide-react";

const T = {
  bg: "#F0F2F8", surface: "#FFFFFF", card: "#FFFFFF", border: "rgba(99,102,241,0.14)",
  brand: "#4F46E5", brandDark: "#3730A3", brandGlow: "rgba(79,70,229,0.18)",
  teal: "#0D9488", tealDim: "rgba(13,148,136,0.10)",
  violet: "#7C3AED", amber: "#D97706", amberDim: "rgba(217,119,6,0.10)",
  pink: "#DB2777", pinkDim: "rgba(219,39,119,0.10)",
  text: "#111827", textMd: "#4B5563", textDim: "#9CA3AF",
  sh: "0 1px 4px rgba(0,0,0,0.07)", shMd: "0 4px 20px rgba(0,0,0,0.10)",
};

const API = {
  headers: () => ({ "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` }),
  get: (url) => fetch(url, { headers: API.headers() }).then(r => r.ok ? r.json() : Promise.reject(r)),
};

const RARITY_CONFIG = {
  common: { color: "#6B7280", emoji: "⚪" },
  uncommon: { color: "#10B981", emoji: "🟢" },
  rare: { color: "#3B82F6", emoji: "🔵" },
  legendary: { color: "#F59E0B", emoji: "✨" },
};

function AchievementCard({ achievement, unlocked = false }) {
  const rarity = RARITY_CONFIG[achievement.rarity] || RARITY_CONFIG.common;
  
  return (
    <div
      style={{
        background: T.surface,
        border: `2px solid ${unlocked ? rarity.color : T.border}`,
        borderRadius: 14,
        padding: "16px",
        textAlign: "center",
        opacity: unlocked ? 1 : 0.5,
        transition: "all 0.3s",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
      }}
      title={achievement.description}
    >
      {!unlocked && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Lock size={24} style={{ color: "#fff", opacity: 0.7 }} />
        </div>
      )}

      <div style={{ fontSize: 40, marginBottom: 8 }}>{achievement.icon}</div>
      
      <h4 style={{ fontSize: 12, fontWeight: 700, color: T.text, marginBottom: 4 }}>{achievement.title}</h4>
      
      <p style={{ fontSize: 10, color: T.textMd, marginBottom: 8, lineHeight: 1.4 }}>{achievement.description}</p>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
        {[...Array(3)].map((_, i) => (
          <Star
            key={i}
            size={10}
            style={{
              fill: i < (achievement.difficulty || 1) ? rarity.color : T.border,
              color: i < (achievement.difficulty || 1) ? rarity.color : T.border,
            }}
          />
        ))}
        <span style={{ fontSize: 9, color: T.textMd, marginLeft: 4 }}>{rarity.emoji} {achievement.rarity}</span>
      </div>

      {unlocked && achievement.unlockedAt && (
        <p style={{ fontSize: 9, color: T.textDim, marginTop: 8 }}>
          Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

function CategorySection({ category, achievements, unlockedIds }) {
  const icons = {
    quiz: "🧠",
    course: "📚",
    game: "🎮",
    tool: "🛠️",
    activity: "⭐",
  };

  const titles = {
    quiz: "Quiz Master",
    course: "Course Champion",
    game: "Game Guru",
    tool: "Tool Expert",
    activity: "Active Learning",
  };

  const unlockedCount = achievements.filter(a => unlockedIds.includes(a._id)).length;
  const totalCount = achievements.length;
  const progress = (unlockedCount / totalCount) * 100;

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 24 }}>{icons[category]}</span>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: T.text, fontFamily: "'Syne',sans-serif" }}>{titles[category]}</h3>
          <span style={{ fontSize: 12, fontWeight: 600, color: T.brand }}>{unlockedCount}/{totalCount}</span>
        </div>
        <div style={{ width: "100%", height: 4, background: T.border, borderRadius: 2, overflow: "hidden" }}>
          <div style={{ width: `${progress}%`, height: "100%", background: T.brand, borderRadius: 2, transition: "width 0.5s" }} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }}>
        {achievements.map((achievement) => (
          <AchievementCard
            key={achievement._id}
            achievement={achievement}
            unlocked={unlockedIds.includes(achievement._id)}
          />
        ))}
      </div>
    </div>
  );
}

export default function AchievementsPage({ user }) {
  const [achievements, setAchievements] = useState([]);
  const [unlockedIds, setUnlockedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const res = await API.get("/api/features/achievements");
        if (res?.success) {
          let validData = [];
          if (Array.isArray(res.achievements)) validData = res.achievements;
          else if (Array.isArray(res.data)) validData = res.data;
          else if (Array.isArray(res)) validData = res;
          
          setAchievements(validData);
          setUnlockedIds(validData.filter(a => !!a.unlockedAt).map(a => a._id));
        } else {
          throw new Error(res?.message || "Failed to fetch achievements");
        }
      } catch (err) {
        console.error("Achievements Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  const categories = ["quiz", "course", "game", "tool", "activity"];
  const totalUnlocked = unlockedIds.length;
  const totalAchievements = achievements.length;

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: T.text, marginBottom: 6, fontFamily: "'Syne',sans-serif" }}>Achievements & Badges</h1>
        <p style={{ fontSize: 14, color: T.textMd }}>Unlock badges as you progress through your cybersecurity learning journey</p>
      </div>

      {/* Overall Stats */}
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "24px", marginBottom: 32, boxShadow: T.sh }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: T.brand }}>{totalUnlocked}</div>
            <p style={{ fontSize: 12, color: T.textMd, marginTop: 4 }}>Badges Unlocked</p>
          </div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: T.teal }}>{totalAchievements - totalUnlocked}</div>
            <p style={{ fontSize: 12, color: T.textMd, marginTop: 4 }}>Still Locked</p>
          </div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: T.violet }}>{Math.round((totalUnlocked / Math.max(totalAchievements, 1)) * 100)}%</div>
            <p style={{ fontSize: 12, color: T.textMd, marginTop: 4 }}>Completion</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 24px" }}>
          <div style={{ fontSize: 14, color: T.textDim }}>Loading your achievements...</div>
        </div>
      ) : error ? (
        <div style={{ background: "rgba(220,38,38,0.08)", border: "1px solid #DC2626", color: "#DC2626", padding: "16px 20px", borderRadius: 12, fontSize: 13 }}>
          ❌ {error}
        </div>
      ) : (
        <>
          {categories.map((category) => {
            const categoryAchievements = achievements.filter(a => a.category === category);
            if (categoryAchievements.length === 0) return null;
            return (
              <CategorySection
                key={category}
                category={category}
                achievements={categoryAchievements}
                unlockedIds={unlockedIds}
              />
            );
          })}

          {achievements.length === 0 && (
            <div style={{ background: T.bg, border: `1px dashed ${T.border}`, borderRadius: 14, padding: "40px 24px", textAlign: "center" }}>
              <Trophy size={40} style={{ color: T.textDim, margin: "0 auto 12px" }} />
              <p style={{ fontSize: 14, fontWeight: 600, color: T.text }}>No achievements yet</p>
              <p style={{ fontSize: 12, color: T.textMd, marginTop: 4 }}>Complete courses, quizzes, and games to earn badges!</p>
            </div>
          )}

          {/* Rarity Guide */}
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "24px", marginTop: 32, boxShadow: T.sh }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 16, fontFamily: "'Syne',sans-serif" }}>Badge Rarity Levels</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
              {Object.entries(RARITY_CONFIG).map(([rarity, config]) => (
                <div key={rarity} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: config.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                    {config.emoji}
                  </div>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: T.text, textTransform: "capitalize" }}>{rarity}</p>
                    <p style={{ fontSize: 10, color: T.textMd }}>
                      {rarity === "common" && "Easy to unlock"}
                      {rarity === "uncommon" && "Moderate difficulty"}
                      {rarity === "rare" && "Hard to obtain"}
                      {rarity === "legendary" && "Extremely rare"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
