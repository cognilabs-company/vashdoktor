import { ArrowRight, Zap, Sparkles, Anchor, AlignHorizontalDistributeCenter, Baby, Stethoscope, type LucideIcon } from 'lucide-react';
import { CARE_GUIDE, DOCTORS } from '../../lib/doctors';
import { FOUNDER } from '../../lib/founder';
import { TechnicalBadge } from '../ui/TechnicalBadge';
import { Portrait } from '../ui/Portrait';
import { FLOW } from '../../lib/flow';

const ICONS: Record<string, LucideIcon> = { Zap, Sparkles, Anchor, AlignHorizontalDistributeCenter, Baby, Stethoscope };

/** Resolve a care-guide target to a display name / role / photo. */
function target(doctorId: string) {
  if (doctorId === 'founder') return { name: FOUNDER.name, role: 'Bosh shifokor', photo: FOUNDER.photo, chief: true };
  const d = DOCTORS.find((x) => x.id === doctorId);
  return d ? { name: d.name, role: d.role, photo: d.photo, chief: false } : null;
}

interface Props {
  onOpenConsultation: () => void;
}

/** "Which doctor do I need?" — everyday complaints routed to the right person. */
export function CareGuide({ onOpenConsultation }: Props) {
  return (
    <section data-bg={FLOW.teal} className="relative w-full py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-6" data-reveal="left">
          <div className="max-w-2xl">
            <TechnicalBadge label="Yo‘naltirish" variant="dark" />
            <h2 className="mt-6 font-serif text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[1.05] tracking-tight text-white">
              Kimga murojaat qilish kerak?
            </h2>
          </div>
          <button
            onClick={onOpenConsultation}
            className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-[var(--c-bg)] transition-colors hover:bg-[var(--c-mist)]"
          >
            Qaysi shifokor kerakligini so‘rash
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-stagger>
          {CARE_GUIDE.map((g) => {
            const Icon = ICONS[g.icon] ?? Stethoscope;
            const t = target(g.doctorId);
            return (
              <article
                key={g.problem}
                className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[var(--c-accent)]/40 hover:bg-white/[0.06]"
              >
                <div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--c-accent)]/12 text-[var(--c-accent-2)] ring-1 ring-white/10 transition-colors group-hover:bg-[var(--c-accent)]/20">
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <h3 className="mt-5 font-serif text-lg font-medium leading-snug tracking-tight text-white">{g.problem}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--c-text-2)]">{g.hint}</p>
                </div>
                {t && (
                  <div className={`mt-6 flex items-center gap-3 rounded-xl border p-3 ${t.chief ? 'border-[var(--c-accent)]/30 bg-[var(--c-accent)]/[0.07]' : 'border-white/10 bg-[var(--c-bg)]/60'}`}>
                    <div className={`h-10 w-10 shrink-0 overflow-hidden rounded-full ${t.chief ? 'ring-2 ring-[var(--c-accent)]/60' : 'ring-1 ring-white/10'}`}>
                      <Portrait photo={t.photo} name={t.name} rounded="rounded-full" className="h-full w-full" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--c-text-5)]">Sizga kerak</div>
                      <div className="truncate text-[13px] font-medium text-white">
                        {t.role}
                        {t.chief && <span className="ml-1.5 text-[var(--c-accent)]">★</span>}
                      </div>
                    </div>
                    <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-[var(--c-accent)]/60 transition-transform group-hover:translate-x-1" />
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
