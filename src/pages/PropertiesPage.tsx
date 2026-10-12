import React, { useState, useMemo, useEffect } from 'react';
import { SectionHeading } from '../components/common/SectionHeading';
import { PropertyGrid } from '../components/property/PropertyGrid';
import { getProperties } from '../services/properties';
import { Property } from '../types';
import { Search, Phone, MessageSquare } from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { buildWhatsAppUrl, WHATSAPP_CONFIG } from '../lib/whatsapp';

export const PropertiesPage: React.FC = () => {
  const settings = useSiteSettings();
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high'>('featured');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const data = await getProperties();
      setProperties(data);
    } catch (err: any) {
      if (import.meta.env?.DEV) {
        console.error('[PropertiesPage] Properties fetch error:', err?.message || err);
      }
      setFetchError('Unable to load properties from database. Please check your network connection or try refreshing.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filterTabs = [
    { id: 'all', label: 'All Properties' },
    { id: 'residential', label: 'Residential' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'land', label: 'Land & NA' },
    { id: 'investment', label: 'Investment & Estate' },
  ];

  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      const propType = (prop.type || '').toLowerCase();
      const matchesType =
        selectedType === 'all' ||
        propType === selectedType ||
        (selectedType === 'land' && (propType === 'land' || propType === 'na_land' || propType === 'agricultural')) ||
        (selectedType === 'residential' && propType === 'residential') ||
        (selectedType === 'commercial' && propType === 'commercial') ||
        (selectedType === 'investment' && (propType === 'investment' || propType === 'estate'));

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        (prop.title || '').toLowerCase().includes(q) ||
        (prop.location || '').toLowerCase().includes(q) ||
        (prop.city || '').toLowerCase().includes(q) ||
        (prop.district || '').toLowerCase().includes(q) ||
        (prop.typeLabel || '').toLowerCase().includes(q) ||
        (prop.area || '').toLowerCase().includes(q) ||
        (prop.formattedPrice || '').toLowerCase().includes(q);

      return matchesType && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price_low') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price_high') return (b.price || 0) - (a.price || 0);
      // 'featured' first:
      if (a.featured !== b.featured) {
        return a.featured ? -1 : 1;
      }
      return 0;
    });
  }, [properties, selectedType, searchQuery, sortBy]);

  return (
    <div className="pt-24 pb-20 space-y-12 sm:space-y-16">
      {/* Header */}
      <section className="bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="CURATED LISTINGS"
            title="Properties &amp; Land Parcels in Rajpipla"
            description="Explore verified residential bungalows, commercial showrooms, and collector-approved NA land plots."
            className="mb-10"
          />

          {/* Search & Filter Controls */}
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-[#E8E4D8] shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              {/* Search input */}
              <div className="relative w-full md:flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by location, keyword, or title (e.g. M.V. Road, Villa, NA Plot)..."
                  className="w-full min-h-[44px] pl-10 pr-4 py-2.5 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] placeholder-slate-400 focus:outline-none focus:border-[#C5A059] focus:bg-white transition-colors"
                />
              </div>

              {/* Sort by selector */}
              <div className="w-full md:w-auto flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-600 whitespace-nowrap">
                  Sort By:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="min-h-[44px] px-3 py-2 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs font-medium text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="featured">Featured First</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Interactive Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-[#F4F2EA]">
              {filterTabs.map((tab) => {
                const isActive = selectedType === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedType(tab.id)}
                    className={`min-h-[40px] px-4 py-2 rounded-lg text-xs font-semibold tracking-wider whitespace-nowrap transition-colors ${
                      isActive
                        ? 'bg-[#0A192F] text-[#E2C98D] shadow-sm'
                        : 'bg-[#FAF9F5] text-slate-600 hover:text-[#0A192F] hover:bg-[#F4F2EA]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Property Results */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {fetchError ? (
          <div className="p-8 rounded-xl bg-amber-50 border border-amber-200 text-center space-y-3 my-4">
            <p className="text-sm font-semibold text-amber-900">
              {fetchError}
            </p>
            <p className="text-xs text-amber-800">
              Our advisory desk is always reachable directly at {WHATSAPP_CONFIG.displayPhone}.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => load()}
                className="px-5 py-2.5 rounded-lg bg-[#0A192F] text-[#E2C98D] text-xs font-bold uppercase tracking-wider hover:bg-[#112240] transition-colors cursor-pointer"
              >
                Retry Loading Properties
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>
                Showing <strong className="text-[#0A192F]">{filteredProperties.length}</strong> available {filteredProperties.length === 1 ? 'property' : 'properties'}
              </span>
              {(selectedType !== 'all' || searchQuery.trim() !== '') && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedType('all');
                    setSearchQuery('');
                  }}
                  className="text-[#8C6E2E] hover:underline cursor-pointer"
                >
                  Reset Filters
                </button>
              )}
            </div>

            <PropertyGrid
              properties={filteredProperties}
              loading={loading}
              emptyMessage="No properties match your current search or category filter. Try clearing filters or contact us for off-market options."
            />
          </>
        )}
      </section>

      {/* Off-Market Custom Inquiry Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF9F5] border border-[#E8E4D8] rounded-xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="font-serif text-xl font-bold text-[#0A192F]">
              Require specific land acreage or commercial space?
            </h4>
            <p className="text-xs text-slate-600">
              Unique Group maintains relationships with landowners across Rajpipla, Poicha, and Narmada district.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${settings.phone}`}
              className="min-h-[44px] flex items-center gap-2 px-5 py-2.5 rounded bg-[#0A192F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#112240] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Call {settings.founder}</span>
            </a>
            <a
              href={buildWhatsAppUrl(`Hello ${WHATSAPP_CONFIG.recipientName}, I am looking for a specific property in Rajpipla.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] flex items-center gap-2 px-5 py-2.5 rounded bg-[#C5A059] text-[#050D1A] text-xs font-bold uppercase tracking-wider hover:bg-[#D4B46C] transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
