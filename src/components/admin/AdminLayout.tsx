import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  ShieldCheck,
  FileText,
  Landmark,
  Coins,
  Inbox,
  Settings,
  MessageSquareQuote,
  ExternalLink,
  LogOut,
  Menu,
  X,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { adminProfile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin');
  };

  const navGroups = [
    {
      title: 'OVERVIEW',
      items: [
        {
          label: 'Dashboard',
          to: '/admin/dashboard',
          icon: LayoutDashboard,
          end: true,
        },
      ],
    },
    {
      title: 'REAL ESTATE',
      items: [
        {
          label: 'Properties',
          to: '/admin/properties',
          icon: Building2,
          end: true,
        },
        {
          label: 'Add Property',
          to: '/admin/properties/new',
          icon: PlusCircle,
          end: true,
        },
      ],
    },
    {
      title: 'INSURANCE',
      items: [
        {
          label: 'Companies',
          to: '/admin/insurance/companies',
          icon: ShieldCheck,
          end: true,
        },
        {
          label: 'Plans',
          to: '/admin/insurance/plans',
          icon: FileText,
          end: true,
        },
      ],
    },
    {
      title: 'FINANCE',
      items: [
        {
          label: 'Companies',
          to: '/admin/finance/companies',
          icon: Landmark,
          end: true,
        },
        {
          label: 'Services',
          to: '/admin/finance/services',
          icon: Coins,
          end: true,
        },
      ],
    },
    {
      title: 'COMMUNICATIONS',
      items: [
        {
          label: 'Enquiries',
          to: '/admin/enquiries',
          icon: Inbox,
          end: true,
        },
      ],
    },
    {
      title: 'WEBSITE CONTENT',
      items: [
        {
          label: 'Testimonials',
          to: '/admin/testimonials',
          icon: MessageSquareQuote,
          end: true,
        },
        {
          label: 'Settings',
          to: '/admin/settings',
          icon: Settings,
          end: true,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F2EA] flex flex-col lg:flex-row text-[#0A192F]">
      {/* MOBILE TOP BAR */}
      <header className="lg:hidden sticky top-0 z-40 bg-[#0A192F] text-white px-4 py-3 border-b border-[#1E3A5F] flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 -ml-1 text-slate-300 hover:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div>
            <span className="font-serif text-lg font-bold tracking-wider text-white">
              UNIQUE GROUP
            </span>
            <span className="text-[10px] text-[#E2C98D] block font-semibold tracking-widest uppercase">
              Admin Portal
            </span>
          </div>
        </div>

        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#E2C98D] hover:text-white flex items-center gap-1 font-medium px-2.5 py-1.5 rounded bg-white/10"
        >
          <span>View Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* MOBILE DRAWER BACKDROP */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR (DESKTOP + MOBILE DRAWER) */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-[#0A192F] text-white flex flex-col justify-between border-r border-[#1E3A5F] transition-transform duration-200 ease-in-out shrink-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand & Header */}
        <div>
          <div className="p-6 border-b border-[#1E3A5F] flex items-center justify-between">
            <Link to="/admin/dashboard" className="block space-y-0.5">
              <span className="font-serif text-xl font-bold tracking-wider text-white block">
                UNIQUE GROUP
              </span>
              <span className="text-[10px] text-[#E2C98D] font-bold uppercase tracking-[0.25em] block">
                Admin System
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
            {navGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 px-3">
                  {group.title}
                </span>
                <div className="space-y-0.5 pt-1">
                  {group.items.map((item, iIdx) => {
                    const Icon = item.icon;
                    const isActive = item.end
                      ? location.pathname === item.to
                      : location.pathname.startsWith(item.to);

                    return (
                      <NavLink
                        key={iIdx}
                        to={item.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                          isActive
                            ? 'bg-[#C5A059] text-[#050D1A] font-bold shadow-sm'
                            : 'text-slate-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#050D1A]' : 'text-[#C5A059]'}`} />
                        <span>{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Quick public website link */}
            <div className="pt-2 px-3">
              <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between text-xs text-slate-400 hover:text-[#E2C98D] py-1 transition-colors"
              >
                <span>View Public Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </nav>
        </div>

        {/* User profile & Logout */}
        <div className="p-4 border-t border-[#1E3A5F] bg-[#071324] space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-[#FAF4E5] border border-[#C5A059]/40 flex items-center justify-center text-[#8C6E2E] shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-bold text-white block truncate">
                {adminProfile?.full_name || 'Gaurav Shah'}
              </span>
              <span className="text-[10px] text-[#E2C98D] uppercase tracking-wider block">
                {adminProfile?.role || 'Administrator'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full min-h-[38px] flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-200 border border-red-800/40 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-x-hidden min-h-screen">
        {children}
      </main>
    </div>
  );
};
