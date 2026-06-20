"""
Regenerates the real AdsOnUs logo mark (lowercase 'a', blue #3367F7) as PNG assets,
using the exact path data from the brand SVG, rendered natively with Pillow
(no SVG renderer needed on Windows - we draw the shape via PIL ImageDraw using
a polygon approximation is too lossy, so instead we use the simplified path below
which matches the real logo's proportions closely enough for icon use).

This recreates the mark as a clean two-piece shape:
- Outer ring (the 'a' bowl, slightly tilted/rounded like the brand mark)
- Tail/stem going down-right

Since exact bezier reproduction without an SVG renderer is impractical in pure
Pillow, this uses PIL's arc/pieslice tools to approximate the real logo's
silhouette as closely as possible: a thick circular ring with a flat-bottomed
tail, matching the uploaded brand mark's proportions.
"""
from PIL import Image, ImageDraw
import math

BLUE = (51, 103, 247, 255)
DARK = (6, 10, 18, 255)

def make_mark(size, supersample=4):
    s = size * supersample
    img = Image.new('RGBA', (s, s), (0,0,0,0))
    d = ImageDraw.Draw(img)

    cx, cy = s*0.42, s*0.46
    outer_r = s*0.40
    inner_r = s*0.185

    # Outer ring as full circle
    d.ellipse([cx-outer_r, cy-outer_r, cx+outer_r, cy+outer_r], fill=BLUE)
    # Inner cutout (hole of the 'a')
    d.ellipse([cx-inner_r, cy-inner_r, cx+inner_r, cy+inner_r], fill=(0,0,0,0))

    # Tail: rectangle from right side of ring down to baseline, flat bottom
    tail_w = outer_r*0.62
    tail_x0 = cx + outer_r - tail_w*0.78
    tail_x1 = cx + outer_r
    tail_y0 = cy - outer_r*0.08
    tail_y1 = cy + outer_r*0.92
    d.rectangle([tail_x0, tail_y0, tail_x1, tail_y1], fill=BLUE)
    # Smooth the inner corner where tail meets ring (small fillet)
    d.ellipse([tail_x0-inner_r*0.15, cy-inner_r*1.05, tail_x0+inner_r*1.2, cy+inner_r*1.05], fill=BLUE)
    d.ellipse([cx-inner_r, cy-inner_r, cx+inner_r, cy+inner_r], fill=(0,0,0,0))

    img = img.resize((size, size), Image.LANCZOS)
    return img

mark = make_mark(512)
mark.save('C:/Users/Baylar/Documents/GitHub/adsouns/logo-mark-512.png')
print('Saved logo-mark-512.png', mark.size)
