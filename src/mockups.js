// Designed placeholder plates for works that don't have an image yet.
// Each one hints at the kind of work using the project's `tone`.

const lines = (...w) => w.map((c) => `<span class="m-line ${c}"></span>`).join('');

const store = (w) => `
  <div class="mock"><div class="m-win"><div class="m-bar"><i></i><i></i><i></i></div>
    <div class="m-body">
      <div class="m-hero">Made slowly, <em>sold</em> beautifully.</div>
      <div class="m-grid"><b></b><b></b><b></b></div>
      ${lines('w6', 'w4')}<span class="m-btn">Shop now</span>
    </div></div></div>`;

const chat = () => `
  <div class="mock mock--chat"><div class="m-phone"><div class="m-screen">
    <div class="m-msg">Hi! Do you have a slot this week?</div>
    <div class="m-msg o">Yes — Thursday 11:00 or Friday 16:30. Which suits you?</div>
    <div class="m-msg">Friday please</div>
    <div class="m-msg o">Booked ✓ A confirmation is on its way.</div>
    <div class="m-msg">Perfect, thank you!</div>
  </div></div></div>`;

const flow = () => `
  <div class="mock"><div class="m-flow">
    <svg viewBox="0 0 100 100" preserveAspectRatio="none">
      <path d="M22 18 C 40 18, 40 42, 60 42" /><path d="M60 42 C 80 42, 80 64, 62 70" />
      <path d="M62 70 C 44 76, 30 80, 30 90" /><path d="M60 42 C 30 50, 26 58, 26 60" />
    </svg>
    <span class="m-node" style="left:4%;top:12%">Form submitted</span>
    <span class="m-node" style="left:44%;top:36%">Create CRM deal</span>
    <span class="m-node" style="left:8%;top:56%">Send proposal</span>
    <span class="m-node" style="left:46%;top:66%">Stripe invoice</span>
    <span class="m-node" style="left:14%;top:86%">Notify team</span>
  </div></div>`;

const web = () => `
  <div class="mock"><div class="m-win"><div class="m-bar"><i></i><i></i><i></i></div>
    <div class="m-body">
      ${lines('w4')}
      <div class="m-hero">Brands worth <em>reading</em> about.</div>
      ${lines('w8', 'w6', 'w4')}<span class="m-btn">Read the story</span>
    </div></div></div>`;

const app = () => `
  <div class="mock mock--app"><div class="m-phone"><div class="m-screen">
    <div class="m-head">Good morning.<br/>Your week</div>
    <div class="m-card"><b></b>${lines('w6', 'w4')}</div>
    <div class="m-card">${lines('w8', 'w4')}</div>
    <span class="m-btn" style="justify-self:stretch;text-align:center">Book</span>
  </div></div></div>`;

const terminal = () => `
  <div class="mock"><div class="m-term">
    <div><span class="acc">$</span> git push origin main</div>
    <div class="dim">→ running 214 tests…</div>
    <div class="ok">✓ tests passed (38s)</div>
    <div class="dim">→ building image · scanning</div>
    <div class="ok">✓ preview deployed</div>
    <div class="ok">✓ production · zero downtime</div>
    <div><span class="acc">$</span> _</div>
  </div></div>`;

const kinds = { store, chat, flow, web, app, terminal };
export const mockup = (w) => (kinds[w.mock] || web)(w);
