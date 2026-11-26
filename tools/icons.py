#!/usr/bin/env python3
"""The site's icons, made from the iOS app's own icon (Xcode's AppIcon, 1024 px).

    python3 tools/icons.py [path/to/icon.png]

Writes, into assets/ (and favicon.ico at the root):
  mark-128.png        the header and footer mark, masked as iOS masks app icons
  icon-48/96/192.png  the browser tab and search result icons, masked (Google wants a multiple of 48 px)
  icon-64.png         an older tab icon, kept for links to it
  icon-512.png        a large masked copy (README, sharing)
  apple-touch-icon.png  180 px, square and opaque: iOS rounds it itself
  favicon.ico         16, 32 and 48 px, masked, for browsers that ask for /favicon.ico
Needs Pillow and numpy.
"""
import os
import sys

import numpy as np
from PIL import Image

SITE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ICON = os.path.expanduser('~/Documents/Rebuke/Rebuke/Assets.xcassets/AppIcon.appiconset/icon.png')


def squircle(size, n=5.0, ss=4):
    """The superellipse the app's own tools use for iOS's icon shape (tools/shield_icon.py)."""
    k = size * ss
    y, x = np.mgrid[0:k, 0:k]
    u = np.abs((x + 0.5) / k * 2 - 1)
    v = np.abs((y + 0.5) / k * 2 - 1)
    return Image.fromarray(((u ** n + v ** n) <= 1).astype(np.uint8) * 255, 'L').resize((size, size), Image.LANCZOS)


def masked(icon, size):
    im = icon.resize((size, size), Image.LANCZOS).convert('RGBA')
    im.putalpha(squircle(size))
    return im


def main():
    path = sys.argv[1] if len(sys.argv) > 1 else ICON
    icon = Image.open(path).convert('RGB')
    assets = os.path.join(SITE, 'assets')
    for name, size in (('mark-128.png', 128), ('icon-48.png', 48), ('icon-64.png', 64), ('icon-96.png', 96),
                       ('icon-192.png', 192), ('icon-512.png', 512)):
        masked(icon, size).save(os.path.join(assets, name), optimize=True)
    icon.resize((180, 180), Image.LANCZOS).save(os.path.join(assets, 'apple-touch-icon.png'), optimize=True)
    masked(icon, 48).save(os.path.join(SITE, 'favicon.ico'), sizes=[(16, 16), (32, 32), (48, 48)])
    print('icons from', path)


if __name__ == '__main__':
    main()
