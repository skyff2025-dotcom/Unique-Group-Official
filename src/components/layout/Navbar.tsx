import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MessageSquare, ArrowUpRight } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';

interface NavbarProps {
  forceSolid?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ forceSolid = false }) => {
  const settings = useSiteSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const isSolid = forceSolid || isScrolled;

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Real Estate', href: '/real-estate' },
    { name: 'Insurance', href: '/insurance' },
    { name: 'Finance', href: '/finance' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const mobileNavLinks = [
    { name: 'Home', href: '/' },
    { name: 'Real Estate', href: '/real-estate' },
    { name: 'Properties', href: '/properties' },
    { name: 'Insurance', href: '/insurance' },
    { name: 'Finance', href: '/finance' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isSolid
            ? 'bg-[#FAF9F5]/95 backdrop-blur-md shadow-sm border-b border-[#E8E4D8] py-3.5'
            : 'bg-gradient-to-b from-[#050D1A]/90 via-[#050D1A]/50 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Zone 1: Single text element wordmark / logo */}
            <Link
              to="/"
              className="group flex items-center gap-3 focus:outline-none"
              aria-label={`${settings.businessName} Homepage`}
            >
              {settings.logoUrl && (
                <img
                  src={settings.logoUrl}
                  alt={settings.businessName}
                  className="h-9 w-auto object-contain rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              <div className="flex flex-col">
                <span
                  className={`font-serif text-xl sm:text-2xl tracking-[0.18em] font-bold transition-colors ${
                    isSolid ? 'text-[#0A192F]' : 'text-white'
                  }`}
                >
                  {settings.businessName}
                </span>
                <span
                  className={`text-[9px] tracking-[0.28em] uppercase -mt-0.5 transition-colors ${
                    isSolid ? 'text-[#C5A059]' : 'text-[#E2C98D]'
                  }`}
                >
                  {settings.tagline}
                </span>
              </div>
            </Link>

            {/* Zone 2: Desktop 4–6 text navigation links */}
            <nav className="hidden lg:flex items-center gap-8 text-[13px] tracking-wide uppercase font-medium">
              {navLinks.map((link) => {
                const isActive =
                  link.href === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`relative py-1 transition-colors whitespace-nowrap ${
                      isSolid
                        ? isActive
                          ? 'text-[#C5A059] font-semibold'
                          : 'text-[#0A192F] hover:text-[#C5A059]'
                        : isActive
                        ? 'text-[#E2C98D] font-semibold'
                        : 'text-white/90 hover:text-white'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C5A059] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Zone 3: Desktop Primary Action */}
            <div className="hidden lg:flex items-center gap-4">
              <Link
                to="/contact"
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded text-xs font-semibold tracking-wider uppercase transition-all duration-200 whitespace-nowrap shadow-sm ${
                  isSolid
                    ? 'bg-[#0A192F] text-[#FAF9F5] hover:bg-[#112240] hover:text-[#E2C98D]'
                    : 'bg-[#C5A059] text-[#050D1A] hover:bg-[#D4B46C]'
                }`}
              >
                <span>Contact Us</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Mobile Hamburger Trigger */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg p-2 focus:outline-none transition-colors ${
                  isSolid ? 'text-[#0A192F] hover:bg-black/5' : 'text-white hover:bg-white/10'
                }`}
                aria-label="Open navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full-Height Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#050D1A]/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 right-0 max-w-sm w-full bg-[#0A192F] text-white shadow-2xl flex flex-col justify-between border-l border-[#243854]">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                <div>
                  <span className="font-serif text-lg tracking-[0.16em] font-bold text-white block">
                    {settings.businessName}
                  </span>
                  <span className="text-[9px] tracking-[0.24em] text-[#C5A059] uppercase">
                    {settings.tagline}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-white/80 hover:text-white hover:bg-white/10 focus:outline-none"
                  aria-label="Close navigation menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation List */}
              <nav className="px-6 py-6 space-y-1">
                {mobileNavLinks.map((link) => {
                  const isActive =
                    link.href === '/'
                      ? location.pathname === '/'
                      : location.pathname.startsWith(link.href);

                  return (
                    <Link
                      key={link.name}
                      to={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`min-h-[48px] flex items-center justify-between px-3 py-3 rounded-lg text-base tracking-wide transition-colors ${
                        isActive
                          ? 'bg-[#C5A059]/15 text-[#E2C98D] font-semibold border-l-2 border-[#C5A059]'
                          : 'text-white/80 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>{link.name}</span>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Quick Contact Actions inside Drawer */}
            <div className="p-6 border-t border-white/10 bg-[#050D1A]/60 space-y-3">
              <div className="text-xs text-white/60 mb-2">
                <span className="block font-medium text-white">{settings.founder}</span>
                <span>{settings.addressLine1}, {settings.addressLine2}, {settings.city}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${settings.phone}`}
                  className="min-h-[44px] flex items-center justify-center gap-2 px-3 py-2.5 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#C5A059]" />
                  <span>Call Now</span>
                </a>
                {settings.whatsapp ? (
                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Hello UNIQUE GROUP, I would like to enquire about your services.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] flex items-center justify-center gap-2 px-3 py-2.5 rounded bg-[#C5A059] hover:bg-[#D4B46C] text-[#050D1A] text-xs font-semibold uppercase tracking-wider transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                ) : (
                  <Link
                    to="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="min-h-[44px] flex items-center justify-center gap-2 px-3 py-2.5 rounded bg-[#C5A059] hover:bg-[#D4B46C] text-[#050D1A] text-xs font-semibold uppercase tracking-wider transition-colors"
                  >
                    <span>Contact Us</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
