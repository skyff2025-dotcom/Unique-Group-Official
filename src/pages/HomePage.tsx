import React from 'react';
import { Hero } from '../components/home/Hero';
import { TrustStrip } from '../components/home/TrustStrip';
import { ServicesSection } from '../components/home/ServicesSection';
import { FeaturedProperties } from '../components/home/FeaturedProperties';
import { RealEstateFeature } from '../components/home/RealEstateFeature';
import { AboutSection } from '../components/home/AboutSection';
import { DualDivisionPreview } from '../components/home/DualDivisionPreview';
import { CTASection } from '../components/home/CTASection';
import { ContactForm } from '../components/common/ContactForm';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-0">
      {/* 1. Cinematic Hero */}
      <Hero />

      {/* 2. Trust / Value Strip */}
      <TrustStrip />

      {/* 3. Services Showcase (Real Estate, Insurance, Finance) */}
      <ServicesSection />

      {/* 4. Featured Properties Showcase */}
      <FeaturedProperties />

      {/* 5. Real Estate Feature Split-Screen */}
      <RealEstateFeature />

      {/* 6. Editorial About Section */}
      <AboutSection />

      {/* 7. Insurance + Finance Preview */}
      <DualDivisionPreview />

      {/* 8. Full-Width Cinematic CTA */}
      <CTASection />

      {/* 9. Contact Section with Gaurav Shah info & Enquiry Form */}
      <ContactForm />
    </div>
  );
};
