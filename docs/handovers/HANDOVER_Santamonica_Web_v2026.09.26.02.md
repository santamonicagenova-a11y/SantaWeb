# HANDOVER — Santamonica Web — v 2026.09.26.02

> **Regola versionamento (fissa, da riportare in ogni handover)**: ogni file consegnato ha versione `v YYYY.MM.DD.NN` in header e footer/UI dove applicabile. I documenti di continuità portano la versione anche nel nome del file. La versione va comunicata esplicitamente all'utente alla consegna.

## Oggetto sessione

Sessione cloud (Claude Code remoto), un'unica conversazione con 2 batch di lavoro + 1 salvataggio, tutto su `menu-admin.html` → Food Cost → Spese/Tracciabilità. I documenti di continuità prendono l'NN più alto della giornata (.02).

## Batch 0 — Idea scartata: lookup di una spesa esistente in Tracciabilità

Richiesta iniziale di Andrea: nel form "Nuovo carico" di Tracciabilità, oltre alla riga nuova (che crea anche la spesa), poter **collegare una spesa già registrata come "semplice"** tramite lookup nella tabella Spese.

Analisi fatta prima di scrivere codice: `fc_spese_giornaliere` ha solo data/reparto/importo/note, e il collegamento oggi è 1:1 (`fc_tracciabilita_prodotti.spesa_id`, e cancellando la tracciabilità si cancella anche la spesa). Il problema, sollevato da Andrea stesso: **una spesa semplice copre di solito un'intera fattura con più prodotti, mentre ogni riga di fattura deve avere il suo codice di tracciabilità**. Collegando una spesa esistente si perderebbe la corrispondenza "un prodotto → un codice → un importo". **Idea abbandonata** su decisione dell'utente e sostituita dal Batch 1.

## Batch 1 — Avviso su spesa semplice "Pesce e crostacei" (`menu-admin.html` v 2026.09.26.01)

- In Food Cost → Spese → "+ Aggiungi", se il reparto scelto è **"Pesce e crostacei"** (costante già esistente `FC_TRACC_REPARTO_DEFAULT_NOME`) compare un `confirm()`: la spesa semplice non avrà codice di tracciabilità, per pesce e crostacei di norma si usa Tracciabilità → Nuovo carico, "Sei sicuro di voler procedere?". Annulla → spesa non salvata, messaggio in barra di stato.
- Verificato in DB che il nome del reparto coincide esattamente.
- **Reparto "Ostriche"** (food, attivo): chiesto ad Andrea se estendere l'avviso → **no, non serve**.
- Solo frontend, backend invariato.

## Batch 2 — Modifica delle righe già inserite in Tracciabilità (`menu-admin.html` v 2026.09.26.02 + `foodcost-admin` v11)

Decisioni di Andrea (proposte di Claude, tutte accettate):
1. **Il codice NN-MMAA non cambia mai** (può già essere su etichette o sul registro cartaceo). Di conseguenza la data di ricezione è modificabile **solo dentro lo stesso mese/anno del codice**.
2. **La spesa collegata viene riallineata**: data, reparto, importo (peso × prezzo, stessa formula del carico), note.
3. **Modifica in linea** nella riga dello storico (non ricaricando il form "Nuovo carico").

**Backend — edge function `foodcost-admin` v11 (deploy Supabase SafeTable, versione piattaforma 21):**
- Nuova azione `tracciabilita_update`: legge la riga (anno/mese/spesa_id), valida (prodotto obbligatorio, data nel mese del codice, peso/prezzo ≥ 0, formato data scadenza), aggiorna prima la spesa collegata e poi la riga di tracciabilità. Se il secondo update fallisce, la spesa viene riportata ai valori precedenti: stessa compensazione applicativa usata in `tracciabilita_carico_create`.
- Refactor minimo: note spesa estratte in `noteSpesaCarico()` e parsing peso/prezzo facoltativi in `numOpt()`, condivisi tra create e update. Stesso formato di prima.
- `verify_jwt: false` mantenuto (auth via token GitHub nel body, invariata).

**Frontend (`menu-admin.html` v 2026.09.26.02):**
- Link "modifica" accanto a "elimina". La riga diventa un form in linea con Prodotto, Peso, U.M., Prezzo/u.m., Ricezione (input date con `min`/`max` = primo/ultimo giorno del mese del codice), Fattura/Bolla, Lotto, Scadenza, Fornitore, Reparto (Spese).
- Fornitore: `<select>` sull'anagrafica Cantina (lista ora conservata in `fcState.fornitoriCantina`). Un nome storico non più presente in anagrafica viene aggiunto come opzione, così non si perde al salvataggio.
- Reparto: reparti food attivi. Un reparto non più attivo viene aggiunto come opzione se è quello attuale.
- Controllo del mese anche lato client, prima della chiamata.

## Salvataggio del sorgente dell'edge function nel repo

