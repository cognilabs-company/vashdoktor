import React from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { TechnicalBadge } from '../ui/TechnicalBadge';
import { Scan, Eye, Activity, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export function DigitalWorkflow() {
  const steps = [
    {
      num: "01",
      title: "3D Diagnostics",
      tag: "CBCT VOLUMETRIC SCAN",
      desc: "Ultra-low-radiation 3D Cone Beam CT imaging provides an exact high-resolution volumetric map of your jawbone density, nerve paths, and adjacent root structures.",
      specs: ["0.075mm Voxel Resolution", "Zero-Distortion Mapping", "Virtual Nerve Tracing"],
      icon: <Scan className="h-6 w-6 text-[var(--c-green-2)]" />,
    },
    {
      num: "02",
      title: "Digital Planning",
      tag: "CAD/CAM SIMULATION",
      desc: "Implant diameter, angulation, and bone-depth are planned virtually on specialized surgical software, allowing the entire procedure to be completed before surgery begins.",
      specs: ["3D Virtual Osteotomy", "Custom Surgical Guide", "Predictable Emergence"],
      icon: <Eye className="h-6 w-6 text-[var(--c-green-2)]" />,
    },
    {
      num: "03",
      title: "Precision Treatment",
      tag: "GUIDED SURGERY",
      desc: "The digitally verified treatment is translated directly to the clinical procedure via custom 3D-printed surgical templates, ensuring sub-millimeter placement accuracy.",
      specs: ["Minimally Invasive Flapless", "Optimal Primary Stability", "Reduced Healing Time"],
      icon: <Activity className="h-6 w-6 text-[var(--c-green-2)]" />,
    },
  ];

  return (
    <section id="technology" className="relative py-24 sm:py-32 bg-[#FFFFFF] border-t border-black/5 overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--c-green-soft)]/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20">
          <SectionHeading
            eyebrow="DIGITAL WORKFLOW"
            title="Planned before\ntreatment begins."
            subtitle="Eliminating guesswork through state-of-the-art 3D imaging, digital virtual simulations, and computer-guided surgical navigation."
          />

          <div className="flex items-center gap-4">
            <TechnicalBadge code="PROTOCOLS" label="GUIDED SURGERY 4.0" />
          </div>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          {/* Subtle connecting horizontal guide line */}
          <div className="hidden lg:block absolute top-12 inset-x-12 h-px bg-gradient-to-r from-[var(--c-green-2)]/20 via-[var(--c-green-2)]/40 to-[var(--c-green-2)]/20 -z-10" />

          {steps.map((step, idx) => (
            <div
              key={step.num}
              className="group relative flex flex-col justify-between rounded-2xl bg-[var(--c-paper)] p-8 sm:p-10 border border-black/5 hover:border-[var(--c-green-2)]/30 hover:shadow-lg transition-all duration-300"
            >
              <div>
                {/* Step Top Header */}
                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono text-3xl sm:text-4xl font-light text-[var(--c-green-2)]">
                    {step.num}
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-xs border border-black/5 group-hover:scale-110 transition-transform">
                    {step.icon}
                  </div>
                </div>

                <div className="text-[11px] font-mono tracking-wider uppercase text-[var(--c-green-2)] mb-1.5 font-semibold">
                  {step.tag}
                </div>

                <h3 className="text-2xl font-normal font-serif text-[var(--c-ink-2)] tracking-tight mb-4">
                  {step.title}
                </h3>

                <p className="text-sm sm:text-base text-[var(--c-ink-text-2)] leading-relaxed font-light mb-8">
                  {step.desc}
                </p>
              </div>

              {/* Spec points */}
              <div className="pt-6 border-t border-black/8 space-y-2">
                {step.specs.map((spec, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-[var(--c-ink-2)]/80">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[var(--c-green-2)] shrink-0" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
