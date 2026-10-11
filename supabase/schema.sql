-- ==============================================================================
-- UNIQUE GROUP - Supabase Database Schema & Initial Migration
-- Platform: Supabase PostgreSQL
-- Generated for: Unique Group (Trust • Protection • Growth)
-- Location: Rajpipla, Gujarat, India
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. CREATE TABLES
-- ==============================================================================

-- 2.1 Properties
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    property_type TEXT NOT NULL, -- 'residential', 'commercial', 'land', 'investment'
    listing_type TEXT NOT NULL DEFAULT 'For Sale', -- 'For Sale', 'For Rent', 'Coming Soon'
    location TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Rajpipla',
    district TEXT NOT NULL DEFAULT 'Narmada',
    area TEXT NOT NULL,
    area_unit TEXT NOT NULL DEFAULT 'sq.ft',
    price NUMERIC NULL,
    price_display TEXT NULL,
    description TEXT NOT NULL,
    short_description TEXT NULL,
    status TEXT NOT NULL DEFAULT 'Available', -- 'Available', 'Sold', 'Inactive'
    featured BOOLEAN NOT NULL DEFAULT false,
    bedrooms INTEGER NULL,
    bathrooms INTEGER NULL,
    google_maps_url TEXT NULL,
    latitude NUMERIC NULL,
    longitude NUMERIC NULL,
    contact_phone TEXT DEFAULT '9909015956',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.2 Property Images
CREATE TABLE IF NOT EXISTS public.property_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    storage_path TEXT NULL,
    alt_text TEXT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.3 Insurance Companies
CREATE TABLE IF NOT EXISTS public.insurance_companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT NULL,
    short_description TEXT NULL,
    description TEXT NULL,
    website_url TEXT NULL,
    phone TEXT NULL,
    email TEXT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.4 Insurance Plans
CREATE TABLE IF NOT EXISTS public.insurance_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.insurance_companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    category TEXT NOT NULL, -- 'Health', 'Life', 'Motor', 'General', 'Business', 'Other'
    short_description TEXT NULL,
    description TEXT NULL,
    key_benefits JSONB NULL,
    eligibility TEXT NULL,
    documents_required JSONB NULL,
    contact_phone TEXT DEFAULT '9909015956',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.5 Finance Companies
CREATE TABLE IF NOT EXISTS public.finance_companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT NULL,
    short_description TEXT NULL,
    description TEXT NULL,
    website_url TEXT NULL,
    phone TEXT NULL,
    email TEXT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.6 Finance Services
CREATE TABLE IF NOT EXISTS public.finance_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.finance_companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    category TEXT NOT NULL, -- 'Home Finance', 'Business Finance', 'Personal Finance', 'Property Finance', 'Other'
    short_description TEXT NULL,
    description TEXT NULL,
    eligibility TEXT NULL,
    documents_required JSONB NULL,
    contact_phone TEXT DEFAULT '9909015956',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.7 General Services
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.8 Testimonials (Real, verified client feedback only)
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    message TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    location TEXT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.9 Enquiries
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NULL,
    service_type TEXT NOT NULL, -- 'real_estate', 'insurance', 'finance', 'general'
    property_id UUID NULL REFERENCES public.properties(id) ON DELETE SET NULL,
    insurance_plan_id UUID NULL REFERENCES public.insurance_plans(id) ON DELETE SET NULL,
    finance_service_id UUID NULL REFERENCES public.finance_services(id) ON DELETE SET NULL,
    message TEXT NULL,
    status TEXT NOT NULL DEFAULT 'new', -- 'new', 'contacted', 'in_progress', 'completed', 'closed'
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.10 Site Settings
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name TEXT NOT NULL DEFAULT 'UNIQUE GROUP',
    tagline TEXT NOT NULL DEFAULT 'Trust • Protection • Growth',
    phone TEXT NOT NULL DEFAULT '9909015956',
    whatsapp TEXT DEFAULT '919909015956',
    email TEXT DEFAULT 'unique.rajpipla@gmail.com',
    address TEXT NOT NULL DEFAULT 'Vraj Avenue, B-12, M.V. Road, Rajpipla, Gujarat',
    google_maps_url TEXT NULL,
    instagram_url TEXT NULL,
    facebook_url TEXT NULL,
    logo_url TEXT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.11 Admin Profiles
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL, -- References auth.users(id) in Supabase Auth
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 3. INDEXES FOR PERFORMANCE
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_properties_slug ON public.properties(slug);
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON public.properties(featured);
CREATE INDEX IF NOT EXISTS idx_property_images_property ON public.property_images(property_id, display_order);
CREATE INDEX IF NOT EXISTS idx_insurance_plans_company ON public.insurance_plans(company_id);
CREATE INDEX IF NOT EXISTS idx_finance_services_company ON public.finance_services(company_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON public.enquiries(created_at DESC);

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS across all tables
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is an active admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE user_id = auth.uid()
      AND active = true
  );
