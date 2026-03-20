import React from "react";

/**
 * Displays the level scenario and current question.
 * Props:
 *  - scenario: string (the real-world setup text)
 *  - question: string (what the user is being asked)
 *  - questionIndex: number
 *  - totalQuestions: number
 */
export default function ScenarioCard({
  scenario,
  question,
  questionIndex,
  totalQuestions,
}) {
  return (
    <div className="scenario-card">
      {/* Scenario setup — the "story" */}
      <div className="scenario-box">
        <span className="scenario-label">🌐 Scenario</span>
        <p className="scenario-text">{scenario}</p>
      </div>

      {/* Question counter */}
      <div className="question-counter">
        Question {questionIndex + 1} of {totalQuestions}
      </div>

      {/* The actual question */}
      <h3 className="question-text">{question}</h3>
    </div>
  );
}