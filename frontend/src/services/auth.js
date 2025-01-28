import api from './api';

export const authService = {
  signup: async (userData) => {
    try {
      const response = await api.post('/api/auth/signup', {
        email: userData.email,
        password: userData.password,
        full_name: userData.fullName,
        role: userData.userType
      });
      return response.data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/api/auth/login', {
        email: credentials.email,
        password: credentials.password
      });
      
      // Return the entire response data
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return null;
      }
      
      const response = await api.get('/api/auth/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
      throw error;
    }
  },
};
