# HANDOVER — Santamonica Web — v 2026.09.26.07

> **Regola versionamento (fissa, da riportare in ogni handover)**: ogni file consegnato ha versione `v YYYY.MM.DD.NN` in header e footer/UI dove applicabile. I documenti di continuità portano la versione anche nel nome del file. La versione va comunicata esplicitamente all'utente alla consegna.

## Oggetto sessione

Sessione cloud (Claude Code remoto) del 2026-09-26: **un'unica conversazione**, con una chiusura intermedia ("chiudi sessione" → HANDOVER/CHANGELOG `v2026.09.26.02`) seguita da "riprendi sessione" nella stessa chat. Come da `LESSONS_SantaWeb.md` (HANDOVER solo alla chiusura reale, coprendo tutto dall'inizio della chat), questo documento **sostituisce** `HANDOVER_Santamonica_Web_v2026.09.26.02.md` (rinominato in questo, storico in Git) e copre l'intera sessione. NN = il più alto della giornata (.07).

Area di lavoro: `menu-admin.html` → Utilities → Food Cost (Spese, Tracciabilità, Incassi), più un fix trasversale sui tab + backend `foodcost-admin`.

---

## Parte 1 (prima della chiusura intermedia)

### Idea scartata: collegare in Tracciabilità una spesa già registrata
Richiesta iniziale: poter registrare in tracciabilità, oltre alla riga nuova (che crea anche la spesa), una spesa "semplice" già inserita, scelta con un lookup sulla tabella Spese. **Abbandonata su decisione di Andrea**: una spesa semplice copre di solito un'intera fattura, mentre ogni riga di fattura deve avere il suo codice NN-MMAA.

### Batch 1 — v 2026.09.26.01: avviso su spesa semplice "Pesce e crostacei"
In Spese → "+ Aggiungi", con il reparto "Pesce e crostacei" (`FC_TRACC_REPARTO_DEFAULT_NOME`) compare un `confirm()`: la spesa non avrà codice di tracciabilità e si consiglia Tracciabilità → Nuovo carico. Esteso a "Ostriche"? **No** (Andrea). Solo frontend.

### Batch 2 — v 2026.09.26.02 + `foodcost-admin` v11: righe di Tracciabilità modificabili
Decisioni di Andrea:
1. **il codice NN-MMAA non cambia mai**, quindi la data di ricezione è modificabile solo dentro il mese/anno del codice;
2. **la spesa collegata viene riallineata** (data, reparto, importo = peso × prezzo, note);
3. **modifica in linea** nella riga dello storico.

- **Backend v11** (Supabase versione 21): nuova azione `tracciabilita_update`, con validazioni, update della spesa e poi della riga di tracciabilità, e compensazione (la spesa torna ai valori precedenti) se il secondo update fallisce. Helper `noteSpesaCarico()` e `numOpt()` condivisi con `tracciabilita_carico_create`.
- **Frontend**: link "modifica" e form in linea (date con `min`/`max` sul mese del codice). Fornitore come lookup sull'anagrafica Cantina (`fcState.fornitoriCantina`); un nome storico assente dall'anagrafica resta selezionabile.

### Sorgente dell'edge function nel repo
Il sorgente di `foodcost-admin` **esisteva solo su Supabase**: è stato ricostruito integralmente dal deploy per aggiungere l'azione. Su richiesta di Andrea ora sta in **`supabase/functions/foodcost-admin/index.ts`**. Regola aggiunta a LESSONS: prima si aggiorna il file nel repo, poi si pubblica quello stesso contenuto.

---

## Parte 2 (dopo "riprendi sessione")

### v 2026.09.26.03 — Nota nelle Spese
- Nuovo campo "Nota (facoltativa)" nel form "Nuova spesa" (`spese_create`).
- Colonna Note della lista modificabile in linea: si salva con Invio o uscendo dal campo (`spese_update`, con data/reparto/importo invariati); se il salvataggio fallisce torna il valore precedente. Nessuna modifica al backend.

