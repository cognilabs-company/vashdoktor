// General-dentistry service catalogue for the "Vash Doktor" clinic.
// Icons are lucide-react names, resolved in the UI.

export type ServiceCategory = 'profilaktika' | 'davolash' | 'estetika' | 'jarrohlik';

export interface Service {
  slug: string;
  icon: string; // lucide-react icon name
  eyebrow: string; // short code/eyebrow, e.g. "01"
  category: ServiceCategory;
  title: string;
  short: string; // one-line summary (cards / grid)
  body: string; // fuller description (services page)
  points: string[]; // bullet highlights
  featured?: boolean; // highlighted on the home page
}

// TEMPORARY stock imagery (Unsplash) for the category chapters until the
// clinic's own photos land in /public.
const stock = (id: string, w = 1200) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

// Ordered categories — drive the grouped layout on the Services page.
export const SERVICE_CATEGORIES: { key: ServiceCategory; label: string; note: string; image: string; caption: string }[] = [
  {
    key: 'profilaktika',
    label: 'Profilaktika & Diagnostika',
    note: "Sog'lom tabassumni saqlash — kasallikning oldini olishdan boshlanadi.",
    image: stock('1600170311833-c2cf5280ce49'),
    caption: 'Raqamli rentgen. Har bir tashxis shu yerdan boshlanadi.',
  },
  {
    key: 'davolash',
    label: 'Davolash',
    note: "Kariesdan kanal va milk davolashgacha — og'riqsiz va aniq.",
    image: stock('1606811841689-23dfddce3e95'),
    caption: 'Davolash kabineti. Shifokor rentgenni bemor bilan birga ko‘radi.',
  },
  {
    key: 'estetika',
    label: 'Estetika & Ortodontiya',
    note: 'Tishlarni to‘g‘rilash, oqartirish va mukammal tabassum dizayni.',
    image: stock('1609840114035-3c981b782dfe'),
    caption: 'Shaffof kappa — ko‘zga tashlanmaydigan ortodontiya.',
  },
  {
    key: 'jarrohlik',
    label: 'Jarrohlik & Tiklash',
    note: "Implantatsiya, protezlash va murakkab jarrohlik — bir joyda.",
    image: stock('1593022356769-11f762e25ed9'),
    caption: 'Implant modeli. Bemorga jarayonni shu modelda tushuntiramiz.',
  },
];

/** Clinic imagery for the "why us" bento (temporary stock). */
export const CLINIC_IMAGES = {
  interior: stock('1598256989800-fe5f95da9787'),
  xray: stock('1588776814546-1ffcf47267a5', 900),
};

export const servicesByCategory = (key: ServiceCategory) => SERVICES.filter((s) => s.category === key);

