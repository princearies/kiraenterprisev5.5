/**
 * KiraEnterprise v5.5 - Common UI Components
 * 
 * Reusable components for loading, error, empty, and success states.
 */

import React from 'react';
import { AlertCircle, Loader2, Inbox, CheckCircle2, RefreshCw } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingState({ message = 'Loading...', size = 'md' }: LoadingStateProps) {
  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 32 : 24;
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <Loader2 className="text-emerald-500 animate-spin" size={iconSize} />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  details?: string;
}

export function ErrorState({ message, onRetry, details }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3 bg-red-50 border border-red-200 rounded-xl p-6">
      <AlertCircle className="text-red-500" size={24} />
      <p className="text-sm font-medium text-red-800">{message}</p>
      {details && <p className="text-xs text-red-600">{details}</p>}
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 mt-2 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <RefreshCw size={14} /> Retry
        </button>
      )}
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <Inbox className="text-gray-300" size={48} />
      <p className="text-sm font-medium text-gray-600">{title}</p>
      {description && <p className="text-xs text-gray-400 text-center max-w-sm">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-2 px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

interface SuccessBannerProps {
  message: string;
  onDismiss?: () => void;
}

export function SuccessBanner({ message, onDismiss }: SuccessBannerProps) {
  return (
    <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
      <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
      <p className="text-sm text-emerald-800 flex-1">{message}</p>
      {onDismiss && (
        <button onClick={onDismiss} className="text-emerald-600 hover:text-emerald-800 text-sm">✕</button>
      )}
    </div>
  );
}

interface DataCardProps {
  children: React.ReactNode;
  className?: string;
}

export function DataCard({ children, className = '' }: DataCardProps) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
