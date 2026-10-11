import React, { useState } from 'react';
import { Phone, MessageSquare, Send } from 'lucide-react';
import { VisualAsset } from '../common/VisualAsset';
import { EnquiryModal } from '../common/EnquiryModal';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { buildWhatsAppUrl, WHATSAPP_CONFIG } from '../../lib/whatsapp';

export const CTASection: React.FC = () => {
  const settings = useSiteSettings();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const whatsappUrl = buildWhatsAppUrl(`Hello ${WHATSAPP_CONFIG.businessName}, I would like to consult with Gaurav Shah.`);

  return (
    <section className="relative py-24 sm:py-32 bg-[#050D1A] text-white overflow-hidden">
      {/* Background Architectural Artwork with dark scrim */}
      <div className="absolute inset-0 z-0">
        <VisualAsset
          type="hero"
          alt="Cinematic Architectural Background"
          className="w-full h-full object-cover opacity-35 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050D1A] via-[#050D1A]/80 to-[#050D1A]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <span className="text-[11px] font-bold tracking-[0.28em] uppercase text-[#E2C98D] inline-block px-3 py-1 rounded bg-white/10 border border-white/15 backdrop-blur-sm">
          DIRECT ADVISORY · {settings.city?.toUpperCase()}
        </span>

        <h2
          className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.12]"
          style={{ textWrap: 'balance' }}
        >
          Let’s find the right<br />
          <span className="text-[#E2C98D] italic font-normal">solution for you.</span>
        </h2>

        <p className="text-base sm:text-xl text-slate-200/90 leading-relaxed max-w-2xl mx-auto font-light">
          Whether you’re looking for a property, insurance protection or financial assistance,
          we’re here to help you navigate every decision with certainty.
        </p>

        {/* Buttons: Send Enquiry, Call Us & WhatsApp Us */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto min-h-[50px] inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded bg-[#C5A059] hover:bg-[#D4B46C] text-[#050D1A] font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-xl shadow-black/50 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Send Enquiry / Request Callback</span>
          </button>

          <a
            href={`tel:${settings.phone}`}
            className="w-full sm:w-auto min-h-[50px] inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded bg-white/15 hover:bg-white/25 text-white font-medium text-xs uppercase tracking-wider backdrop-blur-md border border-white/20 transition-all duration-200"
          >
            <Phone className="w-4 h-4 text-[#C5A059]" />
            <span>Call ({settings.displayPhone})</span>
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto min-h-[50px] inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded bg-emerald-600/90 hover:bg-emerald-600 text-white font-medium text-xs uppercase tracking-wider backdrop-blur-md transition-all duration-200 shadow-md"
          >
            <MessageSquare className="w-4 h-4 text-white" />
            <span>WhatsApp</span>
          </a>
        </div>

        <div className="pt-2 text-xs text-slate-400">
          Personal consultation by {settings.founder} · {settings.addressLine1}, {settings.addressLine2}
        </div>
      </div>

      {/* General Service Enquiry Modal */}
      <EnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialServiceType="General Enquiry"
        title="Schedule Advisory Consultation"
        subtitle="Speak with Gaurav Shah for real estate acquisitions, insurance policies, or loan sanction guidance."
        submitButtonText="Enquire on WhatsApp"
      />
    </section>
  );
};

