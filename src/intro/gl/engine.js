import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const isTouch = matchMedia('(pointer: coarse)').matches;

// Quality tiers — we start optimistic and step down if the frame rate can't hold.
const TIERS = [
  { name: 'high', dpr: 2, bloom: true, bloomScale: 0.5 },
  { name: 'medium', dpr: 1.5, bloom: true, bloomScale: 0.35 },
  { name: 'low', dpr: 1, bloom: false, bloomScale: 0 },
];

export function createEngine(canvas, { signal } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', stencil: false });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  // Neutral keeps album art + photography true to colour while still rolling off highlights.
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;

  const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.02, 2600);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envMap = pmrem.fromScene(new RoomEnvironment(), 0.035).texture;
  pmrem.dispose();

  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(new THREE.Scene(), camera);
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.85, 0.55, 0.78);
  composer.addPass(renderPass);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  let tierIndex = isTouch ? 1 : 0;
  let tier = TIERS[tierIndex];

  function applyTier() {
    const dpr = Math.min(devicePixelRatio || 1, tier.dpr);
    renderer.setPixelRatio(dpr);
    composer.setPixelRatio(dpr);
    renderer.setSize(innerWidth, innerHeight, false);
    composer.setSize(innerWidth, innerHeight);
    bloom.enabled = tier.bloom;
    if (tier.bloom) bloom.resolution.set(innerWidth * dpr * tier.bloomScale, innerHeight * dpr * tier.bloomScale);
    document.documentElement.dataset.quality = tier.name;
  }

  function resize() {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    applyTier();
  }
  resize();
  addEventListener('resize', resize, { signal });

  // Frame-rate watchdog: sample 90 frames after warm-up; step down a tier if we're struggling.
  let samples = [], warm = 0, settled = false;
  function watch(dt) {
    if (settled) return;
    if (++warm < 45) return;
    samples.push(dt);
    if (samples.length < 90) return;
    const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
    samples = [];
    if (avg > 1 / 42 && tierIndex < TIERS.length - 1) {
      tier = TIERS[++tierIndex];
      applyTier();
    } else settled = true;
  }

  return {
    renderer, camera, envMap, bloom, composer,
    get tier() { return tier.name; },
    render(scene, dt) {
      renderPass.scene = scene;
      if (tier.bloom) composer.render(dt);
      else renderer.render(scene, camera);
      watch(dt);
    },
    resize,
    // Free every GPU resource the intro created, then drop the context so the
    // site's own three.js scenes start from a clean slate.
    dispose(scenes = []) {
      const textures = new Set();
      for (const scene of scenes) {
        scene.traverse((o) => {
          o.geometry?.dispose();
          const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
          for (const m of mats) {
            for (const v of Object.values(m)) if (v?.isTexture) textures.add(v);
            if (m.uniforms) for (const u of Object.values(m.uniforms)) if (u?.value?.isTexture) textures.add(u.value);
            m.dispose();
          }
        });
      }
      textures.add(envMap);
      textures.forEach((t) => t.dispose());
      composer.dispose?.();
      bloom.dispose?.();
      renderer.dispose();
      renderer.forceContextLoss();
      delete document.documentElement.dataset.quality;
    },
  };
}
