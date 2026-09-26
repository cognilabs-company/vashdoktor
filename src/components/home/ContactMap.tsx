import { ArrowRight, ArrowUpRight, Clock, MapPin, Phone, Send } from 'lucide-react';
import { CLINIC_CONFIG } from '../../lib/clinicConfig';
import { Eyebrow } from '../services/Eyebrow';
import { FLOW } from '../../lib/flow';

interface Props {
  onOpenConsultation: () => void;
}

/** Where we are and how to reach us — the map, the phone, the hours, and the
 * one button that matters. Closes the home page. */
export function ContactMap({ onOpenConsultation }: Props) {
  const m = CLINIC_CONFIG.map;
  const d = 0.008;
  const embed = m
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${m.lng - d * 1.6}%2C${m.lat - d}%2C${m.lng + d * 1.6}%2C${m.lat + d}&layer=mapnik&marker=${m.lat}%2C${m.lng}`
    : null;
  const mapsLink = m
    ? `https://www.google.com/maps/search/?api=1&query=${m.lat}%2C${m.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CLINIC_CONFIG.address)}`;

  return (
    <section id="contact" data-bg={FLOW.green} data-scroll className="relative w-full py-20 lg:py-28">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-6 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:px-12">
        <div className="sp-rise lg:col-span-5">
          <Eyebrow>Manzil</Eyebrow>
          <h2 className="mt-5 font-serif text-[clamp(1.9rem,4vw,3.1rem)] font-medium leading-[1.06] tracking-tight text-white">
            Kelish oson. Yozilish undan ham oson.
          </h2>

          <dl className="mt-9 border-t border-white/10">
            <div className="grid grid-cols-[1.5rem_1fr] gap-x-4 border-b border-white/10 py-4">
              <MapPin className="mt-0.5 h-4 w-4 text-[var(--c-accent)]" />
              <div>
                <dd className="text-[15px] text-white">{CLINIC_CONFIG.address}</dd>
                {m && <dd className="mt-1 text-[13px] leading-relaxed text-[var(--c-text-3)]">{m.directions}</dd>}
                <a
                  href={mapsLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-[13px] text-[var(--c-accent-2)] underline decoration-[var(--c-accent)]/40 underline-offset-4 hover:decoration-[var(--c-accent)]"
                >
                  Xaritada ochish <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
            <div className="grid grid-cols-[1.5rem_1fr] gap-x-4 border-b border-white/10 py-4">
              <Clock className="mt-0.5 h-4 w-4 text-[var(--c-accent)]" />
              <dd className="text-[15px] text-white">{CLINIC_CONFIG.hours}</dd>
            </div>
            <div className="grid grid-cols-[1.5rem_1fr] gap-x-4 border-b border-white/10 py-4">
              <Phone className="mt-0.5 h-4 w-4 text-[var(--c-accent)]" />
              <dd>
                <a href={`tel:${CLINIC_CONFIG.phone}`} className="text-[15px] text-white hover:text-[var(--c-accent)]">
                  {CLINIC_CONFIG.phone}
                </a>
              </dd>
            </div>
            <div className="grid grid-cols-[1.5rem_1fr] gap-x-4 border-b border-white/10 py-4">
              <Send className="mt-0.5 h-4 w-4 text-[var(--c-accent)]" />
              <dd>
                <a href={CLINIC_CONFIG.socials.telegram} target="_blank" rel="noreferrer" className="text-[15px] text-white hover:text-[var(--c-accent)]">
                  Telegram
                </a>
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <button
              onClick={onOpenConsultation}
              className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-[var(--c-bg)] transition-colors hover:bg-[var(--c-mist)]"
            >
              Qabulga yozilish
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        <figure
          data-scroll
          className="sp-3d lg:col-span-7"
          style={{ ['--sp-persp' as string]: '1900px', ['--sp-tilt' as string]: '48deg', ['--sp-depth' as string]: '210px', ['--sp-rise' as string]: '140px' }}
        >
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-[var(--c-bg-3)]">
            {embed ? (
              <iframe
                title="Klinika xaritada"
                src={embed}
                loading="lazy"
                className="sp-drift block h-[380px] w-full grayscale-[0.35] contrast-[1.05] lg:h-[520px]"
              />
            ) : (
              <div className="flex h-[380px] items-center justify-center text-sm text-[var(--c-text-5)] lg:h-[520px]">Xarita qo‘shiladi</div>
            )}
          </div>
        </figure>
      </div>
    </section>
  );
}
