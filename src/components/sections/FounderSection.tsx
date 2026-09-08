import { Link } from 'react-router-dom';
import { ArrowRight, Quote } from 'lucide-react';
import { FOUNDER } from '../../lib/founder';
import { TechnicalBadge } from '../ui/TechnicalBadge';
import { Portrait } from '../ui/Portrait';

/** Home-page founder screen — the trust anchor. Sits after the 3D sequence,
 * before the doctors grid. Photo + name + "asoschi va bosh shifokor" + key
 * numbers + a short personal statement + a link to the full /bosh-shifokor page. */
export function FounderSection({ bg = '#0a141d' }: { bg?: string } = {}) {
  return (
    <section className="relative w-full overflow-hidden border-t border-white/10 py-20 lg:py-28" style={{ backgroundColor: bg }}>
      <div className="pointer-events-none absolute -left-[8%] top-1/3 h-[380px] w-[380px] rounded-full bg-[#8fc7d4]/8 blur-[110px]" />
      <div className="relative mx-auto grid max-w-[1440px] items-center gap-10 px-6 sm:px-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16 lg:px-12">
        {/* portrait */}
        <div className="relative mx-auto w-full max-w-sm lg:max-w-none" data-reveal="left">
          <Portrait photo={FOUNDER.photo} name={FOUNDER.name} className="aspect-[4/5] w-full" />
          <div className="absolute -bottom-5 left-5 right-5 rounded-2xl border border-white/10 bg-[#0b1720]/90 px-5 py-4 backdrop-blur-md">
            <div className="font-serif text-lg font-medium text-white">{FOUNDER.name}</div>
            <div className="mt-0.5 text-[13px] text-[#8fc7d4]">{FOUNDER.title}</div>
          </div>
        </div>

        {/* content */}
        <div data-reveal="right">
          <TechnicalBadge label="Asoschi" variant="dark" />
          <h2 className="mt-6 font-serif text-[clamp(1.9rem,4vw,3.25rem)] font-medium leading-[1.06] tracking-tight text-white">
            Klinika orqasidagi shifokor
          </h2>

          <div className="mt-6 flex gap-4">
            <Quote className="h-7 w-7 shrink-0 text-[#8fc7d4]/50" />
            <p className="text-base leading-relaxed text-[#c6dbe1] sm:text-lg">{FOUNDER.statement}</p>
          </div>

          <div className="mt-9 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-white/10 pt-8 sm:grid-cols-4">
            {FOUNDER.heroStats.map((s) => (
              <div key={s.label}>
                <div className="font-serif text-2xl font-medium text-white lg:text-3xl">{s.value}</div>
                <div className="mt-1 text-[12px] leading-snug text-[#8fb0ba]">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-9">
            <Link
              to="/bosh-shifokor"
              className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-medium text-white transition-colors hover:border-[#8fc7d4]/50 hover:bg-white/[0.08]"
            >
              Bosh shifokor haqida batafsil
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
