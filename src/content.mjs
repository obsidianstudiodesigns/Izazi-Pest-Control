// All site copy lives here. Facts are taken from the current izazipestcontrol.co.za; nothing is invented.

const base = "/Izazi-Pest-Control";

export const site = {
  // Change this one line when the site moves to izazipestcontrol.co.za.
  url: `https://obsidianstudiodesigns.github.io${base}`,
  base,
  nav: [
    { slug: "", label: "Home" },
    { slug: "about-us", label: "About" },
    { slug: "services", label: "Services" },
    { slug: "environment", label: "Environment" },
    { slug: "sustainability", label: "Compliance" },
    { slug: "contact-us", label: "Contact" },
  ],
  branches: [
    {
      id: "middelburg",
      name: "Middelburg",
      address: ["Wonderpark", "Walter Sisulu Street", "Middelburg, Mpumalanga"],
      street: "Wonderpark, Walter Sisulu Street",
      city: "Middelburg",
      tel: [
        { label: "013 243 2420", href: "+27132432420" },
        { label: "064 870 4984", href: "+27648704984" },
      ],
      email: ["izazi@middelburgpest.co.za"],
      img: "office-middelburg",
      imgW: 323,
      imgH: 297,
      imgAlt: "The Izazi Pest Control shopfront in Middelburg",
      map: "https://www.google.com/maps/search/?api=1&query=Wonderpark+Walter+Sisulu+Street+Middelburg+Mpumalanga",
      embed: "https://maps.google.com/maps?q=Walter%20Sisulu%20Street%2C%20Middelburg%2C%20Mpumalanga&z=15&output=embed",
    },
    {
      id: "witbank",
      name: "Witbank",
      address: ["Office 212 B, 22 Corridor Crescent", "Witbank Central", "eMalahleni, Mpumalanga"],
      street: "Office 212 B, 22 Corridor Crescent, Witbank Central",
      city: "eMalahleni",
      tel: [
        { label: "013 690 3180", href: "+27136903180" },
        { label: "083 518 7418", href: "+27835187418" },
      ],
      email: ["sales@witbankpest.co.za", "admin@witbankpest.co.za"],
      img: "office-witbank",
      imgW: 650,
      imgH: 372,
      imgAlt: "The office building that houses the Izazi Pest Control Witbank branch",
      map: "https://www.google.com/maps/search/?api=1&query=22+Corridor+Crescent+Witbank+Emalahleni",
      embed: "https://maps.google.com/maps?q=22%20Corridor%20Crescent%2C%20Emalahleni&z=15&output=embed",
    },
  ],
  whatsapp: "27835187418",
  schema(page) {
    const org = {
      "@type": "Organization",
      "@id": `${this.url}/#org`,
      name: "Izazi Pest Control",
      url: `${this.url}/`,
      logo: `${this.url}/assets/img/logo-full.png`,
      image: `${this.url}/assets/og/og-image.jpg`,
      foundingDate: "1985",
      slogan: "Service excellence since 1985",
      description:
        "Environmentally friendly pest control, termite control, weed control, borer beetle treatment, HACCP food-safety programmes and disinfection fogging in Mpumalanga.",
      areaServed: ["Mpumalanga", "Gauteng", "Limpopo"],
      memberOf: [{ "@type": "Organization", name: "South African Pest Control Association (SAPCA)" }],
    };
    const branches = this.branches.map((b) => ({
      "@type": "LocalBusiness",
      "@id": `${this.url}/#${b.id}`,
      name: `Izazi Pest Control ${b.name}`,
      parentOrganization: { "@id": `${this.url}/#org` },
      url: `${this.url}/contact-us/`,
      image: `${this.url}/assets/img/${b.img}.webp`,
      telephone: b.tel.map((t) => t.href),
      email: b.email[0],
      priceRange: "Quote on request",
      address: {
        "@type": "PostalAddress",
        streetAddress: b.street,
        addressLocality: b.city,
        addressRegion: "Mpumalanga",
        addressCountry: "ZA",
      },
      areaServed: ["Mpumalanga", "Gauteng", "Limpopo"],
      makesOffer: services.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.name } })),
    }));
    return { "@context": "https://schema.org", "@graph": [org, ...branches] };
  },
};

