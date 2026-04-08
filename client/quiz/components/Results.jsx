import React, { useState } from 'react';
import './Results.css';

const Results = ({ module, moduleAnswers, onBackToModules, timeSpent }) => {
  const [expandedSection, setExpandedSection] = useState(null);

  const calculateResults = () => {
    let totalCorrect = 0;
    let totalQuestions = 0;
    const sectionResults = [];

    module.sections.forEach(section => {
      let sectionCorrect = 0;
      const sectionKey = `module${module.id}_section${section.id}`;
      const sectionAnswers = moduleAnswers[sectionKey] || {};

      section.questions.forEach(q => {
        totalQuestions++;
        if (sectionAnswers[q.id] === q.correctAnswer) {
          sectionCorrect++;
          totalCorrect++;
        }
      });

      const total = section.questions.length;
      const percentage = total > 0 ? Math.round((sectionCorrect / total) * 100) : 0;

      sectionResults.push({
        sectionId: section.id,
        title: section.title,
        correct: sectionCorrect,
        incorrect: total - sectionCorrect,
        total,
        percentage,
        questions: section.questions,
        answers: sectionAnswers
      });
    });

    return {
      totalCorrect,
      totalQuestions,
      percentage: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
      sectionResults
    };
  };

  const results = calculateResults();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return { grade: 'A+', color: '#00ff88', message: 'Outstanding!' };
    if (percentage >= 80) return { grade: 'A', color: '#00ddff', message: 'Excellent!' };
    if (percentage >= 70) return { grade: 'B', color: '#0099ff', message: 'Well Done!' };
    if (percentage >= 60) return { grade: 'C', color: '#ffd700', message: 'Good Effort!' };
    return { grade: 'D', color: '#ff6b6b', message: 'Keep Practicing!' };
  };

  const getSectionColor = (percentage) => {
    if (percentage >= 80) return '#00ff88';
    if (percentage >= 60) return '#00ddff';
    if (percentage >= 40) return '#ffd700';
    return '#ff6b6b';
  };

  const gradeInfo = getGrade(results.percentage);

  return (
    <div className="results-container">
      <div className="results-header">
        <h1 className="results-title">Module Complete! 🎉</h1>
        <p className="results-subtitle">{module.title}</p>
      </div>

      {/* ── Overall Scoreboard ── */}
      <div className="results-main glass-card">
        <div className="grade-circle" style={{ borderColor: gradeInfo.color }}>
          <div className="grade-letter" style={{ color: gradeInfo.color }}>
            {gradeInfo.grade}
          </div>
          <div className="grade-percentage">{results.percentage}%</div>
        </div>

        <h2 className="grade-message" style={{ color: gradeInfo.color }}>
          {gradeInfo.message}
        </h2>

        <div className="results-summary">
          <div className="summary-stat">
            <span className="summary-value" style={{ color: '#00ff88' }}>{results.totalCorrect}</span>
            <span className="summary-label">✅ Correct</span>
          </div>
          <div className="summary-stat">
            <span className="summary-value" style={{ color: '#ff6b6b' }}>{results.totalQuestions - results.totalCorrect}</span>
            <span className="summary-label">❌ Incorrect</span>
          </div>
          <div className="summary-stat">
            <span className="summary-value">{results.totalQuestions}</span>
            <span className="summary-label">📝 Total</span>
          </div>
          <div className="summary-stat">
            <span className="summary-value">{formatTime(timeSpent)}</span>
            <span className="summary-label">⏱ Time</span>
          </div>
        </div>
      </div>

      {/* ── Per-Section Results (every 10 questions) ── */}
      <div className="section-breakdown">
        <h3 className="breakdown-title">📊 Results by Section (10 Questions Each)</h3>
        <div className="sections-results">
          {results.sectionResults.map(section => {
            const sectionColor = getSectionColor(section.percentage);
            const sectionGrade = getGrade(section.percentage);
            const isExpanded = expandedSection === section.sectionId;

            return (
              <div key={section.sectionId} className="section-result-card glass-card">
                {/* Section header row */}
                <div
                  className="section-result-header"
                  onClick={() => setExpandedSection(isExpanded ? null : section.sectionId)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="section-title-group">
                    <div className="section-badge" style={{ background: sectionColor }}>
                      S{section.sectionId}
                    </div>
                    <div>
                      <h4>Section {section.sectionId}: {section.title}</h4>
                      <span className="section-qs-label">Questions {(section.sectionId - 1) * 10 + 1}–{section.sectionId * 10}</span>
                    </div>
                  </div>
                  <div className="section-score-group">
                    <div className="section-grade-badge" style={{ borderColor: sectionColor, color: sectionColor }}>
                      {sectionGrade.grade}
                    </div>
                    <span className="section-percentage" style={{ color: sectionColor }}>
                      {section.percentage}%
                    </span>
                    <span className="expand-arrow">{isExpanded ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="section-result-bar">
                  <div
                    className="section-result-fill"
                    style={{
                      width: `${section.percentage}%`,
                      background: `linear-gradient(90deg, ${sectionColor}99 0%, ${sectionColor} 100%)`
                    }}
                  />
                </div>

                {/* Mini score stats */}
                <div className="section-mini-stats">
                  <span className="mini-stat correct">✅ {section.correct} Correct</span>
                  <span className="mini-stat incorrect">❌ {section.incorrect} Incorrect</span>
                  <span className="mini-stat total">📝 {section.total} Total</span>
                </div>

                {/* Expanded Q&A review */}
                {isExpanded && (
                  <div className="section-qa-review">
                    <div className="qa-divider" />
                    {section.questions.map((q, idx) => {
                      const userAnswer = section.answers[q.id];
                      const isCorrect = userAnswer === q.correctAnswer;
                      const isUnanswered = userAnswer === undefined;
                      return (
                        <div
                          key={q.id}
                          className={`qa-item ${isCorrect ? 'qa-correct' : isUnanswered ? 'qa-unanswered' : 'qa-wrong'}`}
                        >
                          <div className="qa-status-icon">
                            {isCorrect ? '✅' : isUnanswered ? '⬜' : '❌'}
                          </div>
                          <div className="qa-content">
                            <p className="qa-question">
                              <strong>Q{(section.sectionId - 1) * 10 + idx + 1}.</strong> {q.question}
                            </p>
                            {!isCorrect && (
                              <div className="qa-answers">
                                {!isUnanswered && (
                                  <span className="qa-your-answer">
                                    Your answer: {q.options[userAnswer]}
                                  </span>
                                )}
                                <span className="qa-correct-answer">
                                  ✓ Correct: {q.options[q.correctAnswer]}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="results-actions">
        <button className="results-btn primary" onClick={onBackToModules}>
          ← Back to Modules
        </button>
      </div>
    </div>
  );
};

export default Results;