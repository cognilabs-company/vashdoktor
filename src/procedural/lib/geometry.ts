import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/**
 * Procedural geometry toolkit for the dental-implant showcase.
 *
 * Every builder returns a plain BufferGeometry with computed vertex normals and
 * UVs — no imported model files. Parts are modelled centred on their own local
 * origin (y = 0 at the part centroid) so `parts.ts` can position and explode
 * them along the shared vertical implant axis.
 *
 * Units are "model units": the assembled implant spans roughly 5 units tall.
 */

const TAU = Math.PI * 2;

// ---------------------------------------------------------------------------
// Core parametric surface builder
// ---------------------------------------------------------------------------

export interface ParametricOpts {
  /** samples around the axis (u) */
  uSeg: number;
  /** samples along the axis (v) */
  vSeg: number;
  /** weld the u-seam so the ring is continuous (no normal seam). Default true. */
  closedU?: boolean;
  /** collapse the v=0 row to a single pole vertex (rounded bottom cap). */
  capStart?: boolean;
  /** collapse the v=1 row to a single pole vertex (rounded top cap). */
  capEnd?: boolean;
  /**
   * Flip winding if normals end up pointing toward the centroid. Correct for
   * star-shaped parts (implant/crown/abutment/gum). Disable for shells (bone).
   * Default true.
   */
  orient?: boolean;
}

/**
 * Build an indexed surface from a sampling function `fn(u, v) -> position`,
 * u and v in [0,1]. Normals are computed after the fact (smooth), UVs = (u, v).
 *
 * closedU welds the wrap seam so there is no visible normal discontinuity — the
 * shader is texture-free, so wrapping UVs at the seam is harmless.
 */
