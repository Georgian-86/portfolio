// The active "Atelier" colourway. Each look branch swaps these values (and src/tokens.css) together.
export const LOOK = {
  name: 'ink',
  field: '#151515',     // big colour fields: loader, header, hero panel, key sections
  onField: '#F1EEE8',   // chalk body text on the field (15.8:1)
  display: '#F1EEE8',   // display text on the field
  key: '#FFB627',       // marigold key word on the field (10.4:1)
  paper: '#F1EEE8',     // chalk reading sections
  onPaper: '#151515',
  btn: '#FFB627',       // primary button: marigold fill, ink text
  onBtn: '#151515',
};
// Retired v3 navy/mint values that must not render anywhere.
export const RETIRED = ['#0B1426', '#12203A', '#1E2E4D', '#3DDC97', '#0F1E3D', '#0A1630', '#E4572E'];
export const rgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${n >> 16}, ${(n >> 8) & 255}, ${n & 255})`;
};
