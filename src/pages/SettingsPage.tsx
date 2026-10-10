import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { isSupabaseConfigured } from '../services/supabase';
import { db } from '../services/dbStore';
import {
  Settings,
  Sun,
  Moon,
  Database,
  ShieldCheck,
  RotateCcw,
  Bell,
  CheckCircle2,
  Cpu,
  Lock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const SettingsPage: React.FC = () => {
  const { user, quickSwitchRole } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleResetData = () => {
    if (window.confirm('Reset all demo state to fresh default dataset? This will restore sample complaints, timetable, and attendance.')) {
      db.resetAllData();
      alert('Database state restored to factory default.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Portal & System Settings
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Interface customization • Database telemetry • Demo state controls
        </p>
      </div>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance & Theme Mode</CardTitle>
          <Badge variant="outline" size="sm">Active: {theme.toUpperCase()}</Badge>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Display Interface Theme
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Toggle between modern SaaS light mode and high-contrast dark mode.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            leftIcon={theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-600" />}
          >
            Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
          </Button>
        </CardContent>
      </Card>

      {/* Database & Architecture Telemetry */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-600" />
            Backend & Database Engine Status
          </CardTitle>
          <Badge variant={isSupabaseConfigured ? 'success' : 'primary'} size="sm">
            {isSupabaseConfigured ? 'Supabase PostgreSQL Connected' : 'Reactive Store Mode (Active)'}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-3 text-xs leading-relaxed">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="font-bold text-slate-900 dark:text-slate-100">
                Dual-Mode Architecture Active:
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              CampusOne incorporates an intelligent dual-mode database engine. When Supabase environment variables (<code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded">VITE_SUPABASE_URL</code> & <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded">VITE_SUPABASE_ANON_KEY</code>) are detected, it connects seamlessly to live PostgreSQL. When running in standalone demo mode, it runs an in-browser reactive store with full localStorage persistence, conflict checks, and audit logging.
            </p>
            <p className="text-slate-500 text-[11px]">
              Full PostgreSQL migration scripts are included in <code className="font-mono">supabase/migrations/20261010_init_campusone.sql</code> and sample seeds in <code className="font-mono">supabase/seed.sql</code>.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Demo Controls for Judges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-amber-500" />
            Hackathon Demonstration Controls
          </CardTitle>
          <Badge variant="warning" size="sm">Demo Mode</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/60 rounded-xl text-xs">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100">
                Restore Clean Sample Dataset
              </h4>
              <p className="text-slate-500 mt-0.5">
                Clears any custom test tickets or timetable changes and restores the official hackathon demonstration dataset.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetData}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Reset Data
            </Button>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-2">
              Quick Role Switcher for Hackathon Judges:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => quickSwitchRole('student')}
              >
                Aarav Sharma (Student)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => quickSwitchRole('faculty')}
              >
                Dr. Priya Sengupta (Faculty)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => quickSwitchRole('admin')}
              >
                Dr. Rajesh Verma (Admin)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
