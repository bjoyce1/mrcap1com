import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NftDetailModal } from "./NftDetailModal";
import { NFTCard } from "./nft/NFTCard";
import { NFTFilterToolbar } from "./nft/NFTFilterToolbar";

type RawNft = {
  identifier?: string;
  name?: string;
  description?: string;
  display_image_url?: string;
  display_animation_url?: string;
  image_url?: string;
  image?: { url?: string };
  collection?: string;
  opensea_url?: string;
  contract?: string;
  token_standard?: string;
};

const ART_OF_ISM_COLLECTION = "artofism";

export function OtherNftsGallery() {
  const [nfts, setNfts] = useState<RawNft[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [selectedNft, setSelectedNft] = useState<RawNft | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Filter state
  const [sortBy, setSortBy] = useState("Sales Volume");
  const [timeRange, setTimeRange] = useState("Last 7 Days");
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");

  const loadNFTs = useCallback(async (cursor?: string) => {
    const isLoadingMore = !!cursor;
    if (isLoadingMore) setLoadingMore(true);
    else setLoading(true);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('opensea-wallet-nfts', {
        body: cursor ? { next: cursor } : {}
      });
      if (fnError) { setError("Failed to load NFTs from OpenSea."); return; }

      const list = (data?.nfts || data?.assets || []).filter(
        (nft: RawNft) =>
          nft.collection !== ART_OF_ISM_COLLECTION &&
          !nft.name?.toLowerCase().includes('ugly kid') &&
          !nft.collection?.toLowerCase().includes('ugly kid')
      );

      if (isLoadingMore) setNfts(prev => [...prev, ...list]);
      else setNfts(list);
      setNextCursor(data?.next || null);
    } catch {
      setError("Error contacting NFT server.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => { loadNFTs(); }, [loadNFTs]);

  const handleLoadMore = () => { if (nextCursor && !loadingMore) loadNFTs(nextCursor); };
  const handleNftClick = (nft: RawNft) => { setSelectedNft(nft); setModalOpen(true); };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <div className="relative">
          <div className="w-12 h-12 border-2 border-primary/30 rounded-full" />
          <div className="absolute inset-0 w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-muted-foreground text-sm animate-pulse">Loading NFTs from the blockchain…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive text-sm inline-block px-6 py-3 rounded-lg ring-1 ring-destructive/20 bg-destructive/5">{error}</p>
      </div>
    );
  }

  if (nfts.length === 0) {
    return <p className="text-muted-foreground text-center py-12">No other NFTs found in wallet.</p>;
  }

  return (
    <>
      {/* Section Header */}
      <h2 className="text-3xl md:text-4xl font-display text-center text-foreground mb-2 tracking-tight">
        Top <span className="text-primary">Collectibles</span>
      </h2>
      <p className="text-muted-foreground text-center text-sm mb-8 max-w-lg mx-auto">
        Collaborations, exclusive drops, and unique digital art pieces from the wallet.
      </p>

      {/* Filter Toolbar */}
      <NFTFilterToolbar
        sortBy={sortBy}
        onSortChange={setSortBy}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Grid */}
      <div className={`grid gap-5 ${
        viewMode === "compact"
          ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
      }`}>
        {nfts.map((nft, idx) => (
          <NFTCard key={`nft-${nft.identifier}-${idx}`} nft={nft} index={idx} onClick={handleNftClick} />
        ))}
      </div>

      {/* Show More */}
      {nextCursor && (
        <div className="mt-12 text-center">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="inline-flex items-center gap-3 px-8 py-3 rounded-full text-sm font-semibold
                       ring-1 ring-white/10 text-foreground
                       hover:ring-white/20 hover:bg-white/5 transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingMore ? (
              <>
                <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                Loading...
              </>
            ) : "Show more"}
          </button>
        </div>
      )}

      {/* Count */}
      <p className="text-center text-muted-foreground text-xs mt-6">
        Showing {nfts.length} NFT{nfts.length !== 1 ? 's' : ''}
        {!nextCursor && ' · All loaded'}
      </p>

      <NftDetailModal nft={selectedNft} open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
