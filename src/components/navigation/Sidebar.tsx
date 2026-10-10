import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  CalendarDays,
  QrCode,
  Bell,
  AlertCircle,
  FileCheck,
  MapPin,
  PartyPopper,
  Sparkles,
  Users,
  Building2,
  BarChart3,
  User,
  Settings,
  LogOut,
  GraduationCap,
  BookOpenCheck,
  X,
} from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onMobileClose }) => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const getDashboardPath = () => {
    if (role === 'admin') return '/dashboard/admin';
    if (role === 'faculty') return '/dashboard/faculty';
    return '/dashboard/student';
  };

  const navItems = [
    {
      label: 'Overview',
      path: getDashboardPath(),
      icon: LayoutDashboard,
      roles: ['student', 'faculty', 'admin'],
    },
    {
      label: 'Academics & Exams',
      path: '/assignments',
      icon: BookOpenCheck,
      roles: ['student', 'faculty', 'admin'],
    },
    {
      label: 'Timetable',
      path: '/timetable',
      icon: CalendarDays,
      roles: ['student', 'faculty', 'admin'],
    },
    {
      label: 'Attendance',
      path: '/attendance',
      icon: QrCode,
      roles: ['student', 'faculty', 'admin'],
    },
    {
      label: 'Announcements',
      path: '/announcements',
      icon: Bell,
      roles: ['student', 'faculty', 'admin'],
    },
    {
      label: 'Complaints',
      path: '/complaints',
      icon: AlertCircle,
      roles: ['student', 'faculty', 'admin'],
    },
    {
      label: 'Campus Services',
      path: '/services',
      icon: FileCheck,
      roles: ['student', 'faculty', 'admin'],
    },
    {
      label: 'Campus Map',
      path: '/map',
      icon: MapPin,
      roles: ['student', 'faculty', 'admin'],
    },
    {
      label: 'Campus Events',
      path: '/events',
      icon: PartyPopper,
      roles: ['student', 'faculty', 'admin'],
    },
    {
      label: 'CampusAI Assistant',
      path: '/ai',
      icon: Sparkles,
      roles: ['student', 'faculty', 'admin'],
      highlight: true,
    },
    // Admin Only
    {
      label: 'Students & Faculty',
      path: '/users',
      icon: Users,
      roles: ['admin'],
    },
    {
      label: 'Departments',
      path: '/departments',
      icon: Building2,
      roles: ['admin'],
    },
    {
      label: 'Analytics & Reports',
      path: '/analytics',
      icon: BarChart3,
      roles: ['admin'],
    },
    // Bottom group
    {
      label: 'Profile',
      path: '/profile',
      icon: User,
      roles: ['student', 'faculty', 'admin'],
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: Settings,
      roles: ['student', 'faculty', 'admin'],
    },
  ];

  const allowedItems = navItems.filter((item) => role && item.roles.includes(role));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={clsx(
          'fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100 dark:border-slate-800">
          <NavLink to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
                  Campus<span className="text-indigo-600 dark:text-indigo-400">One</span>
                </span>
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-sm">
                  Smart
                </span>
              </div>
              <p className="text-[10px] text-slate-400 -mt-0.5 font-medium">Digital University OS</p>
            </div>
          </NavLink>

          {onMobileClose && (
            <button
              onClick={onMobileClose}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Main Menu
          </div>

          {allowedItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onMobileClose}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group',
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100',
                    item.highlight && !isActive && 'text-indigo-600 dark:text-indigo-400'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={clsx(
                        'w-4 h-4 shrink-0 transition-colors',
                        isActive
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300',
                        item.highlight && 'text-indigo-500'
                      )}
                    />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.highlight && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-600 text-white shadow-xs">
                        AI
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* User Card & Logout Footer */}
        {user && (
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl bg-white dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <img
                src={
                  user.avatar_url ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                }
                alt={user.full_name}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {user.full_name}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                  {user.role}
                </p>
              </div>
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
