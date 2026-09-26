# CHANGELOG — Santamonica Web

**Versione documento:** v 2026.09.26.02
**Aggiornato:** 2026-09-26

> Voci ordinate dal più recente al più vecchio. Appendere in cima a ogni sessione.

---

### 2026-09-26 — Food Cost: avviso su spesa semplice "Pesce e crostacei" + righe di Tracciabilità modificabili (edge function v11) · sorgente edge function salvato nel repo

**Versioni rilasciate:**
- `menu-admin.html` v 2026.09.26.01 → v 2026.09.26.02 (Vercel)
- Edge function `foodcost-admin` **v11** (Supabase SafeTable, versione piattaforma 21), nuova azione `tracciabilita_update`
- `supabase/functions/foodcost-admin/index.ts` v11 (NUOVO nel repo: prima il sorgente esisteva solo su Supabase)
- `docs/LESSONS_SantaWeb.md` (nuova regola)
- `HANDOVER_Santamonica_Web_v2026.09.26.02.md`
- `CHANGELOG_Santamonica_Web_v2026.09.26.02.md` (questo)

**Sintesi:**
- **Idea scartata**: collegare in Tracciabilità una spesa "semplice" già registrata (lookup su Spese). Abbandonata perché una spesa semplice copre di solito un'intera fattura, mentre ogni riga di fattura deve avere il suo codice NN-MMAA.
- **Batch 1 (v.26.01)**: in Spese, aggiungendo una spesa sul reparto "Pesce e crostacei" compare un avviso di conferma (nessun codice di tracciabilità, si consiglia Tracciabilità → Nuovo carico). Esteso a "Ostriche"? No, per decisione di Andrea.
- **Batch 2 (v.26.02 + edge v11)**: link "modifica" nello storico di Tracciabilità, con form in linea su tutti i campi tranne il codice NN-MMAA (fisso). La data di ricezione resta vincolata al mese/anno del codice. La spesa collegata viene riallineata (data, reparto, importo = peso × prezzo, note), con compensazione se l'update della tracciabilità fallisce.
- **Sorgente edge function**: ricostruito integralmente dal deploy per aggiungere l'azione, poi salvato nel repo su richiesta di Andrea.

**Loop di revisione (GATE PRODUZIONE):** P1+P2 eseguiti da Claude (sintassi JS/TS, test headless Playwright con backend stub). Batch 1 è un micro-fix UI, quindi P3 non dovuta. **Batch 2 + edge function v11: P3 saltata per decisione esplicita dell'utente, registrata come DEBITO** (si somma al debito cumulato del modulo Food Cost/Tracciabilità). Chiamata reale all'edge function non eseguibile dall'ambiente cloud (proxy): **prova end-to-end a carico di Andrea**. Rischio residuo: la ricostruzione integrale del sorgente (vedi HANDOVER).

**Handover dettagliato:** `HANDOVER_Santamonica_Web_v2026.09.26.02.md`

---

### 2026-09-25 — Tracciabilità: campo Fornitore diventa lookup + merge con sessione Cowork parallela (Setup, numerazione)

**Versioni rilasciate:**
- `menu-admin.html` v 2026.09.25.02 (Vercel)
- `HANDOVER_Santamonica_Web_v2026.09.25.01.md`
- `CHANGELOG_Santamonica_Web_v2026.09.25.01.md` (questo)

**Sintesi:**
Sessione breve, in continuazione della chiusura v2026.09.21.02. Un'unica richiesta di Andrea: *"il campo fornitori deve fare lookup nella tabella fornitori della cantina"*. Il campo Fornitore nel form "Nuovo carico" di Tracciabilità era un `<input>` testo libero con suggerimenti via `<datalist>` (popolata da `cantina-anagrafiche`) — un fornitore poteva comunque essere digitato a mano, anche se non esistente in anagrafica. Convertito in un `<select>` che obbliga a scegliere un fornitore già presente nell'anagrafica Cantina. Il valore resta salvato come testo libero in `fc_tracciabilita_prodotti.fornitore_nome` (nessuna FK cross-database tra i due progetti Supabase, decisione già presa in v2026.09.16.01).

**Conflitto di merge con sessione Cowork parallela**: durante il push è stato rilevato che nel frattempo una sessione Cowork aveva lavorato sulla stessa area di Tracciabilità, con una decisione opposta sul campo Fornitore — lasciarlo "solo suggerito per nome" e spostare la gestione vera dell'anagrafica su un pulsante "Apri anagrafica fornitori" che apre `cantina.html` in una nuova scheda (deep-link `?tab=anagrafiche&ent=fornitori`). Quella sessione ha anche rinominato il tab "Reparti" in "Setup" e aggiunto un nuovo campo "Numerazione tracciabilità" (mese/anno/numero di partenza, per far ripartire il codice `NN-MMAA` da un valore diverso da 1 quando serve non sovrapporsi a codici già assegnati a mano) — backend: edge function `foodcost-admin` → **v10** (nuova tabella `fc_tracciabilita_config`, azioni `tracciabilita_config_get/_set`), non toccata da questa sessione. Risolto il conflitto con un **merge** (non rebase): entrambe le modifiche convivono, con una nota nel commento header che spiega la divergenza di design (la richiesta esplicita di Andrea di oggi, arrivata dopo, prevale sul comportamento "solo suggerito" scelto in precedenza) — il pulsante "Apri anagrafica fornitori" resta comunque utile per aggiungere un fornitore mancante prima di trovarlo nel menu a tendina.

