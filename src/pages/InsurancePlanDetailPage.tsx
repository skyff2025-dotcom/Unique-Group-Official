import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Phone,
  MessageSquare,
  HelpCircle,
  AlertCircle,
  Building2,
  Tag,
  Clock,
  Sparkles,
  Send,
  CheckCircle,
  Globe,
  Share2,
} from 'lucide-react';
import { getInsurancePlanBySlug } from '../services/insurance';
import { InsurancePlan, InsuranceCompany } from '../types';
import { EnquiryModal } from '../components/common/EnquiryModal';
import { useSiteSettings } from '../context/SiteSettingsContext';

export const InsurancePlanDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const settings = useSiteSettings();

  const [plan, setPlan] = useState<InsurancePlan | null>(null);
  const [company, setCompany] = useState<InsuranceCompany | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Enquiry modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let isMounted = true;

    async function loadPlan() {
      try {
        setLoading(true);
        setNotFound(false);
        const data = await getInsurancePlanBySlug(slug!);
        if (isMounted) {
          if (data && data.plan) {
            setPlan(data.plan);
            if (data.company) {
              setCompany(data.company);
            }
          } else {
            setNotFound(true);
          }
        }
      } catch (err) {
        console.warn('Plan load error:', err);
        if (isMounted) setNotFound(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadPlan();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleOpenEnquiry = () => {
    setIsModalOpen(true);
  };

  if (notFound && !loading) {
    return (
      <div className="pt-36 pb-24 max-w-xl mx-auto px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-[#8C6E2E]">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold text-[#0A192F]">
            Insurance Plan Not Found
          </h1>
          <p className="text-slate-600 text-sm">
            We could not find this policy details. It may have been updated, renamed, or retired.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/insurance"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0A192F] text-[#E2C98D] text-xs font-bold uppercase tracking-wider hover:bg-[#112240] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse All Insurance</span>
          </Link>
        </div>
      </div>
    );
  }

  const effectivePhone = plan?.contactPhone || company?.phone || settings.phone;
  const companyDisplayName = company?.name || plan?.companyName || 'Unique Partner Insurer';

  return (
    <div className="pt-24 pb-20 space-y-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <Link to="/insurance" className="hover:text-[#0A192F] font-medium transition-colors">
              Insurance Solutions
            </Link>
            <span>/</span>
            {company?.slug ? (
              <Link
                to={`/insurance/company/${company.slug}`}
                className="hover:text-[#0A192F] font-medium transition-colors"
              >
                {companyDisplayName}
              </Link>
            ) : (
              <span>{companyDisplayName}</span>
            )}
            <span>/</span>
            <span className="text-[#0A192F] font-bold truncate max-w-[200px] sm:max-w-none">
              {plan?.title || 'Plan Details'}
            </span>
          </div>

          <Link
            to="/insurance"
            className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#0A192F] font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Plans</span>
          </Link>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="space-y-6 animate-pulse">
            <div className="bg-white p-8 sm:p-12 rounded-2xl border border-[#E8E4D8] space-y-4">
              <div className="h-6 w-36 bg-slate-200 rounded" />
              <div className="h-10 w-3/4 bg-slate-200 rounded" />
              <div className="h-4 w-1/2 bg-slate-100 rounded" />
            </div>
            <div className="bg-white p-8 rounded-2xl border border-[#E8E4D8] space-y-4">
              <div className="h-4 w-full bg-slate-100 rounded" />
              <div className="h-4 w-5/6 bg-slate-100 rounded" />
            </div>
          </div>
        ) : plan ? (
          <>
            {/* HERO / OVERVIEW CARD */}
            <div className="bg-white rounded-2xl border border-[#E8E4D8] shadow-sm overflow-hidden">
              <div className="p-6 sm:p-10 lg:p-12 space-y-8">
                {/* Provider & Category Badges */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F4F2EA] pb-6">
                  <div className="flex items-center gap-4">
                    {/* Company Logo or Icon */}
                    <div className="w-16 h-14 rounded-xl border border-slate-200 bg-[#FAF9F5] p-2 flex items-center justify-center shrink-0 overflow-hidden">
                      {plan.companyLogo || company?.logoUrl ? (
                        <img
                          src={plan.companyLogo || company?.logoUrl}
                          alt={`${companyDisplayName} logo`}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <ShieldCheck className="w-8 h-8 text-[#8C6E2E]" />
                      )}
                    </div>

                    <div>
                      {company?.slug ? (
                        <Link
                          to={`/insurance/company/${company.slug}`}
                          className="text-xs font-bold uppercase tracking-widest text-[#8C6E2E] hover:text-[#0A192F] inline-flex items-center gap-1"
                        >
                          <Building2 className="w-3.5 h-3.5" />
                          <span>{companyDisplayName}</span>
                        </Link>
                      ) : (
                        <span className="text-xs font-bold uppercase tracking-widest text-[#8C6E2E] inline-flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>{companyDisplayName}</span>
                        </span>
                      )}
                      <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#0A192F] mt-1 leading-tight">
                        {plan.title}
                      </h1>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3.5 py-1 rounded-full bg-[#FAF4E5] border border-[#C5A059]/40 text-xs font-bold text-[#8C6E2E] uppercase tracking-wider">
                      {plan.categoryLabel || `${plan.category} Insurance`}
                    </span>
                  </div>
                </div>

                {/* Short Description */}
                {(plan.shortDescription || plan.description) && (
                  <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-serif italic border-l-2 border-[#C5A059] pl-4">
                    {plan.shortDescription || plan.description.slice(0, 160)}
                  </p>
                )}

                {/* Premium info & Get Assistance CTA Banner */}
                <div className="bg-[#0A192F] text-white rounded-xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-[#1E3A5F]">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#E2C98D] block">
                      Premium &amp; Assistance
                    </span>
                    <div className="text-xl sm:text-2xl font-serif font-bold text-white">
                      {plan.premium ? (
                        <span>{plan.premium}</span>
                      ) : (
                        <span>Competitive Institutional Rates</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 max-w-md">
                      Get personalized quotes, policy comparison, and claims assistance from our Rajpipla advisory team.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={handleOpenEnquiry}
                      className="min-h-[46px] px-6 py-3 rounded-lg bg-[#C5A059] hover:bg-[#D4B46C] text-[#050D1A] font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2 shadow-sm"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Get Assistance</span>
                    </button>

                    <a
                      href={`tel:${effectivePhone}`}
                      className="min-h-[46px] px-5 py-3 rounded-lg border border-white/20 hover:bg-white/10 text-white font-semibold text-xs tracking-wider transition-colors inline-flex items-center justify-center gap-2"
                    >
                      <Phone className="w-4 h-4 text-[#C5A059]" />
                      <span>Call {effectivePhone}</span>
                    </a>
                  </div>
                </div>

                {/* Full Description */}
                {plan.description && (
                  <div className="space-y-3 pt-4 border-t border-[#F4F2EA]">
                    <h2 className="font-serif text-xl font-bold text-[#0A192F]">
                      Full Description &amp; Policy Scope
                    </h2>
                    <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                      {plan.description}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* KEY BENEFITS & ELIGIBILITY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Key Benefits */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E4D8] shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 border-b border-[#F4F2EA] pb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#FAF4E5] border border-[#C5A059]/30 flex items-center justify-center text-[#8C6E2E]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#0A192F]">
                      Key Benefits
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Core policy coverage and distinctive features
                    </p>
                  </div>
                </div>

                {plan.keyBenefits && plan.keyBenefits.length > 0 ? (
                  <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                    {plan.keyBenefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                        <span className="leading-snug">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    Comprehensive coverage details available upon proposal request.
                  </p>
                )}
              </div>

              {/* Required Documents */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E4D8] shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 border-b border-[#F4F2EA] pb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#FAF4E5] border border-[#C5A059]/30 flex items-center justify-center text-[#8C6E2E]">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#0A192F]">
                      Required Documents
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Paperwork needed for policy proposal &amp; onboarding
                    </p>
                  </div>
                </div>

                {plan.documentsRequired && plan.documentsRequired.length > 0 ? (
                  <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                    {plan.documentsRequired.map((doc, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                        <span className="leading-snug">{doc}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="space-y-2.5 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
                      <span>Aadhaar Card / Government ID</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
                      <span>PAN Card</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
                      <span>Passport size photograph</span>
                    </li>
                  </ul>
                )}

                {/* Eligibility criteria note if provided */}
                {plan.eligibility && (
                  <div className="mt-6 pt-4 border-t border-[#F4F2EA]">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                      Eligibility Information
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {plan.eligibility}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* COMPANY CONTACT & ADVISORY SECTION */}
            {company && (
              <div className="bg-[#FAF9F5] p-6 sm:p-8 rounded-2xl border border-[#E8E4D8] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#8C6E2E]">
                    Underwritten By
                  </span>
                  <h4 className="font-serif text-xl font-bold text-[#0A192F]">
                    {company.name}
                  </h4>
                  <p className="text-xs text-slate-600 max-w-xl">
                    {company.description || company.tagline}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    to={`/insurance/company/${company.slug}`}
                    className="min-h-[42px] px-4 py-2 rounded-lg bg-white border border-[#D5CEBF] hover:border-[#0A192F] text-xs font-bold text-[#0A192F] transition-colors inline-flex items-center gap-2"
                  >
                    <span>More Plans from this Company</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleOpenEnquiry}
                    className="min-h-[42px] px-5 py-2 rounded-lg bg-[#0A192F] hover:bg-[#112240] text-[#E2C98D] text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2"
                  >
                    <span>Get Assistance</span>
                  </button>
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>

      {/* ENQUIRY MODAL (GET ASSISTANCE) */}
      {plan && (
        <EnquiryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialServiceType="Insurance"
          insurancePlanId={plan.id}
          insurancePlanTitle={`${plan.title} (${companyDisplayName})`}
          title={`Enquire About ${plan.title}`}
          subtitle={`Provider: ${companyDisplayName}. Receive policy comparison and direct claim support.`}
          submitButtonText="Send Enquiry / Request Callback"
        />
      )}
    </div>
  );
};
