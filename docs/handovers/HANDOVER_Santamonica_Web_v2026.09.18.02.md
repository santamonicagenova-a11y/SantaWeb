# HANDOVER — Santamonica Web — v 2026.09.18.02

> **Regola versionamento (fissa, da riportare in ogni handover)**: ogni file consegnato ha versione `v YYYY.MM.DD.NN` in header e footer/UI dove applicabile. I documenti di continuità portano la versione anche nel nome del file. La versione va comunicata esplicitamente all'utente alla consegna.

## Oggetto sessione

Continuazione della sessione v2026.09.16.01 (modulo Tracciabilità in Food Cost). Due filoni di lavoro, entrambi su richiesta diretta di Andrea:

1. **Rifiniture Tracciabilità**.
2. **Import Incassi da Excel** — nuovo, sviluppato dopo aver analizzato il file `Budget.xlsx` allegato da Andrea (lo stesso foglio da cui in passato derivava "LibroCassa").

## 1. Rifiniture Tracciabilità

| Richiesta | Fatto |
|---|---|
| Togliere il campo Categoria dalla riga prodotto | Rimosso dal form. La scadenza si autocompila sempre dalla prima categoria attiva (default "Pesce abbattuto" = 30gg), ricalcolata al cambio data ricezione, sempre modificabile a mano riga per riga |
| Reparto di default "Pesce e crostacei" | Preselezionato nel select del carico quando presente tra i reparti attivi (verificato: esiste già in `fc_reparti`) |
| Togliere anche il pannello "Categorie e giorni di scadenza" | Rimosso dalla pagina. La regola resta in DB (`fc_categorie_tracciabilita`) e continua a essere letta in automatico — per cambiarla serve un intervento diretto sul dato (query o richiesta a Claude), non più un form |

Nessuna modifica all'edge function per questi punti (il campo `categoria_id` in `tracciabilita_carico_create` resta supportato, il frontend ora invia sempre `null`).

## 2. Import Incassi da Excel

### Analisi del file allegato

`Budget.xlsx`: una scheda per mese (dal 2016 a oggi + "Confronto"), righe = giorni del mese. Contiene **solo incassi**, nessun dato di spesa/food cost. Colonne rilevanti: A = giorno, F = (da ottobre 2026) **FOOD**, G = (da ottobre 2026) **BEVERG** — prima di ottobre 2026 le stesse colonne erano FT/POS con significato diverso (non un vero split food/beverage), quindi non utilizzabili per l'import.

### Decisioni prese con l'utente

