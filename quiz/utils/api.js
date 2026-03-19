const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Generate or get userId (using localStorage for now)
export const getUserId = () => {
  let userId = localStorage.getItem('quizUserId');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('quizUserId', userId);
  }
  return userId;
};

// Quiz Progress API
export const quizAPI = {
  // Save section progress
  saveSectionProgress: async (moduleId, sectionId, answers, score, timeSpent, completed) => {
    const userId = getUserId();
    return apiCall('/quiz/progress/section', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        moduleId,
        sectionId,
        answers,
        score,
        timeSpent,
        completed
      }),
    });
  },

  // Get section progress
  getSectionProgress: async (moduleId, sectionId) => {
    const userId = getUserId();
    return apiCall(`/quiz/progress/section/${userId}/${moduleId}/${sectionId}`);
  },

  // Get all sections for a module
  getModuleProgress: async (moduleId) => {
    const userId = getUserId();
    return apiCall(`/quiz/progress/module/${userId}/${moduleId}`);
  },

  // Save module completion
  saveModuleProgress: async (moduleId, completedSections, totalScore, timeSpent, completed) => {
    const userId = getUserId();
    return apiCall('/quiz/progress/module', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        moduleId,
        completedSections,
        totalScore,
        timeSpent,
        completed
      }),
    });
  },

  // Get all user progress
  getUserProgress: async () => {
    const userId = getUserId();
    return apiCall(`/quiz/progress/user/${userId}`);
  },

  // Get user statistics
  getUserStats: async () => {
    const userId = getUserId();
    return apiCall(`/quiz/stats/${userId}`);
  },

  // Delete section progress (retry)
  deleteSectionProgress: async (moduleId, sectionId) => {
    const userId = getUserId();
    return apiCall(`/quiz/progress/section/${userId}/${moduleId}/${sectionId}`, {
      method: 'DELETE',
    });
  },

  // Reset all progress
  resetAllProgress: async () => {
    const userId = getUserId();
    return apiCall(`/quiz/progress/user/${userId}`, {
      method: 'DELETE',
    });
  },

  // Health check
  healthCheck: async () => {
    return apiCall('/health');
  },
};

export default quizAPI;