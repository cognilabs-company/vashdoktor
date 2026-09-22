import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';

RectAreaLightUniformsLib.init();
import { StudioEnvironment } from './StudioEnvironment';
import { MOLAR, ARTWORK_POSE as FITTED_POSE, ARTWORK_FRAME, PROJ_CROP, type MolarParams } from './molarSdf';

/* -------------------------------------------------------------------------- */
/*  Mesh                                                                       */
/* -------------------------------------------------------------------------- */
// dev-only overrides for comparison runs: ?shape={...} / ?pose={...}
const devJson = <T,>(key: string, base: T): T => {
  if (!import.meta.env.DEV || typeof window === 'undefined') return base;
  try {
    const raw = new URLSearchParams(window.location.search).get(key);
    return raw ? { ...base, ...JSON.parse(raw) } : base;
  } catch {
    return base;
  }
};
const SHAPE: MolarParams = devJson('shape', MOLAR);
const ARTWORK_POSE = devJson('pose', FITTED_POSE);
const projDebug = import.meta.env.DEV && typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('proj') === 'debug';
const useProjection = !(import.meta.env.DEV && typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('proj') === '0');
// The shape lives in molarSdf.ts (fitted to the artwork). Here it is meshed
// once with marching cubes. The field covers a cube DOMAIN× larger than the
// shape's [-1, 1] box so no part touches the grid border (the mesher leaves
// the border open).
const DOMAIN = 1.1;

const CAMERA_Z = 5;
const DEPTH_RES = 1024; // artwork-view depth map (≈2.6 texels per artwork pixel)
const CAMERA = { fov: 30, near: 0.1, far: 50 };

/** Meshes the SDF in a worker; resolves with a plain geometry. */
function useMolarGeometry() {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  useEffect(() => {
    const worker = new Worker(new URL('./molar.worker.ts', import.meta.url), { type: 'module' });
    let geo: THREE.BufferGeometry | null = null;
    worker.onmessage = (e: MessageEvent<{ position: Float32Array; normal: Float32Array }>) => {
      geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(e.data.position, 3));
      geo.setAttribute('normal', new THREE.BufferAttribute(e.data.normal, 3));
      geo.computeBoundingSphere();
      setGeometry(geo);
      worker.terminate();
    };
    worker.postMessage({ params: SHAPE, res: 96, domain: DOMAIN });
    return () => {
      worker.terminate();
      geo?.dispose();
    };
  }, []);
  return geometry;
}

/** The artwork camera + pose as matrices, for projecting the artwork. */
function artworkMatrices() {
  const P = ARTWORK_POSE;
  const model = new THREE.Matrix4().compose(
    new THREE.Vector3(P.px, P.py, 0),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(P.rx, P.ry, P.rz, 'XYZ')),
    new THREE.Vector3().setScalar(P.s * DOMAIN)
  );
  const cam = new THREE.PerspectiveCamera(CAMERA.fov, 1, CAMERA.near, CAMERA.far);
  cam.position.set(0, 0, CAMERA_Z);
  cam.updateMatrixWorld();
  const mv = new THREE.Matrix4().multiplyMatrices(cam.matrixWorldInverse, model);
  const mvp = new THREE.Matrix4().multiplyMatrices(cam.projectionMatrix, mv);
  const nrm = new THREE.Matrix3().getNormalMatrix(mv);
  return { model, cam, mv, mvp, nrm };
}

