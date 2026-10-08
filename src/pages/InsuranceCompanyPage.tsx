import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getInsuranceCompanyBySlug, getInsurancePlans } from '../services/insurance';
import { InsuranceCompany, InsurancePlan } from '../types';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Mail,
  Globe,
  MessageSquare,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { PlanCardSkeleton } from '../components/common/SkeletonLoader';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { InsurancePlanDetailModal } from '../components/insurance/InsurancePlanDetailModal';

export const InsuranceCompanyPage: React.FC = () => {
  const settings = useSiteSettings();
  const params = useParams<{ company?: string; slug?: string }>();
  const slug = params.slug || params.company;

  const [company, setCompany] = useState<InsuranceCompany | null>(null);
  const [plans, setPlans] = useState<InsurancePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Selected plan for detail modal
  const [selectedPlan, setSelectedPlan] = useState<InsurancePlan | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        setNotFound(false);
        const c = await getInsuranceCompanyBySlug(slug!);
        if (isMounted) {
          if (c) {
            setCompany(c);
            const p = await getInsurancePlans(c.id);
            if (isMounted) setPlans(p);
          } else {
            setNotFound(true);
          }
        }
      } catch (err) {
        console.warn('Company fetch error:', err);
        if (isMounted) setNotFound(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleOpenPlan = (plan: InsurancePlan) => {
    setSelectedPlan(plan);
    setModalOpen(true);
  };

  if (notFound && !loading) {
    return (
      <div className="pt-36 pb-24 max-w-xl mx-auto px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-[#8C6E2E]">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold text-[#0A192F]">
            Insurance Provider Not Found
          </h1>
          <p className="text-slate-600 text-sm">
            We could not locate this insurance company profile. It may have been updated or moved.
          </p>
        </div>
        <div>
          <Link
            to="/insurance"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0A192F] text-[#E2C98D] text-xs font-bold uppercase tracking-wider hover:bg-[#112240] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Insurance Providers</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/insurance"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#0A192F] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Insurance</span>
          </Link>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="space-y-10 animate-pulse">
            <div className="bg-white p-8 sm:p-12 rounded-2xl border border-[#E8E4D8] space-y-4">
              <div className="h-6 w-48 bg-slate-200 rounded" />
              <div className="h-10 w-80 bg-slate-200 rounded" />
              <div className="h-20 w-full bg-slate-100 rounded" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PlanCardSkeleton />
              <PlanCardSkeleton />
            </div>
          </div>
        ) : company ? (
          <>
            {/* COMPANY DETAIL CARD */}
            <div className="bg-white p-6 sm:p-10 lg:p-12 rounded-2xl border border-[#E8E4D8] shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-[#F4F2EA] pb-6">
                <div className="flex items-start gap-4">
                  {/* Company Logo */}
                  <div className="w-16 h-14 sm:w-20 sm:h-16 rounded-xl border border-slate-200 bg-[#FAF9F5] p-2 flex items-center justify-center shrink-0 overflow-hidden">
                    {company.logoUrl ? (
                      <img
                        src={company.logoUrl}
                        alt={`${company.name} logo`}
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
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#8C6E2E] block">
                      Licensed Insurance Provider
                    </span>
                    <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#0A192F] mt-1">
                      {company.name}
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 italic">
                      {company.tagline}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#FAF4E5] border border-[#C5A059]/40 text-xs font-bold text-[#8C6E2E]">
                    {plans.length} Available {plans.length === 1 ? 'Plan' : 'Plans'}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-4xl">
                {company.description}
              </p>

              {/* Contact & Website Bar */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-3 border-t border-[#F4F2EA] text-xs text-slate-600">
                {company.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#8C6E2E]" />
                    <a href={`tel:${company.phone}`} className="hover:text-[#0A192F] font-semibold">
                      {company.phone}
                    </a>
                  </div>
                )}

                {company.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#8C6E2E]" />
                    <a href={`mailto:${company.email}`} className="hover:text-[#0A192F]">
                      {company.email}
                    </a>
                  </div>
                )}

                {company.websiteUrl && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#8C6E2E]" />
                    <a
                      href={company.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#0A192F] underline"
                    >
                      Official Website
                    </a>
                  </div>
                )}
              </div>

              {/* Advisory note */}
              <div className="p-3 bg-[#FAF9F5] rounded-lg border border-[#E8E4D8] text-xs text-slate-600 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#8C6E2E] shrink-0 mt-0.5" />
                <span>
                  Speak with our Rajpipla team for guidance on policy wordings, exclusions, and proposal filings for {company.name}.
                </span>
              </div>
            </div>

            {/* AVAILABLE INSURANCE PLANS */}
            <div className="mt-14 space-y-8">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#8C6E2E] block mb-1">
                  Portfolio Options
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A192F]">
                  Available Insurance Plans
                </h2>
              </div>

              {plans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className="bg-white p-6 sm:p-8 rounded-xl border border-[#E8E4D8] hover:border-[#C5A059] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span className="px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[11px] border border-blue-200">
                            {plan.categoryLabel || `${plan.category} Insurance`}
                          </span>
                          <span className="text-slate-400 font-medium">
                            {company.name}
                          </span>
                        </div>

                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0A192F]">
                          {plan.title}
                        </h3>

                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                          {plan.description}
                        </p>

                        {/* Key Benefits */}
                        {plan.keyBenefits && plan.keyBenefits.length > 0 && (
                          <div className="pt-2 border-t border-[#F4F2EA]">
                            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
                              Key Benefits:
                            </span>
                            <ul className="space-y-1.5 text-xs text-slate-600">
                              {plan.keyBenefits.slice(0, 3).map((benefit, bIdx) => (
                                <li key={bIdx} className="flex items-start gap-2">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                                  <span className="line-clamp-1">{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* CTA */}
                      <div className="pt-4 border-t border-[#F4F2EA]">
                        <Link
                          to={`/insurance/plans/${plan.slug}`}
                          className="w-full min-h-[44px] py-2.5 px-4 rounded-lg bg-[#0A192F] hover:bg-[#112240] text-[#E2C98D] text-xs font-bold uppercase tracking-wider inline-flex items-center justify-between transition-colors shadow-xs"
                        >
                          <span>View Plan</span>
                          <ArrowRight className="w-4 h-4 text-[#C5A059]" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 bg-white rounded-xl border border-[#E8E4D8] text-center space-y-3">
                  <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto" />
                  <h3 className="font-serif text-lg font-bold text-[#0A192F]">
                    Plans from this provider will be updated shortly.
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Please contact our Rajpipla office for custom offline policy proposals from {company.name}.
                  </p>
                  <div className="pt-2">
                    <a
                      href={`https://wa.me/${settings.whatsapp}?text=Hello%20Unique%20Group,%20I%20am%20inquiring%20about%20plans%20from%20${encodeURIComponent(
                        company.name
                      )}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-700"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>WhatsApp Advisory Desk</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Plan Detail Modal */}
            <InsurancePlanDetailModal
              plan={selectedPlan}
              company={company}
              isOpen={modalOpen}
              onClose={() => {
                setModalOpen(false);
                setSelectedPlan(null);
              }}
            />
          </>
        ) : null}
      </div>
    </div>
  );
};
