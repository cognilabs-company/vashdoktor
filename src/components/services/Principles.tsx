import { CLINIC_IMAGES } from '../../lib/services';
import { CountUp } from '../ui/CountUp';
import { Eyebrow } from './Eyebrow';
import { FLOW } from '../../lib/flow';

const PRINCIPLES = [
  {
    title: 'Avval ko‘rik, keyin reja',
    text: 'Rentgen yoki 3D skansiz davolashni boshlamaymiz. Taxmin bilan ishlash — bemorning vaqtini ham, pulini ham sarflaydi.',
  },
  {
    title: 'Og‘riqsiz — bu shior emas',
    text: 'Anesteziyani kompyuter boshqaruvida, sekin va bemorning holatiga qarab qilamiz. Ko‘pchilik ukolning o‘zini sezmaydi.',
  },
  {
    title: 'Narxni oldindan aytamiz',
    text: 'Reja bilan birga narx ham yoziladi. Davolash davomida “yana shuni ham qilish kerak ekan” bo‘lmaydi — bo‘lsa, avval siz bilan gaplashamiz.',
  },
  {
    title: 'Yozma kafolat',
    text: 'Plombadan implantgacha — har bir ish uchun muddat va bepul nazorat ko‘riklari yozib beriladi.',
  },
  {
    title: 'Bola ham, buvi ham',
    text: 'Bolalar shifokoridan implantologgacha bir joyda. Oilaviy kartochka — hamma tarix bitta joyda saqlanadi.',
  },
];

/** The way we work, said plainly: a sticky note on the left, five short
 * principles on the right. */
export function Principles() {
  return (
    <section data-bg={FLOW.green} className="relative w-full py-20 lg:py-28">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-6 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:px-12">
        <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start" data-reveal="left">
          <Eyebrow>Qanday ishlaymiz</Eyebrow>
          <h2 className="mt-5 font-serif text-[clamp(1.9rem,4vw,3.1rem)] font-medium leading-[1.06] tracking-tight text-white">
            Biz shunchaki tish davolamaymiz —<br className="hidden sm:block" /> odam bilan ishlaymiz.
          </h2>

          <figure className="mt-9 max-w-md">
            <img
              src={CLINIC_IMAGES.interior}
              alt="Davolash kabineti"
              loading="lazy"
              referrerPolicy="no-referrer"
              className="aspect-[4/3] w-full rounded-2xl border border-white/10 object-cover"
            />
            <figcaption className="mt-3 text-[12px] text-[#7f9aa4]">Davolash kabineti.</figcaption>
          </figure>

          <div className="mt-9 flex items-baseline gap-8 border-t border-white/10 pt-6">
            <div>
              <div className="font-serif text-3xl font-medium text-white">
                <CountUp value="20 000+" />
              </div>
              <div className="mt-1 text-[12px] text-[#7f9aa4]">bemor, 2019-yildan beri</div>
            </div>
            <div>
              <div className="font-serif text-3xl font-medium text-white">
                <CountUp value="15+" />
              </div>
              <div className="mt-1 text-[12px] text-[#7f9aa4]">yillik amaliyot</div>
            </div>
          </div>
        </div>

        <ol className="border-t border-white/10 lg:col-span-6 lg:col-start-7" data-stagger>
          {PRINCIPLES.map((p, i) => (
            <li key={p.title} className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-b border-white/10 py-7">
              <span className="font-serif text-[13px] text-[#5c7580]">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="font-serif text-xl font-medium leading-snug tracking-tight text-white">{p.title}</h3>
                <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-[#a7c2cb]">{p.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
