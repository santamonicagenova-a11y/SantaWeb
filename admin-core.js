// Core functions per menu-admin Santamonica
// v 2026.07.04.01 — Aggiunta 'reminder-section' a _pulisciViste() (nuovo pannello "Reminder prenotazioni" in menu-admin.html: setup messaggio+tempistiche del promemoria automatico ai clienti + lista prenotazioni da confermare/confermate). Nessun'altra modifica a questo file: la logica del pannello è tutta inline in menu-admin.html, come il pannello "Prenotazioni online".
// v 2026.06.14.01 — Carta: pulsante "+ Aggiungi piatto" in fondo a OGNI sezione (costruisci()) → funzione aggiungiPiatto(si) che cattura il form (leggi(true)), accoda un piatto vuoto a dati.sezioni[si].piatti, ri-renderizza e mette il focus sul nuovo nome. leggi() ora accetta un flag keepEmpty: di default scarta i piatti senza nome (le righe vuote aggiunte e non valorizzate NON finiscono nel menu pubblicato/IT/EN/FR/allergeni, tutti passano da leggi()); aggiungiPiatto usa leggi(true) per non perdere le righe vuote durante l'editing.
// v 2026.06.10.13 — Pannello "Buoni regalo": 3 campi per i valori dei buoni liberi → pubblica voucher-config.json su GitHub (riusa pubblicaFile + flusso token). Funzioni caricaVoucherBuoni / pubblicaVoucherBuoni / _pubblicaVoucherConfig + hook _pendingVoucherPublish in confermaPubblica. regala.html v2026.06.10.04 legge questi valori a runtime.
// v 2026.06.10.12 — Documento generico, "Scarica HTML": il file salvato ora NON contiene più la toolbar (pulsanti Stampa/Scarica/allineamento/dimensione) né gli script di controllo — si clona il DOM, si rimuovono .doc-toolbar e tutti gli <script>, restano documento + stile + stato corrente (classi/inline). Come il file pubblico dei dolci.
// v 2026.06.10.11 — Dolci allineato alla carta: filesDolci() pubblica DUE file → menu-dolci.html (pubblico, senza barra) + menu-dolci-it.html (admin/preview, con barra Stampa + pulsanti dimensione, noindex). La preview dolci (apriPreview) usa _dolciCtrlBar() (stessa barra). Così la preview dolci ha i pulsanti come la carta.
// v 2026.06.10.10 — Impostazioni stampa carta/dolci spostate da CURSORI (admin) a PULSANTI nella barra della PREVIEW (come il documento generico). Rimosso il pannello cursori da costruisci(). Nuova costante _SIZE_BTNS (A+/A−, interlinea, spazio, sposta su/giù, reset) aggiunta alla CTRL_BAR della carta; per i dolci (senza barra nel file) la barra è iniettata SOLO nella preview da apriPreview (non finisce nel file pubblicato). Le funzioni live _sz* stanno in CARTA_TPL_A e menu-dolci.html. Aggiornata la regex di strip della ctrl-bar in costruisciMenuItPub (ora taglia l'intera barra fino a <div id="layout-carta">, non più "fino a Stampa").
// v 2026.06.10.09 — Carta vini RIFATTA: niente più estrazione testo (output "orrendo"). Ogni pagina del PDF è renderizzata via PDF.js a immagine ad alta risoluzione (scale 2.2, JPEG 0.92) e impaginata 1:1 su A4 (copertina inclusa) → riproduzione fedele del PDF. Nuova _generaHtmlViniImmagini; _leggiEConvertiVini ora rende immagini. Rimosso il pannello cursori vini (irrilevante sulle immagini). _VINI_TPL/_generaHtmlVini (testo) restano nel file ma non più usati.
// v 2026.06.10.08 — Carta vini: aggiunto text-align-last:justify su .vino (anche le righe singole/ultima riga distese su entrambi i margini).
// v 2026.06.10.07 — (1) FIX pulizia pagina: helper _pulisciViste() (nasconde tutte le sezioni + svuota #wrap) chiamato a OGNI caricamento (carta/dolci/allergeni/vini/foto/foto-sito/doc generico/prenotazioni) → non resta più la vista precedente in fondo. (2) MENU VINI: font/interlinea/spazio della carta vini ora calc(var(--fs/--lh/--gap)) + fix stampa @page 8mm; pannello a 3 cursori + reset in vini-section (_viniMontaPannello), valori iniettati in <body> via _viniStyleAttr (default 1/1/1 = attuale); .version (footer) escluso. (3) DOCUMENTO GENERICO: .doc-corpo font/interlinea/spazio in calc(var) + fix stampa @page 8mm; nella toolbar del preview aggiunti A+/A−, interlinea, spazio, reset (_docVar/_docResetVars); la posizione verticale è il bottone "Centro V" già esistente.
// v 2026.06.10.06 — Aggiunto pulsante "↺ Ripristina valori predefiniti" nel pannello stampa: riporta i 4 cursori ai default (fontScale 1.12, lineScale 1, gapScale 1, shift 0) e aggiorna dati. Vale per carta e dolci (stesso costruisci()).
// v 2026.06.10.05 — Pannello "Impostazioni stampa menù" con 4 cursori (helper slider()): Dimensione caratteri (fontScale), Interlinea (lineScale), Spazio tra i piatti (gapScale), Posizione sul foglio (shift, in mm). Scrivono dati.<prop>, round-trippano via leggi() e su EN/FR, letti da renderCarta (carta + dolci). Default neutri tranne fontScale 1.12.
// v 2026.06.10.04 — Cursore "Dimensione caratteri" ora attivo ANCHE sul menu dolci (rimosso il guard tipoMenuCorrente!=='carta'). Funziona perché menu-dolci.html v.04 ha lo stesso meccanismo --fs (calc + renderCarta). Testo di aiuto generalizzato (carta o dolci).
// v 2026.06.10.03 — Cursore "Dimensione caratteri menù (stampa)" in cima al form della carta (costruisci()): range 90%–135%, default 112%, scrive dati.fontScale (round-trippa nel JSON pubblicato via leggi() → letto da renderCarta in admin-templates-shared.js v.04 che imposta var(--fs)). Regola solo i font leggibili della carta; "Note per l'ospite" esclusa. Va usato poi con Anteprima/Pubblica.
// v 2026.06.10.02 — SEO meta description (durevole, template): _VINI_TPL ora include <title> "Carta dei Vini | Ristorante Santamonica Genova" + <meta name="description"> (carta vini); iniettaSeoLingua estesa con dizionario SEO_LL (title+description per en/fr, override del title dopo t.title — gira al passo 678 dopo il replace 663, quindi vince). Allinea i template alla patch live dei 4 file menu-*.html (gate completo P1+P2 + P3 3 vendor + sign-off Andrea 10/6). Le future pubblicazioni escono già con title+description corretti.
// v 2026.06.10.01 — Mobile lista vini: aggiunta media query @media (max-width:640px) nel <style> di _VINI_TPL. Le pagine generate (menu-vini.html) erano disegnate come foglio A4 (.pg{width:210mm}) senza CSS responsive → su telefono sbordavano oltre lo schermo (testo tagliato a destra). La media query sgancia la larghezza A4 (.pg width:auto/max-width:100%, padding ridotto, no box-shadow), scala logo/titoli e mette overflow-x:hidden. Tutte le regole sono !important (stanno prima di .pg base nel cascade). Print invariato. Il fix vale per le NUOVE pubblicazioni; i file già online vanno patchati a parte o ripubblicati.
// v 2026.06.05.03 — Pagina orario (versione 1 pagina): blocco QR ridotto da 4 a 2 lingue. Aggiornata la regex di sostituzione link EN/FR (riga ~674) per matchare 2 righe invece di 4 (rimossi Deutsch/Espanol, coerente con F0.4). Allineato a admin-templates-shared.js e menu-it.html.
// v 2026.06.05.02 — Guard anti-crash in eseguiPubblicazione: se dati===null (menu non caricato, es. publish via modale-token dopo un refresh) avvisa "Prima carica il menu" invece di crashare su "dati.degustazione" (TypeError null).
// v 2026.06.05.01 — Fix CSP (2 parti): (a) BASE_FETCH_URL da assoluto (santamonica-web.pages.dev) a relativo (''): fetch same-origin, coperto da connect-src 'self', niente cross-origin/CORS — l'URL assoluto F0.6bis non serve piu (admin e menu sullo stesso deploy CF). (b) Rimosso Function()/eval (4 siti: MENU x2, ALLERGENI_DATA x2): violava script-src (niente 'unsafe-eval'). Nuovo helper _parseDataBlock usa JSON.parse — i blocchi sono prodotti via JSON.stringify, quindi JSON puro: round-trip garantito, CSP del sito invariata.
// v 2026.05.22.01 — F0.21-d: accorpa dolci nella CARTA EN/FR (fetch live menu-dolci.html + DeepL fresco, fallback statico). filesDolci NON genera piu menu-dolci-en/fr.html. Nuovi helper _estraiMenu/_dolciCartaLive/costruisciDolciPerCarta. IT invariato.
// v 2026.05.22.02 — F0.21-e: pagina ALLERGENI completa (carta+dolci) in coda alla CARTA EN/FR. Fetch live menu-allergeni.html + dolci; termini via dizionario controllato 14 allergeni UE (ALLERGENI_DIZIONARIO/VARIANTI), nomi piatti via DeepL/fallback. Iniezione renderAllergeniPage+CSS nel template lingua. menu-allergeni.html IT invariato (stampa). IT carta invariata.
// v 2026.05.17.04 — F0.6bis: migrate fetch admin GH Pages → CF Pages (BASE_FETCH_URL centralizzato, 7 occorrenze)
// v 2026.05.17.03 — F0.4: rimosse lingue DE + ES (langs array, TRADUZIONI_DOLCI, qrLinks, langPair)
// v 2026.05.15.04 — Documento generico: toggle centratura verticale del testo nella pagina
// v 2026.05.15.03 — Documento generico: rimosso header Santamonica + titolo (solo contenuto file)
// v 2026.05.15.02 — Documento generico: bottoni allineamento testo (giustificato/sinistra/centro) nella preview
// v 2026.05.15.01 — Aggiunto "Documento generico" (PDF/DOCX/TXT → HTML stile carta, no upload)
// v 2026.05.14.02 — Inversione menu.html (pubblico, SEO) ↔ menu-it.html (admin/preview)
//                + iniezione meta SEO sui file pubblici
// v 2026.05.14.01 — Proxy DeepL via Vercel function (bypass CORS) + report errori traduzione

// ═══════════════════════════════════════════════════════
// CONFIG — URL base fetch admin
// v 2026.06.05.01: relativo (same-origin) per non violare la CSP connect-src.
// Admin e menu stanno sullo stesso deploy Cloudflare → '/menu-it.html' ecc.
// risolvono sul dominio corrente (santamonicagenova.it o *.pages.dev). Vuoto = 'self'.
// ═══════════════════════════════════════════════════════
var BASE_FETCH_URL = '';

// ═══════════════════════════════════════════════════════
// TRADUZIONE — proxy Vercel verso DeepL
// ═══════════════════════════════════════════════════════
// Il browser non può chiamare DeepL direttamente (blocco CORS sul lato DeepL).
// Soluzione: chiamiamo una Vercel Serverless Function nostra (api/translate.js) che
// fa da proxy. La chiave DeepL vive in Vercel env (DEEPL_KEY), non più in localStorage.
var PROXY_ENDPOINT = 'https://santa-web-peach.vercel.app/api/translate';
var DEEPL_LANG_MAP = { en: 'EN-GB', fr: 'FR', de: 'DE', es: 'ES' };

// Stub legacy lasciati no-op per compatibilità con onclick HTML esistenti in menu-admin.
// Le funzioni che usavano la chiave in localStorage sono ora ininfluenti.
function getDeepLKey() { return ''; }
function resetDeepLKey() {}
function confermaDeepLKey() {
  var modal = document.getElementById('modal-deepl'); if (modal) modal.classList.remove('on');
}
function chiudiModalDeepL() {
  var modal = document.getElementById('modal-deepl'); if (modal) modal.classList.remove('on');
}
function _assicuraDeepLKey(pendingFn) { return true; } // sempre OK: la chiave è server-side

// Chiama il proxy Vercel. Ritorna Promise che risolve con
// { trad: string|null, authError: bool, errorMsg: string|null }.
function chiamaDeepL(testo, langCode) {
  var targetLang = DEEPL_LANG_MAP[langCode] || langCode.toUpperCase();
  return fetch(PROXY_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: testo, target_lang: targetLang })
  }).then(function(r) {
    // 401/403 = problema chiave server-side (env non settata o invalidata)
    if (r.status === 401 || r.status === 403) {
      console.error('[Translate] Chiave DeepL server-side non valida o mancante (status ' + r.status + ')');
      return { trad: null, authError: true, errorMsg: 'Chiave DeepL invalida lato server' };
    }
    if (!r.ok) {
      return r.json().then(function(err) {
        console.error('[Translate] HTTP ' + r.status, err);
        return { trad: null, authError: false, errorMsg: 'HTTP ' + r.status + ' (' + (err && err.error || 'errore') + ')' };
      }).catch(function() {
        return { trad: null, authError: false, errorMsg: 'HTTP ' + r.status };
      });
    }
    return r.json().then(function(data) {
      var trad = data && data.translations && data.translations[0] && data.translations[0].text;
      return { trad: trad || null, authError: false, errorMsg: trad ? null : 'risposta vuota' };
    });
  }).catch(function(err) {
    console.error('[Translate] Network error:', err);
    return { trad: null, authError: false, errorMsg: 'errore di rete' };
  });
}

function carica(input) {
  var f = input.files[0];
  if (!f) return;
  var r = new FileReader();
  r.onload = function(e) {
    try { analizza(e.target.result); }
    catch(ex) { document.getElementById('err').textContent = 'Errore: ' + ex.message; }
  };
  r.readAsText(f, 'utf-8');
}

// ── Helper: estrae l'oggetto dati da un blocco "const X = {...};".
// I blocchi sono prodotti via JSON.stringify (vedi costruisciOutput) => JSON puro.
// JSON.parse evita Function()/eval, vietato dalla CSP (niente 'unsafe-eval').
function _parseDataBlock(js, varName) {
  var a = js.indexOf('{'), b = js.lastIndexOf('}');
  if (a < 0 || b < 0 || b < a) throw new Error('Blocco ' + (varName || 'dati') + ' non parsabile.');
  return JSON.parse(js.slice(a, b + 1));
}

function analizza(src) {
  var START = 'const MENU = {';
  var END   = '/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */';
  var i1 = src.indexOf(START);
  if (i1 < 0) throw new Error('Blocco MENU non trovato — hai caricato il file giusto?');
  var i2 = src.indexOf(END, i1);
  if (i2 < 0) throw new Error('Fine blocco MENU non trovata.');
  var i2end = src.indexOf('\n', i2) + 1;

  var js = src.slice(i1, i2).trim(); // "const MENU = { ... };"
  dati = _parseDataBlock(js, 'MENU');
  datiOriginali = JSON.parse(JSON.stringify(dati)); // copia immutabile

  tplBefore = src.slice(0, i1);
  tplAfter  = src.slice(i2end);


  document.getElementById('intro').style.display = 'none';
  document.getElementById('wrap').classList.add('on');
  costruisci();
  
}

