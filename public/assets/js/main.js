(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  var NAV_H = 72;

  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // ------------------------------------------------------------------ smooth scroll
  var lenis = null;
  if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger);
    if (!reduce && window.Lenis && !window.matchMedia("(pointer: coarse)").matches) {
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
  }
  function scrollToEl(el) {
    if (lenis) lenis.scrollTo(el, { offset: -NAV_H - 8, duration: 1.3 });
    else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute("href").slice(1);
    var el = id === "top" ? document.body : document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    if (id === "top" && lenis) lenis.scrollTo(0, { duration: 1.4 });
    else scrollToEl(el);
    if (id !== "top") history.replaceState(null, "", "#" + id);
  });

  // ------------------------------------------------------------------ nav
  var nav = $("[data-nav]");
  var hero = $("[data-hero]");
  if (nav && hero) {
    new IntersectionObserver(
      function (es) { nav.classList.toggle("is-solid", !es[0].isIntersecting); },
      { rootMargin: "-" + NAV_H + "px 0px 0px 0px" }
    ).observe(hero);
  }
  if (nav && hasGsap) {
    ScrollTrigger.create({
      start: "top -400",
      end: "max",
      onUpdate: function (self) {
        if (nav.classList.contains("is-open")) return;
        nav.classList.toggle("is-hidden", self.direction === 1 && self.scroll() > 400);
      },
      onLeaveBack: function () { nav.classList.remove("is-hidden"); },
    });
  }
  nav && nav.addEventListener("focusin", function () { nav.classList.remove("is-hidden"); });

  var toggle = $("[data-menu-toggle]");
  var menu = $("[data-menu]");
  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.querySelector(".sr-only").textContent = open ? "Close menu" : "Open menu";
    menu.hidden = !open;
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (lenis) open ? lenis.stop() : lenis.start();
    if (open) {
      nav.classList.remove("is-hidden");
      if (hasGsap && !reduce) {
        gsap.fromTo($$("li", menu), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.04, ease: "expo.out" });
      }
    }
  }
  if (toggle && menu) {
    toggle.addEventListener("click", function () { setMenu(menu.hidden); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) { setMenu(false); toggle.focus(); }
    });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    window.matchMedia("(min-width: 1081px)").addEventListener("change", function (e) { if (e.matches) setMenu(false); });
  }

  // ------------------------------------------------------------------ hero
  var fog = hero && window.IzaziFog ? window.IzaziFog(hero, { reduce: reduce }) : null;

  if (hero && hasGsap && !reduce) {
    var img = $("[data-hero-img]", hero);
    var media = $(".hero__media", hero);
    // Rack focus: the lens finds the scene while the fog rolls in.
    var tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.fromTo(img, { scale: 1.14, filter: "blur(18px) brightness(0.55)" }, { scale: 1, filter: "blur(0px) brightness(1)", duration: 2.6, clearProps: "filter" })
      .from($$(".hero__title .line > span", hero), { yPercent: 115, duration: 1.3, stagger: 0.09 }, 0.35)
      .from($$("[data-hero-in]", hero), { y: 22, opacity: 0, duration: 1.1, stagger: 0.1 }, 0.75);
    if (fog) fog.intro(3.2);

    gsap.to(media, {
      yPercent: 14, ease: "none",
      scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
    });
    gsap.to($(".hero__inner", hero), {
      y: -70, opacity: 0, ease: "none",
      scrollTrigger: { trigger: hero, start: "35% top", end: "90% top", scrub: true },
    });
    if (fog) {
      ScrollTrigger.create({
        trigger: hero, start: "top top", end: "bottom top",
        onUpdate: function (s) { fog.setProgress(s.progress); },
      });
    }
  }

  // ------------------------------------------------------------------ scroll choreography
  if (hasGsap && !reduce) {
    // Statement: words light up as you read down the line.
    $$("[data-words]").forEach(function (el) {
      el.innerHTML = el.textContent.trim().split(/\s+/).map(function (w) { return '<span class="w">' + w + "</span>"; }).join(" ");
      gsap.fromTo($$(".w", el), { opacity: 0.3 }, {
        opacity: 1, stagger: 0.06, ease: "none",
        scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 48%", scrub: 0.6 },
      });
    });

    var mm = gsap.matchMedia();

    // Services: vertical scroll drives a horizontal pan; each photo drifts inside its frame for depth.
    mm.add("(min-width: 901px)", function () {
      var section = $("[data-pan]");
      var track = $("[data-pan-track]");
      if (!section || !track) return;
      section.classList.add("is-pinned");
      var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
      var tween = gsap.to(track, {
        x: function () { return -dist(); }, ease: "none",
        scrollTrigger: {
          trigger: section, start: "top top", end: function () { return "+=" + dist(); },
          pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
        },
      });
      $$(".pan__media img", track).forEach(function (im) {
        gsap.fromTo(im, { xPercent: 7 }, {
          xPercent: -7, ease: "none",
          scrollTrigger: { trigger: im.closest(".pan__card"), containerAnimation: tween, start: "left right", end: "right left", scrub: true },
        });
      });
      return function () { section.classList.remove("is-pinned"); };
    });

    // Rack focus on key photographs: blurred and slightly long, then sharp as they settle.
    $$(".focus, .bento__img").forEach(function (im) {
      gsap.fromTo(im, { filter: "blur(14px)", scale: 1.12 }, {
        filter: "blur(0px)", scale: 1, ease: "power2.out",
        scrollTrigger: { trigger: im.parentElement, start: "top 88%", end: "top 35%", scrub: 0.8 },
      });
    });

    // Full-bleed photographs: slow dolly-in as the section passes.
    $$("[data-zoom]").forEach(function (box) {
      gsap.fromTo($("img", box), { scale: 1.22, yPercent: -6 }, {
        scale: 1, yPercent: 6, ease: "none",
        scrollTrigger: { trigger: box.parentElement, start: "top bottom", end: "bottom top", scrub: true },
      });
    });

    // Bento numbers and team photos settle in once, in reading order.
    gsap.utils.toArray(".bento__cell, .team__grid figure, .doc, .pillars__list > div").forEach(function (el, i) {
      gsap.from(el, {
        y: 36, opacity: 0, duration: 1.1, ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
    });

    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
  }

  // ------------------------------------------------------------------ services sticky media
  var frames = $$("[data-svc-frame]");
  if (frames.length) {
    var show = function (id) {
      frames.forEach(function (f) { f.classList.toggle("is-active", f.getAttribute("data-svc-frame") === id); });
    };
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) show(e.target.getAttribute("data-svc-item")); });
    }, { rootMargin: "-45% 0px -45% 0px" });
    $$("[data-svc-item]").forEach(function (el) { io.observe(el); });
  }

  // ------------------------------------------------------------------ quote form
  var form = $("[data-quote]");
  if (!form) return;
  var status = $("[data-form-status]", form);
  var defaultNote = status ? status.textContent : "";
  var select = $("#q-service", form);

  $$("[data-prefill]").forEach(function (a) {
    a.addEventListener("click", function () { if (select) select.value = a.getAttribute("data-prefill"); });
  });

  function setError(input, msg) {
    var err = document.getElementById(input.id + "-err");
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    if (msg) input.setAttribute("aria-describedby", err.id); else input.removeAttribute("aria-describedby");
    if (err) err.hidden = !msg;
  }
  function validate() {
    var ok = true;
    var name = $("#q-name", form), phone = $("#q-phone", form);
    if (!name.value.trim()) { setError(name, true); ok = false; } else setError(name, false);
    if (phone.value.replace(/\D/g, "").length < 10) { setError(phone, true); ok = false; } else setError(phone, false);
    if (!ok) { var first = $('[aria-invalid="true"]', form); first && first.focus(); }
    return ok;
  }
  $$("input[required]", form).forEach(function (input) {
    input.addEventListener("blur", function () { if (input.getAttribute("aria-invalid") === "true") validate(); });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate()) return;
    var via = (e.submitter && e.submitter.value) || "whatsapp";
    var data = new FormData(form);
    var branch = $("#q-branch", form).selectedOptions[0];
    var lines = [
      "Hi Izazi, I would like a quote.",
      "",
      "Name: " + data.get("name"),
      "Phone: " + data.get("phone"),
      data.get("town") ? "Area: " + data.get("town") : null,
      "Branch: " + branch.textContent,
      "Service: " + data.get("service"),
      data.get("message") ? "Details: " + data.get("message") : null,
    ].filter(function (l) { return l !== null; }).join("\n");

    if (via === "email") {
      window.location.href = "mailto:" + branch.getAttribute("data-email") +
        "?subject=" + encodeURIComponent("Quote request: " + data.get("service")) +
        "&body=" + encodeURIComponent(lines);
      status.textContent = "Your email app should open with the message filled in. Press send to reach the " + branch.textContent + " branch.";
    } else {
      window.open("https://wa.me/" + branch.getAttribute("data-wa") + "?text=" + encodeURIComponent(lines), "_blank", "noopener");
      status.textContent = "WhatsApp opened with your message filled in. Press send to reach the " + branch.textContent + " branch.";
    }
    status.classList.add("is-ok");
    setTimeout(function () { status.textContent = defaultNote; status.classList.remove("is-ok"); }, 12000);
  });
})();
