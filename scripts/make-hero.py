"""Builds the transparent hero images from assets-src/hero/abstract-dot-mesh.jpg.
The supplied JPG is white dots on pure black. Brightness becomes opacity, so the dots sit on any page colour
with no black rectangle (the CSS inverts them to dark dots in the light theme).
Replace the JPG and run:  python3 scripts/make-hero.py   (needs Pillow + numpy)"""
from PIL import Image
import numpy as np, os
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
src = Image.open(os.path.join(root, "assets-src/hero/abstract-dot-mesh.jpg")).convert("L")
for w, name in ((1600, "abstract-dot-mesh.webp"), (900, "abstract-dot-mesh-sm.webp")):
    h = round(src.height * w / src.width)
    a = np.array(src.resize((w, h), Image.LANCZOS))
    rgba = np.dstack([np.full_like(a, 255)] * 3 + [a])
    out = os.path.join(root, "site/assets/hero", name)
    Image.fromarray(rgba, "RGBA").save(out, "WEBP", quality=88, alpha_quality=92, method=6)
    print(name, w, h, os.path.getsize(out) // 1024, "KB")
