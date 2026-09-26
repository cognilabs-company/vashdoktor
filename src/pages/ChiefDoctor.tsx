import { useState } from 'react';
import { Award, X, GraduationCap, Stethoscope, Presentation, BookOpen, Users, Check } from 'lucide-react';
import { FinalCTA } from '../components/sections/FinalCTA';
import { TechnicalBadge } from '../components/ui/TechnicalBadge';
import { Portrait } from '../components/ui/Portrait';
import { FOUNDER, type Certificate } from '../lib/founder';
import { useClinicUI } from '../lib/uiContext';

const SCIENCE_ICON = { Konferensiya: Presentation, 'Ilmiy ish': BookOpen, Ustozlik: Users } as const;

function CertTile({ c, compact }: { c: Certificate; compact?: boolean }) {
  return (
    <div className={`flex flex-col rounded-2xl border border-white/10 bg-[linear-gradient(160deg,#0f2431,var(--c-bg-2))] ${compact ? 'p-4' : 'p-5'}`}>
      <div className="flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--c-accent)]/12 text-[var(--c-accent-2)] ring-1 ring-white/10">
          <Award className="h-4 w-4" strokeWidth={1.6} />
        </span>
        {c.year && <span className="font-mono text-[11px] tracking-[0.15em] text-[var(--c-text-5)]">{c.year}</span>}
      </div>
      <h3 className={`mt-3 font-medium tracking-tight text-white ${compact ? 'text-sm' : 'text-[15px]'}`}>{c.title}</h3>
      {c.place && <p className="mt-1 text-[12px] text-[var(--c-text-3)]">{c.place}</p>}
      {c.gain && !compact && (
        <p className="mt-3 flex items-start gap-1.5 text-[12px] leading-snug text-[var(--c-text-2)]">
          <Check className="mt-0.5 h-3 w-3 shrink-0 text-[var(--c-accent)]" /> {c.gain}
        </p>
      )}
    </div>
  );
}

