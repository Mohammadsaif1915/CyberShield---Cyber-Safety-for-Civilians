// ─────────────────────────────────────────────────────────────────────────────
// PATCH for game.jsx — paste this function and call it when game ends
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Call saveGameScore() when your game ends (on Game Over / Victory screen).
 *
 * @param {object} gameData
 *   score           — final score number
 *   wavesCompleted  — how many waves player reached
 *   enemiesDefeated — total kills (optional)
 *   timeSpent       — seconds played (optional)
 */
export async function saveGameScore({ score, wavesCompleted, enemiesDefeated, timeSpent }) {
  const token = localStorage.getItem('token');
  if (!token) return;   // not logged in, skip silently

  try {
    const res = await fetch('http://localhost:5000/api/game/score', {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ score, wavesCompleted, enemiesDefeated, timeSpent }),
    });
    const data = await res.json();
    if (data.success) {
      // Update localStorage so Dashboard.jsx picks up fresh score on next render
      try {
        const cached = JSON.parse(localStorage.getItem('user') || '{}');
        const updated = {
          ...cached,
          score:         data.totalScore,
          gameScore:     data.gameScore,
          gameHighScore: data.gameHighScore,
          level:         data.level,
          xp:            data.totalScore,
        };
        localStorage.setItem('user', JSON.stringify(updated));
        
        // Notify parent React app if running in Game iframe
        window.dispatchEvent(new Event('storage'));
        if (window.parent && window.parent !== window) {
           window.parent.dispatchEvent(new Event('storage'));
        }
      } catch {}
      console.log(`✅ Game score saved: ${score}, total: ${data.totalScore}`);
    }
    return data;
  } catch (err) {
    console.error('Game score save failed:', err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// HOW TO USE IN game.jsx:
//
//  import { saveGameScore } from './saveGameScore';   // adjust path
//
//  // When game ends:
//  await saveGameScore({
//    score:           finalScore,
//    wavesCompleted:  wave,
//    enemiesDefeated: kills,
//    timeSpent:       Math.floor((Date.now() - startTime) / 1000),
//  });
// ─────────────────────────────────────────────────────────────────────────────