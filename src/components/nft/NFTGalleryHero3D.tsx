import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture, Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import nftLimitless from "@/assets/nft-limitless.webp";
import nftArtOfIsm from "@/assets/nft-art-of-ism.webp";
import dippinMetaverse from "@/assets/dippin-metaverse.webp";

interface ArtPiece {
  url: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  floatSpeed: number;
}

const PIECES: ArtPiece[] = [
  { url: nftLimitless, position: [0.2, 0.5, 0], rotation: [0, -0.28, 0], scale: 1.25, floatSpeed: 1.4 },
  { url: nftArtOfIsm, position: [-1.55, -0.35, -0.9], rotation: [0, 0.22, 0.02], scale: 0.9, floatSpeed: 1.1 },
  { url: dippinMetaverse, position: [1.75, -0.75, -1.2], rotation: [0, -0.45, -0.02], scale: 0.8, floatSpeed: 1.7 },
];

/** A gold-framed artwork floating in the gallery void */
const FramedArt = ({ piece }: { piece: ArtPiece }) => {
  const tex = useTexture(piece.url);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;

  return (
    <Float speed={piece.floatSpeed} rotationIntensity={0.12} floatIntensity={0.45}>
      <group position={piece.position} rotation={piece.rotation} scale={piece.scale}>
        {/* Gold frame */}
        <mesh position={[0, 0, -0.04]}>
          <boxGeometry args={[1.16, 1.16, 0.06]} />
          <meshStandardMaterial color="#d9a441" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* Canvas */}
        <mesh>
          <planeGeometry args={[1.04, 1.04]} />
          <meshStandardMaterial map={tex} roughness={0.55} metalness={0.05} />
        </mesh>
      </group>
    </Float>
  );
};

const GalleryScene = ({ reduced }: { reduced: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (reduced || !groupRef.current) return;
    // The whole gallery leans with the pointer — walking past the wall
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      state.pointer.x * 0.18,
      0.04
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -state.pointer.y * 0.08,
      0.04
    );
  });

  return (
    <group ref={groupRef} position={[0, -0.35, 0]} scale={1.12}>
      <ambientLight intensity={0.55} />
      <pointLight position={[2, 3, 4]} intensity={30} color="#ffd98a" />
      <pointLight position={[-3, -2, 3]} intensity={16} color="#d2347a" />
      {PIECES.map((piece, i) => (
        <FramedArt key={i} piece={piece} />
      ))}
      {!reduced && (
        <Sparkles count={40} scale={[7, 5, 4]} size={1.8} speed={0.2} opacity={0.3} color="#ffd98a" />
      )}
    </group>
  );
};

/**
 * Floating gallery of gold-framed NFT artworks for the /nft hero.
 * Desktop-only atmosphere layer; pointer events pass through.
 */
const NFTGalleryHero3D = () => {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div
      className="absolute inset-y-0 right-0 w-[46%] pointer-events-none hidden lg:block"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 4.6], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={reduced ? "demand" : "always"}
      >
        <Suspense fallback={null}>
          <GalleryScene reduced={reduced} />
        </Suspense>
      </Canvas>
      {/* Soft fade into the page edges */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
    </div>
  );
};

export default NFTGalleryHero3D;
