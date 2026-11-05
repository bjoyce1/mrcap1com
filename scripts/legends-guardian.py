"""Cuts A.C. Chill's memorial portrait into the pieces the Legacy Blessing animates.

A.C. Chill is the SPC Legends guardian (owner request 2026-11-05). Everything comes from the supplied memorial art
(scripts/art/ac-chill-portrait.webp, 1254 px), so his face is never redrawn:

  symbols/ac-chill.webp      1024 px reel tile and memorial card (the portrait as supplied, scaled, never stretched)
  guardian/body.webp         the flyer: cap, face and crossed arms, head enlarged for the big-head caricature,
                             fading out at the waist where the name plate starts
  guardian/wing-left.webp    left wing, cut on its own so it can flap around the shoulder
  guardian/wing-right.webp   right wing
  src/features/legends/guardian.json   layer size and the shoulder pivots, in layer pixels, for the CSS rig

The halo, the gold touch and the blessed-tile gold are drawn in CSS so they stay sharp at any size.

Usage (from the repo root):  py -3 scripts/legends-guardian.py
Needs:  pip install "rembg[cpu]" opencv-python-headless pillow numpy
"""
import json
from pathlib import Path

import cv2
import numpy as np
from PIL import Image
from rembg import new_session, remove

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "scripts/art/ac-chill-portrait.webp"
PUBLIC = ROOT / "public/games/spc-legends"
OUT = PUBLIC / "guardian"

# Measured on the 1254 px portrait.
CROP = (60, 10, 1220, 800)          # character, wings and halo; the name plate starts below
WAIST = 700                         # rows below this (portrait px) fade out: the plate's crown sits on the arms
FADE = 70
HEAD = {"cy": 330, "neck": 545, "x0": 400, "x1": 830}   # head and cap box, portrait px; neck is its pivot row
HEAD_SCALE = 1.18                   # big head, as on the other SPC Legends caricatures
TORSO_SCALE = 0.9
WING_BOXES = {                      # portrait px; each wing is the largest bright shape in its box
    "left": (90, 245, 500, 715),
    "right": (800, 235, 1210, 715),
}
# The right wing's top edge runs from its tip up by the South Park Coalition badge down to the shoulder. Grey clouds
# above it read as white feathers, so everything above that edge is left out.
RIGHT_EDGE = ((880, 390), (1185, 246))
SIZE = 560                          # output width of the body layer


def matte(img, model):
    return np.array(remove(img, session=new_session(model)))[:, :, 3].astype(np.float32) / 255


def largest(mask):
    count, labels, stats, _ = cv2.connectedComponentsWithStats(mask.astype(np.uint8), 8)
    if count <= 1:
        return mask
    keep = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
    return labels == keep


def save(rgba, path, width=None):
    im = Image.fromarray(rgba.astype(np.uint8), "RGBA")
    box = im.getbbox()
    im = im.crop(box)
    if width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    path.parent.mkdir(parents=True, exist_ok=True)
    im.save(path, "WEBP", quality=88, method=6)
    return box, im.size


