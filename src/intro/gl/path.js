import * as THREE from 'three';

// A camera rail keyed on scroll units. Each key: { u, p:[x,y,z], t:[x,y,z], fov?, up?:[x,y,z] }.
// Position and target are interpolated with Catmull-Rom between neighbouring keys so the
// camera never "parks" on a keyframe — it glides through them like a dolly on a track.
export class CameraRail {
  constructor(keys) {
    this.set(keys);
    this._a = new THREE.Vector3();
    this._b = new THREE.Vector3();
  }

  set(keys) {
    this.keys = keys.map((k) => ({
      u: k.u,
      p: new THREE.Vector3(...k.p),
      t: new THREE.Vector3(...k.t),
      fov: k.fov ?? null,
      hold: k.hold ?? 0,
      up: new THREE.Vector3(...(k.up || [0, 1, 0])).normalize(),
    }));
  }

  get start() { return this.keys[0].u; }
  get end() { return this.keys[this.keys.length - 1].u; }

  // Writes into out = { p: Vector3, t: Vector3, up: Vector3, fov }
  sample(u, out) {
    const k = this.keys;
    if (u <= k[0].u) return this._copy(k[0], out);
    if (u >= k[k.length - 1].u) return this._copy(k[k.length - 1], out);
    let i = 0;
    while (i < k.length - 2 && u > k[i + 1].u) i++;
    const k0 = k[Math.max(0, i - 1)], k1 = k[i], k2 = k[i + 1], k3 = k[Math.min(k.length - 1, i + 2)];
    // hold-and-whip: ease in/out around "hold" keys so the camera lingers on a card, then rips to the next
    const s0 = (u - k1.u) / (k2.u - k1.u), h = Math.max(k1.hold, k2.hold);
    const e = s0 < 0.5 ? 4 * s0 * s0 * s0 : 1 - Math.pow(-2 * s0 + 2, 3) / 2;
    const s = s0 + (e - s0) * h;
    catmull(k0.p, k1.p, k2.p, k3.p, s, out.p);
    catmull(k0.t, k1.t, k2.t, k3.t, s, out.t);
    out.up.copy(k1.up).lerp(k2.up, s * s * (3 - 2 * s)).normalize();
    const f1 = k1.fov ?? 42, f2 = k2.fov ?? f1;
    out.fov = f1 + (f2 - f1) * s;
    return out;
  }

  _copy(k, out) {
    out.p.copy(k.p); out.t.copy(k.t); out.up.copy(k.up); out.fov = k.fov ?? 42;
    return out;
  }
}

function catmull(p0, p1, p2, p3, t, out) {
  const t2 = t * t, t3 = t2 * t;
  for (const c of ['x', 'y', 'z']) {
    out[c] = 0.5 * ((2 * p1[c]) + (-p0[c] + p2[c]) * t + (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * t2 + (-p0[c] + 3 * p1[c] - 3 * p2[c] + p3[c]) * t3);
  }
  return out;
}

export const railSample = () => ({ p: new THREE.Vector3(), t: new THREE.Vector3(), up: new THREE.Vector3(0, 1, 0), fov: 42 });
