import React from 'react';
import { Check, Clock, AlertCircle, XCircle, ShieldCheck } from 'lucide-react';
import { ApplicationStatus } from '../../types/application.types';

interface ApplicationTimelineProps {
  status: ApplicationStatus;
  hasConsent?: boolean;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const ApplicationTimeline: React.FC<ApplicationTimelineProps> = ({
  status,
  hasConsent = false,
  isVerified = false,
  createdAt,
  updatedAt
}) => {
  const steps = [
    {
      id: 'submitted',
      title: 'Application Submitted',
      desc: 'Citizen submitted form details to MahaSetu portal',
      state: 'completed'
    },
    {
      id: 'consent',
      title: 'Citizen DPDP Consent',
      desc: hasConsent
        ? 'Digital consent granted for department verification'
        : 'Pending digital consent authorization from citizen',
      state: hasConsent ? 'completed' : 'current'
    },
    {
      id: 'verification',
      title: 'Cross-Department Verification',
      desc:
        status === 'verified'
          ? 'Credentials matched across REST & SOAP department registries'
          : status === 'under_review'
          ? 'Querying department endpoints & calculating match score...'
          : 'Awaiting verification initiation',
      state: status === 'verified' ? 'completed' : status === 'under_review' ? 'current' : 'pending'
    },
    {
      id: 'final',
      title: status === 'rejected' ? 'Application Rejected' : 'Approved & Processed',
      desc:
        status === 'verified'
          ? 'Application approved with full digital certificate issuance'
          : status === 'rejected'
          ? 'Verification mismatch detected across department records'
          : 'Final departmental authorization pending',
      state: status === 'verified' ? 'completed' : status === 'rejected' ? 'failed' : 'pending'
    }
  ];

  return (
    <div className="py-4">
      <div className="relative">
        {/* Connecting Vertical Line */}
        <div className="absolute top-4 left-4 -ml-px h-[calc(100%-32px)] w-0.5 bg-slate-200" />

        <div className="space-y-6">
          {steps.map((step, index) => {
            const isCompleted = step.state === 'completed';
            const isCurrent = step.state === 'current';
            const isFailed = step.state === 'failed';

            return (
              <div key={step.id} className="relative flex items-start gap-4 group">
                {/* Step Circle Icon */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 z-10 transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : isCurrent
                      ? 'bg-saffron-600 text-white ring-4 ring-saffron-100 shadow-xs'
                      : isFailed
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-white text-slate-400 border-2 border-slate-300'
                  }`}
                >
                  {isCompleted ? (
                    <Check size={16} strokeWidth={3} />
                  ) : isCurrent ? (
                    <Clock size={16} className="animate-spin" />
                  ) : isFailed ? (
                    <XCircle size={16} />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                {/* Step Text Info */}
                <div className="flex-1 pt-0.5">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`text-xs sm:text-sm font-bold ${
                        isCompleted
                          ? 'text-slate-800'
                          : isCurrent
                          ? 'text-saffron-700'
                          : isFailed
                          ? 'text-rose-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.title}
                    </h4>
                    {isCurrent && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-saffron-100 text-saffron-800 rounded-full animate-pulse">
                        In Progress
                      </span>
                    )}
                    {isCompleted && (
                      <span className="text-[10px] font-semibold text-emerald-700">✓ Done</span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
