# CLAUDE.md — SantaWeb

Istruzioni di progetto lette a inizio sessione da Claude Code. Fonte di verità
per i dettagli operativi: `docs/CHANGELOG_Santamonica_Web_*.md` (stato corrente)
e `docs/METODO_Continuita_Progetti_*.md` (metodologia handover/versioning).

## Git — push diretto su `main`

Questo repo **non usa un flusso a feature branch + PR** per il lavoro ordinario.
Salvo diversa istruzione esplicita dell'utente per quella specifica sessione:

- Lavora direttamente sul branch `main` (o, se l'ambiente crea un branch di
  sessione separato, portalo su `main` con push/fast-forward a fine sessione
  senza aprire una PR).
- Non lasciare il lavoro fermo su un branch secondario "in attesa di review":
  se le modifiche sono pronte, vanno su `main`.
- Apri una Pull Request solo se l'utente la chiede esplicitamente.

## Versioning (regola fissa)

Ogni file di deploy consegnato ha versione `v YYYY.MM.DD.NN` in header e
footer/UI dove applicabile. I documenti di continuità (HANDOVER/CHANGELOG/
ROADMAP/METODO) portano la versione anche nel nome del file. Comunica sempre
la versione all'utente quando consegni un file. Dettagli completi in
`docs/METODO_Continuita_Progetti_*.md` §6.

## Fine sessione

Per modifiche significative: produci `HANDOVER_<...>_vYYYY.MM.DD.NN.md` in
`docs/handovers/` e aggiorna `docs/CHANGELOG_Santamonica_Web_*.md` (nuova
versione, rinominando il file secondo convenzione). Per micro-fix di sola
visualizzazione non serve il loop di revisione a 3 passate completo — vedi
METODO.
