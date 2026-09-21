import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  Download,
  Share2,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  Lock,
  Eye,
  Plus,
  QrCode,
  Building2,
  Calendar,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { useAuth } from '../context/AuthContext';

interface VaultDocument {
  id: string;
  title: string;
  category: 'identity' | 'education' | 'revenue' | 'employment';
  issuer: string;
  docNumber: string;
  issueDate: string;
  validUntil?: string;
  status: 'Verified' | 'Issued';
  fileSize: string;
  securityHash: string;
}

const INITIAL_DOCUMENTS: VaultDocument[] = [
  {
    id: 'doc-1',
    title: 'Aadhaar Card',
    category: 'identity',
    issuer: 'Unique Identification Authority of India (UIDAI)',
    docNumber: 'XXXX-XXXX-4921',
    issueDate: '12 Jan 2024',
    status: 'Verified',
    fileSize: '340 KB',
    securityHash: 'sha256-8f4b23c910a3de...'
  },
  {
    id: 'doc-2',
    title: 'Permanent Account Number (PAN) Card',
    category: 'identity',
    issuer: 'Income Tax Department, Govt of India',
    docNumber: 'ABCDE1234F',
    issueDate: '08 Feb 2023',
    status: 'Verified',
    fileSize: '410 KB',
    securityHash: 'sha256-7a19c28e91f04b...'
  },
  {
    id: 'doc-3',
    title: 'Domicile Certificate',
    category: 'revenue',
    issuer: 'Revenue & Forest Department, Govt of Maharashtra',
    docNumber: 'MH/REV/2024/098412',
    issueDate: '04 Mar 2024',
    status: 'Verified',
    fileSize: '1.2 MB',
    securityHash: 'sha256-e2a1b9487c55ff...'
  },
  {
    id: 'doc-4',
    title: 'Income Certificate',
    category: 'revenue',
    issuer: 'Revenue Department, Govt of Maharashtra',
    docNumber: 'MH/INC/2024/339101',
    issueDate: '15 Apr 2024',
    validUntil: '31 Mar 2027',
    status: 'Verified',
    fileSize: '890 KB',
    securityHash: 'sha256-78d1f2e345b6a7...'
  },
  {
    id: 'doc-5',
    title: 'Education Certificate (B.E. Computer Science)',
    category: 'education',
    issuer: 'Higher & Technical Education Dept / SPPU',
    docNumber: 'SPPU/ENGG/2023/5512',
    issueDate: '18 Jul 2023',
    status: 'Verified',
    fileSize: '2.4 MB',
    securityHash: 'sha256-4c91a03f88bc91...'
  },
  {
    id: 'doc-6',
    title: 'Employment Exchange Registration Certificate',
    category: 'employment',
    issuer: 'Skill Development & Employment Dept, GoM',
    docNumber: 'MH/EMP/2024/881290',
    issueDate: '20 Sep 2024',
    validUntil: '19 Sep 2027',
    status: 'Verified',
    fileSize: '650 KB',
    securityHash: 'sha256-99ff88ee77dd66...'
  }
];

