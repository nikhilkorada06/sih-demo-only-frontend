import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  ShieldCheck,
  FolderLock,
  ArrowRight,
  RefreshCw,
  Building2,
  Calendar,
  MessageSquare,
  Award
} from 'lucide-react';
import { applicationsApi } from '../api/applications.api';
import { Application } from '../types/application.types';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { Skeleton } from '../components/common/Skeleton';
import { NewApplicationModal } from '../components/applications/NewApplicationModal';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const data = await applicationsApi.getMyApplications();
      setApplications(data);
    } catch {
      setApplications([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const totalSubmitted = applications.length;
  const verifiedCount = applications.filter((a) => a.status === 'verified').length;
  const pendingCount = applications.filter((a) => a.status === 'submitted' || a.status === 'under_review').length;

  return (
    <div className="min-h-screen bg-gov-surface py-8 sm:py-12">
      <div className="max-w-portal mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Citizen Welcome Banner */}
        <div className="bg-white rounded-xl border border-gov-border p-6 sm:p-8 shadow-portal flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-gov-lightblue text-gov-blue border border-gov-border">
                Authorized Citizen Portal
              </span>
              <span className="text-xs text-green-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Aadhaar Verified
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gov-dark">
              Welcome back, {user?.name || 'Citizen'}
            </h1>
            <p className="text-xs sm:text-sm text-gov-textSecondary">
              Manage your Maharashtra government applications, inspect automated verification records, and control DPDP data sharing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsApplyModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              New Application
            </Button>
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-xl border border-gov-border p-5 shadow-portal space-y-1">
            <div className="flex items-center justify-between text-gov-textSecondary">
              <span className="text-xs font-semibold uppercase">Total Applications</span>
              <FileText className="w-4 h-4 text-gov-blue" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-mono text-gov-textPrimary">
              {totalSubmitted}
            </p>
            <span className="text-[11px] text-gov-blue font-medium block">All submitted services</span>
          </div>

          <div className="bg-white rounded-xl border border-gov-border p-5 shadow-portal space-y-1">
            <div className="flex items-center justify-between text-gov-textSecondary">
              <span className="text-xs font-semibold uppercase">Verified & Approved</span>
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-mono text-gov-textPrimary">
              {verifiedCount}
            </p>
            <span className="text-[11px] text-green-700 font-medium block">Ready for certificate download</span>
          </div>

          <div className="bg-white rounded-xl border border-gov-border p-5 shadow-portal space-y-1">
            <div className="flex items-center justify-between text-gov-textSecondary">
              <span className="text-xs font-semibold uppercase">Under Review</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-mono text-gov-textPrimary">
              {pendingCount}
            </p>
            <span className="text-[11px] text-amber-700 font-medium block">Within statutory RTS SLA</span>
          </div>

          <div className="bg-white rounded-xl border border-gov-border p-5 shadow-portal space-y-1">
            <div className="flex items-center justify-between text-gov-textSecondary">
              <span className="text-xs font-semibold uppercase">Digital Vault</span>
              <FolderLock className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-mono text-gov-textPrimary">
              6
            </p>
            <span className="text-[11px] text-purple-700 font-medium block">Verified credentials active</span>
          </div>
        </div>

        {/* Quick Service Access Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            to="/services"
            className="p-4 rounded-xl bg-white border border-gov-border shadow-portal hover:border-gov-blue hover:shadow-portal-hover transition-all flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-lg bg-gov-lightblue text-gov-blue flex items-center justify-center group-hover:bg-gov-blue group-hover:text-white transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-xs sm:text-sm text-gov-textPrimary group-hover:text-gov-blue">
                Apply Service
              </p>
              <p className="text-[11px] text-gov-textSecondary">150+ State Services</p>
            </div>
          </Link>

          <Link
            to="/schemes"
            className="p-4 rounded-xl bg-white border border-gov-border shadow-portal hover:border-gov-blue hover:shadow-portal-hover transition-all flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-lg bg-gov-lightblue text-gov-blue flex items-center justify-center group-hover:bg-gov-blue group-hover:text-white transition-colors">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-xs sm:text-sm text-gov-textPrimary group-hover:text-gov-blue">
                Welfare Schemes
              </p>
              <p className="text-[11px] text-gov-textSecondary">DBT Grants & Benefits</p>
            </div>
          </Link>

          <Link
            to="/documents"
            className="p-4 rounded-xl bg-white border border-gov-border shadow-portal hover:border-gov-blue hover:shadow-portal-hover transition-all flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-lg bg-gov-lightblue text-gov-blue flex items-center justify-center group-hover:bg-gov-blue group-hover:text-white transition-colors">
              <FolderLock className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-xs sm:text-sm text-gov-textPrimary group-hover:text-gov-blue">
                Digital Vault
              </p>
              <p className="text-[11px] text-gov-textSecondary">DigiLocker & 7/12</p>
            </div>
          </Link>

          <Link
            to="/grievances"
            className="p-4 rounded-xl bg-white border border-gov-border shadow-portal hover:border-gov-blue hover:shadow-portal-hover transition-all flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-lg bg-gov-lightblue text-gov-blue flex items-center justify-center group-hover:bg-gov-blue group-hover:text-white transition-colors">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-xs sm:text-sm text-gov-textPrimary group-hover:text-gov-blue">
                RTS Grievance
              </p>
              <p className="text-[11px] text-gov-textSecondary">Aaple Sarkar 1905</p>
            </div>
          </Link>
        </div>

        {/* Recent Applications Section */}
        <div className="bg-white rounded-xl border border-gov-border shadow-portal p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gov-border">
            <div>
              <h2 className="text-lg font-bold text-gov-dark">
                Recent Applications (माझे अर्ज)
              </h2>
              <p className="text-xs text-gov-textSecondary">
                Track status and verification progress under the Maharashtra Right to Public Services Act.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchApplications}
                disabled={isLoading}
              >
                <RefreshCw className={`w-3.5 h-3.5 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Link to="/applications">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton height="50px" />
              <Skeleton height="50px" />
              <Skeleton height="50px" />
            </div>
          ) : applications.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-gov-surface text-gov-textSecondary font-semibold border-b border-gov-border uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Tracking ID</th>
                    <th className="px-4 py-3">Service / Position</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Submitted</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gov-border/60">
                  {applications.slice(0, 5).map((app) => (
                    <tr key={app._id} className="hover:bg-gov-surface/60 transition-colors">
                      <td className="px-4 py-3.5 font-mono font-bold text-gov-blue">
                        {app.applicationNumber}
                      </td>
                      <td className="px-4 py-3.5 font-medium text-gov-textPrimary">
                        {app.position}
                      </td>
                      <td className="px-4 py-3.5 text-gov-textSecondary text-xs">
                        {app.department}
                      </td>
                      <td className="px-4 py-3.5 text-gov-textSecondary text-xs">
                        {new Date(app.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={app.status} size="sm" />
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <Link
                          to={`/applications/${app._id}`}
                          className="font-bold text-gov-blue hover:text-gov-dark text-xs inline-flex items-center gap-1"
                        >
                          View Status <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 space-y-3">
              <FileText className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-gov-textPrimary">No Applications Submitted Yet</p>
              <p className="text-xs text-gov-textSecondary max-w-sm mx-auto">
                Apply for certificates or scholarships to track verification progress in real-time.
              </p>
              <Button variant="primary" size="sm" onClick={() => setIsApplyModalOpen(true)}>
                Apply for First Service
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* New Application Modal */}
      <NewApplicationModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSuccess={(app) => {
          fetchApplications();
          navigate(`/applications/${app._id}`);
        }}
      />
    </div>
  );
};
