import React, { useState, useEffect } from 'react';
import {
  Landmark,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  ExternalLink,
  Phone,
  RefreshCw,
} from 'lucide-react';
import {
  getAdminFinanceCompanies,
  createFinanceCompany,
  updateFinanceCompany,
  deleteFinanceCompany,
} from '../../services/admin';
import { FinanceCompanyRow, FinanceCompanyInsert } from '../../types/database';
import { DeleteConfirmModal } from '../../components/admin/DeleteConfirmModal';

export const AdminFinanceCompaniesPage: React.FC = () => {
  const [companies, setCompanies] = useState<FinanceCompanyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<FinanceCompanyRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<FinanceCompanyRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState<FinanceCompanyInsert>({
    name: '',
    slug: '',
    short_description: '',
    description: '',
    logo_url: '',
    website_url: '',
    phone: '',
    email: '',
    active: true,
  });

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const data = await getAdminFinanceCompanies();
      setCompanies(data);
    } catch (err) {
      console.warn('Finance companies fetch error:', err);
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

  const openAddModal = () => {
    setEditingCompany(null);
    setFormData({
      name: '',
      slug: '',
      short_description: '',
      description: '',
      logo_url: '',
      website_url: '',
      phone: '',
      email: '',
      active: true,
    });
    setErrorMessage('');
    setModalOpen(true);
  };

  const openEditModal = (comp: FinanceCompanyRow) => {
    setEditingCompany(comp);
    setFormData({
      name: comp.name,
      slug: comp.slug,
      short_description: comp.short_description || '',
      description: comp.description || '',
      logo_url: comp.logo_url || '',
      website_url: comp.website_url || '',
      phone: comp.phone || '',
      email: comp.email || '',
      active: comp.active,
    });
    setErrorMessage('');
    setModalOpen(true);
  };

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    setFormData((prev: FinanceCompanyInsert) => ({
      ...prev,
      name,
      slug: editingCompany ? prev.slug : slug,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.slug?.trim()) {
      setErrorMessage('Company Name and URL Slug are required.');
      return;
    }

    setSaving(true);
    setErrorMessage('');

    try {
      if (editingCompany) {
        const res = await updateFinanceCompany(editingCompany.id, formData);
        if (res.error) {
          setErrorMessage(res.error);
        } else {
          showToast('Financial institution updated.');
          setModalOpen(false);
          loadCompanies();
        }
      } else {
        const res = await createFinanceCompany(formData);
        if (res.error) {
          setErrorMessage(res.error);
        } else {
          showToast('Financial institution added.');
          setModalOpen(false);
          loadCompanies();
        }
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (comp: FinanceCompanyRow) => {
    const updatedStatus = !comp.active;
    const res = await updateFinanceCompany(comp.id, { active: updatedStatus });
    if (res.data) {
      setCompanies((prev) =>
        prev.map((c) => (c.id === comp.id ? { ...c, active: updatedStatus } : c))
      );
      showToast(updatedStatus ? 'Institution activated.' : 'Institution deactivated.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!companyToDelete) return;
    setIsDeleting(true);
    const res = await deleteFinanceCompany(companyToDelete.id);
    setIsDeleting(false);

    if (res.success) {
      setCompanies((prev) => prev.filter((c) => c.id !== companyToDelete.id));
      showToast('Financial institution and associated loan services removed.');
      setDeleteModalOpen(false);
      setCompanyToDelete(null);
    } else {
      alert(res.error || 'Failed to delete company.');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A192F] text-[#E2C98D] px-4 py-3 rounded-lg shadow-xl border border-[#C5A059]/40 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E4D8] pb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#8C6E2E]">
            Finance Division
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A192F]">
            Partner Banks &amp; Finance Companies
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Lending associates and banking partners for mortgage, MSME, and property credit.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadCompanies}
            disabled={loading}
            className="min-h-[42px] px-3 py-2 rounded-lg bg-white border border-[#E8E4D8] text-xs font-semibold text-slate-700 hover:bg-[#FAF9F5]"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#8C6E2E] ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={openAddModal}
            className="min-h-[42px] px-4 py-2 rounded-lg bg-[#0A192F] hover:bg-[#112240] text-[#E2C98D] text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4 text-[#C5A059]" />
            <span>Add Bank / Financier</span>
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="p-16 text-center text-xs text-slate-500 bg-white rounded-xl border border-[#E8E4D8]">
          Loading financial institutions...
        </div>
      ) : companies.length === 0 ? (
        <div className="p-16 text-center space-y-3 bg-white rounded-xl border border-[#E8E4D8]">
          <Landmark className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-[#0A192F]">
            No Financial Institutions Found
          </h3>
          <p className="text-xs text-slate-500">
            Add authorized banks and housing finance partners.
          </p>
          <button
            type="button"
            onClick={openAddModal}
            className="px-4 py-2 rounded-lg bg-[#0A192F] text-[#E2C98D] text-xs font-bold uppercase inline-flex items-center gap-1"
          >
            <Plus className="w-4 h-4 text-[#C5A059]" />
            <span>Add First Institution</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#E8E4D8] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] text-slate-600 font-semibold uppercase tracking-wider border-b border-[#E8E4D8]">
                <tr>
                  <th className="py-3.5 px-6">Institution Name</th>
                  <th className="py-3.5 px-4">Tagline / Short Desc</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F2EA]">
                {companies.map((comp) => (
                  <tr key={comp.id} className="hover:bg-[#FAF9F5]/70 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-serif font-bold text-sm text-[#0A192F] block">
                        {comp.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Slug: /{comp.slug}
                      </span>
                    </td>

                    <td className="py-4 px-4 max-w-xs text-slate-600">
                      <p className="truncate">{comp.short_description || comp.description || '—'}</p>
                    </td>

                    <td className="py-4 px-4 text-slate-600 space-y-0.5">
                      {comp.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#C5A059]" />
                          <span>{comp.phone}</span>
                        </div>
                      )}
                      {comp.website_url && (
                        <div className="flex items-center gap-1">
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                          <a
                            href={comp.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline text-blue-600 truncate max-w-[140px] block"
                          >
                            {comp.website_url.replace(/^https?:\/\//, '')}
                          </a>
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(comp)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                          comp.active
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-300'
                        }`}
                        title="Click to toggle status"
                      >
                        {comp.active ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            <span>Inactive</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(comp)}
                          className="p-1.5 rounded-md hover:bg-[#FAF4E5] text-[#8C6E2E] transition-colors"
                          title="Edit Institution"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setCompanyToDelete(comp);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-md hover:bg-red-50 text-red-600 transition-colors"
                          title="Delete Institution"
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
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-[#F4F2EA] pb-4">
              <h2 className="font-serif text-xl font-bold text-[#0A192F]">
                {editingCompany ? 'Edit Financial Institution' : 'Add Financial Institution'}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Institution Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. State Bank of India"
                    className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-[#D5CEBF] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="sbi"
                    className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-[#D5CEBF] text-xs font-mono text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Tagline / Specialization
                </label>
                <input
                  type="text"
                  value={formData.short_description || ''}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  placeholder="e.g. Premier sovereign banking partner for competitive home loans"
                  className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-[#D5CEBF] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Overview &amp; Loan Strengths
                </label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Institutional background, tenure terms, and branch presence in Rajpipla / Gujarat..."
                  className="w-full p-3 rounded-lg border border-[#D5CEBF] text-xs leading-relaxed text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={formData.website_url || ''}
                    onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                    placeholder="https://www.sbi.co.in"
                    className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-[#D5CEBF] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="1800-11-2211"
                    className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-[#D5CEBF] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="fin_active_status"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded border-slate-300 text-[#0A192F] focus:ring-[#C5A059]"
                />
                <label htmlFor="fin_active_status" className="text-xs font-semibold text-slate-700">
                  Active (Visible on public finance directory)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F4F2EA]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-lg bg-[#0A192F] text-[#E2C98D] text-xs font-bold uppercase tracking-wider hover:bg-[#112240] disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingCompany ? 'Save Changes' : 'Add Institution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Financial Institution"
        itemName={companyToDelete?.name}
        message={
          companyToDelete
            ? `Are you sure you want to delete ${companyToDelete.name}? Any loan services linked to this institution will also be removed.`
            : undefined
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
