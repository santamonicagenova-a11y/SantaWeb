# HANDOVER — Santamonica Web · Sessione rianalisi critica + ROADMAP v.03
**Versione:** v 2026.05.15.03
**Data:** 2026-05-15
**Tipo:** Pianificazione + rianalisi critica (non deploy codice)
**Continuazione di:** `HANDOVER_Santamonica_Web_v2026.05.15.01.md`
**Sessione parallela non correlata:** `HANDOVER_Santamonica_Web_v2026.05.15.02.md` (feature "Documento generico" — codice non ancora pushato)

---

## 1. STATO ATTUALE

Sessione di **rianalisi critica della ROADMAP** prodotta in mattinata (v.02). Identificati 23 punti critici tra errori tecnici, architetturali, di compliance e sicurezza. Output: nuova ROADMAP **v 2026.05.15.03** con ristrutturazione fasi, decisioni architetturali rivisti, e foundation tecnica anticipata in FASE 0.

**Zero deploy codice sito/admin in questa sessione.**

### File prodotti questa sessione

| File | Tipo | Status |
|---|---|---|
| `ROADMAP_Santamonica_Web_v2026.05.15.03.md` | Roadmap consolidata rev. critica (sostituisce v.02) | ✅ consegnato |
| `HANDOVER_Santamonica_Web_v2026.05.15.03.md` | Questo file | ✅ consegnato |

### Codice sito/admin: invariato dal 14-05

Vedi `HANDOVER_Santamonica_Web_v2026.05.15.01.md` §1 per la lista versioni file deploy (nessun cambio).

> ⚠️ Pendenti dalla sessione parallela v.15.02: `menu-admin.html` v 2026.05.15.01 + `admin-core.js` v 2026.05.15.04 (feature Documento generico) **non ancora testati né pushati** dall'utente.

---

## 2. DATI CHIAVE — output della rianalisi critica

### 2.1 Criticità identificate per categoria

| Categoria | N° punti | Severità prevalente |
|---|---|---|
| Architettura tecnica | 11 | Alta (doppio switch DNS, debito tecnico stratificato, webhook timeout, vendor lock-in) |
| Compliance legale | 4 | Media-alta (GDPR Art. 12, recesso voucher, Iubenda multilingua) |
| Sicurezza / robustezza | 3 | Alta (rate limiting assente, no DR, no monitoring) |
| Decisioni operative | 5 | Bassa-media (taglio distruttivo, lib abbandonate, hreflang) |

Dettaglio completo: vedi messaggio rianalisi nella sessione + Appendice A della nuova ROADMAP.

### 2.2 Modifiche strutturali ROADMAP (v.02 → v.03)

| Modifica | Direzione |
|---|---|
| Migrazione Vercel | F2.4 (ott) → **F0.1 (giu)** |
| Refactor JSON menu | F4.1 (feb 2027) → **F0.3 (giu 2026)** |
| Redirect 301 Wix | Problematico su GH Pages → **nativo via `vercel.json`** |
| Privacy/Cookie | Solo IT → **IT + FR + EN** |
| Piano Iubenda | Essential ~15€ → **Pro ~27€** multilingua |
| Monitoring (Sentry + UptimeRobot) | Assente → **NUOVO F0.16** |
| Backup auto (GitHub Action) | Assente → **NUOVO F0.17** |
| hreflang sitemap | Assente → **NUOVO F0.15** |
| DB gift cards | Vercel KV → **Neon Postgres free** |
| Webhook Stripe | Sync → **async (200 immediato + cron processor)** |
| Codice voucher | `SM-YYYY-XXXX` (4 char) → **`SM-2026-XXXXXXXXXX`** (10 char crypto.randomBytes base32) |
| Cache traduzioni | "No-TTL" → **hash content-addressable** `sha256(text+lang)` |
| Reviews Google | Doppio sistema (KV + cron) → **solo cron** + `reviews.json` statico + attribution obbligatoria |
| Umami DB | Vercel Postgres free (256MB insufficiente) → **Umami Cloud free** o Neon free 3GB |
| Video hero target | <3MB irrealistico → **AV1 ≤4MB / H.265 ≤6MB / H.264 ≤9MB** |
| Galleria | Macy.js (abbandonato 2019) → **CSS `column-count`** |
| Rate limiting | Assente → **Upstash Ratelimit free** su tutti endpoint pubblici |
| Privacy Policy testo | "Riuso Wix" → **Iubenda Privacy Generator ex-novo** |
| Recesso voucher | Ambiguo (T6 vs T8) → **chiarito**: solo acquirente, 14gg dall'acquisto, solo se non riscattato (Art. 16 dir. 2011/83/UE) |
| Newsletter submit | "Doppia chiamata" → **best-effort post-Formspree** |

