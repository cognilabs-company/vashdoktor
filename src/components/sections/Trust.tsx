import React from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { TechnicalBadge } from '../ui/TechnicalBadge';
import { HeartHandshake, Eye, Sparkles, Shield, UserCheck, Stethoscope } from 'lucide-react';

export function Trust() {
  const pillars = [
    {
      title: "Detailed Consultation",
      description: "We devote generous one-on-one time to understand your personal aesthetic goals, medical background, and lifestyle expectations.",
      icon: (
        <svg className="h-6 w-6 text-[#246B5B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <path d="M8 10h8" />
          <path d="M8 14h4" />
        </svg>
      ),
    },
    {
      title: "Transparent Planning",
      description: "No hidden clinical fees or sudden surprises. Every phase, diagnostic test, and restorative material is itemized clearly before beginning.",
      icon: (
        <svg className="h-6 w-6 text-[#246B5B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      title: "Modern Diagnostics",
      description: "Using digital intraoral optical scanners and ultra-low-dose CBCT, we eliminate uncomfortable physical impressions and reduce radiation exposure.",
      icon: (
        <svg className="h-6 w-6 text-[#246B5B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3v3" />
          <path d="M12 18v3" />
          <path d="M3 12h3" />
          <path d="M18 12h3" />
        </svg>
      ),
    },
    {
      title: "Patient-Focused Comfort",
      description: "From gentle local computer-controlled anesthesia to soothing private recovery suites, your physical and emotional comfort is safeguarded.",
      icon: (
        <svg className="h-6 w-6 text-[#246B5B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      ),
    },
    {
      title: "Lifetime Follow-Up Care",
      description: "Our dedicated hygiene team provides scheduled maintenance, peri-implant health monitoring, and long-term restorative verification.",
      icon: (
        <svg className="h-6 w-6 text-[#246B5B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-24 sm:py-32 bg-[#FFFFFF] border-t border-black/5 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20">
          <SectionHeading
            eyebrow="PATIENT PHILOSOPHY"
            title="Advanced treatment.\nHuman care."
            subtitle="Technology elevates precision, but empathy and meticulous clinical listening define true patient wellbeing."
          />

          <TechnicalBadge code="STANDARDS" label="PATIENT-FIRST ETHOS" />
        </div>

        {/* 5 Pillar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((p, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#F7F8F6] p-8 border border-black/5 hover:border-[#246B5B]/30 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-xs border border-black/5 mb-6">
                  {p.icon}
                </div>
                <h3 className="text-xl font-serif text-[#111816] mb-3">
                  {p.title}
                </h3>
                <p className="text-sm text-[#68716D] font-light leading-relaxed">
                  {p.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-black/5 text-[11px] font-mono text-[#246B5B]">
                0{idx + 1} / CARE PRINCIPLE
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
