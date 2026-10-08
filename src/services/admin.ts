import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { clearSettingsCache } from './settings';
import {
  PropertyRow,
  PropertyInsert,
  PropertyUpdate,
  PropertyImageRow,
  InsuranceCompanyRow,
  InsuranceCompanyInsert,
  InsuranceCompanyUpdate,
  InsurancePlanRow,
  InsurancePlanInsert,
  InsurancePlanUpdate,
  FinanceCompanyRow,
  FinanceCompanyInsert,
  FinanceCompanyUpdate,
  FinanceServiceRow,
  FinanceServiceInsert,
  FinanceServiceUpdate,
  EnquiryRow,
  SiteSettingsRow,
  SiteSettingsUpdate,
  TestimonialRow,
  TestimonialInsert,
  TestimonialUpdate,
} from '../types/database';

export interface DashboardStats {
  totalProperties: number;
  availableProperties: number;
  insuranceCompanies: number;
  financeCompanies: number;
  newEnquiries: number;
}

export interface AdminPropertyWithImages extends PropertyRow {
  property_images?: PropertyImageRow[];
  primary_image_url?: string;
}

// -------------------------------------------------------------
// DASHBOARD
// -------------------------------------------------------------

export async function getDashboardStats(): Promise<DashboardStats> {
  const fallback: DashboardStats = {
    totalProperties: 0,
    availableProperties: 0,
    insuranceCompanies: 0,
    financeCompanies: 0,
    newEnquiries: 0,
  };

  if (!isSupabaseConfigured()) return fallback;

  try {
    const [
      totalPropsRes,
      availPropsRes,
      insCompRes,
      finCompRes,
      newEnqRes,
    ] = await Promise.all([
      supabase.from('properties').select('*', { count: 'exact', head: true }),
      supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'Available'),
      supabase.from('insurance_companies').select('*', { count: 'exact', head: true }),
      supabase.from('finance_companies').select('*', { count: 'exact', head: true }),
      supabase.from('enquiries').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    ]);

    return {
      totalProperties: totalPropsRes.count ?? 0,
      availableProperties: availPropsRes.count ?? 0,
      insuranceCompanies: insCompRes.count ?? 0,
      financeCompanies: finCompRes.count ?? 0,
      newEnquiries: newEnqRes.count ?? 0,
    };
  } catch (err) {
    console.warn('Dashboard stats error:', err);
    return fallback;
  }
}

export async function getRecentEnquiries(limit = 5): Promise<EnquiryRow[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error || !data) return [];
    return data;
  } catch (err) {
    console.warn('Recent enquiries error:', err);
    return [];
  }
}

export async function checkSlugUnique(slug: string, excludePropertyId?: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !slug.trim()) return true;

  try {
    let query = supabase.from('properties').select('id').eq('slug', slug.trim());
    if (excludePropertyId) {
      query = query.neq('id', excludePropertyId);
    }
    const { data, error } = await query;
    if (error) return true;
    return !data || data.length === 0;
  } catch (err) {
    return true;
  }
}

export async function addPropertyImageByUrl(
  propertyId: string,
  imageUrl: string,
  displayOrder = 0,
  altText?: string
): Promise<{ data: PropertyImageRow | null; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: 'Database is not configured.' };
  }

  try {
    const { data, error } = await supabase
      .from('property_images')
      .insert([
        {
          property_id: propertyId,
          image_url: imageUrl.trim(),
          storage_path: null,
          alt_text: altText || 'Property Image',
          display_order: displayOrder,
        },
      ])
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }
    return { data };
  } catch (err: any) {
    return { data: null, error: err.message || 'Failed to add image URL.' };
  }
}

// -------------------------------------------------------------
// REAL ESTATE (PROPERTIES)
// -------------------------------------------------------------

