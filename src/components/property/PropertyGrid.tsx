import React from 'react';
import { Property } from '../../types';
import { PropertyCard } from './PropertyCard';
import { PropertyCardSkeleton } from '../common/SkeletonLoader';
import { EmptyState } from '../common/EmptyState';

interface PropertyGridProps {
  properties: Property[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({
  properties,
  loading = false,
  emptyMessage,
  className = '',
}) => {
  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 ${className}`}>
        <PropertyCardSkeleton />
        <PropertyCardSkeleton />
        <PropertyCardSkeleton />
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="py-8">
        <EmptyState type="properties" customMessage={emptyMessage} />
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 ${className}`}
    >
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};
