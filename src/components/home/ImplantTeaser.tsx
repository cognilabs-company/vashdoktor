import { Link } from 'react-router-dom';
import { ArrowRight, Rotate3d } from 'lucide-react';
import { getFrameSrc } from '../../lib/dentalSequence';
import { Eyebrow } from '../services/Eyebrow';
import { FLOW } from '../../lib/flow';

interface Props {
  onOpen3DViewer: () => void;
}

/** A short door into the implant experience — the full 3D story lives on
 * /implantatsiya so the home page stays about the whole clinic. */
export function ImplantTeaser({ onOpen3DViewer }: Props) {
  return (
    <section data-bg={FLOW.teal} className="relative w-full overflow-hidden">
      {/* bridge from the opaque 3D section above */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0a141d] to-transparent" />
      <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-6 py-16 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:px-12 lg:py-20">
        <figure className="relative lg:col-span-6" data-reveal="left">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8fc7d4]/10 blur-[90px]" />
          <img
            src={getFrameSrc(195)}
            alt="Implant o‘rnatilgan jag‘ — 3D model"
            loading="lazy"
            className="relative mx-auto w-full max-w-[640px] object-contain"
          />
        </figure>

        <div className="lg:col-span-5 lg:col-start-8" data-reveal="right">
          <Eyebrow>Implantatsiya</Eyebrow>
          <h2 className="mt-5 font-serif text-[clamp(1.9rem,3.6vw,2.8rem)] font-medium leading-[1.06] tracking-tight text-white">
            Implant qanday tuzilgan? Beshta qism, bitta vazifa.
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#a7c2cb]">
            Titan ildiz + keramik tish — 3D modelda.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              to="/implantatsiya"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-[#0a141d] transition-colors hover:bg-[#e8f2f4]"
            >
              Implantatsiya sahifasi
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <button
              onClick={onOpen3DViewer}
              className="group inline-flex items-center gap-1.5 text-sm text-[#c6dbe1] underline decoration-white/25 underline-offset-[6px] transition-colors hover:text-white hover:decoration-[#8fc7d4]"
            >
              <Rotate3d className="h-4 w-4 text-[#8fc7d4]" />
              3D modelni aylantirish
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
