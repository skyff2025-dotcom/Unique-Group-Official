import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { SiteSettingsProvider } from './context/SiteSettingsContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileStickyBar } from './components/mobile/MobileStickyBar';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { RealEstatePage } from './pages/RealEstatePage';
import { PropertiesPage } from './pages/PropertiesPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { InsurancePage } from './pages/InsurancePage';
import { InsuranceCompanyPage } from './pages/InsuranceCompanyPage';
import { InsurancePlanDetailPage } from './pages/InsurancePlanDetailPage';
import { FinancePage } from './pages/FinancePage';
import { FinanceCompanyPage } from './pages/FinanceCompanyPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin System
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminPropertiesPage } from './pages/admin/AdminPropertiesPage';
import { AdminPropertyFormPage } from './pages/admin/AdminPropertyFormPage';
import { AdminInsuranceCompaniesPage } from './pages/admin/AdminInsuranceCompaniesPage';
import { AdminInsuranceCompanyFormPage } from './pages/admin/AdminInsuranceCompanyFormPage';
import { AdminInsurancePlansPage } from './pages/admin/AdminInsurancePlansPage';
import { AdminInsurancePlanFormPage } from './pages/admin/AdminInsurancePlanFormPage';
import { AdminFinanceCompaniesPage } from './pages/admin/AdminFinanceCompaniesPage';
import { AdminFinanceServicesPage } from './pages/admin/AdminFinanceServicesPage';
import { AdminEnquiriesPage } from './pages/admin/AdminEnquiriesPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminTestimonialsPage } from './pages/admin/AdminTestimonialsPage';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// App Layout Wrapper
function AppLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isAdminRoute = location.pathname.startsWith('/admin');

  // If in the Admin system, public chrome (Navbar, Footer, MobileStickyBar) is omitted
  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-[#F4F2EA] text-[#0A192F] selection:bg-[#C5A059]/25 selection:text-[#0A192F]">
        <ScrollToTop />
        <Routes>
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="properties" element={<AdminPropertiesPage />} />
            <Route path="properties/new" element={<AdminPropertyFormPage />} />
            <Route path="properties/:id/edit" element={<AdminPropertyFormPage />} />
            <Route path="insurance/companies" element={<AdminInsuranceCompaniesPage />} />
            <Route path="insurance/companies/new" element={<AdminInsuranceCompanyFormPage />} />
            <Route path="insurance/companies/:id/edit" element={<AdminInsuranceCompanyFormPage />} />
            <Route path="insurance/plans" element={<AdminInsurancePlansPage />} />
            <Route path="insurance/plans/new" element={<AdminInsurancePlanFormPage />} />
            <Route path="insurance/plans/:id/edit" element={<AdminInsurancePlanFormPage />} />
            <Route path="finance/companies" element={<AdminFinanceCompaniesPage />} />
            <Route path="finance/services" element={<AdminFinanceServicesPage />} />
            <Route path="enquiries" element={<AdminEnquiriesPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route path="testimonials" element={<AdminTestimonialsPage />} />
          </Route>
          {/* Fallback within admin */}
          <Route path="/admin/*" element={<NotFoundPage />} />
        </Routes>
      </div>
    );
  }

  // Public Website Shell
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#0A192F] selection:bg-[#C5A059]/25 selection:text-[#0A192F]">
      <ScrollToTop />

      {/* Top Navbar (Transparent on Home initially, solid on other pages) */}
      <Navbar forceSolid={!isHomePage} />

      {/* Main Content Area */}
      <main className="flex-grow pb-14 lg:pb-0">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/real-estate" element={<RealEstatePage />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/properties/:slug" element={<PropertyDetailPage />} />
          <Route path="/insurance" element={<InsurancePage />} />
          <Route path="/insurance/:company" element={<InsuranceCompanyPage />} />
          <Route path="/insurance/company/:company" element={<InsuranceCompanyPage />} />
          <Route path="/insurance/plans/:slug" element={<InsurancePlanDetailPage />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/finance/:company" element={<FinanceCompanyPage />} />
          <Route path="/contact" element={<ContactPage />} />
          {/* Clean 404 Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Dark Navy Corporate Footer */}
      <Footer />

      {/* Mobile Sticky Quick Contact Action Bar (Call / WhatsApp) */}
      <MobileStickyBar />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SiteSettingsProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </SiteSettingsProvider>
    </AuthProvider>
  );
}
