import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  ExternalLink,
  Phone,
  Mail,
  RefreshCw,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import {
  getAdminInsuranceCompanies,
  toggleInsuranceCompanyActive,
  deleteInsuranceCompany,
  InsuranceCompanyWithPlanCount,
} from '../../services/admin';
import { DeleteConfirmModal } from '../../components/admin/DeleteConfirmModal';

export const AdminInsuranceCompaniesPage: React.FC = () => {
  const location = useLocation();
  const [companies, setCompanies] = useState<InsuranceCompanyWithPlanCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<InsuranceCompanyWithPlanCount | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (location.state && (location.state as any).message) {
      setToastMessage((location.state as any).message);
      window.history.replaceState({}, document.title);
      const timer = setTimeout(() => setToastMessage(''), 4500);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const data = await getAdminInsuranceCompanies();
      setCompanies(data);
    } catch (err) {
      console.warn('Companies fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleToggleActive = async (comp: InsuranceCompanyWithPlanCount) => {
    const newStatus = !comp.active;
    const success = await toggleInsuranceCompanyActive(comp.id, newStatus);
    if (success) {
      setCompanies((prev) =>
        prev.map((c) => (c.id === comp.id ? { ...c, active: newStatus } : c))
      );
      showToast(`${comp.name} marked as ${newStatus ? 'Active' : 'Inactive'}.`);
    } else {
      alert('Failed to update status.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!companyToDelete) return;
    setIsDeleting(true);
    const res = await deleteInsuranceCompany(companyToDelete.id);
    setIsDeleting(false);

    if (res.success) {
      setCompanies((prev) => prev.filter((c) => c.id !== companyToDelete.id));
      showToast('Insurance company and related plans deleted.');
      setDeleteModalOpen(false);
      setCompanyToDelete(null);
    } else {
      alert(res.error || 'Failed to delete insurance company.');
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
            Insurance Companies
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage partner insurance providers, logos, and public plan portfolios.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadCompanies}
            disabled={loading}
            className="min-h-[42px] px-3.5 py-2 rounded-lg bg-white border border-[#E8E4D8] text-xs font-semibold text-slate-700 hover:bg-[#FAF9F5] shadow-xs flex items-center gap-1.5"
            title="Refresh list"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#8C6E2E] ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <Link
            to="/admin/insurance/companies/new"
            className="min-h-[42px] px-4 py-2 rounded-lg bg-[#0A192F] hover:bg-[#112240] text-[#E2C98D] text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4 text-[#C5A059]" />
            <span>+ Add Insurance Company</span>
          </Link>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="bg-white p-16 rounded-xl border border-[#E8E4D8] text-center text-xs text-slate-500 shadow-xs">
          <div className="w-6 h-6 border-2 border-[#0A192F] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading insurance companies from Supabase...
        </div>
      ) : companies.length === 0 ? (
        <div className="bg-white p-16 rounded-xl border border-[#E8E4D8] text-center space-y-4 shadow-xs">
          <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-[#0A192F]">
              No insurance companies found
            </h3>
            <p className="text-xs text-slate-500">
              Add your first insurance partner to begin publishing policy plans.
            </p>
          </div>
          <div>
            <Link
              to="/admin/insurance/companies/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0A192F] text-[#E2C98D] text-xs font-bold uppercase tracking-wider"
            >
              <Plus className="w-4 h-4 text-[#C5A059]" />
              <span>+ Add Insurance Company</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#E8E4D8] shadow-xs overflow-hidden">
          {/* DESKTOP TABLE */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] text-slate-600 font-semibold uppercase tracking-wider border-b border-[#E8E4D8]">
                <tr>
                  <th className="py-3.5 px-4">Company Logo</th>
                  <th className="py-3.5 px-4">Company Name</th>
                  <th className="py-3.5 px-4">Short Description</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-center">Plans</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F2EA]">
                {companies.map((comp) => (
                  <tr key={comp.id} className="hover:bg-[#FAF9F5]/70 transition-colors">
                    {/* Logo */}
                    <td className="py-3.5 px-4">
                      <div className="w-12 h-10 rounded border border-slate-200 bg-white p-1 flex items-center justify-center shrink-0 overflow-hidden">
                        {comp.logo_url ? (
                          <img
                            src={comp.logo_url}
                            alt={comp.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <ShieldCheck className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </td>

                    {/* Company Name */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <span className="font-serif font-bold text-[#0A192F] text-sm block">
                        {comp.name}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                        /{comp.slug}
                      </span>
                    </td>

                    {/* Short Description */}
                    <td className="py-3.5 px-4 max-w-xs text-slate-600 truncate">
                      {comp.short_description || '—'}
                    </td>

                    {/* Phone */}
                    <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                      {comp.phone ? (
                        <a href={`tel:${comp.phone}`} className="hover:text-[#8C6E2E]">
                          {comp.phone}
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>

                    {/* Email */}
                    <td className="py-3.5 px-4 text-slate-700 max-w-[140px] truncate">
                      {comp.email ? (
                        <a href={`mailto:${comp.email}`} className="hover:text-[#8C6E2E]">
                          {comp.email}
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(comp)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold border transition-colors cursor-pointer ${
                          comp.active
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                        }`}
                        title="Click to toggle status"
                      >
                        {comp.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>

                    {/* Number of Plans */}
                    <td className="py-3.5 px-4 text-center font-bold text-[#0A192F] whitespace-nowrap">
                      <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px]">
                        {comp.plans_count ?? 0} plans
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <Link
                          to={`/insurance/${comp.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-[#0A192F] transition-colors"
                          title="View Public Page"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        <Link
                          to={`/admin/insurance/companies/${comp.id}/edit`}
                          className="p-1.5 rounded-md hover:bg-[#FAF4E5] text-[#8C6E2E] transition-colors"
                          title="Edit Company"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => {
                            setCompanyToDelete(comp);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-md hover:bg-red-50 text-red-600 transition-colors"
                          title="Delete Company"
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
          <div className="lg:hidden divide-y divide-[#F4F2EA]">
            {companies.map((comp) => (
              <div key={comp.id} className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-14 h-12 rounded border border-slate-200 bg-white p-1 flex items-center justify-center shrink-0 overflow-hidden">
                    {comp.logo_url ? (
                      <img
                        src={comp.logo_url}
                        alt={comp.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <ShieldCheck className="w-6 h-6 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-serif font-bold text-sm text-[#0A192F] truncate">
                        {comp.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleActive(comp)}
                        className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold border ${
                          comp.active
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {comp.active ? 'Active' : 'Inactive'}
                      </button>
                    </div>

                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                      {comp.short_description || 'No description provided.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-[#F4F2EA] text-slate-500">
                  <span>Available Plans: <strong className="text-[#0A192F]">{comp.plans_count ?? 0}</strong></span>
                  {comp.phone && <span>{comp.phone}</span>}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F4F2EA]">
                  <Link
                    to={`/insurance/${comp.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[36px] px-3 py-1.5 rounded bg-slate-100 text-slate-700 text-xs font-semibold inline-flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </Link>

                  <Link
                    to={`/admin/insurance/companies/${comp.id}/edit`}
                    className="min-h-[36px] px-3.5 py-1.5 rounded bg-[#0A192F] text-[#E2C98D] text-xs font-bold uppercase inline-flex items-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Edit</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setCompanyToDelete(comp);
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title="Delete this insurance company?"
        itemName={companyToDelete?.name}
        message={
          companyToDelete && (companyToDelete.plans_count || 0) > 0
            ? `Warning: This company currently has ${companyToDelete.plans_count} associated insurance plans. Associated insurance plans may also be affected or removed.`
            : 'Associated insurance plans may also be affected. This action cannot be undone.'
        }
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalOpen(false);
          setCompanyToDelete(null);
        }}
      />
    </div>
  );
};
