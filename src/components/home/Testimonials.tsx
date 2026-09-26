import { TESTIMONIALS } from '../../lib/testimonials';
import { Eyebrow } from '../services/Eyebrow';
import { FLOW } from '../../lib/flow';

/** Short patient lines drifting past in a slow ticker — glanceable, and it
 * stops the moment you hover to read one. */
export function Testimonials() {
  return (
    <section data-bg={FLOW.ink} data-scroll className="relative w-full overflow-hidden py-16 lg:py-24">
      <div className="sp-rise mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12">
        <Eyebrow>Bemorlar aytadi</Eyebrow>
        <h2 className="mt-4 font-serif text-[clamp(1.9rem,4vw,3.1rem)] font-medium leading-[1.06] tracking-tight text-white">
          Odamlarning o‘z so‘zlari
        </h2>
      </div>

      <div className="marquee mt-10 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        <div className="marquee-track" style={{ ['--marquee-duration' as string]: '55s' }}>
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 gap-4 pr-4" aria-hidden={copy === 1}>
              {TESTIMONIALS.map((t) => (
                <figure
                  key={`${copy}-${t.name}`}
                  className="flex w-[300px] shrink-0 flex-col justify-between rounded-2xl border border-white/10 bg-[var(--c-bg-3)] p-5 sm:w-[340px]"
                >
                  <blockquote className="font-serif text-[17px] leading-snug text-white">“{t.text}”</blockquote>
                  <figcaption className="mt-5 text-[12px] text-[var(--c-text-4)]">
                    <span className="text-[var(--c-text)]">{t.name}</span> · {t.meta}
                  </figcaption>
                </figure>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
