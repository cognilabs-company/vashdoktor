import { Check, Minus, X } from 'lucide-react';
import { Eyebrow } from '../services/Eyebrow';
import { FLOW } from '../../lib/flow';

type Mark = 'good' | 'mid' | 'bad';
const ROWS: { label: string; cells: [string, string, string]; marks: [Mark, Mark, Mark] }[] = [
  { label: 'Xizmat muddati', cells: ['20+ yil', '7–10 yil', '3–5 yil'], marks: ['good', 'mid', 'bad'] },
  { label: 'Qo‘shni tishlar', cells: ['Tegilmaydi', 'Yo‘niladi', 'Tegilmaydi'], marks: ['good', 'bad', 'good'] },
  { label: 'Jag‘ suyagi', cells: ['Saqlanadi', 'Yemiriladi', 'Yemiriladi'], marks: ['good', 'bad', 'bad'] },
  { label: 'Chaynash kuchi', cells: ['100%', '~80%', '~40%'], marks: ['good', 'mid', 'bad'] },
  { label: 'Ko‘rinishi', cells: ['Tabiiy', 'Yaxshi', 'Sezilarli'], marks: ['good', 'mid', 'bad'] },
  { label: 'Parvarish', cells: ['O‘z tishdek', 'Maxsus ip', 'Olib yuviladi'], marks: ['good', 'mid', 'bad'] },
];
const COLS = ['Implant', 'Ko‘prik', 'Olinadigan protez'];
const ICON = { good: Check, mid: Minus, bad: X } as const;
const TONE = { good: 'text-[var(--c-accent)]', mid: 'text-[var(--c-text-3)]', bad: 'text-[var(--c-text-5)]' } as const;

/** Why an implant — three ways to replace a tooth, side by side. */
export function ImplantCompare() {
  return (
    <section data-bg={FLOW.teal} className="relative w-full py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12">
        <div data-reveal>
          <Eyebrow>Nega implant</Eyebrow>
          <h2 className="mt-4 font-serif text-[clamp(1.9rem,4vw,3.1rem)] font-medium leading-[1.06] tracking-tight text-white">
            Yo‘qolgan tishni tiklashning uch yo‘li
          </h2>
        </div>

        <div className="mt-10 overflow-x-auto" data-reveal="up">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-4 pr-4 text-[12px] font-normal text-[var(--c-text-5)]" />
                {COLS.map((c, i) => (
                  <th key={c} className={`py-4 px-4 font-serif text-lg font-medium ${i === 0 ? 'text-[var(--c-accent)]' : 'text-white'}`}>
                    {c}
                    {i === 0 && <span className="ml-2 rounded-full bg-[var(--c-accent)]/15 px-2 py-0.5 align-middle text-[10px] text-[var(--c-accent-2)]">tavsiya</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.label} className="border-b border-white/[0.07]">
                  <td className="py-4 pr-4 text-[14px] text-[var(--c-text-3)]">{r.label}</td>
                  {r.cells.map((cell, i) => {
                    const Icon = ICON[r.marks[i]];
                    return (
                      <td key={i} className={`py-4 px-4 text-[15px] ${i === 0 ? 'bg-[var(--c-accent)]/[0.05] text-white' : 'text-[var(--c-text)]'}`}>
                        <span className="inline-flex items-center gap-2">
                          <Icon className={`h-4 w-4 shrink-0 ${TONE[r.marks[i]]}`} strokeWidth={2} />
                          {cell}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-[12px] text-[var(--c-text-5)]">* O‘rtacha ko‘rsatkichlar. Aniq tavsiya — ko‘rik va 3D skandan keyin.</p>
      </div>
    </section>
  );
}
