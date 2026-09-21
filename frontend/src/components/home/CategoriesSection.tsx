import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Briefcase,
  HeartPulse,
  Landmark,
  Car,
  Users,
  ArrowRight,
  RotateCw
} from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  nameMr: string;
  description: string;
  services: string[];
  icon: React.ReactNode;
  route: string;
}

const CATEGORIES_DATA: CategoryItem[] = [
  {
    id: 'cat-education',
    name: 'Education',
    nameMr: 'शिक्षण व शिष्यवृत्ती',
    description: 'Scholarships, certificates, examination records, and automated degree verification services.',
    services: ['Post-Matric Scholarships', 'Degree Verification', 'RTE Admissions'],
    icon: <GraduationCap className="w-8 h-8 text-gov-blue" />,
    route: '/departments'
  },
  {
    id: 'cat-employment',
    name: 'Employment',
    nameMr: 'रोजगार व कौशल्य',
    description: 'MahaSwayam job registration, vocational skill programs, and employment exchange services.',
    services: ['MahaSwayam Portal', 'Candidate Registration', 'Apprenticeships'],
    icon: <Briefcase className="w-8 h-8 text-gov-blue" />,
    route: '/employment'
  },
  {
    id: 'cat-health',
    name: 'Health & Wellness',
    nameMr: 'आरोग्य व वैद्यकीय',
    description: 'Mahatma Jyotirao Phule Jan Arogya Yojana, hospital schemes, and digital health cards.',
    services: ['MJPJAY Scheme', 'Ayushman Health ID', 'Hospital Empanelment'],
    icon: <HeartPulse className="w-8 h-8 text-gov-blue" />,
    route: '/departments'
  },
  {
    id: 'cat-revenue',
    name: 'Revenue & Certificates',
    nameMr: 'महसूल व दाखले',
    description: '7/12 land records, income certificates, domicile, caste certificates, and non-creamy layer.',
    services: ['7/12 Digital Extract', 'Income Certificate', 'Domicile Certificate'],
    icon: <Landmark className="w-8 h-8 text-gov-blue" />,
    route: '/departments'
  },
  {
    id: 'cat-transport',
    name: 'Transport',
    nameMr: 'परिवहन व वाहन',
    description: 'Driving licences, learner permits, vehicle registrations, and RTO citizen services.',
    services: ['Driving Licence', 'Learner Permit', 'Vahan Registration'],
    icon: <Car className="w-8 h-8 text-gov-blue" />,
    route: '/departments'
  },
  {
    id: 'cat-welfare',
    name: 'Social Welfare',
    nameMr: 'सामाजिक न्याय व कल्याण',
    description: 'Direct Benefit Transfer (DBT), pension schemes, women empowerment, and minority welfare.',
    services: ['Majhi Ladki Bahin', 'Sanjay Gandhi Niradhar', 'DBT Subsidies'],
    icon: <Users className="w-8 h-8 text-gov-blue" />,
    route: '/departments'
  }
];

// Each category owns its flip state. No section-level hover state or group selector.
const CategoryCard: React.FC<{ category: CategoryItem }> = ({ category: cat }) => {
  const [flipped, setFlipped] = useState(false);
  return (
    <article className="category-card relative perspective-1000" data-flipped={flipped}
      onPointerEnter={event => { if (event.pointerType === 'mouse') setFlipped(true); }}
      onPointerLeave={event => { if (!event.currentTarget.contains(document.activeElement)) setFlipped(false); }}
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFlipped(false); }}
      onKeyDown={event => { if (event.key === 'Escape') { setFlipped(false); event.currentTarget.querySelector<HTMLButtonElement>('button')?.focus(); } }}>
      <button type="button" aria-label={`${flipped ? 'Hide' : 'Show'} ${cat.name} services`} aria-expanded={flipped}
        aria-controls={`${cat.id}-services`} onClick={() => setFlipped(value => !value)}
        className={`category-toggle absolute z-10 right-3 top-3 p-2 rounded-full ${flipped ? 'text-white hover:bg-white/15' : 'text-gov-blue hover:bg-gov-lightblue'}`}>
        <RotateCw size={16} />
      </button>
      <div className={`category-inner grid preserve-3d transition-transform duration-[600ms] ${flipped ? 'rotate-y-180' : ''}`}>
        <div aria-hidden={flipped} onClick={() => setFlipped(true)} className="category-front [grid-area:1/1] min-h-[15rem] bg-white rounded-xl p-6 shadow-portal border border-gov-border backface-hidden cursor-pointer flex flex-col justify-center">
          <div className="flex items-start gap-4 pr-3">
            <div className="w-14 h-14 rounded-full bg-gov-lightblue flex items-center justify-center shrink-0">{cat.icon}</div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-gov-textPrimary">{cat.name}</h3>
              <p className="text-xs text-gov-textSecondary font-marathi mt-1">{cat.nameMr}</p>
              <p className="text-sm text-gov-textSecondary leading-relaxed mt-2">{cat.description}</p>
            </div>
          </div>
        </div>
        <div id={`${cat.id}-services`} aria-hidden={!flipped} className="category-back [grid-area:1/1] min-h-[15rem] rounded-xl p-5 shadow-portal backface-hidden rotate-y-180 flex flex-col justify-between gap-3">
          <div>
            <h3 className="text-base font-bold pr-9">{cat.name} Services</h3>
            <p className="text-xs mt-2 leading-relaxed">Explore services and guidance for {cat.name.toLowerCase()}.</p>
            <ul className="text-xs mt-3 space-y-1 list-disc pl-4">
              {cat.services.map(service => <li key={service}>{service}</li>)}
            </ul>
          </div>
          <Link to={cat.route} tabIndex={flipped ? 0 : -1} className="inline-flex self-start items-center gap-2 rounded-md border border-white/70 px-4 py-2 text-xs font-semibold hover:bg-white/15">
            Explore <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
};

export const CategoriesSection: React.FC = () => (
  <section className="py-14 sm:py-20 bg-white border-b border-gov-border" aria-labelledby="categories-heading">
    <div className="max-w-portal mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div className="max-w-2xl">
          <h2 id="categories-heading" className="text-2xl sm:text-3xl font-bold text-gov-textPrimary tracking-tight">Categories</h2>
          <p className="text-sm sm:text-base text-gov-textSecondary mt-2 leading-relaxed">Explore Maharashtra Government services by category to find the applications, certificates, and support relevant to you.</p>
        </div>
        <Link to="/departments" className="inline-flex self-start items-center gap-2 px-4 py-3 rounded-lg border border-gov-blue text-gov-blue text-sm font-semibold shrink-0">Explore All Categories <ArrowRight size={16} /></Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES_DATA.map(category => <CategoryCard key={category.id} category={category} />)}
      </div>
    </div>
  </section>
);
