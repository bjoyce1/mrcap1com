import { useRef, type CSSProperties } from "react";
import { useTraffic } from "./Marquee";
import { CITY_LANES } from "./traffic";

// The living Houston night behind the game: the city and its freeways on both sides with traffic, purple smoke,
// embers, searchlights and a plane crossing the sky. It stays in view while the page scrolls, and reacts to the real
// game through CSS on .legends-world's data-lg-stage / data-lg-level (stage.ts): traffic surges, the sky lights up, the
// searchlights swing and fireworks go up, more of each for bigger hits. Decoration only.
const art = (name: string) => `/games/spc-legends/marquee/${name}.webp`;

// Firework bursts: [left %, top %, colour, which hit level fires it first]. Level 1 sets off the first, 2 the first
// three, 3 all of them, each with its own delay.
const BURSTS: [number, number, string, number][] = [
  [10, 22, "#ffd76a", 1], [88, 18, "#ff63d2", 2], [24, 12, "#7ce7ff", 2], [76, 30, "#ffd76a", 3], [50, 9, "#c56bff", 3], [6, 38, "#ff8a3d", 3],
];

/** A set of firework bursts for a container; shared by the backdrop sky and the cabinet header. */
export function Fireworks({ bursts = BURSTS }: { bursts?: [number, number, string, number][] }) {
  return (
    <div className="lw-fireworks" aria-hidden="true">
      {bursts.map(([x, y, c, level], i) => (
        <span key={i} className={`lw-fw is-l${level}`} style={{ left: `${x}%`, top: `${y}%`, "--c": c, "--d": `${(i % 3) * 0.28 + (level - 1) * 0.12}s` } as CSSProperties}>
          {Array.from({ length: 12 }, (_, k) => <i key={k} style={{ "--a": `${k * 30}deg` } as CSSProperties} />)}
        </span>
      ))}
    </div>
  );
}

function City({ side }: { side: "left" | "right" }) {
  const traffic = useRef<HTMLDivElement>(null);
  useTraffic(traffic, CITY_LANES[side]);
  return (
    <div className={`lw-city is-${side}`}>
      <img src={art(`city-${side}`)} alt="" />
      <span className="lw-windows" />
      <div className="lw-traffic" ref={traffic} />
    </div>
  );
}

export function Backdrop() {
  return (
    <div className="lg-world" aria-hidden="true">
      <div className="lw-view">
        <span className="lw-glow" />
        <span className="lw-beam is-1" /><span className="lw-beam is-2" /><span className="lw-beam is-3" /><span className="lw-beam is-4" />
        <Fireworks />
        <i className="lw-plane"><b /></i>
        <City side="left" />
        <City side="right" />
        <div className="lw-smoke"><i /><i /><i /><i /></div>
        <div className="lw-embers">{Array.from({ length: 14 }, (_, i) => <i key={i} style={{ "--x": `${3 + ((i * 41) % 94)}%`, "--d": `${(i * 0.9) % 11}s`, "--s": `${9 + (i % 5) * 1.8}s` } as CSSProperties} />)}</div>
      </div>
    </div>
  );
}

/** The freeway skylines in the cabinet header's upper corners, with their own traffic. */
export function HeaderCity({ side }: { side: "left" | "right" }) {
  const traffic = useRef<HTMLDivElement>(null);
  useTraffic(traffic, CITY_LANES[side]);
  return (
    <span className={`ch-sky is-${side}`} aria-hidden="true">
      <img src={art(`city-${side}`)} alt="" />
      <span className="lw-windows" />
      <span className="lw-traffic" ref={traffic} />
    </span>
  );
}
