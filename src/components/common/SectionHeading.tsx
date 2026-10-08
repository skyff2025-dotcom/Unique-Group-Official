import React from 'react';

interface SectionHeadingProps {
  label: string;
  title: string;
  description?: string;
  alignment?: 'left' | 'center';
  theme?: 'light' | 'dark';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  label,
  title,
  description,
  alignment = 'center',
  theme = 'light',
  className = '',
}) => {
  const isDark = theme === 'dark';
  const isCenter = alignment === 'center';

  return (
    <div
      className={`space-y-3 ${isCenter ? 'text-center mx-auto' : 'text-left'} max-w-3xl ${className}`}
    >
      {/* Small uppercase label */}
      <span
        className={`text-[11px] font-semibold tracking-[0.25em] uppercase inline-block ${
          isDark ? 'text-[#E2C98D]' : 'text-[#8C6E2E]'
        }`}
      >
        {label}
      </span>

      {/* Large Editorial Heading */}
      <h2
        className={`font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.15] tracking-tight ${
          isDark ? 'text-white' : 'text-[#0A192F]'
        }`}
        style={{ textWrap: 'balance' }}
      >
        {title}
      </h2>

      {/* Supporting Text */}
      {description && (
        <p
          className={`text-base sm:text-lg leading-relaxed ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          } ${isCenter ? 'mx-auto' : ''} max-w-2xl`}
        >
          {description}
        </p>
      )}
    </div>
  );
};
