import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, ChevronRight, Building2, FileText, ArrowUpRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MAHARASHTRA_SERVICES } from '../../data/services.data';
import { MAHARASHTRA_DEPARTMENTS } from '../../data/departments.data';
import { CitizenService } from '../../types/service.types';
import { DepartmentInfo } from '../../data/departments.data';

export interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectService?: (service: CitizenService) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectService
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedCategory('All');
    }
  }, [isOpen]);

  // Keyboard navigation & Esc support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const categories = ['All', 'Education', 'Employment', 'Revenue & Land', 'Agriculture', 'Social Welfare'];

  const filteredServices = useMemo(() => {
    const q = query.toLowerCase().trim();
    return MAHARASHTRA_SERVICES.filter((s) => {
      const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.nameMr.includes(q) ||
        s.departmentName.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      );
    }).slice(0, 6);
  }, [query, selectedCategory]);

  const filteredDepartments = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return MAHARASHTRA_DEPARTMENTS.slice(0, 4);
    return MAHARASHTRA_DEPARTMENTS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.nameMr.includes(q) ||
        d.description.toLowerCase().includes(q)
    ).slice(0, 4);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog" aria-modal="true" aria-label="Search Portal"
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform animate-slide-up flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <Search size={20} className="text-gov-blue flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            aria-label="Search government services and departments"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search government services, schemes, certificates, departments..."
            className="w-full bg-transparent border-none text-gov-textPrimary placeholder:text-slate-400 text-sm sm:text-base focus:outline-none"
          />
          {query && (
            <button
              aria-label="Clear search"
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
            >
              <X size={16} />
            </button>
          )}
          <button onClick={onClose} aria-label="Close search" className="p-2 text-gov-blue"><X size={18} /></button>
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 border border-slate-200 rounded">
            ESC
          </kbd>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 px-5 py-2.5 overflow-x-auto border-b border-slate-100 bg-white no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-gov-blue text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Results */}
        <div className="overflow-y-auto p-4 space-y-5">
          {/* Services Group */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
              <span className="flex items-center gap-1.5 text-gov-blue">
                <FileText size={14} className="text-gov-blue" />
                Citizen Services ({filteredServices.length})
              </span>
              <button
                onClick={() => {
                  onClose();
                  navigate('/departments');
                }}
                className="text-gov-blue hover:underline flex items-center gap-0.5 text-[11px]"
              >
                View all <ChevronRight size={12} />
              </button>
            </div>

            {filteredServices.length === 0 ? (
              <p className="text-xs text-slate-400 px-3 py-2">No matching services found.</p>
            ) : (
              <div className="space-y-1.5">
                {filteredServices.map((service) => (
                  <div
                    role="button" tabIndex={0}
                    onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.currentTarget.click(); } }}
                    key={service.id}
                    onClick={() => {
                      onClose();
                      if (onSelectService) {
                        onSelectService(service);
                      } else {
                        navigate('/departments');
                      }
                    }}
                    className="group flex items-start justify-between p-3 rounded-xl hover:bg-gov-lightblue/40 border border-transparent hover:border-gov-lightblue transition-all cursor-pointer"
                  >
                    <div className="flex-1 pr-3">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-semibold text-gov-textPrimary group-hover:text-gov-blue">
                          {service.name}
                        </h4>
                        {service.isPopular && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 text-[9px] font-semibold bg-amber-100 text-amber-800 rounded">
                            <Sparkles size={10} /> Popular
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {service.departmentName} • {service.fee}
                      </p>
                    </div>
                    <ArrowUpRight
                      size={16}
                      className="text-slate-300 group-hover:text-gov-blue mt-1 flex-shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Departments Group */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
              <span className="flex items-center gap-1.5 text-gov-blue">
                <Building2 size={14} className="text-gov-blue" />
                Departments ({filteredDepartments.length})
              </span>
              <button
                onClick={() => {
                  onClose();
                  navigate('/departments');
                }}
                className="text-gov-blue hover:underline flex items-center gap-0.5 text-[11px]"
              >
                View all <ChevronRight size={12} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredDepartments.map((dept) => (
                <div
                  key={dept.code}
                  onClick={() => {
                    onClose();
                    navigate('/departments');
                  }}
                  className="p-2.5 rounded-xl border border-slate-100 hover:border-slate-300 bg-slate-50/50 hover:bg-white transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex-1 pr-2">
                    <p className="text-xs font-semibold text-gov-textPrimary group-hover:text-gov-blue line-clamp-1">
                      {dept.name}
                    </p>
                    <p className="text-[10px] text-slate-500 font-marathi mt-0.5">
                      {dept.nameMr}
                    </p>
                  </div>
                  <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-500">
            Press <kbd className="px-1.5 py-0.5 text-[10px] bg-white border rounded">↵ Enter</kbd> to view full catalog
          </p>
        </div>
      </div>
    </div>
  );
};
