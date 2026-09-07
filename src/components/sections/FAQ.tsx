import React, { useState } from 'react';
import { FAQ_ITEMS } from '../../lib/clinicConfig';
import { TechnicalBadge } from '../ui/TechnicalBadge';
import { Plus, Minus, HelpCircle } from 'lucide-react';

export function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-28 sm:py-36 bg-[#0a141d] border-t border-white/10 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Heading */}
          <div data-stagger className="lg:col-span-5 sticky top-28">
            <TechnicalBadge code="BEMOR MA'LUMOTI" label="KO'P BERILADIGAN" />

            <h2 className="mt-6 text-3xl sm:text-4xl lg:text-[2.5rem] font-medium font-serif tracking-tight text-white leading-[1.08]">
              Bilishingiz kerak bo&#39;lgan <br />
              <span className="font-medium text-[#8fc7d4]">hamma narsa.</span>
            </h2>

            <p className="mt-6 text-base sm:text-lg text-[#a7c2cb] font-light leading-relaxed max-w-md">
              Klinik faktlar, davolash muddati va biologik integratsiya tafsilotlari tibbiy shaffoflik bilan tushuntirilgan.
            </p>

            <div className="mt-8 p-6 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-md text-xs text-[#7f9aa4] space-y-2">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <HelpCircle className="h-4 w-4 text-[#8fc7d4]" />
                <span>Aniq holat bo&#39;yicha savolingiz bormi?</span>
              </div>
              <p>
                Klinik jamoamiz raqamli CBCT skanlarni ko&#39;rib chiqadi va 24 soat ichida individual diagnostik takliflar beradi.
              </p>
            </div>
          </div>

          {/* Right Column: Accordion */}
          <div data-stagger className="lg:col-span-7 space-y-4">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openIdx === idx;

              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-md overflow-hidden transition-all duration-200 shadow-2xs"
                >
                  <button
                    onClick={() => toggle(idx)}
                    className={`w-full flex items-center justify-between p-6 sm:p-7 text-left cursor-pointer select-none transition-colors ${
                      isOpen ? 'bg-[#8fc7d4]/[0.06]' : 'hover:bg-white/[0.03]'
                    }`}
                  >
                    <span
                      className={`text-base sm:text-lg font-serif pr-4 transition-colors ${
                        isOpen ? 'text-[#8fc7d4]' : 'text-white'
                      }`}
                    >
                      {item.question}
                    </span>
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full shrink-0 transition-all duration-300 ${
                        isOpen ? 'bg-[#8fc7d4] text-[#0a141d] rotate-90' : 'bg-white/10 text-[#8fc7d4]'
                      }`}
                    >
                      {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </div>
                  </button>

                  {/* Smoothly animated answer panel */}
                  <div
                    className="grid transition-all duration-[400ms] ease-out"
                    style={{
                      gridTemplateRows: isOpen ? '1fr' : '0fr',
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 pb-6 sm:px-7 sm:pb-7 text-sm sm:text-base text-[#a7c2cb] font-light leading-relaxed border-t border-white/10 pt-4">
                        {item.answer}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
