import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Search,
  Filter,
  Phone,
  MessageSquare,
  Mail,
  Trash2,
  CheckCircle,
  Clock,
  Building2,
  ShieldCheck,
  Landmark,
  RefreshCw,
} from 'lucide-react';
import {
  getAdminEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
} from '../../services/admin';
import { EnquiryRow } from '../../types/database';
import { DeleteConfirmModal } from '../../components/admin/DeleteConfirmModal';

export const AdminEnquiriesPage: React.FC = () => {
  const [enquiries, setEnquiries] = useState<
    (EnquiryRow & {
      properties?: { title: string; slug: string } | null;
      insurance_plans?: { name: string } | null;
      finance_services?: { name: string } | null;
    })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [serviceFilter, setServiceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [enquiryToDelete, setEnquiryToDelete] = useState<EnquiryRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      const data = await getAdminEnquiries({
        serviceType: serviceFilter,
        status: statusFilter,
        search,
      });
      setEnquiries(data);
    } catch (err) {
      console.warn('Enquiries fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, [serviceFilter, statusFilter, search]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleStatusChange = async (enquiryId: string, newStatus: string) => {
    const res = await updateEnquiryStatus(enquiryId, newStatus);
    if (res.success) {
      setEnquiries((prev) =>
        prev.map((e) => (e.id === enquiryId ? { ...e, status: newStatus } : e))
      );
      showToast(`Enquiry status updated to ${newStatus}.`);
    } else {
      alert(res.error || 'Failed to update enquiry status.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!enquiryToDelete) return;
    setIsDeleting(true);
    const res = await deleteEnquiry(enquiryToDelete.id);
    setIsDeleting(false);

    if (res.success) {
      setEnquiries((prev) => prev.filter((e) => e.id !== enquiryToDelete.id));
      showToast('Enquiry record deleted.');
      setDeleteModalOpen(false);
      setEnquiryToDelete(null);
    } else {
      alert(res.error || 'Failed to delete enquiry.');
    }
  };

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
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
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
            Client Communications
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A192F]">
            Customer Enquiries
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Real estate inquiries, policy consultations, and loan advisory requests.
          </p>
        </div>

        <button
          type="button"
          onClick={loadEnquiries}
          disabled={loading}
          className="min-h-[42px] px-3.5 py-2 rounded-lg bg-white border border-[#E8E4D8] text-xs font-semibold text-slate-700 hover:bg-[#FAF9F5] shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
          title="Refresh enquiries"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#8C6E2E] ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#E8E4D8] shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer name, phone number, or email..."
              className="w-full min-h-[40px] pl-9 pr-3 py-1.5 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          {/* Service Filter */}
          <div className="md:col-span-3">
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="w-full min-h-[40px] px-3 py-1.5 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
            >
              <option value="all">All Divisions</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Insurance">Insurance</option>
              <option value="Finance">Finance</option>
              <option value="General Enquiry">General Enquiry</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full min-h-[40px] px-3 py-1.5 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Enquiries List */}
      {loading ? (
        <div className="p-16 text-center text-xs text-slate-500 bg-white rounded-xl border border-[#E8E4D8]">
          Loading enquiries...
        </div>
      ) : enquiries.length === 0 ? (
        <div className="p-16 text-center space-y-3 bg-white rounded-xl border border-[#E8E4D8]">
          <Inbox className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-[#0A192F]">
            No Customer Enquiries Found
          </h3>
          <p className="text-xs text-slate-500">
            Enquiries submitted through the website will appear here in real-time.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
            <span>
              Showing <strong className="text-[#0A192F]">{enquiries.length}</strong> inquiries
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {enquiries.map((enq) => {
              const cleanPhone = enq.phone.replace(/\D/g, '');
              const whatsappUrl = `https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(
                enq.name
              )},%20this%20is%20Gaurav%20Shah%20from%20Unique%20Group%20regarding%20your%20enquiry.`;

              return (
                <div
                  key={enq.id}
                  className={`bg-white p-5 sm:p-6 rounded-xl border transition-all space-y-4 shadow-xs ${
                    enq.status === 'new'
                      ? 'border-rose-300 ring-1 ring-rose-200'
                      : 'border-[#E8E4D8]'
                  }`}
                >
                  {/* Top Bar: Name, Service Tag, Date, Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F4F2EA] pb-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-serif text-lg font-bold text-[#0A192F]">
                        {enq.name}
                      </span>
                      <span className="capitalize px-2.5 py-0.5 rounded bg-slate-100 font-semibold text-slate-700 text-[11px]">
                        {enq.service_type?.replace('_', ' ') || 'General'}
                      </span>
                      {enq.properties?.title && (
                        <span className="text-[11px] font-medium text-[#8C6E2E] bg-[#FAF4E5] px-2 py-0.5 rounded border border-[#C5A059]/30 truncate max-w-xs">
                          Property: {enq.properties.title}
                        </span>
                      )}
                      {enq.insurance_plans?.name && (
                        <span className="text-[11px] font-medium text-[#8C6E2E] bg-[#FAF4E5] px-2 py-0.5 rounded border border-[#C5A059]/30 truncate max-w-xs">
                          Plan: {enq.insurance_plans.name}
                        </span>
                      )}
                      {enq.finance_services?.name && (
                        <span className="text-[11px] font-medium text-[#8C6E2E] bg-[#FAF4E5] px-2 py-0.5 rounded border border-[#C5A059]/30 truncate max-w-xs">
                          Loan: {enq.finance_services.name}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(enq.created_at).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Contact Info Strip */}
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5 font-semibold text-[#0A192F]">
                      <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>{enq.phone}</span>
                    </div>

                    {enq.email && (
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <a href={`mailto:${enq.email}`} className="hover:underline">
                          {enq.email}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Customer Message */}
                  {enq.message && (
                    <div className="p-3.5 rounded-lg bg-[#FAF9F5] border border-[#E8E4D8] text-xs text-slate-700 leading-relaxed">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Customer Message
                      </span>
                      {enq.message}
                    </div>
                  )}

                  {/* Actions & Status Dropdown */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    {/* Status Changer */}
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold text-slate-600 whitespace-nowrap">
                        Status:
                      </label>
                      <select
                        value={enq.status ? enq.status.toLowerCase().replace(' ', '_') : 'new'}
                        onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                        className={`text-xs font-bold uppercase rounded-lg px-3 py-1.5 border focus:outline-none focus:ring-1 focus:ring-[#C5A059] ${getStatusBadge(
                          enq.status
                        )}`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>

                    {/* Quick Call, WhatsApp, Delete Buttons */}
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${enq.phone}`}
                        className="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-[#FAF4E5] hover:text-[#8C6E2E] text-[#0A192F] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>Call</span>
                      </a>

                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          setEnquiryToDelete(enq);
                          setDeleteModalOpen(true);
                        }}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete enquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Customer Enquiry"
        itemName={enquiryToDelete?.name}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalOpen(false);
          setEnquiryToDelete(null);
        }}
      />
    </div>
  );
};
