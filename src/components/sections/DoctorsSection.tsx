import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap } from 'lucide-react';
import type { Doctor } from '../../lib/doctors';
import { FOUNDER } from '../../lib/founder';
import { TechnicalBadge } from '../ui/TechnicalBadge';
import { Portrait } from '../ui/Portrait';

interface Props {
  doctors: Doctor[];
  eyebrow?: string;
  title: string;
  subtitle?: string;
  cta?: { label: string; to: string };
  featureFounder?: boolean; // show the founder as a prominent first card (doctors page)
}

export function DoctorsSection({ doctors, eyebrow = 'Jamoa', title, subtitle, cta, featureFounder }: Props) {
  return (
    <section id="doctors" className="relative w-full border-t border-white/10 bg-[#0b1720] py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12">
        <div className="max-w-2xl" data-reveal="left">
          <TechnicalBadge label={eyebrow} variant="dark" />
          <h2 className="mt-6 font-serif text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[1.05] tracking-tight text-white">
            {title}
          </h2>
          {subtitle && <p className="mt-5 max-w-xl text-base leading-relaxed text-[#a7c2cb] sm:text-lg">{subtitle}</p>}
        </div>

        {/* founder — prominent first card */}
        {featureFounder && (
          <div className="mt-12 grid items-center gap-8 overflow-hidden rounded-3xl border border-[#8fc7d4]/25 bg-[linear-gradient(150deg,#0f2836,#0a141d)] p-6 md:grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)] md:gap-10 md:p-8">
            <div data-reveal="left">
              <Portrait photo={FOUNDER.photo} name={FOUNDER.name} className="aspect-[4/5] w-full max-w-[280px] md:max-w-none" />
            </div>
            <div data-reveal="right">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#8fc7d4]/12 px-3 py-1 text-[11px] font-medium text-[#a9d8e4] ring-1 ring-white/10">
                {FOUNDER.title}
              </span>
              <h3 className="mt-4 font-serif text-[clamp(1.6rem,3vw,2.5rem)] font-medium leading-tight tracking-tight text-white">
                {FOUNDER.name}
              </h3>
              <p className="mt-1.5 text-sm text-[#8fc7d4]">{FOUNDER.credentials}</p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#a7c2cb]">{FOUNDER.statement}</p>
              <div className="mt-6 flex flex-wrap gap-6">
                {FOUNDER.heroStats.slice(0, 3).map((s) => (
                  <div key={s.label}>
                    <div className="font-serif text-xl font-medium text-white">{s.value}</div>
                    <div className="text-[11px] text-[#8fb0ba]">{s.label}</div>
                  </div>
                ))}
              </div>
              <Link
                to="/bosh-shifokor"
                className="group mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-[#8fc7d4]/50"
              >
                Batafsil
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        )}

        {/* team grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" data-stagger>
          {doctors.map((d) => (
            <article
              key={d.id}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] transition-colors duration-300 hover:border-[#8fc7d4]/40"
            >
              <div className="relative aspect-[4/5] w-full">
                <Portrait photo={d.photo} name={d.name} rounded="rounded-none" className="h-full w-full" />
                <span className="absolute bottom-3 left-3 rounded-full bg-[#0a141d]/70 px-3 py-1 text-[11px] font-medium text-[#a9d8e4] backdrop-blur-md ring-1 ring-white/10">
                  {d.experience}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-lg font-medium leading-snug tracking-tight text-white">{d.name}</h3>
                <p className="mt-1 text-[13px] font-medium text-[#8fc7d4]">{d.role}</p>
                <p className="mt-3 text-[13px] leading-relaxed text-[#a7c2cb]">{d.bio}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {d.tags.map((t) => (
                    <span key={t} className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] text-[#8fb0ba] ring-1 ring-white/10">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-1.5 border-t border-white/10 pt-3 text-[11px] text-[#7f9aa4]">
                  <GraduationCap className="h-3.5 w-3.5 text-[#8fc7d4]/70" />
                  {d.relation}
                </div>
              </div>
            </article>
          ))}
        </div>

        {cta && (
          <div className="mt-12 flex justify-center" data-reveal>
            <Link
              to={cta.to}
              className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-medium text-white transition-colors hover:border-[#8fc7d4]/50 hover:bg-white/[0.08]"
            >
              {cta.label}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
