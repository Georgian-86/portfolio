import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

// Ashima Arts 3D simplex noise (MIT)
const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

/** Patch a standard/physical material so its sphere geometry wobbles like liquid glass. */
function liquify(material, uniforms) {
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>
        uniform float uTime; uniform float uAmp; uniform float uFreq;
        ${NOISE}
        vec3 displace(vec3 p){
          vec3 n = normalize(p);
          float d = snoise(n*uFreq + vec3(uTime*.18, uTime*.13, -uTime*.11));
          d += .35*snoise(n*uFreq*2.3 - uTime*.25);
          return n * (length(p) + d*uAmp);
        }`)
      .replace('#include <beginnormal_vertex>', `
        vec3 n0 = normalize(position);
        vec3 tg = normalize(cross(n0, abs(n0.y) > .99 ? vec3(1.,0.,0.) : vec3(0.,1.,0.)));
        vec3 bt = normalize(cross(n0, tg));
        float e = .012;
        vec3 dp0 = displace(position);
        vec3 dp1 = displace(position + tg*e);
        vec3 dp2 = displace(position + bt*e);
        vec3 objectNormal = normalize(cross(dp1-dp0, dp2-dp0));
        if (dot(objectNormal, n0) < 0.) objectNormal = -objectNormal;`)
      .replace('#include <begin_vertex>', 'vec3 transformed = dp0;');
  };
}

const GrainShader = {
  uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uAmount: { value: 0.045 }, uRGB: { value: 0.0018 } },
  vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
  fragmentShader: `uniform sampler2D tDiffuse; uniform float uTime; uniform float uAmount; uniform float uRGB; varying vec2 vUv;
    float rand(vec2 c){ return fract(sin(dot(c, vec2(12.9898,78.233))) * 43758.5453); }
    void main(){
      vec2 dir = vUv - .5; float dist = length(dir);
      vec2 off = dir * uRGB * dist * 4.;
      vec4 c = texture2D(tDiffuse, vUv);
      c.r = texture2D(tDiffuse, vUv + off).r;
      c.b = texture2D(tDiffuse, vUv - off).b;
      c.rgb += (rand(vUv*vec2(1920.,1080.) + fract(uTime)) - .5) * uAmount;
      c.rgb *= smoothstep(1.05, .35, dist);   // vignette
      gl_FragColor = c;
    }`,
};

export class Scene {
  constructor(canvas) {
    this.canvas = canvas;
    this.clock = new THREE.Clock();
    this.mouse = new THREE.Vector2();
    this.mouseEased = new THREE.Vector2();
    const isMobile = matchMedia('(max-width: 820px)').matches;
    this.low = isMobile || navigator.hardwareConcurrency <= 4;

    // State the scroll timeline drives
    this.state = {
      camX: 0, camY: 0, camZ: 7.5, lookX: 0, lookY: 0,
      coreX: 1.6, coreY: 0, coreScale: 1, amp: 0.28, freq: 1.35, spin: 0,
      hue: 0.72, ringTilt: 0.35, ringSpread: 1, particles: 1, exposure: 1.05, dim: 0,
    };

    this.initRenderer();
    this.initWorld();
    this.initPost();
    this.onResize();
    addEventListener('resize', () => this.onResize());
    addEventListener('pointermove', (e) => {
      this.mouse.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
    });
  }

  initRenderer() {
    const r = (this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: !this.low, powerPreference: 'high-performance' }));
    r.setPixelRatio(Math.min(devicePixelRatio, this.low ? 1.25 : 1.75));
    r.toneMapping = THREE.ACESFilmicToneMapping;
    r.toneMappingExposure = 1.05;
    r.outputColorSpace = THREE.SRGBColorSpace;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);
    this.camera.position.set(0, 0, 7.5);
    const pmrem = new THREE.PMREMGenerator(r);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environmentIntensity = 0.9;
  }

  initWorld() {
    const s = this.scene;
    this.accent = new THREE.Color();

    // Backdrop: a huge inside-out sphere with a soft nebula gradient (gives the glass something to refract)
    this.backdropMat = new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      uniforms: { uTime: { value: 0 }, uA: { value: new THREE.Color('#1a0f3d') }, uB: { value: new THREE.Color('#032a3a') } },
      vertexShader: `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
      fragmentShader: `uniform float uTime; uniform vec3 uA; uniform vec3 uB; varying vec3 vP; ${NOISE}
        void main(){
          float n = snoise(vP*1.6 + uTime*.03)*.5+.5;
          float m = snoise(vP*3.2 - uTime*.02)*.5+.5;
          vec3 c = mix(vec3(.012,.012,.02), uA, smoothstep(.45,1.,n)*.9);
          c = mix(c, uB, smoothstep(.55,1.,m)*.8);
          gl_FragColor = vec4(c, 1.);
        }`,
    });
    s.add(new THREE.Mesh(new THREE.SphereGeometry(60, 48, 48), this.backdropMat));

    this.root = new THREE.Group();
    s.add(this.root);

    // Liquid glass core
    this.coreUniforms = { uTime: { value: 0 }, uAmp: { value: 0.28 }, uFreq: { value: 1.35 } };
    this.glass = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, metalness: 0, roughness: 0.04, transmission: 1, thickness: 1.6, ior: 1.45,
      iridescence: 1, iridescenceIOR: 1.3, iridescenceThicknessRange: [120, 480],
      clearcoat: 1, clearcoatRoughness: 0.05, dispersion: 4, attenuationColor: new THREE.Color('#c9b8ff'),
      attenuationDistance: 2.5, envMapIntensity: 1.4, specularIntensity: 1,
    });
    liquify(this.glass, this.coreUniforms);
    this.core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.25, this.low ? 48 : 96), this.glass);
    this.root.add(this.core);

    // Glowing heart inside the glass
    this.heartMat = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: new THREE.Color('#8b5cff'), emissiveIntensity: 4, roughness: 0.3 });
    this.heart = new THREE.Mesh(new THREE.TorusKnotGeometry(0.42, 0.11, 220, 24, 2, 3), this.heartMat);
    this.core.add(this.heart);

    // Chrome orbit rings
    const chrome = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 1, roughness: 0.12, clearcoat: 1, envMapIntensity: 1.6 });
    this.rings = new THREE.Group();
    [1.9, 2.35, 2.9].forEach((rad, i) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(rad, 0.012 + i * 0.004, 16, 220), chrome);
      ring.rotation.x = Math.PI / 2 + i * 0.25;
      ring.rotation.y = i * 0.4;
      ring.userData.speed = 0.08 + i * 0.05;
      // a small glowing satellite on each ring
      const sat = new THREE.Mesh(new THREE.SphereGeometry(0.045, 24, 24),
        new THREE.MeshBasicMaterial({ color: new THREE.Color().setHSL(0.55 + i * 0.1, 1, 0.7) }));
      sat.position.x = rad;
      ring.add(sat);
      this.rings.add(ring);
    });
    this.root.add(this.rings);

    // Floating shards: small glass + chrome polyhedra drifting around the scene
    this.shards = new THREE.Group();
    const shardGeos = [new THREE.OctahedronGeometry(0.22), new THREE.TetrahedronGeometry(0.24), new THREE.IcosahedronGeometry(0.18, 0), new THREE.BoxGeometry(0.26, 0.26, 0.26)];
    const shardGlass = new THREE.MeshPhysicalMaterial({ roughness: 0.08, transmission: 1, thickness: 0.6, ior: 1.5, iridescence: 0.6, clearcoat: 1 });
    const count = this.low ? 10 : 22;
    for (let i = 0; i < count; i++) {
      const m = new THREE.Mesh(shardGeos[i % shardGeos.length], i % 3 === 0 ? chrome : shardGlass);
      const a = Math.random() * Math.PI * 2;
      const r = 3.2 + Math.random() * 4.5;
      m.position.set(Math.cos(a) * r, (Math.random() - 0.5) * 7, Math.sin(a) * r - 2);
      m.userData = { a, r, y: m.position.y, s: 0.1 + Math.random() * 0.25, rot: new THREE.Vector3(Math.random(), Math.random(), Math.random()) };
      m.scale.setScalar(0.6 + Math.random() * 1.2);
      this.shards.add(m);
    }
    s.add(this.shards);

    // Particle dust
    const N = this.low ? 1800 : 5000;
    const pos = new Float32Array(N * 3);
    const seed = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const r = 4 + Math.pow(Math.random(), 0.6) * 22;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pos.set([r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph) * 0.6, r * Math.sin(ph) * Math.sin(th)], i * 3);
      seed[i] = Math.random();
    }
    const pg = new THREE.BufferGeometry();
    pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    pg.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    this.dustMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color('#9d8cff') }, uPR: { value: this.renderer.getPixelRatio() }, uAlpha: { value: 1 } },
      vertexShader: `attribute float aSeed; uniform float uTime; uniform float uPR; varying float vA;
        void main(){
          vec3 p = position;
          p.y += sin(uTime*.3 + aSeed*30.)*.25;
          p.x += cos(uTime*.2 + aSeed*20.)*.25;
          vec4 mv = modelViewMatrix*vec4(p,1.);
          gl_PointSize = (1.2 + aSeed*2.6) * uPR * (12. / -mv.z);
          vA = .35 + .65*sin(uTime*1.5 + aSeed*60.)*.5+.5;
          gl_Position = projectionMatrix*mv;
        }`,
      fragmentShader: `uniform vec3 uColor; uniform float uAlpha; varying float vA;
        void main(){ float d = length(gl_PointCoord-.5); float a = smoothstep(.5,0.,d); gl_FragColor = vec4(uColor, a*vA*.55*uAlpha); }`,
    });
    this.dust = new THREE.Points(pg, this.dustMat);
    s.add(this.dust);

    // Key/rim lights (environment does most of the work)
    const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(4, 5, 6); s.add(key);
    this.rim = new THREE.PointLight(0x7c5cff, 40, 20); this.rim.position.set(-4, -1, -2); s.add(this.rim);
    this.rim2 = new THREE.PointLight(0x22e1ff, 30, 20); this.rim2.position.set(4, -2, 3); s.add(this.rim2);
  }

  initPost() {
    const size = new THREE.Vector2(innerWidth, innerHeight);
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloom = new UnrealBloomPass(size, this.low ? 0.5 : 0.7, 0.6, 0.86);
    this.composer.addPass(this.bloom);
    this.grain = new ShaderPass(GrainShader);
    this.composer.addPass(this.grain);
    this.composer.addPass(new OutputPass());
  }

  onResize() {
    const w = innerWidth, h = innerHeight;
    this.camera.aspect = w / h;
    // Pull the camera back on portrait screens so the core stays framed
    this.camera.fov = w / h < 0.8 ? 52 : 38;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
    this.composer?.setSize(w, h);
    this.mobileShift = w < 820 ? 0 : 1;
  }

  render() {
    const t = this.clock.getElapsedTime();
    const st = this.state;
    this.mouseEased.lerp(this.mouse, 0.05);

    // Camera
    this.camera.position.set(st.camX + this.mouseEased.x * 0.35, st.camY + this.mouseEased.y * 0.25, st.camZ);
    this.camera.lookAt(st.lookX, st.lookY, 0);

    // Core
    // On phones the core floats above the copy instead of beside it
    const m = this.mobileShift === 0;
    this.root.position.set(st.coreX * this.mobileShift, st.coreY + (m ? 1.9 : 0), 0);
    this.root.scale.setScalar(st.coreScale * (m ? 0.72 : 1));
    this.coreUniforms.uTime.value = t;
    this.coreUniforms.uAmp.value = st.amp;
    this.coreUniforms.uFreq.value = st.freq;
    this.core.rotation.y = t * 0.12 + st.spin;
    this.core.rotation.x = Math.sin(t * 0.2) * 0.2 + this.mouseEased.y * 0.3;
    this.heart.rotation.x = t * 0.5; this.heart.rotation.y = t * 0.35;

    // Colour grading driven by hue (services section can override it per card)
    const target = this.hueOverride ?? st.hue;
    if (this.hueLive === undefined) this.hueLive = target;
    let d = target - this.hueLive;
    d -= Math.round(d); // shortest way around the colour wheel
    this.hueLive = (this.hueLive + d * 0.04 + 1) % 1;
    const hue = this.hueLive;
    this.accent.setHSL(hue, 0.95, 0.6);
    this.heartMat.emissive.copy(this.accent);
    this.rim.color.copy(this.accent);
    this.rim2.color.setHSL((hue + 0.18) % 1, 0.95, 0.6);
    this.dustMat.uniforms.uColor.value.setHSL(hue, 0.8, 0.72);
    this.glass.attenuationColor.setHSL(hue, 0.6, 0.85);
    this.backdropMat.uniforms.uA.value.setHSL(hue, 0.6, 0.12);
    this.backdropMat.uniforms.uB.value.setHSL((hue + 0.2) % 1, 0.7, 0.1);
    this.renderer.toneMappingExposure = st.exposure;

    // Rings
    this.rings.rotation.x = st.ringTilt + this.mouseEased.y * 0.15;
    this.rings.rotation.z = this.mouseEased.x * 0.15;
    this.rings.children.forEach((r, i) => {
      r.rotation.z = t * r.userData.speed * (i % 2 ? -1 : 1);
      r.scale.setScalar(1 + (st.ringSpread - 1) * (i + 1) * 0.5);
    });

    // Shards drift
    this.shards.children.forEach((m) => {
      const u = m.userData;
      const a = u.a + t * u.s * 0.15;
      m.position.x = Math.cos(a) * u.r;
      m.position.z = Math.sin(a) * u.r - 2;
      m.position.y = u.y + Math.sin(t * u.s + u.a) * 0.4;
      m.rotation.x += u.rot.x * 0.006; m.rotation.y += u.rot.y * 0.006;
    });
    this.dust.rotation.y = t * 0.01 + st.spin * 0.2;
    this.dustMat.uniforms.uTime.value = t;
    this.dustMat.uniforms.uAlpha.value = st.particles;
    this.backdropMat.uniforms.uTime.value = t;
    this.grain.uniforms.uTime.value = t;

    this.composer.render();
  }
}