def main():
    portrait = Image.open(SOURCE).convert("RGB")
    assert portrait.size == (1254, 1254), portrait.size
    (PUBLIC / "symbols").mkdir(parents=True, exist_ok=True)
    portrait.resize((1024, 1024), Image.LANCZOS).save(PUBLIC / "symbols/ac-chill.webp", "WEBP", quality=86, method=6)

    x0, y0, x1, y1 = CROP
    crop = portrait.crop(CROP)
    rgb = np.array(crop).astype(np.float32)
    h, w = rgb.shape[:2]
    rows = np.arange(h)[:, None] + y0

    # Body: the general model keeps cap, face and arms and drops wings and sky.
    body_a = matte(crop, "birefnet-general-lite")
    body_a *= np.clip((WAIST + FADE - rows) / FADE, 0, 1)

    # Wings: the anime model keeps feathers; take the bright, low-colour shape in each wing box, outside the body.
    anime = matte(crop, "isnet-anime")
    hsv = cv2.cvtColor(np.array(crop), cv2.COLOR_RGB2HSV).astype(np.float32)
    white = ((hsv[:, :, 2] > 135) & (hsv[:, :, 1] < 70)).astype(np.uint8)
    feather = cv2.dilate(white, np.ones((9, 9), np.uint8)) > 0
    (ex0, ey0), (ex1, ey1) = RIGHT_EDGE
    cols = np.arange(w)[None, :] + x0
    edge = ey0 + (cols - ex0) * (ey1 - ey0) / (ex1 - ex0)
    feather &= ~((cols >= ex0) & (rows < edge - 4))
    body_zone = cv2.dilate((body_a > 0.35).astype(np.uint8), np.ones((9, 9), np.uint8)) > 0
    wings = {}
    for side, (bx0, by0, bx1, by1) in WING_BOXES.items():
        box = np.zeros((h, w), bool)
        box[max(0, by0 - y0):by1 - y0, max(0, bx0 - x0):bx1 - x0] = True
        shape = (anime > 0.5) & feather & box & ~body_zone
        shape = cv2.morphologyEx(shape.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((7, 7), np.uint8))
        # Opening breaks the thin bridge to the badge ribbon so only the wing is the largest shape.
        shape = cv2.morphologyEx(shape, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (13, 13))) > 0
        shape = largest(shape)
        soft = cv2.GaussianBlur(shape.astype(np.float32), (0, 0), 1.6) * np.clip(anime * 1.4, 0, 1)
        wings[side] = soft

    # Big head: lift the head and cap out of the body layer, scale it about the neck, and lay it back on a
    # slightly narrower torso.
    body_rgba = np.dstack([rgb, body_a * 255])
    torso = Image.fromarray(body_rgba.astype(np.uint8), "RGBA")
    tw, th = round(w * TORSO_SCALE), round(h * TORSO_SCALE)
    pad = 160  # room for the enlarged head; the shared frame is trimmed afterwards
    canvas_w, canvas_h = w + 2 * pad, h + 2 * pad
    canvas = Image.new("RGBA", (canvas_w, canvas_h))
    neck_x = (HEAD["x0"] + HEAD["x1"]) / 2 - x0
    neck_y = HEAD["neck"] - y0
    # Torso scaled about the neck point so the head still sits on it.
    t_off = (pad + round(neck_x - neck_x * TORSO_SCALE), pad + round(neck_y - neck_y * TORSO_SCALE))
    canvas.alpha_composite(torso.resize((tw, th), Image.LANCZOS), t_off)
    hx0, hx1 = HEAD["x0"] - x0, HEAD["x1"] - x0
    head_mask = np.zeros((h, w), np.float32)
    cy, ry = HEAD["cy"] - y0, (HEAD["neck"] - HEAD["cy"])
    cx, rx = (hx0 + hx1) / 2, (hx1 - hx0) / 2
    yy, xx = np.mgrid[0:h, 0:w]
    inside = ((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2
    head_mask = np.clip((1.12 - inside) / 0.12, 0, 1) * (yy < neck_y + 10)
    head_rgba = np.dstack([rgb, body_a * head_mask * 255]).astype(np.uint8)
    head = Image.fromarray(head_rgba, "RGBA")
    hw, hh = round(w * HEAD_SCALE), round(h * HEAD_SCALE)
    h_off = (pad + round(neck_x - neck_x * HEAD_SCALE), pad + round(neck_y - neck_y * HEAD_SCALE))
    canvas.alpha_composite(head.resize((hw, hh), Image.LANCZOS), h_off)

    # Wings go on separate layers in the same canvas frame (unscaled torso offset) so the rig can line them up.
    def wing_layer(alpha):
        layer = Image.fromarray(np.dstack([rgb, alpha * 255]).astype(np.uint8), "RGBA")
        full = Image.new("RGBA", (canvas_w, canvas_h))
        full.alpha_composite(layer.resize((tw, th), Image.LANCZOS), t_off)
        return np.array(full)

    body_np = np.array(canvas)
    left_np, right_np = wing_layer(wings["left"]), wing_layer(wings["right"])
    # One shared frame for all three layers: the union of their boxes.
    union = np.maximum.reduce([body_np[:, :, 3], left_np[:, :, 3], right_np[:, :, 3]])
    ys, xs = np.nonzero(union > 8)
    fx0, fy0, fx1, fy1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
    scale = SIZE / (fx1 - fx0)
    frame = {}
    for name, arr in (("body", body_np), ("wing-left", left_np), ("wing-right", right_np)):
        cut = Image.fromarray(arr[fy0:fy1, fx0:fx1], "RGBA")
        cut = cut.resize((SIZE, round((fy1 - fy0) * scale)), Image.LANCZOS)
        OUT.mkdir(parents=True, exist_ok=True)
        cut.save(OUT / f"{name}.webp", "WEBP", quality=88, method=6)
        frame[name] = cut.size
    # Shoulder pivots (where each wing meets the back), in frame px of the shared canvas.
    def to_frame(px, py):
        cx_ = (px - x0 - neck_x) * TORSO_SCALE + neck_x
        cx_ += pad
        cy_ = (py - y0 - neck_y) * TORSO_SCALE + neck_y + pad
        return [round((cx_ - fx0) * scale), round((cy_ - fy0) * scale)]
    meta = {
        "size": list(frame["body"]),
        "pivots": {"left": to_frame(470, 560), "right": to_frame(840, 560)},
        "head": to_frame((HEAD["x0"] + HEAD["x1"]) / 2, HEAD["cy"] - 190),
    }
    (ROOT / "src/features/legends/guardian.json").write_text(json.dumps(meta, indent=2) + "\n")
    print(json.dumps(meta))


if __name__ == "__main__":
    main()
