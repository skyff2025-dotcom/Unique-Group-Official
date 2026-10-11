import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SectionHeading } from '../components/common/SectionHeading';
import { VisualAsset } from '../components/common/VisualAsset';
import { getFinanceCompanies, getFinanceServices } from '../services/finance';
import { FinanceCompany, FinanceService } from '../types';
import { ArrowRight, Landmark, Home, Briefcase, Percent, CheckCircle2, MessageSquare, Phone } from 'lucide-react';
import { CompanyCardSkeleton, PlanCardSkeleton } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';
import { EnquiryModal } from '../components/common/EnquiryModal';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { buildWhatsAppUrl, WHATSAPP_CONFIG } from '../lib/whatsapp';

export const FinancePage: React.FC = () => {
  const settings = useSiteSettings();
  const [companies, setCompanies] = useState<FinanceCompany[]>([]);
  const [services, setServices] = useState<FinanceService[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<FinanceService | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const [cData, sData] = await Promise.all([
          getFinanceCompanies(),
          getFinanceServices(),
        ]);
        if (isMounted) {
          if (cData) setCompanies(cData);
          if (sData) setServices(sData);
        }
      } catch (err) {
        console.warn('Finance page data fetch fallback:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = [
    {
      icon: Home,
      title: 'Home Loans',
      description: 'Competitive interest rates for purchasing bungalows, ready apartments, or constructing on your owned NA plot in Rajpipla.',
    },
    {
      icon: Briefcase,
      title: 'Business & MSME Loans',
      description: 'Working capital, machinery loans, and cash credit facilities to fuel local enterprises and trade expansion.',
    },
    {
      icon: Landmark,
      title: 'Loan Against Property (LAP)',
      description: 'Unlock high-quantum capital by leveraging the existing market value of your residential or commercial property.',
    },
    {
      icon: Percent,
      title: 'Commercial Mortgages',
      description: 'Funding for purchasing retail showrooms, office suites, and commercial land along M.V. Road and highway avenues.',
    },
  ];

  return (
    <div className="pt-24 pb-20 space-y-20 sm:space-y-28">
      {/* Hero Banner */}
      <section className="bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="FINANCE DIVISION"
            title="Financial solutions made simpler."
            description="Connect with leading banking institutions and explore competitive finance options with professional local guidance."
            className="mb-12"
          />

          <div className="rounded-2xl overflow-hidden bg-[#0A192F] text-white border border-[#1E3A5F] shadow-lg grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto min-h-[360px]">
              <VisualAsset
                type="finance"
                alt="Institutional Finance and Property Mortgages"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-transparent to-transparent lg:hidden" />
            </div>

            <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-center space-y-6">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#E2C98D]">
                Paperwork &amp; Sanction Liaison
              </span>
              <h3 className="font-serif text-3xl font-bold leading-tight text-white">
                Eliminating bureaucratic hurdles from your loan approval.
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Unique Group liaises directly with branch managers, credit underwriters, and legal evaluators across SBI, HDFC, Bank of Baroda, and Bajaj Housing Finance.
                We ensure your documentation is compiled accurately for fast sanction and favorable tenure.
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href={buildWhatsAppUrl(`Hello ${WHATSAPP_CONFIG.recipientName}, I would like to check my loan eligibility for financing in Rajpipla.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[46px] inline-flex items-center gap-2 px-6 py-3 rounded bg-[#C5A059] hover:bg-[#D4B46C] text-[#050D1A] font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Check Loan Eligibility with {settings.founder}</span>
                </a>
                <a
                  href={`tel:${settings.phone}`}
                  className="min-h-[46px] inline-flex items-center gap-2 px-6 py-3 rounded bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider border border-white/20 transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#C5A059]" />
                  <span>Call {settings.displayPhone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Loan Categories */}
      <section className="bg-[#F4F2EA] py-16 sm:py-20 border-y border-[#E8E4D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#8C6E2E] block mb-2">
              FINANCIAL SERVICES
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0A192F]">
              Tailored capital solutions for individuals and enterprises.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-7 rounded-xl border border-[#E8E4D8] space-y-4 shadow-sm hover:border-[#C5A059] transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-[#FAF4E5] border border-[#C5A059]/40 flex items-center justify-center text-[#8C6E2E]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#0A192F]">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partner Banks & Financial Companies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="BANKING PARTNERS"
          title="Associated Financial Institutions"
          description="Direct access to sovereign banks and premier housing finance companies for fast loan sanctioning."
          className="mb-12"
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <CompanyCardSkeleton />
            <CompanyCardSkeleton />
            <CompanyCardSkeleton />
            <CompanyCardSkeleton />
          </div>
        ) : companies.length === 0 ? (
          <EmptyState
            type="finance"
            customMessage="Finance solutions will be updated shortly. Contact our team for assistance."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {companies.map((company) => (
              <div
                key={company.id}
                className="bg-white p-6 sm:p-7 rounded-xl border border-[#E8E4D8] hover:border-[#C5A059] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-3">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                    {company.type.replace('_', ' ').toUpperCase()}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#0A192F] group-hover:text-[#8C6E2E] transition-colors">
                    {company.name}
                  </h3>
                  <div className="p-2.5 rounded-lg bg-[#FAF4E5] border border-[#C5A059]/30 text-xs">
                    <span className="text-slate-500 block text-[10px] uppercase">Starting Rates</span>
                    <span className="font-bold text-[#8C6E2E]">{company.interestRateStartsFrom}</span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {company.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F4F2EA]">
                  <Link
                    to={`/finance/${company.slug}`}
                    className="w-full inline-flex items-center justify-between text-xs font-semibold text-[#0A192F] hover:text-[#8C6E2E] transition-colors"
                  >
                    <span>Explore {company.shortName}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Featured Finance Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="POPULAR FINANCING"
          title="Featured Loan Solutions"
          description="Transparent terms, maximum loan amounts, and expedited sanction timelines."
          className="mb-12"
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <PlanCardSkeleton />
            <PlanCardSkeleton />
          </div>
        ) : services.length === 0 ? (
          <EmptyState
            type="finance"
            customMessage="Finance solutions will be updated shortly. Contact our team for assistance."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white p-8 rounded-xl border border-[#E8E4D8] shadow-sm space-y-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="text-[#8C6E2E] font-semibold uppercase">{service.typeLabel}</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      {service.interestRate}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-[#0A192F]">
                    {service.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs py-2 px-3 rounded bg-[#FAF9F5] border border-[#E8E4D8]">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Tenure</span>
                      <span className="font-semibold text-[#0A192F]">{service.maxTenure}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Lending Partners</span>
                      <span className="font-semibold text-[#0A192F] truncate block">{service.companyName}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-xs font-semibold text-slate-700 block mb-2">
                      Key Features:
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {service.keyBenefits.map((b, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#F4F2EA] flex flex-col sm:flex-row items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedService(service)}
                    className="w-full min-h-[44px] flex items-center justify-center gap-2 rounded bg-[#0A192F] hover:bg-[#112240] text-[#E2C98D] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <span>Enquire for Loan Processing</span>
                  </button>

                  <a
                    href={buildWhatsAppUrl(`Hello ${WHATSAPP_CONFIG.businessName}, I am enquiring about ${service.title} (${service.companyName}).`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto min-h-[44px] px-3.5 flex items-center justify-center gap-1.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200 transition-colors"
                    title="Quick WhatsApp message"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className="sm:hidden">WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Enquiry Modal for Finance Service */}
      {selectedService && (
        <EnquiryModal
          isOpen={Boolean(selectedService)}
          onClose={() => setSelectedService(null)}
          initialServiceType="Finance"
          financeServiceId={selectedService.id}
          financeServiceTitle={`${selectedService.title} (${selectedService.companyName})`}
          title={`Enquire for ${selectedService.title}`}
          subtitle={`Lending partner: ${selectedService.companyName}. Speak directly with our loan advisory desk.`}
          submitButtonText="Enquire on WhatsApp"
        />
      )}
    </div>
  );
};