**Scoperta**: il sorgente di `foodcost-admin` **non era nel repo**, esisteva solo su Supabase. Per aggiungere l'azione è stato ricostruito per intero dalla versione pubblicata (v20 → v21). Su richiesta di Andrea ora è salvato in **`supabase/functions/foodcost-admin/index.ts`** (v11, identico al deploy). Regola aggiunta a `LESSONS_SantaWeb.md`.

## Verifiche eseguite

| Cosa | Esito |
|---|---|
| Sintassi JS del blocco `<script>` modificato (entrambi i batch) | OK (`node --check`) |
| Sintassi TypeScript edge function | OK (`ts.transpileModule`, 0 diagnostiche) |
| Deploy edge function | ACTIVE, versione 21 |
| Test headless (Playwright, dati finti, backend stub): rendering riga, form in linea, escape dei valori, `min`/`max` data, blocco data fuori mese, payload `tracciabilita_update` | OK |
| Chiamata reale all'edge function | **Non eseguita**: proxy dell'ambiente cloud blocca Supabase, e serve comunque il token GitHub |
| Prova end-to-end in UI con dati reali | **Da fare (Andrea)** |

## Loop di revisione (GATE PRODUZIONE)

| Artefatto | P1 formale | P2 sostanziale | P3 Revisione Oppositiva |
|---|---|---|---|
| `menu-admin.html` v 2026.09.26.01 (avviso) | Claude | Claude | Non applicata: micro-fix UI additivo (eccezione METODO) |
| `menu-admin.html` v 2026.09.26.02 (modifica righe) | Claude | Claude | **DEBITO**: saltata per decisione esplicita dell'utente ("no P3") |
| Edge function `foodcost-admin` v11 | Claude | Claude | **DEBITO**: saltata per decisione esplicita dell'utente ("no P3") |

Si somma al debito P3 cumulato sull'intero modulo Food Cost/Tracciabilità (sessioni 2026-09-16 → 2026-09-25).

**Rischio specifico da tenere presente**: la ricostruzione integrale del sorgente dell'edge function. Il resto del file è stato ricopiato senza modifiche intenzionali, ma se un'altra funzione Food Cost (Spese, Incassi, Inventario, Dashboard, Vendite, Costo piatti) si comporta in modo anomalo dopo il 2026-09-26, la prima causa da verificare è questa. Rollback possibile: ridistribuire la v20 dalla cronologia di Supabase.

## File consegnati

- `menu-admin.html` — v 2026.09.26.01 → **v 2026.09.26.02** (Vercel, su `main`)
- Edge function `foodcost-admin` — **v11** (Supabase SafeTable, versione piattaforma 21)
- `supabase/functions/foodcost-admin/index.ts` — **v11** (NUOVO nel repo)
- `docs/LESSONS_SantaWeb.md` — nuova regola edge function
- `docs/CHANGELOG_Santamonica_Web_v2026.09.26.02.md` (sostituisce `..._v2026.09.25.01.md`, rinominato)
- `docs/handovers/HANDOVER_Santamonica_Web_v2026.09.26.02.md` (questo)

Commit su `main`: `32ac7d4`, `02e1f29`, `5e68247`, più il commit documentale di chiusura.

## Prossimi passi suggeriti

1. **Andrea**: prova reale della modifica di una riga di tracciabilità (es. cambio peso) e verifica che l'importo si aggiorni anche nel tab Spese. Poi un giro veloce sugli altri tab Food Cost, per il rischio di ricostruzione descritto sopra.
2. Revisione Oppositiva cumulativa del modulo Food Cost/Tracciabilità (debito aperto).
3. Da ora in poi, modifiche a `foodcost-admin`: prima il file nel repo, poi il deploy dallo stesso contenuto.

---

## PROMPT DI RIPRESA

> Riprendo il progetto **SantaWeb** (ristorante Santamonica). Carica come contesto:
> - `docs/CHANGELOG_Santamonica_Web_v2026.09.26.02.md` (stato corrente)
> - `docs/handovers/HANDOVER_Santamonica_Web_v2026.09.26.02.md` (dettaglio ultima sessione)
> - `docs/LESSONS_SantaWeb.md` (regole anti-errore del progetto)
> - la skill `project-continuity-method`
>
> **Dove siamo**: modulo Food Cost di `menu-admin.html` (v 2026.09.26.02). Tracciabilità con righe dello storico modificabili (codice NN-MMAA fisso, spesa collegata riallineata), avviso di conferma su spese semplici "Pesce e crostacei". Backend `foodcost-admin` v11, sorgente ora in `supabase/functions/foodcost-admin/index.ts`. Lavoro diretto su `main`.
>
> **Prossimo passo**: esito della prova reale di Andrea sulla modifica righe; Revisione Oppositiva cumulativa del modulo Food Cost/Tracciabilità (debito aperto).
