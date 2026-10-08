import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { VisualAsset } from '../common/VisualAsset';

export const RealEstateFeature: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-[#0A192F] text-white relative overflow-hidden">
      {/* Subtle gold decorative glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* LEFT: Large Property/Land Visual Showcase (7 cols) */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl overflow-hidden border border-[#243854] shadow-2xl group">
              <div className="aspect-[16/11] sm:aspect-[16/10] w-full">
                <VisualAsset
                  type="land"
                  alt="Clear NA Land and Development in Rajpipla"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Inset highlight card */}
              <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:max-w-sm p-4 rounded-xl bg-[#050D1A]/90 backdrop-blur-md border border-[#C5A059]/40 text-xs space-y-1">
                <span className="font-semibold text-[#E2C98D] block uppercase tracking-wider text-[10px]">
                  Growth Corridor Focus
                </span>
                <p className="text-slate-300">
                  Approved NA land parcels &amp; prime commercial hubs spanning the Rajpipla–Poicha–Narmada tourism belt.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Editorial Content & CTA (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#E2C98D] block">
                REAL ESTATE
              </span>
              <h2
                className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[1.12]"
                style={{ textWrap: 'balance' }}
              >
                More than property.<br />
                <span className="italic font-normal text-[#E2C98D]">It’s an opportunity.</span>
              </h2>
            </div>

            <p className="text-slate-300 text-base leading-relaxed">
              Whether you are acquiring prime agricultural/NA land for capital appreciation,
              investing in commercial showroom frontage on M.V. Road, or selecting an
              architectural family bungalow, Unique Group provides meticulous title vetting,
              uncompromising transparency, and local market mastery.
            </p>

            <ul className="space-y-3 pt-2 text-sm text-slate-200">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#112240] border border-[#C5A059] flex items-center justify-center shrink-0 text-[#E2C98D]">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>100% Verified Legal Titles &amp; Revenue Record Clearance</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#112240] border border-[#C5A059] flex items-center justify-center shrink-0 text-[#E2C98D]">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Direct Access to Exclusive Sellers &amp; Prime Landowners</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#112240] border border-[#C5A059] flex items-center justify-center shrink-0 text-[#E2C98D]">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Integrated Home &amp; Commercial Mortgage Sanction</span>
              </li>
            </ul>

            <div className="pt-4">
              <Link
                to="/properties"
                className="min-h-[48px] inline-flex items-center gap-3 px-7 py-3 rounded bg-[#C5A059] hover:bg-[#D4B46C] text-[#050D1A] font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md group"
              >
                <span>View All Properties</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
