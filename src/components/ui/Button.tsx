import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'white';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  // Hover feedback is a moving-colour border (see .btn-glow-border in index.css)
  // — no scale.
  const baseStyles =
    'group btn-glow-border relative inline-flex items-center justify-center font-medium rounded-full transition-colors duration-300 ease-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeStyles = {
    sm: 'px-4 py-2 text-xs gap-1.5 min-h-[38px]',
    md: 'px-5 py-2.5 text-xs sm:text-sm gap-2 min-h-[44px]',
    lg: 'px-7 py-3.5 text-sm sm:text-base gap-2.5 min-h-[50px]',
  };

  const variantStyles = {
    primary:
      'overflow-hidden bg-[var(--c-green-deep)] hover:bg-[var(--c-ink)] text-white shadow-xs hover:shadow-lg border border-black/5',
    secondary:
      'bg-transparent text-[var(--c-ink)] hover:text-[var(--c-green)] p-0 min-h-0 underline-offset-4 hover:underline',
    outline:
      'bg-transparent border border-black/15 hover:border-[var(--c-green-deep)] text-[var(--c-ink)] hover:bg-black/5',
    white: 'overflow-hidden bg-white hover:bg-[var(--c-paper-2)] text-[var(--c-ink)] shadow-sm',
  };

  const widthStyle = fullWidth ? 'w-full' : '';
  const showSheen = variant === 'primary' || variant === 'white';

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {showSheen && <span aria-hidden className="btn-sheen" />}

      {icon && iconPosition === 'left' && (
        <span className="relative z-10 transition-transform duration-200 group-hover:-translate-x-0.5">
          {icon}
        </span>
      )}

      <span className="relative z-10">{children}</span>

      {icon && iconPosition === 'right' && (
        <span className="relative z-10 transition-transform duration-200 group-hover:translate-x-1">
          {icon}
        </span>
      )}

      {!icon && variant === 'primary' && (
        <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      )}
    </button>
  );
}
