# HANDOVER — Santamonica Web

**Versione documento:** v 2026.05.17.01
**Data:** 2026-05-17
**Continuazione di:** `HANDOVER_Santamonica_Web_v2026.05.16.01.md`
**Sessione:** chiusura F0.0 (parziale) + F0.1 + F0.2 — switch hosting Cloudflare Pages live · sospensione F0.8

---

## 1. STATO ATTUALE

### 1.1 File prodotti questa sessione

| File | Versione | Destinazione | Status |
|---|---|---|---|
| `functions/api/translate.js` | v 2026.05.17.02 | Cloudflare Pages (auto-detect Functions) | ✅ live su `santamonica-web.pages.dev/api/translate` |
| `.gitignore` | — | repo root | ✅ committato |
| `HANDOVER_Santamonica_Web_v2026.05.17.01.md` | v 2026.05.17.01 | KB Claude + Git docs | ✅ questo file |
| `CHANGELOG_Santamonica_Web_v2026.05.17.01.md` | v 2026.05.17.01 | KB Claude + Git docs | ✅ bump |
| `ROADMAP_Santamonica_Web_v2026.05.17.01.md` | v 2026.05.17.01 | KB Claude + Git docs | ✅ bump v.07 |

### 1.2 Sintesi

Sessione operativa di esecuzione FASE 0. Chiuse 3 milestone bloccanti:

- **F0.0 (parziale)**: HMAC salt 256-bit generato (`openssl rand -hex 32`) e salvato in Bitwarden come `Santamonica · CONSENT_HMAC_SALT`. `.gitignore` arricchito con sezione secrets/env/editor. **Rendering repo privato rimandato** post-F0.1 per evitare break GitHub Pages su free tier (Pages su repo privati richiede GitHub Pro).
- **F0.1**: account Cloudflare creato (email `santamonicagenova@gmail.com`) + 2FA TOTP attiva + recovery codes salvati. Progetto Pages `santamonica-web` deployato con successo dopo deviazione iniziale (Cloudflare UI unificata ha guidato verso flusso Workers; risolto con URL diretto `dash.cloudflare.com/<account>/pages/new/provider/github`).
- **F0.2**: porting `api/translate.js` (Vercel handler) → `functions/api/translate.js` (Cloudflare `onRequest` paradigma). 4 cambi paradigma applicati (Web Standards Fetch API, `await request.json()`, `new Response()`, `context.env.X`). CORS allowlist estesa con `santamonica-web.pages.dev` + `nuovo.santamonicagenova.it`. Function live e testata con successo via fetch console.

**Sospensione strategica:** utente ha sospeso F0.8 (revisione legale privacy+cookies) a tempo indeterminato. Impatti a cascata documentati (vedi §2.4) e proposte operative in attesa di conferma.

---

## 2. DATI CHIAVE — modifiche consolidate

### 2.1 `functions/api/translate.js` v 2026.05.17.02 (NUOVO)

**Path repo:** `functions/api/translate.js` (cartella nuova `functions/api/` in root).

**Funzionalità:** identica a `api/translate.js` Vercel v 2026.05.14.01 (proxy DeepL con CORS allowlist), riadattata al runtime Cloudflare Pages Functions.

**Cambi paradigma applicati:**

| Vercel | Cloudflare Pages |
|---|---|
| `export default async function handler(req, res)` | `export async function onRequest(context)` |
| `req.body` (auto-parsed) | `await request.json()` esplicito con try/catch |
| `res.status(N).json({...})` | `new Response(JSON.stringify({...}), { status, headers })` |
| `process.env.DEEPL_KEY` | `context.env.DEEPL_KEY` |
| Cartella `api/` auto-route | Cartella `functions/api/` auto-route |

**CORS allowlist v 2026.05.17.02:**
```javascript
const allowedOrigins = [
  'https://santamonicagenova-a11y.github.io',
  'https://santa-web-peach.vercel.app',
  'https://santamonicagenova.it',
  'https://nuovo.santamonicagenova.it',
  'https://santamonica-web.pages.dev'
];
```

**Test passato (fetch da console):**
```javascript
fetch('https://santamonica-web.pages.dev/api/translate', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({text:'Ciao mondo', target_lang:'EN-GB'}) }).then(r=>r.json()).then(console.log)
// → { translations: [{ detected_source_language: 'IT', text: 'Hello world' }] }
```

