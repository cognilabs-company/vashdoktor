import { ClinicConfig, DoctorProfile, BeforeAfterCase, FAQItem } from '../types';

export const CLINIC_CONFIG: ClinicConfig = {
  name: "VASH DOKTOR",
  tagline: "Butun oila uchun zamonaviy stomatologiya.",
  phone: "+998 71 200 00 00", // Placeholder: replace with verified clinic phone
  email: "salom@vashdoktor.uz", // Placeholder: replace with verified clinic email
  address: "Toshkent sh., [ko'cha nomi], [uy raqami]", // Placeholder: replace with real address
  hours: "Dush – Shan: 09:00 – 20:00 | Yak: 09:00 – 15:00",
  emergency: "Shoshilinch yordam liniyasi",
  socials: {
    instagram: "https://instagram.com",
    telegram: "https://t.me",
    linkedin: "https://linkedin.com",
  },
  // Placeholder pin (Toshkent markazi) — replace with the clinic's real coordinates.
  map: {
    lat: 41.3111,
    lng: 69.2797,
    directions: "Metro “Yunus Rajabiy”dan 5 daqiqa piyoda. Bepul avtoturargoh.",
  },
};

export const LEAD_SURGEON: DoctorProfile = {
  name: "Dr. Alexander Sinclair, DDS, PhD",
  title: "Bosh og'iz-jag' jarrohi va implantologiya mutaxassisi",
  quote: "Implant stomatologiyasi — jarrohlik aniqligi va biologik nafosatning aynan kesishuvi. Biz shunchaki tishlarni almashtirmaymiz — tabiiy yuz arxitekturasini tiklaymiz.",
  bio: "18 yildan ortiq vaqtini faqat yo'naltirilgan implantologiya va murakkab alveolyar suyak rekonstruksiyasiga bag'ishlagan Dr. Sinclair 4 200 dan ortiq muvaffaqiyatli implant o'rnatishni amalga oshirgan — tasdiqlangan osseointegratsiya darajasi 99,2%.",
  credentials: [
    "Diplomat, International Congress of Oral Implantologists (ICOI)",
    "A'zo, European Association for Osseointegration (EAO)",
    "Raqamli yo'naltirilgan jarrohlik bo'yicha master-klinisist (Bern / Zurich)",
    "3D kompyuter yordamida yo'naltirilgan suyak augmentatsiyasi bo'yicha o'qituvchi",
  ],
  stats: [
    { label: "Amalga oshirilgan jarayonlar", value: "4,200+" },
    { label: "Klinik muvaffaqiyat darajasi", value: "99.2%" },
    { label: "Yillik tajriba", value: "18+" },
  ],
};

export const BEFORE_AFTER_CASES: BeforeAfterCase[] = [
  {
    id: "case-01",
    title: "Markaziy kesuvchi tishni tiklash",
    category: "Old qism estetikasi",
    patientAge: "34 yosh",
    treatmentDuration: "Bir tashrifda darhol yuklash",
    shade: "VITA 3D Master 1M1 (High Translucency)",
    implantType: "NobelBiocare Active 4.3mm",
    beforeImage: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=80",
    afterImage: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=80",
    description: "Yuqori jag' markaziy kesuvchi tishining travmatik sinishi darhol atravmatik olib tashlash, yo'naltirilgan fixture o'rnatish va maxsus monolit zirkoniy emergence profili bilan tiklandi.",
  },
  {
    id: "case-02",
    title: "Birinchi molyar tishning funksional almashinuvi",
    category: "Orqa qism yuk ko'taruvchi",
    patientAge: "48 yosh",
    treatmentDuration: "12 hafta (kechiktirilgan protokol)",
    shade: "VITA Classical A2",
    implantType: "Straumann BLX 5.0mm Roxolid",
    beforeImage: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=1200&q=80",
    afterImage: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=1200&q=80",
    description: "Surunkali muvaffaqiyatsiz kanal davolangan molyar tish ichki sinus tubi ko'tarilishi, suyak transplantatsiyasi va 850N chaynash kuchini ko'taradigan keng platformali titanium implant bilan almashtirildi.",
  },
  {
    id: "case-03",
    title: "To'liq yoysimon yuqori jag' reabilitatsiyasi",
    category: "All-on-4 yo'naltirilgan protokol",
    patientAge: "59 yosh",
    treatmentDuration: "Bir kunda o'rnatiladigan vaqtinchalik ko'prik",
    shade: "Natural Bleach BL3 (Custom Layered)",
    implantType: "Multi-Unit Angled Implants",
    beforeImage: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
    afterImage: "https://images.unsplash.com/photo-1588776814546-daab30f310ce?auto=format&fit=crop&w=1200&q=80",
    description: "Terminal tishlar to'liq kompyuter yordamida yo'naltirilgan 3D osteotomiya, egilgan orqa implantlar va darhol o'rnatiladigan to'liq yoysimon vint bilan mahkamlangan zirkoniy protez orqali o'zgartirildi.",
  },
];

