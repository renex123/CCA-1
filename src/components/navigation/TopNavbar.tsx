import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { RoleSwitcherPill } from './RoleSwitcherPill';
import { NotificationPopover } from './NotificationPopover';
import { GlobalSearchModal } from './GlobalSearchModal';
import {
  Menu,
  Sun,
  Moon,
  Search,
  ChevronRight,
  LogOut,
  User,
  Settings,
  Sparkles,
} from 'lucide-react';

interface TopNavbarProps {
  onMobileMenuToggle: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onMobileMenuToggle }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Generate page title and breadcrumbs from location pathname
  const pathParts = location.pathname.split('/').filter(Boolean);
  const pageTitleMap: Record<string, string> = {
    '': 'Dashboard',
    dashboard: 'Dashboard',
    student: 'Student Hub',
    faculty: 'Faculty Desk',
    admin: 'Administrator Command Center',
    timetable: 'Class Schedule & Timetable',
    attendance: 'Smart QR Attendance',
    assignments: 'Academics, Assignments & Exams',
    announcements: 'Campus Notices & Announcements',
    complaints: 'Complaint Management & SLA Tracking',
    services: 'Digital Campus Services & Certs',
    map: 'Interactive Campus Directory & Map',
    events: 'Campus Events & Hackathons',
    ai: 'CampusAI Knowledge Assistant',
    users: 'Student & Faculty Directory',
    departments: 'Department & Course Management',
    analytics: 'Institution Analytics & Reports',
    profile: 'User Profile & Academic Credentials',
    settings: 'System & Portal Settings',
  };

  const currentPageKey = pathParts[pathParts.length - 1] || 'dashboard';
  const pageTitle = pageTitleMap[currentPageKey] || 'Dashboard';

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6">
        {/* Left: Mobile hamburger + Page Title & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 rounded-xl"
            aria-label="Open mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <nav className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
              <Link to="/" className="hover:text-slate-600 dark:hover:text-slate-300">
                Home
              </Link>
              {pathParts.map((part, index) => (
                <React.Fragment key={part}>
                  <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" />
                  <span className="capitalize text-slate-600 dark:text-slate-300 font-medium">
                    {part}
                  </span>
                </React.Fragment>
              ))}
            </nav>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-tight">
              {pageTitle}
            </h1>
          </div>
        </div>

        {/* Right: Search, Role Switcher, Theme, Notifications, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Universal Search trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/70 dark:hover:bg-slate-700/60 rounded-xl transition-all cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">Search...</span>
            <kbd className="hidden lg:inline text-[10px] px-1.5 py-0.2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Role Switcher Pill for Judge Evaluation */}
          <div className="hidden sm:block">
            <RoleSwitcherPill />
          </div>

          {/* Campus AI Desk */}
          <Link
            to="/ai"
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <span>Campus AI Desk</span>
          </Link>

          {/* Notifications */}
          <NotificationPopover />

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Profile Dropdown */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <img
                  src={
                    user.avatar_url ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                  }
                  alt={user.full_name}
                  className="w-8 h-8 rounded-lg object-cover ring-2 ring-indigo-500/20"
                />
              </button>

              {isProfileMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 p-2 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {user.full_name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                        {user.role}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <User className="w-3.5 h-3.5" />
                        My Profile
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        Portal Settings
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          logout();
                          navigate('/login');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
