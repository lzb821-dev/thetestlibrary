#!/usr/bin/env python3
"""
Generate favicon + PWA icons for The Test Library.
Run: python scripts/generate-icons.py

The mark is drawn as geometry (no font dependency): a lavender "T" on the
site's dark background. Everything is rendered at 4x then downsampled so the
16px favicon stays crisp.
"""
import os
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = ROOT
os.makedirs(OUT, exist_ok=True)

BG = (12, 13, 15, 255)       # #0c0d0f
FG = (196, 181, 253, 255)    # #c4b5fd
SS = 4                       # supersampling factor


def render(size: int, safe: float = 1.0) -> Image.Image:
    """Draw the T mark at `size` px. `safe` shrinks the mark for maskable icons."""
    s = size * SS
    img = Image.new("RGBA", (s, s), BG)
    d = ImageDraw.Draw(img)

    # The mark lives inside a centered square of side s*safe.
    inset = (s - s * safe) / 2
    unit = s * safe

    # T crossbar: full width of the safe box, 14% tall, sitting near the top.
    bar_h = unit * 0.14
    bar_top = inset + unit * 0.24
    bar_left = inset + unit * 0.18
    bar_right = inset + unit * 0.82
    d.rectangle([bar_left, bar_top, bar_right, bar_top + bar_h], fill=FG)

    # T stem: 14% wide, centered, from just under the bar to the lower safe edge.
    stem_w = unit * 0.14
    stem_l = (s - stem_w) / 2
    stem_top = bar_top + bar_h
    stem_bottom = inset + unit * 0.76
    d.rectangle([stem_l, stem_top, stem_l + stem_w, stem_bottom], fill=FG)

    return img.resize((size, size), Image.LANCZOS)


def save_png(size, name, safe=1.0):
    render(size, safe).save(os.path.join(OUT, name), "PNG")
    print(f"  {name} ({size}x{size})")


print("Generating icons:")

# Individual PNG favicons
for sz in (16, 32, 48):
    save_png(sz, f"favicon-{sz}.png")

# Apple touch icon (iOS adds its own rounded mask)
save_png(180, "apple-touch-icon.png")

# PWA icons — keep the mark inside the 80% safe zone so maskable cropping is fine
save_png(192, "icon-192.png", safe=0.8)
save_png(512, "icon-512.png", safe=0.8)

# Multi-resolution ICO
ico_sizes = [(16, 16), (32, 32), (48, 48)]
ico_base = render(48)
ico_base.save(os.path.join(OUT, "favicon.ico"), "ICO", sizes=ico_sizes)
print("  favicon.ico (16/32/48)")

print(f"Done. Icons written to {OUT}")
