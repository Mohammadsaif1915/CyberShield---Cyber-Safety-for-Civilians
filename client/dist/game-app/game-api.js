(function () {
  const localhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
  const configured = window.CYBERSHIELD_API_ORIGIN;
  const origins = configured
    ? [configured]
    : localhost
      ? ['http://localhost:5001', 'http://localhost:5000', '']
      : [''];

  async function request(path, options = {}) {
    let lastError;

    for (const origin of origins) {
      try {
        const response = await fetch(`${origin}/api/game${path}`, options);
        if (response.status === 404 && origin) {
          lastError = new Error(`Route not found at ${origin}`);
          continue;
        }
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || data.message || `Request failed with ${response.status}`);
        }
        return data;
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError || new Error('Game backend unavailable');
  }

  function getStoredAgent() {
    const keys = ['user_v2', 'user', 'cl_user'];
    for (const key of keys) {
      try {
        const value = JSON.parse(localStorage.getItem(key) || 'null');
        const name = value?.name || value?.fullName || value?.username;
        if (name) return { name, id: value.id || value._id || null };
      } catch {}
    }
    return null;
  }

  function prefillAgentInput(inputId) {
    const input = document.getElementById(inputId);
    const agent = getStoredAgent();
    if (input && agent?.name && !input.value) input.value = agent.name;
  }

  function rememberAgent(name) {
    const cleanName = String(name || '').trim();
    if (!cleanName) return;
    try {
      const existing = JSON.parse(localStorage.getItem('user_v2') || 'null') || {};
      localStorage.setItem('user_v2', JSON.stringify({
        id: existing.id || `CY-${Math.floor(100000 + Math.random() * 900000)}`,
        ...existing,
        name: cleanName,
      }));
    } catch {}
  }

  function saveProgress(payload) {
    return request('/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  }

  function getLeaderboard(level) {
    return request(`/leaderboard/${level}`);
  }

  function getStats(username) {
    return request(`/stats/${encodeURIComponent(username)}`);
  }

  function getProgress(level, username) {
    return request(`/progress/${level}/${encodeURIComponent(username)}`);
  }

  window.CyberShieldGameApi = {
    baseUrl: `${origins[0]}/api/game`,
    getStoredAgent,
    prefillAgentInput,
    rememberAgent,
    saveProgress,
    getLeaderboard,
    getStats,
    getProgress,
  };
})();
