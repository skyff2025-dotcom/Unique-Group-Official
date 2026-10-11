import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SectionHeading } from '../components/common/SectionHeading';
import { VisualAsset } from '../components/common/VisualAsset';
import { getInsuranceCompanies, getInsurancePlans } from '../services/insurance';
import { InsuranceCompany, InsurancePlan } from '../types';
import {
  ArrowRight,
  ShieldCheck,
  HeartPulse,
  Building2,
  Umbrella,
  MessageSquare,
  CheckCircle2,
  Phone,
  Filter,
  Search,
  Sparkles,
  Briefcase,
  Plane,
  Home,
  Check,
} from 'lucide-react';
import { CompanyCardSkeleton, PlanCardSkeleton } from '../components/common/SkeletonLoader';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { buildWhatsAppUrl, WHATSAPP_CONFIG } from '../lib/whatsapp';

const CATEGORY_TABS = [
  { id: 'all', label: 'All', icon: Sparkles },
  { id: 'health', label: 'Health', icon: HeartPulse },
  { id: 'life', label: 'Life', icon: ShieldCheck },
  { id: 'motor', label: 'Motor', icon: Umbrella },
  { id: 'business', label: 'Business', icon: Briefcase },
  { id: 'travel', label: 'Travel', icon: Plane },
  { id: 'property', label: 'Property', icon: Home },
];

