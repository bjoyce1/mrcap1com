"""Cuts the approved SPC Legends hero artwork (public/games/spc-legends/ui/hero-marquee.webp) into layers, so the page
can rebuild it as a live marquee instead of showing a flat picture: the city and highway, the diamond title, the
crown, the two ribbons, and a mask of the gold frame for the light that travels around it.

Usage (from the repo root):  py -3 scripts/legends-marquee.py
Needs:  pip install "rembg[cpu]" opencv-python-headless pillow numpy
Writes public/games/spc-legends/marquee/*.webp and src/features/legends/marquee.json (each piece's box, as a share of
the artwork, so the layers line up exactly at any size).
"""
import json
from pathlib import Path

import cv2
import numpy as np
from PIL import Image
from rembg import new_session, remove

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public/games/spc-legends/ui/hero-marquee.webp"
OUT = ROOT / "public/games/spc-legends/marquee"
MANIFEST = ROOT / "src/features/legends/marquee.json"

# Pieces cut out of the artwork, as [x0, y0, x1, y1] on the 1920 x 1185 original, with the cut-out model that keeps
# each one whole. The diamond title stays in the scene: no model separates chrome letters from the lit skyline behind
# them, so its light sweep is masked to the bright chrome instead (title-mask).
PIECES = {
    "crown": ([740, 14, 1182, 386], "birefnet-general-lite"),
    "ribbon-left": ([62, 188, 682, 446], "bria-rmbg"),
    "ribbon-right": ([1158, 182, 1858, 446], "bria-rmbg"),
}
TITLE = [380, 418, 1542, 812]
# Inside edge of the gold frame (the scene drifts within it) and its corner radius.
INNER = [58, 58, 1862, 1128]
INNER_RADIUS = 120


