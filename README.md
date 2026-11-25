# cruxbible.com

The marketing site for **Crux Bible**, the iPhone app that helps you meet God before you meet the world: one clear
visual Bible lesson each morning, a 365-day journey from Genesis to Revelation, and your distracting apps locked
until you've spent time with Him.

Plain HTML, CSS and a little JavaScript. No build step. Hosted on GitHub Pages at https://cruxbible.com.

## Files

- `index.html`: the whole page. The hero's lesson cards and the "How it works" diagram are inline SVG.
- `styles.css`: colours (the app's Sunlight yellow and green), type and layout. Mobile first breakpoints at 900 and 640 px.
- `script.js`: the poster marquee, the rotating word, the header shadow and the hero cards' scroll drift.
  Everything respects `prefers-reduced-motion`.
- `art/`: flat illustrations as WebP (`posters/`, `lens.webp`, `morning.webp`). Originals live in `art/raw/`
  (not committed).
- `assets/`: icons and the share image (`og.jpg`, 1200 x 630).
- `tools/`: `gen_image.py` / `gen_flat.sh` (OpenAI image generation, medium quality) and `prompts/flat/`.
- `CNAME`: the custom domain.
- `firebase/`: the Firestore rules for the launch list (below).

## Launch list

Until the app is on the App Store, every "Notify me at launch" button (hero, final section, the nav's "Get Crux Bible",
the FAQ link, and the shareable link https://cruxbible.com/#notify) opens a popup that asks for an email address and
saves it to **Cloud Firestore** in the app's Firebase project, `rebuke-visuals`.

- **Where:** collection `waitlist` in the `(default)` database (location `nam5`, United States, delete protection on).
  Each entry has `email` (trimmed, lowercased), `source` (which button: `hero`, `nav`, `final`, `faq` or `link`) and
  `createdAt` (server time). The document id is the SHA-256 of the email, so the same address is only stored once.
  See them at https://console.firebase.google.com/project/rebuke-visuals/firestore/databases/-default-/data/~2Fwaitlist
- **How:** `script.js` writes through the Firestore REST API with no SDK and no API key.
  `firebase/firestore.rules` lets the web create a `waitlist` entry of exactly that shape and nothing else: no reads,
  no changes, no deletes, and no other collections.
- **Rules deploy:** these are the project's only Firestore rules, so anything else that uses Firestore later must add
  its rules to this file.

```bash
cd firebase && npx --yes firebase-tools@15.36.0 deploy --only firestore:rules --project rebuke-visuals
```

When the app is out, swap the buttons back to an App Store link and email the list.

## Search

The page aims at two searches: **"crux bible"** (the name) and **"visual bible"**. The words sit in the `<title>`, the
meta description, the hero `<h1>`, the lead line, the first two FAQ answers and the footer. Put them only where they
read naturally.

- `index.html`'s `<head>` holds JSON-LD structured data (`WebSite`, `Organization`, `WebPage`, `FAQPage`). The
  `WebSite` name is what Google shows as the site name. If you change an FAQ answer, change it in the JSON-LD as well.
- `sitemap.xml` lists the page and its images. Update `lastmod` when the page changes.
- At launch, add a `MobileApplication` entry with the App Store link and price, and the `apple-itunes-app` meta tag.

## Run locally

```bash
python3 -m http.server 8140
```

Then open http://localhost:8140.

## Fonts and icon

The app's own, self-hosted (no Google Fonts request):

- **Nunito Sans**, the very files the iOS app bundles, drawn a step lighter than each weight's name as the app draws
  it.
- **Zilla Slab** for the headings, in place of the app's **Sentinel**: Sentinel's licence covers the app, not the web,
  and Zilla Slab is the closest free slab serif (same width, lining figures). Both fonts are SIL OFL; their licences
  are in `assets/fonts/`.

`python3 tools/fonts.py` rebuilds the WOFF2 files (needs fontTools and brotli); `python3 tools/icons.py` rebuilds the
mark, the tab icon, the Apple touch icon and `favicon.ico` from the app's icon in Xcode
(`Rebuke/Assets.xcassets/AppIcon.appiconset/icon.png`).

## Scripture

Scripture quotations on this site are from the Berean Standard Bible (BSB), public domain. The app itself has seven
versions: NIV, NASB, KJV, BSB, WEB, ASV and WEB Catholic.
