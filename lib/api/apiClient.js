// lib/api/apiClient.js - Centralized axios instance with global error interceptor
import axios from 'axios';
import { showNotification } from '@/components/Notification';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.';

    // Show error toast (without retry by default -- callers add retry if needed)
    showNotification(message, 'error');

    return Promise.reject(error);
  }
);

/**
 * Set or clear the default Authorization header for all requests.
 * @param {string|null} token - JWT token or null to clear
 */
export function setAuthHeader(token) {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
}

export default apiClient;
