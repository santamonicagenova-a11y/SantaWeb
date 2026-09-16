# HANDOVER — Santamonica Web — v 2026.09.16.01

> **Regola versionamento (fissa, da riportare in ogni handover)**: ogni file consegnato ha versione `v YYYY.MM.DD.NN` in header e footer/UI dove applicabile. I documenti di continuità portano la versione anche nel nome file. La versione va comunicata esplicitamente all'utente alla consegna.

## Oggetto sessione

Nuovo sotto-modulo **Tracciabilità** dentro Food Cost → Utilities (menu-admin.html), su richiesta di Andrea: al carico di una fornitura (soprattutto pesce/crostacei) un unico inserimento — una riga per prodotto di fattura — popola sia la tabella **Spese** del Food Cost sia uno **storico di tracciabilità**, generando per ogni riga un codice univoco `NN-MMAA` (progressivo mensile + mese/anno ricezione), secondo la stessa logica della procedura cartacea in uso (allegati forniti da Andrea: foglio "TRACCIABILITA' PRODOTTI ABBATTUTI" e nota sui 30gg di scadenza per il pesce abbattuto "Il Giuliano").

## Decisioni prese (con l'utente, via domande di chiarimento)

| Decisione | Scelta |
|---|---|
| Formato codice | `NN-MMAA` (progressivo mensile che riparte da 01 + mese/anno ricezione a 2 cifre) |
| Calcolo scadenza | Automatico per categoria (es. "Pesce abbattuto" = 30gg), configurabile e sempre modificabile a mano |
| Anagrafica fornitori | Riuso di quella di Cantina (progetto Supabase separato SantaCantina) |
| Collocazione UI | Nuova sotto-scheda "Tracciabilità" dentro Food Cost, accanto a Spese |
| Cross-DB fornitori (vincolo tecnico emerso in corso d'opera: Food Cost e Cantina sono due progetti Supabase distinti, niente FK reale) | Snapshot testuale: il fornitore è salvato come testo libero nella riga di tracciabilità, con suggerimenti letti in tempo reale dall'anagrafica Cantina |

Richiesta aggiuntiva dell'utente durante la sessione: aggiunto il campo **Settore** alla tabella `fornitori` di Cantina (utile a distinguere fornitori pesce da altri) — applicato subito come migrazione separata.

## Modifiche tecniche

**Database (Supabase, applicato direttamente in sessione via MCP — nessuna migration SQL nel repo, lo schema vive solo lato Supabase remoto, come da pattern esistente del progetto):**
- Progetto **SafeTable** (`xbksultfskvzgncncada`): nuove tabelle `fc_categorie_tracciabilita` (nome, giorni_scadenza, ordine, attivo) e `fc_tracciabilita_prodotti` (rif_interno univoco, progressivo/mese/anno, prodotto, categoria, peso, unità di misura, prezzo unitario, numero fattura, lotto, fornitore_nome, reparto_id, **spesa_id → fc_spese_giornaliere ON DELETE CASCADE**, data_ricezione, data_scadenza, note). Seed iniziale: categoria "Pesce abbattuto" = 30 giorni.
- Progetto **SantaCantina** (`wpsghmmvlwkyqiholfzx`): colonna `settore` (text, nullable) aggiunta a `fornitori`. **Da aggiungere ancora** il campo nel form CRUD fornitori di `cantina.html` (oggetto `CANTINA_FIELDS.fornitori` circa riga 916) — non toccato in questa sessione, fuori scope della richiesta.

**Edge function `foodcost-admin` (SafeTable) → v8, deploy in sessione:**
- Nuove azioni: `tracciabilita_categorie_list/create/update`, `tracciabilita_list`, `tracciabilita_carico_create` (bulk: 1 fattura → N righe, ognuna popola sia `fc_spese_giornaliere` sia `fc_tracciabilita_prodotti`, con compensazione applicativa/rollback se una riga del batch fallisce — niente transazione multi-tabella nel client supabase-js), `tracciabilita_delete` (cancella la spesa collegata, che trascina la riga di tracciabilità per `ON DELETE CASCADE`).
- Stesso schema di sicurezza delle altre azioni (auth via `github_token` con permesso push sul repo).

**Frontend `menu-admin.html` → v 2026.09.16.01, deploy Vercel via push:**
- Nuovo tab "Tracciabilità" in Food Cost: mini-anagrafica categorie/giorni scadenza (collassabile), form "Nuovo carico" con repeater di righe prodotto, storico con le stesse colonne del foglio Excel di riferimento (Rif. Interno, Prodotto, Peso, Ricezione, Fattura/Bolla, Lotto, Fornitore, Scadenza).
- Fornitori suggeriti via `<datalist>` popolato da `cantina-anagrafiche` (GET pubblico, nessuna nuova auth/secret necessaria).

## Loop di revisione (GATE PRODUZIONE)

Questo è un artefatto di produzione (schema DB + edge function + UI admin live). Applicato:
- **P1 (formale)**: sintassi JS verificata (`node --check` sul blocco nuovo), tutte le funzioni richiamate da `onclick` risultano definite, struttura HTML bilanciata.
- **P2 (sostanziale)**: revisione autocritica del flusso dati; trovato e corretto un bug (il dropdown reparto di Tracciabilità non si aggiornava quando si creava/modificava un reparto da un'altra scheda — ora richiamato anche lì).
- **Revisione Oppositiva (3ª passata, IA diversa)**: **NON eseguita in questa sessione** → **debito aperto**. Da fare prima di considerare il modulo definitivo, in particolare su: race condition sul progressivo mensile in caso di doppio inserimento simultaneo (mitigata da un indice univoco DB ma non testata sotto concorrenza), e sulla logica di rollback applicativo in `tracciabilita_carico_create`.

## Non fatto / limiti noti

- **Nessun test in browser**: sessione senza ambiente grafico disponibile. Il flusso (apertura tab, inserimento carico, generazione codice, comparsa in Spese, cancellazione a cascata) va verificato da Andrea sul sito reale prima dell'uso in produzione.
- Il campo Settore non è ancora esposto nel form CRUD fornitori di `cantina.html` (solo a DB).
- Nessuna stampa/etichetta automatica del codice tracciabilità (menzionata nell'allegato di Andrea come "riportata sull'etichetta della confezione") — non richiesta esplicitamente, possibile sviluppo futuro.

## File consegnati

- `menu-admin.html` — v 2026.09.16.01 (Vercel)
- Edge function `foodcost-admin` — v8 (Supabase SafeTable, deploy diretto)
- Migrazioni Supabase applicate direttamente (nessun file nel repo, per pattern esistente del progetto)

## Prossimi passi suggeriti

1. Andrea verifica il flusso reale (carico → codice generato → riga in Spese → riga in Tracciabilità → cancellazione a cascata).
2. Eventuale Revisione Oppositiva del modulo (debito aperto sopra).
3. Esporre il campo Settore nel form fornitori di Cantina, se utile per filtrare i suggerimenti fornitori in Tracciabilità.
