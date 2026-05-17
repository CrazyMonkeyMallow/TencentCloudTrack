const API_BASE = process.env.REACT_APP_API_URL || '';

function getToken() {
  return sessionStorage.getItem('token') || localStorage.getItem('token');
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || res.statusText);
    err.response = { data };
    throw err;
  }
  return data;
}

const api = {
  register: (body) =>
    request('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),

  login: (body) =>
    request('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  getUserSig: async (userId) => {
    const res = await fetch(
      `${API_BASE}/usersig?userId=${encodeURIComponent(userId)}`
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to get userSig');
    return data;
  },

  initiateCall: (symptoms) =>
    request('/api/call/initiate', {
      method: 'POST',
      body: JSON.stringify({ symptoms }),
    }),

  getPendingCalls: async () => {
    const data = await request('/api/call/pending');
    return data.calls || [];
  },

  getPatientCallStatus: async () => {
    const data = await request('/api/call/pending');
    return data.call || null;
  },

  acceptCall: (consultationId) =>
    request('/api/call/accept', {
      method: 'POST',
      body: JSON.stringify({ consultationId }),
    }),

  endCall: (consultationId, chatLog) =>
    request('/api/call/end', {
      method: 'POST',
      body: JSON.stringify({ consultationId, chatLog }),
    }),

  postMessage: (consultationId, text, sender) =>
    request('/api/call/message', {
      method: 'POST',
      body: JSON.stringify({ consultationId, text, sender }),
    }),

  getMessages: async (consultationId) => {
    const data = await request(`/api/call/messages/${consultationId}`);
    return data.messages || [];
  },

  getHistory: async () => {
    const data = await request('/api/history');
    return data.records || [];
  },

  getHistoryDetail: (id) => request(`/api/history/${id}`),

  submitNotes: (consultationId, notes) =>
    request('/api/notes/submit', {
      method: 'POST',
      body: JSON.stringify({ consultationId, ...notes }),
    }),

  checkNotes: (id) => request(`/api/notes/check/${id}`),
};

export default api;
