import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { InsuranceCompany, InsurancePlan } from '../types';
import { InsuranceCompanyRow, InsurancePlanRow } from '../types/database';

function mapDatabaseCompany(row: InsuranceCompanyRow, plansCount: number = 0): InsuranceCompany {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortName: row.name.split(' ')[0] || row.name,
    logo: row.name.slice(0, 4).toUpperCase(),
    logoUrl: row.logo_url || undefined,
    phone: row.phone || undefined,
    email: row.email || undefined,
    websiteUrl: row.website_url || undefined,
    tagline: row.short_description || 'Trusted protection and advisory guidance.',
    description: row.description || row.short_description || '',
    categories: ['health', 'life', 'general', 'commercial'],
    plansCount,
    popularPlans: ['Comprehensive Health Protection', 'Family Term Shield', 'Commercial Business Fire'],
  };
}

function mapDatabasePlan(
  row: InsurancePlanRow,
  companyInfo?: { id?: string; name?: string; logo_url?: string | null; slug?: string } | null
): InsurancePlan {
  const benefits = Array.isArray(row.key_benefits)
    ? (row.key_benefits as string[])
    : [
        'Cashless hospitalization coverage',
        'Direct claim support with local assistance',
        'Extensive network of approved hospitals',
      ];

  const docs = Array.isArray(row.documents_required)
    ? (row.documents_required as string[])
    : ['Aadhaar Card', 'PAN Card', 'Passport Photo'];

  const categoryName = (row.category || 'Health').trim();

  return {
    id: row.id,
    companyId: row.company_id,
    companyName: companyInfo?.name || 'Unique Partner Insurer',
    companyLogo: companyInfo?.logo_url || undefined,
    companySlug: companyInfo?.slug || undefined,
    title: row.name,
    slug: row.slug,
    category: categoryName.toLowerCase(),
    categoryLabel: `${categoryName} Insurance`,
    shortDescription: row.short_description || undefined,
    description: row.description || row.short_description || '',
    keyBenefits: benefits,
    coverageUpTo: '₹50 Lakh+',
    premium: row.eligibility?.includes('₹') ? row.eligibility : undefined,
    targetAudience: row.eligibility || 'Families & Individuals',
    eligibility: row.eligibility || 'Entry age 18 to 65 years. Children covered under family floater.',
    documentsRequired: docs,
    contactPhone: row.contact_phone || '9909015956',
    popular: true,
  };
}

export async function getInsuranceCompanies(): Promise<InsuranceCompany[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const { data: companies, error: compError } = await supabase
      .from('insurance_companies')
      .select('*')
      .eq('active', true)
      .order('name');

    if (compError || !companies || companies.length === 0) {
      return [];
    }

    // Fetch active plans count
    const { data: activePlans } = await supabase
      .from('insurance_plans')
      .select('company_id')
      .eq('active', true);

    const counts: Record<string, number> = {};
    if (activePlans) {
      activePlans.forEach((p) => {
        counts[p.company_id] = (counts[p.company_id] || 0) + 1;
      });
    }

    return companies.map((row) => mapDatabaseCompany(row, counts[row.id] || 0));
  } catch (err) {
    console.warn('Supabase getInsuranceCompanies notice:', err);
    return [];
  }
}

export async function getInsuranceCompanyBySlug(slug: string): Promise<InsuranceCompany | null> {
  if (!slug) return null;

  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);

    let query = supabase.from('insurance_companies').select('*').limit(1);
    if (isUuid) {
      query = query.or(`id.eq.${slug},slug.eq.${slug}`);
    } else {
      query = query.eq('slug', slug);
    }

    const { data, error } = await query.maybeSingle();

    if (error || !data) {
      return null;
    }

    // Count active plans
    const { count } = await supabase
      .from('insurance_plans')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', data.id)
      .eq('active', true);

    return mapDatabaseCompany(data, count || 0);
  } catch (err) {
    console.warn('Supabase getInsuranceCompanyBySlug notice:', err);
    return null;
  }
}

export async function getInsurancePlans(filters?: {
  companyId?: string;
  category?: string;
  search?: string;
} | string): Promise<InsurancePlan[]> {
  const companyId = typeof filters === 'string' ? filters : filters?.companyId;
  const category = typeof filters === 'object' ? filters?.category : undefined;
  const search = typeof filters === 'object' ? filters?.search : undefined;

  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    let query = supabase
      .from('insurance_plans')
      .select('*, insurance_companies(id, name, slug, logo_url, active)')
      .eq('active', true)
      .order('name');

    if (companyId && companyId !== 'all') {
      query = query.eq('company_id', companyId);
    }

    if (category && category !== 'all') {
      query = query.ilike('category', `%${category}%`);
    }

    if (search?.trim()) {
      query = query.or(`name.ilike.%${search.trim()}%,short_description.ilike.%${search.trim()}%`);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return [];
    }

    return data.map((row: any) =>
      mapDatabasePlan(row, row.insurance_companies)
    );
  } catch (err) {
    console.warn('Supabase getInsurancePlans notice:', err);
    return [];
  }
}

export async function getInsurancePlanById(id: string): Promise<InsurancePlan | null> {
  if (!id) return null;

  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('insurance_plans')
      .select('*, insurance_companies(id, name, slug, logo_url, active)')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return mapDatabasePlan(data, (data as any).insurance_companies);
  } catch {
    return null;
  }
}

export async function getInsurancePlanBySlug(
  slug: string
): Promise<{ plan: InsurancePlan; company?: InsuranceCompany } | null> {
  if (!slug) return null;

  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);

    let query = supabase
      .from('insurance_plans')
      .select('*, insurance_companies(id, name, slug, logo_url, short_description, description, phone, email, website_url, active)')
      .limit(1);

    if (isUuid) {
      query = query.or(`id.eq.${slug},slug.eq.${slug}`);
    } else {
      query = query.eq('slug', slug);
    }

    const { data, error } = await query.maybeSingle();

    if (error || !data) {
      return null;
    }

    const mappedPlan = mapDatabasePlan(data, data.insurance_companies as any);
    const companyRaw = data.insurance_companies as any;
    const mappedCompany: InsuranceCompany | undefined = companyRaw
      ? mapDatabaseCompany(companyRaw as any)
      : undefined;

    return { plan: mappedPlan, company: mappedCompany };
  } catch (err) {
    console.warn('Supabase getInsurancePlanBySlug notice:', err);
    return null;
  }
}
