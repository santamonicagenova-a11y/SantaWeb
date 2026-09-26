// orari-cambio-periodo.mjs — v 2026.09.26.01
// Fa in automatico, alla data di un cambio orari, quello che fa a mano il pulsante
// "📤 Pubblica FAQ" di menu-admin → Orari di Apertura (pubblicaFaqOrari):
//  1) FAQ "Quali sono gli orari?" (translations.json faq_a2 IT/EN/FR + index.html visibile
//     + JSON-LD FAQPage) col testo già approvato nel file di configurazione;
//  2) openingHoursSpecification statico nel JSON-LD di index.html e dove-siamo.html;
//  3) "orarioServizio" del foglio menù stampabile (menu.html, menu-it/en/fr.html).
// 2) e 3) sono ricalcolati dal periodo in vigore letto da get-opening-hours, con la stessa
// logica di menu-admin (_orariBuildJsonLdSpecs / _orariBuildOrarioServizio).
// Sicurezze: non fa nulla prima di "valido_dal" né più di 7 giorni dopo; si ferma con errore
// se il periodo in vigore non è quello atteso (orari cambiati nel frattempo → FAQ da riscrivere).
// Uso: node scripts/orari-cambio-periodo.mjs scripts/orari-2026-10-01.json   (OGGI=YYYY-MM-DD per provarlo)
import fs from 'node:fs';

const CONFIG = process.argv[2];
if (!CONFIG) { console.error('Manca il file di configurazione.'); process.exit(1); }
const cfg = JSON.parse(fs.readFileSync(CONFIG, 'utf8'));
const oggi = process.env.OGGI || new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome' }).format(new Date());

function addGiorni(iso, d) { const x = new Date(iso + 'T00:00:00Z'); x.setUTCDate(x.getUTCDate() + d); return x.toISOString().slice(0, 10); }
if (oggi < cfg.valido_dal) { console.log(`Oggi ${oggi}: il cambio è dal ${cfg.valido_dal}, niente da fare.`); process.exit(0); }
if (oggi > addGiorni(cfg.valido_dal, 7)) { console.log(`Oggi ${oggi}: finestra del cambio ${cfg.valido_dal} scaduta, niente da fare.`); process.exit(0); }

