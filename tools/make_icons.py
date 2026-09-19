"""יוצר את אייקוני האפליקציה (פרח לבן על רקע ורוד). הרצה: python3 tools/make_icons.py"""
import math
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

OUT = Path(__file__).resolve().parent.parent / "icons"
OUT.mkdir(exist_ok=True)

TOP = (226, 160, 175)     # ורוד בהיר
BOTTOM = (178, 98, 121)   # ורוד עתיק


def gradient(size):
    img = Image.new("RGB", (size, size))
    px = img.load()
    for y in range(size):
        for x in range(size):
            t = min(1.0, max(0.0, (x * 0.35 + y) / (size * 1.35)))
            px[x, y] = tuple(round(TOP[i] + (BOTTOM[i] - TOP[i]) * t) for i in range(3))
    return img


def flower(size, scale):
    """שכבת RGBA עם פרח. scale = חלק מהאייקון שהפרח תופס."""
    layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    cx = cy = size / 2
    r = size * scale / 2
    petal_r = r * 0.42
    ring = r * 0.52
    for i in range(6):
        a = math.radians(i * 60 - 90)
        px, py = cx + ring * math.cos(a), cy + ring * math.sin(a)
        d.ellipse([px - petal_r, py - petal_r, px + petal_r, py + petal_r], fill=(255, 255, 255, 235))
    # עיגול פנימי
    cr = r * 0.36
    d.ellipse([cx - cr, cy - cr, cx + cr, cy + cr], fill=(247, 225, 230, 255))
    cr2 = r * 0.2
    d.ellipse([cx - cr2, cy - cr2, cx + cr2, cy + cr2], fill=(214, 138, 156, 255))
    return layer


def make(size, scale, name):
    big = size * 4  # ציור בגודל כפול וכיווץ לקצוות חלקים
    base = gradient(big).convert("RGBA")
    shadow = flower(big, scale).split()[3].filter(ImageFilter.GaussianBlur(big * 0.02))
    shade = Image.new("RGBA", (big, big), (120, 50, 70, 0))
    shade.putalpha(shadow.point(lambda v: v * 0.35))
    base.alpha_composite(shade, (0, int(big * 0.012)))
    base.alpha_composite(flower(big, scale))
    base.resize((size, size), Image.LANCZOS).convert("RGB").save(OUT / name, optimize=True)


make(180, 0.62, "apple-touch-icon.png")
make(192, 0.62, "icon-192.png")
make(512, 0.62, "icon-512.png")
make(512, 0.48, "icon-maskable-512.png")  # שוליים בטוחים לאנדרואיד
print("icons written to", OUT)
