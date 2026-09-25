import React, { useState } from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { BEFORE_AFTER_CASES } from '../../lib/clinicConfig';
import { ShieldCheck, SlidersHorizontal, ArrowLeftRight } from 'lucide-react';
import { TechnicalBadge } from '../ui/TechnicalBadge';

export function Results() {
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const activeCase = BEFORE_AFTER_CASES[selectedCaseIdx] || BEFORE_AFTER_CASES[0];

  const handleSliderMove = (clientX: number, rect: DOMRect) => {
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    handleSliderMove(e.clientX, rect);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    handleSliderMove(e.touches[0].clientX, rect);
  };

  return (
    <section id="results" className="py-28 sm:py-36 bg-[var(--c-bg)] border-t border-white/10 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div data-stagger className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <TechnicalBadge code="THE OUTCOME" label="CLINICAL RESTORATIONS" />
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[2.5rem] font-medium font-serif tracking-tight text-white leading-[1.08]">
              The goal isn't a perfect tooth. <br />
              <span className="font-medium text-[var(--c-accent)]">It's one that belongs there.</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[var(--c-text-2)] font-light leading-relaxed">
              Natural aesthetics, biological emergence profiles and multi-layered zirconia crafted to harmonize seamlessly with your natural smile.
            </p>
          </div>

          {/* Case Selector Tabs */}
          <div className="flex items-center gap-2 bg-white/[0.05] backdrop-blur-md p-1.5 rounded-full border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
            {BEFORE_AFTER_CASES.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCaseIdx(idx);
                  setSliderPosition(50);
                }}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  idx === selectedCaseIdx
                    ? 'bg-[var(--c-accent)] text-[var(--c-bg)] shadow-xs'
                    : 'text-[var(--c-text-4)] hover:text-white'
                }`}
              >
                Case 0{idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Main Interactive Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Interactive Before/After Split Slider */}
          <div data-reveal="left" className="lg:col-span-8">
            <div
              className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.35)] border border-white/10 select-none cursor-ew-resize bg-[var(--c-bg)]"
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
            >
              {/* "After" Image (Full Width Base) */}
              <img
                src={activeCase.afterImage}
                alt="After Dental Implant Restoration"
                className="absolute inset-0 h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 right-4 bg-[var(--c-ink)]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-medium text-white shadow-md">
                Restored Smile
              </div>

              {/* "Before" Image (Clipped overlay) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
              >
                <img
                  src={activeCase.beforeImage}
                  alt="Before Dental Implant Treatment"
                  className="absolute inset-0 h-full w-full object-cover max-w-none"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-medium text-[var(--c-ink)] shadow-md">
                  Initial Condition
                </div>
              </div>

              {/* Vertical Drag Handle Divider */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white shadow-2xl z-20 flex items-center justify-center pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[var(--c-bg)] shadow-xl border border-white/10">
                  <ArrowLeftRight className="h-4 w-4" />
                </div>
              </div>

              {/* Bottom Drag Instruction */}
              <div className="absolute bottom-4 inset-x-0 flex justify-center pointer-events-none">
                <div className="flex items-center gap-1.5 rounded-full bg-[var(--c-ink)]/75 px-3.5 py-1 text-[11px] text-white/90 backdrop-blur-md">
                  <SlidersHorizontal className="h-3 w-3" />
                  <span>Drag slider horizontally to compare</span>
                </div>
              </div>
            </div>

            <p className="mt-3 text-xs text-[var(--c-text-4)] italic">
              * Clinical photography representative of actual cases. Individual healing timelines vary based on bone physiology.
            </p>
          </div>

          {/* Right: Case Clinical Details Card */}
          <div data-reveal="right" className="lg:col-span-4 flex flex-col justify-between rounded-2xl bg-white/[0.05] backdrop-blur-md p-8 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TechnicalBadge code="CASE STUDY" label={activeCase.category} />
              </div>

              <h3 className="text-2xl font-serif font-normal text-white tracking-tight mb-4">
                {activeCase.title}
              </h3>

              <p className="text-sm text-[var(--c-text-2)] leading-relaxed font-light mb-6">
                {activeCase.description}
              </p>

              {/* Specifications */}
              <div className="space-y-3 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--c-text-4)]">Patient Demographic</span>
                  <span className="font-semibold text-white">{activeCase.patientAge}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--c-text-4)]">Treatment Duration</span>
                  <span className="font-semibold text-white">{activeCase.treatmentDuration}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--c-text-4)]">Ceramic Shade</span>
                  <span className="font-semibold text-white">{activeCase.shade}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--c-text-4)]">Implant Platform</span>
                  <span className="font-semibold text-white">{activeCase.implantType}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-2 text-xs text-[var(--c-accent)]">
              <ShieldCheck className="h-4 w-4" />
              <span>Full biological integration verified post-op</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