| Decisione | Scelta |
|---|---|
| Colonne da importare | FOOD (F) e BEVERG (G), disponibili solo da ottobre 2026 |
| IVA | Inclusa nei valori del foglio → scorporo al **10%** per entrambe (food e beverage) prima di salvare in Food Cost (che vuole sempre importi IVA esclusa) |
| Modalità import | Nessuna preferenza espressa → implementata la modalità "carica file .xlsx in pagina con anteprima prima di salvare" (l'opzione raccomandata) |

### Implementazione

- **Frontend** (`menu-admin.html`, tab Food Cost → Incassi): nuovo pannello collassabile "📥 Importa da Excel". Il file si carica via `<input type="file">`, si legge con **SheetJS** (`xlsx.full.min.js`) caricata via CDN cdnjs al primo utilizzo (lazy-load — coerente con jsPDF/html2canvas/Chart.js già caricate così in questo stesso file per la stampa PDF/i grafici; non vendorizzata in `/lib/`, la convenzione "mai CDN" nel progetto è finora applicata solo alle pagine pubbliche, non al pannello admin). Si sceglie la scheda mese (preselezionata quella del mese corrente se presente), si leggono le righe con colonne FOOD/BEVERG valorizzate (i giorni non ancora compilati nel foglio, che risultano a 0 per via delle formule, vengono scartati — non trattati come incasso zero reale), si scorpora l'IVA al 10% e si mostra un'anteprima (lordo → netto per ogni giorno) prima di salvare.
- **Backend**: edge function `foodcost-admin` → **v9**, nuova azione `incassi_bulk_upsert` (array di righe `{data, tipo, importo}`, upsert in blocco invece di N chiamate separate — stesso pattern di `vendite_bulk_upsert` già esistente). Nessuna nuova tabella: usa `fc_incassi_giornalieri` già esistente.

### Limiti noti / assunzioni da verificare

- Un giorno con **incasso realmente zero** (es. locale chiuso) non genera una riga in `fc_incassi_giornalieri` in fase di import (il parser scarta FOOD/BEVERG ≤ 0 per non confondere "non ancora compilato" con "zero vero" — nel foglio osservato i placeholder non compilati risultano proprio a 0 tramite formula). **Verificato con Andrea (2026-09-18) che questo non è un problema per il calcolo del food cost**: `calcolaRange` nell'edge function somma semplicemente `importo` su tutte le righe del range (`totaleIncassi = incassi.reduce(...)`), senza dividere per numero di giorni — un giorno senza riga contribuisce 0 al totale, esattamente come contribuirebbe una riga esplicita con `importo: 0`. L'unico effetto è cosmetico: nella lista giornaliera del tab Incassi il giorno saltato mostra "—" invece di "€ 0,00". Nessuna modifica necessaria.
- Aliquota IVA 10% fissa in codice (`FC_IMP_ALIQUOTA_IVA`), uguale per food e beverage, come confermato da Andrea. Se in futuro cambia o serve differenziarla, va aggiornata lì.
- **Non testato in browser** in questa sessione (ambiente senza interfaccia grafica): il flusso di lettura file → scelta scheda → anteprima → import va verificato da Andrea su un mese reale con dati, in particolare la corretta associazione giorno→data e lo scorporo IVA.

## Nota di processo — sessione parallela su Cowork

Durante questa sessione una **sessione Cowork separata** ha pushato su `main` (PR #4: "Rubrica professionisti: sincro NoShowApp" + fix minori su `clienti.html`, `cantina.html`, `gestionale.html`, rimozione foto inutilizzate, nuovo `CLAUDE.md`). Al momento del mio push è comparso un conflitto di merge in `menu-admin.html`: entrambe le sessioni avevano usato per coincidenza lo stesso timestamp di versione `v 2026.09.18.01` nell'header-comment del file (righe di commento diverse, stesso numero). Risolto con un **merge** (non un rebase, coerente con le regole del progetto): la voce della sessione Rubrica resta `v 2026.09.18.01`, questa sessione diventa **`v 2026.09.18.02`**. Verificato dopo il merge che entrambi i set di modifiche siano intatti (sintassi JS OK, nessuna funzione orfana, nessun marker di conflitto residuo).

## Loop di revisione (GATE PRODUZIONE)

- **P1 (formale)**: sintassi JS verificata (`node --check` sui blocchi nuovi, anche dopo il merge), tutte le funzioni richiamate da `onclick`/`onchange` risultano definite, id HTML coerenti tra markup e JS.
- **P2 (sostanziale)**: rivista la logica di scorporo IVA, il criterio per distinguere "giorno non compilato" da "incasso zero reale" (vedi nota sopra — verificato con l'utente che non impatta il calcolo del food cost), il mapping mese/anno dal nome scheda Excel, e la gestione delle schede pre-ottobre 2026 (segnalate come non importabili invece di essere lette in modo scorretto).
- **Revisione Oppositiva (3ª passata)**: **non tentata in questa sessione** (nessuna richiesta esplicita dell'utente). Si somma al debito già aperto in v2026.09.16.01 per il modulo Tracciabilità — entrambi da chiudere prima di considerare i due moduli definitivi.

## File consegnati

- `menu-admin.html` — v 2026.09.18.02 (Vercel)
- Edge function `foodcost-admin` — v9 (Supabase SafeTable, deploy diretto)
- `docs/CHANGELOG_Santamonica_Web_v2026.09.18.02.md` (sostituisce `..._v2026.09.16.01.md` e la voce precedente di `..._v2026.09.18.01.md`, ora rinominato)
- `docs/handovers/HANDOVER_Santamonica_Web_v2026.09.18.02.md` (questo)

## Prossimi passi suggeriti

1. Andrea verifica il flusso di import Incassi su un mese reale con dati (es. ottobre 2026 appena inizia a compilarlo).
2. Revisione Oppositiva per Tracciabilità + Import Incassi (debito cumulato).
3. Colmare il gap di continuità documentale segnalato in v2026.09.16.01 (sessioni Food Cost tra 05-19 e 09-13 non tracciate in CHANGELOG).