export function ChiefDoctor() {
  const { openConsultation } = useClinicUI();
  const [galleryOpen, setGalleryOpen] = useState(false);

  const extra = Math.max(0, FOUNDER.certificatesTotal - FOUNDER.certificates.length);
  const allCerts: Certificate[] = [
    ...FOUNDER.certificates,
    ...Array.from({ length: extra }, (_, i) => ({
      title: `Malaka oshirish sertifikati №${FOUNDER.certificates.length + i + 1}`,
      place: 'Xalqaro kurs',
      year: '',
      gain: '',
    })),
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative w-full overflow-hidden bg-[var(--c-bg)] pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_10%,var(--c-backdrop),var(--c-bg)_62%)]" />
        <div className="relative mx-auto grid max-w-[1440px] items-center gap-12 px-6 sm:px-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16 lg:px-12">
          <div className="relative mx-auto w-full max-w-sm lg:max-w-none" data-reveal="left">
            <Portrait photo={FOUNDER.photo} name={FOUNDER.name} className="aspect-[4/5] w-full" />
          </div>
          <div data-reveal="right">
            <TechnicalBadge label={FOUNDER.title} variant="dark" />
            <h1 className="mt-6 font-serif text-[clamp(2.25rem,5vw,4rem)] font-medium leading-[0.98] tracking-tight text-white">
              {FOUNDER.name}
            </h1>
            <p className="mt-3 text-base text-[var(--c-accent)]">{FOUNDER.credentials}</p>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--c-text-2)] sm:text-lg">{FOUNDER.statement}</p>

            <div className="mt-9 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-white/10 pt-8 sm:grid-cols-4">
              {FOUNDER.heroStats.map((s) => (
                <div key={s.label}>
                  <div className="font-serif text-2xl font-medium text-white lg:text-3xl">{s.value}</div>
                  <div className="mt-1 text-[12px] leading-snug text-[var(--c-text-3)]">{s.label}</div>
                </div>
              ))}
            </div>

            <button
              onClick={openConsultation}
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-[var(--c-bg)] transition-colors hover:bg-[var(--c-mist)]"
            >
              Qabulga yozilish
            </button>
          </div>
        </div>
      </section>

      {/* TIMELINE — the clinic's history IS the doctor's path */}
      <section data-scroll className="relative w-full border-t border-white/10 bg-[var(--c-bg-2)] py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12">
          <div className="sp-rise max-w-2xl">
            <TechnicalBadge label="Yo‘l" variant="dark" />
            <h2 className="mt-6 font-serif text-[clamp(1.9rem,4vw,3rem)] font-medium leading-tight tracking-tight text-white">
              Ta’lim va amaliyot yo‘li
            </h2>
          </div>
          <ol className="relative mt-12 border-l border-white/12 pl-8">
            {FOUNDER.timeline.map((t) => (
              // stacked, so there is no row to curve — each stop simply comes
              // up out of the back of the page as it is reached
              <li
                key={t.year}
                data-scroll
                className="sp-3d relative mb-9 last:mb-0"
                style={{ ['--sp-persp' as string]: '900px', ['--sp-tilt' as string]: '28deg', ['--sp-depth' as string]: '160px', ['--sp-rise' as string]: '90px' }}
              >
                <span className="absolute -left-[38px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[var(--c-accent)] bg-[var(--c-bg-2)]" />
                <div className="font-mono text-[13px] tracking-[0.15em] text-[var(--c-accent)]">{t.year}</div>
                <h3 className="mt-1 font-serif text-xl font-medium tracking-tight text-white">{t.title}</h3>
                <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-[var(--c-text-2)]">{t.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* SPECIALIZATIONS */}
      <section className="relative w-full border-t border-white/10 bg-[var(--c-bg)] py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12">
          <div data-scroll className="grid gap-12 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-16">
            <div className="sp-3d sp-pair" style={{ ['--sp-cn' as string]: -1 }}>
              <TechnicalBadge label="Ixtisos" variant="dark" />
              <h2 className="mt-6 font-serif text-[clamp(1.9rem,4vw,3rem)] font-medium leading-tight tracking-tight text-white">
                Asosiy yo‘nalishlar
              </h2>
            </div>
            <ul className="sp-3d sp-pair grid gap-3 sm:grid-cols-2" style={{ ['--sp-cn' as string]: 1 }}>
              {FOUNDER.specializations.map((s) => (
                <li key={s} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5">
                  <Stethoscope className="mt-0.5 h-4 w-4 shrink-0 text-[var(--c-accent)]" strokeWidth={1.6} />
                  <span className="text-sm leading-snug text-[var(--c-text)]">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CERTIFICATES — curated, captioned; the rest behind a lightbox */}
      <section data-scroll className="relative w-full border-t border-white/10 bg-[var(--c-bg-2)] py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12">
          <div className="sp-rise flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <TechnicalBadge label="Malaka" variant="dark" />
              <h2 className="mt-6 font-serif text-[clamp(1.9rem,4vw,3rem)] font-medium leading-tight tracking-tight text-white">
                Diplom va sertifikatlar
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--c-text-2)]">
                9 ta davlatda malaka oshirilgan. Quyida asosiylari — har biri qanday imkoniyat berganini ko‘rsatib.
              </p>
            </div>
            <button
              onClick={() => setGalleryOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-[var(--c-accent)]/50 hover:bg-white/[0.08]"
            >
              <Award className="h-4 w-4 text-[var(--c-accent)]" />
              Barcha sertifikatlar ({FOUNDER.certificatesTotal})
            </button>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FOUNDER.certificates.map((c, i) => (
              <div key={c.title} data-scroll className="sp-3d sp-grid-4" style={{ ['--sp-n' as string]: i % 4 }}>
                <CertTile c={c} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCIENCE / CONFERENCES / MENTORSHIP */}
      <section data-scroll className="relative w-full border-t border-white/10 bg-[var(--c-bg)] py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12">
          <div className="sp-rise max-w-2xl">
            <TechnicalBadge label="Ilmiy faoliyat" variant="dark" />
            <h2 className="mt-6 font-serif text-[clamp(1.9rem,4vw,3rem)] font-medium leading-tight tracking-tight text-white">
              Ilm, konferensiyalar va ustozlik
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {FOUNDER.science.map((s, i) => {
              const Icon = SCIENCE_ICON[s.kind] ?? GraduationCap;
              return (
                <div key={s.title} data-scroll className="sp-3d sp-grid-3 rounded-2xl border border-white/10 bg-white/[0.04] p-6" style={{ ['--sp-n' as string]: i % 3 }}>
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--c-accent)]/12 text-[var(--c-accent-2)] ring-1 ring-white/10">
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <div className="mt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--c-text-5)]">{s.kind}</div>
                  <h3 className="mt-1.5 font-serif text-lg font-medium tracking-tight text-white">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--c-text-2)]">{s.detail}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <FinalCTA onOpenConsultation={openConsultation} />

      {/* LIGHTBOX — all certificates */}
      {galleryOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[#050b11]/90 p-4 backdrop-blur-sm"
          onClick={() => setGalleryOpen(false)}
        >
          <div
            className="flex max-h-[86vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[var(--c-bg-2)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div>
                <div className="font-serif text-lg font-medium text-white">Barcha sertifikatlar</div>
                <div className="text-[12px] text-[var(--c-text-3)]">{FOUNDER.certificatesTotal} ta malaka oshirish hujjati</div>
              </div>
              <button
                onClick={() => setGalleryOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] text-white ring-1 ring-white/10 hover:bg-white/[0.12]"
                aria-label="Yopish"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 overflow-y-auto p-6 sm:grid-cols-3 lg:grid-cols-4">
              {allCerts.map((c, i) => (
                <CertTile key={i} c={c} compact />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
