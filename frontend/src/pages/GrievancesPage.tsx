import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  LifeBuoy,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  FileText,
  Search,
  MessageSquare,
  ShieldCheck,
  UserCheck,
  Plus,
  ArrowRight,
  X
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useAuth } from '../context/AuthContext';

interface Grievance {
  id: string;
  tokenNumber: string;
  department: string;
  applicationNumber?: string;
  category: string;
  subject: string;
  description: string;
  status: 'submitted' | 'under_investigation' | 'officer_assigned' | 'resolved';
  level: 'Level 1: Nodal Officer' | 'Level 2: First Appellate Authority' | 'Level 3: State Commission';
  assignedOfficer?: string;
  officerRemarks?: string;
  createdAt: string;
  updatedAt: string;
}

const INITIAL_GRIEVANCES: Grievance[] = [
  {
    id: 'grv-1',
    tokenNumber: 'MH/RTS/GRV/2025/11092',
    department: 'Revenue & Forest Department',
    applicationNumber: 'APP-2025-00492',
    category: 'Delayed Service beyond RTS SLA',
    subject: 'Income Certificate processing delay beyond statutory 15 days',
    description: 'Applied on 12th Jan 2025 with complete documentation and digital consent. RTS timeline expired on 27th Jan without intimation.',
    status: 'officer_assigned',
    level: 'Level 1: Nodal Officer',
    assignedOfficer: 'S. K. Patil (Deputy Collector, Pune)',
    officerRemarks: 'Verification expedited with Talathi office. Expected resolution within 48 hours.',
    createdAt: '2025-01-29T10:30:00Z',
    updatedAt: '2025-01-30T14:15:00Z'
  },
  {
    id: 'grv-2',
    tokenNumber: 'MH/RTS/GRV/2025/08419',
    department: 'Higher & Technical Education Department',
    applicationNumber: 'APP-2024-99812',
    category: 'Data Interoperability / Matching Mismatch',
    subject: 'Academic marksheet discrepancy in autonomous university record',
    description: 'Degree percentage in automated cross-department verification showed partial mismatch due to seat number format difference.',
    status: 'resolved',
    level: 'Level 1: Nodal Officer',
    assignedOfficer: 'Dr. V. Joshi (Joint Director of Higher Ed)',
    officerRemarks: 'Autonomous college database synchronized via MahaSetu bridge. Marks confirmed and application verified.',
    createdAt: '2024-12-10T09:00:00Z',
    updatedAt: '2024-12-14T11:45:00Z'
  }
];

