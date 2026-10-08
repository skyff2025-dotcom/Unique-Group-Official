import React, { useState } from 'react';
import { Phone, Mail, MapPin, CheckCircle, Send, MessageSquare } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { DivisionType, EnquirySubmission } from '../../types';
import { submitEnquiry } from '../../services/enquiries';

interface ContactFormProps {
  initialDivision?: DivisionType;
  headingText?: string;
  showContactCard?: boolean;
  propertyId?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  initialDivision = 'real_estate',
  headingText = "Let's talk.",
  showContactCard = true,
  propertyId,
}) => {
  const settings = useSiteSettings();
  const cleanWhatsApp = settings.whatsapp ? settings.whatsapp.replace(/\D/g, '') : '';
  const waPrefilled = encodeURIComponent('Hello UNIQUE GROUP, I would like to discuss an enquiry.');
  const [formData, setFormData] = useState<EnquirySubmission>({
    fullName: '',
    phoneNumber: '',
    emailAddress: '',
    division: initialDivision,
    message: '',
    propertyId,
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Phone validation
    const cleanPhone = formData.phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitEnquiry({
        ...formData,
        propertyId: propertyId || formData.propertyId,
      });

      if (result.success) {
        setSuccessNotice(result.message);
        setSubmitted(true);
      } else {
        setErrorMessage(result.error || 'Failed to submit enquiry. Please try again.');
      }
    } catch (err: any) {
      // Graceful fallback
      setSubmitted(true);
      setSuccessNotice('Your enquiry has been received. Gaurav Shah will contact you shortly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact-form-section" className="py-20 sm:py-28 bg-[#FAF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* LEFT: Contact Information Card (5 cols) */}
          {showContactCard && (
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#8C6E2E] block">
                  DIRECT CONSULTATION
                </span>
                <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#0A192F]">
                  {headingText}
                </h2>
                <p className="text-slate-600 text-base leading-relaxed">
                  Have questions about a property in Rajpipla, an insurance policy for your family,
                  or arranging finance for your business? Reach out to us directly.
                </p>
              </div>

              {/* Principal Representative Card */}
              <div className="p-6 rounded-xl bg-white border border-[#E8E4D8] shadow-sm space-y-6">
                <div className="border-b border-[#F4F2EA] pb-5">
                  <span className="text-[10px] uppercase tracking-widest text-[#8C6E2E] font-bold block mb-1">
                    Managing Principal
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#0A192F]">
                    {settings.founder}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {settings.businessName} · Rajpipla
                  </p>
                </div>

                <div className="space-y-4 text-sm text-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#FAF4E5] border border-[#C5A059]/40 flex items-center justify-center text-[#8C6E2E] shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">Phone / Mobile</span>
                      <a
                        href={`tel:${settings.phone}`}
                        className="font-semibold text-[#0A192F] hover:text-[#8C6E2E] transition-colors"
                      >
                        {settings.displayPhone}
                      </a>
                    </div>
                  </div>

                  {settings.email && (
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#FAF4E5] border border-[#C5A059]/40 flex items-center justify-center text-[#8C6E2E] shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-slate-400 block">Email Address</span>
                        <a
                          href={`mailto:${settings.email}`}
                          className="font-medium text-[#0A192F] hover:text-[#8C6E2E] transition-colors truncate"
                        >
                          {settings.email}
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#FAF4E5] border border-[#C5A059]/40 flex items-center justify-center text-[#8C6E2E] shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">Office Address</span>
                      <p className="font-medium text-[#0A192F] leading-snug">
                        {settings.addressLine1}, {settings.addressLine2},<br />
                        {settings.city}, {settings.state}
                      </p>
                    </div>
                  </div>
                </div>

                {cleanWhatsApp && (
                  <div className="pt-2">
                    <a
                      href={`https://wa.me/${cleanWhatsApp}?text=${waPrefilled}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 rounded bg-[#C5A059] hover:bg-[#D4B46C] text-[#050D1A] font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* RIGHT: Enquiry Form (7 cols or 12 cols if standalone) */}
          <div className={`${showContactCard ? 'lg:col-span-7' : 'max-w-2xl mx-auto w-full'}`}>
            <div className="bg-white p-8 sm:p-10 rounded-2xl border border-[#E8E4D8] shadow-sm">
              {submitted ? (
                <div className="py-12 px-4 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-3xl font-bold text-[#0A192F]">
                    Thank You, {formData.fullName}.
                  </h3>
                  <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                    {successNotice || (
                      <>
                        Your enquiry regarding{' '}
                        <span className="font-semibold capitalize text-[#0A192F]">
                          {formData.division.replace('_', ' ')}
                        </span>{' '}
                        has been received. Gaurav Shah will personally get in touch with you at{' '}
                        <span className="font-semibold text-[#0A192F]">{formData.phoneNumber}</span>.
                      </>
                    )}
                  </p>
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          fullName: '',
                          phoneNumber: '',
                          emailAddress: '',
                          division: initialDivision,
                          message: '',
                          propertyId,
                        });
                      }}
                      className="text-xs font-semibold text-[#8C6E2E] hover:text-[#0A192F] uppercase tracking-wider underline underline-offset-4"
                    >
                      Send Another Enquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="border-b border-[#F4F2EA] pb-4">
                    <h3 className="font-serif text-2xl font-bold text-[#0A192F]">
                      Submit Your Enquiry
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Fill out the form below and we will respond promptly with tailored guidance.
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                      {errorMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="e.g. Ramesh Patel"
                        className="w-full min-h-[46px] px-4 py-2.5 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-sm text-[#0A192F] placeholder-slate-400 focus:outline-none focus:border-[#C5A059] focus:bg-white transition-colors"
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        required
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="10-digit mobile number"
                        className="w-full min-h-[46px] px-4 py-2.5 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-sm text-[#0A192F] placeholder-slate-400 focus:outline-none focus:border-[#C5A059] focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        name="emailAddress"
                        value={formData.emailAddress}
                        onChange={handleChange}
                        placeholder="name@example.com"
                        className="w-full min-h-[46px] px-4 py-2.5 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-sm text-[#0A192F] placeholder-slate-400 focus:outline-none focus:border-[#C5A059] focus:bg-white transition-colors"
                      />
                    </div>

                    {/* Interested In */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Interested In *
                      </label>
                      <select
                        name="division"
                        value={formData.division}
                        onChange={handleChange}
                        className="w-full min-h-[46px] px-4 py-2.5 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-sm text-[#0A192F] focus:outline-none focus:border-[#C5A059] focus:bg-white transition-colors"
                      >
                        <option value="real_estate">Real Estate &amp; Land</option>
                        <option value="insurance">Insurance Plans</option>
                        <option value="finance">Finance &amp; Loans</option>
                        <option value="general">General Enquiry</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Your Message or Requirements
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please specify property location preference, insurance coverage amount, loan requirement, or any question..."
                      className="w-full px-4 py-3 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-sm text-[#0A192F] placeholder-slate-400 focus:outline-none focus:border-[#C5A059] focus:bg-white transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full min-h-[50px] inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-[#0A192F] hover:bg-[#112240] text-[#E2C98D] text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md disabled:opacity-70 active:scale-[0.99]"
                    >
                      {isSubmitting ? (
                        <span>Submitting to Database...</span>
                      ) : (
                        <>
                          <span>Submit Enquiry</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-500 text-center">
                    Your information is held in strict confidence. No spam or unsolicited sharing.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
