# HANDOVER — Santamonica Web — v 2026.09.21.02

> **Regola versionamento (fissa, da riportare in ogni handover)**: ogni file consegnato ha versione `v YYYY.MM.DD.NN` in header e footer/UI dove applicabile. I documenti di continuità portano la versione anche nel nome del file. La versione va comunicata esplicitamente all'utente alla consegna.

## Nota metodologica — perché questo handover è "v2"

Questa sessione (una sola conversazione ininterrotta, dal primo messaggio a oggi) aveva prodotto **due HANDOVER intermedi** (`..._v2026.09.16.01.md`, `..._v2026.09.18.02.md`) in punti in cui un pezzo di lavoro era stato completato, trattandoli come fossero chiusure di sessione. Non lo erano: la sessione non si era mai interrotta. L'utente ha corretto esplicitamente: *"quando chiudi la sessione devi considerare tutto dall'inizio della chat"*. I due HANDOVER intermedi sono stati **rimossi dalla KB** (restano nello storico Git) e sostituiti da questo, unico, che copre l'intera sessione dall'inizio — stesso principio già in uso nel progetto per le sessioni con più batch di release (vedi CHANGELOG, voce 2026-05-19 sera tardi: "Documenti di continuità adottano NN più alto della giornata come release coordinata complessiva"). Lezione registrata in `docs/LESSONS_SantaWeb.md`.

## Oggetto sessione (intera, dall'inizio)

Modulo **Food Cost** di `menu-admin.html`: nuovo sotto-modulo Tracciabilità, poi rifiniture, poi import Incassi da Excel, poi coerenza IVA, poi Inventario — 5 batch di release nella stessa conversazione, `menu-admin.html` v 2026.09.13.11 → v 2026.09.21.01.

## Batch 1 — Modulo Tracciabilità (v 2026.09.16.01)

Richiesta iniziale di Andrea (con due allegati: foglio Excel di tracciabilità in uso e nota sui 30gg di scadenza pesce abbattuto). Dopo esplorazione del codebase e domande di chiarimento (formato codice, calcolo scadenza, anagrafica fornitori, collocazione UI):

- **Nuove tabelle** su SafeTable: `fc_categorie_tracciabilita` (nome, giorni_scadenza), `fc_tracciabilita_prodotti` (rif_interno univoco `NN-MMAA`, progressivo/mese/anno, prodotto, categoria, peso, prezzo, fattura, lotto, fornitore, **spesa_id → fc_spese_giornaliere ON DELETE CASCADE**, date).
- **Edge function `foodcost-admin` → v8**: nuove azioni `tracciabilita_categorie_*`, `tracciabilita_list`, `tracciabilita_carico_create` (bulk: 1 fattura → N righe, ognuna popola sia Spese sia Tracciabilità, con rollback applicativo se una riga fallisce), `tracciabilita_delete`.
- **Frontend**: nuovo tab "Tracciabilità" — form "Nuovo carico" con repeater di righe prodotto, storico con le colonne del foglio Excel di riferimento.
- **Fornitori**: anagrafica riusata da Cantina (progetto Supabase separato SantaCantina), letta in sola lettura via `cantina-anagrafiche` (endpoint GET pubblico) — nessuna FK cross-database, il fornitore è testo libero. Aggiunto anche il campo `settore` a `fornitori` (richiesta emersa a metà lavoro).

### Correzioni di processo emerse in questo batch

