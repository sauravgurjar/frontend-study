import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { AuthResponse } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = useAuthStore.getState().refreshToken;

    if (error.response?.status === 401 && refreshToken && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axiosInstance.post<AuthResponse>('/auth/refresh', { refreshToken });
        useAuthStore.getState().setAuthData({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          user: response.data.user
        });
        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().clearAuth();
      }
    }

    return Promise.reject(error);
  }
);
