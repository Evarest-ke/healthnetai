import api from './api';

export const networkService = {
  getMetrics: async () => {
    const response = await api.get('/api/network/metrics');
    return response.data;
  },

  getAlerts: async () => {
    const response = await api.get('/api/network/alerts');
    return response.data;
  },

  updateSettings: async (settings) => {
    const response = await api.put('/api/network/settings', settings);
    return response.data;
  }
};

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    return user;
  },

  logout: () => {
    localStorage.removeItem('token');
  }
};
