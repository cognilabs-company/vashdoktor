import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { SERVICES, SERVICE_CATEGORIES } from '../../lib/services';
import { Eyebrow } from '../services/Eyebrow';
import { FLOW } from '../../lib/flow';

/** Four photo tiles — one per direction. The picture carries the meaning; the
 * service names are there for whoever reads on. Each tile opens its chapter.
 *
 * `staged`: rendered inside the hero reveal (HeroReveal) — fills exactly one
 * viewport, tile heights follow the viewport, and the scroll-reveal attributes
 * are swapped for data hooks the reveal timeline animates. */
export function HomeServices({ staged = false }: { staged?: boolean } = {}) {
  return (
    <section
      id="services"
      data-bg={FLOW.base}
      className={staged ? 'relative flex h-full w-full flex-col justify-center pt-16' : 'relative w-full py-16 lg:py-24'}
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-4" {...(staged ? { 'data-head': '' } : { 'data-reveal': '' })}>
          <div>
            <Eyebrow>Xizmatlar</Eyebrow>
            <h2 className="mt-4 font-serif text-[clamp(1.9rem,4vw,3.1rem)] font-medium leading-[1.06] tracking-tight text-white">
              Nima qilamiz
            </h2>
          </div>
          <Link
            to="/services"
            className="group inline-flex items-center gap-1.5 text-[14px] text-[#c6dbe1] underline decoration-white/25 underline-offset-[6px] transition-colors hover:text-white hover:decoration-[#8fc7d4]"
          >
            Barcha {SERVICES.length} xizmat
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4" {...(staged ? { 'data-tiles': '' } : { 'data-stagger': '' })}>
          {SERVICE_CATEGORIES.map((c, i) => {
            const items = SERVICES.filter((s) => s.category === c.key);
            return (
              <Link
                key={c.key}
                to={`/services#chapter-${c.key}`}
                data-tile={staged ? '' : undefined}
                className={`group relative block overflow-hidden rounded-2xl border border-white/10 bg-[#0d1d28] ${
                  staged ? 'h-[26svh] lg:h-[min(46svh,440px)]' : 'aspect-[3/4] sm:aspect-[4/5]'
                }`}
              >
                <img
                  src={c.image}
                  alt={c.label}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,#0a141d_8%,rgba(10,20,29,0.55)_45%,rgba(10,20,29,0.05))]" />

                <span className="absolute left-4 top-4 font-serif text-[13px] text-white/70">{String(i + 1).padStart(2, '0')}</span>
                <span className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#0a141d]/60 text-white/70 ring-1 ring-white/15 transition-all group-hover:bg-[#8fc7d4] group-hover:text-[#0a141d]">
                  <ArrowUpRight className="h-4 w-4" />
                </span>

                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <h3 className="font-serif text-lg font-medium leading-tight tracking-tight text-white sm:text-[22px]">{c.label}</h3>
                  <ul className="mt-2.5 hidden text-[12px] leading-[1.7] text-[#c6dbe1]/80 sm:block">
                    {items.map((s) => (
                      <li key={s.slug}>{s.title}</li>
                    ))}
                  </ul>
                  <span className="mt-2 block text-[12px] text-[#8fc7d4] sm:hidden">{items.length} xizmat</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
