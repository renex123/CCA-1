import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive' | 'ghost' | 'success' | 'brand' | 'brandOutline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  pill?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  pill = false,
  isLoading = false,
  disabled,
  leftIcon,
  rightIcon,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer';

  const variantStyles = {
    primary:
      'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow focus:ring-indigo-500 dark:bg-indigo-600 dark:hover:bg-indigo-500',
    secondary:
      'bg-slate-100 hover:bg-slate-200 text-slate-900 focus:ring-slate-400 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100',
    outline:
      'border border-slate-300 hover:bg-slate-50 text-slate-700 focus:ring-indigo-500 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800',
    destructive:
      'bg-red-600 hover:bg-red-700 text-white shadow-sm focus:ring-red-500 dark:bg-red-600 dark:hover:bg-red-500',
    ghost:
      'text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-400 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100',
    success:
      'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm focus:ring-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500',
    brand:
      'bg-[#652b7c] hover:bg-[#522165] text-white shadow-md shadow-[#652b7c]/20 hover:shadow-lg hover:shadow-[#652b7c]/30 focus:ring-[#652b7c]',
    brandOutline:
      'border-2 border-[#652b7c] hover:bg-[#652b7c] hover:text-white text-[#652b7c] focus:ring-[#652b7c] dark:border-[#c27de2] dark:text-[#c27de2] dark:hover:bg-[#652b7c] dark:hover:text-white',
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
    icon: 'p-2 aspect-square',
  };

  return (
    <button
      className={twMerge(
        clsx(baseStyles, variantStyles[variant], sizeStyles[size], pill && 'rounded-full px-6 tracking-wide shadow-sm', className)
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
