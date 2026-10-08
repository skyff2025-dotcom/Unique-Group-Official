import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  CheckCircle,
  Building2,
  MapPin,
  FileText,
  DollarSign,
  Phone,
  Link as LinkIcon,
  Globe,
  Compass,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import {
  getAdminPropertyById,
  createProperty,
  updateProperty,
  checkSlugUnique,
  uploadPropertyImage,
  addPropertyImageByUrl,
  AdminPropertyWithImages,
} from '../../services/admin';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { PropertyInsert, PropertyImageRow } from '../../types/database';

export const AdminPropertyFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  // Form State
  const [formData, setFormData] = useState<PropertyInsert>({
    title: '',
    slug: '',
    property_type: 'residential',
    listing_type: 'For Sale',
    location: '',
    city: 'Rajpipla',
    district: 'Narmada',
    area: '',
    area_unit: 'sq.ft',
    price: null,
    price_display: '',
    short_description: '',
    description: '',
    status: 'Available',
    featured: false,
    bedrooms: null,
    bathrooms: null,
    google_maps_url: '',
    latitude: null,
    longitude: null,
    contact_phone: '9909015956',
  });

  const [images, setImages] = useState<PropertyImageRow[]>([]);
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const [stagedUrls, setStagedUrls] = useState<string[]>([]);

  // Slug generator helper
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
        const prop = await getAdminPropertyById(id!);
        if (isMounted && prop) {
          setFormData({
            title: prop.title,
            slug: prop.slug,
            property_type: prop.property_type,
            listing_type: prop.listing_type,
            location: prop.location,
            city: prop.city,
            district: prop.district,
            area: prop.area,
            area_unit: prop.area_unit,
            price: prop.price,
            price_display: prop.price_display || '',
            short_description: prop.short_description || '',
            description: prop.description,
            status: prop.status,
            featured: prop.featured,
            bedrooms: prop.bedrooms,
            bathrooms: prop.bathrooms,
            google_maps_url: prop.google_maps_url || '',
            latitude: prop.latitude,
            longitude: prop.longitude,
            contact_phone: prop.contact_phone || '9909015956',
          });
          setImages(prop.property_images || []);
        }
      } catch (err) {
        console.warn('Property fetch error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [id, isEditing]);

  const handleTitleChange = (val: string) => {
    setFormData((prev) => {
      const updated = { ...prev, title: val };
      if (!slugManuallyEdited && !isEditing) {
        updated.slug = generateSlug(val);
      }
      return updated;
    });
  };

  // Check whether bedrooms/bathrooms are relevant to this property type
  const isResidentialType =
    formData.property_type === 'residential' ||
    formData.property_type === 'Residential' ||
    formData.property_type === 'other';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validations
    if (!formData.title?.trim()) {
      setErrorMessage('Property Title is required.');
      return;
    }

    if (!formData.property_type?.trim()) {
      setErrorMessage('Property Type is required.');
      return;
    }

    if (!formData.listing_type?.trim()) {
      setErrorMessage('Listing Type is required.');
      return;
    }

    if (!formData.location?.trim()) {
      setErrorMessage('Location is required.');
      return;
    }

    if (!formData.status?.trim()) {
      setErrorMessage('Status is required.');
      return;
    }

    const currentSlug = formData.slug?.trim() || generateSlug(formData.title);
    if (!currentSlug) {
      setErrorMessage('Please provide a valid URL slug.');
      return;
    }

    setSaving(true);

    try {
      // Check unique slug
      const isUnique = await checkSlugUnique(currentSlug, id);
      if (!isUnique) {
        setErrorMessage(`A property with the slug "${currentSlug}" already exists. Please customize the slug.`);
        setSaving(false);
        return;
      }

      const payload: PropertyInsert = {
        ...formData,
        slug: currentSlug,
        // If not residential, clear bedrooms and bathrooms
        bedrooms: isResidentialType ? formData.bedrooms : null,
        bathrooms: isResidentialType ? formData.bathrooms : null,
      };

      if (isEditing && id) {
        const result = await updateProperty(id, payload);
        if (result.error) {
          setErrorMessage(result.error);
          setSaving(false);
          return;
        }

        // Upload any staged files or URLs if present
        if (stagedFiles.length > 0) {
          for (let i = 0; i < stagedFiles.length; i++) {
            const nextOrder = images.length + i;
            await uploadPropertyImage(id, stagedFiles[i], nextOrder, stagedFiles[i].name);
          }
        }

        if (stagedUrls.length > 0) {
          for (let i = 0; i < stagedUrls.length; i++) {
            const nextOrder = images.length + stagedFiles.length + i;
            await addPropertyImageByUrl(id, stagedUrls[i], nextOrder);
          }
        }

        navigate('/admin/properties', {
          state: { message: `Property "${formData.title}" updated successfully.` },
        });
      } else {
        const result = await createProperty(payload);
        if (result.error || !result.data) {
          setErrorMessage(result.error || 'Failed to create property.');
          setSaving(false);
          return;
        }

        const newPropertyId = result.data.id;

        // Upload any staged photos to the newly created property
        if (stagedFiles.length > 0) {
          for (let i = 0; i < stagedFiles.length; i++) {
            await uploadPropertyImage(newPropertyId, stagedFiles[i], i, stagedFiles[i].name);
          }
        }

        if (stagedUrls.length > 0) {
          for (let i = 0; i < stagedUrls.length; i++) {
            await addPropertyImageByUrl(newPropertyId, stagedUrls[i], stagedFiles.length + i);
          }
        }

        navigate('/admin/properties', {
          state: { message: `Property "${formData.title}" created successfully and published.` },
        });
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred while saving the property.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-slate-500">
        <div className="w-6 h-6 border-2 border-[#0A192F] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading property information...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Top Breadcrumb & Link */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/properties"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#0A192F] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Properties</span>
        </Link>

        {isEditing && formData.slug && (
          <Link
            to={`/properties/${formData.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-[#8C6E2E] hover:underline inline-flex items-center gap-1"
          >
            <span>View Public Listing</span>
            <span>&rarr;</span>
          </Link>
        )}
      </div>

      {/* Header */}
      <div className="border-b border-[#E8E4D8] pb-4">
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#8C6E2E]">
          {isEditing ? 'Property Management' : 'Create Listing'}
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A192F]">
          {isEditing ? `Edit: ${formData.title}` : 'Add Property'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {isEditing
            ? 'Update property specifications, manage gallery photos, and configure public visibility.'
            : 'Fill in the real estate details below to publish a new property listing.'}
        </p>
      </div>

      {/* Alert Notice */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* MAIN FORM */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1 — BASIC INFORMATION */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E8E4D8] shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b border-[#F4F2EA] pb-3">
            <Building2 className="w-4 h-4 text-[#8C6E2E]" />
            <h2 className="font-serif text-lg font-bold text-[#0A192F]">
              SECTION 1 — Basic Information
            </h2>
          </div>

          <div className="space-y-4">
            {/* Property Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Property Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. 4 Acre NA Land Near Statue of Unity"
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-sm text-[#0A192F] focus:outline-none focus:border-[#C5A059] focus:bg-white"
              />
            </div>

            {/* URL Slug (with auto-generation) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  URL Slug *
                </label>
                <span className="text-[11px] text-slate-400">
                  Preview: /properties/<strong>{formData.slug || 'example-slug'}</strong>
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
                  placeholder="4-acre-na-land-near-statue-of-unity"
                  className="w-full min-h-[44px] pl-9 pr-3.5 py-2 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs font-mono text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            {/* Property Type & Listing Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Property Type *
                </label>
                <select
                  required
                  value={formData.property_type}
                  onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
                  className="w-full min-h-[44px] px-3 py-2 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs font-medium text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="land">Land</option>
                  <option value="na_land">NA Land</option>
                  <option value="agricultural">Agricultural</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Listing Type *
                </label>
                <select
                  required
                  value={formData.listing_type}
                  onChange={(e) => setFormData({ ...formData, listing_type: e.target.value })}
                  className="w-full min-h-[44px] px-3 py-2 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs font-medium text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="For Sale">For Sale</option>
                  <option value="For Rent">For Rent</option>
                  <option value="Coming Soon">Coming Soon</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2 — LOCATION */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E8E4D8] shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b border-[#F4F2EA] pb-3">
            <MapPin className="w-4 h-4 text-[#8C6E2E]" />
            <h2 className="font-serif text-lg font-bold text-[#0A192F]">
              SECTION 2 — Location
            </h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Location / Area Landmark *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. M.V. Road / Vraj Avenue"
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Rajpipla"
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  District *
                </label>
                <input
                  type="text"
                  required
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder="Narmada"
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            {/* Google Maps URL */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Google Maps URL
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={formData.google_maps_url || ''}
                  onChange={(e) => setFormData({ ...formData, google_maps_url: e.target.value })}
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full min-h-[44px] pl-9 pr-3.5 py-2 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            {/* Latitude & Longitude */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Latitude (Optional)
                </label>
                <div className="relative">
                  <Compass className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude ?? ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        latitude: e.target.value ? parseFloat(e.target.value) : null,
                      })
                    }
                    placeholder="e.g. 21.8715"
                    className="w-full min-h-[44px] pl-9 pr-3.5 py-2 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Longitude (Optional)
                </label>
                <div className="relative">
                  <Compass className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude ?? ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        longitude: e.target.value ? parseFloat(e.target.value) : null,
                      })
                    }
                    placeholder="e.g. 73.5028"
                    className="w-full min-h-[44px] pl-9 pr-3.5 py-2 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3 — PROPERTY DETAILS */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E8E4D8] shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b border-[#F4F2EA] pb-3">
            <DollarSign className="w-4 h-4 text-[#8C6E2E]" />
            <h2 className="font-serif text-lg font-bold text-[#0A192F]">
              SECTION 3 — Property Details
            </h2>
          </div>

          <div className="space-y-4">
            {/* Area & Unit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Area *
                </label>
                <input
                  type="text"
                  required
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  placeholder="e.g. 4,200 or 4"
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Area Unit *
                </label>
                <select
                  required
                  value={formData.area_unit}
                  onChange={(e) => setFormData({ ...formData, area_unit: e.target.value })}
                  className="w-full min-h-[44px] px-3 py-2 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="sq.ft">sq.ft (Square Feet)</option>
                  <option value="sq.yd">sq.yd (Square Yards / Vigha)</option>
                  <option value="Acres">Acres</option>
                  <option value="Guntha">Guntha</option>
                  <option value="Hectares">Hectares</option>
                </select>
              </div>
            </div>

            {/* Price & Price Display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Price (Numeric INR)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.price ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: e.target.value ? parseFloat(e.target.value) : null,
                    })
                  }
                  placeholder="e.g. 18500000"
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Price Display Label
                </label>
                <input
                  type="text"
                  value={formData.price_display || ''}
                  onChange={(e) => setFormData({ ...formData, price_display: e.target.value })}
                  placeholder="e.g. ₹1.85 Cr or ₹45 Lakh / Acre"
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            {/* Bedrooms & Bathrooms (Only show when relevant to property type) */}
            {isResidentialType ? (
              <div className="p-4 bg-[#FAF9F5] rounded-lg border border-[#E8E4D8] space-y-3">
                <span className="text-xs font-bold text-[#0A192F] block">
                  Residential Room Specifications
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.bedrooms ?? ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bedrooms: e.target.value ? parseInt(e.target.value, 10) : null,
                        })
                      }
                      placeholder="e.g. 4"
                      className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-[#D5CEBF] bg-white text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.bathrooms ?? ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bathrooms: e.target.value ? parseInt(e.target.value, 10) : null,
                        })
                      }
                      placeholder="e.g. 4"
                      className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-[#D5CEBF] bg-white text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-500">
                Bedrooms &amp; Bathrooms are hidden for {formData.property_type.replace('_', ' ')} properties.
              </div>
            )}

            {/* Contact Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Contact Phone
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

        {/* SECTION 4 — DESCRIPTION & STATUS */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E8E4D8] shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b border-[#F4F2EA] pb-3">
            <FileText className="w-4 h-4 text-[#8C6E2E]" />
            <h2 className="font-serif text-lg font-bold text-[#0A192F]">
              SECTION 4 — Description &amp; Status
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
                placeholder="Brief one-line summary displayed on property cards..."
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Description *
              </label>
              <textarea
                required
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Comprehensive description covering legal title clearance, road frontage, utilities, mutation status, and proximity..."
                className="w-full p-3.5 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs leading-relaxed text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            {/* Status & Featured toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-[#F4F2EA]">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Status *
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full min-h-[44px] px-3 py-2 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs font-medium text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="Available">Available</option>
                  <option value="Sold">Sold</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Only properties marked "Available" are shown on the public website.
                </span>
              </div>

              <div className="flex items-center gap-3 pt-6">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C5A059]"></div>
                </label>
                <div>
                  <span className="text-xs font-bold text-[#0A192F] block flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                    Featured Property
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Display prominently in the homepage Featured Properties section.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 5 — IMAGES */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E8E4D8] shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#F4F2EA] pb-3">
            <Building2 className="w-4 h-4 text-[#8C6E2E]" />
            <h2 className="font-serif text-lg font-bold text-[#0A192F]">
              SECTION 5 — Images
            </h2>
          </div>

          <ImageUploader
            propertyId={id}
            images={images}
            onImagesChange={(updated) => setImages(updated)}
            stagedFiles={stagedFiles}
            onStagedFilesChange={(files) => setStagedFiles(files)}
            stagedUrls={stagedUrls}
            onStagedUrlsChange={(urls) => setStagedUrls(urls)}
            disabled={saving}
          />
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E4D8]">
          <Link
            to="/admin/properties"
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
                <span>Saving Property...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-[#C5A059]" />
                <span>{isEditing ? 'Save Changes' : 'Save Property'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
