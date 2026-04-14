import React, { useState, useEffect } from 'react';
import { Trophy, Award, Zap, TrendingUp, Lock } from 'lucide-react';

const T = {
  bg: '#060c17',
  bgDim: '#0d1a2e',
  bgDimmer: '#0a0f1c',
  border: 'rgba(59, 130, 246, 0.25)',
  text: '#e2e8f0',
  textDim: '#94a3b8',
  textDimmer: '#64748b',
  primary: '#3b82f6',
  primaryDim: 'rgba(59, 130, 246, 0.1)',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  amber: '#fbbf24',
  amberDim: 'rgba(251, 191, 36, 0.1)',
};

/**
 * 🏆 Achievement Showcase Page
 */
const AchievementShowcase = ({ user }) => {
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [celebratingId, setCelebratingId] = useState(null);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch achievements
      const achRes = await fetch('/api/achievements', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const achData = await achRes.json();
      if (achData.success) {
        setAchievements(achData.achievements || []);
      }

      // Fetch stats
      const statsRes = await fetch('/api/achievements/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.stats);
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const rarityColors = {
    common: { bg: '#94a3b8', text: '#1e293b', light: 'rgba(148, 163, 184, 0.1)' },
    uncommon: { bg: '#10b981', text: '#fff', light: 'rgba(16, 185, 129, 0.1)' },
    rare: { bg: '#8b5cf6', text: '#fff', light: 'rgba(139, 92, 246, 0.1)' },
    legendary: { bg: '#f59e0b', text: '#1e293b', light: 'rgba(245, 158, 11, 0.1)' }
  };

  const categoryIcons = {
    quiz: '🎯',
    course: '📚',
    game: '🎮',
    activity: '⭐',
    all: '🏆'
  };

  const filtered = selectedCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category === selectedCategory);

  const rarityStats = stats ? [
    { rarity: 'legendary', count: stats.byRarity.legendary, icon: '👑', color: rarityColors.legendary.bg },
    { rarity: 'rare', count: stats.byRarity.rare, icon: '💜', color: rarityColors.rare.bg },
    { rarity: 'uncommon', count: stats.byRarity.uncommon, icon: '💚', color: rarityColors.uncommon.bg },
    { rarity: 'common', count: stats.byRarity.common, icon: '🤍', color: rarityColors.common.bg }
  ] : [];

  return (
    <div style={{ padding: '0' }}>
      {/* HERO SECTION */}
      <div style={{
        background: 'linear-gradient(135deg, #1d4ed8 0%, #0ea5e9 100%)',
        padding: '40px 24px',
        borderRadius: '16px',
        textAlign: 'center',
        marginBottom: '32px'
      }}>
        <Trophy size={48} style={{ color: '#fff', marginBottom: '16px' }} />
        <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 8px', color: '#fff' }}>
          Achievement Showcase
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '16px' }}>
          {stats?.totalUnlocked || 0} of {stats?.totalAvailable || 0} badges unlocked ({stats?.completionPercent || 0}%)
        </p>
      </div>

      {/* PROGRESS BAR */}
      {stats && (
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            height: '24px',
            background: T.bgDim,
            border: `1px solid ${T.border}`,
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              background: 'linear-gradient(90deg, #3b82f6, #0ea5e9)',
              width: `${stats.completionPercent}%`,
              transition: 'width 0.3s ease'
            }} />
          </div>
          <p style={{ fontSize: '12px', color: T.textDim, margin: '8px 0 0', textAlign: 'center' }}>
            {stats.completionPercent}% Complete
          </p>
        </div>
      )}

      {/* RARITY BREAKDOWN */}
      {rarityStats.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '12px',
          marginBottom: '32px'
        }}>
          {rarityStats.map(item => (
            <div key={item.rarity} style={{
              padding: '16px',
              background: T.bgDim,
              border: `1px solid ${item.color}44`,
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{item.icon}</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: item.color, marginBottom: '4px' }}>
                {item.count}
              </div>
              <div style={{ fontSize: '11px', color: T.textDim, textTransform: 'uppercase', fontWeight: '600' }}>
                {item.rarity}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CATEGORY FILTER */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '32px',
        overflowX: 'auto',
        paddingBottom: '8px'
      }}>
        {['all', 'quiz', 'course', 'game', 'activity'].map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: selectedCategory === category ? '2px solid' + T.primary : `1px solid ${T.border}`,
              background: selectedCategory === category ? T.primaryDim : 'transparent',
              color: selectedCategory === category ? T.primary : T.textDim,
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              textTransform: 'capitalize'
            }}
            onMouseEnter={(e) => {
              if (selectedCategory !== category) {
                e.target.style.borderColor = T.primary;
                e.target.style.color = T.primary;
              }
            }}
            onMouseLeave={(e) => {
              if (selectedCategory !== category) {
                e.target.style.borderColor = T.border;
                e.target.style.color = T.textDim;
              }
            }}
          >
            {categoryIcons[category]} {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* ACHIEVEMENTS GRID */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '64px 24px', color: T.textDim }}>
          <Zap size={32} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <p>Loading achievements...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 24px', color: T.textDim }}>
          <Lock size={32} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <p>No achievements in this category yet. Keep learning!</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '16px'
        }}>
          {filtered.map((achievement, idx) => {
            const colors = rarityColors[achievement.rarity];
            return (
              <div
                key={achievement._id || idx}
                style={{
                  padding: '20px 16px',
                  background: colors.light,
                  border: `2px solid ${colors.bg}`,
                  borderRadius: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = colors.bg;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Icon */}
                <div style={{
                  fontSize: '48px',
                  lineHeight: 1,
                  marginBottom: '12px',
                  display: 'block'
                }}>
                  {achievement.icon}
                </div>

                {/* Rarity Badge */}
                <div style={{
                  display: 'inline-block',
                  background: colors.bg,
                  color: colors.text,
                  padding: '4px 12px',
                  borderRadius: '6px',
                  fontSize: '10px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '8px'
                }}>
                  {achievement.rarity}
                </div>

                {/* Name */}
                <h3 style={{
                  fontSize: '13px',
                  fontWeight: '700',
                  margin: '8px 0',
                  color: T.text,
                  lineHeight: '1.3'
                }}>
                  {achievement.badgeName}
                </h3>

                {/* Description */}
                <p style={{
                  fontSize: '11px',
                  color: T.textDim,
                  margin: '6px 0',
                  lineHeight: '1.4'
                }}>
                  {achievement.badgeDescription}
                </p>

                {/* Unlocked Date */}
                {achievement.unlockedAt && (
                  <p style={{
                    fontSize: '9px',
                    color: T.textDimmer,
                    margin: '8px 0 0',
                    borderTop: `1px solid ${colors.bg}44`,
                    paddingTop: '8px'
                  }}>
                    Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* MOTIVATIONAL SECTION */}
      <div style={{
        marginTop: '48px',
        padding: '24px',
        background: T.bgDim,
        border: `1px solid ${T.border}`,
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <TrendingUp size={32} style={{ color: T.success, marginBottom: '12px' }} />
        <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 8px', color: T.text }}>
          Keep Going! 🚀
        </h3>
        <p style={{ fontSize: '13px', color: T.textDim, margin: 0 }}>
          {stats && stats.totalUnlocked < stats.totalAvailable
            ? `Unlock ${stats.totalAvailable - stats.totalUnlocked} more badges by completing courses, quizzes, games, and reporting threats!`
            : 'You have unlocked all available achievements! You are a true cyber security master! 🏆'}
        </p>
      </div>
    </div>
  );
};

export default AchievementShowcase;