function el(tag, cls, txt) {
  var e = document.createElement(tag);
  if (cls) e.className = cls;
  if (txt !== undefined) e.textContent = txt;
  return e;
}
function inp(type, id, val, ph) {
  var e = document.createElement('input');
  e.type = type; e.id = id;
  if (val !== undefined && val !== null) e.value = val;
  if (ph) e.placeholder = ph;
  return e;
}
function chk(id, v) {
  var e = document.createElement('input');
  e.type = 'checkbox'; e.id = id; e.checked = !!v;
  e.style.cssText = 'display:block;margin:auto';
  return e;
}

// Nasconde TUTTE le viste/sezioni e svuota il form della carta.
// Va chiamata a ogni caricamento (carta, dolci, allergeni, vini, foto, documento generico,
// prenotazioni) così la pagina non trascina la vista precedente in fondo.
function _pulisciViste() {
  ['foto-section','foto-sito-section','vini-section','doc-section','prenotazioni-section','buoni-section','reminder-section','cauzioni-section'].forEach(function(id){
    var e = document.getElementById(id); if (e) e.style.display = 'none';
  });
  var w = document.getElementById('wrap');
  if (w) { w.classList.remove('on'); w.innerHTML = ''; }
}

function costruisci() {
  var wrap = document.getElementById('wrap');
  wrap.innerHTML = '';
  var m = dati;

  /* Le impostazioni stampa (caratteri/interlinea/spazio/posizione) sono ora PULSANTI nella
     barra della preview, non più cursori qui. Carta: vedi CTRL_BAR in costruisciOutput +
     funzioni _sz* in CARTA_TPL_A. Dolci: barra iniettata in apriPreview + _sz* in menu-dolci.html. */

  /* --- DEGUSTAZIONE --- */
  if (m.degustazione) {
  var fsd = el('div','fs');
  fsd.appendChild(el('div','fs-head','Menù Degustazione'));
  var bd = el('div','fs-body');

  bd.appendChild(el('div','sub','Opzioni prezzo'));
  m.degustazione.opzioni.forEach(function(o, i) {
    var row = el('div','opt-row');
    var c1 = el('div'); c1.appendChild(el('span','opt-lbl','Portate')); c1.appendChild(inp('number','op-portate-'+i, o.portate)); row.appendChild(c1);
    var c2 = el('div'); c2.appendChild(el('span','opt-lbl','Prezzo')); c2.appendChild(inp('number','op-prezzo-'+i, o.prezzo)); row.appendChild(c2);
    var c3 = el('div'); c3.appendChild(el('span','opt-lbl','Vini')); c3.appendChild(inp('number','op-vini-'+i, o.vini)); row.appendChild(c3);
    bd.appendChild(row);
  });

  // Identifico le 2 chiavi dei percorsi: quella con array (6) e quella con stringa (7).
  // Questo rende il codice agnostic rispetto alle chiavi effettive ('6'/'7' oppure 'Sei'/'Sette').
  var _percKeys = Object.keys(m.degustazione.percorsi);
  var _key6 = _percKeys.find(function(k){ return Array.isArray(m.degustazione.percorsi[k]); }) || '6';
  var _key7 = _percKeys.find(function(k){ return typeof m.degustazione.percorsi[k] === 'string'; }) || '7';
  // Normalizza percorso_label_* se mancanti
  if (!m.degustazione.percorso_label_6) m.degustazione.percorso_label_6 = _key6;
  if (!m.degustazione.percorso_label_7) m.degustazione.percorso_label_7 = _key7;

  var s6wrap = el('div','opt-row');
  var s6lbl = el('div'); s6lbl.appendChild(el('span','opt-lbl','Label percorso 6')); s6lbl.appendChild(inp('text','degu-label-6', m.degustazione.percorso_label_6)); s6wrap.appendChild(s6lbl);
  bd.appendChild(s6wrap);
  var s6 = el('div','sub'); s6.innerHTML = 'Percorso \u201c6\u201d \u00a0<span style="color:var(--rust);font-size:.6rem">\u2611 = sostenibile *</span>';
  bd.appendChild(s6);
  var h6 = el('div'); h6.style.cssText = 'display:grid;grid-template-columns:1fr 30px;gap:.4rem;padding:.3rem 0;border-bottom:1px solid var(--rule);margin-bottom:.3rem';
  h6.appendChild(el('div','col-lbl','Nome piatto')); h6.appendChild(el('div','col-lbl','*'));
  bd.appendChild(h6);
  m.degustazione.percorsi[_key6].forEach(function(p, i) {
    var row = el('div','degu-row');
    row.appendChild(inp('text','d6p-'+i, p.nome));
    row.appendChild(chk('d6s-'+i, p.sostenibile));
    bd.appendChild(row);
  });

  var s7wrap = el('div','opt-row');
  var s7lbl = el('div'); s7lbl.appendChild(el('span','opt-lbl','Label percorso 7')); s7lbl.appendChild(inp('text','degu-label-7', m.degustazione.percorso_label_7)); s7wrap.appendChild(s7lbl);
  bd.appendChild(s7wrap);
  bd.appendChild(el('div','sub','Percorso \u201c7\u201d'));
  var i7 = inp('text','degu7', m.degustazione.percorsi[_key7]);
  i7.style.width = '100%'; bd.appendChild(i7);

  fsd.appendChild(bd); wrap.appendChild(fsd);

  } // fine degustazione

  /* --- SEZIONI --- */
  m.sezioni.forEach(function(sez, si) {
    var fs = el('div','fs');
    // Header con titolo editabile
    var head = el('div','fs-head');
    var headLabel = el('span','', 'Sezione: ');
    headLabel.style.cssText = 'font-size:.6rem;letter-spacing:.08em;text-transform:uppercase;color:var(--stone);margin-right:.5rem';
    var headInp = inp('text','sez-display-'+si, sez.titolo_display || sez.titolo);
    headInp.style.cssText = 'width:220px;display:inline-block;font-size:.75rem;padding:.2rem .4rem;background:#fff';
    head.appendChild(headLabel); head.appendChild(headInp);
    fs.appendChild(head);
    var body = el('div','fs-body');

    var hdr = el('div','grid-hdr');
    ['Nome piatto','Prezzo','Unità','Descrizione','*'].forEach(function(t){ hdr.appendChild(el('div','col-lbl',t)); });
    body.appendChild(hdr);

    sez.piatti.forEach(function(p, pi) {
      var row = el('div','grid-row');
      row.appendChild(inp('text',   's'+si+'p'+pi+'-nome',   p.nome));
      row.appendChild(inp('number', 's'+si+'p'+pi+'-prezzo', p.prezzo));
      row.appendChild(inp('text',   's'+si+'p'+pi+'-unita',  p.unita||'', 'cad.'));
      row.appendChild(inp('text',   's'+si+'p'+pi+'-desc',   p.descrizione||''));
      row.appendChild(chk('s'+si+'p'+pi+'-eco', p.sostenibile));
      body.appendChild(row);
    });

    // Pulsante "+" per accodare un piatto vuoto a questa sezione
    var addWrap = el('div'); addWrap.style.cssText = 'padding-top:.6rem';
    var addBtn = el('button','','+ Aggiungi piatto');
    addBtn.type = 'button';
    addBtn.style.cssText = 'font-family:Jost,sans-serif;font-size:.62rem;letter-spacing:.1em;text-transform:uppercase;background:transparent;border:1px dashed var(--rule);padding:.4rem .9rem;cursor:pointer;color:var(--stone)';
    addBtn.onclick = (function(idx){ return function(e){ e.preventDefault(); aggiungiPiatto(idx); }; })(si);
    addWrap.appendChild(addBtn);
    body.appendChild(addWrap);

    fs.appendChild(body); wrap.appendChild(fs);
  });
  if (m.orario) {
    var fso = el('div','fs'); fso.appendChild(el('div','fs-head','Foglio Orario'));
    var bdo = el('div','fs-body'); bdo.appendChild(el('div','sub','Immagine QR code'));
    var qrRow = el('div'); qrRow.style.cssText = 'margin-bottom:.8rem';
    var qrLbl = el('span','opt-lbl','Seleziona immagine QR (PNG/JPG)'); qrLbl.style.display='block'; qrLbl.style.marginBottom='.3rem';
    qrRow.appendChild(qrLbl);
    // Anteprima immagine corrente
    var qrPrev = document.createElement('img'); qrPrev.id='qr-preview';
    qrPrev.style.cssText='width:60px;height:60px;display:block;margin-bottom:.4rem;border:1px solid var(--rule);object-fit:contain';
    qrPrev.src=BASE_FETCH_URL+'/orario-qr.png?t='+Date.now();
    qrPrev.onerror=function(){this.style.display='none';};
    qrRow.appendChild(qrPrev);
    // Input file
    var qrFile = document.createElement('input'); qrFile.type='file'; qrFile.id='orario-qr-file'; qrFile.accept='image/*';
    qrFile.style.cssText='font-family:Jost,sans-serif;font-size:.78rem;cursor:pointer';
    qrFile.onchange = function() {
      var file = this.files[0]; if (!file) return;
      var reader = new FileReader();
      reader.onload = function(e) {
        var prev = document.getElementById('qr-preview');
        if (prev) { prev.src = e.target.result; prev.style.display='block'; }
        _qrBase64 = e.target.result.split(',')[1]; // Salva per pubblicazione
      };
      reader.readAsDataURL(file);
    };
    qrRow.appendChild(qrFile);
    // Pulsante reset
    var qrReset = document.createElement('button'); qrReset.textContent='✕ Ripristina QR predefinito';
    qrReset.style.cssText='margin-top:.4rem;display:block;font-family:Jost,sans-serif;font-size:.65rem;letter-spacing:.1em;text-transform:uppercase;background:transparent;border:1px solid var(--rule);padding:.3rem .7rem;cursor:pointer;color:var(--stone)';
    qrReset.onclick = function(e) { e.preventDefault(); var f=document.getElementById('orario-qr-file'); if(f) f.value=''; _qrBase64=null; var p=document.getElementById('qr-preview'); if(p){p.src=BASE_FETCH_URL+'/orario-qr.png?t='+Date.now();p.style.display='block';} };
    qrRow.appendChild(qrReset);
    bdo.appendChild(qrRow); fso.appendChild(bdo); wrap.appendChild(fso);
  }
}

// Accoda un piatto vuoto alla sezione indicata e ri-renderizza il form.
// Cattura prima lo stato corrente (leggi(true) = senza scartare le righe vuote
// già aggiunte) per non perdere eventuali modifiche non ancora salvate.
function aggiungiPiatto(si) {
  if (!dati || !dati.sezioni || !dati.sezioni[si]) return;
  dati = leggi(true);
  if (!Array.isArray(dati.sezioni[si].piatti)) dati.sezioni[si].piatti = [];
  dati.sezioni[si].piatti.push({ nome: '', prezzo: null });
  costruisci();
  var idx = dati.sezioni[si].piatti.length - 1;
  var f = document.getElementById('s' + si + 'p' + idx + '-nome');
  if (f) f.focus();
}

// keepEmpty=true → mantiene i piatti senza nome (serve durante l'editing, es. aggiungiPiatto).
// Di default i piatti con nome vuoto vengono scartati: una riga aggiunta col "+" e non
// valorizzata NON finisce nel menu pubblicato (IT/EN/FR/allergeni passano tutti da leggi()).
function leggi(keepEmpty) {
  var m = JSON.parse(JSON.stringify(dati));

  if (m.degustazione) {
    m.degustazione.opzioni.forEach(function(o, i) {
      o.portate = +document.getElementById('op-portate-'+i).value;
      o.prezzo  = +document.getElementById('op-prezzo-'+i).value;
      o.vini    = +document.getElementById('op-vini-'+i).value;
    });
    // Identifico le chiavi correnti (possono essere '6'/'7' o 'Sei'/'Sette' ecc.)
    var _kAll = Object.keys(m.degustazione.percorsi);
    var _kOld6 = _kAll.find(function(k){ return Array.isArray(m.degustazione.percorsi[k]); }) || '6';
    var _kOld7 = _kAll.find(function(k){ return typeof m.degustazione.percorsi[k] === 'string'; }) || '7';
    // Leggi gli array di piatti dal form usando la vecchia chiave
    var perc6 = m.degustazione.percorsi[_kOld6];
    if (Array.isArray(perc6)) {
      perc6.forEach(function(p, i) {
        var ne = document.getElementById('d6p-'+i);
        if (ne) p.nome = ne.value;
        var eco = document.getElementById('d6s-'+i);
        if (eco && eco.checked) p.sostenibile = true; else delete p.sostenibile;
      });
    }
    var d7val = document.getElementById('degu7');
    var perc7 = d7val ? d7val.value : m.degustazione.percorsi[_kOld7];
    // Rinomina le chiavi dei percorsi in base alle label scelte nel form
    // (il template usa la chiave come etichetta: "6" → "Sei", "7" → "Sette", ecc.)
    var l6El=document.getElementById('degu-label-6');
    var l7El=document.getElementById('degu-label-7');
    var newLabel6 = l6El ? (l6El.value.trim() || '6') : '6';
    var newLabel7 = l7El ? (l7El.value.trim() || '7') : '7';
    var newPercorsi = {};
    newPercorsi[newLabel6] = perc6;
    newPercorsi[newLabel7] = perc7;
    m.degustazione.percorsi = newPercorsi;
    m.degustazione.percorso_label_6 = newLabel6;
    m.degustazione.percorso_label_7 = newLabel7;
  }

  m.sezioni.forEach(function(sez, si) {
    // NON sovrascrivere sez.titolo — è la chiave usata da getSez e pagine
    var dispEl = document.getElementById('sez-display-'+si);
    if (dispEl) sez.titolo_display = dispEl.value.trim() || sez.titolo;
    sez.piatti.forEach(function(p, pi) {
      p.nome = document.getElementById('s'+si+'p'+pi+'-nome').value;
      var pr = document.getElementById('s'+si+'p'+pi+'-prezzo').value;
      p.prezzo = pr !== '' ? +pr : null;
      var u = document.getElementById('s'+si+'p'+pi+'-unita').value.trim();
      if (u) p.unita = u; else delete p.unita;
      var d = document.getElementById('s'+si+'p'+pi+'-desc').value.trim();
      if (d) p.descrizione = d; else delete p.descrizione;
      var eco = document.getElementById('s'+si+'p'+pi+'-eco').checked;
      if (eco) p.sostenibile = true; else delete p.sostenibile;
    });
  });
  // QR gestito come file separato (orario-qr.png), non nel MENU JSON
  if (m.orario) { delete m.orario.qr_url; }
  if (m.allergeni) {
    m.allergeni.forEach(function(a, ai) {
      var n = document.getElementById('all-'+ai+'-nome');
      var al = document.getElementById('all-'+ai+'-all');
      if (n) a.nome = n.value;
      if (al) a.allergeni = al.value;
    });
  }
  // Scarta i piatti senza nome (righe aggiunte col "+" e non valorizzate),
  // tranne durante l'editing (keepEmpty). Così non escono righe vuote nel menu.
  if (!keepEmpty && Array.isArray(m.sezioni)) {
    m.sezioni.forEach(function(sez) {
      if (Array.isArray(sez.piatti)) {
        sez.piatti = sez.piatti.filter(function(p) {
          return p && String(p.nome || '').trim() !== '';
        });
      }
    });
  }
  return m;
}

