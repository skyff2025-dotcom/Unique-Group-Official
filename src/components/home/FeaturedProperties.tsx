import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { PropertyGrid } from '../property/PropertyGrid';
import { getFeaturedProperties } from '../../services/properties';
import { Property } from '../../types';

export const FeaturedProperties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadProperties() {
      try {
        setLoading(true);
        const data = await getFeaturedProperties();
        if (isMounted) {
          setProperties(data.slice(0, 3));
        }
      } catch (err) {
        console.warn('Could not load featured properties:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadProperties();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-20 sm:py-28 bg-[#F4F2EA] border-t border-[#E8E4D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <SectionHeading
            label="FEATURED PROPERTIES"
            title="Properties worth looking at twice."
            description="Explore selected properties and opportunities across Rajpipla and surrounding areas."
            alignment="left"
            className="max-w-2xl"
          />

          <Link
            to="/properties"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0A192F] hover:text-[#8C6E2E] pb-1 border-b border-[#0A192F] hover:border-[#8C6E2E] transition-all whitespace-nowrap self-start md:self-end"
          >
            <span>View All Listings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <PropertyGrid
          properties={properties}
          loading={loading}
          emptyMessage="No featured properties currently available."
        />
      </div>
    </section>
  );
};
