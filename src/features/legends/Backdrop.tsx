import { useRef, type CSSProperties } from "react";
import { useTraffic } from "./Marquee";
import { CITY_LANES, FREEWAY_LANES } from "./traffic";

// The living Houston night behind the game: the city, elevated I-45 / 610 Loop freeways with streaming headlights,
// tail-light trails and candy-painted H-Town SLABs, rolling purple Mixhouse smoke, skyline equalizer bars, searchlights,
// a night chopper and fireworks. It stays in view while the page scrolls, and reacts to both the spin state and the
// specific hit type (data-lg-stage / data-lg-level / data-lg-hit on .legends-world, set by stage.ts). Decoration only.
const art = (name: string) => `/games/spc-legends/marquee/${name}.webp`;

// Firework bursts: [left %, top %, colour, which hit level fires it first].
const BURSTS: [number, number, string, number][] = [
  [10, 22, "#ffd76a", 1],
  [90, 20, "#c084fc", 1],
  [88, 16, "#ff63d2", 2],
  [24, 12, "#7ce7ff", 2],
  [16, 32, "#ffd76a", 2],
  [82, 30, "#ff4fd8", 2],
  [76, 26, "#ffd76a", 3],
  [50, 9, "#c56bff", 3],
  [6, 38, "#ff8a3d", 3],
  [94, 36, "#38bdf8", 3],
];

/** A set of firework bursts for a container; shared by the backdrop sky and the cabinet header. */
export function Fireworks({ bursts = BURSTS }: { bursts?: [number, number, string, number][] }) {
  return (
    <div className="lw-fireworks" aria-hidden="true">
      {bursts.map(([x, y, c, level], i) => (
        <span
          key={i}
          className={`lw-fw is-l${level}`}
          style={{ left: `${x}%`, top: `${y}%`, "--c": c, "--d": `${(i % 4) * 0.22 + (level - 1) * 0.1}s` } as CSSProperties}
        >
          {Array.from({ length: 12 }, (_, k) => (
            <i key={k} style={{ "--a": `${k * 30}deg` } as CSSProperties} />
          ))}
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

function FreewayDeck() {
  const traffic = useRef<HTMLDivElement>(null);
  useTraffic(traffic, FREEWAY_LANES);
  return (
    <div className="lw-freeway">
      <div className="lw-fwy-signs">
        <span className="lw-fwy-sign is-left">
          <small>I-45 SOUTH</small>
          <b>MLK BLVD · SOUTH PARK</b>
        </span>
        <span className="lw-fwy-sign is-center">
          <small>610 SOUTH LOOP</small>
          <b>EXIT 713 · MIXHOUSE</b>
        </span>
        <span className="lw-fwy-sign is-right">
          <small>US-59 / I-69</small>
          <b>3RD WARD · 5TH WARD</b>
        </span>
      </div>
      <div className="lw-fwy-lamps">
        {Array.from({ length: 10 }, (_, i) => (
          <i key={i} style={{ left: `${5 + i * 10}%`, "--i": i } as CSSProperties} />
        ))}
      </div>
      <div className="lw-fwy-deck is-upper" />
      <div className="lw-fwy-deck is-lower" />
      <div className="lw-traffic is-freeway" ref={traffic} />
    </div>
  );
}

export function Backdrop() {
  return (
    <div className="lg-world" aria-hidden="true">
      <div className="lw-view">
        <span className="lw-glow" />
        <span className="lw-lightning" />
        <span className="lw-crown-pillar" />
        <div className="lw-sky-beacon">
          <b className="is-bonus">713 HOUSTON BONUS</b>
          <b className="is-double-wild">713 MIXHOUSE ×2 WILD</b>
          <b className="is-multiplier">TRUNK BASS MULTIPLIER</b>
          <b className="is-unity">SOUTH PARK COALITION UNITY</b>
          <b className="is-sweep">H-TOWN LEGEND SWEEP</b>
        </div>
        <span className="lw-beam is-1" />
        <span className="lw-beam is-2" />
        <span className="lw-beam is-3" />
        <span className="lw-beam is-4" />
        <span className="lw-beam is-5" />
        <span className="lw-beam is-6" />
        <Fireworks />
        <i className="lw-plane"><b /></i>
        <i className="lw-chopper"><b /><span /></i>
        <div className="lw-equalizer">
          {Array.from({ length: 28 }, (_, i) => (
            <i key={i} style={{ "--i": i, "--h": `${28 + ((i * 19) % 64)}%` } as CSSProperties} />
          ))}
        </div>
        <City side="left" />
        <City side="right" />
        <FreewayDeck />
        <div className="lw-shockwaves">
          <i className="is-1" />
          <i className="is-2" />
          <i className="is-3" />
        </div>
        <div className="lw-smoke">
          <i /><i /><i /><i /><i /><i />
        </div>
        <div className="lw-embers">
          {Array.from({ length: 18 }, (_, i) => (
            <i
              key={i}
              style={{
                "--x": `${2 + ((i * 37) % 96)}%`,
                "--d": `${(i * 0.75) % 10}s`,
                "--s": `${7.5 + (i % 5) * 1.5}s`,
              } as CSSProperties}
            />
          ))}
        </div>
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
