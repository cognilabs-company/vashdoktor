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
    <div className={`flex flex-col rounded-2xl border border-white/10 bg-[linear-gradient(160deg,#0f2431,#0b1720)] ${compact ? 'p-4' : 'p-5'}`}>
      <div className="flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#8fc7d4]/12 text-[#a9d8e4] ring-1 ring-white/10">
          <Award className="h-4 w-4" strokeWidth={1.6} />
        </span>
        {c.year && <span className="font-mono text-[11px] tracking-[0.15em] text-[#5c7580]">{c.year}</span>}
      </div>
      <h3 className={`mt-3 font-medium tracking-tight text-white ${compact ? 'text-sm' : 'text-[15px]'}`}>{c.title}</h3>
      {c.place && <p className="mt-1 text-[12px] text-[#8fb0ba]">{c.place}</p>}
      {c.gain && !compact && (
        <p className="mt-3 flex items-start gap-1.5 text-[12px] leading-snug text-[#a7c2cb]">
          <Check className="mt-0.5 h-3 w-3 shrink-0 text-[#8fc7d4]" /> {c.gain}
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
      <section className="relative w-full overflow-hidden bg-[#0a141d] pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_10%,#0e2536,#0a141d_62%)]" />
        <div className="relative mx-auto grid max-w-[1440px] items-center gap-12 px-6 sm:px-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16 lg:px-12">
          <div className="relative mx-auto w-full max-w-sm lg:max-w-none" data-reveal="left">
            <Portrait photo={FOUNDER.photo} name={FOUNDER.name} className="aspect-[4/5] w-full" />
          </div>
          <div data-reveal="right">
            <TechnicalBadge label={FOUNDER.title} variant="dark" />
            <h1 className="mt-6 font-serif text-[clamp(2.25rem,5vw,4rem)] font-medium leading-[0.98] tracking-tight text-white">
              {FOUNDER.name}
            </h1>
            <p className="mt-3 text-base text-[#8fc7d4]">{FOUNDER.credentials}</p>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#a7c2cb] sm:text-lg">{FOUNDER.statement}</p>

            <div className="mt-9 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-white/10 pt-8 sm:grid-cols-4">
              {FOUNDER.heroStats.map((s) => (
                <div key={s.label}>
                  <div className="font-serif text-2xl font-medium text-white lg:text-3xl">{s.value}</div>
                  <div className="mt-1 text-[12px] leading-snug text-[#8fb0ba]">{s.label}</div>
                </div>
              ))}
            </div>

            <button
              onClick={openConsultation}
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-[#0a141d] transition-colors hover:bg-[#e8f2f4]"
            >
              Qabulga yozilish
            </button>
          </div>
        </div>
      </section>

      {/* TIMELINE — the clinic's history IS the doctor's path */}
      <section className="relative w-full border-t border-white/10 bg-[#0b1720] py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12">
          <div className="max-w-2xl" data-reveal="left">
            <TechnicalBadge label="Yo‘l" variant="dark" />
            <h2 className="mt-6 font-serif text-[clamp(1.9rem,4vw,3rem)] font-medium leading-tight tracking-tight text-white">
              Ta’lim va amaliyot yo‘li
            </h2>
          </div>
          <ol className="relative mt-12 border-l border-white/12 pl-8" data-stagger>
            {FOUNDER.timeline.map((t) => (
              <li key={t.year} className="relative mb-9 last:mb-0">
                <span className="absolute -left-[38px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#8fc7d4] bg-[#0b1720]" />
                <div className="font-mono text-[13px] tracking-[0.15em] text-[#8fc7d4]">{t.year}</div>
                <h3 className="mt-1 font-serif text-xl font-medium tracking-tight text-white">{t.title}</h3>
                <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-[#a7c2cb]">{t.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* SPECIALIZATIONS */}
      <section className="relative w-full border-t border-white/10 bg-[#0a141d] py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-16">
            <div data-reveal="left">
              <TechnicalBadge label="Ixtisos" variant="dark" />
              <h2 className="mt-6 font-serif text-[clamp(1.9rem,4vw,3rem)] font-medium leading-tight tracking-tight text-white">
                Asosiy yo‘nalishlar
              </h2>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2" data-stagger="right">
              {FOUNDER.specializations.map((s) => (
                <li key={s} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5">
                  <Stethoscope className="mt-0.5 h-4 w-4 shrink-0 text-[#8fc7d4]" strokeWidth={1.6} />
                  <span className="text-sm leading-snug text-[#c6dbe1]">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CERTIFICATES — curated, captioned; the rest behind a lightbox */}
      <section className="relative w-full border-t border-white/10 bg-[#0b1720] py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12">
          <div className="flex flex-wrap items-end justify-between gap-6" data-reveal="left">
            <div className="max-w-2xl">
              <TechnicalBadge label="Malaka" variant="dark" />
              <h2 className="mt-6 font-serif text-[clamp(1.9rem,4vw,3rem)] font-medium leading-tight tracking-tight text-white">
                Diplom va sertifikatlar
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-[#a7c2cb]">
                9 ta davlatda malaka oshirilgan. Quyida asosiylari — har biri qanday imkoniyat berganini ko‘rsatib.
              </p>
            </div>
            <button
              onClick={() => setGalleryOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-[#8fc7d4]/50 hover:bg-white/[0.08]"
            >
              <Award className="h-4 w-4 text-[#8fc7d4]" />
              Barcha sertifikatlar ({FOUNDER.certificatesTotal})
            </button>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-stagger>
            {FOUNDER.certificates.map((c) => (
              <CertTile key={c.title} c={c} />
            ))}
          </div>
        </div>
      </section>

      {/* SCIENCE / CONFERENCES / MENTORSHIP */}
      <section className="relative w-full border-t border-white/10 bg-[#0a141d] py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12">
          <div className="max-w-2xl" data-reveal="left">
            <TechnicalBadge label="Ilmiy faoliyat" variant="dark" />
            <h2 className="mt-6 font-serif text-[clamp(1.9rem,4vw,3rem)] font-medium leading-tight tracking-tight text-white">
              Ilm, konferensiyalar va ustozlik
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3" data-stagger>
            {FOUNDER.science.map((s) => {
              const Icon = SCIENCE_ICON[s.kind] ?? GraduationCap;
              return (
                <div key={s.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#8fc7d4]/12 text-[#a9d8e4] ring-1 ring-white/10">
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <div className="mt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-[#5c7580]">{s.kind}</div>
                  <h3 className="mt-1.5 font-serif text-lg font-medium tracking-tight text-white">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#a7c2cb]">{s.detail}</p>
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
            className="flex max-h-[86vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b1720]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div>
                <div className="font-serif text-lg font-medium text-white">Barcha sertifikatlar</div>
                <div className="text-[12px] text-[#8fb0ba]">{FOUNDER.certificatesTotal} ta malaka oshirish hujjati</div>
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
