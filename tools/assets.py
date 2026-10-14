"""Builds every raster asset the site ships: logos, favicons, photos, client logos, OG image.

Usage: python tools/assets.py <originals_dir> <generated_dir>
Originals = files pulled from the current izazipestcontrol.co.za; generated = new photography.
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "assets"
ORIG = Path(sys.argv[1])
GEN = Path(sys.argv[2])
FONT = ROOT / "tools" / "Archivo-var.ttf"

INK = (10, 18, 48)


def rgba(path):
    return np.array(Image.open(path).convert("RGBA"))


# ---------------------------------------------------------------- brand logo
def logos():
    im = rgba(ORIG / "pest__Logo-2.png")
    # Nav lockup drops the tiny slogan (illegible at 40px tall); full lockup keeps it.
    nav = im.copy()
    nav[90:235, 700:2470] = 0
    alpha = nav[..., 3]
    ys, xs = np.where(alpha > 0)
    nav = nav[ys.min() - 4 : ys.max() + 5, xs.min() - 4 : xs.max() + 5]

    def save(arr, name, height):
        img = Image.fromarray(arr)
        w = round(img.width * height / img.height)
        img.resize((w, height), Image.LANCZOS).save(OUT / "img" / name, optimize=True)

    save(nav, "logo-color.png", 120)

    # Reversed version for dark surfaces: blue -> white, white fills -> transparent, green kept.
    rev = nav.copy().astype(np.int16)
    r, g, b, a = rev[..., 0], rev[..., 1], rev[..., 2], rev[..., 3]
    white = (r > 200) & (g > 200) & (b > 200)
    blue = (b > 150) & (r < 140) & (g < 140)
    rev[white] = [255, 255, 255, 0]
    rev[blue, 0:3] = [246, 248, 252]
    save(rev.astype(np.uint8), "logo-reversed.png", 120)

    full = im[ys.min() - 4 : ys.max() + 5, xs.min() - 4 : xs.max() + 5]
    save(full, "logo-full.png", 160)


# ---------------------------------------------------------------- favicons
def favicons():
    src = Image.open(ORIG / "logo.png").convert("RGBA")
    arr = np.array(src)
    # The square brand mark sits on white; key white to transparent.
    white = (arr[..., 0] > 235) & (arr[..., 1] > 235) & (arr[..., 2] > 235)
    arr[white, 3] = 0
    mark = Image.fromarray(arr)
    bbox = mark.getbbox()
    mark = mark.crop(bbox)

    def square(size, pad, bg=None):
        canvas = Image.new("RGBA", (size, size), bg or (0, 0, 0, 0))
        inner = size - pad * 2
        m = mark.copy()
        m.thumbnail((inner, inner), Image.LANCZOS)
        canvas.alpha_composite(m, ((size - m.width) // 2, (size - m.height) // 2))
        return canvas

    square(32, 1).save(OUT / "icons" / "favicon-32.png")
    square(16, 0).save(OUT / "icons" / "favicon-16.png")
    square(180, 22, (255, 255, 255, 255)).convert("RGB").save(OUT / "icons" / "apple-touch-icon.png")
    square(192, 24, (255, 255, 255, 255)).save(OUT / "icons" / "icon-192.png")
    square(512, 64, (255, 255, 255, 255)).save(OUT / "icons" / "icon-512.png")
    ico = square(64, 2)
    ico.save(ROOT / "public" / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])


# ---------------------------------------------------------------- photography
PHOTOS = {
    "hero": "hero.png",
    "termites": "termites.png",
    "home": "home.png",
    "food": "food.png",
    "weeds": "weeds.png",
    "borer": "borer.png",
    "pallets": "pallets.png",
    "office-fog": "office-fog.png",
    "roach": "roach.png",
    "rat": "rat.png",
    "industry": "industry.png",
    "leaves": "leaves.png",
}

REAL = {  # the business's own photos, kept at native size
    "office-witbank": "witbank-kantoor.jpg",
    "office-middelburg": "wp5899a17a_05_06.jpg",
    "office-interior": "wpfe92d1d1_05_06.jpg",
    "vehicle-bakkie": "wpa085e909_05_06.jpg",
    "vehicle-car": "spark-web.jpg",
}


def photos():
    for name, file in PHOTOS.items():
        img = Image.open(GEN / file).convert("RGB")
        for w in (1600, 800):
            if w > img.width * 1.1:
                w = img.width
            h = round(img.height * w / img.width)
            out = img.resize((w, h), Image.LANCZOS)
            if w >= 1200:
                out = out.filter(ImageFilter.UnsharpMask(radius=1.2, percent=40, threshold=2))
            out.save(OUT / "img" / f"{name}-{w if w in (1600, 800) else 'full'}.webp", quality=80, method=6)
    for name, file in REAL.items():
        img = Image.open(ORIG / file).convert("RGB")
        if name == "office-witbank":  # drop the old logo banner pasted under the photo
            img = img.crop((0, 0, img.width, 372))
        img.save(OUT / "img" / f"{name}.webp", quality=86, method=6)
    # Low-quality placeholder for the hero so the first paint is never blank.
    hero = Image.open(GEN / "hero.png").convert("RGB")
    hero.resize((48, 27), Image.LANCZOS).save(OUT / "img" / "hero-lqip.webp", quality=50)


# ---------------------------------------------------------------- client logos
CLIENTS = {
    "eskom": "wp8b86811d_06-1.png",
    "anglo-american": "wpa964028b_06.png",
    "exxaro": "wpc23ea81f_06.png",
    "samancor": "wp94457a2b_06.png",
    "bhp": "wp0c5a2354_06.png",
    "woolworths": "wp4363d988_06.png",
    "pick-n-pay": "wpe16ab9a8_06.png",
    "tiger-brands": "wpab7e9d75_06.png",
    "afgri": "wp7bc85e67_06.png",
}


def clients():
    for name, file in CLIENTS.items():
        img = Image.open(ORIG / file).convert("RGBA")
        bg = Image.new("RGBA", img.size, (255, 255, 255, 255))
        bg.alpha_composite(img)
        if name == "tiger-brands":  # the tiger illustration turns to mud in one colour; keep the wordmark
            bg = bg.crop((0, 0, bg.width, round(bg.height * 0.2)))
        lum = np.array(bg.convert("L")).astype(np.float32)
        # Near-white (scanned off-white backgrounds) keys out completely.
        alpha = np.clip((228 - lum) * 1.6, 0, 255).astype(np.uint8)
        out = np.zeros((*alpha.shape, 4), np.uint8)
        out[..., 0:3] = INK
        out[..., 3] = alpha
        mono = Image.fromarray(out)
        mono = mono.crop(mono.getbbox())
        mono.thumbnail((360, 120), Image.LANCZOS)
        mono.save(OUT / "logos" / f"{name}.png", optimize=True)


# ---------------------------------------------------------------- OG / WhatsApp share image
def font(size, wdth, wght):
    f = ImageFont.truetype(str(FONT), size)
    try:
        f.set_variation_by_axes([wght, wdth])
    except Exception:
        pass
    return f


def og():
    W, H = 1200, 630
    hero = Image.open(GEN / "hero.png").convert("RGB")
    scale = max(W / hero.width, H / hero.height)
    hero = hero.resize((round(hero.width * scale), round(hero.height * scale)), Image.LANCZOS)
    x0 = (hero.width - W) // 2
    canvas = hero.crop((x0, 0, x0 + W, H)).convert("RGBA")

    # Navy wash from the left so type always reads.
    grad = Image.new("L", (W, 1))
    for x in range(W):
        t = max(0.0, 1 - x / (W * 0.72))
        grad.putpixel((x, 0), int(235 * t ** 1.15))
    grad = grad.resize((W, H))
    navy = Image.new("RGBA", (W, H), (6, 10, 26, 255))
    navy.putalpha(grad)
    canvas.alpha_composite(navy)

    logo = Image.open(OUT / "img" / "logo-reversed.png").convert("RGBA")
    logo.thumbnail((360, 46), Image.LANCZOS)
    canvas.alpha_composite(logo, (64, 60))

    d = ImageDraw.Draw(canvas)
    big = font(70, 125, 800)
    y = 250
    for line in ("Pest control for", "Mpumalanga,", "since 1985."):
        d.text((62, y), line, font=big, fill=(246, 248, 252))
        y += 78
    small = font(26, 100, 500)
    d.text((64, H - 70), "Witbank 013 690 3180   Middelburg 013 243 2420", font=small, fill=(196, 204, 226))
    canvas.convert("RGB").save(OUT / "og" / "og-image.jpg", quality=86, optimize=True, progressive=True)


if __name__ == "__main__":
    for d in ("img", "icons", "logos", "og"):
        (OUT / d).mkdir(parents=True, exist_ok=True)
    logos()
    favicons()
    photos()
    clients()
    og()
    print("assets ok")
