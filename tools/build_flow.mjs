// Builds the homepage "one team behind your back office" diagram in index.html, between
// <!--FLOW--> and <!--/FLOW-->. Three lanes (Grow, Get paid, Run) run through the adsonus mark.
// Two SVGs: a wide one for desktop and a tall one for phones (short titles, no captions).
// Run from the repo root: node tools/build_flow.mjs
import { readFileSync, writeFileSync } from 'node:fs';

// id: [title, meta, short title for phones]
const NODES = {
  ads:      ['Your ads', 'Google, Meta, LinkedIn', 'Your ads'],
  lead:     ['New lead', 'Routed the same day', 'New lead'],
  crm:      ['In your CRM', 'Follow-up approved', 'In your CRM'],
  meeting:  ['Meeting booked', 'For your salesperson', 'Meeting set'],
  invoice:  ['Invoice overdue', 'Followed up in your tone', 'Invoice due'],
  bill:     ['Supplier bill', 'Captured and checked', 'Supplier bill'],
  run:      ['Payment run', 'Released by you', 'Payment run'],
  paid:     ['Paid', 'Straight to your bank', 'Paid'],
  message:  ['Customer message', 'Email, chat, forms', 'Message in'],
  starter:  ['New starter', 'Accounts and paperwork', 'New starter'],
  handled:  ['Handled', 'Within agreed times', 'Handled'],
  report:   ['In your report', 'Every week', 'Reported'],
};
const LANES = {
  grow: { name: 'Grow',     ids: ['ads', 'lead', 'hub', 'crm', 'meeting'] },
  paid: { name: 'Get paid', ids: ['invoice', 'bill', 'hub', 'run', 'paid'] },
  run:  { name: 'Run',      ids: ['message', 'starter', 'hub', 'handled', 'report'] },
};

const LAYOUTS = {
  h: { vb: [1280, 560], w: 224, h: 70, hub: [640, 280, 150], dir: 'x', title: 17, meta: 14, short: false,
       lanes: { grow: 90, paid: 280, run: 470 }, cols: [140, 400, null, 880, 1140] },
  v: { vb: [400, 1000], w: 118, h: 48, hub: [200, 500, 118], dir: 'y', title: 13, meta: 0, short: true,
       lanes: { grow: 68, paid: 200, run: 332 }, rows: [80, 240, null, 760, 920] },
};

function pos(L, lane, i) {
  if (LANES[lane].ids[i] === 'hub') return [L.hub[0], L.hub[1]];
  return L.dir === 'x' ? [L.cols[i], L.lanes[lane]] : [L.lanes[lane], L.rows[i]];
}
function curve(L, a, b) {
  const [x1, y1] = a, [x2, y2] = b;
  if (L.dir === 'x') { const m = (x2 - x1) / 2; return `C${x1 + m},${y1} ${x2 - m},${y2} ${x2},${y2}`; }
  const m = (y2 - y1) / 2; return `C${x1},${y1 + m} ${x2},${y2 - m} ${x2},${y2}`;
}

function svg(key) {
  const L = LAYOUTS[key], [W, H] = L.vb, out = [];
  out.push(`<svg class="flow flow-${key}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="flow-desc">`);
  for (const [lane, { ids }] of Object.entries(LANES)) {
    let d = `M${pos(L, lane, 0).join(',')}`;
    for (let i = 1; i < ids.length; i++) d += ' ' + curve(L, pos(L, lane, i - 1), pos(L, lane, i));
    out.push(`<path id="lane-${lane}-${key}" class="lane-track" d="${d}"/>`);
  }
  for (const [lane, { ids }] of Object.entries(LANES)) {
    for (let i = 1; i < ids.length; i++) {
      out.push(`<path class="edge edge-${lane}" data-lane="${lane}" data-to="${ids[i]}" d="M${pos(L, lane, i - 1).join(',')} ${curve(L, pos(L, lane, i - 1), pos(L, lane, i))}"/>`);
    }
  }
  for (const lane of Object.keys(LANES)) out.push(`<circle class="head head-${lane}" r="${L.short ? 6 : 7}" cx="-20" cy="-20"/>`);
  for (const lane of Object.keys(LANES)) for (let i = 0; i < 2; i++) {
    out.push(`<circle class="amb amb-${lane}" r="${L.short ? 4 : 5}"><animateMotion dur="7s" begin="indefinite" repeatCount="indefinite" calcMode="linear" keyPoints="0;1" keyTimes="0;1"${i ? ' data-delay="1.5"' : ''}><mpath href="#lane-${lane}-${key}"/></animateMotion></circle>`);
  }
  const [hx, hy, hs] = L.hub;
  out.push(`<g class="hub" data-node="hub"><circle class="hub-ring" cx="${hx}" cy="${hy}" r="${hs * 0.72}"/><use href="#mark" x="${hx - hs / 2}" y="${hy - hs / 2}" width="${hs}" height="${hs}"/></g>`);
  for (const [lane, { name, ids }] of Object.entries(LANES)) {
    ids.forEach((id, i) => {
      if (id === 'hub') return;
      const [x, y] = pos(L, lane, i), w = L.w, h = L.h, [t, m, s] = NODES[id];
      const cls = `node node-${lane}${i === ids.length - 1 ? ' node-end' : ''}`;
      const first = i === 0 ? ` data-first="${lane}"` : '';
      let inner = `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="${h / 2.6}"/>`;
      if (L.short) {
        inner += `<circle class="pip" cx="${x - w / 2 + 14}" cy="${y}" r="4.5"/><text class="t" x="${x - w / 2 + 25}" y="${y + 4.5}" font-size="${L.title}">${s}</text>`;
      } else {
        inner += `<circle class="pip" cx="${x - w / 2 + 22}" cy="${y - h * 0.14}" r="6"/>` +
          `<text class="t" x="${x - w / 2 + 38}" y="${y - h * 0.14 + 6}" font-size="${L.title}">${t}</text>` +
          `<text class="m" x="${x - w / 2 + 22}" y="${y + h * 0.26}" font-size="${L.meta}">${m}</text>`;
      }
      out.push(`<g class="${cls}" data-node="${id}"${first}>${inner}</g>`);
    });
    if (L.dir === 'x') out.push(`<text class="cap cap-${lane}" x="${L.cols[0] - L.w / 2 + 4}" y="${L.lanes[lane] - L.h / 2 - 14}" font-size="${L.meta}">${name}</text>`);
    else out.push(`<text class="cap cap-${lane}" x="${L.lanes[lane]}" y="30" font-size="13" text-anchor="middle">${name}</text>`);
  }
  out.push('</svg>');
  return out.join('');
}

const desc = '<p id="flow-desc" class="sr-only">Three lanes run through adsonus. Grow: your ads bring a new lead, which is entered in your CRM and becomes a booked meeting. Get paid: overdue invoices and supplier bills are handled, a payment run is released by you, and customers pay straight to your bank. Run: customer messages and new starters are handled within agreed times and appear in your weekly report.</p>';
const file = 'index.html';
const html = readFileSync(file, 'utf8');
if (!/<!--FLOW-->[\s\S]*?<!--\/FLOW-->/.test(html)) throw new Error('FLOW markers not found in index.html');
writeFileSync(file, html.replace(/<!--FLOW-->[\s\S]*?<!--\/FLOW-->/, () => `<!--FLOW-->${desc}${svg('h')}${svg('v')}<!--/FLOW-->`));
console.log('flow diagram written');
