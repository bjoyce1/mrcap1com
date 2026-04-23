import { useEffect, useRef } from "react";
import { useAudioAnalyzerStore } from "@/stores/audioAnalyzerStore";

interface AudioWaveformProps {
  audioEl: HTMLAudioElement | null;
  active: boolean;
  bars?: number;
}

const AudioWaveform = ({ audioEl, active, bars = 32 }: AudioWaveformProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);
  const connect = useAudioAnalyzerStore((s) => s.connect);
  const startLoop = useAudioAnalyzerStore((s) => s.startLoop);
  const stopLoop = useAudioAnalyzerStore((s) => s.stopLoop);

  // Connect audio when available
  useEffect(() => {
    if (audioEl) connect(audioEl);
  }, [audioEl, connect]);

  // Start/stop analyzer loop based on active state
  useEffect(() => {
    if (active) startLoop();
    else stopLoop();
  }, [active, startLoop, stopLoop]);

  // Render loop reading from store
  useEffect(() => {
    const tick = () => {
      const data = useAudioAnalyzerStore.getState().frequencyData;
      const len = data.length;
      if (len > 0) {
        for (let i = 0; i < bars; i++) {
          const idx = Math.floor((i / bars) * len);
          const v = data[idx] ?? 0;
          const el = barRefs.current[i];
          if (el) {
            const h = active ? Math.max(8, v * 100) : 8;
            el.style.height = `${h}%`;
            el.style.opacity = active ? `${0.5 + v * 0.5}` : "0.25";
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active, bars]);

  return (
    <div
      ref={containerRef}
      className="flex items-end justify-center gap-[3px] h-12 w-full max-w-xs transition-opacity duration-500"
      style={{ opacity: active ? 1 : 0.4 }}
      aria-hidden="true"
    >
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          ref={(el) => { barRefs.current[i] = el; }}
          className="w-[3px] rounded-full bg-gradient-to-t from-primary/60 via-primary to-cap-gold transition-all duration-75 ease-out"
          style={{ height: "8%" }}
        />
      ))}
    </div>
  );
};

export default AudioWaveform;
