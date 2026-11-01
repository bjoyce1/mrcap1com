/** AnimatedSpinPurchaseButton: the spin store's pill-to-circle purchase control.
 *  A pure state machine plus a thin DOM driver. All payment logic stays in game.ts;
 *  this module only reflects real transaction state (idle, processing, success, error). */
export type PurchaseState = 'idle' | 'processing' | 'success' | 'error';

/** Microinteraction timing (ms), within the ranges set for the spin store redesign. */
export const PURCHASE_TIMING = {
  hoverGlow: 220,
  compress: 300,
  morph: 400,
  successReveal: 450,
  successHold: 950,
  errorHold: 800,
  returnToIdle: 480,
} as const;

const ALLOWED: Record<PurchaseState, readonly PurchaseState[]> = {
  idle: ['processing'],
  processing: ['success', 'error', 'idle'],
  success: ['idle'],
  error: ['idle', 'processing'],
};

/** A state change is allowed only along the purchase flow; same-state is a no-op. */
export function purchaseTransition(from: PurchaseState, to: PurchaseState): boolean {
  return from === to || ALLOWED[from].includes(to);
}

export interface PurchaseButtonOptions {
  reducedMotion?: () => boolean;
  onState?: (state: PurchaseState) => void;
}

export interface PurchaseButtonController {
  state(): PurchaseState;
  setState(next: PurchaseState): void;
  destroy(): void;
}

/** Drive a button element's data-state attribute through the purchase flow.
 *  Success and error hold briefly, then return to idle so the buyer can act again. */
export function createPurchaseButton(el: HTMLElement, opts: PurchaseButtonOptions = {}): PurchaseButtonController {
  let current: PurchaseState = 'idle';
  let timer: ReturnType<typeof setTimeout> | null = null;
  const apply = (state: PurchaseState) => {
    el.dataset.state = state;
    el.setAttribute('aria-busy', String(state === 'processing'));
    opts.onState?.(state);
  };
  const clear = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };
  const holdThenIdle = (hold: number) => {
    const reduced = opts.reducedMotion?.() ?? false;
    timer = setTimeout(() => {
      current = 'idle';
      apply('idle');
    }, reduced ? 250 : hold + PURCHASE_TIMING.returnToIdle);
  };
  apply('idle');
  return {
    state: () => current,
    setState(next) {
      if (!purchaseTransition(current, next)) return;
      clear();
      current = next;
      apply(next);
      if (next === 'success') holdThenIdle(PURCHASE_TIMING.successHold);
      if (next === 'error') holdThenIdle(PURCHASE_TIMING.errorHold);
    },
    destroy: clear,
  };
}
