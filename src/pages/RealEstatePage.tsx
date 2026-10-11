import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SectionHeading } from '../components/common/SectionHeading';
import { PropertyGrid } from '../components/property/PropertyGrid';
import { VisualAsset } from '../components/common/VisualAsset';
import { getProperties } from '../services/properties';
import { Property } from '../types';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { ArrowRight, CheckCircle2, ShieldCheck, MapPin, Building, Landmark, Trees, Compass, MessageSquare } from 'lucide-react';
import { buildWhatsAppUrl, WHATSAPP_CONFIG } from '../lib/whatsapp';

export const RealEstatePage: React.FC = () => {
  const settings = useSiteSettings();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        const data = await getProperties();
        if (isMounted) {
          setProperties(data);
        }
      } catch (err) {
        console.warn('Real estate page query notice:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const topProperties = properties.slice(0, 3);

  const pillars = [
    {
      icon: Building,
      title: 'Residential Properties',
      description: 'Luxury bungalows, independent villas, and modern duplex apartments in Rajpipla’s finest residential neighborhoods.',
    },
    {
      icon: Landmark,
      title: 'Commercial Properties',
      description: 'Prime retail showrooms, corporate suites, and highway retail hubs on M.V. Road and main commercial avenues.',
    },
    {
      icon: Trees,
      title: 'Land & NA Properties',
      description: 'Collector-approved Non-Agricultural (NA) plots, farmhouses, and strategic parcels along the Poicha & Narmada corridors.',
    },
    {
      icon: Compass,
      title: 'Investment Opportunities',
      description: 'High-growth capital appreciation land banks positioned to benefit from the expanding Statue of Unity economic zone.',
    },
  ];

  return (
    <div className="pt-24 pb-20 space-y-20 sm:space-y-28">
      {/* Hero Section */}
      <section className="bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="REAL ESTATE DIVISION"
            title="Exceptional properties. Uncompromising title verification."
            description="Helping buyers, families, and commercial investors discover prime real estate across Rajpipla and Gujarat."
            className="mb-12"
          />

          {/* Split Visual Banner */}
          <div className="rounded-2xl overflow-hidden bg-[#0A192F] text-white border border-[#1E3A5F] shadow-lg grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto min-h-[360px]">
              <VisualAsset
                type="realty"
                alt="Rajpipla Architecture and Real Estate"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-transparent to-transparent lg:hidden" />
            </div>

            <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-center space-y-6">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#E2C98D]">
                The Local Advantage
              </span>
              <h3 className="font-serif text-3xl font-bold leading-tight text-white">
                A localized perspective on property value in Rajpipla.
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Navigating local revenue records (7/12, 8A, title search reports) requires trusted boots-on-the-ground experience.
                Under the direct stewardship of Gaurav Shah, every transaction is backed by exhaustive legal scrutiny and personalized guidance.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  to="/properties"
                  className="min-h-[46px] inline-flex items-center gap-2 px-6 py-3 rounded bg-[#C5A059] hover:bg-[#D4B46C] text-[#050D1A] font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  <span>Browse Available Listings</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Real Estate Sectors */}
      <section className="bg-[#F4F2EA] py-16 sm:py-20 border-y border-[#E8E4D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#8C6E2E] block mb-2">
              SECTORS OF EXPERTISE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0A192F]">
              Tailored services for buyers, businesses &amp; investors.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-7 rounded-xl border border-[#E8E4D8] space-y-4 shadow-sm hover:border-[#C5A059] transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-[#FAF4E5] border border-[#C5A059]/40 flex items-center justify-center text-[#8C6E2E]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#0A192F]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Properties Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionHeading
            label="HANDPICKED SELECTIONS"
            title="Featured Properties in Rajpipla"
            description="Verified listings currently available for immediate ownership and registration."
            alignment="left"
            className="max-w-2xl"
          />

          <Link
            to="/properties"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0A192F] hover:text-[#8C6E2E] pb-1 border-b border-[#0A192F] transition-all"
          >
            <span>View All ({properties.length}) Properties</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <PropertyGrid
          properties={topProperties}
          loading={loading}
          emptyMessage="No properties currently available."
        />
      </section>

      {/* Advisory Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-2xl bg-[#0A192F] text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-[#1E3A5F]">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E2C98D]">
              Looking for Off-Market Land or Specific Requirements?
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Consult with {settings.founder} on custom land acquisitions.
            </h3>
            <p className="text-xs text-slate-300">
              Not all premium properties and agricultural parcels are advertised publicly.
              Contact our office for confidential mandates.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a
              href={buildWhatsAppUrl(`Hello ${WHATSAPP_CONFIG.recipientName}, I am looking for custom property/land acquisitions in Rajpipla.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[46px] px-5 py-3 rounded bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-2 shadow-xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Advisory</span>
            </a>
            <a
              href={`tel:${settings.phone}`}
              className="min-h-[46px] px-6 py-3 rounded bg-[#C5A059] text-[#050D1A] font-bold text-xs uppercase tracking-wider hover:bg-[#D4B46C] transition-colors"
            >
              Call {settings.displayPhone}
            </a>
            <Link
              to="/contact"
              className="min-h-[46px] px-6 py-3 rounded bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider border border-white/20 transition-colors"
            >
              Schedule Meeting
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
