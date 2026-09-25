import React from 'react';
import { CLINIC_STATISTICS } from '../../lib/implantConfig';
import { TechnicalBadge } from '../ui/TechnicalBadge';
import { Award, Shield, CheckCircle } from 'lucide-react';

export function Statistics() {
  return (
    <section className="py-24 sm:py-32 bg-[#153F37] text-white overflow-hidden relative">
      {/* Subtle Background Glow & Grid */}
      <div className="absolute top-1/2 -left-32 w-96 h-96 bg-[var(--c-green-2)]/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--c-green-soft)]/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] -z-10" />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20">
          <div className="max-w-2xl">
            <TechnicalBadge code="STANDARDS" label="CLINICAL CREDIBILITY" variant="dark" />
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-normal font-serif tracking-tight text-white leading-tight">
              Grounded in science. <br />
              Proven by clinical outcomes.
            </h2>
          </div>

          <p className="max-w-md text-sm sm:text-base text-white/70 font-light leading-relaxed">
            Our clinical team operates at the intersection of medical engineering and aesthetic dentistry, maintaining rigorous biological protocols for predictable longevity.
          </p>
        </div>

        {/* 4 Large Editorial Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {CLINIC_STATISTICS.map((stat, idx) => (
            <div
              key={idx}
              className="relative flex flex-col justify-between rounded-2xl bg-white/5 p-8 sm:p-10 border border-white/10 backdrop-blur-xs hover:bg-white/[0.08] transition-all duration-300"
            >
              <div>
                <div className="text-[10px] font-mono tracking-widest text-[var(--c-green-soft)] uppercase mb-4">
                  0{idx + 1} / METRIC
                </div>

                <div className="text-5xl sm:text-6xl font-light font-serif tracking-tight text-white mb-2">
                  {stat.value}
                </div>

                <div className="text-sm font-semibold text-[var(--c-green-soft)] uppercase tracking-wider mb-3">
                  {stat.label}
                </div>

                <p className="text-xs sm:text-sm text-white/60 font-light leading-relaxed">
                  {stat.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-white/40 font-mono">
                // Verified clinic registry
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
