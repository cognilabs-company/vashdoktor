import React from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  theme?: 'light' | 'dark';
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  className = '',
  theme = 'light',
}: SectionHeadingProps) {
  const alignClass = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto',
  }[align];

  const isDark = theme === 'dark';

  return (
    <div className={`flex flex-col max-w-3xl ${alignClass} ${className}`}>
      {eyebrow && (
        <div className="flex items-center gap-2 mb-3">
          <span className={`h-1.5 w-1.5 rounded-full ${isDark ? 'bg-[#DCEDE7]' : 'bg-[#246B5B]'}`} />
          <span
            className={`text-xs font-semibold tracking-[0.18em] uppercase ${
              isDark ? 'text-[#DCEDE7]' : 'text-[#246B5B]'
            }`}
          >
            {eyebrow}
          </span>
        </div>
      )}

      <h2
        className={`text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight font-serif leading-[1.15] ${
          isDark ? 'text-white' : 'text-[#111816]'
        }`}
      >
        {title.split('\n').map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {i < title.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
      </h2>

      {subtitle && (
        <p
          className={`mt-4 text-base sm:text-lg leading-relaxed max-w-2xl font-light ${
            isDark ? 'text-white/70' : 'text-[#68716D]'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
