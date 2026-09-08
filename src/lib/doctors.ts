// Clinic team = the founder's "school". The founder himself lives in founder.ts
// and is featured separately. Each team member carries a `relation` line so the
// founder's authority flows into the clinic instead of being split away.
// Replace names / photos / bios with the real staff.

export interface Doctor {
  id: string;
  name: string;
  role: string;
  experience: string;
  bio: string;
  tags: string[];
  relation: string; // ties them to the chief doctor / clinic school
  photo?: string; // optional /public path; falls back to a placeholder
}

export const DOCTORS: Doctor[] = [
  {
    id: 'implantolog',
    name: 'Dr. [Ism Familiya]',
    role: 'Implantolog-jarroh',
    experience: '12+ yil tajriba',
    bio: "Implantatsiya va og'iz-jag' jarrohligi bo'yicha mutaxassis. Raqamli rejalashtirish va yo'naltirilgan jarrohlik texnikasini qo'llaydi.",
    tags: ['Implantatsiya', 'Jarrohlik', 'Suyak plastikasi'],
    relation: 'Bosh shifokor rahbarligida ishlaydi',
  },
  {
    id: 'ortodont',
    name: 'Dr. [Ism Familiya]',
    role: 'Ortodont',
    experience: '10+ yil tajriba',
    bio: "Tishlarni to'g'rilash bo'yicha mutaxassis. Breketlar va shaffof kappalar (aligner) bilan ishlaydi.",
    tags: ['Breketlar', 'Aligner', 'Prikus'],
    relation: 'Klinikaning ichki o‘quv dasturidan o‘tgan',
  },
  {
    id: 'terapevt',
    name: 'Dr. [Ism Familiya]',
    role: 'Terapevt-stomatolog',
    experience: '8+ yil tajriba',
    bio: "Karies, kanal davolash va profilaktika bo'yicha mutaxassis. Og'riqsiz davolashni ta'minlaydi.",
    tags: ['Terapiya', 'Endodontiya', 'Profilaktika'],
    relation: 'Bosh shifokor rahbarligida ishlaydi',
  },
  {
    id: 'bolalar-shifokori',
    name: 'Dr. [Ism Familiya]',
    role: 'Bolalar stomatologi',
    experience: '8+ yil tajriba',
    bio: "Bolalar uchun qo'rquvsiz va do'stona muhitda og'riqsiz davolashni ta'minlaydi.",
    tags: ['Bolalar', 'Profilaktika', 'Sut tishlari'],
    relation: 'Klinikaning ichki o‘quv dasturidan o‘tgan',
  },
];
