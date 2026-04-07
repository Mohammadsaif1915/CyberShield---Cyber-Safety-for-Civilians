import React, { useState, useEffect, useRef } from 'react';
import './Results.css';

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL)
  || 'http://localhost:5000';

const Results = ({ module, moduleAnswers, onBackToModules, timeSpent }) => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [saveStatus, setSaveStatus] = useState('saving');
  const hasSaved = useRef(false);

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

        const userAnswer = sectionAnswers[q.id];

        // ✅ FIX: Check if we stored shuffled correctAnswer
        // If yes, compare against shuffled correctAnswer
        // If no (old format), compare against original correctAnswer
        const shuffledCorrect = sectionAnswers[`${q.id}_correct`];
        const correctAnswer = shuffledCorrect !== undefined
          ? shuffledCorrect      // use shuffled correctAnswer
          : q.correctAnswer;     // fallback to original

        if (userAnswer !== undefined && userAnswer === correctAnswer) {
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
    if (percentage >= 90) return { grade: 'A+', color: '#00ff88', message: 'Outstanding!'    };
    if (percentage >= 80) return { grade: 'A',  color: '#00ddff', message: 'Excellent!'      };
    if (percentage >= 70) return { grade: 'B',  color: '#0099ff', message: 'Well Done!'      };
    if (percentage >= 60) return { grade: 'C',  color: '#ffd700', message: 'Good Effort!'    };
    return                       { grade: 'D',  color: '#ff6b6b', message: 'Keep Practicing!' };
  };

  const getSectionColor = (percentage) => {
    if (percentage >= 80) return '#00ff88';
    if (percentage >= 60) return '#00ddff';
    if (percentage >= 40) return '#ffd700';
    return '#ff6b6b';
  };

  const gradeInfo = getGrade(results.percentage);

  // ── Save to MongoDB ─────────────────────────────────────────
  useEffect(() => {
    if (hasSaved.current) return;
    hasSaved.current = true;

    const saveResult = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No token — skipping save');
        setSaveStatus('error');
        return;
      }

      const payload = {
        moduleId:       module.id,
        moduleTitle:    module.title,
        totalCorrect:   results.totalCorrect,
        totalQuestions: results.totalQuestions,
        percentage:     results.percentage,
        grade:          gradeInfo.grade,
        timeSpent,
        sectionResults: results.sectionResults.map(s => ({
          sectionId:  s.sectionId,
          title:      s.title,
          correct:    s.correct,
          incorrect:  s.incorrect,
          total:      s.total,
          percentage: s.percentage,
        })),
      };

      try {
        const res = await fetch(`${API_BASE}/api/quiz/result`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const text = await res.text();
        if (!res.ok) {
          console.error('Save failed:', res.status, text);
          setSaveStatus('error');
          return;
        }

        const data = JSON.parse(text);
        if (data.success) {
          console.log('✅ Result saved! ID:', data.result?._id);
          setSaveStatus('saved');
        } else {
          setSaveStatus('error');
        }
      } catch (err) {
        console.error('Network error:', err.message);
        setSaveStatus('error');
      }
    };

    saveResult();
  }, []);

  return (
    <div className="results-container">
      <div className="results-header">
        <h1 className="results-title">Module Complete! 🎉</h1>
        <p className="results-subtitle">{module.title}</p>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          marginTop: 10, padding: '5px 14px', borderRadius: 99,
          fontSize: 12, fontWeight: 600,
          background: saveStatus === 'saved' ? 'rgba(0,255,136,0.12)'
                    : saveStatus === 'error' ? 'rgba(255,107,107,0.12)'
                    : 'rgba(255,255,255,0.08)',
          border: `1px solid ${saveStatus === 'saved' ? 'rgba(0,255,136,0.3)'
                              : saveStatus === 'error' ? 'rgba(255,107,107,0.3)'
                              : 'rgba(255,255,255,0.15)'}`,
          color: saveStatus === 'saved' ? '#00ff88'
               : saveStatus === 'error' ? '#ff6b6b' : '#888',
        }}>
          {saveStatus === 'saving' && '⏳ Saving...'}
          {saveStatus === 'saved'  && '✅ Result saved!'}
          {saveStatus === 'error'  && '⚠️ Not saved'}
        </div>
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

      {/* ── Per-Section Results ── */}
      <div className="section-breakdown">
        <h3 className="breakdown-title">📊 Results by Section (10 Questions Each)</h3>
        <div className="sections-results">
          {results.sectionResults.map(section => {
            const sectionColor = getSectionColor(section.percentage);
            const sectionGrade = getGrade(section.percentage);
            const isExpanded   = expandedSection === section.sectionId;

            return (
              <div key={section.sectionId} className="section-result-card glass-card">
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
                      <span className="section-qs-label">
                        Questions {(section.sectionId - 1) * 10 + 1}–{section.sectionId * 10}
                      </span>
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

                <div className="section-result-bar">
                  <div
                    className="section-result-fill"
                    style={{
                      width: `${section.percentage}%`,
                      background: `linear-gradient(90deg, ${sectionColor}99 0%, ${sectionColor} 100%)`
                    }}
                  />
                </div>

                <div className="section-mini-stats">
                  <span className="mini-stat correct">✅ {section.correct} Correct</span>
                  <span className="mini-stat incorrect">❌ {section.incorrect} Incorrect</span>
                  <span className="mini-stat total">📝 {section.total} Total</span>
                </div>

                {isExpanded && (
                  <div className="section-qa-review">
                    <div className="qa-divider" />
                    {section.questions.map((q, idx) => {
                      const userAnswer   = section.answers[q.id];
                      const shuffledCorr = section.answers[`${q.id}_correct`];
                      const correctAns   = shuffledCorr !== undefined ? shuffledCorr : q.correctAnswer;
                      const isCorrect    = userAnswer !== undefined && userAnswer === correctAns;
                      const isUnanswered = userAnswer === undefined;

                      // For display: show option text
                      // options array is original (from quizData)
                      // but answer index was based on shuffled options
                      // We can't recover shuffled options here, so just show index or skip
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
                            {!isCorrect && !isUnanswered && (
                              <div className="qa-answers">
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