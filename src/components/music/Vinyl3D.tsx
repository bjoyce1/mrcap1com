import { useRef, useMemo, Suspense, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { usePlayerStore } from "@/stores/playerStore";
import defaultLabel from "@/assets/album-ties.webp";

/** Procedural groove texture — concentric rings drawn once on a canvas */
const useGrooveTexture = () => {
  return useMemo(() => {
    const size = 1024;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#151515";
    ctx.fillRect(0, 0, size, size);
    const cx = size / 2;
    for (let r = size * 0.18; r < size * 0.5; r += 3) {
      ctx.beginPath();
      ctx.arc(cx, cx, r, 0, Math.PI * 2);
      ctx.strokeStyle = Math.random() > 0.85 ? "#2e2e2e" : "#1d1d1d";
      ctx.lineWidth = 1.4;
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 8;
    return tex;
  }, []);
};

const Record = ({ labelUrl, spinning }: { labelUrl: string; spinning: boolean }) => {
  const discRef = useRef<THREE.Group>(null);
  const speed = useRef(0);
  const groove = useGrooveTexture();

  const [labelTex, setLabelTex] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    loader.load(
      labelUrl,
      (t) => {
        if (cancelled) return;
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = 8;
        setLabelTex(t);
      },
      undefined,
      () => {
        /* keep previous label on load error */
      }
    );
    return () => {
      cancelled = true;
    };
  }, [labelUrl]);

  useFrame((state, delta) => {
    if (!discRef.current) return;
    // Ease between idle drift and 33⅓ RPM playback spin
    const target = spinning ? 2.1 : 0.15;
    speed.current = THREE.MathUtils.lerp(speed.current, target, 0.03);
    discRef.current.rotation.y += delta * speed.current;
    // Gentle pointer tilt
    const px = state.pointer.x * 0.12;
    const py = state.pointer.y * 0.08;
    discRef.current.rotation.x = THREE.MathUtils.lerp(
      discRef.current.rotation.x,
      Math.PI / 2.45 + py,
      0.04
    );
    discRef.current.rotation.z = THREE.MathUtils.lerp(discRef.current.rotation.z, px, 0.04);
  });

  return (
    <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.35}>
      {/* Tilted like a record presented to the room */}
      <group ref={discRef} rotation={[Math.PI / 2.45, 0, 0]} position={[0.4, 0.55, 0]} scale={0.68}>
        {/* The disc */}
        <mesh>
          <cylinderGeometry args={[1.85, 1.85, 0.035, 96]} />
          <meshStandardMaterial
            attach="material-0"
            color="#0c0c0c"
            metalness={0.4}
            roughness={0.45}
          />
          <meshStandardMaterial
            attach="material-1"
            map={groove}
            color="#e8e8e8"
            metalness={0.75}
            roughness={0.32}
          />
          <meshStandardMaterial
            attach="material-2"
            map={groove}
            color="#e8e8e8"
            metalness={0.75}
            roughness={0.32}
          />
        </mesh>
        {/* The label — current track art */}
        <mesh position={[0, 0.021, 0]}>
          <cylinderGeometry args={[0.62, 0.62, 0.012, 64]} />
          <meshStandardMaterial attach="material-0" color="#d9a441" metalness={0.6} roughness={0.4} />
          <meshStandardMaterial
            attach="material-1"
            map={labelTex ?? undefined}
            color={labelTex ? "#ffffff" : "#d9a441"}
            metalness={0.1}
            roughness={0.6}
          />
          <meshStandardMaterial attach="material-2" color="#d9a441" metalness={0.6} roughness={0.4} />
        </mesh>
        {/* Spindle hole */}
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.02, 24]} />
          <meshStandardMaterial color="#050505" />
        </mesh>
      </group>
    </Float>
  );
};

/**
 * A 3D vinyl record floating in the Listening Room.
 * Spins up to speed while a track plays; drifts lazily when idle.
 * The label always shows the current track's cover art.
 */
const Vinyl3D = () => {
  const { currentTrack, isPlaying } = usePlayerStore();
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const labelUrl = currentTrack?.cover_art_url || defaultLabel;

  return (
    <div className="absolute inset-y-0 right-0 w-1/2 pointer-events-none hidden lg:block" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0.6, 5.2], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={reduced ? "demand" : "always"}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[3, 4, 3]} intensity={30} color="#ffd98a" />
          <pointLight position={[-4, -1, 2]} intensity={18} color="#d2347a" />
          <Record labelUrl={labelUrl} spinning={isPlaying && !reduced} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Vinyl3D;
