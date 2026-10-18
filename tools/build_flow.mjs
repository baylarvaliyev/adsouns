// Builds the "two sides of the same cash flow" diagram in index.html, between
// <!--FLOW--> and <!--/FLOW-->. Two SVGs: a wide one for desktop, a tall one for phones.
// Run from the repo root: node tools/build_flow.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const NODES = {
  ads:     ['Your ads', 'Google, Meta, LinkedIn'],
  lead:    ['New lead', 'Cost per lead tracked'],
  invoice: ['Invoice sent', 'From your own address'],
  paid:    ['Paid', 'Straight to your bank'],
  bill:    ['Supplier bill', 'Captured and coded'],
  run:     ['Payment run', 'Prepared for you'],
  approve: ['You approve', 'From your own bank'],
};
const LANES = {
  in:  ['ads', 'lead', 'hub', 'invoice', 'paid'],
  out: ['bill', 'hub', 'run', 'approve'],
};

const LAYOUTS = {
  h: { vb: [1280, 440], w: 224, h: 72, hub: [640, 220, 150], dir: 'x', title: 17, meta: 14,
       at: { ads: [140, 110], lead: [400, 110], invoice: [880, 110], paid: [1140, 110],
             bill: [270, 330], run: [880, 330], approve: [1140, 330] },
       captions: [['Money in', 28, 40], ['Money out', 158, 260]] },
  v: { vb: [400, 920], w: 186, h: 66, hub: [200, 460, 124], dir: 'y', title: 16, meta: 13,
       at: { ads: [100, 60], lead: [100, 210], invoice: [100, 710], paid: [100, 860],
             bill: [300, 210], run: [300, 710], approve: [300, 860] },
       captions: [['Money in', 10, 22], ['Money out', 390, 160, 'end']] },
};

const pt = (L, id) => id === 'hub' ? [L.hub[0], L.hub[1]] : L.at[id];
const curve = (L, a, b) => {
  const [x1, y1] = pt(L, a), [x2, y2] = pt(L, b);
  if (L.dir === 'x') { const m = (x2 - x1) / 2; return `C${x1 + m},${y1} ${x2 - m},${y2} ${x2},${y2}`; }
  const m = (y2 - y1) / 2; return `C${x1},${y1 + m} ${x2},${y2 - m} ${x2},${y2}`;
};

function svg(key) {
  const L = LAYOUTS[key], [W, H] = L.vb, out = [];
  out.push(`<svg class="flow flow-${key}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="flow-desc">`);
  // full-lane paths for the ambient dots
  for (const [lane, ids] of Object.entries(LANES)) {
    let d = `M${pt(L, ids[0]).join(',')}`;
    for (let i = 1; i < ids.length; i++) d += ' ' + curve(L, ids[i - 1], ids[i]);
    out.push(`<path id="lane-${lane}-${key}" class="lane-track" d="${d}"/>`);
  }
  // one path per hop, drawn in order
  for (const [lane, ids] of Object.entries(LANES)) {
    for (let i = 1; i < ids.length; i++) {
      const d = `M${pt(L, ids[i - 1]).join(',')} ${curve(L, ids[i - 1], ids[i])}`;
      out.push(`<path class="edge edge-${lane}" data-lane="${lane}" data-to="${ids[i]}" d="${d}"/>`);
    }
  }
  for (const lane of Object.keys(LANES)) out.push(`<circle class="head head-${lane}" r="7" cx="-20" cy="-20"/>`);
  // ambient dots, started by js/home.js once the diagram is drawn
  for (const lane of Object.keys(LANES)) for (let i = 0; i < 3; i++) {
    out.push(`<circle class="amb amb-${lane}" r="5"><animateMotion dur="${lane === 'in' ? 6 : 7}s" begin="indefinite" repeatCount="indefinite" calcMode="linear" keyPoints="0;1" keyTimes="0;1" ${i ? `data-delay="${i}"` : ''}><mpath href="#lane-${lane}-${key}"/></animateMotion></circle>`);
  }
  // hub: the mark
  const [hx, hy, hs] = L.hub;
  out.push(`<g class="hub" data-node="hub" style="transform-origin:${hx}px ${hy}px"><circle class="hub-ring" cx="${hx}" cy="${hy}" r="${hs * 0.72}"/><use href="#mark" x="${hx - hs / 2}" y="${hy - hs / 2}" width="${hs}" height="${hs}"/></g>`);
  // cards
  for (const [id, [t, m]] of Object.entries(NODES)) {
    const [x, y] = L.at[id], w = L.w, h = L.h;
    out.push(`<g class="node node-${id}" data-node="${id}" style="transform-origin:${x}px ${y}px">` +
      `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="${h / 2.6}"/>` +
      `<circle class="pip" cx="${x - w / 2 + 22}" cy="${y - h * 0.14}" r="6"/>` +
      `<text class="t" x="${x - w / 2 + 38}" y="${y - h * 0.14 + 6}" font-size="${L.title}">${t}</text>` +
      `<text class="m" x="${x - w / 2 + 22}" y="${y + h * 0.26}" font-size="${L.meta}">${m}</text></g>`);
  }
  for (const [txt, x, y, anchor] of L.captions)
    out.push(`<text class="cap" x="${x}" y="${y}" font-size="${L.meta}"${anchor ? ` text-anchor="${anchor}"` : ''}>${txt}</text>`);
  out.push('</svg>');
  return out.join('');
}

const desc = '<p id="flow-desc" class="sr-only">Money in: your ads bring a new lead, adsonus turns the work into an invoice, and the invoice is paid straight to your bank. Money out: a supplier bill is captured by adsonus, prepared in a payment run, and released by you from your own bank.</p>';
const file = 'index.html';
const html = readFileSync(file, 'utf8');
if (!/<!--FLOW-->[\s\S]*?<!--\/FLOW-->/.test(html)) throw new Error('FLOW markers not found in index.html');
writeFileSync(file, html.replace(/<!--FLOW-->[\s\S]*?<!--\/FLOW-->/, `<!--FLOW-->${desc}${svg('h')}${svg('v')}<!--/FLOW-->`));
console.log('flow diagram written');
