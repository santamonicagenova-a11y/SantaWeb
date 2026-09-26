# HANDOVER — Santamonica Web — v 2026.09.26.08

> **Regola versionamento (fissa, da riportare in ogni handover)**: ogni file consegnato ha versione `v YYYY.MM.DD.NN` in header e footer/UI dove applicabile. I documenti di continuità portano la versione anche nel nome del file. La versione va comunicata esplicitamente all'utente alla consegna.

## Oggetto sessione

Sessione cloud (Claude Code remoto) del 2026-09-26, breve e a tema unico. Richiesta di Andrea: in `menu-admin.html` → Food Cost → **Costo piatti**, la colonna **Prezzo vendita** deve prendere il prezzo dalla **carta pubblicata**.

---

## Cosa è stato fatto — `menu-admin.html` v 2026.09.26.08

- **Fonte del prezzo**: fetch live, senza cache, di `menu-it.html` (carta) e `menu-dolci.html` (dolci). Il blocco `const MENU` viene estratto con `_estraiMenu`, già presente in `admin-core.js`. `menu.html` e `menu-it.html` hanno un blocco MENU identico (verificato con l'hash).
- **Match piatto → prezzo** (`_fcPrezziCartaLive`, `_fcPrezzoCartaPer`):
  - chiave sezione + nome, normalizzati con `_pdNorm` (lo stesso criterio della sincronizzazione Dettagli piatti); vale sia `titolo` sia `titolo_display`;
  - ripiego sul **solo nome**, se è univoco in tutta la carta. È indispensabile: in `piatti_dettagli` le sezioni sono "Antipasti" e "Dolci — Golosità", mentre in carta sono "Sfiziosi" e "Golosità".
- **UI**: cella in sola lettura "€ X" (con l'unità, es. "cad.") e la dicitura "dalla carta pubblicata". I piatti non trovati in carta mantengono l'input a mano, con l'avviso "non trovato in carta — a mano". Aggiornato il testo introduttivo del tab.
- **Riallineamento DB** (`_fcAllineaPrezziCarta`): all'apertura del tab, le schede già salvate con prezzo diverso dalla carta vengono aggiornate con `piatti_costo_upsert` (costo e attivo invariati). Così Vendite e Dashboard, che leggono `fc_piatti_costo.prezzo_vendita`, usano il prezzo pubblicato.
- **Fallback**: se la carta non è raggiungibile o non si riesce a leggere, torna il comportamento precedente (prezzo salvato, modificabile), con un messaggio di stato.
- **Fix collaterale**: `fcSalvaCosti` e il riallineamento passano `attivo`. Prima il backend lo forzava a `true` a ogni salvataggio.
- Il salvataggio salta le righe senza costo e mai salvate: il prezzo automatico da solo non crea schede vuote in Vendite.
- Backend `foodcost-admin` **invariato** (v12).

## Verifiche eseguite

- P1: `node --check` sul blocco script del Food Cost → OK.
- P2: test node delle funzioni di match sui file reali `menu-it.html` e `menu-dolci.html`, con i **25 piatti reali** di `piatti_dettagli` letti dal DB (query di sola lettura): **25/25 trovati**, prezzi corretti. Casi limite: sezione diversa (ripiego sul nome), nome inesistente (null), nomi con `<em>` in carta.
- Stato DB: solo 2 schede salvate (Ostriche Gillardeau 7 €, Sacripantina 12 €), entrambe già allineate alla carta. All'apertura non parte nessuna scrittura.
- **Non eseguito**: prova nel browser sulla pagina vera (auth token GitHub). Resta a carico di Andrea.

## Loop di revisione (GATE PRODUZIONE)

| Artefatto | P1 | P2 | P3 Revisione Oppositiva |
|---|---|---|---|
| `menu-admin.html` v 2026.09.26.08 | Claude | Claude | non dovuta: tool admin interno, nessun contenuto pubblico, backend invariato |

Rischi residui: il ripiego sul nome non trova piatti rinominati solo in Dettagli piatti o solo in carta, che finiscono in "non trovato — a mano". Un piatto con lo stesso nome in due sezioni diverse è ambiguo e non viene risolto.

## File consegnati

- `menu-admin.html` **v 2026.09.26.08** (Vercel)
- `docs/CHANGELOG_Santamonica_Web_v2026.09.26.08.md` (rinominato da `.07`)
- `docs/handovers/HANDOVER_Santamonica_Web_v2026.09.26.08.md` (questo)

## Prossimi passi suggeriti

1. **Andrea**: aprire Food Cost → Costo piatti e verificare i prezzi in sola lettura. Poi inserire un costo ricetta su un piatto nuovo, salvare e controllare che compaia in Vendite con il prezzo della carta.
2. Debito ancora aperto dalla sessione precedente: Revisione Oppositiva cumulativa del modulo Food Cost/Tracciabilità (edge function v11–v12).
3. Opzionale: allineare i nomi delle sezioni in Dettagli piatti a quelli della carta ("Antipasti" → "Sfiziosi") per rendere il match più robusto.

---

## Per Jarvis

- **Sotto-progetto:** Sito
- **Fatto:** Food Cost → Costo piatti: il prezzo di vendita ora arriva da solo dalla carta pubblicata (carta + dolci) e si riallinea all'apertura del tab (menu-admin v 2026.09.26.08)
- **Attività:** Prezzo vendita da carta pubblicata in Costo piatti → `done` (nuova:)
- **Aspetta Andrea:** prova in pagina del tab Costo piatti (prezzi in sola lettura, salvataggio di un nuovo costo)
- **Debiti:** nessuno nuovo. Resta aperta la Revisione Oppositiva cumulativa del modulo Food Cost/Tracciabilità
- **Decisioni:** prezzo di vendita preso sempre dalla carta pubblicata, non più inserito a mano (una sola fonte di verità)

---

## PROMPT DI RIPRESA

> Riprendo il progetto **SantaWeb** (ristorante Santamonica). Carica come contesto:
> - `docs/CHANGELOG_Santamonica_Web_v2026.09.26.08.md` (stato corrente)
> - `docs/handovers/HANDOVER_Santamonica_Web_v2026.09.26.08.md` (dettaglio ultima sessione)
> - `docs/LESSONS_SantaWeb.md` (regole anti-errore del progetto)
> - la skill `project-continuity-method`
>
> **Dove siamo**: `menu-admin.html` v 2026.09.26.08. In Food Cost → Costo piatti il prezzo di vendita è letto dalla carta pubblicata (`menu-it.html` + `menu-dolci.html`) e riallineato nel DB all'apertura del tab. Backend `foodcost-admin` v12 invariato. Lavoro diretto su `main`.
>
> **Prossimo passo**: esito della prova di Andrea sul tab Costo piatti; Revisione Oppositiva cumulativa del modulo Food Cost/Tracciabilità (debito aperto).
