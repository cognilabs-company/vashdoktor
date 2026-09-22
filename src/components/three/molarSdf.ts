// Parametric signed-distance field of an upper molar, fitted to the tooth in
// the home hero artwork (the parameters were optimised so its silhouette from
// ARTWORK_POSE matches the painted tooth). Pure math, no three.js — the hero
// meshes it with marching cubes in a worker. Units: object space inside the
// [-1, 1] cube, y up, x = left/right, z = front (+) / back (−).

export interface MolarParams {
  // crown: four lobes (front pair z+, back pair z−), mirrored in x
  lobeX: number; lobeY: number; lobeZ: number;
  lobeRX: number; lobeRY: number; lobeRZ: number;
  lobeDY: number; // extra height of the right lobes
  lobeK: number;
  // crown core: an ellipsoid filling between the lobes (its top = central fossa)
  coreY: number; coreRX: number; coreRY: number; coreRZ: number;
  // root trunk: an ellipsoid column the roots split from
  trunkY: number; trunkRX: number; trunkRY: number; trunkRZ: number; trunkK: number;
  // four roots: top at (±rootX, rootTopY, ±rootZ), tip at (±tipX, tipY, ±tipZ)
  rootX: number; rootZ: number; rootTopY: number;
  frontTipX: number; frontTipY: number; frontTipZ: number;
  backTipX: number; backTipY: number; backTipZ: number;
  rootR: number; tipR: number; rootBend: number; rootK: number; rootsK: number;
  // per-root corrections (the artwork's tooth is not symmetric): tip offset
  // x/y/z and radius offset for front-left, front-right, back-left, back-right
  fLx?: number; fLy?: number; fLz?: number; fLr?: number;
  fRx?: number; fRy?: number; fRz?: number; fRr?: number;
  bLx?: number; bLy?: number; bLz?: number; bLr?: number;
  bRx?: number; bRy?: number; bRz?: number; bRr?: number;
}

// fitted to the artwork (silhouette IoU 0.968) with the sides kept looking like the
// front/back (side vs front silhouette similarity 0.98)
export const MOLAR: MolarParams = {
  lobeX: 0.3013, lobeY: 0.4675, lobeZ: 0.3013, lobeRX: 0.2646, lobeRY: 0.3543,
  lobeRZ: 0.2658, lobeDY: -0.0142, lobeK: 0.3983, coreY: 0.3192, coreRX: 0.5768,
  coreRY: 0.3272, coreRZ: 0.5541, trunkY: 0.368, trunkRX: 0.4466, trunkRY: 0.3848,
  trunkRZ: 0.4346, trunkK: 0.2273, rootX: 0.214, rootZ: 0.2369, rootTopY: -0.024,
  frontTipX: 0.2361, frontTipY: -0.8555, frontTipZ: 0.2937, backTipX: 0.3345, backTipY: -0.8693,
  backTipZ: -0.3019, rootR: 0.2761, tipR: 0.0708, rootBend: 0.0612, rootK: 0.3127,
  rootsK: 0.05, fLy: 0.0283, fLz: 0.0246, fRy: -0.056, bLx: 0.0474,
  bLy: -0.0514, bLz: -0.0513, fLr: 0.0503, fRr: 0.0078, bRr: -0.08,
  fRx: -0.0013, fRz: -0.0074, bLr: 0.0007, fLx: -0.0331, bRy: -0.0446,
  bRz: 0.069, bRx: 0.0293,
};

/** The artwork's pose: object → world = (px, py, 0) + Rx·Ry·Rz · (s · p), camera fov 30° at z = 5. */
export const ARTWORK_POSE = {
  rx: 0.051,
  ry: 0.3746,
  rz: 0.0064,
  s: 0.9755,
  px: -0.0225,
  py: -0.0128,
};

/** Where the tooth sits in /hero.jpg (1672×941): the square canvas box the 3D
 * tooth is drawn in (centre + size, image px). The hero lays this box over the
 * object-cover image, so everything below is in artwork pixels. */
export const ARTWORK_FRAME = { imgW: 1672, imgH: 941, cx: 1156, cy: 432, box: 268 * 1.45 };
/** The artwork crop baked into /hero-tooth-proj.png (tooth colours grown outward). */
export const PROJ_CROP = { x0: 1000, y0: 270, w: 312, h: 370 };

// cubic smooth-min: C2-continuous, so blends leave no shading seams
const smin = (a: number, b: number, k: number) => {
  if (k <= 0) return Math.min(a, b);
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * h * k * (1 / 6);
};

