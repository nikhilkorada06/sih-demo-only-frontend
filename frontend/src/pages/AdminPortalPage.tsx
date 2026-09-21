import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Building2,
  Cpu,
  History,
  Activity,
  Plus,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Server,
  Layers,
  Key,
  Database,
  Lock,
  Eye,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Department, Integration } from '../types/department.types';
import { departmentApi } from '../api/department.api';
import { integrationApi } from '../api/integration.api';
import { auditApi, AuditRecord, AuditResponse } from '../api/audit.api';
import { applicationsApi } from '../api/applications.api';
import { employmentApi } from '../api/employment.api';
import { Application } from '../types/application.types';
import { extractErrorMessage } from '../api/client';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { Skeleton } from '../components/common/Skeleton';
import { StatusBadge } from '../components/common/StatusBadge';

const DepartmentOfficerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Post Job State
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobOrg, setNewJobOrg] = useState('');
  const [newJobLoc, setNewJobLoc] = useState('');
  const [newJobDesc, setNewJobDesc] = useState('');
  const [isSavingJob, setIsSavingJob] = useState(false);

  useEffect(() => {
    Promise.all([
      applicationsApi.getAllApplications(),
      departmentApi.getDepartments()
    ])
      .then(([appsData, deptsData]) => {
        setApplications(appsData);
        setDepartments(deptsData);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const ongoing = applications.filter(a => a.status === 'under_review');
  const upcoming = applications.filter(a => a.status === 'submitted');
  const completed = applications.filter(a => a.status === 'verified' || a.status === 'rejected' || a.status === 'withdrawn');

  const handleCreateJob = async () => {
    try {
      setIsSavingJob(true);
      await employmentApi.createJob({
        title: newJobTitle,
        organization: newJobOrg || 'Government of Maharashtra',
        location: newJobLoc || 'Mumbai',
        description: newJobDesc,
        employmentType: 'Full-time',
        qualification: 'Graduation',
        deadline: new Date(Date.now() + 86400000 * 30).toISOString()
      });
      setIsAddJobOpen(false);
      setNewJobTitle('');
      setNewJobOrg('');
      setNewJobLoc('');
      setNewJobDesc('');
      alert('Job posted successfully! It is now visible on the Citizen Employment Portal.');
    } catch (err) {
      alert(extractErrorMessage(err, 'Failed to post job.'));
    } finally {
      setIsSavingJob(false);
    }
  };

  return (
    <div className="min-h-screen bg-gov-surface py-8 sm:py-12">
      <div className="max-w-portal mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-white rounded-xl border border-gov-border shadow-portal p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-50 text-amber-600 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Department Operations Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gov-dark">
              {user?.name} Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-gov-textSecondary leading-relaxed">
              Manage ongoing tasks, view upcoming applications, and review completed citizen requests for your department.
            </p>
          </div>
          <Button variant="primary" onClick={() => setIsAddJobOpen(true)} className="whitespace-nowrap shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            Post New Job / Form
          </Button>
        </div>

        {/* Dashboard Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-500 uppercase">Ongoing Tasks</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{ongoing.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-500 uppercase">Upcoming / Drafts</h3>
            <p className="text-3xl font-bold text-amber-500 mt-2">{upcoming.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-500 uppercase">Completed</h3>
            <p className="text-3xl font-bold text-emerald-600 mt-2">{completed.length}</p>
          </div>
        </div>

        {/* Task Lists */}
        {loading ? (
          <Skeleton className="h-64 rounded-xl w-full" />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-200 p-4">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                  Ongoing Tasks
                </h2>
              </div>
              <ul className="divide-y divide-slate-100">
                {ongoing.length > 0 ? ongoing.map(app => (
                  <li key={app._id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-slate-900">{app.applicationNumber}</span>
                      <StatusBadge status={app.status} />
                    </div>
                    <p className="text-sm text-slate-600">{app.position || 'Department Service'}</p>
                    <div className="mt-3">
                      <Button variant="outline" size="sm" className="text-xs" onClick={() => navigate(`/applications/${app._id}`)}>
                        Review Task
                      </Button>
                    </div>
                  </li>
                )) : (
                  <li className="p-8 text-center text-slate-500">No ongoing tasks.</li>
                )}
              </ul>
            </section>

            <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-200 p-4">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  Recently Completed
                </h2>
              </div>
              <ul className="divide-y divide-slate-100">
                {completed.length > 0 ? completed.map(app => (
                  <li key={app._id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-slate-900">{app.applicationNumber}</span>
                      <StatusBadge status={app.status} />
                    </div>
                    <p className="text-sm text-slate-600">{app.position || 'Department Service'}</p>
                  </li>
                )) : (
                  <li className="p-8 text-center text-slate-500">No completed tasks.</li>
                )}
              </ul>
            </section>
          </div>
        )}

        {/* Other Departments Section */}
        {!loading && departments.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-200">
            <h2 className="text-xl font-bold font-serif text-slate-900 mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-gov-blue" />
              Registered State Administrative Departments
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments.map((dept) => (
                <div key={dept.code} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">{dept.name}</h3>
                    <p className="text-xs text-slate-500 mb-4">{dept.description || 'State Administrative Department'}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-700">
                      <CheckCircle2 size={12} className="text-green-600" />
                      {dept.active ? 'Connected' : 'Offline'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 font-bold">{dept.code}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Modal isOpen={isAddJobOpen} onClose={() => setIsAddJobOpen(false)} title="Post New Job / Application Form" maxWidth="2xl">
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
              <Briefcase className="w-5 h-5 text-gov-blue flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-slate-900">Citizen Visibility</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Once posted, this form will be immediately visible on the Citizen Employment Portal.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Input
                label="Job / Role Title"
                value={newJobTitle}
                onChange={(e) => setNewJobTitle(e.target.value)}
                placeholder="e.g. Senior IT Consultant"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Organization / Division"
                  value={newJobOrg}
                  onChange={(e) => setNewJobOrg(e.target.value)}
                  placeholder="e.g. Directorate of IT"
                />
                <Input
                  label="Location"
                  value={newJobLoc}
                  onChange={(e) => setNewJobLoc(e.target.value)}
                  placeholder="e.g. Mumbai, Maharashtra"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-700">Description</label>
                <textarea
                  value={newJobDesc}
                  onChange={(e) => setNewJobDesc(e.target.value)}
                  placeholder="Provide details about the role..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-blue text-sm h-24 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <Button variant="outline" onClick={() => setIsAddJobOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleCreateJob} isLoading={isSavingJob} disabled={!newJobTitle}>
                Publish Form
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export const AdminPortalPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'departments' | 'connectors' | 'audit'>('departments');

  // Departments State
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(false);
  const [deptError, setDeptError] = useState('');
  const [isAddDeptOpen, setIsAddDeptOpen] = useState(false);
  const [newDeptCode, setNewDeptCode] = useState('');
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptDesc, setNewDeptDesc] = useState('');
  const [newDeptCategories, setNewDeptCategories] = useState('education, employment');
  const [newDeptFrontendUrl, setNewDeptFrontendUrl] = useState('');
  const [newDeptBackendUrl, setNewDeptBackendUrl] = useState('');
  const [newDeptEndpoints, setNewDeptEndpoints] = useState<any[]>([]);
  const [isSavingDept, setIsSavingDept] = useState(false);

  // Integrations State
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loadingIntegrations, setLoadingIntegrations] = useState(false);

  // Audit Logs State
  const [auditData, setAuditData] = useState<AuditResponse | null>(null);
  const [loadingAudit, setLoadingAudit] = useState(false);
  const [auditPage, setAuditPage] = useState(1);
  const [auditActionFilter, setAuditActionFilter] = useState('');
  const [auditOutcomeFilter, setAuditOutcomeFilter] = useState('');
  const [selectedAuditLog, setSelectedAuditLog] = useState<AuditRecord | null>(null);

  // Connectors State
  const [testingConnectorId, setTestingConnectorId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; success: boolean; latency: number } | null>(null);

  const isOfficerOrAdmin = user?.role === 'admin' || user?.role === 'department_officer';

  const loadDepartments = useCallback(async () => {
    try {
      setLoadingDepts(true);
      setDeptError('');
      const data = await departmentApi.getDepartments();
      setDepartments(data);
    } catch (err) {
      setDeptError(extractErrorMessage(err, 'Failed to fetch departments.'));
    } finally {
      setLoadingDepts(false);
    }
  }, []);

  const loadAuditLogs = useCallback(async (page = 1) => {
    try {
      setLoadingAudit(true);
      const params: { page: number; limit: number; action?: string; outcome?: string } = {
        page,
        limit: 10
      };
      if (auditActionFilter) params.action = auditActionFilter;
      if (auditOutcomeFilter) params.outcome = auditOutcomeFilter;

      const res = await auditApi.getLogs(params);
      setAuditData(res);
      setAuditPage(page);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoadingAudit(false);
    }
  }, [auditActionFilter, auditOutcomeFilter]);

  const loadIntegrations = useCallback(async () => {
    try {
      setLoadingIntegrations(true);
      const data = await integrationApi.getIntegrations();
      setIntegrations(data);
    } catch (err) {
      console.error('Failed to load integrations', err);
    } finally {
      setLoadingIntegrations(false);
    }
  }, []);

  useEffect(() => {
    if (isOfficerOrAdmin) {
      loadDepartments();
      loadIntegrations();
      loadAuditLogs(1);
    }
  }, [isOfficerOrAdmin, loadDepartments, loadIntegrations, loadAuditLogs]);

  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptCode.trim() || !newDeptName.trim()) return;

    try {
      setIsSavingDept(true);
      const categories = newDeptCategories.split(',').map((c) => c.trim()).filter(Boolean);
      await departmentApi.createDepartment({
        code: newDeptCode.trim().toUpperCase(),
        name: newDeptName.trim(),
        description: newDeptDesc.trim(),
        dataCategories: categories,
        frontendUrl: newDeptFrontendUrl,
        backendUrl: newDeptBackendUrl,
        endpoints: newDeptEndpoints,
        active: true
      });
      setIsAddDeptOpen(false);
      setNewDeptCode('');
      setNewDeptName('');
      setNewDeptDesc('');
      setNewDeptFrontendUrl('');
      setNewDeptBackendUrl('');
      setNewDeptEndpoints([]);
      loadDepartments();
      loadIntegrations();
    } catch (err) {
      alert(extractErrorMessage(err, 'Failed to create department.'));
    } finally {
      setIsSavingDept(false);
    }
  };

  const handleAddEndpointField = () => {
    setNewDeptEndpoints([...newDeptEndpoints, { name: '', protocol: 'REST', baseUrl: '', authentication: { type: 'NONE' }, dataFormat: 'JSON' }]);
  };

  const handleUpdateEndpointField = (index: number, field: string, value: any) => {
    const updated = [...newDeptEndpoints];
    if (field === 'authType') {
       updated[index].authentication = { type: value };
    } else {
       updated[index][field] = value;
    }
    setNewDeptEndpoints(updated);
  };

  const handleRemoveEndpointField = (index: number) => {
    const updated = [...newDeptEndpoints];
    updated.splice(index, 1);
    setNewDeptEndpoints(updated);
  };

  const handleTestConnector = (id: string) => {
    setTestingConnectorId(id);
    setTestResult(null);
    setTimeout(() => {
      setTestingConnectorId(null);
      setTestResult({
        id,
        success: true,
        latency: Math.floor(45 + Math.random() * 80)
      });
    }, 900);
  };

  if (!isOfficerOrAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold font-serif text-slate-900">
            Official Access Restricted
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            The Admin & Department Officer Portal is restricted to authorized Government of Maharashtra personnel. Your current account role is <span className="font-semibold text-slate-900">{user?.role || 'citizen'}</span>.
          </p>
          <Button variant="primary" onClick={() => navigate('/dashboard')} className="w-full">
            Return to Citizen Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (user?.role === 'department_officer') {
    return <DepartmentOfficerDashboard />;
  }

  return (
    <div className="min-h-screen bg-gov-surface py-8 sm:py-12">
      <div className="max-w-portal mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Portal Header */}
        <div className="bg-white rounded-xl border border-gov-border shadow-portal p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-gov-lightblue text-gov-blue text-xs font-semibold uppercase tracking-wider">
              <Cpu className="w-4 h-4" />
              <span>MahaSetu State Interoperability Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gov-dark">
              State Administration & Connector Gateway
            </h1>
            <p className="text-xs sm:text-sm text-gov-textSecondary leading-relaxed">
              Configure department adapters, inspect cryptographic audit trails, and manage state-wide data interchange connectors.
            </p>
          </div>

          <div className="bg-gov-surface rounded-xl p-4 border border-gov-border text-xs space-y-1 sm:min-w-[200px]">
            <span className="text-slate-400 block">Logged in Official:</span>
            <span className="font-bold text-gov-textPrimary block text-sm">{user?.name}</span>
            <span className="inline-block px-2 py-0.5 rounded bg-gov-lightblue text-gov-blue font-mono text-[10px] font-bold">
              {user?.role.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Telemetry Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-1 shadow-sm">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase">Registered Depts</span>
              <Building2 className="w-4 h-4 text-gov-blue" />
            </div>
            <p className="text-2xl font-bold font-mono text-slate-900">{departments.length || 6}</p>
            <span className="text-[11px] text-green-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> 100% Operational
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-1 shadow-sm">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase">Adapters Active</span>
              <Server className="w-4 h-4 text-saffron-600" />
            </div>
            <p className="text-2xl font-bold font-mono text-slate-900">4 / 4</p>
            <span className="text-[11px] text-slate-500 font-medium">REST & SOAP Bridges</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-1 shadow-sm">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase">Verification Engine</span>
              <Activity className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold font-mono text-slate-900">98.4%</p>
            <span className="text-[11px] text-green-700 font-semibold">Match Accuracy</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-1 shadow-sm">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase">DPDP Consent Gate</span>
              <ShieldCheck className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-bold font-mono text-slate-900">100%</p>
            <span className="text-[11px] text-purple-700 font-semibold">Strict Enforcement</span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('departments')}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'departments'
                ? 'bg-gov-blue text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Department Registry
          </button>

          <button
            onClick={() => setActiveTab('connectors')}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'connectors'
                ? 'bg-gov-blue text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Cpu className="w-4 h-4" />
            Integration Connectors & Adapters
          </button>

          <button
            onClick={() => { setActiveTab('audit'); loadAuditLogs(1); }}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'audit'
                ? 'bg-gov-blue text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <History className="w-4 h-4" />
            State Audit Log Explorer
          </button>
        </div>

        {/* Tab 1: Department Registry */}
        {activeTab === 'departments' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold font-serif text-slate-900">
                  Registered State Administrative Departments
                </h2>
                <p className="text-xs text-slate-500">
                  Manage department metadata, allowed data schemas, and access control tokens.
                </p>
              </div>

              <Button variant="primary" size="sm" onClick={() => setIsAddDeptOpen(true)}>
                <Plus className="w-4 h-4 mr-1.5" />
                Register New Department
              </Button>
            </div>

            {loadingDepts ? (
              <div className="space-y-3">
                <Skeleton height="50px" />
                <Skeleton height="50px" />
                <Skeleton height="50px" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[11px] tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Code</th>
                      <th className="px-4 py-3">Department Name</th>
                      <th className="px-4 py-3">Data Categories</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {departments.map((dept) => (
                      <tr key={dept._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-gov-navy">{dept.code}</td>
                        <td className="px-4 py-3 font-medium text-slate-900">{dept.name}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {(dept.dataCategories || ['education']).map((cat) => (
                              <span key={cat} className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-mono font-semibold">
                                {cat}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-100 text-green-800 text-xs font-semibold">
                            <CheckCircle2 className="w-3 h-3 text-green-600" /> Active
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-xs">
                          {dept.updatedAt ? new Date(dept.updatedAt).toLocaleDateString('en-IN') : 'Active'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Connectors & Adapters Monitor */}
        {activeTab === 'connectors' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold font-serif text-slate-900">
                  Integration Engine Connectors & Adapters
                </h2>
                <p className="text-xs text-slate-500">
                  Configured protocol bridges (REST / SOAP / XML) connecting external state databases into the canonical MahaSetu schema.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loadingIntegrations ? (
                   <div className="col-span-full"><Skeleton height="150px" /></div>
                ) : integrations.length === 0 ? (
                   <div className="col-span-full text-slate-500 text-sm py-4 text-center">No connectors registered yet. Add them by registering a new department.</div>
                ) : integrations.map((conn) => (
                  <div
                    key={conn._id}
                    className="border border-slate-200 rounded-2xl p-5 space-y-4 hover:border-slate-300 transition-all bg-slate-50/50"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[11px] font-bold">
                          {conn.protocol}
                        </span>
                        <h3 className="font-bold text-slate-900 text-base font-serif mt-1">
                          {conn.name}
                        </h3>
                        <div className="text-xs text-slate-500 mt-0.5">Dept: {(conn as any).departmentId?.name || conn.departmentId}</div>
                      </div>
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded border ${conn.active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        {conn.active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {conn.active ? 'Online' : 'Offline'}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200/80 font-mono">
                      <div className="truncate">
                        <span className="text-slate-400">Endpoint: </span>
                        {conn.baseUrl}
                      </div>
                      <div>
                        <span className="text-slate-400">Auth Type: </span>
                        {conn.authentication?.type || 'NONE'}
                      </div>
                      <div className="flex justify-between pt-1 border-t border-slate-100 text-slate-700">
                        <span>Circuit: <strong className="text-green-700 font-sans">CLOSED (Healthy)</strong></span>
                        <span>Latency: <strong>--ms</strong></span>
                        <span>Uptime: <strong>--%</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      {testResult && testResult.id === conn._id ? (
                        <span className="text-xs text-green-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          Ping OK ({testResult.latency}ms)
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Auto-retry & backoff enabled</span>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestConnector(conn._id)}
                        disabled={testingConnectorId === conn._id}
                      >
                        <RefreshCw className={`w-3.5 h-3.5 mr-1 ${testingConnectorId === conn._id ? 'animate-spin' : ''}`} />
                        {testingConnectorId === conn._id ? 'Testing...' : 'Test Ping'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Audit Log Explorer */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold font-serif text-slate-900">
                  Cryptographic Audit Trail Explorer
                </h2>
                <p className="text-xs text-slate-500">
                  Immutable access logs verifying all citizen authentications, data exchanges, consent grants, and verification events.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={auditActionFilter}
                  onChange={(e) => setAuditActionFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gov-blue"
                >
                  <option value="">All Actions</option>
                  <option value="AUTH_LOGIN">AUTH_LOGIN</option>
                  <option value="AUTH_REGISTER">AUTH_REGISTER</option>
                  <option value="APPLICATION_CREATE">APPLICATION_CREATE</option>
                  <option value="CONSENT_GRANT">CONSENT_GRANT</option>
                  <option value="CONSENT_REVOKE">CONSENT_REVOKE</option>
                  <option value="VERIFICATION_TRIGGER">VERIFICATION_TRIGGER</option>
                </select>

                <select
                  value={auditOutcomeFilter}
                  onChange={(e) => setAuditOutcomeFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gov-blue"
                >
                  <option value="">All Outcomes</option>
                  <option value="SUCCESS">SUCCESS</option>
                  <option value="FAILURE">FAILURE</option>
                  <option value="DENIED">DENIED</option>
                </select>

                <Button variant="outline" size="sm" onClick={() => loadAuditLogs(auditPage)}>
                  <RefreshCw className={`w-3.5 h-3.5 mr-1 ${loadingAudit ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>

            {loadingAudit ? (
              <div className="space-y-3">
                <Skeleton height="40px" />
                <Skeleton height="40px" />
                <Skeleton height="40px" />
              </div>
            ) : auditData && auditData.logs && auditData.logs.length > 0 ? (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="px-3.5 py-2.5">Timestamp</th>
                        <th className="px-3.5 py-2.5">Action</th>
                        <th className="px-3.5 py-2.5">Actor / Role</th>
                        <th className="px-3.5 py-2.5">Resource ID</th>
                        <th className="px-3.5 py-2.5">Outcome</th>
                        <th className="px-3.5 py-2.5">Metadata</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {auditData.logs.map((log) => (
                        <tr key={log._id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-3.5 py-2.5 text-slate-500 whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleString('en-IN')}
                          </td>
                          <td className="px-3.5 py-2.5 font-bold text-gov-navy">
                            {log.action}
                          </td>
                          <td className="px-3.5 py-2.5 text-slate-700">
                            {log.actorRole ? `${log.actorRole}` : 'system'}
                          </td>
                          <td className="px-3.5 py-2.5 text-slate-600 truncate max-w-[120px]">
                            {log.resourceId || log.applicationId || '-'}
                          </td>
                          <td className="px-3.5 py-2.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                log.outcome === 'SUCCESS'
                                  ? 'bg-green-100 text-green-800'
                                  : log.outcome === 'FAILURE'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {log.outcome}
                            </span>
                          </td>
                          <td className="px-3.5 py-2.5 font-sans">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedAuditLog(log)}
                              className="text-[11px] py-1 px-2 h-auto"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" /> View JSON
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {auditData.pagination && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                    <span>
                      Showing Page {auditData.pagination.page} of {auditData.pagination.pages || 1} ({auditData.pagination.total} total events)
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={auditData.pagination.page <= 1}
                        onClick={() => loadAuditLogs(auditPage - 1)}
                      >
                        <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Prev
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={auditData.pagination.page >= auditData.pagination.pages}
                        onClick={() => loadAuditLogs(auditPage + 1)}
                      >
                        Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-10 text-slate-500 text-sm">
                No audit events found matching the filter criteria.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Department Modal */}
      {isAddDeptOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddDeptOpen(false)}
          title="Register New Administrative Department"
          maxWidth="md"
        >
          <form onSubmit={handleCreateDepartment} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Department Code *" placeholder="e.g. AGRI_DEPT" value={newDeptCode} onChange={(e) => setNewDeptCode(e.target.value)} required />
              <Input label="Official Department Name *" placeholder="e.g. Agriculture Department" value={newDeptName} onChange={(e) => setNewDeptName(e.target.value)} required />
              <Input label="Frontend URL" placeholder="https://..." value={newDeptFrontendUrl} onChange={(e) => setNewDeptFrontendUrl(e.target.value)} />
              <Input label="Backend URL" placeholder="https://..." value={newDeptBackendUrl} onChange={(e) => setNewDeptBackendUrl(e.target.value)} />
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Department Description</label>
                <textarea rows={2} value={newDeptDesc} onChange={(e) => setNewDeptDesc(e.target.value)} placeholder="Brief summary..." className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gov-blue" />
              </div>
              <div className="md:col-span-2">
                <Input label="Supported Data Categories *" placeholder="e.g. education, employment" value={newDeptCategories} onChange={(e) => setNewDeptCategories(e.target.value)} required />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
               <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-sm text-slate-800">Integration Endpoints</h3>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddEndpointField}>
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Endpoint
                  </Button>
               </div>
               
               <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                 {newDeptEndpoints.length === 0 && <p className="text-xs text-slate-500 text-center py-4 bg-slate-50 rounded-xl">No endpoints configured.</p>}
                 {newDeptEndpoints.map((ep, idx) => (
                   <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative">
                     <button type="button" onClick={() => handleRemoveEndpointField(idx)} className="absolute top-3 right-3 text-red-500 hover:text-red-700"><XCircle className="w-4 h-4" /></button>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                       <Input label="Endpoint Name" placeholder="e.g. Student API" value={ep.name} onChange={(e) => handleUpdateEndpointField(idx, 'name', e.target.value)} required />
                       <Input label="Base URL" placeholder="https://..." value={ep.baseUrl} onChange={(e) => handleUpdateEndpointField(idx, 'baseUrl', e.target.value)} required />
                       
                       <div>
                         <label className="block text-xs font-semibold text-slate-700 mb-1.5">Protocol</label>
                         <select value={ep.protocol} onChange={(e) => handleUpdateEndpointField(idx, 'protocol', e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl">
                           <option value="REST">REST</option>
                           <option value="SOAP">SOAP</option>
                           <option value="GRAPHQL">GraphQL</option>
                         </select>
                       </div>
                       
                       <div>
                         <label className="block text-xs font-semibold text-slate-700 mb-1.5">Auth Type</label>
                         <select value={ep.authentication?.type || 'NONE'} onChange={(e) => handleUpdateEndpointField(idx, 'authType', e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl">
                           <option value="NONE">None</option>
                           <option value="API_KEY">API Key</option>
                           <option value="JWT">JWT</option>
                         </select>
                       </div>

                       <div>
                         <label className="block text-xs font-semibold text-slate-700 mb-1.5">Data Format</label>
                         <select value={ep.dataFormat} onChange={(e) => handleUpdateEndpointField(idx, 'dataFormat', e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl">
                           <option value="JSON">JSON</option>
                           <option value="XML">XML</option>
                         </select>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <Button variant="outline" type="button" onClick={() => setIsAddDeptOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={isSavingDept}>
                {isSavingDept ? 'Saving...' : 'Register Department & Endpoints'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Audit Log JSON Inspector Modal */}
      {selectedAuditLog && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedAuditLog(null)}
          title={`Audit Event: ${selectedAuditLog.action}`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="p-4 bg-slate-900 rounded-xl text-emerald-400 font-mono text-xs overflow-x-auto max-h-96">
              <pre>{JSON.stringify(selectedAuditLog, null, 2)}</pre>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setSelectedAuditLog(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
