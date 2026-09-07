import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { STORY_COORDINATES } from '../../lib/implantStory';
import { ImplantLabels } from './ImplantLabels';

interface ImplantModelProps {
  scrollProgress: number; // 0.0 to 1.0
  manualExplode?: number; // 0 to 1 override for modal
  mousePos?: { x: number; y: number };
  isInteractiveModal?: boolean;
  isMobile?: boolean;
  isTablet?: boolean;
  enableParallax?: boolean;
}

export function ImplantModel({
  scrollProgress = 0,
  manualExplode = 0,
  mousePos = { x: 0, y: 0 },
  isInteractiveModal = false,
  isMobile = false,
  isTablet = false,
  enableParallax = true,
}: ImplantModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const crownGroupRef = useRef<THREE.Group>(null);
  const abutmentGroupRef = useRef<THREE.Group>(null);
  const screwGroupRef = useRef<THREE.Group>(null);
  const implantGroupRef = useRef<THREE.Group>(null);
  const boneGroupRef = useRef<THREE.Group>(null);

  // Device specific coordinate set
  const coords = useMemo(() => {
    if (isMobile) return STORY_COORDINATES.mobile;
    if (isTablet) return STORY_COORDINATES.tablet;
    return STORY_COORDINATES.desktop;
  }, [isMobile, isTablet]);

  // Materials setup with physically accurate PBR properties
  const materials = useMemo(() => {
    // 1. Warm Ivory Translucent Zirconia Ceramic Crown
    const crownMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#E0D7C2'),
      roughness: 0.32,
      metalness: 0.0,
      clearcoat: 0.3,
      clearcoatRoughness: 0.26,
      transmission: 0.0, // Opaque — never glassy
      ior: 1.5,
      reflectivity: 0.3,
      specularColor: new THREE.Color('#FFFDF6'),
      transparent: false,
      opacity: 1,
    });

    // 2. Machined Titanium Abutment (Conical Morse Taper)
    const abutmentMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#C2CCD3'),
      metalness: 0.9,
      roughness: 0.22,
      transparent: true,
      opacity: 1,
    });

    // 3. Central Fixation Titanium Micro-Screw
    const fixScrewMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#8E98A0'),
      metalness: 0.94,
      roughness: 0.2,
      transparent: true,
      opacity: 1,
    });

    // 4. Titanium Root Fixture (Grade 5 Ti-6Al-4V SLA Micro-textured)
    const implantMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#9DA7B0'),
      metalness: 0.92,
      roughness: 0.28,
    });

    // 5. Coronal Micro-thread Neck Collar
    const neckMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#A8B2BB'),
      metalness: 0.86,
      roughness: 0.22,
    });

    // 6. Healthy Gingiva / Gum Collar (Natural soft pink)
    const gumMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ECA4AC'),
      roughness: 0.55,
      metalness: 0.02,
      transparent: true,
      opacity: 0.9,
    });

    // 7. Cortical Jawbone (Warm ivory osteotomy bed)
    const boneMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#EFE5D3'),
      roughness: 0.65,
      metalness: 0.02,
      transparent: true,
      opacity: 0,
    });

    return {
      crownMat,
      abutmentMat,
      fixScrewMat,
      implantMat,
      neckMat,
      gumMat,
      boneMat,
    };
  }, []);

  // Geometries setup
  const geometries = useMemo(() => {
    // 1. Natural Molar Crown
    const crownShape = new THREE.Shape();
    crownShape.moveTo(-0.75, 0);
    crownShape.bezierCurveTo(-0.85, 0.4, -0.9, 0.9, -0.7, 1.25);
    crownShape.bezierCurveTo(-0.5, 1.45, -0.2, 1.5, 0, 1.35);
    crownShape.bezierCurveTo(0.2, 1.5, 0.5, 1.45, 0.7, 1.25);
    crownShape.bezierCurveTo(0.9, 0.9, 0.85, 0.4, 0.75, 0);
    crownShape.bezierCurveTo(0.6, -0.15, -0.6, -0.15, -0.75, 0);

    const extrudeSettings = {
      steps: 3,
      depth: 1.1,
      bevelEnabled: true,
      bevelThickness: 0.26,
      bevelSize: 0.24,
      bevelOffset: 0,
      bevelSegments: 8,
    };
    const crownGeo = new THREE.ExtrudeGeometry(crownShape, extrudeSettings);
    crownGeo.center();

    // 2. Abutment
    const abutmentCoreGeo = new THREE.CylinderGeometry(0.55, 0.44, 0.65, 32);
    const abutmentCollarGeo = new THREE.CylinderGeometry(0.68, 0.55, 0.35, 32);
    const abutmentHexGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.4, 6);

    // 3. Fixation Screw
    const fixScrewHeadGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.15, 6);
    const fixScrewShaftGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.9, 16);

    // 4. Titanium Root Fixture
    const implantCoreGeo = new THREE.CylinderGeometry(0.5, 0.32, 2.2, 32);
    const implantApexGeo = new THREE.SphereGeometry(0.32, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const neckCollarGeo = new THREE.CylinderGeometry(0.54, 0.5, 0.3, 32);

    // Microthread rings
    const microThreadRings: THREE.TorusGeometry[] = [];
    for (let i = 0; i < 4; i++) {
      microThreadRings.push(new THREE.TorusGeometry(0.51, 0.022, 12, 32));
    }

    // Macro helical self-tapping threads
    const macroThreadRings: THREE.TorusGeometry[] = [];
    for (let i = 0; i < 9; i++) {
      const radiusAtHeight = 0.5 - (i / 9) * 0.16;
      macroThreadRings.push(new THREE.TorusGeometry(radiusAtHeight + 0.065, 0.052, 14, 32));
    }

    // 5. Gingiva / Gum Ring
    const gumGeo = new THREE.CylinderGeometry(1.2, 1.4, 0.8, 32, 1, true);

    // 6. Jawbone Block
    const boneBlockGeo = new THREE.BoxGeometry(3.2, 2.6, 2.4);

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
      macroThreadRings,
      gumGeo,
      boneBlockGeo,
    };
  }, []);

  // Frame animation loop executing smooth interpolation across scenes
  useFrame((state) => {
    if (!groupRef.current) return;

    const t = state.clock.getElapsedTime();
    const progress = isInteractiveModal ? manualExplode : scrollProgress;

    // Gentle parallax and breathing
    const pX = enableParallax ? mousePos.x * 0.25 : 0;
    const pY = enableParallax ? mousePos.y * 0.15 : 0;
    const idleBreath = Math.sin(t * 1.4) * 0.04;
    const idleRotY = Math.sin(t * 0.7) * 0.06;

    let targetX = coords.left.x;
    let targetY = coords.left.y + idleBreath;
    let targetZ = coords.left.z;
    let targetRotY = 0.35 + idleRotY + pX;
    let targetRotX = 0.08 + pY;
    let targetScale = isMobile ? 0.78 : isTablet ? 0.9 : 1.0;

    let crownY = 1.35;
    let crownOpacity = 1;
    let abutmentY = 0.55;
    let abutmentOpacity = 1;
    let screwY = 0.75;
    let implantY = -0.7;
    let implantRotY = 0;
    let boneY = -4.5;
    let boneOpacity = 0;

    if (isInteractiveModal) {
      // Manual 3D modal inspector
      const exp = manualExplode;
      targetX = 0;
      targetY = idleBreath;
      targetZ = 0;
      targetRotY += t * 0.25;
      crownY = 1.35 + exp * 1.6;
      abutmentY = 0.55 + exp * 0.85;
      screwY = 0.75 + exp * 1.15;
      implantY = -0.7 - exp * 0.35;
    } else {
      // 11-SCENE MASTER CHOREOGRAPHY
      if (progress <= 0.08) {
        // SCENE 01: Hero (Model on LEFT, Assembled)
        const p = progress / 0.08;
        targetX = coords.left.x;
        targetY = coords.left.y + idleBreath;
        targetZ = coords.left.z;
        targetRotY = THREE.MathUtils.lerp(0.25, 0.45, p) + idleRotY + pX;
        targetRotX = 0.08 + pY;
      } else if (progress <= 0.20) {
        // SCENE 02: Precision Center Moment (LEFT → CENTER)
        const p = (progress - 0.08) / 0.12;
        targetX = THREE.MathUtils.lerp(coords.left.x, coords.center.x, p);
        targetY = THREE.MathUtils.lerp(coords.left.y, coords.center.y, p) + idleBreath;
        targetZ = THREE.MathUtils.lerp(coords.left.z, coords.center.z + 0.3, p);
        targetRotY = THREE.MathUtils.lerp(0.45, 0.85, p) + idleRotY + pX;
        targetRotX = THREE.MathUtils.lerp(0.08, 0.14, p) + pY;
      } else if (progress <= 0.32) {
        // SCENE 03: Move to RIGHT (CENTER → RIGHT)
        const p = (progress - 0.20) / 0.12;
        targetX = THREE.MathUtils.lerp(coords.center.x, coords.right.x, p);
        targetY = THREE.MathUtils.lerp(coords.center.y, coords.right.y, p) + idleBreath;
        targetZ = THREE.MathUtils.lerp(coords.center.z + 0.3, coords.right.z, p);
        targetRotY = THREE.MathUtils.lerp(0.85, 1.25, p) + idleRotY + pX;

        // Slight vertical component release
        crownY = THREE.MathUtils.lerp(1.35, 1.9, p);
        abutmentY = THREE.MathUtils.lerp(0.55, 0.85, p);
        screwY = THREE.MathUtils.lerp(0.75, 1.1, p);
        implantY = THREE.MathUtils.lerp(-0.7, -0.85, p);
      } else if (progress <= 0.46) {
        // SCENE 04: Exploded View on RIGHT
        const p = (progress - 0.32) / 0.14;
        targetX = coords.right.x;
        targetY = coords.right.y + idleBreath;
        targetZ = coords.right.z;
        targetRotY = THREE.MathUtils.lerp(1.25, 1.6, p) + pX;
        targetRotX = THREE.MathUtils.lerp(0.14, 0.2, p) + pY;

        // Full exploded state
        crownY = THREE.MathUtils.lerp(1.9, 2.7, p);
        abutmentY = THREE.MathUtils.lerp(0.85, 1.4, p);
        screwY = THREE.MathUtils.lerp(1.1, 1.9, p);
        implantY = THREE.MathUtils.lerp(-0.85, -1.0, p);
      } else if (progress <= 0.56) {
        // SCENE 05: Screen Transition (RIGHT → CENTER → LEFT, Focus Titanium)
        const p = (progress - 0.46) / 0.1;
        targetX = THREE.MathUtils.lerp(coords.right.x, coords.left.x, p);
        targetY = THREE.MathUtils.lerp(coords.right.y, coords.left.y, p) + idleBreath;
        targetZ = THREE.MathUtils.lerp(coords.right.z, coords.left.z + 0.6, p);
        targetRotY = THREE.MathUtils.lerp(1.6, 2.8, p);
        targetRotX = THREE.MathUtils.lerp(0.2, -0.15, p); // Tilted for thread inspection

        // Fade crown and abutment to highlight titanium fixture
        crownOpacity = THREE.MathUtils.lerp(1, 0.1, p);
        abutmentOpacity = THREE.MathUtils.lerp(1, 0.15, p);
        crownY = 2.7;
        abutmentY = 1.4;
        screwY = 1.9;
        implantY = -0.7;
      } else if (progress <= 0.67) {
        // SCENE 06: Titanium Close-Up (LEFT)
        const p = (progress - 0.56) / 0.11;
        targetX = coords.left.x;
        targetY = coords.left.y + idleBreath + 0.2;
        targetZ = coords.left.z + 0.8;
        targetRotY = THREE.MathUtils.lerp(2.8, 3.6, p) + idleRotY * 0.5;
        targetRotX = -0.18 + pY;

        crownOpacity = 0.05;
        abutmentOpacity = 0.08;
        implantY = -0.6;
      } else if (progress <= 0.77) {
        // SCENE 07: Implant Placement (LEFT → CENTER into Bone)
        const p = (progress - 0.67) / 0.1;
        targetX = THREE.MathUtils.lerp(coords.left.x, coords.center.x, p);
        targetY = THREE.MathUtils.lerp(coords.left.y, coords.center.y, p) + idleBreath;
        targetZ = THREE.MathUtils.lerp(coords.left.z + 0.8, coords.center.z, p);
        targetRotY = THREE.MathUtils.lerp(3.6, 4.8, p);
        targetRotX = THREE.MathUtils.lerp(-0.18, 0.1, p);

        // Jawbone rises up
        boneY = THREE.MathUtils.lerp(-4.5, -1.8, p);
        boneOpacity = THREE.MathUtils.lerp(0, 0.95, p);

        // Implant fixture screws down into the bone
        implantY = THREE.MathUtils.lerp(0.8, -0.85, p);
        implantRotY = p * Math.PI * 3; // Screwing motion

        crownOpacity = 0;
        abutmentOpacity = 0;
      } else if (progress <= 0.86) {
        // SCENE 08: Digital Planning (Slight RIGHT, in bone)
        const p = (progress - 0.77) / 0.09;
        targetX = THREE.MathUtils.lerp(coords.center.x, coords.slightRight.x, p);
        targetY = coords.slightRight.y + idleBreath;
        targetZ = coords.slightRight.z;
        targetRotY = THREE.MathUtils.lerp(4.8, 5.2, p) + idleRotY;
        targetRotX = 0.12 + pY;

        boneY = -1.8;
        boneOpacity = 0.95;
        implantY = -0.85;
        crownOpacity = 0;
        abutmentOpacity = 0;
      } else if (progress <= 0.93) {
        // SCENE 09: Abutment Assembly (CENTER)
        const p = (progress - 0.86) / 0.07;
        targetX = THREE.MathUtils.lerp(coords.slightRight.x, coords.center.x, p);
        targetY = coords.center.y + idleBreath;
        targetZ = coords.center.z;
        targetRotY = THREE.MathUtils.lerp(5.2, 5.8, p) + idleRotY;
        targetRotX = 0.1;

        boneY = -1.8;
        boneOpacity = THREE.MathUtils.lerp(0.95, 0.7, p);
        implantY = -0.85;

        // Abutment descends into conical connection
        abutmentOpacity = THREE.MathUtils.lerp(0.2, 1, p);
        abutmentY = THREE.MathUtils.lerp(2.2, 0.55, p);
        screwY = THREE.MathUtils.lerp(2.5, 0.75, p);
        crownOpacity = 0;
      } else if (progress <= 0.97) {
        // SCENE 10: Crown Transformation (Attaching from upper-right)
        const p = (progress - 0.93) / 0.04;
        targetX = coords.center.x;
        targetY = coords.center.y + idleBreath;
        targetZ = coords.center.z;
        targetRotY = THREE.MathUtils.lerp(5.8, 6.2, p) + idleRotY;

        boneOpacity = THREE.MathUtils.lerp(0.7, 0.3, p);
        boneY = -2.2;
        abutmentY = 0.55;
        abutmentOpacity = 1;
        implantY = -0.7;

        // Crown lands onto abutment
        crownOpacity = THREE.MathUtils.lerp(0.3, 1, p);
        crownY = THREE.MathUtils.lerp(2.8, 1.35, p);
      } else {
        // SCENE 11: Final Restored Tooth at CENTER
        targetX = coords.center.x;
        targetY = coords.center.y + idleBreath;
        targetZ = coords.center.z;
        targetRotY = 6.28 + idleRotY + pX;
        targetRotX = 0.08 + pY;

        crownY = 1.35;
        crownOpacity = 1;
        abutmentY = 0.55;
        abutmentOpacity = 1;
        screwY = 0.75;
        implantY = -0.7;
        boneY = -3.8;
        boneOpacity = 0.15;
      }
    }

    // Apply smooth transforms to group and sub-components
    groupRef.current.position.set(targetX, targetY, targetZ);
    groupRef.current.rotation.set(targetRotX, targetRotY, 0);
    groupRef.current.scale.setScalar(targetScale);

    if (crownGroupRef.current) {
      crownGroupRef.current.position.y = crownY;
      materials.crownMat.opacity = crownOpacity;
    }

    if (abutmentGroupRef.current) {
      abutmentGroupRef.current.position.y = abutmentY;
      materials.abutmentMat.opacity = abutmentOpacity;
    }

    if (screwGroupRef.current) {
      screwGroupRef.current.position.y = screwY;
      materials.fixScrewMat.opacity = abutmentOpacity;
    }

    if (implantGroupRef.current) {
      implantGroupRef.current.position.y = implantY;
      implantGroupRef.current.rotation.y = implantRotY;
    }

    if (boneGroupRef.current) {
      boneGroupRef.current.position.y = boneY;
      materials.boneMat.opacity = boneOpacity;
    }
  });

  return (
    <group ref={groupRef} dispose={null}>
      {/* 1. CERAMIC CROWN */}
      <group ref={crownGroupRef} position={[0, 1.35, 0]}>
        <mesh geometry={geometries.crownGeo} material={materials.crownMat} castShadow />
      </group>

      {/* 2. TITANIUM ABUTMENT */}
      <group ref={abutmentGroupRef} position={[0, 0.55, 0]}>
        <mesh geometry={geometries.abutmentCoreGeo} material={materials.abutmentMat} position={[0, 0.15, 0]} />
        <mesh geometry={geometries.abutmentCollarGeo} material={materials.abutmentMat} position={[0, -0.22, 0]} />
        <mesh geometry={geometries.abutmentHexGeo} material={materials.abutmentMat} position={[0, -0.5, 0]} />
      </group>

      {/* 3. FIXATION SCREW */}
      <group ref={screwGroupRef} position={[0, 0.75, 0]}>
        <mesh geometry={geometries.fixScrewHeadGeo} material={materials.fixScrewMat} position={[0, 0.35, 0]} />
        <mesh geometry={geometries.fixScrewShaftGeo} material={materials.fixScrewMat} position={[0, -0.1, 0]} />
      </group>

      {/* 4. TITANIUM ROOT FIXTURE BODY */}
      <group ref={implantGroupRef} position={[0, -0.7, 0]}>
        {/* Polished Machined Neck Collar */}
        <mesh geometry={geometries.neckCollarGeo} material={materials.neckMat} position={[0, 0.85, 0]} />

        {/* Microthread Rings */}
        {geometries.microThreadRings.map((geo, i) => (
          <mesh
            key={`micro-${i}`}
            geometry={geo}
            material={materials.neckMat}
            position={[0, 0.72 - i * 0.07, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          />
        ))}

        {/* Tapered Fixture Core */}
        <mesh geometry={geometries.implantCoreGeo} material={materials.implantMat} position={[0, -0.2, 0]} />

        {/* Rounded Apex */}
        <mesh geometry={geometries.implantApexGeo} material={materials.implantMat} position={[0, -1.3, 0]} />

        {/* Self-Tapping Helical Macro Threads */}
        {geometries.macroThreadRings.map((geo, i) => (
          <mesh
            key={`macro-${i}`}
            geometry={geo}
            material={materials.implantMat}
            position={[0, 0.35 - i * 0.17, 0]}
            rotation={[Math.PI / 2, 0.15, 0]}
          />
        ))}
      </group>

      {/* 5. GINGIVA / GUM TISSUE */}
      <mesh
        geometry={geometries.gumGeo}
        material={materials.gumMat}
        position={[0, 0.15, 0]}
        rotation={[0, 0, 0]}
      />

      {/* 6. JAWBONE OSTEOTOMY BED */}
      <group ref={boneGroupRef} position={[0, -4.5, 0]}>
        <mesh geometry={geometries.boneBlockGeo} material={materials.boneMat} position={[0, -0.4, 0]} />
      </group>

      {/* 3D Minimal Annotation Badges */}
      <ImplantLabels scrollProgress={scrollProgress} isMobile={isMobile} />
    </group>
  );
}
