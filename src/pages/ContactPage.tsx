import React from 'react';
import { SectionHeading } from '../components/common/SectionHeading';
import { ContactForm } from '../components/common/ContactForm';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { MapPin, Phone, Mail, Clock, MessageSquare, ExternalLink } from 'lucide-react';
import { buildWhatsAppUrl, WHATSAPP_CONFIG } from '../lib/whatsapp';

export const ContactPage: React.FC = () => {
  const settings = useSiteSettings();
  const whatsappUrl = buildWhatsAppUrl(`Hello ${WHATSAPP_CONFIG.businessName}, I would like to enquire about your services.`);

  return (
    <div className="pt-24 pb-20 space-y-16">
      {/* Header */}
      <section className="bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label={`REACH OUR ${settings.city?.toUpperCase()} OFFICE`}
            title="Let’s talk."
            description="We welcome personal visits, telephone discussions, and WhatsApp enquiries for real estate, insurance, or finance requirements."
            className="mb-10"
          />
        </div>
      </section>

      {/* Main Contact Form & Principal Details */}
      <ContactForm
        headingText="Start a conversation."
        showContactCard={true}
      />

      {/* Office Location & Visiting Information */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-[#E8E4D8] p-8 sm:p-12 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF4E5] border border-[#C5A059]/40 flex items-center justify-center text-[#8C6E2E]">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#0A192F]">
              Office Address
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              <strong>{settings.businessName}</strong><br />
              {settings.addressLine1},<br />
              {settings.addressLine2},<br />
              {settings.city}, {settings.state} – {settings.pinCode}
            </p>
            {settings.googleMapsUrl && (
              <div className="pt-2">
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C6E2E] hover:text-[#0A192F] uppercase tracking-wider"
                >
                  <span>View on Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF4E5] border border-[#C5A059]/40 flex items-center justify-center text-[#8C6E2E]">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#0A192F]">
              Direct Contact
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Managing Principal:<br />
              <strong className="text-[#0A192F]">{settings.founder}</strong><br />
              Direct: <a href={`tel:${settings.phone}`} className="hover:text-[#8C6E2E]">{settings.displayPhone}</a>
              {settings.email && (
                <>
                  <br />
                  Email: <a href={`mailto:${settings.email}`} className="hover:text-[#8C6E2E]">{settings.email}</a>
                </>
              )}
            </p>
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C6E2E] hover:text-[#0A192F] uppercase tracking-wider"
              >
                <span>Message on WhatsApp</span>
                <MessageSquare className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF4E5] border border-[#C5A059]/40 flex items-center justify-center text-[#8C6E2E]">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#0A192F]">
              Working Hours
            </h3>
            <div className="text-sm text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span>Monday – Saturday:</span>
                <span className="font-medium text-[#0A192F]">9:30 AM – 7:30 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday:</span>
                <span className="text-[#8C6E2E] font-medium">By Prior Appointment</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 pt-2">
              Site visits for NA land and residential properties can be scheduled on weekends upon request.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
