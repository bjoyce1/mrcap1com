import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { CameraRail } from './path.js';
import { vinylMaterial, glowMaterial, beamMaterial, photoMaterial } from './materials.js';
import { recordLabel, textSprite, radial, GOLD, MAGENTA, VIOLET } from './textures.js';
import { WORDS, range, smooth, easeInOut, clamp, lerp } from '../core/timeline.js';
import { ALBUMS, SINGLES } from '../data/catalog.js';
import { GALLERY, TIMELINE } from '../data/content.js';

// Scene B — inside the record. One long flight down -Z through four chapters.

const TIMELINE_Z = [-192, -258]; // where the golden rail runs (camera covers it during the timeline station)

const PALETTE = [
  { u: 6, deep: '#1b0b27', haze: '#d9a441', haze2: '#5b31c9' },
  { u: 16.6, deep: '#150b32', haze: '#d12e7b', haze2: '#5b31c9' },
  { u: 25.2, deep: '#110906', haze: '#a8741c', haze2: '#4a1d5c' },
  { u: 33.2, deep: '#170512', haze: '#a82460', haze2: '#6a1830' },
];

export async function createUniverse({ envMap, tex, assets }) {
  const scene = new THREE.Scene();
  scene.environment = envMap;
  scene.environmentIntensity = 0.9;
  scene.fog = new THREE.FogExp2('#12081a', 0.0105);
  scene.background = new THREE.Color('#07040a');
  const clickables = [];
  const tickers = [];

  // ── sky: nebula shell that rides with the camera ──────────────────────────────
  const skyMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 }, uDeep: { value: new THREE.Color() }, uHaze: { value: new THREE.Color() },
      uHaze2: { value: new THREE.Color() }, uEnergy: { value: 0 },
    },
    vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uTime, uEnergy; uniform vec3 uDeep, uHaze, uHaze2; varying vec3 vDir;
      float h(vec3 p){ p = fract(p * 0.3183099 + .1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
      float n(vec3 x){ vec3 i = floor(x), f = fract(x); f = f*f*(3.-2.*f);
        return mix(mix(mix(h(i),h(i+vec3(1,0,0)),f.x), mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),f.x),f.y),
                   mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),f.x), mix(h(i+vec3(0,1,1)),h(i+vec3(1,1,1)),f.x),f.y), f.z); }
      float fbm(vec3 p){ float a = .5, s = 0.; for(int i=0;i<5;i++){ s += a*n(p); p *= 2.03; a *= .5; } return s; }
      void main(){
        vec3 d = normalize(vDir);
        float t = uTime * 0.012;
        float c1 = fbm(d * 2.4 + vec3(t, -t, t * .5));
        float c2 = fbm(d * 5.0 - vec3(t * 1.5, 0., t));
        float band = smoothstep(.35, .95, c1) * (.55 + .45 * c2);
        float ahead = smoothstep(-.2, 1., -d.z);
        vec3 col = uDeep;
        col += uHaze * band * .34 * (0.7 + ahead * .6) * (1. + uEnergy * .8);
        col += uHaze2 * smoothstep(.45, 1., c2) * .22;
        col += uHaze * pow(max(-d.z, 0.), 24.) * .25;
        gl_FragColor = vec4(col, 1.0);
        #include <colorspace_fragment>
      }`,
    side: THREE.BackSide, depthWrite: false, fog: false,
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(1500, 48, 24), skyMat);
  sky.renderOrder = -10;
  scene.add(sky);

  // ── stars ────────────────────────────────────────────────────────────────────
  const STARS = matchMedia('(pointer: coarse)').matches ? 2600 : 6000;
  const sPos = new Float32Array(STARS * 3), sCol = new Float32Array(STARS * 3), sSeed = new Float32Array(STARS);
  const palette = [new THREE.Color('#fff4e0'), new THREE.Color(GOLD), new THREE.Color(MAGENTA), new THREE.Color('#b9a6ff')];
  for (let i = 0; i < STARS; i++) {
    const r = 14 + Math.pow(Math.random(), 0.7) * 150, a = Math.random() * Math.PI * 2;
    sPos.set([Math.cos(a) * r, Math.sin(a) * r * 0.75, 40 - Math.random() * 980], i * 3);
    const c = palette[Math.random() < 0.72 ? 0 : Math.random() < 0.6 ? 1 : Math.random() < 0.6 ? 2 : 3];
    sCol.set([c.r, c.g, c.b], i * 3);
    sSeed[i] = Math.random();
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(sCol, 3));
  starGeo.setAttribute('seed', new THREE.BufferAttribute(sSeed, 1));
  const starMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uPx: { value: Math.min(devicePixelRatio, 2) }, uHigh: { value: 0 }, uSpeed: { value: 0 } },
    vertexShader: /* glsl */ `
      attribute vec3 color; attribute float seed; uniform float uTime, uPx, uHigh, uSpeed; varying vec3 vC; varying float vA;
      void main(){
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        float tw = .55 + .45 * sin(uTime * (1. + seed * 3.) + seed * 40.);
        gl_PointSize = (1.2 + seed * 2.6) * uPx * (1. + uHigh * 1.4) * (90. / -mv.z) * (1. + uSpeed * .6);
        gl_PointSize = clamp(gl_PointSize, 0., 14. * uPx);
        vA = tw * smoothstep(900., 120., -mv.z) * smoothstep(0., 6., -mv.z);
        vC = color;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `varying vec3 vC; varying float vA; void main(){ float d = length(gl_PointCoord - .5); float s = smoothstep(.5, 0., d); gl_FragColor = vec4(vC * (s * s * 1.6) * vA, 1.); }`,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false,
  });
  scene.add(new THREE.Points(starGeo, starMat));

  // ── camera-rig lights (light whatever is in front of us) ─────────────────────
  scene.add(new THREE.AmbientLight('#2a1838', 1.2));
  const rigKey = new THREE.PointLight('#ffd08a', 900, 0, 2);
  const rigRim = new THREE.PointLight(MAGENTA, 700, 0, 2);
  const rigFill = new THREE.PointLight(VIOLET, 400, 0, 2);
  scene.add(rigKey, rigRim, rigFill);

  // ── 1 · the groove tunnel ─────────────────────────────────────────────────────
  const tunnel = new THREE.Group();
  scene.add(tunnel);
  const grooveMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uBass: { value: 0 }, uFade: { value: 1 } },
    vertexShader: `varying vec2 vUv; varying float vZ; void main(){ vUv = uv; vZ = position.y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uTime, uBass, uFade; varying vec2 vUv; varying float vZ;
      void main(){
        float rings = pow(.5 + .5 * sin(vUv.y * 260. + uTime * 5.), 14.);
        float spokes = .55 + .45 * sin(vUv.x * 6.2831 * 18. + uTime * .5);
        float flow = .5 + .5 * sin(vUv.y * 24. - uTime * 2.4);
        vec3 gold = vec3(.85, .64, .26), mag = vec3(.82, .18, .48);
        vec3 col = mix(gold, mag, flow) * rings * spokes * (.12 + uBass * .45);
        float ends = smoothstep(0., .08, vUv.y) * smoothstep(1., .85, vUv.y);
        gl_FragColor = vec4(col * ends * uFade, 1.);
      }`,
    side: THREE.BackSide, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const groove = new THREE.Mesh(new THREE.CylinderGeometry(9, 9, 84, 64, 1, true), grooveMat);
  groove.rotation.x = Math.PI / 2;
  groove.position.z = -36;
  tunnel.add(groove);
  const rings = [];
  const ringCols = [GOLD, MAGENTA, '#f3d58a', VIOLET];
  for (let i = 0; i < 19; i++) {
    const r = 6.2 + (i % 3) * 0.5;
    const m = new THREE.Mesh(new THREE.TorusGeometry(r, i % 4 === 0 ? 0.07 : 0.035, 8, 128), glowMaterial(ringCols[i % 4], 0.9));
    m.position.z = -4 - i * 3.9;
    m.userData.base = r;
    rings.push(m);
    tunnel.add(m);
  }
  const exitRing = new THREE.Mesh(new THREE.TorusGeometry(15, 0.16, 8, 160), glowMaterial(MAGENTA, 1));
  exitRing.position.z = -82;
  tunnel.add(exitRing);

  // ── 2 · the chapter words ──────────────────────────────────────────────────────
  const font = new FontLoader().parse(assets.fontAnton);
  const wordMat = new THREE.MeshPhysicalMaterial({
    color: '#181020', metalness: 0.88, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.32,
    emissive: '#2a1206', emissiveIntensity: 0,
  });
  const words = WORDS.map((w) => buildWord(font, w, wordMat));
  words.forEach((w) => scene.add(w.group));

  // ── 3 · ORIGIN — floating memories + the golden timeline rail ─────────────────
  const gallery = new THREE.Group();
  scene.add(gallery);
  // mostly right of the path — the story cards live on the left
  const galleryLayout = [
    [6.6, 1.4, -160, -0.42], [10.5, -2.2, -172, -0.5], [5.8, -1.6, -184, -0.36],
    [-12, 4.2, -198, 0.55], [7.4, 1.2, -206, -0.35], [11.5, -1.8, -222, -0.45],
  ];
  const galleryMats = [];
  GALLERY.forEach((g, i) => {
    const [x, y, z, ry] = galleryLayout[i];
    const h = 4.6, w = h * g.w / g.h;
    const mat = photoMaterial(tex(g.src), { rim: i % 2 ? MAGENTA : GOLD });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
    m.position.set(x, y, z);
    m.rotation.y = ry;
    m.userData = { baseY: y, seed: i * 1.7 };
    gallery.add(m);
    galleryMats.push(m);
    const cap = textSprite(g.caption.toUpperCase(), { font: '"Space Mono", monospace', size: 58, color: '#ede4d3' });
    cap.scale.set(5, 2.5, 1);
    cap.position.set(x, y - h / 2 - 0.6, z);
    gallery.add(cap);
  });

  // timeline rail: gold tube with a glowing node per year
  const railPts = [];
  const [tz0, tz1] = TIMELINE_Z;
  for (let i = 0; i <= 24; i++) {
    const t = i / 24;
    railPts.push(new THREE.Vector3(3.4 + Math.sin(t * 5) * 0.8, -1.4 + Math.cos(t * 4) * 0.5, lerp(tz0 + 10, tz1 - 10, t)));
  }
  const railCurve = new THREE.CatmullRomCurve3(railPts);
  const railTube = new THREE.Mesh(new THREE.TubeGeometry(railCurve, 240, 0.045, 8), glowMaterial(GOLD, 0.95));
  scene.add(railTube);
  const nodes = TIMELINE.map((item, i) => {
    const t = 0.06 + (i / (TIMELINE.length - 1)) * 0.88;
    const p = railCurve.getPointAt(t);
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 24), glowMaterial(i === TIMELINE.length - 1 ? MAGENTA : '#ffd98a', 1));
    core.position.copy(p);
    const halo = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.6), new THREE.MeshBasicMaterial({ map: radial('rgba(217,164,65,0.9)'), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    halo.position.copy(p);
    const label = textSprite(item.year, { size: 210, sub: item.title, color: '#ede4d3' });
    label.position.copy(p).add(new THREE.Vector3(2.8, 1.5, 0));
    label.scale.set(6, 3, 1);
    scene.add(core, halo, label);
    return { core, halo, label, z: p.z };
  });

  // ── 4 · SOUND — EQ portal, drifting singles, the album carousel ───────────────
  const EQ_BARS = 128;
  const eq = new THREE.InstancedMesh(new THREE.BoxGeometry(0.16, 1, 0.16), new THREE.MeshBasicMaterial({ toneMapped: false }), EQ_BARS);
  eq.position.z = -348;
  const eqColor = new THREE.Color();
  for (let i = 0; i < EQ_BARS; i++) {
    eqColor.set(GOLD).lerp(new THREE.Color(MAGENTA), Math.abs(Math.sin((i / EQ_BARS) * Math.PI)));
    eq.setColorAt(i, eqColor.multiplyScalar(1.5));
  }
  scene.add(eq);
  const eqDummy = new THREE.Object3D();

  const singles = new THREE.Group();
  scene.add(singles);
  const singleMeshes = SINGLES.filter((s) => s.slug !== 'bet-on-her').map((s, i) => {
    const size = 2.3 + (i % 3) * 0.4;
    const mat = photoMaterial(tex(s.cover), { rim: i % 2 ? MAGENTA : GOLD });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size), mat);
    const side = i % 4 === 0 ? -1 : 1;
    m.position.set(side * (7 + (i % 5) * 1.6), -3.5 + ((i * 1.7) % 7), -340 - i * 3.6);
    m.rotation.y = -side * 0.4;
    m.userData = { baseY: m.position.y, seed: i * 2.3, track: s, hover: 0 };
    clickables.push(m);
    singles.add(m);
    return m;
  });
  const hero = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 6.4), photoMaterial(tex('/intro/img/covers/bet-on-her.webp'), { rim: GOLD }));
  hero.position.set(6.4, 0.4, -380);
  hero.rotation.y = -0.32;
  hero.userData = { baseY: 0.4, seed: 1, track: SINGLES.find((s) => s.slug === 'bet-on-her'), hover: 0 };
  clickables.push(hero);
  scene.add(hero);

  const CAROUSEL_Z = -440, CAROUSEL_R = 13;
  const carousel = new THREE.Group();
  carousel.position.set(0, 0.2, CAROUSEL_Z);
  scene.add(carousel);
  const sleeves = ALBUMS.map((a, i) => {
    const holder = new THREE.Group();
    const ang = (i / ALBUMS.length) * Math.PI * 2;
    holder.position.set(Math.sin(ang) * CAROUSEL_R, 0, Math.cos(ang) * CAROUSEL_R);
    holder.rotation.y = ang;
    carousel.add(holder);
    const coverTex = tex(a.cover);
    const sleeve = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), photoMaterial(coverTex, { rim: a.tone }));
    sleeve.position.z = 0.05;
    const recMat = vinylMaterial(coverTex, { labelR: 0.36, tint: a.tone, lightAngle: 1.2 });
    const rec = new THREE.Mesh(new THREE.CircleGeometry(1, 96), recMat); // vinyl shader works on a unit disc
    rec.scale.setScalar(2.85);
    rec.position.set(0, 0, -0.05);
    holder.add(rec, sleeve);
    sleeve.userData = { album: a, hover: 0, index: i };
    clickables.push(sleeve);
    return { holder, sleeve, rec, recMat, album: a };
  });

  // ── 5 · LEGACY — the gold coin, the ISM, the screening room ───────────────────
  const coinTex = tex('/intro/img/brand/cap-coin.webp');
  const coinFace = new THREE.MeshStandardMaterial({ map: coinTex, metalness: 0.75, roughness: 0.32, emissive: '#ffffff', emissiveMap: coinTex, emissiveIntensity: 0.18, transparent: true });
  const coinEdge = new THREE.MeshStandardMaterial({ color: GOLD, metalness: 1, roughness: 0.25 });
  const coin = new THREE.Mesh(new THREE.CylinderGeometry(3.3, 3.3, 0.36, 96), [coinEdge, coinFace, coinFace]);
  const coinGroup = new THREE.Group();
  coin.rotation.x = Math.PI / 2;
  coinGroup.add(coin);
  coinGroup.position.set(6.2, 0.6, -552);
  coinGroup.userData = { spin: 0 };
  coin.userData = { onClick: () => { coinGroup.userData.spin += Math.PI * 4; }, hover: 0 };
  clickables.push(coin);
  scene.add(coinGroup);
  const coinGlow = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), new THREE.MeshBasicMaterial({ map: radial('rgba(217,164,65,0.45)'), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  coinGlow.position.set(6.2, 0.6, -556);
  scene.add(coinGlow);

  const ismTitle = new THREE.Mesh(new THREE.PlaneGeometry(9, 6), new THREE.MeshBasicMaterial({ map: tex('/intro/img/ism/title.webp'), transparent: true, depthWrite: false, toneMapped: false }));
  ismTitle.position.set(6.6, 1.2, -580);
  ismTitle.rotation.y = -0.25;
  scene.add(ismTitle);

  const holoSrc = ['/intro/img/ism/nft-limitless.webp', '/intro/img/ism/nft-art-of-ism.webp', '/intro/img/ism/dippin-metaverse.webp', '/intro/img/story/the-life-documentary.webp'];
  const holoLayout = [[-9, 2.6, -566, 0.5], [8.5, -2.4, -592, -0.45], [-8.2, -2.2, -604, 0.45], [7.2, 1.0, -600, -0.3]];
  const holos = holoSrc.map((src, i) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 4.4), photoMaterial(tex(src), { holo: 1, rim: i % 2 ? MAGENTA : GOLD }));
    const [x, y, z, ry] = holoLayout[i];
    m.position.set(x, y, z); m.rotation.y = ry;
    m.userData = { baseY: y, seed: i * 3.1, hover: 0, href: i < 3 ? 'https://opensea.io/mrcap1/created' : 'https://www.pbs.org/show/the-life/' };
    clickables.push(m);
    scene.add(m);
    return m;
  });

  // floating cinema screen — the Limitless video, muted, loaded only when we get close
  const video = document.createElement('video');
  Object.assign(video, { muted: true, loop: true, playsInline: true, crossOrigin: 'anonymous', preload: 'none' });
  const videoTex = new THREE.VideoTexture(video);
  videoTex.colorSpace = THREE.SRGBColorSpace;
  const screenMat = new THREE.MeshBasicMaterial({ map: tex('/intro/img/videos/nojd0u9jBr0.jpg'), color: '#d6d6d6' });
  video.addEventListener('playing', () => { screenMat.map = videoTex; screenMat.needsUpdate = true; }, { once: true });
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(12.8, 7.2), screenMat);
  // off to the right of the flight path — the camera slides past its left edge
  screen.position.set(10.5, 1.2, -622);
  screen.rotation.y = -0.6;
  screen.userData = { hover: 0, video: 'nojd0u9jBr0' };
  clickables.push(screen);
  const screenFrame = new THREE.Mesh(new THREE.PlaneGeometry(13.3, 7.7), glowMaterial(MAGENTA, 0.55));
  screenFrame.position.copy(screen.position).add(new THREE.Vector3(0.05, 0, -0.05));
  screenFrame.rotation.y = screen.rotation.y;
  scene.add(screenFrame, screen);
  let videoArmed = false;

  // ── 6 · STAGE — spotlights, floor, merch in the light, the finale record ──────
  const stage = new THREE.Group();
  scene.add(stage);
  const floorMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uBass: { value: 0 } },
    vertexShader: `varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position,1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: /* glsl */ `
      uniform float uTime, uBass; varying vec3 vW;
      void main(){
        vec2 g = abs(fract(vW.xz * .25) - .5);
        float line = smoothstep(.03, 0., min(g.x, g.y));
        float d = length(vW.xz - vec2(0., -760.));
        float pool = smoothstep(60., 0., d);
        float pulse = .5 + .5 * sin(d * .35 - uTime * 3.);
        vec3 col = vec3(.85,.64,.26) * line * pool * (.35 + uBass * .9 * pulse) + vec3(.82,.18,.48) * pool * .05;
        gl_FragColor = vec4(col, 1.);
      }`,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const stageFloor = new THREE.Mesh(new THREE.PlaneGeometry(160, 160), floorMat);
  stageFloor.rotation.x = -Math.PI / 2;
  stageFloor.position.set(0, -6.5, -760);
  stage.add(stageFloor);
  const beams = [];
  const beamCols = [GOLD, MAGENTA, '#ffffff', VIOLET, GOLD, MAGENTA, '#f3d58a', MAGENTA];
  for (let i = 0; i < 8; i++) {
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 4.2, 30, 32, 1, true), beamMaterial(beamCols[i], 0.28));
    b.geometry.translate(0, -15, 0);
    b.position.set(-21 + i * 6, 16, -728 - (i % 3) * 18);
    b.userData = { seed: i * 1.37 };
    beams.push(b);
    stage.add(b);
  }
  const merchPicks = [1, 5, 12, 15, 19].map((n) => `/intro/img/merch/${String(n).padStart(2, '0')}.png`);
  const merchMeshes = merchPicks.map((src, i) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), new THREE.MeshBasicMaterial({ map: tex(src), color: '#c9c9c9', transparent: true, depthWrite: false }));
    m.position.set(i % 2 ? 7.5 : -8.2, -1 + (i % 3) * 1.4, -742 - i * 7);
    m.userData = { baseY: m.position.y, seed: i * 2.1, href: 'https://mrcap1.com/merch', hover: 0 };
    clickables.push(m);
    stage.add(m);
    return m;
  });
  const finaleMat = vinylMaterial(recordLabel(assets.logoImg), { labelR: 0.34, lightAngle: 1.1 });
  const finale = new THREE.Mesh(new THREE.CircleGeometry(1, 200), finaleMat);
  finale.scale.setScalar(17);
  finale.position.set(0, 3, -845);
  stage.add(finale);
  const finaleGlow = new THREE.Mesh(new THREE.PlaneGeometry(70, 70), new THREE.MeshBasicMaterial({ map: radial('rgba(209,46,123,0.5)'), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  finaleGlow.position.set(0, 3, -850);
  stage.add(finaleGlow);

  // ── camera rail ───────────────────────────────────────────────────────────────
  const rail = new CameraRail([]);
  function buildRail(aspect) {
    const fov = aspect < 0.9 ? 60 : 44;
    const tan = Math.tan(THREE.MathUtils.degToRad(fov / 2));
    // distance at which a word fills ~92% of the view width
    const fill = (w) => Math.max(18, w.width / (0.92 * 2 * tan * aspect));
    const [o, s, l, st] = words;
    const k = [];
    const key = (u, p, t, f = fov) => k.push({ u, p, t, fov: f });

    // tunnel
    key(6.0, [0, 0, 10], [0, 0, -30], fov + 6);
    key(7.0, [0, 0, -22], [0, 0, -70]);
    key(8.0, [0, 0.2, -58], [0, 0, -120]);
    // ORIGIN — through the O
    passThrough(o, fill(o));
    // gallery drift + timeline
    key(11.2, [-0.6, 0.4, -156], [2.5, 0, -186]);
    key(12.8, [0.4, 0.8, -176], [3.2, 0, -206]);
    key(13.8, [0.2, 0.4, -190], [3.4, -0.8, -214]);
    key(16.0, [0.6, 0.2, -248], [3.6, -1.2, -276]);
    // SOUND — through the O
    passThrough(s, fill(s));
    key(19.3, [-0.4, 0.2, -346], [1.5, 0, -376]);
    key(20.8, [-0.6, 0.3, -362], [3.0, 0.2, -392]);
    key(22.3, [0, 0.5, -386], [0, 0, -420]);
    const wallZ = aspect < 0.9 ? -409.5 : -414.5; // pull back on narrow screens so sleeve + record fit
    key(23.1, [0, 0.3, wallZ + 7.5], [0, -0.7, CAROUSEL_Z]);
    key(24.8, [0, 0.3, wallZ], [0, -0.7, CAROUSEL_Z]);
    // LEGACY — letters part around us
    passThrough(l, fill(l));
    key(28.0, [-0.6, 0.4, -532], [3.8, 0.3, -560]);
    key(29.4, [-0.4, 0.5, -556], [3.8, 0.6, -584]);
    key(30.9, [0, 0.3, -582], [2.0, 0, -610]);
    key(32.4, [-1.2, 0.5, -598], [8.5, 1.2, -624]);
    // STAGE — the curtain rises
    passThrough(st, fill(st));
    key(36.2, [0.8, 0.8, -722], [-1.5, 0.3, -752]);
    key(37.6, [-0.8, 1.0, -742], [1.8, 0.5, -772]);
    key(39.0, [0, 2.2, -770], [0, 3, -845]);
    key(40.0, [0, 2.8, -790], [0, 3, -845], fov - 4);
    rail.set(k);

    function passThrough(w, dFill) {
      const [uAppear, uFill, uPass, uDone] = w.def.u;
      const z = w.def.z;
      const [tx, ty] = w.target;
      key(uAppear, [0, 0.3, z + dFill + 38], [0, 0, z - 20]);
      key(uFill, [0, 0.2, z + dFill * 1.2], [0, 0, z]); // hold the whole word, centred
      key(lerp(uFill, uPass, 0.72), [tx * 0.9, ty * 0.9, z + dFill * 0.28], [tx, ty, z - 20]);
      key(uPass, [tx, ty, z - w.depth * 0.5], [tx, ty, z - 30]);
      key(uDone, [tx * 0.5, ty * 0.5 + 0.2, z - 12], [0, 0, z - 40]);
    }
  }
  buildRail(innerWidth / innerHeight);

  // ── per-frame ─────────────────────────────────────────────────────────────────
  const cA = new THREE.Color(), cB = new THREE.Color();
  const tmp = new THREE.Vector3(), fwd = new THREE.Vector3(), right = new THREE.Vector3();
  let lastCamZ = 0, speed = 0;

  function update(u, time, dt, audio, camera) {
    // zone palette
    let i = 0;
    while (i < PALETTE.length - 1 && u > PALETTE[i + 1].u) i++;
    const pA = PALETTE[i], pB = PALETTE[Math.min(i + 1, PALETTE.length - 1)];
    const f = pA === pB ? 0 : smooth(clamp((u - pB.u + 1.2) / 1.2));
    skyMat.uniforms.uDeep.value.copy(cA.set(pA.deep)).lerp(cB.set(pB.deep), f);
    skyMat.uniforms.uHaze.value.copy(cA.set(pA.haze)).lerp(cB.set(pB.haze), f);
    skyMat.uniforms.uHaze2.value.copy(cA.set(pA.haze2)).lerp(cB.set(pB.haze2), f);
    scene.fog.color.copy(skyMat.uniforms.uDeep.value).multiplyScalar(0.7);
    skyMat.uniforms.uTime.value = time;
    skyMat.uniforms.uEnergy.value = audio.energy;
    sky.position.copy(camera.position);

    speed += (Math.abs(camera.position.z - lastCamZ) / Math.max(dt, 1e-3) - speed) * 0.08;
    lastCamZ = camera.position.z;
    starMat.uniforms.uTime.value = time;
    starMat.uniforms.uHigh.value = audio.high;
    starMat.uniforms.uSpeed.value = clamp(speed / 60);

    // rig lights ride just ahead of the camera
    camera.getWorldDirection(fwd);
    right.crossVectors(fwd, camera.up).normalize();
    rigKey.position.copy(camera.position).addScaledVector(fwd, 10).addScaledVector(right, -9).add(tmp.set(0, 7, 0));
    rigRim.position.copy(camera.position).addScaledVector(fwd, 16).addScaledVector(right, 11).add(tmp.set(0, -2, 0));
    rigFill.position.copy(camera.position).addScaledVector(fwd, 4).add(tmp.set(0, -8, 0));
    rigKey.intensity = 900 + audio.bass * 900;

    // tunnel
    const tunnelOn = u < 9.2;
    tunnel.visible = tunnelOn;
    if (tunnelOn) {
      grooveMat.uniforms.uTime.value = time;
      grooveMat.uniforms.uBass.value = 0.25 + audio.bass;
      rings.forEach((r, j) => {
        const s = 1 + audio.bass * 0.18 * ((j % 3) + 1) / 2 + Math.sin(time * 1.4 + j) * 0.015;
        r.scale.setScalar(s);
        r.rotation.z = time * 0.1 * (j % 2 ? 1 : -1);
      });
      exitRing.scale.setScalar(1 + audio.bass * 0.1);
    }

    // words
    wordMat.emissiveIntensity = 0.15 + audio.energy * 0.9;
    words.forEach((w) => animateWord(w, u, time));

    // gallery
    const gOn = u > 9 && u < 17.5;
    gallery.visible = gOn;
    if (gOn) galleryMats.forEach((m) => {
      m.position.y = m.userData.baseY + Math.sin(time * 0.6 + m.userData.seed) * 0.25;
      m.rotation.z = Math.sin(time * 0.4 + m.userData.seed) * 0.02;
      m.material.uniforms.uOpacity.value = distFade(m, camera, 70, 6);
    });

    // timeline nodes: the one we're passing lights up
    nodes.forEach((n) => {
      const ahead = camera.position.z - n.z; // >0 when the node is in front of us
      const d = Math.abs(ahead - 8);
      const act = smooth(clamp(1 - d / 10));
      const near = smooth(clamp((34 - ahead) / 14)) * smooth(clamp((ahead + 2) / 4));
      n.core.scale.setScalar(1 + act * 1.2 + audio.bass * 0.4);
      n.halo.scale.setScalar(0.6 + act * 1.6);
      n.halo.material.opacity = (0.3 + act * 0.7) * near;
      n.label.material.opacity = (0.15 + act * 0.85) * near;
    });

    // EQ portal
    const eqOn = u > 17 && u < 21;
    eq.visible = eqOn;
    if (eqOn) {
      const bins = audio.bins;
      for (let j = 0; j < EQ_BARS; j++) {
        const a = (j / EQ_BARS) * Math.PI * 2;
        const mirror = j < EQ_BARS / 2 ? j : EQ_BARS - 1 - j;
        const v = bins ? bins[2 + mirror * 2] / 255 : 0.12 + 0.08 * Math.sin(time * 2 + j * 0.4);
        const h = 0.25 + v * 5.5;
        eqDummy.position.set(Math.cos(a) * (8.2 + h / 2), Math.sin(a) * (8.2 + h / 2), 0);
        eqDummy.rotation.set(0, 0, a - Math.PI / 2);
        eqDummy.scale.set(1, h, 1);
        eqDummy.updateMatrix();
        eq.setMatrixAt(j, eqDummy.matrix);
      }
      eq.instanceMatrix.needsUpdate = true;
      eq.rotation.z = time * 0.05;
    }

    // singles + the latest drop
    const sOn = u > 17 && u < 24;
    singles.visible = sOn; hero.visible = sOn;
    if (sOn) {
      singleMeshes.forEach((m) => {
        m.position.y = m.userData.baseY + Math.sin(time * 0.7 + m.userData.seed) * 0.4;
        m.rotation.x = Math.sin(time * 0.5 + m.userData.seed) * 0.08;
        m.material.uniforms.uOpacity.value = distFade(m, camera, 60, 4);
        hoverUniform(m, dt);
      });
      hero.position.y = 0.4 + Math.sin(time * 0.8) * 0.2;
      hero.material.uniforms.uOpacity.value = distFade(hero, camera, 70, 4);
      hoverUniform(hero, dt);
    }

    // album carousel — scroll turns the wheel; the front album is reported to the UI
    const cOn = u > 21.5 && u < 26;
    carousel.visible = cOn;
    let front = 0;
    if (cOn) {
      const wheel = carouselWheel(u);
      front = Math.round(wheel);
      carousel.rotation.y = -(wheel / ALBUMS.length) * Math.PI * 2;
      sleeves.forEach((s, j) => {
        const isFront = j === front;
        s.rec.position.x += ((isFront ? 2.4 : 0.6) + s.sleeve.userData.hover * 0.8 - s.rec.position.x) * Math.min(1, dt * 5);
        s.rec.rotation.z -= dt * (isFront ? 3.49 : 0.8);
        s.recMat.uniforms.uRot.value = -s.rec.rotation.z;
        s.recMat.uniforms.uTime.value = time;
        s.recMat.uniforms.uBass.value = isFront ? audio.bass : 0;
        s.recMat.uniforms.uGlow.value = isFront ? 0.15 + audio.bass * 0.4 : 0;
        hoverUniform(s.sleeve, dt);
      });
    }

    // coin
    const lOn = u > 25 && u < 33.5;
    coinGroup.visible = coinGlow.visible = ismTitle.visible = lOn;
    holos.forEach((h) => (h.visible = lOn));
    screen.visible = screenFrame.visible = lOn;
    if (lOn) {
      coinGroup.userData.spin *= 0.96;
      coinGroup.rotation.y = time * 0.6 + u * 1.4 + (Math.PI * 4 - coinGroup.userData.spin);
      coinGroup.position.y = 0.6 + Math.sin(time * 0.9) * 0.3;
      coinFace.emissiveIntensity = 0.15 + audio.energy * 0.35;
      coinGlow.material.opacity = 0.7 + audio.bass * 0.5;
      ismTitle.position.y = 1.2 + Math.sin(time * 0.7) * 0.2;
      holos.forEach((h) => {
        h.position.y = h.userData.baseY + Math.sin(time * 0.6 + h.userData.seed) * 0.3;
        h.material.uniforms.uTime.value = time;
        h.material.uniforms.uOpacity.value = distFade(h, camera, 60, 4);
        hoverUniform(h, dt);
      });
      if (!videoArmed && u > 28.5) {
        videoArmed = true;
        video.src = '/video/limitless-music-video.mp4';
        video.play().catch(() => {});
      }
      screenFrame.material.opacity = 0.35 + audio.bass * 0.5 + screen.userData.hover * 0.3;
      hoverUniformBasic(screen, dt);
    }
    if (videoArmed && (u < 28 || u > 34)) { if (!video.paused) video.pause(); } else if (videoArmed && video.paused && lOn) video.play().catch(() => {});

    // stage
    const stOn = u > 32.5;
    stage.visible = stOn;
    if (stOn) {
      floorMat.uniforms.uTime.value = time;
      floorMat.uniforms.uBass.value = audio.bass;
      beams.forEach((b) => {
        const s = b.userData.seed;
        b.rotation.z = Math.sin(time * 0.45 + s) * 0.55;
        b.rotation.x = Math.cos(time * 0.35 + s * 2) * 0.3;
        b.material.uniforms.uTime.value = time;
        b.material.uniforms.uStrength.value = 0.2 + audio.bass * 0.35;
      });
      merchMeshes.forEach((m) => {
        m.position.y = m.userData.baseY + Math.sin(time * 0.8 + m.userData.seed) * 0.35;
        m.rotation.y = Math.sin(time * 0.5 + m.userData.seed) * 0.35;
        m.scale.setScalar(1 + m.userData.hover * 0.08);
      });
      finale.rotation.z -= dt * 0.6;
      finaleMat.uniforms.uRot.value = -finale.rotation.z;
      finaleMat.uniforms.uTime.value = time;
      finaleMat.uniforms.uBass.value = audio.bass;
      finaleMat.uniforms.uGlow.value = 0.25 + range(u, 37.5, 40) * 0.6 + audio.bass * 0.4;
      finaleGlow.material.opacity = 0.6 + audio.energy * 0.6;
    }

    return { frontAlbum: front };
  }

  function dispose() { video.pause(); video.removeAttribute('src'); video.load(); }

  return { scene, rail, buildRail, update, clickables, dispose };
}

// ── helpers ──────────────────────────────────────────────────────────────────────

// Album wall: scroll is split into one segment per album; each album holds dead-centre
// for the first 75% of its segment, then the wheel turns to the next.
export const WALL_U = [23.2, 24.7];
export function carouselWheel(u) {
  const n = ALBUMS.length;
  const s = range(u, WALL_U[0], WALL_U[1]) * n;
  const k = Math.min(n - 1, Math.floor(s));
  return k >= n - 1 ? n - 1 : k + smooth(clamp((s - k - 0.75) / 0.25));
}
export const uForAlbum = (k) => WALL_U[0] + ((k + 0.375) / ALBUMS.length) * (WALL_U[1] - WALL_U[0]);

function buildWord(font, def, material) {
  const size = 12, depth = 4.2, tracking = 0.9;
  const group = new THREE.Group();
  const scale = size / font.data.resolution;
  const letters = [];
  let x = 0, maxH = 0;
  for (const ch of def.word) {
    const glyph = font.data.glyphs[ch];
    const geo = new TextGeometry(ch, {
      font, size, depth, curveSegments: 10,
      bevelEnabled: true, bevelThickness: 0.45, bevelSize: 0.22, bevelSegments: 5,
    });
    geo.computeBoundingBox();
    const bb = geo.boundingBox;
    const cx = (bb.min.x + bb.max.x) / 2, cy = (bb.min.y + bb.max.y) / 2, cz = (bb.min.z + bb.max.z) / 2;
    geo.translate(-cx, -cy, -cz);
    const mesh = new THREE.Mesh(geo, material);
    letters.push({ mesh, ch, x: x + cx, y: cy, w: bb.max.x - bb.min.x });
    maxH = Math.max(maxH, bb.max.y - bb.min.y);
    x += glyph.ha * scale + tracking;
  }
  const width = x - tracking;
  letters.forEach((l, i) => {
    l.home = new THREE.Vector3(l.x - width / 2, l.y - maxH / 2, 0);
    l.mesh.position.copy(l.home);
    l.side = i < letters.length / 2 ? -1 : 1;
    l.order = i;
    group.add(l.mesh);
  });
  group.position.z = def.z;
  // where the camera threads the word
  let target = [0, 0];
  if (def.through.length === 1) {
    const l = letters.find((q) => q.ch === def.through);
    target = [l.home.x, l.home.y];
  }
  return { group, letters, def, width, height: maxH, depth, target };
}

function animateWord(w, u, time) {
  const [uAppear, , uPass, uDone] = w.def.u;
  w.group.visible = u > uAppear - 1.2 && u < uDone + 0.8;
  if (!w.group.visible) return;
  const n = w.letters.length;
  if (w.def.through === 'split') {
    const s = easeInOut(range(u, uPass - 0.55, uPass + 0.1));
    w.letters.forEach((l) => {
      const outward = Math.abs(l.order - (n - 1) / 2) + 0.5;
      l.mesh.position.set(l.home.x + l.side * s * (6 + outward * 5), l.home.y + Math.sin(l.order * 1.3) * s * 3, l.home.z + s * 4);
      l.mesh.rotation.y = -l.side * s * 0.9;
    });
  } else if (w.def.through === 'rise') {
    w.letters.forEach((l) => {
      const s = easeInOut(range(u, uPass - 0.7 + l.order * 0.07, uPass + 0.05 + l.order * 0.07));
      l.mesh.position.set(l.home.x, l.home.y + s * 22, l.home.z);
      l.mesh.rotation.x = -s * 0.6;
    });
  } else {
    // breathe a little while we approach
    w.letters.forEach((l) => { l.mesh.position.y = l.home.y + Math.sin(time * 0.8 + l.order) * 0.08; });
  }
}

function distFade(mesh, camera, far, near) {
  const d = mesh.position.distanceTo(camera.position);
  const behind = mesh.position.z > camera.position.z + 2 ? 0 : 1;
  return smooth(clamp((far - d) / 25)) * smooth(clamp((d - near) / 4)) * behind;
}

function hoverUniform(m, dt) {
  const u = m.material.uniforms;
  if (!u) return;
  u.uHover.value += ((m.userData.hovered ? 1 : 0) - u.uHover.value) * Math.min(1, dt * 8);
  m.userData.hover = u.uHover.value;
}

function hoverUniformBasic(m, dt) {
  m.userData.hover += ((m.userData.hovered ? 1 : 0) - m.userData.hover) * Math.min(1, dt * 8);
}
