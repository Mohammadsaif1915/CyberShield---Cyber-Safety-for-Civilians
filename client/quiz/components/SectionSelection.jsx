import React from 'react';
import './SectionSelection.css';

const SectionSelection = ({ module, onSelectSection, onBack, completedSections }) => {
  const getSectionRange = (sectionId) => {
    const start = (sectionId - 1) * 10 + 1;
    const end = sectionId * 10;
    return `${start}-${end}`;
  };

  const isSectionCompleted = (sectionId) => {
    return completedSections.some(key => key.includes(`section${sectionId}`));
  };

  return (
    <div className="section-selection">
      <button className="back-btn" onClick={onBack}>
        ← Back to Modules
      </button>

      <div className="section-header">
        <div className="module-info">
          <span className="module-icon-large">{module.icon}</span>
          <div>
            <h2 className="section-title">{module.title}</h2>
            <p className="section-subtitle">{module.description}</p>
          </div>
        </div>
      </div>

      <div className="sections-grid">
        {module.sections.map(section => (
          <div
            key={section.id}
            className={`section-card glass-card ${isSectionCompleted(section.id) ? 'completed' : ''}`}
            onClick={() => onSelectSection(section.id)}
          >
            <div className="section-number">Section {section.id}</div>
            <h3 className="section-name">{section.title}</h3>
            <div className="section-info">
              <span className="question-range">Questions {getSectionRange(section.id)}</span>
              <span className="question-count">10 Questions</span>
            </div>
            {isSectionCompleted(section.id) && (
              <div className="completed-badge">✓ Completed</div>
            )}
            <button className="section-start-btn">
              {isSectionCompleted(section.id) ? 'Review' : 'Start'}
              <span className="arrow">→</span>
            </button>
          </div>
        ))}
      </div>

      <div className="progress-summary glass-card">
        <h4>Module Progress</h4>
        <div className="progress-stats">
          <div className="stat">
            <span className="stat-value">{completedSections.length}</span>
            <span className="stat-label">Sections Completed</span>
          </div>
          <div className="stat">
            <span className="stat-value">{completedSections.length * 10}</span>
            <span className="stat-label">Questions Answered</span>
          </div>
          <div className="stat">
            <span className="stat-value">{Math.round((completedSections.length / 4) * 100)}%</span>
            <span className="stat-label">Module Progress</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionSelection;