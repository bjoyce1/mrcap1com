import { describe, expect, it } from 'vitest';
import { safeAuthReturn } from './auth-return';

describe('sign-in destinations', () => {
  it('returns Legends visitors to the game', () => { expect(safeAuthReturn('/legends')).toBe('/legends'); });
  it('preserves existing protected destinations', () => { expect(safeAuthReturn('/admin/greatday')).toBe('/admin/greatday'); });
  it('rejects external and unrecognized destinations', () => {
    expect(safeAuthReturn('https://example.com')).toBeNull();
    expect(safeAuthReturn('//example.com')).toBeNull();
    expect(safeAuthReturn('/unknown')).toBeNull();
  });
});