/**
 * 🎉 Achievement Celebration Component
 * Shows celebratory popups when badges are unlocked
 */

export const AchievementCelebration = ({ achievement, onClose }) => {
  if (!achievement) return null;

  const rarityColors = {
    common: { bg: '#94a3b8', text: '#1e293b' },
    uncommon: { bg: '#10b981', text: '#fff' },
    rare: { bg: '#8b5cf6', text: '#fff' },
    legendary: { bg: '#f59e0b', text: '#1e293b' }
  };

  const colors = rarityColors[achievement.rarity] || rarityColors.common;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      animation: 'fadeIn 0.3s ease'
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-500px) rotate(360deg); opacity: 0; }
        }
        .achievement-modal {
          animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .achievement-title {
          animation: slideUp 0.6s ease 0.2s backwards;
        }
        .achievement-desc {
          animation: slideUp 0.6s ease 0.3s backwards;
        }
        .confetti-piece {
          animation: confetti 2s ease-out forwards;
        }
      `}</style>

      {/* Confetti particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            position: 'fixed',
            left: Math.random() * 100 + '%',
            top: '50%',
            width: '10px',
            height: '10px',
            background: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7'][i % 5],
            borderRadius: '50%',
            pointerEvents: 'none'
          }}
        />
      ))}

      {/* Main modal */}
      <div
        className="achievement-modal"
        style={{
          background: 'linear-gradient(135deg, #0d1a2e 0%, #1a2942 100%)',
          border: `2px solid ${colors.bg}`,
          borderRadius: '20px',
          padding: '40px',
          textAlign: 'center',
          maxWidth: '400px',
          position: 'relative',
          boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${colors.bg}66`
        }}
      >
        {/* Icon/Emoji */}
        <div style={{
          fontSize: '80px',
          marginBottom: '20px',
          display: 'block',
          animation: 'popIn 0.5s ease'
        }}>
          {achievement.icon || '🏆'}
        </div>

        {/* Rarity badge */}
        <div style={{
          display: 'inline-block',
          background: colors.bg,
          color: colors.text,
          padding: '6px 16px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '700',
          letterSpacing: '1px',
          marginBottom: '15px',
          textTransform: 'uppercase'
        }}>
          {achievement.rarity} {achievement.category === 'quiz' ? '🎯' : 
           achievement.category === 'course' ? '📚' : 
           achievement.category === 'game' ? '🎮' : '⭐'}
        </div>

        {/* Title */}
        <h2
          className="achievement-title"
          style={{
            fontSize: '28px',
            fontWeight: '800',
            margin: '15px 0',
            color: '#fff',
            fontFamily: "'Syne', sans-serif"
          }}
        >
          {achievement.badgeName}
        </h2>

        {/* Description */}
        <p
          className="achievement-desc"
          style={{
            fontSize: '14px',
            color: '#a0aec0',
            margin: '10px 0 30px',
            lineHeight: '1.6'
          }}
        >
          {achievement.badgeDescription}
        </p>

        {/* Confetti animation trigger text */}
        <div style={{
          fontSize: '18px',
          marginBottom: '25px',
          fontWeight: '600',
          color: colors.bg,
          animation: 'slideUp 0.6s ease 0.4s backwards'
        }}>
          🎉 Congratulations! 🎉
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            background: `linear-gradient(135deg, ${colors.bg}, ${colors.bg}dd)`,
            color: colors.text,
            border: 'none',
            padding: '12px 32px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = `0 10px 30px ${colors.bg}55`;
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = 'none';
          }}
        >
          Awesome! Keep Learning
        </button>
      </div>
    </div>
  );
};

/**
 * Achievement Toast Notification
 * Smaller notification that appears in corner
 */
export const AchievementToast = ({ achievement, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const rarityColors = {
    common: '#64748b',
    uncommon: '#10b981',
    rare: '#8b5cf6',
    legendary: '#f59e0b'
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: '#1a2942',
      border: `2px solid ${rarityColors[achievement.rarity]}`,
      borderRadius: '12px',
      padding: '16px 20px',
      maxWidth: '300px',
      zIndex: 9998,
      animation: 'slideUp 0.3s ease',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ fontSize: '28px' }}>{achievement.icon}</div>
        <div>
          <div style={{ fontSize: '12px', color: rarityColors[achievement.rarity], fontWeight: '700', textTransform: 'uppercase' }}>
            Achievement Unlocked
          </div>
          <div style={{ fontSize: '14px', color: '#fff', fontWeight: '600', marginTop: '2px' }}>
            {achievement.badgeName}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Achievement Badge Display Component
 */
export const AchievementBadge = ({ achievement, showRarity = true }) => {
  const rarityColors = {
    common: { bg: '#94a3b8', text: '#1e293b' },
    uncommon: { bg: '#10b981', text: '#fff' },
    rare: { bg: '#8b5cf6', text: '#fff' },
    legendary: { bg: '#f59e0b', text: '#1e293b' }
  };

  const colors = rarityColors[achievement.rarity] || rarityColors.common;

  return (
    <div
      title={achievement.badgeDescription}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        padding: '12px',
        background: 'rgba(255,255,255,0.05)',
        border: `1px solid ${colors.bg}44`,
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.borderColor = colors.bg;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.borderColor = colors.bg + '44';
      }}
    >
      <div style={{ fontSize: '32px' }}>{achievement.icon}</div>
      {showRarity && (
        <div style={{
          fontSize: '10px',
          color: colors.bg,
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {achievement.rarity}
        </div>
      )}
    </div>
  );
};

export default {
  AchievementCelebration,
  AchievementToast,
  AchievementBadge
};
