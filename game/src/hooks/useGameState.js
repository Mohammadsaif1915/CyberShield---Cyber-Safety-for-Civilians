import { useState, useCallback } from "react";

const POINTS_PER_CORRECT = 100;
const POINTS_PENALTY = 0; // no penalty, encourages learning

export function useGameState() {
  // Core state
  const [currentLevel, setCurrentLevel] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null); // { correct, explanation, points }
  const [score, setScore] = useState(0);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [levelStatus, setLevelStatus] = useState("idle"); // idle | playing | finished

  // Load a level (called when user clicks a level in your existing dashboard)
  const loadLevel = useCallback((levelData) => {
    setCurrentLevel(levelData);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setFeedback(null);
    setLevelStatus("playing");
  }, []);

  // User selects an answer
  const submitAnswer = useCallback(
    (answerIndex) => {
      if (feedback) return; // already answered this question

      const question = currentLevel.questions[currentQuestionIndex];
      const isCorrect = answerIndex === question.correctIndex;
      const pointsEarned = isCorrect ? POINTS_PER_CORRECT : POINTS_PENALTY;

      setSelectedAnswer(answerIndex);
      setScore((prev) => prev + pointsEarned);
      setFeedback({
        correct: isCorrect,
        explanation: question.explanation,
        points: pointsEarned,
      });
    },
    [currentLevel, currentQuestionIndex, feedback]
  );

  // Move to next question OR finish level
  const nextQuestion = useCallback(() => {
    const totalQuestions = currentLevel.questions.length;
    const nextIndex = currentQuestionIndex + 1;

    setFeedback(null);
    setSelectedAnswer(null);

    if (nextIndex < totalQuestions) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      // Level complete!
      setLevelStatus("finished");
      setCompletedLevels((prev) =>
        prev.includes(currentLevel.id) ? prev : [...prev, currentLevel.id]
      );
    }
  }, [currentLevel, currentQuestionIndex]);

  // Reset to go back to dashboard
  const exitLevel = useCallback(() => {
    setCurrentLevel(null);
    setLevelStatus("idle");
    setFeedback(null);
    setSelectedAnswer(null);
    setCurrentQuestionIndex(0);
  }, []);

  return {
    // State
    currentLevel,
    currentQuestion: currentLevel?.questions[currentQuestionIndex] ?? null,
    currentQuestionIndex,
    totalQuestions: currentLevel?.questions.length ?? 0,
    selectedAnswer,
    feedback,
    score,
    completedLevels,
    levelStatus,

    // Actions
    loadLevel,
    submitAnswer,
    nextQuestion,
    exitLevel,
  };
}