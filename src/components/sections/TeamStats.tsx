import { CountUp } from '../ui/CountUp';
import { DOCTORS } from '../../lib/doctors';
import { FOUNDER } from '../../lib/founder';
import { FLOW } from '../../lib/flow';

// Derived from the data files so the band never drifts from the team list.
const years = (s: string) => parseInt(s, 10) || 0;
const TOTAL_YEARS = years(FOUNDER.heroStats[0].value) + DOCTORS.reduce((sum, d) => sum + years(d.experience), 0);
const FIELDS = new Set(DOCTORS.map((d) => d.role)).size + 1; // + the chief's implantology

const STATS = [
  { value: `${DOCTORS.length + 1}`, label: 'shifokor', note: 'bosh shifokor va jamoa' },
  { value: `${TOTAL_YEARS}+`, label: 'yil umumiy tajriba', note: 'jamoaning jamlangan amaliyoti' },
  { value: `${FIELDS}`, label: 'ixtisoslik', note: 'bolalardan implantatsiyagacha' },
  { value: `${FOUNDER.certificatesTotal}`, label: 'sertifikat', note: `bosh shifokorda, ${FOUNDER.heroStats[2].value} davlatdan` },
];

/** Compact numbers band right after the constellation — the team at a glance. */
export function TeamStats() {
  return (
    <section data-bg={FLOW.base} data-scroll className="relative w-full">
      {/* bridge from the opaque constellation stage above */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[var(--c-bg-2)] to-transparent" />
      <div
        className="sp-rise mx-auto grid max-w-[1440px] grid-cols-2 px-6 sm:px-8 lg:grid-cols-4 lg:px-12 [&>*]:border-white/10 [&>*:nth-child(even)]:border-l [&>*:nth-child(even)]:pl-6 [&>*:nth-child(n+3)]:border-t lg:[&>*:nth-child(n+3)]:border-t-0 lg:[&>*:not(:first-child)]:border-l lg:[&>*:not(:first-child)]:pl-10"
      >
        {STATS.map((s) => (
          <div key={s.label} className="py-9 lg:py-12">
            <div className="font-serif text-4xl font-medium tracking-tight text-white lg:text-5xl">
              <CountUp value={s.value} />
            </div>
            <div className="mt-2 text-sm font-medium text-[var(--c-accent-2)]">{s.label}</div>
            <div className="mt-1 text-[12px] text-[var(--c-text-4)]">{s.note}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
