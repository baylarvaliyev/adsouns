"""
Generates final logo/favicon/OG assets from the real brand SVG (brand-logo-source.svg).
- Crops out the black square background, keeps just the blue 'a' mark, transparent bg
- Produces: nav-logo.png (transparent mark for nav bars)
            favicon-16/32.png, apple-touch-icon.png, android-chrome-192/512.png (mark on dark rounded square)
            og-image.png (1200x630 social preview with real mark)
"""
from svglib.svglib import svg2rlg
from reportlab.graphics import renderPM
from PIL import Image, ImageDraw, ImageFont
import numpy as np
import os

BASE = 'C:/Users/Baylar/Documents/GitHub/adsouns/'

# 1. Render the full SVG at high res using svglib (pure Python, no native deps)
drawing = svg2rlg(BASE+'brand-logo-source.svg')
if drawing is None:
    raise SystemExit('svg2rlg failed to parse the SVG - check the file for issues')
scale = 1080 / drawing.width
drawing.width *= scale
drawing.height *= scale
drawing.scale(scale, scale)
renderPM.drawToFile(drawing, BASE+'_logo_full.png', fmt='PNG', bg=0x000000)

img = Image.open(BASE+'_logo_full.png').convert('RGBA')
arr = np.array(img)

# 2. Remove the black square background -> transparent
is_black = (arr[:,:,0] < 40) & (arr[:,:,1] < 40) & (arr[:,:,2] < 40)
arr[is_black, 3] = 0
out = Image.fromarray(arr, 'RGBA')

# 3. Find tight bounding box of the remaining (blue) content
alpha = arr[:,:,3]
ys, xs = np.where(alpha > 10)
pad = 15
left, right = max(0, xs.min()-pad), min(out.width, xs.max()+pad)
top, bottom = max(0, ys.min()-pad), min(out.height, ys.max()+pad)
mark = out.crop((left, top, right, bottom))
mark.save(BASE + 'nav-logo.png')
print('Saved nav-logo.png', mark.size)

# 4. Favicon / app icon set - mark on dark rounded square
def make_icon(size, bg=(6,10,18,255)):
    icon = Image.new('RGBA', (size, size), bg)
    mask = Image.new('L', (size,size), 0)
    d = ImageDraw.Draw(mask)
    radius = int(size*0.18)
    d.rounded_rectangle([0,0,size-1,size-1], radius=radius, fill=255)

    pad_pct = 0.16
    target_w = int(size*(1-2*pad_pct))
    ratio = target_w / mark.width
    target_h = int(mark.height*ratio)
    m = mark.resize((target_w, target_h), Image.LANCZOS)

    offset_x = (size-target_w)//2
    offset_y = (size-target_h)//2
    icon.paste(m, (offset_x, offset_y), m)

    final = Image.new('RGBA', (size,size), (0,0,0,0))
    final.paste(icon, (0,0), mask)
    return final

for size, fname in [(16,'favicon-16.png'),(32,'favicon-32.png'),(180,'apple-touch-icon.png'),
                     (192,'android-chrome-192.png'),(512,'android-chrome-512.png')]:
    make_icon(size).save(BASE+fname)
    print('Saved', fname)

# 5. OG image (1200x630) with real mark
W, H = 1200, 630
ogimg = Image.new('RGB', (W, H), (6, 10, 18))
overlay = Image.new('RGBA', (W, H), (0,0,0,0))
od = ImageDraw.Draw(overlay)
for r in range(550, 0, -10):
    a = int(16 * (1 - r/550))
    od.ellipse([W*0.72-r, H*0.22-r, W*0.72+r, H*0.22+r], fill=(51,103,247,a))
ogimg = Image.alpha_composite(ogimg.convert('RGBA'), overlay).convert('RGB')
draw = ImageDraw.Draw(ogimg)

font_path = 'C:/Windows/Fonts/segoeuib.ttf'
if not os.path.exists(font_path):
    font_path = 'C:/Windows/Fonts/arialbd.ttf'
font_reg_path = 'C:/Windows/Fonts/segoeui.ttf'
if not os.path.exists(font_reg_path):
    font_reg_path = 'C:/Windows/Fonts/arial.ttf'

font_logo = ImageFont.truetype(font_path, 32)
font_h1   = ImageFont.truetype(font_path, 60)
font_sub  = ImageFont.truetype(font_reg_path, 23)

margin = 90
mark_h = 46
ratio = mark_h / mark.height
mark_w = int(mark.width * ratio)
mark_small = mark.resize((mark_w, mark_h), Image.LANCZOS)
ogimg.paste(mark_small, (margin, 80), mark_small)

draw.text((margin + mark_w + 14, 90), 'AdsOnUs', font=font_logo, fill=(255,255,255))
draw.text((margin, 218), 'Performance Advertising', font=font_h1, fill=(255,255,255))
draw.text((margin, 296), 'That Pays for Itself', font=font_h1, fill=(91,142,255))
draw.text((margin, 408), 'Meta  ·  Google  ·  TikTok  ·  LinkedIn Ads', font=font_sub, fill=(180,190,210))
draw.text((margin, 446), 'Certified Partner Agency   ·   Free 2-Week Trial', font=font_sub, fill=(140,150,170))
draw.rectangle([0, H-8, W, H], fill=(51,103,247))

ogimg.save(BASE+'og-image.png', 'PNG', optimize=True)
print('Saved og-image.png', ogimg.size)

os.remove(BASE+'_logo_full.png')
print('Done.')
