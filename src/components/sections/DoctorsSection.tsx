import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap } from 'lucide-react';
import type { Doctor } from '../../lib/doctors';
import { FOUNDER } from '../../lib/founder';
import { TechnicalBadge } from '../ui/TechnicalBadge';
import { Portrait } from '../ui/Portrait';
import { FLOW } from '../../lib/flow';

interface Props {
  doctors: Doctor[];
  eyebrow?: string;
  title: string;
  subtitle?: string;
  cta?: { label: string; to: string };
  featureFounder?: boolean; // show the founder as a prominent first card (doctors page)
  compact?: boolean; // photo + name + role only (home page)
}

export function DoctorsSection({ doctors, eyebrow = 'Jamoa', title, subtitle, cta, featureFounder, compact }: Props) {
  return (
    <section id="doctors" data-bg={FLOW.base} data-scroll className="relative w-full py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12">
        <div className="sp-rise max-w-2xl">
          <TechnicalBadge label={eyebrow} variant="dark" />
          <h2 className="mt-6 font-serif text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[1.05] tracking-tight text-white">
            {title}
          </h2>
          {subtitle && <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--c-text-2)] sm:text-lg">{subtitle}</p>}
        </div>

        {/* founder — prominent first card */}
        {featureFounder && (
          <div className="mt-12 grid items-center gap-8 overflow-hidden rounded-3xl border border-[var(--c-accent)]/25 bg-[linear-gradient(150deg,var(--c-bg-4),var(--c-bg))] p-6 md:grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)] md:gap-10 md:p-8">
            <div data-reveal="left">
              <Portrait photo={FOUNDER.photo} name={FOUNDER.name} className="aspect-[4/5] w-full max-w-[280px] md:max-w-none" />
            </div>
            <div data-reveal="right">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--c-accent)]/12 px-3 py-1 text-[11px] font-medium text-[var(--c-accent-2)] ring-1 ring-white/10">
                {FOUNDER.title}
              </span>
              <h3 className="mt-4 font-serif text-[clamp(1.6rem,3vw,2.5rem)] font-medium leading-tight tracking-tight text-white">
                {FOUNDER.name}
              </h3>
              <p className="mt-1.5 text-sm text-[var(--c-accent)]">{FOUNDER.credentials}</p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--c-text-2)]">{FOUNDER.statement}</p>
              <div className="mt-6 flex flex-wrap gap-6">
                {FOUNDER.heroStats.slice(0, 3).map((s) => (
                  <div key={s.label}>
                    <div className="font-serif text-xl font-medium text-white">{s.value}</div>
                    <div className="text-[11px] text-[var(--c-text-3)]">{s.label}</div>
                  </div>
                ))}
              </div>
              <Link
                to="/bosh-shifokor"
                className="group mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-[var(--c-accent)]/50"
              >
                Batafsil
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        )}

        {/* team grid */}
        <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-4 ${compact ? 'mt-10 gap-4' : 'mt-8'}`} data-stagger>
          {doctors.map((d) => compact ? (
            <Link
              key={d.id}
              to="/doctors"
              className="group relative block aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-[var(--c-bg-3)]"
            >
              <Portrait photo={d.photo} name={d.name} rounded="rounded-none" className="sp-drift h-full w-full" />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--c-bg)_5%,rgba(10,20,29,0.5)_35%,transparent_60%)]" />
              <span className="absolute left-4 top-4 rounded-full bg-[var(--c-bg)]/70 px-2.5 py-1 text-[11px] text-[var(--c-accent-2)] ring-1 ring-white/10">
                {d.experience}
              </span>
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <h3 className="font-serif text-lg font-medium leading-tight tracking-tight text-white">{d.name}</h3>
                <p className="mt-1 text-[13px] text-[var(--c-accent)]">{d.role}</p>
              </div>
            </Link>
          ) : (
            <article
              key={d.id}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] transition-colors duration-300 hover:border-[var(--c-accent)]/40"
            >
              <div className="relative aspect-[4/5] w-full">
                <Portrait photo={d.photo} name={d.name} rounded="rounded-none" className="h-full w-full" />
                <span className="absolute bottom-3 left-3 rounded-full bg-[var(--c-bg)]/70 px-3 py-1 text-[11px] font-medium text-[var(--c-accent-2)] backdrop-blur-md ring-1 ring-white/10">
                  {d.experience}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-lg font-medium leading-snug tracking-tight text-white">{d.name}</h3>
                <p className="mt-1 text-[13px] font-medium text-[var(--c-accent)]">{d.role}</p>
                <p className="mt-3 text-[13px] leading-relaxed text-[var(--c-text-2)]">{d.bio}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {d.tags.map((t) => (
                    <span key={t} className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] text-[var(--c-text-3)] ring-1 ring-white/10">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-1.5 border-t border-white/10 pt-3 text-[11px] text-[var(--c-text-4)]">
                  <GraduationCap className="h-3.5 w-3.5 text-[var(--c-accent)]/70" />
                  {d.relation}
                </div>
              </div>
            </article>
          ))}
        </div>

        {cta && (
          <div className="mt-12 flex justify-center" data-reveal>
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
