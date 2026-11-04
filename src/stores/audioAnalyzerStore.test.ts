import { afterEach, expect, test, vi } from 'vitest';
import { useAudioAnalyzerStore } from './audioAnalyzerStore';

afterEach(() => { useAudioAnalyzerStore.setState({ _ctx: null }); vi.unstubAllGlobals(); });

test('music and game effects reuse one context after analyser disconnect', () => {
  const close = vi.fn();
  const create = vi.fn(function () { return { state: 'running', close }; });
  vi.stubGlobal('AudioContext', create);
  const first = useAudioAnalyzerStore.getState().getContext();
  useAudioAnalyzerStore.getState().disconnect();
  expect(useAudioAnalyzerStore.getState().getContext()).toBe(first);
  expect(create).toHaveBeenCalledTimes(1);
  expect(close).not.toHaveBeenCalled();
});