import { authService as apiAuthService } from '../../api/auth';
import { LoginPayload, AuthResponse, User } from '../../types/auth';

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => apiAuthService.login(payload),
  getGoogleAuthUrl: async (): Promise<string> => apiAuthService.getGoogleAuthUrl(),
  completeGoogleSignIn: async (payload: { code: string; redirectUri: string }): Promise<AuthResponse> => apiAuthService.completeGoogleSignIn(payload),
  fetchMe: async (): Promise<User> => apiAuthService.fetchMe(),
  fetchProfile: async (userId: string): Promise<User> => apiAuthService.fetchProfile(userId)
};
