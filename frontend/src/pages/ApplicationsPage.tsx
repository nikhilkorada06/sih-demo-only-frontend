import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Plus,
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar,
  ArrowRight,
  RefreshCw,
  X
} from 'lucide-react';
import { applicationsApi } from '../api/applications.api';
import { Application, ApplicationStatus } from '../types/application.types';
import { ApplicationCard } from '../components/applications/ApplicationCard';
import { NewApplicationModal } from '../components/applications/NewApplicationModal';
import { Button } from '../components/common/Button';
import { Skeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';

export const ApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const list = await applicationsApi.getMyApplications();
      setApplications(list);
    } catch {
      setApplications([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return applications.filter((app) => {
      const matchStatus = filterStatus === 'all' || app.status === filterStatus;
      if (!matchStatus) return false;
      if (!q) return true;
      return (
        app.applicationNumber.toLowerCase().includes(q) ||
        app.department.toLowerCase().includes(q) ||
        app.position.toLowerCase().includes(q)
      );
    });
  }, [applications, filterStatus, searchQuery]);

  const statuses = [
    { key: 'all', label: 'All Applications' },
    { key: 'submitted', label: 'Submitted' },
    { key: 'under_review', label: 'Under Review' },
    { key: 'verified', label: 'Verified & Approved' },
    { key: 'rejected', label: 'Rejected' },
    { key: 'withdrawn', label: 'Withdrawn' }
  ];

  return (
    <div className="bg-gov-surface min-h-screen py-8 sm:py-12">
      <div className="max-w-portal mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-gov-textSecondary mb-1">
              <span className="hover:text-gov-blue cursor-pointer" onClick={() => navigate('/dashboard')}>Dashboard</span>
              <span>/</span>
              <span className="text-gov-blue font-semibold">My Applications</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gov-dark tracking-tight">
              My Applications (माझे अर्ज)
            </h1>
            <p className="text-xs sm:text-sm text-gov-textSecondary mt-1">
              Track status, review cross-department verification, and manage DPDP consent records.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="md"
              onClick={fetchApplications}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsApplyModalOpen(true)}
              leftIcon={<Plus size={18} />}
            >
              New Application
            </Button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gov-border shadow-portal space-y-3">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gov-blue pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your applications by tracking number, department, or scheme name..."
              className="w-full pl-10 pr-10 py-2.5 bg-gov-surface border border-gov-border focus:bg-white focus:ring-2 focus:ring-gov-blue rounded-lg text-xs sm:text-sm text-gov-textPrimary placeholder:text-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-gov-border no-scrollbar">
            {statuses.map((st) => (
              <button
                key={st.key}
                onClick={() => setFilterStatus(st.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  filterStatus === st.key
                    ? 'bg-gov-blue text-white shadow-xs'
                    : 'bg-gov-surface text-gov-textPrimary hover:bg-slate-200 border border-gov-border'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Applications List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton height="200px" />
            <Skeleton height="200px" />
            <Skeleton height="200px" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No Applications Found"
            description={
              searchQuery || filterStatus !== 'all'
                ? 'No applications match your active search filter.'
                : 'You have not submitted any government applications yet. Apply for a service to begin.'
            }
            actionLabel="Apply for Service"
            onAction={() => setIsApplyModalOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((app) => (
              <ApplicationCard key={app._id} application={app} />
            ))}
          </div>
        )}
      </div>

      <NewApplicationModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSuccess={(app: Application) => {
          fetchApplications();
          navigate(`/applications/${app._id}`);
        }}
      />
    </div>
  );
};
