// Read-only stats of the "design system by fact" in index.html
const fs = require('fs');
const src = fs.readFileSync(process.argv[2], 'utf8').split(/\r?\n/);
const css = src.slice(56, 1026);            // lines 57..1026 (second <style>)
const js = src.slice(1269, 4711);           // script
const tally = () => new Map();
const add = (m, k, line) => { const e = m.get(k) || { n: 0, lines: [] }; e.n++; if (e.lines.length < 12) e.lines.push(line); m.set(k, e); };
const out = (title, m, max = 80) => {
  console.log('\n## ' + title + ' (' + m.size + ' разных)');
  [...m.entries()].sort((a, b) => b[1].n - a[1].n).slice(0, max).forEach(([k, v]) => console.log(String(v.n).padStart(4) + '  ' + k + '   @' + v.lines.join(',')));
};
const strip = l => l.replace(/\/\*.*?\*\//g, '');
const props = {
  'font-size': tally(), 'font-weight': tally(), 'border-radius': tally(), 'box-shadow': tally(), 'line-height': tally(),
  'letter-spacing': tally(), 'z-index': tally(), 'gap': tally(), 'padding': tally(), 'margin': tally(), 'min-height': tally(), 'height': tally(),
  'transition': tally(), 'animation': tally(), 'opacity': tally(), 'font-family': tally(), 'border': tally(), 'width': tally()
};
const colors = tally(), colorsRoot = tally(), mixes = tally(), durations = tally(), easings = tally(), varUse = tally();
let inRoot = false;
css.forEach((raw, i) => {
  const line = i + 57; let l = strip(raw);
  if (/^:root|^@media \(prefers-color-scheme: light\)\{:root/.test(l)) inRoot = true;
  const root = inRoot || /^\s+--/.test(l);
  if (/^\}/.test(l) || /^\}\}/.test(l)) { inRoot = false; }
  (l.match(/#[0-9a-fA-F]{3,8}\b/g) || []).forEach(c => add(root ? colorsRoot : colors, c.toUpperCase(), line));
  (l.match(/rgba?\([^)]*\)/g) || []).forEach(c => add(root ? colorsRoot : colors, c, line));
  (l.match(/color-mix\((?:[^()]|\([^()]*\))*\)/g) || []).forEach(c => add(mixes, c, line));
  (l.match(/var\(--[a-z0-9-]+/g) || []).forEach(c => add(varUse, c.slice(4), line));
  if (root) return;
  const re = /(?:^|[;{\s])([a-z-]+)\s*:\s*([^;}]+)/g; let m;
  while ((m = re.exec(l))) {
    let p = m[1], v = m[2].trim();
    if (p.startsWith('padding')) p = 'padding'; if (p.startsWith('margin')) p = 'margin';
    if (p === 'row-gap' || p === 'column-gap') p = 'gap';
    if (p === 'border-top' || p === 'border-bottom' || p === 'border-left' || p === 'border-right') p = 'border';
    if (props[p]) add(props[p], v, line);
    if (p === 'transition' || p === 'animation') {
      (v.match(/\d*\.?\d+m?s\b/g) || []).forEach(d => add(durations, d, line));
      (v.match(/cubic-bezier\([^)]*\)|ease-in-out|ease-out|ease-in|\bease\b|linear/g) || []).forEach(d => add(easings, d, line));
      if (!/cubic-bezier|ease|linear/.test(v)) add(easings, '(по умолчанию ease)', line);
    }
  }
});
out('Цвета в :root (токены)', colorsRoot);
out('Цвета вне :root (жёстко в правилах)', colors);
out('color-mix()', mixes);
Object.entries(props).forEach(([k, m]) => out(k, m, k === 'padding' || k === 'margin' || k === 'width' || k === 'height' ? 40 : 80));
out('Длительности', durations); out('Кривые', easings);
out('Использование переменных', varUse, 200);
// atomic px values in padding/gap/margin
const atoms = tally();
['padding', 'gap', 'margin'].forEach(p => props[p].forEach((v, k) => (k.match(/-?\d*\.?\d+px/g) || []).forEach(a => { const e = atoms.get(a) || { n: 0, lines: [] }; e.n += v.n; atoms.set(a, e); })));
out('Отдельные px-значения в padding/gap/margin', atoms, 60);
// JS inline styles
const jsHex = tally(), jsStyle = tally(), jsFs = tally();
js.forEach((raw, i) => {
  const line = i + 1270;
  (raw.match(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b(?![0-9a-zA-Z_-])/g) || []).forEach(c => add(jsHex, c.toUpperCase(), line));
  (raw.match(/style="[^"]*"/g) || []).forEach(c => add(jsStyle, c.slice(0, 140), line));
  (raw.match(/\.style\.[a-zA-Z]+\s*=\s*[^;]{0,60}|setProperty\([^)]{0,80}\)/g) || []).forEach(c => add(jsStyle, c.slice(0, 120), line));
  (raw.match(/font-size:\s*[^;"'`]+/g) || []).forEach(c => add(jsFs, c, line));
});
out('JS: hex-цвета', jsHex); out('JS: inline-стили', jsStyle, 120); out('JS: font-size', jsFs);
