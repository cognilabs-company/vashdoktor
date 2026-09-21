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

// TEMPORARY stock portraits (Unsplash) until real staff photos land in /public.
// `crop=faces` keeps the face centred at any aspect ratio the cards use.
const stock = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=faces&w=900&q=80`;

export const DOCTORS: Doctor[] = [
  {
    id: 'implantolog',
    photo: stock('1622253692010-333f2da6031d'),
    name: 'Dr. [Ism Familiya]',
    role: 'Implantolog-jarroh',
    experience: '12+ yil tajriba',
    bio: "Implantatsiya va og'iz-jag' jarrohligi bo'yicha mutaxassis. Raqamli rejalashtirish va yo'naltirilgan jarrohlik texnikasini qo'llaydi.",
    tags: ['Implantatsiya', 'Jarrohlik', 'Suyak plastikasi'],
    relation: 'Bosh shifokor rahbarligida ishlaydi',
  },
  {
    id: 'ortodont',
    photo: stock('1594824476967-48c8b964273f'),
    name: 'Dr. [Ism Familiya]',
    role: 'Ortodont',
    experience: '10+ yil tajriba',
    bio: "Tishlarni to'g'rilash bo'yicha mutaxassis. Breketlar va shaffof kappalar (aligner) bilan ishlaydi.",
    tags: ['Breketlar', 'Aligner', 'Prikus'],
    relation: 'Klinikaning ichki o‘quv dasturidan o‘tgan',
  },
  {
    id: 'terapevt',
    photo: stock('1559839734-2b71ea197ec2'),
    name: 'Dr. [Ism Familiya]',
    role: 'Terapevt-stomatolog',
    experience: '8+ yil tajriba',
    bio: "Karies, kanal davolash va profilaktika bo'yicha mutaxassis. Og'riqsiz davolashni ta'minlaydi.",
    tags: ['Terapiya', 'Endodontiya', 'Profilaktika'],
    relation: 'Bosh shifokor rahbarligida ishlaydi',
  },
  {
    id: 'bolalar-shifokori',
    photo: stock('1651008376811-b90baee60c1f'),
    name: 'Dr. [Ism Familiya]',
    role: 'Bolalar stomatologi',
    experience: '8+ yil tajriba',
    bio: "Bolalar uchun qo'rquvsiz va do'stona muhitda og'riqsiz davolashni ta'minlaydi.",
    tags: ['Bolalar', 'Profilaktika', 'Sut tishlari'],
    relation: 'Klinikaning ichki o‘quv dasturidan o‘tgan',
  },
];

/* -------------------------------------------------------------------------- */
/*  Doctors-page content                                                       */
/* -------------------------------------------------------------------------- */

/** "Which doctor do I need?" — everyday complaints mapped to a team member.
 * `doctorId` = a DOCTORS id, or 'founder' for the chief doctor.
 * Icons are lucide-react names, resolved in the UI. */
export interface CareGuideItem {
  icon: string;
  problem: string;
  hint: string;
  doctorId: string;
}

export const CARE_GUIDE: CareGuideItem[] = [
  { icon: 'Zap', problem: "Tish og'riyapti yoki karies bor", hint: 'Karies, kanal davolash, plombalar — birinchi navbatda terapevtga.', doctorId: 'terapevt' },
  { icon: 'Sparkles', problem: 'Profilaktik ko‘rik va tozalash', hint: 'Yiliga 2 marta ko‘rik va professional gigiena.', doctorId: 'terapevt' },
  { icon: 'Anchor', problem: 'Tish yo‘q yoki olib tashlash kerak', hint: 'Implantatsiya, suyak plastikasi va jarrohlik.', doctorId: 'implantolog' },
  { icon: 'AlignHorizontalDistributeCenter', problem: 'Tishlar qiyshiq, prikus noto‘g‘ri', hint: 'Breketlar yoki shaffof kappalar bilan to‘g‘rilash.', doctorId: 'ortodont' },
  { icon: 'Baby', problem: 'Bola tishlari', hint: 'Sut tishlari, birinchi tashrif, qo‘rquvsiz davolash.', doctorId: 'bolalar-shifokori' },
  { icon: 'Stethoscope', problem: 'Murakkab holat yoki ikkinchi fikr', hint: 'Bosh shifokor bilan konsultatsiya va jamoaviy ko‘rib chiqish.', doctorId: 'founder' },
];

/** Doctors-page FAQ — questions patients ask about the team itself. */
export const DOCTORS_FAQ: { question: string; answer: string }[] = [
  {
    question: 'Shifokorni o‘zim tanlay olamanmi?',
    answer: 'Ha. Yozilayotganda istagan shifokoringizni ayting. Agar ishonchingiz komil bo‘lmasa, administrator shikoyatingizga qarab mos mutaxassisni tavsiya qiladi — protokollar bir xil bo‘lgani uchun sifat o‘zgarmaydi.',
  },
  {
    question: 'Bosh shifokor qabuliga qanday yoziladi?',
    answer: 'Bosh shifokor murakkab holatlar, implantatsiya va kompleks tiklashni qabul qiladi. Konsultatsiya so‘rovida "bosh shifokor" deb belgilang — administrator eng yaqin bo‘sh vaqtni taklif qiladi. Boshqa shifokorlarning murakkab holatlari ham u bilan birga ko‘rib chiqiladi.',
  },
  {
    question: 'Davolash davomida shifokor almashsa-chi?',
    answer: 'Barcha shifokorlar bitta maktabdan o‘tgan va yagona protokollar bo‘yicha ishlaydi. Bemor kartasi raqamli, shuning uchun har qanday shifokor davolashni aynan to‘xtagan joyidan davom ettiradi.',
  },
  {
    question: 'Bola bilan birinchi tashrif qanday o‘tadi?',
    answer: 'Birinchi tashrif — tanishuv: bolalar shifokori kabinetni, asboblarni o‘yin shaklida ko‘rsatadi, ko‘rik og‘riqsiz va qisqa bo‘ladi. Davolash kerak bo‘lsa, u keyingi tashrifga rejalashtiriladi — bola qo‘rqmasligi uchun.',
  },
  {
    question: 'Shifokorlarning malakasini qayerdan ko‘rish mumkin?',
    answer: 'Bosh shifokorning diplom va sertifikatlari uning sahifasida to‘liq keltirilgan. Har bir shifokorning hujjatlari klinikada, qabulxonada mavjud — so‘rasangiz, ko‘rsatamiz.',
  },
];
