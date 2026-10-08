import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SectionHeading } from '../components/common/SectionHeading';
import { VisualAsset } from '../components/common/VisualAsset';
import { getTestimonials } from '../services/settings';
import { Testimonial } from '../types';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { MapPin, Phone, Mail, Shield, Award, Users, ArrowRight, Quote } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const settings = useSiteSettings();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function loadTestimonials() {
      try {
        const data = await getTestimonials();
        if (isMounted) {
          setTestimonials(data);
        }
      } catch (err) {
        console.warn('Testimonials load notice:', err);
      }
    }
    loadTestimonials();
    return () => {
      isMounted = false;
    };
  }, []);
  return (
    <div className="pt-24 pb-20 space-y-20 sm:space-y-28">
      {/* Page Header */}
      <section className="bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="ABOUT UNIQUE GROUP"
            title="Founded on integrity. Dedicated to your enduring success."
            description="A unified enterprise bringing Real Estate, Insurance, and Finance under a single trusted advisory in Rajpipla, Gujarat."
            className="mb-12"
          />

          {/* Narrative Hero Card */}
          <div className="bg-white rounded-2xl border border-[#E8E4D8] overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-0">
            <div className="lg:col-span-6 relative aspect-[16/11] lg:aspect-auto">
              <VisualAsset
                type="hero"
                alt="Unique Group Headquarters Vision"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
            </div>

            <div className="lg:col-span-6 p-8 sm:p-12 lg:p-14 flex flex-col justify-center space-y-6">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#8C6E2E]">
                Our Origin &amp; Heritage
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A192F] leading-snug">
                One trusted partner for life’s most critical milestones.
              </h3>

              <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
                <p>
                  In a rapidly evolving market, making major property, protection, and financial decisions
                  often forces families and business owners to deal with scattered agents, conflicting advice,
                  and opaque paperwork.
                </p>
                <p>
                  <strong>Unique Group</strong> was established in Rajpipla by <strong>Gaurav Shah</strong> to
                  provide an integrated, ethically grounded alternative. By uniting Real Estate acquisitions,
                  tailored Insurance policies, and competitive institutional Financing, we ensure that every
                  step of your journey is coordinated with clarity and total peace of mind.
                </p>
              </div>

              <div className="pt-4 border-t border-[#F4F2EA] flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase text-slate-400 block tracking-wider">Managing Principal</span>
                  <span className="font-serif text-lg font-bold text-[#0A192F]">
                    {settings.founder}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs uppercase text-slate-400 block tracking-wider">Headquarters</span>
                  <span className="text-xs font-semibold text-[#8C6E2E]">
                    {settings.city}, {settings.state}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 3 Core Pillars */}
      <section className="bg-[#F4F2EA] py-16 sm:py-20 border-y border-[#E8E4D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#8C6E2E] block mb-2">
              OUR GUIDING PILLARS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0A192F]">
              Trust · Protection · Growth
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border border-[#E8E4D8] space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-[#FAF4E5] border border-[#C5A059]/40 flex items-center justify-center text-[#8C6E2E]">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#0A192F]">
                Trust
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Absolute transparency in title clearance, verified property documents, and honest terms.
                We believe reputation is built over decades of unswerving loyalty to our clients.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-[#E8E4D8] space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-[#FAF4E5] border border-[#C5A059]/40 flex items-center justify-center text-[#8C6E2E]">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#0A192F]">
                Protection
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Securing your family’s health and your business’s physical assets against unexpected disruptions
                through premier insurance partners with sterling cashless settlement track records.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-[#E8E4D8] space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-[#FAF4E5] border border-[#C5A059]/40 flex items-center justify-center text-[#8C6E2E]">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#0A192F]">
                Growth
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Empowering real estate acquisitions and business expansion with structured financing,
                sound mortgage structuring, and strategic land investments across Gujarat’s high-potential corridors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Client Evidence & Testimonials (Hidden completely if no active testimonials) */}
      {testimonials.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="REAL PERSPECTIVES"
            title="What our clients say about working with us."
            description="Direct accounts from residents, professionals, and business owners in Rajpipla and surrounding districts."
            className="mb-14"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-white p-8 rounded-xl border border-[#E8E4D8] flex flex-col justify-between shadow-sm space-y-6"
              >
                <div className="space-y-4">
                  <Quote className="w-8 h-8 text-[#C5A059]/50" />
                  <p className="text-sm text-slate-700 leading-relaxed italic">
                    "{t.content}"
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F4F2EA]">
                  <span className="font-serif text-base font-bold text-[#0A192F] block">
                    {t.authorName}
                  </span>
                  <span className="text-xs text-slate-500">
                    {t.authorLocation} · {t.serviceCategory}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Direct Contact Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0A192F] rounded-2xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-[#1E3A5F]">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E2C98D]">
              Start the Conversation
            </span>
            <h3 className="font-serif text-3xl font-bold text-white">
              Speak directly with {settings.founder}.
            </h3>
            <p className="text-sm text-slate-300">
              {settings.addressLine1}, {settings.addressLine2}, {settings.city}, {settings.state}. We welcome personal appointments and preliminary consultations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a
              href={`tel:${settings.phone}`}
              className="min-h-[48px] px-6 py-3 rounded bg-[#C5A059] text-[#050D1A] font-bold text-xs uppercase tracking-wider hover:bg-[#D4B46C] transition-colors"
            >
              Call {settings.displayPhone}
            </a>
            <Link
              to="/contact"
              className="min-h-[48px] px-6 py-3 rounded bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider border border-white/20 transition-colors"
            >
              Contact Office
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
