import React from "react";

const OPENSEA_COLLECTION_URL =
  "https://opensea.io/collection/mr-cap-music"; // Update with actual collection URL when available

const FEATURED_NFTS = [
  {
    name: "Limitless (1/1 NFT Edition)",
    description:
      "Historic music NFT by Mr. CAP — recognized as the first Houston rap artist Hip Hop NFT sale on the blockchain.",
    video: "/video/limitless-nft.mp4",
    link: "https://opensea.io/item/ethereum/0x495f947276749ce646f68ac8c248420045cb7b5e/111525374491507330879718694062290749651333153209192724132274812129449556836353",
  },
];

export function NftCollectionSection() {
  return (
    <section
      id="nft-collection"
      className="py-16 border-b border-white/5 bg-black"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-400 mb-2">
              Web3 · NFT Collection
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              MR. CAP on OpenSea
            </h2>
            <p className="mt-2 text-sm text-gray-300 max-w-2xl">
              A curated look at MR. CAP&apos;s music NFTs, including the historic{" "}
              <span className="font-semibold">"Limitless"</span> drop that marked
              one of the first documented Hip Hop NFTs from a Houston rap artist.
              Collectors can view, bid, and purchase via OpenSea.
            </p>
          </div>
          <div className="text-[11px] text-gray-400">
            <p>Marketplace: OpenSea</p>
            <p>Network: Ethereum (or as configured on OpenSea)</p>
          </div>
        </div>

        {/* Featured NFTs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {FEATURED_NFTS.map((nft) => (
            <a
              key={nft.name}
              href={nft.link}
              target="_blank"
              rel="noreferrer"
              className="group rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900 to-black overflow-hidden hover:border-emerald-400/70 transition"
            >
              <div className="aspect-square overflow-hidden">
                <video
                  src={nft.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-4">
                <p className="text-sm font-semibold text-white">{nft.name}</p>
                <p className="text-xs text-gray-300 mt-1">{nft.description}</p>
                <p className="text-[11px] text-emerald-400 mt-2">
                  View on OpenSea →
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Full Collection CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-gray-400 max-w-md">
            The full NFT collection, including current listings, bids, and
            transaction history, is available on OpenSea. Items may appear,
            update, or sell in real time based on on-chain activity.
          </p>
          <a
            href={OPENSEA_COLLECTION_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold uppercase tracking-wide transition"
          >
            View Full Collection on OpenSea
          </a>
        </div>
      </div>
    </section>
  );
}

export default NftCollectionSection;