// ---- stessa logica di menu-admin.html (helper _orari*) ----
const DAY_KEYS = ['1', '2', '3', '4', '5', '6', '0'];
const EN_DAY = { 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday', 0: 'Sunday' };
const IT_DAY = { 1: 'lunedì', 2: 'martedì', 3: 'mercoledì', 4: 'giovedì', 5: 'venerdì', 6: 'sabato', 0: 'domenica' };
const IT_FEMM = { 0: true };
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function periodoCorrente(periods, today) {
  const sorted = periods.slice().sort((a, b) => (a.from < b.from ? -1 : a.from > b.from ? 1 : 0));
  let cur = sorted[sorted.length - 1];
  for (let i = sorted.length - 1; i >= 0; i--) {
    const p = sorted[i];
    if (today >= p.from && (p.to == null || today <= p.to)) { cur = p; break; }
  }
  return cur;
}
const giorniAttivi = (p, svc) => DAY_KEYS.filter((k) => ((p.day_services || {})[k] || []).includes(svc));
function specsJsonLd(p) {
  const out = [];
  for (const svc of ['pranzo', 'cena']) {
    const o = p[svc + '_opens'], c = p[svc + '_closes'], d = giorniAttivi(p, svc);
    if (o && c && d.length) out.push({ dayOfWeek: d.map((k) => EN_DAY[k]), opens: o, closes: c });
  }
  return out;
}
function runs(days) {
  const r = []; let i = 0;
  while (i < days.length) {
    let j = i;
    while (j + 1 < days.length && DAY_KEYS.indexOf(days[j + 1]) === DAY_KEYS.indexOf(days[j]) + 1) j++;
    r.push(days.slice(i, j + 1)); i = j + 1;
  }
  return r;
}
function frase(run) {
  if (run.length === 1) return cap(IT_DAY[run[0]]);
  if (run.length === 2) return cap(IT_DAY[run[0]]) + ' e ' + IT_DAY[run[1]];
  const last = run[run.length - 1];
  return 'Dal ' + IT_DAY[run[0]] + ' ' + (IT_FEMM[last] ? 'alla' : 'al') + ' ' + IT_DAY[last];
}
function orarioServizio(p) {
  const out = [];
  for (const svc of ['pranzo', 'cena']) {
    const o = p[svc + '_opens'], c = p[svc + '_closes'], d = giorniAttivi(p, svc);
    if (o && c && d.length) out.push({ giorno: runs(d).map(frase).join(' + '), fasce: [o + ' – ' + c] });
  }
  return out;
}
function blocco(content, marker) {
  const mi = content.indexOf(marker); if (mi === -1) return null;
  const oi = content.indexOf('[', mi); if (oi === -1) return null;
  let depth = 0;
  for (let i = oi; i < content.length; i++) {
    if (content[i] === '[') depth++;
    else if (content[i] === ']') { depth--; if (depth === 0) return { mi, oi, ci: i + 1 }; }
  }
  return null;
}
function indent(content, idx) { const s = content.lastIndexOf('\n', idx) + 1; return (content.slice(s, idx).match(/^[ \t]*/) || [''])[0]; }
function serJsonLd(b, specs) {
  return '[\n' + specs.map((s) => b + '  { "@type": "OpeningHoursSpecification", "dayOfWeek": [' + s.dayOfWeek.map((d) => '"' + d + '"').join(', ') + '], "opens": "' + s.opens + '", "closes": "' + s.closes + '" }').join(',\n') + '\n' + b + ']';
}
function serOrario(b, entries) {
  const b1 = b + '  ', b2 = b + '    ', b3 = b + '      ';
  return '[\n' + entries.map((e) => b1 + '{\n' + b2 + '"giorno": "' + e.giorno + '",\n' + b2 + '"fasce": [\n' + e.fasce.map((f) => b3 + '"' + f + '"').join(',\n') + '\n' + b2 + ']\n' + b1 + '}').join(',\n') + '\n' + b + ']';
}
function patch(content, marker, ser, dati, file) {
  const nl = content.includes('\r\n') ? '\r\n' : '\n';
  const t = content.replace(/\r\n/g, '\n');
  const bl = blocco(t, marker);
  if (!bl) throw new Error(`Blocco ${marker} non trovato in ${file}`);
  const out = t.slice(0, bl.oi) + ser(indent(t, bl.mi), dati) + t.slice(bl.ci);
  return nl === '\n' ? out : out.replace(/\n/g, '\r\n');
}
const testo = (html) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

// ---- periodo in vigore + controllo che sia quello atteso ----
const res = await fetch('https://xbksultfskvzgncncada.supabase.co/functions/v1/get-opening-hours', { cache: 'no-store' });
if (!res.ok) throw new Error('get-opening-hours HTTP ' + res.status);
const periods = (await res.json()).periods || [];
if (!periods.length) throw new Error('Nessun periodo da get-opening-hours');
const cur = periodoCorrente(periods, oggi);
const att = cfg.periodo_atteso;
const norm = (ds) => JSON.stringify(DAY_KEYS.map((k) => (ds[k] || []).slice().sort()));
const diversi = [];
if (cur.from !== cfg.valido_dal) diversi.push(`inizio periodo ${cur.from} invece di ${cfg.valido_dal}`);
if (norm(cur.day_services || {}) !== norm(att.day_services)) diversi.push('giorni/servizi diversi');
for (const k of ['pranzo_opens', 'pranzo_closes', 'cena_opens', 'cena_closes']) if (cur[k] !== att[k]) diversi.push(`${k} ${cur[k]} invece di ${att[k]}`);
if (diversi.length) {
  console.error('STOP: il periodo in vigore non è quello per cui è stata scritta la FAQ → ' + diversi.join('; ') + '. Nessun file modificato: pubblicare a mano da menu-admin → Orari di Apertura.');
  process.exit(1);
}

// ---- modifiche ai 7 file ----
const specs = specsJsonLd(cur), orario = orarioServizio(cur);
const leggi = (f) => fs.readFileSync(f, 'utf8');
const nuovi = {};

const tr = JSON.parse(leggi('translations.json'));
for (const l of ['it', 'en', 'fr']) tr[l].faq_a2 = cfg.faq[l];
nuovi['translations.json'] = JSON.stringify(tr, null, 2) + '\n';

let idx = leggi('index.html');
const faqDiv = /(<div class="faq-answer" data-i18n="faq_a2">)[\s\S]*?(<\/div>)/;
if (!faqDiv.test(idx)) throw new Error('FAQ visibile faq_a2 non trovata in index.html');
idx = idx.replace(faqDiv, (_m, a, b) => a + cfg.faq.it + b);
const ldRe = /(<script type="application\/ld\+json" id="faq-jsonld">)([\s\S]*?)(<\/script>)/;
const m = idx.match(ldRe);
if (!m) throw new Error('JSON-LD #faq-jsonld non trovato in index.html');
const ld = JSON.parse(m[2]);
const q = (ld.mainEntity || []).find((x) => x.name === 'Quali sono gli orari?');
if (!q) throw new Error('Domanda "Quali sono gli orari?" non trovata nel JSON-LD');
q.acceptedAnswer.text = testo(cfg.faq.it);
idx = idx.replace(ldRe, (_m, a, _x, b) => a + '\n' + JSON.stringify(ld, null, 2) + '\n' + b);
nuovi['index.html'] = patch(idx, '"openingHoursSpecification":', serJsonLd, specs, 'index.html');
nuovi['dove-siamo.html'] = patch(leggi('dove-siamo.html'), '"openingHoursSpecification":', serJsonLd, specs, 'dove-siamo.html');
for (const f of ['menu.html', 'menu-it.html', 'menu-en.html', 'menu-fr.html']) nuovi[f] = patch(leggi(f), '"orarioServizio":', serOrario, orario, f);

let cambiati = 0;
for (const [f, c] of Object.entries(nuovi)) {
  if (c !== leggi(f)) { fs.writeFileSync(f, c); cambiati++; console.log('aggiornato ' + f); }
}
console.log(cambiati ? `Fatto: ${cambiati} file aggiornati per il periodo dal ${cur.from}.` : 'Già allineato, niente da fare.');
