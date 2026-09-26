import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { CLINIC_IMAGES } from '../../lib/services';
import { Eyebrow } from '../services/Eyebrow';
import { FLOW } from '../../lib/flow';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const STEP_MS = 5000;

const STEPS = [
  { title: 'Suhbat', note: 'Nima bezovta qilayotganini aytasiz. Shoshilmaymiz.', time: '5 daq', image: CLINIC_IMAGES.consult },
  { title: 'Ko‘rik + rentgen', note: 'Shifokor ko‘radi, kerak bo‘lsa raqamli rasmga oladi.', time: '15 daq', image: CLINIC_IMAGES.xray },
  { title: 'Reja + narx', note: 'Bosqichlar, muddat va narx — qog‘ozda, qo‘lingizda.', time: '10 daq', image: CLINIC_IMAGES.plan },
  { title: 'Qaror — sizniki', note: 'Xohlasangiz shu kuni boshlaymiz. Xohlamasangiz — o‘ylab keling.', time: '0 daq', image: CLINIC_IMAGES.room },
];

interface Props {
  onOpenConsultation: () => void;
}

/** The first visit as a photo stepper: one big picture per stop, the four
 * stops beside it, and a progress line that walks through them on its own
 * (loops 4 → 1; pauses only while the pointer rests on the list). */
export function FirstVisit({ onOpenConsultation }: Props) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [round, setRound] = useState(0); // bumps to restart the bar on manual picks

  useEffect(() => {
    if (reduced || paused) return;
    const t = window.setTimeout(() => setActive((a) => (a + 1) % STEPS.length), STEP_MS);
    return () => window.clearTimeout(t);
  }, [active, paused, reduced, round]);

  const pick = (i: number) => {
    setActive(i);
    setRound((r) => r + 1);
  };
  const step = STEPS[active];

  return (
    <section data-bg={FLOW.blue} className="relative w-full py-16 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-4" data-reveal>
          <div>
            <Eyebrow>Birinchi tashrif</Eyebrow>
            <h2 className="mt-4 font-serif text-[clamp(1.9rem,4vw,3.1rem)] font-medium leading-[1.06] tracking-tight text-white">
              Birinchi kelganingizda
            </h2>
          </div>
          <p className="text-[14px] text-[var(--c-text-3)]">
            To‘rt qadam, <span className="text-white">~30 daqiqa</span>.
          </p>
        </div>

        <div
          data-scroll
          className="sp-3d mt-10 grid overflow-hidden rounded-[28px] border border-white/10 bg-[var(--c-bg-3)] lg:grid-cols-12"
          style={{ ['--sp-persp' as string]: '2400px', ['--sp-tilt' as string]: '11deg', ['--sp-depth' as string]: '200px' }}
        >
          {/* photo stage */}
          <div className="relative aspect-[4/3] overflow-hidden lg:col-span-7 lg:aspect-auto lg:min-h-[540px]">
            {STEPS.map((s, i) => (
              <img
                key={s.title}
                src={s.image}
                alt={s.title}
                loading={i === 0 ? 'eager' : 'lazy'}
                referrerPolicy="no-referrer"
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                  i === active ? 'step-photo-active opacity-100' : 'opacity-0'
                }`}
              />
            ))}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,var(--c-bg-3)_0%,rgba(13,29,40,0.45)_40%,rgba(13,29,40,0.05)_70%)] lg:bg-[linear-gradient(to_right,rgba(13,29,40,0.1),transparent_40%),linear-gradient(to_top,var(--c-bg-3)_0%,rgba(13,29,40,0.4)_38%,transparent_65%)]" />

            <span className="absolute right-5 top-5 rounded-full bg-[var(--c-bg)]/75 px-3 py-1.5 font-mono text-[12px] text-[var(--c-accent-2)] ring-1 ring-white/10">
              {step.time}
            </span>

            <div key={active} className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
              <div className="flex items-end gap-5">
                <span className="font-serif text-[clamp(3.5rem,7vw,6rem)] font-light leading-[0.8] text-white/25">
                  {String(active + 1).padStart(2, '0')}
                </span>
                <div className="pb-1">
                  <h3 className="font-serif text-[clamp(1.5rem,2.6vw,2.2rem)] font-medium leading-tight tracking-tight text-white">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 max-w-md text-[14px] leading-relaxed text-[var(--c-text)] sm:text-[15px]">{step.note}</p>
                </div>
              </div>
            </div>
          </div>

          {/* stops */}
          <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-5 lg:p-10">
            {/* pauses only while the pointer rests on the list (reading), never on the photo */}
            <ol onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
              {STEPS.map((s, i) => {
                const on = i === active;
                const done = i < active;
                return (
                  <li key={s.title} className="border-b border-white/10 last:border-b-0">
                    <button onClick={() => pick(i)} className="group flex w-full items-center gap-4 py-4 text-left lg:py-5">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-serif text-[13px] ring-1 transition-colors ${
                          on ? 'bg-[var(--c-accent)] text-[var(--c-bg)] ring-[var(--c-accent)]' : done ? 'text-[var(--c-accent)] ring-[var(--c-accent)]/50' : 'text-[var(--c-text-4)] ring-white/15 group-hover:ring-white/40'
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span className={`flex-1 font-serif text-[17px] transition-colors ${on ? 'text-white' : 'text-[var(--c-text-2)] group-hover:text-white'}`}>
                        {s.title}
                      </span>
                      <span className={`font-mono text-[12px] ${on ? 'text-[var(--c-accent-2)]' : 'text-[var(--c-text-5)]'}`}>{s.time}</span>
                    </button>
                    {/* progress under the active stop */}
                    <div className="h-px w-full bg-white/[0.06]">
                      {on && (
                        <div
                          key={`${active}-${round}`}
                          className={`step-progress h-px w-full bg-[var(--c-accent)] ${paused ? 'is-paused' : ''}`}
                          style={{ ['--step-duration' as string]: `${STEP_MS}ms` }}
                        />
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
              <div>
                <div className="font-serif text-2xl font-medium leading-none text-white">~30 daq</div>
                <div className="mt-1 text-[12px] text-[var(--c-text-4)]">davolashsiz, majburiyatsiz</div>
              </div>
              <button
                onClick={onOpenConsultation}
                className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-[var(--c-bg)] transition-colors hover:bg-[var(--c-mist)]"
              >
                Qabulga yozilish
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
