import { motion } from 'motion/react';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { SERVICES, SERVICE_CATEGORIES, CLINIC_IMAGES } from '../../lib/services';
import { scrollToEl } from '../../lib/scroll';

const TITLE = ['Barcha xizmatlar —', 'bitta joyda.'];

const word = {
  hidden: { y: '110%', opacity: 0 },
  show: { y: '0%', opacity: 1, transition: { duration: 0.7, ease: [0.22, 0.61, 0.36, 1] as const } },
};

interface Props {
  onOpenConsultation: () => void;
}

/** One photo, one line, two buttons, two numbers. Everything else is below. */
export function ServicesHero({ onOpenConsultation }: Props) {
  return (
    <section className="relative flex min-h-[82svh] w-full items-end overflow-hidden bg-[#070f17] text-white">
      <img
        src={CLINIC_IMAGES.hero}
        alt="Klinika kabineti"
        loading="eager"
        fetchPriority="high"
        referrerPolicy="no-referrer"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* legibility scrims — same recipe as the home hero */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,13,21,0.85),rgba(6,13,21,0.4)_45%,rgba(6,13,21,0.15))]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(6,13,21,0.9),rgba(6,13,21,0.25)_45%,transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,13,21,0.8),rgba(6,13,21,0.2)_30%,transparent_50%)]" />

      <div className="relative mx-auto w-full max-w-[1440px] px-6 pb-[10vh] pt-40 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-8">
          <div className="max-w-3xl">
            <motion.div
              className="inline-flex items-center gap-3 text-[13px] text-[#a9d8e4]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="h-px w-7 bg-[#a9d8e4]/70" />
              Xizmatlar
            </motion.div>

            <motion.h1
              className="mt-5 text-[12vw] leading-[0.95] tracking-[-0.03em] sm:text-6xl lg:text-[5rem]"
              initial="hidden"
              animate="show"
              transition={{ staggerChildren: 0.06, delayChildren: 0.1 }}
              aria-label={TITLE.join(' ')}
            >
              {TITLE.map((line, li) => (
                <span key={li} className={`block ${li === 0 ? 'font-light text-white/90' : 'font-semibold'}`}>
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

            <motion.div
              className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
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
                Ro‘yxat
                <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" />
              </button>
            </motion.div>
          </div>

          <motion.div
            className="flex items-end divide-x divide-white/15"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            {[
              { value: SERVICES.length, label: 'xizmat' },
              { value: SERVICE_CATEGORIES.length, label: 'yo‘nalish' },
            ].map((f) => (
              <div key={f.label} className="px-6 first:pl-0 last:pr-0">
                <div className="font-serif text-3xl font-medium leading-none text-white">{f.value}</div>
                <div className="mt-1.5 text-[12px] text-[#c6dbe1]">{f.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
