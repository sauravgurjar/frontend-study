import { axiosInstance } from './axios';
import { AuthResponse, LoginPayload, ProfileResponse, User } from '../types/auth';

interface GoogleAuthUrlResponse {
  success: boolean;
  authUrl: string;
}

interface GoogleCallbackPayload {
  code: string;
  redirectUri: string;
}

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', payload);
    return response.data;
  },

  getGoogleAuthUrl: async (): Promise<string> => {
    const response = await axiosInstance.get<GoogleAuthUrlResponse>('/auth/url');
    return response.data.authUrl;
  },

  completeGoogleSignIn: async (payload: GoogleCallbackPayload): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/callback', payload);
    return response.data;
  },

  fetchMe: async (): Promise<User> => {
    const response = await axiosInstance.get<User>('/auth/me');
    return response.data;
  },

  fetchProfile: async (userId: string): Promise<User> => {
    const response = await axiosInstance.get<ProfileResponse>(`/auth/profile/${userId}`);
    return response.data.data;
  }
};
