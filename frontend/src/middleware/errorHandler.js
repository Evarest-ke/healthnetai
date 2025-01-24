import { toast } from 'react-toastify';

export const handleApiError = (error) => {
  const message = error.response?.data?.message || 'An error occurred';
  toast.error(message);
  return Promise.reject(error);
};

// Update api.js to use error handler
api.interceptors.response.use(
  (response) => response,
  (error) => handleApiError(error)
);