export const SERVICES: Service[] = [
  {
    slug: 'tekshiruv',
    icon: 'Stethoscope',
    eyebrow: '01',
    category: 'profilaktika',
    title: 'Umumiy tekshiruv & profilaktika',
    short: "Og'iz bo'shlig'ining to'liq diagnostikasi va kasalliklarning oldini olish.",
    body: "Har bir davolash aniq tashxisdan boshlanadi. Zamonaviy jihozlar va raqamli rentgen yordamida tishlar, milklar va jag' holatini to'liq baholaymiz hamda shaxsiy profilaktika rejasini tuzamiz.",
    points: ['Raqamli rentgen va diagnostika', 'Shaxsiy davolash rejasi', 'Kasalliklarning erta aniqlanishi'],
    featured: true,
  },
  {
    slug: 'gigiena',
    icon: 'Sparkles',
    eyebrow: '02',
    category: 'profilaktika',
    title: 'Professional tish tozalash',
    short: "Ultratovushli tozalash, karash va yumshoq karashlarni olib tashlash.",
    body: "Professional gigiena tish emalini shikastlamasdan tosh va rangli karashlarni yo'qotadi, milk kasalliklari va karistning oldini oladi. Air Flow texnologiyasi bilan tishlarga tabiiy yaltiroqlik qaytadi.",
    points: ['Ultratovushli tosh olish', 'Air Flow tozalash', 'Ftorlash va mustahkamlash'],
    featured: true,
  },
  {
    slug: 'davolash',
    icon: 'Activity',
    eyebrow: '03',
    category: 'davolash',
    title: 'Karies va tish davolash',
    short: "Zamonaviy plomba materiallari bilan og'riqsiz davolash.",
    body: "Har qanday bosqichdagi kariesni og'riqsiz davolaymiz. Yorug'likda qotadigan sifatli kompozit materiallar tishning tabiiy rangi va shakliga to'liq mos keladi.",
    points: ['Og‘riqsiz anesteziya', 'Estetik kompozit plombalar', 'Tabiiy rang mosligi'],
  },
  {
    slug: 'endodontiya',
    icon: 'GitBranch',
    eyebrow: '04',
    category: 'davolash',
    title: 'Kanal davolash (endodontiya)',
    short: "Tish o'zagini saqlab qolish uchun aniq kanal davolash.",
    body: "Mikroskop va apex-lokator yordamida tish kanallarini aniq tozalab, pulpit va periodontitni davolaymiz — bu tishni olib tashlashning oldini oladi.",
    points: ['Mikroskop bilan aniqlik', 'Rentgen nazorati', 'Tishni saqlab qolish'],
  },
  {
    slug: 'implantatsiya',
    icon: 'Anchor',
    eyebrow: '05',
    category: 'jarrohlik',
    title: 'Implantatsiya',
    short: "Yo'qolgan tishni ildizidan tojigacha to'liq va tabiiy tiklash.",
    body: "Raqamli rejalashtirish va yo'naltirilgan jarrohlik bilan titan implant aniq pozitsiyaga o'rnatiladi va tabiiy ko'rinishdagi keramik crown bilan yakunlanadi — 3D jarayonni bosh sahifada ko'rishingiz mumkin.",
    points: ['3D raqamli rejalashtirish', 'Titan implant + keramik crown', 'Uzoq muddatli kafolat'],
    featured: true,
  },
  {
    slug: 'ortodontiya',
    icon: 'AlignHorizontalDistributeCenter',
    eyebrow: '06',
    category: 'estetika',
    title: 'Ortodontiya',
    short: "Breketlar va shaffof kappalar bilan tishlarni to'g'rilash.",
    body: "Qiyshiq tishlar va noto'g'ri prikusni metall/keramik breketlar yoki ko'zga ko'rinmas shaffof kappalar (aligner) yordamida to'g'rilaymiz. Har bir yosh uchun mos yechim.",
    points: ['Metall va keramik breketlar', 'Shaffof kappalar (aligner)', 'Bolalar va kattalar uchun'],
  },
  {
    slug: 'estetika',
    icon: 'Gem',
    eyebrow: '07',
    category: 'estetika',
    title: 'Estetik stomatologiya',
    short: "Vinir va kronlar bilan mukammal tabassum dizayni.",
    body: "Keramik vinirlar va kronlar tishlarning shakli, rangi va joylashuvini ideal holatga keltiradi. Tabassum dizayni orqali natijani oldindan ko'rasiz.",
    points: ['Keramik vinirlar', 'E-max / sirkoniy kronlar', 'Tabassum dizayni'],
  },
  {
    slug: 'oqartirish',
    icon: 'Sun',
    eyebrow: '08',
    category: 'estetika',
    title: 'Tish oqartirish',
    short: "Xavfsiz professional oqartirish bilan yorqin tabassum.",
    body: "Emalni shikastlamaydigan professional oqartirish tizimlari bilan tishlar bir necha ton yorqinlashadi. Klinikada va uyda qo'llash variantlari mavjud.",
    points: ['Professional klinika oqartirishi', 'Uy uchun kappalar', 'Emalga zararsiz'],
  },
  {
    slug: 'bolalar',
    icon: 'Baby',
    eyebrow: '09',
    category: 'davolash',
    title: 'Bolalar stomatologiyasi',
    short: "Bolalar uchun qo'rquvsiz, do'stona va og'riqsiz davolash.",
    body: "Bolalarning sut va doimiy tishlarini davolash, ftorlash va fissura germetizatsiyasi. Bolani qo'rqitmaydigan iliq va o'yin muhitida.",
    points: ['Sut tishlarini davolash', 'Fissura germetizatsiyasi', "Bolabop yondashuv"],
  },
  {
    slug: 'jarrohlik',
    icon: 'Scissors',
    eyebrow: '10',
    category: 'jarrohlik',
    title: 'Tish jarrohligi',
    short: "Murakkab tishlarni og'riqsiz olib tashlash va jarrohlik.",
    body: "Aql tishlari, murakkab va shikastlangan tishlarni zamonaviy anesteziya bilan og'riqsiz olib tashlaymiz. Suyak plastikasi va sinus lifting ham amalga oshiriladi.",
    points: ['Aql tishlari', 'Suyak plastikasi', 'Zamonaviy anesteziya'],
  },
  {
    slug: 'parodontologiya',
    icon: 'HeartPulse',
    eyebrow: '11',
    category: 'davolash',
    title: 'Milk davolash (parodontologiya)',
    short: "Qonayotgan va yallig'langan milklarni davolash.",
    body: "Gingivit va parodontitni davolab, milklarning sog'lig'ini tiklaymiz — bu tishlarning mustahkam turishini ta'minlaydi.",
    points: ['Gingivit va parodontit', 'Chuqur tozalash', 'Milk retseptsiyasini tiklash'],
  },
  {
    slug: 'protezlash',
    icon: 'Layers',
    eyebrow: '12',
    category: 'jarrohlik',
    title: 'Protezlash',
    short: "Olinadigan va mustahkam protezlar bilan tishlarni tiklash.",
    body: "Bir yoki bir nechta yo'qolgan tishlarni ko'prik, olinadigan va implantga tayanuvchi protezlar bilan tiklaymiz — qulay, mustahkam va tabiiy.",
    points: ['Ko‘prik va koronkalar', 'Olinadigan protezlar', 'Implantga tayanuvchi protez'],
  },
];

export const featuredServices = () => SERVICES.filter((s) => s.featured);