export function parametricGeometry(
  fn: (u: number, v: number, target: THREE.Vector3) => void,
  { uSeg, vSeg, closedU = true, capStart = false, capEnd = false, orient = true }: ParametricOpts
): THREE.BufferGeometry {
  const uCount = closedU ? uSeg : uSeg + 1; // welded: uSeg unique columns
  const rows = vSeg + 1;

  const positions: number[] = [];
  const uvs: number[] = [];
  const tmp = new THREE.Vector3();

  // grid vertex index helper (accounts for pole collapse)
  const rowStart: number[] = [];
  let vertCursor = 0;
  for (let j = 0; j < rows; j++) {
    rowStart[j] = vertCursor;
    const v = j / vSeg;
    const collapsed = (capStart && j === 0) || (capEnd && j === vSeg);
    if (collapsed) {
      // single pole vertex — average the ring so it sits on the axis
      let px = 0;
      let py = 0;
      let pz = 0;
      for (let i = 0; i < uCount; i++) {
        const u = i / uSeg;
        fn(u, v, tmp);
        px += tmp.x;
        py += tmp.y;
        pz += tmp.z;
      }
      const inv = 1 / uCount;
      positions.push(px * inv, py * inv, pz * inv);
      uvs.push(0.5, v);
      vertCursor += 1;
    } else {
      for (let i = 0; i < uCount; i++) {
        const u = i / uSeg;
        fn(u, v, tmp);
        positions.push(tmp.x, tmp.y, tmp.z);
        uvs.push(u, v);
      }
      vertCursor += uCount;
    }
  }

  const indices: number[] = [];
  const colAt = (j: number) => {
    const collapsed = (capStart && j === 0) || (capEnd && j === vSeg);
    return collapsed ? 1 : uCount;
  };

  for (let j = 0; j < vSeg; j++) {
    const c0 = colAt(j);
    const c1 = colAt(j + 1);
    const base0 = rowStart[j];
    const base1 = rowStart[j + 1];
    const iMax = closedU ? uSeg : uSeg;

    for (let i = 0; i < iMax; i++) {
      const iNext = (i + 1) % (closedU ? uSeg : uSeg + 1);
      const a = base0 + (c0 === 1 ? 0 : i % c0);
      const b = base0 + (c0 === 1 ? 0 : iNext % c0);
      const cc = base1 + (c1 === 1 ? 0 : i % c1);
      const d = base1 + (c1 === 1 ? 0 : iNext % c1);
      // two triangles per quad (skip degenerate ones at poles)
      if (c0 !== 1 && c1 !== 1) {
        indices.push(a, cc, d);
        indices.push(a, d, b);
      } else if (c0 === 1) {
        // fan from bottom pole
        indices.push(a, cc, d);
      } else {
        // fan to top pole
        indices.push(a, cc, b);
      }
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setIndex(indices);
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.computeVertexNormals();

  if (orient) {
    // If normals point inward (toward centroid), reverse winding. Valid for
    // star-shaped parts where "outward" == "away from centroid".
    const pos = geo.getAttribute('position');
    const nrm = geo.getAttribute('normal');
    let cx = 0;
    let cy = 0;
    let cz = 0;
    for (let i = 0; i < pos.count; i++) {
      cx += pos.getX(i);
      cy += pos.getY(i);
      cz += pos.getZ(i);
    }
    cx /= pos.count;
    cy /= pos.count;
    cz /= pos.count;
    let dot = 0;
    const step = Math.max(1, Math.floor(pos.count / 400));
    for (let i = 0; i < pos.count; i += step) {
      dot +=
        nrm.getX(i) * (pos.getX(i) - cx) +
        nrm.getY(i) * (pos.getY(i) - cy) +
        nrm.getZ(i) * (pos.getZ(i) - cz);
    }
    if (dot < 0) {
      const idx = geo.getIndex()!;
      for (let i = 0; i < idx.count; i += 3) {
        const a = idx.getX(i + 1);
        const b = idx.getX(i + 2);
        idx.setX(i + 1, b);
        idx.setX(i + 2, a);
      }
      idx.needsUpdate = true;
      geo.computeVertexNormals();
    }
  }

  return geo;
}

// ---------------------------------------------------------------------------
// Lathe helper — rotationally symmetric parts from a 2D profile
// ---------------------------------------------------------------------------

/**
 * Revolve a profile of [radius, y] points around the Y axis.
 * Returns a LatheGeometry (normals + UVs already computed by three).
 */
export function latheProfile(
  profile: Array<[number, number]>,
  segments = 96
): THREE.BufferGeometry {
  const points = profile.map(([r, y]) => new THREE.Vector2(Math.max(1e-4, r), y));
  const geo = new THREE.LatheGeometry(points, segments);
  geo.computeVertexNormals();
  return geo;
}

// ---------------------------------------------------------------------------
// Ring / washer — connection interface
// ---------------------------------------------------------------------------

export function ringGeometry(
  innerR: number,
  outerR: number,
  height: number,
  segments = 96
): THREE.BufferGeometry {
  const h = height / 2;
  const c = Math.min(height * 0.28, (outerR - innerR) * 0.4);
  // rounded top/bottom edges for a machined look
  return latheProfile(
    [
      [innerR, -h],
      [innerR, h - c],
      [innerR + c, h],
      [outerR - c, h],
      [outerR, h - c],
      [outerR, -h + c],
      [outerR - c, -h],
      [innerR + c, -h],
      [innerR, -h],
    ],
    segments
  );
}

// ---------------------------------------------------------------------------
// Thin disc / collar
// ---------------------------------------------------------------------------

export function discGeometry(
  radius: number,
  height: number,
  segments = 96
): THREE.BufferGeometry {
  const h = height / 2;
  const c = height * 0.4;
  return latheProfile(
    [
      [0, -h],
      [radius - c, -h],
      [radius, -h + c],
      [radius, h - c],
      [radius - c, h],
      [0, h],
    ],
    segments
  );
}

// ---------------------------------------------------------------------------
// Threaded tapered implant body — the titanium fixture
// ---------------------------------------------------------------------------

export interface ImplantOpts {
  length: number;
  topRadius: number;
  apexRadius: number;
  turns: number;
  threadDepth: number;
  /** add a wider flat seating platform/collar at the top (the fixture head). */
  platform?: boolean;
  radialSeg?: number;
  heightSeg?: number;
}

/**
 * A self-tapping dental implant: tapered core with a fine helical thread, a
 * smooth machined collar at the top (the implant platform) and a rounded apex.
 * Centred on the origin; +Y is the platform, -Y is the apex.
 */
export function threadedImplant({
  length,
  topRadius,
  apexRadius,
  turns,
  threadDepth,
  platform = false,
  radialSeg = 108,
  heightSeg = 210,
}: ImplantOpts): THREE.BufferGeometry {
  const half = length / 2;

  // triangle wave 0..1 with a rounded crest → realistic thread flank
  const threadWave = (phase: number) => {
    const p = phase - Math.floor(phase);
    const tri = 1 - Math.abs(2 * p - 1); // 0..1
    return Math.pow(tri, 0.62);
  };

  const fn = (u: number, v: number, target: THREE.Vector3) => {
    const theta = u * TAU;
    const y = half - v * length; // v=0 top, v=1 apex

    // core taper: nearly straight, tapering toward the apex
    const t = v;
    let core = THREE.MathUtils.lerp(topRadius, apexRadius, Math.pow(t, 1.15));

    // rounded apex tip (last 8%)
    const tipStart = 0.9;
    if (t > tipStart) {
      const k = (t - tipStart) / (1 - tipStart);
      core *= Math.sqrt(Math.max(0, 1 - k * k));
    }

    // wider flat seating platform/collar at the very top (the fixture head)
    if (platform) {
      const lip = topRadius * 1.16;
      const pw = 1 - THREE.MathUtils.smoothstep(t, 0.015, 0.075);
      core = THREE.MathUtils.lerp(core, lip, pw);
    }

    // smooth machined collar at the very top (no threads on the platform neck)
    const collar = THREE.MathUtils.smoothstep(t, platform ? 0.08 : 0.0, platform ? 0.17 : 0.11);
    const apexFade = 1 - THREE.MathUtils.smoothstep(t, 0.84, 0.94);
    const threadMask = collar * apexFade;

    // helix: one thread that advances `turns` times over the length
    const phase = t * turns - u; // subtract u so the ridge spirals
    const ridge = threadWave(phase) * threadDepth * threadMask;

    const r = core + ridge;
    target.set(Math.cos(theta) * r, y, Math.sin(theta) * r);
  };

  return parametricGeometry(fn, {
    uSeg: radialSeg,
    vSeg: heightSeg,
    closedU: true,
    capEnd: true, // collapse apex to a point
  });
}

// ---------------------------------------------------------------------------
// Abutment screw — small head + threaded shaft
// ---------------------------------------------------------------------------

export interface ScrewOpts {
  length: number;
  shaftRadius: number;
  headRadius: number;
}

/** A small fixation screw: a rounded head over a fine threaded shaft. Centred. */
export function screwGeometry({ length, shaftRadius, headRadius }: ScrewOpts): THREE.BufferGeometry {
  const headH = length * 0.26;
  const shaftLen = length - headH;

  const shaft = threadedImplant({
    length: shaftLen,
    topRadius: shaftRadius,
    apexRadius: shaftRadius * 0.6,
    turns: Math.max(5, Math.round(shaftLen / (shaftRadius * 1.7))),
    threadDepth: shaftRadius * 0.34,
    radialSeg: 72,
    heightSeg: 150,
  });

  const hc = headH * 0.3;
  const head = latheProfile(
    [
      [0, -headH / 2],
      [headRadius, -headH / 2 + hc * 0.4],
      [headRadius, headH / 2 - hc],
      [headRadius - hc, headH / 2],
      [0, headH / 2],
    ],
    72
  );
  head.translate(0, shaftLen / 2 + headH / 2, 0);

  const geo = mergeAll([head, shaft]);
  geo.computeBoundingBox();
  const centre = new THREE.Vector3();
  geo.boundingBox!.getCenter(centre);
  geo.translate(-centre.x, -centre.y, -centre.z);
  return geo;
}

// ---------------------------------------------------------------------------
// Tapered connector — the abutment
// ---------------------------------------------------------------------------

export interface AbutmentOpts {
  height: number;
  baseRadius: number;
  topRadius: number;
  segments?: number;
}

/**
 * A precision abutment: a wide emergence collar at the base flowing into a
 * gently tapered anatomic post, with a small chamfer at the top where the crown
 * seats. Centred on the origin.
 */
export function abutmentGeometry({
  height,
  baseRadius,
  topRadius,
  segments = 120,
}: AbutmentOpts): THREE.BufferGeometry {
  const h = height / 2;
  const collarH = height * 0.3; // seating collar at the base
  const postBottom = baseRadius * 0.74;

  // curved tapered post from the shoulder up to the crown seat
  const post: Array<[number, number]> = [];
  const steps = 18;
  const postBase = -h + collarH + 0.05;
  for (let i = 0; i <= steps; i++) {
    const tt = i / steps;
    const y = postBase + tt * (h - 0.06 - postBase);
    // concave emergence: narrows quickly then eases toward the top
    const r = THREE.MathUtils.lerp(postBottom, topRadius, Math.pow(tt, 0.78));
    post.push([r, y]);
  }

  // base seating collar → shoulder ledge → tapered post → chamfered top
  const profile: Array<[number, number]> = [
    [0, -h],
    [baseRadius * 0.82, -h],
    [baseRadius, -h + collarH * 0.28], // flare up to the collar
    [baseRadius, -h + collarH], // collar top
    [postBottom, -h + collarH + 0.03], // shoulder step in
    ...post,
    [topRadius * 0.66, h], // top chamfer
    [0, h],
  ];
  return latheProfile(profile, segments);
}

// ---------------------------------------------------------------------------
// Ceramic crown — anatomical premolar/molar
// ---------------------------------------------------------------------------

export interface CrownOpts {
  height: number;
  bellyRadius: number;
  cervicalRadius: number;
  /** buccal-lingual squash (z scale) so the crown is oval, not round. */
  ovality?: number;
  cuspHeight?: number;
  radialSeg?: number;
  heightSeg?: number;
}

/**
 * A ceramic crown shaped like a natural posterior tooth: narrow cervical neck,
 * a rounded belly, a flattened occlusal table carrying four rounded cusps split
 * by a cross-shaped fissure. Oval cross-section (mesiodistal wider than
 * buccolingual). Centred on the origin; +Y is the occlusal (biting) surface.
 */
export function crownGeometry({
  height,
  bellyRadius,
  cervicalRadius,
  ovality = 0.82,
  cuspHeight = 0.16,
  radialSeg = 104,
  heightSeg = 104,
}: CrownOpts): THREE.BufferGeometry {
  const half = height / 2;

  // radius profile up the tooth: cervical (t=0) → belly (t~0.5) → rounded
  // occlusal dome that converges toward a small biting table at the top.
  const radiusProfile = (t: number) => {
    const belly = Math.sin(Math.min(1, t * 1.05) * Math.PI * 0.6);
    let base = THREE.MathUtils.lerp(cervicalRadius, bellyRadius, belly);
    // round the crown over into a BROAD occlusal table (not a point) — a real
    // molar keeps a wide biting surface up top.
    if (t > 0.52) {
      const k = (t - 0.52) / 0.48; // 0..1
      base *= Math.sqrt(Math.max(0, 1 - k * k * 0.42)); // → ~0.76 of belly = broad table
    }
    return base;
  };

  // 4 rounded cusps with a cross-shaped fissure between them (classic molar)
  const cuspField = (theta: number) => {
    const c = Math.abs(Math.cos(2 * theta)); // 4 lobes, minima = fissures
    return Math.pow(c, 0.75);
  };

  const fn = (u: number, v: number, target: THREE.Vector3) => {
    const theta = u * TAU;
    const t = v; // 0 cervical → 1 occlusal
    const r = radiusProfile(t);
    const cusp = cuspField(theta);

    // gentle overall dome + cusp bumps across the occlusal table; a shallow
    // central fossa sits between the four cusps.
    const dome = THREE.MathUtils.smoothstep(t, 0.5, 1.0) * 0.12;
    const cuspBand = THREE.MathUtils.smoothstep(t, 0.55, 0.85);
    const cuspRise = cuspBand * cuspHeight * (cusp - 0.35);

    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r * ovality;
    let y = -half + t * height + dome + cuspRise;

    // round the cervical base inward a touch so it meets the abutment cleanly
    const baseTuck = 1 - THREE.MathUtils.smoothstep(t, 0.0, 0.12);
    y -= baseTuck * 0.04;

    target.set(x, y, z);
  };

  return parametricGeometry(fn, {
    uSeg: radialSeg,
    vSeg: heightSeg,
    closedU: true,
    capStart: true, // close the cervical opening
    capEnd: true, // close the broad occlusal table into a rounded dome
  });
}

// ---------------------------------------------------------------------------
// Gingiva — organic soft-tissue collar
// ---------------------------------------------------------------------------

export interface GumOpts {
  innerR: number;
  outerR: number;
  height: number;
  /** scalloped papilla amplitude on the top edge. */
  scallop?: number;
  radialSeg?: number;
}

/**
 * An organic gingival collar: a domed annulus around the implant neck with a
 * softly scalloped emergence edge (interdental papillae) rather than a flat
 * washer. Centred on the origin.
 */
export function gumGeometry({
  innerR,
  outerR,
  height,
  scallop = 0.12,
  radialSeg = 130,
}: GumOpts): THREE.BufferGeometry {
  const vSeg = 40;

  const fn = (u: number, v: number, target: THREE.Vector3) => {
    const theta = u * TAU;
    // v goes: 0 inner-top lip → 0.5 outer → 1 inner-bottom (a closed tube-ish
    // cross-section around the ring so the collar has volume).
    // Build cross-section as an arc from inner top, over the dome, to outer base.
    const cs = v; // 0..1 across the cross-section
    // radius from inner to outer and back is overkill; instead make a domed ring:
    const radial = THREE.MathUtils.lerp(innerR, outerR, cs);
    // dome height: highest near the inner lip, sloping down to the outer edge
    const dome = Math.sin((1 - cs) * Math.PI * 0.5) * height;
    // scalloped emergence around the inner lip (papillae)
    const scal = Math.cos(theta * 3) * scallop * (1 - cs);
    const y = dome * 0.5 - height * 0.15 + scal;

    target.set(Math.cos(theta) * radial, y, Math.sin(theta) * radial);
  };

  return parametricGeometry(fn, {
    uSeg: radialSeg,
    vSeg,
    closedU: true,
  });
}

// ---------------------------------------------------------------------------
// Alveolar jaw bone — organic socket cutaway
// ---------------------------------------------------------------------------

export interface BoneOpts {
  height: number;
  innerR: number;
  outerR: number;
  /** angular opening of the cutaway front, in radians (gap that reveals threads). */
  openAngle?: number;
  radialSeg?: number;
  heightSeg?: number;
  /** organic surface wobble amplitude. */
  wobble?: number;
}

/**
 * A curved alveolar bone socket with a front cutaway: a partial cylindrical wall
 * (not a rectangular block) whose inner bore hugs the implant and whose front is
 * open so the threaded body is visible. The top forms an irregular alveolar
 * crest and the outer wall carries subtle organic variation. Centred on origin.
 */
export function jawBoneGeometry({
  height,
  innerR,
  outerR,
  openAngle = Math.PI * 0.82,
  radialSeg = 150,
  heightSeg = 90,
  wobble = 0.06,
}: BoneOpts): THREE.BufferGeometry {
  const half = height / 2;
  const start = openAngle / 2;
  const sweep = TAU - openAngle;

  // pseudo-random but deterministic bumps for the crest / outer wall
  const noise = (a: number, b: number) =>
    Math.sin(a * 3.1 + b * 2.3) * 0.5 + Math.sin(a * 7.7 - b * 1.9) * 0.3 + Math.sin(a * 1.3 + b * 5.1) * 0.2;

  // The wall cross-section: inner bore → top crest → outer wall → bottom.
  // We sweep theta across the C and, for each theta, run v around a closed
  // rectangular-ish loop (inner, top, outer, bottom) to give the wall thickness.
  const fn = (u: number, v: number, target: THREE.Vector3) => {
    const theta = start + u * sweep;
    const loop = v; // 0..1 around the wall cross-section (closed)

    // crest height varies organically around the arc
    const crest = half - 0.08 - Math.abs(noise(theta, 0.5)) * 0.14;
    const bottom = -half;

    let radial: number;
    let y: number;

    if (loop < 0.25) {
      // inner bore wall: bottom → crest
      const k = loop / 0.25;
      radial = innerR + noise(theta, k) * wobble * 0.4;
      y = THREE.MathUtils.lerp(bottom, crest, k);
    } else if (loop < 0.5) {
      // top crest: inner → outer
      const k = (loop - 0.25) / 0.25;
      radial = THREE.MathUtils.lerp(innerR, outerR, k) + noise(theta, k) * wobble;
      y = crest + noise(theta * 1.7, k) * 0.05;
    } else if (loop < 0.75) {
      // outer wall: crest → bottom
      const k = (loop - 0.5) / 0.25;
      radial = outerR + noise(theta, k + 2) * wobble;
      y = THREE.MathUtils.lerp(crest, bottom, k);
    } else {
      // bottom face: outer → inner
      const k = (loop - 0.75) / 0.25;
      radial = THREE.MathUtils.lerp(outerR, innerR, k);
      y = bottom;
    }

    target.set(Math.cos(theta) * radial, y, Math.sin(theta) * radial);
  };

  // NOT closed in u (the C-shape has an opening); closed in v (cross-section loop).
  // A shell has inner + outer walls, so centroid-orient is invalid → render
  // double-sided in the material instead.
  const geo = parametricGeometry(
    (u, v, t) => fn(v, u, t), // swap so closedU applies to the cross-section loop
    { uSeg: heightSeg, vSeg: radialSeg, closedU: true, orient: false }
  );
  return geo;
}

// ---------------------------------------------------------------------------
// Merge helper
// ---------------------------------------------------------------------------

/** Combine several geometries into one BufferGeometry (positions/normals/uv). */
export function mergeAll(geometries: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const cleaned = geometries.map((g) => {
    const c = g.index ? g.toNonIndexed() : g;
    // keep only the shared attributes so the merge never throws on mismatch
    const out = new THREE.BufferGeometry();
    out.setAttribute('position', c.getAttribute('position'));
    if (c.getAttribute('normal')) out.setAttribute('normal', c.getAttribute('normal'));
    if (c.getAttribute('uv')) out.setAttribute('uv', c.getAttribute('uv'));
    return out;
  });
  const merged = mergeGeometries(cleaned, false);
  merged.computeVertexNormals();
  return merged;
}
