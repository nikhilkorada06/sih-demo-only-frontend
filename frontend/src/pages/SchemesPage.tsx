import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  Search,
  CheckCircle2,
  HeartHandshake,
  Tractor,
  GraduationCap,
  Users,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Building2,
  Clock,
  X
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { NewApplicationModal } from '../components/applications/NewApplicationModal';
import { CitizenService, ServiceCategory } from '../types/service.types';
import { Application } from '../types/application.types';
import { useAuth } from '../context/AuthContext';

interface WelfareScheme {
  id: string;
  name: string;
  nameMr: string;
  department: string;
  category: 'Women & Child' | 'Farmers' | 'Education' | 'Social Welfare' | 'Senior Citizens' | 'Youth';
  benefitAmount: string;
  description: string;
  eligibility: string[];
  documents: string[];
  jobId: string;
  position: string;
}

const SCHEMES_CATALOG: WelfareScheme[] = [
  {
    id: 'scheme-ladki-bahin',
    name: 'Mukhyamantri Majhi Ladki Bahin Yojana',
    nameMr: 'मुख्यमंत्री माझी लाडकी बहीण योजना',
    department: 'Women & Child Development Department',
    category: 'Women & Child',
    benefitAmount: '₹1,500 / Month (DBT Direct Bank Transfer)',
    description: 'Financial independence and nutritional security for women aged 21 to 65 years with annual family income up to ₹2.5 Lakhs.',
    eligibility: [
      'Resident of Maharashtra State',
      'Age between 21 and 65 years',
      'Family annual income under ₹2,50,000',
      'Aadhaar seeded bank account'
    ],
    documents: ['Aadhaar Card', 'Domicile / Ration Card', 'Income Certificate', 'Bank Passbook with DBT linkage'],
    jobId: 'SCHEME-LADKI-BAHIN-2026',
    position: 'Majhi Ladki Bahin Beneficiary'
  },
  {
    id: 'scheme-namo-shetkari',
    name: 'Namo Shetkari Mahasanman Nidhi Yojana',
    nameMr: 'नमो शेतकरी महासन्मान निधी योजना',
    department: 'Agriculture Department',
    category: 'Farmers',
    benefitAmount: '₹6,000 / Year (₹2,000 per 4-month installment)',
    description: 'State top-up financial grant provided to all PM-KISAN verified agricultural landholding farmers across Maharashtra.',
    eligibility: [
      'Farmer with registered agricultural land holding in Maharashtra',
      'Enrolled and approved in PM-KISAN database',
      'Active e-KYC and Aadhaar DBT linked account'
    ],
    documents: ['7/12 Land Extract', 'Aadhaar Card', 'PM-KISAN Registration ID'],
    jobId: 'SCHEME-NAMO-SHETKARI-2026',
    position: 'Shetkari Beneficiary'
  },
  {
    id: 'scheme-shahu-maharaj-ebc',
    name: 'Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti (EBC)',
    nameMr: 'राजर्षी छत्रपती शाहू महाराज शिक्षण शुल्क शिष्यवृत्ती (EBC)',
    department: 'Higher & Technical Education Department',
    category: 'Education',
    benefitAmount: '50% to 100% Tuition & Exam Fee Reimbursement',
    description: 'Fee waiver for students from economically weaker sections pursuing Engineering, Medicine, Pharmacy, and Arts/Commerce/Science degrees.',
    eligibility: [
      'Maharashtra State Domicile',
      'Family Annual Income below ₹8,00,000',
      'Admission secured through CAP / Centralized Admission'
    ],
    documents: ['Income Certificate (Tahsildar)', 'Domicile Certificate', 'CAP Allotment Letter', 'Previous Year Marksheet'],
    jobId: 'EDU-EBC-2026',
    position: 'Scholarship Beneficiary'
  },
  {
    id: 'scheme-vayoshri',
    name: 'Chief Minister Vayoshri Yojana (Senior Citizens)',
    nameMr: 'मुख्यमंत्री वयोश्री योजना (ज्येष्ठ नागरिक)',
    department: 'Social Justice & Special Assistance Dept',
    category: 'Senior Citizens',
    benefitAmount: '₹3,000 One-time Assistive Device Allowance',
    description: 'Financial assistance for physical disability assistive equipment (hearing aids, walking sticks, spectacles) for citizens aged 65 and above.',
    eligibility: [
      'Age 65 years or above',
      'Annual family income below ₹2,00,000',
      'Maharashtra State Domicile'
    ],
    documents: ['Age / Domicile Certificate', 'Aadhaar Card', 'Income Certificate', 'Government Hospital Disability Certificate if applicable'],
    jobId: 'SCHEME-VAYOSHRI-2026',
    position: 'Vayoshri Beneficiary'
  },
  {
    id: 'scheme-sanjay-gandhi',
    name: 'Sanjay Gandhi Niradhar Anudan Yojana',
    nameMr: 'संजय गांधी निराधार अनुदान योजना',
    department: 'Revenue & Social Welfare Dept',
    category: 'Social Welfare',
    benefitAmount: '₹1,500 / Month Financial Pension Support',
    description: 'Monthly social pension for destitute persons, widows, disabled citizens, and persons suffering from critical illness without breadwinners.',
    eligibility: [
      'Destitute / Divyang / Single Mother / Senior Citizen',
      'Family annual income under ₹50,000',
      'Living in Maharashtra for minimum 15 years'
    ],
    documents: ['Age Certificate', 'Income Certificate', 'Medical Certificate if applicable', 'Ration Card'],
    jobId: 'SCHEME-NIRADHAR-2026',
    position: 'Niradhar Pensioner'
  },
  {
    id: 'scheme-mahaswayam-apprentice',
    name: 'MahaSwayam Industrial Apprenticeship Stipend Scheme',
    nameMr: 'महास्वयं औद्योगिक प्रशिक्षणार्थी विद्यावेतन योजना',
    department: 'Skill Development & Entrepreneurship',
    category: 'Youth',
    benefitAmount: '₹6,000 to ₹10,000 Monthly Stipend Support',
    description: 'On-the-job industrial apprenticeship stipend co-funded by the Government of Maharashtra for Diploma, ITI, and Graduate youth.',
    eligibility: [
      'Passed ITI, Polytechnic Diploma, or Degree from Maharashtra institution',
      'Age 18 to 28 years',
      'Registered on MahaSwayam portal'
    ],
    documents: ['Degree / ITI Marksheet', 'Aadhaar Card', 'Bank Passbook', 'Apprenticeship Contract'],
    jobId: 'SKILL-APPRENTICE-2026',
    position: 'Skill Apprentice'
  }
];

