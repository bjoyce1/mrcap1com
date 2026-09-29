import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const isTouch = matchMedia('(pointer: coarse)').matches;

// Quality tiers — start optimistic, step down while the visitor is actually in the heavy scenes.
const TIERS = [
  { name: 'high', dpr: 2, bloom: true, bloomScale: 0.5, taps: 8 },
  { name: 'medium', dpr: 1.5, bloom: true, bloomScale: 0.35, taps: 4 },
  { name: 'low', dpr: 1, bloom: false, bloomScale: 0, taps: 1 },
];

// ── The lens: grade, radial chromatic aberration, speed streaks, vignette, grain, flash ──
// Runs after OutputPass (display space) and is the last thing drawn to screen.
const FilmShader = {
  uniforms: {
    tDiffuse: { value: null }, uTime: { value: 0 }, uSpeed: { value: 0 }, uPunch: { value: 0 },
    uFlash: { value: 0 }, uAspect: { value: 1 }, uTaps: { value: 8 }, uGrain: { value: 0.05 },
    uScrew: { value: 0 }, uWobble: { value: 1 }, // chopped & screwed: syrup grade + tape wobble while held
  },
  vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse; uniform float uTime, uSpeed, uPunch, uFlash, uAspect, uTaps, uGrain, uScrew, uWobble; varying vec2 vUv;
    float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    void main(){
      float sw = uScrew * uWobble;
      vec2 c = vUv - 0.5 + vec2(sin(vUv.y * 9.0 + uTime * 1.7), cos(vUv.x * 7.0 + uTime * 1.3)) * 0.0024 * sw;
      float r = length(c * vec2(uAspect, 1.0));
      float s = uSpeed * 0.045 + uFlash * 0.16;                 // zoom-streak length
      float ca = 0.0011 + uPunch * 0.006 + uSpeed * 0.004 + sw * 0.0035;      // chromatic spread
      int N = s > 0.002 ? int(uTaps) : 1;
      vec3 col = vec3(0.0);
      for (int i = 0; i < 8; i++) {
        if (i >= N) break;
        float z = 1.0 - s * float(i) / 7.0;
        col.r += texture2D(tDiffuse, 0.5 + c * z * (1.0 + ca)).r;
        col.g += texture2D(tDiffuse, 0.5 + c * z).g;
        col.b += texture2D(tDiffuse, 0.5 + c * z * (1.0 - ca)).b;
      }
      col /= float(N);
      if (uScrew > 0.001) {
        vec3 echo = texture2D(tDiffuse, 0.5 + c * (1.0 - 0.022 * sw) + vec2(0.005, -0.002) * sw).rgb; // syrup double image
        col = mix(col, max(col, echo * 0.92), 0.6 * uScrew);
        col = mix(col, col * vec3(0.9, 0.7, 1.16) + vec3(0.018, 0.0, 0.036), 0.8 * uScrew);          // the purple lean
      }
      float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
      col *= mix(vec3(0.95, 0.88, 1.05), vec3(1.04, 0.99, 0.91), smoothstep(0.15, 0.8, l)); // aubergine lows, gold highs
      col *= 1.0 - smoothstep(0.45, 1.05, r) * (0.55 + 0.25 * uScrew);                                        // vignette
      col = mix(col, vec3(1.0, 0.95, 0.86), uFlash * uFlash);                               // the scene-cut flash
      col += (hash(vUv * 1733.0 + fract(uTime * 7.31) * 91.0) - 0.5) * uGrain * (1.0 - l);  // grain
      gl_FragColor = vec4(col, 1.0);
    }`,
};

// Brand-coloured studio light for chrome, gold and lacquer (instead of a grey room).
function brandEnvScene() {
  const env = new THREE.Scene();
  const disposables = [];
  const add = (geo, mat, setup) => { const m = new THREE.Mesh(geo, mat); setup?.(m); env.add(m); disposables.push(geo, mat); };
  add(new THREE.BoxGeometry(20, 20, 20), new THREE.MeshBasicMaterial({ color: '#0a0610', side: THREE.BackSide }));
  const strip = (w, h, hex, k, x, y, z) => add(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(hex).multiplyScalar(k), side: THREE.DoubleSide }),
    (m) => { m.position.set(x, y, z); m.lookAt(0, 0, 0); },
  );
  strip(12, 2.2, '#ffd49a', 7, 0, 8, 3);   // gold key softbox overhead
  strip(1.2, 14, '#d12e7b', 6, -9, 0, -3); // magenta rim, left
  strip(1.2, 14, '#5b31c9', 5, 9, 0, -3);  // violet rim, right
  strip(14, 1, '#ede4d3', 2.5, 0, -6, 7);  // cream floor bounce
  return { env, dispose: () => disposables.forEach((d) => d.dispose()) };
}

export function createEngine(canvas, { signal, onContextLost, onContextRestored } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', stencil: false });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  // Neutral keeps album art + photography true to colour while still rolling off highlights.
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;

  const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.02, 2600);

  const envs = {};
  function buildEnvs() {
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    envs.room = pmrem.fromScene(room, 0.035).texture;
    room.dispose();
    const brand = brandEnvScene();
    envs.brand = pmrem.fromScene(brand.env, 0.02).texture;
    brand.dispose();
    pmrem.dispose();
    return envs;
  }
  buildEnvs();

  // MSAA lives on the composer's target (the default framebuffer's antialias is unused once we post-process).
  const msaa = Math.min(devicePixelRatio || 1, 2) >= 2 ? 0 : 4;
  const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: msaa }));
  const renderPass = new RenderPass(new THREE.Scene(), camera);
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.85, 0.55, 0.78);
  const film = new ShaderPass(FilmShader);
  composer.addPass(renderPass);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  composer.addPass(film);

  let tierIndex = isTouch ? 1 : 0;
  let tier = TIERS[tierIndex];
  let w = 0, h = 0;

  const api = {
    renderer, camera, bloom, composer, film, envs, pixelRatio: 1,
    get envMap() { return envs.room; },
    get tier() { return tier.name; },
    render(scene, dt, active = true) {
      renderPass.scene = scene;
      composer.render(dt);
      watch(dt, active);
    },
    // Compile against the composer's target (tone mapping / colour space are part of the program key)
    async compile(scenes) {
      renderer.setRenderTarget(composer.readBuffer);
      for (const s of scenes) await renderer.compileAsync(s, camera);
      renderer.setRenderTarget(null);
    },
    resize,
    // Free every GPU resource the intro created, then drop the context.
    dispose(scenes = []) {
      ro.disconnect();
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
      textures.add(envs.room);
      textures.add(envs.brand);
      textures.forEach((t) => t.dispose());
      composer.dispose?.();
      bloom.dispose?.();
      film.dispose?.();
      renderer.dispose();
      renderer.forceContextLoss();
      delete document.documentElement.dataset.quality;
    },
  };

  function applyTier() {
    const dpr = Math.min(devicePixelRatio || 1, tier.dpr);
    renderer.setPixelRatio(dpr);
    composer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    bloom.enabled = tier.bloom;
    // UnrealBloomPass halves whatever it is given — size it from CSS pixels so retina doesn't pay 4×
    if (tier.bloom) bloom.setSize(w * tier.bloomScale * 2, h * tier.bloomScale * 2);
    film.uniforms.uTaps.value = tier.taps;
    film.uniforms.uAspect.value = w / h;
    document.documentElement.dataset.quality = tier.name;
    api.pixelRatio = dpr;
  }

  function resize() {
    // the canvas is sized in lvh, so a mobile URL bar sliding in/out doesn't reallocate every target
    const cw = canvas.clientWidth || innerWidth, ch = canvas.clientHeight || innerHeight;
    if (cw === w && ch === h) return;
    w = cw; h = ch;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    applyTier();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  // Frame-rate watchdog — only measures while the visitor is actually in the experience.
  let acc = 0, n = 0, cool = 0;
  function watch(dt, active) {
    if (!active || tierIndex === TIERS.length - 1) { acc = n = 0; return; }
    if (cool > 0) { cool--; return; }
    acc += dt;
    if (++n < 120) return;
    const avg = acc / n;
    acc = n = 0;
    if (avg > 1 / 45) { tier = TIERS[++tierIndex]; applyTier(); cool = 90; }
  }

  // Context loss (mobile memory pressure): the host decides; rebuild env maps if it comes back.
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); onContextLost?.(); }, { signal });
  canvas.addEventListener('webglcontextrestored', () => { buildEnvs(); onContextRestored?.(envs); }, { signal });

  resize();
  return api;
}
