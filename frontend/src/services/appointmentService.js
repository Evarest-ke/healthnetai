import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const appointmentService = {
  // Get all appointments for the logged-in doctor
  getAllAppointments: async (filters = {}) => {
    try {
      const response = await axios.get(`${API_URL}/appointments`, { 
        params: filters,
        withCredentials: true 
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get single appointment details
  getAppointment: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/appointments/${id}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Create new appointment
  createAppointment: async (appointmentData) => {
    try {
      const response = await axios.post(`${API_URL}/appointments`, appointmentData, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Update appointment
  updateAppointment: async (id, appointmentData) => {
    try {
      const response = await axios.put(`${API_URL}/appointments/${id}`, appointmentData, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Delete appointment
  deleteAppointment: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/appointments/${id}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Search patients for appointment creation
  searchPatients: async (query) => {
    try {
      const response = await axios.get(`${API_URL}/patients/search`, {
        params: { q: query },
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

// Error handling helper
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    const message = error.response.data.message || 'An error occurred';
    throw new Error(message);
  } else if (error.request) {
    // Request made but no response
    throw new Error('Unable to connect to server');
  } else {
    // Other errors
    throw new Error('An unexpected error occurred');
  }
}; 