$$;

-- 4.1 PUBLIC READ POLICIES

-- Properties: Public can view active/available properties
CREATE POLICY "Public can view active properties"
ON public.properties FOR SELECT
USING (status != 'Inactive');

-- Property Images: Public can view images belonging to visible properties
CREATE POLICY "Public can view active property images"
ON public.property_images FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.properties
    WHERE properties.id = property_images.property_id
      AND properties.status != 'Inactive'
  )
);

-- Insurance Companies: Public can view active companies
CREATE POLICY "Public can view active insurance companies"
ON public.insurance_companies FOR SELECT
USING (active = true);

-- Insurance Plans: Public can view active insurance plans
CREATE POLICY "Public can view active insurance plans"
ON public.insurance_plans FOR SELECT
USING (active = true);

-- Finance Companies: Public can view active finance companies
CREATE POLICY "Public can view active finance companies"
ON public.finance_companies FOR SELECT
USING (active = true);

-- Finance Services: Public can view active finance services
CREATE POLICY "Public can view active finance services"
ON public.finance_services FOR SELECT
USING (active = true);

-- Services: Public can view active services
CREATE POLICY "Public can view active services"
ON public.services FOR SELECT
USING (active = true);

-- Testimonials: Public can view active testimonials
CREATE POLICY "Public can view active testimonials"
ON public.testimonials FOR SELECT
USING (active = true);

-- Site Settings: Public can view site settings
CREATE POLICY "Public can view site settings"
ON public.site_settings FOR SELECT
USING (true);

-- 4.2 PUBLIC INSERT POLICIES

-- Enquiries: Anyone can insert an enquiry (public lead capture)
CREATE POLICY "Public can submit enquiries"
ON public.enquiries FOR INSERT
WITH CHECK (true);

-- 4.3 ADMIN FULL CRUD POLICIES (AUTHENTICATED ADMINS ONLY)

CREATE POLICY "Admins full access on properties"
ON public.properties FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins full access on property_images"
ON public.property_images FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins full access on insurance_companies"
ON public.insurance_companies FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins full access on insurance_plans"
ON public.insurance_plans FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins full access on finance_companies"
ON public.finance_companies FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins full access on finance_services"
ON public.finance_services FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins full access on services"
ON public.services FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins full access on testimonials"
ON public.testimonials FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins full access on enquiries"
ON public.enquiries FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins full access on site_settings"
ON public.site_settings FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins view their profile"
ON public.admin_profiles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Superadmins manage admin profiles"
ON public.admin_profiles FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_profiles ap
    WHERE ap.user_id = auth.uid()
      AND ap.role = 'superadmin'
      AND ap.active = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_profiles ap
    WHERE ap.user_id = auth.uid()
      AND ap.role = 'superadmin'
      AND ap.active = true
  )
);

-- ==============================================================================
-- 5. SUPABASE STORAGE BUCKET: property-images
-- ==============================================================================

-- Create bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public can view images in property-images bucket
CREATE POLICY "Public Access To Property Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-images');

-- Only authenticated admins can upload/update/delete property images
CREATE POLICY "Admin Upload To Property Images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'property-images' AND public.is_admin());

CREATE POLICY "Admin Update Property Images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'property-images' AND public.is_admin());

CREATE POLICY "Admin Delete Property Images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'property-images' AND public.is_admin());

-- ==============================================================================
-- 6. INITIAL SEED DATA
-- ==============================================================================

-- 6.1 Real Site Settings
INSERT INTO public.site_settings (
    business_name,
    tagline,
    phone,
    whatsapp,
    email,
    address,
    google_maps_url
) VALUES (
    'UNIQUE GROUP',
    'Trust • Protection • Growth',
    '9909015956',
    '919909015956',
    'unique.rajpipla@gmail.com',
    'Vraj Avenue, B-12, M.V. Road, Rajpipla, Gujarat',
    'https://maps.google.com/?q=Rajpipla,Gujarat'
) ON CONFLICT DO NOTHING;

