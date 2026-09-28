import * as THREE from 'three';

// ── Vinyl ─────────────────────────────────────────────────────────────────────
// Drawn on a unit circle (CircleGeometry radius 1). Grooves, track gaps, the classic
// two-lobed sheen that stays put while the disc spins, a centre label, and a gold
// "groove light" that swells as the camera dives in and pulses with the bass.
export function vinylMaterial(label, opts = {}) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uLabel: { value: label },
      uHasLabel: { value: label ? 1 : 0 },
      uLabelR: { value: opts.labelR ?? 0.34 },
      uRot: { value: 0 },
      uTime: { value: 0 },
      uGlow: { value: 0 },
      uBass: { value: 0 },
      uNeedle: { value: -1 },
      uLightAngle: { value: opts.lightAngle ?? 0.6 },
      uTint: { value: new THREE.Color(opts.tint ?? '#d9a441') },
      uTint2: { value: new THREE.Color(opts.tint2 ?? '#d12e7b') },
    },
    vertexShader: /* glsl */ `
      varying vec2 vP;
      void main() {
        vP = position.xy;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D uLabel;
      uniform float uHasLabel, uLabelR, uRot, uTime, uGlow, uBass, uNeedle, uLightAngle;
      uniform vec3 uTint, uTint2;
      varying vec2 vP;

      float hash(float n) { return fract(sin(n) * 43758.5453); }

      void main() {
        float r = length(vP);
        if (r > 1.0) discard;
        float a = atan(vP.y, vP.x);

        // label (rotates with the mesh — sampled in mesh space)
        if (r < uLabelR) {
          vec2 uv = vP / uLabelR * 0.5 + 0.5;
          vec3 lab = uHasLabel > 0.5 ? texture2D(uLabel, uv).rgb : vec3(0.06, 0.03, 0.05);
          lab *= 0.84 * (1.0 + uGlow * 0.08); // album art labels stay under the bloom threshold
          gl_FragColor = vec4(lab, 1.0);
          #include <colorspace_fragment>
          return;
        }

        // grooves: fine rings + subtle per-band variation
        float fr = r * 1400.0;
        float fine = 0.5 + 0.5 * sin(fr) * (1.0 - smoothstep(1.0, 3.0, fwidth(fr)));
        float band = hash(floor(r * 38.0));
        // track gaps: brighter, smoother rings between songs
        float gaps = 0.0;
        for (int i = 0; i < 5; i++) {
          float gr = 0.44 + float(i) * 0.105 + hash(float(i) * 7.1) * 0.02;
          gaps += smoothstep(0.006, 0.0, abs(r - gr));
        }
        float lead = smoothstep(0.965, 0.975, r) * (1.0 - smoothstep(0.99, 1.0, r));

        // the sheen: two opposing lobes fixed in world space (counter-rotate by uRot)
        float wa = a + uRot - uLightAngle;
        // (values are linear — keep the wax genuinely black between the highlights)
        float lobes = pow(abs(cos(wa)), 26.0) * 0.8 + pow(abs(cos(wa)), 6.0) * 0.05;
        float grooveSpec = lobes * (0.3 + 0.7 * fine) * (0.7 + 0.3 * band);

        vec3 base = vec3(0.0035, 0.003, 0.0045) + band * 0.0015;
        vec3 col = base + vec3(0.42, 0.4, 0.46) * grooveSpec * 0.32 + vec3(0.07) * gaps * (0.25 + lobes) + vec3(0.04) * lead;

        // groove light: gold/magenta rings that ripple outward as you dive in / as the bass hits
        float rp = r * 90.0;
        float ripple = 0.5 + 0.5 * sin(rp - uTime * 3.0) * (1.0 - smoothstep(1.0, 3.0, fwidth(rp)));
        float glow = uGlow * (0.35 + 0.65 * ripple) * (0.4 + 0.6 * fine);
        vec3 gcol = mix(uTint, uTint2, 0.5 + 0.5 * sin(a * 2.0 + uTime * 0.4 + r * 6.0));
        col += gcol * glow * 1.6;
        col += uTint * uBass * 0.35 * fine * smoothstep(0.35, 1.0, r);

        // needle track: a thin hot ring where the stylus sits
        if (uNeedle > 0.0) col += uTint * smoothstep(0.012, 0.0, abs(r - uNeedle)) * 1.2;

        gl_FragColor = vec4(col, 1.0);
        #include <colorspace_fragment>
      }`,
  });
}

// ── Additive glow ring (tunnel frames, portals) ─────────────────────────────────
export function glowMaterial(color, opacity = 1) {
  return new THREE.MeshBasicMaterial({
    color: new THREE.Color(color).multiplyScalar(1.6),
    transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
  });
}

// ── Light cone (stage spots, pedestal key light) ──────────────────────────────
export function beamMaterial(color, strength = 0.5) {
  return new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(color) }, uStrength: { value: strength }, uTime: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec2 vUv; varying vec3 vN; varying vec3 vV;
      void main() {
        vUv = uv;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * normal);
        vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor; uniform float uStrength, uTime; varying vec2 vUv; varying vec3 vN; varying vec3 vV;
      void main() {
        float along = smoothstep(0.0, 0.25, vUv.y) * (1.0 - vUv.y * 0.15) * (1.0 - smoothstep(0.82, 1.0, vUv.y));
        float edge = pow(abs(dot(vN, vV)), 1.6);
        float dust = 0.85 + 0.15 * sin(vUv.y * 40.0 + uTime * 2.0);
        gl_FragColor = vec4(uColor * uStrength * along * edge * dust, 1.0);
      }`,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false,
  });
}

// ── Photo plane with a soft fade + rim (gallery frames, NFT holograms) ─────────
export function photoMaterial(map, { holo = 0, rim = '#d9a441', key = 0 } = {}) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: map }, uOpacity: { value: 1 }, uTime: { value: 0 }, uHolo: { value: holo },
      uRim: { value: new THREE.Color(rim) }, uHover: { value: 0 }, uKey: { value: key },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D uMap; uniform float uOpacity, uTime, uHolo, uHover, uKey; uniform vec3 uRim; varying vec2 vUv;
      void main() {
        vec4 c = texture2D(uMap, vUv);
        c.rgb *= 0.84; // keep bright photos just under the bloom threshold
        vec2 d = min(vUv, 1.0 - vUv);
        float edge = min(d.x, d.y);
        float rim = smoothstep(0.012, 0.0, edge) * (1.0 - uKey);
        vec3 col = c.rgb;
        if (uHolo > 0.0) {
          float scan = 0.92 + 0.08 * sin(vUv.y * 320.0 + uTime * 4.0);
          float sweep = smoothstep(0.08, 0.0, abs(fract(vUv.y * 0.5 - uTime * 0.12) - 0.5) - 0.42);
          col = col * scan + uRim * sweep * 0.25 * uHolo;
        }
        col = mix(col, uRim * 1.4, rim * (0.8 + uHover * 0.6));
        col *= 1.0 + uHover * 0.12;
        float a = c.a;
        if (uKey > 0.0) { vec3 bg = texture2D(uMap, vec2(0.015, 0.985)).rgb * 0.84; a *= mix(1.0, smoothstep(0.04, 0.14, distance(c.rgb, bg)), uKey); }
        gl_FragColor = vec4(col, a * uOpacity);
        #include <colorspace_fragment>
      }`,
    transparent: true,
  });
}
