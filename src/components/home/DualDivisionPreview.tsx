import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Landmark } from 'lucide-react';
import { VisualAsset } from '../common/VisualAsset';

export const DualDivisionPreview: React.FC = () => {
  return (
    <section className="py-20 sm:py-24 bg-[#FAF9F5] border-t border-[#E8E4D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* LEFT: Insurance Card */}
          <div className="group relative rounded-2xl overflow-hidden bg-[#0A192F] text-white border border-[#1E3A5F] shadow-lg flex flex-col justify-between">
            <div className="relative aspect-[16/9] overflow-hidden">
              <VisualAsset
                type="insurance"
                alt="Unique Group Insurance Protection"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/60 to-transparent" />
              <div className="absolute top-5 left-5">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded bg-[#C5A059] text-[#050D1A]">
                  INSURANCE
                </span>
              </div>
            </div>

            <div className="p-8 sm:p-10 space-y-5 -mt-6 relative z-10">
              <div className="flex items-center gap-2 text-xs text-[#E2C98D] font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                <span>Life · Health · General · Commercial</span>
              </div>

              <h3 className="font-serif text-3xl sm:text-4xl font-bold leading-tight text-white">
                Protection that fits<br />your needs.
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed">
                Safeguard what matters most with proven plans from top national insurers.
                From cashless health cover for your family to property risk protection for your enterprise.
              </p>

              <div className="pt-2">
                <Link
                  to="/insurance"
                  className="min-h-[46px] inline-flex items-center gap-2 px-6 py-3 rounded bg-white/10 hover:bg-[#C5A059] text-white hover:text-[#050D1A] text-xs font-bold uppercase tracking-wider transition-all duration-200 border border-white/20 hover:border-[#C5A059]"
                >
                  <span>Explore Insurance</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT: Finance Card */}
          <div className="group relative rounded-2xl overflow-hidden bg-[#0A192F] text-white border border-[#1E3A5F] shadow-lg flex flex-col justify-between">
            <div className="relative aspect-[16/9] overflow-hidden">
              <VisualAsset
                type="finance"
                alt="Unique Group Financial Solutions"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/60 to-transparent" />
              <div className="absolute top-5 left-5">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded bg-[#C5A059] text-[#050D1A]">
                  FINANCE
                </span>
              </div>
            </div>

            <div className="p-8 sm:p-10 space-y-5 -mt-6 relative z-10">
              <div className="flex items-center gap-2 text-xs text-[#E2C98D] font-semibold uppercase tracking-wider">
                <Landmark className="w-4 h-4 text-[#C5A059]" />
                <span>Home Loans · MSME · LAP · Commercial</span>
              </div>

              <h3 className="font-serif text-3xl sm:text-4xl font-bold leading-tight text-white">
                Solutions designed<br />around your goals.
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed">
                Access structured financing from premier banks and institutions.
                We eliminate paperwork hurdles to secure competitive rates for home purchase or capital expansion.
              </p>

              <div className="pt-2">
                <Link
                  to="/finance"
                  className="min-h-[46px] inline-flex items-center gap-2 px-6 py-3 rounded bg-white/10 hover:bg-[#C5A059] text-white hover:text-[#050D1A] text-xs font-bold uppercase tracking-wider transition-all duration-200 border border-white/20 hover:border-[#C5A059]"
                >
                  <span>Explore Finance</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
