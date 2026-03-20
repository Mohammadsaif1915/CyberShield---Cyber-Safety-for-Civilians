import { useState, useCallback } from "react";
import { saveUserProgress, fetchUserProgress } from "../api/gameApi";

/**
 * useProgress Hook
 * Handles all communication with the backend for:
 *  - Saving completed level progress
 *  - Loading existing progress on app start
 *  - Tracking which levels are done locally
 */
export function useProgress() {
  const [completedLevels, setCompletedLevels] = useState([]); // [1, 2, 3 ...]
  const [totalScore, setTotalScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── Save progress after finishing a level ──────────────────────────────
  const saveProgress = useCallback(async (userId, levelId, score) => {
    setLoading(true);
    setError(null);

    try {
      await saveUserProgress({ userId, levelId, score });

      // Update local state immediately (no need to re-fetch)
      setCompletedLevels((prev) =>
        prev.includes(levelId) ? prev : [...prev, levelId]
      );
      setTotalScore((prev) => prev + score);

    } catch (err) {
      console.error("Failed to save progress:", err);
      setError("Could not save progress. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Load progress when app starts ─────────────────────────────────────
  const loadProgress = useCallback(async (userId) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchUserProgress(userId);

      // data = { completedLevels: [1,2], totalScore: 200 }
      setCompletedLevels(data.completedLevels || []);
      setTotalScore(data.totalScore || 0);

    } catch (err) {
      console.error("Failed to load progress:", err);
      setError("Could not load progress.");
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Check if a specific level is unlocked ─────────────────────────────
  // Level 1 is always unlocked. Others need previous level completed.
  const isLevelUnlocked = useCallback(
    (levelId) => {
      if (levelId === 1) return true;
      return completedLevels.includes(levelId - 1);
    },
    [completedLevels]
  );

  // ── Check if a specific level is completed ────────────────────────────
  const isLevelCompleted = useCallback(
    (levelId) => completedLevels.includes(levelId),
    [completedLevels]
  );

  return {
    completedLevels,
    totalScore,
    loading,
    error,
    saveProgress,
    loadProgress,
    isLevelUnlocked,
    isLevelCompleted,
  };
}