### v 2026.09.26.04 + `foodcost-admin` v12 — note delle spese da Tracciabilità in sola lettura
Richiesta di Andrea: le spese nate da Tracciabilità si modificano solo da Tracciabilità.
- **Backend v12** (Supabase versione 22): `spese_list` include `fc_tracciabilita_prodotti(id, rif_interno)`, relazione inversa via `spesa_id` (FK verificata in DB). `spese_update` rifiuta con **409** una spesa collegata. **Deploy riletto da Supabase e confrontato col file nel repo: identici.**
- **Frontend**: la spesa collegata mostra la nota come testo, preceduta dal badge `🔗 NN-MMAA`; la spesa semplice resta modificabile. Helper `_fcSpesaTracc()`.

### v 2026.09.26.05 — Riga in modifica evidenziata
Il form di modifica della tracciabilità è un riquadro distinto: bordo pieno #9085e9 (colore del tab), sfondo viola più marcato e titoletto a fascia "✏️ MODIFICA RIGA NN-MMAA". Verificato con screenshot headless. I campi data con sfondo bianco del browser vanno bene così (Andrea).

### v 2026.09.26.06 — Ordine cronologico crescente (solo Food Cost)
Spese, Incassi e storico Tracciabilità vanno ora dalla riga più vecchia in alto alla più recente in basso. L'ordinamento avviene nel frontend (helper `_fcCmp`), il backend è invariato. La Tracciabilità è ordinata per data di ricezione e poi anno/mese/progressivo **numerico**, non per il testo del codice. Inventario, import Excel e trend Dashboard erano già in ordine crescente. Le altre sezioni di menu-admin non sono state toccate (scelta di Andrea: "solo Food Cost").

### v 2026.09.26.07 — Fix: "Procedure di aggiornamento" visibili al reload su tab sbagliato
**Causa**: all'avvio `setQaTab()` gira prima che `#intro` esista nel DOM, quindi ricaricando su Utilities/Prenotazioni/Setup il box restava visibile. **Fix**: uno script subito dopo `#intro` applica la stessa regola (visibile solo con il tab "menu"). Verificato con reload headless sui 4 tab.

---

## Verifiche eseguite

| Cosa | Esito |
|---|---|
| Sintassi JS del blocco `<script>` modificato, a ogni versione | OK (`node --check`) |
| Sintassi TS edge function v11 e v12 | OK (`ts.transpileModule`, 0 diagnostiche) |
| Deploy edge function v12 = file nel repo | OK (riletto da Supabase, confronto byte a byte) |
| Test headless Playwright con backend stub: modifica riga tracciabilità, blocco data fuori mese, nota spese (create/update), badge 🔗 + escape HTML, ordinamenti, riquadro di modifica (screenshot), reload sui 4 tab | OK |
| Chiamate reali all'edge function | **Non eseguite**: il proxy dell'ambiente cloud blocca Supabase e serve il token GitHub |
| Prova end-to-end in UI con dati reali | **Da fare (Andrea)**, vedi prossimi passi |

## Loop di revisione (GATE PRODUZIONE)

| Artefatto | P1 formale | P2 sostanziale | P3 Revisione Oppositiva |
|---|---|---|---|
| `menu-admin.html` v.01 (avviso pesce) | Claude | Claude | Non dovuta: micro-fix UI |
| `menu-admin.html` v.02 (modifica righe tracciabilità) | Claude | Claude | **DEBITO**: saltata per decisione esplicita dell'utente |
| Edge function `foodcost-admin` v11 | Claude | Claude | **DEBITO**: saltata per decisione esplicita dell'utente |
| `menu-admin.html` v.03 (nota spese) | Claude | Claude | Non dovuta: micro-fix UI, backend invariato |
| `menu-admin.html` v.04 + edge function v12 (sola lettura spese collegate) | Claude | Claude | **DEBITO**: non eseguita (backend di produzione) |
| `menu-admin.html` v.05 / v.06 / v.07 (grafica, ordinamento, fix intro) | Claude | Claude | Non dovuta: micro-fix di visualizzazione |

