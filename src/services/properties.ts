import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Property, PropertyType, PropertyStatus } from '../types';
import { PropertyRow, PropertyImageRow } from '../types/database';
import { extractAreaDisplay, cleanDescriptionForDisplay } from '../lib/area';

/**
 * Transforms a Supabase property row and its gallery images into the application Property model.
 */
function mapDatabaseProperty(row: PropertyRow, images: PropertyImageRow[] = []): Property {
  const typeMap: Record<string, string> = {
    residential: 'Residential Villa',
    commercial: 'Commercial Showroom',
    land: 'NA Land Plot',
    na_land: 'NA Land Plot',
    agricultural: 'Agricultural Land',
    investment: 'Estate Plot',
    other: 'Property',
  };

  const statusLabelMap: Record<string, string> = {
    Available: 'AVAILABLE',
    available: 'AVAILABLE',
    AVAILABLE: 'AVAILABLE',
    'For Sale': 'FOR SALE',
    'for sale': 'FOR SALE',
    for_sale: 'FOR SALE',
    Featured: 'FEATURED',
    featured: 'FEATURED',
    FEATURED: 'FEATURED',
    Sold: 'SOLD',
    sold: 'SOLD',
    SOLD: 'SOLD',
    Inactive: 'INACTIVE',
    inactive: 'INACTIVE',
    INACTIVE: 'INACTIVE',
  };

  // Sort images strictly by display_order ASC
  const sortedImages = [...images].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  
  const fallbackImagesByType: Record<string, string> = {
    residential: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    commercial: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    land: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    na_land: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    agricultural: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    investment: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    other: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  };

  const primaryImage =
    sortedImages[0]?.image_url ||
    fallbackImagesByType[row.property_type] ||
    fallbackImagesByType.residential;

  // Robust area display (handles single numeric or preserved range like 6500–7000 sq.ft)
  const formattedArea = extractAreaDisplay(row);
  const areaUnitStr = (row.area_unit || 'sq.ft').trim();
  const cleanDescription = cleanDescriptionForDisplay(row.description);

  // Safe price formatting
  let formattedPrice = 'Price on Request';
  if (row.price_display && String(row.price_display).trim()) {
    const pd = String(row.price_display).trim();
    formattedPrice = pd.startsWith('₹') ? pd : `₹${pd}`;
  } else if (row.price && Number(row.price) > 0) {
    const p = Number(row.price);
    formattedPrice = p >= 10000000
      ? `₹${(p / 10000000).toFixed(2)} Cr`
      : `₹${(p / 100000).toFixed(2)} Lakh`;
  }

  const cleanStatus = (row.status || 'Available').trim();

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
    status: (cleanStatus.toLowerCase().replace(/\s+/g, '_') as PropertyStatus) || 'available',
    statusLabel: statusLabelMap[cleanStatus] || cleanStatus.toUpperCase(),
    price: row.price || 0,
    formattedPrice,
    area: formattedArea,
    areaUnit: areaUnitStr,
    bedrooms: row.bedrooms ?? undefined,
    bathrooms: row.bathrooms ?? undefined,
    featured: Boolean(row.featured),
    shortDescription: (row.short_description || '').trim() || (cleanDescription.slice(0, 140) + '...'),
    fullDescription: cleanDescription || row.description,
    features: [],
    primaryImage,
    gallery: sortedImages.map((img) => ({
      id: img.id,
      url: img.image_url,
      alt: img.alt_text || row.title,
    })),
    address: `${row.location}, ${row.city || 'Rajpipla'}, Gujarat`,
    googleMapsUrl: row.google_maps_url || undefined,
    contactPhone: row.contact_phone || '9909015956',
  };
}

/**
 * Fetch all available properties from Supabase.
 * Filters to status = 'Available' (case-insensitive) as required.
 */
export async function getProperties(filter?: {
  type?: string;
  city?: string;
  featured?: boolean;
}): Promise<Property[]> {
  if (!isSupabaseConfigured()) {
    if (import.meta.env?.DEV) {
      console.warn('[properties-service] Supabase is not configured or environment variables are missing.');
    }
    throw new Error('Supabase database credentials are not configured.');
  }

  try {
    // Tolerant status match: handles 'Available', 'AVAILABLE', 'available', and any surrounding whitespace
    let query = supabase
      .from('properties')
      .select('*')
      .ilike('status', '%available%')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (filter?.type && filter.type !== 'all') {
      if (filter.type === 'land') {
        query = query.or('property_type.eq.land,property_type.eq.na_land,property_type.eq.agricultural');
      } else {
        query = query.eq('property_type', filter.type);
      }
    }
    if (filter?.city && filter.city !== 'all') {
      query = query.ilike('city', filter.city);
    }
    if (filter?.featured !== undefined) {
      query = query.eq('featured', filter.featured);
    }

    const { data, error } = await query;

    if (error) {
      if (import.meta.env?.DEV) {
        console.error('[properties-service] Supabase query failure:', {
          code: error.code,
          message: error.message,
          hint: error.hint,
        });
      }
      throw new Error(error.message || 'Failed to fetch properties from database.');
    }

    if (!data || data.length === 0) {
      if (import.meta.env?.DEV) {
        console.log('[properties-service] Query returned 0 properties.');
      }
      return [];
    }

    // Fetch gallery images for returned properties, sorted by display_order ASC
    const propertyIds = data.map((p) => p.id);
    const { data: imagesData, error: imagesError } = await supabase
      .from('property_images')
      .select('*')
      .in('property_id', propertyIds)
      .order('display_order', { ascending: true });

    if (imagesError && import.meta.env?.DEV) {
      console.warn('[properties-service] Non-fatal image fetch notice:', imagesError.message);
    }

    const imagesByProperty = (imagesData || []).reduce<Record<string, PropertyImageRow[]>>(
      (acc, img) => {
        if (!acc[img.property_id]) acc[img.property_id] = [];
        acc[img.property_id].push(img);
        return acc;
      },
      {}
    );

    const mappedProperties: Property[] = [];
    for (const row of data) {
      try {
        mappedProperties.push(mapDatabaseProperty(row, imagesByProperty[row.id] || []));
      } catch (mapErr) {
        if (import.meta.env?.DEV) {
          console.error('[properties-service] Error mapping property row id:', row.id, mapErr);
        }
      }
    }

    if (import.meta.env?.DEV) {
      console.log(`[properties-service] Successfully retrieved and mapped ${mappedProperties.length} properties.`);
    }

    return mappedProperties;
  } catch (err) {
    if (import.meta.env?.DEV) {
      console.error('[properties-service] getProperties exception:', err);
    }
    throw err;
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
