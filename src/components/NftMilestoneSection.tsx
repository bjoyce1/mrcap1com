import React from "react";

export function NftMilestoneSection() {
  return (
    <section
      id="nft-milestone"
      className="py-16 border-b border-white/5 bg-[radial-gradient(circle_at_top,_#111827,_#020617)]"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Heading Row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-400 mb-2">
              Blockchain Milestone
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              First Houston Rap Artist to Sell a Hip Hop NFT
            </h2>
            <p className="mt-2 text-xs text-gray-400">
              February 25, 2021 · Houston, Texas
            </p>
          </div>
          <div className="text-[11px] text-gray-400 max-w-xs">
            <p>Release: "Limitless" (NFT Single)</p>
            <p>Platform: OpenSea · Web3 / NFT Marketplace</p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-[1.2fr_minmax(0,_1fr)] gap-8 items-start">
          {/* Left: Story */}
          <div className="space-y-4 text-sm text-gray-200">
            <p>
              On <span className="font-semibold">February 25, 2021</span>, Houston-based
              rapper <span className="font-semibold">Mr. CAP</span> made history by
              becoming the <span className="font-semibold">
              first Houston rap artist
              </span>{" "}
              to successfully sell a Hip Hop NFT on the blockchain. The landmark
              sale featured his song{" "}
              <span className="italic">"Limitless"</span>, minted and sold on the
              popular NFT marketplace <span className="font-semibold">OpenSea</span>.
            </p>
            <p>
              An NFT (Non-Fungible Token) is a unique digital asset—such as music,
              art, film, or media—verified on a blockchain for authenticity and
              ownership. Unlike a typical audio file, Mr. CAP's "Limitless" NFT was
              created as a one-of-a-kind, collectible piece of Hip Hop history and
              acquired by a private collector for a noteworthy four-figure sum.
            </p>
            <p>
              Born <span className="font-semibold">Cornelius A. Pratt</span>, Mr. CAP
              is a longtime figure in the Houston rap scene and an original member
              of the legendary{" "}
              <span className="font-semibold">South Park Coalition (SPC)</span>, with
              a career spanning over three decades and collaborations that include
              K-Rino, Point Blank, Klondike Kat, and more.
            </p>
            <p className="border-l-2 border-emerald-400/70 pl-4 text-emerald-100 text-xs md:text-sm italic">
              "I'm extremely proud to be the first Houston rap artist to sell a
              Hip Hop NFT on the blockchain. This is a major milestone for me, for
              independent artists, and for the city of Houston. I hope it inspires
              more creatives to embrace this technology and discover new ways to
              share and protect their work."
              <span className="block mt-1 not-italic text-[11px] text-emerald-300">
                — Mr. CAP
              </span>
            </p>
            <p>
              The success of the "Limitless" NFT sale highlights the growing demand
              for authenticated digital music assets and underscores Houston's role
              as a hub of innovation at the intersection of{" "}
              <span className="font-semibold">Hip Hop, art, and blockchain</span>.
            </p>
          </div>

          {/* Right: Highlight Card */}
          <div className="space-y-4">
            <div className="relative rounded-3xl border border-emerald-500/40 bg-black/70 p-4 shadow-[0_0_40px_rgba(16,185,129,0.25)]">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-emerald-400">
                    NFT Feature
                  </p>
                  <p className="text-sm font-semibold text-gray-100">
                    "Limitless" · 1/1 Music NFT
                  </p>
                </div>
                <div className="text-[10px] text-right text-gray-400">
                  <p>Minted: Feb 25, 2021</p>
                  <p>Marketplace: OpenSea</p>
                </div>
              </div>

              {/* Placeholder image block */}
              <div className="aspect-video rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/20 via-black to-emerald-900/40 flex items-center justify-center mb-3">
                <div className="text-center text-[11px] text-gray-200 px-4">
                  Artwork / Cover for
                  <br />
                  <span className="font-semibold text-white">
                    "Limitless" (NFT Edition)
                  </span>
                  <p className="mt-1 text-[10px] text-gray-400">
                    Replace this block with the actual NFT cover image.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px] text-gray-300">
                <div className="rounded-2xl bg-black/70 border border-white/10 px-3 py-2">
                  <p className="uppercase text-[10px] text-gray-400">
                    Category
                  </p>
                  <p className="font-semibold text-gray-100">
                    Music · Hip Hop NFT
                  </p>
                </div>
                <div className="rounded-2xl bg-black/70 border border-white/10 px-3 py-2">
                  <p className="uppercase text-[10px] text-gray-400">
                    Blockchain
                  </p>
                  <p className="font-semibold text-gray-100">
                    Ethereum (via OpenSea)
                  </p>
                </div>
              </div>

              <div className="mt-3 text-[11px] text-gray-400">
                <p>
                  This sale established Mr. CAP as an early adopter in the Web3
                  music space and one of the first documented Hip Hop NFT pioneers
                  from Houston.
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
                <a
                  href="https://opensea.io"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold transition"
                >
                  View on OpenSea (Listing / Archive)
                </a>
                <a
                  href="#contact"
                  className="px-3 py-1.5 rounded-full border border-emerald-500/60 text-emerald-200 hover:border-emerald-300 hover:text-emerald-100 transition"
                >
                  Inquire About Web3 & NFT Projects
                </a>
              </div>
            </div>

            <p className="text-[11px] text-gray-500">
              For interviews, speaking requests, or features regarding NFTs,
              blockchain, or digital ownership in music, please contact Mr. CAP's
              team through the booking section.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NftMilestoneSection;
