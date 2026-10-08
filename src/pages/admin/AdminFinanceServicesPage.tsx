import React, { useState, useEffect } from 'react';
import {
  Coins,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  RefreshCw,
  Filter,
} from 'lucide-react';
import {
  getAdminFinanceServices,
  getAdminFinanceCompanies,
  createFinanceService,
  updateFinanceService,
  deleteFinanceService,
} from '../../services/admin';
import {
  FinanceServiceRow,
  FinanceServiceInsert,
  FinanceCompanyRow,
} from '../../types/database';
import { DeleteConfirmModal } from '../../components/admin/DeleteConfirmModal';

export const AdminFinanceServicesPage: React.FC = () => {
  const [services, setServices] = useState<
    (FinanceServiceRow & { finance_companies?: { name: string } | null })[]
  >([]);
  const [companies, setCompanies] = useState<FinanceCompanyRow[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState('all');
  const [loading, setLoading] = useState(true);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<FinanceServiceRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<FinanceServiceRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState<FinanceServiceInsert>({
    company_id: '',
    name: '',
    slug: '',
    category: 'Home Loan',
    short_description: '',
    description: '',
    eligibility: '',
    documents_required: [] as any,
    contact_phone: '9909015956',
    active: true,
  });

  const [docsText, setDocsText] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [sData, cData] = await Promise.all([
        getAdminFinanceServices(selectedCompanyId),
        getAdminFinanceCompanies(),
      ]);
      setServices(sData);
      setCompanies(cData);
    } catch (err) {
      console.warn('Finance services fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCompanyId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const openAddModal = () => {
    setEditingService(null);
    setFormData({
      company_id: companies[0]?.id || '',
      name: '',
      slug: '',
      category: 'Home Loan',
      short_description: '',
      description: '',
      eligibility: 'Salaried individuals & registered businesses',
      documents_required: [],
      contact_phone: '9909015956',
      active: true,
    });
    setDocsText('');
    setErrorMessage('');
    setModalOpen(true);
  };

  const openEditModal = (service: FinanceServiceRow) => {
    setEditingService(service);
    const docs = Array.isArray(service.documents_required)
      ? (service.documents_required as string[])
      : [];

    setFormData({
      company_id: service.company_id,
      name: service.name,
      slug: service.slug,
      category: service.category,
      short_description: service.short_description || '',
      description: service.description || '',
      eligibility: service.eligibility || '',
      documents_required: docs,
      contact_phone: service.contact_phone || '9909015956',
      active: service.active,
    });
    setDocsText(docs.join('\n'));
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

    setFormData((prev: FinanceServiceInsert) => ({
      ...prev,
      name,
      slug: editingService ? prev.slug : slug,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.company_id) {
      setErrorMessage('Service Name and Financial Institution are required.');
      return;
    }

    setSaving(true);
    setErrorMessage('');

    const parsedDocs = docsText
      .split('\n')
      .map((d) => d.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      documents_required: parsedDocs,
    };

    try {
      if (editingService) {
        const res = await updateFinanceService(editingService.id, payload);
        if (res.error) {
          setErrorMessage(res.error);
        } else {
          showToast('Finance service updated.');
          setModalOpen(false);
          loadData();
        }
      } else {
        const res = await createFinanceService(payload);
        if (res.error) {
          setErrorMessage(res.error);
        } else {
          showToast('Finance service created.');
          setModalOpen(false);
          loadData();
        }
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (svc: FinanceServiceRow) => {
    const updatedStatus = !svc.active;
    const res = await updateFinanceService(svc.id, { active: updatedStatus });
    if (res.data) {
      setServices((prev) =>
        prev.map((s) => (s.id === svc.id ? { ...s, active: updatedStatus } : s))
      );
      showToast(updatedStatus ? 'Service activated.' : 'Service deactivated.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!serviceToDelete) return;
    setIsDeleting(true);
    const res = await deleteFinanceService(serviceToDelete.id);
    setIsDeleting(false);

    if (res.success) {
      setServices((prev) => prev.filter((s) => s.id !== serviceToDelete.id));
      showToast('Finance service removed.');
      setDeleteModalOpen(false);
      setServiceToDelete(null);
    } else {
      alert(res.error || 'Failed to delete service.');
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
            Finance Services &amp; Loan Facilities
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Credit facilities, mortgages, and business loans offered by partner institutions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadData}
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
            <span>Add Service</span>
          </button>
        </div>
      </div>

      {/* Filter by Company */}
      <div className="bg-white p-4 rounded-xl border border-[#E8E4D8] shadow-xs flex items-center gap-3">
        <Filter className="w-4 h-4 text-slate-400" />
        <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
          Filter by Institution:
        </label>
        <select
          value={selectedCompanyId}
          onChange={(e) => setSelectedCompanyId(e.target.value)}
          className="min-h-[38px] px-3 py-1.5 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059] max-w-xs"
        >
          <option value="all">All Institutions</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Services Table */}
      {loading ? (
        <div className="p-16 text-center text-xs text-slate-500 bg-white rounded-xl border border-[#E8E4D8]">
          Loading financial services...
        </div>
      ) : services.length === 0 ? (
        <div className="p-16 text-center space-y-3 bg-white rounded-xl border border-[#E8E4D8]">
          <Coins className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-[#0A192F]">
            No Finance Services Found
          </h3>
          <p className="text-xs text-slate-500">
            Add home loans, business credits, and property mortgage facilities.
          </p>
          <button
            type="button"
            onClick={openAddModal}
            className="px-4 py-2 rounded-lg bg-[#0A192F] text-[#E2C98D] text-xs font-bold uppercase inline-flex items-center gap-1"
          >
            <Plus className="w-4 h-4 text-[#C5A059]" />
            <span>Add First Service</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#E8E4D8] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] text-slate-600 font-semibold uppercase tracking-wider border-b border-[#E8E4D8]">
                <tr>
                  <th className="py-3.5 px-6">Service Name</th>
                  <th className="py-3.5 px-4">Lending Partner</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Eligibility</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F2EA]">
                {services.map((svc) => (
                  <tr key={svc.id} className="hover:bg-[#FAF9F5]/70 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-serif font-bold text-sm text-[#0A192F] block">
                        {svc.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Slug: /{svc.slug}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-semibold text-[#8C6E2E]">
                      {svc.finance_companies?.name || 'Partner Bank'}
                    </td>

                    <td className="py-4 px-4">
                      <span className="capitalize px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-700">
                        {svc.category}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-slate-600">
                      {svc.eligibility || '—'}
                    </td>

                    <td className="py-4 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(svc)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                          svc.active
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-300'
                        }`}
                        title="Click to toggle status"
                      >
                        {svc.active ? (
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
                          onClick={() => openEditModal(svc)}
                          className="p-1.5 rounded-md hover:bg-[#FAF4E5] text-[#8C6E2E] transition-colors"
                          title="Edit Service"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setServiceToDelete(svc);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-md hover:bg-red-50 text-red-600 transition-colors"
                          title="Delete Service"
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
                {editingService ? 'Edit Finance Service' : 'Add New Finance Service'}
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
                    Partner Institution *
                  </label>
                  <select
                    required
                    value={formData.company_id}
                    onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
                    className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-[#D5CEBF] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                  >
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-[#D5CEBF] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="Home Loan">Home Purchase Loan</option>
                    <option value="Business Loan">Business / MSME Loan</option>
                    <option value="Loan Against Property">Loan Against Property (LAP)</option>
                    <option value="Commercial Mortgage">Commercial Mortgage</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Service Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Regular Home Loan Sanction"
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
                    placeholder="regular-home-loan"
                    className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-[#D5CEBF] text-xs font-mono text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={formData.short_description || ''}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  placeholder="e.g. Lowest rates starting from 8.35% with expedited processing"
                  className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-[#D5CEBF] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Required Documents (One per line)
                </label>
                <textarea
                  rows={3}
                  value={docsText}
                  onChange={(e) => setDocsText(e.target.value)}
                  placeholder="PAN & Aadhaar Card&#10;Last 6 months bank statements&#10;Salary slips / 2 Years ITR&#10;Property title documents"
                  className="w-full p-3 rounded-lg border border-[#D5CEBF] text-xs leading-relaxed text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Eligibility Guidelines
                  </label>
                  <input
                    type="text"
                    value={formData.eligibility || ''}
                    onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                    placeholder="e.g. Indian Resident, Age 21 to 65"
                    className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-[#D5CEBF] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.contact_phone || ''}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    placeholder="9909015956"
                    className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-[#D5CEBF] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="svc_active_status"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded border-slate-300 text-[#0A192F] focus:ring-[#C5A059]"
                />
                <label htmlFor="svc_active_status" className="text-xs font-semibold text-slate-700">
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
                  {saving ? 'Saving...' : editingService ? 'Save Changes' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Finance Service"
        itemName={serviceToDelete?.name}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalOpen(false);
          setServiceToDelete(null);
        }}
      />
    </div>
  );
};
