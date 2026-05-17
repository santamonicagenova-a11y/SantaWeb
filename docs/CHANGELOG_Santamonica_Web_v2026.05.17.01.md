# CHANGELOG — Santamonica Web

**Versione documento:** v 2026.05.17.01

---

## STATO CORRENTE

### File deploy (live)

| Componente | Versione | Hosting | Ultimo aggiornamento |
|---|---|---|---|
| `index.html` | v 2026.05.09.07 | GitHub Pages | 2026-05-09 |
| `menu-admin.html` | v 2026.05.14.01 | Vercel | 2026-05-14 |
| `admin-core.js` | v 2026.05.14.02 | Vercel | 2026-05-14 |
| `admin-templates-shared.js` | v 2026.05.14.02 | Vercel | 2026-05-14 |
| `foto-optimizer.js` | v 2026.05.09.02 | Vercel | 2026-05-09 |
| `api/translate.js` (legacy) | v 2026.05.14.01 | Vercel | 2026-05-14 |
| **`functions/api/translate.js`** | **v 2026.05.17.02** | **Cloudflare Pages** | **2026-05-17** |
| `translations.json` | 96 chiavi × 5 lingue | GitHub Pages | 2026-05-14 |
| `menu.html` · `menu-{it,en,fr,de,es}.html` | rigenerati 14-05 | GitHub Pages | 2026-05-14 |
| `menu-allergeni.html` · `menu-vini.html` · `menu-dolci-it.html` · `orario.html` | — | GitHub Pages | < 2026-05-02 |

### File repo (pronti, non pubblicati live)

| File | Versione | Stato |
|---|---|---|
| `privacy.html` | v 2026.05.16.02 | Pronto · pubblicazione decisione operativa aperta (F0.8 sospesa) |
| `cookies.html` | v 2026.05.16.02 | Pronto · idem |

### Ambienti

| Ambiente | URL | Stato |
|---|---|---|
| **Production live** | `santamonicagenova.it` (Wix) | da dismettere in F0.21 |
| **Mirror GitHub Pages** | `santamonicagenova-a11y.github.io/SantaWeb` | live, sostituito da Cloudflare in F0.21 |
| **Admin Vercel** | `santa-web-peach.vercel.app/menu-admin.html` | live, sostituito da Cloudflare in F0.21 |
| **Staging Cloudflare Pages (NUOVO)** | `santamonica-web.pages.dev` | live 2026-05-17 |
| **Staging dominio custom** | `nuovo.santamonicagenova.it` | da creare in F0.3 |
| **Production target finale** | `santamonicagenova.it` (Cloudflare Pages) | F0.21 |

### Servizi esterni

| Servizio | Stato | Env var Cloudflare | Setup data |
|---|---|---|---|
| Cloudflare account | ✅ attivo + 2FA TOTP | — | 2026-05-17 |
| Cloudflare Pages project | ✅ deployato | `DEEPL_KEY` | 2026-05-17 |
| Cloudflare Email Routing | ⏳ F0.3bis | — | — |
| Brevo (newsletter) | ⏳ F0.15 | `BREVO_API_KEY` | — |
| Google Places API | ⏳ F1.2 | `GOOGLE_PLACES_API_KEY` | — |
| Stripe | ⏳ F0.13 | — | — |
| DeepL Free | ✅ attivo (Vercel + Cloudflare) | `DEEPL_KEY` | 2026-05-14 / 2026-05-17 |
| Formspree | ✅ attivo | endpoint `mkopjnvq` | < 2026-05-09 |
| GitHub PAT classic | ✅ attivo (localStorage admin) | — | < 2026-05-02 |
| GitHub PAT fine-grained | ⏳ F0.7 | — | — |
| HMAC salt | ✅ generato 2026-05-17 (Bitwarden) · injection Cloudflare in F0.15 | `CONSENT_HMAC_SALT` | 2026-05-17 |

### Convenzioni progetto (riferimento rapido)

| Aspetto | Convenzione |
|---|---|
| Versioning file | `v YYYY.MM.DD.NN` (header + footer/UI visibile dove applicabile) |
| Naming continuità | `NOMEFILE_vYYYY.MM.DD.NN.ext` |
| Naming deploy | NO versione nel nome · versione in header + footer/UI |
| Release | Sostituzione completa · vecchio rimosso da KB · storico in Git |
| Lingue | IT/FR/EN (DE/ES tagliate in F0.4 imminente) |
| Foto WebP | quality 0.90 full (1920-2400px) / 0.82 thumb (800px) |
| Galleria | 6 slot, schema `{src, srcThumb, alt}` |
| Foto sito | 4 chiavi: hero · cucina_piatto · cucina_ingredienti · cantina |
| Endpoint Formspree | `mkopjnvq` (discriminator `tipo`) |
| Motore traduzione | DeepL via Cloudflare Pages Function (staging) + Vercel proxy (live, fino a F0.21) |
| Propagazione Cloudflare Pages | 30-60 sec post-commit |
| Propagazione GitHub Pages | 60-90 sec |
| Propagazione Vercel | 30-60 sec |

