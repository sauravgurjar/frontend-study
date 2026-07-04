import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { authService } from './authService';
import { useAuthStore } from '../../store/authStore';
import { Input } from '../../components/common/Input';
import { Checkbox } from '../../components/common/Checkbox';
import { Button } from '../../components/common/Button';
import { GoogleButton } from './GoogleButton';
import { useToast } from '../../components/common/ToastProvider';
import { LoginPayload } from '../../types/auth';

interface LoginFormValues {
  username: string;
  password: string;
  remember: boolean;
}

export const Login = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const setAuthData = useAuthStore((state) => state.setAuthData);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormValues>({ defaultValues: { username: '', password: '', remember: true } });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    const payload: LoginPayload = {
      username: data.username,
      password: data.password
    };

    try {
      const response = await authService.login(payload);
      setAuthData({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        user: response.user
      });
      toast.notify({ title: 'Welcome back', description: 'Signed in successfully.', variant: 'success' });
      navigate('/dashboard');
    } catch (error) {
      toast.notify({ title: 'Authentication failed', description: 'Please check your credentials.', variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] space-y-4 rounded-3xl border border-white/80 bg-white/90 p-5 shadow-soft backdrop-blur-xl sm:p-6">
      <div className="space-y-1.5">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Secure Login</p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Welcome back</h1>
        <p className="text-sm leading-5 text-slate-600">Sign in to manage prompts and continue your workspace.</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Username" placeholder="Enter your username" className="rounded-xl py-2.5" {...register('username', { required: 'Username is required' })} error={errors.username?.message} />
        <Input label="Password" type="password" placeholder="Enter your password" className="rounded-xl py-2.5" {...register('password', { required: 'Password is required' })} error={errors.password?.message} />

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Checkbox label="Remember me" {...register('remember')} />
          <button type="button" className="text-sm font-semibold text-primary transition hover:text-secondary">Forgot password?</button>
        </div>

        <Button type="submit" className="w-full rounded-xl py-2.5" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Login'}
        </Button>
      </form>

      <div className="flex items-center gap-3 text-xs text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        <span>or continue with</span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <GoogleButton />
    </div>
  );
};
