import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '../features/auth/authService';
import { useAuthStore } from '../store/authStore';
import { useToast } from '../components/common/ToastProvider';

const AuthCallback = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAuthData = useAuthStore((state) => state.setAuthData);
  const toast = useToast();

  useEffect(() => {
    const token = searchParams.get('token');
    const refreshToken = searchParams.get('refreshToken');
    const code = searchParams.get('code');

    const hydrateAuth = async () => {
      try {
        if (code) {
          const response = await authService.completeGoogleSignIn({
            code,
            redirectUri: `${window.location.origin}/auth/callback`
          });
          setAuthData({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            user: response.user
          });
        } else if (token && refreshToken) {
          const user = await authService.fetchMe();
          setAuthData({ accessToken: token, refreshToken, user });
        } else {
          throw new Error('Missing Google authorization code');
        }
      
        navigate('/dashboard');
      } catch (error) {
        toast.notify({ title: 'Login failed', description: 'Unable to finish authentication.', variant: 'error' });
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    hydrateAuth();
  }, [navigate, searchParams, setAuthData, toast]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-4 py-10">
      <div className="rounded-[36px] border border-slate-200 bg-white/95 p-10 text-center shadow-soft">
        <h1 className="text-2xl font-semibold text-slate-900">Finishing sign in...</h1>
        <p className="mt-3 text-sm text-slate-500">We&apos;re validating your credentials and redirecting you to the dashboard.</p>
        <div className="mt-8 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <span className="text-xl font-bold">{isLoading ? '…' : '✓'}</span>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
