import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, MessageSquare, Check, ArrowLeft, ShieldCheck, FileCheck, ExternalLink, Bed, Bath, Compass, CheckCircle2 } from 'lucide-react';
import { Property } from '../../types';
import { VisualAsset } from '../common/VisualAsset';
import { EnquiryForm } from '../common/EnquiryForm';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { buildWhatsAppUrl, WHATSAPP_CONFIG } from '../../lib/whatsapp';

interface PropertyDetailsProps {
  property: Property;
}

export const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property }) => {
  const settings = useSiteSettings();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imgLoadError, setImgLoadError] = useState<Record<number, boolean>>({});

  const getAssetType = (prop: Property): any => {
    if (prop.type === 'residential') return 'villa';
    if (prop.type === 'commercial') return prop.id === 'prop-4' ? 'office' : 'commercial';
    if (prop.type === 'land') return 'land';
    if (prop.type === 'investment') return 'estate';
    return 'villa';
  };

  const currentGalleryImage = property.gallery?.[activeImageIndex]?.url;
  const isHttpImage = Boolean(
    currentGalleryImage &&
      (currentGalleryImage.startsWith('http://') ||
        currentGalleryImage.startsWith('https://') ||
        currentGalleryImage.startsWith('/'))
  );

  const contactPhone = property.contactPhone || settings.phone;
  const whatsappUrl = buildWhatsAppUrl(
    `Hello ${WHATSAPP_CONFIG.recipientName}, I am interested in ${property.title} in ${property.location} (${property.formattedPrice}). Please share more details.`
  );

  return (
    <div className="space-y-8">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#0A192F] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Properties</span>
        </Link>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span>{property.city}</span>
          {property.district && (
            <>
              <span aria-hidden="true">/</span>
              <span>{property.district}</span>
            </>
          )}
          <span aria-hidden="true">/</span>
          <span className="text-[#8C6E2E]">{property.typeLabel}</span>
        </div>
      </div>

      {/* Main Showcase Hero */}
      <div className="bg-white rounded-xl overflow-hidden border border-[#E8E4D8] shadow-sm">
        <div className="relative aspect-[16/9] sm:aspect-[21/9] max-h-[500px] w-full overflow-hidden bg-[#0A192F]">
          {isHttpImage && !imgLoadError[activeImageIndex] ? (
            <img
              src={currentGalleryImage}
              alt={property.title}
              loading="lazy"
              onError={() =>
                setImgLoadError((prev) => ({ ...prev, [activeImageIndex]: true }))
              }
              className="w-full h-full object-cover"
            />
          ) : (
            <VisualAsset
              type={getAssetType(property)}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/30" />

          {/* Top badges */}
          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
            {property.featured && (
              <span className="text-xs font-bold tracking-wider uppercase px-3 py-1 rounded bg-[#C5A059] text-[#0A192F] shadow-sm">
                FEATURED
              </span>
            )}
            <span className="text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded bg-[#0A192F] text-[#E2C98D] border border-[#C5A059]/40">
              {property.statusLabel}
            </span>
            <span className="text-xs font-medium px-2.5 py-1 rounded bg-white/90 text-[#0A192F] backdrop-blur-sm">
              {property.listingType || 'For Sale'}
            </span>
            <span className="text-xs font-medium px-2.5 py-1 rounded bg-white/90 text-[#0A192F] backdrop-blur-sm">
              {property.typeLabel}
            </span>
          </div>

          {/* Bottom Title Bar over image */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4 text-white">
            <div className="space-y-1.5 max-w-2xl">
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold">
                {property.title}
              </h1>
              <div className="flex items-center gap-2 text-sm text-slate-200">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>
                  {property.location}, {property.city}
                  {property.district ? `, ${property.district}` : ''}
                </span>
              </div>
            </div>

            <div className="text-left md:text-right shrink-0">
              <span className="text-xs text-slate-300 block uppercase tracking-wider">Demand Price</span>
              <span className="font-serif text-3xl font-bold text-[#E2C98D]">
                {property.formattedPrice}
              </span>
            </div>
          </div>
        </div>

        {/* Gallery Thumbnails (if multiple images present) */}
        {property.gallery && property.gallery.length > 1 && (
          <div className="p-3 bg-[#0A192F] flex items-center gap-2 overflow-x-auto">
            {property.gallery.map((img, idx) => (
              <button
                key={img.id || idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-20 h-14 rounded overflow-hidden border-2 transition-all shrink-0 ${
                  activeImageIndex === idx ? 'border-[#C5A059] scale-105' : 'border-transparent opacity-60 hover:opacity-90'
                }`}
              >
                <img
                  src={img.url}
                  alt={img.alt || `View ${idx + 1}`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.opacity = '0.3';
                  }}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Quick Spec Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E8E4D8] border-b border-[#E8E4D8] bg-[#FDFCF9]">
          <div className="p-4 text-center">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 block">Total Area</span>
            <span className="text-sm font-semibold text-[#0A192F]">{property.area}</span>
          </div>
          <div className="p-4 text-center">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 block">Listing Category</span>
            <span className="text-sm font-semibold text-[#0A192F]">{property.listingType || 'For Sale'}</span>
          </div>
          <div className="p-4 text-center">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 block">District / Region</span>
            <span className="text-sm font-semibold text-[#0A192F]">
              {property.district || 'Narmada'} · {property.city}
            </span>
          </div>
          <div className="p-4 text-center">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 block">Title Verification</span>
            <span className="text-sm font-semibold text-[#8C6E2E] flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Title Clear</span>
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Description & Specs vs Action Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Details (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Bedrooms / Bathrooms Badges if applicable */}
          {(property.bedrooms || property.bathrooms) && (
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-[#E8E4D8] text-sm text-[#0A192F]">
              {property.bedrooms && (
                <div className="flex items-center gap-2">
                  <Bed className="w-4 h-4 text-[#8C6E2E]" />
                  <span><strong>{property.bedrooms}</strong> Bedrooms</span>
                </div>
              )}
              {property.bedrooms && property.bathrooms && <span className="text-slate-300">|</span>}
              {property.bathrooms && (
                <div className="flex items-center gap-2">
                  <Bath className="w-4 h-4 text-[#8C6E2E]" />
                  <span><strong>{property.bathrooms}</strong> Bathrooms</span>
                </div>
              )}
            </div>
          )}

          {/* Overview */}
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E8E4D8] space-y-4 shadow-sm">
            <h2 className="font-serif text-2xl font-bold text-[#0A192F]">
              Property Overview
            </h2>
            {property.shortDescription && property.shortDescription !== property.fullDescription && (
              <p className="text-sm font-medium text-[#8C6E2E] leading-relaxed italic border-l-2 border-[#C5A059] pl-3 py-0.5">
                {property.shortDescription}
              </p>
            )}
            <p className="text-slate-700 leading-relaxed text-base whitespace-pre-line">
              {property.fullDescription}
            </p>

            <div className="pt-2 text-xs text-slate-500 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[#8C6E2E]" />
              <span>
                Legal search report, title clearance, and revenue record documentation handled end-to-end by Unique Group.
              </span>
            </div>
          </div>

          {/* Key Features & Specifications */}
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E8E4D8] space-y-6 shadow-sm">
            <h2 className="font-serif text-2xl font-bold text-[#0A192F]">
              Key Features &amp; Specifications
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {property.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-800">
                  <div className="w-5 h-5 rounded-full bg-[#FAF9F5] border border-[#C5A059] flex items-center justify-center shrink-0 mt-0.5 text-[#8C6E2E]">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Address & Google Maps */}
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E8E4D8] space-y-4 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="font-serif text-xl font-bold text-[#0A192F]">
                Location &amp; Registry Address
              </h3>
              {property.googleMapsUrl && (
                <a
                  href={property.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C6E2E] hover:text-[#0A192F] uppercase tracking-wider"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
            <p className="text-sm text-slate-600">
              {property.address}
            </p>
            <div className="p-4 rounded-lg bg-[#FAF9F5] border border-[#E8E4D8] text-xs text-slate-600 flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#0A192F] block mb-0.5">
                  Proximity &amp; Regional Growth Advantage
                </span>
                Directly connected to Rajpipla central avenues and the high-speed Narmada / Statue of Unity tourist &amp; commercial expansion corridor.
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Consultation & Direct Contact Box (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-[#C5A059]/40 shadow-sm sticky top-28 space-y-5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#8C6E2E] block">
                Primary Representative
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#0A192F]">
                {settings.founder}
              </h3>
              <p className="text-xs text-slate-500">
                Principal Advisory · {settings.businessName}, Rajpipla
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <a
                href={`tel:${contactPhone}`}
                className="w-full min-h-[44px] flex items-center justify-center gap-2 px-3 py-2.5 rounded bg-[#0A192F] hover:bg-[#112240] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
              >
                <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Call Now</span>
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[44px] flex items-center justify-center gap-2 px-3 py-2.5 rounded bg-[#C5A059] hover:bg-[#D4B46C] text-[#050D1A] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>

            <hr className="border-[#E8E4D8]" />

            {/* Direct Reusable Enquiry Form */}
            <EnquiryForm
              initialServiceType="Real Estate"
              propertyId={property.id}
              propertyTitle={property.title}
              title="Request Site Inspection"
              subtitle={`Enquire directly for ${property.title}.`}
              submitButtonText="Enquire on WhatsApp"
              className="border-0 shadow-none p-0 bg-transparent"
              hideHeader={false}
            />

            <div className="pt-2 text-[11px] text-slate-500 text-center">
              Office: {settings.addressLine1}, {settings.addressLine2}, {settings.city}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
