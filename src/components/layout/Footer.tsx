import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Mail, MessageSquare, Instagram, Facebook, Lock } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { buildWhatsAppUrl, WHATSAPP_CONFIG } from '../../lib/whatsapp';

export const Footer: React.FC = () => {
  const settings = useSiteSettings();
  const whatsappUrl = buildWhatsAppUrl(`Hello ${WHATSAPP_CONFIG.businessName}, I would like to enquire about your services.`);

  return (
    <footer className="bg-[#050D1A] text-white border-t border-[#18283E]">
      {/* Upper Footer: Brand, Divisions, Quick Navigation, Contact */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Col 1: Brand & Tagline (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              {settings.logoUrl ? (
                <div className="mb-2">
                  <img
                    src={settings.logoUrl}
                    alt={settings.businessName}
                    className="max-h-12 w-auto object-contain brightness-0 invert"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              ) : null}
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.16em] text-white block">
                {settings.businessName}
              </span>
              <p className="text-xs uppercase tracking-[0.3em] text-[#C5A059] mt-1 font-medium">
                {settings.tagline}
              </p>
            </div>
            
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Bringing together Real Estate, Insurance, and Finance under one trusted corporate banner.
              Providing disciplined guidance and practical solutions for families, landowners, and businesses
              across Rajpipla and Gujarat.
            </p>

            {/* Social Links & Channels */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#112240] hover:bg-[#C5A059] hover:text-[#050D1A] transition-all flex items-center justify-center text-slate-300"
                aria-label={`WhatsApp ${settings.businessName}`}
                title="Chat on WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#112240] hover:bg-[#C5A059] hover:text-[#050D1A] transition-all flex items-center justify-center text-slate-300"
                  aria-label="Instagram profile"
                  title="Instagram Profile"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#112240] hover:bg-[#C5A059] hover:text-[#050D1A] transition-all flex items-center justify-center text-slate-300"
                  aria-label="Facebook page"
                  title="Facebook Page"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings.googleMapsUrl && (
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 px-3.5 rounded-full bg-[#112240] hover:bg-[#C5A059] hover:text-[#050D1A] transition-all flex items-center gap-2 text-xs font-medium text-slate-300"
                  aria-label="View office on Google Maps"
                  title="View on Google Maps"
                >
                  <MapPin className="w-4 h-4 text-[#C5A059]" />
                  <span>View on Google Maps</span>
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Business Divisions (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#C5A059]">
              Divisions
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/real-estate" className="text-slate-300 hover:text-white transition-colors">
                  Real Estate
                </Link>
              </li>
              <li>
                <Link to="/properties" className="text-slate-300 hover:text-white transition-colors">
                  Featured Properties
                </Link>
              </li>
              <li>
                <Link to="/insurance" className="text-slate-300 hover:text-white transition-colors">
                  Insurance Advisory
                </Link>
              </li>
              <li>
                <Link to="/finance" className="text-slate-300 hover:text-white transition-colors">
                  Finance &amp; Loans
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Navigation (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#C5A059]">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-slate-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-300 hover:text-white transition-colors">
                  About Unique Group
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-300 hover:text-white transition-colors">
                  Contact Office
                </Link>
              </li>
              <li>
                <Link to="/properties" className="text-slate-300 hover:text-white transition-colors">
                  Property Listings
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Location (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#C5A059]">
              Rajpipla Office
            </h4>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <div className="leading-snug">
                  <span>
                    {settings.addressLine1}, {settings.addressLine2},<br />
                    {settings.city}, {settings.state} – {settings.pinCode}
                  </span>
                  {settings.googleMapsUrl && (
                    <div className="mt-1">
                      <a
                        href={settings.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-[#C5A059] hover:text-[#E2C98D] underline underline-offset-2 transition-colors"
                      >
                        <span>View on Google Maps</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-white font-medium">
                  {settings.displayPhone}
                </a>
              </div>
              {settings.email && (
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <a href={`mailto:${settings.email}`} className="hover:text-white truncate">
                    {settings.email}
                  </a>
                </div>
              )}
            </div>

            <div className="pt-1">
              <span className="text-xs text-slate-400 block mb-1">Managing Principal</span>
              <span className="font-serif text-base font-semibold text-white tracking-wide">
                {settings.founder}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright, Legal & Discreet Admin Login */}
      <div className="border-t border-[#112240] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 {settings.businessName}. All rights reserved.</p>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-5 gap-y-2">
            <Link to="/contact" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <Link to="/contact" className="hover:text-slate-300 transition-colors">
              Terms &amp; Conditions
            </Link>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span className="text-slate-400">{settings.city}, {settings.state}</span>
            <span aria-hidden="true" className="text-slate-700">·</span>

            {/* Discreet Admin Login Link */}
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 py-1.5 px-2.5 rounded text-[11px] font-medium text-slate-400 hover:text-[#E2C98D] hover:bg-[#112240] transition-all border border-transparent hover:border-[#C5A059]/30 min-h-[44px] sm:min-h-[auto]"
              title="Portal Management Login"
            >
              <Lock className="w-3 h-3 text-[#C5A059]/80 shrink-0" />
              <span>Admin Login</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