export async function getAdminProperties(filters?: {
  search?: string;
  status?: string;
  propertyType?: string;
  listingType?: string;
  city?: string;
  featured?: 'all' | 'featured' | 'not_featured';
  sortBy?: 'newest' | 'oldest' | 'featured';
}): Promise<AdminPropertyWithImages[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    let query = supabase.from('properties').select('*, property_images(*)');

    if (filters?.search?.trim()) {
      const q = `%${filters.search.trim()}%`;
      query = query.or(`title.ilike.${q},location.ilike.${q},city.ilike.${q},property_type.ilike.${q}`);
    }

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters?.propertyType && filters.propertyType !== 'all') {
      query = query.ilike('property_type', `%${filters.propertyType}%`);
    }

    if (filters?.listingType && filters.listingType !== 'all') {
      query = query.eq('listing_type', filters.listingType);
    }

    if (filters?.city && filters.city !== 'all') {
      query = query.ilike('city', filters.city);
    }

    if (filters?.featured === 'featured') {
      query = query.eq('featured', true);
    } else if (filters?.featured === 'not_featured') {
      query = query.eq('featured', false);
    }

    if (filters?.sortBy === 'oldest') {
      query = query.order('created_at', { ascending: true });
    } else if (filters?.sortBy === 'featured') {
      query = query.order('featured', { ascending: false }).order('created_at', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;
    if (error || !data) {
      console.warn('Admin properties fetch error:', error?.message);
      return [];
    }

    return data.map((prop) => {
      const sortedImages = ((prop.property_images as PropertyImageRow[]) || []).sort(
        (a, b) => a.display_order - b.display_order
      );
      return {
        ...prop,
        property_images: sortedImages,
        primary_image_url: sortedImages[0]?.image_url,
      };
    });
  } catch (err) {
    console.warn('Admin properties exception:', err);
    return [];
  }
}

export async function getAdminPropertyById(id: string): Promise<AdminPropertyWithImages | null> {
  if (!isSupabaseConfigured() || !id) return null;

  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*, property_images(*)')
      .eq('id', id)
      .single();

    if (error || !data) return null;

    const sortedImages = ((data.property_images as PropertyImageRow[]) || []).sort(
      (a, b) => a.display_order - b.display_order
    );

    return {
      ...data,
      property_images: sortedImages,
      primary_image_url: sortedImages[0]?.image_url,
    };
  } catch (err) {
    return null;
  }
}

export async function createProperty(payload: PropertyInsert): Promise<{ data: PropertyRow | null; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: 'Database is not configured.' };
  }

  try {
    const { data, error } = await supabase
      .from('properties')
      .insert([payload])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return { data: null, error: 'A property with this URL slug already exists. Please choose a unique slug.' };
      }
      return { data: null, error: 'Failed to create property record. Please check the provided information.' };
    }

    return { data };
  } catch (err) {
    return { data: null, error: 'An unexpected error occurred while creating the property.' };
  }
}

export async function updateProperty(
  id: string,
  payload: PropertyUpdate
): Promise<{ data: PropertyRow | null; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: 'Database is not configured.' };
  }

  try {
    const { data, error } = await supabase
      .from('properties')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return { data: null, error: 'A property with this URL slug already exists. Please choose a unique slug.' };
      }
      return { data: null, error: 'Failed to update property details. Please try again.' };
    }

    return { data };
  } catch (err) {
    return { data: null, error: 'An unexpected error occurred while updating the property.' };
  }
}

export async function deleteProperty(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: false, error: 'Database is not configured.' };

  try {
    // 1. Fetch images to clean up storage if paths exist
    const { data: images } = await supabase
      .from('property_images')
      .select('storage_path')
      .eq('property_id', id);

    if (images && images.length > 0) {
      const storagePaths = images
        .map((img) => img.storage_path)
        .filter((p): p is string => Boolean(p));

      if (storagePaths.length > 0) {
        await supabase.storage.from('property-images').remove(storagePaths);
      }
    }

    // 2. Delete property record (cascades or deletes images via FK)
    await supabase.from('property_images').delete().eq('property_id', id);
    const { error } = await supabase.from('properties').delete().eq('id', id);

    if (error) {
      return { success: false, error: 'Failed to delete property. Please ensure you have permission.' };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: 'An error occurred while deleting the property.' };
  }
}

// -------------------------------------------------------------
// PROPERTY IMAGES & STORAGE
// -------------------------------------------------------------

