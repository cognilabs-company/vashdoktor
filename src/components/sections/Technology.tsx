import React, { useState } from 'react';
import { TechnicalBadge } from '../ui/TechnicalBadge';
import { Sparkles, Scan, Compass, ShieldCheck, ArrowRight } from 'lucide-react';

export function Technology() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      number: '01',
      title: 'SKANLASH',
      subtitle: 'Anatomiyani ko\'ring',
      description:
        'Sub-millimetr aniqlikdagi 3D CBCT tasvirlash suyak zichligini, nerv kanallarini va anatomik tuzilmalarni to\'liq fazoviy aniqlik bilan qamrab oladi.',
      specs: ['0.075mm aniqlik', 'Past radiatsiya', 'Hajmli skanlash'],
    },
    {
      number: '02',
      title: 'REJALASH',
      subtitle: 'Joylashuvni belgilang',
      description:
        'Virtual rejalashtirish dasturi implantni o\'rnatish momentini, konus chuqurligini va burchagini klinik muolaja boshlanishidan oldin aniq belgilaydi.',
      specs: ['Virtual rejalashtirish', 'Kortikal fiksatsiya', 'Individual Abutment'],
    },
    {
      number: '03',
      title: 'O\'RNATISH',
      subtitle: 'Rejani amalga oshiring',
      description:
        'Individual 3D-bosma jarrohlik shablonlari titan fixture\'ni rejalashtirilgan joyiga sub-millimetr aniqlik bilan to\'g\'ridan-to\'g\'ri yo\'naltiradi.',
      specs: ['Boshqariladigan jarrohlik', 'Sub-millimetr shablon', 'Minimal invaziv'],
    },
  ];

  return (
    <section id="technology" className="py-28 sm:py-36 bg-[#0a141d] text-[#a7c2cb] border-t border-white/10 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">
        {/* Asymmetrical Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* LEFT COLUMN: Large Editorial Typography */}
          <div data-stagger className="lg:col-span-5 flex flex-col items-start sticky top-28">
            <TechnicalBadge code="RAQAMLI JARAYON" label="KLINIK PROTOKOL" />

            <h2 className="mt-6 text-3xl sm:text-4xl lg:text-[2.5rem] font-medium font-serif tracking-tight text-white leading-[1.08]">
              Aniqlik davolashdan <br />
              <span className="font-medium text-[#8fc7d4]">oldin boshlanadi.</span>
            </h2>

            <p className="mt-6 text-base sm:text-lg text-[#a7c2cb] font-light leading-relaxed max-w-md">
              Diagnostika va raqamli rejalashtirish davolashni klinik muolaja boshlanishidan oldin to&#39;liq belgilash imkonini beradi.
            </p>

            <div className="mt-8 pt-8 border-t border-white/10 w-full space-y-3 text-xs text-[#7f9aa4]">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#8fc7d4]" />
                <span>Jismoniy qolip olish noqulayligisiz</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#8fc7d4]" />
                <span>Jarrohlik muddati sezilarli qisqargan</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#8fc7d4]" />
                <span>Bashoratli, biologik osseointegratsiya</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: 3 Features with Thin Animated Dividers */}
          <div data-stagger className="lg:col-span-7 space-y-10">
            {features.map((feature, idx) => {
              const isCurrent = activeFeature === idx;

              return (
                <div
                  key={feature.number}
                  onMouseEnter={() => setActiveFeature(idx)}
                  className="group relative pb-10 border-b border-white/10 transition-colors"
                >
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="text-xs font-mono tracking-widest text-[#8fc7d4]">
                      {feature.number} / JARAYON
                    </span>
                    <span className="text-xs text-[#7f9aa4] font-mono">
                      BOSQICH 0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-serif text-white group-hover:text-[#8fc7d4] transition-colors mb-2">
                    {feature.title}
                  </h3>

                  <p className="text-sm font-medium text-[#8fc7d4] mb-4">
                    {feature.subtitle}
                  </p>

                  <p className="text-sm sm:text-base text-[#a7c2cb] font-light leading-relaxed mb-6">
                    {feature.description}
                  </p>

                  {/* Feature specs pills */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    {feature.specs.map((spec, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-[#8fc7d4]/10 border border-[#8fc7d4]/20 text-xs text-[#8fc7d4] font-mono"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* Active accent line indicator */}
                  <div
                    className={`absolute bottom-0 left-0 h-[2px] bg-[#8fc7d4] transition-all duration-300 ${
                      isCurrent ? 'w-full' : 'w-0 group-hover:w-24'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
