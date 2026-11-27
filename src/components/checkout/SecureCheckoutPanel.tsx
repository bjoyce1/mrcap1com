import type { ReactNode } from "react";

/**
 * Shared PayPal checkout frame matching the SPC Legends spin shop:
 * gold-edged dark panel, SECURE CHECKOUT divider, warm ivory button card.
 */
const SecureCheckoutPanel = ({ children, note }: { children: ReactNode; note?: ReactNode }) => (
  <div className="rounded-2xl p-px bg-gradient-to-br from-[#f8cd7b] via-[#8a5a1c] to-[#f8cd7b] shadow-[0_0_22px_rgba(248,205,123,0.12),0_0_34px_rgba(166,92,255,0.12)]">
    <div className="rounded-[15px] px-3.5 pt-3.5 pb-3 bg-[linear-gradient(165deg,rgba(38,22,58,0.92),rgba(12,8,20,0.96))]">
      <div className="flex items-center gap-3 mb-2.5 text-[11px] font-semibold tracking-[0.25em] text-[#f8cd7b]">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#f8cd7b]/70" />
        SECURE CHECKOUT
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#f8cd7b]/70" />
      </div>
      {note}
      <div className="rounded-xl px-2.5 pt-2.5 pb-1.5 min-h-[44px] bg-gradient-to-b from-[#fbf7ee] to-[#f1e9da] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_6px_18px_rgba(0,0,0,0.45)]">
        {children}
      </div>
    </div>
  </div>
);

export default SecureCheckoutPanel;