**Vecchio `api/translate.js` Vercel:** invariato, resta live a servire l'admin Vercel fino a F0.21 (switch DNS finale). Cancellazione Vercel rimandata post-F0.20.

### 2.2 Env variable `DEEPL_KEY` su Cloudflare

Configurata in: Cloudflare dashboard → progetto `santamonica-web` → Impostazioni → Variabili d'ambiente → `DEEPL_KEY` (Production). Valore = chiave DeepL Free `...:fx` (stessa di Vercel, recuperata da Vercel dashboard).

### 2.3 Setup `.gitignore`

Sezione secrets/env aggiunta:
```
.env
.env.local
.env.*.local
.dev.vars
*.secret
*.pem
*.key
.DS_Store
Thumbs.db
.idea/
.vscode/
*.swp
node_modules/
npm-debug.log*
```

### 2.4 Decisione strategica: F0.8 sospesa

**Decisione utente:** revisione legale privacy.html + cookies.html con avvocato sospesa a tempo indeterminato. Possibile ripresa futura non datata.

**Impatti a cascata sulla roadmap originale v.06:**

| Item | Era condizionato a F0.8 | Stato nuovo |
|---|---|---|
| F0.9 (banner vanilla-cookieconsent) | "post-F0.8 approvato" | 🟡 **decisione operativa aperta**: proposta di procedere su DIY v 2026.05.16.02 (banner è tecnico, indipendente dal testo legale) |
| F2.2 (traduzione privacy+cookies FR/EN) | "privacy IT validata legalmente" | 🟡 **decisione operativa aperta**: tradurre comunque la DIY, oppure rimandare con privacy/cookies pubblicate solo in IT |
| F2.6 (update fornitori finalizzati) | F0.8 | 🟡 idem |
| Go-live privacy.html + cookies.html su dominio finale | Implicito post-F0.8 | 🟡 **decisione operativa aperta**: pubblicare DIY con nota interna "non revisionata legalmente" oppure tenere offline |

**Proposta operativa formulata (non confermata):** F0.9 procede su DIY · privacy/cookies pubblicate con nota interna · F2.2 traduzione su DIY in settembre · F0.8 declassata da bloccante a backlog "sospeso". **Richiede conferma utente in prossima sessione.**

### 2.5 Pulizia tentativi deploy errati

Due Workers di test creati per errore durante l'esplorazione UI Cloudflare (UI unificata 2025-2026 default su Workers anziché Pages):

- `santamonica-web` (Workers)
- `santaweb` (Workers)

Entrambi eliminati. Eventuale `wrangler.toml` residuo da merge PR #2 automatica verificato/rimosso dal repo.

---

## 3. CONTESTO ESSENZIALE

### 3.1 Architettura aggiornata post-F0.1b

**Ambiente staging Cloudflare (NUOVO):**
```
santamonica-web.pages.dev  (Cloudflare Pages, auto-deploy da main branch GitHub)
  ├─ tutti i file repo SantaWeb serviti come sito statico
  └─ functions/api/translate.js → /api/translate (Pages Function auto-detect)
       Env: DEEPL_KEY
```

**Ambiente live attuale (invariato):**
- `santamonicagenova.it` → Wix (sito vetrina vecchio, da dismettere in F0.21)
- `santamonicagenova-a11y.github.io/SantaWeb` → GitHub Pages (homepage/menu attuali)
- `santa-web-peach.vercel.app` → Vercel (admin + `api/translate.js` legacy)

**Strategia migrazione (post F0.3 in poi):**
- Cloudflare Pages diventa il nuovo home per tutto (sito + functions)
- Vercel e GitHub Pages restano operativi in parallelo fino a F0.20 (test E2E) → F0.21 (DNS switch)
- Wix dismesso solo dopo F0.21 + monitoring 14gg

### 3.2 File deploy correnti (stato consolidato)

