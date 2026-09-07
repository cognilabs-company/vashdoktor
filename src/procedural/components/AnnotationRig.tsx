import { useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ANNOTATIONS } from '../lib/annotations';
import { view, clamp, smoothstep } from '../lib/state';

interface Props {
  groupRef: React.MutableRefObject<THREE.Group | null>;
  annotationRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  /** hide leader-line annotations below this width (mobile uses a DOM panel). */
  minWidth?: number;
}

/**
 * Every frame: transform each annotation's local anchor by its part's live world
 * matrix, project through the camera, and write the pixel position straight to
 * the matching DOM node. Labels reveal progressively — gated by how separated
 * their part is — and hide when behind the camera or below the min width.
 */
export function AnnotationRig({ groupRef, annotationRefs, minWidth = 1000 }: Props) {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const g = groupRef.current;
    if (!g) return;
    // Sync world matrices to THIS frame's transforms. useFrame runs before the
    // renderer refreshes them, so without this the labels project from last
    // frame's model/camera and lag the render → visible shiver while scrolling.
    g.updateWorldMatrix(true, true);
    camera.updateMatrixWorld();
    camera.matrixWorldInverse.copy(camera.matrixWorld).invert();

    const globalOp = view.annotations.opacity;
    const enabled = size.width >= minWidth;

    for (const a of ANNOTATIONS) {
      const el = annotationRefs.current[a.id];
      if (!el) continue;

      if (!enabled || globalOp < 0.01) {
        if (el.style.visibility !== 'hidden') el.style.visibility = 'hidden';
        continue;
      }

      const part = g.getObjectByName(a.partId);
      if (!part) continue;

      tmp.set(a.anchor[0], a.anchor[1], a.anchor[2]);
      part.localToWorld(tmp);
      tmp.project(camera);

      const gateVal = view.explodeById[a.gateId ?? a.partId] ?? 0;
      const gate = smoothstep(0.05, 0.5, gateVal);

      // HIDE the label whenever its part is actually off-screen (behind the
      // camera, or its anchor projects outside the viewport in NDC) — no label
      // for a piece you can't see. A small margin so an edge-peeking part still
      // shows its label.
      const onScreen =
        tmp.z < 1 && tmp.x > -1.02 && tmp.x < 1.02 && tmp.y > -1.04 && tmp.y < 1.04;

      const sx = (tmp.x * 0.5 + 0.5) * size.width;
      const sy = (-tmp.y * 0.5 + 0.5) * size.height;

      // when it IS on screen, clamp only the display position so the label box
      // (leader line ~260px toward its side) stays legible near an edge.
      const W = 260;
      const V = 70;
      const minX = a.side === 'left' ? W : 24;
      const maxX = a.side === 'left' ? size.width - 24 : size.width - W;
      const csx = Math.min(maxX, Math.max(minX, sx));
      const csy = Math.min(size.height - V, Math.max(V, sy));

      const vis = clamp(globalOp * gate) * (onScreen ? 1 : 0);

      el.style.transform = `translate3d(${csx.toFixed(2)}px, ${csy.toFixed(2)}px, 0)`;
      el.style.opacity = vis.toFixed(3);
      el.style.visibility = vis < 0.01 ? 'hidden' : 'visible';
    }
  });

  return null;
}
