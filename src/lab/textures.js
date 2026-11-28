// Procedural canvas textures for the desk world. Everything is drawn in code: no images, no footage.
// Imperfection is deliberate (grain, fibres, uneven ink), because perfect CG surfaces read as fake.
import * as THREE from 'three';

const canvas = (w, h) => Object.assign(document.createElement('canvas'), { width: w, height: h });
function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
const tex = (c, { srgb = true, repeat = null, aniso = 8 } = {}) => {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = aniso;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeat, repeat); }
  return t;
};

/** Matte desk laminate: warm paper tone, fine grain and faint fibres; plus a matching roughness map. */
export function deskTextures() {
  const N = 1024, r = rng(11);
  const c = canvas(N, N), g = c.getContext('2d');
  g.fillStyle = '#e9e0d3';
  g.fillRect(0, 0, N, N);
  const img = g.getImageData(0, 0, N, N), d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (r() - 0.5) * 9;
    d[i] += n; d[i + 1] += n; d[i + 2] += n * 0.9;
  }
  g.putImageData(img, 0, 0);
  g.globalAlpha = 0.05;
  for (let i = 0; i < 900; i++) {
    g.strokeStyle = r() < 0.5 ? '#bfae96' : '#fff8ee';
    g.lineWidth = 0.6 + r();
    const x = r() * N, y = r() * N, a = r() * Math.PI, l = 8 + r() * 40;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke();
  }
  const rc = canvas(256, 256), rg = rc.getContext('2d');
  const ri = rg.createImageData(256, 256);
  for (let i = 0; i < ri.data.length; i += 4) { const v = 200 + r() * 40; ri.data[i] = ri.data[i + 1] = ri.data[i + 2] = v; ri.data[i + 3] = 255; }
  rg.putImageData(ri, 0, 0);
  return { map: tex(c, { repeat: 5 }), roughnessMap: tex(rc, { srgb: false, repeat: 18 }) };
}

