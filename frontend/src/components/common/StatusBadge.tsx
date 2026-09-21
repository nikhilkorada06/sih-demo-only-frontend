import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  FileCheck,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { ApplicationStatus } from '../../types/application.types';
import { ConsentStatus } from '../../types/consent.types';

export interface StatusBadgeProps {
  status: ApplicationStatus | ConsentStatus | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  className = ''
}) => {
  const normalized = status?.toLowerCase();

  const configMap: Record<
    string,
    { label: string; labelMr: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    // Application Statuses
    submitted: {
      label: 'Submitted',
      labelMr: 'सादर केले',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      icon: <Clock size={14} />
    },
    under_review: {
      label: 'Under Review',
      labelMr: 'पडताळणी चालू',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      icon: <Clock size={14} className="animate-spin" />
    },
    verified: {
      label: 'Verified & Approved',
      labelMr: 'पडताळणी पूर्ण व मंजूर',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      icon: <CheckCircle2 size={14} />
    },
    rejected: {
      label: 'Rejected',
      labelMr: 'नाकारले',
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      icon: <XCircle size={14} />
    },
    withdrawn: {
      label: 'Withdrawn',
      labelMr: 'मागे घेतले',
      bg: 'bg-slate-100',
      text: 'text-slate-600',
      border: 'border-slate-200',
      icon: <AlertCircle size={14} />
    },
    // Consent Statuses
    active: {
      label: 'Consent Active',
      labelMr: 'संमती सक्रिय',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      icon: <ShieldCheck size={14} />
    },
    revoked: {
      label: 'Consent Revoked',
      labelMr: 'संमती रद्द',
      bg: 'bg-slate-100',
      text: 'text-slate-600',
      border: 'border-slate-300',
      icon: <ShieldAlert size={14} />
    },
    expired: {
      label: 'Consent Expired',
      labelMr: 'संमती मुदत संपली',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      icon: <AlertCircle size={14} />
    }
  };

  const config = configMap[normalized] || {
    label: status.replace(/_/g, ' '),
    labelMr: status,
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
    icon: <FileCheck size={14} />
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeStyles[size]} ${className}`}
    >
      {showIcon && <span className="flex-shrink-0">{config.icon}</span>}
      <span className="capitalize tracking-wide">{config.label}</span>
    </span>
  );
};