### 2.3 Sforzo rivisto

| Fase | v.02 | v.03 | Delta |
|---|---|---|---|
| F0 | 8-10 sessioni | 11-13 | **+3** |
| F1 | 8-10 | 8-10 | = |
| F2 | 10-12 | 10-12 | = |
| F3 | 2-3 | 2-3 | = |
| F4 | 5-6 | 3-4 | **−2** |
| **Totale** | 33-41 | 34-42 | ≈ stesso |

Beneficio netto: debito tecnico azzerato pre-Stripe, stack production-grade da subito.

### 2.4 Servizi free tier aggiunti vs v.02

| Servizio | Free tier | Ruolo | Fase setup |
|---|---|---|---|
| Neon Postgres | 3GB · branching | DB voucher + cache traduzioni hash + opzionale Umami | F0.3 / F2.3 |
| Upstash Ratelimit | 10k req/giorno | Rate limit `api/newsletter`, `api/reviews`, `api/giftcard-checkout` | F0.13 |
| Sentry | 5k events/mese | Error tracking runtime (functions + frontend admin) | F0.16 |
| UptimeRobot | 50 monitor · 5 min | Uptime sito + endpoint API critici | F0.16 |
| Umami Cloud | 10k events/mese | Analytics (alternativa raccomandata vs self-host) | F1.7 |

### 2.5 Costi 12 mesi consolidati

| Voce | Tipo | Importo |
|---|---|---|
| Iubenda Pro multilingua | Ricorrente annuo | ~27€ |
| Aruba dominio | Ricorrente annuo | ~15€ |
| Revisione FR + EN | Una tantum | ~250-400€ |
| Stripe transazioni | Variabile | 1.5% + 0.25€/transazione |
| Tutto il resto | Free tier | **0€** |

Ricorrenti mensili: 0€. Annui ricorrenti: ~42€.

---

## 3. CONTESTO ESSENZIALE

### 3.1 Regola versioning progetto Santamonica Web

> Ogni file ha versione `v YYYY.MM.DD.NN` in **header + footer/UI**. Vale per file deploy (HTML/JS/CSS/JSON) e documenti di continuità (handover/roadmap/changelog/manuali). SOLO documenti di continuità (non deploy): versione anche nel **nome file** `NOMEFILE_vYYYY.MM.DD.NN.ext`. Release = sostituzione (vecchio rimosso). Comunicare versione. **Riportare questa regola in ogni documento di continuità per propagarla.**

### 3.2 Stack & ambiente attuale

- Repo: `github.com/santamonicagenova-a11y/SantaWeb`
- Admin Vercel: `https://santa-web-peach.vercel.app/menu-admin.html`
- Sito attuale: GitHub Pages (post-F0.1 migrerà a Vercel)
- Sito live finale (post-F0.19): `santamonicagenova.it` su Vercel
- Rebuild Vercel ~30-60s
- Hard refresh richiesto: Cmd+Shift+R / Ctrl+F5

### 3.3 File di continuità correnti nella KB

| File | Ruolo |
|---|---|
| `ROADMAP_Santamonica_Web_v2026.05.15.03.md` | **NUOVO** · piano 12 mesi rev. critica |
| `METODO_Continuita_Progetti_v2026.05.15.01.md` | Metodologia · regola versioning v2 |
| `CHANGELOG_Santamonica_Web_v2026.05.14.01.md` | Storico sessioni |
| `HANDOVER_FINALE_SantaWeb_v2026.05.02.01.md` | Storico |
| `HANDOVER_Santamonica_Web_v2026.05.09.01.md` | Storico |
| `HANDOVER_Santamonica_Web_v2026.05.09.02.md` | Storico |
| `HANDOVER_Santamonica_Web_v2026.05.13.01.md` | Storico |
| `HANDOVER_Santamonica_Web_v2026.05.14.01.md` | Ultimo stato codice deploy |
| `HANDOVER_Santamonica_Web_v2026.05.15.01.md` | Sessione planning strategico (predecessore) |
| `HANDOVER_Santamonica_Web_v2026.05.15.02.md` | Sessione codice feature "Documento generico" (parallela) |
| `HANDOVER_Santamonica_Web_v2026.05.15.03.md` | **NUOVO** · questo file |

