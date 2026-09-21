import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Building2,
  X
} from 'lucide-react';
import { Button } from '../components/common/Button';

interface FAQItem {
  id: string;
  category: 'general' | 'auth' | 'verification' | 'consent' | 'grievance';
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'general',
    question: 'What is MahaSetu and how is it different from traditional department websites?',
    answer: 'MahaSetu is Maharashtra’s Unified Interoperability and Citizen Services Platform. Unlike traditional fragmented department websites where citizens must repeatedly submit the same documents (Aadhaar, marks, income certificate), MahaSetu creates an automated data bridge between 50+ state departments. Once authenticated, your verified credentials flow directly to the reviewing department with your explicit DPDP consent.'
  },
  {
    id: 'faq-2',
    category: 'auth',
    question: 'How is my citizen account secured?',
    answer: 'MahaSetu securely hashes account passwords and uses time-limited signed sessions. Protected citizen services also enforce server-side authentication, role checks, rate limits, and ownership controls.'
  },
  {
    id: 'faq-3',
    category: 'verification',
    question: 'What is the Automated Cross-Department Verification Engine?',
    answer: 'When you apply for a job, scholarship, or welfare scheme, MahaSetu queries authoritative sources (e.g. Higher Education DB for degree certificates, Employment Exchange DB for experience, Revenue Dept for 7/12 land records) using deterministic and probabilistic matching algorithms. A cryptographically verifiable verification score is generated automatically.'
  },
  {
    id: 'faq-4',
    category: 'consent',
    question: 'How does MahaSetu protect my data under the DPDP Act 2023?',
    answer: 'Under the Digital Personal Data Protection Act 2023, departments can only access your personal data categories (such as education records or employment history) if you grant explicit digital consent for that specific application. You have the statutory right to view, inspect, and revoke this consent at any time from your Application Dashboard.'
  },
  {
    id: 'faq-5',
    category: 'grievance',
    question: 'What is the guaranteed timeline under the Maharashtra Right to Public Services Act?',
    answer: 'Most citizen services on MahaSetu have a statutory Service Level Agreement (SLA) ranging from 3 to 15 working days. If an officer fails to process your application within this SLA, you can file a formal RTS Grievance on MahaSetu, which automatically escalates your application to the District Appellate Authority.'
  }
];

interface SetuKendra {
  id: string;
  name: string;
  district: string;
  address: string;
  timings: string;
  contact: string;
}

const SETU_KENDRAS: SetuKendra[] = [
  {
    id: 'kendra-1',
    name: 'District Collectorate MahaSetu Kendra',
    district: 'Pune',
    address: 'Collector Office Campus, Station Road, Pune 411001',
    timings: 'Mon - Sat: 9:30 AM to 6:00 PM',
    contact: '020-26123456'
  },
  {
    id: 'kendra-2',
    name: 'Old Customs House Citizen Facilitation Center',
    district: 'Mumbai City',
    address: 'Fort, Shahid Bhagat Singh Road, Mumbai 400001',
    timings: 'Mon - Sat: 9:00 AM to 5:30 PM',
    contact: '022-22661234'
  },
  {
    id: 'kendra-3',
    name: 'Administrative Building Setu Center',
    district: 'Nagpur',
    address: 'Civil Lines, Near High Court, Nagpur 440001',
    timings: 'Mon - Fri: 10:00 AM to 5:00 PM',
    contact: '0712-2567890'
  },
  {
    id: 'kendra-4',
    name: 'Tehsil Office Citizen Service Desk',
    district: 'Nashik',
    address: 'Old Agra Road, Near CBS, Nashik 422002',
    timings: 'Mon - Sat: 9:30 AM to 5:30 PM',
    contact: '0253-2571234'
  },
  {
    id: 'kendra-5',
    name: 'Sub-Divisional Office MahaSetu Desk',
    district: 'Chhatrapati Sambhajinagar',
    address: 'Adalat Road, Near Khadkeshwar, Sambhajinagar 431001',
    timings: 'Mon - Sat: 10:00 AM to 6:00 PM',
    contact: '0240-2334567'
  }
];

