// PLACEHOLDER reviews to show the layout. Replace every entry with real,
// consented patient reviews (name as the patient wants it shown) before launch.
// Keep each under ~110 characters — they run in a ticker on the home page.
export interface Testimonial {
  name: string;
  meta: string; // service · when
  text: string;
}

export const TESTIMONIALS: Testimonial[] = [
  { name: 'Dilnoza, 34', meta: 'Kanal davolash', text: 'Ukolni sezmadim ham. Narx aytilganidek chiqdi.' },
  { name: 'Bobur, 41', meta: 'Implantatsiya', text: '3D modelda qayerga qo‘yilishini oldindan ko‘rsatishdi — ishonch berdi.' },
  { name: 'Malika, 29', meta: 'Bolalar stomatologiyasi', text: 'Qizim 4 yoshda, birinchi safar yig‘lamasdan chiqdi.' },
  { name: 'Sardor, 52', meta: 'Protezlash', text: 'Boshqa joyda “olib tashlash kerak” deyishgan edi. Bu yerda saqlab qolishdi.' },
  { name: 'Nigora, 38', meta: 'Tish oqartirish', text: 'Bir seansda natija. Tishlarim sezgir bo‘lib qolmadi.' },
  { name: 'Jasur, 27', meta: 'Ortodontiya', text: 'Shaffof kappalar — ishda hech kim sezmadi.' },
];
