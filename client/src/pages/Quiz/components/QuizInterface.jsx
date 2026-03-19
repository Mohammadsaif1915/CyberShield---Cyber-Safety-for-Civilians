import React, { useState, useEffect } from 'react';
import './QuizInterface.css';
import ProgressBar from './ProgressBar';
import QuestionCard from './QuestionCard';
import SectionReview from './SectionReview';
import { shuffleSectionQuestions } from '../utils/shuffleUtils';

const QuizInterface = ({ 
  questions, 
  currentQuestion, 
  answers, 
  onAnswer, 
  onNext, 
  onPrev, 
  onFinish,
  onBack,
  moduleTitle,
  sectionNumber,
  totalSections,
  onSectionReviewComplete
}) => {
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [showReview, setShowReview] = useState(false);
  const [sectionAnswers, setSectionAnswers] = useState({});

  // Shuffle questions on mount
  useEffect(() => {
    const shuffled = shuffleSectionQuestions(questions);
    setShuffledQuestions(shuffled);
  }, [questions]);

  if (shuffledQuestions.length === 0) {
    return <div className="quiz-interface">Loading...</div>;
  }

  const question = shuffledQuestions[currentQuestion];
  const isLastQuestion = currentQuestion === shuffledQuestions.length - 1;
  const isFirstQuestion = currentQuestion === 0;
  const answeredCount = Object.keys(answers).length;

  const handleFinishSection = () => {
    setSectionAnswers({...answers});
    setShowReview(true);
  };

  const handleContinueFromReview = () => {
    // Convert shuffled option indexes back to original question option indexes
    // so module-level scoring and results stay accurate.
    const normalizedAnswers = {};

    shuffledQuestions.forEach((shuffledQuestion) => {
      const selectedIndex = sectionAnswers[shuffledQuestion.id];

      if (selectedIndex === undefined) {
        return;
      }

      const selectedOptionText = shuffledQuestion.options[selectedIndex];
      const originalQuestion = questions.find((q) => q.id === shuffledQuestion.id);
      const originalIndex = originalQuestion?.options?.indexOf(selectedOptionText);

      normalizedAnswers[shuffledQuestion.id] = originalIndex >= 0 ? originalIndex : selectedIndex;
    });

    setShowReview(false);
    if (onSectionReviewComplete) {
      onSectionReviewComplete();
    }
    onFinish(normalizedAnswers);
  };

  if (showReview) {
    return (
      <SectionReview
        questions={shuffledQuestions}
        answers={sectionAnswers}
        sectionNumber={sectionNumber}
        totalSections={totalSections}
        onContinue={handleContinueFromReview}
        moduleTitle={moduleTitle}
      />
    );
  }

  return (
    <div className="quiz-interface">
      <div className="quiz-header">
        <button className="back-btn" onClick={onBack}>
          ← Back to Sections
        </button>
        <div className="quiz-info">
          <h2 className="quiz-module-title">{moduleTitle}</h2>
          <span className="quiz-section">Section {sectionNumber}</span>
        </div>
      </div>

      <ProgressBar 
        current={currentQuestion + 1}
        total={shuffledQuestions.length}
        answered={answeredCount}
      />

      <QuestionCard
        question={question}
        selectedAnswer={answers[question.id]}
        onAnswer={(answer) => onAnswer(question.id, answer)}
        questionNumber={currentQuestion + 1}
      />

      <div className="quiz-navigation">
        <button 
          className="nav-btn prev-btn"
          onClick={onPrev}
          disabled={isFirstQuestion}
        >
          ← Previous
        </button>

        <div className="question-indicators">
          {shuffledQuestions.map((_, idx) => (
            <div 
              key={idx}
              className={`indicator ${idx === currentQuestion ? 'active' : ''} ${answers[shuffledQuestions[idx].id] !== undefined ? 'answered' : ''}`}
            />
          ))}
        </div>

        {isLastQuestion ? (
          <button 
            className="nav-btn finish-btn"
            onClick={handleFinishSection}
          >
            Finish Section →
          </button>
        ) : (
          <button 
            className="nav-btn next-btn"
            onClick={onNext}
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizInterface;