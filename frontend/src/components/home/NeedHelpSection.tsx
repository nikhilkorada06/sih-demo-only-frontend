import React from 'react';
import { Link } from 'react-router-dom';
import { Headset, MessageCircleMore, ArrowRight } from 'lucide-react';

export const NeedHelpSection: React.FC = () => (
  <section className="py-12 sm:py-16 bg-white" aria-labelledby="need-help-heading">
    <div className="max-w-portal mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] bg-white border border-slate-300 px-7 py-9 sm:px-12 sm:py-12 flex flex-col sm:flex-row items-center justify-between gap-8">
        <div className="max-w-xl">
          <h2 id="need-help-heading" className="text-2xl sm:text-4xl font-semibold text-gov-blue">Need help with a service?</h2>
          <p className="text-sm sm:text-base text-gov-textSecondary leading-relaxed mt-3">Find answers about applying, giving consent, and tracking your request. Our help centre guides you through each step.</p>
          <div className="flex flex-wrap items-center gap-5 mt-6">
            <Link to="/help" className="inline-flex items-center gap-2 rounded-lg bg-gov-blue text-white px-5 py-3 text-sm font-semibold hover:bg-gov-dark">Get Support <ArrowRight size={17} /></Link>
            <Link to="/grievances" className="text-sm font-semibold text-gov-blue underline underline-offset-4">Grievance Support</Link>
          </div>
        </div>
        {/* Open-source Lucide line artwork; no stock or generated person. */}
        <div className="relative shrink-0 w-44 h-40 sm:w-56 sm:h-48 flex items-center justify-center text-gov-blue" aria-hidden="true">
          <div className="absolute inset-3 rounded-full bg-gov-lightblue/70" />
          <Headset className="relative w-28 h-28 sm:w-36 sm:h-36" strokeWidth={1.25} />
          <MessageCircleMore className="absolute top-0 right-0 w-16 h-16 fill-gov-lightblue" strokeWidth={1.3} />
        </div>
      </div>
    </div>
  </section>
);
