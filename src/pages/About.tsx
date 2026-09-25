import { HeartHandshake, Microscope, ShieldCheck, Users } from 'lucide-react';
import { PageHero } from '../components/layout/PageHero';
import { ProcessSection } from '../components/sections/ProcessSection';
import { FounderSection } from '../components/sections/FounderSection';
import { FinalCTA } from '../components/sections/FinalCTA';
import { TechnicalBadge } from '../components/ui/TechnicalBadge';
import { CLINIC_CONFIG } from '../lib/clinicConfig';
import { useClinicUI } from '../lib/uiContext';

const VALUES = [
  { icon: HeartHandshake, title: 'Bemorga g‘amxo‘rlik', text: "Har bir bemorga individual yondashuv va qulay, qo'rquvsiz muhit." },
  { icon: Microscope, title: 'Zamonaviy texnologiya', text: 'Raqamli diagnostika, 3D rejalashtirish va yangi avlod materiallari.' },
  { icon: ShieldCheck, title: 'Halollik va shaffoflik', text: "Aniq tashxis, ochiq narxlar va faqat kerakli davolash." },
  { icon: Users, title: 'Butun oila uchun', text: "Bolalardan kattalargacha — barcha yosh uchun bir joyda xizmat." },
];

const STATS = [
  { value: '15+', label: 'yillik tajriba' },
  { value: '20 000+', label: 'baxtli bemor' },
  { value: '12', label: 'stomatologik yo‘nalish' },
  { value: '99%', label: 'bemor mamnuniyati' },
];

export function About() {
  const { openConsultation } = useClinicUI();
  return (
    <>
      <PageHero
        eyebrow="Biz haqimizda"
        title={`"${CLINIC_CONFIG.name.charAt(0) + CLINIC_CONFIG.name.slice(1).toLowerCase()}" — sizning oilangiz shifokori`}
        subtitle="Biz zamonaviy va bemorga g‘amxo‘rlik qiladigan stomatologiya klinikasimiz. Maqsadimiz — har bir odamga sog‘lom, ishonchli va chiroyli tabassum sovg‘a qilish."
      />

      {/* Story */}
      <section className="relative w-full border-t border-white/10 bg-[var(--c-bg)] py-20 lg:py-28">
        <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-6 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-12">
          <div data-reveal="left">
            <TechnicalBadge label="Bizning missiya" variant="dark" />
            <h2 className="mt-6 font-serif text-[clamp(1.9rem,4vw,3rem)] font-medium leading-[1.08] tracking-tight text-white">
              Sog‘lom tabassum — sog‘lom hayotning boshlanishi
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-[var(--c-text-2)]">
              <p>
                Klinikamiz umumiy stomatologiyaning barcha yo‘nalishlarini qamrab oladi: profilaktika va tozalashdan tortib,
                davolash, ortodontiya, estetika va murakkab implantatsiyagacha.
              </p>
              <p>
                Har bir davolash aniq raqamli tashxisdan boshlanadi. Biz og‘riqsizlik, xavfsizlik va tabiiy natijaga
                e’tibor qaratamiz — shuning uchun bemorlarimiz bizga oilaviy tarzda qaytadi.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4" data-stagger="right">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md">
                <div className="font-serif text-3xl font-medium text-white lg:text-4xl">{s.value}</div>
                <div className="mt-1.5 text-sm text-[var(--c-text-3)]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative w-full border-t border-white/10 bg-[var(--c-bg-2)] py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12">
          <div className="max-w-2xl" data-reveal="left">
            <TechnicalBadge label="Qadriyatlar" variant="dark" />
            <h2 className="mt-6 font-serif text-[clamp(1.9rem,4vw,3rem)] font-medium leading-[1.08] tracking-tight text-white">
              Nima uchun bizni tanlaydilar
            </h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" data-stagger>
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[var(--c-accent)]/40"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--c-accent)]/12 text-[var(--c-accent-2)] ring-1 ring-white/10 transition-colors group-hover:bg-[var(--c-accent)]/20">
                  <v.icon className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <h3 className="mt-5 font-serif text-lg font-medium tracking-tight text-white">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--c-text-2)]">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How we work */}
      <ProcessSection bg="var(--c-bg)" />

      {/* Founder — the trust anchor of the author clinic */}
      <FounderSection bg="var(--c-bg-2)" />

      <FinalCTA onOpenConsultation={openConsultation} />
    </>
  );
}
