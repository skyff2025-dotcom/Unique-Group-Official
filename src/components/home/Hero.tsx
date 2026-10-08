import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { VisualAsset } from '../common/VisualAsset';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export const Hero: React.FC = () => {
  const settings = useSiteSettings();

  return (
    <section className="relative min-h-[85vh] md:min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#050D1A]">
      {/* Background Architectural Artwork with VisualAsset */}
      <div className="absolute inset-0 z-0">
        <VisualAsset
          type="hero"
          alt="Unique Group Estate Architecture"
          className="w-full h-full object-cover scale-105"
        />
        {/* Measured dark scrim for WCAG AA readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050D1A] via-[#050D1A]/60 to-[#050D1A]/75" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-[#050D1A]/90" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 w-full">
        <div className="max-w-3xl space-y-6 sm:space-y-8">
          {/* Small uppercase label */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/10 backdrop-blur-md border border-white/15">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
            <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#E2C98D] uppercase">
              {settings.tagline}
            </span>
          </div>

          {/* Large Editorial Headline */}
          <h1
            className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-[1.08]"
            style={{ textWrap: 'balance' }}
          >
            Your Future.<br />
            <span className="text-[#E2C98D] italic font-normal">Our Commitment.</span>
          </h1>

          {/* Supporting Copy */}
          <p className="text-base sm:text-xl text-slate-200/90 font-light leading-relaxed max-w-2xl">
            Trusted solutions in Real Estate, Insurance and Finance — helping individuals,
            families and businesses in Rajpipla and Gujarat make confident, enduring decisions.
          </p>

          {/* CTAs: Primary + Secondary (Stack vertically on mobile, row on tablet/desktop) */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              to="/properties"
              className="min-h-[50px] inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded bg-[#C5A059] hover:bg-[#D4B46C] text-[#050D1A] font-semibold text-xs uppercase tracking-wider transition-all duration-200 shadow-lg shadow-black/40 group active:scale-[0.99]"
            >
              <span>Explore Properties</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/contact"
              className="min-h-[50px] inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded bg-white/10 hover:bg-white/20 text-white font-medium text-xs uppercase tracking-wider backdrop-blur-md border border-white/20 transition-all duration-200 active:scale-[0.99]"
            >
              <span>Talk to an Advisor</span>
            </Link>
          </div>

          {/* Location & Heritage trust pill */}
          <div className="pt-4 flex items-center gap-4 text-xs text-slate-400">
            <span>{settings.city}, {settings.state}</span>
            <span aria-hidden="true">·</span>
            <span>Led by {settings.founder}</span>
          </div>
        </div>
      </div>

      {/* Subtle Scroll Indicator */}
      <a
        href="#trust-strip"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 text-slate-400 hover:text-[#C5A059] transition-colors focus:outline-none"
        aria-label="Scroll to exploration sections"
      >
        <span className="text-[10px] tracking-[0.25em] uppercase font-medium">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </a>
    </section>
  );
};
