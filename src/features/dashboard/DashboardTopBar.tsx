import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Bell, Bookmark, CalendarDays, LogOut, Mail, Menu, UserRound } from 'lucide-react';
import { User } from '../../types/auth';

const formatDate = (date?: string) => {
  if (!date) return 'Not available';

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(date));
};

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Daily CA', path: '/dashboard/daily-ca' },
  { label: 'Editorials', path: '/dashboard/editorials' },
  { label: 'PIB', path: '/dashboard/pib' }
] as const;

interface DashboardTopBarProps {
  profile: User | null;
  isMenuOpen: boolean;
  isProfileLoading: boolean;
  onMenuToggle: () => void;
  onMenuClose: () => void;
  onResourceDrawerOpen: () => void;
  onLogout: () => void;
}

export const DashboardTopBar = ({
  profile,
  isMenuOpen,
  isProfileLoading,
  onMenuToggle,
  onMenuClose,
  onResourceDrawerOpen,
  onLogout
}: DashboardTopBarProps) => {
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const displayName = profile?.name || 'User';
  const profilePicture = profile?.profilePicture || profile?.avatar;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!profileMenuRef.current?.contains(event.target as Node)) {
        onMenuClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onMenuClose]);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-12">
        {/* Left: menu + brand + nav */}
        <div className="flex min-w-0 flex-1 items-center gap-4 lg:gap-8">
          <button
            type="button"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 md:hidden"
            onClick={onResourceDrawerOpen}
            aria-label="Open Resource Hub"
          >
            <Menu className="h-5 w-5" />
          </button>

          <h1 className="shrink-0 truncate text-xl font-bold tracking-tight text-black sm:text-2xl">
            CivilServe AI
          </h1>

          <nav
            className="hidden min-w-0 flex-1 items-center gap-1 overflow-x-auto text-sm font-medium text-slate-600 [scrollbar-width:none] md:flex [&::-webkit-scrollbar]:hidden"
            aria-label="Primary"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                className={({ isActive }) =>
                  `shrink-0 whitespace-nowrap rounded-lg px-3 py-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
                    isActive
                      ? 'font-bold text-blue-600'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right: actions + profile */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="hidden h-9 w-9 items-center justify-center rounded-full text-slate-950 transition hover:bg-slate-100 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 sm:inline-flex"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="hidden h-9 w-9 items-center justify-center rounded-full text-slate-950 transition hover:bg-slate-100 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 sm:inline-flex"
            aria-label="Bookmarks"
          >
            <Bookmark className="h-5 w-5" />
          </button>

          <div className="relative" ref={profileMenuRef}>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2"
              onClick={onMenuToggle}
              aria-expanded={isMenuOpen}
              aria-haspopup="true"
              aria-label="Open profile menu"
            >
              {profilePicture ? (
                <img src={profilePicture} alt={displayName} className="h-8 w-8 rounded-full object-cover" />
              ) : (
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <UserRound className="h-4 w-4" />
                </span>
              )}
            </button>

            {isMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-12 z-40 w-[min(280px,calc(100vw-2rem))] rounded-2xl border border-slate-200 bg-white p-4 shadow-soft"
              >
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  {profilePicture ? (
                    <img src={profilePicture} alt={displayName} className="h-12 w-12 shrink-0 rounded-full object-cover" />
                  ) : (
                    <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <UserRound className="h-6 w-6" />
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-950">{displayName}</p>
                    <p className="text-xs text-slate-500">{isProfileLoading ? 'Loading profile...' : 'Signed in'}</p>
                  </div>
                </div>

                <div className="space-y-3 py-4 text-sm text-slate-600">
                  <p className="flex items-center gap-3">
                    <Mail className="h-4 w-4 shrink-0 text-blue-600" />
                    <span className="truncate">{profile?.email || 'No email'}</span>
                  </p>
                  <p className="flex items-center gap-3">
                    <CalendarDays className="h-4 w-4 shrink-0 text-blue-600" />
                    <span>Joined {formatDate(profile?.createdAt)}</span>
                  </p>
                </div>

                <button
                  type="button"
                  role="menuitem"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40"
                  onClick={onLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
