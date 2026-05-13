# METODO — Continuità documentale per progetti di lavoro con Claude
**Versione:** v 1.0 (2026-05-13) · **Autore:** definito per uso personale, riutilizzabile su qualsiasi progetto Claude

---

## 0. SCOPO

Questo documento descrive un metodo a **3 layer ridondanti** per gestire la continuità documentale di un progetto di lavoro che si sviluppa su molte sessioni Claude separate.

**Obiettivo unico:** garantire che **nessuna informazione vada persa** anche in caso di:
- cancellazione accidentale di file dalla Knowledge Base
- chat troppo lunghe che escono dal context
- ripresa del progetto a distanza di mesi
- subentro di un altro operatore

---

## 1. FILOSOFIA — perché 3 layer

Un singolo documento di continuità (per quanto curato) è un **single point of failure**: se si perde o si corrompe, l'informazione svanisce. La ridondanza distribuita su 3 piani garantisce che la perdita di uno non comprometta gli altri.

| Layer | Risponde alla domanda | Granularità |
|---|---|---|
| **A) HANDOVER per sessione** | "Cosa è successo esattamente in quella sessione?" | Alta (dettaglio operativo) |
| **B) CHANGELOG.md unico** | "Qual è lo stato corrente? Cosa è cambiato in N sessioni?" | Media (sintesi 3-5 righe per sessione) |
| **C) Backup su Git** | "Dove ritrovo tutto se la KB di Claude si svuota?" | — (persistenza) |

Regola d'oro: **se un'informazione esiste solo in un posto, non esiste**.

---

## 2. STRUTTURA DEI 3 LAYER

### 2.1 Layer A — HANDOVER per sessione

File markdown prodotti **alla fine di ogni sessione di lavoro significativa** (= che ha modificato codice/dati/decisioni del progetto).

**Naming convention:**
```
HANDOVER_<NomeProgetto>_<YYYY-MM-DD>[_vN].md
```
Esempi:
- `HANDOVER_Santamonica_Web_2026-05-13.md`
- `HANDOVER_Santamonica_Web_2026-05-09_v2.md` (seconda sessione dello stesso giorno)

**Struttura obbligatoria (5 sezioni):**

```markdown
# HANDOVER — <Nome progetto>
**Data:** YYYY-MM-DD · **Continuazione di:** <file handover precedente>

## 1. STATO ATTUALE
Tabella file prodotti (nome | versione | destinazione | status).
Sintesi 2-3 righe della sessione.

## 2. DATI CHIAVE — modifiche consolidate
Una sotto-sezione per ogni modifica significativa.
Include: contesto, modifica esatta (snippet code/diff), motivazione, ambito.
Solo decisioni FINALI: scartare tentativi errati.

## 3. CONTESTO ESSENZIALE
- Architettura (anche se invariata, ripeti lo schema chiave)
- Convenzioni progetto (tabella riassuntiva)
- REGOLA OPERATIVA FISSA: versionamento (vedi §6)
- Sistema di auth/credenziali (in localStorage, env, ecc.)

## 4. PROSSIMI PASSI
- Deploy immediato
- Verifiche post-deploy
- Lavori arretrati / decisioni rimandate
- Roadmap eventuali

## 5. ALLEGATI / RIFERIMENTI
- Catena documenti di continuità (lista in ordine cronologico)
- File toccati questa sessione (tabella)
- File NON modificati (lista)
```

**Lunghezza:** proporzionale alla sessione. Una modifica di 1 riga genera un handover di ~150 righe (sezioni di contesto + 1 sotto-sezione DATI CHIAVE). Una sessione di refactor pesante genera ~250-400 righe.

### 2.2 Layer B — CHANGELOG.md unico

**Un solo file**, vive nella root del progetto, **mai cancellato, sempre appeso in cima** ad ogni sessione.

**Naming convention:**
```
CHANGELOG_<NomeProgetto>.md
```

**Struttura:**

