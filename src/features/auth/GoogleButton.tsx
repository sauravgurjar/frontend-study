import { ArrowRight } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { useToast } from '../../components/common/ToastProvider';
import { authService } from './authService';

export const GoogleButton = () => {
  const toast = useToast();

  const handleGoogle = async () => {
    try {
      const url = new URL(await authService.getGoogleAuthUrl());
      url.searchParams.set('redirect_uri', `${window.location.origin}/auth/callback`);
      window.location.href = url.toString();
    } catch (error) {
      toast.notify({
        title: 'Google login failed',
        description: 'Unable to connect to authentication service.',
        variant: 'error'
      });
    }
  };

  return (
    <Button type="button" variant="secondary" className="w-full gap-2 rounded-xl py-2.5 text-slate-700" onClick={handleGoogle}>
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-slate-100 text-primary">
        <ArrowRight className="h-4 w-4" />
      </span>
      Continue with Google
    </Button>
  );
};