export const services = [
  {
    id: "termites",
    name: "Termite control",
    img: "termites",
    imgW: "full",
    alt: "Termites tunnelling through damaged timber",
    short: "Soil treatments and barriers that stop subterranean termites before they reach your timber.",
    long: "Pre-construction soil poisoning for new builds and curative treatments for existing homes and buildings. We inspect, locate the colony's access points and treat the soil and structure so termites cannot return.",
  },
  {
    id: "rodents",
    name: "Rodent control",
    img: "rat",
    alt: "A rat moving along a storeroom wall between grain sacks",
    short: "Tamper-resistant bait stations, monitoring and proofing for plants, warehouses and homes.",
    long: "Rats and mice spoil stock, chew cabling and spread disease. We place and service lockable bait stations on a fixed schedule, map activity and seal entry points, with records ready for your auditor.",
  },
  {
    id: "nuisance-pests",
    name: "Nuisance pests",
    img: "roach",
    alt: "A cockroach on a kitchen floor at night",
    short: "Cockroaches, ants, flies, fleas, bed bugs and spiders, treated at the source.",
    long: "Gel baits, residual sprays and targeted treatments for kitchens, bedrooms, offices and outbuildings. We find where the infestation starts rather than spraying where it shows.",
  },
  {
    id: "borer-beetles",
    name: "Borer beetles",
    img: "borer",
    alt: "A wood borer beetle emerging from an exit hole in a roof beam",
    short: "Inspection and treatment of roof timbers, flooring and furniture.",
    long: "Fresh exit holes and fine powder under timber mean active borer. We assess the damage and treat roof trusses, floors and furniture to stop the next generation emerging.",
  },
  {
    id: "food-safety",
    name: "Food safety (HACCP)",
    img: "food",
    alt: "A technician checking a rodent bait station in a food factory",
    short: "Documented, audit-ready pest programmes for food production, storage and retail.",
    long: "HACCP-compliant programmes with site maps, scheduled services, trend reports and certificates. Trusted by national retailers and food producers across Mpumalanga.",
  },
  {
    id: "weed-control",
    name: "Weed control",
    img: "weeds",
    alt: "A technician spraying weeds along a fence line at sunrise",
    short: "Fence lines, yards and industrial verges kept clear with registered herbicides.",
    long: "Selective and non-selective weed control for mines, plants, substations, sports fields and estates. Clear perimeters reduce fire risk and keep security fences visible.",
  },
  {
    id: "disinfection",
    name: "Disinfection fogging",
    img: "office-fog",
    alt: "A technician fogging an empty office with disinfectant",
    short: "Fogging for offices, homes, warehouses, vehicles and common areas.",
    long: "Disinfectant fogging that kills bacteria and slows the spread of fungi and flu viruses. The products we use are non-toxic, non-irritating and environmentally friendly. Suitable for taxis, buses and fleet vehicles.",
  },
  {
    id: "ispm-15",
    name: "ISPM 15 pallets",
    img: "pallets",
    alt: "Stacks of wooden export pallets at sunset",
    short: "Treatment and certification of wooden packaging for export.",
    long: "Wooden pallets and crates that cross borders must meet the ISPM 15 standard. We hold an ISPM 15 certificate and treat and mark packaging so your shipments clear inspection.",
  },
];

const img = (r, name, alt, { w = 1600, sizes = "100vw", lazy = true, cls = "", width = 1600, height = 1067 } = {}) => {
  const big = w === "full" ? `${name}-full` : `${name}-1600`;
  return `<img class="${cls}" src="${r}assets/img/${big}.webp" srcset="${r}assets/img/${name}-800.webp 800w, ${r}assets/img/${big}.webp ${w === "full" ? 960 : 1600}w" sizes="${sizes}" alt="${alt}" width="${width}" height="${height}"${lazy ? ' loading="lazy" decoding="async"' : ""}>`;
};

const clients = [
  ["eskom", "Eskom"],
  ["anglo-american", "Anglo American"],
  ["exxaro", "Exxaro"],
  ["samancor", "Samancor"],
  ["bhp", "BHP Billiton"],
  ["woolworths", "Woolworths"],
  ["pick-n-pay", "Pick n Pay"],
  ["tiger-brands", "Tiger Brands"],
  ["afgri", "Afgri"],
];

