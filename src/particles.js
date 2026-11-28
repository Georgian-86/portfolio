// Particle field for 02 "What I build". One simulation, two renderers:
// three.js (lazy-imported by services.js; real depth + pointer-tilt) or a canvas-2D fallback.
// The points morph through four shapes: a loose cloud (chaos) → browser (Grow) → chat bubble
// (Automate) → phone (Ship). The pointer repels nearby points; they spring back.
// Paused whenever the section is off-screen; DPR capped at 2.

const TAU = Math.PI * 2;

// ── Shape sampling (world units; shapes fit a 2.4 × 1.8 box around 0,0) ──
function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
function roundRect(out, n, cx, cy, w, h, r, rand) {
  const straight = 2 * (w - 2 * r) + 2 * (h - 2 * r), arc = TAU * r, total = straight + arc;
  for (let i = 0; i < n; i++) {
    let d = rand() * total;
    const segs = [w - 2 * r, (TAU * r) / 4, h - 2 * r, (TAU * r) / 4, w - 2 * r, (TAU * r) / 4, h - 2 * r, (TAU * r) / 4];
    let k = 0;
    while (d > segs[k]) { d -= segs[k]; k = (k + 1) % 8; }
    const x0 = cx - w / 2, y0 = cy - h / 2;
    let x, y;
    switch (k) {
      case 0: x = x0 + r + d; y = y0; break;
      case 1: { const a = -Math.PI / 2 + d / r; x = x0 + w - r + Math.cos(a) * r; y = y0 + r + Math.sin(a) * r; break; }
      case 2: x = x0 + w; y = y0 + r + d; break;
      case 3: { const a = d / r; x = x0 + w - r + Math.cos(a) * r; y = y0 + h - r + Math.sin(a) * r; break; }
      case 4: x = x0 + w - r - d; y = y0 + h; break;
      case 5: { const a = Math.PI / 2 + d / r; x = x0 + r + Math.cos(a) * r; y = y0 + h - r + Math.sin(a) * r; break; }
      case 6: x = x0; y = y0 + h - r - d; break;
      default: { const a = Math.PI + d / r; x = x0 + r + Math.cos(a) * r; y = y0 + r + Math.sin(a) * r; }
    }
    out.push([x, y]);
  }
}
function line(out, n, x1, y1, x2, y2, rand) {
  for (let i = 0; i < n; i++) { const t = rand(); out.push([x1 + (x2 - x1) * t, y1 + (y2 - y1) * t]); }
}
function disc(out, n, cx, cy, r, rand) {
  for (let i = 0; i < n; i++) { const a = rand() * TAU, d = Math.sqrt(rand()) * r; out.push([cx + Math.cos(a) * d, cy + Math.sin(a) * d]); }
}
function box(out, n, cx, cy, w, h, rand) {
  for (let i = 0; i < n; i++) out.push([cx + (rand() - 0.5) * w, cy + (rand() - 0.5) * h]);
}
// Distributes `n` points over parts weighted by `w`; y is up.
function compose(n, parts, rand) {
  const out = [];
  const sum = parts.reduce((a, p) => a + p[0], 0);
  parts.forEach(([w, fn], i) => fn(out, i === parts.length - 1 ? n - out.length : Math.round((n * w) / sum)));
  // Shuffle, so morphs swirl instead of sliding in lanes.
  for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
  return out.slice(0, n);
}

