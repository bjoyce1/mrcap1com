

## Plan: Add missing OG meta tags to og-share edge function

### Identified gaps
1. Missing `og:image:width`, `og:image:height`, `og:image:type`, and `og:image:alt` meta tags
2. `og:type` is hardcoded to `music.song` even for albums (should be `music.album`)

### Changes

**File: `supabase/functions/og-share/index.ts`**

1. Add `og:image:width` (1200), `og:image:height` (630), and `og:image:alt` meta tags to the HTML template
2. Add `og:image:type` that infers JPEG/PNG/WebP from the image URL extension
3. Set `og:type` dynamically: `music.song` for tracks, `music.album` for albums
4. Add `og:site_name` meta tag (`Mr. CAP`)

### Technical details

The HTML `<head>` block will gain these additional tags:
```html
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="630"/>
<meta property="og:image:type" content="image/jpeg"/>
<meta property="og:image:alt" content="Cover art for Track Title"/>
<meta property="og:site_name" content="Mr. CAP"/>
```

The `og:type` will switch between `music.song` and `music.album` based on the `type` query parameter. The image MIME type will be inferred from the file extension (`.jpg`→`image/jpeg`, `.png`→`image/png`, `.webp`→`image/webp`).