| File | Versione | Hosting |
|---|---|---|
| `index.html` | v 2026.05.09.07 | GitHub Pages |
| `menu-admin.html` | v 2026.05.14.01 | Vercel |
| `admin-core.js` | v 2026.05.14.02 | Vercel |
| `admin-templates-shared.js` | v 2026.05.14.02 | Vercel |
| `foto-optimizer.js` | v 2026.05.09.02 | Vercel |
| `api/translate.js` (Vercel legacy) | v 2026.05.14.01 | Vercel (resta live) |
| **`functions/api/translate.js` (NUOVO)** | **v 2026.05.17.02** | **Cloudflare Pages** |
| `translations.json` | 96 chiavi × 5 lingue | GitHub Pages |
| `menu*.html` (5 lingue) | rigenerati 14-05 | GitHub Pages |
| `privacy.html` | v 2026.05.16.02 | pronto su repo, non pubblicato live |
| `cookies.html` | v 2026.05.16.02 | pronto su repo, non pubblicato live |
| `.gitignore` | — | repo |

### 3.3 Convenzioni progetto (invariate)

| Convenzione | Regola |
|---|---|
| Versionamento | `v YYYY.MM.DD.NN` |
| Naming continuità | `NOMEFILE_vYYYY.MM.DD.NN.ext` |
| Naming deploy | NO versione nel nome · versione in header + footer/UI |
| Release | Sostituzione completa · vecchio rimosso da KB · storico in Git |
| Lingue | IT/FR/EN (DE/ES tagliate in F0.4) |

### 3.4 REGOLA OPERATIVA FISSA (versionamento)

> Ogni file prodotto per il progetto Santamonica/SantaWeb deve avere la versione aggiornata in formato `v YYYY.MM.DD.NN`, sia in header sia in footer/UI quando applicabile. La nuova versione va **comunicata esplicitamente** all'utente quando si presenta il file.
>
> La regola si applica a tutti i file: deploy (HTML/JS/CSS/JSON) e documenti di continuità (handover/changelog/roadmap/manuali).
>
> **Versione anche nel nome** (solo documenti di continuità): `NOMEFILE_vYYYY.MM.DD.NN.ext`. File di deploy NON portano versione nel nome (rompe URL).
>
> **Sostituzione ad ogni release**: file con versione precedente rimosso dalla KB, sostituito dalla nuova versione. Storico in Git.
>
> **Questa regola va riportata in ogni documento di continuità per propagarla.**

### 3.5 Sistema auth/credenziali aggiornato

Nuove voci salvate in Bitwarden questa sessione:

| Record | Contenuto |
|---|---|
| `Santamonica · CONSENT_HMAC_SALT` | salt 256-bit hex per audit log consensi GDPR (uso futuro F0.15) |
| `Cloudflare · Santamonica` | login dashboard Cloudflare |
| `Cloudflare · Santamonica · Recovery Codes` | 8 codici 2FA emergenza |
| `Santamonica · DeepL API Key` (raccomandato se non già presente) | chiave `...:fx` Free tier |

**2FA attiva su:** Cloudflare ✅ (Google, Stripe, GitHub: verificare in sessione separata se non già attivi).

---

## 4. PROSSIMI PASSI

### 4.1 Decisioni operative aperte (sblocco prima della prossima esecuzione)

| # | Decisione | Default proposto | Da confermare |
|---|---|---|---|
| 1 | F0.9 banner cookieconsent: procede su DIY senza attendere F0.8? | SÌ (banner = tecnico) | utente |
| 2 | Go-live `privacy.html` + `cookies.html`: pubblicare con nota interna "non revisionata legalmente"? | SÌ (DIY già conforme schema GDPR) | utente |
| 3 | F2.2 traduzione privacy/cookies FR+EN: tradurre comunque in settembre o rimandare? | TRADURRE su DIY | utente |
| 4 | F0.8 declassata a backlog "sospeso" in ROADMAP v.07? | SÌ | utente (confermato implicitamente, formalizzato in ROADMAP v.07) |

### 4.2 Esecuzione immediata (prossima sessione)

| # | Item | Sforzo | Dipendenze |
|---|---|---|---|
| 1 | F0.3 — CNAME `nuovo.santamonicagenova.it` → `santamonica-web.pages.dev` su Aruba DNS + meta noindex | S | accesso pannello Aruba |
| 2 | F0.3bis — Cloudflare Email Routing → alias `privacy@santamonicagenova.it` → forward `santamonicagenova@gmail.com` | XS (~10 min) | F0.3 (dominio su Cloudflare DNS) |
| 3 | F0.0 (chiusura): rendere repo `SantaWeb` privato | XS | solo dopo F0.21 (switch DNS) per non rompere GitHub Pages free tier |

