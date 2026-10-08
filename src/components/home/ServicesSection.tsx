import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { VisualAsset } from '../common/VisualAsset';
import { EmptyState } from '../common/EmptyState';
import { getServices } from '../../services/settings';
import { ServiceRow } from '../../types/database';

export const ServicesSection: React.FC = () => {
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        const data = await getServices();
        if (isMounted) {
          setServices(data);
        }
      } catch (err) {
        console.warn('Services fetch notice:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const getDivisionDetails = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('estate') || cat.includes('property')) {
      return {
        ctaText: 'Explore Properties',
        ctaLink: '/properties',
        assetType: 'realty' as const,
      };
    }
    if (cat.includes('insur')) {
      return {
        ctaText: 'Explore Insurance',
        ctaLink: '/insurance',
        assetType: 'insurance' as const,
      };
    }
    if (cat.includes('finan') || cat.includes('loan')) {
      return {
        ctaText: 'Explore Finance',
        ctaLink: '/finance',
        assetType: 'finance' as const,
      };
    }
    return {
      ctaText: 'Enquire Now',
      ctaLink: '/contact',
      assetType: 'hero' as const,
    };
  };

  return (
    <section className="py-20 sm:py-28 bg-[#FAF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <SectionHeading
          label="WHAT WE DO"
          title="Solutions for every important decision."
          description="Three pillars of enduring prosperity brought together under one roof, guided by personalized local expertise."
          className="mb-14 sm:mb-18"
        />

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl h-96 border border-[#E8E4D8] animate-pulse" />
            <div className="bg-white rounded-xl h-96 border border-[#E8E4D8] animate-pulse" />
            <div className="bg-white rounded-xl h-96 border border-[#E8E4D8] animate-pulse" />
          </div>
        ) : services.length === 0 ? (
          <EmptyState
            type="custom"
            customMessage="No services currently available."
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const details = getDivisionDetails(service.category);
              return (
                <div
                  key={service.id}
                  className="group bg-white rounded-xl overflow-hidden border border-[#E8E4D8] hover:border-[#C5A059] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Visual Header */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#0A192F]">
                      {service.image_url ? (
                        <img
                          src={service.image_url}
                          alt={service.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <VisualAsset
                          type={details.assetType}
                          alt={service.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                      {/* Division Badge */}
                      <div className="absolute bottom-4 left-4">
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded bg-[#0A192F]/90 text-[#E2C98D] border border-[#C5A059]/40 backdrop-blur-sm">
                          {service.category}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 sm:p-8 space-y-6">
                      <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A192F] whitespace-pre-line leading-tight group-hover:text-[#8C6E2E] transition-colors">
                        {service.title}
                      </h3>

                      <p className="text-sm text-slate-600 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer CTA */}
                  <div className="p-6 sm:p-8 pt-0">
                    <Link
                      to={details.ctaLink}
                      className="w-full min-h-[46px] inline-flex items-center justify-between px-5 py-3 rounded bg-[#FAF9F5] hover:bg-[#0A192F] text-[#0A192F] hover:text-[#E2C98D] border border-[#E8E4D8] hover:border-[#0A192F] text-xs font-semibold uppercase tracking-wider transition-all duration-200 group-hover:bg-[#0A192F] group-hover:text-[#E2C98D]"
                    >
                      <span>{details.ctaText}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
