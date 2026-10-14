# Izazi Pest Control website

A static site for Izazi Pest Control (Witbank and Middelburg, Mpumalanga). It's a redesign of izazipestcontrol.co.za.

Live: https://obsidianstudiodesigns.github.io/Izazi-Pest-Control/

## Structure

- `src/content.mjs`: all copy, services, branch details, SEO titles and descriptions, and structured data
- `tools/build.mjs`: a static generator with no dependencies; it writes `dist/`
- `public/assets/`: CSS, JS (GSAP, ScrollTrigger and Lenis are vendored), fonts, images, icons and the OG image
- `public/assets/js/fog.js`: the WebGL fog and dust-mote effect used in the heroes
- `tools/assets.py`: regenerates logos, favicons, WebP photos, client logos and the WhatsApp/OG card
- `.github/workflows/deploy.yml`: builds and deploys to GitHub Pages on every push to `main`

## Build locally

```bash
node tools/build.mjs
python -m http.server 4321 --directory dist
```

## Moving to the real domain

Change `url` in `src/content.mjs` to `https://izazipestcontrol.co.za` (and `base` to `""`), then push.
The canonical URLs, sitemap, Open Graph tags and structured data all update from that one value.
