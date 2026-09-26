import { ClinicConfig, FAQItem } from '../types';

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

// Everyday questions about the clinic, for the home page.
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
