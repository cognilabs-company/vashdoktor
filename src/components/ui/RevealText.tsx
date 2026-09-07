import React from 'react';

interface RevealTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function RevealText({ children, className = '' }: RevealTextProps) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="transition-transform duration-700 ease-out will-change-transform">
        {children}
      </div>
    </div>
  );
}
