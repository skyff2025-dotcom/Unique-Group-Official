import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { Property } from '../../types';
import { VisualAsset } from '../common/VisualAsset';

interface PropertyCardProps {
  property: Property;
  className?: string;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, className = '' }) => {
  const [imageError, setImageError] = useState(false);

  // Determine appropriate visual asset type for fallback
  const getAssetType = (prop: Property): any => {
    if (prop.type === 'residential') return 'villa';
    if (prop.type === 'commercial') return prop.id === 'prop-4' ? 'office' : 'commercial';
    if (prop.type === 'land') return 'land';
    if (prop.type === 'investment') return 'estate';
    return 'villa';
  };

  const propertyUrl = `/properties/${property.slug || property.id}`;
  const firstImage = property.gallery?.[0]?.url || property.primaryImage;
  const isHttpImage = Boolean(firstImage && (firstImage.startsWith('http://') || firstImage.startsWith('https://') || firstImage.startsWith('/')));

  return (
    <div
      className={`group bg-white rounded-lg overflow-hidden border border-[#E8E4D8] shadow-sm hover:shadow-md hover:border-[#C5A059]/60 transition-all duration-300 flex flex-col h-full ${className}`}
    >
      {/* Property Visual Header */}
      <Link to={propertyUrl} className="relative aspect-[16/10] overflow-hidden block bg-[#0A192F]">
        {isHttpImage && !imageError ? (
          <img
            src={firstImage}
            alt={property.title}
            loading="lazy"
            decoding="async"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <VisualAsset
            type={getAssetType(property)}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {/* Subtle Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Clean Status Badge (Top-left) */}
        <div className="absolute top-3 left-3">
          <span
            className={`text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded ${
              property.status === 'featured'
                ? 'bg-[#0A192F] text-[#E2C98D] border border-[#C5A059]/40'
                : property.status === 'for_sale'
                ? 'bg-[#8C6E2E] text-white'
                : 'bg-white/90 text-[#0A192F] backdrop-blur-sm'
            }`}
          >
            {property.statusLabel}
          </span>
        </div>

        {/* Price Tag (Bottom-right over scrim) */}
        <div className="absolute bottom-3 right-3">
          <span className="font-serif text-lg font-bold text-white drop-shadow-md">
            {property.formattedPrice}
          </span>
        </div>
      </Link>

      {/* Property Content Info */}
      <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
        <div className="space-y-2">
          {/* Metadata line: Clean unboxed text with typographic separators */}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="text-[#8C6E2E]">{property.typeLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{property.area}</span>
            {property.bedrooms && (
              <>
                <span aria-hidden="true">·</span>
                <span>{property.bedrooms} BHK</span>
              </>
            )}
          </div>

          {/* Title */}
          <Link to={propertyUrl}>
            <h3 className="font-serif text-xl font-bold text-[#0A192F] group-hover:text-[#8C6E2E] transition-colors leading-snug line-clamp-1">
              {property.title}
            </h3>
          </Link>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>

          {/* Short Description */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-1">
            {property.shortDescription}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-[#F4F2EA] flex items-center justify-between">
          <span className="text-xs font-semibold text-[#0A192F] uppercase tracking-wider">
            {property.formattedPrice}
          </span>
          <Link
            to={propertyUrl}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#8C6E2E] group-hover:text-[#0A192F] group-hover:translate-x-0.5 transition-all py-1"
          >
            <span>View Property</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
