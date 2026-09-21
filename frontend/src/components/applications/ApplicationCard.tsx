import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Building2,
  Briefcase,
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Application } from '../../types/application.types';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';

interface ApplicationCardProps {
  application: Application;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({ application }) => {
  const navigate = useNavigate();

  const formattedDate = new Date(application.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div
      onClick={() => navigate(`/applications/${application._id}`)}
      className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-gov-hover hover:border-gov-blue/40 transition-all duration-200 p-5 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Top bar with ID & Status */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Application ID
            </span>
            <span className="text-xs font-mono font-bold text-gov-navy">
              {application.applicationNumber}
            </span>
          </div>

          <StatusBadge status={application.status} size="sm" />
        </div>

        {/* Main Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-slate-700">
            <Building2 size={15} className="text-slate-400 flex-shrink-0" />
            <span className="font-semibold text-slate-800">{application.department}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Briefcase size={15} className="text-slate-400 flex-shrink-0" />
            <span>Position / Scheme: <strong>{application.position}</strong></span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar size={15} className="text-slate-400 flex-shrink-0" />
            <span>Submitted on: {formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Footer link */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-gov-blue group-hover:text-saffron-600 transition-colors">
        <span>View Details & Verification →</span>
        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};
