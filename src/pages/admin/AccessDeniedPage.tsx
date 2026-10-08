import React from 'react';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export const AccessDeniedPage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#050D1A] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 sm:p-10 shadow-2xl border border-slate-200 space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#8C6E2E]">
            Security Notice
          </span>
          <h1 className="font-serif text-2xl font-bold text-[#0A192F]">
            Administrator Access Required
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed">
            You are signed in as <strong className="text-[#0A192F]">{user?.email}</strong>, but this account is not registered or active in the Unique Group administrator directory.
          </p>
        </div>

        <div className="p-3.5 rounded-lg bg-[#FAF9F5] border border-[#E8E4D8] text-xs text-slate-600 text-left space-y-1">
          <span className="font-bold text-[#0A192F] block">Required Action:</span>
          <span>
            Please request Gaurav Shah or your system administrator to provision your user profile in the <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">admin_profiles</code> database table.
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            onClick={logout}
            className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider transition-colors border border-red-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
          <Link
            to="/"
            className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 rounded-lg bg-[#0A192F] hover:bg-[#112240] text-[#E2C98D] text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#C5A059]" />
            <span>Go to Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
