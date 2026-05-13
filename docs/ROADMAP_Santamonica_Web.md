# ROADMAP — Santamonica Web
**Repo:** `github.com/santamonicagenova-a11y/SantaWeb`
**Creato:** 2026-05-13 (consolidato da `HANDOVER_FINALE_SantaWeb_2026-05-02.md` + lavori arretrati raccolti in `CHANGELOG_Santamonica_Web.md`)
**Aggiornamento:** rivedere ad ogni inizio sessione, spostare item completati nel CHANGELOG

---

## CRITERI DI PRIORITÀ

| Priorità | Significato | Quando affrontare |
|---|---|---|
| **P1** | Verifica aperta o decisione business bloccante | Prossima sessione di lavoro |
| **P2** | Manutenzione tecnica · pulizia · debito tecnico | Quando capita una sessione tranquilla |
| **P3** | Feature nuove di valore medio | Pianificare in slot dedicato |
| **P4** | Nice-to-have · feature long-tail | Quando il progetto sarà maturo |

Sforzo: **S** = ≤30 min · **M** = 1-3 h · **L** = ≥1 sessione dedicata · **XL** = multi-sessione

---

## P1 — DA RISOLVERE SUBITO

### P1.1 Verifica deploy `admin-templates-shared.js` v 2026.05.13.01 [S]
**Da fare:**
- Confermare push avvenuto su repo GitHub `SantaWeb`
- Verificare Vercel rebuild completato (~30-60s dopo push)
- Aprire admin → menu carta → Preview → Cmd/Ctrl+P → controllare testo +50% in anteprima stampa
- **CRITICO:** stampare anteprima foglio orario (2 colonne) → verificare assenza overflow

**Esito atteso:** se foglio orario va in overflow, applicare fallback documentato in `HANDOVER_Santamonica_Web_2026-05-13.md` §2.3 (riduzione font a 21px o 19px, o scaling selettivo solo su `.piatto`).

### P1.2 Verifica deploy `index.html` v2026.05.09.07 + `translations.json` 96 chiavi [S]
**Contesto:** prodotti il 2026-05-09 v2, ma non confermati come deployati nelle sessioni successive.

**Da fare:**
- Aprire https://santamonicagenova-a11y.github.io/SantaWeb/ → ispezionare footer (deve vedersi `v2026.05.09.07`)
- Testare form `#prenota`: deve avere campo email separato, hint "Almeno uno tra telefono ed email", asterisco rosso automatico
- Verificare footer grid 3 colonne (brand sx · social al centro · copyright dx)
- Switch lingua: tutte le label/placeholder/hint/errori del form devono tradursi in 5 lingue

### P1.3 Decisione business: taglio lingue DE/ES [decisione, non sviluppo]
**Contesto:** target reale del ristorante è IT + francesi + nord-italiani (notazione dalle sessioni precedenti). Mantenere DE/ES costa: tempo di traduzione DeepL, manutenzione traduzioni, complessità form.

**Opzioni:**
| Scelta | Pro | Contro |
|---|---|---|
| Mantenere tutte e 5 | Massima inclusività | Quota DeepL consumata, codice/JSON più pesanti |
| Tagliare DE + ES | Quota DeepL -40%, codice più leggero | Eventuali turisti tedeschi/spagnoli senza menu lingua |
| Tagliare solo ES | Compromesso | Turisti tedeschi servono comunque |

**Output atteso:** decisione utente → se taglio, sviluppo a P2.

---

## P2 — MANUTENZIONE / PULIZIA (basso rischio)

### P2.1 Rimuovere `admin-templates.js` legacy da `menu-admin.html` [S]
**Dove:** `menu-admin.html` riga 175 (`<script src="admin-templates.js"></script>`).
**Verifica preventiva:** grep nel codice per assicurarsi che nessuna funzione di `admin-templates.js` sia ancora referenziata altrove. Le funzioni produttive sono ormai in `admin-templates-shared.js`.
**Risk:** basso (legacy non più necessario).

### P2.2 Pulizia `gallery-photos.json` legacy [S]
**Contesto:** dopo lo switch a schema `{src, srcThumb, alt}` (sessione 09-05 mattutina), eventuali entry con solo `src` (senza `srcThumb`) caricano la versione full 2400px anche in griglia → spreco banda.
**Da fare:** aprire `gallery-photos.json` su GitHub Pages → confermare che tutte le 6 voci hanno `srcThumb`. Se no, ricaricare le foto via admin → "📷 Foto cucina".

### P2.3 Cleanup file foto legacy in `img/galleria/` [S]
**Contesto:** la sessione 09-05 ha generato file nuovi WebP, ma quelli vecchi (JPG eventualmente, o WebP a 75% quality, o senza thumb) potrebbero essere rimasti.
**Da fare:** elencare file in `img/galleria/` su GitHub → rimuovere quelli non referenziati dal `gallery-photos.json` attuale.
**Risk:** medio. Backup file prima di delete.

### P2.4 Eventuale ingrandimento font stampa anche su vini e allergeni [S]
**Condizionale:** solo se l'utente segnala che anche queste stampe sono troppo piccole.
**Dove:** `_VINI_TPL` in `admin-core.js:1182` (lista vini) · `apriPreviewAllergeni()` in `admin-core.js:984`.
**Modifica:** aggiungere `html { font-size: 24px; }` nei rispettivi blocchi `@media print` (replica della modifica fatta su `CARTA_TPL_B` il 13-05).

