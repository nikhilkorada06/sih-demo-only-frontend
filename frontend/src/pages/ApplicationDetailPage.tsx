import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Building2,
  Briefcase,
  FileText,
  Printer,
  Download,
  AlertCircle,
  Clock,
  ShieldCheck,
  LifeBuoy,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  Hash,
  Share2
} from 'lucide-react';
import { Application } from '../types/application.types';
import { Consent } from '../types/consent.types';
import { VerificationRecord } from '../types/verification.types';
import { applicationsApi } from '../api/applications.api';
import { consentApi } from '../api/consent.api';
import { verificationApi } from '../api/verification.api';
import { extractErrorMessage } from '../api/client';
import { StatusBadge } from '../components/common/StatusBadge';
import { Button } from '../components/common/Button';
import { Skeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';
import { ApplicationTimeline } from '../components/applications/ApplicationTimeline';
import { ConsentManagerCard } from '../components/applications/ConsentManagerCard';
import { CrossDeptVerificationCard } from '../components/verification/CrossDeptVerificationCard';
import { useAuth } from '../context/AuthContext';
import { DocumentUploadCard } from '../components/applications/DocumentUploadCard';

export const ApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [application, setApplication] = useState<Application | null>(null);
  const [consent, setConsent] = useState<Consent | null>(null);
  const [verification, setVerification] = useState<VerificationRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [shareNotification, setShareNotification] = useState('');

  const loadData = useCallback(async (showRefreshing = false) => {
    if (!id) return;
    if (showRefreshing) setIsRefreshing(true);
    else setLoading(true);
    setError('');

    try {
      // 1. Fetch application
      const appData = await applicationsApi.getApplicationById(id);
      setApplication(appData);

      // 2. Fetch consent
      try {
        const consentData = await consentApi.getConsentByApplicationId(id);
        setConsent(consentData);
      } catch {
        setConsent(null);
      }

      // 3. Fetch verification record
      try {
        const verifData = await verificationApi.getVerification(id);
        setVerification(verifData?.verification || null);
      } catch {
        setVerification(null);
      }
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to load application details.'));
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShareNotification('Link copied to clipboard!');
      setTimeout(() => setShareNotification(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gov-surface py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-portal mx-auto space-y-6">
          <Skeleton height="32px" width="200px" />
          <Skeleton height="160px" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton height="240px" />
              <Skeleton height="200px" />
            </div>
            <div className="space-y-6">
              <Skeleton height="200px" />
              <Skeleton height="180px" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-gov-surface py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <ErrorState
            title="Application Not Found"
            message={error || 'Unable to find the specified application. It may have been removed or you may not have authorization to view it.'}
            onRetry={() => loadData()}
          />
          <div className="mt-6 text-center">
            <Button variant="outline" onClick={() => navigate('/applications')}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to My Applications
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gov-surface py-8 px-4 sm:px-6 lg:px-8 print:bg-white print:py-2">
      <div className="max-w-portal mx-auto space-y-6">
        {/* Navigation & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-gov-textSecondary">
            <Link to="/dashboard" className="hover:text-gov-blue">Dashboard</Link>
            <span>/</span>
            <Link to="/applications" className="hover:text-gov-blue">Applications</Link>
            <span>/</span>
            <span className="text-gov-blue font-semibold">{application.applicationNumber}</span>
          </nav>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadData(true)}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Status'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-3.5 h-3.5 mr-1.5" />
              Share
            </Button>
            <Button variant="primary" size="sm" onClick={handlePrint}>
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Print Receipt
            </Button>
          </div>
        </div>

        {shareNotification && (
          <div className="bg-green-50 border border-green-200 text-green-800 text-xs px-4 py-2.5 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            {shareNotification}
          </div>
        )}

        {/* Application Header Card */}
        <div className="bg-white rounded-xl border border-gov-border shadow-portal p-6 sm:p-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gov-border">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono font-bold text-xl sm:text-2xl text-gov-dark">
                  {application.applicationNumber}
                </span>
                <StatusBadge status={application.status} size="md" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gov-textPrimary">
                {application.position}
              </h1>
              <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs sm:text-sm text-gov-textSecondary">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-gov-blue" />
                  {application.department}
                </span>
                <span className="flex items-center gap-1.5 font-mono">
                  <Hash className="w-4 h-4 text-slate-400" />
                  Job ID: {application.jobId}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Submitted: {new Date(application.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>

            {/* SLA Badge */}
            <div className="bg-gov-lightblue border border-gov-border rounded-xl p-4 flex items-center gap-3 lg:min-w-[240px]">
              <div className="w-10 h-10 rounded-lg bg-gov-blue text-white flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gov-blue uppercase tracking-wider">
                  RTS Maharashtra SLA
                </p>
                <p className="text-sm font-bold text-gov-textPrimary">15 Working Days</p>
                <p className="text-[10px] text-gov-textSecondary">Right to Public Services Act Guarantee</p>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-gov-surface border border-gov-border">
              <span className="text-slate-400 block">Applicant ID</span>
              <span className="font-mono font-medium text-gov-textPrimary truncate block mt-0.5">
                {application.citizenId}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-gov-surface border border-gov-border">
              <span className="text-slate-400 block">DPDP Consent</span>
              <span className={`font-medium block mt-0.5 ${consent?.status === 'active' ? 'text-green-700' : 'text-amber-700'}`}>
                {consent?.status === 'active' ? 'Active & Valid' : consent?.status === 'revoked' ? 'Consent Revoked' : 'Pending Consent'}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-gov-surface border border-gov-border">
              <span className="text-slate-400 block">Automated Match</span>
              <span className={`font-medium block mt-0.5 ${verification?.matched ? 'text-green-700' : 'text-slate-600'}`}>
                {verification?.matched ? `Verified (${Math.round((verification.confidence || 0) * 100)}%)` : 'In Queue'}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-gov-surface border border-gov-border">
              <span className="text-slate-400 block">Last Activity</span>
              <span className="font-medium text-gov-textPrimary block mt-0.5">
                {new Date(application.updatedAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short'
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timeline */}
            <ApplicationTimeline
              status={application.status}
              createdAt={application.createdAt}
              updatedAt={application.updatedAt}
            />

            {/* Interoperability Verification Engine Card */}
            <CrossDeptVerificationCard
              applicationId={application._id}
              verification={verification}
              onVerificationTriggered={() => loadData(true)}
            />

            {/* Submitted Application Details */}
            <div className="bg-white rounded-xl border border-gov-border shadow-portal p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gov-border">
                <h3 className="font-bold text-gov-dark flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gov-blue" />
                  Submitted Application Record
                </h3>
                <span className="text-xs font-mono text-slate-400">UUID: {application._id}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <span className="text-slate-400 block text-xs">Target Department</span>
                  <span className="font-medium text-gov-textPrimary">{application.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs">Designation / Scheme Applied</span>
                  <span className="font-medium text-gov-textPrimary">{application.position}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs">Advertisement / Reference</span>
                  <span className="font-mono font-medium text-gov-textPrimary">{application.jobId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs">Submission Timestamp</span>
                  <span className="font-medium text-gov-textPrimary">
                    {new Date(application.createdAt).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-gov-surface rounded-lg border border-gov-border text-xs text-gov-textSecondary space-y-1">
                <div className="font-semibold text-gov-textPrimary flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  Tamper-Evident Government Seal
                </div>
                <p>
                  This digital application is cryptographically sealed and registered under the MahaSetu State Interoperability Architecture.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column (1 Col) */}
          <div className="space-y-6">
            {/* DPDP Consent Manager Card */}
            <ConsentManagerCard
              applicationId={application._id}
              consent={consent}
              onConsentChange={(newConsent) => setConsent(newConsent)}
            />

            <DocumentUploadCard applicationId={application._id} canManage={user?.role === 'citizen'} />

            {/* Department Nodal Office Card */}
            <div className="bg-white rounded-xl border border-gov-border shadow-portal p-6 space-y-4">
              <h3 className="font-bold text-gov-dark flex items-center gap-2 text-sm">
                <Building2 className="w-4 h-4 text-gov-blue" />
                Department Nodal Office
              </h3>
              <p className="text-xs text-gov-textSecondary leading-relaxed">
                For administrative inquiries, RTS escalations, or document submission queries regarding {application.department}:
              </p>

              <div className="space-y-2 text-xs text-gov-textSecondary">
                <div className="p-3 bg-gov-surface rounded-lg border border-gov-border">
                  <span className="text-slate-400 block">Nodal Office:</span>
                  <span className="font-semibold text-gov-textPrimary block mt-0.5">
                    Mantralaya, Madam Cama Road, Nariman Point, Mumbai 400032
                  </span>
                </div>
                <div className="p-3 bg-gov-surface rounded-lg border border-gov-border flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block">State Citizen Helpline:</span>
                    <span className="font-bold text-gov-blue font-mono">1800-120-8040</span>
                  </div>
                  <span className="px-2 py-0.5 bg-green-100 text-green-800 text-[10px] font-bold rounded">
                    Toll Free
                  </span>
                </div>
              </div>
            </div>

            {/* Need Help / Quick Grievance */}
            <div className="bg-gov-lightblue rounded-xl border border-gov-border p-6 space-y-3">
              <div className="flex items-center gap-2 text-gov-blue font-bold text-sm">
                <LifeBuoy className="w-4 h-4" />
                <span>Facing Delay or Issue?</span>
              </div>
              <p className="text-xs text-gov-textSecondary leading-relaxed">
                If your application exceeds the statutory RTS timeframe or you require clarification, lodge a formal RTS Grievance.
              </p>
              <Link
                to={`/grievances?appId=${application.applicationNumber}`}
                className="inline-flex items-center justify-center w-full px-4 py-2 text-xs font-semibold text-gov-blue bg-white hover:bg-gov-surface border border-gov-border rounded-lg transition-colors"
              >
                File RTS Grievance for #{application.applicationNumber}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