### 4.3 Esecuzione breve termine (giugno 2026)

Resto FASE 0 — sequenza secondo ROADMAP v.07:
- F0.4 (taglio DE/ES)
- F0.6 (rimozione `admin-templates.js` legacy)
- F0.7 (fine-grained PAT GitHub)
- F0.9 (banner vanilla-cookieconsent, se confermata decisione operativa #1)
- F0.10-F0.15 (Schema.org, cantina, regala, voucher-termini, Stripe links, newsletter Brevo+audit)
- F0.16-F0.18 (redirect 301, sitemap+hreflang, CSP+security)
- F0.19-F0.21 (test E2E + switch DNS finale)

### 4.4 Lavori rimandati / decisioni differite

| Item | Quando | Motivo |
|---|---|---|
| F0.8 revisione legale | indefinito | Decisione utente · ripresa eventuale post-go-live |
| Rendere repo GitHub privato | post-F0.21 | Evitare break GitHub Pages free tier durante migrazione |
| Eliminazione `api/translate.js` Vercel legacy | post-F0.20 (test E2E ok) | Backup di sicurezza per rollback |
| Cancellazione progetto Vercel SantaWeb | post-F0.21 | Backup rollback finestra 14gg |
| 2FA Google/Stripe/GitHub verifica | sessione dedicata | Compliance Art. 32 GDPR già dichiarata in privacy.html |
| Place ID Google Maps | F0.11 (Schema.org) | Ricavabile da URL Google Maps Santamonica |

---

## 5. ALLEGATI / RIFERIMENTI

### 5.1 Catena documenti di continuità (cronologica aggiornata)

1. `HANDOVER_FINALE_SantaWeb_v2026.05.02.01.md`
2. `HANDOVER_Santamonica_Web_v2026.05.09.01.md`
3. `HANDOVER_Santamonica_Web_v2026.05.09.02.md`
4. `HANDOVER_Santamonica_Web_v2026.05.13.01.md`
5. `HANDOVER_Santamonica_Web_v2026.05.14.01.md`
6. `HANDOVER_Santamonica_Web_v2026.05.15.01.md` (strategia)
7. `HANDOVER_Santamonica_Web_v2026.05.15.02.md` (feature doc generico)
8. `HANDOVER_Santamonica_Web_v2026.05.15.06.md` (privacy bozza + roadmap v.06)
9. `HANDOVER_Santamonica_Web_v2026.05.16.01.md` (stesura privacy/cookies)
10. **`HANDOVER_Santamonica_Web_v2026.05.17.01.md` (questo) — F0.0+F0.1+F0.2 chiuse · Cloudflare Pages live · F0.8 sospesa**

### 5.2 File toccati questa sessione

| File | Tipo | Cambio |
|---|---|---|
| `functions/api/translate.js` | deploy | NUOVO · v 2026.05.17.02 |
| `.gitignore` | repo | aggiornato (sezione secrets/env/editor) |

### 5.3 File NON modificati (intatti)

Tutti i file deploy live (admin Vercel + index/menu/translations GitHub Pages + privacy/cookies repo non pubblicate).

### 5.4 Pulizie esterne questa sessione

- Cloudflare Workers `santamonica-web` (test errato) — eliminato
- Cloudflare Workers `santaweb` (test errato) — eliminato
- `wrangler.toml` residuo PR #2 — verificato/rimosso

### 5.5 File KB da rimuovere (sostituiti)

Da rimuovere dalla Knowledge Base Claude (storico resta in Git):
- `HANDOVER_Santamonica_Web_v2026.05.16.01.md` → sostituito da questo
- `CHANGELOG_Santamonica_Web_v2026.05.14.01.md` → sostituito da v 2026.05.17.01
- `ROADMAP_Santamonica_Web_v2026.05.15.06.md` → sostituito da v 2026.05.17.01

---

**Fine handover · v 2026.05.17.01**
