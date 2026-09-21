import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Briefcase,
  Building2,
  CheckCircle2,
  ExternalLink,
  Phone,
  ArrowRight
} from 'lucide-react';
import { departmentApi } from '../api/department.api';
import { Department } from '../types/department.types';
import { Button } from '../components/common/Button';

// Fallback metadata to make the dynamic departments look as realistic as the original mock data
const DEPARTMENT_METADATA: Record<string, any> = {
  EDUCATION: {
    nameMr: 'उच्च व तंत्रशिक्षण विभाग, महाराष्ट्र शासन',
    helpline: '1800-120-8040 (Ext: 101)',
    protocol: 'REST',
    services: [
      { name: 'Degree & Graduation Certificate Verification', type: 'REST Canonical Match', sla: 'Instant' },
      { name: 'Higher Secondary & Diploma Record Search', type: 'Automated Lookup', sla: 'Instant' },
      { name: 'Post-Matric Scholarship Eligibility Check', type: 'Database Query', sla: '24 Hours' }
    ]
  },
  EMPLOYMENT: {
    nameMr: 'कौशल्य विकास, रोजगार व उद्योजकता विभाग',
    helpline: '1800-120-8040 (Ext: 102)',
    protocol: 'SOAP',
    services: [
      { name: 'Employment Exchange Registration Verification', type: 'SOAP WSDL Adapter', sla: 'Instant' },
      { name: 'Vocational Skill Certification Validation', type: 'State Register Lookup', sla: 'Instant' },
      { name: 'Youth Apprenticeship & Job Placement Bridge', type: 'Department Registry', sla: '48 Hours' }
    ]
  },
  EMP_EXCHANGE: {
    nameMr: 'कौशल्य विकास, रोजगार व उद्योजकता विभाग',
    helpline: '1800-120-8040 (Ext: 102)',
    protocol: 'SOAP',
    services: [
      { name: 'Employment Exchange Registration Verification', type: 'SOAP WSDL Adapter', sla: 'Instant' },
      { name: 'Vocational Skill Certification Validation', type: 'State Register Lookup', sla: 'Instant' },
      { name: 'Youth Apprenticeship & Job Placement Bridge', type: 'Department Registry', sla: '48 Hours' }
    ]
  }
};

const getFallbackMetadata = (code: string) => {
  if (DEPARTMENT_METADATA[code]) return DEPARTMENT_METADATA[code];
  return {
    nameMr: 'महाराष्ट्र शासन विभाग',
    helpline: '1800-120-8000 (General)',
    protocol: 'API',
    services: [
      { name: 'Citizen Data Verification', type: 'API Match', sla: 'Instant' },
      { name: 'Automated Record Lookup', type: 'Database Query', sla: 'Automated' }
    ]
  };
};

export const DepartmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const data = await departmentApi.getDepartments();
        setDepartments(data);
      } catch (err) {
        console.error('Failed to load departments', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDepts();
  }, []);

  return (
    <div className="bg-white min-h-screen py-8 sm:py-12">
      <div className="max-w-portal mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-gov-lightblue text-gov-blue text-xs font-bold uppercase tracking-wider mb-2 border border-gov-border">
            <Building2 size={14} className="text-gov-blue" />
            <span>State Secretariat & Administrative Departments</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gov-dark tracking-tight">
            Integrated Government Departments
          </h1>
          <p className="text-xs sm:text-sm text-gov-textSecondary mt-2 leading-relaxed">
            Connected to MahaSetu's interoperable Generic Integration Engine for instant, paperless citizen verification.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {loading ? (
             <div className="col-span-full text-center text-slate-500 py-10">Loading departments...</div>
          ) : departments.map((dept) => {
            const meta = getFallbackMetadata(dept.code);
            return (
              <div
                key={dept.code}
                className="bg-white rounded-2xl border border-gov-border hover:border-gov-blue shadow-portal hover:shadow-portal-hover transition-all p-6 sm:p-8 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-5">
                  {/* Header Strip */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 rounded-xl bg-gov-lightblue flex items-center justify-center border border-gov-border shadow-xs text-gov-blue">
                        {dept.code.includes('EDU') ? (
                          <GraduationCap size={28} />
                        ) : dept.code.includes('EMP') ? (
                          <Briefcase size={28} />
                        ) : (
                          <Building2 size={28} />
                        )}
                      </div>
                      <div>
                        <h2 className="text-lg sm:text-xl font-bold text-gov-dark leading-snug">
                          {dept.name}
                        </h2>
                        <p className="text-xs text-gov-blue font-marathi font-semibold mt-0.5">
                          {meta.nameMr}
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold bg-green-50 text-green-700 border border-green-200 flex-shrink-0">
                      <CheckCircle2 size={13} className="text-green-600" />
                      <span>{dept.active ? `${meta.protocol} Connected` : 'Offline'}</span>
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-gov-textSecondary leading-relaxed">
                    {dept.description || 'No description available for this department.'}
                  </p>

                  {/* Available Services Table / List */}
                  <div>
                    <h3 className="text-xs font-bold text-gov-blue uppercase tracking-wider mb-2.5">
                      Integrated Online Verification Services:
                    </h3>
                    <div className="space-y-2">
                      {meta.services.map((srv: any) => (
                        <div
                          key={srv.name}
                          className="p-3 rounded-lg bg-gov-surface border border-gov-border flex items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <p className="font-semibold text-gov-textPrimary">{srv.name}</p>
                            <p className="text-[11px] text-gov-textSecondary">{srv.type}</p>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-gov-blue border border-gov-border">
                            {srv.sla}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Data Categories */}
                  <div>
                    <span className="text-[11px] font-bold text-gov-textSecondary uppercase tracking-wider block mb-1.5">
                      Shared Data Schema (DPDP Consent Controlled):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {dept.dataCategories && dept.dataCategories.length > 0 ? dept.dataCategories.map((cat) => (
                        <span
                          key={cat}
                          className="px-2.5 py-1 text-[11px] font-medium bg-gov-lightblue text-gov-blue rounded border border-gov-border"
                        >
                          {cat}
                        </span>
                      )) : <span className="text-xs text-slate-400">No categories specified</span>}
                    </div>
                  </div>
                </div>

                {/* Bottom Footer Actions */}
                <div className="pt-4 border-t border-gov-border flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-gov-textSecondary">
                    <Phone size={14} className="text-gov-blue" />
                    <span>Helpline: <strong>{meta.helpline}</strong></span>
                  </div>

                  {dept.frontendUrl ? (
                    <a
                      href={dept.frontendUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-gov-blue hover:text-gov-dark"
                    >
                      <span>Official Portal</span>
                      <ExternalLink size={13} />
                    </a>
                  ) : (
                    <span className="text-slate-400 italic">No Portal URL Provided</span>
                  )}
                  {(dept.code === 'EMPLOYMENT' || dept.code === 'EMP_EXCHANGE') && <Button size="sm" onClick={() => { if(dept.frontendUrl) { window.open(dept.frontendUrl, '_blank'); } else { navigate('/employment'); } }} rightIcon={<ArrowRight size={14} />}>Explore Services</Button>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
