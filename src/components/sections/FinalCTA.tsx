import React from 'react';
import { CLINIC_CONFIG } from '../../lib/clinicConfig';
import { Button } from '../ui/Button';
import { Phone, Calendar, ShieldCheck, ArrowRight, Clock, MapPin } from 'lucide-react';
import { TechnicalBadge } from '../ui/TechnicalBadge';

interface FinalCTAProps {
  onOpenConsultation: () => void;
}

export function FinalCTA({ onOpenConsultation }: FinalCTAProps) {
  return (
    <section className="py-28 sm:py-36 bg-[linear-gradient(135deg,#0b1b26,#123443)] text-white relative overflow-hidden">
      {/* Background Decorative Gradient & Geometry */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(143,199,212,0.22),transparent_70%)] pointer-events-none" />
      <div
        data-parallax="0.16"
        className="absolute -bottom-24 -right-24 text-[16vw] font-serif font-light text-white/[0.03] select-none pointer-events-none will-change-transform"
      >
        {CLINIC_CONFIG.name}
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Headline & Action */}
          <div data-stagger className="lg:col-span-8 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-md text-[11px] font-mono text-[#8fc7d4] uppercase tracking-widest mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-[#8fc7d4] animate-pulse" />
              <span>KONSULTATSIYA & DIAGNOSTIKA</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-serif font-medium tracking-tight text-white leading-[1.08]">
              Sog&#39;lom tabassum <br />
              <span className="font-medium text-[#8fc7d4]">bugun boshlanadi.</span>
            </h2>

            <p className="mt-6 text-base sm:text-lg text-[#a7c2cb] font-light leading-relaxed max-w-xl">
              Konsultatsiyaga yoziling — shifokorlarimiz og&#39;iz bo&#39;shlig&#39;ingizni tekshirib, sizga eng mos davolash rejasini tuzib beradi.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button
                variant="white"
                size="lg"
                onClick={onOpenConsultation}
                icon={<ArrowRight className="h-4 w-4" />}
              >
                Konsultatsiyaga yozilish
              </Button>

              <a
                href={`tel:${CLINIC_CONFIG.phone}`}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/[0.06] hover:bg-white/10 border border-white/10 backdrop-blur-md text-sm font-mono text-white transition-all cursor-pointer"
              >
                <Phone className="h-4 w-4 text-[#8fc7d4]" />
                <span>{CLINIC_CONFIG.phone}</span>
              </a>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full text-xs text-[#a7c2cb]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#8fc7d4]" />
                <span>Barcha davolashga kafolat</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#8fc7d4]" />
                <span>Qulay ish vaqti — haftaning 7 kuni</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#8fc7d4]" />
                <span>Toshkent markazidagi klinika</span>
              </div>
            </div>
          </div>

          {/* Right Column: Appointment Card Info */}
          <div data-reveal="right" className="lg:col-span-4 rounded-3xl bg-white/[0.06] backdrop-blur-md border border-white/10 p-8 text-white">
            <div className="text-xs font-mono text-[#8fc7d4] uppercase tracking-widest mb-2">
              KLINIKA BANDLIGI
            </div>
            <div className="text-2xl font-serif mb-4">
              Yangi bemorlar qabul qilinmoqda
            </div>

            <p className="text-xs text-[#a7c2cb] leading-relaxed font-light mb-6">
              Dastlabki konsultatsiya og&#39;iz bo&#39;shlig&#39;i ko&#39;rigi, raqamli diagnostika va shaxsiy davolash rejasini o&#39;z ichiga oladi.
            </p>

            <div className="space-y-3 pt-6 border-t border-white/10 text-xs">
              <div className="flex justify-between gap-4">
                <span className="text-[#a7c2cb]/70">Manzil</span>
                <span className="text-right font-medium">{CLINIC_CONFIG.address}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[#a7c2cb]/70">Ish vaqti</span>
                <span className="text-right font-medium">{CLINIC_CONFIG.hours}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a7c2cb]/70">To&#39;g&#39;ridan-to&#39;g&#39;ri liniya</span>
                <span className="text-right font-medium">{CLINIC_CONFIG.phone}</span>
              </div>
            </div>

            <button
              onClick={onOpenConsultation}
              className="mt-8 w-full py-3.5 px-4 rounded-full bg-[#8fc7d4] hover:bg-white text-[#0b1b26] text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer shadow-md font-mono"
            >
              Konsultatsiya so&#39;rash
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
