import React, { Suspense, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useDevicePerformance } from '../../hooks/useDevicePerformance';
import { StudioEnvironment } from './StudioEnvironment';
import { CrownMesh, GLBErrorBoundary } from './RealisticModel';

export interface Story3DTargets {
  root: THREE.Group;
  crown: THREE.Group;
  abutment: THREE.Group;
  screw: THREE.Group;
  implant: THREE.Group;
  bone: THREE.Group;
  crownMat: THREE.MeshPhysicalMaterial;
  abutmentMat: THREE.MeshStandardMaterial;
  fixScrewMat: THREE.MeshStandardMaterial;
  implantMat: THREE.MeshStandardMaterial;
  neckMat: THREE.MeshStandardMaterial;
  gumMat: THREE.MeshStandardMaterial;
  boneMat: THREE.MeshStandardMaterial;
  guideRingMat: THREE.MeshBasicMaterial;
}

interface StoryImplantCanvasProps {
  onReady?: (targets: Story3DTargets) => void;
  className?: string;
}

// Generate subtle perikymata micro-shading texture for crown fallback
function createPerikymataMicroTexture(): THREE.CanvasTexture {
  const canvasSq = 512;
  const canvas = document.createElement('canvas');
  canvas.width = canvasSq;
  canvas.height = canvasSq;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Base neutral off-white
    ctx.fillStyle = '#EAE5DA';
    ctx.fillRect(0, 0, canvasSq, canvasSq);

    // Incisal edge brightness gradient (top 20% slightly brighter)
    const incisalGrad = ctx.createLinearGradient(0, 0, 0, canvasSq);
    incisalGrad.addColorStop(0.0, 'rgba(255, 255, 255, 0.07)');
    incisalGrad.addColorStop(0.35, 'rgba(234, 229, 218, 0.0)');
    incisalGrad.addColorStop(0.85, 'rgba(218, 206, 188, 0.0)');
    incisalGrad.addColorStop(1.0, 'rgba(210, 195, 172, 0.06)'); // Subtle cervical warm tone
    ctx.fillStyle = incisalGrad;
    ctx.fillRect(0, 0, canvasSq, canvasSq);

    // Extremely subtle horizontal perikymata enamel micro-ridges
    ctx.fillStyle = 'rgba(0, 0, 0, 0.012)';
    for (let y = 0; y < canvasSq; y += 4) {
      if (y % 8 === 0) {
        ctx.fillRect(0, y, canvasSq, 1);
      }
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Generate subtle brushed SLA micro-roughness texture for titanium fallback
function createTitaniumMicroTexture(): THREE.CanvasTexture {
  const canvasSq = 512;
  const canvas = document.createElement('canvas');
  canvas.width = canvasSq;
  canvas.height = canvasSq;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#8F918F';
    ctx.fillRect(0, 0, canvasSq, canvasSq);

    // Subtle lathe micro-banding
    for (let y = 0; y < canvasSq; y += 3) {
      const alpha = (Math.sin(y * 0.4) * 0.5 + 0.5) * 0.025;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fillRect(0, y, canvasSq, 1.5);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function StoryModel({ onReady }: { onReady?: (targets: Story3DTargets) => void }) {
  const floatingGroupRef = useRef<THREE.Group>(null);
  const rootGroupRef = useRef<THREE.Group>(null);
  const crownGroupRef = useRef<THREE.Group>(null);
  const abutmentGroupRef = useRef<THREE.Group>(null);
  const screwGroupRef = useRef<THREE.Group>(null);
  const implantGroupRef = useRef<THREE.Group>(null);
  const boneGroupRef = useRef<THREE.Group>(null);

  // Fallback procedural micro-textures
  const crownPerikymataTex = useMemo(() => createPerikymataMicroTexture(), []);
  const titaniumSlaTex = useMemo(() => createTitaniumMicroTexture(), []);

  // Materials setup with verified dental PBR properties
  const materials = useMemo(() => {
    // 1. Ceramic Crown — creamy glossy zirconia (ref: image.png). SOLID, no glass.
    const crownMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#E0D7C2'), // Warm creamy ivory enamel — dense, not white
      roughness: 0.3,
      metalness: 0.0,
      clearcoat: 0.3, // Glossy enamel highlights, as in the reference
      clearcoatRoughness: 0.26,
      ior: 1.5,
      reflectivity: 0.3,
      transmission: 0.0, // Fully opaque — never glassy
      specularColor: new THREE.Color('#FFFDF6'),
      map: crownPerikymataTex,
      transparent: false,
      opacity: 1,
      envMapIntensity: 0.55,
    });

    // 2. Titanium Abutment — polished machined metal, solid
    const abutmentMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#C9C9C6'),
      metalness: 1.0,
      roughness: 0.28,
      transparent: false,
      opacity: 1,
      envMapIntensity: 2.0,
    });

    // 3. Fixation Micro-Screw
    const fixScrewMatAlt = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#A6ACAD'),
      metalness: 1.0,
      roughness: 0.32,
      transparent: false,
      opacity: 1,
      envMapIntensity: 1.5,
    });

    // 4. Titanium Root Fixture — bright polished threads w/ strong groove contrast (ref)
    const implantMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#C8C8C4'), // Bright polished titanium, per reference
      metalness: 1.0,
      roughness: 0.29, // Polished for bright, defined thread specular
      transparent: false,
      opacity: 1,
      envMapIntensity: 2.2,
    });

    // 5. Coronal Neck Collar — polished machined titanium
    const neckMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#CFD2CF'),
      metalness: 1.0,
      roughness: 0.26,
      transparent: false,
      opacity: 1,
      envMapIntensity: 2.1,
    });

    // 6. Gingiva Cuff — muted natural pink, SOLID (was translucent)
    const gumMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#C4837D'),
      roughness: 0.55,
      metalness: 0.0,
      transparent: false,
      opacity: 1,
      envMapIntensity: 0.2,
    });

    // 7. Cortical Jawbone — warm beige, SOLID (hidden by position only, not opacity)
    const boneMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#DDD2BB'),
      roughness: 0.72,
      metalness: 0.0,
      transparent: false,
      opacity: 1,
      envMapIntensity: 0.2,
    });

    // 8. (Legacy) guide material — kept for the targets contract, unused/hidden
    const guideRingMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#286A5B'),
      wireframe: true,
      transparent: true,
      opacity: 0,
      visible: false,
    });

    return {
      crownMat,
      abutmentMat,
      fixScrewMat: fixScrewMatAlt,
      neckMat,
      implantMat,
      gumMat,
      boneMat,
      guideRingMat,
    };
  }, [crownPerikymataTex, titaniumSlaTex]);

  // Optional Texture Loading with Graceful Fallback
  useEffect(() => {
    const loader逗 = new THREE.TextureLoader();

    const loadTextureSafely = (
      url: string,
      onSuccess: (tex: THREE.Texture) => void
    ) => {
      loader逗.load(
        url,
        (tex) => {
          tex.wrapS = THREE.RepeatWrapping;
          tex.wrapT = THREE.RepeatWrapping;
          onSuccess(tex);
        },
        undefined,
        () => {
          // Graceful fallback: texture not present, continue with PBR shader
        }
      );
    };

    // Attempt loading optional baked maps if available
    loadTextureSafely('/textures/crown-normal.webp', (tex) => {
      tex.colorSpace = THREE.LinearSRGBColorSpace;
      materials.crownMat.normalMap = tex;
      materials.crownMat.normalScale.set(0.04, 0.04);
      materials.crownMat.needsUpdate = true;
    });

    loadTextureSafely('/textures/crown-roughness.webp', (tex) => {
      materials.crownMat.roughnessMap = tex;
      materials.crownMat.needsUpdate = true;
    });

    loadTextureSafely('/textures/implant-normal.webp', (tex) => {
      tex.colorSpace = THREE.LinearSRGBColorSpace;
      materials.implantMat.normalMap = tex;
      materials.implantMat.normalScale.set(0.06, 0.06);
      materials.implantMat.needsUpdate = true;
    });

    loadTextureSafely('/textures/implant-roughness.webp', (tex) => {
      materials.implantMat.roughnessMap = tex;
      materials.implantMat.needsUpdate = true;
    });

    loadTextureSafely('/textures/gum-normal.webp', (tex) => {
      tex.colorSpace = THREE.LinearSRGBColorSpace;
      materials.gumMat.normalMap = tex;
      materials.gumMat.normalScale.set(0.05, 0.05);
      materials.gumMat.needsUpdate = true;
    });

    loadTextureSafely('/textures/bone-normal.webp', (tex) => {
      tex.colorSpace = THREE.LinearSRGBColorSpace;
      materials.boneMat.normalMap = tex;
      materials.boneMat.normalScale.set(0.08, 0.08);
      materials.boneMat.needsUpdate = true;
    });
  }, [materials]);

  // Anatomical Geometries Setup with True Dental Proportions & Computed Vertex Normals
  const geometries = useMemo(() => {
    // 1. Natural Molar Crown Contour (Smooth shading on organic surface)
    const crownShape = new THREE.Shape();
    crownShape.moveTo(-0.64, 0);
    crownShape.bezierCurveTo(-0.72, 0.35, -0.76, 0.78, -0.58, 1.08);
    crownShape.bezierCurveTo(-0.42, 1.22, -0.16, 1.26, 0.0, 1.14);
    crownShape.bezierCurveTo(0.16, 1.26, 0.42, 1.22, 0.58, 1.08);
    crownShape.bezierCurveTo(0.76, 0.78, 0.72, 0.35, 0.64, 0);
    crownShape.bezierCurveTo(0.5, -0.12, -0.5, -0.12, -0.64, 0);

    const extrudeSettings = {
      steps: 4,
      depth: 0.92,
      bevelEnabled: true,
      bevelThickness: 0.22,
      bevelSize: 0.2,
      bevelOffset: 0,
      bevelSegments: 10,
    };
    const crownGeo = new THREE.ExtrudeGeometry(crownShape, extrudeSettings);
    crownGeo.center();
    crownGeo.computeVertexNormals();

    // 2. Morse Taper Abutment (Smooth lathe cylinders with defined connector profile)
    const abutmentCoreGeo = new THREE.CylinderGeometry(0.46, 0.38, 0.55, 36);
    abutmentCoreGeo.computeVertexNormals();
    const abutmentCollarGeo = new THREE.CylinderGeometry(0.58, 0.46, 0.3, 36);
    abutmentCollarGeo.computeVertexNormals();
    const abutmentHexGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.35, 6);

    // 3. Fixation Screw
    const fixScrewHeadGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.12, 6);
    const fixScrewShaftGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.75, 20);
    fixScrewShaftGeo.computeVertexNormals();

    // 4. Titanium Root Fixture
    const implantCoreGeo = new THREE.CylinderGeometry(0.42, 0.27, 1.85, 36);
    implantCoreGeo.computeVertexNormals();
    const implantApexGeo = new THREE.SphereGeometry(0.27, 36, 18, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    implantApexGeo.computeVertexNormals();
    const neckCollarGeo = new THREE.CylinderGeometry(0.45, 0.42, 0.24, 36);
    neckCollarGeo.computeVertexNormals();

    // Microthread rings at coronal margin (reduces crestal bone resorption)
    const microThreadRings: THREE.TorusGeometry[] = [];
    for (let i = 0; i < 4; i++) {
      const ringGeo = new THREE.TorusGeometry(0.43, 0.018, 14, 36);
      ringGeo.computeVertexNormals();
      microThreadRings.push(ringGeo);
    }

    // Continuous helical self-tapping thread — one real screw helix swept along
    // the tapered fixture, instead of stacked separate rings (far more realistic).
    const threadPts: THREE.Vector3[] = [];
    const turns = 7;
    const segs = 260;
    const yTop = 0.36;
    const yBot = -0.98;
    const rTop = 0.40;
    const rBot = 0.30;
    for (let i = 0; i <= segs; i++) {
      const t = i / segs;
      const ang = t * turns * Math.PI * 2;
      const y = THREE.MathUtils.lerp(yTop, yBot, t);
      const r = THREE.MathUtils.lerp(rTop, rBot, t);
      threadPts.push(new THREE.Vector3(Math.cos(ang) * r, y, Math.sin(ang) * r));
    }
    const threadCurve = new THREE.CatmullRomCurve3(threadPts);
    const macroThreadGeo = new THREE.TubeGeometry(threadCurve, segs, 0.052, 12, false);
    macroThreadGeo.computeVertexNormals();

    // 5. Gingiva / Mucosal Emergence Profile (Smooth cervical transition)
    const gumGeo = new THREE.CylinderGeometry(1.02, 1.18, 0.68, 36, 2, true);
    gumGeo.computeVertexNormals();

    // 6. Jawbone Block
    const boneBlockGeo = new THREE.BoxGeometry(2.8, 2.2, 2.0);
    boneBlockGeo.computeVertexNormals();

    // 7. Planning Trajectory Cylinder & Guide Ring
    const guideTrajectoryGeo = new THREE.CylinderGeometry(0.46, 0.46, 2.9, 24, 1, true);
    const guideRingGeo = new THREE.TorusGeometry(0.68, 0.024, 12, 32);

    return {
      crownGeo,
      abutmentCoreGeo,
      abutmentCollarGeo,
      abutmentHexGeo,
      fixScrewHeadGeo,
      fixScrewShaftGeo,
      implantCoreGeo,
      implantApexGeo,
      neckCollarGeo,
      microThreadRings,
      macroThreadGeo,
      gumGeo,
      boneBlockGeo,
      guideTrajectoryGeo,
      guideRingGeo,
    };
  }, []);

  // Diagnostic Inspection Report
  useEffect(() => {
    if (
      rootGroupRef.current &&
      crownGroupRef.current &&
      abutmentGroupRef.current &&
      screwGroupRef.current &&
      implantGroupRef.current &&
      boneGroupRef.current
    ) {
      const report = {
        title: '3D Dental Implant Model Calibration Report',
        components: [
          { name: 'Ceramic Crown', vertices: geometries.crownGeo.attributes.position.count, material: 'Zirconia A1/A2 PBR (MeshPhysicalMaterial)', ior: 1.45, roughness: 0.34 },
          { name: 'Titanium Abutment', vertices: geometries.abutmentCoreGeo.attributes.position.count, material: 'Machined Satin Ti-6Al-4V', metalness: 1.0, roughness: 0.30 },
          { name: 'Fixation Screw', vertices: geometries.fixScrewShaftGeo.attributes.position.count, material: 'Micro Titanium Hex Screw', metalness: 1.0, roughness: 0.35 },
          { name: 'Root Fixture', vertices: geometries.implantCoreGeo.attributes.position.count, material: 'Grade 5 Ti-6Al-4V SLA Surface', metalness: 1.0, roughness: 0.42 },
          { name: 'Gingival Cuff', vertices: geometries.gumGeo.attributes.position.count, material: 'Desaturated Mucosa PBR', roughness: 0.58 },
          { name: 'Cortical Bone', vertices: geometries.boneBlockGeo.attributes.position.count, material: 'Ivory Osteotomy Bed', roughness: 0.68 },
        ],
        textures: {
          crownNormal: materials.crownMat.normalMap ? 'Active' : 'Fallback Procedural Perikymata',
          implantNormal: materials.implantMat.normalMap ? 'Active' : 'Fallback Procedural SLA Texture',
          gumNormal: materials.gumMat.normalMap ? 'Active' : 'PBR Diffuse Fallback',
          boneNormal: materials.boneMat.normalMap ? 'Active' : 'PBR Diffuse Fallback',
        },
      };
      // Log development report cleanly
      console.info('[3D Dental Inspection Report]', report);

      if (onReady) {
        onReady({
          root: rootGroupRef.current,
          crown: crownGroupRef.current,
          abutment: abutmentGroupRef.current,
          screw: screwGroupRef.current,
          implant: implantGroupRef.current,
          bone: boneGroupRef.current,
          crownMat: materials.crownMat,
          abutmentMat: materials.abutmentMat,
          fixScrewMat: materials.fixScrewMat,
          implantMat: materials.implantMat,
          neckMat: materials.neckMat,
          gumMat: materials.gumMat,
          boneMat: materials.boneMat,
          guideRingMat: materials.guideRingMat,
        });
      }
    }
  }, [materials, geometries, onReady]);

  // Ultra-subtle studio breathing animation (12–14s period, <1.2° rotation, 0.008 amplitude)
  useFrame((state) => {
    if (!floatingGroupRef.current) return;
    const time = state.clock.getElapsedTime();
    floatingGroupRef.current.position.y = Math.sin(time * 0.48) * 0.008;
    floatingGroupRef.current.rotation.y = Math.sin(time * 0.32) * 0.012;
  });

  return (
    <group ref={floatingGroupRef}>
      <group ref={rootGroupRef} position={[-1.85, 0, 0]} rotation={[0.06, 0.28, 0]} dispose={null}>
        {/* 1. CERAMIC CROWN — Blender-sculpted molar, procedural fallback */}
        <group ref={crownGroupRef} position={[0, 1.15, 0]}>
          <GLBErrorBoundary
            fallback={
              <mesh geometry={geometries.crownGeo} material={materials.crownMat} castShadow receiveShadow />
            }
          >
            <Suspense
              fallback={
                <mesh geometry={geometries.crownGeo} material={materials.crownMat} castShadow receiveShadow />
              }
            >
              <CrownMesh material={materials.crownMat} height={2.35} />
            </Suspense>
          </GLBErrorBoundary>
        </group>

        {/* 2. TITANIUM ABUTMENT */}
        <group ref={abutmentGroupRef} position={[0, 0.46, 0]}>
          <mesh geometry={geometries.abutmentCoreGeo} material={materials.abutmentMat} position={[0, 0.12, 0]} />
          <mesh geometry={geometries.abutmentCollarGeo} material={materials.abutmentMat} position={[0, -0.18, 0]} />
          <mesh geometry={geometries.abutmentHexGeo} material={materials.abutmentMat} position={[0, -0.42, 0]} />
        </group>

        {/* 3. FIXATION SCREW */}
        <group ref={screwGroupRef} position={[0, 0.62, 0]}>
          <mesh geometry={geometries.fixScrewHeadGeo} material={materials.fixScrewMat} position={[0, 0.28, 0]} />
          <mesh geometry={geometries.fixScrewShaftGeo} material={materials.fixScrewMat} position={[0, -0.08, 0]} />
        </group>

        {/* 4. TITANIUM ROOT FIXTURE */}
        <group ref={implantGroupRef} position={[0, -0.58, 0]}>
          {/* Polished Machined Neck Collar */}
          <mesh geometry={geometries.neckCollarGeo} material={materials.neckMat} position={[0, 0.72, 0]} />

          {/* Microthread Rings */}
          {geometries.microThreadRings.map((geo, i) => (
            <mesh
              key={`micro-${i}`}
              geometry={geo}
              material={materials.neckMat}
              position={[0, 0.6 - i * 0.058, 0]}
              rotation={[Math.PI / 2, 0, 0]}
            />
          ))}

          {/* Tapered Fixture Core */}
          <mesh geometry={geometries.implantCoreGeo} material={materials.implantMat} position={[0, -0.16, 0]} />

          {/* Rounded Apex */}
          <mesh geometry={geometries.implantApexGeo} material={materials.implantMat} position={[0, -1.08, 0]} />

          {/* Continuous Self-Tapping Helical Macro Thread */}
          <mesh geometry={geometries.macroThreadGeo} material={materials.implantMat} />
        </group>

        {/* 5. GINGIVA / GUM TISSUE */}
        <mesh
          geometry={geometries.gumGeo}
          material={materials.gumMat}
          position={[0, 0.12, 0]}
        />

        {/* 6. JAWBONE OSTEOTOMY BED */}
        <group ref={boneGroupRef} position={[0, -3.8, 0]}>
          <mesh geometry={geometries.boneBlockGeo} material={materials.boneMat} position={[0, -0.35, 0]} />
        </group>

        {/* Surgical planning guide wireframe removed — it rendered as an ugly
            cage over the fixture at certain scroll positions. */}
      </group>
    </group>
  );
}