// Home page — everyday questions about the clinic. Implant-specific ones live in FAQ_ITEMS.
export const GENERAL_FAQ: FAQItem[] = [
  {
    question: 'Davolash og‘riqli bo‘ladimi?',
    answer: 'Yo‘q. Har qanday muolaja anesteziya bilan — ukolning o‘zi ham yupqa igna va sekin yuborish tufayli deyarli sezilmaydi. Qo‘rquv kuchli bo‘lsa, shifokorga ayting: ko‘rikni sekinroq, bosqichma-bosqich o‘tkazamiz.',
  },
  {
    question: 'Narxni qachon bilaman?',
    answer: 'Birinchi ko‘rikdan keyin. Shifokor rejani bosqichlari va narxi bilan yozib beradi — davolash shu rejaga qarab boradi. Qo‘shimcha ish chiqsa, avval siz bilan kelishiladi.',
  },
  {
    question: 'Birinchi tashrif qancha davom etadi?',
    answer: 'Odatda 30–40 daqiqa: suhbat, ko‘rik, kerak bo‘lsa raqamli rentgen va rejani muhokama qilish. Shu kuni davolashni boshlash ham mumkin — agar xohlasangiz.',
  },
  {
    question: 'Bolani necha yoshdan olib kelish mumkin?',
    answer: 'Birinchi sut tishi chiqqanidan boshlab — odatda 1 yoshda tanishuv ko‘rigi. Bolalar shifokori birinchi tashrifni o‘yin shaklida o‘tkazadi, davolash keyingi safarga rejalashtiriladi.',
  },
  {
    question: 'Kafolat bormi?',
    answer: 'Ha, yozma. Har bir ish turi uchun o‘z muddati bor va bepul nazorat ko‘riklari rejaga kiritiladi. Kafolat shartlari davolash rejasi bilan birga beriladi.',
  },
  {
    question: 'Qanday yoziladi?',
    answer: 'Saytdagi “Qabulga yozilish” tugmasi orqali, telefon yoki Telegram’dan. Administrator ish vaqtida 1–2 soat ichida qo‘ng‘iroq qilib, vaqtni kelishib oladi.',
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "Implant jarrohligi noqulaylik keltiradimi?",
    answer: "Ko'pchilik bemorlar buni oddiy tish olib tashlashdan ancha kam noqulaylik his qilishlarini aytadi. Biz kompyuter boshqaruvidagi mahalliy anesteziya, minimal invaziv jarrohlik shablonlari va individual jarrohlikdan keyingi yallig'lanishga qarshi protokollardan foydalanamiz. Jarayonning o'zi mutlaqo og'riqsiz.",
  },
  {
    question: "Tish implanti qancha xizmat qiladi?",
    answer: "Aniq yo'naltirilgan protokollar bilan o'rnatilib, standart gigiyena bilan parvarish qilinganda implantlar umr bo'yi xizmat qilishi mumkin. Klinik tadqiqotlar 20–25 yildan keyin 98%+ saqlanish darajasini ko'rsatadi.",
  },
  {
    question: "To'liq davolash muddati qanday?",
    answer: "Davolash bir kunlik darhol o'rnatishdan standart osseointegratsiya uchun 10–14 haftagacha davom etadi. Dastlabki 3D diagnostika va jarrohlik rejasi 1 seansda yakunlanadi; fixture 45 daqiqada o'rnatiladi; yakuniy maxsus keramik crown biologik tuzalishdan so'ng o'rnatiladi.",
  },
  {
    question: "Titanium implantlarni biouyg'un qiladigan narsa nima?",
    answer: "Medical Grade 4/5 titanium barqaror mikroskopik oksid qatlamini hosil qiladi, unga tirik osteoblastlar (suyak hujayralari) immun yoki allergik reaksiyani keltirib chiqarmasdan jismonan birikadi — bu osseointegratsiya deb ataladigan biologik hodisa.",
  },
  {
    question: "Suyak hajmim kam bo'lsa, men nomzod bo'la olamanmi?",
    answer: "Ha. Ilg'or CBCT 3D tasvirlash yordamida biz suyak zichligini 0,075mm gacha baholaymiz. Zarur bo'lganda, ehtiyotkorona suyak transplantatsiyasi, sinus lift yoki maxsus kalta/egilgan implantlar deyarli barcha bemorlarga barqaror implantlarni xavfsiz o'rnatish imkonini beradi.",
  },
];
