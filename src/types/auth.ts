export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  profilePicture?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface ProfileResponse {
  success: boolean;
  data: User;
}
