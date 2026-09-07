import * as THREE from 'three';

/**
 * A single custom GLSL ShaderMaterial system for the whole implant.
 *
 * No HDRI, no texture maps. Lighting is a handful of NAMED analytic lights
 * evaluated in the fragment shader:
 *   - one broad soft KEY light,
 *   - two hard narrow STREAK lights (the thin specular line-highlights that run
 *     along titanium edges and ceramic curves),
 *   - a sky/ground/horizon AMBIENT gradient so undersides never go pure black.
 *
 * Every material shares this one implementation; the different dental finishes
 * are just named parameter PRESETS. Output is linear HDR so the hottest
 * specular streaks (values > 1) drive Bloom, while broad surfaces stay under
 * the bloom threshold.
 */

// ---------------------------------------------------------------------------
// Shared analytic light rig (world space). Colors are sRGB; converted to linear
// in the factory. Directions point FROM the surface TOWARD the light.
// ---------------------------------------------------------------------------

export const LIGHT_RIG = {
  key: { dir: new THREE.Vector3(-0.45, 0.82, 0.55), color: '#fffdf9', intensity: 1.12 },
  streak1: { dir: new THREE.Vector3(-0.8, 0.35, 0.42), color: '#ffffff', tightness: 380 },
  streak2: { dir: new THREE.Vector3(0.72, 0.52, -0.18), color: '#ffffff', tightness: 820 },
  // bright studio: near-white sky over a mid-grey floor. The sky↔floor spread
  // in the reflection is what gives polished metal its bright-top / dark-bottom
  // chrome contrast; a hot horizon band draws the crisp edge streak.
  sky: '#f7f7f4',
  ground: '#6f6f6c',
  horizon: '#ffffff',
};

// ---------------------------------------------------------------------------
// Material parameters + named presets
// ---------------------------------------------------------------------------

export interface MaterialParams {
  baseColor: string;
  metalness: number;
  roughness: number;
  specColor: string;
  fresnel: number;
  fresnelColor: string;
  translucency: number;
  transColor: string;
  exposure: number;
  micro: number;
  opacity?: number;
  doubleSide?: boolean;
}

export type PresetName =
  | 'CERAMIC'
  | 'TITANIUM'
  | 'GUM'
  | 'CORTICAL_BONE'
  | 'CANCELLOUS_BONE';

export const PRESETS: Record<PresetName, MaterialParams> = {
  // warm natural tooth-white, low metallic, soft glossy highlights, subtle
  // Fresnel + very slight translucency — glossy ceramic, never glass.
  CERAMIC: {
    baseColor: '#f1efe9',
    metalness: 0.0,
    roughness: 0.24,
    specColor: '#ffffff',
    fresnel: 0.2,
    fresnelColor: '#ffffff',
    translucency: 0.4,
    transColor: '#f0e8da',
    exposure: 1.05,
    micro: 0.0,
  },
  // neutral cool silver, strong metallic, controlled roughness, narrow edge
  // highlights, machined medical-grade look.
  TITANIUM: {
    baseColor: '#cfd3d8',
    metalness: 1.0,
    roughness: 0.16, // near-mirror polished surgical steel
    specColor: '#ffffff',
    fresnel: 0.7,
    fresnelColor: '#ffffff',
    translucency: 0.0,
    transColor: '#000000',
    exposure: 1.12,
    micro: 0.008,
  },
  // muted natural pink, soft specular, subsurface-looking edge softness.
  GUM: {
    baseColor: '#d8adab',
    metalness: 0.0,
    roughness: 0.46,
    specColor: '#f6e0dc',
    fresnel: 0.14,
    fresnelColor: '#e8c4c0',
    translucency: 0.3,
    transColor: '#d6a2a2',
    exposure: 1.0,
    micro: 0.02,
  },
  // warm ivory/beige, matte-to-satin, subtle natural variation.
  CORTICAL_BONE: {
    baseColor: '#ece6d7',
    metalness: 0.0,
    roughness: 0.58,
    specColor: '#f6efe3',
    fresnel: 0.1,
    fresnelColor: '#f2ece0',
    translucency: 0.1,
    transColor: '#e4dcc8',
    exposure: 0.98,
    micro: 0.04,
    doubleSide: true,
  },
  // slightly warmer/darker bone tone with restrained procedural micro-surface.
  CANCELLOUS_BONE: {
    baseColor: '#ddd6c4',
    metalness: 0.0,
    roughness: 0.68,
    specColor: '#ece4d2',
    fresnel: 0.07,
    fresnelColor: '#e8e0ce',
    translucency: 0.14,
    transColor: '#d6ccb4',
    exposure: 0.94,
    micro: 0.07,
    doubleSide: true,
  },
};