export async function uploadPropertyImage(
  propertyId: string,
  file: File,
  displayOrder = 0,
  altText?: string
): Promise<{ data: PropertyImageRow | null; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: 'Storage is not configured.' };
  }

  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (!validTypes.includes(file.type)) {
    return { data: null, error: 'Please upload only JPEG, PNG, or WebP images.' };
  }

  // Validate size (max 8MB)
  if (file.size > 8 * 1024 * 1024) {
    return { data: null, error: 'Image file size must be less than 8MB.' };
  }

  try {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const storagePath = `${propertyId}/${fileName}`;

    // Upload to 'property-images' bucket
    const { error: uploadError } = await supabase.storage
      .from('property-images')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.warn('Storage upload error:', uploadError.message);
      return { data: null, error: 'Failed to upload image file to storage. Ensure bucket exists and has correct permissions.' };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('property-images')
      .getPublicUrl(storagePath);

    const imageUrl = urlData.publicUrl;

    // Record in database
    const { data: dbData, error: dbError } = await supabase
      .from('property_images')
      .insert([
        {
          property_id: propertyId,
          image_url: imageUrl,
          storage_path: storagePath,
          alt_text: altText || file.name,
          display_order: displayOrder,
        },
      ])
      .select()
      .single();

    if (dbError) {
      // rollback storage if db insert failed
      await supabase.storage.from('property-images').remove([storagePath]);
      return { data: null, error: 'Failed to register image in database.' };
    }

    return { data: dbData };
  } catch (err) {
    return { data: null, error: 'An unexpected error occurred during image upload.' };
  }
}

export async function deletePropertyImage(
  imageId: string,
  storagePath: string | null
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: false, error: 'Database is not configured.' };

  try {
    if (storagePath) {
      await supabase.storage.from('property-images').remove([storagePath]);
    }

    const { error } = await supabase
      .from('property_images')
      .delete()
      .eq('id', imageId);

    if (error) {
      return { success: false, error: 'Failed to delete image record.' };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: 'An error occurred while deleting the image.' };
  }
}

export async function updateImageOrder(
  images: { id: string; display_order: number }[]
): Promise<boolean> {
  if (!isSupabaseConfigured() || images.length === 0) return false;

  try {
    await Promise.all(
      images.map((img) =>
        supabase
          .from('property_images')
          .update({ display_order: img.display_order })
          .eq('id', img.id)
      )
    );
    return true;
  } catch (err) {
    console.warn('Reorder images error:', err);
    return false;
  }
}

// -------------------------------------------------------------
// INSURANCE MANAGEMENT
// -------------------------------------------------------------

export interface InsuranceCompanyWithPlanCount extends InsuranceCompanyRow {
  plans_count?: number;
}

export async function getAdminInsuranceCompanies(): Promise<InsuranceCompanyWithPlanCount[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const { data: companies, error: compError } = await supabase
      .from('insurance_companies')
      .select('*')
      .order('name', { ascending: true });

    if (compError || !companies) return [];

    // Fetch plan counts
    const { data: plans } = await supabase
      .from('insurance_plans')
      .select('company_id');

    const counts: Record<string, number> = {};
    if (plans) {
      plans.forEach((p) => {
        counts[p.company_id] = (counts[p.company_id] || 0) + 1;
      });
    }

    return companies.map((c) => ({
      ...c,
      plans_count: counts[c.id] || 0,
    }));
  } catch (err) {
    return [];
  }
}

export async function getAdminInsuranceCompanyById(id: string): Promise<InsuranceCompanyRow | null> {
  if (!isSupabaseConfigured() || !id) return null;

  try {
    const { data, error } = await supabase
      .from('insurance_companies')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return data;
  } catch (err) {
    return null;
  }
}

export async function checkCompanySlugUnique(slug: string, excludeId?: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !slug.trim()) return true;

  try {
    let query = supabase.from('insurance_companies').select('id').eq('slug', slug.trim());
    if (excludeId) {
      query = query.neq('id', excludeId);
    }
    const { data, error } = await query;
    if (error) return true;
    return !data || data.length === 0;
  } catch (err) {
    return true;
  }
}