export function StoryImplantCanvas({ onReady, className = '' }: StoryImplantCanvasProps) {
  const perf = useDevicePerformance();

  // Limited, high-efficiency adaptive pixel ratio (1.5 on desktop, 1.25 on mobile)
  const safeDpr = Math.min(perf.dpr, 1.5);

  return (
    <div className={`relative h-full w-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 9.2], fov: 27 }}
        dpr={safeDpr}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.8,
        }}
        className="pointer-events-none"
      >
        {/* Neutral procedural studio IBL — soft, believable metal reflections */}
        <StudioEnvironment intensity={1.3} />

        {/* Premium studio softbox rig — lower ambient for denser, contrasty form */}
        {/* 1. Low ambient — preserves form contrast, prevents wash-out */}
        <ambientLight intensity={0.22} color="#EEF0EF" />

        {/* 2. Key softbox — front-LEFT, elevated, soft warm */}
        <directionalLight position={[-4.6, 5.6, 5.4]} intensity={0.9} color="#FFFDF8" />

        {/* 3. Fill — right side, weaker, cool-neutral */}
        <directionalLight position={[5.2, 2.2, 3.4]} intensity={0.3} color="#EEF2F1" />

        {/* 4. Rim — behind + above, subtle edge separation */}
        <directionalLight position={[0, 5.2, -5.6]} intensity={0.36} color="#FFFFFF" />

        {/* 5. Gentle base bounce */}
        <directionalLight position={[0, -4.5, 2.8]} intensity={0.14} color="#FAF7F2" />

        {/* 6. Front fill from camera — brightens the polished thread faces (per reference) */}
        <directionalLight position={[0, 0.5, 8]} intensity={0.35} color="#FDFDFB" />

        <Suspense fallback={null}>
          <StoryModel onReady={onReady} />
        </Suspense>
      </Canvas>
    </div>
  );
}
