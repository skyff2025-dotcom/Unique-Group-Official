import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, ArrowRight } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';

interface EmptyStateProps {
  type: 'properties' | 'insurance' | 'finance' | 'custom';
  customMessage?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  customMessage,
  className = '',
}) => {
  const settings = useSiteSettings();

  const getMessage = () => {
    if (customMessage) return customMessage;
    switch (type) {
      case 'properties':
        return 'No properties are currently available. Please contact us for upcoming opportunities.';
      case 'insurance':
        return 'Insurance solutions will be updated shortly. Contact our team for assistance.';
      case 'finance':
        return 'Finance solutions will be updated shortly. Contact our team for assistance.';
      default:
        return 'Information will be updated shortly. Please contact us for assistance.';
    }
  };

  return (
    <div
      className={`text-center py-16 px-6 bg-white rounded-xl border border-[#E8E4D8] max-w-2xl mx-auto space-y-5 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-[#FAF4E5] border border-[#C5A059]/40 flex items-center justify-center text-[#8C6E2E] mx-auto">
        <Phone className="w-5 h-5" />
      </div>

      <div className="space-y-2">
        <p className="text-base text-slate-700 leading-relaxed font-medium">
          {getMessage()}
        </p>
        <p className="text-xs text-slate-500">
          Reach our Rajpipla office directly at{' '}
          <a
            href={`tel:${settings.phone}`}
            className="text-[#0A192F] font-bold hover:text-[#8C6E2E] transition-colors"
          >
            {settings.displayPhone}
          </a>
        </p>
      </div>

      <div className="pt-2 flex justify-center items-center gap-3">
        <Link
          to="/contact"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded bg-[#0A192F] hover:bg-[#112240] text-[#E2C98D] text-xs font-semibold uppercase tracking-wider transition-colors"
        >
          <span>Contact Our Office</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
