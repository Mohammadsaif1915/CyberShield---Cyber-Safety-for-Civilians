import React from "react";

/**
 * ProgressBar Component
 * Displays current level progress (questions answered)
 * and the user's live score.
 *
 * Props:
 *  - current: number       → questions answered so far
 *  - total: number         → total questions in level
 *  - score: number         → current score
 *  - levelTitle: string    → name of active level
 */
export default function ProgressBar({ current, total, score, levelTitle }) {
  // Calculate percentage (0–100)
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="progress-wrapper">
      {/* Top row: level name + score */}
      <div className="progress-header">
        <span className="progress-level-title">🛡️ {levelTitle}</span>
        <span className="progress-score">⭐ {score} pts</span>
      </div>

      {/* Progress bar track */}
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Bottom row: question count + percentage */}
      <div className="progress-footer">
        <span className="progress-count">
          Question {current} of {total}
        </span>
        <span className="progress-percent">{percentage}%</span>
      </div>
    </div>
  );
}