1. **Revisione Oppositiva dichiarata "non eseguita" senza prima tentarla** — corretto rileggendo la skill `project-continuity-method`: tentato il pool multi-IA (nessuna chiave `GEMINI_API_KEY`/`GROQ_API_KEY`/`MISTRAL_API_KEY` né script disponibili nell'ambiente), proposta la modalità manuale, **l'utente ha scelto esplicitamente di saltarla** — skip approvato, non omissione.
2. **Modifiche lasciate su un branch feature** invece che su `main` — Andrea aveva già chiesto in passato che le modifiche a `menu-admin.html` andassero dirette su `main`. Corretto con merge fast-forward su `main`. Creato `docs/LESSONS_SantaWeb.md` con questa regola, più la distinzione Cowork (clone locale, l'utente fa il pull) vs sessione cloud (nessun accesso al filesystem locale, push diretto su GitHub).
3. **Versione bumpata solo nel commento header**, non nel footer visibile in UI — corretto, aggiunta lezione "la versione in `menu-admin.html` vive in due punti: header e footer".

## Batch 2 — Rifiniture Tracciabilità (v 2026.09.16.02 / .03)

Su richiesta di Andrea:
- Tolto il campo Categoria dalla riga prodotto — la scadenza si autocompila sempre dalla prima categoria attiva (default "Pesce abbattuto" = 30gg), ricalcolata al cambio data ricezione, sempre modificabile a mano.
- Reparto del carico preselezionato di default su "Pesce e crostacei" (verificato che esiste già tra i reparti).
- Rimossa anche la sezione UI "Categorie e giorni di scadenza" — la regola resta in DB, per cambiarla ora serve un intervento diretto sul dato.

## Batch 3 — Import Incassi da Excel (v 2026.09.18.02)

Andrea ha allegato `Budget.xlsx` (una scheda per mese dal 2016 a oggi, lo stesso foglio da cui derivava in passato "LibroCassa"): solo dati di incasso giornaliero, nessun dato di spesa. Dopo analisi del file e domande di chiarimento (colonna da usare, IVA inclusa/esclusa, modalità import):

- **Scoperta chiave**: da ottobre 2026 le colonne FT/POS diventano FOOD/BEVERG (split reale food/beverage, prima non lo erano). IVA inclusa nei valori, da scorporare al **10%** (confermato da Andrea) prima di salvare in Food Cost.
- **Frontend**: pannello "📥 Importa da Excel" nel tab Incassi — si carica il file (parsing client-side con **SheetJS**, CDN cdnjs, lazy-load al primo uso, coerente con jsPDF/html2canvas/Chart.js già caricate così in questo file), si sceglie la scheda mese, si vede un'anteprima lordo→netto, si conferma. Le schede pre-ottobre 2026 vengono segnalate come non importabili invece di essere lette in modo scorretto.
- **Backend**: edge function `foodcost-admin` → **v9**, nuova azione `incassi_bulk_upsert` (upsert in blocco su `(data, tipo)`, riusabile anche per re-import — sovrascrive senza duplicare).

### Conflitto di merge con sessione parallela

Durante questo batch una **sessione Cowork parallela** ha pushato su `main` (PR #4, "Rubrica professionisti: sincro NoShowApp" + altri fix). Conflitto di merge in `menu-admin.html`: entrambe le sessioni avevano usato per coincidenza lo stesso timestamp di versione `v 2026.09.18.01` nel commento header. Risolto con **merge** (non rebase, coerente con le regole del progetto): la versione Rubrica resta `v 2026.09.18.01`, questa sessione diventa `v 2026.09.18.02`. Verificato dopo il merge: sintassi JS OK, nessuna funzione orfana, nessun marker di conflitto residuo, nessuna perdita di codice da entrambe le parti.

## Chiarimenti senza modifica di codice

- **"Il file carica solo il giorno del campo Data?"** — No: l'import legge tutti i giorni compilati nella scheda mese scelta, il campo Data serve solo per l'inserimento manuale singolo.
- **"Se lo carico di nuovo dopo?"** — Sicuro: upsert su `(data, tipo)`, i giorni già presenti vengono sovrascritti (stesso valore se il foglio non è cambiato), i nuovi si aggiungono, nessun duplicato.
- **Giorno con incasso zero** — verificato che non genera una riga nell'import (righe con FOOD/BEVERG ≤ 0 scartate per non confondere "non compilato" con "zero vero"), ma questo **non falsa il calcolo del Food Cost**: `calcolaRange` somma `importo` sul range senza dividere per numero di giorni, quindi un giorno senza riga contribuisce 0 esattamente come farebbe una riga esplicita a 0. Effetto solo cosmetico (lista giornaliera mostra "—" invece di "€ 0,00").

## Batch 4 — Coerenza IVA sull'inserimento manuale (v 2026.09.18.03)

Andrea ha notato l'incoerenza: il form "Incasso del giorno" (manuale) salvava gli importi così come digitati, mentre l'import scorporava già il 10%. Corretto:
- Estratta costante condivisa `FC_ALIQUOTA_IVA = 0.10` (prima duplicata come `FC_IMP_ALIQUOTA_IVA` solo nel blocco import), vicino a `FC_URL`.
- Nuova funzione `_fcScorporaIva()`, usata sia dal form manuale sia dall'import.
- Etichette dei campi aggiornate in "(IVA inclusa)".
- Nessun dato storico da correggere: Andrea non aveva ancora inserito nulla in Incassi.

## Richiesta non completata — "aggiorna gantt"

Nessun file gantt trovato in questo repo (solo un riferimento in un commento a `gantt-data.js`, file non presente). Chiesto all'utente in quale repository si trovasse; nessuna preferenza indicata. Tentativo di collegare il repo `santamonicagit` (ipotesi più probabile) **rifiutato dall'utente**. Richiesta abbandonata senza ulteriori azioni — se serve ancora, va ripresa chiarendo prima dove si trova il file.

## Batch 5 — Inventario, totale cliccabile (v 2026.09.21.01)

Andrea ha mostrato uno screenshot del tab Inventario: sotto la data compariva subito la tabella per reparto, chiedeva prima una cifra di sintesi.
- Aggiunto `<summary id="fc-inv-totale">` "Totale: € X", che avvolge (`<details>`) la tabella per reparto — collassata di default, un click la apre.
- Il totale si aggiorna **live** mentre si digita (`oninput` su ogni campo reparto + ricalcolo a ogni render).
- Lo stato aperto/chiuso del `<details>` persiste tra un caricamento e l'altro della data.

## Nota di processo — altri pull da sessioni parallele

Oltre al conflitto del batch 3, altri due `git pull --ff-only` per allinearsi a commit di sessioni Cowork parallele (immagine banner chiusura vacanze + bump minori su `menu.html`/`menu-it.html`/`menu-vini.html`) — questi senza conflitto su `menu-admin.html`.

## Loop di revisione (GATE PRODUZIONE) — intera sessione

- **P1 (formale)**: sintassi JS verificata a ogni batch e dopo ogni pull/merge, riferimenti `onclick`/`onchange`/`oninput` risolti, nessun marker di conflitto residuo.
- **P2 (sostanziale)**: applicato a ogni batch in proporzione alla dimensione del cambio (dettaglio: rollback applicativo su carico Tracciabilità, criterio "non compilato" vs "zero vero" sull'import, mapping mese/anno da nome scheda, refactor costante IVA condivisa).
- **Revisione Oppositiva (3ª passata)**: **mai eseguita in nessuno dei 5 batch — debito cumulato su tutta la sessione**. Tentata solo nel batch 1 (nessuna chiave API/script disponibile, skip approvato esplicitamente dall'utente); nei batch successivi non più ri-proposta esplicitamente. Da chiudere prima di considerare il modulo Food Cost/Tracciabilità definitivo.
- **Test in browser**: nessuno in questa sessione (ambiente senza interfaccia grafica). Andrea ha verificato visivamente solo l'Inventario (screenshot allegato in chat, origine della richiesta del batch 5) — gli altri flussi (Tracciabilità, import Excel, scorporo IVA) restano da verificare dal vivo.

## File consegnati (sessione intera)

- `menu-admin.html` — v 2026.09.21.01 (Vercel), 7 bump di versione in sessione
- Edge function `foodcost-admin` — v7 → v9 (Supabase SafeTable, deploy diretti)
- Migrazioni Supabase dirette (SafeTable: `fc_categorie_tracciabilita`, `fc_tracciabilita_prodotti`; SantaCantina: colonna `settore` su `fornitori`)
- `docs/LESSONS_SantaWeb.md` (NUOVO in questa sessione)
- `docs/CHANGELOG_Santamonica_Web_v2026.09.21.02.md`
- `docs/handovers/HANDOVER_Santamonica_Web_v2026.09.21.02.md` (questo — sostituisce i due handover intermedi rimossi dalla KB)

## Prossimi passi suggeriti

1. Andrea verifica dal vivo: flusso Tracciabilità completo (carico → codice → Spese → cancellazione a cascata), import Excel su un mese reale, scorporo IVA (manuale + import), totale Inventario.
2. **Revisione Oppositiva cumulativa** per l'intero modulo Food Cost/Tracciabilità (debito su 5 batch) — servono `GEMINI_API_KEY`/`GROQ_API_KEY`/`MISTRAL_API_KEY` per il pool automatico, altrimenti modalità manuale.
3. Colmare il gap di continuità documentale tra la sessione 2026-05-19 e l'header di `menu-admin.html` che arrivava già a v 2026.09.13.11 prima di questa sessione — mai ricostruito, resta aperto.
4. Se la richiesta "aggiorna gantt" è ancora valida, chiarire prima in quale repository/file si trova.

---

## PROMPT DI RIPRESA

Per ripartire su questo progetto in una chat nuova, incolla:

> Riprendo il progetto **SantaWeb** (ristorante Santamonica). Carica come contesto:
> - `docs/CHANGELOG_Santamonica_Web_v2026.09.21.02.md` (stato corrente)
> - `docs/handovers/HANDOVER_Santamonica_Web_v2026.09.21.02.md` (dettaglio ultima sessione — consolidato, 5 batch)
> - `docs/LESSONS_SantaWeb.md` (regole anti-errore specifiche del progetto — include: HANDOVER solo a chiusura reale e sempre dall'inizio della sessione)
> - la skill/i reference di `project-continuity-method`
>
> **Dove siamo**: modulo Food Cost di `menu-admin.html` (v 2026.09.21.01) — Tracciabilità, Incassi (manuale + import Excel, IVA 10% scorporata su entrambi), Inventario (totale cliccabile). Lavoro diretto su `main` (vedi `CLAUDE.md` del repo), niente feature branch/PR salvo richiesta esplicita.
>
> **Prossimo passo concreto**: Revisione Oppositiva cumulativa sull'intero modulo Food Cost/Tracciabilità (debito su 5 batch, mai eseguita) — chiavi API pool non ancora disponibili in ambiente, altrimenti modalità manuale. In parallelo, Andrea verifica dal vivo i flussi non ancora testati in browser.
>
> Apri con il prompt di sessione standard del progetto (§C.1 della GUIDA OPERATIVA) e procedi.