function shapes(n) {
  const r = rng(7);
  const cloud = [];
  for (let i = 0; i < n; i++) {
    const a = r() * TAU, d = Math.pow(r(), 0.6) * 1.5;
    cloud.push([Math.cos(a) * d * 1.3, Math.sin(a) * d * 0.85]);
  }
  const grow = compose(n, [
    [34, (o, k) => roundRect(o, k, 0, 0, 2.3, 1.6, 0.08, r)],
    [7, (o, k) => line(o, k, -1.15, 0.55, 1.15, 0.55, r)],
    [4, (o, k) => { disc(o, k / 3, -1.0, 0.68, 0.035, r); disc(o, k / 3, -0.88, 0.68, 0.035, r); disc(o, k - Math.round(k / 3) * 2, -0.76, 0.68, 0.035, r); }],
    [40, (o, k) => { const hs = [0.25, 0.42, 0.36, 0.62, 0.8]; hs.forEach((hh, i) => box(o, Math.round(k / 5), -0.62 + i * 0.3, -0.62 + hh / 2, 0.16, hh, r)); }],
    [15, (o, k) => { line(o, k * 0.7, -0.75, -0.25, 0.75, 0.38, r); line(o, k * 0.15, 0.75, 0.38, 0.6, 0.38, r); line(o, k * 0.15, 0.75, 0.38, 0.72, 0.24, r); }],
  ], r);
  const automate = compose(n, [
    [46, (o, k) => roundRect(o, k, 0, 0.12, 2.1, 1.3, 0.34, r)],
    [8, (o, k) => { line(o, k / 2, -0.62, -0.53, -0.82, -0.86, r); line(o, k / 2, -0.82, -0.86, -0.32, -0.53, r); }],
    [30, (o, k) => { disc(o, k / 3, -0.42, 0.12, 0.1, r); disc(o, k / 3, 0, 0.12, 0.1, r); disc(o, k - Math.round(k / 3) * 2, 0.42, 0.12, 0.1, r); }],
    [16, (o, k) => box(o, k, 0, 0.12, 1.8, 1.0, r)],
  ], r);
  const ship = compose(n, [
    [38, (o, k) => roundRect(o, k, 0, 0, 0.98, 1.8, 0.16, r)],
    [4, (o, k) => line(o, k, -0.14, 0.78, 0.14, 0.78, r)],
    [44, (o, k) => { for (let row = 0; row < 4; row++) for (let col = 0; col < 3; col++) box(o, Math.round(k / 12), -0.26 + col * 0.26, 0.46 - row * 0.28, 0.15, 0.15, r); }],
    [6, (o, k) => line(o, k, -0.16, -0.78, 0.16, -0.78, r)],
    [8, (o, k) => box(o, k, 0, -0.55, 0.7, 0.04, r)],
  ], r);
  const z = Array.from({ length: n }, () => (r() - 0.5) * 0.14);
  const zc = Array.from({ length: n }, () => (r() - 0.5) * 1.2);
  const tone = Array.from({ length: n }, () => (r() < 0.22 ? 1 : 0)); // 1 = mist, 0 = signal
  return { list: [cloud, grow, automate, ship], z, zc, tone };
}

const smooth = (t) => t * t * (3 - 2 * t);

