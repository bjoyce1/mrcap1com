import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type RawNft = {
  identifier?: string;
  name?: string;
  display_image_url?: string;
  image_url?: string;
  image?: { url?: string };
  collection?: string;
  opensea_url?: string;
};

export function NftWalletGalleryLive() {
  const [nfts, setNfts] = useState<RawNft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadNFTs() {
      try {
        const { data, error: fnError } = await supabase.functions.invoke('opensea-wallet-nfts');
        
        if (fnError) {
          console.error("Edge function error:", fnError);
          setError("Failed to load NFTs from OpenSea.");
          setLoading(false);
          return;
        }

        const list = data?.nfts || data?.assets || [];
        setNfts(list);
        console.log("Loaded NFTs:", list.length);

      } catch (err) {
        console.error(err);
        setError("Error contacting NFT server.");
      } finally {
        setLoading(false);
      }
    }
    loadNFTs();
  }, []);

  return (
    <section id="nft-wallet-gallery" className="py-16 bg-black border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-400 mb-2">
            Web3 · Live NFT Collection
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-white">MR. CAP · NFT Gallery</h2>
          <p className="mt-2 text-sm text-gray-300 max-w-xl">
            Live on-chain NFTs pulled directly from MR. CAP's wallet on OpenSea.
          </p>
        </div>

        {/* States */}
        {loading && (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            Loading NFTs from the blockchain…
          </div>
        )}

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        {/* Grid */}
        {!loading && !error && (
          <>
            {nfts.length === 0 ? (
              <p className="text-gray-400">No NFTs found in wallet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {nfts.map((nft, idx) => {
                  const image =
                    nft.display_image_url ||
                    nft.image_url ||
                    nft.image?.url;

                  const name =
                    nft.name ||
                    `${nft.collection ?? "NFT"} #${nft.identifier ?? idx}`;

                  const link = nft.opensea_url ||
                    "https://opensea.io/0xf69120023756f1d1f539c23ade135efb66e3f494";

                  return (
                    <a
                      key={`${nft.identifier}-${idx}`}
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      className="group border border-white/10 rounded-2xl overflow-hidden bg-gradient-to-b from-slate-900 to-black hover:border-emerald-400/70 transition"
                    >
                      <div className="aspect-square overflow-hidden">
                        {image ? (
                          <img
                            src={image}
                            alt={name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full bg-slate-800 text-xs text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-semibold text-white truncate">{name}</p>
                        <p className="text-[11px] text-emerald-400 mt-1">
                          View on OpenSea →
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default NftWalletGalleryLive;
