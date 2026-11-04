import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ARTISTS, MUSIC, HOUSTON_HOODS, XP_TABLE, MULTIPLIERS, PAYLINES } from "./config";
import { uploadedSymbols } from "./motion";

/** Read-only reward guide. Every number comes from the live game config, so it never drifts from scoring. */
const fmt = (n: number) => n.toLocaleString();
const counts = [3, 4, 5, 6] as const;

function Table({ title, rows, xp }: { title: string; rows: { id: string; name: string; color: string }[]; xp: Record<number, number> }) {
  return (
    <section className="space-y-4">
      <h2 className="font-serif text-2xl text-foreground">{title}</h2>
      <div className="overflow-x-auto rounded-xl bg-card shadow-[0_4px_24px_hsl(0_0%_0%/0.3)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground">
              <th className="p-3 font-medium">Symbol</th>
              {counts.map((c) => <th key={c} className="p-3 text-right font-medium">{c} in a row</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="odd:bg-muted/30">
                <td className="p-3">
                  <span className="flex items-center gap-3">
                    {uploadedSymbols[r.id] ? <img src={uploadedSymbols[r.id]} alt="" className="h-9 w-9 rounded-md object-cover" loading="lazy" />
                      : <span className="h-3 w-3 rounded-full" style={{ background: r.color }} />}
                    <span className="text-foreground">{r.name}</span>
                  </span>
                </td>
                {counts.map((c) => <td key={c} className="p-3 text-right tabular-nums text-primary">{fmt(xp[c])}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Card({ name, xp, how }: { name: string; xp: string; how: string }) {
  return (
    <div className="rounded-xl bg-card p-5 shadow-[0_4px_24px_hsl(0_0%_0%/0.3)]">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-serif text-lg text-foreground">{name}</h3>
        <span className="tabular-nums text-xl text-primary">{xp}</span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{how}</p>
    </div>
  );
}

export default function LegendsRewardsPage() {
  return (
    <main className="min-h-screen bg-background px-4 pb-24 pt-28 md:px-8">
      <Helmet>
        <title>SPC Legends Rewards | XP for Every Legend and Combo</title>
        <meta name="description" content="See how much virtual XP every SPC Legend, Supreme Legendary, SPC Unity and bonus combo awards in SPC Legends. XP has no cash value." />
        <link rel="canonical" href="https://mrcap1.com/legends/rewards" />
      </Helmet>
      <div className="mx-auto max-w-5xl space-y-12">
        <header className="space-y-3">
          <Link to="/legends" className="text-sm text-primary hover:underline">Back to the game</Link>
          <h1 className="font-serif text-4xl text-foreground md:text-5xl">SPC Legends Rewards</h1>
          <p className="max-w-2xl text-muted-foreground">
            Every XP value in the game, so you can plan your spins. XP, collections and badges are virtual only and have no cash value. Wins never add spins.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="font-serif text-2xl text-foreground">Big combos</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card name="Legend Sweep" xp={`${fmt(XP_TABLE.sweep)} XP`} how="The same Legend on all six reels. The jackpot." />
            <Card name="SPC Unity" xp={`${fmt(XP_TABLE.unity)} XP`} how="Six different Legends across all six reels on a continuous path. Paid once per spin." />
            <Card name="Supreme Legendary" xp={`${fmt(XP_TABLE.supreme)} XP`} how="Any Legend on every reel, any row, zigzags included. Paid once per board and unlocks the Supreme title and Gold Cabinet look." />
            <Card name="713 Bonus" xp={`+${fmt(XP_TABLE.bonus)} XP`} how="Three or more 713 Bonus emblems anywhere on the board." />
            <Card name="Multipliers" xp={`${MULTIPLIERS.double}x / ${MULTIPLIERS.triple}x / ${MULTIPLIERS.double * MULTIPLIERS.triple}x`} how="713 Double Bonus doubles a winning spin, SPC Triple Bonus triples it, both together multiply by six. Double Wild doubles the line it joins." />
            <Card name="Vertical stack (preview)" xp={`${fmt(XP_TABLE.vertical.character)} / ${fmt(XP_TABLE.vertical.music)} XP`} how="Three matching tiles straight down one reel: Legend or studio and hood symbol. Shown as a preview only and not yet credited." />
          </div>
        </section>

        <Table title="Legend paylines" rows={[...ARTISTS]} xp={XP_TABLE.character} />
        <Table title="Studio symbol paylines" rows={[...MUSIC]} xp={XP_TABLE.music} />
        <Table title="Houston hood paylines" rows={[...HOUSTON_HOODS]} xp={XP_TABLE.hood} />

        <section className="space-y-2 text-sm text-muted-foreground">
          <h2 className="font-serif text-2xl text-foreground">How lines pay</h2>
          <p>There are {PAYLINES.length} paylines. A line pays when three or more matching symbols in a row start on reel 1. SPC Wild fills in for a Legend or studio symbol on a line but cannot replace a real Legend for Unity or Supreme.</p>
        </section>
      </div>
    </main>
  );
}
