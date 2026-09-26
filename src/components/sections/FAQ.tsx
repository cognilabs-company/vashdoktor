import React, { useState } from 'react';
import { FAQ_ITEMS } from '../../lib/clinicConfig';
import type { FAQItem } from '../../types';
import { TechnicalBadge } from '../ui/TechnicalBadge';
import { FLOW } from '../../lib/flow';
import { Plus, Minus, HelpCircle } from 'lucide-react';

interface Props {
  items?: FAQItem[];
  code?: string;
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: string;
  aside?: { title: string; text: string };
}

export function FAQ({
  items = FAQ_ITEMS,
  code = "BEMOR MA'LUMOTI",
  eyebrow = "KO'P BERILADIGAN",
  title = (
    <>
      Bilishingiz kerak bo&#39;lgan <br />
      <span className="font-medium text-[var(--c-accent)]">hamma narsa.</span>
    </>
  ),
  subtitle = 'Klinik faktlar, davolash muddati va biologik integratsiya tafsilotlari tibbiy shaffoflik bilan tushuntirilgan.',
  aside,
}: Props = {}) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" data-bg={FLOW.blue} data-scroll className="py-28 sm:py-36 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Heading */}
          <div data-stagger="left" className="lg:col-span-5 sticky top-28">
            <TechnicalBadge code={code} label={eyebrow} />

            <h2 className="mt-6 text-3xl sm:text-4xl lg:text-[2.5rem] font-medium font-serif tracking-tight text-white leading-[1.08]">
              {title}
            </h2>

            <p className="mt-6 text-base sm:text-lg text-[var(--c-text-2)] font-light leading-relaxed max-w-md">{subtitle}</p>

            {aside && (
              <div className="mt-8 p-6 rounded-2xl bg-white/[0.05] border border-white/10 text-xs text-[var(--c-text-4)] space-y-2">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <HelpCircle className="h-4 w-4 text-[var(--c-accent)]" />
                  <span>{aside.title}</span>
                </div>
                <p>{aside.text}</p>
              </div>
            )}
          </div>

          {/* Right Column: Accordion */}
          <div className="lg:col-span-7 space-y-4">
            {items.map((item, idx) => {
              const isOpen = openIdx === idx;

              return (
                <div
                  key={idx}
                  data-scroll
                  /* transition-colors, not -all: the row's opacity and transform are written
                     every frame from the scroll, and a transition on them lags a frame behind
                     the tilt. Nothing on the row itself animates besides colour anyway. */
                  className="sp-3d rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-md overflow-hidden transition-colors duration-200 shadow-2xs"
                  style={{ ['--sp-persp' as string]: '800px', ['--sp-tilt' as string]: '64deg', ['--sp-depth' as string]: '170px', ['--sp-rise' as string]: '105px' }}
                >
                  <button
                    onClick={() => toggle(idx)}
                    className={`w-full flex items-center justify-between p-6 sm:p-7 text-left cursor-pointer select-none transition-colors ${
                      isOpen ? 'bg-[var(--c-accent)]/[0.06]' : 'hover:bg-white/[0.03]'
                    }`}
                  >
                    <span
                      className={`text-base sm:text-lg font-serif pr-4 transition-colors ${
                        isOpen ? 'text-[var(--c-accent)]' : 'text-white'
                      }`}
                    >
                      {item.question}
                    </span>
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full shrink-0 transition-all duration-300 ${
                        isOpen ? 'bg-[var(--c-accent)] text-[var(--c-bg)] rotate-90' : 'bg-white/10 text-[var(--c-accent)]'
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
                      <div className="px-6 pb-6 sm:px-7 sm:pb-7 text-sm sm:text-base text-[var(--c-text-2)] font-light leading-relaxed border-t border-white/10 pt-4">
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