export const GrievancesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [grievances, setGrievances] = useState<Grievance[]>(INITIAL_GRIEVANCES);
  const [activeTab, setActiveTab] = useState<'my_grievances' | 'file_new'>('my_grievances');
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [department, setDepartment] = useState('Revenue & Forest Department');
  const [applicationNumber, setApplicationNumber] = useState('');
  const [category, setCategory] = useState('Delayed Service beyond RTS SLA');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToken, setSuccessToken] = useState<string | null>(null);

  useEffect(() => {
    const appId = searchParams.get('appId');
    if (appId) {
      setApplicationNumber(appId);
      setActiveTab('file_new');
      setSubject(`Inquiry / Grievance regarding Application #${appId}`);
    }
  }, [searchParams]);

  const handleSubmitGrievance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newToken = `MH/RTS/GRV/2025/${Math.floor(10000 + Math.random() * 90000)}`;
      const newGrv: Grievance = {
        id: `grv-${Date.now()}`,
        tokenNumber: newToken,
        department,
        applicationNumber: applicationNumber.trim() || undefined,
        category,
        subject,
        description,
        status: 'submitted',
        level: 'Level 1: Nodal Officer',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setGrievances([newGrv, ...grievances]);
      setIsSubmitting(false);
      setSuccessToken(newToken);
      // Reset form
      setSubject('');
      setDescription('');
      setApplicationNumber('');
    }, 900);
  };

  const filteredGrievances = grievances.filter((g) => {
    return (
      g.tokenNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.applicationNumber && g.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="min-h-screen bg-gov-surface py-8 sm:py-12">
      <div className="max-w-portal mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gov-dark tracking-tight">
              Aaple Sarkar Grievance Redressal (तक्रार निवारण)
            </h1>
            <p className="text-sm text-gov-textSecondary mt-1">
              Statutory grievance escalation guaranteed under the Maharashtra Right to Public Services Act, 2015.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-white border border-gov-border rounded-lg text-xs font-semibold text-gov-blue">
              RTS Helpline: <strong className="font-mono text-gov-dark">1905</strong>
            </span>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-2 border-b border-gov-border pb-2">
          <button
            onClick={() => { setActiveTab('my_grievances'); setSuccessToken(null); }}
            className={`px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'my_grievances'
                ? 'bg-gov-blue text-white shadow-xs'
                : 'bg-white text-gov-textPrimary border border-gov-border hover:bg-gov-surface'
            }`}
          >
            <FileText className="w-4 h-4" />
            Track Grievances ({grievances.length})
          </button>
          <button
            onClick={() => setActiveTab('file_new')}
            className={`px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'file_new'
                ? 'bg-gov-blue text-white shadow-xs'
                : 'bg-white text-gov-textPrimary border border-gov-border hover:bg-gov-surface'
            }`}
          >
            <Plus className="w-4 h-4" />
            Lodge New Grievance
          </button>
        </div>

        {/* Tab 1: My Grievances List */}
        {activeTab === 'my_grievances' && (
          <div className="space-y-6">
            {/* Search Box */}
            <div className="bg-white rounded-xl border border-gov-border shadow-portal p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 text-gov-blue absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by token number, subject, or app ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-gov-surface border border-gov-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-blue focus:bg-white text-gov-textPrimary"
                />
              </div>

              <div className="text-xs text-gov-textSecondary font-medium">
                Showing {filteredGrievances.length} registered grievance(s)
              </div>
            </div>

            {/* List */}
            <div className="space-y-4">
              {filteredGrievances.map((grv) => {
                const isResolved = grv.status === 'resolved';
                return (
                  <div
                    key={grv.id}
                    className="bg-white rounded-xl border border-gov-border hover:border-gov-blue shadow-portal hover:shadow-portal-hover transition-all p-6 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gov-border">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-sm text-gov-dark">
                          {grv.tokenNumber}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                            isResolved
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : grv.status === 'officer_assigned'
                              ? 'bg-blue-50 text-gov-blue border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {grv.status === 'resolved'
                            ? 'Resolved'
                            : grv.status === 'officer_assigned'
                            ? 'Officer Assigned'
                            : 'Submitted to Nodal Cell'}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">
                        {new Date(grv.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-gov-textPrimary">
                        {grv.subject}
                      </h3>
                      <p className="text-xs text-gov-textSecondary mt-1 line-clamp-2">
                        {grv.description}
                      </p>
                    </div>

                    {/* Metadata chips */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gov-textSecondary">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-gov-blue" />
                        {grv.department}
                      </span>
                      {grv.applicationNumber && (
                        <span className="flex items-center gap-1 font-mono text-gov-blue">
                          <FileText className="w-3.5 h-3.5" />
                          App #{grv.applicationNumber}
                        </span>
                      )}
                      <span className="px-2 py-0.5 bg-gov-surface rounded text-[11px] font-semibold text-slate-700 border border-gov-border">
                        {grv.level}
                      </span>
                    </div>

                    {/* Officer Remarks Banner */}
                    {grv.officerRemarks && (
                      <div className="bg-gov-lightblue rounded-lg p-3.5 text-xs text-gov-textPrimary border border-gov-border space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-gov-dark">
                          <UserCheck className="w-4 h-4 text-gov-blue" />
                          Officer Action: {grv.assignedOfficer}
                        </div>
                        <p className="text-gov-textSecondary">{grv.officerRemarks}</p>
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredGrievances.length === 0 && (
                <div className="bg-white rounded-xl border border-gov-border p-12 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto" />
                  <h3 className="font-bold text-gov-dark text-base">No Grievances Found</h3>
                  <p className="text-xs text-gov-textSecondary max-w-sm mx-auto">
                    You have no active complaints matching your query.
                  </p>
                  <Button variant="primary" size="sm" onClick={() => setActiveTab('file_new')}>
                    Lodge New Grievance
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Lodge New Grievance */}
        {activeTab === 'file_new' && (
          <div className="bg-white rounded-xl border border-gov-border shadow-portal p-6 sm:p-8 space-y-6">
            {successToken ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto border border-green-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gov-dark">
                  Grievance Registered Successfully!
                </h2>
                <div className="p-4 bg-gov-surface border border-gov-border rounded-lg inline-block">
                  <span className="text-xs text-slate-400 block">Your Tracking Token:</span>
                  <span className="font-mono text-xl font-bold text-gov-blue">{successToken}</span>
                </div>
                <p className="text-xs sm:text-sm text-gov-textSecondary max-w-md mx-auto leading-relaxed">
                  Your complaint has been assigned to the Departmental Nodal Officer under the Maharashtra RTS Act. You will receive updates via email and SMS.
                </p>
                <div className="flex justify-center gap-3 pt-4">
                  <Button variant="outline" onClick={() => { setSuccessToken(null); setActiveTab('my_grievances'); }}>
                    View My Grievances
                  </Button>
                  <Button variant="primary" onClick={() => setSuccessToken(null)}>
                    Lodge Another Grievance
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitGrievance} className="space-y-5">
                <div>
                  <h2 className="text-lg font-bold text-gov-dark">
                    Lodge a Service Delivery Grievance
                  </h2>
                  <p className="text-xs text-gov-textSecondary mt-0.5">
                    Provide complete details so the RTS First Appellate Authority can investigate your case.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gov-textPrimary mb-1.5">
                      Concerned Department *
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-gov-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-blue text-gov-textPrimary cursor-pointer"
                      required
                    >
                      <option value="Revenue & Forest Department">Revenue & Forest Department</option>
                      <option value="Higher & Technical Education Department">Higher & Technical Education Department</option>
                      <option value="Skill Development & Entrepreneurship">Skill Development & Entrepreneurship</option>
                      <option value="Social Justice & Special Assistance">Social Justice & Special Assistance</option>
                      <option value="Agriculture Department">Agriculture Department</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gov-textPrimary mb-1.5">
                      Grievance Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-gov-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-blue text-gov-textPrimary cursor-pointer"
                      required
                    >
                      <option value="Delayed Service beyond RTS SLA">Delayed Service beyond statutory RTS timeline</option>
                      <option value="Data Interoperability / Matching Mismatch">Cross-Department verification mismatch</option>
                      <option value="Rejection without Valid Grounds">Rejection without written grounds</option>
                      <option value="Portal Technical Glitch">Portal technical issue</option>
                    </select>
                  </div>
                </div>

                <Input
                  label="Associated Application Number (Optional)"
                  placeholder="e.g. APP-2025-00192"
                  value={applicationNumber}
                  onChange={(e) => setApplicationNumber(e.target.value)}
                  helperText="Leave empty if this is a general department query"
                />

                <Input
                  label="Grievance Subject *"
                  placeholder="Brief 1-line summary of the issue"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />

                <div>
                  <label className="block text-xs font-semibold text-gov-textPrimary mb-1.5">
                    Detailed Grievance Description *
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide specific dates, reference IDs, and what corrective action is expected..."
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-gov-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-blue text-gov-textPrimary"
                    required
                  />
                </div>

                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Statutory RTS Escalation Framework:</span>
                    If the Nodal Officer fails to provide a resolution within 7 working days, your case is automatically escalated to the District Collectorate Appellate Authority.
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="outline" type="button" onClick={() => setActiveTab('my_grievances')}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" disabled={isSubmitting}>
                    <Send className="w-4 h-4 mr-1.5" />
                    {isSubmitting ? 'Registering...' : 'Submit Grievance'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
