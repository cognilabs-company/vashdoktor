import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { view } from '../lib/state';

/**
 * Full-screen atmosphere quad drawn behind everything (depth off, far plane).
 * Dark cinematic cold-blue / teal: a deep vertical gradient with drifting
 * domain-warped fog, a misty horizon band, a strong soft glow pool that tracks
 * the subject, and a gentle vignette. Premium, moody — matches the reference.
 */

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position.xy, 0.9999, 1.0); // fullscreen triangle, far depth
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uLightX;
  uniform float uAspect;
  uniform vec3 uBase;
  uniform vec3 uTeal;
  uniform vec3 uMineral;
  uniform vec3 uWarm;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
  float noise(vec2 p){
    vec2 i=floor(p), f=fract(p);
    f=f*f*(3.0-2.0*f);
    float a=hash(i), b=hash(i+vec2(1,0)), c=hash(i+vec2(0,1)), d=hash(i+vec2(1,1));
    return mix(mix(a,b,f.x), mix(c,d,f.x), f.y);
  }
  float fbm(vec2 p){
    float v=0.0, a=0.5;
    for(int i=0;i<3;i++){ v+=a*noise(p); p*=2.02; a*=0.5; }
    return v;
  }

  void main(){
    vec2 uv = vUv;
    vec2 p = vec2(uv.x*uAspect, uv.y);

    // deep vertical gradient: darkest at the top, a touch lighter (misty water)
    // toward the bottom.
    vec3 col = mix(uBase, uMineral, smoothstep(-0.1, 1.1, uv.y));

    // drifting domain-warped fog in teal
    float t = uTime*0.015;
    vec2 q = vec2(fbm(p*1.2 + t), fbm(p*1.2 + vec2(3.1,1.7) - t));
    float f = fbm(p*1.5 + q*1.4);
    col = mix(col, uTeal, smoothstep(0.4, 0.98, f)*0.45);

    // faint misty band around the subject's height
    float band = exp(-pow((uv.y-0.5)*3.0, 2.0));
    col = mix(col, uWarm*0.5, band * 0.10 * smoothstep(0.3,0.75,fbm(p*2.0+q)));

    // strong soft glow pool behind the subject (broad halo + brighter core)
    vec2 lp = vec2(uLightX*uAspect, 0.5);
    float d = distance(vec2(uv.x*uAspect, uv.y), lp);
    col += uWarm * smoothstep(1.0, 0.0, d) * 0.33;
    col += uWarm * smoothstep(0.42, 0.0, d) * 0.22;

    // cinematic vignette
    float vig = smoothstep(1.15, 0.35, length((uv-0.5)*vec2(uAspect,1.0)));
    col *= mix(0.72, 1.0, vig);

    gl_FragColor = vec4(col, 1.0);
  }
`;

const lin = (hex: string) => new THREE.Color(hex).convertSRGBToLinear();
/** the palette's value for a token, falling back to the colour we shipped with */
const tok = (name: string, fallback: string) => {
  if (typeof window === 'undefined') return lin(fallback);
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return lin(v || fallback);
};

interface Props {
  reduced: boolean;
}

export function Backdrop({ reduced }: Props) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    // single oversized triangle covering clip space
    g.setAttribute('position', new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
    return g;
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uLightX: { value: 0.4 },
      uAspect: { value: 1 },
      uBase: { value: tok('--c3d-base', '#0a141d') }, // deep tone (top)
      uMineral: { value: tok('--c3d-mineral', '#102b36') }, // bottom / water
      uTeal: { value: tok('--c3d-teal', '#1d4453') }, // fog highlight
      uWarm: { value: tok('--c3d-warm', '#aed2db') }, // misty glow
    }),
    []
  );

  // the picker can change the palette while the scene is up
  useEffect(() => {
    const onChange = () => {
      uniforms.uBase.value.copy(tok('--c3d-base', '#0a141d'));
      uniforms.uMineral.value.copy(tok('--c3d-mineral', '#102b36'));
      uniforms.uTeal.value.copy(tok('--c3d-teal', '#1d4453'));
      uniforms.uWarm.value.copy(tok('--c3d-warm', '#aed2db'));
    };
    window.addEventListener('palettechange', onChange);
    return () => window.removeEventListener('palettechange', onChange);
  }, [uniforms]);

  useFrame((state, delta) => {
    const u = uniforms;
    if (!reduced) u.uTime.value += Math.min(delta, 0.05);
    u.uAspect.value = state.size.width / Math.max(1, state.size.height);
    // object x (-1.75..1.75) → screen x (0.28..0.72)
    const sx = THREE.MathUtils.clamp(0.5 + view.model.objectX * 0.13, 0.24, 0.76);
    u.uLightX.value += (sx - u.uLightX.value) * Math.min(1, delta * 3);
  });

  return (
    <mesh geometry={geo} frustumCulled={false} renderOrder={-1}>
      <shaderMaterial
        ref={matRef}
        args={[
          {
            vertexShader: VERT,
            fragmentShader: FRAG,
            uniforms,
            depthTest: false,
            depthWrite: false,
            toneMapped: false,
          },
        ]}
      />
    </mesh>
  );
}