/* -------------------------------------------------------------------------- */
/*  Look                                                                       */
/* -------------------------------------------------------------------------- */
// Material + lighting, tuned against the artwork. In dev, `?look={...json}`
// overrides any key for side-by-side comparison.
export const LOOK = {
  exposure: 0.87,
  color: '#e3eaef',
  roughness: 0.468,
  clearcoat: 1,
  clearcoatRoughness: 0.05,
  sheen: 0.9,
  sheenColor: '#cfe2ee',
  env: 'studio' as 'room' | 'plate' | 'studio',
  envIntensity: 0.49,
  hemi: 0.974, hemiSky: '#dce9f3', hemiGround: '#1f2f3c',
  key: 4.528, keyX: -5.2, keyY: 1.312, keyZ: -0.524, keyColor: '#ffffff',
  rim: 3.731, rimX: 2.7, rimY: 1.5, rimZ: -6, rimColor: '#b8d6ea',
  fill: 0.824, fillColor: '#8fb4c9',
  // tall softbox — the broad vertical highlight bands in the artwork
  area: 4.32, areaX: -3.3, areaY: 1.5, areaZ: 2.14, areaW: 1.5, areaH: 4, areaColor: '#ffffff',
  // Fresnel rim glow — the bright silhouette edge in the artwork
  glow: 0.43, glowPow: 2.15, glowColor: '#eaf4fa',
  boxes: 1.34, // softbox brightness inside the studio environment
};
type Look = typeof LOOK;

function useLook(): Look {
  return useMemo(() => {
    if (!import.meta.env.DEV) return LOOK;
    try {
      const raw = new URLSearchParams(window.location.search).get('look');
      return raw ? { ...LOOK, ...JSON.parse(raw) } : LOOK;
    } catch {
      return LOOK;
    }
  }, []);
}

/** Uses the hero plate itself as the environment, so the tooth reflects the
 * same misty sky and water it floats in. */
function PlateEnvironment({ intensity }: { intensity: number }) {
  const gl = useThree((st) => st.gl);
  const scene = useThree((st) => st.scene);
  useEffect(() => {
    let disposed = false;
    const pmrem = new THREE.PMREMGenerator(gl);
    new THREE.TextureLoader().load('/hero-empty.jpg', (tex) => {
      if (disposed) return;
      tex.mapping = THREE.EquirectangularReflectionMapping;
      tex.colorSpace = THREE.SRGBColorSpace;
      const env = pmrem.fromEquirectangular(tex).texture;
      scene.environment = env;
      (scene as THREE.Scene & { environmentIntensity?: number }).environmentIntensity = intensity;
      tex.dispose();
    });
    return () => {
      disposed = true;
      pmrem.dispose();
    };
  }, [gl, scene, intensity]);
  return null;
}

/** A soft studio light-probe in the artwork's palette: a cool gradient dome
 * (bright sky, pale horizon, blue-grey floor — no dark mountains to mirror at
 * the grazing edges) plus a few emissive softboxes for the long highlights. */
function StudioSoftEnvironment({ intensity, boxes }: { intensity: number; boxes: number }) {
  const gl = useThree((st) => st.gl);
  const scene = useThree((st) => st.scene);
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const studio = new THREE.Scene();
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(10, 48, 24),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader: `varying vec3 vP;
          void main(){
            float y = vP.y;
            vec3 sky = vec3(0.93, 0.96, 0.99), hor = vec3(0.74, 0.82, 0.88), flo = vec3(0.42, 0.51, 0.59);
            vec3 c = y > 0.0 ? mix(hor, sky, pow(y, 0.6)) : mix(hor, flo, pow(-y, 0.7));
            gl_FragColor = vec4(c, 1.0);
          }`,
      })
    );
    studio.add(dome);
    const box = (w: number, h: number, pos: [number, number, number], k: number) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(k, k, k), side: THREE.DoubleSide }));
      m.position.set(...pos);
      m.lookAt(0, 0, 0);
      studio.add(m);
    };
    // front-left tall softbox, right rim strip, overhead
    box(2.2, 7, [-4.5, 1, 5], 2.2 * boxes);
    box(1.2, 7, [6, 0.5, -2], 1.6 * boxes);
    box(5, 3, [0, 7, 1], 1.4 * boxes);
    const env = pmrem.fromScene(studio, 0.02).texture;
    scene.environment = env;
    (scene as THREE.Scene & { environmentIntensity?: number }).environmentIntensity = intensity;
    return () => {
      studio.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
        (m.material as THREE.Material | undefined)?.dispose?.();
      });
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene, intensity, boxes]);
  return null;
}

