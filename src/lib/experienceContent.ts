export type SectionLayout = 'left' | 'right' | 'flank' | 'center';

export interface StatCard {
  value: string;
  label: string;
}

export interface SectionDef {
  id: string;
  eyebrow: string;
  title: string[]; // explicit lines
  body: string;
  cta?: string;
  stats?: StatCard[];
  layout: SectionLayout;
  /** scroll length of this section, in vh (exploded is the longest) */
  vh: number;
}

export const SECTIONS: SectionDef[] = [
  {
    id: 'hero',
    eyebrow: 'Zamonaviy implantologiya',
    title: ['Tabiiy tabassum.', 'Aniq texnologiya.'],
    body: 'Har bir detal uzoq muddatli natija va tabiiy his uchun yaratilgan.',
    cta: 'Konsultatsiyaga yozilish',
    layout: 'right',
    vh: 130,
  },
  {
    id: 'technology',
    eyebrow: 'Mahsulot',
    title: ['Bitta detalda', 'mukammal muvozanat.'],
    body: 'Implant konstruksiyasi kundalik yuklamalarga bardosh berish uchun ishlab chiqilgan.',
    layout: 'left',
    vh: 150,
  },
  {
    id: 'exploded',
    eyebrow: 'Anatomiya',
    title: ['Har bir qism —', 'aniq vazifa.'],
    body: 'Crown, abutment va titanium implant birgalikda bitta tabiiy tish hosil qiladi.',
    layout: 'left',
    vh: 260,
  },
  {
    id: 'implant',
    eyebrow: '01 / Titanium',
    title: ['Suyak bilan', 'mustahkam bog‘lanish.'],
    body: 'Implant geometriyasi jag‘ suyagida barqaror joylashish uchun ishlab chiqilgan.',
    stats: [
      { value: 'Grade IV', label: 'Titanium' },
      { value: '4 mm', label: 'Typical diameter' },
      { value: '10–12 mm', label: 'Typical length' },
    ],
    layout: 'right',
    vh: 170,
  },
  {
    id: 'connection',
    eyebrow: '02 / Connection',
    title: ['Aniq ulanish.', 'Tabiiy natija.'],
    body: 'Abutment implant va keramika crown orasida mustahkam va aniq ulanish hosil qiladi.',
    layout: 'left',
    vh: 160,
  },
  {
    id: 'crown',
    eyebrow: '03 / Estetika',
    title: ['Tabiiy ko‘rinish.'],
    body: 'Keramik crown tabiiy tish shakli, rangi va funksiyasini qayta tiklash uchun yaratiladi.',
    layout: 'right',
    vh: 160,
  },
  {
    id: 'complete',
    eyebrow: 'Yakuniy natija',
    title: ['Bir tizim.', 'Bitta tabiiy tabassum.'],
    body: 'Har bir komponent birgalikda ishlaydi — mustahkamlik, qulaylik va tabiiy estetika uchun.',
    cta: 'Konsultatsiyaga yozilish',
    layout: 'center',
    vh: 150,
  },
];

export interface AnnotationDef {
  id: string;
  node: string; // GLB node name it follows
  /** local-space anchor offset from the node origin (model units) */
  anchor: [number, number, number];
  title: string;
  description: string;
  side: 'left' | 'right';
  /** which explode value gates its visibility */
  gate: 'crownExplode' | 'abutmentExplode' | 'implantExplode' | 'explodeProgress';
}

export const ANNOTATIONS: AnnotationDef[] = [
  { id: 'crown', node: 'Crown', anchor: [-0.4, 0.35, 0], title: 'Crown', description: 'Tishning ko‘rinadigan keramik qismi. Tabiiy shakl va estetikani tiklaydi.', side: 'left', gate: 'crownExplode' },
  { id: 'abutment', node: 'Abutment', anchor: [0.35, 0.12, 0], title: 'Abutment', description: 'Crown va implant orasidagi aniq bog‘lovchi qism.', side: 'right', gate: 'abutmentExplode' },
  { id: 'gum', node: 'Gum', anchor: [-0.75, 0.05, 0], title: 'Gingiva', description: 'Implant atrofidagi yumshoq to‘qima va tabiiy tish chiqish profilini shakllantiradi.', side: 'left', gate: 'explodeProgress' },
  { id: 'implant', node: 'Implant', anchor: [0.4, 0.45, 0], title: 'Titanium Implant', description: 'Jag‘ suyagiga joylashtiriladigan asosiy titanium tayanch.', side: 'right', gate: 'implantExplode' },
  { id: 'bone', node: 'Bone', anchor: [-1.0, -0.5, 0], title: 'Jaw Bone', description: 'Implantni o‘rab turuvchi va uning uzoq muddatli tayanchini ta’minlovchi suyak.', side: 'left', gate: 'explodeProgress' },
  { id: 'threads', node: 'Implant', anchor: [0.35, -0.7, 0], title: 'Implant Threads', description: 'Suyak ichida birlamchi mustahkamlikni ta’minlaydigan spiral geometriya.', side: 'right', gate: 'implantExplode' },
];
