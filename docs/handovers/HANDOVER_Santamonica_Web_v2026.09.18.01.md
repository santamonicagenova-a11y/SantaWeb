# HANDOVER — Santamonica Web — v 2026.09.18.01

> **Regola versionamento (fissa, da riportare in ogni handover)**: ogni file consegnato ha versione `v YYYY.MM.DD.NN` in header e footer/UI dove applicabile. I documenti di continuità portano la versione anche nel nome file. La versione va comunicata esplicitamente all'utente alla consegna.

## Oggetto sessione

Richiesta di Andrea: dopo una richiesta di prenotazione, il contenuto del campo **"Richieste particolari"** del form pubblico (`prenota.html`) deve essere visibile "in relazione alla richiesta fatta" quando apre la prenotazione da Gestionale.

## Cosa c'era già (nessuna riscrittura, solo verifica)

- Il campo è salvato lato server nella colonna `reservations.note` (edge function `create-reservation-checkout`, Supabase SafeTable) — nessuna modifica necessaria qui.
- `gestionale.html` mostra/edita `note` solo dentro il modal "✎ Modifica" di ogni singola prenotazione (campo `er-note`) — bisogna aprirla una per una.
- L'edge function `clienti-crm` (azione `detail`, usata dalla scheda cliente) **selezionava già** `note` per ogni riga di `reservations` restituita in `storia` — il dato arrivava fino al client ma non veniva disegnato in tabella.

## Modifica applicata

**`clienti.html` → v 2026.09.18.01 (Vercel):**
- Nuova colonna **"Richieste particolari"** nello storico prenotazioni della scheda cliente (tabella `#cli-storia-tbody`, popolata da `clienti-crm` azione `detail`).
- Aggiornato il `colspan` del placeholder "Caricamento storico…" da 5 a 6.
- Nessuna modifica a edge function o schema DB: puro binding di un dato già presente nel payload.

Risultato: da Gestionale → pulsante "👤 Anagrafica" su una prenotazione → si apre `clienti.html?tel=...` → nello storico prenotazioni di quel cliente ogni riga mostra ora anche le "Richieste particolari" scritte in quella specifica prenotazione, senza dover aprire ciascuna in modifica.

## Loop di revisione (GATE PRODUZIONE)

File di produzione (deploy Vercel), ma modifica puramente additiva/di sola lettura su un campo già esistente in DB e già transitante nel payload esistente (nessuna nuova scrittura, nessuna logica toccata). Applicato solo controllo diretto del diff — non attivato il loop 3 passate completo, coerente con l'eccezione micro-fix. Se Andrea preferisce comunque la Revisione Oppositiva anche su questo tipo di modifica, va segnalato per le prossime sessioni.

## Non fatto / limiti noti

- Nessun test in browser in questa sessione (ambiente senza interfaccia grafica): da verificare sul sito reale che la colonna appaia correttamente e che `note` lunghe non rompano il layout della tabella (nessun troncamento/wrap esplicito aggiunto — valutare in verifica se serve).
- Non toccata la vista giornaliera di `gestionale.html` (riga prenotazione nel giorno): lì "Richieste particolari" resta visibile solo aprendo "✎ Modifica". Se Andrea vuole vederlo anche lì senza aprire l'anagrafica cliente, è un'estensione separata da valutare.

## File consegnati

- `clienti.html` — v 2026.09.18.01 (Vercel)
- `HANDOVER_Santamonica_Web_v2026.09.18.01.md` (questo)
- `CHANGELOG_Santamonica_Web_v2026.09.18.01.md`
