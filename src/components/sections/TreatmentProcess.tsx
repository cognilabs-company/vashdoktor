import React, { useState } from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { TREATMENT_PROCESS_STEPS } from '../../lib/implantConfig';
import { Clock, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { TechnicalBadge } from '../ui/TechnicalBadge';

export function TreatmentProcess() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="process" className="py-24 sm:py-32 bg-[#F7F8F6] border-t border-black/5 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20">
          <SectionHeading
            eyebrow="CLINICAL PROTOCOL"
            title="A structured, transparent\npathway to restoration."
            subtitle="Every treatment phase is calibrated to maximize biological osseointegration, aesthetic perfection, and patient comfort."
          />

          <TechnicalBadge code="06 PHASES" label="STEP-BY-STEP WORKFLOW" />
        </div>

        {/* 6 Step Interactive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Interactive Step List */}
          <div className="lg:col-span-7 space-y-4">
            {TREATMENT_PROCESS_STEPS.map((step, idx) => {
              const isSelected = idx === activeStep;

              return (
                <div
                  key={step.number}
                  onClick={() => setActiveStep(idx)}
                  className={`cursor-pointer rounded-2xl p-6 sm:p-7 transition-all duration-300 border ${
                    isSelected
                      ? 'bg-white shadow-md border-[#246B5B]/30'
                      : 'bg-white/60 hover:bg-white/90 border-black/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span
                        className={`font-mono text-lg sm:text-xl font-medium transition-colors ${
                          isSelected ? 'text-[#246B5B]' : 'text-[#68716D]'
                        }`}
                      >
                        {step.number}
                      </span>
                      <h3 className="text-lg sm:text-xl font-serif text-[#111816] font-normal">
                        {step.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="hidden sm:inline-flex items-center gap-1 text-xs text-[#68716D] bg-[#F7F8F6] px-2.5 py-1 rounded-full border border-black/5">
                        <Clock className="h-3 w-3 text-[#246B5B]" />
                        {step.duration}
                      </span>
                      {isSelected ? (
                        <ChevronUp className="h-4 w-4 text-[#246B5B]" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-[#68716D]" />
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="mt-4 pt-4 border-t border-black/5 transition-all">
                      <p className="text-sm sm:text-base text-[#68716D] font-light leading-relaxed mb-4">
                        {step.description}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {step.details.map((detail, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-xs text-[#111816] bg-[#F7F8F6] p-2 rounded-lg"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#246B5B] shrink-0" />
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: Active Phase Summary Card */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="rounded-2xl bg-[#153F37] text-white p-8 sm:p-10 shadow-xl border border-white/10 relative overflow-hidden">
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#246B5B]/30 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <div className="text-xs font-mono text-[#DCEDE7] uppercase tracking-widest mb-2">
                  ACTIVE PHASE SUMMARY
                </div>
                <div className="text-4xl font-serif text-white mb-2">
                  {TREATMENT_PROCESS_STEPS[activeStep].number}
                </div>
                <h4 className="text-2xl font-serif text-white mb-4">
                  {TREATMENT_PROCESS_STEPS[activeStep].title}
                </h4>

                <p className="text-sm text-white/70 font-light leading-relaxed mb-6">
                  {TREATMENT_PROCESS_STEPS[activeStep].description}
                </p>

                <div className="rounded-xl bg-white/10 p-4 border border-white/10 text-xs space-y-2 mb-6">
                  <div className="text-[#DCEDE7] font-semibold flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Estimated Duration: {TREATMENT_PROCESS_STEPS[activeStep].duration}</span>
                  </div>
                  <p className="text-white/60">
                    Surgical timing varies according to immediate vs. delayed biological integration protocols.
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-mono uppercase text-[#DCEDE7] tracking-wider block">
                    Protocol Key Deliverables:
                  </span>
                  {TREATMENT_PROCESS_STEPS[activeStep].details.map((d, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-white/90">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#DCEDE7]" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
