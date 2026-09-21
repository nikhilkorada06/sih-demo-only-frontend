import React, { ReactNode } from 'react';
import { FolderOpen, Plus } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center bg-white border border-slate-200/80 rounded-2xl shadow-sm ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-gov-light text-gov-blue flex items-center justify-center mb-4 shadow-sm">
        {icon || <FolderOpen size={28} />}
      </div>
      <h3 className="text-base font-bold text-gov-navy mb-1.5">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mb-5 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button size="sm" variant="primary" onClick={onAction} leftIcon={<Plus size={16} />}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
