# SPC Legends monthly prize drawing: plan for attorney review

Status: proposal, 2026-11-01. Owner chose a free-entry drawing for real-world prizes. **Nothing here is built or live.** This is not legal advice; it is the plan an attorney should review, change and approve before any prize is offered.

## Why a drawing, not instant prizes

The game sells spins ($1 for 25) and spin results are random. If a spin result could win something of real value directly (merch, music, tickets, cash), all three elements of gambling would be present: payment, chance and a prize. That requires a gaming license in Texas and most states.

The standard legal structure that allows real prizes alongside paid play is a **sweepstakes with no purchase necessary**:

- Prizes are awarded by a **random drawing** from entries, not by a spin result.
- Anyone can enter **free**, with the same chance per entry as entries earned through play (the "alternative method of entry", AMOE).
- Published **official rules** state the sponsor, dates, eligibility, entry methods, odds, prizes and their value, how winners are picked and notified.

Separately, everything in the game itself stays as it is: XP, Legend Sweeps, gold Legend cards, badges and ranks have **no cash value** and are never exchanged for prizes.

## Proposed structure

| Item | Proposal (owner and attorney to confirm) |
|---|---|
| Name | SPC Legends Monthly Drawing |
| Sponsor | CAP Distributions (Mr. CAP), Houston, TX |
| Period | Calendar month, America/Chicago time; drawing within 5 business days after the month ends |
| Eligibility | Legal US residents, 18+ (or 21+ if counsel prefers); void where prohibited; sponsor's family and staff excluded |
| Prizes (examples) | Signed SPC merch bundle, a signed vinyl, a Legends Hall of Fame shout-out on mrcap1.com, a video call with Mr. CAP. Keep the **total monthly retail value under $5,000** (New York and Florida require registration and bonding above that) |
| Winners | Random draw from all valid entries for the month; one prize per person per month |

## How entries are earned

Entries come from activity that is open to everyone, paid or not, plus a free method with **equal or better** value. Spin results only add entries in ways a free player can also get.

| Source | Entries | Notes |
|---|---|---|
| Free daily check-in on /legends (signed in, no spin needed) | 5 per day | The core free path |
| Free mail-in or online form (AMOE) | 5 per request, 1 request per day | Same entries as the daily check-in; no account purchase needed |
| Playing any spin (free or paid) | 1 per spin, **capped at 5 per day** | The cap keeps paid volume from buying odds |
| Legend Sweep during the month | 25 bonus entries | **Counsel to confirm.** Free spins (25 welcome, 3 daily, guest demo) can also sweep, but a paid player gets more chances. The safest version gives this bonus only through the free path, or removes it |

Rules a lawyer will likely want: entries cannot be bought directly; no entries from the $1 pack itself; entry counts and odds disclosed in the rules; entries do not carry over between months.

## What it would take to build (after approval)

- Tables `legends_drawings` (month, rules version, prize list, status) and `legends_entries` (user, drawing, source, count, created_at), RLS read-own, server-only writes.
- Server functions: daily free check-in, AMOE form (with abuse limits), spin entries (capped) added inside the existing atomic spin function, winner draw using a recorded random seed, winner notice email.
- Pages: official rules, free entry form, past winners (first name and city only, with consent), an entries counter on /legends.
- Admin screen for the owner to run the draw and record fulfilment.

## Questions for the attorney

1. Is a Legend Sweep entry bonus acceptable, given paid players get more spins? If so, in what form?
2. Age limit: 18 or 21?
3. States to exclude, if any (for example where "sweepstakes casino" style games are restricted)?
4. Total prize value per month and per prize; any registration or bonding needed?
5. Tax: prizes over $600 per year per winner need a 1099; collect W-9 from winners?
6. Wording for official rules, the free entry form and on-page disclosures.
