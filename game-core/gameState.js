const STORAGE_KEY = 'cybershieldGameState';

const defaultState = {
  currentLevel: 1,
  levels: {},
  totalScore: 0,
};

export function loadGameState() {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);
    return savedState ? { ...defaultState, ...JSON.parse(savedState) } : defaultState;
  } catch {
    return defaultState;
  }
}

export function saveGameState(nextState) {
  const state = { ...loadGameState(), ...nextState };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  return state;
}

export function updateLevelState(levelId, levelState) {
  const state = loadGameState();
  return saveGameState({
    levels: {
      ...state.levels,
      [levelId]: {
        ...state.levels[levelId],
        ...levelState,
      },
    },
  });
}

export function resetGameState() {
  localStorage.removeItem(STORAGE_KEY);
  return defaultState;
}

