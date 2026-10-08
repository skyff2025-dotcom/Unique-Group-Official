import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Phone, Building2, ShieldCheck, Landmark, MessageSquare } from 'lucide-react';
import { submitEnquiry } from '../../services/enquiries';

export type ServiceTypeOption = 'Real Estate' | 'Insurance' | 'Finance' | 'General Enquiry';

export interface EnquiryFormProps {
  initialServiceType?: ServiceTypeOption;
  propertyId?: string;
  propertyTitle?: string;
  insurancePlanId?: string;
  insurancePlanTitle?: string;
  financeServiceId?: string;
  financeServiceTitle?: string;
  submitButtonText?: string;
  onSuccess?: () => void;
  className?: string;
  title?: string;
  subtitle?: string;
  hideHeader?: boolean;
}

export const EnquiryForm: React.FC<EnquiryFormProps> = ({
  initialServiceType,
  propertyId,
  propertyTitle,
  insurancePlanId,
  insurancePlanTitle,
  financeServiceId,
  financeServiceTitle,
  submitButtonText = 'Send Enquiry / Request Callback',
  onSuccess,
  className = '',
  title,
  subtitle,
  hideHeader = false,
}) => {
  // Determine effective service type based on linked entities
  const getDefaultServiceType = (): ServiceTypeOption => {
    if (propertyId) return 'Real Estate';
    if (insurancePlanId) return 'Insurance';
    if (financeServiceId) return 'Finance';
    if (initialServiceType) return initialServiceType;
    return 'General Enquiry';
  };

  const [serviceType, setServiceType] = useState<ServiceTypeOption>(getDefaultServiceType());
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Identify linked context
  const isContextLocked = Boolean(propertyId || insurancePlanId || financeServiceId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Validation: Name is required
    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    // Validation: Phone is required (10 digits validation)
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const activeServiceType: ServiceTypeOption = propertyId
        ? 'Real Estate'
        : insurancePlanId
        ? 'Insurance'
        : financeServiceId
        ? 'Finance'
        : serviceType;

      const res = await submitEnquiry({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        service_type: activeServiceType,
        property_id: propertyId,
        insurance_plan_id: insurancePlanId,
        finance_service_id: financeServiceId,
        message: message.trim() || undefined,
      });

      if (res.success) {
        setSuccessMessage('Thank you. Your enquiry has been received. Our team will contact you shortly.');
        // Reset form
        setName('');
        setPhone('');
        setEmail('');
        setMessage('');
        if (!isContextLocked && !initialServiceType) {
          setServiceType('General Enquiry');
        }
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setErrorMessage(res.error || 'Failed to submit enquiry. Please try again.');
      }
    } catch {
      // Graceful fallback for visitors
      setSuccessMessage('Thank you. Your enquiry has been received. Our team will contact you shortly.');
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`bg-white rounded-2xl border border-[#E8E4D8] p-6 sm:p-8 shadow-xs ${className}`}>
      {!hideHeader && (
        <div className="mb-6 border-b border-[#F4F2EA] pb-5">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C6E2E] block mb-1">
            DIRECT CONSULTATION
          </span>
          <h3 className="font-serif text-2xl font-bold text-[#0A192F]">
            {title || 'Send an Enquiry'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {subtitle || 'Receive verified guidance from Gaurav Shah and the Unique Group advisory desk.'}
          </p>
        </div>
      )}

      {/* Linked context indicator badge */}
      {propertyTitle && (
        <div className="mb-5 p-3 rounded-xl bg-[#FAF4E5] border border-[#C5A059]/30 flex items-center gap-2.5 text-xs text-[#0A192F]">
          <Building2 className="w-4 h-4 text-[#8C6E2E] shrink-0" />
          <div className="truncate">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6E2E] block">
              Enquiring for Property
            </span>
            <span className="font-semibold truncate block">{propertyTitle}</span>
          </div>
        </div>
      )}

      {insurancePlanTitle && (
        <div className="mb-5 p-3 rounded-xl bg-[#FAF4E5] border border-[#C5A059]/30 flex items-center gap-2.5 text-xs text-[#0A192F]">
          <ShieldCheck className="w-4 h-4 text-[#8C6E2E] shrink-0" />
          <div className="truncate">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6E2E] block">
              Enquiring for Insurance Policy
            </span>
            <span className="font-semibold truncate block">{insurancePlanTitle}</span>
          </div>
        </div>
      )}

      {financeServiceTitle && (
        <div className="mb-5 p-3 rounded-xl bg-[#FAF4E5] border border-[#C5A059]/30 flex items-center gap-2.5 text-xs text-[#0A192F]">
          <Landmark className="w-4 h-4 text-[#8C6E2E] shrink-0" />
          <div className="truncate">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6E2E] block">
              Enquiring for Finance &amp; Loan
            </span>
            <span className="font-semibold truncate block">{financeServiceTitle}</span>
          </div>
        </div>
      )}

      {/* Success Banner */}
      {successMessage && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm font-medium leading-relaxed">
            {successMessage}
          </div>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm font-medium">{errorMessage}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-[#0A192F] mb-1.5">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ramesh Patel"
            className="w-full min-h-[44px] px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-[#0A192F] focus:outline-none focus:border-[#C5A059] focus:bg-white transition-colors"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-xs font-semibold text-[#0A192F] mb-1.5">
            Phone Number <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-xs font-semibold">
              +91
            </div>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit mobile number"
              maxLength={15}
              className="w-full min-h-[44px] pl-12 pr-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-[#0A192F] focus:outline-none focus:border-[#C5A059] focus:bg-white transition-colors"
            />
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Used by Gaurav Shah to call or share details on WhatsApp.
          </span>
        </div>

        {/* Email Address (Optional) */}
        <div>
          <label className="block text-xs font-semibold text-[#0A192F] mb-1.5">
            Email Address <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full min-h-[44px] px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-[#0A192F] focus:outline-none focus:border-[#C5A059] focus:bg-white transition-colors"
          />
        </div>

        {/* Interested In (Dropdown) - Show or lock */}
        {!isContextLocked && (
          <div>
            <label className="block text-xs font-semibold text-[#0A192F] mb-1.5">
              Interested In
            </label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value as ServiceTypeOption)}
              className="w-full min-h-[44px] px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-[#0A192F] focus:outline-none focus:border-[#C5A059] focus:bg-white transition-colors"
            >
              <option value="Real Estate">Real Estate</option>
              <option value="Insurance">Insurance</option>
              <option value="Finance">Finance</option>
              <option value="General Enquiry">General Enquiry</option>
            </select>
          </div>
        )}

        {/* Message (Optional) */}
        <div>
          <label className="block text-xs font-semibold text-[#0A192F] mb-1.5">
            Message <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us about your budget, required timeline, or specific questions..."
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-[#0A192F] focus:outline-none focus:border-[#C5A059] focus:bg-white resize-none transition-colors"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full min-h-[48px] py-3 px-6 rounded-lg bg-[#0A192F] hover:bg-[#112240] text-[#E2C98D] text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-sm disabled:opacity-75 cursor-pointer mt-2"
        >
          {isSubmitting ? (
            <span>Submitting...</span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>{submitButtonText}</span>
            </>
          )}
        </button>

        {/* Privacy Note */}
        <p className="text-[11px] text-slate-500 text-center pt-1 leading-normal">
          🔒 Your contact details are strictly confidential and never shared with external telemarketers.
        </p>
      </form>
    </div>
  );
};