var MENU_URL = BASE_FETCH_URL + '/menu-it.html';
var REPO_OWNER = 'santamonicagenova-a11y';
var REPO_NAME  = 'SantaWeb';
var MENU_PATH  = 'menu.html';
var outputCorrente = '';
var DOLCI_URL = BASE_FETCH_URL + '/menu-dolci.html';
var DOLCI_PATH = 'menu-dolci.html';
var MENU_DOLCI_IT = {"sezioni": [{"titolo": "Golosità", "piatti": [{"nome": "Gelato al limone nero, levistico, lime, cracker di latte", "prezzo": 14}, {"nome": "Ananas, parfait al carbone, caramello al caffè", "prezzo": 14}, {"nome": "Gelato al porcino, fragole, terra al cioccolato", "prezzo": 14}, {"nome": "Sacripantina", "prezzo": 11}, {"nome": "Erborinato ligure e Picolit Zorzettig", "prezzo": 12}]}], "allergeni": [{"nome": "Gelato al limone nero", "allergeni": "glutine, latticini"}, {"nome": "Gelato porcino", "allergeni": "latticini, uova"}, {"nome": "Ananas", "allergeni": "uovo, glutine, latticini"}, {"nome": "Sacripantina", "allergeni": "frutta a guscio, uovo, glutine, latticini, solforosa"}, {"nome": "Erborinato e Picolit", "allergeni": "latticini, solforosa"}], "pagine": [{"sezioni": ["Golosità"]}]};
var TRADUZIONI_DOLCI = {"en": {"title": "Desserts — Santamonica", "sezione": "Sweets", "piatti": {"Gelato al limone nero, levistico, lime, cracker di latte": "Black lemon gelato, lovage, lime, milk cracker", "Ananas, parfait al carbone, caramello al caffè": "Pineapple, charcoal parfait, coffee caramel", "Gelato al porcino, fragole, terra al cioccolato": "Porcini gelato, strawberries, chocolate soil", "Sacripantina": "Sacripantina", "Erborinato ligure e Picolit Zorzettig": "Ligurian blue cheese and Picolit Zorzettig", "glutine, latticini": "gluten, dairy", "latticini, uova": "dairy, eggs", "uovo, glutine, latticini": "egg, gluten, dairy", "frutta a guscio, uovo, glutine, latticini, solforosa": "tree nuts, egg, gluten, dairy, sulphites", "latticini, solforosa": "dairy, sulphites", "Gelato al limone nero": "Black lemon gelato", "Gelato porcino": "Porcini gelato", "Ananas": "Pineapple", "Erborinato e Picolit": "Blue cheese and Picolit"}}, "fr": {"title": "Desserts — Santamonica", "sezione": "Gourmandises", "piatti": {"Gelato al limone nero, levistico, lime, cracker di latte": "Glace citron noir, livèche, citron vert, cracker au lait", "Ananas, parfait al carbone, caramello al caffè": "Ananas, parfait au charbon, caramel au café", "Gelato al porcino, fragole, terra al cioccolato": "Glace aux cèpes, fraises, terre au chocolat", "Sacripantina": "Sacripantina", "Erborinato ligure e Picolit Zorzettig": "Fromage persillé ligurien et Picolit Zorzettig", "glutine, latticini": "gluten, produits laitiers", "latticini, uova": "produits laitiers, œufs", "uovo, glutine, latticini": "œuf, gluten, produits laitiers", "frutta a guscio, uovo, glutine, latticini, solforosa": "fruits à coque, œuf, gluten, produits laitiers, sulfites", "latticini, solforosa": "produits laitiers, sulfites", "Gelato al limone nero": "Glace citron noir", "Gelato porcino": "Glace aux cèpes", "Ananas": "Ananas", "Erborinato e Picolit": "Fromage persillé et Picolit"}}};
var tipoMenuCorrente = 'carta';

function costruisciOutput() {
  var m = leggi();
  var sep = '/* ' + '\u2550'.repeat(57) + ' */\n';
  var blocco = 'const MENU = ' + JSON.stringify(m, null, 2) + ';\n' + sep;
  // Per la carta usa SEMPRE i template embedded aggiornati (non il file caricato dal sito)
  if (tipoMenuCorrente === 'carta') {
    var html = CARTA_TPL_B + blocco + CARTA_TPL_A;
    // Inietta la ctrl-bar (versione admin: switch carta/orario + stampa + scarica).
    // costruisciMenuItPub() rimuove solo BTNS dei bottoni switch per il pubblico;
    // qui aggiungiamo tutta la barra.
    var CTRL_BAR = '<div class="ctrl-bar">\n'
      + '  <button class="ctrl-btn active" id="btn-carta" onclick="showLayout(\'carta\')">\u261e Men\u00f9 alla carta (3 pag.)</button>\n'
      + '  <div class="ctrl-sep"></div>\n'
      + '  <button class="ctrl-btn" id="btn-orario" onclick="showLayout(\'orario\')">\u261e Foglio orario (1 pag.)</button>\n'
      + '  <div class="ctrl-sep"></div>\n'
      + '  <button class="ctrl-btn" onclick="window.print()">\u26a1 Stampa</button>\n'
      + '  <div class="ctrl-sep"></div>\n'
      + _SIZE_BTNS
      + '</div>\n';
    html = html.replace('<body>\n', '<body>\n' + CTRL_BAR);
    return html;
  }
  return tplBefore + blocco + tplAfter;
}

function salva() { apriPreview(); }

function togglePreviewMenu(e) {
  e.stopPropagation();
  document.getElementById('preview-menu').classList.toggle('open');
}
document.addEventListener('click', function() {
  var m = document.getElementById('preview-menu');
  if (m) m.classList.remove('open');
  var cm = document.getElementById('carica-menu');
  if (cm) cm.classList.remove('open');
});

var tplBefore = '', tplAfter = '', dati = null, datiOriginali = null;
var _qrBase64 = null;   // base64 del nuovo QR selezionato (separato dal MENU)

// Pulsanti dimensione/spaziatura per la barra della preview (carta + dolci).
// Chiamano le funzioni _sz* definite nello <script> della pagina (CARTA_TPL_A / menu-dolci.html).
var _SIZE_BTNS =
    '  <button class="ctrl-btn" onclick="_szF(0.03)" title="Caratteri piu grandi">A+</button>\n'
  + '  <button class="ctrl-btn" onclick="_szF(-0.03)" title="Caratteri piu piccoli">A−</button>\n'
  + '  <button class="ctrl-btn" onclick="_szL(0.05)" title="Interlinea +">↕+</button>\n'
  + '  <button class="ctrl-btn" onclick="_szL(-0.05)" title="Interlinea −">↕−</button>\n'
  + '  <button class="ctrl-btn" onclick="_szG(0.05)" title="Spazio +">¶+</button>\n'
  + '  <button class="ctrl-btn" onclick="_szG(-0.05)" title="Spazio −">¶−</button>\n'
  + '  <button class="ctrl-btn" onclick="_szS(2)" title="Sposta giu">⬇</button>\n'
  + '  <button class="ctrl-btn" onclick="_szS(-2)" title="Sposta su">⬆</button>\n'
  + '  <button class="ctrl-btn" onclick="_szR()" title="Ripristina dimensioni">↺</button>\n';

// Barra admin per i dolci (Stampa + pulsanti dimensione). Va in menu-dolci-it.html e nella preview.
function _dolciCtrlBar() {
  return '<div class="ctrl-bar">\n'
    + '  <button class="ctrl-btn" onclick="window.print()">⚡ Stampa</button>\n'
    + '  <div class="ctrl-sep"></div>\n'
    + _SIZE_BTNS
    + '</div>\n';
}

function apriPreview(lang) {
  if (tipoMenuCorrente === 'allergeni') { apriPreviewAllergeni(); return; }
  if (!dati) { alert('Prima carica il menù'); return; }
  document.getElementById('preview-menu').classList.remove('open');
  outputCorrente = costruisciOutput();
  if (!lang || lang === 'it') {
    // Italiano: genera al volo. I dolci non hanno ctrl-bar nel file: iniettiamo una barra
    // (Stampa + pulsanti dimensione) SOLO nella preview, non nel file pubblicato.
    var previewHtml = outputCorrente;
    if (tipoMenuCorrente === 'dolci') {
      previewHtml = previewHtml.replace('<body>', '<body>\n' + _dolciCtrlBar());
    }
    var blob = new Blob([previewHtml], { type: 'text/html;charset=utf-8' });
    window.open(URL.createObjectURL(blob), '_blank').focus();
  } else {
    // Lingue: apri direttamente da GitHub Pages
    var prefix = tipoMenuCorrente === 'dolci' ? 'menu-dolci-' : 'menu-';
    var base = BASE_FETCH_URL + '/' + prefix + lang + '.html';
    window.open(base + '?v=' + Date.now(), '_blank').focus();
  }
}

function toggleCaricaMenu(e) {
  e.stopPropagation();
  document.getElementById('carica-menu').classList.toggle('open');
}

function caricaDalSito(tipo) {
  tipo = tipo || 'carta';
  tipoMenuCorrente = tipo;
  document.getElementById('carica-menu').classList.remove('open');
  _pulisciViste();
  if (tipo === 'allergeni') { caricaAllergeniDalSito(); return; }
  var url = tipo === 'dolci' ? DOLCI_URL : MENU_URL;
  var btn = document.querySelector('.btn-load');
  document.getElementById('err').textContent = '';
  fetch(url + '?nocache=' + Date.now() + '_' + Math.random().toString(36).slice(2), { cache: 'no-store' })
    .then(function(r) {
      if (!r.ok) throw new Error('Errore HTTP ' + r.status);
      return r.text();
    })
    .then(function(src) {
      try {
        analizza(src);
        document.getElementById('intro').style.display = 'none';
        document.getElementById('wrap').classList.add('on');
        costruisci();
        toast('✓ Menù caricato dal sito');
      } catch(ex) {
        document.getElementById('err').textContent = 'Errore: ' + ex.message;
      }
    })
    .catch(function(ex) {
      document.getElementById('err').textContent = 'Impossibile caricare: ' + ex.message;
    });
}

function pubblicaSuGithub() {
  if (!dati) { alert('Prima carica il menù'); return; }
  outputCorrente = costruisciOutput();
  var token = localStorage.getItem('gh_token') || '';
  if (token) {
    // Token già salvato — pubblica direttamente senza mostrare il modale
    eseguiPubblicazione(token);
  } else {
    document.getElementById('token-input').value = '';
    document.getElementById('modal-token').classList.add('on');
  }
}

function resetToken() {
  localStorage.removeItem('gh_token');
  document.getElementById('token-input').value = '';
  document.getElementById('modal-token').classList.add('on');
}

function confermaPubblica() {
  var token = document.getElementById('token-input').value.trim();
  if (!token) { alert('Inserisci il token'); return; }
  localStorage.setItem('gh_token', token);
  chiudiModal();
  if (window._pendingAllergeniPublish) { window._pendingAllergeniPublish = false; pubblicaAllergeni(token); return; }
  if (window._pendingVoucherPublish) { window._pendingVoucherPublish = false; _pubblicaVoucherConfig(token); return; }
  eseguiPubblicazione(token);
  var btn = document.getElementById('btn-pubblica');
  if (btn) { btn.textContent = '✦ Traduci e Pubblica'; btn.disabled = false; }
}

function chiudiModal() {
  document.getElementById('modal-token').classList.remove('on');
}

// ── Buoni regalo: i 3 valori dei "buoni liberi" (voucher-config.json) ──────────
// Legge i valori attuali e li mette nei 3 campi del pannello "Buoni regalo".
function caricaVoucherBuoni() {
  var st = document.getElementById('vb-status');
  fetch('/voucher-config.json', { cache: 'no-store' })
    .then(function(r){ return r.ok ? r.json() : null; })
    .then(function(cfg){
      if (cfg && Array.isArray(cfg.liberi)) {
        if (cfg.liberi[0] != null) document.getElementById('vb-1').value = cfg.liberi[0];
        if (cfg.liberi[1] != null) document.getElementById('vb-2').value = cfg.liberi[1];
        if (cfg.liberi[2] != null) document.getElementById('vb-3').value = cfg.liberi[2];
        if (st) st.textContent = 'Valori attuali caricati.';
      } else if (st) { st.textContent = 'Nessun config trovato: inserisci i valori e pubblica.'; }
    })
    .catch(function(){ if (st) st.textContent = 'Config non raggiungibile (offline?).'; });
}

// Apre il pannello "Buoni regalo" (stesso pattern delle altre sezioni).
function apriSezioneBuoni() {
  var cm = document.getElementById('carica-menu'); if (cm) cm.classList.remove('open');
  var intro = document.getElementById('intro'); if (intro) intro.style.display = 'none';
  _pulisciViste();
  var bs = document.getElementById('buoni-section');
  if (bs) bs.style.display = 'block';
  caricaVoucherBuoni();
}

// Avvia la pubblicazione dei 3 valori (gestisce il token come gli altri publish).
function pubblicaVoucherBuoni() {
  var v1 = parseInt(document.getElementById('vb-1').value, 10);
  var v2 = parseInt(document.getElementById('vb-2').value, 10);
  var v3 = parseInt(document.getElementById('vb-3').value, 10);
  if (!(v1 > 0) || !(v2 > 0) || !(v3 > 0)) { alert('Inserisci tre importi validi (numeri interi positivi).'); return; }
  var token = localStorage.getItem('gh_token') || '';
  if (token) {
    _pubblicaVoucherConfig(token);
  } else {
    window._pendingVoucherPublish = true;
    document.getElementById('token-input').value = '';
    document.getElementById('modal-token').classList.add('on');
  }
}

// Costruisce voucher-config.json (preservando la parte degustazione) e lo pubblica.
function _pubblicaVoucherConfig(token) {
  var st = document.getElementById('vb-status');
  var v1 = parseInt(document.getElementById('vb-1').value, 10);
  var v2 = parseInt(document.getElementById('vb-2').value, 10);
  var v3 = parseInt(document.getElementById('vb-3').value, 10);
  if (st) st.textContent = 'Pubblicazione in corso…';
  var headers = {
    'Authorization': 'token ' + token,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json'
  };
  // recupera il config attuale per non perdere la parte "degustazione"
  fetch('/voucher-config.json', { cache: 'no-store' })
    .then(function(r){ return r.ok ? r.json() : {}; })
    .catch(function(){ return {}; })
    .then(function(cur){
      cur = cur || {};
      cur.liberi = [v1, v2, v3];
      if (!cur.degustazione) {
        cur.degustazione = { sei: { base: 180, vini: 300 }, sette: { base: 220, vini: 360 } };
      }
      cur.versione = 'v ' + new Date().toISOString().slice(0,10).replace(/-/g, '.') + '.01';
      cur._nota = 'Fonte unica dei valori dei voucher. Modificabile da menu-admin (pannello Buoni regalo) o a mano.';
      var json = JSON.stringify(cur, null, 2) + '\n';
      return pubblicaFile(token, headers, 'voucher-config.json', json);
    })
    .then(function(r){
      if (st) st.textContent = (r && r.ok) ? '✓ Valori pubblicati. Online entro 1-2 minuti.' : 'Errore in pubblicazione (verifica il token).';
    })
    .catch(function(){ if (st) st.textContent = 'Errore di rete in pubblicazione.'; });
}


