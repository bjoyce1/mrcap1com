import { useEffect, type RefObject } from "react";
import logo from "./assets/spc-legends-logo.png.asset.json";
import { runTraffic, type Lane } from "./traffic";

// The hero logo: the approved transparent crown and ribbons artwork, scaled proportionally. Backdrop reuses useTraffic.

/** Runs traffic.ts lanes in the host element for as long as the component is mounted. */
export function useTraffic(host: RefObject<HTMLElement>, lanes: Lane[]) {
  useEffect(() => (host.current ? runTraffic(host.current, lanes) : undefined), [host, lanes]);
}

export function Marquee() {
  return (
    <div className="mq-logo">
      <h1 className="lg-sr">SPC Legends: Spin the Mix</h1>
      <img src={logo.url} alt="SPC Legends: Spin the Mix, 713 Mixhouse and South Park Coalition" width={1672} height={941} decoding="async" />
    </div>
  );
}
