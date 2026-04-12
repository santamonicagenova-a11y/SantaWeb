// Core functions per menu-admin Santamonica


var tplBefore = '', tplAfter = '', dati = null, datiOriginali = null;

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

function analizza(src) {
  var START = 'const MENU = {';
  var END   = '/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */';
  var i1 = src.indexOf(START);
  if (i1 < 0) throw new Error('Blocco MENU non trovato — hai caricato il file giusto?');
  var i2 = src.indexOf(END, i1);
  if (i2 < 0) throw new Error('Fine blocco MENU non trovata.');
  var i2end = src.indexOf('\n', i2) + 1;

  var js = src.slice(i1, i2).trim(); // "const MENU = { ... };"
  dati = Function('"use strict";' + js + ';return MENU;')();
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

function costruisci() {
  var wrap = document.getElementById('wrap');
  wrap.innerHTML = '';
  var m = dati;

  /* --- DEGUSTAZIONE --- */
  var fsd = el('div','fs');
  fsd.appendChild(el('div','fs-head','Menù Degustazione'));
  var bd = el('div','fs-body');

  bd.appendChild(el('div','sub','Opzioni prezzo'));
  m.degustazione.opzioni.forEach(function(o, i) {
    var row = el('div','opt-row');
    var c1 = el('div'); c1.appendChild(el('span','opt-lbl','Portate')); c1.appendChild(inp('number','op-portate-'+i, o.portate)); row.appendChild(c1);
    var c2 = el('div'); c2.appendChild(el('span','opt-lbl','Prezzo €')); c2.appendChild(inp('number','op-prezzo-'+i, o.prezzo)); row.appendChild(c2);
    var c3 = el('div'); c3.appendChild(el('span','opt-lbl','Vini €')); c3.appendChild(inp('number','op-vini-'+i, o.vini)); row.appendChild(c3);
    bd.appendChild(row);
  });

  var s6 = el('div','sub'); s6.innerHTML = 'Percorso \u201c6\u201d \u00a0<span style="color:var(--rust);font-size:.6rem">\u2611 = sostenibile *</span>';
  bd.appendChild(s6);
  var h6 = el('div'); h6.style.cssText = 'display:grid;grid-template-columns:1fr 30px;gap:.4rem;padding:.3rem 0;border-bottom:1px solid var(--rule);margin-bottom:.3rem';
  h6.appendChild(el('div','col-lbl','Nome piatto')); h6.appendChild(el('div','col-lbl','*'));
  bd.appendChild(h6);
  m.degustazione.percorsi['6'].forEach(function(p, i) {
    var row = el('div','degu-row');
    row.appendChild(inp('text','d6p-'+i, p.nome));
    row.appendChild(chk('d6s-'+i, p.sostenibile));
    bd.appendChild(row);
  });

  bd.appendChild(el('div','sub','Percorso \u201c7\u201d'));
  var i7 = inp('text','degu7', m.degustazione.percorsi['7']);
  i7.style.width = '100%'; bd.appendChild(i7);

  fsd.appendChild(bd); wrap.appendChild(fsd);

  /* --- SEZIONI --- */
  m.sezioni.forEach(function(sez, si) {
    var fs = el('div','fs');
    // Header con titolo editabile
    var head = el('div','fs-head', sez.titolo);
    fs.appendChild(head);
    var body = el('div','fs-body');

    var hdr = el('div','grid-hdr');
    ['Nome piatto','Prezzo €','Unità','Descrizione','*'].forEach(function(t){ hdr.appendChild(el('div','col-lbl',t)); });
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

    fs.appendChild(body); wrap.appendChild(fs);
  });
}

function leggi() {
  var m = JSON.parse(JSON.stringify(dati));

  m.degustazione.opzioni.forEach(function(o, i) {
    o.portate = +document.getElementById('op-portate-'+i).value;
    o.prezzo  = +document.getElementById('op-prezzo-'+i).value;
    o.vini    = +document.getElementById('op-vini-'+i).value;
  });
  m.degustazione.percorsi['6'].forEach(function(p, i) {
    p.nome = document.getElementById('d6p-'+i).value;
    var eco = document.getElementById('d6s-'+i).checked;
    if (eco) p.sostenibile = true; else delete p.sostenibile;
  });
  m.degustazione.percorsi['7'] = document.getElementById('degu7').value;

  m.sezioni.forEach(function(sez, si) {
    // NON sovrascrivere sez.titolo — è la chiave usata da getSez e pagine
    // Il titolo editabile nel form è solo display
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
  return m;
}

var MENU_URL = 'https://santamonicagenova-a11y.github.io/SantaWeb/menu.html';
var REPO_OWNER = 'santamonicagenova-a11y';
var REPO_NAME  = 'SantaWeb';
var MENU_PATH  = 'menu.html';
var outputCorrente = '';

function costruisciOutput() {
  var m = leggi();
  var sep = '/* ' + '\u2550'.repeat(57) + ' */\n';
  var blocco = 'const MENU = ' + JSON.stringify(m, null, 2) + ';\n' + sep;
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
});


function costruisciMenuTradotto(menuForm, t) {
  var orig = dati;
  var m = JSON.parse(JSON.stringify(menuForm));
  var piatti = t.piatti;

  // Usa sempre il nome nel form come chiave — Traduci ha già aggiornato il dizionario
  function tr(n) { return piatti[n] || n; }

  m.degustazione.nota = t.degu_nota;
  m.degustazione.percorsi['7'] = t.percorso_7;
  m.degustazione.percorsi['6'].forEach(function(p) {
    if (p) p.nome = tr(p.nome);
  });

  m.sezioni.forEach(function(sez, si) {
    var origSez = dati.sezioni[si];
    if (!origSez) return;
    sez.titolo_display = t.sezioni[sez.titolo] || t.sezioni[origSez.titolo] || t.piatti[sez.titolo] || sez.titolo;
    sez.piatti.forEach(function(p) {
      if (!p) return;
      p.nome = tr(p.nome);
      if (p.unita) p.unita = t.unita[p.unita] || p.unita;
      if (p.descrizione) p.descrizione = tr(p.descrizione);
    });
  });

  m.orario.orarioServizio.forEach(function(o) {
    o.giorno = t.orario[o.giorno] || o.giorno;
  });
  return m;
}
var tplBefore = '', tplAfter = '', dati = null, datiOriginali = null;

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

function analizza(src) {
  var START = 'const MENU = {';
  var END   = '/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */';
  var i1 = src.indexOf(START);
  if (i1 < 0) throw new Error('Blocco MENU non trovato — hai caricato il file giusto?');
  var i2 = src.indexOf(END, i1);
  if (i2 < 0) throw new Error('Fine blocco MENU non trovata.');
  var i2end = src.indexOf('\n', i2) + 1;

  var js = src.slice(i1, i2).trim(); // "const MENU = { ... };"
  dati = Function('"use strict";' + js + ';return MENU;')();
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

function costruisci() {
  var wrap = document.getElementById('wrap');
  wrap.innerHTML = '';
  var m = dati;

  /* --- DEGUSTAZIONE --- */
  var fsd = el('div','fs');
  fsd.appendChild(el('div','fs-head','Menù Degustazione'));
  var bd = el('div','fs-body');

  bd.appendChild(el('div','sub','Opzioni prezzo'));
  m.degustazione.opzioni.forEach(function(o, i) {
    var row = el('div','opt-row');
    var c1 = el('div'); c1.appendChild(el('span','opt-lbl','Portate')); c1.appendChild(inp('number','op-portate-'+i, o.portate)); row.appendChild(c1);
    var c2 = el('div'); c2.appendChild(el('span','opt-lbl','Prezzo €')); c2.appendChild(inp('number','op-prezzo-'+i, o.prezzo)); row.appendChild(c2);
    var c3 = el('div'); c3.appendChild(el('span','opt-lbl','Vini €')); c3.appendChild(inp('number','op-vini-'+i, o.vini)); row.appendChild(c3);
    bd.appendChild(row);
  });

  var s6 = el('div','sub'); s6.innerHTML = 'Percorso \u201c6\u201d \u00a0<span style="color:var(--rust);font-size:.6rem">\u2611 = sostenibile *</span>';
  bd.appendChild(s6);
  var h6 = el('div'); h6.style.cssText = 'display:grid;grid-template-columns:1fr 30px;gap:.4rem;padding:.3rem 0;border-bottom:1px solid var(--rule);margin-bottom:.3rem';
  h6.appendChild(el('div','col-lbl','Nome piatto')); h6.appendChild(el('div','col-lbl','*'));
  bd.appendChild(h6);
  m.degustazione.percorsi['6'].forEach(function(p, i) {
    var row = el('div','degu-row');
    row.appendChild(inp('text','d6p-'+i, p.nome));
    row.appendChild(chk('d6s-'+i, p.sostenibile));
    bd.appendChild(row);
  });

  bd.appendChild(el('div','sub','Percorso \u201c7\u201d'));
  var i7 = inp('text','degu7', m.degustazione.percorsi['7']);
  i7.style.width = '100%'; bd.appendChild(i7);

  fsd.appendChild(bd); wrap.appendChild(fsd);

  /* --- SEZIONI --- */
  m.sezioni.forEach(function(sez, si) {
    var fs = el('div','fs');
    // Header con titolo editabile
    var head = el('div','fs-head', sez.titolo);
    fs.appendChild(head);
    var body = el('div','fs-body');

    var hdr = el('div','grid-hdr');
    ['Nome piatto','Prezzo €','Unità','Descrizione','*'].forEach(function(t){ hdr.appendChild(el('div','col-lbl',t)); });
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

    fs.appendChild(body); wrap.appendChild(fs);
  });
}

function leggi() {
  var m = JSON.parse(JSON.stringify(dati));

  m.degustazione.opzioni.forEach(function(o, i) {
    o.portate = +document.getElementById('op-portate-'+i).value;
    o.prezzo  = +document.getElementById('op-prezzo-'+i).value;
    o.vini    = +document.getElementById('op-vini-'+i).value;
  });
  m.degustazione.percorsi['6'].forEach(function(p, i) {
    p.nome = document.getElementById('d6p-'+i).value;
    var eco = document.getElementById('d6s-'+i).checked;
    if (eco) p.sostenibile = true; else delete p.sostenibile;
  });
  m.degustazione.percorsi['7'] = document.getElementById('degu7').value;

  m.sezioni.forEach(function(sez, si) {
    // NON sovrascrivere sez.titolo — è la chiave usata da getSez e pagine
    // Il titolo editabile nel form è solo display
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
  return m;
}

var MENU_URL = 'https://santamonicagenova-a11y.github.io/SantaWeb/menu.html';
var REPO_OWNER = 'santamonicagenova-a11y';
var REPO_NAME  = 'SantaWeb';
var MENU_PATH  = 'menu.html';
var outputCorrente = '';

function costruisciOutput() {
  var m = leggi();
  var sep = '/* ' + '\u2550'.repeat(57) + ' */\n';
  var blocco = 'const MENU = ' + JSON.stringify(m, null, 2) + ';\n' + sep;
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
});


function costruisciMenuTradotto(menuForm, t) {
  var orig = dati;
  var m = JSON.parse(JSON.stringify(menuForm));
  var piatti = t.piatti;

  // Usa sempre il nome nel form come chiave — Traduci ha già aggiornato il dizionario
  function tr(n) { return piatti[n] || n; }

  m.degustazione.nota = t.degu_nota;
  m.degustazione.percorsi['7'] = t.percorso_7;
  m.degustazione.percorsi['6'].forEach(function(p) {
    if (p) p.nome = tr(p.nome);
  });

  m.sezioni.forEach(function(sez, si) {
    var origSez = dati.sezioni[si];
    if (!origSez) return;
    sez.titolo_display = t.sezioni[sez.titolo] || t.sezioni[origSez.titolo] || t.piatti[sez.titolo] || sez.titolo;
    sez.piatti.forEach(function(p) {
      if (!p) return;
      p.nome = tr(p.nome);
      if (p.unita) p.unita = t.unita[p.unita] || p.unita;
      if (p.descrizione) p.descrizione = tr(p.descrizione);
    });
  });

  m.orario.orarioServizio.forEach(function(o) {
    o.giorno = t.orario[o.giorno] || o.giorno;
  });
  return m;
}


function apriPreview(lang) {
  if (!dati) { alert('Prima carica il menù'); return; }
  document.getElementById('preview-menu').classList.remove('open');
  outputCorrente = costruisciOutput();
  if (!lang || lang === 'it') {
    // Italiano: genera al volo
    var blob = new Blob([outputCorrente], { type: 'text/html;charset=utf-8' });
    window.open(URL.createObjectURL(blob), '_blank').focus();
  } else {
    // Lingue: apri direttamente da GitHub Pages
    var base = 'https://santamonicagenova-a11y.github.io/SantaWeb/menu-' + lang + '.html';
    window.open(base + '?v=' + Date.now(), '_blank').focus();
  }
}

function caricaDalSito() {
  var btn = document.querySelector('.btn-load');
  document.getElementById('err').textContent = '';
  fetch(MENU_URL + '?nocache=' + Date.now())
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
  eseguiPubblicazione(token);
  var btn = document.getElementById('btn-pubblica');
  if (btn) { btn.textContent = '✦ Traduci e Pubblica'; btn.disabled = false; }
}

function chiudiModal() {
  document.getElementById('modal-token').classList.remove('on');
}

var TRANSLATIONS = {"en": {"lang": "en", "lang_label": "English", "title": "Menu — Santamonica", "degu_titolo": "Tasting Menu", "degu_portate_label": "courses", "degu_vini_label": "wine pairing", "degu_nota": "Price per person, menu to be shared by the whole table.", "degu_intero_tavolo": "the whole table", "percorso_7": "Chef's free interpretation menu", "note_carta_1": "To maintain consistent quality and organoleptic characteristics of raw ingredients, fresh fish products are blast-frozen after purchase. These products are marked with the symbol * for clear and transparent customer information.", "note_carta_2": "The list of allergens is available on the last page of this menu.", "note_ospite_titolo": "Guest notes", "note_orario": "To maintain consistent quality standards and organoleptic characteristics, fresh fish products are blast-frozen. These products are marked with the symbol: *", "orario_titolo": "OPENING HOURS:", "titolo_degustazione": "Tasting Menu", "sezioni": {"Crudi": "Raw", "Sfiziosi": "Starters", "Amidi e Carboidrati": "Pasta & Grains", "Non Solo Mare": "Not Only Sea"}, "unita": {"cad.": "ea."}, "piatti": {"Ali di razza, fave nostrane, mela verde, mandorle": "Skate wing, local broad beans, green apple, almonds", "Animella di vitello, sedano rapa, nocciole, fondo di pesce": "Veal sweetbread, celeriac, hazelnuts, fish stock", "Tortelli di cinghiale, dashi di orata, cipollina, shiso": "Wild boar tortelli, sea bream dashi, spring onion, shiso", "Tubetti “<em>Mancini</em>”, baccalà, kosho di agrumi, borlotti": "Tubetti “<em>Mancini</em>”, salt cod, citrus kosho, borlotti beans", "Ombrina nostrana pescata ad amo, salicornia, indivia belga": "Line-caught local meagre, sea purslane, Belgian endive", "Gelato al limone nero, levistico, lime, cracker di latte": "Black lemon ice cream, lovage, lime, milk cracker", "Ostriche Fine de Claire": "Fine de Claire Oysters", "Ostriche Antilope": "Antilope Oysters", "Ostriche Enrico IV": "Enrico IV Oysters", "Scampi nostrani": "Local langoustines", "Gamberi viola nostrani": "Local purple prawns", "Selezione solamente di pesci nostrani pescati ad amo": "Selection of local line-caught fish only", "Degustazione di mare": "Sea tasting", "Calamaro nostrano, piselli freschi, bagna cauda leggera, kefir": "Local squid, fresh peas, light bagna cauda, kefir", "Cavolo cappuccio, miso, lamponi, anacardi": "Cabbage, miso, raspberries, cashews", "Animella di vitello, sedano rapa, nocciole, riduzione di fondo di pesce": "Veal sweetbread, celeriac, hazelnuts, fish stock reduction", "“Non formaggi”": "“Not cheese”", "(Degustazione di finti formaggi artigianali a base anacardi e latte di mandorla)": "(Tasting of artisan fake cheeses made with cashews and almond milk)", "Spaghettoni quadrati “<em>Mancini</em>”, anemoni di mare, nduja, maggiorana": "Square spaghettoni “<em>Mancini</em>”, sea anemones, nduja, marjoram", "Tubetti “<em>Mancini</em>”, baccalà, il nostro kosho di agrumi fermentato, borlotti": "Tubetti “<em>Mancini</em>”, salt cod, our fermented citrus kosho, borlotti beans", "Riso “<em>Riserva San Massimo</em>”, ragù di lepre, cime di rapa, Parmigiano Reggiano": "Rice “<em>Riserva San Massimo</em>”, hare ragù, turnip tops, Parmigiano Reggiano", "Polpo nostrano, rabarbaro, piselli": "Local octopus, rhubarb, peas", "Zucchina alla scapece, menta, yogurt, pepe Timut": "Marinated courgette, mint, yogurt, Timut pepper", "Picanha, cardoncelli, fondo di manzo": "Picanha, king oyster mushrooms, beef jus", "Gambero viola crudo": "Raw purple prawn", "Agnello": "Lamb"}, "orario": {"Martedì": "Tuesday", "Dal mercoledì al sabato": "Wednesday to Saturday", "Domenica": "Sunday"}, "links": ["<u>Italian Menu</u>", "<u>Carte en Française</u>", "<u>Speisekarte auf Deutsch</u>", "<u>Carta en Español</u>"]}, "fr": {"lang": "fr", "lang_label": "Français", "title": "Menu — Santamonica", "degu_titolo": "Menu Dégustation", "degu_portate_label": "plats", "degu_vini_label": "accord mets-vins", "degu_nota": "Prix par personne, menu à partager par toute la table.", "degu_intero_tavolo": "toute la table", "percorso_7": "Menu carte blanche du Chef", "note_carta_1": "Pour maintenir constants le niveau qualitatif et les caractéristiques organoleptiques des matières premières, les produits de la mer achetés frais sont surgelés à basse température. Ces produits sont signalés par le symbole * pour une information claire et transparente à la clientèle.", "note_carta_2": "La liste des allergènes est consultable à la dernière page de ce menu.", "note_ospite_titolo": "Note pour nos hôtes", "note_orario": "Pour maintenir constants le niveau qualitatif et les caractéristiques organoleptiques, les produits frais sont surgelés à basse température. Ces produits sont signalés par le symbole : *", "orario_titolo": "HORAIRES D'OUVERTURE :", "titolo_degustazione": "Menu Dégustation", "sezioni": {"Crudi": "Crus", "Sfiziosi": "Entrées", "Amidi e Carboidrati": "Pâtes & Céréales", "Non Solo Mare": "Pas Seulement la Mer"}, "unita": {"cad.": "p."}, "piatti": {"Ali di razza, fave nostrane, mela verde, mandorle": "Aile de raie, fèves locales, pomme verte, amandes", "Animella di vitello, sedano rapa, nocciole, fondo di pesce": "Ris de veau, céleri-rave, noisettes, fond de poisson", "Tortelli di cinghiale, dashi di orata, cipollina, shiso": "Tortelli de sanglier, dashi de dorade, ciboule, shiso", "Tubetti “<em>Mancini</em>”, baccalà, kosho di agrumi, borlotti": "Tubetti “<em>Mancini</em>”, morue, kosho d’agrumes, haricots borlotti", "Ombrina nostrana pescata ad amo, salicornia, indivia belga": "Ombrine locale à la ligne, salicorne, endive belge", "Gelato al limone nero, levistico, lime, cracker di latte": "Glace au citron noir, livèche, citron vert, cracker au lait", "Ostriche Fine de Claire": "Huîtres Fine de Claire", "Ostriche Antilope": "Huîtres Antilope", "Ostriche Enrico IV": "Huîtres Enrico IV", "Scampi nostrani": "Langoustines locales", "Gamberi viola nostrani": "Crevettes violettes locales", "Selezione solamente di pesci nostrani pescati ad amo": "Sélection exclusivement de poissons locaux pêchés à la ligne", "Degustazione di mare": "Dégustation de la mer", "Calamaro nostrano, piselli freschi, bagna cauda leggera, kefir": "Calamar local, petits pois frais, bagna cauda légère, kéfir", "Cavolo cappuccio, miso, lamponi, anacardi": "Chou pommé, miso, framboises, noix de cajou", "Animella di vitello, sedano rapa, nocciole, riduzione di fondo di pesce": "Ris de veau, céleri-rave, noisettes, réduction de fond de poisson", "“Non formaggi”": "“Non-fromages”", "(Degustazione di finti formaggi artigianali a base anacardi e latte di mandorla)": "(Dégustation de faux fromages artisanaux à base de noix de cajou et lait d’amande)", "Spaghettoni quadrati “<em>Mancini</em>”, anemoni di mare, nduja, maggiorana": "Spaghettoni carrés “<em>Mancini</em>”, anémones de mer, nduja, marjolaine", "Tubetti “<em>Mancini</em>”, baccalà, il nostro kosho di agrumi fermentato, borlotti": "Tubetti “<em>Mancini</em>”, morue, notre kosho d’agrumes fermenté, borlotti", "Riso “<em>Riserva San Massimo</em>”, ragù di lepre, cime di rapa, Parmigiano Reggiano": "Riz “<em>Riserva San Massimo</em>”, ragû de lièvre, fanes de navet, Parmigiano Reggiano", "Polpo nostrano, rabarbaro, piselli": "Poulpe local, rhubarbe, petits pois", "Zucchina alla scapece, menta, yogurt, pepe Timut": "Courgette en escabèche, menthe, yaourt, poivre Timut", "Picanha, cardoncelli, fondo di manzo": "Picanha, pleurotes du panicaut, jus de bœuf", "Gambero viola crudo": "Crevette violette crue", "Agnello": "Agneau"}, "orario": {"Martedì": "Mardi", "Dal mercoledì al sabato": "Du mercredi au samedi", "Domenica": "Dimanche"}, "links": ["<u>Menu Italiano</u>", "<u>English Menu</u>", "<u>Speisekarte auf Deutsch</u>", "<u>Carta en Español</u>"]}, "de": {"lang": "de", "lang_label": "Deutsch", "title": "Speisekarte — Santamonica", "degu_titolo": "Degustationsmenü", "degu_portate_label": "Gänge", "degu_vini_label": "Weinbegleitung", "degu_nota": "Preis pro Person, Menü für den gesamten Tisch.", "degu_intero_tavolo": "den gesamten Tisch", "percorso_7": "Menü nach freier Wahl des Küchenchefs", "note_carta_1": "Um die Qualität und die organoleptischen Eigenschaften der Rohstoffe konstant zu halten, werden frisch eingekaufte Fischprodukte schockgefrostet. Diese Produkte sind mit dem Symbol * gekennzeichnet.", "note_carta_2": "Die Liste der Allergene finden Sie auf der letzten Seite dieser Speisekarte.", "note_ospite_titolo": "Hinweis für unsere Gäste", "note_orario": "Um die Qualität konstant zu halten, werden frische Fischprodukte schockgefrostet und mit dem Symbol * gekennzeichnet.", "orario_titolo": "ÖFFNUNGSZEITEN:", "titolo_degustazione": "Degustationsmenü", "sezioni": {"Crudi": "Rohkost", "Sfiziosi": "Vorspeisen", "Amidi e Carboidrati": "Pasta & Getreide", "Non Solo Mare": "Nicht Nur Meer"}, "unita": {"cad.": "Stk."}, "piatti": {"Ali di razza, fave nostrane, mela verde, mandorle": "Rochenflügel, heimische Saubohnen, grüner Apfel, Mandeln", "Animella di vitello, sedano rapa, nocciole, fondo di pesce": "Kalbsbries, Knollensellerie, Haselnüsse, Fischfond", "Tortelli di cinghiale, dashi di orata, cipollina, shiso": "Wildschweintortelli, Goldbrassen-Dashi, Frühlingszwiebel, Shiso", "Tubetti “<em>Mancini</em>”, baccalà, kosho di agrumi, borlotti": "Tubetti “<em>Mancini</em>”, Stockfisch, Zitruskosho, Borlottibohnen", "Ombrina nostrana pescata ad amo, salicornia, indivia belga": "Lokal geangelter Umberfisch, Queller, Chicorée", "Gelato al limone nero, levistico, lime, cracker di latte": "Schwarzzitronen-Eis, Liebstöckel, Limette, Milchcracker", "Ostriche Fine de Claire": "Fine de Claire Austern", "Ostriche Antilope": "Antilope Austern", "Ostriche Enrico IV": "Enrico IV Austern", "Scampi nostrani": "Heimische Scampi", "Gamberi viola nostrani": "Heimische Violettgarnelen", "Selezione solamente di pesci nostrani pescati ad amo": "Auswahl ausschließlich heimischer Angelfische", "Degustazione di mare": "Meeresverkostung", "Calamaro nostrano, piselli freschi, bagna cauda leggera, kefir": "Heimischer Tintenfisch, frische Erbsen, leichte Bagna Cauda, Kefir", "Cavolo cappuccio, miso, lamponi, anacardi": "Weißkohl, Miso, Himbeeren, Cashewnüsse", "Animella di vitello, sedano rapa, nocciole, riduzione di fondo di pesce": "Kalbsbries, Knollensellerie, Haselnüsse, Fischfondreduktion", "“Non formaggi”": "“Kein Käse”", "(Degustazione di finti formaggi artigianali a base anacardi e latte di mandorla)": "(Verkostung handwerklicher Pseudokäse auf Cashew- und Mandelmilchbasis)", "Spaghettoni quadrati “<em>Mancini</em>”, anemoni di mare, nduja, maggiorana": "Quadratische Spaghettoni “<em>Mancini</em>”, Seeanemonen, Nduja, Majoran", "Tubetti “<em>Mancini</em>”, baccalà, il nostro kosho di agrumi fermentato, borlotti": "Tubetti “<em>Mancini</em>”, Stockfisch, unser fermentiertes Zitruskosho, Borlottibohnen", "Riso “<em>Riserva San Massimo</em>”, ragù di lepre, cime di rapa, Parmigiano Reggiano": "Reis “<em>Riserva San Massimo</em>”, Hasenragù, Steckrübenblätter, Parmigiano Reggiano", "Polpo nostrano, rabarbaro, piselli": "Heimischer Oktopus, Rhabarber, Erbsen", "Zucchina alla scapece, menta, yogurt, pepe Timut": "Marinierte Zucchini, Minze, Joghurt, Timutpfeffer", "Picanha, cardoncelli, fondo di manzo": "Picanha, Königskräuterseitlinge, Rinderjus", "Gambero viola crudo": "Rohe Violettgarnele", "Agnello": "Lamm"}, "orario": {"Martedì": "Dienstag", "Dal mercoledì al sabato": "Mittwoch bis Samstag", "Domenica": "Sonntag"}, "links": ["<u>Menu Italiano</u>", "<u>English Menu</u>", "<u>Carte en Française</u>", "<u>Carta en Español</u>"]}, "es": {"lang": "es", "lang_label": "Español", "title": "Carta — Santamonica", "degu_titolo": "Menú Degustación", "degu_portate_label": "platos", "degu_vini_label": "maridaje de vinos", "degu_nota": "Precio por persona, menú para toda la mesa.", "degu_intero_tavolo": "toda la mesa", "percorso_7": "Menú a libre elección del Chef", "note_carta_1": "Para mantener constantes el nivel cualitativo y las características organolépticas de las materias primas, los productos de pescado comprados frescos se someten a ultracongelación. Estos productos se señalan con el símbolo * para una información clara y transparente.", "note_carta_2": "La lista de alérgenos se puede consultar en la última página de esta carta.", "note_ospite_titolo": "Nota para nuestros huéspedes", "note_orario": "Para mantener constantes el nivel cualitativo y las características organolépticas, los productos frescos se ultracongelan y se señalan con el símbolo: *", "orario_titolo": "HORARIO DE SERVICIO:", "titolo_degustazione": "Menú Degustación", "sezioni": {"Crudi": "Crudos", "Sfiziosi": "Entrantes", "Amidi e Carboidrati": "Pastas & Cereales", "Non Solo Mare": "No Solo Mar"}, "unita": {"cad.": "ud."}, "piatti": {"Ali di razza, fave nostrane, mela verde, mandorle": "Aleta de raya, habas locales, manzana verde, almendras", "Animella di vitello, sedano rapa, nocciole, fondo di pesce": "Mollejas de ternera, apio nabo, avellanas, fondo de pescado", "Tortelli di cinghiale, dashi di orata, cipollina, shiso": "Tortelli de jabalí, dashi de dorada, cebolleta, shiso", "Tubetti “<em>Mancini</em>”, baccalà, kosho di agrumi, borlotti": "Tubetti “<em>Mancini</em>”, bacalao, kosho de cítricos, alubias borlotti", "Ombrina nostrana pescata ad amo, salicornia, indivia belga": "Corvina local de anzuelo, salicornia, endibia belga", "Gelato al limone nero, levistico, lime, cracker di latte": "Helado de limón negro, levístico, lima, cracker de leche", "Ostriche Fine de Claire": "Ostras Fine de Claire", "Ostriche Antilope": "Ostras Antilope", "Ostriche Enrico IV": "Ostras Enrico IV", "Scampi nostrani": "Cigalas locales", "Gamberi viola nostrani": "Gambas violetas locales", "Selezione solamente di pesci nostrani pescati ad amo": "Selección exclusivamente de pescados locales de anzuelo", "Degustazione di mare": "Degustación del mar", "Calamaro nostrano, piselli freschi, bagna cauda leggera, kefir": "Calamar local, guisantes frescos, bagna cauda ligera, kéfir", "Cavolo cappuccio, miso, lamponi, anacardi": "Col repollo, miso, frambuesas, anacardos", "Animella di vitello, sedano rapa, nocciole, riduzione di fondo di pesce": "Mollejas de ternera, apio nabo, avellanas, reducción de fondo de pescado", "“Non formaggi”": "“No quesos”", "(Degustazione di finti formaggi artigianali a base anacardi e latte di mandorla)": "(Degustación de falsos quesos artesanales a base de anacardos y leche de almendra)", "Spaghettoni quadrati “<em>Mancini</em>”, anemoni di mare, nduja, maggiorana": "Spaghettoni cuadrados “<em>Mancini</em>”, anémonas de mar, nduja, mejorana", "Tubetti “<em>Mancini</em>”, baccalà, il nostro kosho di agrumi fermentato, borlotti": "Tubetti “<em>Mancini</em>”, bacalao, nuestro kosho de cítricos fermentado, borlotti", "Riso “<em>Riserva San Massimo</em>”, ragù di lepre, cime di rapa, Parmigiano Reggiano": "Arroz “<em>Riserva San Massimo</em>”, ragú de liebre, grelos, Parmigiano Reggiano", "Polpo nostrano, rabarbaro, piselli": "Pulpo local, ruibarbo, guisantes", "Zucchina alla scapece, menta, yogurt, pepe Timut": "Calabacín en escabeche, menta, yogur, pimienta Timut", "Picanha, cardoncelli, fondo di manzo": "Picanha, setas cardoncelli, jugo de ternera", "Gambero viola crudo": "Gamba violeta cruda", "Agnello": "Cordero"}, "orario": {"Martedì": "Martes", "Dal mercoledì al sabato": "De miércoles a sábado", "Domenica": "Domingo"}, "links": ["<u>Menu Italiano</u>", "<u>English Menu</u>", "<u>Carte en Française</u>", "<u>Speisekarte auf Deutsch</u>"]}};

function traduci() {
  if (!dati) { alert('Prima carica il menù'); return; }
  var m = leggi();
  var btn = document.getElementById('btn-traduci');

  // Raccogli tutti i testi dal form
  var testi = [];
  m.degustazione.percorsi['6'].forEach(function(p) { if (p.nome) testi.push(p.nome); });
  m.sezioni.forEach(function(sez) {
    if (sez.titolo) testi.push(sez.titolo); // traduci anche il titolo sezione
    sez.piatti.forEach(function(p) {
      if (p.nome) testi.push(p.nome);
      if (p.descrizione) testi.push(p.descrizione);
    });
  });
  testi = testi.filter(function(v, i, a) { return v && a.indexOf(v) === i; });

  if (testi.length === 0) { toast('Nessun testo da tradurre'); return; }

  var langs = ['en', 'fr', 'de', 'es'];
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

  function traduciVoce(i) {
    if (i >= coda.length) {
      btn.textContent = '\uD83C\uDF10 Traduci';
      btn.classList.remove('translating');
      btn.disabled = false;
      toast('\u2713 ' + testi.length + ' voci tradotte in 4 lingue!');
      return;
    }
    var item = coda[i];
    btn.textContent = '\u23f3 ' + (i+1) + '/' + totale + '\u2026';

    // Google Translate API non ufficiale — nessun CORS, nessuna chiave
    var url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=it&tl=' +
      item.lang + '&dt=t&q=' + encodeURIComponent(item.testo);

    fetch(url)
      .then(function(r) { return r.json(); })
      .then(function(data) {
        // La risposta è [[["traduzione","originale",null,null,1],...],...]
        var trad = data && data[0] && data[0][0] && data[0][0][0];
        if (trad) TRANSLATIONS[item.lang]['piatti'][item.testo] = trad;
      })
      .catch(function() {})
      .finally(function() {
        setTimeout(function() { traduciVoce(i + 1); }, 80);
      });
  }

  traduciVoce(0);
}


function costruisciMenuTradotto(menuForm, t) {
  var orig = dati;
  var m = JSON.parse(JSON.stringify(menuForm));
  var piatti = t.piatti;

  // Usa sempre il nome nel form come chiave — Traduci ha già aggiornato il dizionario
  function tr(n) { return piatti[n] || n; }

  m.degustazione.nota = t.degu_nota;
  m.degustazione.percorsi['7'] = t.percorso_7;
  m.degustazione.percorsi['6'].forEach(function(p) {
    if (p) p.nome = tr(p.nome);
  });

  m.sezioni.forEach(function(sez, si) {
    var origSez = dati.sezioni[si];
    if (!origSez) return;
    sez.titolo_display = t.sezioni[sez.titolo] || t.sezioni[origSez.titolo] || t.piatti[sez.titolo] || sez.titolo;
    sez.piatti.forEach(function(p) {
      if (!p) return;
      p.nome = tr(p.nome);
      if (p.unita) p.unita = t.unita[p.unita] || p.unita;
      if (p.descrizione) p.descrizione = tr(p.descrizione);
    });
  });

  m.orario.orarioServizio.forEach(function(o) {
    o.giorno = t.orario[o.giorno] || o.giorno;
  });
  return m;
}

function costruisciHtmlTradotto(lang, t) {
  var src = outputCorrente;
  var menuForm = leggi();
  var m = costruisciMenuTradotto(menuForm, t);

  var SEP = '/* ' + '\u2550'.repeat(57) + ' */\n';
  var START = 'const MENU = {';
  var i1 = src.indexOf(START);
  var i2 = src.indexOf(SEP, i1) + SEP.length;
  var newBlock = 'const MENU = ' + JSON.stringify(m, null, 2) + ';\n' + SEP;
  var html = src.slice(0, i1) + newBlock + src.slice(i2);

  html = html.replace('<html lang="it">', '<html lang="' + lang + '">');
  html = html.replace(/<title>[^<]*<\/title>/, '<title>' + t.title + '</title>');

  html = html.replace(/Note per l'ospite<\/span>[^`]*`/,
    t.note_ospite_titolo + '</span>\n  ' + t.note_carta_1 + '<br>\n  ' + t.note_carta_2 + '\n`');
  html = html.replace(/Per mantenere costanti[\s\S]*?simbolo: \*`/,
    t.note_orario + '`');
  html = html.replace('Men\u00f9\u2019 Degustazione', t.titolo_degustazione);
  html = html.replace('Men&ugrave;&rsquo; Degustazione', t.titolo_degustazione);
  html = html.replace(/\$\{o\.portate\} portate/g, '${o.portate} ' + t.degu_portate_label);
  html = html.replace(/eventuale abbinamento vini/g, t.degu_vini_label);
  html = html.replace('ORARIO DI SERVIZIO:', t.orario_titolo);
  html = html.replace(
    /<u><em>English Menu<\/em><\/u><br>\s*<u><em>Carte en Fran[^<]*<\/em><\/u>/,
    t.links.join('<br>\n            ')
  );
  return html;
}

function apriPreview(lang) {
  if (!dati) { alert('Prima carica il menù'); return; }
  document.getElementById('preview-menu').classList.remove('open');
  outputCorrente = costruisciOutput();
  if (!lang || lang === 'it') {
    // Italiano: genera al volo
    var blob = new Blob([outputCorrente], { type: 'text/html;charset=utf-8' });
    window.open(URL.createObjectURL(blob), '_blank').focus();
  } else {
    // Lingue: apri direttamente da GitHub Pages
    var base = 'https://santamonicagenova-a11y.github.io/SantaWeb/menu-' + lang + '.html';
    window.open(base + '?v=' + Date.now(), '_blank').focus();
  }
}

function caricaDalSito() {
  var btn = document.querySelector('.btn-load');
  document.getElementById('err').textContent = '';
  fetch(MENU_URL + '?nocache=' + Date.now())
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
  eseguiPubblicazione(token);
  var btn = document.getElementById('btn-pubblica');
  if (btn) { btn.textContent = '✦ Traduci e Pubblica'; btn.disabled = false; }
}

function chiudiModal() {
  document.getElementById('modal-token').classList.remove('on');
}

var TRANSLATIONS = {"en": {"lang": "en", "lang_label": "English", "title": "Menu — Santamonica", "degu_titolo": "Tasting Menu", "degu_portate_label": "courses", "degu_vini_label": "wine pairing", "degu_nota": "Price per person, menu to be shared by the whole table.", "degu_intero_tavolo": "the whole table", "percorso_7": "Chef's free interpretation menu", "note_carta_1": "To maintain consistent quality and organoleptic characteristics of raw ingredients, fresh fish products are blast-frozen after purchase. These products are marked with the symbol * for clear and transparent customer information.", "note_carta_2": "The list of allergens is available on the last page of this menu.", "note_ospite_titolo": "Guest notes", "note_orario": "To maintain consistent quality standards and organoleptic characteristics, fresh fish products are blast-frozen. These products are marked with the symbol: *", "orario_titolo": "OPENING HOURS:", "titolo_degustazione": "Tasting Menu", "sezioni": {"Crudi": "Raw", "Sfiziosi": "Starters", "Amidi e Carboidrati": "Pasta & Grains", "Non Solo Mare": "Not Only Sea"}, "unita": {"cad.": "ea."}, "piatti": {"Ali di razza, fave nostrane, mela verde, mandorle": "Skate wing, local broad beans, green apple, almonds", "Animella di vitello, sedano rapa, nocciole, fondo di pesce": "Veal sweetbread, celeriac, hazelnuts, fish stock", "Tortelli di cinghiale, dashi di orata, cipollina, shiso": "Wild boar tortelli, sea bream dashi, spring onion, shiso", "Tubetti “<em>Mancini</em>”, baccalà, kosho di agrumi, borlotti": "Tubetti “<em>Mancini</em>”, salt cod, citrus kosho, borlotti beans", "Ombrina nostrana pescata ad amo, salicornia, indivia belga": "Line-caught local meagre, sea purslane, Belgian endive", "Gelato al limone nero, levistico, lime, cracker di latte": "Black lemon ice cream, lovage, lime, milk cracker", "Ostriche Fine de Claire": "Fine de Claire Oysters", "Ostriche Antilope": "Antilope Oysters", "Ostriche Enrico IV": "Enrico IV Oysters", "Scampi nostrani": "Local langoustines", "Gamberi viola nostrani": "Local purple prawns", "Selezione solamente di pesci nostrani pescati ad amo": "Selection of local line-caught fish only", "Degustazione di mare": "Sea tasting", "Calamaro nostrano, piselli freschi, bagna cauda leggera, kefir": "Local squid, fresh peas, light bagna cauda, kefir", "Cavolo cappuccio, miso, lamponi, anacardi": "Cabbage, miso, raspberries, cashews", "Animella di vitello, sedano rapa, nocciole, riduzione di fondo di pesce": "Veal sweetbread, celeriac, hazelnuts, fish stock reduction", "“Non formaggi”": "“Not cheese”", "(Degustazione di finti formaggi artigianali a base anacardi e latte di mandorla)": "(Tasting of artisan fake cheeses made with cashews and almond milk)", "Spaghettoni quadrati “<em>Mancini</em>”, anemoni di mare, nduja, maggiorana": "Square spaghettoni “<em>Mancini</em>”, sea anemones, nduja, marjoram", "Tubetti “<em>Mancini</em>”, baccalà, il nostro kosho di agrumi fermentato, borlotti": "Tubetti “<em>Mancini</em>”, salt cod, our fermented citrus kosho, borlotti beans", "Riso “<em>Riserva San Massimo</em>”, ragù di lepre, cime di rapa, Parmigiano Reggiano": "Rice “<em>Riserva San Massimo</em>”, hare ragù, turnip tops, Parmigiano Reggiano", "Polpo nostrano, rabarbaro, piselli": "Local octopus, rhubarb, peas", "Zucchina alla scapece, menta, yogurt, pepe Timut": "Marinated courgette, mint, yogurt, Timut pepper", "Picanha, cardoncelli, fondo di manzo": "Picanha, king oyster mushrooms, beef jus", "Gambero viola crudo": "Raw purple prawn", "Agnello": "Lamb"}, "orario": {"Martedì": "Tuesday", "Dal mercoledì al sabato": "Wednesday to Saturday", "Domenica": "Sunday"}, "links": ["<u>Italian Menu</u>", "<u>Carte en Française</u>", "<u>Speisekarte auf Deutsch</u>", "<u>Carta en Español</u>"]}, "fr": {"lang": "fr", "lang_label": "Français", "title": "Menu — Santamonica", "degu_titolo": "Menu Dégustation", "degu_portate_label": "plats", "degu_vini_label": "accord mets-vins", "degu_nota": "Prix par personne, menu à partager par toute la table.", "degu_intero_tavolo": "toute la table", "percorso_7": "Menu carte blanche du Chef", "note_carta_1": "Pour maintenir constants le niveau qualitatif et les caractéristiques organoleptiques des matières premières, les produits de la mer achetés frais sont surgelés à basse température. Ces produits sont signalés par le symbole * pour une information claire et transparente à la clientèle.", "note_carta_2": "La liste des allergènes est consultable à la dernière page de ce menu.", "note_ospite_titolo": "Note pour nos hôtes", "note_orario": "Pour maintenir constants le niveau qualitatif et les caractéristiques organoleptiques, les produits frais sont surgelés à basse température. Ces produits sont signalés par le symbole : *", "orario_titolo": "HORAIRES D'OUVERTURE :", "titolo_degustazione": "Menu Dégustation", "sezioni": {"Crudi": "Crus", "Sfiziosi": "Entrées", "Amidi e Carboidrati": "Pâtes & Céréales", "Non Solo Mare": "Pas Seulement la Mer"}, "unita": {"cad.": "p."}, "piatti": {"Ali di razza, fave nostrane, mela verde, mandorle": "Aile de raie, fèves locales, pomme verte, amandes", "Animella di vitello, sedano rapa, nocciole, fondo di pesce": "Ris de veau, céleri-rave, noisettes, fond de poisson", "Tortelli di cinghiale, dashi di orata, cipollina, shiso": "Tortelli de sanglier, dashi de dorade, ciboule, shiso", "Tubetti “<em>Mancini</em>”, baccalà, kosho di agrumi, borlotti": "Tubetti “<em>Mancini</em>”, morue, kosho d’agrumes, haricots borlotti", "Ombrina nostrana pescata ad amo, salicornia, indivia belga": "Ombrine locale à la ligne, salicorne, endive belge", "Gelato al limone nero, levistico, lime, cracker di latte": "Glace au citron noir, livèche, citron vert, cracker au lait", "Ostriche Fine de Claire": "Huîtres Fine de Claire", "Ostriche Antilope": "Huîtres Antilope", "Ostriche Enrico IV": "Huîtres Enrico IV", "Scampi nostrani": "Langoustines locales", "Gamberi viola nostrani": "Crevettes violettes locales", "Selezione solamente di pesci nostrani pescati ad amo": "Sélection exclusivement de poissons locaux pêchés à la ligne", "Degustazione di mare": "Dégustation de la mer", "Calamaro nostrano, piselli freschi, bagna cauda leggera, kefir": "Calamar local, petits pois frais, bagna cauda légère, kéfir", "Cavolo cappuccio, miso, lamponi, anacardi": "Chou pommé, miso, framboises, noix de cajou", "Animella di vitello, sedano rapa, nocciole, riduzione di fondo di pesce": "Ris de veau, céleri-rave, noisettes, réduction de fond de poisson", "“Non formaggi”": "“Non-fromages”", "(Degustazione di finti formaggi artigianali a base anacardi e latte di mandorla)": "(Dégustation de faux fromages artisanaux à base de noix de cajou et lait d’amande)", "Spaghettoni quadrati “<em>Mancini</em>”, anemoni di mare, nduja, maggiorana": "Spaghettoni carrés “<em>Mancini</em>”, anémones de mer, nduja, marjolaine", "Tubetti “<em>Mancini</em>”, baccalà, il nostro kosho di agrumi fermentato, borlotti": "Tubetti “<em>Mancini</em>”, morue, notre kosho d’agrumes fermenté, borlotti", "Riso “<em>Riserva San Massimo</em>”, ragù di lepre, cime di rapa, Parmigiano Reggiano": "Riz “<em>Riserva San Massimo</em>”, ragû de lièvre, fanes de navet, Parmigiano Reggiano", "Polpo nostrano, rabarbaro, piselli": "Poulpe local, rhubarbe, petits pois", "Zucchina alla scapece, menta, yogurt, pepe Timut": "Courgette en escabèche, menthe, yaourt, poivre Timut", "Picanha, cardoncelli, fondo di manzo": "Picanha, pleurotes du panicaut, jus de bœuf", "Gambero viola crudo": "Crevette violette crue", "Agnello": "Agneau"}, "orario": {"Martedì": "Mardi", "Dal mercoledì al sabato": "Du mercredi au samedi", "Domenica": "Dimanche"}, "links": ["<u>Menu Italiano</u>", "<u>English Menu</u>", "<u>Speisekarte auf Deutsch</u>", "<u>Carta en Español</u>"]}, "de": {"lang": "de", "lang_label": "Deutsch", "title": "Speisekarte — Santamonica", "degu_titolo": "Degustationsmenü", "degu_portate_label": "Gänge", "degu_vini_label": "Weinbegleitung", "degu_nota": "Preis pro Person, Menü für den gesamten Tisch.", "degu_intero_tavolo": "den gesamten Tisch", "percorso_7": "Menü nach freier Wahl des Küchenchefs", "note_carta_1": "Um die Qualität und die organoleptischen Eigenschaften der Rohstoffe konstant zu halten, werden frisch eingekaufte Fischprodukte schockgefrostet. Diese Produkte sind mit dem Symbol * gekennzeichnet.", "note_carta_2": "Die Liste der Allergene finden Sie auf der letzten Seite dieser Speisekarte.", "note_ospite_titolo": "Hinweis für unsere Gäste", "note_orario": "Um die Qualität konstant zu halten, werden frische Fischprodukte schockgefrostet und mit dem Symbol * gekennzeichnet.", "orario_titolo": "ÖFFNUNGSZEITEN:", "titolo_degustazione": "Degustationsmenü", "sezioni": {"Crudi": "Rohkost", "Sfiziosi": "Vorspeisen", "Amidi e Carboidrati": "Pasta & Getreide", "Non Solo Mare": "Nicht Nur Meer"}, "unita": {"cad.": "Stk."}, "piatti": {"Ali di razza, fave nostrane, mela verde, mandorle": "Rochenflügel, heimische Saubohnen, grüner Apfel, Mandeln", "Animella di vitello, sedano rapa, nocciole, fondo di pesce": "Kalbsbries, Knollensellerie, Haselnüsse, Fischfond", "Tortelli di cinghiale, dashi di orata, cipollina, shiso": "Wildschweintortelli, Goldbrassen-Dashi, Frühlingszwiebel, Shiso", "Tubetti “<em>Mancini</em>”, baccalà, kosho di agrumi, borlotti": "Tubetti “<em>Mancini</em>”, Stockfisch, Zitruskosho, Borlottibohnen", "Ombrina nostrana pescata ad amo, salicornia, indivia belga": "Lokal geangelter Umberfisch, Queller, Chicorée", "Gelato al limone nero, levistico, lime, cracker di latte": "Schwarzzitronen-Eis, Liebstöckel, Limette, Milchcracker", "Ostriche Fine de Claire": "Fine de Claire Austern", "Ostriche Antilope": "Antilope Austern", "Ostriche Enrico IV": "Enrico IV Austern", "Scampi nostrani": "Heimische Scampi", "Gamberi viola nostrani": "Heimische Violettgarnelen", "Selezione solamente di pesci nostrani pescati ad amo": "Auswahl ausschließlich heimischer Angelfische", "Degustazione di mare": "Meeresverkostung", "Calamaro nostrano, piselli freschi, bagna cauda leggera, kefir": "Heimischer Tintenfisch, frische Erbsen, leichte Bagna Cauda, Kefir", "Cavolo cappuccio, miso, lamponi, anacardi": "Weißkohl, Miso, Himbeeren, Cashewnüsse", "Animella di vitello, sedano rapa, nocciole, riduzione di fondo di pesce": "Kalbsbries, Knollensellerie, Haselnüsse, Fischfondreduktion", "“Non formaggi”": "“Kein Käse”", "(Degustazione di finti formaggi artigianali a base anacardi e latte di mandorla)": "(Verkostung handwerklicher Pseudokäse auf Cashew- und Mandelmilchbasis)", "Spaghettoni quadrati “<em>Mancini</em>”, anemoni di mare, nduja, maggiorana": "Quadratische Spaghettoni “<em>Mancini</em>”, Seeanemonen, Nduja, Majoran", "Tubetti “<em>Mancini</em>”, baccalà, il nostro kosho di agrumi fermentato, borlotti": "Tubetti “<em>Mancini</em>”, Stockfisch, unser fermentiertes Zitruskosho, Borlottibohnen", "Riso “<em>Riserva San Massimo</em>”, ragù di lepre, cime di rapa, Parmigiano Reggiano": "Reis “<em>Riserva San Massimo</em>”, Hasenragù, Steckrübenblätter, Parmigiano Reggiano", "Polpo nostrano, rabarbaro, piselli": "Heimischer Oktopus, Rhabarber, Erbsen", "Zucchina alla scapece, menta, yogurt, pepe Timut": "Marinierte Zucchini, Minze, Joghurt, Timutpfeffer", "Picanha, cardoncelli, fondo di manzo": "Picanha, Königskräuterseitlinge, Rinderjus", "Gambero viola crudo": "Rohe Violettgarnele", "Agnello": "Lamm"}, "orario": {"Martedì": "Dienstag", "Dal mercoledì al sabato": "Mittwoch bis Samstag", "Domenica": "Sonntag"}, "links": ["<u>Menu Italiano</u>", "<u>English Menu</u>", "<u>Carte en Française</u>", "<u>Carta en Español</u>"]}, "es": {"lang": "es", "lang_label": "Español", "title": "Carta — Santamonica", "degu_titolo": "Menú Degustación", "degu_portate_label": "platos", "degu_vini_label": "maridaje de vinos", "degu_nota": "Precio por persona, menú para toda la mesa.", "degu_intero_tavolo": "toda la mesa", "percorso_7": "Menú a libre elección del Chef", "note_carta_1": "Para mantener constantes el nivel cualitativo y las características organolépticas de las materias primas, los productos de pescado comprados frescos se someten a ultracongelación. Estos productos se señalan con el símbolo * para una información clara y transparente.", "note_carta_2": "La lista de alérgenos se puede consultar en la última página de esta carta.", "note_ospite_titolo": "Nota para nuestros huéspedes", "note_orario": "Para mantener constantes el nivel cualitativo y las características organolépticas, los productos frescos se ultracongelan y se señalan con el símbolo: *", "orario_titolo": "HORARIO DE SERVICIO:", "titolo_degustazione": "Menú Degustación", "sezioni": {"Crudi": "Crudos", "Sfiziosi": "Entrantes", "Amidi e Carboidrati": "Pastas & Cereales", "Non Solo Mare": "No Solo Mar"}, "unita": {"cad.": "ud."}, "piatti": {"Ali di razza, fave nostrane, mela verde, mandorle": "Aleta de raya, habas locales, manzana verde, almendras", "Animella di vitello, sedano rapa, nocciole, fondo di pesce": "Mollejas de ternera, apio nabo, avellanas, fondo de pescado", "Tortelli di cinghiale, dashi di orata, cipollina, shiso": "Tortelli de jabalí, dashi de dorada, cebolleta, shiso", "Tubetti “<em>Mancini</em>”, baccalà, kosho di agrumi, borlotti": "Tubetti “<em>Mancini</em>”, bacalao, kosho de cítricos, alubias borlotti", "Ombrina nostrana pescata ad amo, salicornia, indivia belga": "Corvina local de anzuelo, salicornia, endibia belga", "Gelato al limone nero, levistico, lime, cracker di latte": "Helado de limón negro, levístico, lima, cracker de leche", "Ostriche Fine de Claire": "Ostras Fine de Claire", "Ostriche Antilope": "Ostras Antilope", "Ostriche Enrico IV": "Ostras Enrico IV", "Scampi nostrani": "Cigalas locales", "Gamberi viola nostrani": "Gambas violetas locales", "Selezione solamente di pesci nostrani pescati ad amo": "Selección exclusivamente de pescados locales de anzuelo", "Degustazione di mare": "Degustación del mar", "Calamaro nostrano, piselli freschi, bagna cauda leggera, kefir": "Calamar local, guisantes frescos, bagna cauda ligera, kéfir", "Cavolo cappuccio, miso, lamponi, anacardi": "Col repollo, miso, frambuesas, anacardos", "Animella di vitello, sedano rapa, nocciole, riduzione di fondo di pesce": "Mollejas de ternera, apio nabo, avellanas, reducción de fondo de pescado", "“Non formaggi”": "“No quesos”", "(Degustazione di finti formaggi artigianali a base anacardi e latte di mandorla)": "(Degustación de falsos quesos artesanales a base de anacardos y leche de almendra)", "Spaghettoni quadrati “<em>Mancini</em>”, anemoni di mare, nduja, maggiorana": "Spaghettoni cuadrados “<em>Mancini</em>”, anémonas de mar, nduja, mejorana", "Tubetti “<em>Mancini</em>”, baccalà, il nostro kosho di agrumi fermentato, borlotti": "Tubetti “<em>Mancini</em>”, bacalao, nuestro kosho de cítricos fermentado, borlotti", "Riso “<em>Riserva San Massimo</em>”, ragù di lepre, cime di rapa, Parmigiano Reggiano": "Arroz “<em>Riserva San Massimo</em>”, ragú de liebre, grelos, Parmigiano Reggiano", "Polpo nostrano, rabarbaro, piselli": "Pulpo local, ruibarbo, guisantes", "Zucchina alla scapece, menta, yogurt, pepe Timut": "Calabacín en escabeche, menta, yogur, pimienta Timut", "Picanha, cardoncelli, fondo di manzo": "Picanha, setas cardoncelli, jugo de ternera", "Gambero viola crudo": "Gamba violeta cruda", "Agnello": "Cordero"}, "orario": {"Martedì": "Martes", "Dal mercoledì al sabato": "De miércoles a sábado", "Domenica": "Domingo"}, "links": ["<u>Menu Italiano</u>", "<u>English Menu</u>", "<u>Carte en Française</u>", "<u>Speisekarte auf Deutsch</u>"]}};

function traduci() {
  if (!dati) { alert('Prima carica il menù'); return; }
  var m = leggi();
  var btn = document.getElementById('btn-traduci');

  // Raccogli tutti i testi dal form
  var testi = [];
  m.degustazione.percorsi['6'].forEach(function(p) { if (p.nome) testi.push(p.nome); });
  m.sezioni.forEach(function(sez) {
    if (sez.titolo) testi.push(sez.titolo); // traduci anche il titolo sezione
    sez.piatti.forEach(function(p) {
      if (p.nome) testi.push(p.nome);
      if (p.descrizione) testi.push(p.descrizione);
    });
  });
  testi = testi.filter(function(v, i, a) { return v && a.indexOf(v) === i; });

  if (testi.length === 0) { toast('Nessun testo da tradurre'); return; }

  var langs = ['en', 'fr', 'de', 'es'];
  var langPair = { en: 'it-IT|en-GB', fr: 'it-IT|fr-FR', de: 'it-IT|de-DE', es: 'it-IT|es-ES' };

  // Crea la coda: tutte le combinazioni testo × lingua in sequenza
  var coda = [];
  testi.forEach(function(testo) {
    langs.forEach(function(lang) {
      coda.push({ testo: testo, lang: lang });
    });
  });

  var totale = coda.length;
  var i = 0;

  btn.textContent = '\u23f3 0/' + totale + '\u2026';
  btn.classList.add('translating');
  btn.disabled = true;

  function prossimaVoce() {
    if (i >= totale) {
      btn.textContent = '\uD83C\uDF10 Traduci';
      btn.classList.remove('translating');
      btn.disabled = false;
      toast('\u2713 ' + testi.length + ' voci tradotte in 4 lingue!');
      return;
    }
    var item = coda[i++];
    var url = 'https://api.mymemory.translated.net/get?q=' +
      encodeURIComponent(item.testo) + '&langpair=' + langPair[item.lang];

    btn.textContent = '\u23f3 ' + i + '/' + totale + '\u2026';

    fetch(url)
      .then(function(r) { return r.json(); })
      .then(function(data) {
        var trad = data.responseData && data.responseData.translatedText;
        if (trad) TRANSLATIONS[item.lang]['piatti'][item.testo] = trad;
      })
      .catch(function() {}) // ignora errori singoli
      .finally(function() {
        // Pausa 120ms tra una richiesta e l'altra per evitare rate limiting
        setTimeout(prossimaVoce, 120);
      });
  }

  prossimaVoce();
}


function costruisciMenuTradotto(menuForm, t) {
  var orig = dati;
  var m = JSON.parse(JSON.stringify(menuForm));
  var piatti = t.piatti;

  // Usa sempre il nome nel form come chiave — Traduci ha già aggiornato il dizionario
  function tr(n) { return piatti[n] || n; }

  m.degustazione.nota = t.degu_nota;
  m.degustazione.percorsi['7'] = t.percorso_7;
  m.degustazione.percorsi['6'].forEach(function(p) {
    if (p) p.nome = tr(p.nome);
  });

  m.sezioni.forEach(function(sez, si) {
    var origSez = dati.sezioni[si];
    if (!origSez) return;
    sez.titolo_display = t.sezioni[sez.titolo] || t.sezioni[origSez.titolo] || t.piatti[sez.titolo] || sez.titolo;
    sez.piatti.forEach(function(p) {
      if (!p) return;
      p.nome = tr(p.nome);
      if (p.unita) p.unita = t.unita[p.unita] || p.unita;
      if (p.descrizione) p.descrizione = tr(p.descrizione);
    });
  });

  m.orario.orarioServizio.forEach(function(o) {
    o.giorno = t.orario[o.giorno] || o.giorno;
  });
  return m;
}

function costruisciHtmlTradotto(lang, t) {
  var src = outputCorrente;
  var menuForm = leggi();
  var m = costruisciMenuTradotto(menuForm, t);

  var SEP = '/* ' + '\u2550'.repeat(57) + ' */\n';
  var START = 'const MENU = {';
  var i1 = src.indexOf(START);
  var i2 = src.indexOf(SEP, i1) + SEP.length;
  var newBlock = 'const MENU = ' + JSON.stringify(m, null, 2) + ';\n' + SEP;
  var html = src.slice(0, i1) + newBlock + src.slice(i2);

  html = html.replace('<html lang="it">', '<html lang="' + lang + '">');
  html = html.replace(/<title>[^<]*<\/title>/, '<title>' + t.title + '</title>');

  html = html.replace(/Note per l'ospite<\/span>[^`]*`/,
    t.note_ospite_titolo + '</span>\n  ' + t.note_carta_1 + '<br>\n  ' + t.note_carta_2 + '\n`');
  html = html.replace(/Per mantenere costanti[\s\S]*?simbolo: \*`/,
    t.note_orario + '`');
  html = html.replace('Men\u00f9\u2019 Degustazione', t.titolo_degustazione);
  html = html.replace('Men&ugrave;&rsquo; Degustazione', t.titolo_degustazione);
  html = html.replace(/\$\{o\.portate\} portate/g, '${o.portate} ' + t.degu_portate_label);
  html = html.replace(/eventuale abbinamento vini/g, t.degu_vini_label);
  html = html.replace('ORARIO DI SERVIZIO:', t.orario_titolo);
  html = html.replace(
    /<u><em>English Menu<\/em><\/u><br>\s*<u><em>Carte en Fran[^<]*<\/em><\/u>/,
    t.links.join('<br>\n            ')
  );
  return html;
}

function apriPreview(lang) {
  if (!dati) { alert('Prima carica il menù'); return; }
  document.getElementById('preview-menu').classList.remove('open');
  outputCorrente = costruisciOutput();
  if (!lang || lang === 'it') {
    // Italiano: genera al volo
    var blob = new Blob([outputCorrente], { type: 'text/html;charset=utf-8' });
    window.open(URL.createObjectURL(blob), '_blank').focus();
  } else {
    // Lingue: apri direttamente da GitHub Pages
    var base = 'https://santamonicagenova-a11y.github.io/SantaWeb/menu-' + lang + '.html';
    window.open(base + '?v=' + Date.now(), '_blank').focus();
  }
}

function caricaDalSito() {
  var btn = document.querySelector('.btn-load');
  document.getElementById('err').textContent = '';
  fetch(MENU_URL + '?nocache=' + Date.now())
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
  eseguiPubblicazione(token);
  var btn = document.getElementById('btn-pubblica');
  if (btn) { btn.textContent = '✦ Traduci e Pubblica'; btn.disabled = false; }
}

function chiudiModal() {
  document.getElementById('modal-token').classList.remove('on');
}

var TRANSLATIONS = {"en": {"lang": "en", "lang_label": "English", "title": "Menu — Santamonica", "degu_titolo": "Tasting Menu", "degu_portate_label": "courses", "degu_vini_label": "wine pairing", "degu_nota": "Price per person, menu to be shared by the whole table.", "degu_intero_tavolo": "the whole table", "percorso_7": "Chef's free interpretation menu", "note_carta_1": "To maintain consistent quality and organoleptic characteristics of raw ingredients, fresh fish products are blast-frozen after purchase. These products are marked with the symbol * for clear and transparent customer information.", "note_carta_2": "The list of allergens is available on the last page of this menu.", "note_ospite_titolo": "Guest notes", "note_orario": "To maintain consistent quality standards and organoleptic characteristics, fresh fish products are blast-frozen. These products are marked with the symbol: *", "orario_titolo": "OPENING HOURS:", "titolo_degustazione": "Tasting Menu", "sezioni": {"Crudi": "Raw", "Sfiziosi": "Starters", "Amidi e Carboidrati": "Pasta & Grains", "Non Solo Mare": "Not Only Sea"}, "unita": {"cad.": "ea."}, "piatti": {"Ali di razza, fave nostrane, mela verde, mandorle": "Skate wing, local broad beans, green apple, almonds", "Animella di vitello, sedano rapa, nocciole, fondo di pesce": "Veal sweetbread, celeriac, hazelnuts, fish stock", "Tortelli di cinghiale, dashi di orata, cipollina, shiso": "Wild boar tortelli, sea bream dashi, spring onion, shiso", "Tubetti “<em>Mancini</em>”, baccalà, kosho di agrumi, borlotti": "Tubetti “<em>Mancini</em>”, salt cod, citrus kosho, borlotti beans", "Ombrina nostrana pescata ad amo, salicornia, indivia belga": "Line-caught local meagre, sea purslane, Belgian endive", "Gelato al limone nero, levistico, lime, cracker di latte": "Black lemon ice cream, lovage, lime, milk cracker", "Ostriche Fine de Claire": "Fine de Claire Oysters", "Ostriche Antilope": "Antilope Oysters", "Ostriche Enrico IV": "Enrico IV Oysters", "Scampi nostrani": "Local langoustines", "Gamberi viola nostrani": "Local purple prawns", "Selezione solamente di pesci nostrani pescati ad amo": "Selection of local line-caught fish only", "Degustazione di mare": "Sea tasting", "Calamaro nostrano, piselli freschi, bagna cauda leggera, kefir": "Local squid, fresh peas, light bagna cauda, kefir", "Cavolo cappuccio, miso, lamponi, anacardi": "Cabbage, miso, raspberries, cashews", "Animella di vitello, sedano rapa, nocciole, riduzione di fondo di pesce": "Veal sweetbread, celeriac, hazelnuts, fish stock reduction", "“Non formaggi”": "“Not cheese”", "(Degustazione di finti formaggi artigianali a base anacardi e latte di mandorla)": "(Tasting of artisan fake cheeses made with cashews and almond milk)", "Spaghettoni quadrati “<em>Mancini</em>”, anemoni di mare, nduja, maggiorana": "Square spaghettoni “<em>Mancini</em>”, sea anemones, nduja, marjoram", "Tubetti “<em>Mancini</em>”, baccalà, il nostro kosho di agrumi fermentato, borlotti": "Tubetti “<em>Mancini</em>”, salt cod, our fermented citrus kosho, borlotti beans", "Riso “<em>Riserva San Massimo</em>”, ragù di lepre, cime di rapa, Parmigiano Reggiano": "Rice “<em>Riserva San Massimo</em>”, hare ragù, turnip tops, Parmigiano Reggiano", "Polpo nostrano, rabarbaro, piselli": "Local octopus, rhubarb, peas", "Zucchina alla scapece, menta, yogurt, pepe Timut": "Marinated courgette, mint, yogurt, Timut pepper", "Picanha, cardoncelli, fondo di manzo": "Picanha, king oyster mushrooms, beef jus", "Gambero viola crudo": "Raw purple prawn", "Agnello": "Lamb"}, "orario": {"Martedì": "Tuesday", "Dal mercoledì al sabato": "Wednesday to Saturday", "Domenica": "Sunday"}, "links": ["<u>Italian Menu</u>", "<u>Carte en Française</u>", "<u>Speisekarte auf Deutsch</u>", "<u>Carta en Español</u>"]}, "fr": {"lang": "fr", "lang_label": "Français", "title": "Menu — Santamonica", "degu_titolo": "Menu Dégustation", "degu_portate_label": "plats", "degu_vini_label": "accord mets-vins", "degu_nota": "Prix par personne, menu à partager par toute la table.", "degu_intero_tavolo": "toute la table", "percorso_7": "Menu carte blanche du Chef", "note_carta_1": "Pour maintenir constants le niveau qualitatif et les caractéristiques organoleptiques des matières premières, les produits de la mer achetés frais sont surgelés à basse température. Ces produits sont signalés par le symbole * pour une information claire et transparente à la clientèle.", "note_carta_2": "La liste des allergènes est consultable à la dernière page de ce menu.", "note_ospite_titolo": "Note pour nos hôtes", "note_orario": "Pour maintenir constants le niveau qualitatif et les caractéristiques organoleptiques, les produits frais sont surgelés à basse température. Ces produits sont signalés par le symbole : *", "orario_titolo": "HORAIRES D'OUVERTURE :", "titolo_degustazione": "Menu Dégustation", "sezioni": {"Crudi": "Crus", "Sfiziosi": "Entrées", "Amidi e Carboidrati": "Pâtes & Céréales", "Non Solo Mare": "Pas Seulement la Mer"}, "unita": {"cad.": "p."}, "piatti": {"Ali di razza, fave nostrane, mela verde, mandorle": "Aile de raie, fèves locales, pomme verte, amandes", "Animella di vitello, sedano rapa, nocciole, fondo di pesce": "Ris de veau, céleri-rave, noisettes, fond de poisson", "Tortelli di cinghiale, dashi di orata, cipollina, shiso": "Tortelli de sanglier, dashi de dorade, ciboule, shiso", "Tubetti “<em>Mancini</em>”, baccalà, kosho di agrumi, borlotti": "Tubetti “<em>Mancini</em>”, morue, kosho d’agrumes, haricots borlotti", "Ombrina nostrana pescata ad amo, salicornia, indivia belga": "Ombrine locale à la ligne, salicorne, endive belge", "Gelato al limone nero, levistico, lime, cracker di latte": "Glace au citron noir, livèche, citron vert, cracker au lait", "Ostriche Fine de Claire": "Huîtres Fine de Claire", "Ostriche Antilope": "Huîtres Antilope", "Ostriche Enrico IV": "Huîtres Enrico IV", "Scampi nostrani": "Langoustines locales", "Gamberi viola nostrani": "Crevettes violettes locales", "Selezione solamente di pesci nostrani pescati ad amo": "Sélection exclusivement de poissons locaux pêchés à la ligne", "Degustazione di mare": "Dégustation de la mer", "Calamaro nostrano, piselli freschi, bagna cauda leggera, kefir": "Calamar local, petits pois frais, bagna cauda légère, kéfir", "Cavolo cappuccio, miso, lamponi, anacardi": "Chou pommé, miso, framboises, noix de cajou", "Animella di vitello, sedano rapa, nocciole, riduzione di fondo di pesce": "Ris de veau, céleri-rave, noisettes, réduction de fond de poisson", "“Non formaggi”": "“Non-fromages”", "(Degustazione di finti formaggi artigianali a base anacardi e latte di mandorla)": "(Dégustation de faux fromages artisanaux à base de noix de cajou et lait d’amande)", "Spaghettoni quadrati “<em>Mancini</em>”, anemoni di mare, nduja, maggiorana": "Spaghettoni carrés “<em>Mancini</em>”, anémones de mer, nduja, marjolaine", "Tubetti “<em>Mancini</em>”, baccalà, il nostro kosho di agrumi fermentato, borlotti": "Tubetti “<em>Mancini</em>”, morue, notre kosho d’agrumes fermenté, borlotti", "Riso “<em>Riserva San Massimo</em>”, ragù di lepre, cime di rapa, Parmigiano Reggiano": "Riz “<em>Riserva San Massimo</em>”, ragû de lièvre, fanes de navet, Parmigiano Reggiano", "Polpo nostrano, rabarbaro, piselli": "Poulpe local, rhubarbe, petits pois", "Zucchina alla scapece, menta, yogurt, pepe Timut": "Courgette en escabèche, menthe, yaourt, poivre Timut", "Picanha, cardoncelli, fondo di manzo": "Picanha, pleurotes du panicaut, jus de bœuf", "Gambero viola crudo": "Crevette violette crue", "Agnello": "Agneau"}, "orario": {"Martedì": "Mardi", "Dal mercoledì al sabato": "Du mercredi au samedi", "Domenica": "Dimanche"}, "links": ["<u>Menu Italiano</u>", "<u>English Menu</u>", "<u>Speisekarte auf Deutsch</u>", "<u>Carta en Español</u>"]}, "de": {"lang": "de", "lang_label": "Deutsch", "title": "Speisekarte — Santamonica", "degu_titolo": "Degustationsmenü", "degu_portate_label": "Gänge", "degu_vini_label": "Weinbegleitung", "degu_nota": "Preis pro Person, Menü für den gesamten Tisch.", "degu_intero_tavolo": "den gesamten Tisch", "percorso_7": "Menü nach freier Wahl des Küchenchefs", "note_carta_1": "Um die Qualität und die organoleptischen Eigenschaften der Rohstoffe konstant zu halten, werden frisch eingekaufte Fischprodukte schockgefrostet. Diese Produkte sind mit dem Symbol * gekennzeichnet.", "note_carta_2": "Die Liste der Allergene finden Sie auf der letzten Seite dieser Speisekarte.", "note_ospite_titolo": "Hinweis für unsere Gäste", "note_orario": "Um die Qualität konstant zu halten, werden frische Fischprodukte schockgefrostet und mit dem Symbol * gekennzeichnet.", "orario_titolo": "ÖFFNUNGSZEITEN:", "titolo_degustazione": "Degustationsmenü", "sezioni": {"Crudi": "Rohkost", "Sfiziosi": "Vorspeisen", "Amidi e Carboidrati": "Pasta & Getreide", "Non Solo Mare": "Nicht Nur Meer"}, "unita": {"cad.": "Stk."}, "piatti": {"Ali di razza, fave nostrane, mela verde, mandorle": "Rochenflügel, heimische Saubohnen, grüner Apfel, Mandeln", "Animella di vitello, sedano rapa, nocciole, fondo di pesce": "Kalbsbries, Knollensellerie, Haselnüsse, Fischfond", "Tortelli di cinghiale, dashi di orata, cipollina, shiso": "Wildschweintortelli, Goldbrassen-Dashi, Frühlingszwiebel, Shiso", "Tubetti “<em>Mancini</em>”, baccalà, kosho di agrumi, borlotti": "Tubetti “<em>Mancini</em>”, Stockfisch, Zitruskosho, Borlottibohnen", "Ombrina nostrana pescata ad amo, salicornia, indivia belga": "Lokal geangelter Umberfisch, Queller, Chicorée", "Gelato al limone nero, levistico, lime, cracker di latte": "Schwarzzitronen-Eis, Liebstöckel, Limette, Milchcracker", "Ostriche Fine de Claire": "Fine de Claire Austern", "Ostriche Antilope": "Antilope Austern", "Ostriche Enrico IV": "Enrico IV Austern", "Scampi nostrani": "Heimische Scampi", "Gamberi viola nostrani": "Heimische Violettgarnelen", "Selezione solamente di pesci nostrani pescati ad amo": "Auswahl ausschließlich heimischer Angelfische", "Degustazione di mare": "Meeresverkostung", "Calamaro nostrano, piselli freschi, bagna cauda leggera, kefir": "Heimischer Tintenfisch, frische Erbsen, leichte Bagna Cauda, Kefir", "Cavolo cappuccio, miso, lamponi, anacardi": "Weißkohl, Miso, Himbeeren, Cashewnüsse", "Animella di vitello, sedano rapa, nocciole, riduzione di fondo di pesce": "Kalbsbries, Knollensellerie, Haselnüsse, Fischfondreduktion", "“Non formaggi”": "“Kein Käse”", "(Degustazione di finti formaggi artigianali a base anacardi e latte di mandorla)": "(Verkostung handwerklicher Pseudokäse auf Cashew- und Mandelmilchbasis)", "Spaghettoni quadrati “<em>Mancini</em>”, anemoni di mare, nduja, maggiorana": "Quadratische Spaghettoni “<em>Mancini</em>”, Seeanemonen, Nduja, Majoran", "Tubetti “<em>Mancini</em>”, baccalà, il nostro kosho di agrumi fermentato, borlotti": "Tubetti “<em>Mancini</em>”, Stockfisch, unser fermentiertes Zitruskosho, Borlottibohnen", "Riso “<em>Riserva San Massimo</em>”, ragù di lepre, cime di rapa, Parmigiano Reggiano": "Reis “<em>Riserva San Massimo</em>”, Hasenragù, Steckrübenblätter, Parmigiano Reggiano", "Polpo nostrano, rabarbaro, piselli": "Heimischer Oktopus, Rhabarber, Erbsen", "Zucchina alla scapece, menta, yogurt, pepe Timut": "Marinierte Zucchini, Minze, Joghurt, Timutpfeffer", "Picanha, cardoncelli, fondo di manzo": "Picanha, Königskräuterseitlinge, Rinderjus", "Gambero viola crudo": "Rohe Violettgarnele", "Agnello": "Lamm"}, "orario": {"Martedì": "Dienstag", "Dal mercoledì al sabato": "Mittwoch bis Samstag", "Domenica": "Sonntag"}, "links": ["<u>Menu Italiano</u>", "<u>English Menu</u>", "<u>Carte en Française</u>", "<u>Carta en Español</u>"]}, "es": {"lang": "es", "lang_label": "Español", "title": "Carta — Santamonica", "degu_titolo": "Menú Degustación", "degu_portate_label": "platos", "degu_vini_label": "maridaje de vinos", "degu_nota": "Precio por persona, menú para toda la mesa.", "degu_intero_tavolo": "toda la mesa", "percorso_7": "Menú a libre elección del Chef", "note_carta_1": "Para mantener constantes el nivel cualitativo y las características organolépticas de las materias primas, los productos de pescado comprados frescos se someten a ultracongelación. Estos productos se señalan con el símbolo * para una información clara y transparente.", "note_carta_2": "La lista de alérgenos se puede consultar en la última página de esta carta.", "note_ospite_titolo": "Nota para nuestros huéspedes", "note_orario": "Para mantener constantes el nivel cualitativo y las características organolépticas, los productos frescos se ultracongelan y se señalan con el símbolo: *", "orario_titolo": "HORARIO DE SERVICIO:", "titolo_degustazione": "Menú Degustación", "sezioni": {"Crudi": "Crudos", "Sfiziosi": "Entrantes", "Amidi e Carboidrati": "Pastas & Cereales", "Non Solo Mare": "No Solo Mar"}, "unita": {"cad.": "ud."}, "piatti": {"Ali di razza, fave nostrane, mela verde, mandorle": "Aleta de raya, habas locales, manzana verde, almendras", "Animella di vitello, sedano rapa, nocciole, fondo di pesce": "Mollejas de ternera, apio nabo, avellanas, fondo de pescado", "Tortelli di cinghiale, dashi di orata, cipollina, shiso": "Tortelli de jabalí, dashi de dorada, cebolleta, shiso", "Tubetti “<em>Mancini</em>”, baccalà, kosho di agrumi, borlotti": "Tubetti “<em>Mancini</em>”, bacalao, kosho de cítricos, alubias borlotti", "Ombrina nostrana pescata ad amo, salicornia, indivia belga": "Corvina local de anzuelo, salicornia, endibia belga", "Gelato al limone nero, levistico, lime, cracker di latte": "Helado de limón negro, levístico, lima, cracker de leche", "Ostriche Fine de Claire": "Ostras Fine de Claire", "Ostriche Antilope": "Ostras Antilope", "Ostriche Enrico IV": "Ostras Enrico IV", "Scampi nostrani": "Cigalas locales", "Gamberi viola nostrani": "Gambas violetas locales", "Selezione solamente di pesci nostrani pescati ad amo": "Selección exclusivamente de pescados locales de anzuelo", "Degustazione di mare": "Degustación del mar", "Calamaro nostrano, piselli freschi, bagna cauda leggera, kefir": "Calamar local, guisantes frescos, bagna cauda ligera, kéfir", "Cavolo cappuccio, miso, lamponi, anacardi": "Col repollo, miso, frambuesas, anacardos", "Animella di vitello, sedano rapa, nocciole, riduzione di fondo di pesce": "Mollejas de ternera, apio nabo, avellanas, reducción de fondo de pescado", "“Non formaggi”": "“No quesos”", "(Degustazione di finti formaggi artigianali a base anacardi e latte di mandorla)": "(Degustación de falsos quesos artesanales a base de anacardos y leche de almendra)", "Spaghettoni quadrati “<em>Mancini</em>”, anemoni di mare, nduja, maggiorana": "Spaghettoni cuadrados “<em>Mancini</em>”, anémonas de mar, nduja, mejorana", "Tubetti “<em>Mancini</em>”, baccalà, il nostro kosho di agrumi fermentato, borlotti": "Tubetti “<em>Mancini</em>”, bacalao, nuestro kosho de cítricos fermentado, borlotti", "Riso “<em>Riserva San Massimo</em>”, ragù di lepre, cime di rapa, Parmigiano Reggiano": "Arroz “<em>Riserva San Massimo</em>”, ragú de liebre, grelos, Parmigiano Reggiano", "Polpo nostrano, rabarbaro, piselli": "Pulpo local, ruibarbo, guisantes", "Zucchina alla scapece, menta, yogurt, pepe Timut": "Calabacín en escabeche, menta, yogur, pimienta Timut", "Picanha, cardoncelli, fondo di manzo": "Picanha, setas cardoncelli, jugo de ternera", "Gambero viola crudo": "Gamba violeta cruda", "Agnello": "Cordero"}, "orario": {"Martedì": "Martes", "Dal mercoledì al sabato": "De miércoles a sábado", "Domenica": "Domingo"}, "links": ["<u>Menu Italiano</u>", "<u>English Menu</u>", "<u>Carte en Française</u>", "<u>Speisekarte auf Deutsch</u>"]}};

function traduci() {
  if (!dati) { alert('Prima carica il menù'); return; }
  var m = leggi();
  var btn = document.getElementById('btn-traduci');

  // Raccogli TUTTI i nomi da tradurre (non solo quelli mancanti)
  var testi = [];

  m.degustazione.percorsi['6'].forEach(function(p) {
    if (p.nome) testi.push(p.nome);
  });
  m.sezioni.forEach(function(sez) {
    sez.piatti.forEach(function(p) {
      if (p.nome) testi.push(p.nome);
      if (p.descrizione) testi.push(p.descrizione);
    });
  });

  // Rimuovi duplicati e stringhe vuote
  testi = testi.filter(function(v, i, a) { return v && a.indexOf(v) === i; });

  if (testi.length === 0) { toast('Nessun testo da tradurre'); return; }

  btn.textContent = '\u23f3 0/' + testi.length + '\u2026';
  btn.classList.add('translating');
  btn.disabled = true;

  var langs = ['en', 'fr', 'de', 'es'];
  var langPair = { en: 'it-IT|en-GB', fr: 'it-IT|fr-FR', de: 'it-IT|de-DE', es: 'it-IT|es-ES' };
  var completati = 0;
  var totale = testi.length * langs.length;

  langs.forEach(function(lang) {
    testi.forEach(function(testo) {
      var url = 'https://api.mymemory.translated.net/get?q=' +
        encodeURIComponent(testo) + '&langpair=' + langPair[lang];

      fetch(url)
        .then(function(r) { return r.json(); })
        .then(function(data) {
          var trad = data.responseData && data.responseData.translatedText;
          if (trad) TRANSLATIONS[lang]['piatti'][testo] = trad;
        })
        .catch(function() {}) // ignora errori singoli
        .finally(function() {
          completati++;
          btn.textContent = '\u23f3 ' + completati + '/' + totale + '\u2026';
          if (completati >= totale) {
            btn.textContent = '\uD83C\uDF10 Traduci';
            btn.classList.remove('translating');
            btn.disabled = false;
            toast('\u2713 ' + testi.length + ' voci tradotte in 4 lingue!');
          }
        });
    });
  });
}


function costruisciMenuTradotto(menuForm, t) {
  var orig = dati;
  var m = JSON.parse(JSON.stringify(menuForm));
  var piatti = t.piatti;

  // Usa sempre il nome nel form come chiave — Traduci ha già aggiornato il dizionario
  function tr(n) { return piatti[n] || n; }

  m.degustazione.nota = t.degu_nota;
  m.degustazione.percorsi['7'] = t.percorso_7;
  m.degustazione.percorsi['6'].forEach(function(p) {
    if (p) p.nome = tr(p.nome);
  });

  m.sezioni.forEach(function(sez, si) {
    var origSez = dati.sezioni[si];
    if (!origSez) return;
    sez.titolo_display = t.sezioni[sez.titolo] || t.sezioni[origSez.titolo] || t.piatti[sez.titolo] || sez.titolo;
    sez.piatti.forEach(function(p) {
      if (!p) return;
      p.nome = tr(p.nome);
      if (p.unita) p.unita = t.unita[p.unita] || p.unita;
      if (p.descrizione) p.descrizione = tr(p.descrizione);
    });
  });

  m.orario.orarioServizio.forEach(function(o) {
    o.giorno = t.orario[o.giorno] || o.giorno;
  });
  return m;
}

function costruisciHtmlTradotto(lang, t) {
  var src = outputCorrente;
  var menuForm = leggi();
  var m = costruisciMenuTradotto(menuForm, t);

  var SEP = '/* ' + '\u2550'.repeat(57) + ' */\n';
  var START = 'const MENU = {';
  var i1 = src.indexOf(START);
  var i2 = src.indexOf(SEP, i1) + SEP.length;
  var newBlock = 'const MENU = ' + JSON.stringify(m, null, 2) + ';\n' + SEP;
  var html = src.slice(0, i1) + newBlock + src.slice(i2);

  html = html.replace('<html lang="it">', '<html lang="' + lang + '">');
  html = html.replace(/<title>[^<]*<\/title>/, '<title>' + t.title + '</title>');

  html = html.replace(/Note per l'ospite<\/span>[^`]*`/,
    t.note_ospite_titolo + '</span>\n  ' + t.note_carta_1 + '<br>\n  ' + t.note_carta_2 + '\n`');
  html = html.replace(/Per mantenere costanti[\s\S]*?simbolo: \*`/,
    t.note_orario + '`');
  html = html.replace('Men\u00f9\u2019 Degustazione', t.titolo_degustazione);
  html = html.replace('Men&ugrave;&rsquo; Degustazione', t.titolo_degustazione);
  html = html.replace(/\$\{o\.portate\} portate/g, '${o.portate} ' + t.degu_portate_label);
  html = html.replace(/eventuale abbinamento vini/g, t.degu_vini_label);
  html = html.replace('ORARIO DI SERVIZIO:', t.orario_titolo);
  html = html.replace(
    /<u><em>English Menu<\/em><\/u><br>\s*<u><em>Carte en Fran[^<]*<\/em><\/u>/,
    t.links.join('<br>\n            ')
  );
  return html;
}

function apriPreview(lang) {
  if (!dati) { alert('Prima carica il menù'); return; }
  document.getElementById('preview-menu').classList.remove('open');
  outputCorrente = costruisciOutput();
  if (!lang || lang === 'it') {
    // Italiano: genera al volo
    var blob = new Blob([outputCorrente], { type: 'text/html;charset=utf-8' });
    window.open(URL.createObjectURL(blob), '_blank').focus();
  } else {
    // Lingue: apri direttamente da GitHub Pages
    var base = 'https://santamonicagenova-a11y.github.io/SantaWeb/menu-' + lang + '.html';
    window.open(base + '?v=' + Date.now(), '_blank').focus();
  }
}

function caricaDalSito() {
  var btn = document.querySelector('.btn-load');
  document.getElementById('err').textContent = '';
  fetch(MENU_URL + '?nocache=' + Date.now())
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
  eseguiPubblicazione(token);
  var btn = document.getElementById('btn-pubblica');
  if (btn) { btn.textContent = '✦ Traduci e Pubblica'; btn.disabled = false; }
}

function chiudiModal() {
  document.getElementById('modal-token').classList.remove('on');
}

var TRANSLATIONS = {"en": {"lang": "en", "lang_label": "English", "title": "Menu — Santamonica", "degu_titolo": "Tasting Menu", "degu_portate_label": "courses", "degu_vini_label": "wine pairing", "degu_nota": "Price per person, menu to be shared by the whole table.", "degu_intero_tavolo": "the whole table", "percorso_7": "Chef's free interpretation menu", "note_carta_1": "To maintain consistent quality and organoleptic characteristics of raw ingredients, fresh fish products are blast-frozen after purchase. These products are marked with the symbol * for clear and transparent customer information.", "note_carta_2": "The list of allergens is available on the last page of this menu.", "note_ospite_titolo": "Guest notes", "note_orario": "To maintain consistent quality standards and organoleptic characteristics, fresh fish products are blast-frozen. These products are marked with the symbol: *", "orario_titolo": "OPENING HOURS:", "titolo_degustazione": "Tasting Menu", "sezioni": {"Crudi": "Raw", "Sfiziosi": "Starters", "Amidi e Carboidrati": "Pasta & Grains", "Non Solo Mare": "Not Only Sea"}, "unita": {"cad.": "ea."}, "piatti": {"Ali di razza, fave nostrane, mela verde, mandorle": "Skate wing, local broad beans, green apple, almonds", "Animella di vitello, sedano rapa, nocciole, fondo di pesce": "Veal sweetbread, celeriac, hazelnuts, fish stock", "Tortelli di cinghiale, dashi di orata, cipollina, shiso": "Wild boar tortelli, sea bream dashi, spring onion, shiso", "Tubetti “<em>Mancini</em>”, baccalà, kosho di agrumi, borlotti": "Tubetti “<em>Mancini</em>”, salt cod, citrus kosho, borlotti beans", "Ombrina nostrana pescata ad amo, salicornia, indivia belga": "Line-caught local meagre, sea purslane, Belgian endive", "Gelato al limone nero, levistico, lime, cracker di latte": "Black lemon ice cream, lovage, lime, milk cracker", "Ostriche Fine de Claire": "Fine de Claire Oysters", "Ostriche Antilope": "Antilope Oysters", "Ostriche Enrico IV": "Enrico IV Oysters", "Scampi nostrani": "Local langoustines", "Gamberi viola nostrani": "Local purple prawns", "Selezione solamente di pesci nostrani pescati ad amo": "Selection of local line-caught fish only", "Degustazione di mare": "Sea tasting", "Calamaro nostrano, piselli freschi, bagna cauda leggera, kefir": "Local squid, fresh peas, light bagna cauda, kefir", "Cavolo cappuccio, miso, lamponi, anacardi": "Cabbage, miso, raspberries, cashews", "Animella di vitello, sedano rapa, nocciole, riduzione di fondo di pesce": "Veal sweetbread, celeriac, hazelnuts, fish stock reduction", "“Non formaggi”": "“Not cheese”", "(Degustazione di finti formaggi artigianali a base anacardi e latte di mandorla)": "(Tasting of artisan fake cheeses made with cashews and almond milk)", "Spaghettoni quadrati “<em>Mancini</em>”, anemoni di mare, nduja, maggiorana": "Square spaghettoni “<em>Mancini</em>”, sea anemones, nduja, marjoram", "Tubetti “<em>Mancini</em>”, baccalà, il nostro kosho di agrumi fermentato, borlotti": "Tubetti “<em>Mancini</em>”, salt cod, our fermented citrus kosho, borlotti beans", "Riso “<em>Riserva San Massimo</em>”, ragù di lepre, cime di rapa, Parmigiano Reggiano": "Rice “<em>Riserva San Massimo</em>”, hare ragù, turnip tops, Parmigiano Reggiano", "Polpo nostrano, rabarbaro, piselli": "Local octopus, rhubarb, peas", "Zucchina alla scapece, menta, yogurt, pepe Timut": "Marinated courgette, mint, yogurt, Timut pepper", "Picanha, cardoncelli, fondo di manzo": "Picanha, king oyster mushrooms, beef jus", "Gambero viola crudo": "Raw purple prawn", "Agnello": "Lamb"}, "orario": {"Martedì": "Tuesday", "Dal mercoledì al sabato": "Wednesday to Saturday", "Domenica": "Sunday"}, "links": ["<u>Italian Menu</u>", "<u>Carte en Française</u>", "<u>Speisekarte auf Deutsch</u>", "<u>Carta en Español</u>"]}, "fr": {"lang": "fr", "lang_label": "Français", "title": "Menu — Santamonica", "degu_titolo": "Menu Dégustation", "degu_portate_label": "plats", "degu_vini_label": "accord mets-vins", "degu_nota": "Prix par personne, menu à partager par toute la table.", "degu_intero_tavolo": "toute la table", "percorso_7": "Menu carte blanche du Chef", "note_carta_1": "Pour maintenir constants le niveau qualitatif et les caractéristiques organoleptiques des matières premières, les produits de la mer achetés frais sont surgelés à basse température. Ces produits sont signalés par le symbole * pour une information claire et transparente à la clientèle.", "note_carta_2": "La liste des allergènes est consultable à la dernière page de ce menu.", "note_ospite_titolo": "Note pour nos hôtes", "note_orario": "Pour maintenir constants le niveau qualitatif et les caractéristiques organoleptiques, les produits frais sont surgelés à basse température. Ces produits sont signalés par le symbole : *", "orario_titolo": "HORAIRES D'OUVERTURE :", "titolo_degustazione": "Menu Dégustation", "sezioni": {"Crudi": "Crus", "Sfiziosi": "Entrées", "Amidi e Carboidrati": "Pâtes & Céréales", "Non Solo Mare": "Pas Seulement la Mer"}, "unita": {"cad.": "p."}, "piatti": {"Ali di razza, fave nostrane, mela verde, mandorle": "Aile de raie, fèves locales, pomme verte, amandes", "Animella di vitello, sedano rapa, nocciole, fondo di pesce": "Ris de veau, céleri-rave, noisettes, fond de poisson", "Tortelli di cinghiale, dashi di orata, cipollina, shiso": "Tortelli de sanglier, dashi de dorade, ciboule, shiso", "Tubetti “<em>Mancini</em>”, baccalà, kosho di agrumi, borlotti": "Tubetti “<em>Mancini</em>”, morue, kosho d’agrumes, haricots borlotti", "Ombrina nostrana pescata ad amo, salicornia, indivia belga": "Ombrine locale à la ligne, salicorne, endive belge", "Gelato al limone nero, levistico, lime, cracker di latte": "Glace au citron noir, livèche, citron vert, cracker au lait", "Ostriche Fine de Claire": "Huîtres Fine de Claire", "Ostriche Antilope": "Huîtres Antilope", "Ostriche Enrico IV": "Huîtres Enrico IV", "Scampi nostrani": "Langoustines locales", "Gamberi viola nostrani": "Crevettes violettes locales", "Selezione solamente di pesci nostrani pescati ad amo": "Sélection exclusivement de poissons locaux pêchés à la ligne", "Degustazione di mare": "Dégustation de la mer", "Calamaro nostrano, piselli freschi, bagna cauda leggera, kefir": "Calamar local, petits pois frais, bagna cauda légère, kéfir", "Cavolo cappuccio, miso, lamponi, anacardi": "Chou pommé, miso, framboises, noix de cajou", "Animella di vitello, sedano rapa, nocciole, riduzione di fondo di pesce": "Ris de veau, céleri-rave, noisettes, réduction de fond de poisson", "“Non formaggi”": "“Non-fromages”", "(Degustazione di finti formaggi artigianali a base anacardi e latte di mandorla)": "(Dégustation de faux fromages artisanaux à base de noix de cajou et lait d’amande)", "Spaghettoni quadrati “<em>Mancini</em>”, anemoni di mare, nduja, maggiorana": "Spaghettoni carrés “<em>Mancini</em>”, anémones de mer, nduja, marjolaine", "Tubetti “<em>Mancini</em>”, baccalà, il nostro kosho di agrumi fermentato, borlotti": "Tubetti “<em>Mancini</em>”, morue, notre kosho d’agrumes fermenté, borlotti", "Riso “<em>Riserva San Massimo</em>”, ragù di lepre, cime di rapa, Parmigiano Reggiano": "Riz “<em>Riserva San Massimo</em>”, ragû de lièvre, fanes de navet, Parmigiano Reggiano", "Polpo nostrano, rabarbaro, piselli": "Poulpe local, rhubarbe, petits pois", "Zucchina alla scapece, menta, yogurt, pepe Timut": "Courgette en escabèche, menthe, yaourt, poivre Timut", "Picanha, cardoncelli, fondo di manzo": "Picanha, pleurotes du panicaut, jus de bœuf", "Gambero viola crudo": "Crevette violette crue", "Agnello": "Agneau"}, "orario": {"Martedì": "Mardi", "Dal mercoledì al sabato": "Du mercredi au samedi", "Domenica": "Dimanche"}, "links": ["<u>Menu Italiano</u>", "<u>English Menu</u>", "<u>Speisekarte auf Deutsch</u>", "<u>Carta en Español</u>"]}, "de": {"lang": "de", "lang_label": "Deutsch", "title": "Speisekarte — Santamonica", "degu_titolo": "Degustationsmenü", "degu_portate_label": "Gänge", "degu_vini_label": "Weinbegleitung", "degu_nota": "Preis pro Person, Menü für den gesamten Tisch.", "degu_intero_tavolo": "den gesamten Tisch", "percorso_7": "Menü nach freier Wahl des Küchenchefs", "note_carta_1": "Um die Qualität und die organoleptischen Eigenschaften der Rohstoffe konstant zu halten, werden frisch eingekaufte Fischprodukte schockgefrostet. Diese Produkte sind mit dem Symbol * gekennzeichnet.", "note_carta_2": "Die Liste der Allergene finden Sie auf der letzten Seite dieser Speisekarte.", "note_ospite_titolo": "Hinweis für unsere Gäste", "note_orario": "Um die Qualität konstant zu halten, werden frische Fischprodukte schockgefrostet und mit dem Symbol * gekennzeichnet.", "orario_titolo": "ÖFFNUNGSZEITEN:", "titolo_degustazione": "Degustationsmenü", "sezioni": {"Crudi": "Rohkost", "Sfiziosi": "Vorspeisen", "Amidi e Carboidrati": "Pasta & Getreide", "Non Solo Mare": "Nicht Nur Meer"}, "unita": {"cad.": "Stk."}, "piatti": {"Ali di razza, fave nostrane, mela verde, mandorle": "Rochenflügel, heimische Saubohnen, grüner Apfel, Mandeln", "Animella di vitello, sedano rapa, nocciole, fondo di pesce": "Kalbsbries, Knollensellerie, Haselnüsse, Fischfond", "Tortelli di cinghiale, dashi di orata, cipollina, shiso": "Wildschweintortelli, Goldbrassen-Dashi, Frühlingszwiebel, Shiso", "Tubetti “<em>Mancini</em>”, baccalà, kosho di agrumi, borlotti": "Tubetti “<em>Mancini</em>”, Stockfisch, Zitruskosho, Borlottibohnen", "Ombrina nostrana pescata ad amo, salicornia, indivia belga": "Lokal geangelter Umberfisch, Queller, Chicorée", "Gelato al limone nero, levistico, lime, cracker di latte": "Schwarzzitronen-Eis, Liebstöckel, Limette, Milchcracker", "Ostriche Fine de Claire": "Fine de Claire Austern", "Ostriche Antilope": "Antilope Austern", "Ostriche Enrico IV": "Enrico IV Austern", "Scampi nostrani": "Heimische Scampi", "Gamberi viola nostrani": "Heimische Violettgarnelen", "Selezione solamente di pesci nostrani pescati ad amo": "Auswahl ausschließlich heimischer Angelfische", "Degustazione di mare": "Meeresverkostung", "Calamaro nostrano, piselli freschi, bagna cauda leggera, kefir": "Heimischer Tintenfisch, frische Erbsen, leichte Bagna Cauda, Kefir", "Cavolo cappuccio, miso, lamponi, anacardi": "Weißkohl, Miso, Himbeeren, Cashewnüsse", "Animella di vitello, sedano rapa, nocciole, riduzione di fondo di pesce": "Kalbsbries, Knollensellerie, Haselnüsse, Fischfondreduktion", "“Non formaggi”": "“Kein Käse”", "(Degustazione di finti formaggi artigianali a base anacardi e latte di mandorla)": "(Verkostung handwerklicher Pseudokäse auf Cashew- und Mandelmilchbasis)", "Spaghettoni quadrati “<em>Mancini</em>”, anemoni di mare, nduja, maggiorana": "Quadratische Spaghettoni “<em>Mancini</em>”, Seeanemonen, Nduja, Majoran", "Tubetti “<em>Mancini</em>”, baccalà, il nostro kosho di agrumi fermentato, borlotti": "Tubetti “<em>Mancini</em>”, Stockfisch, unser fermentiertes Zitruskosho, Borlottibohnen", "Riso “<em>Riserva San Massimo</em>”, ragù di lepre, cime di rapa, Parmigiano Reggiano": "Reis “<em>Riserva San Massimo</em>”, Hasenragù, Steckrübenblätter, Parmigiano Reggiano", "Polpo nostrano, rabarbaro, piselli": "Heimischer Oktopus, Rhabarber, Erbsen", "Zucchina alla scapece, menta, yogurt, pepe Timut": "Marinierte Zucchini, Minze, Joghurt, Timutpfeffer", "Picanha, cardoncelli, fondo di manzo": "Picanha, Königskräuterseitlinge, Rinderjus", "Gambero viola crudo": "Rohe Violettgarnele", "Agnello": "Lamm"}, "orario": {"Martedì": "Dienstag", "Dal mercoledì al sabato": "Mittwoch bis Samstag", "Domenica": "Sonntag"}, "links": ["<u>Menu Italiano</u>", "<u>English Menu</u>", "<u>Carte en Française</u>", "<u>Carta en Español</u>"]}, "es": {"lang": "es", "lang_label": "Español", "title": "Carta — Santamonica", "degu_titolo": "Menú Degustación", "degu_portate_label": "platos", "degu_vini_label": "maridaje de vinos", "degu_nota": "Precio por persona, menú para toda la mesa.", "degu_intero_tavolo": "toda la mesa", "percorso_7": "Menú a libre elección del Chef", "note_carta_1": "Para mantener constantes el nivel cualitativo y las características organolépticas de las materias primas, los productos de pescado comprados frescos se someten a ultracongelación. Estos productos se señalan con el símbolo * para una información clara y transparente.", "note_carta_2": "La lista de alérgenos se puede consultar en la última página de esta carta.", "note_ospite_titolo": "Nota para nuestros huéspedes", "note_orario": "Para mantener constantes el nivel cualitativo y las características organolépticas, los productos frescos se ultracongelan y se señalan con el símbolo: *", "orario_titolo": "HORARIO DE SERVICIO:", "titolo_degustazione": "Menú Degustación", "sezioni": {"Crudi": "Crudos", "Sfiziosi": "Entrantes", "Amidi e Carboidrati": "Pastas & Cereales", "Non Solo Mare": "No Solo Mar"}, "unita": {"cad.": "ud."}, "piatti": {"Ali di razza, fave nostrane, mela verde, mandorle": "Aleta de raya, habas locales, manzana verde, almendras", "Animella di vitello, sedano rapa, nocciole, fondo di pesce": "Mollejas de ternera, apio nabo, avellanas, fondo de pescado", "Tortelli di cinghiale, dashi di orata, cipollina, shiso": "Tortelli de jabalí, dashi de dorada, cebolleta, shiso", "Tubetti “<em>Mancini</em>”, baccalà, kosho di agrumi, borlotti": "Tubetti “<em>Mancini</em>”, bacalao, kosho de cítricos, alubias borlotti", "Ombrina nostrana pescata ad amo, salicornia, indivia belga": "Corvina local de anzuelo, salicornia, endibia belga", "Gelato al limone nero, levistico, lime, cracker di latte": "Helado de limón negro, levístico, lima, cracker de leche", "Ostriche Fine de Claire": "Ostras Fine de Claire", "Ostriche Antilope": "Ostras Antilope", "Ostriche Enrico IV": "Ostras Enrico IV", "Scampi nostrani": "Cigalas locales", "Gamberi viola nostrani": "Gambas violetas locales", "Selezione solamente di pesci nostrani pescati ad amo": "Selección exclusivamente de pescados locales de anzuelo", "Degustazione di mare": "Degustación del mar", "Calamaro nostrano, piselli freschi, bagna cauda leggera, kefir": "Calamar local, guisantes frescos, bagna cauda ligera, kéfir", "Cavolo cappuccio, miso, lamponi, anacardi": "Col repollo, miso, frambuesas, anacardos", "Animella di vitello, sedano rapa, nocciole, riduzione di fondo di pesce": "Mollejas de ternera, apio nabo, avellanas, reducción de fondo de pescado", "“Non formaggi”": "“No quesos”", "(Degustazione di finti formaggi artigianali a base anacardi e latte di mandorla)": "(Degustación de falsos quesos artesanales a base de anacardos y leche de almendra)", "Spaghettoni quadrati “<em>Mancini</em>”, anemoni di mare, nduja, maggiorana": "Spaghettoni cuadrados “<em>Mancini</em>”, anémonas de mar, nduja, mejorana", "Tubetti “<em>Mancini</em>”, baccalà, il nostro kosho di agrumi fermentato, borlotti": "Tubetti “<em>Mancini</em>”, bacalao, nuestro kosho de cítricos fermentado, borlotti", "Riso “<em>Riserva San Massimo</em>”, ragù di lepre, cime di rapa, Parmigiano Reggiano": "Arroz “<em>Riserva San Massimo</em>”, ragú de liebre, grelos, Parmigiano Reggiano", "Polpo nostrano, rabarbaro, piselli": "Pulpo local, ruibarbo, guisantes", "Zucchina alla scapece, menta, yogurt, pepe Timut": "Calabacín en escabeche, menta, yogur, pimienta Timut", "Picanha, cardoncelli, fondo di manzo": "Picanha, setas cardoncelli, jugo de ternera", "Gambero viola crudo": "Gamba violeta cruda", "Agnello": "Cordero"}, "orario": {"Martedì": "Martes", "Dal mercoledì al sabato": "De miércoles a sábado", "Domenica": "Domingo"}, "links": ["<u>Menu Italiano</u>", "<u>English Menu</u>", "<u>Carte en Française</u>", "<u>Speisekarte auf Deutsch</u>"]}};

function traduci() {
  if (!dati) { alert('Prima carica il menù'); return; }
  var m = leggi();
  var btn = document.getElementById('btn-traduci');

  // Raccogli i nomi dal form, usando 'dati' come riferimento posizionale per le chiavi
  var mancanti = [];

  // Degustazione percorso 6
  dati.degustazione.percorsi['6'].forEach(function(origP, i) {
    var formP = m.degustazione.percorsi['6'][i];
    if (!formP) return;
    var nome = formP.nome;
    if (!TRANSLATIONS['en']['piatti'][nome]) mancanti.push(nome);
  });

  // Sezioni
  dati.sezioni.forEach(function(origSez, si) {
    var formSez = m.sezioni[si];
    if (!formSez) return;
    formSez.piatti.forEach(function(formP) {
      if (!formP) return;
      if (formP.nome && !TRANSLATIONS['en']['piatti'][formP.nome]) mancanti.push(formP.nome);
      if (formP.descrizione && !TRANSLATIONS['en']['piatti'][formP.descrizione]) mancanti.push(formP.descrizione);
    });
  });

  // Rimuovi duplicati
  mancanti = mancanti.filter(function(v, i, a) { return a.indexOf(v) === i; });

  if (mancanti.length === 0) {
    toast('✓ Tutte le traduzioni sono già presenti');
    return;
  }

  btn.textContent = '⏳ ' + mancanti.length + ' voci...';
  btn.classList.add('translating');
  btn.disabled = true;

  var langs = ['en', 'fr', 'de', 'es'];
  var langMap = { en: 'it|en', fr: 'it|fr', de: 'it|de', es: 'it|es' };
  var completati = 0;
  var totale = mancanti.length * langs.length;

  langs.forEach(function(lang) {
    mancanti.forEach(function(testo) {
      var url = 'https://api.mymemory.translated.net/get?q=' +
        encodeURIComponent(testo) + '&langpair=' + langMap[lang];

      fetch(url)
        .then(function(r) { return r.json(); })
        .then(function(data) {
          var trad = data.responseData && data.responseData.translatedText;
          if (trad && trad !== testo) {
            TRANSLATIONS[lang]['piatti'][testo] = trad;
          }
          completati++;
          btn.textContent = '⏳ ' + completati + '/' + totale + '...';
          if (completati >= totale) {
            btn.textContent = '🌐 Traduci';
            btn.classList.remove('translating');
            btn.disabled = false;
            toast('✓ ' + mancanti.length + ' voc' + (mancanti.length === 1 ? 'e tradotta' : 'i tradotte') + '!');
          }
        })
        .catch(function() {
          completati++;
          if (completati >= totale) {
            btn.textContent = '🌐 Traduci';
            btn.classList.remove('translating');
            btn.disabled = false;
            toast('⚠ Alcune traduzioni potrebbero essere incomplete');
          }
        });
    });
  });
}


function traduciEPubblica() {
  if (!dati) { alert('Prima carica il menù'); return; }
  var btn = document.getElementById('btn-pubblica');

  // Raccogli tutti i testi dal form
  var m = leggi();
  var testi = [];
  m.degustazione.percorsi['6'].forEach(function(p) { if (p.nome) testi.push(p.nome); });
  m.sezioni.forEach(function(sez) {
    if (sez.titolo) testi.push(sez.titolo); // traduci anche il titolo sezione
    sez.piatti.forEach(function(p) {
      if (p.nome) testi.push(p.nome);
      if (p.descrizione) testi.push(p.descrizione);
    });
  });
  testi = testi.filter(function(v, i, a) { return v && a.indexOf(v) === i; });

  var langs = ['en', 'fr', 'de', 'es'];
  var coda = [];
  testi.forEach(function(testo) {
    langs.forEach(function(lang) { coda.push({ testo: testo, lang: lang }); });
  });

  var totale = coda.length;
  btn.textContent = '⏳ Traduzione 0/' + totale + '…';
  btn.disabled = true;

  function traduciVoce(i) {
    if (i >= coda.length) {
      // Traduzione completata — ora pubblica
      btn.textContent = '⏳ Pubblicazione…';
      var token = localStorage.getItem('gh_token') || '';
      if (token) {
        eseguiPubblicazione(token);
      } else {
        document.getElementById('token-input').value = '';
        document.getElementById('modal-token').classList.add('on');
      }
      btn.textContent = '✦ Traduci e Pubblica';
      btn.disabled = false;
      return;
    }
    var item = coda[i];
    btn.textContent = '⏳ Traduzione ' + (i+1) + '/' + totale + '…';

    var url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=it&tl=' +
      item.lang + '&dt=t&q=' + encodeURIComponent(item.testo);

    fetch(url)
      .then(function(r) { return r.json(); })
      .then(function(data) {
        var trad = data && data[0] && data[0][0] && data[0][0][0];
        if (trad) TRANSLATIONS[item.lang]['piatti'][item.testo] = trad;
      })
      .catch(function() {})
      .finally(function() { setTimeout(function() { traduciVoce(i + 1); }, 80); });
  }

  traduciVoce(0);
}

function pubblicaFile(token, headers, path, content) {
  var apiBase = 'https://api.github.com/repos/' + REPO_OWNER + '/' + REPO_NAME + '/contents/' + path;
  return fetch(apiBase, { headers: headers })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      var body = {
        message: 'Aggiornamento menu',
        content: btoa(unescape(encodeURIComponent(content)))
      };
      if (data.sha) body.sha = data.sha;
      return fetch(apiBase, { method: 'PUT', headers: headers, body: JSON.stringify(body) });
    });
}

function costruisciMenuItPub() {
  // Menu italiano pubblico: outputCorrente senza pulsanti carta/orario
  var BTNS = "  <button class=\"ctrl-btn active\" id=\"btn-carta\" onclick=\"showLayout('carta')\">\u261e Men\u00f9 alla carta (3 pag.)</button>\n  <div class=\"ctrl-sep\"></div>\n  <button class=\"ctrl-btn\" id=\"btn-orario\" onclick=\"showLayout('orario')\">\u261e Foglio orario (1 pag.)</button>\n  <div class=\"ctrl-sep\"></div>\n";
  var html = outputCorrente.replace(BTNS, '');
  html = html.replace("  document.getElementById('btn-carta').classList.toggle('active',  which === 'carta');\n  document.getElementById('btn-orario').classList.toggle('active', which === 'orario');", "  var bc=document.getElementById('btn-carta'); if(bc) bc.classList.toggle('active',which==='carta');\n  var bo=document.getElementById('btn-orario'); if(bo) bo.classList.toggle('active',which==='orario');");
  return html;
}

function eseguiPubblicazione(token) {

  var headers = {
    'Authorization': 'token ' + token,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json'
  };

  // Ricostruisci SEMPRE l'output dal form aggiornato (non da outputCorrente)
  outputCorrente = costruisciOutput();

  // File da pubblicare: IT + 4 traduzioni
  outputCorrente = costruisciOutput();
  var files = [
    { path: 'menu.html', content: outputCorrente, label: 'Italiano (admin)' },
    { path: 'menu-it.html', content: costruisciMenuItPub(), label: 'Italiano (pub)' }
  ];
  ['en','fr','de','es'].forEach(function(lang) {
    var t = TRANSLATIONS[lang];
    // Parti da menu-it.html (già senza pulsanti) e traduci
    var html = costruisciMenuItPub();
    var m = costruisciMenuTradotto(leggi(), t);
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
    html = html.replace(/<u><em>English Menu<\/em><\/u><br>\s*<u><em>Carte en Fran[^<]*<\/em><\/u>/, t.links.join('<br>\n            '));
    files.push({ path: 'menu-' + lang + '.html', content: html, label: lang.toUpperCase() });
  });

  toast('⏳ Pubblicazione in corso…');

  var i = 0;
  function next() {
    if (i >= files.length) {
      toast('✓ Pubblicato! Ricarica tra 90 secondi…');
      setTimeout(function() {
        toast('⏳ Ricarico dal sito…');
        setTimeout(caricaDalSito, 1500);
      }, 90000);
      return;
    }
    var f = files[i++];
    pubblicaFile(token, headers, f.path, f.content)
      .then(function(r) {
        if (!r.ok) return r.json().then(function(e){ throw new Error(f.path + ': ' + e.message); });
        toast('✓ ' + f.label + ' (' + i + '/' + files.length + ')');
        setTimeout(next, 400);
      })
      .catch(function(ex) { alert('Errore: ' + ex.message); });
  }
  next();
}


function toast(msg) {
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('on');
  setTimeout(function(){ t.classList.remove('on'); }, 3000);
}

