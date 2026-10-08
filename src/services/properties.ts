import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Property, PropertyType, PropertyStatus } from '../types';
import { PropertyRow, PropertyImageRow } from '../types/database';

/**
 * Transforms a Supabase property row and its gallery images into the application Property model.
 */
function mapDatabaseProperty(row: PropertyRow, images: PropertyImageRow[] = []): Property {
  const typeMap: Record<string, string> = {
    residential: 'Residential Villa',
    commercial: 'Commercial Showroom',
    land: 'NA Land Plot',
    investment: 'Estate Plot',
  };

  const statusLabelMap: Record<string, string> = {
    Available: 'AVAILABLE',
    'For Sale': 'FOR SALE',
    Featured: 'FEATURED',
    Sold: 'SOLD',
  };

  // Sort images strictly by display_order ASC
  const sortedImages = [...images].sort((a, b) => a.display_order - b.display_order);
  
  const fallbackImagesByType: Record<string, string> = {
    residential: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    commercial: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    land: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    na_land: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    agricultural: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    other: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  };

  const primaryImage =
    sortedImages[0]?.image_url ||
    fallbackImagesByType[row.property_type] ||
    fallbackImagesByType.residential;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    location: row.location,
    city: row.city || 'Rajpipla',
    district: row.district || 'Narmada',
    state: 'Gujarat',
    type: (row.property_type as PropertyType) || 'residential',
    typeLabel: typeMap[row.property_type] || row.property_type,
    listingType: row.listing_type || 'For Sale',
    status: (row.status?.toLowerCase().replace(' ', '_') as PropertyStatus) || 'available',
    statusLabel: statusLabelMap[row.status] || (row.status ? row.status.toUpperCase() : 'AVAILABLE'),
    price: row.price || 0,
    formattedPrice: row.price_display || (row.price ? `₹${(row.price / 10000000).toFixed(2)} Cr` : 'Price on Request'),
    area: row.area.includes(row.area_unit) ? row.area : `${row.area} ${row.area_unit}`,
    areaUnit: row.area_unit || 'sq.ft',
    bedrooms: row.bedrooms ?? undefined,
    bathrooms: row.bathrooms ?? undefined,
    featured: Boolean(row.featured),
    shortDescription: row.short_description || row.description.slice(0, 140) + '...',
    fullDescription: row.description,
    features: [
      'Collector Approved Clear NA / Legal Title',
      'Direct Frontage with Paved Access Road',
      'Electricity Grid & Water Connectivity Available',
      'Immediate Registry & Mutation Support',
    ],
    primaryImage,
    gallery: sortedImages.map((img) => ({
      id: img.id,
      url: img.image_url,
      alt: img.alt_text || row.title,
    })),
    address: `${row.location}, ${row.city}, Gujarat`,
    googleMapsUrl: row.google_maps_url || undefined,
    contactPhone: row.contact_phone || '9909015956',
  };
}

/**
 * Fetch all available properties from Supabase.
 * Filters to status = 'Available' as required.
 */
export async function getProperties(filter?: {
  type?: string;
  city?: string;
  featured?: boolean;
}): Promise<Property[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    let query = supabase
      .from('properties')
      .select('*')
      .eq('status', 'Available')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (filter?.type && filter.type !== 'all') {
      query = query.eq('property_type', filter.type);
    }
    if (filter?.city) {
      query = query.ilike('city', filter.city);
    }
    if (filter?.featured !== undefined) {
      query = query.eq('featured', filter.featured);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return [];
    }

    // Fetch images for returned properties, sorted by display_order ASC
    const propertyIds = data.map((p) => p.id);
    const { data: imagesData } = await supabase
      .from('property_images')
      .select('*')
      .in('property_id', propertyIds)
      .order('display_order', { ascending: true });

    const imagesByProperty = (imagesData || []).reduce<Record<string, PropertyImageRow[]>>(
      (acc, img) => {
        if (!acc[img.property_id]) acc[img.property_id] = [];
        acc[img.property_id].push(img);
        return acc;
      },
      {}
    );

    return data.map((row) => mapDatabaseProperty(row, imagesByProperty[row.id] || []));
  } catch (err) {
    console.warn('Supabase getProperties notice:', err);
    return [];
  }
}

/**
 * Fetch featured properties for homepage showcase (status = 'Available', featured = true).
 */
export async function getFeaturedProperties(): Promise<Property[]> {
  return getProperties({ featured: true });
}

/**
 * Fetch properties filtered by property type.
 */
export async function getPropertiesByType(type: string): Promise<Property[]> {
  return getProperties({ type });
}

/**
 * Fetch properties filtered by city.
 */
export async function getPropertiesByCity(city: string): Promise<Property[]> {
  return getProperties({ city });
}

/**
 * Fetch a single property by slug (or fallback id).
 */
export async function getPropertyBySlug(slugOrId: string): Promise<Property | null> {
  if (!slugOrId) return null;

  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);

    let query = supabase.from('properties').select('*').limit(1);
    if (isUuid) {
      query = query.or(`id.eq.${slugOrId},slug.eq.${slugOrId}`);
    } else {
      query = query.eq('slug', slugOrId);
    }

    const { data, error } = await query.maybeSingle();

    if (error || !data) {
      return null;
    }

    // Fetch images sorted by display_order ASC
    const { data: images } = await supabase
      .from('property_images')
      .select('*')
      .eq('property_id', data.id)
      .order('display_order', { ascending: true });

    return mapDatabaseProperty(data, images || []);
  } catch (err) {
    console.warn('Supabase getPropertyBySlug notice:', err);
    return null;
  }
}
