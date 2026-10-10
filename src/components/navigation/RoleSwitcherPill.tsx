import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { GraduationCap, Briefcase, ShieldCheck } from 'lucide-react';
import { clsx } from 'clsx';

export const RoleSwitcherPill: React.FC = () => {
  const { role, quickSwitchRole } = useAuth();

  const roles: { id: UserRole; label: string; icon: React.ReactNode; userLabel: string }[] = [
    {
      id: 'student',
      label: 'Student',
      icon: <GraduationCap className="w-3.5 h-3.5" />,
      userLabel: 'Aarav (CSE 3rd Yr)',
    },
    {
      id: 'faculty',
      label: 'Faculty',
      icon: <Briefcase className="w-3.5 h-3.5" />,
      userLabel: 'Dr. Priya Sengupta',
    },
    {
      id: 'admin',
      label: 'Admin',
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
      userLabel: 'Dr. Rajesh Verma (Dean)',
    },
  ];

  return (
    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
      <span className="text-[10px] uppercase font-bold tracking-wider px-2 text-slate-600 dark:text-slate-400 hidden xl:inline">
        Role Switcher:
      </span>
      {roles.map((r) => {
        const isActive = role === r.id;
        return (
          <button
            key={r.id}
            onClick={() => quickSwitchRole(r.id)}
            title={`Switch to ${r.label} mode (${r.userLabel})`}
            className={clsx(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer',
              isActive
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            )}
          >
            {r.icon}
            <span>{r.label}</span>
          </button>
        );
      })}
    </div>
  );
};
