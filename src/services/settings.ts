import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ContactInfo, Testimonial } from '../types';
import { ServiceRow } from '../types/database';
import { BUSINESS_CONTACT } from '../data/mockData';

let cachedSettings: ContactInfo | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 60000; // 60 seconds

export function clearSettingsCache(): void {
  cachedSettings = null;
  lastFetchTime = 0;
}

export async function getSiteSettings(forceRefresh = false): Promise<ContactInfo> {
  const now = Date.now();
  if (!forceRefresh && cachedSettings && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedSettings;
  }

  if (!isSupabaseConfigured()) {
    cachedSettings = BUSINESS_CONTACT;
    lastFetchTime = now;
    return BUSINESS_CONTACT;
  }

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      cachedSettings = BUSINESS_CONTACT;
      lastFetchTime = now;
      return BUSINESS_CONTACT;
    }

    const rawPhone = data.phone || BUSINESS_CONTACT.phone;
    const cleanDigits = rawPhone.replace(/\D/g, '');
    const displayPhone =
      cleanDigits.length === 10
        ? `+91 ${cleanDigits.slice(0, 5)} ${cleanDigits.slice(5)}`
        : rawPhone.startsWith('+')
        ? rawPhone
        : `+91 ${rawPhone}`;

    const rawAddress = data.address || BUSINESS_CONTACT.address || 'Vraj Avenue, B-12, M.V. Road, Rajpipla, Gujarat';
    const addressParts = rawAddress.split(',').map((p) => p.trim()).filter(Boolean);
    const addressLine1 = addressParts.length > 1 ? `${addressParts[0]}, ${addressParts[1]}` : addressParts[0] || BUSINESS_CONTACT.addressLine1;
    const addressLine2 = addressParts.length > 2 ? addressParts.slice(2).join(', ') : addressParts[1] || BUSINESS_CONTACT.addressLine2;

    const result: ContactInfo = {
      businessName: data.business_name?.trim() || BUSINESS_CONTACT.businessName,
      tagline: data.tagline?.trim() || BUSINESS_CONTACT.tagline,
      founder: BUSINESS_CONTACT.founder,
      phone: rawPhone.trim(),
      displayPhone,
      whatsapp: (data.whatsapp || BUSINESS_CONTACT.whatsapp || '').trim(),
      email: (data.email || BUSINESS_CONTACT.email || '').trim(),
      address: rawAddress,
      addressLine1,
      addressLine2,
      city: 'Rajpipla',
      state: 'Gujarat',
      country: 'India',
      pinCode: '393145',
      googleMapsUrl: data.google_maps_url?.trim() || undefined,
      instagramUrl: data.instagram_url?.trim() || undefined,
      facebookUrl: data.facebook_url?.trim() || undefined,
      logoUrl: data.logo_url?.trim() || undefined,
    };

    cachedSettings = result;
    lastFetchTime = now;
    return result;
  } catch (err) {
    console.warn('Supabase getSiteSettings fallback:', err);
    cachedSettings = BUSINESS_CONTACT;
    lastFetchTime = now;
    return BUSINESS_CONTACT;
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('active', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return [];
    }

    return data.map((t) => ({
      id: t.id,
      authorName: t.customer_name,
      authorLocation: t.location || 'Rajpipla, Gujarat',
      serviceCategory: 'Verified Client',
      content: t.message,
      year: new Date(t.created_at).getFullYear().toString(),
    }));
  } catch (err) {
    console.warn('Supabase getTestimonials notice:', err);
    return [];
  }
}

export async function getServices(): Promise<ServiceRow[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('active', true)
      .order('display_order', { ascending: true });

    if (error || !data) {
      return [];
    }

    return data;
  } catch (err) {
    console.warn('Supabase getServices notice:', err);
    return [];
  }
}