function traduci() {
  if (!dati) { alert('Prima carica il men\u00f9'); return; }
  if (!_assicuraDeepLKey('traduci')) return;
  var m = leggi();
  var btn = document.getElementById('btn-traduci');

  // Raccogli tutti i testi dal form
  var testi = [];
  if (m.degustazione) {
    var key6;
    if (m.degustazione.percorsi && typeof m.degustazione.percorsi === 'object') {
      key6 = Object.keys(m.degustazione.percorsi).find(function(k) { 
        return Array.isArray(m.degustazione.percorsi[k]); 
      });
    }
    if (key6) {
      m.degustazione.percorsi[key6].forEach(function(p) { if (p.nome) testi.push(p.nome); });
    }
  }
  m.sezioni.forEach(function(sez) {
    if (sez.titolo) testi.push(sez.titolo);
    sez.piatti.forEach(function(p) {
      if (p.nome) testi.push(p.nome);
      if (p.descrizione) testi.push(p.descrizione);
    });
  });
  if (m.allergeni) {
    m.allergeni.forEach(function(a) {
      if (a.nome) testi.push(a.nome);
      if (a.allergeni) testi.push(a.allergeni);
    });
  }
  testi = testi.filter(function(v, i, a) { return v && a.indexOf(v) === i; });

  if (testi.length === 0) { toast('Nessun testo da tradurre'); return; }

  var langs = ['en', 'fr'];
  var totale = testi.length * langs.length;
  var completati = 0;

  btn.textContent = '\u23f3 0/' + totale + '\u2026';
  btn.classList.add('translating');
  btn.disabled = true;

  // Coda sequenziale: una richiesta alla volta
  var coda = [];
  testi.forEach(function(testo) {
    langs.forEach(function(lang) {
      coda.push({ testo: testo, lang: lang });
    });
  });
  var falliti = [];

  function traduciVoce(i) {
    if (i >= coda.length) {
      btn.textContent = '\uD83C\uDF10 Traduci';
      btn.classList.remove('translating');
      btn.disabled = false;
      if (falliti.length > 0) {
        toast('\u26a0 ' + (testi.length - falliti.length) + '/' + testi.length + ' voci tradotte, ' + falliti.length + ' fallite (vedi console)');
      } else {
        toast('\u2713 ' + testi.length + ' voci tradotte in 4 lingue!');
      }
      return;
    }
    var item = coda[i];
    btn.textContent = '\u23f3 ' + (i+1) + '/' + totale + '\u2026';

    chiamaDeepL(item.testo, item.lang)
      .then(function(res) {
        if (res.authError) {
          btn.textContent = '\uD83C\uDF10 Traduci';
          btn.classList.remove('translating');
          btn.disabled = false;
          alert('Errore proxy DeepL: ' + (res.errorMsg || 'chiave non valida lato server') +
                '\n\nVerifica che la env variable DEEPL_KEY sia configurata su Vercel.');
          return;
        }
        if (res.trad) TRANSLATIONS[item.lang]['piatti'][item.testo] = res.trad;
        else falliti.push({ testo: item.testo, lang: item.lang, errorMsg: res.errorMsg });
        setTimeout(function() { traduciVoce(i + 1); }, 80);
      });
  }

  traduciVoce(0);
}


function pubblicaFile(token, headers, path, content, rawBase64) {
  var apiBase = 'https://api.github.com/repos/' + REPO_OWNER + '/' + REPO_NAME + '/contents/' + path;
  return fetch(apiBase, { headers: headers })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      var body = {
        message: 'Aggiornamento menu',
        content: rawBase64 || btoa(unescape(encodeURIComponent(content)))
      };
      if (data.sha) body.sha = data.sha;
      return fetch(apiBase, { method: 'PUT', headers: headers, body: JSON.stringify(body) });
    });
}

function costruisciMenuItPub() {
  // Menu italiano pubblico: outputCorrente senza la ctrl-bar (switch carta/orario + stampa)
  // La ctrl-bar contiene div interni (ctrl-sep), quindi matchiamo fino al </div> che precede layout-carta
  var html = outputCorrente.replace(/<div class="ctrl-bar">[\s\S]*?<\/div>\s*<div id="layout-carta">/, '<div id="layout-carta">');
  html = html.replace("  document.getElementById('btn-carta').classList.toggle('active',  which === 'carta');\n  document.getElementById('btn-orario').classList.toggle('active', which === 'orario');", "  var bc=document.getElementById('btn-carta'); if(bc) bc.classList.toggle('active',which==='carta');\n  var bo=document.getElementById('btn-orario'); if(bo) bo.classList.toggle('active',which==='orario');");
  return html;
}

function eseguiPubblicazione(token) {
  // Guard: senza menu caricato (dati===null) leggi() crasherebbe su "dati.degustazione".
  // Puo' capitare dal percorso modale-token (confermaPubblica) dopo un refresh senza ricaricare il menu.
  if (!dati) { alert('Prima carica il menù (Carica dal sito o da file), poi pubblica.'); return; }

  var headers = {
    'Authorization': 'token ' + token,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json'
  };

  // Ricostruisci SEMPRE l'output dal form aggiornato (non da outputCorrente)
  outputCorrente = costruisciOutput();

  // ── Helper: inietta meta SEO completi sul file menu.html (versione IT pubblica)
  function iniettaSeoITPubblico(html) {
    var SEO_HEAD = '<meta name="description" content="Scopri il menu del ristorante Santamonica a Genova: pesce fresco di Camogli, pasta fatta in casa, cucina ligure contemporanea. Ingredienti locali selezionati ogni giorno.">\n  ' +
      '<meta name="robots" content="index, follow">\n  ' +
      '<link rel="canonical" href="https://santamonicagenova.it/menu.html">\n  ' +
      '<meta property="og:type" content="website">\n  ' +
      '<meta property="og:title" content="Menu | Ristorante Santamonica Genova">\n  ' +
      '<meta property="og:description" content="Pesce fresco di Camogli, pasta fatta in casa, cucina ligure contemporanea. Il menu del ristorante Santamonica sul Lungomare di Genova.">\n  ' +
      '<meta property="og:url" content="https://santamonicagenova.it/menu.html">\n  ' +
      '<meta property="og:image" content="https://santamonicagenova.it/img/hero.jpg">\n  ' +
      '<script type="application/ld+json">\n' +
      '  {\n' +
      '    "@context": "https://schema.org",\n' +
      '    "@type": "Menu",\n' +
      '    "name": "Menu Santamonica",\n' +
      '    "url": "https://santamonicagenova.it/menu.html",\n' +
      '    "inLanguage": "it",\n' +
      '    "hasMenuSection": [\n' +
      '      { "@type": "MenuSection", "name": "Antipasti" },\n' +
      '      { "@type": "MenuSection", "name": "Primi" },\n' +
      '      { "@type": "MenuSection", "name": "Secondi di Mare" },\n' +
      '      { "@type": "MenuSection", "name": "Contorni" }\n' +
      '    ]\n' +
      '  }\n' +
      '  </script>\n  ';
    // Sostituisce title con SEO + title (in modo da posizionare i meta prima del title come da convenzione)
    return html.replace(/<title>([^<]*)<\/title>/, '<title>Menu Pesce Fresco e Cucina Ligure | Ristorante Santamonica Genova</title>\n  ' + SEO_HEAD);
  }

  // ── Helper: inietta noindex + canonical sul file menu-it.html (admin/preview, non SEO)
  function iniettaNoIndexIT(html) {
    var TAGS = '<meta name="robots" content="noindex, nofollow">\n  ' +
               '<link rel="canonical" href="https://santamonicagenova.it/menu-it.html">\n  ';
    return html.replace('<title>', TAGS + '<title>');
  }

  // ── Helper: inietta canonical + index + title/description SEO sui file lingua (menu-LL.html)
  function iniettaSeoLingua(html, lang) {
    var SEO_LL = {
      en: { title: 'Menu — Santamonica · Seafood Restaurant in Genoa',
            desc:  'The menu of Santamonica restaurant in Genoa: fresh seafood from the Ligurian coast, homemade pasta and sea-view dining. Featured in the Michelin Guide.' },
      fr: { title: 'Menu — Santamonica · Restaurant de poisson à Gênes',
            desc:  'Le menu du restaurant Santamonica à Gênes : poissons de la côte ligure, pâtes maison, salle avec vue sur la mer. Sélectionné par le Guide Michelin.' }
    };
    var TAGS = '<meta name="robots" content="index, follow">\n  ' +
               '<link rel="canonical" href="https://santamonicagenova.it/menu-' + lang + '.html">\n  ';
    var s = SEO_LL[lang];
    if (s) {
      TAGS += '<meta name="description" content="' + s.desc + '">\n  ';
      html = html.replace(/<title>[^<]*<\/title>/, '<title>' + s.title + '<\/title>');
    }
    return html.replace('<title>', TAGS + '<title>');
  }

  // File da pubblicare: IT pubblico (menu.html) + IT admin (menu-it.html) + 4 traduzioni
  // NB v 2026.05.14.02: invertiti rispetto a versioni precedenti.
  //    menu.html    = versione pubblica SENZA ctrl-bar, con SEO completo (index)
  //    menu-it.html = versione admin/preview CON ctrl-bar, noindex
  var files;
  if (tipoMenuCorrente === 'dolci') {
    files = filesDolci();
  } else {
    files = [
      { path: 'menu.html',    content: iniettaSeoITPubblico(costruisciMenuItPub()), label: 'Italiano (pubblico, SEO)' },
      { path: 'menu-it.html', content: iniettaNoIndexIT(outputCorrente),            label: 'Italiano (admin/preview)' }
    ];
    ['en','fr'].forEach(function(lang) {
    var t = TRANSLATIONS[lang];
    // Parti dalla versione pubblica IT (senza pulsanti) e traduci
    var html = costruisciMenuItPub();
    var m = costruisciMenuTradotto(leggi(), t);
    if (dati) { // impostazioni stampa (caratteri/interlinea/spazio/posizione) anche su EN/FR
      if (dati.fontScale != null) m.fontScale = dati.fontScale;
      if (dati.lineScale != null) m.lineScale = dati.lineScale;
      if (dati.gapScale  != null) m.gapScale  = dati.gapScale;
      if (dati.shift     != null) m.shift     = dati.shift;
    }
    // F0.21-d: accorpa i dolci nella carta SOLO per le lingue (IT resta separato/stampato).
    var mDolci = costruisciDolciPerCarta(lang);
    if (mDolci) {
      m.sezioni = m.sezioni.concat(mDolci.sezioni);
      m.pagine  = (m.pagine || []).concat(mDolci.pagine);
    }
    // F0.21-e: pagina allergeni completa (carta+dolci) in MENU.allergeni (solo EN/FR; renderizzata da renderAllergeniPage).
    var mAll = costruisciAllergeniPerCarta(lang);
    if (mAll) m.allergeni = mAll;
    var SEP = '/* ' + '\u2550'.repeat(57) + ' */\n';
    var i1 = html.indexOf('const MENU = {');
    var i2 = html.indexOf(SEP, i1) + SEP.length;
    html = html.slice(0, i1) + 'const MENU = ' + JSON.stringify(m, null, 2) + ';\n' + SEP + html.slice(i2);
    html = html.replace('<html lang="it">', '<html lang="' + lang + '">');
    html = html.replace(/<title>[^<]*<\/title>/, '<title>' + t.title + '<\/title>');
    html = html.replace(/Note per l'ospite<\/span>[^`]*`/, t.note_ospite_titolo + '<\/span>\n  ' + t.note_carta_1 + '<br>\n  ' + t.note_carta_2 + '\n`');
    html = html.replace(/Per mantenere costanti[\s\S]*?simbolo: \*`/, t.note_orario + '`');
    html = html.replace('Menù’ Degustazione', t.titolo_degustazione);
    html = html.replace('Men&ugrave;&rsquo; Degustazione', t.titolo_degustazione);
    html = html.replace(/\${o\.portate} portate/g, '${o.portate} ' + t.degu_portate_label);
    html = html.replace(/eventuale abbinamento vini/g, t.degu_vini_label);
    html = html.replace('ORARIO DI SERVIZIO:', t.orario_titolo);
    // Genera dinamicamente i 4 link QR per le lingue
    var qrLinks = [
      '<a href="menu-en.html"><u>English Menu</u></a>',
      '<a href="menu-fr.html"><u>Carte en Français</u></a>'
    ];
    html = html.replace(/English Menu<br>\s*Carte en Fran[^<]*/, qrLinks.join('<br>\n            '));
    // Inietta canonical + index per la lingua specifica
    html = iniettaSeoLingua(html, lang);
    // F0.21-e: inietta CSS + renderer pagina allergeni e lo chiama dopo renderCarta().
    var algCss = '\n    /* F0.21-e allergeni */\n' +
      '    #layout-carta .pg.alg-pg { }\n' +
      '    .alg-header{text-align:center;margin-bottom:6mm;padding-bottom:3mm;border-bottom:1.5px solid var(--ink,#1a1714);}\n' +
      '    .alg-title{font-size:1.7rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;line-height:1;}\n' +
      '    .alg-nota{font-style:italic;font-size:.72rem;color:var(--stone,#8c7e6e);text-align:center;line-height:1.6;margin-bottom:6mm;padding-bottom:4mm;border-bottom:1px solid var(--rule,#d4c9b8);}\n' +
      '    .alg-sez{margin-bottom:5mm;}\n' +
      '    .alg-sez-titolo{font-size:1rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;margin-bottom:2mm;padding-bottom:1mm;border-bottom:1px solid var(--rule,#d4c9b8);}\n' +
      '    .alg-row{display:flex;align-items:baseline;gap:4mm;padding:1.6mm 0;border-bottom:1px dotted var(--rule,#d4c9b8);}\n' +
      '    .alg-row:last-child{border-bottom:none;}\n' +
      '    .alg-nome{flex:0 0 40%;font-size:.86rem;line-height:1.3;}\n' +
      '    .alg-all{flex:1;font-style:italic;font-size:.8rem;line-height:1.4;}\n' +
      '    .alg-all.vuoto{color:var(--stone,#8c7e6e);}\n' +
      '    .alg-legenda{margin-top:auto;padding-top:4mm;border-top:1px solid var(--rule,#d4c9b8);font-size:.66rem;color:var(--stone,#8c7e6e);font-style:italic;line-height:1.6;text-align:center;}\n' +
      '    .alg-legenda strong{font-style:normal;font-weight:600;color:var(--ink,#1a1714);}\n  ';
    html = html.replace('</style>', algCss + '</style>');
    var algFn = '\n/* F0.21-e: pagina allergeni (carta+dolci) */\n' +
      'function renderAllergeniPage(){\n' +
      '  if (typeof MENU === "undefined" || !MENU.allergeni) return;\n' +
      '  var A = MENU.allergeni, root = document.getElementById("layout-carta"); if(!root) return;\n' +
      '  var esc = function(x){ return String(x).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); };\n' +
      '  var pg = document.createElement("div"); pg.className = "pg alg-pg";\n' +
      '  var h = "<div class=\\"alg-header\\"><div class=\\"alg-title\\">"+esc(A.header)+"</div></div>";\n' +
      '  h += "<div class=\\"alg-nota\\">"+esc(A.nota)+"</div>";\n' +
      '  A.sezioni.forEach(function(sez){\n' +
      '    h += "<div class=\\"alg-sez\\"><div class=\\"alg-sez-titolo\\">"+esc(sez.titolo_display)+"</div>";\n' +
      '    (sez.piatti||[]).forEach(function(p){\n' +
      '      var has = p.allergeni && p.allergeni.length;\n' +
      '      h += "<div class=\\"alg-row\\"><div class=\\"alg-nome\\">"+p.nome+"</div>" +\n' +
      '           "<div class=\\"alg-all"+(has?"":" vuoto")+"\\">"+(has?esc(p.allergeni.join(", ")):esc(A.vuoto))+"</div></div>";\n' +
      '    });\n' +
      '    h += "</div>";\n' +
      '  });\n' +
      '  h += "<div class=\\"alg-legenda\\"><strong>"+esc(A.legendaTitolo)+"</strong><br>"+A.legenda.map(esc).join(" &bull; ")+"</div>";\n' +
      '  pg.innerHTML = h; root.appendChild(pg);\n' +
      '}\n';
    // inserisci la funzione subito prima della init "renderCarta();" e aggiungi la chiamata dopo renderCarta()
    html = html.replace('renderCarta();\n', algFn + 'renderCarta();\nrenderAllergeniPage();\n');
    files.push({ path: 'menu-' + lang + '.html', content: html, label: lang.toUpperCase() });
    });
  }

  // Se nuovo QR selezionato, aggiungilo come primo file da pubblicare
  if (_qrBase64) {
    files.unshift({ path: 'orario-qr.png', content: null, rawBase64: _qrBase64, label: 'QR code' });
  }

  toast('⏳ Pubblicazione in corso…');

  var i = 0;
  function next() {
    if (i >= files.length) {
      _qrBase64 = null; var fi=document.getElementById('orario-qr-file'); if(fi) fi.value='';
      toast('✓ Pubblicato! Ricarica tra 90 secondi…');
      setTimeout(function() {
        toast('⏳ Ricarico dal sito…');
        setTimeout(caricaDalSito, 1500);
      }, 90000);
      return;
    }
    var f = files[i++];
    pubblicaFile(token, headers, f.path, f.content, f.rawBase64)
      .then(function(r) {
        if (!r.ok) return r.json().then(function(e){ throw new Error(f.path + ': ' + e.message); });
        toast('✓ ' + f.label + ' (' + i + '/' + files.length + ')');
        setTimeout(next, 400);
      })
      .catch(function(ex) { alert('Errore: ' + ex.message); });
  }
  next();
}


