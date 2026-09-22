// Meshes the molar SDF off the main thread: field evaluation + marching cubes
// (~0.5 s of work) would otherwise block the page while it loads.
import * as THREE from 'three';
import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes.js';
import { makeMolarSdf, type MolarParams } from './molarSdf';

export interface MolarJob {
  params: MolarParams;
  res: number;
  domain: number;
}

self.onmessage = (e: MessageEvent<MolarJob>) => {
  const { params, res, domain } = e.data;
  const sdf = makeMolarSdf(params);
  const mc = new MarchingCubes(res, new THREE.MeshBasicMaterial(), false, false, 160000);
  const half = res / 2;
  const field = mc.field as Float32Array;
  for (let k = 0; k < res; k++) {
    const z = ((k - half) / half) * domain;
    for (let j = 0; j < res; j++) {
      const y = ((j - half) / half) * domain;
      for (let i = 0; i < res; i++) {
        const x = ((i - half) / half) * domain;
        field[i + j * res + k * res * res] = mc.isolation - (sdf(x, y, z) / domain) * 420;
      }
    }
  }
  mc.update();
  const n = mc.count;
  const position = (mc.positionArray as Float32Array).slice(0, n * 3);
  const normal = (mc.normalArray as Float32Array).slice(0, n * 3);
  (self as unknown as Worker).postMessage({ position, normal }, [position.buffer, normal.buffer]);
};
