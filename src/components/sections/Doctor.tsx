import React from 'react';
import { LEAD_SURGEON } from '../../lib/clinicConfig';
import { TechnicalBadge } from '../ui/TechnicalBadge';
import { Award, CheckCircle2, Quote } from 'lucide-react';
import { Button } from '../ui/Button';
import { CountUp } from '../ui/CountUp';

interface DoctorProps {
  onOpenConsultation: () => void;
}

export function Doctor({ onOpenConsultation }: DoctorProps) {
  return (
    <section id="specialist" className="py-28 sm:py-36 bg-[#0a141d] border-t border-white/10 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Large Editorial Portrait (~45-50% on Desktop) */}
          <div data-reveal="left" className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.35)] border border-white/10 bg-[#0d2230]">
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1200&q=80"
                alt="Dr. Alexander Sinclair - Yetakchi Implant Jarrohi"
                className="h-full w-full object-cover object-top filter grayscale contrast-105 hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />

              {/* Floating Verified Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#0a141d]/70 backdrop-blur-md border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-white">Dr. Alexander Sinclair</div>
                    <div className="text-[11px] text-[#7f9aa4]">DDS, PhD • Yetakchi implantolog</div>
                  </div>
                  <div className="flex items-center gap-1 text-[#8fc7d4] text-xs font-mono">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>ICOI Diplomat</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Specialist Editorial Narrative */}
          <div data-stagger className="lg:col-span-6 flex flex-col items-start">
            <TechnicalBadge code="MUTAXASSIS" label="KLINIK RAHBAR" />

            <h2 className="mt-6 text-3xl sm:text-4xl lg:text-[2.5rem] font-medium font-serif tracking-tight text-white leading-[1.08]">
              Texnologiya yordam beradi. <br />
              <span className="font-medium text-[#8fc7d4]">Tajriba hal qiladi.</span>
            </h2>

            {/* Blockquote */}
            <div className="mt-8 relative pl-6 border-l-2 border-[#8fc7d4]/40 italic text-base sm:text-lg text-[#a7c2cb] font-serif">
              <Quote className="absolute -top-3 -left-3 h-6 w-6 text-[#8fc7d4]/20 pointer-events-none" />
              "{LEAD_SURGEON.quote}"
            </div>

            <p className="mt-6 text-sm sm:text-base text-[#a7c2cb] font-light leading-relaxed">
              Raqamli vositalar jarayonni qo&#39;llab-quvvatlaydi. Klinik qarorlar hamon diagnostika, rejalashtirish va jarrohlik tajribasiga bog&#39;liq.
            </p>

            {/* Verified Clinical Statistics */}
            <div className="mt-8 grid grid-cols-3 gap-4 w-full py-6 border-y border-white/10">
              {LEAD_SURGEON.stats.map((stat, i) => (
                <div key={i} className="text-left">
                  <div className="text-2xl sm:text-3xl font-serif text-[#8fc7d4] tabular-nums">
                    <CountUp value={stat.value} />
                  </div>
                  <div className="text-[11px] font-mono text-[#7f9aa4] uppercase mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Key Credentials List */}
            <div className="mt-6 space-y-2.5 w-full">
              {LEAD_SURGEON.credentials.map((cred, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-[#a7c2cb]">
                  <Award className="h-4 w-4 text-[#8fc7d4] shrink-0 mt-0.5" />
                  <span>{cred}</span>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Button
                variant="white"
                size="lg"
                onClick={onOpenConsultation}
              >
                Dr. Sinclair bilan konsultatsiyaga yozilish
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
