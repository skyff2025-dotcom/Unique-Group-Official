import React from 'react';
import { Phone, MessageSquare } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export const MobileStickyBar: React.FC = () => {
  const settings = useSiteSettings();
  const cleanWhatsApp = settings.whatsapp ? settings.whatsapp.replace(/\D/g, '') : '';
  const waPrefilled = encodeURIComponent('Hello UNIQUE GROUP, I would like to enquire about your services.');

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 p-2.5 bg-[#FAF9F5]/95 backdrop-blur-md border-t border-[#E8E4D8] shadow-lg">
      <div className="grid grid-cols-2 gap-2.5 max-w-md mx-auto">
        <a
          href={`tel:${settings.phone}`}
          className="min-h-[44px] flex items-center justify-center gap-2 px-3 py-2 rounded bg-[#0A192F] text-white text-xs font-semibold uppercase tracking-wider active:scale-[0.98] transition-transform shadow-sm"
          aria-label={`Call ${settings.founder}`}
        >
          <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Call Now</span>
        </a>
        {cleanWhatsApp ? (
          <a
            href={`https://wa.me/${cleanWhatsApp}?text=${waPrefilled}`}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] flex items-center justify-center gap-2 px-3 py-2 rounded bg-[#C5A059] hover:bg-[#D4B46C] text-[#050D1A] text-xs font-bold uppercase tracking-wider active:scale-[0.98] transition-transform shadow-sm"
            aria-label="WhatsApp Unique Group"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
        ) : (
          <a
            href="/contact"
            className="min-h-[44px] flex items-center justify-center gap-2 px-3 py-2 rounded bg-[#C5A059] hover:bg-[#D4B46C] text-[#050D1A] text-xs font-bold uppercase tracking-wider active:scale-[0.98] transition-transform shadow-sm"
          >
            <span>Enquire Now</span>
          </a>
        )}
      </div>
    </div>
  );
};
