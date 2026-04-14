// ─────────────────────────────────────────────────────────────────────────────
// FILE 1:  src/hooks/useDashboardUser.js
// Drop this file into your project and import it in Dashboard.jsx
// It replaces the inline user-loading logic in Dashboard.jsx
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';

const API = (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') : '';   // ← dynamic API base url

// XP / level helper (mirrors the one in Dashboard.jsx)
const computeLevel = (score = 0) => {
  const xp       = score || 0;
  const level    = Math.floor(xp / 500) + 1;
  return { level, xp, xpInLevel: xp % 500, xpPct: Math.min(100, Math.round(((xp % 500) / 500) * 100)) };
};

// Streak helper
const computeStreak = (user) => {
  if (!user) return { streak: 1, updated: true, lastDate: new Date().toISOString() };
  const now       = Date.now();
  const last      = user.lastLoginDate ? new Date(user.lastLoginDate).getTime() : 0;
  const diffHours = last ? (now - last) / (1000 * 60 * 60) : 999;
  const current   = user.loginStreak || 0;
  if (diffHours < 12) return { streak: current,     updated: false, lastDate: user.lastLoginDate };
  if (diffHours <= 48)return { streak: current + 1, updated: true,  lastDate: new Date().toISOString() };
  return              { streak: 1,                  updated: true,  lastDate: new Date().toISOString() };
};

export function useDashboardUser() {
  const [user, setUser] = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem('user') || 'null');
      if (!raw) return null;
      const u = { ...raw, _id: raw._id || raw.id };
      if (!u.fullName) u.fullName = u.name || u.email?.split('@')[0] || 'User';
      return u;
    } catch { return null; }
  });

  // ── Fetch fresh data from backend ──────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch(`${API}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        if (!data?.user) return;
        const fresh = { ...data.user, _id: data.user._id || data.user.id };
        if (!fresh.fullName) fresh.fullName = fresh.name || fresh.email?.split('@')[0] || 'User';

        // Streak update
        const { streak, updated, lastDate } = computeStreak(fresh);
        if (updated) {
          fresh.loginStreak    = streak;
          fresh.lastLoginDate  = lastDate;
          // Push streak to backend silently
          fetch(`${API}/api/auth/profile`, {
            method:  'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body:    JSON.stringify({ loginStreak: streak, lastLoginDate: lastDate }),
          }).catch(() => {});
        }

        setUser(fresh);
        localStorage.setItem('user', JSON.stringify(fresh));
      })
      .catch(() => {
        // Fallback: use cached user + compute streak locally
        try {
          const raw = JSON.parse(localStorage.getItem('user') || 'null');
          if (!raw) return;
          const { streak, updated, lastDate } = computeStreak(raw);
          if (updated) {
            const u2 = { ...raw, loginStreak: streak, lastLoginDate: lastDate };
            setUser(u2);
            localStorage.setItem('user', JSON.stringify(u2));
          }
        } catch {}
      });
  }, []);

  // ── onUserUpdate: instant local update + background server sync ──
  const onUserUpdate = useCallback((updates) => {
    setUser(prev => {
      const merged = { ...prev, ...updates };
      if (updates.score !== undefined) {
        const { level, xp } = computeLevel(updates.score);
        merged.level = level;
        merged.xp    = xp;
      }
      localStorage.setItem('user', JSON.stringify(merged));
      return merged;
    });

    // Sync to backend
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${API}/api/auth/profile`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify(updates),
      }).catch(() => {});
    }
  }, []);

  return { user, setUser, onUserUpdate };
}


// ─────────────────────────────────────────────────────────────────────────────
// FILE 2 PATCH:  PhishingPage — replace handleAnswer to also hit the backend
//
// In your Dashboard.jsx, find the PhishingPage component's handleAnswer fn and
// replace it with this version:
// ─────────────────────────────────────────────────────────────────────────────

/*
  const handleAnswer = (isPhish) => {
    if (animating) return;
    const correct = isPhish === current.isPhishing;
    if (correct) setSessionScore(s => s + 1);
    setSessionTotal(t => t + 1);
    setResult({ correct, isPhishing: current.isPhishing });
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);

    // ── Instant local update ──
    if (onUserUpdate) {
      onUserUpdate({
        phishingSimCorrect: (user?.phishingSimCorrect || 0) + (correct ? 1 : 0),
        phishingSimTotal:   (user?.phishingSimTotal   || 0) + 1,
        recentActivity: [
          { msg: `📧 Phishing sim: "${current.subject.substring(0, 28)}…" — ${correct ? 'Correct ✓' : 'Incorrect ✗'}`, time: 'Just now' },
          ...(user?.recentActivity || []).slice(0, 9),
        ],
      });
    }

    // ── Backend sync ──
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:5000/api/phishing/result', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ correct, emailSubject: current.subject }),
      })
        .then(r => r.json())
        .then(data => {
          // Re-sync score/level from server response
          if (data.success && onUserUpdate) {
            onUserUpdate({
              score:              data.totalScore,
              phishingSimCorrect: data.phishingSimCorrect,
              phishingSimTotal:   data.phishingSimTotal,
            });
          }
        })
        .catch(() => {});
    }
  };
*/


// ─────────────────────────────────────────────────────────────────────────────
// FILE 3 PATCH: Dashboard.jsx — top of the component, replace the user loading
//
// 1. Import the hook at the top of Dashboard.jsx:
//    import { useDashboardUser } from './hooks/useDashboardUser';
//
// 2. Inside the Dashboard() component, replace the existing user state + 
//    useEffect + onUserUpdate with:
//
//    const { user, setUser, onUserUpdate } = useDashboardUser();
//
// That's the only change needed in Dashboard.jsx itself.
// ─────────────────────────────────────────────────────────────────────────────