---

## STORICO SESSIONI

> Voci ordinate dal più recente al più vecchio. Appendere in cima a ogni sessione.

---

### 2026-05-17 — F0.0 + F0.1 + F0.2 chiuse · Cloudflare Pages live · F0.8 sospesa
**Versioni rilasciate:** `functions/api/translate.js` v 2026.05.17.02 (NUOVO), `.gitignore` aggiornato

**Sintesi:**
- F0.0 parziale: HMAC salt 256-bit generato e salvato in Bitwarden · `.gitignore` arricchito con sezione secrets/env/editor · rendering repo privato rimandato post-F0.21 (GitHub Pages free tier richiede repo pubblico)
- F0.1: account Cloudflare creato + 2FA TOTP + recovery codes · progetto Pages `santamonica-web` deployato dopo deviazione iniziale Workers (UI unificata Cloudflare 2025-2026 default su Workers anziché Pages, risolto con URL diretto `/pages/new/provider/github`)
- F0.2: porting `api/translate.js` Vercel → `functions/api/translate.js` Cloudflare Pages Function · 4 cambi paradigma (Fetch API, `await request.json()`, `new Response()`, `context.env.X`) · CORS allowlist estesa · function testata via fetch console con successo
- F0.8 sospesa a tempo indeterminato (decisione utente): impatti su F0.9, F2.2, go-live privacy documentati in handover come "decisioni operative aperte" da confermare
- Pulizia: 2 Workers di test (`santamonica-web`, `santaweb`) eliminati · eventuale `wrangler.toml` residuo PR#2 verificato/rimosso

**Handover dettagliato:** `HANDOVER_Santamonica_Web_v2026.05.17.01.md`

---

### 2026-05-16 — F0.7bis chiusa · stesura privacy.html + cookies.html IT (DIY)
**Versioni rilasciate:** `privacy.html` v 2026.05.16.02, `cookies.html` v 2026.05.16.02 (entrambi NUOVI, non ancora pubblicati live)

**Sintesi:**
- Stesura DIY privacy IT (14 sezioni, 2.870 parole) + cookie IT (7 sezioni, 1.486 parole) basate su schema bozza v3 con 29 punti miglioramento integrati
- Metodologia "3 passate critiche" applicata: formale → sostanziale GDPR/cookie law → autocritica · 21 correzioni totali documentate
- Decisioni operative consolidate nel testo: titolare Il Giuliano S.a.s., DPO non designato, allergie Art. 9(2)(a) retention 48h, HMAC audit log, voucher destinatario Art. 14 GDPR, termini DSAR 1+2 mesi, minori 14 anni, Cloudflare prima parte, cookie wall esplicitamente assente
- File pronti per F0.8 (revisione legale esterna) — POI SOSPESA il 17-05

**Handover dettagliato:** `HANDOVER_Santamonica_Web_v2026.05.16.01.md`

---

### 2026-05-15 (sera) — bozze privacy v3 + ROADMAP v.06 + dati titolare
**Versioni rilasciate:** `ROADMAP_Santamonica_Web_v2026.05.15.06.md` (ora superseded da v.07 del 17-05)

**Sintesi:**
- Schema bozza privacy v3 con 29 punti miglioramento dopo 3 passate analisi critica
- ROADMAP v.06 consolidata con: switch hosting Vercel→Cloudflare, gift cards Stripe Payment Links manuali, Iubenda Pro→Advanced→DIY, dati titolare integrati (S.a.s. + sede legale + PEC)
- Costi 12 mesi consolidati: anno 1 ~565-915€ una tantum, anni successivi ~65€/anno
- Nuovi item F0.0 (HMAC salt + repo privato), F0.3bis (Email Routing), F0.7bis (stesura privacy DIY), F0.8 (revisione legale)

**Handover dettagliato:** `HANDOVER_Santamonica_Web_v2026.05.15.06.md`

---

### 2026-05-15 (pomeriggio) — feature "Documento generico" admin
**Versioni rilasciate:** `menu-admin.html` v 2026.05.15.01, `admin-core.js` v 2026.05.15.04 (NON pushate)

**Sintesi:**
- Nuova feature admin: caricamento PDF/DOCX/TXT → conversione HTML stile carta → preview standalone
- 9 funzioni JS nuove · lazy load PDF.js + Mammoth da cdnjs · template autosufficiente con regex su CARTA_TPL_B
- Toolbar preview: stampa · download HTML · 4 toggle allineamento + centratura verticale
- Status: completata lato codice in 4 iterazioni · NON ancora testata né pushata