// ── F0.21-d: estrazione "pura" del MENU da un sorgente HTML (nessun side-effect su `dati`).
function _estraiMenu(src) {
  var START = 'const MENU = {';
  var SEP   = '/* ' + '\u2550'.repeat(57) + ' */';
  var i1 = src.indexOf(START);
  if (i1 < 0) return null;
  var i2 = src.indexOf(SEP, i1);
  if (i2 < 0) return null;
  var js = src.slice(i1, i2).trim();
  try { return _parseDataBlock(js, 'MENU'); }
  catch (e) { return null; }
}

// ── F0.21-d: dati dolci LIVE (fetch menu-dolci.html) usati per accorpare i dolci nella carta in lingua.
//    Popolato async in traduciEPubblica prima della passata DeepL. null = non disponibile (si usa il fallback statico).
var _dolciCartaLive = null;

// ── F0.21-e: ALLERGENI — dizionario controllato 14 allergeni UE (Reg. 1169/2011).
// Varianti IT (forme diverse usate nelle due fonti) -> forma canonica IT.
var ALLERGENI_VARIANTI = {
  'latticini': 'latte', 'latte e derivati': 'latte',
  'uovo': 'uova',
  'solforosa': 'solfiti', 'anidride solforosa': 'solfiti', 'anidride solforosa e solfiti': 'solfiti',
  'cereali contenenti glutine': 'glutine',
  'semi di sesamo': 'sesamo'
};
// Canonico IT -> {en, fr} (termini ufficiali EU FIC).
var ALLERGENI_DIZIONARIO = {
  'glutine':         { en: 'gluten',      fr: 'gluten' },
  'crostacei':       { en: 'crustaceans', fr: 'crustac\u00e9s' },
  'uova':            { en: 'eggs',        fr: '\u0153ufs' },
  'pesce':           { en: 'fish',        fr: 'poisson' },
  'arachidi':        { en: 'peanuts',     fr: 'arachides' },
  'soia':            { en: 'soya',        fr: 'soja' },
  'latte':           { en: 'milk',        fr: 'lait' },
  'frutta a guscio': { en: 'nuts',        fr: 'fruits \u00e0 coque' },
  'sedano':          { en: 'celery',      fr: 'c\u00e9leri' },
  'senape':          { en: 'mustard',     fr: 'moutarde' },
  'sesamo':          { en: 'sesame',      fr: 's\u00e9same' },
  'solfiti':         { en: 'sulphites',   fr: 'sulfites' },
  'lupini':          { en: 'lupin',       fr: 'lupin' },
  'molluschi':       { en: 'molluscs',    fr: 'mollusques' }
};
// I 14 allergeni nell'ordine canonico (per la legenda).
var ALLERGENI_14 = ['glutine','crostacei','uova','pesce','arachidi','soia','latte','frutta a guscio','sedano','senape','sesamo','solfiti','lupini','molluschi'];
// Testi legali fissi per lingua.
var ALLERGENI_TESTI = {
  en: {
    header: 'Allergens',
    nota: 'Information pursuant to Regulation (EU) No 1169/2011. For further information on allergens in our dishes, please ask our staff.',
    legendaTitolo: 'Regulated allergens (Reg. EU 1169/2011):',
    vuoto: 'no declared allergen',
    dolciTitolo: 'Desserts'
  },
  fr: {
    header: 'Allerg\u00e8nes',
    nota: 'Information conform\u00e9ment au R\u00e8glement (UE) n\u00b0 1169/2011. Pour plus d\u2019informations sur les allerg\u00e8nes pr\u00e9sents dans nos plats, veuillez vous adresser \u00e0 notre personnel.',
    legendaTitolo: 'Allerg\u00e8nes r\u00e9glement\u00e9s (R\u00e8gl. UE 1169/2011) :',
    vuoto: 'aucun allerg\u00e8ne d\u00e9clar\u00e9',
    dolciTitolo: 'Desserts'
  }
};

// Dati allergeni CARTA (ALLERGENI_DATA) recuperati live da menu-allergeni.html. null = non disponibile.
var _allergeniCartaLive = null;

// Normalizza la lista allergeni di un piatto (array da carta | stringa "a, b" da dolci) -> array canonico IT.
function _normAllergeni(raw) {
  var arr = Array.isArray(raw) ? raw : (typeof raw === 'string' ? raw.split(',') : []);
  return arr.map(function(x) {
    var k = String(x).trim().toLowerCase();
    return ALLERGENI_VARIANTI[k] || k;
  }).filter(function(x){ return x; });
}
// Traduce un allergene canonico nella lingua; fallback = termine originale (non perdere info).
function _trAllergene(canon, lang) {
  var d = ALLERGENI_DIZIONARIO[canon];
  return (d && d[lang]) || canon;
}
// Costruisce la pagina allergeni (carta + dolci) tradotta per la lingua. Ritorna oggetto o null.
function costruisciAllergeniPerCarta(lang) {
  var T = ALLERGENI_TESTI[lang];
  if (!T) return null;
  var dynPiatti = (TRANSLATIONS[lang] && TRANSLATIONS[lang].piatti) || {};
  var dynSez    = (TRANSLATIONS[lang] && TRANSLATIONS[lang].sezioni) || {};
  function trNome(n) { var c = String(n).replace(/<[^>]+>/g, ''); return dynPiatti[c] || dynPiatti[n] || c; }
  function trSez(t)  { return dynSez[t] || t; }
  var sezioni = [];
  // 1) CARTA (da menu-allergeni.html)
  if (_allergeniCartaLive && _allergeniCartaLive.sezioni) {
    _allergeniCartaLive.sezioni.forEach(function(sez) {
      sezioni.push({
        titolo_display: trSez(sez.titolo),
        piatti: (sez.piatti || []).map(function(p) {
          return { nome: trNome(p.nome), allergeni: _normAllergeni(p.allergeni).map(function(a){ return _trAllergene(a, lang); }) };
        })
      });
    });
  }
  // 2) DOLCI (da menu-dolci.html, campo MENU.allergeni)
  var dolciAll = (_dolciCartaLive && _dolciCartaLive.allergeni) ||
                 (typeof MENU_DOLCI_IT !== 'undefined' && MENU_DOLCI_IT && MENU_DOLCI_IT.allergeni) || null;
  if (dolciAll && dolciAll.length) {
    sezioni.push({
      titolo_display: (typeof TRADUZIONI_DOLCI !== 'undefined' && TRADUZIONI_DOLCI[lang] && TRADUZIONI_DOLCI[lang].sezione) || T.dolciTitolo,
      piatti: dolciAll.map(function(p) {
        return { nome: trNome(p.nome), allergeni: _normAllergeni(p.allergeni).map(function(a){ return _trAllergene(a, lang); }) };
      })
    });
  }
  if (!sezioni.length) return null;
  return {
    header: T.header,
    nota: T.nota,
    vuoto: T.vuoto,
    legendaTitolo: T.legendaTitolo,
    legenda: ALLERGENI_14.map(function(a){ return _trAllergene(a, lang); }),
    sezioni: sezioni
  };
}

// ── F0.21-d: sezione dolci + pagina, tradotta, da accorpare alla CARTA in lingua (solo EN/FR).
//    Fonte dolci: _dolciCartaLive (live) con fallback su MENU_DOLCI_IT.
//    Traduzione piatti: dizionario dinamico DeepL TRANSLATIONS[lang].piatti, fallback statico TRADUZIONI_DOLCI[lang].
//    Allergeni dolci NON portati in carta (la carta non li renderizza): gap noto -> task Allergeni dedicato.
//    Ritorna { sezioni:[...], pagine:[...] } oppure null.
function costruisciDolciPerCarta(lang) {
  var srcDolci = _dolciCartaLive || (typeof MENU_DOLCI_IT !== 'undefined' ? MENU_DOLCI_IT : null);
  if (!srcDolci || !srcDolci.sezioni) return null;
  var d = JSON.parse(JSON.stringify(srcDolci));
  var tStatic = (typeof TRADUZIONI_DOLCI !== 'undefined' && TRADUZIONI_DOLCI[lang]) || {};
  var staticPiatti = tStatic.piatti || {};
  var dynPiatti = (TRANSLATIONS[lang] && TRANSLATIONS[lang].piatti) || {};
  function trad(n) { return dynPiatti[n] || staticPiatti[n] || n; }
  d.sezioni.forEach(function(sez) {
    sez.titolo_display = dynPiatti[sez.titolo] || tStatic.sezione || staticPiatti[sez.titolo] || sez.titolo;
    sez.piatti.forEach(function(p) {
      if (!p) return;
      p.nome = trad(p.nome);
      if (p.descrizione) p.descrizione = trad(p.descrizione);
    });
  });
  var pagine = (d.pagine && d.pagine.length)
    ? d.pagine
    : [{ sezioni: d.sezioni.map(function(s){ return s.titolo; }) }];
  return { sezioni: d.sezioni, pagine: pagine };
}

function costruisciMenuDolciTradotto(lang) {
  var m = JSON.parse(JSON.stringify(leggi())); // usa i dati aggiornati dal form
  var tStatic = TRADUZIONI_DOLCI[lang] || {};
  // Usa il dizionario dinamico (aggiornato da traduciEPubblica) come fonte primaria
  var piatti = (TRANSLATIONS[lang] && TRANSLATIONS[lang]['piatti']) || {};

  // Titolo sezione
  m.sezioni.forEach(function(sez) {
    sez.titolo_display = piatti[sez.titolo] || tStatic.sezione || sez.titolo;
    sez.piatti.forEach(function(p) {
      p.nome = piatti[p.nome] || p.nome;
      if (p.descrizione) p.descrizione = piatti[p.descrizione] || p.descrizione;
    });
  });

  // Allergeni — nome piatto e lista allergeni tradotti
  if (m.allergeni) {
    m.allergeni.forEach(function(a) {
      a.nome      = piatti[a.nome]      || a.nome;
      a.allergeni = piatti[a.allergeni] || a.allergeni;
    });
  }
  return m;
}

function filesDolci() {
  // F0.21-d: i dolci in lingua sono ora ACCORPATI nella carta (menu-en/fr.html li includono come pagina finale).
  // Qui si genera SOLO l'IT (menu-dolci.html), che resta stampato. menu-dolci-en/fr.html NON piu generati
  // (vecchi URL gestiti da redirect 301 in _redirects). costruisciMenuDolciTradotto resta definita per eventuale uso futuro.
  // Come la carta: file pubblico (menu-dolci.html, senza barra) + file admin/preview
  // (menu-dolci-it.html, con barra Stampa + pulsanti dimensione, noindex).
  var pub = outputCorrente;
  var adm = outputCorrente
    .replace('<body>', '<body>\n' + _dolciCtrlBar())
    .replace('<meta name="robots" content="index, follow">', '<meta name="robots" content="noindex, nofollow">');
  return [
    { path: 'menu-dolci.html',    content: pub, label: 'Dolci IT (pubblico)' },
    { path: 'menu-dolci-it.html', content: adm, label: 'Dolci IT (admin/preview)' }
  ];
}

