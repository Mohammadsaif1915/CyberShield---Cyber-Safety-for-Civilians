import React from 'react';
import './SectionReview.css';

const SectionReview = ({ 
  questions, 
  answers, 
  sectionNumber, 
  totalSections,
  onContinue,
  moduleTitle 
}) => {
  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const correctCount = calculateScore();
  const wrongCount = questions.length - correctCount;
  const percentage = Math.round((correctCount / questions.length) * 100);

  const getAnswerStatus = (question) => {
    const userAnswer = answers[question.id];
    if (userAnswer === undefined) return 'unanswered';
    return userAnswer === question.correctAnswer ? 'correct' : 'wrong';
  };

  return (
    <div className="section-review">
      <div className="review-header">
        <h2 className="review-title">Section {sectionNumber} Complete!</h2>
        <p className="review-subtitle">{moduleTitle}</p>
      </div>

      <div className="review-score-card glass-card">
        <div className="score-circle">
          <div className="score-percentage">{percentage}%</div>
          <div className="score-label">Score</div>
        </div>
        
        <div className="score-breakdown">
          <div className="score-stat correct">
            <span className="stat-icon">✓</span>
            <span className="stat-value">{correctCount}</span>
            <span className="stat-label">Correct</span>
          </div>
          <div className="score-stat wrong">
            <span className="stat-icon">✗</span>
            <span className="stat-value">{wrongCount}</span>
            <span className="stat-label">Wrong</span>
          </div>
          <div className="score-stat total">
            <span className="stat-icon">📝</span>
            <span className="stat-value">{questions.length}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>

        <div className="section-progress">
          <span>Section {sectionNumber} of {totalSections}</span>
        </div>
      </div>

      <div className="review-questions">
        <h3 className="review-section-title">Review Your Answers</h3>
        
        {questions.map((question, index) => {
          const status = getAnswerStatus(question);
          const userAnswer = answers[question.id];
          
          return (
            <div key={question.id} className={`review-question-card glass-card ${status}`}>
              <div className="review-question-header">
                <span className="review-question-number">Question {index + 1}</span>
                <span className={`review-status-badge ${status}`}>
                  {status === 'correct' ? '✓ Correct' : '✗ Wrong'}
                </span>
              </div>

              <p className="review-question-text">{question.question}</p>

              <div className="review-options">
                {question.options.map((option, optIndex) => {
                  const isUserAnswer = userAnswer === optIndex;
                  const isCorrectAnswer = question.correctAnswer === optIndex;
                  
                  let optionClass = 'review-option';
                  if (isCorrectAnswer) optionClass += ' correct-answer';
                  if (isUserAnswer && !isCorrectAnswer) optionClass += ' wrong-answer';
                  if (isUserAnswer && isCorrectAnswer) optionClass += ' user-correct';

                  return (
                    <div key={optIndex} className={optionClass}>
                      <span className="option-letter">{String.fromCharCode(65 + optIndex)}</span>
                      <span className="option-text">{option}</span>
                      {isCorrectAnswer && <span className="correct-indicator">✓ Correct Answer</span>}
                      {isUserAnswer && !isCorrectAnswer && <span className="your-answer-indicator">Your Answer</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="review-actions">
        <button className="continue-btn" onClick={onContinue}>
          {sectionNumber < totalSections ? 'Continue to Next Section →' : 'Finish Module →'}
        </button>
      </div>
    </div>
  );
};

export default SectionReview;