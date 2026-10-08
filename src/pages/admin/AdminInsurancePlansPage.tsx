import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Eye,
  RefreshCw,
  Search,
  Filter,
  ShieldCheck,
  Calendar,
  X,
  Phone,
} from 'lucide-react';
import {
  getAdminInsurancePlans,
  getAdminInsuranceCompanies,
  toggleInsurancePlanActive,
  deleteInsurancePlan,
} from '../../services/admin';
import {
  InsurancePlanRow,
  InsuranceCompanyRow,
} from '../../types/database';
import { DeleteConfirmModal } from '../../components/admin/DeleteConfirmModal';

const CATEGORIES = [
  'Health',
  'Life',
  'Motor',
  'Business',
  'Travel',
  'Property',
  'General',
  'Other',
];

export const AdminInsurancePlansPage: React.FC = () => {
  const location = useLocation();
  const [plans, setPlans] = useState<
    (InsurancePlanRow & { insurance_companies?: { name: string } | null })[]
  >([]);
  const [companies, setCompanies] = useState<InsuranceCompanyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  // Filters state
  const [search, setSearch] = useState('');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Quick Plan Detail View Modal
  const [viewingPlan, setViewingPlan] = useState<
    (InsurancePlanRow & { insurance_companies?: { name: string } | null }) | null
  >(null);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<InsurancePlanRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (location.state && (location.state as any).message) {
      setToastMessage((location.state as any).message);
      window.history.replaceState({}, document.title);
      const timer = setTimeout(() => setToastMessage(''), 4500);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pData, cData] = await Promise.all([
        getAdminInsurancePlans({
          companyId: companyFilter,
          category: categoryFilter,
          status: statusFilter,
          search,
        }),
        getAdminInsuranceCompanies(),
      ]);
      setPlans(pData);
      setCompanies(cData);
    } catch (err) {
      console.warn('Plans fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [companyFilter, categoryFilter, statusFilter, search]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleToggleActive = async (plan: InsurancePlanRow) => {
    const newStatus = !plan.active;
    const success = await toggleInsurancePlanActive(plan.id, newStatus);
    if (success) {
      setPlans((prev) =>
        prev.map((p) => (p.id === plan.id ? { ...p, active: newStatus } : p))
      );
      showToast(`${plan.name} is now ${newStatus ? 'Active' : 'Inactive'}.`);
    } else {
      alert('Failed to update plan status.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!planToDelete) return;
    setIsDeleting(true);
    const res = await deleteInsurancePlan(planToDelete.id);
    setIsDeleting(false);

    if (res.success) {
      setPlans((prev) => prev.filter((p) => p.id !== planToDelete.id));
      showToast('Insurance plan deleted successfully.');
      setDeleteModalOpen(false);
      setPlanToDelete(null);
    } else {
      alert(res.error || 'Failed to delete insurance plan.');
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A192F] text-[#E2C98D] px-4 py-3 rounded-lg shadow-xl border border-[#C5A059]/40 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E4D8] pb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#8C6E2E]">
            Insurance Advisory
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A192F]">
            Insurance Plans
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage policies, coverage categories, benefit structures, and eligibility.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="min-h-[42px] px-3.5 py-2 rounded-lg bg-white border border-[#E8E4D8] text-xs font-semibold text-slate-700 hover:bg-[#FAF9F5] shadow-xs flex items-center gap-1.5"
            title="Refresh list"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#8C6E2E] ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <Link
            to="/admin/insurance/plans/new"
            className="min-h-[42px] px-4 py-2 rounded-lg bg-[#0A192F] hover:bg-[#112240] text-[#E2C98D] text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4 text-[#C5A059]" />
            <span>+ Add Insurance Plan</span>
          </Link>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#E8E4D8] shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Search */}
          <div className="sm:col-span-2 lg:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search plan name, provider, or category..."
              className="w-full min-h-[40px] pl-9 pr-3 py-1.5 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] placeholder-slate-400 focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          {/* Company filter */}
          <div className="lg:col-span-3">
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="w-full min-h-[40px] px-3 py-1.5 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
            >
              <option value="all">All Companies</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category filter */}
          <div className="lg:col-span-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full min-h-[40px] px-3 py-1.5 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div className="lg:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full min-h-[40px] px-3 py-1.5 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
            >
              <option value="all">Status: All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Counts & Clear */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-[#F4F2EA]">
          <span>
            Found <strong className="text-[#0A192F]">{plans.length}</strong> insurance plans
          </span>

          {(companyFilter !== 'all' || categoryFilter !== 'all' || statusFilter !== 'all' || search) && (
            <button
              type="button"
              onClick={() => {
                setCompanyFilter('all');
                setCategoryFilter('all');
                setStatusFilter('all');
                setSearch('');
              }}
              className="text-[#8C6E2E] font-semibold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Table & Cards */}
      {loading ? (
        <div className="bg-white p-16 rounded-xl border border-[#E8E4D8] text-center text-xs text-slate-500 shadow-xs">
          <div className="w-6 h-6 border-2 border-[#0A192F] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading insurance plans from Supabase...
        </div>
      ) : plans.length === 0 ? (
        <div className="bg-white p-16 rounded-xl border border-[#E8E4D8] text-center space-y-4 shadow-xs">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-[#0A192F]">
              No insurance plans match your search
            </h3>
            <p className="text-xs text-slate-500">
              Try adjusting your filter options or add a new insurance policy.
            </p>
          </div>
          <div>
            <Link
              to="/admin/insurance/plans/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0A192F] text-[#E2C98D] text-xs font-bold uppercase tracking-wider"
            >
              <Plus className="w-4 h-4 text-[#C5A059]" />
              <span>+ Add Insurance Plan</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#E8E4D8] shadow-xs overflow-hidden">
          {/* DESKTOP TABLE */}
          <div className="hidden xl:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] text-slate-600 font-semibold uppercase tracking-wider border-b border-[#E8E4D8]">
                <tr>
                  <th className="py-3.5 px-4">Plan Name</th>
                  <th className="py-3.5 px-4">Insurance Company</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Premium Starting From</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4">Created Date</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F2EA]">
                {plans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-[#FAF9F5]/70 transition-colors">
                    {/* Plan Name */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <span className="font-serif font-bold text-[#0A192F] text-sm block">
                        {plan.name}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                        /{plan.slug}
                      </span>
                    </td>

                    {/* Company */}
                    <td className="py-3.5 px-4 font-semibold text-slate-700 whitespace-nowrap">
                      {plan.insurance_companies?.name || 'Partner Insurer'}
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[11px] border border-blue-200">
                        {plan.category}
                      </span>
                    </td>

                    {/* Premium Starting From */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-700 font-medium">
                      {plan.eligibility && (plan.eligibility.includes('₹') || plan.eligibility.toLowerCase().includes('starting') || plan.eligibility.toLowerCase().includes('per year'))
                        ? plan.eligibility
                        : 'On Proposal'}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(plan)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold border transition-colors cursor-pointer ${
                          plan.active
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                        }`}
                        title="Click to toggle status"
                      >
                        {plan.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>

                    {/* Created Date */}
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {formatDate(plan.created_at)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setViewingPlan(plan)}
                          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-[#0A192F] transition-colors"
                          title="View Plan Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <Link
                          to={`/admin/insurance/plans/${plan.id}/edit`}
                          className="p-1.5 rounded-md hover:bg-[#FAF4E5] text-[#8C6E2E] transition-colors"
                          title="Edit Plan"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => {
                            setPlanToDelete(plan);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-md hover:bg-red-50 text-red-600 transition-colors"
                          title="Delete Plan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}
          <div className="xl:hidden divide-y divide-[#F4F2EA]">
            {plans.map((plan) => (
              <div key={plan.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-serif font-bold text-sm text-[#0A192F] block">
                      {plan.name}
                    </span>
                    <span className="text-xs text-[#8C6E2E] font-medium block">
                      {plan.insurance_companies?.name || 'Partner Insurer'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleActive(plan)}
                    className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold border ${
                      plan.active
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {plan.active ? 'Active' : 'Inactive'}
                  </button>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2">
                  {plan.short_description || 'No description provided.'}
                </p>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-[#F4F2EA] text-slate-500">
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[10px] border border-blue-200">
                    {plan.category}
                  </span>
                  <span>{formatDate(plan.created_at)}</span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F4F2EA]">
                  <button
                    type="button"
                    onClick={() => setViewingPlan(plan)}
                    className="min-h-[36px] px-3 py-1.5 rounded bg-slate-100 text-slate-700 text-xs font-semibold inline-flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>

                  <Link
                    to={`/admin/insurance/plans/${plan.id}/edit`}
                    className="min-h-[36px] px-3.5 py-1.5 rounded bg-[#0A192F] text-[#E2C98D] text-xs font-bold uppercase inline-flex items-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Edit</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setPlanToDelete(plan);
                      setDeleteModalOpen(true);
                    }}
                    className="min-h-[36px] px-3 py-1.5 rounded bg-red-50 text-red-600 text-xs font-semibold inline-flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PLAN DETAILS PREVIEW MODAL */}
      {viewingPlan && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in"
          onClick={() => setViewingPlan(null)}
        >
          <div
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 border border-[#E8E4D8] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-[#F4F2EA] pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C6E2E]">
                  {viewingPlan.category} Insurance
                </span>
                <h3 className="font-serif text-xl font-bold text-[#0A192F]">
                  {viewingPlan.name}
                </h3>
                <span className="text-xs text-slate-500">
                  Provider: <strong>{viewingPlan.insurance_companies?.name || 'Partner Insurer'}</strong>
                </span>
              </div>

              <button
                type="button"
                onClick={() => setViewingPlan(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {viewingPlan.description && (
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Description
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {viewingPlan.description}
                </p>
              </div>
            )}

            {Array.isArray(viewingPlan.key_benefits) && viewingPlan.key_benefits.length > 0 && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Key Benefits
                </h4>
                <ul className="space-y-1 text-xs text-slate-600 list-disc list-inside">
                  {(viewingPlan.key_benefits as string[]).map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            )}

            {viewingPlan.eligibility && (
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Eligibility
                </h4>
                <p className="text-xs text-slate-600">{viewingPlan.eligibility}</p>
              </div>
            )}

            {Array.isArray(viewingPlan.documents_required) && viewingPlan.documents_required.length > 0 && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Documents Required
                </h4>
                <ul className="space-y-1 text-xs text-slate-600 list-disc list-inside">
                  {(viewingPlan.documents_required as string[]).map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F4F2EA]">
              <Link
                to={`/admin/insurance/plans/${viewingPlan.id}/edit`}
                className="min-h-[38px] px-4 py-1.5 rounded-lg bg-[#0A192F] text-[#E2C98D] text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5"
                onClick={() => setViewingPlan(null)}
              >
                <Edit className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Edit Plan</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title="Delete this insurance plan?"
        itemName={planToDelete?.name}
        message="Are you sure you want to delete this insurance plan? This action cannot be undone."
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalOpen(false);
          setPlanToDelete(null);
        }}
      />
    </div>
  );
};
