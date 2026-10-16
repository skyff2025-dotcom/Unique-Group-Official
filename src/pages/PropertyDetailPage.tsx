import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPropertyBySlug } from '../services/properties';
import { PropertyDetails } from '../components/property/PropertyDetails';
import { PropertyDetailSkeleton } from '../components/common/SkeletonLoader';
import { Property } from '../types';
import { ArrowLeft, Building2 } from 'lucide-react';

export const PropertyDetailPage: React.FC = () => {
  // Support both :slug and :id
  const { slug, id } = useParams<{ slug?: string; id?: string }>();
  const identifier = slug || id;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!identifier) return;
    let isMounted = true;

    async function load() {
      try {
        setLoading(true);
        const data = await getPropertyBySlug(identifier!);
        if (isMounted) {
          setProperty(data);
        }
      } catch (err) {
        console.warn('Property detail query error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [identifier]);

  return (
    <div className="pt-20 sm:pt-24 pb-28 sm:pb-24 lg:pb-20">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        {loading ? (
          <PropertyDetailSkeleton />
        ) : property ? (
          <PropertyDetails property={property} />
        ) : (
          <div className="py-24 max-w-xl mx-auto text-center space-y-6 bg-white p-8 rounded-2xl border border-[#E8E4D8]">
            <div className="w-16 h-16 rounded-full bg-[#FAF4E5] border border-[#C5A059] flex items-center justify-center mx-auto text-[#8C6E2E]">
              <Building2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h1 className="font-serif text-3xl font-bold text-[#0A192F]">
                Property Not Found
              </h1>
              <p className="text-slate-600 text-sm leading-relaxed">
                The requested property listing may have been updated, sold, or is no longer listed.
              </p>
            </div>
            <div>
              <Link
                to="/properties"
                className="inline-flex items-center gap-2 px-6 py-3 rounded bg-[#0A192F] text-[#E2C98D] text-xs font-semibold uppercase tracking-wider hover:bg-[#112240] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to All Properties</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