---

## 4. PROSSIMI PASSI

### 4.1 KB cleanup (azione immediata utente, prima della prossima sessione)

Sostituire nella Knowledge Base del Progetto Claude:

| Rimuovere | Aggiungere |
|---|---|
| `ROADMAP_Santamonica_Web_v2026.05.15.02.md` | `ROADMAP_Santamonica_Web_v2026.05.15.03.md` |
| — | `HANDOVER_Santamonica_Web_v2026.05.15.03.md` (questo file) |

`HANDOVER_Santamonica_Web_v2026.05.15.01.md` **resta in KB** come riferimento storico delle decisioni A/B/C/D/T1-T9 (è la fonte di verità delle scelte strategiche di prodotto, non sostituite dalla rianalisi).

### 4.2 Decisioni operative ancora aperte (da chiarire all'inizio FASE 0)

| # | Decisione | Note |
|---|---|---|
| 1 | T5 UX exact: checkbox "Il destinatario può aggiungere extra" vs voucher all-inclusive with cap | Definire in design pagina `/regala.html` (FASE 2) |
| 2 | Frequenza pubblicazione newsletter Brevo | Editoriale tua · 1-2 email/mese suggerito · non bloccante |
| 3 | Foto OG signature per homepage (`og-home.jpg`) | Scegliere/scattare · può attendere FASE 1 |
| 4 | Partner traduttore FR + EN (Proz, Upwork, Genova) | Cercare in agosto 2026 prima di FASE 2 |
| 5 | Place ID Google Maps Santamonica | Necessario per F0.10 e F1.2 |
| 6 | Pannello mobile riscatto voucher | Decisione accoppiata a A7 · nov-dic 2026 |
| 7 | **NUOVO** Umami Cloud vs self-host (F1.7) | Default raccomandato: Cloud free · self-host solo se quota 10k events/mese superata |
| 8 | **NUOVO** Project Vercel: stesso `santa-web-peach` o nuovo per sito? | Raccomandato: stesso project, root sito + `/api/*` + admin sotto stesso dominio finale |

### 4.3 Avvio FASE 0 — sequenza task suggerita

Riferimento dettaglio: `ROADMAP_Santamonica_Web_v2026.05.15.03.md` §1.

**Settimana 1:**

| Task | Sforzo | Pre-requisiti utente |
|---|---|---|
| F0.1 Migrazione sito → Vercel | M | Decisione 8 sopra |
| F0.2 Subdomain staging `nuovo.santamonicagenova.it` | S | Accesso pannello Aruba |
| F0.3 Refactor JSON menu (parte 1: estrazione `menu-data.json`) | M (parte 1 di 2) | — |

**Settimana 2:**

| Task | Sforzo | Pre-requisiti utente |
|---|---|---|
| F0.3 Refactor JSON menu (parte 2: renderer + admin) | M (parte 2 di 2) | — |
| F0.4 Taglio DE+ES + archivio branch `legacy/de-es` | M | — |
| F0.5 Cleanup admin-templates.js legacy | XS | — |
| F0.6 Fine-grained PAT GitHub | XS | Accesso GitHub settings |

**Settimana 3:**

| Task | Sforzo | Pre-requisiti utente |
|---|---|---|
| F0.7 Privacy/Cookie IT+FR+EN (Iubenda Generator) | M | Account Iubenda Pro creato |
| F0.8 Setup Iubenda Pro multilingua | S | ~27€ |
| F0.9 Schema.org Restaurant | M | Dati ristorante (vedi sotto §4.4) |
| F0.10 Dove siamo + Maps embed | M | Dati indirizzo + Place ID |
| F0.11 Pagina cantina.html | M | Testo + 4-6 foto |
| F0.12 Pagina regala.html (info) | S | Testo voucher |

**Settimana 4:**