export const DocumentsPage: React.FC = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<VaultDocument[]>(INITIAL_DOCUMENTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDocForPreview, setActiveDocForPreview] = useState<VaultDocument | null>(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkDocType, setLinkDocType] = useState('driving_licence');
  const [linkDocNumber, setLinkDocNumber] = useState('');
  const [isFetchingDoc, setIsFetchingDoc] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.docNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleFetchFromDigiLocker = () => {
    if (!linkDocNumber) return;
    setIsFetchingDoc(true);
    setTimeout(() => {
      const newDoc: VaultDocument = {
        id: `doc-${Date.now()}`,
        title: linkDocType === 'driving_licence' ? 'Driving Licence (Maharashtra Transport)' : 'Smart Ration Card (NFSA)',
        category: linkDocType === 'driving_licence' ? 'identity' : 'employment',
        issuer: linkDocType === 'driving_licence' ? 'Motor Vehicles Dept, Maharashtra' : 'Food, Civil Supplies Dept, GoM',
        docNumber: linkDocNumber.toUpperCase(),
        issueDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: 'Verified',
        fileSize: '780 KB',
        securityHash: `sha256-${Math.random().toString(36).substring(2, 12)}...`
      };
      setDocuments([newDoc, ...documents]);
      setIsFetchingDoc(false);
      setIsLinkModalOpen(false);
      setLinkDocNumber('');
      showToast('Document securely fetched and verified from DigiLocker / Issuing Dept!');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gov-surface py-8 sm:py-12">
      <div className="max-w-portal mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gov-dark tracking-tight">
              Citizen Digital Documents Vault (माझे दस्तऐवज)
            </h1>
            <p className="text-sm text-gov-textSecondary mt-1">
              Digitally verified credentials issued by Maharashtra departments and UIDAI for single-click application attachment.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              DigiLocker Demo Bridge Active
            </span>
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsLinkModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Fetch New Credential
            </Button>
          </div>
        </div>

        {/* Notification Toast */}
        {toastMessage && (
          <div className="bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-3 rounded-lg flex items-center gap-2 shadow-xs animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            <span className="font-medium">{toastMessage}</span>
          </div>
        )}

        {/* Search & Category Filter Toolbar */}
        <div className="bg-white rounded-xl border border-gov-border shadow-portal p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
            {[
              { id: 'all', label: 'All Documents', count: documents.length },
              { id: 'identity', label: 'Identity (Aadhaar / PAN)', count: documents.filter((d) => d.category === 'identity').length },
              { id: 'revenue', label: 'Revenue & Domicile', count: documents.filter((d) => d.category === 'revenue').length },
              { id: 'education', label: 'Education', count: documents.filter((d) => d.category === 'education').length },
              { id: 'employment', label: 'Employment', count: documents.filter((d) => d.category === 'employment').length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-gov-blue text-white shadow-xs'
                    : 'bg-gov-surface text-gov-textPrimary hover:bg-slate-200 border border-gov-border'
                }`}
              >
                {tab.label}
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                    selectedCategory === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-gov-blue absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search documents by title, number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-gov-surface border border-gov-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-blue focus:bg-white text-gov-textPrimary"
            />
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl border border-gov-border p-6 shadow-portal hover:shadow-portal-hover hover:border-gov-blue transition-all flex flex-col justify-between space-y-4 group"
            >
              {/* Header */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-lg bg-gov-lightblue text-gov-blue flex items-center justify-center font-bold">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-green-50 text-green-700 border border-green-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                    Verified
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-gov-textPrimary group-hover:text-gov-blue transition-colors line-clamp-1">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-gov-textSecondary line-clamp-1 mt-0.5">
                    {doc.issuer}
                  </p>
                </div>
              </div>

              {/* Details & Hashes */}
              <div className="space-y-1.5 text-xs bg-gov-surface p-3 rounded-lg border border-gov-border/70">
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400">Doc Number:</span>
                  <span className="font-mono font-medium text-gov-textPrimary">{doc.docNumber}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400">Issued On:</span>
                  <span className="font-medium text-slate-800">{doc.issueDate}</span>
                </div>
                {doc.validUntil && (
                  <div className="flex justify-between text-slate-600">
                    <span className="text-slate-400">Valid Till:</span>
                    <span className="font-medium text-slate-800">{doc.validUntil}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600 pt-1 border-t border-gov-border">
                  <span className="text-slate-400">Security Hash:</span>
                  <span className="font-mono text-[10px] text-slate-500 truncate max-w-[140px]">
                    {doc.securityHash}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gov-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveDocForPreview(doc)}
                  className="w-full text-xs"
                >
                  <Eye className="w-3.5 h-3.5 mr-1" />
                  View
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => showToast(`Downloaded ${doc.title} (Cryptographically Signed)`)}
                  className="w-full text-xs"
                >
                  <Download className="w-3.5 h-3.5 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* DPDP Compliance Card */}
        <div className="bg-white rounded-xl border border-gov-border p-6 shadow-portal flex flex-col sm:flex-row items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-gov-lightblue text-gov-blue flex items-center justify-center flex-shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-bold text-gov-dark text-sm sm:text-base">
              Digital Personal Data Protection (DPDP) Act 2023 Compliance
            </h4>
            <p className="text-xs sm:text-sm text-gov-textSecondary leading-relaxed">
              All credentials stored in your MahaSetu Vault are encrypted using AES-256 and signed with Maharashtra PKI keys. Departments cannot inspect your documents without your explicit, revocable digital consent.
            </p>
          </div>
        </div>
      </div>

      {/* Document View / Verification Modal */}
      {activeDocForPreview && (
        <Modal
          isOpen={true}
          onClose={() => setActiveDocForPreview(null)}
          title="Digital Certificate Preview"
          maxWidth="lg"
        >
          <div className="space-y-6">
            <div className="border-2 border-dashed border-gov-border rounded-xl p-6 sm:p-8 bg-gov-surface/60 text-center space-y-4">
              <div className="space-y-1">
                <span className="text-xs uppercase font-bold tracking-widest text-gov-blue">
                  Government of Maharashtra
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-gov-dark font-serif">
                  {activeDocForPreview.title}
                </h2>
                <p className="text-xs text-gov-textSecondary font-medium">
                  Issued by: {activeDocForPreview.issuer}
                </p>
              </div>

              <div className="my-6 border-t border-b border-gov-border py-4 grid grid-cols-2 gap-4 text-left text-xs bg-white p-4 rounded-lg">
                <div>
                  <span className="text-slate-500 block">Certificate No:</span>
                  <span className="font-mono font-bold text-gov-textPrimary">{activeDocForPreview.docNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Issued to:</span>
                  <span className="font-bold text-gov-textPrimary">{user?.name || 'Authorized Citizen'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Issue Date:</span>
                  <span className="font-medium text-slate-800">{activeDocForPreview.issueDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Verification Status:</span>
                  <span className="font-bold text-green-700">e-Signed & Certified</span>
                </div>
              </div>

              {/* QR Code and Seals */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-white border border-gov-border rounded-lg p-1.5 flex items-center justify-center">
                    <QrCode className="w-10 h-10 text-gov-dark" />
                  </div>
                  <div className="text-left text-[11px] text-gov-textSecondary">
                    <p className="font-bold text-gov-textPrimary">Scan to Verify</p>
                    <p>MahaSetu Trust Network</p>
                  </div>
                </div>

                <div className="text-right text-[11px]">
                  <div className="inline-flex items-center gap-1 text-green-700 font-bold bg-green-50 px-2.5 py-1 rounded border border-green-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    PKI Signature Valid
                  </div>
                  <p className="text-slate-400 font-mono text-[10px] mt-1 truncate max-w-[160px]">
                    SHA: {activeDocForPreview.securityHash}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setActiveDocForPreview(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  showToast(`Downloaded ${activeDocForPreview.title}`);
                  setActiveDocForPreview(null);
                }}
              >
                <Download className="w-4 h-4 mr-1.5" />
                Download PDF
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Fetch / Link Document Modal */}
      {isLinkModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsLinkModalOpen(false)}
          title="Fetch Credential via DigiLocker Bridge"
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
              <strong>Simulated Integration Bridge:</strong> MahaSetu will authenticate with the state issuer or UIDAI and sync the verified credential into your account.
            </div>

            <div>
              <label className="block text-xs font-semibold text-gov-textPrimary mb-1.5">
                Document Type
              </label>
              <select
                value={linkDocType}
                onChange={(e) => setLinkDocType(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-gov-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-blue text-gov-textPrimary cursor-pointer"
              >
                <option value="driving_licence">Driving Licence (Maharashtra Transport)</option>
                <option value="ration_card">Smart Ration Card (Food & Civil Supplies)</option>
                <option value="caste_cert">Caste Certificate (Social Justice)</option>
                <option value="hsc_marksheet">HSC Marksheet (Maharashtra State Board)</option>
              </select>
            </div>

            <Input
              label="Document / Registration Number"
              placeholder={linkDocType === 'driving_licence' ? 'e.g. MH12 20210019283' : 'e.g. MH-RAT-2024-99120'}
              value={linkDocNumber}
              onChange={(e) => setLinkDocNumber(e.target.value)}
              helperText="Enter registration number as printed on the original card"
              required
            />

            <div className="flex justify-end gap-3 pt-3 border-t border-gov-border">
              <Button variant="outline" onClick={() => setIsLinkModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleFetchFromDigiLocker}
                disabled={!linkDocNumber || isFetchingDoc}
              >
                {isFetchingDoc ? 'Verifying with DigiLocker...' : 'Fetch & Verify'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
