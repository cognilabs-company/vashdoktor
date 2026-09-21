import { motion } from 'motion/react';
import { ArrowRight, Rotate3d } from 'lucide-react';
import { getFrameSrc } from '../../lib/dentalSequence';
import { FOUNDER } from '../../lib/founder';

const TITLE = ['Yo‘qolgan tish —', 'ildizidan qayta.'];
const FACTS = [
  { value: '20+', label: 'yil xizmat qiladi' },
  { value: '~1 soat', label: 'o‘rnatish' },
  { value: FOUNDER.heroStats[3].value, label: 'osseointegratsiya' },
];
// pointer labels, positioned on the frame (percent of the figure box)
const LABELS = [
  { text: 'Keramik tish', x: 56, y: 22, side: 'left' as const },
  { text: 'Titan ildiz', x: 52, y: 66, side: 'right' as const },
];

const word = {
  hidden: { y: '110%', opacity: 0 },
  show: { y: '0%', opacity: 1, transition: { duration: 0.7, ease: [0.22, 0.61, 0.36, 1] as const } },
};

interface Props {
  onOpenConsultation: () => void;
  onOpen3DViewer: () => void;
}

/** Implant hero: the jaw with a crown settling onto its titanium root, two
 * pointer labels, one line of copy and three numbers. */
export function ImplantHero({ onOpenConsultation, onOpen3DViewer }: Props) {
  return (
    <section className="relative w-full overflow-hidden bg-[#0a141d]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_72%_55%,#10303c_0%,#0a141d_65%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] [mask-image:radial-gradient(ellipse_at_70%_50%,black_20%,transparent_70%)]" />

      <div className="relative mx-auto grid min-h-[88svh] max-w-[1440px] items-center gap-10 px-6 pb-16 pt-32 sm:px-8 lg:grid-cols-12 lg:gap-6 lg:px-12 lg:pb-20 lg:pt-36">
        {/* copy */}
        <div className="order-2 lg:order-1 lg:col-span-5">
          <motion.div
            className="inline-flex items-center gap-3 text-[13px] text-[#a9d8e4]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="h-px w-7 bg-[#a9d8e4]/70" />
            Implantatsiya
          </motion.div>

          <motion.h1
            className="mt-5 text-[11vw] leading-[0.98] tracking-[-0.03em] sm:text-6xl lg:text-[4.2rem] xl:text-[4.8rem]"
            initial="hidden"
            animate="show"
            transition={{ staggerChildren: 0.06, delayChildren: 0.1 }}
            aria-label={TITLE.join(' ')}
          >
            {TITLE.map((line, li) => (
              <span key={li} className={`block ${li === 0 ? 'font-light text-white/90' : 'font-semibold text-white'}`}>
                {line.split(' ').map((w, i) => (
                  <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                    <motion.span variants={word} className="inline-block">
                      {w}&nbsp;
                    </motion.span>
                  </span>
                ))}
              </span>
            ))}
          </motion.h1>

          <motion.p
            className="mt-6 max-w-md text-[16px] leading-relaxed text-[#b7cdd4]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Titan ildiz suyakka o‘rnatiladi, ustiga keramik tish. Qo‘shni tishlarga tegilmaydi.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.6 }}
          >
            <button
              onClick={onOpenConsultation}
              className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-[#0a141d] transition-colors hover:bg-[#e8f2f4]"
            >
              Konsultatsiya
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={onOpen3DViewer}
              className="group inline-flex items-center gap-1.5 text-sm text-[#c6dbe1] underline decoration-white/25 underline-offset-[6px] transition-colors hover:text-white hover:decoration-[#8fc7d4]"
            >
              <Rotate3d className="h-4 w-4 text-[#8fc7d4]" />
              3D model
            </button>
          </motion.div>

          <motion.div
            className="mt-10 flex items-end divide-x divide-white/15 lg:mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.95, duration: 0.6 }}
          >
            {FACTS.map((f) => (
              <div key={f.label} className="px-6 first:pl-0 last:pr-0">
                <div className="whitespace-nowrap font-serif text-2xl font-medium leading-none text-white sm:text-3xl">{f.value}</div>
                <div className="mt-1.5 text-[12px] text-[#8fb0ba]">{f.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* the jaw */}
        <motion.figure
          className="order-1 relative mx-auto w-full max-w-[820px] lg:order-2 lg:col-span-7 lg:-mr-6 lg:scale-[1.12] xl:scale-[1.18]"
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8fc7d4]/12 blur-[100px]" />
          <div className="pointer-events-none absolute left-1/2 top-[58%] h-[46%] w-[70%] -translate-x-1/2 rounded-[100%] bg-[#07111a]/70 blur-[40px]" />
          <div className="implant-float relative">
            <img
              src={getFrameSrc(195)}
              alt="Jag‘ kesimi: titan implant suyakda, ustiga keramik tish tushmoqda"
              loading="eager"
              fetchPriority="high"
              className="relative w-full object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.55)]"
            />
            {LABELS.map((l) => (
              <motion.div
                key={l.text}
                className={`absolute flex items-center gap-2 ${l.side === 'left' ? '-translate-x-full flex-row-reverse' : ''}`}
                style={{ left: `${l.x}%`, top: `${l.y}%` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.6 }}
              >
                <span className="h-2.5 w-2.5 rounded-full bg-[#8fc7d4] ring-4 ring-[#8fc7d4]/20" />
                <span className="h-px w-10 bg-[#8fc7d4]/60" />
                <span className="whitespace-nowrap rounded-full bg-[#0a141d]/80 px-3 py-1 text-[12px] text-[#dbe8ec] ring-1 ring-white/10">
                  {l.text}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.figure>
      </div>
    </section>
  );
}
