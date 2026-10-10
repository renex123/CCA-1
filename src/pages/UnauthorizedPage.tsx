import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-3xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-6 shadow-lg">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
        Access Restricted
      </h2>

      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
        Your current user role does not possess authorization to view this administrative resource. Access policies are enforced via institutional Row Level Security.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <Link to="/">
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Home
          </Button>
        </Link>
        <Link to="/dashboard/student">
          <Button size="sm" leftIcon={<Home className="w-4 h-4" />}>
            Student Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};
