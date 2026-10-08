import { ContactInfo } from '../types';

/**
 * UNIQUE GROUP - Default Initial Identity
 * Used strictly as initial fallback before Supabase site_settings resolves.
 * All dynamic data, properties, plans, services, and testimonials are loaded directly from Supabase.
 */
export const BUSINESS_CONTACT: ContactInfo = {
  businessName: 'UNIQUE GROUP',
  tagline: 'Trust • Protection • Growth',
  founder: 'Gaurav Shah',
  phone: '9909015956',
  displayPhone: '+91 99090 15956',
  whatsapp: '919909015956',
  email: '',
  address: 'Vraj Avenue, B-12, M.V. Road, Rajpipla, Gujarat',
  addressLine1: 'Vraj Avenue, B-12',
  addressLine2: 'M.V. Road',
  city: 'Rajpipla',
  state: 'Gujarat',
  country: 'India',
  pinCode: '393145',
  googleMapsUrl: undefined,
  instagramUrl: undefined,
  facebookUrl: undefined,
  logoUrl: undefined,
};
