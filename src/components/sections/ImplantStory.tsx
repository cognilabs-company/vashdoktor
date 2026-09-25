import React, { useRef, useState, useCallback, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ChevronDown, Sliders } from 'lucide-react';
import { Button } from '../ui/Button';
import { TechnicalBadge } from '../ui/TechnicalBadge';
import { StoryImplantCanvas, Story3DTargets } from '../three/StoryImplantCanvas';

gsap.registerPlugin(ScrollTrigger);

interface ImplantStoryProps {
  onOpenConsultation: () => void;
  onOpen3DViewer?: () => void;
}

/**
 * SceneText — a text block that lives in a dedicated column that NEVER overlaps
 * the 3D model.
 *  - Desktop: a ~40% column pinned to one side (opposite the model), vertically
 *    centered, with generous breathing space toward the middle.
 *  - Mobile: a bottom block below the (upper-centered) model — never on top of it.
 */
function SceneText({
  side,
  innerRef,
  children,
}: {
  side: 'left' | 'right';
  innerRef: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
}) {
  const desktop =
    side === 'right'
      ? 'lg:left-auto lg:right-0 lg:w-[42%] lg:h-full lg:pr-[5vw] lg:pl-0 lg:items-center lg:justify-start lg:text-left'
      : 'lg:right-auto lg:left-0 lg:w-[42%] lg:h-full lg:pl-[5vw] lg:pr-0 lg:items-center lg:justify-start lg:text-left';

  return (
    <div
      ref={innerRef}
      className={`absolute inset-x-0 bottom-0 h-[42%] flex flex-col items-center justify-start text-center px-6 pointer-events-none ${desktop}`}
    >
      <div className="w-full max-w-md lg:max-w-[26rem] flex flex-col pointer-events-auto">
        {children}
      </div>
    </div>
  );
}