export const InsurancePage: React.FC = () => {
  const settings = useSiteSettings();
  const [companies, setCompanies] = useState<InsuranceCompany[]>([]);
  const [plans, setPlans] = useState<InsurancePlan[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [loadingPlans, setLoadingPlans] = useState(true);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCompanyId, setSelectedCompanyId] = useState('all');

  useEffect(() => {
    let isMounted = true;
    async function loadCompaniesData() {
      try {
        setLoadingCompanies(true);
        const cData = await getInsuranceCompanies();
        if (isMounted && cData) {
          setCompanies(cData);
        }
      } catch (err) {
        console.warn('Insurance companies fetch error:', err);
      } finally {
        if (isMounted) setLoadingCompanies(false);
      }
    }
    loadCompaniesData();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function loadPlansData() {
      try {
        setLoadingPlans(true);
        const pData = await getInsurancePlans({
          companyId: selectedCompanyId,
          category: selectedCategory,
        });
        if (isMounted && pData) {
          setPlans(pData);
        }
      } catch (err) {
        console.warn('Insurance plans fetch error:', err);
      } finally {
        if (isMounted) setLoadingPlans(false);
      }
    }
    loadPlansData();
    return () => {
      isMounted = false;
    };
  }, [selectedCategory, selectedCompanyId]);

  return (
    <div className="pt-24 pb-20 space-y-16 sm:space-y-24">
      {/* Header & Hero Section */}
      <section className="bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="INSURANCE ADVISORY"
            title="Insurance Solutions"
            description="Comprehensive coverage tailored to your needs."
            className="mb-10"
          />

          <div className="rounded-2xl overflow-hidden bg-[#0A192F] text-white border border-[#1E3A5F] shadow-lg grid grid-cols-1 lg:grid-cols-12 mb-14">
            <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto min-h-[320px]">
              <VisualAsset
                type="insurance"
                alt="Insurance protection for families and businesses"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-transparent to-transparent lg:hidden" />
            </div>

            <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-center space-y-6">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#E2C98D]">
                Independent Corporate Advisory
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight text-white">
                Protection designed for your life and enterprise.
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Unique Group serves as your trusted advisory partner in Rajpipla, Gujarat. We help individuals, families, and businesses evaluate policies from India's leading licensed insurers with transparent guidance and hands-on claims assistance.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href={buildWhatsAppUrl(`Hello ${WHATSAPP_CONFIG.businessName}, I would like guidance on insurance solutions.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[46px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded bg-[#C5A059] hover:bg-[#D4B46C] text-[#050D1A] font-bold text-xs uppercase tracking-wider transition-colors shadow-xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Speak with Our Team on WhatsApp</span>
                </a>

                <a
                  href={`tel:${settings.phone}`}
                  className="min-h-[46px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded border border-white/20 hover:bg-white/10 text-white font-semibold text-xs tracking-wider transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#C5A059]" />
                  <span>Call Office</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACTIVE PLANS SECTION WITH CATEGORY TABS & COMPANY FILTER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" id="plans">
        <div className="border-b border-[#E8E4D8] pb-6 space-y-2">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#8C6E2E] block">
                EXPLORE PLANS
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A192F] mt-1">
                Active Insurance Plans
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Filter by category or insurance provider to find coverage suited to your profile.
              </p>
            </div>

            {/* Company Filter Dropdown */}
            <div className="w-full md:w-72 shrink-0">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Filter by Provider
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={selectedCompanyId}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                  className="w-full min-h-[42px] pl-9 pr-8 py-2 rounded-lg border border-[#D5CEBF] bg-white text-xs font-medium text-[#0A192F] focus:outline-none focus:border-[#C5A059] shadow-xs cursor-pointer"
                >
                  <option value="all">All Insurance Companies</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="pt-4 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {CATEGORY_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`min-h-[40px] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#0A192F] text-[#E2C98D] shadow-sm'
                      : 'bg-white border border-[#E8E4D8] text-slate-700 hover:bg-[#FAF9F5] hover:border-[#C5A059]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C5A059]' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Plans Grid */}
        {loadingPlans ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PlanCardSkeleton />
            <PlanCardSkeleton />
            <PlanCardSkeleton />
          </div>
        ) : plans.length === 0 ? (
          /* Empty State if no plans */
          <div className="bg-white p-12 sm:p-16 rounded-2xl border border-[#E8E4D8] text-center space-y-4 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-[#FAF4E5] border border-[#C5A059]/40 flex items-center justify-center mx-auto text-[#8C6E2E]">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-xl font-bold text-[#0A192F]">
                No insurance plans found matching this criteria
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Try switching the category filter or choosing "All Companies", or contact our team for bespoke assistance.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedCompanyId('all');
                }}
                className="px-5 py-2.5 rounded-lg bg-[#0A192F] text-[#E2C98D] text-xs font-bold uppercase tracking-wider hover:bg-[#112240]"
              >
                Reset Filters
              </button>
              <Link
                to="/contact"
                className="px-5 py-2.5 rounded-lg border border-[#D5CEBF] text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-[#FAF9F5]"
              >
                Contact Advisory Desk
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const matchedCompany = companies.find((c) => c.id === plan.companyId);
              const logo = plan.companyLogo || matchedCompany?.logoUrl;
              const companyName = plan.companyName || matchedCompany?.name || 'Partner Insurer';

              return (
                <div
                  key={plan.id}
                  className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E8E4D8] hover:border-[#C5A059] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6 group"
                >
                  <div className="space-y-4">
                    {/* Top Row: Company Logo & Name + Category Tag */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-10 rounded-lg border border-slate-200 bg-[#FAF9F5] p-1 flex items-center justify-center shrink-0 overflow-hidden">
                          {logo ? (
                            <img
                              src={logo}
                              alt={`${companyName} logo`}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <ShieldCheck className="w-5 h-5 text-[#8C6E2E]" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block truncate">
                            {companyName}
                          </span>
                        </div>
                      </div>

                      <span className="px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[10px] tracking-wider uppercase border border-blue-200 shrink-0">
                        {plan.categoryLabel || `${plan.category} Insurance`}
                      </span>
                    </div>

                    {/* Plan Name */}
                    <div>
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0A192F] group-hover:text-[#8C6E2E] transition-colors leading-snug">
                        {plan.title}
                      </h3>
                    </div>

                    {/* Short Description */}
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {plan.shortDescription || plan.description || 'Comprehensive coverage and dedicated claim advisory support.'}
                    </p>

                    {/* Key Benefits Preview */}
                    {plan.keyBenefits && plan.keyBenefits.length > 0 && (
                      <div className="pt-2 border-t border-[#F4F2EA]">
                        <ul className="space-y-1.5 text-xs text-slate-600">
                          {plan.keyBenefits.slice(0, 2).map((b, bIdx) => (
                            <li key={bIdx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* View Details CTA */}
                  <div className="pt-4 border-t border-[#F4F2EA]">
                    <Link
                      to={`/insurance/plans/${plan.slug}`}
                      className="w-full min-h-[44px] py-2.5 px-4 rounded-lg bg-[#FAF9F5] group-hover:bg-[#0A192F] text-[#0A192F] group-hover:text-[#E2C98D] border border-[#E8E4D8] group-hover:border-[#0A192F] text-xs font-bold uppercase tracking-wider inline-flex items-center justify-between transition-all"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-4 h-4 text-[#8C6E2E] group-hover:text-[#E2C98D] group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* LICENSED PROVIDERS / COMPANIES SECTION */}
      <section className="bg-[#F4F2EA] py-16 sm:py-20 border-y border-[#E8E4D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <SectionHeading
            label="LICENSED PROVIDERS"
            title="Insurance Companies"
            description="Browse corporate profiles and all policies offered by India's leading insurance corporations."
          />

          {loadingCompanies ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CompanyCardSkeleton />
              <CompanyCardSkeleton />
              <CompanyCardSkeleton />
            </div>
          ) : companies.length === 0 ? (
            <div className="bg-white p-12 rounded-xl border border-[#E8E4D8] text-center space-y-3">
              <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-[#0A192F]">
                Insurance providers will be listed shortly.
              </h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map((company) => {
                const logo = company.logoUrl;
                return (
                  <div
                    key={company.id}
                    className="bg-white p-7 sm:p-8 rounded-xl border border-[#E8E4D8] hover:border-[#C5A059] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6 group"
                  >
                    <div className="space-y-4">
                      {/* Header: Logo & Company Name */}
                      <div className="flex items-center gap-3.5">
                        <div className="w-14 h-12 rounded-lg border border-slate-200 bg-[#FAF9F5] p-1.5 flex items-center justify-center shrink-0 overflow-hidden">
                          {logo ? (
                            <img
                              src={logo}
                              alt={`${company.name} logo`}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <ShieldCheck className="w-6 h-6 text-[#8C6E2E]" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-serif text-lg font-bold text-[#0A192F] group-hover:text-[#8C6E2E] transition-colors truncate">
                            {company.name}
                          </h3>
                          <span className="text-[11px] font-semibold text-[#8C6E2E] bg-[#FAF4E5] px-2 py-0.5 rounded border border-[#C5A059]/30 inline-block mt-0.5">
                            {company.plansCount ?? 0} Available {company.plansCount === 1 ? 'Plan' : 'Plans'}
                          </span>
                        </div>
                      </div>

                      {/* Short Description */}
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {company.description || company.tagline || 'Explore licensed insurance options with dedicated claim assistance.'}
                      </p>
                    </div>

                    {/* CTA */}
                    <div className="pt-4 border-t border-[#F4F2EA]">
                      <Link
                        to={`/insurance/company/${company.slug}`}
                        className="w-full min-h-[44px] py-2 px-4 rounded-lg bg-[#FAF9F5] group-hover:bg-[#0A192F] text-[#0A192F] group-hover:text-[#E2C98D] border border-[#E8E4D8] group-hover:border-[#0A192F] text-xs font-bold uppercase tracking-wider inline-flex items-center justify-between transition-all"
                      >
                        <span>View Provider Plans</span>
                        <ArrowRight className="w-4 h-4 text-[#8C6E2E] group-hover:text-[#E2C98D] group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