const quoteForm = ({ r, icon }) => `
<section class="quote" id="quote" aria-labelledby="quote-h">
  <div class="wrap quote__grid">
    <div class="quote__intro">
      <h2 id="quote-h" class="h2">Request a quote</h2>
      <p>Tell us what you are dealing with and where. A technician from your nearest branch will call you back to arrange an inspection.</p>
      <ul class="quote__direct">
        ${site.branches
          .map(
            (b) =>
              `<li><span>${b.name}</span><a href="tel:${b.tel[0].href}">${icon("phone")} ${b.tel[0].label}</a></li>`,
          )
          .join("")}
        <li><span>WhatsApp</span><a href="https://wa.me/${site.whatsapp}" rel="noopener" target="_blank">${icon("whatsapp-logo")} 083 518 7418</a></li>
      </ul>
    </div>
    <form class="form" data-quote novalidate>
      <div class="field">
        <label for="q-name">Your name</label>
        <input id="q-name" name="name" autocomplete="name" required>
        <p class="field__err" id="q-name-err" hidden>Enter your name so we know who to ask for.</p>
      </div>
      <div class="field">
        <label for="q-phone">Phone number</label>
        <input id="q-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required>
        <p class="field__err" id="q-phone-err" hidden>Enter a phone number with at least 10 digits.</p>
      </div>
      <div class="field">
        <label for="q-town">Town or suburb</label>
        <input id="q-town" name="town" autocomplete="address-level2">
      </div>
      <div class="field">
        <label for="q-branch">Nearest branch</label>
        <select id="q-branch" name="branch">
          <option value="witbank" data-wa="27835187418" data-email="sales@witbankpest.co.za">Witbank</option>
          <option value="middelburg" data-wa="27648704984" data-email="izazi@middelburgpest.co.za">Middelburg</option>
        </select>
      </div>
      <div class="field field--wide">
        <label for="q-service">What do you need help with?</label>
        <select id="q-service" name="service">
          ${services.map((s) => `<option>${s.name}</option>`).join("")}
          <option>Something else</option>
        </select>
      </div>
      <div class="field field--wide">
        <label for="q-msg">Details <span class="field__opt">(optional)</span></label>
        <textarea id="q-msg" name="message" rows="4" placeholder="For example: droppings in the storeroom, about 400 m², business hours only."></textarea>
      </div>
      <div class="form__actions field--wide">
        <button class="btn btn--primary" type="submit" name="via" value="whatsapp">${icon("whatsapp-logo")} Send on WhatsApp</button>
        <button class="btn btn--ghost" type="submit" name="via" value="email">${icon("envelope-simple")} Send by email</button>
      </div>
      <p class="form__note field--wide" data-form-status role="status" aria-live="polite">Your message opens in WhatsApp or your email app, ready to send. Nothing is stored on this website.</p>
    </form>
  </div>
</section>`;

const ctaQuote = (r) =>
  `<a class="btn btn--primary" href="${r}contact-us/#quote">Request a quote</a><a class="btn btn--glass" href="tel:+27136903180">Call 013 690 3180</a>`;

