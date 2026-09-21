import { motion } from 'motion/react';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { SERVICES, SERVICE_CATEGORIES } from '../../lib/services';
import { Eyebrow } from './Eyebrow';
import { scrollToEl } from '../../lib/scroll';

const TITLE = ['Tishga oid barcha xizmatlar', '— bitta klinikada.'];

const word = {
  hidden: { y: '110%', opacity: 0 },
  show: { y: '0%', opacity: 1, transition: { duration: 0.7, ease: [0.22, 0.61, 0.36, 1] as const } },
};

interface Props {
  onOpenConsultation: () => void;
}

/** Headline that settles in word by word, a short honest intro, and the four
 * directions as a plain index — plus a slow ticker of everything we do. */
export function ServicesHero({ onOpenConsultation }: Props) {
  return (
    <section className="relative w-full bg-[#0a141d] pt-36 lg:pt-44">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <Eyebrow>Xizmatlar</Eyebrow>
            </motion.div>

            <motion.h1
              className="mt-7 font-serif text-[clamp(2.4rem,5.4vw,4.4rem)] font-medium leading-[1.02] tracking-tight text-white"
              initial="hidden"
              animate="show"
              transition={{ staggerChildren: 0.055, delayChildren: 0.1 }}
              aria-label={TITLE.join(' ')}
            >
              {TITLE.map((line, li) => (
                <span key={li} className="block">
                  {line.split(' ').map((w, i) => (
                    <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                      <motion.span variants={word} className={`inline-block ${li === 1 ? 'italic text-[#8fc7d4]' : ''}`}>
                        {w}&nbsp;
                      </motion.span>
                    </span>
                  ))}
                </span>
              ))}
            </motion.h1>

            <motion.p
              className="mt-7 max-w-xl text-[17px] leading-relaxed text-[#b7cdd4]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.6 }}
            >
              Bizda {SERVICES.length} ta xizmat bor. Lekin gap sonda emas: har birini ko‘rik va aniq rejadan
              boshlaymiz — shunda siz nima uchun va qancha to‘layotganingizni oldindan bilasiz.
            </motion.p>

            <motion.div
              className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <button
                onClick={onOpenConsultation}
                className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-[#0a141d] transition-colors hover:bg-[#e8f2f4]"
              >
                Ko‘rikka yozilish
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => scrollToEl('#catalog')}
                className="group inline-flex items-center gap-1.5 text-sm text-[#c6dbe1] underline decoration-white/25 underline-offset-[6px] transition-colors hover:text-white hover:decoration-[#8fc7d4]"
              >
                To‘liq ro‘yxat
                <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" />
              </button>
            </motion.div>
          </div>

          {/* index of directions */}
          <motion.ol
            className="self-end border-t border-white/10 lg:col-span-5 lg:col-start-8"
            initial="hidden"
            animate="show"
            transition={{ staggerChildren: 0.07, delayChildren: 0.7 }}
          >
            {SERVICE_CATEGORIES.map((c, i) => (
              <motion.li key={c.key} variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }} className="border-b border-white/10">
                <button
                  onClick={() => scrollToEl(`#chapter-${c.key}`, -80)}
                  className="group flex w-full items-baseline gap-4 py-4 text-left"
                >
                  <span className="w-7 shrink-0 font-serif text-[13px] text-[#5c7580]">{i + 1}</span>
                  <span className="flex-1 text-[15px] text-white transition-colors group-hover:text-[#8fc7d4]">{c.label}</span>
                  <span className="text-[12px] text-[#7f9aa4]">{SERVICES.filter((s) => s.category === c.key).length} xizmat</span>
                  <ArrowRight className="h-4 w-4 shrink-0 self-center text-[#5c7580] transition-all group-hover:translate-x-1 group-hover:text-[#8fc7d4]" />
                </button>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>

      {/* ticker — slow, small, no fuss */}
      <div className="marquee relative mt-16 border-y border-white/10 py-3.5 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="marquee-track" style={{ ['--marquee-duration' as string]: '60s' }}>
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
              {SERVICES.map((s) => (
                <span key={`${copy}-${s.slug}`} className="flex items-center px-5 text-[13px] text-[#8fb0ba]">
                  {s.title}
                  <span className="ml-10 h-[3px] w-[3px] rounded-full bg-[#8fc7d4]/60" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
