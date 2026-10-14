// Static site generator for the Izazi Pest Control site. No dependencies: `node tools/build.mjs`.
// Writes the finished site to dist/ (deployed to GitHub Pages by .github/workflows/deploy.yml).
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { site, pages } from "../src/content.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const ICONS = join(ROOT, "tools", "phosphor");
const YEAR = new Date().getFullYear();

const iconCache = {};
export function icon(name, cls = "") {
  iconCache[name] ??= readFileSync(join(ICONS, `${name}.svg`), "utf8").trim();
  return iconCache[name].replace(
    "<svg ",
    `<svg class="icon ${cls}" aria-hidden="true" focusable="false" width="1em" height="1em" `,
  );
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const abs = (slug) => `${site.url}/${slug ? slug + "/" : ""}`;

// ------------------------------------------------------------------ shared chrome
function nav(page, r) {
  const items = site.nav
    .map(
      (n) =>
        `<li><a href="${r}${n.slug ? n.slug + "/" : ""}"${n.slug === page.slug ? ' aria-current="page"' : ""}>${n.label}</a></li>`,
    )
    .join("");
  return `
<a class="skip" href="#main">Skip to content</a>
<header class="nav" data-nav>
  <div class="nav__bar wrap">
    <a class="nav__brand" href="${r}" aria-label="Izazi Pest Control home">
      <img class="logo logo--rev" src="${r}assets/img/logo-reversed.png" alt="Izazi Pest Control" width="962" height="120">
      <img class="logo logo--color" src="${r}assets/img/logo-color.png" alt="" aria-hidden="true" width="962" height="120">
    </a>
    <nav class="nav__links" aria-label="Main">
      <ul>${items}</ul>
    </nav>
    <div class="nav__actions">
      <a class="nav__phone" href="tel:${site.branches[1].tel[0].href}">${icon("phone")}<span>${site.branches[1].tel[0].label}</span></a>
      <a class="btn btn--primary btn--sm" href="${r}contact-us/#quote">Request a quote</a>
      <button class="nav__toggle" type="button" aria-expanded="false" aria-controls="menu" data-menu-toggle>
        <span class="sr-only">Open menu</span>${icon("list", "i-open")}${icon("x", "i-close")}
      </button>
    </div>
  </div>
  <div class="menu" id="menu" data-menu hidden>
    <ul class="wrap">${items}</ul>
    <div class="menu__foot wrap">
      ${site.branches.map((b) => `<a href="tel:${b.tel[0].href}">${icon("phone")} ${b.name} ${b.tel[0].label}</a>`).join("")}
    </div>
  </div>
</header>`;
}

function footer(r) {
  return `
<footer class="footer">
  <div class="wrap footer__grid">
    <div class="footer__brand">
      <img class="logo logo--color" src="${r}assets/img/logo-full.png" alt="Izazi Pest Control, service excellence since 1985" width="1282" height="160" loading="lazy">
      <img class="logo logo--rev" src="${r}assets/img/logo-reversed.png" alt="" aria-hidden="true" width="962" height="120" loading="lazy">
      <p>Environmentally friendly pest control for homes, businesses, mines and food producers in Mpumalanga, Gauteng and Limpopo.</p>
    </div>
    ${site.branches
      .map(
        (b) => `
    <div class="footer__col">
      <h2 class="footer__h">${b.name} branch</h2>
      <address>${b.address.join("<br>")}</address>
      <ul>
        ${b.tel.map((t) => `<li><a href="tel:${t.href}">${t.label}</a></li>`).join("")}
        ${b.email.map((e) => `<li><a href="mailto:${e}">${e}</a></li>`).join("")}
      </ul>
    </div>`,
      )
      .join("")}
    <div class="footer__col">
      <h2 class="footer__h">Pages</h2>
      <ul>${site.nav.map((n) => `<li><a href="${r}${n.slug ? n.slug + "/" : ""}">${n.label}</a></li>`).join("")}</ul>
    </div>
  </div>
  <div class="wrap footer__base">
    <p>&copy; <span data-year>${YEAR}</span> Izazi Pest Control. B-BBEE Level 4 contributor. Member of SAPCA.</p>
    <a href="#top" data-to-top>Back to top</a>
  </div>
</footer>`;
}

function head(page, r) {
  const url = abs(page.slug);
  const og = `${site.url}/assets/og/og-image.jpg`;
  const ld = [site.schema(page), page.slug ? breadcrumb(page) : null].filter(Boolean);
  return `<!doctype html>
<html lang="en-ZA">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#F3F5F9" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#060A1A" media="(prefers-color-scheme: dark)">
<meta name="color-scheme" content="light dark">
<meta name="format-detection" content="telephone=no">
<meta name="geo.region" content="ZA-MP">
<meta name="geo.placename" content="Witbank, Middelburg">

<meta property="og:type" content="website">
<meta property="og:site_name" content="Izazi Pest Control">
<meta property="og:locale" content="en_ZA">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(page.ogTitle || page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:image" content="${og}">
<meta property="og:image:secure_url" content="${og}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Izazi technician fogging a warehouse. Pest control for Mpumalanga, since 1985.">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(page.ogTitle || page.title)}">
<meta name="twitter:description" content="${esc(page.description)}">
<meta name="twitter:image" content="${og}">

<link rel="icon" href="${r}favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="${r}assets/icons/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="${r}assets/icons/favicon-16.png">
<link rel="apple-touch-icon" href="${r}assets/icons/apple-touch-icon.png">
<link rel="manifest" href="${r}site.webmanifest">

<link rel="preload" href="${r}assets/fonts/archivo-var-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" as="image" href="${r}assets/img/${page.hero.img}-1600.webp" imagesrcset="${r}assets/img/${page.hero.img}-800.webp 800w, ${r}assets/img/${page.hero.img}-1600.webp 1600w" imagesizes="(orientation: portrait) 200vh, 100vw" fetchpriority="high">
<link rel="stylesheet" href="${r}assets/css/site.css">
${ld.map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join("\n")}
</head>`;
}

function breadcrumb(page) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: abs("") },
      { "@type": "ListItem", position: 2, name: page.navLabel, item: abs(page.slug) },
    ],
  };
}

