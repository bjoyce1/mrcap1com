"""Cuts each SPC Legend's portrait into three layers for the win animations: background, character, name plate.

The game shows the untouched portrait at rest and swaps to these layers only while a Legend moves, so the layers
must come from the exact art the game uses. The manifest records each portrait's Lovable asset id; when the art is
replaced the ids stop matching and the game falls back to the flat pop until this script is run again.

Usage (from the repo root):  py -3 scripts/legends-layers.py [artist-id ...]
Needs:  pip install "rembg[cpu]" opencv-python-headless pillow numpy
Portraits download from the live site by their asset pointers in src/assets/legends/.
"""
import json
import shutil
import sys
import urllib.request
from io import BytesIO
from pathlib import Path

import cv2
import numpy as np
from PIL import Image
from rembg import new_session, remove

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "src/assets/legends"
OUT = ROOT / "public/games/spc-legends/layers"
MANIFEST = ROOT / "src/features/legends/layers.json"
SITE = "https://mrcap1.com"
SIZE = 512

# Per Legend, measured on the 1254 px portraits:
#   split: first row of the name plate. Above it is the character, below it the plate.
#   crown: [x0, y0, x1, y1] of a crown that sits above the plate over the body; it goes with the plate.
#   model: the cut-out model that keeps this portrait's character and plate whole.
#   band:  True when no model keeps the whole plate; the plate is then the strip of the portrait below split and
#          does not slam (it would show its edges), it only catches the light sweep.
ARTISTS = {
    "k-rino":       {"split": 868, "model": "isnet-anime"},
    "mr-cap":       {"split": 850, "crown": [540, 780, 680, 850], "model": "birefnet-general-lite"},
    "klondike-kat": {"split": 880, "model": "birefnet-general-lite"},
    "point-blank":  {"split": 845, "model": "isnet-anime"},
    "k-water":      {"split": 870, "model": "isnet-anime"},
    "cl-che":       {"split": 895, "crown": [850, 780, 1090, 895], "model": "birefnet-general-lite", "band": True},
    "murder-one":   {"split": 885, "crown": [860, 750, 1100, 885], "model": "birefnet-general-lite"},
    "rapper-k":     {"split": 905, "crown": [850, 780, 1110, 905], "model": "birefnet-general-lite"},
    "komodo-dbx":   {"split": 890, "crown": [495, 780, 745, 890], "model": "isnet-anime"},
    "ganxsta-nip":  {"split": 878, "crown": [515, 812, 745, 878], "model": "isnet-anime"},
}


def portrait(artist_id):
    pointer = json.loads((ASSETS / f"{artist_id}-portrait.webp.asset.json").read_text())
    # The asset host refuses Python's default user agent.
    req = urllib.request.Request(SITE + pointer["url"], headers={"User-Agent": "Mozilla/5.0 legends-layers"})
    with urllib.request.urlopen(req) as r:
        data = r.read()
    if len(data) != pointer["size"]:
        raise SystemExit(f"{artist_id}: downloaded {len(data)} bytes, the asset pointer says {pointer['size']}")
    return pointer["asset_id"], np.array(Image.open(BytesIO(data)).convert("RGB"))


def save(rgb, alpha, path):
    img = Image.fromarray(rgb if alpha is None else np.dstack([rgb, (np.clip(alpha, 0, 1) * 255).astype(np.uint8)]))
    img.resize((SIZE, SIZE), Image.LANCZOS).save(path, quality=86, method=6)


def layers(src, matte, cfg):
    h, w = matte.shape
    yy, xx = np.mgrid[0:h, 0:w]
    crown = np.zeros((h, w), bool)
    if "crown" in cfg:
        x0, y0, x1, y1 = cfg["crown"]
        crown = (xx >= x0) & (xx <= x1) & (yy >= y0) & (yy < y1)
    below = yy >= cfg["split"]
    plate_zone = cv2.GaussianBlur((below | crown).astype(np.float32), (0, 0), 5)
    band = cv2.GaussianBlur(below.astype(np.float32), (0, 0), 5)

    # Character: the matte above the plate, with the crown's patch of body painted in from the jacket around it,
    # and a firm edge so faint bits of the city never travel with him.
    patch = cv2.dilate(crown.astype(np.uint8) * 255, np.ones((9, 9), np.uint8))
    filled = cv2.cvtColor(cv2.inpaint(cv2.cvtColor(src, cv2.COLOR_RGB2BGR), patch, 15, cv2.INPAINT_TELEA), cv2.COLOR_BGR2RGB)
    char_rgb = np.where(crown[..., None], filled, src)
    char_a = np.clip((np.maximum(matte, crown.astype(np.float32)) * (1 - band) - 0.4) / 0.45, 0, 1)

    plate_a = plate_zone if cfg.get("band") else matte * plate_zone

    # Background: whatever the matte kept leaves, filled from the scenery and pushed dark like the shadow behind him.
    hole = cv2.dilate((matte > 0.16).astype(np.uint8) * 255, np.ones((31, 31), np.uint8))
    small = cv2.resize(cv2.cvtColor(src, cv2.COLOR_RGB2BGR), (w // 2, h // 2))
    fill = cv2.cvtColor(cv2.inpaint(small, cv2.resize(hole, (w // 2, h // 2), interpolation=cv2.INTER_NEAREST), 9, cv2.INPAINT_TELEA), cv2.COLOR_BGR2RGB)
    fill = cv2.GaussianBlur(cv2.resize(fill, (w, h)), (0, 0), 9).astype(np.float32) * 0.32
    mix = cv2.GaussianBlur(hole.astype(np.float32) / 255, (0, 0), 14)[..., None]
    bg = (src * (1 - mix) + fill * mix).astype(np.uint8)
    return bg, (char_rgb, char_a), (src, plate_a)


def main():
    ids = sys.argv[1:] or list(ARTISTS)
    manifest = json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {}
    sessions = {}
    for artist_id in ids:
        cfg = ARTISTS[artist_id]
        asset_id, src = portrait(artist_id)
        session = sessions.setdefault(cfg["model"], new_session(cfg["model"]))
        matte = np.array(remove(Image.fromarray(src), session=session))[:, :, 3].astype(np.float32) / 255
        bg, char, plate = layers(src, matte, cfg)
        # The folder carries the asset id, so a new portrait never shows a browser's cached old layers.
        old = manifest.get(artist_id, {}).get("dir")
        folder = f"{artist_id}.{asset_id[:8]}"
        if old and old != folder:
            shutil.rmtree(OUT / old, ignore_errors=True)
        (OUT / folder).mkdir(parents=True, exist_ok=True)
        save(bg, None, OUT / folder / "bg.webp")
        save(*char, OUT / folder / "char.webp")
        save(*plate, OUT / folder / "plate.webp")
        manifest[artist_id] = {"asset": asset_id, "dir": folder, "slam": not cfg.get("band", False)}
        print("layers", artist_id, folder)
    MANIFEST.write_text(json.dumps(dict(sorted(manifest.items())), indent=2) + "\n")


if __name__ == "__main__":
    main()
