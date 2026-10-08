import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { FinanceCompany, FinanceService } from '../types';
import { FinanceCompanyRow, FinanceServiceRow } from '../types/database';

function mapDatabaseCompany(row: FinanceCompanyRow, servicesCount: number = 0): FinanceCompany {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortName: row.name.split(' ')[0] || row.name,
    logo: row.name.slice(0, 4).toUpperCase(),
    tagline: row.short_description || 'Competitive rates and reliable loan sanctioning.',
    description: row.description || row.short_description || '',
    type: 'bank',
    interestRateStartsFrom: 'Competitive Bank Rates',
    servicesCount,
    popularServices: [],
  };
}

function mapDatabaseService(row: FinanceServiceRow, companyName: string): FinanceService {
  const benefits = Array.isArray(row.documents_required)
    ? (row.documents_required as string[])
    : [
        'Minimal documentation and expedited branch liaison',
        'Transparent processing with zero surprise fees',
        'Customized tenure and flexible repayment terms',
      ];

  return {
    id: row.id,
    companyId: row.company_id,
    companyName: companyName || 'Partner Bank',
    title: row.name,
    slug: row.slug,
    type: (row.category?.toLowerCase().replace(' finance', '') as any) || 'home',
    typeLabel: `${row.category}`,
    description: row.description || row.short_description || '',
    maxTenure: 'Up to 30 Years',
    interestRate: 'Competitive Bank Rates',
    keyBenefits: benefits,
    eligibility: [row.eligibility || 'Salaried individuals and business entities'],
    requiredDocs: ['PAN & Aadhaar', 'Bank Statements (6 Months)', 'ITR / Financial Records'],
    popular: true,
  };
}

export async function getFinanceCompanies(): Promise<FinanceCompany[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('finance_companies')
      .select('*')
      .eq('active', true)
      .order('name');

    if (error || !data || data.length === 0) {
      return [];
    }

    return data.map((row) => mapDatabaseCompany(row));
  } catch (err) {
    console.warn('Supabase getFinanceCompanies notice:', err);
    return [];
  }
}

export async function getFinanceCompanyBySlug(slug: string): Promise<FinanceCompany | null> {
  if (!slug) return null;

  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('finance_companies')
      .select('*')
      .or(`slug.eq.${slug},id.eq.${slug}`)
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return mapDatabaseCompany(data);
  } catch (err) {
    console.warn('Supabase getFinanceCompanyBySlug notice:', err);
    return null;
  }
}

export async function getFinanceServices(companyId?: string): Promise<FinanceService[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    let query = supabase.from('finance_services').select('*, finance_companies(name)').eq('active', true);
    if (companyId) {
      query = query.eq('company_id', companyId);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return [];
    }

    return data.map((row: any) =>
      mapDatabaseService(row, row.finance_companies?.name || 'Partner Financial Institution')
    );
  } catch (err) {
    console.warn('Supabase getFinanceServices notice:', err);
    return [];
  }
}