def pct(box, w, h):
    x0, y0, x1, y1 = box
    return {"left": round(x0 / w * 100, 3), "top": round(y0 / h * 100, 3), "width": round((x1 - x0) / w * 100, 3), "height": round((y1 - y0) / h * 100, 3)}


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    art = np.array(Image.open(SRC).convert("RGB"))
    h, w = art.shape[:2]
    sessions = {}
    hole = np.zeros((h, w), np.uint8)
    manifest = {"size": [w, h], "inner": pct(INNER, w, h), "title": pct(TITLE, w, h), "pieces": {}}
    for name, (box, model) in PIECES.items():
        x0, y0, x1, y1 = box
        crop = art[y0:y1, x0:x1]
        session = sessions.setdefault(model, new_session(model))
        alpha = np.array(remove(Image.fromarray(crop), session=session))[:, :, 3].astype(np.float32) / 255
        alpha = np.clip((alpha - 0.25) / 0.6, 0, 1)
        # The pieces are silver and gold: drop the purple smoke a model sometimes keeps, then keep the main shape only.
        hsv = cv2.cvtColor(crop, cv2.COLOR_RGB2HSV)
        # (Strong purple only: the silver ribbons carry a lavender sheen that must stay.)
        alpha[(hsv[..., 0] >= 125) & (hsv[..., 0] <= 165) & (hsv[..., 1] > 165)] = 0
        count, labels, stats, _ = cv2.connectedComponentsWithStats((alpha > 0.3).astype(np.uint8))
        if count > 1:
            keep = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
            alpha *= cv2.dilate((labels == keep).astype(np.uint8), np.ones((5, 5), np.uint8)).astype(np.float32)
        Image.fromarray(np.dstack([crop, (alpha * 255).astype(np.uint8)])).save(OUT / f"{name}.webp", quality=88, method=6)
        hole[y0:y1, x0:x1] = np.maximum(hole[y0:y1, x0:x1], (alpha > 0.1).astype(np.uint8) * 255)
        manifest["pieces"][name] = pct(box, w, h)
        print("piece", name, crop.shape[1], "x", crop.shape[0])

    # The scene behind the pieces: their holes filled from the surrounding city and pushed darker, like the shade
    # the lettering casts, so a few pixels of drift never show a second copy.
    hole = cv2.dilate(hole, np.ones((25, 25), np.uint8))
    small = cv2.resize(cv2.cvtColor(art, cv2.COLOR_RGB2BGR), (w // 2, h // 2))
    filled = cv2.inpaint(small, cv2.resize(hole, (w // 2, h // 2), interpolation=cv2.INTER_NEAREST), 9, cv2.INPAINT_TELEA)
    filled = cv2.GaussianBlur(cv2.resize(cv2.cvtColor(filled, cv2.COLOR_BGR2RGB), (w, h)), (0, 0), 7).astype(np.float32) * 0.55
    mix = cv2.GaussianBlur(hole.astype(np.float32) / 255, (0, 0), 12)[..., None]
    scene = (art * (1 - mix) + filled * mix).astype(np.uint8)
    Image.fromarray(scene).save(OUT / "scene.webp", quality=84, method=6)

    # The frame: everything outside the rounded inner edge, as a mask for the travelling light.
    inner = np.zeros((h, w), np.uint8)
    x0, y0, x1, y1 = INNER
    cv2.rectangle(inner, (x0 + INNER_RADIUS, y0), (x1 - INNER_RADIUS, y1), 255, -1)
    cv2.rectangle(inner, (x0, y0 + INNER_RADIUS), (x1, y1 - INNER_RADIUS), 255, -1)
    for cx, cy in [(x0 + INNER_RADIUS, y0 + INNER_RADIUS), (x1 - INNER_RADIUS, y0 + INNER_RADIUS), (x0 + INNER_RADIUS, y1 - INNER_RADIUS), (x1 - INNER_RADIUS, y1 - INNER_RADIUS)]:
        cv2.circle(inner, (cx, cy), INNER_RADIUS, 255, -1)
    frame = 255 - cv2.GaussianBlur(inner, (0, 0), 3)
    # Keep only the bright gold of the frame, so the light rides the metal and not the dark gaps between it.
    gold = cv2.cvtColor(art, cv2.COLOR_RGB2HSV)
    metal = ((gold[..., 2] > 120) & (gold[..., 1] > 60)).astype(np.float32)
    frame = (frame.astype(np.float32) / 255 * cv2.GaussianBlur(metal, (0, 0), 1.5) * 255).astype(np.uint8)
    Image.fromarray(np.dstack([np.full((h, w, 3), 255, np.uint8), frame])).resize((w // 2, h // 2), Image.LANCZOS).save(OUT / "frame-mask.webp", quality=80, method=6)

    # The title's chrome and diamonds (bright, nearly colourless pixels in its box), as a mask for its light sweep.
    x0, y0, x1, y1 = TITLE
    hsv = cv2.cvtColor(art[y0:y1, x0:x1], cv2.COLOR_RGB2HSV).astype(np.float32)
    chrome = np.clip((hsv[..., 2] - 150) / 80, 0, 1) * np.clip((110 - hsv[..., 1]) / 60, 0, 1)
    chrome = (cv2.GaussianBlur(chrome, (0, 0), 1) * 255).astype(np.uint8)
    tw, th = (x1 - x0) // 2, (y1 - y0) // 2
    Image.fromarray(np.dstack([np.full((y1 - y0, x1 - x0, 3), 255, np.uint8), chrome])).resize((tw, th), Image.LANCZOS).save(OUT / "title-mask.webp", quality=80, method=6)

    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n")
    print("scene, frame-mask and", MANIFEST.name, "written")

    # The city and freeways on either side of the title, for the living backdrop and the cabinet header corners.
    for name, box in {"city-left": (80, 440, 362, 1000), "city-right": (1568, 440, 1845, 1000)}.items():
        Image.fromarray(art[box[1]:box[3], box[0]:box[2]]).save(OUT / f"{name}.webp", quality=86, method=6)
        print(name, "written")

    # The cabinet header's chrome "SPC LEGENDS" letters: the wordmark without its small crown (the header has the big
    # jeweled crown above it). The top rows fade out so no crown base peeks over the letters.
    word = Image.open(ROOT / "src/assets/legends/wordmark-complete.png").convert("RGBA").crop((0, 182, 1536, 472))
    a = np.array(word).astype(np.float32)
    a[:, :, 3] *= np.clip(np.arange(a.shape[0]) / 12, 0, 1)[:, None]
    Image.fromarray(a.astype(np.uint8)).save(OUT / "title-letters.webp", quality=88, method=6)
    print("title-letters written")


if __name__ == "__main__":
    main()
