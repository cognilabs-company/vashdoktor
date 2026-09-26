import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap, ShieldCheck, Repeat, UserCheck, BookOpen, Eye, Users, Quote } from 'lucide-react';
import { TeamConstellation } from '../components/sections/TeamConstellation';
import { TeamStats } from '../components/sections/TeamStats';
import { CareGuide } from '../components/sections/CareGuide';
import { ProcessSection, type ProcessStep } from '../components/sections/ProcessSection';
import { TeamRoster } from '../components/sections/TeamRoster';
import { FAQ } from '../components/sections/FAQ';
import { FinalCTA } from '../components/sections/FinalCTA';
import { TechnicalBadge } from '../components/ui/TechnicalBadge';
import { Portrait } from '../components/ui/Portrait';
import { DOCTORS, DOCTORS_FAQ } from '../lib/doctors';
import { FOUNDER } from '../lib/founder';
import { useClinicUI } from '../lib/uiContext';
import { FLOW } from '../lib/flow';

const STANDARDS = [
  {
    icon: GraduationCap,
    title: 'Bitta maktab',
    text: "Har bir shifokor bosh shifokorning ichki o'quv dasturidan o'tadi — bilim va yondashuv birlashtiriladi.",
  },
  {
    icon: ShieldCheck,
    title: 'Bitta standart',
    text: "Davolash protokollari klinika bo'ylab yagona. Qaysi shifokorga tushsangiz ham — sifat bir xil.",
  },
  {
    icon: Repeat,
    title: 'Doimiy nazorat',
    text: "Murakkab holatlar jamoaviy ko'rib chiqiladi va bosh shifokor nazoratida olib boriladi.",
  },
];

// How a doctor becomes part of the school — the "one standard" made concrete.
const SCHOOL_STEPS: ProcessStep[] = [
  { icon: UserCheck, step: '01', title: 'Tanlov', text: 'Diplom emas — qo‘l mahorati va bemorga munosabat.' },
  { icon: BookOpen, step: '02', title: 'Ichki o‘quv dasturi', text: 'Bosh shifokor protokollari bo‘yicha 6 oy.' },
  { icon: Eye, step: '03', title: 'Nazorat ostida amaliyot', text: 'Birinchi bemorlar — bosh shifokor ishtirokida.' },
  { icon: Users, step: '04', title: 'Mustaqil qabul', text: 'Murakkab holatlar — haftalik konsiliumda.' },
];

export function Doctors() {
  const { openConsultation } = useClinicUI();
  return (
    <>
      {/* Chief in the centre; the team emerges from behind him on scroll */}
      <TeamConstellation
        doctors={DOCTORS}
        eyebrow="Jamoa"
        title="Bosh shifokor va jamoa"
        subtitle="Klinika bosh shifokor atrofida qurilgan — har bir mutaxassis uning maktabidan o‘tgan."
      />

      <TeamStats />

      {/* Which doctor do I need? */}
      <CareGuide onOpenConsultation={openConsultation} />

      {/* One school, one standard — the author-clinic promise, in the chief's voice */}
      <section data-bg={FLOW.blue} className="relative w-full overflow-hidden py-20 lg:py-28">
        <div className="pointer-events-none absolute -right-[10%] top-1/3 h-[420px] w-[420px] rounded-full bg-[var(--c-accent)]/8 blur-[110px]" />
        <div className="relative mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12">
          <div data-scroll className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
            <div className="sp-3d sp-pair" style={{ ['--sp-cn' as string]: -1 }}>
              <TechnicalBadge label="Sifat kafolati" variant="dark" />
              <h2 className="mt-6 font-serif text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[1.05] tracking-tight text-white">
                Bir maktab, bir standart
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--c-text-2)] sm:text-lg">
                Bemor uchun eng muhimi — qaysi shifokorga borishidan qat'i nazar, bir xil sifatli davolash olishi.
                Bizda buni maktab tizimi ta'minlaydi.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {STANDARDS.map((s, i) => (
                  <div
                    key={s.title}
                    data-scroll
                    className="sp-3d sp-grid-3 group rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md transition-[translate,border-color,background-color] duration-300 hover:-translate-y-1 hover:border-[var(--c-accent)]/40"
                    style={{ ['--sp-n' as string]: i % 3 }}
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--c-accent)]/12 text-[var(--c-accent-2)] ring-1 ring-white/10 transition-colors group-hover:bg-[var(--c-accent)]/20">
                      <s.icon className="h-5 w-5" strokeWidth={1.6} />
                    </span>
                    <h3 className="mt-4 font-serif text-base font-medium tracking-tight text-white">{s.title}</h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--c-text-2)]">{s.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* the chief's word */}
            <figure
              className="sp-3d sp-pair relative flex flex-col justify-between rounded-3xl border border-[var(--c-accent)]/25 bg-[linear-gradient(150deg,var(--c-bg-4),var(--c-bg))] p-7 lg:p-9"
              style={{ ['--sp-cn' as string]: 1 }}
            >
              <Quote className="h-8 w-8 text-[var(--c-accent)]/40" />
              <blockquote className="mt-5 font-serif text-[clamp(1.15rem,1.6vw,1.45rem)] font-medium leading-snug tracking-tight text-white">
                “{FOUNDER.statement}”
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4 border-t border-white/10 pt-6">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-[var(--c-accent)]/50">
                  <Portrait photo={FOUNDER.photo} name={FOUNDER.name} rounded="rounded-full" className="h-full w-full" />
                </div>
                <div className="min-w-0">
                  <div className="font-serif text-base font-medium text-white">{FOUNDER.name}</div>
                  <div className="text-[12px] text-[var(--c-accent)]">{FOUNDER.title}</div>
                </div>
                <Link
                  to="/bosh-shifokor"
                  className="group ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-[12px] font-medium text-white transition-colors hover:border-[var(--c-accent)]/50"
                >
                  Batafsil
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* How a doctor joins the school */}
      <ProcessSection
        flow={FLOW.green}
        eyebrow="Maktab"
        title="Shifokor bizda qanday shakllanadi"
        steps={SCHOOL_STEPS}
      />

      {/* Full list with booking */}
      <TeamRoster onOpenConsultation={openConsultation} />

      <FAQ
        items={DOCTORS_FAQ}
        code="JAMOA"
        eyebrow="SAVOL-JAVOB"
        title={
          <>
            Shifokorlar haqida <br />
            <span className="font-medium text-[var(--c-accent)]">ko‘p so‘raladigan savollar.</span>
          </>
        }
        subtitle="Shifokor tanlash, bosh shifokor qabuli, bolalar bilan birinchi tashrif."
      />

      <FinalCTA onOpenConsultation={openConsultation} />
    </>
  );
}
