import React, { useState, useEffect } from 'react';
import {
  MessageSquareQuote,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Star,
  RefreshCw,
} from 'lucide-react';
import {
  getAdminTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../../services/admin';
import { TestimonialRow, TestimonialInsert } from '../../types/database';
import { DeleteConfirmModal } from '../../components/admin/DeleteConfirmModal';

export const AdminTestimonialsPage: React.FC = () => {
  const [testimonials, setTestimonials] = useState<TestimonialRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<TestimonialRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState<TestimonialInsert>({
    customer_name: '',
    message: '',
    rating: 5,
    location: 'Rajpipla, Gujarat',
    active: true,
    display_order: 0,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAdminTestimonials();
      setTestimonials(data);
    } catch (err) {
      console.warn('Testimonials fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const openAddModal = () => {
    setEditingTestimonial(null);
    setFormData({
      customer_name: '',
      message: '',
      rating: 5,
      location: 'Rajpipla, Gujarat',
      active: true,
      display_order: testimonials.length,
    });
    setErrorMessage('');
    setModalOpen(true);
  };

  const openEditModal = (t: TestimonialRow) => {
    setEditingTestimonial(t);
    setFormData({
      customer_name: t.customer_name,
      message: t.message,
      rating: t.rating ?? 5,
      location: t.location || '',
      active: t.active,
      display_order: t.display_order,
    });
    setErrorMessage('');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer_name?.trim() || !formData.message?.trim()) {
      setErrorMessage('Customer name and testimonial message are required.');
      return;
    }

    setSaving(true);
    setErrorMessage('');

    try {
      if (editingTestimonial) {
        const res = await updateTestimonial(editingTestimonial.id, formData);
        if (res.error) {
          setErrorMessage(res.error);
        } else {
          showToast('Testimonial updated.');
          setModalOpen(false);
          loadData();
        }
      } else {
        const res = await createTestimonial(formData);
        if (res.error) {
          setErrorMessage(res.error);
        } else {
          showToast('Testimonial added.');
          setModalOpen(false);
          loadData();
        }
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (t: TestimonialRow) => {
    const updated = !t.active;
    const res = await updateTestimonial(t.id, { active: updated });
    if (res.data) {
      setTestimonials((prev) =>
        prev.map((item) => (item.id === t.id ? { ...item, active: updated } : item))
      );
      showToast(updated ? 'Testimonial activated.' : 'Testimonial hidden.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    const res = await deleteTestimonial(itemToDelete.id);
    setIsDeleting(false);

    if (res.success) {
      setTestimonials((prev) => prev.filter((t) => t.id !== itemToDelete.id));
      showToast('Testimonial deleted.');
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } else {
      alert(res.error || 'Failed to delete testimonial.');
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
            Website Content
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A192F]">
            Client Testimonials &amp; Trust Endorsements
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Real feedback from local property buyers, policyholders, and businesses.
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
            <span>Add Testimonial</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="p-16 text-center text-xs text-slate-500 bg-white rounded-xl border border-[#E8E4D8]">
          Loading testimonials...
        </div>
      ) : testimonials.length === 0 ? (
        <div className="p-16 text-center space-y-3 bg-white rounded-xl border border-[#E8E4D8]">
          <MessageSquareQuote className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-[#0A192F]">
            No Testimonials Found
          </h3>
          <p className="text-xs text-slate-500">
            Add client reviews to display in the about section.
          </p>
          <button
            type="button"
            onClick={openAddModal}
            className="px-4 py-2 rounded-lg bg-[#0A192F] text-[#E2C98D] text-xs font-bold uppercase inline-flex items-center gap-1"
          >
            <Plus className="w-4 h-4 text-[#C5A059]" />
            <span>Add First Testimonial</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white p-5 rounded-xl border border-[#E8E4D8] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#C5A059] transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#C5A059]">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#C5A059]" />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleActive(t)}
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                      t.active
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border-slate-300'
                    }`}
                  >
                    {t.active ? 'Active' : 'Hidden'}
                  </button>
                </div>

                <p className="text-xs text-slate-700 italic leading-relaxed line-clamp-4">
                  "{t.message}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#F4F2EA] flex items-center justify-between">
                <div>
                  <span className="font-serif font-bold text-sm text-[#0A192F] block">
                    {t.customer_name}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {t.location || 'Rajpipla'}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(t)}
                    className="p-1.5 rounded-md hover:bg-[#FAF4E5] text-[#8C6E2E] transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setItemToDelete(t);
                      setDeleteModalOpen(true);
                    }}
                    className="p-1.5 rounded-md hover:bg-red-50 text-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-[#F4F2EA] pb-4">
              <h2 className="font-serif text-xl font-bold text-[#0A192F]">
                {editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
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
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Customer / Client Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  placeholder="e.g. Nilesh Parekh"
                  className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-[#D5CEBF] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Client Location
                </label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Rajpipla, Gujarat"
                  className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-[#D5CEBF] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Rating (1 to 5)
                </label>
                <select
                  value={formData.rating || 5}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value, 10) })}
                  className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-[#D5CEBF] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                >
                  <option value={5}>5 Stars ★★★★★</option>
                  <option value={4}>4 Stars ★★★★☆</option>
                  <option value={3}>3 Stars ★★★☆☆</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Testimonial Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Customer review of Unique Group's guidance..."
                  className="w-full p-3 rounded-lg border border-[#D5CEBF] text-xs leading-relaxed text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="testim_active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded border-slate-300 text-[#0A192F] focus:ring-[#C5A059]"
                />
                <label htmlFor="testim_active" className="text-xs font-semibold text-slate-700">
                  Active (Display on website)
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
                  {saving ? 'Saving...' : editingTestimonial ? 'Save Changes' : 'Add Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Testimonial"
        itemName={itemToDelete?.customer_name}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
      />
    </div>
  );
};
