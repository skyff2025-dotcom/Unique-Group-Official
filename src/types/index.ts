/**
 * Unique Group - Domain TypeScript Interfaces & Schemas
 * Ready for direct Supabase / PostgreSQL table synchronization.
 */

export type DivisionType = 'real_estate' | 'insurance' | 'finance' | 'general';

export type PropertyType = 'residential' | 'commercial' | 'land' | 'investment';
export type PropertyStatus = 'for_sale' | 'available' | 'featured' | 'under_offer' | 'sold';

export interface PropertyImage {
  id: string;
  url: string;
  alt: string;
  isPrimary?: boolean;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  location: string;
  city: string;
  district?: string;
  state: string;
  type: PropertyType;
  typeLabel: string;
  listingType?: string; // 'For Sale', 'For Rent', 'Coming Soon'
  status: PropertyStatus;
  statusLabel: string;
  price: number; // In INR (e.g., 14500000 = 1.45 Cr)
  formattedPrice: string;
  area: string; // e.g., "3,450 sq.ft"
  areaUnit?: string;
  bedrooms?: number;
  bathrooms?: number;
  featured: boolean;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  primaryImage: string;
  gallery: PropertyImage[];
  address: string;
  googleMapsUrl?: string;
  contactPhone?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  reraId?: string;
}

export interface InsuranceCompany {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  logo: string;
  logoUrl?: string;
  phone?: string;
  email?: string;
  websiteUrl?: string;
  tagline: string;
  description: string;
  categories: ('health' | 'life' | 'general' | 'commercial')[];
  established?: string;
  claimSettlementRatio?: string;
  plansCount: number;
  popularPlans: string[];
}

export interface InsurancePlan {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  companySlug?: string;
  title: string;
  slug: string;
  category: 'health' | 'life' | 'general' | 'commercial' | string;
  categoryLabel: string;
  shortDescription?: string;
  description: string;
  keyBenefits: string[];
  coverageUpTo?: string;
  premium?: string;
  targetAudience?: string;
  eligibility?: string;
  documentsRequired?: string[];
  contactPhone?: string;
  minEntryAge?: string;
  popular?: boolean;
}

export interface FinanceCompany {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  logo: string;
  tagline: string;
  description: string;
  type: 'bank' | 'nbfc' | 'housing_finance';
  interestRateStartsFrom: string;
  servicesCount: number;
  popularServices: string[];
}

export interface FinanceService {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  slug: string;
  type: 'home' | 'business' | 'personal' | 'property' | 'other';
  typeLabel: string;
  description: string;
  maxTenure: string;
  interestRate: string;
  keyBenefits: string[];
  eligibility: string[];
  requiredDocs: string[];
  popular: boolean;
}

export interface EnquirySubmission {
  id?: string;
  fullName: string;
  phoneNumber: string;
  emailAddress?: string;
  division: DivisionType;
  propertyId?: string;
  serviceInterest?: string;
  message: string;
  createdAt?: string;
}

export interface Testimonial {
  id: string;
  authorName: string;
  authorLocation: string;
  serviceCategory: string;
  content: string;
  year: string;
}

export interface ContactInfo {
  businessName: string;
  tagline: string;
  founder: string;
  phone: string;
  displayPhone: string;
  whatsapp: string;
  email: string;
  address?: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  googleMapsUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  logoUrl?: string;
}

