// 3D Dental Implant Cinematic Scroll Story Configuration & Coordinate System

export interface StorySceneConfig {
  id: string;
  progressStart: number;
  progressEnd: number;
  label?: string;
  heading: string;
  subtext?: string;
  badge?: string;
  modelLayout: 'left' | 'center' | 'right' | 'slight-right';
  textSide: 'left' | 'right' | 'center' | 'bottom';
  bgWord?: string;
  bgWordSub?: string;
}

// 3D Spatial Coordinates mapping for Three.js
export interface DeviceCoordinates {
  left: { x: number; y: number; z: number };
  center: { x: number; y: number; z: number };
  right: { x: number; y: number; z: number };
  slightRight: { x: number; y: number; z: number };
}

export const STORY_COORDINATES = {
  desktop: {
    left: { x: -2.3, y: 0, z: 0 },
    center: { x: 0, y: 0, z: 0 },
    right: { x: 2.2, y: 0, z: 0 },
    slightRight: { x: 1.1, y: 0, z: 0 },
  },
  tablet: {
    left: { x: -1.3, y: 0, z: -0.3 },
    center: { x: 0, y: 0, z: -0.2 },
    right: { x: 1.3, y: 0, z: -0.3 },
    slightRight: { x: 0.7, y: 0, z: -0.3 },
  },
  mobile: {
    // On mobile, model stays centered in upper viewport (y elevated), shifting subtly
    left: { x: -0.35, y: 0.55, z: -0.8 },
    center: { x: 0, y: 0.55, z: -0.7 },
    right: { x: 0.35, y: 0.55, z: -0.8 },
    slightRight: { x: 0.2, y: 0.55, z: -0.8 },
  },
};

export const STORY_SCENES: StorySceneConfig[] = [
  {
    id: 'hero',
    progressStart: 0.0,
    progressEnd: 0.09,
    label: 'ADVANCED IMPLANTOLOGY',
    heading: 'Built to become\npart of you.',
    subtext: 'Precision implant dentistry combining digital diagnostics, advanced planning and modern implant technology.',
    modelLayout: 'left',
    textSide: 'right',
  },
  {
    id: 'precision',
    progressStart: 0.09,
    progressEnd: 0.20,
    badge: 'DIGITAL PRECISION',
    heading: 'Designed digitally.\nPlaced precisely.',
    subtext: 'Sub-millimeter 3D planning ensures biological harmony with your natural jawbone anatomy.',
    modelLayout: 'center',
    textSide: 'bottom',
    bgWord: 'PRECISION',
  },
  {
    id: 'foundation',
    progressStart: 0.20,
    progressEnd: 0.32,
    label: '01 / FOUNDATION',
    heading: 'Strength begins\nbelow the surface.',
    subtext: 'A biocompatible titanium implant creates a stable, lasting foundation inside the jaw.',
    modelLayout: 'right',
    textSide: 'left',
  },
  {
    id: 'exploded',
    progressStart: 0.32,
    progressEnd: 0.46,
    label: 'ANATOMICAL ARCHITECTURE',
    heading: 'Three precision elements.\nOne biological bond.',
    subtext: 'Each component is engineered from biocompatible Grade 5 titanium and monolithic translucent zirconia.',
    modelLayout: 'right',
    textSide: 'left',
  },
  {
    id: 'transition',
    progressStart: 0.46,
    progressEnd: 0.56,
    label: 'MATERIAL SCIENCE',
    heading: 'Pure biocompatibility.',
    subtext: 'Medical-grade titanium forms a direct structural connection with living bone tissue.',
    modelLayout: 'center',
    textSide: 'center',
    bgWord: 'TITANIUM',
    bgWordSub: 'BIOCOMPATIBLE',
  },
  {
    id: 'titanium',
    progressStart: 0.56,
    progressEnd: 0.67,
    label: '02 / TITANIUM',
    heading: 'Engineered to\nintegrate.',
    subtext: 'Precision thread geometry and biocompatible titanium create a strong foundation designed for long-term stability.',
    modelLayout: 'left',
    textSide: 'right',
  },
  {
    id: 'placement',
    progressStart: 0.67,
    progressEnd: 0.77,
    label: 'SURGICAL GUIDANCE',
    heading: 'Flapless, guided\ninsertion.',
    subtext: 'Guided surgical stents place the fixture into the osteotomy bed with absolute rotational stability.',
    modelLayout: 'center',
    textSide: 'bottom',
  },
  {
    id: 'planning',
    progressStart: 0.77,
    progressEnd: 0.86,
    label: '03 / DIGITAL PLANNING',
    heading: 'Know the position\nbefore treatment begins.',
    subtext: 'Virtual CBCT simulation maps nerve channels, bone density, and emergence angles in advance.',
    modelLayout: 'slight-right',
    textSide: 'left',
  },
  {
    id: 'assembly',
    progressStart: 0.86,
    progressEnd: 0.93,
    label: 'RESTORATIVE LOCK',
    heading: 'The connection between\nstrength and aesthetics.',
    subtext: 'Conical Morse taper seal locks the custom abutment with zero bacterial micro-gap.',
    modelLayout: 'center',
    textSide: 'right',
  },
  {
    id: 'crown',
    progressStart: 0.93,
    progressEnd: 0.97,
    label: 'AESTHETIC COMPLETION',
    heading: 'Made to look like\nit was always yours.',
    subtext: 'Multi-layered ceramic crown replicates natural tooth translucency and light refraction.',
    modelLayout: 'center',
    textSide: 'left',
  },
  {
    id: 'finished',
    progressStart: 0.97,
    progressEnd: 1.0,
    label: 'LIFELONG RESTORATION',
    heading: 'Natural by design.',
    subtext: 'Complete bite restoration, preserved bone structure, and seamless aesthetic beauty.',
    modelLayout: 'center',
    textSide: 'center',
    bgWord: 'NATURAL',
    bgWordSub: 'BY DESIGN.',
  },
];
