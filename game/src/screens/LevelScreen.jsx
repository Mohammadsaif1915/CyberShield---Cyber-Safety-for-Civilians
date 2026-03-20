import React, { useEffect } from "react";
import { useGameState } from "../hooks/useGameState";
import { useProgress } from "../hooks/useProgress";
import ScenarioCard from "../components/ScenarioCard";
import OptionsPanel from "../components/OptionsPanel";
import FeedbackPanel from "../components/FeedbackPanel";

/**
 * Drop this anywhere in your existing UI.
 * Props:
 *  - levelData: the level object to load
 *  - userId: string (for saving progress)
 *  - onLevelComplete: (levelId, score) => void (callback to your dashboard)
 *  - onExit: () => void
 */
export default function LevelScreen({ levelData, userId, onLevelComplete, onExit }) {
  const {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    selectedAnswer,
    feedback,
    score,
    levelStatus,
    loadLevel,
    submitAnswer,
    nextQuestion,
    exitLevel,
  } = useGameState();

  const { saveProgress } = useProgress();

  // Load level when component mounts or levelData changes
  useEffect(() => {
    if (levelData) loadLevel(levelData);
  }, [levelData]);

  // When level finishes, save progress + notify dashboard
  useEffect(() => {
    if (levelStatus === "finished") {
      saveProgress(userId, levelData.id, score); // POST to backend
      onLevelComplete?.(levelData.id, score);
    }
  }, [levelStatus]);

  // ─── Level Complete Screen ────────────────────────────────────────────
  if (levelStatus === "finished") {
    return (
      <div className="level-complete">
        <h2>🎉 Level Complete!</h2>
        <p className="level-complete-score">You scored: <strong>{score} pts</strong></p>
        <div className="level-complete-actions">
          <button className="btn-primary" onClick={onExit}>
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return <div className="loading">Loading level...</div>;

  // ─── Active Gameplay Screen ───────────────────────────────────────────
  return (
    <div className="level-screen">
      {/* Header with score */}
      <div className="level-header">
        <button className="exit-btn" onClick={() => { exitLevel(); onExit?.(); }}>
          ✕ Exit
        </button>
        <span className="live-score">Score: {score}</span>
      </div>

      <ProgressBar
       current={currentQuestionIndex}
       total={totalQuestions}
       score={score}
       levelTitle={currentLevel?.title}
      />

      {/* Scenario + Question */}
      <ScenarioCard
        scenario={currentQuestion.scenario}
        question={currentQuestion.question}
        questionIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
      />

      {/* Answer Options */}
      <OptionsPanel
        options={currentQuestion.options}
        selectedAnswer={selectedAnswer}
        correctIndex={currentQuestion.correctIndex}
        onSelect={submitAnswer}
        disabled={!!feedback}
      />

      {/* Feedback after answering */}
      <FeedbackPanel
        feedback={feedback}
        onNext={nextQuestion}
        isLastQuestion={currentQuestionIndex === totalQuestions - 1}
      />
    </div>
  );
}