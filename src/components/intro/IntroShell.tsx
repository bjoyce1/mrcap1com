/** Branded placeholder shown for the instant between route render and the intro's own loader. */
const IntroShell = () => (
  <div
    aria-hidden="true"
    className="fixed inset-0 z-[99] flex flex-col items-center justify-center gap-6"
    style={{ background: "radial-gradient(circle at 50% 42%, #24112f, #120b19 70%)" }}
  >
    <img src="/intro/img/brand/cap-coin.webp" alt="" width={112} height={112} className="w-28 h-28 animate-spin [animation-duration:3.2s]" />
    <p style={{ font: "700 11.5px 'Space Mono', monospace", letterSpacing: ".24em", color: "hsl(270 8% 66%)" }}>PRESSING THE VINYL</p>
  </div>
);

export default IntroShell;
