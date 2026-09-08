// The founder / chief doctor — the trust layer of the "author clinic".
// Everything here is placeholder: replace name, photo, dates, certificates and
// the personal statement with the real founder's data. `photo` = a /public path.

export interface TimelineItem {
  year: string;
  title: string;
  text: string;
}

export interface Certificate {
  title: string;
  place: string; // "Bazel, Shveytsariya"
  year: string;
  gain: string; // half-line: what it gave
}

export interface ScienceItem {
  kind: 'Ilmiy ish' | 'Konferensiya' | 'Ustozlik';
  title: string;
  detail: string;
}

export const FOUNDER = {
  name: 'Dr. [Ism Familiya]',
  title: 'Asoschi va bosh shifokor',
  // shown on the chief-doctor page under the name
  credentials: 'Stomatolog-implantolog · Oliy toifali mutaxassis',
  photo: '', // e.g. '/team/founder.jpg' — leave empty to show the placeholder frame
  // 2–3 sentence personal statement — WHY this clinic exists (in the founder's voice)
  statement:
    "Men klinikani bitta oddiy ishonch ustiga qurdim: har bir bemor xuddi o'z oilam a'zosidek qabul qilinishi kerak. 20 yillik amaliyot davomida shuni angladim — texnologiya muhim, lekin eng muhimi — odamga bo'lgan munosabat. Shuning uchun bu yerda har bir davolash men shaxsan ishonadigan standartlar asosida olib boriladi.",

  heroStats: [
    { value: '20+', label: "yillik amaliyot" },
    { value: '6 000+', label: "qo'yilgan implant" },
    { value: '9', label: 'malaka oshirgan davlat' },
    { value: '99%', label: 'osseointegratsiya darajasi' },
  ] as { value: string; label: string }[],

  timeline: [
    { year: '2005', title: 'Toshkent Tibbiyot Akademiyasi', text: "Stomatologiya fakultetini tamomlagan." },
    { year: '2008', title: 'Rezidentura — ortopedik stomatologiya', text: "Protezlash va tiklash yo'nalishida ixtisoslashgan." },
    { year: '2011', title: 'Birinchi kabinet', text: "Mustaqil amaliyotni boshlagan." },
    { year: '2014', title: 'Implantologiya bo‘yicha xalqaro malaka', text: 'Yevropa implantologiya markazlarida o‘qigan.' },
    { year: '2019', title: '"Vash Doktor" klinikasi', text: "Hozirgi klinika ochilgan — o'z jamoasi va standartlari bilan." },
    { year: '2023', title: 'Ustozlik va o‘quv dasturi', text: "Yosh shifokorlar uchun ichki o'quv dasturini yo'lga qo'ygan." },
  ] as TimelineItem[],

  specializations: [
    'Dental implantatsiya (bir bosqichli va klassik)',
    "Suyak plastikasi va sinus lifting",
    'Ortopedik tiklash — vinir, kron, protez',
    "Murakkab klinik holatlarni kompleks davolash",
    'Raqamli tabassum dizayni',
  ],

  // Featured certificates (6–8). The rest live behind "Barcha sertifikatlar (N)".
  certificates: [
    { title: 'Straumann implant tizimi', place: 'Bazel, Shveytsariya', year: '2021', gain: 'Premium implant protokoli' },
    { title: 'All-on-4 kompleks tiklash', place: 'Lissabon, Portugaliya', year: '2020', gain: "To'liq adentiya yechimi" },
    { title: 'Suyak augmentatsiyasi (GBR)', place: 'Frankfurt, Germaniya', year: '2019', gain: 'Suyak yetishmovchiligida implant' },
    { title: 'Raqamli implantologiya', place: 'Seul, Janubiy Koreya', year: '2022', gain: "Yo'naltirilgan jarrohlik" },
    { title: 'Estetik ortopediya', place: 'Milan, Italiya', year: '2018', gain: 'Tabiiy tabassum dizayni' },
    { title: 'Sinus lifting texnikalari', place: 'Vena, Avstriya', year: '2020', gain: "Yuqori jag' implantatsiyasi" },
    { title: 'Immediate loading protokoli', place: 'Barselona, Ispaniya', year: '2021', gain: "Bir kunda tish" },
    { title: 'Parodontologiya va milk plastikasi', place: 'Istanbul, Turkiya', year: '2017', gain: "Milk sog'lig'i" },
  ] as Certificate[],
  certificatesTotal: 47,

  science: [
    { kind: 'Konferensiya', title: 'EAO xalqaro implantologiya kongressi', detail: "Ma'ruzachi sifatida ishtirok — 2022" },
    { kind: 'Ilmiy ish', title: "Osseointegratsiya samaradorligi bo'yicha tadqiqot", detail: '2 ta ilmiy maqola muallifi' },
    { kind: 'Ustozlik', title: 'Ichki o‘quv dasturi', detail: "Klinikaning barcha shifokorlari uning maktabidan o'tadi" },
  ] as ScienceItem[],
};
