import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getFinanceCompanyBySlug, getFinanceServices } from '../services/finance';
import { FinanceCompany, FinanceService } from '../types';
import { ArrowLeft, CheckCircle2, Phone, MessageSquare } from 'lucide-react';
import { PlanCardSkeleton } from '../components/common/SkeletonLoader';
import { EnquiryModal } from '../components/common/EnquiryModal';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { buildWhatsAppUrl, WHATSAPP_CONFIG } from '../lib/whatsapp';

export const FinanceCompanyPage: React.FC = () => {
  const settings = useSiteSettings();
  const { company: slug } = useParams<{ company: string }>();

  const [company, setCompany] = useState<FinanceCompany | null>(null);
  const [services, setServices] = useState<FinanceService[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<FinanceService | null>(null);

  useEffect(() => {
    if (!slug) return;
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        const c = await getFinanceCompanyBySlug(slug!);
        if (isMounted && c) {
          setCompany(c);
          const s = await getFinanceServices(c.id);
          if (isMounted && s) setServices(s);
        }
      } catch (err) {
        console.warn('Finance company fetch fallback:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (!company && !loading) {
    return (
      <div className="pt-36 pb-24 max-w-xl mx-auto px-4 text-center space-y-6">
        <h1 className="font-serif text-3xl font-bold text-[#0A192F]">
          Financial Institution Profile Not Found
        </h1>
        <p className="text-slate-600 text-sm">
          Please check the link or browse our full list of partner banks and finance providers.
        </p>
        <Link
          to="/finance"
          className="inline-flex items-center gap-2 px-6 py-3 rounded bg-[#0A192F] text-[#E2C98D] text-xs font-semibold uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Finance</span>
        </Link>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="pt-36 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse">
        <div className="h-6 w-32 bg-slate-200 rounded" />
        <div className="h-56 bg-white rounded-2xl border border-[#E8E4D8]" />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/finance"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#0A192F]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Finance</span>
          </Link>
        </div>

        {/* Company Header */}
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-[#E8E4D8] shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F4F2EA] pb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#8C6E2E] block mb-1">
                Lending &amp; Banking Associate
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0A192F]">
                {company.name}
              </h1>
              <p className="text-sm text-slate-500 mt-1 italic">
                {company.tagline}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF4E5] border border-[#C5A059]/40 text-center shrink-0">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 block">Indicative Rate</span>
              <span className="font-serif text-2xl font-bold text-[#8C6E2E]">
                {company.interestRateStartsFrom}
              </span>
            </div>
          </div>

          <p className="text-base text-slate-700 leading-relaxed max-w-3xl">
            {company.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href={buildWhatsAppUrl(`Hello ${WHATSAPP_CONFIG.businessName}, I would like to apply for finance through ${company.name}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[46px] inline-flex items-center gap-2 px-6 py-3 rounded bg-[#C5A059] hover:bg-[#D4B46C] text-[#050D1A] font-bold text-xs uppercase tracking-wider transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Apply for {company.shortName} Finance</span>
            </a>
            <a
              href={`tel:${settings.phone}`}
              className="min-h-[46px] inline-flex items-center gap-2 px-6 py-3 rounded bg-[#0A192F] hover:bg-[#112240] text-white text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              <Phone className="w-4 h-4 text-[#C5A059]" />
              <span>Call Office ({settings.displayPhone})</span>
            </a>
          </div>
        </div>

        {/* Services from this institution */}
        <div className="mt-14 space-y-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A192F]">
            Featured Services &amp; Loan Facilities
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PlanCardSkeleton />
              <PlanCardSkeleton />
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((svc) => (
                <div
                  key={svc.id}
                  className="bg-white p-7 rounded-xl border border-[#E8E4D8] shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="text-[#8C6E2E] font-semibold uppercase">{svc.typeLabel}</span>
                    <span className="font-bold text-emerald-700">{svc.interestRate}</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#0A192F]">
                    {svc.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {svc.description}
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-[#F4F2EA]">
                    {svc.keyBenefits.map((b, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-3 border-t border-[#F4F2EA] flex flex-col sm:flex-row items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedService(svc)}
                      className="w-full min-h-[40px] px-3.5 py-2 rounded bg-[#0A192F] hover:bg-[#112240] text-[#E2C98D] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-center"
                    >
                      <span>Apply / Enquire for Service</span>
                    </button>

                    <a
                      href={buildWhatsAppUrl(`Hello ${WHATSAPP_CONFIG.businessName}, I want to apply for ${svc.title} via ${company.shortName}.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto min-h-[40px] px-3 py-2 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200 transition-colors inline-flex items-center justify-center gap-1.5"
                      title="WhatsApp discussion"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="sm:hidden">WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 bg-white rounded-xl border border-[#E8E4D8] text-center space-y-2">
              <p className="text-sm text-slate-600 font-medium">
                Finance solutions will be updated shortly. Contact our team for assistance.
              </p>
              <p className="text-xs text-slate-500">
                Contact Gaurav Shah for interest rate negotiations, paperwork checklist, and sanction assistance.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Enquiry Modal */}
      {selectedService && (
        <EnquiryModal
          isOpen={Boolean(selectedService)}
          onClose={() => setSelectedService(null)}
          initialServiceType="Finance"
          financeServiceId={selectedService.id}
          financeServiceTitle={`${selectedService.title} (${company.name})`}
          title={`Enquire for ${selectedService.title}`}
          subtitle={`Institution: ${company.name}. Contact Gaurav Shah for interest rate and loan verification.`}
          submitButtonText="Enquire on WhatsApp"
        />
      )}
    </div>
  );
};
