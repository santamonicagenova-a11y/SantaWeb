# HANDOVER — Santamonica Web — v 2026.09.21.01

> **Regola versionamento (fissa, da riportare in ogni handover)**: ogni file consegnato ha versione `v YYYY.MM.DD.NN` in header e footer/UI dove applicabile. I documenti di continuità portano la versione anche nel nome del file. La versione va comunicata esplicitamente all'utente alla consegna.

## Oggetto sessione

Chiusura di una sessione lunga, in continuazione diretta di v2026.09.16.01 → v2026.09.18.02 (stessa conversazione). Tre interventi puntuali su Food Cost, tutti già pushati su `main` come commit separati durante la sessione — qui solo il consuntivo a fine sessione, come da metodo.

## 1. Incassi → scorporo IVA anche sull'inserimento manuale (`menu-admin.html` v 2026.09.18.03)

Andrea ha notato l'incoerenza: il form "Incasso del giorno" (inserimento a mano) salvava gli importi così come digitati, mentre l'import da Excel scorporava già il 10% di IVA. Corretto:

- Estratta la costante condivisa `FC_ALIQUOTA_IVA = 0.10` (prima duplicata come `FC_IMP_ALIQUOTA_IVA` solo nel blocco import), vicino a `FC_URL`.
- Nuova funzione `_fcScorporaIva(lordo)`, usata sia da `fcSalvaIncasso()` (manuale) sia da `fcImportIncassiScegliSheet()` (import Excel).
- Etichette dei campi "Food €" / "Beverage €" aggiornate in "(IVA inclusa)", con testo esplicativo aggiornato.
- Nessun dato storico da correggere: confermato con Andrea che non aveva ancora inserito nulla in Incassi.

## 2. Inventario → totale cliccabile (`menu-admin.html` v 2026.09.21.01)

Sotto la data di conteggio compariva subito la tabella con un campo per reparto (vedi screenshot allegato da Andrea in sessione). Richiesta: prima una cifra di sintesi, dettaglio a richiesta.

- Aggiunto `<summary id="fc-inv-totale">` con testo "Totale: € X", che avvolge (`<details>`) la tabella per reparto — collassata di default, un click la apre.
- Il totale si aggiorna **live** mentre si digita: `oninput="fcInventarioAggiornaTotale()"` su ogni campo reparto, più ricalcolo a ogni render (`fcRenderInventario()` → `fcInventarioAggiornaTotale()`).
- Lo stato aperto/chiuso del `<details>` persiste tra un caricamento e l'altro della data (solo il contenuto interno viene rigenerato, non l'elemento `<details>` stesso).

## 3. Chiarimento — nessuna modifica di codice

Verificato con Andrea (risposta diretta, non richiedeva intervento): un giorno con incasso realmente zero non genera una riga in `fc_incassi_giornalieri` durante l'import (il parser scarta FOOD/BEVERG ≤ 0 per non confondere "non ancora compilato" con "zero vero"), ma questo **non è un problema per il calcolo del Food Cost** — `calcolaRange` nell'edge function somma `importo` su tutte le righe del range senza dividere per numero di giorni, quindi un giorno senza riga contribuisce 0 al totale esattamente come farebbe una riga esplicita con `importo: 0`. Effetto solo cosmetico (lista giornaliera mostra "—" invece di "€ 0,00"). Già annotato nell'HANDOVER v2026.09.18.02, qui solo richiamato per completezza.

## Nota di processo — altri pull da sessioni parallele

Durante la sessione sono stati fatti altri due `git pull --ff-only` per allinearsi a commit pushati da sessioni Cowork parallele su `main`:
- Nuova immagine `img/sito/vacanzina-chiusura-2026-09.jpg` + bump minori su `menu.html`, `menu-it.html`, `menu-vini.html` (probabile banner/comunicazione chiusura estiva).

A differenza della sessione precedente (v2026.09.18.02), questi pull **non hanno generato conflitti** su `menu-admin.html`. Non documentati nel dettaglio qui perché fuori dal lavoro di questa sessione — presumibilmente coperti dalla continuità documentale della sessione Cowork che li ha prodotti (da verificare: se quella sessione non ha lasciato un proprio HANDOVER, resta un buco da colmare).

