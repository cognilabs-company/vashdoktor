import type { ReactNode } from 'react';
import { TechnicalBadge } from '../ui/TechnicalBadge';

interface Props {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children?: ReactNode; // optional CTA / extra
}

/** Inner-page header. Extra top padding clears the fixed navbar. */
export function PageHero({ eyebrow, title, subtitle, children }: Props) {
  return (
    <section className="relative w-full overflow-hidden bg-[#0a141d] pt-36 pb-16 lg:pt-44 lg:pb-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#0e2536_0%,#0a141d_60%)]" />
      <div className="pointer-events-none absolute -top-24 right-[-10%] h-[420px] w-[420px] rounded-full bg-[#8fc7d4]/10 blur-[100px]" />
      <div className="relative mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12">
        <div className="max-w-3xl" data-reveal>
          <TechnicalBadge label={eyebrow} variant="dark" />
          <h1 className="mt-6 font-serif text-[clamp(2.5rem,6vw,4.75rem)] font-medium leading-[0.98] tracking-tight text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#a7c2cb] sm:text-lg">{subtitle}</p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  );
}
