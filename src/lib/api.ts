import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Don't log 401 errors during token refresh attempts
    if (error.response?.status !== 401 || originalRequest._retry) {
      console.error('API Error:', error.response?.status, error.config?.url, error.response?.data);
    }
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refresh_token');
      
      // If no refresh token, redirect to login immediately
      if (!refreshToken) {
        console.error('No refresh token available');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        
        // Show user-friendly message
        if (typeof window !== 'undefined') {
          alert('Your session has expired. Please log in again.');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
      
      try {
        const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });
        
        const newAccessToken = response.data.access;
        localStorage.setItem('access_token', newAccessToken);
        
        // Update the authorization header for the original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        
        // Retry the original request with the new token
        return api(originalRequest);
      } catch (err) {
        console.error('Token refresh failed:', err);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        
        // Show user-friendly message
        if (typeof window !== 'undefined') {
          alert('Your session has expired. Please log in again.');
          window.location.href = '/login';
        }
        return Promise.reject(err);
      }
    }
    
    return Promise.reject(error);
  }
);