function traduciEPubblica() {
  if (tipoMenuCorrente === 'allergeni') { traduciEPubblicaAllergeni(); return; }
  if (!dati) { alert('Prima carica il menù'); return; }
  if (!_assicuraDeepLKey('traduciEPubblica')) return;
  var btn = document.getElementById('btn-pubblica');
  var m = leggi();
  var testi = [];
  if (m.degustazione) {
    var key6;
    if (m.degustazione.percorsi && typeof m.degustazione.percorsi === 'object') {
      key6 = Object.keys(m.degustazione.percorsi).find(function(k) { 
        return Array.isArray(m.degustazione.percorsi[k]); 
      });
    }
    if (key6) {
      m.degustazione.percorsi[key6].forEach(function(p) { if (p.nome) testi.push(p.nome); });
    }
  }
  m.sezioni.forEach(function(sez) {
    if (sez.titolo) testi.push(sez.titolo);
    sez.piatti.forEach(function(p) {
      if (p.nome) testi.push(p.nome);
      if (p.descrizione) testi.push(p.descrizione);
    });
  });
  if (m.allergeni) {
    m.allergeni.forEach(function(a) {
      if (a.nome) testi.push(a.nome);
      if (a.allergeni) testi.push(a.allergeni);
    });
  }
  function _avvia() {
  testi = testi.filter(function(v, i, a) { return v && a.indexOf(v) === i; });

  var langs = ['en', 'fr'];
  var langPair = { en: 'it-IT|en-GB', fr: 'it-IT|fr-FR' };
  var coda = [];
  testi.forEach(function(testo) {
    langs.forEach(function(lang) { coda.push({ testo: testo, lang: lang }); });
  });
  var totale = coda.length;
  var falliti = []; // {testo, lang, errorMsg}
  btn.textContent = '⏳ Traduzione 0/' + totale + '…';
  btn.disabled = true;

  function traduciVoce(i) {
    if (i >= coda.length) {
      // Report finale traduzioni fallite (utile per diagnosticare quota/network/proxy down)
      if (falliti.length > 0) {
        var primi = falliti.slice(0, 5).map(function(f) {
          return '• [' + f.lang.toUpperCase() + '] "' + f.testo.slice(0, 40) + (f.testo.length > 40 ? '…' : '') + '" — ' + (f.errorMsg || 'errore');
        }).join('\n');
        var resto = falliti.length > 5 ? '\n…e altre ' + (falliti.length - 5) : '';
        var ok = confirm(
          'Traduzioni fallite: ' + falliti.length + '/' + totale + '\n\n' +
          primi + resto + '\n\n' +
          'Pubblicare comunque? (le voci non tradotte resteranno in italiano nei file lingua)'
        );
        if (!ok) {
          btn.textContent = '✶ Traduci e Pubblica';
          btn.disabled = false;
          return;
        }
      }
      btn.textContent = '⏳ Pubblicazione…';
      var token = localStorage.getItem('gh_token') || '';
      if (token) {
        eseguiPubblicazione(token);
      } else {
        document.getElementById('token-input').value = '';
        document.getElementById('modal-token').classList.add('on');
      }
      btn.textContent = '✶ Traduci e Pubblica';
      btn.disabled = false;
      return;
    }
    var item = coda[i];
    btn.textContent = '⏳ Traduzione ' + (i+1) + '/' + totale + '…';
    chiamaDeepL(item.testo, item.lang)
      .then(function(res) {
        if (res.authError) {
          btn.textContent = '✶ Traduci e Pubblica';
          btn.disabled = false;
          alert('Errore proxy DeepL: ' + (res.errorMsg || 'chiave non valida lato server') +
                '\n\nVerifica che la env variable DEEPL_KEY sia configurata su Vercel.');
          return;
        }
        if (res.trad) TRANSLATIONS[item.lang]['piatti'][item.testo] = res.trad;
        else falliti.push({ testo: item.testo, lang: item.lang, errorMsg: res.errorMsg });
        setTimeout(function() { traduciVoce(i + 1); }, 80);
      });
  }
  traduciVoce(0);
  }
  // F0.21-d: per la CARTA, prima della traduzione recupera i dolci LIVE e accoda i loro piatti
  // alla coda DeepL, cosi la sezione dolci accorpata nella carta in lingua e sempre fresca. IT non coinvolto.
  if (tipoMenuCorrente === 'carta') {
    // F0.21-d/e: per la CARTA recupera LIVE dolci + allergeni, poi avvia traduzione/pubblicazione.
    var _nc = function(){ return '?nocache=' + Date.now() + '_' + Math.random().toString(36).slice(2); };
    var pDolci = fetch(DOLCI_URL + _nc(), { cache: 'no-store' })
      .then(function(r) { return r.ok ? r.text() : Promise.reject(new Error('HTTP ' + r.status)); })
      .then(function(src) {
        _dolciCartaLive = _estraiMenu(src);
        if (_dolciCartaLive && _dolciCartaLive.sezioni) {
          _dolciCartaLive.sezioni.forEach(function(sez) {
            sez.piatti.forEach(function(p) {
              if (p && p.nome) testi.push(p.nome);
              if (p && p.descrizione) testi.push(p.descrizione);
            });
          });
        }
      })
      .catch(function(ex) { _dolciCartaLive = null; console.warn('[Dolci] fetch live fallito, fallback statico: ' + ex.message); });
    var pAll = fetch(ALLERGENI_URL + _nc(), { cache: 'no-store' })
      .then(function(r) { return r.ok ? r.text() : Promise.reject(new Error('HTTP ' + r.status)); })
      .then(function(src) {
        try {
          var START = 'const ALLERGENI_DATA = ';
          var SEP = '/* ' + '\u2550'.repeat(57) + ' */';
          var i1 = src.indexOf(START), i2 = src.indexOf(SEP, i1);
          if (i1 >= 0 && i2 > i1) {
            _allergeniCartaLive = _parseDataBlock(src.slice(i1, i2).trim(), 'ALLERGENI_DATA');
            // nomi piatti allergeni carta -> coda DeepL (combaciano coi piatti carta, ma per sicurezza)
            if (_allergeniCartaLive && _allergeniCartaLive.sezioni) {
              _allergeniCartaLive.sezioni.forEach(function(sez) {
                (sez.piatti||[]).forEach(function(p){ if (p && p.nome) testi.push(String(p.nome).replace(/<[^>]+>/g,'')); });
              });
            }
          } else { _allergeniCartaLive = null; }
        } catch(e) { _allergeniCartaLive = null; console.warn('[Allergeni] parse fallito: ' + e.message); }
      })
      .catch(function(ex) { _allergeniCartaLive = null; console.warn('[Allergeni] fetch live fallito: ' + ex.message); });
    Promise.all([pDolci, pAll]).then(_avvia);
  } else {
    _avvia();
  }
}


function toast(msg) {
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('on');
  setTimeout(function(){ t.classList.remove('on'); }, 3000);
}

// ═══════════════════════════════════════════════════════
// MENU ALLERGENI — funzioni admin
// ═══════════════════════════════════════════════════════

var ALLERGENI_URL  = BASE_FETCH_URL + '/menu-allergeni.html';
var ALLERGENI_PATH = 'menu-allergeni.html';
var datiAllergeni    = null;   // { sezioni: [...] } estratto da ALLERGENI_DATA
var tplAllBefore     = '';
var tplAllAfter      = '';
var datiMenuPerAllergeni = null; // copia di dati (MENU) per ricavare i piatti

var TUTTI_ALLERGENI = [
  'glutine','crostacei','uova','pesce','arachidi',
  'soia','latte','frutta a guscio','sedano',
  'senape','sesamo','solfiti','lupini','molluschi'
];

// ── Carica menu-allergeni.html dal sito ────────────────
function caricaAllergeniDalSito() {
  toast('\u23f3 Caricamento allergeni...');
  fetch(ALLERGENI_URL + '?nocache=' + Date.now(), { cache: 'no-store' })
    .then(function(r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.text();
    })
    .then(function(src) {
      analizzaAllergeni(src);
      // Serve anche il menu carta per ricavare lista piatti aggiornata
      // Se dati (menu carta) già caricato usiamo quello, altrimenti lo fetch
      if (dati && dati.sezioni) {
        datiMenuPerAllergeni = dati;
        costruisciFormAllergeni();
        toast('\u2713 Allergeni caricati');
      } else {
        fetch(MENU_URL + '?nocache=' + Date.now(), { cache: 'no-store' })
          .then(function(r2) { return r2.text(); })
          .then(function(src2) {
            try {
              analizza(src2);
              datiMenuPerAllergeni = dati;
            } catch(e) {}
            costruisciFormAllergeni();
            toast('\u2713 Allergeni caricati');
          })
          .catch(function() {
            // fallback: usa solo datiAllergeni senza aggiornare i piatti
            costruisciFormAllergeni();
            toast('\u2713 Allergeni caricati (menu non aggiornato)');
          });
      }
    })
    .catch(function(e) { toast('\u2717 Errore: ' + e); });
}

// ── Estrae ALLERGENI_DATA dal sorgente ────────────────
function analizzaAllergeni(src) {
  var START = 'const ALLERGENI_DATA = ';
  var SEP   = '/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */';
  var i1 = src.indexOf(START);
  if (i1 < 0) throw new Error('ALLERGENI_DATA non trovato');
  var i2 = src.indexOf(SEP, i1);
  if (i2 < 0) throw new Error('Fine blocco allergeni non trovata');
  var i2end = src.indexOf('\n', i2) + 1;

  var js = src.slice(i1, i2).trim();
  datiAllergeni = _parseDataBlock(js, 'ALLERGENI_DATA');

  tplAllBefore = src.slice(0, i1);
  tplAllAfter  = src.slice(i2end);
}

// ── Costruisce il form di editing allergeni ────────────
function costruisciFormAllergeni() {
  tipoMenuCorrente = 'allergeni';
  document.getElementById('intro').style.display = 'none';
  document.getElementById('wrap').classList.add('on');

  // Sincronizza i piatti del menu carta → struttura allergeni
  // Mantiene gli allergeni già salvati per piatti che esistono ancora
  if (datiMenuPerAllergeni && datiMenuPerAllergeni.sezioni) {
    var sezioniMenu = datiMenuPerAllergeni.sezioni;
    var mapExisting = {}; // nome piatto → allergeni[]
    if (datiAllergeni && datiAllergeni.sezioni) {
      datiAllergeni.sezioni.forEach(function(s) {
        s.piatti.forEach(function(p) {
          mapExisting[p.nome] = p.allergeni || [];
        });
      });
    }
    // Ricostruisce datiAllergeni dai piatti del menu carta (esclude Crudi)
    var sezioniAllergeni = [];
    sezioniMenu.forEach(function(sez) {
      if (sez.titolo === 'Crudi') return; // Crudi senza allergeni
      var piatti = sez.piatti.map(function(p) {
        // Ripulisce il nome dal tag <em>
        var nomeClean = p.nome.replace(/<[^>]+>/g, '');
        return {
          nome: nomeClean,
          allergeni: mapExisting[nomeClean] || []
        };
      });
      sezioniAllergeni.push({
        titolo: sez.titolo_display || sez.titolo,
        piatti: piatti
      });
    });
    datiAllergeni = { sezioni: sezioniAllergeni };
  }

  var wrap = document.getElementById('wrap');
  wrap.innerHTML = '';

  var intro = document.createElement('div');
  intro.className = 'fs';
  var head = document.createElement('div');
  head.className = 'fs-head';
  head.textContent = 'Allergeni — Menù alla Carta';
  intro.appendChild(head);
  var body = document.createElement('div');
  body.className = 'fs-body';

  // Nota
  var nota = document.createElement('div');
  nota.className = 'sub';
  nota.innerHTML = 'Spunta gli allergeni presenti in ciascun piatto. I piatti della sezione Crudi non vengono inclusi.';
  nota.style.cssText = 'margin-bottom:.8rem;font-style:italic;color:var(--stone)';
  body.appendChild(nota);

  datiAllergeni.sezioni.forEach(function(sez, si) {
    var sezBlock = document.createElement('div');
    sezBlock.style.cssText = 'margin-bottom:1.2rem';

    var sezTit = document.createElement('div');
    sezTit.className = 'sub';
    sezTit.textContent = sez.titolo;
    sezTit.style.cssText = 'font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;font-weight:600;margin-bottom:.5rem;padding-bottom:.3rem;border-bottom:1px solid var(--rule)';
    sezBlock.appendChild(sezTit);

    sez.piatti.forEach(function(piatto, pi) {
      var pBlock = document.createElement('div');
      pBlock.style.cssText = 'padding:.6rem 0;border-bottom:1px dotted var(--rule)';

      var pNome = document.createElement('div');
      pNome.style.cssText = 'font-size:.85rem;font-weight:600;margin-bottom:.4rem';
      pNome.textContent = piatto.nome;
      pBlock.appendChild(pNome);

      var checkGrid = document.createElement('div');
      checkGrid.style.cssText = 'display:flex;flex-wrap:wrap;gap:.3rem .6rem';

      TUTTI_ALLERGENI.forEach(function(all) {
        var id = 'all_' + si + '_' + pi + '_' + all.replace(/\s+/g, '_');
        var label = document.createElement('label');
        label.style.cssText = 'display:flex;align-items:center;gap:.25rem;font-family:Jost,sans-serif;font-size:.68rem;letter-spacing:.04em;cursor:pointer;padding:.2rem .4rem;border:1px solid var(--rule);border-radius:2px;transition:background .15s';
        var chkEl = document.createElement('input');
        chkEl.type = 'checkbox';
        chkEl.id = id;
        chkEl.checked = (piatto.allergeni || []).indexOf(all) >= 0;
        chkEl.style.cssText = 'cursor:pointer;accent-color:var(--ink)';
        chkEl.onchange = function() {
          label.style.background = this.checked ? 'var(--ink)' : '';
          label.style.color = this.checked ? 'var(--cream)' : '';
          label.style.borderColor = this.checked ? 'var(--ink)' : 'var(--rule)';
        };
        // Applica stile iniziale se già checked
        if (chkEl.checked) {
          label.style.background = 'var(--ink)';
          label.style.color = 'var(--cream)';
          label.style.borderColor = 'var(--ink)';
        }
        var span = document.createElement('span');
        span.textContent = all;
        label.appendChild(chkEl);
        label.appendChild(span);
        checkGrid.appendChild(label);
      });

      pBlock.appendChild(checkGrid);
      sezBlock.appendChild(pBlock);
    });

    body.appendChild(sezBlock);
  });

  intro.appendChild(body);
  wrap.appendChild(intro);
}

// ── Legge il form e restituisce ALLERGENI_DATA aggiornato ─
function leggiFormAllergeni() {
  if (!datiAllergeni) return null;
  var m = JSON.parse(JSON.stringify(datiAllergeni));
  m.sezioni.forEach(function(sez, si) {
    sez.piatti.forEach(function(piatto, pi) {
      piatto.allergeni = [];
      TUTTI_ALLERGENI.forEach(function(all) {
        var id = 'all_' + si + '_' + pi + '_' + all.replace(/\s+/g, '_');
        var el = document.getElementById(id);
        if (el && el.checked) piatto.allergeni.push(all);
      });
    });
  });
  return m;
}

// ── Costruisce l'HTML del file allergeni ──────────────
function costruisciOutputAllergeni() {
  var m = leggiFormAllergeni();
  if (!m) return '';
  var SEP = '/* \u2550'.repeat(1) + '\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */\n';
  var blocco = 'const ALLERGENI_DATA = ' + JSON.stringify(m, null, 2) + ';\n' + SEP;
  return tplAllBefore + blocco + tplAllAfter;
}

// ── Preview allergeni ──────────────────────────────────
function apriPreviewAllergeni() {
  var html = costruisciOutputAllergeni();
  if (!html) { toast('\u2717 Nessun dato allergeni'); return; }
  var blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  window.open(URL.createObjectURL(blob), '_blank').focus();
}

// ── Pubblica allergeni su GitHub ───────────────────────
function pubblicaAllergeni(token) {
  var html = costruisciOutputAllergeni();
  if (!html) { toast('\u2717 Nessun dato'); return; }
  var headers = {
    'Authorization': 'token ' + token,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json'
  };
  var apiBase = 'https://api.github.com/repos/' + REPO_OWNER + '/' + REPO_NAME + '/contents/' + ALLERGENI_PATH;
  toast('\u23f3 Pubblicazione allergeni...');
  fetch(apiBase, { headers: headers })
    .then(function(r) { return r.json(); })
    .then(function(d) {
      var body = {
        message: 'Aggiornamento allergeni v2026.04.17',
        content: btoa(unescape(encodeURIComponent(html)))
      };
      if (d.sha) body.sha = d.sha;
      return fetch(apiBase, { method: 'PUT', headers: headers, body: JSON.stringify(body) });
    })
    .then(function(r) {
      if (!r.ok) return r.json().then(function(e) { throw new Error(e.message); });
      toast('\u2713 Allergeni pubblicati!');
      var btn = document.getElementById('btn-pubblica');
      if (btn) { btn.textContent = '\u2756 Traduci e Pubblica'; btn.disabled = false; }
    })
    .catch(function(e) { toast('\u2717 Errore: ' + e.message); });
}

