import { Link } from 'react-router-dom';
import {
  Stethoscope, Sparkles, Activity, GitBranch, Anchor,
  AlignHorizontalDistributeCenter, Gem, Sun, Baby, Scissors, HeartPulse, Layers,
  ArrowRight, type LucideIcon,
} from 'lucide-react';
import type { Service } from '../../lib/services';
import { SERVICE_CATEGORIES } from '../../lib/services';
import { TechnicalBadge } from '../ui/TechnicalBadge';

const ICONS: Record<string, LucideIcon> = {
  Stethoscope, Sparkles, Activity, GitBranch, Anchor,
  AlignHorizontalDistributeCenter, Gem, Sun, Baby, Scissors, HeartPulse, Layers,
};

interface Props {
  services: Service[];
  eyebrow?: string;
  title: string;
  subtitle?: string;
  cta?: { label: string; to: string };
  detailed?: boolean; // show body + bullet points, grouped by category (services page)
  bg?: string; // section background for vertical rhythm
}

function ServiceCard({ s, detailed }: { s: Service; detailed?: boolean }) {
  const Icon = ICONS[s.icon] ?? Sparkles;
  return (
    <article className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[var(--c-accent)]/40 hover:bg-white/[0.06] hover:shadow-[0_20px_50px_-30px_rgba(143,199,212,0.5)]">
      <div className="flex items-center justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--c-accent)]/12 text-[var(--c-accent-2)] ring-1 ring-white/10 transition-colors group-hover:bg-[var(--c-accent)]/20">
          <Icon className="h-5 w-5" strokeWidth={1.6} />
        </span>
        <span className="font-mono text-[11px] tracking-[0.2em] text-[var(--c-text-5)]">{s.eyebrow}</span>
      </div>
      <h3 className="mt-5 font-serif text-xl font-medium leading-snug tracking-tight text-white">{s.title}</h3>
      <p className="mt-2.5 text-sm leading-relaxed text-[var(--c-text-2)]">{detailed ? s.body : s.short}</p>
      {detailed && (
        <ul className="mt-4 space-y-1.5 border-t border-white/[0.07] pt-4">
          {s.points.map((p) => (
            <li key={p} className="flex items-start gap-2 text-[13px] text-[var(--c-text-3)]">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--c-accent)]" />
              {p}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export function ServicesSection({ services, eyebrow = 'Xizmatlar', title, subtitle, cta, detailed, bg = 'var(--c-bg)' }: Props) {
  return (
    <section id="services" className="relative w-full border-t border-white/10 py-20 lg:py-28" style={{ backgroundColor: bg }}>
      <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12">
        <div className="max-w-2xl" data-reveal="left">
          <TechnicalBadge label={eyebrow} variant="dark" />
          <h2 className="mt-6 font-serif text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[1.05] tracking-tight text-white">
            {title}
          </h2>
          {subtitle && <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--c-text-2)] sm:text-lg">{subtitle}</p>}
        </div>

        {detailed ? (
          // Grouped by category — better sequencing on the full Services page
          <div className="mt-14 space-y-16">
            {SERVICE_CATEGORIES.map((cat, i) => {
              const items = services.filter((s) => s.category === cat.key);
              if (!items.length) return null;
              return (
                <div key={cat.key}>
                  <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-5">
                    <div data-reveal="left">
                      <span className="font-mono text-[11px] tracking-[0.3em] text-[var(--c-text-5)]">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <h3 className="mt-2 font-serif text-2xl font-medium tracking-tight text-white lg:text-3xl">
                        {cat.label}
                      </h3>
                    </div>
                    <p className="max-w-sm text-sm leading-relaxed text-[var(--c-text-3)]" data-reveal="right">{cat.note}</p>
                  </div>
                  <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3" data-stagger={i % 2 === 1 ? 'right' : 'left'}>
                    {items.map((s) => (
                      <ServiceCard key={s.slug} s={s} detailed />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-stagger>
            {services.map((s) => (
              <ServiceCard key={s.slug} s={s} />
            ))}
          </div>
        )}

        {cta && (
          <div className="mt-14 flex justify-center" data-reveal>
            <Link
              to={cta.to}
              className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-medium text-white transition-colors hover:border-[var(--c-accent)]/50 hover:bg-white/[0.08]"
            >
              {cta.label}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
