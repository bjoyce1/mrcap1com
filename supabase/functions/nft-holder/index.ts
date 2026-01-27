import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const { address } = await req.json();
    
    if (!address || typeof address !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing or invalid wallet address" }), 
        { status: 400, headers: { ...corsHeaders, "content-type": "application/json" } }
      );
    }

    const ALCHEMY_API_KEY = Deno.env.get("ALCHEMY_API_KEY");
    const NFT_CONTRACT = (Deno.env.get("NFT_CONTRACTS") || "")
      .split(",")[0]
      ?.trim()
      ?.toLowerCase();
    const CREATOR = (Deno.env.get("NFT_CREATOR_ADDRESS") || "").trim().toLowerCase();

    // Optional fallback allowlist of tokenIds (comma-separated hex or decimal)
    const TOKEN_ALLOWLIST = (Deno.env.get("NFT_TOKEN_IDS") || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (!ALCHEMY_API_KEY) {
      console.error("Missing ALCHEMY_API_KEY secret");
      return new Response(
        JSON.stringify({ error: "Server configuration error: Missing API key" }), 
        { status: 500, headers: { ...corsHeaders, "content-type": "application/json" } }
      );
    }

    if (!NFT_CONTRACT) {
      console.error("Missing NFT_CONTRACTS secret");
      return new Response(
        JSON.stringify({ error: "Server configuration error: Missing contract" }), 
        { status: 500, headers: { ...corsHeaders, "content-type": "application/json" } }
      );
    }

    if (!CREATOR) {
      console.error("Missing NFT_CREATOR_ADDRESS secret");
      return new Response(
        JSON.stringify({ error: "Server configuration error: Missing creator" }), 
        { status: 500, headers: { ...corsHeaders, "content-type": "application/json" } }
      );
    }

    console.log(`Checking NFT ownership for wallet: ${address}`);
    console.log(`Contract: ${NFT_CONTRACT}, Creator: ${CREATOR}`);

    // Alchemy mainnet NFT endpoint
    const url = new URL(`https://eth-mainnet.g.alchemy.com/nft/v3/${ALCHEMY_API_KEY}/getNFTsForOwner`);
    url.searchParams.set("owner", address.toLowerCase());
    url.searchParams.append("contractAddresses[]", NFT_CONTRACT);
    url.searchParams.set("withMetadata", "true");

    const response = await fetch(url.toString(), { 
      headers: { accept: "application/json" } 
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Alchemy API error:", errorText);
      return new Response(
        JSON.stringify({ error: "Failed to query blockchain" }), 
        { status: 502, headers: { ...corsHeaders, "content-type": "application/json" } }
      );
    }

    const data = await response.json();
    const ownedNfts = Array.isArray(data?.ownedNfts) ? data.ownedNfts : [];

    console.log(`Found ${ownedNfts.length} NFTs from contract`);

    // Helper: normalize tokenId formats
    const normalizeTokenId = (tokenId: string): string => {
      try {
        if (tokenId.startsWith("0x")) return tokenId.toLowerCase();
        // convert decimal to hex
        const asBigInt = BigInt(tokenId);
        return "0x" + asBigInt.toString(16);
      } catch {
        return tokenId.toLowerCase();
      }
    };

    const allow = new Set(TOKEN_ALLOWLIST.map(normalizeTokenId));

    // Check each NFT
    let matchedByCreator = 0;
    let matchedByAllowlist = 0;

    for (const nft of ownedNfts) {
      const contractAddr = String(nft?.contract?.address || "").toLowerCase();
      if (contractAddr !== NFT_CONTRACT) continue;

      const tokenIdRaw = String(nft?.tokenId || "");
      const tokenId = normalizeTokenId(tokenIdRaw);

      // Fallback allowlist mode (most reliable if you supply token IDs)
      if (allow.size > 0 && allow.has(tokenId)) {
        matchedByAllowlist += 1;
        console.log(`Matched by allowlist: tokenId ${tokenId}`);
        continue;
      }

      // Creator checks (depends on availability in metadata)
      const possibleCreators = [
        nft?.contractMetadata?.deployer,
        nft?.contractMetadata?.creator,
        nft?.metadata?.creator,
        nft?.metadata?.createdBy,
        nft?.metadata?.artist,
        nft?.metadata?.artistAddress,
        nft?.raw?.metadata?.creator,
        nft?.raw?.metadata?.createdBy,
        nft?.raw?.metadata?.artistAddress,
      ]
        .filter(Boolean)
        .map((v: unknown) => String(v).toLowerCase());

      if (possibleCreators.includes(CREATOR)) {
        matchedByCreator += 1;
        console.log(`Matched by creator metadata: tokenId ${tokenId}`);
      }
    }

    const isHolder = matchedByAllowlist > 0 || matchedByCreator > 0;

    console.log(`Result: isHolder=${isHolder}, byCreator=${matchedByCreator}, byAllowlist=${matchedByAllowlist}`);

    return new Response(
      JSON.stringify({
        isHolder,
        contract: NFT_CONTRACT,
        creator: CREATOR,
        matchedByCreator,
        matchedByAllowlist,
        totalOwned: ownedNfts.length,
        note:
          allow.size > 0
            ? "Allowlist active. Creator match used as secondary check."
            : "Creator match active. Add NFT_TOKEN_IDS for guaranteed allowlist.",
      }),
      { status: 200, headers: { ...corsHeaders, "content-type": "application/json" } }
    );
  } catch (error) {
    console.error("NFT holder check error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }), 
      { status: 500, headers: { ...corsHeaders, "content-type": "application/json" } }
    );
  }
});
