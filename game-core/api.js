const API_BASE_URL =
  window.CYBERSHIELD_API_URL ||
  localStorage.getItem('cybershieldApiUrl') ||
  'http://localhost:5000/api';

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = typeof data === 'object' && data?.message
      ? data.message
      : `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
}

export const gameApi = {
  getProgress: () => apiRequest('/game/progress'),
  saveProgress: (payload) => apiRequest('/game/progress', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  saveScore: (payload) => apiRequest('/game/score', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
};