```markdown
# CHANGELOG — <Nome progetto>

## STATO CORRENTE
| Componente | Versione | Ultimo aggiornamento |
|---|---|---|
| <file1> | v X.Y.Z | YYYY-MM-DD |
| <file2> | v X.Y.Z | YYYY-MM-DD |

> Sezione **sempre aggiornata** ad ogni sessione (sostituire, non appendere).

---

## STORICO SESSIONI

### YYYY-MM-DD (sessione N) — <titolo sintetico>
**Versioni rilasciate:** file1 vX, file2 vY
**Sintesi (3-5 righe):**
- Cambiamento chiave 1
- Cambiamento chiave 2
- Cambiamento chiave 3
**Handover dettagliato:** `HANDOVER_<...>_<YYYY-MM-DD>.md`

### YYYY-MM-DD (sessione N-1) — <titolo sintetico>
...
```

**Funzione di fallback:** se l'handover dettagliato si perde, dal CHANGELOG sai almeno **cosa è cambiato** e **quando**, anche se non hai più il **come**.

### 2.3 Layer C — Backup su Git

Tutti i file `.md` di continuità (HANDOVER + CHANGELOG) committati su un **repository Git** dedicato o in una sottocartella `docs/` del repo principale del progetto.

**Strutture suggerite:**

Opzione 1 — sottocartella nel repo principale:
```
<repo-progetto>/
  ├── docs/
  │   ├── CHANGELOG_<progetto>.md
  │   └── handovers/
  │       ├── HANDOVER_<...>_2026-05-02.md
  │       ├── HANDOVER_<...>_2026-05-09.md
  │       └── HANDOVER_<...>_2026-05-13.md
  └── <resto del progetto>
```

Opzione 2 — repo dedicato (utile per progetti senza codice):
```
<progetto>-docs/
  ├── CHANGELOG_<progetto>.md
  └── handovers/*.md
```

**Vantaggio:** Git è versionato. Anche se cancelli un file per errore, lo recuperi da history.

---

## 3. WORKFLOW PER SESSIONE

### 3.1 Inizio sessione

1. Caricare nella Knowledge Base del progetto Claude:
   - `CHANGELOG_<progetto>.md`
   - L'ultimo `HANDOVER_*.md`
   - Eventuali handover precedenti rilevanti (max 2-3, per non saturare context)
2. Aprire la chat con il prompt di setup standard (vedi §4)
3. Lavorare

### 3.2 Fine sessione

**Sempre, anche per modifiche piccole:**

1. Produrre il nuovo `HANDOVER_<...>_<data>.md` seguendo la struttura §2.1
2. Aggiornare `CHANGELOG_<progetto>.md`:
   - Modificare la tabella STATO CORRENTE con le nuove versioni
   - Appendere nuova voce in cima allo STORICO SESSIONI (3-5 righe)
3. Committare entrambi su Git
4. Sostituire/aggiungere i file nella Knowledge Base del progetto Claude

**Tempo stimato:** 5-10 min totali a sessione.

---

## 4. PROMPT DI SETUP STANDARD

Da usare all'inizio di **ogni** chat di lavoro su un progetto già avviato. Incolla questo blocco insieme alla prima richiesta:

```
Ruolo: assistente tecnico esperto e sintetico.
Contesto: hai accesso ai documenti caricati nella Knowledge Base di questo progetto. Usali come fonte primaria di verità. Il CHANGELOG.md riporta lo stato corrente e la sintesi delle sessioni. Gli HANDOVER_*.md contengono il dettaglio operativo per sessione.
Regole di efficienza:
- Sintesi: rispondi diretto, niente preamboli ("Certamente", "Sulla base dei documenti...").
- No ripetizioni: non rigenerare codice/testo già fornito a meno che non venga richiesta una modifica. Mostra solo i frammenti variati.
- Formattazione: tabelle o liste puntate per dati complessi.
- Riferimenti: cita brevemente il file ([CHANGELOG.md], [HANDOVER_...md]).
Regola operativa fissa: ogni file consegnato per il deploy deve avere la versione aggiornata (formato v YYYY.MM.DD.NN, sia in header sia in footer/UI quando applicabile). Comunicare esplicitamente la nuova versione quando si presenta il file. Riportare questa regola in ogni futuro handover.
A fine sessione: produrre HANDOVER_<...>_<data>.md + aggiornamento CHANGELOG seguendo lo schema del progetto.
```

---

## 5. SETUP NUOVO PROGETTO (giorno 0)

All'avvio di un progetto nuovo che si prevede multi-sessione:

