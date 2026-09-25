import { Link } from 'react-router-dom';
import { ArrowRight, Award } from 'lucide-react';
import { FOUNDER } from '../../lib/founder';
import { Portrait } from '../ui/Portrait';
import { Eyebrow } from '../services/Eyebrow';
import { FLOW } from '../../lib/flow';

// the chief's implant-specific credentials, from the founder file
const CERTS = FOUNDER.certificates.filter((c) => /implant|All-on-4|augment|sinus|loading/i.test(c.title)).slice(0, 4);
const STATS = [FOUNDER.heroStats[1], FOUNDER.heroStats[3], FOUNDER.heroStats[0]]; // implants · osseointegration · years

/** Who places the implant — the chief doctor, with the numbers and papers. */
export function ImplantDoctor() {
  return (
    <section data-bg={FLOW.ink} className="relative w-full py-20 lg:py-28">
      <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-6 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:px-12">
        <figure className="mx-auto w-full max-w-sm lg:col-span-4 lg:max-w-none" data-reveal="left">
          <Portrait photo={FOUNDER.photo} name={FOUNDER.name} className="aspect-[4/5] w-full" />
        </figure>

        <div className="lg:col-span-7 lg:col-start-6" data-reveal="right">
          <Eyebrow>Kim o‘rnatadi</Eyebrow>
          <h2 className="mt-4 font-serif text-[clamp(1.9rem,4vw,3.1rem)] font-medium leading-[1.06] tracking-tight text-white">
            {FOUNDER.name}
          </h2>
          <p className="mt-2 text-[14px] text-[var(--c-accent)]">{FOUNDER.credentials}</p>

          <div className="mt-8 flex flex-wrap items-stretch divide-x divide-white/10 border-y border-white/10 py-6">
            {STATS.map((s) => (
              <div key={s.label} className="px-6 first:pl-0 last:pr-0">
                <div className="font-serif text-3xl font-medium leading-none text-white">{s.value}</div>
                <div className="mt-1.5 text-[12px] text-[var(--c-text-3)]">{s.label}</div>
              </div>
            ))}
          </div>

          <ul className="mt-6 grid gap-x-8 sm:grid-cols-2">
            {CERTS.map((c) => (
              <li key={c.title} className="flex items-start gap-3 border-b border-white/[0.07] py-3">
                <Award className="mt-0.5 h-4 w-4 shrink-0 text-[var(--c-accent)]/80" strokeWidth={1.6} />
                <span className="text-[14px] text-[var(--c-mist-2)]">
                  {c.title}
                  <span className="block text-[12px] text-[var(--c-text-4)]">
                    {c.place} · {c.year}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <Link
            to="/bosh-shifokor"
            className="group mt-7 inline-flex items-center gap-1.5 text-[14px] text-white underline decoration-white/25 underline-offset-[6px] transition-colors hover:decoration-[var(--c-accent)]"
          >
            Barcha {FOUNDER.certificatesTotal} sertifikat va yo‘li
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