/* -------------------------------------------------------------------------- */
/*  Scene                                                                      */
/* -------------------------------------------------------------------------- */

function Molar({ onReady, still, matte, look }: { onReady?: () => void; still?: boolean; matte?: boolean; look: Look }) {
  const group = useRef<THREE.Group>(null);
  const frames = useRef(0);
  const startAt = useRef<number | null>(null);
  const material = useMemo(
    () =>
      matte
        ? new THREE.MeshBasicMaterial({ color: '#ff00ff', toneMapped: false })
        : new THREE.MeshPhysicalMaterial({
            color: look.color,
            roughness: look.roughness,
            metalness: 0,
            clearcoat: look.clearcoat,
            clearcoatRoughness: look.clearcoatRoughness,
            sheen: look.sheen,
            sheenColor: new THREE.Color(look.sheenColor),
            sheenRoughness: 0.5,
          }),
    [matte, look]
  );
  // The artwork, projected onto the surface its camera saw. Visibility is
  // tested per pixel against a depth map rendered once from the artwork's
  // camera + pose (shadow-map style), so only surface the artwork actually
  // showed takes its pixels; everything else keeps the lit material.
  const gl = useThree((st) => st.gl);
  const art = useMemo(() => artworkMatrices(), []);
  const proj = useMemo(
    () => ({
      uProjMap: { value: null as THREE.Texture | null },
      uProjMix: { value: 0 },
      uAtPose: { value: 1 },
      uArtDepth: { value: null as THREE.Texture | null },
      uArtMVP: { value: art.mvp },
      uArtMV: { value: art.mv },
      uArtNrm: { value: art.nrm },
      uFrame: { value: new THREE.Vector3(ARTWORK_FRAME.cx, ARTWORK_FRAME.cy, ARTWORK_FRAME.box / 2) },
      uCrop: { value: new THREE.Vector4(PROJ_CROP.x0, PROJ_CROP.y0, PROJ_CROP.w, PROJ_CROP.h) },
      uTexel: { value: 1 / DEPTH_RES },
    }),
    [art]
  );
  const projReady = useRef(!useProjection || matte);
  useEffect(() => {
    if (!useProjection || matte) return;
    let alive = true;
    new THREE.TextureLoader().load('/hero-tooth-proj.png', (tex) => {
      if (!alive) return tex.dispose();
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.generateMipmaps = false;
      tex.minFilter = THREE.LinearFilter;
      tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
      proj.uProjMap.value = tex;
      projReady.current = !!proj.uArtDepth.value;
    });
    return () => {
      alive = false;
      proj.uProjMap.value?.dispose();
      proj.uProjMap.value = null;
    };
  }, [proj, matte]);

  // rim glow + projected artwork on the physical material
  useMemo(() => {
    if (!(material instanceof THREE.MeshPhysicalMaterial)) return;
    material.onBeforeCompile = (shader) => {
      shader.uniforms.uGlow = { value: look.glow };
      shader.uniforms.uGlowPow = { value: look.glowPow };
      shader.uniforms.uGlowColor = { value: new THREE.Color(look.glowColor) };
      Object.assign(shader.uniforms, proj);
      if (projDebug) shader.defines = { ...shader.defines, PROJ_DEBUG: '' };
      shader.vertexShader = shader.vertexShader
        .replace(
          '#include <common>',
          '#include <common>\nuniform mat4 uArtMVP;\nuniform mat4 uArtMV;\nuniform mat3 uArtNrm;\nvarying vec4 vArtClip;\nvarying vec3 vArtV;\nvarying vec3 vArtN;'
        )
        .replace(
          '#include <begin_vertex>',
          '#include <begin_vertex>\n\tvArtClip = uArtMVP * vec4(position, 1.0);\n\tvArtV = (uArtMV * vec4(position, 1.0)).xyz;\n\tvArtN = uArtNrm * objectNormal;'
        );
      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          `#include <common>
uniform float uGlow; uniform float uGlowPow; uniform vec3 uGlowColor;
uniform sampler2D uProjMap; uniform sampler2D uArtDepth; uniform float uProjMix; uniform float uAtPose; uniform float uTexel;
uniform vec3 uFrame; uniform vec4 uCrop;
varying vec4 vArtClip; varying vec3 vArtV; varying vec3 vArtN;`
        )
        .replace(
          '#include <emissivemap_fragment>',
          '#include <emissivemap_fragment>\n\tfloat fres = pow(1.0 - saturate(dot(normal, normalize(vViewPosition))), uGlowPow);\n\ttotalEmissiveRadiance += uGlowColor * fres * uGlow;'
        )
        // after tone mapping: where the artwork's camera saw this point, show its pixel
        .replace(
          '#include <tonemapping_fragment>',
          `#include <tonemapping_fragment>
	if (uProjMix > 0.0) {
		vec3 andc = vArtClip.xyz / vArtClip.w;
		vec2 duv = andc.xy * 0.5 + 0.5;
		float fd = andc.z * 0.5 + 0.5;
		// lenient near occlusion edges: nearest of five taps
		float dz = texture2D(uArtDepth, duv).r;
		dz = max(dz, texture2D(uArtDepth, duv + vec2(uTexel, 0.0)).r);
		dz = max(dz, texture2D(uArtDepth, duv - vec2(uTexel, 0.0)).r);
		dz = max(dz, texture2D(uArtDepth, duv + vec2(0.0, uTexel)).r);
		dz = max(dz, texture2D(uArtDepth, duv - vec2(0.0, uTexel)).r);
		float vis = step(fd, dz + 0.0004);
		float facing = dot(normalize(vArtN), normalize(-vArtV));
		vec2 img = vec2(uFrame.x + andc.x * uFrame.z, uFrame.y - andc.y * uFrame.z);
		vec2 puv = vec2((img.x - uCrop.x) / uCrop.z, 1.0 - (img.y - uCrop.y) / uCrop.w);
		float inb = step(0.0, puv.x) * step(puv.x, 1.0) * step(0.0, puv.y) * step(puv.y, 1.0);
		// at the artwork's own pose every drawn fragment IS what its camera saw
		float trust = mix(vis * smoothstep(-0.08, 0.04, facing), 1.0, uAtPose);
		float pw = clamp(trust * inb * uProjMix, 0.0, 1.0);
		if (pw > 0.0) gl_FragColor.rgb = mix(gl_FragColor.rgb, texture2D(uProjMap, puv).rgb, pw);
#ifdef PROJ_DEBUG
		gl_FragColor.rgb = vec3(vis, pw, clamp(facing, 0.0, 1.0));
#endif
	}`
        );
    };
  }, [material, look, proj]);
  const geometry = useMolarGeometry();
  useEffect(() => {
    if (!geometry || !useProjection || matte) return;
    const rt = new THREE.WebGLRenderTarget(DEPTH_RES, DEPTH_RES, {
      depthTexture: new THREE.DepthTexture(DEPTH_RES, DEPTH_RES, THREE.UnsignedIntType),
    });
    rt.depthTexture!.minFilter = rt.depthTexture!.magFilter = THREE.NearestFilter;
    const depthScene = new THREE.Scene();
    const depthMat = new THREE.MeshBasicMaterial({ colorWrite: false });
    const m = new THREE.Mesh(geometry, depthMat);
    m.matrixAutoUpdate = false;
    m.matrix.copy(art.model);
    m.frustumCulled = false;
    depthScene.add(m);
    const prev = gl.getRenderTarget();
    gl.setRenderTarget(rt);
    gl.clear();
    gl.render(depthScene, art.cam);
    gl.setRenderTarget(prev);
    proj.uArtDepth.value = rt.depthTexture;
    projReady.current = !!proj.uProjMap.value;
    return () => {
      proj.uArtDepth.value = null;
      depthMat.dispose();
      rt.depthTexture?.dispose();
      rt.dispose();
    };
  }, [gl, geometry, art, proj, matte]);
  useEffect(() => () => material.dispose(), [material]);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    if (!still && startAt.current !== null) {
      // hold the artwork's pose until the cover image has faded, then ease
      // into the turn / float / sway
      const t = state.clock.elapsedTime - startAt.current;
      const k = THREE.MathUtils.smoothstep(t, 0, 2.5);
      if (k > 0) {
        g.rotation.y += dt * k * ((Math.PI * 2) / 16); // one turn every 16 s
        g.position.y = ARTWORK_POSE.py + Math.sin(t * 0.8) * 0.06 * k;
        g.rotation.z = ARTWORK_POSE.rz + Math.sin(t * 0.5) * 0.05 * k;
      }
    }
    // the artwork is exact only near its own pose: fade it out as the tooth
    // turns away (to the lit 3D material) and back in each time it comes round
    let dy = (g.rotation.y - ARTWORK_POSE.ry) % (Math.PI * 2);
    if (dy > Math.PI) dy -= Math.PI * 2;
    if (dy < -Math.PI) dy += Math.PI * 2;
    proj.uProjMix.value = 1 - THREE.MathUtils.smoothstep(Math.abs(dy), 0.1, 0.8);
    proj.uAtPose.value = 1 - THREE.MathUtils.smoothstep(Math.abs(dy) + Math.abs(g.rotation.z - ARTWORK_POSE.rz) * 4, 0, 0.12);
    // tell the page after a couple of painted frames, so the swap is invisible
    if (!geometry || !projReady.current) return;
    if (frames.current < 3 && ++frames.current === 3) {
      onReady?.();
      startAt.current = state.clock.elapsedTime + 0.9; // the cover fades over 0.7 s
    }
  });

  return (
    <group ref={group} position={[ARTWORK_POSE.px, ARTWORK_POSE.py, 0]} rotation={[ARTWORK_POSE.rx, ARTWORK_POSE.ry, ARTWORK_POSE.rz]}>
      {geometry && <mesh geometry={geometry} material={material} scale={ARTWORK_POSE.s * DOMAIN} frustumCulled={false} />}
    </group>
  );
}