export function hero(page, r) {
  const h = page.hero;
  return `
<section class="hero ${h.home ? "hero--home" : "hero--page"}" data-hero>
  <div class="hero__media">
    <img class="hero__img" src="${r}assets/img/${h.img}-1600.webp" srcset="${r}assets/img/${h.img}-800.webp 800w, ${r}assets/img/${h.img}-1600.webp 1600w" sizes="(orientation: portrait) 200vh, 100vw" alt="${esc(h.alt)}" width="1600" height="${h.height || 900}" fetchpriority="high" style="--pos:${h.pos || "50% 50%"}" data-hero-img>
    <canvas class="hero__fog" data-fog data-source="${h.source || "0.5,0.6"}" data-density="${h.density ?? 1}" data-tint="${h.tint || "cool"}" aria-hidden="true"></canvas>
    ${h.dust ? `<canvas class="hero__dust" data-dust aria-hidden="true"></canvas>` : ""}
    <div class="hero__shade" aria-hidden="true"></div>
  </div>
  <div class="hero__inner wrap">
    ${h.kicker ? `<p class="hero__kicker" data-hero-in>${h.kicker}</p>` : ""}
    <h1 class="hero__title">${h.lines.map((l) => `<span class="line"><span>${l}</span></span>`).join(" ")}</h1>
    ${h.sub ? `<p class="hero__sub" data-hero-in>${h.sub}</p>` : ""}
    ${h.ctas ? `<div class="hero__ctas" data-hero-in>${h.ctas(r)}</div>` : ""}
  </div>
</section>`;
}

function scripts(r, page) {
  return `
<script src="${r}assets/vendor/gsap.min.js" defer></script>
<script src="${r}assets/vendor/ScrollTrigger.min.js" defer></script>
<script src="${r}assets/vendor/lenis.min.js" defer></script>
<script src="${r}assets/js/fog.js" defer></script>
<script src="${r}assets/js/main.js" defer></script>`;
}

function render(page) {
  const r = page.slug ? "../" : "";
  return `${head(page, r)}
<body id="top" class="page-${page.slug || "home"}">
${nav(page, r)}
<main id="main">
${hero(page, r)}
${page.body({ r, icon, site })}
</main>
${footer(r)}
${scripts(r, page)}
</body>
</html>
`;
}

// ------------------------------------------------------------------ write
rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });
cpSync(join(ROOT, "public"), DIST, { recursive: true });

for (const page of pages) {
  const dir = page.slug ? join(DIST, page.slug) : DIST;
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), render(page));
}

// 404: GitHub Pages serves it from any depth, so it uses absolute asset URLs.
{
  const nf = {
    ...pages[0],
    slug: "",
    title: "Page not found | Izazi Pest Control",
    description: "This page does not exist. Find pest control services, branches and contact details for Izazi Pest Control.",
    hero: {
      img: "rat",
      alt: "A rat in a dark storeroom",
      lines: ["This page has", "gone to ground."],
      sub: "The link may be old. Our services, branches and phone numbers are one click away.",
      ctas: (r) => `<a class="btn btn--primary" href="${r}">Go to the home page</a><a class="btn btn--glass" href="${r}contact-us/">Contact a branch</a>`,
      source: "0.3,0.4",
      density: 0.7,
    },
    body: () => "",
  };
  const html = render(nf)
    .replace(/(href|src|srcset|imagesrcset)="(?!https?:|#|tel:|mailto:|\/)/g, `$1="${site.base}/`)
    .replace(/, (assets\/img\/)/g, `, ${site.base}/$1`)
    .replace('<meta name="robots" content="index, follow, max-image-preview:large">', '<meta name="robots" content="noindex">')
    .replace(/<link rel="canonical"[^>]*>\n/, "");
  writeFileSync(join(DIST, "404.html"), html);
}

const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages
  .map(
    (p) => `  <url>
    <loc>${abs(p.slug)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${p.slug ? "0.8" : "1.0"}</priority>
    <image:image><image:loc>${site.url}/assets/img/${p.hero.img}-1600.webp</image:loc></image:image>
  </url>`,
  )
  .join("\n")}
</urlset>
`,
);
writeFileSync(join(DIST, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);
writeFileSync(
  join(DIST, "site.webmanifest"),
  JSON.stringify(
    {
      name: "Izazi Pest Control",
      short_name: "Izazi",
      start_url: "./",
      display: "standalone",
      background_color: "#F3F5F9",
      theme_color: "#1B2CF0",
      icons: [
        { src: "assets/icons/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "assets/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
    },
    null,
    2,
  ),
);
writeFileSync(join(DIST, ".nojekyll"), "");

console.log(`built ${pages.length} pages + 404 -> dist/ (${readdirSync(DIST).length} entries)`);
