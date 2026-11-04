# SPC Unity evaluation audit

## Verified board

The supplied fixture has 32 qualifying coordinate paths among all 239 continuous six-reel paths. Paths A, B and C are present. The fixture preserves supplied labels and explicitly maps `713-bonus` to `bonus` and `houston-skyline` to `houston`. `speakers` is a nonartist. Repeated Klondike Kat and Point Blank cells create distinct coordinate routes, not different artist identities.

## Current versus proposed rules

- Standard matching: 26 fixed paylines, including some nonadjacent jumps, with a matching run of at least three symbols beginning on reel 1. These are unchanged and separate from Unity.
- Current Unity: only horizontal rows with six different real artists, 2,000 base XP per qualifying row. This fixture has no qualifying horizontal row and no standard payline award.
- Current Supreme: a real artist on every reel, repeats and unrestricted row jumps permitted, 250 base XP once. This fixture receives only that award, 250 XP.
- Proposed Unity: all six-reel paths with steps of zero or one row, six different real artists, no wild or nonartist. Main Unity 2,000 base XP once per spin. With existing Supreme, the fixture would earn 2,250 XP.
- Additional-route XP defaults to zero, cap defaults to zero, and both accept only nonnegative safe integers. Count only distinct coordinate routes beyond the main route, apply a pre-multiplier cap, then existing once-per-symbol double/triple multipliers. Example: 10 XP per extra route with a cap of 3 gives 30 extra base XP, total 2,280 or 13,680 with both multipliers.

## Safety and UI

The current client and deployed account evaluator are unchanged. Proposed scoring is a shadow-only calculation used for tests and comparison in the viewer. It is never used to commit XP, badges, history or balances. No function deployment, database change, payment or publication is part of this audit. Reward activation needs explicit approval and mirrored client/server evaluation before a deployment.

The Winning Lines viewer lists every qualifying Unity route, every fixed matching payline and all 207 rejected continuous routes with reasons. Selecting a line focuses exactly its cells. Awards and multiplier increments are shown separately from proposed, uncredited XP. Rejections explain nonartist and repeated-artist failures; nonadjacent manual paths are rejected by the same pure validator. Existing bounded celebrations and layered artwork remain intact, and manual inspection cancels the running celebration so it cannot overwrite the selected line.

An independent Cartesian-product enumeration confirms 32. A preliminary independent report incorrectly returned 88 by treating final-reel speakers as an artist; routes ending in row 2 violate the stated artist-only rule and are excluded by the implemented tests.