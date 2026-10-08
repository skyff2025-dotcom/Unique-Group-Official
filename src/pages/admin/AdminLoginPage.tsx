import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export const AdminLoginPage: React.FC = () => {
  const { login, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSubmitted, setResetSubmitted] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (!result.success && result.error) {
      setErrorMessage(result.error);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;

    setResetLoading(true);
    setResetMessage('');
    const result = await resetPassword(resetEmail);
    setResetLoading(false);

    if (result.success) {
      setResetSubmitted(true);
    } else {
      setResetMessage(result.error || 'Unable to process reset request.');
    }
  };

  return (
    <div className="min-h-screen bg-[#050D1A] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Decorative ambient background accents */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#1E3A5F]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Back to public website link */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-[#E2C98D] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Website</span>
        </Link>
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#E2C98D] text-[11px] font-bold uppercase tracking-[0.25em] mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Authorized Management</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-wider text-white">
            UNIQUE GROUP
          </h1>
          <p className="text-xs text-[#E2C98D] uppercase tracking-[0.25em] font-semibold">
            Trust • Protection • Growth
          </p>
        </div>

        {/* Clean White Card */}
        <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-2xl border border-white/20 space-y-6">
          <div className="space-y-1">
            <h2 className="font-serif text-2xl font-bold text-[#0A192F]">
              Welcome Back
            </h2>
            <p className="text-xs text-slate-500">
              Sign in to manage your Unique Group website.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium leading-relaxed">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@uniquegroup.in"
                  className="w-full min-h-[46px] pl-10 pr-4 py-2 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-sm text-[#0A192F] placeholder-slate-400 focus:outline-none focus:border-[#C5A059] focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-[#8C6E2E] hover:text-[#0A192F] font-semibold transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full min-h-[46px] pl-10 pr-11 py-2 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-sm text-[#0A192F] placeholder-slate-400 focus:outline-none focus:border-[#C5A059] focus:bg-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full min-h-[48px] flex items-center justify-center gap-2 rounded-lg bg-[#0A192F] hover:bg-[#112240] text-[#E2C98D] text-xs font-bold uppercase tracking-wider transition-all shadow-md disabled:opacity-70 active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#E2C98D]/40 border-t-[#E2C98D] rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4 text-[#C5A059]" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="pt-2 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-500">
              Unique Group Administrative Access &bull; Rajpipla, Gujarat
            </span>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 space-y-4 shadow-2xl">
            {resetSubmitted ? (
              <div className="text-center space-y-3 py-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="font-serif text-xl font-bold text-[#0A192F]">
                  Check Your Inbox
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  If an admin account is registered with <strong>{resetEmail}</strong>, password reset instructions have been sent.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setResetSubmitted(false);
                  }}
                  className="w-full min-h-[40px] px-4 py-2 rounded-lg bg-[#0A192F] text-[#E2C98D] text-xs font-semibold uppercase"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-1">
                  <h3 className="font-serif text-xl font-bold text-[#0A192F]">
                    Reset Admin Password
                  </h3>
                  <p className="text-xs text-slate-500">
                    Enter your email to receive a password reset link.
                  </p>
                </div>

                {resetMessage && (
                  <div className="p-2.5 rounded bg-red-50 text-red-700 text-xs">
                    {resetMessage}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="admin@uniquegroup.in"
                    className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="px-4 py-2 rounded-lg bg-[#0A192F] text-[#E2C98D] text-xs font-bold uppercase"
                  >
                    {resetLoading ? 'Sending...' : 'Send Link'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
