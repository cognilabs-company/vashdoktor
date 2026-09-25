import React from 'react';

interface TechnicalBadgeProps {
  code?: string;
  label: string;
  variant?: 'subtle' | 'pill' | 'dark';
  className?: string;
}

export function TechnicalBadge({
  code,
  label,
  variant = 'subtle',
  className = '',
}: TechnicalBadgeProps) {
  if (variant === 'dark') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white/90 backdrop-blur-md border border-white/10 ${className}`}
      >
        {code && <span className="font-mono text-[var(--c-green-soft)]">{code}</span>}
        {code && <span className="text-white/30">/</span>}
        <span>{label}</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-[var(--c-green-2)]/8 px-3 py-1 text-[11px] font-medium text-[var(--c-green-2)] border border-[var(--c-green-2)]/15 ${className}`}
    >
      {code && <span className="font-mono font-semibold">{code}</span>}
      {code && <span className="text-[var(--c-green-2)]/40">/</span>}
      <span>{label}</span>
    </span>
  );
}
