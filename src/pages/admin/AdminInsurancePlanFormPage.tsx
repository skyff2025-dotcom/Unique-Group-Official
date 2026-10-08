import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  CheckCircle,
  ShieldCheck,
  FileText,
  Phone,
  Plus,
  Trash2,
  AlertCircle,
  Layers,
  Link as LinkIcon,
} from 'lucide-react';
import {
  getAdminInsurancePlanById,
  createInsurancePlan,
  updateInsurancePlan,
  getAdminInsuranceCompanies,
  checkPlanSlugUnique,
} from '../../services/admin';
import { InsuranceCompanyRow, InsurancePlanInsert } from '../../types/database';

const DEFAULT_CATEGORIES = [
  'Health',
  'Life',
  'Motor',
  'Business',
  'Travel',
  'Property',
  'General',
  'Other',
];

export const AdminInsurancePlanFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  // Companies dropdown list
  const [companies, setCompanies] = useState<InsuranceCompanyRow[]>([]);
  const [showInactiveCompanies, setShowInactiveCompanies] = useState(false);

  // Dynamic Key Benefits list
  const [benefits, setBenefits] = useState<string[]>([
    'Cashless hospitalization across approved hospitals',
    'Pre and post hospitalization medical expense coverage',
    'Dedicated advisory & claims assistance by Unique Group',
  ]);

  // Dynamic Documents Required list
  const [documents, setDocuments] = useState<string[]>([
    'Aadhaar Card / Government Photo ID',
    'PAN Card',
    'Recent Passport Size Photograph',
  ]);

  // Form State
  const [formData, setFormData] = useState<InsurancePlanInsert>({
    company_id: '',
    name: '',
    slug: '',
    category: 'Health',
    short_description: '',
    description: '',
    key_benefits: null,
    eligibility: 'Individuals aged 18 to 65 years and their dependent family members.',
    documents_required: null,
    contact_phone: '9909015956',
    active: true,
  });

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  useEffect(() => {
    let isMounted = true;
    async function init() {
      try {
        const comps = await getAdminInsuranceCompanies();
        if (isMounted) {
          setCompanies(comps);
          if (!isEditing && comps.length > 0) {
            // Pick first active company by default
            const firstActive = comps.find((c) => c.active) || comps[0];
            setFormData((prev) => ({ ...prev, company_id: firstActive.id }));
          }
        }

        if (isEditing && id) {
          const plan = await getAdminInsurancePlanById(id);
          if (isMounted && plan) {
            setFormData({
              company_id: plan.company_id,
              name: plan.name,
              slug: plan.slug,
              category: plan.category || 'Health',
              short_description: plan.short_description || '',
              description: plan.description || '',
              key_benefits: plan.key_benefits,
              eligibility: plan.eligibility || '',
              documents_required: plan.documents_required,
              contact_phone: plan.contact_phone || '9909015956',
              active: plan.active,
            });

            // Parse key benefits array
            if (Array.isArray(plan.key_benefits) && plan.key_benefits.length > 0) {
              setBenefits(plan.key_benefits as string[]);
            }

            // Parse documents array
            if (Array.isArray(plan.documents_required) && plan.documents_required.length > 0) {
              setDocuments(plan.documents_required as string[]);
            }
          }
        }
      } catch (err) {
        console.warn('Init plan error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    init();
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

  // Add / remove benefits
  const handleAddBenefit = () => {
    setBenefits([...benefits, '']);
  };

  const handleBenefitChange = (index: number, val: string) => {
    const updated = [...benefits];
    updated[index] = val;
    setBenefits(updated);
  };

  const handleRemoveBenefit = (index: number) => {
    const updated = [...benefits];
    updated.splice(index, 1);
    setBenefits(updated);
  };

  // Add / remove documents
  const handleAddDocument = () => {
    setDocuments([...documents, '']);
  };

  const handleDocumentChange = (index: number, val: string) => {
    const updated = [...documents];
    updated[index] = val;
    setDocuments(updated);
  };

  const handleRemoveDocument = (index: number) => {
    const updated = [...documents];
    updated.splice(index, 1);
    setDocuments(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.company_id) {
      setErrorMessage('Please select an insurance company.');
      return;
    }

    if (!formData.name?.trim()) {
      setErrorMessage('Plan Name is required.');
      return;
    }

    const currentSlug = formData.slug?.trim() || generateSlug(formData.name);
    if (!currentSlug) {
      setErrorMessage('Please provide a URL slug.');
      return;
    }

    setSaving(true);

    try {
      // Validate unique slug
      const isUnique = await checkPlanSlugUnique(currentSlug, id);
      if (!isUnique) {
        setErrorMessage(`An insurance plan with the slug "${currentSlug}" already exists.`);
        setSaving(false);
        return;
      }

      // Filter non-empty benefits and documents
      const cleanBenefits = benefits.map((b) => b.trim()).filter(Boolean);
      const cleanDocuments = documents.map((d) => d.trim()).filter(Boolean);

      const payload: InsurancePlanInsert = {
        ...formData,
        slug: currentSlug,
        key_benefits: cleanBenefits,
        documents_required: cleanDocuments,
      };

      if (isEditing && id) {
        const res = await updateInsurancePlan(id, payload);
        if (res.error) {
          setErrorMessage(res.error);
          setSaving(false);
          return;
        }

        navigate('/admin/insurance/plans', {
          state: { message: `Insurance plan "${formData.name}" updated successfully.` },
        });
      } else {
        const res = await createInsurancePlan(payload);
        if (res.error || !res.data) {
          setErrorMessage(res.error || 'Failed to create insurance plan.');
          setSaving(false);
          return;
        }

        navigate('/admin/insurance/plans', {
          state: { message: `Insurance plan "${formData.name}" published successfully.` },
        });
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred while saving.');
      setSaving(false);
    }
  };

  // Filter companies: only show active companies by default, unless admin checked showInactiveCompanies
  const availableCompanies = companies.filter(
    (c) => c.active || showInactiveCompanies || c.id === formData.company_id
  );

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-slate-500">
        <div className="w-6 h-6 border-2 border-[#0A192F] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading insurance plan details...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/insurance/plans"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#0A192F] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Plans</span>
        </Link>
      </div>

      {/* Header */}
      <div className="border-b border-[#E8E4D8] pb-4">
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#8C6E2E]">
          Policy Plan Management
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A192F]">
          {isEditing ? `Edit Plan: ${formData.name}` : 'Add Insurance Plan'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure policy coverages, key benefits, eligibility, and documentation checklists.
        </p>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Plan Info */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E8E4D8] shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b border-[#F4F2EA] pb-3">
            <ShieldCheck className="w-4 h-4 text-[#8C6E2E]" />
            <h2 className="font-serif text-lg font-bold text-[#0A192F]">
              Plan &amp; Provider Information
            </h2>
          </div>

          <div className="space-y-4">
            {/* Company Select */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Insurance Company *
                </label>
                <label className="text-[11px] text-slate-500 inline-flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showInactiveCompanies}
                    onChange={(e) => setShowInactiveCompanies(e.target.checked)}
                    className="rounded text-[#0A192F] focus:ring-0"
                  />
                  <span>Show inactive providers</span>
                </label>
              </div>

              <select
                required
                value={formData.company_id}
                onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs font-medium text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
              >
                <option value="">Select an Insurance Company...</option>
                {availableCompanies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {!c.active ? '(Inactive)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Plan Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Plan Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Star Comprehensive Health Insurance Policy"
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-sm text-[#0A192F] focus:outline-none focus:border-[#C5A059] focus:bg-white"
              />
            </div>

            {/* Slug */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  URL Slug *
                </label>
                <span className="text-[11px] text-slate-400">
                  Unique identifier: <strong>{formData.slug || 'plan-slug'}</strong>
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
                  placeholder="star-comprehensive-health-insurance"
                  className="w-full min-h-[44px] pl-9 pr-3.5 py-2 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs font-mono text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            {/* Category & Contact Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full min-h-[44px] px-3 py-2 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs font-medium text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                >
                  {DEFAULT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat} Insurance
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Advisory Contact Phone
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={formData.contact_phone || ''}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    placeholder="9909015956"
                    className="w-full min-h-[44px] pl-9 pr-3.5 py-2 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Descriptions & Eligibility */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E8E4D8] shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b border-[#F4F2EA] pb-3">
            <FileText className="w-4 h-4 text-[#8C6E2E]" />
            <h2 className="font-serif text-lg font-bold text-[#0A192F]">
              Description &amp; Eligibility
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Short Description
              </label>
              <input
                type="text"
                value={formData.short_description || ''}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                placeholder="e.g. All-inclusive family health cover with zero room rent capping."
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
                placeholder="Detailed policy overview explaining coverage limits, cashless hospital process, restoration benefits, and renewal terms..."
                className="w-full p-3.5 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs leading-relaxed text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Premium Starting From (Optional)
              </label>
              <input
                type="text"
                value={formData.eligibility || ''}
                onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                placeholder="e.g. ₹999 / year or Starting from ₹5,500 / yr"
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Base premium rate or starting annual cost displayed to customers.
              </span>
            </div>
          </div>
        </div>

        {/* KEY BENEFITS (JSONB Array) */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E8E4D8] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F4F2EA] pb-3">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#0A192F]">
                Key Benefits
              </h2>
              <p className="text-xs text-slate-500">
                Highlight key advantages of this insurance plan (e.g. cashless claims, network coverage).
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddBenefit}
              className="min-h-[36px] px-3 py-1.5 rounded-lg bg-[#FAF9F5] border border-[#D5CEBF] hover:bg-[#FAF4E5] text-xs font-bold text-[#8C6E2E] inline-flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Benefit</span>
            </button>
          </div>

          <div className="space-y-2.5 pt-2">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400 w-6 text-right">
                  {idx + 1}.
                </span>
                <input
                  type="text"
                  value={benefit}
                  onChange={(e) => handleBenefitChange(idx, e.target.value)}
                  placeholder={`Benefit ${idx + 1}...`}
                  className="flex-1 min-h-[40px] px-3 py-1.5 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveBenefit(idx)}
                  disabled={benefits.length <= 1}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-30"
                  title="Remove benefit"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* DOCUMENTS REQUIRED (JSONB Array) */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E8E4D8] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F4F2EA] pb-3">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#0A192F]">
                Documents Required
              </h2>
              <p className="text-xs text-slate-500">
                Checklist of necessary paperwork for policy issuance and verification.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddDocument}
              className="min-h-[36px] px-3 py-1.5 rounded-lg bg-[#FAF9F5] border border-[#D5CEBF] hover:bg-[#FAF4E5] text-xs font-bold text-[#8C6E2E] inline-flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Document</span>
            </button>
          </div>

          <div className="space-y-2.5 pt-2">
            {documents.map((doc, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400 w-6 text-right">
                  {idx + 1}.
                </span>
                <input
                  type="text"
                  value={doc}
                  onChange={(e) => handleDocumentChange(idx, e.target.value)}
                  placeholder={`Document ${idx + 1} (e.g. Aadhaar Card)...`}
                  className="flex-1 min-h-[40px] px-3 py-1.5 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveDocument(idx)}
                  disabled={documents.length <= 1}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-30"
                  title="Remove document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Active Toggle & Save */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E8E4D8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
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
                Active Policy Plan
              </span>
              <span className="text-[11px] text-slate-500">
                Only active plans are displayed to visitors on the public portal.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/insurance/plans"
              className="min-h-[46px] px-6 py-2.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors inline-flex items-center"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="min-h-[46px] px-8 py-2.5 rounded-lg bg-[#0A192F] hover:bg-[#112240] text-[#E2C98D] text-xs font-bold uppercase tracking-wider transition-all shadow-md disabled:opacity-70 flex items-center gap-2 cursor-pointer"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#E2C98D]/40 border-t-[#E2C98D] rounded-full animate-spin" />
                  <span>Saving Plan...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-[#C5A059]" />
                  <span>{isEditing ? 'Save Changes' : 'Publish Plan'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