1. Creare repo Git (o sottocartella `docs/` in repo esistente)
2. Creare `CHANGELOG_<progetto>.md` minimale:
   ```markdown
   # CHANGELOG — <Progetto>
   
   ## STATO CORRENTE
   (vuoto, primo deploy)
   
   ## STORICO SESSIONI
   (nessuna sessione ancora)
   ```
3. Creare progetto Claude, caricare il CHANGELOG nella KB
4. Memorizzare il prompt di setup §4 nelle "user preferences" o nella descrizione progetto Claude
5. **Memorizzare la regola operativa di versionamento** come memoria persistente

---

## 6. REGOLA OPERATIVA FISSA — versionamento file

> **Ogni file consegnato per il deploy in repo deve avere la versione aggiornata** (formato `v YYYY.MM.DD.NN`, sia in header sia in footer/UI quando applicabile). **La nuova versione va comunicata esplicitamente all'utente quando si presenta il file.** Questa regola va riportata in ogni handover.

Formato versione:
- `YYYY` = anno (4 cifre)
- `MM` = mese (2 cifre)
- `DD` = giorno (2 cifre)
- `NN` = progressivo nella giornata (2 cifre, da `01`)

Esempi: `v 2026.05.13.01`, `v 2026.05.13.02`, `v 2026.05.14.01`

---

## 7. RECOVERY — se manca qualcosa

| Cosa manca | Procedura di recupero |
|---|---|
| Un singolo HANDOVER dalla KB Claude | Recupero da Git → ricarica in KB |
| Il CHANGELOG | Recupero da Git |
| L'intera KB Claude svuotata | Ricaricare CHANGELOG + ultimi 2-3 HANDOVER da Git |
| Anche Git compromesso (raro) | Chiedere a Claude di ricostruire l'handover mancante usando `conversation_search` sulle chat passate del progetto — vedi §7.1 |

### 7.1 Procedura di ricostruzione da chat passate

In caso estremo (handover perso, no Git backup):

1. Aprire chat nel progetto Claude
2. Prompt: *"Cerca le conversazioni del progetto avvenute in data <YYYY-MM-DD> e ricostruisci l'handover di quella sessione seguendo lo schema standard. Dichiara esplicitamente in testa al file che si tratta di una ricostruzione e indica il grado di fedeltà stimato."*
3. Claude usa `conversation_search` o `recent_chats` per recuperare i log
4. Aggiungere nota di provenienza in testa al file ricostruito
5. Salvare su Git per consolidare

⚠️ La ricostruzione raggiunge tipicamente il 90-95% di fedeltà. Per non scendere sotto questa soglia, **non far passare più di 30 giorni** tra evento e ricostruzione (le chat antiche possono uscire dall'indice di ricerca conversazioni).

---

## 8. ANTI-PATTERN — cosa NON fare

| Anti-pattern | Perché è dannoso |
|---|---|
| Un unico documento cumulativo che cresce ad ogni sessione | Rischio di errori di trascrizione silenziosi ad ogni rigenerazione; cresce esponenzialmente. |
| Stato corrente riscritto ogni volta cancellando lo storico | Perde la storia delle decisioni — non sai più PERCHÉ qualcosa è stato fatto così. |
| Solo HANDOVER, no CHANGELOG | Se un handover si perde, buco non rilevabile né recuperabile in sintesi. |
| Solo CHANGELOG, no HANDOVER | Sintesi insufficiente per riprendere il lavoro con cognizione di causa. |
| Documenti SOLO nella KB Claude, mai su Git | Single point of failure dimostrato. |
| Handover senza versione/data nel nome | Catena cronologica illeggibile dopo 5+ sessioni. |
| Riportare nei nuovi handover anche i dettagli dei vecchi | Duplicazione che divergerà nel tempo, creando contraddizioni. |

---

## 9. CHECKLIST OPERATIVA (da stampare/tenere a vista)

**Inizio sessione:**
- [ ] CHANGELOG e ultimo HANDOVER caricati in KB Claude
- [ ] Prompt di setup incollato

**Fine sessione:**
- [ ] HANDOVER nuovo prodotto e validato
- [ ] CHANGELOG aggiornato (tabella STATO CORRENTE + nuova voce in cima a STORICO)
- [ ] Commit Git con messaggio `docs: handover YYYY-MM-DD`
- [ ] File nuovi/aggiornati caricati nella KB Claude
- [ ] Versione dichiarata all'utente nell'output dei file deploy

---

**Fine documento.**
