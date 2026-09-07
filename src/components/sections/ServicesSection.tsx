import { Link } from 'react-router-dom';
import {
  Stethoscope, Sparkles, Activity, GitBranch, Anchor,
  AlignHorizontalDistributeCenter, Gem, Sun, Baby, Scissors, HeartPulse, Layers,
  ArrowRight, type LucideIcon,
} from 'lucide-react';
import type { Service } from '../../lib/services';
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
  detailed?: boolean; // show body + bullet points (services page)
}

export function ServicesSection({ services, eyebrow = 'Xizmatlar', title, subtitle, cta, detailed }: Props) {
  return (
    <section id="services" className="relative w-full border-t border-white/10 bg-[#0a141d] py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12">
        <div className="max-w-2xl" data-reveal>
          <TechnicalBadge label={eyebrow} variant="dark" />
          <h2 className="mt-6 font-serif text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[1.05] tracking-tight text-white">
            {title}
          </h2>
          {subtitle && <p className="mt-5 max-w-xl text-base leading-relaxed text-[#a7c2cb] sm:text-lg">{subtitle}</p>}
        </div>

        <div
          className={`mt-12 grid gap-5 ${detailed ? 'md:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-3'}`}
          data-stagger
        >
          {services.map((s) => {
            const Icon = ICONS[s.icon] ?? Sparkles;
            return (
              <article
                key={s.slug}
                className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md transition-colors duration-300 hover:border-[#8fc7d4]/40 hover:bg-white/[0.06]"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#8fc7d4]/12 text-[#a9d8e4] ring-1 ring-white/10">
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <span className="font-mono text-[11px] tracking-[0.2em] text-[#5c7580]">{s.eyebrow}</span>
                </div>
                <h3 className="mt-5 font-serif text-xl font-medium leading-snug tracking-tight text-white">
                  {s.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[#a7c2cb]">
                  {detailed ? s.body : s.short}
                </p>
                {detailed && (
                  <ul className="mt-4 space-y-1.5">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-[13px] text-[#8fb0ba]">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#8fc7d4]" />
                        {p}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            );
          })}
        </div>

        {cta && (
          <div className="mt-12 flex justify-center" data-reveal>
            <Link
              to={cta.to}
              className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-medium text-white transition-colors hover:border-[#8fc7d4]/50 hover:bg-white/[0.08]"
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