// ---------------------------------------------------------------------------
// Shaders
// ---------------------------------------------------------------------------

const VERT = /* glsl */ `
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    // parts use uniform scale, so mat3(modelMatrix) is a valid normal transform
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const FRAG = /* glsl */ `
  precision highp float;

  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  varying vec2 vUv;

  uniform vec3  uBaseColor;
  uniform float uMetalness;
  uniform float uRoughness;
  uniform vec3  uSpecColor;
  uniform float uFresnel;
  uniform vec3  uFresnelColor;
  uniform float uTranslucency;
  uniform vec3  uTransColor;
  uniform float uExposure;
  uniform float uMicro;
  uniform float uOpacity;

  uniform vec3  uKeyDir;
  uniform vec3  uKeyColor;
  uniform vec3  uStreak1Dir;
  uniform vec3  uStreak1Color;
  uniform float uStreak1Tight;
  uniform vec3  uStreak2Dir;
  uniform vec3  uStreak2Color;
  uniform float uStreak2Tight;
  uniform vec3  uSkyColor;
  uniform vec3  uGroundColor;
  uniform vec3  uHorizonColor;

  // cheap value noise for bone micro-surface (no textures)
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float vnoise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    float n000 = hash(i + vec3(0,0,0));
    float n100 = hash(i + vec3(1,0,0));
    float n010 = hash(i + vec3(0,1,0));
    float n110 = hash(i + vec3(1,1,0));
    float n001 = hash(i + vec3(0,0,1));
    float n101 = hash(i + vec3(1,0,1));
    float n011 = hash(i + vec3(0,1,1));
    float n111 = hash(i + vec3(1,1,1));
    return mix(
      mix(mix(n000,n100,f.x), mix(n010,n110,f.x), f.y),
      mix(mix(n001,n101,f.x), mix(n011,n111,f.x), f.y),
      f.z);
  }

  float specTerm(vec3 N, vec3 V, vec3 L, float exponent) {
    vec3 H = normalize(L + V);
    return pow(max(dot(N, H), 0.0), exponent);
  }

  void main() {
    vec3 N = normalize(vWorldNormal);
    if (!gl_FrontFacing) N = -N;
    vec3 V = normalize(cameraPosition - vWorldPos);
    float NoV = max(dot(N, V), 1e-3);

    float rough = clamp(uRoughness, 0.03, 1.0);

    // procedural micro-surface: perturb color + roughness for bone-like parts
    vec3 albedo = uBaseColor;
    float microN = 0.0;
    if (uMicro > 0.0001) {
      microN = vnoise(vWorldPos * 5.5) * 0.6 + vnoise(vWorldPos * 17.0) * 0.4;
      albedo *= 1.0 + (microN - 0.5) * uMicro;
      rough = clamp(rough + (microN - 0.5) * uMicro * 0.6, 0.05, 1.0);
    }

    vec3 diffuseColor = albedo * (1.0 - uMetalness);
    // dielectric reflectance ~0.04, metals reflect their own tint
    vec3 f0 = mix(vec3(0.045), albedo, uMetalness);
    // crisp highlight streaks stay mostly white (polished specular), lightly tinted
    vec3 streakSpec = mix(uSpecColor, albedo, 0.3);

    vec3 col = vec3(0.0);

    // ---- broad soft KEY light (diffuse + soft gloss) ----
    vec3 Lk = normalize(uKeyDir);
    float wrap = uTranslucency * 0.6;
    float diffK = max((dot(N, Lk) + wrap) / (1.0 + wrap), 0.0);
    float keyExp = mix(10.0, 160.0, 1.0 - rough);
    float glossK = specTerm(N, V, Lk, keyExp) * (keyExp + 8.0) * 0.02;
    col += uKeyColor * diffuseColor * diffK;
    col += uKeyColor * f0 * glossK;

    // ---- two hard narrow STREAK lights (thin bright edge highlights) ----
    float s1 = specTerm(N, V, normalize(uStreak1Dir), uStreak1Tight);
    float s2 = specTerm(N, V, normalize(uStreak2Dir), uStreak2Tight);
    // sharpen into a line and keep them mostly on grazing angles
    float graze = mix(1.0, pow(1.0 - NoV, 1.5) + 0.3, uMetalness);
    col += uStreak1Color * streakSpec * s1 * 1.9 * graze;
    col += uStreak2Color * streakSpec * s2 * 1.5 * graze;

    // ---- sky/ground/horizon AMBIENT so undersides read (diffuse) ----
    float up = N.y * 0.5 + 0.5;
    vec3 ambient = mix(uGroundColor, uSkyColor, up);
    ambient = mix(ambient, uHorizonColor, pow(1.0 - abs(N.y), 3.0) * 0.4);
    col += ambient * diffuseColor;

    // ---- environment reflection (the "silver" in polished titanium) ----
    // Without an HDRI, reflect the analytic sky/ground gradient off the view
    // vector: bright sky on top faces, dark ground below, a hot horizon band —
    // the classic chrome look. Roughness blurs it toward flat ambient.
    vec3 R = reflect(-V, N);
    float ry = clamp(R.y * 0.5 + 0.5, 0.0, 1.0);
    vec3 reflEnv = mix(uGroundColor, uSkyColor, ry);
    // a crisp bright band near the horizon of the reflection → chrome edge streak
    reflEnv = mix(reflEnv, uHorizonColor, pow(1.0 - abs(R.y), 6.0) * 0.85);
    reflEnv = mix(reflEnv, ambient, rough * 0.6);
    col += reflEnv * f0 * (0.55 + 1.35 * uMetalness);

    // ---- Fresnel rim ----
    float fres = pow(1.0 - NoV, 5.0);
    col += uFresnelColor * fres * uFresnel * mix(1.0, 0.7, uMetalness);

    // ---- subtle translucency back-scatter (ceramic / gum) ----
    if (uTranslucency > 0.001) {
      float back = pow(max(dot(-Lk, V), 0.0), 2.0);
      float thin = pow(1.0 - NoV, 2.0);
      col += uTransColor * uTranslucency * (back * 0.35 + thin * 0.12);
    }

    col *= uExposure;

    gl_FragColor = vec4(col, uOpacity);
  }
