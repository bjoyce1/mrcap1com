import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { DAILY_SPEND_CAP_CENTS } from "../../../supabase/functions/_shared/legends/packs";
import { VAULT_PRICE_CENTS } from "../../../supabase/functions/_shared/legends/vault";
import { GAME_CONFIG } from "./config";

// Plain-language purchase terms for SPC Legends. Owner decision 2026-11-05; pending attorney review.
const cap = DAILY_SPEND_CAP_CENTS / 100;
const vaultPrice = (VAULT_PRICE_CENTS / 100).toFixed(2);

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: "Free to play",
    body: [
      `SPC Legends: Spin the Mix is an arcade game for entertainment. Signed in players get ${GAME_CONFIG.welcomeSpins} free spins to start and ${GAME_CONFIG.dailySpins} free spins every Houston calendar day. You never need to buy anything to play.`,
    ],
  },
  {
    title: "Virtual items only",
    body: [
      "Spins, spin packs, XP, coins, Legends, cabinet skins, player titles and songs are virtual items inside the game. They have no cash value.",
      "They can't be sold, traded, transferred to another account, or exchanged for money, prizes or anything outside the game. No spin result ever pays cash or a prize.",
      "XP and coins are earned by playing. They can't be bought, and buying spins or Vault items never spends your XP or coins.",
    ],
  },
  {
    title: "Purchases",
    body: [
      `Spin packs start at 25 spins for $1. Paid spins never expire and are used after your free spins. Legends, skins and titles in the Vault are $${vaultPrice} each.`,
      `You can buy up to $${cap} of spin packs per Houston calendar day. Payments go through PayPal, and prices are in US dollars.`,
      "You must be 18 or older to buy, or have a parent or guardian's permission.",
    ],
  },
  {
    title: "Refunds",
    body: [
      "Purchases are delivered to your account right away, so all sales are final except where the law requires a refund.",
      "If you were charged and your spins or item never arrived, or you were charged twice, contact us through the booking and contact page with your PayPal receipt and we will make it right.",
    ],
  },
  {
    title: "Changes and fair play",
    body: [
      "We may change the game, its symbols, odds, payouts, prices and Vault items over time. Spins and items you already own stay on your account.",
      "Accounts that cheat, abuse a bug, or reverse a payment after receiving spins or items may lose them or be removed.",
    ],
  },
];

export default function LegendsTermsPage() {
  return (
    <main className="min-h-screen bg-background px-4 pb-24 pt-28 md:px-8">
      <Helmet>
        <title>SPC Legends Terms | Spins, Packs and Vault Items</title>
        <meta name="description" content="Plain terms for SPC Legends: free daily spins, spin packs and Vault items are virtual with no cash value, a daily purchase limit, and how refunds work." />
      </Helmet>
      <div className="mx-auto max-w-3xl space-y-10">
        <header className="space-y-3">
          <Link to="/legends" className="text-sm text-muted-foreground hover:text-primary">Back to the game</Link>
          <h1 className="font-serif text-4xl text-foreground md:text-5xl">SPC Legends Terms</h1>
          <p className="text-muted-foreground">What you get when you play, buy spins, or unlock something in the Vault.</p>
        </header>
        {SECTIONS.map((section) => (
          <section key={section.title} className="space-y-3">
            <h2 className="font-serif text-2xl text-foreground">{section.title}</h2>
            {section.body.map((p) => <p key={p} className="text-muted-foreground leading-relaxed">{p}</p>)}
          </section>
        ))}
        <p className="text-sm text-muted-foreground">
          Questions or billing problems? <Link to="/booking" className="text-primary underline-offset-4 hover:underline">Contact us</Link>.
          {" "}<Link to="/legends/vault" className="text-primary underline-offset-4 hover:underline">Open the Vault</Link>.
        </p>
      </div>
    </main>
  );
}
