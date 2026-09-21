import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Lock
} from 'lucide-react';
import { Consent, ConsentDataCategory } from '../../types/consent.types';
import { consentApi } from '../../api/consent.api';
import { extractErrorMessage } from '../../api/client';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/StatusBadge';

interface ConsentManagerCardProps {
  applicationId: string;
  consent: Consent | null;
  onConsentChange: (updatedConsent: Consent | null) => void;
}

export const ConsentManagerCard: React.FC<ConsentManagerCardProps> = ({
  applicationId,
  consent,
  onConsentChange
}) => {
  const [selectedCategories, setSelectedCategories] = useState<ConsentDataCategory[]>([
    'education',
    'employment'
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const toggleCategory = (cat: ConsentDataCategory) => {
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length === 1) return; // At least one required
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleGrantConsent = async () => {
    try {
      setIsProcessing(true);
      setError('');
      setSuccessMessage('');
      const newConsent = await consentApi.grantConsent({
        applicationId,
        dataCategories: selectedCategories
      });
      setSuccessMessage('Digital consent granted successfully in compliance with DPDP Act 2023.');
      onConsentChange(newConsent);
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to grant consent.'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRevokeConsent = async () => {
    try {
      setIsProcessing(true);
      setError('');
      setSuccessMessage('');
      const updated = await consentApi.revokeConsent(applicationId);
      setSuccessMessage('Consent has been revoked. Department access is immediately suspended.');
      onConsentChange(updated);
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to revoke consent.'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-5">
      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gov-navy">
              Digital Personal Data Protection (DPDP) Consent
            </h3>
            <p className="text-xs text-slate-500">
              Control departmental access to your educational and employment records
            </p>
          </div>
        </div>

        {consent ? (
          <StatusBadge status={consent.status} size="md" />
        ) : (
          <span className="px-3 py-1 bg-amber-50 text-amber-800 font-bold text-xs rounded-full border border-amber-200">
            Pending Consent
          </span>
        )}
      </div>

      {/* Messages */}
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
          <AlertTriangle size={16} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 size={16} className="flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* When Consent is Active */}
      {consent && consent.status === 'active' && (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>Active Authorization</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              MahaSetu is authorized to verify your records against participating department systems for categories:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {consent.dataCategories.map((cat) => (
                <span
                  key={cat}
                  className="px-2.5 py-1 bg-white text-emerald-800 border border-emerald-300 rounded-md text-xs font-semibold capitalize shadow-2xs"
                >
                  ✓ {cat} records
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-[11.5px] text-slate-500">
              You can revoke this consent at any time. Revocation will halt active departmental queries.
            </p>
            <Button
              size="sm"
              variant="danger"
              isLoading={isProcessing}
              onClick={handleRevokeConsent}
            >
              Revoke Consent
            </Button>
          </div>
        </div>
      )}

      {/* When Consent is Revoked or Expired */}
      {consent && (consent.status === 'revoked' || consent.status === 'expired') && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <ShieldAlert size={16} className="text-slate-500" />
            <span>Consent is {consent.status.toUpperCase()}</span>
          </div>
          <p className="text-xs text-slate-600">
            {consent.status === 'revoked'
              ? 'You have explicitly revoked access for this application. Department verification cannot proceed without fresh consent.'
              : 'The validity period for this consent has expired in accordance with DPDP regulations.'}
          </p>
        </div>
      )}

      {/* When Consent has not yet been granted */}
      {!consent && (
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Please select the specific data categories you authorize MahaSetu to verify with Maharashtra Government departments:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label
              onClick={() => toggleCategory('education')}
              className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                selectedCategories.includes('education')
                  ? 'border-gov-blue bg-gov-light/30 text-gov-navy'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes('education')}
                onChange={() => {}}
                className="mt-0.5 rounded text-gov-blue focus:ring-gov-blue"
              />
              <div>
                <p className="text-xs font-bold">Higher Education Credentials</p>
                <p className="text-[11px] text-slate-500">
                  Degree marks, enrollment ID, and university graduation records.
                </p>
              </div>
            </label>

            <label
              onClick={() => toggleCategory('employment')}
              className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                selectedCategories.includes('employment')
                  ? 'border-gov-blue bg-gov-light/30 text-gov-navy'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes('employment')}
                onChange={() => {}}
                className="mt-0.5 rounded text-gov-blue focus:ring-gov-blue"
              />
              <div>
                <p className="text-xs font-bold">Employment Exchange Records</p>
                <p className="text-[11px] text-slate-500">
                  MahaSwayam registration status, experience, and trade certificate.
                </p>
              </div>
            </label>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              size="md"
              variant="primary"
              isLoading={isProcessing}
              onClick={handleGrantConsent}
              leftIcon={<ShieldCheck size={16} />}
            >
              Grant Digital Consent (DPDP 2023)
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
