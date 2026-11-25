let cached: boolean | null = null;

/** True when this browser can create a WebGL context. Cached after the first check. */
export function hasWebGL(): boolean {
  if (cached !== null) return cached;
  try {
    if (typeof window === "undefined" || typeof document === "undefined") return (cached = false);
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2") || c.getContext("webgl") || c.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    cached = !!gl;
    (gl?.getExtension("WEBGL_lose_context") as { loseContext?: () => void } | null)?.loseContext?.();
  } catch {
    cached = false;
  }
  return cached;
}
