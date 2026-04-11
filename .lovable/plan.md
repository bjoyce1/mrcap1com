

## Add New Track: "Big Boy Drip"

### Steps

1. **Copy assets into project**
   - Cover art → `public/images/covers/big-boy-drip.png`
   - Audio → upload to Supabase `audio` storage bucket

2. **Insert track record into database** via migration or direct insert with these fields:
   - `title`: Big Boy Drip
   - `slug`: big-boy-drip
   - `artist`: Mr. CAP & Ciddy Boi P
   - `album_id`: NULL (single)
   - `track_number`: NULL
   - `duration`: 0 (auto-syncs on first play)
   - `audio_url`: Supabase storage URL from step 1
   - `cover_art_url`: `/images/covers/big-boy-drip.png`
   - `explicit`: true
   - `release_year`: 2019
   - `isrc`: QT6WA2602019
   - `lyrics`: Full lyrics provided
   - `featured_artists`: Ciddy Boi P
   - `is_public`: true
   - `requires_nft`: false

3. **Add route entry** to the prerender script in `index.html` for `/music/big-boy-drip`

4. **Add to sitemap** (`public/sitemap.xml`)

No schema or UI changes needed — the existing track/release page template handles everything automatically.

