// Placeholder clinic team for "Vash Doktor". Replace names / photos / bios with
// the real team — `photo` can be a /public path once real portraits are added.

export interface Doctor {
  id: string;
  name: string;
  role: string;
  experience: string;
  bio: string;
  tags: string[];
  photo?: string; // optional /public image path; falls back to an initials avatar
}

export const DOCTORS: Doctor[] = [
  {
    id: 'bosh-shifokor',
    name: 'Dr. [Ism Familiya]',
    role: 'Bosh shifokor · Terapevt-stomatolog',
    experience: "15+ yil tajriba",
    bio: "Klinikaning bosh shifokori. Umumiy terapiya, karies va kanal davolashda mutaxassis. Har bir bemorga individual yondashuvni ta'minlaydi.",
    tags: ['Terapiya', 'Endodontiya', 'Profilaktika'],
  },
  {
    id: 'implantolog',
    name: 'Dr. [Ism Familiya]',
    role: 'Implantolog-jarroh',
    experience: "12+ yil tajriba",
    bio: "Implantatsiya va og'iz-jag' jarrohligi bo'yicha mutaxassis. Raqamli rejalashtirish va yo'naltirilgan jarrohlik texnikasini qo'llaydi.",
    tags: ['Implantatsiya', 'Jarrohlik', 'Suyak plastikasi'],
  },
  {
    id: 'ortodont',
    name: 'Dr. [Ism Familiya]',
    role: 'Ortodont',
    experience: "10+ yil tajriba",
    bio: "Tishlarni to'g'rilash bo'yicha mutaxassis. Breketlar va shaffof kappalar (aligner) bilan ishlaydi, bolalar va kattalarga xizmat ko'rsatadi.",
    tags: ['Breketlar', 'Aligner', 'Prikus'],
  },
  {
    id: 'bolalar-shifokori',
    name: 'Dr. [Ism Familiya]',
    role: 'Bolalar stomatologi',
    experience: "8+ yil tajriba",
    bio: "Bolalar stomatologiyasi bo'yicha mutaxassis. Bolalar uchun qo'rquvsiz va do'stona muhitda og'riqsiz davolashni ta'minlaydi.",
    tags: ['Bolalar', 'Profilaktika', 'Sut tishlari'],
  },
];
