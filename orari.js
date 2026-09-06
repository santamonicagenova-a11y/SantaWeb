/* ═══════════════════════════════════════════════════════════════════════
   orari.js — FONTE UNICA orari di apertura · Santamonica Web
   v 2026.09.06.01
   ───────────────────────────────────────────────────────────────────────
   v 2026.09.06.01 — ECCEZIONE_TEMP: nota temporanea in renderInfo() per i due
   venerdì di riapertura pranzo (11/9 e 18/9) rimasti chiusi tutto il giorno
   (Andrea, decisione post-riapertura). Il bug segnalato: quella card mostra
   SOLO lo schema RICORRENTE letto da PERIODS, non ha modo di rappresentare
   un'eccezione su una data singola — la FAQ orari (aggiornata separatamente
   in index.html/translations.json lo stesso giorno) l'aveva già, questa card
   no. Nota autolimitata per data (from/to), sparisce da sola dopo il 18/9 —
   se in futuro serve un'eccezione diversa, editare l'oggetto ECCEZIONE_TEMP.
   v 2026.09.04.02 — renderInfo() aggiunge una nota "Dal [data]: ..." quando
   PERIODS ha già un periodo successivo definito (prossimo cambio orario
   stagionale deciso in anticipo, es. 11 settembre): generata da PERIODS via
   buildGroups(), stessa fonte dati, nessuna data hardcoded — sparisce/si
   aggiorna da sola quando PERIODS cambia. Aggiunte MONTHS (nomi mese IT/EN/
   FR) e dalLine (IT/EN/FR) a supporto.
   v 2026.09.04.01 — restyling #info (card scure): renderInfo() ora genera
   righe <div class="orari-row"> (giorni aperti + giorni chiusi, uno per
   riga) invece di testo continuo con <br>, per lo stile a riquadri della
   nuova card Orari in index.html. Dati e logica invariati (buildGroups
   resta l'unica fonte); cambia solo il markup HTML prodotto. renderTable()
   (tabella dove-siamo.html) non toccata.
   ───────────────────────────────────────────────────────────────────────
   PER CAMBIARE GLI ORARI: aggiungi/modifica una voce nell'array PERIODS.
   Tutto il resto (display #info, tabella dove-siamo, Schema.org JSON-LD su
   index.html e dove-siamo.html, disponibilità del wizard /prenota.html)
   viene generato da qui → niente desync.

   PERCHÉ "PERIODS" E NON UN UNICO ORARIO CORRENTE (refactor 25/7/2026):
   fino a v 2026.06.21.01 c'era un solo SERVIZI/SETTIMANA "attivo", cambiato
   a mano a ogni transizione stagionale. Bug scoperto il 25/7/2026: un
   cliente che prenotava OGGI (in piena estate) un pranzo di settembre si
   vedeva rifiutare la richiesta, perché il sistema applicava l'orario
   estivo (pranzo chiuso) anche alle date future che invece dovevano seguire
   il prossimo orario già deciso. PERIODS risolve il problema: ogni periodo
   ha una data di inizio (`from`) e fine (`to`, o null = nessuna fine
   pianificata) — le prenotazioni su una data futura usano SEMPRE il
   periodo che copre quella data, non quello di oggi. Il display del sito
   (home #orari-info, tabella dove-siamo, JSON-LD iniettato a runtime)
   continua a mostrare il periodo che copre la data ODIERNA, invariato.

   Consumato da:
   - index.html      → riempie #orari-info (lingua corrente) + inietta JSON-LD (periodo di oggi)
   - dove-siamo.html → riempie #orari-tbody (IT) + inietta JSON-LD + evidenzia oggi (periodo di oggi)
   - prenota.html    → getServicesForDate(dateStr) + getPeriodSlots(dateStr) (periodo della DATA
                        scelta dal cliente, che può essere futura e ricadere in un periodo diverso)

   JSON-LD: iniettato nel blocco <script type="application/ld+json"> esistente
   (entità con @type *Restaurant). Lo script gira sincrono in <head> → Googlebot
   esegue il rendering JS e legge structured data iniettati.
   ⚠️ v 2026.06.11.01: le pagine CONTENGONO ANCHE un openingHoursSpecification
   STATICO (crawler-safe), perché i motori IA (Perplexity/Gemini/Grok) NON
   eseguono JS e vedevano orari vuoti → riportavano orari stantii (GEO giro 2,
   11/6). orari.js lo RI-INIETTA (per il periodo di OGGI) a runtime, quindi
   resta fonte unica per i client JS, ma il blocco statico nell'HTML va
   comunque aggiornato a mano quando cambia il periodo corrente (stesso
   lavoro che facevano già le sessioni "cambio orari" precedenti — PERIODS
   NON elimina questo compito, elimina solo il rischio di rifiutare
   prenotazioni future corrette).
   ═══════════════════════════════════════════════════════════════════════

   STORICO
   - v 2026.08.31.01 (spostamento pranzo ven/sab/dom): Andrea conferma l'11/9 come data di
     partenza, non l'1/9 come inizialmente deciso il 25/7. Periodo 1 esteso a to:'2026-09-10',
     Periodo 2 accorciato in testa a from:'2026-09-11'. Cena confermata 19:30 dall'11/9
     (invariato rispetto al 25/7). STESSA modifica in submit-reservation e
     create-reservation-checkout (SPECULARE, vedi loro STORICO). Periodo 3 confermato invariato.
   - v 2026.07.25.01 (refactor PERIODS, vedi sopra): sostituiti SERVIZI/SETTIMANA
     con l'array PERIODS. Definiti i 3 periodi già decisi da Andrea il 25/7/2026:
       1) 21/6→31/8/2026: orario estivo (pranzo chiuso, cena 20:00-22:30 mar→dom)
       2) 1/9→30/9/2026: ripristino schema 7/6 (pranzo ven/sab/dom, cena 19:30-22:30)
       3) 1/10/2026→(nessuna fine pianificata): come sopra ma domenica SOLO pranzo
          (cena chiusa — decisione esplicita di Andrea, resta valida finché non la
          cambia lui, nessun auto-ripristino a gennaio).
     Nuove funzioni pubbliche: getServicesForDate(dateStr), getPeriodSlots(dateStr).
     Rimossa la vecchia getServicesByDay(jsDayIndex) (day-index puro, period-blind):
     unico consumer era prenota.html, aggiornato per usare getServicesForDate.
     SPECULARE lato server: stesso array PERIODS in submit-reservation e
     create-reservation-checkout (Edge Function SafeTable).
   - v 2026.06.21.01 (ORARIO ESTIVO TEMPORANEO · 21 giu → 31 ago 2026):
     chiusura a PRANZO tutti i giorni; CENA solo dalle 20:00 (prima 19:30) alle
     22:30, da MARTEDÌ a DOMENICA (lun resta chiuso).
   - v 2026.06.11.01 (GEO giro 2): re-introdotto openingHoursSpecification
     STATICO crawler-safe in index.html + dove-siamo.html (i crawler IA non
     eseguono JS). Nessun cambio di codice qui: solo commento + nota desync.
   - v 2026.06.05.01 (nuovi orari dal 7 giugno 2026): mer e gio passano a
     SOLA CENA (prima pranzo+cena); dom passa a PRANZO+CENA (prima solo pranzo).
   - v 2026.05.27.05 (sessione SYNC archivio↔live · sessione 5 del 27/5):
       · [aggiunta runtime] global.getServicesByDay(jsDayIndex) — SOSTITUITA
         il 25/7/2026 da getServicesForDate(dateStr), vedi sopra.
   - v 2026.05.22.01 (F0.21 — refactor orari FONTE UNICA): SERVIZI e SETTIMANA
         introdotte come unica fonte, generano #orari-info + tabella + JSON-LD.
   ═══════════════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  // ════════════ FONTE UNICA — MODIFICA QUI ════════════
  // Ogni periodo: from/to (YYYY-MM-DD, to=null → nessuna fine pianificata),
  // servizi (opens/closes per pranzo/cena, per il display "12:30 – 14:30"),
  // slots (elenco discreto degli orari prenotabili per servizio, usato dal
  // wizard), settimana (giorno → servizi attivi quel giorno in QUESTO periodo).
  var PRANZO_BASE = ['12:30', '13:00', '13:30', '14:00'];
  var CENA_BASE = ['19:30', '20:00', '20:30', '21:00', '21:30', '22:00'];
  var CENA_ESTATE = ['20:00', '20:30', '21:00', '21:30', '22:00', '22:30'];

  var PERIODS = [
    { // Orario estivo temporaneo
      from: '2026-06-21', to: '2026-09-10',
      servizi: { pranzo: { opens: '12:30', closes: '14:30' }, cena: { opens: '20:00', closes: '22:30' } },
      slots: { pranzo: [], cena: CENA_ESTATE },
      settimana: [
        { day: 'lun', services: [] },
        { day: 'mar', services: ['cena'] },
        { day: 'mer', services: ['cena'] },
        { day: 'gio', services: ['cena'] },
        { day: 'ven', services: ['cena'] },
        { day: 'sab', services: ['cena'] },
        { day: 'dom', services: ['cena'] }
      ]
    },
    { // Ripristino schema 7/6: riapre il pranzo di ven/sab/dom, cena torna alle 19:30
      from: '2026-09-11', to: '2026-09-30',
      servizi: { pranzo: { opens: '12:30', closes: '14:30' }, cena: { opens: '19:30', closes: '22:30' } },
      slots: { pranzo: PRANZO_BASE, cena: CENA_BASE },
      settimana: [
        { day: 'lun', services: [] },
        { day: 'mar', services: ['cena'] },
        { day: 'mer', services: ['cena'] },
        { day: 'gio', services: ['cena'] },
        { day: 'ven', services: ['pranzo', 'cena'] },
        { day: 'sab', services: ['pranzo', 'cena'] },
        { day: 'dom', services: ['pranzo', 'cena'] }
      ]
    },
    { // Chiusura cena domenica, senza data di fine pianificata (decisione Andrea 25/7/2026)
      from: '2026-10-01', to: null,
      servizi: { pranzo: { opens: '12:30', closes: '14:30' }, cena: { opens: '19:30', closes: '22:30' } },
      slots: { pranzo: PRANZO_BASE, cena: CENA_BASE },
      settimana: [
        { day: 'lun', services: [] },
        { day: 'mar', services: ['cena'] },
        { day: 'mer', services: ['cena'] },
        { day: 'gio', services: ['cena'] },
        { day: 'ven', services: ['pranzo', 'cena'] },
        { day: 'sab', services: ['pranzo', 'cena'] },
        { day: 'dom', services: ['pranzo'] }
      ]
    }
  ];
  // ═════════════════════════════════════════════════════

  function todayStr() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  // Ritorna il periodo che copre dateStr (YYYY-MM-DD). I periodi sono contigui e non si
  // sovrappongono per costruzione; in caso di buco (data prima del primo `from`) o di errore,
  // fallback prudente sull'ultimo periodo definito.
  function resolvePeriod(dateStr) {
    for (var i = PERIODS.length - 1; i >= 0; i--) {
      var p = PERIODS[i];
      if (dateStr >= p.from && (p.to === null || dateStr <= p.to)) return p;
    }
    return PERIODS[PERIODS.length - 1];
  }

  var L = {
    it: { lun: 'Lunedì', mar: 'Martedì', mer: 'Mercoledì', gio: 'Giovedì', ven: 'Venerdì', sab: 'Sabato', dom: 'Domenica', chiuso: 'chiuso', chiusoLine: '%s chiuso', dalLine: 'Dal %s:' },
    en: { lun: 'Monday', mar: 'Tuesday', mer: 'Wednesday', gio: 'Thursday', ven: 'Friday', sab: 'Saturday', dom: 'Sunday', chiuso: 'closed', chiusoLine: 'Closed %s', dalLine: 'From %s:' },
    fr: { lun: 'Lundi', mar: 'Mardi', mer: 'Mercredi', gio: 'Jeudi', ven: 'Vendredi', sab: 'Samedi', dom: 'Dimanche', chiuso: 'fermé', chiusoLine: 'Fermé %s', dalLine: 'À partir du %s :' }
  };
  // Eccezione temporanea (Andrea, 6/9/2026): i primi due venerdì di riapertura pranzo (11/9 e
  // 18/9) restano chiusi TUTTO IL GIORNO — un'eccezione puntuale che PERIODS non può
  // rappresentare (descrive lo schema RICORRENTE, non le date singole) e che il client statico
  // non legge da reservation_closures (quella tabella la interroga solo il motore di
  // prenotazione). Nota autolimitata per data: appare solo nella finestra `from`-`to`, sparisce
  // da sola dopo — rimuovere questo blocco a mano se non serve più tenerlo.
  var ECCEZIONE_TEMP = {
    from: '2026-09-01', to: '2026-09-18',
    it: 'Eccezione: chiuso tutto il giorno venerdì 11 e venerdì 18 settembre.',
    en: 'Exception: closed all day on Friday 11 and Friday 18 September.',
    fr: 'Exception : fermé toute la journée les vendredis 11 et 18 septembre.'
  };
  var MONTHS = {
    it: ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    fr: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
  };
  var EN_DAY = { lun: 'Monday', mar: 'Tuesday', mer: 'Wednesday', gio: 'Thursday', ven: 'Friday', sab: 'Saturday', dom: 'Sunday' };
  var NDASH = ' – ';

  function fmt(servizi, s) { return servizi[s].opens + NDASH + servizi[s].closes; }
  function sig(services) { return services.join('|'); }
  function labels(lang) { return L[lang] || L.it; }
  function formatDayMonth(dateStr, lang) {
    var p = dateStr.split('-'), months = MONTHS[lang] || MONTHS.it;
    return parseInt(p[2], 10) + ' ' + months[parseInt(p[1], 10) - 1];
  }

  function buildJsonLd(period) {
    period = period || resolvePeriod(todayStr());
    var spec = [];
    Object.keys(period.servizi).forEach(function (s) {
      var days = period.settimana.filter(function (d) { return d.services.indexOf(s) !== -1; }).map(function (d) { return EN_DAY[d.day]; });
      if (days.length) spec.push({ '@type': 'OpeningHoursSpecification', dayOfWeek: days, opens: period.servizi[s].opens, closes: period.servizi[s].closes });
    });
    return spec;
  }

  function buildGroups(lang, sep, period) {
    period = period || resolvePeriod(todayStr());
    var lab = labels(lang); sep = sep || ' / ';
    var settimana = period.settimana;
    var aperti = [], chiusi = [], i = 0;
    while (i < settimana.length) {
      var d = settimana[i];
      if (d.services.length === 0) { chiusi.push(d.day); i++; continue; }
      var s = sig(d.services), j = i;
      while (j + 1 < settimana.length && settimana[j + 1].services.length && sig(settimana[j + 1].services) === s) j++;
      var label = (j > i) ? (lab[settimana[i].day] + NDASH + lab[settimana[j].day]) : lab[settimana[i].day];
      aperti.push({ label: label, times: settimana[i].services.map(function (sv) { return fmt(period.servizi, sv); }).join(sep) });
      i = j + 1;
    }
    return { aperti: aperti, chiusi: chiusi };
  }

  function buildTableRows(lang, sep, period) {
    period = period || resolvePeriod(todayStr());
    var lab = labels(lang); sep = sep || ' / ';
    return period.settimana.map(function (d) {
      var closed = d.services.length === 0;
      return { day: d.day, name: lab[d.day], closed: closed, times: closed ? lab.chiuso : d.services.map(function (sv) { return fmt(period.servizi, sv); }).join(sep) };
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
    var lab = labels(lang), period = resolvePeriod(todayStr()), g = buildGroups(lang, ' / ', period), html = '';
    g.aperti.forEach(function (grp) {
      html += '<div class="orari-row"><span class="g">' + grp.label + '</span><strong>' + grp.times + '</strong></div>';
    });
    g.chiusi.forEach(function (key) {
      var chiusoCap = lab.chiuso.charAt(0).toUpperCase() + lab.chiuso.slice(1);
      html += '<div class="orari-row"><span class="g">' + lab[key] + '</span><strong>' + chiusoCap + '</strong></div>';
    });
    // Se è già definito il periodo successivo (prossimo cambio orario stagionale
    // già deciso), avvisa in anticipo — stessa fonte dati (PERIODS), niente data
    // hardcoded: la nota sparisce/si aggiorna da sola quando PERIODS cambia.
    var idx = PERIODS.indexOf(period), next = PERIODS[idx + 1];
    if (next) {
      var ng = buildGroups(lang, ' / ', next), parts = ng.aperti.map(function (grp) { return grp.label + ' ' + grp.times; });
      if (ng.chiusi.length) parts.push(lab.chiusoLine.replace('%s', ng.chiusi.map(function (k) { return lab[k]; }).join(', ')));
      html += '<p class="orari-note">' + lab.dalLine.replace('%s', formatDayMonth(next.from, lang)) + ' ' + parts.join(' · ') + '.</p>';
    }
    var today = todayStr();
    if (today >= ECCEZIONE_TEMP.from && today <= ECCEZIONE_TEMP.to) {
      html += '<p class="orari-note">' + (ECCEZIONE_TEMP[lang] || ECCEZIONE_TEMP.it) + '</p>';
    }
    box.innerHTML = html;
  }

  function renderTable(lang) {
    if (typeof document === 'undefined') return;
    var tb = document.getElementById('orari-tbody'); if (!tb) return;
    var rows = buildTableRows(lang || 'it', ' · ');
    var todayKey = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'][new Date().getDay()];
    tb.innerHTML = rows.map(function (r) {
      var cls = ((r.closed ? 'closed' : '') + (r.day === todayKey ? ' today' : '')).trim();
      return '<tr id="day-' + r.day + '"' + (cls ? ' class="' + cls + '"' : '') + '><td class="day">' + r.name + '</td><td class="time">' + r.times + '</td></tr>';
    }).join('');
  }

  global.renderOrari = function (lang) { renderInfo(lang); renderTable(lang); };

  // Servizi attivi (['pranzo','cena'], solo uno, o []) per la DATA indicata — usa il periodo
  // che copre quella data, non quello di oggi. Consumato da prenota.html per decidere quali
  // servizi proporre su una data futura, anche se ricade in un periodo diverso da quello
  // attualmente in corso (es. un pranzo di settembre prenotabile già oggi, in piena estate).
  global.getServicesForDate = function (dateStr) {
    var period = resolvePeriod(dateStr);
    var jsDay = new Date(dateStr + 'T00:00:00').getDay();
    var dayMap = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'];
    var key = dayMap[jsDay];
    var day = period.settimana.find(function (d) { return d.day === key; });
    return day ? day.services.slice() : [];
  };

  // Orari discreti (slot) di pranzo/cena per la DATA indicata, secondo il periodo che la
  // copre. Consumato da prenota.html per costruire la tendina orario del wizard.
  global.getPeriodSlots = function (dateStr) {
    var period = resolvePeriod(dateStr);
    return { pranzo: period.slots.pranzo.slice(), cena: period.slots.cena.slice() };
  };

  injectJsonLd();
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { renderInfo('it'); renderTable('it'); });
    else { renderInfo('it'); renderTable('it'); }
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { buildJsonLd: buildJsonLd, buildGroups: buildGroups, buildTableRows: buildTableRows, resolvePeriod: resolvePeriod, PERIODS: PERIODS };
  }
})(typeof window !== 'undefined' ? window : this);
