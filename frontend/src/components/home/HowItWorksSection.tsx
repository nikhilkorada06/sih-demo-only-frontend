import React, { useEffect, useRef, useState } from 'react';
import { Building2, ListChecks, FileEdit, KeyRound, ShieldCheck, SearchCheck } from 'lucide-react';

const STEPS = [
  { title: 'Select Department', description: 'Find the department responsible for your request.', icon: Building2 },
  { title: 'Choose Service', description: 'Review the service and its requirements.', icon: ListChecks },
  { title: 'Submit Application', description: 'Enter your details and submit your application.', icon: FileEdit },
  { title: 'Give Consent', description: 'Choose which records may be shared for verification.', icon: KeyRound },
  { title: 'Cross-Department Verification', description: 'Departments check the records you have authorised.', icon: ShieldCheck },
  { title: 'Track Application', description: 'Follow the status and review updates in your account.', icon: SearchCheck }
];

export const HowItWorksSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.15 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);
  return (
    <section ref={sectionRef} className="py-14 sm:py-16 bg-gov-surface border-b border-gov-border" aria-labelledby="how-it-works-heading">
      <div className="max-w-portal mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 id="how-it-works-heading" className="text-2xl sm:text-3xl font-bold text-gov-dark">How MahaSetu Works</h2>
          <p className="mt-2 text-sm sm:text-base text-gov-textSecondary">From finding a service to tracking your application, follow these six simple steps.</p>
        </div>
        <ol className={`citizen-journey grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-7 lg:gap-4 ${visible ? 'journey-visible' : ''}`}>
          {STEPS.map(({ title, description, icon: Icon }, index) => (
            <li key={title} className="journey-step relative" style={{ '--step-delay': `${index * 90}ms` } as React.CSSProperties}>
              <div className="journey-marker relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white border border-gov-blue/25 text-gov-blue shadow-portal">
                <Icon size={27} strokeWidth={1.7} aria-hidden="true" />
                <span className="absolute -top-2 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gov-blue text-white text-xs font-semibold">{index + 1}</span>
              </div>
              <h3 className="text-sm font-bold text-gov-textPrimary text-center lg:min-h-10">{title}</h3>
              <p className="text-xs text-gov-textSecondary leading-relaxed mt-2 text-center max-w-xs mx-auto">{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
