import React from 'react';
import { Link } from 'react-router-dom';
import { SectionHeading } from '../common/SectionHeading';
import { MapPin, Shield, Layers, ArrowRight } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export const AboutSection: React.FC = () => {
  const settings = useSiteSettings();
  const cards = [
    {
      icon: MapPin,
      title: 'Local Expertise',
      description: `Rooted directly in ${settings.city} with authentic ground-level relationships across Narmada district.`,
    },
    {
      icon: Shield,
      title: 'Trusted Guidance',
      description: `Transparent counsel led by ${settings.founder}, ensuring every agreement protects your family or enterprise.`,
    },
    {
      icon: Layers,
      title: '3 Core Services',
      description: 'Real Estate, Insurance, and Finance integrated seamlessly so you never deal with disconnected intermediaries.',
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#FAF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-16">
          <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#8C6E2E]">
            ABOUT {settings.businessName}
          </span>
          <h2
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#0A192F] leading-tight"
            style={{ textWrap: 'balance' }}
          >
            Built on trust.<br />
            <span className="italic font-normal text-[#8C6E2E]">Focused on your future.</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto pt-2">
            {settings.businessName} brings together Real Estate, Insurance and Finance under one trusted business,
            providing personalized guidance and practical solutions for individuals, families and businesses.
          </p>
        </div>

        {/* Value Cards: Authentic qualitative pillars (No fake invented metrics) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-white p-8 rounded-xl border border-[#E8E4D8] hover:border-[#C5A059] shadow-sm hover:shadow-md transition-all duration-300 text-center space-y-4 group"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-[#FAF4E5] border border-[#C5A059]/40 flex items-center justify-center text-[#8C6E2E] group-hover:bg-[#0A192F] group-hover:text-[#E2C98D] group-hover:border-[#0A192F] transition-all duration-300">
                  <Icon className="w-6 h-6 stroke-[1.75]" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#0A192F]">
                  {card.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Read More Link */}
        <div className="text-center pt-12">
          <Link
            to="/about"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0A192F] hover:text-[#8C6E2E] transition-colors pb-1 border-b border-[#0A192F] hover:border-[#8C6E2E]"
          >
            <span>Learn More About Our Philosophy</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