// ================================================================== pages
export const pages = [
  // ---------------------------------------------------------------- HOME
  {
    slug: "",
    navLabel: "Home",
    title: "Izazi Pest Control | Pest Control in Witbank & Middelburg",
    ogTitle: "Izazi Pest Control | Mpumalanga, since 1985",
    description:
      "Termite, rodent, weed and HACCP pest control for homes, factories and mines in Witbank, Middelburg and Mpumalanga. Environmentally friendly service since 1985.",
    hero: {
      home: true,
      img: "hero",
      alt: "An Izazi technician in a protective suit fogging a warehouse at dawn",
      pos: "68% 50%",
      source: "0.705,0.6",
      density: 1,
      dust: true,
      lines: ["Pest control for", "Mpumalanga, since 1985."],
      sub: "Termite, rodent, weed and food-safety programmes for homes, factories and mines across Witbank, Middelburg and beyond.",
      ctas: ctaQuote,
    },
    body: ({ r, icon }) => `
<section class="clients" aria-labelledby="clients-h">
  <div class="wrap clients__head">
    <h2 id="clients-h" class="clients__h">Trusted by Mpumalanga's largest operators for over three decades</h2>
  </div>
  <div class="marquee" data-marquee>
    <ul class="marquee__track">
      ${[...clients, ...clients]
        .map(
          ([f, n], i) =>
            `<li${i >= clients.length ? ' aria-hidden="true"' : ""}><img src="${r}assets/logos/${f}.png" alt="${i >= clients.length ? "" : n}" loading="lazy" height="44"></li>`,
        )
        .join("")}
    </ul>
  </div>
</section>

<section class="statement wrap" aria-label="Who we are">
  <p class="statement__text" data-words>Small enough to know every client by name. Large enough to look after Eskom sites, mines and national retailers.</p>
  <div class="statement__foot">
    <p>Izazi left the franchise model to give clients the best of both worlds: decades of industry knowledge, with the personal care of a business that answers its own phones.</p>
    <a class="link" href="${r}about-us/">About Izazi ${icon("arrow-right")}</a>
  </div>
</section>

<section class="pan" aria-labelledby="pan-h" data-pan>
  <div class="pan__head wrap">
    <h2 id="pan-h" class="h2">What we treat</h2>
    <a class="link" href="${r}services/">All services ${icon("arrow-right")}</a>
  </div>
  <div class="pan__viewport">
    <ul class="pan__track" data-pan-track>
      ${services
        .map(
          (s) => `
      <li class="pan__card">
        <a href="${r}services/#${s.id}">
          <div class="pan__media">${img(r, s.img, s.alt, { w: s.imgW, sizes: "(max-width: 900px) 80vw, 34vw" })}</div>
          <h3>${s.name}</h3>
          <p>${s.short}</p>
        </a>
      </li>`,
        )
        .join("")}
    </ul>
  </div>
</section>

<section class="facts wrap" aria-labelledby="facts-h">
  <h2 id="facts-h" class="h2 facts__h">Experience you can check</h2>
  <div class="bento">
    <div class="bento__cell bento__cell--photo bento__a">
      ${img(r, "industry", "A mining and processing plant on the Mpumalanga highveld at dusk", { sizes: "(max-width: 900px) 100vw, 50vw", cls: "bento__img", height: 900 })}
      <div class="bento__over">
        <p class="bento__num">1985</p>
        <p>Izazi has served the Mpumalanga region since 1985, including most of its larger mines, power stations and food producers.</p>
      </div>
    </div>
    <div class="bento__cell bento__b">
      <p class="bento__num">100+</p>
      <p>Years of combined pest-control experience across the team.</p>
    </div>
    <div class="bento__cell bento__cell--accent bento__c">
      <p class="bento__num">12-20</p>
      <p>Years most of our technicians have been with the company, under the same manager.</p>
    </div>
    <div class="bento__cell bento__d">
      <p class="bento__num">Level 4</p>
      <p>B-BBEE contributor, growing ownership for previously disadvantaged entrepreneurs.</p>
    </div>
    <div class="bento__cell bento__cell--photo bento__e">
      ${img(r, "home", "A technician treating the perimeter of a face-brick home at dusk", { sizes: "(max-width: 900px) 100vw, 50vw", cls: "bento__img" })}
    </div>
  </div>
</section>

<section class="green" aria-labelledby="green-h">
  <div class="green__media" data-zoom>
    ${img(r, "leaves", "Spekboom leaves covered in morning dew", { cls: "green__img" })}
  </div>
  <div class="green__inner wrap">
    <h2 id="green-h" class="green__quote"><span>&ldquo;Environmentally friendly service&rdquo;</span> has been our motto for decades.</h2>
    <p>We use low-toxicity products, many imported from Australia, applied by trained staff to the standard of the Occupational Health and Safety Act.</p>
    <a class="btn btn--glass" href="${r}environment/">How we work safely</a>
  </div>
</section>

<section class="why wrap" aria-labelledby="why-h">
  <figure class="why__media">
    ${img(r, "food", "A technician checking a rodent bait station in a food factory", { sizes: "(max-width: 900px) 100vw, 45vw", cls: "focus" })}
  </figure>
  <div class="why__body">
    <h2 id="why-h" class="h2">Built for audited sites</h2>
    <p class="lead">Mines, power stations and food plants check our paperwork before we arrive. It is always in order.</p>
    <div class="why__groups">
      <div>
        <h3>Registered</h3>
        <ul class="ticks">
          <li>${icon("check")} Remedies registered with the Department of Agriculture</li>
          <li>${icon("check")} Technicians registered with the Department of Agriculture</li>
          <li>${icon("check")} SABS-approved chemicals</li>
          <li>${icon("check")} HACCP compliant for food safety</li>
        </ul>
      </div>
      <div>
        <h3>Accountable</h3>
        <ul class="ticks">
          <li>${icon("check")} Members of SAPCA, PCSIB and PMA</li>
          <li>${icon("check")} NOSA SHE system followed on site</li>
          <li>${icon("check")} Current methods and equipment</li>
          <li>${icon("check")} Written guarantees on our work</li>
        </ul>
      </div>
    </div>
    <a class="link" href="${r}sustainability/">View our certificates ${icon("arrow-right")}</a>
  </div>
</section>

<section class="branches wrap" aria-labelledby="branches-h">
  <h2 id="branches-h" class="h2">Visit or call a branch</h2>
  <div class="branches__grid">
    ${site.branches
      .map(
        (b) => `
    <article class="branch">
      <img class="branch__img" src="${r}assets/img/${b.img}.webp" alt="${b.imgAlt}" loading="lazy" width="${b.imgW}" height="${b.imgH}">
      <div class="branch__body">
        <h3>${b.name}</h3>
        <address>${b.address.join(", ")}</address>
        <ul>
          ${b.tel.map((t) => `<li><a href="tel:${t.href}">${icon("phone")} ${t.label}</a></li>`).join("")}
          ${b.email.slice(0, 1).map((e) => `<li><a href="mailto:${e}">${icon("envelope-simple")} ${e}</a></li>`).join("")}
        </ul>
        <a class="link" href="${b.map}" target="_blank" rel="noopener">Get directions ${icon("arrow-up-right")}</a>
      </div>
    </article>`,
      )
      .join("")}
  </div>
</section>

${quoteForm({ r, icon })}
`,
  },

  // ---------------------------------------------------------------- ABOUT
  {
    slug: "about-us",
    navLabel: "About",
    title: "About Izazi Pest Control | Since 1985 in Mpumalanga",
    description:
      "Izazi Pest Control has protected Mpumalanga homes, mines and food producers since 1985. Meet the team, our philosophy and our B-BBEE commitment.",
    hero: {
      img: "home",
      height: 1067,
      alt: "A technician treating the perimeter of a family home at dusk",
      pos: "60% 50%",
      source: "0.66,0.8",
      density: 0.45,
      tint: "warm",
      lines: ["Personal service,", "four decades deep."],
      sub: "A Mpumalanga business with more than 100 years of combined experience and the same management since day one.",
    },
    body: ({ r, icon }) => `
<section class="prose-split wrap" aria-labelledby="phil-h">
  <h2 id="phil-h" class="h2">Our philosophy</h2>
  <div class="prose">
    <p class="lead">Izazi Pest Control provides safe, environmentally friendly solutions to pest problems, at a fair price and to a high standard, for every client, big or small.</p>
    <p>Customer satisfaction comes first. We combine value for money with integrity, trained staff and a commitment to solving every part of a pest problem with the most efficient and effective control methods available.</p>
    <p>We use the safest technology and chemicals, tested and approved in South Africa and abroad.</p>
    <p>Izazi chose to leave the franchise model. That keeps us small enough to give personal care, and large enough to meet the needs of national companies.</p>
  </div>
</section>

<section class="team" aria-labelledby="team-h">
  <div class="wrap">
    <h2 id="team-h" class="h2">Our professional team</h2>
    <p class="lead team__lead">Four people in administration look after every booking, report and certificate. Our service teams cover Mpumalanga, Gauteng and parts of Limpopo, with new branches planned.</p>
  </div>
  <div class="wrap team__grid">
    <figure class="team__a"><img src="${r}assets/img/office-witbank.webp" alt="The Witbank office building" width="650" height="372" loading="lazy"><figcaption>Witbank branch</figcaption></figure>
    <figure class="team__b"><img src="${r}assets/img/vehicle-bakkie.webp" alt="An Izazi Pest Control branded service bakkie" width="323" height="297" loading="lazy"><figcaption>One of our four service vehicles</figcaption></figure>
    <figure class="team__c"><img src="${r}assets/img/office-interior.webp" alt="Inside the Izazi Pest Control office" width="323" height="297" loading="lazy"><figcaption>Administration</figcaption></figure>
    <figure class="team__d"><img src="${r}assets/img/office-middelburg.webp" alt="The Middelburg branch shopfront" width="323" height="297" loading="lazy"><figcaption>Middelburg branch</figcaption></figure>
    <figure class="team__e"><img src="${r}assets/img/vehicle-car.webp" alt="An Izazi Pest Control branded car" width="650" height="492" loading="lazy"><figcaption>Branded and easy to recognise on your property</figcaption></figure>
  </div>
</section>

<section class="pillars wrap" aria-labelledby="pillars-h">
  <h2 id="pillars-h" class="sr-only">What clients get</h2>
  <dl class="pillars__list">
    <div><dt>${icon("shield-check")} Solutions, not visits</dt><dd>We find the cause of an infestation and fix it.</dd></div>
    <div><dt>${icon("users-three")} Trained staff</dt><dd>Technicians with 12 to 20 years at Izazi.</dd></div>
    <div><dt>${icon("clock")} Personal service</dt><dd>You speak to the people who do the work.</dd></div>
    <div><dt>${icon("certificate")} Value for money</dt><dd>Honest quotes and written guarantees.</dd></div>
  </dl>
</section>

<section class="bbbee" aria-labelledby="bbbee-h">
  <div class="wrap bbbee__grid">
    <div>
      <p class="bbbee__num">Level 4</p>
      <h2 id="bbbee-h" class="h2">B-BBEE and responsibility</h2>
    </div>
    <div class="prose">
      <p>As a small enterprise, Izazi Pest Control is a Level 4 B-BBEE contributor. The level will be reviewed as our operations grow.</p>
      <p>As part of our social development programme, we are identifying and appointing previously disadvantaged people as owners of their own small pest-control enterprises in Limpopo, Gauteng and Mpumalanga.</p>
      <a class="link" href="${r}sustainability/">View our B-BBEE certificate ${icon("arrow-right")}</a>
    </div>
  </div>
</section>

${quoteForm({ r, icon })}
`,
  },

  // ---------------------------------------------------------------- SERVICES
  {
    slug: "services",
    navLabel: "Services",
    title: "Pest Control Services | Termites, Rodents, HACCP | Izazi",
    description:
      "Termite control, rodent control, borer beetles, weed control, HACCP food-safety programmes, disinfection fogging and ISPM 15 pallets in Mpumalanga.",
    hero: {
      img: "office-fog",
      height: 1067,
      alt: "A technician fogging an empty office with disinfectant at night",
      pos: "35% 50%",
      source: "0.33,0.4",
      density: 0.8,
      lines: ["Eight services,", "one standard."],
      sub: "From a single kitchen to a coal mine perimeter, every job gets trained staff, registered products and written guarantees.",
    },
    body: ({ r, icon }) => `
<section class="prose-split wrap" aria-labelledby="offer-h">
  <h2 id="offer-h" class="h2">What we offer</h2>
  <div class="prose">
    <p class="lead">Expertise in pest control is what you are paying for. With more than three decades in the industry, we combine deep knowledge with environmentally friendly chemicals.</p>
    <p>Our skilled staff have between 12 and 20 years with the company. For more than 30 years we have serviced most of the larger companies in Mpumalanga, including Samancor, Eskom, Exxaro, Anglo American, BHP Billiton, Pick n Pay, Woolworths, Afgri and Tiger Brands.</p>
  </div>
</section>

<section class="svc" aria-label="Services in detail" data-svc>
  <div class="wrap svc__grid">
    <div class="svc__stage" aria-hidden="true">
      ${services
        .map(
          (s, i) =>
            `<div class="svc__frame${i === 0 ? " is-active" : ""}" data-svc-frame="${s.id}">${img(r, s.img, "", { w: s.imgW, sizes: "(max-width: 900px) 100vw, 45vw", lazy: i > 0 })}</div>`,
        )
        .join("")}
    </div>
    <ol class="svc__list">
      ${services
        .map(
          (s) => `
      <li class="svc__item" id="${s.id}" data-svc-item="${s.id}">
        <div class="svc__thumb">${img(r, s.img, s.alt, { w: s.imgW, sizes: "100vw" })}</div>
        <h2>${s.name}</h2>
        <p class="svc__short">${s.short}</p>
        <p>${s.long}</p>
        <a class="link" href="#quote" data-prefill="${s.name}">Request a quote for ${s.name.toLowerCase().replace(" (haccp)", "")} ${icon("arrow-right")}</a>
      </li>`,
        )
        .join("")}
    </ol>
  </div>
</section>

<section class="checklist wrap" aria-labelledby="choose-h">
  <h2 id="choose-h" class="h2">Why clients choose Izazi</h2>
  <ul class="checklist__grid">
    <li>${icon("check")} Remedies registered with the Department of Agriculture</li>
    <li>${icon("check")} HACCP compliant for food-safety requirements</li>
    <li>${icon("check")} Staff registered with the Department of Agriculture</li>
    <li>${icon("check")} SABS-approved chemicals</li>
    <li>${icon("check")} Members of SAPCA, PCSIB and PMA</li>
    <li>${icon("check")} Current technology and methods</li>
    <li>${icon("check")} Personal attention on every job</li>
    <li>${icon("check")} Excellent written guarantees</li>
  </ul>
</section>

${quoteForm({ r, icon })}
`,
  },

  // ---------------------------------------------------------------- ENVIRONMENT
  {
    slug: "environment",
    navLabel: "Environment",
    title: "Safe, Environmentally Friendly Pest Control | Izazi",
    description:
      "Izazi Pest Control complies with the OHS Act 85 of 1993 and Hazardous Substances Act 15 of 1973, follows NOSA SHE and uses environmentally friendly products.",
    hero: {
      img: "leaves",
      height: 1067,
      alt: "Fresh spekboom leaves with morning dew",
      pos: "50% 50%",
      source: "0.5,0.85",
      density: 0.4,
      tint: "warm",
      lines: ["We are a", "green company."],
      sub: "“Environmentally friendly service” is our motto. It shapes every product we choose and every job we do.",
    },
    body: ({ r, icon }) => `
<section class="prose-split wrap" aria-labelledby="motto-h">
  <h2 id="motto-h" class="h2">Safe for people, pets and the places they live</h2>
  <div class="prose">
    <p class="lead">Izazi Pest Control promotes a safe and healthy environment, and complies with the Occupational Health and Safety Act (85 of 1993).</p>
    <p>We use environmentally friendly products wherever possible, many imported from Australia, a world leader in safe and reliable pest-control chemistry.</p>
    <p>The highest standards apply whenever we use any chemical. Constant training has been part of our company for more than 30 years, so our teams keep up with new developments in the industry.</p>
  </div>
</section>

<section class="she" aria-labelledby="she-h">
  <div class="she__media" data-zoom>
    ${img(r, "industry", "A mining and processing plant on the highveld at dusk", { cls: "she__img", height: 900 })}
  </div>
  <div class="wrap she__inner">
    <h2 id="she-h" class="h2">Safety, health and environment</h2>
    <p class="lead">For years we have serviced most of the mines in Mpumalanga and various Eskom sites. Full compliance is a condition of working there.</p>
    <ul class="she__acts">
      <li><strong>Act 85 of 1993</strong><span>All our systems and services follow the Occupational Health and Safety Act.</span></li>
      <li><strong>Act 15 of 1973</strong><span>We comply with the Hazardous Substances Act for every chemical and process we use.</span></li>
      <li><strong>NOSA SHE</strong><span>We follow the NOSA safety, health and environment system on site.</span></li>
      <li><strong>SANS standards</strong><span>We follow relevant skills development and SANS safety standards for the pest-control industry.</span></li>
    </ul>
  </div>
</section>

<section class="next wrap">
  <h2 class="h2">See the paperwork</h2>
  <p>Our SAPCA membership, B-BBEE, tax and COID documents are available to download.</p>
  <a class="btn btn--primary" href="${r}sustainability/">View certificates</a>
</section>
`,
  },

  // ---------------------------------------------------------------- COMPLIANCE (slug kept for SEO)
  {
    slug: "sustainability",
    navLabel: "Compliance",
    title: "Compliance & Certificates | Izazi Pest Control",
    description:
      "Download Izazi Pest Control's compliance documents: SAPCA membership, B-BBEE certificate, tax clearance, COID letter of good standing, ISPM 15 and CSD registration.",
    hero: {
      img: "industry",
      alt: "A mining and processing plant on the highveld at dusk",
      pos: "50% 50%",
      source: "0.3,0.25",
      density: 0.55,
      lines: ["Compliance,", "on the record."],
      sub: "Procurement teams can download our registrations and certificates here, without waiting for an email.",
    },
    body: ({ r, icon }) => {
      const docs = [
        ["South African Pest Control Association", "SAPCA membership certificate", "2021/06/SAPCA-Certificate-_Izazi-Pest-Control-_-FPC001.pdf"],
        ["B-BBEE certificate", "Level 4 contributor", "2021/06/NAP-Coetzee-2021-Certificate.pdf"],
        ["Tax clearance", "SARS tax compliance status", "2021/06/SARS-pin-2021.pdf"],
        ["COID letter of good standing", "Compensation for Occupational Injuries and Diseases", "2021/06/COID-letter-of-good-standing-22.pdf"],
        ["ISPM 15 certificate", "Treatment of wood packaging for export", "2021/11/ISPM-15-CERTIFICATE-NAP-COETZEE.pdf"],
        ["Central Supplier Database", "Registered supplier to government", "2019/10/2.CSDRegistrationSummaryReportMaster.pdf"],
        ["CIPC registration", "Sole proprietor national database certificate", "2019/10/cipc-sole-trade-doc.pdf"],
      ];
      return `
<section class="docs wrap" aria-labelledby="docs-h">
  <h2 id="docs-h" class="h2">Certificates and registrations</h2>
  <ul class="docs__grid">
    ${docs
      .map(
        ([t, d, f]) => `
    <li class="doc">
      <a href="https://izazipestcontrol.co.za/wp-content/uploads/${f}" target="_blank" rel="noopener">
        <span class="doc__icon">${icon("file-pdf")}</span>
        <span class="doc__t">${t}</span>
        <span class="doc__d">${d}</span>
        <span class="doc__cta">Open PDF ${icon("arrow-up-right")}</span>
      </a>
    </li>`,
      )
      .join("")}
  </ul>
  <p class="docs__note">Need a current copy for a tender or vendor application? Email <a href="mailto:admin@witbankpest.co.za">admin@witbankpest.co.za</a> and we will send the latest version.</p>
</section>

<section class="next wrap">
  <h2 class="h2">Need a pest-control contractor for your site?</h2>
  <p>We work to mine, Eskom and HACCP requirements as standard.</p>
  <a class="btn btn--primary" href="${r}contact-us/#quote">Request a quote</a>
</section>`;
    },
  },

  // ---------------------------------------------------------------- CONTACT
  {
    slug: "contact-us",
    navLabel: "Contact",
    title: "Contact Izazi Pest Control | Witbank & Middelburg Branches",
    description:
      "Call Izazi Pest Control in Witbank on 013 690 3180 or Middelburg on 013 243 2420, WhatsApp us, or request a quote online. Serving Mpumalanga since 1985.",
    hero: {
      img: "weeds",
      height: 1067,
      alt: "A technician spraying weeds along a fence line at sunrise",
      pos: "70% 50%",
      source: "0.45,0.7",
      density: 0.6,
      tint: "warm",
      lines: ["We are always", "ready to help."],
      sub: "Two branches, a WhatsApp line and a technician who knows your area.",
    },
    body: ({ r, icon }) => `
<section class="contact wrap" aria-label="Branches">
  ${site.branches
    .map(
      (b) => `
  <article class="contact__branch" id="${b.id}">
    <div class="contact__info">
      <h2 class="h2">${b.name} branch</h2>
      <address>${b.address.join("<br>")}</address>
      <ul>
        ${b.tel.map((t) => `<li><a href="tel:${t.href}">${icon("phone")} ${t.label}</a></li>`).join("")}
        ${b.email.map((e) => `<li><a href="mailto:${e}?subject=Website%20enquiry">${icon("envelope-simple")} ${e}</a></li>`).join("")}
      </ul>
      <a class="link" href="${b.map}" target="_blank" rel="noopener">Open in Google Maps ${icon("arrow-up-right")}</a>
    </div>
    <div class="contact__map">
      <iframe title="Map of the ${b.name} branch" src="${b.embed}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
  </article>`,
    )
    .join("")}
</section>

${quoteForm({ r, icon })}
`,
  },
];