// ── Entry point pubblicazione allergeni ───────────────
function traduciEPubblicaAllergeni() {
  if (!datiAllergeni) { alert('Prima carica gli allergeni'); return; }
  var token = localStorage.getItem('gh_token') || '';
  if (token) {
    pubblicaAllergeni(token);
  } else {
    document.getElementById('token-input').value = '';
    document.getElementById('modal-token').classList.add('on');
    // Salva callback per dopo conferma token
    window._pendingAllergeniPublish = true;
  }
}


// ═══════════════════════════════════════════════════════
// MENU VINI — funzioni admin
// ═══════════════════════════════════════════════════════

var VINI_PATH = 'menu-vini.html';
var VINI_URL  = BASE_FETCH_URL + '/menu-vini.html';
var _viniPrint = { fs: 1, lh: 1, gap: 1 };   // default = dimensioni attuali
function _viniStyleAttr() {
  var p = _viniPrint;
  if (p.fs === 1 && p.lh === 1 && p.gap === 1) return '';
  return ' style="--fs:' + p.fs + ';--lh:' + p.lh + ';--gap:' + p.gap + '"';
}
function _viniMontaPannello() {
  var vs = document.getElementById('vini-section');
  if (!vs || document.getElementById('vini-print-panel')) return;
  var box = el('div','fs'); box.id = 'vini-print-panel'; box.style.marginBottom = '1.5rem';
  box.appendChild(el('div','fs-head','Impostazioni stampa carta vini'));
  var body = el('div','fs-body');
  var ctrls = [];
  function slider(label, key, mn, mx, st){
    var lab = el('div','', label); lab.style.cssText = 'font-size:.72rem;color:var(--stone);margin-bottom:.2rem';
    var row = el('div'); row.style.cssText = 'display:flex;align-items:center;gap:1rem;margin-bottom:.9rem';
    var rng = document.createElement('input'); rng.type='range'; rng.min=mn; rng.max=mx; rng.step=st; rng.value=_viniPrint[key];
    rng.style.cssText = 'flex:1;min-width:200px';
    var out = el('span','', Math.round(_viniPrint[key]*100)+'%'); out.style.cssText = 'font-weight:500;min-width:60px;text-align:right';
    rng.addEventListener('input', function(){ _viniPrint[key] = +rng.value; out.textContent = Math.round(rng.value*100)+'%'; });
    row.appendChild(rng); row.appendChild(out); body.appendChild(lab); body.appendChild(row);
    ctrls.push({ rng: rng, out: out, key: key });
  }
  slider('Dimensione caratteri', 'fs', '0.8', '1.4', '0.05');
  slider('Interlinea (spazio tra le righe)', 'lh', '0.8', '1.5', '0.05');
  slider('Spazio tra le voci', 'gap', '0.6', '1.6', '0.05');
  var rb = document.createElement('button'); rb.type='button'; rb.textContent = '↺ Ripristina valori predefiniti';
  rb.style.cssText = "margin:.2rem 0 .6rem;padding:.4rem 1rem;background:transparent;border:1px solid var(--ink);font-family:'Jost',sans-serif;font-size:.68rem;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;color:var(--ink)";
  rb.addEventListener('click', function(){ ctrls.forEach(function(c){ _viniPrint[c.key]=1; c.rng.value=1; c.out.textContent='100%'; }); });
  body.appendChild(rb);
  var hint = el('div','', 'Valgono per la carta vini stampata (100% = base). Si applicano alla prossima Converti e Pubblica.');
  hint.style.cssText = 'font-size:.72rem;color:var(--stone);margin-top:.2rem;line-height:1.5';
  body.appendChild(hint);
  box.appendChild(body);
  vs.insertBefore(box, vs.firstChild);
}

function apriSezioneVini() {
  document.getElementById('carica-menu').classList.remove('open');
  document.getElementById('intro').style.display = 'none';
  _pulisciViste();
  var vs = document.getElementById('vini-section');
  if (vs) vs.style.display = 'block';
}

function chiudiSezioneVini() {
  var vs = document.getElementById('vini-section');
  if (vs) vs.style.display = 'none';
  if (!document.getElementById('wrap').classList.contains('on')) {
    document.getElementById('intro').style.display = '';
  }
}

function convertiEPubblicaVini() {
  var fileInput = document.getElementById('vini-pdf-input');
  var file = fileInput && fileInput.files[0];
  if (!file) { alert('Seleziona un file PDF'); return; }
  var statusEl = document.getElementById('vini-status');
  statusEl.style.color = 'var(--stone)';
  statusEl.textContent = '⏳ Caricamento PDF.js…';

  function avviaConversione() {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    _leggiEConvertiVini(file, statusEl);
  }

  if (typeof pdfjsLib === 'undefined') {
    var s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    s.onload = avviaConversione;
    s.onerror = function() { statusEl.textContent = '✗ Impossibile caricare PDF.js'; };
    document.head.appendChild(s);
  } else {
    avviaConversione();
  }
}

async function _leggiEConvertiVini(file, statusEl) {
  try {
    var ab = await file.arrayBuffer();
    var pdf = await pdfjsLib.getDocument({ data: ab }).promise;
    var SCALE = 2.2;                       // ~150 dpi: nitido in stampa, peso contenuto
    var imgs = [];
    for (var i = 1; i <= pdf.numPages; i++) {
      statusEl.textContent = '⏳ Rendering pagina ' + i + ' / ' + pdf.numPages + '…';
      var page = await pdf.getPage(i);
      var viewport = page.getViewport({ scale: SCALE });
      var canvas = document.createElement('canvas');
      canvas.width = Math.round(viewport.width);
      canvas.height = Math.round(viewport.height);
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: ctx, viewport: viewport }).promise;
      imgs.push(canvas.toDataURL('image/jpeg', 0.92));
    }

    statusEl.textContent = '⏳ Generazione HTML…';
    var html = _generaHtmlViniImmagini(imgs);

    // Preview
    var blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    window.open(URL.createObjectURL(blob), '_blank');

    // Pubblica
    var token = localStorage.getItem('gh_token') || '';
    if (token) {
      _pubblicaMenuVini(token, html, statusEl);
    } else {
      window._pendingViniHtml = html;
      window._pendingViniPublish = true;
      document.getElementById('token-input').value = '';
      document.getElementById('modal-token').classList.add('on');
    }
  } catch(e) {
    statusEl.style.color = 'var(--rust)';
    statusEl.textContent = '✗ Errore: ' + e.message;
  }
}

// Carta vini = immagini fedeli del PDF (1 pagina PDF = 1 foglio A4). Copertina inclusa.
function _generaHtmlViniImmagini(imgs) {
  var now = new Date();
  var ver = 'v ' + now.getFullYear() + '.' + String(now.getMonth()+1).padStart(2,'0') + '.' +
    String(now.getDate()).padStart(2,'0') + '.01';
  var pages = imgs.map(function(src, i){
    return '<div class="pg"><img src="' + src + '" alt="Carta dei vini Santamonica — pagina ' + (i+1) + '"/></div>';
  }).join('\n');
  return [
    '<!DOCTYPE html>',
    '<!-- ' + ver + ' -->',
    '<html lang="it"><head>',
    '<meta charset="UTF-8"/>',
    '<meta name="viewport" content="width=device-width,initial-scale=1.0"/>',
    '<title>Carta dei Vini | Ristorante Santamonica Genova</title>',
    '<meta name="description" content="La carta dei vini del ristorante Santamonica a Genova: bollicine e Champagne, bianchi liguri e cantine da tutta Italia. Selezione della sommelier Monica Capurro."/>',
    '<style>',
    '*{margin:0;padding:0;box-sizing:border-box;}',
    'body{background:#3a3a3a;padding:12px 0;}',
    '.pg{width:210mm;max-width:96%;margin:0 auto 10px;background:#fff;box-shadow:0 2px 16px rgba(0,0,0,.35);}',
    '.pg img{display:block;width:100%;height:auto;}',
    '.ver{text-align:center;color:#bbb;font-family:sans-serif;font-size:10px;letter-spacing:.1em;padding:6px 0 2px;}',
    '@media print{',
    '  @page{size:A4 portrait;margin:0;}',
    '  body{background:#fff;padding:0;}',
    '  .pg{width:210mm;height:297mm;max-width:none;margin:0;box-shadow:none;page-break-after:always;overflow:hidden;display:flex;align-items:center;justify-content:center;}',
    '  .pg:last-child{page-break-after:avoid;}',
    '  .pg img{width:210mm;height:297mm;object-fit:contain;}',
    '  .ver{display:none;}',
    '}',
    '</style>',
    '</head><body>',
    pages,
    '<div class="ver">' + ver + '</div>',
    '</body></html>'
  ].join('\n');
}

function _ricostruisciPagina(items) {
  var righe = [], TOL = 3;
  items.forEach(function(it) {
    if (!it.str || !it.str.trim()) return;
    var y = it.transform[5], x = it.transform[4];
    var riga = righe.find(function(r) { return Math.abs(r.y - y) < TOL; });
    if (riga) { riga.items.push({ x: x, t: it.str }); }
    else       { righe.push({ y: y, items: [{ x: x, t: it.str }] }); }
  });
  righe.sort(function(a, b) { return b.y - a.y; });
  return righe.map(function(r) {
    r.items.sort(function(a, b) { return a.x - b.x; });
    return r.items.map(function(i) { return i.t; }).join(' ').trim();
  }).filter(Boolean);
}

