import React, { useState } from 'react';
import { Building2, Briefcase, FileCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { MAHARASHTRA_SERVICES } from '../../data/services.data';
import { MAHARASHTRA_DEPARTMENTS } from '../../data/departments.data';
import { applicationsApi } from '../../api/applications.api';
import { extractErrorMessage } from '../../api/client';
import { Application } from '../../types/application.types';
import { CitizenService } from '../../types/service.types';

interface NewApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (app: Application) => void;
  preselectedService?: CitizenService | null;
}

export const NewApplicationModal: React.FC<NewApplicationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  preselectedService
}) => {
  const [department, setDepartment] = useState<string>(
    preselectedService?.departmentCode || 'Education'
  );
  const [position, setPosition] = useState<string>(
    preselectedService?.name || 'Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh (EBC)'
  );
  const [jobId, setJobId] = useState<string>(
    preselectedService?.jobId || `SCHEME-${Date.now()}`
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!department || !position) {
      setError('Please fill all required fields');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const app = await applicationsApi.createApplication({
        department: department.trim(),
        position: position.trim(),
        jobId: jobId.trim() || `JOB-${Date.now()}`
      });

      onSuccess(app);
      onClose();
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to submit application.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit New Citizen Application"
      subtitle="Apply for a Maharashtra government service or scheme with digital cross-verification"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Department Selector */}
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1.5">
            Target Department <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-gov-blue focus:ring-2 focus:ring-gov-light"
            >
              <option value="Education">Higher & Technical Education Department (Education)</option>
              <option value="Employment">Skill Development & Employment (Employment)</option>
              <option value="Revenue">Revenue & Forest Department (Revenue)</option>
              <option value="Agriculture">Agriculture & Farmers Welfare (Agriculture)</option>
              <option value="Health">Public Health Department (Health)</option>
              <option value="Social Justice">Social Justice & Special Assistance</option>
            </select>
          </div>
        </div>

        {/* Service / Position Name */}
        <div>
          <Input
            label="Service / Position / Scheme Title"
            isRequired
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="e.g. Higher Education Scholarship, Employment Exchange Registration"
            leftIcon={<Briefcase size={16} />}
          />
        </div>

        {/* Job / Scheme Reference Code */}
        <div>
          <Input
            label="Scheme Code / Job Reference ID"
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
            placeholder="e.g. SCHEME-2026-EDU"
            helperText="Auto-generated unique reference identifier for departmental tracking."
            leftIcon={<FileCheck size={16} />}
          />
        </div>

        {/* Information note */}
        <div className="p-3 bg-gov-light/40 border border-gov-blue/20 rounded-xl text-xs text-slate-600 space-y-1">
          <p className="font-bold text-gov-navy">Digital DPDP Consent Step</p>
          <p className="text-[11px] text-slate-500">
            After submission, you will be prompted to grant time-bound digital consent so MahaSetu can securely fetch and verify your records with the concerned department.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <Button type="button" variant="ghost" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            rightIcon={<ArrowRight size={16} />}
          >
            Submit Application
          </Button>
        </div>
      </form>
    </Modal>
  );
};
