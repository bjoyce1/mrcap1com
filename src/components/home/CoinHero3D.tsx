import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture, Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import coinTexture from "@/assets/mr-cap-coin.webp";

/**
 * The Mr. CAP coin rendered as a real 3D gold coin.
 * Faces use the coin artwork; the rim is brushed gold metal.
 */
const Coin = ({ reduced }: { reduced: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);
  const coinRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  // Wide screens: float the coin right of the portrait. Narrow: center it high.
  const isWide = viewport.width > 7;
  const xOff = isWide ? viewport.width / 4.1 : viewport.width * 0.3;
  const yOff = isWide ? 0.55 : 1.8;
  // Shrink the coin on narrow viewports so it accents rather than dominates
  const coinScale = isWide ? 1 : Math.min(1, viewport.width / 7);
  const face = useTexture(coinTexture);
  face.colorSpace = THREE.SRGBColorSpace;
  face.anisotropy = 8;

  // Back face texture must be mirrored so it reads correctly
  const backFace = useMemo(() => {
    const t = face.clone();
    t.wrapS = THREE.RepeatWrapping;
    t.repeat.x = -1;
    t.needsUpdate = true;
    return t;
  }, [face]);

  useFrame((state, delta) => {
    if (reduced) return;
    if (coinRef.current) {
      // Slow regal spin
      coinRef.current.rotation.y += delta * 0.45;
    }
    if (groupRef.current) {
      // Ease the whole group toward the pointer for parallax depth
      const targetX = state.pointer.y * 0.25;
      const targetY = state.pointer.x * 0.35;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetX,
        0.05
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        targetY * 0.3,
        0.05
      );
    }
  });

  return (
    <group ref={groupRef} position={[xOff, yOff, 0]} scale={coinScale}>
      <Float
        speed={reduced ? 0 : 1.6}
        rotationIntensity={reduced ? 0 : 0.25}
        floatIntensity={reduced ? 0 : 0.6}
      >
        {/* Cylinder rotated so the faces point at the camera */}
        <mesh ref={coinRef} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[1.2, 1.2, 0.13, 96]} />
          {/* material-0: rim, material-1: top face, material-2: bottom face */}
          <meshStandardMaterial
            attach="material-0"
            color="#d9a441"
            metalness={0.95}
            roughness={0.28}
          />
          <meshStandardMaterial
            attach="material-1"
            map={face}
            metalness={0.55}
            roughness={0.35}
            emissive="#3a2a08"
            emissiveIntensity={0.15}
          />
          <meshStandardMaterial
            attach="material-2"
            map={backFace}
            metalness={0.55}
            roughness={0.35}
            emissive="#3a2a08"
            emissiveIntensity={0.15}
          />
        </mesh>
      </Float>
    </group>
  );
};

/** Slow-drifting particle field — dust in the spotlight */
const ParticleField = ({ reduced }: { reduced: boolean }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 350;

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const gold = new THREE.Color("#d9a441");
    const magenta = new THREE.Color("#d2347a");
    const bone = new THREE.Color("#ede6da");
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1;
      const c = Math.random();
      const color = c < 0.4 ? gold : c < 0.7 ? magenta : bone;
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (reduced || !pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    pointsRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.3;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

const Scene = ({ reduced }: { reduced: boolean }) => (
  <>
    <ambientLight intensity={0.35} />
    {/* Gold key light + candy magenta rim light — the brand in 3D */}
    <pointLight position={[4, 3, 4]} intensity={38} color="#ffd98a" />
    <pointLight position={[-5, -2, 3]} intensity={22} color="#d2347a" />
    <pointLight position={[0, 4, -4]} intensity={14} color="#7c3aed" />
    <Coin reduced={reduced} />
    <ParticleField reduced={reduced} />
    {!reduced && (
      <Sparkles
        count={45}
        scale={[9, 6, 4]}
        size={2.2}
        speed={0.25}
        opacity={0.35}
        color="#ffd98a"
      />
    )}
  </>
);

/**
 * Full-viewport transparent 3D layer for the hero.
 * Pointer events pass through — it's pure atmosphere.
 */
const CoinHero3D = () => {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
      style={{ zIndex: 5 }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 42 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ pointerEvents: "none" }}
        eventSource={typeof document !== "undefined" ? document.body : undefined}
        frameloop={reduced ? "demand" : "always"}
      >
        <Suspense fallback={null}>
          <Scene reduced={reduced} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default CoinHero3D;
