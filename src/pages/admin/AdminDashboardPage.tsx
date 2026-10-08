import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  CheckCircle,
  ShieldCheck,
  Landmark,
  Inbox,
  ArrowRight,
  Phone,
  MessageSquare,
  Clock,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getDashboardStats, getRecentEnquiries, DashboardStats } from '../../services/admin';
import { EnquiryRow } from '../../types/database';

export const AdminDashboardPage: React.FC = () => {
  const { adminProfile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    availableProperties: 0,
    insuranceCompanies: 0,
    financeCompanies: 0,
    newEnquiries: 0,
  });
  const [recentEnquiries, setRecentEnquiries] = useState<EnquiryRow[]>([]);
  const [loading, setLoading] = useState(true);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [sData, eData] = await Promise.all([
        getDashboardStats(),
        getRecentEnquiries(5),
      ]);
      setStats(sData);
      setRecentEnquiries(eData);
    } catch (err) {
      console.warn('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const adminName = adminProfile?.full_name || 'Gaurav Shah';

  const cards = [
    {
      label: 'Properties',
      count: stats.totalProperties,
      to: '/admin/properties',
      icon: Building2,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      tag: 'Total Listings',
    },
    {
      label: 'Available Properties',
      count: stats.availableProperties,
      to: '/admin/properties?status=Available',
      icon: CheckCircle,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      tag: 'Active on Site',
    },
    {
      label: 'Insurance Companies',
      count: stats.insuranceCompanies,
      to: '/admin/insurance/companies',
      icon: ShieldCheck,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      tag: 'Partner Insurers',
    },
    {
      label: 'Finance Companies',
      count: stats.financeCompanies,
      to: '/admin/finance/companies',
      icon: Landmark,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      tag: 'Partner Banks',
    },
    {
      label: 'New Enquiries',
      count: stats.newEnquiries,
      to: '/admin/enquiries',
      icon: Inbox,
      color: 'bg-rose-50 text-rose-700 border-rose-200',
      tag: 'Needs Attention',
      highlight: stats.newEnquiries > 0,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return 'bg-rose-50 text-rose-700 border-rose-200 font-bold';
      case 'contacted':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'in_progress':
      case 'in progress':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'closed':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E4D8] pb-6">
        <div className="space-y-1">
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0A192F]">
            {getGreeting()}, {adminName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Manage your Unique Group website from one place.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="min-h-[42px] px-3.5 py-2 rounded-lg bg-white border border-[#E8E4D8] text-xs font-semibold text-slate-700 hover:bg-[#FAF9F5] transition-colors flex items-center gap-1.5 shadow-xs"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#8C6E2E] ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <Link
            to="/admin/properties/new"
            className="min-h-[42px] px-4 py-2 rounded-lg bg-[#0A192F] hover:bg-[#112240] text-[#E2C98D] text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4 text-[#C5A059]" />
            <span>Add Property</span>
          </Link>
        </div>
      </div>

      {/* DASHBOARD STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.to}
              className={`p-5 rounded-xl bg-white border border-[#E8E4D8] shadow-xs hover:shadow-md hover:border-[#C5A059] transition-all flex flex-col justify-between space-y-4 group ${
                card.highlight ? 'ring-2 ring-rose-400' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  {card.label}
                </span>
                <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <span className="font-serif text-3xl font-bold text-[#0A192F] group-hover:text-[#8C6E2E] transition-colors">
                  {loading ? '—' : card.count}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">
                  {card.tag}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* RECENT ENQUIRIES SECTION */}
      <div className="bg-white rounded-xl border border-[#E8E4D8] shadow-xs overflow-hidden space-y-4">
        <div className="p-5 sm:p-6 border-b border-[#F4F2EA] flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#0A192F]">
              Recent Enquiries
            </h2>
            <p className="text-xs text-slate-500">
              Latest client requests for real estate, insurance, and loan advisory.
            </p>
          </div>

          <Link
            to="/admin/enquiries"
            className="text-xs font-bold text-[#8C6E2E] hover:text-[#0A192F] uppercase tracking-wider inline-flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">
            Loading recent enquiries...
          </div>
        ) : recentEnquiries.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Inbox className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500 font-medium">
              No customer enquiries recorded yet.
            </p>
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F5] text-slate-600 font-semibold uppercase tracking-wider border-b border-[#E8E4D8]">
                  <tr>
                    <th className="py-3 px-6">Name</th>
                    <th className="py-3 px-6">Phone</th>
                    <th className="py-3 px-6">Service</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6">Date</th>
                    <th className="py-3 px-6 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4F2EA]">
                  {recentEnquiries.map((enq) => (
                    <tr key={enq.id} className="hover:bg-[#FAF9F5]/70 transition-colors">
                      <td className="py-3.5 px-6 font-semibold text-[#0A192F]">
                        {enq.name}
                      </td>
                      <td className="py-3.5 px-6 font-medium text-slate-700">
                        {enq.phone}
                      </td>
                      <td className="py-3.5 px-6">
                        <span className="capitalize px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-700">
                          {enq.service_type?.replace('_', ' ') || 'General'}
                        </span>
                      </td>
                      <td className="py-3.5 px-6">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold border ${getStatusBadge(enq.status)}`}>
                          {enq.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-slate-500">
                        {new Date(enq.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <a
                            href={`tel:${enq.phone}`}
                            className="p-1.5 rounded-md bg-slate-100 hover:bg-[#FAF4E5] hover:text-[#8C6E2E] text-slate-700 transition-colors"
                            title="Call customer"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={`https://wa.me/${enq.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(enq.name)},%20I%20am%20Gaurav%20Shah%20from%20Unique%20Group.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARDS */}
            <div className="md:hidden divide-y divide-[#F4F2EA] px-4 pb-4">
              {recentEnquiries.map((enq) => (
                <div key={enq.id} className="py-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-base font-bold text-[#0A192F]">
                      {enq.name}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold border ${getStatusBadge(enq.status)}`}>
                      {enq.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="capitalize">{enq.service_type?.replace('_', ' ')}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(enq.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-semibold text-slate-700">
                      {enq.phone}
                    </span>

                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${enq.phone}`}
                        className="min-h-[36px] px-3 py-1.5 rounded bg-slate-100 text-[#0A192F] text-xs font-semibold inline-flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3 text-[#8C6E2E]" />
                        <span>Call</span>
                      </a>
                      <a
                        href={`https://wa.me/${enq.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(enq.name)},%20I%20am%20Gaurav%20Shah%20from%20Unique%20Group.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[36px] px-3 py-1.5 rounded bg-emerald-600 text-white text-xs font-bold inline-flex items-center gap-1"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* QUICK SHORTCUTS STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/admin/properties/new"
          className="p-5 rounded-xl bg-white border border-[#E8E4D8] hover:border-[#C5A059] shadow-xs flex items-center justify-between group transition-all"
        >
          <div className="space-y-0.5">
            <span className="font-serif text-base font-bold text-[#0A192F] group-hover:text-[#8C6E2E]">
              Add Real Estate Property
            </span>
            <p className="text-xs text-slate-500">
              Create a residential villa, showroom, or NA land listing.
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-[#8C6E2E] group-hover:translate-x-1 transition-transform shrink-0" />
        </Link>

        <Link
          to="/admin/enquiries"
          className="p-5 rounded-xl bg-white border border-[#E8E4D8] hover:border-[#C5A059] shadow-xs flex items-center justify-between group transition-all"
        >
          <div className="space-y-0.5">
            <span className="font-serif text-base font-bold text-[#0A192F] group-hover:text-[#8C6E2E]">
              Manage Client Enquiries
            </span>
            <p className="text-xs text-slate-500">
              Update inquiry statuses and contact clients directly.
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-[#8C6E2E] group-hover:translate-x-1 transition-transform shrink-0" />
        </Link>

        <Link
          to="/admin/settings"
          className="p-5 rounded-xl bg-white border border-[#E8E4D8] hover:border-[#C5A059] shadow-xs flex items-center justify-between group transition-all"
        >
          <div className="space-y-0.5">
            <span className="font-serif text-base font-bold text-[#0A192F] group-hover:text-[#8C6E2E]">
              Site Contact &amp; Brand Settings
            </span>
            <p className="text-xs text-slate-500">
              Edit phone, WhatsApp, office address, and social links.
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-[#8C6E2E] group-hover:translate-x-1 transition-transform shrink-0" />
        </Link>
      </div>
    </div>
  );
};
