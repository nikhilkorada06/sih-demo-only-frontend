import React from 'react';
import { HeroBannerCarousel } from '../components/home/HeroBannerCarousel';
import { WhatsNewSection } from '../components/home/WhatsNewSection';
import { PopularServicesSection } from '../components/home/PopularServicesSection';
import { BenefitsSection } from '../components/home/BenefitsSection';
import { CategoriesSection } from '../components/home/CategoriesSection';
import { HowItWorksSection } from '../components/home/HowItWorksSection';
import { NeedHelpSection } from '../components/home/NeedHelpSection';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* 1. Full-width supplied image carousel */}
      <HeroBannerCarousel />

      {/* 2. What's New Department Horizontal Carousel */}
      <WhatsNewSection />

      {/* 3. Popular Citizen Services Horizontal Carousel */}
      <PopularServicesSection />

      {/* 4. Benefits of MahaSetu (2 x 2 Static White Cards on #00599F) */}
      <BenefitsSection />

      {/* 5. Categories (3 x 2 Flip Cards with Isolated Hover State) */}
      <CategoriesSection />

      {/* 6. How MahaSetu Works (Six-step citizen journey) */}
      <HowItWorksSection />

      {/* 7. Citizen support */}
      <NeedHelpSection />
    </div>
  );
};