**Loop di revisione (GATE PRODUZIONE):** P1 (formale: sintassi JS verificata dopo la modifica e dopo il merge, nessun marker di conflitto residuo, riferimento al vecchio `fc-tracc-fornitori-list` rimosso ovunque). P2 (sostanziale) leggero: cambio isolato a un elemento di form, nessuna nuova logica di calcolo. **Revisione Oppositiva (3ª passata)**: non eseguita — si somma al debito già dichiarato per l'intero modulo Food Cost/Tracciabilità (vedi voce precedente, 5 batch 2026-09-16→21). Nessun test in browser in questa sessione.

**Handover dettagliato:** `HANDOVER_Santamonica_Web_v2026.09.25.01.md`

---

### 2026-09-16 → 2026-09-21 (sessione unica, chiusura consolidata) — Food Cost: modulo Tracciabilità + import Incassi da Excel + rifiniture · 5 batch (.01→.05) · debito Revisione Oppositiva dichiarato

**Versioni rilasciate (stessa sessione/conversazione, mai chiusa fino a oggi — vedi nota metodologica sotto):**
- `menu-admin.html` v 2026.09.16.01 → v 2026.09.21.01 (Vercel), 7 bump in sessione
- Edge function `foodcost-admin` (Supabase SafeTable) v7 → v9, deploy diretti in sessione
- Migrazioni Supabase dirette (SafeTable: `fc_categorie_tracciabilita`, `fc_tracciabilita_prodotti`; SantaCantina: colonna `settore` su `fornitori`)
- `docs/LESSONS_SantaWeb.md` (NUOVO)
- `HANDOVER_Santamonica_Web_v2026.09.21.02.md` (consolidato, sostituisce i due handover intermedi `..._v2026.09.16.01.md` e `..._v2026.09.18.02.md` — vedi nota metodologica)
- `CHANGELOG_Santamonica_Web_v2026.09.21.02.md` (questo)

**Sintesi:**