function _esc(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function _generaHtmlVini(pagine) {
  // Salta pagina 1 (copertina)
  var linee = [];
  for (var p = 1; p < pagine.length; p++) {
    pagine[p].forEach(function(l) { linee.push(l); });
    linee.push('---PAGINA---');
  }

  var content = '';
  var inPagina = false;
  linee.forEach(function(linea) {
    if (linea === '---PAGINA---') { return; }
    var t = linea.trim();
    if (!t) return;

    // Rimuovi simboli bottiglia/calice (font custom del PDF)
    t = t.replace(/[\u0000-\u001F\u0080-\u009F]/g, '');
    // Normalizza simboli comuni
    t = t.replace(/\u25ba/g, '').replace(/\u03aa/g, '').trim();
    if (!t) return;

    var isGrandeSez = /^[A-ZÀÈÌÒÙÉËÏ\s\-\/]{4,}$/.test(t) && t.length < 40 && t.length > 3;
    var isSottosez  = /^[A-ZÀÈÌÒÙÉËÏ\s\-\/\(\)0-9]{3,}$/.test(t) && t.length < 35 && !t.match(/[€°\.]/);

    if (isGrandeSez && t.length < 20) {
      content += '<h2 class="sez-titolo">' + _esc(t) + '</h2>\n';
    } else if (isSottosez && t.length < 30) {
      content += '<h3 class="sottosez-titolo">' + _esc(t) + '</h3>\n';
    } else {
      content += '<p class="vino">' + _esc(t) + '</p>\n';
    }
  });

  var now = new Date();
  var ver = 'v ' + now.getFullYear() + '.' +
    String(now.getMonth()+1).padStart(2,'0') + '.' +
    String(now.getDate()).padStart(2,'0') + '.01';

  return _VINI_TPL.replace('{{CONTENT}}', content).replace('{{VINISTYLE}}', _viniStyleAttr()).replace(/\{\{VER\}\}/g, ver);
}

var _VINI_TPL = '<!DOCTYPE html>\n<!-- {{VER}} -->\n<html lang="it">\n<head>\n<meta charset="UTF-8"/>\n<meta name="viewport" content="width=device-width,initial-scale=1.0"/>\n<title>Carta dei Vini | Ristorante Santamonica Genova</title>\n<meta name="description" content="La carta dei vini del Santamonica a Genova: bollicine e Champagne, bianchi liguri, cantine da tutta Italia. Selezione della sommelier Monica Capurro."/>\n<link rel="preconnect" href="https://fonts.googleapis.com"/>\n<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet"/>\n<style>\n:root{--cream:#faf7f2;--ink:#1a1714;--stone:#8c7e6e;--rust:#9e4a2a;--rule:#d4c9b8;}\n@media (max-width:640px){.pg{width:auto!important;max-width:100%!important;min-height:0!important;margin:0!important;padding:26px 16px!important;box-shadow:none!important;}.logo{font-size:1.9rem!important;letter-spacing:.1em!important;}.logo-sub{font-size:.6rem!important;}.lista-titolo{font-size:1.05rem!important;letter-spacing:.12em!important;}.sez-titolo{font-size:1.3rem!important;letter-spacing:.08em!important;}.sommelier{font-size:.62rem!important;}html,body{overflow-x:hidden!important;}}\n*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}\nbody{background:var(--cream);color:var(--ink);font-family:\'Cormorant Garamond\',Georgia,serif;font-weight:400;}\n.pg{width:210mm;margin:2rem auto;padding:14mm 22mm 14mm;background:#fff;box-shadow:0 2px 24px rgba(0,0,0,.10);}\n.pg-header{text-align:center;margin-bottom:8mm;padding-bottom:5mm;border-bottom:1px solid var(--rule);}\n.logo{font-size:3.3rem;font-weight:300;letter-spacing:.22em;text-transform:uppercase;line-height:1;}\n.logo em{font-style:italic;color:var(--stone);}\n.logo-sub{margin-top:.45rem;font-family:\'Jost\',sans-serif;font-size:.67rem;letter-spacing:.22em;text-transform:uppercase;color:var(--stone);}\n.lista-titolo{font-size:calc(1.5rem*var(--fs,1));font-weight:600;letter-spacing:.22em;text-transform:uppercase;text-align:center;margin:4mm 0 1mm;}\n.sommelier{font-family:\'Jost\',sans-serif;font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;color:var(--stone);text-align:center;margin-bottom:6mm;}\n.sez-titolo{font-size:calc(1.98rem*var(--fs,1));font-weight:600;letter-spacing:.16em;text-transform:uppercase;text-align:center;margin:calc(7mm*var(--gap,1)) 0 calc(4mm*var(--gap,1));padding-bottom:2mm;border-bottom:1px solid var(--rule);}\n.sottosez-titolo{font-family:\'Jost\',sans-serif;font-size:calc(.72rem*var(--fs,1));letter-spacing:.18em;text-transform:uppercase;color:var(--stone);margin:calc(5mm*var(--gap,1)) 0 calc(3mm*var(--gap,1));}\n.vino{margin-bottom:calc(3.5mm*var(--gap,1));text-align:justify;text-align-last:justify;font-size:calc(1.0rem*var(--fs,1));line-height:calc(1.52*var(--lh,1));}\n.version{text-align:center;padding:6px 0;font-family:\'Jost\',sans-serif;font-size:.55rem;color:#888;letter-spacing:.1em;}\n@media print{@page{size:A4 portrait;margin:8mm;}body{background:white;}.pg{width:auto;margin:0;box-shadow:none;page-break-after:always;}}\n</style>\n</head>\n<body{{VINISTYLE}}>\n<div class="pg">\n<div class="pg-header"><div class="logo">Santa<em>monica</em></div><div class="logo-sub">Lungomare Lombardo 27 \u2014 Genova</div></div>\n<div class="lista-titolo">Lista Vini &mdash; Wine List</div>\n<div class="sommelier">Sommelier Professionista Monica Capurro</div>\n{{CONTENT}}\n</div>\n<div class="version">{{VER}}</div>\n</body>\n</html>';

function _pubblicaMenuVini(token, html, statusEl) {
  var headers = { 'Authorization':'token '+token, 'Accept':'application/vnd.github.v3+json', 'Content-Type':'application/json' };
  statusEl.style.color = 'var(--stone)';
  statusEl.textContent = '⏳ Pubblicazione menù vini…';
  pubblicaFile(token, headers, VINI_PATH, html)
    .then(function(r) {
      if (!r.ok) return r.json().then(function(e){ throw new Error(e.message); });
      statusEl.style.color = '#2d6a4f';
      statusEl.textContent = '✓ Menù vini pubblicato! Attendi ~90 secondi.';
      toast('\u2713 Men\u00f9 vini pubblicato!');
      window._pendingViniHtml = null;
    })
    .catch(function(e) {
      statusEl.style.color = 'var(--rust)';
      statusEl.textContent = '\u2717 Errore: ' + e.message;
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// DOCUMENTO GENERICO (PDF/DOCX/TXT → HTML stile carta) — v 2026.05.15.01
// Preview + Stampa + Download HTML locale. NO upload GitHub.
// ═══════════════════════════════════════════════════════════════════════════

function apriSezioneDocGenerico() {
  document.getElementById('carica-menu').classList.remove('open');
  document.getElementById('intro').style.display = 'none';
  _pulisciViste();
  var ds = document.getElementById('doc-section');        if (ds) ds.style.display = 'block';
  var st = document.getElementById('doc-generico-status');
  if (st) { st.textContent = ''; st.style.color = 'var(--stone)'; }
}

function chiudiSezioneDocGenerico() {
  var ds = document.getElementById('doc-section');
  if (ds) ds.style.display = 'none';
  if (!document.getElementById('wrap').classList.contains('on')) {
    document.getElementById('intro').style.display = '';
  }
}

function convertiDocGenerico() {
  var fileInput = document.getElementById('doc-generico-input');
  var file = fileInput && fileInput.files[0];
  var statusEl = document.getElementById('doc-generico-status');
  if (!file) { alert('Seleziona un file (PDF, DOCX o TXT)'); return; }
  statusEl.style.color = 'var(--stone)';
  var ext = (file.name.split('.').pop() || '').toLowerCase();

  var titoloInput = document.getElementById('doc-generico-titolo');
  var titolo = (titoloInput && titoloInput.value.trim()) || file.name.replace(/\.[^.]+$/, '');

  if (ext === 'pdf')   { _docGen_caricaLib('pdf',  function(){ _docGen_estraiPDF(file, statusEl, titolo);  }, statusEl); return; }
  if (ext === 'docx')  { _docGen_caricaLib('docx', function(){ _docGen_estraiDOCX(file, statusEl, titolo); }, statusEl); return; }
  if (ext === 'txt')   { _docGen_estraiTXT(file, statusEl, titolo); return; }
  statusEl.style.color = 'var(--rust)';
  statusEl.textContent = '✗ Formato non supportato: .' + ext;
}

function _docGen_caricaLib(tipo, onReady, statusEl) {
  if (tipo === 'pdf') {
    if (typeof pdfjsLib !== 'undefined') {
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      onReady(); return;
    }
    statusEl.textContent = '⏳ Caricamento PDF.js…';
    var s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    s.onload = function() {
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      onReady();
    };
    s.onerror = function() { statusEl.style.color = 'var(--rust)'; statusEl.textContent = '✗ Impossibile caricare PDF.js'; };
    document.head.appendChild(s);
  } else if (tipo === 'docx') {
    if (typeof mammoth !== 'undefined') { onReady(); return; }
    statusEl.textContent = '⏳ Caricamento Mammoth (DOCX)…';
    var m = document.createElement('script');
    m.src = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.7.0/mammoth.browser.min.js';
    m.onload = onReady;
    m.onerror = function() { statusEl.style.color = 'var(--rust)'; statusEl.textContent = '✗ Impossibile caricare Mammoth'; };
    document.head.appendChild(m);
  }
}

async function _docGen_estraiPDF(file, statusEl, titolo) {
  try {
    var ab = await file.arrayBuffer();
    var pdf = await pdfjsLib.getDocument({ data: ab }).promise;
    statusEl.textContent = '⏳ Estrazione testo (' + pdf.numPages + ' pagine)…';
    var paragrafi = [];
    for (var i = 1; i <= pdf.numPages; i++) {
      var page = await pdf.getPage(i);
      var tc = await page.getTextContent();
      var righe = {};
      tc.items.forEach(function(it) {
        var y = Math.round(it.transform[5]);
        righe[y] = (righe[y] || '') + it.str;
      });
      Object.keys(righe).sort(function(a,b){ return Number(b) - Number(a); }).forEach(function(y){
        var t = righe[y].replace(/\s+/g, ' ').trim();
        if (t) paragrafi.push('<p>' + _docGen_escape(t) + '</p>');
      });
      if (i < pdf.numPages) paragrafi.push('<div style="page-break-after:always"></div>');
    }
    _docGen_apriPreview(titolo, paragrafi.join('\n'), statusEl);
  } catch (e) {
    statusEl.style.color = 'var(--rust)';
    statusEl.textContent = '✗ Errore PDF: ' + e.message;
  }
}

async function _docGen_estraiDOCX(file, statusEl, titolo) {
  try {
    statusEl.textContent = '⏳ Conversione DOCX…';
    var ab = await file.arrayBuffer();
    var r = await mammoth.convertToHtml({ arrayBuffer: ab });
    _docGen_apriPreview(titolo, r.value, statusEl);
  } catch (e) {
    statusEl.style.color = 'var(--rust)';
    statusEl.textContent = '✗ Errore DOCX: ' + e.message;
  }
}

async function _docGen_estraiTXT(file, statusEl, titolo) {
  try {
    statusEl.textContent = '⏳ Lettura TXT…';
    var txt = await file.text();
    var corpo = txt.split(/\n\s*\n/).map(function(p) {
      return '<p>' + _docGen_escape(p).replace(/\n/g, '<br>') + '</p>';
    }).join('\n');
    _docGen_apriPreview(titolo, corpo, statusEl);
  } catch (e) {
    statusEl.style.color = 'var(--rust)';
    statusEl.textContent = '✗ Errore TXT: ' + e.message;
  }
}

function _docGen_escape(s) {
  return String(s).replace(/[&<>"']/g, function(c){
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];
  });
}

function _docGen_costruisciHTML(titolo, corpoHtml) {
  // Estrae il blocco <style> di CARTA_TPL_B per riusare font/colori/print del template carta
  var styleCarta = '';
  if (typeof CARTA_TPL_B === 'string') {
    var m = CARTA_TPL_B.match(/<style[^>]*>[\s\S]*?<\/style>/);
    if (m) styleCarta = m[0];
  }
  var titoloEsc = _docGen_escape(titolo);
  var nomeDownload = JSON.stringify(titolo.replace(/[^\w\s\-]/g, '_') + '.html');
  return [
    '<!DOCTYPE html>',
    '<html lang="it"><head>',
    '<meta charset="UTF-8">',
    '<meta name="viewport" content="width=device-width,initial-scale=1.0">',
    '<title>' + titoloEsc + '</title>',
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet">',
    styleCarta,
    '<style>',
    'body{background:var(--cream,#faf7f2);color:var(--ink,#1a1714);}',
    '.doc-toolbar{position:sticky;top:0;background:var(--ink,#1a1714);color:#fff;padding:.7rem 1.2rem;display:flex;gap:.6rem;z-index:1000;font-family:"Jost",sans-serif;}',
    '.doc-toolbar button{padding:.45rem 1.3rem;border:none;background:var(--rust,#9e4a2a);color:#fff;font-family:"Jost",sans-serif;font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;}',
    '.doc-toolbar button:hover{opacity:.85;}',
    '.doc-toolbar .btn-sec{background:transparent;border:1px solid #fff;}',
    '.doc-toolbar .align-grp{display:flex;gap:0;margin-left:auto;border:1px solid #fff;}',
    '.doc-toolbar .align-grp button{background:transparent;border:none;padding:.45rem .9rem;font-size:.65rem;letter-spacing:.1em;}',
    '.doc-toolbar .align-grp button.active{background:var(--stone,#8c7e6e);}',
    '.pg{width:210mm;margin:2rem auto;padding:18mm 22mm;background:#fff;box-shadow:0 2px 24px rgba(0,0,0,.10);min-height:260mm;box-sizing:border-box;}',
    '.pg.center-v{display:flex;flex-direction:column;justify-content:center;}',
    '.doc-corpo{font-family:"Cormorant Garamond",Georgia,serif;font-size:calc(1.05rem*var(--fs,1));line-height:calc(1.6*var(--lh,1));color:var(--ink,#1a1714);}',
    '.doc-corpo p{margin:0 0 calc(.7rem*var(--gap,1));}',
    '.doc-corpo.align-justify p{text-align:justify;}',
    '.doc-corpo.align-left p{text-align:left;}',
    '.doc-corpo.align-center p{text-align:center;}',
    '.doc-corpo h1,.doc-corpo h2,.doc-corpo h3{font-family:"Cormorant Garamond",Georgia,serif;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--ink,#1a1714);margin:1.4rem 0 .5rem;}',
    '.doc-corpo h1{font-size:1.5rem;}',
    '.doc-corpo h2{font-size:1.2rem;color:var(--stone,#8c7e6e);}',
    '.doc-corpo h3{font-size:1rem;color:var(--stone,#8c7e6e);}',
    '.doc-corpo ul,.doc-corpo ol{margin:.5rem 0 1rem 1.5rem;}',
    '.doc-corpo li{margin-bottom:.3rem;}',
    '.doc-corpo strong{font-weight:600;}',
    '.doc-corpo em{font-style:italic;color:var(--stone,#8c7e6e);}',
    '.doc-corpo img{max-width:100%;height:auto;display:block;margin:1rem auto;}',
    '.doc-corpo table{border-collapse:collapse;margin:1rem 0;width:100%;}',
    '.doc-corpo th,.doc-corpo td{border:1px solid var(--rule,#d4c9b8);padding:.4rem .6rem;text-align:left;font-size:.95rem;}',
    '.doc-corpo th{background:var(--sand,#f0ebe0);font-weight:600;}',
    '@media print{',
    '  @page{size:A4 portrait;margin:8mm;}',
    '  html{font-size:24px;}',
    '  body{background:#fff;}',
    '  .doc-toolbar{display:none;}',
    '  .pg{width:auto;margin:0;padding:10mm 14mm;box-shadow:none;page-break-after:always;}',
    '}',
    '</style>',
    '</head><body>',
    '<div class="doc-toolbar">',
    '  <button onclick="window.print()">🖨️ Stampa</button>',
    '  <button class="btn-sec" onclick="_docScaricaHTML()">💾 Scarica HTML</button>',
    '  <button class="btn-sec" onclick="window.close()">✕ Chiudi</button>',
    '  <div style="display:flex;gap:.3rem;">',
    '    <button class="btn-sec" onclick="_docVar(\'--fs\',0.05)" title="Caratteri più grandi">A+</button>',
    '    <button class="btn-sec" onclick="_docVar(\'--fs\',-0.05)" title="Caratteri più piccoli">A−</button>',
    '    <button class="btn-sec" onclick="_docVar(\'--lh\',0.1)" title="Interlinea +">↕+</button>',
    '    <button class="btn-sec" onclick="_docVar(\'--lh\',-0.1)" title="Interlinea −">↕−</button>',
    '    <button class="btn-sec" onclick="_docVar(\'--gap\',0.1)" title="Spazio tra paragrafi +">¶+</button>',
    '    <button class="btn-sec" onclick="_docVar(\'--gap\',-0.1)" title="Spazio tra paragrafi −">¶−</button>',
    '    <button class="btn-sec" onclick="_docResetVars()" title="Ripristina dimensioni">↺</button>',
    '  </div>',
    '  <div class="align-grp">',
    '    <button id="align-justify" class="active" onclick="_docAlign(\'justify\')" title="Giustificato">≡ Giust.</button>',
    '    <button id="align-left" onclick="_docAlign(\'left\')" title="Allinea a sinistra">⇤ Sx</button>',
    '    <button id="align-center" onclick="_docAlign(\'center\')" title="Allinea al centro">↔ Centro</button>',
    '    <button id="center-v" onclick="_docCenterV()" title="Centra verticalmente nella pagina">⇕ Centro V</button>',
    '  </div>',
    '</div>',
    '<div class="pg" id="doc-pg">',
    '  <div class="doc-corpo align-justify" id="doc-corpo">' + corpoHtml + '</div>',
    '</div>',
    '<script>',
    'function _docAlign(mode){',
    '  var c = document.getElementById("doc-corpo");',
    '  c.classList.remove("align-justify","align-left","align-center");',
    '  c.classList.add("align-" + mode);',
    '  ["justify","left","center"].forEach(function(m){',
    '    var b = document.getElementById("align-" + m);',
    '    if (b) b.classList.toggle("active", m === mode);',
    '  });',
    '}',
    'function _docCenterV(){',
    '  var pg = document.getElementById("doc-pg");',
    '  var btn = document.getElementById("center-v");',
    '  pg.classList.toggle("center-v");',
    '  btn.classList.toggle("active", pg.classList.contains("center-v"));',
    '}',
    'function _docScaricaHTML(){',
    '  var clone = document.documentElement.cloneNode(true);',
    '  var tb = clone.querySelector(".doc-toolbar"); if(tb){ tb.parentNode.removeChild(tb); }',
    '  var scs = clone.querySelectorAll("script"); for(var i=0;i<scs.length;i++){ scs[i].parentNode.removeChild(scs[i]); }',
    '  var html = "<!DOCTYPE html>\\n" + clone.outerHTML;',
    '  var blob = new Blob([html], {type:"text/html;charset=utf-8"});',
    '  var a = document.createElement("a");',
    '  a.href = URL.createObjectURL(blob);',
    '  a.download = ' + nomeDownload + ';',
    '  document.body.appendChild(a); a.click(); document.body.removeChild(a);',
    '  setTimeout(function(){ URL.revokeObjectURL(a.href); }, 1000);',
    '}',
    'var _docVars={"--fs":1,"--lh":1,"--gap":1};',
    'function _docVar(k,d){',
    '  _docVars[k]=Math.max(0.6,Math.min(2,Math.round((_docVars[k]+d)*100)/100));',
    '  document.getElementById("doc-pg").style.setProperty(k,_docVars[k]);',
    '}',
    'function _docResetVars(){_docVars={"--fs":1,"--lh":1,"--gap":1};var p=document.getElementById("doc-pg");p.style.removeProperty("--fs");p.style.removeProperty("--lh");p.style.removeProperty("--gap");}',
    '<\/script>',
    '</body></html>'
  ].join('\n');
}

function _docGen_apriPreview(titolo, corpoHtml, statusEl) {
  var html = _docGen_costruisciHTML(titolo, corpoHtml);
  var w = window.open('', '_blank');
  if (!w) {
    statusEl.style.color = 'var(--rust)';
    statusEl.textContent = '✗ Popup bloccato. Consenti i popup per questo sito.';
    return;
  }
  w.document.open();
  w.document.write(html);
  w.document.close();
  statusEl.style.color = '#2d6a4f';
  statusEl.textContent = '✓ Preview aperta in nuova finestra.';
}
