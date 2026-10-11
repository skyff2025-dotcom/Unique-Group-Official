import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { EnquirySubmission } from '../types';
import { buildWhatsAppUrl, WhatsAppEnquiryDetails } from '../lib/whatsapp';

export interface EnquiryResult {
  success: boolean;
  message: string;
  enquiryId?: string;
  error?: string;
  whatsappUrl?: string;
}

export interface ExtendedEnquiryPayload {
  name?: string;
  fullName?: string;
  phone?: string;
  phoneNumber?: string;
  email?: string;
  emailAddress?: string;
  service_type?: string;
  division?: string;
  interestedIn?: string;
  property_id?: string;
  propertyId?: string;
  insurance_plan_id?: string;
  insurancePlanId?: string;
  finance_service_id?: string;
  financeServiceId?: string;
  message?: string;
}

export function normalizeServiceType(raw?: string): string {
  if (!raw) return 'General Enquiry';
  const lower = raw.toLowerCase().trim();
  if (lower.includes('estate') || lower.includes('property')) return 'Real Estate';
  if (lower.includes('insur')) return 'Insurance';
  if (lower.includes('finan') || lower.includes('loan')) return 'Finance';
  if (lower.includes('general')) return 'General Enquiry';
  return raw;
}

/**
 * Inserts a customer enquiry into Supabase public.enquiries table.
 * Adheres to RLS public insert policy.
 * Inserts: name, phone, email, service_type, property_id, insurance_plan_id, finance_service_id, message, status: 'new'.
 */
export async function submitEnquiry(enquiry: ExtendedEnquiryPayload): Promise<EnquiryResult> {
  const confirmationMessage =
    'Thank you. Your enquiry has been received. Our team will contact you shortly.';

  const resolvedName = (enquiry.name || enquiry.fullName || '').trim();
  const rawPhone = (enquiry.phone || enquiry.phoneNumber || '').trim();
  const cleanPhone = rawPhone.replace(/\D/g, '');

  // Basic validation
  if (!resolvedName) {
    return {
      success: false,
      message: 'Please provide your full name.',
      error: 'Name is required',
    };
  }

  if (!rawPhone || cleanPhone.length < 10) {
    return {
      success: false,
      message: 'Please provide a valid 10-digit mobile number.',
      error: 'Valid phone number is required',
    };
  }

  const rawService = enquiry.service_type || enquiry.interestedIn || enquiry.division;
  const serviceType = normalizeServiceType(rawService);

  const rawPropertyId = enquiry.property_id || enquiry.propertyId;
  const rawPlanId = enquiry.insurance_plan_id || enquiry.insurancePlanId;
  const rawFinanceId = enquiry.finance_service_id || enquiry.financeServiceId;

  const isUuid = (val?: string) =>
    Boolean(val && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val));

  if (!isSupabaseConfigured()) {
    console.info('Enquiry registered locally (Supabase not configured):', {
      name: resolvedName,
      phone: rawPhone,
      serviceType,
    });
    return {
      success: true,
      message: confirmationMessage,
    };
  }

  try {
    const insertPayload = {
      name: resolvedName,
      phone: rawPhone,
      email: (enquiry.email || enquiry.emailAddress || '').trim() || null,
      service_type: serviceType,
      property_id: isUuid(rawPropertyId) ? rawPropertyId : null,
      insurance_plan_id: isUuid(rawPlanId) ? rawPlanId : null,
      finance_service_id: isUuid(rawFinanceId) ? rawFinanceId : null,
      message: enquiry.message?.trim() || null,
      status: 'new',
    };

    const { error } = await supabase
      .from('enquiries')
      .insert([insertPayload]);

    if (error) {
      console.warn('Enquiry insert error:', error.message);
      return {
        success: false,
        message: 'Unable to submit enquiry at this time. Please call our office directly at 9909015956.',
        error: error.message,
      };
    }

    return {
      success: true,
      message: confirmationMessage,
    };
  } catch (err) {
    console.warn('Enquiry submission handled exception:', err);
    return {
      success: false,
      message: 'Unable to submit enquiry at this time. Please call our office directly at 9909015956.',
    };
  }
}