export function ImplantStory({ onOpenConsultation, onOpen3DViewer }: ImplantStoryProps) {
  const storyRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const [activeChapter, setActiveChapter] = useState('01 / OVERVIEW');
  const [storyProgress, setStoryProgress] = useState(0);

  // DOM text scene references (6 disciplined scenes)
  const s1 = useRef<HTMLDivElement>(null);
  const s2 = useRef<HTMLDivElement>(null);
  const s3 = useRef<HTMLDivElement>(null);
  const s4 = useRef<HTMLDivElement>(null);
  const s5 = useRef<HTMLDivElement>(null);
  const s6 = useRef<HTMLDivElement>(null);

  const modelTargetsRef = useRef<Story3DTargets | null>(null);

  const setupTimeline = useCallback(() => {
    if (!storyRef.current || !stageRef.current || !modelTargetsRef.current) return;

    const t = modelTargetsRef.current;
    const scenes = [s1.current, s2.current, s3.current, s4.current, s5.current, s6.current].filter(Boolean);

    // Model side anchors — kept well off-centre so the text column never collides
    const LEFT = -1.8;
    const RIGHT = 1.8;

    const assemble = () => {
      t.crown.position.set(0, 1.15, 0);
      t.abutment.position.set(0, 0.46, 0);
      t.screw.position.set(0, 0.62, 0);
      t.implant.position.set(0, -0.58, 0);
    };

    const mm = gsap.matchMedia();

    // ===============================================================
    // DESKTOP — split composition, model one side / text the other
    // ===============================================================
    mm.add('(min-width: 1024px)', () => {
      gsap.set(scenes, { autoAlpha: 0, y: 24 });
      gsap.set(s1.current, { autoAlpha: 1, y: 0 });

      t.root.position.set(LEFT, -0.15, 0);
      t.root.rotation.set(0.05, 0.35, 0);
      t.root.scale.setScalar(0.64);
      assemble();
      t.crownMat.opacity = 1;
      t.abutmentMat.opacity = 1;
      t.fixScrewMat.opacity = 1;
      t.bone.position.set(0, -5.6, 0);
      t.boneMat.opacity = 0;
      t.implant.rotation.y = 0;

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: storyRef.current,
          start: 'top top',
          end: '+=6000',
          pin: stageRef.current,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          scrub: 0.8,
          onUpdate: (self) => {
            const p = self.progress;
            setStoryProgress(Math.round(p * 100));
            if (p < 0.17) setActiveChapter('01 / OVERVIEW');
            else if (p < 0.4) setActiveChapter('02 / ANATOMY');
            else if (p < 0.58) setActiveChapter('03 / TITANIUM');
            else if (p < 0.76) setActiveChapter('04 / PLACEMENT');
            else if (p < 0.92) setActiveChapter('05 / RESTORATION');
            else setActiveChapter('06 / COMPLETE');
          },
        },
      });

      // SCENE 1 — OVERVIEW · model LEFT · text RIGHT (hold)
      tl.to({}, { duration: 1.4 });

      // 1 -> 2 : ANATOMY · model RIGHT · text LEFT (exploded)
      tl.to(s1.current, { autoAlpha: 0, y: -20, duration: 0.6 }, '>-0.2');
      tl.to(t.root.position, { x: RIGHT, duration: 1.6 }, '<');
      tl.to(t.root.rotation, { y: 1.4, x: 0.1, duration: 1.6 }, '<');
      tl.to(t.crown.position, { y: 1.95, duration: 1.6 }, '<');
      tl.to(t.abutment.position, { y: 1.02, duration: 1.6 }, '<');
      tl.to(t.screw.position, { y: 1.35, duration: 1.6 }, '<');
      tl.to(t.implant.position, { y: -0.72, duration: 1.6 }, '<');
      tl.to(s2.current, { autoAlpha: 1, y: 0, duration: 0.6 }, '>-0.3');
      tl.to({}, { duration: 1.0 });

      // 2 -> 3 : TITANIUM · model LEFT · text RIGHT (reassembled, tilted to show fixture)
      tl.to(s2.current, { autoAlpha: 0, y: -20, duration: 0.6 });
      tl.to(t.root.position, { x: LEFT, z: 0.4, duration: 1.8 }, '<');
      tl.to(t.root.rotation, { y: 2.7, x: -0.02, duration: 1.8 }, '<');
      tl.to(t.crown.position, { y: 1.15, duration: 1.8 }, '<');
      tl.to(t.abutment.position, { y: 0.46, duration: 1.8 }, '<');
      tl.to(t.screw.position, { y: 0.62, duration: 1.8 }, '<');
      tl.to(t.implant.position, { y: -0.58, duration: 1.8 }, '<');
      tl.to(s3.current, { autoAlpha: 1, y: 0, duration: 0.6 }, '>-0.3');
      tl.to({}, { duration: 1.0 });

      // 3 -> 4 : PLACEMENT · model RIGHT · text LEFT (fixture embeds into bone bed)
      tl.to(s3.current, { autoAlpha: 0, y: -20, duration: 0.6 });
      tl.to(t.root.position, { x: RIGHT, z: 0, duration: 1.8 }, '<');
      tl.to(t.root.rotation, { y: 3.9, x: 0.06, duration: 1.8 }, '<');
      tl.to(t.bone.position, { y: -2.05, duration: 1.8 }, '<'); // rises just to the fixture base
      tl.to(t.implant.rotation, { y: Math.PI * 2, duration: 1.8 }, '<'); // screwing motion
      tl.to(s4.current, { autoAlpha: 1, y: 0, duration: 0.6 }, '>-0.3');
      tl.to({}, { duration: 1.0 });

      // 4 -> 5 : RESTORATION · model LEFT · text RIGHT (bone recedes, assembled)
      tl.to(s4.current, { autoAlpha: 0, y: -20, duration: 0.6 });
      tl.to(t.root.position, { x: LEFT, duration: 1.8 }, '<');
      tl.to(t.root.rotation, { y: 5.0, x: 0.06, duration: 1.8 }, '<');
      tl.to(t.bone.position, { y: -5.6, duration: 1.8 }, '<'); // recede fully out of frame
      tl.to(s5.current, { autoAlpha: 1, y: 0, duration: 0.6 }, '>-0.3');
      tl.to({}, { duration: 1.0 });

      // 5 -> 6 : COMPLETE · model RIGHT · text LEFT (finished tooth + CTA)
      tl.to(s5.current, { autoAlpha: 0, y: -20, duration: 0.6 });
      tl.to(t.root.position, { x: RIGHT, duration: 1.8 }, '<');
      tl.to(t.root.rotation, { y: 6.28, x: 0.05, duration: 1.8 }, '<');
      tl.to(s6.current, { autoAlpha: 1, y: 0, duration: 0.6 }, '>-0.3');
      tl.to({}, { duration: 1.2 });
    });

    // ===============================================================
    // MOBILE / TABLET — model upper-centre, text always BELOW it
    // ===============================================================
    mm.add('(max-width: 1023px)', () => {
      gsap.set(scenes, { autoAlpha: 0, y: 16 });
      gsap.set(s1.current, { autoAlpha: 1, y: 0 });

      t.root.position.set(0, 1.35, 0);
      t.root.rotation.set(0.05, 0.4, 0);
      t.root.scale.setScalar(0.62);
      assemble();
      t.crownMat.opacity = 1;
      t.abutmentMat.opacity = 1;
      t.fixScrewMat.opacity = 1;
      t.bone.position.set(0, -5.6, 0);
      t.boneMat.opacity = 0;
      t.implant.rotation.y = 0;

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: storyRef.current,
          start: 'top top',
          end: '+=4600',
          pin: stageRef.current,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            setStoryProgress(Math.round(p * 100));
            if (p < 0.2) setActiveChapter('01 / OVERVIEW');
            else if (p < 0.45) setActiveChapter('02 / ANATOMY');
            else if (p < 0.68) setActiveChapter('03 / TITANIUM');
            else if (p < 0.86) setActiveChapter('04 / PLACEMENT');
            else setActiveChapter('05 / RESTORATION');
          },
        },
      });

      tl.to({}, { duration: 1.0 });

      // exploded
      tl.to(s1.current, { autoAlpha: 0, y: -14, duration: 0.5 });
      tl.to(t.root.rotation, { y: 1.3, duration: 1.4 }, '<');
      tl.to(t.crown.position, { y: 2.1, duration: 1.4 }, '<');
      tl.to(t.abutment.position, { y: 1.1, duration: 1.4 }, '<');
      tl.to(t.screw.position, { y: 1.5, duration: 1.4 }, '<');
      tl.to(t.implant.position, { y: -0.8, duration: 1.4 }, '<');
      tl.to(s2.current, { autoAlpha: 1, y: 0, duration: 0.5 }, '>-0.2');
      tl.to({}, { duration: 0.8 });

      // titanium — reassemble, tilt to show fixture
      tl.to(s2.current, { autoAlpha: 0, y: -14, duration: 0.5 });
      tl.to(t.root.rotation, { y: 2.4, duration: 1.4 }, '<');
      tl.to(t.crown.position, { y: 1.15, duration: 1.4 }, '<');
      tl.to(t.abutment.position, { y: 0.46, duration: 1.4 }, '<');
      tl.to(t.screw.position, { y: 0.62, duration: 1.4 }, '<');
      tl.to(t.implant.position, { y: -0.58, duration: 1.4 }, '<');
      tl.to(s3.current, { autoAlpha: 1, y: 0, duration: 0.5 }, '>-0.2');
      tl.to({}, { duration: 0.8 });

      // placement — bone bed rises, fixture screws in
      tl.to(s3.current, { autoAlpha: 0, y: -14, duration: 0.5 });
      tl.to(t.root.rotation, { y: 3.6, duration: 1.4 }, '<');
      tl.to(t.bone.position, { y: -2.0, duration: 1.4 }, '<');
      tl.to(t.implant.rotation, { y: Math.PI * 2, duration: 1.4 }, '<');
      tl.to(s4.current, { autoAlpha: 1, y: 0, duration: 0.5 }, '>-0.2');
      tl.to({}, { duration: 0.8 });

      // restoration — bone recedes, assembled
      tl.to(s4.current, { autoAlpha: 0, y: -14, duration: 0.5 });
      tl.to(t.root.rotation, { y: 5.2, duration: 1.4 }, '<');
      tl.to(t.bone.position, { y: -5.6, duration: 1.4 }, '<');
      tl.to(s5.current, { autoAlpha: 1, y: 0, duration: 0.5 }, '>-0.2');
      tl.to({}, { duration: 1.0 });
    });

    return () => mm.revert();
  }, []);

  const handleModelReady = useCallback(
    (targets: Story3DTargets) => {
      modelTargetsRef.current = targets;
      setupTimeline();
      requestAnimationFrame(() => ScrollTrigger.refresh());
    },
    [setupTimeline]
  );

  useLayoutEffect(() => {
    if (document.fonts) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  const label = 'text-[10.5px] font-mono tracking-[0.22em] text-[var(--c-green)] uppercase mb-3.5';
  const heading =
    'text-2xl sm:text-3xl lg:text-[2rem] font-serif font-medium text-[var(--c-ink)] leading-[1.15] tracking-[-0.02em]';
  const body = 'mt-3.5 text-sm sm:text-[15px] text-[#5F6B66] font-normal leading-relaxed';

  return (
    <section
      id="implant-story"
      ref={storyRef}
      className="relative w-full bg-[var(--c-paper-2)] text-[var(--c-ink)] select-none"
    >
      <div
        ref={stageRef}
        className="story-stage relative w-full h-[100svh] min-h-[640px] overflow-hidden"
      >
        {/* Subtle spatial grid (very faint, purely atmospheric) */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,var(--c-ink-3)05_1px,transparent_1px),linear-gradient(to_bottom,var(--c-ink-3)05_1px,transparent_1px)] bg-[size:5rem_5rem] -z-10" />

        {/* Soft studio backdrop — gentle depth so the solid model reads against the light page */}
        <div className="absolute inset-0 -z-[5] pointer-events-none bg-[radial-gradient(ellipse_78%_66%_at_50%_48%,rgba(16,27,23,0.07),rgba(16,27,23,0.02)_55%,transparent_78%)]" />

        {/* 3D CANVAS — its own dedicated visual area, no text layered inside */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <StoryImplantCanvas onReady={handleModelReady} />
        </div>

        {/* HUD — top status bar */}
        <div className="absolute top-0 inset-x-0 z-20 px-6 sm:px-8 lg:px-12 py-6 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-[var(--c-green)] animate-pulse" />
            <span className="text-[11px] font-mono tracking-widest text-[var(--c-ink-text)] uppercase">
              {activeChapter} // {storyProgress}%
            </span>
          </div>
          {onOpen3DViewer && (
            <button
              onClick={onOpen3DViewer}
              className="pointer-events-auto hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white text-xs font-mono text-[var(--c-ink)] border border-black/8 shadow-xs backdrop-blur-sm transition-all hover:scale-105 cursor-pointer"
            >
              <Sliders className="h-3 w-3 text-[var(--c-green)]" />
              <span>360° Manual Inspector</span>
            </button>
          )}
        </div>

        {/* TEXT SCENES — each in a dedicated side (desktop) / bottom (mobile) column */}
        <div className="relative z-10 w-full h-full max-w-[1500px] mx-auto">
          {/* SCENE 1 — OVERVIEW · text RIGHT */}
          <SceneText side="right" innerRef={s1}>
            <TechnicalBadge code="DIGITAL IMPLANT DENTISTRY" label="PRECISION" />
            <h2 className={`${heading} mt-5`}>
              A tooth, <br />
              rebuilt from <br />
              <span className="font-medium text-[var(--c-green-deep)]">the foundation.</span>
            </h2>
            <p className={body}>
              From planning to the final restoration, each layer is designed around
              precision, stability and a natural result.
            </p>
            <div className="mt-7">
              <Button variant="primary" size="lg" onClick={onOpenConsultation} icon={<ArrowRight className="h-4 w-4" />}>
                Book consultation
              </Button>
            </div>
          </SceneText>

          {/* SCENE 2 — ANATOMY · text LEFT */}
          <SceneText side="left" innerRef={s2}>
            <div className={label}>02 / ANATOMY</div>
            <h3 className={heading}>
              The strength sits <br />
              <span className="font-medium text-[var(--c-green-deep)]">below the surface.</span>
            </h3>
            <p className={body}>
              Three engineered components — ceramic crown, titanium abutment and root
              fixture — working as one biological structure.
            </p>
            <div className="mt-6 space-y-2.5 text-xs text-[var(--c-ink)]/80 font-medium">
              <div className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--c-green)]" />
                <span>01 · Monolithic zirconia crown</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--c-green)]" />
                <span>02 · Precision titanium abutment</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--c-green)]" />
                <span>03 · Grade 5 titanium fixture</span>
              </div>
            </div>
          </SceneText>

          {/* SCENE 3 — TITANIUM · text RIGHT */}
          <SceneText side="right" innerRef={s3}>
            <div className={label}>03 / MATERIAL</div>
            <h3 className={heading}>
              Engineered <br />
              <span className="font-medium text-[var(--c-green-deep)]">to integrate.</span>
            </h3>
            <p className={body}>
              A Grade 5 titanium fixture with a micro-textured surface — biocompatible,
              engineered to become a stable part of the jaw.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5 text-[11px] font-mono text-[var(--c-green)]">
              <span className="px-3 py-1 rounded-full bg-white border border-black/8">Ti-6Al-4V</span>
              <span className="px-3 py-1 rounded-full bg-white border border-black/8">SLA SURFACE</span>
              <span className="px-3 py-1 rounded-full bg-white border border-black/8">OSSEOINTEGRATION</span>
            </div>
          </SceneText>

          {/* SCENE 4 — PLACEMENT · text LEFT */}
          <SceneText side="left" innerRef={s4}>
            <div className={label}>04 / GUIDED PLACEMENT</div>
            <h3 className={heading}>
              Placed with <br />
              <span className="font-medium text-[var(--c-green-deep)]">precision.</span>
            </h3>
            <p className={body}>
              Angle, depth and position are digitally planned before treatment begins,
              then guided into place to the millimetre.
            </p>
          </SceneText>

          {/* SCENE 5 — RESTORATION · text RIGHT */}
          <SceneText side="right" innerRef={s5}>
            <div className={label}>05 / RESTORATION</div>
            <h3 className={heading}>
              Assembled as <br />
              <span className="font-medium text-[var(--c-green-deep)]">one unit.</span>
            </h3>
            <p className={body}>
              The abutment seats into the fixture, then the ceramic crown — a single,
              stable restoration built from the base up.
            </p>
          </SceneText>

          {/* SCENE 6 — COMPLETE · text LEFT */}
          <SceneText side="left" innerRef={s6}>
            <div className={label}>06 / THE RESULT</div>
            <h3 className={heading}>
              Designed to <br />
              <span className="font-medium text-[var(--c-green-deep)]">feel natural.</span>
            </h3>
            <p className={body}>
              Natural aesthetics, biocompatible stability and long-term functional
              restoration — indistinguishable from a real tooth.
            </p>
            <div className="mt-7">
              <Button variant="primary" size="md" onClick={onOpenConsultation} icon={<ArrowRight className="h-4 w-4" />}>
                Book consultation
              </Button>
            </div>
          </SceneText>
        </div>

        {/* Bottom scroll hint */}
        <div className="absolute bottom-0 inset-x-0 z-20 px-6 sm:px-8 lg:px-12 py-5 flex items-center gap-2 text-xs text-[var(--c-ink-text)] pointer-events-none">
          <ChevronDown className="h-4 w-4 text-[var(--c-green)] animate-bounce" />
          <span className="font-mono text-[11px] uppercase tracking-wider">Scroll to explore</span>
        </div>
      </div>
    </section>
  );
}
