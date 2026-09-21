import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Carousel } from '../common/Carousel';
import { ASSETS } from '../../assets/assets';

const DEPARTMENTS = [
  { title: 'Revenue Department', logo: ASSETS.stateEmblem, alt: 'Government of Maharashtra', url: 'https://rfd.maharashtra.gov.in/' },
  { title: 'School Education Department', logo: ASSETS.stateEmblem, alt: 'Government of Maharashtra', url: 'https://education.maharashtra.gov.in/' },
  { title: 'Skill Development, Employment & Entrepreneurship Department', logo: ASSETS.mahaswayamLogo, alt: 'Skill Development, Employment, Entrepreneurship and Innovation Department, Government of Maharashtra', url: 'https://www.mahaswayam.gov.in/' },
  { title: 'Transport Department', logo: ASSETS.transportLogo, alt: 'Motor Vehicles Department, Maharashtra', url: 'https://transport.maharashtra.gov.in/' },
  { title: 'Social Justice & Special Assistance Department', logo: ASSETS.stateEmblem, alt: 'Government of Maharashtra', url: 'https://sjsa.maharashtra.gov.in/' },
  { title: 'Public Health Department', logo: ASSETS.stateEmblem, alt: 'Government of Maharashtra', url: 'https://phd.maharashtra.gov.in/' },
  { title: 'Rural Development Department', logo: ASSETS.stateEmblem, alt: 'Government of Maharashtra', url: 'https://rdd.maharashtra.gov.in/' }
];

export const WhatsNewSection: React.FC = () => (
  <section className="py-10 sm:py-14 bg-white border-b border-gov-border" aria-labelledby="whats-new-heading">
    <div className="max-w-portal mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-7 gap-3">
        <div>
          <h2 id="whats-new-heading" className="text-2xl sm:text-3xl font-bold text-gov-textPrimary tracking-tight">What's New ?</h2>
          <p className="text-sm sm:text-base text-gov-textSecondary mt-1">Citizens can explore the latest updates and newly added government services on MahaSetu.</p>
        </div>
        <Link to="/departments" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gov-blue shrink-0">View All Departments <ArrowRight size={16} /></Link>
      </div>
      <Carousel itemWidth={240} label="What's New departments">
        {DEPARTMENTS.map(item => (
          <a key={item.title} href={item.url} target="_blank" rel="noopener noreferrer" aria-label={`${item.title} — official website (opens in a new tab)`}
            className="portal-service-card w-[220px] sm:w-[240px] shrink-0 rounded-xl bg-white border border-gov-border shadow-portal min-h-[220px] p-5 flex flex-col items-center text-center gap-4">
            <div className={`official-logo-surface w-full h-24 flex items-center justify-center rounded-lg ${item.logo === ASSETS.mahaswayamLogo ? 'department-logo-blue' : ''}`}>
              <img src={item.logo} alt={item.alt} className="max-w-full max-h-20 object-contain" loading="lazy" />
            </div>
            <h3 className="font-semibold text-sm text-gov-textPrimary leading-relaxed">{item.title}</h3>
          </a>
        ))}
      </Carousel>
    </div>
  </section>
);
