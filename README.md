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

## Run locally

```bash
python3 -m http.server 8140
```

Then open http://localhost:8140.

## Fonts

Nunito Sans (body) and Newsreader (headings), both from Google Fonts. The app uses Sentinel for scripture, which is
licensed for the app only, so the site uses Newsreader in its place.

## Scripture

Scripture quotations are from the Berean Standard Bible (BSB), public domain.
