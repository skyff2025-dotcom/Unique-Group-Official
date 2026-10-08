import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Phone,
  MessageSquare,
  HelpCircle,
  Send,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { InsuranceCompany, InsurancePlan } from '../../types';
import { submitEnquiry } from '../../services/enquiries';
import { useSiteSettings } from '../../context/SiteSettingsContext';

interface InsurancePlanDetailModalProps {
  plan: InsurancePlan | null;
  company: InsuranceCompany;
  isOpen: boolean;
  onClose: () => void;
}

export const InsurancePlanDetailModal: React.FC<InsurancePlanDetailModalProps> = ({
  plan,
  company,
  isOpen,
  onClose,
}) => {
  const settings = useSiteSettings();
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  if (!isOpen || !plan) return null;

  const contactPhone = plan.contactPhone || company.phone || settings.phone;
  const cleanWhatsApp = settings.whatsapp ? settings.whatsapp.replace(/\D/g, '') : '';

  const whatsappMessage = `Hello Unique Group, I am interested in the ${plan.title} insurance plan from ${company.name}. Please share more details.`;
  const whatsappUrl = cleanWhatsApp ? `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(whatsappMessage)}` : '';

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!formData.name.trim() || !formData.phone.trim()) {
      setSubmitError('Please provide your name and phone number.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await submitEnquiry({
        fullName: formData.name,
        phoneNumber: formData.phone,
        emailAddress: formData.email,
        division: 'insurance',
        insurancePlanId: plan.id,
        message: formData.message.trim() || `Inquiry regarding ${plan.title} (${company.name}).`,
      });

      if (res.success) {
        setSubmitSuccess(true);
      } else {
        setSubmitError(res.error || 'Failed to submit enquiry. Please try again.');
      }
    } catch (err: any) {
      setSubmitError('An unexpected error occurred. Please call or WhatsApp us.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowEnquiryForm(false);
    setSubmitSuccess(false);
    setSubmitError('');
    setFormData({ name: '', phone: '', email: '', message: '' });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in overflow-y-auto"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6 border border-[#E8E4D8] shadow-2xl relative my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="border-b border-[#F4F2EA] pb-5 pr-8">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-xs border border-blue-200">
              {plan.categoryLabel || `${plan.category} Insurance`}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Provider: <strong className="text-[#0A192F]">{company.name}</strong>
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A192F]">
            {plan.title}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            {plan.description}
          </p>
        </div>

        {/* Advisory Language Notice */}
        <div className="p-3 bg-[#FAF9F5] rounded-lg border border-[#E8E4D8] text-[11px] text-slate-600 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-[#8C6E2E] shrink-0 mt-0.5" />
          <span>
            Unique Group provides independent advisory and local claims support for licensed insurance products.
            Policies are issued directly by <strong>{company.name}</strong>.
          </span>
        </div>

        {!showEnquiryForm ? (
          <>
            {/* Key Benefits */}
            {plan.keyBenefits && plan.keyBenefits.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-serif text-base font-bold text-[#0A192F] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8C6E2E]" />
                  <span>Key Benefits</span>
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  {plan.keyBenefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-[#FAF9F5] border border-[#F4F2EA]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] shrink-0 mt-1.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Eligibility */}
            {plan.eligibility && (
              <div className="space-y-1.5">
                <h3 className="font-serif text-base font-bold text-[#0A192F]">
                  Eligibility
                </h3>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
                  {plan.eligibility}
                </p>
              </div>
            )}

            {/* Documents Required */}
            {plan.documentsRequired && plan.documentsRequired.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-serif text-base font-bold text-[#0A192F] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#8C6E2E]" />
                  <span>Documents Required</span>
                </h3>
                <div className="flex flex-wrap gap-2 text-xs">
                  {plan.documentsRequired.map((doc, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-medium"
                    >
                      {doc}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4 border-t border-[#F4F2EA] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowEnquiryForm(true)}
                className="min-h-[46px] px-6 py-2.5 rounded-lg bg-[#0A192F] hover:bg-[#112240] text-[#E2C98D] text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2 shadow-sm"
              >
                <HelpCircle className="w-4 h-4 text-[#C5A059]" />
                <span>Get Assistance</span>
              </button>

              <div className="flex items-center gap-2.5">
                <a
                  href={`tel:${contactPhone}`}
                  className="flex-1 sm:flex-initial min-h-[46px] px-4 py-2.5 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] hover:bg-white text-xs font-semibold text-slate-800 transition-colors inline-flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-[#8C6E2E]" />
                  <span>Call Now</span>
                </a>

                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial min-h-[46px] px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2 shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          </>
        ) : (
          /* IN-MODAL ENQUIRY FORM */
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#0A192F]">
                Get Assistance for {plan.title}
              </h3>
              <button
                type="button"
                onClick={() => setShowEnquiryForm(false)}
                className="text-xs text-[#8C6E2E] hover:underline"
              >
                &larr; Back to Plan Details
              </button>
            </div>

            {submitSuccess ? (
              <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-serif text-lg font-bold text-emerald-900">
                  Enquiry Submitted Successfully
                </h4>
                <p className="text-xs text-emerald-700 max-w-md mx-auto">
                  Thank you! Our insurance advisory desk in Rajpipla has received your inquiry for <strong>{plan.title}</strong>. We will call you shortly with complete premium estimates and proposal forms.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="min-h-[40px] px-6 py-2 rounded-lg bg-[#0A192F] text-[#E2C98D] text-xs font-bold uppercase tracking-wider"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-4">
                {submitError && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your full name"
                      className="w-full min-h-[42px] px-3.5 py-2 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 9879012345"
                      className="w-full min-h-[42px] px-3.5 py-2 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="yourname@gmail.com"
                    className="w-full min-h-[42px] px-3.5 py-2 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Message / Specific Coverage Queries
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={`e.g. Seeking premium quote for family of 4 under ${plan.title}...`}
                    className="w-full p-3 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEnquiryForm(false)}
                    className="min-h-[42px] px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="min-h-[42px] px-6 py-2 rounded-lg bg-[#0A192F] hover:bg-[#112240] text-[#E2C98D] text-xs font-bold uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-[#E2C98D]/40 border-t-[#E2C98D] rounded-full animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>Submit Enquiry</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
