#!/usr/bin/env python3
"""The site's fonts, the app's own: Nunito Sans (the very files the iOS app bundles) and, for the app's Sentinel,
Zilla Slab, a free slab serif close to it (Sentinel's licence doesn't cover the web). Both are SIL OFL.

    python3 tools/fonts.py

Subsets each to Latin and writes WOFF2 files into assets/fonts/, with the OFL texts.
Sources: Nunito Sans from the app (~/Documents/Rebuke/Rebuke/Fonts/), Zilla Slab from google/fonts
(ofl/zillaslab, cached in ~/.cache/rebuke-fonts/zillaslab/). Needs fontTools and brotli.
"""
import os
import shutil

from fontTools import subset

SITE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP_FONTS = os.path.expanduser('~/Documents/Rebuke/Rebuke/Fonts')
ZILLA = os.path.expanduser('~/.cache/rebuke-fonts/zillaslab')
OUT = os.path.join(SITE, 'assets', 'fonts')

# Google Fonts' "latin" range: covers every character the page uses (– ’ “ ” → © ·).
LATIN = ('U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,'
         'U+20AC,U+2122,U+2190-2193,U+2212,U+2215,U+FEFF,U+FFFD')

FONTS = [
    (os.path.join(APP_FONTS, 'NunitoSans-Regular.ttf'), 'nunito-sans-regular.woff2'),
    (os.path.join(APP_FONTS, 'NunitoSans-Medium.ttf'), 'nunito-sans-medium.woff2'),
    (os.path.join(APP_FONTS, 'NunitoSans-SemiBold.ttf'), 'nunito-sans-semibold.woff2'),
    (os.path.join(APP_FONTS, 'NunitoSans-Bold.ttf'), 'nunito-sans-bold.woff2'),
    (os.path.join(APP_FONTS, 'NunitoSans-ExtraBold.ttf'), 'nunito-sans-extrabold.woff2'),
    (os.path.join(ZILLA, 'ZillaSlab-Medium.ttf'), 'zilla-slab-medium.woff2'),
    (os.path.join(ZILLA, 'ZillaSlab-SemiBold.ttf'), 'zilla-slab-semibold.woff2'),
]


def main():
    os.makedirs(OUT, exist_ok=True)
    for src, name in FONTS:
        dst = os.path.join(OUT, name)
        subset.main([src, '--unicodes=' + LATIN, '--layout-features=*', '--flavor=woff2', '--output-file=' + dst])
        print('%-28s %6.1f KB' % (name, os.path.getsize(dst) / 1024))
    shutil.copy(os.path.join(APP_FONTS, 'NunitoSans-OFL.txt'), os.path.join(OUT, 'NunitoSans-OFL.txt'))
    shutil.copy(os.path.join(ZILLA, 'OFL.txt'), os.path.join(OUT, 'ZillaSlab-OFL.txt'))


if __name__ == '__main__':
    main()