export async function toggleInsuranceCompanyActive(id: string, active: boolean): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const { error } = await supabase
      .from('insurance_companies')
      .update({ active, updated_at: new Date().toISOString() })
      .eq('id', id);

    return !error;
  } catch {
    return false;
  }
}

export async function uploadInsuranceLogo(
  file: File,
  slug: string
): Promise<{ url: string | null; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { url: null, error: 'Database storage is not configured.' };
  }

  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (!validTypes.includes(file.type)) {
    return { url: null, error: 'Please upload only JPG, JPEG, PNG, or WEBP images.' };
  }

  // Validate size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { url: null, error: 'Logo file size must be less than 5MB.' };
  }

  try {
    const fileExt = file.name.split('.').pop() || 'png';
    const fileName = `${slug || 'logo'}-${Date.now()}.${fileExt}`;
    const storagePath = `logos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('insurance-logos')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.warn('Storage bucket insurance-logos upload failed:', uploadError.message);
      // Fallback: If insurance-logos bucket is missing or restricted, try property-images bucket or data URL
      const { error: fallbackError } = await supabase.storage
        .from('property-images')
        .upload(`insurance-logos/${fileName}`, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (!fallbackError) {
        const { data: fallbackUrl } = supabase.storage
          .from('property-images')
          .getPublicUrl(`insurance-logos/${fileName}`);
        return { url: fallbackUrl.publicUrl };
      }

      return { url: null, error: 'Failed to upload logo image to storage bucket.' };
    }

    const { data: urlData } = supabase.storage
      .from('insurance-logos')
      .getPublicUrl(storagePath);

    return { url: urlData.publicUrl };
  } catch (err: any) {
    return { url: null, error: err.message || 'An error occurred while uploading logo.' };
  }
}

export async function createInsuranceCompany(
  payload: InsuranceCompanyInsert
): Promise<{ data: InsuranceCompanyRow | null; error?: string }> {
  if (!isSupabaseConfigured()) return { data: null, error: 'Database not available.' };

  try {
    const { data, error } = await supabase
      .from('insurance_companies')
      .insert([payload])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return { data: null, error: 'An insurance company with this URL slug already exists.' };
      }
      return { data: null, error: 'Failed to create insurance company. Check required fields.' };
    }
    return { data };
  } catch (err) {
    return { data: null, error: 'An unexpected error occurred.' };
  }
}

export async function updateInsuranceCompany(
  id: string,
  payload: InsuranceCompanyUpdate
): Promise<{ data: InsuranceCompanyRow | null; error?: string }> {
  if (!isSupabaseConfigured()) return { data: null, error: 'Database not available.' };

  try {
    const { data, error } = await supabase
      .from('insurance_companies')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return { data: null, error: 'An insurance company with this URL slug already exists.' };
      }
      return { data: null, error: 'Failed to update company.' };
    }
    return { data };
  } catch (err) {
    return { data: null, error: 'An unexpected error occurred.' };
  }
}

export async function getCompanyPlansCount(companyId: string): Promise<number> {
  if (!isSupabaseConfigured() || !companyId) return 0;
  try {
    const { count, error } = await supabase
      .from('insurance_plans')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId);

    if (error || count === null) return 0;
    return count;
  } catch {
    return 0;
  }
}

export async function deleteInsuranceCompany(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: false, error: 'Database not available.' };

  try {
    // Delete associated plans first to avoid FK constraint issues
    await supabase.from('insurance_plans').delete().eq('company_id', id);
    const { error } = await supabase.from('insurance_companies').delete().eq('id', id);

    if (error) return { success: false, error: 'Failed to delete insurance company.' };
    return { success: true };
  } catch (err) {
    return { success: false, error: 'An error occurred while deleting.' };
  }
}

export async function getAdminInsurancePlans(filters?: {
  companyId?: string;
  category?: string;
  status?: string;
  search?: string;
}): Promise<
  (InsurancePlanRow & { insurance_companies?: { name: string } | null })[]
> {
  if (!isSupabaseConfigured()) return [];

  try {
    let query = supabase
      .from('insurance_plans')
      .select('*, insurance_companies(name)')
      .order('name', { ascending: true });

    if (filters?.companyId && filters.companyId !== 'all') {
      query = query.eq('company_id', filters.companyId);
    }

    if (filters?.category && filters.category !== 'all') {
      query = query.ilike('category', filters.category);
    }

    if (filters?.status && filters.status !== 'all') {
      const isActive = filters.status === 'active';
      query = query.eq('active', isActive);
    }

    if (filters?.search?.trim()) {
      const q = `%${filters.search.trim()}%`;
      query = query.or(`name.ilike.${q},category.ilike.${q},short_description.ilike.${q}`);
    }

    const { data, error } = await query;
    if (error || !data) return [];
    return data as any;
  } catch (err) {
    return [];
  }
}

export async function getAdminInsurancePlanById(id: string): Promise<
  (InsurancePlanRow & { insurance_companies?: { name: string; active: boolean } | null }) | null
> {
  if (!isSupabaseConfigured() || !id) return null;

  try {
    const { data, error } = await supabase
      .from('insurance_plans')
      .select('*, insurance_companies(name, active)')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return data as any;
  } catch {
    return null;
  }
}

export async function checkPlanSlugUnique(slug: string, excludeId?: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !slug.trim()) return true;

  try {
    let query = supabase.from('insurance_plans').select('id').eq('slug', slug.trim());
    if (excludeId) {
      query = query.neq('id', excludeId);
    }
    const { data, error } = await query;
    if (error) return true;
    return !data || data.length === 0;
  } catch {
    return true;
  }
}

export async function toggleInsurancePlanActive(id: string, active: boolean): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const { error } = await supabase
      .from('insurance_plans')
      .update({ active, updated_at: new Date().toISOString() })
      .eq('id', id);

    return !error;
  } catch {
    return false;
  }
}

export async function createInsurancePlan(
  payload: InsurancePlanInsert
): Promise<{ data: InsurancePlanRow | null; error?: string }> {
  if (!isSupabaseConfigured()) return { data: null, error: 'Database not available.' };

  try {
    const { data, error } = await supabase
      .from('insurance_plans')
      .insert([payload])
      .select()
      .single();

    if (error) return { data: null, error: 'Failed to create insurance plan.' };
    return { data };
  } catch (err) {
    return { data: null, error: 'An unexpected error occurred.' };
  }
}

export async function updateInsurancePlan(
  id: string,
  payload: InsurancePlanUpdate
): Promise<{ data: InsurancePlanRow | null; error?: string }> {
  if (!isSupabaseConfigured()) return { data: null, error: 'Database not available.' };

  try {
    const { data, error } = await supabase
      .from('insurance_plans')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error: 'Failed to update plan.' };
    return { data };
  } catch (err) {
    return { data: null, error: 'An unexpected error occurred.' };
  }
}

export async function deleteInsurancePlan(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: false, error: 'Database not available.' };

  try {
    const { error } = await supabase.from('insurance_plans').delete().eq('id', id);
    if (error) return { success: false, error: 'Failed to delete plan.' };
    return { success: true };
  } catch (err) {
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

// -------------------------------------------------------------
// FINANCE MANAGEMENT
// -------------------------------------------------------------

export async function getAdminFinanceCompanies(): Promise<FinanceCompanyRow[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const { data, error } = await supabase
      .from('finance_companies')
      .select('*')
      .order('name', { ascending: true });

    if (error || !data) return [];
    return data;
  } catch (err) {
    return [];
  }
}

export async function createFinanceCompany(
  payload: FinanceCompanyInsert
): Promise<{ data: FinanceCompanyRow | null; error?: string }> {
  if (!isSupabaseConfigured()) return { data: null, error: 'Database not available.' };

  try {
    const { data, error } = await supabase
      .from('finance_companies')
      .insert([payload])
      .select()
      .single();

    if (error) return { data: null, error: 'Failed to create finance company.' };
    return { data };
  } catch (err) {
    return { data: null, error: 'An unexpected error occurred.' };
  }
}

export async function updateFinanceCompany(
  id: string,
  payload: FinanceCompanyUpdate
): Promise<{ data: FinanceCompanyRow | null; error?: string }> {
  if (!isSupabaseConfigured()) return { data: null, error: 'Database not available.' };

  try {
    const { data, error } = await supabase
      .from('finance_companies')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error: 'Failed to update finance company.' };
    return { data };
  } catch (err) {
    return { data: null, error: 'An unexpected error occurred.' };
  }
}

export async function deleteFinanceCompany(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: false, error: 'Database not available.' };

  try {
    await supabase.from('finance_services').delete().eq('company_id', id);
    const { error } = await supabase.from('finance_companies').delete().eq('id', id);

    if (error) return { success: false, error: 'Failed to delete finance company.' };
    return { success: true };
  } catch (err) {
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function getAdminFinanceServices(companyId?: string): Promise<
  (FinanceServiceRow & { finance_companies?: { name: string } | null })[]
> {
  if (!isSupabaseConfigured()) return [];

  try {
    let query = supabase
      .from('finance_services')
      .select('*, finance_companies(name)')
      .order('name', { ascending: true });

    if (companyId && companyId !== 'all') {
      query = query.eq('company_id', companyId);
    }

    const { data, error } = await query;
    if (error || !data) return [];
    return data as any;
  } catch (err) {
    return [];
  }
}

export async function createFinanceService(
  payload: FinanceServiceInsert
): Promise<{ data: FinanceServiceRow | null; error?: string }> {
  if (!isSupabaseConfigured()) return { data: null, error: 'Database not available.' };

  try {
    const { data, error } = await supabase
      .from('finance_services')
      .insert([payload])
      .select()
      .single();

    if (error) return { data: null, error: 'Failed to create financial service.' };
    return { data };
  } catch (err) {
    return { data: null, error: 'An unexpected error occurred.' };
  }
}

export async function updateFinanceService(
  id: string,
  payload: FinanceServiceUpdate
): Promise<{ data: FinanceServiceRow | null; error?: string }> {
  if (!isSupabaseConfigured()) return { data: null, error: 'Database not available.' };

  try {
    const { data, error } = await supabase
      .from('finance_services')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error: 'Failed to update service.' };
    return { data };
  } catch (err) {
    return { data: null, error: 'An unexpected error occurred.' };
  }
}

export async function deleteFinanceService(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: false, error: 'Database not available.' };

  try {
    const { error } = await supabase.from('finance_services').delete().eq('id', id);
    if (error) return { success: false, error: 'Failed to delete service.' };
    return { success: true };
  } catch (err) {
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

// -------------------------------------------------------------
// ENQUIRY MANAGEMENT
// -------------------------------------------------------------

export async function getAdminEnquiries(filters?: {
  serviceType?: string;
  status?: string;
  search?: string;
}): Promise<
  (EnquiryRow & {
    properties?: { title: string; slug: string } | null;
    insurance_plans?: { name: string } | null;
    finance_services?: { name: string } | null;
  })[]
> {
  if (!isSupabaseConfigured()) return [];

  try {
    let query = supabase
      .from('enquiries')
      .select('*, properties(title, slug), insurance_plans(name), finance_services(name)')
      .order('created_at', { ascending: false });

    if (filters?.serviceType && filters.serviceType !== 'all') {
      const st = filters.serviceType.toLowerCase();
      if (st.includes('estate') || st.includes('property')) {
        query = query.in('service_type', ['Real Estate', 'real_estate', 'realestate', 'Real_Estate']);
      } else if (st.includes('insur')) {
        query = query.in('service_type', ['Insurance', 'insurance']);
      } else if (st.includes('finan') || st.includes('loan')) {
        query = query.in('service_type', ['Finance', 'finance']);
      } else if (st.includes('general')) {
        query = query.in('service_type', ['General Enquiry', 'General', 'general', 'general_enquiry']);
      } else {
        query = query.eq('service_type', filters.serviceType);
      }
    }

    if (filters?.status && filters.status !== 'all') {
      const st = filters.status.toLowerCase().replace(' ', '_');
      if (st === 'new') {
        query = query.in('status', ['new', 'New']);
      } else if (st === 'contacted') {
        query = query.in('status', ['contacted', 'Contacted']);
      } else if (st === 'in_progress') {
        query = query.in('status', ['in_progress', 'In Progress', 'in progress']);
      } else if (st === 'completed') {
        query = query.in('status', ['completed', 'Completed']);
      } else if (st === 'closed') {
        query = query.in('status', ['closed', 'Closed']);
      } else {
        query = query.eq('status', filters.status);
      }
    }

    if (filters?.search?.trim()) {
      const q = `%${filters.search.trim()}%`;
      query = query.or(`name.ilike.${q},phone.ilike.${q},email.ilike.${q}`);
    }

    const { data, error } = await query;
    if (error || !data) return [];
    return data as any;
  } catch (err) {
    return [];
  }
}

export async function updateEnquiryStatus(
  id: string,
  status: string
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: false, error: 'Database not available.' };

  try {
    const { error } = await supabase
      .from('enquiries')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) return { success: false, error: 'Failed to update enquiry status.' };
    return { success: true };
  } catch (err) {
    return { success: false, error: 'An error occurred while updating status.' };
  }
}

export async function deleteEnquiry(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: false, error: 'Database not available.' };

  try {
    const { error } = await supabase.from('enquiries').delete().eq('id', id);
    if (error) return { success: false, error: 'Failed to delete enquiry.' };
    return { success: true };
  } catch (err) {
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

// -------------------------------------------------------------
// SITE SETTINGS
// -------------------------------------------------------------

export async function getAdminSiteSettings(): Promise<SiteSettingsRow | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;
    return data;
  } catch (err) {
    return null;
  }
}

export async function updateSiteSettings(
  settings: SiteSettingsUpdate
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: false, error: 'Database not available.' };

  try {
    // Check if a row already exists
    const existing = await getAdminSiteSettings();

    if (existing) {
      const { error } = await supabase
        .from('site_settings')
        .update({ ...settings, updated_at: new Date().toISOString() })
        .eq('id', existing.id);

      if (error) return { success: false, error: 'Failed to update site settings.' };
    } else {
      const { error } = await supabase
        .from('site_settings')
        .insert([
          {
            business_name: settings.business_name || 'UNIQUE GROUP',
            tagline: settings.tagline || 'Trust • Protection • Growth',
            phone: settings.phone || '9909015956',
            whatsapp: settings.whatsapp || null,
            email: settings.email || null,
            address: settings.address || 'Vraj Avenue, B-12, M.V. Road, Rajpipla, Gujarat',
            google_maps_url: settings.google_maps_url,
            instagram_url: settings.instagram_url,
            facebook_url: settings.facebook_url,
            logo_url: settings.logo_url,
          },
        ]);

      if (error) return { success: false, error: 'Failed to create site settings.' };
    }

    clearSettingsCache();
    // Dispatch a window event so SiteSettingsContext can re-sync across components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('site_settings_updated'));
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: 'An error occurred while saving site settings.' };
  }
}

// -------------------------------------------------------------
// TESTIMONIALS
// -------------------------------------------------------------

export async function getAdminTestimonials(): Promise<TestimonialRow[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data) return [];
    return data;
  } catch (err) {
    return [];
  }
}

export async function createTestimonial(
  payload: TestimonialInsert
): Promise<{ data: TestimonialRow | null; error?: string }> {
  if (!isSupabaseConfigured()) return { data: null, error: 'Database not available.' };

  try {
    const { data, error } = await supabase
      .from('testimonials')
      .insert([payload])
      .select()
      .single();

    if (error) return { data: null, error: 'Failed to add testimonial.' };
    return { data };
  } catch (err) {
    return { data: null, error: 'An error occurred.' };
  }
}

export async function updateTestimonial(
  id: string,
  payload: TestimonialUpdate
): Promise<{ data: TestimonialRow | null; error?: string }> {
  if (!isSupabaseConfigured()) return { data: null, error: 'Database not available.' };

  try {
    const { data, error } = await supabase
      .from('testimonials')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error: 'Failed to update testimonial.' };
    return { data };
  } catch (err) {
    return { data: null, error: 'An error occurred.' };
  }
}

export async function deleteTestimonial(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: false, error: 'Database not available.' };

  try {
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) return { success: false, error: 'Failed to delete testimonial.' };
    return { success: true };
  } catch (err) {
    return { success: false, error: 'An error occurred.' };
  }
}
