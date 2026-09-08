import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap, ShieldCheck, Repeat } from 'lucide-react';
import { PageHero } from '../components/layout/PageHero';
import { DoctorsSection } from '../components/sections/DoctorsSection';
import { FinalCTA } from '../components/sections/FinalCTA';
import { TechnicalBadge } from '../components/ui/TechnicalBadge';
import { DOCTORS } from '../lib/doctors';
import { useClinicUI } from '../lib/uiContext';

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

export function Doctors() {
  const { openConsultation } = useClinicUI();
  return (
    <>
      <PageHero
        eyebrow="Jamoa"
        title="Bosh shifokor va jamoa"
        subtitle="Klinika bosh shifokor atrofida qurilgan. Har bir mutaxassis uning maktabidan o‘tadi — shuning uchun davolash sifati barcha shifokorlarda bir xil standartda."
      />
      <DoctorsSection
        doctors={DOCTORS}
        eyebrow="Mutaxassislar"
        title="Tanishing"
        featureFounder
      />

      {/* One school, one standard — the author-clinic promise */}
      <section className="relative w-full border-t border-white/10 bg-[#0a141d] py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12">
          <div className="max-w-2xl" data-reveal="left">
            <TechnicalBadge label="Sifat kafolati" variant="dark" />
            <h2 className="mt-6 font-serif text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[1.05] tracking-tight text-white">
              Bir maktab, bir standart
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#a7c2cb] sm:text-lg">
              Bemor uchun eng muhimi — qaysi shifokorga borishidan qat'i nazar, bir xil sifatli davolash olishi.
              Bizda buni maktab tizimi ta'minlaydi.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-stagger>
            {STANDARDS.map((s) => (
              <div
                key={s.title}
                className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#8fc7d4]/40"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#8fc7d4]/12 text-[#a9d8e4] ring-1 ring-white/10 transition-colors group-hover:bg-[#8fc7d4]/20">
                  <s.icon className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <h3 className="mt-5 font-serif text-lg font-medium tracking-tight text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#a7c2cb]">{s.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12" data-reveal>
            <Link
              to="/bosh-shifokor"
              className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-medium text-white transition-colors hover:border-[#8fc7d4]/50 hover:bg-white/[0.08]"
            >
              Bosh shifokor haqida batafsil
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <FinalCTA onOpenConsultation={openConsultation} />
    </>
  );
}
