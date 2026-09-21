import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Service Temporarily Unavailable',
  message = 'We encountered an error while loading government service information. Please check your connection and try again.',
  onRetry,
  className = ''
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center bg-rose-50/40 border border-rose-200 rounded-2xl ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
        <AlertTriangle size={24} />
      </div>
      <h3 className="text-sm font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-xs text-slate-600 max-w-md mb-4">{message}</p>
      {onRetry && (
        <Button size="sm" variant="outline" onClick={onRetry} leftIcon={<RefreshCw size={14} />}>
          Try Again
        </Button>
      )}
    </div>
  );
};
