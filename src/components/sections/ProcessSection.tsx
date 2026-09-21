import { CalendarCheck, ScanLine, ClipboardList, Smile, type LucideIcon } from 'lucide-react';
import { TechnicalBadge } from '../ui/TechnicalBadge';

export interface ProcessStep {
  icon: LucideIcon;
  step: string;
  title: string;
  text: string;
}

const STEPS: ProcessStep[] = [
  {
    icon: CalendarCheck,
    step: '01',
    title: 'Konsultatsiya',
    text: "Shifokor sizni tinglaydi, shikoyatlarni aniqlaydi va og'iz bo'shlig'ini birlamchi ko'rikdan o'tkazadi.",
  },
  {
    icon: ScanLine,
    step: '02',
    title: 'Raqamli diagnostika',
    text: "Rentgen va 3D skanerlash orqali aniq tashxis qo'yamiz — hech narsa taxminga qolmaydi.",
  },
  {
    icon: ClipboardList,
    step: '03',
    title: 'Davolash rejasi',
    text: "Bosqichlar, muddat va aniq narxni oldindan tushuntiramiz. Siz to'liq xabardorlik bilan qaror qabul qilasiz.",
  },
  {
    icon: Smile,
    step: '04',
    title: "Davolash & kuzatuv",
    text: "Og'riqsiz davolaymiz va natijani nazorat qilamiz. Sog'lom tabassum — uzoq muddatli maqsad.",
  },
];

interface Props {
  bg?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  steps?: ProcessStep[]; // defaults to the patient journey
}

export function ProcessSection({
  bg = '#0b1720',
  eyebrow = 'Jarayon',
  title = 'Qanday ishlaymiz',
  subtitle = "Har bir bemor bir xil aniq yo'ldan o'tadi — tashxisdan natijagacha shaffof va oldindan tushunarli.",
  steps = STEPS,
}: Props) {
  return (
    <section className="relative w-full border-t border-white/10 py-20 lg:py-28" style={{ backgroundColor: bg }}>
      <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12">
        <div className="max-w-2xl" data-reveal="left">
          <TechnicalBadge label={eyebrow} variant="dark" />
          <h2 className="mt-6 font-serif text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[1.05] tracking-tight text-white">
            {title}
          </h2>
          {subtitle && <p className="mt-5 max-w-xl text-base leading-relaxed text-[#a7c2cb] sm:text-lg">{subtitle}</p>}
        </div>

        <div className="relative mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4" data-stagger>
          {/* connecting line on large screens */}
          <div className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-[#8fc7d4]/25 to-transparent lg:block" />
          {steps.map((s) => (
            <div key={s.step} className="relative">
              <div className="flex items-center gap-4">
                <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#8fc7d4]/30 bg-[#0a141d] text-[#a9d8e4]">
                  <s.icon className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <span className="font-mono text-2xl font-medium text-white/15">{s.step}</span>
              </div>
              <h3 className="mt-5 font-serif text-lg font-medium tracking-tight text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#a7c2cb]">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
