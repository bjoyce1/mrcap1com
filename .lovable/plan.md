

## Add ISRC Code Field to Admin Library

The `tracks` table already has an `isrc` column and the front-end `ReleaseFactsGrid` already displays it. The missing piece is the admin edit form.

### Changes

**File: `src/pages/AdminLibrary.tsx`**

1. **Add `isrc` to the save payload** (line ~103-118): Add `isrc: editingTrack.isrc || null` to the `payload` object in `saveTrack()`.

2. **Add ISRC input field to the Track Edit Dialog** (after the Credits textarea, around line 312): Add a new labeled input field:
   ```
   ISRC — text input, placeholder "USRC17607839"
   ```
   This goes between the Credits field and the toggle switches row.

3. **Add `spotify_url`, `apple_music_url`, `writers`, `producers`, `lyrics`, `story_behind`** — these columns also exist on the table but are missing from the save payload. While we're here, we'll add `isrc` specifically (the others can be a follow-up).

Only `isrc` will be added in this change — minimal, surgical edit to two spots in one file.

