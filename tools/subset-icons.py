"""Build a small Remix Icon font containing only the icons this site uses.

The full icon set is ~160 KB of CSS plus a ~190 KB font. This downloads it,
scans the HTML pages and assets/js/*.js for `ri-*` classes and writes:
  assets/vendor/remixicon/remixicon-subset.css
  assets/vendor/remixicon/remixicon-subset.woff2

Run it again after adding or changing an icon:
  pip install fonttools brotli
  python tools/subset-icons.py
"""
import io
import re
import urllib.request
from pathlib import Path

from fontTools import subset

ROOT = Path(__file__).resolve().parent.parent
ICON_DIR = ROOT / 'assets' / 'vendor' / 'remixicon'
CDN = 'https://cdn.jsdelivr.net/npm/remixicon@4.9.0/fonts/'
OUT_CSS = ICON_DIR / 'remixicon-subset.css'
OUT_FONT = ICON_DIR / 'remixicon-subset.woff2'

sources = [*sorted(ROOT.glob('*.html')), *sorted((ROOT / 'assets' / 'js').glob('*.js'))]
used = sorted({m for f in sources for m in re.findall(r'\bri-[a-z0-9-]+', f.read_text(encoding='utf-8'))})


def fetch(name):
    with urllib.request.urlopen(CDN + name, timeout=30) as response:
        return response.read()


css = fetch('remixicon.css').decode('utf-8')
codepoints = {name: cp for name, cp in re.findall(r'\.(ri-[a-z0-9-]+):before\s*\{\s*content:\s*"\\([0-9a-f]+)"', css)}

missing = [name for name in used if name not in codepoints]
if missing:
    raise SystemExit(f'Unknown icon class(es): {", ".join(missing)}')

options = subset.Options()
options.flavor = 'woff2'
options.layout_features = []
font = subset.load_font(io.BytesIO(fetch('remixicon.woff2')), options)
subsetter = subset.Subsetter(options)
subsetter.populate(unicodes=[int(codepoints[n], 16) for n in used])
subsetter.subset(font)
subset.save_font(font, str(OUT_FONT), options)

rules = '\n'.join(f'.{n}:before {{ content: "\\{codepoints[n]}"; }}' for n in used)
OUT_CSS.write_text(f'''/* Remix Icon v4 subset (Remix Icon License 1.0, https://remixicon.com).
   Built by tools/subset-icons.py; do not edit by hand. */
@font-face {{
  font-family: "remixicon";
  src: url("remixicon-subset.woff2") format("woff2");
  font-display: block;
}}

[class^="ri-"], [class*=" ri-"] {{
  font-family: "remixicon" !important;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}}

{rules}
''', encoding='utf-8', newline='\n')

print(f'{len(used)} icons -> {OUT_FONT.stat().st_size / 1024:.1f} KB font, {OUT_CSS.stat().st_size / 1024:.1f} KB CSS')