/** A sticky note face: slightly uneven yellow with a darker glued band at the top. */
export function noteTexture(seed, scribble = '') {
  const N = 512, r = rng(seed), c = canvas(N, N), g = c.getContext('2d');
  const grd = g.createLinearGradient(0, 0, N * 0.3, N);
  grd.addColorStop(0, '#f1d27a'); grd.addColorStop(1, '#e8c564');
  g.fillStyle = grd; g.fillRect(0, 0, N, N);
  g.fillStyle = 'rgba(160,120,30,0.08)'; g.fillRect(0, 0, N, 70);
  const img = g.getImageData(0, 0, N, N), d = img.data;
  for (let i = 0; i < d.length; i += 4) { const n = (r() - 0.5) * 7; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
  g.putImageData(img, 0, 0);
  if (scribble) {
    g.fillStyle = 'rgba(24,30,52,0.86)'; // ballpoint blue-black
    g.font = '600 92px Caveat, "Segoe Print", cursive';
    g.save(); g.translate(48, 160); g.rotate((r() - 0.5) * 0.08);
    scribble.split('\n').forEach((line, i) => g.fillText(line, 0, i * 96));
    g.restore();
  }
  return tex(c);
}

/** The headline, printed on the desk: ink letters on a transparent sheet (so shadows fall on it). */
export async function headlineTexture(lines, { width = 4096, size = 300 } = {}) {
  try { await document.fonts.load(`600 ${size}px Inter`); } catch { /* fallback font */ }
  const lh = size * 1.0, h = Math.ceil(lh * lines.length + size * 0.35);
  const c = canvas(width, h), g = c.getContext('2d');
  g.fillStyle = '#16191e';
  g.font = `600 ${size}px Inter, system-ui, sans-serif`;
  g.letterSpacing = `${-size * 0.04}px`;
  g.textBaseline = 'alphabetic';
  lines.forEach((l, i) => g.fillText(l, 6, size * 0.95 + i * lh));
  const t = tex(c, { aniso: 16 });
  return { texture: t, aspect: width / h };
}

/** Phone UI: a lock-screen missed call, then a chat that types itself. `step` 0–5 reveals it. */
export function phoneScreen() {
  const W = 600, H = 1300, c = canvas(W, H), g = c.getContext('2d');
  const t = tex(c, { aniso: 4 });
  const round = (x, y, w, h, r) => { g.beginPath(); g.roundRect(x, y, w, h, r); g.fill(); };
  const wrap = (text, maxW) => {
    const words = text.split(' '), out = []; let line = '';
    for (const w of words) { const test = line ? `${line} ${w}` : w; if (g.measureText(test).width > maxW && line) { out.push(line); line = w; } else line = test; }
    out.push(line); return out;
  };
  const bubble = (text, out, y, alpha) => {
    g.globalAlpha = alpha;
    g.font = '400 30px Inter, system-ui, sans-serif';
    const lines = wrap(text, 360), bw = Math.max(...lines.map((l) => g.measureText(l).width)) + 44, bh = lines.length * 40 + 30;
    const x = out ? W - 36 - bw : 36;
    g.fillStyle = out ? '#74d8b2' : '#1f2c34';
    round(x, y, bw, bh, 22);
    g.fillStyle = out ? '#07111b' : '#e9eef0';
    lines.forEach((l, i) => g.fillText(l, x + 22, y + 46 + i * 40));
    g.globalAlpha = 1;
    return y + bh + 22;
  };
  let last = -1;
  function draw(step, clock = '11:42') {
    const key = `${step.toFixed(2)}|${clock}`;
    if (key === last) return;
    last = key;
    g.fillStyle = '#0b141a'; g.fillRect(0, 0, W, H);
    g.fillStyle = '#e9eef0'; g.font = '600 30px Inter, system-ui, sans-serif'; g.fillText(clock, 48, 70);
    if (step < 1) {
      // Lock screen: big clock and a missed-call card.
      g.font = '600 150px Inter, system-ui, sans-serif'; g.fillText(clock, 70, 330);
      g.font = '400 32px Inter, system-ui, sans-serif'; g.fillStyle = '#8fa0a6'; g.fillText('Tuesday', 76, 390);
      const a = Math.min(1, step * 3);
      g.globalAlpha = a;
      g.fillStyle = '#1c2a36'; round(36, 470, W - 72, 150, 30);
      g.fillStyle = '#e05c5c'; g.beginPath(); g.arc(100, 545, 26, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#e9eef0'; g.font = '600 32px Inter, system-ui, sans-serif'; g.fillText('Missed call', 150, 530);
      g.fillStyle = '#8fa0a6'; g.font = '400 28px Inter, system-ui, sans-serif'; g.fillText('+91 98•••• ••210 · now', 150, 574);
      g.globalAlpha = 1;
    } else {
      g.fillStyle = '#111d24'; g.fillRect(0, 100, W, 110);
      g.fillStyle = '#74d8b2'; g.beginPath(); g.arc(80, 155, 32, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#e9eef0'; g.font = '600 32px Inter, system-ui, sans-serif'; g.fillText('Glow Salon', 130, 148);
      g.fillStyle = '#74d8b2'; g.font = '400 24px Inter, system-ui, sans-serif'; g.fillText(step < 2.6 && step > 1.8 ? 'typing…' : 'online', 130, 182);
      let y = 250;
      const s = step - 1;
      y = bubble('Hi, I just tried calling. Any slot tomorrow evening?', false, y, Math.min(1, s * 2));
      if (s > 0.8 && s < 1.6) { // typing dots
        g.fillStyle = '#74d8b2'; round(W - 150, y, 114, 64, 22);
        g.fillStyle = '#07111b'; [0, 1, 2].forEach((i) => { g.globalAlpha = 0.35 + 0.65 * ((Math.floor(s * 10) + i) % 3 === 0); g.beginPath(); g.arc(W - 120 + i * 27, y + 32, 7, 0, Math.PI * 2); g.fill(); });
        g.globalAlpha = 1;
      }
      if (s >= 1.6) y = bubble('Sorry we missed you! 6:30 or 7:15 pm tomorrow are free. Which one?', true, y, Math.min(1, (s - 1.6) * 3));
      if (s >= 2.4) y = bubble('6:30 please', false, y, Math.min(1, (s - 2.4) * 3));
      if (s >= 3.1) {
        g.globalAlpha = Math.min(1, (s - 3.1) * 3);
        g.strokeStyle = '#74d8b2'; g.lineWidth = 3; g.beginPath(); g.roundRect(36, y, W - 72, 96, 20); g.stroke();
        g.fillStyle = '#74d8b2'; g.font = '600 30px Inter, system-ui, sans-serif'; g.fillText('Booked · Wed 6:30 pm', 64, y + 58);
        g.globalAlpha = 1;
      }
    }
    t.needsUpdate = true;
  }
  draw(0);
  return { texture: t, draw };
}

/** A printed, messy spreadsheet page (A4 proportions). */
export function sheetTexture(seed) {
  const W = 840, H = 1188, r = rng(seed), c = canvas(W, H), g = c.getContext('2d');
  g.fillStyle = '#fbf8f2'; g.fillRect(0, 0, W, H);
  g.strokeStyle = 'rgba(40,40,40,0.25)'; g.lineWidth = 1.2;
  const x0 = 60, y0 = 120, cols = [0, 160, 330, 470, 600, 780], rowH = 34;
  g.fillStyle = '#1b1d21'; g.font = '600 26px Inter, Arial, sans-serif'; g.fillText(`leads_FINAL_v${3 + (seed % 5)}.xlsx`, x0, 80);
  for (let i = 0; i < 28; i++) {
    const y = y0 + i * rowH;
    if (r() < 0.18) { g.fillStyle = 'rgba(240,216,120,0.75)'; g.fillRect(x0 + cols[1 + Math.floor(r() * 3)], y + 4, 120 + r() * 80, rowH - 8); }
    g.beginPath(); g.moveTo(x0, y); g.lineTo(x0 + cols[5], y); g.stroke();
    g.fillStyle = 'rgba(30,30,30,0.75)'; g.font = '400 18px Arial, sans-serif';
    for (let k = 0; k < 5; k++) if (r() < 0.8) g.fillRect(x0 + cols[k] + 10, y + 14, 30 + r() * 80, 7);
  }
  cols.forEach((x) => { g.beginPath(); g.moveTo(x0 + x, y0); g.lineTo(x0 + x, y0 + 28 * rowH); g.stroke(); });
  g.strokeStyle = 'rgba(200,40,40,0.7)'; g.lineWidth = 3; g.beginPath(); g.ellipse(x0 + 400, y0 + rowH * 9.5, 90, 22, -0.05, 0, Math.PI * 2); g.stroke();
  return tex(c, { aniso: 8 });
}

/** Laptop keyboard deck: dark keys on the aluminium-grey base. */
export function keyboardTexture() {
  const W = 1024, H = 700, c = canvas(W, H), g = c.getContext('2d');
  g.fillStyle = '#3a3c40'; g.fillRect(0, 0, W, H);
  g.fillStyle = '#16171a';
  const rows = [14, 14, 13, 12, 11];
  rows.forEach((n, ri) => {
    const kw = (W - 120) / 14.5, y = 40 + ri * 66;
    for (let i = 0; i < n; i++) { g.beginPath(); g.roundRect(60 + i * (kw + 4) + ri * 8, y, kw - 4, 56, 7); g.fill(); }
  });
  g.beginPath(); g.roundRect(300, 40 + 5 * 66, 420, 56, 7); g.fill();
  g.fillStyle = '#34363a'; g.beginPath(); g.roundRect(330, 430, 360, 240, 14); g.fill(); // trackpad
  return tex(c);
}

/** Dashboard on the laptop screen; `t` 0–1 grows the bars and counts up. Numbers labelled as sample. */
export function dashboardScreen() {
  const W = 1280, H = 820, c = canvas(W, H), g = c.getContext('2d');
  const t = tex(c, { aniso: 4 });
  const bars = [0.32, 0.46, 0.4, 0.62, 0.55, 0.86, 0.44];
  let last = -1;
  function draw(p) {
    const k = Math.round(p * 200);
    if (k === last) return;
    last = k;
    g.fillStyle = '#0e1b27'; g.fillRect(0, 0, W, H);
    g.fillStyle = '#e9eef0'; g.font = '600 44px Inter, system-ui, sans-serif'; g.fillText('This week', 70, 110);
    g.fillStyle = '#8fa0a6'; g.font = '400 26px Inter, system-ui, sans-serif'; g.fillText('Sample data', 70, 150);
    const kpis = [['Leads', 48], ['Replied in', 38, 's'], ['Booked', 17]];
    kpis.forEach(([label, v, unit = ''], i) => {
      const x = 70 + i * 280;
      g.fillStyle = '#16242f'; g.beginPath(); g.roundRect(x, 190, 250, 150, 18); g.fill();
      g.fillStyle = '#8fa0a6'; g.font = '400 26px Inter, system-ui, sans-serif'; g.fillText(label, x + 26, 236);
      g.fillStyle = '#e9eef0'; g.font = '600 64px Inter, system-ui, sans-serif'; g.fillText(`${Math.round(v * Math.min(1, p * 1.4))}${unit}`, x + 26, 312);
    });
    bars.forEach((b, i) => {
      const e = Math.min(1, Math.max(0, p * 1.6 - i * 0.08));
      const h = 360 * b * (1 - (1 - e) ** 3), x = 90 + i * 160;
      g.fillStyle = i === 5 ? '#74d8b2' : '#2a3b48';
      g.beginPath(); g.roundRect(x, 770 - h, 96, h, 12); g.fill();
    });
    t.needsUpdate = true;
  }
  draw(0);
  return { texture: t, draw };
}

/** Soft round shadow blob used under objects for contact occlusion. */
export function contactShadow() {
  const N = 256, c = canvas(N, N), g = c.getContext('2d');
  const grd = g.createRadialGradient(N / 2, N / 2, 0, N / 2, N / 2, N / 2);
  grd.addColorStop(0, 'rgba(0,0,0,0.55)'); grd.addColorStop(0.55, 'rgba(0,0,0,0.25)'); grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd; g.fillRect(0, 0, N, N);
  return tex(c, { srgb: false });
}
