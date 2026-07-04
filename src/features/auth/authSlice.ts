import { AuthState, User } from '../../types/auth';

export const authInitialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false
};

export interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  user: User;
}
