// Core functions per menu-admin Santamonica
// v 2026.04.23.02


// ═══ Template CARTA (globali, embedded) — usati da preview/pubblicazione IT e lingue ═══
var CARTA_PH = "\u0000BT\u0000";
var CARTA_RE = new RegExp(CARTA_PH.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
var CARTA_TPL_B = "<!DOCTYPE html>\n<html lang=\"it\">\n<head>\n  <meta charset=\"UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <meta http-equiv=\"Cache-Control\" content=\"no-cache, no-store, must-revalidate\" />\n  <meta http-equiv=\"Pragma\" content=\"no-cache\" />\n  <meta http-equiv=\"Expires\" content=\"0\" />\n  <title>Men\u00f9 \u2014 Santamonica<\/title>\n  <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\" />\n  <link href=\"https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap\" rel=\"stylesheet\" />\n\n  <style>\n    :root {\n      --cream: #faf7f2;\n      --ink:   #1a1714;\n      --stone: #8c7e6e;\n      --rust:  #9e4a2a;\n      --rule:  #d4c9b8;\n    }\n\n    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }\n\n    body {\n      background: var(--cream);\n      color: var(--ink);\n      font-family: 'Cormorant Garamond', Georgia, serif;\n      font-weight: 400;\n    }\n\n    /* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n       BARRA CONTROLLI\n    \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */\n    .ctrl-bar {\n      text-align: center;\n      padding: .9rem 1rem;\n      position: sticky;\n      top: 0;\n      z-index: 10;\n      background: var(--cream);\n      border-bottom: 1px solid var(--rule);\n      display: flex;\n      gap: .7rem;\n      justify-content: center;\n      align-items: center;\n      flex-wrap: wrap;\n    }\n\n    .ctrl-btn {\n      padding: .4rem 1.3rem;\n      background: transparent;\n      border: 1px solid var(--ink);\n      font-family: 'Jost', sans-serif;\n      font-size: .68rem;\n      letter-spacing: .16em;\n      text-transform: uppercase;\n      cursor: pointer;\n      color: var(--ink);\n      transition: background .2s, color .2s;\n    }\n    .ctrl-btn:hover, .ctrl-btn.active {\n      background: var(--ink);\n      color: var(--cream);\n    }\n    .ctrl-sep {\n      width: 1px;\n      height: 1.4rem;\n      background: var(--rule);\n    }\n\n    /* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n       PAGINA  (shared)\n    \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */\n    .pg {\n      width: 210mm;\n      min-height: 297mm;\n      margin: 2rem auto;\n      padding: 18mm 24mm 16mm;\n      background: #fff;\n      box-shadow: 0 2px 24px rgba(0,0,0,.10);\n      display: flex;\n      flex-direction: column;\n    }\n\n    /* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n       LAYOUT: MEN\u00d9 ALLA CARTA\n    \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */\n    #layout-carta { display: block; }\n    #layout-orario { display: none; }\n\n    /* \u2500\u2500 intestazione \u2500\u2500 */\n    .pg-header {\n      text-align: center;\n      margin-bottom: 9mm;\n      padding-bottom: 5mm;\n      border-bottom: 1px solid var(--rule);\n    }\n    .logo {\n      font-size: 2.5rem;\n      font-weight: 300;\n      letter-spacing: .22em;\n      text-transform: uppercase;\n      line-height: 1;\n    }\n    .logo em { font-style: italic; color: var(--stone); }\n    .logo-sub {\n      margin-top: .45rem;\n      font-family: 'Jost', sans-serif;\n      font-size: .67rem;\n      letter-spacing: .22em;\n      text-transform: uppercase;\n      color: var(--stone);\n    }\n\n    /* \u2500\u2500 degustazione \u2500\u2500 */\n    .degu {\n      text-align: center;\n      flex: 1;\n      display: flex;\n      flex-direction: column;\n      justify-content: center;\n      padding: 4mm 0;\n    }\n    .degu-titolo {\n      font-size: 1.4rem;\n      font-weight: 600;\n      letter-spacing: .16em;\n      text-transform: uppercase;\n      margin-bottom: 5mm;\n    }\n    .degu-prezzi {\n      font-style: italic;\n      font-size: .98rem;\n      line-height: 1.4;\n      margin-bottom: 2mm;\n    }\n    .degu-nota {\n      font-style: italic;\n      font-size: .98rem;\n      color: var(--ink);\n      margin-bottom: 14mm;\n    }\n    .degu-nota strong {\n      font-style: normal;\n      font-weight: 400;\n      text-decoration: underline;\n      text-underline-offset: 2px;\n      color: var(--ink);\n    }\n    .percorso { margin-bottom: 12mm; }\n    .percorso-label {\n      font-style: italic;\n      font-weight: 700;\n      font-size: 1.25rem;\n      margin-bottom: 3mm;\n    }\n    .percorso-piatto { font-size: .96rem; line-height: 1.95; font-style: normal; }\n    .percorso-piatto em { font-style: normal; }\n    .percorso-libero { font-size: .96rem; line-height: 1.95; font-style: normal; }\n\n    /* \u2500\u2500 sezioni carta \u2500\u2500 */\n    .pg-content {\n      flex: 1;\n      display: flex;\n      flex-direction: column;\n      justify-content: center;\n    }\n    .sezione { margin-bottom: 14mm; }\n    .sezione-titolo {\n      font-family: 'Cormorant Garamond', serif;\n      font-style: normal;\n      font-size: 1.5rem;\n      font-weight: 600;\n      letter-spacing: .14em;\n      text-transform: uppercase;\n      text-align: center;\n      margin-bottom: 5mm;\n      padding-bottom: 2mm;\n      border-bottom: 1px solid var(--rule);\n    }\n\n    /* \u2500\u2500 piatti carta \u2500\u2500 */\n    .piatto {\n      text-align: center;\n      padding: .5mm 0;\n      font-size: .96rem;\n      line-height: 1.4;\n    }\n    .piatto-prezzo {\n      font-size: .8rem;\n      color: var(--stone);\n      margin-left: .3rem;\n    }\n    .piatto-unita {\n      font-size: .76rem;\n      color: var(--stone);\n      margin-left: .1rem;\n    }\n    .piatto-desc {\n      font-style: italic;\n      font-size: .82rem;\n      color: var(--stone);\n      display: block;\n    }\n    .piatto-staccato { margin-top: 3.5mm; }\n\n    .eco::after {\n      content: ' *';\n      color: var(--rust);\n      font-size: .76em;\n    }\n\n    /* \u2500\u2500 note ospite carta \u2500\u2500 */\n    .note-ospite {\n      margin-top: auto;\n      font-style: italic;\n      font-size: .73rem;\n      color: var(--stone);\n      text-align: center;\n      line-height: 1.65;\n      padding-top: 5mm;\n      border-top: 1px solid var(--rule);\n    }\n    .note-ospite-titolo {\n      text-decoration: underline;\n      display: block;\n      margin-bottom: 1.2mm;\n    }\n    .note-ospite u { text-decoration: underline; }\n\n    /* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n       LAYOUT: FOGLIO ORARIO (1 pagina, 2 col)\n    \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */\n    .pg-orario {\n      padding: 6mm 8mm 8mm;\n    }\n\n    .orario-logo {\n      font-family: 'Cormorant Garamond', serif;\n      font-size: 3.8rem;\n      font-style: italic;\n      font-weight: 300;\n      letter-spacing: .08em;\n      text-align: center;\n      margin-bottom: 5mm;\n      line-height: 1;\n    }\n\n    .orario-grid {\n      display: grid;\n      grid-template-columns: 1fr 1fr;\n      gap: 0;\n      border: 1.5px solid var(--ink);\n      flex: 1;\n    }\n\n    .orario-col {\n      padding: 6mm 8mm;\n      display: flex;\n      flex-direction: column;\n      gap: 6mm;\n    }\n\n    .orario-col:first-child {\n      border-right: 1.5px solid var(--ink);\n    }\n\n    /* separatore tratteggiato interno (dopo ostriche) */\n    .orario-sep {\n      border: none;\n      border-top: 1px dashed var(--stone);\n      margin: 1mm 0;\n    }\n\n    .orario-sez { text-align: center; }\n\n    .orario-sez-titolo {\n      font-size: 1.5rem;\n      font-weight: 700;\n      letter-spacing: .12em;\n      text-transform: uppercase;\n      margin-bottom: 3mm;\n    }\n\n    .orario-piatto {\n      font-size: 1.2rem;\n      line-height: 1.35;\n      text-align: center;\n      margin-bottom: .55rem;\n    }\n    .orario-piatto:last-child { margin-bottom: 0; }\n\n    .orario-piatto .eco::after {\n      content: ' *';\n      color: var(--rust);\n      font-size: .76em;\n    }\n\n    /* \u2500\u2500 sezione orario in basso \u2500\u2500 */\n    .orario-footer-col {\n      display: flex;\n      flex-direction: column;\n      gap: 4mm;\n    }\n\n    .orario-links {\n      font-family: 'Cormorant Garamond', serif;\n      font-style: normal;\n      font-weight: 700;\n      font-size: 1.1rem;\n      letter-spacing: .12em;\n      text-transform: uppercase;\n      line-height: 2.1;\n      text-align: center;\n    }\n    .orario-links u { text-decoration: none; }\n\n    .orario-qr {\n      width: 45mm;\n      height: 45mm;\n      display: block;\n      margin: 0 auto;\n    }\n\n    .orario-servizio {\n      font-style: italic;\n      font-size: 1rem;\n      line-height: 1.85;\n      text-align: center;\n    }\n    .orario-servizio-titolo {\n      text-decoration: underline;\n      font-style: italic;\n      display: block;\n      margin-bottom: 2mm;\n    }\n\n    .orario-nota {\n      font-size: .72rem;\n      color: var(--stone);\n      line-height: 1.6;\n      text-align: center;\n      border-top: 1px solid var(--rule);\n      padding-top: 3mm;\n      margin-top: auto;\n    }\n\n    /* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n       STAMPA\n    \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */\n    @media print {\n      @page { size: A4 portrait; margin: 0; }\n      body { background: white; }\n      .ctrl-bar { display: none; }\n\n      /* carta: 3 pagine */\n      #layout-carta .pg {\n        width: 210mm;\n        height: 297mm;\n        min-height: unset;\n        margin: 0;\n        padding: 15mm 22mm 14mm;\n        box-shadow: none;\n        page-break-after: always;\n      }\n      #layout-carta .pg:last-child { page-break-after: avoid; }\n\n      /* orario: 1 pagina */\n      #layout-orario .pg {\n        width: 210mm;\n        height: 297mm;\n        min-height: unset;\n        margin: 0;\n        box-shadow: none;\n        page-break-after: avoid;\n      }\n    }\n  <\/style>\n<\/head>\n<body>\n\n\n\n<div id=\"layout-carta\"><\/div>\n<div id=\"layout-orario\"><\/div>\n\n<script>\n/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n   MEN\u00d9  \u2014  modifica solo qui per aggiornare tutto\n   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */\n".replace(CARTA_RE, "`");
var CARTA_TPL_A = "\n/* \u2500\u2500 helpers condivisi \u2500\u2500 */\nconst NOTE_CARTA = \u0000BT\u0000\n  <span class=\"note-ospite-titolo\">Note per l'ospite<\/span>\n  Per mantenere costanti il livello qualitativo e le caratteristiche organolettiche delle materie prime i prodotti ittici\n  acquistati freschi vengono abbattuti e congelati. Tali prodotti vengono contrassegnati con il simbolo * per una\n  chiara e trasparente informazione alla clientela.<br>\n  L'elenco degli <u>allergeni<\/u> \u00e8 consultabile nell'ultima pagina di questo men\u00f9.\n\u0000BT\u0000;\n\nconst NOTE_ORARIO = \u0000BT\u0000Per mantenere costanti il livello qualitativo e le caratteristiche organolettiche\ndelle materie prime i prodotti acquistati freschi vengono abbattuti e congelati.\nQuesti prodotti vengono contrassegnati con il simbolo: *\u0000BT\u0000;\n\nfunction getSez(titolo) {\n  var found = MENU.sezioni.find(s => s.titolo === titolo);\n  if (!found) {\n    // Fallback: cerca per titolo_display o per indice\n    var idx = ['Crudi','Sfiziosi','Amidi e Carboidrati','Non Solo Mare'].indexOf(titolo);\n    if (idx >= 0 && MENU.sezioni[idx]) found = MENU.sezioni[idx];\n  }\n  return found;\n}\n\nfunction buildPiatto(p) {\n  const eco = p.sostenibile ? ' eco' : '';\n  const staccato = p.staccato ? ' piatto-staccato' : '';\n  const unitaHtml = p.unita ? \u0000BT\u0000<span class=\"piatto-unita\">${p.unita}<\/span>\u0000BT\u0000 : '';\n  const prezzoHtml = p.prezzo != null\n    ? \u0000BT\u0000<span class=\"piatto-prezzo\">${p.prezzo}${unitaHtml}<\/span>\u0000BT\u0000 : '';\n  const descHtml = p.descrizione\n    ? \u0000BT\u0000<span class=\"piatto-desc\">${p.descrizione}<\/span>\u0000BT\u0000 : '';\n  return \u0000BT\u0000<div class=\"piatto${staccato}\"><span class=\"piatto-riga${eco}\">${p.nome}<\/span>${prezzoHtml}${descHtml}<\/div>\u0000BT\u0000;\n}\n\nfunction buildSezione(s) {\n  const label = s.titolo_display || s.titolo;\n  return \u0000BT\u0000\n    <div class=\"sezione\">\n      <div class=\"sezione-titolo\">${label}<\/div>\n      ${s.piatti.map(buildPiatto).join('')}\n    <\/div>\u0000BT\u0000;\n}\n\nfunction buildDegu(degu) {\n  const optsHtml = degu.opzioni.map(o =>\n    \u0000BT\u0000${o.portate} portate &nbsp;\u20ac ${o.prezzo}, eventuale abbinamento vini \u20ac ${o.vini}\u0000BT\u0000\n  ).join('<br>');\n\n  let percorsiHtml = '';\n  for (const [n, piatti] of Object.entries(degu.percorsi)) {\n    if (typeof piatti === 'string') {\n      percorsiHtml += \u0000BT\u0000\n        <div class=\"percorso\">\n          <div class=\"percorso-label\">&ldquo;${n}&rdquo;<\/div>\n          <div class=\"percorso-piatto percorso-libero\">${piatti}<\/div>\n        <\/div>\u0000BT\u0000;\n    } else {\n      const righe = piatti.map(p =>\n        \u0000BT\u0000<div class=\"percorso-piatto${p.sostenibile ? ' eco' : ''}\">${p.nome}<\/div>\u0000BT\u0000\n      ).join('');\n      percorsiHtml += \u0000BT\u0000\n        <div class=\"percorso\">\n          <div class=\"percorso-label\">&ldquo;${n}&rdquo;<\/div>\n          ${righe}\n        <\/div>\u0000BT\u0000;\n    }\n  }\n\n  return \u0000BT\u0000\n    <div class=\"degu\">\n      <div class=\"degu-titolo\">Men&ugrave;&rsquo; Degustazione<\/div>\n      <div class=\"degu-prezzi\">${optsHtml}<\/div>\n      <div class=\"degu-nota\">${degu.nota.replace(\"l'intero tavolo\", \"<strong>l\\u2019intero tavolo<\/strong>\")}<\/div>\n      ${percorsiHtml}\n    <\/div>\u0000BT\u0000;\n}\n\n/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n   RENDER: MEN\u00d9 ALLA CARTA\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */\nfunction renderCarta() {\n  const root = document.getElementById('layout-carta');\n  root.innerHTML = '';\n\n  // Pag 1: intestazione + degustazione\n  const pag1 = document.createElement('div');\n  pag1.className = 'pg';\n  pag1.innerHTML = \u0000BT\u0000\n    ${buildDegu(MENU.degustazione)}\n    <div class=\"note-ospite\">${NOTE_CARTA}<\/div>\n  \u0000BT\u0000;\n  root.appendChild(pag1);\n\n  // Pag 2 e 3: sezioni\n  MENU.pagine.forEach(pg => {\n    const div = document.createElement('div');\n    div.className = 'pg';\n    div.innerHTML = \u0000BT\u0000\n      <div class=\"pg-content\">\n        ${pg.sezioni.map(t => buildSezione(getSez(t))).join('')}\n      <\/div>\n      <div class=\"note-ospite\">${NOTE_CARTA}<\/div>\n    \u0000BT\u0000;\n    root.appendChild(div);\n  });\n}\n\n/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n   RENDER: FOGLIO ORARIO\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */\nfunction buildOrarioColonna(titoli, sepDopo) {\n  return titoli.map(titolo => {\n    const s = getSez(titolo);\n    const piatti = s.piatti.map(p => {\n      const eco = p.sostenibile ? ' eco' : '';\n      const unitaHtml = p.unita ? \u0000BT\u0000 ${p.unita}\u0000BT\u0000 : '';\n      const prezzoHtml = p.prezzo != null ? \u0000BT\u0000 \u20ac ${p.prezzo}${unitaHtml}\u0000BT\u0000 : '';\n      return \u0000BT\u0000<div class=\"orario-piatto\"><span class=\"${'piatto-riga' + eco}\">${p.nome}${prezzoHtml}<\/span><\/div>\u0000BT\u0000;\n    }).join('');\n\n    const sep = (titolo === sepDopo) ? '<hr class=\"orario-sep\">' : '';\n    // ogni sezione in uno slot flex:1 centrato verticalmente\n    return \u0000BT\u0000\n      <div style=\"flex:1;display:flex;flex-direction:column;justify-content:center;\">\n        <div class=\"orario-sez\">\n          <div class=\"orario-sez-titolo\">${s.titolo_display || s.titolo}<\/div>\n          ${piatti}\n        <\/div>\n      <\/div>${sep}\u0000BT\u0000;\n  }).join('');\n}\n\nfunction renderOrario() {\n  const root = document.getElementById('layout-orario');\n  root.innerHTML = '';\n  const cfg = MENU.orario;\n\n  const orarioHtml = cfg.orarioServizio.map(o =>\n    \u0000BT\u0000<div><em>${o.giorno}<\/em><\/div>\u0000BT\u0000 + o.fasce.map(f => \u0000BT\u0000<div>${f}<\/div>\u0000BT\u0000).join('')\n  ).join('');\n\n  const pg = document.createElement('div');\n  pg.className = 'pg pg-orario';\n  pg.innerHTML = \u0000BT\u0000\n    <div class=\"orario-logo\">Santamonica<\/div>\n    <div class=\"orario-grid\" style=\"flex:1\">\n\n      <!-- colonna sinistra -->\n      <div class=\"orario-col\">\n        ${buildOrarioColonna(cfg.colSinistra, cfg.separatoreDopo)}\n\n        <!-- footer sinistra: link + QR -->\n        <div class=\"orario-footer-col\">\n          <hr style=\"border:none;border-top:1px solid var(--ink);margin:2mm 0\">\n          <div class=\"orario-links\">\n            English Menu<br>\n            Carte en Fran\u00e7aise\n          <\/div>\n          <img src=\"https://santamonicagenova-a11y.github.io/SantaWeb/orario-qr.png\" alt=\"QR code\" style=\"width:45mm;height:45mm;display:block;margin:0 auto;\" />\n        <\/div>\n      <\/div>\n\n      <!-- colonna destra -->\n      <div class=\"orario-col\">\n        ${buildOrarioColonna(cfg.colDestra, \"Amidi e Carboidrati\")}\n\n        <!-- footer destra: orario + nota -->\n        <div class=\"orario-footer-col\">\n          <hr style=\"border:none;border-top:1px solid var(--ink);margin:2mm 0\">\n          <div class=\"orario-servizio\">\n            <span class=\"orario-servizio-titolo\"><em>ORARIO DI SERVIZIO:<\/em><\/span>\n            ${orarioHtml}\n          <\/div>\n          <div class=\"orario-nota\">${NOTE_ORARIO}<\/div>\n        <\/div>\n      <\/div>\n\n    <\/div>\n  \u0000BT\u0000;\n  root.appendChild(pg);\n}\n\n/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n   SWITCH LAYOUT\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */\nfunction showLayout(which) {\n  document.getElementById('layout-carta').style.display  = which === 'carta'  ? 'block' : 'none';\n  document.getElementById('layout-orario').style.display = which === 'orario' ? 'block' : 'none';\n  var bc=document.getElementById('btn-carta'); if(bc) bc.classList.toggle('active',which==='carta');\n  var bo=document.getElementById('btn-orario'); if(bo) bo.classList.toggle('active',which==='orario');\n}\n\n/* \u2500\u2500 init \u2500\u2500 */\nrenderCarta();\nrenderOrario();\nshowLayout('carta');\n<\/script>\n<\/body>\n<\/html>\n".replace(CARTA_RE, "`");

function costruisciHtmlTradotto(lang, t) {
  var menuForm = leggi();
  var m = costruisciMenuTradotto(menuForm, t);

  // Template senza ctrl-bar (backtick sostituiti con placeholder per embedding sicuro)
  // Alias verso template globali (definiti sopra)
  var TPL_B = CARTA_TPL_B, TPL_A = CARTA_TPL_A;

  var SEP = '/* ' + '\u2550'.repeat(57) + ' */\n';
  var newBlock = 'const MENU = ' + JSON.stringify(m, null, 2) + ';\n' + SEP;
  var html = TPL_B + newBlock + TPL_A;

  html = html.replace('return MENU.sezioni.find(s => s.titolo === titolo);',
    'var f=MENU.sezioni.find(s=>s.titolo===titolo); if(!f){var ix=["Crudi","Sfiziosi","Amidi e Carboidrati","Non Solo Mare"].indexOf(titolo); if(ix>=0&&MENU.sezioni[ix]) f=MENU.sezioni[ix];} return f;');
  html = html.replace('<html lang="it">', '<html lang="' + lang + '">');
  html = html.replace(/<title>[^<]*<\/title>/, '<title>' + t.title + '</title>');
  html = html.replace(/Note per l'ospite<\/span>[^`]*`/,
    t.note_ospite_titolo + '</span>\n  ' + t.note_carta_1 + '<br>\n  ' + t.note_carta_2 + '\n`');
  html = html.replace(/Per mantenere costanti[\s\S]*?simbolo: \*`/,
    t.note_orario + '`');
  html = html.replace('Men\u00f9\u2019 Degustazione', t.titolo_degustazione);
  html = html.replace('Men&ugrave;&rsquo; Degustazione', t.titolo_degustazione);
  html = html.replace(/\${o\.portate} portate/g, '${o.portate} ' + t.degu_portate_label);
  html = html.replace(/eventuale abbinamento vini/g, t.degu_vini_label);
  html = html.replace('ORARIO DI SERVIZIO:', t.orario_titolo);
  html = html.replace(
    /<u><em>English Menu<\/em><\/u><br>\s*<u><em>Carte en Fran[^<]*<\/em><\/u>/,
    t.links.join('<br>\n            ')
  );
  return html;
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
  if (m.degustazione) {
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

  var s6wrap = el('div','opt-row');
  var s6lbl = el('div'); s6lbl.appendChild(el('span','opt-lbl','Label percorso 6')); s6lbl.appendChild(inp('text','degu-label-6', m.degustazione.percorso_label_6 || '6')); s6wrap.appendChild(s6lbl);
  bd.appendChild(s6wrap);
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

  var s7wrap = el('div','opt-row');
  var s7lbl = el('div'); s7lbl.appendChild(el('span','opt-lbl','Label percorso 7')); s7lbl.appendChild(inp('text','degu-label-7', m.degustazione.percorso_label_7 || '7')); s7wrap.appendChild(s7lbl);
  bd.appendChild(s7wrap);
  bd.appendChild(el('div','sub','Percorso \u201c7\u201d'));
  var i7 = inp('text','degu7', m.degustazione.percorsi['7']);
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
  if (m.orario) {
    var fso = el('div','fs'); fso.appendChild(el('div','fs-head','Foglio Orario'));
    var bdo = el('div','fs-body'); bdo.appendChild(el('div','sub','Immagine QR code'));
    var qrRow = el('div'); qrRow.style.cssText = 'margin-bottom:.8rem';
    var qrLbl = el('span','opt-lbl','Seleziona immagine QR (PNG/JPG)'); qrLbl.style.display='block'; qrLbl.style.marginBottom='.3rem';
    qrRow.appendChild(qrLbl);
    // Anteprima immagine corrente
    var qrPrev = document.createElement('img'); qrPrev.id='qr-preview';
    qrPrev.style.cssText='width:60px;height:60px;display:block;margin-bottom:.4rem;border:1px solid var(--rule);object-fit:contain';
    qrPrev.src='https://santamonicagenova-a11y.github.io/SantaWeb/orario-qr.png?t='+Date.now();
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
    qrReset.onclick = function(e) { e.preventDefault(); var f=document.getElementById('orario-qr-file'); if(f) f.value=''; _qrBase64=null; var p=document.getElementById('qr-preview'); if(p){p.src='https://santamonicagenova-a11y.github.io/SantaWeb/orario-qr.png?t='+Date.now();p.style.display='block';} };
    qrRow.appendChild(qrReset);
    bdo.appendChild(qrRow); fso.appendChild(bdo); wrap.appendChild(fso);
  }
}

function leggi() {
  var m = JSON.parse(JSON.stringify(dati));

  if (m.degustazione) {
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
    var l6=document.getElementById('degu-label-6'); if(l6) m.degustazione.percorso_label_6=l6.value.trim()||'6';
    var l7=document.getElementById('degu-label-7'); if(l7) m.degustazione.percorso_label_7=l7.value.trim()||'7';
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
  return m;
}

var MENU_URL = 'https://santamonicagenova-a11y.github.io/SantaWeb/menu.html';
var REPO_OWNER = 'santamonicagenova-a11y';
var REPO_NAME  = 'SantaWeb';
var MENU_PATH  = 'menu.html';
var outputCorrente = '';
var DOLCI_URL = 'https://santamonicagenova-a11y.github.io/SantaWeb/menu-dolci.html';
var DOLCI_PATH = 'menu-dolci.html';
var MENU_DOLCI_IT = {"sezioni": [{"titolo": "Golosità", "piatti": [{"nome": "Gelato al limone nero, levistico, lime, cracker di latte", "prezzo": 14}, {"nome": "Ananas, parfait al carbone, caramello al caffè", "prezzo": 14}, {"nome": "Gelato al porcino, fragole, terra al cioccolato", "prezzo": 14}, {"nome": "Sacripantina", "prezzo": 11}, {"nome": "Erborinato ligure e Picolit Zorzettig", "prezzo": 12}]}], "allergeni": [{"nome": "Gelato al limone nero", "allergeni": "glutine, latticini"}, {"nome": "Gelato porcino", "allergeni": "latticini, uova"}, {"nome": "Ananas", "allergeni": "uovo, glutine, latticini"}, {"nome": "Sacripantina", "allergeni": "frutta a guscio, uovo, glutine, latticini, solforosa"}, {"nome": "Erborinato e Picolit", "allergeni": "latticini, solforosa"}], "pagine": [{"sezioni": ["Golosità"]}]};
var TRADUZIONI_DOLCI = {"en": {"title": "Desserts — Santamonica", "sezione": "Sweets", "piatti": {"Gelato al limone nero, levistico, lime, cracker di latte": "Black lemon gelato, lovage, lime, milk cracker", "Ananas, parfait al carbone, caramello al caffè": "Pineapple, charcoal parfait, coffee caramel", "Gelato al porcino, fragole, terra al cioccolato": "Porcini gelato, strawberries, chocolate soil", "Sacripantina": "Sacripantina", "Erborinato ligure e Picolit Zorzettig": "Ligurian blue cheese and Picolit Zorzettig", "glutine, latticini": "gluten, dairy", "latticini, uova": "dairy, eggs", "uovo, glutine, latticini": "egg, gluten, dairy", "frutta a guscio, uovo, glutine, latticini, solforosa": "tree nuts, egg, gluten, dairy, sulphites", "latticini, solforosa": "dairy, sulphites", "Gelato al limone nero": "Black lemon gelato", "Gelato porcino": "Porcini gelato", "Ananas": "Pineapple", "Erborinato e Picolit": "Blue cheese and Picolit"}}, "fr": {"title": "Desserts — Santamonica", "sezione": "Gourmandises", "piatti": {"Gelato al limone nero, levistico, lime, cracker di latte": "Glace citron noir, livèche, citron vert, cracker au lait", "Ananas, parfait al carbone, caramello al caffè": "Ananas, parfait au charbon, caramel au café", "Gelato al porcino, fragole, terra al cioccolato": "Glace aux cèpes, fraises, terre au chocolat", "Sacripantina": "Sacripantina", "Erborinato ligure e Picolit Zorzettig": "Fromage persillé ligurien et Picolit Zorzettig", "glutine, latticini": "gluten, produits laitiers", "latticini, uova": "produits laitiers, œufs", "uovo, glutine, latticini": "œuf, gluten, produits laitiers", "frutta a guscio, uovo, glutine, latticini, solforosa": "fruits à coque, œuf, gluten, produits laitiers, sulfites", "latticini, solforosa": "produits laitiers, sulfites", "Gelato al limone nero": "Glace citron noir", "Gelato porcino": "Glace aux cèpes", "Ananas": "Ananas", "Erborinato e Picolit": "Fromage persillé et Picolit"}}, "de": {"title": "Desserts — Santamonica", "sezione": "Desserts", "piatti": {"Gelato al limone nero, levistico, lime, cracker di latte": "Schwarzzitroneneis, Liebstöckel, Limette, Milchcracker", "Ananas, parfait al carbone, caramello al caffè": "Ananas, Kohle-Parfait, Kaffeekaramell", "Gelato al porcino, fragole, terra al cioccolato": "Steinpilzeis, Erdbeeren, Schokoladenerde", "Sacripantina": "Sacripantina", "Erborinato ligure e Picolit Zorzettig": "Ligurischer Blauschimmelkäse und Picolit Zorzettig", "glutine, latticini": "Gluten, Milchprodukte", "latticini, uova": "Milchprodukte, Eier", "uovo, glutine, latticini": "Ei, Gluten, Milchprodukte", "frutta a guscio, uovo, glutine, latticini, solforosa": "Schalenfrüchte, Ei, Gluten, Milchprodukte, Sulfite", "latticini, solforosa": "Milchprodukte, Sulfite", "Gelato al limone nero": "Schwarzzitroneneis", "Gelato porcino": "Steinpilzeis", "Ananas": "Ananas", "Erborinato e Picolit": "Blauschimmelkäse und Picolit"}}, "es": {"title": "Postres — Santamonica", "sezione": "Delicias", "piatti": {"Gelato al limone nero, levistico, lime, cracker di latte": "Helado de limón negro, levístico, lima, cracker de leche", "Ananas, parfait al carbone, caramello al caffè": "Piña, parfait de carbón, caramelo de café", "Gelato al porcino, fragole, terra al cioccolato": "Helado de boletus, fresas, tierra de chocolate", "Sacripantina": "Sacripantina", "Erborinato ligure e Picolit Zorzettig": "Queso azul ligur y Picolit Zorzettig", "glutine, latticini": "gluten, lácteos", "latticini, uova": "lácteos, huevos", "uovo, glutine, latticini": "huevo, gluten, lácteos", "frutta a guscio, uovo, glutine, latticini, solforosa": "frutos secos, huevo, gluten, lácteos, sulfitos", "latticini, solforosa": "lácteos, sulfitos", "Gelato al limone nero": "Helado de limón negro", "Gelato porcino": "Helado de boletus", "Ananas": "Piña", "Erborinato e Picolit": "Queso azul y Picolit"}}};
var tipoMenuCorrente = 'carta';

function costruisciOutput() {
  var m = leggi();
  var sep = '/* ' + '\u2550'.repeat(57) + ' */\n';
  var blocco = 'const MENU = ' + JSON.stringify(m, null, 2) + ';\n' + sep;
  // Per la carta usa SEMPRE i template embedded aggiornati (non il file caricato dal sito)
  if (tipoMenuCorrente === 'carta') {
    return CARTA_TPL_B + blocco + CARTA_TPL_A;
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
var _qrBase64 = null;   // base64 del nuovo QR selezionato (separato dal MENU)

function apriPreview(lang) {
  if (tipoMenuCorrente === 'allergeni') { apriPreviewAllergeni(); return; }
  if (!dati) { alert('Prima carica il menù'); return; }
  document.getElementById('preview-menu').classList.remove('open');
  outputCorrente = costruisciOutput();
  if (!lang || lang === 'it') {
    // Italiano: genera al volo
    var blob = new Blob([outputCorrente], { type: 'text/html;charset=utf-8' });
    window.open(URL.createObjectURL(blob), '_blank').focus();
  } else {
    // Lingue: apri direttamente da GitHub Pages
    var prefix = tipoMenuCorrente === 'dolci' ? 'menu-dolci-' : 'menu-';
    var base = 'https://santamonicagenova-a11y.github.io/SantaWeb/' + prefix + lang + '.html';
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
  if (tipo === 'allergeni') { caricaAllergeniDalSito(); return; }
  var url = tipo === 'dolci' ? DOLCI_URL : MENU_URL;
  var btn = document.querySelector('.btn-load');
  document.getElementById('err').textContent = '';
  fetch(url + '?nocache=' + Date.now(), { cache: 'no-store' })
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
  eseguiPubblicazione(token);
  var btn = document.getElementById('btn-pubblica');
  if (btn) { btn.textContent = '✦ Traduci e Pubblica'; btn.disabled = false; }
}

function chiudiModal() {
  document.getElementById('modal-token').classList.remove('on');
}


function traduci() {
  if (!dati) { alert('Prima carica il menù'); return; }
  var m = leggi();
  var btn = document.getElementById('btn-traduci');

  // Raccogli tutti i testi dal form
  var testi = [];
  if (m.degustazione) {
    m.degustazione.percorsi['6'].forEach(function(p) { if (p.nome) testi.push(p.nome); });
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
  var files;
  if (tipoMenuCorrente === 'dolci') {
    files = filesDolci();
  } else {
    files = [
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
  var files = [{ path: DOLCI_PATH, content: outputCorrente, label: 'Dolci IT' }];
  ['en','fr','de','es'].forEach(function(lang) {
    var m = costruisciMenuDolciTradotto(lang);
    if (!m) return;
    var html = outputCorrente;
    var SEP = '/* ' + '\u2550'.repeat(57) + ' */\n';
    var i1 = html.indexOf('const MENU = {');
    var i2 = html.indexOf(SEP, i1) + SEP.length;
    html = html.slice(0, i1) + 'const MENU = ' + JSON.stringify(m, null, 2) + ';\n' + SEP + html.slice(i2);
    html = html.replace('<html lang="it">', '<html lang="' + lang + '">');
    var t = TRADUZIONI_DOLCI[lang];
    html = html.replace(/<title>[^<]*<\/title>/, '<title>' + t.title + '<\/title>');
    files.push({ path: 'menu-dolci-' + lang + '.html', content: html, label: 'Dolci ' + lang.toUpperCase() });
  });
  return files;
}

function traduciEPubblica() {
  if (tipoMenuCorrente === 'allergeni') { traduciEPubblicaAllergeni(); return; }
  if (!dati) { alert('Prima carica il menù'); return; }
  var btn = document.getElementById('btn-pubblica');
  var m = leggi();
  var testi = [];
  if (m.degustazione) {
    m.degustazione.percorsi['6'].forEach(function(p) { if (p.nome) testi.push(p.nome); });
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

  var langs = ['en', 'fr', 'de', 'es'];
  var langPair = { en: 'it-IT|en-GB', fr: 'it-IT|fr-FR', de: 'it-IT|de-DE', es: 'it-IT|es-ES' };
  var coda = [];
  testi.forEach(function(testo) {
    langs.forEach(function(lang) { coda.push({ testo: testo, lang: lang }); });
  });
  var totale = coda.length;
  btn.textContent = '⏳ Traduzione 0/' + totale + '…';
  btn.disabled = true;

  function traduciVoce(i) {
    if (i >= coda.length) {
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


function toast(msg) {
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('on');
  setTimeout(function(){ t.classList.remove('on'); }, 3000);
}

// ═══════════════════════════════════════════════════════
// MENU ALLERGENI — funzioni admin
// ═══════════════════════════════════════════════════════

var ALLERGENI_URL  = 'https://santamonicagenova-a11y.github.io/SantaWeb/menu-allergeni.html';
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
  datiAllergeni = Function('"use strict";' + js + ';return ALLERGENI_DATA;')();

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
var VINI_URL  = 'https://santamonicagenova-a11y.github.io/SantaWeb/menu-vini.html';

function apriSezioneVini() {
  document.getElementById('carica-menu').classList.remove('open');
  document.getElementById('intro').style.display = 'none';
  document.getElementById('wrap').classList.remove('on');
  document.getElementById('foto-section').style.display = 'none';
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
    statusEl.textContent = '⏳ Estrazione testo (' + pdf.numPages + ' pagine)…';

    var pagine = [];
    for (var i = 1; i <= pdf.numPages; i++) {
      var page = await pdf.getPage(i);
      var tc = await page.getTextContent();
      pagine.push(_ricostruisciPagina(tc.items));
    }

    statusEl.textContent = '⏳ Generazione HTML…';
    var html = _generaHtmlVini(pagine);

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

  return _VINI_TPL.replace('{{CONTENT}}', content).replace(/\{\{VER\}\}/g, ver);
}

var _VINI_TPL = '<!DOCTYPE html>\n<!-- {{VER}} -->\n<html lang="it">\n<head>\n<meta charset="UTF-8"/>\n<meta name="viewport" content="width=device-width,initial-scale=1.0"/>\n<title>Lista Vini \u2014 Santamonica</title>\n<link rel="preconnect" href="https://fonts.googleapis.com"/>\n<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet"/>\n<style>\n:root{--cream:#faf7f2;--ink:#1a1714;--stone:#8c7e6e;--rust:#9e4a2a;--rule:#d4c9b8;}\n*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}\nbody{background:var(--cream);color:var(--ink);font-family:\'Cormorant Garamond\',Georgia,serif;font-weight:400;}\n.pg{width:210mm;margin:2rem auto;padding:14mm 22mm 14mm;background:#fff;box-shadow:0 2px 24px rgba(0,0,0,.10);}\n.pg-header{text-align:center;margin-bottom:8mm;padding-bottom:5mm;border-bottom:1px solid var(--rule);}\n.logo{font-size:3.3rem;font-weight:300;letter-spacing:.22em;text-transform:uppercase;line-height:1;}\n.logo em{font-style:italic;color:var(--stone);}\n.logo-sub{margin-top:.45rem;font-family:\'Jost\',sans-serif;font-size:.67rem;letter-spacing:.22em;text-transform:uppercase;color:var(--stone);}\n.lista-titolo{font-size:1.5rem;font-weight:600;letter-spacing:.22em;text-transform:uppercase;text-align:center;margin:4mm 0 1mm;}\n.sommelier{font-family:\'Jost\',sans-serif;font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;color:var(--stone);text-align:center;margin-bottom:6mm;}\n.sez-titolo{font-size:1.98rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;text-align:center;margin:7mm 0 4mm;padding-bottom:2mm;border-bottom:1px solid var(--rule);}\n.sottosez-titolo{font-family:\'Jost\',sans-serif;font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;color:var(--stone);margin:5mm 0 3mm;}\n.vino{margin-bottom:3.5mm;text-align:justify;font-size:1.0rem;line-height:1.52;}\n.version{text-align:center;padding:6px 0;font-family:\'Jost\',sans-serif;font-size:.55rem;color:#888;letter-spacing:.1em;}\n@media print{@page{size:A4 portrait;margin:0;}body{background:white;}.pg{width:210mm;margin:0;box-shadow:none;page-break-after:always;}}\n</style>\n</head>\n<body>\n<div class="pg">\n<div class="pg-header"><div class="logo">Santa<em>monica</em></div><div class="logo-sub">Lungomare Lombardo 27 \u2014 Genova</div></div>\n<div class="lista-titolo">Lista Vini &mdash; Wine List</div>\n<div class="sommelier">Sommelier Professionista Monica Capurro</div>\n{{CONTENT}}\n</div>\n<div class="version">{{VER}}</div>\n</body>\n</html>';

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
