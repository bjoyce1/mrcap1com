import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { CameraRail } from './path.js';
import { vinylMaterial, beamMaterial } from './materials.js';
import { recordLabel, plaque, radial, GOLD, MAGENTA, VIOLET, PLUM } from './textures.js';
import { range, smooth, easeInOut, lerp, MOMENTS } from '../core/timeline.js';

// Scene A — "File No. 001": a turntable on a museum pedestal under a gold key light.
// The scroll lifts the tonearm, drops the needle, then dives the camera into the label.

export const RECORD_CENTER = new THREE.Vector3(-0.35, 0.395, 0);
const ARM_PIVOT = new THREE.Vector3(1.05, 0.47, -0.75);
const ARM_LEN = 1.55;
const PLAY_ANGLE = 0.47; // outer groove
const END_ANGLE = 0.76; // run-out groove

export function createBooth({ envMap, assets }) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(PLUM);
  scene.fog = new THREE.FogExp2(PLUM, 0.032);
  scene.environment = envMap;
  scene.environmentIntensity = 0.55;

  // ── lights
  scene.add(new THREE.AmbientLight('#3b2450', 1.1));
  const key = new THREE.SpotLight('#ffd49a', 120, 0, 0.42, 0.75, 2);
  key.position.set(0.2, 7.5, 1.2);
  key.target.position.copy(RECORD_CENTER);
  scene.add(key, key.target);
  const rim = new THREE.PointLight(MAGENTA, 24, 0, 2);
  rim.position.set(-3.6, 1.8, -2.6);
  const fill = new THREE.PointLight(VIOLET, 26, 0, 2);
  fill.position.set(3.8, 0.8, 2.8);
  scene.add(rim, fill);

  // ── floor + light pools
  const floor = new THREE.Mesh(new THREE.CircleGeometry(60, 64), new THREE.MeshStandardMaterial({ color: '#0f0914', roughness: 0.82, metalness: 0.1 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -3.2;
  scene.add(floor);
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(8.5, 7.5), new THREE.MeshBasicMaterial({ map: radial('rgba(0,0,0,0.9)'), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -3.19;
  const pool = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), new THREE.MeshBasicMaterial({ map: radial('rgba(217,164,65,0.28)'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  pool.rotation.x = -Math.PI / 2;
  pool.position.y = -3.18;
  scene.add(shadow, pool);

  // ── backdrop glows
  const glowGold = new THREE.Mesh(new THREE.PlaneGeometry(26, 26), new THREE.MeshBasicMaterial({ map: radial('rgba(217,164,65,0.55)'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
  glowGold.position.set(1.5, 2.5, -9);
  const glowMag = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.MeshBasicMaterial({ map: radial('rgba(209,46,123,0.35)'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
  glowMag.position.set(-9, 1, -11);
  scene.add(glowGold, glowMag);

  // ── the artist, standing behind his record
  const portraitMat = new THREE.ShaderMaterial({
    uniforms: { uMap: { value: assets.portrait }, uOpacity: { value: 1 }, uTime: { value: 0 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D uMap; uniform float uOpacity, uTime; varying vec2 vUv;
      void main(){
        vec4 c = texture2D(uMap, vUv);
        float o = 0.006;
        float n = min(min(texture2D(uMap, vUv + vec2(o,0.)).a, texture2D(uMap, vUv - vec2(o,0.)).a),
                      min(texture2D(uMap, vUv + vec2(0.,o)).a, texture2D(uMap, vUv - vec2(0.,o)).a));
        // rim only on the true silhouette — ignore faint alpha noise in the cut-out
        float edge = smoothstep(0.55, 0.95, c.a) * (1.0 - smoothstep(0.08, 0.6, n));
        vec3 rimCol = mix(vec3(0.82,0.18,0.48), vec3(1.0,0.78,0.36), smoothstep(0.25, 0.75, vUv.x));
        vec3 col = c.rgb * vec3(0.62, 0.56, 0.62) + rimCol * edge * 2.2;
        float fade = smoothstep(0.02, 0.42, vUv.y);
        gl_FragColor = vec4(col, c.a * fade * uOpacity);
        #include <colorspace_fragment>
      }`,
    transparent: true, depthWrite: false,
  });
  const portrait = new THREE.Mesh(new THREE.PlaneGeometry(6.6, 6.6), portraitMat);
  portrait.position.set(1.5, 0.55, -4.6);
  scene.add(portrait);

  // ── pedestal
  const lacquer = new THREE.MeshPhysicalMaterial({ color: '#1a1120', roughness: 0.32, metalness: 0.2, clearcoat: 1, clearcoatRoughness: 0.18 });
  const pedestal = new THREE.Mesh(new RoundedBoxGeometry(3.8, 3.2, 3.0, 6, 0.07), lacquer);
  pedestal.position.y = -1.6;
  scene.add(pedestal);
  const goldMetal = new THREE.MeshStandardMaterial({ color: GOLD, metalness: 1, roughness: 0.28, emissive: '#3a2605', emissiveIntensity: 0.4 });
  const trim = new THREE.Mesh(new THREE.BoxGeometry(3.84, 0.035, 3.04), goldMetal);
  trim.position.y = -0.03;
  const trimLow = trim.clone();
  trimLow.position.y = -3.12;
  scene.add(trim, trimLow);
  const plaqueTex = plaque();
  const plaqueMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2.9, 1.45),
    new THREE.MeshStandardMaterial({ map: plaqueTex, transparent: true, metalness: 0.9, roughness: 0.3, emissive: '#d9a441', emissiveMap: plaqueTex, emissiveIntensity: 0.35 }),
  );
  plaqueMesh.position.set(0, -1.35, 1.502);
  scene.add(plaqueMesh);

  // ── turntable body
  const table = new THREE.Group();
  scene.add(table);
  const body = new THREE.Mesh(new RoundedBoxGeometry(3.0, 0.3, 2.3, 5, 0.05), new THREE.MeshPhysicalMaterial({ color: '#0c0b10', roughness: 0.42, metalness: 0.35, clearcoat: 0.6, clearcoatRoughness: 0.35 }));
  body.position.y = 0.15;
  table.add(body);
  const brushed = new THREE.MeshStandardMaterial({ color: '#9a9aa2', metalness: 1, roughness: 0.22 });
  const platter = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.08, 96), brushed);
  platter.position.set(RECORD_CENTER.x, 0.34, 0);
  table.add(platter);

  // strobe dots around the platter edge
  const dots = new THREE.InstancedMesh(new THREE.BoxGeometry(0.018, 0.02, 0.01), new THREE.MeshBasicMaterial({ color: '#d6d6dc' }), 120);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), yAxis = new THREE.Vector3(0, 1, 0);
  for (let i = 0; i < 120; i++) {
    const a = (i / 120) * Math.PI * 2;
    q.setFromAxisAngle(yAxis, -a);
    m4.compose(new THREE.Vector3(Math.cos(a) * 1.101, 0, Math.sin(a) * 1.101), q, new THREE.Vector3(1, 1, 1));
    dots.setMatrixAt(i, m4);
  }
  const spinner = new THREE.Group();
  spinner.position.set(RECORD_CENTER.x, 0, 0);
  table.add(spinner);
  dots.position.y = 0.34;
  dots.position.x = 0;
  spinner.add(dots);

  // the record
  const label = recordLabel(assets.logoImg);
  const vinyl = vinylMaterial(label, { labelR: 0.34, lightAngle: 0.9 });
  const disc = new THREE.Mesh(new THREE.CircleGeometry(1, 160), vinyl);
  disc.rotation.x = -Math.PI / 2;
  disc.position.y = RECORD_CENTER.y;
  const discEdge = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.014, 128, 1, true), new THREE.MeshStandardMaterial({ color: '#050406', roughness: 0.3, metalness: 0.2 }));
  discEdge.position.y = RECORD_CENTER.y - 0.007;
  const spindle = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.06, 16), brushed);
  spindle.position.y = RECORD_CENTER.y + 0.02;
  spinner.add(disc, discEdge, spindle);

  // controls
  const btn = (w, d, x, z, mat) => { const b = new THREE.Mesh(new RoundedBoxGeometry(w, 0.035, d, 2, 0.01), mat); b.position.set(x, 0.31, z); table.add(b); return b; };
  btn(0.34, 0.2, -1.12, 0.88, brushed);
  btn(0.14, 0.09, -0.72, 0.93, brushed);
  btn(0.14, 0.09, -0.52, 0.93, brushed);
  const led = new THREE.Mesh(new THREE.SphereGeometry(0.022, 16, 16), new THREE.MeshBasicMaterial({ color: '#8a1018' }));
  led.position.set(-1.33, 0.33, 0.52);
  table.add(led);
  const slot = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.012, 0.78), new THREE.MeshBasicMaterial({ color: '#020203' }));
  slot.position.set(1.28, 0.302, 0.42);
  const knob = btn(0.16, 0.08, 1.28, 0.42, brushed);
  table.add(slot);

  // tonearm
  const armBase = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.12, 48), brushed);
  armBase.position.set(ARM_PIVOT.x, 0.36, ARM_PIVOT.z);
  table.add(armBase);
  const pivot = new THREE.Group();
  pivot.rotation.order = 'YXZ';
  pivot.position.copy(ARM_PIVOT);
  table.add(pivot);
  const chrome = new THREE.MeshStandardMaterial({ color: '#e6e6ee', metalness: 1, roughness: 0.12 });
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.024, ARM_LEN, 20), chrome);
  arm.rotation.x = Math.PI / 2;
  arm.position.z = ARM_LEN / 2;
  const head = new THREE.Mesh(new RoundedBoxGeometry(0.13, 0.03, 0.24, 2, 0.01), new THREE.MeshStandardMaterial({ color: '#1a1a1f', metalness: 0.6, roughness: 0.3 }));
  head.position.set(0, -0.005, ARM_LEN + 0.06);
  head.rotation.y = -0.35;
  const cart = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.05, 0.09), goldMetal);
  cart.position.set(0.01, -0.04, ARM_LEN + 0.08);
  const weight = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.24, 32), chrome);
  weight.rotation.x = Math.PI / 2;
  weight.position.z = -0.3;
  const hinge = new THREE.Mesh(new THREE.SphereGeometry(0.06, 20, 20), chrome);
  pivot.add(arm, head, cart, weight, hinge);

  // ── key-light beam + dust
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 2.6, 7.2, 48, 1, true), beamMaterial('#ffcf7a', 0.16));
  beam.position.set(RECORD_CENTER.x + 0.1, 3.9, 0.1);
  scene.add(beam);
  const dustCount = 160;
  const dustGeo = new THREE.BufferGeometry();
  const dustPos = new Float32Array(dustCount * 3);
  const dustSeed = new Float32Array(dustCount);
  for (let i = 0; i < dustCount; i++) {
    const r = Math.sqrt(Math.random()) * 1.9, a = Math.random() * Math.PI * 2;
    dustPos.set([RECORD_CENTER.x + Math.cos(a) * r, 0.5 + Math.random() * 6.5, Math.sin(a) * r], i * 3);
    dustSeed[i] = Math.random();
  }
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  dustGeo.setAttribute('seed', new THREE.BufferAttribute(dustSeed, 1));
  const dustMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uPx: { value: Math.min(devicePixelRatio, 2) } },
    vertexShader: /* glsl */ `
      attribute float seed; uniform float uTime, uPx; varying float vA;
      void main(){
        vec3 p = position;
        p.y = mod(p.y - uTime * (0.05 + seed * 0.08), 7.0) + 0.45;
        p.x += sin(uTime * 0.3 + seed * 20.0) * 0.12;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = (2.0 + seed * 3.0) * uPx * (6.0 / -mv.z);
        vA = 0.25 + 0.75 * fract(seed * 7.0 + uTime * 0.1);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `varying float vA; void main(){ float d = length(gl_PointCoord - .5); gl_FragColor = vec4(vec3(1.0,.85,.55) * smoothstep(.5,0.,d) * vA * .8, 1.0); }`,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const dust = new THREE.Points(dustGeo, dustMat);
  scene.add(dust);

  // ── camera rail (rebuilt on resize for portrait screens)
  const rail = new CameraRail([]);
  const C = RECORD_CENTER.toArray();
  const DOWN = [0, 0, -1];
  function buildRail(aspect) {
    const portraitMode = aspect < 0.9;
    rail.set([
      portraitMode
        ? { u: 0, p: [1.3, 4.4, 13.5], t: [-0.15, 2.9, 0], fov: 50 } // turntable sits low, under the headline
        : { u: 0, p: [3.9, 2.6, 9.4], t: [-2.35, 0.05, 0], fov: 40 },
      portraitMode
        ? { u: 1.3, p: [1.2, 3.8, 7.2], t: [-0.3, 0.1, 0], fov: 50 }
        : { u: 1.3, p: [2.1, 2.95, 4.9], t: [-0.55, 0.35, 0], fov: 40 },
      { u: 2.6, p: [0.55, 3.7, 2.4], t: [-0.35, 0.39, 0], fov: portraitMode ? 52 : 42 },
      { u: 4.2, p: [-0.28, 2.3, 0.5], t: C, up: DOWN, fov: 44 },
      { u: 5.6, p: [-0.35, 0.78, 0.02], t: C, up: DOWN, fov: 46 },
      { u: 6.0, p: [-0.35, 0.48, 0.004], t: C, up: DOWN, fov: 52 },
    ]);
  }
  buildRail(innerWidth / innerHeight);

  // ── per-frame
  let spin = 0;
  const tip = new THREE.Vector3();
  const state = { armAngle: 0, armLift: 0, needleDown: false };

  function update(u, time, dt, audio) {
    const playing = audio.playing;
    const lift = range(u, ...MOMENTS.needleLift);
    const drop = range(u, ...MOMENTS.needleDrop);
    let angle = easeInOut(lift) * PLAY_ANGLE;
    let raise = Math.sin(smooth(lift) * Math.PI) * 0.1 + (lift >= 1 ? (1 - smooth(drop)) * 0.06 : 0);
    if (playing) {
      angle = lerp(PLAY_ANGLE, END_ANGLE, audio.progress);
      raise = 0;
    }
    state.armAngle += (angle - state.armAngle) * Math.min(1, dt * 6);
    state.armLift += (raise - state.armLift) * Math.min(1, dt * 8);
    pivot.rotation.y = -state.armAngle;
    pivot.rotation.x = -state.armLift;
    state.needleDown = playing || drop >= 1;

    // 33⅓ rpm
    spin += dt * 3.49;
    spinner.rotation.y = -spin;
    vinyl.uniforms.uRot.value = spin;
    vinyl.uniforms.uTime.value = time;
    const dive = range(u, ...MOMENTS.dive);
    vinyl.uniforms.uGlow.value = dive * dive * 1.35 + audio.bass * 0.25;
    vinyl.uniforms.uBass.value = audio.bass;
    if (state.needleDown && state.armLift < 0.01) {
      tip.set(0, 0, ARM_LEN + 0.08).applyEuler(pivot.rotation).add(pivot.position);
      vinyl.uniforms.uNeedle.value = Math.hypot(tip.x - RECORD_CENTER.x, tip.z - RECORD_CENTER.z);
    } else vinyl.uniforms.uNeedle.value = -1;

    portraitMat.uniforms.uOpacity.value = 1 - smooth(range(u, 1.2, 2.8));
    portrait.position.y = 0.55 + Math.sin(time * 0.5) * 0.03;
    led.material.color.setRGB(0.55 + audio.bass * 0.4, 0.06, 0.08);
    key.intensity = 120 + audio.bass * 80;
    beam.material.uniforms.uTime.value = time;
    beam.material.uniforms.uStrength.value = 0.14 + audio.bass * 0.08 + dive * 0.15;
    dustMat.uniforms.uTime.value = time;
    glowGold.material.opacity = 0.85 + audio.energy * 0.4;
    knob.position.z = 0.42 + Math.sin(time * 0.2) * 0.005;
  }

  return { scene, rail, buildRail, update, state, recordCenter: RECORD_CENTER };
}
