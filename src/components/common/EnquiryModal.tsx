import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { EnquiryForm, EnquiryFormProps } from './EnquiryForm';

export interface EnquiryModalProps extends EnquiryFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  ...formProps
}) => {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Dimmed Backdrop */}
      <div
        className="fixed inset-0 bg-[#0A192F]/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <div
          role="dialog"
          aria-modal="true"
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E8E4D8] overflow-hidden z-10 animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-[#0A192F] hover:bg-slate-100 rounded-full transition-colors z-20 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Form */}
          <div className="p-1 sm:p-2">
            <EnquiryForm
              {...formProps}
              className="border-0 shadow-none p-6 sm:p-8"
              onSuccess={() => {
                if (formProps.onSuccess) formProps.onSuccess();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
