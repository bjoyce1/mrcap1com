"""Home-screen icons for the SPC Legends app, cut from the game's own LEGEND symbol.

Writes public/games/spc-legends/app/:
  icon-192.png, icon-512.png        the framed LEGEND tile ("any" purpose)
  maskable-192.png, maskable-512.png crown and lettering inside the 80% safe circle, on the tile's purple
  apple-touch-icon.png              180 px, opaque (iOS fills transparency with black)

Run from the repo root: py -3 scripts/legends-app-icons.py
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public/games/spc-legends/symbols/legend.webp"
OUT = ROOT / "public/games/spc-legends/app"

# Inside the gold frame: crown, laurels and LEGEND lettering on purple smoke.
INNER = (58, 58, 966, 966)
# Share of the maskable canvas the inner art fills; its corners fade into the background.
MASKABLE_ART = 0.7


def save(img: Image.Image, name: str, size: int) -> None:
    img.convert("RGB").resize((size, size), Image.LANCZOS).save(OUT / name, optimize=True)


def background(tile: Image.Image) -> tuple[int, int, int]:
    """Average colour of the purple smoke just inside the frame."""
    strip = tile.crop((90, 64, 330, 104)).convert("RGB").resize((1, 1), Image.BOX)
    return strip.getpixel((0, 0))


def maskable(tile: Image.Image, size: int = 1024) -> Image.Image:
    bg = background(tile)
    canvas = Image.new("RGB", (size, size), bg)
    art_size = round(size * MASKABLE_ART)
    art = tile.crop(INNER).convert("RGB").resize((art_size, art_size), Image.LANCZOS)
    # Round fade so the square crop never shows an edge on any launcher shape.
    mask = Image.new("L", (art_size, art_size), 0)
    inset = round(art_size * 0.04)
    ImageDraw.Draw(mask).ellipse((inset, inset, art_size - inset, art_size - inset), fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(art_size * 0.035))
    off = (size - art_size) // 2
    canvas.paste(art, (off, off), mask)
    return canvas


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    tile = Image.open(SRC).convert("RGB")
    save(tile, "icon-512.png", 512)
    save(tile, "icon-192.png", 192)
    save(tile, "apple-touch-icon.png", 180)
    m = maskable(tile)
    save(m, "maskable-512.png", 512)
    save(m, "maskable-192.png", 192)
    print("wrote", sorted(p.name for p in OUT.iterdir()), "background", background(tile))


if __name__ == "__main__":
    main()
