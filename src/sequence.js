// Plays an image sequence (e.g. a Google Flow clip exported to frames)
// on a canvas, frame-by-frame, driven by scroll. See docs/FLOW.md.
export class FrameSequence {
  constructor(canvas, { frames, path, pad = 4, ext = 'webp' }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.frame = 0;
    this.urls = Array.from({ length: frames }, (_, i) => `${path}${String(i + 1).padStart(pad, '0')}.${ext}`);
    this.images = [];
    addEventListener('resize', () => this.draw());
  }

  load() {
    return Promise.all(this.urls.map((src, i) => new Promise((res) => {
      const img = new Image();
      img.onload = img.onerror = () => res();
      img.src = src;
      this.images[i] = img;
    })));
  }

  draw() {
    const img = this.images[Math.round(this.frame)];
    if (!img?.naturalWidth) return;
    const dpr = Math.min(devicePixelRatio, 2);
    const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
    if (this.canvas.width !== w * dpr) { this.canvas.width = w * dpr; this.canvas.height = h * dpr; }
    // cover-fit
    const s = Math.max((w * dpr) / img.naturalWidth, (h * dpr) / img.naturalHeight);
    const dw = img.naturalWidth * s, dh = img.naturalHeight * s;
    this.ctx.drawImage(img, (w * dpr - dw) / 2, (h * dpr - dh) / 2, dw, dh);
  }
}