Si somma al debito P3 cumulato sull'intero modulo Food Cost/Tracciabilità (sessioni dal 2026-09-16).

**Rischio specifico**: la v11 è una ricostruzione integrale del sorgente dell'edge function, fatta dal deploy. La v12 è poi stata confrontata col repo, ma la ricostruzione iniziale della v11 non ha un riferimento indipendente. Se un'altra funzione Food Cost (Incassi, Inventario, Dashboard, Vendite, Costo piatti) si comporta in modo anomalo, questa è la prima causa da verificare. Rollback: ridistribuire da Supabase la versione piattaforma 20 (pre-sessione).

## File consegnati

| File | Versione |
|---|---|
| `menu-admin.html` | v 2026.09.26.01 → **v 2026.09.26.07** (Vercel, su `main`) |
| Edge function `foodcost-admin` | v10 → **v12** (Supabase SafeTable, versione piattaforma 22) |
| `supabase/functions/foodcost-admin/index.ts` | **v12** (NUOVO nel repo) |
| `docs/LESSONS_SantaWeb.md` | + regola sul sorgente dell'edge function |
| `docs/CHANGELOG_Santamonica_Web_v2026.09.26.07.md` | ex `..._v2026.09.26.02.md`, voce del giorno consolidata |
| `docs/handovers/HANDOVER_Santamonica_Web_v2026.09.26.07.md` | questo (sostituisce `..._v2026.09.26.02.md`) |

Commit su `main`: `32ac7d4`, `02e1f29`, `5e68247`, `97f008e` (chiusura intermedia), `f9694ac`, `892e3f6`, `31d1e5f`, `d5dc717`, `46154fa`, più il commit documentale di chiusura.

## Prossimi passi suggeriti

1. **Andrea, prova reale**:
   - Tracciabilità: modifica una riga (es. il peso) e verifica che l'importo si aggiorni in Spese;
   - Spese: le spese nate da Tracciabilità mostrano il badge 🔗 e la nota non modificabile; le altre salvano la nota;
   - ordinamento crescente nelle 3 liste;
   - giro veloce sugli altri tab Food Cost (rischio di ricostruzione descritto sopra).
2. Revisione Oppositiva cumulativa del modulo Food Cost/Tracciabilità (debito aperto, ora include edge function v11–v12).
3. Modifiche future a `foodcost-admin`: prima il file nel repo, poi il deploy dello stesso contenuto, e alla fine il confronto del deploy con il repo.

---

## PROMPT DI RIPRESA

> Riprendo il progetto **SantaWeb** (ristorante Santamonica). Carica come contesto:
> - `docs/CHANGELOG_Santamonica_Web_v2026.09.26.07.md` (stato corrente)
> - `docs/handovers/HANDOVER_Santamonica_Web_v2026.09.26.07.md` (dettaglio ultima sessione)
> - `docs/LESSONS_SantaWeb.md` (regole anti-errore del progetto)
> - la skill `project-continuity-method`
>
> **Dove siamo**: `menu-admin.html` v 2026.09.26.07. Il Food Cost ha:
> - Tracciabilità con righe modificabili (codice fisso, spesa collegata riallineata, riquadro evidenziato);
> - Spese con nota modificabile solo per le spese semplici (le spese da Tracciabilità hanno il badge 🔗 e sono in sola lettura), e avviso sulle spese semplici "Pesce e crostacei";
> - liste in ordine cronologico crescente.
>
> Backend `foodcost-admin` v12, sorgente in `supabase/functions/foodcost-admin/index.ts`. Lavoro diretto su `main`.
>
> **Prossimo passo**: esito della prova reale di Andrea; Revisione Oppositiva cumulativa del modulo Food Cost/Tracciabilità (debito aperto).
