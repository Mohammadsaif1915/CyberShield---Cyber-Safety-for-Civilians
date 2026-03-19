import React from 'react';
import './QuestionCard.css';

const QuestionCard = ({ question, selectedAnswer, onAnswer, questionNumber }) => {
  return (
    <div className="question-card glass-card">
      <div className="question-header">
        <span className="question-number">Question {questionNumber}</span>
      </div>
      
      <h3 className="question-text">{question.question}</h3>

      <div className="options-container">
        {question.options.map((option, index) => (
          <div
            key={index}
            className={`option-card ${selectedAnswer === index ? 'selected' : ''}`}
            onClick={() => onAnswer(index)}
          >
            <div className="option-indicator">
              <span className="option-letter">{String.fromCharCode(65 + index)}</span>
            </div>
            <span className="option-text">{option}</span>
            {selectedAnswer === index && (
              <div className="selected-checkmark">✓</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;