`;

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

const lin = (hex: string) => new THREE.Color(hex).convertSRGBToLinear();

export function makeMaterial(preset: PresetName, overrides: Partial<MaterialParams> = {}) {
  const p = { ...PRESETS[preset], ...overrides };

  const mat = new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: (p.opacity ?? 1) < 1,
    side: p.doubleSide ? THREE.DoubleSide : THREE.FrontSide,
    uniforms: {
      uBaseColor: { value: lin(p.baseColor) },
      uMetalness: { value: p.metalness },
      uRoughness: { value: p.roughness },
      uSpecColor: { value: lin(p.specColor) },
      uFresnel: { value: p.fresnel },
      uFresnelColor: { value: lin(p.fresnelColor) },
      uTranslucency: { value: p.translucency },
      uTransColor: { value: lin(p.transColor) },
      uExposure: { value: p.exposure },
      uMicro: { value: p.micro },
      uOpacity: { value: p.opacity ?? 1 },

      uKeyDir: { value: LIGHT_RIG.key.dir.clone().normalize() },
      uKeyColor: { value: lin(LIGHT_RIG.key.color).multiplyScalar(LIGHT_RIG.key.intensity) },
      uStreak1Dir: { value: LIGHT_RIG.streak1.dir.clone().normalize() },
      uStreak1Color: { value: lin(LIGHT_RIG.streak1.color) },
      uStreak1Tight: { value: LIGHT_RIG.streak1.tightness },
      uStreak2Dir: { value: LIGHT_RIG.streak2.dir.clone().normalize() },
      uStreak2Color: { value: lin(LIGHT_RIG.streak2.color) },
      uStreak2Tight: { value: LIGHT_RIG.streak2.tightness },
      uSkyColor: { value: lin(LIGHT_RIG.sky) },
      uGroundColor: { value: lin(LIGHT_RIG.ground) },
      uHorizonColor: { value: lin(LIGHT_RIG.horizon) },
    },
  });
  mat.toneMapped = false; // postprocessing ToneMapping pass handles ACES
  return mat;
}
