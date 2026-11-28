// "One desk, one night": a single physically lit desk the camera travels across.
// Units are centimetres. Every object is built in code; state comes from the scroll (main.js).
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  deskTextures, noteTexture, headlineTexture, phoneScreen, sheetTexture,
  keyboardTexture, dashboardScreen, contactShadow,
} from './textures.js';

const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

// ── Layout (the hero frame is ~90 × 51 cm seen from above) ──
const PHONE = { w: 7.2, h: 0.78, l: 15 };
const HERO_PHONE = { from: { x: 27, z: 9, ry: -0.32 }, to: { x: 16, z: 2, ry: 0 } };
const SIDE_PHONE = { from: { x: 18, z: -9, ry: 0.42 }, to: { x: 38, z: -10, ry: 0.06 } };
const NOTES = [
  { from: [-33, 15, 0.35], text: 'call back??' },
  { from: [5, 15.5, -0.28], text: 'invoice\n#1042' },
  { from: [38, -15, 0.2], text: 'follow up\nMonday!!' },
  { from: [-9, -18.5, -0.12], text: '' },
];
const NOTE_STACK = [-36, 17];
const LAPTOP = { x: 0, z: -74 };

export async function createDesk(canvas, { onProgress = () => {} } = {}) {
  try { await Promise.all([document.fonts.load('600 92px Caveat'), document.fonts.load('600 40px Inter')]); } catch { /* fallbacks */ }
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.background = new THREE.Color('#07111b');

  const camera = new THREE.PerspectiveCamera(30, 1, 1, 900);

  // ── Lights: warm window key, cool night fill, the phone's own glow ──
  const key = new THREE.DirectionalLight('#fff1dd', 3.2);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -50, right: 50, top: 50, bottom: -50, near: 1, far: 300 });
  key.shadow.radius = 3;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.03;
  scene.add(key, key.target);
  const moon = new THREE.DirectionalLight('#7f95b8', 0);
  moon.position.set(60, 80, -40);
  scene.add(moon);
  // The screen's spill: two low lights beside the phone, so the glass shows no hotspot.
  const glows = [new THREE.PointLight('#c4f2df', 0, 55, 1.6), new THREE.PointLight('#c4f2df', 0, 55, 1.6)];
  scene.add(...glows);
  // Window light: a broad soft spot that gives the desk a real falloff instead of flat studio light.
  const windowLight = new THREE.SpotLight('#fff3e4', 1.1, 0, 0.62, 1, 0);
  scene.add(windowLight, windowLight.target);
  const lampSpot = new THREE.SpotLight('#ffd9a8', 0, 140, 0.5, 0.7, 1.6); // morning desk lamp warmth on the laptop
  lampSpot.position.set(-30, 70, -40);
  lampSpot.target.position.set(LAPTOP.x, 0, LAPTOP.z);
  scene.add(lampSpot, lampSpot.target);
  onProgress(0.1);

  // ── Desk ──
  const deskTex = deskTextures();
  const deskMat = new THREE.MeshStandardMaterial({ map: deskTex.map, roughnessMap: deskTex.roughnessMap, roughness: 0.9, metalness: 0 });
  const desk = new THREE.Mesh(new THREE.PlaneGeometry(700, 700), deskMat);
  desk.rotation.x = -Math.PI / 2;
  desk.receiveShadow = true;
  scene.add(desk);
  const blobTex = contactShadow();
  const blob = (w, l, o = 0.6) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, l), new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false, opacity: o }));
    m.rotation.x = -Math.PI / 2;
    m.position.y = 0.03;
    m.renderOrder = 1;
    return m;
  };

  // ── Headlines, printed on the desk (receive shadows; cables and notes lie on top) ──
  const heads = [];
  // Portrait screens get a narrower, four-line print so the headline fits the tall frame.
  const portrait = canvas.clientHeight > canvas.clientWidth;
  const copy = portrait
    ? [['Every business', 'runs on a little', 'chaos.'], ['I build the', 'systems that', 'untangle it.']]
    : [['Every business runs', 'on a little chaos.'], ['I build the systems', 'that untangle it.']];
  for (const lines of copy) {
    const { texture, aspect } = await headlineTexture(lines);
    const w = portrait ? 36 : 64;
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, w / aspect),
      new THREE.MeshStandardMaterial({ map: texture, transparent: true, roughness: 0.75, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1 }),
    );
    m.rotation.x = -Math.PI / 2;
    m.position.set(portrait ? -14 + w / 2 : -39 + w / 2, 0.02, portrait ? -6 : -2);
    m.receiveShadow = true;
    m.renderOrder = 2;
    scene.add(m);
    heads.push(m);
  }
  onProgress(0.3);

  // ── Phones ──
  const phoneBody = new RoundedBoxGeometry(PHONE.w, PHONE.h, PHONE.l, 6, 1.05);
  const bodyMat = new THREE.MeshPhysicalMaterial({ color: '#2a2d31', metalness: 0.8, roughness: 0.28, clearcoat: 0.8, clearcoatRoughness: 0.15 });
  const screen = phoneScreen();
  const screenMat = new THREE.MeshPhysicalMaterial({
    color: '#040506', roughness: 0.08, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.04,
    emissive: '#ffffff', emissiveMap: screen.texture, emissiveIntensity: 0,
  });
  const darkGlass = new THREE.MeshPhysicalMaterial({ color: '#050607', roughness: 0.08, clearcoat: 1, clearcoatRoughness: 0.05 });
  function makePhone(glass, faceDown) {
    const g = new THREE.Group();
    const body = new THREE.Mesh(phoneBody, bodyMat);
    body.position.y = PHONE.h / 2;
    body.castShadow = true;
    body.receiveShadow = true;
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(PHONE.w - 0.5, PHONE.l - 0.5), glass);
    scr.rotation.x = -Math.PI / 2;
    scr.position.y = PHONE.h + 0.006;
    g.add(body, scr);
    if (faceDown) { // camera bump on top, screen hidden underneath
      scr.position.y = -0.006; scr.rotation.x = Math.PI / 2;
      const bump = new THREE.Mesh(new RoundedBoxGeometry(3, 0.25, 3, 4, 0.6), bodyMat);
      bump.position.set(-1.6, PHONE.h + 0.1, -5.2);
      bump.castShadow = true;
      g.add(bump);
      [[-2.3, -5.9], [-0.9, -5.9], [-2.3, -4.5]].forEach(([x, z]) => {
        const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.12, 24), darkGlass);
        lens.position.set(x, PHONE.h + 0.27, z);
        g.add(lens);
      });
    }
    g.add(blob(PHONE.w * 1.9, PHONE.l * 1.35, 0.55));
    scene.add(g);
    return g;
  }
  const heroPhone = makePhone(screenMat, false);
  const sidePhone = makePhone(darkGlass, true);
  const placePhone = (g, s, u) => {
    g.position.set(lerp(s.from.x, s.to.x, u), 0, lerp(s.from.z, s.to.z, u));
    g.rotation.y = lerp(s.from.ry, s.to.ry, u);
    g.updateMatrixWorld();
  };
  const portOf = (g) => new THREE.Vector3(0, 0.38, PHONE.l / 2 + 0.6).applyMatrix4(g.matrixWorld);
  onProgress(0.45);

  // ── Sticky notes (curled loose notes that tidy into a stack) ──
  const notes = NOTES.map((n, i) => {
    const geo = new THREE.PlaneGeometry(7.6, 7.6, 16, 16);
    const pos = geo.attributes.position;
    for (let k = 0; k < pos.count; k++) {
      const v = (pos.getY(k) + 3.8) / 7.6; // 0 bottom … 1 top (glue edge)
      pos.setZ(k, (Math.max(0, 0.45 - v) ** 2) * 2.2 + Math.sin(pos.getX(k) * 0.4) * 0.05);
    }
    geo.computeVertexNormals();
    const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: noteTexture(i + 3, n.text), roughness: 0.92, side: THREE.DoubleSide }));
    m.rotation.x = -Math.PI / 2;
    m.castShadow = true;
    m.receiveShadow = true;
    scene.add(m);
    return m;
  });
  const placeNotes = (u) => notes.forEach((m, i) => {
    const [x, z, r] = NOTES[i].from;
    const k = clamp(u * 1.4 - i * 0.12);
    const e = ease(k);
    m.position.set(lerp(x, NOTE_STACK[0] + i * 0.15, e), 0.06 + i * 0.03 + Math.sin(k * Math.PI) * 3, lerp(z, NOTE_STACK[1] - i * 0.1, e));
    m.rotation.z = lerp(r, 0.04 * (i % 2 ? 1 : -1), e);
  });
  onProgress(0.55);

  // ── Cables: tangled → tidy. Same point count in both states, so they glide between them. ──
  const N = 30;
  const R = 0.42;
  const cableDefs = [
    { color: '#121315', rough: 0.42, seed: 5 },
    { color: '#ebe8e2', rough: 0.5, seed: 9 },
    { color: '#6c7076', rough: 0.45, seed: 21 },
  ];
  const tangled = cableDefs.map(({ seed }, ci) => {
    // A stiff cable dropped on a desk lies in loose loops: a stretched trochoid, wobbled a little.
    const r = rng(seed);
    const loops = [2.2, 1.6, 2.6][ci], rad = [7.5, 9, 6.5][ci], ph = r() * 6.28;
    const [x0, x1] = [[-44, 40], [-36, 46], [-46, 30]][ci];
    const zc = [-4, 6, -12][ci];
    const pts = [];
    for (let i = 0; i < N; i++) {
      const t = i / (N - 1), a = t * Math.PI * 2 * loops + ph;
      const x = lerp(x0, x1, t) + Math.cos(a) * rad + (r() - 0.5) * 2;
      const z = zc + Math.sin(a) * rad * 0.85 + Math.sin(t * 3.1 + ci) * 6 + (r() - 0.5) * 2;
      pts.push(new THREE.Vector3(x, R + Math.max(0, Math.sin(a * 0.5 + ci)) * 0.55, z));
    }
    return pts;
  });
  const tidy = (ci, port) => {
    const pts = [];
    if (ci === 0) { // charger: from the phone's port, straight off the bottom of the desk
      for (let i = 0; i < N; i++) { const t = i / (N - 1); pts.push(new THREE.Vector3(port.x + Math.sin(t * 3) * 1.5, R, port.z + t * 70)); }
    } else if (ci === 1) { // neat coil at the side
      for (let i = 0; i < N; i++) { const a = (i / (N - 1)) * Math.PI * 2 * 2.6; pts.push(new THREE.Vector3(41 + Math.cos(a) * 3.6, R + i * 0.03, 17 + Math.sin(a) * 3.6)); }
    } else { // pushed out of the way along the back edge
      for (let i = 0; i < N; i++) { const t = i / (N - 1); pts.push(new THREE.Vector3(lerp(-70, 70, t), R, -27 + Math.sin(t * 5) * 0.8)); }
    }
    return pts;
  };
  const cables = cableDefs.map(({ color, rough }) => {
    const m = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0 }));
    m.castShadow = true;
    m.receiveShadow = true;
    scene.add(m);
    const plug = new THREE.Mesh(new RoundedBoxGeometry(0.95, 0.62, 2.4, 3, 0.2), new THREE.MeshStandardMaterial({ color, roughness: rough }));
    plug.castShadow = true;
    scene.add(plug);
    return { m, plug };
  });
  let lastU = -1;
  const tmp = new THREE.Vector3();
  function placeCables(u) {
    if (Math.abs(u - lastU) < 0.0015) return;
    lastU = u;
    const port = portOf(heroPhone);
    cables.forEach((c, ci) => {
      const A = tangled[ci], B = tidy(ci, port);
      const k = ease(clamp(u * 1.25 - ci * 0.1));
      const pts = A.map((a, i) => {
        const p = a.clone().lerp(B[i], k);
        p.y += Math.sin(k * Math.PI) * 1.6 * Math.sin((i / N) * Math.PI); // lifts as it slides, then lies down
        return p;
      });
      if (ci === 0) pts[0].copy(port).setY(R); // the charger stays plugged into the phone
      const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
      c.m.geometry.dispose();
      c.m.geometry = new THREE.TubeGeometry(curve, 260, R, 10, false);
      curve.getPointAt(0, c.plug.position);
      curve.getTangentAt(0, tmp);
      c.plug.lookAt(tmp.add(c.plug.position));
    });
  }
  onProgress(0.65);

  // ── Printed sheets and the laptop (the morning) ──
  const sheets = [0, 1, 2, 3].map((i) => {
    const geo = new THREE.PlaneGeometry(21, 29.7, 10, 10);
    const pos = geo.attributes.position;
    for (let k = 0; k < pos.count; k++) pos.setZ(k, Math.sin((pos.getX(k) / 21 + 0.5) * Math.PI) * 0.35 + (i % 2) * 0.1);
    geo.computeVertexNormals();
    const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: sheetTexture(i + 1), roughness: 0.95, side: THREE.DoubleSide }));
    m.rotation.x = -Math.PI / 2;
    m.castShadow = true;
    m.receiveShadow = true;
    scene.add(m);
    return m;
  });
  const SHEET_MESS = [[-14, -60, 0.5], [12, -58, -0.4], [-2, -70, 0.15], [20, -80, 0.9]];
  const placeSheets = (s) => sheets.forEach((m, i) => {
    const [x, z, r] = SHEET_MESS[i];
    const k = ease(clamp(s * 1.3 - i * 0.1));
    m.position.set(lerp(x, -38 + i * 0.2, k), 0.05 + i * 0.04 + Math.sin(k * Math.PI) * 6, lerp(z, -70 - i * 0.15, k));
    m.rotation.z = lerp(r, 0.06 - i * 0.03, k);
  });

  const alu = new THREE.MeshPhysicalMaterial({ color: '#8e9095', metalness: 0.9, roughness: 0.34, clearcoat: 0.2 });
  const laptop = new THREE.Group();
  laptop.position.set(LAPTOP.x, 0, LAPTOP.z);
  const base = new THREE.Mesh(new RoundedBoxGeometry(31, 1.4, 21.5, 4, 0.6), alu);
  base.position.y = 0.7;
  base.castShadow = true;
  base.receiveShadow = true;
  const deck = new THREE.Mesh(new THREE.PlaneGeometry(29, 19.6), new THREE.MeshStandardMaterial({ map: keyboardTexture(), roughness: 0.55, metalness: 0.3 }));
  deck.rotation.x = -Math.PI / 2;
  deck.position.y = 1.405;
  const lid = new THREE.Group();
  lid.position.set(0, 1.4, -10.75); // hinge at the back edge
  const lidShell = new THREE.Mesh(new RoundedBoxGeometry(31, 0.55, 21.5, 4, 0.25), alu);
  lidShell.position.set(0, 0.28, 10.75);
  lidShell.castShadow = true;
  const dash = dashboardScreen();
  const bezel = new THREE.Mesh(new THREE.PlaneGeometry(30, 20.6), new THREE.MeshPhysicalMaterial({ color: '#050607', roughness: 0.4, clearcoat: 0.3, envMapIntensity: 0.3 }));
  bezel.rotation.x = Math.PI / 2;
  bezel.position.set(0, -0.005, 10.75);
  const display = new THREE.Mesh(new THREE.PlaneGeometry(28, 18), new THREE.MeshStandardMaterial({ color: '#000', emissive: '#fff', emissiveMap: dash.texture, emissiveIntensity: 0, roughness: 0.7, envMapIntensity: 0.12 }));
  display.rotation.x = Math.PI / 2;
  display.position.set(0, -0.01, 10.9);
  lid.add(lidShell, bezel, display);
  laptop.add(base, deck, lid, blob(46, 36, 0.5));
  scene.add(laptop);
  onProgress(0.8);

  // ── Camera rig ──
  const look = new THREE.Vector3();
  const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
  addEventListener('pointermove', (e) => { pointer.x = e.clientX / innerWidth - 0.5; pointer.y = e.clientY / innerHeight - 0.5; }, { passive: true });
  let fit = 1;
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Portrait screens pull the camera back so the same desk width stays in frame.
    fit = camera.aspect < 1 ? clamp(0.8 / camera.aspect, 1, 1.9) : clamp(1.25 / camera.aspect, 1, 1.4);
    camera.updateProjectionMatrix();
  }

  const day = new THREE.Color('#ffffff'), nightTint = new THREE.Color('#5d6670');
  const keyDay = new THREE.Color('#fff1dd'), keyDawn = new THREE.Color('#ffd7ae');
  let clock = 0;
  function render(S, dt) {
    clock += dt;
    // Objects
    placePhone(heroPhone, HERO_PHONE, ease(clamp(S.untangle)));
    placePhone(sidePhone, SIDE_PHONE, ease(clamp(S.untangle)));
    placeNotes(S.untangle);
    placeCables(S.untangle);
    heads[0].material.opacity = 1 - S.headSwap;
    heads[1].material.opacity = S.headSwap * (1 - S.dusk);
    placeSheets(S.sheets);
    lid.rotation.x = -S.lid * 1.92;
    display.material.emissiveIntensity = S.lid > 0.5 ? (S.lid - 0.5) * 2 * 1.05 : 0;
    dash.draw(S.dash);

    // Night: daylight fades, the phone screen wakes and lights the desk
    const n = S.dusk;
    key.intensity = lerp(2.6, 0.02, n);
    key.color.copy(keyDay).lerp(keyDawn, S.dawn);
    moon.intensity = n * 0.35;
    scene.environmentIntensity = lerp(0.38, 0.03, n);
    deskMat.color.copy(day).lerp(nightTint, n * 0.85);
    renderer.toneMappingExposure = lerp(1.0, 1.35, n);
    screenMat.emissiveIntensity = S.screen * 1.15;
    screen.draw(S.chat, S.chat < 1 ? '11:42' : '11:43');
    glows.forEach((g, i) => {
      g.position.set(i ? 5.2 : -5.2, 2.6, 0);
      heroPhone.localToWorld(g.position);
      g.intensity = S.screen * 9;
    });
    windowLight.intensity = lerp(1.1, 0, n);
    windowLight.target.position.copy(look);
    windowLight.position.copy(look).add(new THREE.Vector3(-110, 140, -60));
    lampSpot.intensity = S.dawn * 0;

    // Camera: keyframed path + pointer parallax + a whisper of handheld drift
    pointer.sx += (pointer.x - pointer.sx) * 0.05;
    pointer.sy += (pointer.y - pointer.sy) * 0.05;
    look.set(S.tx, S.ty, S.tz);
    const off = new THREE.Vector3(S.cx - S.tx, S.cy - S.ty, S.cz - S.tz).multiplyScalar(fit);
    camera.position.copy(look).add(off);
    camera.position.x += pointer.sx * 3 + Math.sin(clock * 0.37) * 0.12;
    camera.position.z += pointer.sy * 3 + Math.cos(clock * 0.29) * 0.12;
    // Looking straight down, "up" is the far edge of the desk; it blends to world-up as the camera tilts.
    const dy = Math.abs(look.y - camera.position.y) / camera.position.distanceTo(look);
    const w = clamp((dy - 0.86) / 0.12);
    camera.up.set(0, 1 - w, -w).normalize();
    camera.lookAt(look);

    // Keep the sun's shadow box centred on what the camera sees
    key.target.position.copy(look);
    key.position.copy(look).add(new THREE.Vector3(-70, 62, 46));
    renderer.render(scene, camera);
  }

  resize();
  onProgress(1);
  return { render, resize, renderer };
}