export const HelpPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredKendras = SETU_KENDRAS.filter((k) => {
    return selectedDistrict === 'all' || k.district === selectedDistrict;
  });

  return (
    <div className="min-h-screen bg-gov-surface py-8 sm:py-12">
      <div className="max-w-portal mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Strip */}
        <div className="bg-white rounded-xl border border-gov-border p-6 sm:p-8 shadow-portal space-y-4 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-gov-lightblue text-gov-blue text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>24x7 Citizen Support & Assistance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gov-dark">
            How can we help you on MahaSetu?
          </h1>
          <p className="text-xs sm:text-sm text-gov-textSecondary leading-relaxed">
            Find quick answers about automated verification, DPDP consent, RTS guarantees, and district Setu Kendra facilitation centers.
          </p>

          {/* Search Box */}
          <div className="relative max-w-lg mx-auto pt-2">
            <Search className="w-4 h-4 text-gov-blue absolute left-3.5 top-1/2 -translate-y-1/2 mt-1" />
            <input
              type="text"
              placeholder="Search help topics, keywords, error codes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-gov-surface border border-gov-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-blue focus:bg-white text-gov-textPrimary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 mt-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Helpline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gov-border p-5 flex items-center gap-3.5 shadow-portal">
            <div className="w-10 h-10 rounded-lg bg-gov-lightblue text-gov-blue flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">MahaSetu Toll-Free</span>
              <p className="font-mono font-bold text-gov-dark text-sm">1800-120-8040</p>
              <span className="text-[10px] text-green-700 font-semibold">24x7 Citizen Line</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gov-border p-5 flex items-center gap-3.5 shadow-portal">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0 border border-amber-200">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Aaple Sarkar / RTS</span>
              <p className="font-mono font-bold text-gov-dark text-sm">1905</p>
              <span className="text-[10px] text-amber-700 font-semibold">Grievance Escalation</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gov-border p-5 flex items-center gap-3.5 shadow-portal">
            <div className="w-10 h-10 rounded-lg bg-gov-surface text-gov-blue flex items-center justify-center flex-shrink-0 border border-gov-border">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Citizen Support Email</span>
              <p className="font-medium text-gov-textPrimary text-xs truncate">support@mahasetu.gov.in</p>
              <span className="text-[10px] text-slate-500">24-hour turnaround</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gov-border p-5 flex items-center gap-3.5 shadow-portal">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center flex-shrink-0 border border-purple-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Data Privacy Officer</span>
              <p className="font-medium text-gov-textPrimary text-xs truncate">dpo@mahasetu.gov.in</p>
              <span className="text-[10px] text-slate-500">DPDP Act Compliance</span>
            </div>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gov-dark">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-gov-textSecondary">
                Official answers to common citizen inquiries regarding the MahaSetu platform.
              </p>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {[
                { id: 'all', label: 'All Topics' },
                { id: 'general', label: 'General' },
                { id: 'auth', label: 'Account Security' },
                { id: 'verification', label: 'Verification' },
                { id: 'consent', label: 'DPDP Consent' },
                { id: 'grievance', label: 'RTS Grievance' }
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setActiveCategory(pill.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    activeCategory === pill.id
                      ? 'bg-gov-blue text-white shadow-xs'
                      : 'bg-white border border-gov-border text-gov-textPrimary hover:bg-gov-surface'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-xl border border-gov-border overflow-hidden shadow-portal"
                >
                  <button
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-semibold text-gov-textPrimary hover:bg-gov-surface/60 transition-colors cursor-pointer"
                  >
                    <span className="text-sm">{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-gov-blue flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gov-textSecondary border-t border-gov-border/60 leading-relaxed bg-gov-surface/30">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Setu Kendra Physical Facilitation Directory */}
        <div className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gov-dark">
                Citizen Facilitation Centers (Setu Kendra)
              </h2>
              <p className="text-xs text-gov-textSecondary">
                Physical assistance desks located across all 36 Maharashtra districts.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-gov-textSecondary">Filter District:</label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white border border-gov-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-blue text-gov-textPrimary cursor-pointer"
              >
                <option value="all">All Districts (Maharashtra)</option>
                <option value="Pune">Pune</option>
                <option value="Mumbai City">Mumbai City</option>
                <option value="Nagpur">Nagpur</option>
                <option value="Nashik">Nashik</option>
                <option value="Chhatrapati Sambhajinagar">Chhatrapati Sambhajinagar</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredKendras.map((kendra) => (
              <div
                key={kendra.id}
                className="bg-white rounded-xl border border-gov-border shadow-portal p-5 space-y-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="w-9 h-9 rounded-lg bg-gov-lightblue text-gov-blue flex items-center justify-center font-bold">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span className="px-2 py-0.5 rounded bg-gov-surface text-gov-textPrimary text-[11px] font-bold border border-gov-border">
                    {kendra.district}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-gov-textPrimary text-sm">{kendra.name}</h3>
                  <p className="text-xs text-gov-textSecondary mt-1 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                    {kendra.address}
                  </p>
                </div>

                <div className="space-y-1 text-xs text-gov-textSecondary bg-gov-surface p-2.5 rounded-lg border border-gov-border/60">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{kendra.timings}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{kendra.contact}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