/** Creates the field. `kind` is 'webgl' (pass the THREE namespace) or '2d'. */
export function createField(canvas, { count, THREE = null, reduced = false }) {
  const S = shapes(count);
  const pos = new Float32Array(count * 3);
  const vel = new Float32Array(count * 3);
  const tgt = new Float32Array(count * 3);
  let morph = 0; // 0 cloud · 1 grow · 2 automate · 3 ship
  let pointer = { x: 9, y: 9, active: false };
  let tilt = { x: 0, y: 0 };
  let running = false, raf = 0, t0 = performance.now();
  let layout = { cx: 0, cy: 0, scale: 1, w: 1, h: 1 };

  function targets(time) {
    const m = Math.max(0, Math.min(3, morph));
    const a = Math.floor(m), b = Math.min(3, a + 1), f = smooth(m - a);
    const A = S.list[a], B = S.list[b];
    const zf = a === 0 ? 1 - f : 0; // the cloud has depth; shapes are nearly flat
    for (let i = 0; i < count; i++) {
      const breathe = Math.sin(time * 0.0011 + i * 0.37) * 0.008;
      tgt[i * 3] = A[i][0] + (B[i][0] - A[i][0]) * f + breathe;
      tgt[i * 3 + 1] = A[i][1] + (B[i][1] - A[i][1]) * f + Math.cos(time * 0.0009 + i) * 0.008;
      tgt[i * 3 + 2] = S.z[i] + S.zc[i] * zf;
    }
  }
  function settle() {
    targets(0);
    pos.set(tgt);
    vel.fill(0);
  }
  function step(time) {
    targets(time);
    const R = 0.42, R2 = R * R;
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      let ax = (tgt[ix] - pos[ix]) * 0.045, ay = (tgt[ix + 1] - pos[ix + 1]) * 0.045, az = (tgt[ix + 2] - pos[ix + 2]) * 0.045;
      if (pointer.active) {
        const dx = pos[ix] - pointer.x, dy = pos[ix + 1] - pointer.y, d2 = dx * dx + dy * dy;
        if (d2 < R2) { const d = Math.sqrt(d2) || 1e-3, f = (1 - d / R) * 0.05; ax += (dx / d) * f; ay += (dy / d) * f; az += f * 0.6; }
      }
      vel[ix] = (vel[ix] + ax) * 0.86; vel[ix + 1] = (vel[ix + 1] + ay) * 0.86; vel[ix + 2] = (vel[ix + 2] + az) * 0.86;
      pos[ix] += vel[ix]; pos[ix + 1] += vel[ix + 1]; pos[ix + 2] += vel[ix + 2];
    }
  }

  // ── Renderers ──
  let draw, resize, dispose = () => {};
  if (THREE) {
    // Same power preference as the desk world (world/desk.js). Mixing 'low-power' and 'high-performance'
    // makes dual-GPU laptops switch GPUs when the world loads, which loses this context (the figure vanished).
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
    dispose = () => { renderer.dispose(); geo.dispose(); mat.map.dispose(); mat.dispose(); };
    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
    camera.position.z = 5;
    const group = new THREE.Group();
    scene.add(group);
    const geo = new THREE.BufferGeometry();
    const attr = new THREE.BufferAttribute(pos, 3);
    attr.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('position', attr);
    const col = new Float32Array(count * 3);
    const sig = new THREE.Color('#74d8b2'), mist = new THREE.Color('#e9eef0');
    for (let i = 0; i < count; i++) (S.tone[i] ? mist : sig).toArray(col, i * 3);
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const dot = document.createElement('canvas');
    dot.width = dot.height = 64;
    const g = dot.getContext('2d');
    const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, 'rgba(255,255,255,1)'); grd.addColorStop(0.45, 'rgba(255,255,255,0.9)'); grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
    const mat = new THREE.PointsMaterial({
      size: 0.034, map: new THREE.CanvasTexture(dot), vertexColors: true, transparent: true,
      depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.95,
    });
    group.add(new THREE.Points(geo, mat));
    resize = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const vh = 2 * Math.tan((35 * Math.PI) / 360) * 5, vw = vh * camera.aspect;
      const wide = w >= 768;
      const scale = wide ? Math.min((vh * 0.62) / 1.8, (vw * 0.4) / 2.4) : Math.min((vh * 0.34) / 1.8, (vw * 0.78) / 2.4);
      layout = { cx: wide ? vw * 0.2 : 0, cy: wide ? 0 : vh * 0.02, scale, w: vw, h: vh, px: w, py: h };
      group.position.set(layout.cx, layout.cy, 0);
      group.scale.setScalar(scale);
    };
    draw = (time) => {
      attr.needsUpdate = true;
      group.rotation.y += ((tilt.x * 0.35 + Math.sin(time * 0.0003) * 0.12) - group.rotation.y) * 0.05;
      group.rotation.x += ((-tilt.y * 0.2) - group.rotation.x) * 0.05;
      renderer.render(scene, camera);
    };
  } else {
    const ctx = canvas.getContext('2d');
    resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      const w = canvas.clientWidth, h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const wide = w >= 768;
      const unit = wide ? Math.min((h * 0.62) / 1.8, (w * 0.4) / 2.4) : Math.min((h * 0.34) / 1.8, (w * 0.78) / 2.4);
      layout = { cx: wide ? w * 0.7 : w / 2, cy: h / 2, scale: unit, px: w, py: h, flat: true };
    };
    draw = () => {
      const { cx, cy, scale, px, py } = layout;
      ctx.clearRect(0, 0, px, py);
      for (let i = 0; i < count; i++) {
        const z = pos[i * 3 + 2], k = 1 + z * 0.35;
        ctx.fillStyle = S.tone[i] ? 'rgba(233,238,240,0.85)' : 'rgba(116,216,178,0.95)';
        ctx.fillRect(cx + pos[i * 3] * scale * k - 1, cy - pos[i * 3 + 1] * scale * k - 1, 2, 2);
      }
    };
  }

  // Pointer in the field's own units (rotation ignored: it is small).
  function setPointer(clientX, clientY) {
    const r = canvas.getBoundingClientRect();
    const nx = (clientX - r.left) / r.width, ny = (clientY - r.top) / r.height;
    tilt = { x: nx * 2 - 1, y: ny * 2 - 1 };
    if (layout.flat) {
      pointer = { x: (clientX - r.left - layout.cx) / layout.scale, y: -(clientY - r.top - layout.cy) / layout.scale, active: true };
    } else {
      const wx = (nx - 0.5) * layout.w, wy = (0.5 - ny) * layout.h;
      pointer = { x: (wx - layout.cx) / layout.scale, y: (wy - layout.cy) / layout.scale, active: true };
    }
  }

  const loop = (now) => {
    step(now - t0);
    draw(now - t0);
    raf = running ? requestAnimationFrame(loop) : 0;
  };

  resize();
  settle();
  draw(0);

  return {
    setMorph(m, snap = false) { morph = m; if (snap || reduced) { settle(); draw(0); } },
    pointer: setPointer,
    release() { pointer.active = false; tilt = { x: 0, y: 0 }; },
    resize() { resize(); if (!running) draw(performance.now() - t0); },
    start() { if (reduced || running) return; running = true; raf = requestAnimationFrame(loop); },
    stop() { running = false; cancelAnimationFrame(raf); raf = 0; },
    get running() { return running; },
    /** Stops and frees the GPU resources (the canvas is left to the caller). */
    destroy() { running = false; cancelAnimationFrame(raf); raf = 0; try { dispose(); } catch { /* context already lost */ } },
  };
}
