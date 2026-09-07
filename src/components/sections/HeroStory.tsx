import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ImplantCanvas } from '../three/ImplantCanvas';
import { Button } from '../ui/Button';
import { TechnicalBadge } from '../ui/TechnicalBadge';
import { ArrowRight, ChevronDown, CheckCircle2, Sliders, Shield, Sparkles } from 'lucide-react';
import { STORY_SCENES } from '../../lib/implantStory';

gsap.registerPlugin(ScrollTrigger);

interface HeroStoryProps {
  onOpenConsultation: () => void;
  onOpen3DViewer?: () => void;
}

export function HeroStory({ onOpenConsultation, onOpen3DViewer }: HeroStoryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!containerRef.current) return;

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Determine active scene
  const activeScene =
    STORY_SCENES.find(
      (s) => scrollProgress >= s.progressStart && scrollProgress < s.progressEnd
    ) || STORY_SCENES[STORY_SCENES.length - 1];

  // Helper for scene opacity fades
  const getSceneOpacity = (start: number, end: number) => {
    const fadeRange = 0.025;
    if (scrollProgress < start - fadeRange || scrollProgress > end + fadeRange) return 0;
    if (scrollProgress >= start && scrollProgress <= end) return 1;
    if (scrollProgress < start) return (scrollProgress - (start - fadeRange)) / fadeRange;
    return (end + fadeRange - scrollProgress) / fadeRange;
  };

  const scrollToStory = () => {
    window.scrollTo({
      top: window.innerHeight * 0.9,
      behavior: 'smooth',
    });
  };

  return (
    <section
      ref={containerRef}
      className="relative h-[900vh] bg-[#F5F7F4] text-[#101715]"
    >
      {/* Sticky Fullscreen Stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between">
        {/* Subtle Background Grid */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#14201c06_1px,transparent_1px),linear-gradient(to_bottom,#14201c06_1px,transparent_1px)] bg-[size:4rem_4rem] -z-10" />

        {/* 1. GIANT BACKGROUND WATERMARK TYPOGRAPHY (Depth Layers) */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center -z-10 select-none overflow-hidden">
          {/* Scene 02: "PRECISION" */}
          <div
            className="absolute text-[13vw] sm:text-[14vw] font-serif font-light tracking-[0.2em] text-[#14201C]/[0.045] uppercase transition-all duration-300 transform"
            style={{
              opacity: getSceneOpacity(0.09, 0.2),
              transform: `scale(${1 + scrollProgress * 0.15})`,
            }}
          >
            PRECISION
          </div>

          {/* Scene 05: "BIOCOMPATIBLE / TITANIUM" */}
          <div
            className="absolute text-[12vw] sm:text-[13vw] font-serif font-light tracking-[0.16em] text-[#173D35]/[0.05] uppercase transition-all duration-300"
            style={{
              opacity: getSceneOpacity(0.46, 0.58),
              transform: `scale(${0.95 + scrollProgress * 0.1})`,
            }}
          >
            TITANIUM
          </div>

          {/* Scene 11: "NATURAL / BY DESIGN" */}
          <div
            className="absolute text-center transition-all duration-500"
            style={{
              opacity: getSceneOpacity(0.95, 1.0),
              transform: `translateY(${(1 - scrollProgress) * 40}px)`,
            }}
          >
            <div className="text-[12vw] sm:text-[13vw] font-serif font-light tracking-tight text-[#14201C]/[0.06] leading-none">
              NATURAL
            </div>
            <div className="text-[3vw] sm:text-[2.5vw] font-mono tracking-[0.3em] text-[#286A5B]/20 uppercase">
              BY DESIGN.
            </div>
          </div>
        </div>

        {/* 2. MAIN 3D CANVAS (Rendered once, travels through space) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <ImplantCanvas
            scrollProgress={scrollProgress}
            onOpenConsultation={onOpenConsultation}
          />
        </div>

        {/* 3. DYNAMIC TEXT OVERLAYS CHOREOGRAPHY */}
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 h-full flex flex-col justify-between py-24 sm:py-28 pointer-events-none">
          {/* TOP STATUS BAR: Subtle scroll chapter indicator */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#286A5B] animate-pulse" />
              <span className="text-[11px] font-mono tracking-widest text-[#747D79] uppercase">
                SCENE {activeScene.id.toUpperCase()} // PROGRESS {Math.round(scrollProgress * 100)}%
              </span>
            </div>

            {/* Quick interactive inspect button */}
            {onOpen3DViewer && (
              <button
                onClick={onOpen3DViewer}
                className="pointer-events-auto hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white text-xs font-mono text-[#101715] border border-black/8 shadow-xs backdrop-blur-sm transition-all hover:scale-105 cursor-pointer"
              >
                <Sliders className="h-3 w-3 text-[#286A5B]" />
                <span>360° Manual Inspector</span>
              </button>
            )}
          </div>

          {/* MAIN DYNAMIC CONTENT SLIDES */}
          <div className="relative w-full flex-1 flex items-center">
            {/* SCENE 01: HERO (Model LEFT, Text RIGHT) */}
            <div
              className="absolute inset-0 flex items-center justify-end transition-opacity duration-300"
              style={{ opacity: getSceneOpacity(0.0, 0.08) }}
            >
              <div className="w-full lg:w-[48%] flex flex-col items-start text-left pointer-events-auto">
                <TechnicalBadge code="SWISS DENTAL ENGINEERING" label="ADVANCED IMPLANTOLOGY" />

                <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-normal font-serif tracking-tight text-[#101715] leading-[1.08]">
                  Built to become <br />
                  <span className="italic font-light text-[#173D35]">part of you.</span>
                </h1>

                <p className="mt-5 text-base sm:text-lg text-[#747D79] leading-relaxed font-light max-w-lg">
                  Precision implant dentistry combining digital diagnostics, computer-guided planning and biological titanium osseointegration.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={onOpenConsultation}
                    icon={<ArrowRight className="h-4 w-4" />}
                  >
                    Book consultation
                  </Button>

                  <button
                    onClick={scrollToStory}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#101715] hover:text-[#286A5B] transition-colors py-2 px-3 group cursor-pointer"
                  >
                    <span>Discover how it works</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>

                <div className="mt-10 pt-6 border-t border-black/8 flex items-center gap-6 text-xs text-[#747D79]">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#286A5B]" />
                    <span>0.075mm 3D CBCT Accuracy</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#286A5B]" />
                    <span>Grade 5 Titanium</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SCENE 02: PRECISION (Model CENTER, Text BOTTOM) */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-end pb-8 sm:pb-12 text-center transition-opacity duration-300"
              style={{ opacity: getSceneOpacity(0.09, 0.2) }}
            >
              <div className="max-w-xl mx-auto flex flex-col items-center pointer-events-auto">
                <TechnicalBadge code="0.05 MM TOLERANCE" label="DIGITAL PRECISION" />
                <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#101715]">
                  Designed digitally. <br />
                  <span className="italic">Placed precisely.</span>
                </h2>
                <p className="mt-3 text-xs sm:text-sm text-[#747D79] font-light max-w-md">
                  Every surgical angle, bone emergence profile, and cortical anchor is mapped virtually prior to procedure.
                </p>
              </div>
            </div>

            {/* SCENE 03: FOUNDATION (Model RIGHT, Text LEFT) */}
            <div
              className="absolute inset-0 flex items-center justify-start transition-opacity duration-300"
              style={{ opacity: getSceneOpacity(0.2, 0.32) }}
            >
              <div className="w-full lg:w-[46%] flex flex-col items-start text-left pointer-events-auto">
                <div className="text-xs font-mono tracking-widest text-[#286A5B] uppercase mb-2">
                  01 / FOUNDATION
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#101715] leading-tight">
                  Strength begins <br />
                  <span className="italic font-light">below the surface.</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base text-[#747D79] font-light leading-relaxed">
                  A biocompatible titanium implant creates a stable, lasting foundation inside the jaw, permanently fusing with bone tissue through biological osseointegration.
                </p>
                <div className="mt-6 space-y-2 text-xs text-[#101715]/80 font-medium">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#286A5B]" />
                    <span>Grade 5 Ti-6Al-4V Medical Titanium Alloy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#286A5B]" />
                    <span>Micro-Textured SLA Surface Treatment</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SCENE 04: EXPLODED VIEW (Model RIGHT, Text LEFT) */}
            <div
              className="absolute inset-0 flex items-center justify-start transition-opacity duration-300"
              style={{ opacity: getSceneOpacity(0.32, 0.46) }}
            >
              <div className="w-full lg:w-[46%] flex flex-col items-start text-left pointer-events-auto">
                <TechnicalBadge code="TRI-PART MODULAR" label="ANATOMICAL ARCHITECTURE" />
                <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#101715] leading-tight">
                  Three precision elements. <br />
                  <span className="italic font-light">One biological bond.</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base text-[#747D79] font-light leading-relaxed">
                  The crown restores aesthetic chew function; the abutment creates a hermetic seal against bacteria; the titanium root replicates natural tooth roots.
                </p>
                <div className="mt-6 w-full space-y-3 pt-4 border-t border-black/8">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#747D79]">01. Zirconia Crown</span>
                    <span className="font-semibold text-[#101715]">1,200 MPa Flexural Strength</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#747D79]">02. Morse Taper Connector</span>
                    <span className="font-semibold text-[#101715]">Zero Micro-Gap Conical Seal</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#747D79]">03. Root Fixture</span>
                    <span className="font-semibold text-[#101715]">Self-Tapping Helical Threads</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SCENE 05: TRANSITION ACROSS SCREEN (Model Glides Across, Text Yields) */}
            <div
              className="absolute inset-0 flex items-center justify-center text-center transition-opacity duration-300"
              style={{ opacity: getSceneOpacity(0.46, 0.56) }}
            >
              <div className="max-w-md mx-auto pointer-events-auto">
                <div className="text-xs font-mono tracking-widest text-[#286A5B] uppercase mb-2">
                  CELLULAR INTEGRATION
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif text-[#101715]">
                  Pure biocompatibility.
                </h3>
                <p className="mt-2 text-xs text-[#747D79] font-light">
                  Living osteoblasts attach directly onto titanium micro-pores.
                </p>
              </div>
            </div>

            {/* SCENE 06: TITANIUM CLOSE-UP (Model LEFT, Text RIGHT) */}
            <div
              className="absolute inset-0 flex items-center justify-end transition-opacity duration-300"
              style={{ opacity: getSceneOpacity(0.56, 0.67) }}
            >
              <div className="w-full lg:w-[48%] flex flex-col items-start text-left pointer-events-auto">
                <div className="text-xs font-mono tracking-widest text-[#286A5B] uppercase mb-2">
                  02 / TITANIUM
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#101715] leading-tight">
                  Engineered to <br />
                  <span className="italic font-light">integrate.</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base text-[#747D79] font-light leading-relaxed">
                  Precision thread geometry and biocompatible titanium create a strong foundation designed for long-term stability and bone preservation.
                </p>

                {/* Vertical Specification Layout */}
                <div className="mt-6 w-full space-y-4 pt-4 border-t border-black/8">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-semibold text-[#101715] uppercase tracking-wider">TITANIUM</div>
                      <div className="text-xs text-[#747D79] font-light">Biocompatible Grade 5 alloy with zero allergic reactivity</div>
                    </div>
                    <span className="text-[11px] font-mono text-[#286A5B]">99.2% SURVIVAL</span>
                  </div>

                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-semibold text-[#101715] uppercase tracking-wider">PRECISION</div>
                      <div className="text-xs text-[#747D79] font-light">Helical self-tapping thread pitch for optimal bone compression</div>
                    </div>
                    <span className="text-[11px] font-mono text-[#286A5B]">35-45 Ncm TORQUE</span>
                  </div>

                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-semibold text-[#101715] uppercase tracking-wider">STABILITY</div>
                      <div className="text-xs text-[#747D79] font-light">Micro-textured SLA surface accelerates cellular attachment</div>
                    </div>
                    <span className="text-[11px] font-mono text-[#286A5B]">ISQ &gt; 70</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SCENE 07: IMPLANT PLACEMENT (Model CENTER into Bone, Text BOTTOM) */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-end pb-8 text-center transition-opacity duration-300"
              style={{ opacity: getSceneOpacity(0.67, 0.77) }}
            >
              <div className="max-w-xl mx-auto pointer-events-auto">
                <TechnicalBadge code="MINIMALLY INVASIVE" label="SURGICAL GUIDANCE" />
                <h2 className="mt-3 text-3xl sm:text-4xl font-serif text-[#101715]">
                  Flapless, guided insertion.
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-[#747D79] font-light max-w-md mx-auto">
                  Using 3D printed surgical guides, the titanium fixture is seated with exact angulation and depth, minimizing soft tissue disruption.
                </p>
              </div>
            </div>

            {/* SCENE 08: DIGITAL PLANNING (Model Slight RIGHT, Text LEFT) */}
            <div
              className="absolute inset-0 flex items-center justify-start transition-opacity duration-300"
              style={{ opacity: getSceneOpacity(0.77, 0.86) }}
            >
              <div className="w-full lg:w-[46%] flex flex-col items-start text-left pointer-events-auto">
                <div className="text-xs font-mono tracking-widest text-[#286A5B] uppercase mb-2">
                  03 / DIGITAL PLANNING
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#101715] leading-tight">
                  Know the position <br />
                  <span className="italic font-light">before treatment begins.</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base text-[#747D79] font-light leading-relaxed">
                  Virtual 3D CBCT simulation maps mandibular canals, maxillary sinus floors, and ideal emergence profiles with absolute spatial certainty.
                </p>
                <div className="mt-6 flex items-center gap-4 text-xs font-mono text-[#286A5B] bg-white/80 px-4 py-2.5 rounded-xl border border-black/8 backdrop-blur-xs">
                  <span>PLANNED ANGLE: 12.0°</span>
                  <span>•</span>
                  <span>CORTICAL DEPTH: 10.5mm</span>
                </div>
              </div>
            </div>

            {/* SCENE 09 & 10: ABUTMENT & CROWN ASSEMBLY */}
            <div
              className="absolute inset-0 flex items-center justify-end transition-opacity duration-300"
              style={{ opacity: getSceneOpacity(0.86, 0.94) }}
            >
              <div className="w-full lg:w-[46%] flex flex-col items-start text-left pointer-events-auto">
                <TechnicalBadge code="CONICAL SEAL" label="RESTORATIVE LOCK" />
                <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#101715] leading-tight">
                  The connection between <br />
                  <span className="italic font-light">strength and aesthetics.</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base text-[#747D79] font-light leading-relaxed">
                  The custom titanium abutment snaps into position with an airtight Morse taper connection, followed by the seamless seating of the custom ceramic crown.
                </p>
              </div>
            </div>

            {/* SCENE 11: FINAL RESTORED TOOTH (Model CENTER, Text BOTTOM CTA) */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-end pb-8 text-center transition-opacity duration-300"
              style={{ opacity: getSceneOpacity(0.94, 1.0) }}
            >
              <div className="max-w-xl mx-auto flex flex-col items-center pointer-events-auto">
                <TechnicalBadge code="COMPLETE RESTORATION" label="CLINICAL EXCELLENCE" />
                <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#101715]">
                  Made to look like <br />
                  <span className="italic">it was always yours.</span>
                </h2>
                <p className="mt-3 text-xs sm:text-sm text-[#747D79] font-light max-w-md">
                  Biocompatible stability, natural translucency, and permanent functional restoration.
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={onOpenConsultation}
                    icon={<ArrowRight className="h-4 w-4" />}
                  >
                    Start your restoration plan
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM SCROLL PROMPT */}
          <div className="flex items-center justify-between w-full pt-4 border-t border-black/8 text-xs text-[#747D79]">
            <div className="flex items-center gap-2">
              <ChevronDown className="h-4 w-4 text-[#286A5B] animate-bounce" />
              <span className="font-mono text-[11px]">SCROLL TO EXPLORE ANATOMY & PLACEMENT</span>
            </div>

            <div className="hidden sm:flex items-center gap-6 font-mono text-[11px]">
              <span>01 HERO</span>
              <span>02 EXPLODED</span>
              <span>03 TITANIUM</span>
              <span>04 PLACEMENT</span>
              <span>05 RESTORATION</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