**Handover dettagliato:** `HANDOVER_Santamonica_Web_v2026.05.15.02.md`

---

### 2026-05-15 (mattina) — pianificazione strategica + revisione metodo continuità
**Versioni rilasciate:** `ROADMAP_Santamonica_Web_v2026.05.15.02.md` (superseded), `METODO_Continuita_Progetti_v2026.05.15.01.md` (regola versioning v2)

**Sintesi:**
- Sessione pianificazione strategica completa, zero deploy codice
- 40 decisioni strategiche consolidate (A1-A9, T1-T9, D1-D4) · piano operativo 12 mesi
- Regola versioning v2: estesa a documenti continuità con naming file `NOMEFILE_vYYYY.MM.DD.NN.ext`
- KB normalizzata: 7 documenti storici rinominati retroattivamente con versione

**Handover dettagliato:** `HANDOVER_Santamonica_Web_v2026.05.15.01.md`

---

### 2026-05-14 — Proxy DeepL Vercel + fix link menu + inversione menu.html/menu-it.html + descrizioni piatti
**Versioni rilasciate:** `api/translate.js` v 2026.05.14.01 (NUOVO), `admin-core.js` v 2026.05.14.02, `admin-templates-shared.js` v 2026.05.14.02, `menu-admin.html` v 2026.05.14.01, `translations.json` (8 righe modificate)

**Sintesi:**
- Problema 1 (CORS DeepL): proxy Vercel Serverless Function `api/translate.js` con chiave server-side · counter falliti + report
- Problema 2 (link menu lingua): fix 8 righe `translations.json` per puntare a `menu-{lang}.html` corretti
- Problema 3 (inversione menu.html/menu-it.html): pubblico no-ctrl-bar SEO ↔ admin con ctrl-bar noindex · 3 helper SEO
- Problema 4 (descrizioni piatti): CSS `.piatto-desc` 70% + `.percorso-desc` nuova · `buildDegu` renderizza descrizione percorso

**Setup esterno:** env variable `DEEPL_KEY` configurata su Vercel

**Handover dettagliato:** `HANDOVER_Santamonica_Web_v2026.05.14.01.md`

---

### 2026-05-13 — Font +50% in stampa preview menù
**Versioni rilasciate:** `admin-templates-shared.js` v 2026.05.13.01

**Sintesi:**
- Aggiunta regola `html { font-size: 24px; }` nel blocco `@media print` del template `CARTA_TPL_B`
- Scala uniforme 50% di tutti i testi stampa carta+orario sfruttando `rem` relativi al root
- Layout `mm` invariato · preview a schermo inalterata · NON tocca altri template

**Handover dettagliato:** `HANDOVER_Santamonica_Web_v2026.05.13.01.md`

---

### 2026-05-09 (pomeriggio) — refactor form prenotazione + footer
**Versioni rilasciate:** `index.html` v 2026.05.09.07, `translations.json` (7 chiavi modificate + 4 nuove × 5 lingue = 96/lingua)

**Sintesi:**
- Form prenotazione unico (rimosso modal contatti separato) · campo email aggiunto · validazione tel||email · intolleranze required · asterisco automatico · footer grid responsive
- Placeholder/hint i18n estesi · 4 nuove chiavi traduzione

**Handover dettagliato:** `HANDOVER_Santamonica_Web_v2026.05.09.02.md`

---

### 2026-05-09 (mattina) — DeepL integration + foto sito/galleria optimizer
**Versioni rilasciate:** `menu-admin.html` v 2026.05.09.03, `foto-optimizer.js` v 2026.05.09.02, `admin-core.js` (DeepL integration)

**Sintesi:**
- Sostituzione Google Translate → DeepL Free (CORS poi fallito, fix il 14-05 con proxy Vercel)
- Modal `#modal-deepl` in admin top-bar · chiave in `localStorage['deepl_key']` formato `...:fx`
- foto-optimizer.js: refactor compressione WebP per foto sito (4 chiavi semantiche) + galleria (6 slot)

**Handover dettagliato:** `HANDOVER_Santamonica_Web_v2026.05.09.01.md`

---

### 2026-05-02 — Modifiche grafiche menu-it.html
**Versioni rilasciate:** menu-it.html (modifiche grafiche)

**Sintesi:**
- Follow-up post-fix BUG 2+4 del 28 aprile
- 1 maggio: rimozione simboli € dai prezzi · 2 maggio: modifiche grafiche menu-it.html
- Status produzione stabile dichiarato

**Handover dettagliato:** `HANDOVER_FINALE_SantaWeb_v2026.05.02.01.md`

---

**Fine CHANGELOG · v 2026.05.17.01**