const sdEllipsoid = (x: number, y: number, z: number, rx: number, ry: number, rz: number) => {
  const ax = x / rx, ay = y / ry, az = z / rz;
  const k0 = Math.sqrt(ax * ax + ay * ay + az * az);
  const bx = ax / rx, by = ay / ry, bz = az / rz;
  const k1 = Math.sqrt(bx * bx + by * by + bz * bz);
  return k1 === 0 ? -Math.min(rx, ry, rz) : (k0 * (k0 - 1)) / k1;
};

// round cone between points a and b with radii r1 → r2 (Inigo Quilez)
const sdRoundCone = (
  px: number, py: number, pz: number,
  ax: number, ay: number, az: number,
  bx: number, by: number, bz: number,
  r1: number, r2: number
) => {
  const bax = bx - ax, bay = by - ay, baz = bz - az;
  const l2 = bax * bax + bay * bay + baz * baz;
  const rr = r1 - r2;
  const a2 = l2 - rr * rr;
  const il2 = 1 / l2;
  const pax = px - ax, pay = py - ay, paz = pz - az;
  const y = pax * bax + pay * bay + paz * baz;
  const z = y - l2;
  const cx = pax * l2 - bax * y, cy = pay * l2 - bay * y, cz = paz * l2 - baz * y;
  const x2 = cx * cx + cy * cy + cz * cz;
  const y2 = y * y * l2;
  const z2 = z * z * l2;
  const k = Math.sign(rr) * rr * rr * x2;
  if (Math.sign(z) * a2 * z2 > k) return Math.sqrt(x2 + z2) * il2 - r2;
  if (Math.sign(y) * a2 * y2 < k) return Math.sqrt(x2 + y2) * il2 - r1;
  return (Math.sqrt(x2 * a2 * il2) + y * rr) * il2 - r1;
};

/** Build the distance function for a parameter set. */
export function makeMolarSdf(p: MolarParams = MOLAR) {
  const lobes = [
    [-p.lobeX, p.lobeY, p.lobeZ],
    [p.lobeX, p.lobeY + p.lobeDY, p.lobeZ],
    [-p.lobeX, p.lobeY - 0.02, -p.lobeZ],
    [p.lobeX, p.lobeY + p.lobeDY - 0.02, -p.lobeZ],
  ];
  const o = (v?: number) => v ?? 0;
  const roots = [
    // [topX, topZ, tipX, tipY, tipZ, radius]
    [-p.rootX, p.rootZ, -p.frontTipX + o(p.fLx), p.frontTipY + o(p.fLy), p.frontTipZ + o(p.fLz), p.rootR + o(p.fLr)],
    [p.rootX, p.rootZ, p.frontTipX + o(p.fRx), p.frontTipY + 0.01 + o(p.fRy), p.frontTipZ + o(p.fRz), p.rootR + o(p.fRr)],
    [-p.rootX, -p.rootZ, -p.backTipX + o(p.bLx), p.backTipY + o(p.bLy), p.backTipZ + o(p.bLz), p.rootR + o(p.bLr)],
    [p.rootX, -p.rootZ, p.backTipX + o(p.bRx), p.backTipY + 0.01 + o(p.bRy), p.backTipZ + o(p.bRz), p.rootR + o(p.bRr)],
  ];

  return (x: number, y: number, z: number) => {
    let d = sdEllipsoid(x, y - p.coreY, z, p.coreRX, p.coreRY, p.coreRZ);
    for (let i = 0; i < 4; i++) {
      const l = lobes[i];
      d = smin(d, sdEllipsoid(x - l[0], y - l[1], z - l[2], p.lobeRX, p.lobeRY, p.lobeRZ), p.lobeK);
    }
    d = smin(d, sdEllipsoid(x, y - p.trunkY, z, p.trunkRX, p.trunkRY, p.trunkRZ), p.trunkK);
    let r = Infinity;
    for (let i = 0; i < 4; i++) {
      const [tx, tz, bx, by, bz, rr] = roots[i];
      // bow the root outward along its length; sin² starts and ends with zero
      // slope, so there is no crease where the bend begins
      const t = Math.min(1, Math.max(0, (p.rootTopY - y) / (p.rootTopY - by)));
      const sb = Math.sin(Math.PI * t);
      const bend = p.rootBend * sb * sb * Math.sign(tx);
      r = smin(r, sdRoundCone(x - bend, y, z, tx, p.rootTopY, tz, bx, by, bz, rr, p.tipR), p.rootsK);
    }
    return smin(d, r, p.rootK);
  };
}
