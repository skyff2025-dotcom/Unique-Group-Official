import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  CheckCircle,
  Building,
  Phone,
  Mail,
  MapPin,
  Globe,
  Instagram,
  Facebook,
  RefreshCw,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import { getAdminSiteSettings, updateSiteSettings, uploadInsuranceLogo } from '../../services/admin';
import { SiteSettingsRow, SiteSettingsUpdate } from '../../types/database';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export const AdminSettingsPage: React.FC = () => {
  const settingsContext = useSiteSettings();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState<SiteSettingsUpdate>({
    business_name: 'UNIQUE GROUP',
    tagline: 'Trust • Protection • Growth',
    phone: '9909015956',
    whatsapp: '919909015956',
    email: '',
    address: 'Vraj Avenue, B-12, M.V. Road, Rajpipla, Gujarat',
    google_maps_url: '',
    instagram_url: '',
    facebook_url: '',
    logo_url: '',
  });

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await getAdminSiteSettings();
      if (data) {
        setFormData({
          business_name: data.business_name,
          tagline: data.tagline,
          phone: data.phone,
          whatsapp: data.whatsapp || '',
          email: data.email || '',
          address: data.address,
          google_maps_url: data.google_maps_url || '',
          instagram_url: data.instagram_url || '',
          facebook_url: data.facebook_url || '',
          logo_url: data.logo_url || '',
        });
      }
    } catch (err) {
      console.warn('Site settings load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setSaving(true);

    try {
      const res = await updateSiteSettings(formData);
      if (res.success) {
        setSuccessMessage('Settings saved successfully.');
        await settingsContext.refreshSettings?.();
        setTimeout(() => setSuccessMessage(''), 4000);
      } else {
        setErrorMessage(res.error || 'Failed to update site settings.');
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    setErrorMessage('');
    try {
      const uploadRes = await uploadInsuranceLogo(file, 'unique-group-logo');
      if (uploadRes.url) {
        setFormData((prev) => ({ ...prev, logo_url: uploadRes.url }));
        setSuccessMessage('Logo uploaded. Remember to click "Save Corporate Settings" to persist changes.');
      } else if (uploadRes.error) {
        setErrorMessage(uploadRes.error);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to upload logo image.');
    } finally {
      setUploadingLogo(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E4D8] pb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#8C6E2E]">
            Website Administration
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A192F]">
            Corporate Site Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Manage contact information, office address, and social links displayed across the website.
          </p>
        </div>

        <button
          type="button"
          onClick={loadSettings}
          disabled={loading}
          className="min-h-[42px] px-3.5 py-2 rounded-lg bg-white border border-[#E8E4D8] text-xs font-semibold text-slate-700 hover:bg-[#FAF9F5] shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
          title="Reload settings"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#8C6E2E] ${loading ? 'animate-spin' : ''}`} />
          <span>Reload</span>
        </button>
      </div>

      {/* Alert Notices */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="p-16 text-center text-xs text-slate-500 bg-white rounded-xl border border-[#E8E4D8]">
          Loading site settings...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECTION 1: Brand & Tagline */}
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E8E4D8] shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-[#F4F2EA] pb-3">
              <Building className="w-4 h-4 text-[#8C6E2E]" />
              <h2 className="font-serif text-lg font-bold text-[#0A192F]">
                Business Identity
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.business_name}
                  onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                  placeholder="UNIQUE GROUP"
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Tagline *
                </label>
                <input
                  type="text"
                  required
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="Trust • Protection • Growth"
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Corporate Logo
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div>
                  <span className="text-[11px] text-slate-500 mb-1 block">Image URL</span>
                  <input
                    type="url"
                    value={formData.logo_url || ''}
                    onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                  />
                  <div className="mt-2 flex items-center gap-2">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-[#D5CEBF] text-xs font-semibold text-slate-700 hover:bg-[#FAF9F5] transition-colors shadow-xs">
                      <Upload className="w-3.5 h-3.5 text-[#8C6E2E]" />
                      <span>{uploadingLogo ? 'Uploading...' : 'Upload Logo File'}</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/jpg"
                        onChange={handleLogoFileChange}
                        disabled={uploadingLogo}
                        className="hidden"
                      />
                    </label>
                    {formData.logo_url && (
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, logo_url: '' }))}
                        className="text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1"
                      >
                        Remove Logo
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-[#FAF9F5] border border-[#E8E4D8] rounded-lg text-center flex flex-col items-center justify-center min-h-[100px]">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2 block">
                    Logo Preview
                  </span>
                  {formData.logo_url ? (
                    <img
                      src={formData.logo_url}
                      alt="Logo preview"
                      className="max-h-16 max-w-full object-contain rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center text-slate-400 gap-1 text-xs">
                      <ImageIcon className="w-6 h-6 stroke-1 text-slate-300" />
                      <span>Default textual wordmark is active</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Contact Information */}
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E8E4D8] shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-[#F4F2EA] pb-3">
              <Phone className="w-4 h-4 text-[#8C6E2E]" />
              <h2 className="font-serif text-lg font-bold text-[#0A192F]">
                Direct Contact &amp; Channels
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Primary Mobile / Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="9909015956"
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.whatsapp || ''}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="919909015956"
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contact@uniquegroup.in"
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Office Address & Location */}
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E8E4D8] shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-[#F4F2EA] pb-3">
              <MapPin className="w-4 h-4 text-[#8C6E2E]" />
              <h2 className="font-serif text-lg font-bold text-[#0A192F]">
                Corporate Office Address
              </h2>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Full Physical Address *
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Vraj Avenue, B-12, M.V. Road, Rajpipla, Gujarat"
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Google Maps Location URL
              </label>
              <input
                type="url"
                value={formData.google_maps_url || ''}
                onChange={(e) => setFormData({ ...formData, google_maps_url: e.target.value })}
                placeholder="https://maps.google.com/?q=..."
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>

          {/* SECTION 4: Social Media Links */}
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E8E4D8] shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-[#F4F2EA] pb-3">
              <Globe className="w-4 h-4 text-[#8C6E2E]" />
              <h2 className="font-serif text-lg font-bold text-[#0A192F]">
                Social Media Links
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1.5">
                  <Instagram className="w-3.5 h-3.5 text-pink-600" />
                  <span>Instagram Profile URL</span>
                </label>
                <input
                  type="url"
                  value={formData.instagram_url || ''}
                  onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                  placeholder="https://instagram.com/uniquegroup"
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1.5">
                  <Facebook className="w-3.5 h-3.5 text-blue-600" />
                  <span>Facebook Page URL</span>
                </label>
                <input
                  type="url"
                  value={formData.facebook_url || ''}
                  onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                  placeholder="https://facebook.com/uniquegroup"
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="min-h-[46px] px-8 py-2.5 rounded-lg bg-[#0A192F] hover:bg-[#112240] text-[#E2C98D] text-xs font-bold uppercase tracking-wider transition-all shadow-md disabled:opacity-70 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#E2C98D]/40 border-t-[#E2C98D] rounded-full animate-spin" />
                  <span>Saving Settings...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-[#C5A059]" />
                  <span>Save Corporate Settings</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