| Task | Sforzo | Pre-requisiti utente |
|---|---|---|
| F0.13 Newsletter Brevo opt-in (+ Upstash) | M | API key Brevo + account Upstash |
| F0.14 Redirect 301 via `vercel.json` | S | — |
| F0.15 Sitemap + hreflang | XS | — |
| F0.16 Sentry + UptimeRobot | S | Account Sentry + UptimeRobot |
| F0.17 Backup GitHub Action settimanale | S | — |
| F0.18 Test E2E | M | — |
| F0.19 🚀 Switch DNS finale | S | Accesso pannello Aruba |

### 4.4 Dati da raccogliere per FASE 0 (azione utente)

- Indirizzo completo ristorante
- Coordinate GPS (lat/lng)
- Telefono internazionale (es. `+39 010 ...`)
- Orari apertura giorno per giorno (lunedì chiuso? pranzo+cena?)
- Cucine servite (Italian, Seafood, Ligurian, Mediterranean)
- Price range (€/€€/€€€/€€€€)
- URL Instagram + Facebook
- **Place ID Google Maps** Santamonica (per F0.10 e F1.2)
- Credenziali pannello Aruba (gestione DNS)
- Account Iubenda Pro da creare (~27€/anno)
- Account Google Cloud Console (per Places API in F1.2)
- Account Sentry da creare (free)
- Account UptimeRobot da creare (free)
- Account Upstash da creare (free)
- Account Neon da creare (free, per F0.3 cache traduzioni e F2.3 voucher)
- Account Stripe da creare (in F2)
- Account Umami Cloud da creare (in F1.7, free)

### 4.5 Sequenza fasi a regime (riferimento)

| Fase | Periodo | Output principale |
|---|---|---|
| F0 | giu 2026 (3-4 settimane) | Vercel live · refactor JSON menu · privacy multilingua · monitoring · backup · redirect 301 · DNS finale |
| F1 | lug-ago 2026 | Eventi · Reviews · video hero · galleria masonry · OG · Umami · srcset foto sito · manuale operativo |
| F2 | set-ott 2026 | Revisione FR+EN · override layer · gift cards Stripe (Neon Postgres + webhook async) · pannello mobile opzionale |
| F3 | nov-dic 2026 | Campagna gift cards · monitoring · gestione riscatti |
| F4 | gen-feb 2027 | admin-vendor.js · cache traduzioni hash · srcset esteso · eventuale build step bump versione |
| F5 | primavera 2027+ | Rivalutazione filosofia stack · TheFork return · pesce del giorno · wine pairing · altre opzioni backlog |

---

## 5. ALLEGATI / RIFERIMENTI

### File chiave per riprendere il lavoro

| File | Scopo |
|---|---|
| `ROADMAP_Santamonica_Web_v2026.05.15.03.md` | **Piano dettagliato 12 mesi rev. critica · sequenza task fase per fase · costi · backlog · Appendice A con tutte le modifiche v.02 → v.03** |
| `HANDOVER_Santamonica_Web_v2026.05.15.01.md` | Decisioni strategiche A/B/C/D + T1-T9 (sorgente di verità prodotto) |
| `METODO_Continuita_Progetti_v2026.05.15.01.md` | Metodologia handover/CHANGELOG/regola versioning |
| `HANDOVER_Santamonica_Web_v2026.05.14.01.md` | Ultimo stato tecnico codice deploy (proxy DeepL, SEO inversione) |
| `CHANGELOG_Santamonica_Web_v2026.05.14.01.md` | Storico sessioni precedenti |
| `HANDOVER_Santamonica_Web_v2026.05.15.03.md` | **Questo file · sessione rianalisi critica** |

### Repo e ambienti

- **GitHub repo:** `github.com/santamonicagenova-a11y/SantaWeb`
- **Admin live:** `https://santa-web-peach.vercel.app/menu-admin.html`
- **Sito staging** (post-F0.2): `https://nuovo.santamonicagenova.it`
- **Sito live attuale** (Wix, da dismettere): `https://www.santamonicagenova.it`
- **Sito live finale** (post-F0.19): `https://santamonicagenova.it` (su Vercel)

### Branch utilizzati / da creare

| Branch | Stato | Ruolo |
|---|---|---|
| `main` | attivo | Deploy produzione |
| `legacy/de-es` | **da creare in F0.4** | Archivio lingue tagliate |
| `backups/YYYY-WW` | **da creare in F0.17** (auto) | Backup settimanale dati JSON + Brevo CSV |

---

**Fine handover · v 2026.05.15.03**
