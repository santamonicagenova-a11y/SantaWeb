/* ═══════════════════════════════════════════════════════════════════════
   orari.js — FONTE UNICA orari di apertura · Santamonica Web
   v 2026.06.11.01
   ───────────────────────────────────────────────────────────────────────
   PER CAMBIARE GLI ORARI: modifica SOLO gli oggetti SERVIZI e SETTIMANA.
   Tutto il resto (display #info, tabella dove-siamo, Schema.org JSON-LD su
   index.html e dove-siamo.html) viene generato da qui → niente desync.

   Consumato da:
   - index.html      → riempie #orari-info (lingua corrente) + inietta JSON-LD
   - dove-siamo.html → riempie #orari-tbody (IT) + inietta JSON-LD + evidenzia oggi

   JSON-LD: iniettato nel blocco <script type="application/ld+json"> esistente
   (entità con @type *Restaurant). Lo script gira sincrono in <head> → Googlebot
   esegue il rendering JS e legge structured data iniettati.
   ⚠️ v 2026.06.11.01: le pagine CONTENGONO di nuovo un openingHoursSpecification
   STATICO (crawler-safe), perché i motori IA (Perplexity/Gemini/Grok) NON
   eseguono JS e vedevano orari vuoti → riportavano orari stantii (GEO giro 2,
   11/6). orari.js lo RI-INIETTA identico a runtime, quindi resta fonte unica per
   i client JS. PER CAMBIARE GLI ORARI: aggiorna SETTIMANA/SERVIZI QUI **e** il
   blocco statico openingHoursSpecification in index.html + dove-siamo.html.
   ═══════════════════════════════════════════════════════════════════════

   STORICO
   - v 2026.06.11.01 (GEO giro 2): re-introdotto openingHoursSpecification
     STATICO crawler-safe in index.html + dove-siamo.html (i crawler IA non
     eseguono JS). Nessun cambio di codice qui: solo commento + nota desync.
   - v 2026.06.05.01 (nuovi orari dal 7 giugno 2026): mer e gio passano a
     SOLA CENA (prima pranzo+cena); dom passa a PRANZO+CENA (prima solo pranzo).
     Invariati: lun chiuso, mar solo cena, ven/sab pranzo+cena. Aggiorna in
     automatico #orari-info, tabella dove-siamo, Schema.org e le tendine del
     form (getServicesByDay). Speculare lato server: VALID_SLOTS in
     submit-reservation (Edge Function SafeTable).
   - v 2026.05.27.05 (sessione SYNC archivio↔live · sessione 5 del 27/5):
       · [recovered from live] Sostituito l'archivio con la versione live
         del repo santamonicagenova-a11y/SantaWeb (branch main). L'archivio
         era fermo a v 2026.05.22.01 SENZA la export `getServicesByDay`
         aggiunta direttamente sul live nei 8 commit del 26/5 sessione 1
         (form prenotazioni esteso). Drift unidirezionale (live → archivio)
         risolto sovrascrivendo archivio col contenuto raw del live.
       · [aggiunta runtime] global.getServicesByDay(jsDayIndex): ritorna
         l'array dei servizi attivi per il giorno (es. ['pranzo','cena']),
         consumato da updateOrarioSlots() in index.html per filtrare gli
         optgroup dello <select id="p-orario"> alla scelta della data.
   - v 2026.05.22.01 (F0.21 — refactor orari FONTE UNICA): SERVIZI e SETTIMANA
         introdotte come unica fonte, generano #orari-info + tabella + JSON-LD.
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
    { day: 'mer', services: ['cena'] },
    { day: 'gio', services: ['cena'] },
    { day: 'ven', services: ['pranzo', 'cena'] },
    { day: 'sab', services: ['pranzo', 'cena'] },
    { day: 'dom', services: ['pranzo', 'cena'] }
  ];
  // ═════════════════════════════════════════════════════

  var L = {
    it: { lun: 'Lunedì', mar: 'Martedì', mer: 'Mercoledì', gio: 'Giovedì', ven: 'Venerdì', sab: 'Sabato', dom: 'Domenica', chiuso: 'chiuso', chiusoLine: '%s chiuso' },
    en: { lun: 'Monday', mar: 'Tuesday', mer: 'Wednesday', gio: 'Thursday', ven: 'Friday', sab: 'Saturday', dom: 'Sunday', chiuso: 'closed', chiusoLine: 'Closed %s' },
    fr: { lun: 'Lundi', mar: 'Mardi', mer: 'Mercredi', gio: 'Jeudi', ven: 'Vendredi', sab: 'Samedi', dom: 'Dimanche', chiuso: 'fermé', chiusoLine: 'Fermé %s' }
  };
  var EN_DAY = { lun: 'Monday', mar: 'Tuesday', mer: 'Wednesday', gio: 'Thursday', ven: 'Friday', sab: 'Saturday', dom: 'Sunday' };
  var NDASH = ' – ';

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
    var lab = labels(lang), g = buildGroups(lang, ' / '), html = '';
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
    var rows = buildTableRows(lang || 'it', ' · ');
    var todayKey = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'][new Date().getDay()];
    tb.innerHTML = rows.map(function (r) {
      var cls = ((r.closed ? 'closed' : '') + (r.day === todayKey ? ' today' : '')).trim();
      return '<tr id="day-' + r.day + '"' + (cls ? ' class="' + cls + '"' : '') + '><td class="day">' + r.name + '</td><td class="time">' + r.times + '</td></tr>';
    }).join('');
  }

  global.renderOrari = function (lang) { renderInfo(lang); renderTable(lang); };

  global.getServicesByDay = function (jsDayIndex) {
    var dayMap = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'];
    var key = dayMap[jsDayIndex];
    var day = SETTIMANA.find(function (d) { return d.day === key; });
    return day ? day.services.slice() : [];
  };

  injectJsonLd();
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { renderInfo('it'); renderTable('it'); });
    else { renderInfo('it'); renderTable('it'); }
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { buildJsonLd: buildJsonLd, buildGroups: buildGroups, buildTableRows: buildTableRows };
  }
})(typeof window !== 'undefined' ? window : this);