export const SchemesPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSchemeForApply, setSelectedSchemeForApply] = useState<CitizenService | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const categories = [
    'All',
    'Women & Child',
    'Farmers',
    'Education',
    'Social Welfare',
    'Senior Citizens',
    'Youth'
  ];

  const filteredSchemes = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return SCHEMES_CATALOG.filter((s) => {
      const matchCat = selectedCategory === 'All' || s.category === selectedCategory;
      if (!matchCat) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.nameMr.includes(q) ||
        s.department.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedCategory]);

  const handleApplyScheme = (scheme: WelfareScheme) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Adapt to CitizenService structure for modal
    const serviceAdapter: CitizenService = {
      id: scheme.id,
      name: scheme.name,
      nameMr: scheme.nameMr,
      departmentCode: 'SCHEMES',
      departmentName: scheme.department,
      category: 'Social Welfare' as ServiceCategory,
      description: scheme.description,
      descriptionMr: scheme.description,
      eligibility: scheme.eligibility,
      requiredDocuments: scheme.documents,
      processingDays: 7,
      fee: '₹0 (Free Govt Welfare)',
      requiresCrossVerification: true,
      jobId: scheme.jobId,
      position: scheme.position
    };

    setSelectedSchemeForApply(serviceAdapter);
    setIsApplyModalOpen(true);
  };

  const handleApplicationSuccess = (app: Application) => {
    setIsApplyModalOpen(false);
    navigate(`/applications/${app._id}`);
  };

  return (
    <div className="min-h-screen bg-gov-surface py-8 sm:py-12">
      <div className="max-w-portal mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-gov-textSecondary">
            <span className="hover:text-gov-blue cursor-pointer" onClick={() => navigate('/')}>Home</span>
            <span>/</span>
            <span className="text-gov-blue font-semibold">Government Welfare Schemes</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gov-dark tracking-tight">
                Maharashtra Welfare Schemes (शासकीय कल्याणकारी योजना)
              </h1>
              <p className="text-sm text-gov-textSecondary mt-1">
                Explore Direct Benefit Transfer (DBT), women empowerment, farmer support, and higher education scholarships.
              </p>
            </div>
            <div className="px-3.5 py-1.5 rounded-lg bg-white border border-gov-border text-xs font-semibold text-gov-blue shadow-xs">
              <strong className="text-gov-textPrimary">{filteredSchemes.length}</strong> Active Welfare Programs
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-xl border border-gov-border shadow-portal p-4 sm:p-6 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-gov-blue absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search schemes by name, keyword, or department (e.g. Ladki Bahin, Shetkari, Scholarship)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 text-sm bg-gov-surface border border-gov-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-blue focus:bg-white text-gov-textPrimary"
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

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-2 border-t border-gov-border">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-gov-blue text-white shadow-xs'
                    : 'bg-gov-surface text-gov-textPrimary hover:bg-slate-200 border border-gov-border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-white rounded-xl border border-gov-border p-6 shadow-portal hover:shadow-portal-hover hover:border-gov-blue transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-gov-lightblue text-gov-blue border border-gov-border">
                      {scheme.category}
                    </span>
                    <h3 className="font-bold text-lg text-gov-dark pt-1">
                      {scheme.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-marathi">
                      {scheme.nameMr}
                    </p>
                    <p className="text-xs text-gov-textSecondary flex items-center gap-1 mt-1">
                      <Building2 className="w-3.5 h-3.5 text-gov-blue" />
                      {scheme.department}
                    </p>
                  </div>
                </div>

                {/* Financial Benefit Highlight */}
                <div className="p-3 bg-gov-surface rounded-lg border border-gov-border text-xs">
                  <span className="text-slate-500 block">Financial Assistance / Direct Benefit:</span>
                  <span className="font-bold text-gov-blue text-sm block mt-0.5">{scheme.benefitAmount}</span>
                </div>

                <p className="text-xs text-gov-textSecondary leading-relaxed">
                  {scheme.description}
                </p>

                {/* Eligibility Summary */}
                <div className="space-y-1.5 text-xs text-gov-textPrimary">
                  <span className="font-semibold text-slate-700 block">Key Eligibility Criteria:</span>
                  <ul className="space-y-1">
                    {scheme.eligibility.slice(0, 3).map((e, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{e}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gov-border flex items-center justify-between gap-3">
                <span className="text-xs text-green-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Automated e-KYC Verification
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleApplyScheme(scheme)}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Apply Online
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredSchemes.length === 0 && (
          <div className="bg-white rounded-xl border border-gov-border p-12 text-center space-y-3">
            <Award className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-gov-dark">No Schemes Found</h3>
            <p className="text-xs sm:text-sm text-gov-textSecondary max-w-md mx-auto">
              No welfare schemes match your search filter. Try clearing filters or searching for another keyword.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      {/* New Application Modal */}
      {selectedSchemeForApply && (
        <NewApplicationModal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          preselectedService={selectedSchemeForApply}
          onSuccess={handleApplicationSuccess}
        />
      )}
    </div>
  );
};
