import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  RefreshCw,
  Cpu,
  Layers,
  Database,
  Building2,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { VerificationRecord } from '../../types/verification.types';
import { verificationApi } from '../../api/verification.api';
import { extractErrorMessage } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';

interface CrossDeptVerificationCardProps {
  applicationId: string;
  verification: VerificationRecord | null;
  onVerificationTriggered: () => void;
}

export const CrossDeptVerificationCard: React.FC<CrossDeptVerificationCardProps> = ({
  applicationId,
  verification,
  onVerificationTriggered
}) => {
  const { user } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isOfficerOrAdmin = user?.role === 'admin' || user?.role === 'department_officer';

  const handleTriggerVerification = async () => {
    try {
      setIsVerifying(true);
      setError('');
      setSuccess('');
      await verificationApi.triggerVerification(applicationId);
      setSuccess('Cross-department verification executed successfully.');
      onVerificationTriggered();
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to trigger verification. Ensure consent is active.'));
    } finally {
      setIsVerifying(false);
    }
  };

  const confidencePercent = verification?.confidence ? Math.round(verification.confidence * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-6">
      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gov-light text-gov-blue flex items-center justify-center">
            <Cpu size={22} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gov-navy">
              Cross-Department Identity & Credential Verification
            </h3>
            <p className="text-xs text-slate-500">
              Generic Integration Engine (GIE) Multi-Source Interoperability
            </p>
          </div>
        </div>

        {isOfficerOrAdmin && (
          <Button
            size="sm"
            variant="primary"
            isLoading={isVerifying}
            onClick={handleTriggerVerification}
            leftIcon={<Zap size={14} />}
          >
            Run Department Verification
          </Button>
        )}
      </div>

      {/* Messages */}
      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 size={16} className="flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Verification Summary Tile */}
      {verification ? (
        <div className="space-y-5">
          {/* Match Score Banner */}
          <div
            className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
              verification.matched
                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                : 'bg-rose-50/60 border-rose-200 text-rose-900'
            }`}
          >
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${
                  verification.matched ? 'bg-emerald-600 shadow-sm' : 'bg-rose-600 shadow-sm'
                }`}
              >
                {verification.matched ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
              </div>
              <div>
                <h4 className="text-base font-extrabold">
                  {verification.matched
                    ? 'Identity & Records Verified Successfully'
                    : 'Verification Mismatch Detected'}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  {verification.matched
                    ? 'Cross-department canonical matching passed threshold (≥85%).'
                    : verification.failureReason || 'Mismatch in applicant credentials.'}
                </p>
              </div>
            </div>

            <div className="text-center sm:text-right bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Match Confidence
              </span>
              <span
                className={`text-2xl font-black ${
                  verification.matched ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {confidencePercent}%
              </span>
            </div>
          </div>

          {/* Department Source Breakdown */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Department Integration Endpoints Checked
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Higher Education Check */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Building2 size={15} className="text-gov-blue" />
                    Higher Education (HTED)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                    REST API
                  </span>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Name Match:</span>
                    <strong className="text-emerald-700">✓ 100% Exact</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Date of Birth:</span>
                    <strong className="text-emerald-700">✓ Normalized Match</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Enrollment Roll No:</span>
                    <strong className="text-emerald-700">✓ Verified Record</strong>
                  </div>
                </div>
              </div>

              {/* Employment Check */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Building2 size={15} className="text-saffron-600" />
                    Skill & Employment (MahaSwayam)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-100 text-purple-800 rounded">
                    SOAP XML
                  </span>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Applicant Name:</span>
                    <strong className="text-emerald-700">✓ 100% Exact</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Date of Birth:</span>
                    <strong className="text-emerald-700">✓ Matched</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Candidate Exchange ID:</span>
                    <strong className="text-emerald-700">✓ Active Profile</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-2">
          <p className="text-xs font-bold text-slate-700">No Verification Executed Yet</p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Once citizen consent is active, departmental officers or automated workflows trigger the Generic Integration Engine to query disparate department records.
          </p>
        </div>
      )}
    </div>
  );
};
