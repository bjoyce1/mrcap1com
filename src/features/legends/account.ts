// Talks to the SPC Legends backend: the player's row, recent spins, server spins and spin pack checkout.
// Every outcome and balance comes from the server; the browser only animates what it is told.
import { supabase } from "@/integrations/supabase/client";
import { balanceFromRow, type Balance, type PlayerRow } from "./balance";

export type Profile = { xp: number; best: number; totalSpins: number; collection: string[]; badges: string[]; lastBoard: string[][] | null; balance: Balance };
export type HistoryItem = { xp: number; wins: { type: string; count?: number; symbol?: string | null }[] };
export type SpinWin = { type: string; payline?: number; count?: number; symbol?: string; xp: number; cells: string[] };
export type SpinResult = {
  board: string[][];
  outcome: { wins: SpinWin[]; hitCells: string[]; xp: number; found: string[]; highest: number };
  newCharacters: string[];
  source: "welcome" | "daily" | "paid";
  balance: Balance;
};
type Failure<E extends string> = { error: E; balance?: Balance };

/** Read the error body of a non-2xx edge function response. */
async function failure(error: unknown): Promise<{ status: number; body: Record<string, unknown> }> {
  const response = (error as { context?: Response })?.context;
  if (!(response instanceof Response)) return { status: 0, body: {} };
  return { status: response.status, body: await response.json().catch(() => ({})) };
}

export async function loadProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from("legends_players")
    .select("welcome_left, paid_spins, spins_today, day, xp, best, total_spins, collection, badges, last_board")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return {
    xp: Number(data?.xp ?? 0),
    best: data?.best ?? 0,
    totalSpins: data?.total_spins ?? 0,
    collection: data?.collection ?? [],
    badges: data?.badges ?? [],
    lastBoard: (data?.last_board as string[][] | null) ?? null,
    balance: balanceFromRow(data as PlayerRow),
  };
}

export async function loadHistory(): Promise<HistoryItem[]> {
  const { data, error } = await supabase.from("legends_spins").select("xp, wins").order("created_at", { ascending: false }).limit(6);
  if (error) throw error;
  return (data ?? []).map((row) => ({ xp: row.xp, wins: (row.wins as HistoryItem["wins"]) ?? [] }));
}

/** One spin, decided on the server. Retrying with the same key never spends a second spin. */
export async function requestSpin(idempotencyKey: string): Promise<SpinResult | Failure<"cooldown" | "no_spins" | "signed_out" | "failed">> {
  const { data, error } = await supabase.functions.invoke("legends-spin", { body: { idempotencyKey } });
  if (!error) return data as SpinResult;
  const { status, body } = await failure(error);
  if (status === 429) return { error: "cooldown" };
  if (status === 402) return { error: "no_spins", balance: body.balance as Balance };
  if (status === 401) return { error: "signed_out" };
  return { error: "failed" };
}

/** Starts a $1 pack order. The price and spin count are fixed on the server. */
export async function startCheckout(): Promise<{ orderID: string } | Failure<"not_on_sale" | "signed_out" | "failed">> {
  const { data, error } = await supabase.functions.invoke("legends-spins-checkout", { body: {} });
  if (!error) return data as { orderID: string };
  const { status } = await failure(error);
  if (status === 503) return { error: "not_on_sale" };
  if (status === 401) return { error: "signed_out" };
  return { error: "failed" };
}

/** Captures an approved pack order; the server verifies it and adds 25 paid spins once. */
export async function capturePack(orderID: string): Promise<{ balance: Balance } | Failure<"not_completed" | "failed">> {
  const { data, error } = await supabase.functions.invoke("legends-spins-capture", { body: { orderID } });
  if (!error) return data as { balance: Balance };
  const { status } = await failure(error);
  return { error: status === 402 || status === 409 ? "not_completed" : "failed" };
}

/** The site's configured PayPal client ID, so buttons approve orders on the same account. */
export async function paypalClientId(): Promise<string | null> {
  const { data, error } = await supabase.functions.invoke("paypal-checkout?action=client-id");
  const clientId = (data as { clientId?: string })?.clientId;
  return error || !clientId || clientId === "sb" ? null : clientId;
}
