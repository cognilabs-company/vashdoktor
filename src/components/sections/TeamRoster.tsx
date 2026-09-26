import { Link } from 'react-router-dom';
import { ArrowUpRight, CalendarCheck, GraduationCap } from 'lucide-react';
import { DOCTORS } from '../../lib/doctors';
import { FOUNDER } from '../../lib/founder';
import { TechnicalBadge } from '../ui/TechnicalBadge';
import { Portrait } from '../ui/Portrait';
import { FLOW } from '../../lib/flow';

interface Props {
  onOpenConsultation: () => void;
}

/** The whole team as a scannable list — one row per doctor, booking on each. */
export function TeamRoster({ onOpenConsultation }: Props) {
  return (
    <section id="roster" data-bg={FLOW.ink} data-scroll className="relative w-full py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12">
        <div className="sp-rise max-w-2xl">
          <TechnicalBadge label="Ro‘yxat" variant="dark" />
          <h2 className="mt-6 font-serif text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[1.05] tracking-tight text-white">
            Butun jamoa — bir qarashda
          </h2>
        </div>

        <div
          className="sp-3d mt-12 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]"
          style={{ ['--sp-persp' as string]: '2000px', ['--sp-tilt' as string]: '22deg', ['--sp-depth' as string]: '200px', ['--sp-rise' as string]: '130px' }}
        >
          {/* chief — highlighted first row */}
          <div className="grid items-center gap-5 border-b border-white/10 bg-[linear-gradient(120deg,rgba(143,199,212,0.10),transparent_60%)] p-5 md:grid-cols-[auto_minmax(0,1.3fr)_minmax(0,1fr)_auto] md:gap-8 md:px-7">
            <div className="h-16 w-16 overflow-hidden rounded-2xl ring-2 ring-[var(--c-accent)]/60">
              <Portrait photo={FOUNDER.photo} name={FOUNDER.name} rounded="rounded-none" className="h-full w-full" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-serif text-lg font-medium tracking-tight text-white">{FOUNDER.name}</h3>
                <span className="rounded-full bg-[var(--c-accent)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--c-bg)]">
                  {FOUNDER.title}
                </span>
              </div>
              <p className="mt-1 text-[13px] text-[var(--c-accent)]">{FOUNDER.credentials}</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {FOUNDER.specializations.slice(0, 3).map((s) => (
                <span key={s} className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] text-[var(--c-text)] ring-1 ring-white/10">
                  {s.split(' (')[0]}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 md:justify-end">
              <Link
                to="/bosh-shifokor"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-[12px] font-medium text-white transition-colors hover:border-[var(--c-accent)]/50"
              >
                Profil <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <button
                onClick={onOpenConsultation}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[12px] font-medium text-[var(--c-bg)] transition-colors hover:bg-[var(--c-mist)]"
              >
                <CalendarCheck className="h-3.5 w-3.5" /> Yozilish
              </button>
            </div>
          </div>

          {/* team rows */}
          {DOCTORS.map((d, i) => (
            <div
              key={d.id}
              className="group grid items-center gap-5 border-b border-white/10 p-5 transition-colors last:border-b-0 hover:bg-white/[0.04] md:grid-cols-[auto_minmax(0,1.3fr)_minmax(0,1fr)_auto] md:gap-8 md:px-7"
            >
              <div className="flex items-center gap-4">
                <span className="hidden w-6 font-mono text-[11px] text-[var(--c-text-5)] md:block">{String(i + 1).padStart(2, '0')}</span>
                <div className="h-14 w-14 overflow-hidden rounded-2xl ring-1 ring-white/10 transition-all group-hover:ring-[var(--c-accent)]/50">
                  <Portrait photo={d.photo} name={d.name} rounded="rounded-none" className="h-full w-full" />
                </div>
              </div>
              <div className="min-w-0">
                <h3 className="font-serif text-lg font-medium tracking-tight text-white">{d.name}</h3>
                <p className="mt-0.5 text-[13px]">
                  <span className="text-[var(--c-accent)]">{d.role}</span>
                  <span className="text-[var(--c-text-5)]"> · </span>
                  <span className="text-[var(--c-text-2)]">{d.experience}</span>
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-[11px] text-[var(--c-text-4)]">
                  <GraduationCap className="h-3.5 w-3.5 text-[var(--c-accent)]/70" />
                  {d.relation}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {d.tags.map((t) => (
                  <span key={t} className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] text-[var(--c-text-3)] ring-1 ring-white/10">
                    {t}
                  </span>
                ))}
              </div>
              <div className="md:text-right">
                <button
                  onClick={onOpenConsultation}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-[12px] font-medium text-white transition-colors hover:border-[var(--c-accent)]/50 hover:bg-white/[0.08]"
                >
                  <CalendarCheck className="h-3.5 w-3.5 text-[var(--c-accent)]" /> Yozilish
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
