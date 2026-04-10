#!/usr/bin/env bash
# ============================================================
# optimize-images.sh
# Converts all PNG/JPG images in src/assets/ and public/images/
# to WebP format, dramatically reducing bundle size.
#
# Prerequisites:  brew install cwebp   (macOS)
#                 sudo apt install webp (Linux)
#
# Usage:  chmod +x scripts/optimize-images.sh
#         ./scripts/optimize-images.sh
# ============================================================

set -euo pipefail

QUALITY=82          # WebP quality (80-85 is the sweet spot)
MAX_WIDTH=1920      # Max width in pixels (resize if larger)
DIRS=("src/assets" "public/images")
CONVERTED=0
SKIPPED=0
SAVED_BYTES=0

command -v cwebp >/dev/null 2>&1 || {
  echo "❌  cwebp not found. Install it first:"
  echo "    macOS:  brew install webp"
  echo "    Linux:  sudo apt install webp"
  exit 1
}

for DIR in "${DIRS[@]}"; do
  [ -d "$DIR" ] || continue
  echo "🔍  Scanning $DIR ..."

  find "$DIR" -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) | while read -r FILE; do
    WEBP="${FILE%.*}.webp"

    # Skip if WebP already exists and is newer
    if [ -f "$WEBP" ] && [ "$WEBP" -nt "$FILE" ]; then
      SKIPPED=$((SKIPPED + 1))
      continue
    fi

    ORIG_SIZE=$(stat -f%z "$FILE" 2>/dev/null || stat -c%s "$FILE" 2>/dev/null)

    # Convert to WebP
    cwebp -q $QUALITY -resize $MAX_WIDTH 0 "$FILE" -o "$WEBP" -quiet 2>/dev/null || \
    cwebp -q $QUALITY "$FILE" -o "$WEBP" -quiet

    NEW_SIZE=$(stat -f%z "$WEBP" 2>/dev/null || stat -c%s "$WEBP" 2>/dev/null)
    DIFF=$((ORIG_SIZE - NEW_SIZE))

    if [ $DIFF -gt 0 ]; then
      SAVED_BYTES=$((SAVED_BYTES + DIFF))
      CONVERTED=$((CONVERTED + 1))
      SAVINGS_PCT=$(( (DIFF * 100) / ORIG_SIZE ))
      echo "  ✅  ${FILE} → .webp  (${SAVINGS_PCT}% smaller)"
    else
      # WebP was larger — keep original, remove WebP
      rm "$WEBP"
      echo "  ⏭️  ${FILE} — already optimal, skipped"
    fi
  done
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Converted:  $CONVERTED files"
echo "  Skipped:    $SKIPPED files"
SAVED_MB=$(echo "scale=1; $SAVED_BYTES / 1048576" | bc 2>/dev/null || echo "?")
echo "  Saved:      ~${SAVED_MB} MB"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⚠️  Next steps:"
echo "   1. Update your component imports to use .webp instead of .png/.jpg"
echo "   2. Or use the find-and-replace below to batch update:"
echo ""
echo '   # In your project root:'
echo '   find src -name "*.tsx" -o -name "*.ts" | xargs sed -i "" "s/\.png\"/.webp\"/g; s/\.jpg\"/.webp\"/g; s/\.jpeg\"/.webp\"/g"'
echo ""
echo "   3. Delete the original PNG/JPG files once verified."
