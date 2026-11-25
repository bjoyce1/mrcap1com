import { Component, Suspense, type ReactNode } from "react";
import { hasWebGL } from "@/lib/webgl";

class Boundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("3D layer failed, showing static fallback", error);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/** Mounts a 3D layer only when WebGL works; any load or render failure shows the fallback instead of blanking the page. */
const Safe3D = ({ fallback = null, children }: { fallback?: ReactNode; children: ReactNode }) => {
  if (!hasWebGL()) return <>{fallback}</>;
  return (
    <Boundary fallback={fallback}>
      <Suspense fallback={null}>{children}</Suspense>
    </Boundary>
  );
};

export default Safe3D;
