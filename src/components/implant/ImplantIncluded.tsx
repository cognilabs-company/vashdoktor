import { Check, Plus } from 'lucide-react';
import { Eyebrow } from '../services/Eyebrow';
import { FLOW } from '../../lib/flow';

const INCLUDED = [
  '3D skan va raqamli reja',
  'Titan implant (Yevropa / Koreya tizimlari)',
  'Abutment va keramik crown',
  'Anesteziya va o‘rnatish',
  '1 yil nazorat ko‘riklari',
  'Yozma kafolat',
];
const EXTRA = ['Suyak plastikasi — suyak yetishmasa', 'Sinus lifting — yuqori jag‘da', 'Vaqtinchalik tish — bitish davriga'];

/** What the price covers — so there are no surprises later. */
export function ImplantIncluded() {
  return (
    <section data-bg={FLOW.green} className="relative w-full py-20 lg:py-28">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-6 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:px-12">
        <div className="lg:col-span-5" data-reveal="left">
          <Eyebrow>Narx</Eyebrow>
          <h2 className="mt-4 font-serif text-[clamp(1.9rem,4vw,3.1rem)] font-medium leading-[1.06] tracking-tight text-white">
            Narxga nima kiradi
          </h2>
          <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-[#8fb0ba]">
            Aniq summa — 3D skandan keyin, bir varaqda. Keyin o‘zgarmaydi.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:col-span-7" data-stagger>
          <ul className="border-t border-[#8fc7d4]/40">
            <li className="py-3 font-serif text-[13px] text-[#8fc7d4]">Kiradi</li>
            {INCLUDED.map((x) => (
              <li key={x} className="flex items-start gap-3 border-t border-white/[0.07] py-3.5 text-[15px] text-white">
                <Check className="mt-1 h-4 w-4 shrink-0 text-[#8fc7d4]" strokeWidth={2} />
                {x}
              </li>
            ))}
          </ul>
          <ul className="border-t border-white/15">
            <li className="py-3 font-serif text-[13px] text-[#7f9aa4]">Kerak bo‘lsa, alohida</li>
            {EXTRA.map((x) => (
              <li key={x} className="flex items-start gap-3 border-t border-white/[0.07] py-3.5 text-[15px] text-[#c6dbe1]">
                <Plus className="mt-1 h-4 w-4 shrink-0 text-[#5c7580]" strokeWidth={2} />
                {x}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
