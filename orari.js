/* ═══════════════════════════════════════════════════════════════════════
   orari.js — FONTE UNICA orari di apertura · Santamonica Web
   v 2026.05.22.01
   ───────────────────────────────────────────────────────────────────────
   PER CAMBIARE GLI ORARI: modifica SOLO gli oggetti SERVIZI e SETTIMANA.
   Tutto il resto (display #info, tabella dove-siamo, Schema.org JSON-LD su
   index.html e dove-siamo.html) viene generato da qui → niente desync.

   Consumato da:
   - index.html      → riempie #orari-info (lingua corrente) + inietta JSON-LD
   - dove-siamo.html → riempie #orari-tbody (IT) + inietta JSON-LD + evidenzia oggi

   JSON-LD: iniettato nel blocco <script type="application/ld+json"> esistente
   (entità con @type *Restaurant). Lo script gira sincrono in <head> → Googlebot
   esegue il rendering JS e legge structured data iniettati. Le pagine NON
   contengono più openingHoursSpecification statico.
   ═══════════════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  // ════════════ FONTE UNICA — MODIFICA QUI ════════════
  var SERVIZI = {
    pranzo: { opens: '12:30', closes: '14:30' },
    cena:   { opens: '19:30', closes: '22:30' }
  };
  // Settimana lun→dom. services = servizi attivi quel giorno (vuoto = chiuso).
  var SETTIMANA = [
    { day: 'lun', services: [] },
    { day: 'mar', services: ['cena'] },
    { day: 'mer', services: ['pranzo', 'cena'] },
    { day: 'gio', services: ['pranzo', 'cena'] },
    { day: 'ven', services: ['pranzo', 'cena'] },
    { day: 'sab', services: ['pranzo', 'cena'] },
    { day: 'dom', services: ['pranzo'] }
  ];
  // ═════════════════════════════════════════════════════

  var L = {
    it: { lun: 'Luned\u00EC', mar: 'Marted\u00EC', mer: 'Mercoled\u00EC', gio: 'Gioved\u00EC', ven: 'Venerd\u00EC', sab: 'Sabato', dom: 'Domenica', chiuso: 'chiuso', chiusoLine: '%s chiuso' },
    en: { lun: 'Monday', mar: 'Tuesday', mer: 'Wednesday', gio: 'Thursday', ven: 'Friday', sab: 'Saturday', dom: 'Sunday', chiuso: 'closed', chiusoLine: 'Closed %s' },
    fr: { lun: 'Lundi', mar: 'Mardi', mer: 'Mercredi', gio: 'Jeudi', ven: 'Vendredi', sab: 'Samedi', dom: 'Dimanche', chiuso: 'ferm\u00E9', chiusoLine: 'Ferm\u00E9 %s' }
  };
  var EN_DAY = { lun: 'Monday', mar: 'Tuesday', mer: 'Wednesday', gio: 'Thursday', ven: 'Friday', sab: 'Saturday', dom: 'Sunday' };
  var NDASH = ' \u2013 ';

  function fmt(s) { return SERVIZI[s].opens + NDASH + SERVIZI[s].closes; }
  function sig(services) { return services.join('|'); }
  function labels(lang) { return L[lang] || L.it; }

  function buildJsonLd() {
    var spec = [];
    Object.keys(SERVIZI).forEach(function (s) {
      var days = SETTIMANA.filter(function (d) { return d.services.indexOf(s) !== -1; }).map(function (d) { return EN_DAY[d.day]; });
      if (days.length) spec.push({ '@type': 'OpeningHoursSpecification', dayOfWeek: days, opens: SERVIZI[s].opens, closes: SERVIZI[s].closes });
    });
    return spec;
  }

  function buildGroups(lang, sep) {
    var lab = labels(lang); sep = sep || ' / ';
    var aperti = [], chiusi = [], i = 0;
    while (i < SETTIMANA.length) {
      var d = SETTIMANA[i];
      if (d.services.length === 0) { chiusi.push(d.day); i++; continue; }
      var s = sig(d.services), j = i;
      while (j + 1 < SETTIMANA.length && SETTIMANA[j + 1].services.length && sig(SETTIMANA[j + 1].services) === s) j++;
      var label = (j > i) ? (lab[SETTIMANA[i].day] + NDASH + lab[SETTIMANA[j].day]) : lab[SETTIMANA[i].day];
      aperti.push({ label: label, times: SETTIMANA[i].services.map(fmt).join(sep) });
      i = j + 1;
    }
    return { aperti: aperti, chiusi: chiusi };
  }

  function buildTableRows(lang, sep) {
    var lab = labels(lang); sep = sep || ' / ';
    return SETTIMANA.map(function (d) {
      var closed = d.services.length === 0;
      return { day: d.day, name: lab[d.day], closed: closed, times: closed ? lab.chiuso : d.services.map(fmt).join(sep) };
    });
  }

  function injectJsonLd() {
    if (typeof document === 'undefined') return;
    var nodes = document.querySelectorAll('script[type="application/ld+json"]');
    for (var k = 0; k < nodes.length; k++) {
      var obj; try { obj = JSON.parse(nodes[k].textContent); } catch (e) { continue; }
      if (obj && String(obj['@type'] || '').indexOf('Restaurant') !== -1) {
        obj.openingHoursSpecification = buildJsonLd();
        nodes[k].textContent = JSON.stringify(obj, null, 2);
        return;
      }
    }
  }

  function renderInfo(lang) {
    if (typeof document === 'undefined') return;
    var box = document.getElementById('orari-info'); if (!box) return;
    var lab = labels(lang), g = buildGroups(lang, '\u00A0/\u00A0'), html = '';
    g.aperti.forEach(function (grp) {
      html += '<span>' + grp.label + '</span><br><strong style="color:var(--ink);font-weight:400">' + grp.times + '</strong><br><br>';
    });
    if (g.chiusi.length) {
      var names = g.chiusi.map(function (key) { return lab[key]; }).join(', ');
      html += '<em style="font-size:0.78rem">' + lab.chiusoLine.replace('%s', names) + '</em>';
    }
    box.innerHTML = html;
  }

  function renderTable(lang) {
    if (typeof document === 'undefined') return;
    var tb = document.getElementById('orari-tbody'); if (!tb) return;
    var rows = buildTableRows(lang || 'it', '\u00A0\u00B7\u00A0');
    var todayKey = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'][new Date().getDay()];
    tb.innerHTML = rows.map(function (r) {
      var cls = ((r.closed ? 'closed' : '') + (r.day === todayKey ? ' today' : '')).trim();
      return '<tr id="day-' + r.day + '"' + (cls ? ' class="' + cls + '"' : '') + '><td class="day">' + r.name + '</td><td class="time">' + r.times + '</td></tr>';
    }).join('');
  }

  global.renderOrari = function (lang) { renderInfo(lang); renderTable(lang); };

  injectJsonLd();
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { renderInfo('it'); renderTable('it'); });
    else { renderInfo('it'); renderTable('it'); }
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { buildJsonLd: buildJsonLd, buildGroups: buildGroups, buildTableRows: buildTableRows };
  }
})(typeof window !== 'undefined' ? window : this);
