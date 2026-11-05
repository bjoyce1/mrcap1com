/**
 * "Get the app": puts SPC Legends on the phone's home screen as its own full-screen app
 * (public/legends-manifest.json, swapped in by the /legends SEO entry).
 *
 * Chrome, Edge and Samsung Internet hand us an install prompt (beforeinstallprompt), which the
 * button opens. iPhone and iPad have no prompt, so there the button opens the Share steps.
 * Inside the installed app the button stays hidden. After a few spins on a phone, a small card
 * suggests it once; "Not now" keeps it away for two weeks.
 */

export interface InstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

declare global {
  interface Window {
    /** Saved by the inline script in index.html, which runs before this code loads. */
    __installPrompt?: InstallPromptEvent;
  }
}

export type InstallMode = "installed" | "prompt" | "ios" | "none";

export function installMode(o: { standalone: boolean; ios: boolean; prompt: boolean }): InstallMode {
  if (o.standalone) return "installed";
  if (o.prompt) return "prompt";
  if (o.ios) return "ios";
  return "none";
}

/** iPhone, iPod, and iPads that report a desktop Mac user agent. */
export function isIos(nav: Pick<Navigator, "userAgent" | "platform" | "maxTouchPoints">): boolean {
  return /iPad|iPhone|iPod/.test(nav.userAgent) || (nav.platform === "MacIntel" && nav.maxTouchPoints > 1);
}

export const NUDGE_AFTER_SPINS = 3;
export const NUDGE_QUIET_DAYS = 14;

export function shouldNudge(o: { mode: InstallMode; touch: boolean; spins: number; dismissedAt: number | null; now: number }): boolean {
  if (o.mode !== "prompt" && o.mode !== "ios") return false;
  if (!o.touch || o.spins < NUDGE_AFTER_SPINS) return false;
  return o.dismissedAt === null || o.now - o.dismissedAt > NUDGE_QUIET_DAYS * 864e5;
}

const DISMISS_KEY = "spc-legends-install-dismissed";

function dismissedAt(): number | null {
  try {
    const v = Number(localStorage.getItem(DISMISS_KEY));
    return v > 0 ? v : null;
  } catch {
    return null;
  }
}

function isStandalone(): boolean {
  return window.matchMedia?.("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

/** Wires the install button, nudge card and iOS steps inside the game root. Returns a cleanup. */
export function mountInstall(root: HTMLElement): () => void {
  const q = (name: string) => root.querySelector<HTMLElement>(`[data-lg="${name}"]`);
  const button = q("install");
  const nudge = q("install-nudge");
  const sheet = q("install-sheet");
  if (!button || !nudge || !sheet) return () => {};

  const ios = isIos(navigator);
  const touch = window.matchMedia?.("(pointer: coarse)").matches ?? false;
  let spins = 0;
  let opener: HTMLElement | null = null;

  const mode = () => installMode({ standalone: isStandalone(), ios, prompt: !!window.__installPrompt });
  const render = () => {
    const m = mode();
    root.classList.toggle("is-app", m === "installed");
    const offered = m === "prompt" || m === "ios";
    button.hidden = !offered;
    if (!offered) nudge.hidden = true;
  };

  const closeSheet = () => {
    if (sheet.hidden) return;
    sheet.hidden = true;
    opener?.focus();
  };
  const open = async (from: HTMLElement) => {
    nudge.hidden = true;
    const offer = window.__installPrompt;
    if (offer) {
      // Each prompt event can be used once; the browser sends a new one if the player says no.
      window.__installPrompt = undefined;
      render();
      try {
        await offer.prompt();
        await offer.userChoice;
      } catch {
        /* the browser withdrew the offer */
      }
      render();
      return;
    }
    if (ios) {
      opener = from;
      sheet.hidden = false;
      sheet.querySelector<HTMLElement>(".install-sheet-close")?.focus();
    }
  };
  const dismiss = () => {
    nudge.hidden = true;
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* asked again next visit */
    }
  };

  const onClick = (event: MouseEvent) => {
    const target = (event.target as HTMLElement).closest<HTMLElement>("[data-lg]");
    switch (target?.dataset.lg) {
      case "install":
      case "install-go":
        void open(target);
        break;
      case "install-dismiss":
        dismiss();
        break;
      case "install-close":
        closeSheet();
        break;
    }
  };
  const onKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") closeSheet();
  };
  const onOffer = (event: Event) => {
    window.__installPrompt = event as InstallPromptEvent;
    render();
  };
  const onInstalled = () => {
    window.__installPrompt = undefined;
    closeSheet();
    render();
  };
  const onSpin = (event: Event) => {
    if (!(event as CustomEvent).detail) return;
    spins++;
    if (nudge.hidden && shouldNudge({ mode: mode(), touch, spins, dismissedAt: dismissedAt(), now: Date.now() })) nudge.hidden = false;
  };

  root.addEventListener("click", onClick);
  root.addEventListener("lg-lines-result", onSpin);
  document.addEventListener("keydown", onKey);
  window.addEventListener("beforeinstallprompt", onOffer);
  window.addEventListener("appinstalled", onInstalled);
  render();

  return () => {
    root.removeEventListener("click", onClick);
    root.removeEventListener("lg-lines-result", onSpin);
    document.removeEventListener("keydown", onKey);
    window.removeEventListener("beforeinstallprompt", onOffer);
    window.removeEventListener("appinstalled", onInstalled);
  };
}
