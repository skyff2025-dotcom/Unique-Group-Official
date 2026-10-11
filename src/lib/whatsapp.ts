/**
 * WhatsApp Integration Configuration & Helper Functions for UNIQUE GROUP
 * 
 * Target WhatsApp: +91 9909015956
 * Official Click-to-Chat Format: https://wa.me/919909015956?text=ENCODED_MESSAGE
 */

// Central phone configuration - easy to maintain and update in one single place
export const WHATSAPP_CONFIG = {
  // Pure digits without + or spaces for the official wa.me link
  phoneDigits: '919909015956',
  // Formatted display representation for UI copy
  displayPhone: '+91 99090 15956',
  // Contact person
  recipientName: 'Gaurav Shah',
  businessName: 'UNIQUE GROUP',
} as const;

export interface WhatsAppEnquiryDetails {
  name: string;
  phone: string;
  email?: string;
  enquiryType?: string; // 'Property', 'Insurance', 'Finance', 'General', etc.
  interestedIn?: string; // Specific property title, insurance plan/company, finance service
  message?: string;
}

/**
 * Formats a clean, professional WhatsApp enquiry message adhering strictly to the required spec:
 * 
 * Hello UNIQUE GROUP,
 * 
 * I would like to make an enquiry through your website.
 * 
 * Name: [Customer Name]
 * Phone: [Customer Phone]
 * Email: [Customer Email, if provided]
 * Enquiry Type: [Property / Insurance / Finance / General]
 * Interested In: [Property, company, plan or service, if applicable]
 * Message: [Customer's Message]
 * 
 * Please contact me regarding this enquiry.
 * 
 * Thank consideration / Thank you.
 * 
 * Note: Never includes undefined, null, or placeholder values.
 */
export function buildWhatsAppEnquiryMessage(details: WhatsAppEnquiryDetails): string {
  const lines: string[] = [
    `Hello ${WHATSAPP_CONFIG.businessName},`,
    '',
    'I would like to make an enquiry through your website.',
    '',
    `Name: ${details.name.trim()}`,
    `Phone: ${details.phone.trim()}`,
  ];

  if (details.email && details.email.trim()) {
    lines.push(`Email: ${details.email.trim()}`);
  }

  if (details.enquiryType && details.enquiryType.trim()) {
    lines.push(`Enquiry Type: ${details.enquiryType.trim()}`);
  }

  if (details.interestedIn && details.interestedIn.trim()) {
    lines.push(`Interested In: ${details.interestedIn.trim()}`);
  }

  if (details.message && details.message.trim()) {
    lines.push(`Message: ${details.message.trim()}`);
  }

  lines.push('');
  lines.push('Please contact me regarding this enquiry.');
  lines.push('');
  lines.push('Thank you.');

  return lines.join('\n');
}

/**
 * Builds the official wa.me click-to-chat URL with properly encoded message.
 */
export function buildWhatsAppUrl(messageOrDetails: string | WhatsAppEnquiryDetails): string {
  const message = typeof messageOrDetails === 'string'
    ? messageOrDetails
    : buildWhatsAppEnquiryMessage(messageOrDetails);

  return `https://wa.me/${WHATSAPP_CONFIG.phoneDigits}?text=${encodeURIComponent(message)}`;
}

/**
 * Safely opens WhatsApp with cross-platform desktop/mobile support:
 * - Attempts to open in a new tab (_blank)
 * - If popup blocker intervenes or on specific mobile browsers, falls back to direct location navigation
 */
export function openWhatsApp(messageOrDetails: string | WhatsAppEnquiryDetails): boolean {
  const url = buildWhatsAppUrl(messageOrDetails);
  try {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      // Popup blocked or mobile browser constraint: direct window navigation fallback
      window.location.href = url;
    }
    return true;
  } catch (err) {
    window.location.href = url;
    return true;
  }
}
