import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ current, total, answered }) => {
  const percentage = (current / total) * 100;
  const answeredPercentage = (answered / total) * 100;

  return (
    <div className="progress-container glass-card">
      <div className="progress-stats-row">
        <div className="progress-stat">
          <span className="stat-label">Current</span>
          <span className="stat-value">{current} / {total}</span>
        </div>
        <div className="progress-stat">
          <span className="stat-label">Answered</span>
          <span className="stat-value">{answered} / {total}</span>
        </div>
        <div className="progress-stat">
          <span className="stat-label">Progress</span>
          <span className="stat-value">{Math.round(percentage)}%</span>
        </div>
      </div>

      <div className="progress-bar-wrapper">
        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill"
            style={{ width: `${percentage}%` }}
          />
          <div 
            className="progress-bar-answered"
            style={{ width: `${answeredPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;