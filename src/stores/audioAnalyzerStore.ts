import { create } from "zustand";

/**
 * Singleton Web Audio API analyser wired to the global <audio> element.
 * Exposes a live Float32Array of frequency magnitudes (0-1) that any
 * component can sample via requestAnimationFrame.
 */

interface AudioAnalyzerStore {
  /** Normalised frequency bins (0-1), updated every rAF tick while playing */
  frequencyData: number[];
  /** Number of FFT bins exposed (controls resolution) */
  binCount: number;
  /** Internal refs — not for external use */
  _ctx: AudioContext | null;
  _analyser: AnalyserNode | null;
  _source: MediaElementAudioSourceNode | null;
  _raf: number | null;
  _connectedEl: HTMLAudioElement | null;

  /** Connect (or re-connect) to an <audio> element */
  connect: (audio: HTMLAudioElement) => void;
  /** Start the rAF loop that pushes frequencyData into state */
  startLoop: () => void;
  /** Stop the rAF loop */
  stopLoop: () => void;
  /** Tear everything down */
  disconnect: () => void;
}

const FFT_SIZE = 64; // yields 32 bins — plenty for a visual bar display

export const useAudioAnalyzerStore = create<AudioAnalyzerStore>()((set, get) => ({
  frequencyData: [],
  binCount: FFT_SIZE / 2,
  _ctx: null,
  _analyser: null,
  _source: null,
  _raf: null,
  _connectedEl: null,

  connect: (audio: HTMLAudioElement) => {
    const state = get();

    // Already wired to this exact element — skip
    if (state._connectedEl === audio && state._ctx) return;

    // If switching to a different audio element, tear down fully
    if (state._connectedEl && state._connectedEl !== audio) {
      get().disconnect();
    }

    // If we already have a context + source for this element, reuse it
    if (state._ctx && state._connectedEl === audio) return;

    try {
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = FFT_SIZE;
      analyser.smoothingTimeConstant = 0.8;

      const source = ctx.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(ctx.destination); // pass-through so user still hears audio

      set({
        _ctx: ctx,
        _analyser: analyser,
        _source: source,
        _connectedEl: audio,
        binCount: analyser.frequencyBinCount,
      });
    } catch (e) {
      console.warn("[AudioAnalyzer] Failed to connect:", e);
    }
  },

  startLoop: () => {
    const state = get();
    if (state._raf) return; // already running
    if (!state._analyser) return;

    const analyser = state._analyser;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const tick = () => {
      analyser.getByteFrequencyData(dataArray);
      // Normalise 0-255 → 0-1
      const normalised: number[] = [];
      for (let i = 0; i < dataArray.length; i++) {
        normalised.push(dataArray[i] / 255);
      }
      set({ frequencyData: normalised });
      const raf = requestAnimationFrame(tick);
      set({ _raf: raf });
    };

    const raf = requestAnimationFrame(tick);
    set({ _raf: raf });
  },

  stopLoop: () => {
    const { _raf } = get();
    if (_raf) {
      cancelAnimationFrame(_raf);
      set({ _raf: null, frequencyData: [] });
    }
  },

  disconnect: () => {
    const state = get();
    state.stopLoop();
    try {
      state._source?.disconnect();
      state._analyser?.disconnect();
      state._ctx?.close();
    } catch {}
    set({ _ctx: null, _analyser: null, _source: null, _connectedEl: null, frequencyData: [] });
  },
}));