- **Batch 1 (v.16.01) — Modulo Tracciabilità**: al carico di una fornitura (pesce/crostacei) un unico inserimento popola sia Spese sia uno storico di tracciabilità dedicato, con codice univoco `NN-MMAA` generato lato server e data di scadenza calcolata per categoria (default "Pesce abbattuto" = 30gg). Fornitore come testo libero, letto in sola lettura dall'anagrafica Cantina (`cantina-anagrafiche`, progetto Supabase separato — nessuna FK cross-database). Aggiunto anche il campo `settore` a `fornitori` (SantaCantina) su richiesta emersa a metà lavoro.
- **Correzioni di processo in batch 1**: la Revisione Oppositiva era stata inizialmente dichiarata "non eseguita" senza prima tentarla — corretto rileggendo la skill: tentativo di pool multi-IA (nessuna chiave API/script disponibile nell'ambiente), proposta modalità manuale, **skip approvato esplicitamente dall'utente** (non omissione). Modifiche pushate su un branch feature dell'harness invece che su `main` — corretto: merge fast-forward su `main`, creato `docs/LESSONS_SantaWeb.md` con la regola "menu-admin si modifica direttamente su main". Versione bumpata solo nel commento header, non nel footer visibile in UI — corretto, aggiunta lezione "versione in due punti (header + footer)".
- **Batch 2 (v.16.02/.03) — Rifiniture Tracciabilità**: tolto il campo Categoria dalla riga prodotto (scadenza sempre auto-calcolata dalla prima categoria attiva, editabile), reparto del carico preselezionato su "Pesce e crostacei", rimossa anche la sezione UI "Categorie e giorni di scadenza" (regola resta in DB, gestione ora solo via query diretta).
- **Batch 3 (v.18.02) — Import Incassi da Excel**: nuovo pannello "📥 Importa da Excel" nel tab Incassi. Andrea aggiorna giorno per giorno un foglio "Budget" (una scheda per mese, lo stesso da cui derivava il vecchio "LibroCassa") con colonne FOOD/BEVERG (disponibili da ottobre 2026, IVA inclusa — prima erano FT/POS, non un vero split). Si sceglie la scheda mese, si scorpora l'IVA al 10%, anteprima prima di salvare in blocco (`incassi_bulk_upsert`, edge function v9). Schede pre-ottobre 2026 segnalate come non importabili. Parsing xlsx client-side (SheetJS via CDN cdnjs, lazy-load, coerente con jsPDF/html2canvas/Chart.js già caricate così in questo file). **Conflitto di merge**: push concorrente da una sessione Cowork parallela (PR #4, Rubrica professionisti) con collisione sullo stesso numero di versione `v 2026.09.18.01` per coincidenza — risolto con merge, non rebase; nessuna perdita di codice da nessuna delle due parti.
- **Batch 4 (v.18.03) — Coerenza IVA**: Andrea ha notato che l'inserimento manuale di Incassi non scorporava l'IVA come faceva già l'import. Estratta costante condivisa `FC_ALIQUOTA_IVA` (10%) e funzione `_fcScorporaIva()`, usate ora da entrambi i percorsi. Nessun dato storico da correggere (Andrea non aveva ancora inserito nulla).
- **Chiarimento senza codice**: verificato che un giorno con incasso zero non genera una riga nell'import ma non falsa comunque il calcolo del Food Cost (`calcolaRange` somma sul range senza dividere per giorni — riga assente = riga a 0, stesso risultato).
- **Batch 5 (v.21.01) — Inventario, totale cliccabile**: sotto la data di conteggio compare ora "Totale: € X" (live, `oninput`), che avvolge in un `<details>` collassato di default la tabella per reparto — un click la apre.
- **Richiesta "aggiorna gantt"**: nessun file gantt trovato in questo repo; chiesto all'utente in quale repository si trovasse, nessuna preferenza indicata, tentativo di collegare il repo `santamonicagit` rifiutato dall'utente — richiesta abbandonata, nessuna azione presa.
- **Altri 2 pull di allineamento** da sessioni Cowork parallele durante la sessione (banner chiusura vacanze + bump minori su `menu.html`/`menu-it.html`/`menu-vini.html`), nessun conflitto con `menu-admin.html` questa volta.

**Nota metodologica — correzione dell'utente**: durante questa sessione erano stati prodotti **due HANDOVER intermedi** (`..._v2026.09.16.01.md` dopo il batch 1-2, `..._v2026.09.18.02.md` dopo il batch 3) come se la sessione si fosse chiusa in quei punti, mentre si trattava sempre della stessa conversazione mai interrotta. L'utente ha corretto: *"quando chiudi la sessione devi considerare tutto dall'inizio della chat"*. Corretto qui: i due HANDOVER intermedi sono stati rimossi dalla KB (storico comunque in Git) e sostituiti da un unico HANDOVER consolidato che copre l'intera sessione dall'inizio, seguendo lo stesso principio già in uso per le sessioni con più batch di release (vedi voce 2026-05-19 sotto, "Sessione lunga: 3 release deploy coordinate... Documenti di continuità adottano NN più alto della giornata"). **Lezione registrata in LESSONS_SantaWeb.md**: produrre HANDOVER/CHANGELOG solo alla chiusura reale della sessione (esplicita o evidente), mai a metà di una conversazione ininterrotta — e quando si chiude, coprire tutto dall'inizio della chat, non solo il delta dall'ultimo checkpoint documentale.

**Loop di revisione (GATE PRODUZIONE):** P1+P2 applicati a ogni batch (dettaglio nei commit e nell'handover). **Revisione Oppositiva (3ª passata): mai eseguita in nessuno dei 5 batch — debito cumulato su tutta la sessione**, da chiudere prima di considerare il modulo Food Cost/Tracciabilità definitivo. Nessun test in browser in sessione (ambiente senza interfaccia grafica) — Andrea ha verificato visivamente solo l'Inventario (screenshot in chat).

**Nota di disallineamento CHANGELOG (ancora aperta)**: prima del batch 1 la linea di questo CHANGELOG risaliva alla sessione del 2026-05-19. Tra quella sessione e il batch 1 qui sopra, `menu-admin.html` era già stato aggiornato più volte fino a v 2026.09.13.11 (modulo Food Cost/Dashboard/Inventario/Reparti, evidente dall'header del file) senza che le relative sessioni risultino in questo documento — gap di continuità documentale non ricostruito (per non fabbricare cronologia non verificata), da colmare in una sessione dedicata.

**Handover dettagliato:** `HANDOVER_Santamonica_Web_v2026.09.21.02.md`

---

### 2026-09-18 — Colonna "Richieste particolari" nello storico prenotazioni (scheda cliente, Gestionale)

**Versioni rilasciate:**
- `clienti.html` v 2026.09.18.01 (Vercel) — nuova colonna nello storico prenotazioni della scheda cliente
- `HANDOVER_Santamonica_Web_v2026.09.18.01.md`
- `CHANGELOG_Santamonica_Web_v2026.09.18.01.md` (questo)

**Sintesi:**
Su richiesta di Andrea: il contenuto del campo "Richieste particolari" (form di prenotazione pubblico, colonna `reservations.note`) ora è visibile direttamente nello storico prenotazioni della scheda cliente (`clienti.html`, apribile da `gestionale.html` col pulsante "👤 Anagrafica"), senza dover aprire ogni prenotazione singolarmente in modifica. Nessuna modifica di backend: l'edge function `clienti-crm` (azione `detail`) selezionava già la colonna `note` per ogni riga di `reservations` restituita in `storia` — mancava solo la colonna in tabella lato client. Aggiunta colonna "Richieste particolari" nell'header e nella riga generata via JS, aggiornato il `colspan` del placeholder di caricamento.

**Loop di revisione (GATE PRODUZIONE):** non applicato — micro-fix di sola visualizzazione (nessun dato nuovo scritto, nessun output pubblico), rientra nell'eccezione "bozze interne/micro-fix non pubblicati" solo in parte: il file è di produzione (deploy Vercel), ma è una modifica a riga singola, puramente additiva e di sola lettura su un campo già esistente in DB. Applicato solo controllo diretto del diff (no bug introdotti: nessuna logica toccata, solo markup + un binding dati già presente nel payload).

**Handover dettagliato:** `HANDOVER_Santamonica_Web_v2026.09.18.01.md`

---

### 2026-05-19 (sera tardi) — F0.9 CHIUSO 100% definitivo · F0.10 + F0.11 chiusi 100% tecnico · 6 file deploy in 3 batch (.02/.03/.04) · dec. #22-#25 · memoria operativa #5 nuova

**Versioni rilasciate:**
- `cookieconsent-config.js` v 2026.05.19.02 (target=_blank 15 link policy + hideFromBots: true + autoShow !isPolicyPage)
- `privacy.html` v 2026.05.19.02 (bottone .cc-manage §12 + CSS coerente con cookies.html — P3.23 nuovo bloccante risolto)
- `cookies.html` v 2026.05.19.02 (bump coordinato — no modifiche funzionali)
- `regala.html` v 2026.05.19.03 (NUOVO · 3 tagli voucher 100/150/200€ · validità 6 mesi · form Formspree con T5 opt-in)
- `index.html` v 2026.05.19.04 (refactor Schema.org JSON-LD da Restaurant a ItalianRestaurant + @id + dati TARGET + #info aggiornamenti)
- `dove-siamo.html` v 2026.05.19.04 (NUOVO · mobile-first · Schema.org ItalianRestaurant duplicato · OSM iframe transitorio fino a F0.12 · click-to-action + highlight giorno corrente)
- `HANDOVER_Santamonica_Web_v2026.05.19.04.md`
- `CHANGELOG_Santamonica_Web_v2026.05.19.04.md`
- `ROADMAP_Santamonica_Web_v2026.05.19.04.md` (bump v.13 → v.14)

**File deploy modificati/creati:** 6 (1 JS config + 5 HTML — di cui 2 NUOVI)

**Sintesi:**
- **Sessione lunga**: 3 release deploy coordinate in stessa giornata (batch .02 → .03 → .04). Documenti di continuità adottano NN più alto della giornata (.04) come release coordinata complessiva (eccezione operativa accettata, vedi convenzione ROADMAP §12).

- **Batch 1/3 · v 2026.05.19.02 (F0.9-post chiusura)**: Verifica funzionale F0.9 utente eseguita con metodo strutturato (Blocco 1 404+console · Blocco 2 funzionale banner · Blocco 3 lingue IT/EN/FR · Blocco 4 versioning UI). Esito OK su CF Pages staging incognito. Scoperti 2 difetti residui durante verifica:
  - **Bug fix UX (P3 emergente)**: 15 link policy nelle traduzioni IT/EN/FR del cookieconsent-config (5 link × 3 lingue) non avevano `target="_blank" rel="noopener noreferrer"`. Click dal banner spostava l'utente dal modale. Coerenza convenzione index.html già adottata da v 2026.05.17.08. Corretti tutti 15.
  - **P3.23 nuovo bloccante**: dopo applicazione P3.8 opzione b (autoShow: false su /privacy.html), privacy.html non aveva alcun trigger visibile per gestire preferenze cookie (cookies.html lo aveva già da v 2026.05.17.02 §3). Aggiunto bottone `.cc-manage` in §12 con CSS coerente.
  - Applicate anche P3.5 (hideFromBots: true esplicito) e P3.8 (opzione b confermata utente) dal backlog F0.9-post.
  - cookies.html bump coordinato (no modifiche funzionali) per convenzione "stesso NN per release di sessione".

- **Batch 2/3 · v 2026.05.19.03 (F0.10)**: Prima emissione `regala.html` informativa voucher. Elicitazione utente 10 punti A/B/C/D → confermati: tagli 100/150/200€ · validità 6 mesi · CTA form Formspree (6 campi + honeypot + _subject hidden) · T5 checkbox opt-in marketing NON pre-spuntato · solo IT · palette legal pages · link a /voucher-termini.html con 404 temporaneo accettato fino a F0.14 · banner cookie auto-show abilitato. Endpoint Formspree placeholder `REPLACE_ME_VOUCHER` con TODO commentato. Testi descrittivi placeholder `[TESTO DA COMPLETARE]` (4 occorrenze: intro + 3 card desc). Schema.org Product/Offer rinviato a F0.13.

- **Batch 3/3 · v 2026.05.19.04 (F0.11)**: Schema.org Restaurant + pagina Dove siamo. Elicitazione utente 11 punti M/N/D → confermati: indirizzo · telefono · email info@ (precisazione utente: GIÀ ATTIVA) · orari TARGET in vigore da giugno 2026 · tipo ItalianRestaurant · prezzi €€€ · Place ID `ChIJGzMzZqlD0xIRKRomfkk1F2c` · social IG/FB · pagina dedicata mobile-first + sezione index #info aggiornata · iframe OSM transitorio. Coordinate GPS estratte da Google Maps URL via web search: `44.3913353, 8.9646575`. Scoperta in upload: index.html aveva già blocco Schema.org più antico (@type: Restaurant, email Gmail, orari "vecchi" Wix-style). Refactor completo: @type → ItalianRestaurant, @id per linking semantico con dove-siamo.html, dati TARGET, mantenendo i campi ricchi pre-esistenti (employee Chef Nicolò Lazzaroni + Sommelier Monica Capurro, award Michelin Good Cooking, currenciesAccepted, paymentAccepted, menu). dove-siamo.html: 505 righe mobile-first con default mobile + breakpoint min-width: 640px desktop · click-to-action contatti (tel/mailto/maps/geo:) · JS evidenzia giorno corrente nella tabella orari · OSM iframe lazy-load · 2 bottoni Google Maps + OpenStreetMap · 3 sotto-sezioni "Come arrivare".

- **3 discrepanze info rilevate** tra live Wix (orari/email/IG handle "vecchi"), info dichiarate utente in chat (TARGET), e info nel repo SantaWeb pre-modifica. L'utente ha esplicitato che il sito in costruzione (CF Pages staging) NON è quello live (Wix) e che le discrepanze sono attese durante staging. **Convenzione nuova consolidata (dec. #25)**: inserire dati TARGET pre-go-live (orari da giugno 2026 · email info@). FINAL CHECK obbligatorio pre-F0.21 su tutte le info: orari, email, telefono, indirizzo, voucher, prezzi. **Memoria persistente Claude #5 salvata**.

- **Test V5 Rich Results Test "URL mode"**: errore atteso `noindex,nofollow` (X-Robots-Tag in `_headers` blocca crawl Googlebot per design F0.3). Test alternativo "Codice mode" eseguibile ora; test "URL mode" rinviato a F0.21 post-rimozione noindex.

- **Errore di str_replace recuperato in sessione**: durante modifica index.html (aggiunta link "Dettagli completi"), un str_replace ha rimosso accidentalmente l'apertura della section `#newsletter`. Errore rilevato immediatamente con `view`, ripristinato con secondo str_replace. Nessun impatto su output finale. Lesson learned: validare struttura sezioni con `grep "^<section"` dopo modifiche multi-sezione.

- **Nessuna nuova "sessione fantasma"** (pattern KB↔deploy disallineamento) in questa sessione.

- **4 decisioni operative nuove (cumulative #22-#25)**:
  - **#22**: F0.9-post chiusura · pacchetto release coordinato v.02 — target=_blank 15 link policy + hideFromBots + autoShow conditional + bottone .cc-manage in privacy.html (P3.23 risolto)
  - **#23**: F0.10 specs — tagli 100/150/200€ · validità 6 mesi · CTA Formspree · T5 opt-in marketing · IT only · palette legal pages · link a voucher-termini accettato 404 temp · banner auto-show abilitato
  - **#24**: F0.11 architettura — Schema.org @type ItalianRestaurant con @id linking semantico tra index e dove-siamo · range €€€ · coordinate 44.3913353/8.9646575 · iframe OSM transitorio · pagina dedicata mobile-first + sezione index aggiornata · servesCuisine ["Italian","Seafood","Ligurian"] · campi ricchi pre-esistenti mantenuti
  - **#25**: Convenzione TARGET vs operative durante staging + FINAL CHECK pre-F0.21 obbligatorio (orari, email, telefono, indirizzo, voucher, prezzi)

- **Loop 3 passate F0.9 totali consolidati**: 45 punti rilevati (P1=12, P2=10, P3=20+3 emergenti) · 20 applicati in 2 sessioni · 25 archiviati o promossi a backlog distribuito (F0.12, F0.15, F0.18, F0.21, backlog interpretativo).

- **F0.9 + F0.10 + F0.11 tutti chiusi**. TODO operativi non bloccanti (memoria #5):
  - Endpoint Formspree reale per voucher (F0.10 operativo)
  - Testi descrittivi placeholder regala.html (F0.10 operativo)
  - Logo URL + foto hero JPG (F1.5 / sessione asset)
  - Chiave `info_dettagli_link` in translations.json IT/EN/FR (check pre-F0.21)
  - Allineamento orari + email visibili sezione #info index.html ai TARGET (check pre-F0.21)

**Stato upload utente:** ✅ tutti i 6 file uploadati e verificati V1-V4 OK. F0.9 + F0.10 + F0.11 chiusi al 100% tecnico.

**Handover dettagliato:** `HANDOVER_Santamonica_Web_v2026.05.19.04.md`

---

### 2026-05-19 (mattina) — F0.9 chiusura al 100% pendente verifica · Passata 2 + Passata 3 loop · 4 file deploy · dec. #18-#21 · convenzione consegna file interi

**Versioni rilasciate:**
- `cookieconsent-config.js` v 2026.05.19.01 (P2#8 mode opt-in + P2#4 regex strict + P2#1 rewording IT/EN/FR)
- `index.html` v 2026.05.19.01 (P3.21 fix path duplicati 404)
- `privacy.html` v 2026.05.19.01 (P3.21 + P3.22c disclaimer §12 + fix UI legal-meta)
- `cookies.html` v 2026.05.19.01 (P3.21 + P3.22c disclaimer §4 + fix UI legal-meta)
- `HANDOVER_Santamonica_Web_v2026.05.19.01.md`
- `CHANGELOG_Santamonica_Web_v2026.05.19.01.md`
- `ROADMAP_Santamonica_Web_v2026.05.19.01.md` (bump v.12 → v.13)

**Sintesi:**
- Passata 2 (sostanziale GDPR/cookie law) completata: 3 correzioni applicate (regex strict, rewording, mode opt-in esplicito), 1 declassamento a F0.21 (#6 → dec. #19), 6 archiviati.
- Passata 3 (autocritica + adversarial) completata: 20 punti rilevati + 2 difetti gravi nuovi emersi durante ispezione (P3.21 path duplicati 404, P3.22 disclaimer Stripe+Maps). 3 correzioni applicate in sessione + fix UI bonus discrepanza legal-meta.
- 5ª discrepanza KB↔deploy risolta. 14 punti P3 promossi a backlog ROADMAP.
- Dec. #18-#21 nuove + convenzione consegna file interi memorizzata.

**Handover dettagliato:** `HANDOVER_Santamonica_Web_v2026.05.19.01.md`

---

### 2026-05-17 (tarda sera) — F0.9 al 90% · banner vanilla-cookieconsent v3.1.0 bundle locale · dec. #17 · 4ª discrepanza KB↔deploy

**Versioni rilasciate:**
- `index.html` v 2026.05.17.08, `privacy.html` v 2026.05.17.02, `cookies.html` v 2026.05.17.02
- `cookieconsent-config.js` v 2026.05.17.01 (NUOVO)
- `lib/cookieconsent/cookieconsent.umd.js` + `cookieconsent.css` v3.1.0 upstream (NUOVI)
- `HANDOVER_Santamonica_Web_v2026.05.17.06.md`, `CHANGELOG_Santamonica_Web_v2026.05.17.06.md`, `ROADMAP_Santamonica_Web_v2026.05.17.06.md` (bump v.12)

**Sintesi:**
- F0.9 al 90%: vanilla-cookieconsent v3.1.0 bundle locale, 2 categorie, 3 lingue, parità accept/reject.
- Decisione #17: admin-templates-shared.js SKIP da F0.9.
- 4ª discrepanza KB ↔ deploy risolta. Loop P1 ✅ · P2/P3 ⏳ rimandati a sessione successiva.

**Handover dettagliato:** `HANDOVER_Santamonica_Web_v2026.05.17.06.md`

---

### 2026-05-17 (notte +2) — F0.3 chiusa al 100% (DNS via Wix) · F0.6bis chiusa · dec. #16 NUOVA

**Versioni rilasciate:** `admin-core.js` v 2026.05.17.04, `menu-admin.html` v 2026.05.17.03, HANDOVER+CHANGELOG+ROADMAP v.11

**Sintesi:** F0.3 chiusa 100% (DNS authoritative = Wix scoperto), F0.6bis chiusa (8 occorrenze fetch admin migrate), dec. #12 #16.

**Handover dettagliato:** `HANDOVER_Santamonica_Web_v2026.05.17.05.md`

---

### 2026-05-17 (notte +1) — Cleanup repo: rimossi 2 file legacy + audit post-push

**Versioni rilasciate:** HANDOVER+CHANGELOG+ROADMAP v.10

**Sintesi:** Cleanup admin-templates.js legacy + admin-core-FIXED.js residuo. Dec. #15: file con suffisso -FIXED/-OLD/-BACKUP/-COPY vietati in repo.

**Handover dettagliato:** `HANDOVER_Santamonica_Web_v2026.05.17.04.md`

---

### 2026-05-17 (notte) — F0.4 chiuso (taglio DE/ES) · F0.6 chiuso · F0.3 ancora 80%

**Versioni rilasciate:** `translations.json` v 2026.05.17.01, `admin-core.js` v 2026.05.17.03, `index.html` v 2026.05.17.02, `menu-admin.html` v 2026.05.17.02, `_redirects` v 2026.05.17.01 (NUOVO)

**Sintesi:** F0.4 chiuso (loop 3 passate · 5 file · -40% size translations.json), F0.6 chiuso, dec. #13 #14 nuove.

**Handover dettagliato:** `HANDOVER_Santamonica_Web_v2026.05.17.03.md`

---

### 2026-05-17 (sera) — F0.3 80% + F0.7 chiusa · hotfix stampa orario

**Versioni rilasciate:** `_headers` v 2026.05.17.01 (NUOVO), `admin-templates-shared.js` v 2026.05.17.02

**Sintesi:** F0.3 al 80% (DNS propagation pending), F0.7 chiusa (fine-grained PAT), hotfix stampa orario, 1ª discrepanza KB rilevata, 3 dec. operative consolidate.

**Handover dettagliato:** `HANDOVER_Santamonica_Web_v2026.05.17.02.md`

---

### 2026-05-17 (mattina) — F0.0 + F0.1 + F0.2 chiuse · Cloudflare Pages live · F0.8 sospesa

**Versioni rilasciate:** `functions/api/translate.js` v 2026.05.17.02 (NUOVO), `.gitignore` aggiornato

**Sintesi:** F0.0 parziale, F0.1 (Cloudflare account + Pages), F0.2 (porting translate.js), F0.8 sospesa.

**Handover dettagliato:** `HANDOVER_Santamonica_Web_v2026.05.17.01.md`

---

### 2026-05-16 — F0.7bis chiusa · stesura privacy.html + cookies.html IT (DIY)

**Versioni rilasciate:** `privacy.html` v 2026.05.16.02, `cookies.html` v 2026.05.16.02

**Sintesi:** Stesura DIY privacy IT (14 sezioni) + cookie IT (7 sezioni). Metodologia "3 passate critiche" applicata · 21 correzioni totali.

**Handover dettagliato:** `HANDOVER_Santamonica_Web_v2026.05.16.01.md`

---

### 2026-05-15 (sera) — bozze privacy v3 + ROADMAP v.06 + dati titolare

**Versioni rilasciate:** `ROADMAP_Santamonica_Web_v2026.05.15.06.md` (superseded)

**Sintesi:** Schema bozza privacy v3, ROADMAP v.06 (switch hosting, gift cards Stripe Payment Links, Iubenda Pro→Advanced→DIY), costi 12 mesi consolidati.

**Handover dettagliato:** `HANDOVER_Santamonica_Web_v2026.05.15.06.md`

---

### 2026-05-15 (pomeriggio) — feature "Documento generico" admin

**Versioni rilasciate:** `menu-admin.html` v 2026.05.15.01, `admin-core.js` v 2026.05.15.04 (NON pushate)

**Sintesi:** Nuova feature admin caricamento PDF/DOCX/TXT, 9 funzioni JS, lazy load PDF.js + Mammoth.

**Handover dettagliato:** `HANDOVER_Santamonica_Web_v2026.05.15.02.md`

---

### 2026-05-15 (mattina) — pianificazione strategica + revisione metodo continuità

**Versioni rilasciate:** ROADMAP + METODO continuità (regola versioning v2)

**Sintesi:** Pianificazione strategica completa · 40 decisioni. Regola versioning v2: estesa a documenti continuità con naming file.

**Handover dettagliato:** `HANDOVER_Santamonica_Web_v2026.05.15.01.md`

---

### 2026-05-14 — Proxy DeepL Vercel + fix link menu + inversione menu.html/menu-it.html

**Versioni rilasciate:** `api/translate.js` v 2026.05.14.01 (NUOVO) + 4 altri

**Sintesi:** Proxy Vercel Serverless Function per DeepL, fix link menu lingua, inversione menu.html/menu-it.html.

**Handover dettagliato:** `HANDOVER_Santamonica_Web_v2026.05.14.01.md`

---

### 2026-05-13 — Font +50% in stampa preview menù

**Versioni rilasciate:** `admin-templates-shared.js` v 2026.05.13.01

**Sintesi:** html { font-size: 24px; } nel @media print, poi ridotto a 20px e gestito con override #layout-orario.

**Handover dettagliato:** `HANDOVER_Santamonica_Web_v2026.05.13.01.md`

---

## STATO PROGETTO CONSOLIDATO (post 2026-09-25)

### File deploy correnti

| File | Versione | Hosting |
|---|---|---|
| **`menu-admin.html`** | **v 2026.09.25.02** ⭐ | Vercel |
| `cantina.html` | bump, sessione Cowork parallela (deep-link anagrafiche fornitori, non dettagliato qui) | Vercel |
| `gantt.html`, `gantt-data.js` | NUOVI, aggiunti dall'utente direttamente nel repo (non da una sessione Claude) | Vercel |
| `clienti.html` | v 2026.09.18.01 (sessione Cowork parallela) | Vercel |
| `menu.html`, `menu-it.html`, `menu-vini.html` | bump minori, sessione Cowork parallela (non dettagliati qui) | GH Pages + CF Pages |
| `img/sito/vacanzina-chiusura-2026-09.jpg` | NUOVO, sessione Cowork parallela | GH Pages + CF Pages |
| `index.html` | v 2026.05.19.04 | GH Pages + CF Pages |
| `dove-siamo.html` | v 2026.05.19.04 | GH Pages + CF Pages |
| `regala.html` | v 2026.05.19.03 | GH Pages + CF Pages |
| `privacy.html` | v 2026.05.19.02 | GH Pages + CF Pages |
| `cookies.html` | v 2026.05.19.02 | GH Pages + CF Pages |
| `cookieconsent-config.js` | v 2026.05.19.02 | GH Pages + CF Pages |
| `lib/cookieconsent/cookieconsent.umd.js` | v3.1.0 upstream | GH Pages + CF Pages |
| `lib/cookieconsent/cookieconsent.css` | v3.1.0 upstream | GH Pages + CF Pages |
| `translations.json` | v 2026.05.17.02 (chiave `info_dettagli_link` mancante — check pre-F0.21) | GH Pages |
| `admin-core.js` | v 2026.05.17.04 (da verificare: possibili bump non tracciati — vedi nota disallineamento sopra) | Vercel |
| `admin-templates-shared.js` | v 2026.05.17.02 | Vercel |
| `foto-optimizer.js` | v 2026.05.09.02 | Vercel |
| `api/translate.js` (legacy) | v 2026.05.14.01 | Vercel |
| `functions/api/translate.js` | v 2026.05.17.02 | Cloudflare Pages |
| `_headers` | v 2026.05.17.01 | Cloudflare Pages |
| `_redirects` | v 2026.05.17.01 | Cloudflare Pages |

⭐ = rilasciato/aggiornato in questa sessione

**Nota**: le versioni non marcate ⭐ sono quelle risultanti dall'ultimo CHANGELOG tracciato (05-19); per `menu-admin.html` e possibilmente altri file collegati al modulo Food Cost, l'header del file in repo indica versioni più recenti (fino a v 2026.09.13.11) non documentate in questa linea — vedi nota di disallineamento nella voce di sessione odierna.

### Backend Supabase (nuovo in questa sessione — non tracciato prima in questo CHANGELOG)

| Progetto | Ref | Uso |
|---|---|---|
| SafeTable | `xbksultfskvzgncncada` | Food Cost (tabelle `fc_*`), edge function `foodcost-admin` (v10, deploy da sessione Cowork parallela — non verificato in dettaglio da questa sessione) |
| SantaCantina | `wpsghmmvlwkyqiholfzx` | Anagrafica Cantina/vini (tabelle lookup incl. `fornitori`), edge functions `cantina-*` |

### Sistema auth/credenziali

| Servizio | Stato | Env var/storage |
|---|---|---|
| GitHub PAT fine-grained | ✅ attivo (scope Contents R/W solo SantaWeb, scadenza 2027-05-17) | `localStorage['gh_token']` admin |
| Vercel admin | ✅ attivo | localStorage admin |
| HMAC salt | ✅ generato 2026-05-17 (Bitwarden) · injection F0.15 | `CONSENT_HMAC_SALT` |
| Cloudflare account | ✅ attivo + 2FA TOTP | — |
| DeepL Free | ✅ API key (CF + Vercel) | `DEEPL_KEY` |
| Wix account | ⚠️ pannello DNS authoritative | — |
| Formspree | ✅ account attivo (prenotazioni + voucher F0.10) · endpoint voucher dedicato da configurare | — |
| Email `info@santamonicagenova.it` | ✅ GIÀ ATTIVA (precisazione utente 19-05) · altre @ alias a F0.21 con Email Routing | — |
| Supabase (SafeTable, SantaCantina) | ✅ attivo, gestito via MCP in sessione | — |

### Convenzioni progetto (aggiornate 19-05 sera tardi, integrate 16-09)

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
| Bottone "Gestisci preferenze cookie" (.cc-manage) | Obbligatorio in pagine con autoShow disabilitato. Su altre pagine opzionale |
| Link interni alle policy nei banner cookie | `target=_blank rel=noopener noreferrer` su tutti i 15 link policy traduzioni (dec. #22) |
| Link footer Privacy/Cookies in pagine | `target=_blank rel=noopener noreferrer` (già consolidato) |
| Bundle JS terze parti | Sempre bundle locale in `/lib/<nome>/`, mai CDN |
| Bump `revision` cookieconsent | Solo per modifiche sostanziali policy (dec. #20) |
| Embed di terze parti | Sempre JS+callback `onConsent`, mai iframe hardcoded (dec. #21) — eccezione transitoria OSM iframe in dove-siamo + index #info fino a F0.12 (dec. #24) |
| Consegna file modificati da Claude | Sempre file interi in outputs + present_files (memoria #4) |
| Convenzione TARGET vs operative durante staging | Inserire dati TARGET pre-go-live · FINAL CHECK obbligatorio pre-F0.21 su orari, email, telefono, indirizzo, voucher, prezzi (dec. #25, memoria #5) |
| Lingue | IT/FR/EN (DE/ES ritirate via F0.4) |
| Schema.org Restaurant | `@type: ItalianRestaurant` · `@id: https://santamonicagenova.it/#restaurant` duplicato in index.html + dove-siamo.html per SEO (dec. #24) |
| Pagine mobile-first | dove-siamo.html prima pagina con approccio mobile-first esplicito (default mobile + breakpoint min-width: 640px). Pattern riusabile per future pagine |
| `_meta` in JSON | chiave `_meta` come prima entry |
| URL fetch admin | costante `BASE_FETCH_URL` in `admin-core.js` (pattern esteso: ogni modulo admin ha una costante `<MODULO>_URL` dedicata, es. `FC_URL`, `CANTINA_ANAGRAFICHE_URL`) |
| Stampa carta | html font-size 20px in @media print |
| Stampa orario | scoped override `#layout-orario` (font −22%) |
| Coordinate GPS canoniche progetto | `44.3913353, 8.9646575` (estratte da Google Maps Place ID URL via web search 19-05) |
| Place ID Google canonico | `ChIJGzMzZqlD0xIRKRomfkk1F2c` (dec. #8) |
| Backend moduli admin | Ogni modulo (Food Cost, Cantina) ha edge function Supabase dedicata con azioni multiple via campo `action`, auth via `github_token` (permesso push sul repo) — nessuna migration SQL nel repo, schema vive solo lato Supabase remoto |
| Dati cross-progetto Supabase (es. fornitori Cantina usati in Food Cost) | Nessuna FK reale tra progetti Supabase distinti: si legge in sola lettura l'endpoint pubblico dell'altro modulo e si salva uno snapshot testuale, mai un id con vincolo di integrità cross-database |

### REGOLA OPERATIVA FISSA (versionamento)

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
> **Eccezione operativa accettata sessione 19-05 sera tardi**: se nella stessa sessione si rilasciano più batch separati di file deploy a NN incrementali (.02, .03, .04), i documenti di continuità prodotti a fine sessione adottano l'`NN` più alto della giornata (.04 nel caso 19-05) come release coordinata complessiva, citando esplicitamente i NN intermedi.
>
> **Questa regola va riportata in ogni documento di continuità per propagarla.**

---

**Fine CHANGELOG · v 2026.09.25.01**
