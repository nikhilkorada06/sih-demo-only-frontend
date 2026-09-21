import React from 'react';
import {
  FileText,
  Building2,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  FolderOpen
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { CitizenService } from '../../types/service.types';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ServiceDetailModalProps {
  service: CitizenService | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (service: CitizenService) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  isOpen,
  onClose,
  onApply
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!service) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-saffron-600 uppercase tracking-widest block">
            {service.category} • {service.departmentName}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-gov-navy leading-snug">
            {service.name}
          </h3>
          <p className="text-xs font-semibold text-saffron-700 font-marathi">
            {service.nameMr}
          </p>
        </div>
      }
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Description */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            About this Government Service
          </h4>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {service.description}
          </p>
          <p className="text-xs text-slate-500 font-marathi mt-1">
            {service.descriptionMr}
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
          <div>
            <span className="text-[10px] font-semibold text-slate-400 block">Processing Time</span>
            <span className="text-xs sm:text-sm font-bold text-gov-navy flex items-center gap-1 mt-0.5">
              <Clock size={14} className="text-saffron-600" />
              {service.processingDays} Working Days
            </span>
          </div>

          <div>
            <span className="text-[10px] font-semibold text-slate-400 block">Government Fee</span>
            <span className="text-xs sm:text-sm font-bold text-emerald-700 mt-0.5 block">
              {service.fee}
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <span className="text-[10px] font-semibold text-slate-400 block">Verification Mode</span>
            <span className="text-xs font-bold text-gov-blue mt-0.5 block">
              ✓ Digital MahaSetu GIE
            </span>
          </div>
        </div>

        {/* Eligibility Criteria */}
        <div>
          <h4 className="text-xs font-bold text-gov-navy uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-emerald-600" />
            Eligibility Criteria
          </h4>
          <ul className="space-y-1.5">
            {service.eligibility.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Required Documents */}
        <div>
          <h4 className="text-xs font-bold text-gov-navy uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <FolderOpen size={16} className="text-gov-blue" />
            Required Documents / Records
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {service.requiredDocuments.map((doc, idx) => (
              <div
                key={idx}
                className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-saffron-500" />
                <span>{doc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <Button variant="ghost" size="md" onClick={onClose}>
            Close
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={() => {
              onClose();
              if (isAuthenticated) {
                onApply(service);
              } else {
                navigate('/login');
              }
            }}
            rightIcon={<ArrowRight size={16} />}
          >
            {isAuthenticated ? 'Apply for this Service' : 'Login to Apply'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
