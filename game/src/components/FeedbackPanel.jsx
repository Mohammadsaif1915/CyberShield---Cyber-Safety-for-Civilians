import React from "react";

/**
 * Shows feedback after user answers.
 * Props:
 *  - feedback: { correct: bool, explanation: string, points: number } | null
 *  - onNext: () => void
 *  - isLastQuestion: bool
 */
export default function FeedbackPanel({ feedback, onNext, isLastQuestion }) {
  if (!feedback) return null; // hidden until user answers

  return (
    <div className={`feedback-panel ${feedback.correct ? "correct" : "incorrect"}`}>
      {/* Result banner */}
      <div className="feedback-banner">
        {feedback.correct ? (
          <>
            <span className="feedback-icon">✅</span>
            <span className="feedback-title">Correct! +{feedback.points} pts</span>
          </>
        ) : (
          <>
            <span className="feedback-icon">❌</span>
            <span className="feedback-title">Not quite...</span>
          </>
        )}
      </div>

      {/* Explanation — the KEY learning moment */}
      <div className="feedback-explanation">
        <span className="explanation-label">💡 Why?</span>
        <p>{feedback.explanation}</p>
      </div>

      {/* Next / Finish button */}
      <button className="next-btn" onClick={onNext}>
        {isLastQuestion ? "🏁 Finish Level" : "Next Question →"}
      </button>
    </div>
  );
}