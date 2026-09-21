import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Building2,
  Clock,
  CheckCircle2,
  FileText,
  ArrowRight,
  ShieldCheck,
  Zap,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { MAHARASHTRA_SERVICES } from '../data/services.data';
import { CitizenService } from '../types/service.types';
import { Application } from '../types/application.types';
import { ServiceDetailModal } from '../components/services/ServiceDetailModal';
import { NewApplicationModal } from '../components/applications/NewApplicationModal';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

export const ServicesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [onlyRequiresInteroperability, setOnlyRequiresInteroperability] = useState(false);

  // Modals
  const [selectedService, setSelectedService] = useState<CitizenService | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
    const q = searchParams.get('search');
    if (q) setSearchQuery(q);
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  const categories = [
    'All',
    'Education',
    'Revenue & Land',
    'Employment',
    'Social Welfare',
    'Agriculture',
    'Certificates'
  ];

  const departments = [
    'All',
    'Higher & Technical Education Department',
    'Revenue & Forest Department',
    'Skill Development & Entrepreneurship',
    'Social Justice & Special Assistance',
    'Agriculture Department',
    'Food, Civil Supplies & Consumer Protection'
  ];

  const filteredServices = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return MAHARASHTRA_SERVICES.filter((s) => {
      const matchCat = selectedCategory === 'All' || s.category === selectedCategory;
      const matchDept = selectedDepartment === 'All' || s.departmentName === selectedDepartment;
      const matchInteroperable = !onlyRequiresInteroperability || s.requiresCrossVerification;

      if (!matchCat || !matchDept || !matchInteroperable) return false;
      if (!q) return true;

      return (
        s.name.toLowerCase().includes(q) ||
        s.nameMr.includes(q) ||
        s.departmentName.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedCategory, selectedDepartment, onlyRequiresInteroperability]);

  const handleOpenDetail = (service: CitizenService) => {
    setSelectedService(service);
    setIsDetailModalOpen(true);
  };

  const handleApply = (service: CitizenService) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedService(service);
    setIsDetailModalOpen(false);
    setIsApplyModalOpen(true);
  };

  const handleApplicationSuccess = (app: Application) => {
    setIsApplyModalOpen(false);
    navigate(`/applications/${app._id}`);
  };

  return (
    <div className="min-h-screen bg-gov-surface py-8 sm:py-12">
      <div className="max-w-portal mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Title & Breadcrumb */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-gov-textSecondary">
            <span className="hover:text-gov-blue cursor-pointer" onClick={() => navigate('/')}>Home</span>
            <span>/</span>
            <span className="text-gov-blue font-semibold">Government Services Directory</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gov-dark tracking-tight">
                Government Services Catalog (शासकीय नागरिक सेवा)
              </h1>
              <p className="text-sm text-gov-textSecondary mt-1">
                Discover and apply for 150+ citizen certificates, welfare programs, and automated verification services.
              </p>
            </div>
            <div className="px-3.5 py-1.5 rounded-lg bg-white border border-gov-border text-xs font-semibold text-gov-blue shadow-xs">
              Showing <strong className="text-gov-textPrimary">{filteredServices.length}</strong> Services
            </div>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="bg-white rounded-xl border border-gov-border shadow-portal p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search Box (7 cols) */}
            <div className="md:col-span-7 relative">
              <Search className="w-4 h-4 text-gov-blue absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search services by title, department, or keyword (e.g. Income, 7/12, Scholarship)..."
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

            {/* Department Filter Dropdown (5 cols) */}
            <div className="md:col-span-5">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-gov-surface border border-gov-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-blue text-gov-textPrimary cursor-pointer"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept === 'All' ? 'All Administrative Departments' : dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gov-border">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-gov-blue text-white shadow-xs'
                      : 'bg-gov-surface text-gov-textPrimary hover:bg-slate-200 border border-gov-border'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Checkbox for Interoperability Enabled */}
            <label className="flex items-center gap-2 text-xs font-medium text-gov-textSecondary cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyRequiresInteroperability}
                onChange={(e) => setOnlyRequiresInteroperability(e.target.checked)}
                className="w-4 h-4 text-gov-blue rounded focus:ring-gov-blue cursor-pointer"
              />
              <span className="flex items-center gap-1 text-gov-blue font-semibold">
                <Zap className="w-3.5 h-3.5 text-gov-orange" />
                Automated Verification Only
              </span>
            </label>
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-xl border border-gov-border p-6 shadow-portal hover:shadow-portal-hover hover:border-gov-blue transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-10 h-10 rounded-lg bg-gov-lightblue text-gov-blue flex items-center justify-center font-bold">
                      <FileText className="w-5 h-5" />
                    </div>
                    {service.requiresCrossVerification ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-green-50 text-green-700 border border-green-200">
                        <Zap className="w-3 h-3 text-gov-orange" /> Interoperable
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-gov-surface text-slate-600 border border-gov-border">
                        Direct Portal
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-gov-textPrimary group-hover:text-gov-blue transition-colors line-clamp-2">
                      {service.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-marathi mt-0.5 line-clamp-1">
                      {service.nameMr}
                    </p>
                    <p className="text-xs text-gov-textSecondary line-clamp-2 mt-2 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-gov-border">
                  <div className="flex items-center justify-between text-xs text-gov-textSecondary">
                    <span className="flex items-center gap-1 text-slate-600">
                      <Building2 className="w-3.5 h-3.5 text-gov-blue" />
                      <span className="truncate max-w-[150px]">{service.departmentName}</span>
                    </span>
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {service.processingDays} Days SLA
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDetail(service)}
                      className="w-full text-xs"
                    >
                      View Details
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleApply(service)}
                      className="w-full text-xs"
                    >
                      Apply Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gov-border p-12 text-center space-y-3">
            <FileText className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-gov-dark">No Services Found</h3>
            <p className="text-xs sm:text-sm text-gov-textSecondary max-w-md mx-auto">
              No government services match your current search query or filter selection. Try clearing filters.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedDepartment('All');
                setOnlyRequiresInteroperability(false);
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <ServiceDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          service={selectedService}
          onApply={handleApply}
        />
      )}

      {/* New Application Modal */}
      {selectedService && (
        <NewApplicationModal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          preselectedService={selectedService}
          onSuccess={handleApplicationSuccess}
        />
      )}
    </div>
  );
};
