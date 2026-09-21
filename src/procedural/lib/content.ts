// Section content for the scroll-driven implant story. Title lines are explicit
// display type (not flowed text). The 3D object is an enhancement — every
// component description below also lives in semantic DOM.

export type Layout = 'flank' | 'left' | 'right' | 'center';

export interface Stat {
  value: string;
  label: string;
}

export interface Section {
  id: string;
  eyebrow: string;
  title: string[];
  body: string;
  stats?: Stat[];
  cta?: string;
  layout: Layout;
  /** scroll length of the section in vh (also sets its share of overall progress). */
  vh: number;
}

export const SECTIONS: Section[] = [
  {
    id: 'hero',
    eyebrow: 'Premium implantologiya',
    title: ['Bitta tizim.', 'Butun bir tabassum.'],
    body: 'To‘liq yig‘ilgan implant tizimi — keramik crown’dan titanium ildizigacha. Har bir detal uzoq muddat va tabiiy his uchun.',
    cta: 'Konsultatsiyaga yozilish',
    layout: 'right',
    vh: 110,
  },
  {
    id: 'anatomy',
    eyebrow: 'Anatomiya',
    title: ['Beshta qism —', 'bitta vazifa.'],
    body: 'Crown, abutment, titanium implant, gingiva va jag‘ suyagi — birgalikda ishlaydi.',
    stats: [
      { value: '5', label: 'Komponent' },
      { value: 'Grade IV', label: 'Titanium' },
      { value: '~95%', label: '10 yillik barqarorlik' },
    ],
    layout: 'left',
    vh: 300,
  },
  {
    id: 'crown',
    eyebrow: '01 — Crown',
    title: ['Keramik', 'tish qismi.'],
    body: 'Ko‘rinadigan keramik tish. Tabiiy shakl, rang va funksiyani tiklaydi — anatomik cusp’lar va tabiiy emal yaltiroqligi bilan.',
    layout: 'right',
    vh: 96,
  },
  {
    id: 'abutment',
    eyebrow: '02 — Abutment',
    title: ['Aniq', 'bog‘lovchi.'],
    body: 'Crown va fixture orasidagi precision connector. Titanium tayanch tishning burchagi va chiqish profilini shakllantiradi.',
    layout: 'left',
    vh: 84,
  },
  {
    id: 'screw',
    eyebrow: '03 — Screw',
    title: ['Ichki', 'fiksatsiya.'],
    body: 'Abutment’ni fixture’ga mahkam tortadigan titanium vint. Belgilangan moment bilan qotiriladi — uzoq muddatli barqarorlik uchun.',
    layout: 'left',
    vh: 80,
  },
  {
    id: 'implant',
    eyebrow: '04 — Fixture',
    title: ['Titanium', 'ildiz.'],
    body: 'Jag‘ suyagiga o‘rnatiladigan asosiy titanium tayanch. Biouyg‘un Grade IV titanium — suyak bilan osseointegratsiya uchun.',
    stats: [
      { value: '4.0 mm', label: 'Diametr' },
      { value: '10–13 mm', label: 'Uzunlik' },
    ],
    layout: 'left',
    vh: 88,
  },
  {
    id: 'threads',
    eyebrow: '05 — Rezbalar',
    title: ['Birlamchi', 'barqarorlik.'],
    body: 'Spiral rezbalar suyak ichida mexanik ushlanishni ta’minlaydi — o‘rnatilgan zahoti birlamchi mustahkamlik beradi.',
    layout: 'right',
    vh: 78,
  },
  {
    id: 'complete',
    eyebrow: 'Yakuniy natija',
    title: ['Qayta yig‘ildi.', 'Tabiiy tabassum.'],
    body: 'Har bir komponent joyiga qaytadi — mustahkamlik, qulaylik va tabiiy estetika uchun ishlaydigan yagona tizim.',
    cta: 'Konsultatsiyaga yozilish',
    layout: 'center',
    vh: 130,
  },
];

export const TOTAL_VH = SECTIONS.reduce((s, x) => s + x.vh, 0);

export interface SectionRange {
  index: number;
  start: number; // overall-progress start (0..1)
  end: number;
  center: number;
  layout: Layout;
}

/** Overall-progress window each section occupies, from its vh share. */
export const SECTION_RANGES: SectionRange[] = (() => {
  const out: SectionRange[] = [];
  let acc = 0;
  for (let i = 0; i < SECTIONS.length; i++) {
    const start = acc / TOTAL_VH;
    acc += SECTIONS[i].vh;
    const end = acc / TOTAL_VH;
    out.push({ index: i, start, end, center: (start + end) / 2, layout: SECTIONS[i].layout });
  }
  return out;
})();

/** Object horizontal placement per layout — opposite the text so they never overlap. */
export function layoutToObjectX(layout: Layout): number {
  switch (layout) {
    case 'right':
      return -1.75; // text right → object left
    case 'left':
      return 1.75; // text left → object right
    default:
      return 0; // center / flank
  }
}
