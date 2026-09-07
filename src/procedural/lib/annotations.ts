// Leader-line annotations. Each anchor is an offset in a PART's local space; the
// rig transforms it by that part's live world matrix every frame, so a label
// tracks its component as the implant explodes. Labels reveal progressively,
// gated by how separated their part is — never all at once.

export interface Annotation {
  id: string;
  /** part id whose live transform the anchor rides on. */
  partId: string;
  /** local-space offset from the part origin (model units). */
  anchor: [number, number, number];
  title: string;
  description: string;
  side: 'left' | 'right';
  /** part id whose explode value gates visibility (defaults to partId). */
  gateId?: string;
}

export const ANNOTATIONS: Annotation[] = [
  {
    id: 'crown',
    partId: 'crown',
    anchor: [-0.6, 0.1, 0.25],
    title: 'Crown',
    description: 'Keramik tish qismi — tabiiy shakl va estetikani tiklaydi.',
    side: 'left',
  },
  {
    id: 'abutment',
    partId: 'abutment',
    anchor: [0.42, 0.1, 0.2],
    title: 'Abutment',
    description: 'Crown va fixture’ni bog‘laydigan precision connector.',
    side: 'right',
  },
  {
    id: 'screw',
    partId: 'screw',
    anchor: [-0.28, 0.05, 0.2],
    title: 'Screw',
    description: 'Abutment’ni fixture’ga mahkamlaydigan ichki titanium vint.',
    side: 'left',
  },
  {
    id: 'implant',
    partId: 'implant',
    anchor: [0.5, 0.7, 0.2],
    title: 'Fixture',
    description: 'Jag‘ suyagiga joylashtiriladigan asosiy titanium ildiz.',
    side: 'right',
  },
  {
    id: 'threads',
    partId: 'implant',
    anchor: [-0.46, -0.7, 0.2],
    title: 'Threads',
    description: 'Suyak ichidagi boshlang‘ich mustahkamlikni ta’minlovchi spiral rezbalar.',
    side: 'left',
  },
];
