import { Link } from 'react-router-dom';
import { UserRound, ArrowRight } from 'lucide-react';
import type { Doctor } from '../../lib/doctors';
import { TechnicalBadge } from '../ui/TechnicalBadge';

interface Props {
  doctors: Doctor[];
  eyebrow?: string;
  title: string;
  subtitle?: string;
  cta?: { label: string; to: string };
}

export function DoctorsSection({ doctors, eyebrow = 'Jamoa', title, subtitle, cta }: Props) {
  return (
    <section id="doctors" className="relative w-full border-t border-white/10 bg-[#0b1720] py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12">
        <div className="max-w-2xl" data-reveal>
          <TechnicalBadge label={eyebrow} variant="dark" />
          <h2 className="mt-6 font-serif text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[1.05] tracking-tight text-white">
            {title}
          </h2>
          {subtitle && <p className="mt-5 max-w-xl text-base leading-relaxed text-[#a7c2cb] sm:text-lg">{subtitle}</p>}
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" data-stagger>
          {doctors.map((d) => (
            <article
              key={d.id}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] transition-colors duration-300 hover:border-[#8fc7d4]/40"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[radial-gradient(ellipse_at_50%_35%,#123040,#0a141d)]">
                {d.photo ? (
                  <img src={d.photo} alt={d.name} className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <UserRound className="h-20 w-20 text-[#2f4a57]" strokeWidth={1} />
                  </div>
                )}
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