interface Props {
  className?: string;
  active?: boolean; // pause rendering while the hero is off-screen
  still?: boolean; // hold the artwork pose (dev comparison)
  matte?: boolean; // flat magenta silhouette (dev comparison)
  onReady?: () => void;
}

/** The hero's floating molar — transparent canvas, turns slowly on the spot. */
export function HeroTooth({ className = '', active = true, still = false, matte = false, onReady }: Props) {
  const look = useLook();
  return (
    <div className={className}>
      <Canvas
        frameloop={active ? 'always' : 'never'}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ fov: CAMERA.fov, position: [0, 0, CAMERA_Z], near: CAMERA.near, far: CAMERA.far }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = look.exposure;
        }}
      >
        {look.env === 'plate' ? (
          <PlateEnvironment intensity={look.envIntensity} />
        ) : look.env === 'studio' ? (
          <StudioSoftEnvironment intensity={look.envIntensity} boxes={look.boxes} />
        ) : (
          <StudioEnvironment intensity={look.envIntensity} />
        )}
        <hemisphereLight args={[look.hemiSky, look.hemiGround, look.hemi]} />
        {/* key from the bright sky, upper left */}
        <directionalLight position={[look.keyX, look.keyY, look.keyZ]} intensity={look.key} color={look.keyColor} />
        {/* cool rim from behind right — separates the tooth from the mist */}
        <directionalLight position={[look.rimX, look.rimY, look.rimZ]} intensity={look.rim} color={look.rimColor} />
        {/* faint low fill so the shadow side stays blue, not black */}
        <directionalLight position={[-2, -2, 2]} intensity={look.fill} color={look.fillColor} />
        <rectAreaLight
          args={[look.areaColor, look.area, look.areaW, look.areaH]}
          position={[look.areaX, look.areaY, look.areaZ]}
          onUpdate={(l) => l.lookAt(0, 0, 0)}
        />
        <Molar onReady={onReady} still={still} matte={matte} look={look} />
      </Canvas>
    </div>
  );
}
