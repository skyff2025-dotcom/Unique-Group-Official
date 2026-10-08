import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  CheckCircle,
  ShieldCheck,
  Globe,
  Phone,
  Mail,
  FileText,
  UploadCloud,
  X,
  AlertCircle,
  Link as LinkIcon,
} from 'lucide-react';
import {
  getAdminInsuranceCompanyById,
  createInsuranceCompany,
  updateInsuranceCompany,
  checkCompanySlugUnique,
  uploadInsuranceLogo,
} from '../../services/admin';
import { InsuranceCompanyInsert } from '../../types/database';

export const AdminInsuranceCompanyFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  // Form State
  const [formData, setFormData] = useState<InsuranceCompanyInsert>({
    name: '',
    slug: '',
    logo_url: '',
    short_description: '',
    description: '',
    website_url: '',
    phone: '',
    email: '',
    active: true,
  });

  // Logo file upload state
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  useEffect(() => {
    if (!isEditing || !id) return;

    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        const comp = await getAdminInsuranceCompanyById(id!);
        if (isMounted && comp) {
          setFormData({
            name: comp.name,
            slug: comp.slug,
            logo_url: comp.logo_url || '',
            short_description: comp.short_description || '',
            description: comp.description || '',
            website_url: comp.website_url || '',
            phone: comp.phone || '',
            email: comp.email || '',
            active: comp.active,
          });
          if (comp.logo_url) {
            setLogoPreview(comp.logo_url);
          }
        }
      } catch (err) {
        console.warn('Load company error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [id, isEditing]);

  const handleNameChange = (val: string) => {
    setFormData((prev) => {
      const updated = { ...prev, name: val };
      if (!slugManuallyEdited && !isEditing) {
        updated.slug = generateSlug(val);
      }
      return updated;
    });
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Please select a valid image file (JPG, PNG, or WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Logo size must be less than 5MB.');
      return;
    }

    setSelectedLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name?.trim()) {
      setErrorMessage('Company Name is required.');
      return;
    }

    const currentSlug = formData.slug?.trim() || generateSlug(formData.name);
    if (!currentSlug) {
      setErrorMessage('Please provide a URL slug.');
      return;
    }

    setSaving(true);

    try {
      // Validate slug uniqueness
      const isUnique = await checkCompanySlugUnique(currentSlug, id);
      if (!isUnique) {
        setErrorMessage(`An insurance company with the slug "${currentSlug}" already exists.`);
        setSaving(false);
        return;
      }

      let finalLogoUrl = formData.logo_url;

      // If a new logo file was selected, upload it now
      if (selectedLogoFile) {
        setUploadingLogo(true);
        const uploadRes = await uploadInsuranceLogo(selectedLogoFile, currentSlug);
        setUploadingLogo(false);

        if (uploadRes.url) {
          finalLogoUrl = uploadRes.url;
        } else if (uploadRes.error) {
          // If upload fails, warn user
          console.warn('Logo upload warning:', uploadRes.error);
        }
      }

      const payload: InsuranceCompanyInsert = {
        ...formData,
        slug: currentSlug,
        logo_url: finalLogoUrl,
      };

      if (isEditing && id) {
        const res = await updateInsuranceCompany(id, payload);
        if (res.error) {
          setErrorMessage(res.error);
          setSaving(false);
          return;
        }

        navigate('/admin/insurance/companies', {
          state: { message: `Insurance company "${formData.name}" updated successfully.` },
        });
      } else {
        const res = await createInsuranceCompany(payload);
        if (res.error || !res.data) {
          setErrorMessage(res.error || 'Failed to create insurance company.');
          setSaving(false);
          return;
        }

        navigate('/admin/insurance/companies', {
          state: { message: `Insurance company "${formData.name}" added successfully.` },
        });
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred while saving.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-slate-500">
        <div className="w-6 h-6 border-2 border-[#0A192F] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading insurance company data...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/insurance/companies"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#0A192F] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Insurance Companies</span>
        </Link>

        {isEditing && formData.slug && (
          <Link
            to={`/insurance/${formData.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-[#8C6E2E] hover:underline"
          >
            View Public Provider Page &rarr;
          </Link>
        )}
      </div>

      {/* Header */}
      <div className="border-b border-[#E8E4D8] pb-4">
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#8C6E2E]">
          Insurance Advisory
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A192F]">
          {isEditing ? `Edit Company: ${formData.name}` : 'Add Insurance Company'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {isEditing
            ? 'Update corporate partner details, brand logo, and contact info.'
            : 'Add a new insurance provider to Unique Group’s advisory network.'}
        </p>
      </div>

      {/* Error message */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E8E4D8] shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b border-[#F4F2EA] pb-3">
            <ShieldCheck className="w-4 h-4 text-[#8C6E2E]" />
            <h2 className="font-serif text-lg font-bold text-[#0A192F]">
              Company Information
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Star Health & Allied Insurance"
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-sm text-[#0A192F] focus:outline-none focus:border-[#C5A059] focus:bg-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  URL Slug *
                </label>
                <span className="text-[11px] text-slate-400">
                  /insurance/<strong>{formData.slug || 'company-slug'}</strong>
                </span>
              </div>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => {
                    setSlugManuallyEdited(true);
                    setFormData({ ...formData, slug: e.target.value });
                  }}
                  placeholder="star-health-insurance"
                  className="w-full min-h-[44px] pl-9 pr-3.5 py-2 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs font-mono text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            {/* Logo Upload & Preview */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Company Logo
              </label>
              <p className="text-xs text-slate-500 mb-3">
                Upload image (JPG, PNG, WEBP up to 5MB) or specify a direct logo URL.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Logo Preview */}
                <div className="w-24 h-20 rounded-lg border-2 border-dashed border-[#D5CEBF] bg-[#FAF9F5] flex items-center justify-center overflow-hidden shrink-0">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain p-2" />
                  ) : (
                    <ShieldCheck className="w-8 h-8 text-slate-300" />
                  )}
                </div>

                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      className="hidden"
                      onChange={handleLogoFileChange}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-[#0A192F] text-[#E2C98D] text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 hover:bg-[#112240]"
                    >
                      <UploadCloud className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>{logoPreview ? 'Change Logo File' : 'Upload Logo File'}</span>
                    </button>

                    {logoPreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedLogoFile(null);
                          setLogoPreview('');
                          setFormData({ ...formData, logo_url: '' });
                        }}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                        title="Remove logo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Fallback direct logo URL */}
                  <div className="pt-1">
                    <input
                      type="url"
                      value={formData.logo_url || ''}
                      onChange={(e) => {
                        setFormData({ ...formData, logo_url: e.target.value });
                        if (!selectedLogoFile) setLogoPreview(e.target.value);
                      }}
                      placeholder="Or paste public logo URL: https://..."
                      className="w-full min-h-[36px] px-3 py-1 rounded-md border border-[#D5CEBF] bg-white text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Descriptions & Details */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E8E4D8] shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b border-[#F4F2EA] pb-3">
            <FileText className="w-4 h-4 text-[#8C6E2E]" />
            <h2 className="font-serif text-lg font-bold text-[#0A192F]">
              Descriptions &amp; Overview
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Short Description (Card Subtitle)
              </label>
              <input
                type="text"
                value={formData.short_description || ''}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                placeholder="e.g. India's premier standalone health insurance specialist."
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Description
              </label>
              <textarea
                rows={4}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Comprehensive background on the company, pan-India hospital tie-ups, settlement track record, and advisory guidance..."
                className="w-full p-3.5 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs leading-relaxed text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            {/* Website, Phone, Email */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Website URL
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={formData.website_url || ''}
                    onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full min-h-[42px] pl-9 pr-3 py-1.5 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Contact Phone
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="9909015956"
                    className="w-full min-h-[42px] pl-9 pr-3 py-1.5 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="info@starhealth.in"
                    className="w-full min-h-[42px] pl-9 pr-3 py-1.5 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>
            </div>

            {/* Active Status */}
            <div className="pt-4 border-t border-[#F4F2EA] flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
              <div>
                <span className="text-xs font-bold text-[#0A192F] block">
                  Active Provider
                </span>
                <span className="text-[11px] text-slate-500">
                  Only active insurance companies are shown on the public insurance directory.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E4D8]">
          <Link
            to="/admin/insurance/companies"
            className="min-h-[46px] px-6 py-2.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors inline-flex items-center"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving || uploadingLogo}
            className="min-h-[46px] px-8 py-2.5 rounded-lg bg-[#0A192F] hover:bg-[#112240] text-[#E2C98D] text-xs font-bold uppercase tracking-wider transition-all shadow-md disabled:opacity-70 flex items-center gap-2 cursor-pointer"
          >
            {saving || uploadingLogo ? (
              <>
                <div className="w-4 h-4 border-2 border-[#E2C98D]/40 border-t-[#E2C98D] rounded-full animate-spin" />
                <span>Saving Company...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-[#C5A059]" />
                <span>{isEditing ? 'Save Changes' : 'Create Company'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
