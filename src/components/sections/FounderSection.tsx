import { Link } from 'react-router-dom';
import { ArrowRight, Quote } from 'lucide-react';
import { FOUNDER } from '../../lib/founder';
import { TechnicalBadge } from '../ui/TechnicalBadge';
import { Portrait } from '../ui/Portrait';

/** Home-page founder screen — the trust anchor. Sits after the 3D sequence,
 * before the doctors grid. Photo + name + "asoschi va bosh shifokor" + key
 * numbers + a short personal statement + a link to the full /bosh-shifokor page. */
export function FounderSection({ bg = 'var(--c-bg)', compact = false, flow }: { bg?: string; compact?: boolean; flow?: string } = {}) {
  return (
    <section
      data-scroll
      data-bg={flow}
      className={`relative w-full overflow-hidden py-20 lg:py-28 ${flow ? '' : 'border-t border-white/10'}`}
      style={flow ? undefined : { backgroundColor: bg }}
    >
      <div className="pointer-events-none absolute -left-[8%] top-1/3 h-[380px] w-[380px] rounded-full bg-[var(--c-accent)]/8 blur-[110px]" />
      <div className="relative mx-auto grid max-w-[1440px] items-center gap-10 px-6 sm:px-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16 lg:px-12">
        {/* portrait */}
        <div
          data-scroll
          className="sp-3d-y relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl lg:max-w-none"
          style={{ ['--sp-hinge-x' as string]: '100%', ['--sp-turn' as string]: '-17deg', ['--sp-shift' as string]: '-34px' }}
        >
          <Portrait photo={FOUNDER.photo} name={FOUNDER.name} className="sp-drift aspect-[4/5] w-full" />
          {!compact && (
            <div className="absolute -bottom-5 left-5 right-5 rounded-2xl border border-white/10 bg-[var(--c-bg-2)]/90 px-5 py-4">
              <div className="font-serif text-lg font-medium text-white">{FOUNDER.name}</div>
              <div className="mt-0.5 text-[13px] text-[var(--c-accent)]">{FOUNDER.title}</div>
            </div>
          )}
        </div>

        {/* content */}
        {/* set against the portrait: it rises while the portrait sinks */}
        <div className="sp-counter">
          <TechnicalBadge label="Asoschi" variant="dark" />
          {compact ? (
            <>
              <h2 className="mt-6 font-serif text-[clamp(1.9rem,4vw,3.25rem)] font-medium leading-[1.08] tracking-tight text-white">
                “{FOUNDER.shortStatement}”
              </h2>
              <p className="mt-4 text-[14px] text-[var(--c-text-3)]">
                <span className="text-white">{FOUNDER.name}</span> · {FOUNDER.title}
              </p>
            </>
          ) : (
            <>
              <h2 className="mt-6 font-serif text-[clamp(1.9rem,4vw,3.25rem)] font-medium leading-[1.06] tracking-tight text-white">
                Klinika orqasidagi shifokor
              </h2>

              <div className="mt-6 flex gap-4">
                <Quote className="h-7 w-7 shrink-0 text-[var(--c-accent)]/50" />
                <p className="text-base leading-relaxed text-[var(--c-text)] sm:text-lg">{FOUNDER.statement}</p>
              </div>
            </>
          )}

          <div className={`mt-9 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-white/10 pt-8 ${compact ? 'sm:grid-cols-3' : 'sm:grid-cols-4'}`}>
            {(compact ? FOUNDER.heroStats.slice(0, 3) : FOUNDER.heroStats).map((s) => (
              <div key={s.label}>
                <div className="font-serif text-2xl font-medium text-white lg:text-3xl">{s.value}</div>
                <div className="mt-1 text-[12px] leading-snug text-[var(--c-text-3)]">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-9">
            <Link
              to="/bosh-shifokor"
              className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-medium text-white transition-colors hover:border-[var(--c-accent)]/50 hover:bg-white/[0.08]"
            >
              Bosh shifokor haqida batafsil
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
