# HANDOVER — Santamonica Web

**Versione documento:** v 2026.05.19.04
**Data:** 2026-05-19 (sera tardi)
**Continuazione di:** `HANDOVER_Santamonica_Web_v2026.05.19.01.md`
**Sessione:** F0.9 CHIUSO 100% definitivo + F0.10 + F0.11 entrambi chiusi 100% tecnico · 6 file deploy in 3 batch coordinati (.02 / .03 / .04) · 4 decisioni operative nuove (#22-#25) · memoria operativa #5 salvata

---

## 1. STATO ATTUALE

### 1.1 File prodotti questa sessione

| File | Versione | Batch | Destinazione | Status |
|---|---|---|---|---|
| `cookieconsent-config.js` | v 2026.05.19.02 | release 1/3 | GitHub repo root | ✅ uploadato + verificato |
| `privacy.html` | v 2026.05.19.02 | release 1/3 | GitHub repo root | ✅ uploadato + verificato |
| `cookies.html` | v 2026.05.19.02 | release 1/3 | GitHub repo root | ✅ uploadato + verificato (no modifiche funzionali, bump coordinato) |
| `regala.html` | v 2026.05.19.03 | release 2/3 | GitHub repo root | ✅ uploadato (TODO endpoint Formspree + testi) |
| `index.html` | v 2026.05.19.04 | release 3/3 | GitHub repo root | ✅ uploadato + verificato V1-V4 |
| `dove-siamo.html` | v 2026.05.19.04 | release 3/3 | GitHub repo root | ✅ uploadato + verificato V1-V4 |
| `HANDOVER_Santamonica_Web_v2026.05.19.04.md` | v 2026.05.19.04 | continuità | KB Claude + Git docs | ✅ questo file |
| `CHANGELOG_Santamonica_Web_v2026.05.19.04.md` | v 2026.05.19.04 | continuità | KB Claude + Git docs | ✅ bump |
| `ROADMAP_Santamonica_Web_v2026.05.19.04.md` | v 2026.05.19.04 | continuità | KB Claude + Git docs | ✅ bump v.13 → v.14 |

### 1.2 Sintesi sessione

Sessione lunga di chiusura **F0.9 definitiva** + **F0.10** + **F0.11** in unica seduta, con 3 release deploy coordinate progressive nella stessa giornata.

**Batch 1/3 · v 2026.05.19.02 (F0.9-post chiusura)** — eseguita verifica funzionale F0.9 utente con metodo strutturato (Blocco 1 404+console · Blocco 2 funzionale banner · Blocco 3 lingue · Blocco 4 versioning UI). Esito: ✅ tutto OK su CF Pages staging incognito. Scoperti **2 difetti residui** durante verifica:
  - **Bug fix UX (P3 emergente)**: i 15 link policy nelle traduzioni IT/EN/FR del `cookieconsent-config.js` non avevano `target="_blank" rel="noopener noreferrer"`. Risultato: cliccando un link dal banner cookie, l'utente veniva sostato dalla pagina perdendo il contesto del modale. Convenzione progetto (HANDOVER §3.3 versione precedente): "Link footer Privacy/Cookies in `index.html`: `target=_blank rel=noopener noreferrer`" già adottata altrove ma non propagata al banner. Corretto in v.02.
  - **P3.23 (nuovo, scoperto in verifica)**: dopo l'applicazione di P3.8 opzione b (`autoShow: !isPolicyPage`), su `privacy.html` il banner non si auto-mostra → utente atterrato direttamente dalla SERP/social non ha alcun trigger visibile per gestire le preferenze cookie. `cookies.html` ha il bottone `.cc-manage` dalla v 2026.05.17.02 (§3), `privacy.html` no. Risolto aggiungendo bottone al termine §12 con CSS coerente (classe `.cc-manage` copiata da cookies.html).
  - Applicate anche P3.5 (`hideFromBots: true` esplicito) e P3.8 (opzione b confermata utente) dal backlog F0.9-post in HANDOVER v.01.
  - cookies.html bump coordinato (no modifiche funzionali) per coerenza convenzione "stesso NN per release di sessione" (memoria operativa #1).

**Batch 2/3 · v 2026.05.19.03 (F0.10)** — prima emissione `regala.html`. Pagina informativa minima sui voucher regalo. Elicitazione decisioni operative (10 punti A/B/C/D) → confermati:
  - Tagli: 100 / 150 / 200 € (A1 mod)
  - Validità: 6 mesi (A3 b)
  - CTA pre-F0.13: form Formspree (B1 b) con 6 campi + honeypot anti-spam + `_subject`
  - T5 dec.#5: checkbox opt-in marketing presente NON pre-spuntato (B2 a)
  - Solo IT per ora (C1 a)
  - Palette coerente con privacy.html / cookies.html (C2 a)
  - Link a `/voucher-termini.html` con 404 temporaneo accettato fino a F0.14 (D1 a)
  - Banner cookie integrato auto-show abilitato (D2 a)

  Decisioni di Claude autonome: Schema.org `Product`/`Offer` NON aggiunto oggi (a F0.13 quando Stripe attivo); bottone `.cc-manage` NON aggiunto (coerente con index.html — il bottone serve solo su pagine con `autoShow:false`); endpoint Formspree placeholder `REPLACE_ME_VOUCHER` con TODO commentato in cima al file.

**Batch 3/3 · v 2026.05.19.04 (F0.11)** — Schema.org Restaurant + pagina Dove siamo. Elicitazione dati ristorante (11 punti M/N/D) → confermati:
  - M1 Indirizzo: Lungomare Lombardo 27, 16145 Genova GE
  - M2 Telefono: +39 010 5533155
  - M3 Email: `info@santamonicagenova.it` (precisazione utente: **GIÀ ATTIVA**)
  - M4 Orari: Mar-Ven solo cena 19:30-22:30, Sab-Dom anche pranzo 12:30-14:30, Lun chiuso (**in vigore da giugno 2026** — TARGET pre-go-live)
  - M5 Tipo: `ItalianRestaurant` (b)
  - M6 Prezzi: €€€ (c)
  - N7 Place ID Google: `ChIJGzMzZqlD0xIRKRomfkk1F2c`
  - N8 Coordinate GPS: **ricavate da web search via Google Maps URL** → `44.3913353, 8.9646575` (lat, lng)
  - N9/N10 Logo + foto hero: placeholder URL `/img/logo-santamonica.png` + `/img/og-home.jpg` (da caricare dopo)
  - N11 Social: IG `https://www.instagram.com/ristorantesantamonica/` + FB `https://www.facebook.com/santamonicage`
  - D12 c (interpretato come "fai responsive ottimizzata mobile"): pagina dedicata `/dove-siamo.html` mobile-first + sezione index.html `#info` con link "Dettagli completi"
  - D13 b: iframe OpenStreetMap (no cookie tracker), soluzione transitoria fino a F0.12

  Scoperta in upload: `index.html` v 2026.05.19.01 aveva già un blocco Schema.org JSON-LD (più antico) con `@type: Restaurant` generico, email Gmail, orari "vecchi" (Mar solo cena, Mer-Sab pranzo+cena, Dom solo pranzo) e geo coordinate diverse (44.391726, 8.964593). **Refactor completo** del blocco con `@type: ItalianRestaurant`, `@id: https://santamonicagenova.it/#restaurant` (linking semantico con dove-siamo.html), dati TARGET, mantenendo i campi ricchi pre-esistenti (employee Chef Nicolò Lazzaroni + Sommelier Monica Capurro, award Michelin Good Cooking, currenciesAccepted, paymentAccepted, menu).

  3 discrepanze rilevate tra info live attuali (Wix), info dichiarate da utente in chat (TARGET), e info nel repo SantaWeb pre-modifica: orari, email pubblica, URL Instagram. L'utente ha esplicitato che **il sito in costruzione (CF Pages staging) NON è quello live (Wix)** e che le discrepanze sono attese durante staging. Decisione operativa nuova #25 (convenzione TARGET vs operative) + memoria persistente Claude #5 (FINAL CHECK obbligatorio pre-F0.21 su orari, email, telefono, indirizzo, voucher, prezzi).

**Test V5 Rich Results Test "URL mode"** → errore atteso `noindex,nofollow` (X-Robots-Tag in `_headers` blocca crawl Googlebot per design F0.3). Test alternativo "Codice mode" eseguibile ora; test "URL mode" rinviato a F0.21 post-rimozione noindex.

**Errore di str_replace recuperato in sessione**: durante la modifica del `index.html` (aggiunta link "Dettagli completi"), un str_replace ha rimosso accidentalmente l'apertura della section `#newsletter`. Errore rilevato immediatamente con `view`, ripristinato con secondo str_replace. Nessun impatto su output finale. Lesson learned: validare struttura sezioni con `grep "^<section"` dopo modifiche multi-sezione.

**Nessuna nuova "sessione fantasma"** (pattern KB↔deploy disallineamento) emersa in questa sessione. Pattern storico 5 episodi resta nel backlog metodologico §5 ROADMAP.

### 1.3 Decisioni operative consolidate (cumulative · evidenziando le 4 NUOVE)

| # | Decisione | Esito |
|---|---|---|
| 17 (da v17.06) | `admin-templates-shared.js` (template menu) SKIP da F0.9 | ✅ confermata |
| 18 (da v.01) | `revision: 1` come start (cosmetica, bumpare a 2 con F0.12/F1.6) | ✅ confermata |
| 19 (da v.01) | Email `privacy@santamonicagenova.it` checklist pre-F0.21 | ✅ confermata |
| 20 (da v.01) | Bump `revision` cookieconsent solo per modifiche sostanziali policy | ✅ confermata |
| 21 (da v.01) | No iframe hardcoded F0.12+ (sempre JS+`onConsent`) | ✅ confermata |
| Convenzione operativa (da v.01) | Consegna file da Claude: file interi (outputs + present_files) | ✅ memorizzata #4 |
| P3.22 (da v.01) | Disclaimer "stato attuale di sviluppo" applicato in privacy/cookies | ✅ confermato e applicato |
| **22 (nuova)** | **F0.9-post chiusura · pacchetto release coordinato v 2026.05.19.02** | **✅ applicato** — target=_blank rel=noopener noreferrer su 15 link policy IT/EN/FR (5 per lingua) del cookieconsent-config (bug fix UX) + P3.5 `hideFromBots: true` esplicito + P3.8 `autoShow: !isPolicyPage` con detection regex `/privacy.html` o `/cookies.html` (opzione b) + bottone `.cc-manage` con `data-cc="show-preferencesModal"` aggiunto in privacy.html §12 (cookies.html lo aveva già da v 2026.05.17.02) |
| **23 (nuova)** | **F0.10 — specifiche regala.html informativa voucher** | **✅ applicato** — tagli 100/150/200€ · validità 6 mesi · CTA form Formspree con 6 campi · T5 checkbox opt-in marketing non pre-spuntato · IT only · palette legal pages · link a /voucher-termini.html con 404 temp accettato · banner cookie auto-show abilitato |
| **24 (nuova)** | **F0.11 — architettura Schema.org Restaurant + Dove siamo** | **✅ applicato** — Schema.org `@type: ItalianRestaurant` (M5b) in index.html `<head>` + dove-siamo.html `<head>` con `@id` per linking semantico · range prezzi €€€ · coordinate GPS 44.3913353, 8.9646575 (estratte da Google Maps URL via web search) · iframe OpenStreetMap pre-F0.12 (D13b) · pagina dedicata `/dove-siamo.html` mobile-first + sezione index.html `#info` aggiornata con link "Dettagli completi" · Place ID `ChIJGzMzZqlD0xIRKRomfkk1F2c` · servesCuisine array `["Italian","Seafood","Ligurian"]` · acceptsReservations true · mantenuti tutti i campi ricchi pre-esistenti di index.html (employee, award, paymentAccepted, currenciesAccepted, menu) |
| **25 (nuova)** | **Convenzione TARGET vs operative durante staging** | **✅ memorizzato e applicato** — il sito in costruzione (CF Pages staging) NON è quello live (Wix). Convenzione: inserire i dati TARGET pre-go-live (orari Mar-Ven cena/Sab-Dom pranzo+cena in vigore da giugno 2026 · email info@ già attiva). Discrepanze con info live attuali Wix sono attese e accettabili durante staging. FINAL CHECK obbligatorio pre-F0.21 go-live su tutte le info "operative" (orari, email, telefono, indirizzo, voucher, prezzi). Memoria persistente Claude #5 salvata. ROADMAP §1 F0.21 punto (2) checklist aggiornato |

---

## 2. DATI CHIAVE — modifiche consolidate

### 2.1 `cookieconsent-config.js` v 2026.05.19.02 (release 1/3)

Bump da v 2026.05.19.01. **3 modifiche tecniche**:

| Punto | Modifica | Razionale |
|-------|----------|-----------|
| bug fix UX (P3 emergente) | Aggiunto `target="_blank" rel="noopener noreferrer"` a tutti i 15 link policy nelle traduzioni IT/EN/FR (5 link per lingua: 2 in `consentModal.description` + 2 in `consentModal.footer` + 1 in `preferencesModal.sections[0].description`). I link `mailto:` NON modificati. | Coerenza con convenzione "Link footer Privacy/Cookies in `index.html`" già adottata da v 2026.05.17.08. Fix UX: click link dal banner non sposta più l'utente dal modale corrente, evita di perdere contesto e dover ricliccare per riaprire il banner. |
| P3.5 (backlog F0.9-post) | Aggiunto `hideFromBots: true` come opzione top-level di `CookieConsent.run({})` | È già il default v3 della libreria ma esplicitarlo aumenta robustezza vs eventuali breaking changes futuri della lib + leggibilità config + chiarisce intent (banner non viene mostrato ai crawler) |
| P3.8 opzione b (backlog F0.9-post) | Aggiunto `const isPolicyPage = /\/(privacy|cookies)\.html$/.test(window.location.pathname);` prima del `CookieConsent.run({...})`, e `autoShow: !isPolicyPage` come opzione top-level | Evita paradosso UX: "leggi la policy per acconsentire al banner che ti chiede di acconsentire alla policy". Utente atterrato direttamente da SERP/social su /privacy.html o /cookies.html può leggere policy senza interruzioni. Bottone "Gestisci preferenze cookie" (data-cc="show-preferencesModal") del footer/inline-content rimane operativo come trigger manuale del preferences modal. |

### 2.2 `privacy.html` v 2026.05.19.02 (release 1/3)

Bump da v 2026.05.19.01. **3 modifiche**:

| Punto | Modifica |
|-------|----------|
| P3.23 (nuovo, bloccante) | Aggiunto bottone `<button type="button" class="cc-manage" data-cc="show-preferencesModal">Gestisci preferenze cookie</button>` al termine della §12 «Cookie e tecnologie simili», prima della §13. Combinato con P3.8 opzione b applicata al config (autoShow: false su /privacy.html), questo è ora l'unico trigger del preferences modal su questa pagina. |
| CSS aggiunto | Blocco CSS `button.cc-manage` con styling coerente al bottone già presente in cookies.html §3 (background var(--accent), padding 0.7rem 1.4rem, transizione hover, ecc.) — 15 righe |
| Bump versioning UI + storico | `legal-meta` UI riga 131 + entry storico changelog interno (xx-05.02 in cima preservando precedenti) + footer legal-foot + commento finale + header commento entry modifiche |

### 2.3 `cookies.html` v 2026.05.19.02 (release 1/3)

Bump da v 2026.05.19.01. **Solo modifiche di versioning** (no modifiche funzionali):

| Punto | Modifica |
|-------|----------|
| Bump versioning | header commento (entry modifiche v.02 in cima) + `legal-meta` UI + footer legal-foot + commento finale + entry storico changelog interno |
| Nessuna modifica funzionale | Il bottone `.cc-manage` in §3 era già presente dalla v 2026.05.17.02 (HANDOVER §3.2 sessione 17-05). Il config v.02 applica P3.8 opzione b anche su /cookies.html → effetto: banner non auto-mostra, bottone in §3 resta unico trigger preferences |

Bump coordinato per coerenza convenzione "stesso NN su file rilasciati nella stessa sessione" (memoria #1 ROADMAP §12).

### 2.4 `regala.html` v 2026.05.19.03 (release 2/3 · NUOVO file)

Prima emissione. **Struttura completa**:

| Sezione | Contenuto |
|---------|-----------|
| Header commento | Stato BOZZA + decisioni A1-D2 documentate + TODO pre-pubblicazione (3 punti: endpoint Formspree, testi descrittivi, asset foto) |
| `<head>` | Meta SEO + canonical `https://santamonicagenova.it/regala.html` + link banner cookie CSS |
| `<style>` | Stessa palette legal pages (var(--bg) panna, var(--accent) bordeaux, font serif H1) + CSS dedicato cards prezzo + CSS form voucher con hover/focus/honeypot |
| Header pagina | Breadcrumb + H1 + meta tagli/validità riassuntivo |
| Summary box | Pitch sintetico 3 righe |
| Intro descrittiva | `[TESTO DA COMPLETARE]` 1-2 paragrafi |
| §I tagli disponibili | 3 card prezzo 100/150/200 € + desc placeholder ciascuna |
| §Come funziona | 3 step (richiedi · ricevi · regalalo o usalo) |
| §Termini essenziali | 5 bullet: validità, cumulabilità, no resto, smarrimento, modalità consegna + link a `/voucher-termini.html` |
| §Richiedi un voucher | Form Formspree completo: 6 campi (name + email + phone opt + amount select + occasion opt + marketing_consent checkbox T5) + honeypot `_gotcha` + hidden `_subject`. Endpoint placeholder `https://formspree.io/f/REPLACE_ME_VOUCHER`. GDPR-note con link a `/privacy.html` target=_blank. |
| §Domande frequenti | 4 FAQ |
| §Storico versioni | Entry v 2026.05.19.03 |
| Footer | Meta + 3 link (Privacy + Cookie target=_blank, Termini voucher) |
| Script | Banner cookie v3 bundle locale (auto-show abilitato perché non è policy page) |

348 righe totali.

### 2.5 `index.html` v 2026.05.19.04 (release 3/3)

Bump da v 2026.05.19.01. **4 modifiche**:

| # | Riga | Modifica |
|---|------|----------|
| 1 | 2 | Aggiunta entry commento v 2026.05.19.04 in cima allo storico modifiche |
| 2 | 42-110 | **Refactor completo Schema.org JSON-LD**: cambiato `@type` da `Restaurant` a `ItalianRestaurant` (dec. #24, M5b) · aggiunto `@id: https://santamonicagenova.it/#restaurant` per linking semantico con dove-siamo.html · email TARGET `info@santamonicagenova.it` (era `santamonicagenova@gmail.com`) · geo coordinate aggiornate da 44.391726/8.964593 a 44.3913353/8.9646575 (estratte da Google Maps URL via web search) · `hasMap` URL Google Maps con Place ID + parametro `q=place_id:...` (era URL OSM generico) · `openingHoursSpecification` riallineato a M4 TARGET (Mar-Ven cena, Sab-Dom pranzo+cena, Lun chiuso) · `servesCuisine` semplificato a array Schema.org-standard `["Italian", "Seafood", "Ligurian"]` (era array IT-string non standard) · `sameAs` IG aggiornato a `ristorantesantamonica` (era `santamonicaristorante` — URL fornito utente sessione) · mantenuti tutti i campi ricchi pre-esistenti (employee Chef + Sommelier, award Michelin, currenciesAccepted, paymentAccepted, menu, acceptsReservations) |
| 3 | 542, 545 | Coordinate iframe OSM bbox e marker allineate a `dove-siamo.html` (`bbox=8.9622,44.3893,8.9672,44.3933&marker=44.3913353,8.9646575` — più zoomate e precise rispetto a quelle pre-esistenti) · aggiunto `rel="noopener noreferrer"` su link "Apri in Maps" |
| 4 | 550-552 | Aggiunto link "Dettagli completi e indicazioni stradali → /dove-siamo.html" alla fine della sezione #info, con `data-i18n="info_dettagli_link"` (chiave non ancora in translations.json — sarà aggiunta al check pre-F0.21) |
| 5 | 807 | Footer commento bumpato a v 2026.05.19.04 |

**NON toccati intenzionalmente** (memoria operativa #5, dec. #25):
- Orari testuali in sezione #info (righe 517-523): contengono ancora orari "vecchi" Wix-style (Mar solo cena, Mer-Sab pranzo+cena, Dom solo pranzo). Allineamento al TARGET M4 rinviato a check pre-F0.21
- Email testuale in #info (riga 531): `santamonicagenova@gmail.com` Wix-style. Aggiornamento a `info@santamonicagenova.it` (già attiva) rinviato a check pre-F0.21
- Nav principale: voce "Contatti" → `#info` mantenuta. Link a `/dove-siamo.html` solo dal link in fondo a #info, NON duplicato in nav. Decisione su eventuale aggiunta voce nav "Dove siamo" rinviata a F2.x o check pre-F0.21
- `translations.json` v 2026.05.17.02: chiave `info_dettagli_link` non ancora presente — al primo cambio lingua EN/FR vedrai stringa di fallback (testo IT). Da inserire al check pre-F0.21 (~5 min, 3 lingue × 1 stringa)

Footer commenti storici file mantenuti tutti per traceability (8 entry, da v 2026.05.09.07 a v 2026.05.19.04).

### 2.6 `dove-siamo.html` v 2026.05.19.04 (release 3/3 · NUOVO file)

Prima emissione mobile-first. **Struttura completa**:

| Sezione | Contenuto |
|---------|-----------|
| Header commento | Stato BOZZA + decisioni M1-D13 documentate + TODO pre-pubblicazione (logo + foto + F0.12 sostituzione OSM con Google Maps + F2.2 traduzioni) |
| `<head>` | Meta SEO + canonical + Open Graph (`og:type=restaurant.restaurant`) + link banner cookie CSS + **Schema.org JSON-LD ItalianRestaurant** (allineato a quello di index.html con `@id` identico) |
| `<style>` | Palette identica legal pages + CSS responsive mobile-first (default mobile, breakpoint min-width: 640px per desktop) + CSS dedicati: `.contact-block` grid · `.contact-row` tap-friendly · `.hours` table · `.map-wrap` iframe wrapper · `.map-actions` bottoni · `.social-list` |
| Header pagina | Breadcrumb + H1 + subtitle indirizzo riassuntivo |
| §Contatti | 4 click-to-action righe: `tel:+390105533155` · `mailto:info@santamonicagenova.it` · Google Maps Place ID URL target=_blank · **`geo:` intent** (apre app mappe nativa Apple Maps/Google Maps sul dispositivo mobile) |
| §Orari di apertura | Tabella settimanale + **JS evidenzia il giorno corrente** (`new Date().getDay()` → classe `.today` su `<tr>` corrispondente con badge "oggi" sull'accent) |
| §Mappa | iframe OpenStreetMap (D13b, no cookie tracker) `loading="lazy"` con marker su coordinate + nota "Mappa fornita da OpenStreetMap · nessun cookie di tracciamento" |
| §Map actions | 2 bottoni: "Apri in Google Maps" (Directions API + destination_place_id) + "Apri in OpenStreetMap" |
| §Come arrivare | 3 sotto-sezioni: in auto · con mezzi pubblici (link AMT Genova) · a piedi |
| §Seguici | 2 link social IG + FB target=_blank |
| Footer | Meta + 4 link (Home, Voucher regalo, Privacy, Cookie target=_blank) |
| Script JS | (1) JS evidenzia giorno corrente · (2) Banner cookie v3 bundle locale (auto-show abilitato, non è policy page) |

505 righe totali.

### 2.7 File NON modificati (ma rilevanti)

| File | Versione attuale | Motivo no-modifica |
|------|------------------|---------------------|
| `lib/cookieconsent/cookieconsent.umd.js` | v3.1.0 upstream | Bundle vendored |
| `lib/cookieconsent/cookieconsent.css` | v3.1.0 upstream | Idem |
| `translations.json` | v 2026.05.17.02 | Banner ha sue traduzioni dentro cookieconsent-config.js. Chiave `info_dettagli_link` da aggiungere al check pre-F0.21 |
| `menu-admin.html` | v 2026.05.17.03 | Vercel admin, fuori scope |
| `admin-core.js` | v 2026.05.17.04 | Idem |
| `admin-templates-shared.js` | v 2026.05.17.02 | Dec. #17 SKIP da F0.9 |
| `_headers` | v 2026.05.17.01 | F0.18 / P3.4 valutare anticipo |
| `_redirects` | v 2026.05.17.01 | F0.16 |
| `functions/api/translate.js` | v 2026.05.17.02 | Live |

---

## 3. CONTESTO ESSENZIALE

### 3.1 Architettura attuale (post-sessione, post-upload + verifica utente)

```
santamonica-web.pages.dev / nuovo.santamonicagenova.it  (Cloudflare Pages staging · X-Robots-Tag: noindex,nofollow)
  ├─ index.html v 2026.05.19.04 ← Schema.org refactor ItalianRestaurant TARGET + @id linking · sezione #info con link "Dettagli completi" · coordinate OSM allineate
  ├─ privacy.html v 2026.05.19.02 ← bottone .cc-manage §12 (P3.23) · autoShow:false applicato via config · target=_blank link interni
  ├─ cookies.html v 2026.05.19.02 ← bump coordinato (no modifiche funzionali) · autoShow:false applicato via config · bottone .cc-manage §3 invariato
  ├─ regala.html v 2026.05.19.03 ← NUOVO · 3 tagli voucher · form Formspree placeholder · T5 opt-in checkbox · banner auto-show abilitato
  ├─ dove-siamo.html v 2026.05.19.04 ← NUOVO · mobile-first · Schema.org ItalianRestaurant duplicato con @id · OSM iframe (transitorio fino a F0.12) · click-to-action tel/mailto/geo: · highlight giorno corrente
  ├─ cookieconsent-config.js v 2026.05.19.02 ← target=_blank 15 link policy · hideFromBots: true · autoShow !isPolicyPage · 2 categorie (necessary + embeds predisposta F0.12)
  ├─ lib/cookieconsent/cookieconsent.umd.js (v3.1.0 upstream)
  ├─ lib/cookieconsent/cookieconsent.css (v3.1.0 upstream)
  ├─ translations.json v 2026.05.17.02 (chiave info_dettagli_link mancante — check pre-F0.21)
  ├─ menu*.html (IT/EN/FR + dolci/allergeni/vini): SENZA banner (dec. #17) · invariati
  └─ _headers v 2026.05.17.01 · _redirects v 2026.05.17.01 · functions/api/translate.js v 2026.05.17.02

santamonicagenova-a11y.github.io/SantaWeb  (GitHub Pages — live, SEO intatta)
  └─ stesso repo · stessi file post-deploy

santa-web-peach.vercel.app  (Vercel — admin invariato)
  └─ menu-admin.html v17.03 + admin-core.js v17.04 + admin-templates-shared.js v17.02 + ...
```

### 3.2 File deploy correnti (stato consolidato)

| File | Versione | Hosting | Cambiato in sessione? |
|---|---|---|---|
| **`index.html`** | **v 2026.05.19.04** ⭐ | GH Pages + CF Pages | **sì (Schema.org refactor + #info aggiornamenti)** |
| **`dove-siamo.html`** | **v 2026.05.19.04** ⭐ NUOVO | GH Pages + CF Pages | **sì (prima emissione)** |
| **`regala.html`** | **v 2026.05.19.03** ⭐ NUOVO | GH Pages + CF Pages | **sì (prima emissione)** |
| **`privacy.html`** | **v 2026.05.19.02** ⭐ | GH Pages + CF Pages | **sì (bottone .cc-manage)** |
| **`cookies.html`** | **v 2026.05.19.02** ⭐ | GH Pages + CF Pages | **sì (bump coordinato)** |
| **`cookieconsent-config.js`** | **v 2026.05.19.02** ⭐ | GH Pages + CF Pages | **sì (target=_blank + hideFromBots + autoShow conditional)** |
| `lib/cookieconsent/cookieconsent.umd.js` | v3.1.0 upstream | GH Pages + CF Pages | no |
| `lib/cookieconsent/cookieconsent.css` | v3.1.0 upstream | GH Pages + CF Pages | no |
| `translations.json` | v 2026.05.17.02 | GH Pages | no (chiave `info_dettagli_link` da aggiungere check pre-F0.21) |
| `menu-admin.html` | v 2026.05.17.03 | Vercel | no |
| `admin-core.js` | v 2026.05.17.04 | Vercel | no |
| `admin-templates-shared.js` | v 2026.05.17.02 | Vercel | no (dec. #17 SKIP) |
| `foto-optimizer.js` | v 2026.05.09.02 | Vercel | no |
| `api/translate.js` (legacy) | v 2026.05.14.01 | Vercel | no |
| `functions/api/translate.js` | v 2026.05.17.02 | Cloudflare Pages | no |
| `_headers` | v 2026.05.17.01 | Cloudflare Pages | no |
| `_redirects` | v 2026.05.17.01 | Cloudflare Pages | no |

⭐ = rilasciato in questa sessione

### 3.3 Convenzioni progetto (aggiornate 19-05 sera tardi)

| Aspetto | Convenzione |
|---|---|
| Versioning file | `v YYYY.MM.DD.NN` (header + footer/UI visibile dove applicabile) |
| Naming continuità | `NOMEFILE_vYYYY.MM.DD.NN.ext` |
| Naming deploy | NO versione nel nome |
| Release | Sostituzione completa · vecchio rimosso da KB · storico in Git |
| File con suffisso `-FIXED`/`-OLD`/`-BACKUP`/`-COPY` | VIETATI in repo (dec. #15) |
| DNS authoritative `santamonicagenova.it` | Wix (`ns14/15.wixdns.net`) fino a F0.21 (dec. #16) |
| Banner cookie su pagine pubbliche | Solo navigazionali (index/privacy/cookies/regala/dove-siamo). NON su pagine menu (dec. #17) |
| Banner cookie auto-show | Abilitato di default · disabilitato condizionalmente solo su `/privacy.html` e `/cookies.html` via `autoShow: !isPolicyPage` (dec. #22) |
| Bottone "Gestisci preferenze cookie" (.cc-manage data-cc="show-preferencesModal") | Obbligatorio in pagine con autoShow disabilitato (privacy/cookies). Su altre pagine opzionale (revoca via link Cookies del footer + bottone preferenze del banner stesso) |
| Link interni alle policy nei banner cookie | `target=_blank rel=noopener noreferrer` su TUTTI i 15 link policy delle traduzioni IT/EN/FR (dec. #22) |
| Link footer Privacy/Cookies in pagine | `target=_blank rel=noopener noreferrer` (OWASP best practice — già consolidato) |
| Bundle JS terze parti | Sempre bundle locale in `/lib/<nome>/`, mai CDN per asset critici |
| Bump `revision` cookieconsent | Solo per modifiche sostanziali policy (dec. #20) |
| Embed di terze parti | SEMPRE iniettati via JS condizionato dal callback `onConsent`. MAI `<iframe>` hardcoded in HTML (dec. #21) **eccezione**: OpenStreetMap iframe in `dove-siamo.html` + `index.html` accettata transitoriamente fino a F0.12 (no cookie tracker — dec. #24) |
| Consegna file modificati da Claude | Sempre file interi completi in /mnt/user-data/outputs + present_files. Mai patch/frammenti before-after (memoria #4) |
| Convenzione TARGET vs operative durante staging | Inserire dati TARGET pre-go-live (orari/email/contatti effettivi al momento del go-live). FINAL CHECK obbligatorio pre-F0.21 su tutte le info (dec. #25, memoria #5) |
| Lingue | IT/FR/EN (DE/ES ritirate via F0.4) |
| Schema.org Restaurant | `@type: ItalianRestaurant` · `@id: https://santamonicagenova.it/#restaurant` · duplicato in index.html `<head>` e dove-siamo.html `<head>` per massimizzare segnali SEO · linking via @id identico (dec. #24) |
| Pagine mobile-first | dove-siamo.html è la prima pagina del progetto con approccio mobile-first esplicito (default mobile, breakpoint min-width: 640px per desktop). Pattern riusabile per future pagine. |
| `_meta` in JSON | chiave `_meta` come prima entry con version/languages/last_updated/note |
| URL fetch admin | costante `BASE_FETCH_URL` centralizzata in `admin-core.js` (da v17.04) |
| Stampa carta | html font-size 20px in @media print (+25% leggibilità) |
| Stampa orario | scoped override `#layout-orario` (font −22%) |
| Coordinate GPS canoniche progetto | `44.3913353, 8.9646575` (estratte da Google Maps Place ID URL via web search 19-05) |
| Place ID Google canonico | `ChIJGzMzZqlD0xIRKRomfkk1F2c` (dec. #8) |

### 3.4 REGOLA OPERATIVA FISSA (versionamento)

> Ogni file prodotto per il progetto Santamonica/SantaWeb deve avere la versione aggiornata in formato `v YYYY.MM.DD.NN`, sia in header sia in footer/UI quando applicabile. La nuova versione va **comunicata esplicitamente** all'utente quando si presenta il file.
>
> La regola si applica a tutti i file: deploy (HTML/JS/CSS/JSON) e documenti di continuità (handover/changelog/roadmap/manuali).
>
> **Versione anche nel nome** (solo documenti di continuità): `NOMEFILE_vYYYY.MM.DD.NN.ext`. File di deploy NON portano versione nel nome.
>
> **Sostituzione ad ogni release**: file con versione precedente rimosso dalla KB, sostituito dalla nuova versione. Storico in Git.
>
> **Coordinamento `NN` multi-documento**: per release di sessione (HANDOVER + CHANGELOG + ROADMAP + file deploy della sessione) usare lo stesso `NN`. Per release autonome di un singolo documento, `NN` per-documento.
>
> **Eccezione operativa accettata sessione 19-05**: se nella stessa sessione si rilasciano più batch separati di file deploy a NN incrementali (.02, .03, .04), i documenti di continuità prodotti a fine sessione adottano l'`NN` più alto della giornata (.04 nel caso 19-05) come release coordinata complessiva, citando esplicitamente i NN intermedi.
>
> **Questa regola va riportata in ogni documento di continuità per propagarla.**

### 3.5 Sistema auth/credenziali (invariato)

| Servizio | Stato | Storage |
|---|---|---|
| GitHub PAT fine-grained | ✅ attivo · scadenza 2027-05-17 · scope `Contents R/W` solo SantaWeb | `localStorage['gh_token']` admin |
| HMAC salt | ✅ generato 17-05 (Bitwarden) · injection F0.15 | env `CONSENT_HMAC_SALT` Cloudflare |
| Cloudflare | ✅ 2FA TOTP + recovery codes | — |
| DeepL Free | ✅ API key (CF + Vercel) | env `DEEPL_KEY` |
| Vercel admin | ✅ attivo | localStorage admin |
| Wix account | ⚠️ pannello DNS authoritative attivo | — |
| Formspree | ✅ attivo (account già usato per prenotazioni). Endpoint dedicato form voucher (regala.html) da configurare prima del go-live operativo F0.10 | — |
| Email `info@santamonicagenova.it` | ✅ GIÀ ATTIVA (precisazione utente 19-05). Altre alias @santamonicagenova.it da attivare con Cloudflare Email Routing F0.21 | — |

### 3.6 Memorie persistenti Claude (cross-sessione)

| # | Memoria | Stato |
|---|---|---|
| 1 | Versioning v YYYY.MM.DD.NN in header+footer+UI · documenti continuità anche nel nome file · release = sostituzione · propagazione regola | ✅ attiva |
| 2 | GitHub PAT scadenza 2027-05-17 (rinnovo 2027-04-15) · storage localStorage admin | ✅ attiva |
| 3 | Workflow GitHub web UI (no clone locale, no git CLI) · commit direct to main | ✅ attiva |
| 4 | Consegna file interi (outputs + present_files), no patch/frammenti before-after | ✅ attiva |
| **5 (nuova)** | **Convenzione TARGET vs operative durante staging + FINAL CHECK obbligatorio pre-F0.21 su orari/email/telefono/indirizzo/voucher/prezzi** | **✅ aggiunta 19-05 sera tardi** |

---

## 4. PROSSIMI PASSI

### 4.1 Fasi chiuse questa sessione (consolidamento)

| Fase | Status finale | Note |
|------|---------------|------|
| **F0.9** | ✅ **CHIUSA 100% definitivo** | Verifica funzionale OK + chiusura post-verifica (P3.5 + P3.8 applicati, bug fix UX target=_blank, P3.23 risolto) |
| **F0.10** | ✅ **CHIUSA 100% tecnico** | regala.html v 2026.05.19.03 prima emissione. TODO operativi non bloccanti: endpoint Formspree reale + testi descrittivi placeholder (memoria #5 final check pre-F0.21) |
| **F0.11** | ✅ **CHIUSA 100% tecnico** | index.html refactor Schema.org + dove-siamo.html prima emissione. TODO non bloccanti: logo URL + foto hero (placeholder) + allineamento orari/email visibili sezione #info al check pre-F0.21 |

### 4.2 Prossima sessione (F0.12)

**F0.12 — Maps + iframemanager Iubenda** (sforzo M+, ~3h):

| # | Task | Note |
|---|------|------|
| 1 | Sostituire iframe OpenStreetMap (dove-siamo.html + index.html sezione #info) con embed Google Maps gestito da consent banner | Usare iframemanager Iubenda o pattern manuale `onConsent` (dec. #21) |
| 2 | Implementare callback `onConsent` + `onChange` nel cookieconsent-config.js per gestire iframe Maps dinamico (caricamento condizionato al consenso category `embeds`) | TODO F0.12 già flaggato in v 2026.05.19.02 |
| 3 | P3.3 audit periodico cookie Maps Embed con DevTools per aggiornare regex se Google introduce nuovi cookie | da fare durante F0.12 |
| 4 | P3.9 aggiornare cookies.html con tabella durata NID/SOCS/OGPC + finalità + trasferimento extra-UE | da fare durante F0.12 |
| 5 | P3.10 preferencesModal sezione embeds menzionare trasferimento Google LLC USA (DPF UE-USA 2023) | da fare durante F0.12 |
| 6 | P3.14 implementazione no-iframe-hardcoded (dec. #21) | conforme by design F0.12 |
| 7 | P3.16 decisione tenere/rimuovere/rinominare label "Google Maps" del service predisposto | decisione utente in apertura F0.12 |
| 8 | Bump `revision: 2` nel config cookieconsent (dec. #20 — modifiche sostanziali policy: nuovi trattamenti effettivi) | conforme convenzione |
| 9 | Rimuovere disclaimer P3.22c "stato attuale di sviluppo" da privacy.html §12 e cookies.html §4 (parte Maps) | quando Google Maps effettivamente attivo |
| 10 | (Opzionale) Anticipo P3.4 CSP minima in `_headers` come pre-task F0.12 — `default-src 'self'; script-src 'self' https://maps.googleapis.com; frame-src 'self' https://www.google.com; ...` | +1h sessione, ma è scudo prima di aprire embeds esterni |

### 4.3 Sessioni successive

| Sessione | Item | Sforzo |
|----------|------|--------|
| +1 (post F0.12) | F0.13 (Stripe Payment Links) + F0.14 (voucher-termini.html) — rimozione disclaimer P3.22c residui (parte Stripe) · sostituzione form Formspree in regala.html con 3 bottoni Stripe Payment Links · F0.14 testo termini DIY | S+ + S |
| +2 | F0.16 (redirect 301 nativi `_redirects`) + F0.17 (sitemap + hreflang multilingua) | S + XS |
| +3 | F0.18 (CSP + security headers — completare se P3.4 non anticipato a F0.12) + F0.15 (newsletter Brevo + audit log HMAC) | S + L |
| +4 | F0.19 (TTL DNS 300s · 48h pre-switch) + F0.20 (test E2E completo) | XS + M |
| +5 | F0.21 SWITCH GO-LIVE — include **FINAL CHECK INFO** (dec. #25 — orari, email, telefono, indirizzo, voucher, prezzi, link interni) + Email Routing attivazione + rimozione X-Robots-Tag noindex + rieseguire V5 Rich Results Test in URL mode | M |

### 4.4 Lavori rimandati / decisioni differite (aggiornata)

| Item | Quando | Motivo |
|------|--------|--------|
| Sostituire endpoint Formspree placeholder `REPLACE_ME_VOUCHER` con reale | F0.10-post operativo (quando utente configura form voucher nel dashboard Formspree) | Non bloccante per chiusura tecnica |
| Sostituire `[TESTO DA COMPLETARE]` in regala.html (4 placeholder: intro + 3 card desc) | Quando utente fornisce copy | Non bloccante |
| Caricare logo URL + foto hero JPG (sostituire placeholder in Schema.org index/dove-siamo) | F1.5 / sessione dedicata asset | Decisione aperta #7 ROADMAP |
| Aggiungere chiave `info_dettagli_link` in translations.json (IT/EN/FR) | Check pre-F0.21 (~5 min) | Stringa di fallback OK temporaneamente |
| Allineare orari + email visibili sezione #info di index.html ai TARGET M4 + info@ | Check pre-F0.21 (dec. #25 + memoria #5) | Convenzione TARGET vs operative |
| Test P3.1 `closeIconLabel` preferencesModal | F0.9-post / Q1 2026 | Verifica post-deploy |
| Test P3.12 cross-tab cookie | F0.9-post / con target=_blank ora applicato anche al banner, valutare se ripetere | Verifica |
| Anticipo CSP minima (P3.4) | F0.12 pre-task valutare · F0.18 sicuro | Decisione utente prossima sessione |
| Decisione `disablePageInteraction` (P3.6) | Backlog interpretativo | No decisione obbligata |
| Decisione `flipButtons` (P3.11) | Backlog interpretativo | No decisione obbligata |
| Rimozione fisica `menu-de.html`/`menu-es.html`/etc | F0.21 | Dec. #13 |
| F0.3bis Email Routing attivazione completa (alias `privacy@`, ecc.) | F0.21 | Dec. #19 · info@ già attiva |
| F0.8 revisione legale privacy | indefinito | Decisione utente 17-05 |
| Repo privato | post-F0.21 | GH Pages free tier |
| 2FA Google/Stripe/GitHub verifica | sessione dedicata | Compliance Art. 32 GDPR |
| Refactor template `CARTA_TPL_B` | F1.0 | TODO ereditato |
| Test V5 Rich Results Test in URL mode | F0.21 post-rimozione noindex | Comportamento atteso staging |

---

## 5. ALLEGATI / RIFERIMENTI

### 5.1 Catena documenti di continuità (cronologica aggiornata)

1. `HANDOVER_FINALE_SantaWeb_v2026.05.02.01.md`
2. `HANDOVER_Santamonica_Web_v2026.05.09.01.md`
3. `HANDOVER_Santamonica_Web_v2026.05.09.02.md`
4. `HANDOVER_Santamonica_Web_v2026.05.13.01.md`
5. `HANDOVER_Santamonica_Web_v2026.05.14.01.md`
6. `HANDOVER_Santamonica_Web_v2026.05.15.01.md`
7. `HANDOVER_Santamonica_Web_v2026.05.15.02.md`
8. `HANDOVER_Santamonica_Web_v2026.05.15.06.md`
9. `HANDOVER_Santamonica_Web_v2026.05.16.01.md`
10. `HANDOVER_Santamonica_Web_v2026.05.17.01.md`
11. `HANDOVER_Santamonica_Web_v2026.05.17.02.md`
12. `HANDOVER_Santamonica_Web_v2026.05.17.03.md`
13. `HANDOVER_Santamonica_Web_v2026.05.17.04.md`
14. `HANDOVER_Santamonica_Web_v2026.05.17.05.md`
15. `HANDOVER_Santamonica_Web_v2026.05.17.06.md` (F0.9 90% · banner cookie)
16. `HANDOVER_Santamonica_Web_v2026.05.19.01.md` (F0.9 P2+P3 · 4 file deploy · 100% pendente verifica)
17. **`HANDOVER_Santamonica_Web_v2026.05.19.04.md`** (questo) — F0.9 CHIUSO 100% definitivo + F0.10 + F0.11 · 6 file deploy in 3 batch (.02/.03/.04) · dec. #22-#25

### 5.2 File chiave per riprendere il lavoro

| File | Scopo |
|---|---|
| `ROADMAP_Santamonica_Web_v2026.05.19.04.md` | Piano 12 mesi · F0.9/F0.10/F0.11 tutti chiusi · prossimi step F0.12 |
| `METODO_Continuita_Progetti_v2026.05.15.01.md` | Metodologia (invariato) |
| `PLAYBOOK_Avvio_Progetto_v2026.05.17.02.md` | Procedure retrofit + loop 3 passate (invariato) |
| `GUIDA_OPERATIVA_v2026.05.17.01.md` | Prompt copia-incollabili (invariato) |
| `CHANGELOG_Santamonica_Web_v2026.05.19.04.md` | Storico sessioni aggiornato |
| `HANDOVER_Santamonica_Web_v2026.05.19.04.md` | Questo · stato fine sessione |

### 5.3 Repo e ambienti (invariati)

- **GitHub repo**: `github.com/santamonicagenova-a11y/SantaWeb`
- **GitHub Pages**: `https://santamonicagenova-a11y.github.io/SantaWeb` (live · SEO intatta)
- **Admin Vercel**: `https://santa-web-peach.vercel.app/menu-admin.html`
- **Cloudflare Pages**: `https://santamonica-web.pages.dev` (live · staging · `noindex,nofollow`)
- **Custom domain Cloudflare**: `https://nuovo.santamonicagenova.it` ✅ (DNS via Wix)
- **Sito Wix attuale**: `https://www.santamonicagenova.it` (da dismettere in F0.21)
- **DNS authoritative dominio**: `ns14.wixdns.net` + `ns15.wixdns.net` (NON Aruba)

### 5.4 File toccati questa sessione (consolidato)

| File | Modifica | Versione finale |
|---|---|---|
| `cookieconsent-config.js` | +25 righe header changelog · +1 const isPolicyPage · +2 opzioni top-level (autoShow + hideFromBots) · +15 link policy con target+rel · footer bump | v 2026.05.19.02 |
| `privacy.html` | +20 righe header changelog · +15 righe CSS .cc-manage · +1 bottone HTML §12 (P3.23) · entry storico v.02 in cima · 4 marker version bump | v 2026.05.19.02 |
| `cookies.html` | +25 righe header changelog · entry storico v.02 in cima · 4 marker version bump · NESSUNA modifica funzionale | v 2026.05.19.02 |
| `regala.html` | NUOVO file (348 righe) · 4 sezioni principali + form Formspree + banner cookie + Schema-free | v 2026.05.19.03 |
| `index.html` | +1 riga commento storico v.04 · refactor blocco Schema.org JSON-LD (righe 42-110, ~70 righe modificate) · 2 modifiche coordinate iframe OSM #info · +1 link "Dettagli completi" · footer bump | v 2026.05.19.04 |
| `dove-siamo.html` | NUOVO file (505 righe) · Schema.org JSON-LD ItalianRestaurant · 8 sezioni mobile-first · OSM iframe + click-to-action + highlight giorno · banner cookie | v 2026.05.19.04 |
| `HANDOVER_Santamonica_Web_v2026.05.19.04.md` | NUOVO | v 2026.05.19.04 |
| `CHANGELOG_Santamonica_Web_v2026.05.19.04.md` | NUOVO (sostituisce v.01) | v 2026.05.19.04 |
| `ROADMAP_Santamonica_Web_v2026.05.19.04.md` | NUOVO (sostituisce v.01 · bump v.13 → v.14) | v 2026.05.19.04 |

### 5.5 File NON modificati

`menu-admin.html`, `admin-core.js`, `admin-templates-shared.js` (dec. #17), `admin-translations.js`, `foto-optimizer.js`, `translations.json` (chiave `info_dettagli_link` mancante da aggiungere check pre-F0.21), `menu-*.html` (IT/EN/FR + dolci/allergeni/vini), `_headers`, `_redirects`, `functions/api/translate.js`, `api/translate.js` (legacy), `.gitignore`, `lib/cookieconsent/cookieconsent.umd.js`, `lib/cookieconsent/cookieconsent.css`.

### 5.6 KB cleanup (azione utente fine sessione)

| Rimuovere dalla KB | Aggiungere alla KB |
|---|---|
| `HANDOVER_Santamonica_Web_v2026.05.19.01.md` | `HANDOVER_Santamonica_Web_v2026.05.19.04.md` |
| `CHANGELOG_Santamonica_Web_v2026.05.19.01.md` | `CHANGELOG_Santamonica_Web_v2026.05.19.04.md` |
| `ROADMAP_Santamonica_Web_v2026.05.19.01.md` | `ROADMAP_Santamonica_Web_v2026.05.19.04.md` |

### 5.7 Conteggio cumulativo loop 3 passate F0.9

| Passata | Punti rilevati | Applicati in sessione (cumulativo) | Archiviati/differiti |
|---------|----------------|------------------------------------|----------------------|
| P1 (formale) | 12 | 12 | 0 |
| P2 (sostanziale GDPR/cookie law) | 10 | 3 (#4 bloccante, #1 importante, #8 medio) | 6 archiviati + 1 declassato a F0.21 (#6 → dec. #19) |
| P3 (autocritica + adversarial) | 20 + 3 emergenti (P3.21, P3.22, P3.23) = 23 | 5 (P3.5, P3.8, P3.21, P3.22, P3.23) | 12 promossi a backlog ROADMAP §10 + 3 non applicabili + 3 in opzionale F0.9-post |
| **Totale F0.9** | **45 punti rilevati** | **20 applicati** | **25 archiviati/differiti** |

Loop F0.9 ufficialmente concluso. F0.9 + F0.9-post integralmente chiusi in 2 sessioni:
- sessione 19-05.01 (mattina): P2 + P3 prima passata, 18 applicati
- sessione 19-05.04 (sera tardi, questa): P3.5 + P3.8 + P3.23 (nuovo) applicati, restanti 12 in backlog distribuiti su F0.12 / F0.15 / F0.18 / F0.21 / backlog interpretativo

---

**Fine HANDOVER · v 2026.05.19.04**

*Versione documento: v 2026.05.19.04 — sessione chiusura F0.9 definitivo + F0.10 + F0.11 · 6 file deploy in 3 batch coordinati · dec. #22-#25 · memoria operativa #5 nuova · conferma utente V1-V4 OK su tutti i deploy · prossima sessione F0.12 (Maps + iframemanager) con possibile anticipo P3.4 CSP.*