---

## P3 — FEATURE A MEDIO TERMINE (Q2/Q3 2026)

### P3.1 Consolidamento traduzioni admin [M]
**Contesto:** `admin-translations.js` è separato da `admin-templates-shared.js`. Una volta consolidato `admin-templates.js` legacy (P2.1), valutare merge.
**Beneficio:** un solo file di traduzione admin → meno script da caricare, ordine deterministico.
**Rischio:** medio. Test su tutte le 5 lingue dopo merge.

### P3.2 Version history menu [M]
**Cosa:** backup automatico dell'ultimo menu pubblicato prima di ogni nuova pubblicazione. Storage: branch Git separato `menu-backups/`, oppure file `menu-it.{YYYY-MM-DD-NN}.html.bak` in root.
**Beneficio:** rollback in 1 click se una pubblicazione introduce un errore.
**Implementazione:** in `admin-core.js`, funzione `traduciEPubblica()` → prima del PUT su GitHub, fare GET del file corrente e PUT come backup.

### P3.3 Dark mode admin [M]
**Cosa:** toggle 🌗 in top-bar admin che inverte `--ink/--cream` via CSS variables, salva preferenza in `localStorage['admin_theme']`.
**Beneficio:** UX serale per chi usa l'admin.
**Implementazione:** classe `.dark-mode` su `<body>`, sostituzione tokens CSS. Tutti gli stili admin già usano `var(--ink)`, `var(--cream)` → modifica concentrata.

### P3.4 Documentazione utente per il personale [M]
**Cosa:** un breve PDF/markdown per chi usa l'admin (utenti non tecnici): come aggiornare prezzi, come pubblicare lingue, come ricaricare foto, cosa fare se compare il modal DeepL.
**Beneficio:** indipendenza operativa dell'utente da Claude per modifiche di routine.
**Output:** `docs/MANUALE_UTENTE_admin.md` (mai pubblicato sul sito; solo per uso interno).

---

## P4 — LUNGO TERMINE (Q3/Q4 2026)

### P4.1 Admin responsive mobile [L]
**Contesto:** l'admin oggi è desktop-only. Editing da iPad/iPhone non praticabile.
**Beneficio:** modifiche al volo quando si è fuori sede (es. "stamattina mancano le ostriche dal menu").
**Sforzo:** medio-alto. Richiede ripensare il layout multi-colonna del form di editing piatti.

### P4.2 Drag-drop sezioni piatti [L]
**Cosa:** riordinare l'ordine delle sezioni del menu (antipasti, primi, ecc.) trascinandole nell'admin invece di modificare il codice.
**Implementazione:** libreria leggera come `Sortable.js` (no jQuery).

### P4.3 Preview real-time lingue [L]
**Cosa:** mentre si modifica una sezione, vedere live l'anteprima delle 5 lingue affiancate (split view).
**Beneficio:** controllo immediato della qualità della traduzione DeepL.
**Sforzo:** alto (chiamate DeepL in tempo reale durante l'editing → costo quota).

### P4.4 Analytics click tracking [L]
**Cosa:** capire quali sezioni/piatti del menu online sono più viste, click su Instagram/Facebook, traffico per lingua.
**Implementazione:** alternativa GDPR-compliant a Google Analytics, es. Plausible self-hosted o Umami.
**Decisione preliminare richiesta:** tracking SI/NO (privacy del ristorante e dei clienti).

---

## ITEM CHIUSI RECENTEMENTE (per memoria)

Item completati in sessioni recenti — già documentati nel `CHANGELOG_Santamonica_Web.md`, qui solo per evitare di rimetterli in roadmap.

- ✅ 2026-05-13 — Font +50% in stampa preview menù carta + orario
- ✅ 2026-05-09 v2 — Form prenotazione unificato (occasioni + standard) con discriminator `tipo`
- ✅ 2026-05-09 v2 — Footer grid 3 colonne
- ✅ 2026-05-09 v2 — Asterisco automatico campi required via CSS `:has()`
- ✅ 2026-05-09 mattutina — Sistema doppia ottimizzazione WebP (full + thumb)
- ✅ 2026-05-09 mattutina — Foto sito dinamiche via `site-images.json`
- ✅ 2026-05-09 mattutina — Rimozione popup booking 5s + link TheFork esterni
- ✅ 2026-05-02 — Switch motore traduzione Google Translate → DeepL
- ✅ 2026-05-02 — Rimozione simboli € da prezzi (admin + menu)
- ✅ 2026-04-28 — Fix BUG 2 (defensive check percorsi) + BUG 4 (link QR mancanti)

---

## REGOLE DI MANUTENZIONE ROADMAP

1. **Aggiornare ad ogni sessione**: spostare gli item completati in "Item chiusi recentemente" (vivono qui per ~2-3 sessioni, poi solo nel CHANGELOG).
2. **Promuovere item** quando le condizioni cambiano: es. se l'utente decide il taglio lingue (P1.3), il taglio operativo passa da decisione a P2.
3. **Aggiungere nuovi item** quando emergono in sessione (es. utente che dice "anche la lista vini va ingrandita" → P2.4 si attiva).
4. **Non rimuovere item P4 senza motivo**: i nice-to-have possono restare anni in lista, è ok.

---

**Fine roadmap.**
