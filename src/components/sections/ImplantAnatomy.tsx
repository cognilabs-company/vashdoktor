import React, { useRef, useState, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnatomyImplant, AnatomyPart } from '../three/AnatomyImplant';

gsap.registerPlugin(ScrollTrigger);

// Sequential phase choreography: Crown lifts, then Abutment, then the fixture is
// read inside the (ghosted) bone, threads, then bone + gum. Implant/gum/bone stay
// in place (explode 0) — only crown & abutment separate upward.
const PARTS: AnatomyPart[] = [
  { key: 'crown', mesh: 'Crown', title: 'Crown', text: 'Tishning ko‘rinadigan sun’iy qismi.', explode: [0, 1.9, 0], phaseStart: 0.12, side: 'right' },
  { key: 'abutment', mesh: 'Abutment', title: 'Abutment', text: 'Crown va implantni bog‘lovchi qism.', explode: [0, 0.95, 0], phaseStart: 0.3, side: 'right' },
  { key: 'implant', mesh: 'Implant', title: 'Implant', text: 'Jag‘ suyagiga joylashtiriladigan titanium asos.', explode: [0, 0, 0], phaseStart: 0.46, side: 'left' },
  { key: 'threads', mesh: 'Implant', title: 'Threads', text: 'Suyak ichida mustahkam ushlanishni ta’minlaydi.', explode: [0, 0, 0], phaseStart: 0.62, side: 'left' },
  { key: 'bone', mesh: 'Bone', title: 'Jaw Bone', text: 'Implant joylashadigan suyak qismi.', explode: [0, 0, 0], phaseStart: 0.78, revealAt: 0.44, side: 'left' },
  { key: 'gum', mesh: 'Gum', title: 'Gum', text: 'Implant atrofidagi yumshoq to‘qima.', explode: [0, 0, 0], phaseStart: 0.86, side: 'left' },
];

export function ImplantAnatomy() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(-1);

  // GSAP ScrollTrigger pin (works with Lenis; CSS sticky does not — Lenis
  // transforms the scroll wrapper which breaks position:sticky).
  useLayoutEffect(() => {
    const el = sectionRef.current;
    const stage = stageRef.current;
    if (!el || !stage) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: '+=3600',
        pin: stage,
        pinSpacing: true,
        scrub: 1,
        // lower priority => refreshes AFTER the story's pin above it, so its
        // start/end account for the story pin-spacer (avoids stale positions)
        refreshPriority: -1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          setProgress(p);
          // active = last part whose phase has begun (reverses cleanly on scroll-up)
          let a = -1;
          for (let i = 0; i < PARTS.length; i++) {
            if (p >= PARTS[i].phaseStart) a = i;
          }
          setActive(a);
        },
      });
    }, sectionRef);

    // refresh after other pins on the page have been created
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => {
      window.clearTimeout(t);
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="anatomy"
      ref={sectionRef}
      className="relative w-full bg-[var(--c-paper)] text-[var(--c-ink)]"
    >
      <div
        ref={stageRef}
        className="relative w-full h-[100svh] min-h-[640px] overflow-hidden flex items-center"
      >
        {/* soft studio backdrop */}
        <div className="absolute inset-0 -z-[5] pointer-events-none bg-[radial-gradient(ellipse_70%_60%_at_62%_50%,rgba(16,27,23,0.06),transparent_72%)]" />

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full">
          {/* LEFT — title, intro, part cards */}
          <div className="flex flex-col justify-center py-16 lg:py-0 order-2 lg:order-1">
            <div className="text-[10.5px] font-mono tracking-[0.22em] text-[var(--c-green)] uppercase mb-3.5">
              Anatomiya
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-[2.1rem] font-medium tracking-[-0.02em] leading-[1.15] text-[var(--c-ink)]">
              Implant qanday ishlaydi?
            </h2>
            <p className="mt-4 text-sm sm:text-[15px] text-[#5F6B66] leading-relaxed max-w-md">
              Har bir qism tabiiy tish funksiyasini tiklashda muhim rol o‘ynaydi.
            </p>

            <div className="mt-8 flex flex-col gap-1.5 max-w-md">
              {PARTS.map((p, i) => {
                const on = active === i;
                return (
                  <div
                    key={p.key}
                    className={`group relative rounded-xl border px-4 py-3 transition-all duration-300 ${
                      on
                        ? 'border-[var(--c-green)]/30 bg-white shadow-sm'
                        : 'border-black/6 bg-white/40'
                    }`}
                  >
                    <div className="flex items-baseline gap-3">
                      <span
                        className={`text-[11px] font-mono tabular-nums transition-colors ${
                          on ? 'text-[var(--c-green)]' : 'text-[#A7AEA9]'
                        }`}
                      >
                        0{i + 1}
                      </span>
                      <div className="flex-1">
                        <div
                          className={`text-sm font-semibold tracking-[-0.01em] transition-colors ${
                            on ? 'text-[#12332c]' : 'text-[#3c4642]'
                          }`}
                        >
                          {p.title}
                        </div>
                        <div
                          className={`text-[13px] leading-snug mt-0.5 transition-all duration-300 ${
                            on ? 'text-[#5F6B66] max-h-16 opacity-100' : 'text-[#8b938e] max-h-16 opacity-70'
                          }`}
                        >
                          {p.text}
                        </div>
                      </div>
                    </div>
                    {/* active accent bar */}
                    <span
                      className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-full bg-[var(--c-green)] transition-all duration-300 ${
                        on ? 'h-8 opacity-100' : 'h-0 opacity-0'
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT — 3D exploded implant */}
          <div className="relative h-[52vh] lg:h-full order-1 lg:order-2">
            <div className="absolute inset-0">
              <AnatomyImplant parts={PARTS} progress={progress} active={active} />
            </div>

            {/* progress hint */}
            <div className="absolute bottom-4 inset-x-0 flex justify-center pointer-events-none">
              <span className="text-[10px] font-mono tracking-widest text-[#9aa39f] uppercase">
                {active < 0 ? 'Scroll — implantni ochish' : `${active + 1} / ${PARTS.length}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
