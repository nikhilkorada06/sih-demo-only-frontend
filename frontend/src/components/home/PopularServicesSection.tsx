import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  ShieldCheck,
  Users,
  GraduationCap,
  Briefcase,
  FileCheck2,
  Car,
  Landmark,
  ArrowRight
} from 'lucide-react';
import { Carousel } from '../common/Carousel';

interface PopularService {
  id: string;
  title: string;
  titleMr: string;
  department: string;
  icon: React.ReactNode;
}

const POPULAR_SERVICES: PopularService[] = [
  {
    id: 'ps-1',
    title: 'Income Certificate',
    titleMr: 'उत्पन्नाचा दाखला',
    department: 'Revenue Department',
    icon: <FileText className="w-9 h-9 text-gov-blue" />
  },
  {
    id: 'ps-2',
    title: 'Domicile Certificate',
    titleMr: 'वय, अधिवास व राष्ट्रीयत्व दाखला',
    department: 'Revenue Department',
    icon: <ShieldCheck className="w-9 h-9 text-gov-blue" />
  },
  {
    id: 'ps-3',
    title: 'Caste Certificate',
    titleMr: 'जातीचे प्रमाणपत्र',
    department: 'Social Justice Department',
    icon: <Users className="w-9 h-9 text-gov-blue" />
  },
  {
    id: 'ps-4',
    title: 'Education Verification',
    titleMr: 'शैक्षणिक पात्रता पडताळणी',
    department: 'Higher Education Department',
    icon: <GraduationCap className="w-9 h-9 text-gov-blue" />
  },
  {
    id: 'ps-5',
    title: 'Employment Verification',
    titleMr: 'रोजगार नोंदणी पडताळणी',
    department: 'Skill Development Department',
    icon: <Briefcase className="w-9 h-9 text-gov-blue" />
  },
  {
    id: 'ps-6',
    title: 'Document Verification',
    titleMr: 'कागदपत्र डिजिटल पडताळणी',
    department: 'MahaSetu Documents',
    icon: <FileCheck2 className="w-9 h-9 text-gov-blue" />
  },
  {
    id: 'ps-7',
    title: 'Birth Certificate',
    titleMr: 'जन्म प्रमाणपत्र',
    department: 'Local Government',
    icon: <Landmark className="w-9 h-9 text-gov-blue" />
  },
  {
    id: 'ps-8',
    title: 'Death Certificate',
    titleMr: 'मृत्यू प्रमाणपत्र',
    department: 'Local Government',
    icon: <FileText className="w-9 h-9 text-gov-blue" />
  }
];

export const PopularServicesSection: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 bg-white border-b border-gov-border" aria-labelledby="popular-services-heading">
      <div className="max-w-portal mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 id="popular-services-heading" className="text-2xl sm:text-3xl font-bold text-gov-textPrimary tracking-tight">
              Popular Service
            </h2>
            <p className="text-sm sm:text-base text-gov-textSecondary mt-1">
              Explore the popularly used government services available through MahaSetu.
            </p>
          </div>

          <Link
            to="/departments"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gov-blue hover:text-gov-dark transition-colors"
          >
            <span>Browse All Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Carousel of compact service cards with isolated per-card hover */}
        <Carousel itemWidth={240} label="Popular Service">
          {POPULAR_SERVICES.map((srv) => (
            <div
              key={srv.id}
              className="portal-service-card w-[230px] sm:w-[240px] flex-shrink-0 flex flex-col justify-between p-5 text-center rounded-xl bg-white border border-gov-border shadow-portal "
            >
              <div className="space-y-3">
                <div className="mx-auto w-24 h-24 rounded-xl bg-gov-lightblue flex items-center justify-center">
                  {srv.icon}
                </div>

                <div>
                  <h3 className="font-bold text-sm sm:text-base text-gov-textPrimary line-clamp-2">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-marathi mt-0.5 line-clamp-2">
                    {srv.titleMr}
                  </p>
                  <p className="text-xs text-gov-textSecondary line-clamp-2 mt-1">
                    {srv.department}
                  </p>
                </div>
              </div>

              <div className="pt-3.5 mt-3 border-t border-gov-border flex items-center justify-center text-xs">
                <Link
                  to={srv.id === 'ps-6' ? '/documents' : '/departments'}
                  className="font-bold text-gov-blue hover:text-gov-dark flex items-center gap-1"
                >
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
};
