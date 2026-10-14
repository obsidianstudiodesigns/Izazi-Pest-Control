/* Volumetric fog + floating dust for the photographic heroes.
   Fog: a domain-warped fBm field rendered in WebGL at half resolution, screen-blended over the photo.
   It billows out of a source point placed on the photo (the fogger nozzle on the home page), drifts
   away from it, parts around the cursor, and thins out as the hero scrolls away.
   Dust: soft motes with depth (size, blur, speed) that only light up inside the window light shafts. */
(function () {
  "use strict";

  var VERT = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
  var FRAG = [
    // Phones honour mediump (desktops silently use highp); the noise hash needs highp or it collapses to flat.
    "#ifdef GL_FRAGMENT_PRECISION_HIGH",
    "precision highp float;",
    "#else",
    "precision mediump float;",
    "#endif",
    "uniform vec2 uRes;uniform float uTime;uniform vec2 uMouse;uniform float uMouseAmt;",
    "uniform vec2 uSource;uniform float uDensity;uniform vec3 uTintA;uniform vec3 uTintB;uniform float uBeams;",
    "float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}",
    "float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);",
    " return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);}",
    "float fbm(vec2 p){float v=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);",
    " for(int i=0;i<5;i++){v+=a*noise(p);p=m*p;a*=.5;}return v;}",
    "void main(){",
    " vec2 uv=gl_FragCoord.xy/uRes;float aspect=uRes.x/uRes.y;",
    " vec2 p=vec2(uv.x*aspect,uv.y);float t=uTime;",
    // cursor pushes the fog aside like air from a passing hand
    " vec2 m=vec2(uMouse.x*aspect,uMouse.y);vec2 d=p-m;float md=length(d);",
    " p+=(d/(md+.0001))*.14*uMouseAmt*exp(-md*md*9.);",
    // plume direction: away from the source, slightly rising
    " vec2 flow=vec2(t*.045,-t*.008);",
    " vec2 q=vec2(fbm(p*1.25+flow),fbm(p*1.25+vec2(5.2,1.3)+flow*.7));",
    " vec2 r=vec2(fbm(p*1.6+2.8*q+vec2(1.7,9.2)+flow*1.7),fbm(p*1.6+2.8*q+vec2(8.3,2.8)-flow*.4));",
    " float f=fbm(p*1.15+2.3*r+flow*2.2);",
    " vec2 ds=(uv-uSource)*vec2(.85,1.9);float plume=exp(-dot(ds,ds)*3.);",
    " float ground=smoothstep(.72,.02,uv.y);",
    " float mask=clamp(ground*.65+plume*.95,0.,1.);",
    " float dens=smoothstep(.34,.95,f)*mask*uDensity;",
    // light shafts from high windows, upper left, falling to the lower right
    " float beam=pow(max(0.,sin((uv.x*.82+uv.y*1.)*13.+1.1+t*.015)),12.);",
    " beam*=smoothstep(.1,.9,uv.y)*smoothstep(.9,.05,uv.x)*uBeams;",
    " float haze=(.06+.3*f)*beam*(.4+uDensity*.6);",
    " vec3 col=mix(uTintA,uTintB,smoothstep(.3,1.,f));",
    " float a=clamp(dens*.8+haze,0.,.92);",
    " gl_FragColor=vec4(col*a,a);",
    "}",
  ].join("\n");

  var TINTS = {
    cool: [[0.56, 0.62, 0.74], [0.9, 0.93, 0.98]],
    warm: [[0.74, 0.66, 0.56], [1.0, 0.95, 0.86]],
  };

  function compile(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }

  // Map a point on the photo (fractions of the image) to canvas uv (y up), honouring object-fit: cover.
  function photoToUv(img, canvas, ix, iy) {
    var cr = canvas.getBoundingClientRect();
    var ir = img.getBoundingClientRect();
    var nw = img.naturalWidth || +img.getAttribute("width") || 1600;
    var nh = img.naturalHeight || +img.getAttribute("height") || 900;
    var scale = Math.max(ir.width / nw, ir.height / nh);
    var dw = nw * scale, dh = nh * scale;
    var pos = (getComputedStyle(img).objectPosition || "50% 50%").split(" ");
    var px = parseFloat(pos[0]) / 100, py = parseFloat(pos[1] || pos[0]) / 100;
    var ox = (ir.width - dw) * px, oy = (ir.height - dh) * py;
    var x = ir.left - cr.left + ox + ix * dw;
    var y = ir.top - cr.top + oy + iy * dh;
    return [x / cr.width, 1 - y / cr.height];
  }

  function Fog(hero, reduce) {
    var canvas = hero.querySelector("[data-fog]");
    var img = hero.querySelector("[data-hero-img]");
    if (!canvas) return null;
    var gl = canvas.getContext("webgl", { premultipliedAlpha: true, antialias: false, alpha: true, powerPreference: "low-power" });
    if (!gl) return null;

    var prog = gl.createProgram();
    try {
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    } catch (e) {
      return null;
    }
    gl.linkProgram(prog);
    gl.useProgram(prog);
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var U = {};
    ["uRes", "uTime", "uMouse", "uMouseAmt", "uSource", "uDensity", "uTintA", "uTintB", "uBeams"].forEach(function (n) {
      U[n] = gl.getUniformLocation(prog, n);
    });

    var src = (canvas.dataset.source || "0.5,0.6").split(",").map(Number);
    var target = parseFloat(canvas.dataset.density || "1");
    // Portrait screens crop the photo tighter and carry a heavier text scrim, so the fog needs more body.
    var boost = function () { return window.innerWidth < 760 ? 1.45 : 1; };
    var tint = TINTS[canvas.dataset.tint] || TINTS.cool;
    var beams = hero.querySelector("[data-dust]") ? 0.55 : 0;
    gl.uniform3fv(U.uTintA, tint[0]);
    gl.uniform3fv(U.uTintB, tint[1]);
    gl.uniform1f(U.uBeams, beams);

    var state = { density: reduce ? target : 0, progress: 0, mx: 0.5, my: 0.5, tx: 0.5, ty: 0.5, amt: 0, tamt: 0 };
    var source = [0.5, 0.5];
    var w = 0, h = 0;

    function resize() {
      var r = canvas.getBoundingClientRect();
      var k = Math.min(window.devicePixelRatio || 1, 1.5) * 0.5;
      w = Math.max(2, Math.min(1100, Math.round(r.width * k)));
      h = Math.max(2, Math.round(w * (r.height / Math.max(r.width, 1))));
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      source = img ? photoToUv(img, canvas, src[0], src[1]) : [src[0], 1 - src[1]];
      if (reduce) draw(14);
    }

    function draw(t) {
      state.mx += (state.tx - state.mx) * 0.06;
      state.my += (state.ty - state.my) * 0.06;
      state.amt += (state.tamt - state.amt) * 0.04;
      gl.uniform2f(U.uRes, w, h);
      gl.uniform1f(U.uTime, t);
      gl.uniform2f(U.uMouse, state.mx, state.my);
      gl.uniform1f(U.uMouseAmt, state.amt);
      gl.uniform2f(U.uSource, source[0], source[1]);
      gl.uniform1f(U.uDensity, Math.min(1.4, state.density * boost()) * (1 - state.progress * 0.9));
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    hero.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      var r = canvas.getBoundingClientRect();
      state.tx = (e.clientX - r.left) / r.width;
      state.ty = 1 - (e.clientY - r.top) / r.height;
      state.tamt = 1;
    });
    hero.addEventListener("pointerleave", function () { state.tamt = 0; });

    new ResizeObserver(resize).observe(canvas);
    resize();

    return {
      draw: draw,
      intro: function (seconds) {
        var start = performance.now();
        (function ramp(now) {
          var k = Math.min(1, (now - start) / (seconds * 1000));
          state.density = target * (1 - Math.pow(1 - k, 3));
          if (k < 1) requestAnimationFrame(ramp);
        })(start);
      },
      setProgress: function (p) { state.progress = p; if (reduce) draw(14); },
    };
  }

  function Dust(hero) {
    var canvas = hero.querySelector("[data-dust]");
    if (!canvas) return null;
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, motes = [];
    var sprite = document.createElement("canvas");
    sprite.width = sprite.height = 64;
    var sc = sprite.getContext("2d");
    var g = sc.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,250,240,1)");
    g.addColorStop(0.35, "rgba(255,248,236,.55)");
    g.addColorStop(1, "rgba(255,248,236,0)");
    sc.fillStyle = g;
    sc.fillRect(0, 0, 64, 64);

    function seed() {
      var n = Math.round(Math.min(140, (W * H) / (dpr * dpr * 9000)));
      motes = [];
      for (var i = 0; i < n; i++) {
        var z = Math.pow(Math.random(), 1.6);
        motes.push({
          x: Math.random(), y: Math.random(), z: z,
          vx: (0.004 + Math.random() * 0.01) * (0.4 + z), vy: (Math.random() - 0.6) * 0.006,
          ph: Math.random() * 6.28, tw: 0.6 + Math.random() * 1.4,
        });
      }
    }
    function resize() {
      var r = canvas.getBoundingClientRect();
      W = canvas.width = Math.round(r.width * dpr);
      H = canvas.height = Math.round(r.height * dpr);
      seed();
    }
    function beam(x, y) {
      var u = x, v = 1 - y;
      var b = Math.pow(Math.max(0, Math.sin((u * 0.82 + v) * 13 + 1.1)), 6);
      var s = Math.min(1, Math.max(0, (v - 0.1) / 0.8)) * Math.min(1, Math.max(0, (0.9 - u) / 0.85));
      return 0.12 + b * s * 0.88;
    }
    var mouse = { x: -1, y: -1 };
    hero.addEventListener("pointermove", function (e) {
      var r = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - r.left) / r.width;
      mouse.y = (e.clientY - r.top) / r.height;
    });
    hero.addEventListener("pointerleave", function () { mouse.x = -1; });

    var last = 0;
    function draw(t) {
      var dt = last ? Math.min(0.05, t - last) : 0.016;
      last = t;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      for (var i = 0; i < motes.length; i++) {
        var m = motes[i];
        m.x -= m.vx * dt * (1 + 0.4 * Math.sin(t * 0.3 + m.ph));
        m.y += (m.vy + Math.sin(t * 0.5 + m.ph) * 0.004) * dt;
        if (mouse.x >= 0) {
          var dx = m.x - mouse.x, dy = m.y - mouse.y, dd = dx * dx + dy * dy;
          if (dd < 0.012) { m.x += dx * 0.02; m.y += dy * 0.02 - 0.0004; }
        }
        if (m.x < -0.02) m.x = 1.02;
        if (m.x > 1.02) m.x = -0.02;
        if (m.y < -0.02) m.y = 1.02;
        if (m.y > 1.02) m.y = -0.02;
        var size = (1.2 + m.z * m.z * 13) * dpr;
        var near = m.z > 0.82;
        var a = beam(m.x, m.y) * (0.35 + 0.65 * Math.abs(Math.sin(t * m.tw + m.ph))) * (near ? 0.18 : 0.75 - m.z * 0.3);
        if (a < 0.01) continue;
        ctx.globalAlpha = a;
        ctx.drawImage(sprite, m.x * W - size, m.y * H - size, size * 2, size * 2);
      }
      ctx.globalAlpha = 1;
    }
    new ResizeObserver(resize).observe(canvas);
    resize();
    return { draw: draw };
  }

  window.IzaziFog = function (hero, opts) {
    var reduce = !!(opts && opts.reduce);
    var fog = Fog(hero, reduce);
    var dust = reduce ? null : Dust(hero);
    var running = false, visible = true, raf = 0, t0 = performance.now();
    function frame(now) {
      var t = (now - t0) / 1000 + 6;
      if (fog) fog.draw(t);
      if (dust) dust.draw(t);
      raf = running ? requestAnimationFrame(frame) : 0;
    }
    function sync() {
      var should = visible && !document.hidden && !reduce;
      if (should && !running) { running = true; raf = requestAnimationFrame(frame); }
      if (!should && running) { running = false; cancelAnimationFrame(raf); }
    }
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; sync(); }).observe(hero);
    document.addEventListener("visibilitychange", sync);
    sync();
    return {
      intro: function (s) { if (fog && !reduce) fog.intro(s); },
      setProgress: function (p) { if (fog) fog.setProgress(p); },
    };
  };
})();
