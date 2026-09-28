export interface IntroHandle {
  /** Play the exit transition, then call onEnter / onNavigate. */
  exit(path?: string): void;
  /** Tear down WebGL, audio, scroll and DOM. */
  destroy(): void;
}

export interface IntroOptions {
  /** Visitor pressed ENTER SITE (or skipped). */
  onEnter?: () => void;
  /** Visitor followed a same-site link from inside the intro (e.g. "/merch"). */
  onNavigate?: (path: string) => void;
  /** Insert a row via the site's Supabase client; resolve true on success. */
  insert?: (table: string, row: Record<string, unknown>) => Promise<boolean>;
}

export function mountIntro(host: HTMLElement, options?: IntroOptions): Promise<IntroHandle>;
