import React from 'react';
import './ModuleSelection.css';

const ModuleSelection = ({ modules, onSelectModule }) => {
  return (
    <div className="module-selection">
      <div className="module-header">
        <h1 className="main-title">Quiz Master</h1>
        <p className="subtitle">Choose a module to begin your journey</p>
      </div>
      
      <div className="modules-grid">
        {modules.map(module => (
          <div 
            key={module.id}
            className="module-card glass-card"
            onClick={() => onSelectModule(module.id)}
          >
            <div className="module-icon">{module.icon}</div>
            <h3 className="module-title">{module.title}</h3>
            <p className="module-description">{module.description}</p>
            <div className="module-footer">
              <span className="module-stats">40 Questions • 4 Sections</span>
              <button className="start-btn">
                Start
                <span className="arrow">→</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModuleSelection;