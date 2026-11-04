// Vault: spend coins (earned XP minus spent) on Legends, skins, titles and songs. Accounts only.
// Ownership lives on the server; equipped looks are cosmetic and never touch spins or scoring.
import { supabase } from "@/integrations/supabase/client";
import { VAULT, type VaultItem } from "../../../supabase/functions/_shared/legends/vault.ts";
import { WIN_SONGS, songUrl, type WinSong } from "./soundtrack";

export { VAULT, type VaultItem };

export type VaultState = { xp: number; coins: number; unlocks: string[]; collection: string[] };

export const coinsFor = (xp: number, spent: number) => Math.max(0, xp - spent);

/** An item is owned if bought, or (for Legends) already found on the reels. */
export const isOwned = (item: VaultItem, s: Pick<VaultState, "unlocks" | "collection">) =>
  s.unlocks.includes(item.id) || (!!item.artist && s.collection.includes(item.artist));

export async function loadVault(userId: string): Promise<VaultState> {
  const { data, error } = await supabase
    .from("legends_players").select("xp, coins_spent, unlocks, collection").eq("user_id", userId).maybeSingle();
  if (error) throw error;
  const xp = Number(data?.xp ?? 0);
  return { xp, coins: coinsFor(xp, Number(data?.coins_spent ?? 0)), unlocks: data?.unlocks ?? [], collection: data?.collection ?? [] };
}

export async function redeem(itemId: string): Promise<{ coins: number; unlocks: string[]; collection: string[] } | { error: "owned" | "not_enough" | "signed_out" | "failed" }> {
  const { data, error } = await supabase.functions.invoke("legends-redeem", { body: { itemId } });
  if (!error) return data;
  const status = (error as { context?: Response })?.context?.status ?? 0;
  if (status === 409) return { error: "owned" };
  if (status === 402) return { error: "not_enough" };
  if (status === 401) return { error: "signed_out" };
  return { error: "failed" };
}

const allSongs: WinSong[] = Object.values(WIN_SONGS).flat();
export const vaultSongUrl = (name: string) => {
  const s = allSongs.find((x) => x.title === name);
  return s ? songUrl(s) : null;
};

const LOOK_KEY = "legends-vault-look";
export type Look = { skin?: string; title?: string };
export const readLook = (): Look => { try { return JSON.parse(localStorage.getItem(LOOK_KEY) || "{}"); } catch { return {}; } };
export const saveLook = (l: Look) => localStorage.setItem(LOOK_KEY, JSON.stringify(l));

/** Applies the equipped skin and title on the game page, only for items the server says this account owns. */
export async function applyVaultLook(root: HTMLElement) {
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user?.id;
  const titleEl = root.querySelector<HTMLElement>('[data-lg="vault-title"]');
  root.classList.remove("vault-skin-purple-lightning", "vault-skin-diamond-ice", "vault-skin-houston-chrome");
  if (titleEl) titleEl.hidden = true;
  if (!user) return;
  const s = await loadVault(user).catch(() => null);
  if (!s) return;
  const look = readLook();
  if (look.skin && s.unlocks.includes(look.skin)) root.classList.add(`vault-${look.skin}`);
  const title = look.title && s.unlocks.includes(look.title) ? VAULT.find((i) => i.id === look.title) : null;
  if (titleEl && title) { titleEl.textContent = title.name.toUpperCase(); titleEl.hidden = false; }
}
