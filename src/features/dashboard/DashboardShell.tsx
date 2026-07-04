import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../auth/authService';
import { useAuthStore } from '../../store/authStore';
import { User } from '../../types/auth';
import { DashboardTopBar } from './DashboardTopBar';
import { ResourceSidebar } from './ResourceSidebar';
import { resourceNavItems } from './dashboardContent';

interface DashboardShellProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export const DashboardShell = ({ children, showSidebar = true }: DashboardShellProps) => {
  const navigate = useNavigate();
  const storedUser = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [profile, setProfile] = useState<User | null>(storedUser);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isResourceDrawerOpen, setIsResourceDrawerOpen] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  useEffect(() => {
    if (!storedUser?.id) return;

    const loadProfile = async () => {
      setIsProfileLoading(true);
      try {
        const response = await authService.fetchProfile(storedUser.id);
        setProfile(response);
      } catch (error) {
        setProfile(storedUser);
      } finally {
        setIsProfileLoading(false);
      }
    };

    loadProfile();
  }, [storedUser]);

  const handleLogout = () => {
    clearAuth();
    navigate('/', { replace: true });
  };

  const handleMenuClose = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-[#E6E8EA] text-slate-950">
      <DashboardTopBar
        profile={profile}
        isMenuOpen={isMenuOpen}
        isProfileLoading={isProfileLoading}
        onMenuToggle={() => setIsMenuOpen((value) => !value)}
        onMenuClose={handleMenuClose}
        onResourceDrawerOpen={() => {
          if (showSidebar) setIsResourceDrawerOpen(true);
        }}
        onLogout={handleLogout}
      />
      <div className="flex">
        {showSidebar && (
          <ResourceSidebar
            items={resourceNavItems}
            isOpen={isResourceDrawerOpen}
            onClose={() => setIsResourceDrawerOpen(false)}
          />
        )}
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
};