## Loop di revisione (GATE PRODUZIONE)

- **P1 (formale)**: sintassi JS verificata dopo ogni modifica e dopo ciascun pull di allineamento, riferimenti `onclick`/`oninput` risolti, nessun marker di conflitto residuo.
- **P2 (sostanziale)**: applicato in proporzione alla dimensione dei cambi — un refactor di costante condivisa e un toggle `<details>` collassabile, nessuna nuova logica di calcolo introdotta, basso rischio.
- **Revisione Oppositiva (3ª passata)**: **non eseguita**. Si somma al debito già aperto nelle sessioni precedenti (v2026.09.16.01 per Tracciabilità, v2026.09.18.02 per l'import Incassi) — l'intero modulo Food Cost/Tracciabilità di questa serie di sessioni resta da sottoporre a Revisione Oppositiva prima di considerarlo definitivo.
- **Test in browser**: nessuno in questa sessione (ambiente senza interfaccia grafica). Andrea ha però già verificato visivamente l'Inventario (screenshot allegato in chat) confermando che la richiesta del totale nasce dall'uso reale della UI — non è quindi un flusso mai visto, ma il codice del totale cliccabile stesso non è stato ancora testato dal vivo.

## File consegnati

- `menu-admin.html` — v 2026.09.21.01 (Vercel)
- `docs/CHANGELOG_Santamonica_Web_v2026.09.21.01.md` (sostituisce `..._v2026.09.18.02.md`, rinominato)
- `docs/handovers/HANDOVER_Santamonica_Web_v2026.09.21.01.md` (questo)

## Prossimi passi suggeriti

1. Andrea verifica dal vivo: form Incasso manuale (conferma che l'importo salvato è quello scorporato, non quello digitato) e il totale cliccabile in Inventario.
2. Revisione Oppositiva cumulativa per tutto il ciclo Food Cost/Tracciabilità (v2026.09.16.01 → v2026.09.21.01) — debito ormai su 3 sessioni.
3. Colmare il gap di continuità documentale più volte segnalato (sessioni Food Cost tra 05-19 e 09-13 non tracciate in CHANGELOG) — non affrontato in questa sessione, resta aperto.
4. Verificare se la sessione Cowork che ha prodotto i bump su `menu.html`/`menu-it.html`/`menu-vini.html` + banner chiusura ha lasciato un proprio HANDOVER, o se va ricostruito.

---

## PROMPT DI RIPRESA

Per ripartire su questo progetto in una chat nuova, incolla:

> Riprendo il progetto **SantaWeb** (ristorante Santamonica). Carica come contesto:
> - `docs/CHANGELOG_Santamonica_Web_v2026.09.21.01.md` (stato corrente)
> - `docs/handovers/HANDOVER_Santamonica_Web_v2026.09.21.01.md` (dettaglio ultima sessione)
> - `docs/LESSONS_SantaWeb.md` (regole anti-errore specifiche del progetto)
> - la skill/i reference di `project-continuity-method` (metodologia handover/versioning)
>
> **Dove siamo**: modulo Food Cost di `menu-admin.html` (v 2026.09.21.01) — sotto-moduli Tracciabilità, Incassi (manuale + import Excel, scorporo IVA 10% su entrambi i percorsi), Inventario (totale cliccabile). Lavoro diretto su branch `main` (vedi `CLAUDE.md` del repo), niente feature branch/PR salvo richiesta esplicita.
>
> **Prossimo passo concreto**: Andrea verifica dal vivo le ultime due modifiche (scorporo IVA manuale, totale Inventario); poi Revisione Oppositiva cumulativa sul ciclo Food Cost/Tracciabilità (debito aperto su 3 sessioni) — chiavi API pool (`GEMINI_API_KEY`/`GROQ_API_KEY`/`MISTRAL_API_KEY`) non ancora disponibili in ambiente, altrimenti modalità manuale.
>
> Apri con il prompt di sessione standard del progetto (§C.1 della GUIDA OPERATIVA) e procedi.
