// The active "Atelier" colourway. Each look branch swaps these values (and src/tokens.css) together.
export const LOOK = {
  name: 'tangerine',
  field: '#E4572E',     // big colour fields: loader, header, hero panel, key sections
  onField: '#1A1A1A',   // body text on the field (ink: 4.7:1; warm white fails at 3.4:1)
  display: '#FFF6EE',   // large display text on the field (≥ 3:1, WCAG large text)
  key: '#1A1A1A',       // the highlighted key word on the field
  paper: '#FFF6EE',     // calm reading sections
  onPaper: '#1A1A1A',
  btn: '#1A1A1A',       // primary button fill
  onBtn: '#FFF6EE',
};
// Retired v3 navy/mint values that must not render anywhere.
export const RETIRED = ['#0B1426', '#12203A', '#1E2E4D', '#3DDC97', '#0F1E3D', '#0A1630'];
export const rgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${n >> 16}, ${(n >> 8) & 255}, ${n & 255})`;
};
