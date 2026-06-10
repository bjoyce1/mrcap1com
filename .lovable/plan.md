## Goal
Change the `audio` bucket in Lovable Cloud storage from Private to Public so audio files are served at direct public URLs.

## Step
1. Call `supabase--storage_update_bucket` with `name: "audio"`, `public: true`.

## Notes / Trade-offs
- Once public, anyone with a file URL can stream/download — bypassing any client-side NFT gating that relies on private signed URLs.
- The `audio-preview` and `audio-download` edge functions currently mediate access to gated tracks. If the bucket is public, the gating those functions enforce is no longer meaningful for protecting the underlying files (URLs become guessable/shareable).
- Workspace policy may reject making buckets public; if so, I'll surface the error and we keep it private.

## Confirm before I switch to build
Do you want to proceed knowing that NFT-gated audio files will become directly accessible by URL?