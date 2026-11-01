import { describe, expect, it, vi } from 'vitest';
import {
  PURCHASE_TIMING,
  createPurchaseButton,
  purchaseTransition,
  type PurchaseState,
} from './purchase-button';

const fakeButton = () => ({ dataset: {} as Record<string, string>, setAttribute: vi.fn() }) as unknown as HTMLElement;

describe('purchaseTransition', () => {
  it('follows the purchase flow only', () => {
    expect(purchaseTransition('idle', 'processing')).toBe(true);
    expect(purchaseTransition('processing', 'success')).toBe(true);
    expect(purchaseTransition('processing', 'error')).toBe(true);
    expect(purchaseTransition('processing', 'idle')).toBe(true);
    expect(purchaseTransition('success', 'idle')).toBe(true);
    expect(purchaseTransition('error', 'idle')).toBe(true);
    expect(purchaseTransition('error', 'processing')).toBe(true);
  });

  it('rejects jumps that skip the real transaction', () => {
    expect(purchaseTransition('idle', 'success')).toBe(false);
    expect(purchaseTransition('idle', 'error')).toBe(false);
    expect(purchaseTransition('success', 'processing')).toBe(false);
    expect(purchaseTransition('success', 'error')).toBe(false);
  });
});

describe('PURCHASE_TIMING', () => {
  it('stays inside the redesigned microinteraction ranges', () => {
    expect(PURCHASE_TIMING.hoverGlow).toBeGreaterThanOrEqual(180);
    expect(PURCHASE_TIMING.hoverGlow).toBeLessThanOrEqual(250);
    expect(PURCHASE_TIMING.compress).toBeGreaterThanOrEqual(250);
    expect(PURCHASE_TIMING.compress).toBeLessThanOrEqual(350);
    expect(PURCHASE_TIMING.morph).toBeGreaterThanOrEqual(350);
    expect(PURCHASE_TIMING.morph).toBeLessThanOrEqual(450);
    expect(PURCHASE_TIMING.successReveal).toBeGreaterThanOrEqual(350);
    expect(PURCHASE_TIMING.successReveal).toBeLessThanOrEqual(500);
    expect(PURCHASE_TIMING.returnToIdle).toBeGreaterThanOrEqual(400);
    expect(PURCHASE_TIMING.returnToIdle).toBeLessThanOrEqual(550);
  });
});

describe('createPurchaseButton', () => {
  it('starts idle and ignores illegal jumps', () => {
    const el = fakeButton();
    const button = createPurchaseButton(el);
    expect(button.state()).toBe('idle');
    button.setState('success');
    expect(button.state()).toBe('idle');
    button.destroy();
  });

  it('returns to idle after success and after error', () => {
    vi.useFakeTimers();
    const states: PurchaseState[] = [];
    const el = fakeButton();
    const button = createPurchaseButton(el, { onState: (s) => states.push(s) });
    button.setState('processing');
    button.setState('success');
    expect(button.state()).toBe('success');
    vi.advanceTimersByTime(PURCHASE_TIMING.successHold + PURCHASE_TIMING.returnToIdle + 10);
    expect(button.state()).toBe('idle');
    button.setState('processing');
    button.setState('error');
    vi.advanceTimersByTime(PURCHASE_TIMING.errorHold + PURCHASE_TIMING.returnToIdle + 10);
    expect(button.state()).toBe('idle');
    expect(states).toEqual(['idle', 'processing', 'success', 'idle', 'processing', 'error', 'idle']);
    button.destroy();
    vi.useRealTimers();
  });

  it('marks the button busy only while processing', () => {
    const el = fakeButton();
    const button = createPurchaseButton(el);
    button.setState('processing');
    expect(el.setAttribute).toHaveBeenLastCalledWith('aria-busy', 'true');
    button.setState('error');
    expect(el.setAttribute).toHaveBeenLastCalledWith('aria-busy', 'false');
    button.destroy();
  });
});
