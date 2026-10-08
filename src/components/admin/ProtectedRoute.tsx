import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AdminLayout } from './AdminLayout';
import { AdminLoginPage } from '../../pages/admin/AdminLoginPage';
import { AccessDeniedPage } from '../../pages/admin/AccessDeniedPage';

export const ProtectedRoute: React.FC = () => {
  const { user, adminProfile, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A192F] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-3 border-[#C5A059]/30 border-t-[#C5A059] rounded-full animate-spin" />
        <span className="text-xs uppercase tracking-widest text-[#E2C98D] font-semibold">
          Authenticating Unique Group Admin...
        </span>
      </div>
    );
  }

  // Not signed in -> show login page
  if (!user) {
    return <AdminLoginPage />;
  }

  // Signed in, but not an active admin in admin_profiles -> show access denied page
  if (!isAdmin) {
    return <AccessDeniedPage />;
  }

  // Active authorized admin -> wrap with AdminLayout and render page
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};