-- 6.2 Initial Verified Properties in Rajpipla
INSERT INTO public.properties (
    id, title, slug, property_type, listing_type, location, city, district, area, area_unit,
    price, price_display, description, short_description, status, featured, bedrooms, bathrooms, contact_phone
) VALUES
(
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'The Narmada Pavilion Luxury Villa',
    'the-narmada-pavilion-luxury-villa',
    'residential',
    'For Sale',
    'Riverview Enclave, Rajpipla',
    'Rajpipla',
    'Narmada',
    '3,450',
    'sq.ft',
    14500000,
    '₹1.45 Cr',
    'An exceptional custom-designed residence situated in one of Rajpipla’s most peaceful corridors. Features double-height living areas, Italian marble flooring, expansive private terrace, modern modular kitchen, and secure covered parking for two vehicles. Ideal for families seeking timeless architectural quality and uncompromised privacy.',
    'Contemporary 4 BHK architectural bungalow with landscaped private garden and panoramic river valley backdrop.',
    'Available',
    true,
    4,
    4,
    '9909015956'
),
(
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    'Vraj Commercial Galleria Showroom',
    'vraj-commercial-galleria-mv-road',
    'commercial',
    'For Sale',
    'M.V. Road, Prime Commercial Hub',
    'Rajpipla',
    'Narmada',
    '1,850',
    'sq.ft',
    9500000,
    '₹95 Lakh',
    'Located directly on M.V. Road, Rajpipla’s premier commercial street, this property offers unmatched visibility and footfall. Perfectly suited for banking institutions, diagnostic centers, jewellery or retail brand showrooms, and executive corporate offices.',
    'Prime ground-floor double-height retail and corporate space with 32-foot frontage on busiest commercial artery.',
    'Available',
    true,
    null,
    null,
    '9909015956'
),
(
    'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
    'Statue Corridor Clear NA Plot',
    'narmada-corridor-na-plot',
    'land',
    'For Sale',
    'Poicha Road Highway Corridor',
    'Rajpipla',
    'Narmada',
    '5,200',
    'sq.ft',
    5800000,
    '₹58 Lakh',
    'Strategically located along the high-growth corridor between Rajpipla and Poicha, with immediate highway access. Surrounded by scenic green countryside with clear government permissions, demarcated boundaries, and ready access to municipal utilities.',
    'Approved Non-Agricultural (NA) land plot ideal for boutique resort, vacation home, or long-term capital appreciation.',
    'Available',
    true,
    null,
    null,
    '9909015956'
)
ON CONFLICT (slug) DO NOTHING;

-- 6.3 Initial Insurance Companies
INSERT INTO public.insurance_companies (name, slug, short_description, phone, active)
VALUES
('HDFC ERGO General Insurance', 'hdfc-ergo', 'One of India’s most trusted general and health insurers, offering cashless hospitalization across top hospitals in Gujarat.', '9909015956', true),
('Star Health and Allied Insurance', 'star-health', 'Dedicated health insurance leader with family floater plans, senior citizen coverage, and prompt local claim settlement.', '9909015956', true),
('Life Insurance Corporation of India (LIC)', 'lic-india', 'India’s premier state-backed life insurer offering guaranteed returns, family term protection, and pension plans.', '9909015956', true),
('ICICI Lombard General Insurance', 'icici-lombard', 'Providing commercial fire, shopkeeper package policies, vehicle coverage, and personal accident security for families.', '9909015956', true),
('Care Health Insurance', 'care-health', 'Specialized health coverage with no room rent capping, pre-existing disease riders, and zero co-pay options.', '9909015956', true)
ON CONFLICT (slug) DO NOTHING;

-- 6.4 Initial Finance Companies
INSERT INTO public.finance_companies (name, slug, short_description, phone, active)
VALUES
('HDFC Bank Ltd.', 'hdfc-bank', 'India’s premier private sector bank providing seamless digital verification, doorstep service, and competitive interest rates in Rajpipla.', '9909015956', true),
('State Bank of India', 'state-bank-of-india', 'Unmatched branch reach and the most transparent rate structures for salaried, self-employed, and agricultural landowners.', '9909015956', true),
('Bajaj Housing Finance Ltd.', 'bajaj-housing-finance', 'Renowned for rapid turnarounds, minimal paperwork, and customized home loan options for self-employed traders and professionals.', '9909015956', true),
('Bank of Baroda', 'bank-of-baroda', 'Gujarat’s premier institutional heritage with strong local market support and specialized financing for retail, trade, and property construction.', '9909015956', true)
ON CONFLICT (slug) DO NOTHING;
