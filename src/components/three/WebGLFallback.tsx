import React from 'react';
import { ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

interface WebGLFallbackProps {
  onOpenConsultation?: () => void;
}

export function WebGLFallback({ onOpenConsultation }: WebGLFallbackProps) {
  return (
    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center p-8 rounded-3xl bg-[#FFFFFF] border border-black/8 shadow-sm overflow-hidden">
      {/* Editorial aesthetic fallback card */}
      <div className="relative z-10 max-w-md text-center flex flex-col items-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DCEDE7] text-[#286A5B] mb-4">
          <Sparkles className="h-7 w-7" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F7F4] border border-black/5 text-[11px] font-mono text-[#286A5B] mb-3">
          <span>MEDICAL PRECISION RESTORATION</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-serif font-normal text-[#101715] tracking-tight mb-3">
          Engineered for natural longevity.
        </h3>

        <p className="text-sm text-[#747D79] leading-relaxed font-light mb-6">
          Precision Grade 5 titanium root foundation, custom Morse taper abutment connector, and monolithic translucent zirconia crown.
        </p>

        <div className="w-full grid grid-cols-3 gap-3 p-4 rounded-xl bg-[#F5F7F4] border border-black/5 text-left mb-6">
          <div>
            <div className="text-[10px] font-mono uppercase text-[#747D79]">Material</div>
            <div className="text-xs font-semibold text-[#101715]">Ti-6Al-4V</div>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase text-[#747D79]">Connection</div>
            <div className="text-xs font-semibold text-[#101715]">Conical Hex</div>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase text-[#747D79]">Ceramic</div>
            <div className="text-xs font-semibold text-[#101715]">Zirconia 3D</div>
          </div>
        </div>

        {onOpenConsultation && (
          <button
            onClick={onOpenConsultation}
            className="w-full py-3.5 px-6 rounded-full bg-[#173D35] hover:bg-[#101715] text-white text-xs font-medium uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
          >
            Book clinical consultation
          </button>
        )}
      </div>

      {/* Decorative background watermark */}
      <div className="absolute -bottom-10 -right-10 text-[120px] font-serif font-light text-black/[0.02] pointer-events-none select-none">
        IMPLANT
      </div>
    </div>
  );
}
